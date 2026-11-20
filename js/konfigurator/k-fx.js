/* ==========================================================================
   TRICOM konfigurator — k-fx.js
   Screen-space ambient occlusion (normal + depth pre-pass at half resolution,
   multiplied onto the frame) and the photo mode (off-screen 4K frame built
   from jittered samples: supersampling and depth of field in one go, then
   vignette, grain, letterbox, watermark).
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var FX = TK.fx = {};
  var renderer, qScene, qCam, qMesh, rtN, rtA, rtB, rtMain = {}, matN, matAO, matBlur, matPresent, matAdd, matFinal;
  var saved = {}, clearCol = new THREE.Color();
  FX.aoOn = false;

  var QUAD_VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  function quadMat(fs, uniforms, extra) {
    return new THREE.ShaderMaterial(Object.assign({ vertexShader: QUAD_VS, fragmentShader: fs, uniforms: uniforms, depthTest: false, depthWrite: false, toneMapped: false }, extra || {}));
  }
  function drawQuad(mat, target) {
    qMesh.material = mat;
    renderer.setRenderTarget(target || null);
    renderer.render(qScene, qCam);
  }

  FX.init = function (r, quality) {
    renderer = r;
    qScene = new THREE.Scene(); qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    qMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null); qMesh.frustumCulled = false; qScene.add(qMesh);
    FX.aoOn = !!quality.ao && renderer.capabilities.isWebGL2;
    FX.samples = quality.msaa === undefined ? 4 : quality.msaa;
    var N = quality.ao || 8;

    // pre-pass: view-space normal in rgb, linear depth in a
    matN = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: [
        '#include <common>',
        'varying vec3 vN; varying float vZ;',
        'void main(){',
        '  #include <beginnormal_vertex>',
        '  #include <defaultnormal_vertex>',
        '  #include <begin_vertex>',
        '  #include <project_vertex>',
        '  vN = transformedNormal; vZ = -mvPosition.z;',
        '}'].join('\n'),
      fragmentShader: 'varying vec3 vN; varying float vZ; void main(){ vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n; gl_FragColor = vec4(n, vZ); }'
    });

    matAO = quadMat([
      '#define N ' + N,
      'uniform sampler2D tN; uniform vec4 uProj; uniform float uRadius; uniform float uInt;',
      'varying vec2 vUv;',
      'vec3 posAt(vec2 uv, float z){ vec2 ndc = uv * 2.0 - 1.0; return vec3((ndc.x + uProj.z) * z / uProj.x, (ndc.y + uProj.w) * z / uProj.y, -z); }',
      'void main(){',
      '  vec4 c = texture2D(tN, vUv);',
      '  float z = c.a;',
      '  if (z <= 0.0) { gl_FragColor = vec4(1.0); return; }',
      '  vec3 n = normalize(c.xyz), p = posAt(vUv, z);',
      '  float k = min(0.5 * uRadius / z, 0.09);',
      '  float ang = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) * 6.2831853;',
      '  float occ = 0.0;',
      '  for (int i = 0; i < N; i++) {',
      '    float fi = (float(i) + 0.5) / float(N), a = ang + fi * 15.08;',
      '    vec2 uv2 = vUv + vec2(cos(a) * uProj.x, sin(a) * uProj.y) * (k * sqrt(fi));',
      '    vec4 s = texture2D(tN, uv2);',
      '    if (s.a <= 0.0) continue;',
      '    vec3 v = posAt(uv2, s.a) - p;',
      '    float d2 = dot(v, v);',
      '    occ += max(0.0, dot(v, n) - 0.015 - 0.0012 * z) / (d2 + 0.012) * step(d2, uRadius * uRadius * 2.2);',
      '  }',
      '  float ao = clamp(1.0 - uInt * occ * 2.0 / float(N), 0.0, 1.0);',
      '  gl_FragColor = vec4(mix(ao, 1.0, smoothstep(45.0, 90.0, z)));',
      '}'].join('\n'),
      { tN: { value: null }, uProj: { value: new THREE.Vector4() }, uRadius: { value: 0.55 }, uInt: { value: 0.075 } });

    matBlur = quadMat([
      'uniform sampler2D tA; uniform sampler2D tN; uniform vec2 uTexel; varying vec2 vUv;',
      'void main(){',
      '  float zc = texture2D(tN, vUv).a, sum = 0.0, ws = 0.0;',
      '  for (int x = -2; x < 2; x++) for (int y = -2; y < 2; y++) {',
      '    vec2 uv2 = vUv + (vec2(float(x), float(y)) + 0.5) * uTexel;',
      '    float w = step(abs(texture2D(tN, uv2).a - zc), 0.04 * zc + 0.04) + 0.001;',
      '    sum += texture2D(tA, uv2).r * w; ws += w;',
      '  }',
      '  gl_FragColor = vec4(sum / ws);',
      '}'].join('\n'),
      { tA: { value: null }, tN: { value: null }, uTexel: { value: new THREE.Vector2() } });

    // present: frame (linear, already tone-mapped by the materials) x occlusion -> sRGB, with a little dither against banding.
    // Alpha is kept (premultiplied): in the studio view the scene has no background and the page's theme gradient shows through.
    matPresent = quadMat([
      'uniform sampler2D tC; uniform sampler2D tA; uniform float uAO; uniform float uPow; uniform vec2 uPx; uniform float uFxaa; varying vec2 vUv;',
      'const vec3 LUMA = vec3(0.299, 0.587, 0.114);',
      'vec3 fxaa(){',
      '  vec3 nw = texture2D(tC, vUv + vec2(-1.0, -1.0) * uPx).rgb, ne = texture2D(tC, vUv + vec2(1.0, -1.0) * uPx).rgb;',
      '  vec3 sw = texture2D(tC, vUv + vec2(-1.0, 1.0) * uPx).rgb, se = texture2D(tC, vUv + vec2(1.0, 1.0) * uPx).rgb, m = texture2D(tC, vUv).rgb;',
      '  float lnw = dot(sqrt(nw), LUMA), lne = dot(sqrt(ne), LUMA), lsw = dot(sqrt(sw), LUMA), lse = dot(sqrt(se), LUMA), lm = dot(sqrt(m), LUMA);',
      '  float lmin = min(lm, min(min(lnw, lne), min(lsw, lse))), lmax = max(lm, max(max(lnw, lne), max(lsw, lse)));',
      '  if (lmax - lmin < 0.035) return m;',
      '  vec2 dir = vec2(-((lnw + lne) - (lsw + lse)), (lnw + lsw) - (lne + lse));',
      '  float red = max((lnw + lne + lsw + lse) * 0.03125, 0.0078125);',
      '  dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + red), -8.0, 8.0) * uPx;',
      '  vec3 a = 0.5 * (texture2D(tC, vUv + dir * (1.0 / 3.0 - 0.5)).rgb + texture2D(tC, vUv + dir * (2.0 / 3.0 - 0.5)).rgb);',
      '  vec3 b = a * 0.5 + 0.25 * (texture2D(tC, vUv - dir * 0.5).rgb + texture2D(tC, vUv + dir * 0.5).rgb);',
      '  float lb = dot(sqrt(b), LUMA);',
      '  return (lb < lmin || lb > lmax) ? a : b;',
      '}',
      'void main(){',
      '  float a = clamp(texture2D(tC, vUv).a, 0.0, 1.0);',
      '  vec3 c = uFxaa > 0.5 ? fxaa() : texture2D(tC, vUv).rgb;',
      '  if (uAO > 0.5) c *= pow(texture2D(tA, vUv).r, uPow);',
      '  if (a < 0.002) { gl_FragColor = vec4(0.0); return; }',
      '  c /= a;',
      '  c = mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));',
      '  c += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;',
      '  gl_FragColor = vec4(c * a, a);',
      '}'].join('\n'),
      { tC: { value: null }, tA: { value: null }, uAO: { value: 0 }, uPow: { value: 2.4 }, uPx: { value: new THREE.Vector2() }, uFxaa: { value: 0 } });

    // photo mode
    matAdd = quadMat('uniform sampler2D tC; uniform float uW; varying vec2 vUv; void main(){ vec4 s = texture2D(tC, vUv); gl_FragColor = vec4(s.rgb * uW, clamp(s.a, 0.0, 1.0) * uW); }',
      { tC: { value: null }, uW: { value: 1 } },
      { blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, transparent: true });
    matFinal = quadMat([
      'uniform sampler2D tC; uniform sampler2D tA; uniform float uAO; uniform float uBar; uniform float uSplit; uniform vec3 uBgT; uniform vec3 uBgB; uniform float uKeepA; varying vec2 vUv;',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
      'void main(){',
      '  vec4 s = texture2D(tC, vUv); vec3 c = s.rgb;',
      '  if (uAO > 0.0) c *= pow(texture2D(tA, vUv).r, 2.2);',
      '  float a = clamp(s.a, 0.0, 1.0);',
      '  if (uKeepA > 0.5) c /= max(a, 0.002); else c += mix(uBgB, uBgT, smoothstep(0.0, 1.0, vUv.y)) * (1.0 - a);',      // studio: theme backdrop behind the model (or kept transparent)
      '  c = mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));',
      '  vec2 q = (vUv - 0.5) * vec2(1.0, 0.82);',
      '  c *= mix(0.70, 1.0, smoothstep(0.80, 0.30, length(q)));',
      '  c += (hash(gl_FragCoord.xy) + hash(gl_FragCoord.yx * 1.7) - 1.0) * 0.022;',
      '  if (uSplit > 0.0 && abs(vUv.x - uSplit) < 0.0009) c = vec3(1.0);',
      '  if (vUv.y < uBar || vUv.y > 1.0 - uBar) c = vec3(0.043, 0.055, 0.075);',
      '  gl_FragColor = vec4(c, uKeepA > 0.5 ? a : 1.0);',
      '}'].join('\n'),
      { tC: { value: null }, tA: { value: null }, uAO: { value: 1 }, uBar: { value: 0.045 }, uSplit: { value: 0 }, uKeepA: { value: 0 }, uBgT: { value: new THREE.Color(1, 1, 1) }, uBgB: { value: new THREE.Color(1, 1, 1) } });
  };

  function size(w, h) {
    if (rtN && rtN.width === w && rtN.height === h) return;
    if (rtN) { rtN.dispose(); rtA.dispose(); rtB.dispose(); }
    var o = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true };
    rtN = new THREE.WebGLRenderTarget(w, h, o);
    var o2 = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    rtA = new THREE.WebGLRenderTarget(w, h, o2); rtB = new THREE.WebGLRenderTarget(w, h, o2);
    matBlur.uniforms.uTexel.value.set(1 / w, 1 / h);
  }

  /* ---- main frame target: multisampled, half-float, linear ------------------------------------- */
  // fast = true: the frame is part of a motion — no multisampling, edges are smoothed by FXAA instead
  FX.frame = function (w, h, fast) {
    if (!renderer.capabilities.isWebGL2) return null;
    var k = fast || !FX.samples ? 'fast' : 'still', rt = rtMain[k];
    if (!rt || rt.width !== w || rt.height !== h) {
      if (rt) rt.dispose();
      rt = rtMain[k] = new THREE.WebGLRenderTarget(w, h, { samples: k === 'still' ? FX.samples : 0, type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true });
      rt.tkFxaa = k === 'fast';
    }
    return rt;
  };
  FX.present = function (rt, ao, pow) {
    matPresent.uniforms.tC.value = rt.texture; matPresent.uniforms.tA.value = ao; matPresent.uniforms.uAO.value = ao ? 1 : 0; matPresent.uniforms.uPow.value = pow || 2.4;
    matPresent.uniforms.uPx.value.set(1 / rt.width, 1 / rt.height); matPresent.uniforms.uFxaa.value = rt.tkFxaa ? 1 : 0;
    drawQuad(matPresent, null);
  };

  /* ---- ambient occlusion: begin → draw(x0, x1) [once per compare side] → end ------------------- */
  FX.aoBegin = function (scene, camera, w, h) {
    size(Math.max(8, Math.ceil(w / 2)), Math.max(8, Math.ceil(h / 2)));
    saved = { bg: scene.background, mask: camera.layers.mask, alpha: renderer.getClearAlpha(), auto: renderer.autoClear, sm: renderer.shadowMap.needsUpdate };
    renderer.getClearColor(clearCol);
    scene.background = null; scene.overrideMaterial = matN;
    camera.layers.set(0);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.needsUpdate = false;
    renderer.setRenderTarget(rtN);
    rtN.scissorTest = false;
    renderer.autoClear = false;
    renderer.clear();
  };
  FX.aoDraw = function (scene, camera, x0, x1) {
    if (x0 > 0 || x1 < 1) { rtN.scissorTest = true; rtN.scissor.set(Math.round(x0 * rtN.width), 0, Math.round((x1 - x0) * rtN.width), rtN.height); }
    renderer.setRenderTarget(rtN);
    renderer.render(scene, camera);
  };
  FX.aoEnd = function (scene, camera) {
    rtN.scissorTest = false;
    scene.overrideMaterial = null; scene.background = saved.bg; camera.layers.mask = saved.mask;
    renderer.setClearColor(clearCol, saved.alpha);
    var P = camera.projectionMatrix.elements;
    matAO.uniforms.tN.value = rtN.texture; matAO.uniforms.uProj.value.set(P[0], P[5], P[8], P[9]);
    drawQuad(matAO, rtA);
    matBlur.uniforms.tA.value = rtA.texture; matBlur.uniforms.tN.value = rtN.texture;
    drawQuad(matBlur, rtB);
    renderer.setRenderTarget(null);
    renderer.autoClear = saved.auto; renderer.shadowMap.needsUpdate = saved.sm;
    return rtB.texture;
  };

  /* ---- photo mode ------------------------------------------------------------------------------
     o: { w, h, samples, focus: Vector3, aperture (m), draw(camera): renders the scene into the
     current render target, ao(camera, w, h): returns the occlusion texture or null, split: 0..1 }
     Resolves with a 2D canvas holding the finished frame.                                        */
  FX.photo = function (o, onProgress) {
    var w = o.w, h = o.h, N = o.samples, cam = o.camera;
    var keep = { aspect: cam.aspect, pos: cam.position.clone(), quat: cam.quaternion.clone(), view: cam.view ? Object.assign({}, cam.view) : null };
    var hf = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    var rtS = new THREE.WebGLRenderTarget(w, h, Object.assign({ depthBuffer: true }, hf));
    var rtAcc = new THREE.WebGLRenderTarget(w, h, Object.assign({ depthBuffer: false }, hf));
    var rtOut = new THREE.WebGLRenderTarget(w, h, { depthBuffer: false });
    var right = new THREE.Vector3(), up = new THREE.Vector3(), fwd = new THREE.Vector3();
    cam.aspect = w / h; cam.clearViewOffset(); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    cam.matrixWorld.extractBasis(right, up, fwd);
    var auto = renderer.autoClear, i = 0;
    renderer.setRenderTarget(rtAcc); renderer.setClearColor(0x000000, 0); renderer.clear();

    function sample() {
      // Halton(2,3) sub-pixel jitter + a point on the aperture disc (concentric rings)
      var hx = halton(i + 1, 2) - 0.5, hy = halton(i + 1, 3) - 0.5, rr = Math.sqrt((i + 0.5) / N) * o.aperture, an = i * 2.39996;
      cam.position.copy(keep.pos).addScaledVector(right, Math.cos(an) * rr).addScaledVector(up, Math.sin(an) * rr);
      cam.lookAt(o.focus);
      cam.setViewOffset(w, h, hx, hy, w, h);
      cam.updateMatrixWorld();
      renderer.autoClear = true;
      renderer.setRenderTarget(rtS);
      o.draw(cam, rtS);
      renderer.autoClear = false;
      matAdd.uniforms.tC.value = rtS.texture; matAdd.uniforms.uW.value = 1 / N;
      drawQuad(matAdd, rtAcc);
      renderer.autoClear = auto;
      renderer.setRenderTarget(null);
    }
    function finish() {
      cam.position.copy(keep.pos); cam.quaternion.copy(keep.quat); cam.clearViewOffset(); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
      var ao = o.ao ? o.ao(cam, w, h) : null;
      matFinal.uniforms.tC.value = rtAcc.texture; matFinal.uniforms.tA.value = ao; matFinal.uniforms.uAO.value = ao ? 1 : 0;
      matFinal.uniforms.uBar.value = o.bar === undefined ? 0.045 : o.bar; matFinal.uniforms.uSplit.value = o.split || 0;
      matFinal.uniforms.uKeepA.value = o.transparent ? 1 : 0;
      if (o.bg) { matFinal.uniforms.uBgT.value.copy(o.bg[0]); matFinal.uniforms.uBgB.value.copy(o.bg[1]); } else { matFinal.uniforms.uBgT.value.setRGB(1, 1, 1); matFinal.uniforms.uBgB.value.setRGB(1, 1, 1); }
      renderer.autoClear = true;
      drawQuad(matFinal, rtOut);
      var buf = new Uint8Array(w * h * 4);
      renderer.readRenderTargetPixels(rtOut, 0, 0, w, h, buf);
      renderer.setRenderTarget(null); renderer.autoClear = auto;
      cam.aspect = keep.aspect;
      if (keep.view && keep.view.enabled) cam.setViewOffset(keep.view.fullWidth, keep.view.fullHeight, keep.view.offsetX, keep.view.offsetY, keep.view.width, keep.view.height);
      cam.updateProjectionMatrix();
      rtS.dispose(); rtAcc.dispose(); rtOut.dispose();
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var ctx = c.getContext('2d'), img = ctx.createImageData(w, h), row = w * 4;
      for (var y = 0; y < h; y++) img.data.set(buf.subarray((h - 1 - y) * row, (h - y) * row), y * row);      // GL rows run bottom-up
      ctx.putImageData(img, 0, 0);
      return c;
    }
    if (o.sync) { for (; i < N; i++) sample(); return finish(); }
    return new Promise(function (resolve, reject) {
      (function step() {
        try {
          var t0 = performance.now();
          do { sample(); i++; } while (i < N && performance.now() - t0 < 30);
          if (onProgress) onProgress(i / N);
          if (i < N) setTimeout(step, 0); else resolve(finish());
        } catch (e) { reject(e); }
      })();
    });
  };
  function halton(i, b) { var f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }
})();
