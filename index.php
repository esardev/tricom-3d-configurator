<?php
/* TRICOM — /index.html i / (prepisuje .htaccess): početna, zajednički delovi iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('home', 'sr');
