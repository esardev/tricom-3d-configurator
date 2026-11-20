/* ==========================================================================
   TRICOM — hero-slider.js
   Hero na početnoj: tri ekrana u istoj kompoziciji (krovni i olučni sistemi ·
   obrada metala · limovi, cevi i profili). Menja se samo sadržaj: oznaka,
   naslov, rečenica i dugme na staklenoj ploči i 3D objekat (js/hero3d.js,
   događaj „tricom:hero“). Pozadina je čista podloga strane, bez fotografije.

   - vertikalni pejdžer 01 — linija — 03 u desnom žlebu (na telefonu tačke);
     klik na broj ide na taj ekran
   - strelice levo i desno: skrivene u miru, pale se (200 ms) na pomeraj miša
     nad hero-om (precizan pokazivač, ekran ≥ 1060 px), gase se posle 1500 ms
     mirovanja; uz fokus sa tastature uvek vidljive; na dodir ih nema (swipe)
   - tastatura: ← / → dok je fokus u hero-u; dodir: swipe levo / desno
   - autoplay 7 s; pauza dok je miš ili fokus nad hero-om, dok je tab u
     pozadini i dok hero nije na ekranu; posle bilo kog ručnog izbora staje
     zauvek; uz prefers-reduced-motion ga nema
   - prelaz 600 ms, jedna kriva (CSS): linije naslova izlaze i ulaze kroz
     masku (60 ms razmaka), objekat se pretapa i raste 0,96 → 1, kote se
     ponovo crtaju
   - #s=2 u adresi bira ekran pri učitavanju; ručni izbor menja adresu bez
     novog unosa u istoriji, autoplay je ne dira
   - paralaksa pokazivača: vodeni žig 6 px, objekat 10 px
     (promenljive --px / --py na hero-u)
   ========================================================================== */
(function () {
  'use strict';
  // skripte se učitavaju posle prvog crtanja, pa „load“ može već da je prošao
  var onLoad = function (f) { if (document.readyState === 'complete') setTimeout(f, 0); else window.addEventListener('load', f); };

  var SLIDE_MS = 7000;   // trajanje jednog ekrana
  var ARROW_MS = 1500;   // strelice se gase posle ovoliko mirovanja miša
  var SWAP_MS = 600;     // trajanje prelaza

  var hero = document.getElementById('hero');
  var slider = document.getElementById('heroSlider');
  if (!hero || !slider) return;

  var $$ = function (s, c) { return Array.prototype.slice.call((c || hero).querySelectorAll(s)); };
  var slides = $$('.hero__slide', slider);
  if (slides.length < 2) return;
  var stills = $$('.hero3d__still');
  var pages = $$('.hero__pg');
  var track = hero.querySelector('.hero__pg-track');
  var curN = hero.querySelector('.hero__pg-n');
  var host = document.getElementById('hero3d');
  var prevBtn = hero.querySelector('.hero__arrow--prev');
  var nextBtn = hero.querySelector('.hero__arrow--next');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointerQ = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1060px)');

  var n = slides.length, index = 0, timer = null, arrowTimer = null, leaveTimer = null;
  var hover = false, focus = false, onscreen = true, manual = false;

  // #s=2 bira ekran pri učitavanju (pre nego što hero3d.js pročita data-start)
  var m = /(?:^#|&)s=(\d+)/.exec(location.hash || '');
  if (m) index = Math.max(0, Math.min(n - 1, parseInt(m[1], 10) - 1));
  if (host) host.setAttribute('data-start', index);

  function mark(list, i, prev) {
    list.forEach(function (el, k) {
      var on = k === i;
      el.classList.toggle('is-active', on);
      el.classList.toggle('is-leaving', k === prev && !on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  }

  function render(prev) {
    mark(slides, index, prev);
    stills.forEach(function (s, k) {
      if (k === index) s.classList.add('is-pre');      // slika aktivnog ekrana se učitava odmah
      s.classList.toggle('is-on', k === index);
    });
    // dugmad neaktivnih ekrana nisu u redosledu tabulatora
    slides.forEach(function (el, k) {
      $$('a, button', el).forEach(function (a) {
        if (k === index) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1');
      });
    });
    pages.forEach(function (p, k) { p.setAttribute('aria-current', k === index ? 'true' : 'false'); });
    if (track) track.style.setProperty('--i', index);
    if (curN) curN.textContent = (index < 9 ? '0' : '') + (index + 1);
    hero.setAttribute('data-i', index);
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(function () {
      slides.forEach(function (el) { el.classList.remove('is-leaving'); });
    }, SWAP_MS);
  }

  function go(i, byHand) {
    var prev = index;
    index = (i + n) % n;
    if (index === prev) return;
    hero.classList.remove('is-boot');                  // ulazna animacija samo pri učitavanju
    slides.forEach(function (s) { s.classList.remove('is-first'); });
    render(prev);
    hero.dispatchEvent(new CustomEvent('tricom:hero', { bubbles: true, detail: { index: index } }));
    if (byHand) {
      try { history.replaceState(history.state, '', location.pathname + location.search + '#s=' + (index + 1)); } catch (e) { /* file:// u nekim pregledačima */ }
    }
  }

  /* ---- autoplay: pauza na hover / fokus / skriven tab, kraj posle ručnog izbora */
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  function start() {
    stop();
    if (reduce || manual || hover || focus || !onscreen || document.hidden) return;
    timer = setTimeout(function () { timer = null; go(index + 1, false); start(); }, SLIDE_MS);
  }
  // svaki ručni izbor gasi autoplay zauvek; čitač ekrana od tada najavljuje ekrane
  function byHand(i) {
    manual = true;
    stop();
    slider.setAttribute('aria-live', 'polite');
    go(i, true);
  }

  /* ---- strelice: vidljive samo dok se miš kreće ---------------------------- */
  function flash() {
    if (!pointerQ.matches) return;
    hero.classList.add('is-pointing');
    if (arrowTimer) clearTimeout(arrowTimer);
    arrowTimer = setTimeout(function () { hero.classList.remove('is-pointing'); }, ARROW_MS);
  }

  /* ---- paralaksa pokazivača ------------------------------------------------ */
  var px = 0, py = 0, tx = 0, ty = 0, raf = 0;
  function tick() {
    px += (tx - px) * 0.08; py += (ty - py) * 0.08;
    hero.style.setProperty('--px', px.toFixed(3));
    hero.style.setProperty('--py', py.toFixed(3));
    raf = (Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002) ? requestAnimationFrame(tick) : 0;
  }
  function aim(x, y) {
    if (reduce) return;
    tx = x; ty = y;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  hero.addEventListener('mousemove', function (e) {
    flash();
    var r = hero.getBoundingClientRect();
    aim((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1);
  }, { passive: true });
  hero.addEventListener('mouseenter', function () { hover = true; stop(); });
  hero.addEventListener('mouseleave', function () {
    hover = false;
    hero.classList.remove('is-pointing');
    if (arrowTimer) clearTimeout(arrowTimer);
    aim(0, 0);
    start();
  });
  hero.addEventListener('focusin', function () { focus = true; stop(); });
  hero.addEventListener('focusout', function (e) {
    if (e.relatedTarget && hero.contains(e.relatedTarget)) return;
    focus = false; start();
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { byHand(index - 1); flash(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { byHand(index + 1); flash(); });

  pages.forEach(function (p, i) {
    p.addEventListener('click', function () { byHand(i); });
  });

  /* ---- tastatura: ← / → dok je fokus u hero-u (ne u polju za unos) --------- */
  hero.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    var d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
    if (!d) return;
    e.preventDefault();
    byHand(index + d);
    if (e.target.classList && e.target.classList.contains('hero__pg') && pages[index]) pages[index].focus();
  });

  /* ---- dodir: swipe levo / desno (vertikalni pokret je skrol) --------------- */
  (function () {
    var x0 = null, y0 = null;
    hero.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy)) return;
      byHand(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  })();

  /* ---- štednja: bez autoplaya kad hero ili tab nisu na ekranu --------------- */
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      onscreen = en[0].isIntersecting;
      if (onscreen) start(); else stop();
    }, { threshold: 0.25 }).observe(hero);
  }

  // Uz statičnu sliku objekta (telefon, slabiji računar, smanjeno kretanje) slike
  // ostala dva ekrana se učitaju kad strana miruje; uz živi 3D nisu potrebne.
  onLoad(function () {
    setTimeout(function () {
      if (!document.documentElement.classList.contains('h3d-static')) return;
      stills.forEach(function (s) { s.classList.add('is-pre'); });
    }, 2500);
  });

  render(-1);
  start();

  window.tricomHero = {
    go: function (i) { byHand(i); },
    index: function () { return index; },
    state: function () { return { index: index, manual: manual, playing: !!timer, hover: hover, focus: focus }; },
    pause: function () { manual = true; stop(); }      // za probe i snimke ekrana
  };
})();
