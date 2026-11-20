<?php
/* TRICOM — /en/about.html (prepisuje en/.htaccess): About (EN), česta pitanja iz baze. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('about', 'en');
