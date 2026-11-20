<?php
/* Potvrda brisanja jedne ili više slika. Ulaz: $rows, $errors, $single, ($back) */
defined('TRICOM') || exit;
$back = $back ?? admin_url('', ['m' => 'galerije']);
?>
<p class="adm-back"><a href="<?= e($back) ?>">← Galerija</a></p>
<h1 class="adm-h1"><?= $single ? 'Brisanje slike' : 'Brisanje označenih slika (' . count($rows) . ')' ?></h1>
<?= adm_error_summary($errors) ?>
<ul class="adm-list">
  <?php foreach ($rows as $r): ?>
    <li><?= adm_image_preview((string) $r['image_type'], $r['render_key'], null, $r['photo_path']) ?> FIG. <?= e($r['fig_no']) ?> — <?= $r['caption_sr'] !== '' ? e($r['caption_sr']) : '<em>bez opisa</em>' ?></li>
  <?php endforeach; ?>
</ul>
<p class="adm-muted">Slike nestaju iz galerije na oba jezika. Otpremljeni fajlovi se brišu samo ako ih ne koristi nijedan drugi zapis; postojeće slike sajta (assets/) i renderi se ne diraju.</p>
<?php if ($single): ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $rows[0]['id'] ?>">
<?php else: ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'bulk-delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="back" value="<?= e($back) ?>">
  <?php foreach ($rows as $r): ?><input type="hidden" name="ids[]" value="<?= (int) $r['id'] ?>"><?php endforeach; ?>
<?php endif; ?>
  <?= adm_checkbox('confirm', false, 'Razumem — ' . ($single ? 'slika se trajno briše.' : 'slike se trajno brišu.')) ?>
  <?= adm_error($errors, 'confirm') ?>
  <div class="adm-acts">
    <button type="submit" class="adm-btn adm-btn--danger"><?= $single ? 'Obriši sliku' : 'Obriši slike' ?></button>
    <a class="adm-btn adm-btn--ghost" href="<?= e($back) ?>">Odustani</a>
  </div>
</form>
