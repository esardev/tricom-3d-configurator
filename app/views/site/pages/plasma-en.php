<?php defined('TRICOM') || exit; ?>
<?php /* Strana „plasma“ (en). Ulaz: $navCats, $L, $V, $SITE. Generisano iz en/plasma-cutting.html. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>CNC plasma to 30 mm, oxy-fuel cutting to 150 mm | TRICOM</title>
<meta name="description" content="CNC plasma: steel, stainless steel, copper, aluminium to 30 mm; oxy-fuel cutting to 150 mm; 2.5 × 8 m table. From DXF, DWG, PDF or a dimensioned sketch.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>en/plasma-cutting.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>plazma.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/plasma-cutting.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>plazma.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="sr_RS">
<meta property="og:title" content="CNC plasma to 30 mm, oxy-fuel cutting to 150 mm | TRICOM">
<meta property="og:description" content="CNC plasma: steel, stainless steel, copper, aluminium to 30 mm; oxy-fuel cutting to 150 mm; 2.5 × 8 m table. From DXF, DWG, PDF or a dimensioned sketch.">
<meta property="og:url" content="<?= $SITE ?>en/plasma-cutting.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/en/plasma-cutting.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="CNC plasma to 30 mm, oxy-fuel cutting to 150 mm | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/en/plasma-cutting.jpg">

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
{"@context":"https://schema.org","@type":"BreadcrumbList","inLanguage":"en","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"<?= $SITE ?>en/"},{"@type":"ListItem","position":2,"name":"CNC plasma cutting","item":"<?= $SITE ?>en/plasma-cutting.html"}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","inLanguage":"en","mainEntity":[{"@type":"Question","name":"What format should I send the drawing in?","acceptedAnswer":{"@type":"Answer","text":"DXF or DWG is best, because it goes straight into the machine program without redrawing. We also work from a PDF drawing, a technical drawing or a legible dimensioned sketch. If you only have an existing part, you can bring it in — we will measure it and make the drawing."}},{"@type":"Question","name":"Which materials do you cut on the plasma?","acceptedAnswer":{"@type":"Answer","text":"Non-ferrous metals, all types of steel and stainless steel sheet. Specifically: black steel (cold-rolled and hot-rolled), stainless steel, copper and aluminium. Thickness up to 30 mm; above that we switch to oxy-fuel cutting, up to 150 mm."}},{"@type":"Question","name":"Do I need to lay out the parts on the sheet myself?","acceptedAnswer":{"@type":"Answer","text":"No. The layout of parts on the sheet (nesting) is usually agreed when we receive the specification — the 2.5 × 8 m cutting table leaves room to get more parts out of one sheet. As a rule, a full specification sent at once produces less scrap than ordering part by part."}},{"@type":"Question","name":"What kind of cut does plasma leave?","acceptedAnswer":{"@type":"Answer","text":"Plasma leaves a narrow heat-affected zone and a slight bevel on the cut, and fine dross that is easy to remove may remain on the bottom edge. If you need a smooth edge with no finishing, tell us in advance — we will advise whether cutting on the guillotine shear or additional finishing is better for your part."}},{"@type":"Question","name":"How long does production take?","acceptedAnswer":{"@type":"Answer","text":"It depends on the current workload of the plant and on whether the material is in stock. The lead time is agreed with the quote and confirmed by the work order — check it with sales before ordering."}}]}
</script>
</head>
<body class="ph-3">
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="about.html">About</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="products.html">Products</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Products — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "products.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="services.html" aria-current="true">Services</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Services — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plasma-cutting.html" aria-current="page">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a></div></li><li class="nav__item"><a class="nav__link" href="configurator.html">Configurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="calculators.html">Calculators</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Calculators — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></li><li class="nav__item"><a class="nav__link" href="references.html">References</a></li><li class="nav__item"><a class="nav__link" href="gallery.html">Gallery</a></li><li class="nav__item"><a class="nav__link" href="contact.html">Contact</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="about.html">About</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Products<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "products.html") ?><a href="products.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge" data-current="true">Services<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plasma-cutting.html" aria-current="page">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a><a href="services.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="configurator.html">Configurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Calculators<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="references.html">References</a></div><div class="mnav__group"><a class="mnav__link" href="gallery.html">Gallery</a></div><div class="mnav__group"><a class="mnav__link" href="contact.html">Contact</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Site language"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-label="SR — Serbian version">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-current="true">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Sales</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">Email</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="contact.html#upit">Request a quote</a>
    </div>
  </div>
</div>

<section class="pagehead pagehead--3 tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">PLASMA</span></div>
  <div class="pagehead__media" aria-hidden="true"><div class="hero3d" data-hero3d="plate"><div class="hero3d__still is-on" data-obj="plate"></div></div></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep" aria-hidden="true">/</span><a href="services.html">Services</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">CNC plasma</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">CNC plasma. <span class="lt">A computer guides the cut, not a hand.</span></h1>
        <p class="lead">The machine is fully computer-controlled, so the chance of error is kept to a minimum. We cut quickly, precisely and with minimal scrap — from a single part to a series with full repeatability.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5M12 17v5M4.2 4.2l3.6 3.6M16.2 16.2l3.6 3.6M2 12h5M17 12h5M4.2 19.8l3.6-3.6M16.2 7.8l3.6-3.6"/><circle cx="12" cy="12" r="3"/></svg> up to 30 mm &middot; 2.5 × 8 m table</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section--tight" data-num="01" data-rail-label="Machine capabilities">
  <div class="wrap">
    <p class="sectionix">01 / 05</p>
    <div class="tbl-glass svc-sheet" data-reveal>
    <div class="caps">
      <?php if (site_item_on('secenje-cnc-plazma')): ?><div data-item="secenje-cnc-plazma" class="cap"><div class="cap__t">Plasma cutting</div><div class="cap__d">Steel, stainless steel, copper, aluminium — complex contours, holes, slots</div><div class="cap__v">up to 30 mm</div></div><?php endif; ?>
      <?php if (site_item_on('gasno-rezanje')): ?><div data-item="gasno-rezanje" class="cap" id="gasno"><div class="cap__t">Oxy-fuel cutting</div><div class="cap__d">Thick plate and heavy blanks</div><div class="cap__v">up to 150 mm</div></div><?php endif; ?>
      <?php if (site_item_on('radni-sto')): ?><div data-item="radni-sto" class="cap"><div class="cap__t">Cutting table</div><div class="cap__d">Nesting several parts from one sheet</div><div class="cap__v">2.5 × 8 m</div></div><?php endif; ?>
      <?php if (site_item_on('ponovljivost')): ?><div data-item="ponovljivost" class="cap"><div class="cap__t">Repeatability</div><div class="cap__d">Same program — same part, from the first piece to the last</div><div class="cap__v">CNC program</div></div><?php endif; ?>
    </div>
    </div>
  </div>
</section>

<section class="section soft" data-num="02">
  <div class="wrap">
    <p class="sectionix">02 / 05</p>
    <div class="split split--60 u-start">
      <div class="prose">
        <p class="marker">How it works</p>
        <h2 class="u-mb-24" data-reveal="cut">The arc turns gas into plasma; the plasma turns metal into vapour.</h2>
        <p>An electric arc is struck between the electrode in the torch and the sheet itself. Gas is forced through the arc under pressure; it ionises and turns into plasma — a jet at a temperature of tens of thousands of degrees that locally melts and vaporises the metal, while the same jet blows the molten metal out of the cut.</p>
        <p>Because the torch follows a program, not the operator's hand, the shape of the cut is exactly the one on the drawing. That is why plasma is indispensable wherever the cut is not a straight line: contours, radii, holes, slots, nested parts.</p>
        <p><strong>What this means for you in practice:</strong> when the full specification arrives at once, the parts can be laid out on the sheet so that scrap is minimal. When you order part by part this is not possible, and the difference in price per part can be significant.</p>

        <h3>What plasma cannot do</h3>
        <p>Plasma leaves a narrow heat-affected zone, a slight bevel on the cut and possibly fine dross on the bottom edge. For most structural and sheet-metal applications this is not a problem. If you need an edge with no finishing at all, tell us in advance — for straight cuts the guillotine shear is, as a rule, the better and cheaper choice.</p>
      </div>

      <div class="sticky svc-twin">
        <div class="svc-cap shape-b">
          <picture class="theme-img theme-img--light"><source srcset="../assets/render/plasma-plate-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/plasma-plate-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 88vw, 524px" data-orig="../assets/render/plasma-plate-light.jpg?v=<?= $V ?>" alt="Steel plate cut on the CNC plasma — contours, holes and slots" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="../assets/render/plasma-plate-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/plasma-plate-dark.jpg?v=<?= $V ?>" alt="Steel plate cut on the CNC plasma — contours, holes and slots" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
        <div class="svc-cap svc-cap--pill shape-c">
          <picture class="theme-img theme-img--light"><source srcset="../assets/render/xray-sheet-layers-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/xray-sheet-layers-light-2400w.webp?v=<?= $V ?>" srcset="../assets/render/xray-sheet-layers-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/xray-sheet-layers-light-2400w.webp?v=<?= $V ?> 2400w" sizes="(max-width: 700px) 88vw, 524px" data-orig="../assets/render/xray-sheet-layers-light.jpg?v=<?= $V ?>" alt="Sheet layers — see-through view" width="2000" height="1250" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="../assets/render/xray-sheet-layers-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/xray-sheet-layers-dark.jpg?v=<?= $V ?>" alt="Sheet layers — see-through view" width="2000" height="1250" loading="lazy" decoding="async"></picture>
        </div>
        <p class="figcap">Cut width (kerf), edge bevel and heat-affected zone depend on thickness and material.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 05</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">Preparation</p>
        <h2 data-reveal="cut">What to send us for an immediate price.</h2>
        <div class="shead__aside">
          <p>The more complete the specification, the more accurate the quote and the shorter the lead time. The minimum is material, thickness, quantity and shape.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <div class="svc-cap shape-a">
          <picture class="theme-img theme-img--light"><source srcset="../assets/render/sheet-stack-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?>" srcset="../assets/render/sheet-stack-light-620w.webp?v=<?= $V ?> 620w, ../assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?> 1230w" sizes="(max-width: 700px) 84vw, 609px" data-orig="../assets/render/sheet-stack-light.jpg?v=<?= $V ?>" alt="Stacked sheets — material and thickness" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="../assets/render/sheet-stack-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/sheet-stack-dark.jpg?v=<?= $V ?>" alt="Stacked sheets — material and thickness" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
      </div>
    </div>

    <div class="grid numrow pstrip">
      <div data-item="dxf-dwg" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M16 4h22l10 10v30H16z"/><path d="M38 4v10h10"/><path d="M22 36l6-10 5 6 4-8 5 12"/></svg></div><h3>DXF or DWG</h3><p>The best format. The geometry goes straight into the machine program, with no redrawing and no risk of errors when transferring dimensions.</p></div>
      <div data-item="pdf-crtez" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M16 4h22l10 10v30H16z"/><path d="M38 4v10h10"/><path d="M22 20h18v10H22z"/><path d="M22 36h18M22 34v4M40 34v4"/></svg></div><h3>PDF or technical drawing</h3><p>We also work from a PDF or a drawing, if the dimensions are legible and complete. State the scale if the drawing is not dimensioned.</p></div>
      <div data-item="skica-sa-kotama" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M10 10h30v22H10z"/><path d="M10 40h30M10 38v4M40 38v4"/><path d="M48 10v22M46 10h4M46 32h4"/><circle cx="19" cy="21" r="4"/></svg></div><h3>Dimensioned sketch</h3><p>A hand sketch is enough for simple shapes. What matters is that all dimensions are written in and that it is clear what is the outer contour and what is an opening.</p></div>
      <div data-item="uzorak-ili-fotografija" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M8 14h12l4-6h16l4 6h12v28H8z"/><circle cx="32" cy="27" r="8"/><circle cx="32" cy="27" r="3"/></svg></div><h3>Sample or photo</h3><p>If you have an existing part, bring it to Batajnica. We will measure it and make a drawing for the machine. With some correction, we adapt any photo or image of a shape for plasma cutting — within the limits of the machine.</p></div>
      <div data-item="uz-nacrt-navedite" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M6 24l26-12 26 12-26 12z"/><path d="M6 24v8l26 12 26-12v-8"/><path d="M60 24h4M60 32h4M62 24v8"/></svg></div><h3>With the drawing, state</h3>
        <ul class="checklist">
          <li><strong>Material</strong> — black steel, stainless steel, copper or aluminium</li>
          <li><strong>Thickness</strong> in millimetres</li>
          <li><strong>Quantity</strong> per item, because the price and the layout on the sheet depend on it</li>
          <li><strong>Whether you supply the material</strong> or buy it from us</li>
          <li><strong>Tolerance</strong>, if it is tighter than usual for plasma</li>
          <li><strong>Further processing</strong> — if the part will be bent afterwards, let us know in advance because of grain direction and bend positions</li>
        </ul>
      </div>
    </div>

    <div class="u-mt-48">
      <h3 class="u-mb-24">What we cut</h3>
      <div class="tbl-glass"><div class="spec-wrap"><table class="spec"><caption class="mono muted spec__cap">MATERIALS AND PROCESSES</caption><thead><tr><th scope="col" class="spec__no">#</th><th scope="col">Material</th><th scope="col">Process</th><th scope="col" class="num">Thickness</th></tr></thead><tbody><tr><td class="spec__no">01</td><td class="key">Black steel (cold-rolled, hot-rolled)</td><td>plasma</td><td class="num">up to 30<span class="unit">mm</span></td></tr><tr><td class="spec__no">02</td><td class="key">Black steel — plate</td><td>oxy-fuel cutting</td><td class="num">up to 150<span class="unit">mm</span></td></tr><tr><td class="spec__no">03</td><td class="key">Stainless steel</td><td>plasma</td><td class="num">up to 30<span class="unit">mm</span></td></tr><tr><td class="spec__no">04</td><td class="key">Copper</td><td>plasma</td><td class="num">up to 30<span class="unit">mm</span></td></tr><tr><td class="spec__no">05</td><td class="key">Aluminium</td><td>plasma</td><td class="num">up to 30<span class="unit">mm</span></td></tr></tbody></table></div></div>
    </div>
  </div>
</section>

<section class="section soft" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 05</p>
    <div class="split split--40">
      <div class="sticky">
        <p class="marker">Frequently asked questions</p>
        <h2 data-reveal="cut">Plasma, in brief.</h2>
        <div class="u-mt-24 u-acts">
          <a class="btn" href="contact.html#upit">Send a drawing <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <button class="btn btn--ghost" type="button" data-ask="What do I need to send for plasma cutting?">Ask the assistant</button>
        </div>
        <figure class="ph-frame ph-frame--faq u-mt-32" aria-hidden="true" data-reveal><img src="../assets/tricom-1.jpg?v=<?= $V ?>" srcset="../assets/tricom-1-960.webp?v=<?= $V ?> 960w, ../assets/tricom-1.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 01</figcaption></figure>
      </div>
      <div><div class="acc" data-acc="single" id="pfaq">
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-0">
      <span>What format should I send the drawing in?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-0"><div><p>DXF or DWG is best, because it goes straight into the machine program without redrawing. We also work from a PDF drawing, a technical drawing or a legible dimensioned sketch. If you only have an existing part, you can bring it in — we will measure it and make the drawing.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-1">
      <span>Which materials do you cut on the plasma?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-1"><div><p>Non-ferrous metals, all types of steel and stainless steel sheet. Specifically: black steel (cold-rolled and hot-rolled), stainless steel, copper and aluminium. Thickness up to 30 mm; above that we switch to oxy-fuel cutting, up to 150 mm.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-2">
      <span>Do I need to lay out the parts on the sheet myself?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-2"><div><p>No. The layout of parts on the sheet (nesting) is usually agreed when we receive the specification — the 2.5 × 8 m cutting table leaves room to get more parts out of one sheet. As a rule, a full specification sent at once produces less scrap than ordering part by part.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-3">
      <span>What kind of cut does plasma leave?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-3"><div><p>Plasma leaves a narrow heat-affected zone and a slight bevel on the cut, and fine dross that is easy to remove may remain on the bottom edge. If you need a smooth edge with no finishing, tell us in advance — we will advise whether cutting on the guillotine shear or additional finishing is better for your part.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-4">
      <span>How long does production take?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-4"><div><p>It depends on the current workload of the plant and on whether the material is in stock. The lead time is agreed with the quote and confirmed by the work order — check it with sales before ordering.</p></div></div>
  </div></div></div>
    </div>
  </div>
</section>

<section class="section section--tight" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 05</p>
    <div class="ctaband" data-reveal>
      <div>
        <h3>Send a DXF — get a quote with a lead time.</h3>
        <p>For an exact price we need the material, thickness and quantity per item. If you have the full specification, we will lay out the parts so that scrap is minimal.</p>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["../js/i18n/en.js?v=<?= $V ?>","../js/i18n/l10n.js?v=<?= $V ?>","../js/assistant.js?v=<?= $V ?>","../js/theme.js?v=<?= $V ?>","../js/lang.js?v=<?= $V ?>","../js/metal-env.js?v=<?= $V ?>","../js/hero3d.js?v=<?= $V ?>","../js/main.js?v=<?= $V ?>","../js/items.js?v=<?= $V ?>","../js/modal.js?v=<?= $V ?>","../js/motion.js?v=<?= $V ?>","../js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
