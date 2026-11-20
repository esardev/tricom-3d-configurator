/* ==========================================================================
   TRICOM — calc.js
   Proračun za pet kalkulatora (TR 10/162, TR 20/185, TR 35/270, TR 40/230,
   imitacija crepa). Čiste funkcije, bez DOM-a: ulazni objekat → rezultat.
   Podaci (pokrivne širine, granice, TEMP konstante) dolaze iz
   TRICOM_CATALOG.calculators (js/catalog.js) ili iz drugog argumenta.
   Izlaže window.TricomCalc; u Node-u module.exports (v. _qa/calc-test.js).

   Ispravke u odnosu na Bendex.web:
   - širina krova: Bendex je množio broj tabli × UNETA širina krova; ovde
     coveredWidth = n × pokrivna širina profila;
   - filc samo uz „Profil za krov“: umesto greške strana se prebacuje na krov;
   - crep (ispravka klijenta 2026-11): POČETAK je kraj table kod oluka (strehe) —
     slobodan (ostatak posle celih crepova, ≥ 20 mm) ili zadat; KRAJ je suprotni
     kraj table i uvek je 30 mm (ne unosi se). Formule su iste kao ranije; u kodu
     `start` = kraj (30), `end` / `e` / `endMode` = početak kod oluka.
   Nijedan izlaz nije NaN ni Infinity: neispravan unos daje errors + null.
   ========================================================================== */
(function (root) {
  'use strict';

  var IDS = ['tr10', 'tr20', 'tr35', 'tr40', 'crep'];
  var TRAPEZ = ['tr10', 'tr20', 'tr35', 'tr40'];

  function cfgOf(cfg) {
    if (cfg) return cfg;
    var c = root && root.TRICOM_CATALOG && root.TRICOM_CATALOG.calculators;
    if (!c) throw new Error('TricomCalc: TRICOM_CATALOG.calculators is missing (load js/catalog.js first)');
    return c;
  }
  function fin(x) { return typeof x === 'number' && isFinite(x); }
  function r6(x) { return fin(x) ? Math.round(x * 1e6) / 1e6 : null; }
  function isInt(x) { return fin(x) && Math.floor(x) === x; }
  function num(x) { if (x === '' || x == null) return NaN; return typeof x === 'number' ? x : +x; }
  function err(k, v) { return { k: k, v: v || {} }; }

  /* ---- Trapez -------------------------------------------------------------
     input: { profile, mode: 'n'|'w', rows: [{ L, n }, ...] | L, n, W, side: 'krov'|'fasada', felt, colour, t }
       rows = više dužina iste stavke (isti profil, boja, filc, debljina): svaki red L (mm) × n (kom).
       Bez rows -> jedan red { L, n } (dosadašnji ulaz). Režim „znam širinu krova“ (w) važi samo uz
       jedan red: n se računa iz W. Dužni metri po redu = L / 1000 × n; stavka = zbir redova.
       Površina = L / 1000 × pokrivna širina (coverWidth) / 1000 × n — isto pravilo kao ranije;
       bez pokrivne širine površina je null (areaMissing), dužni metri ostaju. Zaokružuje se tek za prikaz. */
  function trapez(input, cfg) {
    var C = cfgOf(cfg), id = input.profile || input.id, P = C.profiles[id];
    if (!P) throw new Error('TricomCalc.trapez: unknown profile ' + id);
    var rows = (Array.isArray(input.rows) && input.rows.length ? input.rows : [{ L: input.L, n: input.n }])
      .map(function (x) { return { L: num(x && x.L), n: num(x && x.n) }; });
    var mode = input.mode === 'w' && rows.length === 1 ? 'w' : 'n';
    var W = num(input.W), t = num(input.t), maxRows = C.maxRows || 15;
    var cw = P.coverWidth, hasCw = fin(cw) && cw > 0;
    if (!fin(t) || t <= 0) t = C.defaultThickness;
    var felt = !!input.felt, side = input.side === 'fasada' ? 'fasada' : 'krov', sideForced = false;
    // Filc se nanosi sa donje strane — dostupan samo za krovni profil (Bendex/Miloš)
    if (felt && side === 'fasada') { side = 'krov'; sideForced = true; }

    // greške po redu: prvi red L / n (kao ranije), ostali L1, n1, L2, n2 ...
    var errors = {};
    rows.forEach(function (x, i) {
      var kL = 'L' + (i || ''), kn = 'n' + (i || '');
      if (!fin(x.L)) errors[kL] = err('calc.err.required');
      else if (!isInt(x.L)) errors[kL] = err('calc.err.int');
      else if (x.L < P.lengthMin || x.L > P.lengthMax) errors[kL] = err('calc.err.range', { min: P.lengthMin, max: P.lengthMax });
      if (mode !== 'n') return;
      if (!fin(x.n)) errors[kn] = err('calc.err.required');
      else if (!isInt(x.n)) errors[kn] = err('calc.err.int');
      else if (x.n < 1) errors[kn] = err('calc.err.min', { min: 1 });
    });
    if (rows.length > maxRows) errors.rows = err('calc.err.rowsMax', { max: maxRows });
    if (mode === 'w') {
      if (!hasCw) errors.W = err('calc.err.noWidth');
      else if (!fin(W)) errors.W = err('calc.err.required');
      else if (W < 1) errors.W = err('calc.err.min', { min: 1 });
    }
    var L = rows[0].L;

    var res = {
      kind: 'trapez', id: id, name: P.name, coverWidth: P.coverWidth, developedWidth: P.developedWidth,
      reinforced: !!P.reinforced, mode: mode, side: side, sideForced: sideForced, felt: felt,
      colour: input.colour || C.defaultColour, t: t, L: rows.length === 1 && fin(L) ? L : null,
      W: mode === 'w' && fin(W) ? W : null,
      errors: errors, ok: !Object.keys(errors).length,
      multi: rows.length > 1, rows: null, areaMissing: !hasCw, widthUsed: hasCw ? cw : null,
      n: null, coveredWidth: null, surplus: null, perSheetArea: null, totalArea: null,
      linearM: null, developedArea: null, weight: null, feltArea: null, price: null,
      priceEurPerM2: P.priceEurPerM2, showPrices: !!C.SHOW_PRICES
    };
    res.note = productionNote(id, res);
    if (!res.ok) return res;

    if (mode === 'w') rows[0].n = Math.max(1, Math.ceil(W / cw - 1e-9));     // ispravka Bendex greške: n × pokrivna širina
    // zbirovi iz nezaokruženih vrednosti; r6 samo uklanja grešku pokretnog zareza
    var sumN = 0, sumLm = 0, sumA = 0, sumD = 0;
    res.rows = rows.map(function (x) {
      var Lm = x.L / 1000, lm = Lm * x.n, a = hasCw ? lm * cw / 1000 : null;
      sumN += x.n; sumLm += lm; sumD += lm * P.developedWidth / 1000; if (hasCw) sumA += a;
      return { L: x.L, Lm: r6(Lm), n: x.n, linearM: r6(lm), area: hasCw ? r6(a) : null };
    });
    res.n = sumN;
    if (!res.multi && hasCw) {
      res.coveredWidth = res.n * cw;
      res.perSheetArea = r6(L / 1000 * cw / 1000);               // m², pokrivna površina (osnova cene u Bendexu)
    }
    if (mode === 'w') res.surplus = r6(res.coveredWidth - W);
    res.totalArea = hasCw ? r6(sumA) : null;
    res.linearM = r6(sumLm);
    res.developedArea = r6(sumD);
    res.weight = r6(res.developedArea * t * C.steelDensity);
    res.feltArea = felt ? res.totalArea : 0;
    res.price = hasCw && fin(P.priceEurPerM2) ? r6(res.totalArea * P.priceEurPerM2) : null;
    return res;
  }

  /* ---- Imitacija crepa ------------------------------------------------------
     input: { L, n, mode: 'n'|'w', W, endMode: 'free'|'fixed', e, felt, colour, t [, legacyStart] }
       endMode / e = POČETAK table kod oluka (slobodan ili zadat, ≥ endMin)
       kraj (suprotni kraj) = P.start, uvek 30 mm — input.start se ne čita.
       legacyStart = „p“ iz veze sačuvane pre ispravke (tada se kraj unosio):
       samo se prijavljuje (res.legacyStart), proračun uvek koristi P.start. */
  function crep(input, cfg) {
    var C = cfgOf(cfg), P = C.crep;
    var L = num(input.L), n = num(input.n), W = num(input.W), t = num(input.t);
    var start = P.start, e = num(input.e), legacy = num(input.legacyStart);
    if (!fin(t) || t <= 0) t = C.defaultThickness;
    var widthMode = input.mode === 'w' && fin(P.coverWidth) && P.coverWidth > 0;
    var fixed = input.endMode === 'fixed';
    var tile = P.tile, endMin = P.endMin, step = P.step;
    var errors = {};

    var lMin = start + tile + endMin;
    if (!fin(L)) errors.L = err('calc.err.required');
    else if (!isInt(L)) errors.L = err('calc.err.int');
    else if (L < lMin) errors.L = err('calc.err.crepShort', { min: lMin });
    else if (L > P.lengthMax) errors.L = err('calc.err.max', { max: P.lengthMax });
    if (widthMode) {
      if (!fin(W)) errors.W = err('calc.err.required');
      else if (W < 1) errors.W = err('calc.err.min', { min: 1 });
    } else {
      if (!fin(n)) errors.n = err('calc.err.required');
      else if (!isInt(n)) errors.n = err('calc.err.int');
      else if (n < 1) errors.n = err('calc.err.min', { min: 1 });
    }
    if (fixed) {
      if (!fin(e)) errors.e = err('calc.err.required');
      else if (!isInt(e)) errors.e = err('calc.err.int');
      else if (e < endMin) errors.e = err('calc.err.min', { min: endMin });
      else if (!errors.L && e > L - start - tile) errors.e = err('calc.err.endLong', { max: L - start - tile });
    }

    var res = {
      kind: 'crep', id: 'crep', name: P.name, coverWidth: fin(P.coverWidth) ? P.coverWidth : null,
      developedWidth: P.developedWidth, widthAvailable: fin(P.coverWidth) && P.coverWidth > 0,
      mode: widthMode ? 'w' : 'n', endMode: fixed ? 'fixed' : 'free', side: 'krov', sideForced: false,
      felt: !!input.felt, colour: input.colour || C.defaultColour, t: t,
      L: fin(L) ? L : null, start: start, e: fixed && fin(e) ? e : null,
      legacyStart: fin(legacy) && legacy !== start ? legacy : null,
      W: widthMode && fin(W) ? W : null, lMin: lMin, tileLen: tile, step: step, endMin: endMin,
      errors: errors, ok: !Object.keys(errors).length, warnings: [],
      tiles: null, pitch: null, end: null, deviation: null, materialLength: null,
      n: null, coveredWidth: null, surplus: null, totalMaterialM: null, developedArea: null,
      weight: null, feltArea: null, price: null, priceEurPerM2: P.priceEurPerM2,
      priceTemp: true, showPrices: !!C.SHOW_PRICES, suggest: null, standard: false
    };
    res.note = productionNote('crep', res);
    if (!res.ok) return res;

    var tiles = Math.floor((L - start - endMin) / tile + 1e-9);
    var pitch, end;
    if (!fixed) { end = L - start - tiles * tile; pitch = tile; }
    else {
      end = e; pitch = (L - start - e) / tiles;
      res.deviation = r6(pitch - tile);
      if (Math.abs(pitch - tile) > C.tileLengthTolerance) res.warnings.push(err('calc.warn.pitch', { d: Math.round((pitch - tile) * 100) / 100, tol: C.tileLengthTolerance }));
    }
    res.tiles = tiles; res.pitch = r6(pitch); res.end = r6(end);
    res.materialLength = r6(L + (tiles + 1) * step);   // = start + tiles × pitch + (tiles + 1) × step + end

    // predlog: najbliža dužina ispod i iznad sa korakom tačno 350 i krajem u [endMin, endMin + step]
    //  - slobodan kraj: predlog sa krajem endMin (primer iz zahteva: L 5000 → 4 950 / 5 300)
    //  - zadati kraj e u opsegu: L = početak + k × 350 + e
    //  - zadati kraj van opsega: kraj endMin; samo dužina ne bi dala korak 350, pa
    //    predlog nosi i kraj (suggest.e) i čip postavlja oba polja
    var eMax = endMin + step, sDown = null, sUp = null, sE = null;
    if (!fixed) {
      res.standard = end >= endMin && end <= eMax;
      sDown = start + tiles * tile + endMin;
      sUp = sDown + tile;
    } else {
      var ec = e >= endMin && e <= eMax ? e : endMin, q = (L - start - ec) / tile;
      res.standard = ec === e && Math.abs(pitch - tile) < 0.005;
      sDown = start + (Math.ceil(q - 1e-9) - 1) * tile + ec;
      sUp = start + (Math.floor(q + 1e-9) + 1) * tile + ec;
      if (ec !== e) sE = ec;
    }
    res.suggest = res.standard ? null : {
      down: sDown != null && sDown >= start + tile + endMin && sDown >= lMin ? sDown : null,
      up: sUp <= P.lengthMax ? sUp : null,
      e: sE
    };

    if (widthMode) {
      res.n = Math.max(1, Math.ceil(W / P.coverWidth - 1e-9));
      res.coveredWidth = res.n * P.coverWidth;
      res.surplus = r6(res.coveredWidth - W);
    } else res.n = n;
    res.totalMaterialM = r6(res.n * res.materialLength / 1000);
    res.developedArea = r6(res.n * res.materialLength / 1000 * P.developedWidth / 1000);
    res.weight = r6(res.developedArea * t * C.steelDensity);
    // filc: n × L × razvijena širina dok pokrivna širina crepa nije poznata
    var fw = res.widthAvailable ? P.coverWidth : P.developedWidth;
    res.feltArea = res.felt ? r6(res.n * L / 1000 * fw / 1000) : 0;
    // TEMP osnovica cene: pokrivna površina kad bude poznata, do tada razvijena površina materijala
    res.priceArea = res.widthAvailable ? r6(res.n * L / 1000 * P.coverWidth / 1000) : res.developedArea;
    res.price = r6(res.priceArea * P.priceEurPerM2);
    return res;
  }

  /* ---- Napomena za proizvodnju (interna: samo štampa i tekst upita) ----------
     Po rukom pisanim napomenama na nalozima (IMG-NOTES); jezik pogona je srpski. */
  function productionNote(id, r) {
    var out = [];
    if (id === 'tr40') out.push('OJAČAN — spustiti zadnji set valjaka');
    if (r.side === 'fasada') {
      if (id === 'tr10' && !r.felt) out.push('KONTRA LIM BEZ FILCA — uvod lima licem na dole');
      else out.push('lice dole');
    } else out.push('lice gore');
    if (r.felt) out.push('sa filcom');
    else if (!(id === 'tr10' && r.side === 'fasada')) out.push('bez filca');
    return out.join(' · ');
  }

  /* ---- Podrazumevano stanje i deljeni link ----------------------------------
     Gramatika heša:  #<id>[=<tok>,<tok>,…]
       L<int>  dužina table (mm)        n<int>  broj tabli
       w<int>  širina krova (mm) → režim „znam širinu krova“
       c<RAL>  boja                     f0|f1   filc
       s=krov|s=fasada  strana (trapez) t<dec>  debljina (mm, tačka)
       e<int>  zadati POČETAK kod oluka (crep) → „Zadati početak“ (isti deo table kao ranije „zadati kraj“)
       p<int>  samo u starim vezama (kraj koji se nekad unosio): čita se kao legacyStart, ne piše se
       r<L>x<n>  trapez: dodatni red (dužina mm × kom); prvi red su L i n — veza sa jednom dužinom
                 ostaje ista kao ranije. Uz više redova režim je uvek „znam broj tabli“ (w se ne piše).
     Primer: #tr20=L4000,n12,c7016,f1,s=krov · #tr20=L4000,n12,r2500x6,c7016,f0,s=krov · #crep=L5000,n8,e30,c8019,f0 */
  function defaults(id, cfg) {
    var C = cfgOf(cfg), D = C.defaults || {};
    if (id === 'crep') return { id: 'crep', L: C.crep.defaultLength || 5000, n: D.n || 10, mode: 'n', W: D.W || 10000, start: C.crep.start, endMode: 'free', e: C.crep.endMin, felt: false, colour: C.defaultColour, t: C.defaultThickness };
    return { id: id, profile: id, mode: 'n', rows: [{ L: D.L || 4000, n: D.n || 10 }], W: D.W || 10000, side: 'krov', felt: false, colour: C.defaultColour, t: C.defaultThickness };
  }
  // redovi trapez stanja; stanje bez rows (spoljni pozivi sa L, n) = jedan red
  function rowsOf(s) { return Array.isArray(s.rows) && s.rows.length ? s.rows : [{ L: s.L, n: s.n }]; }
  function serialize(id, s) {
    var rs = id === 'crep' ? [{ L: s.L, n: s.n }] : rowsOf(s), multi = rs.length > 1;
    var tok = ['L' + rs[0].L];
    if (s.mode === 'w' && !multi) tok.push('w' + s.W); else tok.push('n' + rs[0].n);
    for (var i = 1; i < rs.length; i++) tok.push('r' + rs[i].L + 'x' + rs[i].n);
    if (id === 'crep' && s.endMode === 'fixed') tok.push('e' + s.e);   // kraj je uvek 30 mm — bez „p“
    tok.push('c' + s.colour, 'f' + (s.felt ? 1 : 0));
    if (id !== 'crep') tok.push('s=' + (s.side === 'fasada' ? 'fasada' : 'krov'));
    tok.push('t' + s.t);
    return id + '=' + tok.map(function (x) { return String(x).replace(/[^\w.=-]/g, ''); }).join(',');
  }
  function parse(hash, cfg) {
    var h = String(hash || '').replace(/^#/, ''), m = h.match(/^(tr10|tr20|tr35|tr40|crep)(?:=(.*))?$/);
    if (!m) return null;
    var id = m[1], s = defaults(id, cfg), body = m[2] || '';
    var hasW = false, extra = [];
    if (id !== 'crep') { s.L = s.rows[0].L; s.n = s.rows[0].n; }   // prvi red: L / n tokeni (kao ranije)
    body.split(',').forEach(function (tk) {
      try { tk = decodeURIComponent(tk || '').trim(); } catch (e) { return; }   // pokvaren %-zapis: token se preskače
      if (!tk) return;
      var k = tk.charAt(0), v = tk.slice(1), x = +v;
      if (k === 's') { v = v.replace(/^=/, ''); s.side = v === 'fasada' ? 'fasada' : 'krov'; return; }
      if (k === 'c') { if (/^\d{4}$/.test(v)) s.colour = v; return; }
      if (k === 'r') { var rm = v.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/); if (rm && id !== 'crep') extra.push({ L: +rm[1], n: +rm[2] }); return; }
      if (!fin(x) || v === '') return;
      if (k === 'L') s.L = x;
      else if (k === 'n') s.n = x;
      else if (k === 'w') { s.W = x; hasW = true; }
      else if (k === 'f') s.felt = x === 1;
      else if (k === 't') s.t = x;
      else if (k === 'p' && id === 'crep') s.legacyStart = x;          // stara veza: prijavljuje se, ne koristi
      else if (k === 'e' && id === 'crep') { s.e = x; s.endMode = 'fixed'; }
    });
    s.mode = hasW && !extra.length ? 'w' : 'n';
    if (id !== 'crep') { s.rows = [{ L: s.L, n: s.n }].concat(extra); delete s.L; delete s.n; }
    if (s.felt && s.side === 'fasada') s.side = 'krov';
    return { id: id, state: s };
  }
  function compute(id, s, cfg) {
    if (id === 'crep') return crep(s, cfg);
    var o = {}; for (var k in s) o[k] = s[k]; o.profile = id;
    return trapez(o, cfg);
  }

  var api = {
    IDS: IDS, TRAPEZ: TRAPEZ,
    trapez: trapez, crep: crep, compute: compute,
    productionNote: productionNote, defaults: defaults, serialize: serialize, parse: parse, rowsOf: rowsOf,
    isTrapez: function (id) { return TRAPEZ.indexOf(id) >= 0; }
  };
  if (root) root.TricomCalc = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
