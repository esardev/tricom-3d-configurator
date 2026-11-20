<?php
/* Izmena jedne slike galerije. Ulaz: $v, $errors, $existing, $cats, $renders */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'galerije', 'cat' => (int) $existing['category_id']])) ?>">← Galerija</a></p>
<div class="adm-head">
  <h1 class="adm-h1">Slika FIG. <?= e($existing['fig_no']) ?></h1>
  <?php if ((int) $existing['is_active'] === 1): ?><p class="adm-links"><a href="<?= e(url('galerija.html') . '#item=' . $existing['slug']) ?>" target="_blank" rel="noopener">Na sajtu ↗</a></p><?php endif; ?>
</div>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'save'])) ?>" class="adm-form" enctype="multipart/form-data" novalidate>
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $existing['id'] ?>">

  <?= adm_fieldset('Opis (srpski i engleski)',
      adm_pair('caption', $v, 'Opis (natpis i tekst uvećanog prikaza)', $errors, 'input', ['maxlength' => 255])
      . adm_pair('alt', $v, 'Opis slike za čitače ekrana (alt)', $errors, 'input', ['maxlength' => 255, 'hint' => 'Prazno = opis.'])) ?>

  <?= adm_fieldset('Slika',
      '<div class="adm-radios" role="radiogroup" aria-label="Vrsta slike">'
      . implode('', array_map(static fn($t, $lab) => '<label class="adm-check"><input type="radio" name="image_type" value="' . $t . '"' . (($v['image_type'] ?? 'photo') === $t ? ' checked' : '') . '> ' . e($lab) . '</label>',
          ['photo', 'render'], ['Fotografija', 'Render (postojeći 3D prikaz, svetla i tamna tema)']))
      . '</div>' . adm_error($errors, 'image_type')
      . '<div class="adm-row adm-row--start"><div class="adm-field"><span>Trenutna slika</span>' . adm_image_preview((string) $existing['image_type'], $existing['render_key'], null, $existing['photo_path']) . '</div>'
      . '<label class="adm-field" for="f-photo_file"><span>Zameni fotografiju</span><input type="file" name="photo_file" id="f-photo_file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG ili WebP, najviše ' . e(upload_max_label()) . '.</small>' . adm_error($errors, 'photo_file') . '</label></div>'
      . '<div class="adm-row">'
      . adm_select('render_key', $v['render_key'] ?? '', 'Render', ['' => '—'] + $renders, $errors)
      . adm_select('crop_pos', $v['crop_pos'] ?? '', 'Isečak fotografije u mreži', GAL_POS, $errors, ['hint' => 'Koji deo fotografije ostaje vidljiv u pločici.'])
      . '</div>') ?>

  <?= adm_fieldset('Prikaz',
      '<div class="adm-row">'
      . adm_select('category_id', $v['category_id'] ?? '', 'Kategorija (filter)', array_column($cats, 'name_sr', 'id'), $errors)
      . adm_input('fig_no', $v['fig_no'] ?? '', 'Broj („FIG.“)', $errors, ['maxlength' => 10])
      . adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljiva na sajtu')
      . '</div>') ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'galerije', 'cat' => (int) $existing['category_id']])) ?>">Odustani</a>
    <a class="adm-danger adm-acts__end" href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'delete', 'id' => (int) $existing['id']])) ?>">Obriši sliku</a>
  </div>
</form>
