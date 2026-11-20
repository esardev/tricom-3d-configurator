<?php defined('TRICOM') || exit; ?>
<?php /* Strana usluga (en). Ulaz: $services, $navCats, $L, $V, $SITE. Generisano iz en/services.html. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>Sheet processing — cutting, bending, roll forming | TRICOM</title>
<meta name="description" content="Plasma to 30 mm, guillotine shear to 13 mm, slitting to 1,260 mm, press bending 8.2 m and 200 t, roll forming of TR sheet, gutters and cladding panels.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>en/services.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>usluge.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/services.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>usluge.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="sr_RS">
<meta property="og:title" content="Sheet processing — cutting, bending, roll forming | TRICOM">
<meta property="og:description" content="Plasma to 30 mm, guillotine shear to 13 mm, slitting to 1,260 mm, press bending 8.2 m and 200 t, roll forming of TR sheet, gutters and cladding panels.">
<meta property="og:url" content="<?= $SITE ?>en/services.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/en/services.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Sheet processing — cutting, bending, roll forming | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/en/services.jpg">

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

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","inLanguage":"en","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"<?= $SITE ?>en/"},{"@type":"ListItem","position":2,"name":"Services","item":"<?= $SITE ?>en/services.html"}]}
</script>
</head>
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="about.html">About</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="products.html">Products</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Products — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "products.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="services.html" aria-current="page">Services</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Services — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a></div></li><li class="nav__item"><a class="nav__link" href="configurator.html">Configurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="calculators.html">Calculators</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Calculators — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></li><li class="nav__item"><a class="nav__link" href="references.html">References</a></li><li class="nav__item"><a class="nav__link" href="gallery.html">Gallery</a></li><li class="nav__item"><a class="nav__link" href="contact.html">Contact</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="about.html">About</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Products<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "products.html") ?><a href="products.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge" data-current="true">Services<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a><a href="services.html" aria-current="page"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="configurator.html">Configurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Calculators<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="references.html">References</a></div><div class="mnav__group"><a class="mnav__link" href="gallery.html">Gallery</a></div><div class="mnav__group"><a class="mnav__link" href="contact.html">Contact</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Site language"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-label="SR — Serbian version">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-current="true">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Sales</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">Email</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="contact.html#upit">Request a quote</a>
    </div>
  </div>
</div>

<section class="pagehead pagehead--2 tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">SERVICES</span></div>
  <div class="pagehead__media" aria-hidden="true"><div class="hero3d" data-hero3d="gutter"><div class="hero3d__still is-on" data-obj="gutter"></div></div></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">Services</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">Fourteen processing services, <span class="lt">in one plant.</span></h1>
        <p class="lead">You can buy material in the original mill packaging or have it processed — in the shape, quantity and finish you need. We carry out every operation on our own machines in Batajnica and Ugrinovci.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg> 2,400 m² plant</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section--tight" data-num="01" data-rail-label="All services">
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
        <p class="marker">01 — Cutting</p>
        <h2 data-reveal="cut">From 0.5 mm coil to 150 mm plate.</h2>
      </div>
      <div class="shead__aside">
        <p>Four different processes cover the whole thickness range. Which one suits you better depends on material, thickness, tolerance and quantity — tell us what you are making and we will suggest a process.</p>
      </div>
    </div>

    <div class="tbl-glass svc-sheet" data-reveal>
    <div class="caps">
      <?php if (site_item_on('secenje-cnc-plazma')): ?><div data-item="secenje-cnc-plazma" class="cap"><div class="cap__t">CNC plasma</div><div class="cap__d">Complex shapes, holes and contours to drawing. 2.5 × 8 m cutting table.</div><div class="cap__v">up to 30 mm</div></div><?php endif; ?>
      <?php if (site_item_on('gasno-rezanje')): ?><div data-item="gasno-rezanje" class="cap"><div class="cap__t">Oxy-fuel cutting</div><div class="cap__d">Thick plate, heavy blanks, rough preparation.</div><div class="cap__v">up to 150 mm</div></div><?php endif; ?>
      <?php if (site_item_on('secenje-makazama')): ?><div data-item="secenje-makazama" class="cap"><div class="cap__t">Hydraulic guillotine shear</div><div class="cap__d">Straight cuts across the sheet, cutting to size.</div><div class="cap__v">up to 13 mm</div></div><?php endif; ?>
      <?php if (site_item_on('secenje-makazama')): ?><div data-item="secenje-makazama" class="cap"><div class="cap__t">Guillotine shear — stainless steel</div><div class="cap__d">Stainless steel sheet without surface damage.</div><div class="cap__v">up to 9 mm</div></div><?php endif; ?>
      <?php if (site_item_on('slitovanje')): ?><div data-item="slitovanje" class="cap"><div class="cap__t">Longitudinal cutting (slitting)</div><div class="cap__d">The coil is cut into longitudinal strips of the required width.</div><div class="cap__v">input ≤ 1,260 mm</div></div><?php endif; ?>
      <?php if (site_item_on('premotavanje-kotura')): ?><div data-item="premotavanje-kotura" class="cap"><div class="cap__t">Coil recoiling</div><div class="cap__d">Repacking for further processing, transport or smaller batches.</div><div class="cap__v">by arrangement</div></div><?php endif; ?>
    </div>
    </div>

    <div class="split u-mt-48">
      <div class="prose">
        <h3 class="u-mt-0">When each process is the better choice</h3>
        <p><strong>Guillotine shears</strong> are the fastest and cheapest solution when you need straight cuts and sheets cut to size. There is no heat input into the material and the cut is clean.</p>
        <p><strong>Plasma</strong> is indispensable for anything that is not a straight line — contours, radii, holes, slots and nested parts. Because it is computer-controlled, repeatability across a series is complete.</p>
        <p><strong>Oxy-fuel cutting</strong> is what we use above the thicknesses where plasma is no longer economical — for plate up to 150 mm.</p>
        <p><strong>Slitting</strong> is for those who work from coil: instead of buying strip in the mill width, you get exactly the width you need, so there is no scrap along the length.</p>
      </div>
      <div data-reveal="scale">
        <div class="svc-cap shape-b">
          <picture class="theme-img theme-img--light"><source srcset="../assets/render/plasma-plate-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/plasma-plate-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 609px" data-orig="../assets/render/plasma-plate-light.jpg?v=<?= $V ?>" alt="Steel plate cut on the CNC plasma" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="../assets/render/plasma-plate-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/plasma-plate-dark.jpg?v=<?= $V ?>" alt="Steel plate cut on the CNC plasma" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
      </div>
    </div>
    <h3 class="u-mt-48 u-mb-16" id="masine">Machinery — capacities by machine</h3>
    <p class="u-sm muted u-mb-16">All machines are in Batajnica and Ugrinovci; the data has been carried over from the previous website.</p>
    <div class="tbl-glass svc-machines"><div data-catalog="machines"></div></div>
  </div>
</section>

<!-- ============================================ SAVIJANJE -->
<section class="section" id="savijanje" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 07</p>
    <div class="shead">
      <div>
        <p class="marker">02 — Bending and forming</p>
        <h2 data-reveal="cut">An 8.2 m press brake makes flashings without joints.</h2>
      </div>
      <div class="shead__aside">
        <p>In practice, the length of the press is what makes the biggest difference: a flashing, eaves drip flashing or ridge cap over eight metres long comes out of a single pass, with no transverse joint that later leaks or shows.</p>
      </div>
    </div>

    <div class="split split--60 u-start">
      <div data-reveal="scale">
        <div class="svc-cap svc-cap--tall shape-a">
          <picture class="theme-img theme-img--light"><source srcset="../assets/render/flashing-set-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/flashing-set-light-1390w.webp?v=<?= $V ?>" srcset="../assets/render/flashing-set-light-700w.webp?v=<?= $V ?> 700w, ../assets/render/flashing-set-light-1390w.webp?v=<?= $V ?> 1390w" sizes="(max-width: 700px) 84vw, 691px" data-orig="../assets/render/flashing-set-light.jpg?v=<?= $V ?>" alt="Flashings and eaves drip flashings of bent sheet" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="../assets/render/flashing-set-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/flashing-set-dark.jpg?v=<?= $V ?>" alt="Flashings and eaves drip flashings of bent sheet" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
      </div>
      <div>
        <div class="tbl-glass svc-sheet">
        <div class="caps">
          <?php if (site_item_on('savijanje-limova')): ?><div data-item="savijanje-limova" class="cap"><div class="cap__t">Press brake</div><div class="cap__d">Long flashings, ridge caps, eaves drip flashings, valley flashings</div><div class="cap__v">8.2 m</div></div><?php endif; ?>
          <?php if (site_item_on('savijanje-limova')): ?><div data-item="savijanje-limova" class="cap"><div class="cap__t">NC press brake</div><div class="cap__d">Shorter elements, more complex bend sequences</div><div class="cap__v">3 m</div></div><?php endif; ?>
          <?php if (site_item_on('savijanje-limova')): ?><div data-item="savijanje-limova" class="cap"><div class="cap__t">Plate rolling</div><div class="cap__d">Cylinders, cones, chimney caps</div><div class="cap__v">to radius</div></div><?php endif; ?>
          <?php if (site_item_on('probijanje-i-isecanje-uglova')): ?><div data-item="probijanje-i-isecanje-uglova" class="cap"><div class="cap__t">Punching and corner notching</div><div class="cap__d">Openings and joint preparation before bending</div><div class="cap__v">per work order</div></div><?php endif; ?>
        </div>
        </div>
        <ul class="checklist u-mt-32">
          <li>Send the <strong>developed width</strong> or a drawing with bend angles — if you only have the finished cross-section, we will calculate the developed length</li>
          <li>For visible façade elements, state which side of the sheet is the exposed face</li>
          <li>On pre-painted sheet, the protective film stays on until installation</li>
          <li><strong>200 t NC press brake</strong>: steel up to 10 mm (450 MPa), stainless steel up to 7 mm (650 MPa), length up to 3,100 mm; cold-formed sections up to 10 mm</li>
          <li><strong>Plate rolling</strong> (circular bending): up to 0.8 mm over a length of 2 m, diameters Ø80–Ø800 mm; up to 4 mm over a length of 2 m, minimum diameter 190 mm</li>
          <li><strong>Arc bending</strong> of tubes and flat bars: round tubes 1/2"–2", square up to 50×50 mm, rectangular up to 40×60 mm (wall 2–3 mm)</li>
          <li><strong>Straightening (flattening) of flat bars</strong> up to 10 mm, with edge chamfering</li>
          <li><strong>Corner notching</strong> on steel sheet up to 4 mm, angle 30°–140°; Iron Worker for punching and forming</li>
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
        <p class="marker">03 — Roll forming</p>
        <h2 data-reveal="cut">Length to suit the building, not the sheet.</h2>
      </div>
      <div class="shead__aside">
        <p>The roll formers work from coil, so the length is set by your building. For trapezoidal profiled sheet, gutters, downpipes, parapet lining and cladding panels, this means a roof or façade without transverse overlaps.</p>
        <p class="u-mt-16"><a class="link-kerf" href="calculators.html" data-calc-link>Calculators: number of sheets, area and weight for TR sheet and tile-effect roofing <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p>
      </div>
    </div>

    <div class="grid g3">
      <?php if (site_item_on('trapezni-lim')): ?><article data-item="trapezni-lim" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="../assets/render/tr35-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr35-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/tr35-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/tr35-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 503px" data-orig="../assets/render/tr35-light.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/tr35-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr35-dark.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Trapezoidal profiled sheet</h3>
    <p>Five profiles for roof and façade, galvanised or pre-painted to the RAL chart. The length is cut to suit the building.</p>
    <div class="pcard__tags"><span class="tag">TR 10/162.5</span><span class="tag">TR 20/185</span><span class="tag">TR 35/270</span><span class="tag">TR 40/230</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('oluci-i-vertikale')): ?><article data-item="oluci-i-vertikale" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="../assets/render/gutter-halfround-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/gutter-halfround-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/gutter-halfround-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/gutter-halfround-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="../assets/render/gutter-halfround-light.jpg?v=<?= $V ?>" alt="Half-round gutter with bracket" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/gutter-halfround-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/gutter-halfround-dark.jpg?v=<?= $V ?>" alt="Half-round gutter with bracket" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Gutters and downpipes</h3>
    <p>Half-round gutters (developed width 250–400 mm) and box gutters up to 8.2 m; round downpipes Ø80–Ø150 and square downpipes; half-round gutter (developed width 333 mm) and Ø100 downpipe in unlimited length. With a full set of accessories.</p>
    <div class="pcard__tags"><span class="tag">galvanised</span><span class="tag">painted</span><span class="tag">copper</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('imitacija-crepa')): ?><article data-item="imitacija-crepa" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="../assets/render/crep-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/crep-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/crep-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/crep-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="../assets/render/crep-light.jpg?v=<?= $V ?>" alt="Tile-effect roofing sheet — panel with a roof-tile profile" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/crep-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/crep-dark.jpg?v=<?= $V ?>" alt="Tile-effect roofing sheet — panel with a roof-tile profile" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Tile-effect roofing sheet</h3>
    <p>A panel with a roof-tile profile for roofs that call for a traditional look with the advantages of steel roofing.</p>
    <div class="pcard__tags"><span class="tag">pre-painted</span><span class="tag">RAL of your choice</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('parapetni-lim')): ?><article data-item="parapetni-lim" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="../assets/render/tr20-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr20-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/tr20-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/tr20-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="../assets/render/tr20-light.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 20/185" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/tr20-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr20-dark.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 20/185" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Parapet lining sheet</h3>
    <p>Three profiles (PR 83/34, PR 38/15, PR 71/10) from 0.4–2 mm sheet, painted, galvanised or cold-rolled.</p>
    <div class="pcard__tags"><span class="tag">façade</span><span class="tag">parapet</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('lamperija')): ?><article data-item="lamperija" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="../assets/render/tr10-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr10-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/tr10-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/tr10-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 397px" data-orig="../assets/render/tr10-light.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 10/162.5" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/tr10-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr10-dark.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 10/162.5" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Metal cladding panels and trims</h3>
    <p>Metal cladding panels for ceilings and wall lining, with matching trims — from painted aluminium, painted galvanised, stainless steel and copper sheet; standard length 2.5 m.</p>
    <div class="pcard__tags"><span class="tag">ceilings</span><span class="tag">cladding</span></div>
  </div></article><?php endif; ?><?php if (site_item_on('gradjevinska-limarija')): ?><article data-item="gradjevinska-limarija" class="pcard" data-reveal data-reveal-group="pc">
  <div class="pcard__fig svc-fig"><picture class="theme-img theme-img--light"><source srcset="../assets/render/flashing-set-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/flashing-set-light-1390w.webp?v=<?= $V ?>" srcset="../assets/render/flashing-set-light-700w.webp?v=<?= $V ?> 700w, ../assets/render/flashing-set-light-1390w.webp?v=<?= $V ?> 1390w" sizes="(max-width: 700px) 84vw, 691px" data-orig="../assets/render/flashing-set-light.jpg?v=<?= $V ?>" alt="Construction sheet-metal work — flashings, eaves drip flashings and ridge caps" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/flashing-set-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/flashing-set-dark.jpg?v=<?= $V ?>" alt="Construction sheet-metal work — flashings, eaves drip flashings and ridge caps" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
  <div class="pcard__body">
    <h3>Construction sheet-metal work</h3>
    <p>Valley flashings, penetration flashings, verge flashings, eaves drip flashings, flashings, ridge caps, snow guards, chimney caps — to your dimensions.</p>
    <div class="pcard__tags"><span class="tag">made to measure</span><span class="tag">all sheet types</span></div>
  </div></article><?php endif; ?>
    </div>

    <div class="u-mt-40" data-reveal>
      <div data-catalog="profiles-short"></div>
    </div>
    <p class="mono muted u-mt-16">Check thicknesses and available RAL colours with sales — they depend on current coil stock. Trapezoidal sheet up to 2.5 m (rib 15/10/15) is also made on a hydraulic press; for dimensions, load tables and installation instructions, see the <a href="products.html?group=krov#prog">roofing range</a>.</p>
    <!-- TEMP: confirm with client — stari sajt: „uslužno falcovanje na pripremljenoj konstrukciji sa našim radnicima“ protivreči odluci iz 2006. da se montaža ne radi -->
    <div class="note u-mt-24">Our roofing line for the <strong>double standing seam</strong> system makes panels from galvanised, copper and pre-painted sheet for roofing installers; to go with them we also make standing-seam clips from the sheet of your choice. Since 2006 we have not done on-site installation.</div>
  </div>
</section>

<!-- ============================================ PROFILI -->
<section class="section dark dark--deep tex-grid" id="profili" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 07</p>
    <div class="split split--60">
      <div>
        <p class="marker">04 — Sections and finishing</p>
        <h2 data-reveal="cut">Cutting to length and embossing.</h2>
        <p class="lead u-mt-24">On band saws we cut flat bar, angles, channels, I-sections, tubes and solid bars to the length you ask for — so you do not pay for the rest of the bar that you do not need.</p>
        <p class="u-mt-24">The band saw cuts at angles up to 60°, singly or in bundles, with emulsion cooling (motor 1.3/1.5 kW, cutting speed 38/76 m/min, blade 3,090×27×0.9 mm).</p>
        <p class="u-mt-24">Embossing is a decorative texture pressed along the length of a bar section. It is used for wrought-iron railings, gates and fence elements where the look of hand-forged iron is wanted. We also keep ready-made embossed flat bar and embossed tubes in stock.</p>
        <div class="u-mt-32 u-acts">
          <a class="btn" href="products.html?group=cevi#prog">Sections and tubes in our range <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <button class="btn btn--ghost" type="button" data-ask="What is embossing and which sections do you emboss?">What is embossing?</button>
        </div>
      </div>
      <div class="svc-twin" data-reveal="scale">
        <div class="svc-cap shape-a"><picture class="theme-img theme-img--light"><source srcset="../assets/render/tr35-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr35-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/tr35-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/tr35-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 503px" data-orig="../assets/render/tr35-light.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/tr35-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/tr35-dark.jpg?v=<?= $V ?>" alt="Trapezoidal profiled sheet TR 35/270" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
        <div class="svc-cap svc-cap--pill shape-c"><picture class="theme-img theme-img--light"><source srcset="../assets/render/flashing-set-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/flashing-set-light-1390w.webp?v=<?= $V ?>" srcset="../assets/render/flashing-set-light-700w.webp?v=<?= $V ?> 700w, ../assets/render/flashing-set-light-1390w.webp?v=<?= $V ?> 1390w" sizes="(max-width: 700px) 84vw, 691px" data-orig="../assets/render/flashing-set-light.jpg?v=<?= $V ?>" alt="Flashings and eaves drip flashings of bent sheet" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/flashing-set-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/flashing-set-dark.jpg?v=<?= $V ?>" alt="Flashings and eaves drip flashings of bent sheet" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
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
        <p class="marker">Ordering</p>
        <h2 data-reveal="cut">How work is agreed and paid for.</h2>
        <div class="shead__aside">
          <p>Clear rules make things easier for both of us when it comes to collecting the goods.</p>
        </div>
      </div>
    </div>

    <div class="process" data-reveal>
      <div class="step"><h4>Inquiry and specification</h4><p>Thickness, dimensions and quantity are the minimum for a quote. For plasma cutting, send a DXF, DWG, PDF or a dimensioned sketch.</p></div>
      <div class="step"><h4>Quote, work order and advance payment</h4><p>You get a price and lead time. The job is defined by a work order that you sign, with an advance payment. This fixes the specification.</p></div>
      <div class="step"><h4>Production in the plant</h4><p>Cutting, bending, roll forming or making accessories — according to the work order.</p></div>
      <div class="step"><h4>Collection and invoice</h4><p>Collection in Batajnica; ask sales about delivery. The invoice is a mandatory accompanying document.</p></div>
    </div>

    <div class="grid g3 u-mt-48">
      <div class="infoblock">
        <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg> Price and discount</h3>
        <p class="muted u-sm">Quantity determines the price. From one tonne upwards a discount is possible, and the larger the quantity, the larger the discount. A quote requires thickness, dimensions and quantity.</p>
      </div>
      <div class="infoblock">
        <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.6 8.2-8 9-4.4-.8-8-4-8-9V6l8-3z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg> Payment methods</h3>
        <p class="muted u-sm">Cash through the fiscal cash register, bank transfer, personal cheques, Dina / Visa / MasterCard cards, and bank loan against a pro forma invoice made out to the bank. We do not sell in instalments.</p>
      </div>
      <div class="infoblock">
        <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg> Complaints</h3>
        <p class="muted u-sm">Returning goods requires the invoice, and above 500 dinars also an ID card. Quality complaints must be made within 3 days of sale at the latest — resolved by replacement or refund.</p>
      </div>
    </div>

    <div class="note u-mt-32"><strong>We do not do installation.</strong> Since 2006 our core business has been production and sales. That way we do not compete with the workshops that buy material from us — we prepare accessories ready for installation for them and are available with advice.</div>
  </div>
</section>

<section class="section section--tight" data-num="07">
  <div class="wrap">
    <p class="sectionix">07 / 07</p>
    <div class="ctaband" data-reveal>
      <div>
        <h3>Not sure which process is right for your job?</h3>
        <p>Tell us what you are making — material, thickness and quantity — and we will suggest a process, price and lead time. The advice is free and based on six decades of work in metal.</p>
      </div>
      <div class="ctaband__acts">
        <a class="btn btn--lg" href="contact.html#upit">Request a quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <a class="btn btn--lg btn--ghost" href="tel:<?= site_c('tel', $L) ?>">Call&nbsp;<?= site_c('tel_html', $L) ?></a>
      </div>
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
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="products.html">Products</a></li>
        <li><a href="services.html" aria-current="page">Services</a></li>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["../js/i18n/en.js?v=<?= $V ?>","../js/i18n/l10n.js?v=<?= $V ?>","../js/catalog.js?v=<?= $V ?>","../js/catalog-render.js?v=<?= $V ?>","../js/assistant.js?v=<?= $V ?>","../js/theme.js?v=<?= $V ?>","../js/lang.js?v=<?= $V ?>","../js/metal-env.js?v=<?= $V ?>","../js/hero3d.js?v=<?= $V ?>","../js/main.js?v=<?= $V ?>","../js/items.js?v=<?= $V ?>","../js/modal.js?v=<?= $V ?>","../js/motion.js?v=<?= $V ?>","../js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
