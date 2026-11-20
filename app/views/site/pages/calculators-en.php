<?php defined('TRICOM') || exit; ?>
<?php /* Strana „calculators“ (en). Ulaz: $navCats, $L, $V, $SITE. Generisano iz en/calculators.html. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>Trapezoidal sheet and tile-effect calculators | TRICOM</title>
<meta name="description" content="Number of sheets, covered area and weight for TR 10, TR 20, TR 35, TR 40 and tile-effect roofing sheet, cut to length.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>en/calculators.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>kalkulatori.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/calculators.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>kalkulatori.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="sr_RS">
<meta property="og:title" content="Trapezoidal sheet and tile-effect calculators | TRICOM">
<meta property="og:description" content="Number of sheets, covered area and weight for TR 10, TR 20, TR 35, TR 40 and tile-effect roofing sheet, cut to length.">
<meta property="og:url" content="<?= $SITE ?>en/calculators.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/en/configurator.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Trapezoidal sheet and tile-effect calculators | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/en/configurator.jpg">

<link rel="icon" href="../assets/favicon.svg?v=<?= $V ?>" type="image/svg+xml">
<link rel="apple-touch-icon" href="../assets/tricom-logo.png?v=<?= $V ?>">

<script>
/* Fontovi (Archivo, IBM Plex — OFL, assets/fonts): preko http(s) sa sopstvenog servera
   (css/fonts.css); preko file:// pregledač ne pušta lokalne
   fontove (CORS), pa se tada uzimaju sa Google Fonts. Preload samo za font naslova
   (Archivo); ostali stižu sa font-display: swap (rezerve podešene veličine u base.css). */
(function(d,R){var h=d.head,f=location.protocol==='file:';function l(a){var e=d.createElement('link');for(var k in a)e.setAttribute(k,a[k]);h.appendChild(e);return e}if(!f&&!/\bGecko\/\d/.test(navigator.userAgent))['archivo-latin-79dc5e'].forEach(function(x){l({rel:'preload',as:'font',type:'font/woff2',crossorigin:'',href:R+'assets/fonts/'+x+'.woff2?v=<?= $V ?>'})});l({rel:'stylesheet',href:f?'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap':R+'css/fonts.css?v=<?= $V ?>'})})(document,'../');
</script>
<noscript><link rel="stylesheet" href="../css/fonts.css?v=<?= $V ?>"></noscript>

<script>
/* Tema bez bleska: svetla je podrazumevana za sve posetioce; tamna samo ako je
   posetilac izabere prekidačem — i to samo za tekuću sesiju kartice
   (sessionStorage['tricom-theme'] === 'dark'); nova poseta počinje svetlo.
   Sistemska postavka se namerno ne prati (v. README, „Tema“). Sadržaj se crta
   odmah: fontovi su font-display: swap sa rezervama podešene veličine (base.css). */
(function(d){var r=d.documentElement,t;try{t=sessionStorage.getItem('tricom-theme');localStorage.removeItem('tricom-theme')}catch(e){}t=t==='dark'?'dark':'light';r.setAttribute('data-theme',t);var m=d.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0A0D12':'#EEF1F5')})(document);
</script>

<link rel="stylesheet" href="../css/base.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/layout.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/components.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/widgets.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/pages.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/motion.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/glass.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/kalkulator.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/print.css?v=<?= $V ?>" media="print">

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","inLanguage":"en","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"<?= $SITE ?>en/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"<?= $SITE ?>en/calculators.html"}]}
</script>
</head>
<body class="ph-1">
<svg class="shapes" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs><clipPath id="shape-a" clipPathUnits="objectBoundingBox"><path d="M0 .18C0 .136.036.1.08.1H.59C.615.1.63.095.64.075C.67.03.73 0 .8 0C.9105 0 1 .0895 1 .2C1 .279.953.351.881.383L.88.92C.88.964.844 1 .8 1H.08C.036 1 0 .964 0 .92Z"/></clipPath><clipPath id="shape-b" clipPathUnits="objectBoundingBox"><path d="M0 .08C0 .036.036 0 .08 0H.92C.964 0 1 .036 1 .08V.76C1 .804.964.84.92.84H.66C.625.84.606.852.6.875C.597.945.54 1 .47 1H.25C.178 1 .12.942.12.87C.12.852.112.84.098.84H.08C.036.84 0 .804 0 .76Z"/></clipPath><clipPath id="shape-c" clipPathUnits="objectBoundingBox"><path d="M.2 0H.52C.55 0 .555.03.56.06C.57.12.6.16.65.16C.7.16.73.12.74.06C.745.03.75 0 .78 0H.8C.91 0 1 .224 1 .5C1 .776.91 1 .8 1H.2C.09 1 0 .776 0 .5C0 .224.09 0 .2 0Z"/></clipPath></defs></svg>

<a class="skip-link" href="#main">Skip to content</a>

<div class="grain" aria-hidden="true"></div>
<div class="scrollbar-progress" aria-hidden="true"><i id="progressBar"></i></div>

<header class="site-header is-over" id="header">
  <div class="header__inner">
    <a class="brand" href="index.html" aria-label="TRICOM — home page">
      <img src="../assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
    </a>

    <nav class="nav" aria-label="Main navigation">
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="about.html">About</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="products.html">Products</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Products — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "products.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="services.html">Services</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Services — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a></div></li><li class="nav__item"><a class="nav__link" href="configurator.html">Configurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="calculators.html" aria-current="page">Calculators</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Calculators — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></li><li class="nav__item"><a class="nav__link" href="references.html">References</a></li><li class="nav__item"><a class="nav__link" href="gallery.html">Gallery</a></li><li class="nav__item"><a class="nav__link" href="contact.html">Contact</a></li></ul>
    </nav>

    <div class="langsw" role="group" aria-label="Site language"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-label="SR — Serbian version">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-current="true">EN</button></div>

    <a class="header__phone" href="tel:<?= site_c('tel', $L) ?>"><?= site_c('tel_html', $L) ?></a>

    <button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-h"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-h)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button>

    <div class="header__cta">
      <a class="btn btn--sm" href="contact.html#upit">Request a quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>

    <button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobileNav">
      <i></i><i></i><i></i>
    </button>
  </div>
</header>

<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav__inner">
    <div class="mnav__group"><a class="mnav__link" href="about.html">About</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Products<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "products.html") ?><a href="products.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge">Services<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a><a href="services.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="configurator.html">Configurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Calculators<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="references.html">References</a></div><div class="mnav__group"><a class="mnav__link" href="gallery.html">Gallery</a></div><div class="mnav__group"><a class="mnav__link" href="contact.html">Contact</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Site language"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-label="SR — Serbian version">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-current="true">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Sales</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">Email</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="contact.html#upit">Request a quote</a>
    </div>
  </div>
</div>

<section class="pagehead tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">CALCULATORS</span></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">Calculators</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">Calculators for trapezoidal sheet <span class="lt">and tile-effect roofing.</span></h1>
        <p class="lead">Enter the sheet length and the number of sheets or the roof width — you instantly get the number of sheets, covered area and a weight estimate. Add the calculation to your inquiry or print it as a specification.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2M8 18h2M12 18h4"/></svg> TR 10 · TR 20 · TR 35 · TR 40 · tile-effect</div></div>
    </div>
  </div>
</section>

<main id="main" class="calc-page">

<section class="section--tight" id="kalkulator" data-num="01" data-rail-label="Quick calculation">
  <div class="wrap">
    <div class="shead">
      <div>
        <p class="marker">Quick calculation</p>
        <h2 data-reveal="cut">How many sheets, metres and kilograms — <span class="lt">instantly.</span></h2>
      </div>
      <div class="shead__aside">
        <p>One form for all four trapezoidal profiles and a separate calculation for tile-effect roofing sheet. Sheets are cut to the length of your building, from 500 to 13,500 mm. For a complete roof with gutters and flashing, open the 3D configurator.</p>
        <nav class="calc-switch u-mt-16" aria-label="Tool"><a href="calculators.html" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/></svg><span>Quick calculator</span></a><a href="configurator.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg><span>Configurator</span></a></nav>
      </div>
    </div>
    <div class="calc-embed" data-calc-mount data-calc="tr10" data-calc-tabs="all" data-calc-hash></div>
    <noscript><p class="note">The calculator needs JavaScript. Send us your dimensions through the <a href="contact.html#upit">inquiry form</a>.</p></noscript>
    <p class="u-sm muted u-mt-16">Results are indicative. TRICOM sales will confirm exact quantities, lead time and price on receipt of your inquiry.</p>
  </div>
</section>

<section class="section--tight soft" data-num="02" data-rail-label="How we calculate">
  <div class="wrap">
    <div class="shead">
      <div>
        <p class="marker">How we calculate</p>
        <h2 data-reveal="cut">Cover width, not coil width.</h2>
      </div>
    </div>
    <div class="grid g3"><div class="infoblock calc-how__i"><h3>Number of sheets</h3><p>When you know the roof width, the number of sheets is the width divided by the cover width of the profile, rounded up. The covered width is sheets × cover width — the surplus is the difference to the roof width.</p></div><div class="infoblock calc-how__i"><h3>Area and weight</h3><p>The area is sheet length × cover width. The weight is an estimate: developed width 1,250 mm × length × sheet thickness × 7.85 kg per m² and millimetre of thickness.</p></div><div class="infoblock calc-how__i"><h3>Tile-effect roofing sheet</h3><p>Start 30 mm, tile 350 mm, end at least 20 mm; every tile step uses another 20 mm of material. The calculator suggests lengths with the standard 350 mm pitch.</p></div></div>
  </div>
</section>

</main>

<footer class="site-footer dark">
  <nav class="footer__lines wrap" aria-label="Business lines">
    <a class="fline" href="products.html"><span class="label">01</span><b>Roofing and gutter systems</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    <a class="fline" href="services.html"><span class="label">02</span><b>Metal processing</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    <a class="fline" href="products.html?group=limovi#prog"><span class="label">03</span><b>Sheet, tubes and sections</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
  </nav>

  <div class="footer__cta wrap">
    <div class="split split--60">
      <div>
        <h2 data-reveal="cut">Send a specification — get a price and lead time.</h2>
        <p class="lead">Thickness, dimensions, quantity. For plasma cutting, a DXF or DWG file or a dimensioned sketch is enough.</p>
      </div>
      <div class="stack">
        <a class="btn btn--lg btn--block" href="contact.html#upit">Request a quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <?= site_quote_phones($L) ?>
        <p class="mono muted"><?= site_c('hours', $L) ?></p>
      </div>
    </div>
  </div>

  <div class="footer__main wrap">
    <div class="footer__col footer__brand">
      <img src="../assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
      <p>Manufacture and sale of metal products and sheet-metal roofing accessories in Batajnica. A family trade since 1966.</p>
      <div class="social u-mt-24">
        <?php if (site_c('fb', $L) !== ''): ?><a href="<?= site_c('fb', $L) ?>" target="_blank" rel="noopener" aria-label="TRICOM on Facebook">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2.5h-2.5A4.5 4.5 0 0 0 10 7v3H7v3.5h3v8h3.5v-8h3l.5-3.5h-3.5V7a1 1 0 0 1 1-1H17z"/></svg>
        </a><?php endif; ?>
        <a href="mailto:<?= site_c('email', $L) ?>" aria-label="Send an email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15"/><path d="m2.5 6 9.5 7.2L21.5 6"/></svg></a>
        <a href="tel:<?= site_c('tel', $L) ?>" aria-label="Call sales"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a>
      </div>
    </div>

    <div class="footer__col">
      <h4>Services and range</h4>
      <ul>
        <li><a href="plasma-cutting.html">CNC plasma cutting</a></li>
        <li><a href="services.html#secenje">Cutting sheet and sections</a></li>
        <li><a href="services.html#savijanje">Bending and forming</a></li>
        <li><a href="products.html?group=krov#prog">Roofing and façade systems</a></li>
        <li><a href="products.html?group=oluci#prog">Gutter systems</a></li>
        <li><a href="configurator.html">3D roof configurator</a></li>
        <li><a href="calculators.html">Roofing sheet calculators</a></li>
        <li><a href="products.html?group=cevi#prog">Steel tubes and sections</a></li>
        <li><a href="products.html?group=alati#prog">Tools and equipment</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Menu</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="products.html">Products</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="configurator.html">Configurator</a></li>
        <li><a href="references.html">References</a></li>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Contact</h4>
      <?= site_footer_sheet($L) ?>
    </div>
  </div>

  <div class="footer__bottom wrap">
    <span>&copy; <span data-year>2026</span> TRICOM d.o.o., Batajnica &middot; Tax ID <?= site_c('pib', $L) ?></span>
    <span class="made">Your business partner since 1966.</span>
    <span class="credit">Website by <a href="https://apisdevelopment.com" rel="noopener" target="_blank">Apis Development</a></span>
  </div>
</footer>

<!-- Plutajuci dok: asistent dole levo, nazad na vrh dole desno, u istoj liniji -->
<div class="dock">

  <div class="u-rel">
    <div class="ai-nudge" id="aiNudge" role="status">
      A question about <b>thickness, profile or price</b>? Ask now.
      <button class="ai-nudge__x" id="aiNudgeX" type="button" aria-label="Close message">&times;</button>
    </div>
    <button class="dock-btn ai-fab" id="aiFab" type="button"
            aria-label="Open the TRICOM assistant" aria-expanded="false" aria-controls="aiPanel">
      <span class="ai-fab__dot" aria-hidden="true"></span>
      <span class="ai-fab__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 0 1 13 4a8 8 0 0 1 8 8z"/><path d="M9 11h8M9 15h5"/></svg></span>
      <span class="ai-fab__close" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></span>
    </button>
  </div>

  <button class="dock-btn totop" id="toTop" type="button" aria-label="Back to top">
    <svg class="totop__ring" viewBox="0 0 60 60" aria-hidden="true">
      <circle class="bg" cx="30" cy="30" r="27"/>
      <circle class="fg" cx="30" cy="30" r="27"/>
    </svg>
    <span class="totop__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg></span>
    <span class="totop__pct mono" id="toTopPct" aria-hidden="true">0%</span>
  </button>
</div>

<!-- Asistent: radi lokalno, bez API-ja -->
<section class="ai-panel" id="aiPanel" aria-hidden="true" inert aria-label="TRICOM assistant">
  <div class="ai-head">
    <div class="ai-head__av" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5M12 17v5M4.2 4.2l3.6 3.6M16.2 16.2l3.6 3.6M2 12h5M17 12h5M4.2 19.8l3.6-3.6M16.2 7.8l3.6-3.6"/><circle cx="12" cy="12" r="3"/></svg></div>
    <div class="ai-head__t">
      <b>TRICOM assistant</b>
      <span>instant answers &middot; works offline</span>
    </div>
    <button class="ai-head__btn" id="aiReset" type="button" aria-label="New conversation" title="New conversation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg></button>
    <button class="ai-head__btn" id="aiClose" type="button" aria-label="Close the assistant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  </div>

  <div class="ai-body" id="aiBody" role="log" aria-live="polite" aria-atomic="false"></div>
  <div class="ai-chips" id="aiChips"></div>

  <form class="ai-form" id="aiForm" autocomplete="off">
    <label class="sr-only" for="aiInput">Your question</label>
    <textarea id="aiInput" rows="1" placeholder="E.g. what sheet thickness can you cut?"></textarea>
    <button class="ai-send" id="aiSend" type="submit" aria-label="Send question"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-8 16-2-6-6-2z"/></svg></button>
  </form>
  <p class="ai-foot">The assistant answers from a database about TRICOM. For prices, stock and order status, call sales.</p>
</section>

<script src="../js/glass-dom.js?v=<?= $V ?>"></script>
<script>
/* Skripte strane kreću posle prvog crtanja (unos first-contentful-paint; tekst, slike i hero se
   crtaju odmah, LCP ne čeka JS), istim redom kao ranije (async=false); najkasnije posle 2,5 s. Kad se poslednja izvrši: html[data-ready] i događaj „tricom:ready“. */
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["../js/i18n/en.js?v=<?= $V ?>","../js/i18n/l10n.js?v=<?= $V ?>","../js/catalog.js?v=<?= $V ?>","../js/calc.js?v=<?= $V ?>","../js/calc-ui.js?v=<?= $V ?>","../js/assistant.js?v=<?= $V ?>","../js/theme.js?v=<?= $V ?>","../js/lang.js?v=<?= $V ?>","../js/main.js?v=<?= $V ?>","../js/motion.js?v=<?= $V ?>","../js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
