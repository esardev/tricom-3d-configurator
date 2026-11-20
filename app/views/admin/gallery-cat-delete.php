<?php
/* Potvrda brisanja kategorije galerije. Ulaz: $cat, $count, $targets, $errors */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cats'])) ?>">← Kategorije galerije</a></p>
<h1 class="adm-h1">Brisanje kategorije „<?= e($cat['name_sr']) ?>“</h1>
<?= adm_error_summary($errors) ?>
<?php if ($count > 0 && !$targets): ?>
  <p class="adm-flash adm-flash--warning" role="status">Ovo je jedina kategorija, a ima <?= $count ?> slika. Slike se ne brišu sa kategorijom — prvo napravite drugu kategoriju ili kategoriju sakrijte.</p>
<?php else: ?>
<p class="adm-lead">Briše se dugme filtera „<?= e($cat['name_sr']) ?>“.<?= $count > 0 ? ' Kategorija ima ' . $count . ' slika; one se ne brišu, nego se premeštaju u kategoriju koju izaberete.' : ' Kategorija nema slika.' ?></p>
<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cat-delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $cat['id'] ?>">
  <?php if ($count > 0): ?>
    <?= adm_select('target', '', 'Premesti slike u', ['' => '— izaberite —'] + array_column($targets, 'name_sr', 'id'), $errors) ?>
  <?php endif; ?>
  <?= adm_checkbox('confirm', false, 'Razumem — kategorija se trajno briše.') ?>
  <?= adm_error($errors, 'confirm') ?>
  <div class="adm-acts">
    <button type="submit" class="adm-btn adm-btn--danger">Obriši kategoriju</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cats'])) ?>">Odustani</a>
  </div>
</form>
<?php endif; ?>
