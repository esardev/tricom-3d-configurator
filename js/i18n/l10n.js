/* ==========================================================================
   TRICOM — i18n/l10n.js
   Pomoćnik za tekst iz skripti (L10N). Rečnici: i18n/sr.js (srpske strane) i
   i18n/en.js (engleske) — strana učitava samo svoj; ovaj fajl ide posle njega.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var I = w.TRICOM_I18N = w.TRICOM_I18N || {};

  /* ------------------------------------------------------------------
     L10N — jedini pomoćnik za tekst iz skripti (učitava se pre ostalih).
     Jezik se čita iz <html lang="…"> u trenutku poziva.
       L10N.lang()            'sr' | 'en'
       L10N.t(key, vars)      tekst za ključ; {ime} se menja iz vars;
                              ako ključ nema prevod, srpski tekst (samo gde je i sr.js učitan)
       L10N.num(x, dec, grp)  broj: en → 2,400.5 (grp: grupisanje hiljada,
                              podrazumevano kada |x| ≥ 1000); sr → 2400,5
       L10N.root              putanja do korena sajta: '' na srpskim stranama,
                              '../' na engleskim (sve su u /en/); strane detalja
                              (detalji/, en/details/) je zadaju u <html data-root>
       L10N.base              putanja do fascikle jezika: '' osim na stranama
                              detalja, koje je zadaju u <html data-base="../">
       L10N.page(file)        srpski naziv strane → strana na tekućem jeziku,
                              relativno od tekuće strane
                              ('kontakt.html' → 'contact.html' na en)
       L10N.other(file)       strana na drugom jeziku, sa putanjom
     ------------------------------------------------------------------ */
  if (w.L10N) return;
  var PAGES = {
    'index.html': 'index.html', 'o-nama.html': 'about.html', 'usluge.html': 'services.html',
    'plazma.html': 'plasma-cutting.html', 'proizvodi.html': 'products.html',
    'reference.html': 'references.html', 'galerija.html': 'gallery.html',
    'kontakt.html': 'contact.html', 'konfigurator.html': 'configurator.html', '404.html': '404.html',
    'kalkulatori.html': 'calculators.html'
  };
  var BACK = {};
  Object.keys(PAGES).forEach(function (k) { BACK[PAGES[k]] = k; });
  function lang() {
    var l = (d.documentElement.getAttribute('lang') || 'sr').slice(0, 2).toLowerCase();
    return l === 'en' ? 'en' : 'sr';
  }
  function t(key, vars) {
    var L = I[lang()] || I.sr, s = L && L[key];
    if (s == null && I.sr) s = I.sr[key];
    if (s == null) return key;
    if (vars) s = String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  function num(x, dec, grp) {
    x = +x; dec = dec || 0;
    var s = Math.abs(x).toFixed(dec), parts = s.split('.'), en = lang() === 'en';
    if (grp == null) grp = en && Math.abs(x) >= 1000;
    if (grp) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, en ? ',' : '.');
    return (x < 0 ? '−' : '') + parts[0] + (parts[1] ? (en ? '.' : ',') + parts[1] : '');
  }
  w.L10N = {
    lang: lang, t: t, num: num, pages: PAGES,
    get root() { var r = d.documentElement.getAttribute('data-root'); return r != null ? r : (lang() === 'en' ? '../' : ''); },
    get base() { return d.documentElement.getAttribute('data-base') || ''; },
    page: function (file) {
      var f = String(file || ''), m = f.match(/^([^#?]*)(.*)$/), base = m[1], rest = m[2];
      var pre = d.documentElement.getAttribute('data-base') || '';
      if (lang() !== 'en') return pre + f;
      return pre + (PAGES[base] || base) + rest;
    },
    other: function (file) {
      var f = String(file || '').split('/').pop() || 'index.html';
      return lang() === 'en' ? '../' + (BACK[f] || 'index.html') : 'en/' + (PAGES[f] || 'index.html');
    }
  };
})(window, document);
