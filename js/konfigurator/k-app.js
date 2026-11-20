/* ==========================================================================
   TRICOM konfigurator — k-app.js
   State <-> URL hash (one configuration or two in compare mode), renderer,
   render loop (on demand, plus a slow ambient tick for wind and clouds),
   camera flights, ambient occlusion pass, live thumbnails, photo mode,
   share / print / quote, the inquiry list, and a mode without WebGL in
   which the steps and the specification still work.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var A = TK.app = {};
  // r147 defaults to legacy colour handling (hex colours taken as linear). Turn it off so every
  // hex / CSS colour (RAL values!) is read as sRGB and converted to the linear working space.
  if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
  var D = TK.data, V3 = THREE.Vector3;
  var renderer, scene, camera, controls, canvas, stage;
  var dirty = false, raf = 0, lastMove = 0, tween = null, shadowDirty = true, ambT = 0;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  // asset version from this script's own address (?v=…), so the still picture matches the <head> preload
  var VER = ((document.currentScript && document.currentScript.src.match(/\?v=[^&#]+/)) || [''])[0];
  A.reduce = reduce;
  A.quiet = params.get('auto') === '0';            // automated runs: no idle orbit, no tour
  A.mobile = window.matchMedia('(max-width: 820px)').matches || (window.matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820) || params.get('tier') === 'mobile';
  // quality tier shared with the hero (js/metal-env.js): high / medium / low; ?tier=… forces one
  var TIER = window.MetalEnv ? window.MetalEnv.tier() : (A.mobile ? 'medium' : 'high');
  if (A.mobile && TIER === 'high') TIER = 'medium';
  A.tier = TIER;
  A.quality = {
    high:   { shadow: 4096, pr: 1.5, ao: 8, msaa: 4, blades: 18000, rain: 9000, splash: 700, screwLod: 1, trees: 180, clouds: true, photo: { w: 3840, h: 2560, n: 24 } },
    medium: { shadow: 2048, pr: 1.25, ao: 0, msaa: 4, blades: 7000, rain: 4000, splash: 300, screwLod: 2, trees: 80, clouds: false, photo: { w: 3840, h: 2560, n: 14 } },
    low:    { shadow: 0, pr: 1.0, ao: 0, msaa: 0, blades: 0, rain: 2000, splash: 150, screwLod: 3, trees: 36, clouds: false, flatSky: true, photo: { w: 1920, h: 1280, n: 8 } }
  }[TIER];
  A.quality.tier = TIER;
  if (params.get('ao') === '0') A.quality.ao = 0;
  if (params.has('msaa')) A.quality.msaa = +params.get('msaa');
  A.ambient = !reduce && !A.mobile && params.get('anim') !== '0';
  A.state = null; A.house = null; A.mats = null; A.step = 0; A.panelInset = { right: 0, bottom: 0, left: 0 };
  A.states = [null, null]; A.houses = [null, null];
  A.cmp = { on: false, split: 0.5, active: 0 };
  A.modes = { kisa: 0, zima: 0, kote: 0 };
  A.time = 0;

  /* ---- state <-> hash ---------------------------------------------------- */
  function valid(list, id) { return !!D.find(list, id); }
  function facOk(s) { return s && TK.mat.parseFacade(s) && D.find(D.facades, s.split('.')[0] === 'lamperija' ? 'lamperijav' : s.split('.')[0]); }
  function facNorm(s) { var f = TK.mat.parseFacade(s); return f.type + '.' + f.color; }
  function clampInt(v, a, b) { v = parseInt(v, 10); return isNaN(v) ? a : Math.min(b, Math.max(a, v)); }

  function num(v, lo, hi) { v = parseFloat(v); return isNaN(v) ? null : Math.min(hi, Math.max(lo, v)); }
  function byCode(list, c) { for (var i = 0; i < list.length; i++) if (list[i].code === c || list[i].id === c) return list[i].id; return null; }
  // readable short links for marketing: #o=dvovodni&p=tr35&m=plast&c=7016&g=pk125 (+ v pipe, l/w/n dimensions)
  var SHORT = { o: 'kuca', p: 'krov', m: 'mat', c: 'boja', g: 'oluk', v: 'cev', l: 'duz', w: 'sir', n: 'nagib' };
  A.isShort = function (str) { var q = new URLSearchParams(String(str || '').replace(/^#/, '')); return !q.has('kuca') && !q.has('a') && Object.keys(SHORT).some(function (k) { return q.has(k); }); };
  function parseOne(str) {
    var s = JSON.parse(JSON.stringify(D.defaults)), q = new URLSearchParams(String(str || '').replace(/^#/, '')), x;
    function ral(v) { v = String(v || '').replace(/^ral/i, ''); return D.ralByCode[v] ? v : null; }
    if (A.isShort(str)) {                     // short form → long keys; codes for gutters and pipes
      var q2 = new URLSearchParams();
      Object.keys(SHORT).forEach(function (k) { if (q.has(k)) q2.set(SHORT[k], q.get(k)); });
      if (q2.has('oluk')) q2.set('oluk', byCode(D.gutters, q2.get('oluk')) || '');
      if (q2.has('cev')) q2.set('cev', byCode(D.pipes, q2.get('cev')) || '');
      if (q2.has('boja') && !q2.has('mat')) q2.set('mat', 'plast');
      q = q2;
    }
    if (valid(D.houses, x = q.get('kuca'))) s.kuca = x;
    if (s.kuca === 'hala') Object.keys(D.halaDefaults).forEach(function (k) { if (!q.has(k)) s[k] = D.halaDefaults[k]; });      // a hall link names only what differs
    var hd = D.find(D.houses, s.kuca).dims;
    if (q.has('duz')) s.duz = num(q.get('duz'), hd.L[1], hd.L[2]);
    if (q.has('sir')) s.sir = num(q.get('sir'), hd.W[1], hd.W[2]);
    if (q.has('nagib')) s.nagib = num(q.get('nagib'), hd.p[1], hd.p[2]);
    if (q.has('prep') && hd.oe) s.prep = num(q.get('prep'), hd.oe[1], hd.oe[2]);
    if (q.has('zab') && hd.og) s.zab = num(q.get('zab'), hd.og[1], hd.og[2]);
    if (q.has('hv') && hd.hv) s.hv = num(q.get('hv'), hd.hv[1], hd.hv[2]);
    if (q.has('hk')) s.hk = q.get('hk') === '1' ? 1 : 2;
    if (q.has('hpar')) s.hpar = q.get('hpar') === '1' ? 1 : 0;
    if (q.has('hzid')) s.hzid = q.get('hzid') === '0' ? 0 : 1;
    if ((x = D.find(D.profiles, q.get('hzp'))) && x.use !== 'roof') s.hzp = x.id;
    if ((x = ral(q.get('hzb')))) s.hzb = x;
    if (q.has('badza')) s.badza = q.get('badza') === '0' ? 0 : 1;
    if (q.has('deb')) { x = parseFloat(q.get('deb')); if (x > 0.3 && x < 2) s.deb = x; }
    if (q.has('sneg')) s.sneg = /^[0-4]$/.test(q.get('sneg')) ? +q.get('sneg') : 'auto';
    if (valid(D.profiles, x = q.get('krov'))) s.krov = x;
    if (valid(D.finishes, x = q.get('mat'))) s.mat = x;
    if ((x = ral(q.get('boja')))) s.boja = x;
    if (q.has('patina')) s.patina = clampInt(q.get('patina'), 0, 100);
    if (q.has('starenje')) s.starenje = clampInt(q.get('starenje'), 0, 100);
    if (valid(D.ridgeTypes, x = q.get('sleme'))) s.sleme = x;
    if (valid(D.gutters, x = q.get('oluk'))) s.oluk = x;
    if (valid(D.pipes, x = q.get('cev'))) s.cev = x;
    if (q.has('uskladi')) s.uskladi = q.get('uskladi') === '0' ? 0 : 1;
    if (valid(D.finishes, x = q.get('omat'))) s.omat = x;
    if ((x = ral(q.get('oboja')))) s.oboja = x;
    if (q.has('opatina')) s.opatina = clampInt(q.get('opatina'), 0, 100);
    if (q.has('vert')) s.vert = /^[1-9][0-9]?$/.test(q.get('vert')) ? q.get('vert') : 'auto';
    if (facOk(x = q.get('fasada'))) s.fasada = facNorm(x);
    if (q.has('zona1')) s.zona1 = facOk(x = q.get('zona1')) && x !== 'ista' ? facNorm(x) : '';
    if (q.has('zona2')) s.zona2 = facOk(x = q.get('zona2')) && x !== 'ista' ? facNorm(x) : '';
    if (valid(D.frames, x = q.get('prozori'))) s.prozori = x;
    if (valid(D.envs, x = q.get('okolina'))) s.okolina = x;
    if (q.has('sat')) { x = parseFloat(q.get('sat')); if (x >= 6 && x <= 22) s.sat = Math.round(x * 2) / 2; }
    if (valid(D.dates, x = q.get('datum'))) s.datum = x;
    if (q.has('detalji')) s.detalji = q.get('detalji').split(',').filter(function (d) { return valid(D.details, d); });
    var vp = A.validProfile(s); if (vp) s.krov = vp;
    return s;
  }
  // nested form used inside a=…&b=… : ';' between pairs and ':' between key and value
  function enc(s) { return A.serialize(s).replace(/&/g, ';').replace(/=/g, ':'); }
  function dec(v) { return String(v || '').replace(/;/g, '&').replace(/:/g, '='); }
  A.parse = function (hash) {
    var str = String(hash || '').replace(/^#/, ''), q = new URLSearchParams(str), out = { states: [null, null], active: 0, modes: { kisa: 0, zima: 0, kote: 0 } };
    if (q.has('a') && q.has('b')) {
      out.states = [parseOne(dec(q.get('a'))), parseOne(dec(q.get('b')))];
      out.active = q.get('strana') === 'b' ? 1 : 0;
      ['okolina', 'sat', 'datum'].forEach(function (k) { out.states[1][k] = out.states[0][k]; });
    } else out.states[0] = parseOne(str);
    ['kisa', 'zima', 'kote'].forEach(function (k) { out.modes[k] = q.get(k) === '1' ? 1 : 0; });
    if (out.modes.zima) out.modes.kisa = 0;
    return out;
  };

  A.serialize = function (s) {
    s = s || A.state;
    var dm = TK.house.dims(s), hd = D.find(D.houses, s.kuca).dims;
    var p = ['kuca=' + s.kuca, 'duz=' + dm.L, 'sir=' + dm.W, 'nagib=' + dm.p];
    if (hd.oe) p.push('prep=' + dm.oe);
    if (hd.og) p.push('zab=' + dm.og);
    if (s.kuca === 'hala') p.push('hv=' + dm.hv, 'hk=' + (+s.hk === 1 ? 1 : 2), 'hpar=' + (+s.hpar ? 1 : 0), 'hzid=' + (+s.hzid ? 1 : 0), 'hzp=' + s.hzp, 'hzb=' + s.hzb);
    if (s.kuca === 'dvovodni' && +s.badza === 0) p.push('badza=0');
    p.push('krov=' + s.krov, 'mat=' + s.mat);
    if (+s.deb > 0) p.push('deb=' + (+s.deb).toFixed(2));
    if (s.mat === 'plast') p.push('boja=ral' + s.boja);
    if (s.mat === 'bakar') p.push('patina=' + s.patina);
    p.push('sleme=' + s.sleme, 'oluk=' + s.oluk, 'cev=' + s.cev, 'uskladi=' + s.uskladi);
    if (!s.uskladi) {
      p.push('omat=' + s.omat);
      if (s.omat === 'plast') p.push('oboja=ral' + s.oboja);
      if (s.omat === 'bakar') p.push('opatina=' + s.opatina);
    }
    if (s.starenje && (s.mat === 'cink' || (!s.uskladi && s.omat === 'cink'))) p.push('starenje=' + s.starenje);
    if (s.vert !== 'auto') p.push('vert=' + s.vert);
    if (s.sneg !== 'auto' && s.sneg !== undefined) p.push('sneg=' + s.sneg);
    p.push('fasada=' + s.fasada, 'zona1=' + (s.zona1 || 'ista'), 'zona2=' + (s.zona2 || 'ista'));
    p.push('prozori=' + s.prozori, 'okolina=' + s.okolina, 'sat=' + s.sat);
    if (s.datum && s.datum !== 'mar') p.push('datum=' + s.datum);
    p.push('detalji=' + s.detalji.join(','));
    return p.join('&');
  };
  A.hash = function () {
    var h = A.cmp.on ? 'a=' + enc(A.states[0]) + '&b=' + enc(A.states[1]) + (A.cmp.active ? '&strana=b' : '') : A.serialize(A.states[0]);
    ['kisa', 'zima', 'kote'].forEach(function (k) { if (A.modes[k]) h += '&' + k + '=1'; });
    if (A.present) h += '&present=1';          // presentation: clean full-screen view with the turntable on
    return h;
  };
  function writeHash() {
    A.hashStamp = (A.hashStamp || 0) + 1;
    try { history.replaceState(null, '', location.pathname + location.search + '#' + A.hash()); } catch (e) { /* file:// in some browsers */ }
  }
  A.rehash = writeHash;

  /* ---- undo / redo: snapshots of the whole hash (both sides, modes) before every change ------ */
  var hist = { past: [], future: [], lock: false, lastKey: '', lastT: 0 };
  function record(before, key) {
    if (hist.lock || !A.ready || before === A.hash()) return;
    var now = performance.now();
    // a slider dragged through many values is one step
    if (key && key === hist.lastKey && now - hist.lastT < 900) { hist.lastT = now; return; }
    hist.lastKey = key || ''; hist.lastT = now;
    hist.past.push(before); if (hist.past.length > 80) hist.past.shift();
    hist.future = [];
    if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop();
  }
  function jump(h) {
    hist.lock = true;
    try { A.load('#' + h); } finally { hist.lock = false; }
    hist.lastKey = '';
    if (TK.ui && TK.ui.refreshTop) TK.ui.refreshTop();
  }
  A.undo = function () { if (!hist.past.length) return false; hist.future.push(A.hash()); jump(hist.past.pop()); return true; };
  A.redo = function () { if (!hist.future.length) return false; hist.past.push(A.hash()); jump(hist.future.pop()); return true; };
  A.canUndo = function () { return hist.past.length > 0; };
  A.canRedo = function () { return hist.future.length > 0; };
  A.history = function () { return { past: hist.past.length, future: hist.future.length }; };
  // shared links carry the configuration only (query switches such as ?auto=0 are for test runs)
  A.base = function () { return location.href.split('#')[0].split('?')[0]; };
  A.url = function () { return A.base() + '#' + A.hash(); };
  // short, human-quotable code of one configuration (printed on the photo and the PDF)
  A.code = function (s) {
    var str = A.serialize(s || A.state).replace(/&okolina=[^&]*|&sat=[^&]*|&datum=[^&]*/g, ''), h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    var c = ('000000' + (h >>> 0).toString(36).toUpperCase()).slice(-6);
    return 'TK-' + c.slice(0, 3) + '-' + c.slice(3);
  };

  /* ---- finishes ----------------------------------------------------------- */
  A.roofSpec = function (s) { return TK.mat.roofSpec(s || A.state); };
  A.gutterSpec = function (s) { return TK.mat.gutterSpec(s || A.state); };
  function applyMaterials(i) {
    i = i === undefined ? A.cmp.active : i;
    TK.mat.applyState(TK.mat.sets[i], A.states[i], i ? 'B' : '');
  }

  /* ---- houses ----------------------------------------------------------------- */
  function activate(i) {
    A.cmp.active = i;
    A.state = A.states[i]; A.house = A.houses[i]; A.mats = TK.mat.sets ? TK.mat.sets[i] : null;
  }
  function build(i) {
    var old = A.houses[i];
    if (old) { if (!A.noGL) TK.weather.detach(old); old.dispose(); }
    var h = A.houses[i] = TK.house.build(A.states[i], { mats: TK.mat.sets[i], screwLod: A.quality.screwLod, defer: !A.dressed });
    A.specCache = null;
    if (A.noGL) { if (i === A.cmp.active) A.house = h; return; }
    scene.add(h.group);
    TK.weather.attach(h);
    TK.env.captureHide = [A.houses[0] && A.houses[0].group, A.houses[1] && A.houses[1].group, TK.tools && TK.tools.group];
    if (i === A.cmp.active) {
      A.house = h;
      TK.env.layout(h);
      var d = h.dims;
      A.radius = 0.5 * Math.sqrt(d.L * d.L + d.W * d.W + d.top * d.top);
      controls.maxDistance = A.radius * 4.2;
      if (TK.tools) TK.tools.houseChanged();
    }
    shadowDirty = true;
  }
  function show(i) {            // which house is drawn (compare mode renders the scene once per side)
    if (A.houses[0]) A.houses[0].group.visible = i === 0;
    if (A.houses[1]) A.houses[1].group.visible = i === 1;
  }

  var GEO_KEYS = { kuca: 1, krov: 1, oluk: 1, cev: 1, vert: 1, sleme: 1, detalji: 1, duz: 1, sir: 1, nagib: 1, prep: 1, zab: 1, hv: 1, hk: 1, hpar: 1, hzid: 1, hzp: 1, badza: 1, sneg: 1 }, SHARED = { okolina: 1, sat: 1, datum: 1 };
  var DIM_KEYS = ['duz', 'sir', 'nagib', 'prep', 'zab', 'hv'];
  // a hall accepts only profiles whose minimal slope allows its pitch: the closest allowed one is taken
  A.validProfile = function (s) {
    var deg = TK.house.dims(s).p, cur = D.find(D.profiles, s.krov);
    if (s.kuca !== 'hala' || (cur && cur.minSlope <= deg)) return null;
    var ok = D.profiles.filter(function (p) { return p.minSlope <= deg && p.use !== 'wall'; });
    return ok.length ? (ok.filter(function (p) { return p.id === 'tr40'; })[0] || ok[0]).id : null;
  };
  A.set = function (key, val, o) {
    var s = A.state, before = A.ready ? A.hash() : null;
    if (key === 'kisa' || key === 'zima' || key === 'kote') { A.setMode(key, !!val); return; }
    if (key === 'detalj') {                         // toggle one flashing detail
      var i = s.detalji.indexOf(val);
      if (i >= 0) s.detalji.splice(i, 1); else s.detalji.push(val);
      s.detalji = D.details.map(function (d) { return d.id; }).filter(function (id) { return s.detalji.indexOf(id) >= 0; });
      key = 'detalji';
    } else {
      if (s[key] === val) return;
      s[key] = val;
    }
    if (key === 'kuca') {
      s.vert = 'auto';
      DIM_KEYS.forEach(function (k) { s[k] = null; });            // the new type starts from its own dimensions
      if (val === 'hala') ['krov', 'oluk', 'cev', 'fasada', 'zona1', 'zona2'].forEach(function (k) { s[k] = D.halaDefaults[k]; });
    }
    var vp = A.validProfile(s);
    if (vp) { s.krov = vp; if (TK.ui && TK.ui.toast) TK.ui.toast(TK.t('k.app.autoProfile', { d: Math.round(TK.house.dims(s).p), p: D.find(D.profiles, vp).name })); }
    if (A.noGL) {
      if (GEO_KEYS[key] || key === 'deb' || key === 'hzb') build(A.cmp.active);
      A.specCache = null;
      if (!(o && o.fast)) writeHash();
      if (before !== null && !(o && o.fast)) record(before, key);
      if (TK.ui && !(o && o.quiet)) TK.ui.refresh(key);
      return;
    }
    if (SHARED[key] && A.states[1]) { A.states[0][key] = val; A.states[1][key] = val; }
    if (GEO_KEYS[key]) build(A.cmp.active);
    A.specCache = null;
    if (key === 'okolina') TK.env.setKind(val);
    if (!SHARED[key]) applyMaterials();
    if (key === 'okolina' || key === 'sat' || key === 'datum') TK.env.setTime(s.sat, s.datum, o && o.fast ? { fast: true } : null);
    shadowDirty = true;
    if (!(o && o.fast)) writeHash();
    if (before !== null && !(o && o.fast)) record(before, key);
    if (TK.ui && !(o && o.quiet)) TK.ui.refresh(key);
    if (key === 'kuca') A.fly(A.step ? 'step' + A.step : 'home');
    A.invalidate();
  };
  A.load = function (hash) {                         // restore a whole configuration (or a pair)
    var p = A.parse(hash), before = A.ready ? A.hash() : null;
    if (before !== null) record(before, 'load');
    A.present = /(^|[#&])present=1(&|$)/.test(String(hash || ''));
    document.body.classList.toggle('k-present', A.present);
    if (A.noGL) { A.states[0] = p.states[0]; activate(0); build(0); applyMaterials(0); writeHash(); if (TK.ui) TK.ui.refresh('all'); return; }
    TK.weather.instant = true;
    if (TK.tools) TK.tools.reset();
    A.states[0] = p.states[0];
    if (p.states[1]) { A.states[1] = p.states[1]; if (!TK.mat.sets[1]) TK.mat.sets[1] = TK.mat.makeSet(); A.cmp.on = true; }
    else { dropB(); }
    activate(p.states[1] ? p.active : 0);
    build(0); applyMaterials(0);
    if (A.cmp.on) { build(1); applyMaterials(1); }
    activate(A.cmp.active); TK.env.layout(A.house);
    ['kisa', 'zima'].forEach(function (k) { A.modes[k] = p.modes[k]; });
    datumKeep = null;
    if (A.modes.zima && A.states[0].datum !== 'dec') { datumKeep = A.states[0].datum; setShared('datum', 'dec'); }      // winter always uses the December sun
    else if (A.modes.zima) datumKeep = 'mar';
    TK.weather.set('rain', !!A.modes.kisa); TK.weather.set('snow', !!A.modes.zima);
    TK.env.weather.rain = A.modes.kisa; TK.env.weather.snow = A.modes.zima;
    TK.env.setKind(A.state.okolina); TK.env.setTime(A.state.sat, A.state.datum);
    A.modes.kote = p.modes.kote; if (TK.tools) TK.tools.kote(!!A.modes.kote);
    TK.weather.instant = false;
    show(A.cmp.active);
    writeHash();
    if (TK.ui) TK.ui.refresh('all');
    A.invalidate();
  };

  /* ---- view modes: rain, winter, dimension overlay ---------------------------------- */
  var datumKeep = null;
  A.setMode = function (k, on, o) {
    if (A.noGL) return;
    on = on ? 1 : 0;
    if (A.modes[k] === on) return;
    if (A.ready) record(A.hash(), 'mode' + k);
    A.modes[k] = on;
    if (k === 'kote') { TK.tools.kote(!!on); }
    else {
      if (k === 'kisa' && on && A.modes.zima) winter(0);
      if (k === 'zima' && on) A.modes.kisa = 0;
      if (k === 'zima') winter(on);
      TK.weather.set(k === 'kisa' ? 'rain' : 'snow', !!on);
      TK.env.weather.rain = A.modes.kisa; TK.env.weather.snow = A.modes.zima;
      TK.env.setTime(A.state.sat, A.state.datum);
      shadowDirty = true;
    }
    if (!(o && o.silent)) writeHash();
    if (TK.ui) TK.ui.refresh('mode');
    A.invalidate();
  };
  function winter(on) {         // winter light: the sun follows the 21 December path while the mode is on
    A.modes.zima = on;
    if (on) { datumKeep = A.state.datum; setShared('datum', 'dec'); }
    else if (datumKeep) { setShared('datum', datumKeep); datumKeep = null; }
  }
  function setShared(k, v) { A.states.forEach(function (s) { if (s) s[k] = v; }); }

  /* ---- compare mode ------------------------------------------------------------------ */
  function dropB() {
    if (A.houses[1]) { TK.weather.detach(A.houses[1]); A.houses[1].dispose(); A.houses[1] = null; }
    A.states[1] = null; A.cmp.on = false;
    TK.env.dropSunB();
  }
  A.setCompare = function (on) {
    if (on === A.cmp.on || A.noGL) return;
    if (A.ready) record(A.hash(), 'compare');
    if (TK.tools) TK.tools.reset();
    if (on) {
      if (!TK.mat.sets[1]) TK.mat.sets[1] = TK.mat.makeSet();
      A.states[1] = JSON.parse(JSON.stringify(A.states[0]));
      A.cmp.on = true; A.cmp.split = 0.5;
      activate(1); build(1); applyMaterials(1);
    } else {
      // the active side is the one that stays
      if (A.cmp.active === 1) { swap(); }
      dropB(); activate(0); TK.env.layout(A.house); if (TK.tools) TK.tools.houseChanged();
    }
    show(A.cmp.active);
    shadowDirty = true; writeHash();
    if (TK.ui) TK.ui.refresh('compare');
    A.invalidate();
  };
  function swap() {
    A.states.reverse(); A.houses.reverse(); TK.mat.sets.reverse();
  }
  A.swap = function () {
    if (!A.cmp.on) return;
    swap(); activate(A.cmp.active);
    TK.env.layout(A.house); if (TK.tools) TK.tools.houseChanged();
    shadowDirty = true; writeHash();
    if (TK.ui) TK.ui.refresh('compare');
    A.invalidate();
  };
  A.activate = function (i) {
    if (!A.cmp.on || i === A.cmp.active) return;
    activate(i);
    TK.env.layout(A.house); if (TK.tools) TK.tools.houseChanged();
    var d = A.house.dims; A.radius = 0.5 * Math.sqrt(d.L * d.L + d.W * d.W + d.top * d.top);
    shadowDirty = true; writeHash();
    if (TK.ui) TK.ui.refresh('compare');
    A.invalidate();
  };
  A.setSplit = function (f) { A.cmp.split = Math.min(0.85, Math.max(0.15, f)); A.invalidate(); };
  // divider position in CSS px, inside the part of the stage that the panel leaves free
  A.splitX = function () { var L = A.panelInset.left || 0; return Math.round(L + (stage.clientWidth - L - A.panelInset.right) * A.cmp.split); };

  /* ---- views ----------------------------------------------------------------- */
  function view(name) {
    var h = A.house, d = h.dims, a = h.anchors, R = A.radius, c = new V3(d.cx + 0.4, d.top * 0.47, d.cz + 1.2);
    var back = d.flat ? -1 : 1;                 // flat roof: eave and pipes are at the back
    switch (name) {
      case 'spreda': return { t: c, dir: new V3(-0.1, 0.07, 1), r: R * 1.02 };
      case 'bocno': return { t: c, dir: new V3(-1, 0.08, 0.28), r: R * 1.02 };
      case 'oluk': return { t: a.gutter.clone().add(new V3(0, -0.12, 0)), dir: a.pipeView.clone().setY(0.55), r: 1.05 };
      case 'odozgo': return { t: new V3(d.cx, d.top * 0.7, d.cz), dir: new V3(-0.12, 1, 0.42), r: R * 0.98 };
      case 'terasa': return { t: a.terrace.clone().add(new V3(0, 1.2, -1.2)), dir: new V3(0.3, 0.22, 1), r: 4.6 };
      case 'step2': return d.flat ? { t: new V3(d.cx, d.top, d.cz), dir: new V3(-0.35, 0.9, 1), r: d.L * 0.55 } : { t: a.roof, dir: new V3(-0.5, 0.62, 1), r: d.L * 0.36 };
      case 'step3': return { t: a.pipe.clone().lerp(a.gutter, 0.55), dir: a.pipeView.clone().setY(0.1), r: 2.9 };
      case 'wall': return { t: a.wall, dir: new V3(-0.42, 0.12, 1), r: 4.6 };
      case 'window': return { t: a.window, dir: new V3(-0.45, 0.1, 1), r: 2.5 };
      case 'step5': return { t: c, dir: new V3(-0.62, 0.1, 1), r: R * 1.6 };
      case 'step6': return { t: c, dir: new V3(-0.6, 0.16, 1), r: R * 1.06 };
      case 'eave': return { t: a.eave, dir: (a.eaveView || new V3(-1, 0.12, 0.6 * back)).clone(), r: 1.75 };
      case 'step4': return { t: a.ridge.clone().add(new V3(0, -0.5, 0)), dir: d.flat ? new V3(-0.5, 0.75, 1) : new V3(-0.55, 0.42, 1), r: d.flat ? 3.4 : 2.7 };
      case 'kote': return { t: c.clone().add(new V3(-0.6, 0.3, 0)), dir: new V3(-0.75, 0.2, 1), r: R * 1.22 };
      // walk: eye height in the garden; photo presets: front three-quarter, eave detail, aerial with the surroundings
      case 'walk': return { t: new V3(d.cx, 1.65, d.cz), dir: new V3(-0.7, 0.035, 1), r: R * 1.45 };
      case 'front34': return { t: c, dir: new V3(-0.8, 0.3, 1), r: R * 1.18 };
      case 'section': return { t: c.clone().add(new V3(0.6, 0.6, 0)), dir: new V3(1, 0.42, 0.55), r: R * 1.0 };      // looking into the cut face
      case 'aerial': return { t: new V3(d.cx, d.top * 0.5, d.cz), dir: new V3(-0.55, 1.0, 0.7), r: R * 1.3 };
      default: return { t: c, dir: new V3(-0.6, 0.085, 1), r: R * 1.06 };     // home / step1: eye level, like a photo from the garden
    }
  }
  function camFor(v) {
    var w = stage.clientWidth, h = stage.clientHeight, we = Math.max(120, w - A.panelInset.right - (A.panelInset.left || 0)), he = Math.max(120, h - A.panelInset.bottom);
    var tv = Math.tan(camera.fov * Math.PI / 360), tvE = tv * he / h, thE = tv * (w / h) * we / w;
    var half = Math.atan(Math.min(tvE, thE)), dist = v.r / Math.sin(half);
    var dir = v.dir.clone().normalize();
    return { pos: v.t.clone().addScaledVector(dir, dist), target: v.t.clone() };
  }
  A.fly = function (name, instant) { if (A.noGL) return; A.lastView = name; flyTo(view(name), instant); };
  A.flyTo = function (v, instant) { if (A.noGL) return; A.lastView = null; flyTo(v, instant); };
  function flyTo(spec, instant) {
    if (TK.tools) TK.tools.stopIdle();
    tween = null;                 // a new destination always replaces a flight in progress
    var v = camFor(spec);
    if (v.pos.y < 0.35) v.pos.y = 0.35;
    if (instant || reduce) { camera.position.copy(v.pos); controls.target.copy(v.target); applyOffset(); controls.update(); A.invalidate(); return; }
    var o0 = camera.position.clone().sub(controls.target), o1 = v.pos.clone().sub(v.target);
    var s0 = new THREE.Spherical().setFromVector3(o0), s1 = new THREE.Spherical().setFromVector3(o1);
    var dth = s1.theta - s0.theta; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
    tween = { t0: performance.now(), dur: 600, s0: s0, s1: s1, dth: dth, a: controls.target.clone(), b: v.target, off0: A._off.slice(), off1: insetOff() };
    request();
  }
  // shift the principal point so the house stays centred in the area not covered by the panel
  A._off = [0, 0];
  function insetOff() { return [(A.panelInset.right - (A.panelInset.left || 0)) / 2, A.panelInset.bottom / 2]; }
  function applyOffset(o) {
    o = o || insetOff();
    A._off = o;
    var w = stage.clientWidth, h = stage.clientHeight;
    if (o[0] || o[1]) camera.setViewOffset(w, h, o[0], o[1], w, h); else camera.clearViewOffset();
  }
  function stepTween(now) {
    var k = Math.min(1, (now - tween.t0) / tween.dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    var sp = new THREE.Spherical(tween.s0.radius + (tween.s1.radius - tween.s0.radius) * e, tween.s0.phi + (tween.s1.phi - tween.s0.phi) * e, tween.s0.theta + tween.dth * e);
    controls.target.lerpVectors(tween.a, tween.b, e);
    camera.position.setFromSpherical(sp).add(controls.target);
    applyOffset([tween.off0[0] + (tween.off1[0] - tween.off0[0]) * e, tween.off0[1] + (tween.off1[1] - tween.off0[1]) * e]);
    if (k >= 1) tween = null;
    dirty = true;
  }
  A.setPanelInset = function (right, bottom, left) {
    A.panelInset = { right: right, bottom: bottom, left: left || 0 };
  };

  /* ---- dynamic resolution ---------------------------------------------------
     The scene is fill-rate bound. While the camera moves, the pixel ratio follows
     the measured frame time (down to 60 % of the target); as soon as it stops,
     one frame is drawn at the full target ratio, so stills are always sharp.   */
  var dyn = { base: 1, pr: 1, ema: 16, last: 0, hold: 0, moving: false };
  function setPR(pr) {
    pr = Math.round(pr * 100) / 100;
    if (Math.abs(pr - dyn.pr) < 0.01) return;
    dyn.pr = pr;
    renderer.setPixelRatio(pr);
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  }
  function adapt(now, active) {
    if (!active) {                         // settled: restore full resolution for the still image
      if (dyn.moving) { dyn.moving = false; dyn.low = dyn.pr; if (dyn.pr < dyn.base) { setPR(dyn.base); dirty = true; return true; } }
      return false;
    }
    if (!dyn.moving) { dyn.moving = true; dyn.last = 0; if (dyn.low && dyn.low < dyn.base) setPR(dyn.low); }
    if (dyn.last && now - dyn.last < 120) {
      dyn.ema = dyn.ema * 0.8 + (now - dyn.last) * 0.2;
      var min = Math.max(0.6, dyn.base * 0.6);
      if (dyn.ema > 19.5 && dyn.pr > min) { setPR(Math.max(min, dyn.pr * 0.87)); dyn.ema = 16.5; dyn.hold = now + 2500; }
      else if (dyn.ema < 15.2 && dyn.pr < dyn.base && now > dyn.hold) { setPR(Math.min(dyn.base, dyn.pr * 1.08)); dyn.hold = now + 800; }
    }
    dyn.last = now;
    return false;
  }
  A.dyn = dyn;

  /* ---- render loop: frames are produced while something moves; when nothing does, a slow
     ambient tick keeps the grass and the clouds alive (desktop, no reduced motion) ---------- */
  function request() { if (!raf && !A.noGL && !A.offscreen) raf = requestAnimationFrame(frame); }
  A.invalidate = function () { dirty = true; request(); };
  var lastFrame = 0, wasFast = false;
  function frame(now) {
    raf = 0;
    var dt = lastFrame ? Math.min(0.1, (now - lastFrame) / 1000) : 0.016, active = false, anim = false;
    lastFrame = now;
    if (A.sampling) A.sampling.push(now);
    if (tween) { stepTween(now); active = true; }
    if (controls.autoRotate) active = true;
    if (!tween && controls.update()) { dirty = true; lastMove = now; }
    else if (tween) controls.update();
    if (now - lastMove < 500) active = true;
    var insetOn = !!(A.onFrame && A.onFrame(now));
    if (!reduce && !A.frozen) { A.time += dt; TK.mat.U.uTime.value = A.time; }
    TK.env.tick(reduce || A.frozen ? 0 : dt, A.time, camera);
    if (TK.weather.tick(A.frozen ? 0 : dt, camera, controls.target)) { anim = true; dirty = true; }
    if (TK.weather.settled) {             // a weather transition has finished: reflections follow the new ground
      TK.weather.settled = false; TK.env.rebake(); shadowDirty = true; dirty = true;
    }
    if (TK.tools && TK.tools.tick(now, dt)) { anim = true; dirty = true; }
    if (adapt(now, active)) active = true;            // one more (sharp) frame after the motion ends
    if (insetOn) active = true;
    var fast = (active && !insetOn) || anim || !!tween;
    if (!fast && wasFast) dirty = true;               // motion over: redraw once on the multisampled target
    A.fastFrame = fast;
    if (dirty) { render(); wasFast = fast; dirty = false; }
    if (active || anim) request();
    else if (A.ambient && !ambT && !document.hidden && !A.offscreen) ambT = setTimeout(function () { ambT = 0; dirty = true; request(); }, 50);
  }

  function drawMain(cam, rt, frac, sd) {  // colour pass(es); compare mode: once per side through a scissor (sd: shadows are stale)
    if (rt) { rt.scissorTest = false; renderer.setRenderTarget(rt); }
    if (!A.cmp.on) { renderer.render(scene, cam); return; }
    var w = rt ? rt.width : stage.clientWidth, h = rt ? rt.height : stage.clientHeight;
    var sx = Math.round(w * frac);
    for (var i = 0; i < 2; i++) {
      show(i);
      if (TK.tools) TK.tools.side(i === A.cmp.active);
      if (rt) { rt.scissorTest = true; rt.scissor.set(i ? sx : 0, 0, i ? w - sx : sx, h); renderer.setRenderTarget(rt); }
      else { renderer.setScissorTest(true); renderer.setScissor(i ? sx : 0, 0, i ? w - sx : sx, h); }
      TK.env.useSun(i);                             // each side has its own sun and shadow map
      renderer.shadowMap.needsUpdate = !!sd;
      renderer.render(scene, cam);
    }
    if (rt) rt.scissorTest = false; else renderer.setScissorTest(false);
    show(A.cmp.active); TK.env.useSun(A.cmp.active);
    if (TK.tools) TK.tools.side(true);
  }
  function aoPass(cam, w, h, f) {
    TK.fx.aoBegin(scene, cam, w, h);
    if (A.cmp.on) { show(0); TK.fx.aoDraw(scene, cam, 0, f); show(1); TK.fx.aoDraw(scene, cam, f, 1); show(A.cmp.active); }
    else TK.fx.aoDraw(scene, cam, 0, 1);
    return TK.fx.aoEnd(scene, cam);
  }
  // scene -> multisampled linear target -> inspector highlight -> ambient occlusion -> sRGB on the canvas
  function render() {
    if (!canvas.width || !canvas.height) return;           // stage hidden (print layout)
    if (A.warming || A.released || A.lost) return;         // programs still linking (warmed() draws when ready) / page left / context lost
    var sd = shadowDirty; shadowDirty = false;
    if (sd) renderer.shadowMap.needsUpdate = true;
    var rt = TK.fx.frame(canvas.width, canvas.height, A.fastFrame), f = A.splitX() / stage.clientWidth;
    drawMain(camera, rt, f, sd);
    if (TK.tools) TK.tools.overlay(renderer, scene, camera, rt);
    if (rt) {
      var wantAO = TK.fx.aoOn && !A.noAO && A.dressed && !(dyn.moving && dyn.ema > 21 && dyn.pr <= dyn.base * 0.62);
      TK.fx.present(rt, wantAO ? aoPass(camera, canvas.width, canvas.height, f) : null, 2.4);
    }
    A.frames = (A.frames || 0) + 1;
    if (TK.ui) TK.ui.placeHotspots(camera, stage.clientWidth, stage.clientHeight);
    if (TK.tools) TK.tools.place(camera, stage.clientWidth, stage.clientHeight);
  }
  A.renderNow = function () { A.fastFrame = false; render(); };
  A.shadows = function () { shadowDirty = true; A.invalidate(); };

  /* ---- live thumbnails: rendered with the real materials in a corner of the
     main canvas, copied to a 2D canvas, then the main view is redrawn in the
     same task so nothing flickers. Material samples are lit by the current sky
     (by a neutral studio at night, when nothing would be legible). ------------ */
  var thumbScene, thumbCam, thumbSun, thumbMats = {};
  var THUMB_BG = new THREE.Color().setRGB(0.914, 0.929, 0.949);     // written to the framebuffer as-is (= #e9edf2)
  // without WebGL: a flat sample in the finish colour, so every option still has a picture
  function flatThumb(kind, id, spec, w, h) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'), col = '#C9CED3', f;
    if (spec && spec.mat === 'plast') col = (D.ralByCode[spec.ral] || {}).hex || col;
    else if (spec && spec.mat === 'bakar') col = '#B87348'; else if (spec && spec.mat === 'alu') col = '#D9DCDF'; else if (spec && spec.mat === 'inox') col = '#CDD0D3';
    if (kind === 'facade' && (f = TK.mat.parseFacade(id))) col = (f.def.ral ? (D.ralByCode[f.color] || {}).hex : (D.find(f.def.colors, f.color) || {}).hex) || col;
    var g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0.22)');
    x.fillStyle = col; x.fillRect(0, 0, w, h); x.fillStyle = g; x.fillRect(0, 0, w, h);
    return c.toDataURL('image/png');
  }
  function thumbInit() {
    thumbScene = new THREE.Scene();
    thumbSun = new THREE.DirectionalLight(0xffffff, 2.6); thumbSun.position.set(-2, 4, 3); thumbScene.add(thumbSun);
    thumbScene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f96, 0.35));
    thumbCam = new THREE.PerspectiveCamera(28, 1.25, 0.05, 50);
  }
  function skyLit() { var st = TK.env.state; return !!st && st.day > 0.45; }
  A.sample = function (kind, id, spec, len) {
    var G = TK.geo, M = TK.mat, g, mat, UP = new V3(0, 1, 0);
    if (kind === 'facade') {
      mat = thumbMats['f' + id] || (thumbMats['f' + id] = M.wallMat());
      M.applyFacade(mat, id);
      g = new THREE.PlaneGeometry(1.5, 1.2);
      var p = g.attributes.position, uv = g.attributes.uv;
      for (var i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getY(i));
      return new THREE.Mesh(g, mat);
    }
    var roofLike = kind === 'sheet', key = (roofLike ? 'ms' : 'mg') + JSON.stringify(spec);
    mat = thumbMats[key] || (thumbMats[key] = M.metal(roofLike));
    M.applyFinish(mat, spec, 'thumb' + (spec.patina || 0));
    if (kind === 'sheet') {
      var pl = G.plane(new V3(0, 0, 0.42), new V3(0, 0, -1), 0.4), prof = D.find(D.profiles, id);
      pl.poly = [[-0.6, 0], [0.6, 0], [0.6, 0.95], [-0.6, 0.95]];
      g = G.skin(pl, prof, 3).geo;
    } else if (kind === 'swatch') {
      // curved sample: a bent strip of sheet, so the reflection sweeps across it
      var sec = [], n = 28, R = 0.46;
      for (var k = 0; k <= n; k++) { var an = (-0.62 + 1.24 * k / n); sec.push([Math.sin(an) * R, Math.cos(an) * R - R * 0.75]); }
      g = G.sweep([new V3(-0.42, 0, 0), new V3(0.42, 0, 0)], sec, new V3(0, 0, -1), UP, { smooth: true });
    } else if (kind === 'gutter') {
      var hl = (len || 0.64) / 2, def = D.find(D.gutters, id), gs = G.gutterSection(def), a = new V3(-hl, 0, 0), b = new V3(hl, 0, 0), z = new V3(0, 0, 1);
      var hk = G.hook(def), hk2 = hk.clone(); hk.translate(-hl * 0.62, 0, 0); hk2.translate(hl * 0.62, 0, 0);
      g = G.merge([G.sweep([a, b], gs, z, UP, { smooth: def.shape === 'round' }), G.cap(a, gs, z, UP), hk, hk2]);
    } else {
      var pd = D.find(D.pipes, id);
      g = G.merge([G.pipe([new V3(-0.02, 0.42, 0), new V3(-0.02, 0.0, 0), new V3(0.2, -0.16, 0)], pd, new V3(0, 0, 1)).geo]);
    }
    return new THREE.Mesh(g, mat);
  };
  // draw obj into ctx (2D canvas context) at w x h CSS px
  A.thumbDraw = function (obj, ctx, w, h, dir, bg, zoom, studio) {
    if (!thumbScene) thumbInit();
    if (!canvas.width || !canvas.height) return;           // stage hidden (print layout)
    var pr = renderer.getPixelRatio(), cw = canvas.width, chh = canvas.height, live = !studio && skyLit(), st = TK.env.state;
    w = Math.min(w, Math.floor(cw / pr)); h = Math.min(h, Math.floor(chh / pr));
    thumbScene.environment = live ? scene.environment : TK.env.studio;
    if (live) { thumbSun.color.copy(TK.env.sunLight().color); thumbSun.intensity = Math.max(0.5, TK.env.sunLight().intensity * 0.75); }
    else { thumbSun.color.set(0xffffff); thumbSun.intensity = 2.6; }
    thumbScene.add(obj);
    var box = new THREE.Box3().setFromObject(obj), sph = box.getBoundingSphere(new THREE.Sphere());
    thumbCam.aspect = w / h; thumbCam.updateProjectionMatrix();
    var d = (dir || new V3(0.55, 0.6, 1)).clone().normalize();
    thumbCam.position.copy(sph.center).addScaledVector(d, sph.radius / Math.sin(thumbCam.fov * Math.PI / 360) * (zoom || 0.9));
    thumbCam.lookAt(sph.center);
    var oldBg = renderer.getClearColor(new THREE.Color()).clone(), oldA = renderer.getClearAlpha();
    renderer.setClearColor(A.thumbBg(), 1);
    renderer.setViewport(0, 0, w, h); renderer.setScissor(0, 0, w, h); renderer.setScissorTest(true);
    var exp = renderer.toneMappingExposure; renderer.toneMappingExposure = live ? Math.min(1.25, exp * 1.05) : 1.0;
    var sm = renderer.shadowMap.needsUpdate; renderer.shadowMap.needsUpdate = false;
    renderer.render(thumbScene, thumbCam);
    renderer.shadowMap.needsUpdate = sm;
    ctx.drawImage(canvas, 0, chh - Math.round(h * pr), Math.round(w * pr), Math.round(h * pr), 0, 0, ctx.canvas.width, ctx.canvas.height);
    renderer.toneMappingExposure = exp;
    renderer.setScissorTest(false); renderer.setViewport(0, 0, stage.clientWidth, stage.clientHeight);
    renderer.setClearColor(oldBg, oldA);
    thumbScene.remove(obj);
    dirty = true;
  };
  var thumbCache = {}, THUMB_VIEW = {
    facade: [new V3(0, 0, 1), 0.62], pipe: [new V3(0.7, 0.25, 1), 0.9], gutter: [new V3(0.7, 0.85, 1), 0.9], sheet: [new V3(0.5, 0.75, 1), 0.74], swatch: [new V3(0.35, 0.5, 1), 0.66]
  };
  // sample backdrop: the panel surface of the current theme (light / dark)
  A.theme = function () { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; };
  var THUMB_BG_DARK = new THREE.Color('#222934');
  A.thumbBg = function () { return A.theme() === 'dark' ? THUMB_BG_DARK : THUMB_BG; };
  A.thumb = function (kind, id, spec, w, h) {
    var key = kind + '|' + id + '|' + JSON.stringify(spec || 0) + '|' + (w || 0) + '|' + A.theme() + '|' + (A.noGL ? 'x' : skyLit() && !TK.env.isStudio() ? TK.env.stamp : 's');
    if (thumbCache[key]) return thumbCache[key];
    if (A.noGL) return (thumbCache[key] = flatThumb(kind, id, spec, w || 144, h || 112));
    if (A.noThumbs) return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';     // test switch
    var c = document.createElement('canvas'); c.width = (w || 144) * 2; c.height = (h || 112) * 2;
    var obj = A.sample(kind, id, spec), v = THUMB_VIEW[kind];
    A.thumbDraw(obj, c.getContext('2d'), w || 144, h || 112, v[0], 0xe9edf2, v[1]);
    obj.geometry.dispose();
    request();          // the main view is redrawn in the next animation frame, i.e. before the browser paints
    A.thumbCount = (A.thumbCount || 0) + 1;
    return (thumbCache[key] = c.toDataURL('image/jpeg', 0.86));
  };
  // 300 % close-up of the same sample, for the hover loupe
  A.loupe = function (kind, id, spec, ctx, px) {
    if (A.noGL) return;
    var obj = A.sample(kind === 'facade' ? 'facade' : kind === 'sheet' ? 'sheet' : 'swatch', id, spec), v = THUMB_VIEW[kind === 'facade' ? 'facade' : kind === 'sheet' ? 'sheet' : 'swatch'];
    A.thumbDraw(obj, ctx, px, px, v[0], 0xe9edf2, v[1] / 3);
    obj.geometry.dispose();
    request();
  };

  /* ---- photo mode ------------------------------------------------------------------------ */
  // o.w/o.h/o.samples override the tier defaults; o.side: render only that compare side; o.sync
  A.photo = function (o, onProgress) {
    o = o || {};
    var P = A.quality.photo, max = Math.min(renderer.capabilities.maxTextureSize, renderer.getContext().getParameter(renderer.getContext().MAX_RENDERBUFFER_SIZE));
    var w = Math.min(o.w || P.w, max), h = Math.round(w * 2 / 3), n = o.samples || P.n;
    var focus = controls.target.clone(), dist = camera.position.distanceTo(focus);
    var keepCmp = A.cmp.on, keepAct = A.cmp.active, lines = TK.tools && TK.tools.group;
    if (o.side !== undefined && keepCmp) { A.cmp.on = false; show(o.side); }
    if (lines) lines.visible = false;
    A.fastFrame = false; render();              // shadow maps of both sides are current before the samples are taken
    A.frozen = true;
    function restore(c) {
      A.cmp.on = keepCmp; show(keepAct);
      if (lines) lines.visible = true;
      A.frozen = false; shadowDirty = true; A.invalidate();
      return stamp(c, o);
    }
    var job = TK.fx.photo({
      w: w, h: h, samples: n, camera: camera, focus: focus, aperture: o.aperture === undefined ? dist * 0.0026 : o.aperture, sync: o.sync, bar: o.bar,
      split: A.cmp.on ? A.cmp.split : 0, bg: A.backdrop(o.bgTheme), transparent: !!o.transparent,
      draw: function (cam, rt) { drawMain(cam, rt, A.cmp.split, false); },
      ao: TK.fx.aoOn ? function (cam, pw, ph) { return aoPass(cam, pw, ph, A.cmp.split); } : null
    }, onProgress);
    return o.sync ? restore(job) : job.then(restore, function (e) { restore(document.createElement('canvas')); throw e; });
  };
  // the page's studio backdrop as linear colours [top, bottom]: --hero-wall-1 and --hero-floor-2 of the theme
  A.backdrop = function (theme) {
    theme = theme || A.theme();
    var cs = getComputedStyle(document.documentElement), t, b;
    if (theme === A.theme()) { t = cs.getPropertyValue('--hero-wall-1').trim(); b = cs.getPropertyValue('--hero-floor-2').trim(); }
    if (!t || !b) { t = theme === 'dark' ? '#1B212B' : '#E4E8EC'; b = theme === 'dark' ? '#161B23' : '#E9ECEF'; }
    return [new THREE.Color(t), new THREE.Color(b)];
  };
  // watermark and configuration code in the letterbox bar
  function stamp(c, o) {
    if (o.bar === 0 || !c.width) return c;
    var ctx = c.getContext('2d'), w = c.width, h = c.height, bar = Math.round(h * 0.045), y = h - bar / 2, f = bar * 0.42;
    ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';
    ctx.font = '800 ' + (f * 1.15).toFixed(0) + 'px Archivo, Arial, sans-serif';
    ctx.textAlign = 'left'; ctx.fillText('TRICOM', bar * 0.9, y);
    var tw = ctx.measureText('TRICOM').width;
    ctx.font = '500 ' + (f * 0.82).toFixed(0) + 'px "IBM Plex Mono", Consolas, monospace'; ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.fillText(TK.t('k.app.stamp'), bar * 0.9 + tw + bar * 0.6, y);
    ctx.textAlign = 'right'; ctx.fillStyle = '#ffffff';
    var code = A.cmp.on && o.side === undefined ? A.code(A.states[0]) + '  |  ' + A.code(A.states[1]) : A.code(o.side !== undefined && A.states[o.side] ? A.states[o.side] : A.state);
    ctx.fillText(code, w - bar * 0.9, y);
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.72)';
    var s = o.side !== undefined && A.states[o.side] ? A.states[o.side] : A.state;
    ctx.fillText(D.find(D.houses, s.kuca).name + ' · ' + D.find(D.profiles, s.krov).name + ' · ' + TK.mat.finishLabel(A.roofSpec(s)), bar * 0.9, bar / 2);
    return c;
  }
  A.photoDownload = function (onProgress) {
    return A.photo({}, onProgress).then(function (c) {
      return new Promise(function (res) {
        c.toBlob(function (blob) {
          var ctx = c.getContext('2d'), d = ctx.getImageData(0, Math.round(c.height * 0.3), c.width, 1).data, mn = 255, mx = 0;
          for (var i = 0; i < d.length; i += 16) { mn = Math.min(mn, d[i]); mx = Math.max(mx, d[i]); }
          var name = TK.t('k.app.photoFile') + A.code().toLowerCase() + '.png', a = document.createElement('a'), url = URL.createObjectURL(blob);
          a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          A.lastPhoto = { w: c.width, h: c.height, bytes: blob.size, range: mx - mn, name: name };
          res(A.lastPhoto);
        }, 'image/png');
      });
    });
  };

  /* ---- screenshot / share / quote ---------------------------------------------- */
  A.screenshot = function () {
    if (A.noGL) return A.stillUrl();
    A.fastFrame = false; render();
    // the studio canvas is transparent: put it on the light backdrop first
    var c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
    var x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, '#E4E8EC'); g.addColorStop(1, '#E9ECEF'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(canvas, 0, 0);
    return c.toDataURL('image/jpeg', 0.9);
  };
  // pre-rendered picture of the object type (no WebGL)
  // the picture of the object type (#kStill): in the HTML it is the default type (dvovodni, srcset) and
  // shows while the scene is prepared (body.k-booting) and without 3D; another type replaces it here
  A.poster = function () {
    var im = document.getElementById('kStill'); if (!im) return;
    var want = A.state.kuca;
    if ((im.dataset.kuca || 'dvovodni') === want && (im.dataset.kuca || im.hasAttribute('srcset'))) return;
    im.removeAttribute('srcset'); im.src = A.stillUrl(); im.dataset.kuca = want;
  };
  // weak device (same rules as MetalEnv.tier() 'low', without reduced motion) or ?tier=low
  function weakDevice() {
    if (params.get('tier') === 'low') return true;
    if (params.get('tier')) return false;
    var hc = navigator.hardwareConcurrency || 8, mob = window.MetalEnv && MetalEnv.mobile ? MetalEnv.mobile() : A.mobile;
    return hc <= 2 || (mob && hc <= 4) || !!(window.MetalEnv && MetalEnv.hasGL && !MetalEnv.hasGL());
  }
  // low tier started with the picture: open the same configuration in 3D (it is all in the address)
  A.go3D = function () { var u = new URL(location.href); u.searchParams.set('gl', '1'); location.replace(u.href); };
  // (WebP; 720 px on a phone — the stage is narrow there; PNG sources stay in assets/konfigurator/)
  A.stillUrl = function (s) { return TK.root() + 'assets/konfigurator/' + (s || A.state).kuca + (A.mobile ? '-720w' : '') + '.webp' + VER; };      // ../ on /en/ pages
  // picture for the PDF: a small photo-mode frame (no letterbox); falls back to the canvas
  A.printShot = function (side) {
    if (A.noGL) return A.stillUrl();
    try { return A.photo({ w: Math.min(1620, A.quality.photo.w), samples: A.mobile ? 4 : 8, sync: true, bar: 0, side: side, bgTheme: 'light' }).toDataURL('image/jpeg', 0.9); }
    catch (e) { return A.screenshot(); }
  };
  // specification of one side (cached until the next change)
  A.spec = function (i) {
    i = i === undefined ? A.cmp.active : i;
    var key = A.hashStamp + '|' + i + '|' + A.houses[i].qty.area;
    if (A.specCache && A.specCache.key === key) return A.specCache.sp;
    var sp = TK.spec.compute(A.states[i], A.houses[i]);
    A.specCache = { key: key, sp: sp };
    return sp;
  };
  // a configuration from its token alone (inquiry list): built as geometry, measured, thrown away
  A.specFor = function (token) {
    var st = parseOne(token), h = TK.house.build(st, { mats: TK.mat.sets[0], screwLod: 4 }), sp = TK.spec.compute(st, h);
    h.dispose();
    return sp;
  };
  A.parseOne = parseOne;
  A.token = function (s) { return A.serialize(s || A.state); };
  A.urlFor = function (token) { return A.base() + '#' + token; };
  function fmt(n, dec) { return TK.n(n, dec === undefined ? 1 : dec); }
  A.fmt = fmt;
  A.quantities = function (s, house) {            // flat list of the specification (kept for scripts that read it)
    var sp = TK.spec.compute(s || A.state, house || A.house), out = [];
    sp.planes.forEach(function (p) { out.push([p.name + ' (' + p.side + ')', TK.t('k.bom.sheets', { n: p.n, l: p.lens, o: fmt(p.order) })]); });
    sp.drains.forEach(function (d) { out.push([TK.t('k.q.gutter', { name: d.name }), TK.t('k.q.drain', { l: fmt(d.len, 2), p: d.pipes.length })]); });
    sp.flash.forEach(function (f) { out.push([f.label, f.qty]); });
    return out;
  };
  A.summary = function (s, house) { return TK.spec.compute(s || A.state, house || A.house).summary; };
  // items: [{ token, name? }] — default: the current configuration (both sides in compare mode)
  A.quoteItems = function () {
    var out = [], i;
    for (i = 0; i < (A.cmp.on ? 2 : 1); i++) out.push({ token: A.serialize(A.states[i]), spec: A.spec(i), name: A.cmp.on ? TK.t('k.ui.variant', { v: i ? 'B' : 'A' }) : '' });
    return out;
  };
  // calculator items ({ kind: 'calc', calc: <list item> }, js/calc-ui.js) are described by TricomCalcUI, never parsed as tokens
  A.quoteText = function (items) {
    items = items || A.quoteItems();
    var CU = window.TricomCalcUI, calc = items.filter(function (it) { return it.kind === 'calc'; });
    var konf = items.filter(function (it) { return it.kind !== 'calc'; }).map(function (it) { return { name: it.name, url: A.urlFor(it.token), spec: it.spec || A.specFor(it.token), token: it.token }; });
    // a saved / shared variant whose colour its profile no longer offers (TR 10): flagged for sales, never changed
    var flags = konf.map(function (k, i) { var f = A.colourIssueText(k.token); return f ? (konf.length > 1 ? TK.t('calc.tx.item', { n: i + 1 }) : '') + f : ''; }).filter(Boolean).join('\n');
    var fl = flags ? flags.length + 2 : 0, txt;
    if (!calc.length) txt = TK.spec.message(konf, 2000 - fl).text;
    else if (!konf.length) return CU ? CU.listText(calc.map(function (it) { return it.calc; })) : calc.map(function (it) { return it.name; }).join('\n');
    else {
      var cpart = calc.map(function (it, i) { return TK.t('calc.tx.item', { n: konf.length + i + 1 }) + (CU ? CU.itemText(it.calc) : it.name); }).join('\n\n');
      txt = TK.spec.message(konf, Math.max(600, 2000 - cpart.length - 2 - fl)).text + '\n\n' + cpart;
    }
    if (flags) txt += '\n\n' + flags;
    return txt.length > 2000 ? txt.slice(0, 1999) : txt;
  };
  /* profiles with a restricted RAL choice (D.profileRal): roof sheet (plastificirani) and hall wall cladding.
     s = state or token; returns [{ ral, name }] for every colour the profile no longer offers */
  A.colourIssues = function (s) {
    if (typeof s === 'string') { try { s = parseOne(s); } catch (e) { return []; } }
    s = s || A.state;
    var out = [], R = D.profileRal || {};
    function chk(prof, ral) { var a = R[prof]; if (a && ral && a.indexOf(String(ral)) < 0) out.push({ ral: ral, name: (D.find(D.profiles, prof) || {}).name || prof }); }
    if (s.mat === 'plast') chk(s.krov, s.boja);
    if (s.kuca === 'hala' && +s.hzid) chk(s.hzp, s.hzb);
    return out;
  };
  A.colourIssueText = function (s) { return A.colourIssues(s).map(function (x) { return TK.t('calc.list.obsolete', x); }).join('; '); };
  // prefill contract with kontakt.html#upit: konfig = readable specification (message field), konfiguracija = state token(s)
  // (en/configurator.html → contact.html, same parameters, English text)
  A.quoteUrl = function (items) {
    items = items || A.quoteItems();
    var CU = window.TricomCalcUI;
    var refs = items.map(function (it) { return it.kind === 'calc' ? (it.calc && it.calc.hash ? 'calc:' + it.calc.hash : '') : it.token; }).filter(Boolean);
    // napomena za proizvodnju stavki kalkulatora: skriveno polje (pn), ne tekst poruke
    var notes = CU && CU.itemNote ? items.map(function (it, i) { var n = it.kind === 'calc' ? CU.itemNote(it.calc) : ''; return n ? TK.t('calc.tx.item', { n: i + 1 }) + TK.t('calc.tx.note', { x: n }) : ''; }).filter(Boolean) : [];
    return TK.page('kontakt.html') + '?konfig=' + encodeURIComponent(A.quoteText(items)) + '&konfiguracija=' + encodeURIComponent(refs.join('\n'))
      + (notes.length ? '&pn=' + encodeURIComponent(notes.join('\n')) : '') + '#upit';
  };

  /* ---- inquiry list: several variants kept in this browser and sent together -------------- */
  var LIST_KEY = 'tricom-upit-lista';
  A.list = {
    get: function () { try { var v = JSON.parse(localStorage.getItem(LIST_KEY) || '[]'); return Array.isArray(v) ? v.filter(function (x) { return x && (x.token || (x.kind === 'calc' && x.hash)); }) : []; } catch (e) { return []; } },
    save: function (l) { try { localStorage.setItem(LIST_KEY, JSON.stringify(l)); return true; } catch (e) { return false; } },
    add: function () {
      var l = A.list.get(), tok = A.serialize(A.state), sp = A.spec(), d = new Date(), bad = A.colourIssues(A.state);
      if (bad.length) return { bad: bad, list: l };          // colour no longer offered for the profile: choose again first
      if (l.some(function (x) { return x.token === tok; })) return { dup: true, list: l };
      var name = D.find(D.houses, A.state.kuca).name + ' · ' + sp.profile.name + ' · ' + TK.mat.finishLabel(TK.mat.roofSpec(A.state)).replace(TK.t('k.app.plastPrefix'), '');
      l.push({ id: sp.code + '-' + d.getTime().toString(36), name: name, token: tok, code: sp.code, date: d.toISOString().slice(0, 10), lang: TK.en ? 'en' : 'sr' });
      return { ok: A.list.save(l), list: l };
    },
    remove: function (id) { var l = A.list.get().filter(function (x) { return x.id !== id; }); A.list.save(l); return l; },
    clear: function () { A.list.save([]); },
    items: function () { return A.list.get().map(function (x) { return x.kind === 'calc' ? { kind: 'calc', calc: x, name: A.list.label(x) } : { token: x.token, name: A.list.label(x) }; }); },
    // the stored name is in the language of the page that added it (the list is shared by konfigurator.html and
    // en/configurator.html): an item added on the other language's page is renamed from its token
    label: function (x) {
      if (x.kind === 'calc') return window.TricomCalcUI ? window.TricomCalcUI.itemLabel(x) : x.name;
      var f = A.colourIssueText(x.token), b;   // saved item with a colour no longer offered: shown as is, flagged
      if ((x.lang || 'sr') === (TK.en ? 'en' : 'sr')) b = x.name;
      else { try { var st = parseOne(x.token); b = D.find(D.houses, st.kuca).name + ' · ' + D.find(D.profiles, st.krov).name + ' · ' + TK.mat.finishLabel(TK.mat.roofSpec(st)).replace(TK.t('k.app.plastPrefix'), ''); } catch (e) { b = x.name; } }
      return f ? b + ' — ' + f : b;
    }
  };

  /* ---- test / diagnostics hooks -------------------------------------------------- */
  A.signature = function () {
    // stable across page loads: textures are identified by size, repeat, rotation and one sampled pixel
    function tid(t) {
      if (!t) return '-';
      var im = t.image, px = '';
      try { px = Array.prototype.join.call(im.getContext('2d').getImageData(17, 23, 1, 1).data, '.'); } catch (e) { px = '?'; }
      return im.width + 'x' + im.height + '@' + t.repeat.x.toFixed(2) + 'r' + t.rotation.toFixed(1) + ':' + px;
    }
    var S = A.mats, m = function (x) { return [x.color.getHexString(), +x.metalness.toFixed(2), +x.roughness.toFixed(2), tid(x.map), tid(x.normalMap), +(x.clearcoat || 0).toFixed(2)].join('/'); };
    var pos = 0, sum = 0;
    A.house.group.traverse(function (o) {
      if (!o.geometry || o.parent !== A.house.group) return;       // weather kits are not part of the configuration
      var p = o.geometry.attributes.position, a = p.array, n = o.count || 1;
      pos += p.count * n;
      for (var i = 0; i < a.length; i += 7) sum += Math.abs(a[i]) * (1 + (i % 3));      // cheap checksum of the built geometry
      if (o.isInstancedMesh) for (var k = 0; k < o.instanceMatrix.array.length; k += 5) sum += Math.abs(o.instanceMatrix.array[k]);
    });
    return { verts: pos, geo: Math.round(sum * 100), tris: Math.round(A.house.stats.tris), roof: m(S.roof), gutter: m(S.gutter), walls: S.wall.map(m), frame: m(S.frame),
      glass: +TK.mat.glass.opacity.toFixed(2), sun: TK.env.sunLight().position.toArray().map(function (v) { return +v.toFixed(1); }), env: A.state.okolina, qty: JSON.stringify(A.house.qty) };
  };
  A.info = function () { return { calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geos: renderer.info.memory.geometries, tex: renderer.info.memory.textures, programs: renderer.info.programs.length, pr: renderer.getPixelRatio(), shadow: A.quality.shadow, mobile: A.mobile, ao: TK.fx.aoOn }; };
  A.bench = function (n, still) {                // synchronous: orbit a little and time full frames at the target pixel ratio
    setPR(dyn.base); A.fastFrame = !still;
    var gl = renderer.getContext(), px = new Uint8Array(4), calls = 0, tris = 0, t0 = performance.now();
    renderer.info.autoReset = false;
    for (var i = 0; i < n; i++) {
      camera.position.applyAxisAngle(new V3(0, 1, 0), 0.01); camera.lookAt(controls.target);
      A.time += 0.016; TK.mat.U.uTime.value = A.time; TK.env.tick(0.016, A.time, camera); TK.weather.tick(0.016, camera, controls.target);
      renderer.info.reset();
      render();
      calls = renderer.info.render.calls; tris = renderer.info.render.triangles;
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    }
    var ms = (performance.now() - t0) / n;
    renderer.info.autoReset = true;
    controls.update();
    return { ms: +ms.toFixed(2), fps: +(1000 / ms).toFixed(1), calls: calls, tris: tris };
  };
  // frame-time sample: rAF deltas while the turntable runs, median and 95th percentile in ms
  A.frameSample = function (ms) {
    return new Promise(function (res) {
      var keep = controls.autoRotate;
      controls.autoRotate = true; A.sampling = []; request();
      setTimeout(function () {
        var t = A.sampling || []; A.sampling = null; controls.autoRotate = keep;
        var d = []; for (var i = 1; i < t.length; i++) d.push(t[i] - t[i - 1]);
        d.sort(function (a, b) { return a - b; });
        res({ n: d.length, median: d.length ? +d[d.length >> 1].toFixed(2) : 0, p95: d.length ? +d[Math.min(d.length - 1, Math.floor(d.length * 0.95))].toFixed(2) : 0, tier: A.tier, pr: dyn.pr });
      }, ms);
    });
  };
  A.probe = function (ms) {
    return new Promise(function (res) {
      var f0 = 0, t0 = 0, keep = controls.autoRotate;
      controls.autoRotate = true; request();
      setTimeout(function () { f0 = A.frames; t0 = performance.now(); }, 1500);          // let the resolution settle first
      setTimeout(function () {
        var fps = (A.frames - f0) / ((performance.now() - t0) / 1000);
        controls.autoRotate = keep;
        res({ fps: +fps.toFixed(1), pr: dyn.pr, base: dyn.base, ao: !(dyn.ema > 21 && dyn.pr <= dyn.base * 0.62) });
      }, 1500 + ms);
    });
  };
  // free camera placement (used by the automated screenshots)
  A.look = function (t, dir, r) {
    tween = null; controls.autoRotate = false;
    var v = camFor({ t: new V3(t[0], t[1], t[2]), dir: new V3(dir[0], dir[1], dir[2]), r: r });
    camera.position.copy(v.pos); controls.target.copy(v.target); applyOffset(); controls.update(); A.invalidate();
  };
  A.busy = function () { return !!tween; };
  A.three = function () { return { renderer: renderer, scene: scene, camera: camera, controls: controls }; };
  A.memory = function () { return renderer ? { geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures } : null; };

  /* ---- boot ---------------------------------------------------------------------- */
  function progress(p, label) { if (TK.ui) TK.ui.progress(p, label); }
  // each boot step is guarded: after a lost context the chain stops; a step that fails because the GPU
  // is gone (WebKit GPU process reset: 2D canvases fail too) ends in the picture, any other error is a bug
  // and is rethrown
  function later(fn) { setTimeout(function () { if (A.lost || A.released) return; try { fn(); } catch (e) { bootFail(e); } }, 16); }
  function bootFail(e) {
    var gone = A.lost; try { gone = gone || !renderer || renderer.getContext().isContextLost(); } catch (x) { gone = true; }
    if (gone) { A.lost = true; lostToPoster(); return; }
    throw e;
  }
  // lost WebGL context: the loop stops, the picture of the object type replaces the scene and every step
  // keeps working; while the scene is still being built the same configuration opens as the picture
  // version (?gl=0). webglcontextrestored reloads — the configuration is all in the address.
  function lostToPoster() {
    if (A.released) return;
    if (!A.ready || !TK.ui || !document.getElementById('kRail').children.length) {
      var u = new URL(location.href); u.searchParams.set('gl', '0'); location.replace(u.href); return;
    }
    document.body.classList.add('k-nogl'); document.body.classList.remove('k-booting');
    A.poster();
    var im = document.getElementById('kStill'), note = document.getElementById('kNoGL');
    if (im) im.hidden = false;
    if (note) { note.innerHTML = '<p class="label">' + TK.t('k.nogl.lost') + '</p><p>' + TK.t('k.nogl.lostText') + '</p>'; note.hidden = false; }
  }
  // fn runs once every shader program of the scene is linked; ordinary frames wait meanwhile (render())
  var warmQ = [];
  function warmed(fn) {
    if (!window.MetalEnv || !MetalEnv.warm) return fn();
    warmQ.push(fn); A.warming = (A.warming || 0) + 1;
    MetalEnv.warm(renderer, scene, camera, function () {
      if (--A.warming) return;
      var q = warmQ; warmQ = [];
      if (A.lost || A.released) return;
      try { q.forEach(function (f) { f(); }); } catch (e) { bootFail(e); }
    }, canvas.width && TK.fx.frame ? TK.fx.frame(canvas.width, canvas.height, false) : null);   // the frame draws into this target
  }

  A.init = function () {
    var t0 = performance.now();
    canvas = document.getElementById('kCanvas'); stage = document.getElementById('kStage');
    // low tier: picture + steps first, 3D on request (?gl=1 forces 3D, ?gl=0 forces the picture)
    // (the device decides, not prefers-reduced-motion — that only lowers the 3D quality tier)
    if (params.get('gl') !== '1' && weakDevice()) { initNoGL(window.MetalEnv && MetalEnv.hasGL && !MetalEnv.hasGL() ? 'nogl' : 'low'); return; }
    // probe first: creating a renderer on a browser without WebGL only fills the console with errors
    var probe = document.createElement('canvas'), gl0 = null;
    try { gl0 = params.get('gl') === '0' ? null : (probe.getContext('webgl2') || probe.getContext('webgl')); } catch (e) { gl0 = null; }
    if (!gl0) { initNoGL(); return; }
    // probni kontekst se odmah oslobađa, osim u Firefox-u (Gecko) gde loseContext() ostavlja upozorenje
    if (!/\bGecko\/\d/.test(navigator.userAgent)) { var lose = gl0.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); }
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { renderer = null; }
    if (!renderer || !renderer.getContext()) { initNoGL(); return; }
    dyn.base = dyn.pr = Math.min(window.devicePixelRatio || 1, A.quality.pr);
    renderer.setPixelRatio(dyn.base);
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    TK.geo.res.set(stage.clientWidth, stage.clientHeight);
    if (window.MetalEnv) window.MetalEnv.setup(renderer, A.theme(), TIER);      // sRGB out, ACES, physical lights, PCFSoft
    else { renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.physicallyCorrectLights = true; }
    renderer.toneMappingExposure = 1.0;          // the time of day sets the exposure (k-env.js)
    renderer.shadowMap.enabled = A.quality.shadow > 0;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;       // the scene is static between changes
    renderer.debug.checkShaderErrors = params.get('debug') === '1';      // the status queries cost time on every program
    TK.tex.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(A.mobile ? 44 : 40, stage.clientWidth / stage.clientHeight, 0.25, 4500);
    camera.layers.enable(1);                     // layer 1: everything the occlusion pre-pass must skip
    camera.position.set(-14, 7, 20);
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.09;
    controls.maxPolarAngle = 1.52; controls.minDistance = 1.3; controls.autoRotateSpeed = 0.42;
    controls.zoomSpeed = 0.8; controls.rotateSpeed = 0.7;
    controls.addEventListener('change', function () {
      var t = controls.target, d = A.house ? A.house.dims : null;
      if (d) { t.x = Math.max(-d.L, Math.min(d.L, t.x)); t.z = Math.max(-d.W, Math.min(d.W, t.z)); t.y = Math.max(0.3, Math.min(d.top + 1.5, t.y)); }
      if (camera.position.y < 0.3) camera.position.y = 0.3;
    });
    ['pointerdown', 'pointermove', 'wheel', 'touchstart', 'touchmove', 'keydown'].forEach(function (ev) {
      canvas.addEventListener(ev, function () { lastMove = performance.now(); if (ev !== 'pointermove' && TK.tools) TK.tools.stopIdle(); request(); }, { passive: true });
    });
    document.addEventListener('pointerdown', function () { if (TK.tools) TK.tools.stopIdle(); }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) A.invalidate(); else if (ambT) { clearTimeout(ambT); ambT = 0; } });
    // nothing is drawn while the canvas is out of view (print layout, a covering sheet)
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { A.offscreen = !en[0].isIntersecting; if (!A.offscreen && A.house) A.invalidate(); }).observe(canvas);
    // leaving the page: stop drawing and hand the GPU memory and the context back at once (no unload
    // listener, so the back/forward cache keeps working); restored from that cache the page reloads,
    // the configuration is in the address
    window.addEventListener('pagehide', function () {
      A.released = true; A.offscreen = true;
      if (ambT) { clearTimeout(ambT); ambT = 0; }
      // after a restored context the old objects are not the new context's: no deletes (WebKit INVALID_OPERATION)
      if (window.MetalEnv && MetalEnv.release && !A.restored) MetalEnv.release(renderer, scene);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted && A.released) location.reload(); });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); if (A.released || A.lost) return; A.lost = true; lostToPoster(); }, false);
    canvas.addEventListener('webglcontextrestored', function () { if (!A.released && A.lost) { A.restored = true; location.reload(); } }, false);
    window.addEventListener('tricom:theme', function (e) { if (!A.ready) return; TK.env.theme(e.detail && e.detail.theme || A.theme()); A.invalidate(); if (TK.ui) TK.ui.refresh('theme'); });

    var parsed = A.parse(location.hash);
    A.states[0] = parsed.states[0]; activate(0);
    A.poster();
    A.deepStep = deepStep(location.hash);
    A.present = /(^|[#&])present=1(&|$)/.test(location.hash);
    if (A.present) document.body.classList.add('k-present');
    progress(0.12, TK.t('k.app.load1'));
    var tm = A.timing = {}, mark = function (k) { tm[k] = Math.round(performance.now() - t0); };
    mark('renderer');
    later(function () {
      TK.mat.init(); A.mats = TK.mat.sets[0]; mark('textures');
      progress(0.45, TK.t('k.app.load2'));
      later(function () {
        TK.env.init(renderer, scene, A.quality);
        TK.env.theme(A.theme());
        TK.fx.init(renderer, A.quality);
        TK.weather.init(scene, A.quality, reduce);
        TK.tools.init({ renderer: renderer, scene: scene, camera: camera, controls: controls, stage: stage, canvas: canvas });
        mark('environment');
        progress(0.7, TK.t('k.app.load3'));
        later(function () {
          build(0); mark('house');
          TK.env.setKind(A.state.okolina);
          TK.env.setTime(A.state.sat, A.state.datum, { skyOnly: true }); mark('sky');
          applyMaterials(0);
          TK.ui.build(); mark('ui');
          A.fly('home', true);
          // each step draws only once the driver has linked its new shader programs (MetalEnv.warm),
          // so the main thread never waits on a link; until then the loader / previous frame stays up
          warmed(function () {
            render();
            mark('firstFrame');
            A.loadMs = Math.round(performance.now() - t0);
            progress(1);
            // The house is on screen. The rest follows in small steps under the fading loader, so the page
            // stays responsive: the plot, then neighbours / grass / clouds, then the environment capture.
            later(function () {
              TK.env.showYard();
              A.house.late.forEach(function (o) { o.visible = true; });
              warmed(function () {
                shadowDirty = true; render(); mark('yard');
                later(function () {
                  TK.env.buildExtras();
                  warmed(function () {
                    render(); mark('extras');
                    later(function () {
                      A.dressed = true;
                      TK.env.setTime(A.state.sat, A.state.datum);
                      if (parsed.states[1] || parsed.modes.kisa || parsed.modes.zima || parsed.modes.kote) A.load(location.hash); else writeHash();
                      if (A.deepStep) TK.ui.open(A.deepStep);
                      warmed(function () {
                        shadowDirty = true; render(); TK.env.rebake(); render();
                        mark('dressed');
                        A.ready = true;
                        TK.tools.start();
                        if (A.present) TK.tools.present(true);
                        A.invalidate();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    window.addEventListener('resize', function () {
      if (!stage.clientWidth || !stage.clientHeight) return;
      renderer.setSize(stage.clientWidth, stage.clientHeight, false);
      TK.geo.res.set(stage.clientWidth, stage.clientHeight);
      camera.aspect = stage.clientWidth / stage.clientHeight;
      applyOffset(); camera.updateProjectionMatrix();
      A.invalidate();
    });
    window.addEventListener('hashchange', function () {
      if (location.hash.replace(/^#/, '') !== A.hash()) A.load(location.hash);
    });
  };

  // a marketing link opens the step of the product it names
  function deepStep(hash) {
    if (!A.isShort(hash)) return 0;
    var q = new URLSearchParams(String(hash).replace(/^#/, ''));
    return q.has('g') || q.has('v') ? 3 : q.has('p') || q.has('m') || q.has('c') ? 2 : 1;
  }

  /* ---- without WebGL: geometry is still built (it is what the quantities are measured on), never drawn ---
     reason 'low': WebGL works, but on the low tier (weak phone) the page starts with the picture, the
     steps and the specification, and the 3D scene is one tap away (A.go3D) — compiling the shaders
     would otherwise freeze such a device for seconds on arrival. */
  function initNoGL(reason) {
    A.noGL = true; A.dressed = true; A.ambient = false; A.noGLReason = reason || 'nogl';
    document.body.classList.add('k-nogl');
    // nothing is drawn: the materials get empty textures instead of painted canvases (2–3 s less on a
    // phone); TK.tex.rng and the other helpers stay, the geometry depends on them
    var real = TK.tex, lite = {};
    Object.keys(real).forEach(function (k) { lite[k] = real[k]; });
    ['plaster', 'zinc', 'brushed', 'coat', 'lamperija', 'wood', 'curtain', 'concrete', 'gravel', 'aoStrip', 'streaks', 'splash', 'brick', 'copper', 'noise'].forEach(function (k) {
      if (typeof real[k] === 'function') lite[k] = function () { var t = new THREE.Texture(); t.map = new THREE.Texture(); t.normalMap = new THREE.Texture(); return t; };
    });
    TK.tex = lite;
    var parsed = A.parse(location.hash);
    A.states[0] = parsed.states[0]; activate(0);
    TK.mat.init(); A.mats = TK.mat.sets[0];
    build(0); applyMaterials(0);
    TK.ui.build();
    writeHash();
    A.ready = true;
    TK.ui.progress(1);
    TK.ui.open(deepStep(location.hash) || 1);
    window.addEventListener('hashchange', function () { if (location.hash.replace(/^#/, '') !== A.hash()) A.load(location.hash); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { A.init(); });
  else A.init();
})();
