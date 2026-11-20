/* ==========================================================================
   TRICOM — glass-dom.js  (deo „The Board · Glass“ koji menja DOM pre prvog crtanja)
   Sinhrono, prva skripta na kraju <body> (posle CSS-a, pre prvog rasporeda),
   na svim stranama osim konfiguratora. Isti DOM koji je ranije pravio glass.js
   posle učitavanja — sada pre prvog rasporeda, pa nema ponovnog računanja stila
   cele strane ni vidljive promene posle prvog crtanja. Interakcije (paralaksa,
   budžet zamućenja, ulazi, sjaj…) i dalje su u js/glass.js.

    0. razred (html.tier-low | tier-medium | tier-high) i stanje hero 3D
       (html.h3d-static, data-h3d-tier) — procena bez WebGL probe; motion.js i
       hero3d.js ga ispravljaju samo ako se razlikuje (npr. bez WebGL-a)
    1. slojevi prostora (.space) iza sadržaja
    2. staklo na kontejnerima (.gl, .gl--in)
    3. vodeće ploče sekcija + jezičak sa brojem sekcije (.g-tab)
    4. HUD uglovi (.hudc) i naslov tabele-instrumenta (CNC)
   ========================================================================== */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;
  if (!body || body.classList.contains('k-body')) return;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };

  /* 0. razred — ista pravila kao MetalEnv.tier() / motion.js, bez WebGL probe */
  var q = /[?&]tier=(high|medium|low)/.exec(location.search), tier;
  if (q) tier = q[1];
  else {
    var hc = navigator.hardwareConcurrency || 8, dpr = window.devicePixelRatio || 1, ua = navigator.userAgent;
    var mob = /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    var low = hc <= 2 || (mob && hc <= 4);
    tier = low ? 'low' : (hc <= 4 || mob || dpr >= 3) ? 'medium' : 'high';
  }
  var glassOK; try { glassOK = !!(window.CSS && CSS.supports && (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'))); } catch (e) { glassOK = true; }
  var motionTier = (mq('(prefers-reduced-motion: reduce)') || !glassOK) ? 'low' : tier;
  root.classList.add('tier-' + motionTier);
  if ($('[data-hero3d]')) {
    var hm = /[?&]hero3d=(on|off|still)/.exec(location.search), mode = hm ? hm[1] : '';
    var t3 = mq('(prefers-reduced-motion: reduce)') ? 'low' : tier;
    if ((mode === 'on' || mode === 'still') && t3 === 'low') t3 = 'medium';
    var useGL = mode !== 'off' && t3 !== 'low' && (mode === 'on' || mode === 'still' || window.innerWidth >= 768);
    if (!useGL) root.classList.add('h3d-static');
    root.setAttribute('data-h3d-tier', useGL ? t3 : 'low');
  }

  /* 1. prostor */
  if (!$('.space')) {
    var space = doc.createElement('div');
    space.className = 'space';
    space.setAttribute('aria-hidden', 'true');
    space.innerHTML = '<div class="space__room"></div><div class="space__photo"></div><div class="space__facets"></div><div class="space__grid"></div>';
    body.insertBefore(space, body.firstChild);
  }

  /* 2.–4. idempotentno: glass.js ga poziva još jednom posle skripti koje crtaju sadržaj
     (catalog-render, calc-ui, modal) — dodaje samo ono što nedostaje */
  function decorate() {
  /* 2. staklo na kontejnerima */
  var PANELS = [
    '.card', '.g-card', '.pcard', '.stat', '.refstat', '.cert', '.tbl-glass', '.acc', '.xplode', '.prog__i', '.lu',
    '.infoblock', '.tocnav', '.note', '.quote', '.ctaband', '.feat', '.locs > div', '.srow', '.ref', '.mat', '.about-tl',
    '.hm-show__side', '.hm-plate', '.kcta', '.refhero', '.hero__copy', '.footer__col', '.fline',
    '.step', '.kv-tiles > li', '.kv-intro', '.kv-foot > .prose', '.pagehead .badge', '.tabs__nav', '.trows', '.form-card',
    '.pagehead .wrap > .split > div:first-child', '.emptyhead .wrap > div', '.spec-wrap:not(.tbl-glass .spec-wrap)', '.figbox', '.map-frame'
  ];
  var NESTED = ['.refstat', '.stat', '.prog__i', '.step', '.kv-tiles > li', '.fline', '.cert', '.ref', '.lu'];
  PANELS.forEach(function (s) {
    var list; try { list = $$(s); } catch (e) { return; }
    list.forEach(function (el) {
      if (el.closest('.ai-panel, .lightbox, .mobile-nav, .site-header')) return;
      el.classList.add('gl');
    });
  });
  NESTED.forEach(function (s) { $$(s).forEach(function (el) { if (el.classList.contains('gl')) el.classList.add('gl--in'); }); });
  // staklo u staklu ne nosi senku drugi put (npr. .refstat u .refhero)
  $$('.gl .gl').forEach(function (el) { el.classList.add('gl--in'); });

  /* 3. vodeće ploče + jezičak sa brojem sekcije */
  $$('main > section').forEach(function (sec) {
    var ix = $('.sectionix', sec);
    if (ix && ix.classList.contains('g-tab')) return;
    var lead = null, sh = $('.shead, .kv-head', sec);
    if (sh && !sh.closest('.kcta')) lead = sh.classList.contains('shead--media') ? sh.firstElementChild : sh;
    else {
      var m = $('.marker', sec);
      if (m) {
        var k = m.closest('.kcta, .refhero');
        lead = k || m.parentElement;
        if (lead && (lead.classList.contains('wrap') || lead === sec || lead.tagName === 'SECTION')) lead = null;
      }
    }
    if (lead) {
      lead.classList.add('lead-panel', 'gl', 'has-hud');
      if (ix) {
        var n = (ix.textContent || '').trim();
        var mm = /^(\d+)\s*\/\s*(\d+)$/.exec(n);
        ix.classList.add('g-tab', 'gl');
        ix.classList.remove('is-in');
        if (mm) {
          ix.innerHTML = '<span class="g-tab__n">' + mm[1] + '</span><span aria-hidden="true">/</span><span>' + mm[2] + '</span>';
          ix.setAttribute('aria-label', mm[1] + ' / ' + mm[2]);
        }
        lead.appendChild(ix);
      }
    } else if (ix) ix.classList.add('gl');
  });
  // zaglavlja podstranica: naslovni panel sa HUD uglovima (bez broja)
  $$('.pagehead .wrap > .split > div:first-child, .emptyhead .wrap > div').forEach(function (el) { el.classList.add('has-hud', 'lead-panel'); });

  /* 4. HUD uglovi */
  var HUD = '.lead-panel, .hm-show__side, .hm-show__main, .hm-plate, .hm-caps.tbl-glass, .refstats--xl > .refstat, #plazma-blok .tbl-glass';
  var corner = '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M.5 18V.5H18" pathLength="1"/></svg>';
  $$(HUD).forEach(function (el) {
    if ($(':scope > .hudc', el)) return;
    var h = doc.createElement('span');
    h.className = 'hudc';
    h.setAttribute('aria-hidden', 'true');
    h.innerHTML = corner + corner + corner + corner;
    el.classList.add('has-hud');
    el.appendChild(h);
  });
  // naslov tabele-instrumenta (CNC) sa trepćućim kursorom
  $$('#plazma-blok .hm-caps').forEach(function (t) {
    if ($('.inst-bar', t)) return;
    var b = doc.createElement('div');
    b.className = 'inst-bar';
    b.setAttribute('aria-hidden', 'true');
    b.textContent = 'CNC';
    t.insertBefore(b, t.firstChild);
  });
  }
  decorate();
  window.tricomGlassDom = decorate;
})();
