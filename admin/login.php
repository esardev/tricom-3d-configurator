<?php
/* TRICOM — admin/login.php: prijava administratora. */
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
app_boot('admin');
require APP_DIR . '/admin/admin.php';
admin_start();
admin_require_schema();

if (admin_user()) {
    redirect(admin_url());
}

$view = [
    'error'    => null,
    'notice'   => null,
    'username' => '',
    'next'     => safe_admin_next($_GET['next'] ?? ''),
    'noAdmin'  => admin_count() === 0,
];
if (!empty($_SESSION['_expired'])) {
    $view['notice'] = 'Sesija je istekla. Prijavite se ponovo.';
    unset($_SESSION['_expired']);
} elseif (isset($_GET['odjava'])) {
    $view['notice'] = 'Odjavljeni ste.';
}

if (is_post()) {
    csrf_require();
    $view['username'] = mb_strtolower(input_str($_POST, 'username'), 'UTF-8');
    $view['next'] = safe_admin_next($_POST['next'] ?? '');
    $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
    $result = admin_login($view['username'], $password);
    if ($result['ok']) {
        redirect($view['next']);
    }
    $view['error'] = $result['error'];
    $view['notice'] = null;
    http_response_code(401);
}

admin_render_bare('login', $view, 'Prijava');
