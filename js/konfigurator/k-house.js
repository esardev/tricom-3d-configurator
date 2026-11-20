/* ==========================================================================
   TRICOM konfigurator — k-house.js
   Builds the whole building from parameters: walls with openings, roof planes
   with real sheet geometry, the tinsmith detail kit, gutters and downpipes.
   One code path serves all seven object types; a type only declares its walls,
   roof planes and the lines (ridges, hips, valleys, verges, eaves) on them.
   Dimensions (length, width, pitch, overhangs, eave height of a hall) come
   from the state, clamped to the ranges in k-data.js. Counts that follow a
   rule (downpipes, hooks, clamps, snow-guard rows) use the constants in
   js/catalog.js, so the model and the specification always agree.
   Also returns quantities measured from the very geometry that is drawn.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var H = TK.house = {};
  var G = TK.geo, D = TK.data, V3 = THREE.Vector3;
  var UP = new V3(0, 1, 0);
  var TW = 0.30;          // wall thickness
  var GH = 3.0;           // ground storey wall height
  var FL = 0.12;          // finished floor level (= terrace top + threshold)
  var TER = 0.10;         // terrace slab top
  var PAR = 0.8;          // parapet height of a hall above the roof edge
  function rad(d) { return d * Math.PI / 180; }
  function v(x, y, z) { return new V3(x, y, z); }
  function r1(x, s) { return Math.round(x / s) * s; }

  /* ---- dimensions of a state, clamped to the ranges of its object type ---- */
  H.dims = function (s) {
    var hd = D.find(D.houses, s.kuca) || D.houses[0], d = hd.dims;
    function pick(key, sk, step) {
      var r = d[key]; if (!r) return 0;
      var x = s[sk]; x = x === null || x === undefined || x === '' || isNaN(+x) ? r[0] : +x;
      return +Math.min(r[2], Math.max(r[1], r1(x, step))).toFixed(2);
    }
    var o = { L: pick('L', 'duz', 0.1), W: pick('W', 'sir', 0.1), p: pick('p', 'nagib', 1), oe: pick('oe', 'prep', 0.05), og: pick('og', 'zab', 0.05), hv: pick('hv', 'hv', 0.1) };
    if ((s.kuca === 'cetvorovodni' || s.kuca === 'bungalov') && o.W > o.L) o.W = o.L;          // a hip roof needs W ≤ L
    o.def = hd;
    return o;
  };

  // which flashing details exist on which object type (s: the state, for options of a hall)
  H.applies = function (id, kuca, s) {
    var hips = kuca === 'cetvorovodni' || kuca === 'bungalov', hpar = kuca === 'hala' && !!(s && +s.hpar);
    switch (id) {
      case 'vetar': return !hips && kuca !== 'ravan' && !hpar;
      case 'snego': return kuca !== 'ravan';
      case 'opsivka': case 'iksna': case 'kapa': return kuca !== 'ravan' && kuca !== 'hala';
      case 'uvala': return kuca === 'lkrov';
      case 'parapet': return kuca === 'ravan' || hpar;
      default: return true;
    }
  };

  // dormer fits only from a certain pitch and width (its window must stay under its roof)
  H.dormer = function (s) {
    var d = H.dims(s), p5 = rad(d.p), tp5 = Math.tan(p5), pd = rad(10), tpd = Math.tan(pd), Hp5 = 4.2;
    var dMeet = 0.82 * d.W / 2, yD = Hp5 + 0.35 * tpd + dMeet * (tp5 - tpd), yR5 = Hp5 + d.W / 2 * tp5;
    var ok = s.kuca === 'dvovodni' && yD >= 6.1 && yD < yR5 - 0.15;
    return { ok: ok, on: ok && +s.badza !== 0, yD: yD, dMeet: dMeet };
  };

  // snow-guard rows a roof plane gets by the rule in catalog.js (or the override in the state)
  H.snowRows = function (s, deg, slope) {
    var R = D.rules;
    if (deg < R.snowMinDeg - 1e-6) return 0;
    if (s.sneg !== undefined && s.sneg !== 'auto' && !isNaN(+s.sneg)) return Math.max(0, Math.min(4, +s.sneg));
    var band = R.snowRowEvery.filter(function (b) { return deg <= b.maxDeg + 1e-6; })[0] || R.snowRowEvery[R.snowRowEvery.length - 1];
    return Math.max(1, Math.ceil(slope / band.every - 1e-6));
  };

  /* ---- cross-sections of the bent trims, [s, h] in metres. The very same arrays are swept into
     the 3D parts and drawn (with dimensions) in the detail inspector.                          */
  H.sections = function (state, pitch) {
    var prof = D.find(D.profiles, state.krov) || D.profiles[2], ribH = prof.h + (prof.step || 0);
    var ta = Math.tan(pitch), ca = Math.cos(pitch), lift = (ribH + 0.006) / ca, w = 0.15 * ca, sec = [], i;
    function hAt(s) { return lift - Math.abs(s) * ta; }
    if (state.sleme === 'polu') {
      var r = 0.085;
      sec.push([-w - 0.02, hAt(w + 0.02)]); sec.push([-r, hAt(r)]);
      for (i = 1; i < 12; i++) { var an = Math.PI - i / 12 * Math.PI; sec.push([r * Math.cos(an), hAt(r) + r * Math.sin(an) * 0.9]); }
      sec.push([r, hAt(r)]); sec.push([w + 0.02, hAt(w + 0.02)]);
    } else {
      sec = [[-w - 0.004, hAt(w) - 0.016], [-w, hAt(w)], [-0.026, hAt(0.026)], [-0.013, hAt(0.026) + 0.014], [0.013, hAt(0.026) + 0.014], [0.026, hAt(0.026)], [w, hAt(w)], [w + 0.004, hAt(w) - 0.016]];
    }
    var tv = Math.tan(Math.atan(ta / Math.SQRT2));
    return {
      ribH: ribH, lift: lift, w: w, hAt: hAt,
      sleme: sec,
      vetar: [[-0.11, ribH - 0.008], [-0.11, ribH + 0.005], [0.016, ribH + 0.005], [0.016, -0.165], [0.03, -0.182]],
      okapnica: [[-0.15, 0.001], [-0.05, 0.001], [-0.046, -0.004], [-0.044, -0.062], [-0.03, -0.078]],
      uvala: [[-0.27, 0.27 * tv + 0.012], [-0.25, 0.25 * tv + 0.004], [-0.012, 0.012 * tv + 0.004], [0, 0.002], [0.012, 0.012 * tv + 0.004], [0.25, 0.25 * tv + 0.004], [0.27, 0.27 * tv + 0.012]],
      parapet: [[0.047, -0.075], [0.03, -0.055], [0.03, 0.014], [-TW - 0.03, 0.004], [-TW - 0.03, -0.055], [-TW - 0.047, -0.075]],
      solbank: [[-0.15, 0.012], [0.035, -0.008], [0.035, -0.032]],
      opsivka: [[0, 0.15], [0, 0], [0.2 * ca, -0.2 * Math.sin(pitch)]],
      iksna: [[-0.025, 0.025], [0, 0], [0.14, 0], [0.14, 0.15]],
      kapa: [[-0.41, 0], [0, 0.17], [0.41, 0]],
      snego: [[-0.09, 0], [0.11, 0], [0.03, 0.15], [-0.03, 0.15], [-0.09, 0]]
    };
  };

  /* opt.mats: material set to use (default: the first one); opt.lite: neighbour house — no screws,
     weathering, dimension data or weather anchors; opt.screwLod: draw every n-th screw.          */
  H.build = function (state, opt) {
    opt = opt || {};
    var MS = opt.mats || TK.mat.set0, lite = !!opt.lite, R = D.rules;
    var prof = D.find(D.profiles, state.krov) || D.profiles[2];
    var gdef = D.find(D.gutters, state.oluk) || D.gutters[0];
    var pdef = D.find(D.pipes, state.cev) || D.pipes[1];
    var dim = H.dims(state);
    var on = {};
    D.details.forEach(function (d) { on[d.id] = state.detalji.indexOf(d.id) >= 0 && H.applies(d.id, state.kuca, state); });
    var ribH = prof.h + (prof.step || 0);          // highest point of the sheet above its base plane

    var bk = {};                                   // geometry buckets by material role
    function B(name, g) { if (g) (bk[name] || (bk[name] = [])).push(g); return g; }
    var inst = { hook: [], bracket: [], snow: [], screw: [] };
    var FXD = { gutters: [], outlets: [], eaves: [], sills: [], planes: [], chimney: null };
    var S = { planes: [], ridges: [], hips: [], valleys: [], verges: [], tops: [], eaves: [], parapets: [], walls: [], skins: [], chimney: null, terrace: null, anchors: {}, dims: {} };
    var qty = { area: 0, sheets: [], ridge: 0, hip: 0, valley: 0, verge: 0, eave: 0, gutter: 0, hooks: 0, pipes: 0, pipeLen: 0, brackets: 0, snow: 0, snowRows: 0, coping: 0, sills: 0, chimney: 0, caps: 0, corners: 0, screws: 0, snowBrackets: 0, plan: 0,
      planes: [], eaveList: [], walls: [] };

    /* ================= walls and openings ================================= */
    function Wall(P, nrm, len) {
      var dir = new V3().crossVectors(UP, nrm).normalize();
      var w = { P: P, nrm: nrm, dir: dir, len: len, ops: [] };
      w.m0 = new THREE.Matrix4().makeBasis(dir, UP, nrm).setPosition(P);
      w.mIn = new THREE.Matrix4().makeBasis(dir, UP, nrm).setPosition(P.clone().addScaledVector(nrm, -TW));
      w.pt = function (x, y, out) { return P.clone().addScaledVector(dir, x).addScaledVector(UP, y).addScaledVector(nrm, out || 0); };
      S.walls.push(w);
      return w;
    }
    function rectWalls(x0, x1, z0, z1) {
      return {
        front: Wall(v(x0, 0, z1), v(0, 0, 1), x1 - x0), back: Wall(v(x1, 0, z0), v(0, 0, -1), x1 - x0),
        left: Wall(v(x0, 0, z0), v(-1, 0, 0), z1 - z0), right: Wall(v(x1, 0, z1), v(1, 0, 0), z1 - z0)
      };
    }
    function local(w, g) { g.applyMatrix4(w.m0); return g; }

    // opening: x centre along the wall, y bottom, kind 'win' | 'door' | 'gate' (sectional door), div = number of sashes
    function op(w, x, y, ww, hh, kind, div, curtain) {
      var o = { x: x, y: y, w: ww, h: hh, kind: kind };
      w.ops.push(o);
      var x0 = x - ww / 2, x1 = x + ww / 2, y0 = y, y1 = y + hh, zf = -0.15, fd = 0.07, fw = 0.07, i;
      B('frame', local(w, G.box(x0, y0, zf - fd, x0 + fw, y1, zf)));
      B('frame', local(w, G.box(x1 - fw, y0, zf - fd, x1, y1, zf)));
      B('frame', local(w, G.box(x0 + fw, y1 - fw, zf - fd, x1 - fw, y1, zf)));
      if (kind === 'gate') {         // sectional door: insulated panels with a shallow groove every 0.5 m
        B('frame', local(w, G.box(x0 + fw, y0, zf - 0.06, x1 - fw, y1 - fw, zf - 0.02)));
        for (var gy = y0 + 0.5; gy < y1 - fw - 0.1; gy += 0.5) B('frame', local(w, G.box(x0 + fw, gy - 0.012, zf - 0.02, x1 - fw, gy + 0.012, zf - 0.012)));
        return o;
      }
      B('frame', local(w, G.box(x0 + fw, y0, zf - fd, x1 - fw, y0 + fw, zf)));
      var n = div || 1, pw = (ww - 2 * fw) / n, sw = 0.05;
      for (i = 0; i < n; i++) {
        var a = x0 + fw + i * pw, b = a + pw, c = y0 + fw, d = y1 - fw, z0 = zf - 0.062, z1 = zf - 0.012;
        B('frame', local(w, G.box(a, c, z0, a + sw, d, z1)));
        B('frame', local(w, G.box(b - sw, c, z0, b, d, z1)));
        B('frame', local(w, G.box(a + sw, d - sw, z0, b - sw, d, z1)));
        B('frame', local(w, G.box(a + sw, c, z0, b - sw, c + sw, z1)));
        var gl = new THREE.PlaneGeometry(pw - 2 * sw, d - c - 2 * sw);
        gl.translate((a + b) / 2, (c + d) / 2, zf - 0.04);
        B('glass', local(w, gl));
      }
      if (kind === 'win' && on.solbank) {
        B('d_solbank', local(w, G.sweep([v(x0 - 0.04, 0, 0), v(x1 + 0.04, 0, 0)],
          [[-0.15, y0 + 0.012], [0.035, y0 - 0.008], [0.035, y0 - 0.032]], v(0, 0, 1), v(0, 1, 0))));
        qty.sills += ww + 0.08;
      }
      if (kind === 'win' && !lite) {
        FXD.sills.push({ a: w.pt(x0 - 0.03, y0 + 0.012, 0.03), b: w.pt(x1 + 0.03, y0 + 0.012, 0.03), nrm: w.nrm.clone(), dir: w.dir.clone() });
        B('dirtSill', local(w, quadUV(v(x0 - 0.05, y0 - 0.62, 0.004), v(x1 + 0.05, y0 - 0.62, 0.004), v(x1 + 0.05, y0 - 0.03, 0.004), v(x0 - 0.05, y0 - 0.03, 0.004))));
      }
      if (curtain) {
        var cw = Math.min(0.55, ww * 0.26), sides = ww > 1.5 ? [x0 + fw + cw / 2, x1 - fw - cw / 2] : [x0 + fw + cw / 2];
        sides.forEach(function (cx) {
          var cg = new THREE.PlaneGeometry(cw, hh - 0.16);
          var uvA = cg.attributes.uv; for (var q = 0; q < uvA.count; q++) uvA.setX(q, uvA.getX(q) * cw * 1.6);
          cg.translate(cx, y0 + hh / 2, -0.36);
          B('curtain', local(w, cg));
        });
      }
      return o;
    }

    // wall panel: polygon in wall coordinates, extruded to the wall thickness; openings inside it become holes
    function poly(w, pts, zone) {
      // end faces are pulled in 2 mm so they never lie in the plane of the perpendicular wall's face (no z-fighting at corners)
      var sh = new THREE.Shape(pts.map(function (p) { return new THREE.Vector2(p[0] <= 0 ? 0.002 : p[0] >= w.len ? w.len - 0.002 : p[0], p[1]); }));
      var bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
      pts.forEach(function (p) { bx0 = Math.min(bx0, p[0]); bx1 = Math.max(bx1, p[0]); by0 = Math.min(by0, p[1]); by1 = Math.max(by1, p[1]); });
      w.ops.forEach(function (o) {
        var cy = o.y + o.h / 2;
        if (o.x < bx0 || o.x > bx1 || cy < by0 || cy > by1) return;
        var hp = new THREE.Path();
        hp.moveTo(o.x - o.w / 2, o.y); hp.lineTo(o.x + o.w / 2, o.y); hp.lineTo(o.x + o.w / 2, o.y + o.h); hp.lineTo(o.x - o.w / 2, o.y + o.h); hp.closePath();
        sh.holes.push(hp);
      });
      var g = new THREE.ExtrudeGeometry(sh, { depth: TW, bevelEnabled: false, curveSegments: 1 });
      g.applyMatrix4(w.mIn);
      B(zone === 'z1' ? 'wall1' : zone === 'z2' ? 'wall2' : 'wall0', g);
    }
    function rect(w, x0, x1, y0, y1, zone) { poly(w, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], zone); }

    // plinth strip between doors, and the fake-AO strips under the eave and along the base
    function finish(w, o) {
      o = o || {};
      if (o.sokl !== false) {
        var cuts = w.ops.filter(function (q) { return q.y < 0.4; }).map(function (q) { return [q.x - q.w / 2, q.x + q.w / 2]; }).sort(function (a, b) { return a[0] - b[0]; });
        var x = 0;
        cuts.concat([[w.len, w.len]]).forEach(function (c) {
          if (c[0] - x > 0.02) {
            B('sokl', local(w, G.box(x - (x === 0 ? 0.012 : 0), 0, 0, c[0] + (c[0] === w.len ? 0.012 : 0), 0.32, 0.012)));
            if (!lite) B('dirtBase', local(w, quadUV(v(x, 0.32, 0.005), v(c[0], 0.32, 0.005), v(c[0], 0.9, 0.005), v(x, 0.9, 0.005), [x / 2.4, 0, c[0] / 2.4, 0, c[0] / 2.4, 1, x / 2.4, 0, c[0] / 2.4, 1, x / 2.4, 1])));
          }
          x = c[1];
        });
      }
      if (o.ao) B('ao', local(w, quadUV(v(0, o.ao - 0.55, 0.006), v(w.len, o.ao - 0.55, 0.006), v(w.len, o.ao, 0.006), v(0, o.ao, 0.006))));
      w.base = o.base !== false;
    }
    // quad with uv.v = 0 on the first edge and 1 on the opposite edge
    function quadUV(a, b, c, d, uvs) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs || [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2));
      g.computeVertexNormals();
      return g;
    }
    function quadM(a, b, c, d) {      // uv in metres from world x/z (ground textures)
      return quadUV(a, b, c, d, [a.x, a.z, b.x, b.z, c.x, c.z, a.x, a.z, c.x, c.z, d.x, d.z]);
    }

    // lit room box seen through the glass
    function shell(x0, x1, z0, z1, y0, y1) {
      if (y1 - y0 < 1.2 || x1 - x0 < 0.5 || z1 - z0 < 0.5) return;
      var e = 0.012;                       // just inside the walls' inner faces, so the shell is what shows through the glass
      var g = G.box(x0 + e, y0, z0 + e, x1 - e, y1, z1 - e).toNonIndexed(), n = g.attributes.position.count, col = new Float32Array(n * 3), nor = g.attributes.normal;
      for (var i = 0; i < n; i++) {
        var ny = nor.getY(i), nx = nor.getX(i), s = ny < -0.5 ? 0.42 : ny > 0.5 ? 1.0 : (Math.abs(nx) > 0.5 ? 0.78 : 0.9);
        col[i * 3] = s; col[i * 3 + 1] = s * (ny < -0.5 ? 0.8 : 1); col[i * 3 + 2] = s * (ny < -0.5 ? 0.62 : 1);
      }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      B('interior', g);
    }

    // profiled wall sheeting of a hall: vertical sheets on the outer face, cut around the openings
    function sheeting(w, poly2, name) {
      var pl = G.plane(w.pt(0, 0, 0.003), w.nrm.clone().negate(), Math.PI / 2), cuts = w.ops.map(function (o) { return [o.x - o.w / 2, o.x + o.w / 2, o.y, o.y + o.h]; });
      var xs = [0, w.len];
      cuts.forEach(function (c) { xs.push(c[0], c[1]); });
      poly2.forEach(function (q) { xs.push(q[0]); });            // outline corners (gable apex): the top stays straight inside a column
      xs = xs.filter(function (x) { return x >= 0 && x <= w.len; }).sort(function (a, b) { return a - b; });
      var polys = [];
      for (var i = 0; i < xs.length - 1; i++) {
        var a = xs[i], b = xs[i + 1];
        if (b - a < 0.01) continue;
        var mid = (a + b) / 2, span = G.spanAt(poly2, mid);
        if (!span) continue;
        var free = [[span[0], span[1]]];
        cuts.forEach(function (c) {
          if (c[0] >= b - 1e-6 || c[1] <= a + 1e-6) return;
          free = free.reduce(function (acc, f) { if (c[3] <= f[0] || c[2] >= f[1]) acc.push(f); else { if (c[2] > f[0]) acc.push([f[0], c[2]]); if (c[3] < f[1]) acc.push([c[3], f[1]]); } return acc; }, []);
        });
        free.forEach(function (f) {
          if (f[1] - f[0] < 0.05) return;
          // clip the top to the wall outline (sloped gable) between a and b
          var ta = G.spanAt(poly2, a + 1e-4), tb = G.spanAt(poly2, b - 1e-4), isTop = Math.abs(f[1] - span[1]) < 1e-6;
          var topA = isTop && ta ? ta[1] : f[1], topB = isTop && tb ? tb[1] : f[1];
          polys.push([[a, f[0]], [b, f[0]], [b, topB], [a, topA]]);
        });
      }
      pl.polys = polys; pl.anchor = 0; pl.wall = true; pl.name = name;
      S.skins.push(pl);
    }

    /* ================= roof generators ==================================== */
    function addPlane(pl, o) {
      o = o || {};
      pl.snow = o.snow !== false; pl.guards = o.guards !== false; pl.slabT = o.slabT || 0.14; pl.name = o.name || TK.t('k.pl.roof');
      S.planes.push(pl);
      return pl;
    }
    function rectPoly(u0, u1, v0, v1) { return [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]; }

    // gable roof over a rectangle. axis: ridge direction (unit, horizontal), C: centre, L along the ridge, W across.
    function gable(C, axis, L, W, Hp, p, oe, og, names) {
      var cross = new V3().crossVectors(UP, axis), tp = Math.tan(p), yE = Hp - oe * tp, yR = Hp + W / 2 * tp, Sl = (W / 2 + oe) / Math.cos(p), a = L / 2 + og, out = [];
      [-1, 1].forEach(function (sg, k) {          // front (+Z for an X ridge) first
        var pl = addPlane(G.plane(C.clone().addScaledVector(cross, sg * (W / 2 + oe)).setY(yE), cross.clone().multiplyScalar(-sg), p), { name: (names || [TK.t('k.pl.front'), TK.t('k.pl.back')])[k] });
        pl.poly = rectPoly(-a, a, 0, Sl);
        S.eaves.push({ pl: pl, u0: -a, u1: a, cA: 0, cB: 0, pipes: 2, offA: og + 0.24, offB: og + 0.24, wallOff: oe });
        S.verges.push({ pl: pl, u: -a, v0: 0, v1: Sl, sg: -1 }, { pl: pl, u: a, v0: 0, v1: Sl, sg: 1 });
        out.push(pl);
      });
      S.ridges.push({ a: C.clone().addScaledVector(axis, -a).setY(yR), b: C.clone().addScaledVector(axis, a).setY(yR), p: p });
      return { planes: out, yE: yE, yR: yR, S: Sl };
    }

    function hip(L, W, Hp, p, oe) {
      var tp = Math.tan(p), yE = Hp - oe * tp, a = L / 2 + oe, b = W / 2 + oe, r = (L - W) / 2, Sl = b / Math.cos(p), yR = yE + b * tp;
      var defs = [
        { e: v(0, yE, b), inw: v(0, 0, -1), poly: [[-a, 0], [a, 0], [r, Sl], [-r, Sl]], half: a, pipes: 2, name: TK.t('k.pl.front') },
        { e: v(a, yE, 0), inw: v(-1, 0, 0), poly: [[-b, 0], [b, 0], [0, Sl]], half: b, pipes: 0, name: TK.t('k.pl.right') },
        { e: v(0, yE, -b), inw: v(0, 0, 1), poly: [[-a, 0], [a, 0], [r, Sl], [-r, Sl]], half: a, pipes: 2, name: TK.t('k.pl.back') },
        { e: v(-a, yE, 0), inw: v(1, 0, 0), poly: [[-b, 0], [b, 0], [0, Sl]], half: b, pipes: 0, name: TK.t('k.pl.left') }
      ];
      var out = defs.map(function (d) {
        var pl = addPlane(G.plane(d.e, d.inw, p), { name: d.name });
        pl.poly = d.poly;
        S.eaves.push({ pl: pl, u0: -d.half, u1: d.half, cA: 1, cB: 1, pipes: d.pipes, offA: oe + 0.26, offB: oe + 0.26, wallOff: oe });
        return pl;
      });
      S.ridges.push({ a: v(-r, yR, 0), b: v(r, yR, 0), p: p });
      [[-a, b, -r], [a, b, r], [a, -b, r], [-a, -b, -r]].forEach(function (c) { S.hips.push({ a: v(c[0], yE, c[1]), b: v(c[2], yR, 0), p: p }); });
      return { planes: out, yE: yE, yR: yR, S: Sl };
    }

    // keep the chimney inside its roof plane (with a margin), whatever the dimensions
    function fitChimney(c, margin) {
      var pl = c.pl, d = v(c.x, 0, c.z).sub(v(pl.o.x, 0, pl.o.z)), u = d.dot(pl.ux), h = d.dot(pl.inward), vv = h / Math.cos(pl.pitch);
      var po = (pl.polys || [pl.poly])[0], S0 = 0, i;
      for (i = 0; i < po.length; i++) S0 = Math.max(S0, po[i][1]);
      vv = Math.min(S0 - margin - 0.1, Math.max(margin + 0.6, vv));
      var rows = G.rowsAt(po, vv), best = null;
      rows.forEach(function (q) { var lo = q[0] + margin, hi = q[1] - margin; if (hi < lo) return; var uu = Math.min(hi, Math.max(lo, u)); if (!best || Math.abs(uu - u) < Math.abs(best - u)) best = uu; });
      if (best === null) return false;
      var P = pl.o.clone().addScaledVector(pl.ux, best).addScaledVector(pl.inward, vv * Math.cos(pl.pitch));
      c.x = P.x; c.z = P.z;
      return true;
    }

    /* ================= object types ========================================= */
    var kuca = state.kuca, roofInfo;

    function stdSides(w, W, Hp, upper, zoneG, zoneU, topPoly) {
      // two windows per storey on a side wall
      op(w, W * 0.3, 0.95, 1.3, 1.35, 'win', 2, true); op(w, W * 0.72, 0.95, 1.3, 1.35, 'win', 2);
      if (upper) { op(w, W * 0.3, upper, 1.2, 1.35, 'win', 2); op(w, W * 0.72, upper, 1.2, 1.35, 'win', 2, true); }
      rect(w, 0, W, 0, GH, zoneG);
      poly(w, topPoly || [[0, GH], [W, GH], [W, Hp - 0.04], [0, Hp - 0.04]], zoneU);
    }

    if (kuca === 'cetvorovodni' || kuca === 'bungalov') {
      /* ---- hip roof: two-storey house / bungalow ----------------------- */
      var bung = kuca === 'bungalov';
      var L = dim.L, W = dim.W, Hp = bung ? 3.0 : 5.95, p = rad(dim.p), oe = dim.oe, sL = L / (bung ? 13 : 10.4);
      var x0 = -L / 2, x1 = L / 2, z0 = -W / 2, z1 = W / 2, w = rectWalls(x0, x1, z0, z1), up = 3.25 + 0.9;
      if (bung) {
        op(w.front, L / 2, FL, 3.0, 2.25, 'door', 3, true); op(w.front, 2.3 * sL, 0.95, 1.8, 1.4, 'win', 2, true); op(w.front, L - 2.4 * sL, FL, 2.0, 2.25, 'door', 2, true);
        rect(w.front, 0, L / 2 - 2.1, 0, Hp - 0.04, 'main'); rect(w.front, L / 2 - 2.1, L / 2 + 2.1, 0, Hp - 0.04, 'z1'); rect(w.front, L / 2 + 2.1, L, 0, Hp - 0.04, 'main');
        op(w.back, 2.5 * sL, 0.95, 1.4, 1.35, 'win', 2); op(w.back, 6.5 * sL, FL, 1.0, 2.2, 'door', 1); op(w.back, 10.4 * sL, 0.95, 1.4, 1.35, 'win', 2);
        rect(w.back, 0, L, 0, Hp - 0.04, 'z2');
        [w.left, w.right].forEach(function (s) { op(s, W * 0.3, 0.95, 1.3, 1.35, 'win', 2, true); op(s, W * 0.72, 0.95, 1.3, 1.35, 'win', 2); rect(s, 0, W, 0, Hp - 0.04, 'z2'); });
        shell(x0 + TW, x1 - TW, z0 + TW, z1 - TW, FL, Hp - 0.1);
      } else {
        op(w.front, L / 2 - 2.5 * sL, FL, 2.6, 2.25, 'door', 2, true); op(w.front, L / 2 + 2.6 * sL, FL, 2.0, 2.25, 'door', 2, true);
        op(w.front, L / 2 - 3.1 * sL, up, 1.4, 1.4, 'win', 2, true); op(w.front, L / 2, up, 1.4, 1.4, 'win', 2); op(w.front, L / 2 + 3.1 * sL, up, 1.4, 1.4, 'win', 2, true);
        rect(w.front, 0, L, 0, GH, 'z2'); rect(w.front, 0, L, GH, Hp - 0.04, 'z1');
        op(w.back, 2.4 * sL, 0.95, 1.4, 1.35, 'win', 2); op(w.back, 5.2 * sL, FL, 1.0, 2.2, 'door', 1); op(w.back, 8.2 * sL, 0.95, 1.2, 1.35, 'win', 1);
        op(w.back, 2.6 * sL, up, 1.2, 1.35, 'win', 2); op(w.back, 7.8 * sL, up, 1.2, 1.35, 'win', 2);
        rect(w.back, 0, L, 0, GH, 'z2'); rect(w.back, 0, L, GH, Hp - 0.04, 'z1');
        stdSides(w.left, W, Hp, up, 'z2', 'z1'); stdSides(w.right, W, Hp, up, 'z2', 'z1');
        shell(x0 + TW, x1 - TW, z0 + TW, z1 - TW, FL, GH - 0.1);
        shell(x0 + TW, x1 - TW, z0 + TW, z1 - TW, GH + 0.25, Hp - 0.12);
      }
      [w.front, w.back, w.left, w.right].forEach(function (s) { finish(s, { ao: Hp - 0.04 }); });
      roofInfo = hip(L, W, Hp, p, oe);
      S.chimney = { pl: roofInfo.planes[0], x: (bung ? -2.6 : 0.5) * sL, z: bung ? 1.2 : 1.0, top: roofInfo.yR + 0.5 };
      if (!fitChimney(S.chimney, 0.45)) S.chimney = null;
      S.terrace = { x0: x0 + 0.4, x1: x1 + 0.4, z0: z1, z1: z1 + 3.6 };
      S.dims = { L: L, W: W, top: roofInfo.yR, eave: roofInfo.yE, cx: 0, cz: 0 };
      S.anchors = {
        terrace: v(1.2, TER, z1 + 2.5), roof: roofInfo.planes[0].at(-Math.min(2.2, (L - W) / 2 + 0.8), roofInfo.S * 0.45, 0.05), wall: v(bung ? -2.9 * sL : -0.4, bung ? 1.6 : 1.7, z1),
        window: bung ? v(-L / 2 + 2.3 * sL, 1.6, z1) : v(-3.1 * sL, up + 0.7, z1), env: v(L / 2 + 5.5, 1.4, 2.5), eave: v(-L / 2 - oe, roofInfo.yE, z1 + oe)
      };

    } else if (kuca === 'jednovodni') {
      /* ---- mono-pitch: low eave at the front, high side at the back ----- */
      var L2 = dim.L, W2 = dim.W, Hl = 5.5, p2 = rad(dim.p), oe2 = dim.oe, og2 = dim.og, tp2 = Math.tan(p2), Hh = Hl + W2 * tp2, sL2 = L2 / 10, sW2 = W2 / 7.6;
      var a0 = -L2 / 2, a1 = L2 / 2, c0 = -W2 / 2, c1 = W2 / 2, ww = rectWalls(a0, a1, c0, c1), up2 = 3.25 + 0.75;
      op(ww.front, L2 / 2 - 2.4 * sL2, FL, 2.8, 2.25, 'door', 2, true); op(ww.front, L2 / 2 + 2.5 * sL2, FL, 2.0, 2.25, 'door', 2, true);
      op(ww.front, L2 / 2 - 2.4 * sL2, up2, 2.4, 1.3, 'win', 2, true); op(ww.front, L2 / 2 + 2.5 * sL2, up2, 1.6, 1.3, 'win', 2);
      rect(ww.front, 0, L2, 0, GH, 'z2'); rect(ww.front, 0, L2, GH, Hl - 0.04, 'z1');
      op(ww.back, 2.4 * sL2, 0.95, 1.4, 1.35, 'win', 2); op(ww.back, 5.0 * sL2, FL, 1.0, 2.2, 'door', 1); op(ww.back, 7.8 * sL2, 0.95, 1.2, 1.35, 'win', 1);
      op(ww.back, 2.6 * sL2, up2 + 0.4, 1.2, 1.35, 'win', 2); op(ww.back, 7.4 * sL2, up2 + 0.4, 1.2, 1.35, 'win', 2);
      rect(ww.back, 0, L2, 0, GH, 'z2'); rect(ww.back, 0, L2, GH, Hh - 0.04, 'z1');
      stdSides(ww.left, W2, Hl, up2, 'z2', 'z1', [[0, GH], [W2, GH], [W2, Hl - 0.04], [0, Hh - 0.04]]);
      stdSides(ww.right, W2, Hl, up2, 'z2', 'z1', [[0, GH], [W2, GH], [W2, Hh - 0.04], [0, Hl - 0.04]]);
      finish(ww.front, { ao: Hl - 0.04 }); finish(ww.back); finish(ww.left); finish(ww.right);
      shell(a0 + TW, a1 - TW, c0 + TW, c1 - TW, FL, GH - 0.1);
      shell(a0 + TW, a1 - TW, c0 + TW, c1 - TW, GH + 0.25, Hl - 0.15);
      var yE2 = Hl - oe2 * tp2, Sl2 = (W2 + 2 * oe2) / Math.cos(p2), mp = addPlane(G.plane(v(0, yE2, c1 + oe2), v(0, 0, -1), p2), { snow: false, name: TK.t('k.pl.roof') });
      mp.poly = rectPoly(-L2 / 2 - og2, L2 / 2 + og2, 0, Sl2);
      S.eaves.push({ pl: mp, u0: -L2 / 2 - og2, u1: L2 / 2 + og2, cA: 0, cB: 0, pipes: 2, offA: og2 + 0.24, offB: og2 + 0.24, wallOff: oe2 });
      S.verges.push({ pl: mp, u: -L2 / 2 - og2, v0: 0, v1: Sl2, sg: -1 }, { pl: mp, u: L2 / 2 + og2, v0: 0, v1: Sl2, sg: 1 });
      S.tops.push({ pl: mp, v: Sl2, u0: -L2 / 2 - og2, u1: L2 / 2 + og2 });
      roofInfo = { yE: yE2, yR: yE2 + Sl2 * Math.sin(p2), S: Sl2, planes: [mp] };
      S.chimney = { pl: mp, x: 2.6 * sL2, z: -2.2 * sW2, top: Hl + (c1 + 2.2 * sW2) * tp2 + 1.0 };
      if (!fitChimney(S.chimney, 0.45)) S.chimney = null;
      S.terrace = { x0: a0 + 0.3, x1: a1 + 0.4, z0: c1, z1: c1 + 3.6 };
      S.dims = { L: L2, W: W2, top: roofInfo.yR, eave: yE2, cx: 0, cz: 0 };
      S.anchors = { terrace: v(1.2, TER, c1 + 2.5), roof: mp.at(-1.5 * sL2, Sl2 * 0.4, 0.05), wall: v(0.1, 1.7, c1), window: v(-2.4 * sL2, up2 + 0.65, c1), env: v(L2 / 2 + 5.5, 1.4, 2.5), eave: v(-L2 / 2 - og2, yE2, c1 + oe2) };

    } else if (kuca === 'ravan') {
      /* ---- flat roof 3° behind a three-sided parapet, eave at the back --- */
      var L3 = dim.L, W3 = dim.W, Hr = 6.25, p3 = rad(3), oe3 = 0.35, top3 = Hr + W3 * Math.tan(p3) + 0.34, sL3 = L3 / 11;
      var b0 = -L3 / 2, b1 = L3 / 2, d0 = -W3 / 2, d1 = W3 / 2, w3 = rectWalls(b0, b1, d0, d1), up3 = 3.25 + 0.85;
      op(w3.front, L3 / 2 - 2.6 * sL3, FL, 3.0, 2.3, 'door', 3, true); op(w3.front, L3 / 2 + 2.9 * sL3, FL, 2.0, 2.3, 'door', 2, true);
      op(w3.front, L3 / 2 - 2.6 * sL3, up3, 3.0, 1.45, 'win', 3, true); op(w3.front, L3 / 2 + 2.9 * sL3, up3, 2.0, 1.45, 'win', 2);
      rect(w3.front, 0, L3, 0, GH, 'z2'); rect(w3.front, 0, L3, GH, top3, 'z1');
      op(w3.back, 2.4 * sL3, 0.95, 1.4, 1.35, 'win', 2); op(w3.back, 5.5 * sL3, FL, 1.0, 2.2, 'door', 1); op(w3.back, 8.6 * sL3, 0.95, 1.2, 1.35, 'win', 1);
      op(w3.back, 2.8 * sL3, up3, 1.2, 1.35, 'win', 2); op(w3.back, 8.2 * sL3, up3, 1.2, 1.35, 'win', 2);
      rect(w3.back, 0, L3, 0, GH, 'z2'); rect(w3.back, 0, L3, GH, Hr - 0.04, 'z1');
      stdSides(w3.left, W3, top3 + 0.04, up3, 'z2', 'z1'); stdSides(w3.right, W3, top3 + 0.04, up3, 'z2', 'z1');
      finish(w3.front); finish(w3.back, { ao: Hr - 0.04 }); finish(w3.left); finish(w3.right);
      shell(b0 + TW, b1 - TW, d0 + TW, d1 - TW, FL, GH - 0.1);
      shell(b0 + TW, b1 - TW, d0 + TW, d1 - TW, GH + 0.25, Hr - 0.25);
      var yE3 = Hr - oe3 * Math.tan(p3), Sl3 = (oe3 + W3 - TW - 0.01) / Math.cos(p3), fp = addPlane(G.plane(v(0, yE3, d0 - oe3), v(0, 0, 1), p3), { snow: false, slabT: 0.2, name: TK.t('k.pl.flat') });
      var hu = L3 / 2 - TW - 0.01;
      fp.poly = rectPoly(-hu, hu, 0, Sl3);
      S.eaves.push({ pl: fp, u0: -hu, u1: hu, cA: 0, cB: 0, pipes: 2, offA: 0.3, offB: 0.3, wallOff: oe3 });
      S.parapets.push({ a: v(b0, top3, d0), b: v(b0, top3, d1), nrm: v(-1, 0, 0), sA: 0, sB: 1 },
        { a: v(b0, top3, d1), b: v(b1, top3, d1), nrm: v(0, 0, 1), sA: 1, sB: 1 },
        { a: v(b1, top3, d1), b: v(b1, top3, d0), nrm: v(1, 0, 0), sA: 1, sB: 0 });
      roofInfo = { yE: yE3, yR: top3, S: Sl3, planes: [fp] };
      S.terrace = { x0: b0 + 0.3, x1: b1 + 0.4, z0: d1, z1: d1 + 3.6 };
      S.dims = { L: L3, W: W3, top: top3, eave: yE3, cx: 0, cz: 0, flat: true };
      S.anchors = { terrace: v(1.2, TER, d1 + 2.5), roof: v(-2.0 * sL3, top3 + 0.05, d1 - 0.15), wall: v(0.3, 1.7, d1), window: v(-2.6 * sL3, up3 + 0.7, d1), env: v(L3 / 2 + 5.5, 1.4, 2.5), eave: v(-hu, yE3, d0 - oe3), ridge: v(2.5 * sL3, top3 + 0.05, d1 - 0.15) };

    } else if (kuca === 'lkrov') {
      /* ---- L plan: wing (ridge along Z) + main (ridge along X) with valleys - */
      var sx = dim.L / 13.6, sz = dim.W / 10.2;
      var p4 = rad(dim.p), tp4 = Math.tan(p4), cp4 = Math.cos(p4), oe4 = dim.oe, og4 = dim.og, Hp4 = 4.2;
      var wx0 = -6.8 * sx, wx1 = 0.2 * sx, wz0 = -5.1 * sz, wz1 = 5.1 * sz, Ww = wx1 - wx0, xw = (wx0 + wx1) / 2;       // wing
      var mx1 = 6.8 * sx, mz0 = -5.1 * sz, mz1 = 1.3 * sz, Wm = mz1 - mz0, zm = (mz0 + mz1) / 2;                       // main
      var yRw = Hp4 + Ww / 2 * tp4, yRm = Hp4 + Wm / 2 * tp4, yE4 = Hp4 - oe4 * tp4;
      var gap = on.uvala ? 0.11 : 0;
      function opS(wl0, x, len0) { var a = Array.prototype.slice.call(arguments, 3); return op.apply(null, [wl0, x * wl0.len / len0].concat(a)); }
      // walls — wing
      var wl = Wall(v(wx0, 0, wz0), v(-1, 0, 0), wz1 - wz0), wf = Wall(v(wx0, 0, wz1), v(0, 0, 1), Ww), wb = Wall(v(wx1, 0, wz0), v(0, 0, -1), Ww);
      var wr = Wall(v(wx1, 0, wz1), v(1, 0, 0), wz1 - mz1);
      op(wf, Ww / 2, FL, 2.8, 2.25, 'door', 2, true); op(wf, Ww / 2, 3.95, 1.5, 1.35, 'win', 2, true);
      poly(wf, [[0, 0], [Ww, 0], [Ww, Hp4 - 0.04], [Ww / 2, yRw - 0.06], [0, Hp4 - 0.04]], 'z1');
      op(wb, Ww / 2, 0.95, 1.4, 1.35, 'win', 2); op(wb, Ww / 2, 3.95, 1.2, 1.35, 'win', 2);
      poly(wb, [[0, 0], [Ww, 0], [Ww, Hp4 - 0.04], [Ww / 2, yRw - 0.06], [0, Hp4 - 0.04]], 'z1');
      opS(wl, 2.4, 10.2, 0.95, 1.4, 1.35, 'win', 2, true); opS(wl, 5.4, 10.2, 0.95, 1.2, 1.35, 'win', 1); opS(wl, 8.2, 10.2, 0.95, 1.4, 1.35, 'win', 2);
      rect(wl, 0, wl.len, 0, Hp4 - 0.04, 'z1');
      opS(wr, 1.9, 3.8, FL, 1.8, 2.25, 'door', 2, true);
      rect(wr, 0, wr.len, 0, Hp4 - 0.04, 'z1');
      // walls — main
      var mf = Wall(v(wx1, 0, mz1), v(0, 0, 1), mx1 - wx1), mb = Wall(v(mx1, 0, mz0), v(0, 0, -1), mx1 - wx1), mr = Wall(v(mx1, 0, mz1), v(1, 0, 0), Wm);
      opS(mf, 2.0, 6.6, FL, 2.4, 2.25, 'door', 2, true); opS(mf, 5.0, 6.6, 0.95, 1.4, 1.35, 'win', 2);
      rect(mf, 0, mf.len, 0, GH, 'z2'); rect(mf, 0, mf.len, GH, Hp4 - 0.04, 'main');
      opS(mb, 1.8, 6.6, 0.95, 1.2, 1.35, 'win', 2); opS(mb, 4.6, 6.6, FL, 1.0, 2.2, 'door', 1);
      rect(mb, 0, mb.len, 0, GH, 'z2'); rect(mb, 0, mb.len, GH, Hp4 - 0.04, 'main');
      op(mr, Wm * 0.3, 0.95, 1.3, 1.35, 'win', 2, true); op(mr, Wm * 0.72, 0.95, 1.3, 1.35, 'win', 2); op(mr, Wm / 2, 3.95, 1.3, 1.3, 'win', 2);
      rect(mr, 0, Wm, 0, GH, 'z2');
      poly(mr, [[0, GH], [Wm, GH], [Wm, Hp4 - 0.04], [Wm / 2, yRm - 0.06], [0, Hp4 - 0.04]], 'main');
      finish(wl, { ao: Hp4 - 0.04 }); finish(wf); finish(wb); finish(wr, { ao: Hp4 - 0.04 }); finish(mf, { ao: Hp4 - 0.04 }); finish(mb, { ao: Hp4 - 0.04 }); finish(mr);
      shell(wx0 + TW, wx1 - TW, wz0 + TW, wz1 - TW, FL, GH - 0.1);
      shell(wx0 + 1.6, wx1 - 1.6, wz0 + TW, wz1 - TW, GH + 0.25, Math.min(5.3, Hp4 + 1.6 * tp4 - 0.12));
      shell(wx1 - 0.4, mx1 - TW, mz0 + TW, mz1 - TW, FL, GH - 0.1);
      shell(wx1 - 0.4, mx1 - TW, zm - 1.5, zm + 1.5, GH + 0.25, Math.min(5.25, Hp4 + (Wm / 2 - 1.5) * tp4 - 0.12));
      // roof planes
      var Sw = (Ww / 2 + oe4) / cp4, Sm = (Wm / 2 + oe4) / cp4, zf = wz1 + og4, zbk = wz0 - og4, xe = wx1 + oe4, xr = mx1 + og4, xv = xw + Ww / 2 - Wm / 2;
      var zc = mz1 + oe4, zcb = mz0 - oe4, g1 = gap * 1.35;
      var vA = Sm, tb = (zm - zbk) / (zm - zcb), vB = vA * (1 - tb);          // back valley meets the wing's back verge at height vB
      var pWL = addPlane(G.plane(v(wx0 - oe4, yE4, 0), v(1, 0, 0), p4), { name: TK.t('k.pl.wingL') });       // u = z
      pWL.poly = rectPoly(zbk, zf, 0, Sw);
      var pWR = addPlane(G.plane(v(xe, yE4, 0), v(-1, 0, 0), p4), { name: TK.t('k.pl.wingR') });            // u = -z
      pWR.poly = [[-zf, 0], [-zc - g1, 0], [-zm, vA + g1], [-zbk, vB + g1], [-zbk, Sw], [-zf, Sw]];
      pWR.polySlab = [[-zf, 0], [-zc, 0], [-zm, vA], [-zbk, vB], [-zbk, Sw], [-zf, Sw]];
      var pMF = addPlane(G.plane(v(0, yE4, zc), v(0, 0, -1), p4), { name: TK.t('k.pl.mainF') });          // u = x
      pMF.poly = [[xe + g1, 0], [xr, 0], [xr, Sm], [xv + g1, Sm]];
      pMF.polySlab = [[xe, 0], [xr, 0], [xr, Sm], [xv, Sm]];
      var pMB = addPlane(G.plane(v(0, yE4, zcb), v(0, 0, 1), p4), { name: TK.t('k.pl.mainB') });           // u = -x
      pMB.poly = [[-xr, 0], [-xe - g1, 0], [-xv - g1, Sm], [-xr, Sm]];
      pMB.polySlab = [[-xr, 0], [-xe, 0], [-xv, Sm], [-xr, Sm]];
      S.eaves.push(
        { pl: pMF, u0: xe, u1: xr, cA: -1, cB: 0, pipes: 1, end: 'b', offA: 0, offB: og4 + 0.24, wallOff: oe4 },
        { pl: pWR, u0: -zf, u1: -zc, cA: 0, cB: -1, pipes: 1, end: 'a', offA: og4 + 0.24, offB: 0, wallOff: oe4 },
        { pl: pWL, u0: zbk, u1: zf, cA: 0, cB: 0, pipes: 2, offA: og4 + 0.24, offB: og4 + 0.24, wallOff: oe4 },
        { pl: pMB, u0: -xr, u1: -xe, cA: 0, cB: 0, pipes: 1, end: 'a', offA: og4 + 0.24, offB: 0, wallOff: oe4 });
      S.verges.push({ pl: pWL, u: zbk, v0: 0, v1: Sw, sg: -1 }, { pl: pWL, u: zf, v0: 0, v1: Sw, sg: 1 },
        { pl: pWR, u: -zf, v0: 0, v1: Sw, sg: -1 }, { pl: pWR, u: -zbk, v0: vB, v1: Sw, sg: 1 },
        { pl: pMF, u: xr, v0: 0, v1: Sm, sg: 1 }, { pl: pMB, u: -xr, v0: 0, v1: Sm, sg: -1 });
      S.ridges.push({ a: v(xw, yRw, zbk), b: v(xw, yRw, zf), p: p4 }, { a: v(xv, yRm, zm), b: v(xr, yRm, zm), p: p4 });
      var apex = v(xv, yRm, zm), vbStart = v(xe, yE4, zcb).lerp(apex, 1 - tb);
      S.valleys.push({ a: v(xe, yE4, zc), b: apex, p: p4 }, { a: vbStart, b: apex.clone(), p: p4 });
      roofInfo = { yE: yE4, yR: yRw, S: Sw, planes: [pMF, pWR, pWL, pMB] };
      S.chimney = { pl: pMF, x: 3.9 * sx, z: zm + 0.95, top: yRm + 0.55 };
      if (!fitChimney(S.chimney, 0.45)) S.chimney = null;
      S.terrace = { x0: wx1, x1: mx1 + 0.4, z0: mz1, z1: wz1 + 0.3 };
      S.dims = { L: mx1 - wx0, W: wz1 - wz0, top: yRw, eave: yE4, cx: 0, cz: 0 };
      S.anchors = { terrace: v(3.8 * sx, TER, 3.6 * sz), roof: pMF.at(4.6 * sx, Sm * 0.5, 0.05), wall: v(-1.4 * sx, 1.6, wz1), window: v(wx1 + 2.0 * sx, 1.3, mz1), env: v(11.5 * sx, 1.4, 4.0), eave: v(xr, yE4, zc), eaveView: v(1, 0.12, 0.6), valley: v(xe, yE4, zc).lerp(apex, 0.45) };

    } else if (kuca === 'hala') {
      /* ---- hall: steel frame clad in profiled sheet, single or double pitch, optional parapet ---- */
      var L6 = dim.L, W6 = dim.W, Hv = dim.hv, p6 = rad(dim.p), tp6 = Math.tan(p6), mono = +state.hk === 1, par = !!+state.hpar, zid = !!+state.hzid;
      var oe6 = par ? -(TW + 0.16) : dim.oe, og6 = par ? -(TW + 0.02) : dim.og;
      var h0 = -L6 / 2, h1 = L6 / 2, k0 = -W6 / 2, k1 = W6 / 2, wh = rectWalls(h0, h1, k0, k1);
      var yRh = mono ? Hv + W6 * tp6 : Hv + W6 / 2 * tp6, ext = par ? PAR : 0, gateH = Math.min(4.5, Hv - 1.0), winY = Math.max(gateH + 0.6, Hv * 0.55);
      // openings: sectional doors on the front, a personnel door, window bands where they fit
      var gates = [0.22, 0.5].concat(L6 >= 34 ? [0.78] : []).map(function (f) { return L6 * f; });
      gates.forEach(function (gx) { op(wh.front, gx, 0.02, 4.0, gateH, 'gate'); });
      op(wh.front, L6 * 0.36, FL, 1.0, 2.2, 'door', 1);
      function band(w, y, step, avoid) {
        for (var x = step / 2 + 0.6; x < w.len - 1.4; x += step) {
          if (avoid && avoid.some(function (g) { return Math.abs(g - x) < 3.4; })) continue;
          if (y + 1.0 < (w === wh.back && mono ? yRh : Hv) - 0.35) op(w, x, y, 2.0, 1.0, 'win', 2);
        }
      }
      band(wh.front, winY, 5, gates.concat([L6 * 0.36]));
      band(wh.back, Math.min(winY, Hv - 1.5), 5);
      op(wh.right, W6 / 2, 0.02, 4.0, gateH, 'gate');
      band(wh.left, Math.min(winY, Hv - 1.5), 4.5);
      // wall outlines (wall-local x along the wall, y up)
      var topF = Hv + ext - 0.04, topB = (mono ? yRh : Hv) + ext - 0.04;
      var outline = {
        front: [[0, 0], [L6, 0], [L6, topF], [0, topF]],
        back: [[0, 0], [L6, 0], [L6, topB], [0, topB]],
        left: mono ? [[0, 0], [W6, 0], [W6, Hv + ext - 0.04], [0, yRh + ext - 0.04]] : [[0, 0], [W6, 0], [W6, Hv + ext - 0.04], [W6 / 2, yRh + ext - 0.06], [0, Hv + ext - 0.04]],
        right: mono ? [[0, 0], [W6, 0], [W6, yRh + ext - 0.04], [0, Hv + ext - 0.04]] : [[0, 0], [W6, 0], [W6, Hv + ext - 0.04], [W6 / 2, yRh + ext - 0.06], [0, Hv + ext - 0.04]]
      };
      var wallNames = { front: TK.t('k.wall.front'), back: TK.t('k.wall.back'), left: TK.t('k.wall.left'), right: TK.t('k.wall.right') };
      ['front', 'back', 'left', 'right'].forEach(function (k) {
        var w6 = wh[k], o6 = outline[k];
        poly(w6, o6, 'main');
        if (zid) sheeting(w6, o6.map(function (q, i) { return i < 2 ? [q[0], 0.32] : q; }), wallNames[k]);
        finish(w6, { ao: zid ? 0 : Hv - 0.04 });
      });
      shell(h0 + TW, h1 - TW, k0 + TW, k1 - TW, 0.05, Hv - 0.25);
      if (mono) {
        var yE6 = Hv - oe6 * tp6, Sl6 = (W6 + 2 * oe6) / Math.cos(p6), hp6 = addPlane(G.plane(v(0, yE6, k1 + oe6), v(0, 0, -1), p6), { name: TK.t('k.pl.roof') });
        hp6.poly = rectPoly(-L6 / 2 - og6, L6 / 2 + og6, 0, Sl6);
        S.eaves.push({ pl: hp6, u0: -L6 / 2 - og6, u1: L6 / 2 + og6, cA: 0, cB: 0, pipes: 2, offA: Math.max(0.3, og6 + 0.24), offB: Math.max(0.3, og6 + 0.24), wallOff: oe6 });
        if (!par) { S.verges.push({ pl: hp6, u: -L6 / 2 - og6, v0: 0, v1: Sl6, sg: -1 }, { pl: hp6, u: L6 / 2 + og6, v0: 0, v1: Sl6, sg: 1 }); S.tops.push({ pl: hp6, v: Sl6, u0: -L6 / 2 - og6, u1: L6 / 2 + og6 }); }
        roofInfo = { yE: yE6, yR: yE6 + Sl6 * Math.sin(p6), S: Sl6, planes: [hp6] };
      } else {
        roofInfo = gable(v(0, 0, 0), v(1, 0, 0), L6, W6, Hv, p6, oe6, og6);
        S.eaves.forEach(function (e) { e.offA = e.offB = Math.max(0.3, og6 + 0.24); });
        if (par) S.verges.length = 0;
      }
      if (par) {       // coping on top of the parapet, all the way round (sloped on the gables)
        var yT = Hv + PAR, yTR = yRh + PAR;
        if (mono) S.parapets.push({ a: v(h0, yT, k1), b: v(h1, yT, k1), nrm: v(0, 0, 1), sA: 1, sB: 1 }, { a: v(h1, yRh + PAR, k0), b: v(h0, yRh + PAR, k0), nrm: v(0, 0, -1), sA: 1, sB: 1 },
          { a: v(h0, yRh + PAR, k0), b: v(h0, yT, k1), nrm: v(-1, 0, 0), sA: 0, sB: 0 }, { a: v(h1, yT, k1), b: v(h1, yRh + PAR, k0), nrm: v(1, 0, 0), sA: 0, sB: 0 });
        else S.parapets.push({ a: v(h0, yT, k1), b: v(h1, yT, k1), nrm: v(0, 0, 1), sA: 1, sB: 1 }, { a: v(h1, yT, k0), b: v(h0, yT, k0), nrm: v(0, 0, -1), sA: 1, sB: 1 },
          { a: v(h0, yT, k0), b: v(h0, yTR, 0), nrm: v(-1, 0, 0), sA: 0, sB: 0 }, { a: v(h0, yTR, 0), b: v(h0, yT, k1), nrm: v(-1, 0, 0), sA: 0, sB: 0 },
          { a: v(h1, yT, k1), b: v(h1, yTR, 0), nrm: v(1, 0, 0), sA: 0, sB: 0 }, { a: v(h1, yTR, 0), b: v(h1, yT, k0), nrm: v(1, 0, 0), sA: 0, sB: 0 });
      }
      S.terrace = { x0: h0 + 1.5, x1: h1 - 1.5, z0: k1, z1: k1 + 6 };
      S.dims = { L: L6, W: W6, top: yRh + ext, eave: roofInfo.yE, cx: 0, cz: 0, hall: true };
      var rp = roofInfo.planes[0];
      S.anchors = { terrace: v(-L6 * 0.1, TER, k1 + 3.5), roof: rp.at(-L6 * 0.18, roofInfo.S * 0.45, 0.05), wall: v(-L6 * 0.4, Math.min(3, Hv * 0.45), k1), window: v(L6 * 0.36 - L6 / 2, 1.4, k1),
        env: v(L6 / 2 + 8, 1.4, 4), eave: v(-L6 / 2 - og6, roofInfo.yE, k1 + oe6), ridge: mono ? rp.at(L6 * 0.15, roofInfo.S * 0.92, 0.1) : v(L6 * 0.15, yRh + 0.1, 0) };

    } else {
      /* ---- dvovodni: 1.5-storey gable house with a shed dormer ------------- */
      var L5 = dim.L, W5 = dim.W, Hp5 = 4.2, p5 = rad(dim.p), tp5 = Math.tan(p5), cp5 = Math.cos(p5), oe5 = dim.oe, og5 = dim.og, sL5 = L5 / 10.6, sW5 = W5 / 8;
      var e0 = -L5 / 2, e1 = L5 / 2, f0 = -W5 / 2, f1 = W5 / 2, w5 = rectWalls(e0, e1, f0, f1), yR5 = Hp5 + W5 / 2 * tp5;
      var DM = H.dormer(state), dx0 = 0.6 * sL5, dx1 = dx0 + 3.4, ax0 = dx0 - e0, ax1 = dx1 - e0;      // accent strip under the dormer
      op(w5.front, -2.7 * sL5 - e0, FL, 2.6, 2.25, 'door', 2, true); op(w5.front, 2.3 * sL5 - e0, FL, 2.0, 2.25, 'door', 2, true); op(w5.front, L5 - 0.8, FL, 0.7, 2.25, 'door', 1);
      [[0, ax0, 'z2', 'main'], [ax0, ax1, 'z1', 'z1'], [ax1, L5, 'z2', 'main']].forEach(function (s) {
        rect(w5.front, s[0], s[1], 0, GH, s[2]); rect(w5.front, s[0], s[1], GH, Hp5 - 0.04, s[3]);
      });
      op(w5.back, 2.2 * sL5, 0.95, 1.4, 1.35, 'win', 2); op(w5.back, 5.3 * sL5, FL, 1.0, 2.2, 'door', 1); op(w5.back, 8.3 * sL5, 0.95, 1.2, 1.35, 'win', 1);
      rect(w5.back, 0, L5, 0, GH, 'z2'); rect(w5.back, 0, L5, GH, Hp5 - 0.04, 'main');
      // gable windows upstairs only where the roof leaves room above them
      function underRoof(x, hw, top) { return Hp5 + (W5 / 2 - (Math.abs(x - W5 / 2) + hw)) * tp5 > top + 0.22; }
      [w5.left, w5.right].forEach(function (g) {
        op(g, 2.3 * sW5, 0.95, 1.3, 1.35, 'win', 2, true); op(g, 5.7 * sW5, 0.95, 1.3, 1.35, 'win', 2);
        if (underRoof(2.9 * sW5, 0.475, 5.25)) op(g, 2.9 * sW5, 3.95, 0.95, 1.3, 'win', 1, true);
        if (underRoof(5.1 * sW5, 0.475, 5.25)) op(g, 5.1 * sW5, 3.95, 0.95, 1.3, 'win', 1);
        rect(g, 0, W5, 0, GH, 'z2');
        poly(g, [[0, GH], [W5, GH], [W5, Hp5 - 0.04], [W5 / 2, yR5 - 0.06], [0, Hp5 - 0.04]], 'main');
        finish(g);
      });
      finish(w5.front, { ao: Hp5 - 0.04 }); finish(w5.back, { ao: Hp5 - 0.04 });
      shell(e0 + TW, e1 - TW, f0 + TW, f1 - TW, FL, GH - 0.1);
      var zr5 = Math.min(2.1, W5 / 2 - 1.2);
      shell(e0 + TW, e1 - TW, -zr5, zr5, GH + 0.3, Math.min(5.55, Hp5 + (W5 / 2 - zr5) * tp5 - 0.12));
      roofInfo = gable(v(0, 0, 0), v(1, 0, 0), L5, W5, Hp5, p5, oe5, og5);
      var fpl = roofInfo.planes[0], aH = L5 / 2 + og5, Sf = roofInfo.S;
      if (DM.on) {
        // dormer: front face 0.35 m behind the wall line, shed roof 10° running back into the main slope
        var zfD = f1 - 0.35, yD = DM.yD, pd = rad(10), tpd = Math.tan(pd);
        var dMeet = (yD - Hp5 - 0.35 * tpd) / (tp5 - tpd);              // horizontal distance from the wall line to where the two roofs meet
        var zMeet = f1 - dMeet, yMeet = Hp5 + dMeet * tp5, lenC = zfD - zMeet;
        var yRoof = function (z) { return Hp5 + (f1 - z) * tp5; };
        var dW = Wall(v(dx0, 0, zfD), v(0, 0, 1), dx1 - dx0);
        op(dW, (dx1 - dx0) / 2, 4.82, 2.3, 1.22, 'win', 2, true);
        rect(dW, 0, dx1 - dx0, yRoof(zfD) - 0.18, yD - 0.03, 'z1');
        var cL = Wall(v(dx0, 0, zMeet), v(-1, 0, 0), lenC), cR = Wall(v(dx1, 0, zfD), v(1, 0, 0), lenC);
        poly(cL, [[0, yMeet - 0.2], [lenC, yRoof(zfD) - 0.18], [lenC, yD - 0.03], [0, yMeet - 0.02]], 'z1');
        poly(cR, [[0, yRoof(zfD) - 0.18], [lenC, yMeet - 0.2], [lenC, yMeet - 0.02], [0, yD - 0.03]], 'z1');
        [dW, cL, cR].forEach(function (q) { q.base = false; });
        shell(dx0 + TW, dx1 - TW, zfD - 2.0, zfD - TW, 4.55, Math.min(6.15, yD - 0.1));
        // main front plane is laid around the dormer footprint so no sheet runs through the room
        var vF = (oe5 + 0.35 + 0.1) / cp5, vM = (oe5 + dMeet - 0.12) / cp5;
        fpl.polys = [rectPoly(-aH, dx0 + 0.03, 0, Sf), rectPoly(dx0 + 0.03, dx1 - 0.03, 0, vF), rectPoly(dx0 + 0.03, dx1 - 0.03, vM, Sf), rectPoly(dx1 - 0.03, aH, 0, Sf)];
        fpl.anchor = -aH;
        var dpl = addPlane(G.plane(v(0, yD - 0.3 * tpd, zfD + 0.3), v(0, 0, -1), pd), { snow: false, guards: false, slabT: 0.1, name: TK.t('k.pl.dormer') });
        var Sd = (0.3 + lenC + 0.15) / Math.cos(pd);
        dpl.poly = rectPoly(dx0 - 0.2, dx1 + 0.2, 0, Sd);
        S.verges.push({ pl: dpl, u: dx0 - 0.2, v0: 0, v1: Sd - 0.25, sg: -1 }, { pl: dpl, u: dx1 + 0.2, v0: 0, v1: Sd - 0.25, sg: 1 });
        S.dripOnly = [{ pl: dpl, u0: dx0 - 0.2, u1: dx1 + 0.2 }];
      }
      S.chimney = { pl: fpl, x: -1.9 * sL5, z: 0.8, top: yR5 + 0.55 };
      if (!fitChimney(S.chimney, 0.45)) S.chimney = null;
      S.terrace = { x0: e0 - 0.3, x1: e1 + 0.3, z0: f1, z1: f1 + 3.6 };
      S.dims = { L: L5, W: W5, top: yR5, eave: roofInfo.yE, cx: 0, cz: 0 };
      S.anchors = { terrace: v(1.4 * sL5, TER, f1 + 2.6), roof: fpl.at(-3.0 * sL5, Sf * 0.5, 0.05), wall: v(-0.45 * sL5, 1.9, f1), window: v(-2.7 * sL5, 1.35, f1), env: v(L5 / 2 + 5.5, 1.4, 2.5), eave: v(-aH, roofInfo.yE, f1 + oe5) };
    }

    /* ================= roof skin + deck ===================================== */
    S.planes.forEach(function (pl, i) {
      var sk = G.skin(pl, prof, 7 + i, lite ? 0 : 0.4), lod = opt.screwLod || 1;
      B('roof', sk.geo);
      qty.sheets = qty.sheets.concat(sk.sheets);
      qty.screws += sk.screws.length;
      var sNeg = pl.vy.clone().negate();
      sk.screws.forEach(function (q, si) { if (si % lod === 0) inst.screw.push(new THREE.Matrix4().makeBasis(pl.ux, pl.n, sNeg).setPosition(pl.at(q[0], q[1], q[2]))); });
      pl.plan = 0; pl.area = 0;
      var smax = 0;
      (pl.polys || [pl.polySlab || pl.poly]).forEach(function (po) {
        var a = G.polyArea(po);
        qty.area += a; pl.area += a; pl.plan += a * Math.cos(pl.pitch);
        po.forEach(function (q) { smax = Math.max(smax, q[1]); });
        B('fascia', G.slab(pl, po.map(function (q) { return [q[0], Math.max(q[1], 0.05)]; }), 0.012, pl.slabT));
      });
      pl.S = smax;
      pl.qty = { name: pl.name, deg: pl.pitch * 180 / Math.PI, S: smax, area: pl.area, plan: pl.plan, sheets: sk.sheets, out: [-pl.inward.x, -pl.inward.z], snowRows: 0, snowLen: [] };
      qty.planes.push(pl.qty);
    });
    // wall sheeting of a hall: same skin generator, vertical planes
    var wallProf = D.find(D.profiles, state.hzp) || D.find(D.profiles, 'tr20');
    S.skins.forEach(function (pl, i) {
      var sk = G.skin(pl, wallProf, 31 + i, 0);
      B('sheetWall', sk.geo);
      var a = 0; pl.polys.forEach(function (po) { a += G.polyArea(po); });
      qty.walls.push({ name: pl.name, area: a, sheets: sk.sheets, profile: wallProf.id });
    });

    /* ================= ridge / hip caps, valleys ============================ */
    function capAlong(a, b, p, isHip, valley) {
      var dir = b.clone().sub(a).normalize();
      var up = UP.clone().addScaledVector(dir, -UP.dot(dir)).normalize(), side = new V3().crossVectors(dir, up).normalize();
      var al = isHip || valley ? Math.atan(Math.tan(p) / Math.SQRT2) : p, ta = Math.tan(al);
      if (valley) { B('d_uvala', G.sweep([a, b], H.sections(state, p).uvala, side, up)); return; }
      var sc = H.sections(state, al), w = sc.w, hAt = sc.hAt;
      B('d_sleme', G.sweep([a, b], sc.sleme, side, up, { smooth: state.sleme === 'polu' }));
      // profile closure (foam strip) under both wings
      [-1, 1].forEach(function (sg) {
        var s1 = sg * (w - 0.035), s2 = sg * (w - 0.008);
        B('foam', G.sweep([a, b], [[s1, -Math.abs(s1) * ta], [s1, hAt(s1) - 0.002], [s2, hAt(s2) - 0.002], [s2, -Math.abs(s2) * ta]], side, up, { closed: true }));
      });
    }
    S.ridges.forEach(function (r) { qty.ridge += r.a.distanceTo(r.b); if (on.sleme) capAlong(r.a, r.b, r.p, false); });
    S.hips.forEach(function (r) { qty.hip += r.a.distanceTo(r.b); if (on.sleme) capAlong(r.a, r.b, r.p, true); });
    S.valleys.forEach(function (r) { qty.valley += r.a.distanceTo(r.b); if (on.uvala) capAlong(r.a, r.b, r.p, false, true); });

    /* ================= verge trim (vetar lajsna) ============================= */
    var SEC = H.sections(state, roofInfo.planes[0].pitch), vergeSec = SEC.vetar;
    S.verges.forEach(function (g) {
      qty.verge += g.v1 - g.v0;
      if (on.vetar) B('d_vetar', G.sweep([g.pl.at(g.u, g.v0 - 0.012), g.pl.at(g.u, g.v1)], vergeSec, g.pl.ux.clone().multiplyScalar(g.sg), g.pl.n));
    });
    S.tops.forEach(function (g) {
      qty.verge += g.u1 - g.u0;
      if (on.vetar) B('d_vetar', G.sweep([g.pl.at(g.u0, g.v), g.pl.at(g.u1, g.v)], vergeSec, g.pl.vy, g.pl.n));
    });

    /* ================= eaves: drip edge, gutters, downpipes ================== */
    var T = S.terrace;
    function groundY(x, z) { return T && x > T.x0 && x < T.x1 && z > T.z0 && z < T.z1 ? TER : 0; }
    var dripSec = SEC.okapnica;
    function drip(pl, u0, u1) { B('d_okapnica', G.sweep([pl.at(u0, 0), pl.at(u1, 0)], dripSec, pl.vy.clone().negate(), pl.n)); }
    (S.dripOnly || []).forEach(function (e) { qty.eave += e.u1 - e.u0; if (on.okapnica) drip(e.pl, e.u0, e.u1); });

    // downpipes per eave: at least one, plus one per every R.downpipeEvery metres (catalog.js); the state may override the total
    var capable = S.eaves.filter(function (e) { return e.pipes > 0; });
    capable.forEach(function (e) {
      var len = e.u1 - e.u0;
      e.nAuto = 1 + Math.floor(len / R.downpipeEvery + 1e-6);
      e.nMax = Math.max(e.nAuto, Math.min(8, Math.floor(len / 2.5)));
      e.n = e.nAuto;
    });
    var minP = capable.length, maxP = capable.reduce(function (s, e) { return s + e.nMax; }, 0), autoP = capable.reduce(function (s, e) { return s + e.nAuto; }, 0);
    if (state.vert !== 'auto' && +state.vert) {
      var want = Math.min(maxP, Math.max(minP, +state.vert)), tot = minP;
      capable.forEach(function (e) { e.n = 1; });
      while (tot < want) {
        var best = null;
        capable.forEach(function (e) { if (e.n < e.nMax && (!best || (e.u1 - e.u0) / e.n > (best.u1 - best.u0) / best.n)) best = e; });
        if (!best) break;
        best.n++; tot++;
      }
    }
    S.pipeRange = { min: minP, max: maxP, auto: autoP };

    var gsec = G.gutterSection(gdef), gdepth = G.gutterDepth(gdef), gw = gdef.size, FALL = R.gutterFall / 1000;
    var hookGeo = G.hook(gdef), pr = pdef.size / 2;
    S.eaves.forEach(function (e, ei) {
      var pl = e.pl, out = pl.inward.clone().negate(), dir = pl.ux, len = e.u1 - e.u0;
      qty.eave += len;
      if (on.okapnica) drip(pl, e.u0, e.u1);
      // gutter origin line = top of the back edge, 35 mm behind the sheet end, 28 mm below it
      var ga = e.u0 + 0.035 * e.cA, gb = e.u1 - 0.035 * e.cB;
      function org(u, drop) { return pl.at(u, 0).addScaledVector(out, -0.035).addScaledVector(UP, -0.028 - drop); }
      var n = e.n || 0, pu = [];                    // pipe stations (u)
      if (n === 1) pu = [e.end === 'b' ? e.u1 - e.offB : e.u0 + e.offA];
      else if (n > 1) {
        var pa = e.u0 + Math.max(e.offA, e.end ? 0.6 : 0), pb = e.u1 - Math.max(e.offB, e.end ? 0.6 : 0);
        for (var pi0 = 0; pi0 < n; pi0++) pu.push(pa + pi0 * (pb - pa) / (n - 1));
      }
      // stations with fall towards the outlets: high points halfway between outlets and at long free ends
      var st;
      if (n) {
        var hp = [], lH = pu[0] - ga > 1.0, rH = gb - pu[n - 1] > 1.0, dr = [], i0;
        for (i0 = 0; i0 < n - 1; i0++) hp.push((pu[i0] + pu[i0 + 1]) / 2);
        for (i0 = 0; i0 < n; i0++) {
          var lr = i0 ? pu[i0] - hp[i0 - 1] : (lH ? pu[0] - ga : 0), rr = i0 < n - 1 ? hp[i0] - pu[i0] : (rH ? gb - pu[n - 1] : 0);
          dr.push(Math.max(lr, rr) * FALL);
        }
        st = [[ga, lH ? 0 : dr[0]]];
        for (i0 = 0; i0 < n; i0++) {
          if (pu[i0] - st[st.length - 1][0] > 1e-3) st.push([pu[i0], dr[i0]]);
          else st[st.length - 1][1] = dr[i0];
          if (i0 < n - 1) st.push([hp[i0], 0]);
        }
        if (gb - st[st.length - 1][0] > 1e-3) st.push([gb, rH ? 0 : dr[n - 1]]);
      } else { var m2 = (ga + gb) / 2, d2 = (gb - ga) / 2 * FALL; st = [[ga, d2], [m2, 0], [gb, d2]]; }
      function dropAt(u) {
        for (var i = 0; i < st.length - 1; i++) if (u >= st[i][0] - 1e-6 && u <= st[i + 1][0] + 1e-6) {
          var t = (u - st[i][0]) / Math.max(1e-6, st[i + 1][0] - st[i][0]); return st[i][1] + (st[i + 1][1] - st[i][1]) * t;
        }
        return 0;
      }
      var pts = st.map(function (s) { return org(s[0], s[1]); });
      B('gutter', G.sweep(pts, gsec, out, UP, { smooth: gdef.shape === 'round', shearA: e.cA, shearB: e.cB }));
      var ecaps = 0, ecorn = 0;
      if (!e.cA) { B('gutter', G.cap(pts[0], gsec, out, UP)); qty.caps++; ecaps++; } else { qty.corners += 0.5; ecorn += 0.5; }
      if (!e.cB) { B('gutter', G.cap(pts[pts.length - 1], gsec, out, UP)); qty.caps++; ecaps++; } else { qty.corners += 0.5; ecorn += 0.5; }
      qty.gutter += gb - ga;
      if (!lite) {
        // water runs towards the lower end of every station pair; equal ends: towards the outlet station
        for (var wi = 0; wi < st.length - 1; wi++) {
          var toB = st[wi + 1][1] > st[wi][1] + 1e-6 ? true : st[wi + 1][1] < st[wi][1] - 1e-6 ? false : pu.indexOf(st[wi + 1][0]) >= 0;
          FXD.gutters.push({ a: pts[wi].clone(), b: pts[wi + 1].clone(), toB: toB, out: out.clone(), w: gw, depth: gdepth });
        }
        FXD.eaves.push({ a: pl.at(e.u0, 0), b: pl.at(e.u1, 0), ga: pts[0].clone(), gb: pts[pts.length - 1].clone(), out: out.clone(), dir: dir.clone(), n: n, pl: pl, wallOff: e.wallOff, gw: gw,
          slides: pl.snow && pl.pitch >= rad(15) });
      }
      // hooks: first and last R.hookEndMargin from the ends, then every R.hookSpacing (rounded up)
      var run = gb - ga, hm = Math.min(R.hookEndMargin, run / 4), nh = Math.max(2, Math.ceil((run - 2 * hm) / R.hookSpacing - 1e-6) + 1);
      for (var hi = 0; hi < nh; hi++) {
        var hu = ga + hm + hi * (run - 2 * hm) / (nh - 1);
        inst.hook.push(new THREE.Matrix4().makeBasis(dir, UP, out).setPosition(org(hu, dropAt(hu))));
        qty.hooks++;
      }
      var eq = { name: pl.name, len: run, hooks: nh, caps: ecaps, corners: ecorn, pipes: [], out: [out.x, out.z] };
      qty.eaveList.push(eq);
      // outlets and downpipes
      pu.forEach(function (u, pi) {
        var o = org(u, dropAt(u)), top = o.clone().addScaledVector(out, gw / 2).addScaledVector(UP, -gdepth);
        var wallPt = pl.at(u, 0).addScaledVector(out, -e.wallOff);           // on the wall face, at eave height
        var sW = pr + 0.035, sC = top.clone().sub(wallPt).dot(out), gy = groundY(wallPt.x + out.x * 0.2, wallPt.z + out.z * 0.2);
        function P(s, y) { return v(wallPt.x + out.x * s, y, wallPt.z + out.z * s); }
        var yN = top.y - 0.11, yW = yN - (sC - sW) * Math.tan(rad(18));
        var path = [P(sC, top.y + 0.012), P(sC, yN), P(sW, yW), P(sW, gy + 0.32), P(sW + 0.17, gy + 0.14)];
        var pp = G.pipe(path, pdef, dir);
        B('gutter', pp.geo);
        // outlet stub (sabirnik): slightly wider collar under the gutter
        B('gutter', G.pipe([P(sC, top.y + 0.02), P(sC, top.y - 0.07)], { shape: pdef.shape, size: pdef.size * 1.12 }, dir).geo);
        // ordered length: eave height above the terrain + R.downpipeExtra, rounded up to R.sheetRound
        var pLen = Math.ceil((pl.at(u, 0).y + R.downpipeExtra) / R.sheetRound - 1e-6) * R.sheetRound, nc = Math.max(2, Math.ceil(pLen / R.clampSpacing - 1e-6));
        qty.pipes++; qty.pipeLen += pLen;
        eq.pipes.push(pLen);
        var cy0 = gy + 0.55, cy1 = Math.max(cy0 + 0.5, yW - 0.25);
        for (var ci = 0; ci < nc; ci++) {
          inst.bracket.push(new THREE.Matrix4().makeBasis(dir, UP, out).setPosition(P(sW, cy0 + ci * (cy1 - cy0) / (nc - 1))));
          qty.brackets++;
        }
        var stone = G.box(-0.16, 0, -0.02, 0.16, 0.05, 0.5);
        stone.applyMatrix4(new THREE.Matrix4().makeBasis(dir, UP, out).setPosition(P(0.02, gy)));
        B('stone', stone);
        if (!lite) FXD.outlets.push({ top: top.clone(), foot: P(sW + 0.17, gy + 0.14), elbow: P(sW, gy + 0.32), out: out.clone(), dir: dir.clone(), ground: gy, r: pr, eave: ei });
        if (ei === 0 && pi === 0) { S.pipe0 = { x: P(sW, 0), gy: gy, top: top.y, dir: dir.clone(), out: out.clone(), left: u < (e.u0 + e.u1) / 2 }; }
        if (ei === 0 && pi === 0) S.anchors.pipe = P(sW, Math.min(2.1, yW - 0.6));
        if (ei === 0 && pi === 0) { S.anchors.gutter = o.clone(); S.anchors.pipeView = out.clone().addScaledVector(dir, u < (e.u0 + e.u1) / 2 ? -0.8 : 0.8); }
      });
    });

    /* ================= snow guards: rows per plane by the rule in catalog.js ===== */
    if (on.snego) {
      var snowGeo = [], ring = [];
      for (var ri = 0; ri < 8; ri++) ring.push([Math.cos(ri / 8 * 6.283) * 0.014, Math.sin(ri / 8 * 6.283) * 0.014]);
      S.planes.forEach(function (pl) {
        if (!pl.guards) return;
        var deg = pl.pitch * 180 / Math.PI, rows = H.snowRows(state, deg, pl.S);
        if (!rows) return;
        var first = R.snowFirstRow, stepV = (pl.S - first) / rows;
        for (var k = 0; k < rows; k++) {
          var vS = first + k * stepV;
          if (k === 0) pl.guardV = vS;
          var iv = [];
          (pl.polys || [pl.poly]).forEach(function (po) { iv = iv.concat(G.rowsAt(po, vS)); });
          iv.sort(function (a, b) { return a[0] - b[0]; });
          var merged = [];
          iv.forEach(function (q) { var l = merged[merged.length - 1]; if (l && q[0] - l[1] < 0.08) l[1] = Math.max(l[1], q[1]); else merged.push(q.slice()); });
          var rowLen = 0;
          merged.forEach(function (q) {
            var u0 = q[0] + R.snowEdgeMargin, u1 = q[1] - R.snowEdgeMargin;
            if (u1 - u0 < 0.9) return;
            rowLen += u1 - u0;
            qty.snow += u1 - u0;
            [[0.0, 0.062], [0.012, 0.115]].forEach(function (c) {
              var sec = ring.map(function (r) { return [r[0] + c[0], r[1] + ribH + c[1]]; });
              B('d_snego', G.sweep([pl.at(u0, vS), pl.at(u1, vS)], sec, pl.vy, pl.n, { closed: true, smooth: true }));
            });
            var nb = Math.max(2, Math.ceil((u1 - u0 - 0.2) / R.snowBracketSpacing - 1e-6) + 1);
            qty.snowBrackets += nb;
            for (var i = 0; i < nb; i++) inst.snow.push(new THREE.Matrix4().makeBasis(pl.ux, pl.n, pl.vy).setPosition(pl.at(u0 + 0.1 + i * (u1 - u0 - 0.2) / (nb - 1), vS, ribH)));
          });
          if (rowLen > 0) { pl.qty.snowRows++; pl.qty.snowLen.push(rowLen); qty.snowRows++; }
        }
      });
    }

    /* ================= chimney with flashing kit ================================ */
    if (S.chimney) {
      var c = S.chimney, pl = c.pl, hf = 0.29, tpc = Math.tan(pl.pitch);
      var yC = pl.o.y - (pl.n.x * (c.x - pl.o.x) + pl.n.z * (c.z - pl.o.z)) / pl.n.y;     // roof height at the chimney centre
      var e1 = pl.ux, e2 = pl.inward, liftC = (ribH + 0.005) / pl.n.y;
      var CP = function (a, b, y) { return v(c.x + e1.x * a + e2.x * b, y, c.z + e1.z * a + e2.z * b); };
      var yRf = function (b) { return yC + b * tpc + liftC; };
      B('chimney', G.box(c.x - hf, yC - hf * tpc - 0.4, c.z - hf, c.x + hf, c.top, c.z + hf));
      B('crown', G.box(c.x - hf - 0.05, c.top, c.z - hf - 0.05, c.x + hf + 0.05, c.top + 0.07, c.z + hf + 0.05));
      B('foam', G.box(c.x - 0.11, c.top + 0.07, c.z - 0.11, c.x + 0.11, c.top + 0.075, c.z + 0.11));
      qty.chimney = 1;
      FXD.chimney = { x: c.x, z: c.z, top: c.top + 0.07, hf: hf + 0.05, yC: yC };
      S.anchors.ridge = v(c.x, c.top + 0.2, c.z);
      S.anchors.chimneyBase = CP(0, -hf, yRf(-hf));
      if (on.opsivka) {
        var o4 = hf + 0.005, hh = 0.15;
        // lower apron + the plate lying on the sheet below the chimney
        B('d_opsivka', quadUV(CP(-o4 - 0.02, -o4, yRf(-hf)), CP(o4 + 0.02, -o4, yRf(-hf)), CP(o4 + 0.02, -o4, yRf(-hf) + hh), CP(-o4 - 0.02, -o4, yRf(-hf) + hh)));
        B('d_opsivka', quadUV(CP(-o4 - 0.1, -hf - 0.2, yRf(-hf - 0.2)), CP(o4 + 0.1, -hf - 0.2, yRf(-hf - 0.2)), CP(o4 + 0.1, -hf, yRf(-hf)), CP(-o4 - 0.1, -hf, yRf(-hf))));
        // upper face
        B('d_opsivka', quadUV(CP(-o4 - 0.02, o4, yRf(hf)), CP(o4 + 0.02, o4, yRf(hf)), CP(o4 + 0.02, o4, yRf(hf) + hh), CP(-o4 - 0.02, o4, yRf(hf) + hh)));
        // stepped side flashings
        [-1, 1].forEach(function (sg) {
          var n = 3, pts2 = [[-hf, yRf(-hf)], [hf, yRf(hf)]], i;
          for (i = n; i >= 1; i--) {
            var bR = -hf + i * 2 * hf / n, bL = -hf + (i - 1) * 2 * hf / n, topY = yRf(bR) + hh - 0.02;
            pts2.push([bR, topY]); pts2.push([bL, topY]);
          }
          var tri = THREE.ShapeUtils.triangulateShape(pts2.map(function (q) { return new THREE.Vector2(q[0], q[1]); }), []), pos = [];
          tri.forEach(function (t) { t.forEach(function (k) { var P3 = CP(sg * o4, pts2[k][0], pts2[k][1]); pos.push(P3.x, P3.y, P3.z); }); });
          var g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
          g.computeVertexNormals();
          B('d_opsivka', g);
        });
      }
      if (on.iksna) {
        // back pan behind the chimney and the two side channels, lying on the ribs, with an upturned outer edge
        var bw = hf + 0.14, b0 = -hf - 0.2, b1 = hf + 0.34;
        B('d_iksna', quadUV(CP(-bw, hf, yRf(hf)), CP(bw, hf, yRf(hf)), CP(bw, b1, yRf(b1)), CP(-bw, b1, yRf(b1))));
        [-1, 1].forEach(function (sg) {
          B('d_iksna', quadUV(CP(sg * hf, b0, yRf(b0)), CP(sg * bw, b0, yRf(b0)), CP(sg * bw, hf, yRf(hf)), CP(sg * hf, hf, yRf(hf))));
          B('d_iksna', quadUV(CP(sg * bw, b0, yRf(b0)), CP(sg * bw, b1, yRf(b1)), CP(sg * bw, b1, yRf(b1) + 0.025), CP(sg * bw, b0, yRf(b0) + 0.025)));
        });
      }
      if (on.kapa) {
        var ky = c.top + 0.07, cone = new THREE.ConeGeometry((hf + 0.12) * Math.SQRT2, 0.17, 4, 1);
        cone.rotateY(Math.PI / 4); cone.translate(c.x, ky + 0.16 + 0.085, c.z);
        B('d_kapa', cone.toNonIndexed());
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
          var lx = c.x + q[0] * (hf - 0.02), lz = c.z + q[1] * (hf - 0.02);
          B('d_kapa', G.box(lx - 0.011, ky, lz - 0.011, lx + 0.011, ky + 0.165, lz + 0.011));
        });
      }
    }

    /* ================= parapet coping ============================================ */
    S.parapets.forEach(function (q) {
      qty.coping += q.a.distanceTo(q.b);
      if (!on.parapet) return;
      B('d_parapet', G.sweep([q.a, q.b], SEC.parapet, q.nrm, UP, { shearA: q.sA, shearB: q.sB }));
    });

    /* ================= ground pieces that belong to the house ===================== */
    if (T) {
      var tg = G.box(T.x0, 0, T.z0, T.x1, TER, T.z1), tpa = tg.attributes.position, tu = tg.attributes.uv;
      for (var ti = 0; ti < tpa.count; ti++) tu.setXY(ti, tpa.getX(ti), tpa.getZ(ti));
      B('terrace', tg);
    }
    S.walls.forEach(function (w) {
      if (w.base === false) return;
      var a = w.pt(-0.45, 0, 0), b = w.pt(w.len + 0.45, 0, 0), mid = w.pt(w.len / 2, 0, 0.3), gy = groundY(mid.x, mid.z);
      if (!gy) B('gravel', quadM(a.clone().setY(0.02), b.clone().setY(0.02), b.clone().addScaledVector(w.nrm, 0.45).setY(0.02), a.clone().addScaledVector(w.nrm, 0.45).setY(0.02)));
      // contact shadow along the base: uv.v = 1 at the wall
      var a2 = w.pt(0, gy + 0.026, 0), b2 = w.pt(w.len, gy + 0.026, 0);
      B('ao', quadUV(a2.clone().addScaledVector(w.nrm, 0.7), b2.clone().addScaledVector(w.nrm, 0.7), b2, a2));
    });

    /* ================= dimension lines and inspector targets ======================= */
    var kote = [], det = {};
    if (!lite) {
      var e0k = S.eaves[0], pk = e0k.pl, outK = pk.inward.clone().negate(), fm = function (x, d) { return TK.n(x, d === undefined ? 2 : d); };
      var eA = pk.at(e0k.u0, 0), eB = pk.at(e0k.u1, 0);
      if (S.ridges.length) { var rg = S.ridges[0]; kote.push({ id: 'sleme', a: rg.a.clone(), b: rg.b.clone(), off: v(0, 0.6, 0), label: TK.t('k.kota.sleme', { v: fm(rg.a.distanceTo(rg.b)) }) }); }
      // slope length along the left edge of the first plane
      var spanL = G.spanAt((pk.polys || [pk.polySlab || pk.poly])[0], e0k.u0 + 0.001) || [0, roofInfo.S], sA = pk.at(e0k.u0, spanL[0]), sB = pk.at(e0k.u0, spanL[1]);
      if (S.dims.flat) { sA = pk.at(e0k.u0, 0); sB = pk.at(e0k.u0, roofInfo.S); }
      kote.push({ id: 'ravan', a: sA, b: sB, off: pk.ux.clone().multiplyScalar(-0.55).addScaledVector(pk.n, 0.1), label: TK.t('k.kota.ravan', { v: fm(sA.distanceTo(sB)) }) });
      kote.push({ id: 'streha', a: v(eA.x, groundY(eA.x, eA.z), eA.z), b: eA.clone(), off: pk.ux.clone().multiplyScalar(-0.75).addScaledVector(outK, 0.25), label: TK.t('k.kota.streha', { v: fm(eA.y - groundY(eA.x, eA.z)) }) });
      kote.push({ id: 'oluk', a: eA.clone(), b: eB.clone(), off: outK.clone().multiplyScalar(0.55).add(v(0, -0.42, 0)), label: TK.t('k.kota.oluk', { v: fm(eA.distanceTo(eB)) }) });
      if (S.pipe0) { var q0 = S.pipe0, sd = q0.dir.clone().multiplyScalar(q0.left ? 0.5 : -0.5);
        kote.push({ id: 'vertikala', a: v(q0.x.x, q0.gy, q0.x.z), b: v(q0.x.x, q0.top, q0.x.z), off: sd.addScaledVector(q0.out, 0.12), label: TK.t('k.kota.vertikala', { v: fm(q0.top - q0.gy) }) }); }
      if (FXD.chimney) { var ck = FXD.chimney; kote.push({ id: 'dimnjak', a: v(ck.x + ck.hf, ck.yC, ck.z), b: v(ck.x + ck.hf, ck.top, ck.z), off: v(0.45, 0, 0), label: TK.t('k.kota.dimnjak', { v: fm(ck.top - ck.yC) }) }); }
      // pitch arc at the eave corner, in the plane of the gable
      kote.push({ id: 'nagib', arc: true, c: pk.at(e0k.u0, 0).addScaledVector(pk.ux, -0.04), d0: pk.inward.clone(), d1: pk.vy.clone(), r: Math.min(1.5, roofInfo.S * 0.4), label: TK.t('k.kota.nagib', { v: Math.round(pk.pitch * 180 / Math.PI) }) });
      // covering width of one sheet, measured between two seams near the eave
      var kS = Math.max(1, Math.round((e0k.u1 - e0k.u0) * 0.3 / prof.useful)), aN = pk.anchor !== undefined ? pk.anchor : e0k.u0, uS = aN + kS * prof.useful;
      if (uS + prof.useful < e0k.u1) kote.push({ id: 'tabla', a: pk.at(uS, 0.3, ribH + 0.02), b: pk.at(uS + prof.useful, 0.3, ribH + 0.02), off: pk.vy.clone().multiplyScalar(0.45).addScaledVector(pk.n, 0.12), label: TK.t('k.kota.tabla', { v: Math.round(prof.useful * 1000) }) });

      // where the camera goes for each flashing detail: target, direction to the camera, framing radius
      var side0 = outK.clone().addScaledVector(pk.ux, -0.75), cm = S.chimney, ch = FXD.chimney;
      var dv = function (base, y) { return base.clone().setY(y).normalize(); };
      if (S.ridges.length) det.sleme = { t: S.ridges[0].a.clone().lerp(S.ridges[0].b, 0.2), dir: dv(side0, 0.55), r: 1.5 };
      if (S.verges.length) { var vg = S.verges[0]; det.vetar = { t: vg.pl.at(vg.u, vg.v0 + (vg.v1 - vg.v0) * 0.3), dir: dv(vg.pl.inward.clone().negate().addScaledVector(vg.pl.ux, vg.sg * 1.4), 0.35), r: 1.3 }; }
      det.okapnica = { t: pk.at(e0k.u0 + 1.1, 0).add(v(0, -0.03, 0)), dir: dv(outK.clone().addScaledVector(pk.ux, -1.1), 0.3), r: 0.85 };
      S.planes.some(function (q) { if (q.guardV) { var sp2 = (q.polys || [q.poly])[0], um = G.rowsAt(sp2, q.guardV)[0]; det.snego = { t: q.at(um[0] + 1.6, q.guardV, 0.1), dir: dv(q.inward.clone().negate().addScaledVector(q.ux, -0.8), 0.42), r: 1.3 }; return true; } return false; });
      if (ch) {
        var cdir = dv(cm.pl.inward.clone().negate().addScaledVector(cm.pl.ux, -0.8), 0.5);
        det.opsivka = { t: v(ch.x, ch.yC + 0.25, ch.z), dir: cdir, r: 0.9 };
        det.iksna = { t: v(ch.x, ch.yC + 0.3, ch.z), dir: dv(cm.pl.inward.clone().addScaledVector(cm.pl.ux, -0.9), 1.1), r: 0.9 };
        det.kapa = { t: v(ch.x, ch.top + 0.1, ch.z), dir: dv(cdir, 0.25), r: 0.75 };
      }
      if (S.anchors.valley) det.uvala = { t: S.anchors.valley.clone(), dir: v(0.45, 0.75, 1).normalize(), r: 1.9 };
      if (S.parapets.length) { var pq = S.parapets[1] || S.parapets[0]; det.parapet = { t: pq.a.clone().lerp(pq.b, 0.25), dir: dv(pq.nrm.clone().addScaledVector(v(-1, 0, 0), 0.7), 0.4), r: 1.0 }; }
      if (S.anchors.window) det.solbank = { t: S.anchors.window.clone().add(v(0, -0.72, 0)), dir: v(-0.7, 0.25, 1).normalize(), r: 0.9 };
      if (FXD.sills.length) { var s0 = FXD.sills[0]; det.solbank = { t: s0.a.clone().lerp(s0.b, 0.5), dir: dv(s0.nrm.clone().addScaledVector(s0.dir, -0.8), 0.3), r: 0.85 }; }
      S.planes.forEach(function (q) { FXD.planes.push({ pl: q, guardV: q.guardV || 0, slides: q.snow && q.pitch >= rad(15), S: roofInfo.S }); });
      FXD.terrace = T; FXD.ribH = ribH;
    }

    /* ================= assemble meshes =========================================== */
    var M = TK.mat, group = new THREE.Group(), stats = { tris: 0 }, proxy = [];
    function mesh(name, mat, o) {
      var g = G.merge(bk[name] || [], name === 'roof' || name === 'interior' || name === 'sheetWall');
      if (!g) return null;
      var m = new THREE.Mesh(g, mat);
      m.name = name;
      m.castShadow = !(o && o.noCast); m.receiveShadow = !(o && o.noRecv);
      if (o && o.order) m.renderOrder = o.order;
      if (o && o.noAO) m.layers.set(1);            // layer 1: drawn by the main camera, skipped by the ambient-occlusion pre-pass
      group.add(m);
      stats.tris += g.attributes.position.count / 3;
      return m;
    }
    ['wall0', 'wall1', 'wall2'].forEach(function (n, i) { var m = mesh(n, MS.wall[i]); if (m) proxy.push(m); });
    mesh('sokl', M.sokl); proxy.push(mesh('fascia', M.fascia)); mesh('roof', MS.roof); mesh('flash', MS.flash); mesh('foam', M.foam);
    var swm = mesh('sheetWall', MS.sheet || MS.roof); if (swm) proxy.push(swm);
    D.details.forEach(function (d) { mesh('d_' + d.id, MS.flash); });
    mesh('gutter', MS.gutter); mesh('frame', MS.frame); var chm = mesh('chimney', M.chimney); if (chm) proxy.push(chm); mesh('crown', M.crown);
    mesh('stone', M.stone); mesh('terrace', M.terrace); mesh('gravel', M.gravel, { noCast: true });
    mesh('interior', M.interior, { noCast: true, noRecv: true });
    mesh('curtain', M.curtain, { noCast: true, noAO: true });
    mesh('dirtSill', M.dirtSill, { noCast: true, noRecv: true, order: 2, noAO: true });
    mesh('dirtBase', M.dirtBase, { noCast: true, noRecv: true, order: 2, noAO: true });
    mesh('ao', M.ao, { noCast: true, noRecv: true, order: 2, noAO: true });
    mesh('glass', M.glass, { noCast: true, noRecv: true, order: 3, noAO: true });

    function instanced(geo, mat, list, name, noCast) {
      if (!list.length) { geo.dispose(); return; }
      var im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach(function (m, i) { im.setMatrixAt(i, m); });
      im.castShadow = !noCast; im.receiveShadow = true;
      if (name) im.name = name;
      group.add(im);
      stats.tris += (geo.index ? geo.index.count : geo.attributes.position.count) / 3 * list.length;
    }
    instanced(hookGeo, MS.gutter, inst.hook);
    // pipe bracket: collar + wall pin (local: x along the wall, y up, z out; origin at the pipe centre)
    var brG;
    if (pdef.shape === 'round') { brG = new THREE.TorusGeometry(pr + 0.004, 0.006, 6, 20); brG.rotateX(Math.PI / 2); }
    else brG = G.merge([G.box(-pr - 0.006, -0.012, -pr - 0.006, pr + 0.006, 0.012, -pr), G.box(-pr - 0.006, -0.012, pr, pr + 0.006, 0.012, pr + 0.006),
      G.box(-pr - 0.006, -0.012, -pr, -pr, 0.012, pr), G.box(pr, -0.012, -pr, pr + 0.006, 0.012, pr)]);
    var pin = G.box(-0.006, -0.006, -pr - 0.04, 0.006, 0.006, -pr);
    instanced(G.merge([brG, pin]), MS.gutter, inst.bracket);
    brG.dispose(); pin.dispose();
    // snow-guard bracket: a triangular plate standing on the rib (local: x along the eave, y normal, z up-slope)
    var sb = G.sweep([v(-0.003, 0, 0), v(0.003, 0, 0)], SEC.snego.slice(0, 4), v(0, 0, 1), v(0, 1, 0), { closed: true });
    instanced(sb, MS.flash, inst.snow, 'd_snego');
    instanced(G.screw(opt.screwLod > 1), M.screw, inst.screw, 'screws', true);
    var late = [];             // secondary parts: the boot sequence shows them one frame after the house itself
    group.children.forEach(function (o) {
      if (o.name === 'screws') o.layers.set(1);
      if (/^(screws|dirtSill|dirtBase|curtain|ao)$/.test(o.name)) { late.push(o); if (opt.defer) o.visible = false; }
    });

    // the merged meshes own copies: the source pieces are freed right away (no leak across rebuilds)
    Object.keys(bk).forEach(function (k) { bk[k].forEach(function (g) { if (g && g.dispose) g.dispose(); }); delete bk[k]; });

    // rounded, human-readable quantities
    qty.area = +qty.area.toFixed(1);
    qty.sheetCount = qty.sheets.length;
    qty.sheetRun = +qty.sheets.reduce(function (s, x) { return s + Math.ceil(x * 20) / 20; }, 0).toFixed(1);
    qty.sheetGross = +(qty.sheetRun * prof.total).toFixed(1);
    S.planes.forEach(function (q) { qty.plan += q.plan || 0; });
    qty.corners = Math.round(qty.corners);
    ['ridge', 'hip', 'valley', 'verge', 'eave', 'gutter', 'pipeLen', 'snow', 'coping', 'sills', 'plan'].forEach(function (k) { qty[k] = +qty[k].toFixed(2); });
    qty.chimneys = S.chimney ? 1 : 0;
    qty.eaveHeight = +roofInfo.yE.toFixed(3);

    return {
      group: group, qty: qty, anchors: S.anchors, dims: S.dims, terrace: S.terrace, pipeRange: S.pipeRange, stats: stats, profile: prof, dim: dim,
      kote: kote, det: det, fx: FXD, proxy: proxy.filter(Boolean), state: state, late: late,
      parts: function (id) { var out = []; group.children.forEach(function (o) { if (o.name === 'd_' + id) out.push(o); }); return out; },
      dispose: function () {
        group.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
        if (group.parent) group.parent.remove(group);
      }
    };
  };
})();
