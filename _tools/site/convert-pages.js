#!/usr/bin/env node
/* ==========================================================================
   TRICOM — _tools/site/convert-pages.js (jednokratno, lokalno)
   Pretvara preostale statične strane sa zajedničkim zaglavljem i futerom u
   PHP poglede app/views/site/pages/<strana>-{sr,en}.php. Svuda iz baze dolaze
   kontakt podaci u zaglavlju, mobilnom meniju i futeru (contactChrome) i
   podmeni „Proizvodi“; po strani još:

     index / en/index       — česta pitanja (harmonika #faq + FAQPage JSON-LD),
                              kontakt u JSON-LD (Organization, LocalBusiness)
     o-nama / about         — česta pitanja (harmonika #faq2 + FAQPage JSON-LD)
     galerija / gallery     — filteri i pločice galerije
     kontakt / contact      — podaci o lokacijama i firmi, mape, adresa forme,
                              kontakt u JSON-LD (LocalBusiness)
     404                    — <base> po putanji instalacije

   Pločice sa data-item (proizvodi, usluge) na početnoj i plazmi prikazuju se
   samo dok je stavka aktivna (gateItems). kalkulatori dobijaju samo zajedničke
   delove. konfigurator nema podmeni ni kontakte: dobija samo domen i verziju
   resursa (common), logika alata se ne menja.
   Pokrenuto jednom; izvorne .html strane su posle toga uklonjene (snimak je
   u _tools/source/).
   ========================================================================== */
'use strict';
const { read, write, fail, GUARD, at, element, common, navProducts, sub, contactChrome, replaceInner, gateItems, contactLd } = require('./convert-lib');

const PAGES = [
  // [ime pogleda, SR fajl, EN fajl]
  ['home', 'index.html', 'en/index.html'],
  ['about', 'o-nama.html', 'en/about.html'],
  ['gallery', 'galerija.html', 'en/gallery.html'],
  ['contact', 'kontakt.html', 'en/contact.html'],
  ['plasma', 'plazma.html', 'en/plasma-cutting.html'],
  ['calculators', 'kalkulatori.html', 'en/calculators.html'],
  ['404', '404.html', 'en/404.html'],
  ['configurator', 'konfigurator.html', 'en/configurator.html'],
];

const faqLd = (s) => sub(s, /<script type="application\/ld\+json">\n\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[^\n]*\n<\/script>\n/g, '<?= site_faq_jsonld($faq, $L) ?>', 'FAQPage JSON-LD');

const SPECIFIC = {
  home(s) {
    s = contactLd(faqLd(s));
    s = replaceInner(s, '<div class="acc" data-acc="single" id="faq">', "site_faq_items($faq, $L, 'faq')");
    return gateItems(s);
  },
  about(s) {
    return replaceInner(faqLd(s), '<div class="acc" data-acc="single" id="faq2">', 'site_faq_items($faq, $L)');
  },
  plasma(s) {
    return gateItems(s);
  },
  gallery(s) {
    s = sub(s, /(<button class="tabs__btn" role="tab" type="button" data-filter="all" aria-selected="true">[^<]+<\/button>)(?:<button class="tabs__btn" role="tab" type="button" data-filter="[a-z0-9-]+" aria-selected="false">[^<]*<\/button>)+(<span class="tabs__ink")/g,
      '$1<?= site_gallery_filters($gallery, $L) ?>$2', 'filteri galerije');
    return replaceInner(s, '<div class="gallery u-mt-32">', 'site_gallery_items($gallery, $L)');
  },
  contact(s) {
    s = sub(s, /(<div class="badge"><svg[^>]*><circle cx="12" cy="12" r="9"\/><path d="M12 7v5l3\.5 2"\/><\/svg> )[^<]+(<\/div>)/g, "$1<?= site_c('hours', $L) ?>$2", 'radno vreme u naslovu');
    /* blok „PODACI“ (lokacije sa telefonima i e-poštom, podaci o firmi) */
    const k = at(s, '<div class="sticky">', at(s, '<!-- PODACI -->'));
    const box = element(s, k);
    s = s.slice(0, k) + '<div class="sticky"><?= site_contact_blocks($L) ?></div>' + s.slice(box.end);
    /* naslov i uvod odeljka „Lokacije“ */
    const i = s.search(/<p class="marker">(?:Lokacije|Locations)<\/p>/);
    if (i < 0) fail('odeljak Lokacije');
    const j = at(s, '<div class="locs">', i);
    let part = s.slice(i, j);
    part = sub(part, /(<h2 data-reveal="cut">)[^<]+(<\/h2>)/g, "$1<?= site_c('locations_heading', $L) ?>$2", 'naslov lokacija');
    part = sub(part, /(<div class="shead__aside">\s*<p>)[^<]+(<\/p>)/g, "$1<?= site_c('locations_intro', $L) ?>$2", 'uvod lokacija');
    s = s.slice(0, i) + part + s.slice(j);
    s = replaceInner(s, '<div class="locs">', 'site_contact_locs($L)');
    s = contactLd(s);
    /* forma ostaje mailto (js/main.js), adresa primaoca iz podešavanja */
    return sub(s, /<form data-validate novalidate>/g, "<form data-validate novalidate data-mailto=\"<?= site_c('email', $L) ?>\">", 'forma upita');
  },
  '404'(s, lang) {
    return sub(s, /<base href="\/(en\/)?">/g, '<base href="<?= e(base_path()) ?>' + (lang === 'en' ? 'en/' : '') + '">', '<base> na 404');
  },
};

const INPUT = { home: ', $faq', about: ', $faq', gallery: ', $gallery' };

console.log('Pisano:');
for (const [name, sr, en] of PAGES) {
  for (const [lang, file] of [['sr', sr], ['en', en]]) {
    let s = common(read(file));
    if (name !== 'configurator') {
      s = navProducts(s, lang === 'en' ? 'products.html' : 'proizvodi.html');
      s = contactChrome(s);
    }
    if (SPECIFIC[name]) s = SPECIFIC[name](s, lang);
    const input = name === 'configurator' ? '$L, $V, $SITE' : '$navCats, $L, $V, $SITE' + (INPUT[name] || '');
    write('app/views/site/pages/' + name + '-' + lang + '.php',
      GUARD + '<?php /* Strana „' + name + '“ (' + lang + '). Ulaz: ' + input + '. Generisano iz ' + file + '. */ ?>\n' + s);
  }
}
