/* ==========================================================================
   TRICOM konfigurator — k-tools.js
   Dimension overlay (kote), detail inspector (highlight pass, cross-section
   card, install sequence), sun study (day replay), idle cinematic orbit,
   turntable / walk / presentation mode, section view (clipping plane with
   the labelled roof build-up), the measure tool and the guided tour. The
   bill of materials lives in k-spec.js.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var T = TK.tools = {};
  var D = TK.data, G = TK.geo, V3 = THREE.Vector3, A, C;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var BLUE = 0x0650c5;

  var koteOn = false, koteMesh = [], labels = [], labelBox, ray = new THREE.Raycaster(), lastCam = '', lastOcc = 0;
  var ins = null, dimScene, dimCam, dimMat;
  var day = null, idleT = 0, cine = null, cineRainUsed = false, tour = null;
  var turn = null, sec = null, secLabels = [], meas = null, measLabels = [];

  T.init = function (ctx) {
    A = TK.app; C = ctx;
    T.group = new THREE.Group(); T.group.name = 'tools'; C.scene.add(T.group);
    labelBox = $('#kKoteBox');
    dimScene = new THREE.Scene(); dimCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    dimMat = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 } }, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
      vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: 'uniform float uA; void main(){ gl_FragColor = vec4(0.045, 0.06, 0.09, uA); }'
    });
    var qd = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dimMat); qd.frustumCulled = false; dimScene.add(qd);
  };
  T.houseChanged = function () { if (koteOn) buildKote(); if (ins) T.inspect(null); if (sec) T.section(true); if (meas) T.measure(true); };
  T.reset = function () { if (ins) T.inspect(null); T.stopDay(); if (sec) T.section(false); if (meas) T.measure(false); };

  /* =====================================================================================
     Dimension overlay: depth-tested 3D lines (white casing + blue core) and DOM labels
     that always face the viewer; a label fades when the house hides its anchor.
     ===================================================================================== */
  function clearKote() {
    koteMesh.forEach(function (m) { m.geometry.dispose(); m.material.dispose(); T.group.remove(m); });
    koteMesh = []; labels = [];
    if (labelBox) labelBox.innerHTML = '';
  }
  function buildKote() {
    clearKote();
    var segs = [], html = '';
    A.house.kote.forEach(function (k) {
      var pos;
      if (k.arc) {
        var n = 14, prev = null, ang = Math.acos(Math.min(1, k.d0.dot(k.d1)));
        for (var i = 0; i <= n; i++) {
          var t = i / n, p = k.c.clone().addScaledVector(k.d0, Math.cos(ang * t) * k.r).addScaledVector(k.d1.clone().addScaledVector(k.d0, -k.d0.dot(k.d1)).normalize(), Math.sin(ang * t) * k.r);
          if (prev) segs.push(prev, p);
          prev = p;
        }
        segs.push(k.c.clone(), k.c.clone().addScaledVector(k.d0, k.r * 1.12), k.c.clone(), k.c.clone().addScaledVector(k.d1, k.r * 1.12));
        pos = k.c.clone().addScaledVector(k.d0.clone().add(k.d1).normalize(), k.r * 1.28);
      } else {
        var a2 = k.a.clone().add(k.off), b2 = k.b.clone().add(k.off), ext = k.off.clone().normalize().multiplyScalar(0.12), dl = b2.clone().sub(a2).normalize();
        var tick = dl.clone().add(k.off.clone().normalize()).normalize().multiplyScalar(0.11);
        segs.push(k.a.clone().addScaledVector(ext, 0.4), a2.clone().add(ext), k.b.clone().addScaledVector(ext, 0.4), b2.clone().add(ext), a2, b2,
          a2.clone().sub(tick), a2.clone().add(tick), b2.clone().sub(tick), b2.clone().add(tick));
        pos = a2.clone().lerp(b2, 0.5).addScaledVector(ext, 1.6);
      }
      labels.push({ pos: pos, vis: true, id: k.id });
      html += '<span class="k-kota" data-kota="' + k.id + '">' + esc(k.label) + '</span>';
    });
    var geo = G.fatLines(segs);
    [[0xffffff, 4.4, 10], [BLUE, 2.0, 11]].forEach(function (c) {
      var m = new THREE.Mesh(geo, G.lineMaterial(c[0], c[1]));
      m.frustumCulled = false; m.layers.set(1); m.renderOrder = c[2];
      T.group.add(m); koteMesh.push(m);
    });
    labelBox.innerHTML = html;
    labels.forEach(function (l, i) { l.el = labelBox.children[i]; });
    lastCam = '';
  }
  T.kote = function (on) {
    koteOn = !!on;
    document.body.classList.toggle('k-kote-on', koteOn);
    if (koteOn) buildKote(); else clearKote();
    A.invalidate();
  };
  T.koteList = function () { return labels.map(function (l) { return { id: l.id, text: l.el.textContent, vis: l.vis, shown: l.el.style.display !== 'none', x: l.x, y: l.y }; }); };
  T.side = function (active) { koteMesh.forEach(function (m) { m.visible = active; }); if (ins && ins.edges) ins.edges.visible = active; };

  var tmp = new V3(), tmpDir = new V3();
  function placeList(list, cam, w, h, occlude) {
    var key = cam.position.x.toFixed(2) + cam.position.y.toFixed(2) + cam.position.z.toFixed(2) + cam.quaternion.x.toFixed(3) + cam.quaternion.y.toFixed(3), now = performance.now();
    var occ = occlude && key !== lastCam && now - lastOcc > 90;
    if (occ) { lastCam = key; lastOcc = now; }
    for (var i = 0; i < list.length; i++) {
      var l = list[i];
      tmp.copy(l.pos).project(cam);
      var x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h, inView = tmp.z < 1 && x > 30 && x < w - 30 && y > 14 && y < h - 14;
      if (occ && inView) {            // hidden behind the house?
        tmpDir.copy(l.pos).sub(cam.position);
        var dist = tmpDir.length();
        ray.set(cam.position, tmpDir.normalize()); ray.far = dist - 0.15;
        l.vis = ray.intersectObjects(A.house.proxy, false).length === 0;
      }
      l.x = x; l.y = y;
      l.el.style.display = inView ? '' : 'none';
      if (inView) { l.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%)'; l.el.classList.toggle('is-hid', !l.vis); }
    }
  }
  T.place = function (cam, w, h) {
    if (koteOn && labels.length) placeList(labels, cam, w, h, true);
    if (sec && secLabels.length) placeList(secLabels, cam, w, h, false);
    if (meas && measLabels.length) placeList(measLabels, cam, w, h, false);
  };

  /* =====================================================================================
     Turntable (one click, speed 0.5 / 1 / 2), walk preset, presentation mode (#present=1)
     ===================================================================================== */
  T.turntable = function (on, speed) {
    if (!C) return;
    if (on) { turn = { speed: speed || 1 }; clearTimeout(idleT); cine = null; C.controls.autoRotate = true; C.controls.autoRotateSpeed = 1.0 * turn.speed; }
    else { turn = null; C.controls.autoRotate = false; armIdle(); }
    if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop();
    A.invalidate();
  };
  T.turning = function () { return turn ? turn.speed : 0; };
  // walk: eye height in the garden, then a slow orbit
  T.walk = function () {
    A.fly('walk');
    setTimeout(function () { T.turntable(true, 0.35); }, 650);
  };
  T.present = function (on) {
    A.present = !!on;
    document.body.classList.toggle('k-present', A.present);
    if (on) { if (TK.ui) TK.ui.close(); if (ins) T.inspect(null); A.fly('home'); setTimeout(function () { T.turntable(true, 0.6); }, 650); }
    else T.turntable(false);
    A.rehash();
    A.invalidate();
  };

  /* =====================================================================================
     Section view: a clipping plane through the house (x = centre + 0,6 m); the roof
     build-up at the cut is drawn as labelled layers — sheet, battens, counter-battens,
     membrane, rafter. Visualisation only: nothing here enters the specification.
     ===================================================================================== */
  var secGroup = null;
  function secClear() {
    if (secGroup) { secGroup.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); T.group.remove(secGroup); secGroup = null; }
    if (sec) sec.mats.forEach(function (m) { m.clippingPlanes = m.userData.clipSave || null; m.clipShadows = false; m.needsUpdate = true; delete m.userData.clipSave; });
    secLabels.forEach(function (l) { if (l.el && l.el.parentNode) l.el.parentNode.removeChild(l.el); });
    secLabels = []; sec = null;
    document.body.classList.remove('k-sec-on');
  }
  T.section = function (on) {
    secClear();
    if (!on || A.noGL) { C.renderer.localClippingEnabled = false; if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop(); A.invalidate(); return; }
    var d = A.house.dims, cx = d.cx + 0.6, plane = new THREE.Plane(new V3(-1, 0, 0), cx), mats = [];
    C.renderer.localClippingEnabled = true;
    A.house.group.traverse(function (o) {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (mats.indexOf(m) < 0) mats.push(m); });
    });
    mats.forEach(function (m) { m.userData.clipSave = m.clippingPlanes; m.clippingPlanes = [plane]; m.clipShadows = true; m.needsUpdate = true; });
    sec = { mats: mats, x: cx };
    document.body.classList.add('k-sec-on');
    // build-up slices along the cut: raycast down onto the roof skin every 15 cm across the house
    var roof = A.house.group.children.filter(function (o) { return o.name === 'roof'; })[0];
    secGroup = new THREE.Group(); T.group.add(secGroup);
    if (roof) {
      var rc = new THREE.Raycaster(), hits = [], z, M = TK.mat, X = new V3(1, 0, 0);
      for (z = d.cz - d.W / 2 - 0.4; z <= d.cz + d.W / 2 + 0.4; z += 0.15) {
        rc.set(new V3(cx - 0.01, d.top + 6, z), new V3(0, -1, 0));
        var h = rc.intersectObject(roof, false)[0];
        if (h) hits.push({ p: h.point.clone(), n: h.face.normal.clone().transformDirection(roof.matrixWorld).normalize() });
      }
      var LAY = [
        { k: 'letva', col: 0xc9a46a, box: [0.3, 0.03, 0.05], y: -0.025, every: 2, label: TK.t('k.sec.letva') },
        { k: 'kontra', col: 0xb8905a, box: [0.05, 0.03, 0.16], y: -0.055, x: -0.1, label: TK.t('k.sec.kontra') },
        { k: 'folija', col: 0x4a5560, box: [0.3, 0.003, 0.16], y: -0.072, label: TK.t('k.sec.folija') },
        { k: 'rog', col: 0xa07a48, box: [0.08, 0.18, 0.16], y: -0.165, x: -0.2, label: TK.t('k.sec.rog') }
      ], matOf = {};
      LAY.forEach(function (L) { matOf[L.k] = new THREE.MeshStandardMaterial({ color: L.col, roughness: L.k === 'folija' ? 0.6 : 0.9, metalness: 0 }); });
      hits.forEach(function (hp, i) {
        var t = new V3(0, hp.n.z, -hp.n.y).normalize(), B = new THREE.Matrix4().makeBasis(X, hp.n, t);
        LAY.forEach(function (L) {
          if (L.every && i % L.every) return;
          var m = new THREE.Mesh(new THREE.BoxGeometry(L.box[0], L.box[1], L.box[2]), matOf[L.k]);
          m.position.set((L.x || 0) - 0.15, L.y, 0).applyMatrix4(B).add(hp.p);
          m.quaternion.setFromRotationMatrix(B);
          m.castShadow = true; m.receiveShadow = true; m.layers.set(1);
          secGroup.add(m);
        });
      });
      if (hits.length) {
        // one label per layer, each anchored a little further down the slope so they read as a ladder
        var box = labelBox, prof = A.house.profile;
        [{ y: 0.01, label: TK.t('k.sec.sheet', { p: prof.name, t: D.thick[A.state.mat] }) }].concat(LAY.map(function (L) { return { y: L.y, label: L.label }; })).forEach(function (L, i) {
          var hp = hits[Math.min(hits.length - 1, Math.floor(hits.length * (0.72 - 0.13 * i)))];
          var el = document.createElement('span'); el.className = 'k-kota k-kota--sec'; el.textContent = L.label;
          box.appendChild(el);
          secLabels.push({ pos: hp.p.clone().addScaledVector(hp.n, L.y).addScaledVector(X, 0.35), vis: true, el: el, id: 'sec' });
        });
      }
    }
    if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop();
    A.shadows();
  };
  T.sectioning = function () { return !!sec; };

  /* =====================================================================================
     Measure: two clicks on the model → distance in mm, drawn like a kota
     ===================================================================================== */
  var measGroup = null;
  function measClear() {
    if (measGroup) { measGroup.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose && !o.isInstancedMesh) o.material.dispose(); }); T.group.remove(measGroup); measGroup = null; }
    measLabels.forEach(function (l) { if (l.el && l.el.parentNode) l.el.parentNode.removeChild(l.el); });
    measLabels = [];
  }
  T.measure = function (on) {
    measClear();
    meas = on && !A.noGL ? { pts: [] } : null;
    document.body.classList.toggle('k-meas-on', !!meas);
    if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop();
    A.invalidate();
  };
  T.measuring = function () { return meas ? { points: meas.pts.length, mm: meas.mm || 0 } : null; };
  T.measureClick = function (cx, cy) {
    if (!meas) return false;
    var r = C.canvas.getBoundingClientRect(), nd = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), rc = new THREE.Raycaster();
    rc.setFromCamera(nd, C.camera);
    var list = []; A.house.group.traverse(function (o) { if (o.isMesh && o.parent === A.house.group && !/^(glass|curtain|interior|ao|dirt)/.test(o.name)) list.push(o); });
    var hit = rc.intersectObjects(list, false)[0];
    if (!hit) return false;
    if (meas.pts.length >= 2) { measClear(); meas.pts = []; }
    meas.pts.push(hit.point.clone());
    measGroup = measGroup || new THREE.Group(); if (!measGroup.parent) T.group.add(measGroup);
    var dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: BLUE, toneMapped: false }));
    dot.position.copy(hit.point); dot.layers.set(1); dot.renderOrder = 12; measGroup.add(dot);
    if (meas.pts.length === 2) {
      var a = meas.pts[0], b = meas.pts[1], mm = Math.round(a.distanceTo(b) * 1000), dir = b.clone().sub(a).normalize();
      var tick = new V3(0, 1, 0).cross(dir).normalize().multiplyScalar(0.11), segs = [a, b, a.clone().sub(tick), a.clone().add(tick), b.clone().sub(tick), b.clone().add(tick)];
      var geo = G.fatLines(segs);
      [[0xffffff, 4.4, 10], [BLUE, 2.0, 11]].forEach(function (c) {
        var m = new THREE.Mesh(geo, G.lineMaterial(c[0], c[1]));
        m.frustumCulled = false; m.layers.set(1); m.renderOrder = c[2]; measGroup.add(m);
      });
      meas.mm = mm;
      var el = document.createElement('span'); el.className = 'k-kota k-kota--meas'; el.textContent = (TK.en ? TK.n(mm, 0) : String(mm).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')) + ' mm';
      labelBox.appendChild(el);
      measLabels.push({ pos: a.clone().lerp(b, 0.5).add(new V3(0, 0.12, 0)), vis: true, el: el, id: 'meas' });
    }
    A.invalidate();
    return true;
  };

  /* =====================================================================================
     Detail inspector
     ===================================================================================== */
  var HOW = {
    okapnica: { steps: [TK.t('k.how.okapnica.1'), TK.t('k.how.okapnica.2'), TK.t('k.how.okapnica.3')],
      svg: ['<path class="w" d="M70 150 290 40 295 51 75 161Z"/><path class="w" d="M58 148h14v40H58z"/>', '<path class="p" d="M130 119 62 153 56 156V172L51 178"/>', '<path class="s" d="M290 33 48 154"/>', '<path class="g" d="M14 170A20 20 0 0 0 54 170"/><path class="x" d="M54 170 60 151"/><path class="a" d="M45 157 40 178"/>'] },
    sleme: { steps: [TK.t('k.how.sleme.1'), TK.t('k.how.sleme.2'), TK.t('k.how.sleme.3')],
      svg: ['<path class="w" d="M20 132 150 54V66L26 141Z"/><path class="w" d="M280 132 150 54V66L274 141Z"/>', '<path class="s" d="M14 125 132 54M286 125 168 54"/>', '<path class="f" d="M110 61l12-7 3 5-12 7zM190 61l-12-7-3 5 12 7z"/>', '<path class="p" d="M92 70 96 62 150 30 204 62 208 70"/><path class="x" d="M118 38V56M182 38V56"/>'] },
    vetar: { steps: [TK.t('k.how.vetar.1'), TK.t('k.how.vetar.2'), TK.t('k.how.vetar.3')],
      svg: ['<path class="w" d="M70 112H292V124H70Z"/><path class="w" d="M56 96H70V176H56Z"/>', '<path class="s" d="M292 108H250L242 90H222L214 108H150L142 90H122L114 108H74"/>', '<path class="p" d="M150 86V82H50V160L43 167"/>', '<path class="x" d="M132 68V90M127 68h10M34 130H58M34 125v10"/>'] },
    opsivka: { steps: [TK.t('k.how.opsivka.1'), TK.t('k.how.opsivka.2'), TK.t('k.how.opsivka.3')],
      svg: ['<path class="m" d="M120 20H200V97L120 128Z"/><path class="s" d="M16 168 292 62"/>', '<path class="p" d="M120 100V128L90 139.5"/>', '<path class="p pf" d="M120 104H140V96H160V88H180V80H200V97L120 128Z"/>', '<path class="p" d="M200 76V97L236 83"/><circle class="f" cx="120" cy="101" r="3"/><circle class="f" cx="200" cy="76" r="3"/>'] },
    snego: { steps: [TK.t('k.how.snego.1'), TK.t('k.how.snego.2'), TK.t('k.how.snego.3')],
      svg: ['<path class="w" d="M118 129l22-8.5 4 10-22 8.5z"/><path class="s" d="M16 160 292 54"/>', '<path class="p pf" d="M108 124 152 107 138 78 126 82Z"/>', '<circle class="p pw" cx="131" cy="93" r="5.5"/><circle class="p pw" cx="135" cy="83" r="5.5"/>', '<path class="n" d="M138 80C170 60 230 34 292 28V54L152 107Z"/>'] },
    uvala: { steps: [TK.t('k.how.uvala.1'), TK.t('k.how.uvala.2'), TK.t('k.how.uvala.3')],
      svg: ['<path class="w" d="M20 44 150 124V136L14 53Z"/><path class="w" d="M280 44 150 124V136L286 53Z"/>', '<path class="p" d="M66 66 72 76 150 122 228 76 234 66"/>', '<path class="f" d="M96 84l10 6-3 5-10-6zM204 84l-10 6 3 5 10-6z"/>', '<path class="s" d="M14 36 112 94M286 36 188 94"/><path class="a" d="M150 58V110"/>'] },
    iksna: { steps: [TK.t('k.how.iksna.1'), TK.t('k.how.iksna.2'), TK.t('k.how.iksna.3')] },
    kapa: { steps: [TK.t('k.how.kapa.1'), TK.t('k.how.kapa.2'), TK.t('k.how.kapa.3')] },
    parapet: { steps: [TK.t('k.how.parapet.1'), TK.t('k.how.parapet.2'), TK.t('k.how.parapet.3')] },
    solbank: { steps: [TK.t('k.how.solbank.1'), TK.t('k.how.solbank.2'), TK.t('k.how.solbank.3')] }
  };
  var STRIPS = [125, 167, 200, 250, 333, 400, 500, 625, 1000, 1250];

  // cross-section drawing with overall dimensions, from the same polyline that is swept in 3D
  function sectionSvg(id, s) {
    var pitch = A.house.kote.length ? (function () { var k = A.house.kote.filter(function (x) { return x.arc; })[0]; return k ? Math.acos(Math.min(1, k.d0.dot(k.d1))) : 0.5; })() : 0.5;
    var pts = TK.house.sections(s, pitch)[id];
    if (!pts) return { svg: '', dev: 0 };
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, dev = 0, i;
    pts.forEach(function (p, j) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); if (j) dev += Math.hypot(p[0] - pts[j - 1][0], p[1] - pts[j - 1][1]); });
    var W = 300, H = 150, pad = 34, sc = Math.min((W - 2 * pad - 30) / Math.max(0.02, x1 - x0), (H - 2 * pad) / Math.max(0.02, y1 - y0));
    var ox = pad + ((W - 2 * pad - 30) - (x1 - x0) * sc) / 2, oy = pad + ((H - 2 * pad) - (y1 - y0) * sc) / 2;
    function X(v) { return (ox + (v - x0) * sc).toFixed(1); } function Y(v) { return (oy + (y1 - v) * sc).toFixed(1); }
    var d = '';
    for (i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + X(pts[i][0]) + ' ' + Y(pts[i][1]);
    var yb = +Y(y0) + 16, xr = +X(x1) + 18;
    var out = '<svg class="k-sec k-sec--det" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + TK.t('k.ins.secAria') + '">';
    out += '<path d="' + d + '" fill="none" stroke="var(--tricom)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
    if (id === 'snego') out += '<circle cx="' + X(0) + '" cy="' + Y(0.062) + '" r="' + (0.014 * sc).toFixed(1) + '" fill="#fff" stroke="var(--tricom)" stroke-width="2"/><circle cx="' + X(0.012) + '" cy="' + Y(0.115) + '" r="' + (0.014 * sc).toFixed(1) + '" fill="#fff" stroke="var(--tricom)" stroke-width="2"/>';
    out += '<g stroke="var(--fg-faint)" stroke-width="0.8" fill="none"><path d="M' + X(x0) + ' ' + yb + 'H' + X(x1) + 'M' + X(x0) + ' ' + (yb - 4) + 'v8M' + X(x1) + ' ' + (yb - 4) + 'v8"/>';
    out += '<path d="M' + xr + ' ' + Y(y1) + 'V' + Y(y0) + 'M' + (xr - 4) + ' ' + Y(y1) + 'h8M' + (xr - 4) + ' ' + Y(y0) + 'h8"/></g>';
    out += '<g class="k-sec__t"><text x="' + ((+X(x0) + +X(x1)) / 2) + '" y="' + (yb + 13) + '" text-anchor="middle">' + Math.round((x1 - x0) * 1000) + '</text>';
    out += '<text x="' + (xr + 7) + '" y="' + ((+Y(y0) + +Y(y1)) / 2 + 4) + '">' + Math.round((y1 - y0) * 1000) + '</text></g></svg>';
    return { svg: out, dev: Math.round(dev * 1000) };
  }
  T.card = function (id) {
    var s = A.state, def = D.find(D.details, id), how = HOW[id], sec = sectionSvg(id, s), spec = A.gutterSpec(s);
    var strip = STRIPS.filter(function (w) { return w >= sec.dev; })[0] || sec.dev, stock = D.stock[id === 'sleme' ? 'sleme' : id] || 0;
    var h = '<div class="k-ins__head"><span class="mono">' + TK.t('k.ins.detail') + '</span><h3>' + esc(def.name) + '</h3><button type="button" class="k-ins__x" data-ins-close aria-label="' + TK.t('k.ins.close') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>';
    h += '<div class="k-ins__body"><div class="k-plate">' + sec.svg + '<dl class="k-dims">';
    if (id === 'snego') h += '<div><dt>' + TK.t('k.ins.tubes') + '</dt><dd>2 × Ø28 mm</dd></div><div><dt>' + TK.t('k.ins.brackets') + '</dt><dd>' + TK.t('k.ins.bracketsV') + '</dd></div>';
    else if (id === 'kapa') h += '<div><dt>' + TK.t('k.ins.make') + '</dt><dd>' + TK.t('k.sp.toChimney') + '</dd></div>';
    else h += '<div><dt>' + TK.t('k.ins.dev') + '</dt><dd>≈ ' + sec.dev + ' mm' + (strip !== sec.dev ? TK.t('k.ins.strip', { v: strip }) : '') + '</dd></div>';
    h += '<div><dt>' + TK.t('k.ins.thick') + '</dt><dd>' + D.thick[spec.mat] + ' mm</dd></div>' + (stock ? '<div><dt>' + TK.t('k.ins.piece') + '</dt><dd>' + (TK.en ? String(stock) : String(stock).replace('.', ',')) + ' m</dd></div>' : '') + '</dl></div>';
    h += '<p class="k-ins__mat">' + esc(TK.mat.finishLabel(spec)) + TK.t('k.ins.mm') + '</p>';
    h += '<h4 class="k-h">' + TK.t('k.ins.how') + '</h4>';
    if (how.svg) {
      h += '<svg class="k-how" viewBox="0 0 300 190" role="img" aria-label="' + TK.t('k.ins.howAria') + '">' + how.svg.map(function (l, i) { return '<g class="k-how__l" data-l="' + i + '">' + l + '</g>'; }).join('') + '</svg>';
    }
    h += '<ol class="k-steps">' + how.steps.map(function (t, i) { return '<li data-how="' + (i + 1) + '"><button type="button" data-how-step="' + (i + 1) + '"><b>' + (i + 1) + '</b><span>' + esc(t) + '</span></button></li>'; }).join('') + '</ol></div>';
    return h;
  };

  // id = null closes the inspector
  T.inspect = function (id) {
    var card = $('#kInspect');
    if (ins) {
      ins.parts.forEach(function (p) { p.layers.disable(2); });
      if (ins.edges) { ins.edges.geometry.dispose(); ins.edges.material.dispose(); T.group.remove(ins.edges); }
      clearInterval(ins.timer);
      ins = null;
    }
    if (!id) {
      card.classList.remove('is-open'); card.setAttribute('aria-hidden', 'true'); card.inert = true;
      document.body.classList.remove('k-ins-on');
      A.invalidate();
      if (TK.ui && TK.ui.inspectChanged) TK.ui.inspectChanged(null);
      return false;
    }
    var parts = A.house.parts(id);
    if (!parts.length) return false;
    var segs = [];
    parts.forEach(function (p) {
      p.layers.enable(2);
      if (p.isInstancedMesh) return;
      var eg = new THREE.EdgesGeometry(p.geometry, 28), a = eg.attributes.position;
      for (var i = 0; i < a.count; i++) segs.push(new V3(a.getX(i), a.getY(i), a.getZ(i)));
      eg.dispose();
    });
    var edges = null;
    if (segs.length) {
      var lm = G.lineMaterial(0x3f74dd, 1.7, { bias: 0.0006 });
      edges = new THREE.Mesh(G.fatLines(segs), lm);
      edges.frustumCulled = false; edges.layers.set(2); edges.renderOrder = 20; T.group.add(edges);
    }
    ins = { id: id, parts: parts, edges: edges, k: A.reduce ? 1 : 0, step: 1, timer: 0 };
    card.innerHTML = T.card(id);
    card.classList.add('is-open'); card.setAttribute('aria-hidden', 'false'); card.inert = false;
    document.body.classList.add('k-ins-on');
    T.howStep(A.reduce ? 3 : 1);
    if (!A.reduce) ins.timer = setInterval(function () { if (!ins) return; if (ins.step >= 3) { clearInterval(ins.timer); return; } T.howStep(ins.step + 1); }, 2400);
    var d = A.house.det[id];
    if (d) A.flyTo({ t: d.t, dir: d.dir, r: d.r });
    A.invalidate();
    if (TK.ui && TK.ui.inspectChanged) TK.ui.inspectChanged(id);
    return true;
  };
  T.howStep = function (n, manual) {
    if (!ins) return;
    if (manual) clearInterval(ins.timer);
    ins.step = n;
    var card = $('#kInspect');
    Array.prototype.forEach.call(card.querySelectorAll('.k-how__l'), function (g) { var l = +g.dataset.l; g.classList.toggle('is-on', l <= n); g.classList.toggle('is-new', l === n); });
    Array.prototype.forEach.call(card.querySelectorAll('[data-how]'), function (li) { var l = +li.dataset.how; li.classList.toggle('is-on', l <= n); li.classList.toggle('is-cur', l === n); });
  };
  T.inspecting = function () { return ins ? { id: ins.id, step: ins.step, k: ins.k, parts: ins.parts.length, edges: !!ins.edges } : null; };

  // second pass over the finished frame: dim everything, then draw the part again at full brightness with its outline
  T.overlay = function (renderer, scene, camera, rt) {
    if (!ins || ins.k <= 0.001 || !rt) return;
    var auto = renderer.autoClear, bg = scene.background, mask = camera.layers.mask;
    renderer.autoClear = false;
    if (A.cmp.on) { var sx = Math.round(rt.width * A.splitX() / C.stage.clientWidth), act = A.cmp.active; rt.scissorTest = true; rt.scissor.set(act ? sx : 0, 0, act ? rt.width - sx : sx, rt.height); }
    renderer.setRenderTarget(rt);
    dimMat.uniforms.uA.value = 0.92 * ins.k;        // blended in linear light: the rest of the frame ends up at about a third of its brightness
    renderer.render(dimScene, dimCam);
    scene.background = null; camera.layers.set(2);
    var sm = renderer.shadowMap.needsUpdate; renderer.shadowMap.needsUpdate = false;
    renderer.clear(false, true, false);          // x-ray: flashings are often tucked under the sheet or behind the gutter
    renderer.render(scene, camera);
    renderer.shadowMap.needsUpdate = sm;
    camera.layers.mask = mask; scene.background = bg;
    rt.scissorTest = false;
    renderer.autoClear = auto;
  };

  // click on a flashing in the 3D view (step 07 open)
  T.pick = function (cx, cy) {
    var r = C.canvas.getBoundingClientRect(), nd = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), rc = new THREE.Raycaster();
    rc.setFromCamera(nd, C.camera);
    var list = A.house.group.children.filter(function (o) { return /^d_/.test(o.name) && !o.isInstancedMesh; });
    var hit = rc.intersectObjects(list.concat(A.house.proxy), false)[0];
    return hit && /^d_/.test(hit.object.name) ? hit.object.name.slice(2) : null;
  };

  /* =====================================================================================
     Bill of materials — everything is counted from the geometry that is drawn
     ===================================================================================== */
  T.bom = function (s, house) {
    var sp = TK.spec.compute(s, house), out = [];
    out.push({ title: TK.t('k.step.2.title'), rows: sp.planes.map(function (p) { return [p.name + ' (' + p.side + ')', TK.t('k.bom.sheets', { n: p.n, l: p.lens, o: A.fmt(p.order) })]; }) });
    out.push({ title: TK.t('k.step.3.title'), rows: sp.drains.map(function (d) { return [d.name, TK.t('k.bom.drain', { l: A.fmt(d.len, 2), h: d.hooks, p: d.pipes.length })]; }) });
    out.push({ title: TK.t('k.step.4.title'), rows: sp.flash.map(function (f) { return [f.label, f.qty + ' · ' + f.pcs]; }) });
    return out;
  };
  T.bomText = function () { return TK.spec.text(A.spec(), 0, A.url()) + '\n\n' + D.disclaimer; };

  /* =====================================================================================
     Sun study: replay the day 06:00 → 22:00 in 12 s
     ===================================================================================== */
  var KEYS = [7, 10, 13, 16, 19];
  T.playDay = function () {
    if (day) { T.stopDay(); return; }
    if (A.reduce) {            // no animation: step to the next key hour
      var nx = KEYS.filter(function (k) { return k > A.state.sat; })[0] || KEYS[0];
      A.set('sat', nx);
      return;
    }
    T.stopIdle();
    day = { t0: performance.now(), from: A.state.sat };
    if (TK.ui) TK.ui.dayState(true);
    A.invalidate();
  };
  T.stopDay = function () {
    if (!day) return;
    var back = day.from; day = null;
    A.states.forEach(function (s) { if (s) s.sat = back; });
    TK.env.setTime(back, A.state.datum);
    if (TK.ui) { TK.ui.dayState(false); TK.ui.refresh('sat'); }
    A.shadows();
  };
  T.playing = function () { return !!day; };

  /* =====================================================================================
     Idle: after 12 s on the start screen the camera starts a slow orbit and the rain
     comes and goes once, so a visitor who only watches still sees what the tool does
     ===================================================================================== */
  function armIdle() {
    clearTimeout(idleT);
    if (A.reduce || A.quiet || !C) return;
    idleT = setTimeout(function () {
      if (A.step || tour || ins || A.cmp.on || day || turn || A.present || A.busy() || document.hidden) { armIdle(); return; }
      C.controls.autoRotate = true;
      cine = { t0: performance.now(), rain: false };
      A.invalidate();
    }, 12000);
  }
  T.stopIdle = function () {
    if (cine) { if (cine.rain && A.modes.kisa) A.setMode('kisa', 0, { silent: true }); cine = null; }
    if (turn) { turn = null; if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop(); }      // any interaction stops the turntable
    if (C) C.controls.autoRotate = false;
    armIdle();
  };
  T.cinematic = function () { return cine ? { t: (performance.now() - cine.t0) / 1000, rain: cine.rain } : null; };
  T.start = function () {
    armIdle();
    var seen = true;
    try { seen = !!localStorage.getItem('tk-tour-v2'); } catch (e) { /* storage blocked: do not nag */ }
    if (!seen && !A.quiet && new URLSearchParams(location.search).get('tour') !== '0') setTimeout(function () { T.tour(); }, 700);
  };

  T.tick = function (now, dt) {
    var anim = false;
    if (ins && ins.k < 1) { ins.k = Math.min(1, ins.k + dt / 0.3); anim = true; }
    if (day) {
      var k = (now - day.t0) / 12000, h = 6 + 16 * Math.min(1, k);
      A.set('sat', Math.round(h * 100) / 100, { fast: true, quiet: true });
      if (TK.ui) TK.ui.dayTick(h);
      if (k >= 1.05) T.stopDay();
      anim = true;
    }
    if (cine) {
      var t = (now - cine.t0) / 1000;
      if (t > 5 && !cine.rain && !cineRainUsed && !A.modes.kisa && !A.modes.zima) { cine.rain = true; cineRainUsed = true; A.setMode('kisa', 1, { silent: true }); }
      if (t > 11.5 && cine.rain && A.modes.kisa) { cine.rain = false; A.setMode('kisa', 0, { silent: true }); }
    }
    return anim;
  };

  /* =====================================================================================
     Guided tour
     ===================================================================================== */
  var TOUR = [
    { sel: '.k-rail__b[data-step="1"]', t: TK.t('k.tour.1') },
    { sel: '.k-rail__b[data-step="2"]', t: TK.t('k.tour.2') },
    { sel: '.k-rail__b[data-step="3"]', t: TK.t('k.tour.3') },
    { sel: '.k-rail__b[data-step="6"]', t: TK.t('k.tour.4') },
    { sel: '#kDock', t: TK.t('k.tour.5') },
    { sel: '#kListBtn', t: TK.t('k.tour.6') }
  ];
  T.tour = function () {
    if (tour) return;
    T.stopIdle(); clearTimeout(idleT);
    if (TK.ui) TK.ui.close();
    var box = $('#kTour');
    tour = { i: 0, box: box, prev: document.activeElement };
    box.hidden = false;
    tourStep();
    window.addEventListener('resize', tourStep);
  };
  function tourStep() {
    if (!tour) return;
    var st = TOUR[tour.i], el = $(st.sel), box = tour.box, hole = $('.k-tour__hole', box), card = $('.k-tour__card', box);
    if (el && el.scrollIntoView && el.closest('.k-rail, .k-dock')) el.scrollIntoView({ block: 'nearest', inline: 'center' });
    var r = el ? el.getBoundingClientRect() : { left: innerWidth / 2 - 40, top: innerHeight / 2 - 40, width: 80, height: 80 }, pad = 6;
    hole.style.cssText = 'left:' + (r.left - pad) + 'px;top:' + (r.top - pad) + 'px;width:' + (r.width + 2 * pad) + 'px;height:' + (r.height + 2 * pad) + 'px';
    $('.k-tour__n', box).textContent = (tour.i + 1) + ' / ' + TOUR.length;
    $('.k-tour__t', box).textContent = st.t;
    $('[data-tour-next]', box).textContent = TK.t(tour.i === TOUR.length - 1 ? 'k.tour.start' : 'k.tour.next');
    // card next to the target: left of it when the target sits at the right edge, otherwise below / above
    var cw = Math.min(320, innerWidth - 24), ch = card.offsetHeight || 150, x, y;
    if (r.left > innerWidth * 0.62 && r.top > 110 && innerWidth > 820) { x = r.left - cw - 18; y = Math.min(innerHeight - ch - 12, Math.max(12, r.top + r.height / 2 - ch / 2)); }
    else { x = Math.min(innerWidth - cw - 12, Math.max(12, r.left + r.width / 2 - cw / 2)); y = r.top + r.height + 16 + ch < innerHeight ? r.top + r.height + 16 : r.top - ch - 16; }
    card.style.cssText = 'left:' + x + 'px;top:' + Math.max(12, y) + 'px;width:' + cw + 'px';
    $('[data-tour-next]', box).focus();
  }
  T.tourNext = function () { if (!tour) return; if (tour.i >= TOUR.length - 1) { T.tourEnd(); return; } tour.i++; tourStep(); };
  T.tourEnd = function () {
    if (!tour) return;
    tour.box.hidden = true;
    window.removeEventListener('resize', tourStep);
    try { localStorage.setItem('tk-tour-v2', '1'); } catch (e) { /* ignore */ }
    var p = tour.prev; tour = null;
    if (p && p.focus) p.focus();
    armIdle();
  };
  T.touring = function () { return tour ? tour.i + 1 : 0; };
})();
