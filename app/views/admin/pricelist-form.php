<?php
/* Cenovnik trapeznih limova (interni). Ulaz: $ready; uz $ready: $pl, $show, $errors, $gaps */
defined('TRICOM') || exit;
?>
<h1 class="adm-h1">Cenovnik</h1>
<?php if (!$ready): ?>
  <p class="adm-flash adm-flash--warning" role="status">Tabele cenovnika i upita još nisu u bazi — u phpMyAdmin-u uvezite database/patches/009-price-list-inquiries.sql (posle 008), pa otvorite ovu stranu ponovo.</p>
  <?php return; ?>
<?php endif; ?>
<?php
$cur = isset(QUOTE_CURRENCIES[(string) $pl['currency']]) ? (string) $pl['currency'] : 'valuta';
$when = static fn(?string $at, ?string $by): string => $at ? e(date('d.m.Y. H:i', (int) strtotime($at))) . ($by ? ' <span class="adm-muted">(' . e($by) . ')</span>' : '') : '<span class="adm-muted">—</span>';
$cell = static function (string $name, string $label, array $show, array $errors, string $ph = ''): string {
    return '<input class="adm-money" type="text" inputmode="decimal" name="' . e($name) . '" id="f-' . e($name) . '" value="' . e($show[$name] ?? '') . '"'
        . ' aria-label="' . e($label) . '"' . ($ph !== '' ? ' placeholder="' . e($ph) . '"' : '')
        . (isset($errors[$name]) ? ' aria-invalid="true" aria-describedby="err-' . e($name) . '"' : '') . '>' . adm_error($errors, $name);
};
?>
<p class="adm-lead">Interni cenovnik za obračun upita iz kalkulatora trapeznih limova (TR 10, TR 20, TR 35, TR 40).
  Cene i iznosi se <strong>ne prikazuju na sajtu</strong>, u odgovoru kupcu ni u e-poruci koju kupac šalje — vide se samo ovde i u modulu
  <a href="<?= e(admin_url('', ['m' => 'upiti'])) ?>">Upiti</a>.
  Prazno polje znači da cena nije poznata: upit se i tada prima, mere se računaju, a obračun navodi tačno šta nedostaje (nikad ne računa sa nulom).</p>

<?php if ($gaps['required']): ?>
  <div class="adm-flash adm-flash--warning" role="status">
    <p><strong>Automatski obračun još nije potpun.</strong> Za konačan iznos stavke bez filca potrebno je:</p>
    <ul><?php foreach ($gaps['required'] as $g): ?><li><?= e($g) ?></li><?php endforeach; ?></ul>
  </div>
<?php else: ?>
  <p class="adm-flash adm-flash--success" role="status">Sve cene lima, valuta i osnova PDV-a su unete — stavke bez filca dobijaju konačan iznos.</p>
<?php endif; ?>
<?php if ($gaps['felt']): ?>
  <details class="adm-details adm-gaps">
    <summary>Za stavke sa filcom još nedostaje (<?= count($gaps['felt']) ?>)</summary>
    <ul><?php foreach ($gaps['felt'] as $g): ?><li><?= e($g) ?></li><?php endforeach; ?></ul>
  </details>
<?php endif; ?>

<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'cenovnik', 'a' => 'save'])) ?>" class="adm-form" novalidate>
  <?= csrf_field() ?>

  <?= adm_fieldset('Opšte',
      '<div class="adm-row">'
      . adm_select('currency', $show['currency'] ?? '', 'Valuta svih cena', ['' => '— nije izabrano —'] + QUOTE_CURRENCIES, $errors,
          ['hint' => 'Jedna valuta za ceo cenovnik. Bez valute se iznosi ne računaju.'])
      . adm_select('vat_basis', $show['vat_basis'] ?? '', 'Unete cene su', ['' => '— nije izabrano —'] + QUOTE_VAT, $errors,
          ['hint' => 'Navodi se uz svaki iznos u obračunu. PDV se ne dodaje i ne oduzima automatski.'])
      . '</div>'
      . '<p class="adm-muted">Poslednja izmena cenovnika: ' . $when($pl['updated_at'], $pl['updated_by']) . '</p>') ?>

  <fieldset class="adm-set">
    <legend>Lim — cena po m² pokrivne površine</legend>
    <p class="adm-muted adm-set__hint">Obračunska površina stavke = zbir dužnih metara (dužina table × broj tabli, za svaku dužinu) × pokrivna širina profila —
      ista osnova kao „Pokrivena površina“ u kalkulatoru. Pokrivna širina se ovde ne menja (dolazi iz podataka o profilu).
      Cena se unosi po debljini koju kalkulator nudi za taj profil; ista je za sve RAL boje.</p>
    <div class="adm-table-wrap">
    <table class="adm-table">
      <thead><tr><th scope="col">Profil</th><th scope="col">Debljina</th><th scope="col" class="adm-num">Obračunska širina</th>
        <th scope="col">Cena lima (<?= e($cur) ?> / m²)</th><th scope="col">Poslednja izmena</th></tr></thead>
      <tbody>
      <?php foreach (QUOTE_PROFILES as $key => $P): ?>
        <?php foreach ($P['thicknesses'] as $i => $t): $r = $pl['sheet'][$key . '|' . $t] ?? []; $name = pricelist_field($key, $t); ?>
          <tr>
            <?php if ($i === 0): ?>
              <th scope="rowgroup" rowspan="<?= count($P['thicknesses']) ?>"><?= e($P['name']) ?><?= $P['reinforced'] ? '<br><span class="adm-muted">ojačan</span>' : '' ?></th>
            <?php endif; ?>
            <td><?= e(quote_t_label($t)) ?> mm</td>
            <?php if ($i === 0): ?>
              <td class="adm-num" rowspan="<?= count($P['thicknesses']) ?>"><?= e(number_format($P['cover'], 0, ',', '.')) ?> mm<br><span class="adm-muted adm-src"><?= e($P['cover_src']) ?></span></td>
            <?php endif; ?>
            <td><?= $cell($name, 'Cena lima ' . $P['name'] . ', ' . quote_t_label($t) . ' mm, ' . $cur . ' po m²', $show, $errors, 'nije uneto') ?></td>
            <td><?= $when($r['updated_at'] ?? null, $r['updated_by'] ?? null) ?></td>
          </tr>
        <?php endforeach; ?>
      <?php endforeach; ?>
      </tbody>
    </table>
    </div>
  </fieldset>

  <fieldset class="adm-set">
    <legend>Filc (antikondenz) — samo za stavke sa filcom</legend>
    <p class="adm-muted adm-set__hint">Izaberite jedinicu u kojoj je cena filca:
      <strong>po m² filca</strong> — iznos = ukupni dužni metri stavke × širina filca (m) × cena; tada je širina filca obavezna;
      <strong>po dužnom metru table</strong> — iznos = ukupni dužni metri × cena; širina se ne koristi.
      Širina filca nije isto što i širina lima ni pokrivna širina — upišite stvarnu širinu filca koji se lepi na tablu tog profila.
      Upit bez filca ne traži cenu filca.</p>
    <div class="adm-table-wrap">
    <table class="adm-table">
      <thead><tr><th scope="col">Profil</th><th scope="col">Cena filca (<?= e($cur) ?>)</th><th scope="col">Jedinica cene</th>
        <th scope="col">Širina filca (mm)</th><th scope="col">Poslednja izmena</th></tr></thead>
      <tbody>
      <?php foreach (QUOTE_PROFILES as $key => $P): $f = $pl['felt'][$key] ?? []; $un = 'felt_' . $key . '_unit'; ?>
        <tr>
          <th scope="row"><?= e($P['name']) ?></th>
          <td><?= $cell('felt_' . $key . '_rate', 'Cena filca ' . $P['name'] . ', ' . $cur, $show, $errors, 'nije uneto') ?></td>
          <td><select name="<?= e($un) ?>" id="f-<?= e($un) ?>" aria-label="Jedinica cene filca <?= e($P['name']) ?>"<?= isset($errors[$un]) ? ' aria-invalid="true" aria-describedby="err-' . e($un) . '"' : '' ?>>
              <option value="">— nije izabrano —</option>
              <?php foreach (QUOTE_FELT_UNITS as $u => $label): ?>
                <option value="<?= e($u) ?>"<?= ($show[$un] ?? '') === $u ? ' selected' : '' ?>><?= e($cur . ' ' . ($u === 'm2' ? '/ m² filca' : '/ dužni m table')) ?> — <?= e($label) ?></option>
              <?php endforeach; ?>
            </select><?= adm_error($errors, $un) ?></td>
          <td><?= $cell('felt_' . $key . '_width', 'Širina filca ' . $P['name'] . ' u milimetrima', $show, $errors, 'samo za cenu po m²') ?></td>
          <td><?= $when($f['updated_at'] ?? null, $f['updated_by'] ?? null) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    </div>
  </fieldset>

  <details class="adm-details">
    <summary>Kako se računa</summary>
    <ul class="adm-list">
      <li>Mere se uvek računaju iz stavke kalkulatora koju je kupac poslao (dužine i broj tabli), ne iz teksta poruke.</li>
      <li>Dužni metri reda = dužina (mm) / 1000 × broj tabli; stavka = zbir svih dužina. Površina = dužni metri × pokrivna širina (m).</li>
      <li>Mere se ne zaokružuju pre množenja. Iznos se zaokružuje jednom, na 2 decimale (pola naviše), posebno za lim i za filc; ukupno = zbir ta dva iznosa.</li>
      <li>Kad nešto nedostaje (cena, jedinica, širina filca, valuta, osnova PDV-a, dozvoljena boja ili debljina), stavka nema konačan iznos, a obračun navodi šta nedostaje.</li>
      <li>Uz svaki upit čuvaju se primenjene cene, jedinice i rezultat. Kasnija izmena cenovnika ne menja već sačuvane obračune; u upitu se može napraviti novi obračun po važećem cenovniku.</li>
      <li>Količinski razredi i popusti nisu predviđeni (nema takve tarife u postojećim podacima). Imitacija crepa i stavke 3D konfiguratora nisu u ovom cenovniku.</li>
    </ul>
  </details>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj cenovnik</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'cenovnik'])) ?>">Odustani</a>
  </div>
</form>
