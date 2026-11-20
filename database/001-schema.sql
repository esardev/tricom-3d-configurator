-- ==========================================================================
-- TRICOM — 001-schema.sql
-- Kompletna minimalna šema za administraciju sajta.
--
-- Uvoz: phpMyAdmin → izabrana (postojeća) baza → Import → ovaj fajl.
-- Ponovni uvoz je bezbedan: samo CREATE TABLE IF NOT EXISTS, bez DROP/TRUNCATE.
-- Posle ovog fajla uvozi se 002-existing-content.sql.
--
-- Zahteva MySQL 5.7+ ili MariaDB 10.3+ (InnoDB, utf8mb4).
-- ==========================================================================

SET NAMES utf8mb4;

-- --------------------------------------------------------------------------
-- Evidencija uvezenih SQL fajlova (štiti 002 od dvostrukog uvoza)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema_imports` (
  `import_key`  VARCHAR(64)  NOT NULL,
  `imported_at` DATETIME     NOT NULL,
  `note`        VARCHAR(255) NULL,
  PRIMARY KEY (`import_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Administrator (jedan nalog; pravi ga admin/setup-admin.php, nikad SQL)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)  NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `last_login_at` DATETIME     NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pokušaji prijave (ograničenje broja pokušaja). IP i korisničko ime se čuvaju
-- samo kao SHA-256 otisak.
CREATE TABLE IF NOT EXISTS `admin_login_attempts` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `scope`         VARCHAR(20)  NOT NULL,          -- 'login' | 'setup'
  `ip_hash`       CHAR(64)     NOT NULL,
  `username_hash` CHAR(64)     NULL,
  `succeeded`     TINYINT(1)   NOT NULL DEFAULT 0,
  `attempted_at`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_attempts_ip`   (`scope`, `ip_hash`, `attempted_at`),
  KEY `ix_attempts_user` (`scope`, `username_hash`, `attempted_at`),
  KEY `ix_attempts_time` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Kategorije proizvoda (tabovi na proizvodi.html; slug = heš taba, ne menja se)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`        VARCHAR(60)  NOT NULL,
  `name_sr`     VARCHAR(120) NOT NULL,
  `name_en`     VARCHAR(120) NOT NULL DEFAULT '',
  `nav_label_sr` VARCHAR(120) NULL,                -- podmeni „Proizvodi“; prazno = name
  `nav_label_en` VARCHAR(120) NULL,
  `heading_sr`  VARCHAR(255) NOT NULL DEFAULT '',
  `heading_en`  VARCHAR(255) NOT NULL DEFAULT '',
  `intro_sr`    TEXT         NULL,
  `intro_en`    TEXT         NULL,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `ix_categories_order` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Proizvodi (jedan red = jedan proizvod na oba jezika)
--   Liste (tags, apps) = jedna stavka po redu; description = pasusi odvojeni
--   praznim redom. Putanje medija su relativne od korena sajta, bez početne
--   kose crte (npr. assets/old/tr/tr-35.jpg, uploads/products/…).
--   render_key → assets/render/<key>-light|dark.*; illu_key → SVG ilustracija.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`           VARCHAR(120) NOT NULL,
  `category_id`    INT UNSIGNED NOT NULL,          -- primarna kategorija (veza „Nazad“)
  `title_sr`       VARCHAR(255) NOT NULL,
  `title_en`       VARCHAR(255) NOT NULL DEFAULT '',
  `summary_sr`     TEXT         NULL,
  `summary_en`     TEXT         NULL,
  `description_sr` TEXT         NULL,
  `description_en` TEXT         NULL,
  `tags_sr`        TEXT         NULL,
  `tags_en`        TEXT         NULL,
  `apps_sr`        TEXT         NULL,
  `apps_en`        TEXT         NULL,
  `image_type`     ENUM('none','render','illu','photo') NOT NULL DEFAULT 'none',
  `render_key`     VARCHAR(120) NULL,
  `illu_key`       VARCHAR(60)  NULL,
  `photo_path`     VARCHAR(255) NULL,
  `photo_width`    SMALLINT UNSIGNED NULL,
  `photo_height`   SMALLINT UNSIGNED NULL,
  `image_alt_sr`   VARCHAR(255) NULL,
  `image_alt_en`   VARCHAR(255) NULL,
  `drawing_path`   VARCHAR(255) NULL,              -- fabrički crtež
  `calc_id`        VARCHAR(20)  NULL,              -- tr10 | tr20 | tr35 | tr40 | crep
  `calc_tabs`      VARCHAR(20)  NULL,
  `konf_hash`      VARCHAR(255) NULL,              -- heš 3D konfiguratora
  `related_slugs`  VARCHAR(1000) NULL,             -- slugovi srodnih stavki, zarezom, po redu
  `sort_order`     INT          NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `ix_products_category` (`category_id`),
  KEY `ix_products_order` (`is_active`, `sort_order`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tehnički podaci proizvoda: red tabele „Tehnički podaci“ na oba jezika.
CREATE TABLE IF NOT EXISTS `product_specs` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  INT UNSIGNED NOT NULL,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `label_sr`    VARCHAR(255) NOT NULL,
  `value_sr`    VARCHAR(1000) NOT NULL DEFAULT '',
  `label_en`    VARCHAR(255) NOT NULL DEFAULT '',
  `value_en`    VARCHAR(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `ix_product_specs_product` (`product_id`, `sort_order`),
  CONSTRAINT `fk_product_specs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prikaz proizvoda u tabu kategorije (proizvod može biti u više tabova ili ni u
-- jednom). Polja card_* su tekst kartice na listi; prazno = koriste se naslov,
-- sažetak, oznake i slika samog proizvoda.
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id`         INT UNSIGNED NOT NULL,
  `category_id`        INT UNSIGNED NOT NULL,
  `sort_order`         INT          NOT NULL DEFAULT 0,
  `card_title_sr`      VARCHAR(255) NULL,
  `card_title_en`      VARCHAR(255) NULL,
  `card_text_sr`       TEXT         NULL,
  `card_text_en`       TEXT         NULL,
  `card_tags_sr`       TEXT         NULL,
  `card_tags_en`       TEXT         NULL,
  `card_image_type`    ENUM('inherit','none','render','photo') NOT NULL DEFAULT 'inherit',
  `card_render_key`    VARCHAR(120) NULL,
  `card_photo_path`    VARCHAR(255) NULL,
  `card_photo_width`   SMALLINT UNSIGNED NULL,
  `card_photo_height`  SMALLINT UNSIGNED NULL,
  `card_image_alt_sr`  VARCHAR(255) NULL,
  `card_image_alt_en`  VARCHAR(255) NULL,
  PRIMARY KEY (`product_id`, `category_id`),
  KEY `ix_product_categories_list` (`category_id`, `sort_order`),
  CONSTRAINT `fk_product_categories_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_product_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Usluge i mogućnosti mašine (kind = service | capability); kolone sadržaja
-- iste kao kod proizvoda.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`           VARCHAR(120) NOT NULL,
  `kind`           ENUM('service','capability') NOT NULL DEFAULT 'service',
  `title_sr`       VARCHAR(255) NOT NULL,
  `title_en`       VARCHAR(255) NOT NULL DEFAULT '',
  `summary_sr`     TEXT         NULL,
  `summary_en`     TEXT         NULL,
  `description_sr` TEXT         NULL,
  `description_en` TEXT         NULL,
  `tags_sr`        TEXT         NULL,
  `tags_en`        TEXT         NULL,
  `apps_sr`        TEXT         NULL,
  `apps_en`        TEXT         NULL,
  `image_type`     ENUM('none','render','illu','photo') NOT NULL DEFAULT 'none',
  `render_key`     VARCHAR(120) NULL,
  `illu_key`       VARCHAR(60)  NULL,
  `photo_path`     VARCHAR(255) NULL,
  `photo_width`    SMALLINT UNSIGNED NULL,
  `photo_height`   SMALLINT UNSIGNED NULL,
  `image_alt_sr`   VARCHAR(255) NULL,
  `image_alt_en`   VARCHAR(255) NULL,
  `icon_key`       VARCHAR(60)  NULL,                -- ikona reda na usluge.html (app/data/icons.json)
  `drawing_path`   VARCHAR(255) NULL,
  `calc_id`        VARCHAR(20)  NULL,
  `calc_tabs`      VARCHAR(20)  NULL,
  `konf_hash`      VARCHAR(255) NULL,
  `related_slugs`  VARCHAR(1000) NULL,
  `sort_order`     INT          NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_services_slug` (`slug`),
  KEY `ix_services_order` (`kind`, `is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_specs` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id`  INT UNSIGNED NOT NULL,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `label_sr`    VARCHAR(255) NOT NULL,
  `value_sr`    VARCHAR(1000) NOT NULL DEFAULT '',
  `label_en`    VARCHAR(255) NOT NULL DEFAULT '',
  `value_en`    VARCHAR(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `ix_service_specs_service` (`service_id`, `sort_order`),
  CONSTRAINT `fk_service_specs_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Reference (ref_type: demand = „Visina, količina, složenost“,
-- scope = vrste radova, project = objekti i partneri). Ime tabele nije
-- `references` jer je to rezervisana reč u MySQL-u.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `client_references` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`         VARCHAR(120) NOT NULL,
  `ref_type`     ENUM('demand','scope','project') NOT NULL DEFAULT 'project',
  `title_sr`     VARCHAR(255) NOT NULL,
  `title_en`     VARCHAR(255) NOT NULL DEFAULT '',
  `summary_sr`   TEXT         NULL,
  `summary_en`   TEXT         NULL,
  `label_sr`     VARCHAR(120) NULL,                -- kratka oznaka (npr. „32 t BAKRA · 48 DANA“)
  `label_en`     VARCHAR(120) NULL,
  `image_type`   ENUM('none','render','photo') NOT NULL DEFAULT 'none',
  `render_key`   VARCHAR(120) NULL,
  `photo_path`   VARCHAR(255) NULL,
  `photo_width`  SMALLINT UNSIGNED NULL,
  `photo_height` SMALLINT UNSIGNED NULL,
  `image_alt_sr` VARCHAR(255) NULL,
  `image_alt_en` VARCHAR(255) NULL,
  `icon_key`     VARCHAR(60)  NULL,                -- ikona kartice „vrste zahtevnosti“ (app/data/icons.json)
  `sort_order`   INT          NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_client_references_slug` (`slug`),
  KEY `ix_client_references_order` (`ref_type`, `is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Galerije: kategorija = filter na galerija.html i oznaka na pločici
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery_categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`        VARCHAR(60)  NOT NULL,
  `name_sr`     VARCHAR(120) NOT NULL,
  `name_en`     VARCHAR(120) NOT NULL DEFAULT '',
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_gallery_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gallery_images` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`         VARCHAR(60)  NOT NULL,            -- g-NN (heš #item=)
  `category_id`  INT UNSIGNED NOT NULL,
  `fig_no`       VARCHAR(10)  NOT NULL DEFAULT '', -- „FIG. 01“
  `caption_sr`   VARCHAR(255) NOT NULL,
  `caption_en`   VARCHAR(255) NOT NULL DEFAULT '',
  `alt_sr`       VARCHAR(255) NOT NULL DEFAULT '',
  `alt_en`       VARCHAR(255) NOT NULL DEFAULT '',
  `image_type`   ENUM('photo','render') NOT NULL DEFAULT 'photo',
  `render_key`   VARCHAR(120) NULL,
  `photo_path`   VARCHAR(255) NULL,
  `photo_width`  SMALLINT UNSIGNED NULL,
  `photo_height` SMALLINT UNSIGNED NULL,
  `crop_pos`     VARCHAR(10)  NULL,                -- data-pos (tl, tr, …)
  `zoom`         VARCHAR(10)  NULL,                -- data-zoom
  `sort_order`   INT          NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_gallery_images_slug` (`slug`),
  KEY `ix_gallery_images_list` (`category_id`, `is_active`, `sort_order`),
  CONSTRAINT `fk_gallery_images_category` FOREIGN KEY (`category_id`) REFERENCES `gallery_categories` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Česta pitanja (O nama; ista lista na početnoj)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faq_items` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_sr`  VARCHAR(500) NOT NULL,
  `question_en`  VARCHAR(500) NOT NULL DEFAULT '',
  `answer_sr`    TEXT         NOT NULL,
  `answer_en`    TEXT         NULL,
  `sort_order`   INT          NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_faq_items_order` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Kontakt: jedan red podešavanja + lokacije + telefoni
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_settings` (
  `id`                    TINYINT UNSIGNED NOT NULL,   -- uvek 1
  `hours_sr`              VARCHAR(255) NOT NULL DEFAULT '',
  `hours_en`              VARCHAR(255) NOT NULL DEFAULT '',
  `open_hour`             TINYINT UNSIGNED NOT NULL DEFAULT 9,   -- status „Otvoreno/Zatvoreno“, radnim danima
  `close_hour`            TINYINT UNSIGNED NOT NULL DEFAULT 17,
  `footer_email`          VARCHAR(190) NOT NULL DEFAULT '',
  `company_name`          VARCHAR(255) NOT NULL DEFAULT '',
  `company_legal_name`    VARCHAR(500) NOT NULL DEFAULT '',
  `pib`                   VARCHAR(20)  NOT NULL DEFAULT '',
  `registration_no`       VARCHAR(20)  NOT NULL DEFAULT '',
  `activity_code`         VARCHAR(10)  NOT NULL DEFAULT '',
  `vat_sr`                VARCHAR(255) NOT NULL DEFAULT '',
  `vat_en`                VARCHAR(255) NOT NULL DEFAULT '',
  `vat_certificate_path`  VARCHAR(255) NULL,
  `vat_record_path`       VARCHAR(255) NULL,
  `bank_name`             VARCHAR(120) NOT NULL DEFAULT '',
  `bank_account`          VARCHAR(60)  NOT NULL DEFAULT '',
  `activity_sr`           VARCHAR(255) NOT NULL DEFAULT '',
  `activity_en`           VARCHAR(255) NOT NULL DEFAULT '',
  `founded_sr`            VARCHAR(255) NOT NULL DEFAULT '',
  `founded_en`            VARCHAR(255) NOT NULL DEFAULT '',
  `director`              VARCHAR(120) NOT NULL DEFAULT '',
  `facebook_url`          VARCHAR(255) NOT NULL DEFAULT '',
  `facebook_label`        VARCHAR(255) NOT NULL DEFAULT '',
  `locations_heading_sr`  VARCHAR(255) NOT NULL DEFAULT '',
  `locations_heading_en`  VARCHAR(255) NOT NULL DEFAULT '',
  `locations_intro_sr`    TEXT         NULL,
  `locations_intro_en`    TEXT         NULL,
  `updated_at`            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_locations` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`           VARCHAR(60)  NOT NULL,          -- prodaja | direkcija
  `title_sr`       VARCHAR(120) NOT NULL,          -- „Prodaja — Batajnica“
  `title_en`       VARCHAR(120) NOT NULL DEFAULT '',
  `short_name_sr`  VARCHAR(60)  NOT NULL DEFAULT '', -- „Prodaja“ (futer, mapa)
  `short_name_en`  VARCHAR(60)  NOT NULL DEFAULT '',
  `street`         VARCHAR(120) NOT NULL DEFAULT '',
  `postal_code`    VARCHAR(10)  NOT NULL DEFAULT '',
  `place`          VARCHAR(60)  NOT NULL DEFAULT '',
  `city_sr`        VARCHAR(60)  NOT NULL DEFAULT '',
  `city_en`        VARCHAR(60)  NOT NULL DEFAULT '',
  `purpose_sr`     VARCHAR(255) NOT NULL DEFAULT '',
  `purpose_en`     VARCHAR(255) NOT NULL DEFAULT '',
  `emails`         TEXT         NULL,              -- jedna adresa po redu
  `map_query`      VARCHAR(255) NOT NULL DEFAULT '', -- koordinate ili adresa za Google mape
  `map_title_sr`   VARCHAR(255) NOT NULL DEFAULT '',
  `map_title_en`   VARCHAR(255) NOT NULL DEFAULT '',
  `sort_order`     INT          NOT NULL DEFAULT 0,
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_contact_locations_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Telefoni lokacije: tel = E.164 (veza tel:), display_* = ispis po jeziku.
CREATE TABLE IF NOT EXISTS `contact_phones` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `location_id`  INT UNSIGNED NOT NULL,
  `tel`          VARCHAR(20)  NOT NULL,
  `display_sr`   VARCHAR(40)  NOT NULL,
  `display_en`   VARCHAR(40)  NOT NULL DEFAULT '',
  `in_footer`    TINYINT(1)   NOT NULL DEFAULT 0,
  `sort_order`   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ix_contact_phones_location` (`location_id`, `sort_order`),
  CONSTRAINT `fk_contact_phones_location` FOREIGN KEY (`location_id`) REFERENCES `contact_locations` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`)
VALUES ('001-schema', NOW(), 'TRICOM šema v1')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;
