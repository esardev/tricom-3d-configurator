<?php
/* Potvrda brisanja proizvoda. Ulaz: $p, $listings, $refs, $mentions, $errors */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'edit', 'id' => (int) $p['id']])) ?>">← Nazad na proizvod</a></p>
<h1 class="adm-h1">Brisanje proizvoda „<?= e($p['title_sr']) ?>“</h1>
<?= adm_error_summary($errors) ?>
<ul class="adm-list">
  <li>Brišu se proizvod, njegovi tehnički podaci i kartice u tabovima<?= $listings ? ' (' . e(implode(', ', array_column($listings, 'name_sr'))) . ')' : '' ?>.</li>
  <li>Adrese <code>detalji/<?= e($p['slug']) ?>.html</code> i <code>en/details/<?= e($p['slug']) ?>.html</code> posle brisanja vraćaju 404.</li>
  <?php if ($refs): ?>
    <li>Uklanja se iz „Srodno“ kod: <?= e(implode(', ', array_map(static fn($r) => $r['title_sr'] . ' (' . $r['kind'] . ')', $refs))) ?>.</li>
  <?php endif; ?>
  <li>Otpremljeni fajlovi proizvoda brišu se samo ako ih ne koristi nijedan drugi zapis; postojeće slike sajta (assets/) se ne diraju.</li>
</ul>
<?php if ($mentions): ?>
  <p class="adm-flash adm-flash--warning" role="status">Proizvod ima i stalnu pločicu na strani (tekst pločice nije iz baze): <?= e(implode(', ', $mentions)) ?>. Posle brisanja se ta pločica više ne prikazuje, kao i kad je proizvod sakriven; vraća se samo ako se ponovo napravi proizvod sa istim slugom. Razmislite da proizvod umesto brisanja sakrijete.</p>
<?php endif; ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'delete'])) ?>" class="adm-form adm-form--narrow">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
  <?= adm_checkbox('confirm', false, 'Razumem — proizvod se trajno briše.') ?>
  <?= adm_error($errors, 'confirm') ?>
  <div class="adm-acts">
    <button type="submit" class="adm-btn adm-btn--danger">Obriši proizvod</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'edit', 'id' => (int) $p['id']])) ?>">Odustani</a>
  </div>
</form>
