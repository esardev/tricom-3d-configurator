/* ==========================================================================
   TRICOM konfigurator — k-ui.js
   Six steps on a vertical mono rail (bottom tab bar on phones), the option
   panel (bottom sheet on phones), hotspots on the model, the „Prikaz“
   toolbar (views, dimensions, details, compare, photo, scene, share), the
   specification step with the inquiry actions and the inquiry list, the
   compare divider, inspector card, material loupe, print sheet.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var UI = TK.ui = {};
  var D = TK.data, A, T;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var panel, body, rail, hot, toastEl, zone = 0, sub = 0, inset = null, sheetH = 0.6;
  var isMobile = function () { return window.matchMedia('(max-width: 820px)').matches; };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var t = TK.t, P = function (f) { return TK.page(f); };          // text keys k.ui.* (js/i18n); kontakt.html → contact.html on /en/
  function fmt(n, d) { return TK.n(n, d === undefined ? 1 : d); }
  function dec1(v) { return TK.en ? L10N.num(v, String(v).indexOf('.') >= 0 ? 1 : 0) : String(v).replace('.', ','); }      // en: 162.5, 1,080          // 162.5 → sr 162,5
  var CHECK = '<span class="k-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ZOOM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5M8 10.5h5M10.5 8v5"/></svg>';

  var HOUSE_SVG = {
    dvovodni: '<path d="M8 50V30L38 8l30 22v20z"/><path d="M4 33L38 5l34 28"/><path d="M44 30v-9h13v9" /><path d="M41 22l19-3"/><path d="M16 50V38h10v12M46 50V38h9v12"/>',
    cetvorovodni: '<path d="M10 50V24h56v26z"/><path d="M5 24l14-14h38l14 14z"/><path d="M19 10l8 14M57 10l-8 14" opacity=".55"/><path d="M18 50V40h10v10M44 34h10v7H44zM20 29h9v6h-9z"/>',
    lkrov: '<path d="M6 50V30l14-14 14 14v20z"/><path d="M2 32L20 13l18 19"/><path d="M34 34h36v16H34"/><path d="M30 24h44l-4 10H38" /><path d="M13 50V39h14v11M48 50V40h9v10"/>',
    bungalov: '<path d="M8 50V34h60v16z"/><path d="M3 34l16-12h38l16 12z"/><path d="M19 22l6 12M57 22l-6 12" opacity=".55"/><path d="M30 50V39h16v11M14 39h9v6h-9zM54 39h9v6h-9z"/>',
    jednovodni: '<path d="M10 50V22l56-8v36z"/><path d="M5 21l66-10"/><path d="M18 50V38h12v12M44 28h12v7H44zM18 28h12v6H18z"/>',
    ravan: '<path d="M10 50V14h56v36z"/><path d="M7 14h62M7 11h62v3"/><path d="M18 50V37h14v13M44 22h13v8H44zM18 22h14v8H18zM44 37h13v13"/>',
    hala: '<path d="M3 50V25l35-9 35 9v25z"/><path d="M1 25.5 38 15.5l37 10"/><path d="M9 50V35h14v15M30 50V35h14v15" /><path d="M51 30h16v4H51z"/><path d="M12 28v7M18 26.5v8.5M24 25v10" opacity=".45"/>'
  };
  function houseSvg(id) { return '<svg viewBox="0 0 76 56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + HOUSE_SVG[id] + '<path d="M0 50.5h76" opacity=".4"/></svg>'; }

  var ENV_SVG = {
    studio: '<defs><linearGradient id="kEnvSt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--hero-wall-1)"/><stop offset=".62" stop-color="var(--hero-wall-2)"/><stop offset="1" stop-color="var(--hero-floor-2)"/></linearGradient></defs><rect width="120" height="76" fill="url(#kEnvSt)"/><path d="M40 56V40l18-12 18 12v16z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M34 41l24-17 24 17" fill="none" stroke="currentColor" stroke-width="1.4"/><ellipse cx="58" cy="58" rx="30" ry="2.4" fill="currentColor" opacity=".18"/>',
    predgradje: '<rect width="120" height="76" fill="#bcd6f2"/><path d="M0 52h120v24H0z" fill="#6d9a45"/><path d="M14 52V36l11-8 11 8v16z" fill="#f1efe8"/><path d="M11 37l14-11 14 11z" fill="#4a4f56"/><path d="M78 52V40l13-7 13 7v12z" fill="#ece7dc"/><path d="M75 41l16-9 16 9z" fill="#7a4a3c"/><circle cx="56" cy="38" r="12" fill="#4f7f3c"/><circle cx="112" cy="42" r="9" fill="#5b8a44"/><path d="M0 52h120v5H0z" fill="#3f6b2c"/>',
    ravnica: '<rect width="120" height="76" fill="#c6dcf3"/><path d="M0 46h120v30H0z" fill="#c9b867"/><path d="M0 52h120v24H0z" fill="#8aa04f"/><path d="M0 60h120v16H0z" fill="#6f8f3f"/><path d="M0 45.5h120" stroke="#6a8d59" stroke-width="2"/><ellipse cx="92" cy="40" rx="2.4" ry="7" fill="#58794e"/><ellipse cx="99" cy="40" rx="2.4" ry="8" fill="#58794e"/><ellipse cx="106" cy="41" rx="2.2" ry="6" fill="#58794e"/>',
    brdovito: '<rect width="120" height="76" fill="#bfd6ee"/><path d="M0 46l22-16 20 10 24-20 26 18 28-12v50H0z" fill="#a9bdd0"/><path d="M0 52l30-14 26 12 30-16 34 14v28H0z" fill="#6b8b84"/><path d="M0 58l40-10 36 8 44-10v30H0z" fill="#567a55"/><path d="M0 64h120v12H0z" fill="#4f7a34"/>'
  };

  /* ---- section drawing of the profile (true proportions, mm) ----------------- */
  function sectionSvg(prof, big) {
    var pts = TK.geo.profilePoints(prof), span = prof.tile ? prof.pitch * 2.6 : prof.pitch * 2 + prof.crown + 2 * prof.web + 0.03;
    var mm = function (v) { return v * 1000; }, W = mm(span), pad = big ? 46 : 30, Hh = mm(prof.h) + (prof.tile ? 4 : 0);
    var sc = (big ? 460 : 330) / W, vbW = W * sc + 20, vbH = Hh * sc + pad * 2 + (big ? 30 : 16), y0 = pad + Hh * sc + (big ? 8 : 4);
    var d = '', i, x0 = 10;
    for (i = 0; i < pts.length && pts[i].x <= span + 1e-6; i++) d += (i ? 'L' : 'M') + (x0 + mm(pts[i].x) * sc).toFixed(1) + ' ' + (y0 - mm(pts[i].h) * sc).toFixed(1);
    var c1 = prof.tile ? 0.04 : prof.web + prof.crown / 2, c2 = c1 + prof.pitch;
    var xa = x0 + mm(c1) * sc, xb = x0 + mm(c2) * sc, yd = y0 + (big ? 22 : 16), yt = y0 - Hh * sc;
    var xh = x0 + mm(c2 + (prof.tile ? 0.05 : prof.crown / 2 + prof.web) + 0.012) * sc + 8;
    var s = '<svg class="k-sec' + (big ? ' k-sec--big' : '') + '" viewBox="0 0 ' + vbW.toFixed(0) + ' ' + vbH.toFixed(0) + '" role="img" aria-label="' + t('k.ui.secAria', { p: esc(prof.name) }) + '">';
    s += '<path d="' + d + '" fill="none" stroke="var(--k-ink)" stroke-width="' + (big ? 2.2 : 1.8) + '" stroke-linejoin="round"/>';
    s += '<g stroke="var(--fg-faint)" stroke-width="0.8" fill="none">';
    s += '<path d="M' + xa + ' ' + (yt - 4) + 'V' + (yd + 4) + 'M' + xb + ' ' + (yt - 4) + 'V' + (yd + 4) + '" stroke-dasharray="2 3"/>';
    s += '<path d="M' + xa + ' ' + yd + 'H' + xb + '"/><path d="M' + (xa + 5) + ' ' + (yd - 3) + 'L' + xa + ' ' + yd + 'l5 3M' + (xb - 5) + ' ' + (yd - 3) + 'L' + xb + ' ' + yd + 'l-5 3"/>';
    s += '<path d="M' + (xh - 6) + ' ' + yt + 'H' + (xh + 6) + 'M' + (xh - 6) + ' ' + y0 + 'H' + (xh + 6) + 'M' + xh + ' ' + yt + 'V' + y0 + '"/>';
    s += '</g><g class="k-sec__t">';
    s += '<text x="' + ((xa + xb) / 2) + '" y="' + (yd + (big ? 15 : 13)) + '" text-anchor="middle">' + dec1(+(prof.pitch * 1000).toFixed(1)) + '</text>';
    s += '<text x="' + (xh + 10) + '" y="' + ((yt + y0) / 2 + 4) + '">' + Math.round(prof.h * 1000) + '</text>';
    s += '</g></svg>';
    return s;
  }
  UI.sectionSvg = sectionSvg;

  /* ---- option builders ---------------------------------------------------------- */
  function opt(key, val, inner, sel, cls, extra) {
    return '<button type="button" class="k-opt ' + (cls || '') + (sel ? ' is-sel' : '') + '" data-set="' + key + '" data-val="' + esc(val) + '" aria-pressed="' + (sel ? 'true' : 'false') + '"' + (extra || '') + '>' + inner + (sel ? CHECK : '') + '</button>';
  }
  function img(src) { return '<span class="k-opt__img"><img src="' + src + '" alt="" width="144" height="112"></span>'; }
  function loupe(kind, id, spec) { return A.noGL ? '' : ' data-loupe="' + esc(JSON.stringify([kind, id, spec || 0])) + '"'; }
  function head(t, sub2) { return '<h3 class="k-h">' + t + (sub2 ? ' <span>' + sub2 + '</span>' : '') + '</h3>'; }
  function seg(key, items, cur, num, dis) {
    return '<div class="k-seg" role="group">' + items.map(function (it) {
      var on = String(cur) === String(it[0]), off = dis && dis(it[0]);
      return '<button type="button" data-set="' + key + '" data-val="' + esc(it[0]) + '"' + (num ? ' data-num="1"' : '') + ' class="' + (on ? 'is-sel' : '') + '" aria-pressed="' + on + '"' + (off ? ' disabled title="' + esc(off) + '"' : '') + '>' + esc(it[1]) + '</button>';
    }).join('') + '</div>';
  }
  function sw(key, on, label, note, dis) {
    return '<button type="button" class="k-sw' + (on ? ' is-on' : '') + '" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" data-set="' + key + '" data-val="' + (on ? 0 : 1) + '" data-num="1"' + (dis ? ' disabled' : '') + '><span class="k-sw__t"><i></i></span><span class="k-sw__l">' + label + (note ? '<small>' + note + '</small>' : '') + '</span></button>';
  }
  // RAL colours as live samples of the real coated sheet (curved, under the current light)
  function ralGrid(key, cur, codes, live) {
    var out = '';
    D.ral.forEach(function (g) {
      var items = g.items.filter(function (r) { return !codes || codes.indexOf(r.c) >= 0; });
      if (!items.length) return;
      if (!codes) out += '<p class="k-fam">' + g.fam + '</p>';
      out += '<div class="k-ral">' + items.map(function (r) {
        var sp = { mat: 'plast', ral: r.c };
        var sample = live && !A.noGL ? '<img class="k-ralb__s" src="' + A.thumb('swatch', 'ral', sp, 104, 60) + '" alt="" width="104" height="60">' : '<i style="background:' + r.hex + '"></i>';
        return '<button type="button" class="k-ralb' + (cur === r.c ? ' is-sel' : '') + '" data-set="' + key + '" data-val="' + r.c + '" aria-pressed="' + (cur === r.c) + '" title="RAL ' + r.c + ' ' + r.n + '"' + (live ? loupe('swatch', 'ral', sp) : '') + '>' + sample + '<b>RAL ' + r.c + '</b><span>' + r.n + '</span>' + (cur === r.c ? CHECK : '') + '</button>';
      }).join('') + '</div>';
    });
    return out;
  }
  function range(id, key, val, label, lo, hi, unit) {
    return '<div class="k-range"><label for="' + id + '">' + label + ' <output id="' + id + 'Out">' + (unit === '%' ? t('k.as.pct', { v: val }) : val + ' ' + unit) + '</output></label><input id="' + id + '" type="range" min="0" max="100" step="5" value="' + val + '" data-range="' + key + '"><div class="k-range__s"><span>' + lo + '</span><span>' + hi + '</span></div></div>';
  }
  // a dimension: slider + value; the model is rebuilt when the slider is released (or on every arrow key)
  function dim(key, label, val, r, step, unit, dec) {
    var id = 'kd-' + key;
    return '<div class="k-range k-dim"><label for="' + id + '">' + label + ' <output id="' + id + 'Out">' + fmt(val, dec) + ' ' + unit + '</output></label>' +
      '<input id="' + id + '" type="range" min="' + r[1] + '" max="' + r[2] + '" step="' + step + '" value="' + val + '" data-dim="' + key + '" data-dec="' + dec + '" data-unit="' + unit + '">' +
      '<div class="k-range__s"><span>' + fmt(r[1], dec) + '</span><span>' + fmt(r[2], dec) + ' ' + unit + '</span></div></div>';
  }
  // a profile with a restricted RAL choice (D.profileRal, e.g. TR 10): only those colours, and a note when the
  // current colour (old link / saved variant) is no longer offered — it is kept until the visitor chooses again
  function ralLimit(prof, cur) {
    var codes = D.profileRal[prof] || null, name = (D.find(D.profiles, prof) || {}).name || prof, note = '';
    if (codes) {
      note = '<p class="k-note">' + esc(t('calc.colour.limited', { name: name, list: codes.map(function (c) { return 'RAL ' + c; }).join(', ') })) + '</p>';
      if (cur && codes.indexOf(String(cur)) < 0) note += '<p class="k-note" role="alert">⚠ ' + esc(t('calc.colour.obsolete', { ral: cur, name: name })) + '</p>';
    }
    return { codes: codes, note: note };
  }
  function finishBlock(keyMat, keyRal, keyPat, spec, prof) {
    var s = '<div class="k-grid k-grid--3">';
    D.finishes.forEach(function (f) {
      var sp = { mat: f.id, ral: spec.ral, patina: f.id === 'bakar' ? spec.patina : 0, age: f.id === 'cink' ? spec.age : 0 };
      s += opt(keyMat, f.id, img(A.thumb('swatch', f.id, sp)) + '<span class="k-opt__l">' + f.short + '</span>', spec.mat === f.id, '', loupe('swatch', f.id, sp));
    });
    s += '</div>';
    if (!A.noGL) s += '<p class="k-hint">' + ZOOM + t('k.ui.loupeHint') + '</p>';
    if (spec.mat === 'plast') { var lim = ralLimit(prof, spec.ral); s += head(t('k.ui.colour'), 'RAL Classic') + lim.note + ralGrid(keyRal, spec.ral, lim.codes, true); }
    if (spec.mat === 'bakar') s += range('kPat', keyPat, spec.patina || 0, t('k.ui.patina'), t('k.ui.patina0'), t('k.ui.patina1'), '%');
    if (spec.mat === 'cink') s += range('kAge', 'starenje', spec.age || 0, t('k.ui.age'), t('k.ui.age0'), t('k.ui.age1'), '%');
    return s;
  }
  function minSlopeNote(s, prof) {
    var deg = TK.house.dims(s).p;
    return deg < prof.minSlope ? '<p class="k-note k-note--bad">' + t('k.ui.minSlope', { d: Math.round(deg), p: esc(prof.name), m: prof.minSlope }) + '</p>' : '';
  }

  /* ---- panels ---------------------------------------------------------------------- */
  var PANELS = {
    1: function (s) {
      var dm = TK.house.dims(s), hd = dm.def.dims, hip = s.kuca === 'cetvorovodni' || s.kuca === 'bungalov', h = '';
      h += '<div class="k-grid k-grid--types">' + D.houses.map(function (x) {
        return opt('kuca', x.id, '<span class="k-opt__img k-opt__img--svg">' + houseSvg(x.id) + '</span><span class="k-opt__l">' + x.name + '<small>' + x.sub + '</small></span>', s.kuca === x.id);
      }).join('') + '</div>';
      h += head(t('k.ui.dims'), t('k.ui.dimsSub'));
      h += dim('duz', t(s.kuca === 'hala' ? 'k.ui.lenHall' : 'k.ui.len'), dm.L, hd.L, 0.1, 'm', 1);
      h += dim('sir', t(s.kuca === 'hala' ? 'k.ui.span' : 'k.ui.width'), dm.W, hip ? [hd.W[0], hd.W[1], Math.min(hd.W[2], dm.L)] : hd.W, 0.1, 'm', 1);
      if (hd.hv) h += dim('hv', t('k.ui.eaveH'), dm.hv, hd.hv, 0.1, 'm', 1);
      if (hd.p[1] !== hd.p[2]) h += dim('nagib', t('k.ui.pitch'), dm.p, hd.p, 1, '°', 0);
      else h += '<p class="k-note">' + t('k.ui.flatNote', { p: hd.p[0] }) + '</p>';
      if (hd.oe && !(s.kuca === 'hala' && +s.hpar)) h += dim('prep', t('k.ui.overhang'), dm.oe, hd.oe, 0.05, 'm', 2);
      if (hd.og && !(s.kuca === 'hala' && +s.hpar)) h += dim('zab', t('k.ui.overhangG'), dm.og, hd.og, 0.05, 'm', 2);
      if (s.kuca === 'hala') {
        h += head(t('k.ui.hall')) + seg('hk', [[2, t('k.ui.hall2')], [1, t('k.ui.hall1')]], +s.hk === 1 ? 1 : 2, true);
        h += '<div class="k-rows">' + sw('hpar', !!+s.hpar, t('k.ui.hpar'), t('k.ui.hparSub')) + sw('hzid', !!+s.hzid, t('k.ui.hzid'), t('k.ui.hzidSub')) + '</div>';
        if (+s.hzid) {
          var walls = D.profiles.filter(function (p) { return p.use !== 'roof'; });
          h += head(t('k.ui.hzp')) + seg('hzp', walls.map(function (p) { return [p.id, p.name]; }), s.hzp);
          var wl = ralLimit(s.hzp, s.hzb); h += head(t('k.ui.hzb'), 'RAL') + wl.note + ralGrid('hzb', s.hzb, wl.codes || D.lamperijaRal.concat(['9010', '7035']), false);
        }
      }
      if (s.kuca === 'dvovodni') {
        var dmr = TK.house.dormer(s);
        h += '<div class="k-rows">' + sw('badza', dmr.on, t('k.ui.dormer'), t(dmr.ok ? 'k.ui.dormerOk' : 'k.ui.dormerNo'), !dmr.ok) + '</div>';
      }
      h += '<p class="k-note">' + t('k.ui.dimNote') + '</p>';
      return h;
    },
    2: function (s) {
      var prof = D.find(D.profiles, s.krov), spec = A.roofSpec(), deg = TK.house.dims(s).p, hall = s.kuca === 'hala';
      var h = '<div class="k-plate">' + sectionSvg(prof) + '<dl class="k-dims"><div><dt>' + t('k.ui.ribH') + '</dt><dd>' + Math.round(prof.h * 1000) + ' mm</dd></div><div><dt>' + t(prof.tile ? 'k.ui.wave' : 'k.ui.step') + '</dt><dd>' + dec1(+(prof.pitch * 1000).toFixed(1)) + ' mm</dd></div><div><dt>' + t('k.ui.cover') + '</dt><dd>' + dec1(+(prof.useful * 1000).toFixed(1)) + ' mm</dd></div><div><dt>' + t('k.ui.minPitch') + '</dt><dd>' + prof.minSlope + '°</dd></div></dl></div>';
      h += minSlopeNote(s, prof);
      h += head(t('k.ui.profile'), hall ? t('k.ui.hallOnly', { d: Math.round(deg) }) : '') + '<div class="k-grid k-grid--3">' + D.profiles.filter(function (p) { return p.use !== 'wall'; }).map(function (p) {
        var bad = deg < p.minSlope, off = hall && bad;
        return opt('krov', p.id, img(A.thumb('sheet', p.id, spec)) + '<span class="k-opt__l">' + p.name + '<small>' + (bad ? (off ? t('k.ui.slopeFrom', { m: p.minSlope }) : '⚠ min. ' + p.minSlope + '°') : t('k.ui.from', { m: p.minSlope })) + '</small></span>', s.krov === p.id, bad ? 'is-warn' : '', loupe('sheet', p.id, spec) + (off ? ' disabled title="' + t('k.ui.minTitle', { m: p.minSlope }) + '"' : ''));
      }).join('') + '</div><p class="k-note">' + esc(prof.note) + '</p>';
      h += head(t('k.ui.material')) + finishBlock('mat', 'boja', 'patina', spec, s.krov);
      var th = D.thicknesses(s.krov, s.mat), cur = +s.deb > 0 ? +s.deb : D.find(D.catalog.materials, s.mat).defaultThickness;
      h += head(t('k.ui.thick'), 'mm') + seg('deb', th.map(function (t) { return [t, fmt(t, 2)]; }), cur, true);
      h += head(t('k.ui.ridge')) + seg('sleme', D.ridgeTypes.map(function (r) { return [r.id, r.name]; }), s.sleme);
      if (!A.noGL) h += head(t('k.ui.sample'), t('k.ui.sampleSub')) + '<div class="k-inset"><canvas id="kInset" width="640" height="400" role="img" aria-label="' + t('k.ui.sampleAria') + '"></canvas></div>';
      return h;
    },
    3: function (s) {
      var spec = A.gutterSpec(), pr = A.house.pipeRange, items = [['auto', 'Auto (' + pr.auto + ')']], i;
      var h = head(t('k.ui.gutter')) + '<div class="k-grid">' + D.gutters.map(function (g) {
        return opt('oluk', g.id, img(A.thumb('gutter', g.id, spec)) + '<span class="k-opt__l">' + g.name + '</span>', s.oluk === g.id);
      }).join('') + '</div>';
      h += head(t('k.ui.pipe')) + '<div class="k-grid k-grid--3">' + D.pipes.map(function (g) {
        return opt('cev', g.id, img(A.thumb('pipe', g.id, spec)) + '<span class="k-opt__l">' + g.name + '</span>', s.cev === g.id);
      }).join('') + '</div>';
      for (i = pr.min; i <= pr.max; i++) items.push([String(i), String(i)]);
      h += head(t('k.ui.pipes'), t('k.ui.pipesSub', { v: fmt(D.rules.downpipeEvery, 0) })) + seg('vert', items, s.vert);
      var ro = TK.weather.readout(A.house, s);
      h += '<div class="k-cap' + (ro.ok ? '' : ' is-bad') + '"><b>' + esc(ro.text) + '</b><small>' + esc(ro.sub) + '</small>' + (A.noGL ? '' : '<button type="button" class="k-linkb" data-mode="kisa">' + t(A.modes.kisa ? 'k.ui.rainStop' : 'k.ui.rainGo') + '</button>') + '</div>';
      h += head(t('k.ui.matCol')) + '<div class="k-rows">' + sw('uskladi', !!s.uskladi, t('k.ui.asRoof'), t('k.ui.asRoofSub')) + '</div>';
      if (!s.uskladi) h += finishBlock('omat', 'oboja', 'opatina', spec);
      h += '<p class="k-note">' + t('k.ui.gutNote', { f: D.rules.gutterFall, h: fmt(D.rules.hookSpacing, 1), c: fmt(D.rules.clampSpacing, 1) }) + '</p>';
      return h;
    },
    4: function (s) {
      var cur = T.inspecting(), auto = A.house.qty.snowRows;
      var h = A.noGL ? '' : '<p class="k-hint">' + ZOOM + t('k.ui.detHint') + '</p>';
      h += '<div class="k-rows k-rows--det">' + D.details.map(function (d) {
        var ok = TK.house.applies(d.id, s.kuca, s), on = ok && s.detalji.indexOf(d.id) >= 0;
        var extra = '';
        if (d.id === 'snego' && on) extra = '<div class="k-det__x">' + seg('sneg', [['auto', 'Auto'], [0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4']], s.sneg === undefined ? 'auto' : s.sneg) + '<small>' + t('k.ui.snowRows', { n: auto }) + '</small></div>';
        return '<div class="k-det' + (cur && cur.id === d.id ? ' is-cur' : '') + '"><div class="k-det__m"><button type="button" class="k-sw' + (on ? ' is-on' : '') + '" role="switch" aria-checked="' + on + '"' + (ok ? '' : ' disabled') + ' data-set="detalj:' + d.id + '" data-val="1"><span class="k-sw__t"><i></i></span><span class="k-sw__l">' + d.name + '<small>' + (ok ? d.txt : t('k.ui.na')) + '</small></span></button>' + extra + '</div>' +
          (ok && !A.noGL ? '<button type="button" class="k-det__b" data-inspect="' + d.id + '" aria-label="' + t('k.ui.detAria', { n: esc(d.name) }) + '">' + ZOOM + '<span>' + t('k.ui.det') + '</span></button>' : '') + '</div>';
      }).join('') + '</div><p class="k-note">' + t('k.ui.detNote') + '</p>';
      return h;
    },
    5: function (s) {
      var h = '<p class="k-note k-note--muted">' + t('k.ui.lookNote') + '</p>';
      h += '<div class="k-subtabs" role="tablist" aria-label="' + t('k.step.5.label') + '">' + [t('k.ui.tab0'), t('k.ui.tab1'), t('k.ui.tab2')].map(function (t, i) {
        return '<button type="button" role="tab" data-sub="' + i + '" aria-selected="' + (sub === i) + '" class="' + (sub === i ? 'is-sel' : '') + '">' + t + '</button>';
      }).join('') + '</div>';
      if (sub === 0) h += facade(s);
      else if (sub === 1) h += frames(s);
      else h += envs(s);
      return h;
    },
    6: function (s) {
      var sp = A.spec(), h = '';
      // summary in a glass card whose protruding tab repeats the roof total (copied from the table footer, see specTab)
      h += '<div class="k-card k-card--tab"><div class="k-spechead"><p class="mono">' + esc(sp.code) + '</p><p class="k-spechead__t">' + t('k.ui.specHead') + '</p></div>';
      h += TK.spec.html(sp, { summary: true, only: 'summary' });
      h += '<span class="k-card__tab" id="kSpecTab" aria-hidden="true">' + t('k.sp.total') + ' <b></b></span></div>';
      h += TK.spec.html(sp, { only: 'tables' });
      h += '<div class="k-acts">';
      h += '<a class="btn btn--block" data-quote href="' + P('kontakt.html#upit') + '">' + t('k.ui.send') + ' ' + ARROW + '</a>';
      h += '<button type="button" class="btn btn--ghost btn--block" data-act="pdf">' + t('k.ui.pdf') + '</button>';
      h += '<div class="k-acts__row"><button type="button" class="k-chip" data-act="copy">' + t('k.ui.copyLink') + '</button><button type="button" class="k-chip" data-act="add">' + t('k.ui.addList') + '</button><button type="button" class="k-chip" data-act="copybom">' + t('k.ui.copySpec') + '</button></div>';
      h += '</div>';
      h += listHtml();
      return h;
    }
  };
  function facade(s) {
    var house = D.find(D.houses, s.kuca), key = zone === 0 ? 'fasada' : 'zona' + zone, curStr = zone === 0 ? s.fasada : (s['zona' + zone] || ''), cur = curStr ? TK.mat.parseFacade(curStr) : null;
    var h = '';
    if (s.kuca === 'hala' && +s.hzid) h += '<p class="k-note">' + t('k.ui.hallFacade') + '</p>';
    if (house.zones.length > 1) h += '<div class="k-zones" role="radiogroup" aria-label="' + t('k.ui.zoneAria') + '">' + house.zones.map(function (z, i) {
      return '<button type="button" role="radio" aria-checked="' + (zone === i) + '" class="' + (zone === i ? 'is-sel' : '') + '" data-zone="' + i + '"><i></i>' + z + '</button>';
    }).join('') + '</div>';
    if (zone > 0) h += '<div class="k-rows"><button type="button" class="k-sw' + (!curStr ? ' is-on' : '') + '" role="switch" aria-checked="' + (!curStr) + '" data-set="' + key + '" data-val="' + (curStr ? '' : s.fasada) + '"><span class="k-sw__t"><i></i></span><span class="k-sw__l">' + t('k.ui.sameAs') + '</span></button></div>';
    h += head(t('k.ui.cladding')) + '<div class="k-grid">' + D.facades.map(function (f) {
      var col = cur && cur.type === f.id ? cur.color : (f.ral ? '7016' : f.colors[0].id), val = f.id + '.' + col;
      return opt(key, val, img(A.thumb('facade', val)) + '<span class="k-opt__l">' + f.name + '</span>', !!cur && cur.type === f.id, '', loupe('facade', val));
    }).join('') + '</div>';
    if (cur) {
      h += head(t('k.ui.colour'));
      if (cur.def.ral) h += ralGrid(key + '|' + cur.type, cur.color, D.lamperijaRal);
      else h += '<div class="k-ral">' + cur.def.colors.map(function (c) {
        return '<button type="button" class="k-ralb' + (cur.color === c.id ? ' is-sel' : '') + '" data-set="' + key + '" data-val="' + cur.type + '.' + c.id + '" aria-pressed="' + (cur.color === c.id) + '"><i style="background:' + c.hex + '"></i><b>' + c.n + '</b>' + (cur.color === c.id ? CHECK : '') + '</button>';
      }).join('') + '</div>';
    }
    h += '<p class="k-note">' + t('k.ui.lamNote') + '</p>';
    return h;
  }
  function frames(s) {
    return '<div class="k-ral k-ral--frames">' + D.frames.map(function (f) {
      return '<button type="button" class="k-ralb k-ralb--big' + (s.prozori === f.id ? ' is-sel' : '') + '" data-set="prozori" data-val="' + f.id + '" aria-pressed="' + (s.prozori === f.id) + '"><i style="background:' + (f.wood ? 'repeating-linear-gradient(92deg,' + f.hex + ' 0 7px, rgba(0,0,0,.14) 7px 8px),' + f.hex : f.hex) + '"></i><b>' + f.n + '</b>' + (s.prozori === f.id ? CHECK : '') + '</button>';
    }).join('') + '</div><p class="k-note">' + t('k.ui.frameNote') + '</p>';
  }
  function envs(s) {
    var h = '<div class="k-grid">' + D.envs.map(function (e) {
      return opt('okolina', e.id, '<span class="k-opt__img"><svg viewBox="0 0 120 76" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + ENV_SVG[e.id] + '</svg></span><span class="k-opt__l">' + e.name + '<small>' + e.sub + '</small></span>', s.okolina === e.id);
    }).join('') + '</div>';
    if (A.noGL) return h + '<p class="k-note">' + t('k.ui.envNoGL') + '</p>';
    h += head(t('k.ui.tod')) + '<div class="k-range k-range--time"><label for="kSat"><span class="k-sun" id="kSunIco">' + sunIcon(s.sat) + '</span><output id="kSatOut">' + hhmm(s.sat) + '</output></label><input id="kSat" type="range" min="6" max="22" step="0.5" value="' + s.sat + '" data-range="sat"><div class="k-range__s"><span>06:00</span><span>14:00</span><span>22:00</span></div></div>';
    h += seg('sat', [[7, t('k.ui.t7')], [12, t('k.ui.t12')], [15, t('k.ui.t15')], [19, t('k.ui.t19')], [22, t('k.ui.t22')]], s.sat, true);
    h += '<button type="button" class="k-play" id="kPlayDay" aria-pressed="false"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>' + t('k.ui.playDay') + '</span><small>' + t('k.ui.playDaySub') + '</small></button>';
    h += head(t('k.ui.date'), t('k.ui.dateSub')) + seg('datum', D.dates.map(function (d) { return [d.id, d.name]; }), s.datum);
    var el = TK.env.sunAt(s.sat, s.datum).el;
    h += '<p class="k-note" id="kSunNote">' + sunNote(s, el) + '</p>';
    return h;
  }
  function hhmm(v) { var h = Math.floor(v + 1e-6), m = Math.round((v - h) * 60); if (m === 60) { h++; m = 0; } return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  function sunIcon(v) {
    var el = A && !A.noGL ? TK.env.sunAt(v, A.state.datum).el : 10;
    return el < -2
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>';
  }
  function sunNote(s, el) {
    var d = D.find(D.dates, s.datum);
    return d.name + ' (' + d.sub + '), ' + hhmm(s.sat) + ' — ' + (el > 0 ? t('k.ui.sunUp', { e: Math.round(el) }) : t('k.ui.sunDown')) + (A.modes.zima ? t('k.ui.sunWinter') : '') + (TK.env.isStudio() ? t('k.ui.sunStudio') : '');
  }

  /* ---- inquiry list -------------------------------------------------------------------- */
  function listHtml() {
    var l = A.list.get();
    var h = '<section class="k-list" aria-labelledby="kListH"><h3 class="k-h" id="kListH">' + t('k.ui.list') + ' <span>' + l.length + t(l.length === 1 ? 'k.ui.var1' : 'k.ui.varN') + t('k.ui.listKept') + '</span></h3>';
    if (!l.length) return h + '<p class="k-note">' + t('k.ui.listEmpty') + '</p></section>';
    h += '<ol class="k-list__l">' + l.map(function (x, i) {
      return '<li><span class="k-list__n mono">' + String(i + 1).padStart(2, '0') + '</span><span class="k-list__b"><b>' + esc(A.list.label(x)) + '</b><small class="mono">' + esc(x.kind === 'calc' && window.TricomCalcUI ? window.TricomCalcUI.itemCode(x) : x.code) + ' · ' + esc(x.date) + '</small></span><button type="button" class="k-linkb" data-list-open="' + esc(x.id) + '">' + t('k.ui.open') + '</button><button type="button" class="k-list__x" data-list-del="' + esc(x.id) + '" aria-label="' + t('k.ui.remove', { n: esc(A.list.label(x)) }) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></li>';
    }).join('') + '</ol>';
    h += '<a class="btn btn--block" data-quote-all href="' + P('kontakt.html#upit') + '">' + t('k.ui.sendAll', { n: l.length }) + ' ' + ARROW + '</a></section>';
    return h;
  }
  function listBadge() {
    var n = A.list.get().length, b = $('#kListBtn');
    if (!b) return;
    b.querySelector('.k-badge').textContent = n;
    b.classList.toggle('has-items', n > 0);
    // ime iz vidljivog teksta („Lista za upit 2“) + skriven nastavak „ varijante“ (WCAG 2.5.3)
    var sr = b.querySelector('.k-badge-sr');
    if (!sr) { sr = document.createElement('span'); sr.className = 'sr-only k-badge-sr'; b.appendChild(sr); }
    sr.textContent = t(n === 1 ? 'k.ui.var1' : 'k.ui.varN');
    b.removeAttribute('aria-label');
  }

  /* ---- panel open / close ------------------------------------------------------------ */
  function renderPanel() {
    var n = A.step;
    if (!n) return;
    var st = body.scrollTop, def = D.steps[n - 1];
    $('#kPanelNo').textContent = '0' + n;
    $('#kPanelTitle').textContent = def.title + (A.cmp.on ? ' — ' + (A.cmp.active ? 'B' : 'A') : '');
    panel.classList.toggle('is-secondary', !!def.secondary);
    body.innerHTML = PANELS[n](A.state);
    body.scrollTop = st;
    setupInset();
    if (n === 5 && sub === 2) UI.dayState(T.playing());
    if (n === 6) specTab();
  }
  // step 06: the card tab shows the covered m² already printed in the roof table footer (DOM copy, no new arithmetic)
  function specTab() {
    var tab = $('#kSpecTab b', body), tb = $('.k-tbl--roof', body);
    if (!tab || !tb) return;
    var i = -1, foot = $('tfoot tr', tb);
    $$('thead th', tb).forEach(function (th, k) { if (th.textContent === t('k.sp.th.covered')) i = k; });
    if (i < 0 || !foot || !foot.children[i]) return;
    tab.textContent = foot.children[i].textContent + ' m²';
  }
  function markRail(n) {
    $$('.k-rail__b', rail).forEach(function (b) { var on = +b.dataset.step === n; b.classList.toggle('is-active', on); b.setAttribute('aria-expanded', on); if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    rail.style.setProperty('--i', n ? n - 1 : 0);
    rail.classList.toggle('has-active', !!n);
    $$('.k-hot', hot).forEach(function (b) { b.classList.toggle('is-active', +b.dataset.step === n); });
  }
  UI.open = function (n) {
    if (A.step === n) return;
    if (T.inspecting && T.inspecting()) T.inspect(null);
    A.step = n; zone = n === 5 ? zone : 0;
    panel.classList.add('is-open'); document.body.classList.add('k-open');
    document.body.classList.toggle('k-wide', n === 6 && window.innerWidth >= 1100);
    panel.setAttribute('aria-hidden', 'false'); panel.inert = false;
    markRail(n);
    body.scrollTop = 0;
    renderPanel();
    syncInset();
    A.fly(n === 1 ? 'home' : 'step' + n);
    placeCompare();
    closeMenus();
  };
  UI.close = function () {
    if (!A.step) return;
    if (A.noGL) return;                    // without 3D the panel is the page
    if (T.inspecting && T.inspecting()) T.inspect(null);
    A.step = 0;
    panel.classList.remove('is-open'); document.body.classList.remove('k-open', 'k-wide');
    panel.setAttribute('aria-hidden', 'true'); panel.inert = true;
    markRail(0);
    setupInset();
    syncInset();
    A.fly(A.modes.kote ? 'kote' : 'home');
    placeCompare();
  };
  function railW() { return isMobile() || !rail ? 0 : rail.offsetWidth; }
  function syncInset() {
    if (!A.step) { A.setPanelInset(0, 0, railW()); return; }
    if (isMobile()) A.setPanelInset(0, Math.round(window.innerHeight * sheetH), 0);
    else A.setPanelInset(document.body.classList.contains('k-wide') ? Math.min(660, window.innerWidth * 0.5) : panel.classList.contains('is-open') ? 404 : 0, 0, railW());     // target widths (the panel animates its width)
  }

  /* ---- step 02: rotating sample of the chosen sheet and gutter --------------------------- */
  function setupInset() {
    if (inset) { inset.group.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); inset = null; A.onFrame = null; }
    var c = $('#kInset');
    if (A.step !== 2 || !c || A.noGL) return;
    var g = new THREE.Group(), sheet = A.sample('sheet', A.state.krov, A.roofSpec()), gut = A.sample('gutter', A.state.oluk, A.gutterSpec(), 1.24);
    gut.position.set(0, -0.03, 0.385); g.add(sheet, gut);        // under the eave, as built
    inset = { group: g, ctx: c.getContext('2d'), t0: performance.now(), last: 0 };
    A.onFrame = function (now) {
      if (!inset) return false;
      if (reduce && inset.last) return false;
      if (now - inset.last < 40) return true;                 // ~25 fps is plenty for the small viewer
      inset.last = now;
      g.rotation.y = reduce ? 0.6 : 0.6 + Math.sin((now - inset.t0) / 1000 * 0.45) * 1.15;      // swings instead of spinning: the eave stays in view
      A.thumbDraw(g, inset.ctx, 320, 200, new THREE.Vector3(0.25, 0.42, 1), 0xe9edf2, 0.66);
      return true;
    };
    A.invalidate();
  }

  /* ---- refresh after a state change ------------------------------------------------------- */
  UI.refresh = function () {
    renderPanel();
    UI.refreshTop();
    placeCompare();
    listBadge();
    if (A.noGL) A.poster();
  };
  UI.refreshTop = function () {
    if (A.noGL) return;
    var night = TK.env.sunAt(A.state.sat, A.state.datum).el < -2, dn = $('#kDayNight');
    dn.setAttribute('aria-checked', night ? 'true' : 'false'); dn.classList.toggle('is-on', night);
    [['kRain', A.modes.kisa], ['kSnow', A.modes.zima], ['kKote', A.modes.kote], ['kCompare', A.cmp.on], ['kSunPlay', T.playing()], ['kSection', T.sectioning && T.sectioning()], ['kMeasure', T.measuring && T.measuring()]].forEach(function (p) {
      var b = $('#' + p[0]); if (!b) return; b.setAttribute('aria-pressed', p[1] ? 'true' : 'false'); b.classList.toggle('is-on', !!p[1]);
    });
    var tb = $('#kTurnBtn'), ts = T.turning ? T.turning() : 0;
    if (tb) { tb.classList.toggle('is-on', !!ts); $$('#kTurnMenu [data-turn]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.turn === ts && ts > 0 ? 'true' : 'false'); }); }
    var un = $('#kUndo'), rd = $('#kRedo');
    if (un) un.disabled = !A.canUndo(); if (rd) rd.disabled = !A.canRedo();
    var px = $('#kPresentX'); if (px) px.hidden = !A.present;
    var scene = $('#kSceneBtn'); if (scene) scene.classList.toggle('is-on', !!(A.modes.kisa || A.modes.zima || night || T.playing()));
    var ro = $('#kReadout');
    if (A.modes.kisa) {
      var r = TK.weather.readout(A.house, A.state);
      ro.hidden = false; ro.classList.toggle('is-bad', !r.ok);
      ro.innerHTML = '<b>' + esc(r.text) + '</b><small>' + esc(r.sub) + '</small>';
    } else ro.hidden = true;
  };

  /* ---- sun study --------------------------------------------------------------------------- */
  UI.dayState = function (on) {
    var sp = $('#kSunPlay'); if (sp) { sp.setAttribute('aria-pressed', on ? 'true' : 'false'); sp.classList.toggle('is-on', !!on); }
    var b = $('#kPlayDay'); if (!b) return;
    b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('is-on', !!on);
    b.querySelector('span').textContent = t(on ? 'k.ui.stop' : 'k.ui.playDay');
    b.querySelector('path').setAttribute('d', on ? 'M7 5h4v14H7zM13 5h4v14h-4z' : 'M8 5v14l11-7z');
  };
  UI.dayTick = function (h) {
    var o = $('#kSatOut'), r = $('#kSat');
    if (o) { o.textContent = hhmm(Math.min(22, h)); $('#kSunIco').innerHTML = sunIcon(h); }
    if (r) r.value = Math.min(22, h);
    var n = $('#kSunNote'); if (n) n.textContent = sunNote({ datum: A.state.datum, sat: Math.min(22, Math.round(h * 2) / 2) }, TK.env.sunAt(h, A.state.datum).el);
  };

  /* ---- hotspots: one per step ---------------------------------------------------------------- */
  var ANCH = ['terrace', 'roof', 'pipe', 'ridge', 'wall', 'eave'], tmp = null;
  UI.placeHotspots = function (cam, w, h) {
    if (!hot || !A.house) return;
    tmp = tmp || new THREE.Vector3();
    var btns = hot.children, a = A.house.anchors, sx = A.cmp.on ? A.splitX() : 0;
    for (var i = 0; i < btns.length; i++) {
      var p = a[ANCH[i]];
      if (!p) { btns[i].style.display = 'none'; continue; }
      tmp.copy(p).project(cam);
      var x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h, vis = tmp.z < 1 && x > 8 && x < w - 8 && y > 26 && y < h - 8;
      if (A.cmp.on && (A.cmp.active ? x < sx + 16 : x > sx - 16)) vis = false;       // hotspots belong to the active side
      btns[i].style.display = vis ? '' : 'none';
      if (vis) btns[i].style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%)';
    }
  };

  /* ---- compare: divider, side labels ------------------------------------------------------------ */
  function sideLabel(s) { return D.find(D.profiles, s.krov).name + ' · ' + TK.mat.finishLabel(A.roofSpec(s)); }
  function placeCompare() {
    var box = $('#kCmp');
    box.hidden = !A.cmp.on; document.body.classList.toggle('k-cmp-on', A.cmp.on);
    if (!A.cmp.on) return;
    var sx = A.splitX();
    $('#kDivider').style.transform = 'translate3d(' + sx + 'px,0,0)';
    $('#kDivider').setAttribute('aria-valuenow', Math.round(A.cmp.split * 100));
    $$('.k-cmp__side', box).forEach(function (b, i) {
      b.classList.toggle('is-active', A.cmp.active === i); b.setAttribute('aria-pressed', A.cmp.active === i);
      b.querySelector('span').textContent = sideLabel(A.states[i]);
      b.style.left = i ? (sx + 14) + 'px' : ''; b.style.right = i ? '' : 'calc(100% - ' + (sx - 14) + 'px)';
    });
  }
  UI.placeCompare = placeCompare;

  /* ---- toast, share, print ---------------------------------------------------------------------- */
  var toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }
  UI.toast = toast;
  function copyText(text, okMsg) {
    function ok() { UI.lastCopied = text; toast(okMsg); }
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-99px;top:0;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast(t('k.ui.copyFail')); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  }
  UI.copyText = copyText;
  function dd(d) { return TK.en ? d.getDate() + ' ' + t('k.ui.mon' + (d.getMonth() + 1)) + ' ' + d.getFullYear() : ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear() + '.'; }
  // photo: true renders the picture(s) with the photo pipeline (used by the PDF button); otherwise a plain canvas grab
  UI.fillPrint = function (photo) {
    var d = new Date(), two = A.cmp.on, pr = $('#kPrint'), out = '';
    pr.classList.toggle('is-two', two);
    $('#kPrintDate').textContent = dd(d);
    for (var i = 0; i < (two ? 2 : 1); i++) {
      var si = two ? i : A.cmp.active, sp = A.spec(si), shot = photo ? A.printShot(two ? i : undefined) : A.screenshot();
      out += '<article class="k-print__v">' + (two ? '<h2 class="k-print__vt">' + t('k.ui.variant', { v: i ? 'B' : 'A' }) + '</h2>' : '') +
        '<div class="k-print__top"><img class="k-print__img" alt="' + t('k.ui.printAlt') + '" src="' + shot + '"><div class="k-print__meta"><p class="k-print__code">' + esc(sp.code) + '</p>' + TK.spec.html(sp, { summary: true, only: 'summary' }) + '</div></div>' +
        TK.spec.html(sp, { print: true, only: 'tables' }) +
        '<p class="k-print__url">' + t('k.ui.cfgUrl') + esc(A.urlFor(A.serialize(A.states[si]))) + '</p></article>';
    }
    $('#kPrintBody').innerHTML = out;
    UI.printFilled = Date.now();
    return true;
  };
  function doPrint() {
    wait(true, t('k.ui.pdfWait'));
    setTimeout(function () {
      UI.fillPrint(true);
      wait(false);
      var ims = $$('#kPrintBody img'), left = ims.length;
      var go = function () { if (--left <= 0) setTimeout(function () { window.print(); }, 60); };
      if (!left) { left = 1; go(); }
      ims.forEach(function (im) { if (im.complete) go(); else { im.onload = go; im.onerror = go; } });
    }, 40);
  }
  UI.print = doPrint;
  function wait(on, label, p) {
    var w = $('#kWait');
    w.hidden = !on;
    if (label) $('#kWaitTxt').textContent = label;
    $('#kWaitBar').style.transform = 'scaleX(' + (p || 0.05) + ')';
  }
  function doPhoto() {
    var px = A.quality.photo;
    wait(true, t('k.ui.photoWait', { w: px.w, h: px.h }), 0.03);
    setTimeout(function () {
      A.photoDownload(function (p) { wait(true, null, p); }).then(function (r) {
        wait(false); toast(t('k.ui.photoOk', { w: r.w, h: r.h, n: r.name }));
      }, function () { wait(false); toast(t('k.ui.photoFail')); });
    }, 40);
  }

  UI.progress = function (p, label) {
    var l = $('#kLoader'); if (!l) return;
    $('#kLoaderBar').style.transform = 'scaleX(' + p + ')';
    if (label) $('#kLoaderTxt').textContent = label;
    if (p >= 1) { l.classList.add('is-done'); document.body.classList.remove('k-booting'); setTimeout(function () { l.hidden = true; }, 500); }
  };
  UI.fail = function () {
    var l = $('#kLoader'); if (l) l.hidden = true;
    document.body.classList.remove('k-booting');
    $('#kFail').hidden = false;
  };

  /* ---- material loupe: 300 % close-up of the hovered sample ---------------------------------------- */
  var loupeEl, loupeT = 0, loupeKey = '';
  function showLoupe(el) {
    var data = el.getAttribute('data-loupe');
    if (!data || A.noGL) return;
    var d = JSON.parse(data), r = el.getBoundingClientRect(), px = 190;
    if (loupeKey !== data) { loupeKey = data; A.loupe(d[0], d[1], d[2] || undefined, loupeEl.querySelector('canvas').getContext('2d'), px); }
    var x = isMobile() ? Math.max(8, Math.min(window.innerWidth - px - 8, r.left + r.width / 2 - px / 2)) : r.left - px - 22, y = isMobile() ? r.top - px - 36 : Math.max(96, Math.min(window.innerHeight - px - 40, r.top + r.height / 2 - px / 2));
    loupeEl.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(Math.max(8, y)) + 'px,0)';
    loupeEl.hidden = false;
  }
  function hideLoupe() { clearTimeout(loupeT); if (loupeEl) loupeEl.hidden = true; }
  UI.loupeShown = function () { return loupeEl && !loupeEl.hidden ? loupeKey : ''; };

  UI.inspectChanged = function () { if (A.step === 4) renderPanel(); menuDetails(); };

  /* ---- Prikaz toolbar: popover menus ------------------------------------------------------------------ */
  function closeMenus(except) {
    $$('.k-dock [data-pop]').forEach(function (b) {
      var m = $('#' + b.getAttribute('aria-controls'));
      if (m && m !== except) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); }
    });
  }
  function toggleMenu(btn) {
    var m = $('#' + btn.getAttribute('aria-controls')), open = m.hidden;
    closeMenus(m);
    m.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && m.id === 'kDetMenu') menuDetails();
    if (open) { var f = m.querySelector('button'); if (f && !isMobile()) f.focus({ preventScroll: true }); }
  }
  function menuDetails() {
    var m = $('#kDetMenu'); if (!m) return;
    var cur = T.inspecting && T.inspecting();
    m.innerHTML = D.details.filter(function (d) { return TK.house.applies(d.id, A.state.kuca, A.state); }).map(function (d) {
      return '<button type="button" data-inspect="' + d.id + '" aria-pressed="' + !!(cur && cur.id === d.id) + '"' + (cur && cur.id === d.id ? ' class="is-on"' : '') + '><b>' + esc(d.name) + '</b><small>' + t('k.ui.detMenu') + '</small></button>';
    }).join('');
  }

  // primary option of each step, for the arrow keys
  var CYCLE = { 1: ['kuca', function () { return D.houses.map(function (x) { return x.id; }); }], 2: ['krov', function () { var deg = TK.house.dims(A.state).p; return D.profiles.filter(function (p) { return p.use !== 'wall' && (A.state.kuca !== 'hala' || p.minSlope <= deg); }).map(function (p) { return p.id; }); }],
    3: ['oluk', function () { return D.gutters.map(function (x) { return x.id; }); }], 5: ['okolina', function () { return D.envs.map(function (x) { return x.id; }); }] };

  /* ---- build ---------------------------------------------------------------------------------------- */
  UI.build = function () {
    A = TK.app; T = TK.tools;
    panel = $('#kPanel'); body = $('#kPanelBody'); rail = $('#kRail'); hot = $('#kHotspots'); toastEl = $('#kToast'); loupeEl = $('#kLoupe');
    rail.innerHTML = '<span class="k-rail__bar" aria-hidden="true"></span>' + D.steps.map(function (s) {
      return '<button type="button" class="k-rail__b' + (s.secondary ? ' is-secondary' : '') + '" data-step="' + s.n + '" aria-controls="kPanel" aria-expanded="false"><b class="k-rail__n">0' + s.n + '</b><span class="k-rail__l">' + s.label + (s.secondary ? '<small>' + t('k.ui.secondary') + '</small>' : '') + '</span><span class="k-rail__s" aria-hidden="true">' + (s.short || s.label) + '</span></button>';
    }).join('');
    hot.innerHTML = D.steps.map(function (s) { return '<button type="button" class="k-hot" data-step="' + s.n + '" aria-label="0' + s.n + ' ' + esc(s.label) + '"><span>0' + s.n + '</span></button>'; }).join('');
    if (A.noGL) {
      A.poster(); $('#kStill').hidden = false;
      var note = $('#kNoGL');
      if (A.noGLReason === 'low') {        // WebGL works; weak device starts with the picture, 3D one tap away
        note.innerHTML = '<p class="label">' + t('k.nogl.low') + '</p><p>' + t('k.nogl.lowText') + '</p>' +
          '<button type="button" class="btn btn--sm k-nogl3d" id="kGo3D">' + t('k.nogl.on') + '</button>';
        $('#kGo3D').addEventListener('click', A.go3D);
      }
      note.hidden = false;
    }

    rail.addEventListener('click', function (e) { var b = e.target.closest('[data-step]'); if (b) { if (A.step === +b.dataset.step) UI.close(); else UI.open(+b.dataset.step); } });
    hot.addEventListener('click', function (e) { var b = e.target.closest('[data-step]'); if (b) UI.open(+b.dataset.step); });
    $('#kPanelClose').addEventListener('click', UI.close);
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '', typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable);
      if (e.key === 'Escape') {
        if (T.touring && T.touring()) T.tourEnd();
        else if (A.present) T.present(false);
        else if (T.measuring && T.measuring()) T.measure(false);
        else if ($$('.k-pop:not([hidden])').length) closeMenus();
        else if (!$('#kListPop').hidden) listPop(false);
        else if (T.inspecting && T.inspecting()) T.inspect(null);
        else UI.close();
        return;
      }
      if (!typing && (e.ctrlKey || e.metaKey) && !e.altKey && /^[zy]$/i.test(e.key)) {         // undo / redo
        var done = e.key.toLowerCase() === 'y' || e.shiftKey ? A.redo() : A.undo();
        if (done !== undefined) e.preventDefault();
        return;
      }
      if (typing || e.ctrlKey || e.metaKey || e.altKey || (T.touring && T.touring())) return;
      if (/^[1-6]$/.test(e.key)) { UI.open(+e.key); e.preventDefault(); return; }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && A.step && CYCLE[A.step] && !e.target.closest('.k-cmp__div, .k-stage')) {
        var c = CYCLE[A.step], list = c[1](), i = list.indexOf(String(A.state[c[0]]));
        A.set(c[0], list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length]);
        e.preventDefault();
      }
    });

    var dimT = 0;
    function commitDim(r) { var v = +r.value; if (TK.house.dims(A.state)[{ duz: 'L', sir: 'W', nagib: 'p', prep: 'oe', zab: 'og', hv: 'hv' }[r.dataset.dim]] !== v) A.set(r.dataset.dim, v); }
    body.addEventListener('click', function (e) {
      var z = e.target.closest('[data-zone]');
      if (z) { zone = +z.dataset.zone; renderPanel(); return; }
      var sb = e.target.closest('[data-sub]');
      if (sb) { sub = +sb.dataset.sub; renderPanel(); if (sub === 2) A.fly('step5'); else A.fly(sub ? 'window' : 'wall'); return; }
      var qt = e.target.closest('[data-quote]');
      if (qt) { qt.href = A.quoteUrl(); return; }
      var qa = e.target.closest('[data-quote-all]');
      if (qa) { qa.href = A.quoteUrl(A.list.items()); return; }
      var act = e.target.closest('[data-act]');
      if (act) {
        var k = act.dataset.act;
        if (k === 'pdf') doPrint();
        else if (k === 'copy') copyText(A.url(), t('k.ui.linkCopied'));
        else if (k === 'copybom') copyText(TK.spec.text(A.spec(), 0, A.url()) + '\n\n' + D.disclaimer, t('k.ui.specCopied'));
        else if (k === 'add') { var r = A.list.add(); toast(r.bad ? t('calc.colour.obsolete', r.bad[0]) : r.dup ? t('k.ui.dup') : r.ok ? t('k.ui.added', { n: r.list.length }) : t('k.ui.noStore')); renderPanel(); listBadge(); }
        return;
      }
      var lo = e.target.closest('[data-list-open]');
      if (lo) { openListItem(lo.dataset.listOpen); return; }
      var ld = e.target.closest('[data-list-del]');
      if (ld) { A.list.remove(ld.dataset.listDel); renderPanel(); listBadge(); return; }
      var md = e.target.closest('[data-mode]');
      if (md) { A.setMode(md.dataset.mode, !A.modes[md.dataset.mode]); return; }
      var ib = e.target.closest('[data-inspect]');
      if (ib) { inspect(ib.dataset.inspect); return; }
      if (e.target.closest('#kPlayDay')) { T.playDay(); return; }
      var b = e.target.closest('[data-set]');
      if (!b || b.disabled) return;
      hideLoupe();
      var key = b.dataset.set, val = b.dataset.val;
      if (b.dataset.num) val = +val;
      if (key.indexOf('detalj:') === 0) { A.set('detalj', key.slice(7)); return; }
      if (key.indexOf('|') > 0) { var kp = key.split('|'); key = kp[0]; val = kp[1] + '.' + val; }       // facade colour: zoneKey|type + ral
      if (key === 'fasada') { A.state.zona1 = ''; A.state.zona2 = ''; A.state.fasada = null; }   // 'sve površine' overrides the zones
      if (key === 'sat' || key === 'datum') T.stopDay();
      if (key === 'sneg' && val !== 'auto') val = +val;
      if (key === 'deb') val = +val;
      A.set(key, val);
    });
    body.addEventListener('input', function (e) {
      var dr = e.target.closest('[data-dim]');
      if (dr) {
        $('#' + dr.id + 'Out').textContent = fmt(+dr.value, +dr.dataset.dec) + ' ' + dr.dataset.unit;
        return;
      }
      var r = e.target.closest('[data-range]'); if (!r) return;
      var key = r.dataset.range, val = +r.value;
      if (key === 'sat') T.stopDay();
      A.set(key, val, { quiet: true });
      if (key === 'sat') { $('#kSatOut').textContent = hhmm(val); $('#kSunIco').innerHTML = sunIcon(val); $('#kSunNote').textContent = sunNote(A.state, TK.env.sunAt(val, A.state.datum).el); UI.refreshTop(); }
      else $('#' + r.id + 'Out').textContent = t('k.as.pct', { v: val });
    });
    body.addEventListener('change', function (e) {
      var dr = e.target.closest('[data-dim]');
      if (dr) { clearTimeout(dimT); var id = dr.id; commitDim(dr); var again = document.getElementById(id); if (again) again.focus({ preventScroll: true }); return; }
      if (e.target.closest('[data-range]')) UI.refresh();
    });

    // loupe: hover with a mouse, long press on touch
    body.addEventListener('pointerover', function (e) {
      var el = e.target.closest('[data-loupe]');
      if (!el || e.pointerType === 'touch') return;
      clearTimeout(loupeT); loupeT = setTimeout(function () { showLoupe(el); }, 140);
    });
    body.addEventListener('pointerout', function (e) { if (e.pointerType !== 'touch' && e.target.closest('[data-loupe]')) hideLoupe(); });
    body.addEventListener('pointerdown', function (e) {
      var el = e.target.closest('[data-loupe]');
      if (!el || e.pointerType !== 'touch') return;
      clearTimeout(loupeT); loupeT = setTimeout(function () { showLoupe(el); loupeT = setTimeout(hideLoupe, 2400); }, 480);
    });
    body.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch' && loupeEl.hidden) clearTimeout(loupeT); });
    body.addEventListener('scroll', hideLoupe, { passive: true });

    // header: quote, inquiry list
    $('#kQuote').addEventListener('click', function () { this.href = A.quoteUrl(); });
    function listPop(on) {
      var p = $('#kListPop'), b = $('#kListBtn');
      if (on) p.innerHTML = '<div class="k-listpop__h"><b>' + t('k.ui.list') + '</b><button type="button" class="k-panel__x" data-list-close aria-label="' + t('k.ui.closeList') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' + listHtml().replace('<h3 class="k-h" id="kListH">' + t('k.ui.list'), '<h3 class="k-h sr-only" id="kListH">' + t('k.ui.list')) +
        '<button type="button" class="k-chip" data-act-pop="add">' + t('k.ui.addCurrent') + '</button>';
      p.hidden = !on; b.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    $('#kListBtn').addEventListener('click', function (e) { e.stopPropagation(); listPop($('#kListPop').hidden); });
    $('#kListPop').addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-list-close]')) { listPop(false); return; }
      var lo = e.target.closest('[data-list-open]'); if (lo) { listPop(false); openListItem(lo.dataset.listOpen); return; }
      var ld = e.target.closest('[data-list-del]'); if (ld) { A.list.remove(ld.dataset.listDel); listPop(true); listBadge(); if (A.step === 6) renderPanel(); return; }
      var qa = e.target.closest('[data-quote-all]'); if (qa) { qa.href = A.quoteUrl(A.list.items()); return; }
      if (e.target.closest('[data-act-pop="add"]')) { var r = A.list.add(); toast(r.bad ? t('calc.colour.obsolete', r.bad[0]) : r.dup ? t('k.ui.dup') : t('k.ui.added', { n: r.list.length })); listPop(true); listBadge(); if (A.step === 6) renderPanel(); }
    });
    function openListItem(id) {
      var it = A.list.get().filter(function (x) { return x.id === id; })[0];
      if (!it) return;
      // calculator item → calculators page with its share hash (js/calc-ui.js)
      if (it.kind === 'calc') { location.href = window.TricomCalcUI ? window.TricomCalcUI.itemUrl(it) : P('kalkulatori.html') + '#' + it.hash; return; }
      if (A.cmp.on) A.setCompare(false);
      A.load('#' + it.token);
      toast(t('k.ui.opened', { c: it.code }));
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.k-dock')) closeMenus();
      if (!e.target.closest('#kListPop, #kListBtn')) listPop(false);
    });
    window.addEventListener('beforeprint', function () { if (!UI.printFilled || Date.now() - UI.printFilled > 4000) UI.fillPrint(false); });

    // Prikaz toolbar
    var dock = $('#kDock');
    dock.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-pop')) { e.stopPropagation(); toggleMenu(b); return; }
      var v = b.dataset.view;
      if (v) { if (v === 'walk') T.walk(); else A.fly(v); closeMenus(); return; }
      if (b.dataset.turn !== undefined) { var sp = +b.dataset.turn; T.turntable(sp > 0, sp); closeMenus(); return; }
      var ph = b.dataset.photo;
      if (ph) { closeMenus(); if (ph !== 'now') { T.stopIdle(); A.fly(ph === 'eave' ? 'eave' : ph, true); } setTimeout(doPhoto, ph === 'now' ? 0 : 80); return; }
      var ins = b.dataset.inspect;
      if (ins) { inspect(ins); closeMenus(); return; }
      switch (b.id) {
        case 'kUndo': A.undo(); break;
        case 'kRedo': A.redo(); break;
        case 'kSection': T.section(!T.sectioning()); if (T.sectioning()) A.fly('section'); break;
        case 'kMeasure': T.measure(!T.measuring()); if (T.measuring()) toast(t('k.ui.measureHint')); break;
        case 'kPresent': closeMenus(); T.present(true); break;
        case 'kKote': A.setMode('kote', !A.modes.kote); if (A.modes.kote && !A.step) A.fly('kote'); break;
        case 'kCompare': A.setCompare(!A.cmp.on); if (A.cmp.on) toast(t('k.ui.cmpHint')); break;
        case 'kPhoto': doPhoto(); break;
        case 'kRain': A.setMode('kisa', !A.modes.kisa); break;
        case 'kSnow': A.setMode('zima', !A.modes.zima); break;
        case 'kSunPlay': T.playDay(); UI.refreshTop(); break;
        case 'kDayNight': T.stopDay(); A.set('sat', TK.env.sunAt(A.state.sat, A.state.datum).el < -2 ? 15 : 22); break;
        case 'kCopy': closeMenus(); copyText(A.url(), t('k.ui.linkCopied')); break;
        case 'kPdf': closeMenus(); doPrint(); break;
      }
    });
    $('#kHelp').addEventListener('click', function () { T.tour(); });
    $('#kPresentX').addEventListener('click', function () { T.present(false); });
    $('#kTour').addEventListener('click', function (e) {
      if (e.target.closest('[data-tour-next]')) T.tourNext();
      else if (e.target.closest('[data-tour-skip]')) T.tourEnd();
    });

    // inspector card
    function inspect(id) {
      if (A.noGL) return;
      if (A.state.detalji.indexOf(id) < 0) A.set('detalj', id);          // the part has to exist to be shown
      var cur = T.inspecting();
      T.inspect(cur && cur.id === id ? null : id);
    }
    UI.inspect = inspect;
    $('#kInspect').addEventListener('click', function (e) {
      if (e.target.closest('[data-ins-close]')) { T.inspect(null); return; }
      var st = e.target.closest('[data-how-step]');
      if (st) T.howStep(+st.dataset.howStep, true);
    });

    // clicks on the 3D view: pick a flashing (step 04), choose the compare side
    var cv = $('#kCanvas'), down = null;
    cv.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    cv.addEventListener('pointerup', function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5 || performance.now() - down.t > 600) { down = null; return; }
      down = null;
      if (A.noGL) return;
      var sx = cv.getBoundingClientRect().left + A.splitX();
      if (T.measuring && T.measuring()) { T.measureClick(e.clientX, e.clientY); return; }
      if (A.cmp.on && (e.clientX > sx) !== (A.cmp.active === 1)) { A.activate(e.clientX > sx ? 1 : 0); return; }
      if (A.step === 4) { var id = T.pick(e.clientX, e.clientY); if (id) T.inspect(id); }
    });

    // compare divider
    var dv = $('#kDivider'), ddr = false;
    function splitFrom(e) { var r = cv.getBoundingClientRect(), L = A.panelInset.left || 0; A.setSplit((e.clientX - r.left - L) / Math.max(1, r.width - L - A.panelInset.right)); placeCompare(); }
    dv.addEventListener('pointerdown', function (e) { if (e.target.closest('#kSwap')) return; ddr = true; dv.setPointerCapture(e.pointerId); dv.classList.add('is-drag'); e.preventDefault(); });
    dv.addEventListener('pointermove', function (e) { if (ddr) splitFrom(e); });
    function endDv() { ddr = false; dv.classList.remove('is-drag'); }
    dv.addEventListener('pointerup', endDv); dv.addEventListener('pointercancel', endDv);
    dv.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { A.setSplit(A.cmp.split + (e.key === 'ArrowLeft' ? -0.02 : 0.02)); placeCompare(); e.preventDefault(); e.stopPropagation(); }
    });
    $('#kSwap').addEventListener('click', function () { A.swap(); });
    $('#kCmp').addEventListener('click', function (e) { var b = e.target.closest('.k-cmp__side'); if (b) A.activate(+b.dataset.side); });

    // mobile bottom sheet: drag the handle to resize
    var grip = $('#kGrip'), drag = null;
    grip.addEventListener('pointerdown', function (e) { drag = { y: e.clientY, h: panel.offsetHeight }; try { grip.setPointerCapture(e.pointerId); } catch (x) { /* synthetic events */ } panel.classList.add('is-drag'); });
    grip.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var hgt = Math.min(window.innerHeight * 0.86, Math.max(window.innerHeight * 0.22, drag.h + (drag.y - e.clientY)));
      panel.style.height = hgt + 'px'; sheetH = hgt / window.innerHeight;
    });
    function endDrag() {
      if (!drag) return; drag = null; panel.classList.remove('is-drag');
      if (sheetH < 0.27 && !A.noGL) { panel.style.height = ''; sheetH = 0.6; UI.close(); return; }
      syncInset(); A.fly(A.lastView || 'home');
    }
    grip.addEventListener('pointerup', endDrag); grip.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', function () { if (!isMobile()) { panel.style.height = ''; sheetH = 0.6; } syncInset(); placeCompare(); });

    // the inquiry list may change in another tab
    window.addEventListener('storage', function (e) { if (e.key === 'tricom-upit-lista') { listBadge(); if (A.step === 6) renderPanel(); } });

    syncInset();
    UI.refresh();
  };
})();
