<?php
/* Okvir bez menija (prijava, setup). Ulaz: $title, $content, $flashes */
defined('TRICOM') || exit;
?>
<!doctype html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> — TRICOM administracija</title>
<link rel="stylesheet" href="<?= e(asset_url('admin/assets/admin.css')) ?>">
<link rel="icon" href="<?= e(url('assets/favicon.svg')) ?>" type="image/svg+xml">
</head>
<body class="adm adm--bare">
<main class="adm-card" id="sadrzaj">
  <p class="adm-brand adm-brand--center"><strong>TRICOM</strong> <span>administracija</span></p>
  <?php foreach ($flashes as $f): ?>
    <p class="adm-flash adm-flash--<?= e($f['type']) ?>" role="<?= $f['type'] === 'error' ? 'alert' : 'status' ?>"><?= e($f['message']) ?></p>
  <?php endforeach; ?>
  <?= $content ?>
</main>
</body>
</html>
