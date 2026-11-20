-- ==========================================================================
-- TRICOM — patches/004-services-references.sql
-- SAMO za bazu u koju su 001/002 već uvezeni pre modula usluga i referenci
-- (posle 003-products-module.sql). Nova instalacija uvozi samo
-- 001-schema.sql i 002-existing-content.sql (već sadrže ovo).
-- GENERISANO: node _tools/db/build-existing-content.js — ne menjati ručno.
-- Bezbedno za ponavljanje: kolone se dodaju samo ako ne postoje; ključevi
-- ikona se upisuju samo pri prvom pokretanju (pre oznake 004-services-references),
-- a tekst samo gde je još uvezena vrednost. Bez DROP, TRUNCATE i DELETE.
-- ==========================================================================

SET NAMES utf8mb4;

-- 1) services.icon_key i client_references.icon_key (ikona u listi / na kartici)
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'services' AND COLUMN_NAME = 'icon_key');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `services` ADD COLUMN `icon_key` VARCHAR(60) NULL AFTER `image_alt_en`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'client_references' AND COLUMN_NAME = 'icon_key');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `client_references` ADD COLUMN `icon_key` VARCHAR(60) NULL AFTER `image_alt_en`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

-- 2) ikone uvezenih usluga i referenci (samo prazna polja, samo pri prvom pokretanju)
UPDATE `services` SET `icon_key` = 'secenje-cnc-plazma' WHERE `id` = 1 AND `slug` = 'secenje-cnc-plazma' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'gasno-rezanje' WHERE `id` = 2 AND `slug` = 'gasno-rezanje' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'secenje-makazama' WHERE `id` = 3 AND `slug` = 'secenje-makazama' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'slitovanje' WHERE `id` = 4 AND `slug` = 'slitovanje' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'premotavanje-kotura' WHERE `id` = 5 AND `slug` = 'premotavanje-kotura' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'savijanje-limova' WHERE `id` = 6 AND `slug` = 'savijanje-limova' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'lucno-savijanje' WHERE `id` = 7 AND `slug` = 'lucno-savijanje' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'ispravljanje-flahova' WHERE `id` = 8 AND `slug` = 'ispravljanje-flahova' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'izrada-trapeznog-lima' WHERE `id` = 9 AND `slug` = 'izrada-trapeznog-lima' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'izrada-oluka' WHERE `id` = 10 AND `slug` = 'izrada-oluka' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'profilisanje-parapeta-i-lamperije' WHERE `id` = 11 AND `slug` = 'profilisanje-parapeta-i-lamperije' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'probijanje-i-isecanje-uglova' WHERE `id` = 12 AND `slug` = 'probijanje-i-isecanje-uglova' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'secenje-profila' WHERE `id` = 13 AND `slug` = 'secenje-profila' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `services` SET `icon_key` = 'grifovanje' WHERE `id` = 14 AND `slug` = 'grifovanje' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `client_references` SET `icon_key` = 'ref-rad-na-visini' WHERE `id` = 1 AND `slug` = 'ref-rad-na-visini' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `client_references` SET `icon_key` = 'ref-velike-kolicine' WHERE `id` = 2 AND `slug` = 'ref-velike-kolicine' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');
UPDATE `client_references` SET `icon_key` = 'ref-slozeni-detalji' WHERE `id` = 3 AND `slug` = 'ref-slozeni-detalji' AND `icon_key` IS NULL AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '004-services-references');

-- 3) naglašen tekst kartica referenci (<strong>), samo ako je tekst još uvezeni
UPDATE `client_references` SET `summary_sr` = 'Limarska galanterija i spusne vertikale na Kliničkom centru Srbije, na visini <strong>preko 30 m</strong>. Na stambenim objektima u Beogradu, silosima i šećeranama — <strong>preko 50 m</strong>.' WHERE `id` = 1 AND `slug` = 'ref-rad-na-visini' AND `summary_sr` = 'Limarska galanterija i spusne vertikale na Kliničkom centru Srbije, na visini preko 30 m. Na stambenim objektima u Beogradu, silosima i šećeranama — preko 50 m.';
UPDATE `client_references` SET `summary_en` = 'Sheet-metal roofing accessories and downpipes at the University Clinical Centre of Serbia, at a height of <strong>over 30 m</strong>. On residential buildings in Belgrade, silos and sugar factories — <strong>over 50 m</strong>.' WHERE `id` = 1 AND `slug` = 'ref-rad-na-visini' AND `summary_en` = 'Sheet-metal roofing accessories and downpipes at the University Clinical Centre of Serbia, at a height of over 30 m. On residential buildings in Belgrade, silos and sugar factories — over 50 m.';
UPDATE `client_references` SET `summary_sr` = 'Kompletni krovopokrivački i limarski radovi od bakarnog lima na Rezidenciji predsednika republike u Karađorđevu — <strong>preko 30 tona bakra</strong>.' WHERE `id` = 2 AND `slug` = 'ref-velike-kolicine' AND `summary_sr` = 'Kompletni krovopokrivački i limarski radovi od bakarnog lima na Rezidenciji predsednika republike u Karađorđevu — preko 30 tona bakra.';
UPDATE `client_references` SET `summary_en` = 'Complete roofing and sheet-metal work in copper sheet at the Residence of the President of the Republic in Karađorđevo — <strong>over 30 tonnes of copper</strong>.' WHERE `id` = 2 AND `slug` = 'ref-velike-kolicine' AND `summary_en` = 'Complete roofing and sheet-metal work in copper sheet at the Residence of the President of the Republic in Karađorđevo — over 30 tonnes of copper.';

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('004-services-references', NOW(), 'Zakrpa: moduli usluga i referenci')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
