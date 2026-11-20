/* ==========================================================================
   TRICOM — theme.js
   Prekidač svetle i tamne teme (dugme [data-theme-toggle] u zaglavlju, u
   mobilnom meniju i u traci konfiguratora).

   - početnu temu postavlja mala skripta u <head>-u (pre stilova), pa ovde
     samo usklađujemo dugmad sa atributom html[data-theme]
   - klik menja temu i pamti izbor u sessionStorage['tricom-theme']: tamna
     važi samo za tekuću sesiju kartice, svaka nova poseta počinje svetlo
   - svetla tema je podrazumevana za sve; sistemska postavka
     (svetla / tamna u operativnom sistemu) se namerno ne prati — jedan izvor istine
   - stari ključ localStorage['tricom-theme'] (trajni izbor) se briše pri učitavanju
   - <meta name="theme-color"> prati temu
   - događaj „tricom:theme“ (detail: 'light' | 'dark') javlja promenu
     ostalim modulima (3D objekat u hero-u)
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'tricom-theme';
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var COLOR = { light: '#EEF1F5', dark: '#0A0D12' };
  var btns = Array.prototype.slice.call(document.querySelectorAll('[data-theme-toggle]'));

  function stored() {
    try { localStorage.removeItem(KEY); } catch (e) { /* privatni režim */ }
    try { var t = sessionStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; }
    catch (e) { return null; }
  }
  function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function apply(t, persist) {
    var changed = t !== current();
    root.setAttribute('data-theme', t);
    if (meta) meta.setAttribute('content', COLOR[t]);
    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    });
    if (persist) { try { sessionStorage.setItem(KEY, t); } catch (e) { /* privatni režim */ } }
    if (changed) document.dispatchEvent(new CustomEvent('tricom:theme', { detail: t }));
  }

  apply(stored() || 'light', false);

  btns.forEach(function (b) {
    b.addEventListener('click', function () { apply(current() === 'dark' ? 'light' : 'dark', true); });
  });


  /* Prelaz između strana (<style>@view-transition u <head>-u svake strane):
     preskočen ili prekinut prelaz (brzi uzastopni klikovi, spora strana) odbija
     obećanja objekta ViewTransition — hvatamo ih da konzola ostane čista. */
  function quiet(e) {
    var vt = e.viewTransition, no = function () { /* preskočen prelaz nije greška */ };
    if (!vt) return;
    vt.ready.catch(no); vt.finished.catch(no);
    if (vt.updateCallbackDone) vt.updateCallbackDone.catch(no);
  }
  window.addEventListener('pageswap', quiet);
  window.addEventListener('pagereveal', quiet);

  window.tricomTheme = { get: current, set: function (t) { apply(t === 'dark' ? 'dark' : 'light', true); } };
})();
