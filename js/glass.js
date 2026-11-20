/* ==========================================================================
   TRICOM — glass.js  („The Board · Glass“: prostor, staklo, pokret)
   Učitava se poslednji (defer, posle motion.js) na svim stranama osim
   konfiguratora. Bez zavisnosti, radi i sa file://. Pravila: css/glass.css.

    1. Prostor: slojevi iza sadržaja (fotografija strane, fasete / soba),
       nisko-poligonska mreža faseta kao SVG (seme je fiksno — ista slika
       pri svakom učitavanju), paralaksa po skrolu
    2. Staklo: klasa .gl na sve kontejnere (recept u CSS-u)
    3. Vodeće ploče sekcija + pripojeni jezičak sa brojem sekcije
    4. HUD uglovi na pločama-instrumentima (crtaju se pri ulasku)
    5. Budžet zamućenja: najviše 4 ploče sa pravim backdrop-filter-om u ekranu
       (+ traka = 5; otvoren asistent smanjuje budžet na 3)
    6. Ulaz iz dubine sa razmakom od 70 ms u grupi; lebdenje posle ulaska
    7. Sjaj pokazivača (--mx/--my), nagib kartica profila, magnetna dugmad
    8. Čipovi profila → kartica u lineup-u; jedinice brojača ulaze posle broja
    9. Traka: 84 → 68 px, klizna podvlaka; napredak skrola na traci
   10. Hero: vodeni žig na pola brzine skrola, šina sa punjenjem, ručni izbor
   12. Kolone: kraća kolona postaje lepljiva kad je razlika > 120 px
   13. Prelaz teme (kružni rez, View Transitions API) i prelaz strana
   14. Brojač sekcije kuca kao merač

   prefers-reduced-motion: bez paralakse, lebdenja, nagiba, Ken Burns-a i
   sjaja; ulazi su trenutni. window.tricomGlass = { live(), budget }.
   ========================================================================== */
(function () {
  'use strict';
  // skripte se učitavaju posle prvog crtanja, pa „load“ može već da je prošao
  var onLoad = function (f) { if (document.readyState === 'complete') setTimeout(f, 0); else window.addEventListener('load', f); };

  var doc = document, root = doc.documentElement, body = doc.body;
  if (!body || body.classList.contains('k-body')) return;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var LOW = root.classList.contains('tier-low');
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var vh = function () { return window.innerHeight || root.clientHeight; };

  /* ====================================================================
     1.–4. Prostor, staklo, vodeće ploče, HUD uglovi: DOM pravi js/glass-dom.js
     pre prvog rasporeda (sinhrono, prva skripta na kraju <body>); ovde se samo
     uzimaju slojevi prostora i jezičci za brojače. Fasete tamne teme su statična
     pločica (assets/render/facets.svg, _tools/facets.js).
     ==================================================================== */
  var space = $('.space') || (function () {
    var sp = doc.createElement('div');
    sp.className = 'space';
    sp.setAttribute('aria-hidden', 'true');
    sp.innerHTML = '<div class="space__room"></div><div class="space__photo"></div><div class="space__facets"></div><div class="space__grid"></div>';
    body.insertBefore(sp, body.firstChild);
    return sp;
  })();
  if (window.tricomGlassDom) window.tricomGlassDom();   // sadržaj koji su skripte nacrtale posle prvog rasporeda
  var L = { photo: $('.space__photo', space), facets: $('.space__facets', space), grid: $('.space__grid', space) };
  var tabs = $$('.g-tab').map(function (el) {
    var nEl = $('.g-tab__n', el);
    return nEl ? { el: el, n: parseInt(nEl.textContent, 10), w: nEl.textContent.length, done: false } : null;
  }).filter(Boolean);
  var drawIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-drawn'); drawIO.unobserve(e.target); } });
  }, { threshold: 0.2 }) : null;
  $$('.has-hud').forEach(function (el) {
    if (reduced || !drawIO) el.classList.add('is-drawn');
    else drawIO.observe(el);
  });

  /* ====================================================================
     5. Budžet zamućenja
     ==================================================================== */
  var LIVE_SEL = '.hero__copy.gl, .lead-panel.gl, .kcta.gl, .refhero.gl, .pagehead .lead-panel';
  var budget = 4, vis = new Map();
  var liveCand = [];
  // telefon (≤ 768 px): CSS gasi zamućenje (glass.css, 10), pa nema ni merenja
  var narrowMQ = window.matchMedia ? window.matchMedia('(max-width: 768px)') : { matches: false };
  function collectLive() { liveCand = $$('.hero__copy.gl, .lead-panel.gl, .kcta.gl, .refhero.gl'); }
  collectLive();
  function assignLive() {
    var aiOpen = $('.ai-panel[aria-hidden="false"]');
    var max = budget - (aiOpen ? 1 : 0);
    var h = vh(), mid = h / 2, list = [];
    // prvo sva čitanja (is-live menja samo zamućenje, ne položaj ni vidljivost), pa upisi —
    // naizmenično čitanje i upis bi forsirali raspored za svaku ploču
    liveCand.forEach(function (el) {
      if (LOW || narrowMQ.matches || !vis.get(el)) return;
      if (!el.matches(LIVE_SEL)) return;
      var r = el.getBoundingClientRect();
      if (r.bottom < -h * .25 || r.top > h * 1.25 || !r.width) return;
      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
      list.push({ el: el, d: Math.abs((r.top + r.bottom) / 2 - mid), area: r.width * Math.min(r.height, h) });
    });
    list.sort(function (a, b) { return a.d - b.d || b.area - a.area; });
    var on = list.slice(0, Math.max(0, max)).map(function (o) { return o.el; });
    liveCand.forEach(function (el) { el.classList.toggle('is-live', on.indexOf(el) >= 0); });
  }
  var liveTick = 0;
  function askLive() { if (!liveTick) liveTick = raf(function () { liveTick = 0; assignLive(); }); }
  if ('IntersectionObserver' in window) {
    var liveIO = new IntersectionObserver(function (es) { es.forEach(function (e) { vis.set(e.target, e.isIntersecting); }); askLive(); }, { rootMargin: '25% 0px 25% 0px' });
    liveCand.forEach(function (el) { liveIO.observe(el); });
  }
  doc.addEventListener('tricom:hero', function () { setTimeout(askLive, 320); });

  /* ====================================================================
     6. Ulaz iz dubine + lebdenje
     ==================================================================== */
  // grupe sa main.js reveal-om: 70 ms razmaka
  var groups = {};
  $$('[data-reveal-group]').forEach(function (n) {
    var k = n.getAttribute('data-reveal-group');
    groups[k] = groups[k] || 0;
    n.style.setProperty('--rd', (groups[k]++ * 70) + 'ms');
  });
  // mreže ploča ulaze ploču po ploču (sopstveni posmatrač, klasa .rv)
  var rvIO = null;
  if (!reduced && 'IntersectionObserver' in window) {
    rvIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add('is-in'); rvIO.unobserve(e.target); });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  $$('.lineup[data-reveal], .stats[data-reveal], .process[data-reveal], .caps[data-reveal], .refstats[data-reveal], .prog[data-reveal]').forEach(function (g) {
    if (g.closest('.pin')) return;            // prikovane sekcije same vode decu
    g.removeAttribute('data-reveal');
    g.classList.add('is-in');
    Array.prototype.slice.call(g.children).forEach(function (c, i) {
      c.setAttribute('data-reveal', '');
      c.style.setProperty('--rd', (i * 70) + 'ms');
      if (rvIO) rvIO.observe(c); else c.classList.add('is-in');
    });
  });
  // bezbednosno: sve u prvom ekranu odmah
  raf(function () {
    var h = vh();
    $$('[data-reveal]:not(.is-in)').forEach(function (n) { var r = n.getBoundingClientRect(); if (r.bottom > 0 && r.top < h && rvIO) { /* main.js i rvIO ga hvataju */ } });
  });

  // lebdenje: ploče koje nisu vodeće (nemaju pravo zamućenje), posle ulaza
  function rng(seed) {                    // seme je fiksno: isti ritam pri svakom učitavanju
    var s = seed >>> 0;
    return function () { s = (s + 0x6D2B79F5) >>> 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  var FLOAT = '.stat.gl, .refstat.gl, .cert.gl, .card.gl, .prog__i.gl, .step.gl, .kv-tiles > li.gl, .ph-frame, .hm-show__side.gl, .infoblock.gl, .hm-plate, .fline.gl';
  if (!reduced && !LOW) {
    var fr = rng(77);
    $$(FLOAT).forEach(function (el) {
      if (el.closest('.lead-panel') && !el.classList.contains('ph-frame')) return;
      if (el.closest('.pin.is-pinned .g3')) return;  // kartice koje ulaze po skrolu
      el.style.setProperty('--fl-d', (7 + fr() * 2).toFixed(2) + 's');
      el.style.setProperty('--fl-p', (-fr() * 9).toFixed(2) + 's');
      var start = function () { el.classList.add('float'); };
      if (el.hasAttribute('data-reveal') && !el.classList.contains('is-in')) {
        var mo = new MutationObserver(function () { if (el.classList.contains('is-in')) { mo.disconnect(); setTimeout(start, 760); } });
        mo.observe(el, { attributes: true, attributeFilter: ['class'] });
      } else start();
    });
  }

  /* ====================================================================
     7. Sjaj pokazivača, nagib kartica profila, magnetna dugmad
     ==================================================================== */
  if (fine && !reduced && !LOW) {
    var lit = null, tiltEl = null, pend = null, ptick = 0, btns = $$('.btn'), magEl = null;
    function frame() {
      ptick = 0;
      var e = pend; if (!e) return;
      var t = e.target && e.target.closest ? e.target : null;
      var g = t ? t.closest('.gl') : null;
      if (g !== lit) { if (lit) lit.classList.remove('is-lit'); lit = g; if (lit) lit.classList.add('is-lit'); }
      if (lit) {
        var r = lit.getBoundingClientRect();
        lit.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
        lit.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
      }
      // nagib ±8° na karticama profila
      var lu = t ? t.closest('.lu') : null;
      if (lu !== tiltEl) {
        if (tiltEl) { tiltEl.classList.remove('is-tilting'); tiltEl.style.setProperty('--rx', '0deg'); tiltEl.style.setProperty('--ry', '0deg'); }
        tiltEl = lu; if (tiltEl) tiltEl.classList.add('is-tilting');
      }
      if (tiltEl) {
        var q = tiltEl.getBoundingClientRect();
        var nx = (e.clientX - q.left) / q.width - .5, ny = (e.clientY - q.top) / q.height - .5;
        tiltEl.style.setProperty('--ry', (nx * 16).toFixed(2) + 'deg');
        tiltEl.style.setProperty('--rx', (-ny * 16).toFixed(2) + 'deg');
      }
      // magnetna dugmad: najbliže dugme do 80 px, pomak do 6 px
      var best = null, bd = 81;
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i], br = b.getBoundingClientRect();
        if (!br.width || br.bottom < 0 || br.top > vh()) continue;
        var dx = Math.max(br.left - e.clientX, 0, e.clientX - br.right), dy = Math.max(br.top - e.clientY, 0, e.clientY - br.bottom);
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < bd) { bd = d; best = b; }
      }
      if (best !== magEl && magEl) { magEl.style.setProperty('--mgx', '0px'); magEl.style.setProperty('--mgy', '0px'); }
      magEl = best;
      if (magEl) {
        var mr = magEl.getBoundingClientRect(), cx = mr.left + mr.width / 2, cy = mr.top + mr.height / 2;
        var f = 1 - bd / 80;
        var mx = Math.max(-6, Math.min(6, (e.clientX - cx) * .12 * (0.4 + f))), my = Math.max(-6, Math.min(6, (e.clientY - cy) * .2 * (0.4 + f)));
        magEl.style.setProperty('--mgx', mx.toFixed(1) + 'px');
        magEl.style.setProperty('--mgy', my.toFixed(1) + 'px');
      }
    }
    doc.addEventListener('pointermove', function (e) { if (e.pointerType && e.pointerType !== 'mouse') return; pend = e; if (!ptick) ptick = raf(frame); }, { passive: true });
    doc.addEventListener('pointerleave', function () {
      if (lit) lit.classList.remove('is-lit'); lit = null;
      if (tiltEl) { tiltEl.classList.remove('is-tilting'); tiltEl.style.setProperty('--rx', '0deg'); tiltEl.style.setProperty('--ry', '0deg'); tiltEl = null; }
      if (magEl) { magEl.style.setProperty('--mgx', '0px'); magEl.style.setProperty('--mgy', '0px'); magEl = null; }
    });
    // odsjaj ispod lebdećih ploča (svetla soba)
    $$('.kcta__art--photo .ph-frame').forEach(function (el) { el.classList.add('gl-reflect'); });
  }

  /* ====================================================================
     8. Čipovi profila → kartica; jedinice brojača
     ==================================================================== */
  var lineup = $('.lineup');
  $$('.hm-show__mid > .pill-row .pill').forEach(function (chip) {
    if (!lineup || $('button', chip)) return;
    var label = chip.textContent.trim();
    var b = doc.createElement('button');
    b.type = 'button';
    b.textContent = label;
    chip.textContent = '';
    chip.appendChild(b);
    b.addEventListener('click', function () {
      var key = label.toLowerCase().replace(/\s+/g, ' ');
      var card = $$('.lu', lineup).filter(function (c) { var n = $('.lu__n', c); return n && n.textContent.trim().toLowerCase().replace(/\s+/g, ' ') === key; })[0];
      if (!card) return;
      $$('.hm-show__mid > .pill-row .pill.is-active').forEach(function (p) { p.classList.remove('is-active'); });
      chip.classList.add('is-active');
      $$('.lu.is-flag', lineup).forEach(function (c) { c.classList.remove('is-flag'); });
      card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      card.classList.add('is-flag');
      clearTimeout(card.__flag);
      card.__flag = setTimeout(function () { card.classList.remove('is-flag'); chip.classList.remove('is-active'); }, 2600);
    });
  });

  $$('.refstat__n').forEach(function (n) {
    // „32 t“: jedinica je tekstualni čvor posle broja — dobija sopstveni <span>
    Array.prototype.slice.call(n.childNodes).forEach(function (c) {
      if (c.nodeType === 3 && c.nodeValue.trim()) {
        var s = doc.createElement('span'); s.className = 'unit'; s.textContent = c.nodeValue.trim();
        n.replaceChild(doc.createTextNode(' '), c); n.appendChild(s);
      }
    });
  });
  $$('[data-count]').forEach(function (c) {
    var host = c.closest('.stat__num, .refstat__n');
    if (!host) return;
    var done = function () { host.classList.add('is-unit-in'); };
    if (c.getAttribute('data-count-state') === 'done') { done(); return; }
    var mo = new MutationObserver(function () { if (c.getAttribute('data-count-state') === 'done') { mo.disconnect(); done(); } });
    mo.observe(c, { attributes: true, attributeFilter: ['data-count-state'] });
  });

  /* ====================================================================
     9. Traka: 84 → 68, klizna podvlaka, napredak na traci
     ==================================================================== */
  var header = $('#header');
  var prog = $('.scrollbar-progress');
  if (header && prog) header.appendChild(prog);
  var navList = $('.nav__list');
  if (navList) {
    var ink = doc.createElement('span');
    ink.className = 'nav__ink';
    ink.setAttribute('aria-hidden', 'true');
    navList.style.position = 'relative';
    navList.appendChild(ink);
    $('.nav').classList.add('has-ink');
    var cur = $('.nav__link[aria-current]', navList);
    var place = function (a) {
      if (!a) { ink.style.opacity = '0'; return; }
      var lr = navList.getBoundingClientRect(), r = a.getBoundingClientRect();
      ink.style.opacity = '1';
      ink.style.setProperty('--ink-x', (r.left - lr.left + 4).toFixed(1) + 'px');
      ink.style.setProperty('--ink-w', Math.max(0, r.width - 8).toFixed(1) + 'px');
    };
    var home = function () { place(cur); };
    $$('.nav__link', navList).forEach(function (a) {
      a.addEventListener('mouseenter', function () { place(a); });
      a.addEventListener('focus', function () { place(a); });
    });
    navList.addEventListener('mouseleave', home);
    navList.addEventListener('focusout', function (e) { if (!navList.contains(e.relatedTarget)) home(); });
    window.addEventListener('resize', home);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(home);
    onLoad(home);
    home();
  }

  /* ====================================================================
     10. Hero
     ==================================================================== */
  var hero = $('#hero');
  var slider = $('#heroSlider');
  if (hero && slider && 'MutationObserver' in window) {
    // posle ručnog izbora autoplay staje zauvek (hero-slider.js) — šina se puni do kraja
    new MutationObserver(function () { if (slider.getAttribute('aria-live') === 'polite') hero.classList.add('is-manual'); })
      .observe(slider, { attributes: true, attributeFilter: ['aria-live'] });
  }
  var ghosts = $$('.hero__ghost, .pagehead__ghost');

  /* Akcentne krhotine (najbrži sloj): tanke staklene ploče preko granica */
  var SH = [
    ['.hero', [[78, 74, 120, 220, -14], [6, 58, 70, 150, 9]]],
    ['.hm-stats', [[90, -8, 90, 180, 12]]],
    ['#plazma-blok', [[2, 12, 110, 60, -6], [86, 82, 70, 200, 18]]],
    ['.kcta', [[94, -10, 80, 120, -10]]],
    ['.pagehead', [[4, 70, 80, 180, 10], [92, 6, 120, 70, -8]]],
    ['.site-footer', [[8, -4, 140, 60, -4]]]
  ];
  var shards = [];
  SH.forEach(function (def) {
    $$(def[0]).forEach(function (host) {
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      def[1].forEach(function (s, i) {
        var d = doc.createElement('i');
        d.className = 'shard';
        d.setAttribute('aria-hidden', 'true');
        d.style.left = s[0] + '%'; d.style.top = s[1] + '%';
        d.style.width = s[2] + 'px'; d.style.height = s[3] + 'px';
        d.style.setProperty('--sr', s[4] + 'deg');
        host.appendChild(d);
        shards.push({ el: d, k: .16 + i * .06 });
      });
    });
  });

  /* ---- paralaksa po skrolu: jedan rAF -------------------------------------- */
  var stick = 0, lastY = -1;
  function onScroll() {
    stick = 0;
    var y = window.pageYOffset, h = vh();
    if (y === lastY) { if (header) header.classList.toggle('is-compact', y > 24); return; }
    lastY = y;
    if (reduced) { if (header) header.classList.toggle('is-compact', y > 24); return; }
    var max = Math.max(1, root.scrollHeight - h), p = y / max;
    // prvo sva čitanja rasporeda, pa svi upisi (inače svaki upis forsira novi raspored)
    var gr = ghosts.map(function (g) { return g.parentElement.getBoundingClientRect(); });
    var sr = shards.map(function (s) { return s.el.parentElement.getBoundingClientRect(); });
    if (header) header.classList.toggle('is-compact', y > 24);
    // prostor: fotografija najsporija (±6 % visine), mreža / fasete sporije od sadržaja
    if (L.photo) L.photo.style.transform = 'translate3d(0,' + ((.5 - p) * h * .12).toFixed(1) + 'px,0)';
    if (L.grid) L.grid.style.transform = 'translate3d(0,' + (-((y * .15) % 64)).toFixed(1) + 'px,0)';
    if (L.facets) L.facets.style.transform = 'translate3d(0,' + (-((y * .12) % 1400)).toFixed(1) + 'px,0)';
    ghosts.forEach(function (g, i) {
      var r = gr[i];
      if (r.bottom < 0) return;
      g.style.setProperty('--gy', (Math.max(0, -r.top) * .5).toFixed(1) + 'px');
    });
    shards.forEach(function (s, i) {
      var r = sr[i];
      if (r.bottom < -200 || r.top > h + 200) return;
      s.el.style.setProperty('--sy', (-(r.top + r.height / 2 - h / 2) * s.k).toFixed(1) + 'px');
    });
    askLive();
  }
  function ask() { if (!stick) stick = raf(onScroll); }
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', function () { lastY = -1; ask(); });
  onScroll();
  // hero se na kraju ulaza (is-boot) ne vraća — ulaz kartice nosi CSS

  /* ====================================================================
     12. Kolone: dve ploče jedna pored druge dele vrh i dno (.eqp);
         ostale kolone — kraća postaje lepljiva (razlika > 120 px)
     ==================================================================== */
  /* Dvostubačni rasporedi (bilo koji grid / flex red sa tačno dve vidljive
     kolone jedna pored druge, obe ≥ 240 px). Isti popis koristi i QA. */
  var SKIP_KID = /(^|\s)(hudc|g-tab|shard|sectionix)(\s|$)/;
  // visina sadržaja kolone (kolona može biti razvučena na visinu reda — praznina je tada unutra)
  function contentH(c) {
    var r = c.getBoundingClientRect(), bottom = r.top, any = false;
    Array.prototype.slice.call(c.children).forEach(function (k) {
      var ks = getComputedStyle(k);
      if (ks.position === 'absolute' || ks.position === 'fixed' || ks.display === 'none') return;
      var q = k.getBoundingClientRect(); if (!q.height) return;
      any = true; bottom = Math.max(bottom, q.bottom + (parseFloat(ks.marginBottom) || 0));
    });
    var pb = parseFloat(getComputedStyle(c).paddingBottom) || 0;
    return any ? Math.min(r.height, bottom - r.top + pb) : r.height;
  }
  function pairs() {
    var out = [];
    $$('main *, .pagehead *').forEach(function (el) {
      if (el.children.length < 2 || el.closest('.pin.is-pinned, .footer__cta, .hero, .lineup, .gallery, .ai-panel, .acc, table, svg')) return;
      var cs = getComputedStyle(el);
      if (cs.display !== 'grid' && !(cs.display === 'flex' && cs.flexDirection.indexOf('row') === 0)) return;
      var kids = Array.prototype.slice.call(el.children).filter(function (c) {
        if (SKIP_KID.test(c.className && c.className.baseVal === undefined ? c.className : '')) return false;
        var k = getComputedStyle(c);
        return k.display !== 'none' && k.position !== 'absolute' && k.position !== 'fixed' && c.getBoundingClientRect().height > 0;
      });
      if (kids.length !== 2) return;
      var a = kids[0].getBoundingClientRect(), b = kids[1].getBoundingClientRect();
      if (a.width < 240 || b.width < 240) return;
      if (!(a.right <= b.left + 1 || b.right <= a.left + 1)) return;      // nisu jedna pored druge
      if (Math.abs(a.top - b.top) > 160) return;
      var ha = contentH(kids[0]), hb = contentH(kids[1]);
      if (Math.max(ha, hb) < 400) return;                                // kratke trake (CTA, dugmad) nisu uredničke kolone
      out.push({ el: el, kids: kids, h: [ha, hb] });
    });
    return out;
  }
  // Ploča: staklo, okvir fotografije/rendera ili harmonika — sama kolona ili
  // njeno jedino dete (omotač). Unutrašnje kolone jedne ploče se ne računaju.
  var PANEL = '.gl, .ph-frame, .hm-plate, .acc, .about-fig, .svc-cap, .shape-a, .shape-b, .shape-c';
  function visKids(el) {
    return Array.prototype.slice.call(el.children).filter(function (c) {
      if (SKIP_KID.test(typeof c.className === 'string' ? c.className : '')) return false;
      var k = getComputedStyle(c);
      return k.display !== 'none' && k.position !== 'absolute' && k.position !== 'fixed' && c.getBoundingClientRect().height > 0;
    });
  }
  function panelish(c) {
    if (c.matches(PANEL) || c.matches('.svc-twin')) return true;
    var k = visKids(c);
    return k.length === 1 && k[0].matches(PANEL);
  }
  function eqPairs() {
    $$('main .eqp').forEach(function (el) { el.classList.remove('eqp'); });
    $$('main .eqp-w').forEach(function (el) { el.classList.remove('eqp-w'); });
    $$('main *').forEach(function (el) {
      if (el.children.length < 2 || el.matches(PANEL) || el.closest('.hero, .lineup, .gallery, .ai-panel, .acc, table, svg, .gl')) return;
      var cs = getComputedStyle(el);
      if (cs.display !== 'grid' && !(cs.display === 'flex' && cs.flexDirection.indexOf('row') === 0)) return;
      var kids = visKids(el);
      if (kids.length !== 2) return;
      var a = kids[0].getBoundingClientRect(), b = kids[1].getBoundingClientRect();
      if (a.width < 240 || b.width < 240) return;
      if (!(a.right <= b.left + 1 || b.right <= a.left + 1)) return;      // jedna ispod druge (telefon)
      if (!panelish(kids[0]) || !panelish(kids[1])) return;
      if (!kids[0].matches('.gl') && !kids[1].matches('.gl') && !kids[0].querySelector('.gl') && !kids[1].querySelector('.gl')) return;
      el.classList.add('eqp');
      kids.forEach(function (k) { if (!k.matches(PANEL)) k.classList.add('eqp-w'); });
    });
  }
  function balance() {
    $$('.is-stick').forEach(function (c) { c.classList.remove('is-stick'); });
    eqPairs();
    if (window.innerWidth < 960) return;
    pairs().forEach(function (p) {
      if (p.el.classList.contains('eqp')) return;
      var a = p.h[0], b = p.h[1];
      if (Math.abs(a - b) <= 120) return;
      var s = a < b ? p.kids[0] : p.kids[1];
      if (s.classList.contains('sticky') || getComputedStyle(s).position === 'sticky') return;
      if ((a < b ? a : b) > vh() - 140) return;   // ne staje u ekran — lepljenje ne pomaže
      s.classList.add('is-stick');
    });
  }
  balance();
  onLoad(balance);
  window.addEventListener('resize', function () { clearTimeout(balance.t); balance.t = setTimeout(balance, 150); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(balance);
  doc.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.acc__btn, .tabs__btn, details > summary')) setTimeout(balance, 450); });

  /* ====================================================================
     13. Prelaz teme i prelaz strana
     ==================================================================== */
  if (doc.startViewTransition && !reduced) {
    doc.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
      if (!b || !window.tricomTheme) return;
      e.stopPropagation();
      e.preventDefault();
      var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var w = window.innerWidth, h = vh();
      var rad = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
      root.style.setProperty('--vt-x', x.toFixed(0) + 'px');
      root.style.setProperty('--vt-y', y.toFixed(0) + 'px');
      root.style.setProperty('--vt-r', rad.toFixed(0) + 'px');
      root.classList.add('vt-theme');
      var next = window.tricomTheme.get() === 'dark' ? 'light' : 'dark';
      var t = doc.startViewTransition(function () { window.tricomTheme.set(next); });
      t.ready.catch(function () { /* brzi dvostruki klik preskače prelaz */ });
      t.finished.then(function () { root.classList.remove('vt-theme'); }, function () { root.classList.remove('vt-theme'); });
    }, true);
  }
  // prelaz strana: gde pregledač podržava View Transitions između dokumenata,
  // zavesa iz motion.js se gasi (inače ostaje kakva je bila)
  if ('onpagereveal' in window && location.protocol !== 'file:' && window.tricomMotion && window.tricomMotion.pt) window.tricomMotion.pt(false);

  /* ====================================================================
     14. Brojač sekcije kuca kao merač
     ==================================================================== */
  function pad(v, w) { v = String(v); while (v.length < w) v = '0' + v; return v; }
  if (tabs.length && !reduced && 'IntersectionObserver' in window) {
    var tIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = tabs.filter(function (x) { return x.el === e.target; })[0];
        tIO.unobserve(e.target);
        if (!t || t.done) return;
        t.done = true;
        var span = $('.g-tab__n', t.el), i = 0, steps = Math.max(6, t.n + 4);
        t.el.classList.add('is-ticking');
        var iv = setInterval(function () {
          i++;
          var v = i >= steps ? t.n : Math.floor(Math.random() * 10 * Math.pow(10, t.w - 1)) % (Math.pow(10, t.w));
          if (i >= steps - 3 && i < steps) v = Math.max(0, t.n - (steps - i));
          span.textContent = pad(v, t.w);
          if (i >= steps) { clearInterval(iv); span.textContent = pad(t.n, t.w); t.el.classList.remove('is-ticking'); }
        }, 55);
      });
    }, { threshold: 0.6 });
    tabs.forEach(function (t) { tIO.observe(t.el); });
  }

  window.tricomGlass = { live: assignLive, budget: budget, balance: balance, pairs: pairs };
})();
