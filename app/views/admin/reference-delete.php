<?php
/* Potvrda brisanja reference. Ulaz: $r, $mentions, $errors */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'reference', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">← Nazad na referencu</a></p>
<h1 class="adm-h1">Brisanje reference „<?= e($r['title_sr']) ?>“</h1>
<?= adm_error_summary($errors) ?>
<ul class="adm-list">
  <li>Referenca nestaje sa strane Reference (srpske i engleske) i više se ne otvara.</li>
  <li>Otpremljena fotografija se briše samo ako je ne koristi nijedan drugi zapis; postojeće slike sajta (assets/) se ne diraju.</li>
</ul>
<?php if ($mentions): ?>
  <p class="adm-flash adm-flash--warning" role="status">Referenca se pominje i u stalnom tekstu strane: <?= e(implode(', ', $mentions)) ?>. Taj tekst ostaje, ali se više ne otvara.</p>
<?php endif; ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'reference', 'a' => 'delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
  <?= adm_checkbox('confirm', false, 'Razumem — referenca se trajno briše. Umesto toga može i da se sakrije.') ?>
  <?= adm_error($errors, 'confirm') ?>
  <div class="adm-acts">
    <button type="submit" class="adm-btn adm-btn--danger">Obriši referencu</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'reference', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Odustani</a>
  </div>
</form>
