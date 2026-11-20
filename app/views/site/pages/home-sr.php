<?php defined('TRICOM') || exit; ?>
<?php /* Strana „home“ (sr). Ulaz: $navCats, $L, $V, $SITE, $faq. Generisano iz index.html. */ ?>
<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>TRICOM Batajnica — Olučni sistemi, limovi i obrada metala</title>
<meta name="description" content="Metalni proizvodi iz Batajnice od 1966: CNC plazma do 30 mm, gasno do 150 mm, trapezni lim, oluci po meri, cevi, profili i alati.">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= $SITE ?>">
<link rel="alternate" hreflang="sr" href="<?= $SITE ?>">
<link rel="alternate" hreflang="en" href="<?= $SITE ?>en/">
<link rel="alternate" hreflang="x-default" href="<?= $SITE ?>">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="sr_RS">
<meta property="og:title" content="TRICOM Batajnica — Olučni sistemi, limovi i obrada metala">
<meta property="og:description" content="Metalni proizvodi iz Batajnice od 1966: CNC plazma do 30 mm, gasno do 150 mm, trapezni lim, oluci po meri, cevi, profili i alati.">
<meta property="og:url" content="<?= $SITE ?>">
<meta property="og:image" content="<?= $SITE ?>assets/og/index.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="TRICOM Batajnica — Olučni sistemi, limovi i obrada metala">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $SITE ?>assets/og/index.jpg">

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

<?= site_contact_ld('{"@context":"https://schema.org","@type":"Organization","@id":"@@site@@#org","name":"TRICOM d.o.o.","alternateName":"TRICOM","url":"@@site@@","logo":"@@site@@assets/tricom-logo.png","foundingDate":"1966","taxID":"@@c:pib","legalName":"@@c:legal_name","identifier":[{"@type":"PropertyValue","propertyID":"Matični broj","value":"@@c:registration_no"},{"@type":"PropertyValue","propertyID":"Šifra delatnosti","value":"@@c:activity_code"}],"telephone":"@@c:tels","description":"Proizvodnja i prodaja metalnih proizvoda i limarske galanterije. Sečenje lima na CNC plazmi do 30 mm i gasno rezanje do 150 mm, savijanje, profilisanje, trapezni limovi, oluci, cevi i čelični profili.","email":"@@c:email","sameAs":"@@c:same_as","address":{"@type":"PostalAddress","streetAddress":"@@c:loc:direkcija:street","addressLocality":"@@c:loc:direkcija:locality","postalCode":"@@c:loc:direkcija:postal","addressCountry":"RS"},"contactPoint":[{"@type":"ContactPoint","telephone":"@@c:loc:prodaja:tel","contactType":"prodaja","areaServed":"RS","availableLanguage":["sr"]},{"@type":"ContactPoint","telephone":"@@c:loc:direkcija:tel","contactType":"direkcija","areaServed":"RS","availableLanguage":["sr"]}]}', $L) ?><?= site_contact_ld('{"@context":"https://schema.org","@type":"LocalBusiness","@id":"@@site@@#prodaja","name":"TRICOM d.o.o. — proizvodnja i prodaja","parentOrganization":{"@id":"@@site@@#org"},"image":"@@site@@assets/tricom-logo.png","telephone":"@@c:loc:prodaja:tel","email":"@@c:email","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"@@c:loc:prodaja:street","addressLocality":"@@c:loc:prodaja:locality","postalCode":"@@c:loc:prodaja:postal","addressCountry":"RS"},"geo":"@@c:loc:prodaja:geo","openingHoursSpecification":"@@c:hours_spec"}', $L) ?><?= site_faq_jsonld($faq, $L) ?><?= site_contact_ld('{"@context":"https://schema.org","@type":"LocalBusiness","@id":"@@site@@#prodaja","name":"TRICOM d.o.o. — proizvodnja i prodaja Batajnica","parentOrganization":{"@id":"@@site@@#org"},"image":"@@site@@assets/og/kontakt.jpg","telephone":"@@c:loc:prodaja:tels","email":"@@c:email","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"@@c:loc:prodaja:street","addressLocality":"@@c:loc:prodaja:locality","postalCode":"@@c:loc:prodaja:postal","addressCountry":"RS"},"geo":"@@c:loc:prodaja:geo","openingHoursSpecification":"@@c:hours_spec"}', $L) ?><?= site_contact_ld('{"@context":"https://schema.org","@type":"LocalBusiness","@id":"@@site@@#ugrinovci","name":"TRICOM d.o.o. — proizvodna hala i centralni magacin Ugrinovci","parentOrganization":{"@id":"@@site@@#org"},"image":"@@site@@assets/old/foto/hala-ugrinovci.jpg","telephone":"@@c:tel","email":"@@c:email","address":{"@type":"PostalAddress","addressLocality":"Ugrinovci, Zemun, Beograd","addressCountry":"RS"},"openingHoursSpecification":"@@c:hours_spec"}', $L) ?></head>
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
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="o-nama.html">O nama</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="proizvodi.html">Proizvodi</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Proizvodi — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "proizvodi.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="usluge.html">Usluge</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Usluge — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a></div></li><li class="nav__item"><a class="nav__link" href="konfigurator.html">Konfigurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="kalkulatori.html">Kalkulatori</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Kalkulatori — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></li><li class="nav__item"><a class="nav__link" href="reference.html">Reference</a></li><li class="nav__item"><a class="nav__link" href="galerija.html">Galerija</a></li><li class="nav__item"><a class="nav__link" href="kontakt.html">Kontakt</a></li></ul>
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
    <div class="mnav__group"><a class="mnav__link" href="o-nama.html">O nama</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Proizvodi<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "proizvodi.html") ?><a href="proizvodi.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge">Usluge<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="plazma.html">CNC plazma</a><a href="usluge.html#secenje">Sečenje lima</a><a href="usluge.html#savijanje">Savijanje i oblikovanje</a><a href="usluge.html#profilisanje">Profilisanje</a><a href="usluge.html#profili">Obrada profila</a><a href="usluge.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="konfigurator.html">Konfigurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Kalkulatori<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="kalkulatori.html#tr10">Trapez 10</a><a href="kalkulatori.html#tr20">Trapez 20</a><a href="kalkulatori.html#tr35">Trapez 35</a><a href="kalkulatori.html#tr40">Trapez 40</a><a href="kalkulatori.html#crep">Imitacija crepa</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="reference.html">Reference</a></div><div class="mnav__group"><a class="mnav__link" href="galerija.html">Galerija</a></div><div class="mnav__group"><a class="mnav__link" href="kontakt.html">Kontakt</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Prodaja</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">E-pošta</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="kontakt.html#upit">Zatražite ponudu</a>
    </div>
  </div>
</div>

<main id="main">

<!-- ================================================== HERO
     Tri ekrana na čistoj podlozi strane (bez fotografije): uska staklena
     ploča sa tekstom ekrana levo, 3D objekat ekrana desno, mono blok gore
     levo, pejdžer i strelice. v. README, „Hero“. -->
<section class="hero is-boot" id="hero" aria-labelledby="heroTitle" aria-roledescription="slajder" data-rail-label="Početna" data-i="0">
  <div class="hero__ghost" aria-hidden="true"><span>TRICOM</span></div>

  <div class="hero__in wrap">
    <div class="hero__copy" id="heroSlider" tabindex="0" role="group" aria-roledescription="slajder" aria-label="Tri delatnosti TRICOM-a" aria-live="off">
      <article class="hero__slide is-active is-first" aria-roledescription="slajd" aria-label="01 / 03">
        <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span><span class="hero__ix">01 / 03</span> Krovni i olučni sistemi</p>
        <h1 class="hero__title" id="heroTitle"><span class="ln"><span>Od table</span></span> <span class="ln"><span>do gotovog</span></span> <span class="ln lt"><span>dela.</span></span></h1>
        <p class="hero__sub">Sečemo, savijamo i profilišemo lim, pa uz to držimo kompletan program limova, profila, cevi i alata — da limar, bravar i izvođač sve nađu na jednom mestu.</p>
        <a class="btn btn--ghost hero__cta" href="proizvodi.html">Prodajni program <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
      <article class="hero__slide" aria-roledescription="slajd" aria-label="02 / 03" aria-hidden="true">
        <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span><span class="hero__ix">02 / 03</span> Obrada metala</p>
        <h2 class="hero__title"><span class="ln"><span>Sečemo</span></span> <span class="ln"><span>do 150 mm</span></span> <span class="ln lt"><span>tačno.</span></span></h2>
        <p class="hero__sub">Materijal možete kupiti u fabričkom pakovanju ili ga uzeti obrađenog — u obliku, količini i izgledu koji vam treba. Sve operacije radimo na svojim mašinama u Batajnici i Ugrinovcima.</p>
        <a class="btn btn--ghost hero__cta" href="usluge.html" tabindex="-1">Pogledajte usluge <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
      <article class="hero__slide" aria-roledescription="slajd" aria-label="03 / 03" aria-hidden="true">
        <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span><span class="hero__ix">03 / 03</span> Limovi, cevi i profili</p>
        <h2 class="hero__title"><span class="ln"><span>Sve za limara</span></span> <span class="ln"><span>na jednom</span></span> <span class="ln lt"><span>mestu.</span></span></h2>
        <p class="hero__sub">Osnovni materijal za svaki limarski posao. Držimo pocinkovane, aluminijumske, bakarne, crne toplo- i hladnovaljane, plastificirane po RAL karti i prohromske limove.</p>
        <a class="btn btn--ghost hero__cta" href="proizvodi.html?grupa=limovi#prog" tabindex="-1">Otvorite program <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
    </div>

    <div class="hero__obj" aria-hidden="true">
      <div class="hero3d" id="hero3d" data-hero3d="sheet cutplate stack" data-bed
        data-kote-sheet="cover:1080 mm;rib:35 mm" data-kote-still-sheet="1200x840;cover:0.1708,0.5035,0.3976,0.6861,0.1174,0.5246,0.3394,0.7171;rib:0.4153,0.6816,0.4234,0.7069,0.4754,0.7292,0.4755,0.7489"
        data-kote-cutplate="len:1250 mm;wid:800 mm" data-kote-still-cutplate="1200x840;len:0.2835,0.4525,0.6069,0.618,0.1116,0.52,0.374,0.7477;wid:0.7385,0.5267,0.4858,0.6128,0.7989,0.5595,0.5871,0.6839" data-kote-note-cutplate="Mere modela"
        data-kote-stack="len:1250 mm;h:90 mm" data-kote-still-stack="1200x840;len:0.2896,0.4147,0.5698,0.5975,0.1089,0.4826,0.3729,0.7026;h:0.2881,0.3753,0.2897,0.4151,0.2604,0.3581,0.2621,0.3972" data-kote-note-stack="Mere modela">
        <div class="hero3d__still is-on" data-obj="sheet"></div>
        <div class="hero3d__still" data-obj="cutplate"></div>
        <div class="hero3d__still" data-obj="stack"></div>
      </div>
    </div>

    <p class="hero__scroll" aria-hidden="true"><i></i><span>Skrolujte</span><svg viewBox="0 0 10 10"><path d="M2 3.75 5 6.75 8 3.75"/></svg></p>

    <div class="hero__pager" role="group" aria-label="Izbor delatnosti">
      <span class="hero__pg-n is-cur" aria-hidden="true">01</span>
      <div class="hero__pg-track">
        <button class="hero__pg" type="button" aria-current="true" aria-label="01 — Krovni i olučni sistemi"></button>
        <button class="hero__pg" type="button" aria-current="false" aria-label="02 — Obrada metala"></button>
        <button class="hero__pg" type="button" aria-current="false" aria-label="03 — Limovi, cevi i profili"></button>
        <i class="hero__pg-bar" aria-hidden="true"></i>
      </div>
      <span class="hero__pg-n" aria-hidden="true">03</span>
    </div>
  </div>

  <button class="hero__arrow hero__arrow--prev" type="button" aria-label="Prethodna delatnost" aria-controls="heroSlider"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
  <button class="hero__arrow hero__arrow--next" type="button" aria-label="Sledeća delatnost" aria-controls="heroSlider"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
</section>

<!-- ================================================== PROGRAM -->
<section class="section soft" data-num="01">
  <div class="wrap">
    <p class="sectionix">01 / 06</p>
    <div class="shead">
      <div>
        <p class="marker">Naši proizvodi</p>
        <h2 data-reveal="cut">Kompletan <span class="u-accent">materijal</span> za limarske i bravarske radove.</h2>
      </div>
      <div class="shead__aside">
        <p>Šest grupa proizvoda pokriva sve što jedna radionica troši — od table i kotura do šrafa i brusne ploče. Dimenzije i raspoloživost na lageru proverite sa prodajom.</p>
        <a class="link-kerf u-mt-16" href="proizvodi.html">Ceo program <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
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
        <p class="marker">Naše usluge</p>
        <h2 data-reveal="cut">Tri načina na koja možemo da radimo za vas.</h2>
        <div class="shead__aside">
          <p>Ideja je jednostavna: da materijal dobijete u onoj fazi u kojoj vam odgovara. Od table u fabričkom pakovanju, preko obrade po vašim merama, do gotovog proizvoda spremnog za ugradnju.</p>
        </div>
      </div>
      <div class="shead__media"><figure class="ph-frame ph-frame--tri" aria-hidden="true" data-reveal><img src="assets/tricom-2.jpg?v=<?= $V ?>" srcset="assets/tricom-2-960.webp?v=<?= $V ?> 960w, assets/tricom-2.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 02</figcaption></figure></div>
    </div>

    <div class="grid g3 hm-cards">
      <article data-item="usluge-obrade" class="card g-card" data-reveal data-reveal-group="tri">
        <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v7.5M15 4v7.5M12 11.5v4"/><path d="M3 19h18"/><path d="M12 15.5 10 19M12 15.5 14 19"/></svg></div>
        <h3>Usluge obrade</h3>
        <p>Sečenje na CNC plazmi i makazama, gasno rezanje, slitovanje i premotavanje kotura, savijanje i rundovanje, probijanje i isecanje uglova, sečenje profila na trakastim testerama.</p>
        <a class="link-kerf" href="usluge.html">Pogledajte usluge <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

      <article data-item="prodajni-program" class="card g-card" data-reveal data-reveal-group="tri">
        <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg></div>
        <h3>Prodajni program</h3>
        <p>Limovi u tablama i koturu, trapezni i krovni limovi, oluci i vertikale, šavne cevi i ZP profili, čelični profili, kovani elementi, pletiva, šrafovska roba, alat i oprema za varenje.</p>
        <a class="link-kerf" href="proizvodi.html">Otvorite program <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

      <article data-item="proizvodnja-po-meri" class="card g-card" data-reveal data-reveal-group="tri">
        <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg></div>
        <h3>Proizvodnja po meri</h3>
        <p>Trapezni pokrivni lim, oluci i vertikale u dužini po želji, lamperija, parapetni lim, kompletna građevinska limarija, kanali za ventilaciju, pocinkovana gazišta.</p>
        <a class="link-kerf" href="usluge.html#profilisanje">Šta proizvodimo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>
    </div>
  </div>
  </div>
</section>

<!-- ================================================== KONFIGURATOR -->
<section class="section" data-rail-label="Konfigurator" data-num="03">
  <div class="wrap">
    <p class="sectionix">03 / 06</p>
    <aside class="kcta dark" aria-labelledby="kctaTitle" data-reveal>
      <div class="kcta__txt">
        <p class="marker">3D konfigurator <span class="kcta__new">NOVO</span></p>
        <h3 id="kctaTitle">Sastavite svoj krov u 3D</h3>
        <p>Izaberite tip kuće, profil i boju lima, oluke, vertikale i limarske detalje. Model se okreće uživo, a upit sa orijentacionim količinama stiže pravo u prodaju.</p>
        <ul class="kcta__list mono"><li>6 tipova krova</li><li>TR 10 – TR 40 i imitacija crepa</li><li>cink · RAL · bakar · aluminijum</li><li>presek i količine</li></ul>
        <a class="btn btn--lg" href="konfigurator.html">Otvorite konfigurator <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
      <div class="kcta__art kcta__art--photo" aria-hidden="true"><figure class="ph-frame ph-frame--kcta" aria-hidden="true"><img src="assets/tricom-2.jpg?v=<?= $V ?>" srcset="assets/tricom-2-960.webp?v=<?= $V ?> 960w, assets/tricom-2.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 02</figcaption></figure></div>
    </aside>
  </div>
</section>

<!-- ================================================== REFERENCE -->
<section class="section" data-num="04">
  <div class="wrap">
    <p class="sectionix">04 / 06</p>
    <div class="shead shead--media">
      <div>
        <p class="marker">Reference</p>
        <h2 data-reveal="cut">Bakarni krov predsedničke rezidencije u Karađorđevu.</h2>
        <div class="shead__aside">
          <p>Najzahtevniji izvođački poduhvat u istoriji firme: obrada lima za pokrivanje, proizvodnja svih pratećih elemenata ekskluzivnog bakarnog krova i kompletna ugradnja na licu mesta.</p>
        </div>
      </div>
      <div class="shead__media"><figure class="ph-frame ph-frame--ref" aria-hidden="true" data-reveal><img src="assets/tricom-1.jpg?v=<?= $V ?>" srcset="assets/tricom-1-960.webp?v=<?= $V ?> 960w, assets/tricom-1.webp?v=<?= $V ?> 1672w" sizes="(max-width: 768px) 100vw, 50vw" alt="" width="1672" height="941" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · 01</figcaption></figure></div>
    </div>

    <div class="refhero dark" data-reveal>
      <div>
        <h3>Kompletni krovopokrivački radovi na rezidencijalnom predsedničkom kompleksu.</h3>
        <p class="muted">O obimu radova najviše govori količina materijala. Zahvaljujući iskustvu u radu sa bakrom, ceo posao je završen za nešto više od šest nedelja.</p>
      </div>
      <div class="refhero__data"><div class="refstats refstats--xl">
          <div class="refstat g-card"><div class="refstat__n" data-kote="t"><span data-count="32">0</span> t</div><div class="refstat__l">OBRAĐENOG I UGRAĐENOG BAKRA</div></div>
          <div class="refstat g-card"><div class="refstat__n" data-kote="dana"><span data-count="48">0</span></div><div class="refstat__l">DANA DO ZAVRŠETKA</div></div>
        </div></div>
    </div>

    <div class="u-mt-40">
      <p class="mono muted u-mb-16">TRICOM elementi ugrađeni su, između ostalog, i na ovim objektima:</p>
      <div class="marquee hm-pills" role="group" aria-label="Objekti na kojima su ugrađeni TRICOM proizvodi"><div class="marquee__track"><span class="marquee__item">Beograd na vodi</span><span class="marquee__item">PC Ušće</span><span class="marquee__item">Pijaca Zeleni venac</span><span class="marquee__item">LIDL</span><span class="marquee__item">Continental Subotica</span><span class="marquee__item">ZF Pančevo</span><span class="marquee__item">GEZE Zrenjanin</span><span class="marquee__item">NELT Dobanovci</span><span class="marquee__item">MITAS Ruma</span><span class="marquee__item">MEI TA Obrenovac</span><span class="marquee__item">BOYSEN Subotica</span><span class="marquee__item">Kuehne+Nagel</span><span class="marquee__item">IPB Šimanovci</span><span class="marquee__item">Sport Vision Šimanovci</span><span class="marquee__item">TERRA Inđija</span><span class="marquee__item">Gomex Zrenjanin</span><span class="marquee__item">SAVACOOP Novi Sad</span><span class="marquee__item">Pupinova palata</span><span class="marquee__item">Brze pruge Srbije</span><span class="marquee__item">Knez Petrol</span></div></div>
      <div class="u-mt-24">
        <a class="link-kerf" href="reference.html">Sve reference <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
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
        <p class="marker">Bonitet</p>
        <h2 data-reveal="cut">Ocene koje su poslovni partneri već proverili.</h2>
      </div>
      <div class="shead__aside">
        <p>Sertifikovanje bonitetne izvrsnosti je međunarodna praksa koja nosiocima osigurava ugled i poverenje u domaćem i stranom poslovnom okruženju.</p>
      </div>
    </div>
    <div class="certs">
      <div class="cert cert--gold" data-reveal data-reveal-group="cert">
        <div class="cert__grade">AAA</div>
        <h4>Zlatni sertifikat</h4>
        <p>Bisnode, na osnovu poslovanja 2014–2016. U toj godini dobilo ga je 115 od 446.449 aktivnih pravnih subjekata u Srbiji.</p>
        <div class="cert__src">potvrda kvaliteta poslovanja</div>
      </div>
      <div class="cert " data-reveal data-reveal-group="cert">
        <div class="cert__grade">AAA</div>
        <h4>Bonitetna izvrsnost</h4>
        <p>Bisnode Srbija, na osnovu izuzetnih rezultata u 2015. godini.</p>
        <div class="cert__src">potvrda kvaliteta poslovanja</div>
      </div>
      <div class="cert " data-reveal data-reveal-group="cert">
        <div class="cert__grade">AA</div>
        <h4>Bonitetna izvrsnost</h4>
        <p>Bisnode — sertifikat koji ima svega 2% najuspešnijih firmi u Srbiji.</p>
        <div class="cert__src">potvrda kvaliteta poslovanja</div>
      </div>
      <div class="cert " data-reveal data-reveal-group="cert">
        <div class="cert__grade">A</div>
        <h4>Excellent SME Serbia</h4>
        <p>Privredna komora Srbije i Coface Srbija. Među 1% najuspešnijih po metodologiji EFQM.</p>
        <div class="cert__src">potvrda kvaliteta poslovanja</div>
      </div></div>
    <p class="mono muted u-mt-24">Izdavaoci: Privredna komora Srbije &amp; Coface Srbija, Bisnode Srbija.</p>
  </div>
</section>

<!-- ================================================== FAQ -->
<section class="section soft" data-num="06">
  <div class="wrap">
    <p class="sectionix">06 / 06</p>
    <div class="split split--40">
      <div class="sticky">
        <p class="marker">Česta pitanja</p>
        <h2 data-reveal="cut">Ono što kupci najčešće pitaju.</h2>
        <p class="lead u-mt-16">Ako pitanje nije na listi, asistent na sajtu odgovara odmah — ili pozovite prodaju.</p>
        <button class="btn btn--ghost u-mt-24" type="button" data-ask="Kako se naručuje i kako se plaća?">Pitajte asistenta</button>
        <div class="hm-cap hm-cap--c shape-c u-mt-32" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="assets/render/coil-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/coil-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/coil-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/coil-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 61vw, 370px" data-orig="assets/render/coil-light.jpg?v=<?= $V ?>" alt="Lim u koturu" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/coil-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/coil-dark.jpg?v=<?= $V ?>" alt="Lim u koturu" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
      </div>
      <div><div class="acc" data-acc="single" id="faq"><?= site_faq_items($faq, $L, 'faq') ?></div></div>
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
        <li><a href="index.html" aria-current="page">Početna</a></li>
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
(function(d,s){var go=function(){if(go.on)return;go.on=1;s.forEach(function(u,k){var e=d.createElement('script');e.src=u;e.async=false;if(k===s.length-1)e.onload=e.onerror=function(){d.documentElement.setAttribute('data-ready','');d.dispatchEvent(new Event('tricom:ready'))};d.body.appendChild(e)})};try{new PerformanceObserver(function(l,o){if(l.getEntries().some(function(e){return e.name==='first-contentful-paint'})){o.disconnect();setTimeout(go,0)}}).observe({type:'paint',buffered:true})}catch(x){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,2500)})(document,["js/i18n/sr.js?v=<?= $V ?>","js/i18n/l10n.js?v=<?= $V ?>","js/assistant.js?v=<?= $V ?>","js/theme.js?v=<?= $V ?>","js/lang.js?v=<?= $V ?>","js/hero-slider.js?v=<?= $V ?>","js/metal-env.js?v=<?= $V ?>","js/hero3d.js?v=<?= $V ?>","js/main.js?v=<?= $V ?>","js/items.js?v=<?= $V ?>","js/modal.js?v=<?= $V ?>","js/motion.js?v=<?= $V ?>","js/glass.js?v=<?= $V ?>"]);
</script>

</body>
</html>
