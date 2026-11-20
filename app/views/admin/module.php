<?php
/* Najava modula čija obrada još nije napravljena. Ulaz: $module, $counts */
defined('TRICOM') || exit;
?>
<h1 class="adm-h1"><?= e($module['label']) ?></h1>
<p class="adm-lead"><?= e($module['hint']) ?></p>
<p class="adm-flash adm-flash--info" role="status">Uređivanje ovog modula biće dostupno u sledećoj fazi. Postojeći sadržaj je u bazi:</p>
<ul class="adm-list">
  <?php foreach ($module['tables'] as $table => $noun): ?>
    <li><?= isset($counts[$table]) ? e((string) $counts[$table]) : '—' ?> <?= e($noun) ?></li>
  <?php endforeach; ?>
</ul>
