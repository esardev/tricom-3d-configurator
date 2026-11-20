/* ==========================================================================
   TRICOM konfigurator — k-data.js
   Adapter: sve što se prodaje (profili, materijali, RAL, oluci, vertikale,
   limarija, pravila proračuna) dolazi iz js/catalog.js i ovde se samo
   prevodi u oblik koji koriste ostali moduli (metri, kratki ključevi).
   Lokalno ostaju samo podaci scene: tipovi objekata sa rasponima mera,
   fasade, boje stolarije, okruženja, datumi za sunce, koraci i podrazumevano
   stanje. Bez zavisnosti osim window.TRICOM_CATALOG.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var C = window.TRICOM_CATALOG;
  var D = TK.data = {};

  /* ---- jezik (js/i18n/sr.js → L10N): tekst iz ključeva k.*, brojevi po jeziku,
     nazivi iz kataloga sa poljem *_en na engleskim stranama (ako postoji).    */
  var L = window.L10N;
  var EN = TK.en = !!(L && L.lang() === 'en');
  var t = TK.t = function (k, v) { return L ? L.t(k, v) : k; };
  // broj sa dec decimala: sr 10,6 (bez grupisanja, kao ranije), en 10.6 / 1,234.5
  TK.n = function (x, dec) { dec = dec === undefined ? 2 : dec; return EN ? L.num(+x, dec) : Number(x).toFixed(dec).replace('.', ','); };
  // polje iz kataloga na jeziku strane: o.name_en na engleskim stranama, inače o.name
  TK.cf = function (o, f) { if (!o) return o; var v = EN ? o[f + '_en'] : null; return v != null && v !== '' ? v : o[f]; };
  TK.page = function (f) { return L ? L.page(f) : f; };
  TK.root = function () { return L ? L.root : ''; };
  var cf = TK.cf;

  D.catalog = C;
  D.rules = C.rules;
  D.disclaimer = cf(C, 'disclaimer');

  D.find = function (list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  /* ---- 01 Objekti. dims: [podrazumevano, min, max] — m, nagib u stepenima.
     L dužina (pravac slemena), W širina, p nagib, oe prepust strehe,
     og prepust na zabatu, hv visina strehe (hala). Podrazumevane mere su mere
     iz ranijeg modela, pa stari linkovi otvaraju isti objekat.              */
  // tekst: k.house.<id>.name / .sub; zone: k.zone.all + k.zone.<id>.1 / .2
  var ZALL = t('k.zone.all');
  D.houses = [
    { id: 'dvovodni', name: t('k.house.dvovodni.name'), sub: t('k.house.dvovodni.sub'),
      zones: [ZALL, t('k.zone.dvovodni.1'), t('k.zone.prizemlje')],
      dims: { L: [10.6, 9, 16], W: [8, 6.5, 12], p: [38, 15, 50], oe: [0.5, 0.2, 1.0], og: [0.3, 0, 0.8] } },
    { id: 'cetvorovodni', name: t('k.house.cetvorovodni.name'), sub: t('k.house.cetvorovodni.sub'),
      zones: [ZALL, t('k.zone.sprat'), t('k.zone.prizemlje')],
      dims: { L: [10.4, 8, 16], W: [9, 6, 12], p: [38, 15, 50], oe: [0.5, 0.2, 1.0] } },
    { id: 'lkrov', name: t('k.house.lkrov.name'), sub: t('k.house.lkrov.sub'),
      zones: [ZALL, t('k.zone.lkrov.1'), t('k.zone.prizemlje')],
      dims: { L: [13.6, 11.6, 17], W: [10.2, 8.7, 12.5], p: [38, 30, 45], oe: [0.5, 0.2, 1.0], og: [0.3, 0, 0.8] } },
    { id: 'bungalov', name: t('k.house.bungalov.name'), sub: t('k.house.bungalov.sub'),
      zones: [ZALL, t('k.zone.bungalov.1'), t('k.zone.bungalov.2')],
      dims: { L: [13, 9, 18], W: [9, 7, 12], p: [25, 15, 35], oe: [0.6, 0.2, 1.0] } },
    { id: 'jednovodni', name: t('k.house.jednovodni.name'), sub: t('k.house.jednovodni.sub'),
      zones: [ZALL, t('k.zone.sprat'), t('k.zone.prizemlje')],
      dims: { L: [10, 7, 16], W: [7.6, 5.5, 10], p: [12, 5, 25], oe: [0.55, 0.2, 1.0], og: [0.3, 0, 0.8] } },
    { id: 'ravan', name: t('k.house.ravan.name'), sub: t('k.house.ravan.sub'),
      zones: [ZALL, t('k.zone.sprat'), t('k.zone.prizemlje')],
      dims: { L: [11, 8, 16], W: [8.6, 6, 12], p: [3, 3, 3] } },
    { id: 'hala', name: t('k.house.hala.name'), sub: t('k.house.hala.sub'),
      zones: [ZALL],
      dims: { L: [36, 20, 60], W: [18, 12, 30], p: [8, 5, 15], hv: [6, 4, 9], oe: [0.4, 0.2, 1.0], og: [0.3, 0, 0.8] } }
  ];

  /* ---- Profili (metri za geometriju) -------------------------------------- */
  D.profiles = C.profiles.map(function (p) {
    var g = p.geometry, mm = function (v) { return (v || 0) / 1000; };
    var o = {
      id: p.id, name: cf(p, 'name'), note: cf(p, 'note'), use: p.use, minSlope: p.minSlopeDeg, thicknesses: p.thicknesses,
      h: mm(p.ribHeight), pitch: mm(p.pitch), crown: mm(g.crown), web: mm(g.web), ribs: g.ribs, stiff: g.stiff || 0,
      crownGroove: !!g.crownGroove, tile: !!g.tile, module: p.module ? mm(p.module) : 0, step: g.step ? mm(g.step) : 0,
      useful: mm(p.coverWidth), maxLen: p.maxSheetLength, overlapLong: mm(p.overlapLong), overlapSide: p.overlapSide
    };
    o.total = +(o.useful + (o.tile ? 0.08 : o.crown + 2 * o.web)).toFixed(4);     // korisna širina + preklopno rebro
    o.cat = p;
    return o;
  });

  /* ---- Materijali, debljine, PBR ------------------------------------------ */
  D.finishes = C.materials.map(function (m) { return { id: m.id, name: cf(m, 'name'), short: cf(m, 'short'), finish: cf(m, 'finish'), colorSet: m.colorSet, cat: m }; });
  D.thick = {};
  C.materials.forEach(function (m) { D.thick[m.id] = TK.n(m.defaultThickness, 2); });
  // isti PBR parametri za konfigurator i za 3D na naslovnoj (variant 'hero')
  D.pbr = function (id, variant) {
    var m = D.find(C.materials, id), p = m ? m.pbr : {}, out = {}, k;
    var src = variant && p[variant] ? p[variant] : p;
    for (k in src) if (typeof src[k] !== 'object') out[k] = src[k];
    return out;
  };
  // debljine koje se nude: profil ∪ podrazumevana debljina materijala (mm)
  D.thicknesses = function (profId, matId) {
    var p = D.find(D.profiles, profId), m = D.find(C.materials, matId), list = (p ? p.thicknesses : []).slice();
    if (m && list.indexOf(m.defaultThickness) < 0) list.push(m.defaultThickness);
    return list.sort(function (a, b) { return a - b; });
  };

  /* ---- RAL ------------------------------------------------------------------ */
  D.ral = [];
  D.ralByCode = {};
  C.colors.forEach(function (c) {
    var r = { c: c.ral, hex: c.hex, n: cf(c, 'name'), finish: c.finish, metallic: c.finish === 'metalik', cat: c }, g = null;
    D.ral.forEach(function (x) { if (x.famId === c.family) g = x; });
    if (!g) D.ral.push(g = { fam: cf(c, 'family'), famId: c.family, items: [] });
    if (c.availableFor.indexOf('plast') >= 0) g.items.push(r);
    D.ralByCode[c.ral] = r;
  });
  D.lamperijaRal = C.colors.filter(function (c) { return c.availableFor.indexOf('lamperija') >= 0; }).map(function (c) { return c.ral; });
  // profiles with a restricted RAL choice for new configurations (catalog.js → profileColours, e.g. tr10: 9006 / 9002 / 7016)
  D.profileRal = C.profileColours || {};

  /* ---- Oluci i vertikale ----------------------------------------------------- */
  D.gutters = C.gutters.map(function (g) { return { id: g.id, code: g.code, name: cf(g, 'name'), shape: g.shape === 'poluokrugli' ? 'round' : 'square', size: g.size / 1000, hook: g.hook, cat: g }; });
  D.pipes = C.downpipes.map(function (g) { return { id: g.id, code: g.code, name: cf(g, 'name'), shape: g.shape === 'okrugla' ? 'round' : 'square', size: g.size / 1000, clamp: g.clamp, cat: g }; });
  D.capacity = {};
  C.gutters.concat(C.downpipes).forEach(function (g) { D.capacity[g.id] = g.capacityArea; });

  /* ---- Limarija ---------------------------------------------------------------- */
  var ONLY = { uvala: ['lkrov'], parapet: ['ravan', 'hala'] };
  D.details = C.accessories.map(function (a) { return { id: a.id, name: cf(a, 'name'), txt: cf(a, 'text'), unit: a.unit, only: ONLY[a.id], cat: a }; });
  D.stock = { oluk: 0, cev: 0 };                      // oluci i vertikale: dužina po meri, bez nastavaka
  C.accessories.forEach(function (a) { if (a.pieceLength) D.stock[a.id] = a.pieceLength; });
  D.ridgeTypes = C.ridgeTypes.map(function (r) { return { id: r.id, name: cf(r, 'name'), cat: r }; });

  /* ---- 05 Izgled: fasade, stolarija, okruženje (podaci scene, nisu proizvodi) */
  // nazivi: k.facade.<id>, k.fcol.<facade>.<boja>, k.frame.<id>, k.env.<id>.name/.sub, k.date.<id>.name/.sub
  D.facades = [
    { id: 'malter',     name: t('k.facade.malter'), colors: [
      { id: 'bela', n: t('k.fcol.malter.bela'), hex: '#F2F0EA' }, { id: 'bez', n: t('k.fcol.malter.bez'), hex: '#E2D6BF' }, { id: 'siva', n: t('k.fcol.malter.siva'), hex: '#B9BDBF' } ] },
    { id: 'lamperijav', name: t('k.facade.lamperijav'), ral: true },
    { id: 'lamperijah', name: t('k.facade.lamperijah'), ral: true },
    { id: 'klinker',    name: t('k.facade.klinker'), colors: [
      { id: 'crvena', n: t('k.fcol.klinker.crvena'), hex: '#A4553B' }, { id: 'braon', n: t('k.fcol.klinker.braon'), hex: '#6E4A3A' }, { id: 'svetla', n: t('k.fcol.klinker.svetla'), hex: '#C9B08C' } ] }
  ];
  D.frames = [
    { id: 'bela',       hex: '#F3F4F2' },
    { id: 'srebrna',    hex: '#C4C8C8', metal: 0.8 },
    { id: 'svetlosiva', hex: '#9A9F98' },
    { id: 'siva',       hex: '#8A9499' },
    { id: 'db703',      hex: '#454B54', metal: 0.5 },
    { id: 'antracit',   hex: '#333B40' },
    { id: 'crna',       hex: '#101113' },
    { id: 'bez',        hex: '#D9D4C4' },
    { id: 'bronza',     hex: '#A59B86', metal: 0.6 },
    { id: 'braon',      hex: '#4E3524' },
    { id: 'hrast',      hex: '#B5753A', wood: 1 },
    { id: 'orah',       hex: '#6B3F26', wood: 2 }
  ];
  D.frames.forEach(function (f) { f.n = t('k.frame.' + f.id); });
  D.envs = ['studio', 'predgradje', 'ravnica', 'brdovito'].map(function (id) { return { id: id, name: t('k.env.' + id + '.name'), sub: t('k.env.' + id + '.sub') }; });
  // sunce: deklinacija i lokalno vreme pravog podneva (Beograd, 44,8° N)
  D.dates = [
    { id: 'mar', decl: 0,      noon: 12.5 },
    { id: 'jun', decl: 23.44,  noon: 12.67 },
    { id: 'dec', decl: -23.44, noon: 11.6 }
  ];
  D.dates.forEach(function (d) { d.name = t('k.date.' + d.id + '.name'); d.sub = t('k.date.' + d.id + '.sub'); });

  /* ---- Koraci (k.step.<n>.label / .title / .short) ------------------------------ */
  D.steps = [
    { n: 1, id: 'objekat' },
    { n: 2, id: 'krov' },
    { n: 3, id: 'oluci' },
    { n: 4, id: 'limarija', short: 1 },
    { n: 5, id: 'izgled', secondary: true },
    { n: 6, id: 'spec', short: 1 }
  ];
  D.steps.forEach(function (s) { s.label = t('k.step.' + s.n + '.label'); s.title = t('k.step.' + s.n + '.title'); if (s.short) s.short = t('k.step.' + s.n + '.short'); });

  /* ---- Podrazumevano stanje. Mere su null = mere izabranog tipa objekta. ---- */
  D.defaults = {
    kuca: 'dvovodni', duz: null, sir: null, nagib: null, prep: null, zab: null, hv: null,
    hk: 2, hpar: 0, hzid: 1, hzp: 'tr20', hzb: '9002', badza: 1,
    krov: 'tr35', mat: 'cink', boja: '7016', patina: 0, deb: 0, sleme: 'ugaono',
    oluk: 'polukrug125', cev: 'okrugla100', uskladi: 1, omat: 'cink', oboja: '7016', opatina: 0, vert: 'auto', sneg: 'auto',
    fasada: 'malter.bela', zona1: 'lamperijav.7016', zona2: '',
    prozori: 'antracit', okolina: 'predgradje', sat: 15, datum: 'mar', starenje: 0,
    detalji: ['sleme', 'vetar', 'okapnica', 'snego', 'opsivka', 'iksna', 'kapa', 'uvala', 'parapet', 'solbank']
  };
  // podrazumevane vrednosti za hale (box oluk, četvrtaste vertikale, TR 40)
  D.halaDefaults = { krov: 'tr40', oluk: 'cetvrt150', cev: 'cetvrt100', mat: 'plast', boja: '7016', fasada: 'malter.siva', zona1: '', zona2: '' };
})();
