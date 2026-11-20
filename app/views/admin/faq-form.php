<?php
/* Forma pitanja. Ulaz: $v, $errors, $existing */
defined('TRICOM') || exit;
$isNew = $existing === null;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'pitanja'])) ?>">← Česta pitanja</a></p>
<h1 class="adm-h1"><?= $isNew ? 'Novo pitanje' : 'Izmena pitanja' ?></h1>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'save'])) ?>" class="adm-form" novalidate>
  <?= csrf_field() ?>
  <?php if (!$isNew): ?><input type="hidden" name="id" value="<?= (int) $existing['id'] ?>"><?php endif; ?>

  <?= adm_fieldset('Pitanje i odgovor (srpski i engleski)',
      adm_pair('question', $v, 'Pitanje', $errors, 'input', ['maxlength' => FAQ_LIMITS['question'], 'required' => true])
      . adm_pair('answer', $v, 'Odgovor', $errors, 'textarea', ['rows' => 6, 'maxlength' => FAQ_LIMITS['answer'], 'hint' => 'Običan tekst; pasusi se odvajaju praznim redom.'])) ?>

  <?= adm_fieldset('Prikaz',
      '<div class="adm-row">'
      . adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljivo na sajtu')
      . '</div>') ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'pitanja'])) ?>">Odustani</a>
    <?php if (!$isNew): ?><a class="adm-danger adm-acts__end" href="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'delete', 'id' => (int) $existing['id']])) ?>">Obriši pitanje</a><?php endif; ?>
  </div>
</form>
