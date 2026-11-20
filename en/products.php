<?php
/* TRICOM — /en/products.html (prepisuje en/.htaccess): prodajni program iz baze. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_products_page('en');
