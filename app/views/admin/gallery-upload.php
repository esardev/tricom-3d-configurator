<?php
/* Dodavanje više slika odjednom. Ulaz: $v, $errors, $cats */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'galerije'])) ?>">← Galerija</a></p>
<h1 class="adm-h1">Dodavanje slika</h1>
<p class="adm-lead">Izaberite jednu ili više fotografija (JPG, PNG ili WebP, najviše <?= e(upload_max_label()) ?> po fajlu i <?= gal_max_files() ?> fajlova odjednom, ukupno do <?= e(number_format(ini_bytes((string) ini_get('post_max_size')) / 1048576, 0, ',', '.')) ?> MB po slanju). Opis upisan ovde dobijaju sve slike; posle otpremanja svaku sliku možete posebno urediti.</p>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'upload'])) ?>" class="adm-form" enctype="multipart/form-data" novalidate>
  <?= csrf_field() ?>
  <?= adm_fieldset('Slike',
      adm_select('category_id', $v['category_id'] ?? '', 'Kategorija', ['' => '— izaberite —'] + array_column($cats, 'name_sr', 'id'), $errors)
      . '<label class="adm-field" for="f-photos"><span>Fotografije</span><input type="file" name="photos[]" id="f-photos" accept="image/jpeg,image/png,image/webp" multiple><small>Tip se proverava na serveru; fajlovi dobijaju nasumična imena. Ako server to podržava, prave se i umanjene verzije za mrežu.</small>' . adm_error($errors, 'photos') . '</label>'
      . (isset($errors['_files']) ? '<p class="adm-note">' . e($errors['_files']) . '</p>' : '')) ?>

  <?= adm_fieldset('Opis (srpski i engleski)',
      adm_pair('caption', $v, 'Opis (natpis i tekst uvećanog prikaza)', $errors, 'input', ['maxlength' => 255])
      . adm_pair('alt', $v, 'Opis slike za čitače ekrana (alt)', $errors, 'input', ['maxlength' => 255, 'hint' => 'Prazno = opis.'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Odmah vidljive na sajtu', ['hint' => 'Slike bez opisa (SR) ostaju sakrivene dok ga ne upišete.'])) ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Otpremi</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'galerije'])) ?>">Odustani</a>
  </div>
</form>
