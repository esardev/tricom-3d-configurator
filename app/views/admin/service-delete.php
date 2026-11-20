<?php
/* Potvrda brisanja usluge. Ulaz: $s, $refs, $mentions, $errors */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'edit', 'id' => (int) $s['id']])) ?>">← Nazad na uslugu</a></p>
<h1 class="adm-h1">Brisanje usluge „<?= e($s['title_sr']) ?>“</h1>
<?= adm_error_summary($errors) ?>
<ul class="adm-list">
  <li>Brišu se usluga i njeni tehnički podaci<?= $s['kind'] === 'service' ? '; nestaje i njen red iz liste „Sve usluge“' : '' ?>.</li>
  <li>Adrese <code>detalji/<?= e($s['slug']) ?>.html</code> i <code>en/details/<?= e($s['slug']) ?>.html</code> posle brisanja vraćaju 404.</li>
  <?php if ($refs): ?>
    <li>Uklanja se iz „Srodno“ kod: <?= e(implode(', ', array_map(static fn($r) => $r['title_sr'] . ' (' . $r['kind'] . ')', $refs))) ?>.</li>
  <?php endif; ?>
  <li>Otpremljeni fajlovi usluge brišu se samo ako ih ne koristi nijedan drugi zapis; postojeće slike sajta (assets/) se ne diraju.</li>
</ul>
<?php if ($mentions): ?>
  <p class="adm-flash adm-flash--warning" role="status">Usluga ima i stalne pločice na strani (tekst pločica nije iz baze): <?= e(implode(', ', $mentions)) ?>. Posle brisanja se te pločice više ne prikazuju, kao i kad je usluga sakrivena; vraćaju se samo ako se ponovo napravi usluga sa istim slugom. Razmislite da uslugu umesto brisanja sakrijete.</p>
<?php endif; ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $s['id'] ?>">
  <?= adm_checkbox('confirm', false, 'Razumem — usluga se trajno briše.') ?>
  <?= adm_error($errors, 'confirm') ?>
  <div class="adm-acts">
    <button type="submit" class="adm-btn adm-btn--danger">Obriši uslugu</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'edit', 'id' => (int) $s['id']])) ?>">Odustani</a>
  </div>
</form>
