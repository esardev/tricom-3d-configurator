-- ==========================================================================
-- TRICOM — patches/009-price-list-inquiries.sql   (krug 9: cenovnik i upiti)
-- Interni cenovnik trapeznih limova (TR 10, TR 20, TR 35, TR 40) i evidencija
-- upita sa kontakt forme, sa sačuvanim obračunom uz svaki upit.
--
-- Uvozi se u POSTOJEĆU bazu (phpMyAdmin → baza → Import) POSLE 008, i na
-- novoj instalaciji posle 001 → 002 → 005 → 006 → 007 → 008.
-- Zavisi samo od tabele `schema_imports` (001); ne menja postojeće tabele.
-- Ne briše ništa i ne traži ponovni uvoz 001/002.
-- Bezbedno za ponavljanje: samo CREATE TABLE IF NOT EXISTS i oznaka uvoza.
-- Nijedna cena se ne upisuje: sve stope, valuta i osnova PDV-a ostaju prazne
-- dok ih vlasnik ne unese u administraciji (Cenovnik).
-- Bez DROP, TRUNCATE i DELETE.
--
-- Fajlovi koda moraju biti otpremljeni pre ili posle ove zakrpe — redosled
-- nije bitan: stari kod ne čita ove tabele, a novi kod bez njih prima upit
-- samo e-poštom (kao do sada) i u administraciji traži uvoz ove zakrpe.
-- ==========================================================================

SET NAMES utf8mb4;

-- 1) opšta podešavanja cenovnika (jedan red, id = 1). NULL = nije uneto.
CREATE TABLE IF NOT EXISTS `price_settings` (
  `id`          TINYINT UNSIGNED NOT NULL,
  `currency`    CHAR(3)      NULL,               -- 'RSD' | 'EUR'
  `vat_basis`   VARCHAR(10)  NULL,               -- 'bez_pdv' | 'sa_pdv'
  `updated_at`  DATETIME     NULL,
  `updated_by`  VARCHAR(50)  NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) cena lima po m² obračunske (pokrivne) površine, po profilu i debljini.
--    Red nastaje tek kad se cena sačuva u administraciji; NULL = nije uneto.
CREATE TABLE IF NOT EXISTS `price_sheet_rates` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `profile_key`   VARCHAR(10)   NOT NULL,        -- tr10 | tr20 | tr35 | tr40 (js/catalog.js)
  `thickness_mm`  DECIMAL(4,2)  NOT NULL,        -- debljina lima, mm
  `rate_per_m2`   DECIMAL(14,4) NULL,            -- cena za 1 m² pokrivne površine
  `updated_at`    DATETIME      NULL,
  `updated_by`    VARCHAR(50)   NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_price_sheet_rates` (`profile_key`, `thickness_mm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) filc (antikondenz) po profilu: stopa + jedinica + širina filca.
--    unit 'm2' = cena po m² filca (dužni metri × širina filca);
--    unit 'm'  = cena po dužnom metru table (širina se ne koristi).
CREATE TABLE IF NOT EXISTS `price_felt_rates` (
  `profile_key`   VARCHAR(10)   NOT NULL,
  `rate`          DECIMAL(14,4) NULL,
  `unit`          VARCHAR(4)    NULL,            -- 'm2' | 'm'
  `width_mm`      DECIMAL(6,1)  NULL,            -- širina filca, mm (samo za 'm2')
  `updated_at`    DATETIME      NULL,
  `updated_by`    VARCHAR(50)   NULL,
  PRIMARY KEY (`profile_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) upiti sa kontakt forme (kontakt.html, en/contact.html). IP adresa se čuva
--    samo kao SHA-256 otisak (ograničenje broja slanja).
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ref_code`         VARCHAR(20)  NOT NULL,      -- npr. U-20261119-7K3P
  `lang`             CHAR(2)      NOT NULL DEFAULT 'sr',
  `name`             VARCHAR(200) NOT NULL,
  `email`            VARCHAR(254) NOT NULL,
  `phone`            VARCHAR(50)  NOT NULL DEFAULT '',
  `topic`            VARCHAR(60)  NOT NULL DEFAULT '',
  `message`          TEXT         NOT NULL,
  `config_refs`      TEXT         NULL,          -- skriveno polje „konfiguracija“ (calc:<heš>, tokeni konfiguratora)
  `production_note`  TEXT         NULL,          -- skriveno polje „proizvodnja“
  `ip_hash`          CHAR(64)     NOT NULL,
  `created_at`       DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inquiries_ref` (`ref_code`),
  KEY `ix_inquiries_created` (`created_at`),
  KEY `ix_inquiries_ip` (`ip_hash`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) sačuvani obračuni upita: primenjene stope, jedinice, valuta i rezultat
--    (JSON). Prvi red pravi sajt pri prijemu; administracija samo DODAJE nove
--    redove („novi obračun po važećem cenovniku“), postojeći se ne menjaju.
CREATE TABLE IF NOT EXISTS `inquiry_quotes` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `inquiry_id`   INT UNSIGNED  NOT NULL,
  `created_at`   DATETIME      NOT NULL,
  `created_by`   VARCHAR(50)   NOT NULL,         -- 'sajt' ili korisničko ime administratora
  `status`       VARCHAR(12)   NOT NULL,         -- complete | incomplete | invalid | none
  `currency`     CHAR(3)       NULL,
  `grand_total`  DECIMAL(16,2) NULL,             -- samo kad je obračun potpun
  `snapshot`     MEDIUMTEXT    NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_inquiry_quotes_inquiry` (`inquiry_id`, `created_at`),
  CONSTRAINT `fk_inquiry_quotes_inquiry` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`) VALUES ('009-price-list-inquiries', NOW(), 'Zakrpa: interni cenovnik trapeznih limova i evidencija upita')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
