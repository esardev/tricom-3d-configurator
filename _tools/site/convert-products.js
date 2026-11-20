#!/usr/bin/env node
/* ==========================================================================
   TRICOM — _tools/site/convert-products.js (jednokratno, lokalno)
   Pretvara gotov statični markup u PHP poglede modula proizvoda, tako da
   dizajn, klase i skripte ostanu bajt-za-bajt isti, a samo delovi koji
   dolaze iz baze postanu PHP:

     proizvodi.html, en/products.html
       → app/views/site/products/page-{sr,en}.php
         (tabovi, podmeni „Proizvodi“, paneli kategorija)
       → app/views/site/products/panel-{sr,en}-<slug>.php
         (statični sadržaj postojećih tabova; naslov, uvod i kartice iz baze)
     detalji/tr-35-270.html, en/details/tr-35-270.html
       → app/views/site/detail/{sr,en}-{head,top,bottom,tail}.php
         (zaglavlje, meni, futer i skripte strane detalja)

   Pokrenuto jednom pri izradi modula; izvorne .html strane su posle toga
   uklonjene (PHP pogledi su jedini izvor).
   ========================================================================== */
'use strict';
const { read, write, fail, GUARD, element, at, common, navProducts, contactChrome, gateItems } = require('./convert-lib');

/* ---------------------------------------------------------------- strana proizvoda */
function convertProducts(lang, file, hrefProducts) {
  let s = common(read(file));
  const tabs = element(s, at(s, '<div class="tabs" data-tabs id="prog">'));
  const nav = element(tabs.html, at(tabs.html, '<div class="tabs__nav"'));
  const ink = '<span class="tabs__ink" aria-hidden="true"></span>';
  if (!nav.html.endsWith(ink + '</div>')) fail('tabs__ink');
  const navOpen = /^<div class="tabs__nav"[^>]*>/.exec(nav.html)[0];

  /* paneli */
  const panels = [];
  let p = nav.end;
  while (tabs.html.startsWith('<div class="tabs__panel"', p)) {
    const el = element(tabs.html, p);
    const slug = /id="prog-p-([a-z0-9-]+)"/.exec(el.html)[1];
    const inner = el.html.slice(el.html.indexOf('>') + 1, -'</div>'.length);
    panels.push({ slug, inner });
    p = el.end;
  }
  if (tabs.html.slice(p) !== '</div>' || panels.length !== 6) fail('struktura tabova (' + panels.length + ')');

  panels.forEach(({ slug, inner }) => {
    let v = inner;
    /* naslov (prvi h3) i uvod (prvi p.lead) */
    v = v.replace(/<h3>([^<]+)<\/h3>/, '<h3><?= e(field($cat, \'heading\', $L)) ?></h3>');
    v = v.replace(/(<p class="lead[^"]*">)([^<]+)(<\/p>)/, '$1<?= e(field($cat, \'intro\', $L)) ?>$3');
    if (!v.includes("field($cat, 'heading'") || !v.includes("field($cat, 'intro'")) fail('naslov/uvod taba ' + slug);
    /* kartice (bez lineup-a .lu) → jedan poziv */
    const cards = [...v.matchAll(/<(article|div)\b[^>]*\sdata-item="([^"]+)"[^>]*class="([a-z_]+)[^"]*"[^>]*>/g)]
      .filter((m) => m[3] !== 'lu');
    if (cards.length) {
      const first = cards[0].index;
      const last = element(v, cards[cards.length - 1].index).end;
      const style = { pcard: 'pcard', prog__i: 'prog', card: 'card' }[cards[0][3]] || fail('stil kartice ' + cards[0][3]);
      /* između kartica sme biti samo razmak */
      let q = first;
      cards.forEach((c) => { if (v.slice(q, c.index).trim() !== '') fail('sadržaj između kartica u ' + slug); q = element(v, c.index).end; });
      v = v.slice(0, first) + '<?= site_product_cards($items, ' + JSON.stringify(style) + ', $L) ?>' + v.slice(last);
    }
    v = gateItems(v);   /* npr. lineup TR profila u tabu Krov */
    write('app/views/site/products/panel-' + lang + '-' + slug + '.php',
      GUARD + '<?php /* Tab „' + slug + '“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE */ ?>\n' + v);
  });

  s = s.slice(0, tabs.start) + '<div class="tabs" data-tabs id="prog">' + navOpen +
    '<?= site_products_tab_buttons($cats, $L) ?>' + ink + '</div>' +
    '<?= site_products_panels($cats, $L) ?>' + '</div>' + s.slice(tabs.end);
  s = navProducts(s, hrefProducts);
  s = contactChrome(s);
  write('app/views/site/products/page-' + lang + '.php',
    GUARD + '<?php /* Strana proizvoda (' + lang + '). Ulaz: $cats, $navCats, $L, $V, $SITE. Generisano iz ' + file + '. */ ?>\n' + s);
}

/* ---------------------------------------------------------------- delovi strane detalja */
function convertDetail(lang, file, hrefProducts) {
  const s = common(read(file));
  const head = s.slice(at(s, '<link rel="icon"'), at(s, '<script type="application/ld+json">'));
  const bodyOpen = at(s, '<body class="ph-2">\n') + '<body class="ph-2">\n'.length;
  let top = s.slice(bodyOpen, at(s, '<section class="pagehead'));
  let bottom = s.slice(at(s, '<footer'), at(s, '<script data-items-inline>'));
  const tailStart = at(s, '<script src="' + (lang === 'en' ? '../../' : '../') + 'js/glass-dom.js');
  let tail = s.slice(tailStart, at(s, '</body>'));

  /* kalkulator.css samo na stranama sa kalkulatorom (izvor je strana sa kalkulatorom) */
  const kcss = '<link rel="stylesheet" href="' + (lang === 'en' ? '../../' : '../') + 'css/kalkulator.css?v=<?= $V ?>">\n';
  if (!head.includes(kcss)) fail('kalkulator.css u zaglavlju');
  const headOut = head.replace(kcss, "<?php if ($d['calc']): ?>\n" + kcss + '<?php endif; ?>\n');
  top = contactChrome(navProducts(top, hrefProducts), { header: true, footer: false });
  bottom = contactChrome(bottom, { header: false, footer: true });
  /* futer strana detalja nosi aria-current na „Usluge“ (prenet iz usluge.html) — ovde ne važi */
  const cur = lang === 'en' ? 'services.html" aria-current="page"' : 'usluge.html" aria-current="page"';
  if (!bottom.includes(cur)) fail('aria-current u futeru (' + lang + ')');
  bottom = bottom.replace(cur, cur.replace(' aria-current="page"', ''));
  /* lista skripti → iz šablona (kalkulator dodaje svoje) */
  const list = /\(document,(\[[^\]]*\])\)/.exec(tail);
  if (!list) fail('lista skripti');
  tail = tail.replace(list[1], '<?= $scriptList ?>');

  const dir = 'app/views/site/detail/';
  write(dir + lang + '-head.php', GUARD + headOut);
  write(dir + lang + '-top.php', GUARD + top);
  write(dir + lang + '-bottom.php', GUARD + bottom);
  write(dir + lang + '-tail.php', GUARD + tail);
}

console.log('Pisano:');
convertProducts('sr', 'proizvodi.html', 'proizvodi.html');
convertProducts('en', 'en/products.html', 'products.html');
convertDetail('sr', 'detalji/tr-35-270.html', '../proizvodi.html');
convertDetail('en', 'en/details/tr-35-270.html', '../products.html');
