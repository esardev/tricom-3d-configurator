<?php
/* Lista slika galerije. Ulaz: $rows, $cats, $filterCat */
defined('TRICOM') || exit;
$back = admin_url('', array_filter(['m' => 'galerije', 'cat' => $filterCat]));
?>
<div class="adm-head">
  <h1 class="adm-h1">Galerija</h1>
  <p class="adm-links"><a href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cats'])) ?>">Kategorije (filteri)</a> <a class="adm-btn" href="<?= e(admin_url('', array_filter(['m' => 'galerije', 'a' => 'upload', 'cat' => $filterCat]))) ?>">Dodaj slike</a></p>
</div>
<p class="adm-lead">Slike se prikazuju na strani <a href="<?= e(url('galerija.html')) ?>" target="_blank" rel="noopener">Galerija</a> redom kao ovde; filteri su kategorije. Klik na sliku otvara uvećan prikaz sa opisom.</p>

<form method="get" action="<?= e(admin_url()) ?>" class="adm-filter" role="search">
  <input type="hidden" name="m" value="galerije">
  <?= adm_select('cat', $filterCat ?? '', 'Kategorija', ['' => 'Sve kategorije'] + array_column($cats, 'name_sr', 'id')) ?>
  <button type="submit" class="adm-btn adm-btn--ghost">Prikaži</button>
</form>

<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'bulk'])) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="back" value="<?= e($back) ?>">
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col"><span class="adm-sr">Označi</span></th><th scope="col" class="adm-col-order">Redosled</th><th scope="col"><span class="adm-sr">Slika</span></th><th scope="col">FIG.</th><th scope="col">Opis (SR / EN)</th><th scope="col">Kategorija</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input type="checkbox" name="sel[]" value="<?= (int) $r['id'] ?>" aria-label="Označi sliku <?= e($r['fig_no']) ?>"></td>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled slike <?= e($r['fig_no']) ?>"></td>
        <td><?= adm_image_preview((string) $r['image_type'], $r['render_key'], null, $r['photo_path']) ?></td>
        <td><code><?= e($r['fig_no']) ?></code></td>
        <td><?= $r['caption_sr'] !== '' ? e($r['caption_sr']) : '<span class="adm-badge">bez opisa</span>' ?><br>
          <span class="adm-muted" lang="en"><?= $r['caption_en'] !== '' ? e($r['caption_en']) : '<em>nema engleskog opisa</em>' ?></span></td>
        <td><?= e($r['cat_name']) ?><?= (int) $r['cat_active'] === 1 ? '' : ' <small class="adm-muted">(sakrivena)</small>' ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljiva</span>' : '<span class="adm-badge">sakrivena</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?>
      <tr><td colspan="8">Nema slika za izabranu kategoriju.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
  </div>
  <?php if ($rows): ?>
    <div class="adm-acts">
      <button type="submit" name="do" value="order" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button>
      <button type="submit" name="do" value="delete" class="adm-btn adm-btn--ghost adm-danger">Obriši označene…</button>
    </div>
  <?php endif; ?>
</form>
