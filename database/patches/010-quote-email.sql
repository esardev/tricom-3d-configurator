-- ==========================================================================
-- TRICOM — patches/010-quote-email.sql   (krug 10: upit iz kalkulatora e-poštom sa PDF-om)
-- Dodaje u tabelu `inquiries` (zakrpa 009) kolone za slanje specifikacije:
-- vrstu toka, ključ slanja (sprečava dupli upit pri ponovnom pokušaju),
-- stanje slanja e-pošte i ime sačuvanog PDF-a (app/storage/quotes/, van weba).
--
-- Uvozi se POSLE 009-price-list-inquiries.sql (postojeća instalacija:
-- 005 → 006 → 007 → 008 → 009 → 010; nova: 001 → 002 → 005 → … → 010).
-- Ne briše ništa i ne menja postojeće redove (stari upiti dobijaju flow = 'contact').
-- Bezbedno za ponavljanje: svaka kolona i indeks se dodaju samo ako ne postoje.
-- Bez DROP, TRUNCATE i DELETE.
-- ==========================================================================

SET NAMES utf8mb4;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'submit_key');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `submit_key` CHAR(32) NULL DEFAULT NULL AFTER `ref_code`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND INDEX_NAME = 'uq_inquiries_submit_key');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD UNIQUE KEY `uq_inquiries_submit_key` (`submit_key`)', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

-- 'contact' = obična kontakt forma (mailto); 'quote' = upit sa stavkama kalkulatora (e-pošta sa PDF-om sa servera)
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'flow');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `flow` VARCHAR(10) NOT NULL DEFAULT ''contact'' AFTER `lang`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

-- NULL = ne šalje se sa servera; pending | sending | sent | failed
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'mail_status');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `mail_status` VARCHAR(10) NULL DEFAULT NULL AFTER `production_note`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'mail_attempts');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `mail_attempts` SMALLINT UNSIGNED NOT NULL DEFAULT 0 AFTER `mail_status`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'mail_claimed_at');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `mail_claimed_at` DATETIME NULL DEFAULT NULL AFTER `mail_attempts`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'mail_sent_at');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `mail_sent_at` DATETIME NULL DEFAULT NULL AFTER `mail_claimed_at`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'mail_to');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `mail_to` VARCHAR(254) NULL DEFAULT NULL AFTER `mail_sent_at`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'mail_error');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `mail_error` VARCHAR(255) NULL DEFAULT NULL AFTER `mail_to`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'pdf_file');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD COLUMN `pdf_file` VARCHAR(80) NULL DEFAULT NULL AFTER `mail_error`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND INDEX_NAME = 'ix_inquiries_mail');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `inquiries` ADD KEY `ix_inquiries_mail` (`flow`, `mail_status`)', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('010-quote-email', NOW(), 'Zakrpa: upit iz kalkulatora e-poštom sa PDF specifikacijom')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
