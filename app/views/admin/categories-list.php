<?php
/* Lista kategorija. Ulaz: $rows */
defined('TRICOM') || exit;
?>
<div class="adm-head">
  <h1 class="adm-h1">Kategorije proizvoda</h1>
  <a class="adm-btn" href="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'new'])) ?>">Nova kategorija</a>
</div>
<p class="adm-lead">Kategorija bez nadređene je grupa: jedan tab na strani <a href="<?= e(url('proizvodi.html')) ?>" target="_blank" rel="noopener">Proizvodi</a> i stavka u podmeniju „Proizvodi“. Podkategorije su programi grupe i njihove podgrupe (npr. Limovi › Bakar › Bakar u koturu) i biraju se na strani grupe. Sakrivena kategorija se ne prikazuje (ni njene podkategorije), ali proizvodi ostaju dostupni na svojim stranama.</p>

<form method="post" action="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'order'])) ?>">
  <?= csrf_field() ?>
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col" class="adm-col-order">Redosled</th><th scope="col">Naziv (SR / EN)</th><th scope="col">Slug / adresa</th><th scope="col" class="adm-num">Proizvoda</th><th scope="col" class="adm-num">U tabu</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled: <?= e($r['name_sr']) ?>"></td>
        <td<?= (int) $r['depth'] > 0 ? ' style="padding-left:' . (12 + 24 * (int) $r['depth']) . 'px"' : '' ?>><?= (int) $r['depth'] > 0 ? '<span class="adm-muted" aria-hidden="true">↳ </span>' : '' ?><strong><?= e($r['name_sr']) ?></strong><br><span class="adm-muted" lang="en"><?= $r['name_en'] !== '' ? e($r['name_en']) : '<em>nema prevoda</em>' ?></span><?= (int) $r['depth'] > 0 ? '<br><small class="adm-muted">' . e($r['path']) . '</small>' : '' ?></td>
        <td><code><?= e($r['slug']) ?></code></td>
        <td class="adm-num"><?= (int) $r['primary_count'] ?></td>
        <td class="adm-num"><?= (int) $r['listed_count'] ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljiva</span>' : '<span class="adm-badge">sakrivena</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <a href="<?= e(admin_url('', ['m' => 'proizvodi', 'cat' => (int) $r['id']])) ?>">Proizvodi</a>
          <?php if (adm_has_cat_tree() && (int) $r['depth'] < ADM_CAT_LEVELS - 1): ?><a href="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'new', 'parent' => (int) $r['id']])) ?>">+ Podkategorija</a><?php endif; ?>
          <a href="<?= e(url(site_category_href('proizvodi.html', 'sr', $r))) ?>" target="_blank" rel="noopener">Sajt ↗</a>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?>
      <tr><td colspan="7">Nema kategorija.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
  </div>
  <p class="adm-muted">„Proizvoda“ = proizvodi kojima je ovo primarna kategorija (veza „Nazad“ na strani proizvoda); „U tabu“ = kartice prikazane u ovom tabu (kod programa i podgrupe: u njenom prikazu).</p>
  <?php if ($rows): ?><button type="submit" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button><?php endif; ?>
</form>
