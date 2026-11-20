<?php defined('TRICOM') || exit; ?>
<?php /* Strana „about“ (en). Ulaz: $navCats, $L, $V, $SITE, $faq. Generisano iz en/about.html. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>About — TRICOM d.o.o. Batajnica, metalworking since 1966</title>
<meta name="description" content="A family business in Batajnica since 1966: history, two facilities totalling 2,400 m², machinery, credit-rating excellence certificates and quality policy.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>en/about.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>o-nama.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/about.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>o-nama.html">

<meta property="og:type" content="article">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="sr_RS">
<meta property="og:title" content="About — TRICOM d.o.o. Batajnica, metalworking since 1966">
<meta property="og:description" content="A family business in Batajnica since 1966: history, two facilities totalling 2,400 m², machinery, credit-rating excellence certificates and quality policy.">
<meta property="og:url" content="<?= $SITE ?>en/about.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/en/about.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="About — TRICOM d.o.o. Batajnica, metalworking since 1966">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/en/about.jpg">

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
<link rel="stylesheet" href="../css/print.css?v=<?= $V ?>" media="print">

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","inLanguage":"en","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"<?= $SITE ?>en/"},{"@type":"ListItem","position":2,"name":"About","item":"<?= $SITE ?>en/about.html"}]}
</script>
<?= site_faq_jsonld($faq, $L) ?></head>
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="about.html" aria-current="page">About</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="products.html">Products</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Products — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "products.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="services.html">Services</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Services — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a></div></li><li class="nav__item"><a class="nav__link" href="configurator.html">Configurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="calculators.html">Calculators</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Calculators — submenu"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></li><li class="nav__item"><a class="nav__link" href="references.html">References</a></li><li class="nav__item"><a class="nav__link" href="gallery.html">Gallery</a></li><li class="nav__item"><a class="nav__link" href="contact.html">Contact</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="about.html" aria-current="page">About</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Products<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "products.html") ?><a href="products.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge">Services<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plasma-cutting.html">CNC plasma</a><a href="services.html#secenje">Sheet cutting</a><a href="services.html#savijanje">Bending and forming</a><a href="services.html#profilisanje">Roll forming</a><a href="services.html#profili">Section processing</a><a href="services.html"><strong>Open page</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="configurator.html">Configurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Calculators<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="calculators.html#tr10">TR 10</a><a href="calculators.html#tr20">TR 20</a><a href="calculators.html#tr35">TR 35</a><a href="calculators.html#tr40">TR 40</a><a href="calculators.html#crep">Tile-effect sheet</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="references.html">References</a></div><div class="mnav__group"><a class="mnav__link" href="gallery.html">Gallery</a></div><div class="mnav__group"><a class="mnav__link" href="contact.html">Contact</a></div>
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
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">1966</span></div>
  <div class="pagehead__media ph-frame ph-frame--head" aria-hidden="true"><span class="ph-tab">TRICOM · <b class="ph-n"></b></span></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">About</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">A tradition rarely found <span class="lt">in this region.</span></h1>
        <p class="lead">After decades of work, TRICOM is today a reliable business partner to many contractors, and TRICOM sheet and metal accessories can be found on the most exclusive buildings in Belgrade and across Serbia.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14.5 8 22l4-2.2L16 22l-1-7.5"/></svg> Founded in 1966</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section" data-num="01" data-rail-label="The company">
  <div class="wrap">
    <p class="sectionix">01 / 09</p>
    <div class="split split--60">
      <div class="prose">
        <p class="lead">In 1966 the Trivanović family, blacksmiths and sheet-metal workers since before the war, opened a sheet-metal and metal fabrication workshop that in 1992 grew into a company and expanded into trading in metal and metal accessories.</p>
        <p>Today TRICOM focuses primarily on making and supplying all the sheet-metal products needed in construction, and on selling the accessories, equipment, tools and supplies that sheet-metal workers and metal fabricators need.</p>
        <p>This path of development and long experience in metalworking and metal contracting work are the reason why most of our former colleagues from building sites — sheet-metal workers, metal fabricators and contractors from the wider region — find a reliable business partner in TRICOM.</p>

        <h3>Keeping up with the times</h3>
        <p>To meet market demands, we have modern sheet cutting machines: guillotine shears, CNC plasma and oxy-fuel cutting. We produce trapezoidal profiled roofing sheet, gutters and downpipes in lengths to the customer&rsquo;s order, metal cladding panels and building flashings — valley flashings, penetration flashings, verge flashings, eaves drip flashings and more.</p>
        <p>In addition, we offer our customers welded tubes and sheet in coils and sheets — galvanised, aluminium, copper, cold- and hot-rolled, painted and stainless steel — as well as wrought-iron sections and ancillary materials.</p>
      </div>

      <div class="sticky">
        <nav class="tocnav g-card" id="tocnav" aria-label="On this page">
          <a href="#sve-na-jednom-mestu">All in one place</a>
          <a href="#istorijat">History</a>
          <a href="#kapaciteti">Capacities and machinery</a>
          <a href="#sertifikati">Certificates and credit rating</a>
          <a href="#kvalitet">Quality policy</a>
          <a href="#zajednica">Social responsibility</a>
          <a href="#mediji">In the media</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div class="infoblock u-mt-32">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> Where we are</h3>
          <dl>
            <div class="infoline"><dt>SALES</dt><dd>Kneza Paskača 16–18, Batajnica</dd></div>
            <div class="infoline"><dt>PRODUCTION HALL</dt><dd>Ugrinovci, Zemun — 1,600 m²</dd></div>
            <div class="infoline"><dt>OPENING HOURS</dt><dd><?= site_c('hours', 'en') ?></dd></div>
            <div class="infoline"><dt>TAX ID (PIB)</dt><dd><button class="mono u-accent" type="button" data-copy="100093247">100093247</button></dd></div>
            <div class="infoline"><dt>COMPANY REG. NO.</dt><dd><button class="mono u-accent" type="button" data-copy="06660231">06660231</button></dd></div>
          </dl>
        </div>

      </div>
    </div>
  </div>
</section>

<section class="section soft" id="sve-na-jednom-mestu" data-num="02">
  <div class="wrap">
    <p class="sectionix">02 / 09</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">How we work</p>
        <h2 data-reveal="cut">All in one place.</h2>
        <div class="shead__aside">
          <p>The basic idea behind how the company works is to let business partners buy materials and products <strong>at whatever stage of processing suits them</strong>. Sheet processing and the manufacture of accessories are done by experienced workers on modern machines — which is why our former colleagues from building sites, sheet-metal workers, metal fabricators and contractors from the wider region, find a reliable partner in TRICOM.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <figure class="about-fig about-fig--wide shape-a theme-img"><picture class="img-light"><source srcset="../assets/render/sheet-stack-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?>" srcset="../assets/render/sheet-stack-light-620w.webp?v=<?= $V ?> 620w, ../assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?> 1230w" sizes="(max-width: 700px) 84vw, 609px" data-orig="../assets/render/sheet-stack-light.jpg?v=<?= $V ?>" alt="Sheet metal in flat sheets" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="img-dark"><source srcset="../assets/render/sheet-stack-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/sheet-stack-dark.jpg?v=<?= $V ?>" alt="Sheet metal in flat sheets" width="2400" height="1500" loading="lazy" decoding="async"></picture></figure>
      </div>
    </div>

    <div class="grid g4">
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Material</h3><p>In factory packaging — sheet, coil, bar, tube. No further processing, for partners with their own plant.</p></div>
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Processing</h3><p>In the shape, quantity and finish the partner wants. Cutting, bending, roll forming, embossing.</p></div>
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Product</h3><p>The specific element the partner needs — gutter, flashing, stair tread, duct, panel.</p></div>
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Collection</h3><p>Collection in Batajnica; ask sales about delivery — it is arranged with the order.</p></div>
    </div>

    <div class="split u-mt-48">
      <div>
        <h3 class="u-mb-24">Sheet and accessory processing</h3>
        <ul class="checklist">
          <li>Cutting sheet on electric or hydraulic guillotine shears — up to <strong>13 mm</strong> thick, or up to <strong>9 mm</strong> for stainless steel sheet</li>
          <li>Longitudinal cutting (slitting) and recoiling of sheet coils — up to <strong>1,260 mm</strong> wide</li>
          <li>Sheet bending — deforming, forming, plate rolling</li>
          <li>Manufacture of trapezoidal profiled roofing sheet</li>
          <li>Ancillary services — corner notching, welding and cutting of steel sections</li>
        </ul>
      </div>
      <div>
        <h3 class="u-mb-24">Sheet, section and equipment range</h3>
        <ul class="checklist">
          <li>Sheet — galvanised, copper, aluminium, black cold-rolled (HVL) and hot-rolled (TVL), painted; trapezoidal, roofing and parapet lining sheet</li>
          <li>Steel sections, cold-formed tubes and ZP sections</li>
          <li>Fasteners and supplies for metal fabricators — hardware, locks, fence spikes, drill bits</li>
          <li>Aluminium sections, cladding panels and trims</li>
          <li>Welding machines, consumables and equipment by <strong>Varstroj</strong></li>
          <li>Tools — <strong>Bosch, Makita, DeWalt, Stanley, Black &amp; Decker</strong></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section" id="istorijat" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 09</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">History</p>
        <h2 data-reveal="cut">Six decades in metal.</h2>
        <div class="shead__aside">
          <p>From a blacksmith&rsquo;s workshop, through a metal trading company, to a manufacturer of sheet-metal roofing accessories with its own CNC plant.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <figure class="about-fig about-fig--wide shape-c theme-img"><picture class="img-light"><source srcset="../assets/render/coil-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/coil-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/coil-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/coil-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 609px" data-orig="../assets/render/coil-light.jpg?v=<?= $V ?>" alt="Sheet metal in a coil" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="img-dark"><source srcset="../assets/render/coil-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/coil-dark.jpg?v=<?= $V ?>" alt="Sheet metal in a coil" width="2400" height="1500" loading="lazy" decoding="async"></picture></figure>
      </div>
    </div>
    <div class="timeline about-tl" id="timeline"><div class="timeline__rail" aria-hidden="true"><i></i></div>
    <article class="tl-item">
      <div class="tl-item__year">1966</div>
      <h3 class="tl-item__title">The Trivanović workshop opens</h3>
      <p>The Trivanović family, blacksmiths and sheet-metal workers since before the Second World War, opens a sheet-metal and metal fabrication workshop. Its core business is sheet-metal roofing accessories, making and installing sheet-metal profiles, roofing work, ventilation and air conditioning, and making metal fabrication accessories and light and medium-weight structures — including forging and heat treatment.</p>

    </article>
    <article class="tl-item">
      <div class="tl-item__year">1992</div>
      <h3 class="tl-item__title">The workshop becomes a company</h3>
      <p>The business expands into trading in metal and metal accessories, and the range of machines, equipment and tools for workshop finishing work grows significantly. This makes it possible to produce more complex metal products. The workshop and the company carried out work in all the republics of the former Yugoslavia; that contracting period left behind work on demanding buildings:</p>
      <ul><li>Work at heights of over 30 m — sheet-metal roofing accessories and downpipes on the University Clinical Centre of Serbia; over 50 m on residential buildings in Belgrade, silos, MPI plants and sugar factories.</li><li>Large quantities of material — complete roofing and sheet-metal work in copper sheet, over 30 t of copper, on the Residence of the President of the Republic in Karađorđevo.</li><li>Complex sheet-metal work — the copper roofs of the presidential residence in Belgrade, dozens of villas in Dedinje used by diplomatic and consular missions, the KPGT theatre in the old sugar factory, ventilation and air-conditioning work, mills, office buildings and production halls of Serbian and foreign companies.</li></ul>
    </article>
    <article class="tl-item">
      <div class="tl-item__year">2006</div>
      <h3 class="tl-item__title">No more installation: a focus on manufacturing and sales</h3>
      <p>A strategic decision was made that the company would no longer do installation, and that its core business would be the manufacture and sale of metal products for construction and the metalworking industry. The reason was clear: working on site as a contractor created a conflict of interest with the trade workshops and companies that buy material from us and for which we prepare sheet-metal roofing accessories for installation. Since then, our long contracting experience has been put to use in an advisory role — as consulting for our clients.</p>

    </article>
    <article class="tl-item">
      <div class="tl-item__year">2009</div>
      <h3 class="tl-item__title">New production hall and central warehouse in Ugrinovci</h3>
      <p>A production hall and central warehouse with a floor area of 1,600 m² are built in Ugrinovci, Zemun. Together with the existing 800 m² facility in Batajnica, the plant is equipped with plasma cutting up to 30 mm and oxy-fuel cutting up to 150 mm, hydraulic guillotine shears up to 13 mm, a 3 m NC press brake, roll formers for gutters and downpipes and for TR (trapezoidal) sheet, an 8.2 m press brake, a parapet sheet machine, a cladding panel machine, band saws and various presses. The level of production and services rises significantly, and even during the economic crisis the company records growing business results.</p>

    </article></div>
  </div>
</section>

<section class="section dark dark--deep tex-grid" id="kapaciteti" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Capacities</p>
        <h2 data-reveal="cut">Two facilities, 2,400 m², a complete range of machinery.</h2>
      </div>
      <div class="shead__aside">
        <p>The 800 m² facility in Batajnica and the 1,600 m² production and storage hall in Ugrinovci are equipped to process sheet from the thinnest coil to 150 mm plate.</p>
      </div>
    </div>

    <figure class="ph-frame ph-frame--cap u-mb-40" aria-hidden="true" data-reveal><img src="../assets/tricom-3.jpg?v=<?= $V ?>" srcset="../assets/tricom-3-960.webp?v=<?= $V ?> 960w, ../assets/tricom-3.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 03</figcaption></figure>

    <div class="trows about-trows" data-reveal>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M6 72V42l32-16 32 16v30"/><path d="M26 72V54h24v18M14 50v22M58 50v22"/><path d="M76 72V54l19-14 19 14v18"/><path d="M90 72V62h10v10"/><path d="M2 72h116"/></svg></div>
        <div class="trow__body"><p class="about-val">2,400 m²</p><h3>Two facilities</h3><p>Batajnica 800 m² · Ugrinovci (Zemun) 1,600 m²</p></div>
        <div class="trow__anno"><span><b>800 m²</b> Batajnica</span><span><b>1,600 m²</b> Ugrinovci (Zemun)</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="10" y="40" width="100" height="34" rx="2"/><circle cx="44" cy="57" r="9"/><path d="M78 50l10 7-10 7zM62 10v26M56 36h12"/><path d="M54 44l-4 6M74 44l4 6"/></svg></div>
        <div class="trow__body"><p class="about-val">30 / 150 mm</p><h3>CNC plasma and oxy-fuel cutting</h3><p>2.5 × 8 m cutting table, computer-controlled</p></div>
        <div class="trow__anno"><span><b>2.5 × 8 m</b> cutting table</span><span><b>CNC</b> computer-controlled</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M6 62h108v10H6zM12 62v-4h96v4"/><path d="M18 22l86 26v8L22 32z"/><path d="M104 48v10"/></svg></div>
        <div class="trow__body"><p class="about-val">up to 13 mm</p><h3>Hydraulic guillotine shears</h3><p>Steel and non-ferrous metals; stainless steel up to 9 mm</p></div>
        <div class="trow__anno"><span><b>13 mm</b> steel and non-ferrous metals</span><span><b>9 mm</b> stainless steel</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M8 74h30l22-20 22 20h30"/><path d="M54 10h12v26H54z"/><path d="M60 50L48 36h24z"/><path d="M14 62l46-10 46 10" stroke-dasharray="3 4"/></svg></div>
        <div class="trow__body"><p class="about-val">3 m</p><h3>NC press brake</h3><p>Sheet bending and forming</p></div>
        <div class="trow__anno"><span><b>3 m</b> NC press brake</span><span><b>NC</b> bending and forming</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M8 74L40 50h40l32 24"/><path d="M8 66L40 42h40l32 24M40 42v8M80 42v8"/><path d="M12 24h96M12 19v10M108 19v10"/></svg></div>
        <div class="trow__body"><p class="about-val">8.2 m</p><h3>Press brake</h3><p>Long flashings and profiles in a single pass</p></div>
        <div class="trow__anno"><span><b>8.2 m</b> press brake</span><span><b>single pass</b> flashings and profiles</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="40" cy="24" r="9"/><circle cx="80" cy="24" r="9"/><path d="M6 40h108"/><path d="M6 72h10l8-16h14l8 16h14l8-16h14l8 16h10"/></svg></div>
        <div class="trow__body"><p class="about-val">length to order</p><h3>Roll formers</h3><p>Gutters and downpipes, TR sheet, parapet sheet, cladding panels</p></div>
        <div class="trow__anno"><span><b>to order</b> length</span><span><b>TR sheet</b> gutters · downpipes · parapet sheet · cladding panels</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="32" cy="50" r="22"/><circle cx="32" cy="50" r="7"/><path d="M54 42h60M54 50h60M54 58h60"/><path d="M84 34v32"/></svg></div>
        <div class="trow__body"><p class="about-val">up to 1,260 mm</p><h3>Slitting line</h3><p>Longitudinal cutting and recoiling of coils</p></div>
        <div class="trow__anno"><span><b>1,260 mm</b> coil</span><span><b>slitting</b> longitudinal cutting · recoiling</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="30" cy="24" r="12"/><circle cx="30" cy="66" r="12"/><path d="M42 24v42M18 24v42"/><path d="M58 72h54M58 50v22M58 50h12v22"/></svg></div>
        <div class="trow__body"><p class="about-val">to specification</p><h3>Band saws and presses</h3><p>Section cutting, punching, corner notching</p></div>
        <div class="trow__anno"><span><b>to specification</b></span><span><b>sections</b> cutting · punching · corner notching</span></div>
      </div>
    </div>
    <details class="more u-mt-32"><summary class="mono">Full list of machinery, machine by machine</summary><div class="tbl-glass u-mt-16"><div data-catalog="machines-short"></div></div></details>
  </div>
</section>

<section class="section soft" id="sertifikati" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Certificates and credit rating</p>
        <h2 data-reveal="cut">Business ratings you can verify.</h2>
      </div>
      <div class="shead__aside">
        <p>The main purpose of these certificates, in line with EU directives, is to promote successful small and medium-sized enterprises, secure business and greater market transparency.</p>
      </div>
    </div>
    <div class="certs">
      <div class="cert cert--gold" data-reveal data-reveal-group="c2">
        <div class="cert__grade">AAA</div>
        <h4>Zlatni sertifikat (Gold Certificate)</h4><p>Bisnode Srbija, based on business results for 2014, 2015 and 2016. The credit rating for 2017 is AAA. That year the Gold Certificate was awarded to 115 legal entities out of a total of 446,449 active in Serbia.</p><p class="u-sm"><a href="../assets/old/docs/sertifikat-zlatni-AAA-2017.pdf">Certificate (PDF, in Serbian), issued 20 October 2017</a></p>
      </div>
      <div class="cert " data-reveal data-reveal-group="c2">
        <div class="cert__grade">AAA</div>
        <h4>Bonitetna izvrsnost (credit-rating excellence)</h4><p>Bisnode Srbija, based on outstanding business results in 2015. An internationally recognised mark of a company&rsquo;s economic quality and success.</p><p class="u-sm"><a href="../assets/old/docs/sertifikat-AAA-2015.pdf">Certificate (PDF, in Serbian), issued 18 December 2015</a></p>
      </div>
      <div class="cert " data-reveal data-reveal-group="c2">
        <div class="cert__grade">AA</div>
        <h4>Bonitetna izvrsnost</h4><p>Bisnode. Only the top 2% of companies in Serbia received the certificate, which makes it a recognised reference for business quality.</p><p class="u-sm"><a href="../assets/old/docs/sertifikat-AA-2014.pdf">Certificate (PDF, in Serbian), issued 28 March 2014</a></p>
      </div>
      <div class="cert " data-reveal data-reveal-group="c2">
        <div class="cert__grade">A</div>
        <h4>Excellent SME Serbia</h4><p>Chamber of Commerce and Industry of Serbia in cooperation with the credit-rating agency Coface Srbija. Using the European Foundation for Quality Management methodology, the company was ranked among the top 1% in Serbia for 2014, with the highest rating, A — and also held the certificate for 2013.</p><p class="u-sm"><a href="../assets/old/docs/sertifikat-A-2015.pdf">Certificate A (PDF, in Serbian), issued 29 January 2015</a></p>
      </div></div>
  </div>
</section>

<section class="section" id="kvalitet" data-num="06">
  <div class="wrap">
    <p class="sectionix">06 / 09</p>
    <div class="kv-head">
      <div>
        <p class="marker">Quality policy</p>
        <h2 data-reveal="cut">We have no competitors — we have business friends.</h2>
      </div>
      <div class="quote">
          TRICOM&rsquo;s philosophy is that it has no competitors, only business friends and partners.
          <cite>That is why, since 2006, the company has not worked on site as a contractor.</cite>
        </div>
    </div>
    <div class="kv-intro prose">
        <p>That decision is the most concrete expression of our quality policy. Instead of competing with the workshops that buy material from us, we prepare complete sheet-metal roofing accessories for them, ready for installation, and are always available with advice.</p>
        <p>As a result, most trade workshops and metalworking companies in the wider region work with us.</p>
        <p>Thanks to the company&rsquo;s steady growth, the development of production capacity, the adoption of new technologies and the expansion of production volume, TRICOM ranks among the most established manufacturers of sheet-metal roofing accessories and metal products for construction and the metalworking industry.</p>
        <p>Our goal is to maintain and improve our market position in terms of the quality of goods, products and services — to be recognisable and to keep improving. The quality policy rests on seven principles:</p>
    </div>
    <ol class="steps-ol kv-tiles">
          <li>a management system documented and aligned with the <strong>ISO 9001</strong> standard — more efficient processes and the conditions for continual improvement;</li>
          <li>prudent, careful management — cost rationalisation without compromising product quality or working conditions;</li>
          <li>continuous renewal of equipment and use of new technologies — quality, productivity and profitability;</li>
          <li>quality products that meet market requirements, in line with international technical standards and regulations;</li>
          <li>fair business relations with customers, respecting the agreed terms of delivery;</li>
          <li>partnership with suppliers — we choose them by their ability to meet defined delivery criteria;</li>
          <li>participation in sports, cultural and charity events — a contribution to a better quality of life in the community.</li>
        </ol>
    <div class="kv-foot">
      <div class="prose">
        <p>The management representative for quality is responsible for ensuring the processes needed to implement and maintain the quality management system. All employees accept and develop a culture of quality and work in line with this policy and the quality objectives.</p>
        <p class="mono muted u-sm">Director: Dragan Trivanović</p>
      </div>
      <div class="note">The work order signed by the customer follows the same logic: the specification is fixed before production starts, so on collection it is clear where an error occurred — with the manufacturer or in the specification.</div>
    </div>
    <figure class="ph-frame ph-frame--pano u-mt-48" aria-hidden="true" data-reveal><img src="../assets/tricom-2.jpg?v=<?= $V ?>" srcset="../assets/tricom-2-960.webp?v=<?= $V ?> 960w, ../assets/tricom-2.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 02</figcaption></figure>
  </div>
</section>

<section class="section soft" id="zajednica" data-num="07">
  <div class="wrap">
    <p class="sectionix">07 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Social responsibility</p>
        <h2 data-reveal="cut">A craft is passed on, not kept.</h2>
      </div>
    </div>
    <div class="grid g3">
      <div class="card g-card" data-reveal><h3>Educational cooperation</h3><p>TRICOM has a business and technical cooperation agreement with the <a href="https://atssb.edu.rs/" rel="noopener">Academy of Technical Applied Studies Belgrade</a> (University of Belgrade), signed in 2022. The cooperation covers education and training, professional research and artistic work, and other forms of joint work.</p></div>
      <div class="card g-card" data-reveal><h3>Community initiatives</h3><p>The idea is to help the local community — a better quality of life, a cleaner environment and, above all, helping young people set out on the right path. The company takes part in sports events and charity campaigns in Batajnica: the “Mala Milica Rakić” futsal tournament (2004 — semi-final, 2005 — quarter-final) and a tournament in Inđija in 2005 (round of 16). The company has received a number of letters of thanks for community work and charity campaigns.</p></div>
      <div class="card g-card" data-reveal><h3>UNICEF Friends Club</h3><p>The company is a member of the UNICEF Friends Club.</p></div>
    </div>
  </div>
</section>

<section class="section" id="mediji" data-num="08">
  <div class="wrap">
    <p class="sectionix">08 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">In the media</p>
        <h2 data-reveal="cut">An entrepreneur from Batajnica.</h2>
      </div>
      <div class="shead__aside">
        <p>Dragan Trivanović worked as a school teacher; in 1995 he left teaching to take over developing the family business. The media followed the company through entrepreneurship competitions.</p>
      </div>
    </div>
    <div class="grid g3">
      <div class="card g-card" data-reveal data-reveal-group="md"><h3>EY Entrepreneur of the Year 2014</h3><p>Dragan Trivanović (Tricom) among the participants in the EY Entrepreneur of the Year 2014 competition in Serbia — a profile in the competition catalogue: from a craft workshop to a manufacturer of sheet-metal roofing accessories with metal processing services.</p><p class="u-sm"><a href="../assets/old/docs/ey-preduzetnik-godine-2014.pdf">Article (PDF, in Serbian)</a> · <a href="../assets/old/docs/ey-ucesnici-konkursa-2014.pdf">2014 participants (PDF, in Serbian)</a></p></div>
      <div class="card g-card" data-reveal data-reveal-group="md"><h3>Blic preduzetnik 2013</h3><p>TRICOM among the candidates for the “Blic preduzetnik 2013” (Blic Entrepreneur 2013) award, worth EUR 20,000. The article “Most desirable employers — from craft workshop to company”: production at two locations, Batajnica and Ugrinovci; at the time the company employed 15 people.</p><p class="u-sm"><a href="../assets/old/docs/blic-preduzetnik-2013.pdf">Press clipping (PDF, in Serbian)</a></p></div>
      <div class="card g-card" data-reveal data-reveal-group="md"><h3>N1 — “Svet novca” (World of Money)</h3><p>A report on the programme “Svet novca”: entrepreneurs on problems with bureaucracy.</p><p class="u-sm"><a href="http://rs.n1info.com/a60138/Video/Info/Preduzetnici-o-problemima-sa-birokratijom.html" rel="noopener">Video on N1 (in Serbian)</a></p></div>
    </div>
  </div>
</section>

<section class="section soft" id="faq" data-num="09">
  <div class="wrap">
    <p class="sectionix">09 / 09</p>
    <div class="split split--40">
      <div class="sticky">
        <p class="marker">FAQ</p>
        <h2 data-reveal="cut">Terms of business, no small print.</h2>
        <button class="btn btn--ghost u-mt-24" type="button" data-ask="Do you do installation?">Ask the assistant</button>
      </div>
      <div><div class="acc" data-acc="single" id="faq2"><?= site_faq_items($faq, $L) ?></div></div>
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
        <li><a href="about.html" aria-current="page">About</a></li>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["../js/i18n/en.js?v=<?= $V ?>","../js/i18n/l10n.js?v=<?= $V ?>","../js/catalog.js?v=<?= $V ?>","../js/catalog-render.js?v=<?= $V ?>","../js/assistant.js?v=<?= $V ?>","../js/theme.js?v=<?= $V ?>","../js/lang.js?v=<?= $V ?>","../js/main.js?v=<?= $V ?>","../js/motion.js?v=<?= $V ?>","../js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
