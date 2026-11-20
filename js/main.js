/* ==========================================================================
   TRICOM — main.js
   Navigacija, skrol efekti, reveal, brojači, tabovi, akordeon,
   timeline, galerija sa lightboxom, validacija forme, nazad na vrh, kursor.
   ========================================================================== */
(function () {
  'use strict';
  // skripte se učitavaju posle prvog crtanja, pa „load“ može već da je prošao
  var onLoad = function (f) { if (document.readyState === 'complete') setTimeout(f, 0); else window.addEventListener('load', f); };

  /* Tekstovi za ispis su u js/i18n/sr.js (i en.js na engleskim stranama). */
  var L = window.L10N;
  var EN = !!L && L.lang() === 'en';
  function tr(key) { return L ? L.t(key) : key; }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  // skrol-rukovaoci koji čitaju raspored rade najviše jednom po frejmu (bez ponovljenog forsiranog rasporeda)
  function onScrollFrame(fn) {
    var q = false;
    window.addEventListener('scroll', function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; fn(); }); }, { passive: true });
  }

  /* ====================================================================
     1. Loader
     ==================================================================== */
  // Loadera preko cele strane više nema (prvo iscrtavanje ne čeka ništa); is-ready
  // ostaje kao znak „strana je spremna“ za zavesu između strana (motion.js).
  document.body.classList.add('is-ready');

  /* ====================================================================
     2. Header — skrivanje pri skrolu nadole, solid pozadina
     ==================================================================== */
  (function header() {
    var h = $('#header');
    if (!h) return;
    var last = 0, lock = false, menu = false;

    // Jedan kod za svih 9 strana: traka stoji providna preko prvog
    // fotografskog pojasa, ma koji od tri to bio — hero na pocetnoj,
    // .pagehead na podstranicama, .emptyhead na 404. Prag je donja ivica
    // tog pojasa, a ne tvrdo upisana visina hero sekcije.
    var band = document.querySelector('.hero, .pagehead, .emptyhead');

    // Donja ivica pojasa i visina trake se mere samo kad se promene (ResizeObserver),
    // ne pri svakom skrolu — čitanje rasporeda posle upisa klasa forsira raspored u svakom frejmu.
    var bandBottom = 0, hH = 0;
    function measure() {
      // Merimo iz rect-a, ne iz offsetTop-a: pojas ne mora da bude prvo
      // dete <body>-ja, a offsetParent zavisi od pozicioniranja predaka.
      bandBottom = band ? band.getBoundingClientRect().bottom + window.pageYOffset : 0;
      hH = h.offsetHeight;
    }
    measure();
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { measure(); paint(); });
      ro.observe(h);
      if (band) ro.observe(band);
    }
    onLoad(measure);

    function paint() {
      var y = window.pageYOffset;
      var over = false;
      if (band && !menu) over = y < bandBottom - hH - 4;
      // Otvoren mobilni meni je puna bela povrsina — traka mora uz njega.
      h.classList.toggle('is-over', over);
      h.classList.toggle('is-solid', !over);
    }

    function upd() {
      var y = window.pageYOffset;
      paint();
      if (!lock) {
        if (y > last && y > 260) h.classList.add('is-hidden');
        else h.classList.remove('is-hidden');
      }
      last = y;
      lock = false;
    }
    var queued = false;                                   // najviše jednom po frejmu
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; upd(); });
    }, { passive: true });
    window.addEventListener('resize', function () { measure(); upd(); });
    upd();

    // Kad je mobilni meni otvoren, header ostaje vidljiv
    document.addEventListener('tricom:menu', function (e) {
      lock = !!e.detail;
      menu = !!e.detail;
      if (lock) h.classList.remove('is-hidden');
      paint();
    });
  })();

  /* ====================================================================
     3. Scroll progress traka
     ==================================================================== */
  (function progress() {
    var bar = $('#progressBar');
    if (!bar) return;
    // širina se upisuje u sledećem frejmu, ne u samom događaju skrola (Firefox inače
    // javlja upozorenje „scroll-linked positioning effect“)
    var queued = false;
    function draw() {
      queued = false;
      var st = window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (st / max) * 100 : 0) + '%';
    }
    function upd() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    draw();
  })();

  /* ====================================================================
     4. Mobilni meni
     ==================================================================== */
  (function mobileNav() {
    var burger = $('#burger');
    var nav = $('#mobileNav');
    if (!burger || !nav) return;

    var open = false;

    function set(state) {
      open = state;
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      document.dispatchEvent(new CustomEvent('tricom:menu', { detail: open }));

      if (open) {
        $$('.mnav__link, .mnav__toggle', nav).forEach(function (n, i) {
          n.style.animationDelay = (60 + i * 42) + 'ms';
        });
      }
    }

    burger.addEventListener('click', function () { set(!open); });

    $$('.mnav__toggle', nav).forEach(function (t) {
      t.addEventListener('click', function () {
        var ex = t.getAttribute('aria-expanded') === 'true';
        $$('.mnav__toggle', nav).forEach(function (o) {
          if (o !== t) o.setAttribute('aria-expanded', 'false');
        });
        t.setAttribute('aria-expanded', ex ? 'false' : 'true');
      });
    });

    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { set(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (open && window.innerWidth >= 1440) set(false);   // od 1440 px je traka (css/layout.css)
    });
  })();

  /* ====================================================================
     4b. Podmeni glavne navigacije (Proizvodi, Usluge)
     Oznaka je veza ka strani; strelica posle nje je dugme sa aria-expanded.
     Hover otvara podmeni (CSS); klik ili Enter / Space na strelici ga
     otvara i zatvara; ↓ / ↑ na strelici otvara i fokusira prvu / poslednju
     stavku; u podmeniju ↑ ↓ Home End kruže, Esc zatvara i vraća fokus na
     strelicu. Klik van i odlazak fokusa zatvaraju.
     ==================================================================== */
  (function dropdowns() {
    var items = $$('.nav__item--has');
    if (!items.length) return;
    var links = function (it) { return $$('.dropdown a', it); };
    var btn = function (it) { return $('.nav__chev', it); };

    function set(it, open, focus) {
      it.classList.toggle('is-open', open);
      // zatvoren rukom dok je miš nad stavkom: hover ga ne sme ponovo otvoriti
      it.classList.toggle('is-shut', !open && it.matches(':hover'));
      btn(it).setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) items.forEach(function (o) { if (o !== it && o.classList.contains('is-open')) set(o, false); });
      if (open && focus) {
        var ls = links(it);
        if (ls.length) (focus === 'last' ? ls[ls.length - 1] : ls[0]).focus();
      }
    }

    items.forEach(function (it) {
      var b = btn(it);
      // stanje nosi klasa is-open (hover samo prikazuje): klik dok je podmeni otvoren hover-om ga zadržava
      b.addEventListener('click', function () { set(it, !it.classList.contains('is-open')); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); set(it, true, 'first'); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); set(it, true, 'last'); }
      });
      it.addEventListener('keydown', function (e) {
        var ls = links(it), i = ls.indexOf(document.activeElement);
        if (e.key === 'Escape') {
          if (it.classList.contains('is-open') || i >= 0) { e.preventDefault(); set(it, false); b.focus(); }
          return;
        }
        if (i < 0 || e.target === b) return;     // isti pritisak sa strelice je već obrađen
        var n = null;
        if (e.key === 'ArrowDown') n = (i + 1) % ls.length;
        else if (e.key === 'ArrowUp') n = (i - 1 + ls.length) % ls.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = ls.length - 1;
        if (n !== null) { e.preventDefault(); ls[n].focus(); }
      });
      it.addEventListener('mouseenter', function () {
        if (!it.classList.contains('is-shut')) b.setAttribute('aria-expanded', 'true');
      });
      it.addEventListener('mouseleave', function () {
        it.classList.remove('is-shut');
        if (!it.classList.contains('is-open')) b.setAttribute('aria-expanded', 'false');
      });
      it.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !it.contains(e.relatedTarget) && it.classList.contains('is-open')) set(it, false);
      });
    });
    document.addEventListener('click', function (e) {
      items.forEach(function (it) { if (!it.contains(e.target) && it.classList.contains('is-open')) set(it, false); });
    });
  })();

  /* ====================================================================
     5. Reveal na skrol
     ==================================================================== */
  (function reveal() {
    // .sectionix: linija do ivice se iscrtava pri prvom ulasku (pages.css)
    var items = $$('[data-reveal], .sectionix');
    if (!items.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    // grupno kašnjenje unutar istog roditelja
    var groups = {};
    items.forEach(function (n) {
      var key = n.getAttribute('data-reveal-group');
      if (!key) return;
      groups[key] = groups[key] || 0;
      n.style.setProperty('--rd', (groups[key] * 80) + 'ms');
      groups[key]++;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (n) { io.observe(n); });

    // Sigurnosni sloj: sve sto je vec u prvom ekranu otvaramo po geometriji,
    // ne cekajuci poziv posmatraca. Ako neko buduce pravilo ponovo sasece
    // element (clip-path, overflow), naslov prvog ekrana ostaje vidljiv.
    requestAnimationFrame(function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (n) {
        if (n.classList.contains('is-in')) return;
        var r = n.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) { n.classList.add('is-in'); io.unobserve(n); }
      });
    });
  })();

  /* ====================================================================
     6. Brojači

     Kotur cifara (odometar .odo/.odo__s, zamućenje koje se slegne, tačna
     vrednost najkasnije 1,2 s od starta) vodi js/motion.js (modul 8), sa
     istim okidačem (IntersectionObserver, prag 0,5) i istim formatom:
     srpski razdvojnik hiljada ovde, L.num na engleskim stranama.
     Ovde ostaje samo sigurnosni ispis: ako motion.js nije učitan, vrednosti
     se upišu po učitavanju strane („60“, „2.400“ / „2,400“, „32“, „14“).
     ==================================================================== */
  (function counters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;

    function fmt(v, dec) {
      if (EN) return L.num(v, dec, true);
      return v.toFixed(dec).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function fallback() {
      if (window.tricomMotion) return;
      nodes.forEach(function (n) {
        if (n.getAttribute('data-count-state')) return;
        n.textContent = fmt(parseFloat(n.getAttribute('data-count')), parseInt(n.getAttribute('data-dec') || '0', 10));
      });
    }
    if (document.readyState === 'complete') setTimeout(fallback, 0);
    else window.addEventListener('load', fallback);
  })();

  /* ====================================================================
     7. Tabovi
     ==================================================================== */
  (function tabs() {
    $$('[data-tabs]').forEach(function (root) {
      var btns = $$('[role="tab"]', root);
      var ink = $('.tabs__ink', root);
      if (!btns.length) { groupLinks(root, ink); return; }

      function moveInk(btn) {
        if (!ink) return;
        ink.style.width = btn.offsetWidth + 'px';
        ink.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
      }

      function select(btn) {
        btns.forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.setAttribute('tabindex', on ? '0' : '-1');
          var p = document.getElementById(b.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
        moveInk(btn);
        btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      }

      btns.forEach(function (b, i) {
        b.addEventListener('click', function () { select(b); });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var next = btns[(i + d + btns.length) % btns.length];
          next.focus(); select(next);
        });
      });

      /* Duboko povezivanje: strana.html#<data-hash> otvara odgovarajući tab. */
      function fromHash() {
        var h = (location.hash || '').replace('#', '');
        if (!h) return null;
        return btns.filter(function (b) { return b.getAttribute('data-hash') === h; })[0] || null;
      }

      var cur = fromHash()
        || btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]
        || btns[0];
      select(cur);

      window.addEventListener('hashchange', function () {
        var b = fromHash();
        if (!b) return;
        select(b);
        cur = b;
        root.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      });

      window.addEventListener('resize', function () { moveInk(cur); });
      setTimeout(function () { moveInk(cur); }, 240);
    });
  })();

  /* Prodajni program: grupe su veze na posebne adrese (proizvodi.html?grupa=krov,
     en/products.html?group=krov) — strana crta samo izabranu grupu, a nazad/napred
     je obična navigacija. Ovde samo: podvlaka ispod tekuće grupe i stari heš
     (#krov, #krov-tehnika) → adresa grupe, jednom, sa location.replace. */
  function groupLinks(root, ink) {
    var links = $$('.tabs__btn[data-hash]', root);
    if (!links.length) return;
    var cur = links.filter(function (a) { return a.getAttribute('aria-current') === 'page'; })[0] || null;
    var nav = $('.tabs__nav', root);
    function place() {
      if (!cur) return;
      if (ink) { ink.style.width = cur.offsetWidth + 'px'; ink.style.transform = 'translateX(' + cur.offsetLeft + 'px)'; }
      // traka se na uskim ekranima skroluje vodoravno: tekuća grupa u vidno polje (bez skrola strane)
      if (nav && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
    }
    function fromOldHash() {
      var h = decodeURIComponent((location.hash || '').slice(1));
      if (!h || h === 'prog' || h.indexOf('=') >= 0 || document.getElementById(h)) return false;   // #item=… je ploča proizvoda
      var hit = null, frag = 'prog';
      links.forEach(function (a) {
        var s = a.getAttribute('data-hash');
        if (h === s) hit = a;
        else if (!hit && h.indexOf(s + '-') === 0) { hit = a; frag = h; }
      });
      if (!hit) return false;
      location.replace(hit.getAttribute('href').split('#')[0] + '#' + frag);
      return true;
    }
    if (fromOldHash()) return;
    window.addEventListener('hashchange', fromOldHash);
    window.addEventListener('resize', place);
    place();
    setTimeout(place, 240);
  }

  /* ====================================================================
     8. Akordeon
     ==================================================================== */
  (function accordion() {
    $$('[data-acc]').forEach(function (root) {
      var single = root.getAttribute('data-acc') === 'single';
      $$('.acc__btn', root).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          if (single) {
            $$('.acc__btn', root).forEach(function (o) {
              if (o !== btn) o.setAttribute('aria-expanded', 'false');
            });
          }
          btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      });
    });
  })();

  /* ====================================================================
     9. Timeline — linija napretka vezana za skrol
     ==================================================================== */
  (function timeline() {
    var tl = $('#timeline');
    if (!tl) return;
    var rail = $('.timeline__rail i', tl);
    var items = $$('.tl-item', tl);

    // crta se u sledećem frejmu, ne u događaju skrola (v. traku napretka gore)
    var queued = false;
    function upd() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
    function draw() {
      queued = false;
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.62 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      if (rail) rail.style.height = (p * 100) + '%';

      items.forEach(function (it) {
        var ir = it.getBoundingClientRect();
        it.classList.toggle('is-in', ir.top < vh * 0.7);
      });
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    draw();
  })();

  /* ====================================================================
     10. Marquee — lista objekata (statična mreža)
     ==================================================================== */
  /* Lista objekata je sada mirna hairline mreža (bez neprekidnog kretanja
     van hero platna), pa se sadržaj više ne duplira. Modul ostaje kao
     mesto za buduću petlju: dovoljno je vratiti dupliranje ispod. */
  (function marquee() {
    $$('.marquee').forEach(function (m) { m.setAttribute('data-static', '1'); });
  })();

  /* ====================================================================
     11. Galerija + lightbox
     ==================================================================== */
  (function gallery() {
    var items = $$('[data-gitem]');
    var lb = $('#lightbox');
    if (!items.length || !lb) return;

    var stage = $('#lbStage');
    var cap = $('#lbCap');
    var idx = 0;

    /* UPGRADE 08 — mono traka sa podacima na dnu uvećanog prikaza
       „FIG. 07 / 28 · KROV I FASADA · ← → za listanje · ESC za zatvaranje“.
       Naziv kategorije se ne piše ponovo — čita se sa dugmeta filtera koje
       nosi isti data-filter, pa su galerija i lightbox uvek usklađeni.
       Isključivanje: obrisati blok ispod i .lightbox__meta pravila. */
    var CATS = {};
    $$('#galFilter [data-filter]').forEach(function (b) {
      CATS[b.getAttribute('data-filter')] = b.textContent.trim();
    });
    var meta = document.createElement('p');
    meta.className = 'lightbox__meta';
    meta.id = 'lbMeta';
    lb.appendChild(meta);

    function show(i) {
      idx = (i + items.length) % items.length;
      var src = items[idx];
      var inner = src.getAttribute('data-full') || src.innerHTML;
      stage.innerHTML = /^<svg|^<img/.test(inner.trim())
        ? inner
        : '<img src="' + inner + '" alt="">';
      // sličica galerije nosi webp po meri mreže; uvećanje prikazuje izvornik
      var big = stage.querySelector('img[data-orig]');
      if (big) { big.removeAttribute('srcset'); big.removeAttribute('sizes'); big.removeAttribute('loading'); big.src = big.getAttribute('data-orig'); }
      cap.textContent = src.getAttribute('data-cap') || '';

      var fig = src.getAttribute('data-fig') || String(idx + 1);
      var cat = CATS[src.getAttribute('data-gcat')] || '';
      meta.textContent = 'FIG. ' + fig + ' / ' + items.length
        + (cat ? ' · ' + cat.toUpperCase() : '')
        + tr('site.lb.keys');
    }

    function open(i) {
      show(i);
      lb.classList.add('is-open');
      lb.removeAttribute('aria-hidden');
      document.documentElement.style.overflow = 'hidden';
      var c = $('#lbClose'); if (c) c.focus();
    }
    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
    }

    items.forEach(function (it, i) {
      it.setAttribute('tabindex', '0');
      it.setAttribute('role', 'button');
      it.addEventListener('click', function () { open(i); });
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    var cb = $('#lbClose'); if (cb) cb.addEventListener('click', close);
    var pb = $('#lbPrev');  if (pb) pb.addEventListener('click', function () { show(idx - 1); });
    var nb = $('#lbNext');  if (nb) nb.addEventListener('click', function () { show(idx + 1); });

    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  /* ====================================================================
     12. Filter galerije
     ==================================================================== */
  (function galleryFilter() {
    var bar = $('#galFilter');
    if (!bar) return;
    var btns = $$('button', bar);
    var items = $$('[data-gcat]');

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-filter');
        btns.forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
        items.forEach(function (it) {
          var on = cat === 'all' || it.getAttribute('data-gcat') === cat;
          it.style.display = on ? '' : 'none';
        });
        var ink = $('.tabs__ink', bar);
        if (ink) {
          ink.style.width = b.offsetWidth + 'px';
          ink.style.transform = 'translateX(' + b.offsetLeft + 'px)';
        }
      });
    });
  })();

  /* ====================================================================
     13. Nazad na vrh + prsten napretka
     ==================================================================== */
  (function toTop() {
    var btn = $('#toTop');
    if (!btn) return;
    var ring = $('.totop__ring .fg', btn);
    var pct = $('#toTopPct', btn);
    var circ = 0;

    if (ring) {
      var r = parseFloat(ring.getAttribute('r')) || 27;
      circ = 2 * Math.PI * r;
      ring.style.setProperty('--circ', circ);
      ring.style.strokeDasharray = circ;
    }

    function upd() {
      var st = window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, st / max) : 0;
      btn.classList.toggle('is-visible', st > 420);
      if (ring) ring.style.strokeDashoffset = circ * (1 - p);
      if (pct) pct.textContent = Math.round(p * 100) + '%';
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    onScrollFrame(upd);
    window.addEventListener('resize', upd);
    upd();
  })();

  /* ====================================================================
     14. Custom kursor
     ==================================================================== */
  (function cursor() {
    if (reduce) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1060px)').matches) return;

    var ring = document.createElement('div');
    ring.className = 'cursor';
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    // Nišan se vidi SAMO nad interaktivnim elementom (veza, dugme, polje,
    // pločica galerije). Nad naslovom, fotografijom ili praznom površinom
    // nema nikakvog dodatnog kursora — stari „‹ ›“ natpis nad hero-om je
    // ostajao da visi u kadru kao artefakt. Vidljivost nosi klasa stanja.
    var awake = false;

    // prsten sustiže tačku; kad je stigne petlja staje (bez crtanja dok miš miruje)
    var looping = false;
    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2) requestAnimationFrame(loop);
      else looping = false;
    }
    function kick() { if (!looping) { looping = true; requestAnimationFrame(loop); } }

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!awake) { awake = true; rx = mx; ry = my; }
      kick();
    }, { passive: true });
    kick();

    /* ------------------------------------------------------------------
       UPGRADE 06 — stanja i natpisi nišana (samo nad interaktivnim)

         .is-zoom   pločica galerije (postoji lightbox)  -> „UVEĆAJ“
         .is-hot    veza, dugme, polje                    -> prsten se skupi
                                                             i postane pun
       Bez stanja nišan je providan (opacity 0 u layout.css). Na dodirnim
       uređajima i pod prefers-reduced-motion nišana uopšte nema.
       Isključivanje: obrisati ovaj blok i .cursor__lbl / .cursor.is-* pravila.
       ------------------------------------------------------------------ */
    var lbl = document.createElement('span');
    lbl.className = 'cursor__lbl';
    lbl.setAttribute('aria-hidden', 'true');
    ring.appendChild(lbl);

    var STATES = ['is-zoom', 'is-hot'];
    var hot = 'a, button, [role="button"], .gitem, input, textarea, select, summary, label';

    function setState(cls, text) {
      STATES.forEach(function (c) { ring.classList.toggle(c, c === cls); });
      dot.classList.toggle('is-on', !!cls);
      lbl.textContent = text || '';
    }

    function resolve(el) {
      if (!awake || !el || !el.closest) return setState(null, '');
      var g = el.closest('[data-gitem]');
      if (g && document.getElementById('lightbox')) return setState('is-zoom', tr('site.cursor.zoom'));
      if (el.closest(hot)) return setState('is-hot', '');
      setState(null, '');
    }

    document.addEventListener('mouseover', function (e) { resolve(e.target); });
    document.addEventListener('mouseleave', function () { setState(null, ''); });
  })();

  /* ====================================================================
     15–17. Magnetna dugmad, paralaksa [data-parallax] i nagib kartica
     žive u js/motion.js („Forged Glass“ sistem pokreta).
     ==================================================================== */

  /* ====================================================================
     18. TOC — aktivna sekcija
     ==================================================================== */
  (function toc() {
    var nav = $('#tocnav');
    if (!nav) return;
    var links = $$('a', nav);
    var targets = links.map(function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);
    if (!targets.length) return;

    function upd() {
      var y = window.pageYOffset + window.innerHeight * 0.3;
      var cur = 0;
      targets.forEach(function (t, i) {
        if (t.offsetTop <= y) cur = i;
      });
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === cur); });
    }
    onScrollFrame(upd);
    upd();
  })();

  /* ====================================================================
     19. Validacija i obrada forme
     ==================================================================== */
  (function forms() {
    $$('form[data-validate]').forEach(function (f) {
      var msg = $('.form-msg', f.parentNode) || $('.form-msg', f);

      function fieldOf(input) { return input.closest('.field'); }

      function validate(input) {
        var wrap = fieldOf(input);
        if (!wrap) return true;
        var err = $('.field__err', wrap);
        var val = (input.value || '').trim();
        var ok = true, text = '';

        if (input.hasAttribute('required') && !val) {
          ok = false; text = tr('site.form.required');
        } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(val)) {
          ok = false; text = tr('site.form.email');
        } else if (input.type === 'tel' && val && val.replace(/[^0-9]/g, '').length < 6) {
          ok = false; text = tr('site.form.tel');
        } else if (input.tagName === 'TEXTAREA' && input.hasAttribute('required') && val.length < 10) {
          ok = false; text = tr('site.form.short');
        }

        wrap.classList.toggle('has-error', !ok);
        if (err) err.textContent = text;
        return ok;
      }

      /* upit sa stavkama kalkulatora (skriveno polje „konfiguracija“ sa calc:…) šalje se sa servera, sa PDF
         specifikacijom — dugme i napomena to kažu; obična forma ostaje „Pripremi upit“ (mailto) */
      var cfgEl = f.querySelector('[name="konfiguracija"]');
      function isQuote() { return !!(cfgEl && f.hasAttribute('data-inquiry') && window.fetch && /(^|\n)\s*calc:(tr10|tr20|tr35|tr40|crep)\b/.test(cfgEl.value)); }
      function newKey() {
        var a = new Uint8Array(16), s = '';
        try { window.crypto.getRandomValues(a); } catch (x) { for (var k = 0; k < 16; k++) a[k] = Math.floor(Math.random() * 256); }
        for (var j = 0; j < 16; j++) s += ('0' + a[j].toString(16)).slice(-2);
        return s;
      }
      if (isQuote()) {
        var sb = f.querySelector('button[type="submit"]'), fn = f.querySelector('.form-note');
        if (sb && sb.firstChild && sb.firstChild.nodeType === 3) sb.firstChild.nodeValue = tr('site.form.sendQuote') + ' ';
        if (fn) fn.textContent = tr('site.form.noteQuote');
      }

      $$('input, select, textarea', f).forEach(function (i) {
        i.addEventListener('blur', function () { validate(i); });
        i.addEventListener('input', function () {
          var w = fieldOf(i);
          if (w && w.classList.contains('has-error')) validate(i);
        });
      });

      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var inputs = $$('input, select, textarea', f);
        var ok = true, first = null;
        inputs.forEach(function (i) {
          if (!validate(i) && ok) { ok = false; first = i; }
        });
        if (!ok) {
          if (first) first.focus();
          if (msg) {
            msg.innerHTML = tr('site.form.fix');
            msg.classList.add('is-visible');
          }
          return;
        }

        // Statični sajt: sastavljamo mailto sa popunjenim podacima.
        // Na engleskoj strani padajuća lista šalje prikazani (engleski) tekst opcije.
        var get = function (n) {
          var x = f.querySelector('[name="' + n + '"]');
          if (!x) return '';
          if (EN && x.tagName === 'SELECT' && x.selectedIndex >= 0 && x.value) return x.options[x.selectedIndex].text.trim();
          return x.value.trim();
        };
        var lines = [
          tr('site.form.mail.name') + get('ime'),
          tr('site.form.mail.email') + get('email'),
          tr('site.form.mail.tel') + get('telefon'),
          tr('site.form.mail.topic') + get('tema'),
          '',
          tr('site.form.mail.msg'),
          get('poruka'),
          '',
          tr('site.form.mail.sig')
        ];
        /* adresa iz administracije (<form data-mailto>), inače dosadašnja */
        var to = /^[^\s@<>"]+@[^\s@<>"]+$/.test(f.getAttribute('data-mailto') || '') ? f.getAttribute('data-mailto') : 'office@tricom.rs';
        // ref = broj upita zabeleženog na sajtu (ili null): ide u naslov i telo poruke, da prodaja upari e-poruku sa upitom
        var openMail = function (ref) {
          var body = lines.slice();
          if (ref) body.splice(4, 0, tr('site.form.mail.ref') + ref);
          var href = 'mailto:' + to
            + '?subject=' + encodeURIComponent(tr('site.form.mail.subject') + (get('tema') || tr('site.form.mail.general')) + (ref ? ' [' + ref + ']' : ''))
            + '&body=' + encodeURIComponent(body.join('\n'));
          if (msg) {
            msg.innerHTML = ref ? tr('site.form.saved').replace('{ref}', ref) : tr('site.form.done');
            msg.classList.add('is-visible');
            msg.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
          }
          window.location.href = href;
        };

        var show = function (html) {
          if (!msg) return;
          msg.innerHTML = html;
          msg.classList.add('is-visible');
          msg.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        };
        /* upit iz kalkulatora nije poslat: broj (ako je sačuvan), „Pokušaj ponovo“ (isti ključ — bez duplikata)
           i „Pošalji iz programa za e-poštu“ (dosadašnji način, sa istim brojem) */
        var failBox = function (ref, busy) {
          var t = busy ? tr('site.form.busy') : (ref ? tr('site.form.failed').replace('{ref}', ref) : tr('site.form.failedNoRef'));
          show('<p>' + t + '</p><p class="form-msg__acts"><button type="button" class="btn btn--sm" data-form-retry>' + tr('site.form.retry')
            + '</button> <button type="button" class="btn btn--sm btn--ghost" data-form-mail>' + tr('site.form.viaMail') + '</button></p>');
          var rb = msg && msg.querySelector('[data-form-retry]'), mb = msg && msg.querySelector('[data-form-mail]');
          if (rb) rb.addEventListener('click', function () { if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event('submit', { cancelable: true })); });
          if (mb) mb.addEventListener('click', function () { openMail(ref); });
        };

        /* Upit se prvo beleži na sajtu (<form data-inquiry> → upit.php; odgovor je samo broj upita, nikad cena).
           - obična forma: zatim mailto (next = 'mailto'); bez odgovora za 3 s (dok traje dozvola pregledača za
             otvaranje e-pošte posle klika) ili uz grešku, e-poruka se priprema kao i ranije, bez broja;
           - upit sa stavkama kalkulatora (calc:…): server šalje PDF specifikaciju prodaji; uspeh se javlja tek
             posle potvrde servera (next = 'done'). Ključ slanja ostaje isti za ponovne pokušaje iste forme. */
        var ep = f.getAttribute('data-inquiry');
        if (!ep || !window.fetch || !window.FormData) { openMail(null); return; }
        if (f.getAttribute('aria-busy') === 'true') return;
        var quote = isQuote();
        if (!f._tricomKey) f._tricomKey = newKey();
        f.setAttribute('aria-busy', 'true');
        var fd = new FormData(f);
        fd.append('jezik', EN ? 'en' : 'sr');
        fd.append('kljuc', f._tricomKey);
        if (quote) show(tr('site.form.sending'));
        var finished = false;
        var finish = function (j) {
          if (finished) return;
          finished = true;
          f.removeAttribute('aria-busy');
          var ref = j && /^U-\d{8}-[A-Z0-9]{4}$/.test(j.ref || '') ? j.ref : null;
          if (j && j.next === 'done' && ref) { show(tr('site.form.sent').replace('{ref}', ref)); return; }
          if (j && j.next === 'retry' && ref) { failBox(ref, j.error === 'busy'); return; }
          if (j && j.ok && j.next === 'mailto') { openMail(ref); return; }
          // upit iz kalkulatora bez jasnog odgovora (mreža, isteklo vreme, greška servera): ishod nije poznat —
          // ponovni pokušaj je bezbedan (isti ključ); odbijen unos / ograničenje / bez zakrpe → e-pošta kao ranije
          if (quote && (!j || !j.error)) { failBox(ref, false); return; }
          openMail(null);
        };
        setTimeout(function () { finish(null); }, quote ? 45000 : 3000);
        fetch(ep, { method: 'POST', body: fd, credentials: 'same-origin', headers: { 'X-Tricom-Upit': '1' } })
          .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
          .then(function (j) { finish(j); }, function () { finish(null); });
      });
    });
  })();

  /* ====================================================================
     20. Kopiranje podataka na klik
     ==================================================================== */
  (function copyables() {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var txt = b.getAttribute('data-copy');
        var done = function () {
          var old = b.getAttribute('data-label') || b.textContent;
          b.setAttribute('data-label', old);
          b.textContent = tr('site.copied');
          setTimeout(function () { b.textContent = old; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(done, function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = txt; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  })();

  /* ====================================================================
     21. Godina u futeru
     ==================================================================== */
  (function year() {
    $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  })();

  /* ====================================================================
     22. Mapa na klik: do klika stoji ilustracija sa dugmetom „Prikaži mapu“ i vezom ka
         Google mapama (fasada u HTML-u) — nijedan zahtev ka Google-u pre klika
     ==================================================================== */
  (function mapOnClick() {
    $$('[data-map]').forEach(function (h) {
      var b = h.querySelector('[data-map-load]');
      if (!b) return;
      b.addEventListener('click', function () {
        if (h.getAttribute('data-loaded')) return;
        var f = document.createElement('iframe');
        f.src = h.getAttribute('data-map');
        f.title = h.getAttribute('data-map-title') || 'Mapa lokacije';
        f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        f.setAttribute('allowfullscreen', '');
        h.appendChild(f);
        h.setAttribute('data-loaded', '1');
        f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true });
      });
    });
  })();

  /* ====================================================================
     23. Dugmad "pitaj asistenta"
     ==================================================================== */
  (function askButtons() {
    $$('[data-ask]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.tricomAsk) window.tricomAsk(b.getAttribute('data-ask'));
      });
    });
  })();

  /* ====================================================================
     24. inert prati aria-hidden na preklopnim panelima

     Asistent i lightbox se zatvaraju sa aria-hidden="true", ali unutra
     ostaju dugmad i polja koja bi tastatura mogla da dohvati. CSS ih već
     sklanja (visibility: hidden); ovo dodaje i inert, pa je stanje tačno
     i kada stil nije primenjen. Panele u markupu inicijalno nose inert.
     ==================================================================== */
  (function inertPanels() {
    var panels = $$('#aiPanel, #lightbox');
    if (!panels.length) return;
    if (!('inert' in HTMLElement.prototype) || typeof MutationObserver !== 'function') {
      panels.forEach(function (p) { p.removeAttribute('inert'); });
      return;
    }
    panels.forEach(function (p) {
      function sync() { p.inert = p.getAttribute('aria-hidden') === 'true'; }
      new MutationObserver(sync).observe(p, {
        attributes: true, attributeFilter: ['aria-hidden']
      });
      sync();
    });
  })();

  /* ====================================================================
     25. Živi status „Otvoreno / Zatvoreno“

     Raspored je iz administracije (Kontakt → Radno vreme): PHP ga upisuje u
     <span id="fhours" data-week="7-16,7-16,7-16,7-16,7-16,7-14,-"> —
     ponedeljak…nedelja, „otvara-zatvara“ u celim satima ili „-“ (ne radi).
     Vreme se uvek računa po Europe/Belgrade (sa letnjim računanjem
     vremena), bez obzira na vremensku zonu posetioca. Otvaranje je
     uključeno, zatvaranje nije (do 16 = otvoreno do 15:59).
     Proračun je izdvojen u window.tricomHours(date) da bi mogao da se
     proveri za bilo koji trenutak bez diranja sistemskog sata.

     Status živi u redu „RADNO VREME“ datasheet tabele u futeru. Bez JS-a
     element ostaje prazan i CSS ga ne prikazuje (:not(:empty)) — u redu
     ostaje tekst rasporeda.
     Isključivanje: obrisati ovaj modul i .fhours pravila u layout.css.
     ==================================================================== */
  var hb = document.getElementById('fhours');
  /* WEEK[0] = nedelja … WEEK[6] = subota (kao Date.getDay); [otvara, zatvara] ili null */
  var WEEK = (function () {
    var w = [null, null, null, null, null, null, null];
    var raw = hb ? (hb.getAttribute('data-week') || '').split(',') : [];
    if (raw.length === 7) {
      raw.forEach(function (x, i) {
        var m = /^(\d{1,2})-(\d{1,2})$/.exec(x);
        if (m && +m[2] > +m[1] && +m[2] <= 24) w[(i + 1) % 7] = [+m[1], +m[2]];
      });
      return w;
    }
    /* stari oblik (samo radni dani): data-open / data-close */
    var o = hb ? parseInt(hb.getAttribute('data-open'), 10) : NaN;
    var c = hb ? parseInt(hb.getAttribute('data-close'), 10) : NaN;
    if (o >= 0 && c > o && c <= 24) for (var d = 1; d <= 5; d++) w[d] = [o, c];
    return w;
  })();

  /* Dan u nedelji i minut u danu po beogradskom vremenu */
  var BG_FMT = null;
  try {
    BG_FMT = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Belgrade', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
  } catch (e) { BG_FMT = null; }
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  function belgrade(d) {
    if (BG_FMT && BG_FMT.formatToParts) {
      var p = {};
      BG_FMT.formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
      var h = parseInt(p.hour, 10) % 24, mi = parseInt(p.minute, 10);
      if (p.weekday in WD && h >= 0 && mi >= 0) return { day: WD[p.weekday], mins: h * 60 + mi };
    }
    /* rezerva bez Intl vremenskih zona: CET (UTC+1), a CEST (UTC+2) od poslednje
       nedelje marta 01:00 UTC do poslednje nedelje oktobra 01:00 UTC (pravilo EU) */
    var y = d.getUTCFullYear();
    var lastSun = function (m) {
      var t = new Date(Date.UTC(y, m + 1, 0, 1));
      t.setUTCDate(t.getUTCDate() - t.getUTCDay());
      return t.getTime();
    };
    var ms = d.getTime(), off = ms >= lastSun(2) && ms < lastSun(9) ? 2 : 1;
    var b = new Date(ms + off * 3600000);
    return { day: b.getUTCDay(), mins: b.getUTCHours() * 60 + b.getUTCMinutes() };
  }

  function hh(h) { return (h < 10 ? '0' : '') + h + ':00'; }

  window.tricomHours = function (d) {
    var now = belgrade(d || new Date());
    var t = WEEK[now.day];
    var open = !!t && now.mins >= t[0] * 60 && now.mins < t[1] * 60;
    var text;
    if (open) {
      text = tr('site.hours.open').replace('{t}', hh(t[1]));
    } else {
      /* sledeće otvaranje: danas kasnije ili prvi radni dan posle */
      var at = null;
      if (t && now.mins < t[0] * 60) at = hh(t[0]);
      else {
        var days = tr('site.hours.days').split(',');
        for (var i = 1; i <= 7 && !at; i++) {
          var n = WEEK[(now.day + i) % 7];
          if (n) at = (days.length === 7 ? days[(now.day + i) % 7] + ' ' : '') + hh(n[0]);
        }
      }
      text = at ? tr('site.hours.closed').replace('{t}', at) : tr('site.hours.closed').split(' · ')[0];
    }
    return { open: open, text: text };
  };

  (function openHours() {
    var box = $('#fhours');
    /* bez rasporeda (nijedan dan ne radi ili nema podataka) oznaka se ne prikazuje */
    if (!box || !WEEK.some(function (x) { return x; })) return;

    function render() {
      var s = window.tricomHours();
      box.classList.toggle('is-open', s.open);
      box.innerHTML = '<span class="fhours__dot" aria-hidden="true"></span><span>' + s.text + '</span>';
    }
    render();
    // Osvezavanje na minut — status ne sme da laze ako je stranica otvorena
    // preko granice radnog vremena.
    setInterval(render, 60000);
  })();

  /* ====================================================================
     26. UPGRADE 10 — veza između koraka procesa se puni pri skrolu

     Ista tehnika kao kod sine u istorijatu (modul 9): udeo pređenog dela
     ide u --pfill, a svaki pređeni korak dobija .is-past. Pod
     prefers-reduced-motion CSS već drži liniju punom, pa modul ne radi.
     ==================================================================== */
  (function processLine() {
    var blocks = $$('.process');
    if (!blocks.length || reduce) return;

    function upd() {
      var vh = window.innerHeight;
      blocks.forEach(function (b) {
        var r = b.getBoundingClientRect();
        var p = (vh * 0.68 - r.top) / Math.max(1, r.height);
        p = Math.max(0, Math.min(1, p));
        b.style.setProperty('--pfill', (p * 100) + '%');

        $$('.step', b).forEach(function (s) {
          var sr = s.getBoundingClientRect();
          s.classList.toggle('is-past', sr.top < vh * 0.7);
        });
      });
    }
    onScrollFrame(upd);
    window.addEventListener('resize', upd);
    upd();
  })();

  /* ====================================================================
     27. UPGRADE 09 — brojač znakova u polju za poruku
     Element nosi data-count-for="<name polja>"; ako polje ima maxlength,
     brojač je „124 / 2000“, inače samo broj unetih znakova.
     ==================================================================== */
  (function charCount() {
    $$('[data-count-for]').forEach(function (out) {
      var f = out.closest('form') || document;
      var input = f.querySelector('[name="' + out.getAttribute('data-count-for') + '"]');
      if (!input) return;
      var max = parseInt(input.getAttribute('maxlength') || '0', 10);

      function upd() {
        var n = (input.value || '').length;
        out.textContent = max ? (n + ' / ' + max) : String(n);
        out.classList.toggle('is-near', !!max && n > max * 0.9);
      }
      input.addEventListener('input', upd);
      upd();
    });
  })();

  /* ====================================================================
     28. UPGRADE 01 — isticanje mera u naslovima

     Svaka vrednost sa jedinicom u h1–h3 i .lead („30 mm“, „2,5 × 8 m“,
     „2400 m²“, „32 t“, „48 dana“, godine tipa „1966.“) dobija omotač
     <span class="num">: IBM Plex Mono, tabularne cifre, brend plava,
     0.92em i tanka podvlaka. Cisto prezentaciono — tekst se ne menja, samo
     se deli na cvorove, pa textContent ostaje bajt u bajt isti.

     Preskacemo ono sto je vec u .num, <code> i panel asistenta.
     Iskljucivanje: obrisati ovaj modul i .num pravila u components.css.
     ==================================================================== */
  (function numHighlight() {
    // Broj je ILI grupisan tackama (2.400) ILI prost niz cifara (2400) — bez
    // druge grane „2400“ bi se poklopilo tek od „400“, jer \d{1,3} staje na
    // tri cifre. Pogled unazad sprecava da match pocne usred broja.
    var NUM = EN ? '(?<![\\d.,])(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?'
                 : '(?<![\\d.,])(?:\\d{1,3}(?:\\.\\d{3})+|\\d+)(?:,\\d+)?';
    // Duze jedinice idu pre kracih: „mm“ pre „m“, „m²“ pre „m“, „dana“ pre „dan“.
    var UNIT = EN ? '(?:mm|cm|m²|m2|kg|pcs|t|m|%|°C|°|days|day|years|year|months|month|weeks|week|hours|hour)'
                  : '(?:mm|cm|m²|m2|kg|kom|t|m|%|°C|°|dana|dan|godina|godine|godinu|'
             + 'meseci|meseca|nedelja|nedelje|sati|sata)';
    var RX = new RegExp(
      '(' + NUM + '(?:\\s*[×x]\\s*' + NUM + ')*\\s*' + UNIT + '(?![\\p{L}\\d])'
      + '|(?<![\\d.,])(?:18|19|20)\\d{2}\\.'
      + ')', 'gu');

    var SKIP = 'code, kbd, pre, .num, #aiPanel, .ai-panel, script, style';
    var ROOTS = 'h1, h2, h3, .lead';

    $$(ROOTS).forEach(function (root) {
      if (root.closest(SKIP)) return;
      var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      var nodes = [], t;
      while ((t = walk.nextNode())) {
        if (t.parentElement && t.parentElement.closest(SKIP)) continue;
        if (RX.test(t.nodeValue)) nodes.push(t);
        RX.lastIndex = 0;
      }
      nodes.forEach(function (node) {
        var s = node.nodeValue, out = document.createDocumentFragment();
        var pos = 0, m;
        RX.lastIndex = 0;
        while ((m = RX.exec(s))) {
          if (m.index > pos) out.appendChild(document.createTextNode(s.slice(pos, m.index)));
          var sp = document.createElement('span');
          sp.className = 'num';
          sp.textContent = m[0];
          out.appendChild(sp);
          pos = m.index + m[0].length;
        }
        if (pos < s.length) out.appendChild(document.createTextNode(s.slice(pos)));
        node.parentNode.replaceChild(out, node);
      });
    });
  })();

  /* ====================================================================
     29. UPGRADE 03 — bočna šina sa pregledom sekcija (desktop ≥ 1200 px)

     Jedna crtica po sekciji prvog nivoa u <main>; aktivna je brend plava i
     duža. Prelaz mišem pokazuje mono natpis levo od crtice (data-rail-label,
     pa aria-label, pa prvi naslov), klik skroluje na sekciju.

     Šina se gasi dok je hero na ekranu — tu bi se sudarila sa strelicama
     slajdera i sa oznakom „skrolujte“, koje takođe stoje uz desnu ivicu.
     Visina je ograničena na 62vh i centrirana, pa ne dolazi do dugmeta
     „nazad na vrh“ u donjem uglu.

     Ispod 1200 px i pod prefers-reduced-motion šina nije vidljiva, ali
     OSTAJE u redosledu tastature: fokus je otkriva (isto ponašanje kao
     .skip-link), pa je pregled sekcija dostupan i bez miša.
     Isključivanje: obrisati ovaj modul i .rail pravila u pages.css.
     ==================================================================== */
  (function sectionRail() {
    var main = $('#main');
    if (!main) return;
    var secs = Array.prototype.filter.call(main.children, function (e) {
      return e.tagName === 'SECTION';
    });
    if (secs.length < 2) return;

    function labelOf(s, i) {
      var t = s.getAttribute('data-rail-label')
           || s.getAttribute('aria-label')
           || (s.querySelector('h2') || s.querySelector('h1') || s.querySelector('h3') || {}).textContent
           || (tr('site.rail.section') + (i + 1));
      return t.replace(/\s+/g, ' ').trim().slice(0, 44);
    }

    var nav = document.createElement('nav');
    nav.className = 'rail';
    nav.id = 'rail';
    nav.setAttribute('aria-label', tr('site.rail.label'));
    var ol = document.createElement('ol');
    nav.appendChild(ol);

    var ticks = secs.map(function (s, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail__t';
      var span = document.createElement('span');
      span.className = 'rail__lbl';
      span.textContent = (i + 1 < 10 ? '0' : '') + (i + 1) + '  ' + labelOf(s, i);
      b.appendChild(span);
      b.addEventListener('click', function () {
        s.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      });
      li.appendChild(b);
      ol.appendChild(li);
      return b;
    });
    document.body.appendChild(nav);

    var band = $('.hero');   // šina se ne pojavljuje dok traje hero

    function upd() {
      var y = window.pageYOffset;
      var vh = window.innerHeight;
      if (band) {
        var over = band.getBoundingClientRect().bottom > vh * 0.35;
        nav.classList.toggle('is-off', over);
      }
      var cur = 0;
      secs.forEach(function (s, i) {
        if (s.getBoundingClientRect().top + y <= y + vh * 0.34) cur = i;
      });
      ticks.forEach(function (b, i) {
        var on = i === cur;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-current', on ? 'true' : 'false');
      });
    }
    onScrollFrame(upd);
    window.addEventListener('resize', upd);
    upd();
  })();


  /* ====================================================================
     UPIT IZ 3D KONFIGURATORA
     konfigurator.html otvara kontakt.html?konfig=<tekst>#upit; ovde se taj
     tekst upisuje u polje poruke. Parametar se zatim sklanja iz adrese da
     se pri osvežavanju strane poruka ne bi ponovo prepisala.
     ==================================================================== */
  (function konfigUpit() {
    var ta = document.getElementById('f-poruka');
    if (!ta || !window.URLSearchParams) return;
    var q = new URLSearchParams(location.search), txt = q.get('konfig');
    if (!txt) return;
    ta.value = txt.slice(0, ta.maxLength > 0 ? ta.maxLength : 2000);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    // interna napomena za proizvodnju (stavke kalkulatora) ide u skriveno polje — kupac je ne vidi;
    // reference stavki (konfiguracija) upisuje skripta na samoj strani kontakta
    var pn = document.getElementById('f-proizvodnja');
    if (pn) pn.value = q.get('pn') || '';
    // upit iz modala (bez stavki konfiguratora/kalkulatora) ne sme da ostane na prvoj temi
    // liste („Sečenje na CNC plazmi“) — tema je opšta; sa stavkama je postavlja skripta strane
    var tema = document.getElementById('f-tema');
    if (tema && !q.get('konfiguracija') && tema.querySelector('option[value="opšte"]')) tema.value = 'opšte';
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* file:// */ }
  })();

  /* ====================================================================
     23. Tabele (.spec-wrap): nagoveštaj horizontalnog pomeranja — dok ima
     još kolona udesno, omotač nosi data-more="1" (CSS bledi desnu ivicu).
     ==================================================================== */
  (function specScrollHint() {
    function outer(w) {
      var s = w.parentNode;
      if (s && s.classList && s.classList.contains('spec-scroll')) return s;
      s = document.createElement('div'); s.className = 'spec-scroll';
      w.parentNode.insertBefore(s, w); s.appendChild(w);
      return s;
    }
    function upd(w) {
      var s = outer(w), more = w.scrollWidth - w.clientWidth - w.scrollLeft > 2;
      if (more) s.setAttribute('data-more', '1'); else s.removeAttribute('data-more');
      // tabela veća od okvira (širina ili visina): oblast mora da se pomera i tastaturom (fokus + ime iz natpisa tabele)
      if (w.scrollWidth - w.clientWidth > 2 || w.scrollHeight - w.clientHeight > 2) {
        if (!w.hasAttribute('tabindex')) {
          var cap = w.querySelector('caption');
          w.setAttribute('tabindex', '0'); w.setAttribute('role', 'region');
          w.setAttribute('aria-label', cap ? cap.textContent.trim() : tr('site.table.scroll'));
        }
      } else if (w.getAttribute('role') === 'region') { w.removeAttribute('tabindex'); w.removeAttribute('role'); w.removeAttribute('aria-label'); }
    }
    function all() { $$('.spec-wrap').forEach(upd); }
    document.addEventListener('scroll', function (e) {
      var w = e.target && e.target.closest ? e.target.closest('.spec-wrap') : null;
      if (w) upd(w);
    }, true);
    document.addEventListener('click', function () { setTimeout(all, 450); });
    window.addEventListener('resize', all);
    onLoad(all);
    all(); setTimeout(all, 400);
  })();

})();
