<?php defined('TRICOM') || exit; ?>
<?php /* Strana „about“ (sr). Ulaz: $navCats, $L, $V, $SITE, $faq. Generisano iz o-nama.html. */ ?>
<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>O nama — TRICOM d.o.o. Batajnica, metaloprerada od 1966</title>
<meta name="description" content="Porodična firma iz Batajnice od 1966: istorijat, dva objekta od 2400 m², mašinski park, sertifikati bonitetne izvrsnosti i politika kvaliteta.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>o-nama.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>o-nama.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/about.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>o-nama.html">

<meta property="og:type" content="article">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="sr_RS">
<meta property="og:title" content="O nama — TRICOM d.o.o. Batajnica, metaloprerada od 1966">
<meta property="og:description" content="Porodična firma iz Batajnice od 1966: istorijat, dva objekta od 2400 m², mašinski park, sertifikati bonitetne izvrsnosti i politika kvaliteta.">
<meta property="og:url" content="<?= $SITE ?>o-nama.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/o-nama.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="O nama — TRICOM d.o.o. Batajnica, metaloprerada od 1966">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/o-nama.jpg">

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
<link rel="stylesheet" href="css/print.css?v=<?= $V ?>" media="print">

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Početna","item":"<?= $SITE ?>"},{"@type":"ListItem","position":2,"name":"O nama","item":"<?= $SITE ?>o-nama.html"}]}
</script>
<?= site_faq_jsonld($faq, $L) ?></head>
<body class="ph-1">
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="o-nama.html" aria-current="page">O nama</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="proizvodi.html">Proizvodi</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Proizvodi — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "proizvodi.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="usluge.html">Usluge</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Usluge — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a></div></li><li class="nav__item"><a class="nav__link" href="konfigurator.html">Konfigurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="kalkulatori.html">Kalkulatori</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Kalkulatori — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></li><li class="nav__item"><a class="nav__link" href="reference.html">Reference</a></li><li class="nav__item"><a class="nav__link" href="galerija.html">Galerija</a></li><li class="nav__item"><a class="nav__link" href="kontakt.html">Kontakt</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="o-nama.html" aria-current="page">O nama</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Proizvodi<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "proizvodi.html") ?><a href="proizvodi.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge">Usluge<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a><a href="usluge.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="konfigurator.html">Konfigurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Kalkulatori<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="reference.html">Reference</a></div><div class="mnav__group"><a class="mnav__link" href="galerija.html">Galerija</a></div><div class="mnav__group"><a class="mnav__link" href="kontakt.html">Kontakt</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Prodaja</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">E-pošta</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="kontakt.html#upit">Zatražite ponudu</a>
    </div>
  </div>
</div>

<section class="pagehead tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">1966</span></div>
  <div class="pagehead__media ph-frame ph-frame--head" aria-hidden="true"><span class="ph-tab">TRICOM · <b class="ph-n"></b></span></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Putanja"><a href="index.html">Početna</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">O nama</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">Tradicija koja se retko sreće <span class="lt">na našim prostorima.</span></h1>
        <p class="lead">Nakon višedecenijskog rada TRICOM je danas pouzdan poslovni partner mnogih izvođača radova, a TRICOM limovi i metalna galanterija prisutni su na najekskluzivnijim objektima Beograda i Srbije.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14.5 8 22l4-2.2L16 22l-1-7.5"/></svg> Osnovano 1966.</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section" data-num="01" data-rail-label="O firmi">
  <div class="wrap">
    <p class="sectionix">01 / 09</p>
    <div class="split split--60">
      <div class="prose">
        <p class="lead">Trivanovići, još predratni kovači i limari, 1966. otvaraju limarsko-bravarsku radionicu koja će 1992. prerasti u preduzeće i proširiti delatnost na trgovinu metalom i metalnom galanterijom.</p>
        <p>Danas je TRICOM prvenstveno orijentisan na izradu i isporuku svih limarskih proizvoda neophodnih u građevinarstvu, kao i na prodaju neophodnog pratećeg pribora, opreme, alata i sredstava za limare i bravare.</p>
        <p>Upravo ovakav razvojni put i bogato iskustvo u metaloprerađivačkim i metaloizvođačkim radovima jesu razlog zašto većina dojučerašnjih kolega sa gradilišta — limari, bravari i izvođači radova iz šireg okruženja — upravo u TRICOM-u nalaze pouzdanog poslovnog saradnika.</p>

        <h3>Biti u trendu</h3>
        <p>Da bismo zadovoljili zahteve tržišta, imamo savremene mašine za sečenje lima: makaze, CNC plazmu i gasno rezanje. Proizvodimo pokrivni trapezni lim, oluke i vertikale dužine po želji kupca, lamperiju i građevinsku limariju — uvale, iksne, veterlajsne, okapnice i ostalo.</p>
        <p>Pored toga, za naše kupce nudimo šavne cevi, limove u koturu i tablama — pocinkovane, aluminijumske, bakarne, hladno- i toplovaljane, bojene i inoks — te kovane profile i prateći materijal.</p>
      </div>

      <div class="sticky">
        <nav class="tocnav g-card" id="tocnav" aria-label="Sadržaj strane">
          <a href="#sve-na-jednom-mestu">Sve na jednom mestu</a>
          <a href="#istorijat">Istorijat</a>
          <a href="#kapaciteti">Kapaciteti i mašinski park</a>
          <a href="#sertifikati">Sertifikati i bonitet</a>
          <a href="#kvalitet">Politika kvaliteta</a>
          <a href="#zajednica">Društvena odgovornost</a>
          <a href="#mediji">Iz medija</a>
          <a href="#faq">Česta pitanja</a>
        </nav>

        <div class="infoblock u-mt-32">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> Gde smo</h3>
          <dl>
            <div class="infoline"><dt>PRODAJA</dt><dd>Kneza Paskača 16–18, Batajnica</dd></div>
            <div class="infoline"><dt>HALA</dt><dd>Ugrinovci, Zemun — 1600 m²</dd></div>
            <div class="infoline"><dt>RADNO VREME</dt><dd><?= site_c('hours', 'sr') ?></dd></div>
            <div class="infoline"><dt>PIB</dt><dd><button class="mono u-accent" type="button" data-copy="100093247">100093247</button></dd></div>
            <div class="infoline"><dt>MATIČNI BROJ</dt><dd><button class="mono u-accent" type="button" data-copy="06660231">06660231</button></dd></div>
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
        <p class="marker">Princip rada</p>
        <h2 data-reveal="cut">Sve na jednom mestu.</h2>
        <div class="shead__aside">
          <p>Osnovna zamisao funkcionisanja preduzeća je da poslovnim partnerima omogućimo kupovinu materijala i proizvoda <strong>u fazi isporuke koja im odgovara</strong>. Obradu limova i proizvodnju galanterije rade iskusni radnici na savremenim mašinama — zato dojučerašnje kolege sa gradilišta, limari, bravari i izvođači iz šireg okruženja, u TRICOM-u nalaze pouzdanog saradnika.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <figure class="about-fig about-fig--wide shape-a theme-img"><picture class="img-light"><source srcset="assets/render/sheet-stack-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?>" srcset="assets/render/sheet-stack-light-620w.webp?v=<?= $V ?> 620w, assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?> 1230w" sizes="(max-width: 700px) 84vw, 609px" data-orig="assets/render/sheet-stack-light.jpg?v=<?= $V ?>" alt="Limovi u tablama" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="img-dark"><source srcset="assets/render/sheet-stack-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/sheet-stack-dark.jpg?v=<?= $V ?>" alt="Limovi u tablama" width="2400" height="1500" loading="lazy" decoding="async"></picture></figure>
      </div>
    </div>

    <div class="grid g4">
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Materijal</h3><p>U fabričkom pakovanju — tabla, kotur, šipka, cev. Bez dorade, kada partner ima svoj pogon.</p></div>
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Obrada</h3><p>U obliku, količini i izgledu koji partner želi. Sečenje, savijanje, profilisanje, grifovanje.</p></div>
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Proizvod</h3><p>Konkretan element koji je partneru potreban — oluk, opšivka, gazište, kanal, panel.</p></div>
      <div class="card g-card" data-reveal data-reveal-group="p4"><h3>Preuzimanje</h3><p>Preuzimanje u Batajnici; za isporuku se raspitajte u prodaji — dogovara se uz narudžbinu.</p></div>
    </div>

    <div class="split u-mt-48">
      <div>
        <h3 class="u-mb-24">Obrada limova i galanterije</h3>
        <ul class="checklist">
          <li>Sečenje limova elektromotornim ili hidrauličnim makazama — do <strong>13 mm</strong> debljine, odnosno do <strong>9 mm</strong> za prohromske limove</li>
          <li>Podužno sečenje (slitovanje) i premotavanje limova u koturu — do <strong>1260 mm</strong> širine</li>
          <li>Savijanje limova — deformacija, oblikovanje, rundovanje</li>
          <li>Izrada trapeznih pokrivnih limova</li>
          <li>Prateće usluge — isecanje uglova, varenje i sečenje čeličnih profila</li>
        </ul>
      </div>
      <div>
        <h3 class="u-mb-24">Program limova, profila i opreme</h3>
        <ul class="checklist">
          <li>Limovi — pocinkovani, bakarni, aluminijumski, crni HVL i TVL, bojeni; trapezni, pokrivni i parapetni</li>
          <li>Čelični profili, hladno oblikovane cevi i ZP profili</li>
          <li>Šrafovska roba i materijal za bravare — okovi, brave, šiljci za ograde, burgije</li>
          <li>Aluminijumski profili, lamperija i lajsne</li>
          <li>Aparati, prateći materijal i oprema za varenje <strong>Varstroj</strong></li>
          <li>Alati — <strong>Bosch, Makita, DeWalt, Stanley, Black &amp; Decker</strong></li>
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
        <p class="marker">Istorijat</p>
        <h2 data-reveal="cut">Šest decenija u metalu.</h2>
        <div class="shead__aside">
          <p>Od kovačke radionice, preko preduzeća za trgovinu metalom, do proizvođača limarske galanterije sa sopstvenim CNC pogonom.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <figure class="about-fig about-fig--wide shape-c theme-img"><picture class="img-light"><source srcset="assets/render/coil-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/coil-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/coil-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/coil-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 84vw, 609px" data-orig="assets/render/coil-light.jpg?v=<?= $V ?>" alt="Lim u koturu" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="img-dark"><source srcset="assets/render/coil-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/coil-dark.jpg?v=<?= $V ?>" alt="Lim u koturu" width="2400" height="1500" loading="lazy" decoding="async"></picture></figure>
      </div>
    </div>
    <div class="timeline about-tl" id="timeline"><div class="timeline__rail" aria-hidden="true"><i></i></div>
    <article class="tl-item">
      <div class="tl-item__year">1966.</div>
      <h3 class="tl-item__title">Radionica Trivanović počinje sa radom</h3>
      <p>Porodica Trivanović, kovači i limari još pre Drugog svetskog rata, otvara limarsko-bravarsku radionicu. Osnovna delatnost je limarska galanterija, izrada i montaža limarskih profila, krovopokrivački radovi, ventilacija i klimatizacija, izrada bravarske galanterije te lakih i srednjih konstrukcija — sa izkivanjem i termičkom obradom.</p>

    </article>
    <article class="tl-item">
      <div class="tl-item__year">1992.</div>
      <h3 class="tl-item__title">Radionica prerasta u preduzeće</h3>
      <p>Delatnost se širi na trgovinu metalom i metalnom galanterijom, a značajno se povećava asortiman mašina, opreme i alata za radioničke doradne poslove. Time postaje moguća izrada komplikovanijih metalnih proizvoda. Radionica i preduzeće izvodili su radove u svim republikama bivše Jugoslavije; iz tog izvođačkog perioda ostali su radovi na zahtevnim objektima:</p>
      <ul><li>Rad na visini preko 30 m — limarska galanterija i spusne vertikale na Kliničkom centru Srbije; preko 50 m na stambenim objektima u Beogradu, silosima, MPI i šećeranama.</li><li>Velike količine materijala — kompletni krovopokrivački i limarski radovi od bakarnog lima, preko 30 t bakra, na Rezidenciji predsednika republike u Karađorđevu.</li><li>Komplikovani limarski radovi — bakarni krovovi predsedničke rezidencije u Beogradu, više desetina vila na Dedinju koje koriste diplomatsko-konzularna predstavništva, pozorište KPGT u staroj šećerani, radovi ventilacije i klimatizacije, mlinovi, poslovne zgrade i proizvodne hale domaćih i stranih firmi.</li></ul>
    </article>
    <article class="tl-item">
      <div class="tl-item__year">2006.</div>
      <h3 class="tl-item__title">Kraj montaže, fokus na proizvodnju i prodaju</h3>
      <p>Doneta je strateška odluka da firma više ne radi montažu, već da primarna delatnost budu proizvodnja i prodaja metalnih proizvoda u građevinarstvu i metaloprerađivačkoj industriji. Razlog je jasan: pojavom na terenu kao izvođač dolazilo je do sukoba interesa sa zanatskim radionicama i preduzećima koja od nas kupuju materijal i kojima pripremamo limarsku galanteriju za montažu. Dugogodišnje izvođačko iskustvo se od tada koristi savetodavno — kao konsalting prema komitentima.</p>

    </article>
    <article class="tl-item">
      <div class="tl-item__year">2009.</div>
      <h3 class="tl-item__title">Nova hala i centralni magacin u Ugrinovcima</h3>
      <p>Izgrađena je proizvodna hala i centralni magacin u Ugrinovcima, Zemun, površine 1600 m². Zajedno sa postojećim objektom u Batajnici od 800 m², kapaciteti su opremljeni plazmom za sečenje do 30 mm i gasno rezanje do 150 mm, hidrauličnim makazama do 13 mm, NC presom od 3 m, profilirkama za oluk i vertikalu i za TR lim, apipongom od 8,2 m, mašinom za parapet, mašinom za lamperiju, trakastim testerama i raznim presama. Nivo proizvodnje i usluga je značajno povećan, pa i u uslovima ekonomske krize preduzeće beleži rast rezultata poslovanja.</p>

    </article></div>
  </div>
</section>

<section class="section dark dark--deep tex-grid" id="kapaciteti" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Kapaciteti</p>
        <h2 data-reveal="cut">Dva objekta, 2400 m², kompletan mašinski park.</h2>
      </div>
      <div class="shead__aside">
        <p>Objekat u Batajnici od 800 m² i proizvodno-skladišna hala u Ugrinovcima od 1600 m² opremljeni su za obradu lima od najtanjeg kotura do ploče od 150 mm.</p>
      </div>
    </div>

    <figure class="ph-frame ph-frame--cap u-mb-40" aria-hidden="true" data-reveal><img src="assets/tricom-3.jpg?v=<?= $V ?>" srcset="assets/tricom-3-960.webp?v=<?= $V ?> 960w, assets/tricom-3.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 03</figcaption></figure>

    <div class="trows about-trows" data-reveal>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M6 72V42l32-16 32 16v30"/><path d="M26 72V54h24v18M14 50v22M58 50v22"/><path d="M76 72V54l19-14 19 14v18"/><path d="M90 72V62h10v10"/><path d="M2 72h116"/></svg></div>
        <div class="trow__body"><p class="about-val">2400 m²</p><h3>Dva objekta</h3><p>Batajnica 800 m² · Ugrinovci (Zemun) 1600 m²</p></div>
        <div class="trow__anno"><span><b>800 m²</b> Batajnica</span><span><b>1600 m²</b> Ugrinovci (Zemun)</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><rect x="10" y="40" width="100" height="34" rx="2"/><circle cx="44" cy="57" r="9"/><path d="M78 50l10 7-10 7zM62 10v26M56 36h12"/><path d="M54 44l-4 6M74 44l4 6"/></svg></div>
        <div class="trow__body"><p class="about-val">30 / 150 mm</p><h3>CNC plazma i gasno rezanje</h3><p>Radni sto 2,5 × 8 m, kompjuterski vođeno</p></div>
        <div class="trow__anno"><span><b>2,5 × 8 m</b> radni sto</span><span><b>CNC</b> kompjuterski vođeno</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M6 62h108v10H6zM12 62v-4h96v4"/><path d="M18 22l86 26v8L22 32z"/><path d="M104 48v10"/></svg></div>
        <div class="trow__body"><p class="about-val">do 13 mm</p><h3>Hidraulične makaze</h3><p>Čelik i obojeni metali; inox do 9 mm</p></div>
        <div class="trow__anno"><span><b>13 mm</b> čelik i obojeni metali</span><span><b>9 mm</b> inox</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M8 74h30l22-20 22 20h30"/><path d="M54 10h12v26H54z"/><path d="M60 50L48 36h24z"/><path d="M14 62l46-10 46 10" stroke-dasharray="3 4"/></svg></div>
        <div class="trow__body"><p class="about-val">3 m</p><h3>NC presa</h3><p>Savijanje i oblikovanje limova</p></div>
        <div class="trow__anno"><span><b>3 m</b> NC presa</span><span><b>NC</b> savijanje i oblikovanje</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M8 74L40 50h40l32 24"/><path d="M8 66L40 42h40l32 24M40 42v8M80 42v8"/><path d="M12 24h96M12 19v10M108 19v10"/></svg></div>
        <div class="trow__body"><p class="about-val">8,2 m</p><h3>Apkant presa</h3><p>Dugačke opšivke i profili u jednom prolazu</p></div>
        <div class="trow__anno"><span><b>8,2 m</b> apkant</span><span><b>jedan prolaz</b> opšivke i profili</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="40" cy="24" r="9"/><circle cx="80" cy="24" r="9"/><path d="M6 40h108"/><path d="M6 72h10l8-16h14l8 16h14l8-16h14l8 16h10"/></svg></div>
        <div class="trow__body"><p class="about-val">dužina po meri</p><h3>Profilirke</h3><p>Oluk i vertikala, TR lim, parapet, lamperija</p></div>
        <div class="trow__anno"><span><b>po meri</b> dužina</span><span><b>TR lim</b> oluk · vertikala · parapet · lamperija</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="32" cy="50" r="22"/><circle cx="32" cy="50" r="7"/><path d="M54 42h60M54 50h60M54 58h60"/><path d="M84 34v32"/></svg></div>
        <div class="trow__body"><p class="about-val">do 1260 mm</p><h3>Linija za slitovanje</h3><p>Podužno sečenje i premotavanje kotura</p></div>
        <div class="trow__anno"><span><b>1260 mm</b> kotur</span><span><b>slitovanje</b> podužno sečenje · premotavanje</span></div>
      </div>
      <div class="trow">
        <div class="trow__n"></div>
        <div class="trow__svg" aria-hidden="true"><svg viewBox="0 0 120 90"><circle cx="30" cy="24" r="12"/><circle cx="30" cy="66" r="12"/><path d="M42 24v42M18 24v42"/><path d="M58 72h54M58 50v22M58 50h12v22"/></svg></div>
        <div class="trow__body"><p class="about-val">po specifikaciji</p><h3>Trakaste testere i prese</h3><p>Sečenje profila, probijanje, isecanje uglova</p></div>
        <div class="trow__anno"><span><b>po specifikaciji</b></span><span><b>profili</b> sečenje · probijanje · isecanje uglova</span></div>
      </div>
    </div>
    <details class="more u-mt-32"><summary class="mono">Ceo mašinski park, po mašinama</summary><div class="tbl-glass u-mt-16"><div data-catalog="machines-short"></div></div></details>
  </div>
</section>

<section class="section soft" id="sertifikati" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Sertifikati i bonitet</p>
        <h2 data-reveal="cut">Ocene poslovanja koje se mogu proveriti.</h2>
      </div>
      <div class="shead__aside">
        <p>Osnovna svrha ovih sertifikata, koja se poklapa sa direktivama EU, jeste da promovišu uspešna mala i srednja preduzeća, sigurno poslovanje i povećanje transparentnosti na tržištu.</p>
      </div>
    </div>
    <div class="certs">
      <div class="cert cert--gold" data-reveal data-reveal-group="c2">
        <div class="cert__grade">AAA</div>
        <h4>Zlatni sertifikat</h4><p>Bisnode Srbija, na osnovu poslovanja za 2014, 2015. i 2016. godinu. Kreditni rejting za 2017. je AAA. Zlatni sertifikat je te godine dobilo 115 pravnih subjekata od ukupno 446.449 aktivnih u Srbiji.</p><p class="u-sm"><a href="assets/old/docs/sertifikat-zlatni-AAA-2017.pdf">Sertifikat (PDF), izdat 20.10.2017.</a></p>
      </div>
      <div class="cert " data-reveal data-reveal-group="c2">
        <div class="cert__grade">AAA</div>
        <h4>Bonitetna izvrsnost</h4><p>Bisnode Srbija, na osnovu izuzetnih poslovnih rezultata u 2015. godini. Međunarodno priznata oznaka ekonomskog kvaliteta i uspešnosti preduzeća.</p><p class="u-sm"><a href="assets/old/docs/sertifikat-AAA-2015.pdf">Sertifikat (PDF), izdat 18.12.2015.</a></p>
      </div>
      <div class="cert " data-reveal data-reveal-group="c2">
        <div class="cert__grade">AA</div>
        <h4>Bonitetna izvrsnost</h4><p>Bisnode. Sertifikat je dobilo svega 2% najuspešnijih firmi u Srbiji, što ga čini priznatom referencom kvaliteta poslovanja.</p><p class="u-sm"><a href="assets/old/docs/sertifikat-AA-2014.pdf">Sertifikat (PDF), izdat 28.03.2014.</a></p>
      </div>
      <div class="cert " data-reveal data-reveal-group="c2">
        <div class="cert__grade">A</div>
        <h4>Excellent SME Serbia</h4><p>Privredna komora Srbije u saradnji sa bonitetnom kućom Coface Srbija. Kompanija je svrstana među 1% najuspešnijih u Srbiji po metodologiji European Foundation for Quality Management za 2014. godinu, sa najvišim rejtingom A — nosilac sertifikata i za 2013.</p><p class="u-sm"><a href="assets/old/docs/sertifikat-A-2015.pdf">Sertifikat A (PDF), izdat 29.01.2015.</a></p>
      </div></div>
  </div>
</section>

<section class="section" id="kvalitet" data-num="06">
  <div class="wrap">
    <p class="sectionix">06 / 09</p>
    <div class="kv-head">
      <div>
        <p class="marker">Politika kvaliteta</p>
        <h2 data-reveal="cut">Nemamo konkurenciju — imamo poslovne prijatelje.</h2>
      </div>
      <div class="quote">
          Filozofija TRICOM-a je da nema konkurenciju, već samo poslovne prijatelje i saradnike.
          <cite>Zato firma od 2006. ne izlazi na terenu kao izvođač radova.</cite>
        </div>
    </div>
    <div class="kv-intro prose">
        <p>Ta odluka je najkonkretniji izraz politike kvaliteta. Umesto da se takmičimo sa radionicama koje kod nas kupuju materijal, pripremamo im kompletnu limarsku galanteriju za montažu i stojimo im na raspolaganju savetom.</p>
        <p>Rezultat je da većina zanatskih radionica i preduzeća u metaloprerađivačkoj delatnosti iz šireg okruženja sarađuje sa nama.</p>
        <p>Zahvaljujući stalnom usponu firme, razvoju proizvodnih kapaciteta, usvajanju novih tehnologija i proširenju obima proizvodnje, TRICOM se svrstava u red najozbiljnijih proizvođača limarske galanterije i metalnih proizvoda u oblasti građevinarstva i metaloprerađivačke industrije.</p>
        <p>Cilj je da održimo i unapredimo poziciju na tržištu u pogledu kvaliteta robe, proizvoda i usluga — da budemo prepoznatljivi i da se stalno usavršavamo. Politika kvaliteta počiva na sedam principa:</p>
    </div>
    <ol class="steps-ol kv-tiles">
          <li>sistem upravljanja dokumentovan i usklađen sa standardom <strong>ISO 9001</strong> — efikasniji procesi i uslovi za stalna poboljšanja;</li>
          <li>domaćinski odnos u poslovanju — racionalizacija troškova bez narušavanja kvaliteta proizvoda i uslova rada;</li>
          <li>stalno obnavljanje opreme i korišćenje novih tehnologija — kvalitet, produktivnost i rentabilnost;</li>
          <li>kvalitetni proizvodi po zahtevima tržišta, u skladu sa međunarodnim tehničkim standardima i propisima;</li>
          <li>korektni poslovni odnosi sa kupcima, uz poštovanje ugovorenih uslova isporuke;</li>
          <li>partnerski odnosi sa dobavljačima — biramo ih po sposobnosti da ispune definisane kriterijume isporuke;</li>
          <li>učešće u sportskim, kulturnim i humanitarnim manifestacijama — doprinos kvalitetnijem životu zajednice.</li>
        </ol>
    <div class="kv-foot">
      <div class="prose">
        <p>Predstavnik rukovodstva za kvalitet odgovoran je za obezbeđenje procesa potrebnih za primenu i održavanje sistema menadžmenta kvalitetom. Svi zaposleni prihvataju i razvijaju kulturu kvaliteta i rade u skladu sa ovom politikom i ciljevima kvaliteta.</p>
        <p class="mono muted u-sm">Direktor: Dragan Trivanović</p>
      </div>
      <div class="note">Radni nalog koji naručilac potpisuje deo je iste logike: specifikacija je fiksirana pre početka izrade, pa je pri preuzimanju jasno gde je greška nastala — kod proizvođača ili u specifikaciji.</div>
    </div>
    <figure class="ph-frame ph-frame--pano u-mt-48" aria-hidden="true" data-reveal><img src="assets/tricom-2.jpg?v=<?= $V ?>" srcset="assets/tricom-2-960.webp?v=<?= $V ?> 960w, assets/tricom-2.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 02</figcaption></figure>
  </div>
</section>

<section class="section soft" id="zajednica" data-num="07">
  <div class="wrap">
    <p class="sectionix">07 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Društvena odgovornost</p>
        <h2 data-reveal="cut">Zanat se prenosi, ne čuva.</h2>
      </div>
    </div>
    <div class="grid g3">
      <div class="card g-card" data-reveal><h3>Obrazovna saradnja</h3><p>TRICOM ima sporazum o poslovno-tehničkoj saradnji sa <a href="https://atssb.edu.rs/" rel="noopener">Akademijom tehničkih strukovnih studija u Beogradu</a> (Univerzitet u Beogradu), potpisan 2022. godine. Saradnja obuhvata obrazovanje i obuku, stručno-istraživačku i umetničku delatnost i druge oblike zajedničkog rada.</p></div>
      <div class="card g-card" data-reveal><h3>Društvene akcije</h3><p>Zamisao je pomoć lokalnoj zajednici — kvalitetniji život, čistija okolina i, naročito, pomoć mladima da ispravno trasiraju svoj put. Firma učestvuje u sportskim manifestacijama i humanitarnim akcijama u Batajnici: turnir u malom fudbalu „Mala Milica Rakić“ (2004 — polufinale, 2005 — četvrtfinale), turnir u Inđiji 2005 (osmina finala). Za društveno koristan rad i humanitarne akcije firma je dobila niz zahvalnica.</p></div>
      <div class="card g-card" data-reveal><h3>Klub prijatelja UNICEF-a</h3><p>Kompanija je član Kluba prijatelja UNICEF-a.</p></div>
    </div>
  </div>
</section>

<section class="section" id="mediji" data-num="08">
  <div class="wrap">
    <p class="sectionix">08 / 09</p>
    <div class="shead">
      <div>
        <p class="marker">Iz medija</p>
        <h2 data-reveal="cut">Preduzetnik iz Batajnice.</h2>
      </div>
      <div class="shead__aside">
        <p>Dragan Trivanović je radio kao profesor u školi; 1995. napušta taj poziv i preuzima unapređenje porodičnog posla. Mediji su firmu pratili kroz preduzetničke konkurse.</p>
      </div>
    </div>
    <div class="grid g3">
      <div class="card g-card" data-reveal data-reveal-group="md"><h3>EY Preduzetnik godine 2014</h3><p>Dragan Trivanović (Tricom) među učesnicima konkursa EY Preduzetnik godine 2014 — portret u katalogu konkursa: od zanatske radnje do proizvođača limarske galanterije sa uslugama obrade metala.</p><p class="u-sm"><a href="assets/old/docs/ey-preduzetnik-godine-2014.pdf">Članak (PDF)</a> · <a href="assets/old/docs/ey-ucesnici-konkursa-2014.pdf">Učesnici konkursa 2014 (PDF)</a></p></div>
      <div class="card g-card" data-reveal data-reveal-group="md"><h3>Blic preduzetnik 2013</h3><p>TRICOM među kandidatima za nagradu „Blic preduzetnik 2013“ (nagrada od 20.000 evra). Članak „Najpoželjniji poslodavci — od zanatske radionice do preduzeća“: proizvodnja na dve lokacije, Batajnica i Ugrinovci; firma je tada zapošljavala 15 radnika.</p><p class="u-sm"><a href="assets/old/docs/blic-preduzetnik-2013.pdf">Isečak (PDF)</a></p></div>
      <div class="card g-card" data-reveal data-reveal-group="md"><h3>N1 — „Svet novca“</h3><p>Reportaža u emisiji „Svet novca“: preduzetnici o problemima sa birokratijom.</p><p class="u-sm"><a href="http://rs.n1info.com/a60138/Video/Info/Preduzetnici-o-problemima-sa-birokratijom.html" rel="noopener">Video na N1</a></p></div>
    </div>
  </div>
</section>

<section class="section soft" id="faq" data-num="09">
  <div class="wrap">
    <p class="sectionix">09 / 09</p>
    <div class="split split--40">
      <div class="sticky">
        <p class="marker">Česta pitanja</p>
        <h2 data-reveal="cut">Uslovi poslovanja, bez sitnih slova.</h2>
        <button class="btn btn--ghost u-mt-24" type="button" data-ask="Da li radite montažu?">Pitajte asistenta</button>
      </div>
      <div><div class="acc" data-acc="single" id="faq2"><?= site_faq_items($faq, $L) ?></div></div>
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
        <li><a href="o-nama.html" aria-current="page">O nama</a></li>
        <li><a href="proizvodi.html">Proizvodi</a></li>
        <li><a href="usluge.html">Usluge</a></li>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["js/i18n/sr.js?v=<?= $V ?>","js/i18n/l10n.js?v=<?= $V ?>","js/catalog.js?v=<?= $V ?>","js/catalog-render.js?v=<?= $V ?>","js/assistant.js?v=<?= $V ?>","js/theme.js?v=<?= $V ?>","js/lang.js?v=<?= $V ?>","js/main.js?v=<?= $V ?>","js/motion.js?v=<?= $V ?>","js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
