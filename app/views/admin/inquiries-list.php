<?php
/* Lista upita. Ulaz: $ready; uz $ready: $rows, $page, $pages, $total */
defined('TRICOM') || exit;
?>
<h1 class="adm-h1">Upiti</h1>
<?php if (!$ready): ?>
  <p class="adm-flash adm-flash--warning" role="status">Tabele upita još nisu u bazi — u phpMyAdmin-u uvezite database/patches/009-price-list-inquiries.sql (posle 008). Do tada upiti stižu samo e-poštom, kao ranije.</p>
  <?php return; ?>
<?php endif; ?>
<p class="adm-lead">Upiti poslati preko forme na strani <a href="<?= e(url('kontakt.html')) ?>" target="_blank" rel="noopener">Kontakt</a> (srpski i engleski).
  Obična forma: kupac šalje e-poruku iz svog programa, a ovde je isti upit sa brojem iz te poruke. Upit iz kalkulatora: sajt sam šalje
  prodaji e-poruku sa PDF specifikacijom (kolona „Specifikacija“). Uz oba je interni obračun stavki kalkulatora po
  <a href="<?= e(admin_url('', ['m' => 'cenovnik'])) ?>">cenovniku</a>. Iznosi se vide samo u administraciji.</p>

<div class="adm-table-wrap">
<table class="adm-table">
  <thead><tr><th scope="col">Primljen</th><th scope="col">Broj</th><th scope="col">Ime i firma</th><th scope="col">Tema</th><th scope="col">Obračun</th><th scope="col" class="adm-num">Ukupno</th><th scope="col">Specifikacija</th></tr></thead>
  <tbody>
  <?php foreach ($rows as $r): ?>
    <tr>
      <td class="adm-nowrap"><?= e(date('d.m.Y. H:i', (int) strtotime((string) $r['created_at']))) ?></td>
      <td><a href="<?= e(admin_url('', ['m' => 'upiti', 'a' => 'view', 'id' => (int) $r['id']])) ?>" class="adm-mono"><?= e($r['ref_code']) ?></a><?= $r['lang'] === 'en' ? ' <span class="adm-badge">EN</span>' : '' ?></td>
      <td><?= e($r['name']) ?><br><span class="adm-muted"><?= e($r['email']) ?><?= $r['phone'] !== '' ? ' · ' . e($r['phone']) : '' ?></span></td>
      <td><?= e($r['topic']) ?></td>
      <td><?= q_badge((string) ($r['q_status'] ?? '')) ?></td>
      <td class="adm-num adm-nowrap"><?= $r['q_total'] !== null ? e(q_money((string) $r['q_total'], (string) $r['q_currency'])) : '<span class="adm-muted">—</span>' ?></td>
      <td><?= q_mail_badge($r['flow'] ?? null, $r['mail_status'] ?? null) ?></td>
    </tr>
  <?php endforeach; ?>
  <?php if (!$rows): ?>
    <tr><td colspan="7">Još nema zabeleženih upita.</td></tr>
  <?php endif; ?>
  </tbody>
</table>
</div>
<?php if ($pages > 1): ?>
  <p class="adm-links">Strana <?= (int) $page ?> od <?= (int) $pages ?> (ukupno <?= (int) $total ?>):
    <?php if ($page > 1): ?><a href="<?= e(admin_url('', ['m' => 'upiti', 'p' => $page - 1])) ?>">← novije</a><?php endif; ?>
    <?php if ($page < $pages): ?><a href="<?= e(admin_url('', ['m' => 'upiti', 'p' => $page + 1])) ?>">starije →</a><?php endif; ?>
  </p>
<?php endif; ?>
