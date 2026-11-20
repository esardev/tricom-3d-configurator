<?php
/* Lista referenci. Ulaz: $rows, $filterType */
defined('TRICOM') || exit;
$back = admin_url('', array_filter(['m' => 'reference', 'type' => $filterType]));
?>
<div class="adm-head">
  <h1 class="adm-h1">Reference</h1>
  <a class="adm-btn" href="<?= e(admin_url('', array_filter(['m' => 'reference', 'a' => 'new', 'type' => $filterType]))) ?>">Nova referenca</a>
</div>
<p class="adm-lead">Reference se prikazuju na strani <a href="<?= e(url('reference.html')) ?>" target="_blank" rel="noopener">Reference</a> po vrsti, redom kao ovde, i otvaraju se u prozoru (modal). Istaknuti poduhvat (Karađorđevo sa brojačima), traka objekata i lista poslovnih partnera su stalni tekst strane.</p>

<form method="get" action="<?= e(admin_url()) ?>" class="adm-filter" role="search">
  <input type="hidden" name="m" value="reference">
  <?= adm_select('type', $filterType, 'Vrsta', ['' => 'Sve vrste'] + REF_TYPES) ?>
  <button type="submit" class="adm-btn adm-btn--ghost">Prikaži</button>
</form>

<form method="post" action="<?= e(admin_url('', ['m' => 'reference', 'a' => 'order'])) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="back" value="<?= e($back) ?>">
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col" class="adm-col-order">Redosled</th><th scope="col"><span class="adm-sr">Slika</span></th><th scope="col">Naziv (SR / EN)</th><th scope="col">Vrsta</th><th scope="col">Oznaka</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled: <?= e($r['title_sr']) ?>"></td>
        <td><?= $r['image_type'] !== 'none' ? adm_image_preview((string) $r['image_type'], $r['render_key'], null, $r['photo_path']) : (catalog_icon('reference', $r['icon_key']) !== '' ? '<span class="adm-thumb adm-thumb--illu" aria-hidden="true">' . catalog_icon('reference', $r['icon_key']) . '</span>' : adm_image_preview('none', null, null, null)) ?></td>
        <td><strong><?= e($r['title_sr']) ?></strong> <code class="adm-muted"><?= e($r['slug']) ?></code><br>
          <span class="adm-muted" lang="en"><?= $r['title_en'] !== '' ? e($r['title_en']) : '<em>nema engleskog naziva</em>' ?></span></td>
        <td><?= e(REF_TYPE_SHORT[$r['ref_type']] ?? $r['ref_type']) ?></td>
        <td><?= (string) $r['label_sr'] !== '' ? '<span class="adm-badge">' . e($r['label_sr']) . '</span>' : '' ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljiva</span>' : '<span class="adm-badge">sakrivena</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'reference', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <?php if ((int) $r['is_active'] === 1): ?><a href="<?= e(url('reference.html') . '#item=' . $r['slug']) ?>" target="_blank" rel="noopener">Sajt ↗</a><?php endif; ?>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'reference', 'a' => 'delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?>
      <tr><td colspan="7">Nema referenci za izabranu vrstu.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
  </div>
  <p class="adm-muted">Redosled važi unutar vrste; na strani se vrste prikazuju svaka u svom odeljku.</p>
  <?php if ($rows): ?><button type="submit" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button><?php endif; ?>
</form>
