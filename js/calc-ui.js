/* ==========================================================================
   TRICOM — calc-ui.js
   Forme i rezultat za pet kalkulatora (proračun je u js/calc.js, podaci u
   js/catalog.js → calculators, tekst u js/i18n → "calc.*").

   Ugradnja (kalkulatori.html, strane detalja):
     <link rel="stylesheet" href="{root}css/kalkulator.css">
     <div class="calc-embed" data-calc-mount data-calc="tr20" data-calc-tabs="trapez"></div>
     <script src="{root}js/catalog.js"></script><script src="{root}js/calc.js"></script><script src="{root}js/calc-ui.js"></script>
   data-calc       početni tab: tr10 | tr20 | tr35 | tr40 | crep
   data-calc-tabs  "all" (5 tabova) | "trapez" (4 trapez taba) | "none" (samo data-calc)
   data-calc-hash  (opciono) stanje se piše u heš i čita iz njega — kalkulatori.html
   Svaki [data-calc-mount] se montira sam na DOMContentLoaded; ručno:
   TricomCalcUI.mount(el) / TricomCalcUI.mountAll().

   Stavke liste za upit (localStorage 'tricom-upit-lista', ista lista kao u
   konfiguratoru): { kind: 'calc', id, calc, hash, name, code, date, lang }.
   Stavka čuva samo ulaz (hash: dužine, količine, boja …); dužni metri, površina, masa i cena se
   uvek ponovo računaju iz hash-a (lista, tekst upita, štampa) — sačuvani zbirovi se ne koriste.
   Trapez sa više dužina: hash ima r<L>x<n> za svaki dodatni red (v. calc.js, gramatika heša).
   TricomCalcUI.itemLabel / itemText / itemUrl ih opisuju na jeziku strane
   (konfigurator ih koristi za listu i tekst upita).
   ========================================================================== */
(function (w, d) {
  'use strict';
  var TC = w.TricomCalc, CAT = w.TRICOM_CATALOG;
  if (!TC || !CAT || !CAT.calculators) return;
  var C = CAT.calculators;
  var LIST_KEY = 'tricom-upit-lista';
  var NB = ' ';
  var seq = 0;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var I_PRINT = '<svg class="ico--static" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>';
  var I_LINK = '<svg class="ico--static" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>';
  var I_PLUS = '<svg class="ico--static" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  /* ---- jezik, brojevi, putanje ------------------------------------------- */
  function L() { return w.L10N; }
  function lang() { return L() ? L().lang() : ((d.documentElement.getAttribute('lang') || 'sr').slice(0, 2) === 'en' ? 'en' : 'sr'); }
  function t(k, v) { return L() ? L().t(k, v) : k; }
  function root() { return L() ? L().root : ''; }
  function page(f) { return L() ? L().page(f) : f; }
  function abs(rel) { try { return new URL(rel, location.href).href; } catch (e) { return rel; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fin(x) { return typeof x === 'number' && isFinite(x); }
  // SR 1 234,5 · EN 1,234.5 — nikad NaN/Infinity
  function fmt(x, dec) {
    if (!fin(x)) return '—';
    dec = dec || 0;
    var en = lang() === 'en', s = Math.abs(x).toFixed(dec).split('.');
    if (Math.abs(x) >= 1000) s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, en ? ',' : NB);
    var out = s[0] + (s[1] ? (en ? '.' : ',') + s[1] : '');
    return (x < 0 && +out.replace(/\D/g, '') !== 0 ? '−' : '') + out;
  }
  function fmtT(x) { return fmt(x, String(x).split('.')[1] ? Math.min(2, String(x).split('.')[1].length) : 1); }
  // metri iz celih mm: najviše 3 decimale su tačne — fmtM: dužni metri (2, a 3 kad treća nije 0), fmtLen: dužina bez suvišnih nula
  function dec3(x) { var k = Math.round(Math.abs(x) * 1000); return k % 10 ? 3 : k % 100 ? 2 : k % 1000 ? 1 : 0; }
  function fmtM(x) { return fin(x) ? fmt(x, Math.max(2, dec3(x))) : '—'; }
  function fmtLen(x) { return fin(x) ? fmt(x, dec3(x)) : '—'; }
  // ključ polja: L, n, W, e — redovi trapeza L1, n1, L2 … (prvi red je L / n)
  function base(k) { return String(k).replace(/\d+$/, ''); }
  function rowIx(k) { var m = /(\d+)$/.exec(k); return m ? +m[1] : 0; }
  function signed(x, dec) { return fin(x) ? (x > 0 ? '+' : '') + fmt(x, dec) : '—'; }
  function plural(n, base) {
    var k = 5;
    if (lang() === 'en') k = n === 1 ? 1 : 2;
    else if (n % 10 === 1 && n % 100 !== 11) k = 1;
    else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) k = 2;
    return t('calc.pl.' + base + k);
  }
  function parseNum(str) {
    var s = String(str == null ? '' : str).replace(/[\s  ']/g, '');
    if (s === '') return { v: NaN, empty: true };
    if (/^\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '');
    else s = s.replace(',', '.');
    return { v: /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? +s : NaN, empty: false };
  }

  /* ---- katalog ----------------------------------------------------------- */
  function colours() {
    var list = (CAT.colours || CAT.colors || []).slice();
    return list.map(function (c, i) { return { c: c, i: i }; }).sort(function (a, b) {
      var oa = a.c.shopOrder || 99, ob = b.c.shopOrder || 99;
      return oa - ob || a.i - b.i;
    }).map(function (x) { return x.c; });
  }
  function colourBy(ral) { var l = colours(); for (var i = 0; i < l.length; i++) if (l[i].ral === ral) return l[i]; return null; }
  function colourName(c) { if (!c) return ''; return lang() === 'en' ? (c.shop_en || c.name_en || c.name) : (c.shop || c.name); }
  function colourStd(c) { return lang() === 'en' ? (c.name_en || c.name) : c.name; }
  function colourLabel(ral) { var c = colourBy(ral); return 'RAL ' + ral + (c ? ' ' + colourName(c) : ''); }
  /* boje dozvoljene za profil (catalog.js → profileColours, npr. TR 10: 9006, 9002, 7016); null = sve */
  function allowedColours(id) { var m = CAT.profileColours || {}; return m[id] ? m[id].slice() : null; }
  // sačuvana / deljena boja koju profil više ne nudi: ne menja se, nego se traži ponovni izbor
  function colourObsolete(id, ral) { var a = allowedColours(id); return !!(a && ral && a.indexOf(String(ral)) < 0); }
  function obsoleteText(id, ral) { return t('calc.colour.obsolete', { ral: ral, name: nameOf(id) }); }
  function thicknesses(id) {
    var ps = CAT.profiles || [];
    for (var i = 0; i < ps.length; i++) if (ps[i].id === id && ps[i].thicknesses && ps[i].thicknesses.length) return ps[i].thicknesses.slice();
    return [C.defaultThickness];
  }
  function nameOf(id) { return id === 'crep' ? t('calc.name.crep') : C.profiles[id].name; }
  function sideLabel(s) { return t(s === 'fasada' ? 'calc.side.fasada' : 'calc.side.krov'); }
  function disclaimer() { return lang() === 'en' ? (CAT.disclaimer_en || CAT.disclaimer || '') : (CAT.disclaimer || ''); }
  function calcUrl(hash) { return abs(page('kalkulatori.html')) + '#' + hash; }
  function compute(id, s) { return TC.compute(id, s, C); }

  /* ---- tekst upita i oznaka stavke (deli ih konfigurator) ----------------- */
  function plainLine(r) {
    if (!r.ok) return t('calc.err.fix');
    if (r.kind === 'crep') return t('calc.line.crep', { tiles: r.tiles, tilesW: plural(r.tiles, 'tile'), p: fmt(r.pitch, r.pitch % 1 ? 2 : 0), e: fmt(r.end, r.end % 1 ? 2 : 0), n: fmt(r.n), sheets: plural(r.n, 'sheet'), m: fmt(r.materialLength) });
    if (r.multi) return t('calc.line.trapezMulti', { n: fmt(r.n), sheets: plural(r.n, 'sheet'), name: r.name, k: r.rows.length, lens: plural(r.rows.length, 'len'), lm: fmtM(r.linearM), a: fmt(r.totalArea, 2) });
    return t('calc.line.trapez', { n: fmt(r.n), sheets: plural(r.n, 'sheet'), name: r.name, L: fmt(r.L), covers: t(r.n === 1 ? 'calc.pl.cover1' : 'calc.pl.cover2'), w: fmt(r.coveredWidth), a: fmt(r.totalArea, 2) });
  }
  /* razbijanje stavke po dužinama (više dužina): ekran (calc-brk__t) i štampa (k-tbl); širina iz koje je površina */
  function brkTable(r, cls) {
    var A = !r.areaMissing, th = function (k) { return '<th scope="col" class="num">' + esc(t(k)) + '</th>'; };
    return '<table class="' + cls + '"><caption>' + esc(A ? t('calc.brk.cap', { w: fmt(r.widthUsed) }) : t('calc.brk.capNoW')) + '</caption>' +
      '<thead><tr><th scope="col">#</th>' + th('calc.brk.L') + th('calc.brk.n') + th('calc.brk.lm') + (A ? th('calc.brk.a') : '') + '</tr></thead><tbody>' +
      r.rows.map(function (x, i) {
        return '<tr><th scope="row">' + (i + 1) + '</th><td class="num">' + fmt(x.L) + ' mm<small>= ' + fmtLen(x.Lm) + ' m</small></td><td class="num">' + fmt(x.n) + '</td><td class="num">' + fmtM(x.linearM) + '</td>' + (A ? '<td class="num">' + fmt(x.area, 2) + '</td>' : '') + '</tr>';
      }).join('') +
      '</tbody><tfoot><tr><th scope="row" colspan="2">' + esc(t('calc.brk.total')) + '</th><td class="num">' + fmt(r.n) + '</td><td class="num">' + fmtM(r.linearM) + '</td>' + (A ? '<td class="num">' + fmt(r.totalArea, 2) + '</td>' : '') + '</tr></tfoot></table>';
  }
  function textFor(id, s, r, withHead) {
    var out = [];
    if (withHead) out.push(t('calc.tx.head', { name: nameOf(id) }), '');
    else out.push(nameOf(id) + (r.kind === 'trapez' ? ' — ' + sideLabel(r.side) : ''));
    var fl = r.felt ? t('calc.tx.yesArea', { a: fmt(r.feltArea, 2) }) : t('calc.tx.no');
    if (r.kind === 'crep') {
      out.push(t('calc.tx.crep1', { n: fmt(r.n), L: fmt(r.L), s: fmt(r.start), tiles: r.tiles, tilesW: plural(r.tiles, 'tile'), p: fmt(r.pitch, r.pitch % 1 ? 2 : 0), e: fmt(r.end, r.end % 1 ? 2 : 0) }));
      out.push(t('calc.tx.crep2', { m: fmt(r.materialLength), mt: fmt(r.totalMaterialM, 2), a: fmt(r.developedArea, 2) }));
      out.push(t('calc.tx.opts', { c: colourLabel(r.colour), t: fmtT(r.t), side: sideLabel('krov'), f: fl }));
      if (r.legacyStart != null) out.push(t('calc.tx.legacyStart', { old: fmt(r.legacyStart), v: fmt(r.start) }));
    } else if (r.multi) {
      // više dužina: red po dužini (mm → m), pa zbir; površina iz pokrivne širine profila
      out.push(t('calc.tx.rows', { k: r.rows.length, lens: plural(r.rows.length, 'len'), cw: fmt(r.widthUsed) }));
      r.rows.forEach(function (x, i) { out.push(t('calc.tx.row', { i: i + 1, L: fmt(x.L), m: fmtLen(x.Lm), n: fmt(x.n), lm: fmtM(x.linearM), a: fmt(x.area, 2) })); });
      out.push(t('calc.tx.rowsTotal', { n: fmt(r.n), sheets: plural(r.n, 'sheet'), lm: fmtM(r.linearM), a: fmt(r.totalArea, 2) }));
      if (r.areaMissing) out.push(t('calc.tx.noWidth'));
      out.push(t('calc.tx.opts', { c: colourLabel(r.colour), t: fmtT(r.t), side: sideLabel(r.side), f: fl }));
      if (r.reinforced) out.push(t('calc.tx.reinf'));
    } else {
      out.push(t('calc.tx.sheets', { n: fmt(r.n), L: fmt(r.L), cw: fmt(r.coverWidth) }));
      out.push(t('calc.tx.covered', { w: fmt(r.coveredWidth), a: fmt(r.totalArea, 2), lm: fmtM(r.linearM) }) + (r.mode === 'w' ? t('calc.tx.surplus', { s: fmt(r.surplus) }) : ''));
      if (r.areaMissing) out.push(t('calc.tx.noWidth'));
      out.push(t('calc.tx.opts', { c: colourLabel(r.colour), t: fmtT(r.t), side: sideLabel(r.side), f: fl }));
      if (r.reinforced) out.push(t('calc.tx.reinf'));
    }
    out.push(t('calc.tx.weight', { kg: fmt(r.weight, 1) }) + (r.showPrices ? t('calc.tx.price', { p: fmt(r.price), note: t(r.kind === 'crep' ? 'calc.res.priceTemp' : 'calc.res.priceNote') }) : ''));
    out.push(t('calc.tx.link', { url: calcUrl(TC.serialize(id, s)) }));
    if (withHead) out.push('', disclaimer());
    return out.join('\n');
  }
  function fromItem(x) { var p = TC.parse('#' + (x && x.hash || ''), C); if (!p) return null; return { id: p.id, s: p.state, r: compute(p.id, p.state) }; }
  function itemFlag(o) { return o && colourObsolete(o.id, o.s.colour) ? ' — ' + t('calc.list.obsolete', { ral: o.s.colour, name: nameOf(o.id) }) : ''; }
  function itemLabel(x) {
    var o = fromItem(x);
    if (!o || !o.r.ok) return (x && x.name || '') + itemFlag(o);
    return listLabel(o.r) + itemFlag(o);
  }
  function listLabel(r) {
    if (r.multi) return t('calc.list.labelMulti', { k: r.rows.length, lens: plural(r.rows.length, 'len'), n: fmt(r.n), c: r.colour });
    return t('calc.list.label', { n: fmt(r.n), L: fmt(r.L), c: r.colour });
  }
  function itemCode(x) { var o = fromItem(x); return (o ? nameOf(o.id) : (x && x.code || '')); }
  function itemText(x) { var o = fromItem(x); return (o && o.r.ok ? textFor(o.id, o.s, o.r, false) : (x && x.name || '')) + (itemFlag(o) ? String.fromCharCode(10) + itemFlag(o).slice(3) : ''); }
  function itemUrl(x) { return page('kalkulatori.html') + '#' + (x && x.hash || ''); }
  function listGet() { try { var v = JSON.parse(localStorage.getItem(LIST_KEY) || '[]'); return Array.isArray(v) ? v.filter(function (x) { return x && (x.token || x.kind === 'calc'); }) : []; } catch (e) { return []; } }
  function listSave(l) { try { localStorage.setItem(LIST_KEY, JSON.stringify(l)); return true; } catch (e) { return false; } }
  // tekst cele liste (sa strane kalkulatora: stavke konfiguratora idu kao naziv + link)
  function listText(l) {
    var body = l.map(function (x, i) {
      var head = l.length > 1 ? t('calc.tx.item', { n: i + 1 }) : '';
      if (x.kind === 'calc') return head + itemText(x);
      return head + t('calc.tx.konf', { name: x.name || x.code || '', url: abs(page('konfigurator.html')) + '#' + x.token });
    });
    var txt = (l.length > 1 ? t('calc.tx.multi', { n: l.length }) : t('calc.tx.head', { name: l[0] && l[0].kind === 'calc' ? nameOf(l[0].calc) : '' })) + '\n\n' + body.join('\n\n') + '\n\n' + disclaimer();
    return txt.length > 2000 ? txt.slice(0, 1999) : txt;
  }
  /* veza ka kontakt.html#upit: konfig = čitljiv tekst (polje poruke), konfiguracija = reference stavki
     (calc:<heš> za kalkulator, token za konfigurator), pn = napomena za proizvodnju — interna, ide u
     skriveno polje forme, kupac je ne vidi (v. _content/handoff-backend.md) */
  function itemNote(x) { var o = fromItem(x); return o && o.r.ok ? nameOf(o.id) + ': ' + o.r.note : ''; }
  function quoteHref(text, refs, notes) {
    return page('kontakt.html') + '?konfig=' + encodeURIComponent(text)
      + (refs && refs.length ? '&konfiguracija=' + encodeURIComponent(refs.join('\n')) : '')
      + (notes && notes.length ? '&pn=' + encodeURIComponent(notes.join('\n')) : '') + '#upit';
  }
  function oneHref(id, s, r) { return quoteHref(textFor(id, s, r, true), ['calc:' + TC.serialize(id, s)], [t('calc.tx.note', { x: nameOf(id) + ': ' + r.note })]); }
  function listHref(l) {
    var notes = l.map(function (x, i) { var n = x.kind === 'calc' ? itemNote(x) : ''; return n ? t('calc.tx.item', { n: i + 1 }) + t('calc.tx.note', { x: n }) : ''; }).filter(Boolean);
    return quoteHref(listText(l), l.map(function (x) { return x.kind === 'calc' ? 'calc:' + x.hash : x.token; }), notes);
  }

  /* ---- bočni presek crepa (inline SVG) ----------------------------------- */
  function svgCrep(r, big) {
    var W = 640, H = 128;
    if (!r.ok) return '<svg class="calc-svg__s" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"></svg>';
    var x0 = 14, x1 = W - 14, s = (x1 - x0) / r.L, y0 = 58, sh = Math.max(5, Math.min(12, r.pitch * s * 0.35));
    var p = 'M' + x0 + ' ' + y0 + ' H' + (x0 + r.start * s).toFixed(1), x = x0 + r.start * s, ticks = [x0, x];
    for (var i = 0; i < r.tiles; i++) {
      var xe = x + r.pitch * s, xm = x + r.pitch * s * 0.55;
      p += ' L' + x.toFixed(1) + ' ' + (y0 - sh).toFixed(1) + ' Q' + xm.toFixed(1) + ' ' + (y0 - sh * 1.15).toFixed(1) + ' ' + xe.toFixed(1) + ' ' + y0;
      x = xe;
    }
    p += ' H' + x1.toFixed(1);
    ticks.push(x, x1);
    var lab = function (xx, txt, anchor, y, dim) { return '<text x="' + xx.toFixed(1) + '" y="' + y + '" text-anchor="' + anchor + '"' + (dim ? ' data-dim="' + dim + '"' : '') + '>' + esc(txt) + '</text>'; };
    var band = function (a, b, dim) { return '<rect class="calc-svg__hl" data-dim="' + dim + '" x="' + a.toFixed(1) + '" y="20" width="' + Math.max(2, b - a).toFixed(1) + '" height="' + (y0 - 14) + '"/>'; };
    var mid = (ticks[1] + ticks[2]) / 2;
    var g = '<svg class="calc-svg__s" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('calc.svg', { s: fmt(r.start), tiles: r.tiles, tilesW: plural(r.tiles, 'tile'), p: fmt(r.pitch, r.pitch % 1 ? 2 : 0), e: fmt(r.end, r.end % 1 ? 2 : 0) })) + '">';
    g += band(ticks[0], ticks[1], 'kraj') + band(ticks[1], ticks[2], 'tiles') + band(ticks[2], ticks[3], 'pocetak');
    g += '<g class="calc-svg__dim">' + ticks.map(function (tx) { return '<path d="M' + tx.toFixed(1) + ' 20V' + (y0 - 16) + '"/>'; }).join('') +
      '<path d="M' + x0 + ' 26H' + x1 + '" class="calc-svg__dl"/>' +
      '<path data-dim="L" d="M' + x0 + ' 98H' + x1 + '"/><path data-dim="L" d="M' + x0 + ' 92V104M' + x1 + ' 92V104"/></g>';
    g += '<path class="calc-svg__sheet" d="' + p + '"/>';
    g += '<g class="calc-svg__t">' +
      lab(x0, t('calc.svg.start') + ' ' + fmt(r.start), 'start', 16, 'kraj') +
      lab(mid, r.tiles + ' × ' + fmt(r.pitch, r.pitch % 1 ? 2 : 0), 'middle', 16, 'tiles') +
      lab(x1, t('calc.svg.end') + ' ' + fmt(r.end, r.end % 1 ? 2 : 0), 'end', 16, 'pocetak') +
      lab((x0 + x1) / 2, 'L = ' + fmt(r.L) + ' mm', 'middle', 120, 'L') + '</g></svg>';
    return g;
  }

  /* ---- montaža ------------------------------------------------------------ */
  var FIELDS = {
    L: { step: 10, big: 100, btn: 100, unit: 'mm', label: 'calc.f.L' },
    n: { step: 1, big: 10, btn: 1, unit: 'pcs', label: 'calc.f.n' },
    W: { step: 10, big: 100, btn: 100, unit: 'mm', label: 'calc.f.W' },
    e: { step: 1, big: 10, btn: 5, unit: 'mm', label: 'calc.f.e' }
  };

  function Mount(el) {
    this.el = el;
    this.uid = 'calc' + (++seq);
    var mode = el.getAttribute('data-calc-tabs') || 'all', first = el.getAttribute('data-calc');
    this.tabs = mode === 'trapez' ? TC.TRAPEZ.slice() : TC.IDS.slice();
    if (TC.IDS.indexOf(first) < 0) first = this.tabs[0];
    if (mode === 'none') this.tabs = [first];
    if (this.tabs.indexOf(first) < 0) first = this.tabs[0];
    this.id = first;
    this.hashSync = el.hasAttribute('data-calc-hash');
    this.trap = TC.defaults('tr20', C);
    this.crep = TC.defaults('crep', C);
    this.raw = {};
    this.notice = '';
    // heš se piše tek posle izmene (ili ako je strana otvorena sa stanjem u hešu) — sidra kao #kalkulator ostaju
    this.touched = false;
    if (this.hashSync) this.touched = this.fromHash(location.hash, true) && /=/.test(location.hash);
    el.classList.add('calc-host');
    this.render();
    this.bind();
    this.markNav();
    el.__calc = this;
  }
  var M = Mount.prototype;
  M.st = function () { return this.id === 'crep' ? this.crep : this.trap; };
  M.fromHash = function (h, init) {
    var p = TC.parse(h, C);
    if (!p || this.tabs.indexOf(p.id) < 0) return false;
    this.id = p.id;
    if (/=/.test(h)) { if (p.id === 'crep') this.crep = p.state; else this.trap = p.state; }
    this.raw = {};
    if (!init) { this.render(); this.markNav(); }
    return true;
  };
  // vrednost polja po ključu: kod trapeza L / n žive u redovima (s.rows[i]), ostalo u stanju
  M.get = function (k) {
    var s = this.st(), f = base(k);
    if (this.id !== 'crep' && (f === 'L' || f === 'n')) { var r = s.rows[rowIx(k)]; return r ? r[f] : NaN; }
    return s[f];
  };
  M.put = function (k, v) {
    var s = this.st(), f = base(k);
    if (this.id !== 'crep' && (f === 'L' || f === 'n')) { var r = s.rows[rowIx(k)]; if (r) r[f] = v; return; }
    s[f] = v;
  };
  M.lim = function (k) {
    var s = this.st(), id = this.id, f = base(k);
    if (id !== 'crep') {
      var P = C.profiles[id];
      if (f === 'L') return { min: P.lengthMin, max: P.lengthMax };
    } else {
      var Q = C.crep, st = Q.start;   // kraj table: uvek Q.start (30 mm)
      if (f === 'L') return { min: st + Q.tile + Q.endMin, max: Q.lengthMax };
      if (f === 'e') return { min: Q.endMin, max: fin(s.L) ? Math.max(Q.endMin, s.L - st - Q.tile) : Q.lengthMax };
    }
    if (f === 'n') return { min: 1, max: 9999 };
    return { min: 1, max: 999999 };
  };
  M.hint = function (k) {
    var f = base(k), l = this.lim(f);
    if (rowIx(k)) return '';                    // dodatni redovi: opseg je ispisan uz prvi red, ovde samo greška
    if (f === 'n' || f === 'W') return t('calc.minOnly', { min: fmt(l.min) + (f === 'W' ? ' mm' : '') });
    if (f === 'e') return t('calc.e.hint');
    return t('calc.range', { min: fmt(l.min), max: fmt(l.max), u: 'mm' });
  };

  /* pomoć uz polje: [dugme, tekst]. Tekst je skriven dok se dugme ne pritisne (miš, Enter/razmak, dodir);
     Esc ga zatvara. dim: deo crteža crepa koji se ističe dok je pomoć otvorena. */
  M.help = function (key, label, vars, dim) {
    var id = this.uid + '-h-' + key;
    return ['<button type="button" class="calc-help" aria-expanded="false" aria-controls="' + id + '" data-help="' + key + '"' + (dim ? ' data-dim="' + dim + '"' : '') +
      ' aria-label="' + esc(t('calc.help.btn', { f: label })) + '"><span aria-hidden="true">?</span></button>',
      '<p class="calc-help__tip" id="' + id + '" hidden>' + esc(t('calc.help.' + key, vars || {})) + '</p>'];
  };
  var HELP = { L: 'L', n: 'n', W: 'W', e: 'e' }, DIM = { L: 'L', e: 'pocetak' };
  /* k = ključ polja (L, n, W, e; redovi trapeza L1, n1 …); label = drugi natpis (redovi dužina) */
  M.numField = function (k, hidden, label) {
    var f = base(k), F = FIELDS[f], id = this.uid + '-' + k, l = this.lim(f), lab = label || t(F.label), unit = F.unit === 'pcs' ? t('calc.unit.pcs') : 'mm';
    var cur = this.get(k), v = this.raw[k] != null ? this.raw[k] : (fin(cur) ? fmt(cur) : '');
    var crep = this.id === 'crep', hp = rowIx(k) ? ['', ''] : this.help(f === 'L' && crep ? 'Lcrep' : HELP[f], lab, { min: fmt(C.crep.endMin) }, crep ? DIM[f] : '');
    return '<div class="calc-field" data-field="' + k + '"' + (hidden ? ' hidden' : '') + '>' +
      '<div class="calc-field__h"><label class="calc-field__l" for="' + id + '">' + esc(lab) + '</label>' + hp[0] + '</div>' + hp[1] +
      '<div class="calc-num">' +
        '<button type="button" class="calc-num__b" data-step="-1" data-f="' + k + '" tabindex="-1" aria-label="' + esc(t('calc.dec', { f: lab })) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg></button>' +
        '<input class="calc-num__i" id="' + id + '" data-f="' + k + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" enterkeyhint="done" role="spinbutton" aria-valuemin="' + l.min + '" aria-valuemax="' + l.max + '"' + (fin(cur) ? ' aria-valuenow="' + cur + '"' : '') + ' aria-describedby="' + id + '-m" value="' + esc(v) + '">' +
        '<span class="calc-num__u" aria-hidden="true">' + esc(unit) + '</span>' +
        '<button type="button" class="calc-num__b" data-step="1" data-f="' + k + '" tabindex="-1" aria-label="' + esc(t('calc.inc', { f: lab })) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12M12 6v12"/></svg></button>' +
      '</div>' +
      '<p class="calc-field__m" id="' + id + '-m" aria-live="polite">' + esc(this.hint(k)) + '</p></div>';
  };
  /* trapez: dužine i količine jedne stavke (isti profil, boja, filc, debljina). U režimu „znam širinu
     krova“ ostaje jedan red bez količine (broj tabli se računa), a dodavanje dužina je skriveno. */
  M.rowsHtml = function () {
    var self = this, s = this.st(), rs = s.rows, w = s.mode === 'w', many = rs.length > 1, max = C.maxRows || 15;
    var hp = this.help('rows', t('calc.rows'));
    var h = '<fieldset class="calc-field calc-rows"><legend class="calc-field__l">' + esc(t('calc.rows')) + hp[0] + '</legend>' + hp[1];
    rs.forEach(function (x, i) {
      var sfx = i ? String(i) : '';
      h += '<div class="calc-lrow' + (many ? ' is-many' : '') + '" data-row="' + i + '"' + (many ? ' role="group" aria-label="' + esc(t('calc.row.label', { i: i + 1 })) + '"' : '') + '>' +
        (many ? '<div class="calc-lrow__h"><span class="calc-lrow__i" aria-hidden="true">' + esc(t('calc.row.label', { i: i + 1 })) + '</span>' +
          '<button type="button" class="calc-lrow__x" data-row-del="' + i + '" aria-label="' + esc(t('calc.row.del', { i: i + 1 })) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' : '') +
        self.numField('L' + sfx, false, w ? t('calc.f.L') : t('calc.row.L')) + self.numField('n' + sfx, w, t('calc.row.n')) +
        '</div>';
    });
    h += '<div class="calc-rows__f"' + (w ? ' hidden' : '') + '><button type="button" class="btn btn--glass btn--sm calc-addrow" data-row-add' + (rs.length >= max ? ' disabled' : '') + '>' + I_PLUS + esc(t('calc.row.add')) + '</button>' +
      '<p class="calc-field__m calc-rows__m" aria-live="polite">' + esc(t('calc.rows.hint', { max: max })) + '</p></div>';
    return h + '</fieldset>';
  };
  M.seg = function (name, legend, opts, val, help) {
    var u = this.uid, hp = help ? this.help(help.key, legend, help.vars, help.dim) : ['', ''];
    return '<fieldset class="calc-field calc-field--seg" data-seg="' + name + '"><legend class="calc-field__l">' + esc(legend) + hp[0] + '</legend>' + hp[1] + '<div class="calc-seg">' +
      opts.map(function (o) {
        return '<label class="calc-seg__o"' + (o.tip ? ' data-tip="' + esc(o.tip) + '"' : '') + '><input type="radio" name="' + u + '-' + name + '" value="' + o.v + '"' + (o.v === val ? ' checked' : '') + (o.dis ? ' disabled aria-describedby="' + (o.desc || u + '-tip') + '"' : '') + '><span>' + esc(o.l) + '</span></label>';
      }).join('') + '</div></fieldset>';
  };
  M.swatches = function () {
    var u = this.uid, s = this.st(), allow = allowedColours(this.id), bad = colourObsolete(this.id, s.colour);
    var all = colours().filter(function (c) { return !allow || allow.indexOf(c.ral) >= 0; }), shop = all.filter(function (c) { return c.shopOrder; }), rest = all.filter(function (c) { return !c.shopOrder; });
    var sel = bad ? null : (colourBy(s.colour) || all[0]);
    function sw(c) {
      var nm = colourName(c), std = colourStd(c);
      return '<label class="calc-sw" title="RAL ' + c.ral + ' · ' + esc(std) + '"><input type="radio" name="' + u + '-c" value="' + c.ral + '"' + (sel && c.ral === sel.ral ? ' checked' : '') + ' aria-label="RAL ' + c.ral + ' ' + esc(nm) + '"><span class="calc-sw__c" style="--sw:' + c.hex + '"></span><span class="calc-sw__t"><b>' + c.ral + '</b><small>' + esc(nm) + '</small></span></label>';
    }
    var open = !!sel && !sel.shopOrder;
    return '<fieldset class="calc-field calc-field--sw"><legend class="calc-field__l">' + esc(t('calc.f.colour')) + ' <span class="calc-sw__sel" data-o="colour">' + (sel ? 'RAL ' + sel.ral + ' · ' + esc(colourName(sel)) : 'RAL ' + esc(s.colour) + ' ⚠') + '</span></legend>' +
      (allow ? '<p class="calc-field__m calc-sw__lim">' + esc(t('calc.colour.limited', { name: nameOf(this.id), list: allow.map(function (x) { return 'RAL ' + x; }).join(', ') })) + '</p>' +
        '<p class="calc-field__m calc-sw__warn" role="alert"' + (bad ? '' : ' hidden') + '>' + (bad ? esc(obsoleteText(this.id, s.colour)) : '') + '</p>' : '') +
      '<div class="calc-sws">' + shop.map(sw).join('') + '</div>' +
      (rest.length ? '<details class="calc-more"' + (open ? ' open' : '') + '><summary>' + esc(t('calc.colour.more', { n: rest.length })) + '</summary><div class="calc-sws calc-sws--more">' + rest.map(sw).join('') + '</div></details>' : '') +
      '</fieldset>';
  };
  M.thick = function () {
    var u = this.uid, s = this.st(), list = thicknesses(this.id), hp = this.help('t', t('calc.f.t'));
    return '<div class="calc-field"><div class="calc-field__h"><label class="calc-field__l" for="' + u + '-t">' + esc(t('calc.f.t')) + '</label>' + hp[0] + '</div>' + hp[1] +
      '<div class="calc-sel"><select id="' + u + '-t" data-f="t" aria-describedby="' + u + '-t-m">' + list.map(function (x) { return '<option value="' + x + '"' + (x === s.t ? ' selected' : '') + '>' + fmtT(x) + ' mm</option>'; }).join('') + '</select></div>' +
      '<p class="calc-field__m" id="' + u + '-t-m">' + esc(t('calc.t.hint')) + '</p></div>';
  };
  M.felt = function () {
    var u = this.uid, s = this.st(), hp = this.help('felt', t('calc.f.felt'));
    return '<div class="calc-field calc-field--felt"><div class="calc-field__h"><span class="calc-field__l" id="' + u + '-fl">' + esc(t('calc.f.felt')) + '</span>' + hp[0] + '</div>' + hp[1] +
      '<label class="calc-tg"><input type="checkbox" role="switch" data-f="felt" aria-labelledby="' + u + '-fl ' + u + '-flt"' + (s.felt ? ' checked' : '') + '><span class="calc-tg__t" aria-hidden="true"></span><span class="calc-tg__l" id="' + u + '-flt">' + esc(t('calc.felt.label')) + '</span></label></div>';
  };

  M.kraj = function () {
    var v = fmt(C.crep.start), hp = this.help('kraj', t('calc.f.start'), { v: v }, 'kraj');
    return '<div class="calc-field calc-field--fixed" data-field="kraj"><div class="calc-field__h"><span class="calc-field__l">' + esc(t('calc.f.start')) + '</span>' + hp[0] + '</div>' + hp[1] +
      '<p class="calc-fixed">' + esc(t('calc.kraj.fixed', { v: v })) + '</p></div>';
  };
  M.formHtml = function () {
    var s = this.st(), id = this.id, h = '';
    if (id === 'crep') {
      var wAvail = fin(C.crep.coverWidth) && C.crep.coverWidth > 0;
      if (wAvail) h += this.seg('mode', t('calc.mode'), [{ v: 'n', l: t('calc.mode.n') }, { v: 'w', l: t('calc.mode.w') }], s.mode, { key: 'mode' });
      h += '<div class="calc-row">' + this.numField('L') + (wAvail ? this.numField('n', s.mode === 'w') + this.numField('W', s.mode !== 'w') : this.numField('n')) + '</div>';
      if (!wAvail) h += '<p class="calc-aside">' + esc(t('calc.crep.noWidth')) + '</p>';
      // početak (kod oluka): slobodan ili zadat; kraj (suprotna strana): uvek C.crep.start
      h += '<div class="calc-row">' + this.seg('end', t('calc.endMode'), [{ v: 'free', l: t('calc.endMode.free') }, { v: 'fixed', l: t('calc.endMode.fixed') }], s.endMode, { key: 'endMode', vars: { min: fmt(C.crep.endMin) }, dim: 'pocetak' }) + this.kraj() + '</div>';
      h += '<div class="calc-row">' + this.numField('e', s.endMode !== 'fixed') + '</div>';
      h += '<div class="calc-row">' + this.felt() + this.thick() + '</div>';
      h += this.swatches();
      return h;
    }
    // širina krova daje broj tabli samo za jednu dužinu — uz više dužina taj režim je isključen
    var many = s.rows.length > 1, mtip = this.uid + '-mtip';
    h += this.seg('mode', t('calc.mode'), [{ v: 'n', l: t('calc.mode.n') }, { v: 'w', l: t('calc.mode.w'), dis: many, tip: many ? t('calc.mode.wMulti') : '', desc: mtip }], s.mode, { key: 'mode' });
    if (many) h += '<p class="calc-aside" id="' + mtip + '">' + esc(t('calc.mode.wMulti')) + '</p>';
    h += this.rowsHtml();
    h += '<div class="calc-row">' + this.numField('W', s.mode !== 'w') + '</div>';
    h += '<div class="calc-row">' + this.seg('side', t('calc.f.side'), [{ v: 'krov', l: t('calc.side.krov') }, { v: 'fasada', l: t('calc.side.fasada'), dis: s.felt, tip: s.felt ? t('calc.felt.tip') : '' }], s.side, { key: 'side' }) + this.felt() + '</div>';
    h += '<p class="calc-notice' + (this.notice ? ' is-switched' : '') + '" id="' + this.uid + '-tip" role="status"' + (s.felt ? '' : ' hidden') + '>' + esc(this.notice || (s.felt ? t('calc.felt.tip') : '')) + '</p>';
    h += this.swatches();
    h += '<div class="calc-row">' + this.thick() + '</div>';
    return h;
  };
  function row(label, key, extra) { return '<div class="calc-dl__r"><dt>' + esc(label) + '</dt><dd data-o="' + key + '">—</dd>' + (extra || '') + '</div>'; }
  M.resHtml = function () {
    var id = this.id, crep = id === 'crep', h = '<div class="calc-key">';
    if (crep) {
      h += '<div class="calc-key__i"><span class="calc-key__l">' + esc(t('calc.res.tiles')) + '</span><b class="calc-key__v" data-o="tiles">—</b></div>';
      h += '<div class="calc-key__i"><span class="calc-key__l">' + esc(t('calc.res.matTotal')) + '</span><b class="calc-key__v"><span data-o="matTot">—</span> <small>m</small></b></div>';
    } else {
      h += '<div class="calc-key__i"><span class="calc-key__l">' + esc(t('calc.res.sheets')) + '</span><b class="calc-key__v" data-o="n">—</b></div>';
      h += '<div class="calc-key__i"><span class="calc-key__l">' + esc(t('calc.res.area')) + '</span><b class="calc-key__v"><span data-o="area">—</span> <small>m²</small></b><small class="calc-key__s" data-o="areaW"></small></div>';
    }
    if (C.SHOW_PRICES) h += '<div class="calc-key__i calc-key__i--p"><span class="calc-key__l">' + esc(t('calc.res.price')) + '</span><b class="calc-key__v"><span data-o="price">—</span> <small>€</small></b><small class="calc-key__s">' + esc(t(crep ? 'calc.res.priceTemp' : 'calc.res.priceNote')) + '</small></div>';
    h += '<p class="calc-key__line" data-o="line" aria-live="polite"></p></div>';
    h += '<div class="calc-detail">';
    if (crep) h += '<div class="calc-svg" data-o="svg"></div>';
    else h += '<div class="calc-brk" data-o="rows" hidden></div>';
    h += '<dl class="calc-dl">';
    if (crep) {
      h += row(t('calc.res.end'), 'end') + row(t('calc.res.pitch'), 'pitch') + row(t('calc.res.start'), 'start') + row(t('calc.res.mat'), 'mat') +
        row(t('calc.res.sheets'), 'n') + row(t('calc.res.developed'), 'dev') + row(t('calc.res.weight'), 'weight') + row(t('calc.res.felt'), 'felt') +
        row(t('calc.res.colour'), 'colourR') + row(t('calc.res.t'), 't');
    } else {
      h += row(t('calc.res.L'), 'L') + row(t('calc.res.cover'), 'cover') + row(t('calc.res.covered'), 'covered') + row(t('calc.res.linear'), 'linear') +
        row(t('calc.res.weight'), 'weight') + row(t('calc.res.felt'), 'felt') + row(t('calc.res.colour'), 'colourR') + row(t('calc.res.side'), 'side') + row(t('calc.res.t'), 't') +
        (C.profiles[id].reinforced ? row(t('calc.res.reinf'), 'reinf') : '');
    }
    h += '</dl>';
    if (crep) h += '<div class="calc-adv" data-o="adv" aria-live="polite"></div>';
    h += '</div>';
    h += '<div class="calc-act">' +
      '<a class="btn calc-act__send" data-act="send" href="' + esc(page('kontakt.html') + '#upit') + '">' + esc(t('calc.act.send')) + ' ' + ARROW + '</a>' +
      '<button type="button" class="btn btn--glass calc-act__add" data-act="add">' + I_PLUS + esc(t('calc.act.add')) + '</button>' +
      '<button type="button" class="calc-act__t" data-act="print">' + I_PRINT + '<span>' + esc(t('calc.act.print')) + '</span></button>' +
      '<button type="button" class="calc-act__t" data-act="share">' + I_LINK + '<span>' + esc(t('calc.act.share')) + '</span></button>' +
      '</div><p class="calc-msg" role="status" aria-live="polite"></p>';
    return h;
  };
  M.render = function () {
    var u = this.uid, id = this.id, self = this, h = '';
    if (this.tabs.length > 1) {
      h += '<div class="calc-tabs" role="tablist" aria-label="' + esc(t('calc.tabs')) + '">' + this.tabs.map(function (x) {
        var on = x === id;
        return '<button type="button" class="calc-tab" role="tab" id="' + u + '-tab-' + x + '" data-tab="' + x + '" aria-selected="' + on + '" aria-controls="' + u + '-panel" tabindex="' + (on ? 0 : -1) + '"><span>' + esc(t('calc.tab.' + x)) + '</span></button>';
      }).join('') + '</div>';
    }
    var desc = id === 'crep'
      ? t('calc.desc.crep', { tile: fmt(C.crep.tile), step: fmt(C.crep.step), dw: fmt(C.crep.developedWidth), max: fmt(C.crep.lengthMax) })
      : t('calc.desc.trapez', { cw: fmt(C.profiles[id].coverWidth), dw: fmt(C.profiles[id].developedWidth), min: fmt(C.profiles[id].lengthMin), max: fmt(C.profiles[id].lengthMax) });
    h += '<div class="calc-panel" id="' + u + '-panel"' + (this.tabs.length > 1 ? ' role="tabpanel" aria-labelledby="' + u + '-tab-' + id + '"' : '') + '>' +
      '<div class="calc-head"><div><p class="calc-head__t">' + esc(nameOf(id)) + '</p><p class="calc-head__d">' + esc(desc) + '</p></div>' +
      (id !== 'crep' && C.profiles[id].reinforced ? '<span class="calc-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>' + esc(t('calc.badge.tr40')) + '</span>' : '') + '</div>' +
      '<div class="calc-body"><div class="calc-form" role="group" aria-label="' + esc(nameOf(id)) + '">' + this.formHtml() + '</div>' +
      '<div class="calc-res" role="region" aria-label="' + esc(t('calc.res')) + '">' + this.resHtml() + '</div></div></div>';
    this.el.innerHTML = '<div class="calc">' + h + '</div>';
    this.el.setAttribute('data-calc-id', id);
    this.update();
  };
  M.q = function (sel) { return this.el.querySelector(sel); };
  M.out = function (k, html) { var e = this.el.querySelector('[data-o="' + k + '"]'); if (e) e.innerHTML = html; };

  M.update = function () {
    var self = this, id = this.id, s = this.st(), r = compute(id, s);
    this.last = r;
    // poruke ispod polja: greška ima prednost pred napomenom (isti red — bez pomeranja)
    Array.prototype.forEach.call(this.el.querySelectorAll('.calc-field[data-field]'), function (box) {
      var f = box.getAttribute('data-field'), inp = box.querySelector('input.calc-num__i');
      if (!inp) return;
      var e = r.errors[f], m = box.querySelector('.calc-field__m'), l = self.lim(f), cur = self.get(f);
      var msg = '';
      if (e) {
        var v = {}; for (var k in e.v) v[k] = fin(e.v[k]) ? fmt(e.v[k]) : e.v[k];
        msg = (e.k === 'calc.err.required' && self.raw[f] != null && String(self.raw[f]).trim() !== '') ? t('calc.err.int') : t(e.k, v);
      }
      box.classList.toggle('has-error', !!e);
      inp.setAttribute('aria-invalid', e ? 'true' : 'false');
      inp.setAttribute('aria-valuemin', l.min); inp.setAttribute('aria-valuemax', l.max);
      if (fin(cur)) inp.setAttribute('aria-valuenow', cur); else inp.removeAttribute('aria-valuenow');
      var txt = msg || self.hint(f);
      if (m.textContent !== txt) m.textContent = txt;
    });
    var rm = this.q('.calc-rows__m');
    if (rm) {
      var re = r.errors.rows, rt = re ? t(re.k, re.v) : t('calc.rows.hint', { max: C.maxRows || 15 });
      rm.classList.toggle('is-err', !!re);
      if (rm.textContent !== rt) rm.textContent = rt;
    }
    var ok = r.ok, D = '—';
    this.el.classList.toggle('is-invalid', !ok);
    this.out('line', esc(plainLine(r)));
    this.out('price', ok && r.showPrices ? fmt(r.price) : D);
    this.out('weight', ok ? '≈ ' + fmt(r.weight, 1) + ' kg' : D);
    this.out('felt', ok ? (r.felt ? fmt(r.feltArea, 2) + ' m²' : esc(t('calc.res.noFelt'))) : D);
    var c = colourBy(r.colour);
    var chip = '<span class="calc-dot" style="--sw:' + (c ? c.hex : 'transparent') + '"></span>' + esc(colourLabel(r.colour));
    this.out('colourR', chip);
    var bad = colourObsolete(id, r.colour), cw = this.el.querySelector('.calc-sw__warn');
    var cs = this.el.querySelector('.calc-sw__sel'); if (cs) cs.textContent = bad ? 'RAL ' + r.colour + ' ⚠' : colourLabel(r.colour).replace(/^(RAL \d+) /, '$1 · ');
    if (cw) { cw.hidden = !bad; cw.textContent = bad ? obsoleteText(id, r.colour) : ''; }
    if (bad) this.out('colourR', chip + ' ⚠');
    this.out('t', fmtT(r.t) + ' mm');
    if (id === 'crep') {
      this.out('tiles', ok ? fmt(r.tiles) : D);
      this.out('matTot', ok ? fmt(r.totalMaterialM, 2) : D);
      this.out('start', ok ? fmt(r.start) + ' mm' : D);
      this.out('pitch', ok ? fmt(r.pitch, r.pitch % 1 ? 2 : 0) + ' mm' + (r.endMode === 'fixed' ? ' <small class="calc-dd__s' + (r.warnings.length ? ' is-warn' : '') + '">' + esc(t('calc.res.dev', { d: signed(r.deviation, 2) })) + '</small>' : '') : D);
      this.out('end', ok ? fmt(r.end, r.end % 1 ? 2 : 0) + ' mm' : D);
      this.out('mat', ok ? fmt(r.materialLength) + ' mm' : D);
      this.out('n', ok ? fmt(r.n) + (r.mode === 'w' ? ' <small class="calc-dd__s">' + esc(t('calc.res.surplus', { s: fmt(r.surplus) })) + '</small>' : '') : D);
      this.out('dev', ok ? fmt(r.developedArea, 2) + ' m²' : D);
      this.out('svg', svgCrep(r));
      var adv = '';
      if (r.legacyStart != null) adv += '<p class="calc-warn" role="status">' + esc(t('calc.legacyStart', { old: fmt(r.legacyStart), v: fmt(r.start) })) + '</p>';
      if (ok) {
        r.warnings.forEach(function (wn) { var v = {}; for (var k in wn.v) v[k] = fin(wn.v[k]) ? signed(wn.v[k], 2) : wn.v[k]; v.tol = fmt(wn.v.tol); adv += '<p class="calc-warn">' + esc(t(wn.k, v)) + '</p>'; });
        if (r.suggest && (r.suggest.down || r.suggest.up)) {
          var chips = [];
          // kad zadati kraj mora da se promeni (van 20–40 mm), čip to kaže i postavlja oba polja
          var se = r.suggest.e != null ? r.suggest.e : null;
          var sugChip = function (L, arrow) {
            return '<button type="button" class="calc-chip" data-sugg="' + L + '"' + (se != null ? ' data-sugg-e="' + se + '"' : '')
              + ' title="' + esc(t(se != null ? 'calc.suggest.titleE' : 'calc.suggest.title', { L: fmt(L), e: fmt(se) })) + '"><span aria-hidden="true">' + arrow + '</span> ' + fmt(L) + ' mm'
              + (se != null ? ' <small>' + esc(t('calc.suggest.end', { e: fmt(se) })) + '</small>' : '') + '</button>';
          };
          if (r.suggest.down) chips.push(sugChip(r.suggest.down, 'L↓'));
          if (r.suggest.up) chips.push(sugChip(r.suggest.up, 'L↑'));
          adv += '<p class="calc-sugg"><span>' + esc(t('calc.suggest')) + '</span> ' + chips.join(' <span class="calc-sugg__or">' + esc(t('calc.suggest.or')) + '</span> ') + '</p>';
        } else if (r.standard) adv += '<p class="calc-ok">' + esc(t('calc.std')) + '</p>';
      }
      this.out('adv', adv);
    } else {
      this.out('n', ok ? fmt(r.n) : D);
      this.out('area', ok && !r.areaMissing ? fmt(r.totalArea, 2) : D);
      // koja širina daje površinu (pokrivna širina profila) — ili da je nema
      this.out('areaW', esc(r.areaMissing ? t('calc.res.noWidth') : t('calc.res.areaW', { w: fmt(r.widthUsed) })));
      this.out('L', ok ? (r.multi ? esc(t('calc.res.Lmulti', { k: r.rows.length, lens: plural(r.rows.length, 'len') })) : fmt(r.L) + ' mm') : D);
      this.out('cover', r.areaMissing ? esc(t('calc.res.noWidth')) : fmt(r.coverWidth) + ' mm');
      var cov = this.q('[data-o="covered"]');
      if (cov) cov.parentNode.hidden = !!r.multi;     // pokrivena širina (n × pokrivna) ima smisla samo za jednu dužinu
      this.out('covered', ok && fin(r.coveredWidth) ? fmt(r.coveredWidth) + ' mm' + (r.mode === 'w' ? ' <small class="calc-dd__s">' + esc(t('calc.res.surplus', { s: fmt(r.surplus) })) + '</small>' : '') : D);
      this.out('linear', ok ? fmtM(r.linearM) + ' m' : D);
      var bk = this.q('[data-o="rows"]');
      if (bk) { bk.hidden = !(ok && r.multi); bk.innerHTML = ok && r.multi ? brkTable(r, 'calc-brk__t') : ''; }
      this.out('side', esc(sideLabel(r.side)));
      this.out('reinf', esc(t('calc.res.reinfVal')));
    }
    var send = this.q('[data-act="send"]');
    if (send) send.href = ok ? oneHref(id, s, r) : page('kontakt.html') + '#upit';
    if (this.hashSync && ok && this.touched) {
      var hh = '#' + TC.serialize(id, s);
      if (location.hash !== hh) { try { history.replaceState(null, '', hh); } catch (e) { /* file:// u nekim pregledačima */ } }
    }
  };

  /* ---- događaji ----------------------------------------------------------- */
  // posle prve izmene stanje više nije „stara veza“ (novi heš nema „p“)
  M.edited = function () { this.touched = true; if (this.id === 'crep') delete this.crep.legacyStart; };
  M.hl = function (dim) { var b = this.q('.calc-svg'); if (!b) return; if (dim) b.setAttribute('data-hl', dim); else b.removeAttribute('data-hl'); };
  M.helpDim = function () { var o = this.q('.calc-help[aria-expanded="true"][data-dim]'); return o ? o.getAttribute('data-dim') : ''; };
  M.closeHelp = function (except) {
    Array.prototype.forEach.call(this.el.querySelectorAll('.calc-help[aria-expanded="true"]'), function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      var tip = d.getElementById(b.getAttribute('aria-controls')); if (tip) tip.hidden = true;
    });
  };
  M.toggleHelp = function (b) {
    var open = b.getAttribute('aria-expanded') !== 'true', tip = d.getElementById(b.getAttribute('aria-controls'));
    this.closeHelp(b);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (tip) tip.hidden = !open;
    this.hl(this.helpDim());
  };
  M.markNav = function () {
    // meni „Kalkulatori“ (zaglavlje i mobilni meni): veza izabranog kalkulatora dobija aria-current
    if (!this.hashSync) return;
    var id = this.id;
    Array.prototype.forEach.call(d.querySelectorAll('.dropdown a[href], .mnav__sub a[href]'), function (a) {
      var m = (a.getAttribute('href') || '').match(/(?:kalkulatori|calculators)\.html#([a-z0-9]+)$/);
      if (!m) return;
      if (m[1] === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  M.setNum = function (f, v, fromStep) {
    this.edited();
    this.put(f, v);
    if (fromStep) {
      delete this.raw[f];
      var inp = this.el.querySelector('input[data-f="' + f + '"]');
      if (inp) inp.value = fmt(v);
    }
    this.update();
  };
  M.step = function (f, dir, size) {
    var l = this.lim(f), cur = this.get(f);
    if (!fin(cur)) cur = dir > 0 ? l.min - (size || 1) : l.min;
    var v = Math.round(cur) + dir * (size || FIELDS[base(f)].step);
    v = Math.min(l.max, Math.max(l.min, v));
    this.setNum(f, v, true);
  };
  M.switchTab = function (id, focus) {
    if (id === this.id || this.tabs.indexOf(id) < 0) return;
    this.id = id; this.raw = {}; this.notice = ''; this.touched = true;
    if (id !== 'crep') {
      var list = thicknesses(id);
      if (list.indexOf(this.trap.t) < 0) this.trap.t = list.indexOf(C.defaultThickness) >= 0 ? C.defaultThickness : list[0];
    }
    this.render();
    this.markNav();
    if (this.hashSync && !this.last.ok) { try { history.replaceState(null, '', '#' + id); } catch (e) { /* */ } }
    if (focus) { var b = this.q('[data-tab="' + id + '"]'); if (b) b.focus(); }
  };
  M.msg = function (html) { var m = this.q('.calc-msg'); if (m) m.innerHTML = html; };
  M.bind = function () {
    var self = this, el = this.el;
    el.addEventListener('input', function (e) {
      var inp = e.target;
      if (!inp.matches('.calc-num__i')) return;
      var f = inp.getAttribute('data-f'), p = parseNum(inp.value);
      self.edited();
      self.raw[f] = inp.value;
      self.put(f, p.v);
      self.update();
    });
    el.addEventListener('focusout', function (e) {
      var inp = e.target;
      if (!inp.matches || !inp.matches('.calc-num__i')) return;
      var f = inp.getAttribute('data-f'), v = self.get(f);
      if (fin(v) && Math.floor(v) === v) { inp.value = fmt(v); delete self.raw[f]; }
    });
    // isticanje dela crteža dok je fokus u polju (L, početak) — pomoć ima prednost
    el.addEventListener('focusin', function (e) {
      var x = e.target, f = x.getAttribute && x.getAttribute('data-f');
      var dim = f && DIM[f] && self.id === 'crep' ? DIM[f] : (x.name === self.uid + '-end' ? 'pocetak' : '');
      self.hl(self.helpDim() || dim);
    });
    el.addEventListener('focusout', function () { setTimeout(function () { if (!el.contains(d.activeElement)) self.hl(self.helpDim()); }, 0); });
    el.addEventListener('keydown', function (e) {
      var tgt = e.target;
      if (e.key === 'Escape' && el.querySelector('.calc-help[aria-expanded="true"]')) {
        var ob = tgt.closest && (tgt.closest('.calc-help') || (tgt.closest('.calc-field') && tgt.closest('.calc-field').querySelector('.calc-help[aria-expanded="true"]')));
        self.closeHelp(); self.hl('');
        if (ob && ob.focus) ob.focus();
        return;
      }
      if (tgt.matches('.calc-num__i')) {
        var f = tgt.getAttribute('data-f'), F = FIELDS[base(f)], l = self.lim(f);
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); self.step(f, e.key === 'ArrowUp' ? 1 : -1, e.shiftKey ? F.big : F.step); }
        else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); self.step(f, e.key === 'PageUp' ? 1 : -1, F.big); }
        else if (e.key === 'Enter') { e.preventDefault(); tgt.blur(); tgt.focus(); }
        else if ((e.key === 'Home' || e.key === 'End') && e.ctrlKey) { e.preventDefault(); self.setNum(f, e.key === 'Home' ? l.min : Math.min(l.max, 999999), true); }
        return;
      }
      if (tgt.matches('.calc-tab')) {
        var tabs = self.tabs, i = tabs.indexOf(tgt.getAttribute('data-tab')), n = tabs.length, j = -1;
        if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
        else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
        if (j >= 0) { e.preventDefault(); self.switchTab(tabs[j], true); }
      }
    });
    el.addEventListener('change', function (e) {
      var x = e.target, s = self.st(), name = x.name || '', u = self.uid;
      self.edited();
      if (x.type === 'radio') {
        if (name === u + '-mode') {
          s.mode = x.value; self.toggle('n', s.mode === 'w'); self.toggle('W', s.mode !== 'w');
          var rf = self.q('.calc-rows__f'); if (rf) rf.hidden = s.mode === 'w';
          var lb = self.q('.calc-field[data-field="L"] .calc-field__l'); if (lb && self.id !== 'crep') lb.textContent = t(s.mode === 'w' ? 'calc.f.L' : 'calc.row.L');
        }
        else if (name === u + '-side') { s.side = x.value; self.notice = ''; var nt = self.q('.calc-notice'); if (nt) nt.hidden = true; }
        else if (name === u + '-end') {
          s.endMode = x.value;
          if (s.endMode === 'fixed' && !fin(s.e)) s.e = C.crep.endMin;
          self.toggle('e', s.endMode !== 'fixed');
        }
        else if (name === u + '-c') s.colour = x.value;
        self.update();
        return;
      }
      if (x.getAttribute('data-f') === 'felt') {
        s.felt = x.checked;
        if (self.id !== 'crep') {
          var fas = self.q('input[name="' + u + '-side"][value="fasada"]'), kr = self.q('input[name="' + u + '-side"][value="krov"]'), lab = fas && fas.closest('label');
          if (s.felt && s.side === 'fasada') { s.side = 'krov'; kr.checked = true; self.notice = t('calc.felt.switched'); }
          else self.notice = '';
          fas.disabled = s.felt;
          if (s.felt) { fas.setAttribute('aria-describedby', u + '-tip'); lab.setAttribute('data-tip', t('calc.felt.tip')); }
          else { fas.removeAttribute('aria-describedby'); lab.removeAttribute('data-tip'); }
          var nt2 = self.q('.calc-notice');
          if (nt2) { nt2.textContent = self.notice || (s.felt ? t('calc.felt.tip') : ''); nt2.hidden = !s.felt; nt2.classList.toggle('is-switched', !!self.notice); }
        }
        self.update();
        return;
      }
      if (x.getAttribute('data-f') === 't') { s.t = +x.value; self.update(); }
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button, a');
      if (!b || !el.contains(b)) return;
      if (b.classList.contains('calc-help')) { e.preventDefault(); self.toggleHelp(b); return; }
      if (b.hasAttribute('data-step')) { self.step(b.getAttribute('data-f'), +b.getAttribute('data-step'), FIELDS[base(b.getAttribute('data-f'))].btn); return; }
      if (b.hasAttribute('data-row-add')) { self.addRow(); return; }
      if (b.hasAttribute('data-row-del')) { self.delRow(+b.getAttribute('data-row-del')); return; }
      if (b.hasAttribute('data-tab')) { self.switchTab(b.getAttribute('data-tab')); return; }
      if (b.hasAttribute('data-sugg')) { if (b.hasAttribute('data-sugg-e')) self.setNum('e', +b.getAttribute('data-sugg-e'), true); self.setNum('L', +b.getAttribute('data-sugg'), true); var li = self.q('input[data-f="L"]'); if (li) li.focus(); return; }
      var act = b.getAttribute('data-act');
      if (!act) return;
      var r = self.last, s = self.st();
      if (!r.ok && act !== 'share') { e.preventDefault(); self.msg(esc(t('calc.msg.invalid'))); return; }
      // boja koju profil više ne nudi (npr. stara veza za TR 10): nova porudžbina tek posle ponovnog izbora
      if ((act === 'send' || act === 'add') && colourObsolete(self.id, s.colour)) { e.preventDefault(); self.msg(esc(obsoleteText(self.id, s.colour))); return; }
      if (act === 'send') { b.href = oneHref(self.id, s, r); return; }
      if (act === 'add') self.add();
      else if (act === 'print') self.print();
      else if (act === 'share') self.share();
    });
  };
  M.toggle = function (f, hide) { var b = this.q('.calc-field[data-field="' + f + '"]'); if (b) b.hidden = !!hide; };
  /* redovi dužina (trapez): novi red je prazan (dužina i količina se unose), fokus ide na njegovu dužinu;
     posle uklanjanja nedovršeni unos (raw) ostalih redova se pomera zajedno sa redovima */
  M.addRow = function () {
    var s = this.st(), max = C.maxRows || 15;
    if (this.id === 'crep' || s.mode === 'w' || s.rows.length >= max) return;
    this.edited();
    s.rows.push({ L: NaN, n: NaN });
    var i = s.rows.length - 1;
    this.render();
    var inp = this.q('input[data-f="L' + i + '"]'); if (inp) inp.focus();
    this.msg(esc(t('calc.row.added', { i: i + 1 })));
  };
  M.delRow = function (i) {
    var s = this.st(), raw = {}, self = this;
    if (this.id === 'crep' || s.rows.length < 2 || !s.rows[i]) return;
    this.edited();
    s.rows.splice(i, 1);
    Object.keys(this.raw).forEach(function (k) {
      var f = base(k), j = rowIx(k);
      if (f !== 'L' && f !== 'n') { raw[k] = self.raw[k]; return; }
      if (j === i) return;
      raw[f + ((j > i ? j - 1 : j) || '')] = self.raw[k];
    });
    this.raw = raw;
    this.render();
    var j = Math.min(i, s.rows.length - 1), inp = this.q('input[data-f="L' + (j || '') + '"]') || this.q('[data-row-add]');
    if (inp) inp.focus();
    this.msg(esc(t('calc.row.removed', { i: i + 1 })));
  };
  M.add = function () {
    var id = this.id, s = this.st(), r = this.last, hash = TC.serialize(id, s), l = listGet(), dd = new Date();
    if (l.some(function (x) { return x.kind === 'calc' && x.hash === hash; })) { this.msg(esc(t('calc.msg.dup')) + this.listLink(l)); return; }
    l.push({ kind: 'calc', id: 'calc-' + id + '-' + dd.getTime().toString(36), calc: id, hash: hash,
      name: listLabel(r), code: nameOf(id),
      date: dd.toISOString().slice(0, 10), lang: lang() });
    if (!listSave(l)) { this.msg(esc(t('calc.msg.noStore'))); return; }
    this.msg(esc(t('calc.msg.added', { n: l.length })) + this.listLink(l));
    try { w.dispatchEvent(new CustomEvent('tricom:list', { detail: { n: l.length } })); } catch (e) { /* stari pregledači */ }
  };
  M.listLink = function (l) { return l.length > 1 ? ' <a class="link-kerf" href="' + esc(listHref(l)) + '">' + esc(t('calc.msg.sendAll', { n: l.length })) + '</a>' : ''; };
  M.share = function () {
    var self = this, url = calcUrl(TC.serialize(this.id, this.st()));
    function ok() { self.msg(esc(t('calc.msg.copied')) + ' <span class="calc-msg__url">' + esc(url) + '</span>'); }
    function fail() {
      var ta = d.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      d.body.appendChild(ta); ta.select();
      var done = false; try { done = d.execCommand('copy'); } catch (e) { done = false; }
      d.body.removeChild(ta);
      if (done) ok(); else self.msg(esc(t('calc.msg.copyFail')) + ' <span class="calc-msg__url">' + esc(url) + '</span>');
    }
    if (this.hashSync) { try { history.replaceState(null, '', '#' + TC.serialize(this.id, this.st())); } catch (e) { /* */ } }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fail); else fail();
  };

  /* ---- specifikacija za štampu (isti list kao konfigurator: .k-print / .k-tbl) */
  M.print = function () {
    var id = this.id, s = this.st(), r = this.last, dd = new Date(), date;
    try { date = dd.toLocaleDateString(lang() === 'en' ? 'en-GB' : 'sr-Latn-RS'); } catch (e) { date = dd.toISOString().slice(0, 10); }
    function tr(a, b) { return '<tr><th scope="row">' + esc(a) + '</th><td class="num">' + b + '</td></tr>'; }
    function tbl(cap, rows) { return '<div class="k-tw"><table class="k-tbl"><caption>' + esc(cap) + '</caption><thead><tr><th scope="col">' + esc(t('calc.print.th.item')) + '</th><th scope="col" class="num">' + esc(t('calc.print.th.val')) + '</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>'; }
    var inp = [], res = [];
    var feltTxt = r.felt ? fmt(r.feltArea, 2) + ' m²' : t('calc.res.noFelt');
    if (r.kind === 'crep') {
      inp.push(tr(t('calc.f.L'), fmt(r.L) + ' mm'), tr(t('calc.f.n'), fmt(r.n)), tr(t('calc.f.start'), fmt(r.start) + ' mm'),
        tr(t('calc.endMode'), esc(t(r.endMode === 'fixed' ? 'calc.endMode.fixed' : 'calc.endMode.free')) + (r.endMode === 'fixed' ? ' · ' + fmt(r.e) + ' mm' : '')),
        tr(t('calc.f.colour'), esc(colourLabel(r.colour))), tr(t('calc.f.t'), fmtT(r.t) + ' mm'), tr(t('calc.f.felt'), esc(r.felt ? t('calc.felt.label') : t('calc.res.noFelt'))));
      res.push(tr(t('calc.res.tiles'), fmt(r.tiles)), tr(t('calc.res.pitch'), fmt(r.pitch, r.pitch % 1 ? 2 : 0) + ' mm' + (r.endMode === 'fixed' ? ' (' + esc(t('calc.res.dev', { d: signed(r.deviation, 2) })) + ')' : '')),
        tr(t('calc.res.end'), fmt(r.end, r.end % 1 ? 2 : 0) + ' mm'), tr(t('calc.res.mat'), fmt(r.materialLength) + ' mm'), tr(t('calc.res.matTotal'), fmt(r.totalMaterialM, 2) + ' m'),
        tr(t('calc.res.developed'), fmt(r.developedArea, 2) + ' m²'), tr(t('calc.res.weight'), '≈ ' + fmt(r.weight, 1) + ' kg'), tr(t('calc.res.felt'), esc(feltTxt)));
    } else {
      inp.push(tr(t('calc.mode'), esc(t(r.mode === 'w' ? 'calc.mode.w' : 'calc.mode.n'))));
      if (r.multi) inp.push(tr(t('calc.rows'), esc(t('calc.res.Lmulti', { k: r.rows.length, lens: plural(r.rows.length, 'len') }))));
      else inp.push(tr(t('calc.f.L'), fmt(r.L) + ' mm'), r.mode === 'w' ? tr(t('calc.f.W'), fmt(r.W) + ' mm') : tr(t('calc.f.n'), fmt(r.n)));
      inp.push(tr(t('calc.f.side'), esc(sideLabel(r.side))),
        tr(t('calc.f.colour'), esc(colourLabel(r.colour))), tr(t('calc.f.t'), fmtT(r.t) + ' mm'), tr(t('calc.f.felt'), esc(r.felt ? t('calc.felt.label') : t('calc.res.noFelt'))));
      if (r.reinforced) inp.push(tr(t('calc.res.reinf'), esc(t('calc.badge.tr40'))));
      res.push(tr(t('calc.res.sheets'), fmt(r.n)), tr(t('calc.res.cover'), r.areaMissing ? esc(t('calc.res.noWidth')) : fmt(r.coverWidth) + ' mm'));
      if (!r.multi) res.push(tr(t('calc.res.covered'), fmt(r.coveredWidth) + ' mm' + (r.mode === 'w' ? ' (' + esc(t('calc.res.surplus', { s: fmt(r.surplus) })) + ')' : '')));
      res.push(tr(t('calc.res.area'), r.areaMissing ? '—' : fmt(r.totalArea, 2) + ' m²'), tr(t('calc.res.linear'), fmtM(r.linearM) + ' m'), tr(t('calc.res.developed'), fmt(r.developedArea, 2) + ' m²'),
        tr(t('calc.res.weight'), '≈ ' + fmt(r.weight, 1) + ' kg'), tr(t('calc.res.felt'), esc(feltTxt)));
    }
    if (r.showPrices) res.push(tr(t('calc.res.price'), '≈ ' + fmt(r.price) + ' € <small>(' + esc(t(r.kind === 'crep' ? 'calc.res.priceTemp' : 'calc.res.priceNote')) + ')</small>'));
    var sec = d.getElementById('calcPrint');
    if (!sec) { sec = d.createElement('section'); sec.id = 'calcPrint'; sec.className = 'k-print calc-print'; sec.setAttribute('aria-hidden', 'true'); d.body.appendChild(sec); }
    sec.innerHTML = '<header class="k-print__head"><img src="' + esc(root() + 'assets/tricom-logo-web.png') + '" alt="' + esc(t('calc.print.alt')) + '" width="610" height="300"><div><b>' + esc(t('calc.print.title', { name: nameOf(id) })) + '</b><span>' + esc(t('calc.print.sub', { date: date })) + '</span></div></header>' +
      '<article class="k-print__v"><p class="k-print__code">' + esc(nameOf(id)) + '</p><p class="calc-print__line">' + esc(plainLine(r)) + '</p>' +
      (r.kind === 'crep' ? '<div class="calc-print__svg">' + svgCrep(r) + '</div>' : '') +
      tbl(t('calc.print.inputs'), inp) + (r.multi ? '<div class="k-tw">' + brkTable(r, 'k-tbl calc-print__brk') + '</div>' : '') + tbl(t('calc.print.results'), res) +
      '<p class="k-note"><b>' + esc(t('calc.print.note')) + ':</b> ' + esc(r.note) + '</p>' +
      '<p class="k-note k-note--warn">' + esc(disclaimer()) + '</p>' +
      '<p class="k-print__url">' + esc(t('calc.print.url')) + esc(calcUrl(TC.serialize(id, s))) + '</p></article>' +
      '<p class="k-print__foot">' + esc(t('calc.print.foot')) + '</p>';
    d.body.classList.add('calc-printing');
    var done = function () { d.body.classList.remove('calc-printing'); sec.innerHTML = ''; w.removeEventListener('afterprint', done); };
    w.addEventListener('afterprint', done);
    var img = sec.querySelector('img'), go = function () { setTimeout(function () { w.print(); }, 40); };
    if (img && !img.complete) { img.onload = go; img.onerror = go; } else go();
  };

  /* ---- javni API i automatska montaža ------------------------------------ */
  function mount(el) { return el.__calc || new Mount(el); }
  function mountAll() { Array.prototype.forEach.call(d.querySelectorAll('[data-calc-mount]'), mount); }
  w.addEventListener('hashchange', function () {
    Array.prototype.forEach.call(d.querySelectorAll('[data-calc-mount][data-calc-hash]'), function (el) {
      var m = el.__calc; if (!m) return;
      if (m.last && m.last.ok && location.hash === '#' + TC.serialize(m.id, m.st())) return;
      if (!m.fromHash(location.hash)) return;
      var b = m.q('[data-tab="' + m.id + '"]');
      if (b && !/=/.test(location.hash)) el.scrollIntoView && el.scrollIntoView({ block: 'start' });
    });
  });
  w.TricomCalcUI = {
    mount: mount, mountAll: mountAll, fmt: fmt,
    itemLabel: itemLabel, itemCode: itemCode, itemText: itemText, itemUrl: itemUrl, itemNote: itemNote, listText: listText,
    textFor: function (id, s) { return textFor(id, s, compute(id, s), true); }
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mountAll); else mountAll();
})(window, document);
