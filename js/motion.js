/* ==========================================================================
   TRICOM — motion.js  („Forged Glass“: sistem pokreta)
   Učitava se posle main.js (defer) na svih 20 strana. Bez zavisnosti.

   - razred (html.tier-low | tier-medium | tier-high): MetalEnv.tier() ako je
     učitan, inače ista heuristika (?tier=, prefers-reduced-motion, broj
     jezgara, mobilni UA, gustina piksela, podrška za backdrop-filter);
     low = bez zamućenja, bez nagiba, bez glatkog skrola, bez paralakse,
     bez zavese između strana
   - glatki skrol: točkić miša → lerp 0,08 ka cilju (samo precizan
     pokazivač; ne na dodir, pod prefers-reduced-motion, na low razredu i
     u konfiguratoru). Ne hvata točkić nad skrolujućom decom (.tabs__nav,
     [data-scroll-x], .spec-scroll, textarea, select, .ai-body, bilo koji
     element sa overflow auto/scroll koji ima šta da skroluje). Sidra,
     tastatura i scrollTo drugih modula rade kao i pre: svaki skrol koji
     nije naš sinhronizuje cilj.
   - prikovane sekcije: .pin[data-pin-steps] → visina koraci × 100vh
     (--pin-h), unutrašnji .pin__stick lepljiv, napredak --p 0–1 na
     sekciji; deca se animiraju u CSS-u (css/motion.css). Dok je sekcija
     prikovana nosi .is-pinning (staklo bez zamućenja). Prikiva se samo
     kad sadržaj staje u ekran (≥ 1024 px širine).
   - paralaksa [data-parallax] (preuzeto iz main.js, isti rezultat)
   - nagib i sjaj pokazivača na .g-card (--tx/--ty u stepenima, --mx/--my
     u px; 1,5° podrazumevano, 4° uz data-tilt), magnetna dugmad
     .btn:not(.btn--glass) do 6 px
   - kapsulasti reveal data-reveal="capsule": klasu .is-in daje main.js
     (modul 5), ovde se posle prelaza skida clip-path (.is-settled) da ne
     seče senku
   - zavesa između strana (.pt): klik na unutrašnju vezu → zavesa 350 ms →
     navigacija (sessionStorage['tricom-pt']); nova strana počinje sa
     zavesom i skida je u prvom kadru (najkasnije 1,2 s). Ne radi na
     nazad/napred, pod prefers-reduced-motion, na low razredu i u
     konfiguratoru.
   - brojači [data-count]: kotur cifara (.odo/.odo__s) sa zamućenjem koje
     se slegne; 1000 ms, a 1200 ms od starta tekst je tačno ciljna
     vrednost bez obzira na frejmove. main.js drži samo sigurnosni ispis.

   Jedna kriva cubic-bezier(.2,.7,.2,1); trajanja 200 / 400 / 700 / 1000.
   Sve staje van ekrana (IntersectionObserver / geometrija) i kad je tab
   sakriven. window.tricomMotion = { tier, smooth(on), state(), pt(on) }.
   ========================================================================== */
(function () {
  'use strict';
  // skripte se učitavaju posle prvog crtanja, pa „load“ može već da je prošao
  var onLoad = function (f) { if (document.readyState === 'complete') setTimeout(f, 0); else window.addEventListener('load', f); };

  var doc = document, root = doc.documentElement, body = doc.body;
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  var L = window.L10N;
  var ROOT = L ? L.root : '';
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var K = !!body && body.classList.contains('k-body');
  var EASE = 'cubic-bezier(.2,.7,.2,1)';
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var caf = window.cancelAnimationFrame || clearTimeout;

  /* ====================================================================
     1. Razred kvaliteta
     ==================================================================== */
  function glass() {
    try { return !!(window.CSS && CSS.supports && (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'))); }
    catch (e) { return true; }
  }
  function heuristic() {
    var q = /[?&]tier=(high|medium|low)/.exec(location.search);
    if (q) return q[1];
    var hc = navigator.hardwareConcurrency || 8, dpr = window.devicePixelRatio || 1;
    var ua = navigator.userAgent;
    var mob = /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    var low = reduced || hc <= 2 || (mob && hc <= 4);
    var medium = !low && (hc <= 4 || mob || dpr >= 3);
    return low ? 'low' : medium ? 'medium' : 'high';
  }
  var tier = (window.MetalEnv && typeof MetalEnv.tier === 'function') ? MetalEnv.tier() : heuristic();
  if (reduced || !glass()) tier = 'low';
  // glass-dom.js je razred već upisao pre prvog rasporeda (procena bez WebGL probe);
  // menja se samo ako se razlikuje — svaka promena klase na <html> preračunava ceo dokument
  if (!root.classList.contains('tier-' + tier)) {
    root.classList.remove('tier-low', 'tier-medium', 'tier-high');
    root.classList.add('tier-' + tier);
  }
  var LOW = tier === 'low';
  var hidden = function () { return !!doc.hidden; };

  /* ====================================================================
     2. Glatki skrol (točkić → lerp)
     ==================================================================== */
  var smooth = (function () {
    var on = false, target = 0, cur = 0, loop = 0, expect = -1, expect2 = -1, bound = false;
    var SKIP = '.tabs__nav, [data-scroll-x], .spec-scroll, .spec-wrap, textarea, select, .ai-body, .ai-panel, .lightbox, .mnav, #mobileNav, .k-panel, .k-ins';

    function maxY() { return Math.max(0, root.scrollHeight - window.innerHeight); }
    function locked() { return root.style.overflow === 'hidden' || body.style.overflow === 'hidden'; }
    function scrollable(el) {
      for (; el && el !== body && el !== root; el = el.parentNode) {
        if (el.nodeType !== 1) continue;
        if (el.matches && el.matches(SKIP)) return true;
        var cs = getComputedStyle(el), oy = cs.overflowY, ox = cs.overflowX;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true;
        if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 1) return true;
      }
      return false;
    }
    function jump(y) {
      expect2 = expect; expect = y;
      // 'instant' zaobilazi html { scroll-behavior: smooth } — sidra ga i dalje koriste
      try { window.scrollTo({ top: y, left: window.pageXOffset, behavior: 'instant' }); }
      catch (e) { window.scrollTo(window.pageXOffset, y); }
    }
    function step() {
      loop = 0;
      if (!on) return;
      // neko je pomerio stranu od našeg poslednjeg upisa (programski scrollTo i sl.): prepuštamo
      var now = window.pageYOffset;
      if (expect >= 0 && Math.abs(now - expect) > 1) { release(); return; }
      var d = target - cur;
      if (Math.abs(d) < 0.5) cur = target; else cur += d * 0.08;
      // cele piksele: svaki skrol koji odstupa > 1 px od upisanog nije naš
      jump(Math.round(cur));
      if (cur !== target && !hidden()) loop = raf(step);
    }
    function wheel(e) {
      if (!on || e.ctrlKey || e.defaultPrevented) return;
      if (locked() || scrollable(e.target)) return;
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= window.innerHeight;
      if (!dy) return;
      e.preventDefault();
      if (!loop) { cur = window.pageYOffset; target = cur; }
      target = Math.max(0, Math.min(maxY(), target + dy));
      if (!loop) loop = raf(step);
    }
    function release() {
      // prepuštamo skrol pregledaču: sidro (hashchange), klik (scrollIntoView
      // drugog modula, veza), tastatura, nazad/napred, dodir
      if (loop) { caf(loop); loop = 0; }
      cur = target = window.pageYOffset;
      expect = expect2 = -1;
    }
    // provera jednom po frejmu: čitanje pageYOffset posle upisa stilova forsira raspored,
    // a skrol događaja zna da bude više u jednom frejmu
    var chk = 0;
    function onScroll() { if (on && !chk) chk = raf(check); }
    function check() {
      chk = 0;
      if (!on) return;
      var y = window.pageYOffset;
      if (Math.abs(y - expect) > 1 && Math.abs(y - expect2) > 1) {
        // skrol koji nismo mi (scrollTo / scrollIntoView drugog modula, sidro,
        // tastatura, prevlačenje trake): odmah postaje cilj, lerp staje
        cur = target = y;
        if (loop) { caf(loop); loop = 0; }
      }
    }
    function set(v) {
      v = !!v && !K && !LOW && fine && !mq('(pointer: coarse)');
      if (v === on) return on;
      on = v;
      if (on && !bound) {
        bound = true;
        window.addEventListener('wheel', wheel, { passive: false });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function () { target = Math.min(target, maxY()); }, { passive: true });
        window.addEventListener('hashchange', release);
        window.addEventListener('popstate', release);
        doc.addEventListener('click', release, true);
        doc.addEventListener('keydown', release, true);
        doc.addEventListener('focusin', release, true);
        doc.addEventListener('touchstart', release, { capture: true, passive: true });
        doc.addEventListener('visibilitychange', function () { if (!hidden() && on && cur !== target && !loop) loop = raf(step); });
      }
      if (!on && loop) { caf(loop); loop = 0; }
      cur = target = window.pageYOffset;
      return on;
    }
    return { set: set, get: function () { return on; } };
  })();
  smooth.set(true);

  /* ====================================================================
     3. Prikovane sekcije
     ==================================================================== */
  var pins = (function () {
    var secs = K ? [] : $$('.pin[data-pin-steps]');
    var items = secs.map(function (s) {
      return { el: s, stick: s.querySelector('.pin__stick'), steps: Math.max(2, parseInt(s.getAttribute('data-pin-steps'), 10) || 2), on: false, p: -1, lit: false };
    });
    if (!items.length) return { items: items, layout: function () {}, update: function () {} };

    function fits(it) {
      if (LOW || !it.stick) return false;
      if (window.innerWidth < 1024 || window.innerHeight < 640) return false;
      // merimo u prikovanom stanju: sadržaj + gornji i donji padding kadra (ritam sekcija) mora da stane u ekran
      var had = it.el.classList.contains('is-pinned');
      if (!had) it.el.classList.add('is-pinned');
      var inner = it.stick.firstElementChild;
      var h = inner ? inner.getBoundingClientRect().height : it.stick.scrollHeight;
      var ps = getComputedStyle(it.stick);
      var pad = (parseFloat(ps.paddingTop) || 0) + (parseFloat(ps.paddingBottom) || 0);
      if (!had) it.el.classList.remove('is-pinned');
      return h + pad <= window.innerHeight;
    }
    // potpis: ekran + visina sadržaja svake sekcije u trenutnom stanju; ako se ništa
    // nije promenilo od poslednjeg merenja, ne merimo ponovo (merenje privremeno
    // prikiva sekciju, a to pregledač broji kao pomak rasporeda — CLS)
    var lastSig = '';
    function sig() {
      return window.innerWidth + 'x' + window.innerHeight + ':' + items.map(function (it) {
        var inner = it.stick && it.stick.firstElementChild;
        return (it.on ? 'p' : 'u') + (inner ? Math.round(inner.getBoundingClientRect().height) : 0);
      }).join(',');
    }
    function layout() {
      if (sig() === lastSig) return;
      items.forEach(function (it) {
        var ok = fits(it);
        it.el.classList.toggle('is-pinned', ok);
        if (ok) it.el.style.setProperty('--pin-h', (it.steps * 100) + 'vh');
        else {
          it.el.style.removeProperty('--pin-h');
          it.el.style.removeProperty('--p');
          it.el.classList.remove('is-pinning');
          it.p = -1;
        }
        it.on = ok;
      });
      lastSig = sig();
    }
    function hook(it, p) {
      // 07/10: linija procesa prati napredak dok je sekcija prikovana (preko inline --pfill,
      // koji main.js takođe piše — naš upis stiže kasnije u istom frejmu)
      $$('.process', it.el).forEach(function (b) {
        b.style.setProperty('--pfill', (p * 100).toFixed(1) + '%');
        var steps = $$('.step', b), n = steps.length;
        steps.forEach(function (s, i) { s.classList.toggle('is-past', p >= (i + 0.5) / n); });
      });
    }
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        if (!it.on) return;
        var r = it.el.getBoundingClientRect();
        var total = r.height - vh;
        var p = total > 0 ? -r.top / total : 1;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        p = Math.round(p * 1000) / 1000;
        var near = r.bottom > -vh && r.top < vh * 2;     // van ovog pojasa ne diramo decu (samo --p)
        if (p !== it.p) {
          it.p = p;
          it.el.style.setProperty('--p', p);
          it.el.classList.toggle('is-pinning', p > 0 && p < 1);
          if (p > 0 && !it.lit) {
            it.lit = true;
            // sadržaj koji CSS seče (clip-path) posmatrač reveala može da ne vidi — otvaramo ga sami
            $$('[data-reveal], .sectionix', it.el).forEach(function (n) { n.classList.add('is-in'); });
          }
          if (!near) hook(it, p);
        }
        if (near) hook(it, p);
      });
    }
    function relayout() { layout(); update(); }
    layout();
    window.addEventListener('resize', relayout);
    onLoad(function () { relayout(); setTimeout(relayout, 600); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(relayout);
    return { items: items, layout: layout, update: update };
  })();

  /* ====================================================================
     3b. Čuvar dubokih veza
     Pregledač animira i prvo sletanje na #id (html { scroll-behavior:
     smooth }); ako se raspored iznad cilja promeni dok animacija traje
     (zamena fonta, lenje slike), strana stane 30–130 px pored sidra. Kad
     se skrol smiri — a posetilac ništa nije dirao — cilj se jednom namesti
     (trenutno, uz scroll-padding / scroll-margin). #s= nema element,
     a hešove tabova (proizvodi.html?grupa=oluci#prog) vodi modul tabova u main.js.
     ==================================================================== */
  (function anchorGuard() {
    if (K) return;
    var id = (location.hash || '').replace(/^#/, '');
    if (!id) return;
    var el = null;
    try { el = doc.getElementById(decodeURIComponent(id)); } catch (e) { el = null; }
    if (!el) return;
    var touched = false, lastY = -1, polls = 0, timer = 0;
    function touch() { touched = true; }
    ['wheel', 'keydown', 'touchstart', 'pointerdown'].forEach(function (ev) {
      doc.addEventListener(ev, touch, { capture: true, passive: true });
    });
    window.addEventListener('hashchange', touch);
    function poll() {
      timer = 0;
      if (touched || location.hash !== '#' + id) return;
      var y = window.pageYOffset;
      if (y !== lastY && polls < 14) { lastY = y; polls++; timer = setTimeout(poll, 220); return; }
      var cs = getComputedStyle(root);
      var want = (parseFloat(cs.scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      var top = el.getBoundingClientRect().top;
      var max = root.scrollHeight - window.innerHeight;
      var atEnd = y >= max - 1 && top <= want;
      var off = top - want;
      // Namešta se samo kad je strana stala TIK pored sidra (pomak rasporeda za
      // vreme animacije); ako je neko u međuvremenu programski otišao drugde
      // (scrollTo(0,0) i sl.), ništa se ne dira.
      if (Math.abs(off) > 2 && Math.abs(off) <= 240 && !atEnd) {
        try { el.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) { el.scrollIntoView(true); }
      }
    }
    onLoad(function () { timer = setTimeout(poll, 500); });
  })();

  /* ====================================================================
     4. Paralaksa [data-parallax] (isti račun kao raniji modul u main.js)
     ==================================================================== */
  var parallax = (function () {
    var nodes = (LOW || K) ? [] : $$('[data-parallax]');
    function update() {
      if (!nodes.length) return;
      var vh = window.innerHeight;
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var k = parseFloat(n.getAttribute('data-parallax')) || 0.08;
        var mid = r.top + r.height / 2 - vh / 2;
        n.style.transform = 'translate3d(0,' + (-mid * k).toFixed(1) + 'px,0)';
      });
    }
    return { update: update, n: nodes.length };
  })();

  /* ---- jedan rAF po skrolu za prikivanje, paralaksu i start brojača ------ */
  var countersCheck = null;   // postavlja modul 8
  (function scrollDriver() {
    var tick = 0;
    function frame() { tick = 0; pins.update(); parallax.update(); if (countersCheck) countersCheck(); }
    function ask() { if (!tick && !hidden()) tick = raf(frame); }
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    doc.addEventListener('visibilitychange', function () { if (!hidden()) ask(); });
    frame();
  })();

  /* ====================================================================
     5. Nagib i sjaj pokazivača na .g-card, magnetna dugmad
     ==================================================================== */
  (function pointer() {
    if (LOW || !fine) return;
    var card = null, btn = null, ev = null, loop = 0;
    var tx = 0, ty = 0, ttx = 0, tty = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
    var cardEl = null, btnEl = null;   // elementi koji još nose vrednosti (vraćaju se na nulu)

    function frame() {
      loop = 0;
      var busy = false;
      if (cardEl) {
        tx += (ttx - tx) * 0.18; ty += (tty - ty) * 0.18;
        if (Math.abs(tx - ttx) < 0.01 && Math.abs(ty - tty) < 0.01) { tx = ttx; ty = tty; }
        cardEl.style.setProperty('--tx', tx.toFixed(2) + 'deg');
        cardEl.style.setProperty('--ty', ty.toFixed(2) + 'deg');
        if (!card && tx === 0 && ty === 0) {
          cardEl.style.removeProperty('--tx'); cardEl.style.removeProperty('--ty');
          cardEl.classList.remove('is-tilt'); cardEl = null;
        } else busy = true;
      }
      if (btnEl) {
        mx += (tmx - mx) * 0.18; my += (tmy - my) * 0.18;
        if (Math.abs(mx - tmx) < 0.05 && Math.abs(my - tmy) < 0.05) { mx = tmx; my = tmy; }
        btnEl.style.setProperty('--mgx', mx.toFixed(1) + 'px');
        btnEl.style.setProperty('--mgy', my.toFixed(1) + 'px');
        if (!btn && mx === 0 && my === 0) {
          btnEl.style.removeProperty('--mgx'); btnEl.style.removeProperty('--mgy'); btnEl = null;
        } else busy = true;
      }
      if (busy && !hidden()) loop = raf(frame);
    }
    function go() { if (!loop) loop = raf(frame); }

    function aimCard(e) {
      var r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var max = card.hasAttribute('data-tilt') ? 4 : 1.5;
      ttx = (x / r.width - 0.5) * 2 * max;
      tty = -(y / r.height - 0.5) * 2 * max;
      card.style.setProperty('--mx', x.toFixed(0) + 'px');
      card.style.setProperty('--my', y.toFixed(0) + 'px');
    }
    function aimBtn(e) {
      var r = btn.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 12;    // ±6 px
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 12;
    }
    function reset(which) {
      if (which === 'card') { card = null; ttx = tty = 0; }
      else { btn = null; tmx = tmy = 0; }
      go();
    }

    doc.addEventListener('mousemove', function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      var c = t ? t.closest('.g-card') : null;
      var b = null;   // magnetna dugmad (radijus 80 px) vodi js/glass.js; ovde samo stare vrednosti
      if (c !== card) {
        if (card) reset('card');
        card = c;
        if (card) {
          if (cardEl && cardEl !== card) { cardEl.style.removeProperty('--tx'); cardEl.style.removeProperty('--ty'); cardEl.classList.remove('is-tilt'); }
          cardEl = card; tx = ty = 0; card.classList.add('is-tilt');
        }
      }
      if (b !== btn) {
        if (btn) reset('btn');
        btn = b;
        if (btn) {
          if (btnEl && btnEl !== btn) { btnEl.style.removeProperty('--mgx'); btnEl.style.removeProperty('--mgy'); }
          btnEl = btn; mx = my = 0;
        }
      }
      if (card) aimCard(e);
      if (btn) aimBtn(e);
      if (card || btn) go();
    }, { passive: true });
    doc.addEventListener('mouseleave', function () { if (card) reset('card'); if (btn) reset('btn'); });
  })();

  /* ====================================================================
     6. Kapsulasti reveal — posle prelaza clip-path se skida (ne seče senku)
     ==================================================================== */
  (function capsule() {
    var caps = $$('[data-reveal="capsule"]');
    doc.addEventListener('transitionend', function (e) {
      var t = e.target;
      if (!t || !t.getAttribute || t.getAttribute('data-reveal') !== 'capsule') return;
      if (e.propertyName === 'clip-path' && t.classList.contains('is-in')) t.classList.add('is-settled');
    });
    if (reduced || LOW) { caps.forEach(function (n) { n.classList.add('is-in', 'is-settled'); }); return; }
    if (!caps.length) return;
    // Sopstveni posmatrač sa pragom ~0: presek koji Chrome seče početnim
    // clip-path-om (24 % kutije) ne zavisi od praga reveala u main.js (0,12).
    if (!('IntersectionObserver' in window)) { caps.forEach(function (n) { n.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.02, rootMargin: '0px 0px -8% 0px' });
    caps.forEach(function (n) { io.observe(n); });
  })();

  /* ====================================================================
     7. Zavesa između strana
     ==================================================================== */
  var pt = (function () {
    var KEY = 'tricom-pt', enabled = !LOW && !K, el = null, leaving = false;
    function flag(v) { try { if (v) sessionStorage.setItem(KEY, '1'); else sessionStorage.removeItem(KEY); } catch (e) { /* file:// / privatni režim */ } }
    function had() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
    function make() {
      if (el) return el;
      el = doc.createElement('div');
      el.className = 'pt';
      el.setAttribute('aria-hidden', 'true');
      var img = doc.createElement('img');
      img.className = 'pt__logo';
      img.alt = '';
      img.width = 220; img.height = 106;
      img.decoding = 'sync';
      img.src = ROOT + 'assets/tricom-logo-web.png';
      el.appendChild(img);
      body.appendChild(el);
      return el;
    }
    function navType() {
      try { var n = performance.getEntriesByType('navigation')[0]; return n ? n.type : ''; } catch (e) { return ''; }
    }

    // dolazak: zavesa je već spuštena, diže se odmah (prvo iscrtavanje ne čeka)
    if (had()) {
      flag(false);
      if (enabled && navType() !== 'back_forward') {
        make();
        el.classList.add('no-anim', 'is-on');
        var done = false;
        var lift = function () {
          if (done) return;
          done = true;
          raf(function () { el.classList.remove('no-anim'); raf(function () { el.classList.remove('is-on'); }); });
        };
        setTimeout(lift, 1200);
        if (!doc.getElementById('loader') || body.classList.contains('is-ready')) setTimeout(lift, 60);
        else if (typeof MutationObserver === 'function') {
          new MutationObserver(function (m, o) { if (body.classList.contains('is-ready')) { o.disconnect(); lift(); } })
            .observe(body, { attributes: true, attributeFilter: ['class'] });
        }
      }
    }
    // povratak iz bfcache-a: stara zavesa ne sme da ostane
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted || !el) return;
      el.classList.add('no-anim'); el.classList.remove('is-on'); leaving = false;
    });

    // odlazak
    doc.addEventListener('click', function (e) {
      if (!enabled || leaving || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      var href = a.getAttribute('href') || '';
      if (/^\s*(#|mailto:|tel:|javascript:|sms:)/i.test(href)) return;
      var u;
      try { u = new URL(a.href, location.href); } catch (err) { return; }
      if (u.protocol !== location.protocol || u.host !== location.host) return;
      if (u.pathname === location.pathname && u.search === location.search && u.hash) return;   // samo heš
      if (!/(\.html?|\/)$/i.test(u.pathname)) return;                                            // dokumenti i fajlovi za skidanje
      e.preventDefault();
      leaving = true;
      make();
      el.classList.remove('no-anim');
      void el.offsetWidth;
      el.classList.add('is-on');
      flag(true);
      var dest = a.href, gone = false;
      var go = function () { if (gone) return; gone = true; location.href = dest; };
      setTimeout(go, 380);       // 350 ms zavesa + jedan frejm
      setTimeout(go, 1200);      // sigurnosni ventil
    });

    return { set: function (v) { enabled = !!v && !LOW && !K; return enabled; }, get: function () { return enabled; } };
  })();

  /* ====================================================================
     8. Brojači — kotur cifara sa zamućenjem, deterministički kraj
     ==================================================================== */
  (function counters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;
    var STAG = 40, FORCE = 1200;   // trajanje okretanja (1000 ms) je u css/motion.css
    var EN = !!L && L.lang() === 'en';

    function fmt(v, dec) {
      if (EN) return L.num(v, dec, true);
      return v.toFixed(dec).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    /* Deterministički tekst: ćelija .odo nosi KONAČNU cifru kao tekst od
       trenutka kad se skripta izvrši; traka koja se okreće je ::before
       pseudo-sadržaj (data-strip, css/motion.css) i ne ulazi u textContent.
       Zato je textContent elementa tačno „60“ / „2.400“ / „32“ / „14“ u
       svakom trenutku, bez obzira na frejmove i zastoje glavne niti. */
    function prep(n) {
      var target = parseFloat(n.getAttribute('data-count'));
      var dec = parseInt(n.getAttribute('data-dec') || '0', 10);
      var end = fmt(target, dec);
      n.__end = end;
      if (reduced) { n.textContent = end; n.setAttribute('data-count-state', 'done'); return; }
      n.textContent = '';
      var cols = [];
      for (var i = 0; i < end.length; i++) {
        var ch = end.charAt(i);
        if (ch < '0' || ch > '9') { n.appendChild(doc.createTextNode(ch)); continue; }
        var col = doc.createElement('span'); col.className = 'odo';
        var stop = 10 + (+ch), strip = [];
        for (var d = 0; d <= stop; d++) strip.push(String(d % 10));
        col.setAttribute('data-strip', strip.join('\n'));
        col.style.setProperty('--odo-stop', '-' + stop + 'em');
        var b = doc.createElement('b'); b.textContent = ch;
        col.appendChild(b);
        n.appendChild(col);
        cols.push(col);
      }
      n.__cols = cols;
      n.setAttribute('data-count-state', cols.length ? 'ready' : 'done');
      n.classList.toggle('is-odo', !!cols.length);
    }
    function finish(n) {
      n.textContent = n.__end;
      n.classList.remove('is-odo', 'is-settle');
      n.setAttribute('data-count-state', 'done');
    }
    function run(n) {
      if (n.getAttribute('data-count-state') !== 'ready') return;
      n.setAttribute('data-count-state', 'run');
      n.__t0 = Date.now();
      var cols = n.__cols, last = cols.length - 1;
      cols.forEach(function (c, i) { c.style.setProperty('--odo-d', ((last - i) * STAG) + 'ms'); });
      raf(function () { raf(function () {
        n.classList.add('is-settle');
        cols.forEach(function (c) { c.style.setProperty('--odo-y', c.style.getPropertyValue('--odo-stop')); });
      }); });
      setTimeout(function () { finish(n); }, FORCE);
    }
    nodes.forEach(prep);
    // Sigurnosni sloj po geometriji (isti prag: bar pola elementa u ekranu) —
    // poziva ga rAF skrol-pokretač, pa start ne zavisi samo od isporuke
    // IntersectionObserver poziva.
    countersCheck = function () {
      var vh = window.innerHeight;
      nodes.forEach(function (n) {
        var st = n.getAttribute('data-count-state');
        if (st === 'run' && Date.now() - n.__t0 >= FORCE) { finish(n); return; }   // zakasneli tajmer
        if (st !== 'ready') return;
        var r = n.getBoundingClientRect();
        if (!r.height) return;
        var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (vis >= r.height * 0.5) run(n);
      });
    };
    if (!('IntersectionObserver' in window)) { nodes.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { io.observe(n); });
    onLoad(countersCheck);
  })();

  /* ====================================================================
     9. Javni API (probe)
     ==================================================================== */
  window.tricomMotion = {
    tier: tier,
    smooth: function (v) { return smooth.set(v); },
    pt: function (v) { return pt.set(v); },
    state: function () {
      return {
        tier: tier,
        reduced: reduced,
        k: K,
        smooth: smooth.get(),
        pt: pt.get(),
        parallax: parallax.n,
        pins: pins.items.map(function (it) { return { steps: it.steps, pinned: it.on, p: it.p }; })
      };
    }
  };
})();
