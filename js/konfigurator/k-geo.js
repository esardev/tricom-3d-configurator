/* ==========================================================================
   TRICOM konfigurator — k-geo.js
   Geometry builders: true sheet cross-sections, roof skin clipped to a roof
   plane polygon, straight sweeps (gutters, flashings) and pipe runs.
   Units are metres.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var G = TK.geo = {};
  var V3 = THREE.Vector3;

  /* ---- cross-section of ONE sheet: [{x, h}] from the left edge to the
     right edge, starting and ending on a rib (the overlap rib). Used both
     for the 3D skin and for the SVG drawings in the panel. --------------- */
  G.profilePoints = function (p) {
    var pts = [], i, k;
    if (p.tile) {
      var W = p.total, step = 0.011, n = Math.round(W / step);
      for (i = 0; i <= n; i++) {
        var x = i * W / n, d = ((x - 0.04) % p.pitch + p.pitch) % p.pitch;
        if (d > p.pitch / 2) d -= p.pitch;
        var roll = Math.abs(d) < 0.05 ? Math.pow(Math.cos(d / 0.05 * Math.PI / 2), 1.5) : 0;
        var pan = Math.abs(d) >= 0.05 ? -0.0035 * Math.sin((Math.abs(d) - 0.05) / (p.pitch / 2 - 0.05) * Math.PI / 2) : 0;
        pts.push({ x: x, h: roll * p.h + pan + 0.0035 });
      }
      return pts;
    }
    for (i = 0; i <= p.ribs; i++) {
      var x0 = i * p.pitch;
      pts.push({ x: x0, h: 0 });
      pts.push({ x: x0 + p.web, h: p.h });
      if (p.crownGroove) {
        var cm = x0 + p.web + p.crown / 2;
        pts.push({ x: cm - 0.007, h: p.h }); pts.push({ x: cm - 0.003, h: p.h - 0.004 });
        pts.push({ x: cm + 0.003, h: p.h - 0.004 }); pts.push({ x: cm + 0.007, h: p.h });
      }
      pts.push({ x: x0 + p.web + p.crown, h: p.h });
      pts.push({ x: x0 + 2 * p.web + p.crown, h: 0 });
      if (i < p.ribs && p.stiff) {
        var xa = x0 + 2 * p.web + p.crown, xb = x0 + p.pitch;
        for (k = 0; k < p.stiff; k++) {
          var c = xa + (k + 1) / (p.stiff + 1) * (xb - xa);
          pts.push({ x: c - 0.011, h: 0 }); pts.push({ x: c - 0.005, h: 0.0035 });
          pts.push({ x: c + 0.005, h: 0.0035 }); pts.push({ x: c + 0.011, h: 0 });
        }
      }
    }
    return pts;
  };

  /* ---- polygon helpers (2D, [u, v]) -------------------------------------- */
  // v-interval of the polygon on the vertical line u (polygon must be u-monotone)
  G.spanAt = function (poly, u) {
    var lo = Infinity, hi = -Infinity, n = poly.length, eps = 1e-7;
    for (var i = 0; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n];
      var u0 = Math.min(a[0], b[0]), u1 = Math.max(a[0], b[0]);
      if (u < u0 - eps || u > u1 + eps) continue;
      if (u1 - u0 < eps) { lo = Math.min(lo, a[1], b[1]); hi = Math.max(hi, a[1], b[1]); continue; }
      var t = (u - a[0]) / (b[0] - a[0]); t = t < 0 ? 0 : t > 1 ? 1 : t;
      var v = a[1] + (b[1] - a[1]) * t;
      if (v < lo) lo = v; if (v > hi) hi = v;
    }
    return hi < lo ? null : [lo, hi];
  };
  // u-intervals of the polygon on the horizontal line v
  G.rowsAt = function (poly, v) {
    var xs = [], n = poly.length;
    for (var i = 0; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n];
      if ((a[1] <= v && b[1] > v) || (b[1] <= v && a[1] > v)) xs.push(a[0] + (b[0] - a[0]) * (v - a[1]) / (b[1] - a[1]));
    }
    xs.sort(function (p, q) { return p - q; });
    var out = [];
    for (i = 0; i + 1 < xs.length; i += 2) out.push([xs[i], xs[i + 1]]);
    return out;
  };
  G.polyArea = function (poly) {
    var a = 0;
    for (var i = 0, n = poly.length; i < n; i++) { var p = poly[i], q = poly[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; }
    return Math.abs(a) / 2;
  };

  /* ---- roof plane ---------------------------------------------------------
     eave: a point on the eave line (sheet end), inward: horizontal unit vector
     from the eave towards the ridge. Local frame: u along the eave, v up the
     slope, n the outward normal.                                            */
  G.plane = function (eave, inward, pitchRad) {
    var up = new V3(0, 1, 0);
    var ux = new V3().crossVectors(inward, up).normalize();
    var vy = inward.clone().multiplyScalar(Math.cos(pitchRad)).addScaledVector(up, Math.sin(pitchRad));
    var n = new V3().crossVectors(ux, vy).normalize();
    var pl = { o: eave.clone(), ux: ux, vy: vy, n: n, pitch: pitchRad, inward: inward.clone(), poly: null };
    pl.at = function (u, v, h) {
      var p = pl.o.clone().addScaledVector(ux, u).addScaledVector(vy, v);
      return h ? p.addScaledVector(n, h) : p;
    };
    return pl;
  };

  /* ---- roof skin: profiled sheets laid side by side, clipped to the plane
     polygon(s). A plane may carry several polygons (pl.polys) — e.g. around a
     dormer — which share one sheet grid anchored at pl.anchor, so ribs line
     up across them. Returns { geo, sheets: [lengths], screws: [[u, v, h]] }.
     Vertex colour carries two per-sheet values: r = tint, g = roughness factor.
     screwStep > 0 also collects a screw position every screwStep metres along
     every rib crest (tile sheet: in the trough below every second step).   */
  G.skin = function (pl, prof, seed, screwStep) {
    var polys = pl.polys || [pl.poly], base = G.profilePoints(prof);
    var pos = [], uv = [], col = [], idx = [], ext = {}, scr = [];
    var tile = !!prof.tile, m = prof.module || 1, step = prof.step || 0;
    var anchor = pl.anchor;
    if (anchor === undefined) { anchor = Infinity; polys.forEach(function (po) { po.forEach(function (q) { anchor = Math.min(anchor, q[0]); }); }); }

    function same(a, b) { return Math.abs(pos[a * 3] - pos[b * 3]) + Math.abs(pos[a * 3 + 1] - pos[b * 3 + 1]) + Math.abs(pos[a * 3 + 2] - pos[b * 3 + 2]) < 1e-6; }
    function mix(p, q, u) { var t = (u - p.u) / (q.u - p.u); return { u: u, h: p.h + (q.h - p.h) * t, xl: p.xl + (q.xl - p.xl) * t }; }

    polys.forEach(function (poly, pi) {
      var uMin = Infinity, uMax = -Infinity, vTop = -Infinity, vBot = Infinity, i, j;
      poly.forEach(function (q) { uMin = Math.min(uMin, q[0]); uMax = Math.max(uMax, q[0]); vTop = Math.max(vTop, q[1]); vBot = Math.min(vBot, q[1]); });
      var k0 = Math.max(0, Math.floor((uMin - anchor - prof.total) / prof.useful) + 1);
      for (var k = k0; anchor + k * prof.useful < uMax - 1e-4; k++) {
        var s0 = anchor + k * prof.useful, rk = TK.tex.rng((seed || 1) * 977 + k * 31 + 5);
        var tilt = Math.tan((0.2 + (rk() - 0.5) * 0.08) * Math.PI / 180), tint = 0.92 + rk() * 0.16, rough = 0.84 + rk() * 0.32;
        // profile columns clipped to [uMin, uMax]
        var raw = base.map(function (b) { return { u: s0 + b.x, h: b.h, xl: b.x }; }), cols = [];
        for (i = 0; i < raw.length; i++) {
          var c = raw[i];
          if (c.u < uMin - 1e-6) { if (i + 1 < raw.length && raw[i + 1].u > uMin + 1e-6) cols.push(mix(c, raw[i + 1], uMin)); continue; }
          if (c.u > uMax + 1e-6) { if (i > 0 && raw[i - 1].u < uMax - 1e-6) cols.push(mix(raw[i - 1], c, uMax)); break; }
          cols.push(c);
        }
        if (cols.length < 2) continue;
        // extra columns at polygon vertices so slanted edges are exact
        poly.forEach(function (q) {
          var u = q[0];
          if (u <= cols[0].u + 1e-5 || u >= cols[cols.length - 1].u - 1e-5) return;
          for (var ci = 0; ci < cols.length - 1; ci++) {
            if (Math.abs(cols[ci].u - u) < 1e-5) return;
            if (cols[ci].u < u && cols[ci + 1].u > u) { cols.splice(ci + 1, 0, mix(cols[ci], cols[ci + 1], u)); return; }
          }
        });
        var any = false;
        cols.forEach(function (c2) {
          c2.span = G.spanAt(poly, c2.u);
          if (c2.span && c2.span[1] - c2.span[0] > 0.01) {
            any = true;
            var ek = ext[k] || (ext[k] = {}), e = ek[pi] || (ek[pi] = [Infinity, -Infinity]);
            e[0] = Math.min(e[0], c2.span[0]); e[1] = Math.max(e[1], c2.span[1]);
          }
          c2.off = (c2.xl - prof.total / 2) * tilt + 0.002;
        });
        if (!any) continue;
        if (screwStep) {
          for (var ri = 0; ri < prof.ribs; ri++) {           // the overlap rib belongs to the next sheet
            var xl = tile ? 0.04 + (ri + 0.5) * prof.pitch : ri * prof.pitch + prof.web + prof.crown / 2, us = s0 + xl;
            if (us < uMin + 0.03 || us > uMax - 0.03) continue;
            var ss = G.spanAt(poly, us);
            if (!ss || ss[1] - ss[0] < 0.25) continue;
            var so = (xl - prof.total / 2) * tilt + 0.002, sv;
            if (tile) {
              for (var sm = Math.ceil((ss[0] - 0.02) / m); sm * m + 0.04 < ss[1] - 0.05; sm++) {
                if ((sm + ri) % 2 || sm * m + 0.04 < ss[0] + 0.03) continue;
                scr.push([us, sm * m + 0.04, 0.002 + so + step * (1 - 0.04 / m)]);
              }
            } else for (sv = ss[0] + 0.09; sv < ss[1] - 0.04; sv += screwStep) scr.push([us, sv, prof.h + so]);
          }
        }

        // rows: [module index, isTop]; a plain trapezoidal sheet is a single module
        var rows = [];
        // tile sheet: each module is a slope strip; the pressed step (riser) gets its own duplicated rows so
        // its edge stays crisp under smooth normals (strip->riser transitions are zero-area and skipped below)
        if (tile) { for (var mi = Math.floor(vBot / m); mi * m < vTop; mi++) { rows.push([mi, 0]); rows.push([mi, 1]); rows.push([mi, 1]); rows.push([mi + 1, 0]); } }
        else rows = [[0, 0], [0, 1]];

        var baseIndex = pos.length / 3, nr = rows.length;
        for (i = 0; i < cols.length; i++) {
          var cc = cols[i], sp = cc.span || [0, 0];
          for (j = 0; j < nr; j++) {
            var v, hs = 0;
            if (tile) {
              var vb = rows[j][0] * m;
              v = Math.min(Math.max(vb + rows[j][1] * m, sp[0]), sp[1]);
              hs = step * (1 - Math.min(Math.max((v - vb) / m, 0), 1));
            } else v = sp[rows[j][1]];
            var P = pl.at(cc.u, v, cc.h + cc.off + hs);
            pos.push(P.x, P.y, P.z); uv.push(cc.u, v); col.push(tint, rough, 1);
          }
        }
        for (i = 0; i < cols.length - 1; i++) {
          if (!cols[i].span || !cols[i + 1].span) continue;
          for (j = 0; j < nr - 1; j++) {
            var a = baseIndex + i * nr + j, b = baseIndex + (i + 1) * nr + j, c3 = b + 1, d = a + 1;
            if (same(a, d) && same(b, c3)) continue;      // collapsed by clamping
            idx.push(a, b, c3, a, c3, d);
          }
        }
      }
    });

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    if (!tile) { var ni = g.toNonIndexed(); g.dispose(); g = ni; }   // crisp folds on trapezoidal sheet
    g.computeVertexNormals();
    // one column can be several pieces (a dormer cuts it): union of the polygons' v-intervals per column
    var sheets = [];
    Object.keys(ext).forEach(function (k) {
      var iv = Object.keys(ext[k]).map(function (pi) { return ext[k][pi].slice(); }).sort(function (a, b) { return a[0] - b[0]; }), cur = null;
      iv.forEach(function (q) { if (cur && q[0] <= cur[1] + 0.02) cur[1] = Math.max(cur[1], q[1]); else { if (cur) sheets.push(cur[1] - cur[0]); cur = q; } });
      if (cur) sheets.push(cur[1] - cur[0]);
    });
    return { geo: g, sheets: sheets, screws: scr };
  };

  /* ---- roof deck under the sheets: the polygon extruded down the normal.
     Its edges read as fascia / verge boards, the underside as the soffit.   */
  G.slab = function (pl, poly, top, thick) {
    var tri = THREE.ShapeUtils.triangulateShape(poly.map(function (q) { return new THREE.Vector2(q[0], q[1]); }), []);
    var pos = [], n = poly.length, i;
    function P(q, d) { return pl.at(q[0], q[1], -d); }
    function push(a, b, c) { pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z); }
    tri.forEach(function (t) {
      push(P(poly[t[0]], top), P(poly[t[1]], top), P(poly[t[2]], top));
      push(P(poly[t[0]], top + thick), P(poly[t[2]], top + thick), P(poly[t[1]], top + thick));
    });
    for (i = 0; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n];
      push(P(a, top), P(a, top + thick), P(b, top + thick));
      push(P(a, top), P(b, top + thick), P(b, top));
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  };

  /* ---- sweep a 2D section [[s, h], ...] through stations (Vector3[]).
     side/up span the section plane. shearA/shearB shift a point along the
     run by k*s — a 45° mitre for corners (k = +1 outer, -1 inner).          */
  G.sweep = function (stations, section, side, up, o) {
    o = o || {};
    var pos = [], uv = [], idx = [], ns = section.length, i, j;
    var dir = stations[stations.length - 1].clone().sub(stations[0]).normalize();
    var acc = [0];
    for (j = 1; j < ns; j++) acc.push(acc[j - 1] + Math.hypot(section[j][0] - section[j - 1][0], section[j][1] - section[j - 1][1]));
    var dist = 0;
    for (i = 0; i < stations.length; i++) {
      if (i) dist += stations[i].distanceTo(stations[i - 1]);
      var sh = i === 0 ? -(o.shearA || 0) : i === stations.length - 1 ? (o.shearB || 0) : 0;
      for (j = 0; j < ns; j++) {
        var p = stations[i].clone().addScaledVector(side, section[j][0]).addScaledVector(up, section[j][1]);
        if (sh) p.addScaledVector(dir, sh * section[j][0]);
        pos.push(p.x, p.y, p.z); uv.push(dist, acc[j]);
      }
    }
    var lim = o.closed ? ns : ns - 1;
    for (i = 0; i < stations.length - 1; i++) for (j = 0; j < lim; j++) {
      var a = i * ns + j, b = i * ns + (j + 1) % ns, c = (i + 1) * ns + (j + 1) % ns, d = (i + 1) * ns + j;
      idx.push(a, d, c, a, c, b);
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    if (!o.smooth) { var ni = g.toNonIndexed(); g.dispose(); g = ni; }
    g.computeVertexNormals();
    return g;
  };

  // flat cap closing a section at point P (fan around the section centroid)
  G.cap = function (P, section, side, up) {
    var cx = 0, cy = 0, pos = [], n = section.length, i;
    section.forEach(function (q) { cx += q[0] / n; cy += q[1] / n; });
    function pt(s, h) { return P.clone().addScaledVector(side, s).addScaledVector(up, h); }
    var c = pt(cx, cy);
    for (i = 0; i < n - 1; i++) {
      var a = pt(section[i][0], section[i][1]), b = pt(section[i + 1][0], section[i + 1][1]);
      pos.push(c.x, c.y, c.z, a.x, a.y, a.z, b.x, b.y, b.z);
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
    g.computeVertexNormals();
    return g;
  };

  /* ---- gutter sections: origin = top of the back edge, s outward, h up ---- */
  G.gutterSection = function (def) {
    var s = [], r = def.size / 2, i;
    if (def.shape === 'round') {
      s.push([0, 0.014]);
      for (i = 0; i <= 16; i++) { var a = Math.PI + i / 16 * Math.PI; s.push([r + r * Math.cos(a), r * Math.sin(a)]); }
      for (i = 1; i <= 7; i++) { var b = Math.PI - i / 7 * Math.PI * 1.6; s.push([2 * r + 0.008 + 0.008 * Math.cos(b), 0.008 * Math.sin(b)]); }   // front bead
    } else {
      var h = def.size * 0.72;
      s = [[0, 0.014], [0, -h], [def.size, -h], [def.size, 0], [def.size - 0.012, 0], [def.size - 0.012, -0.008]];
    }
    return s;
  };
  G.gutterDepth = function (def) { return def.shape === 'round' ? def.size / 2 : def.size * 0.72; };

  // hook strap in local space: x along the gutter, y up, z outward
  G.hook = function (def) {
    var sec = [], r = def.size / 2, i, t = 0.004;
    if (def.shape === 'round') {
      sec.push([-0.06, 0.03]); sec.push([-t, 0.016]);
      for (i = 0; i <= 12; i++) { var a = Math.PI + i / 12 * Math.PI; sec.push([r + (r + t) * Math.cos(a), (r + t) * Math.sin(a)]); }
      sec.push([2 * r + t, 0.012]); sec.push([2 * r - 0.008, 0.016]);
    } else {
      var h = def.size * 0.72;
      sec = [[-0.06, 0.03], [-t, 0.016], [-t, -h - t], [def.size + t, -h - t], [def.size + t, 0.008], [def.size - 0.014, 0.008]];
    }
    return G.sweep([new V3(-0.013, 0, 0), new V3(0.013, 0, 0)], sec, new V3(0, 0, 1), new V3(0, 1, 0));
  };

  /* ---- pipe along a polyline lying in one vertical plane. `bin` is the
     constant binormal (the eave direction). Corners are rounded (elbows).  */
  G.pipe = function (pts, def, bin) {
    var r = def.size / 2, path = [], i, j, R = def.size * 0.9;
    for (i = 0; i < pts.length; i++) {
      if (i === 0 || i === pts.length - 1) { path.push(pts[i].clone()); continue; }
      var a = pts[i - 1], b = pts[i], c = pts[i + 1];
      var d1 = b.clone().sub(a), d2 = c.clone().sub(b), l1 = d1.length(), l2 = d2.length();
      var cut = Math.min(R, l1 * 0.45, l2 * 0.45);
      var p0 = b.clone().addScaledVector(d1.normalize(), -cut), p2 = b.clone().addScaledVector(d2.normalize(), cut);
      for (j = 0; j <= 6; j++) {         // quadratic Bézier elbow
        var t = j / 6, q = p0.clone().multiplyScalar((1 - t) * (1 - t)).addScaledVector(b, 2 * t * (1 - t)).addScaledVector(p2, t * t);
        path.push(q);
      }
    }
    var ring = [];
    if (def.shape === 'round') for (i = 0; i < 16; i++) { var an = i / 16 * Math.PI * 2; ring.push([Math.cos(an) * r, Math.sin(an) * r]); }
    else ring = [[-r, -r], [r, -r], [r, -r], [r, r], [r, r], [-r, r], [-r, r], [-r, -r]];   // doubled corners = hard edges
    var pos = [], idx = [], nr = ring.length, len = 0;
    for (i = 0; i < path.length; i++) {
      var tan = (i === 0 ? path[1].clone().sub(path[0]) : i === path.length - 1 ? path[i].clone().sub(path[i - 1]) : path[i + 1].clone().sub(path[i - 1])).normalize();
      var nor = new V3().crossVectors(tan, bin).normalize();
      if (i) len += path[i].distanceTo(path[i - 1]);
      for (j = 0; j < nr; j++) {
        var p = path[i].clone().addScaledVector(nor, ring[j][0]).addScaledVector(bin, ring[j][1]);
        pos.push(p.x, p.y, p.z);
      }
    }
    for (i = 0; i < path.length - 1; i++) for (j = 0; j < nr; j++) {
      if (def.shape !== 'round' && j % 2 === 1) continue;      // skip the zero-width quads between doubled corners
      var a2 = i * nr + j, b2 = i * nr + (j + 1) % nr, c2 = (i + 1) * nr + (j + 1) % nr, d = (i + 1) * nr + j;
      idx.push(a2, b2, c2, a2, c2, d);
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return { geo: g, length: len };
  };

  /* ---- roofing screw: hex head on an EPDM washer. Local y is the roof normal.
     Vertex colours: dark washer, bright head.                                */
  G.screw = function (simple) {
    var parts = [], cols = [];
    function add(g, c) { g = g.toNonIndexed(); parts.push(g); for (var i = 0; i < g.attributes.position.count; i++) cols.push(c, c, c); }
    var washer = new THREE.CylinderGeometry(0.0075, 0.0082, 0.0026, simple ? 6 : 10, 1); washer.translate(0, 0.0013, 0);
    var head = new THREE.CylinderGeometry(0.0046, 0.0046, 0.0042, 6, 1); head.translate(0, 0.0047, 0);
    add(washer, 0.06); add(head, 0.92);
    var g = THREE.BufferGeometryUtils.mergeBufferGeometries(parts, false);
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    parts.forEach(function (p) { p.dispose(); });
    return g;
  };

  /* ---- snow blanket on one roof plane. Depth is larger on the lower third,
     tapers to nothing at the polygon edge, piles up against the snow guard
     (guardV) and lets the ribs show through as soft waves.
     Attributes: uv = (u, v) on the plane, slide = the plane's up-slope vector
     (the vertex shader moves the blanket down the slope when it slides).    */
  G.snow = function (pl, prof, o) {
    var polys = pl.polys || [pl.polySlab || pl.poly], pos = [], uv = [], sl = [], idx = [], base = G.profilePoints(prof);
    var ribH = prof.h + (prof.step || 0), du = 0.09, dv = 0.22, rnd = TK.tex.rng(o.seed || 3);
    var phase = rnd() * 6.28, phase2 = rnd() * 6.28, anchor = pl.anchor;
    if (anchor === undefined) { anchor = Infinity; polys.forEach(function (po) { po.forEach(function (q) { anchor = Math.min(anchor, q[0]); }); }); }
    function ribAt(u) {                  // sheet height at u (ribs repeat with the pitch)
      var x = ((u - anchor) % prof.pitch + prof.pitch) % prof.pitch;
      for (var i = 1; i < base.length; i++) if (base[i].x >= x) { var a = base[i - 1], b = base[i]; return a.h + (b.h - a.h) * (b.x > a.x ? (x - a.x) / (b.x - a.x) : 0); }
      return 0;
    }
    polys.forEach(function (poly) {
      var uMin = Infinity, uMax = -Infinity, vMax = -Infinity;
      poly.forEach(function (q) { uMin = Math.min(uMin, q[0]); uMax = Math.max(uMax, q[0]); vMax = Math.max(vMax, q[1]); });
      var nu = Math.max(2, Math.round((uMax - uMin) / du)), colsN = [], i, j;
      for (i = 0; i <= nu; i++) {
        var u = uMin + (uMax - uMin) * i / nu, sp = G.spanAt(poly, Math.min(uMax - 1e-4, Math.max(uMin + 1e-4, u)));
        if (!sp || sp[1] - sp[0] < 0.02) { colsN.push(null); continue; }
        var nv = Math.max(2, Math.round((sp[1] - sp[0]) / dv)), start = pos.length / 3;
        for (j = 0; j <= nv; j++) {
          var v = sp[0] + (sp[1] - sp[0]) * j / nv;
          var edge = Math.min(v - sp[0] + 0.03, sp[1] - v, u - uMin, uMax - u), tap = Math.min(1, Math.max(0, edge / 0.16)); tap = tap * tap * (3 - 2 * tap);
          var low = 1 - Math.min(1, Math.max(0, (v - o.S * 0.3) / (o.S * 0.35)));
          var d = o.depth * (0.42 + 0.58 * low) + 0.012 * Math.sin(u * 1.7 + phase) * Math.sin(v * 2.3 + phase2) + 0.006 * Math.sin(u * 5.1 + v * 3.7);
          if (o.guardV) d = v > o.guardV ? d + o.depth * 0.55 * Math.exp(-(v - o.guardV) / 0.45) : d * 0.4;
          d = Math.max(0.004, d * tap + 0.004);
          var h = ribH * 0.75 + d + (ribAt(u) - prof.h * 0.5) * 0.28 * tap, P = pl.at(u, v, h);
          pos.push(P.x, P.y, P.z); uv.push(u, v); sl.push(pl.vy.x, pl.vy.y, pl.vy.z);
        }
        colsN.push([start, nv]);
      }
      for (i = 0; i < nu; i++) {
        var A = colsN[i], B = colsN[i + 1];
        if (!A || !B) continue;
        var n = Math.max(A[1], B[1]);
        for (j = 0; j < n; j++) {          // columns may differ in row count along a hip: fan the remainder
          var a0 = A[0] + Math.min(j, A[1]), a1 = A[0] + Math.min(j + 1, A[1]), b0 = B[0] + Math.min(j, B[1]), b1 = B[0] + Math.min(j + 1, B[1]);
          if (a0 !== a1) idx.push(a0, b0, a1);
          if (b0 !== b1) idx.push(a1, b0, b1);
        }
      }
    });
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('slide', new THREE.Float32BufferAttribute(sl, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };

  /* ---- screen-space lines with a constant pixel width (dimension lines, part
     outlines). segs: flat array of Vector3 pairs.                           */
  G.fatLines = function (segs) {
    var pos = [], oth = [], side = [], idx = [], n = 0;
    for (var i = 0; i + 1 < segs.length; i += 2) {
      var a = segs[i], b = segs[i + 1];
      pos.push(a.x, a.y, a.z, a.x, a.y, a.z, b.x, b.y, b.z, b.x, b.y, b.z);
      oth.push(b.x, b.y, b.z, b.x, b.y, b.z, a.x, a.y, a.z, a.x, a.y, a.z);
      side.push(1, -1, -1, 1);
      idx.push(n, n + 1, n + 2, n + 2, n + 1, n + 3); n += 4;
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('other', new THREE.Float32BufferAttribute(oth, 3));
    g.setAttribute('side', new THREE.Float32BufferAttribute(side, 1));
    g.setIndex(idx);
    return g;
  };
  G.lineMaterial = function (color, px, o) {
    o = o || {};
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uWidth: { value: px }, uRes: { value: G.res }, uAlpha: { value: o.alpha === undefined ? 1 : o.alpha }, uBias: { value: o.bias || 0 } },
      vertexShader: [
        'attribute vec3 other; attribute float side; uniform vec2 uRes; uniform float uWidth; uniform float uBias;',
        'void main(){',
        '  vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '  vec4 b = projectionMatrix * modelViewMatrix * vec4(other, 1.0);',
        '  vec2 d = (b.xy / max(b.w, 1e-4) - a.xy / max(a.w, 1e-4)) * uRes;',
        '  d = length(d) > 1e-5 ? normalize(d) : vec2(1.0, 0.0);',
        '  a.xy += vec2(-d.y, d.x) * side * uWidth / uRes * a.w;',
        '  a.z -= uBias * a.w;',
        '  gl_Position = a;',
        '}'].join('\n'),
      fragmentShader: 'uniform vec3 uColor; uniform float uAlpha; void main(){ gl_FragColor = vec4(uColor, uAlpha);\n#include <encodings_fragment>\n}',
      transparent: true, depthWrite: false, depthTest: o.depthTest !== false, side: THREE.DoubleSide, toneMapped: false
    });
  };
  G.res = new THREE.Vector2(1, 1);          // drawing-buffer size in CSS px, kept current by the app

  /* ---- merge helper: normalises attributes so anything can be merged ------ */
  G.merge = function (list, keepColor) {
    var out = [];
    list.forEach(function (g) {
      if (!g) return;
      if (g.index) { var ni = g.toNonIndexed(); g.dispose(); g = ni; }
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      Object.keys(g.attributes).forEach(function (k) {
        if (k !== 'position' && k !== 'normal' && k !== 'uv' && !(keepColor && k === 'color')) g.deleteAttribute(k);
      });
      out.push(g);
    });
    if (!out.length) return null;
    var m = THREE.BufferGeometryUtils.mergeBufferGeometries(out, false);
    out.forEach(function (g) { g.dispose(); });
    return m;
  };

  // axis-aligned box given min/max corners
  G.box = function (x0, y0, z0, x1, y1, z1) {
    var g = new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0));
    g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return g;
  };
})();
