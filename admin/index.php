<?php
/* TRICOM — admin/index.php: kontrolna tabla i ulaz u module (?m=<ključ>).
   Obrada modula je u app/admin/modules/<ključ>.php; dok fajla nema,
   prikazuje se najava modula. */
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
app_boot('admin');
require APP_DIR . '/admin/admin.php';
admin_start();
admin_require_schema();
$user = admin_require();

$modules = admin_modules();
$key = is_string($_GET['m'] ?? null) ? $_GET['m'] : '';

/* broj redova po tabeli; tabela koje nema (šema nije uvezena) se preskače */
$counts = [];
foreach ($modules as $m) {
    foreach (array_keys($m['tables']) as $table) {
        if (db_table_exists($table)) {
            $counts[$table] = (int) db_value('SELECT COUNT(*) FROM ' . db_ident($table));
        }
    }
}

if ($key === '') {
    $warnings = [];
    if (admin_setup_file_present()) {
        $warnings[] = 'Fajl admin/setup-admin.php je još na serveru — obrišite ga (File Manager ili FTP).';
    }
    if ((string) config('security.setup_secret', '') !== '') {
        $warnings[] = 'U app/config.php je još upisana tajna za setup — vratite security.setup_secret na \'\'.';
    }
    $imports = ['001-schema' => db_import_done('001-schema'), '002-existing-content' => db_import_done('002-existing-content')];
    /* baza uvezena u ranijoj fazi: kolone koje dodaju zakrpe 003/004 (nova instalacija ih već ima) */
    $patches = [
        '003-products-module.sql' => db_column_exists('categories', 'nav_label_sr'),
        '004-services-references.sql' => db_column_exists('services', 'icon_key') && db_column_exists('client_references', 'icon_key'),
    ];
    foreach ($patches as $file => $ok) {
        if (!$ok) {
            $warnings[] = 'Baza je uvezena u ranijoj fazi i nema sve kolone — u phpMyAdmin-u uvezite database/patches/' . $file . ' (redom 003, pa 004).';
        }
    }
    /* izmene klijenta: zakrpe koje trebaju svakoj bazi (i novoj, posle 002) */
    $patches['005-opening-hours.sql'] = db_import_done('005-opening-hours') && db_column_exists('contact_settings', 'sun_close_hour');
    if (!$patches['005-opening-hours.sql']) {
        $warnings[] = 'Radno vreme za subotu i nedelju još nije u bazi — u phpMyAdmin-u uvezite database/patches/005-opening-hours.sql.';
    }
    $patches['006-navigation-contact.sql'] = db_import_done('006-navigation-contact') && db_column_exists('contact_phones', 'in_quote');
    if (!$patches['006-navigation-contact.sql']) {
        $warnings[] = 'Nazivi grupa proizvoda i kontakt izmene (krug 2) još nisu u bazi — u phpMyAdmin-u uvezite database/patches/006-navigation-contact.sql (posle 005).';
    }
    $patches['007-sheet-hierarchy.sql'] = db_import_done('007-sheet-hierarchy') && db_column_exists('categories', 'parent_id');
    if (!$patches['007-sheet-hierarchy.sql']) {
        $warnings[] = 'Programi i podgrupe limova (podkategorije) još nisu u bazi — u phpMyAdmin-u uvezite database/patches/007-sheet-hierarchy.sql (posle 006).';
    }
    $patches['008-tr10-colours.sql'] = db_import_done('008-tr10-colours');
    if (!$patches['008-tr10-colours.sql']) {
        $warnings[] = 'Boje za TR 10/162,5 još nisu u tehničkim podacima proizvoda — u phpMyAdmin-u uvezite database/patches/008-tr10-colours.sql (posle 007).';
    }
    $patches['009-price-list-inquiries.sql'] = db_import_done('009-price-list-inquiries') && db_table_exists('inquiry_quotes') && db_table_exists('price_felt_rates');
    if (!$patches['009-price-list-inquiries.sql']) {
        $warnings[] = 'Cenovnik i evidencija upita još nisu u bazi — u phpMyAdmin-u uvezite database/patches/009-price-list-inquiries.sql (posle 008). Do tada upiti stižu samo e-poštom.';
    }
    $patches['010-quote-email.sql'] = $patches['009-price-list-inquiries.sql'] && db_import_done('010-quote-email') && db_column_exists('inquiries', 'mail_status');
    if ($patches['009-price-list-inquiries.sql'] && !$patches['010-quote-email.sql']) {
        $warnings[] = 'Slanje upita iz kalkulatora sa PDF-om još nije u bazi — u phpMyAdmin-u uvezite database/patches/010-quote-email.sql (posle 009).';
    } elseif ($patches['010-quote-email.sql']) {
        require_once APP_DIR . '/lib/quote-mail.php';
        if ($p = quote_mail_problem()) {
            $warnings[] = 'Upiti iz kalkulatora se ne šalju sa sajta (kupci ih šalju iz svog programa za e-poštu): ' . $p;
        }
        $failed = (int) db_value("SELECT COUNT(*) FROM `inquiries` WHERE `flow` = 'quote' AND `mail_status` IN ('failed', 'pending', 'sending')");
        if ($failed > 0) {
            $warnings[] = 'Upita iz kalkulatora čija specifikacija nije poslata prodaji: ' . $failed . ' — otvorite Upiti (kolona „Specifikacija“) i pošaljite ih ponovo.';
        }
    }
    admin_render('dashboard', compact('user', 'modules', 'counts', 'warnings', 'imports', 'patches'), 'Kontrolna tabla');
}

if (!isset($modules[$key])) {
    throw new HttpException(404, 'Taj modul ne postoji.');
}
$handler = APP_DIR . '/admin/modules/' . $key . '.php';
if (is_file($handler)) {
    require $handler;
    exit;
}
admin_render('module', ['module' => $modules[$key], 'counts' => $counts], $modules[$key]['label'], $key);
