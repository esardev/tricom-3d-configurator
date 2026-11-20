<?php
/* TRICOM — /robots.txt (prepisuje .htaccess): adresa mape sajta iz app.base_url (bez baze). */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/site.php';
site_boot();
site_robots();
