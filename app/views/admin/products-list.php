<?php
/* Lista proizvoda. Ulaz: $rows, $cats, $filterCat, $q */
defined('TRICOM') || exit;
$back = admin_url('', array_filter(['m' => 'proizvodi', 'cat' => $filterCat, 'q' => $q]));
?>
<div class="adm-head">
  <h1 class="adm-h1">Proizvodi</h1>
  <a class="adm-btn" href="<?= e(admin_url('', array_filter(['m' => 'proizvodi', 'a' => 'new', 'cat' => $filterCat]))) ?>">Novi proizvod</a>
</div>

<form method="get" action="<?= e(admin_url()) ?>" class="adm-filter" role="search">
  <input type="hidden" name="m" value="proizvodi">
  <?= adm_select('cat', $filterCat ?? '', 'Kategorija', ['' => 'Sve kategorije'] + array_column($cats, 'path', 'id')) ?>
  <?= adm_input('q', $q, 'Pretraga (naziv ili slug)', [], ['type' => 'search', 'maxlength' => 100]) ?>
  <button type="submit" class="adm-btn adm-btn--ghost">Prikaži</button>
</form>

<form method="post" action="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'order'])) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="back" value="<?= e($back) ?>">
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col" class="adm-col-order">Redosled</th><th scope="col"><span class="adm-sr">Slika</span></th><th scope="col">Naziv (SR / EN)</th><th scope="col">Primarna kategorija</th><th scope="col">Prikaz u tabovima</th><th scope="col" class="adm-num">Teh. podaci</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled: <?= e($r['title_sr']) ?>"></td>
        <td><?= adm_image_preview((string) $r['image_type'], $r['render_key'], $r['illu_key'], $r['photo_path']) ?></td>
        <td><strong><?= e($r['title_sr']) ?></strong> <code class="adm-muted"><?= e($r['slug']) ?></code><br>
          <span class="adm-muted" lang="en"><?= $r['title_en'] !== '' ? e($r['title_en']) : '<em>nema engleskog naziva</em>' ?></span></td>
        <td><?= e($r['cat_name']) ?></td>
        <td><?= $r['listed_in'] ? e($r['listed_in']) : '<span class="adm-muted">nije u tabu</span>' ?></td>
        <td class="adm-num"><?= (int) $r['spec_count'] ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljiv</span>' : '<span class="adm-badge">sakriven</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <?php if ((int) $r['is_active'] === 1): ?><a href="<?= e(adm_product_public_url($r['slug'])) ?>" target="_blank" rel="noopener">Sajt ↗</a><?php endif; ?>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?>
      <tr><td colspan="8">Nema proizvoda za izabrani filter.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
  </div>
  <p class="adm-muted">Redosled određuje raspored u modalnim karticama i podrazumevani raspored; raspored kartica u tabu se podešava u samom proizvodu („Prikaz u tabovima“).</p>
  <?php if ($rows): ?><button type="submit" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button><?php endif; ?>
</form>
