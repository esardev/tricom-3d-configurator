<?php defined('TRICOM') || exit; ?>
<?php /* Strana „home“ (en). Ulaz: $navCats, $L, $V, $SITE, $faq. Generisano iz en/index.html. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>TRICOM Batajnica — Gutter systems, sheet metal and metalworking</title>
<meta name="description" content="Metal products from Batajnica since 1966: CNC plasma to 30 mm, oxy-fuel to 150 mm, trapezoidal sheet, made-to-measure gutters, tubes, sections and tools.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>en/">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="sr_RS">
<meta property="og:title" content="TRICOM Batajnica — Gutter systems, sheet metal and metalworking">
<meta property="og:description" content="Metal products from Batajnica since 1966: CNC plasma to 30 mm, oxy-fuel to 150 mm, trapezoidal sheet, made-to-measure gutters, tubes, sections and tools.">
<meta property="og:url" content="<?= $SITE ?>en/">
<meta property="og:image" content="<?= $SITE ?>assets/og/en/index.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="TRICOM Batajnica — Gutter systems, sheet metal and metalworking">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/en/index.jpg">

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
<link rel="stylesheet" href="../css/modal.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/print.css?v=<?= $V ?>" media="print">

<?= site_contact_ld('{"@context":"https://schema.org","@type":"Organization","inLanguage":"en","@id":"@@site@@#org","name":"TRICOM d.o.o.","alternateName":"TRICOM","url":"@@site@@","logo":"@@site@@assets/tricom-logo.png","foundingDate":"1966","taxID":"@@c:pib","legalName":"@@c:legal_name","identifier":[{"@type":"PropertyValue","propertyID":"Company registration number","value":"@@c:registration_no"},{"@type":"PropertyValue","propertyID":"Activity code","value":"@@c:activity_code"}],"telephone":"@@c:tels","description":"Manufacture and sale of metal products and sheet-metal roofing accessories. Sheet cutting on CNC plasma up to 30 mm and oxy-fuel cutting up to 150 mm, bending, roll forming, trapezoidal profiled sheets, gutters, tubes and steel sections.","email":"@@c:email","sameAs":"@@c:same_as","address":{"@type":"PostalAddress","streetAddress":"@@c:loc:direkcija:street","addressLocality":"@@c:loc:direkcija:locality","postalCode":"@@c:loc:direkcija:postal","addressCountry":"RS"},"contactPoint":[{"@type":"ContactPoint","telephone":"@@c:loc:prodaja:tel","contactType":"sales","areaServed":"RS","availableLanguage":["sr"]},{"@type":"ContactPoint","telephone":"@@c:loc:direkcija:tel","contactType":"head office","areaServed":"RS","availableLanguage":["sr"]}]}', $L) ?><?= site_contact_ld('{"@context":"https://schema.org","@type":"LocalBusiness","inLanguage":"en","@id":"@@site@@#prodaja","name":"TRICOM d.o.o. — manufacturing and sales","parentOrganization":{"@id":"@@site@@#org"},"image":"@@site@@assets/tricom-logo.png","telephone":"@@c:loc:prodaja:tel","email":"@@c:email","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"@@c:loc:prodaja:street","addressLocality":"@@c:loc:prodaja:locality","postalCode":"@@c:loc:prodaja:postal","addressCountry":"RS"},"geo":"@@c:loc:prodaja:geo","openingHoursSpecification":"@@c:hours_spec"}', $L) ?><?= site_faq_jsonld($faq, $L) ?><?= site_contact_ld('{"@context":"https://schema.org","@type":"LocalBusiness","inLanguage":"en","@id":"@@site@@#prodaja","name":"TRICOM d.o.o. — manufacturing and sales, Batajnica","parentOrganization":{"@id":"@@site@@#org"},"image":"@@site@@assets/og/kontakt.jpg","telephone":"@@c:loc:prodaja:tels","email":"@@c:email","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"@@c:loc:prodaja:street","addressLocality":"@@c:loc:prodaja:locality","postalCode":"@@c:loc:prodaja:postal","addressCountry":"RS"},"geo":"@@c:loc:prodaja:geo","openingHoursSpecification":"@@c:hours_spec"}', $L) ?><?= site_contact_ld('{"@context":"https://schema.org","@type":"LocalBusiness","inLanguage":"en","@id":"@@site@@#ugrinovci","name":"TRICOM d.o.o. — production hall and central warehouse, Ugrinovci","parentOrganization":{"@id":"@@site@@#org"},"image":"@@site@@assets/old/foto/hala-ugrinovci.jpg","telephone":"@@c:tel","email":"@@c:email","address":{"@type":"PostalAddress","addressLocality":"Ugrinovci, Zemun, Belgrade","addressCountry":"RS"},"openingHoursSpecification":"@@c:hours_spec"}', $L) ?></head>
<body class="ph-2">
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="about.html">About</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="products.html">Products</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Products — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "products.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="services.html">Services</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Services — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a></div></li><li class="nav__item"><a class="nav__link" href="configurator.html">Configurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="calculators.html">Calculators</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Calculators — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></li><li class="nav__item"><a class="nav__link" href="references.html">References</a></li><li class="nav__item"><a class="nav__link" href="gallery.html">Gallery</a></li><li class="nav__item"><a class="nav__link" href="contact.html">Contact</a></li></ul>
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

<main id="main">

<!-- ================================================== HERO
     Tri ekrana na čistoj podlozi strane (bez fotografije): uska staklena
     ploča sa tekstom ekrana levo, 3D objekat ekrana desno, mono blok gore
     levo, pejdžer i strelice. v. README, „Hero“. -->
<section class="hero is-boot" id="hero" aria-labelledby="heroTitle" aria-roledescription="slider" data-rail-label="Home" data-i="0">
  <div class="hero__ghost" aria-hidden="true"><span>TRICOM</span></div>

  <div class="hero__in wrap">
    <div class="hero__copy" id="heroSlider" tabindex="0" role="group" aria-roledescription="slider" aria-label="TRICOM's three business lines" aria-live="off">
      <article class="hero__slide is-active is-first" aria-roledescription="slide" aria-label="01 / 03">
        <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span><span class="hero__ix">01 / 03</span> Roofing and gutter systems</p>
        <h1 class="hero__title" id="heroTitle"><span class="ln"><span>From sheet</span></span> <span class="ln"><span>to finished</span></span> <span class="ln lt"><span>part.</span></span></h1>
        <p class="hero__sub">We cut, bend and roll-form sheet metal, and we also stock a complete range of sheet, sections, tubes and tools — so sheet-metal workers, metal fabricators and contractors find everything in one place.</p>
        <a class="btn btn--ghost hero__cta" href="products.html">Product range <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
      <article class="hero__slide" aria-roledescription="slide" aria-label="02 / 03" aria-hidden="true">
        <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span><span class="hero__ix">02 / 03</span> Metal processing</p>
        <h2 class="hero__title"><span class="ln"><span>We cut</span></span> <span class="ln"><span>up to 150 mm</span></span> <span class="ln lt"><span>precisely.</span></span></h2>
        <p class="hero__sub">You can buy material in factory packaging or take it processed — in the shape, quantity and finish you need. We do every operation on our own machines in Batajnica and Ugrinovci.</p>
        <a class="btn btn--ghost hero__cta" href="services.html" tabindex="-1">View services <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
      <article class="hero__slide" aria-roledescription="slide" aria-label="03 / 03" aria-hidden="true">
        <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span><span class="hero__ix">03 / 03</span> Sheet, tubes and sections</p>
        <h2 class="hero__title"><span class="ln"><span>Everything for</span></span> <span class="ln"><span>sheet-metal work</span></span> <span class="ln lt"><span>in one place.</span></span></h2>
        <p class="hero__sub">Basic material for every sheet-metal job. We stock galvanised, aluminium, copper, black hot- and cold-rolled, pre-painted (RAL colour chart) and stainless steel sheet.</p>
        <a class="btn btn--ghost hero__cta" href="products.html?group=limovi#prog" tabindex="-1">Open the range <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
    </div>

    <div class="hero__obj" aria-hidden="true">
      <div class="hero3d" id="hero3d" data-hero3d="sheet cutplate stack" data-bed
        data-kote-sheet="cover:1,080 mm;rib:35 mm" data-kote-still-sheet="1200x840;cover:0.1708,0.5035,0.3976,0.6861,0.1174,0.5246,0.3394,0.7171;rib:0.4153,0.6816,0.4234,0.7069,0.4754,0.7292,0.4755,0.7489"
        data-kote-cutplate="len:1250 mm;wid:800 mm" data-kote-still-cutplate="1200x840;len:0.2835,0.4525,0.6069,0.618,0.1116,0.52,0.374,0.7477;wid:0.7385,0.5267,0.4858,0.6128,0.7989,0.5595,0.5871,0.6839" data-kote-note-cutplate="Model dimensions"
        data-kote-stack="len:1250 mm;h:90 mm" data-kote-still-stack="1200x840;len:0.2896,0.4147,0.5698,0.5975,0.1089,0.4826,0.3729,0.7026;h:0.2881,0.3753,0.2897,0.4151,0.2604,0.3581,0.2621,0.3972" data-kote-note-stack="Model dimensions">
        <div class="hero3d__still is-on" data-obj="sheet"></div>
        <div class="hero3d__still" data-obj="cutplate"></div>
        <div class="hero3d__still" data-obj="stack"></div>
      </div>
    </div>

    <p class="hero__scroll" aria-hidden="true"><i></i><span>Scroll</span><svg viewBox="0 0 10 10"><path d="M2 3.75 5 6.75 8 3.75"/></svg></p>

    <div class="hero__pager" role="group" aria-label="Choose a business line">
      <span class="hero__pg-n is-cur" aria-hidden="true">01</span>
      <div class="hero__pg-track">
        <button class="hero__pg" type="button" aria-current="true" aria-label="01 — Roofing and gutter systems"></button>
        <button class="hero__pg" type="button" aria-current="false" aria-label="02 — Metal processing"></button>
        <button class="hero__pg" type="button" aria-current="false" aria-label="03 — Sheet, tubes and sections"></button>
        <i class="hero__pg-bar" aria-hidden="true"></i>
      </div>
      <span class="hero__pg-n" aria-hidden="true">03</span>
    </div>
  </div>

  <button class="hero__arrow hero__arrow--prev" type="button" aria-label="Previous business line" aria-controls="heroSlider"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
  <button class="hero__arrow hero__arrow--next" type="button" aria-label="Next business line" aria-controls="heroSlider"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
</section>

<!-- ================================================== PROGRAM -->
<section class="section soft" data-num="01">
  <div class="wrap">
    <p class="sectionix">01 / 06</p>
    <div class="shead">
      <div>
        <p class="marker">Our products</p>
        <h2 data-reveal="cut">Complete <span class="u-accent">material</span> for sheet-metal and metal fabrication work.</h2>
      </div>
      <div class="shead__aside">
        <p>Six product groups cover everything a workshop uses — from sheet and coil to screws and grinding discs. Check dimensions and stock availability with sales.</p>
        <a class="link-kerf u-mt-16" href="products.html">Full range <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
    </div>

    <?= site_home_groups($navCats, $L) ?>

  </div>
</section>

<!-- ================================================== TRI NAČINA -->
<section class="section soft tex-grid pin" data-pin-steps="3" data-num="02">
  <div class="pin__stick">
  <div class="wrap u-rel">
    <p class="sectionix">02 / 06</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">Our services</p>
        <h2 data-reveal="cut">Three ways we can work for you.</h2>
        <div class="shead__aside">
          <p>The idea is simple: you get the material at the stage that suits you. From sheet in factory packaging, through processing to your dimensions, to a finished product ready for installation.</p>
        </div>
      </div>
      <div class="shead__media"><figure class="ph-frame ph-frame--tri" aria-hidden="true" data-reveal><img src="../assets/tricom-2.jpg?v=<?= $V ?>" srcset="../assets/tricom-2-960.webp?v=<?= $V ?> 960w, ../assets/tricom-2.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 02</figcaption></figure></div>
    </div>

    <div class="grid g3 hm-cards">
      <article data-item="usluge-obrade" class="card g-card" data-reveal data-reveal-group="tri">
        <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v7.5M15 4v7.5M12 11.5v4"/><path d="M3 19h18"/><path d="M12 15.5 10 19M12 15.5 14 19"/></svg></div>
        <h3>Processing services</h3>
        <p>Cutting on CNC plasma and guillotine shears, oxy-fuel cutting, slitting and recoiling of coils, bending and plate rolling, punching and corner notching, cutting sections on band saws.</p>
        <a class="link-kerf" href="services.html">View services <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

      <article data-item="prodajni-program" class="card g-card" data-reveal data-reveal-group="tri">
        <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg></div>
        <h3>Product range</h3>
        <p>Sheet metal in sheets and coils, trapezoidal and roofing sheet, gutters and downpipes, welded tubes and hollow sections, steel sections, wrought-iron elements, wire mesh, screws and fasteners, tools and welding equipment.</p>
        <a class="link-kerf" href="products.html">Open the range <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

      <article data-item="proizvodnja-po-meri" class="card g-card" data-reveal data-reveal-group="tri">
        <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg></div>
        <h3>Made-to-measure production</h3>
        <p>Trapezoidal profiled roofing sheet, gutters and downpipes in any length you choose, metal cladding panels, parapet lining sheet, complete building sheet-metal work, ventilation ducts, galvanised stair treads.</p>
        <a class="link-kerf" href="services.html#profilisanje">What we make <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
    </div>
  </div>
  </div>
</section>

<!-- ================================================== KONFIGURATOR -->
<section class="section" data-rail-label="Configurator" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 06</p>
    <aside class="kcta dark" aria-labelledby="kctaTitle" data-reveal>
      <div class="kcta__txt">
        <p class="marker">3D configurator <span class="kcta__new">NEW</span></p>
        <h3 id="kctaTitle">Build your roof in 3D</h3>
        <p>Choose the house type, sheet profile and colour, gutters, downpipes and sheet-metal details. The model rotates live, and an inquiry with indicative quantities goes straight to sales.</p>
        <ul class="kcta__list mono"><li>6 roof types</li><li>TR 10 – TR 40 and tile-effect sheet</li><li>zinc · RAL · copper · aluminium</li><li>cross-section and quantities</li></ul>
        <a class="btn btn--lg" href="configurator.html">Open the configurator <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
      <div class="kcta__art kcta__art--photo" aria-hidden="true"><figure class="ph-frame ph-frame--kcta" aria-hidden="true"><img src="../assets/tricom-2.jpg?v=<?= $V ?>" srcset="../assets/tricom-2-960.webp?v=<?= $V ?> 960w, ../assets/tricom-2.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 02</figcaption></figure></div>
    </aside>
  </div>
</section>

<!-- ================================================== REFERENCE -->
<section class="section" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 06</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">References</p>
        <h2 data-reveal="cut">Copper roof of the presidential residence at Karađorđevo.</h2>
        <div class="shead__aside">
          <p>The most demanding contracting project in the company's history: processing the roofing sheet, manufacturing all the accompanying elements of an exclusive copper roof, and complete on-site installation.</p>
        </div>
      </div>
      <div class="shead__media"><figure class="ph-frame ph-frame--ref" aria-hidden="true" data-reveal><img src="../assets/tricom-1.jpg?v=<?= $V ?>" srcset="../assets/tricom-1-960.webp?v=<?= $V ?> 960w, ../assets/tricom-1.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 01</figcaption></figure></div>
    </div>

    <div class="refhero dark" data-reveal>
      <div>
        <h3>Complete roofing works on the presidential residential complex.</h3>
        <p class="muted">The quantity of material says most about the scope of the work. Thanks to our experience with copper, the whole job was completed in just over six weeks.</p>
      </div>
      <div class="refhero__data"><div class="refstats refstats--xl">
          <div class="refstat g-card"><div class="refstat__n" data-kote="t"><span data-count="32">0</span> t</div><div class="refstat__l">OF COPPER PROCESSED AND INSTALLED</div></div>
          <div class="refstat g-card"><div class="refstat__n" data-kote="days"><span data-count="48">0</span></div><div class="refstat__l">DAYS TO COMPLETION</div></div>
        </div></div>
    </div>

    <div class="u-mt-40">
      <p class="mono muted u-mb-16">TRICOM elements have been installed on these buildings, among others:</p>
      <div class="marquee hm-pills" role="group" aria-label="Buildings with TRICOM products installed"><div class="marquee__track"><span class="marquee__item">Belgrade Waterfront</span><span class="marquee__item">Ušće Shopping Center</span><span class="marquee__item">Zeleni Venac market</span><span class="marquee__item">LIDL</span><span class="marquee__item">Continental Subotica</span><span class="marquee__item">ZF Pančevo</span><span class="marquee__item">GEZE Zrenjanin</span><span class="marquee__item">NELT Dobanovci</span><span class="marquee__item">MITAS Ruma</span><span class="marquee__item">MEI TA Obrenovac</span><span class="marquee__item">BOYSEN Subotica</span><span class="marquee__item">Kuehne+Nagel</span><span class="marquee__item">IPB Šimanovci</span><span class="marquee__item">Sport Vision Šimanovci</span><span class="marquee__item">TERRA Inđija</span><span class="marquee__item">Gomex Zrenjanin</span><span class="marquee__item">SAVACOOP Novi Sad</span><span class="marquee__item">Pupin Palace</span><span class="marquee__item">Brze pruge Srbije (high-speed rail)</span><span class="marquee__item">Knez Petrol</span></div></div>
      <div class="u-mt-24">
        <a class="link-kerf" href="references.html">All references <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
    </div>
  </div>
</section>

<!-- ================================================== SERTIFIKATI -->
<section class="section soft" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 06</p>
    <div class="shead">
      <div>
        <p class="marker">Credit rating</p>
        <h2 data-reveal="cut">Ratings our business partners have already checked.</h2>
      </div>
      <div class="shead__aside">
        <p>Certification of credit-rating excellence is international practice that gives holders reputation and trust in the domestic and foreign business environment.</p>
      </div>
    </div>
    <div class="certs">
      <div class="cert cert--gold" data-reveal data-reveal-group="cert">
        <div class="cert__grade">AAA</div>
        <h4>Gold certificate</h4>
        <p>Bisnode, based on business results for 2014–2016. That year it was awarded to 115 of 446,449 active legal entities in Serbia.</p>
        <div class="cert__src">confirmation of business quality</div>
      </div>
      <div class="cert " data-reveal data-reveal-group="cert">
        <div class="cert__grade">AAA</div>
        <h4>Bonitetna izvrsnost (credit-rating excellence)</h4>
        <p>Bisnode Srbija, based on outstanding results in 2015.</p>
        <div class="cert__src">confirmation of business quality</div>
      </div>
      <div class="cert " data-reveal data-reveal-group="cert">
        <div class="cert__grade">AA</div>
        <h4>Bonitetna izvrsnost</h4>
        <p>Bisnode — a certificate held by only the top 2% of companies in Serbia.</p>
        <div class="cert__src">confirmation of business quality</div>
      </div>
      <div class="cert " data-reveal data-reveal-group="cert">
        <div class="cert__grade">A</div>
        <h4>Excellent SME Serbia</h4>
        <p>Chamber of Commerce and Industry of Serbia and Coface Srbija. Among the top 1% by the EFQM methodology.</p>
        <div class="cert__src">confirmation of business quality</div>
      </div></div>
    <p class="mono muted u-mt-24">Issuers: Chamber of Commerce and Industry of Serbia &amp; Coface Srbija, Bisnode Srbija.</p>
  </div>
</section>

<!-- ================================================== FAQ -->
<section class="section soft" data-num="06">
  <div class="wrap">
    <p class="sectionix">06 / 06</p>
    <div class="split split--40">
      <div class="sticky">
        <p class="marker">FAQ</p>
        <h2 data-reveal="cut">What customers ask most often.</h2>
        <p class="lead u-mt-16">If your question is not on the list, the site assistant answers immediately — or call sales.</p>
        <button class="btn btn--ghost u-mt-24" type="button" data-ask="How do I order and how do I pay?">Ask the assistant</button>
        <div class="hm-cap hm-cap--c shape-c u-mt-32" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="../assets/render/coil-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/coil-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/coil-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/coil-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 61vw, 370px" data-orig="../assets/render/coil-light.jpg?v=<?= $V ?>" alt="Sheet metal in coil" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/coil-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/coil-dark.jpg?v=<?= $V ?>" alt="Sheet metal in coil" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
      </div>
      <div><div class="acc" data-acc="single" id="faq"><?= site_faq_items($faq, $L, 'faq') ?></div></div>
    </div>
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
        <li><a href="index.html" aria-current="page">Home</a></li>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["../js/i18n/en.js?v=<?= $V ?>","../js/i18n/l10n.js?v=<?= $V ?>","../js/assistant.js?v=<?= $V ?>","../js/theme.js?v=<?= $V ?>","../js/lang.js?v=<?= $V ?>","../js/hero-slider.js?v=<?= $V ?>","../js/metal-env.js?v=<?= $V ?>","../js/hero3d.js?v=<?= $V ?>","../js/main.js?v=<?= $V ?>","../js/items.js?v=<?= $V ?>","../js/modal.js?v=<?= $V ?>","../js/motion.js?v=<?= $V ?>","../js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
