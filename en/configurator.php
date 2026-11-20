<?php
/* TRICOM — /en/configurator.html (prepisuje en/.htaccess): 3D konfigurator; iz PHP-a samo domen i verzija resursa (bez baze). */
declare(strict_types=1);
require dirname(__DIR__) . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_page('configurator', 'en');
