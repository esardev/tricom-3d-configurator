<?php
/* Forma kontakt podataka. Ulaz: $s (podešavanja), $locs (lokacije sa telefonima), $errors */
defined('TRICOM') || exit;
/* dvojezični par za polje lokacije: loc[id][polje_sr] | loc[id][polje_en] */
$locPair = static function (array $loc, string $k, string $label, array $errors, int $max): string {
    $out = '<div class="adm-pair">';
    foreach (LANGS as $l) {
        $name = 'loc[' . (int) $loc['id'] . '][' . $k . '_' . $l . ']';
        $out .= adm_input($name, $loc[$k . '_' . $l] ?? '', $label . ' — ' . strtoupper($l), $errors, ['maxlength' => $max, 'lang' => $l]);
    }
    return $out . '</div>';
};
$phoneRow = static function (int $locId, int|string $i, array $p): string {
    $n = static fn(string $k): string => 'loc[' . $locId . '][phones][' . $i . '][' . $k . ']';
    return '<tr>'
        . '<td><input class="adm-order" type="number" name="' . e($n('sort_order')) . '" value="' . (int) ($p['sort_order'] ?? 0) . '" aria-label="Redosled"></td>'
        . '<td><input type="text" name="' . e($n('tel')) . '" value="' . e($p['tel'] ?? '') . '" maxlength="20" spellcheck="false" placeholder="+381638503000" aria-label="Broj za poziv"></td>'
        . '<td><input type="text" name="' . e($n('display_sr')) . '" value="' . e($p['display_sr'] ?? '') . '" maxlength="40" placeholder="063 850 30 00" aria-label="Ispis — SR"></td>'
        . '<td><input type="text" name="' . e($n('display_en')) . '" value="' . e($p['display_en'] ?? '') . '" maxlength="40" placeholder="+381 63 850 30 00" aria-label="Ispis — EN"></td>'
        . '<td><label class="adm-check adm-check--sm"><input type="checkbox" name="' . e($n('in_footer')) . '" value="1"' . (!empty($p['in_footer']) ? ' checked' : '') . '> u futeru</label></td>'
        . '<td><label class="adm-check adm-check--sm"><input type="checkbox" name="' . e($n('in_quote')) . '" value="1"' . (!empty($p['in_quote']) ? ' checked' : '') . '> u ponudi</label></td>'
        . '<td><label class="adm-check adm-check--sm"><input type="checkbox" name="' . e($n('delete')) . '" value="1"> ukloni</label></td></tr>';
};
$doc = static function (string $col, string $field, string $label) use ($s, $errors): string {
    $cur = (string) ($s[$col] ?? '');
    return '<div class="adm-row adm-row--start"><div class="adm-field"><span>' . e($label) . '</span><p>' . ($cur !== '' ? '<a href="' . e(media_url($cur)) . '" target="_blank" rel="noopener">' . e(basename($cur)) . '</a>' : '<span class="adm-muted">nema</span>') . '</p></div>'
        . '<label class="adm-field" for="f-' . e($field) . '"><span>Zameni dokument</span><input type="file" name="' . e($field) . '" id="f-' . e($field) . '" accept="image/jpeg,image/png,image/webp,application/pdf"><small>PDF, JPG, PNG ili WebP, najviše ' . e(upload_max_label()) . '.</small>' . adm_error($errors, $field) . '</label></div>';
};
?>
<h1 class="adm-h1">Kontakt</h1>
<p class="adm-lead">Podaci se prikazuju na strani <a href="<?= e(url('kontakt.html')) ?>" target="_blank" rel="noopener">Kontakt</a> i u zaglavlju, mobilnom meniju i futeru svih strana (srpski i engleski). Prevodi se upisuju posebno; brojevi, adrese i e-pošta su zajednički. Sve se čuva kao običan tekst — HTML se ne prikazuje.</p>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'kontakt', 'a' => 'save'])) ?>" class="adm-form" enctype="multipart/form-data" novalidate>
  <?= csrf_field() ?>

  <?= adm_fieldset('Opšte',
      adm_input('footer_email', $s['footer_email'] ?? '', KONTAKT_SETTINGS['footer_email'][0], $errors, ['type' => 'email', 'maxlength' => 190, 'required' => true, 'hint' => 'Forma upita na strani Kontakt ne šalje ništa na server: otvara program za e-poštu posetioca sa popunjenom porukom za ovu adresu.'])
      . '<div class="adm-row">'
      . adm_input('facebook_url', $s['facebook_url'] ?? '', KONTAKT_SETTINGS['facebook_url'][0], $errors, ['type' => 'url', 'maxlength' => 255, 'spellcheck' => 'false', 'placeholder' => 'https://www.facebook.com/…', 'hint' => 'Samo https://www.facebook.com/…; prazno = bez ikone i reda „Facebook“.'])
      . adm_input('facebook_label', $s['facebook_label'] ?? '', KONTAKT_SETTINGS['facebook_label'][0], $errors, ['maxlength' => 255])
      . '</div>') ?>

  <?php $hourRow = static fn(string $day, string $o, string $c, bool $req) => '<div class="adm-row">'
      . adm_input($o, $s[$o] ?? '', $day . ' — otvara se (sat)', $errors, ['type' => 'number', 'min' => 0, 'max' => 23, 'required' => $req] + ($req ? [] : ['hint' => 'Prazno = ne radi.']))
      . adm_input($c, $s[$c] ?? '', $day . ' — zatvara se (sat)', $errors, ['type' => 'number', 'min' => 1, 'max' => 24, 'required' => $req])
      . '</div>'; ?>
  <?= adm_fieldset('Radno vreme',
      $hourRow('Ponedeljak–petak', 'open_hour', 'close_hour', true)
      . $hourRow('Subota', 'sat_open_hour', 'sat_close_hour', false)
      . $hourRow('Nedelja', 'sun_open_hour', 'sun_close_hour', false)
      . '<p class="adm-muted">Na sajtu sada piše: <strong>' . e(hours_text($s, 'sr')) . '</strong> / <strong>' . e(hours_text($s, 'en')) . '</strong></p>',
      'Celi sati, po beogradskom vremenu. Iz ovih sati se prave tekst radnog vremena na sajtu (srpski i engleski), podaci za pretraživače i oznaka „Otvoreno / Zatvoreno“ u futeru. Otvoreno je od sata otvaranja do sata zatvaranja (npr. 7–16 = od 07:00 do 16:00).') ?>

  <?php foreach ($locs as $i => $loc): $id = (int) $loc['id']; $nm = static fn(string $k): string => 'loc[' . $id . '][' . $k . ']'; ?>
  <fieldset class="adm-set" id="<?= e('f-' . $nm('phones')) ?>">
    <legend>Lokacija: <?= e($loc['title_sr'] !== '' ? $loc['title_sr'] : $loc['slug']) ?></legend>
    <?php if ($i === 0): ?><p class="adm-muted adm-set__hint">Prva lokacija daje glavni telefon (prvi u listi) i adresu u zaglavlju i mobilnom meniju; uz nju stoji i radno vreme na strani Kontakt.</p><?php endif; ?>
    <?= $locPair($loc, 'title', KONTAKT_LOC_I18N['title'][0], $errors, 120) ?>
    <?= $locPair($loc, 'short_name', KONTAKT_LOC_I18N['short_name'][0], $errors, 60) ?>
    <div class="adm-row">
      <?= adm_input($nm('street'), $loc['street'] ?? '', 'Ulica i broj', $errors, ['maxlength' => 120]) ?>
      <?= adm_input($nm('postal_code'), $loc['postal_code'] ?? '', 'Poštanski broj', $errors, ['maxlength' => 10]) ?>
      <?= adm_input($nm('place'), $loc['place'] ?? '', 'Mesto', $errors, ['maxlength' => 60]) ?>
    </div>
    <?= $locPair($loc, 'city', 'Grad', $errors, 60) ?>
    <?= $locPair($loc, 'purpose', KONTAKT_LOC_I18N['purpose'][0], $errors, 255) ?>
    <?= adm_textarea($nm('emails'), $loc['emails'] ?? '', 'E-pošta lokacije', $errors, ['rows' => 3, 'hint' => 'Jedna adresa po redu; prazno = bez reda „E-pošta“.']) ?>
    <div class="adm-row">
      <?= adm_input($nm('map_query'), $loc['map_query'] ?? '', 'Mapa — koordinate ili adresa', $errors, ['maxlength' => 255, 'spellcheck' => 'false', 'hint' => 'npr. 44.89779,20.27798 ili Kneza Paskača 16–18, Batajnica, Beograd; prazno = bez mape. Mapa (Google) se učitava tek na klik.']) ?>
      <?= adm_input($nm('sort_order'), $loc['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number']) ?>
    </div>
    <?= $locPair($loc, 'map_title', KONTAKT_LOC_I18N['map_title'][0], $errors, 255) ?>
    <?= adm_checkbox($nm('is_public'), (int) ($loc['is_public'] ?? 1) === 1, 'Prikazuje se kupcima (zaglavlje, futer, strana Kontakt, mapa)', ['hint' => 'Isključeno: lokacija, njena adresa, mapa i telefoni se ne prikazuju. Za lokaciju „direkcija“ adresa ostaje samo kao SEDIŠTE u podacima o firmi (zakonski podatak).']) ?><?= adm_error($errors, $nm('is_public')) ?>
    <?= adm_error($errors, $nm('phones')) ?>
    <div class="adm-table-wrap">
    <table class="adm-table adm-specs">
      <thead><tr><th scope="col" class="adm-col-order">#</th><th scope="col">Broj za poziv</th><th scope="col">Ispis — SR</th><th scope="col">Ispis — EN</th><th scope="col">Futer</th><th scope="col">„Zatražite ponudu“</th><th scope="col"><span class="adm-sr">Ukloni</span></th></tr></thead>
      <tbody>
        <?php foreach (array_values($loc['phones']) as $k => $p): ?><?= $phoneRow($id, $k, $p) ?><?php endforeach; ?>
        <?php for ($k = 0, $base = count($loc['phones']); $k < KONTAKT_PHONE_ROWS; $k++): ?><?= $phoneRow($id, $base + $k, ['sort_order' => ($base + $k + 1) * 10]) ?><?php endfor; ?>
      </tbody>
    </table>
    </div>
    <p class="adm-muted">Broj za poziv: međunarodni oblik bez razmaka (+381…). Ispis je tekst koji se vidi (npr. 063 850 30 00); prazan engleski ispis = srpski. „U futeru“ = broj u tabeli kontakata u dnu strane. Prazni redovi se ne čuvaju.</p>
  </fieldset>
  <?php endforeach; ?>
  <?php if (!$locs): ?><p class="adm-flash adm-flash--warning">U bazi nema lokacija — uvezite database/002-existing-content.sql.</p><?php endif; ?>

  <?= adm_fieldset('Podaci o firmi',
      '<div class="adm-row">'
      . adm_input('company_name', $s['company_name'] ?? '', 'Naziv firme', $errors, ['maxlength' => 255])
      . adm_input('director', $s['director'] ?? '', 'Direktor', $errors, ['maxlength' => 120])
      . '</div>'
      . adm_input('company_legal_name', $s['company_legal_name'] ?? '', 'Pun naziv', $errors, ['maxlength' => 500])
      . '<div class="adm-row">'
      . adm_input('pib', $s['pib'] ?? '', 'PIB', $errors, ['maxlength' => 20, 'hint' => 'Prikazuje se i u futeru.'])
      . adm_input('registration_no', $s['registration_no'] ?? '', 'Matični broj', $errors, ['maxlength' => 20])
      . adm_input('activity_code', $s['activity_code'] ?? '', 'Šifra delatnosti', $errors, ['maxlength' => 10])
      . '</div>'
      . adm_pair('vat', $s, 'PDV — tekst', $errors, 'input', ['maxlength' => 255])
      . $doc('vat_certificate_path', 'vat_certificate_file', 'PDV potvrda')
      . $doc('vat_record_path', 'vat_record_file', 'PDV evidencija')
      . '<div class="adm-row">'
      . adm_input('bank_name', $s['bank_name'] ?? '', 'Banka', $errors, ['maxlength' => 120])
      . adm_input('bank_account', $s['bank_account'] ?? '', 'Tekući račun', $errors, ['maxlength' => 60])
      . '</div>'
      . adm_pair('activity', $s, 'Delatnost', $errors, 'input', ['maxlength' => 255])
      . adm_pair('founded', $s, 'Osnovano', $errors, 'input', ['maxlength' => 255]),
      'Blok „Podaci o firmi“ na strani Kontakt; prazno polje = red se ne prikazuje.') ?>

  <?= adm_fieldset('Odeljak „Lokacije“ na strani Kontakt',
      adm_pair('locations_heading', $s, 'Naslov', $errors, 'input', ['maxlength' => 255])
      . adm_pair('locations_intro', $s, 'Uvod', $errors, 'textarea', ['rows' => 4, 'maxlength' => 2000])) ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
  </div>
</form>
