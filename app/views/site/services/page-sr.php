<?php defined('TRICOM') || exit; ?>
<?php /* Strana usluga (sr). Ulaz: $services, $navCats, $L, $V, $SITE. Generisano iz usluge.html. */ ?>
<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>Obrada lima — sečenje, savijanje, profilisanje | TRICOM</title>
<meta name="description" content="Plazma do 30 mm, makaze do 13 mm, slitovanje do 1260 mm, savijanje na presi 8,2 m i 200 t, profilisanje TR lima, oluka i lamperije.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>usluge.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>usluge.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/services.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>usluge.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="sr_RS">
<meta property="og:title" content="Obrada lima — sečenje, savijanje, profilisanje | TRICOM">
<meta property="og:description" content="Plazma do 30 mm, makaze do 13 mm, slitovanje do 1260 mm, savijanje na presi 8,2 m i 200 t, profilisanje TR lima, oluka i lamperije.">
<meta property="og:url" content="<?= $SITE ?>usluge.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/usluge.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Obrada lima — sečenje, savijanje, profilisanje | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/usluge.jpg">

<link rel="icon" href="assets/favicon.svg?v=<?= $V ?>" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/tricom-logo.png?v=<?= $V ?>">

<script>
/* Fontovi (Archivo, IBM Plex — OFL, assets/fonts): preko http(s) sa sopstvenog servera
   (css/fonts.css); preko file:// pregledač ne pušta lokalne
   fontove (CORS), pa se tada uzimaju sa Google Fonts. Preload samo za font naslova
   (Archivo); ostali stižu sa font-display: swap (rezerve podešene veličine u base.css). */
(function(d,R){var h=d.head,f=location.protocol==='file:';function l(a){var e=d.createElement('link');for(var k in a)e.setAttribute(k,a[k]);h.appendChild(e);return e}if(!f&&!/\bGecko\/\d/.test(navigator.userAgent))['archivo-latin-79dc5e'].forEach(function(x){l({rel:'preload',as:'font',type:'font/woff2',crossorigin:'',href:R+'assets/fonts/'+x+'.woff2?v=<?= $V ?>'})});l({rel:'stylesheet',href:f?'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap':R+'css/fonts.css?v=<?= $V ?>'})})(document,'');
</script>
<noscript><link rel="stylesheet" href="css/fonts.css?v=<?= $V ?>"></noscript>

<script>
/* Tema bez bleska: svetla je podrazumevana za sve posetioce; tamna samo ako je
   posetilac izabere prekidačem — i to samo za tekuću sesiju kartice
   (sessionStorage['tricom-theme'] === 'dark'); nova poseta počinje svetlo.
   Sistemska postavka se namerno ne prati (v. README, „Tema“). Sadržaj se crta
   odmah: fontovi su font-display: swap sa rezervama podešene veličine (base.css). */
(function(d){var r=d.documentElement,t;try{t=sessionStorage.getItem('tricom-theme');localStorage.removeItem('tricom-theme')}catch(e){}t=t==='dark'?'dark':'light';r.setAttribute('data-theme',t);var m=d.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0A0D12':'#EEF1F5')})(document);
</script>

<link rel="stylesheet" href="css/base.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/layout.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/components.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/widgets.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/pages.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/motion.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/glass.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/modal.css?v=<?= $V ?>">
<link rel="stylesheet" href="css/print.css?v=<?= $V ?>" media="print">

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Početna","item":"<?= $SITE ?>"},{"@type":"ListItem","position":2,"name":"Usluge","item":"<?= $SITE ?>usluge.html"}]}
</script>
</head>
<body class="ph-2">
<svg class="shapes" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs><clipPath id="shape-a" clipPathUnits="objectBoundingBox"><path d="M0 .18C0 .136.036.1.08.1H.59C.615.1.63.095.64.075C.67.03.73 0 .8 0C.9105 0 1 .0895 1 .2C1 .279.953.351.881.383L.88.92C.88.964.844 1 .8 1H.08C.036 1 0 .964 0 .92Z"/></clipPath><clipPath id="shape-b" clipPathUnits="objectBoundingBox"><path d="M0 .08C0 .036.036 0 .08 0H.92C.964 0 1 .036 1 .08V.76C1 .804.964.84.92.84H.66C.625.84.606.852.6.875C.597.945.54 1 .47 1H.25C.178 1 .12.942.12.87C.12.852.112.84.098.84H.08C.036.84 0 .804 0 .76Z"/></clipPath><clipPath id="shape-c" clipPathUnits="objectBoundingBox"><path d="M.2 0H.52C.55 0 .555.03.56.06C.57.12.6.16.65.16C.7.16.73.12.74.06C.745.03.75 0 .78 0H.8C.91 0 1 .224 1 .5C1 .776.91 1 .8 1H.2C.09 1 0 .776 0 .5C0 .224.09 0 .2 0Z"/></clipPath></defs></svg>

<a class="skip-link" href="#main">Preskoči na sadržaj</a>

<div class="grain" aria-hidden="true"></div>
<div class="scrollbar-progress" aria-hidden="true"><i id="progressBar"></i></div>

<header class="site-header is-over" id="header">
  <div class="header__inner">
    <a class="brand" href="index.html" aria-label="TRICOM — početna strana">
      <img src="assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
    </a>

    <nav class="nav" aria-label="Glavna navigacija">
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="o-nama.html">O nama</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="proizvodi.html">Proizvodi</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Proizvodi — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "proizvodi.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="usluge.html" aria-current="page">Usluge</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Usluge — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a></div></li><li class="nav__item"><a class="nav__link" href="konfigurator.html">Konfigurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="kalkulatori.html">Kalkulatori</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Kalkulatori — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></li><li class="nav__item"><a class="nav__link" href="reference.html">Reference</a></li><li class="nav__item"><a class="nav__link" href="galerija.html">Galerija</a></li><li class="nav__item"><a class="nav__link" href="kontakt.html">Kontakt</a></li></ul>
    </nav>

    <div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div>

    <a class="header__phone" href="tel:<?= site_c('tel', $L) ?>"><?= site_c('tel_html', $L) ?></a>

    <button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-h"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-h)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button>

    <div class="header__cta">
      <a class="btn btn--sm" href="kontakt.html#upit">Zatražite ponudu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>

    <button class="burger" id="burger" type="button" aria-label="Meni" aria-expanded="false" aria-controls="mobileNav">
      <i></i><i></i><i></i>
    </button>
  </div>
</header>

<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav__inner">
    <div class="mnav__group"><a class="mnav__link" href="o-nama.html">O nama</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Proizvodi<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "proizvodi.html") ?><a href="proizvodi.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge" data-current="true">Usluge<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a><a href="usluge.html" aria-current="page"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="konfigurator.html">Konfigurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Kalkulatori<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="reference.html">Reference</a></div><div class="mnav__group"><a class="mnav__link" href="galerija.html">Galerija</a></div><div class="mnav__group"><a class="mnav__link" href="kontakt.html">Kontakt</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Prodaja</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">E-pošta</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="kontakt.html#upit">Zatražite ponudu</a>
    </div>
  </div>
</div>

<section class="pagehead pagehead--2 tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">USLUGE</span></div>
  <div class="pagehead__media" aria-hidden="true"><div class="hero3d" data-hero3d="gutter"><div class="hero3d__still is-on" data-obj="gutter"></div></div></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Putanja"><a href="index.html">Početna</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">Usluge</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">Četrnaest usluga obrade, <span class="lt">u jednom pogonu.</span></h1>
        <p class="lead">Materijal možete kupiti u fabričkom pakovanju ili ga uzeti obrađenog — u obliku, količini i izgledu koji vam treba. Sve operacije radimo na svojim mašinama u Batajnici i Ugrinovcima.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg> 2400 m² pogona</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section--tight" data-num="01" data-rail-label="Sve usluge">
  <div class="wrap">
    <p class="sectionix">01 / 07</p>
    <div class="g-card g-card--solid svc-panel">
    <div class="slist trows"><?= site_service_rows($services, $L) ?></div>
    </div>
  </div>
</section>

<!-- ============================================ SEČENJE -->
<section class="section soft" id="secenje" data-num="02">
  <div class="wrap">
    <p class="sectionix">02 / 07</p>
    <div class="shead">
      <div>
        <p class="marker">01 — Sečenje</p>
        <h2 data-reveal="cut">Od kotura od 0,5 mm do ploče od 150 mm.</h2>
      </div>
      <div class="shead__aside">
        <p>Četiri različita postupka pokrivaju ceo raspon debljina. Koji je za vas povoljniji zavisi od materijala, debljine, tolerancije i količine — recite nam šta radite i predložićemo postupak.</p>
      </div>
    </div>

    <div class="tbl-glass svc-sheet" data-reveal>
    <div class="caps">
      <?php if (site_item_on('secenje-cnc-plazma')): ?><div data-item="secenje-cnc-plazma" class="cap"><div class="cap__t">CNC plazma</div><div class="cap__d">Složeni oblici, rupe i konture po nacrtu. Radni sto 2,5 × 8 m.</div><div class="cap__v">do 30 mm</div></div><?php endif; ?>
      <?php if (site_item_on('gasno-rezanje')): ?><div data-item="gasno-rezanje" class="cap"><div class="cap__t">Gasno rezanje</div><div class="cap__d">Debele ploče, masivni pripremci, gruba priprema.</div><div class="cap__v">do 150 mm</div></div><?php endif; ?>
      <?php if (site_item_on('secenje-makazama')): ?><div data-item="secenje-makazama" class="cap"><div class="cap__t">Hidraulične makaze</div><div class="cap__d">Ravni rezovi po tabli, formatiranje na meru.</div><div class="cap__v">do 13 mm</div></div><?php endif; ?>
      <?php if (site_item_on('secenje-makazama')): ?><div data-item="secenje-makazama" class="cap"><div class="cap__t">Makaze — prohrom</div><div class="cap__d">Inox tabla bez oštećenja površine.</div><div class="cap__v">do 9 mm</div></div><?php endif; ?>
      <?php if (site_item_on('slitovanje')): ?><div data-item="slitovanje" class="cap"><div class="cap__t">Podužno sečenje (slitovanje)</div><div class="cap__d">Kotur se seče na uzdužne trake željene širine.</div><div class="cap__v">ulaz do 1260 mm</div></div><?php endif; ?>
      <?php if (site_item_on('premotavanje-kotura')): ?><div data-item="premotavanje-kotura" class="cap"><div class="cap__t">Premotavanje kotura</div><div class="cap__d">Prepakivanje za dalju obradu, transport ili manje serije.</div><div class="cap__v">po dogovoru</div></div><?php endif; ?>
    </div>
    </div>

    <div class="split u-mt-48">
      <div class="prose">
        <h3 class="u-mt-0">Kada je koji postupak povoljniji</h3>
        <p><strong>Makaze</strong> su najbrže i najjeftinije rešenje kada su vam potrebni ravni rezovi i formatiranje table na meru. Nema toplotnog uticaja na materijal i rez je čist.</p>
        <p><strong>Plazma</strong> je nezamenljiva za sve što nije prava linija — konture, radijuse, rupe, proreze i ugnježdene delove. Pošto je kompjuterski vođena, ponovljivost u seriji je potpuna.</p>
        <p><strong>Gasno rezanje</strong> koristimo iznad debljina gde plazma više nije ekonomična — za ploče do 150 mm.</p>
        <p><strong>Slitovanje</strong> je za one koji rade sa koturom: umesto da kupujete traku fabričke širine, dobijate baš onu koja vam treba, pa nemate otpad po dužini.</p>
      </div>
      <div data-reveal="scale">
        <div class="svc-cap shape-b">
          <picture class="theme-img theme-img--light"><source srcset="assets/render/plasma-plate-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/plasma-plate-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 609px" data-orig="assets/render/plasma-plate-light.jpg?v=<?= $V ?>" alt="Čelična ploča isečena na CNC plazmi" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="assets/render/plasma-plate-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/plasma-plate-dark.jpg?v=<?= $V ?>" alt="Čelična ploča isečena na CNC plazmi" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
      </div>
    </div>
    <h3 class="u-mt-48 u-mb-16" id="masine">Mašinski park — kapaciteti po mašinama</h3>
    <p class="u-sm muted u-mb-16">Sve mašine su u Batajnici i Ugrinovcima; podaci su preneti sa dosadašnjeg sajta.</p>
    <div class="tbl-glass svc-machines"><div data-catalog="machines"></div></div>
  </div>
</section>

<!-- ============================================ SAVIJANJE -->
<section class="section" id="savijanje" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 07</p>
    <div class="shead">
      <div>
        <p class="marker">02 — Savijanje i oblikovanje</p>
        <h2 data-reveal="cut">Apkant presa od 8,2 m radi opšivke bez spoja.</h2>
      </div>
      <div class="shead__aside">
        <p>Dužina prese je ono što se u praksi najviše oseti: opšivka, okapnica ili slemena od preko osam metara izlazi iz jednog prolaza, bez poprečnog spoja koji kasnije propušta ili se vidi.</p>
      </div>
    </div>

    <div class="split split--60 u-start">
      <div data-reveal="scale">
        <div class="svc-cap svc-cap--tall shape-a">
          <picture class="theme-img theme-img--light"><source srcset="assets/render/flashing-set-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/flashing-set-light-1390w.webp?v=<?= $V ?>" srcset="assets/render/flashing-set-light-700w.webp?v=<?= $V ?> 700w, assets/render/flashing-set-light-1390w.webp?v=<?= $V ?> 1390w" sizes="(max-width: 700px) 84vw, 691px" data-orig="assets/render/flashing-set-light.jpg?v=<?= $V ?>" alt="Opšivke i okapnice od savijenog lima" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="assets/render/flashing-set-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/flashing-set-dark.jpg?v=<?= $V ?>" alt="Opšivke i okapnice od savijenog lima" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
      </div>
      <div>
        <div class="tbl-glass svc-sheet">
        <div class="caps">
          <?php if (site_item_on('savijanje-limova')): ?><div data-item="savijanje-limova" class="cap"><div class="cap__t">Apkant presa</div><div class="cap__d">Dugačke opšivke, slemena, okapnice, uvale</div><div class="cap__v">8,2 m</div></div><?php endif; ?>
          <?php if (site_item_on('savijanje-limova')): ?><div data-item="savijanje-limova" class="cap"><div class="cap__t">NC presa</div><div class="cap__d">Kraći elementi, složeniji niz krivina</div><div class="cap__v">3 m</div></div><?php endif; ?>
          <?php if (site_item_on('savijanje-limova')): ?><div data-item="savijanje-limova" class="cap"><div class="cap__t">Rundovanje</div><div class="cap__d">Cilindri, konusi, kape za dimnjake</div><div class="cap__v">po radiusu</div></div><?php endif; ?>
          <?php if (site_item_on('probijanje-i-isecanje-uglova')): ?><div data-item="probijanje-i-isecanje-uglova" class="cap"><div class="cap__t">Probijanje i isecanje uglova</div><div class="cap__d">Otvori i priprema spojeva pre savijanja</div><div class="cap__v">po nalogu</div></div><?php endif; ?>
        </div>
        </div>
        <ul class="checklist u-mt-32">
          <li>Šaljite <strong>razvijenu meru</strong> ili nacrt sa uglovima savijanja — ako imate samo gotov presek, mi ćemo izračunati razvijenu dužinu</li>
          <li>Za vidljive fasadne elemente navedite koja strana lima ide na vidnu stranu</li>
          <li>Kod plastificiranih limova zaštitna folija ostaje do ugradnje</li>
          <li><strong>NC presa 200 t</strong>: čelik do 10 mm (450 MPa), inox do 7 mm (650 MPa), dužina do 3100 mm; hladno oblikovani profili do 10 mm</li>
          <li><strong>Rundovanje</strong> (kružno savijanje): do 0,8 mm na dužini 2 m, prečnici Ø80–Ø800 mm; do 4 mm na dužini 2 m, najmanji prečnik 190 mm</li>
          <li><strong>Lučno savijanje</strong> cevi i flahova: okrugle cevi 1/2"–2", kvadratne do 50×50 mm, pravougaone do 40×60 mm (zid 2–3 mm)</li>
          <li><strong>Ispravljanje (peglanje) flahova</strong> do 10 mm, sa obaranjem ivica</li>
          <li><strong>Isecanje uglova</strong> na čeličnom limu do 4 mm, ugao 30°–140°; Iron Worker za probijanje i deformaciju</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============================================ PROFILISANJE -->
<section class="section soft" id="profilisanje" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 07</p>
    <div class="shead">
      <div>
        <p class="marker">03 — Profilisanje</p>
        <h2 data-reveal="cut">Dužina po meri objekta, a ne po meri table.</h2>
      </div>
      <div class="shead__aside">
        <p>Profilirke rade iz kotura, pa dužinu diktira vaš objekat. Za trapezni lim, oluk, vertikalu, parapet i lamperiju to znači krov ili fasadu bez poprečnih preklopa.</p>
        <p class="u-mt-16"><a class="link-kerf" href="kalkulatori.html" data-calc-link>Kalkulatori: broj tabli, površina i masa za TR lim i imitaciju crepa <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p>
      </div>
    </div>

    <div class="grid g3">
      <?php if (site_item_on('trapezni-lim')): ?><article data-item="trapezni-lim" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="assets/render/tr35-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr35-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/tr35-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/tr35-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 503px" data-orig="assets/render/tr35-light.jpg?v=<?= $V ?>" alt="Trapezni lim TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/tr35-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr35-dark.jpg?v=<?= $V ?>" alt="Trapezni lim TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Trapezni pokrivni lim</h3>
    <p>Pet profila za krov i fasadu, u pocinkovanoj i plastificiranoj izvedbi po RAL karti. Dužina se reže po meri objekta.</p>
    <div class="pcard__tags"><span class="tag">TR 10/162,5</span><span class="tag">TR 20/185</span><span class="tag">TR 35/270</span><span class="tag">TR 40/230</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('oluci-i-vertikale')): ?><article data-item="oluci-i-vertikale" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="assets/render/gutter-halfround-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/gutter-halfround-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/gutter-halfround-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/gutter-halfround-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="assets/render/gutter-halfround-light.jpg?v=<?= $V ?>" alt="Poluokrugli oluk sa držačem" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/gutter-halfround-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/gutter-halfround-dark.jpg?v=<?= $V ?>" alt="Poluokrugli oluk sa držačem" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Oluci i vertikale</h3>
    <p>Poluokrugli oluci RŠ 250–400 i četvrtasti do 8,2 m; okrugle vertikale Ø80–Ø150 i četvrtaste; poluokrugli RŠ 333 i vertikala Ø100 u neograničenoj dužini. Sa kompletnim priborom.</p>
    <div class="pcard__tags"><span class="tag">pocinkovani</span><span class="tag">bojeni</span><span class="tag">bakarni</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('imitacija-crepa')): ?><article data-item="imitacija-crepa" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="assets/render/crep-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/crep-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/crep-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/crep-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="assets/render/crep-light.jpg?v=<?= $V ?>" alt="Imitacija crepa — panel sa profilom crepa" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/crep-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/crep-dark.jpg?v=<?= $V ?>" alt="Imitacija crepa — panel sa profilom crepa" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Imitacija crepa</h3>
    <p>Panel sa profilom crepa za krovove gde se traži klasičan izgled uz prednosti čeličnog pokrivača.</p>
    <div class="pcard__tags"><span class="tag">plastificiran</span><span class="tag">RAL po izboru</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('parapetni-lim')): ?><article data-item="parapetni-lim" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="assets/render/tr20-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr20-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/tr20-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/tr20-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="assets/render/tr20-light.jpg?v=<?= $V ?>" alt="Trapezni lim TR 20/185" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/tr20-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr20-dark.jpg?v=<?= $V ?>" alt="Trapezni lim TR 20/185" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Parapetni lim</h3>
    <p>Tri profila (PR 83/34, PR 38/15, PR 71/10) od lima 0,4–2 mm, u bojenoj, pocinkovanoj i HVL izvedbi.</p>
    <div class="pcard__tags"><span class="tag">fasada</span><span class="tag">parapet</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('lamperija')): ?><article data-item="lamperija" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="assets/render/tr10-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr10-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/tr10-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/tr10-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="assets/render/tr10-light.jpg?v=<?= $V ?>" alt="Trapezni lim TR 10/162,5" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/tr10-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr10-dark.jpg?v=<?= $V ?>" alt="Trapezni lim TR 10/162,5" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Lamperija i lajsne</h3>
    <p>Metalna lamperija za plafone i oblaganje, sa pratećim lajsnama — od bojenog aluminijuma, pocinkovano bojenog, prohromskog i bakarnog lima; standardna dužina 2,5 m.</p>
    <div class="pcard__tags"><span class="tag">plafoni</span><span class="tag">oblaganje</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('gradjevinska-limarija')): ?><article data-item="gradjevinska-limarija" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="assets/render/flashing-set-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/flashing-set-light-1390w.webp?v=<?= $V ?>" srcset="assets/render/flashing-set-light-700w.webp?v=<?= $V ?> 700w, assets/render/flashing-set-light-1390w.webp?v=<?= $V ?> 1390w" sizes="(max-width: 700px) 84vw, 691px" data-orig="assets/render/flashing-set-light.jpg?v=<?= $V ?>" alt="Građevinska limarija — opšivke, okapnice i slemena" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/flashing-set-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/flashing-set-dark.jpg?v=<?= $V ?>" alt="Građevinska limarija — opšivke, okapnice i slemena" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Građevinska limarija</h3>
    <p>Uvale, iksne, veterlajsne, okapnice, opšivke, slemena, snegobrani, kape za dimnjake — po vašim merama.</p>
    <div class="pcard__tags"><span class="tag">po meri</span><span class="tag">sve vrste lima</span></div>
  </div></article><?php endif; ?>
    </div>

    <div class="u-mt-40" data-reveal>
      <div data-catalog="profiles-short"></div>
    </div>
    <p class="mono muted u-mt-16">Debljine i raspoložive boje po RAL karti proverite sa prodajom — zavise od trenutnog lagera kotura. Trapezni lim do 2,5 m (rebro 15/10/15) radimo i na hidrauličnoj presi; mere, statiku i uputstva za montažu pogledajte u <a href="proizvodi.html?grupa=krov#prog">krovnom programu</a>.</p>
    <!-- TEMP: confirm with client — stari sajt: „uslužno falcovanje na pripremljenoj konstrukciji sa našim radnicima“ protivreči odluci iz 2006. da se montaža ne radi -->
    <div class="note u-mt-24">Linija za pokrivanje po sistemu <strong>„dupli falc“</strong> (šufalc) radi table od pocinkovanog, bakarnog i plastificiranog lima za montažere; uz njih radimo i gaćaste držače (aftere) od lima po izboru. Od 2006. montažu na objektu ne radimo.</div>
  </div>
</section>

<!-- ============================================ PROFILI -->
<section class="section dark dark--deep tex-grid" id="profili" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 07</p>
    <div class="split split--60">
      <div>
        <p class="marker">04 — Profili i dorada</p>
        <h2 data-reveal="cut">Sečenje na meru i grifovanje.</h2>
        <p class="lead u-mt-24">Trakaste testere sečemo flah, ugaonike, U i I profile, cevi i pune profile na dužinu koju tražite — pa ne plaćate ostatak šipke koji vam ne treba.</p>
        <p class="u-mt-24">Trakasta testera seče pod uglom do 60°, pojedinačno ili u snopu, uz hlađenje emulzijom (motor 1,3/1,5 kW, brzina reza 38/76 m/min, list 3090×27×0,9 mm).</p>
        <p class="u-mt-24">Grifovanje je dekorativna tekstura koja se utiskuje po dužini šipkastog profila. Koristi se za kovane ograde, kapije i ogradne elemente gde se traži izgled ručno kovanog gvožđa. Držimo i gotov grifovani flah i grifovane cevi na lageru.</p>
        <div class="u-mt-32 u-acts">
          <a class="btn" href="proizvodi.html?grupa=cevi#prog">Profili i cevi u programu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <button class="btn btn--ghost" type="button" data-ask="Šta je grifovanje i koje profile grifujete?">Šta je grifovanje?</button>
        </div>
      </div>
      <div class="svc-twin" data-reveal="scale">
        <div class="svc-cap shape-a"><picture class="theme-img theme-img--light"><source srcset="assets/render/tr35-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr35-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/tr35-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/tr35-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 503px" data-orig="assets/render/tr35-light.jpg?v=<?= $V ?>" alt="Trapezni lim TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/tr35-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/tr35-dark.jpg?v=<?= $V ?>" alt="Trapezni lim TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
        <div class="svc-cap svc-cap--pill shape-c"><picture class="theme-img theme-img--light"><source srcset="assets/render/flashing-set-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/flashing-set-light-1390w.webp?v=<?= $V ?>" srcset="assets/render/flashing-set-light-700w.webp?v=<?= $V ?> 700w, assets/render/flashing-set-light-1390w.webp?v=<?= $V ?> 1390w" sizes="(max-width: 700px) 84vw, 691px" data-orig="assets/render/flashing-set-light.jpg?v=<?= $V ?>" alt="Opšivke i okapnice od savijenog lima" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/flashing-set-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/flashing-set-dark.jpg?v=<?= $V ?>" alt="Opšivke i okapnice od savijenog lima" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================ PROCES -->
<section class="section soft" id="proces" data-num="06">
  <div class="wrap">
    <p class="sectionix">06 / 07</p>
    <div class="shead shead--solo">
      <div>
        <p class="marker">Naručivanje</p>
        <h2 data-reveal="cut">Kako se posao ugovara i plaća.</h2>
        <div class="shead__aside">
          <p>Jasna pravila postoje da bi i vama i nama bilo lakše kada dođe do preuzimanja robe.</p>
        </div>
      </div>
    </div>

    <div class="process" data-reveal>
      <div class="step"><h4>Upit i specifikacija</h4><p>Debljina, dimenzija i količina su minimum za ponudu. Za plazmu pošaljite DXF, DWG, PDF ili skicu sa kotama.</p></div>
      <div class="step"><h4>Ponuda, nalog i akontacija</h4><p>Dobijate cenu i rok. Posao se definiše radnim nalogom koji potpisujete, uz akontaciju. Time je specifikacija fiksirana.</p></div>
      <div class="step"><h4>Izrada u pogonu</h4><p>Rezanje, savijanje, profilisanje ili izrada galanterije — prema nalogu.</p></div>
      <div class="step"><h4>Preuzimanje i račun</h4><p>Preuzimanje u Batajnici; za isporuku se raspitajte u prodaji. Račun je obavezan prateći dokument.</p></div>
    </div>

    <div class="grid g3 u-mt-48">
      <div class="infoblock">
        <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg> Cena i popust</h3>
        <p class="muted u-sm">Količina određuje cenu. Od jedne tone naviše moguć je popust, a za veće količine popust je veći. Za ponudu su neophodni debljina, dimenzija i količina.</p>
      </div>
      <div class="infoblock">
        <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.6 8.2-8 9-4.4-.8-8-4-8-9V6l8-3z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg> Načini plaćanja</h3>
        <p class="muted u-sm">Gotovinski preko fiskalne kase, virmanom, čekovima građana, karticama Dina / Visa / MasterCard, te bankarskim kreditom uz predračun na ime banke. Prodaja na rate se ne vrši.</p>
      </div>
      <div class="infoblock">
        <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg> Reklamacije</h3>
        <p class="muted u-sm">Za povraćaj robe obavezan je račun, a preko 500 dinara i lična karta. Reklamacija kvaliteta vrši se najkasnije 3 dana od prodaje — zamenom ili povraćajem novca.</p>
      </div>
    </div>

    <div class="note u-mt-32"><strong>Montažu ne radimo.</strong> Od 2006. godine primarna delatnost su proizvodnja i prodaja. Tako ne konkurišemo radionicama koje kod nas kupuju materijal — njima pripremamo galanteriju za ugradnju i stojimo na raspolaganju savetom.</div>
  </div>
</section>

<section class="section section--tight" data-num="07">
  <div class="wrap">
    <p class="sectionix">07 / 07</p>
    <div class="ctaband" data-reveal>
      <div>
        <h3>Ne znate koji je postupak pravi za vaš posao?</h3>
        <p>Pošaljite šta radite — materijal, debljinu i količinu — pa predlažemo postupak, cenu i rok. Savet je besplatan i zasnovan na šest decenija rada u metalu.</p>
      </div>
      <div class="ctaband__acts">
        <a class="btn btn--lg" href="kontakt.html#upit">Zatražite ponudu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <a class="btn btn--lg btn--ghost" href="tel:<?= site_c('tel', $L) ?>">Pozovite&nbsp;<?= site_c('tel_html', $L) ?></a>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="site-footer dark">
  <nav class="footer__lines wrap" aria-label="Delatnosti">
    <a class="fline" href="proizvodi.html"><span class="label">01</span><b>Krovni i olučni sistemi</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    <a class="fline" href="usluge.html"><span class="label">02</span><b>Obrada metala</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    <a class="fline" href="proizvodi.html?grupa=limovi#prog"><span class="label">03</span><b>Limovi, cevi i profili</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
  </nav>

  <div class="footer__cta wrap">
    <div class="split split--60">
      <div>
        <h2 data-reveal="cut">Pošaljite specifikaciju — dobijate ponudu i rok.</h2>
        <p class="lead">Debljina, dimenzija, količina. Za rezanje na plazmi dovoljan je DXF, DWG ili skica sa kotama.</p>
      </div>
      <div class="stack">
        <a class="btn btn--lg btn--block" href="kontakt.html#upit">Zatražite ponudu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <?= site_quote_phones($L) ?>
        <p class="mono muted"><?= site_c('hours', $L) ?></p>
      </div>
    </div>
  </div>

  <div class="footer__main wrap">
    <div class="footer__col footer__brand">
      <img src="assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
      <p>Proizvodnja i prodaja metalnih proizvoda i limarske galanterije u Batajnici. Porodični zanat od 1966. godine.</p>
      <div class="social u-mt-24">
        <?php if (site_c('fb', $L) !== ''): ?><a href="<?= site_c('fb', $L) ?>" target="_blank" rel="noopener" aria-label="TRICOM na Facebooku">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2.5h-2.5A4.5 4.5 0 0 0 10 7v3H7v3.5h3v8h3.5v-8h3l.5-3.5h-3.5V7a1 1 0 0 1 1-1H17z"/></svg>
        </a><?php endif; ?>
        <a href="mailto:<?= site_c('email', $L) ?>" aria-label="Pošaljite e-poštu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15"/><path d="m2.5 6 9.5 7.2L21.5 6"/></svg></a>
        <a href="tel:<?= site_c('tel', $L) ?>" aria-label="Pozovite prodaju"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a>
      </div>
    </div>

    <div class="footer__col">
      <h4>Usluge i program</h4>
      <ul>
        <li><a href="plazma.html">Sečenje na CNC plazmi</a></li>
        <li><a href="usluge.html#secenje">Sečenje lima i profila</a></li>
        <li><a href="usluge.html#savijanje">Savijanje i oblikovanje</a></li>
        <li><a href="proizvodi.html?grupa=krov#prog">Krovni i fasadni sistemi</a></li>
        <li><a href="proizvodi.html?grupa=oluci#prog">Olučni sistemi</a></li>
        <li><a href="konfigurator.html">3D konfigurator krova</a></li>
        <li><a href="kalkulatori.html">Kalkulatori krovnog lima</a></li>
        <li><a href="proizvodi.html?grupa=cevi#prog">Čelične cevi i profili</a></li>
        <li><a href="proizvodi.html?grupa=alati#prog">Alati i oprema</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Meni</h4>
      <ul>
        <li><a href="index.html">Početna</a></li>
        <li><a href="o-nama.html">O nama</a></li>
        <li><a href="proizvodi.html">Proizvodi</a></li>
        <li><a href="usluge.html" aria-current="page">Usluge</a></li>
        <li><a href="konfigurator.html">Konfigurator</a></li>
        <li><a href="reference.html">Reference</a></li>
        <li><a href="galerija.html">Galerija</a></li>
        <li><a href="kontakt.html">Kontakt</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Kontakt</h4>
      <?= site_footer_sheet($L) ?>
    </div>
  </div>

  <div class="footer__bottom wrap">
    <span>&copy; <span data-year>2026</span> TRICOM d.o.o., Batajnica &middot; PIB <?= site_c('pib', $L) ?></span>
    <span class="made">Vaš poslovni prijatelj od 1966.</span>
    <span class="credit">Izrada sajta: <a href="https://apisdevelopment.com" rel="noopener" target="_blank">Apis Development</a></span>
  </div>
</footer>

<!-- Plutajuci dok: asistent dole levo, nazad na vrh dole desno, u istoj liniji -->
<div class="dock">

  <div class="u-rel">
    <div class="ai-nudge" id="aiNudge" role="status">
      Pitanje o <b>debljini, profilu ili ceni</b>? Pitajte odmah.
      <button class="ai-nudge__x" id="aiNudgeX" type="button" aria-label="Zatvori poruku">&times;</button>
    </div>
    <button class="dock-btn ai-fab" id="aiFab" type="button"
            aria-label="Otvorite asistenta TRICOM-a" aria-expanded="false" aria-controls="aiPanel">
      <span class="ai-fab__dot" aria-hidden="true"></span>
      <span class="ai-fab__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 0 1 13 4a8 8 0 0 1 8 8z"/><path d="M9 11h8M9 15h5"/></svg></span>
      <span class="ai-fab__close" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></span>
    </button>
  </div>

  <button class="dock-btn totop" id="toTop" type="button" aria-label="Nazad na vrh strane">
    <svg class="totop__ring" viewBox="0 0 60 60" aria-hidden="true">
      <circle class="bg" cx="30" cy="30" r="27"/>
      <circle class="fg" cx="30" cy="30" r="27"/>
    </svg>
    <span class="totop__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg></span>
    <span class="totop__pct mono" id="toTopPct" aria-hidden="true">0%</span>
  </button>
</div>

<!-- Asistent: radi lokalno, bez API-ja -->
<section class="ai-panel" id="aiPanel" aria-hidden="true" inert aria-label="Asistent TRICOM-a">
  <div class="ai-head">
    <div class="ai-head__av" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5M12 17v5M4.2 4.2l3.6 3.6M16.2 16.2l3.6 3.6M2 12h5M17 12h5M4.2 19.8l3.6-3.6M16.2 7.8l3.6-3.6"/><circle cx="12" cy="12" r="3"/></svg></div>
    <div class="ai-head__t">
      <b>TRICOM asistent</b>
      <span>odgovara odmah &middot; radi bez interneta</span>
    </div>
    <button class="ai-head__btn" id="aiReset" type="button" aria-label="Novi razgovor" title="Novi razgovor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg></button>
    <button class="ai-head__btn" id="aiClose" type="button" aria-label="Zatvori asistenta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  </div>

  <div class="ai-body" id="aiBody" role="log" aria-live="polite" aria-atomic="false"></div>
  <div class="ai-chips" id="aiChips"></div>

  <form class="ai-form" id="aiForm" autocomplete="off">
    <label class="sr-only" for="aiInput">Vaše pitanje</label>
    <textarea id="aiInput" rows="1" placeholder="Npr. do koje debljine sečete lim?"></textarea>
    <button class="ai-send" id="aiSend" type="submit" aria-label="Pošalji pitanje"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-8 16-2-6-6-2z"/></svg></button>
  </form>
  <p class="ai-foot">Asistent odgovara iz baze podataka o TRICOM-u. Za cene, lager i status narudžbine pozovite prodaju.</p>
</section>

<script src="js/glass-dom.js?v=<?= $V ?>"></script>
<script>
/* Skripte strane kreću posle prvog crtanja (unos first-contentful-paint; tekst, slike i hero se
   crtaju odmah, LCP ne čeka JS), istim redom kao ranije (async=false); najkasnije posle 2,5 s. Kad se poslednja izvrši: html[data-ready] i događaj „tricom:ready“. */
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["js/i18n/sr.js?v=<?= $V ?>","js/i18n/l10n.js?v=<?= $V ?>","js/catalog.js?v=<?= $V ?>","js/catalog-render.js?v=<?= $V ?>","js/assistant.js?v=<?= $V ?>","js/theme.js?v=<?= $V ?>","js/lang.js?v=<?= $V ?>","js/metal-env.js?v=<?= $V ?>","js/hero3d.js?v=<?= $V ?>","js/main.js?v=<?= $V ?>","js/items.js?v=<?= $V ?>","js/modal.js?v=<?= $V ?>","js/motion.js?v=<?= $V ?>","js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
