<?php
/* Forma kategorije galerije. Ulaz: $v, $errors, $existing */
defined('TRICOM') || exit;
$isNew = $existing === null;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cats'])) ?>">← Kategorije galerije</a></p>
<h1 class="adm-h1"><?= $isNew ? 'Nova kategorija galerije' : 'Izmena: ' . e($existing['name_sr']) ?></h1>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cat-save'])) ?>" class="adm-form adm-form--narrow" novalidate>
  <?= csrf_field() ?>
  <?php if (!$isNew): ?><input type="hidden" name="id" value="<?= (int) $existing['id'] ?>"><?php endif; ?>
  <?= $isNew
      ? adm_input('slug', $v['slug'] ?? '', 'Slug (oznaka filtera)', $errors, ['maxlength' => 60, 'spellcheck' => 'false', 'hint' => 'Mala slova, brojevi i crtice; ne može se kasnije menjati. Prazno = predlog iz srpskog naziva.'])
      : '<div class="adm-field"><span>Slug (oznaka filtera)</span><p><code>' . e($existing['slug']) . '</code> <small class="adm-muted">ne menja se</small></p></div>' ?>
  <?= adm_pair('name', $v, 'Naziv (dugme filtera i oznaka na pločici)', $errors, 'input', ['maxlength' => 120, 'required' => true]) ?>
  <div class="adm-row">
    <?= adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number']) ?>
    <?= adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljiva na sajtu') ?>
  </div>
  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cats'])) ?>">Odustani</a>
  </div>
</form>
