<?php defined('TRICOM') || exit; ?>
<?php /* Strana „configurator“ (en). Ulaz: $L, $V, $SITE. Generisano iz en/configurator.html. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>@view-transition { navigation: auto; }</style>
<title>3D Roof and Gutter Configurator | TRICOM</title>
<meta name="description" content="Your roof in 3D: house or hall to your dimensions, TR 10–40 or tile-effect sheet, galvanised, RAL, copper or aluminium, gutters, flashings and inquiry.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>en/configurator.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>konfigurator.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/configurator.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>konfigurator.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="sr_RS">
<meta property="og:title" content="3D Roof and Gutter Configurator | TRICOM">
<meta property="og:description" content="Your roof in 3D: house or hall to your dimensions, TR 10–40 or tile-effect sheet, galvanised, RAL, copper or aluminium, gutters, flashings and inquiry.">
<meta property="og:url" content="<?= $SITE ?>en/configurator.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/en/configurator.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="3D Roof and Gutter Configurator | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/en/configurator.jpg">

<link rel="icon" href="../assets/favicon.svg?v=<?= $V ?>" type="image/svg+xml">
<link rel="apple-touch-icon" href="../assets/tricom-logo.png?v=<?= $V ?>">

<script>
/* Fontovi (Archivo, IBM Plex — OFL, assets/fonts): preko http(s) sa sopstvenog servera
   (css/fonts.css); preko file:// pregledač ne pušta lokalne
   fontove (CORS), pa se tada uzimaju sa Google Fonts. window.__fontsCss javlja kad je
   CSS fontova stigao (skripta teme ispod tek tada čeka same fontove). */
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
<link rel="stylesheet" href="../css/components.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/konfigurator.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/kalkulator.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/motion.css?v=<?= $V ?>">
<link rel="stylesheet" href="../css/print.css?v=<?= $V ?>" media="print">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "TRICOM 3D roof and gutter configurator",
  "url": "<?= $SITE ?>en/configurator.html",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "inLanguage": "en",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "RSD"},
  "provider": {"@id": "<?= $SITE ?>#org"}
}
</script>
</head>
<body class="k-body k-booting">
<svg class="shapes" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs><clipPath id="shape-a" clipPathUnits="objectBoundingBox"><path d="M0 .18C0 .136.036.1.08.1H.59C.615.1.63.095.64.075C.67.03.73 0 .8 0C.9105 0 1 .0895 1 .2C1 .279.953.351.881.383L.88.92C.88.964.844 1 .8 1H.08C.036 1 0 .964 0 .92Z"/></clipPath><clipPath id="shape-b" clipPathUnits="objectBoundingBox"><path d="M0 .08C0 .036.036 0 .08 0H.92C.964 0 1 .036 1 .08V.76C1 .804.964.84.92.84H.66C.625.84.606.852.6.875C.597.945.54 1 .47 1H.25C.178 1 .12.942.12.87C.12.852.112.84.098.84H.08C.036.84 0 .804 0 .76Z"/></clipPath><clipPath id="shape-c" clipPathUnits="objectBoundingBox"><path d="M.2 0H.52C.55 0 .555.03.56.06C.57.12.6.16.65.16C.7.16.73.12.74.06C.745.03.75 0 .78 0H.8C.91 0 1 .224 1 .5C1 .776.91 1 .8 1H.2C.09 1 0 .776 0 .5C0 .224.09 0 .2 0Z"/></clipPath></defs></svg>

<header class="k-top">
  <a class="k-top__brand" href="index.html" aria-label="TRICOM — home page"><img src="../assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300"></a>
  <a class="k-top__back" href="index.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>Back to site</span></a>
  <p class="k-top__title"><span class="label">3D configurator</span><span>roof · gutters · flashings</span></p>
  <nav class="calc-switch" aria-label="Tool"><a href="calculators.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/></svg><span>Quick calculator</span></a><a href="configurator.html" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg><span>Configurator</span></a></nav>
  <span class="k-top__sp"></span>
  <button class="k-top__list" id="kListBtn" type="button" aria-expanded="false" aria-controls="kListPop"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke-width="2.4"/></svg><span class="k-top__ll">Inquiry list</span><b class="k-badge">0</b></button>
  <div class="k-listpop" id="kListPop" hidden></div>
  <div class="langsw" role="group" aria-label="Site language"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-label="SR — Serbian version">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-current="true">EN</button></div>
  <button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-k"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-k)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button>
  <a class="btn btn--sm k-top__cta" id="kQuote" href="contact.html#upit"><span>Request a quote</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
</header>

<main class="k-stage" id="kStage">
  <!-- loader samo preko 3D scene (traka i koraci se crtaju odmah) -->
  <div class="k-loader" id="kLoader" role="status" aria-live="polite">
    <div class="k-loader__in">
      <img src="../assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
      <div class="k-loader__bar"><span id="kLoaderBar"></span></div>
      <p class="mono" id="kLoaderTxt">Preparing the 3D view</p>
    </div>
  </div>
  <h1 class="sr-only">3D configurator for roofs, gutters and flashings</h1>
  <canvas id="kCanvas" role="img" aria-label="3D view of the building — drag to rotate, scroll or pinch to zoom"></canvas>
  <img class="k-still" id="kStill" alt="Illustration of the selected building type" width="1200" height="800" src="../assets/konfigurator/dvovodni.webp?v=<?= $V ?>" srcset="../assets/konfigurator/dvovodni-720w.webp?v=<?= $V ?> 720w, ../assets/konfigurator/dvovodni.webp?v=<?= $V ?> 1200w" sizes="(max-width: 820px) 86vw, 60vw" fetchpriority="high">
  <div class="k-noglnote" id="kNoGL" hidden><p class="label">3D view not available</p><p>This browser does not support WebGL. The steps and the specification work as usual; the picture illustrates the selected building type.</p></div>
  <div class="k-kote" id="kKoteBox" aria-hidden="true"></div>
  <div class="k-hotspots" id="kHotspots"></div>
  <div class="k-cmp" id="kCmp" hidden>
    <button type="button" class="k-cmp__side" data-side="0" aria-pressed="true"><b>A</b><span></span></button>
    <button type="button" class="k-cmp__side" data-side="1" aria-pressed="false"><b>B</b><span></span></button>
    <div class="k-cmp__div" id="kDivider" role="slider" aria-orientation="horizontal" aria-label="Comparison divider" aria-valuemin="15" aria-valuemax="85" aria-valuenow="50" tabindex="0">
      <i aria-hidden="true"></i>
      <button type="button" id="kSwap" title="Swap sides A and B">Swap</button>
    </div>
  </div>
  <div class="k-readout" id="kReadout" role="status" hidden></div>

  <div class="k-dock" id="kDock" role="toolbar" aria-label="View">
    <span class="k-dock__t" aria-hidden="true">View</span>
    <div class="k-dock__i">
      <button type="button" class="k-tool" id="kViewsBtn" data-pop aria-expanded="false" aria-controls="kViewMenu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><path d="M9.5 13.5h5M12 11v5"/></svg><span>Views</span></button>
      <div class="k-pop k-pop--dial" id="kViewMenu" role="group" aria-label="Camera views" hidden>
        <button type="button" data-view="home"><b>Start view</b><small>from the garden, at eye level</small></button>
        <button type="button" data-view="spreda"><b>Front</b></button>
        <button type="button" data-view="bocno"><b>Side</b></button>
        <button type="button" data-view="oluk"><b>Gutter detail</b></button>
        <button type="button" data-view="odozgo"><b>Roof from above</b></button>
        <button type="button" data-view="terasa"><b>Terrace / patio</b></button>
        <button type="button" data-view="walk"><b>Walk</b><small>at eye level, slowly circling</small></button>
      </div>
    </div>
    <button type="button" class="k-tool" id="kKote" aria-pressed="false" title="Dimensions: roof measurements on the model"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M20 7v10M4 12h16"/><path d="M7 9.5 4.5 12 7 14.5M17 9.5l2.5 2.5-2.5 2.5"/></svg><span>Dimensions</span></button>
    <div class="k-dock__i">
      <button type="button" class="k-tool" id="kDetBtn" data-pop aria-expanded="false" aria-controls="kDetMenu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5M8 10.5h5M10.5 8v5"/></svg><span>Details</span></button>
      <div class="k-pop" id="kDetMenu" role="group" aria-label="Flashing details — cross-section and installation" hidden></div>
    </div>
    <button type="button" class="k-tool" id="kCompare" aria-pressed="false" title="Compare two variants side by side"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13"/><path d="M12 3v18"/><path d="M8.5 10 6.5 12l2 2M15.5 10l2 2-2 2"/></svg><span>Compare</span></button>
    <button type="button" class="k-tool" id="kMeasure" aria-pressed="false" title="Measure: two clicks on the model give the distance in mm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17 17 3l4 4L7 21z"/><path d="M8 12l1.5 1.5M11 9l1.5 1.5M14 6l1.5 1.5"/></svg><span>Measure</span></button>
    <button type="button" class="k-tool" id="kSection" aria-pressed="false" title="Section: a cut through the building showing the roof layers"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9l8-5 8 5v8l-8 5-8-5z"/><path d="M12 4v18M4 9l8 5 8-5" opacity=".6"/></svg><span>Section</span></button>
    <div class="k-dock__i">
      <button type="button" class="k-tool" id="kTurnBtn" data-pop aria-expanded="false" aria-controls="kTurnMenu" title="Turntable: automatic camera orbit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4h-4"/></svg><span>Turntable</span></button>
      <div class="k-pop" id="kTurnMenu" role="group" aria-label="Turntable" hidden>
        <button type="button" data-turn="0.5"><b>Slow</b><small>one turn in about 2 min</small></button>
        <button type="button" data-turn="1"><b>Normal</b><small>one turn in about 1 min</small></button>
        <button type="button" data-turn="2"><b>Fast</b><small>one turn in half a minute</small></button>
        <button type="button" data-turn="0"><b>Stop</b><small>touching the model also stops it</small></button>
      </div>
    </div>
    <div class="k-dock__i">
      <button type="button" class="k-tool" id="kPhoto" data-pop aria-expanded="false" aria-controls="kPhotoMenu" title="Photo: 4K image to download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span>Photo</span></button>
      <div class="k-pop" id="kPhotoMenu" role="group" aria-label="Photo" hidden>
        <button type="button" data-photo="now"><b>This view</b><small>4K PNG of what you see now</small></button>
        <button type="button" data-photo="front34"><b>Front, three-quarter</b><small>the building in its surroundings</small></button>
        <button type="button" data-photo="eave"><b>Eaves detail</b><small>gutter, eaves drip flashing and brackets close up</small></button>
        <button type="button" data-photo="aerial"><b>Aerial</b><small>roof and plot from above</small></button>
      </div>
    </div>
    <div class="k-dock__i">
      <button type="button" class="k-tool" id="kSceneBtn" data-pop aria-expanded="false" aria-controls="kSceneMenu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 14a4 4 0 1 1 1-7.9 5 5 0 0 1 9.6 1.4A3.3 3.3 0 0 1 17 14z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/></svg><span>Scene</span></button>
      <div class="k-pop" id="kSceneMenu" role="group" aria-label="Scene" hidden>
        <button type="button" id="kRain" aria-pressed="false"><b>Rain</b><small>water on the roof, in the gutter and downpipes</small></button>
        <button type="button" id="kSnow" aria-pressed="false"><b>Winter</b><small>snow on the roof and what the snow guards do</small></button>
        <button type="button" id="kSunPlay" aria-pressed="false"><b>Sun through the day</b><small>06:00 → 22:00 in 12 s</small></button>
        <button type="button" id="kDayNight" role="switch" aria-checked="false"><b>Day / night</b><small>lighting at dusk</small></button>
      </div>
    </div>
    <div class="k-dock__i">
      <button type="button" class="k-tool" id="kShareBtn" data-pop aria-expanded="false" aria-controls="kShareMenu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v6h14v-6"/></svg><span>Share</span></button>
      <div class="k-pop" id="kShareMenu" role="group" aria-label="Save and share" hidden>
        <button type="button" id="kCopy"><b>Copy link</b><small>the whole configuration is in the address</small></button>
        <button type="button" id="kPdf"><b>PDF / print</b><small>A4 specification sheet</small></button>
        <button type="button" id="kPresent"><b>Presentation</b><small>full screen without tools, the model turns (#present=1)</small></button>
      </div>
    </div>
    <span class="k-dock__sep" aria-hidden="true"></span>
    <button type="button" class="k-tool k-tool--ico" id="kUndo" title="Undo (Ctrl+Z)" aria-label="Undo" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg></button>
    <button type="button" class="k-tool k-tool--ico" id="kRedo" title="Redo (Ctrl+Y)" aria-label="Redo" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/></svg></button>
  </div>
  <button type="button" class="k-present__x" id="kPresentX" hidden>Exit presentation</button>
  <button type="button" class="k-help" id="kHelp" aria-label="Quick guide — start the tour">?</button>
</main>

<nav class="k-rail" id="kRail" aria-label="Configuration steps"></nav>

<aside class="k-panel" id="kPanel" aria-hidden="true" aria-labelledby="kPanelTitle" inert>
  <div class="k-grip" id="kGrip" aria-hidden="true"><i></i></div>
  <div class="k-panel__head">
    <span class="k-panel__no mono" id="kPanelNo">01</span>
    <h2 id="kPanelTitle">Selection</h2>
    <button class="k-panel__x" id="kPanelClose" type="button" aria-label="Close panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  </div>
  <div class="k-panel__body" id="kPanelBody"></div>
</aside>

<aside class="k-ins" id="kInspect" aria-hidden="true" aria-label="Flashing detail: cross-section and installation" inert></aside>

<div class="k-loupe" id="kLoupe" hidden aria-hidden="true"><canvas width="380" height="380"></canvas><span class="mono">300 %</span></div>

<div class="k-tour" id="kTour" hidden role="dialog" aria-modal="true" aria-label="Short tour of the configurator">
  <div class="k-tour__hole"></div>
  <div class="k-tour__card">
    <p class="k-tour__n mono">1 / 6</p>
    <p class="k-tour__t"></p>
    <div class="k-tour__b"><button type="button" class="k-linkb" data-tour-skip>Skip</button><button type="button" class="btn btn--sm" data-tour-next>Next</button></div>
  </div>
</div>

<div class="k-wait" id="kWait" hidden role="status" aria-live="polite">
  <div><p class="mono" id="kWaitTxt">Photo</p><div class="k-loader__bar"><span id="kWaitBar"></span></div></div>
</div>

<div class="k-toast" id="kToast" role="status" aria-live="polite"></div>

<div class="k-fail" id="kFail" hidden>
  <div>
    <h2>3D view not available</h2>
    <p>The configurator cannot run in this browser. Send us an inquiry — we will put the roof together with you.</p>
    <p><a class="btn" href="contact.html#upit">Request a quote</a> &nbsp; <a class="link-kerf" href="products.html?group=krov#prog">Roofing and façade systems</a></p>
  </div>
</div>

<noscript><div class="k-fail"><div><h2>The configurator needs JavaScript</h2><p>Turn on JavaScript or see our <a href="products.html?group=krov#prog">roofing range</a>.</p></div></div></noscript>

<!-- Specification sheet (PDF / print): filled in just before printing -->
<section class="k-print" id="kPrint" aria-hidden="true">
  <header class="k-print__head">
    <img src="../assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
    <div><b>Roof and drainage specification</b><span>3D configurator · <span id="kPrintDate"></span></span></div>
  </header>
  <div id="kPrintBody"></div>
  <p class="k-print__foot">TRICOM d.o.o., Kneza Paskača 16–18, Batajnica · +381 63 850 30 00 · office@tricom.rs · tricom.rs</p>
</section>

<script>
/* Skripte strane kreću posle prvog crtanja (unos first-contentful-paint; tekst, slike i hero se
   crtaju odmah, LCP ne čeka JS), istim redom kao ranije (async=false); najkasnije posle 2,5 s. Kad se poslednja izvrši: html[data-ready] i događaj „tricom:ready“. */
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["../js/i18n/en.js?v=<?= $V ?>","../js/i18n/l10n.js?v=<?= $V ?>","../js/theme.js?v=<?= $V ?>","../js/lang.js?v=<?= $V ?>","../js/catalog.js?v=<?= $V ?>","../js/calc.js?v=<?= $V ?>","../js/calc-ui.js?v=<?= $V ?>","../js/vendor/three.min.js?v=<?= $V ?>","../js/metal-env.js?v=<?= $V ?>","../js/vendor/OrbitControls.js?v=<?= $V ?>","../js/vendor/BufferGeometryUtils.js?v=<?= $V ?>","../js/konfigurator/k-data.js?v=<?= $V ?>","../js/konfigurator/k-textures.js?v=<?= $V ?>","../js/konfigurator/k-materials.js?v=<?= $V ?>","../js/konfigurator/k-geo.js?v=<?= $V ?>","../js/konfigurator/k-house.js?v=<?= $V ?>","../js/konfigurator/k-spec.js?v=<?= $V ?>","../js/konfigurator/k-env.js?v=<?= $V ?>","../js/konfigurator/k-fx.js?v=<?= $V ?>","../js/konfigurator/k-weather.js?v=<?= $V ?>","../js/konfigurator/k-tools.js?v=<?= $V ?>","../js/konfigurator/k-ui.js?v=<?= $V ?>","../js/konfigurator/k-app.js?v=<?= $V ?>","../js/motion.js?v=<?= $V ?>"]);
</script>
</body>
</html>
