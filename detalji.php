<?php
/* TRICOM — /detalji/<slug>.html (prepisuje .htaccess): strana detalja proizvoda, usluge ili mogućnosti plazme iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_detail_page('sr', $_GET['slug'] ?? '');
