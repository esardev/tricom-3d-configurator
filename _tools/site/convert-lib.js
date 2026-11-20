/* ==========================================================================
   TRICOM — _tools/site/convert-lib.js (lokalno)
   Zajedničko za jednokratne konvertore statičnih strana u PHP poglede
   (convert-products.js, convert-services-references.js).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
/* izvorne strane su posle konverzije u _tools/source/ (snimak) */
const read = (f) => fs.readFileSync(fs.existsSync(path.join(ROOT, f)) ? path.join(ROOT, f) : path.join(ROOT, '_tools', 'source', f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s, 'utf8'); console.log('  ' + f); };
const fail = (m) => { console.error('GREŠKA: ' + m); process.exit(1); };

const VERSION = '2026-10-26';
const SITE = 'https://tricom.rs/';
const GUARD = "<?php defined('TRICOM') || exit; ?>\n";

/* element od otvarajućeg taga do zatvarajućeg (po dubini) */
function element(html, at) {
  const tag = /^<([a-z0-9]+)\b/i.exec(html.slice(at))[1];
  const rx = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi');
  rx.lastIndex = at;
  let depth = 0, m;
  while ((m = rx.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return { start: at, end: rx.lastIndex, html: html.slice(at, rx.lastIndex) };
  }
  fail('nezatvoren <' + tag + '>');
}
function at(html, needle, from = 0) {
  const i = html.indexOf(needle, from);
  if (i < 0) fail('nije pronađeno: ' + needle.slice(0, 60));
  return i;
}
/* zajedničke zamene: verzija resursa i domen */
function common(s) {
  if (s.includes('<?')) fail('izvor već sadrži <?');
  s = s.split('?v=' + VERSION).join('?v=<?= $V ?>');
  s = s.split(SITE).join('<?= $SITE ?>');
  if (s.includes('https://tricom.rs')) fail('ostala je apsolutna adresa tricom.rs bez kose crte');
  return s;
}
/* podmeni „Proizvodi“: veze na tabove (#slug) → iz baze */
function navProducts(s, hrefProducts) {
  const dd = element(s, at(s, '<div class="dropdown" id="dd-proizvodi">'));
  const ddInner = dd.html.slice(dd.html.indexOf('>') + 1, -'</div>'.length);
  if (!/^(<a href="[^"]+#[a-z0-9-]+">[^<]*<\/a>)+$/.test(ddInner)) fail('neočekivan podmeni dd-proizvodi');
  s = s.slice(0, dd.start) + '<div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, ' + JSON.stringify(hrefProducts) + ') ?></div>' + s.slice(dd.end);

  const mn = element(s, at(s, '<div class="mnav__sub" id="mnav-proizvodi">'));
  const m = /^(<div class="mnav__sub" id="mnav-proizvodi"><div>)((?:<a href="[^"]+#[a-z0-9-]+">[^<]*<\/a>)+)(<a [\s\S]*)$/.exec(mn.html);
  if (!m) fail('neočekivan mobilni podmeni');
  return s.slice(0, mn.start) + m[1] + '<?= site_nav_products($navCats, $L, ' + JSON.stringify(hrefProducts) + ') ?>' + m[3] + s.slice(mn.end);
}

/* sadržaj elementa (između otvarajućeg i zatvarajućeg taga) → PHP izraz */
function replaceInner(s, open, php) {
  const el = element(s, at(s, open));
  if (s.indexOf(open, el.end) >= 0) fail('više od jednog: ' + open);
  const tag = /^<([a-z0-9]+)/.exec(open)[1];
  return s.slice(0, el.start) + open + '<?= ' + php + ' ?></' + tag + '>' + s.slice(el.end);
}

/* zamena po regularnom izrazu sa proverom broja pogodaka */
function sub(s, rx, rep, what, min = 1, max = 1) {
  let n = 0;
  const out = s.replace(rx, (...a) => { n++; return typeof rep === 'function' ? rep(...a) : rep.replace(/\$(\d)/g, (m, k) => a[+k]); });
  if (n < min || n > max) fail(what + ': ' + n + ' pogodaka (očekivano ' + min + (max !== min ? '–' + max : '') + ')');
  return out;
}

/*
 * Kontakt podaci u zajedničkom zaglavlju, mobilnom meniju i futeru (i dugmad
 * „Pozovite …“) → iz podešavanja „Kontakt“ u bazi (app/site/contact.php).
 * Struktura ostaje ista; menjaju se samo vrednosti, a tabela kontakata u futeru
 * (broj lokacija i telefona zavisi od podešavanja) se ispisuje celа.
 * Pogled mora imati $L. $opt.header / $opt.footer = da li deo postoji.
 */
function contactChrome(s, opt = { header: true, footer: true }) {
  const C = (k) => "<?= site_c('" + k + "', $L) ?>";
  if (opt.header) {
    s = sub(s, /<a class="header__phone" href="tel:[^"]+">[^<]+<\/a>/g, '<a class="header__phone" href="tel:' + C('tel') + '">' + C('tel_html') + '</a>', 'telefon u zaglavlju');
    s = sub(s, /(<a href="tel:)[^"]+("><span class="mono">[^<]+<\/span><br><span class="big">)[^<]+(<\/span><\/a>\s*<a href="mailto:)[^"]+("><span class="mono">[^<]+<\/span><br><span class="big">)[^<]+(<\/span><\/a>\s*<p class="mono muted">)[^<]+(<br>)[^<]+(<\/p>)/g,
      (m, a, b, c, d, e2, f, g) => a + C('tel') + b + C('tel_html') + c + C('email') + d + C('email') + e2 + C('address_short') + f + C('hours') + g, 'kontakt u mobilnom meniju');
  }
  if (opt.footer) {
    s = sub(s, /(<a class="btn btn--lg btn--ghost btn--block" href="tel:)[^"]+("><svg[\s\S]*?<\/svg> )[^<]+(<\/a>\s*<p class="mono muted">)[^<]+(<\/p>)/g,
      (m, a, b, c, d) => a + C('tel') + b + C('tel_html') + c + C('hours') + d, 'dugme za poziv u futeru');
    /* društvene mreže: Facebook (ako postoji), e-pošta, telefon */
    const soc = element(s, at(s, '<div class="social u-mt-24">'));
    let h = soc.html;
    h = sub(h, /(\s*)(<a href=")https:\/\/www\.facebook\.com\/[^"]*(" target="_blank" rel="noopener"[\s\S]*?<\/a>)/g,
      (m, ws, a, b) => ws + "<?php if (site_c('fb', $L) !== ''): ?>" + a + C('fb') + b + '<?php endif; ?>', 'Facebook u futeru');
    h = sub(h, /(<a href="mailto:)[^"]+(")/g, '$1' + C('email') + '$2', 'e-pošta u futeru');
    h = sub(h, /(<a href="tel:)[^"]+(")/g, '$1' + C('tel') + '$2', 'telefon u futeru');
    s = s.slice(0, soc.start) + h + s.slice(soc.end);
    const sheet = element(s, at(s, '<dl class="fsheet">'));
    s = s.slice(0, sheet.start) + '<?= site_footer_sheet($L) ?>' + s.slice(sheet.end);
    s = sub(s, /(&middot; (?:PIB|Tax ID) )\d+(<\/span>)/g, '$1' + C('pib') + '$2', 'PIB u dnu futera');
  }
  /* dugmad „Pozovite …“ u sadržaju strane (traka sa pozivom na akciju) */
  s = sub(s, /(<a class="btn btn--lg btn--ghost" href="tel:)[^"]+(">(?:Pozovite|Call)&nbsp;)[^<]+(<\/a>)/g, '$1' + C('tel') + '$2' + C('tel_html') + '$3', 'dugme „Pozovite“', 0, 5);
  return s;
}

/* slugovi stavki iz baze (proizvodi, usluge, mogućnosti) prema izvornom js/items.js */
let dbSlugs = null;
function itemsFromDb() {
  if (!dbSlugs) {
    const vm = require('vm');
    const ctx = { window: {} };
    ctx.globalThis = ctx.window;
    vm.createContext(ctx);
    vm.runInContext(read('js/items.js'), ctx);
    const list = (ctx.window.TRICOM_ITEMS || {}).list || fail('js/items.js nije učitan');
    dbSlugs = new Set(list.filter((x) => ['product', 'service', 'capability'].includes(x.kind)).map((x) => x.slug));
  }
  return dbSlugs;
}

/*
 * Pločice sa data-item u stalnom delu strane (početna, usluge, plazma, tab
 * Krov) → <?php if (site_item_on('slug')): ?> … <?php endif; ?>: skriven ili
 * obrisan proizvod / usluga ne ostaje na strani (veza bi vodila na 404, a
 * modal se ne bi otvorio). Tekst pločica ostaje kakav je (sadržaj strane).
 */
function gateItems(s) {
  const db = itemsFromDb();
  const hits = [...s.matchAll(/<[a-z0-9]+\b[^>]*\sdata-item="([a-z0-9-]+)"[^>]*>/g)].filter((m) => db.has(m[1]));
  for (const m of hits.reverse()) {
    const el = element(s, m.index);
    s = s.slice(0, el.start) + "<?php if (site_item_on('" + m[1] + "')): ?>" + el.html + '<?php endif; ?>' + s.slice(el.end);
  }
  return s;
}

/*
 * JSON-LD sa kontakt podacima (Organization, LocalBusiness na početnoj i
 * strani kontakt) → site_contact_ld(): ostatak JSON-a ostaje, a telefoni,
 * e-pošta, Facebook, matični podaci, adrese, koordinate i radno vreme
 * postaju oznake "@@c:…" koje PHP popunjava iz podešavanja „Kontakt“.
 * Lokacije po slugu: Organization = direkcija, LocalBusiness #prodaja = prodaja.
 */
function contactLd(s) {
  const tok = (o) => {
    const id = String(o['@id'] || '');
    const c = id.endsWith('#org') ? 'org' : id.endsWith('#prodaja') ? 'prodaja' : id.endsWith('#ugrinovci') ? 'ugrinovci' : fail('nepoznat JSON-LD ' + id);
    if ('telephone' in o) o.telephone = Array.isArray(o.telephone) ? (c === 'org' ? '@@c:tels' : '@@c:loc:prodaja:tels') : (c === 'prodaja' ? '@@c:loc:prodaja:tel' : '@@c:tel');
    if ('email' in o) o.email = '@@c:email';
    if ('sameAs' in o) o.sameAs = '@@c:same_as';
    if ('taxID' in o) o.taxID = '@@c:pib';
    if ('legalName' in o) o.legalName = '@@c:legal_name';
    if (o.identifier) {
      if (o.identifier.length !== 2) fail('JSON-LD identifier');
      o.identifier[0].value = '@@c:registration_no';
      o.identifier[1].value = '@@c:activity_code';
    }
    if (o.address && o.address.streetAddress) {
      const loc = c === 'org' ? 'direkcija' : 'prodaja';
      Object.assign(o.address, { streetAddress: '@@c:loc:' + loc + ':street', addressLocality: '@@c:loc:' + loc + ':locality', postalCode: '@@c:loc:' + loc + ':postal' });
    }
    if (o.geo) o.geo = '@@c:loc:prodaja:geo';
    if (o.contactPoint) {
      if (o.contactPoint.length !== 2) fail('JSON-LD contactPoint');
      o.contactPoint.forEach((p, i) => { p.telephone = '@@c:loc:' + ['prodaja', 'direkcija'][i] + ':tel'; });
    }
    (o.openingHoursSpecification || []).forEach((h) => { h.opens = '@@c:opens'; h.closes = '@@c:closes'; });
    return o;
  };
  return sub(s, /<script type="application\/ld\+json">\n?([\s\S]*?)\n?<\/script>\n/g, (m, body) => {
    if (!body.includes('"telephone"')) return m;
    const json = tok(JSON.parse(body.split('<?= $SITE ?>').join('@@site@@')));
    const lit = "'" + JSON.stringify(json).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    return '<?= site_contact_ld(' + lit + ', $L) ?>';
  }, 'JSON-LD kontakt', 0, 10);
}

module.exports = { ROOT, read, write, fail, VERSION, SITE, GUARD, element, at, common, navProducts, sub, contactChrome, replaceInner, gateItems, contactLd };
