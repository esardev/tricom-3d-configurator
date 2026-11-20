<?php
/* Jednokratni setup administratora.
   Ulaz: $state ('no-secret' | 'no-schema' | 'exists' | 'form' | 'done'), $errors, $username */
defined('TRICOM') || exit;
?>
<h1 class="adm-h1">Prvi administrator</h1>

<?php if ($state === 'no-secret'): ?>
  <p>Setup je zaključan. Da biste napravili administratora:</p>
  <ol class="adm-list">
    <li>U <code>app/config.php</code> upišite tajnu u <code>security.setup_secret</code> (najmanje 16 znakova, npr. nasumična reč i brojevi).</li>
    <li>Osvežite ovu stranu i unesite istu tajnu u formu.</li>
  </ol>

<?php elseif ($state === 'no-schema'): ?>
  <p class="adm-flash adm-flash--warning" role="status">Tabele administracije nisu pronađene u bazi.</p>
  <p>U phpMyAdmin-u, u bazi iz <code>app/config.php</code>, uvezite redom <code>database/001-schema.sql</code> i <code>database/002-existing-content.sql</code>, pa osvežite ovu stranu.</p>

<?php elseif ($state === 'exists'): ?>
  <p class="adm-flash adm-flash--warning" role="status">Administrator već postoji — setup je onemogućen.</p>
  <ol class="adm-list">
    <li>Obrišite fajl <code>admin/setup-admin.php</code> sa servera (File Manager ili FTP).</li>
    <li>U <code>app/config.php</code> vratite <code>security.setup_secret</code> na <code>''</code>.</li>
  </ol>
  <p><a class="adm-btn" href="<?= e(admin_url('login.php')) ?>">Na prijavu</a></p>

<?php elseif ($state === 'done'): ?>
  <p class="adm-flash adm-flash--success" role="status">Administrator „<?= e($username) ?>“ je napravljen.</p>
  <p><strong>Odmah uradite sledeće:</strong></p>
  <ol class="adm-list">
    <li>Obrišite fajl <code>admin/setup-admin.php</code> sa servera (File Manager ili FTP).</li>
    <li>U <code>app/config.php</code> vratite <code>security.setup_secret</code> na <code>''</code>.</li>
  </ol>
  <p><a class="adm-btn" href="<?= e(admin_url('login.php')) ?>">Na prijavu</a></p>

<?php else: ?>
  <p>Ova strana radi samo dok administrator ne postoji. Lozinka se čuva samo kao heš.</p>
  <?php if ($errors): ?>
    <div class="adm-flash adm-flash--error" role="alert">
      <?php foreach ($errors as $err): ?><p><?= e($err) ?></p><?php endforeach; ?>
    </div>
  <?php endif; ?>
  <form method="post" action="<?= e(admin_url('setup-admin.php')) ?>" class="adm-form" novalidate>
    <?= csrf_field() ?>
    <label class="adm-field">
      <span>Tajna za setup (iz app/config.php)</span>
      <input type="password" name="setup_secret" autocomplete="off" required maxlength="200">
    </label>
    <label class="adm-field">
      <span>Korisničko ime</span>
      <input type="text" name="username" value="<?= e($username) ?>" autocomplete="username" autocapitalize="none" spellcheck="false" required maxlength="50" pattern="[a-z0-9._\-]{3,50}">
      <small>3–50 znakova: mala slova, brojevi, tačka, crtica, donja crta.</small>
    </label>
    <label class="adm-field">
      <span>Lozinka</span>
      <input type="password" name="password" autocomplete="new-password" required minlength="<?= PASSWORD_MIN_LENGTH ?>" maxlength="200">
      <small>Najmanje <?= PASSWORD_MIN_LENGTH ?> znakova.</small>
    </label>
    <label class="adm-field">
      <span>Ponovite lozinku</span>
      <input type="password" name="password_confirm" autocomplete="new-password" required maxlength="200">
    </label>
    <button type="submit" class="adm-btn">Napravi administratora</button>
  </form>
<?php endif; ?>
