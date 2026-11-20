<?php
/* TRICOM — /404.html (prepisuje .htaccess): strana 404 (i ErrorDocument), uvek sa statusom 404. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_not_found('sr');
