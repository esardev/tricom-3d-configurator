-- ==========================================================================
-- TRICOM — patches/008-tr10-colours.sql   (izmene klijenta, krug 6)
-- TR 10/162,5 (TP10): boje za nove porudžbine su samo RAL 9006, 9002 i 7016.
-- Izbor u kalkulatoru i 3D konfiguratoru ograničava js/catalog.js
-- (profileColours); ova zakrpa samo dodaje red „Tehnički podaci“ na strani
-- proizvoda (isti zapis koji se uređuje u administraciji → Proizvodi).
--
-- Uvozi se posle 007-sheet-hierarchy.sql (nova instalacija:
-- 001 → 002 → 005 → 006 → 007 → 008). Bezbedno za ponavljanje: red se dodaje
-- samo pri prvom pokretanju i samo ako proizvod postoji i takav red već nema.
-- Postojeći redovi (npr. „Materijal“) se ne menjaju. Bez DROP, TRUNCATE,
-- DELETE i UPDATE.
-- ==========================================================================

SET NAMES utf8mb4;

SET @tricom_first := (SELECT COUNT(*) = 0 FROM `schema_imports` WHERE `import_key` = '008-tr10-colours');
SET @tricom_tr10 := (SELECT `id` FROM `products` WHERE `slug` = 'tr-10-162');

INSERT INTO `product_specs` (`product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
SELECT @tricom_tr10, 65, 'Boje (plastificirani)', 'RAL 9006, RAL 9002, RAL 7016', 'Colours (pre-painted)', 'RAL 9006, RAL 9002, RAL 7016'
  FROM DUAL
 WHERE @tricom_first AND @tricom_tr10 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM `product_specs` WHERE `product_id` = @tricom_tr10 AND `label_sr` = 'Boje (plastificirani)');

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('008-tr10-colours', NOW(), 'Zakrpa: boje TR 10/162,5 (RAL 9006, 9002, 7016) u tehničkim podacima')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
