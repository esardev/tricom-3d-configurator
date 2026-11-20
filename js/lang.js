/* ==========================================================================
   TRICOM — lang.js
   Prekidač jezika SR | EN (zaglavlje, podnožje mobilnog menija, traka
   konfiguratora). Klik vodi na istu stranu na drugom jeziku i zadržava
   heš (#limovi, #upit, stanje konfiguratora), pa deljeni linkovi rade na
   oba jezika. Nema automatskog preusmeravanja po jeziku pregledača.

   Par strana se čita iz <link rel="alternate" hreflang="…"> u zaglavlju
   strane (isti par koji vide pretraživači); ako ga nema, koristi se mapa
   PATHS. Engleske strane su u /en/, pa su putanje relativne:
   srpska → en/<strana>, engleska → ../<strana>.

   Bez zavisnosti, bez build koraka.
   ========================================================================== */
(function () {
  'use strict';

  /* Mapa: srpska strana -> engleska strana (rezerva kada nema hreflang). */
  var PATHS = {
    'index.html':        'index.html',
    'o-nama.html':       'about.html',
    'usluge.html':       'services.html',
    'plazma.html':       'plasma-cutting.html',
    'proizvodi.html':    'products.html',
    'reference.html':    'references.html',
    'galerija.html':     'gallery.html',
    'kontakt.html':      'contact.html',
    'konfigurator.html': 'configurator.html',
    'kalkulatori.html':  'calculators.html',
    '404.html':          '404.html'
  };
  var BACK = {};
  Object.keys(PATHS).forEach(function (k) { BACK[PATHS[k]] = k; });

  var lang = (document.documentElement.getAttribute('lang') || 'sr').slice(0, 2).toLowerCase() === 'en' ? 'en' : 'sr';

  function fileOf(path) {
    var f = (String(path).split('?')[0].split('#')[0].split('/').pop() || '').toLowerCase();
    return f || 'index.html';
  }

  /* Ciljna strana na drugom jeziku, relativno od tekuće strane.
     Strane detalja (detalji/<slug>.html ↔ en/details/<slug>.html) su
     fasciklu dublje: njihov hreflang nosi celu putanju od korena sajta, a
     <html data-root> kaže koliko je koren daleko. Sajt u podfolderu (PHP
     strane) dodaje <html data-site-path="/podfolder/">, pa se putanja hreflang
     veze računa od tog foldera, a ne od korena domena. */
  function counterpart(target) {
    var link = document.querySelector('link[rel="alternate"][hreflang="' + target + '"]');
    var file = null;
    var root = document.documentElement.getAttribute('data-root');
    var site = document.documentElement.getAttribute('data-site-path') || '/';
    if (link && root != null) {
      try {
        var p = new URL(link.getAttribute('href'), location.href).pathname;
        p = p.indexOf(site) === 0 ? p.slice(site.length) : p.replace(/^\/+/, '');
        return root + (p === '' || /\/$/.test(p) ? p + 'index.html' : p);
      } catch (e) { /* ispod: rezerva */ }
    }
    var qs = '';
    if (link) {
      try {
        var u = new URL(link.getAttribute('href'), location.href);
        file = fileOf(u.pathname);
        qs = u.search;   // npr. ?grupa=krov ↔ ?group=krov (strana prodajnog programa)
      } catch (e) { file = null; }
    }
    var here = fileOf(location.pathname);
    if (!file) file = target === 'en' ? (PATHS[here] || 'index.html') : (BACK[here] || 'index.html');
    return (target === 'en' ? 'en/' + file : '../' + file) + qs;
  }

  function go(target) {
    if (target === lang) return;                 // već smo na tom jeziku
    location.href = counterpart(target) + (location.hash || '');
  }

  function init() {
    var btns = document.querySelectorAll('[data-lang]');
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        go(b.getAttribute('data-lang'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.tricomLang = { current: lang, counterpart: counterpart };
})();
