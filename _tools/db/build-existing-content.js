#!/usr/bin/env node
/* ==========================================================================
   TRICOM — _tools/db/build-existing-content.js
   Jednokratno (lokalno) pravi database/002-existing-content.sql iz postojećeg
   frontenda: js/items.js (izvršen, jer deo stavki gradi kod), proizvodi.html,
   usluge.html, reference.html, galerija.html, o-nama.html, kontakt.html,
   js/main.js i njihovih engleskih parova (uklonjene strane čita iz
   _tools/source/). Server ne treba Node — na hosting ide samo SQL.
   Piše i zakrpe database/patches/003-*.sql i 004-*.sql, app/data/items-static.json
   i app/data/icons.json (ikone sa strana usluga i referenci).

     node _tools/db/build-existing-content.js

   Izlaz je deterministički (isti ulaz → isti fajl, isti id-jevi). Na kraju
   ispisuje izveštaj: brojeve po entitetu i prevode koji nedostaju.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'database', '002-existing-content.sql');
const IMPORT_KEY = '002-existing-content';

/* Strane koje su posle uvoza postale PHP (proizvodi, detalji proizvoda) čuvaju se
   kao snimak izvora u _tools/source/ — alat ih čita odatle kad ih nema u korenu. */
const read = (f) => fs.readFileSync(fs.existsSync(path.join(ROOT, f)) ? path.join(ROOT, f) : path.join(ROOT, '_tools', 'source', f), 'utf8');
const fail = (msg) => { console.error('GREŠKA: ' + msg); process.exit(1); };

/* ---------- izvori ---------- */
const ctx = { window: {} };
ctx.globalThis = ctx.window;
vm.createContext(ctx);
vm.runInContext(read('js/items.js'), ctx);
const ITEMS = ctx.window.TRICOM_ITEMS;
if (!ITEMS || !Array.isArray(ITEMS.list)) fail('js/items.js nije učitan');
const item = (slug) => ITEMS.get(slug) || fail('nema stavke ' + slug);

const HTML = {
  sr: { products: read('proizvodi.html'), refs: read('reference.html'), gallery: read('galerija.html'),
        about: read('o-nama.html'), home: read('index.html'), contact: read('kontakt.html'), services: read('usluge.html') },
  en: { products: read('en/products.html'), refs: read('en/references.html'), gallery: read('en/gallery.html'),
        about: read('en/about.html'), home: read('en/index.html'), contact: read('en/contact.html'), services: read('en/services.html') },
};
const MAIN_JS = read('js/main.js');

/* ---------- HTML pomoćnici ---------- */
const ENT = { nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', middot: '·', ndash: '–', mdash: '—', hellip: '…' };
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return Object.prototype.hasOwnProperty.call(ENT, e.toLowerCase()) ? ENT[e.toLowerCase()] : m;
  });
}
/* tekst elementa: bez tagova i komentara, <br> i blok-tagovi → razmak,
   inline tagovi (<a>, <strong>, <span> …) nestaju bez razmaka; sažeti razmaci */
const BLOCK = /<\/?(?:p|div|li|ul|ol|h[1-6]|dt|dd|dl|tr|td|th|table|section|figure|figcaption|article|br)\b[^>]*>/gi;
function text(html) {
  return decode(String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(BLOCK, ' ')
    .replace(/<[^>]+>/g, ''))
    .replace(/[ \t\r\n ]+/g, ' ').trim();
}
/* tekst kartice: kao text(), ali zadržava naglašavanje (<strong>/<b> → <strong>);
   frontend ga ispisuje kroz e_rich(), koji dozvoljava samo <strong> */
function richText(html) {
  const marked = String(html).replace(/<(\/?)(?:strong|b)\b[^>]*>/gi, (m, c) => (c ? '\u0002' : '\u0001'));
  return text(marked).replace(/\u0001/g, '<strong>').replace(/\u0002/g, '</strong>').replace(/<strong>\s*<\/strong>/g, '');
}
/* deo HTML-a od otvarajućeg taga na poziciji `at` do njegovog zatvarajućeg (po dubini) */
function element(html, at) {
  const open = /^<([a-z0-9]+)\b/i.exec(html.slice(at));
  if (!open) fail('nema taga na poziciji ' + at);
  const tag = open[1].toLowerCase();
  const rx = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi');
  rx.lastIndex = at;
  let depth = 0, m;
  while ((m = rx.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(at, rx.lastIndex);
  }
  fail('nezatvoren <' + tag + '> na poziciji ' + at);
}
function attr(tagHtml, name) {
  const m = new RegExp('\\s' + name + '="([^"]*)"').exec(tagHtml);
  return m ? decode(m[1]) : null;
}
function openTag(el) { return /^<[^>]*>/.exec(el)[0]; }
function sectionById(html, id) {
  const i = html.indexOf('id="' + id + '"');
  if (i < 0) fail('nema id="' + id + '"');
  return element(html, html.lastIndexOf('<', i));
}
/* sve stavke sa data-item unutar dela strane, redom */
function dataItems(html) {
  const out = [];
  const rx = /<([a-z0-9]+)\b[^>]*\sdata-item="([^"]+)"[^>]*>/gi;
  let m;
  while ((m = rx.exec(html))) {
    const el = element(html, m.index);
    out.push({ slug: m[2], tag: m[1].toLowerCase(), cls: (attr(openTag(el), 'class') || '').split(/\s+/)[0], el, open: openTag(el) });
  }
  return out;
}
/* slika u elementu: render (assets/render/<key>-light…) ili fotografija */
function imageOf(el) {
  const img = /<img\b[^>]*>/i.exec(el);
  if (!img) return null;
  const src = (attr(img[0], 'data-orig') || attr(img[0], 'src') || '').split('?')[0].replace(/^(\.\.\/)+/, '');
  const alt = attr(img[0], 'alt') || '';
  const r = /^assets\/render\/(.+?)-(light|dark)(-\d+w)?\.(webp|jpg|png)$/.exec(src);
  if (r) return { type: 'render', key: r[1], alt };
  const w = parseInt(attr(img[0], 'width') || '', 10) || null, h = parseInt(attr(img[0], 'height') || '', 10) || null;
  return { type: 'photo', path: src.replace(/-\d+w\.webp$/, '.jpg'), w, h, alt };
}

/* ---------- SQL ---------- */
function q(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') { if (!Number.isFinite(v)) fail('broj ' + v); return String(v); }
  if (typeof v === 'boolean') return v ? '1' : '0';
  const s = String(v);
  if (s.includes('\\') || s.includes('\0')) {
    /* nezavisno od NO_BACKSLASH_ESCAPES: heks literal */
    return "CONVERT(X'" + Buffer.from(s, 'utf8').toString('hex') + "' USING utf8mb4)";
  }
  return "'" + s.replace(/'/g, "''") + "'";
}
const nn = (s) => (s === undefined || s === null || s === '' ? null : s);
const lines = (a) => (Array.isArray(a) && a.length ? a.join('\n') : null);
const paras = (a) => (Array.isArray(a) && a.length ? a.join('\n\n') : null);

const out = [];
const counts = {};
const GUARD = "NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = " + q(IMPORT_KEY) + ')';
/* Jedan red = jedna naredba: INSERT … SELECT … WHERE nije već uvezeno.
   `parents` = [[tabela, id, slug]] — red deteta ulazi samo uz tačnog roditelja. */
function insert(table, row, pk, parents) {
  const cols = Object.keys(row);
  let where = GUARD;
  (parents || []).forEach(([t, id, slug]) => {
    where += ' AND EXISTS (SELECT 1 FROM `' + t + '` WHERE `id` = ' + q(id) + ' AND `slug` = ' + q(slug) + ')';
  });
  const key = (pk || ['id'])[0];
  out.push('INSERT INTO `' + table + '` (' + cols.map((c) => '`' + c + '`').join(', ') + ')\n  SELECT ' +
    cols.map((c) => q(row[c])).join(', ') + '\n  FROM DUAL WHERE ' + where +
    '\n  ON DUPLICATE KEY UPDATE `' + key + '` = `' + key + '`;');
  counts[table] = (counts[table] || 0) + 1;
}
const section = (title) => out.push('', '-- ' + '-'.repeat(74), '-- ' + title, '-- ' + '-'.repeat(74));

/* ---------- izveštaj o prevodima ---------- */
const missing = [];
function both(where, field, sr, en) {
  const a = sr == null ? '' : String(sr).trim(), b = en == null ? '' : String(en).trim();
  if (a && !b) missing.push(where + ' · ' + field + ': nema EN');
  if (!a && b) missing.push(where + ' · ' + field + ': nema SR');
}

/* ==========================================================================
   1. Kategorije proizvoda (tabovi)
   ========================================================================== */
const CAT_SLUGS = ['limovi', 'krov', 'oluci', 'cevi', 'kovano', 'alati'];
const CAT_ID = {};
const catData = CAT_SLUGS.map((slug, i) => {
  const d = { id: i + 1, slug };
  for (const l of ['sr', 'en']) {
    const h = HTML[l].products;
    const tab = /<button[^>]*role="tab"[^>]*data-hash="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g;
    let m, name = null;
    while ((m = tab.exec(h))) if (m[1] === slug) name = text(m[2]);
    const panel = sectionById(h, 'prog-p-' + slug);
    const h3 = /<h3\b[^>]*>([\s\S]*?)<\/h3>/i.exec(panel);
    const lead = /<p class="lead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i.exec(panel);
    if (!name || !h3 || !lead) fail('kategorija ' + slug + ' (' + l + ') nepotpuna');
    d['name_' + l] = name; d['heading_' + l] = text(h3[1]); d['intro_' + l] = text(lead[1]);
    /* oznaka u podmeniju „Proizvodi“ (zaglavlje i mobilni meni) */
    const ddm = element(h, h.indexOf('<div class="dropdown" id="dd-proizvodi"'));
    const nav = [...ddm.matchAll(/<a href="[^"#]*#([^"]+)">([\s\S]*?)<\/a>/g)].find((m) => m[1] === slug);
    if (!nav) fail('nema stavke podmenija za ' + slug + ' (' + l + ')');
    d['nav_label_' + l] = text(nav[2]);
    d['panel_' + l] = panel;
  }
  CAT_ID[slug] = d.id;
  return d;
});

/* ==========================================================================
   2. Proizvodi, tehnički podaci, prikaz u tabovima
   ========================================================================== */
/* primarna kategorija = veza „Nazad“ na stranama detalja (detalji/<slug>.html) */
const PRIMARY = { krov: 'krov', limarija: 'oluci', oluci: 'oluci', cevi: 'cevi', kovano: 'kovano', alati: 'alati' };

function contentRow(it, sortOrder) {
  const r = {};
  for (const l of ['sr', 'en']) {
    const x = it[l] || {};
    r['title_' + l] = x.t || '';
    r['summary_' + l] = nn(x.sum);
    r['description_' + l] = paras(x.desc);
    r['tags_' + l] = lines(x.tags);
    r['apps_' + l] = lines(x.apps);
  }
  for (const f of ['title', 'summary', 'description', 'tags', 'apps']) both(it.slug, f, r[f + '_sr'], r[f + '_en']);
  if (it.img) { r.image_type = 'render'; r.render_key = it.img; }
  else if (it.svg) { r.image_type = 'illu'; r.illu_key = it.svg; }
  else if (it.photo && it.photo.src) { r.image_type = 'photo'; r.photo_path = it.photo.src; r.photo_width = it.photo.w || null; r.photo_height = it.photo.h || null; }
  else r.image_type = 'none';
  r.render_key = r.render_key || null; r.illu_key = r.illu_key || null;
  r.photo_path = r.photo_path || null; r.photo_width = r.photo_width || null; r.photo_height = r.photo_height || null;
  r.drawing_path = nn(it.drawing);
  r.calc_id = nn(it.calc); r.calc_tabs = nn(it.calcTabs); r.konf_hash = nn(it.konf);
  r.related_slugs = it.rel && it.rel.length ? it.rel.join(',') : null;
  r.sort_order = sortOrder; r.is_active = 1;
  return r;
}
function specRows(it, ownerKey, ownerId, startId) {
  const sr = (it.sr && it.sr.specs) || [], en = (it.en && it.en.specs) || [];
  if (sr.length !== en.length) missing.push(it.slug + ' · specs: SR ' + sr.length + ' / EN ' + en.length + ' redova');
  return sr.map((s, i) => {
    const e = en[i] || ['', ''];
    both(it.slug, 'spec ' + (i + 1), s[0], e[0]);
    return { id: startId + i, [ownerKey]: ownerId, sort_order: (i + 1) * 10, label_sr: s[0], value_sr: s[1], label_en: e[0], value_en: e[1] };
  });
}

const products = ITEMS.list.filter((it) => it.kind === 'product');
const PROD_ID = {};
const productRows = products.map((it, i) => {
  const cat = PRIMARY[it.cat];
  if (!cat) fail('nepoznata kategorija ' + it.cat + ' za ' + it.slug);
  PROD_ID[it.slug] = i + 1;
  return Object.assign({ id: i + 1, slug: it.slug, category_id: CAT_ID[cat] }, contentRow(it, (i + 1) * 10));
});
let specId = 1;
const productSpecRows = [];
products.forEach((it) => { const rows = specRows(it, 'product_id', PROD_ID[it.slug], specId); specId += rows.length; productSpecRows.push(...rows); });

/* prikaz u tabu: kartice sa data-item u panelu taba, bez „lineup“ preseka (.lu) */
const placements = new Map();
for (const l of ['sr', 'en']) {
  catData.forEach((c) => {
    let order = 0;
    dataItems(c['panel_' + l]).forEach((d) => {
      if (d.cls === 'lu') return;
      if (!PROD_ID[d.slug]) fail('kartica ' + d.slug + ' u tabu ' + c.slug + ' nije proizvod');
      const key = d.slug + '|' + c.slug;
      const it = item(d.slug)[l];
      const p = placements.get(key) || { product_id: PROD_ID[d.slug], category_id: c.id, sort_order: 0, _slug: d.slug, _cat: c.slug };
      order += 10;
      if (l === 'sr') p.sort_order = order;
      /* naslov kartice: h3 ili h4; tekst: pasusi, a kod liste (prog__i) stavke liste */
      const t = /<h[34]\b[^>]*>([\s\S]*?)<\/h[34]>/i.exec(d.el);
      const title = t ? text(t[1]) : '';
      const ps = [...d.el.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => richText(m[1])).filter(Boolean);
      const lis = [...d.el.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => text(m[1])).filter(Boolean);
      const body = ps.length ? ps.join('\n\n') : (lis.length ? lis.join('\n') : '');
      const tags = [...d.el.matchAll(/<span class="tag">([\s\S]*?)<\/span>/gi)].map((m) => text(m[1]));
      /* kartica: [vrednost na strani, vrednost proizvoda]; posle oba jezika
         polje se čuva samo ako se na bar jednom jeziku razlikuje */
      p['card_title_' + l] = [title, it.t || ''];
      p['card_text_' + l] = [body, it.sum || ''];
      p['card_tags_' + l] = [tags.join('\n'), (it.tags || []).join('\n')];
      const img = imageOf(d.el);
      const prod = item(d.slug);
      if (img && img.type === 'render') {
        if (img.key !== prod.img) { p.card_image_type = 'render'; p.card_render_key = img.key; }
        p['card_image_alt_' + l] = img.alt && img.alt !== it.t ? img.alt : null;
      } else if (img) {
        p.card_image_type = 'photo'; p.card_photo_path = img.path; p.card_photo_width = img.w; p.card_photo_height = img.h;
        p['card_image_alt_' + l] = img.alt || null;
      } else if (!p.card_image_type) {
        p.card_image_type = 'none';
      }
      placements.set(key, p);
    });
  });
}
const placementRows = [...placements.values()].map((p) => {
  const r = { product_id: p.product_id, category_id: p.category_id, sort_order: p.sort_order };
  for (const f of ['card_title', 'card_text', 'card_tags']) {
    const [pageSr, prodSr] = p[f + '_sr'] || ['', ''], [pageEn, prodEn] = p[f + '_en'] || ['', ''];
    /* kartica koja polje uopšte ne prikazuje (npr. oznake u tabu „Alati“) ga
       ne preklapa — to određuje izgled taba, ne podatak */
    const differs = (pageSr && pageSr !== prodSr) || (pageEn && pageEn !== prodEn);
    r[f + '_sr'] = differs ? (pageSr || null) : null;
    r[f + '_en'] = differs ? (pageEn || null) : null;
    if (differs) both(p._slug + '@' + p._cat, f, r[f + '_sr'], r[f + '_en']);
  }
  r.card_image_type = p.card_image_type || 'inherit';
  r.card_render_key = p.card_render_key || null;
  r.card_photo_path = p.card_photo_path || null;
  r.card_photo_width = p.card_photo_width || null;
  r.card_photo_height = p.card_photo_height || null;
  r.card_image_alt_sr = p.card_image_alt_sr || null;
  r.card_image_alt_en = p.card_image_alt_en || null;
  r._slug = p._slug; r._cat = p._cat;
  return r;
}).sort((a, b) => a.category_id - b.category_id || a.sort_order - b.sort_order);

/* ==========================================================================
   3. Usluge i mogućnosti
   ========================================================================== */
const services = ITEMS.list.filter((it) => it.kind === 'service' || it.kind === 'capability');
const SVC_ID = {};
/* ikone redova liste na usluge.html (pouzdan SVG iz postojeće strane; ključ = slug usluge) */
const ICONS = { service: {}, reference: {} };
const svcRows = (html) => dataItems(html).filter((d) => d.cls === 'srow');
const svcSr = svcRows(HTML.sr.services), svcEn = svcRows(HTML.en.services);
if (svcSr.length !== svcEn.length) fail('broj usluga SR/EN se razlikuje');
svcSr.forEach((d, i) => {
  const icon = (el) => { const m = /<span class="trow__svg" aria-hidden="true">(<svg[\s\S]*?<\/svg>)<\/span>/.exec(el); return m ? m[1] : null; };
  const a = icon(d.el), b = icon(svcEn[i].el);
  if (!a || a !== b || svcEn[i].slug !== d.slug) fail('ikona usluge ' + d.slug + ' (SR/EN)');
  ICONS.service[d.slug] = a;
});
const serviceRows = services.map((it, i) => {
  SVC_ID[it.slug] = i + 1;
  return Object.assign({ id: i + 1, slug: it.slug, kind: it.kind }, contentRow(it, (i + 1) * 10), { icon_key: ICONS.service[it.slug] ? it.slug : null });
});
let sSpecId = 1;
const serviceSpecRows = [];
services.forEach((it) => { const rows = specRows(it, 'service_id', SVC_ID[it.slug], sSpecId); sSpecId += rows.length; serviceSpecRows.push(...rows); });

/* ==========================================================================
   4. Reference (redosled i tip po reference.html)
   ========================================================================== */
const refsSr = dataItems(HTML.sr.refs), refsEn = dataItems(HTML.en.refs);
if (refsSr.length !== refsEn.length) fail('broj referenci SR/EN se razlikuje');
const demandSec = (() => { const i = HTML.sr.refs.indexOf('data-item="ref-rad-na-visini"'); return HTML.sr.refs.lastIndexOf('<section', i); })();
const referenceRows = refsSr.map((d, i) => {
  const it = item(d.slug);
  if (it.kind !== 'reference') fail(d.slug + ' nije referenca');
  const inDemand = element(HTML.sr.refs, demandSec).includes('data-item="' + d.slug + '"');
  const type = inDemand ? 'demand' : (d.cls === 'ref' ? 'project' : 'scope');
  const r = { id: i + 1, slug: d.slug, ref_type: type };
  for (const l of ['sr', 'en']) {
    r['title_' + l] = it[l].t; r['summary_' + l] = nn(it[l].sum); r['label_' + l] = nn(it[l].meta);
    /* tekst kartice na strani zadržava naglašavanje (<strong>), ako je inače isti kao u items.js */
    const el = (l === 'sr' ? d : refsEn[i]).el;
    const ps = [...el.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => richText(m[1])).filter(Boolean);
    const rich = ps.join('\n\n');
    if (rich.includes('<strong>') && rich.replace(/<\/?strong>/g, '') === (it[l].sum || '')) r['summary_' + l] = rich;
  }
  /* ikona kartice (vrste zahtevnosti) */
  const ic = (el) => { const m = /<div class="card__icon">(<svg[\s\S]*?<\/svg>)<\/div>/.exec(el); return m ? m[1] : null; };
  const icSr = ic(d.el);
  if (icSr !== ic(refsEn[i].el)) fail('ikona reference ' + d.slug + ' (SR/EN)');
  if (icSr) ICONS.reference[d.slug] = icSr;
  r.icon_key = icSr ? d.slug : null;
  for (const f of ['title', 'summary', 'label']) both(d.slug, f, r[f + '_sr'], r[f + '_en']);
  /* slika: iz items.js (photo), inače slika same kartice na strani */
  const imgSr = imageOf(d.el), imgEn = imageOf(refsEn[i].el);
  if (it.photo && it.photo.src) {
    Object.assign(r, { image_type: 'photo', render_key: null, photo_path: it.photo.src, photo_width: it.photo.w || null, photo_height: it.photo.h || null });
  } else if (imgSr && imgSr.type === 'render') {
    Object.assign(r, { image_type: 'render', render_key: imgSr.key, photo_path: null, photo_width: null, photo_height: null });
  } else if (imgSr) {
    Object.assign(r, { image_type: 'photo', render_key: null, photo_path: imgSr.path, photo_width: imgSr.w, photo_height: imgSr.h });
  } else {
    Object.assign(r, { image_type: 'none', render_key: null, photo_path: null, photo_width: null, photo_height: null });
  }
  r.image_alt_sr = imgSr && imgSr.alt ? imgSr.alt : null;
  r.image_alt_en = imgEn && imgEn.alt ? imgEn.alt : null;
  if (r.image_type !== 'none') both(d.slug, 'image_alt', r.image_alt_sr, r.image_alt_en);
  r.sort_order = (i + 1) * 10; r.is_active = 1;
  return r;
});

/* ==========================================================================
   5. Galerije
   ========================================================================== */
const GCAT = [];
for (const l of ['sr', 'en']) {
  const rx = /<button[^>]*data-filter="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g;
  let m, i = 0;
  while ((m = rx.exec(HTML[l].gallery))) {
    if (m[1] === 'all') continue;
    GCAT[i] = GCAT[i] || { id: i + 1, slug: m[1], sort_order: (i + 1) * 10, is_active: 1 };
    if (GCAT[i].slug !== m[1]) fail('redosled filtera galerije SR/EN se razlikuje');
    GCAT[i]['name_' + l] = text(m[2]);
    i++;
  }
}
GCAT.forEach((c) => both('galerija:' + c.slug, 'name', c.name_sr, c.name_en));
const GCAT_ID = Object.fromEntries(GCAT.map((c) => [c.slug, c.id]));
const galSr = dataItems(HTML.sr.gallery), galEn = dataItems(HTML.en.gallery);
if (galSr.length !== galEn.length) fail('broj pločica galerije SR/EN se razlikuje');
const galleryRows = galSr.map((d, i) => {
  const it = item(d.slug);
  const gcat = attr(d.open, 'data-gcat');
  if (gcat !== it.cat || !GCAT_ID[gcat]) fail('kategorija pločice ' + d.slug);
  const r = { id: i + 1, slug: d.slug, category_id: GCAT_ID[gcat], fig_no: it.fig || attr(d.open, 'data-fig') || '' };
  for (const l of ['sr', 'en']) { r['caption_' + l] = it[l].t; r['alt_' + l] = it[l].alt || ''; }
  both(d.slug, 'caption', r.caption_sr, r.caption_en); both(d.slug, 'alt', r.alt_sr, r.alt_en);
  if (it.photo && it.photo.src) Object.assign(r, { image_type: 'photo', render_key: null, photo_path: it.photo.src, photo_width: it.photo.w || null, photo_height: it.photo.h || null });
  else if (it.img) Object.assign(r, { image_type: 'render', render_key: it.img, photo_path: null, photo_width: null, photo_height: null });
  else fail('pločica bez slike ' + d.slug);
  r.crop_pos = attr(d.open, 'data-pos'); r.zoom = attr(d.open, 'data-zoom');
  r.sort_order = (i + 1) * 10; r.is_active = 1;
  return r;
});

/* ==========================================================================
   6. Česta pitanja (O nama, #faq2; početna mora biti ista lista)
   ========================================================================== */
function faqList(html, accId) {
  const acc = sectionById(html, accId);
  return [...acc.matchAll(/<button class="acc__btn"[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div class="acc__panel"[^>]*><div>([\s\S]*?)<\/div><\/div>/g)]
    .map((m) => ({ q: text(m[1]), a: [...m[2].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((p) => text(p[1])).join('\n\n') }));
}
const faqSr = faqList(HTML.sr.about, 'faq2'), faqEn = faqList(HTML.en.about, 'faq2');
if (!faqSr.length || faqSr.length !== faqEn.length) fail('FAQ SR/EN: ' + faqSr.length + '/' + faqEn.length);
const homeFaqId = /data-acc="single" id="([^"]+)"/.exec(sectionById(HTML.sr.home, 'faq'))[1];
const homeEnFaqId = /data-acc="single" id="([^"]+)"/.exec(sectionById(HTML.en.home, 'faq'))[1];
const faqHomeNote = [];
if (JSON.stringify(faqList(HTML.sr.home, homeFaqId)) !== JSON.stringify(faqSr)) faqHomeNote.push('SR početna ≠ O nama');
if (JSON.stringify(faqList(HTML.en.home, homeEnFaqId)) !== JSON.stringify(faqEn)) faqHomeNote.push('EN početna ≠ O nama');
const faqRows = faqSr.map((f, i) => {
  both('faq ' + (i + 1), 'question', f.q, faqEn[i].q); both('faq ' + (i + 1), 'answer', f.a, faqEn[i].a);
  return { id: i + 1, question_sr: f.q, question_en: faqEn[i].q, answer_sr: f.a, answer_en: faqEn[i].a, sort_order: (i + 1) * 10, is_active: 1 };
});

/* ==========================================================================
   7. Kontakt
   ========================================================================== */
function infoblocks(html) {
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const out = [];
  const rx = /<div class="infoblock\b[^"]*"[^>]*>/g;
  let m;
  while ((m = rx.exec(main))) {
    const el = element(main, m.index);
    const h3 = /<h3\b[^>]*>([\s\S]*?)<\/h3>/i.exec(el);
    const lines = [...el.matchAll(/<div class="infoline"><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g)].map((x) => ({ dt: text(x[1]), dd: x[2] }));
    out.push({ title: h3 ? text(h3[1]) : '', lines, el });
  }
  return out;
}
const IB = { sr: infoblocks(HTML.sr.contact), en: infoblocks(HTML.en.contact) };
if (IB.sr.length !== IB.en.length || IB.sr.length < 5) fail('infoblokovi kontakta: ' + IB.sr.length + '/' + IB.en.length);
/* redosled na strani: [0] prodaja, [1] direkcija, [2] podaci o firmi, [3] mapa prodaja, [4] mapa direkcija */
const dd = (block, i) => block.lines[i].dd;
const telLinks = (html) => [...html.matchAll(/<a href="tel:([^"]+)">([\s\S]*?)<\/a>/g)].map((m) => ({ tel: m[1], display: text(m[2]) }));
const mailLinks = (html) => [...html.matchAll(/<a href="mailto:([^"]+)">/g)].map((m) => m[1]);
function splitAddress(ddHtml) {          /* „Ulica<br>11273 Mesto, Grad“ */
  const [street, rest] = ddHtml.split(/<br\s*\/?>/i).map(text);
  const m = /^(\d{5})\s+([^,]+),\s*(.+)$/.exec(rest || '');
  if (!m) fail('adresa: ' + ddHtml);
  return { street, postal_code: m[1], place: m[2], city: m[3] };
}
function mapOf(html) {
  const m = /data-map="([^"]+)"[^>]*data-map-title="([^"]+)"/.exec(html);
  if (!m) fail('mapa nije pronađena');
  const query = decodeURIComponent(new URL(decode(m[1])).searchParams.get('q') || '');
  return { query, title: decode(m[2]) };
}
/* mape: kartica lokacije (.kf-loc) sadrži i mapu i infoblok */
function locCards(html) {
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const out = [];
  const rx = /<div class="g-card kf-loc"[^>]*>/g;
  let m;
  while ((m = rx.exec(main))) out.push(element(main, m.index));
  return out;
}
const LOC = { sr: locCards(HTML.sr.contact), en: locCards(HTML.en.contact) };
if (LOC.sr.length !== 2 || LOC.en.length !== 2) fail('očekivane dve lokacije sa mapom');

/* futer (isti na svim stranama): koji telefoni stoje u futeru */
const fsheetAt = HTML.sr.home.indexOf('<dl class="fsheet"');
if (fsheetAt < 0) fail('futer (.fsheet) nije pronađen');
const footerSr = element(HTML.sr.home, fsheetAt);
const footerTels = new Set(telLinks(footerSr).map((t) => t.tel));
const footerEmail = mailLinks(footerSr)[0] || '';

const LOC_SLUGS = ['prodaja', 'direkcija'];
const locationRows = [], phoneRows = [];
let phoneId = 1;
LOC_SLUGS.forEach((slug, i) => {
  const bSr = IB.sr[i], bEn = IB.en[i];
  const aSr = splitAddress(dd(bSr, 0)), aEn = splitAddress(dd(bEn, 0));
  if (aSr.street !== aEn.street || aSr.postal_code !== aEn.postal_code || aSr.place !== aEn.place) fail('adresa ' + slug + ' SR/EN');
  const lcSr = LOC.sr[i], lcEn = LOC.en[i];
  const mSr = mapOf(lcSr), mEn = mapOf(lcEn);
  if (mSr.query !== mEn.query) fail('mapa ' + slug + ' SR/EN');
  const purpose = (html) => { const b = infoblocks('<main>' + html + '</main>')[0]; return text(b.lines[1].dd); };
  const shortName = (html) => text(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i.exec(html)[1]);
  const emailLine = bSr.lines.find((x) => /mailto:/.test(x.dd));
  const r = {
    id: i + 1, slug,
    title_sr: bSr.title, title_en: bEn.title,
    short_name_sr: shortName(lcSr), short_name_en: shortName(lcEn),
    street: aSr.street, postal_code: aSr.postal_code, place: aSr.place, city_sr: aSr.city, city_en: aEn.city,
    purpose_sr: purpose(lcSr), purpose_en: purpose(lcEn),
    emails: emailLine ? mailLinks(emailLine.dd).join('\n') : null,
    map_query: mSr.query, map_title_sr: mSr.title, map_title_en: mEn.title,
    sort_order: (i + 1) * 10,
  };
  for (const f of ['title', 'short_name', 'city', 'purpose', 'map_title']) both('lokacija ' + slug, f, r[f + '_sr'], r[f + '_en']);
  locationRows.push(r);
  const telSr = telLinks(bSr.el), telEn = telLinks(bEn.el);
  telSr.forEach((t, k) => {
    const e = telEn.find((x) => x.tel === t.tel);
    both('telefon ' + t.tel, 'display', t.display, e && e.display);
    phoneRows.push({ id: phoneId++, location_id: r.id, tel: t.tel, display_sr: t.display, display_en: e ? e.display : '',
      in_footer: footerTels.has(t.tel) && (slug === 'prodaja' ? k < 2 : k < 1) ? 1 : 0, sort_order: (k + 1) * 10, _slug: slug });
  });
});

/* podaci o firmi: blok [2]; redovi po redosledu na strani (isti na oba jezika) */
const cSr = IB.sr[2].lines, cEn = IB.en[2].lines;
if (cSr.length !== cEn.length || cSr.length < 10) fail('podaci o firmi SR/EN');
const byDt = (lines, dt) => { const x = lines.find((l) => l.dt === dt); if (!x) fail('nema reda ' + dt); return x.dd; };
const nameDd = byDt(cSr, 'NAZIV'), nameDdEn = byDt(cEn, 'NAME');
const legal = (ddHtml) => text(/<span[^>]*>([\s\S]*?)<\/span>/.exec(ddHtml)[1]).replace(/^[^:]+:\s*/, '');
if (legal(nameDd) !== legal(nameDdEn)) missing.push('kontakt · pun naziv se razlikuje SR/EN (zadržan SR)');
const vatSr = byDt(cSr, 'PDV'), vatEn = byDt(cEn, 'VAT');
const vatText = (h) => text(h.split(/ — /)[0]);
const vatLinks = (h) => [...h.matchAll(/<a href="([^"]+)"/g)].map((m) => m[1].split('?')[0].replace(/^(\.\.\/)+/, ''));
const bank = text(byDt(cSr, 'TEKUĆI RAČUN'));
const bankAcc = text(/<span class="nowrap">([\s\S]*?)<\/span>/.exec(byDt(cSr, 'TEKUĆI RAČUN'))[1]);
const fb = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/.exec(byDt(cSr, 'FACEBOOK'));
const hoursSr = text(byDt(IB.sr[0].lines, 'RADNO VREME')), hoursEn = text(byDt(IB.en[0].lines, 'OPENING HOURS'));
/* rezervne vrednosti u main.js (od faze 4b: hAttr('data-open', 9)) */
const hm = /OPEN_H\s*=\s*(?:hAttr\('data-open',\s*)?(\d+)\)?\s*,\s*CLOSE_H\s*=\s*(?:hAttr\('data-close',\s*)?(\d+)/.exec(MAIN_JS);
if (!hm) fail('OPEN_H/CLOSE_H nisu pronađeni u js/main.js');
function locIntro(html) {
  const main = html.slice(html.indexOf('<main'));
  const i = main.indexOf('class="locs"');
  const sec = main.slice(main.lastIndexOf('<section', i), i);
  return { heading: text(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(sec)[1]), intro: text(/<div class="shead__aside">\s*<p>([\s\S]*?)<\/p>/i.exec(sec)[1]) };
}
const liSr = locIntro(HTML.sr.contact), liEn = locIntro(HTML.en.contact);
const settings = {
  id: 1,
  hours_sr: hoursSr, hours_en: hoursEn, open_hour: +hm[1], close_hour: +hm[2],
  footer_email: footerEmail,
  company_name: text(nameDd.split(/<br\s*\/?>/i)[0]),
  company_legal_name: legal(nameDd),
  pib: text(byDt(cSr, 'PIB')), registration_no: text(byDt(cSr, 'MATIČNI BROJ')), activity_code: text(byDt(cSr, 'ŠIFRA DELATNOSTI')),
  vat_sr: vatText(vatSr), vat_en: vatText(vatEn),
  vat_certificate_path: vatLinks(vatSr)[0] || null, vat_record_path: vatLinks(vatSr)[1] || null,
  bank_name: bank.replace(bankAcc, '').trim(), bank_account: bankAcc,
  activity_sr: text(byDt(cSr, 'DELATNOST')), activity_en: text(byDt(cEn, 'BUSINESS ACTIVITY')),
  founded_sr: text(byDt(cSr, 'OSNOVANO')), founded_en: text(byDt(cEn, 'FOUNDED')),
  director: text(byDt(cSr, 'DIREKTOR')),
  facebook_url: decode(fb[1]), facebook_label: text(fb[2]),
  locations_heading_sr: liSr.heading, locations_heading_en: liEn.heading,
  locations_intro_sr: liSr.intro, locations_intro_en: liEn.intro,
};
if (text(byDt(cEn, 'TAX ID (PIB)')) !== settings.pib || text(byDt(cEn, 'MANAGING DIRECTOR')) !== settings.director) fail('podaci o firmi SR/EN se razlikuju');
for (const f of ['hours', 'vat', 'activity', 'founded', 'locations_heading', 'locations_intro']) both('kontakt', f, settings[f + '_sr'], settings[f + '_en']);

/* ==========================================================================
   SQL fajl
   ========================================================================== */
out.push(
  '-- ==========================================================================',
  '-- TRICOM — 002-existing-content.sql',
  '-- Postojeći sadržaj sajta (SR + EN) preuzet iz frontenda.',
  '-- GENERISANO: node _tools/db/build-existing-content.js — ne menjati ručno.',
  '--',
  '-- Uvoz: posle 001-schema.sql, u istu bazu, preko phpMyAdmin → Import.',
  '-- Ponovni uvoz ne radi ništa: svaka naredba proverava oznaku',
  "-- '" + IMPORT_KEY + "' u tabeli schema_imports, pa se sadržaj ne duplira",
  '-- i ne prepisuju se kasnije izmene iz administracije (ni obrisani redovi se',
  '-- ne vraćaju). Bez DROP, TRUNCATE i DELETE.',
  '-- Putanje medija su relativne od korena sajta (assets/…), bez početne kose',
  '-- crte, pa rade i u korenu domena i u podfolderu.',
  '-- ==========================================================================',
  '',
  'SET NAMES utf8mb4;',
  'START TRANSACTION;'
);

section('Kategorije proizvoda');
const categoryRow = (c) => ({ id: c.id, slug: c.slug, name_sr: c.name_sr, name_en: c.name_en, nav_label_sr: c.nav_label_sr, nav_label_en: c.nav_label_en,
  heading_sr: c.heading_sr, heading_en: c.heading_en, intro_sr: c.intro_sr, intro_en: c.intro_en, sort_order: c.id * 10, is_active: 1 });
catData.forEach((c) => insert('categories', categoryRow(c)));
catData.forEach((c) => ['name', 'nav_label', 'heading', 'intro'].forEach((f) => both('kategorija ' + c.slug, f, c[f + '_sr'], c[f + '_en'])));

section('Proizvodi');
productRows.forEach((r) => insert('products', r, null, [['categories', r.category_id, CAT_SLUGS[r.category_id - 1]]]));
section('Tehnički podaci proizvoda');
productSpecRows.forEach((r) => { const slug = productRows[r.product_id - 1].slug; insert('product_specs', r, null, [['products', r.product_id, slug]]); });
section('Prikaz proizvoda u tabovima kategorija');
placementRows.forEach((r) => {
  const { _slug, _cat, ...row } = r;
  insert('product_categories', row, ['product_id'], [['products', row.product_id, _slug], ['categories', row.category_id, _cat]]);
});

section('Usluge i mogućnosti');
serviceRows.forEach((r) => insert('services', r));
section('Tehnički podaci usluga');
serviceSpecRows.forEach((r) => insert('service_specs', r, null, [['services', r.service_id, serviceRows[r.service_id - 1].slug]]));

section('Reference');
referenceRows.forEach((r) => insert('client_references', r));

section('Galerije');
GCAT.forEach((c) => insert('gallery_categories', { id: c.id, slug: c.slug, name_sr: c.name_sr, name_en: c.name_en, sort_order: c.sort_order, is_active: 1 }));
galleryRows.forEach((r) => insert('gallery_images', r, null, [['gallery_categories', r.category_id, GCAT[r.category_id - 1].slug]]));

section('Česta pitanja');
faqRows.forEach((r) => insert('faq_items', r));

section('Kontakt');
insert('contact_settings', settings);
locationRows.forEach((r) => insert('contact_locations', r));
phoneRows.forEach((r) => { const { _slug, ...row } = r; insert('contact_phones', row, null, [['contact_locations', row.location_id, _slug]]); });

out.push('',
  "INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`)",
  "VALUES (" + q(IMPORT_KEY) + ", NOW(), 'Postojeći sadržaj frontenda')",
  'ON DUPLICATE KEY UPDATE `import_key` = `import_key`;',
  '',
  'COMMIT;',
  '');

fs.writeFileSync(OUT, out.join('\n'), 'utf8');

/* Zakrpa za bazu koja je već uvezla 002 iz faze 2 (pre ispravki iz modula
   proizvoda): dodaje kolone nav_label_* (ako ih nema) i upisuje samo vrednosti
   koje su još netaknute — izmene iz administracije se ne prepisuju. */
const patch = [
  '-- ==========================================================================',
  '-- TRICOM — patches/003-products-module.sql',
  '-- SAMO za bazu u koju su 001/002 već uvezeni u fazi 2. Nova instalacija',
  '-- uvozi samo 001-schema.sql i 002-existing-content.sql (već sadrže ovo).',
  '-- GENERISANO: node _tools/db/build-existing-content.js — ne menjati ručno.',
  '-- Bezbedno za ponavljanje: kolone se dodaju samo ako ne postoje, a vrednosti',
  '-- se upisuju samo gde je polje prazno ili još ima stari uvezeni tekst.',
  '-- Bez DROP, TRUNCATE i DELETE.',
  '-- ==========================================================================',
  '',
  'SET NAMES utf8mb4;',
  '',
  '-- 1) categories.nav_label_sr / nav_label_en (oznake u podmeniju „Proizvodi“)',
];
for (const [col, after] of [['nav_label_sr', 'name_en'], ['nav_label_en', 'nav_label_sr']]) {
  patch.push(
    "SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND COLUMN_NAME = '" + col + "');",
    "SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `categories` ADD COLUMN `" + col + "` VARCHAR(120) NULL AFTER `" + after + "`', 'DO 0');",
    'PREPARE tricom_stmt FROM @tricom_sql;', 'EXECUTE tricom_stmt;', 'DEALLOCATE PREPARE tricom_stmt;');
}
patch.push('', '-- 2) oznake podmenija za postojeće kategorije (samo gde su prazne)');
catData.forEach((c) => {
  for (const l of ['sr', 'en']) {
    patch.push('UPDATE `categories` SET `nav_label_' + l + '` = ' + q(c['nav_label_' + l]) +
      ' WHERE `id` = ' + c.id + ' AND `slug` = ' + q(c.slug) + " AND (`nav_label_" + l + "` IS NULL OR `nav_label_" + l + "` = '');");
  }
});
patch.push('', '-- 3) naglašen tekst kartica u tabu „Alati“ (<strong>), samo ako je tekst još uvezeni');
placementRows.forEach((r) => {
  for (const l of ['sr', 'en']) {
    const v = r['card_text_' + l];
    if (v && v.includes('<strong>')) {
      patch.push('UPDATE `product_categories` SET `card_text_' + l + '` = ' + q(v) +
        ' WHERE `product_id` = ' + r.product_id + ' AND `category_id` = ' + r.category_id +
        ' AND `card_text_' + l + '` = ' + q(v.replace(/<\/?strong>/g, '')) + ';');
    }
  }
});
patch.push('',
  "INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('003-products-module', NOW(), 'Zakrpa: modul proizvoda')",
  'ON DUPLICATE KEY UPDATE `import_key` = `import_key`;', '');
fs.mkdirSync(path.join(ROOT, 'database', 'patches'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'database', 'patches', '003-products-module.sql'), patch.join('\n'), 'utf8');

/* Zakrpa za bazu uvezenu pre modula usluga i referenci: kolone icon_key
   (ako ih nema), ključevi ikona za uvezene redove (samo pri prvom pokretanju,
   pre oznake 004) i naglašen tekst kartica referenci (samo ako je još uvezeni). */
const P4 = '004-services-references';
const p4Guard = "NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '" + P4 + "')";
const patch4 = [
  '-- ==========================================================================',
  '-- TRICOM — patches/' + P4 + '.sql',
  '-- SAMO za bazu u koju su 001/002 već uvezeni pre modula usluga i referenci',
  '-- (posle 003-products-module.sql). Nova instalacija uvozi samo',
  '-- 001-schema.sql i 002-existing-content.sql (već sadrže ovo).',
  '-- GENERISANO: node _tools/db/build-existing-content.js — ne menjati ručno.',
  '-- Bezbedno za ponavljanje: kolone se dodaju samo ako ne postoje; ključevi',
  '-- ikona se upisuju samo pri prvom pokretanju (pre oznake ' + P4 + '),',
  '-- a tekst samo gde je još uvezena vrednost. Bez DROP, TRUNCATE i DELETE.',
  '-- ==========================================================================',
  '',
  'SET NAMES utf8mb4;',
  '',
  '-- 1) services.icon_key i client_references.icon_key (ikona u listi / na kartici)',
];
for (const table of ['services', 'client_references']) {
  patch4.push(
    "SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '" + table + "' AND COLUMN_NAME = 'icon_key');",
    "SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `" + table + "` ADD COLUMN `icon_key` VARCHAR(60) NULL AFTER `image_alt_en`', 'DO 0');",
    'PREPARE tricom_stmt FROM @tricom_sql;', 'EXECUTE tricom_stmt;', 'DEALLOCATE PREPARE tricom_stmt;');
}
patch4.push('', '-- 2) ikone uvezenih usluga i referenci (samo prazna polja, samo pri prvom pokretanju)');
serviceRows.concat(referenceRows.map((r) => Object.assign({ _t: 'client_references' }, r))).forEach((r) => {
  if (!r.icon_key) return;
  patch4.push('UPDATE `' + (r._t || 'services') + '` SET `icon_key` = ' + q(r.icon_key) + ' WHERE `id` = ' + r.id + ' AND `slug` = ' + q(r.slug) +
    ' AND `icon_key` IS NULL AND ' + p4Guard + ';');
});
patch4.push('', '-- 3) naglašen tekst kartica referenci (<strong>), samo ako je tekst još uvezeni');
referenceRows.forEach((r) => {
  for (const l of ['sr', 'en']) {
    const v = r['summary_' + l];
    if (v && v.includes('<strong>')) {
      patch4.push('UPDATE `client_references` SET `summary_' + l + '` = ' + q(v) + ' WHERE `id` = ' + r.id + ' AND `slug` = ' + q(r.slug) +
        ' AND `summary_' + l + '` = ' + q(v.replace(/<\/?strong>/g, '')) + ';');
    }
  }
});
patch4.push('',
  "INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('" + P4 + "', NOW(), 'Zakrpa: moduli usluga i referenci')",
  'ON DUPLICATE KEY UPDATE `import_key` = `import_key`;', '');
fs.writeFileSync(path.join(ROOT, 'database', 'patches', P4 + '.sql'), patch4.join('\n'), 'utf8');

/* Ikone sa postojećih strana (usluge: red liste; reference: kartica) — pouzdan SVG */
fs.writeFileSync(path.join(ROOT, 'app', 'data', 'icons.json'), JSON.stringify(ICONS, null, 1) + '\n', 'utf8');

/* Statični ostatak items.js koji PHP frontend čita iz fajla: grupe (kartice
   „Srodno“ koje vode na postojeće strane) i SVG ilustracije (pouzdani izvor). */
fs.mkdirSync(path.join(ROOT, 'app', 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'app', 'data', 'items-static.json'),
  JSON.stringify({ groups: ITEMS.list.filter((it) => it.kind === 'group'), illu: ITEMS.illu || {} }, null, 1) + '\n', 'utf8');

/* --fixtures=<fajl>: isti redovi kao u SQL-u, kao JSON (lokalna provera šablona) */
const fx = process.argv.find((a) => a.startsWith('--fixtures='));
if (fx) {
  const strip = (rows) => rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => !k.startsWith('_'))));
  fs.writeFileSync(fx.slice('--fixtures='.length), JSON.stringify({
    categories: catData.map(categoryRow), products: productRows, product_specs: productSpecRows,
    product_categories: strip(placementRows), services: serviceRows, service_specs: serviceSpecRows,
    client_references: referenceRows,
    gallery_categories: GCAT.map((c) => ({ id: c.id, slug: c.slug, name_sr: c.name_sr, name_en: c.name_en, sort_order: c.sort_order, is_active: 1 })),
    gallery_images: galleryRows, faq_items: faqRows,
    contact_settings: [settings], contact_locations: locationRows, contact_phones: strip(phoneRows),
  }), 'utf8');
}

/* ---------- izveštaj ---------- */
console.log('Napisano: ' + path.relative(ROOT, OUT));
console.log('Redova po tabeli:');
Object.keys(counts).forEach((t) => console.log('  ' + t.padEnd(22) + counts[t]));
console.log('FAQ početna = O nama: ' + (faqHomeNote.length ? 'NE (' + faqHomeNote.join(', ') + ')' : 'da'));
console.log('Prevodi koji nedostaju: ' + (missing.length ? '' : 'nema'));
missing.forEach((m) => console.log('  - ' + m));
