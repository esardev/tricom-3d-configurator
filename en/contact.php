<?php
/* TRICOM — /en/contact.html (prepisuje en/.htaccess): kontakt (EN) iz baze. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('contact', 'en');
