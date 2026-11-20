<?php
/* Forma reference. Ulaz: $v, $errors, $existing, $renders */
defined('TRICOM') || exit;
$isNew = $existing === null;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'reference'])) ?>">← Reference</a></p>
<div class="adm-head">
  <h1 class="adm-h1"><?= $isNew ? 'Nova referenca' : 'Izmena: ' . e($existing['title_sr']) ?></h1>
  <?php if (!$isNew && (int) $existing['is_active'] === 1): ?>
    <p class="adm-links"><a href="<?= e(url('reference.html') . '#item=' . $existing['slug']) ?>" target="_blank" rel="noopener">Na sajtu (SR) ↗</a> <a href="<?= e(url('en/references.html') . '#item=' . $existing['slug']) ?>" target="_blank" rel="noopener">Na sajtu (EN) ↗</a></p>
  <?php endif; ?>
</div>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'reference', 'a' => 'save'])) ?>" class="adm-form" enctype="multipart/form-data" novalidate>
  <?= csrf_field() ?>
  <?php if (!$isNew): ?><input type="hidden" name="id" value="<?= (int) $existing['id'] ?>"><?php endif; ?>

  <?= adm_fieldset('Osnovno',
      ($isNew
        ? adm_input('slug', $v['slug'] ?? '', 'Slug (oznaka kartice)', $errors, ['maxlength' => 120, 'spellcheck' => 'false', 'hint' => 'Koristi se za otvaranje kartice (reference.html#item=slug); ne može se kasnije menjati. Prazno = ref- + srpski naziv.'])
        : '<div class="adm-field"><span>Slug (oznaka kartice)</span><p><code>' . e($existing['slug']) . '</code> <small class="adm-muted">ne menja se</small></p></div>')
      . '<div class="adm-row">'
      . adm_select('ref_type', $v['ref_type'] ?? 'project', 'Vrsta (mesto na strani)', REF_TYPES, $errors)
      . adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljiva na sajtu', ['hint' => 'Sakrivena referenca se ne prikazuje i ne otvara.'])
      . '</div>'
      . '<p class="adm-muted adm-set__hint">Vrsta zahtevnosti: kartica sa ikonom, slikom, naslovom i tekstom. Vrsta radova: naslov i tekst. Objekat: naslov, tekst i kratka oznaka u listi objekata.</p>') ?>

  <?= adm_fieldset('Sadržaj (srpski i engleski)',
      adm_pair('title', $v, 'Naziv (objekat, partner ili vrsta posla)', $errors, 'input', ['maxlength' => 255, 'required' => true])
      . adm_pair('summary', $v, 'Tekst', $errors, 'textarea', ['rows' => 4, 'maxlength' => 3000, 'hint' => 'Pasusi se odvajaju praznim redom.'])
      . '<p class="adm-note">Naglašen deo teksta na kartici: &lt;strong&gt;reč&lt;/strong&gt; (ostale oznake se prikazuju kao tekst; u prozoru se prikazuje bez naglašavanja).</p>'
      . adm_pair('label', $v, 'Oznaka (npr. „32 t BAKRA · 48 DANA“)', $errors, 'input', ['maxlength' => 120, 'hint' => 'Prikazuje se u listi objekata i u prozoru reference; prazno = bez oznake.'])) ?>

  <?= adm_fieldset('Slika i ikona',
      '<div class="adm-radios" role="radiogroup" aria-label="Vrsta slike">'
      . implode('', array_map(static fn($t, $lab) => '<label class="adm-check"><input type="radio" name="image_type" value="' . $t . '"' . (($v['image_type'] ?? 'none') === $t ? ' checked' : '') . '> ' . e($lab) . '</label>',
          ['render', 'photo', 'none'], ['Render (postojeći 3D prikaz)', 'Fotografija (otpremanje)', 'Bez slike']))
      . '</div>' . adm_error($errors, 'image_type')
      . '<div class="adm-row">' . adm_select('render_key', $v['render_key'] ?? '', 'Render', ['' => '—'] + $renders, $errors, ['hint' => 'assets/render/<ključ>-light|dark']) . '</div>'
      . '<div class="adm-row adm-row--start"><div class="adm-field"><span>Trenutna slika</span>' . adm_image_preview((string) ($v['image_type'] ?? 'none'), $v['render_key'] ?? null, null, $v['photo_path'] ?? null) . '</div>'
      . '<label class="adm-field" for="f-photo_file"><span>Nova fotografija</span><input type="file" name="photo_file" id="f-photo_file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG ili WebP, najviše ' . e(upload_max_label()) . '. Koristi se kada je izabrana vrsta „Fotografija“.</small>' . adm_error($errors, 'photo_file') . '</label></div>'
      . (isset($errors['_files']) ? '<p class="adm-note">' . e($errors['_files']) . '</p>' : '')
      . adm_pair('image_alt', $v, 'Opis slike (alt)', $errors, 'input', ['maxlength' => 255, 'hint' => 'Prazno = naziv.'])
      . adm_icon_picker('reference', $v['icon_key'] ?? '', $errors, 'Ikona na kartici vrste zahtevnosti (ikone sa postojeće strane).'),
      'Slika i ikona se na strani prikazuju na karticama vrste zahtevnosti; slika se prikazuje i u prozoru reference.') ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'reference'])) ?>">Odustani</a>
    <?php if (!$isNew): ?><a class="adm-danger adm-acts__end" href="<?= e(admin_url('', ['m' => 'reference', 'a' => 'delete', 'id' => (int) $existing['id']])) ?>">Obriši referencu</a><?php endif; ?>
  </div>
</form>
