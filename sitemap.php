<?php
/* TRICOM — /sitemap.xml (prepisuje .htaccess): mapa sajta sa proizvodima iz baze. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_sitemap();
