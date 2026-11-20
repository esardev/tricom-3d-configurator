<?php
/* TRICOM — /usluge.html (prepisuje .htaccess): strana usluga, lista usluga iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_services_page('sr');
