/* ==========================================================================
   TRICOM konfigurator — k-spec.js
   Specifikacija: od izgrađenog modela (k-house.js meri ravni, strehe, sleme,
   uvale…) i pravila iz js/catalog.js pravi tri tabele — krovne ravni,
   odvodnjavanje, limarija i snegobrani (+ zidni lim hale) — blok
   pretpostavki, HTML za panel i PDF, i sažet tekst za upit (≤ 2000 znakova,
   koliko prima polje poruke na kontakt strani). Radi i bez WebGL-a: model se
   gradi kao geometrija, samo se ne iscrtava.
   ========================================================================== */
(function () {
  'use strict';
  var TK = window.TK = window.TK || {};
  var SP = TK.spec = {};
  var D = TK.data;
  var AZ0 = -75;                          // scene azimuth of true south, degrees (same as k-env.js)

  var t = TK.t;                           // text keys k.sp.* / k.as.* / k.tx.* (js/i18n)
  function fmt(n, dec) { return TK.n(n, dec === undefined ? 2 : dec); }
  function m(n) { return fmt(n, 2) + ' m'; }
  function m2(n) { return fmt(n, 1) + ' m²'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  SP.fmt = fmt;

  // compass side of a plane from its outward horizontal normal (codes; printed through k.side.*)
  var SIDES = ['J', 'JZ', 'Z', 'SZ', 'S', 'SI', 'I', 'JI'], SIDE_N = { J: 'jug', JZ: 'jugozapad', Z: 'zapad', SZ: 'severozapad', S: 'sever', SI: 'severoistok', I: 'istok', JI: 'jugoistok' };
  function sideTxt(k) { return t('k.side.' + k); }
  function orient(out) {
    var a = Math.atan2(-out[0], out[1]) * 180 / Math.PI - AZ0;
    a = ((a % 360) + 540) % 360 - 180;                       // (-180, 180], 0 = south, west positive
    var k = Math.round(((a + 360) % 360) / 45) % 8;
    return SIDES[k];
  }
  SP.orient = orient;

  function roundLen(len, prof) {
    var R = D.rules;
    if (prof.tile) { var e = R.tileEnd, mo = prof.module; return +(e + Math.max(1, Math.ceil((len - e) / mo - 1e-6)) * mo).toFixed(3); }
    return +(Math.ceil(len / R.sheetRound - 1e-6) * R.sheetRound).toFixed(2);
  }
  // one sheet column → ordered pieces: rounded up; split with the long overlap when longer than maxSheetLength
  function pieces(len, prof) {
    var max = prof.maxLen, ov = prof.overlapLong;
    if (len <= max + 1e-6) return [roundLen(len, prof)];
    var n = Math.ceil((len - ov) / (max - ov) - 1e-6), p = roundLen((len + (n - 1) * ov) / n, prof), out = [];
    for (var i = 0; i < n; i++) out.push(p);
    return out;
  }
  function groups(list) {
    var g = {};
    list.forEach(function (x) { var k = x.toFixed(2); g[k] = (g[k] || 0) + 1; });
    return Object.keys(g).sort(function (a, b) { return b - a; }).map(function (k) { return { len: +k, n: g[k] }; });
  }
  function range(list) {
    var lo = Math.min.apply(null, list), hi = Math.max.apply(null, list);
    return Math.abs(hi - lo) < 0.005 ? fmt(hi) + ' m' : fmt(lo) + '–' + fmt(hi) + ' m';
  }
  function trimPieces(len, id) {
    var p = D.stock[id];
    return p ? Math.ceil(len / (p - D.rules.trimOverlap) - 1e-6) : 0;
  }

  /* ---- the whole specification of one configuration ---------------------------------- */
  SP.compute = function (s, house) {
    var R = D.rules, q = house.qty, prof = house.profile, dim = house.dim, M = TK.mat, cover = prof.useful, waste = 1 + R.wastePct / 100;
    var hd = D.find(D.houses, s.kuca), gut = D.find(D.gutters, s.oluk), pipe = D.find(D.pipes, s.cev), A = TK.app;
    var on = function (id) { return s.detalji.indexOf(id) >= 0 && TK.house.applies(id, s.kuca, s); };
    var thick = +s.deb > 0 ? +s.deb : D.find(D.catalog.materials, s.mat).defaultThickness;

    /* -- summary -- */
    var dimTxt = t('k.sp.dim', { l: fmt(dim.L, 1), w: fmt(dim.W, 1), p: Math.round(dim.p) });
    if (s.kuca === 'hala') dimTxt += t('k.sp.dimHall', { h: fmt(dim.hv, 1) }) + t(+s.hk === 1 ? 'k.sp.hall1' : 'k.sp.hall2') + (+s.hpar ? t('k.sp.parapet') : '');
    if (s.kuca !== 'ravan' && !(s.kuca === 'hala' && +s.hpar)) dimTxt += t('k.sp.overhang', { v: fmt(dim.oe) }) + (hd.dims.og ? t('k.sp.overhangG', { v: fmt(dim.og) }) : '');
    var summary = [
      [t('k.sp.sum.object'), hd.name + (s.kuca === 'dvovodni' && TK.house.dormer(s).on ? t('k.sp.withDormer') : '')],
      [t('k.sp.sum.dims'), dimTxt],
      [t('k.sp.sum.roof'), prof.name + ', ' + M.finishLabel(M.roofSpec(s)) + ', ' + fmt(thick) + ' mm'],
      [t('k.sp.sum.gutters'), t('k.sp.gutLine', { g: gut.name, p: pipe.name, f: s.uskladi ? t('k.sp.asRoof') : M.finishLabel(M.gutterSpec(s)) })]
    ];
    if (s.kuca === 'hala' && +s.hzid) summary.push([t('k.sp.sum.wall'), t('k.sp.wallLine', { p: (D.find(D.profiles, s.hzp) || {}).name, c: s.hzb, n: (D.ralByCode[s.hzb] || {}).n })]);
    summary.push([t('k.sp.sum.code'), A && A.code ? A.code(s) : '']);

    /* -- roof planes -- */
    var tot = { n: 0, area: 0, order: 0, cols: 0 };
    var planes = q.planes.map(function (pq) {
      var pcs = [];
      pq.sheets.forEach(function (len) { pcs = pcs.concat(pieces(len, prof)); });
      var run = pcs.reduce(function (a, x) { return a + x; }, 0), order = run * cover * waste;
      var split = pq.sheets.some(function (len) { return len > prof.maxLen + 1e-6; });
      tot.n += pcs.length; tot.area += pq.area; tot.order += order; tot.cols += pq.sheets.length;
      return { name: pq.name, side: sideTxt(orient(pq.out)), deg: pq.deg, rafter: pq.S, lens: range(pcs), groups: groups(pcs), n: pcs.length, cols: pq.sheets.length, split: split,
        area: pq.area, order: order, snowRows: pq.snowRows, snowLen: pq.snowLen.reduce(function (a, x) { return a + x; }, 0) };
    });

    /* -- wall sheeting of a hall -- */
    var walls = (q.walls || []).map(function (w) {
      var wp = D.find(D.profiles, w.profile), pcs = [];
      w.sheets.forEach(function (len) { pcs = pcs.concat(pieces(len, wp)); });
      var run = pcs.reduce(function (a, x) { return a + x; }, 0);
      return { name: w.name, profile: wp.name, n: pcs.length, lens: range(pcs), groups: groups(pcs), area: w.area, order: run * wp.useful * waste };
    });

    /* -- drainage -- */
    var dt = { len: 0, hooks: 0, caps: 0, corners: 0, pipes: 0, pipeLen: 0, elbows: 0, outlets: 0, clamps: 0 };
    var drains = q.eaveList.map(function (e) {
      var clamps = e.pipes.reduce(function (a, l) { return a + Math.max(2, Math.ceil(l / R.clampSpacing - 1e-6)); }, 0), pl = e.pipes.reduce(function (a, l) { return a + l; }, 0);
      dt.len += e.len; dt.hooks += e.hooks; dt.caps += e.caps; dt.corners += e.corners; dt.pipes += e.pipes.length; dt.pipeLen += pl;
      dt.elbows += e.pipes.length * R.elbowsPerPipe; dt.outlets += e.pipes.length * R.outletElbowsPerPipe; dt.clamps += clamps;
      return { name: e.name, side: sideTxt(orient(e.out)), len: e.len, hooks: e.hooks, caps: e.caps, corners: e.corners, pipes: e.pipes, pipeLen: pl,
        elbows: e.pipes.length * R.elbowsPerPipe, outlets: e.pipes.length * R.outletElbowsPerPipe, clamps: clamps };
    });
    dt.corners = Math.round(dt.corners);

    /* -- flashing and snow guards -- */
    var fl = [];
    function trim(id, label, len) { if (len > 0.01 && on(id)) fl.push({ id: id, label: label, qty: m(len), pcs: D.stock[id] ? trimPieces(len, id) + ' × ' + fmt(D.stock[id], 1) + ' m' : t('k.sp.toSize') }); }
    trim('sleme', (D.find(D.ridgeTypes, s.sleme) || D.ridgeTypes[0]).name, q.ridge);
    if (q.hip > 0.01 && on('sleme')) fl.push({ id: 'greben', label: t('k.fl.greben'), qty: m(q.hip), pcs: trimPieces(q.hip, 'sleme') + ' × ' + fmt(D.stock.sleme, 1) + ' m' });
    trim('vetar', t('k.fl.vetar'), q.verge);
    trim('okapnica', t('k.fl.okapnica'), q.eave);
    trim('uvala', t('k.fl.uvala'), q.valley);
    trim('parapet', t('k.fl.parapet'), q.coping);
    var sets = q.chimneys + t(q.chimneys === 1 ? 'k.unit.set1' : 'k.unit.set2');
    if (q.chimneys && on('opsivka')) fl.push({ id: 'opsivka', label: t('k.fl.opsivka'), qty: sets, pcs: t('k.sp.toChimney') });
    if (q.chimneys && on('iksna')) fl.push({ id: 'iksna', label: t('k.fl.iksna'), qty: sets, pcs: t('k.sp.toChimney') });
    if (q.chimneys && on('kapa')) fl.push({ id: 'kapa', label: t('k.fl.kapa'), qty: q.chimneys + t(q.chimneys === 1 ? 'k.unit.pc1' : 'k.unit.pcs'), pcs: t('k.sp.toChimney') });
    if (q.sills > 0.01 && on('solbank')) fl.push({ id: 'solbank', label: t('k.fl.solbank'), qty: m(q.sills), pcs: t('k.sp.toWindow') });
    var snow = null;
    if (on('snego') && q.snowRows) {
      snow = { rows: q.snowRows, len: q.snow, tube: q.snow * R.snowTubes, brackets: q.snowBrackets };
      fl.push({ id: 'snego', label: t('k.fl.snego') + q.snowRows + t(q.snowRows === 1 ? 'k.sp.rows1' : q.snowRows < 5 ? 'k.sp.rows2' : 'k.sp.rows5'), qty: m(q.snow), pcs: t('k.sp.snowPcs', { t: R.snowTubes, b: q.snowBrackets }) });
    }
    var trims = (on('sleme') ? q.ridge + q.hip : 0) + (on('vetar') ? q.verge : 0) + (on('okapnica') ? q.eave : 0) + (on('uvala') ? q.valley : 0) + (on('parapet') ? q.coping : 0);
    var screws = Math.ceil((q.screws + trims * R.screwsPerTrimM) / 50) * 50;
    fl.push({ id: 'vijci', label: t('k.fl.vijci'), qty: '≈ ' + (TK.en ? fmt(screws, 0) : screws.toLocaleString('sr-Latn-RS')) + t('k.unit.pcs'), pcs: Math.ceil(screws / R.screwPack) + ' × ' + R.screwPack });

    /* -- assumptions: every rule the numbers rest on -- */
    var as = [
      [t('k.as.cover', { p: prof.name }), fmt(cover * 1000, 1) + ' mm'],
      [t('k.as.len'), prof.tile ? t('k.as.lenTile', { m: fmt(prof.module * 1000, 0), e: fmt(R.tileEnd * 1000, 0) }) : t('k.as.lenRound', { v: fmt(R.sheetRound * 100, 0) })],
      [t('k.as.max'), t('k.as.maxV', { l: fmt(prof.maxLen, 1), o: fmt(prof.overlapLong * 1000, 0) })],
      [t('k.as.waste'), t('k.as.pct', { v: R.wastePct })],
      [t('k.as.hooks'), t('k.as.hooksV', { s: fmt(R.hookSpacing), e: fmt(R.hookEndMargin) })],
      [t('k.as.pipes'), s.vert === 'auto' ? t('k.as.pipesAuto', { v: fmt(R.downpipeEvery, 0) }) : t('k.as.pipesMan', { v: s.vert })],
      [t('k.as.pipeLen'), t('k.as.pipeLenV', { v: fmt(R.downpipeExtra) })],
      [t('k.as.elbows'), t('k.as.elbowsV', { a: R.elbowsPerPipe, b: R.outletElbowsPerPipe })],
      [t('k.as.clamps'), t('k.as.clampsV', { v: fmt(R.clampSpacing, 1) })],
      [t('k.as.fall'), t('k.as.fallV', { v: R.gutterFall })],
      [t('k.as.trim'), t('k.as.trimV', { a: fmt(D.stock.sleme, 1), b: fmt(D.stock.uvala, 1), c: fmt(R.trimOverlap) })],
      [t('k.as.snow'), s.sneg === 'auto' || s.sneg === undefined ? t('k.as.snowAuto', { d: R.snowMinDeg, rows: R.snowRowEvery.map(function (b) { return fmt(b.every, 1) + ' m' + (b.maxDeg < 90 ? t('k.as.snowUpTo', { d: b.maxDeg }) : ''); }).join(' / ') }) : t(+s.sneg === 1 ? 'k.as.snowMan1' : 'k.as.snowMan', { v: s.sneg })],
      [t('k.as.snowRow'), t('k.as.snowRowV', { a: fmt(R.snowFirstRow), b: fmt(R.snowBracketSpacing, 1), c: R.snowTubes })],
      [t('k.as.screws'), t('k.as.screwsV', { a: R.screwsPerTrimM, b: R.screwPack })]
    ];
    if (s.kuca === 'cetvorovodni' || s.kuca === 'bungalov') as.push([t('k.as.side'), t('k.as.sideV')]);
    var warn = [];
    if (dim.p < prof.minSlope) warn.push(t('k.sp.warnSlope', { d: Math.round(dim.p), p: prof.name, m: prof.minSlope }));

    return {
      code: summary[summary.length - 1][1], summary: summary, planes: planes, tot: tot, walls: walls, drains: drains, dt: dt, flash: fl, snow: snow,
      assumptions: as, warn: warn, disclaimer: D.disclaimer, gutter: gut, pipe: pipe, profile: prof
    };
  };

  /* ---- HTML (panel and the print sheet share it) --------------------------------------------- */
  function table(cls, cap, head, rows, foot) {
    var h = '<div class="k-tw"><table class="k-tbl ' + cls + '"><caption>' + cap + '</caption><thead><tr>' + head.map(function (c, i) { return '<th scope="col"' + (i ? ' class="num"' : '') + '>' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
    h += rows.map(function (r) { if (r.span) return '<tr class="k-sub"><td colspan="' + head.length + '">' + r.span + '</td></tr>'; return '<tr' + (r.cls ? ' class="' + r.cls + '"' : '') + '>' + r.c.map(function (c, i) { return i ? '<td class="num">' + c + '</td>' : '<th scope="row">' + c + '</th>'; }).join('') + '</tr>'; }).join('');
    h += '</tbody>' + (foot ? '<tfoot><tr>' + foot.map(function (c, i) { return i ? '<td class="num">' + c + '</td>' : '<th scope="row">' + c + '</th>'; }).join('') + '</tr></tfoot>' : '') + '</table></div>';
    return h;
  }
  function grpTxt(g) { return g.map(function (x) { return x.n + ' × ' + fmt(x.len); }).join(' · '); }
  SP.html = function (sp, o) {
    o = o || {};
    var h = '';
    if (o.only !== 'tables' && o.summary) h += '<dl class="k-sum">' + sp.summary.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
    if (o.only !== 'tables') sp.warn.forEach(function (w) { h += '<p class="k-note k-note--bad">' + esc(w) + '</p>'; });
    if (o.only === 'summary') return h;
    var rows = [];
    sp.planes.forEach(function (p) {
      rows.push({ c: [esc(p.name) + ' <span class="k-side">' + p.side + '</span>', Math.round(p.deg) + '°', fmt(p.rafter), p.lens, p.n + (p.split ? '*' : ''), fmt(p.area, 1), fmt(p.order, 1)] });
      if (p.groups.length > 1) rows.push({ span: t('k.sp.sheetsRow') + grpTxt(p.groups) });
    });
    var TOT = t('k.sp.total');
    h += table('k-tbl--roof', t('k.sp.cap.roof'), [t('k.sp.th.plane'), t('k.sp.th.pitch'), t('k.sp.th.rafter'), t('k.sp.th.sheet'), t('k.sp.th.pcs'), t('k.sp.th.covered'), t('k.sp.th.order')], rows,
      [TOT, '', '', '', String(sp.tot.n), fmt(sp.tot.area, 1), fmt(sp.tot.order, 1)]);
    if (sp.planes.some(function (p) { return p.split; })) h += '<p class="k-fn">' + t('k.sp.fnSplit', { v: fmt(sp.profile.maxLen, 1) }) + '</p>';
    if (sp.walls.length) {
      h += table('k-tbl--wall', t('k.sp.cap.wall'), [t('k.sp.th.wall'), t('k.sp.th.profile'), t('k.sp.th.sheet'), t('k.sp.th.pcs'), t('k.sp.th.area'), t('k.sp.th.order')], sp.walls.map(function (w) { return { c: [esc(w.name), w.profile, w.lens, String(w.n), fmt(w.area, 1), fmt(w.order, 1)] }; }),
        [TOT, '', '', String(sp.walls.reduce(function (a, w) { return a + w.n; }, 0)), fmt(sp.walls.reduce(function (a, w) { return a + w.area; }, 0), 1), fmt(sp.walls.reduce(function (a, w) { return a + w.order; }, 0), 1)]);
    }
    var dt = sp.dt;
    h += table('k-tbl--drain', t('k.sp.cap.drain') + esc(sp.gutter.name) + ' · ' + esc(sp.pipe.name), [t('k.sp.th.eave'), t('k.sp.th.gutter'), t('k.sp.th.hooks'), t('k.sp.th.caps'), t('k.sp.th.pipes'), t('k.sp.th.elbows'), t('k.sp.th.outlets'), t('k.sp.th.clamps')],
      sp.drains.map(function (d) { return { c: [esc(d.name) + ' <span class="k-side">' + d.side + '</span>', fmt(d.len), String(d.hooks), String(d.caps), d.pipes.length ? d.pipes.length + ' × ' + fmt(d.pipes[0]) + ' m' : '—', String(d.elbows), String(d.outlets), String(d.clamps)] }; }),
      [TOT, fmt(dt.len), String(dt.hooks), String(dt.caps), dt.pipes + ' · ' + fmt(dt.pipeLen) + ' m', String(dt.elbows), String(dt.outlets), String(dt.clamps)]);
    h += '<p class="k-fn">' + t('k.sp.fnHopper', { n: dt.pipes }) + (dt.corners ? t('k.sp.fnCorners', { n: dt.corners }) : '') + t('k.sp.fnLength') + '</p>';
    h += table('k-tbl--flash', t('k.sp.cap.flash'), [t('k.sp.th.item'), t('k.sp.th.qty'), t('k.sp.th.pieces')], sp.flash.map(function (f) { return { c: [esc(f.label), f.qty, f.pcs] }; }));
    h += '<details class="k-as"' + (o.print || o.open ? ' open' : '') + '><summary>' + t('k.sp.assumptions') + '</summary><dl>' + sp.assumptions.map(function (a) { return '<div><dt>' + esc(a[0]) + '</dt><dd>' + esc(a[1]) + '</dd></div>'; }).join('') + '</dl></details>';
    h += '<p class="k-note k-note--warn">' + esc(sp.disclaimer) + '</p>';
    return h;
  };

  /* ---- plain text for the inquiry: level 0 = full, 1 = totals per table, 2 = summary only ------------ */
  SP.text = function (sp, level, url) {
    var dt = sp.dt;
    var CODE = t('k.sp.sum.code'), out = [];
    sp.summary.forEach(function (r) { if (r[0] !== CODE) out.push(r[0] + ': ' + r[1]); });
    if (level < 2) {
      out.push(t('k.tx.planes'));
      if (level === 0) sp.planes.forEach(function (p) { out.push(t('k.tx.plane', { name: p.name, side: p.side, deg: Math.round(p.deg), raf: fmt(p.rafter), n: p.n, g: p.groups.length === 1 ? '× ' + fmt(p.groups[0].len) + ' m' : grpTxt(p.groups), a: fmt(p.area, 1), o: fmt(p.order, 1) })); });
      out.push(t('k.tx.total', { n: sp.tot.n, a: fmt(sp.tot.area, 1), o: fmt(sp.tot.order, 1) }));
      sp.walls.forEach(function (w) { out.push(t('k.tx.wall', { name: w.name, n: w.n, l: w.lens, o: fmt(w.order, 1) })); });
      out.push(t('k.tx.drainage'));
      if (level === 0) sp.drains.forEach(function (d) { out.push(t('k.tx.drain', { name: d.name, l: fmt(d.len), h: d.hooks, c: d.caps, p: d.pipes.length ? t('k.tx.pipes', { n: d.pipes.length, l: fmt(d.pipes[0]) }) : t('k.tx.noPipe') })); });
      out.push(t('k.tx.dtotal1', { l: fmt(dt.len), h: dt.hooks, c: dt.caps }) + (dt.corners ? t('k.tx.corners', { n: dt.corners }) : '') + t('k.tx.dtotal2', { p: dt.pipes, pl: fmt(dt.pipeLen), e: dt.elbows, o: dt.outlets, k: dt.clamps }));
      out.push(t('k.tx.flash'));
      out.push(sp.flash.filter(function (f) { return f.id !== 'vijci'; }).map(function (f) { return f.label + ' ' + f.qty; }).join('; ') || '—');
      if (level === 0) out.push(t('k.tx.assumptions') + sp.assumptions.slice(0, 7).map(function (a) { return (TK.en ? a[0].charAt(0).toLowerCase() + a[0].slice(1) : a[0].toLowerCase()) + ' ' + a[1]; }).join('; '));
    } else out.push(t('k.tx.short', { n: sp.tot.n, o: fmt(sp.tot.order, 1), l: fmt(dt.len), p: dt.pipes }));
    if (url) out.push(t('k.tx.cfg', { c: sp.code, url: url }));
    return out.join('\n');
  };

  // several variants in one message, as detailed as the 2000-character field allows
  SP.message = function (items, max) {
    max = max || 2000;
    var head = items.length > 1 ? t('k.msg.multi', { n: items.length }) + (items.length > 4 ? '' : '') : t('k.msg.one', { c: items[0].spec.code });
    var foot = D.disclaimer;
    for (var lv = 0; lv <= 2; lv++) {
      var body = items.map(function (it, i) { return (items.length > 1 ? t('k.msg.variant', { n: i + 1 }) + (it.name || it.spec.code) + '\n' : '') + SP.text(it.spec, lv, it.url); }).join('\n\n');
      var txt = head + '\n\n' + body + '\n\n' + foot;
      if (txt.length <= max || lv === 2) return { text: txt.length <= max ? txt : txt.slice(0, max - 1), level: lv, length: txt.length };
    }
  };
})();
