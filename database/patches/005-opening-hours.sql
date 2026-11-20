-- ==========================================================================
-- TRICOM — patches/005-opening-hours.sql   (izmene klijenta, izdanje A)
-- Radno vreme: ponedeljak–petak 07–16, subota 07–14, nedelja ne radi.
--
-- Uvozi se u POSTOJEĆU bazu (phpMyAdmin → baza → Import), i na novoj
-- instalaciji posle 001-schema.sql i 002-existing-content.sql.
-- Ne briše ništa i ne traži ponovni uvoz 001/002.
-- Bezbedno za ponavljanje: kolone se dodaju samo ako ne postoje; raspored se
-- upisuje samo pri prvom pokretanju (pre oznake 005-opening-hours), pa kasnije
-- izmene iz administracije (Kontakt → Radno vreme) ostaju.
-- Bez DROP, TRUNCATE i DELETE.
-- ==========================================================================

SET NAMES utf8mb4;

-- 1) sati za subotu i nedelju (NULL = ne radi); ponedeljak–petak su postojeće open_hour/close_hour
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_settings' AND COLUMN_NAME = 'sat_open_hour');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `contact_settings` ADD COLUMN `sat_open_hour` TINYINT UNSIGNED NULL DEFAULT NULL AFTER `close_hour`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_settings' AND COLUMN_NAME = 'sat_close_hour');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `contact_settings` ADD COLUMN `sat_close_hour` TINYINT UNSIGNED NULL DEFAULT NULL AFTER `sat_open_hour`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_settings' AND COLUMN_NAME = 'sun_open_hour');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `contact_settings` ADD COLUMN `sun_open_hour` TINYINT UNSIGNED NULL DEFAULT NULL AFTER `sat_close_hour`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_settings' AND COLUMN_NAME = 'sun_close_hour');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `contact_settings` ADD COLUMN `sun_close_hour` TINYINT UNSIGNED NULL DEFAULT NULL AFTER `sun_open_hour`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

-- 2) novi raspored (samo pri prvom pokretanju). Tekst je isti kao onaj koji sajt
--    pravi iz sati (app/lib/hours.php); sajt ga ne čita, ali ostaje usklađen.
UPDATE `contact_settings`
   SET `open_hour` = 7, `close_hour` = 16,
       `sat_open_hour` = 7, `sat_close_hour` = 14,
       `sun_open_hour` = NULL, `sun_close_hour` = NULL,
       `hours_sr` = 'Ponedeljak–petak 07:00–16:00, subota 07:00–14:00, nedelja zatvoreno',
       `hours_en` = 'Monday–Friday 07:00–16:00, Saturday 07:00–14:00, Sunday closed'
 WHERE `id` = 1
   AND NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '005-opening-hours');

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('005-opening-hours', NOW(), 'Zakrpa: radno vreme pon–pet, subota, nedelja')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
