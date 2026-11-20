<?php
/* Zajednički delovi forme proizvoda i usluge: sadržaj (SR | EN), tehnički podaci,
   slika, fabrički crtež, kalkulator (opciono) i srodno. Uključuje se iz
   product-form.php / service-form.php.
   Ulaz: $v, $specs, $errors, $renders, $illus, $drawings, $known,
         $cf = ['of' => 'proizvoda' | 'usluge', 'calc' => bool] */
defined('TRICOM') || exit;
$specRow = static function (int|string $i, array $s, int $order): string {
    $n = static fn(string $k): string => 'specs[' . $i . '][' . $k . ']';
    return '<tr class="adm-spec" data-spec>'
        . '<td><input class="adm-order" type="number" name="' . e($n('order')) . '" value="' . $order . '" aria-label="Redosled reda" data-spec-order></td>'
        . '<td><input type="text" name="' . e($n('label_sr')) . '" value="' . e($s['label_sr'] ?? '') . '" maxlength="255" lang="sr" aria-label="Oznaka — SR"></td>'
        . '<td><textarea name="' . e($n('value_sr')) . '" rows="1" maxlength="1000" lang="sr" aria-label="Vrednost — SR">' . e($s['value_sr'] ?? '') . '</textarea></td>'
        . '<td><input type="text" name="' . e($n('label_en')) . '" value="' . e($s['label_en'] ?? '') . '" maxlength="255" lang="en" aria-label="Oznaka — EN"></td>'
        . '<td><textarea name="' . e($n('value_en')) . '" rows="1" maxlength="1000" lang="en" aria-label="Vrednost — EN">' . e($s['value_en'] ?? '') . '</textarea></td>'
        . '<td class="adm-spec__acts"><button type="button" class="adm-icon" data-spec-up aria-label="Pomeri gore" hidden>↑</button><button type="button" class="adm-icon" data-spec-down aria-label="Pomeri dole" hidden>↓</button>'
        . '<label class="adm-check adm-check--sm"><input type="checkbox" name="' . e($n('delete')) . '" value="1"> ukloni</label></td></tr>';
};
?>
  <?= adm_fieldset('Sadržaj (srpski i engleski)',
      adm_pair('title', $v, 'Naziv', $errors, 'input', ['maxlength' => 255, 'required' => true])
      . adm_pair('summary', $v, 'Sažetak (podnaslov, opis za pretraživače, kartice)', $errors, 'textarea', ['rows' => 3, 'maxlength' => 1000])
      . adm_pair('description', $v, 'Opis', $errors, 'textarea', ['rows' => 8, 'maxlength' => 10000, 'hint' => 'Pasusi se odvajaju praznim redom.'])
      . adm_pair('tags', $v, 'Oznake', $errors, 'textarea', ['rows' => 3, 'maxlength' => 2000, 'hint' => 'Jedna oznaka po redu.'])
      . adm_pair('apps', $v, 'Primena („Gde se koristi“)', $errors, 'textarea', ['rows' => 4, 'maxlength' => 2000, 'hint' => 'Jedna stavka po redu.'])) ?>

  <fieldset class="adm-set" id="f-specs">
    <legend>Tehnički podaci</legend>
    <p class="adm-muted adm-set__hint">Tabela „Osnovni podaci“ na strani <?= e($cf['of']) ?>, redom kako je ovde. Jedinice i simboli se upisuju u vrednost (npr. 0,6–1 m · 1,080 mm). Kada je vrednost ista na oba jezika, engleska vrednost može ostati prazna. Prelom reda u vrednosti ostaje prelom reda.</p>
    <?= adm_error($errors, 'specs') ?>
    <div class="adm-table-wrap">
    <table class="adm-table adm-specs" data-specs>
      <thead><tr><th scope="col" class="adm-col-order">#</th><th scope="col">Oznaka — SR</th><th scope="col">Vrednost — SR</th><th scope="col">Oznaka — EN</th><th scope="col">Vrednost — EN</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
      <tbody data-spec-body>
        <?php foreach (array_values($specs) as $i => $s): ?><?= $specRow($i, $s, ($i + 1) * 10) ?><?php endforeach; ?>
        <?php for ($k = 0, $base = count($specs); $k < 3; $k++): ?><?= $specRow($base + $k, [], ($base + $k + 1) * 10) ?><?php endfor; ?>
      </tbody>
    </table>
    </div>
    <template data-spec-template><?= $specRow('__i__', [], 0) ?></template>
    <p><button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" data-spec-add hidden>Dodaj red</button> <span class="adm-muted">Prazni redovi se ne čuvaju.</span></p>
  </fieldset>

  <?= adm_fieldset('Slika ' . $cf['of'],
      '<div class="adm-radios" role="radiogroup" aria-label="Vrsta slike">'
      . implode('', array_map(static fn($t, $lab) => '<label class="adm-check"><input type="radio" name="image_type" value="' . $t . '"' . (($v['image_type'] ?? 'none') === $t ? ' checked' : '') . '> ' . e($lab) . '</label>',
          ['render', 'illu', 'photo', 'none'], ['Render (postojeći 3D prikaz)', 'Ilustracija (postojeći SVG)', 'Fotografija (otpremanje)', 'Bez slike']))
      . '</div>' . adm_error($errors, 'image_type')
      . '<div class="adm-row">'
      . adm_select('render_key', $v['render_key'] ?? '', 'Render', ['' => '—'] + $renders, $errors, ['hint' => 'assets/render/<ključ>-light|dark'])
      . adm_select('illu_key', $v['illu_key'] ?? '', 'Ilustracija', ['' => '—'] + $illus, $errors)
      . '</div>'
      . '<div class="adm-row adm-row--start"><div class="adm-field"><span>Trenutna slika</span>' . adm_image_preview((string) ($v['image_type'] ?? 'none'), $v['render_key'] ?? null, $v['illu_key'] ?? null, $v['photo_path'] ?? null) . '</div>'
      . '<label class="adm-field" for="f-photo_file"><span>Nova fotografija</span><input type="file" name="photo_file" id="f-photo_file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG ili WebP, najviše ' . e(upload_max_label()) . '. Koristi se kada je izabrana vrsta „Fotografija“.</small>' . adm_error($errors, 'photo_file') . '</label></div>'
      . adm_pair('image_alt', $v, 'Opis slike (alt)', $errors, 'input', ['maxlength' => 255, 'hint' => 'Prazno = naziv.'])) ?>

  <?= adm_fieldset('Fabrički crtež (dokument)',
      '<div class="adm-row">'
      . adm_select('drawing_path', $v['drawing_path'] ?? '', 'Postojeći crtež', ['' => '— bez crteža —'] + $drawings, $errors, ['hint' => 'Prikazuje se uz „Primena“ umesto slike.'])
      . '<label class="adm-field" for="f-drawing_file"><span>Novi crtež</span><input type="file" name="drawing_file" id="f-drawing_file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG ili WebP; zamenjuje izbor iznad.</small>' . adm_error($errors, 'drawing_file') . '</label>'
      . '</div>'
      . (isset($errors['_files']) ? '<p class="adm-note">' . e($errors['_files']) . '</p>' : '')) ?>

<?php if ($cf['calc']): ?>
  <?= adm_fieldset('Kalkulator i 3D konfigurator',
      '<div class="adm-row">'
      . adm_select('calc_id', $v['calc_id'] ?? '', 'Kalkulator na strani', ADM_CALCS, $errors, ['hint' => 'Dodaje odeljak „Kalkulator“ i dugme „Izračunaj“.'])
      . adm_select('calc_tabs', $v['calc_tabs'] ?? '', 'Tabovi kalkulatora', ADM_CALC_TABS, $errors)
      . adm_input('konf_hash', $v['konf_hash'] ?? '', 'Heš konfiguratora', $errors, ['maxlength' => 255, 'spellcheck' => 'false', 'placeholder' => 'o=dvovodni&p=tr35', 'hint' => 'Dugme „Vidi na objektu u 3D“; prazno = bez dugmeta.'])
      . '</div>') ?>
<?php endif; ?>

  <?= adm_fieldset('Srodno („Pogledajte i“)',
      adm_textarea('related', $v['related'] ?? '', 'Slugovi srodnih stavki', $errors, ['rows' => 5, 'hint' => 'Jedan slug po redu, redom prikaza; na strani se prikazuje najviše ' . SITE_REL_MAX . '.'])
      . '<details class="adm-details"><summary>Dostupni slugovi (' . count($known) . ')</summary><ul class="adm-slugs">'
      . implode('', array_map(static fn($s, $t) => '<li><code>' . e($s) . '</code> ' . e($t) . '</li>', array_keys($known), $known)) . '</ul></details>') ?>
