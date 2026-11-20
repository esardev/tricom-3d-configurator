<?php
/* Kontrolna tabla. Ulaz: $user, $modules, $counts, $warnings, $imports, $patches */
defined('TRICOM') || exit;
?>
<h1 class="adm-h1">Kontrolna tabla</h1>
<p class="adm-lead">Dobro došli, <?= e($user['username']) ?>.
  <?php if (!empty($user['last_login_at'])): ?>
    <span class="adm-muted">Prethodna prijava: <?= e(date('d.m.Y. H:i', (int) strtotime((string) $user['last_login_at']))) ?></span>
  <?php endif; ?>
</p>

<?php foreach ($warnings as $w): ?>
  <p class="adm-flash adm-flash--warning" role="status"><?= e($w) ?></p>
<?php endforeach; ?>

<h2 class="adm-h2">Sadržaj sajta</h2>
<p class="adm-muted">Izmene se na sajtu vide odmah (srpska i engleska verzija); sakriveni zapisi se ne prikazuju javno. Upiti i Cenovnik su interni — cene se ne prikazuju na sajtu.</p>
<div class="adm-grid">
  <?php foreach ($modules as $key => $m): ?>
    <a class="adm-tile" href="<?= e(admin_url('', ['m' => $key])) ?>">
      <strong><?= e($m['label']) ?></strong>
      <span class="adm-muted"><?= e($m['hint']) ?></span>
      <span class="adm-tile__n">
        <?php foreach ($m['tables'] as $table => $noun): ?>
          <span><?= isset($counts[$table]) ? e((string) $counts[$table]) : '—' ?> <?= e($noun) ?></span>
        <?php endforeach; ?>
      </span>
    </a>
  <?php endforeach; ?>
</div>

<h2 class="adm-h2">Brze radnje</h2>
<ul class="adm-list">
  <?php foreach ($modules as $key => $m): ?>
    <li><a href="<?= e(admin_url('', ['m' => $key] + ($m['add'][1] !== '' ? ['a' => $m['add'][1]] : []))) ?>"><?= e($m['add'][0]) ?></a>
      <span class="adm-muted">— <?= e($m['label']) ?><?php if (!empty($m['internal'])): ?>, interno (ne prikazuje se na sajtu)<?php else: ?>, javno: <a href="<?= e(url($m['page'])) ?>" target="_blank" rel="noopener"><?= e($m['page']) ?></a><?php endif; ?></span></li>
  <?php endforeach; ?>
</ul>

<h2 class="adm-h2">Javni sajt</h2>
<ul class="adm-list">
  <li><a href="<?= e(url('')) ?>" target="_blank" rel="noopener">Početna (srpski)</a> · <a href="<?= e(url('en/')) ?>" target="_blank" rel="noopener">Home (English)</a></li>
  <li><a href="<?= e(url('sitemap.xml')) ?>" target="_blank" rel="noopener">sitemap.xml</a> <span class="adm-muted">— mapa sajta se pravi sama pri svakom otvaranju (aktivni proizvodi i usluge); ništa ne treba pokretati.</span></li>
</ul>

<h2 class="adm-h2">Baza</h2>
<ul class="adm-list">
  <li>001-schema.sql: <?= $imports['001-schema'] ? 'uvezen' : '<strong>nije uvezen</strong>' ?></li>
  <li>002-existing-content.sql: <?= $imports['002-existing-content'] ? 'uvezen' : '<strong>nije uvezen</strong>' ?></li>
  <?php foreach ($patches as $file => $ok): ?>
    <li>patches/<?= e($file) ?>: <?= $ok ? ((int) $file >= 5 ? 'uvezen' : 'nije potreban (kolone postoje)') : '<strong>potrebno uvesti</strong>' ?></li>
  <?php endforeach; ?>
</ul>
