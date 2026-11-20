-- ==========================================================================
-- TRICOM — patches/006-navigation-contact.sql   (izmene klijenta, krug 2)
-- 1) nazivi grupa proizvoda (postojeće kategorije, isti ID i slug — adrese i
--    veze proizvoda se ne menjaju)
-- 2) lokacija „direkcija“ (Kralja Vladislava 82) se više ne prikazuje kupcima;
--    zapis ostaje (sedište u podacima o firmi i JSON-LD Organization)
-- 3) telefoni direkcije koji ne postoje kod prodaje prelaze na lokaciju prodaje
--    (isti redovi, samo location_id), da nijedan broj ne nestane sa sajta
-- 4) blok „Zatražite ponudu“: 060 380 16 68 i 011 787 00 24
--
-- Uvozi se u POSTOJEĆU bazu posle 005-opening-hours.sql (i na novoj
-- instalaciji: 001 → 002 → 005 → 006). Ne traži ponovni uvoz 001/002.
-- Bezbedno za ponavljanje: kolone se dodaju samo ako ne postoje; podaci se
-- menjaju samo pri prvom pokretanju (pre oznake 006-navigation-contact), pa
-- kasnije izmene iz administracije ostaju. Bez DROP, TRUNCATE i DELETE.
-- ==========================================================================

SET NAMES utf8mb4;

-- Kolone ------------------------------------------------------------------
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_locations' AND COLUMN_NAME = 'is_public');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `contact_locations` ADD COLUMN `is_public` TINYINT(1) NOT NULL DEFAULT 1 AFTER `sort_order`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_phones' AND COLUMN_NAME = 'in_quote');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `contact_phones` ADD COLUMN `in_quote` TINYINT(1) NOT NULL DEFAULT 0 AFTER `in_footer`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_first := (SELECT COUNT(*) = 0 FROM `schema_imports` WHERE `import_key` = '006-navigation-contact');

-- 1) Nazivi grupa proizvoda (tab, podmeni „Proizvodi“). Oznaka u meniju se
--    prazni (oba jezika) — meni tada koristi isti naziv.
UPDATE `categories` SET `name_sr` = 'Krovni i fasadni sistemi', `name_en` = 'Roofing and façade systems', `nav_label_sr` = NULL, `nav_label_en` = NULL WHERE `id` = 2 AND `slug` = 'krov' AND @tricom_first;
UPDATE `categories` SET `name_sr` = 'Limovi', `name_en` = 'Sheet metal', `nav_label_sr` = NULL, `nav_label_en` = NULL WHERE `id` = 1 AND `slug` = 'limovi' AND @tricom_first;
UPDATE `categories` SET `name_sr` = 'Olučni sistemi', `name_en` = 'Gutter systems', `nav_label_sr` = NULL, `nav_label_en` = NULL WHERE `id` = 3 AND `slug` = 'oluci' AND @tricom_first;
UPDATE `categories` SET `name_sr` = 'Čelične cevi i profili', `name_en` = 'Steel tubes and sections', `nav_label_sr` = NULL, `nav_label_en` = NULL WHERE `id` = 4 AND `slug` = 'cevi' AND @tricom_first;
UPDATE `categories` SET `name_sr` = 'Ogradni sistemi i građevinska bravarija', `name_en` = 'Fencing systems and architectural metalwork', `nav_label_sr` = NULL, `nav_label_en` = NULL WHERE `id` = 5 AND `slug` = 'kovano' AND @tricom_first;
UPDATE `categories` SET `name_sr` = 'Alati i oprema', `name_en` = 'Tools and equipment', `nav_label_sr` = NULL, `nav_label_en` = NULL WHERE `id` = 6 AND `slug` = 'alati' AND @tricom_first;

-- 2) Direkcija: ne prikazuje se kupcima (zapis i adresa ostaju)
UPDATE `contact_locations` SET `is_public` = 0 WHERE `slug` = 'direkcija' AND @tricom_first;

-- 3) Telefoni direkcije kojih nema kod prodaje → lokacija prodaje (011 787 00 24, 011 787 03 49)
SET @tricom_prodaja := (SELECT `id` FROM `contact_locations` WHERE `slug` = 'prodaja');
SET @tricom_direkcija := (SELECT `id` FROM `contact_locations` WHERE `slug` = 'direkcija');
UPDATE `contact_phones` p
  LEFT JOIN (SELECT DISTINCT `tel` FROM `contact_phones` WHERE `location_id` = @tricom_prodaja) d ON d.`tel` = p.`tel`
   SET p.`location_id` = @tricom_prodaja,
       p.`sort_order` = CASE p.`tel` WHEN '+381117870024' THEN 40 ELSE 50 END
 WHERE p.`location_id` = @tricom_direkcija AND p.`tel` IN ('+381117870024', '+381117870349')
   AND d.`tel` IS NULL AND @tricom_prodaja IS NOT NULL AND @tricom_first;

-- 4) Blok „Zatražite ponudu“ (futer svih strana)
UPDATE `contact_phones` SET `in_quote` = 1 WHERE `tel` IN ('+381603801668', '+381117870024') AND @tricom_first;

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('006-navigation-contact', NOW(), 'Zakrpa: nazivi grupa proizvoda, javna adresa, telefoni za ponudu')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
