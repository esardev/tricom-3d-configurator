<?php
/* Lista usluga i mogućnosti plazme. Ulaz: $rows, $filterKind */
defined('TRICOM') || exit;
$back = admin_url('', array_filter(['m' => 'usluge', 'kind' => $filterKind]));
?>
<div class="adm-head">
  <h1 class="adm-h1">Usluge</h1>
  <a class="adm-btn" href="<?= e(admin_url('', array_filter(['m' => 'usluge', 'a' => 'new', 'kind' => $filterKind]))) ?>">Nova usluga</a>
</div>
<p class="adm-lead">Usluge (vrsta „usluga“) čine listu „Sve usluge“ na strani <a href="<?= e(url('usluge.html')) ?>" target="_blank" rel="noopener">Usluge</a>, redom kao ovde; svaka ima i svoju stranu detalja. Mogućnosti CNC plazme imaju stranu detalja i karticu na strani <a href="<?= e(url('plazma.html')) ?>" target="_blank" rel="noopener">CNC plazma</a>. Kartice mašina u odeljcima „Sečenje“ i „Savijanje“ su stalni tekst strane; otvaraju podatke usluge iz baze.</p>

<form method="get" action="<?= e(admin_url()) ?>" class="adm-filter" role="search">
  <input type="hidden" name="m" value="usluge">
  <?= adm_select('kind', $filterKind, 'Vrsta', ['' => 'Sve vrste'] + SVC_KINDS) ?>
  <button type="submit" class="adm-btn adm-btn--ghost">Prikaži</button>
</form>

<form method="post" action="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'order'])) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="back" value="<?= e($back) ?>">
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col" class="adm-col-order">Redosled</th><th scope="col"><span class="adm-sr">Slika</span></th><th scope="col">Naziv (SR / EN)</th><th scope="col">Vrsta</th><th scope="col"><span class="adm-sr">Ikona</span></th><th scope="col" class="adm-num">Teh. podaci</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled: <?= e($r['title_sr']) ?>"></td>
        <td><?= adm_image_preview((string) $r['image_type'], $r['render_key'], $r['illu_key'], $r['photo_path']) ?></td>
        <td><strong><?= e($r['title_sr']) ?></strong> <code class="adm-muted"><?= e($r['slug']) ?></code><br>
          <span class="adm-muted" lang="en"><?= $r['title_en'] !== '' ? e($r['title_en']) : '<em>nema engleskog naziva</em>' ?></span></td>
        <td><?= $r['kind'] === 'capability' ? 'mogućnost plazme' : 'usluga' ?></td>
        <td><?php $ic = catalog_icon('service', $r['icon_key']); ?><?= $ic !== '' ? '<span class="adm-iconopt__svg" aria-hidden="true">' . $ic . '</span>' : '' ?></td>
        <td class="adm-num"><?= (int) $r['spec_count'] ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljiva</span>' : '<span class="adm-badge">sakrivena</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <?php if ((int) $r['is_active'] === 1): ?><a href="<?= e(adm_product_public_url($r['slug'])) ?>" target="_blank" rel="noopener">Sajt ↗</a><?php endif; ?>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'usluge', 'a' => 'delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?>
      <tr><td colspan="8">Nema usluga za izabrani filter.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
  </div>
  <p class="adm-muted">Redosled određuje raspored u listi „Sve usluge“ (brojevi 01, 02 … se dodeljuju redom).</p>
  <?php if ($rows): ?><button type="submit" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button><?php endif; ?>
</form>
