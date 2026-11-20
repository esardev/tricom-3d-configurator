<?php
/* TRICOM — /en/404.html (prepisuje en/.htaccess): strana 404 (EN, i ErrorDocument), uvek sa statusom 404. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_not_found('en');
