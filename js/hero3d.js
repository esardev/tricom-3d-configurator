/* ==========================================================================
   TRICOM — hero3d.js
   3D objekti u hero-u (početna) i u zaglavljima podstranica.

   Hero početne (host sa data-bed, tri ekrana, isti sto i isti kadar):
     sheet     tabla TR 35/270 (pravi presek iz kataloga, vidljiva debljina,
               blaga talasavost po dužini); u tamnoj temi pocinkovana, u
               svetloj antracit RAL 7016. Ulaz: ulazi ravna sa desne strane,
               rebra se oblikuju sleva nadesno (vertex šejder) uz svetlosni
               trag na frontu, pa se crtaju kote.
     cutplate  čelična ploča 1250 × 800 × 8 mm: mat valjaonička kora sa
               oksidom i utisnutim brojem dela, svetle sveže isečene ivice,
               kapljice troske ispod. Ulaz: glava plazme obilazi konturu i
               svaku rupu redom, rez svetli plavo-belo, na početku svakog reza
               prsnu varnice, isečci padaju 4 mm i blede, glava odlazi.
     stack     paket od 12 tabli u RAL bojama iz kataloga (gornja pod
               zaštitnom folijom) na dva drvena podmetača, dve čelične trake sa
               kopčom. Ulaz: table sleću jedna po jedna (70 ms razmaka) i
               blago se slegnu, trake se stegnu poslednje, pri sletanju prašina.
     Dok je objekat aktivan: njihanje ±6°, studijski prelet svetla na svakih
     9 s (pomera se svetlo, ne tekstura), paralaksa i blag nagib ka
     pokazivaču. Promena ekrana (događaj „tricom:hero“) pretapa objekte
     600 ms, po ulasku novog ekrana ulazna animacija ide jednom; sistemi
     čestica se prave po ulasku i brišu po završetku.
   Zaglavlja podstranica: roof (TR 35/270 sa olukom), gutter, plate, coil.

   Renderer, studijsko okruženje (PMREM: softboks + dve trake + taman pod),
   materijali (cink sa cvetom, RAL sa lakom, ploča, rez čelika, drvo) i
   razred kvaliteta dolaze iz js/metal-env.js, zajedničkog sa
   konfiguratorom. Senke: jedno glavno svetlo sa PCFSoft mapom (2048 high /
   1024 medium) + kontaktna senka ispod stola. Razred low = statične slike
   (assets/hero/bed-<objekat>-<tema>.webp; PNG izvornici u _tools/render/out/hero-png/) sa kotama iz data-kote-still-*.
   Three.js i geometrija kataloga (k-data, k-geo) se učitavaju lenjo, kada
   objekat prvi put uđe u ekran.

   Probe: ?hero3d=on (uvek 3D), ?hero3d=off (uvek slika), ?hero3d=still
   (snimanje statičnih slika: window.tricomHero3D.capture()), ?tier=…
   ========================================================================== */
(function () {
  'use strict';

  var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-hero3d]'));
  if (!hosts.length) return;

  var ME = window.MetalEnv;
  var q = /[?&]hero3d=(on|off|still)/.exec(location.search);
  var mode = q ? q[1] : '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.innerWidth < 768;
  var tier = ME ? ME.tier() : 'low';
  if ((mode === 'on' || mode === 'still') && tier === 'low') tier = ME && ME.hasGL() ? 'medium' : 'low';
  var useGL = mode !== 'off' && tier !== 'low' && (mode === 'on' || mode === 'still' || !narrow) && !!(ME && ME.hasGL());
  var noAnim = reduce && mode !== 'still';           // smanjeno kretanje: odmah završni položaj, bez ulazne animacije
  // glass-dom.js ovo već upisuje pre prvog rasporeda; menja se samo ako se razlikuje
  document.documentElement.classList.toggle('h3d-static', !useGL);
  if (document.documentElement.getAttribute('data-h3d-tier') !== (useGL ? tier : 'low')) document.documentElement.setAttribute('data-h3d-tier', useGL ? tier : 'low');

  /* ---- kote: SVG preko platna -------------------------------------------------
     Svaka kota ima četiri tačke u pikselima hosta: ea / eb (gde pomoćne linije
     kreću od objekta) i a / b (krajevi kotne linije). Iste funkcije crtaju i
     kote uživo (projekcija 3D tačaka u svakom kadru) i kote preko statične
     slike (tačke snimljene sa slikom, preračunate za background-size:
     contain i poravnanje dole u sredini). Natpisi su iz data-kote. */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function koteLabels(raw) {
    var out = {};
    (raw || '').split(';').forEach(function (s) {
      var i = s.indexOf(':'); if (i > 0) out[s.slice(0, i).trim()] = s.slice(i + 1).trim();
    });
    return out;
  }
  // Kote jednog objekta: natpisi u data-kote-<objekat>, tačke sa statične slike u
  // data-kote-still-<objekat>, napomena ispod prvog natpisa u data-kote-note-<objekat>
  // („Mere modela“). Host sa jednim objektom može da koristi i data-kote / data-kote-still.
  var KOTE_AT = 500;          // prvo crtanje kota: 500 ms posle učitavanja (redosled ulaza hero-a)
  function Kote(host, name) {
    var one = host.getAttribute('data-hero3d').split(/\s+/).length === 1;
    var attr = function (a) { return host.getAttribute(a + '-' + name) || (one ? host.getAttribute(a) : null); };
    this.host = host;
    this.name = name;
    this.labels = koteLabels(attr('data-kote'));
    this.stillRaw = attr('data-kote-still');
    this.empty = !Object.keys(this.labels).length;
    if (this.empty) return;
    var note = attr('data-kote-note');
    var svg = this.svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'h3d-kote');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    this.g = {};
    Object.keys(this.labels).forEach(function (k) {
      var g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'h3d-kote__k');
      ['ext', 'dim', 'tick'].forEach(function (c) {
        var p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('class', 'h3d-kote__' + c);
        p.setAttribute('pathLength', '1');
        g.appendChild(p);
      });
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('class', 'h3d-kote__t');
      t.textContent = this.labels[k];
      g.appendChild(t);
      if (note) {
        var nt = document.createElementNS(SVGNS, 'text');
        nt.setAttribute('class', 'h3d-kote__n');
        nt.textContent = note;
        g.appendChild(nt);
        note = null;
      }
      svg.appendChild(g);
      this.g[k] = g;
    }, this);
    host.appendChild(svg);
  }
  // sakrij odmah (promena ekrana); sledeće crtanje ih ponovo iscrtava od početka
  Kote.prototype.hide = function () {
    if (this.empty) return;
    this.on = false;
    this.active = false;
    clearTimeout(this.inT);
    this.svg.classList.remove('is-in');
    this.svg.classList.add('is-off');
  };
  Kote.prototype.draw = function (list) {
    var f = function (v) { return v.toFixed(1); };
    var rect = this.host.getBoundingClientRect();
    Object.keys(list).forEach(function (k) {
      var g = this.g[k], d = list[k];
      if (!g || !d) return;
      var ea = d[0], eb = d[1], a = d[2], b = d[3];
      var ux = b[0] - a[0], uy = b[1] - a[1], ul = Math.hypot(ux, uy) || 1;
      ux /= ul; uy /= ul;
      var ox = a[0] - ea[0], oy = a[1] - ea[1], ol = Math.hypot(ox, oy) || 1;
      ox /= ol; oy /= ol;
      var ov = 5, tk = 5, c = Math.SQRT1_2;
      var tx = (ux - uy) * c * tk, ty = (ux + uy) * c * tk;      // kosa crtica pod 45° na kotnu liniju
      var p = g.childNodes;
      p[0].setAttribute('d', 'M' + f(ea[0]) + ' ' + f(ea[1]) + 'L' + f(a[0] + ox * ov) + ' ' + f(a[1] + oy * ov) +
        'M' + f(eb[0]) + ' ' + f(eb[1]) + 'L' + f(b[0] + ox * ov) + ' ' + f(b[1] + oy * ov));
      p[1].setAttribute('d', 'M' + f(a[0]) + ' ' + f(a[1]) + 'L' + f(b[0]) + ' ' + f(b[1]));
      p[2].setAttribute('d', 'M' + f(a[0] - tx) + ' ' + f(a[1] - ty) + 'L' + f(a[0] + tx) + ' ' + f(a[1] + ty) +
        'M' + f(b[0] - tx) + ' ' + f(b[1] - ty) + 'L' + f(b[0] + tx) + ' ' + f(b[1] + ty));
      var mx = (a[0] + b[0]) / 2 + ox * 14, my = (a[1] + b[1]) / 2 + oy * 14;
      // natpis uz uspravnu kotu ide sa strane, uz vodoravnu ispod/iznad sredine
      var side = Math.abs(ox) > Math.abs(oy), anchor = side ? (ox > 0 ? 'start' : 'end') : 'middle';
      // natpis ostaje u vidnom polju i kada je host širi od ekrana (telefon)
      // na telefonu natpis ostaje desno od kolone dugmeta asistenta (dok, dole levo: 16 + 40 px)
      var tw = Math.max((p[3].textContent || '').length, p[4] ? (p[4].textContent || '').length : 0) * 8.4, vl = (window.innerWidth < 768 ? 66 : 8) - rect.left, vr = window.innerWidth - 8 - rect.left;
      var lo = anchor === 'start' ? vl : anchor === 'end' ? vl + tw : vl + tw / 2;
      var hi = anchor === 'start' ? vr - tw : anchor === 'end' ? vr : vr - tw / 2;
      if (hi > lo) mx = Math.max(lo, Math.min(hi, mx));
      p[3].setAttribute('x', f(mx)); p[3].setAttribute('y', f(my));
      p[3].setAttribute('text-anchor', anchor);
      if (p[4]) { p[4].setAttribute('x', f(mx)); p[4].setAttribute('y', f(my + 16)); p[4].setAttribute('text-anchor', anchor); }
    }, this);
    if (!this.on) {
      this.on = true;
      this.active = true;
      var s = this.svg;
      clearTimeout(this.inT);
      this.inT = setTimeout(function () {
        requestAnimationFrame(function () { s.classList.remove('is-off'); s.classList.add('is-in'); });
      }, Math.max(0, KOTE_AT - performance.now()));
    }
  };
  // tačke snimljene sa statičnom slikom: "1200x840;cover:x,y,x,y,x,y,x,y;rib:…" (0–1 u odnosu na sliku)
  Kote.prototype.still = function () {
    var raw = this.stillRaw;
    if (!raw || this.empty) return;
    var parts = raw.split(';'), wh = parts.shift().split('x'), iw = +wh[0], ih = +wh[1];
    var w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h || !iw || !ih) return;
    var s = Math.min(w / iw, h / ih), L = (w - iw * s) / 2, T = h - ih * s, list = {};
    parts.forEach(function (pt) {
      var i = pt.indexOf(':'), n = pt.slice(i + 1).split(',').map(Number), q2 = [];
      for (var j = 0; j < 8; j += 2) q2.push([L + n[j] * iw * s, T + n[j + 1] * ih * s]);
      list[pt.slice(0, i)] = q2;
    });
    this.draw(list);
  };
  var kotes = [];
  hosts.forEach(function (h) {
    var names = h.getAttribute('data-hero3d').split(/\s+/);
    var start = Math.max(0, Math.min(names.length - 1, parseInt(h.getAttribute('data-start') || '0', 10) || 0));
    h.__cur = start;
    h.__kote = {};
    names.forEach(function (n, i) {
      var k = new Kote(h, n);
      if (k.empty) return;
      h.__kote[n] = k;
      kotes.push(k);
      if (i === start) k.still(); else k.hide();
    });
  });
  if (kotes.length) {
    var reStill = function () { kotes.forEach(function (k) { if (!k.live && k.active) k.still(); }); };
    if ('ResizeObserver' in window) hosts.forEach(function (h) { new ResizeObserver(reStill).observe(h); });
    else window.addEventListener('resize', reStill);
  }
  // promena ekrana dok objekat nije živ (statična slika): stare kote nestaju odmah,
  // nove se crtaju posle prelaza. Živi prikaz to radi sam (Viewer.show).
  function koteSwap(h, i, wait) {
    var names = h.getAttribute('data-hero3d').split(/\s+/), K = h.__kote || {};
    h.__cur = i;
    Object.keys(K).forEach(function (n) { K[n].hide(); });
    clearTimeout(h.__kt);
    h.__kt = setTimeout(function () { var k = K[names[i]]; if (k && !h.__viewer) k.still(); }, wait);
  }
  hosts.forEach(function (h) {
    var band = h.closest('.hero, .pagehead') || h;
    band.addEventListener('tricom:hero', function (e) {
      if (h.__viewer) return;
      koteSwap(h, e.detail.index, reduce ? 0 : 600);
    });
  });

  if (!useGL) return;

  var base = ((document.currentScript && document.currentScript.src) || '').replace(/js\/hero3d\.js.*$/, '');

  function load(src, cb) {
    var s = document.createElement('script');
    s.src = base + src;
    s.onload = function () { cb(); };
    s.onerror = function () { cb(new Error(src)); };
    document.head.appendChild(s);
  }
  var waiting = null;
  function deps(cb) {
    if (window.THREE && window.TK && window.TK.geo && window.MetalEnv) return cb();
    if (waiting) return waiting.push(cb);
    waiting = [cb];
    var done = function (e) { var w = waiting; waiting = null; w.forEach(function (f) { f(e); }); };
    load('js/vendor/three.min.js?v=2026-10-26', function (e) {
      if (e) return done(e);
      load('js/catalog.js?v=2026-10-26', function (e1) {          // materials and profiles: the same catalog as the configurator
        if (e1) return done(e1);
        load('js/konfigurator/k-data.js?v=2026-10-26', function (e2) {
          if (e2) return done(e2);
          load('js/konfigurator/k-geo.js?v=2026-10-26', function (e3) {
            if (e3 || window.MetalEnv) return done(e3);
            load('js/metal-env.js?v=2026-10-26', done);
          });
        });
      });
    });
  }

  // Svaka scena prati temu strane (zaglavlja podstranica više nisu „uvek tamna“:
  // u svetloj temi stoje na svetloj podlozi, kao i hero početne).
  function theme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  // jedina kriva pokreta sajta: cubic-bezier(.2, .7, .2, 1)
  function ease(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var t = x;
    for (var i = 0; i < 8; i++) {
      var u = 1 - t, xt = 0.6 * u * u * t + 0.6 * u * t * t + t * t * t - x;
      var dx = 0.6 * u * u + 2.4 * t * t;
      t = Math.max(0, Math.min(1, t - xt / (dx || 1)));
    }
    var v = 1 - t;
    return 2.1 * v * v * t + 3 * v * t * t + t * t * t;
  }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  var SWAP_MS = 600;

  /* ---- shared resources (built once, after Three.js loads) ---------------- */
  var R = null;
  function shared() {
    if (R) return R;
    var T = THREE, X = ME.textures();
    R = { tex: X, mats: {} };
    // lim: pocinkovani i plastificirani (RAL 7016) iz zajedničke fabrike; obostrani zbog tankih ljuski
    R.mats.galv = ME.mat.galvanized({ side: T.DoubleSide });
    R.mats.ral = ME.mat.anthracite({ three: { side: T.DoubleSide } });
    R.mats.steel = new T.MeshStandardMaterial({ color: 0x6d7278, metalness: 0.9, roughness: 0.46, roughnessMap: X.brushed });
    R.mats.kerf = new T.MeshStandardMaterial({ color: 0x2c3138, metalness: 0.75, roughness: 0.62 });
    R.mats.coilEnd = new T.MeshStandardMaterial({ color: 0xc4c8cc, map: X.rings, metalness: 0.6, roughness: 0.45 });
    R.mats.strap = new T.MeshStandardMaterial({ color: 0x3a3d42, metalness: 0.7, roughness: 0.5 });
    R.mats.band = ME.mat.inox();
    R.mats.arc = new T.MeshBasicMaterial({ color: 0x5b9bff, toneMapped: false });
    R.mats.glow = new T.MeshBasicMaterial({ color: 0x5b9bff, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
    R.mats.spark = new T.MeshBasicMaterial({ color: 0xffae52, toneMapped: false });
    // postolje („Forged Glass“): ploča od tamnog dimljenog stakla — sjajna, delimično
    // providna (odraz objekta se vidi u njoj), ista u obe teme; brend sjaj ispod nje
    R.mats.bed = new T.MeshPhysicalMaterial({ color: 0x0c1118, metalness: 0.0, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.0, transparent: true, opacity: 0.66, depthWrite: true });
    R.tex.pool = (function () {
      var c = document.createElement('canvas'); c.width = c.height = 256;
      var x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 2, 128, 128, 128);
      g.addColorStop(0, 'rgba(170,200,255,1)'); g.addColorStop(.35, 'rgba(91,155,255,.45)'); g.addColorStop(1, 'rgba(91,155,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 256, 256);
      var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.ClampToEdgeWrapping; return t;
    })();
    R.mats.pool = new T.MeshBasicMaterial({ map: R.tex.pool, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
    // svetla gornja ivica stakla: 1 px linija po obodu
    R.mats.rim = new T.LineBasicMaterial({ color: 0xd6e2f2, transparent: true, opacity: 0.55, toneMapped: false });
    R.mats.edge = ME.mat.edge();
    R.mats.wood = ME.mat.wood();
    R.mats.torch = new T.MeshStandardMaterial({ color: 0x23262b, metalness: 0.8, roughness: 0.4 });
    R.mats.tip = new T.MeshBasicMaterial({ color: 0xdff0ff, toneMapped: false });
    R.mats.tipGlow = new T.SpriteMaterial({ map: X.blob, color: 0x8fc2ff, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
    return R;
  }
  // Objekti na stolu dobijaju sopstvene kopije materijala, da bi se pri promeni
  // ekrana pretapali (stari se gasi, novi pali) bez diranja zajedničkih materijala.
  // Šejder-materijali (rez, čestice) blede preko sopstvene uniforme (it.a).
  function own(o) {
    var map = new Map();
    o.traverse(function (m) {
      if (!m.isMesh && !m.isSprite) return;
      var f = function (x) {
        if (x.isShaderMaterial) return x;
        if (!map.has(x)) {
          var c = x.clone();
          c.userData.op0 = x.transparent ? x.opacity : 1;
          c.userData.src = x;
          c.transparent = true;
          if (Object.prototype.hasOwnProperty.call(x, 'onBeforeCompile')) { c.onBeforeCompile = x.onBeforeCompile; c.customProgramCacheKey = x.customProgramCacheKey; }
          map.set(x, c);
        }
        return map.get(x);
      };
      m.material = Array.isArray(m.material) ? m.material.map(f) : f(m.material);
      if (m.userData.swap) m.userData.swap = m.userData.swap.map(f);     // alternativni materijali po temi
    });
    return Array.from(map.values());
  }
  function fade(it, a) {
    it.a = a;
    it.mats.forEach(function (m) { m.opacity = m.userData.op0 * a; m.depthWrite = a > 0.5 && m.userData.src.depthWrite; });
    if (it.view.anim && it.view.anim.alpha) it.view.anim.alpha(a);
  }

  /* ---- postolje (hero početne): ploča od tamnog stakla, svetla ivica, sjaj ----
     Zaobljena ploča (radijus 8 % širine, debljina 4 cm) od dimljenog stakla:
     gornja strana je na y = 0, pa se odraz objekta (ogledalska kopija ispod
     y = 0) vidi kroz staklo. Ispod ploče: brend svetlosni krug (vidi se kroz
     staklo i kao oreol oko nje) i kontaktna senka. Mere dolaze iz kutije prvog
     objekta (tabla), koja se računa iz kataloga — bez građenja geometrije. */
  function bed(box) {
    var T = THREE, grp = new T.Group();
    var w = (box.max.x - box.min.x) * 1.18, d = (box.max.z - box.min.z) * 1.12, h = 0.04, rr = w * 0.08, bt = 0.0015;
    var cx = (box.max.x + box.min.x) / 2, cz = (box.max.z + box.min.z) / 2;
    var s = new T.Shape(), hw = w / 2 - bt, hd = d / 2 - bt;
    s.moveTo(-hw + rr, -hd); s.lineTo(hw - rr, -hd); s.quadraticCurveTo(hw, -hd, hw, -hd + rr);
    s.lineTo(hw, hd - rr); s.quadraticCurveTo(hw, hd, hw - rr, hd); s.lineTo(-hw + rr, hd);
    s.quadraticCurveTo(-hw, hd, -hw, hd - rr); s.lineTo(-hw, -hd + rr); s.quadraticCurveTo(-hw, -hd, -hw + rr, -hd);
    var geo = new T.ExtrudeGeometry(s, { depth: h - 2 * bt, bevelEnabled: true, bevelThickness: bt, bevelSize: bt, bevelSegments: 2, curveSegments: 10 });
    var slab = new T.Mesh(geo, R.mats.bed);
    slab.rotation.x = -Math.PI / 2;              // (x, y, z) → (x, z, −y): gornja strana na y = 0
    slab.position.set(cx, -(h - bt), cz);
    slab.receiveShadow = true;
    slab.renderOrder = -1;                       // posle odraza (renderOrder −2), pre objekta
    grp.add(slab);
    // svetla gornja ivica: 1 px linija po obodu ploče
    var pts = s.getPoints(10), rp = [];
    pts.forEach(function (p) { rp.push(p.x + cx, 0.0004, -p.y + cz); });
    var rg = new T.BufferGeometry();
    rg.setAttribute('position', new T.Float32BufferAttribute(rp, 3));
    grp.add(new T.LineLoop(rg, R.mats.rim));
    // brend sjaj ispod ploče + kontaktna senka (dodaju se posle kadriranja — ne ulaze u okvir)
    var pool = new T.Mesh(new T.PlaneGeometry(w * 1.3, d * 1.35), R.mats.pool);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(cx, -h - 0.0006, cz);
    pool.renderOrder = -3;
    var cs = ME.contactShadow(w * 1.45, d * 1.5, 0.6);
    cs.position.set(cx, -h - 0.0012, cz);
    cs.renderOrder = -4;
    grp.userData.pool = pool;
    grp.userData.shadow = cs;
    grp.userData.size = { w: w, d: d, cx: cx, cz: cz };
    return grp;
  }

  /* ---- reflection copy: same lighting, fades below the floor --------------
     Čuva šejder zakrpu izvornog materijala (oblikovanje table), pa odraz prati
     ulaznu animaciju. */
  var U = null;
  function reflMat(m) {
    if (m.__refl) return m.__refl;
    if (!U) U = { uFade: { value: 0.4 }, uRefl: { value: 0.3 } };
    var r = m.clone();
    var prev = Object.prototype.hasOwnProperty.call(m, 'onBeforeCompile') ? m.onBeforeCompile : null;
    var key = Object.prototype.hasOwnProperty.call(m, 'customProgramCacheKey') ? m.customProgramCacheKey() : 'std';
    r.transparent = true; r.depthWrite = false;
    r.onBeforeCompile = function (sh) {
      if (prev) prev(sh);
      sh.uniforms.uFade = U.uFade; sh.uniforms.uRefl = U.uRefl;
      sh.vertexShader = 'varying float vWY;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vWY = (modelMatrix * vec4(transformed, 1.0)).y;');
      sh.fragmentShader = 'uniform float uFade;\nuniform float uRefl;\nvarying float vWY;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n  gl_FragColor.a *= uRefl * smoothstep(-uFade, 0.0, vWY);');
    };
    r.customProgramCacheKey = function () { return 'h3d-refl-' + key; };
    m.__refl = r;
    return r;
  }
  // Odraz objekta na stolu od njegovih vlastitih (own) materijala: isti materijali
  // se gase i pale sa objektom pri promeni ekrana; ogledalska kopija ima istu
  // strukturu kao original (clone), pa se mreže uparuju po redosledu.
  var NOWRITE = { depthWrite: false };
  function syncRefl(it) {
    var a = [], b = [];
    it.piv.traverse(function (o) { if (o.isMesh) a.push(o); });
    it.rp.traverse(function (o) { if (o.isMesh) b.push(o); });
    b.forEach(function (m, i) {
      var src = a[i];
      if (!src) return;
      m.castShadow = false; m.receiveShadow = false;
      if (src.userData.noRefl) { m.visible = false; return; }
      var f = function (x) {
        var r = reflMat(x);
        if (it.refl.indexOf(r) < 0) {
          r.userData.op0 = x.userData.op0 != null ? x.userData.op0 : 1;
          r.userData.src = NOWRITE;
          it.refl.push(r); it.mats.push(r);
        }
        return r;
      };
      m.material = Array.isArray(src.material) ? src.material.map(f) : f(src.material);
    });
  }

  /* ---- geometry builders --------------------------------------------------- */
  // open polyline [[u, v]] swept along +z for length L, as a thin shell of thickness t.
  // form = true adds aFlat (y of the flat plate) and aX (0..1 across the width) for the forming shader.
  function shell(sec, L, t, form) {
    var T = THREE, n = sec.length, pos = [], idx = [], flat = [], ax = [];
    var xMin = Infinity, xMax = -Infinity;
    sec.forEach(function (p) { xMin = Math.min(xMin, p[0]); xMax = Math.max(xMax, p[0]); });
    var off = sec.map(function (p, i) {
      var a = sec[Math.max(0, i - 1)], b = sec[Math.min(n - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return [p[0] - dy / l * t, p[1] + dx / l * t];
    });
    function strip(arr, fy) {
      var o = pos.length / 3;
      arr.forEach(function (p) { pos.push(p[0], p[1], 0, p[0], p[1], L); flat.push(fy, fy); ax.push((p[0] - xMin) / (xMax - xMin), (p[0] - xMin) / (xMax - xMin)); });
      for (var i = 0; i < n - 1; i++) { var a = o + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    strip(sec, 0); strip(off, t);
    // end faces + long edges
    var o = pos.length / 3;
    for (var i = 0; i < n; i++) {
      pos.push(sec[i][0], sec[i][1], 0, off[i][0], off[i][1], 0, sec[i][0], sec[i][1], L, off[i][0], off[i][1], L);
      flat.push(0, t, 0, t);
      var fx = (sec[i][0] - xMin) / (xMax - xMin); ax.push(fx, fx, fx, fx);
    }
    for (i = 0; i < n - 1; i++) {
      var k = o + i * 4;
      idx.push(k, k + 4, k + 1, k + 1, k + 4, k + 5, k + 2, k + 3, k + 6, k + 3, k + 7, k + 6);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    // planar UVs (u along section length, v along the sweep) for the textures
    var uv = [], acc = [0];
    for (i = 1; i < n; i++) acc.push(acc[i - 1] + Math.hypot(sec[i][0] - sec[i - 1][0], sec[i][1] - sec[i - 1][1]));
    // u ide duž table (pravac valjanja), v preko preseka; 1 jedinica teksture ≈ 8 cm (cvet cinka 5–18 mm)
    var K = 12;
    for (var s2 = 0; s2 < 2; s2++) for (i = 0; i < n; i++) uv.push(0, acc[i] * K, L * K, acc[i] * K);
    for (i = 0; i < n; i++) uv.push(0, acc[i] * K, 0, acc[i] * K, L * K, acc[i] * K, L * K, acc[i] * K);
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    if (form) { g.setAttribute('aFlat', new T.Float32BufferAttribute(flat, 1)); g.setAttribute('aX', new T.Float32BufferAttribute(ax, 1)); }
    g.computeVertexNormals();
    return g;
  }

  function arcLine(group, a, b, r) {
    var T = THREE, d = new T.Vector3().subVectors(b, a), len = d.length();
    var core = new T.Mesh(new T.CylinderGeometry(r, r, len, 8, 1, true), R.mats.arc);
    var glow = new T.Mesh(new T.CylinderGeometry(r * 4, r * 4, len, 12, 1, true), R.mats.glow);
    [core, glow].forEach(function (m) {
      m.position.copy(a).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.clone().normalize());
      m.userData.noRefl = m === glow;
      group.add(m);
    });
    return core;
  }

  function gutterParts(group, length, opt) {
    var T = THREE, G = TK.geo, D = TK.data;
    var def = D.gutters[0], r = def.size / 2;
    var sec = G.gutterSection(def);
    var mat = opt.mat || R.mats.galv;
    var run = new T.Mesh(shell(sec, length, 0.0012), mat);
    group.add(run);
    // hooks (strap around the outside, tail toward the wall)
    var t = 0.004, hs = [[-0.06, 0.03], [-t, 0.016]];
    for (var i = 0; i <= 14; i++) { var a = Math.PI + i / 14 * Math.PI; hs.push([r + (r + t) * Math.cos(a), (r + t) * Math.sin(a)]); }
    hs.push([2 * r + t, 0.012], [2 * r - 0.008, 0.016]);
    (opt.hooks || []).forEach(function (z) {
      var hk = new T.Mesh(shell(hs, 0.026, 0.004), R.mats.steel);
      hk.position.z = z - 0.013;
      group.add(hk);
    });
    // end cap (čep)
    if (opt.cap) {
      var shp = new T.Shape();
      shp.moveTo(0, 0.014);
      for (i = 0; i <= 24; i++) { var b = Math.PI + i / 24 * Math.PI; shp.lineTo(r + r * Math.cos(b), r * Math.sin(b)); }
      shp.lineTo(2 * r + 0.012, 0.004); shp.lineTo(0, 0.014);
      var cap = new T.Mesh(new T.ExtrudeGeometry(shp, { depth: 0.006, bevelEnabled: false }), mat);
      cap.position.z = length;
      group.add(cap);
    }
    // the single light line along the front bead
    var bead = sec[sec.length - 4];
    arcLine(group, new T.Vector3(bead[0], bead[1] + 0.009, 0), new T.Vector3(bead[0], bead[1] + 0.009, length), 0.0014);
    return run;
  }

  /* ---- čestice: jedan Points sistem sa više prsaka (rođenje po tački) ----------
     o.bursts: [{ at: Vector3, t: s }], o.n po prsku, o.life s, o.color, o.size px na 1 m,
     o.speed [min, max], o.up (0..1 udeo nagore), o.grav Vector3. Deterministično:
     položaj je funkcija vremena, pa prsak uvek izgleda isto. */
  function burst(o) {
    var T = THREE, total = o.bursts.length * o.n, pos = new Float32Array(total * 3), vel = new Float32Array(total * 3), birth = new Float32Array(total), seed = new Float32Array(total);
    var s = 11, rnd = function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }, i = 0;
    o.bursts.forEach(function (b) {
      for (var k = 0; k < o.n; k++, i++) {
        pos[i * 3] = b.at.x; pos[i * 3 + 1] = b.at.y; pos[i * 3 + 2] = b.at.z;
        var an = rnd() * Math.PI * 2, el = Math.acos(1 - rnd() * (1 - (o.up || 0.5))), sp = o.speed[0] + rnd() * (o.speed[1] - o.speed[0]);
        var hx = Math.cos(an) * Math.sin(el), hz = Math.sin(an) * Math.sin(el), hy = Math.cos(el);
        if (o.flat) { hy *= 0.25; }
        vel[i * 3] = hx * sp; vel[i * 3 + 1] = hy * sp; vel[i * 3 + 2] = hz * sp;
        birth[i] = b.t + rnd() * (o.jitter || 0); seed[i] = rnd();
      }
    });
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('aVel', new T.BufferAttribute(vel, 3));
    g.setAttribute('aBirth', new T.BufferAttribute(birth, 1));
    g.setAttribute('aSeed', new T.BufferAttribute(seed, 1));
    var m = new T.ShaderMaterial({
      uniforms: { uT: { value: -1 }, uLife: { value: o.life }, uGrav: { value: o.grav || new T.Vector3(0, -2.6, 0) }, uSize: { value: (o.size || 9) * (window.devicePixelRatio || 1) }, uColor: { value: new T.Color(o.color) }, uA: { value: 1 } },
      vertexShader: [
        'attribute vec3 aVel; attribute float aBirth; attribute float aSeed; uniform float uT; uniform float uLife; uniform vec3 uGrav; uniform float uSize; varying float vA;',
        'void main(){ float age = uT - aBirth; float k = age / uLife;',
        '  vec3 p = position + aVel * age + 0.5 * uGrav * age * age;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;',
        '  if (age < 0.0 || k > 1.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);',
        '  gl_PointSize = uSize * (0.6 + 0.8 * aSeed) * (1.0 - 0.55 * k) / max(0.2, -mv.z);',
        '  vA = (1.0 - k) * (1.0 - k); }'].join('\n'),
      fragmentShader: 'uniform vec3 uColor; uniform float uA; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.25, d) * vA * uA; gl_FragColor = vec4(uColor * (0.5 + 1.8 * vA), a); }',
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false
    });
    var pts = new T.Points(g, m);
    pts.frustumCulled = false;
    pts.renderOrder = 5;
    return { mesh: pts, set: function (t) { m.uniforms.uT.value = t; }, alpha: function (a) { m.uniforms.uA.value = a; },
      dispose: function () { if (pts.parent) pts.parent.remove(pts); g.dispose(); m.dispose(); } };
  }

  // Kote na stolu stoje van ploče stola (sto prati tablu TR 35/270: ±0,70 m po širini,
  // +0,84 m napred), da se čitaju i u svetloj temi, gde su tamne.
  var KX = 0.78, KZ = 0.92;
  var RAL = { '7016': '#383E42', '3009': '#6D342D', '7024': '#45494E', '9010': '#F1ECE1', '8004': '#8D4931' };
  var BUILD = {
    /* tabla TR 35/270 u punoj širini (rebro do rebra + preklopno rebro), položena.
       Ulaz: ravna ploča dolazi sa desne strane, rebra se oblikuju sleva nadesno. */
    sheet: function (g) {
      var T = THREE, G = TK.geo, D = TK.data;
      var prof = D.profiles.filter(function (p) { return p.id === 'tr35'; })[0];
      var tot = prof.total, W = prof.useful, H = prof.h, L = 1.5, x0 = -tot / 2, zf = L / 2, th = 0.0012;
      var pts = G.profilePoints(prof).map(function (p) { return [p.x + x0, p.h]; });
      var geo = shell(pts, L, th, true);
      var FU = { uForm: { value: 1 }, uWave: { value: 0.0035 }, uSweep: { value: 0 } };
      // oblikovanje: y klizi od ravne ploče (aFlat) ka profilu, front ide po aX; talasavost 0,3 % po dužini
      var VS = [
        'float tkW = 0.1, tkF = -tkW + uForm * (1.0 + 2.0 * tkW);',
        'float tkK = 1.0 - smoothstep(tkF - tkW, tkF + tkW, aX);'].join('\n');
      function patch(m, key) {
        m.onBeforeCompile = function (sh) {
          sh.uniforms.uForm = FU.uForm; sh.uniforms.uWave = FU.uWave; sh.uniforms.uSweep = FU.uSweep;
          sh.vertexShader = sh.vertexShader
            .replace('#include <common>', '#include <common>\nattribute float aFlat; attribute float aX; uniform float uForm; uniform float uWave; varying float vFx;')
            .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n' + VS + '\nobjectNormal = normalize(mix(vec3(0.0, objectNormal.y < 0.0 ? -1.0 : 1.0, 0.0), objectNormal, tkK));')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y = mix(aFlat, transformed.y, tkK) + uWave * sin(transformed.z * 4.19 + transformed.x * 2.1) * tkK;\nvFx = aX;');
          sh.fragmentShader = sh.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform float uForm; uniform float uSweep; varying float vFx;')
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat tkF2 = -0.1 + uForm * 1.2; totalEmissiveRadiance += vec3(0.72, 0.84, 1.0) * 0.38 * exp(-pow((vFx - tkF2 + 0.03) * 26.0, 2.0)) * uSweep;');
        };
        m.customProgramCacheKey = function () { return key; };
        return m;
      }
      var mats = { dark: patch(ME.mat.galvanized({ side: T.DoubleSide }), 'h3d-form-galv'), light: patch(ME.mat.anthracite({ three: { side: T.DoubleSide } }), 'h3d-form-ral') };
      var panel = new T.Mesh(geo, mats.dark);
      panel.userData.swap = [mats.dark, mats.light];
      panel.castShadow = true; panel.receiveShadow = true;
      // senka prati oblikovanje: ista deformacija u dubinskom materijalu
      var dm = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking });
      dm.onBeforeCompile = function (sh) {
        sh.uniforms.uForm = FU.uForm; sh.uniforms.uWave = FU.uWave;
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nattribute float aFlat; attribute float aX; uniform float uForm; uniform float uWave;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VS + '\ntransformed.y = mix(aFlat, transformed.y, tkK) + uWave * sin(transformed.z * 4.19 + transformed.x * 2.1) * tkK;');
      };
      dm.customProgramCacheKey = function () { return 'h3d-form-depth'; };
      panel.customDepthMaterial = dm;
      panel.position.set(0, 0.002, -L / 2);
      g.add(panel);
      // jedna svetleća linija po temenu drugog rebra (vidi se kada su rebra oblikovana)
      var cx = 2 * prof.pitch + prof.web + prof.crown / 2 + x0;
      var lineGrp = new T.Group();
      arcLine(lineGrp, new T.Vector3(cx, H + 0.0038, -L / 2), new T.Vector3(cx, H + 0.0038, zf), 0.0012);
      g.add(lineGrp);
      var crestEnd = 4 * prof.pitch + prof.web + prof.crown + x0;
      var V = function (x, y, z) { return new T.Vector3(x, y, z); };
      return {
        cam: new T.Vector3(1.05, 1.0, 2.25), yaw: -0.42, fit: 0.66,
        kote: {
          cover: [V(x0, 0.002, zf), V(x0 + W, 0.002, zf), V(x0, 0.002, zf + 0.17), V(x0 + W, 0.002, zf + 0.17)],
          rib: [V(crestEnd, H + 0.002, zf), V(x0 + tot, 0.002, zf), V(KX, H + 0.002, zf), V(KX, 0.002, zf)]
        },
        themed: function (th) { panel.material = th === 'light' ? panel.userData.swap[1] : panel.userData.swap[0]; },
        anim: {
          dur: 1.6, koteAt: 1.55,
          update: function (t) {
            var enter = ease(clamp01(t / 0.45)), form = ease(clamp01((t - 0.3) / 1.1));
            g.position.x = (1 - enter) * 0.8;
            FU.uForm.value = form;
            FU.uSweep.value = t < 0.3 ? 0 : form < 1 ? 1 : Math.max(0, 1 - (t - 1.4) / 0.25);
            lineGrp.visible = form >= 0.999;
            return t < 1.65;
          },
          final: function () { g.position.x = 0; FU.uForm.value = 1; FU.uSweep.value = 0; lineGrp.visible = true; }
        }
      };
    },
    /* čelična ploča 1250 × 800 × 8 mm, isečena na plazmi. Ulaz: glava plazme obilazi
       konturu i rupe, rez svetli, isečci padaju i blede, varnice na početku svakog reza. */
    cutplate: function (g) {
      var T = THREE, W = 1.25, D = 0.8, th = 0.008, c = 0.06, ch = 0.22, X = ME.textures();
      var s = new T.Shape();
      s.moveTo(W / 2 - ch, D / 2); s.lineTo(-W / 2 + c, D / 2);
      s.quadraticCurveTo(-W / 2, D / 2, -W / 2, D / 2 - c); s.lineTo(-W / 2, -D / 2 + c); s.quadraticCurveTo(-W / 2, -D / 2, -W / 2 + c, -D / 2);
      s.lineTo(W / 2 - c, -D / 2); s.quadraticCurveTo(W / 2, -D / 2, W / 2, -D / 2 + c); s.lineTo(W / 2, D / 2 - ch); s.lineTo(W / 2 - ch, D / 2);
      var holes = [];
      function hole(x, y, r) { var p = new T.Path(); p.absarc(x, y, r, 0, Math.PI * 2, true); holes.push(p); }
      function slot(x, y, l, r) { var p = new T.Path(); p.absarc(x - l / 2, y, r, Math.PI / 2, Math.PI * 1.5, false); p.absarc(x + l / 2, y, r, Math.PI * 1.5, Math.PI / 2, false); holes.push(p); }
      var hx = 0.06, hr = 0.17;
      hole(hx, 0, hr);
      [0, 1, 2, 3, 4, 5].forEach(function (k) { var a = k / 6 * Math.PI * 2 + Math.PI / 6; hole(hx + Math.cos(a) * 0.255, Math.sin(a) * 0.255, 0.022); });
      hole(-0.47, 0.27, 0.045); hole(-0.47, -0.27, 0.045);
      slot(0.45, -0.22, 0.12, 0.026); slot(0.45, 0.02, 0.12, 0.026);
      s.holes = holes;
      // gornja strana: valjaonička kora + utisnut broj dela; UV istiskivanja = koordinate konture
      var topTex = (function () {
        var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 656;
        var x = cv.getContext('2d');
        x.drawImage(X.millscale.image, 0, 0, 1024, 1024, 0, 0, 1024, 656);
        x.save(); x.translate(610, 530); x.rotate(-0.012);
        x.font = '500 44px "IBM Plex Mono", Consolas, monospace'; x.textBaseline = 'middle';
        x.fillStyle = 'rgba(205,210,216,.62)'; x.fillText('TK-1250-800-08  S235JR', 1, 1);
        x.fillStyle = 'rgba(20,22,26,.7)'; x.fillText('TK-1250-800-08  S235JR', -1, -1);
        x.restore();
        var t = new T.CanvasTexture(cv); t.anisotropy = 4;
        if ('colorSpace' in t && T.SRGBColorSpace) t.colorSpace = T.SRGBColorSpace; else t.encoding = T.sRGBEncoding;
        t.wrapS = t.wrapT = T.ClampToEdgeWrapping; t.repeat.set(1 / W, 1 / D); t.offset.set(0.5, 0.5); t.flipY = false;
        return t;
      })();
      function fit(tex) { var t = tex.clone(); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(1.6, 1.6); t.needsUpdate = true; return t; }
      var top = ME.mat.plate({ map: topTex, roughnessMap: fit(X.millscaleR), normalMap: fit(X.millscaleN) });
      var edge = ME.mat.edge({ side: T.DoubleSide });
      var geo = new T.ExtrudeGeometry(s, { depth: th, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0005, bevelSegments: 1, curveSegments: 36 });
      var plate = new T.Mesh(geo, [top, edge]);
      plate.rotation.x = -Math.PI / 2;             // (x, y, z) → (x, z, −y): ploča leži, gornja strana na y = th
      plate.position.y = 0.0005;
      plate.castShadow = true; plate.receiveShadow = true;
      plate.updateMatrix();
      g.add(plate);
      // isečci (ispune rupa) — padaju i blede kada ih rez obiđe
      var slugs = holes.map(function (p) {
        var sh = new T.Shape(p.getPoints(36)), m = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: th - 0.0006, bevelEnabled: false, curveSegments: 36 }), [top, edge]);
        m.position.z = -0.0002; m.castShadow = true;
        plate.add(m);
        return m;
      });
      // kapljice troske ispod spoljne ivice
      var pts = s.getPoints(40), drossN = 26, dross = new T.InstancedMesh(new T.SphereGeometry(0.0013, 8, 6), ME.mat.edge({ color: 0x55595f }), drossN), m4 = new T.Matrix4();
      for (var di = 0; di < drossN; di++) { var pp = pts[Math.floor(di / drossN * pts.length)]; m4.makeTranslation(pp.x * 0.998, pp.y * 0.998, -0.0006); dross.setMatrixAt(di, m4); }
      plate.add(dross);
      // putanje reza (lokalno 2D) u redosledu: spoljna kontura, velika rupa, male rupe, ugaone, prorezi
      var paths = [pts].concat(holes.map(function (p) { return p.getPoints(36); })), lens = [], total = 0;
      paths.forEach(function (pl) { var l = 0; for (var i = 1; i < pl.length; i++) l += pl[i].distanceTo(pl[i - 1]); lens.push(l); total += l; });
      var cum = [0]; lens.forEach(function (l, i) { cum.push(cum[i] + l); });
      function at(frac) {         // tačka na ukupnoj putanji reza, 0..1 → Vector2 + indeks putanje
        var d = clamp01(frac) * total, pi = 0;
        while (pi < lens.length - 1 && d > cum[pi + 1]) pi++;
        var pl = paths[pi], rem = d - cum[pi], i = 1;
        while (i < pl.length - 1 && rem > pl[i].distanceTo(pl[i - 1])) { rem -= pl[i].distanceTo(pl[i - 1]); i++; }
        var seg = pl[i].distanceTo(pl[i - 1]) || 1, k = clamp01(rem / seg);
        return { p: pl[i - 1].clone().lerp(pl[i], k), path: pi };
      }
      // linija reza: traka 2,2 mm po putanjama, aT = položaj duž reza; svetli iza glave, trag hladi
      var CUT = { uCut: { value: 1 }, uGlow: { value: 0 }, uA: { value: 1 } };
      var cutMesh = (function () {
        var pos = [], at2 = [], idx = [], n = 0, w = 0.0019, z = th + 0.0007, d = 0;
        paths.forEach(function (pl) {
          for (var i = 1; i < pl.length; i++) {
            var a = pl[i - 1], b = pl[i], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1, nx = -dy / l * w, ny = dx / l * w;
            pos.push(a.x + nx, a.y + ny, z, a.x - nx, a.y - ny, z, b.x + nx, b.y + ny, z, b.x - nx, b.y - ny, z);
            at2.push(d / total, d / total, (d + l) / total, (d + l) / total);
            idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); n += 4; d += l;
          }
        });
        var cg = new T.BufferGeometry();
        cg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        cg.setAttribute('aT', new T.Float32BufferAttribute(at2, 1));
        cg.setIndex(idx);
        var cm = new T.ShaderMaterial({
          uniforms: CUT,
          vertexShader: 'attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: 'uniform float uCut; uniform float uGlow; uniform float uA; varying float vT; void main(){ if (vT > uCut) discard; float d = uCut - vT; float heat = exp(-d * 9.0); vec3 c = mix(vec3(0.62, 0.72, 0.86) * 0.7, vec3(0.8, 0.9, 1.0) * 3.4, heat); gl_FragColor = vec4(c, (0.3 + 0.7 * heat) * uGlow * uA); }',
          transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false
        });
        var cmesh = new T.Mesh(cg, cm); cmesh.renderOrder = 4; cmesh.frustumCulled = false;
        plate.add(cmesh);
        return cmesh;
      })();
      // glava plazme: konus + vrh + sjaj
      var torch = new T.Group();
      var cone = new T.Mesh(new T.CylinderGeometry(0.004, 0.015, 0.07, 14), R.mats.torch); cone.position.y = 0.045; cone.castShadow = true;
      var body = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, 0.1, 14), R.mats.torch); body.position.y = 0.13;
      var tip = new T.Mesh(new T.SphereGeometry(0.0026, 10, 8), R.mats.tip); tip.position.y = 0.0105;
      var halo = new T.Sprite(R.mats.tipGlow); halo.scale.set(0.11, 0.11, 1); halo.position.y = 0.011; halo.userData.noRefl = true;
      torch.add(cone, body, tip, halo);
      torch.visible = false;
      g.add(torch);
      // početak svakog reza (za varnice) u koordinatama grupe g
      var starts = paths.map(function (pl, i) { return { at: new T.Vector3(pl[0].x, pl[0].y, th).applyMatrix4(plate.matrix), t: 0.12 + cum[i] / total * 1.36 }; });
      var T0 = 0.12, T1 = 1.48, fx = [];
      var V = function (x, y, z) { return new T.Vector3(x, y, z); }, zf = KZ, xr = KX, y = 0.001;
      function endState() {
        torch.visible = false; CUT.uGlow.value = 0; CUT.uCut.value = 1;
        slugs.forEach(function (m) { m.visible = false; });
      }
      return {
        cam: new T.Vector3(1.05, 1.0, 2.25), yaw: -0.42, fit: 0.66,
        kote: {
          len: [V(-W / 2, y, D / 2 - c), V(W / 2, y, D / 2 - ch), V(-W / 2, y, zf), V(W / 2, y, zf)],
          wid: [V(W / 2 - c, y, -D / 2), V(W / 2 - ch, y, D / 2), V(xr, y, -D / 2), V(xr, y, D / 2)]
        },
        anim: {
          dur: 1.8, koteAt: 1.7,
          start: function () {          // sistemi čestica se prave po ulasku (high) i brišu po završetku
            fx.forEach(function (f) { f.dispose(); }); fx = [];
            slugs.forEach(function (m) { m.visible = true; m.position.z = -0.0002; });
            m4 = null;
            if (tier === 'high') {
              var sp = burst({ bursts: starts, n: 52, life: 0.42, color: 0xffb060, size: 15, speed: [0.3, 1.1], up: 0.75, jitter: 0.05 });
              g.add(sp.mesh); fx.push(sp);
            }
          },
          alpha: function (a) { CUT.uA.value = a; fx.forEach(function (f) { f.alpha(a); }); },
          update: function (t) {
            fx.forEach(function (f) { f.set(t); });
            var k = clamp01((t - T0) / (T1 - T0)), q2 = at(k), p3 = new T.Vector3(q2.p.x, q2.p.y, th).applyMatrix4(plate.matrix);
            torch.visible = t > 0 && t < T1 + 0.45;
            var drop = t < T0 ? 1 - ease(clamp01(t / T0)) : t > T1 ? ease(clamp01((t - T1) / 0.4)) : 0;
            torch.position.set(p3.x + drop * 0.12, p3.y + drop * 0.42, p3.z + drop * 0.08);
            halo.material.opacity = 0.9 * (1 - drop);
            CUT.uCut.value = k;
            CUT.uGlow.value = t < T0 ? 0 : t < T1 ? 1 : Math.max(0, 1 - (t - T1) / 0.9);
            // isečci: 4 mm pad i bleđenje 0,4 s posle završetka svoje putanje
            slugs.forEach(function (m, i) {
              var done = T0 + cum[i + 2] / total * (T1 - T0), u = clamp01((t - done) / 0.4);
              if (t <= done) { m.visible = true; m.position.z = -0.0002; return; }
              m.visible = u < 1;
              m.position.z = -0.0002 - 0.004 * ease(u);
            });
            if (t > 2.4 && fx.length) { fx.forEach(function (f) { f.dispose(); }); fx = []; }
            return t < 2.5;
          },
          final: function () { endState(); fx.forEach(function (f) { f.dispose(); }); fx = []; },
          particles: function () { return fx.length; }
        }
      };
    },
    /* paket od 12 tabli u RAL bojama na drvenim podmetačima, dve trake sa kopčom.
       Ulaz: table sleću jedna po jedna, trake se stegnu poslednje, prašina pri sletanju. */
    stack: function (g) {
      var T = THREE, W = 1.25, D = 0.625, n = 12, t = 0.0066, gap = 0.0009, step = t + gap, Hs = n * step, y0 = 0.08;
      var order = ['9010', '3009', '7024', '7016', '8004', '9010', '7024', '3009', '7016', '7024', '9010', '7016'];
      var sheets = [], sg = new T.BoxGeometry(W, t, D), eg = ME.mat.edge();
      for (var k = 0; k < n; k++) {
        var face = k === n - 1 ? ME.mat.film(RAL[order[k]]) : ME.mat.coated(RAL[order[k]]);
        var sh = new T.Mesh(sg, [eg, eg, face, face, eg, eg]);
        sh.userData.rest = new T.Vector3(((k * 7) % 5 - 2) * 0.0014, y0 + k * step + t / 2, ((k * 3) % 4 - 1.5) * 0.0012);
        sh.position.copy(sh.userData.rest);
        sh.rotation.y = ((k * 5) % 3 - 1) * 0.0028;
        sh.castShadow = true; sh.receiveShadow = true;
        g.add(sh); sheets.push(sh);
      }
      // drveni podmetači
      var bearers = new T.Group();
      [-0.38, 0.38].forEach(function (x) {
        var b = new T.Mesh(new T.BoxGeometry(0.08, y0, D + 0.1), R.mats.wood);
        b.position.set(x, y0 / 2, 0); b.castShadow = true; b.receiveShadow = true;
        bearers.add(b);
      });
      g.add(bearers);
      // trake: obruč oko paketa (preko, niz prednju i zadnju stranu, ispod) + kopča; stegnu se poslednje
      var bands = new T.Group(), bw = 0.016, bt = 0.0008, BM = R.mats.band;
      [-0.3, 0.3].forEach(function (x) {
        var top = new T.Mesh(new T.BoxGeometry(bw, bt, D + 0.004), BM); top.position.set(x, y0 + Hs + bt / 2, 0);
        var bot = new T.Mesh(new T.BoxGeometry(bw, bt, D + 0.004), BM); bot.position.set(x, y0 - bt / 2, 0);
        var fr = new T.Mesh(new T.BoxGeometry(bw, Hs + 2 * bt, bt), BM); fr.position.set(x, y0 + Hs / 2, D / 2 + 0.002);
        var bk = fr.clone(); bk.position.z = -D / 2 - 0.002;
        var buckle = new T.Mesh(new T.BoxGeometry(0.034, 0.004, 0.022), BM); buckle.position.set(x, y0 + Hs + 0.002, 0.1);
        [top, bot, fr, bk, buckle].forEach(function (m) { m.castShadow = true; bands.add(m); });
      });
      bands.userData.y = y0 + Hs / 2;
      g.add(bands);
      // jedna plava linija po gornjoj prednjoj ivici paketa
      var lineGrp = new T.Group();
      arcLine(lineGrp, new T.Vector3(-W / 2, y0 + Hs + 0.0025, D / 2 - 0.001), new T.Vector3(W / 2, y0 + Hs + 0.0025, D / 2 - 0.001), 0.0012);
      g.add(lineGrp);
      var fx = [], landT = (n - 1) * 0.07 + 0.34;
      var V = function (x, y, z) { return new T.Vector3(x, y, z); }, zf = KZ;
      function rest() {
        sheets.forEach(function (s) { s.position.copy(s.userData.rest); s.visible = true; });
        bands.visible = true; bands.scale.set(1, 1, 1); bands.position.y = 0;
        lineGrp.visible = true;
      }
      return {
        cam: new T.Vector3(1.05, 1.0, 2.25), yaw: -0.42, fit: 0.66,
        kote: {
          len: [V(-W / 2, y0 + 0.001, D / 2), V(W / 2, y0 + 0.001, D / 2), V(-W / 2, y0 + 0.001, zf), V(W / 2, y0 + 0.001, zf)],
          h: [V(-W / 2, y0 + Hs, D / 2), V(-W / 2, y0, D / 2), V(-KX, y0 + Hs, D / 2), V(-KX, y0, D / 2)]
        },
        anim: {
          dur: 1.7, koteAt: 1.6,
          start: function () {
            fx.forEach(function (f) { f.dispose(); }); fx = [];
            if (tier === 'high') {
              var corners = [V(-W / 2, y0, D / 2), V(W / 2, y0, D / 2), V(-W / 2, y0, -D / 2), V(W / 2, y0, -D / 2), V(0, y0, D / 2), V(0, y0, -D / 2)];
              var d = burst({ bursts: corners.map(function (p) { return { at: p, t: landT - 0.05 }; }), n: 14, life: 0.65, color: 0xb9c2cc, size: 16, speed: [0.12, 0.42], up: 0.3, flat: true, grav: new T.Vector3(0, -0.3, 0), jitter: 0.08 });
              g.add(d.mesh); fx.push(d);
            }
          },
          alpha: function (a) { fx.forEach(function (f) { f.alpha(a); }); },
          update: function (tt) {
            fx.forEach(function (f) { f.set(tt); });
            sheets.forEach(function (s, i) {
              var u = (tt - i * 0.07) / 0.34, r0 = s.userData.rest;
              if (u < 0) { s.visible = false; return; }
              s.visible = true;
              if (u < 1) s.position.set(r0.x, r0.y + 0.34 * (1 - u) * (1 - u), r0.z);
              else { var sdl = clamp01((u - 1) / 0.5); s.position.set(r0.x, r0.y - 0.0016 * Math.sin(sdl * Math.PI) * (1 - sdl), r0.z); }
            });
            var bk = clamp01((tt - landT) / 0.4), be = ease(bk);
            bands.visible = tt > landT - 0.05;
            bands.scale.set(1, 1 + 0.28 * (1 - be), 1 + 0.03 * (1 - be));
            bands.position.y = -bands.userData.y * (bands.scale.y - 1);
            lineGrp.visible = bk >= 1;
            if (tt > landT + 1.0 && fx.length) { fx.forEach(function (f) { f.dispose(); }); fx = []; }
            return tt < landT + 1.1;
          },
          final: function () { rest(); fx.forEach(function (f) { f.dispose(); }); fx = []; },
          particles: function () { return fx.length; }
        }
      };
    },
    roof: function (g) {
      var T = THREE, G = TK.geo, D = TK.data;
      var prof = D.profiles.filter(function (p) { return p.id === 'tr35'; })[0];
      var pts = G.profilePoints(prof).filter(function (p) { return p.x <= 0.87; }).map(function (p) { return [p.x, p.h]; });
      var L = 1.1;
      var panel = new T.Mesh(shell(pts, L, 0.0012), R.mats.ral);
      var slope = new T.Group();
      slope.add(panel);
      panel.position.set(-0.435, 0, -L);              // eave at z = 0
      slope.rotation.x = 0.26;                        // roof pitch (~15°)
      g.add(slope);
      var crest = [prof.web + prof.crown / 2 + prof.pitch, prof.h];
      arcLine(slope, new T.Vector3(crest[0] - 0.435, crest[1] + 0.0018, -L), new T.Vector3(crest[0] - 0.435, crest[1] + 0.0018, 0), 0.0012);
      var gut = new T.Group();
      gutterParts(gut, 0.96, { hooks: [0.16, 0.8], cap: true, mat: R.mats.galv });
      gut.rotation.y = -Math.PI / 2;
      gut.position.set(0.48, -0.032, -0.045);
      g.add(gut);
      g.position.y = 0.3;
      return { cam: new T.Vector3(1.55, 0.95, 2.35), yaw: -0.5, fit: 0.6 };
    },
    gutter: function (g) {
      var T = THREE;
      var gut = new T.Group();
      gutterParts(gut, 1.0, { hooks: [0.2, 0.8], cap: true });
      gut.rotation.y = -Math.PI / 2;
      gut.position.set(0.5, 0, -0.06);
      g.add(gut);
      g.position.y = 0.09;
      return { cam: new T.Vector3(1.2, 0.8, 1.7), yaw: -0.35, fit: 0.62 };
    },
    plate: function (g) {
      var T = THREE, W = 0.9, H = 0.56, th = 0.015, c = 0.05;
      var s = new T.Shape();
      s.moveTo(-W / 2 + c, -H / 2); s.lineTo(W / 2 - 0.16, -H / 2); s.lineTo(W / 2, -H / 2 + 0.16); s.lineTo(W / 2, H / 2 - c);
      s.quadraticCurveTo(W / 2, H / 2, W / 2 - c, H / 2); s.lineTo(-W / 2 + c, H / 2); s.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - c);
      s.lineTo(-W / 2, -H / 2 + c); s.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + c, -H / 2);
      function hole(x, y, r) { var p = new T.Path(); p.absarc(x, y, r, 0, Math.PI * 2, true); s.holes.push(p); }
      function slot(x, y, l, r) { var p = new T.Path(); p.absarc(x - l / 2, y, r, Math.PI / 2, Math.PI * 1.5, false); p.absarc(x + l / 2, y, r, Math.PI * 1.5, Math.PI / 2, false); s.holes.push(p); }
      hole(-0.3, 0.17, 0.04); hole(-0.3, -0.17, 0.04); hole(0.05, 0.0, 0.13);
      [0, 1, 2, 3, 4, 5].forEach(function (k) { var a = k / 6 * Math.PI * 2; hole(0.05 + Math.cos(a) * 0.19, Math.sin(a) * 0.19, 0.018); });
      slot(0.33, 0.14, 0.09, 0.022); slot(0.33, -0.08, 0.09, 0.022);
      var geo = new T.ExtrudeGeometry(s, { depth: th, bevelEnabled: false, curveSegments: 28 });
      var plate = new T.Mesh(geo, [ME.mat.plate(), R.mats.edge]);
      plate.rotation.x = -Math.PI / 2 + 0.42;
      plate.rotation.z = 0.12;
      g.add(plate);
      var arc = new T.Group();
      var tor = new T.Mesh(new T.TorusGeometry(0.13, 0.0016, 6, 64, Math.PI * 0.9), R.mats.arc);
      var halo = new T.Mesh(new T.TorusGeometry(0.13, 0.006, 8, 64, Math.PI * 0.9), R.mats.glow);
      halo.userData.noRefl = true;
      arc.add(tor, halo);
      arc.position.set(0.05, 0, th + 0.0005);
      arc.rotation.z = 0.3;
      var spark = new T.Mesh(new T.SphereGeometry(0.006, 12, 8), R.mats.spark);
      spark.position.set(0.05 + Math.cos(0.3 + Math.PI * 0.9) * 0.13, Math.sin(0.3 + Math.PI * 0.9) * 0.13, th + 0.001);
      plate.add(arc, spark);
      g.position.y = 0.32;
      return { cam: new T.Vector3(0.9, 1.05, 1.9), yaw: -0.2 };
    },
    coil: function (g) {
      var T = THREE, Ro = 0.29, Ri = 0.2, Wd = 0.42;
      var coil = new T.Group();
      var outer = new T.Mesh(new T.CylinderGeometry(Ro, Ro, Wd, 72, 1, true), R.mats.galv);
      var inner = new T.Mesh(new T.CylinderGeometry(Ri, Ri, Wd, 48, 1, true), R.mats.galv);
      var endGeo = new T.RingGeometry(Ri, Ro, 72, 1);
      var uv = endGeo.attributes.uv, p = endGeo.attributes.position;
      for (var i = 0; i < uv.count; i++) uv.setXY(i, 0.5 + p.getX(i) / (2 * Ro), 0.5 + p.getY(i) / (2 * Ro));
      var e1 = new T.Mesh(endGeo, R.mats.coilEnd), e2 = new T.Mesh(endGeo, R.mats.coilEnd);
      e1.rotation.x = -Math.PI / 2; e1.position.y = Wd / 2;
      e2.rotation.x = Math.PI / 2; e2.position.y = -Wd / 2;
      coil.add(outer, inner, e1, e2);
      [-0.12, 0.12].forEach(function (y) {
        var st = new T.Mesh(new T.CylinderGeometry(Ro + 0.0025, Ro + 0.0025, 0.018, 72, 1, true), R.mats.strap);
        st.position.y = y; coil.add(st);
      });
      coil.rotation.z = Math.PI / 2;
      coil.position.set(-0.3, Ro, -0.1);
      g.add(coil);
      arcLine(g, new T.Vector3(-0.3 - Wd / 2, Ro * 2 + 0.002, -0.1), new T.Vector3(-0.3 + Wd / 2, Ro * 2 + 0.002, -0.1), 0.0013);
      for (var k = 0; k < 8; k++) {
        var sh = new T.Mesh(new T.BoxGeometry(0.66, 0.006, 0.44), [R.mats.kerf, R.mats.kerf, R.mats.galv, R.mats.galv, R.mats.kerf, R.mats.kerf]);
        sh.position.set(0.42 + (k % 2) * 0.005, 0.003 + k * 0.0072, 0.12 - (k % 3) * 0.004);
        sh.rotation.y = -0.42 + (k % 2 ? 0.014 : -0.01);
        g.add(sh);
      }
      g.position.y = 0.02;
      return { cam: new T.Vector3(1.25, 0.72, 2.2), yaw: 0.25, fit: 0.72 };
    }
  };

  /* ---- one viewer per host -------------------------------------------------- */
  function Viewer(host) {
    var T = THREE;
    shared();
    this.host = host;
    this.names = host.getAttribute('data-hero3d').split(/\s+/);
    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    var r = this.renderer = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: mode === 'still' });
    r.setPixelRatio(ME.pixelRatio(tier));
    ME.setup(r, theme(host), tier);
    r.setClearColor(0x000000, 0);
    this.scene = new T.Scene();
    this.world = new T.Group();                 // sto + objekti: blag nagib ka pokazivaču
    this.scene.add(this.world);
    this.camera = new T.PerspectiveCamera(26, 1, 0.05, 40);
    var onBed = host.hasAttribute('data-bed');
    this.key = ME.keyLight(onBed ? tier : 'low', 1.25, 2.2);
    this.keyBase = this.key.position.clone();
    this.scene.add(this.key, this.key.target);
    this.items = this.names.map(function (n) {
      var piv = new T.Group(), g = new T.Group();
      piv.add(g);
      var view = BUILD[n](g);
      if (view.anim && view.anim.final) view.anim.final();
      piv.rotation.y = view.yaw;
      piv.updateMatrixWorld(true);
      var sph = new T.Box3().setFromObject(piv).getBoundingSphere(new T.Sphere());
      view.target = sph.center.clone();
      view.r = sph.radius * (view.fit || 0.74);
      // floor reflection (zaglavlja): mirrored clone with fading materials
      var mir = new T.Group(); mir.scale.y = -1;
      var rp = piv.clone(true);
      rp.traverse(function (o) {
        if (!o.isMesh) return;
        if (o.userData.noRefl) { o.visible = false; return; }
        o.material = Array.isArray(o.material) ? o.material.map(reflMat) : reflMat(o.material);
      });
      mir.add(rp);
      var sh = ME.contactShadow(1, 1, 0.7);
      sh.position.y = 0.001;
      sh.scale.set(view.r * 2.3, view.r * 1.5, 1);
      var root = new T.Group();
      root.add(piv, mir, sh);
      var item = { root: root, piv: piv, g: g, rp: rp, shadow: sh, view: view, name: n, animT0: -1e9 };
      if (onBed) {
        mir.visible = false;
        rp.visible = false;
        item.mats = own(piv).concat(own(sh));
        fade(item, 1);
      }
      root.visible = false;
      this.world.add(root);
      return item;
    }, this);
    if (onBed) {
      // Jedan sto za sve objekte, poravnat sa prvim (tabla) u položaju mirovanja; svi objekti
      // leže na istom mestu, u istom razmeru i istom kadru. Objekat se njiše ±6° na stolu.
      var f = this.items[0], fv = f.view;
      f.piv.rotation.y = 0; f.piv.updateMatrixWorld(true);
      var bd = this.bed = bed(new T.Box3().setFromObject(f.piv));
      f.piv.rotation.y = fv.yaw; f.piv.updateMatrixWorld(true);
      bd.rotation.y = fv.yaw;
      this.world.add(bd);
      bd.updateMatrixWorld(true);
      var s2 = new T.Box3().setFromObject(f.piv).union(new T.Box3().setFromObject(bd)).getBoundingSphere(new T.Sphere());
      bd.add(bd.userData.shadow);
      var tgt = s2.center.clone(), rr = s2.radius * (fv.fit || 0.74);
      this.items.forEach(function (it) {
        it.view.target = tgt; it.view.r = rr; it.view.cam = fv.cam; it.view.yaw = fv.yaw;
        it.piv.rotation.y = fv.yaw;
        it.shadow.scale.set(rr * 1.6, rr * 1.2, 1);
      });
      this.key.target.position.copy(tgt);
      this.world.position.copy(tgt).negate(); this.world.position.y = 0;      // nagib oko sredine kadra
      this.world.userData.off = this.world.position.clone();
      this.key.position.add(tgt);
      this.keyBase.copy(this.key.position);
    }
    this.cur = Math.max(0, Math.min(this.items.length - 1, host.__cur != null ? host.__cur : parseInt(host.getAttribute('data-start') || '0', 10) || 0));
    this.items[this.cur].root.visible = true;
    this.px = 0; this.py = 0; this.tx = 0; this.ty = 0;
    this.t0 = performance.now();
    this.applyTheme();
    this.resize();
    // svi objekti se prevode odmah (i prvi prelaz ne zastane na kompilaciji), ali u pozadini:
    // dok drajver ne poveže programe ne crta se ništa i na ekranu ostaje statična slika
    this.ready = false;
    var self = this;
    this.items.forEach(function (it) { it.root.visible = true; });
    ME.warm(this.renderer, this.scene, this.camera, function () {
      self.items.forEach(function (it, i) { it.root.visible = i === self.cur; });
      self.ready = true;
      if (onBed) self.begin(self.items[self.cur], performance.now() + 300);   // ulazna animacija: objekat ulazi 300 ms posle prvog kadra
      kick();
    });
  }
  // pokreni ulaznu animaciju objekta (ili završni položaj uz smanjeno kretanje / snimak)
  Viewer.prototype.begin = function (it, at) {
    var an = it.view.anim;
    if (!an) return;
    if (noAnim || mode === 'still') { an.final(); it.animT0 = -1e9; it.animDone = true; return; }
    if (an.start) an.start();
    an.update(0);
    it.animT0 = at; it.animDone = false;
  };
  Viewer.prototype.applyTheme = function () {
    var th = theme(this.host), dark = th === 'dark', T = THREE;
    if (this.envRT) this.envRT.dispose();
    this.envRT = ME.studio(this.renderer, { theme: th });
    this.scene.environment = this.envRT.texture;
    this.renderer.toneMappingExposure = ME.exposure(th);
    this.key.intensity = dark ? 2.2 : 2.4;
    if (U) { U.uRefl.value = dark ? 0.34 : 0.22; U.uFade.value = 0.42; }
    var glowOp = dark ? 0.32 : 0.16, shOp = dark ? 0.7 : 0.32;
    R.mats.glow.opacity = glowOp;
    this.items.forEach(function (it) {
      if (it.view.themed) it.view.themed(th);
      if (!it.mats) { it.shadow.material.opacity = shOp; return; }
      it.mats.forEach(function (m) { if (m.userData.src === R.mats.glow) m.userData.op0 = glowOp; });
      it.shadow.material.userData.op0 = shOp;
      fade(it, it.a);
    });
    if (this.bed) {
      this.bed.userData.pool.material = dark ? R.mats.pool : R.mats.poolShade;
      this.bed.userData.shadow.material.opacity = dark ? 0.6 : 0.34;
      R.mats.bed.envMapIntensity = dark ? 1 : 0.55;     // sto ostaje tamna antracit ploča i u svetloj temi
    }
    this.dirty = true;
  };
  Viewer.prototype.resize = function () {
    var w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  };
  // 3D tačke kota → pikseli hosta
  Viewer.prototype.koteAt = function (it, norm) {
    var cam = this.camera;
    var w = norm ? 1 : this.host.clientWidth, h = norm ? 1 : this.host.clientHeight, out = {};
    it.g.updateMatrixWorld(true);
    Object.keys(it.view.kote).forEach(function (k) {
      out[k] = it.view.kote[k].map(function (p) {
        var s = p.clone().applyMatrix4(it.g.matrixWorld).project(cam);
        return [(s.x + 1) / 2 * w, (1 - s.y) / 2 * h];
      });
    });
    return out;
  };
  var AX = null;
  Viewer.prototype.frame = function (now) {
    var it = this.items[this.cur], v = it.view, cam = this.camera;
    AX = AX || new THREE.Vector3(0, 1, 0);
    var t = (now - this.t0) / 1000;
    var still = mode === 'still';
    // prelaz na stolu: stari objekat se gasi, novi se pali i raste 0,96 → 1 (600 ms, ista kriva)
    var x = this.x, old = x ? this.items[x.from] : null;
    if (x) {
      var e = ease(Math.min(1, (now - x.t0) / SWAP_MS));
      fade(old, 1 - e); fade(it, e);
      it.root.scale.setScalar(0.96 + 0.04 * e);
      if (e >= 1) { old.root.visible = false; this.x = null; old = null; }
    }
    // ulazna animacija aktivnog objekta (jednom po ulasku)
    var busy = false;
    if (v.anim && !it.animDone) {
      var ta = (now - it.animT0) / 1000;
      if (ta >= 0) { busy = v.anim.update(ta); if (!busy) { v.anim.final(); it.animDone = true; } }
      else busy = true;
    }
    // sporo njihanje ±6° umesto punog okreta; objekat ne lebdi
    [it, old].forEach(function (o) {
      if (!o) return;
      o.piv.rotation.y = v.yaw + (still || noAnim ? 0 : Math.sin(t * 0.26) * 0.105);
      o.piv.position.y = 0;
      o.rp.rotation.copy(o.piv.rotation); o.rp.position.copy(o.piv.position);
    });
    this.px += (this.tx - this.px) * 0.05; this.py += (this.ty - this.py) * 0.05;
    if (this.bed) {
      // blag nagib cele scene ka pokazivaču
      this.world.rotation.x = -this.py * 0.022; this.world.rotation.z = this.px * 0.016;
      // studijski prelet svetla na svakih 9 s: svetlo (i njegova senka) prelaze luk od 1,6 s
      var ph = still || noAnim ? 0 : (t % 9) / 1.6, sw = ph < 1 ? Math.sin(ph * Math.PI) : 0;
      this.key.position.copy(this.keyBase).sub(this.key.target.position).applyAxisAngle(AX, -sw * 0.9).add(this.key.target.position);
      this.key.position.y = this.keyBase.y + sw * 0.6;
    }
    // fit the bounding sphere into the frustum (both axes)
    var vf = cam.fov * Math.PI / 360, hf = Math.atan(Math.tan(vf) * cam.aspect);
    var dist = v.r / Math.sin(Math.min(vf, hf)) * 1.04;
    var dir = v.cam.clone().normalize();
    dir.applyAxisAngle(AX, -this.px * 0.16);
    dir.y += this.py * 0.06;
    cam.position.copy(v.target).addScaledVector(dir.normalize(), dist);
    cam.lookAt(v.target);
    this.renderer.render(this.scene, cam);
    var K = this.host.__kote && this.host.__kote[it.name];
    var koteOk = !v.anim || it.animDone || (now - it.animT0) / 1000 >= (v.anim.koteAt || 0);
    if (K && v.kote && this.live && !this.x && koteOk) { K.live = true; K.draw(this.koteAt(it)); }
  };
  Viewer.prototype.show = function (i) {
    var self = this;
    if (i === this.cur || i < 0 || i >= this.items.length) return;
    if (this.bed) {
      if (this.x) { this.items[this.x.from].root.visible = false; fade(this.items[this.x.from], 0); }
      var from = this.cur, K = this.host.__kote || {};
      Object.keys(K).forEach(function (n) { K[n].hide(); });
      var prev = this.items[from];
      if (prev.view.anim) { prev.view.anim.final(); prev.animDone = true; }        // čestice prethodnog ekrana se brišu odmah
      this.cur = i;
      this.host.__cur = i;
      var it = this.items[i];
      fade(it, 0);
      it.root.scale.setScalar(0.96);
      it.root.visible = true;
      var now = performance.now();
      this.x = { from: from, t0: reduce ? -1e9 : now };
      this.begin(it, now + 250);
      return;
    }
    this.host.classList.add('is-swap');
    clearTimeout(this.swapT);
    this.swapT = setTimeout(function () {
      self.items[self.cur].root.visible = false;
      self.cur = i;
      self.items[i].root.visible = true;
      self.host.classList.remove('is-swap');
    }, reduce ? 0 : 300);
  };

  /* ---- boot: lazy per host, pause offscreen ---------------------------------- */
  var viewers = [], booted = [], running = false, leaving = false;   // leaving: pagehide (release gubi kontekst namerno)
  function loop(now) {
    running = false;
    var any = false;
    viewers.forEach(function (v) {
      if (!v.visible || !v.ready || document.hidden) return;
      any = true;
      v.frame(now);
      if (!v.live) { v.live = true; v.host.classList.add('is-live'); }
    });
    if (any && mode !== 'still') { running = true; requestAnimationFrame(loop); }
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

  function boot(host) {
    if (booted.indexOf(host) < 0) booted.push(host);
    deps(function (err) {
      if (err || !window.THREE) { document.documentElement.classList.add('h3d-static'); return; }
      var v;
      try { v = new Viewer(host); } catch (e) { document.documentElement.classList.add('h3d-static'); return; }
      v.visible = true;
      viewers.push(v);
      host.__viewer = v;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { v.visible = en[0].isIntersecting; if (v.visible) kick(); }, { rootMargin: '80px' }).observe(host);
      }
      if ('ResizeObserver' in window) new ResizeObserver(function () { v.resize(); }).observe(host);
      else window.addEventListener('resize', function () { v.resize(); });
      var band = host.closest('.hero, .pagehead') || host;
      band.addEventListener('pointermove', function (e) {
        var r = band.getBoundingClientRect();
        v.tx = (e.clientX - r.left) / r.width * 2 - 1;
        v.ty = (e.clientY - r.top) / r.height * 2 - 1;
      }, { passive: true });
      band.addEventListener('pointerleave', function () { v.tx = 0; v.ty = 0; });
      band.addEventListener('tricom:hero', function (e) { if (host.__viewer === v) v.show(e.detail.index); });
      // Gubitak WebGL konteksta (npr. reset GPU procesa u WebKit-u): petlja za ovaj prikaz staje,
      // vraća se statična slika sa kotama, bez izuzetaka; preventDefault dozvoljava pregledaču da
      // kontekst vrati — tada se scena gradi iznova (nov renderer, programi, okruženje).
      var cv = v.renderer.domElement;
      cv.addEventListener('webglcontextlost', function (e) {
        e.preventDefault();
        if (leaving || v.dropped) return;
        toStill(v);
      }, false);
      cv.addEventListener('webglcontextrestored', function () {
        if (leaving || booted.indexOf(host) < 0) return;
        if (!v.dropped) toStill(v);
        // three je stari renderer već vratio na novi kontekst (bez starih objekata): oslobodi ga
        try { v.renderer.dispose(); v.renderer.forceContextLoss(); } catch (e) { /* nije bitno */ }
        boot(host);
      }, false);
      kick();
    });
  }
  // prikaz → statična slika ekrana (i kote sa slike); renderer se oslobađa
  function toStill(v) {
    var h = v.host;
    v.dropped = true; v.ready = false; v.visible = false; v.live = false;
    h.classList.remove('is-live');
    viewers = viewers.filter(function (x) { return x !== v; });
    if (h.__viewer === v) h.__viewer = null;
    // izgubljen kontekst više nema svoje objekte: brisanje bi u WebKit-u javljalo INVALID_OPERATION
    // (posle vraćanja ne pripadaju novom kontekstu) — samo se otpuste reference
    var lost = true; try { lost = v.renderer.getContext().isContextLost(); } catch (e) { /* već izgubljen */ }
    if (!lost) { try { if (v.envRT) v.envRT.dispose(); v.renderer.dispose(); } catch (e) { /* već izgubljen */ } }
    if (v.renderer.domElement.parentNode) v.renderer.domElement.parentNode.removeChild(v.renderer.domElement);
    var K = h.__kote || {}, names = h.getAttribute('data-hero3d').split(/\s+/);
    Object.keys(K).forEach(function (n) { K[n].live = false; K[n].hide(); });
    var k = K[names[h.__cur || 0]]; if (k) k.still();
  }

  // Promena teme menja svetlo (i materijal table u hero-u početne) u svim scenama.
  document.addEventListener('tricom:theme', function () {
    viewers.forEach(function (v) { v.applyTheme(); });
    kick();
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });

  // Odlazak sa strane: petlja staje, GPU resursi i kontekst se oslobađaju odmah (bez unload — bfcache radi).
  // Povratak iz bfcache-a: do novog prvog kadra opet stoji statična slika, pa se scena gradi ponovo.
  window.addEventListener('pagehide', function () {
    leaving = true;
    viewers.forEach(function (v) {
      v.dropped = true; v.ready = false; v.visible = false; v.live = false;
      v.host.classList.remove('is-live');
      if (v.envRT) v.envRT.dispose();
      ME.release(v.renderer, v.scene);
      if (v.renderer.domElement.parentNode) v.renderer.domElement.parentNode.removeChild(v.renderer.domElement);
      v.host.__viewer = null;
    });
    viewers = [];
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted && booted.length) { leaving = false; booted.forEach(boot); } });

  // Start only after the page has loaded (+1.3 s, then idle): the headline
  // stays the LCP element and shader compilation never janks the first
  // paint. Until then the static image of the same scene is on screen.
  function arm() {
    if (mode === 'still' || !('IntersectionObserver' in window)) return hosts.forEach(boot);
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); boot(e.target); } });
    }, { rootMargin: '120px' });
    hosts.forEach(function (h) { io.observe(h); });
  }
  function later() {
    var go = function () { (window.requestIdleCallback || setTimeout)(arm, { timeout: 1500 }); };
    setTimeout(go, mode === 'still' ? 0 : 1300);
  }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);

  /* ---- probe: stanje i GPU memorija prvog prikaza (za provere) ------------------ */
  window.tricomHero3D = {
    tier: tier,
    info: function () {
      var v = viewers[0];
      if (!v) return null;
      var m = v.renderer.info.memory, parts = 0;
      v.items.forEach(function (it) { if (it.view.anim && it.view.anim.particles) parts += it.view.anim.particles(); });
      return { geometries: m.geometries, textures: m.textures, programs: (v.renderer.info.programs || []).length, cur: v.cur, live: !!v.live, tier: tier, particles: parts, animDone: !!v.items[v.cur].animDone };
    },
    // za probe: ponovo pokreni ulaznu animaciju aktivnog objekta
    replay: function () { var v = viewers[0]; if (v) v.begin(v.items[v.cur], performance.now()); }
  };

  /* ---- capture hook for the static fallback images (?hero3d=still) ---------- */
  if (mode === 'still') {
    window.tricomHero3D = {
      ready: function () { return viewers.length > 0; },
      capture: function (name, w, h) {
        var v = viewers[0], k = v.names.indexOf(name);
        if (k < 0) { v.items.forEach(function (it) { it.root.visible = false; }); return null; }
        v.items.forEach(function (it, i) { it.root.visible = i === k; if (it.mats) fade(it, 1); it.root.scale.setScalar(1); if (it.view.anim) { it.view.anim.final(); it.animDone = true; } });
        v.x = null;
        v.cur = k; v.px = v.tx = 0; v.py = v.ty = 0;
        v.renderer.setPixelRatio(1);
        v.renderer.setSize(w, h, false);
        v.camera.aspect = w / h; v.camera.updateProjectionMatrix();
        v.frame(v.t0);
        return v.renderer.domElement.toDataURL('image/png');
      },
      // tačke kota za poslednji snimak, 0–1 u odnosu na sliku (za data-kote-still)
      kote: function (name) {
        var v = viewers[0], k = v.names.indexOf(name), it = v.items[k];
        if (!it || !it.view.kote) return null;
        return v.koteAt(it, true);
      },
      retheme: function () { viewers.forEach(function (v) { v.applyTheme(); }); }
    };
  }
})();
