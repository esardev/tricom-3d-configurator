<?php
/* TRICOM — /en/gallery.html (prepisuje en/.htaccess): galerija (EN) iz baze. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('gallery', 'en');
