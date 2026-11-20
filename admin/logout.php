<?php
/* TRICOM — admin/logout.php: odjava (samo POST sa CSRF tokenom). */
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
app_boot('admin');
require APP_DIR . '/admin/admin.php';
admin_start();

if (!is_post()) {
    redirect(admin_url());
}
csrf_require();
admin_logout();
redirect(admin_url('login.php', ['odjava' => 1]));
