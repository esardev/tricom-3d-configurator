<?php defined('TRICOM') || exit; ?>
<?php /* Strana „plasma“ (sr). Ulaz: $navCats, $L, $V, $SITE. Generisano iz plazma.html. */ ?>
<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>CNC plazma do 30 mm, gasno rezanje do 150 mm | TRICOM</title>
<meta name="description" content="CNC plazma: čelik, inox, bakar i aluminijum do 30 mm, gasno rezanje do 150 mm, sto 2,5 × 8 m. Radimo po DXF, DWG, PDF ili skici sa kotama.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>plazma.html">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>plazma.html">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/plasma-cutting.html">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>plazma.html">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="sr_RS">
<meta property="og:title" content="CNC plazma do 30 mm, gasno rezanje do 150 mm | TRICOM">
<meta property="og:description" content="CNC plazma: čelik, inox, bakar i aluminijum do 30 mm, gasno rezanje do 150 mm, sto 2,5 × 8 m. Radimo po DXF, DWG, PDF ili skici sa kotama.">
<meta property="og:url" content="<?= $SITE ?>plazma.html">
<meta property="og:image" content="<?= $SITE ?>assets/og/plazma.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="CNC plazma do 30 mm, gasno rezanje do 150 mm | TRICOM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/plazma.jpg">

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
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Početna","item":"<?= $SITE ?>"},{"@type":"ListItem","position":2,"name":"Sečenje na CNC plazmi","item":"<?= $SITE ?>plazma.html"}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"U kom formatu treba da pošaljem nacrt?","acceptedAnswer":{"@type":"Answer","text":"Najbolje je DXF ili DWG, jer se direktno ubacuje u program mašine bez precrtavanja. Radimo i po PDF nacrtu, tehničkom crtežu ili čitkoj skici sa kotama. Ako imate samo postojeći komad, možete ga doneti — snimićemo mere i napraviti nacrt."}},{"@type":"Question","name":"Koje materijale sečete na plazmi?","acceptedAnswer":{"@type":"Answer","text":"Obojene metale, sve vrste čelika i prohromske limove. Konkretno: crni čelik (HVL i TVL), inox, bakar i aluminijum. Debljina do 30 mm; iznad toga prelazimo na gasno rezanje, do 150 mm."}},{"@type":"Question","name":"Da li treba da sam rasporedim delove po tabli?","acceptedAnswer":{"@type":"Answer","text":"Ne morate. Raspored delova po tabli (ugnježdavanje) obično se dogovara pri prijemu specifikacije — radni sto od 2,5 × 8 m ostavlja prostora da se iz jedne table izvuče više komada. Po pravilu, cela specifikacija poslata odjednom daje manje otpada nego naručivanje komad po komad."}},{"@type":"Question","name":"Kakav rez ostaje posle plazme?","acceptedAnswer":{"@type":"Answer","text":"Plazma ostavlja usku zonu toplotnog uticaja i blagi kosi rez, a na donjoj ivici može ostati sitna troska koja se lako uklanja. Ako vam je potrebna glatka ivica bez dorade, recite unapred — savetovaćemo da li je za vaš deo bolje sečenje makazama ili dodatna obrada."}},{"@type":"Question","name":"Koliko traje izrada?","acceptedAnswer":{"@type":"Answer","text":"Zavisi od trenutnog opterećenja pogona i od toga da li je materijal na lageru. Rok se dogovara uz ponudu i potvrđuje radnim nalogom — proverite ga sa prodajom pre naručivanja."}}]}
</script>
</head>
<body class="ph-3">
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="o-nama.html">O nama</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="proizvodi.html">Proizvodi</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Proizvodi — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "proizvodi.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="usluge.html" aria-current="true">Usluge</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Usluge — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plazma.html" aria-current="page">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a></div></li><li class="nav__item"><a class="nav__link" href="konfigurator.html">Konfigurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="kalkulatori.html">Kalkulatori</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Kalkulatori — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></li><li class="nav__item"><a class="nav__link" href="reference.html">Reference</a></li><li class="nav__item"><a class="nav__link" href="galerija.html">Galerija</a></li><li class="nav__item"><a class="nav__link" href="kontakt.html">Kontakt</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="o-nama.html">O nama</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Proizvodi<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "proizvodi.html") ?><a href="proizvodi.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge" data-current="true">Usluge<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plazma.html" aria-current="page">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a><a href="usluge.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="konfigurator.html">Konfigurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Kalkulatori<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="reference.html">Reference</a></div><div class="mnav__group"><a class="mnav__link" href="galerija.html">Galerija</a></div><div class="mnav__group"><a class="mnav__link" href="kontakt.html">Kontakt</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Prodaja</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">E-pošta</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="kontakt.html#upit">Zatražite ponudu</a>
    </div>
  </div>
</div>

<section class="pagehead pagehead--3 tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2">PLAZMA</span></div>
  <div class="pagehead__media" aria-hidden="true"><div class="hero3d" data-hero3d="plate"><div class="hero3d__still is-on" data-obj="plate"></div></div></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="Putanja"><a href="index.html">Početna</a><span class="sep" aria-hidden="true">/</span><a href="usluge.html">Usluge</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">CNC plazma</span></nav>
    <div class="split split--60">
      <div>
        <h1 data-reveal="cut">CNC plazma. <span class="lt">Kompjuter vodi rez, ne ruka.</span></h1>
        <p class="lead">Mašina je u potpunosti kompjuterski vođena, pa je mogućnost greške svedena na minimum. Sečemo brzo, precizno i sa minimalnom količinom otpada — od pojedinačnog komada do serije sa punom ponovljivošću.</p>
      </div>
      <div><div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5M12 17v5M4.2 4.2l3.6 3.6M16.2 16.2l3.6 3.6M2 12h5M17 12h5M4.2 19.8l3.6-3.6M16.2 7.8l3.6-3.6"/><circle cx="12" cy="12" r="3"/></svg> do 30 mm &middot; sto 2,5 × 8 m</div></div>
    </div>
  </div>
</section>

<main id="main">

<section class="section--tight" data-num="01" data-rail-label="Mogućnosti mašine">
  <div class="wrap">
    <p class="sectionix">01 / 05</p>
    <div class="tbl-glass svc-sheet" data-reveal>
    <div class="caps">
      <?php if (site_item_on('secenje-cnc-plazma')): ?><div data-item="secenje-cnc-plazma" class="cap"><div class="cap__t">Plazma sečenje</div><div class="cap__d">Čelik, inox, bakar, aluminijum — složene konture, rupe, proreze</div><div class="cap__v">do 30 mm</div></div><?php endif; ?>
      <?php if (site_item_on('gasno-rezanje')): ?><div data-item="gasno-rezanje" class="cap" id="gasno"><div class="cap__t">Gasno rezanje</div><div class="cap__d">Debele ploče i masivni pripremci</div><div class="cap__v">do 150 mm</div></div><?php endif; ?>
      <?php if (site_item_on('radni-sto')): ?><div data-item="radni-sto" class="cap"><div class="cap__t">Radni sto</div><div class="cap__d">Ugnježdavanje više delova iz jedne table</div><div class="cap__v">2,5 × 8 m</div></div><?php endif; ?>
      <?php if (site_item_on('ponovljivost')): ?><div data-item="ponovljivost" class="cap"><div class="cap__t">Ponovljivost</div><div class="cap__d">Isti program — isti deo, od prvog do poslednjeg komada</div><div class="cap__v">CNC program</div></div><?php endif; ?>
    </div>
    </div>
  </div>
</section>

<section class="section soft" data-num="02">
  <div class="wrap">
    <p class="sectionix">02 / 05</p>
    <div class="split split--60 u-start">
      <div class="prose">
        <p class="marker">Kako to radi</p>
        <h2 class="u-mb-24" data-reveal="cut">Luk pretvara gas u plazmu, plazma pretvara metal u paru.</h2>
        <p>Između elektrode u glavi i same table uspostavlja se električni luk. Kroz njega se pod pritiskom propušta gas koji se jonizuje i prelazi u plazmu — mlaz temperature više desetina hiljada stepeni koji lokalno istopi i ispari metal, dok isti mlaz izbacuje rastop iz reza.</p>
        <p>Pošto se glava kreće po programu, a ne po ruci operatera, oblik reza je tačno onaj sa nacrta. Zato je plazma nezamenljiva svuda gde rez nije prava linija: konture, radijusi, rupe, proreze, ugnježdeni delovi.</p>
        <p><strong>Praktična posledica za vas:</strong> kada cela specifikacija stigne odjednom, delovi se mogu rasporediti po tabli tako da otpad bude najmanji. Kod naručivanja komad po komad to nije moguće, a razlika u ceni po delu ume da bude značajna.</p>

        <h3>Šta plazma ne može</h3>
        <p>Plazma ostavlja usku zonu toplotnog uticaja, blagi kosi rez i moguću sitnu troske na donjoj ivici. Za većinu konstruktivnih i limarskih primena to nije problem. Ako vam treba ivica bez ikakve dorade, recite unapred — za ravne rezove su makaze po pravilu bolji i jeftiniji izbor.</p>
      </div>

      <div class="sticky svc-twin">
        <div class="svc-cap shape-b">
          <picture class="theme-img theme-img--light"><source srcset="assets/render/plasma-plate-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/plasma-plate-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 88vw, 524px" data-orig="assets/render/plasma-plate-light.jpg?v=<?= $V ?>" alt="Čelična ploča isečena na CNC plazmi — konture, rupe i prorezi" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="assets/render/plasma-plate-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/plasma-plate-dark.jpg?v=<?= $V ?>" alt="Čelična ploča isečena na CNC plazmi — konture, rupe i prorezi" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
        <div class="svc-cap svc-cap--pill shape-c">
          <picture class="theme-img theme-img--light"><source srcset="assets/render/xray-sheet-layers-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/xray-sheet-layers-light-2400w.webp?v=<?= $V ?>" srcset="assets/render/xray-sheet-layers-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/xray-sheet-layers-light-2400w.webp?v=<?= $V ?> 2400w" sizes="(max-width: 700px) 88vw, 524px" data-orig="assets/render/xray-sheet-layers-light.jpg?v=<?= $V ?>" alt="Slojevi table lima — providni prikaz" width="2000" height="1250" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="assets/render/xray-sheet-layers-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/xray-sheet-layers-dark.jpg?v=<?= $V ?>" alt="Slojevi table lima — providni prikaz" width="2000" height="1250" loading="lazy" decoding="async"></picture>
        </div>
        <p class="figcap">Širina reza (kerf), kosina bočne strane i zona toplotnog uticaja zavise od debljine i materijala.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 05</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">Priprema</p>
        <h2 data-reveal="cut">Šta nam poslati da bismo odmah dali cenu.</h2>
        <div class="shead__aside">
          <p>Što je specifikacija kompletnija, to je ponuda tačnija i rok kraći. Minimum je materijal, debljina, količina i oblik.</p>
        </div>
      </div>
      <div class="shead__media" data-reveal="scale">
        <div class="svc-cap shape-a">
          <picture class="theme-img theme-img--light"><source srcset="assets/render/sheet-stack-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?>" srcset="assets/render/sheet-stack-light-620w.webp?v=<?= $V ?> 620w, assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?> 1230w" sizes="(max-width: 700px) 84vw, 609px" data-orig="assets/render/sheet-stack-light.jpg?v=<?= $V ?>" alt="Table lima u paketu — materijal i debljina" width="2400" height="1500" loading="lazy" decoding="async"></picture>
          <picture class="theme-img theme-img--dark"><source srcset="assets/render/sheet-stack-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/sheet-stack-dark.jpg?v=<?= $V ?>" alt="Table lima u paketu — materijal i debljina" width="2400" height="1500" loading="lazy" decoding="async"></picture>
        </div>
      </div>
    </div>

    <div class="grid numrow pstrip">
      <div data-item="dxf-dwg" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M16 4h22l10 10v30H16z"/><path d="M38 4v10h10"/><path d="M22 36l6-10 5 6 4-8 5 12"/></svg></div><h3>DXF ili DWG</h3><p>Najbolji format. Geometrija ide direktno u program mašine, bez precrtavanja i bez rizika od greške u prenosu mera.</p></div>
      <div data-item="pdf-crtez" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M16 4h22l10 10v30H16z"/><path d="M38 4v10h10"/><path d="M22 20h18v10H22z"/><path d="M22 36h18M22 34v4M40 34v4"/></svg></div><h3>PDF ili tehnički crtež</h3><p>Radimo i po PDF-u ili crtežu, ako su kote čitke i potpune. Napomenite razmeru ako crtež nije kotiran.</p></div>
      <div data-item="skica-sa-kotama" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M10 10h30v22H10z"/><path d="M10 40h30M10 38v4M40 38v4"/><path d="M48 10v22M46 10h4M46 32h4"/><circle cx="19" cy="21" r="4"/></svg></div><h3>Skica sa kotama</h3><p>Skica rukom je dovoljna za jednostavne oblike. Važno je da su sve mere upisane i da je jasno šta je spolja, a šta otvor.</p></div>
      <div data-item="uzorak-ili-fotografija" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M8 14h12l4-6h16l4 6h12v28H8z"/><circle cx="32" cy="27" r="8"/><circle cx="32" cy="27" r="3"/></svg></div><h3>Uzorak ili fotografija</h3><p>Ako imate postojeći komad, donesite ga u Batajnicu. Snimićemo mere i napraviti nacrt za mašinu. Svaku fotografiju ili sliku oblika, uz određenu korekciju, prilagođavamo rezanju na plazmi — u granicama mogućnosti mašine.</p></div>
      <div data-item="uz-nacrt-navedite" class="card" data-reveal data-reveal-group="pr"><div class="card__icon" aria-hidden="true"><svg viewBox="0 0 64 48" focusable="false"><path d="M6 24l26-12 26 12-26 12z"/><path d="M6 24v8l26 12 26-12v-8"/><path d="M60 24h4M60 32h4M62 24v8"/></svg></div><h3>Uz nacrt navedite</h3>
        <ul class="checklist">
          <li><strong>Materijal</strong> — crni čelik, inox, bakar ili aluminijum</li>
          <li><strong>Debljinu</strong> u milimetrima</li>
          <li><strong>Količinu</strong> po pozicijama, jer od nje zavisi cena i raspored po tabli</li>
          <li><strong>Da li materijal dajete vi</strong> ili ga uzimate od nas</li>
          <li><strong>Toleranciju</strong> ako je uža od uobičajene za plazmu</li>
          <li><strong>Dalju obradu</strong> — ako deo posle ide na savijanje, javite unapred zbog rasporeda vlakana i mesta krivina</li>
        </ul>
      </div>
    </div>

    <div class="u-mt-48">
      <h3 class="u-mb-24">Šta sečemo</h3>
      <div class="tbl-glass"><div class="spec-wrap"><table class="spec"><caption class="mono muted spec__cap">MATERIJALI I POSTUPCI</caption><thead><tr><th scope="col" class="spec__no">#</th><th scope="col">Materijal</th><th scope="col">Postupak</th><th scope="col" class="num">Debljina</th></tr></thead><tbody><tr><td class="spec__no">01</td><td class="key">Crni čelik (HVL, TVL)</td><td>plazma</td><td class="num">do 30<span class="unit">mm</span></td></tr><tr><td class="spec__no">02</td><td class="key">Crni čelik — ploče</td><td>gasno rezanje</td><td class="num">do 150<span class="unit">mm</span></td></tr><tr><td class="spec__no">03</td><td class="key">Prohrom / inox</td><td>plazma</td><td class="num">do 30<span class="unit">mm</span></td></tr><tr><td class="spec__no">04</td><td class="key">Bakar</td><td>plazma</td><td class="num">do 30<span class="unit">mm</span></td></tr><tr><td class="spec__no">05</td><td class="key">Aluminijum</td><td>plazma</td><td class="num">do 30<span class="unit">mm</span></td></tr></tbody></table></div></div>
    </div>
  </div>
</section>

<section class="section soft" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 05</p>
    <div class="split split--40">
      <div class="sticky">
        <p class="marker">Česta pitanja</p>
        <h2 data-reveal="cut">Plazma, ukratko.</h2>
        <div class="u-mt-24 u-acts">
          <a class="btn" href="kontakt.html#upit">Pošaljite nacrt <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <button class="btn btn--ghost" type="button" data-ask="Šta treba da pošaljem za sečenje na plazmi?">Pitajte asistenta</button>
        </div>
        <figure class="ph-frame ph-frame--faq u-mt-32" aria-hidden="true" data-reveal><img src="assets/tricom-1.jpg?v=<?= $V ?>" srcset="assets/tricom-1-960.webp?v=<?= $V ?> 960w, assets/tricom-1.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 01</figcaption></figure>
      </div>
      <div><div class="acc" data-acc="single" id="pfaq">
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-0">
      <span>U kom formatu treba da pošaljem nacrt?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-0"><div><p>Najbolje je DXF ili DWG, jer se direktno ubacuje u program mašine bez precrtavanja. Radimo i po PDF nacrtu, tehničkom crtežu ili čitkoj skici sa kotama. Ako imate samo postojeći komad, možete ga doneti — snimićemo mere i napraviti nacrt.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-1">
      <span>Koje materijale sečete na plazmi?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-1"><div><p>Obojene metale, sve vrste čelika i prohromske limove. Konkretno: crni čelik (HVL i TVL), inox, bakar i aluminijum. Debljina do 30 mm; iznad toga prelazimo na gasno rezanje, do 150 mm.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-2">
      <span>Da li treba da sam rasporedim delove po tabli?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-2"><div><p>Ne morate. Raspored delova po tabli (ugnježdavanje) obično se dogovara pri prijemu specifikacije — radni sto od 2,5 × 8 m ostavlja prostora da se iz jedne table izvuče više komada. Po pravilu, cela specifikacija poslata odjednom daje manje otpada nego naručivanje komad po komad.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-3">
      <span>Kakav rez ostaje posle plazme?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-3"><div><p>Plazma ostavlja usku zonu toplotnog uticaja i blagi kosi rez, a na donjoj ivici može ostati sitna troska koja se lako uklanja. Ako vam je potrebna glatka ivica bez dorade, recite unapred — savetovaćemo da li je za vaš deo bolje sečenje makazama ili dodatna obrada.</p></div></div>
  </div>
  <div class="acc__item">
    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-pfaq-4">
      <span>Koliko traje izrada?</span><span class="acc__sign" aria-hidden="true"></span>
    </button>
    <div class="acc__panel" id="acc-pfaq-4"><div><p>Zavisi od trenutnog opterećenja pogona i od toga da li je materijal na lageru. Rok se dogovara uz ponudu i potvrđuje radnim nalogom — proverite ga sa prodajom pre naručivanja.</p></div></div>
  </div></div></div>
    </div>
  </div>
</section>

<section class="section section--tight" data-num="05">
  <div class="wrap">
    <p class="sectionix">05 / 05</p>
    <div class="ctaband" data-reveal>
      <div>
        <h3>Pošaljite DXF — ponudu dobijate sa rokom.</h3>
        <p>Za tačnu cenu potrebni su nam materijal, debljina i količina po pozicijama. Ako imate celu specifikaciju, rasporedićemo delove tako da otpad bude najmanji.</p>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["js/i18n/sr.js?v=<?= $V ?>","js/i18n/l10n.js?v=<?= $V ?>","js/assistant.js?v=<?= $V ?>","js/theme.js?v=<?= $V ?>","js/lang.js?v=<?= $V ?>","js/metal-env.js?v=<?= $V ?>","js/hero3d.js?v=<?= $V ?>","js/main.js?v=<?= $V ?>","js/items.js?v=<?= $V ?>","js/modal.js?v=<?= $V ?>","js/motion.js?v=<?= $V ?>","js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
