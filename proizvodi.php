<?php
/* TRICOM — /proizvodi.html (prepisuje .htaccess): prodajni program iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_products_page('sr');
