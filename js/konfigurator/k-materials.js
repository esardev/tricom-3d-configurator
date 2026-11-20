/* ==========================================================================
   TRICOM konfigurator — k-materials.js
   One material per role, updated in place when the configuration changes,
   so geometry never has to be rebuilt for a colour change.
   Materials that depend on the configuration live in a "set" (roof, gutter,
   flashings, three wall zones, window frames); compare mode and the
   neighbouring houses simply use further sets.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var M = TK.mat = {};
  var D = TK.data, X;      // X: texture sets, filled by init()
  var ME = window.MetalEnv, MP = ME ? ME.params : null;     // material parameters shared with the hero (js/metal-env.js)

  /* The three lamp lights are always part of the light set (so no shader is recompiled when dusk or rain
     switches them on), but while a light is dark its BRDF is skipped by a branch: free by day.        */
  (function () {
    var c = THREE.ShaderChunk.lights_fragment_begin, i = c.indexOf('getPointLightInfo'), m = i > 0 ? /RE_Direct\(\s*directLight,\s*geometry,\s*material,\s*reflectedLight\s*\);/.exec(c.slice(i)) : null;
    if (m) THREE.ShaderChunk.lights_fragment_begin = c.slice(0, i + m.index) + 'if ( directLight.visible ) { ' + m[0] + ' }' + c.slice(i + m.index + m[0].length);
  })();

  // shader uniforms shared by every roof material (rain)
  M.U = { uWet: { value: 0 }, uTime: { value: 0 }, zero: { value: 0 } };
  M.US = { value: 0 };          // snow amount, shared by every material that can carry snow
  M.wet = 0;

  /* ---- one shader program for (almost) every plain surface -----------------------------
     Three.js compiles a separate program for every combination of maps and options, and on
     Windows each one costs 0.1–0.25 s on first use. All plain MeshStandardMaterials are
     therefore given the same feature set: colour map, normal map and roughness map are
     always present (1 px dummies where a surface has none), shadows are cast double-sided,
     and every one carries the snow term (upward faces turn white with M.US).            */
  var dummies = {};
  function px(r, g, b, srgb, like) {
    var key = [r, g, b, like ? like.repeat.x.toFixed(4) + '/' + like.repeat.y.toFixed(4) + '/' + like.rotation : ''].join(',');
    if (dummies[key]) return dummies[key];
    var c = document.createElement('canvas'); c.width = c.height = 2;
    var x = c.getContext('2d'); x.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; x.fillRect(0, 0, 2, 2);
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (srgb) t.encoding = THREE.sRGBEncoding;
    if (like) { t.repeat.copy(like.repeat); t.rotation = like.rotation; }      // the first map sets the UV transform for all of them
    return (dummies[key] = t);
  }
  M.white = function (like) { return px(255, 255, 255, true, like); };
  M.flat = function () { return px(128, 128, 255, false); };
  M.orm = function () { return px(255, 255, 255, false); };
  M.snowPatch = function (m) {
    m.onBeforeCompile = function (sh) {
      sh.uniforms.uSnow = M.US;
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uSnow;')
        .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n if (uSnow > 0.001) { float tkUp = inverseTransformDirection(normal, viewMatrix).y; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.89, 0.94), uSnow * smoothstep(0.25, 0.8, tkUp)); }');
    };
    m.customProgramCacheKey = function () { return 'tk-std'; };
    return m;
  };
  /* ACES crushes the weak channels of dark, saturated paints (RAL 3009 would come out crimson).
     Coated colours are therefore pulled a little towards their own grey before lighting, so the
     sun-lit sheet lands on the hue of the RAL chip.                                            */
  var GREY = new THREE.Color();
  M.ralColor = function (target, hex) {
    target.set(hex);
    var l = 0.2126 * target.r + 0.7152 * target.g + 0.0722 * target.b;
    return target.lerp(GREY.setRGB(l, l, l), 0.2);
  };
  M.fill = function (m) {            // complete the feature set after maps were (re)assigned
    if (!m.normalMap) { m.normalMap = M.flat(); }
    if (!m.map) m.map = M.white(m.normalMap !== M.flat() ? m.normalMap : null);
    if (!m.roughnessMap) m.roughnessMap = M.orm();
    return m;
  };
  M.std = function (o) {
    var m = M.snowPatch(new THREE.MeshStandardMaterial(o));
    m.shadowSide = THREE.DoubleSide;
    return M.fill(m);
  };

  M.init = function () {
    var T = TK.tex;
    X = M.tx = {
      plaster: T.plaster(), zinc: T.zinc(), brushed: T.brushed(), coat: T.coat(),
      lamV: T.lamperija(), wood: T.wood(), curtain: T.curtain(), concrete: T.concrete(), gravel: T.gravel()
    };
    // horizontal lamperija = same board rotated by 90°
    X.lamH = { map: X.lamV.map.clone(), normalMap: X.lamV.normalMap.clone() };
    [X.lamH.map, X.lamH.normalMap].forEach(function (t) { t.rotation = Math.PI / 2; t.needsUpdate = true; });
    X.copper = {};          // per slot (roof / gutter / thumbnail) because patina differs
    var brick = null;       // the brick set is only drawn when a clinker facade is first used
    Object.defineProperty(X, 'brick', { get: function () { return brick || (brick = T.brick()); } });

    M.set0 = M.makeSet();
    M.sets = [M.set0, null];

    M.sokl = M.std({ color: 0x8d8e8b, roughness: 0.95, map: X.plaster.map, normalMap: X.plaster.normalMap });
    M.sokl.normalScale.set(0.5, 0.5);
    M.fascia = M.std({ color: 0xe9e8e2, roughness: 0.75, side: THREE.DoubleSide });
    M.chimney = M.std({ color: 0xd2cfc7, roughness: 0.95, map: X.plaster.map, normalMap: X.plaster.normalMap });
    M.crown = M.std({ color: 0x77797b, roughness: 0.9 });
    M.foam = M.std({ color: 0x6a6d70, roughness: 1, side: THREE.DoubleSide });
    M.glass = new THREE.MeshPhysicalMaterial({
      color: 0x9fb0b8, roughness: 0.03, metalness: 0.9, transparent: true, opacity: 0.4,
      envMapIntensity: 1.25, depthWrite: false
    });
    M.interior = new THREE.MeshBasicMaterial({ color: 0x5c5650, side: THREE.BackSide, vertexColors: true });
    M.curtain = new THREE.MeshStandardMaterial({
      color: 0xf4f1ea, map: X.curtain, roughness: 1, transparent: true, opacity: 0.93, side: THREE.DoubleSide,
      emissive: 0xffc98a, emissiveIntensity: 0
    });
    M.terrace = M.std({ color: 0xbdbdb9, roughness: 0.9, map: X.concrete.map, normalMap: X.concrete.normalMap });
    M.gravel = M.std({ color: 0xffffff, roughness: 1, map: X.gravel.map, normalMap: X.gravel.normalMap });
    M.ao = new THREE.MeshBasicMaterial({ color: 0x000000, map: T.aoStrip(), transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
    M.stone = M.std({ color: 0x9a9a96, roughness: 0.95 });
    // weathering: rain streaks under the sills, splash dirt above the plinth
    var dirt = { color: 0x241f18, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 };
    M.dirtSill = new THREE.MeshBasicMaterial(Object.assign({ map: T.streaks(), opacity: 0.2 }, dirt));
    M.dirtBase = new THREE.MeshBasicMaterial(Object.assign({ map: T.splash(), opacity: 0.2 }, dirt));
    // roofing screws: bright head on a dark EPDM washer (vertex colours)
    M.screw = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.85, roughness: 0.32, envMapIntensity: 1.4 });
    M.weathered = [M.sokl, M.chimney, M.crown, M.terrace, M.gravel, M.stone, M.fascia];
    M.weathered.forEach(keepBase);
  };
  function keepBase(m) { m.userData.base = { c: m.color.clone(), r: m.roughness, e: m.envMapIntensity }; }

  M.makeSet = function () {
    return {
      roof: M.metal(true), gutter: M.metal(false), flash: M.metal(false), sheet: M.metal(true),
      wall: [M.wallMat(), M.wallMat(), M.wallMat()],
      frame: M.std({ color: 0x333b40, roughness: 0.5 })
    };
  };
  M.disposeSet = function (set) {
    [set.roof, set.gutter, set.flash, set.frame, set.sheet].concat(set.wall).forEach(function (m) { if (m) m.dispose(); });
  };

  /* ---- sheet metal ------------------------------------------------------
     The roof variant reads two per-sheet values from the vertex colour
     (r = tint, g = roughness factor) and carries the rain look: the whole
     sheet gets glossier and rivulets run down the slope (uv.y points up it). */
  var ROOF_GLSL = [
    'varying vec2 vTkUv; uniform float uWet; uniform float uTime; uniform float uSnowN;',
    'float tkHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float tkNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(tkHash(i), tkHash(i+vec2(1.0,0.0)), f.x), mix(tkHash(i+vec2(0.0,1.0)), tkHash(i+vec2(1.0,1.0)), f.x), f.y); }'
  ].join('\n');
  function roofPatch(sh) {
    sh.uniforms.uWet = M.U.uWet; sh.uniforms.uTime = M.U.uTime;
    sh.uniforms.uSnowN = (this && this.userData && this.userData.uSnowN) || M.U.zero;     // neighbours: snow as a white film
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vTkUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vTkUv = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + ROOF_GLSL)
      .replace('#include <color_fragment>', 'diffuseColor.rgb *= vColor.r;')
      .replace('#include <roughnessmap_fragment>', [
        '#include <roughnessmap_fragment>',
        ' roughnessFactor *= vColor.g;',
        ' if (uWet > 0.001) {',
        '   float tkA = tkNoise(vec2(vTkUv.x * 46.0, vTkUv.y * 1.9 + uTime * 1.7));',
        '   float tkB = tkNoise(vec2(vTkUv.x * 17.0 + 3.7, vTkUv.y * 0.8 + uTime * 0.9));',
        '   float tkFlow = smoothstep(0.52, 0.86, tkA * 0.62 + tkB * 0.38) * uWet;',
        '   roughnessFactor = mix(roughnessFactor, 0.07, clamp(uWet * 0.5 + tkFlow * 0.45, 0.0, 1.0));',
        '   diffuseColor.rgb *= 1.0 - 0.10 * uWet + 0.16 * tkFlow;',
        ' }'
      ].join('\n'))
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n if (uSnowN > 0.001) { float tkUp = inverseTransformDirection(normal, viewMatrix).y; float tkS = uSnowN * smoothstep(0.25, 0.8, tkUp); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.89, 0.94), tkS); metalnessFactor *= 1.0 - tkS; roughnessFactor = mix(roughnessFactor, 0.9, tkS); }');
  }
  M.metal = function (roof) {
    var m = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide, vertexColors: !!roof, metalness: 1, roughness: 0.4 });
    m.shadowSide = THREE.DoubleSide;
    if (roof) { m.onBeforeCompile = roofPatch; m.customProgramCacheKey = function () { return 'tk-roof'; }; }
    return m;
  };

  // spec: { mat: cink|plast|bakar|alu|inox, ral: '7016', patina: 0..100, age: 0..100 }, slot: copper texture slot name
  // PBR values come from js/catalog.js (materials[].pbr), shared with js/hero3d.js
  M.applyFinish = function (m, spec, slot) {
    var P = D.pbr(spec.mat in { plast: 1, bakar: 1, alu: 1, inox: 1 } ? spec.mat : 'cink');
    m.map = null; m.normalMap = null; m.roughnessMap = null; m.metalnessMap = null;
    m.clearcoat = 0; m.clearcoatRoughness = 0.3; m.envMapIntensity = 1;
    m.sheen = 1; m.sheenRoughness = 0.6; m.sheenColor.setRGB(0, 0, 0);       // sheen stays compiled in for every finish; only zinc uses it
    switch (spec.mat) {
      case 'plast':
        var r = D.ralByCode[spec.ral] || D.ralByCode['7016'];
        var metallic = !!r.metallic;
        M.ralColor(m.color, r.hex);
        m.metalness = metallic ? P.metallicColorMetalness : P.metalness; m.roughness = metallic ? P.metallicColorRoughness : (MP ? MP.ral.roughness : P.roughness);
        m.clearcoat = MP ? MP.ral.clearcoat : P.clearcoat; m.clearcoatRoughness = MP ? MP.ral.clearcoatRoughness : P.clearcoatRoughness; m.envMapIntensity = P.envMapIntensity;
        m.normalMap = X.coat.normalMap; m.normalScale.set(0.18, 0.18);
        break;
      case 'bakar':
        var cu = X.copper[slot] || (X.copper[slot] = TK.tex.copper());
        if (cu.t !== (spec.patina || 0)) { cu.t = spec.patina || 0; cu.paint(cu.t / 100); }
        m.color.set(0xffffff);
        m.map = cu.map; m.roughnessMap = cu.ormMap; m.metalnessMap = cu.ormMap;
        m.metalness = P.metalness; m.roughness = P.roughness; m.envMapIntensity = P.envMapIntensity;
        if (ME) {              // the patina slider drives colour and roughness together (shared curve)
          var pt = ME.patina((spec.patina || 0) / 100);
          m.color.lerp(pt.color, 0.3); m.roughness = pt.roughness * 1.15;
        }
        m.normalMap = X.coat.normalMap; m.normalScale.set(0.25, 0.25);
        break;
      case 'alu':
        m.color.set(P.color); m.metalness = P.metalness; m.roughness = P.roughness; m.envMapIntensity = P.envMapIntensity;
        m.normalMap = X.brushed.normalMap; m.normalScale.set(0.12, 0.12);
        break;
      case 'inox':
        m.color.set(P.color); m.metalness = P.metalness; m.roughness = P.roughness; m.envMapIntensity = P.envMapIntensity;
        m.map = X.brushed.map;
        m.normalMap = X.brushed.normalMap; m.normalScale.set(0.45, 0.45);
        break;
      default:              // cink — galvanised, spangle pattern carried by all three maps; "age" dulls it to weathered grey
        var a = Math.min(1, Math.max(0, (spec.age || 0) / 100)), k = function (x, y) { return x + (y - x) * a; };
        m.color.setRGB(k(0.80, 0.33), k(0.80, 0.345), k(0.79, 0.35));
        m.metalness = k(P.metalness, P.agedMetalness);
        m.roughness = k(MP ? MP.galv.roughness : P.roughness, P.agedRoughness);       // x roughnessMap (avg .86): 0.30 new, 0.67 aged
        m.envMapIntensity = k(P.envMapIntensity, P.agedEnvMapIntensity);
        m.map = X.zinc.map; m.roughnessMap = X.zinc.roughnessMap;
        m.normalMap = X.zinc.normalMap; m.normalScale.set(k(0.4, 0.14), k(0.4, 0.14));
        // the spangle crystals scatter direct sun widely: a soft, neutral sheen lobe on top of the metal
        m.sheenColor.setRGB(k(0.46, 0.2), k(0.47, 0.2), k(0.49, 0.2));
    }
    if (!m.map) m.map = M.white(m.normalMap);
    if (!m.roughnessMap) m.roughnessMap = M.orm();
    if (!m.metalnessMap) m.metalnessMap = M.orm();
    m.userData.base = { r: m.roughness, e: m.envMapIntensity };
    m.needsUpdate = true;
  };

  M.finishLabel = function (spec) {
    var f = D.find(D.finishes, spec.mat) || D.finishes[0];
    if (spec.mat === 'plast') { var r = D.ralByCode[spec.ral]; return TK.t('k.fin.plast', { c: r.c, n: r.n }); }
    if (spec.mat === 'bakar') return spec.patina > 0 ? TK.t('k.fin.copperPatina', { p: spec.patina }) : TK.t('k.fin.copperNew');
    if (spec.mat === 'cink' && spec.age > 0) return TK.t('k.fin.zincAged', { p: spec.age });
    return f.short.toLowerCase();
  };

  /* ---- facade ------------------------------------------------------------- */
  M.wallMat = function () { return M.std({ roughness: 0.95, metalness: 0 }); };

  M.parseFacade = function (str) {
    var p = String(str || '').split('.'), type = p[0], col = (p[1] || '').replace(/^ral/, '');
    if (type === 'lamperija') type = 'lamperijav';
    var def = D.find(D.facades, type);
    if (!def) { def = D.facades[0]; type = def.id; col = ''; }
    if (def.ral) { if (!D.ralByCode[col]) col = '7016'; } else if (!D.find(def.colors, col)) col = def.colors[0].id;
    return { type: type, color: col, def: def };
  };

  M.applyFacade = function (m, str) {
    var f = M.parseFacade(str);
    m.map = null; m.normalMap = null; m.roughnessMap = null; m.metalness = 0; m.roughness = 0.95;
    if (f.type === 'malter') {
      m.color.set(D.find(f.def.colors, f.color).hex);
      m.map = X.plaster.map; m.normalMap = X.plaster.normalMap; m.normalScale.set(0.55, 0.55);
      m.roughnessMap = X.plaster.roughnessMap; m.roughness = 0.97;
    } else if (f.type === 'klinker') {
      m.color.set(0xffffff);
      m.map = X.brick.paint(D.find(f.def.colors, f.color).hex);
      m.normalMap = X.brick.normalMap; m.normalScale.set(1.1, 1.1); m.roughness = 0.9;
    } else {
      var set = f.type === 'lamperijah' ? X.lamH : X.lamV, metallic = f.color === '9006' || f.color === '9007';
      M.ralColor(m.color, D.ralByCode[f.color].hex);
      m.map = set.map; m.normalMap = set.normalMap; m.normalScale.set(1, 1);
      m.metalness = metallic ? 0.8 : 0.12; m.roughness = metallic ? 0.4 : 0.55;
    }
    M.fill(m);
    m.userData.base = { c: m.color.clone(), r: m.roughness };
    m.needsUpdate = true;
  };

  M.facadeLabel = function (str) {
    var f = M.parseFacade(str);
    if (f.def.ral) return f.def.name.toLowerCase() + ', RAL ' + f.color + ' ' + D.ralByCode[f.color].n;      // nazivi već na jeziku strane (k-data.js)
    return f.def.name.toLowerCase() + ', ' + D.find(f.def.colors, f.color).n;
  };

  /* ---- window frames -------------------------------------------------------- */
  M.applyFrame = function (m, id) {
    var f = D.find(D.frames, id) || D.frames[5];
    m.color.set(f.hex); m.metalness = f.metal || 0; m.roughness = f.metal ? 0.38 : 0.5;
    m.map = f.wood ? X.wood.map : M.white();
    m.userData.base = { r: m.roughness };
    m.needsUpdate = true;
  };

  /* ---- a whole configuration onto a material set ------------------------------ */
  M.roofSpec = function (s) { return { mat: s.mat, ral: s.boja, patina: s.patina, age: s.starenje }; };
  M.gutterSpec = function (s) { return s.uskladi ? M.roofSpec(s) : { mat: s.omat, ral: s.oboja, patina: s.opatina, age: s.starenje }; };
  M.applyState = function (set, s, slot) {
    slot = slot || '';
    M.applyFinish(set.roof, M.roofSpec(s), 'roof' + slot);
    M.applyFinish(set.gutter, M.gutterSpec(s), (s.uskladi ? 'roof' : 'gutter') + slot);
    M.applyFinish(set.flash, M.gutterSpec(s), (s.uskladi ? 'roof' : 'gutter') + slot);
    M.applyFacade(set.wall[0], s.fasada);
    M.applyFacade(set.wall[1], s.zona1 || s.fasada);
    M.applyFacade(set.wall[2], s.zona2 || s.fasada);
    M.applyFrame(set.frame, s.prozori);
    if (set.sheet) M.applyFinish(set.sheet, { mat: 'plast', ral: D.ralByCode[s.hzb] ? s.hzb : '9002' }, 'sheet' + slot);     // wall sheeting of a hall
    M.wetSet(set);
  };

  /* ---- wet look: darker, glossier surfaces while it rains (w = 0..1) ------------- */
  M.wetSet = function (set) {
    var w = M.wet;
    [set.gutter, set.flash, set.frame].forEach(function (m) { var b = m.userData.base; if (b) m.roughness = b.r * (1 - 0.3 * w); });
    set.wall.forEach(function (m) { var b = m.userData.base; if (!b) return; m.color.copy(b.c).multiplyScalar(1 - 0.16 * w); m.roughness = b.r * (1 - 0.3 * w); });
  };
  M.setWet = function (w) {
    M.wet = w; M.U.uWet.value = w;
    (M.sets || []).forEach(function (s) { if (s) M.wetSet(s); });
    M.weathered.forEach(function (m) {
      var b = m.userData.base, flat = m === M.terrace || m === M.stone;
      m.color.copy(b.c).multiplyScalar(1 - (flat ? 0.38 : 0.2) * w);
      m.roughness = b.r * (1 - (flat ? 0.78 : 0.4) * w);
      m.envMapIntensity = b.e + (flat ? 0.6 : 0) * w;
    });
  };
})();
