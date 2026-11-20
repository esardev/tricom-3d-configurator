/* ==========================================================================
   TRICOM konfigurator — k-env.js
   Sky dome (procedural gradient, sun disc, soft clouds, stars) plus drifting
   cloud billboards, sun / moon light with shadows, image-based lighting
   captured from the real scene (sky + lawn + trees + neighbours), the plot
   (lawn with 3D blades, hedges, fence, driveway, path, street), neighbours
   built by the house generator, horizon backdrop, night lamps, and the
   weather hooks (overcast for rain, cold low light and snow for winter).
   The scene is always photographic: outdoors a treeline ring stands at the
   horizon, a concrete apron runs round the house (a paved yard with
   containers and pallets round a hall), and "studio" is a dark cyclorama
   (dome + floor) lit by the shared studio map (js/metal-env.js) — never the
   page background. Quality tiers (quality.tier): medium drops the cloud
   sprites and thins the treeline, low uses a flat sky, no blades, no shadows.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var E = TK.env = {};
  var V3 = THREE.Vector3, D = TK.data, RAD = Math.PI / 180;
  var AZ0 = -75 * RAD;        // scene azimuth of true south: the afternoon sun stands front-right of the house
  var renderer, scene, pmrem, envRT, sky, skyScene, skyRT, skyCam, envCam, envCube, sunDir = new V3(0, 1, 0), sun, hemi, fog, U;
  var root, yard, kindGroups = {}, kindBuilt = {}, lamps = [], doorLight, contact, contactT, backdrop, farGround, lawnMat, q;
  var clouds = [], blades = null, bladeU = null, extras = false, yardOn = false;
  var cur = { hour: 15, datum: 'mar', kind: 'predgradje' }, lastBake = -99;
  E.weather = { rain: 0, snow: 0 };
  E.US = TK.mat.US;             // snow amount, shared by every material that can carry snow
  E.captureHide = [];           // objects left out of the environment capture (the configured house, effects)
  E.stamp = 0;                  // bumped whenever the environment map changes
  E.AZ0 = AZ0;
  // Studio: a dark cyclorama (dome + floor) in the scene, lit by the shared studio map, so colours read the same
  // in the light and the dark theme. The outdoor surroundings (default: predgrađe) are built in stages after boot.
  var studioOn = false, ground = null, lawn = null, cyc = null, treeline = null, hallYard = null, apron = null;
  var ME = window.MetalEnv;
  E.isStudio = function () { return studioOn; };

  function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function mix3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function noAO(o) { o.traverse(function (c) { c.layers.set(1); }); return o; }
  E.noAO = noAO;

  var STD = function (o) { return TK.mat.std(o); };

  var SKY_FRAG = [
    'uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGround; uniform vec3 uSunDir; uniform vec3 uSunCol;',
    'uniform vec3 uCloudCol; uniform vec3 uCloudShade; uniform float uCloud; uniform float uStars; uniform float uDisc; uniform float uGain; uniform vec3 uWarm; uniform float uGold;',
    'varying vec3 vDir;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }',
    'float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a*noise(p); p = p*2.03 + vec2(17.0, 9.0); a *= 0.5; } return s; }',
    'void main(){',
    '  vec3 d = normalize(vDir);',
    '  float h = clamp(d.y, 0.0, 1.0);',
    '  vec3 col = mix(uHorizon, uZenith, pow(h, 0.48));',
    '  float az = pow(max(dot(normalize(d.xz + vec2(1e-5)), normalize(uSunDir.xz + vec2(1e-5))), 0.0), 1.5);',
    '  col = mix(col, uWarm, uGold * (0.25 + 0.75 * az) * pow(1.0 - h, 3.0));',
    '  float sd = max(dot(d, uSunDir), 0.0);',
    '  col += uSunCol * (pow(sd, 3000.0) * uDisc + pow(sd, 220.0) * 0.5 + pow(sd, 10.0) * 0.12);',
    '  if (d.y > 0.0) {',
    '    vec2 p = d.xz / (d.y + 0.16) * 1.35;',
    '    float n = fbm(p + vec2(3.1, 1.7));',
    '    float c = smoothstep(1.0 - uCloud, 1.0 - uCloud + 0.26, n);',
    '    float shade = smoothstep(0.3, 0.75, fbm(p * 2.3 + 7.0));',
    '    vec3 cc = mix(uCloudCol, uCloudShade, shade * 0.55) + uSunCol * pow(sd, 6.0) * 0.08;',
    '    col = mix(col, cc, c * smoothstep(0.015, 0.22, d.y) * 0.92);',
    '    if (uStars > 0.0) { vec2 sp = d.xz / (d.y + 0.35) * 260.0; col += vec3(step(0.9986, hash(floor(sp)))) * uStars * (1.0 - c) * smoothstep(0.04, 0.4, d.y); }',
    '  } else {',
    '    col = mix(uHorizon, uGround, smoothstep(0.0, -0.06, d.y));',
    '  }',
    '  gl_FragColor = vec4(col * uGain, 1.0);',
    '  #include <tonemapping_fragment>',
    '  #include <encodings_fragment>',
    '}'
  ].join('\n');

  E.init = function (r, s, quality) {
    renderer = r; scene = s; q = quality;
    var T = TK.tex;
    U = {
      uZenith: { value: new V3() }, uHorizon: { value: new V3() }, uGround: { value: new V3() }, uSunDir: { value: new V3(0, 1, 0) },
      uSunCol: { value: new V3() }, uCloudCol: { value: new V3() }, uCloudShade: { value: new V3() }, uCloud: { value: 0.52 }, uStars: { value: 0 }, uDisc: { value: 14 }, uGain: { value: 1 }, uWarm: { value: new V3(1.0, 0.55, 0.28) }, uGold: { value: 0 }
    };
    var skyMat = new THREE.ShaderMaterial({
      uniforms: U, side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
      vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: SKY_FRAG
    });
    // The dome lives in its own scene. It is rendered into a cube map on every time change (used as the
    // background); the main scene never pays for the cloud noise per frame.
    sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), skyMat);
    skyScene = new THREE.Scene();
    skyScene.add(sky);
    skyRT = new THREE.WebGLCubeRenderTarget(q.shadow >= 4096 ? 1024 : 512, { type: THREE.HalfFloatType, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    skyCam = new THREE.CubeCamera(1, 4000, skyRT);
    scene.background = skyRT.texture;
    pmrem = new THREE.PMREMGenerator(renderer);
    // Reflections and ambient light come from a snapshot of the real surroundings: sky, lawn, trees, neighbours.
    envCube = new THREE.WebGLCubeRenderTarget(256,      // same size as PMREM's own captures: a different size would recompile every lit material
      { type: THREE.HalfFloatType, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    envCam = new THREE.CubeCamera(0.3, 3000, envCube);
    envCam.children.forEach(function (c) { c.layers.enable(1); });

    sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.castShadow = q.shadow > 0;
    if (q.shadow) sun.shadow.mapSize.set(q.shadow, q.shadow);
    sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.016;
    scene.add(sun); scene.add(sun.target);
    hemi = new THREE.HemisphereLight(0xbcd2ff, 0x4a5a33, 0.3);
    scene.add(hemi);
    [sun, hemi].forEach(function (l) { l.layers.enable(2); });        // layer 2: the detail inspector's highlight pass
    fog = scene.fog = new THREE.Fog(0xbfd4ee, 140, 900);

    root = new THREE.Group(); scene.add(root);

    /* ---- ground: two turf textures blended by a noise mask, large-scale tone, snow -------- */
    var gx = T.grass();
    E.grassTex = gx;
    lawnMat = new THREE.MeshStandardMaterial({ map: gx.map, normalMap: gx.normalMap, roughness: 1, color: 0xffffff });
    lawnMat.normalScale.set(1.6, 1.6);
    lawnMat.onBeforeCompile = function (sh) {
      sh.uniforms.macroMap = { value: gx.macro }; sh.uniforms.map2 = { value: gx.map2 }; sh.uniforms.uSnow = E.US;
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <map_pars_fragment>', '#include <map_pars_fragment>\nuniform sampler2D macroMap; uniform sampler2D map2; uniform float uSnow;')
        .replace('#include <map_fragment>', [
          '#include <map_fragment>',
          ' float tkA = texture2D(macroMap, vUv * 0.047).r, tkB = texture2D(macroMap, vUv * 0.31 + 0.37).r;',
          ' float tkMix = smoothstep(0.40, 0.64, texture2D(macroMap, vUv * 0.117 + 0.19).r);',
          ' diffuseColor.rgb = mix(diffuseColor.rgb, texture2D(map2, vUv * 1.368).rgb, tkMix * 0.8);',
          ' diffuseColor.rgb *= mix(vec3(0.70, 0.74, 0.62), vec3(1.22, 1.18, 1.12), tkA) * mix(0.82, 1.14, tkB);',
          ' diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.84, 0.87, 0.93) * (0.93 + 0.07 * tkB), uSnow);'
        ].join('\n'));
    };
    var lawnG = new THREE.PlaneGeometry(150, 150); lawnG.rotateX(-Math.PI / 2);
    var lp = lawnG.attributes.position, lu = lawnG.attributes.uv;
    for (var i = 0; i < lp.count; i++) lu.setXY(i, lp.getX(i), lp.getZ(i));
    lawn = new THREE.Mesh(lawnG, lawnMat); lawn.receiveShadow = true; root.add(lawn);
    ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.22, depthWrite: false }));
    ground.receiveShadow = true; ground.position.y = 0.002; ground.visible = false; ground.renderOrder = 0;
    root.add(noAO(ground));

    var farMat = STD({ color: 0x5f7a3c, roughness: 1 });
    farGround = new THREE.Mesh(new THREE.CircleGeometry(900, 48).rotateX(-Math.PI / 2), farMat);
    farGround.position.y = -0.04; root.add(farGround);

    yard = new THREE.Group(); yard.visible = false; root.add(yard);       // shown by the second boot stage

    /* ---- horizon backdrop ---------------------------------------------------- */
    E.backTex = {};          // one horizon strip per environment, drawn when first selected
    backdrop = new THREE.Mesh(new THREE.CylinderGeometry(640, 640, 82, 64, 1, true),
      new THREE.MeshBasicMaterial({ transparent: true, side: THREE.BackSide, fog: false, depthWrite: false }));
    backdrop.position.y = 82 / 2 - 1.5; backdrop.renderOrder = -5;
    root.add(noAO(backdrop));

    /* ---- contact shadows (house, terrace) + night lamps -------------------------- */
    function contactMesh(op) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x000000, map: E.contactTex, transparent: true, opacity: op, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      m.renderOrder = 1; root.add(noAO(m)); return m;
    }
    E.contactTex = T.contact(0.74, 0.74);
    contact = contactMesh(0.5); contactT = contactMesh(0.3);

    var glowTex = T.glow();
    var postMat = STD({ color: 0x2a2d31, roughness: 0.5, metalness: 0.6 });
    E.lampHead = STD({ color: 0xfff2dc, emissive: 0xffc27a, emissiveIntensity: 0, roughness: 0.4 });
    for (i = 0; i < 2; i++) {
      var g = new THREE.Group();
      var post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.62, 12), postMat); post.position.y = 0.31; post.castShadow = true;
      var head = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.12, 12), E.lampHead); head.position.y = 0.68;
      var capG = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), postMat); capG.position.y = 0.75;
      var pl = new THREE.PointLight(0xffb468, 0, 11, 2); pl.position.y = 0.7; pl.layers.enable(2);
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      sp.scale.set(1.3, 1.3, 1); sp.position.y = 0.68; sp.layers.set(1);
      g.add(post, head, capG, pl, sp);
      root.add(g);
      lamps.push({ g: g, light: pl, glow: sp });
    }
    doorLight = new THREE.PointLight(0xffc48a, 0, 9, 2); doorLight.layers.enable(2);
    root.add(doorLight);

    ['predgradje', 'ravnica', 'brdovito'].forEach(function (k) { kindGroups[k] = new THREE.Group(); kindGroups[k].visible = false; root.add(kindGroups[k]); });
  };

  /* ---- studio: dark cyclorama in the scene (dome with a vertical gradient + floor that takes the shadow) ---- */
  function cycInit() {
    if (cyc) return cyc;
    var c = document.createElement('canvas'); c.width = 4; c.height = 256;
    var x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#2a3038'); g.addColorStop(0.42, '#1a1e25'); g.addColorStop(0.5, '#14171d'); g.addColorStop(1, '#0b0d11');
    x.fillStyle = g; x.fillRect(0, 0, 4, 256);
    var tex = new THREE.CanvasTexture(c);
    if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace; else tex.encoding = THREE.sRGBEncoding;
    var dome = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, depthWrite: false }));
    dome.renderOrder = -10;
    var floor = new THREE.Mesh(new THREE.CircleGeometry(600, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.58, metalness: 0.12 }));
    floor.position.y = -0.03; floor.receiveShadow = true;
    cyc = new THREE.Group(); cyc.add(dome, floor); cyc.visible = false;
    root.add(noAO(cyc));
    return cyc;
  }

  /* ---- treeline: instanced cross-billboards on a ring at the horizon (density by tier) ------------------ */
  function buildTreeline(count) {
    if (treeline || !count) return;
    plotInit();
    var parts = [], a, b;
    for (b = 0; b < 2; b++) { var pg = new THREE.PlaneGeometry(0.8, 1); pg.translate(0, 0.5, 0); pg.rotateY(b * Math.PI / 2); parts.push(pg); }
    var geo = TK.geo.merge(parts), nrm = geo.attributes.normal;
    for (a = 0; a < nrm.count; a++) nrm.setXYZ(a, 0, 1, 0);
    treeline = new THREE.Group();
    var rnd = TK.tex.rng(911), per = Math.ceil(count / E.treeMats.length);
    E.treeMats.forEach(function (tm, k) {
      var im = new THREE.InstancedMesh(geo, tm.side, per), m4 = new THREE.Matrix4(), i;
      im.customDepthMaterial = tm.side.userData.depth;
      for (i = 0; i < per; i++) {
        var an = rnd() * Math.PI * 2, r = 300 + rnd() * 140, h = (tm.kind === 'poplar' ? 15 : 10) + rnd() * 7;
        m4.makeRotationY(rnd() * Math.PI).setPosition(Math.sin(an) * r, -0.2, -Math.cos(an) * r);
        m4.scale(new V3(h, h, h));
        im.setMatrixAt(i, m4);
      }
      im.instanceMatrix.needsUpdate = true;
      im.castShadow = false; im.receiveShadow = false; im.frustumCulled = false; im.layers.set(1);
      treeline.add(im);
    });
    root.add(treeline);
  }

  /* ---- hall: paved yard with two containers and pallet stacks instead of hedges and a garden ------------ */
  function buildHallYard(house) {
    plotInit();
    if (hallYard) { while (hallYard.children.length) { var o = hallYard.children.pop(); if (o.geometry) o.geometry.dispose(); } }
    else { hallYard = new THREE.Group(); root.add(hallYard); }
    var d = house.dims, hx = d.L / 2, hz = d.W / 2, rnd = TK.tex.rng(313);
    slabQuad(hallYard, d.cx - hx - 9, d.cz - hz - 6, d.cx + hx + 9, d.cz + hz + 14, 0.014, E.mats.drive);      // concrete apron
    // containers: 20' boxes in two coated colours, corrugated by the coat normal map
    var cm = [ME ? ME.mat.coated('#2f4d8a') : STD({ color: 0x2f4d8a }), ME ? ME.mat.coated('#8d4931') : STD({ color: 0x8d4931 })], cg = new THREE.BoxGeometry(6.06, 2.59, 2.44);
    [[d.cx + hx + 4.6, d.cz - hz + 3.5, 0.08], [d.cx - hx - 5.2, d.cz + hz - 2.0, -0.12]].forEach(function (p, i) {
      var c = new THREE.Mesh(cg, cm[i]); c.position.set(p[0], 1.295 + 0.014, p[1]); c.rotation.y = p[2]; c.castShadow = true; c.receiveShadow = true; hallYard.add(c);
      var ct = new THREE.Mesh(contact.geometry, contact.material); ct.scale.set(7.2 / 0.74, 1, 3.6 / 0.74); ct.position.set(p[0], 0.03, p[1]); ct.rotation.y = p[2]; ct.renderOrder = 1; hallYard.add(noAO(ct));
    });
    // pallet stacks: boards of a euro pallet (1,2 × 0,8 m), five pallets per stack
    var wood = ME ? ME.mat.wood() : STD({ color: 0xb48a5c }), deck = new THREE.BoxGeometry(1.2, 0.022, 0.1), block = new THREE.BoxGeometry(0.145, 0.078, 0.1), mats = [];
    for (var sIdx = 0; sIdx < 3; sIdx++) {
      var px = d.cx + hx + 1.4 + (sIdx % 2) * 1.5, pz = d.cz + hz + 2.2 + sIdx * 1.05, rot = (rnd() - 0.5) * 0.3;
      for (var lv = 0; lv < 5; lv++) for (var bi = 0; bi < 5; bi++) {
        var m4 = new THREE.Matrix4().makeRotationY(rot).setPosition(px, 0.014 + lv * 0.144 + 0.133, pz);
        var off = new THREE.Matrix4().makeTranslation(0, 0, (bi - 2) * 0.175);
        mats.push(m4.clone().multiply(off));
        if (bi < 3) { var mb = new THREE.Matrix4().makeRotationY(rot).setPosition(px, 0.014 + lv * 0.144 + 0.039, pz); mats.push(mb.multiply(new THREE.Matrix4().makeTranslation((bi - 1) * 0.52, 0, 0)).multiply(new THREE.Matrix4().makeScale(1, 1, 7.6))); }
      }
    }
    var imd = new THREE.InstancedMesh(deck, wood, mats.length), bl = 0;
    mats.forEach(function (m, i) { imd.setMatrixAt(i, m); });
    imd.instanceMatrix.needsUpdate = true; imd.castShadow = true; imd.receiveShadow = true; hallYard.add(imd);
    block.dispose(); bl = null;
    hallYard.visible = true;
    return hallYard;
  }
  // concrete apron strip (0,6 m) round the house footprint
  function buildApron(house) {
    plotInit();
    if (apron) { while (apron.children.length) { var o = apron.children.pop(); if (o.geometry) o.geometry.dispose(); } }
    else { apron = new THREE.Group(); root.add(apron); }
    var d = house.dims, hx = d.L / 2, hz = d.W / 2, w = 0.6, y = 0.011;
    slabQuad(apron, d.cx - hx - w, d.cz - hz - w, d.cx + hx + w, d.cz - hz, y, E.mats.walk);
    slabQuad(apron, d.cx - hx - w, d.cz + hz, d.cx + hx + w, d.cz + hz + w, y, E.mats.walk);
    slabQuad(apron, d.cx - hx - w, d.cz - hz, d.cx - hx, d.cz + hz, y, E.mats.walk);
    slabQuad(apron, d.cx + hx, d.cz - hz, d.cx + hx + w, d.cz + hz, y, E.mats.walk);
  }

  /* ---- plot materials and tree billboards: made when the plot is first shown (second boot stage) ---- */
  function plotInit() {
    if (E.mats) return;
    var lx = TK.tex.leaves();
    var hedgeMat = STD({ map: lx.map, normalMap: lx.normalMap, roughness: 1, color: 0xffffff });
    hedgeMat.normalScale.set(2, 2);
    E.hedgeMat = hedgeMat;
    var T = TK.tex, X = TK.mat.tx, asph = T.asphalt();
    E.mats = {
      drive: STD({ color: 0x9c9b97, roughness: 0.92, map: X.concrete.map, normalMap: X.concrete.normalMap }),
      walk: STD({ color: 0xb4b3ae, roughness: 0.95, map: X.concrete.map, normalMap: X.concrete.normalMap }),
      street: STD({ color: 0x4a4b4e, roughness: 0.9, map: asph.map, normalMap: asph.normalMap }),
      fence: STD({ color: 0x41464b, roughness: 0.6, metalness: 0.3 }),
      path: new THREE.MeshStandardMaterial({ map: T.path(), transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
      slab: STD({ color: 0xa9a8a3, roughness: 0.9, map: X.concrete.map })
    };
    [E.mats.drive, E.mats.walk, E.mats.street, E.mats.slab].forEach(function (m) { m.userData.base = { c: m.color.clone(), r: m.roughness }; });
    var trees = TK.tex.trees();
    E.treeMats = trees.map(function (t) {
      function mk(tex, top) {
        var m = new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.5, roughness: 1, color: 0xffffff });
        m.userData.depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
        m.onBeforeCompile = function (sh) {     // winter: the lit leaves turn white; canopy blades are dropped at grazing angles
          sh.uniforms.uSnow = E.US;
          sh.fragmentShader = sh.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform float uSnow;')
            .replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.9, 0.92, 0.96), uSnow * smoothstep(0.035, 0.11, diffuseColor.g) * 0.85);');
          if (top) sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n if (abs(dot(normalize(vViewPosition), normal)) < 0.34) discard;');
        };
        m.customProgramCacheKey = function () { return top ? 'tk-tree-top' : 'tk-tree'; };
        return m;
      }
      // canopy blades face up only: from the garden they would show edge-on as dark lines
      var top = mk(t.top, true); top.shadowSide = THREE.DoubleSide;
      return { side: mk(t.side, false), top: top, kind: t.kind };
    });
  }

  /* ---- second stage, run right after the first frame: clouds, grass blades, neighbours -------- */
  E.showYard = function () { if (studioOn) return; yardOn = true; yard.visible = true; if (E.house) buildYard(E.house); };
  E.buildExtras = function () {
    if (extras || studioOn) return;
    extras = true;
    if (q.clouds !== false) buildClouds();
    if (q.blades) buildBlades(q.blades, 26);
    buildKind(cur.kind);
    buildTreeline(q.trees === undefined ? 120 : q.trees);
    if (E.house) placeBlades(E.house);
  };

  /* ---- helpers --------------------------------------------------------------- */
  function hedge(group, x0, z0, x1, z1, h, t) {
    var len = Math.hypot(x1 - x0, z1 - z0), g = new THREE.BoxGeometry(len, h, t, Math.max(2, Math.round(len / 0.5)), 4, 2);
    var p = g.attributes.position, uv = g.attributes.uv, n = g.attributes.normal, r = TK.tex.rng(Math.round(x0 * 7 + z0 * 13 + 99));
    for (var i = 0; i < p.count; i++) {
      var k = (Math.sin(p.getX(i) * 3.1 + p.getY(i) * 5.3) + Math.sin(p.getX(i) * 7.7 + p.getZ(i) * 4.1)) * 0.022 + (r() - 0.5) * 0.012;
      p.setXYZ(i, p.getX(i) + n.getX(i) * k, p.getY(i) + n.getY(i) * k + (p.getY(i) > 0 ? Math.sin(p.getX(i) * 1.3) * 0.03 : 0), p.getZ(i) + n.getZ(i) * k);
      uv.setXY(i, Math.abs(n.getY(i)) > 0.5 ? p.getX(i) : p.getX(i) + p.getZ(i), Math.abs(n.getY(i)) > 0.5 ? p.getZ(i) : p.getY(i));
    }
    g.computeVertexNormals();
    var m = new THREE.Mesh(g, E.hedgeMat);
    m.position.set((x0 + x1) / 2, h / 2, (z0 + z1) / 2); m.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  }
  function shrub(group, x, z, r) {
    var g = new THREE.IcosahedronGeometry(r, 3), p = g.attributes.position, uv = g.attributes.uv;
    for (var i = 0; i < p.count; i++) {
      var k = 1 + (Math.sin(p.getX(i) * 9 + p.getY(i) * 7) + Math.sin(p.getZ(i) * 11 + p.getY(i) * 5)) * 0.045;
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.8, p.getZ(i) * k);
      uv.setXY(i, p.getX(i) + p.getZ(i) * 0.6, p.getY(i));
    }
    g.computeVertexNormals();
    var m = new THREE.Mesh(g, E.hedgeMat); m.position.set(x, r * 0.62, z); m.castShadow = true; m.receiveShadow = true;
    group.add(m);
  }
  function tree(group, x, z, h, kind, rot) {
    // crossed blades, each as a front and a back quad: with a double-sided material the back face
    // would get a flipped (downward) normal and render almost black
    var w = h * 0.8, parts = [], tm = E.treeMats[kind];
    for (var b = 0; b < 4; b++) { var pg = new THREE.PlaneGeometry(w, h); pg.translate(0, h / 2, 0); pg.rotateY(b * Math.PI / 2); parts.push(pg); }
    var mg = TK.geo.merge(parts), n = mg.attributes.normal;
    for (var i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);       // both blades shade alike
    var m = new THREE.Mesh(mg, tm.side);
    m.customDepthMaterial = tm.side.userData.depth;
    m.position.set(x, -0.05, z); m.rotation.y = rot || 0; m.castShadow = true;
    group.add(noAO(m));
    // horizontal canopy blades: invisible edge-on from the garden, they give the crown a body from above
    var pop = tm.kind === 'poplar', cw = w * (pop ? 0.42 : 0.92);
    [0.5, 0.64, 0.76].forEach(function (f, j) {
      var cg = new THREE.PlaneGeometry(cw * (1 - j * 0.16), cw * (1 - j * 0.16)); cg.rotateX(-Math.PI / 2);
      var cm = new THREE.Mesh(cg, tm.top);
      cm.customDepthMaterial = tm.top.userData.depth;
      cm.position.set(x, h * f, z); cm.rotation.y = (rot || 0) + j; cm.castShadow = true;
      group.add(noAO(cm));
    });
  }
  function slabQuad(group, x0, z0, x1, z1, y, mat) {
    var g = new THREE.PlaneGeometry(x1 - x0, z1 - z0); g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, y, (z0 + z1) / 2);
    var p = g.attributes.position, uv = g.attributes.uv;
    for (var i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getZ(i));
    var m = new THREE.Mesh(g, mat); m.receiveShadow = true; group.add(m); return m;
  }

  /* ---- neighbours: the same generator as the configured house, muted finishes, no shadows ----- */
  var NEIGH = {
    predgradje: [
      { x: -27, z: -19, r: 0.12, s: { kuca: 'cetvorovodni', krov: 'tr35', mat: 'plast', boja: '8019', fasada: 'malter.bez', zona1: '', prozori: 'bela' } },
      { x: 27, z: -25, r: -0.2, s: { kuca: 'bungalov', krov: 'tr20', mat: 'plast', boja: '3009', fasada: 'malter.bela', zona1: '', prozori: 'braon' } },
      { x: -5, z: -43, r: 0.05, s: { kuca: 'dvovodni', krov: 'tr35', mat: 'plast', boja: '7024', fasada: 'malter.siva', zona1: 'lamperijah.8017', prozori: 'antracit' } }],
    ravnica: [{ x: -70, z: -95, r: 0.4, s: { kuca: 'bungalov', krov: 'tr35', mat: 'plast', boja: '3009', fasada: 'malter.bez', zona1: '', prozori: 'braon' } }],
    brdovito: [{ x: 38, z: -52, r: -0.3, s: { kuca: 'dvovodni', krov: 'tr35', mat: 'plast', boja: '8017', fasada: 'malter.bela', zona1: 'lamperijav.8017', prozori: 'orah' } }]
  };
  function neighbour(group, def) {
    var st = JSON.parse(JSON.stringify(D.defaults)), k;
    for (k in def.s) st[k] = def.s[k];
    st.detalji = ['sleme', 'vetar', 'okapnica', 'kapa', 'solbank', 'opsivka'];
    var set = TK.mat.makeSet(), grey = new THREE.Color(0x8d9296);
    TK.mat.applyState(set, st, 'n' + def.x);
    [set.roof, set.gutter, set.flash].concat(set.wall).forEach(function (m) { m.color.lerp(grey, 0.14); if (m.userData.base && m.userData.base.c) m.userData.base.c.copy(m.color); });
    set.roof.userData.uSnowN = E.US;
    var h = TK.house.build(st, { mats: set, lite: true });
    h.group.traverse(function (o) { if (o.isMesh) o.castShadow = false; o.layers.set(1); });
    h.group.position.set(def.x, 0, def.z); h.group.rotation.y = def.r;
    group.add(h.group);
    var c = new THREE.Mesh(contact.geometry, contact.material);
    c.scale.set((h.dims.L + 1.4) / 0.74, 1, (h.dims.W + 1.4) / 0.74); c.position.set(def.x, 0.03, def.z); c.rotation.y = def.r; c.renderOrder = 1;
    group.add(noAO(c));
  }
  function buildKind(kind) {
    if (kindBuilt[kind]) return;
    kindBuilt[kind] = true;
    var g = kindGroups[kind], i;
    (NEIGH[kind] || []).forEach(function (d) { neighbour(g, d); });
    if (kind === 'predgradje') {
      hedge(g, -38, -9.6, -18, -10.2, 1.5, 0.9); hedge(g, 18, -13.5, 38, -14.5, 1.4, 0.9);
      tree(g, -19, -26, 11, 0, 0.3); tree(g, 36, -15, 10, 3, 1.1); tree(g, 13, -34, 12, 1, 0.7); tree(g, -42, -31, 13, 2, 0.2); tree(g, 46, -36, 12, 0, 2.0); tree(g, -52, -6, 11, 3, 0.9);
    } else if (kind === 'ravnica') {      // plain: a far farmstead and a poplar row
      for (i = 0; i < 9; i++) tree(g, 60 + i * 9, -120 - i * 3, 15, 2, i);
      tree(g, -84, -98, 12, 0, 0.5); tree(g, -58, -101, 10, 3, 1.4);
    } else {                              // hills: woodland edge
      for (i = 0; i < 16; i++) { var an = -2.7 + i * 0.16, rr = 46 + (i % 4) * 9; tree(g, Math.sin(an) * rr * 1.2, -Math.cos(an) * rr - 6, 11 + (i % 3) * 2.5, i % 4, i * 1.3); }
    }
  }

  /* ---- drifting cloud billboards ------------------------------------------------- */
  function buildClouds() {
    var tex = [TK.tex.cloud(301), TK.tex.cloud(307), TK.tex.cloud(311)], rnd = TK.tex.rng(321);
    for (var i = 0; i < 6; i++) {
      var m = new THREE.SpriteMaterial({ map: tex[i % 3], transparent: true, depthWrite: false, fog: false, opacity: 0.9 });
      var s = new THREE.Sprite(m), an = i / 6 * Math.PI * 2 + rnd() * 0.6, d = 520 + rnd() * 260, w = 300 + rnd() * 220;
      s.scale.set(w, w * 0.5, 1);
      s.position.set(Math.sin(an) * d, 95 + rnd() * 150, -Math.cos(an) * d);
      s.renderOrder = -9; s.layers.set(1);
      s.userData.speed = 2.2 + rnd() * 1.6;
      root.add(s); clouds.push(s);
    }
    tintClouds();
  }
  function tintClouds() {
    if (!clouds.length || !E.state) return;
    var c = E.state.cloud, w = E.weather;
    clouds.forEach(function (s) { s.material.color.setRGB(c[0], c[1], c[2]); s.material.opacity = 0.92 * (1 - w.rain * 0.75) * Math.min(1, 0.25 + E.state.day); });
  }

  /* ---- grass blades: instanced tufts in a field that follows the camera, faded at its rim,
     cut out where the house, terrace and paving are; they sway in the wind ------------------- */
  function buildBlades(count, size) {
    var pos = [], col = [], idx = [], n = 0, b;
    for (b = 0; b < 3; b++) {
      var ang = b * 2.2 + 0.4, dx = Math.cos(ang), dz = Math.sin(ang), px = -dz, pz = dx, ox = dx * 0.03 * b, oz = dz * 0.03 * b;
      var h = 0.075 + b * 0.024, w = 0.0085, lean = 0.03 + b * 0.016;
      pos.push(ox - px * w, 0, oz - pz * w, ox + px * w, 0, oz + pz * w,
        ox + dx * lean * 0.35 - px * w * 0.7, h * 0.55, oz + dz * lean * 0.35 - pz * w * 0.7, ox + dx * lean * 0.35 + px * w * 0.7, h * 0.55, oz + dz * lean * 0.35 + pz * w * 0.7,
        ox + dx * lean, h, oz + dz * lean);
      col.push(0.055, 0.10, 0.03, 0.055, 0.10, 0.03, 0.11, 0.19, 0.06, 0.11, 0.19, 0.06, 0.19, 0.29, 0.10);
      idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2, n + 2, n + 3, n + 4); n += 5;
    }
    var g = new THREE.InstancedBufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    var off = new Float32Array(count * 4), rnd = TK.tex.rng(401);
    for (var i = 0; i < count; i++) { off[i * 4] = rnd() * size; off[i * 4 + 1] = rnd() * size; off[i * 4 + 2] = rnd() * 6.283; off[i * 4 + 3] = 0.7 + rnd() * 0.75; }
    g.setAttribute('aOff', new THREE.InstancedBufferAttribute(off, 4));
    g.instanceCount = count;
    bladeU = { uCentre: { value: new V3() }, uSize: { value: size }, uTimeG: { value: 0 }, uSnow: E.US, macroMap: { value: E.grassTex.macro },
      uRect: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] } };
    var m = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    m.onBeforeCompile = function (sh) {
      for (var k in bladeU) sh.uniforms[k] = bladeU[k];
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec4 aOff; uniform vec3 uCentre; uniform float uSize; uniform float uTimeG; uniform float uSnow; uniform vec4 uRect[5]; uniform sampler2D macroMap;')
        .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3(0.0, 1.0, 0.0);')
        .replace('#include <begin_vertex>', [
          'vec2 tkW = mod(aOff.xy - uCentre.xz + 0.5 * uSize, uSize) - 0.5 * uSize + uCentre.xz;',
          'float tkS = aOff.w * (1.0 - smoothstep(0.72, 0.98, length(tkW - uCentre.xz) / (0.5 * uSize))) * (1.0 - uSnow);',
          'for (int i = 0; i < 5; i++) { if (tkW.x > uRect[i].x && tkW.x < uRect[i].z && tkW.y > uRect[i].y && tkW.y < uRect[i].w) tkS = 0.0; }',
          'float tkC = cos(aOff.z), tkN = sin(aOff.z), tkBend = position.y * position.y * 55.0;',
          'vec3 tkP = vec3(position.x * tkC - position.z * tkN, position.y, position.x * tkN + position.z * tkC) * tkS;',
          'tkP.x += (sin(uTimeG * 1.6 + tkW.x * 0.55 + tkW.y * 0.4) * 0.024 + sin(uTimeG * 3.1 + tkW.x * 2.3) * 0.007) * tkBend * tkS;',
          'tkP.z += sin(uTimeG * 1.2 + tkW.y * 0.7) * 0.013 * tkBend * tkS;',
          'vec3 transformed = vec3(tkW.x + tkP.x, tkP.y, tkW.y + tkP.z);',
          'float tkA = texture2D(macroMap, tkW / 2.6 * 0.047).r, tkB = texture2D(macroMap, tkW / 2.6 * 0.31 + 0.37).r;',
          'vColor *= mix(vec3(0.70, 0.74, 0.62), vec3(1.22, 1.18, 1.12), tkA) * mix(0.82, 1.14, tkB) * (0.8 + 0.4 * fract(aOff.x * 7.31 + aOff.y * 3.17));'
        ].join('\n'));
      // both faces of a blade are lit like the lawn they stand on (no flipped normal on the back face)
      sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n normal = normalize(vNormal);');
    };
    m.customProgramCacheKey = function () { return 'tk-blades'; };
    blades = new THREE.Mesh(g, m);
    blades.frustumCulled = false; blades.receiveShadow = true; blades.layers.set(1);
    root.add(blades);
  }
  function placeBlades(house) {
    if (!bladeU) return;
    var d = house.dims, t = house.terrace, R = bladeU.uRect.value, P = E.plot;
    R[0].set(d.cx - d.L / 2 - 0.5, d.cz - d.W / 2 - 0.5, d.cx + d.L / 2 + 0.5, d.cz + d.W / 2 + 0.5);
    R[1].set(t.x0 - 0.03, t.z0 - 0.5, t.x1 + 0.03, t.z1 + 0.03);
    R[2].set(P.dx0 - 0.03, P.dz0 - 0.03, P.dx1 + 0.03, P.zF + 0.5);
    R[3].set(-200, P.zF + 0.28, 200, P.zF + 40);
    R[4].set(-200, -200, 200, -P.bz + 0.3);
  }

  /* ---- planting, paving and fence of the plot ------------------------------------------- */
  function buildYard(house) {
    plotInit();
    var d = house.dims, hx = d.L / 2, hz = d.W / 2, t = house.terrace, P = E.plot, bx = P.bx, bz = P.bz, zF = P.zF, dx0 = P.dx0, dx1 = P.dx1, dz0 = P.dz0, hall = !!d.hall;
    while (yard.children.length) { var o = yard.children.pop(); if (o.geometry && o.geometry !== contact.geometry) o.geometry.dispose(); }
    if (hallYard) hallYard.visible = hall;
    if (apron) apron.visible = !hall;
    if (hall) { buildHallYard(house); }
    else {
      buildApron(house);
      hedge(yard, -bx, -bz, bx + 2, -bz, 1.9, 1.0);            // back
      hedge(yard, -bx, -bz, -bx, zF, 1.7, 1.0);                // left
      hedge(yard, bx + 2, -bz, bx + 2, zF, 1.7, 1.0);          // right
      shrub(yard, t.x1 + 1.2, t.z0 + 0.8, 0.7); shrub(yard, -hx - 1.6, hz + 1.2, 0.55);
      shrub(yard, -bx + 2.2, -bz + 2.2, 1.0); shrub(yard, bx - 0.2, -bz + 2.0, 0.85);
      tree(yard, dx1 + 2.2, -hz + 1.5, 8.5, 1, 0.5);
      tree(yard, -hx - 6.2, -hz - 4.5, 10.5, 0, 1.2);
      tree(yard, hx + 5.0, -hz - 6.0, 11.5, 3, 2.1);
    }
    // driveway, pavement and street
    slabQuad(yard, dx0, dz0, dx1, zF + 0.3, 0.012, E.mats.drive);
    slabQuad(yard, -70, zF + 0.3, 70, zF + 2.3, 0.02, E.mats.walk);
    slabQuad(yard, -70, zF + 2.3, 70, zF + 9.0, 0.008, E.mats.street);
    if (hall) return;                                        // a hall has no garden fence or path
    // front fence with a gap at the driveway: posts and slats as two instanced meshes
    var slats = [], posts = [], x, m4 = new THREE.Matrix4();
    for (x = -bx + 0.5; x < bx + 1.5; x += 0.14) { if (x > dx0 - 0.2 && x < dx1 + 0.2) continue; slats.push(new THREE.Matrix4().makeTranslation(x, 0.62, zF)); }
    for (x = -bx + 0.5; x < bx + 1.6; x += 2.33) { if (x > dx0 - 0.1 && x < dx1 + 0.1) continue; posts.push(new THREE.Matrix4().makeTranslation(x, 0.6, zF - 0.05)); }
    posts.push(new THREE.Matrix4().makeTranslation(dx0 - 0.2, 0.6, zF - 0.05), new THREE.Matrix4().makeTranslation(dx1 + 0.2, 0.6, zF - 0.05));
    [[new THREE.BoxGeometry(0.09, 0.95, 0.02), slats], [new THREE.BoxGeometry(0.07, 1.2, 0.07), posts]].forEach(function (p) {
      var im = new THREE.InstancedMesh(p[0], E.mats.fence, p[1].length);
      p[1].forEach(function (mm, i) { im.setMatrixAt(i, mm); });
      im.castShadow = true; im.receiveShadow = true; yard.add(im);
    });
    [0.28, 0.95].forEach(function (y) {           // two rails
      [[-bx + 0.4, dx0 - 0.2], [dx1 + 0.2, bx + 1.6]].forEach(function (s) {
        var rg = new THREE.BoxGeometry(s[1] - s[0], 0.05, 0.035); rg.translate((s[0] + s[1]) / 2, y, zF - 0.03);
        var rm = new THREE.Mesh(rg, E.mats.fence); rm.castShadow = true; yard.add(rm);
      });
    });
    // worn path with stepping stones from the terrace to the driveway
    var pa = new V3(Math.min(t.x1 - 1.0, dx0 - 2.2), 0.016, t.z1), pb = new V3(dx0 + 0.1, 0.016, t.z1 + 2.6), pdir = pb.clone().sub(pa), plen = pdir.length();
    pdir.normalize();
    var pn = new V3(-pdir.z, 0, pdir.x).multiplyScalar(0.62), pg = new THREE.BufferGeometry();
    var A0 = pa.clone().sub(pn), A1 = pa.clone().add(pn), B0 = pb.clone().sub(pn), B1 = pb.clone().add(pn);
    pg.setAttribute('position', new THREE.Float32BufferAttribute([A0.x, A0.y, A0.z, A1.x, A1.y, A1.z, B1.x, B1.y, B1.z, A0.x, A0.y, A0.z, B1.x, B1.y, B1.z, B0.x, B0.y, B0.z], 3));
    pg.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, plen / 3, 0, 0, 1, plen / 3, 0, plen / 3], 2));
    pg.computeVertexNormals();
    var pm = new THREE.Mesh(pg, E.mats.path); pm.receiveShadow = true; pm.renderOrder = 1; yard.add(noAO(pm));
    var stones = [], rs = TK.tex.rng(77);
    for (var sd = 0.45; sd < plen - 0.3; sd += 0.68) {
      var sp = pa.clone().addScaledVector(pdir, sd);
      stones.push(new THREE.Matrix4().makeRotationY(Math.atan2(pdir.x, pdir.z) + (rs() - 0.5) * 0.3).setPosition(sp.x + (rs() - 0.5) * 0.08, 0.018, sp.z));
    }
    if (stones.length) {
      var sm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.035, 0.34), E.mats.slab, stones.length);
      stones.forEach(function (mm, i) { sm.setMatrixAt(i, mm); });
      sm.receiveShadow = true; sm.castShadow = true; yard.add(sm);
    }
  }

  /* ---- place the plot around the current house ----------------------------------------- */
  E.layout = function (house) {
    var d = house.dims, hx = d.L / 2, hz = d.W / 2, t = house.terrace, G = TK.geo;
    E.house = house;
    var bx = hx + 9, bz = hz + 8.5, zF = hz + 13, dx0 = Math.max(hx, t.x1) + 2.6, dx1 = dx0 + 3.1, dz0 = -hz + 0.6;
    E.plot = { bx: bx, bz: bz, zF: zF, dx0: dx0, dx1: dx1, dz0: dz0 };
    if (yardOn) buildYard(house);
    var gs = Math.max(80, Math.max(d.L, d.W) * 7); ground.scale.set(gs, 1, gs); ground.position.x = d.cx; ground.position.z = d.cz;
    neighbours();
    contact.scale.set((d.L + 1.4) / 0.74, 1, (d.W + 1.4) / 0.74);
    contact.position.set(d.cx, 0.024, d.cz);
    contactT.scale.set((t.x1 - t.x0 + 0.7) / 0.74, 1, (t.z1 - t.z0 + 0.7) / 0.74);
    contactT.position.set((t.x0 + t.x1) / 2, 0.022, (t.z0 + t.z1) / 2);
    lamps[0].g.position.set(t.x0 + 0.35, 0, t.z1 + 0.5); lamps[1].g.position.set(t.x1 - 0.35, 0, t.z1 + 0.5);
    doorLight.position.set((t.x0 + t.x1) / 2 - 1.5, 1.7, t.z0 + 1.3);
    E.center = new V3(d.cx, 0, d.cz);
    frustum();
    aimSun();
    placeBlades(house);
  };
  // shadow frustum hugs the house, terrace and the nearest planting; in the studio it also takes the long shadow on the floor
  function frustum() {
    var d = E.house ? E.house.dims : { L: 10, W: 8 }, R = Math.max(d.L, d.W) * 0.5 + (studioOn ? 14 : 8.5), c = sun.shadow.camera;
    c.left = -R; c.right = R; c.top = R; c.bottom = -R; c.near = 5; c.far = 160 + R; c.updateProjectionMatrix();
    syncB();
  }
  function aimSun() {
    sun.target.position.copy(E.center || new V3()).setY(2.5);
    sun.position.copy(sun.target.position).addScaledVector(sunDir, 70);
    syncB();
  }
  /* Compare mode: each side gets its own sun with its own shadow map, so the two houses do not have to
     re-render one shared map on every frame. Only one of the two lights is visible at a time.        */
  var sunB = null;
  function syncB() {
    if (!sunB) return;
    sunB.position.copy(sun.position); sunB.target.position.copy(sun.target.position);
    sunB.color.copy(sun.color); sunB.intensity = sun.intensity;
    var a = sun.shadow.camera, b = sunB.shadow.camera;
    b.left = a.left; b.right = a.right; b.top = a.top; b.bottom = a.bottom; b.near = a.near; b.far = a.far; b.updateProjectionMatrix();
  }
  E.useSun = function (i) {
    if (i === 1 && !sunB) {
      sunB = new THREE.DirectionalLight(0xffffff, 3);
      sunB.castShadow = true; sunB.shadow.mapSize.copy(sun.shadow.mapSize); sunB.shadow.bias = sun.shadow.bias; sunB.shadow.normalBias = sun.shadow.normalBias;
      sunB.layers.enable(2);
      scene.add(sunB); scene.add(sunB.target);
      syncB();
    }
    sun.visible = i !== 1;
    if (sunB) sunB.visible = i === 1;
  };
  E.dropSunB = function () {
    if (!sunB) return;
    E.useSun(0);
    if (sunB.shadow.map) { sunB.shadow.map.dispose(); sunB.shadow.map = null; }
  };

  // a hall is far bigger than a house: the houses next door would stand inside it
  function neighbours() { var hall = !!(E.house && E.house.dims.hall); Object.keys(kindGroups).forEach(function (k) { kindGroups[k].visible = !studioOn && k === cur.kind && !hall; }); }
  E.setKind = function (kind) {
    var st = kind === 'studio';
    cur.kind = kind; studioOn = st;
    [lawn, farGround, backdrop, yard].forEach(function (o) { o.visible = !st; });
    clouds.forEach(function (c) { c.visible = !st; });
    if (blades) blades.visible = !st;
    if (treeline) treeline.visible = !st;
    if (hallYard) hallYard.visible = !st && !!(E.house && E.house.dims.hall);
    if (apron) apron.visible = !st && !(E.house && E.house.dims.hall);
    ground.visible = false;
    cycInit().visible = st;
    scene.background = st ? null : skyRT.texture;
    scene.fog = st ? null : fog;
    renderer.setClearColor(st ? 0x0f1216 : 0x000000, 1);
    frustum();
    if (st) { neighbours(); scene.environment = E.studio; E.stamp++; return; }
    if (!yardOn) E.showYard();
    if (!extras) E.buildExtras();
    if (extras) buildKind(kind);
    neighbours();
    backdrop.material.map = E.backTex[kind] || (E.backTex[kind] = TK.tex.backdrop(kind));
    var fm = farGround.material;
    if (kind === 'ravnica') { E.fields = E.fields || TK.tex.fields(); fm.map = E.fields; E.fields.repeat.set(7, 7); fm.color.set(0xffffff); }
    else { fm.map = TK.mat.white(); fm.color.set(kind === 'brdovito' ? 0x58783a : 0x5f7a3c); }
    fm.needsUpdate = true; backdrop.material.needsUpdate = true;      // caller follows with setTime(): the sky is re-baked there
  };

  /* ---- sun position: declination of the chosen date, latitude of Belgrade -------------------- */
  E.sunAt = function (hour, datum) {
    var d = D.find(D.dates, datum) || D.dates[0], lat = 44.8 * RAD, dec = d.decl * RAD, H = (hour - d.noon) * 15 * RAD;
    var el = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H));
    var az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)) + AZ0;      // from south, west positive
    return { el: el / RAD, dir: new V3(-Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)) };
  };

  /* ---- time of day, date and weather ----------------------------------------------------------
     o.fast: called every frame by the day replay — the sun, sky and shadows follow continuously,
     the (costlier) environment capture only every quarter of an hour of sun time.            */
  E.setTime = function (hour, datum, o) {
    o = o || {};
    cur.hour = hour; cur.datum = datum || cur.datum;
    var w = E.weather, rain = w.rain, snow = w.snow;
    var s = E.sunAt(hour, cur.datum), el = s.el;
    var day = smooth(-9, 5, el), golden = (1 - smooth(4, 26, el)) * (1 - rain) * (1 - 0.72 * snow), lamp = Math.max(1 - smooth(-3, 8, el), rain * 0.25);
    // towards dusk the sky keeps its blue and only the side of the sun turns warm (uGold in the shader)
    var zen = mix3(mix3([0.15, 0.30, 0.68], [0.13, 0.22, 0.52], golden), [0.003, 0.006, 0.02], 1 - day);
    var hor = mix3(mix3([0.56, 0.72, 0.94], [0.62, 0.62, 0.72], golden), [0.014, 0.022, 0.05], 1 - day);
    var cl = mix3(mix3([1.0, 1.0, 1.0], [1.0, 0.72, 0.52], golden), [0.022, 0.03, 0.055], 1 - day);
    var cs = mix3(mix3([0.62, 0.67, 0.75], [0.48, 0.36, 0.40], golden), [0.010, 0.014, 0.03], 1 - day);
    var cover = cur.kind === 'ravnica' ? 0.52 : cur.kind === 'brdovito' ? 0.6 : 0.57;
    if (snow) {              // winter: pale, cold, hazy
      zen = mix3(zen, [0.34 * day, 0.46 * day, 0.66 * day], 0.55 * snow); hor = mix3(hor, [0.80 * day, 0.85 * day, 0.92 * day], 0.6 * snow); cover += 0.08 * snow;
    }
    if (rain) {              // overcast: grey lid, almost no direct sun
      var gz = [0.30 * day, 0.33 * day, 0.37 * day], gh = [0.50 * day, 0.53 * day, 0.57 * day];
      zen = mix3(zen, gz, 0.9 * rain); hor = mix3(hor, gh, 0.9 * rain);
      cl = mix3(cl, [0.46 * day, 0.48 * day, 0.52 * day], 0.9 * rain); cs = mix3(cs, [0.22 * day, 0.24 * day, 0.27 * day], 0.9 * rain);
      cover += (0.97 - cover) * rain;
    }
    U.uGold.value = golden * day;
    var grd = mix3(mix3([0.30, 0.33, 0.22], [0.75, 0.78, 0.84], snow), [0.004, 0.006, 0.008], 1 - day);
    var sunC = mix3(mix3([1.0, 0.96, 0.90], [0.92, 0.95, 1.0], snow * 0.7), [1.0, 0.50, 0.20], Math.pow(golden, 0.8));
    U.uZenith.value.fromArray(zen); U.uHorizon.value.fromArray(hor); U.uGround.value.fromArray(grd);
    U.uCloudCol.value.fromArray(cl); U.uCloudShade.value.fromArray(cs); U.uCloud.value = q.flatSky ? 0 : cover;
    U.uStars.value = (1 - smooth(-12, -6, el)) * 0.6 * (1 - rain);

    var sunI = smooth(-1.5, 12, el) * (1 - 0.86 * rain), moon = el < -1.5;
    var dir = moon ? new V3(0.45, 0.62, 0.64).normalize() : s.dir;
    if (moon) { U.uSunCol.value.set(0.10, 0.12, 0.18).multiplyScalar(1 - rain); sun.color.setRGB(0.52, 0.64, 1.0); sun.intensity = 0.32 * (1 - 0.6 * rain); }
    else { var sk = (0.5 + day) * (1 - 0.9 * rain); U.uSunCol.value.set(sunC[0] * sk, sunC[1] * sk, sunC[2] * sk); sun.color.setRGB(sunC[0], sunC[1], sunC[2]); sun.intensity = 4.4 * sunI; }
    U.uSunDir.value.copy(dir);
    sunDir.copy(dir); aimSun();
    syncB();
    hemi.intensity = 0.03 + 0.09 * day;
    hemi.color.setRGB(0.75, 0.85, 1.0);
    hemi.groundColor.setRGB(0.29 + 0.5 * snow, 0.35 + 0.45 * snow, 0.2 + 0.65 * snow);
    fog.color.setRGB(hor[0], hor[1], hor[2]);
    fog.near = 140 - 105 * rain - 50 * snow; fog.far = 900 - 560 * rain - 300 * snow;
    renderer.toneMappingExposure = (0.94 + (1 - day) * 0.8) * (1 + 0.12 * rain);
    var dl = mix3(mix3(mix3([1, 1, 1], [1.0, 0.78, 0.62], golden * 0.8), [0.62, 0.65, 0.7], rain * 0.8), [0.05, 0.06, 0.1], 1 - day);
    backdrop.material.color.setRGB(dl[0], dl[1], dl[2]);

    // lamps and lit rooms (the lights stay in the light set at zero intensity by day: see k-materials.js)
    var M = TK.mat;
    M.interior.color.setRGB(0.085 + lamp * 2.6, 0.08 + lamp * 1.7, 0.075 + lamp * 0.8);
    M.curtain.emissiveIntensity = lamp * 0.85;
    M.glass.opacity = 0.42 - lamp * 0.2;
    E.lampHead.emissiveIntensity = lamp * 6;
    var lit = lamp > 0.012;
    lamps.forEach(function (l) { l.light.intensity = lamp * 9; l.glow.material.opacity = lamp * 0.9; l.glow.visible = lit; });
    doorLight.intensity = lamp * 14;
    E.state = { el: el, day: day, lamp: lamp, golden: golden, cloud: cl, sunI: sunI, moon: moon };
    tintClouds();

    // wet / snowy ground
    lawnMat.roughness = 1 - 0.3 * rain - 0.25 * snow; lawnMat.normalScale.set(1.6 - 1.2 * snow, 1.6 - 1.2 * snow);
    lawnMat.color.setScalar(1 - 0.22 * rain);
    var em = E.mats;
    if (em) [em.drive, em.walk, em.street, em.slab].forEach(function (m) { var b = m.userData.base; m.color.copy(b.c).multiplyScalar(1 - 0.35 * rain); m.roughness = b.r * (1 - 0.72 * rain); });

    // sky cube: once without the sun disc for the environment (the directional light supplies the sun),
    // then with it for the visible background
    var bake = !studioOn && (!o.fast || Math.abs(hour - lastBake) >= 0.25);
    if (bake) {
      lastBake = hour;
      U.uDisc.value = 0; U.uGain.value = 0.78 + 0.2 * (1 - day);
      if (o.skyOnly) {
        var rt0 = pmrem.fromScene(skyScene, 0, 1, 4000);
        swapEnv(rt0);
      } else {
        skyCam.update(renderer, skyScene);
        capture();
      }
    }
    U.uDisc.value = moon ? 5 : 14 * (1 - rain); U.uGain.value = 1;
    if (studioOn) {
      // product-shot light: fixed key from above-front, no night, neutral exposure
      renderer.toneMappingExposure = 1.0; hemi.intensity = 0.22;
      sun.color.setRGB(1, 0.98, 0.95); sun.intensity = 3.2;
      sunDir.set(-0.45, 0.8, 0.55).normalize(); aimSun(); syncB();
      return;
    }
    skyCam.update(renderer, skyScene);
  };
  function swapEnv(rt) {
    scene.environment = rt.texture;
    if (envRT) envRT.dispose();
    envRT = rt; E.stamp++;
  }
  // image-based lighting from the surroundings as they are: the house itself is left out
  function capture() {
    var hid = [];
    E.captureHide.forEach(function (o) { if (o && o.visible) { o.visible = false; hid.push(o); } });
    if (blades) blades.visible = false;
    var d = E.house ? E.house.dims : { cx: 0, cz: 0, eave: 3.5 };
    envCam.position.set(d.cx, (d.eave || 3.5) + 1.2, d.cz);
    // six faces rendered here (not CubeCamera.update): tone mapping stays on, so the capture runs on the
    // same shader programs as the main view instead of compiling a second variant of every material
    envCam.updateMatrixWorld();
    var keepRT = renderer.getRenderTarget(), sm = renderer.shadowMap.needsUpdate;
    renderer.shadowMap.needsUpdate = false;
    for (var f = 0; f < 6; f++) { renderer.setRenderTarget(envCube, f); renderer.render(scene, envCam.children[f]); }
    renderer.setRenderTarget(keepRT); renderer.shadowMap.needsUpdate = sm;
    hid.forEach(function (o) { o.visible = true; });
    if (blades) blades.visible = true;
    swapEnv(pmrem.fromCubemap(envCube.texture));
  }
  E.rebake = function () { E.setTime(cur.hour, cur.datum); };

  /* ---- per-frame: wind in the grass, cloud drift, blade field follows the camera -------------- */
  var tmpV = new V3();
  E.tick = function (dt, t, camera) {
    if (bladeU) {
      bladeU.uTimeG.value = t;
      var c = E.center || tmpV.set(0, 0, 0), dx = camera.position.x - c.x, dz = camera.position.z - c.z, dist = Math.hypot(dx, dz) || 1, sh = Math.min(dist * 0.42, 9.5);
      bladeU.uCentre.value.set(c.x + dx / dist * sh, 0, c.z + dz / dist * sh);
    }
    for (var i = 0; i < clouds.length; i++) {
      var s = clouds[i]; s.position.x += s.userData.speed * dt;
      if (s.position.x > 820) s.position.x -= 1640;
    }
  };

  E.sunLight = function () { return sun; };
  // theme switch: only the shadow catcher follows (the backdrop is CSS; light and materials stay put)
  E.theme = function (t) { if (ground) ground.material.opacity = t === 'dark' ? 0.5 : 0.22; };
  // studio map shared with the hero (js/metal-env.js): softbox, two strips, dark floor; the sky-dome
  // version stays as a fallback when the shared module is missing
  E.makeStudio = function () {
    if (ME) { var rtS = ME.studio(renderer, { theme: 'dark' }); return rtS.texture; }
    var keep = {}, k;
    for (k in U) keep[k] = U[k].value.isVector3 ? U[k].value.clone() : U[k].value;
    U.uZenith.value.set(0.42, 0.52, 0.70); U.uHorizon.value.set(0.86, 0.88, 0.92); U.uGround.value.set(0.42, 0.42, 0.42);
    U.uCloudCol.value.set(1, 1, 1); U.uCloudShade.value.set(0.7, 0.72, 0.76); U.uSunCol.value.set(1, 0.97, 0.92); U.uSunDir.value.set(-0.4, 0.75, 0.5).normalize();
    U.uStars.value = 0; U.uDisc.value = 0; U.uGain.value = 0.8; U.uGold.value = 0; U.uCloud.value = 0.5;
    var rt = pmrem.fromScene(skyScene, 0, 1, 4000);
    for (k in U) { if (U[k].value.isVector3) U[k].value.copy(keep[k]); else U[k].value = keep[k]; }
    return rt.texture;
  };
  var studio = null;
  Object.defineProperty(E, 'studio', { get: function () { return studio || (studio = E.makeStudio()); } });
})();
