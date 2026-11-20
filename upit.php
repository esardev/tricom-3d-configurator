<?php
/* TRICOM — /upit.php: prijem upita sa kontakt forme (POST, JSON odgovor bez cena).
   Obrada je u app/site/inquiry.php; forma ga poziva pre otvaranja e-pošte. */
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/site/inquiry.php';
app_boot('public');
inquiry_receive();
