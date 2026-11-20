<?php
/* Potvrda brisanja kategorije. Ulaz: $cat, $primary, $listed, $others, $errors */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'kategorije'])) ?>">← Kategorije proizvoda</a></p>
<h1 class="adm-h1">Brisanje kategorije „<?= e($cat['name_sr']) ?>“</h1>
<?= adm_error_summary($errors) ?>

<ul class="adm-list">
  <li><?= ($cat['parent_id'] ?? null) === null ? 'Tab' : 'Program / podgrupa' ?> <code><?= e(site_category_href('proizvodi.html', 'sr', $cat)) ?></code><?= ($cat['parent_id'] ?? null) === null ? ' i stavka u podmeniju nestaju' : ' nestaje' ?> sa sajta.</li>
  <li>Kartica u ovom tabu: <strong><?= (int) $listed ?></strong> — uklanjaju se samo kartice; proizvodi ostaju.</li>
  <li>Proizvoda kojima je ovo primarna kategorija: <strong><?= count($primary) ?></strong><?= $primary ? ' — moraju preći u drugu kategoriju (proizvodi se ne brišu).' : '.' ?></li>
</ul>

<?php if ($primary): ?>
  <details class="adm-details"><summary>Proizvodi koji se premeštaju (<?= count($primary) ?>)</summary>
    <ul class="adm-list"><?php foreach ($primary as $p): ?><li><?= e($p['title_sr']) ?> <code><?= e($p['slug']) ?></code></li><?php endforeach; ?></ul>
  </details>
<?php endif; ?>

<?php if (!empty($errors['children'])): ?>
  <p class="adm-muted">Podkategorije se premeštaju u formi svake od njih (polje „Nadređena kategorija“).</p>
<?php elseif ($primary && !$others): ?>
  <p class="adm-flash adm-flash--warning" role="status">Ovo je jedina kategorija, a ima proizvode. Napravite drugu kategoriju ili sakrijte ovu (Izmeni → „Vidljiva na sajtu“).</p>
<?php else: ?>
  <form method="post" action="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'delete'])) ?>" class="adm-form adm-form--narrow">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int) $cat['id'] ?>">
    <?php if ($primary): ?>
      <?= adm_select('target', $_POST['target'] ?? '', 'Premesti proizvode u kategoriju', ['' => '— izaberite —'] + array_column($others, 'path', 'id'), $errors) ?>
    <?php endif; ?>
    <?= adm_checkbox('confirm', false, 'Razumem — kategorija se trajno briše.') ?>
    <?= adm_error($errors, 'confirm') ?>
    <div class="adm-acts">
      <button type="submit" class="adm-btn adm-btn--danger">Obriši kategoriju</button>
      <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'kategorije'])) ?>">Odustani</a>
    </div>
  </form>
<?php endif; ?>
