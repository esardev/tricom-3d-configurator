/* ==========================================================================
   TRICOM — modal.js
   Kartice → modal. Svaki element sa data-item="<slug>" (kartica proizvoda,
   usluge, mogućnosti, reference, pločica galerije) otvara staklenu ploču sa
   podacima iz js/items.js (window.TRICOM_ITEMS).

   - klik bilo gde na kartici (osim na unutrašnjoj vezi / dugmetu), Enter ili
     razmak; kartica dobija role="button", tabindex="0", aria-haspopup="dialog"
   - zatvaranje: ×, Esc, klik na podlogu; fokus ostaje zarobljen u ploči i
     vraća se na karticu; strana ispod se ne pomera (overflow: hidden)
   - heš #item=<slug> otvara ploču pri učitavanju; dok je ploča otvorena heš
     ga nosi (replaceState, bez novih koraka u istoriji), posle se vraća stari
   - ispod 640 px ploča je list preko celog ekrana (css/modal.css)
   - proizvod / usluga / mogućnost: render, naslov, oznake, sažetak, podaci i
     dugmad „Detaljnije →“ (strana detalja), „Izračunaj“ (samo ako postoji
     kalkulator → kalkulatori.html#<id>), „Pošalji upit“ (kontakt.html#upit,
     isti ?konfig= ugovor kao 3D konfigurator — main.js upisuje tekst u poruku)
   - referenca / galerija: prikaz kao lightbox (slika, natpis, meta traka) sa
     listanjem ← → kroz vidljive kartice iste vrste na strani
   Tekstovi dugmadi: js/i18n (ključevi item.*). Bez zavisnosti.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.TRICOM_ITEMS, L = window.L10N, doc = document, root = doc.documentElement;
  if (!D) return;
  var EN = (root.getAttribute('lang') || 'sr').slice(0, 2) === 'en';
  var t = function (k, v) { return L ? L.t(k, v) : k; };
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var SITE = 'https://tricom.rs/';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function siteRoot() { return L ? L.root : (EN ? '../' : ''); }
  function pageHref(f) { return L ? L.page(f) : f; }
  function txt(it) { return (EN ? it.en : it.sr) || it.sr || {}; }

  /* putanje — relativno od tekuće strane */
  function detailHref(it) {
    if (it.page) return pageHref(it.page);
    if (!D.hasPage(it)) return null;
    return siteRoot() + (EN ? 'en/details/' : 'detalji/') + it.slug + '.html';
  }
  function detailUrl(it) {
    if (D.hasPage(it)) return SITE + (EN ? 'en/details/' : 'detalji/') + it.slug + '.html';
    // bez strane detalja: tekuća strana po kanonskoj adresi (radi i u detalji/ i en/details/)
    var c = document.querySelector('link[rel="canonical"]');
    return (c ? c.href.split('#')[0] : SITE + (EN ? 'en/' : '') + location.pathname.split('/').pop()) + '#item=' + it.slug;
  }
  function calcHref(it) { return it.calc ? pageHref('kalkulatori.html') + '#' + it.calc : null; }
  function inquiryHref(it) {
    var x = txt(it), msg = t('item.inq', { t: x.t, u: detailUrl(it) });
    return pageHref('kontakt.html') + '?konfig=' + encodeURIComponent(msg) + '#upit';
  }

  /* slika: render (par svetla / tamna), fotografija ili ilustracija */
  function media(it, big) {
    var r = siteRoot(), x = txt(it), alt = esc(x.alt || x.t);
    if (it.img) {
      var s = r + 'assets/render/' + it.img;
      return '<picture class="im-pic im-pic--light"><source srcset="' + s + '-light.webp" type="image/webp"><img src="' + s + '-light.jpg" alt="' + alt + '" width="2400" height="1500" decoding="async"></picture>' +
        '<picture class="im-pic im-pic--dark"><source srcset="' + s + '-dark.webp" type="image/webp"><img src="' + s + '-dark.jpg" alt="' + alt + '" width="2400" height="1500" decoding="async"></picture>';
    }
    if (it.photo && it.photo.src) {
      return '<img class="im-photo" src="' + r + esc(it.photo.src) + '" alt="' + alt + '"' + (it.photo.w ? ' width="' + it.photo.w + '" height="' + it.photo.h + '"' : '') + ' decoding="async">';
    }
    if (it.svg && D.illu[it.svg]) return '<div class="im-illu">' + D.illu[it.svg] + '</div>';
    return '<div class="im-illu im-illu--none" aria-hidden="true"></div>';
  }

  /* ---- ploča (jedna po strani, pravi se pri prvom otvaranju) ------------ */
  var box, panel, opener = null, cur = null, prevHash = null, list = [];
  function build() {
    box = doc.createElement('div');
    box.className = 'imodal';
    box.id = 'itemModal';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'imTitle');
    box.hidden = true;
    box.innerHTML = '<div class="imodal__scrim" data-im-close></div>' +
      '<div class="imodal__panel" tabindex="-1">' +
      '<button class="imodal__x" type="button" data-im-close aria-label="' + esc(t('item.close')) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="imodal__in"></div></div>';
    doc.body.appendChild(box);
    panel = box.querySelector('.imodal__panel');
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-im-close]')) { close(); return; }
      var nav = e.target.closest('[data-im-nav]');
      if (nav) step(+nav.getAttribute('data-im-nav'));
    });
    box.addEventListener('keydown', onKey);
  }

  function render(it) {
    var x = txt(it), lb = it.kind === 'gallery' || it.kind === 'reference', h = '';
    box.classList.toggle('imodal--lb', lb);
    box.classList.toggle('imodal--text', lb && !it.img && !it.photo);
    h += '<figure class="imodal__media">' + media(it, true) + '</figure>';
    h += '<div class="imodal__body">';
    h += '<p class="imodal__kicker mono">' + esc(t('item.kind.' + it.kind)) + '</p>';
    h += '<h2 class="imodal__t" id="imTitle">' + esc(x.t) + '</h2>';
    if (lb) {
      if (x.sum) h += '<p class="imodal__sum">' + esc(x.sum) + '</p>';
      var idx = list.indexOf(it.slug), n = list.length;
      h += '<p class="imodal__meta mono">' + (it.kind === 'gallery' ? 'FIG. ' + esc(it.fig || '') + ' / ' + n : (idx + 1) + ' / ' + n) +
        (x.meta ? ' · ' + esc(String(x.meta).toUpperCase()) : '') + '</p>';
      if (n > 1) h += '<div class="imodal__nav"><button type="button" class="imodal__navb" data-im-nav="-1" aria-label="' + esc(t('item.prev')) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
        '<button type="button" class="imodal__navb" data-im-nav="1" aria-label="' + esc(t('item.next')) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>';
    } else {
      if (x.tags && x.tags.length) h += '<ul class="imodal__tags">' + x.tags.map(function (g) { return '<li class="tag">' + esc(g) + '</li>'; }).join('') + '</ul>';
      if (x.sum) h += '<p class="imodal__sum">' + esc(x.sum) + '</p>';
      if (x.specs && x.specs.length) {
        h += '<dl class="imodal__specs">' + x.specs.slice(0, 6).map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('') + '</dl>';
      }
      var dh = detailHref(it), ch = calcHref(it);
      h += '<div class="imodal__acts">';
      if (dh) h += '<a class="btn" href="' + esc(dh) + '">' + esc(t('item.more')) + ' ' + ARROW + '</a>';
      if (ch) h += '<a class="btn btn--ghost" href="' + esc(ch) + '">' + esc(t('item.calc')) + '</a>';
      h += '<a class="btn btn--ghost" href="' + esc(inquiryHref(it)) + '">' + esc(t('item.send')) + '</a>';
      h += '</div>';
    }
    h += '</div>';
    box.querySelector('.imodal__in').innerHTML = h;
  }

  /* listanje (lightbox): vidljive kartice iste vrste, redom kojim su na strani */
  function siblings(it) {
    var kind = it.kind;
    return Array.prototype.filter.call(doc.querySelectorAll('[data-item]'), function (el) {
      var o = D.get(el.getAttribute('data-item'));
      return o && o.kind === kind && el.offsetParent !== null;
    }).map(function (el) { return el.getAttribute('data-item'); }).filter(function (s, i, a) { return a.indexOf(s) === i; });
  }
  function step(d) {
    if (!cur || list.length < 2) return;
    var i = list.indexOf(cur.slug);
    var nx = D.get(list[(i + d + list.length) % list.length]);
    if (nx) { cur = nx; render(nx); setHash(nx.slug); var b = box.querySelector('[data-im-nav="' + d + '"]'); if (b) b.focus(); }
  }

  function setHash(slug) {
    try { history.replaceState(history.state, '', location.pathname + location.search + '#item=' + slug); } catch (e) { /* file:// u nekim pregledačima */ }
  }
  var scrollY = 0;
  function open(slug, from) {
    var it = D.get(slug);
    if (!it) return false;
    if (!box) build();
    var wasOpen = !box.hidden;
    cur = it;
    list = (it.kind === 'gallery' || it.kind === 'reference') ? siblings(it) : [it.slug];
    if (list.indexOf(it.slug) < 0) list.unshift(it.slug);
    render(it);
    if (!wasOpen) {
      opener = from || doc.activeElement;
      prevHash = /(^|[#&])item=/.test(location.hash) ? '' : location.hash;
      scrollY = window.pageYOffset;
      var sb = window.innerWidth - root.clientWidth;
      root.style.overflow = 'hidden';
      if (sb > 0) doc.body.style.paddingRight = sb + 'px';
      box.hidden = false;
      // sledeći frejm: prelaz ulaska (klasa is-open)
      requestAnimationFrame(function () { box.classList.add('is-open'); });
    }
    setHash(it.slug);
    var first = box.querySelector('.imodal__x');
    (first || panel).focus({ preventScroll: true });
    return true;
  }
  function close() {
    if (!box || box.hidden) return;
    box.classList.remove('is-open');
    box.hidden = true;
    root.style.overflow = '';
    doc.body.style.paddingRight = '';
    try { history.replaceState(history.state, '', location.pathname + location.search + (prevHash || '')); } catch (e) { /* ignore */ }
    if (window.pageYOffset !== scrollY) window.scrollTo(0, scrollY);
    // kartica sa sopstvenim vezama nije fokusabilna — fokus se vraća na njeno dugme „otvori“
    var back = opener && opener.querySelector && opener.getAttribute('tabindex') === null && opener.tagName !== 'A' && opener.tagName !== 'BUTTON' ? opener.querySelector('.im-open') || opener : opener;
    if (back && back.focus && doc.contains(back)) back.focus({ preventScroll: true });
    opener = cur = null;
  }

  function focusables() {
    return Array.prototype.filter.call(panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'), function (el) { return el.offsetParent !== null; });
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = focusables();
      if (!f.length) { e.preventDefault(); return; }
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === a || doc.activeElement === panel)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && doc.activeElement === z) { e.preventDefault(); a.focus(); }
      return;
    }
    if (box.classList.contains('imodal--lb') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); }
  }

  /* ---- kartice ------------------------------------------------------------ */
  var INNER = 'a[href], button, input, select, textarea, summary, label';
  function bind(el) {
    if (el.__im) return;
    var it = D.get(el.getAttribute('data-item'));
    if (!it) return;
    el.__im = 1;
    var label = txt(it).t + ' — ' + t(it.kind === 'gallery' || it.kind === 'reference' ? 'item.view' : 'item.open');
    el.classList.add('is-item');
    // kartica sa sopstvenim vezama/dugmadima ne sme da bude i sama dugme (ugnježdene kontrole):
    // tastatura je otvara skrivenim dugmetom na početku kartice, miš klikom bilo gde
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON' && el.querySelector(INNER)) {
      var sb = doc.createElement('button');
      sb.type = 'button'; sb.className = 'sr-only im-open'; sb.textContent = label;
      sb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(it.slug, el); });
      el.insertBefore(sb, el.firstChild);
    } else {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-haspopup', 'dialog');
      // ime dolazi iz vidljivog sadržaja (WCAG 2.5.3); oznaka samo kad kartica nema teksta
      if (!el.textContent.trim() && !el.querySelector('img[alt]:not([alt=""])')) el.setAttribute('aria-label', label);
    }
    el.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      // unutrašnja veza / dugme radi svoje (npr. „Vidi na objektu“)
      var inner = e.target.closest(INNER);
      if (inner && inner !== el && el.contains(inner)) return;
      // kartica-veza: Ctrl/⌘/Shift-klik otvara stranu u novoj kartici kao i do sada
      if (el.tagName === 'A' && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) return;
      e.preventDefault();
      open(it.slug, el);
    });
    el.addEventListener('keydown', function (e) {
      if (e.target !== el) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); open(it.slug, el); }
    });
  }
  function bindAll() { Array.prototype.forEach.call(doc.querySelectorAll('[data-item]'), bind); }

  function fromHash() {
    var m = /(?:^#|&)item=([\w-]+)/.exec(location.hash);
    if (m && D.get(m[1])) { open(m[1], doc.querySelector('[data-item="' + m[1] + '"]')); return true; }
    return false;
  }

  function init() {
    bindAll();
    // posle učitavanja (loader, reveal): heš otvara ploču
    if (/item=/.test(location.hash)) {
      if (doc.readyState === 'complete') setTimeout(fromHash, 50);
      else window.addEventListener('load', function () { setTimeout(fromHash, 50); });
    }
    window.addEventListener('hashchange', function () {
      if (/item=/.test(location.hash)) fromHash();
      else if (box && !box.hidden) close();
    });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();

  window.tricomModal = { open: open, close: close, bind: bindAll };
})();
