<?php
/* TRICOM — /reference.html (prepisuje .htaccess): strana referenci iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_references_page('sr');
