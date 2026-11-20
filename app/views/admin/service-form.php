<?php
/* Forma usluge / mogućnosti plazme. Ulaz: $v, $specs, $errors, $existing, $renders, $illus, $drawings, $known */
defined('TRICOM') || exit;
$isNew = $existing === null;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'usluge'])) ?>">← Usluge</a></p>
<div class="adm-head">
  <h1 class="adm-h1"><?= $isNew ? 'Nova usluga' : 'Izmena: ' . e($existing['title_sr']) ?></h1>
  <?php if (!$isNew && (int) $existing['is_active'] === 1): ?>
    <p class="adm-links"><a href="<?= e(adm_product_public_url($existing['slug'])) ?>" target="_blank" rel="noopener">Strana (SR) ↗</a> <a href="<?= e(adm_product_public_url($existing['slug'], 'en')) ?>" target="_blank" rel="noopener">Strana (EN) ↗</a></p>
  <?php endif; ?>
</div>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'save'])) ?>" class="adm-form" enctype="multipart/form-data" novalidate>
  <?= csrf_field() ?>
  <?php if (!$isNew): ?><input type="hidden" name="id" value="<?= (int) $existing['id'] ?>"><?php endif; ?>

  <?= adm_fieldset('Osnovno',
      ($isNew
        ? adm_input('slug', $v['slug'] ?? '', 'Slug (adresa strane)', $errors, ['maxlength' => 120, 'spellcheck' => 'false', 'hint' => 'Postaje detalji/slug.html i en/details/slug.html; ne može se kasnije menjati. Prazno = predlog iz srpskog naziva (đ → dj).'])
        : '<div class="adm-field"><span>Slug (adresa strane)</span><p><code>detalji/' . e($existing['slug']) . '.html</code> · <code>en/details/' . e($existing['slug']) . '.html</code> <small class="adm-muted">ne menja se</small></p></div>')
      . '<div class="adm-row">'
      . adm_select('kind', $v['kind'] ?? 'service', 'Vrsta', SVC_KINDS, $errors, ['hint' => 'Usluga: lista na strani Usluge, putanja „Usluge“. Mogućnost: putanja „CNC plazma“.'])
      . adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljiva na sajtu', ['hint' => 'Sakrivena usluga: strana vraća 404, nema je u listi ni u „Srodno“.'])
      . '</div>'
      . adm_icon_picker('service', $v['icon_key'] ?? '', $errors, 'Ikona reda u listi „Sve usluge“ (ikone sa postojeće strane).')) ?>

  <?= adm_fieldset('Prikaz u listi „Sve usluge“', '<p class="adm-muted adm-set__hint">Red liste prikazuje naziv, sažetak i oznake: prva oznaka je istaknuta, druga je ispod nje (npr. „do 30 mm“ / „CNC plazma“).</p>') ?>

  <?php $cf = ['of' => 'usluge', 'calc' => false]; require __DIR__ . '/content-fields.php'; ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'usluge'])) ?>">Odustani</a>
    <?php if (!$isNew): ?><a class="adm-danger adm-acts__end" href="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'delete', 'id' => (int) $existing['id']])) ?>">Obriši uslugu</a><?php endif; ?>
  </div>
</form>
<script src="<?= e(asset_url('admin/assets/admin.js')) ?>" defer></script>
