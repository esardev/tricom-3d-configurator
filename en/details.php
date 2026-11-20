<?php
/* TRICOM — /en/details/<slug>.html (prepisuje en/.htaccess): strana detalja proizvoda, usluge ili mogućnosti plazme iz baze. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_detail_page('en', $_GET['slug'] ?? '');
