<?php
/* Prijava. Ulaz: $error, $notice, $username, $next, $noAdmin */
defined('TRICOM') || exit;
?>
<h1 class="adm-h1">Prijava</h1>
<?php if ($notice): ?>
  <p class="adm-flash adm-flash--info" role="status"><?= e($notice) ?></p>
<?php endif; ?>
<?php if ($noAdmin): ?>
  <p class="adm-flash adm-flash--warning" role="status">Administrator još nije napravljen. Otvorite <a href="<?= e(admin_url('setup-admin.php')) ?>">admin/setup-admin.php</a>.</p>
<?php endif; ?>
<?php if ($error): ?>
  <p class="adm-flash adm-flash--error" role="alert"><?= e($error) ?></p>
<?php endif; ?>
<form method="post" action="<?= e(admin_url('login.php')) ?>" class="adm-form" novalidate>
  <?= csrf_field() ?>
  <input type="hidden" name="next" value="<?= e($next) ?>">
  <label class="adm-field">
    <span>Korisničko ime</span>
    <input type="text" name="username" value="<?= e($username) ?>" autocomplete="username" autocapitalize="none" spellcheck="false" required maxlength="50" autofocus>
  </label>
  <label class="adm-field">
    <span>Lozinka</span>
    <input type="password" name="password" autocomplete="current-password" required maxlength="200">
  </label>
  <button type="submit" class="adm-btn">Prijavi se</button>
</form>
