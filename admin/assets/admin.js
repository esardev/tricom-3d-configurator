/* TRICOM — administracija: redovi tehničkih podataka (dodaj, pomeri gore/dole).
   Bez skripte forma i dalje radi: tri prazna reda, redosled brojem, „ukloni“. */
(function () {
  'use strict';
  var body = document.querySelector('[data-spec-body]');
  var tpl = document.querySelector('[data-spec-template]');
  var add = document.querySelector('[data-spec-add]');
  if (!body || !tpl) return;
  var next = body.querySelectorAll('[data-spec]').length;

  function renumber() {
    Array.prototype.forEach.call(body.querySelectorAll('[data-spec]'), function (row, i) {
      var o = row.querySelector('[data-spec-order]');
      if (o) o.value = (i + 1) * 10;
    });
  }
  function wire(row) {
    Array.prototype.forEach.call(row.querySelectorAll('[data-spec-up], [data-spec-down]'), function (b) { b.hidden = false; });
    var o = row.querySelector('[data-spec-order]');
    if (o) o.readOnly = true;
  }
  Array.prototype.forEach.call(body.querySelectorAll('[data-spec]'), wire);
  if (add) add.hidden = false;

  body.addEventListener('click', function (e) {
    var b = e.target.closest('[data-spec-up], [data-spec-down]');
    if (!b) return;
    var row = b.closest('[data-spec]');
    if (b.hasAttribute('data-spec-up') && row.previousElementSibling) body.insertBefore(row, row.previousElementSibling);
    if (b.hasAttribute('data-spec-down') && row.nextElementSibling) body.insertBefore(row.nextElementSibling, row);
    renumber();
    b.focus();
  });
  if (add) {
    add.addEventListener('click', function () {
      var html = tpl.innerHTML.replace(/__i__/g, 'n' + (next++));
      var holder = document.createElement('tbody');
      holder.innerHTML = html;
      var row = holder.firstElementChild;
      body.appendChild(row);
      wire(row);
      renumber();
      var first = row.querySelector('input[type="text"]');
      if (first) first.focus();
    });
  }
})();
