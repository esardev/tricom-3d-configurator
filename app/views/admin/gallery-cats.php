<?php
/* Kategorije galerije (filteri). Ulaz: $rows */
defined('TRICOM') || exit;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'galerije'])) ?>">← Galerija</a></p>
<div class="adm-head">
  <h1 class="adm-h1">Kategorije galerije</h1>
  <a class="adm-btn" href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cat-new'])) ?>">Nova kategorija</a>
</div>
<p class="adm-lead">Svaka kategorija je jedno dugme filtera na strani Galerija (posle „Sve“) i oznaka na pločici. Prikazuju se samo vidljive kategorije koje imaju bar jednu vidljivu sliku; slike sakrivene kategorije se ne prikazuju.</p>

<form method="post" action="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cat-order'])) ?>">
  <?= csrf_field() ?>
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col" class="adm-col-order">Redosled</th><th scope="col">Naziv (SR / EN)</th><th scope="col">Slug</th><th scope="col" class="adm-num">Slika</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled: <?= e($r['name_sr']) ?>"></td>
        <td><strong><?= e($r['name_sr']) ?></strong><br><span class="adm-muted" lang="en"><?= $r['name_en'] !== '' ? e($r['name_en']) : '<em>nema prevoda</em>' ?></span></td>
        <td><code><?= e($r['slug']) ?></code></td>
        <td class="adm-num"><?= (int) $r['image_count'] ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljiva</span>' : '<span class="adm-badge">sakrivena</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cat-edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <a href="<?= e(admin_url('', ['m' => 'galerije', 'cat' => (int) $r['id']])) ?>">Slike</a>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'galerije', 'a' => 'cat-delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
  <?php if ($rows): ?><button type="submit" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button><?php endif; ?>
</form>
