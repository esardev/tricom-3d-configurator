-- ==========================================================================
-- TRICOM — patches/007-sheet-hierarchy.sql   (izmene klijenta, krug 5)
-- Hijerarhija prodajnog programa: kategorija može imati nadređenu kategoriju
-- (grupa → program → podgrupa, najviše tri nivoa). Grupa „Limovi“ dobija
-- programe i podgrupe po specifikaciji klijenta, kao obične kategorije koje se
-- uređuju u administraciji (naziv, uvod, redosled, vidljivost, proizvodi).
-- Tehničke tabele ostaju u js/catalog.js (vezane za slug, kao i do sada).
--
-- Uvozi se u POSTOJEĆU bazu posle 006-navigation-contact.sql (nova
-- instalacija: 001 → 002 → 005 → 006 → 007). Ne traži ponovni uvoz 001/002.
-- Bezbedno za ponavljanje: kolona, indeks i strani ključ se dodaju samo ako
-- ne postoje; kategorije se dodaju samo pri prvom pokretanju (pre oznake
-- 007-sheet-hierarchy) i samo ako slug već ne postoji, pa se postojeći
-- zapisi i izmene iz administracije ne diraju. Bez DROP, TRUNCATE i DELETE;
-- postojeće kategorije, proizvodi i dodele proizvoda se ne menjaju.
-- ==========================================================================

SET NAMES utf8mb4;

-- Kolona parent_id (NULL = grupa najvišeg nivoa, tab na strani proizvoda) ----
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'parent_id');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `categories` ADD COLUMN `parent_id` INT UNSIGNED NULL DEFAULT NULL AFTER `id`', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND INDEX_NAME = 'ix_categories_parent');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `categories` ADD KEY `ix_categories_parent` (`parent_id`, `sort_order`)', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

-- nadređena kategorija se ne može obrisati dok ima podkategorije (RESTRICT)
SET @tricom_missing := (SELECT COUNT(*) = 0 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND CONSTRAINT_NAME = 'fk_categories_parent');
SET @tricom_sql := IF(@tricom_missing, 'ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT', 'DO 0');
PREPARE tricom_stmt FROM @tricom_sql;
EXECUTE tricom_stmt;
DEALLOCATE PREPARE tricom_stmt;

SET @tricom_first := (SELECT COUNT(*) = 0 FROM `schema_imports` WHERE `import_key` = '007-sheet-hierarchy');
SET @tricom_limovi := (SELECT `id` FROM `categories` WHERE `slug` = 'limovi' AND `parent_id` IS NULL);

-- Programi grupe „Limovi“ (nivo 2) --------------------------------------------
-- Prohrom / inox nije u spisku klijenta; postojeći sadržaj se zadržava kao
-- poslednji program (sakriva se u administraciji ako klijent tako odluči).
INSERT INTO `categories` (`parent_id`, `slug`, `name_sr`, `name_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
SELECT @tricom_limovi, s.`slug`, s.`name_sr`, s.`name_en`, '', '', s.`intro_sr`, s.`intro_en`, s.`ord`, 1
  FROM (
    SELECT 'pocinkovani' AS `slug`, 'Pocinkovani lim' AS `name_sr`, 'Galvanised sheet' AS `name_en`,
           'Pocinkovani lim svih formata, 0,4–2 mm, toplocinkovan 140, 200 i 275 g/m². Konfekcioniramo ga u svim oblicima za dalju doradu: sečenje iz kotura na potrebnu dužinu, sečenje table na meru, slitovanje.' AS `intro_sr`,
           'Galvanised sheet in all formats, 0.4–2 mm, hot-dip galvanised 140, 200 and 275 g/m². We prepare it in any form for further processing: cutting from coil to the required length, cutting sheets to size, slitting.' AS `intro_en`, 10 AS `ord`
    UNION ALL SELECT 'plastificirani', 'Plastificirani lim', 'Pre-painted sheet', NULL, NULL, 20
    UNION ALL SELECT 'aluminijum', 'Aluminijum', 'Aluminium', NULL, NULL, 30
    UNION ALL SELECT 'bakar', 'Bakar', 'Copper', NULL, NULL, 40
    UNION ALL SELECT 'hladnovaljani', 'Hladnovaljani lim', 'Cold-rolled sheet', NULL, NULL, 50
    UNION ALL SELECT 'toplovaljani', 'Toplovaljani lim', 'Hot-rolled sheet', NULL, NULL, 60
    UNION ALL SELECT 'inox', 'Prohrom / inox', 'Stainless steel', NULL, NULL, 70
  ) s
 WHERE @tricom_first AND @tricom_limovi IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM `categories` c WHERE c.`slug` = s.`slug`);

-- Podgrupe (nivo 3): nadređeni program se traži samo među programima grupe „Limovi“
INSERT INTO `categories` (`parent_id`, `slug`, `name_sr`, `name_en`, `heading_sr`, `heading_en`, `sort_order`, `is_active`)
SELECT p.`id`, s.`slug`, s.`name_sr`, s.`name_en`, '', '', s.`ord`, 1
  FROM (
              SELECT 'pocinkovani' AS `parent`, 'pocinkovani-kotur' AS `slug`, 'Limovi u koturu' AS `name_sr`, 'Sheet in coils' AS `name_en`, 10 AS `ord`
    UNION ALL SELECT 'pocinkovani', 'pocinkovani-table', 'Limovi u tablama', 'Flat sheets', 20
    UNION ALL SELECT 'pocinkovani', 'pocinkovani-slit', 'Slitovi lima', 'Slit strip', 30
    UNION ALL SELECT 'plastificirani', 'plastificirani-bojeni', 'Plastificiran bojeni lim', 'Pre-painted colour sheet', 10
    UNION ALL SELECT 'plastificirani', 'plastificirani-matirani', 'Plastificiran matirani lim', 'Pre-painted matt sheet', 20
    UNION ALL SELECT 'plastificirani', 'plastificirani-drvo', 'Imitacija drveta', 'Wood-effect finish', 30
    UNION ALL SELECT 'aluminijum', 'aluminijum-kotur', 'Aluminijum u koturu', 'Aluminium coil', 10
    UNION ALL SELECT 'aluminijum', 'aluminijum-table', 'Aluminijum u tablama', 'Aluminium sheets', 20
    UNION ALL SELECT 'aluminijum', 'aluminijum-bojeni', 'Bojeni aluminijum', 'Pre-painted aluminium', 30
    UNION ALL SELECT 'aluminijum', 'aluminijum-rebraste', 'Rebraste table aluminijuma', 'Aluminium chequer plate', 40
    UNION ALL SELECT 'bakar', 'bakar-kotur', 'Bakar u koturu', 'Copper coil', 10
    UNION ALL SELECT 'bakar', 'bakar-slit', 'Slitovi bakra', 'Copper slit strip', 20
    UNION ALL SELECT 'bakar', 'bakar-table', 'Bakar u tablama', 'Copper sheets', 30
    UNION ALL SELECT 'toplovaljani', 'toplovaljani-ravni', 'Ravni lim', 'Flat plate', 10
    UNION ALL SELECT 'toplovaljani', 'toplovaljani-rebrasti', 'Rebrasti lim', 'Chequer plate', 20
  ) s
  JOIN `categories` p ON p.`slug` = s.`parent` AND p.`parent_id` = @tricom_limovi
 WHERE @tricom_first AND @tricom_limovi IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM `categories` c WHERE c.`slug` = s.`slug`);

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('007-sheet-hierarchy', NOW(), 'Zakrpa: hijerarhija kategorija (parent_id), programi i podgrupe limova')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
