/* ==========================================================================
   TRICOM — assistant.js
   Asistent na sajtu koji radi bez API-ja i bez mreže.

   Kako radi:
   1. Normalizacija upita — ćirilica → latinica, uklanjanje dijakritike,
      čišćenje interpunkcije.
   2. Bodovanje zapisa iz baze znanja: poklapanje fraza (veća težina) +
      poklapanje pojedinačnih reči sa tolerancijom na padeže (prefiksno).
   3. Ako je najbolji rezultat ispod pragа — pošten fallback sa kontaktom,
      bez izmišljanja podataka.
   ========================================================================== */
(function () {
  'use strict';

  /* Jezik strane: na engleskim stranama (/en/, <html lang="en">) primarna
     baza je TRICOM_KB_EN, a srpska TRICOM_KB služi za pitanja na srpskom. */
  var LANG = (window.L10N && typeof window.L10N.lang === 'function') ? window.L10N.lang()
    : ((document.documentElement.getAttribute('lang') || 'sr').slice(0, 2).toLowerCase() === 'en' ? 'en' : 'sr');

  /* Baza znanja (kb.js, na engleskim stranama i kb.en.js) se učitava tek kad asistent zatreba
     (otvaranje, pitanje, obnova razgovora) — strana je ne preuzima unapred. */
  var KB = null, KB_SR = null, EN = false, IDX_SR = null, IDX_EN = null;
  var JS = (function () { var s = document.currentScript; return s ? s.src.replace(/assistant\.js(\?.*)?$/, '') : 'js/'; })();
  var kbWait = null;
  function ensure(cb) {
    if (KB) return cb();
    if (kbWait) return kbWait.push(cb);
    kbWait = [cb];
    var files = ['kb.js'].concat(LANG === 'en' ? ['kb.en.js'] : []), left = files.length;
    files.forEach(function (f) {
      var s = document.createElement('script');
      s.src = JS + f + '?v=2026-11-18.4';
      s.onload = s.onerror = function () {
        if (--left) return;
        KB_SR = KB = window.TRICOM_KB;
        if (!KB) return;
        EN = LANG === 'en' && !!window.TRICOM_KB_EN;
        if (EN) KB = window.TRICOM_KB_EN;
        IDX_SR = buildIndex(KB_SR, norm, tokens);
        IDX_EN = EN ? buildIndex(KB, normEn, tokensEn) : null;
        var q = kbWait; kbWait = null; q.forEach(function (f) { f(); });
      };
      document.head.appendChild(s);
    });
  }

  /* Tekstovi samog asistenta — iz i18n (ključevi asst.*) */
  function T(key, def) {
    var s = (window.L10N && typeof window.L10N.t === 'function') ? window.L10N.t(key) : null;
    return (s && s !== key) ? s : def;
  }

  /* ------------------------------------------------------------- Normalizacija */

  var CYR = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','ђ':'dj','е':'e','ж':'z','з':'z','и':'i',
    'ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r',
    'с':'s','т':'t','ћ':'c','у':'u','ф':'f','х':'h','ц':'c','ч':'c','џ':'dz','ш':'s'
  };
  var DIA = {
    'č':'c','ć':'c','š':'s','ž':'z','đ':'dj','Č':'c','Ć':'c','Š':'s','Ž':'z','Đ':'dj'
  };

  function norm(s) {
    if (!s) return '';
    s = String(s).toLowerCase();
    var out = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s[i];
      if (CYR[ch]) out += CYR[ch];
      else if (DIA[ch]) out += DIA[ch];
      else out += ch;
    }
    // dijakritika preko Unicode dekompozicije (za svaki slučaj)
    if (out.normalize) out = out.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    out = out.replace(/[^a-z0-9\s.,/-]/g, ' ').replace(/\s+/g, ' ').trim();
    return out;
  }

  var STOP = ('i ili a ali pa te da li je su sam smo ste bi bih bismo se sto što koji koja koje kojе '
    + 'kako kada gde zasto zbog za od do na u iz sa sе o po pre posle kod vas vasa vase nas nasa nase '
    + 'moj moja moje mi vi on ona ono oni one ovo ovaj ova taj ta to tu tako ne da mozete mozes mogu '
    + 'moze da bi hteo hteli zelim zelite treba trebam trebalo imate imam ima ima li molim vas hvala '
    + 'jedan jedna jedno the a an of for and is are').split(' ');

  function tokens(s) {
    return norm(s).split(/[\s.,/-]+/).filter(function (t) {
      return t.length > 1 && STOP.indexOf(t) === -1;
    });
  }

  /* Prefiksno poklapanje — tolerantno na srpske padeže (lim/lima/limovi) */
  function soft(a, b) {
    if (a === b) return 1;
    var n = Math.min(a.length, b.length);
    if (n < 4) return 0;
    var k = 0;
    while (k < n && a[k] === b[k]) k++;
    if (k < 4) return 0;
    return k / Math.max(a.length, b.length) >= 0.6 ? 0.82 : 0;
  }

  /* ------------------------------------------------- Engleska normalizacija */

  var STOP_EN = ('a an the of for and or but nor is are was were be been being am to in on at by with from as '
    + 'into onto than then so if it its this that these those there here do does did doing done can could would '
    + 'should will shall may might must i me my mine we us our ours you your yours he him his she her they them '
    + 'their what which who whom whose where when why how about also just any some much many very really kind '
    + 'sort type types like want need needed looking look wondering tell know let get got have has had having '
    + 'sell sells selling offer offers provide provides make makes made please one all other not no yes ok okay '
    + 'hi hello thanks').split(' ');

  var SPELL_EN = {
    color: 'colour', colors: 'colours', colored: 'coloured', aluminum: 'aluminium', meter: 'metre',
    meters: 'metres', center: 'centre', centers: 'centres', gray: 'grey', catalog: 'catalogue',
    checker: 'chequer', checkered: 'chequered', leveling: 'levelling', vapor: 'vapour', fiber: 'fibre',
    liter: 'litre', paneling: 'panelling', gage: 'gauge'
  };

  function normEn(s) {
    if (!s) return '';
    return norm(String(s).replace(/['’‘`]/g, '').replace(/²/g, '2').replace(/³/g, '3'));
  }

  /* Jednostavno skraćivanje nastavaka: -ies→y, -es, -s, -ing, -ed, -er, -e;
     -ize/-ise se svode na isto. Isti postupak važi za upit i za bazu. */
  function stemEn(w) {
    if (SPELL_EN[w]) w = SPELL_EN[w];
    if (w.length <= 3 || /^\d/.test(w)) return w;
    if (/ies$/.test(w) && w.length > 4) w = w.slice(0, -3) + 'y';
    else if (/(sses|xes|ches|shes)$/.test(w)) w = w.slice(0, -2);
    else if (/(ss|us|is)$/.test(w)) { /* ostaje */ }
    else if (/s$/.test(w)) w = w.slice(0, -1);
    if (/ing$/.test(w) && w.length > 5) w = w.slice(0, -3);
    else if (/ed$/.test(w) && w.length > 5) w = w.slice(0, -2);
    else if (/er$/.test(w) && w.length > 5) w = w.slice(0, -2);
    if (/([b-df-hj-np-tv-z])\1$/.test(w) && !/(ll|ss|ff|zz)$/.test(w)) w = w.slice(0, -1);
    if (/e$/.test(w) && w.length > 4) w = w.slice(0, -1);
    return w.replace(/iz$/, 'is');
  }

  function tokensEn(s) {
    return normEn(s).split(/[\s.,/-]+/).filter(function (t) {
      return t.length > 1 && STOP_EN.indexOf(t) === -1;
    }).map(stemEn);
  }

  /* ---------------------------------------------------------------- Priprema */

  function buildIndex(kb, nf, tf) {
    return {
      norm: nf,
      tokens: tf,
      entries: kb.entries.map(function (e) {
        return {
          ref: e,
          phrases: e.k.map(nf).filter(Boolean),
          words: (function () {
            var set = {};
            e.k.forEach(function (kw) { tf(kw).forEach(function (t) { set[t] = 1; }); });
            tf(e.q || '').forEach(function (t) { set[t] = 1; });
            return Object.keys(set);
          })(),
          w: e.w || 1
        };
      })
    };
  }


  function matchSimple(list, nq) {
    for (var i = 0; i < list.length; i++) {
      var p = norm(list[i]);
      if (!p) continue;
      if (nq === p) return true;
      if (nq.length <= p.length + 6 && nq.indexOf(p) !== -1) return true;
    }
    return false;
  }

  function score(query, X) {
    var nq = X.norm(query);
    var qt = X.tokens(query);
    if (!nq) return [];

    var results = X.entries.map(function (E) {
      var s = 0, j, k;

      // 1. poklapanje cele fraze
      for (j = 0; j < E.phrases.length; j++) {
        var ph = E.phrases[j];
        if (ph.length < 3) continue;
        if (nq.indexOf(ph) !== -1) {
          s += 3 + ph.split(' ').length * 1.9 + Math.min(ph.length, 18) * 0.07;
        }
      }

      // 2. poklapanje reči (sa tolerancijom na oblik reči)
      var hit = {};
      for (j = 0; j < qt.length; j++) {
        var best = 0;
        for (k = 0; k < E.words.length; k++) {
          var v = soft(qt[j], E.words[k]);
          if (v > best) best = v;
          if (best === 1) break;
        }
        if (best > 0 && !hit[qt[j]]) { hit[qt[j]] = 1; s += best * 1.45; }
      }

      // 3. pokrivenost upita — kratki upiti moraju biti dobro pokriveni
      var cov = qt.length ? Object.keys(hit).length / qt.length : 0;
      s *= (0.62 + cov * 0.58);

      return { entry: E.ref, s: s * E.w };
    });

    results.sort(function (a, b) { return b.s - a.s; });
    return results;
  }

  var THRESHOLD = 2.5;

  function hitFrom(r, kb) {
    var top = r[0];
    var related = [];
    for (var i = 1; i < r.length && related.length < 2; i++) {
      if (r[i].s >= Math.max(THRESHOLD, top.s * 0.45)) related.push(r[i].entry);
    }

    return {
      kind: 'hit',
      a: top.entry.a,
      acts: top.entry.acts,
      related: related,
      id: top.entry.id,
      kb: kb
    };
  }

  function answer(query) {
    if (EN) return answerEn(query);

    var nq = norm(query);

    if (matchSimple(KB.greetings.k, nq)) return { kind: 'greet', a: KB.greetings.a };
    if (matchSimple(KB.thanks.k, nq))    return { kind: 'plain', a: KB.thanks.a };
    if (matchSimple(KB.bye.k, nq))       return { kind: 'plain', a: KB.bye.a };

    var r = score(query, IDX_SR);
    if (!r.length || r[0].s < THRESHOLD) {
      return { kind: 'fallback', a: KB.fallback.a, acts: KB.fallback.acts };
    }

    return hitFrom(r, KB);
  }

  /* ------------------------------------------------ Engleska strana (/en/) */

  /* Pozdrav/hvala/zbogom na engleskoj strani: cela reč, ne deo reči
     ("hi" ne sme da se nađe u "shipping"). */
  function matchWord(list, nq, nf) {
    var q = nq.replace(/[.,/-]+/g, ' ').replace(/\s+/g, ' ').trim();
    for (var i = 0; i < list.length; i++) {
      var p = nf(list[i]);
      if (!p) continue;
      if (q === p) return true;
      if (q.length <= p.length + 6 && (' ' + q + ' ').indexOf(' ' + p + ' ') !== -1) return true;
    }
    return false;
  }

  /* Upit koji očigledno jeste na srpskom (dijakritika, ćirilica ili srpske
     funkcijske reči) — tada srpska baza ima prednost ako ima bolji rezultat. */
  var SR_MARK = ('je li da za sa na se su od iz ili ali koji koja koje kojeg kako gde sta sto kada kad '
    + 'koliko koliki kolika kolike imate imam ima radite mozete moze prodajete secete treba trebam zelim '
    + 'trazim molim vas vam nam nije').split(' ');
  function looksSerbian(q) {
    if (/[čćšžđČĆŠŽĐЀ-ӿ]/.test(q)) return true;
    var t = norm(q).split(/[\s.,/-]+/);
    for (var i = 0; i < t.length; i++) if (SR_MARK.indexOf(t[i]) !== -1) return true;
    return false;
  }

  /* Srpski odgovor na engleskoj strani: relativne veze ka stranama
     (plazma.html, o-nama.html#faq) vode na srpske strane u korenu. */
  var ROOT = (window.L10N && typeof window.L10N.root === 'string') ? window.L10N.root : '../';
  function toRoot(href) {
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|#|\/|\.\.\/)/i.test(href)) return href;
    return /\.html(?:[#?]|$)/.test(href) ? ROOT + href : href;
  }
  function srAnswer(res) {
    res.a = String(res.a).replace(/(\shref=")([^"]*)"/g, function (m, p, h) { return p + toRoot(h) + '"'; });
    if (res.acts) {
      res.acts = res.acts.map(function (x) { return { label: x.label, href: toRoot(x.href), icon: x.icon }; });
    }
    res.kb = KB_SR;
    res.lang = 'sr';
    return res;
  }

  function answerEn(query) {
    var nqE = normEn(query), nqS = norm(query);

    if (matchWord(KB.greetings.k, nqE, normEn)) return { kind: 'greet', a: KB.greetings.a };
    if (matchWord(KB.thanks.k, nqE, normEn))    return { kind: 'plain', a: KB.thanks.a };
    if (matchWord(KB.bye.k, nqE, normEn))       return { kind: 'plain', a: KB.bye.a };
    if (matchWord(KB_SR.greetings.k, nqS, norm)) return srAnswer({ kind: 'greet', a: KB_SR.greetings.a, chips: KB_SR.chips });
    if (matchWord(KB_SR.thanks.k, nqS, norm))    return srAnswer({ kind: 'plain', a: KB_SR.thanks.a });
    if (matchWord(KB_SR.bye.k, nqS, norm))       return srAnswer({ kind: 'plain', a: KB_SR.bye.a });

    var rE = score(query, IDX_EN);
    var bestE = rE.length ? rE[0].s : 0;
    if (bestE < THRESHOLD || looksSerbian(query)) {
      var rS = score(query, IDX_SR);
      var bestS = rS.length ? rS[0].s : 0;
      if (bestS >= THRESHOLD && (bestE < THRESHOLD || bestS > bestE)) return srAnswer(hitFrom(rS, KB_SR));
    }
    if (bestE < THRESHOLD) {
      return { kind: 'fallback', a: KB.fallback.a, acts: KB.fallback.acts };
    }
    return hitFrom(rE, KB);
  }

  /* -------------------------------------------------------------------- Ikone */

  var ICO = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ----------------------------------------------------------------- Elementi */

  var fab = document.getElementById('aiFab');
  var panel = document.getElementById('aiPanel');
  var body = document.getElementById('aiBody');
  var form = document.getElementById('aiForm');
  var input = document.getElementById('aiInput');
  var send = document.getElementById('aiSend');
  var chipsBox = document.getElementById('aiChips');
  var closeBtn = document.getElementById('aiClose');
  var resetBtn = document.getElementById('aiReset');
  var nudge = document.getElementById('aiNudge');
  var nudgeX = document.getElementById('aiNudgeX');

  if (!fab || !panel || !body || !form || !input) return;

  var busy = false;
  var opened = false;
  var history = [];

  /* ------------------------------------------------------------------ Session */

  // Engleske strane imaju svoj prefiks — srpski razgovor se ne obnavlja na
  // engleskoj strani i obrnuto.
  var SKEY = LANG === 'en' ? 'tricom_ai_en_' : 'tricom_ai_';

  function store(key, val) {
    try { sessionStorage.setItem(SKEY + key, val); } catch (e) {}
  }
  function read(key) {
    try { return sessionStorage.getItem(SKEY + key); } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------- Render */

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function scrollDown() {
    requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });
  }

  /* Strane detalja (detalji/, en/details/) su fasciklu dublje: relativne veze
     iz baze znanja dobijaju L10N.base („../“); na ostalim stranama je prazan. */
  function toBase(href) {
    var b = window.L10N && window.L10N.base;
    if (!b || !href || /^(?:[a-z][a-z0-9+.-]*:|#|\/|\.\.\/)/i.test(href)) return href;
    return b + href;
  }
  function addMsg(who, html, acts) {
    if (who === 'bot' && window.L10N && window.L10N.base) html = String(html).replace(/(\shref=")([^"]*)"/g, function (m, p, h) { return p + toBase(h) + '"'; });
    var m = el('div', 'msg msg--' + who, html);
    if (acts && acts.length) {
      var box = el('div', 'msg__acts');
      acts.forEach(function (a) {
        var isExt = /^(tel:|mailto:|https?:)/.test(a.href);
        var n = el('a', 'msg__act', (ICO[a.icon] || '') + '<span>' + a.label + '</span>');
        n.href = toBase(a.href);
        if (/^https?:/.test(a.href)) { n.target = '_blank'; n.rel = 'noopener'; }
        box.appendChild(n);
      });
      m.appendChild(box);
    }
    body.appendChild(m);
    scrollDown();
    return m;
  }

  function addTyping() {
    var t = el('div', 'typing', '<i></i><i></i><i></i>');
    t.setAttribute('aria-label', T('asst.typing', 'Asistent piše odgovor'));
    body.appendChild(t);
    scrollDown();
    return t;
  }

  function renderChips(list) {
    chipsBox.innerHTML = '';
    (list || []).slice(0, 4).forEach(function (txt) {
      var b = el('button', 'ai-chip', txt);
      b.type = 'button';
      b.addEventListener('click', function () { submit(txt); });
      chipsBox.appendChild(b);
    });
    chipsBox.style.display = list && list.length ? 'flex' : 'none';
  }

  /* ------------------------------------------------------------------- Tokovi */

  /* {hours} u odgovorima baze znanja = radno vreme iz futera strane (administracija → Kontakt),
     da asistent i strana nikad ne pokazuju različit raspored */
  function fillHours(a, lang) {
    if (String(a).indexOf('{hours}') < 0) return a;
    var b = document.getElementById('fhours');
    var v = b ? (b.getAttribute('data-label-' + lang) || b.getAttribute('data-label-sr') || '') : '';
    v = v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return String(a).replace(/\{hours\}/g, v || T('asst.hours.none', lang === 'en' ? 'see the page footer' : 'v dnu strane'));
  }

  function reply(q) {
    var res = answer(q);
    res.a = fillHours(res.a, res.lang || LANG);
    var tip = addTyping();
    var delay = 340 + Math.min(620, res.a.length * 1.6);

    setTimeout(function () {
      tip.remove();
      var acts = res.acts ? res.acts.slice() : [];
      addMsg('bot', res.a, acts);
      window.tricomAssistLast = { id: res.id || null, kind: res.kind, lang: res.lang || LANG };

      if (res.related && res.related.length) {
        renderChips(res.related.map(function (e) { return e.q; }));
      } else if (res.kind === 'fallback' || res.kind === 'greet') {
        renderChips((res.chips || KB.chips).slice(0, 4));
      } else {
        renderChips(pickChips(res.id, res.kb || KB));
      }

      history.push({ r: 'bot', t: res.a, acts: acts });
      store('log', JSON.stringify(history.slice(-40)));
      busy = false;
      send.disabled = false;
    }, delay);
  }

  function pickChips(excludeId, kb) {
    var pool = kb.entries.filter(function (e) { return e.id !== excludeId && e.q; });
    var out = [], used = {};
    var seeds = ['kontakt', 'popust', 'narucivanje', 'trapezni', 'plazma', 'oluci', 'montaza'];
    seeds.forEach(function (id) {
      if (out.length >= 3 || id === excludeId) return;
      var f = pool.filter(function (e) { return e.id === id; })[0];
      if (f && !used[f.id]) { used[f.id] = 1; out.push(f.q); }
    });
    return out;
  }

  function submit(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    addMsg('user', escapeHtml(text));
    history.push({ r: 'user', t: escapeHtml(text) });
    renderChips([]);
    input.value = '';
    autosize();
    ensure(function () { reply(text); });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* -------------------------------------------------------------------- Panel */

  function openPanel() {
    panel.classList.add('is-open');
    fab.classList.add('is-open');
    fab.classList.remove('is-pinging');
    fab.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('aria-hidden');
    hideNudge();
    store('opened', '1');
    if (!opened) {
      opened = true;
      if (!history.length) ensure(function () {
        if (history.length) return;
        addMsg('bot', KB.greetings.a);
        history.push({ r: 'bot', t: KB.greetings.a });
        renderChips(KB.chips.slice(0, 4));
      });
    }
    setTimeout(function () {
      if (window.matchMedia('(min-width: 760px)').matches) input.focus();
    }, 420);
  }

  function closePanel() {
    panel.classList.remove('is-open');
    fab.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  function togglePanel() {
    panel.classList.contains('is-open') ? closePanel() : openPanel();
  }

  function resetChat() {
    history = [];
    body.innerHTML = '';
    store('log', '');
    addMsg('bot', T('asst.cleared', 'Razgovor je obrisan. Pitajte nešto novo.'));
    renderChips(KB.chips.slice(0, 4));
  }

  /* -------------------------------------------------------------------- Nudge */

  function showNudge() {
    if (!nudge) return;
    if (panel.classList.contains('is-open')) return;
    if (read('nudged') === '1' || read('opened') === '1') return;
    nudge.classList.add('is-visible');
    fab.classList.add('is-pinging');
    store('nudged', '1');
    setTimeout(hideNudge, 11000);
  }
  function hideNudge() {
    if (nudge) nudge.classList.remove('is-visible');
  }

  /* ----------------------------------------------------------------- Autosize */

  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(96, input.scrollHeight) + 'px';
  }

  /* -------------------------------------------------------------------- Events */

  fab.addEventListener('click', togglePanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (resetBtn) resetBtn.addEventListener('click', resetChat);
  if (nudgeX) nudgeX.addEventListener('click', function (e) { e.stopPropagation(); hideNudge(); });
  if (nudge) nudge.addEventListener('click', openPanel);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submit(input.value);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(input.value);
    }
  });
  input.addEventListener('input', autosize);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
      fab.focus();
    }
  });

  // Klik izvan panela zatvara ga (samo na širokim ekranima).
  // Dugmad "Pitajte asistenta" iz sadržaja su izuzeta: ona panel upravo
  // otvaraju, pa bi ih ovaj handler zatvorio u istom kliku.
  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('is-open')) return;
    if (!window.matchMedia('(min-width: 560px)').matches) return;
    if (panel.contains(e.target) || fab.contains(e.target)) return;
    if (e.target.closest && e.target.closest('[data-ask]')) return;
    closePanel();
  });

  // Obnova razgovora u istoj sesiji
  (function restore() {
    var raw = read('log');
    if (!raw) return;
    try {
      var log = JSON.parse(raw);
      if (!log || !log.length) return;
      log.forEach(function (m) { addMsg(m.r === 'user' ? 'user' : 'bot', m.t, m.acts); });
      history = log;
      opened = true;
      ensure(function () { renderChips(KB.chips.slice(0, 3)); });
    } catch (e) {}
  })();

  setTimeout(showNudge, 14000);

  // Globalni API — za "Pitajte asistenta" dugmiće u sadržaju
  window.tricomAsk = function (q) {
    openPanel();
    if (q) setTimeout(function () { submit(q); }, 480);
  };
})();
