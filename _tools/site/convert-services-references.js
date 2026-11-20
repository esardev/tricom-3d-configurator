#!/usr/bin/env node
/* ==========================================================================
   TRICOM — _tools/site/convert-services-references.js (jednokratno, lokalno)
   Pretvara gotove statične strane modula usluga i referenci u PHP poglede;
   dizajn, klase i skripte ostaju isti, a PHP postaju samo delovi iz baze:

     usluge.html, en/services.html
       → app/views/site/services/page-{sr,en}.php
         (lista „Sve usluge“, podmeni „Proizvodi“)
     reference.html, en/references.html
       → app/views/site/references/page-{sr,en}.php
         (vrste zahtevnosti, vrste radova, lista objekata, podmeni „Proizvodi“)

   Strane detalja usluga koriste šablon strane detalja proizvoda
   (app/views/site/detail/), pa ovde nemaju svoje delove.
   Pokrenuto jednom pri izradi modula; izvorne .html strane su posle toga
   uklonjene (snimak je u _tools/source/).
   ========================================================================== */
'use strict';
const { read, write, fail, GUARD, element, at, common, navProducts, contactChrome, replaceInner, gateItems } = require('./convert-lib');

function convertServices(lang, file, hrefProducts) {
  let s = common(read(file));
  s = replaceInner(s, '<div class="slist trows">', 'site_service_rows($services, $L)');
  s = gateItems(contactChrome(navProducts(s, hrefProducts)));   /* pločice mašina, kartice profilisanja */
  write('app/views/site/services/page-' + lang + '.php',
    GUARD + '<?php /* Strana usluga (' + lang + '). Ulaz: $services, $navCats, $L, $V, $SITE. Generisano iz ' + file + '. */ ?>\n' + s);
}

function convertReferences(lang, file, hrefProducts) {
  let s = common(read(file));
  s = replaceInner(s, '<div class="grid g3">', "site_reference_cards($refs['demand'], 'demand', $L)");
  s = replaceInner(s, '<div class="grid g3 u-mb-40">', "site_reference_cards($refs['scope'], 'scope', $L)");
  s = replaceInner(s, '<div class="reflist">', "site_reference_cards($refs['project'], 'project', $L)");
  s = contactChrome(navProducts(s, hrefProducts));
  write('app/views/site/references/page-' + lang + '.php',
    GUARD + '<?php /* Strana referenci (' + lang + '). Ulaz: $refs (po vrsti), $navCats, $L, $V, $SITE. Generisano iz ' + file + '. */ ?>\n' + s);
}

console.log('Pisano:');
convertServices('sr', 'usluge.html', 'proizvodi.html');
convertServices('en', 'en/services.html', 'products.html');
convertReferences('sr', 'reference.html', 'proizvodi.html');
convertReferences('en', 'en/references.html', 'products.html');
