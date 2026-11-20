-- ==========================================================================
-- TRICOM — patches/003-products-module.sql
-- SAMO za bazu u koju su 001/002 već uvezeni u fazi 2. Nova instalacija
-- uvozi samo 001-schema.sql i 002-existing-content.sql (već sadrže ovo).
-- GENERISANO: node _tools/db/build-existing-content.js — ne menjati ručno.
-- Bezbedno za ponavljanje: kolone se dodaju samo ako ne postoje, a vrednosti
-- se upisuju samo gde je polje prazno ili još ima stari uvezeni tekst.
-- Bez DROP, TRUNCATE i DELETE.
-- ==========================================================================

SET NAMES utf8mb4;

-- 1) categories.nav_label_sr / nav_label_en (oznake u podmeniju „Proizvodi“)
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'nav_label_sr');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `categories` ADD COLUMN `nav_label_sr` VARCHAR(120) NULL AFTER `name_en`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'nav_label_en');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `categories` ADD COLUMN `nav_label_en` VARCHAR(120) NULL AFTER `nav_label_sr`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

-- 2) oznake podmenija za postojeće kategorije (samo gde su prazne)
UPDATE `categories` SET `nav_label_sr` = 'Limovi' WHERE `id` = 1 AND `slug` = 'limovi' AND (`nav_label_sr` IS NULL OR `nav_label_sr` = '');
UPDATE `categories` SET `nav_label_en` = 'Sheet metal' WHERE `id` = 1 AND `slug` = 'limovi' AND (`nav_label_en` IS NULL OR `nav_label_en` = '');
UPDATE `categories` SET `nav_label_sr` = 'Krovni program' WHERE `id` = 2 AND `slug` = 'krov' AND (`nav_label_sr` IS NULL OR `nav_label_sr` = '');
UPDATE `categories` SET `nav_label_en` = 'Roofing range' WHERE `id` = 2 AND `slug` = 'krov' AND (`nav_label_en` IS NULL OR `nav_label_en` = '');
UPDATE `categories` SET `nav_label_sr` = 'Oluci i vertikale' WHERE `id` = 3 AND `slug` = 'oluci' AND (`nav_label_sr` IS NULL OR `nav_label_sr` = '');
UPDATE `categories` SET `nav_label_en` = 'Gutters and downpipes' WHERE `id` = 3 AND `slug` = 'oluci' AND (`nav_label_en` IS NULL OR `nav_label_en` = '');
UPDATE `categories` SET `nav_label_sr` = 'Cevi i profili' WHERE `id` = 4 AND `slug` = 'cevi' AND (`nav_label_sr` IS NULL OR `nav_label_sr` = '');
UPDATE `categories` SET `nav_label_en` = 'Tubes and sections' WHERE `id` = 4 AND `slug` = 'cevi' AND (`nav_label_en` IS NULL OR `nav_label_en` = '');
UPDATE `categories` SET `nav_label_sr` = 'Kovano i pletiva' WHERE `id` = 5 AND `slug` = 'kovano' AND (`nav_label_sr` IS NULL OR `nav_label_sr` = '');
UPDATE `categories` SET `nav_label_en` = 'Wrought iron and mesh' WHERE `id` = 5 AND `slug` = 'kovano' AND (`nav_label_en` IS NULL OR `nav_label_en` = '');
UPDATE `categories` SET `nav_label_sr` = 'Alati i oprema' WHERE `id` = 6 AND `slug` = 'alati' AND (`nav_label_sr` IS NULL OR `nav_label_sr` = '');
UPDATE `categories` SET `nav_label_en` = 'Tools and equipment' WHERE `id` = 6 AND `slug` = 'alati' AND (`nav_label_en` IS NULL OR `nav_label_en` = '');

-- 3) naglašen tekst kartica u tabu „Alati“ (<strong>), samo ako je tekst još uvezeni
UPDATE `product_categories` SET `card_text_sr` = 'Aparati, prateći materijal i oprema za varenje <strong>Varstroj</strong> — elektrode, žice, maske i zaštita.' WHERE `product_id` = 28 AND `category_id` = 6 AND `card_text_sr` = 'Aparati, prateći materijal i oprema za varenje Varstroj — elektrode, žice, maske i zaštita.';
UPDATE `product_categories` SET `card_text_en` = 'Welding machines, consumables and equipment by <strong>Varstroj</strong> — electrodes, wire, welding helmets and protective gear.' WHERE `product_id` = 28 AND `category_id` = 6 AND `card_text_en` = 'Welding machines, consumables and equipment by Varstroj — electrodes, wire, welding helmets and protective gear.';
UPDATE `product_categories` SET `card_text_sr` = 'Vijci, navrtke, podloške, ankeri i tiplovi, brave, okovi za kapije i vrata, šarke, reze, katanci. Brave i okovi <strong>Bane Sekulić</strong> (Sombor) i italijanskih proizvođača PETITI, FIMET i HOPE.' WHERE `product_id` = 29 AND `category_id` = 6 AND `card_text_sr` = 'Vijci, navrtke, podloške, ankeri i tiplovi, brave, okovi za kapije i vrata, šarke, reze, katanci. Brave i okovi Bane Sekulić (Sombor) i italijanskih proizvođača PETITI, FIMET i HOPE.';
UPDATE `product_categories` SET `card_text_en` = 'Screws, nuts, washers, anchors and wall plugs, locks, gate and door hardware, hinges, latches, padlocks. Locks and hardware from <strong>Bane Sekulić</strong> (Sombor) and the Italian manufacturers PETITI, FIMET and HOPE.' WHERE `product_id` = 29 AND `category_id` = 6 AND `card_text_en` = 'Screws, nuts, washers, anchors and wall plugs, locks, gate and door hardware, hinges, latches, padlocks. Locks and hardware from Bane Sekulić (Sombor) and the Italian manufacturers PETITI, FIMET and HOPE.';
UPDATE `product_categories` SET `card_text_sr` = 'Aluminijumske merdevine <strong>Alpos</strong> (Slovenija) — profesionalne EXPERT i poluprofesionalne RATIO — i pomoćni pribor <strong>Mimont</strong>.' WHERE `product_id` = 31 AND `category_id` = 6 AND `card_text_sr` = 'Aluminijumske merdevine Alpos (Slovenija) — profesionalne EXPERT i poluprofesionalne RATIO — i pomoćni pribor Mimont.';
UPDATE `product_categories` SET `card_text_en` = 'Aluminium ladders by <strong>Alpos</strong> (Slovenia) — professional EXPERT and semi-professional RATIO — and ancillary accessories by <strong>Mimont</strong>.' WHERE `product_id` = 31 AND `category_id` = 6 AND `card_text_en` = 'Aluminium ladders by Alpos (Slovenia) — professional EXPERT and semi-professional RATIO — and ancillary accessories by Mimont.';

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('003-products-module', NOW(), 'Zakrpa: modul proizvoda')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
