<?php
/* TRICOM — /o-nama.html (prepisuje .htaccess): O nama, česta pitanja iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('about', 'sr');
