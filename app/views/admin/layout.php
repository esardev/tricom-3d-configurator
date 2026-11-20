<?php
/* Okvir administracije: zaglavlje, meni modula, poruke, sadržaj.
   Ulaz: $title, $active, $content (već escapovan HTML), $user, $modules, $flashes */
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
<body class="adm">
<a class="adm-skip" href="#sadrzaj">Preskoči na sadržaj</a>
<header class="adm-top">
  <a class="adm-brand" href="<?= e(admin_url()) ?>"><strong>TRICOM</strong> <span>administracija</span></a>
  <div class="adm-user">
    <?php if ($user): ?>
      <span class="adm-user__name" title="Prijavljeni korisnik"><?= e($user['username']) ?></span>
      <form method="post" action="<?= e(admin_url('logout.php')) ?>" class="adm-inline">
        <?= csrf_field() ?>
        <button type="submit" class="adm-btn adm-btn--ghost adm-btn--sm">Odjava</button>
      </form>
    <?php endif; ?>
    <a class="adm-link" href="<?= e(url()) ?>" target="_blank" rel="noopener">Sajt ↗</a>
  </div>
</header>
<div class="adm-wrap">
  <nav class="adm-nav" aria-label="Moduli administracije">
    <ul>
      <li><a href="<?= e(admin_url()) ?>"<?= $active === '' ? ' aria-current="page"' : '' ?>>Kontrolna tabla</a></li>
      <?php foreach ($modules as $key => $m): ?>
        <li><a href="<?= e(admin_url('', ['m' => $key])) ?>"<?= $active === $key ? ' aria-current="page"' : '' ?>><?= e($m['label']) ?></a></li>
      <?php endforeach; ?>
    </ul>
  </nav>
  <main class="adm-main" id="sadrzaj">
    <?php foreach ($flashes as $f): ?>
      <p class="adm-flash adm-flash--<?= e($f['type']) ?>" role="<?= $f['type'] === 'error' ? 'alert' : 'status' ?>"><?= e($f['message']) ?></p>
    <?php endforeach; ?>
    <?= $content ?>
  </main>
</div>
</body>
</html>
