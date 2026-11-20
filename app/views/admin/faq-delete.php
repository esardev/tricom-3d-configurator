<?php
/* Potvrda brisanja pitanja. Ulaz: $f, $errors */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'edit', 'id' => (int) $f['id']])) ?>">← Nazad na pitanje</a></p>
<h1 class="adm-h1">Brisanje pitanja</h1>
<p class="adm-lead">„<?= e($f['question_sr']) ?>“ — pitanje i odgovor se brišu na oba jezika. Umesto brisanja pitanje može i da se sakrije.</p>
<?= adm_error_summary($errors) ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $f['id'] ?>">
  <?= adm_checkbox('confirm', false, 'Razumem — pitanje se trajno briše.') ?>
  <?= adm_error($errors, 'confirm') ?>
  <div class="adm-acts">
    <button type="submit" class="adm-btn adm-btn--danger">Obriši pitanje</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'edit', 'id' => (int) $f['id']])) ?>">Odustani</a>
  </div>
</form>
