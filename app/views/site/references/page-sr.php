<?php defined('TRICOM') || exit; ?>
<?php /* Strana referenci (sr). Ulaz: $refs (po vrsti), $navCats, $L, $V, $SITE. Generisano iz reference.html. */ ?>
<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>Reference — Karađorđevo, Beograd na vodi, LIDL | TRICOM</title>
<meta name="description" content="Bakarni krov rezidencije u Karađorđevu (32 t bakra), Beograd na vodi, PC Ušće, Zeleni venac, LIDL, Continental, ZF, GEZE i preko 460 partnera.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>reference.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>reference.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/references.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>reference.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="sr_RS">
<meta property="og:title" content="Reference — Karađorđevo, Beograd na vodi, LIDL | TRICOM">
<meta property="og:description" content="Bakarni krov rezidencije u Karađorđevu (32 t bakra), Beograd na vodi, PC Ušće, Zeleni venac, LIDL, Continental, ZF, GEZE i preko 460 partnera.">
<meta property="og:url" content="<?= $SITE ?>reference.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/reference.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Reference — Karađorđevo, Beograd na vodi, LIDL | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/reference.jpg">

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
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Početna","item":"<?= $SITE ?>"},{"@type":"ListItem","position":2,"name":"Reference","item":"<?= $SITE ?>reference.html"}]}
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="o-nama.html">O nama</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="proizvodi.html">Proizvodi</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Proizvodi — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "proizvodi.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="usluge.html">Usluge</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Usluge — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a></div></li><li class="nav__item"><a class="nav__link" href="konfigurator.html">Konfigurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="kalkulatori.html">Kalkulatori</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Kalkulatori — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></li><li class="nav__item"><a class="nav__link" href="reference.html" aria-current="page">Reference</a></li><li class="nav__item"><a class="nav__link" href="galerija.html">Galerija</a></li><li class="nav__item"><a class="nav__link" href="kontakt.html">Kontakt</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="o-nama.html">O nama</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Proizvodi<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "proizvodi.html") ?><a href="proizvodi.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge">Usluge<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a><a href="usluge.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="konfigurator.html">Konfigurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Kalkulatori<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="reference.html" aria-current="page">Reference</a></div><div class="mnav__group"><a class="mnav__link" href="galerija.html">Galerija</a></div><div class="mnav__group"><a class="mnav__link" href="kontakt.html">Kontakt</a></div>
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
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">REFERENCE</span></div>
  <div class="pagehead__media ph-frame ph-frame--head" aria-hidden="true"><span class="ph-tab">TRICOM · <b class="ph-n"></b></span></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Putanja"><a href="index.html">Početna</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">Reference</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">Gde su naši limovi <span class="lt">već ugrađeni.</span></h1>
        <p class="lead">TRICOM limovi i metalna galanterija prisutni su na najekskluzivnijim objektima Beograda i Srbije — od predsedničkih rezidencija do industrijskih hala i logističkih centara.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14.5 8 22l4-2.2L16 22l-1-7.5"/></svg> Šest decenija u metalu</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section--tight" data-num="01">
  <div class="wrap">
    <p class="sectionix">01 / 05</p>
    <div class="refhero dark" data-reveal>
      <div>
        <p class="marker">Najzahtevniji poduhvat</p>
        <h3>Bakarni krov rezidencije u Karađorđevu.</h3>
        <p class="muted">Kompletni krovopokrivački radovi na rezidencijalnom predsedničkom kompleksu: obrada lima za pokrivanje, proizvodnja svih pratećih elemenata ekskluzivnog bakarnog krova i ugradnja na licu mesta. O obimu radova najviše govori količina materijala.</p>
      </div>
      <div class="refhero__data"><div class="refstats refstats--xl">
          <div class="refstat g-card"><div class="refstat__n" data-kote="t"><span data-count="32">0</span> t</div><div class="refstat__l">OBRAĐENOG I UGRAĐENOG BAKRA</div></div>
          <div class="refstat g-card"><div class="refstat__n" data-kote="dana"><span data-count="48">0</span></div><div class="refstat__l">DANA DO ZAVRŠETKA</div></div>
        </div></div>
    </div>
  </div>
</section>

<section class="section soft" data-num="02">
  <div class="wrap">
    <p class="sectionix">02 / 05</p>
    <div class="shead">
      <div>
        <p class="marker">Tri vrste zahtevnosti</p>
        <h2 data-reveal="cut">Visina, količina, složenost.</h2>
      </div>
      <div class="shead__aside">
        <p>U dugogodišnjem izvođačkom radu — do 2006, kada firma prestaje sa montažom — radovi su bili zahtevni po tri različita kriterijuma.</p>
      </div>
    </div>

    <div class="grid g3"><?= site_reference_cards($refs['demand'], 'demand', $L) ?></div>
  </div>
</section>

<section class="section" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 05</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">Lista objekata</p>
        <h2 data-reveal="cut">Objekti i partneri.</h2>
        <div class="shead__aside">
          <p>Deo objekata na kojima su ugrađeni TRICOM proizvodi — kao podizvođač ili kroz isporuku komitentima delova konstrukcija, elemenata enterijera i kompletnih elemenata oblaganja fasadnih i pokrivnih površina.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <figure class="ph-frame ph-frame--list" aria-hidden="true" data-reveal><img src="assets/tricom-3.jpg?v=<?= $V ?>" srcset="assets/tricom-3-960.webp?v=<?= $V ?> 960w, assets/tricom-3.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 03</figcaption></figure>
      </div>
    </div>
    <div class="grid g3 u-mb-40"><?= site_reference_cards($refs['scope'], 'scope', $L) ?></div>
    <div class="reflist"><?= site_reference_cards($refs['project'], 'project', $L) ?></div>
  </div>
</section>

<section class="section soft" data-rail-label="Partneri i objekti" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 05</p>
    <details class="g-card rg-panel" open>
      <summary class="btn btn--glass">Partneri i objekti <svg class="ico--static" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
      <div class="rg-panel__body">
    <div class="marquee" role="group" aria-label="Objekti na kojima su ugrađeni TRICOM proizvodi"><div class="marquee__track"><span class="marquee__item">Beograd na vodi</span><span class="marquee__item">PC Ušće</span><span class="marquee__item">Pijaca Zeleni venac</span><span class="marquee__item">LIDL</span><span class="marquee__item">Continental Subotica</span><span class="marquee__item">ZF Pančevo</span><span class="marquee__item">GEZE Zrenjanin</span><span class="marquee__item">NELT Dobanovci</span><span class="marquee__item">MITAS Ruma</span><span class="marquee__item">MEI TA Obrenovac</span><span class="marquee__item">BOYSEN Subotica</span><span class="marquee__item">Kuehne+Nagel</span><span class="marquee__item">IPB Šimanovci</span><span class="marquee__item">Sport Vision Šimanovci</span><span class="marquee__item">TERRA Inđija</span><span class="marquee__item">Gomex Zrenjanin</span><span class="marquee__item">SAVACOOP Novi Sad</span><span class="marquee__item">Pupinova palata</span><span class="marquee__item">Brze pruge Srbije</span><span class="marquee__item">Knez Petrol</span></div></div>
    <div class="u-mt-40" id="partneri">
      <h3 class="u-mb-16">Poslovni partneri</h3>
      <p class="u-sm muted u-mb-16">Pored nekoliko hiljada fizičkih lica, sa TRICOM-om sarađuje i ova grupa poslovnih partnera (462 firmi i ustanova; lista preneta sa dosadašnjeg sajta, abecedno).</p>
      <details class="more"><summary class="mono">Prikaži celu listu partnera</summary><ul class="partners u-mt-16"><li>19. DECEMBAR d.o.o.</li><li>3D-METAL d.o.o.</li><li>3-M. TRIVIĆ MIRKO d.o.o. BATAJNICA</li><li>4 M SPECIJALNI ALATI d.o.o.</li><li>AB CONSTRUCT TEAM d.o.o.</li><li>ABC GRAFIKA SR</li><li>ABD-KOMERC d.o.o.</li><li>ADP d.o.o.</li><li>ADRIATIC OIL COMPANY d.o.o.</li><li>AERO VELA d.o.o.</li><li>AEROKLIMA</li><li>AGAPE NOVA DOO BEOGRAD</li><li>AGENCIJA BMB EXPERT AGRIMAR</li><li>AGROCICI KOP 2013 D.O.O</li><li>AGROTEH preduzeće za inženjering,projektovanje i usluge</li><li>AIR TRADE CENTRE d.o.o.</li><li>AIT 58</li><li>ALFA I OMEGA ALKOPLAST d.o.o.</li><li>ALKOSAN d.o.o. ALTIMAX HAUS d.o.o.</li><li>ALULINE</li><li>ALUMATIK D.O.O. PREDUZEĆE ZA UVOZ, IZVOZ, TURIZAM I USLUGE</li><li>ALVOS d.o.o.</li><li>ANDERVA d.o.o.</li><li>ANTARA d.o.o.</li><li>AP GLOBUS TRANS</li><li>ARHI M GRADNJA</li><li>ARMONT SP d.o.o.</li><li>ARTEC HOME d.o.o.</li><li>ARTINVEST d.o.o.</li><li>AS GRADNJA 2016 d.o.o</li><li>AS MACURA d.o.o.</li><li>ASTACO d.o.o.</li><li>ASTORIJA – GRAF SZTR</li><li>ATL UPRAVLJANJE NEKRETNINAMA d.o.o.</li><li>ATT INTERIJERI d.o.o.</li><li>AUTO CENTAR ĆIROLI</li><li>AUTO CENTAR NENADIC</li><li>AUTO NENA STILL d.o.o.</li><li>AUTO SERVIS LJUKOVCANIN</li><li>AUTO SERVIS MDN STIJELJA</li><li>AUTOLAKIRER AS – S&amp;Z</li><li>AUTOPREVOZ KOVAČEVIĆ TAKI</li><li>AUTOPREVOZNIK ČOLE TRANS</li><li>AUTOSERVIS TONI</li><li>AVITO COMP LTD. d.o.o.</li><li>BAĆA D.O.O.</li><li>BANATSKA KUĆA d.o.o.</li><li>BB ELEKTRONIK d.o.o.</li><li>BEOALAT SR</li><li>BEOGRAD INZENJERING</li><li>BERAK INŽENJERING d.o.o.</li><li>BESLAĆ TRANS d.o.o.</li><li>BOBADEX SZR</li><li>BOBEX d.o.o.</li><li>BOMACO OD</li><li>BOMAKS BUILDING d.o.o.</li><li>BOMAKS SR</li><li>BOMETAL d.o.o.</li><li>BOMEX INŽENJERING BOPET SYSTEM d.o.o.</li><li>BOS export – import d.o.o.</li><li>BRAĆA DESPOT d.o.o.</li><li>RANEX d.o.o.</li><li>BRANIX d.o.o.</li><li>BRAVAR DŽAJA</li><li>BRAVARIJA ČUBRILO</li><li>BT COMPANY d.o.o.</li><li>BUCAN SYSTEMS d.o.o.</li><li>BULIĆ CO d.o.o.</li><li>BUS SERVIS BEOGRAD</li><li>BUSS SYSTEM d.o.o.</li><li>BEOGRAD BWC d.o.o.</li><li>CAR STUDIO d.o.o.</li><li>CD ENTERIJERI d.o.o.</li><li>CEPTING d.o.o.</li><li>COLIBRI TEAM COMBAT d.o.o.</li><li>CONCRETE LAND d.o.o.</li><li>CONIT d.o.o.</li><li>CRASH CENTAR D.O.O</li><li>CREDO d.o.o.</li><li>CVRČAK d.o.o.</li><li>D&amp;B COMPANY d.o.o.</li><li>DA LUCA PIZZERIA d.o.o.</li><li>DABEL d.o.o.</li><li>DALMA SMR</li><li>DANKOP GRADNJA</li><li>DEMIMETAL d.o.o.</li><li>DERMAMANUM d.o.o.</li><li>DEWACO d.o.o.</li><li>DINARA-ROMANIJA PDB COMPANY d.o.o.</li><li>DIVIJE CENTAR d.o.o.</li><li>D-MARKET SZTR</li><li>DO-ING d.o.o.</li><li>DOMKO d.o.o.</li><li>DON DON d.o.o. – Ogranak “Pekara Jakovo”</li><li>DORAPLAST d.o.o.</li><li>DOXAPRINT</li><li>DRINA PLASTIKA -86 d.o.o.</li><li>DUAL ALUMINIUM SYSTEMS d.o.o.</li><li>DUBIS d.o.o.</li><li>DUIĆ d.o.o.</li><li>DUXON d.o.o. BEOGRAD</li><li>DžAVIĆ d.o.o.</li><li>ECO SIGNAL d.o.o.</li><li>ECONOMY</li><li>EKO UNIJA SN d.o.o.</li><li>EKONOMIK SZR ELECTRUM d.o.o.</li><li>ELEZ d.o.o.</li><li>ELGRA VISION d.o.o.</li><li>ELNOS BL d.o.o.</li><li>ENC d.o.o.</li><li>ENERGO DRAGON</li><li>ENERGO FRIGO PR</li><li>ENERGO PROJEKT OPREMA A.D.</li><li>ENERGOPLAST d.o.o.</li><li>ENTERO d.o.o.</li><li>ESTRIMA d.o.o.</li><li>EURO BRAVO d.o.o.</li><li>EUROCLINER VETASTIL SA</li><li>EUROCONFORT d.o.o.</li><li>EUROICC d.o.o. EUROKANCOM d.o.o.</li><li>EUROMODUL d.o.o. EUROPLASTIC d.o.o.</li><li>EUROSTIL GRADNJA D.O.O.</li><li>EUROŠPED d.o.o.</li><li>EVROPA KOMERC d.o.o.</li><li>F.A.O. SZR</li><li>FABBRICA d.o.o.</li><li>FAMILY M INVEST DOO BEOGRAD</li><li>FEMIC CO d.o.o.</li><li>FEROMETAL- INTER d.o.o.</li><li>FEROMONT d.o.o.</li><li>FIRESTOP INTERNACIONAL d.o.o.</li><li>FK BSK 1925</li><li>FLUX PRO d.o.o.</li><li>FLUX TECHNOLOGY d.o.o.</li><li>FLY FRIGO PR</li><li>FORM METAL d.o.o.</li><li>FORMA BRAVO</li><li>FRIGO SOPRING PR SRĐAN STANIĆ</li><li>FRIGOLED d.o.o.</li><li>G &amp; K COMPANY</li><li>GALEB SYSTEM d.o.o.</li><li>GALENIKA – MAGMASIL d.o.o.</li><li>GAMA TOURS – GOLIĆ PREDRAG PREDUZETNIK</li><li>GAZ PLUS D.O.O. BEOGRAD</li><li>GEOSONDA – GEOMEHANIKA d.o.o. Beograd</li><li>GILERA d.o.o.</li><li>GODES d.o.o.</li><li>GOPEKS CENTAR d.o.o.</li><li>GORENJE TIKI d.o.o.</li><li>GP IMAG INŽENJERING d.o.o.</li><li>Gradjevinski centar Manojlovic d.o.o.</li><li>GRADNJA MONT d.o.o.</li><li>GRADSKO PROLEĆE d.o.o.</li><li>GRAKOM SN d.o.o.</li><li>GRAMEX d.o.o.</li><li>GRAND ATLANTIC d.o.o.</li><li>GRANKOMERC d.o.o.</li><li>GREINER I JP PACKAGING d.o.o.</li><li>GROF NAMESTAJ d.o.o.</li><li>GUMAPLAST-RAU d.o.o.</li><li>GVOZD – TIM d.o.o.</li><li>HADRIJAN d.o.o.</li><li>HAMER TEH d.o.o.</li><li>HANAN d.o.o.</li><li>HARDEN d.o.o.</li><li>HELI VILJUŠKARI GROUP d.o.o.</li><li>HELUNA ENTERIJERI d.o.o.</li><li>HEMCO d.o.o. KRNJEŠEVCI</li><li>HIDROMONT GRADNJA d.o.o.</li><li>HIT AUTO d.o.o.</li><li>I &amp; B CAPITAL d.o.o.</li><li>IBC TECHNOLOGIES d.o.o.</li><li>IBG COEX d.o.o.</li><li>ICE PLANET &amp; CO d.o.o.</li><li>ILMONDO d.o.o.</li><li>IMCO d.o.o.</li><li>IMMOS-PLAST d.o.o.</li><li>IMOBIL CAR SECURITY d.o.o.</li><li>INDUSTRIJSKA OPREMA d.o.o.</li><li>INFOSISTEM SZR</li><li>INOVATIONS d.o.o.</li><li>INSA A.D. INDUSTRIJA SATOVA INSTALATER d.o.o.</li><li>INSTITUT ZA STOČARSTVO</li><li>INTERCLEAN d.o.o.</li><li>INTERSTEEL d.o.o.</li><li>INTESA d.o.o.</li><li>ISIS INSTALACIJE d.o.o.</li><li>ISKRA KRAJINA KOMERC d.o.o.</li><li>ISTORIJSKI MUZEJ SRBIJE</li><li>ITAL CENTAR d.o.o.</li><li>JAK</li><li>JAM MAŠINSKA OBRADA METALA</li><li>JAN EUGSTER d.o.o.</li><li>JAVNI IZVRŠITELJ ALEKSANDRA TREŠNJEV</li><li>JEVĐENIJEVIĆ B TRADE d.o.o.</li><li>JP VODOVOD I KANALIZACIJA STARA PAZOVA</li><li>KANTAR VILJUŠKARI d.o.o.</li><li>KBC ZEMUN</li><li>KD GARAŽNA VRATA d.o.o.</li><li>KNEZ AGRAR d.o.o.</li><li>KNEZ PETROL d.o.o.</li><li>KOMAZEC d.o.o.</li><li>KOMPP.CO d.o.o.</li><li>KONELEK D.O.O</li><li>KORDAL d.o.o.</li><li>KOŠAVA PREVOZ</li><li>KOVAČ MONT d.o.o.</li><li>KRAJINA- INŽENJERING d.o.o.</li><li>KRISTAL SO d.o.o.</li><li>KUĆA TEPIHA LABO M.N. d.o.o.</li><li>LATINOVIĆ-BRAV PR</li><li>LEMONT BRAVARIJA SZR</li><li>LHR d.o.o.</li><li>LIČANIN – AGRAR d.o.o.</li><li>LIGNUM d.o.o.</li><li>LIM SISTEM d.o.o.</li><li>LIMARSKA RADNJA STIKIC MILOSAV PR</li><li>LIMPLEX – TIM d.o.o.</li><li>LM SOFT NET LMB d.o.o.</li><li>LON INŽINJERING d.o.o.</li><li>LOVAČKO DRUŠTVO FAZAN</li><li>LUX ELECTRIC d.o.o.</li><li>M. MARKOVIĆ d.o.o.</li><li>M.P. PAUNOVIĆ d.o.o.</li><li>MANDA d.o.o.</li><li>MARABON d.o.o. Beograd</li><li>MARATHON- EX YU d.o.o.</li><li>MAŠA KOMERC d.o.o.</li><li>MAŠINSKA OBRADA d.o.o. BOR</li><li>MAT COMPANY d.o.o.</li><li>MAXA MONT</li><li>MAYREX d.o.o.</li><li>MB KOMERC d.o.o.</li><li>MD MONT PR MARKO KOSTIC</li><li>MEGA – ZSZ d.o.o.</li><li>MEGA PLAST JOVANOVIĆ D.O.O</li><li>MESNA ZAJEDNICA STARI BANOVCI</li><li>METAL- FLEX d.o.o.</li><li>METAL MEDIC d.o.o.</li><li>METALAC S.Z.R VELJKO GUTIC</li><li>METALIK DS – SR</li><li>METALOPROMET – M SZR</li><li>METALUNION d.o.o.</li><li>MIA DEJ-LUX d.o.o.</li><li>MIBA INŽENJERING o.d.</li><li>MIJA d.o.o.</li><li>MIKRON METAL d.o.o.</li><li>MILE KOMERC d.o.o.</li><li>MINEL GENERAL ELECTRIC d.o.o.</li><li>MIN-PROGRES d.o.o.</li><li>MIRRA CAPITAL d.o.o.</li><li>MISAL COM d.o.o.</li><li>MIŠIĆ NS TIM d.o.o.</li><li>MITROVIĆ GRADNJA d.o.o.</li><li>MK PROMONT OZR</li><li>MLEKARA SREMILK SR</li><li>MM 99 d.o.o.</li><li>MND CO 2008 d.o.o.</li><li>MODENA 2 BATAJNICA</li><li>MOMEX d.o.o.</li><li>MONT LIM MONTENA d.o.o.</li><li>MONTENEGRO PROMET d.o.o.</li><li>MONTER 1</li><li>MONTING-GROUP-SP d.o.o. Loznica</li><li>MONTING-Z d.o.o.</li><li>MOTO-PLAST d.o.o.</li><li>MR MINE</li><li>MR PVC SISTEM d.o.o.</li><li>NAMI d.o.o.</li><li>NATANEPROMET D.O.O</li><li>NETLOGIC d.o.o.</li><li>NEXE BETON d.o.o.</li><li>NIKOLČIĆ d.o.o.</li><li>NINI ČELIK d.o.o.</li><li>NIPS GROUP d.o.o.</li><li>NOBILIS AG d.o.o.</li><li>NORDIKER d.o.o.</li><li>NOVI GRAD d.o.o.</li><li>NOVI KOLEKTIV – INVEST d.o.o.</li><li>NOVO-LUX d.o.o.</li><li>NSD ELEKTRONIK d.o.o.</li><li>O.Š. BRANKO RADIČEVIĆ</li><li>O.Š. STANKO MARIĆ</li><li>Olaf &amp; McAteer d.o.o.</li><li>OLUK – MONT MV d.o.o.</li><li>ORBITAL d.o.o.</li><li>OŠ NIKOLA TESLA</li><li>OZEBLIN TRADE d.o.o.</li><li>PAĆKAN TRANS d.o.o.</li><li>PAN-ALKO SISTEM d.o.o.</li><li>PAPIRCOOP d.o.o.</li><li>PAR PAK d.o.o.</li><li>PATENTING d.o.o.</li><li>PECENJARA KUDIN MOST</li><li>PED MEDIC – SLADJANA JOVIC GAVRILOVIC PR</li><li>PERAL SISTEM d.o.o.</li><li>PICADO COMPANY d.o.o.</li><li>UGRINOVCI PICK AND ROLL d.o.o.</li><li>PINT d.o.o. Beograd</li><li>PIONEER HI-BRED SRB d.o.o.</li><li>PLA-STEEL d.o.o.</li><li>PLAZORAMA- KOMERC d.o.o.</li><li>PNEUMATIK FLEKS d.o.o.</li><li>POBEDA COMPANI d.o.o.</li><li>POBEDA NOVA</li><li>POLINS d.o.o.</li><li>POLJOBIT d.o.o.</li><li>POLJOPRIVREDNO GAZDINSTVO UMILJENOVIĆ NENAD</li><li>PP MEGA ŠOU d.o.o.</li><li>PRINT IN PLUS d.o.o.</li><li>PRO GALANT d.o.o.</li><li>PRODUKT BG INŽENJERING d.o.o.</li><li>PROFI INDUSTRIJA PR PROIMPEX DIV d.o.o.</li><li>PROMASCHINEN d.o.o.</li><li>PROMONT-INŽENJERING d.o.o.</li><li>PROMOTEHNIK d.o.o.</li><li>PROTO d.o.o.</li><li>QVATTRO COMPANY d.o.o.</li><li>RACIONALIZACIJA ENERGIJE d.o.o.</li><li>RADOVIC SZR</li><li>RADUN INŽENJERING d.o.o.</li><li>RAOB d.o.o.</li><li>RAS INŽENJERING HIDRO-S-GEO d.o.o.</li><li>RAS INŽENJERING NISKOGRADNJA d.o.o.</li><li>REFAFLEX d.o.o.</li><li>RENT EVENT d.o.o.</li><li>REXINA d.o.o.</li><li>RISTOVIĆ I SINOVI d.o.o.</li><li>RIVAL COPY d.o.o.</li><li>RM ALKON STAHL d.o.o.</li><li>RUSBIZNISAGRO d.o.o.</li><li>S d.o.o.</li><li>S.Z.T.G.R. ŠALE</li><li>SANJA PLAST SR</li><li>SATRAS d.o.o.</li><li>SAVA PROF 1869 d.o.o.</li><li>SCP d.o.o.</li><li>SDT GROUP d.o.o.</li><li>SEBRE d.o.o</li><li>SECOND NEBOJSA SIMIĆ PR</li><li>SECURITON d.o.o.</li><li>SELECTRA d.o.o.</li><li>SERVIS KUGLA</li><li>S-FRIGO d.o.o.</li><li>SIDEK INŽENJERING d.o.o.</li><li>SIGNALLING &amp; CONTROL d.o.o.</li><li>SIMAS FRIGO d.o.o.</li><li>SISTEM GRADNJA STIL d.o.o.</li><li>SKY GLASS d.o.o.</li><li>SL STUDIO</li><li>SLBR BAN-INOX</li><li>SMGR MARSTEF PLUS NIKOLA GRUJIC PR.</li><li>SMPR I TRGOVINA NA VELIKO NAPRED</li><li>SMTR KECMAN</li><li>SOKOLSKO DRUŠTVO</li><li>SOVA PLAST SR SPC d.o.o.</li><li>SR BREZA</li><li>SR INTERCROWN-PLASTIC</li><li>SR METALIKA Z</li><li>SR NIKSAN</li><li>SR OBIM</li><li>SR PETROVIĆ DUŠAN</li><li>SR PRO VAR</li><li>SR RAPID</li><li>SR SANJA IPPI ŽIKIC DRAGAN PR</li><li>SR SUPER PLAST</li><li>SR Zidarski, završni i zanatski radovi u građevinarstvu Božičković Zoran preduzetnik</li><li>SRBOAUTO d.o.o.</li><li>STEEL EXPORT d.o.o.</li><li>STOTEX d.o.o.</li><li>STOVARIŠTE KOP d.o.o.</li><li>STR MANJA-PLAST</li><li>STR RADIM GRADIM SHOP</li><li>S-TRANS d.o.o.</li><li>STV-METAL</li><li>STZR KOMISION DADO</li><li>SUPROMAX d.o.o.</li><li>SVE U MILIMETAR d.o.o.</li><li>SVETLOST TEATAR d.o.o.</li><li>SZLR KNN MIKI</li><li>SZR EKOTERM PRO</li><li>SZR FILTER CO</li><li>SZR GOLDI LIFT</li><li>SZR MAŠINAC</li><li>SZR METALAC</li><li>SZR MILOŠ RAKIĆ</li><li>SZR M-MIGIĆ</li><li>SZR MOMČILOVIĆ</li><li>SZR PLASMET</li><li>SZR POLET TOPALOVIĆ MILOVAN</li><li>SZR PROFIL MAREK ĐURO</li><li>SZR VLADA</li><li>SZTR JADRAN EKSPORT-IMPORT</li><li>SZTR MINI BOJ BORKO BORKOVIĆ PR</li><li>SZTR OKTAN ZORIC PETAR PR</li><li>SZTR S-VAGA</li><li>ŠIPOVO-FLEX</li><li>T COMPANY d.o.o.</li><li>TAURUS PLAST d.o.o.</li><li>TAZR MARUNIC</li><li>TEHNIK SISTEM d.o.o.</li><li>TEHNO INDEX d.o.o.</li><li>TEHNO RENT d.o.o.</li><li>TEHNOMEHANIKA SISTEM d.o.o.</li><li>TEHNOPAPIR d.o.o.</li><li>TEHNOPLAST d.o.o.</li><li>TEMPO-EUROPE d.o.o.</li><li>TEOMA TRANSPORT O.D.</li><li>TERMO LAB D.O.O.</li><li>TERMO TIM d.o.o.</li><li>TERMOKLIMA d.o.o.</li><li>TERMOPROJEKT d.o.o.</li><li>TIGOR TRADE d.o.o.</li><li>TIM d.o.o.</li><li>TIMICONART d.o.o.</li><li>TIRA d.o.o.</li><li>TISA INDUSTRY d.o.o.</li><li>TODOROVIĆ COMPANY d.o.o.</li><li>TP IBAR AD</li><li>TPC KVATRO d.o.o.</li><li>TR AUTO DELOVI RUSIĆ</li><li>TR NOVKOL</li><li>TRANSPORT KARANOVIC d.o.o.</li><li>TRAVEL CARD</li><li>TRGOPRODUKT – ĐUKIĆ EXPORT-IMPORT d.o.o.</li><li>TRIUMF INSTAL d.o.o.</li><li>TRON TEX d.o.o.</li><li>TRUKOM ZR ZA KOMUNALNE DELATNOSTI</li><li>TT METAL – INOX PR</li><li>TTK TRAFIC</li><li>TVIK KOLOR STR</li><li>ULTRA PAPIR 2M DOO BEOGRAD</li><li>UMPROM d.o.o.</li><li>UNA – ZORČIĆ d.o.o.</li><li>UNITEC CNC d.o.o.</li><li>UNIVERS CO d.o.o.</li><li>UNOTEHNA d.o.o.</li><li>UZELAC PLUS d.o.o.</li><li>V.A.G PRO-RED GROUP d.o.o.</li><li>VADEL d.o.o.</li><li>VALDING d.o.o.</li><li>VAŠA GRADNJA d.o.o.</li><li>VESPAK d.o.o.</li><li>VIDAK MONT SLBR VIHOR d.o.o.</li><li>VIR SISTEM d.o.o.</li><li>VIS COMPANY D.O.O.</li><li>VOLVO d.o.o.</li><li>VUČKO SR</li><li>W – GASPRO SZTR</li><li>WEST CHEMIE d.o.o.</li><li>WOOD-MATRIX d.o.o.</li><li>YUBA RADOMIR MISKOVIC d.o.o.</li><li>YUIT d.o.o.</li><li>YUTHANE d.o.o.</li><li>ZANATSKA RADNJA DŽODŽONI</li><li>ZENIT KOP d.o.o.</li><li>ZOSIMA d.o.o.</li><li>ZR ASTERIKS I OBELIKS</li><li>ZR G.M.P. HERMES GORAN NJEGOVAN PR</li><li>ZR KOVANA BRAVARIJA TOPALOVIĆ</li><li>ZR RASVETA ZR TEHNOLIM ZUR PLAY KIDS ŽEMINI d.o.o.</li><li>ŽITO DUNAV AGRO a.d.</li></ul></details>
    </div>
      </div>
    </details>
    <div class="note u-mt-40">Od 2006. TRICOM ne izlazi na gradilište kao izvođač. Novi objekti nastaju kroz saradnju sa limarskim i bravarskim radionicama — mi pripremamo materijal i galanteriju, oni montiraju.</div>
  </div>
</section>

<section class="section section--tight" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 05</p>
    <div class="ctaband" data-reveal>
      <div>
        <h3>Radite objekat i tražite pouzdanog isporučioca?</h3>
        <p>Pošaljite specifikaciju limarije i materijala. Dobijate ponudu, rok i — ako treba — savet iz šest decenija izvođačkog iskustva.</p>
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
        <li><a href="usluge.html">Usluge</a></li>
        <li><a href="konfigurator.html">Konfigurator</a></li>
        <li><a href="reference.html" aria-current="page">Reference</a></li>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["js/i18n/sr.js?v=<?= $V ?>","js/i18n/l10n.js?v=<?= $V ?>","js/assistant.js?v=<?= $V ?>","js/theme.js?v=<?= $V ?>","js/lang.js?v=<?= $V ?>","js/main.js?v=<?= $V ?>","js/items.js?v=<?= $V ?>","js/modal.js?v=<?= $V ?>","js/motion.js?v=<?= $V ?>","js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
