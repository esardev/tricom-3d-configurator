/* ==========================================================================
   TRICOM — catalog-render.js
   Crta tabele i liste prodajnog programa iz js/catalog.js (window.TRICOM_CATALOG)
   u elemente sa atributom data-catalog="…". Jedini izvor podataka je katalog —
   u HTML-u stoje samo prazni nosači, da tabela nikad ne bude prepisana rukom.

   <div data-catalog="profiles" data-caption="TRAPEZNI PROFILI"></div>
   Nosač bez poznatog imena se ne dira. Radi i sa file:// (bez mreže, bez modula).

   Jezik: na engleskim stranama (L10N.lang() === 'en') tekst iz kataloga se
   čita iz polja sa sufiksom _en (name_en, note_en, rows_en …), stalni tekstovi
   (naslovi, zaglavlja, oznake) iz js/i18n/*.js pod ključevima cat.*, a brojevi
   se pišu po engleskom zapisu (L10N.num). Srpski ispis je nepromenjen.
   ========================================================================== */
(function () {
  'use strict';
  var C = window.TRICOM_CATALOG;
  if (!C || !C.sales) return;
  var S = C.sales;

  /* ---------- jezik ---------- */
  function L() { return window.L10N; }
  function isEn() { var l = L(); return !!(l && l.lang() === 'en'); }
  function t(k, vars) { var l = L(); return l ? l.t(k, vars) : k; }
  /* polje za prikaz: na engleskom obj[k + '_en'], inače (ili ako ga nema) obj[k] */
  function f(o, k) {
    if (o == null) return o;
    if (isEn()) { var e = o[k + '_en']; if (e != null) return e; }
    return o[k];
  }
  /* Renderer ne gradi putanje do slika/crteža; ako ih ikad bude, ide ispred
     L10N.root (npr. L10N.root + d.drawing), da rade i iz /en/. */

  /* ---------- pomoćne ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function sr(n, d) {                                   /* broj po zapisu jezika strane: sr 1234,5 · en 1,234.5 */
    if (n == null || n === '') return '—';
    if (typeof n !== 'number') return esc(n);
    if (isEn()) {
      if (d == null) { var m = String(n).split('.')[1]; d = m ? m.length : 0; }
      return L().num(n, d);
    }
    var s = (d != null ? n.toFixed(d) : String(n)).replace('.', ',');
    return s;
  }
  function num(v, unit, d) { return v == null || v === '' || v === '—' ? '<td class="num">—</td>' : '<td class="num">' + sr(v, d) + (unit ? '<span class="unit">' + esc(unit) + '</span>' : '') + '</td>'; }
  function td(v, cls) { return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(v == null || v === '' ? '—' : v) + '</td>'; }
  function no(i) { return '<td class="spec__no">' + (i < 9 ? '0' : '') + (i + 1) + '</td>'; }
  function table(caption, head, rows, opts) {
    opts = opts || {};
    var h = '<div class="spec-wrap"><table class="spec' + (opts.cls ? ' ' + opts.cls : '') + '">';
    if (caption) h += '<caption class="mono muted spec__cap">' + esc(caption) + '</caption>';
    h += '<thead><tr>' + (opts.noIndex ? '' : '<th scope="col" class="spec__no">#</th>') + head.map(function (c) {
      var x = typeof c === 'string' ? c : c.t, n = typeof c === 'string' ? false : c.num;
      return '<th scope="col"' + (n ? ' class="num"' : '') + '>' + esc(x) + '</th>';
    }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r, i) { h += '<tr>' + (opts.noIndex ? '' : no(i)) + r + '</tr>'; });
    h += '</tbody></table></div>';
    if (opts.note) h += '<p class="mono muted u-mt-16 u-sm">' + esc(opts.note) + '</p>';
    return h;
  }
  function list(items, cls) { return '<ul class="' + (cls || 'checklist') + '">' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>'; }
  function olist(items) { return '<ol class="steps-ol">' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ol>'; }
  function kv(pairs) { return '<dl>' + pairs.map(function (p) { return '<div class="infoline"><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>'; }).join('') + '</dl>'; }
  function key(v) { return '<td class="key">' + esc(v) + '</td>'; }
  function allProfiles() { return C.profiles.concat(S.extraProfiles || []); }
  function tags(colors) { return colors.map(function (c) { return '<span class="tag">RAL ' + esc(c.ral) + ' ' + esc(c.name) + '</span>'; }).join(''); }
  function h(k) { return t('cat.h.' + k); }                      /* zaglavlje kolone */
  function nh(k) { return { t: h(k), num: 1 }; }                  /* numeričko zaglavlje */
  function lb(k) { return t('cat.l.' + k); }                     /* oznaka u infobloku */

  /* ---------- graditelji ---------- */
  var R = {};

  R.profiles = function (cap) {
    var rows = allProfiles().filter(function (p) { return p.id !== 'crep' && p.id !== 'pr151015'; }).map(function (p) {
      var d = (S.profileDetails || {})[p.id] || {};
      return key(f(p, 'name')) + num(p.ribHeight, 'mm') + num(p.pitch, 'mm') + num(p.coverWidth, 'mm') + num(p.inputWidth || d.inputWidth, 'mm') + td(p.thicknesses.map(function (x) { return sr(x); }).join(' / ') + ' mm') + td(f(p, 'note'));
    });
    return table(cap || t('cat.profiles.cap'), [h('profile'), nh('ribHeight'), nh('pitch'), nh('cover'), nh('input'), h('thicknesses'), h('use')], rows,
      { note: t('cat.profiles.note') });
  };

  R['profiles-short'] = function (cap) {
    var rows = allProfiles().filter(function (p) { return p.id !== 'crep' && p.id !== 'pr151015'; }).map(function (p) {
      return key(f(p, 'name')) + num(p.ribHeight, 'mm') + num(p.pitch, 'mm') + num(p.coverWidth, 'mm') + td(f(p, 'note'));
    });
    return table(cap || t('cat.profilesShort.cap'), [h('profile'), nh('ribHeight'), nh('pitch'), nh('cover'), h('use')], rows);
  };

  R['profile-press'] = function () {
    var p = (S.extraProfiles || []).filter(function (x) { return x.id === 'pr151015'; })[0];
    if (!p) return '';
    return '<div class="infoblock"><h3>' + esc(f(p, 'name')) + '</h3>' + kv([[lb('rib'), '15 / 10 / 15 mm'], [lb('length'), t('cat.press.length')], [lb('material'), f(p, 'materials')], [lb('ribs'), t('cat.press.ribs')], [lb('stock'), t('cat.press.stock')], [lb('use'), f(p, 'uses')], [lb('note'), f(p, 'setup')]]) + '</div>';
  };

  R['statics-tr40'] = function () {
    var s = S.statics.tr40, rows = s.rows.map(function (r) { return key('TR 40/230 · ' + sr(r.t) + ' mm') + num(r.kg, 'kg/m²', 2) + num(r.I, 'cm⁴/m', 2) + num(r.W, 'cm³/m', 2); });
    var x = table(t('cat.st40.cap'), [h('thickness'), nh('mass'), { t: 'I', num: 1 }, { t: 'W', num: 1 }], rows);
    var head = [h('thickness')].concat(s.spans.map(function (v) { return { t: sr(v, 2) + ' m', num: 1 }; }));
    var r1 = Object.keys(s.single).map(function (k) { return key(sr(+k) + ' mm') + s.single[k].map(function (v) { return num(v); }).join(''); });
    var r2 = Object.keys(s.multi).map(function (k) { return key(sr(+k) + ' mm') + s.multi[k].map(function (v) { return num(v); }).join(''); });
    x += '<div class="u-mt-24">' + table(t('cat.st40.single'), head, r1, { cls: 'spec--dense' }) + '</div>';
    x += '<div class="u-mt-24">' + table(t('cat.st40.multi'), head, r2, { cls: 'spec--dense', note: t('cat.st40.note', { source: f(s, 'source') }) }) + '</div>';
    return x;
  };

  R['statics-tr60'] = function () {
    var s = S.statics.tr60;
    var rows = s.geom.map(function (r) { return key('TR 60/210 · ' + sr(r.t) + ' mm') + num(r.Id, 'cm⁴/m', 3) + num(r.Wd, 'cm³/m', 3) + num(r.Ig, 'cm⁴/m', 3) + num(r.Wg, 'cm³/m', 3); });
    var x = table(t('cat.st60.cap'), [h('thickness'), nh('iLower'), nh('wLower'), nh('iUpper'), nh('wUpper')], rows);
    var head = [h('thickness')].concat(s.spans.map(function (v) { return { t: sr(v, 2) + ' m', num: 1 }; }));
    var r1 = Object.keys(s.two).map(function (k) { return key(sr(+k) + ' mm') + s.two[k].map(function (v) { return num(v, '', 3); }).join(''); });
    var r2 = Object.keys(s.three).map(function (k) { return key(sr(+k) + ' mm') + s.three[k].map(function (v) { return num(v, '', 3); }).join(''); });
    x += '<div class="u-mt-24">' + table(t('cat.st60.two'), head, r1, { cls: 'spec--dense' }) + '</div>';
    x += '<div class="u-mt-24">' + table(t('cat.st60.three'), head, r2, { cls: 'spec--dense', note: t('cat.st60.note', { source: f(s, 'source') }) }) + '</div>';
    return x;
  };

  R.mounting = function () {
    var m = S.mounting;
    return '<div class="grid g2"><div><h4 class="u-mb-16">' + esc(t('cat.mounting.fix')) + '</h4>' + list([f(m, 'purlinSpacing'), f(m, 'who'), f(m, 'wood'), f(m, 'steel'), f(m, 'wayOne'), f(m, 'wayTwo'), f(m, 'why')]) + '</div><div><h4 class="u-mb-16">' + esc(t('cat.mounting.watch')) + '</h4>' + list([f(m, 'inputNote'), f(m, 'widthNote'), t('cat.mounting.wrong', { list: f(m, 'wrong').join('; ') }), t('cat.mounting.right', { v: f(m, 'right') }), f(m, 'felt')]) + '</div></div>';
  };

  R.tile = function () {
    var p = S.tile;
    var x = '<div class="grid g2"><div class="infoblock"><h3>' + esc(t('cat.tile.title')) + '</h3>' + kv([[lb('model'), t('cat.tile.model', { since: f(p, 'since') })], [lb('length'), f(p, 'rows')], [lb('module'), f(p, 'module')], [lb('rowWidth'), t('cat.tile.rowWidth', { w: sr(p.rowWidth) })], [lb('coverWidth'), sr(p.coverWidth) + ' mm'], [lb('material'), f(p, 'thickness')], [lb('protection'), f(p, 'coating')], [lb('weight'), f(p, 'weight')], [lb('minSlope'), sr(p.minSlopeDeg) + '°'], [lb('antiCondensation'), t('cat.tile.felt')]]) + '</div>';
    x += '<div class="infoblock"><h3>' + esc(t('cat.tile.colors')) + '</h3><p class="u-sm muted">' + esc(t('cat.tile.smooth')) + '</p><div class="pcard__tags">' + tags(f(p, 'colors')) + '</div><p class="u-sm muted u-mt-16">' + esc(t('cat.tile.textured')) + '</p><div class="pcard__tags">' + tags(f(p, 'textured')) + '</div><p class="u-sm muted u-mt-16">' + esc(t('cat.tile.why')) + '</p></div></div>';
    x += '<div class="u-mt-24"><h4 class="u-mb-16">' + esc(t('cat.tile.install')) + '</h4><div class="grid g2"><div>' + olist(f(p, 'install')) + '</div><div>' + list(f(p, 'installNotes')) + '</div></div></div>';
    return x;
  };

  R.ridges = function () {
    return '<div class="infoblock"><h3>' + esc(t('cat.ridges.title')) + '</h3><p class="u-sm">' + esc(t('cat.ridges.text', { list: f(S, 'ridgeFor').join(', ') })) + '</p><div class="pcard__tags">' + f(S, 'ridgeVariants').map(function (v) { return '<span class="tag">' + esc(v) + '</span>'; }).join('') + '</div></div>';
  };

  R.parapets = function () {
    var rows = S.parapets.map(function (p) { return key(t('cat.parapets.key', { no: p.no, code: p.code })) + td(p.rib) + num(p.cover1000, 'mm') + num(p.cover1250, 'mm') + td(f(p, 't') + ' mm') + td(f(p, 'materials')); });
    return table(t('cat.parapets.cap'), [h('profile'), h('ribHeightPair'), nh('cover1000'), nh('cover1250'), h('thickness'), h('material')], rows, { note: t('cat.parapets.note') });
  };

  R.lamperija = function () {
    var l = S.lamperija, a = l.alu;
    return '<div class="grid g2"><div class="infoblock"><h3>' + esc(t('cat.lamperija.title')) + '</h3>' + kv([[lb('material'), f(l, 'materials')], [lb('length'), t('cat.lamperija.length', { len: sr(l.stdLength), longer: f(l, 'longer') })], [lb('joint'), f(l, 'joint')], [lb('care'), f(l, 'care')], [lb('inox'), f(l, 'inox')]]) + '</div><div class="infoblock"><h3>' + esc(t('cat.lamperija.alu')) + '</h3>' + kv([[lb('finish'), f(a, 'colors') + '; ' + f(a, 'surface')], [lb('panel'), t('cat.lamperija.panel', { len: sr(a.length), area: sr(a.coverArea) })], [lb('joint'), f(a, 'joint')], [lb('props'), f(a, 'props')], [lb('applications'), f(a, 'uses')], [lb('trims'), f(a, 'trims')]]) + '</div></div>';
  };

  R.panels = function () {
    var p = S.panels;
    return '<div class="grid g2"><div class="infoblock"><h3>' + esc(t('cat.panels.title')) + '</h3>' + kv([[lb('whatPanel'), f(p, 'def')], [lb('fillings'), f(p, 'fillings').join(', ')], [lb('offer'), f(p, 'offer')], [lb('byUse'), f(p, 'kinds').join(t('cat.and'))], [lb('fire'), f(p, 'fire')], [lb('why'), f(p, 'why')], [lb('applications'), f(p, 'uses')]]) + '</div><div class="infoblock"><h3>' + esc(t('cat.panels.colors')) + '</h3><div class="pcard__tags">' + tags(f(p, 'colors')) + '</div><!-- TEMP: confirm with client --><p class="u-sm muted u-mt-16">' + esc(t('cat.panels.temp')) + '</p></div></div>';
  };

  R.roofing = function () {
    var r = S.roofing;
    return '<div class="grid g2"><div><h4 class="u-mb-16">' + esc(t('cat.roofing.ways')) + '</h4>' + olist(f(r, 'ways')) + '<h4 class="u-mb-16 u-mt-24">' + esc(t('cat.roofing.sheets')) + '</h4>' + list(f(r, 'sheets')) + '<p class="u-sm muted u-mt-16">' + esc(f(r, 'sheetNote')) + '</p></div><div><h4 class="u-mb-16">' + esc(t('cat.roofing.layers')) + '</h4>' + olist(f(r, 'layers')) + '<p class="u-sm muted u-mt-16">' + esc(f(r, 'model')) + '</p></div></div>';
  };

  R.gutters = function () {
    var g = S.gutters, d = S.downpipes, sq = g.square;
    var rows = f(g, 'semiRound').map(function (x) { return key(t('cat.gutters.semi', { rs: x.rs })) + td(x.maxLen) + td(f(g, 'stockSemi')[x.rs] || '—'); });
    rows.push(key(t('cat.gutters.square')) + td(f(sq, 'maxLen') + '; ' + f(sq, 'thickness')) + td(f(g, 'stockSquare')[333]));
    var x = table(t('cat.gutters.cap'), [h('gutter'), h('pieceLength'), h('inStock')], rows, { note: t('cat.gutters.note', { materials: f(g, 'materials'), square: f(sq, 'materials'), rs: f(g, 'rsStandard'), stock: f(g, 'stockLengths') }) });
    var r2 = f(d, 'round').map(function (y) { return key(t('cat.downpipes.round', { d: y.d })) + td(y.maxLen) + td(f(d, 'stockRound')[y.d] || '—'); });
    r2.push(key(t('cat.downpipes.square', { sizes: d.square.join(' / '), unit: d.squareUnit })) + td(f(d.squareSpec, 'length') + '; ' + f(d.squareSpec, 'thickness')) + td(t('cat.downpipes.format333', { v: d.stockSquare[333] })));
    x += '<div class="u-mt-24">' + table(t('cat.downpipes.cap'), [h('downpipe'), h('pieceLength'), h('inStock')], r2, { note: t('cat.downpipes.note', { round: f(d, 'roundMaterials'), square: f(d.squareSpec, 'materials'), colors: f(d, 'stockColors').join(', ') }) }) + '</div>';
    x += '<div class="grid g2 u-mt-24"><div class="infoblock"><h3>' + esc(t('cat.gutters.colors')) + '</h3><div class="pcard__tags">' + f(g, 'colors').map(function (c) { return '<span class="tag">' + (c.ral !== '—' ? 'RAL ' + esc(c.ral) + ' ' : '') + esc(c.name) + '</span>'; }).join('') + '</div></div>';
    x += '<div class="infoblock"><h3>' + esc(t('cat.gutters.system')) + '</h3>' + kv([[lb('horizontal'), f(g.system, 'horizontal').join(', ')], [lb('vertical'), f(g.system, 'vertical').join(', ')], [lb('afteri'), f(g, 'afteri')]]) + '</div></div>';
    return x;
  };

  R.trims = function () {
    var rows = S.trims.map(function (x) { return key(f(x, 'name')) + td(f(x, 't')) + td(f(x, 'len')) + td(f(x, 'stock')); });
    return table(t('cat.trims.cap'), [h('profile'), h('sheetThickness'), h('length'), h('inStock')], rows, { note: t('cat.trims.note') });
  };

  R.galanterija = function () {
    var g = S.galanterija, x = '';
    x += table(t('cat.gal.holders'), [h('format'), h('dimsMm')], f(g, 'holders').map(function (y) { return key(y.f) + td(y.dims); }), { note: t('cat.gal.holdersNote', { colors: f(g, 'colors').join(', '), note: f(g, 'holdersNote') }) });
    var misc = [
      key(t('cat.gal.ends')) + td(f(g.ends, 'formats').join(', ')) + td(f(g.ends, 'quick')),
      key(t('cat.gal.outlets')) + td(g.outlets.join(', ')) + td('—'),
      key(t('cat.gal.protectors')) + td(f(g, 'protectors')) + td('—'),
      key(t('cat.gal.corners')) + td(g.corners.formats.join(', ')) + td(f(g.corners, 'kinds')),
      key(t('cat.gal.elbows')) + td(g.elbows.sizes.join(', ')) + td(f(g.elbows, 'note')),
      key(t('cat.gal.clampsSquare')) + td(g.clampsSquare.formats.join(', ')) + td(t('cat.gal.dowel', { v: g.clampsSquare.dowel })),
      key(t('cat.gal.afteri')) + td(f(g.afteri, 'colors')) + td(f(g.afteri, 'what'))
    ];
    x += '<div class="u-mt-24">' + table(t('cat.gal.cap'), [h('element'), h('formatsColors'), h('note')], misc, { note: f(g, 'colorNote') }) + '</div>';
    x += '<div class="u-mt-24">' + table(t('cat.gal.clampsRound'), [h('diameter'), h('pinMm'), h('dowelMm')], g.clampsRound.map(function (c) { return key(c.d) + td(c.pin) + td(c.dowel); })) + '</div>';
    x += '<div class="u-mt-24">' + table(t('cat.gal.snow'), [h('tile'), h('colors'), h('sheetThickness')], f(g, 'snowGuards').map(function (s) { return key(s.tile) + td(s.colors) + td(s.t); })) + '</div>';
    x += '<div class="u-mt-24">' + table(t('cat.gal.nailCaps'), [h('kind'), h('colorsSurface')], f(g.nailCaps, 'kinds').map(function (k) { return key(k.k) + td(k.c); }), { note: f(g.nailCaps, 'what') }) + '</div>';
    return x;
  };

  function stockTable(cap, rows, widthCol) {
    return table(cap, [h('thickness'), nh('mass')].concat(widthCol ? [widthCol] : []), rows.map(function (r) { return key(sr(r[0], 2) + ' mm') + num(r[1], 'kg/m²') + (widthCol ? td(r[2]) : ''); }));
  }
  R['sheets-galv'] = function () {
    var g = S.sheets.galv, x = '';
    x += '<div class="grid g2"><div>' + stockTable(t('cat.galv.coil'), f(g, 'coil'), h('widthsMm')) + '</div><div>' + stockTable(t('cat.galv.sheet'), g.sheet) + '</div></div>';
    x += '<div class="u-mt-24">' + table(t('cat.galv.quality'), g.qualityHead.slice(0, 4), g.quality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3] + (r[4] ? ' / ' + r[4] : '')); }), { note: t('cat.galv.note', { zinc: f(g, 'zinc'), standards: g.standards, slit: f(g, 'slit') }) }) + '</div>';
    x += '<div class="u-mt-24">' + table(t('cat.galv.mech'), f(g, 'mechHead'), g.mech.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]); }), { note: f(g, 'formatsRS') }) + '</div>';
    return x;
  };
  R['sheets-colored'] = function () {
    var c = S.sheets.colored, x = '';
    x += table(t('cat.colored.cap'), ['RAL', h('color'), h('dimsMm')], f(c, 'coilOneSide').map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]); }), { note: f(c, 'slitOneSide') + '. ' + f(c, 'coilTwoSide') + '; ' + f(c, 'slitTwoSide') + '. ' + f(c, 'bigger') + '.' });
    x += '<div class="grid g2 u-mt-24"><div class="infoblock"><h3>' + esc(t('cat.colored.thick')) + '</h3>' + kv([[lb('thicknesses'), f(c, 'thick')], [lb('weights'), f(c, 'weights')], [lb('loadCapacity'), f(c, 'note')]]) + '</div><div class="infoblock"><h3>' + esc(t('cat.colored.layers')) + '</h3>' + olist(f(c, 'layers')) + '</div></div>';
    return x;
  };
  R['sheets-alu'] = function () {
    var a = S.sheets.alu, x = '<p class="u-sm muted u-mb-16">' + esc(f(a, 'range')) + '</p>';
    x += '<div class="grid g2"><div>' + stockTable(t('cat.alu.coil'), f(a, 'coil'), h('widthsMm')) + '</div><div>' + stockTable(t('cat.alu.sheet'), a.sheet) + '</div></div>';
    x += '<div class="u-mt-24">' + table(t('cat.alu.ribbed'), [h('thickness'), nh('mass'), h('formats')], f(a, 'ribbed').map(function (r) { return key(r[0] + ' mm') + num(r[1], 'kg/m²') + td(r[2]); }), { note: t('cat.alu.note', { sizes: f(a.coilColored, 'sizes'), colors: f(a.coilColored, 'colors') }) }) + '</div>';
    return x;
  };
  R['sheets-copper'] = function () {
    var c = S.sheets.copper;
    return '<div class="grid g2"><div>' + stockTable(t('cat.copper.coil'), f(c, 'coil'), h('widthMm')) + '<p class="u-sm muted u-mt-16">' + esc(t('cat.copper.note', { slit: f(c, 'slit'), quality: f(c, 'quality'), use: f(c, 'use') })) + '</p></div><div>' + stockTable(t('cat.copper.sheet', { format: f(c, 'sheetFormat') }), c.sheet) + '</div></div>';
  };
  R['sheets-hvl'] = function () {
    var v = S.sheets.hvl;
    return '<div class="grid g2"><div>' + stockTable(t('cat.hvl.sheet'), v.sheet) + '</div><div>' + table(t('cat.hvl.quality'), v.qualityHead, v.quality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]); }), { note: f(v, 'range') }) + '</div></div>';
  };
  R['sheets-tvl'] = function () {
    var v = S.sheets.tvl;
    return '<div class="grid g2"><div>' + stockTable(t('cat.tvl.sheet', { formats: f(v, 'formats').join(', ') }), v.sheet) + '</div><div>' + table(t('cat.tvl.quality'), v.qualityHead, v.quality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]) + td(r[4]); }), { note: t('cat.tvl.note', { qn: f(v, 'qualityNote'), range: f(v.ribbed, 'range'), sizes: f(v.ribbed, 'sizes').join(', '), format: f(v.ribbed, 'format'), processing: f(v, 'processing') }) }) + '</div></div>';
  };
  R['sheets-inox'] = function () {
    var v = S.sheets.inox;
    return '<div class="grid g2"><div class="infoblock"><h3>' + esc(t('cat.inox.title')) + '</h3>' + kv([[lb('kinds'), f(v, 'kinds')], [lb('coil'), f(v, 'coil')], [lb('sheets'), f(v, 'sheet')], [lb('lamperija'), f(v, 'lamperija')], [lb('note'), f(v, 'note')]]) + '</div><div>' + table(t('cat.inox.quality'), v.qualityHead, v.quality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]); })) + '</div></div>';
  };

  /* ---------- podgrupe limova (proizvodi.html?grupa=limovi&program=…&podgrupa=…) ----------
     Isti podaci kao gornje celine, podeljeni po podgrupi; ništa novo osim
     spiska standardnih boja (colored.standard). */
  function info(title, pairs) { return '<div class="infoblock"><h3>' + esc(title) + '</h3>' + kv(pairs) + '</div>'; }
  function para(s) { return '<p class="u-sm muted">' + esc(s) + '</p>'; }
  R['sheets-galv-coil'] = function () { var g = S.sheets.galv; return stockTable(t('cat.galv.coil'), f(g, 'coil'), h('widthsMm')); };
  R['sheets-galv-sheet'] = function () { return stockTable(t('cat.galv.sheet'), S.sheets.galv.sheet); };
  R['sheets-galv-slit'] = function () { var g = S.sheets.galv; return info(t('cat.galv.slitTitle'), [[lb('dims'), f(g, 'slit')], [lb('formats'), f(g, 'formatsRS')]]); };
  R['sheets-galv-quality'] = function () {
    var g = S.sheets.galv;
    return table(t('cat.galv.quality'), g.qualityHead.slice(0, 4), g.quality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3] + (r[4] ? ' / ' + r[4] : '')); }), { note: t('cat.galv.note', { zinc: f(g, 'zinc'), standards: g.standards, slit: f(g, 'slit') }) })
      + '<div class="u-mt-24">' + table(t('cat.galv.mech'), f(g, 'mechHead'), g.mech.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]); }), { note: f(g, 'formatsRS') }) + '</div>';
  };
  /* pregled plastificiranog lima: debljine i težine. Slojeve prikazuje crtež iznad (sheet-layers-*.php,
     specifikacija klijenta 2026-11); stari spisak slojeva (colored.layers) se više ne prikazuje, da se ne protivreče. */
  R['sheets-colored-layers'] = function () {
    var c = S.sheets.colored;
    return '<div class="infoblock"><h3>' + esc(t('cat.colored.thick')) + '</h3>' + kv([[lb('thicknesses'), f(c, 'thick')], [lb('weights'), f(c, 'weights')], [lb('loadCapacity'), f(c, 'note')]]) + '</div>';
  };
  R['sheets-colored-painted'] = function () {
    var c = S.sheets.colored;
    var x = '<div class="infoblock"><h3>' + esc(t('cat.colored.std')) + '</h3><div class="pcard__tags">' + tags(f(c, 'standard')) + '</div><p class="u-sm muted u-mt-16">' + esc(t('cat.colored.stdNote')) + '</p></div>';
    var rows = f(c, 'coilOneSide').filter(function (r) { return r[0] !== '—'; }).map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]); });
    return x + '<div class="u-mt-24">' + table(t('cat.colored.cap'), ['RAL', h('color'), h('dimsMm')], rows, { note: f(c, 'slitOneSide') + '. ' + f(c, 'coilTwoSide') + '; ' + f(c, 'slitTwoSide') + '. ' + f(c, 'bigger') + '.' }) + '</div>';
  };
  R['sheets-colored-wood'] = function () {
    var c = S.sheets.colored;
    var rows = f(c, 'coilOneSide').filter(function (r) { return r[0] === '—'; }).map(function (r) { return key(r[1]) + td(r[2]); });
    return table(t('cat.colored.wood'), [h('color'), h('dimsMm')], rows, { note: f(c, 'slitOneSide') + '.' });
  };
  R['sheets-alu-range'] = function () { return para(f(S.sheets.alu, 'range')); };
  R['sheets-alu-coil'] = function () { return stockTable(t('cat.alu.coil'), f(S.sheets.alu, 'coil'), h('widthsMm')); };
  R['sheets-alu-sheet'] = function () { return stockTable(t('cat.alu.sheet'), S.sheets.alu.sheet); };
  R['sheets-alu-colored'] = function () { var cc = S.sheets.alu.coilColored; return info(t('cat.alu.colored'), [[lb('dims'), f(cc, 'sizes')], [lb('colors'), f(cc, 'colors')]]); };
  R['sheets-alu-ribbed'] = function () {
    return table(t('cat.alu.ribbed'), [h('thickness'), nh('mass'), h('formats')], f(S.sheets.alu, 'ribbed').map(function (r) { return key(r[0] + ' mm') + num(r[1], 'kg/m²') + td(r[2]); }));
  };
  R['sheets-copper-info'] = function () { var c = S.sheets.copper; return info(t('cat.copper.title'), [[lb('quality'), f(c, 'quality')], [lb('use'), f(c, 'use')]]); };
  R['sheets-copper-coil'] = function () { return stockTable(t('cat.copper.coil'), f(S.sheets.copper, 'coil'), h('widthMm')); };
  R['sheets-copper-slit'] = function () { return info(t('cat.copper.slitTitle'), [[lb('dims'), f(S.sheets.copper, 'slit')]]); };
  R['sheets-copper-sheet'] = function () { var c = S.sheets.copper; return stockTable(t('cat.copper.sheet', { format: f(c, 'sheetFormat') }), c.sheet); };
  R['sheets-tvl-info'] = function () { var v = S.sheets.tvl; return info(t('cat.tvl.title'), [[lb('range'), f(v, 'range')], [lb('processing'), f(v, 'processing')]]); };
  R['sheets-tvl-plain'] = function () {
    var v = S.sheets.tvl;
    return '<div class="grid g2"><div>' + stockTable(t('cat.tvl.sheet', { formats: f(v, 'formats').join(', ') }), v.sheet) + '</div><div>' + table(t('cat.tvl.quality'), v.qualityHead, v.quality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]) + td(r[4]); }), { note: f(v, 'qualityNote') + '.' }) + '</div></div>';
  };
  R['sheets-tvl-ribbed'] = function () {
    var rb = S.sheets.tvl.ribbed;
    return info(t('cat.tvl.ribbedTitle'), [[lb('range'), f(rb, 'range')], [lb('thicknesses'), f(rb, 'sizes').join(', ') + ' mm'], [lb('formats'), f(rb, 'format')]]);
  };

  R.tubes = function () {
    var p = S.tubes, x = '', pr = p.precision;
    var rows = [
      key(t('cat.tubes.square')) + td(p.square.range) + td(p.square.length) + td(p.square.standards),
      key(t('cat.tubes.rect')) + td(p.rect.range) + td(p.rect.length) + td(p.square.standards.replace('GOST 8639', 'GOST 8645')),
      key(t('cat.tubes.blackRound')) + td(f(p.blackRound, 'range')) + td('6 m') + td(p.blackRound.standards),
      key(t('cat.tubes.galvRound')) + td(t('cat.tubes.galvRange', { range: f(p.galvRound, 'range'), stock: p.galvRound.stock.join(', ') })) + td('6 m') + td('—'),
      key(t('cat.tubes.zp')) + td(f(p.zp, 'sizes')) + td(p.zp.length) + td(t('cat.tubes.zpShapes')),
      key(t('cat.tubes.precRound')) + td(f(pr.round, 'range')) + td(f(pr, 'length')) + td(pr.round.standards),
      key(t('cat.tubes.precOval')) + td(f(pr.oval, 'shape')) + td(f(pr, 'length')) + td(pr.oval.standards)
    ];
    x += table(t('cat.tubes.cap'), [h('kind'), h('dimensions'), h('length'), h('standards')], rows, { note: t('cat.tubes.note', { makers: p.blackRound.makers, maker: pr.maker }) });
    x += '<div class="grid g2 u-mt-24"><div class="infoblock"><h3>' + esc(t('cat.tubes.sqTitle')) + '</h3>' + kv([[lb('applications'), f(p, 'uses').join(', ')], [lb('shape'), f(p, 'shape')], [lb('material'), f(p, 'material').join('; ')]]) + '</div>';
    x += '<div class="infoblock"><h3>' + esc(t('cat.tubes.blackTitle')) + '</h3>' + kv([[lb('kinds'), f(p.blackRound, 'kinds').join('; ')], [lb('applications'), f(p.blackRound, 'uses')], [lb('material'), f(p.blackRound, 'material') + '; ' + f(p.blackRound, 'thread')], [lb('testing'), f(p.blackRound, 'test')], [lb('delivery'), f(p.blackRound, 'delivery').join(', ')]]) + '</div></div>';
    x += '<div class="grid g2 u-mt-24"><div>' + table(t('cat.tubes.massCap', { std: p.square.masses }), [h('tube'), nh('mass')], p.square.sample.concat(p.rect.sample).map(function (r) { return key(r[0]) + num(r[1], 'kg/m', 3); }), { note: t('cat.tubes.massNote', { wall: f(p.square, 'wall') }) }) + '</div>';
    x += '<div>' + table(t('cat.tubes.zpCap'), [h('code'), h('sectionMm'), nh('mass'), h('series')], f(p.zp, 'shapes').map(function (r) { return key('ZP ' + r[0]) + td(r[1]) + num(r[2], 'kg/m', 2) + td(r[3]); })) + '</div></div>';
    x += '<div class="grid g2 u-mt-24"><div>' + table(t('cat.tubes.precRoundCap'), [h('tube'), nh('mass')], f(pr.round, 'sample').map(function (r) { return key(r[0]) + num(r[1], 'kg/m', 3); }), { note: f(pr.round, 'uses') + '. ' + f(pr.round, 'note') + '.' }) + '</div>';
    x += '<div>' + table(t('cat.tubes.precOvalCap'), [h('tubeMm'), nh('mass')], f(pr.oval, 'masses').map(function (r) { return key(r[0]) + num(r[1], 'kg/m', 3); }), { note: f(pr.oval, 'uses') + '; ' + f(pr.oval, 'note') + '. ' + f(pr, 'who') + '.' }) + '</div></div>';
    return x;
  };

  R.steel = function () {
    var s = S.steel, x = '';
    var rows = [
      key(t('cat.steel.L')) + td(f(s.L, 'range')) + td(t('cat.steel.Lnote', { n: s.L.count })),
      key(t('cat.steel.U')) + td(f(s.U, 'range')) + td('—'),
      key(t('cat.steel.I')) + td(f(s.I, 'range')) + td(f(s.I, 'quality')),
      key(t('cat.steel.flatTvl')) + td(f(s.flat.tvl, 'sizes').join(', ') + ' mm') + td(t('cat.steel.cutTo', { len: sr(s.flat.tvl.length) })),
      key(t('cat.steel.flatDrawn')) + td(f(s.flat.drawn, 'range')) + td(t('cat.steel.inStock', { v: f(s.flat.drawn, 'sizes').join(', ') })),
      key(t('cat.steel.flatGrif')) + td(f(s.flat.grif, 'range')) + td(f(s.flat.grif, 'note')),
      key(t('cat.steel.firkant')) + td(f(s.firkant, 'range')) + td(t('cat.steel.firkantNote', { note: f(s.firkant, 'note'), stock: s.firkant.stock })),
      key(t('cat.steel.hop')) + td(f(s.hop, 'limits')) + td(f(s.hop, 'press') + '; ' + f(s.hop, 'material')),
      key(t('cat.steel.drawnRound')) + td(t('cat.steel.drawnRoundDims', { len: sr(s.drawnRound.length) })) + td(f(s.drawnRound, 'note')),
      key(t('cat.steel.grifTubes')) + td(t('cat.steel.grifTubesDims', { sq: f(s.grifTubes, 'square'), rect: f(s.grifTubes, 'rect') })) + td(t('cat.steel.grifTubesUse'))
    ];
    x += table(t('cat.steel.cap'), [h('section'), h('dimensions'), h('note')], rows, { note: f(s, 'sale') + '.' });
    x += '<div class="grid g2 u-mt-24"><div>' + table(t('cat.steel.luiCap'), [h('section'), nh('mass')], s.L.sample.concat(s.U.sample, s.I.sample).map(function (r) { return key(r[0]) + num(r[1], 'kg/m'); })) + '</div>';
    x += '<div>' + table(t('cat.steel.firkantCap'), [h('size'), nh('mass')], s.firkant.rows.map(function (r) { return key(r[0]) + num(r[1], 'kg/m', 3); })) + '</div></div>';
    x += '<div class="grid g2 u-mt-24"><div>' + table(t('cat.steel.drawnCap'), [h('diameter'), nh('mass')], s.drawnRound.rows.map(function (r) { return key(r[0]) + num(r[1], 'kg/m', 3); })) + '</div>';
    x += '<div>' + table(t('cat.steel.hopCap'), [h('sheetThickness'), nh('minBend')], f(s.hop, 'minBend').map(function (r) { return key(r[0] + ' mm') + num(r[1], 'mm'); })) + '</div></div>';
    x += '<div class="u-mt-24">' + table(t('cat.steel.qualityCap'), s.qualityHead, s.flatQuality.map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]) + td(r[4]); })) + '</div>';
    return x;
  };

  R.wire = function () {
    var w = S.wire;
    var rows = [
      key(t('cat.wire.grifMesh')) + td(f(w, 'grifMesh')),
      key(t('cat.wire.sulc')) + td(f(w, 'sulc')),
      key(t('cat.wire.annealed')) + td(f(w, 'annealed')),
      key(t('cat.wire.galv')) + td(t('cat.wire.galvText', { sizes: f(w.galv, 'sizes'), list: f(w.galv, 'perKg').map(function (p) { return p[0] + ' – ' + p[1]; }).join(', ') })),
      key(t('cat.wire.rabic')) + td(f(w, 'rabic')),
      key(t('cat.wire.grating')) + td(f(w.grating, 'sizes').join(', ') + ' mm; ' + f(w.grating, 'material') + '; ' + f(w.grating, 'finish') + '; ' + f(w.grating, 'note')),
      key(t('cat.wire.strip')) + td(f(w.strip, 'what') + '; ' + w.strip.sizes.join(', ') + ' mm')
    ];
    return table(t('cat.wire.cap'), [h('product'), h('description')], rows);
  };

  R.tools = function () {
    var p = S.tools, x = '';
    x += table(t('cat.tools.screws'), [h('kind'), h('standards')], f(p.screws, 'rows').map(function (r) { return key(r[0]) + td(r[1]); }), { note: t('cat.tools.makers', { makers: f(p.screws, 'makers') }) });
    x += '<div class="grid g2 u-mt-24"><div class="infoblock"><h3>' + esc(t('cat.tools.hardware')) + '</h3>' + kv([[lb('locks'), f(p.locks, 'makers') + '; ' + f(p.locks, 'items')], [lb('slide'), f(p.locks, 'slide')], [lb('drills'), f(p, 'drills')], [lb('discs'), f(p, 'discs')], [lb('aluProfiles'), f(p, 'aluProfiles')]]) + '</div>';
    x += '<div class="infoblock"><h3>' + esc(t('cat.tools.hinges')) + '</h3>' + kv([[lb('noBall'), p.hinges.plain.join(', ')], [lb('ball'), p.hinges.ball.join(', ')], [lb('decorative'), p.hinges.decorative.join(', ')]]) + '</div></div>';
    return x;
  };

  R.varstroj = function () {
    var v = S.tools.varstroj;
    return table(t('cat.varstroj.cap'), [h('series'), h('process'), h('current'), h('electrode'), h('massNote')], f(v, 'series').map(function (r) { return key(r[0]) + td(r[1]) + td(r[2]) + td(r[3]) + td(r[4]); }), { note: t('cat.varstroj.note', { other: f(v, 'other'), legend: f(v, 'legend'), site: v.site }) });
  };

  R.ladders = function () {
    var l = S.tools.ladders;
    var rows = f(l.expert, 'rows').concat([f(l.ratio, 'row')]).map(function (r) { return key('Alpos ' + r[0]) + r.slice(1).map(function (c) { return td(c); }).join(''); });
    return table(t('cat.ladders.cap'), f(l.expert, 'head'), rows, { note: f(l.expert, 'note') + '. ' + f(l.ratio, 'note') + '.' });
  };

  R.machines = function () {
    var groups = [], label = {};
    S.machines.forEach(function (m) { if (groups.indexOf(m.group) < 0) { groups.push(m.group); label[m.group] = f(m, 'group'); } });
    return groups.map(function (g) {
      var rows = S.machines.filter(function (m) { return m.group === g; }).map(function (m) { return key(f(m, 'name')) + td(f(m, 'spec')) + td(f(m, 'detail')); });
      return '<div class="u-mb-24">' + table(t('cat.machines.cap', { group: label[g].toUpperCase() }), [h('machine'), h('capacity'), h('details')], rows) + '</div>';
    }).join('');
  };

  R['machines-short'] = function () {
    var rows = S.machines.map(function (m) { return key(f(m, 'name')) + td(f(m, 'spec')); });
    return table(t('cat.machinesShort.cap'), [h('machine'), h('capacity')], rows);
  };

  /* ---------- lineup kartice: tekst iz kataloga, crtež ostaje u HTML-u ----------
     <article class="lu" data-lu="tr20"> … .lu__k / .lu__n / .lu__d se prepisuju.
     Za profile bez kartice u HTML-u (TR 60/210) kartica se dodaje na kraj niza
     sa presekom nacrtanim iz geometrije. */
  function sectionSvg(p) {
    var g = p.geometry || {}, ribs = g.ribs || 4, crown = g.crown || 40, h = p.ribHeight || 40, pitch = p.pitch || 200;
    var W = 380, scale = W / (ribs * pitch), x0 = 10, y0 = 128, H = h * scale * 1.6, d = '';
    for (var i = 0; i < ribs; i++) {
      var a = x0 + i * pitch * scale, b = a + (pitch - crown) * scale * 0.5, c = b + crown * scale * 0.55;
      d += (i ? 'L' : 'M') + a.toFixed(1) + ' ' + y0 + ' L' + (b - 8).toFixed(1) + ' ' + y0 + ' L' + b.toFixed(1) + ' ' + (y0 - H).toFixed(1) + ' L' + c.toFixed(1) + ' ' + (y0 - H).toFixed(1) + ' L' + (c + 8).toFixed(1) + ' ' + y0 + ' ';
    }
    d += 'L' + (x0 + ribs * pitch * scale).toFixed(1) + ' ' + y0;
    return '<svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path class="mx s2" d="' + d + ' v6 H' + x0 + ' z"/><path class="mx s5" fill="none" d="' + d + '"/></svg>';
  }
  function luKey(p) {
    return p.id === 'crep' ? t('cat.lu.tile', { module: sr(p.module), cover: sr(p.coverWidth) }) : t('cat.lu.tr', { h: sr(p.ribHeight), pitch: sr(p.pitch), cover: sr(p.coverWidth) });
  }
  function lineup() {
    var cards = document.querySelectorAll('.lu[data-lu]');
    if (!cards.length) return;
    var all = allProfiles();
    for (var i = 0; i < cards.length; i++) {
      var id = cards[i].getAttribute('data-lu'), p = null;
      for (var j = 0; j < all.length; j++) if (all[j].id === id) p = all[j];
      if (!p) continue;
      var k = cards[i].querySelector('.lu__k'), n = cards[i].querySelector('.lu__n'), dsc = cards[i].querySelector('.lu__d');
      if (k) k.textContent = luKey(p);
      if (n) n.textContent = f(p, 'name');
      if (dsc) dsc.textContent = f(p, 'note');
    }
    var host = cards[0].parentNode;
    (S.extraProfiles || []).forEach(function (p) {
      if (!p.pitch || host.querySelector('[data-lu="' + p.id + '"]')) return;
      var art = document.createElement('article');
      art.className = 'lu'; art.setAttribute('data-lu', p.id);
      art.innerHTML = '<div class="lu__plate">' + sectionSvg(p) + '<span class="lu__k">' + esc(luKey(p)) + '</span></div><div class="lu__b"><h4 class="lu__n">' + esc(f(p, 'name')) + '</h4><p class="lu__d">' + esc(f(p, 'note')) + '</p><a class="link-kerf" href="#krov-tehnika">' + esc(t('cat.lu.more')) + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>';
      var crep = host.querySelector('[data-lu="crep"]');
      if (crep) host.insertBefore(art, crep); else host.appendChild(art);
    });
  }

  /* ---------- pokretanje ----------
     Tabela u zatvorenom odeljku akordeona (.acc__panel iza dugmeta sa
     aria-expanded="false") se ne gradi pri učitavanju, nego tek kad se odeljak
     prvi put otvori — jedan delegirani slušalac, gradi samo taj odeljak. */
  function collapsed(n) {
    var p = n.closest ? n.closest('.acc__panel') : null, b = p && p.previousElementSibling;
    return !!(b && b.classList.contains('acc__btn') && b.getAttribute('aria-expanded') !== 'true');
  }
  function renderIn(scope, all) {
    var nodes = scope.querySelectorAll('[data-catalog]'), drew = false;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], name = n.getAttribute('data-catalog');
      if (!R[name] || n.getAttribute('data-rendered') || (!all && collapsed(n))) continue;
      try { n.innerHTML = R[name](n.getAttribute('data-caption') || undefined); n.setAttribute('data-rendered', '1'); drew = true; }
      catch (e) { if (window.console) console.error('catalog-render: ' + name, e); }
    }
    return drew;
  }
  function run() {
    lineup();
    renderIn(document, false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // otvaranje odeljka: main.js menja aria-expanded na samom dugmetu, ovde (document) stižemo posle toga
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.acc__btn') : null;
    if (!b || b.getAttribute('aria-expanded') !== 'true') return;
    var p = b.nextElementSibling;
    if (p && renderIn(p, true) && window.tricomGlassDom) window.tricomGlassDom();   // staklo na novom sadržaju
  });
  // štampa: sve tabele (i zatvorene) treba da budu na papiru
  window.addEventListener('beforeprint', function () { renderIn(document, true); });
  window.tricomCatalogRender = run;
})();
