<?php
/* TRICOM — /en/calculators.html (prepisuje en/.htaccess): kalkulatori (EN), zajednički delovi iz baze. */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('calculators', 'en');
