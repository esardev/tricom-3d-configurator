/* ==========================================================================
   TRICOM konfigurator — k-textures.js
   Every texture is drawn at runtime on a canvas: no image requests.
   All colour maps are near-neutral so material.color can tint them.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var T = TK.tex = {};

  /* ---- helpers ---------------------------------------------------------- */
  function rng(seed) {                       // mulberry32
    var a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  T.rng = rng;

  function mk(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h || w;
    return c;
  }

  // Tileable value noise, one octave: `cells` lattice cells across the tile.
  function noiseOct(out, size, cells, amp, rand) {
    var g = new Float32Array(cells * cells), i, x, y;
    for (i = 0; i < g.length; i++) g[i] = rand();
    var s = cells / size;
    for (y = 0; y < size; y++) {
      var fy = y * s, y0 = Math.floor(fy), ty = fy - y0; ty = ty * ty * (3 - 2 * ty);
      var r0 = (y0 % cells) * cells, r1 = ((y0 + 1) % cells) * cells;
      for (x = 0; x < size; x++) {
        var fx = x * s, x0 = Math.floor(fx), tx = fx - x0; tx = tx * tx * (3 - 2 * tx);
        var c0 = x0 % cells, c1 = (x0 + 1) % cells;
        var a = g[r0 + c0] + (g[r0 + c1] - g[r0 + c0]) * tx;
        var b = g[r1 + c0] + (g[r1 + c1] - g[r1 + c0]) * tx;
        out[y * size + x] += (a + (b - a) * ty) * amp;
      }
    }
  }
  // fbm in 0..1
  function fbm(size, cells, oct, seed) {
    var out = new Float32Array(size * size), rand = rng(seed), amp = 0.5, tot = 0;
    for (var o = 0; o < oct && cells <= size; o++) {
      noiseOct(out, size, cells, amp, rand);
      tot += amp; amp *= 0.5; cells *= 2;
    }
    for (var i = 0; i < out.length; i++) out[i] /= tot;
    return out;
  }
  T.fbm = fbm;

  // Height field (Float32Array, size²) -> tangent-space normal map canvas.
  function normalCanvas(h, size, strength) {
    var c = mk(size), ctx = c.getContext('2d'), img = ctx.createImageData(size, size), d = img.data;
    for (var y = 0; y < size; y++) {
      var yu = ((y - 1 + size) % size) * size, yd = ((y + 1) % size) * size, yy = y * size;
      for (var x = 0; x < size; x++) {
        var xl = (x - 1 + size) % size, xr = (x + 1) % size;
        var dx = (h[yy + xr] - h[yy + xl]) * strength;
        var dy = (h[yd + x] - h[yu + x]) * strength;   // canvas y runs down = -v
        var inv = 1 / Math.sqrt(dx * dx + dy * dy + 1), o = (yy + x) * 4;
        d[o] = (-dx * inv * 0.5 + 0.5) * 255;
        d[o + 1] = (dy * inv * 0.5 + 0.5) * 255;
        d[o + 2] = (inv * 0.5 + 0.5) * 255;
        d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  function grayCanvas(v, size, lo, hi) {
    var c = mk(size), ctx = c.getContext('2d'), img = ctx.createImageData(size, size), d = img.data;
    for (var i = 0; i < v.length; i++) {
      var g = (lo + (hi - lo) * v[i]) * 255, o = i * 4;
      d[o] = d[o + 1] = d[o + 2] = g; d[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  // metres: real-world size of one tile. Repeat is set so UVs are in metres.
  function tex(canvas, metresX, metresY, srgb) {
    var t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1 / metresX, 1 / (metresY || metresX));
    if (srgb) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = T.aniso || 4;
    return t;
  }
  T.make = tex;

  function hexRgb(hex) {
    var n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* ---- plaster ---------------------------------------------------------- */
  T.plaster = function () {
    // sand-finish grain (normal map), blotchy weathering (colour) and a 2 % roughness variation
    var S = 512, n = fbm(S, 128, 3, 11), big = fbm(S, 3, 4, 12), mid = fbm(S, 24, 2, 13), h = new Float32Array(S * S), i;
    for (i = 0; i < h.length; i++) h[i] = n[i] * 0.8 + mid[i] * 0.2;
    var col = new Float32Array(S * S);
    for (i = 0; i < col.length; i++) col[i] = 0.25 * n[i] + 0.2 * mid[i] + 0.55 * big[i];
    var rc = mk(S), rx = rc.getContext('2d'), ri = rx.createImageData(S, S);
    for (i = 0; i < S * S; i++) { ri.data[i * 4] = 255; ri.data[i * 4 + 1] = (0.96 + 0.04 * mid[i]) * 255; ri.data[i * 4 + 2] = 0; ri.data[i * 4 + 3] = 255; }
    rx.putImageData(ri, 0, 0);
    return {
      map: tex(grayCanvas(col, S, 0.84, 0.97), 3.1, 3.1, true),
      normalMap: tex(normalCanvas(h, S, 1.5), 0.55, 0.55, false),
      roughnessMap: tex(rc, 1.3, 1.3, false)
    };
  };

  /* ---- klinker brick: 4 bricks x 8 courses = 1.04 m x 0.60 m ------------
     Bricks are drawn once in neutral grey on a transparent layer; paint(hex)
     tints only the bricks, so the mortar stays grey for every colour.      */
  T.brick = function () {
    var W = 1024, H = 512, L = mk(W, H), ctx = L.getContext('2d'), rand = rng(21);
    var hc = mk(W, H), hx = hc.getContext('2d');
    var bw = W / 4, bh = H / 8, j = 9, jy = 8;       // joint px (about 10 mm)
    hx.fillStyle = '#404040'; hx.fillRect(0, 0, W, H);
    for (var r = 0; r < 8; r++) {
      var off = (r % 2) * bw / 2;
      for (var k = -1; k < 4; k++) {
        var x = k * bw + off + j / 2, y = r * bh + jy / 2, w = bw - j, h = bh - jy;
        var v = 0.74 + rand() * 0.26, warm = (rand() - 0.5) * 0.10;
        var R = clamp01(v + warm) * 255, G = clamp01(v) * 255, B = clamp01(v - warm) * 255;
        ctx.fillStyle = 'rgb(' + (R | 0) + ',' + (G | 0) + ',' + (B | 0) + ')';
        ctx.fillRect(x, y, w, h);
        if (x + w > W) ctx.fillRect(x - W, y, w, h);
        for (var s = 0; s < 46; s++) {
          var sx = x + rand() * (w - 6), sy = y + rand() * (h - 3), a = rand() * 0.13;
          ctx.fillStyle = rand() > 0.5 ? 'rgba(0,0,0,' + a + ')' : 'rgba(255,255,255,' + a + ')';
          ctx.fillRect(sx % W, sy, 1 + rand() * 5, 1 + rand() * 2.5);
        }
        var hv = 200 + rand() * 40 | 0;
        hx.fillStyle = 'rgb(' + hv + ',' + hv + ',' + hv + ')';
        hx.fillRect(x, y, w, h);
        if (x + w > W) hx.fillRect(x - W, y, w, h);
      }
    }
    var hd = hx.getImageData(0, 0, W, H).data, nc = mk(W, H), nx = nc.getContext('2d'), img = nx.createImageData(W, H), d = img.data;
    var nz = fbm(512, 64, 2, 22);
    function hAt(x, y) { x = (x + W) % W; y = (y + H) % H; return hd[(y * W + x) * 4] / 255 + nz[(y % 512) * 512 + (x % 512)] * 0.12; }
    for (var py = 0; py < H; py++) for (var px = 0; px < W; px++) {
      var dx = (hAt(px + 1, py) - hAt(px - 1, py)) * 2.6, dy = (hAt(px, py + 1) - hAt(px, py - 1)) * 2.6;
      var inv = 1 / Math.sqrt(dx * dx + dy * dy + 1), o = (py * W + px) * 4;
      d[o] = (-dx * inv * 0.5 + 0.5) * 255; d[o + 1] = (dy * inv * 0.5 + 0.5) * 255; d[o + 2] = (inv * 0.5 + 0.5) * 255; d[o + 3] = 255;
    }
    nx.putImageData(img, 0, 0);
    var cache = {};
    return {
      normalMap: tex(nc, 1.04, 0.60, false),
      paint: function (hex) {
        if (cache[hex]) return cache[hex];
        var tmp = mk(W, H), tx = tmp.getContext('2d');
        tx.drawImage(L, 0, 0);
        tx.globalCompositeOperation = 'multiply'; tx.fillStyle = hex; tx.fillRect(0, 0, W, H);
        tx.globalCompositeOperation = 'destination-in'; tx.drawImage(L, 0, 0);
        var c = mk(W, H), cx = c.getContext('2d');
        cx.fillStyle = '#b7b2a8'; cx.fillRect(0, 0, W, H);
        cx.drawImage(tmp, 0, 0);
        return (cache[hex] = tex(c, 1.04, 0.60, true));
      }
    };
  };

  /* ---- zinc spangle: crystal cells ~40 mm on a 0.56 m tile --------------- */
  T.zinc = function () {
    var S = 512, N = 20, rand = rng(31), pts = [], i, x, y;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var ang = rand() * 6.283;
      pts.push({ x: (x + 0.15 + rand() * 0.7) / N, y: (y + 0.15 + rand() * 0.7) / N,
        b: rand(), r: rand(), nx: (rand() - 0.5), ny: (rand() - 0.5), dx: Math.cos(ang), dy: Math.sin(ang), f: 60 + rand() * 90 });
    }
    var cm = mk(S), cr = mk(S), cn = mk(S);
    var im = cm.getContext('2d').createImageData(S, S), ir = cr.getContext('2d').createImageData(S, S), inn = cn.getContext('2d').createImageData(S, S);
    var fine = fbm(S, 128, 2, 32);
    for (y = 0; y < S; y++) for (x = 0; x < S; x++) {
      var u = x / S, v = y / S, gx = Math.floor(u * N), gy = Math.floor(v * N), d1 = 9, d2 = 9, best = null, bx = 0, by = 0;
      for (var oy = -1; oy <= 1; oy++) for (var ox = -1; ox <= 1; ox++) {
        var cx = (gx + ox + N) % N, cy = (gy + oy + N) % N, p = pts[cy * N + cx];
        var ddx = u - p.x, ddy = v - p.y;
        if (ddx > 0.5) ddx -= 1; if (ddx < -0.5) ddx += 1;
        if (ddy > 0.5) ddy -= 1; if (ddy < -0.5) ddy += 1;
        var dd = ddx * ddx + ddy * ddy;
        if (dd < d1) { d2 = d1; d1 = dd; best = p; bx = ddx; by = ddy; } else if (dd < d2) d2 = dd;
      }
      var edge = clamp01((Math.sqrt(d2) - Math.sqrt(d1)) * N * 3.0);       // 0 at crystal border
      var feather = Math.sin((bx * best.dx + by * best.dy) * best.f * 6.283) * 0.5 + 0.5;
      var o = (y * S + x) * 4, n = fine[y * S + x];
      var b = 0.89 + best.b * 0.10 + feather * 0.02 - (1 - edge) * 0.03 + (n - 0.5) * 0.02;
      var g = clamp01(b) * 255;
      im.data[o] = g * 0.985; im.data[o + 1] = g * 0.995; im.data[o + 2] = g; im.data[o + 3] = 255;
      var ro = clamp01(0.74 + best.r * 0.26 - feather * 0.06 + (1 - edge) * 0.08) * 255;   // multiplies material.roughness
      ir.data[o] = 0; ir.data[o + 1] = ro; ir.data[o + 2] = 255; ir.data[o + 3] = 255;
      var tx = best.nx * 0.16 + (feather - 0.5) * best.dx * 0.03, ty = best.ny * 0.16 + (feather - 0.5) * best.dy * 0.03;
      var inv = 1 / Math.sqrt(tx * tx + ty * ty + 1);
      inn.data[o] = (tx * inv * 0.5 + 0.5) * 255; inn.data[o + 1] = (ty * inv * 0.5 + 0.5) * 255; inn.data[o + 2] = (inv * 0.5 + 0.5) * 255; inn.data[o + 3] = 255;
    }
    cm.getContext('2d').putImageData(im, 0, 0);
    cr.getContext('2d').putImageData(ir, 0, 0);
    cn.getContext('2d').putImageData(inn, 0, 0);
    return { map: tex(cm, 0.56, 0.56, true), roughnessMap: tex(cr, 0.56, 0.56, false), normalMap: tex(cn, 0.56, 0.56, false) };
  };

  /* ---- brushed metal: long streaks along v ------------------------------- */
  T.brushed = function () {
    var S = 512, rand = rng(41), h = new Float32Array(S * S), x, y;
    var col = new Float32Array(S);
    for (x = 0; x < S; x++) col[x] = rand();
    var wob = fbm(S, 8, 2, 42);
    for (y = 0; y < S; y++) for (x = 0; x < S; x++) {
      var xs = (x + ((wob[y * S + x] * 6) | 0)) % S;
      h[y * S + x] = col[xs] * 0.8 + rand() * 0.2;
    }
    var m = new Float32Array(S * S);
    for (var i = 0; i < m.length; i++) m[i] = h[i];
    return {
      map: tex(grayCanvas(m, S, 0.90, 1.0), 0.4, 0.8, true),
      normalMap: tex(normalCanvas(h, S, 0.55), 0.4, 0.8, false)
    };
  };

  /* ---- coated (RAL) sheet: faint orange-peel ----------------------------- */
  T.coat = function () {
    var S = 256, h = fbm(S, 64, 2, 51);
    return { normalMap: tex(normalCanvas(h, S, 0.5), 0.25, 0.25, false) };
  };

  /* ---- copper with patina: canvases are repainted when the slider moves -- */
  T.copper = function () {
    var S = 256, noiseA = fbm(S, 6, 5, 61), noiseB = fbm(S, 40, 3, 62), streak = fbm(S, 3, 2, 63);
    var cm = mk(S), co = mk(S);
    var out = { map: tex(cm, 1.3, 1.3, true), ormMap: tex(co, 1.3, 1.3, false) };
    var fresh = hexRgb('#B87333'), brown = hexRgb('#6A4630'), v1 = hexRgb('#5E9B8A'), v2 = hexRgb('#3F8F7B');
    out.paint = function (t) {            // t: 0..1
      var xm = cm.getContext('2d'), xo = co.getContext('2d'), im = xm.createImageData(S, S), io = xo.createImageData(S, S);
      // stage 1 (0..0.45): bright copper tarnishes to brown; stage 2 (0.25..1): verdigris grows through a noise mask
      var tar = clamp01(t / 0.45), grow = clamp01((t - 0.2) / 0.8);
      for (var i = 0; i < S * S; i++) {
        var n = noiseA[i] * 0.65 + noiseB[i] * 0.35, o = i * 4;
        var kt = clamp01(tar * 1.25 - (1 - n) * 0.35 * (1 - tar));
        var r = lerp(fresh[0], brown[0], kt), g = lerp(fresh[1], brown[1], kt), b = lerp(fresh[2], brown[2], kt);
        // threshold sweeps down as patina grows; soft edge
        var m = grow <= 0 ? 0 : clamp01((n - (1.05 - grow * 1.25)) * 5.0);
        var vm = streak[i], vr = lerp(v1[0], v2[0], vm), vg = lerp(v1[1], v2[1], vm), vb = lerp(v1[2], v2[2], vm);
        var shade = 0.74 + noiseB[i] * 0.2;          // patina is matt and reads darker than the swatch once it is sun-lit
        m *= 0.86 + 0.14 * noiseA[i];                // a little brown always shows through
        r = lerp(r, vr * shade, m); g = lerp(g, vg * shade, m); b = lerp(b, vb * shade, m);
        im.data[o] = r; im.data[o + 1] = g; im.data[o + 2] = b; im.data[o + 3] = 255;
        var rough = lerp(lerp(0.30, 0.55, kt), 0.92, m), metal = lerp(1.0, 0.05, m);
        io.data[o] = 255; io.data[o + 1] = rough * 255; io.data[o + 2] = metal * 255; io.data[o + 3] = 255;
      }
      xm.putImageData(im, 0, 0); xo.putImageData(io, 0, 0);
      out.map.needsUpdate = true; out.ormMap.needsUpdate = true;
    };
    out.paint(0);
    return out;
  };

  /* ---- lamperija: one 200 mm board with a V joint ------------------------ */
  T.lamperija = function () {
    var S = 128, h = new Float32Array(S * S), m = new Float32Array(S * S), n = fbm(S, 32, 2, 71);
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
      var e = Math.min(x, S - 1 - x);              // distance to the joint in px (1 px = 1.56 mm)
      var groove = e < 5 ? e / 5 : 1;
      h[y * S + x] = groove * 2.2 + n[y * S + x] * 0.05;
      m[y * S + x] = e < 2 ? 0.25 : (e < 5 ? 0.7 : 0.96 + n[y * S + x] * 0.04);
    }
    return { map: tex(grayCanvas(m, S, 0, 1), 0.2, 0.2, true), normalMap: tex(normalCanvas(h, S, 1.6), 0.2, 0.2, false) };
  };

  /* ---- lawn --------------------------------------------------------------- */
  function lawnCanvas(S, seed, base, cols, count) {
    var c = mk(S), ctx = c.getContext('2d'), rand = rng(seed);
    ctx.fillStyle = base; ctx.fillRect(0, 0, S, S);
    for (var i = 0; i < count; i++) {
      var x = rand() * S, y = rand() * S, l = 5 + rand() * 12, a = -1.57 + (rand() - 0.5) * 1.5;
      ctx.strokeStyle = cols[(rand() * cols.length) | 0];
      ctx.globalAlpha = 0.45 + rand() * 0.5;
      ctx.lineWidth = 0.9 + rand() * 1.6;
      for (var ox = -S; ox <= S; ox += S) for (var oy = -S; oy <= S; oy += S) {
        if (x + ox < -20 || x + ox > S + 20 || y + oy < -20 || y + oy > S + 20) continue;
        ctx.beginPath(); ctx.moveTo(x + ox, y + oy); ctx.lineTo(x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    return c;
  }
  T.grass = function () {
    var S = 1024, c = lawnCanvas(S, 81, '#3f5529', ['#465f2e', '#587238', '#657f41', '#4c6531', '#718a4b', '#3c5227', '#5e773c', '#7f9558'], 52000);
    // second texture: drier, shorter, yellower turf — blended in by a noise mask so the lawn is not one green
    var c2 = lawnCanvas(512, 83, '#5a6332', ['#6b7239', '#7c8046', '#8a8a50', '#60693a', '#96925a', '#525b2f', '#747a42'], 16000);
    var hsrc = c.getContext('2d').getImageData(0, 0, S, S).data, h = new Float32Array(S * S), i;
    for (i = 0; i < h.length; i++) h[i] = hsrc[i * 4 + 1] / 255;
    var macro = fbm(256, 4, 4, 82);
    return {
      map: tex(c, 2.6, 2.6, true),
      map2: tex(c2, 1.9, 1.9, true),
      normalMap: tex(normalCanvas(h, S, 3.0), 2.6, 2.6, false),
      macro: tex(grayCanvas(macro, 256, 0, 1), 1, 1, false)
    };
  };

  /* ---- dirt: rain streaks under a window sill and splash dirt above the plinth (alpha only) --- */
  T.streaks = function () {            // v = 1 at the sill, fades downward
    var W = 256, H = 256, c = mk(W, H), ctx = c.getContext('2d'), rand = rng(181), i;
    for (i = 0; i < 46; i++) {
      var x = rand() * W, w = 2 + rand() * 9, len = H * (0.25 + rand() * 0.75), a = 0.10 + rand() * 0.30;
      if (i < 6) { x = i < 3 ? rand() * 14 : W - rand() * 14; a = 0.45; len = H * (0.7 + rand() * 0.3); }      // heavier runs at both sill ends
      var g = ctx.createLinearGradient(0, 0, 0, len);
      g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.filter = 'blur(' + (1 + rand() * 2.5).toFixed(1) + 'px)';
      ctx.fillRect(x - w / 2, 0, w, len);
    }
    ctx.filter = 'none';
    var t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  };
  T.splash = function () {             // v = 0 at the plinth, fades upward; tiles along u
    var W = 512, H = 128, c = mk(W, H), ctx = c.getContext('2d'), n = fbm(512, 8, 5, 191), img = ctx.createImageData(W, H);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var up = 1 - y / H, k = n[(y * 2 % 512) * 512 + x], a = clamp01((1 - up * (1.15 + k * 1.3)) * (0.35 + k * 0.9));
      var o = (y * W + x) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 0; img.data[o + 3] = a * 255;
    }
    ctx.putImageData(img, 0, 0);
    var t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.anisotropy = 4; return t;
  };

  /* ---- soft cumulus billboard (alpha), lit from above ---------------------------------- */
  T.cloud = function (seed) {
    var W = 512, H = 256, c = mk(W, H), ctx = c.getContext('2d'), rand = rng(seed), i;
    ctx.filter = 'blur(9px)';
    for (i = 0; i < 46; i++) {
      var t = rand(), x = W * (0.14 + 0.72 * t) + (rand() - 0.5) * 30, hump = Math.sin(t * Math.PI), r = 20 + rand() * 46 * (0.4 + hump);
      var y = H * 0.70 - rand() * hump * H * 0.36;
      var g = ctx.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.6, 'rgba(236,240,246,0.75)'); g.addColorStop(1, 'rgba(205,212,224,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill();
    }
    ctx.filter = 'blur(14px)';                       // flat, slightly darker base
    ctx.globalCompositeOperation = 'source-atop';
    var sh = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.86);
    sh.addColorStop(0, 'rgba(150,160,178,0)'); sh.addColorStop(1, 'rgba(150,160,178,0.55)');
    ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-out'; ctx.filter = 'none';
    var cut = ctx.createLinearGradient(0, H * 0.76, 0, H * 0.92);
    cut.addColorStop(0, 'rgba(0,0,0,0)'); cut.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = cut; ctx.fillRect(0, H * 0.7, W, H * 0.3);
    var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; return tx;
  };

  /* ---- asphalt and a worn-path alpha strip ------------------------------------------------ */
  T.asphalt = function () {
    var S = 512, n = fbm(S, 128, 2, 201), big = fbm(S, 6, 3, 202), v = new Float32Array(S * S);
    for (var i = 0; i < v.length; i++) v[i] = n[i] * 0.6 + big[i] * 0.4;
    return { map: tex(grayCanvas(v, S, 0.55, 1.0), 3, 3, true), normalMap: tex(normalCanvas(n, S, 2.2), 0.8, 0.8, false) };
  };
  T.path = function () {               // u across the path (soft edges), v along it
    var W = 128, H = 512, c = mk(W, H), ctx = c.getContext('2d'), n = fbm(512, 10, 4, 211), img = ctx.createImageData(W, H);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var e = 1 - Math.abs(x / (W - 1) * 2 - 1), k = n[y * 512 + x * 4], a = clamp01((e - 0.18 - k * 0.42) * 2.6) * (0.55 + k * 0.45);
      var o = (y * W + x) * 4, g = 0.8 + k * 0.4;
      img.data[o] = 122 * g; img.data[o + 1] = 104 * g; img.data[o + 2] = 74 * g; img.data[o + 3] = a * 235;
    }
    ctx.putImageData(img, 0, 0);
    var t = new THREE.CanvasTexture(c); t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
  };

  /* ---- generic tileable noise (snow surface, wet sheen) ------------------------------------- */
  T.noise = function () {
    var S = 256, a = fbm(S, 8, 5, 221), b = fbm(S, 48, 3, 222), v = new Float32Array(S * S);
    for (var i = 0; i < v.length; i++) v[i] = a[i] * 0.6 + b[i] * 0.4;
    return { map: tex(grayCanvas(v, S, 0, 1), 1, 1, false), normalMap: tex(normalCanvas(v, S, 2.4), 1.6, 1.6, false) };
  };

  /* ---- terrace: 2 x 2 concrete slabs of 0.6 m with 2 mm joints ----------- */
  T.concrete = function () {
    var S = 1024, n = fbm(S, 8, 6, 91), c = grayCanvas(n, S, 0.80, 1.0), ctx = c.getContext('2d'), rand = rng(92);
    for (var i = 0; i < 2600; i++) {
      ctx.fillStyle = rand() > 0.5 ? 'rgba(0,0,0,' + rand() * 0.10 + ')' : 'rgba(255,255,255,' + rand() * 0.10 + ')';
      ctx.fillRect(rand() * S, rand() * S, 1 + rand() * 2, 1 + rand() * 2);
    }
    // slight tone difference per slab
    var tones = [0.0, 0.05, 0.03, 0.07];
    for (i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(0,0,0,' + tones[i] + ')'; ctx.fillRect((i % 2) * S / 2, ((i / 2) | 0) * S / 2, S / 2, S / 2); }
    ctx.fillStyle = 'rgba(40,40,40,0.85)';
    ctx.fillRect(0, 0, S, 1.5); ctx.fillRect(0, S / 2 - 1, S, 2); ctx.fillRect(0, S - 1.5, S, 1.5);
    ctx.fillRect(0, 0, 1.5, S); ctx.fillRect(S / 2 - 1, 0, 2, S); ctx.fillRect(S - 1.5, 0, 1.5, S);
    var hs = ctx.getImageData(0, 0, S, S).data, h = new Float32Array(S * S);
    for (i = 0; i < h.length; i++) h[i] = hs[i * 4] / 255;
    return { map: tex(c, 1.2, 1.2, true), normalMap: tex(normalCanvas(h, S, 1.3), 1.2, 1.2, false) };
  };

  /* ---- gravel strip -------------------------------------------------------- */
  T.gravel = function () {
    var S = 512, c = mk(S), ctx = c.getContext('2d'), rand = rng(101);
    ctx.fillStyle = '#8f8c86'; ctx.fillRect(0, 0, S, S);
    for (var i = 0; i < 5200; i++) {
      var x = rand() * S, y = rand() * S, r = 3 + rand() * 6, v = 150 + rand() * 95 | 0;
      for (var ox = -S; ox <= S; ox += S) for (var oy = -S; oy <= S; oy += S) {
        if (x + ox < -12 || x + ox > S + 12 || y + oy < -12 || y + oy > S + 12) continue;
        ctx.fillStyle = 'rgba(30,30,30,0.5)';
        ctx.beginPath(); ctx.ellipse(x + ox + 1.2, y + oy + 1.6, r, r * 0.8, 0, 0, 6.3); ctx.fill();
        ctx.fillStyle = 'rgb(' + v + ',' + (v - 2) + ',' + (v - 7) + ')';
        ctx.beginPath(); ctx.ellipse(x + ox, y + oy, r, r * (0.6 + rand() * 0.3), rand() * 3, 0, 6.3); ctx.fill();
      }
    }
    var hs = ctx.getImageData(0, 0, S, S).data, h = new Float32Array(S * S);
    for (i = 0; i < h.length; i++) h[i] = hs[i * 4] / 255;
    return { map: tex(c, 0.7, 0.7, true), normalMap: tex(normalCanvas(h, S, 3.5), 0.7, 0.7, false) };
  };

  /* ---- wood (window frames, floor) ----------------------------------------- */
  T.wood = function () {
    var S = 512, c = mk(S), ctx = c.getContext('2d'), n = fbm(S, 4, 5, 111), img = ctx.createImageData(S, S);
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
      var i = y * S + x, ring = Math.sin((x / S * 26 + n[i] * 7) * 6.283) * 0.5 + 0.5;
      var g = 0.72 + ring * 0.2 + n[(y * S + ((x * 9) % S))] * 0.08, o = i * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = clamp01(g) * 255; img.data[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return { map: tex(c, 0.35, 1.4, true) };
  };

  /* ---- hedge / shrub leaves -------------------------------------------------- */
  T.leaves = function () {
    var S = 512, c = mk(S), ctx = c.getContext('2d'), rand = rng(121);
    ctx.fillStyle = '#2c4422'; ctx.fillRect(0, 0, S, S);
    var cols = ['#34512a', '#40622f', '#4c7137', '#39592c', '#587d40', '#668a4c', '#456a33'];
    for (var i = 0; i < 9000; i++) {
      var x = rand() * S, y = rand() * S, r = 3 + rand() * 6, a = rand() * 3.14;
      ctx.fillStyle = cols[(rand() * cols.length) | 0];
      ctx.globalAlpha = 0.75;
      for (var ox = -S; ox <= S; ox += S) for (var oy = -S; oy <= S; oy += S) {
        if (x + ox < -12 || x + ox > S + 12 || y + oy < -12 || y + oy > S + 12) continue;
        ctx.beginPath(); ctx.ellipse(x + ox, y + oy, r, r * 0.5, a, 0, 6.3); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    var hs = ctx.getImageData(0, 0, S, S).data, h = new Float32Array(S * S);
    for (i = 0; i < h.length; i++) h[i] = hs[i * 4 + 1] / 255;
    return { map: tex(c, 1.1, 1.1, true), normalMap: tex(normalCanvas(h, S, 4.0), 1.1, 1.1, false) };
  };

  /* ---- tree billboards (alpha) ------------------------------------------------ */
  function drawTree(seed, kind) {
    var W = 512, H = 640, c = mk(W, H), ctx = c.getContext('2d'), rand = rng(seed), i;
    var cx = W / 2, base = H - 6;
    var crownY = kind === 'poplar' ? H * 0.40 : H * 0.36, rx = kind === 'poplar' ? W * 0.17 : W * 0.40, ry = kind === 'poplar' ? H * 0.37 : H * 0.30;
    // trunk + limbs
    ctx.strokeStyle = '#3d2f24'; ctx.lineCap = 'round';
    ctx.lineWidth = kind === 'poplar' ? 15 : 22;
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.quadraticCurveTo(cx + 6, H * 0.7, cx - 2, crownY + ry * 0.2); ctx.stroke();
    ctx.strokeStyle = '#5a4634'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx - 5, base); ctx.quadraticCurveTo(cx - 1, H * 0.7, cx - 6, crownY + ry * 0.3); ctx.stroke();
    for (i = 0; i < 6; i++) {
      var bx = cx + (rand() - 0.5) * rx * 1.5, by = crownY + (rand() - 0.2) * ry * 0.7;
      ctx.strokeStyle = '#3d2f24'; ctx.lineWidth = 4 + rand() * 6;
      ctx.beginPath(); ctx.moveTo(cx, crownY + ry * 0.75); ctx.quadraticCurveTo(cx + (bx - cx) * 0.3, by + 40, bx, by); ctx.stroke();
    }
    // foliage clusters: dark core first, lit leaves on top; light from upper left
    var hue = kind === 'birch' ? [112, 146, 76] : kind === 'poplar' ? [84, 116, 60] : [88, 124, 62];
    var clusters = [], nC = kind === 'poplar' ? 16 : 22;
    for (i = 0; i < nC; i++) {
      var a = rand() * 6.283, rr = Math.sqrt(rand());
      clusters.push({ x: cx + Math.cos(a) * rr * rx * 0.8, y: crownY + Math.sin(a) * rr * ry * 0.82, r: (kind === 'poplar' ? 34 : 52) + rand() * 34 });
    }
    clusters.sort(function (p, q) { return q.y - p.y; });
    clusters.forEach(function (cl) {
      ctx.fillStyle = 'rgba(40,62,30,0.96)';
      for (var b = 0; b < 9; b++) { var ba = rand() * 6.283, br = cl.r * (0.25 + rand() * 0.45); ctx.beginPath(); ctx.arc(cl.x + Math.cos(ba) * br, cl.y + Math.sin(ba) * br * 0.9, cl.r * (0.22 + rand() * 0.2), 0, 6.3); ctx.fill(); }
    });
    clusters.forEach(function (cl) {
      for (var k = 0; k < 420; k++) {
        var an = rand() * 6.283, rd = Math.sqrt(rand()) * cl.r, lx = cl.x + Math.cos(an) * rd, ly = cl.y + Math.sin(an) * rd * 0.92;
        var lit = clamp01(0.5 - (Math.cos(an) * 0.45 + Math.sin(an) * 0.8) * (rd / cl.r) * 0.62 + (rand() - 0.5) * 0.3);
        // overall crown shading: darker at the bottom
        lit *= 0.62 + 0.38 * clamp01(1 - (ly - (crownY - ry)) / (2 * ry));
        var f = 0.62 + lit * 0.62;
        ctx.fillStyle = 'rgb(' + (hue[0] * f | 0) + ',' + (hue[1] * f | 0) + ',' + (hue[2] * f * 0.9 | 0) + ')';
        ctx.beginPath(); ctx.ellipse(lx, ly, 2.5 + rand() * 4, 1.6 + rand() * 2.4, rand() * 3.14, 0, 6.3); ctx.fill();
      }
    });
    return c;
  }
  function drawCanopy(seed, hue) {
    var S = 256, c = mk(S), ctx = c.getContext('2d'), rand = rng(seed), i, k;
    for (i = 0; i < 26; i++) {
      var a = rand() * 6.283, rr = Math.sqrt(rand()) * S * 0.3, cx = S / 2 + Math.cos(a) * rr, cy = S / 2 + Math.sin(a) * rr, r = 22 + rand() * 20;
      ctx.fillStyle = 'rgba(44,68,34,0.96)'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, 6.3); ctx.fill();
      for (k = 0; k < 150; k++) {
        var an = rand() * 6.283, rd = Math.sqrt(rand()) * r, f = 0.7 + rand() * 0.5 - rd / r * 0.18;
        ctx.fillStyle = 'rgb(' + (hue[0] * f | 0) + ',' + (hue[1] * f | 0) + ',' + (hue[2] * f * 0.9 | 0) + ')';
        ctx.beginPath(); ctx.ellipse(cx + Math.cos(an) * rd, cy + Math.sin(an) * rd, 2 + rand() * 3, 1.5 + rand() * 2, rand() * 3.14, 0, 6.3); ctx.fill();
      }
    }
    return c;
  }
  T.trees = function () {
    function t(c) { var x = new THREE.CanvasTexture(c); x.encoding = THREE.sRGBEncoding; x.anisotropy = 4; return x; }
    var defs = [[131, 'oak', [88, 124, 62]], [137, 'birch', [112, 146, 76]], [139, 'poplar', [84, 116, 60]], [149, 'oak', [88, 124, 62]]];
    return defs.map(function (d) { return { side: t(drawTree(d[0], d[1])), top: t(drawCanopy(d[0] + 1, d[2])), kind: d[1] }; });
  };

  /* ---- horizon backdrop strip (alpha), tileable in x --------------------------- */
  T.backdrop = function (kind) {
    var W = 2048, H = 256, c = mk(W, H), ctx = c.getContext('2d'), rand = rng(kind === 'brdovito' ? 151 : kind === 'ravnica' ? 157 : 163);
    function ridge(seed, amp, baseY, cells) {
      var r = rng(seed), g = [], i, out = [];
      for (i = 0; i < cells; i++) g.push(r());
      for (var x = 0; x <= W; x++) {
        var f = x / W * cells, i0 = Math.floor(f), t = f - i0; t = t * t * (3 - 2 * t);
        var v = lerp(g[i0 % cells], g[(i0 + 1) % cells], t);
        var f2 = x / W * cells * 4, j0 = Math.floor(f2), t2 = f2 - j0;
        v += (lerp(g[(j0 * 7) % cells], g[((j0 + 1) * 7) % cells], t2) - 0.5) * 0.18;
        out.push(baseY - v * amp);
      }
      return out;
    }
    function fillRidge(line, col) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H);
      for (var x = 0; x <= W; x++) ctx.lineTo(x, line[x]);
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    }
    function treeLine(baseY, hMin, hMax, colA, colB, count) {
      for (var i = 0; i < count; i++) {
        var x = rand() * W, h = hMin + rand() * (hMax - hMin), w = h * (0.5 + rand() * 0.5), k = rand();
        ctx.fillStyle = k > 0.5 ? colA : colB;
        for (var ox = -W; ox <= W; ox += W) {
          ctx.beginPath(); ctx.ellipse(x + ox, baseY - h * 0.5, w * 0.5, h * 0.55, 0, 0, 6.3); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + ox + w * 0.25, baseY - h * 0.3, w * 0.4, h * 0.36, 0, 0, 6.3); ctx.fill();
        }
      }
    }
    if (kind === 'brdovito') {
      fillRidge(ridge(1, 150, 215, 5), '#a9bdd0');
      fillRidge(ridge(2, 125, 225, 7), '#8aa4b4');
      fillRidge(ridge(3, 95, 232, 9), '#6b8b84');
      var near = ridge(4, 62, 240, 11);
      fillRidge(near, '#567a55');
      for (var i = 0; i < 2600; i++) {            // forest texture on the near hill
        var x = rand() * W, y = near[x | 0] + rand() * 60;
        ctx.fillStyle = rand() > 0.5 ? 'rgba(62,96,58,0.8)' : 'rgba(84,122,74,0.8)';
        ctx.beginPath(); ctx.ellipse(x, y, 4 + rand() * 5, 5 + rand() * 6, 0, 0, 6.3); ctx.fill();
      }
      treeLine(H + 2, 14, 30, '#3f6a3c', '#4c7a44', 240);
    } else if (kind === 'ravnica') {
      ctx.fillStyle = '#9db08a'; ctx.fillRect(0, 243, W, 13);
      treeLine(246, 5, 12, '#7f9a83', '#8ca78c', 300);
      treeLine(H + 1, 6, 15, '#5d8052', '#6a8d59', 160);
      for (var p = 0; p < 26; p++) {               // poplar rows and a distant silo/village hint
        var px = rand() * W, ph = 16 + rand() * 12;
        ctx.fillStyle = '#58794e';
        ctx.beginPath(); ctx.ellipse(px, H - ph * 0.5, 3.5, ph * 0.55, 0, 0, 6.3); ctx.fill();
      }
    } else {
      treeLine(248, 12, 26, '#8fa79a', '#9bb3a2', 200);
      for (var hI = 0; hI < 30; hI++) {            // distant houses between the trees
        var hx = rand() * W, hw = 16 + rand() * 12, hh = 9 + rand() * 5, by = 250;
        ctx.fillStyle = rand() > 0.5 ? '#e4e2da' : '#d7d2c6';
        ctx.fillRect(hx, by - hh, hw, hh);
        ctx.fillStyle = rand() > 0.5 ? '#7a5a4c' : '#5a5f66';
        ctx.beginPath(); ctx.moveTo(hx - 2, by - hh); ctx.lineTo(hx + hw / 2, by - hh - 8); ctx.lineTo(hx + hw + 2, by - hh); ctx.fill();
      }
      treeLine(H + 2, 14, 34, '#4f7a48', '#5f8a52', 210);
    }
    var t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1); t.encoding = THREE.sRGBEncoding;
    return t;
  };

  /* ---- Vojvodina field patchwork for the far ground ----------------------------- */
  T.fields = function () {
    var S = 1024, c = mk(S), ctx = c.getContext('2d'), rand = rng(171);
    var cols = ['#c9b867', '#8aa04f', '#6f8f3f', '#a58b55', '#b8c06a', '#7d6a48', '#94a857', '#d2c27a'];
    ctx.fillStyle = '#7f9a4a'; ctx.fillRect(0, 0, S, S);
    var y = 0;
    while (y < S) {
      var h = 60 + rand() * 120, x = 0;
      while (x < S) {
        var w = 100 + rand() * 260;
        ctx.fillStyle = cols[(rand() * cols.length) | 0];
        ctx.fillRect(x, y, Math.min(w, S - x), Math.min(h, S - y));
        ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 1;
        for (var l = 0; l < h; l += 5) { ctx.beginPath(); ctx.moveTo(x, y + l); ctx.lineTo(x + w, y + l); ctx.stroke(); }
        x += w;
      }
      y += h;
    }
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = T.aniso || 4;
    return t;
  };

  /* ---- soft gradients for fake ambient occlusion -------------------------------- */
  T.aoStrip = function () {          // opaque black at v=1 fading to clear at v=0
    var c = mk(4, 64), ctx = c.getContext('2d'), g = ctx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.35, 'rgba(0,0,0,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 64);
    return new THREE.CanvasTexture(c);
  };
  T.contact = function (wFrac, hFrac) {   // blurred footprint, used under the house
    var S = 256, c = mk(S), ctx = c.getContext('2d');
    ctx.filter = 'blur(14px)';
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(S * (1 - wFrac) / 2, S * (1 - hFrac) / 2, S * wFrac, S * hFrac);
    return new THREE.CanvasTexture(c);
  };
  T.glow = function () {
    var S = 128, c = mk(S), ctx = c.getContext('2d'), g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255,214,150,1)'); g.addColorStop(0.3, 'rgba(255,190,110,0.45)'); g.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  };

  /* ---- curtain folds ------------------------------------------------------------- */
  T.curtain = function () {
    var W = 256, c = mk(W, 16), ctx = c.getContext('2d');
    for (var x = 0; x < W; x++) {
      var v = 0.80 + 0.2 * Math.sin(x / W * 6.283 * 9) * Math.sin(x / W * 6.283 * 2.5 + 1);
      var g = clamp01(v) * 255 | 0;
      ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + (g * 0.98 | 0) + ')'; ctx.fillRect(x, 0, 1, 16);
    }
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = THREE.RepeatWrapping; return t;
  };
})();
