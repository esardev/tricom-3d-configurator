/* ==========================================================================
   TRICOM konfigurator — k-weather.js
   Rain: instanced streaks around the camera, splash rings on the roof and
   terrace, water running in the gutters towards the outlets, a jet from every
   downpipe, overflow where a run is overloaded, and the drainage read-out.
   Winter: a snow blanket on every roof plane (held above the snow guards, or
   sliding off in one sheet when there are none), snow in the gutters, on the
   sills and the chimney, heaps under the eaves, light snowfall.
   Everything that belongs to a house is a child of its group.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var W = TK.weather = {};
  var V3 = THREE.Vector3, UP = new V3(0, 1, 0), D = TK.data, G = TK.geo;
  var scene, q, reduce, rainMesh, flakeMesh, RU, FU, SU, WU, snowMat, heapMat, nz;
  W.rain = false; W.snow = false; W.rainK = 0; W.snowK = 0;
  var houses = [];

  var NOISE = [
    'float wHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float wNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(wHash(i), wHash(i+vec2(1.0,0.0)), f.x), mix(wHash(i+vec2(0.0,1.0)), wHash(i+vec2(1.0,1.0)), f.x), f.y); }'
  ].join('\n');

  /* ---- falling particles: streaks (rain, overflow) or dots (snow) -------------------------- */
  var FALL_VS = [
    'attribute vec4 aSeed; uniform float uT; uniform vec3 uBox; uniform vec3 uCentre; uniform vec3 uVel; uniform float uLen; uniform float uWidth; uniform float uAmt; uniform float uSway;',
    'varying float vA; varying vec2 vQ;',
    'void main(){',
    '  vec3 p = aSeed.xyz * uBox + uVel * (uT * (0.82 + 0.36 * aSeed.w));',
    '  p.x += sin(uT * 1.3 + aSeed.w * 40.0) * uSway; p.z += cos(uT * 1.1 + aSeed.w * 23.0) * uSway;',
    '  p = mod(p, uBox) - 0.5 * uBox + uCentre;',
    '  vec3 dv = normalize((viewMatrix * vec4(normalize(uVel), 0.0)).xyz);',
    '  vec4 mv = viewMatrix * vec4(p, 1.0);',
    '  vec3 side = normalize(cross(dv, vec3(0.0, 0.0, 1.0)));',
    '  float wd = max(uWidth, -mv.z * 0.0011);',
    '  vec3 pv = mv.xyz - dv * (uLen * (0.7 + 0.6 * aSeed.w)) * position.y + side * position.x * wd;',
    '  gl_Position = projectionMatrix * vec4(pv, 1.0);',
    '  if (fract(aSeed.w * 7.13) > uAmt) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);',
    '  vA = (1.0 - position.y * 0.85) * smoothstep(1.2, 4.5, -mv.z);',
    '  vQ = vec2(position.x * 2.0, position.y * 2.0 - 1.0);',
    '}'].join('\n');
  function fallMesh(count, uniforms, seed) {
    var g = new THREE.InstancedBufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0], 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    var a = new Float32Array(count * 4), r = TK.tex.rng(seed);
    for (var i = 0; i < a.length; i++) a[i] = r();
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(a, 4));
    g.instanceCount = count;
    var m = new THREE.Mesh(g, new THREE.ShaderMaterial({
      uniforms: uniforms, vertexShader: FALL_VS,
      fragmentShader: 'uniform vec3 uColor; uniform float uAlpha; uniform float uSway; varying float vA; varying vec2 vQ; void main(){ float a = uAlpha * vA; if (uSway > 0.0) a = uAlpha * smoothstep(1.0, 0.55, length(vQ)) * step(0.001, vA); gl_FragColor = vec4(uColor, a); }',
      transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false
    }));
    m.frustumCulled = false; m.layers.set(1); m.renderOrder = 6;
    return m;
  }
  function fallU(o) {
    return { uT: WU.uT, uBox: { value: o.box }, uCentre: { value: o.centre || new V3() }, uVel: { value: o.vel }, uLen: { value: o.len }, uWidth: { value: o.width },
      uAmt: { value: 0 }, uSway: { value: o.sway || 0 }, uColor: { value: new THREE.Color(o.color) }, uAlpha: { value: o.alpha } };
  }

  /* ---- splash rings lying on the surface they hit ------------------------------------------- */
  var SPLASH_VS = [
    'attribute vec3 aPos; attribute vec3 aU; attribute vec3 aV; attribute vec2 aPh; uniform float uT; uniform float uAmt; varying vec2 vQ; varying float vL;',
    'float sHash(float n){ return fract(sin(n) * 43758.5453); }',
    'void main(){',
    '  float ph = uT * (1.7 + aPh.y) + aPh.x * 17.0, cyc = floor(ph), t = fract(ph);',
    '  vec2 j = vec2(sHash(cyc * 1.31 + aPh.x * 91.7), sHash(cyc * 2.17 + aPh.x * 53.3)) - 0.5;',
    '  float s = (0.012 + 0.07 * t) * (0.7 + aPh.y);',
    '  vec3 p = aPos + aU * (j.x * 0.6 + position.x * s) + aV * (j.y * 0.6 + position.y * s) + cross(aU, aV) * 0.006;',
    '  vQ = position.xy; vL = (1.0 - t) * step(sHash(cyc + aPh.x * 7.7), uAmt);',
    '  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);',
    '}'].join('\n');
  var SPLASH_FS = 'varying vec2 vQ; varying float vL; void main(){ float r = length(vQ); float ring = smoothstep(0.55, 0.8, r) * (1.0 - smoothstep(0.86, 1.0, r)) + (1.0 - smoothstep(0.0, 0.3, r)) * 0.7; gl_FragColor = vec4(vec3(0.86, 0.9, 0.95), ring * vL * 0.75); }';

  /* ---- water in gutters and from the pipes: streaks scrolling along uv.x ---------------------- */
  var WATER_FS = [
    'uniform float uT; uniform float uAmt; varying vec2 vUv;', NOISE,
    'void main(){',
    '  float n = wNoise(vec2(vUv.x * 5.0 - uT * 3.2, vUv.y * 7.0)) * 0.6 + wNoise(vec2(vUv.x * 14.0 - uT * 5.0, vUv.y * 16.0)) * 0.4;',
    '  float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);',
    '  vec3 col = mix(vec3(0.42, 0.5, 0.56), vec3(0.93, 0.96, 1.0), smoothstep(0.45, 0.8, n));',
    '  gl_FragColor = vec4(col, (0.45 + 0.5 * smoothstep(0.4, 0.75, n)) * edge * uAmt);',
    '}'].join('\n');

  W.init = function (sc, quality, reduced) {
    scene = sc; q = quality; reduce = reduced;
    WU = { uT: { value: reduced ? 3.7 : 0 }, uAmt: { value: 0 } };
    RU = fallU({ box: new V3(44, 24, 44), vel: new V3(1.6, -13.5, 0.7), len: 0.75, width: 0.012, color: 0xc5ced8, alpha: 0.34 });
    rainMesh = fallMesh(q.rain, RU, 501); rainMesh.visible = false; scene.add(rainMesh);
    FU = fallU({ box: new V3(40, 20, 40), vel: new V3(0.35, -1.25, 0.15), len: 0.035, width: 0.03, color: 0xffffff, alpha: 0.8, sway: 0.25 });
    flakeMesh = fallMesh(Math.round(q.rain * 0.45), FU, 503); flakeMesh.visible = false; scene.add(flakeMesh);
    SU = { uT: WU.uT, uAmt: WU.uAmt };
    nz = TK.tex.noise();
    snowMat = snowMaterial();
    heapMat = new THREE.MeshStandardMaterial({ color: 0xf2f5fa, roughness: 0.88, normalMap: nz.normalMap });
    heapMat.normalScale.set(0.5, 0.5);
  };
  // the blanket grows out of the sheet (uGrow) and can slide down the slope and fall over the eave (uSlide)
  function snowMaterial() {
      var m = new THREE.MeshStandardMaterial({ color: 0xf2f5fa, roughness: 0.86, normalMap: nz.normalMap });
      m.normalScale.set(0.35, 0.35);
      m.userData.u = { uSlide: { value: 0 }, uGrow: { value: 0 }, uFloor: { value: 0.03 } };
      m.onBeforeCompile = function (sh) {
        sh.uniforms.uSlide = m.userData.u.uSlide; sh.uniforms.uGrow = m.userData.u.uGrow; sh.uniforms.uFloor = m.userData.u.uFloor;
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nattribute vec3 slide; attribute vec4 lift; uniform float uSlide; uniform float uGrow; uniform float uFloor;')
          .replace('#include <begin_vertex>', [
            '#include <begin_vertex>',
            ' transformed -= lift.xyz * lift.w * (1.0 - uGrow);',
            ' float tkOver = max(0.0, uSlide - uv.y);',
            ' transformed -= slide * min(uSlide, uv.y);',
            ' transformed -= normalize(vec3(slide.x, 0.0, slide.z) + 1e-5) * tkOver * 0.5;',
            ' transformed.y = max(uFloor + lift.w * 0.4, transformed.y - tkOver * tkOver * 1.1 - tkOver * 0.3);'
          ].join('\n'));
      };
      m.customProgramCacheKey = function () { return 'tk-snowmesh'; };
      return m;
  }

  /* ---- drainage: how much roof every outlet has to carry ------------------------------------ */
  W.capacity = function (house, state) {
    var fx = house.fx, cap = Math.min(D.capacity[state.oluk] || 83, D.capacity[state.cev] || 83);
    var capable = fx.eaves.filter(function (e) { return e.n > 0; }), own = 0;
    capable.forEach(function (e) { own += e.pl.plan || 0; });
    var extra = capable.length ? Math.max(0, house.qty.plan - own) / capable.length : 0, worst = 0;
    fx.eaves.forEach(function (e) { e.load = e.n ? ((e.pl.plan || 0) + extra) / e.n : 0; e.over = e.load > cap + 0.5; worst = Math.max(worst, e.load); });
    return { cap: cap, worst: worst, ok: worst <= cap + 0.5, pipes: house.qty.pipes, area: house.qty.area, plan: house.qty.plan };
  };
  W.readout = function (house, state) {
    var c = W.capacity(house, state), g = D.find(D.gutters, state.oluk), p = D.find(D.pipes, state.cev), n = c.pipes;
    var vert = TK.t(n === 1 ? 'k.rain.pipe1' : n < 5 ? 'k.rain.pipe2' : 'k.rain.pipe5');
    // mera iz srpskog naziva iz kataloga (Ø125, ▢ 120) — ista na oba jezika
    var gname = g.cat.name.replace('Poluokrugli ', '').replace('Četvrtasti ', '▢ '), pname = p.cat.name.replace('Okrugla ', '').replace('Četvrtasta ', '▢ ');
    return {
      ok: c.ok,
      text: TK.t('k.rain.text', { g: gname, n: n, vert: vert, p: pname, a: TK.n(Math.round(c.area), 0) }),
      sub: TK.t(c.ok ? 'k.rain.ok' : 'k.rain.bad') + TK.t('k.rain.sub', { w: TK.n(Math.round(c.worst), 0), c: TK.n(c.cap, 0) })
    };
  };

  /* ---- per-house rain kit ------------------------------------------------------------------- */
  function buildRain(house, state) {
    var fx = house.fx, g = new THREE.Group(), cap = W.capacity(house, state);
    // water ribbons in the gutters
    var pos = [], uv = [], idx = [], n = 0;
    function strip(a, b, across, half, u0, u1) {
      var l = a.clone().addScaledVector(across, -half), r = a.clone().addScaledVector(across, half), l2 = b.clone().addScaledVector(across, -half), r2 = b.clone().addScaledVector(across, half);
      pos.push(l.x, l.y, l.z, r.x, r.y, r.z, r2.x, r2.y, r2.z, l2.x, l2.y, l2.z);
      uv.push(u0, 0, u0, 1, u1, 1, u1, 0); idx.push(n, n + 1, n + 2, n, n + 2, n + 3); n += 4;
    }
    fx.gutters.forEach(function (s) {
      var off = s.out.clone().multiplyScalar(s.w / 2).addScaledVector(UP, -s.depth * 0.52), a = s.a.clone().add(off), b = s.b.clone().add(off), len = a.distanceTo(b);
      strip(a, b, s.out, s.w * 0.36, s.toB ? 0 : len, s.toB ? len : 0);
    });
    // jet from every downpipe shoe onto the splash stone
    fx.outlets.forEach(function (o) {
      var prev = null, K = 7, R = 9, base = pos.length / 3, i, j;
      for (i = 0; i <= K; i++) {
        var s = i / K, c = o.foot.clone().addScaledVector(o.out, 0.34 * s).addScaledVector(UP, -(o.foot.y - o.ground - 0.05) * s * s), rad = o.r * (0.5 + 0.25 * s);
        var tan = prev ? c.clone().sub(prev).normalize() : o.out.clone(), nor = new V3().crossVectors(tan, o.dir).normalize();
        for (j = 0; j <= R; j++) { var an = j / R * Math.PI * 2, p = c.clone().addScaledVector(nor, Math.cos(an) * rad).addScaledVector(o.dir, Math.sin(an) * rad); pos.push(p.x, p.y, p.z); uv.push(s * 0.5, 0.5); }
        prev = c;
      }
      for (i = 0; i < K; i++) for (j = 0; j < R; j++) { var a0 = base + i * (R + 1) + j, b0 = a0 + R + 1; idx.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1); }
      n = pos.length / 3;
    });
    var wg = new THREE.BufferGeometry();
    wg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); wg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); wg.setIndex(idx);
    var water = new THREE.Mesh(wg, new THREE.ShaderMaterial({ uniforms: SU, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: WATER_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    water.name = 'water'; water.layers.set(1); water.renderOrder = 4; g.add(water);

    // splash rings: roof (rib crests and pans), terrace, around the splash stones
    var sp = [], su = [], sv = [], ph = [], r = TK.tex.rng(601);
    function add(p, u, v2, big) { sp.push(p.x, p.y, p.z); su.push(u.x, u.y, u.z); sv.push(v2.x, v2.y, v2.z); ph.push(r(), big || r() * 0.5); }
    var nRoof = Math.min(q.splash, Math.round(house.qty.area * 5)), total = 0;
    fx.planes.forEach(function (pp) { total += pp.pl.plan || 1; });
    fx.planes.forEach(function (pp) {
      var pl = pp.pl, polys = pl.polys || [pl.polySlab || pl.poly], cnt = Math.round(nRoof * (pl.plan || 1) / total), tries = 0;
      while (cnt > 0 && tries++ < 4000) {
        var po = polys[(r() * polys.length) | 0], u0 = Infinity, u1 = -Infinity;
        po.forEach(function (c) { u0 = Math.min(u0, c[0]); u1 = Math.max(u1, c[0]); });
        var u = u0 + r() * (u1 - u0), span = G.spanAt(po, u);
        if (!span) continue;
        add(pl.at(u, span[0] + r() * (span[1] - span[0]), fx.ribH * (r() > 0.5 ? 1 : 0.15) + 0.004), pl.ux, pl.vy); cnt--;
      }
    });
    var t = fx.terrace, X = new V3(1, 0, 0), Z = new V3(0, 0, 1), i;
    for (i = 0; i < Math.round(q.splash * 0.3); i++) add(new V3(t.x0 + r() * (t.x1 - t.x0), 0.104, t.z0 + 0.3 + r() * (t.z1 - t.z0 - 0.3)), Z, X, 0.7 + r() * 0.5);
    fx.outlets.forEach(function (o) { for (i = 0; i < 5; i++) add(o.foot.clone().addScaledVector(o.out, 0.36).setY(o.ground + 0.055), Z, X, 0.9 + r() * 0.5); });
    var sg = new THREE.InstancedBufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3)); sg.setIndex([0, 1, 2, 0, 2, 3]);
    sg.setAttribute('aPos', new THREE.InstancedBufferAttribute(new Float32Array(sp), 3)); sg.setAttribute('aU', new THREE.InstancedBufferAttribute(new Float32Array(su), 3));
    sg.setAttribute('aV', new THREE.InstancedBufferAttribute(new Float32Array(sv), 3)); sg.setAttribute('aPh', new THREE.InstancedBufferAttribute(new Float32Array(ph), 2));
    sg.instanceCount = ph.length / 2;
    var splash = new THREE.Mesh(sg, new THREE.ShaderMaterial({ uniforms: SU, vertexShader: SPLASH_VS, fragmentShader: SPLASH_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    splash.name = 'splash'; splash.frustumCulled = false; splash.layers.set(1); splash.renderOrder = 5; g.add(splash);

    // overflow: a curtain of drips over the front edge of every overloaded run
    fx.eaves.forEach(function (e) {
      if (!e.over) return;
      var a = e.ga.clone().addScaledVector(e.out, e.gw + 0.01), b = e.gb.clone().addScaledVector(e.out, e.gw + 0.01), mid = a.clone().lerp(b, 0.5), hgt = mid.y, len = a.distanceTo(b);
      var box = new V3(Math.abs(e.dir.x) * len + 0.05, hgt, Math.abs(e.dir.z) * len + 0.05);
      var u = fallU({ box: box, centre: new V3(mid.x, hgt / 2, mid.z), vel: new V3(0.0, -6.5, 0.0), len: 0.5, width: 0.016, color: 0xdde6ee, alpha: 0.6 });
      u.uAmt = WU.uAmt;
      var m = fallMesh(Math.round(len * 26), u, 701 + Math.round(len * 10)); m.name = 'overflow'; g.add(m);
    });
    g.userData.over = !cap.ok;
    return g;
  }

  /* ---- per-house snow kit ----------------------------------------------------------------------- */
  function sweepGeo(a, b, sec, side) { return G.sweep([a, b], sec, side, UP, { smooth: true }); }
  function withAttrs(g) {            // plain parts ride on the snow material too: no slide, grow from their base
    if (g.index) { var ni = g.toNonIndexed(); g.dispose(); g = ni; }
    g.computeVertexNormals();
    var n = g.attributes.position.count, sl = new Float32Array(n * 3), lf = new Float32Array(n * 4), p = g.attributes.position;
    g.computeBoundingBox();
    for (var i = 0; i < n; i++) { lf[i * 4 + 1] = 1; lf[i * 4 + 3] = p.getY(i) - g.boundingBox.min.y; }
    g.setAttribute('slide', new THREE.BufferAttribute(sl, 3)); g.setAttribute('lift', new THREE.BufferAttribute(lf, 4));
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    Object.keys(g.attributes).forEach(function (k) { if (['position', 'normal', 'uv', 'slide', 'lift'].indexOf(k) < 0) g.deleteAttribute(k); });
    return g;
  }
  function blanket(pp, prof, seed) {
    var pl = pp.pl, vMax = 0;
    (pl.polys || [pl.polySlab || pl.poly]).forEach(function (po) { po.forEach(function (c) { vMax = Math.max(vMax, c[1]); }); });
    var g = G.snow(pl, prof, { depth: 0.15, S: vMax, guardV: pp.guardV, seed: seed }).toNonIndexed();
    g.computeVertexNormals();
    var n = g.attributes.position.count, lf = new Float32Array(n * 4), p = g.attributes.position, o = pl.o, nn = pl.n;
    for (var i = 0; i < n; i++) {        // lift.w = height above the roof plane: the blanket grows out of the sheet
      lf[i * 4] = nn.x; lf[i * 4 + 1] = nn.y; lf[i * 4 + 2] = nn.z;
      lf[i * 4 + 3] = (p.getX(i) - o.x) * nn.x + (p.getY(i) - o.y) * nn.y + (p.getZ(i) - o.z) * nn.z - prof.h * 0.6;
    }
    g.setAttribute('lift', new THREE.BufferAttribute(lf, 4));
    return g;
  }
  function buildSnow(house) {
    var fx = house.fx, g = new THREE.Group(), stat = [], slid = [], heaps = [], prof = house.profile, maxS = 0;
    fx.planes.forEach(function (pp, i) {
      var slides = pp.slides && !pp.guardV, bg = blanket(pp, prof, 11 + i);
      (slides ? slid : stat).push(bg);
      if (slides) (pp.pl.polys || [pp.pl.polySlab || pp.pl.poly]).forEach(function (po) { po.forEach(function (c) { maxS = Math.max(maxS, c[1]); }); });
    });
    fx.eaves.forEach(function (e) {
      var w = e.gw; stat.push(withAttrs(sweepGeo(e.ga, e.gb, [[0.008, 0.004], [w * 0.25, 0.034], [w * 0.5, 0.046], [w * 0.75, 0.034], [w - 0.008, 0.004]], e.out)));
      if (e.slides && !e.pl.guardV) {
        var base = e.wallOff + 0.85, a = e.a.clone().addScaledVector(e.out, base - 0.0), b = e.b.clone().addScaledVector(e.out, base);
        var ty = fx.terrace, onT = function (p) { return p.x > ty.x0 && p.x < ty.x1 && p.z > ty.z0 && p.z < ty.z1 ? 0.1 : 0; }, mid = a.clone().lerp(b, 0.5);
        a.y = b.y = onT(mid);
        heaps.push(G.sweep([a, b], [[-0.75, 0.0], [-0.45, 0.13], [-0.1, 0.25], [0.2, 0.22], [0.5, 0.1], [0.78, 0.0]], e.out, UP, { smooth: true }));
      }
    });
    fx.sills.forEach(function (s) { stat.push(withAttrs(sweepGeo(s.a, s.b, [[-0.14, 0.0], [-0.09, 0.03], [-0.02, 0.036], [0.012, 0.0]], s.nrm))); });
    if (fx.chimney) { var c = fx.chimney, cb = new THREE.BoxGeometry(c.hf * 2 - 0.02, 0.05, c.hf * 2 - 0.02, 3, 1, 3); cb.translate(c.x, c.top + 0.03 + 0.17, c.z); if (!house.state.detalji || house.state.detalji.indexOf('kapa') < 0) cb.translate(0, -0.17, 0); stat.push(withAttrs(cb)); }
    function merged(list, mat, name) {
      if (!list.length) return null;
      var m = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(list, false), mat);
      list.forEach(function (x) { x.dispose(); });
      m.name = name; m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; m.layers.set(1); g.add(m);
      return m;
    }
    merged(stat, snowMat, 'snow');
    var slideMat = snowMaterial();
    slideMat.userData.u.uGrow = snowMat.userData.u.uGrow;
    g.userData.slide = merged(slid, slideMat, 'snowSlide');
    var hp = heaps.length ? new THREE.Mesh(G.merge(heaps), heapMat) : null;
    if (hp) { hp.name = 'snowHeap'; hp.castShadow = true; hp.receiveShadow = true; hp.scale.y = 0.001; hp.layers.set(1); g.add(hp); }
    g.userData.heap = hp; g.userData.maxS = maxS; g.userData.t = -0.7;       // the slide starts 0.7 s after the blanket is complete
    return g;
  }

  /* ---- attach / refresh --------------------------------------------------------------------------- */
  function sync(house) {
    if (!house || !house.fx || !house.fx.eaves) return;
    var x = house.wx || (house.wx = {});
    if (W.rain || W.rainK > 0) { if (!x.rain) { x.rain = buildRain(house, house.state); house.group.add(x.rain); } }
    else if (x.rain) { drop(house, 'rain'); }
    if (W.snow || W.snowK > 0) { if (!x.snow) { x.snow = buildSnow(house); house.group.add(x.snow); if (reduce || W.instant) x.snow.userData.t = 99; } }
    else if (x.snow) { drop(house, 'snow'); }
  }
  function drop(house, k) {
    var gr = house.wx[k]; if (!gr) return;
    gr.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    house.group.remove(gr); house.wx[k] = null;
  }
  W.attach = function (house) { if (houses.indexOf(house) < 0) houses.push(house); sync(house); };
  W.detach = function (house) { var i = houses.indexOf(house); if (i >= 0) houses.splice(i, 1); };
  W.refresh = function () { houses.forEach(sync); };
  W.over = function (house) { return !!(house.wx && house.wx.rain && house.wx.rain.userData.over); };

  W.set = function (kind, on) {
    if (kind === 'rain') { W.rain = on; if (on) W.snow = false; }
    else { W.snow = on; if (on) W.rain = false; }
    if (reduce || W.instant) { W.rainK = W.rain ? 1 : 0; W.snowK = W.snow ? 1 : 0; apply(); }
    houses.forEach(sync);
    if (reduce || W.instant) houses.forEach(sync);          // drops the kits of the weather that was just switched off
  };
  function apply() {
    TK.mat.setWet(W.rainK);
    WU.uAmt.value = W.rainK; RU.uAmt.value = W.rainK; rainMesh.visible = W.rainK > 0.01;
    FU.uAmt.value = W.snowK; flakeMesh.visible = W.snowK > 0.01;
    TK.env.US.value = W.snowK;
    snowMat.userData.u.uGrow.value = W.snowK;
  }

  /* ---- per frame: returns true while something still moves --------------------------------------- */
  W.tick = function (dt, camera, target) {
    var moving = false, done = false;
    if (!reduce) WU.uT.value += dt;
    var rk = W.rain ? 1 : 0, sk = W.snow ? 1 : 0;
    if (W.rainK !== rk) { W.rainK += Math.sign(rk - W.rainK) * dt / 1.2; if ((rk - W.rainK) * (rk ? 1 : -1) <= 0) { W.rainK = rk; done = true; } moving = true; apply(); }
    if (W.snowK !== sk) { W.snowK += Math.sign(sk - W.snowK) * dt / (sk ? 2.4 : 1.0); if ((sk - W.snowK) * (sk ? 1 : -1) <= 0) { W.snowK = sk; done = true; } moving = true; apply(); }
    if (done) { houses.forEach(sync); W.settled = true; }
    if (W.rainK > 0 || W.snowK > 0) {
      RU.uCentre.value.set(target.x, 12, target.z); FU.uCentre.value.set(target.x, 10, target.z);
      moving = moving || !reduce;
    }
    // snow slide: once the blanket is complete it starts to move, accelerates, pours over the eaves and piles up below
    if (W.snowK >= 1) houses.forEach(function (h) {
      var gr = h.wx && h.wx.snow; if (!gr || !gr.userData.slide) return;
      var ud = gr.userData, end = Math.sqrt((ud.maxS + 4.5) / 1.1);
      if (ud.t < end) { ud.t = Math.min(end, ud.t + (ud.t >= 90 ? 0 : dt)); if (ud.t >= 90) ud.t = end; moving = true; }
      var tt = Math.max(0, ud.t), d = 1.1 * tt * tt;
      ud.slide.material.userData.u.uSlide.value = d;
      ud.slide.visible = ud.t < end;
      if (ud.heap) ud.heap.scale.y = Math.max(0.001, Math.min(1, (d - ud.maxS * 0.4) / (ud.maxS * 0.8 + 1)));
    });
    return moving;
  };
  W.state = function () { return { rain: W.rain, snow: W.snow, rainK: W.rainK, snowK: W.snowK, t: WU.uT.value }; };
})();
