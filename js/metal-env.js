/* ==========================================================================
   TRICOM — metal-env.js
   Zajednička 3D osnova za hero na početnoj (js/hero3d.js) i za konfigurator
   (js/konfigurator/*): isti renderer (sRGB izlaz, ACES, fizičko svetlo, meke
   senke), isto studijsko okruženje (PMREM iz proceduralne sobe: veliki
   softboks odozgo, dve trake levo i desno, taman pod), ista fabrika
   materijala (pocinkovani lim sa „cvetom“ cinka, plastificirani RAL sa
   lakom, aluminijum, bakar sa patinom, inox, antracit ploča, svež rez
   čelika, drvo), kontaktna senka i razred kvaliteta.

   Razred kvaliteta (MetalEnv.tier): high / medium / low prema broju jezgara,
   gustini piksela, mobilnom UA i prefers-reduced-motion; ?tier=… ga
   nameće. Hero: high = sve, medium = bez čestica i senka 1024, low =
   statične slike. Konfigurator: medium bez AO, oblaka i guste šume, low =
   ravno nebo bez senki.

   Učitava se posle Three.js (UMD iz js/vendor/): u konfiguratoru kao
   <script>, u hero-u lenjo, zajedno sa Three.js. Bez zavisnosti.
   ========================================================================== */
(function () {
  'use strict';
  var ME = window.MetalEnv = window.MetalEnv || {};
  var T = null;
  function three() { if (!T) T = window.THREE; return T; }

  /* ---- razred kvaliteta ----------------------------------------------------- */
  var tierCache = null, glCache = null;
  function hasGL() {
    if (glCache !== null) return glCache;
    try {
      var c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
      // probni kontekst se odmah oslobađa (WebKit/Chromium inače gomilaju kontekste do granice);
      // u Firefox-u (Gecko) loseContext() ostavlja upozorenje „WebGL context was lost“, pa tamo ne
      if (g && !/\bGecko\/\d/.test(navigator.userAgent)) { var l = g.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); }
      glCache = !!g;
    } catch (e) { glCache = false; }
    return glCache;
  }
  ME.hasGL = hasGL;
  ME.mobile = function () {
    var ua = navigator.userAgent;
    return /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  };
  ME.tier = function (force) {
    if (force) tierCache = force;
    if (tierCache) return tierCache;
    var q = /[?&]tier=(high|medium|low)/.exec(location.search);
    if (q) return (tierCache = q[1]);
    var hc = navigator.hardwareConcurrency || 8, dpr = window.devicePixelRatio || 1, mob = ME.mobile();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var low = reduce || hc <= 2 || (mob && hc <= 4) || !hasGL();
    var medium = !low && (hc <= 4 || mob || dpr >= 3);
    return (tierCache = low ? 'low' : medium ? 'medium' : 'high');
  };
  ME.pixelRatio = function (tier) { return Math.min(window.devicePixelRatio || 1, { high: 1.5, medium: 1.25, low: 1.0 }[tier || ME.tier()]); };
  ME.shadowSize = function (tier) { return { high: 2048, medium: 1024, low: 0 }[tier || ME.tier()]; };

  /* ---- renderer: ista osnova boje i tona za hero i konfigurator -------------- */
  ME.exposure = function (theme) { return theme === 'light' ? 1.15 : 1.0; };
  ME.setup = function (renderer, theme, tier) {
    var TH = three();
    tier = tier || ME.tier();
    if (TH.ColorManagement) { if ('enabled' in TH.ColorManagement) TH.ColorManagement.enabled = true; else TH.ColorManagement.legacyMode = false; }
    if ('outputColorSpace' in renderer && TH.SRGBColorSpace) renderer.outputColorSpace = TH.SRGBColorSpace;
    else renderer.outputEncoding = TH.sRGBEncoding;
    renderer.toneMapping = TH.ACESFilmicToneMapping;
    renderer.toneMappingExposure = ME.exposure(theme);
    if ('physicallyCorrectLights' in renderer) renderer.physicallyCorrectLights = true;
    else if ('useLegacyLights' in renderer) renderer.useLegacyLights = false;
    renderer.shadowMap.enabled = ME.shadowSize(tier) > 0;
    renderer.shadowMap.type = TH.PCFSoftShadowMap;
    return renderer;
  };

  /* ---- studijsko okruženje: softboks odozgo, trake levo / desno, taman pod ----
     Vraća PMREM render target (texture = scene.environment). o.theme: svetla
     tema dobija nešto svetliju sobu, da odrazi ne potamne svetle objekte.    */
  ME.studio = function (renderer, o) {
    o = o || {};
    var TH = three(), env = new TH.Scene(), light = o.theme === 'light', k = o.intensity || 1;
    function panel(w, h, x, y, z, c, gain, at) {
      var m = new TH.Mesh(new TH.PlaneGeometry(w, h), new TH.MeshBasicMaterial({ color: new TH.Color(c).multiplyScalar(gain * k), side: TH.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(at || new TH.Vector3(0, 0.6, 0)); env.add(m); return m;
    }
    var room = new TH.Mesh(new TH.BoxGeometry(14, 8, 14), new TH.MeshBasicMaterial({ color: light ? 0x8d949c : 0x454c56, side: TH.BackSide }));
    room.position.y = 3.6; env.add(room);
    var floor = new TH.Mesh(new TH.PlaneGeometry(14, 14).rotateX(-Math.PI / 2), new TH.MeshBasicMaterial({ color: light ? 0x2b3036 : 0x101317 }));
    floor.position.y = -0.2; env.add(floor);
    panel(7, 3.2, 0, 7.4, 0.4, 0xf4f7fb, 4.2);              // veliki softboks odozgo: duga čista linija svetla na metalu
    panel(6, 3, 0, 2.4, 6.8, 0xe8edf3, light ? 1.6 : 1.1);  // meko ispunsko svetlo sa strane kamere: metal ne gleda u crno
    panel(0.7, 5.5, -6.2, 2.6, 0.6, 0xdfe8f4, 2.4);         // traka levo (hladna)
    panel(0.7, 5.5, 6.2, 2.6, -0.4, 0xfff3e6, 2.0);         // traka desno (topla)
    panel(5, 0.5, 0, 0.9, -6.6, 0xffffff, 1.2);             // tanka linija pozadi: rim na zadnjim ivicama
    panel(4.2, 2.4, -2.4, 3.6, -5.0, 0xffffff, 1.5);       // ključni softboks: ogleda se u vodoravnim pločama gledanim iz hero kadra
    var pm = new TH.PMREMGenerator(renderer), rt = pm.fromScene(env, 0.035);
    pm.dispose();
    env.traverse(function (x) { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); });
    return rt;
  };

  /* ---- teksture (platno, bez slikovnih fajlova) --------------------------------- */
  var tex = null;
  function rng(seed) { var s = seed || 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function canvas(w, h, draw) {
    var TH = three(), c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    var t = new TH.CanvasTexture(c);
    t.wrapS = t.wrapT = TH.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  }
  function srgb(t) { var TH = three(); if ('colorSpace' in t && TH.SRGBColorSpace) t.colorSpace = TH.SRGBColorSpace; else t.encoding = TH.sRGBEncoding; return t; }
  // normal map iz visinske mape (Sobel), strength u pikselima
  function normalFromHeight(w, h, height, strength) {
    return canvas(w, h, function (x) {
      var img = x.createImageData(w, h), d = img.data, i, j;
      for (j = 0; j < h; j++) for (i = 0; i < w; i++) {
        var l = height((i - 1 + w) % w, j), r = height((i + 1) % w, j), u = height(i, (j - 1 + h) % h), dn = height(i, (j + 1) % h);
        var nx = (l - r) * strength, ny = (u - dn) * strength, nz = 1, len = Math.sqrt(nx * nx + ny * ny + nz * nz), k = (j * w + i) * 4;
        d[k] = 128 + nx / len * 127; d[k + 1] = 128 + ny / len * 127; d[k + 2] = 128 + nz / len * 127; d[k + 3] = 255;
      }
      x.putImageData(img, 0, 0);
    });
  }
  ME.textures = function () {
    if (tex) return tex;
    var TH = three();
    tex = {};
    // cink: kristali („cvet“) blago različitih sivih; ista mapa daje i normalu (fasete pod malim nagibom)
    var cells = [], r = rng(7), i, k, n;
    for (i = 0; i < 1100; i++) cells.push({ x: r() * 512, y: r() * 512, rad: 8 + r() * 20, n: 5 + (r() * 4 | 0), g: 186 + (r() * 26 | 0), rot: r() * 0.5, sx: (r() - 0.5) * 0.9, sy: (r() - 0.5) * 0.9, w: r() });
    function poly(x, c, scale) {
      x.beginPath();
      for (k = 0; k < c.n; k++) { var a = k / c.n * Math.PI * 2 + c.rot, rr = c.rad * (0.6 + ((k * 7919 + c.n) % 10) / 20) * (scale || 1); x[k ? 'lineTo' : 'moveTo'](c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr); }
      x.closePath();
    }
    tex.spangle = srgb(canvas(512, 512, function (x, w, h) {
      x.fillStyle = '#b8bcc0'; x.fillRect(0, 0, w, h);
      cells.forEach(function (c) { x.fillStyle = 'rgb(' + c.g + ',' + (c.g + 3) + ',' + (c.g + 7) + ')'; poly(x, c); x.fill(); });
    }));
    tex.spangleN = canvas(512, 512, function (x, w, h) {
      x.fillStyle = 'rgb(128,128,255)'; x.fillRect(0, 0, w, h);
      cells.forEach(function (c) { x.fillStyle = 'rgb(' + (128 + c.sx * 26 | 0) + ',' + (128 + c.sy * 26 | 0) + ',252)'; poly(x, c); x.fill(); });
    });
    // brušeno / valjano: fine pruge duž u; normala razvučena duž u (anizotropija)
    var lines = [], r2 = rng(31);
    for (i = 0; i < 900; i++) lines.push({ y: r2() * 64, x: r2() * 512, l: 40 + r2() * 200, g: 90 + (r2() * 90 | 0) });
    tex.brushed = canvas(512, 64, function (x, w, h) {
      x.fillStyle = '#7a7a7a'; x.fillRect(0, 0, w, h);
      lines.forEach(function (l) { x.fillStyle = 'rgba(' + l.g + ',' + l.g + ',' + l.g + ',.35)'; x.fillRect(l.x, l.y, l.l, 1); });
    });
    var hf = new Float32Array(512 * 64), r3 = rng(47);
    for (i = 0; i < 2600; i++) { var y0 = r3() * 64 | 0, x0 = r3() * 512 | 0, L = 30 + r3() * 160 | 0, hgt = (r3() - 0.5) * 0.9; for (k = 0; k < L; k++) hf[y0 * 512 + ((x0 + k) % 512)] += hgt; }
    tex.brushedN = normalFromHeight(512, 64, function (px, py) { return hf[py * 512 + px]; }, 1.6);
    tex.brushedN.repeat.set(1, 6);
    // lak (narandžina kora) na plastificiranom limu: vrlo blaga normala
    var r4 = rng(61), peel = new Float32Array(128 * 128);
    for (i = 0; i < 128 * 128; i++) peel[i] = r4();
    tex.coatN = normalFromHeight(128, 128, function (px, py) { var s = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) s += peel[((py + dy + 128) % 128) * 128 + (px + dx + 128) % 128]; return s / 9 * 0.6; }, 2.2);
    tex.coatN.repeat.set(6, 6);
    // valjaonička kora (mill scale) na debeloj ploči: tamno plavo-siva, mrlje oksida, blage ogrebotine
    var r5 = rng(77), blobs = [], scr = [];
    for (i = 0; i < 260; i++) blobs.push({ x: r5() * 1024, y: r5() * 1024, r: 12 + r5() * 70, a: 0.03 + r5() * 0.09, h: r5() });
    for (i = 0; i < 160; i++) scr.push({ x: r5() * 1024, y: r5() * 1024, l: 20 + r5() * 180, an: r5() * 6.28, a: 0.06 + r5() * 0.12 });
    tex.millscale = srgb(canvas(1024, 1024, function (x, w, h) {
      x.fillStyle = '#3a3f46'; x.fillRect(0, 0, w, h);
      blobs.forEach(function (b) {
        var g = x.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        var col = b.h < 0.3 ? '96,74,60' : b.h < 0.6 ? '58,66,80' : '38,40,44';
        g.addColorStop(0, 'rgba(' + col + ',' + b.a + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
        x.fillStyle = g; x.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      });
      x.lineWidth = 1;
      scr.forEach(function (s) { x.strokeStyle = 'rgba(150,156,164,' + s.a + ')'; x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + Math.cos(s.an) * s.l, s.y + Math.sin(s.an) * s.l); x.stroke(); });
      for (i = 0; i < 24000; i++) { var gx = r5() * w, gy = r5() * h, gv = 30 + (r5() * 50 | 0); x.fillStyle = 'rgba(' + gv + ',' + (gv + 3) + ',' + (gv + 8) + ',.35)'; x.fillRect(gx, gy, 1.5, 1.5); }
    }));
    tex.millscaleR = canvas(512, 512, function (x, w, h) {
      x.fillStyle = '#a8a8a8'; x.fillRect(0, 0, w, h);
      blobs.forEach(function (b) { var g = x.createRadialGradient(b.x / 2, b.y / 2, 0, b.x / 2, b.y / 2, b.r / 2); g.addColorStop(0, 'rgba(' + (b.h < 0.3 ? '200,200,200' : '120,120,120') + ',' + b.a * 1.6 + ')'); g.addColorStop(1, 'rgba(160,160,160,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
      scr.forEach(function (s) { x.strokeStyle = 'rgba(70,70,70,' + s.a * 2 + ')'; x.beginPath(); x.moveTo(s.x / 2, s.y / 2); x.lineTo(s.x / 2 + Math.cos(s.an) * s.l / 2, s.y / 2 + Math.sin(s.an) * s.l / 2); x.stroke(); });
    });
    tex.millscaleN = normalFromHeight(256, 256, function (px, py) { var s = 0; blobs.forEach(function (b) { var dx = px * 4 - b.x, dy = py * 4 - b.y, d2 = dx * dx + dy * dy; if (d2 < b.r * b.r) s += (1 - d2 / (b.r * b.r)) * 0.4 * (b.h < 0.3 ? 1 : -0.4); }); return s; }, 2.6);
    // drvo (podmetači ispod paketa): godovi duž u
    var r6 = rng(91), knots = [];
    for (i = 0; i < 5; i++) knots.push({ x: r6() * 512, y: r6() * 128, r: 6 + r6() * 10 });
    tex.wood = srgb(canvas(512, 128, function (x, w, h) {
      x.fillStyle = '#b48a5c'; x.fillRect(0, 0, w, h);
      for (i = 0; i < h; i += 1) { var v = 0.5 + 0.5 * Math.sin(i * 0.9 + Math.sin(i * 0.13) * 3), g = 150 - v * 50 | 0; x.fillStyle = 'rgba(' + g + ',' + (g * 0.72 | 0) + ',' + (g * 0.45 | 0) + ',.55)'; x.fillRect(0, i, w, 1); }
      for (i = 0; i < 1800; i++) { x.fillStyle = 'rgba(80,50,25,' + (0.05 + r6() * 0.15) + ')'; x.fillRect(r6() * w, r6() * h, 10 + r6() * 60, 1); }
      knots.forEach(function (kn) { var g = x.createRadialGradient(kn.x, kn.y, 0, kn.x, kn.y, kn.r); g.addColorStop(0, 'rgba(70,40,20,.9)'); g.addColorStop(0.5, 'rgba(110,70,35,.6)'); g.addColorStop(1, 'rgba(110,70,35,0)'); x.fillStyle = g; x.fillRect(kn.x - kn.r, kn.y - kn.r, kn.r * 2, kn.r * 2); });
    }));
    tex.wood.repeat.set(1, 1);
    // kontaktna senka: meka mrlja
    tex.blob = canvas(256, 256, function (x, w, h) {
      var g = x.createRadialGradient(128, 128, 4, 128, 128, 128);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.45, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    });
    tex.blob.wrapS = tex.blob.wrapT = TH.ClampToEdgeWrapping;
    // kružno brušenje (čeona strana kotura) — koristi je hero objekat coil
    tex.rings = canvas(512, 512, function (x, w, h) {
      var rr = rng(5);
      x.fillStyle = '#9aa0a6'; x.fillRect(0, 0, w, h);
      for (var q = 170; q < 256; q += 1.6) { var g = 120 + (rr() * 100 | 0); x.strokeStyle = 'rgb(' + g + ',' + g + ',' + (g + 4) + ')'; x.lineWidth = 1; x.beginPath(); x.arc(256, 256, q, 0, Math.PI * 2); x.stroke(); }
    });
    srgb(tex.rings); tex.rings.wrapS = tex.rings.wrapT = TH.ClampToEdgeWrapping;
    return tex;
  };

  /* ---- parametri materijala (jedan izvor za hero i konfigurator) ------------------ */
  ME.params = {
    galv:  { color: '#d4d8dc', metalness: 1.0, roughness: 0.35, normalScale: 0.3, envMapIntensity: 1.15 },
    ral:   { metalness: 0.2, roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.25, envMapIntensity: 1.0, normalScale: 0.12,
             metallicMetalness: 0.75, metallicRoughness: 0.42 },
    alu:   { color: '#e3e6e8', metalness: 1.0, roughness: 0.5, envMapIntensity: 1.25, normalScale: 0.12 },
    cu:    { colorNew: '#c8824e', colorOld: '#5e8f7e', roughnessNew: 0.32, roughnessOld: 0.78, metalness: 1.0, envMapIntensity: 1.4 },
    inox:  { color: '#d0d3d6', metalness: 1.0, roughness: 0.22, envMapIntensity: 1.3, normalScale: 0.45 },
    plate: { color: '#9aa0a6', metalness: 0.4, roughness: 0.7, envMapIntensity: 0.9 },
    edge:  { color: '#9aa0a6', metalness: 0.9, roughness: 0.38, envMapIntensity: 1.2 },
    film:  { clearcoat: 1.0, clearcoatRoughness: 0.06, sheen: 0.4 },
    wood:  { color: '#ffffff', roughness: 0.86, metalness: 0 }
  };
  // ACES guši slabe kanale tamnih zasićenih boja (RAL 3009 bi izašao grimizan): plastificirane boje se
  // malo povlače ka sopstvenoj sivoj pre osvetljenja, da osunčan lim padne na nijansu RAL čipa
  var GREY = null;
  ME.ralColor = function (target, hex) {
    var TH = three(); GREY = GREY || new TH.Color();
    target.set(hex);
    var l = 0.2126 * target.r + 0.7152 * target.g + 0.0722 * target.b;
    return target.lerp(GREY.setRGB(l, l, l), 0.2);
  };
  ME.patina = function (t) {           // t = 0..1 → boja i hrapavost bakra zajedno
    var TH = three(), P = ME.params.cu, c = new TH.Color(P.colorNew).lerp(new TH.Color(P.colorOld), Math.pow(t, 0.8));
    return { color: c, roughness: P.roughnessNew + (P.roughnessOld - P.roughnessNew) * t };
  };

  /* ---- fabrika materijala --------------------------------------------------------- */
  ME.mat = {
    galvanized: function (o) {
      var TH = three(), X = ME.textures(), P = ME.params.galv, m = new TH.MeshPhysicalMaterial(Object.assign({
        color: P.color, metalness: P.metalness, roughness: P.roughness, map: X.spangle, normalMap: X.spangleN, roughnessMap: X.brushed, envMapIntensity: P.envMapIntensity
      }, o || {}));
      m.normalScale.set(P.normalScale, P.normalScale);
      // blaga anizotropija: razvučena normala valjanja preko kristala cinka (clearcoat normal, vrlo slab lak)
      m.clearcoat = 0.08; m.clearcoatRoughness = 0.5; m.clearcoatNormalMap = X.brushedN; m.clearcoatNormalScale.set(0.6, 0.15);
      return m;
    },
    coated: function (hex, o) {
      var TH = three(), X = ME.textures(), P = ME.params.ral, metallic = o && o.metallic;
      var m = new TH.MeshPhysicalMaterial(Object.assign({
        metalness: metallic ? P.metallicMetalness : P.metalness, roughness: metallic ? P.metallicRoughness : P.roughness,
        clearcoat: P.clearcoat, clearcoatRoughness: P.clearcoatRoughness, normalMap: X.coatN, envMapIntensity: P.envMapIntensity
      }, o && o.three || {}));
      ME.ralColor(m.color, hex || '#383E42');
      m.normalScale.set(P.normalScale, P.normalScale);
      return m;
    },
    aluminium: function (o) {
      var TH = three(), X = ME.textures(), P = ME.params.alu, m = new TH.MeshPhysicalMaterial(Object.assign({ color: P.color, metalness: P.metalness, roughness: P.roughness, normalMap: X.brushedN, envMapIntensity: P.envMapIntensity }, o || {}));
      m.normalScale.set(P.normalScale, P.normalScale); return m;
    },
    copper: function (t, o) {
      var TH = three(), X = ME.textures(), P = ME.params.cu, pt = ME.patina(t || 0);
      var m = new TH.MeshPhysicalMaterial(Object.assign({ color: pt.color, metalness: P.metalness, roughness: pt.roughness, normalMap: X.coatN, envMapIntensity: P.envMapIntensity }, o || {}));
      m.normalScale.set(0.25, 0.25); return m;
    },
    inox: function (o) {
      var TH = three(), X = ME.textures(), P = ME.params.inox, m = new TH.MeshPhysicalMaterial(Object.assign({ color: P.color, metalness: P.metalness, roughness: P.roughness, map: X.brushed, normalMap: X.brushedN, envMapIntensity: P.envMapIntensity }, o || {}));
      m.normalScale.set(P.normalScale, P.normalScale); return m;
    },
    plate: function (o) {              // debela ploča: mat valjaonička kora sa oksidom
      var TH = three(), X = ME.textures(), P = ME.params.plate, m = new TH.MeshStandardMaterial(Object.assign({ color: P.color, metalness: P.metalness, roughness: P.roughness, map: X.millscale, roughnessMap: X.millscaleR, normalMap: X.millscaleN, envMapIntensity: P.envMapIntensity }, o || {}));
      m.normalScale.set(0.5, 0.5); return m;
    },
    edge: function (o) {               // svež rez: svetliji sirov čelik
      var TH = three(), X = ME.textures(), P = ME.params.edge, m = new TH.MeshStandardMaterial(Object.assign({ color: P.color, metalness: P.metalness, roughness: P.roughness, roughnessMap: X.brushed, envMapIntensity: P.envMapIntensity }, o || {}));
      return m;
    },
    film: function (hex, o) {          // gornja tabla paketa: zaštitna folija (visok lak, blag plavičast odsjaj)
      var m = ME.mat.coated(hex, o), P = ME.params.film;
      m.clearcoat = P.clearcoat; m.clearcoatRoughness = P.clearcoatRoughness;
      m.sheen = P.sheen; m.sheenRoughness = 0.4; m.sheenColor.setRGB(0.55, 0.66, 0.85);
      return m;
    },
    wood: function (o) {
      var TH = three(), X = ME.textures(), P = ME.params.wood;
      return new TH.MeshStandardMaterial(Object.assign({ color: P.color, map: X.wood, roughness: P.roughness, metalness: P.metalness }, o || {}));
    },
    anthracite: function (o) { return ME.mat.coated('#383E42', o); }
  };

  /* ---- kontaktna senka: meka mrlja ispod objekta / stola ------------------------------ */
  ME.contactShadow = function (w, d, opacity) {
    var TH = three(), X = ME.textures();
    var m = new TH.Mesh(new TH.PlaneGeometry(w, d), new TH.MeshBasicMaterial({ map: X.blob, color: 0x000000, transparent: true, opacity: opacity === undefined ? 0.6 : opacity, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.renderOrder = -1;
    return m;
  };

  /* ---- glavno svetlo sa mekom senkom (PCFSoft; 2048 / 1024 / bez) -------------------------- */
  ME.keyLight = function (tier, span, intensity) {
    var TH = three(), size = ME.shadowSize(tier || ME.tier()), l = new TH.DirectionalLight(0xffffff, intensity || 2.4);
    l.position.set(2, 4, 3);
    if (size) {
      l.castShadow = true;
      l.shadow.mapSize.set(size, size);
      var c = l.shadow.camera, s = span || 1.6;
      c.left = -s; c.right = s; c.top = s; c.bottom = -s; c.near = 0.5; c.far = 14;
      l.shadow.bias = -0.0004; l.shadow.normalBias = 0.02; l.shadow.radius = 4;
    }
    return l;
  };

  /* ---- šejderi bez zastoja: programi scene se prevode u delovima, po jedna grupa materijala po zadatku ----
     U r147 prevođenje svih programa (renderer.compile ili prvi crtež) je jedan sinhroni zadatak od više
     sekundi (D3D prevodi svaki teški šejder ~0,3 s). Ovde se u svakom zadatku prevodi samo jedna grupa
     objekata sa istim materijalom — ostali objekti za to vreme nose već preveden zamenski materijal, pa su
     ključevi programa isti kao pri pravom crtežu (rt: cilj u koji scena stvarno crta — kodiranje izlaza je deo ključa) — a između zadataka strana ostaje živa. done() posle svih. */
  var warmPh = null, lastInput = 0;
  // dok posetilac skroluje, klikće, kuca ili pomera pokazivač (npr. ka vezi), sledeći deo prevođenja čeka
  // (300 ms mira). Deo koji je već počeo ne može da se prekine: u r147 nema KHR_parallel_shader_compile,
  // pa jedan teški deo (2–3 programa, 0,4–0,8 s na D3D) drži klik dok ne završi — i odlazak sa strane
  // (Firefox to meri kao sporiji odlazak). Pomeranje pokazivača ka vezi zato zaustavlja nove delove.
  ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown', 'pointermove', 'focusin'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastInput = performance.now(); }, { passive: true, capture: true });
  });
  ME.warm = function (renderer, scene, camera, done, rt) {
    var TH = three(), groups = {}, keys = [], all = [], i = 0;
    warmPh = warmPh || new TH.MeshBasicMaterial();
    scene.traverse(function (o) {
      if (!o.material) return;
      var k = (Array.isArray(o.material) ? o.material : [o.material]).map(function (m) { return m.uuid; }).join();
      if (!groups[k]) { groups[k] = []; keys.push(k); }
      groups[k].push(o); all.push([o, o.material]);
    });
    function step() {
      if (renderer.getContext().isContextLost()) return;
      if (performance.now() - lastInput < 300) return setTimeout(step, 150);
      var t0 = performance.now();
      while (i < keys.length && performance.now() - t0 < 40) {   // jedna teška grupa po zadatku
        var g = groups[keys[i++]];
        all.forEach(function (e) { e[0].material = g.indexOf(e[0]) >= 0 ? e[1] : warmPh; });
        var prev = renderer.getRenderTarget(); if (rt) renderer.setRenderTarget(rt);
        try { renderer.compile(scene, camera); } catch (e) { /* prvi crtež prijavljuje grešku */ }
        if (rt) renderer.setRenderTarget(prev);
        all.forEach(function (e) { e[0].material = e[1]; });
      }
      if (i >= keys.length) return done();
      next();
    }
    // razmak posle svakog dela: frejmovi i unos zaostali tokom prevođenja stignu da se obrade (i obnove lastInput)
    function next() { setTimeout(step, 120); }
    next();
  };

  /* ---- oslobađanje pri odlasku sa strane (pagehide): GPU memorija i WebGL kontekst se vraćaju odmah,
     ne tek kad sakupljač smeća stigne (WebKit inače posle ~30 3D strana ostaje bez konteksta i memorije).
     Objekti three.js ostaju upotrebljivi — novi renderer ih ponovo šalje na GPU (povratak iz bfcache-a). */
  ME.release = function (renderer, scene) {
    if (!renderer) return;
    if (scene) scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : o.material ? [o.material] : []).forEach(function (m) {
        Object.keys(m).forEach(function (k) { if (m[k] && m[k].isTexture) m[k].dispose(); });
        m.dispose();
      });
    });
    if (scene && scene.environment && scene.environment.dispose) scene.environment.dispose();
    renderer.renderLists.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };

  ME.dispose = function () {
    if (!tex) return;
    Object.keys(tex).forEach(function (k) { tex[k].dispose(); });
    tex = null;
  };
})();
