<?php defined('TRICOM') || exit; ?>
<svg class="shapes" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs><clipPath id="shape-a" clipPathUnits="objectBoundingBox"><path d="M0 .18C0 .136.036.1.08.1H.59C.615.1.63.095.64.075C.67.03.73 0 .8 0C.9105 0 1 .0895 1 .2C1 .279.953.351.881.383L.88.92C.88.964.844 1 .8 1H.08C.036 1 0 .964 0 .92Z"/></clipPath><clipPath id="shape-b" clipPathUnits="objectBoundingBox"><path d="M0 .08C0 .036.036 0 .08 0H.92C.964 0 1 .036 1 .08V.76C1 .804.964.84.92.84H.66C.625.84.606.852.6.875C.597.945.54 1 .47 1H.25C.178 1 .12.942.12.87C.12.852.112.84.098.84H.08C.036.84 0 .804 0 .76Z"/></clipPath><clipPath id="shape-c" clipPathUnits="objectBoundingBox"><path d="M.2 0H.52C.55 0 .555.03.56.06C.57.12.6.16.65.16C.7.16.73.12.74.06C.745.03.75 0 .78 0H.8C.91 0 1 .224 1 .5C1 .776.91 1 .8 1H.2C.09 1 0 .776 0 .5C0 .224.09 0 .2 0Z"/></clipPath></defs></svg>

<a class="skip-link" href="#main">Preskoči na sadržaj</a>

<div class="grain" aria-hidden="true"></div>
<div class="scrollbar-progress" aria-hidden="true"><i id="progressBar"></i></div>

<header class="site-header is-over" id="header">
  <div class="header__inner">
    <a class="brand" href="../index.html" aria-label="TRICOM — početna strana">
      <img src="../assets/tricom-logo-web.png?v=<?= $V ?>" alt="TRICOM" width="610" height="300">
    </a>

    <nav class="nav" aria-label="Glavna navigacija">
      <ul class="nav__list"><li class="nav__item"><a class="nav__link" href="../o-nama.html">O nama</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="../proizvodi.html">Proizvodi</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-proizvodi" aria-label="Proizvodi — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-proizvodi"><?= site_nav_products($navCats, $L, "../proizvodi.html") ?></div></li><li class="nav__item nav__item--has"><a class="nav__link" href="../usluge.html">Usluge</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-usluge" aria-label="Usluge — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-usluge"><a href="../plazma.html">CNC plazma</a><a href="../usluge.html#secenje">Sečenje lima</a><a href="../usluge.html#savijanje">Savijanje i oblikovanje</a><a href="../usluge.html#profilisanje">Profilisanje</a><a href="../usluge.html#profili">Obrada profila</a></div></li><li class="nav__item"><a class="nav__link" href="../konfigurator.html">Konfigurator</a></li><li class="nav__item nav__item--has"><a class="nav__link" href="../kalkulatori.html">Kalkulatori</a><button class="nav__chev" type="button" aria-expanded="false" aria-controls="dd-kalkulatori" aria-label="Kalkulatori — podmeni"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></button><div class="dropdown" id="dd-kalkulatori"><a href="../kalkulatori.html#tr10">Trapez 10</a><a href="../kalkulatori.html#tr20">Trapez 20</a><a href="../kalkulatori.html#tr35">Trapez 35</a><a href="../kalkulatori.html#tr40">Trapez 40</a><a href="../kalkulatori.html#crep">Imitacija crepa</a></div></li><li class="nav__item"><a class="nav__link" href="../reference.html">Reference</a></li><li class="nav__item"><a class="nav__link" href="../galerija.html">Galerija</a></li><li class="nav__item"><a class="nav__link" href="../kontakt.html">Kontakt</a></li></ul>
    </nav>

    <div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div>

    <a class="header__phone" href="tel:<?= site_c('tel', $L) ?>"><?= site_c('tel_html', $L) ?></a>

    <button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-h"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-h)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button>

    <div class="header__cta">
      <a class="btn btn--sm" href="../kontakt.html#upit">Zatražite ponudu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>

    <button class="burger" id="burger" type="button" aria-label="Meni" aria-expanded="false" aria-controls="mobileNav">
      <i></i><i></i><i></i>
    </button>
  </div>
</header>

<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav__inner">
    <div class="mnav__group"><a class="mnav__link" href="../o-nama.html">O nama</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-proizvodi">Proizvodi<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-proizvodi"><div><?= site_nav_products($navCats, $L, "../proizvodi.html") ?><a href="../proizvodi.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-usluge" data-current="true">Usluge<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-usluge"><div><a href="../plazma.html">CNC plazma</a><a href="../usluge.html#secenje">Sečenje lima</a><a href="../usluge.html#savijanje">Savijanje i oblikovanje</a><a href="../usluge.html#profilisanje">Profilisanje</a><a href="../usluge.html#profili">Obrada profila</a><a href="../usluge.html"><strong>Otvori stranicu</strong></a></div></div></div><div class="mnav__group"><a class="mnav__link" href="../konfigurator.html">Konfigurator</a></div><div class="mnav__group"><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-kalkulatori">Kalkulatori<span class="chev" aria-hidden="true"><svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 3.75 5 6.75 8 3.75"/></svg></span></button><div class="mnav__sub" id="mnav-kalkulatori"><div><a href="../kalkulatori.html#tr10">Trapez 10</a><a href="../kalkulatori.html#tr20">Trapez 20</a><a href="../kalkulatori.html#tr35">Trapez 35</a><a href="../kalkulatori.html#tr40">Trapez 40</a><a href="../kalkulatori.html#crep">Imitacija crepa</a></div></div></div><div class="mnav__group"><a class="mnav__link" href="../reference.html">Reference</a></div><div class="mnav__group"><a class="mnav__link" href="../galerija.html">Galerija</a></div><div class="mnav__group"><a class="mnav__link" href="../kontakt.html">Kontakt</a></div>
    <div class="mnav__foot">
      <div class="mnav__util"><div class="langsw" role="group" aria-label="Jezik sajta"><button class="langsw__b" type="button" data-lang="sr" lang="sr" aria-current="true">SR</button><span class="langsw__sep" aria-hidden="true"></span><button class="langsw__b" type="button" data-lang="en" lang="en" aria-label="EN — English version">EN</button></div><button class="themesw" type="button" data-theme-toggle aria-pressed="false" aria-label="Tamna tema"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><mask id="tsm-m"><rect width="24" height="24" fill="#fff"/><circle class="themesw__cut" cx="17" cy="7" r="7" fill="#000"/></mask><circle class="themesw__core" cx="12" cy="12" r="9" fill="currentColor" mask="url(#tsm-m)"/><g class="themesw__rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1.6v2.1M12 20.3v2.1M1.6 12h2.1M20.3 12h2.1M4.65 4.65l1.5 1.5M17.85 17.85l1.5 1.5M4.65 19.35l1.5-1.5M17.85 6.15l1.5-1.5"/></g></svg></button></div>
      <a href="tel:<?= site_c('tel', $L) ?>"><span class="mono">Prodaja</span><br><span class="big"><?= site_c('tel_html', $L) ?></span></a>
      <a href="mailto:<?= site_c('email', $L) ?>"><span class="mono">E-pošta</span><br><span class="big"><?= site_c('email', $L) ?></span></a>
      <p class="mono muted"><?= site_c('address_short', $L) ?><br><?= site_c('hours', $L) ?></p>
      <a class="btn btn--block" href="../kontakt.html#upit">Zatražite ponudu</a>
    </div>
  </div>
</div>

