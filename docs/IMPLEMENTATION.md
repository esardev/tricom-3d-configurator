# TRICOM — Admin panel: implementation record

| Phase | Status |
|---|---|
| 1. Discovery and plan | done |
| 2. Backend foundation: config, PDO, auth, admin shell, schema, existing content | done |
| 3. Product categories + products module (admin CRUD, products page, product detail pages, `items.js`, sitemap) | done (§13) |
| 4a. Services + references modules (admin CRUD, services page, service detail pages, references page, modal data) | done (§14) |
| 4b. Galleries, About FAQ, contact information (admin, gallery/About/contact pages, contact data in the shared header and footer of all pages) | done (§15) |
| 4c. **Final integration and deployment preparation** (home FAQ and structured data from the database, hidden records off fixed tiles, empty states, configurator / robots / sitemap, admin start page, deployment inventory) | **done** (this revision, §16) |
| 5. Full QA and handover | **done** — results in `QA-REPORT.md`; owner documents `DEPLOYMENT.md`, `ADMIN-UPUTSTVO.md`, `UPLOAD-MANIFEST.md` (Serbian) |

Target: plain PHP 8.3 + PDO + MySQL on shared hosting (File Manager / FTP, phpMyAdmin), with no server-side
build, Node or SSH. Every public page is now a PHP view generated from the finished markup and served at its
old `.html` address; no static `.html` page remains. **Deployment: §16.**

---

## 1. How the site worked before the admin panel (phase 1 findings)

The current state is in §9 (URLs) and §13–§16; this section describes the original static site.

- **Static site.** Every page is a hand-finished `.html` file. Shared header, navigation and footer are
  **copied into all 116 HTML files**.
- **Two languages, mirrored files.** Serbian pages sit in the root, English pages in `en/` and use English
  file names. Each pair has the same markup, ids and hashes.
- **Language switch** (`js/lang.js`) follows `<link rel="alternate" hreflang>` and falls back to a `PATHS` map,
  keeping the hash. `L10N.page()` in `js/i18n/l10n.js` uses the same map.
- **Detail pages** (`detalji/<slug>.html` and `en/details/<slug>.html`, 47 + 47) were generated from
  `js/items.js` by a generator that is not present locally. Each carries static SEO HTML, `Product` JSON-LD and
  an inline `items.js` subset.
- **Cards → modal.** Every card with `data-item="<slug>"` opens a modal built by `js/modal.js` from
  `window.TRICOM_ITEMS` (`js/items.js`). `#item=<slug>` opens a modal on load.
- **Technical tables** on the products page come from `js/catalog.js` (`TRICOM_CATALOG.sales`) via
  `js/catalog-render.js`. `catalog.js` also feeds the calculators and the 3D configurator.
- **Forms:** the contact form is mailto-only; nothing is posted to the server (see §15, "Contact form").
- **Content sources:**
  - HTML: page copy, FAQ, contact details, listing-card text
  - `js/items.js`: records for the modal and detail pages
  - `js/catalog.js`: product tables, calculators, configurator
  - `js/i18n/*.js`: UI strings

Notable facts:
- `items.js` builds part of its records in code, so the import uses the **evaluated** data.
- `_tools/`, `_content/` and `_qa/`, which the README references, are not present locally. Phase 2 added only `_tools/db/`.

---

## 2. File and URL map

| SR URL | EN URL | Managed content on the page |
|---|---|---|
| `/` (`index.html`) | `/en/` | lineup, program tiles, plasma block, featured reference, **FAQ**, footer contact |
| `/o-nama.html` | `/en/about.html` | **FAQ** (`#faq2`, 6 + `FAQPage` JSON-LD), footer |
| `/usluge.html` | `/en/services.html` | **14 service cards** + section cards, footer |
| `/plazma.html` | `/en/plasma-cutting.html` | 2 services + 2 capabilities + 5 info cards, own FAQ, footer |
| `/proizvodi.html` | `/en/products.html` | **6 category tabs**, listing cards, catalog tables, footer |
| `/reference.html` | `/en/references.html` | featured reference, **38 references**, footer |
| `/galerija.html` | `/en/gallery.html` | **73 tiles**, 5 filters, footer |
| `/kontakt.html` | `/en/contact.html` | **contact, company data, locations, maps**, terms Q&A, mailto form, footer |
| `/kalkulatori.html`, `/konfigurator.html`, `/404.html` | EN pairs | catalog.js only; footer / top bar contact |
| `/detalji/<slug>.html` ×47 | `/en/details/<slug>.html` ×47 | one product / service / capability |

Other files:
- `sitemap.xml` has 114 URLs.
- `.htaccess`: 404, deflate, expires, plus private-file blocking added in phase 2. It has no rewrites yet.
- Images: renders in `assets/render/<key>-light|dark.*`, legacy photos in `assets/old/foto/`, drawings in
  `assets/old/tr/`, documents in `assets/old/docs/`.

---

## 3. Content entities, relationships and inventory

All counts are per language. SR and EN always share one identity (slug or id).

| Entity | Source | Imported rows |
|---|---|---|
| Product category | `proizvodi.html` tabs (button, `h3`, `p.lead`) | 6 |
| Product | `items.js` `kind:product` | 31 |
| Product spec row | `items.js` `specs` | 128 |
| Product listing in a tab | `data-item` cards inside each tab panel | 24 |
| Service / capability | `items.js` `kind:service` / `capability` | 14 + 2 |
| Service spec row | `items.js` `specs` | 57 |
| Reference | `items.js` `kind:reference` + `reference.html` order/type | 38 (3 demand, 3 scope, 32 project) |
| Gallery category | `galerija.html` filters | 5 |
| Gallery image | `items.js` `kind:gallery` + `galerija.html` (`data-pos`) | 73 (59 photo, 14 render) |
| FAQ | `o-nama.html` / `en/about.html` `#faq2` | 6 |
| Contact | `kontakt.html` / `en/contact.html`, footer, `js/main.js` hours | 1 settings row, 2 locations, 6 phones |
| *Not in scope:* group / info records | `items.js` | 7 / 5 (stay static) |

**Relationships**
- **Primary category.** A product has one primary category, taken from the detail page's "Back" link:
  `limarija` items → `oluci`, `gazista` → `kovano`.
- **Tab listing** (`product_categories`) is a separate N—N relation:
  - The 8 flashings and `gazista` are listed in `oluci`.
  - `antikondenz-filc` is listed in both `krov` and `alati`.
  - `trapezni-lim`, `tr-60-210`, `oluci-i-vertikale` and `gradjevinska-limarija` are listed in no tab.
  - The `krov` profile **lineup** (`.lu`, TR 10–40 + crep drawings) is a fixed design block, not a listing.
- **Listing card overrides.** Card text on the products page often differs from the product record:
  - `Lamperija` instead of `Lamperija i lajsne`
  - Shorter blurbs
  - Fewer tags
  - A different render on `parapetni-lim`
  - One-line descriptions in the `oluci` list

  These are stored per listing as `card_*` overrides. An empty override means the product's own field is used.
- **Related items** (`related_slugs`): an ordered, comma-separated list of slugs of any kind, including static groups.
- **Calculator link** (`calc_id` / `calc_tabs`) points to `catalog.js` profiles, which stay file-based.
- Gallery category 1—N image. Location 1—N phone.

---

## 4. Database (implemented)

Source of truth: [database/001-schema.sql](database/001-schema.sql). InnoDB, `utf8mb4_unicode_ci`.
It runs on MySQL 5.7+ and MariaDB 10.3+.

Design rules:
- One row per record, with `<field>_sr` / `<field>_en` side by side. There are no per-language rows.
- Lists (tags, applications, emails) are stored one item per line. Descriptions are paragraphs separated by a blank line.
- **Media paths are relative to the site root with no leading slash** (`assets/old/tr/tr-35.jpg`, `uploads/products/2026/….jpg`).
  `media_url()` prepends `app.base_path`, so the same data works at the domain root and in a subfolder.
- Renders are stored as a key (`render_key = tr35` → `assets/render/tr35-light|dark.*`). Existing media stays where it is.

| Table | Purpose |
|---|---|
| `schema_imports` | markers `001-schema`, `002-existing-content` (import guard) |
| `admin_users` | single admin: `username`, `password_hash`, `last_login_at` |
| `admin_login_attempts` | rate limiting: `scope` (`login` / `setup`), SHA-256 of IP and username, `succeeded`, `attempted_at` |
| `categories` | `slug` (tab hash, immutable), `name` (tab), `nav_label` (submenu "Proizvodi"; empty = name), `heading`, `intro` (SR/EN), order, active |
| `products` | `slug`, `category_id` (primary), title / summary / description / tags / apps (SR/EN), image (`render` / `illu` / `photo`), drawing, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, order, active |
| `product_specs` | ordered `label` / `value` rows, SR+EN in one row |
| `product_categories` | tab listing + `card_title` / `text` / `tags` / `image` overrides (SR/EN) |
| `services` + `service_specs` | same content columns as products, plus `kind` (`service` / `capability`) and `icon_key` (list-row icon) |
| `client_references` | `ref_type` (`demand` / `scope` / `project`), title, summary (`<strong>` allowed), label (SR/EN), image + alt, `icon_key` (card icon) |
| `gallery_categories` / `gallery_images` | filter categories; images with fig no., caption, alt (SR/EN), photo or render, `crop_pos`, `zoom` |
| `faq_items` | question / answer (SR/EN), order, active |
| `contact_settings` | single row: hours (SR/EN + `open_hour` / `close_hour`), footer e-mail, company data, VAT docs, bank, Facebook, locations heading/intro |
| `contact_locations` | `prodaja`, `direkcija`: title, short name, street, postal code, place, city (SR/EN), purpose, e-mails, map query/title |
| `contact_phones` | `tel` (E.164) + `display_sr` / `display_en`, since SR shows `063 850 30 00` and EN shows `+381 63 850 30 00`; `in_footer` flag |

Changes from the phase 1 proposal:
- `admin_users.failed_logins/locked_until` were replaced by `admin_login_attempts`. This also counts attempts on unknown usernames.
- `services.section` was dropped. The section cards on `usluge.html` are curated by slug in the page template.
- `contact_phones` and the `card_*` overrides were added, so the existing text is preserved exactly.

---

## 5. SQL import (phpMyAdmin)

SQL files at a glance:

| File | Purpose | When |
|---|---|---|
| `database/001-schema.sql` | all tables (final schema) | **fresh installation**, step 1 |
| `database/002-existing-content.sql` | the existing site content (generated) | **fresh installation**, step 2 |
| `database/patches/003-products-module.sql` | optional upgrade | only for a database imported in phase 2 |
| `database/patches/004-services-references.sql` | optional upgrade | only for a database imported in phase 2 or 3 |

The admin start page shows whether a patch is still missing (it checks the columns the patches add).

There are two paths. Use exactly one of them.

**A — New installation (empty database):**
1. In phpMyAdmin, select the **existing** database (the one in `app/config.php`). No `CREATE DATABASE` is needed.
2. Import → `database/001-schema.sql`
3. Import → `database/002-existing-content.sql`
4. Open `https://<domain>/admin/setup-admin.php` (see section 7).

The canonical files already contain every correction. **Do not** import a patch on this path; if one is run anyway, it changes nothing.

**B — Database already imported earlier** (001 + 002 from an earlier phase): import the missing patches once, in order.

| Database imported in | Import |
|---|---|
| phase 2 (before the products module) | `database/patches/003-products-module.sql`, then `004-services-references.sql` |
| phase 3 (products module, already patched with 003) | `database/patches/004-services-references.sql` |

`003-products-module.sql`:
- Adds `categories.nav_label_sr/en` only if the columns are missing (checked through `information_schema`, then a prepared `ALTER`).
- Fills the nav labels only where they are empty.
- Restores `<strong>` in the three "Alati" card texts, but only where the text is still the originally imported value.
- Records the marker `003-products-module`.

`004-services-references.sql`:
- Adds `services.icon_key` and `client_references.icon_key` only if missing (same `information_schema` + prepared `ALTER` method).
- Sets the icon keys of the 14 imported services and 3 "demand" references, only where the key is empty and only on the first run (before the marker exists).
- Restores `<strong>` in the "Rad na visini" / "Velike količine" reference texts (SR and EN), only where the text is still the originally imported value.
- Records the marker `004-services-references`.

Both patches use no DROP, TRUNCATE or DELETE, never overwrite later admin edits, and running them again changes nothing.

Phases 4b and 4c needed **no schema or content change**, so there is no patch 005; both paths stay as above.

Repeat-import safety:
- `001` uses only `CREATE TABLE IF NOT EXISTS` plus an idempotent marker.
- `002` runs in one transaction. Every statement is `INSERT … SELECT … WHERE NOT EXISTS (marker 002)`, with
  explicit deterministic ids and `ON DUPLICATE KEY UPDATE id = id`. Child rows also require their parent's exact
  `id` + `slug`.
- Once the marker exists, re-importing changes nothing: no duplicates, no overwritten edits, no resurrected deletions.
- Neither file uses `DROP`, `TRUNCATE` or `DELETE`.
- Strings use only quote doubling (independent of `NO_BACKSLASH_ESCAPES`).

`002` is **generated** by `node _tools/db/build-existing-content.js`, a local, one-time tool that does not go to
the host. The tool reads the evaluated `js/items.js`, the SR/EN pages and `js/main.js`, then prints a report.
Last run:
- Rows: 6 / 31 / 128 / 24 / 16 / 57 / 38 / 5 / 73 / 6 / 1 / 2 / 6
- No missing translations
- All 393 statements checked against the schema (columns, lengths, NOT NULL)

---

## 6. Configuration (`app/config.php`)

`app/config.php` is the single configuration file, and `app/config.example.php` is the template. Since phase 5 the
deliverable ships **only the template**; `config.php` is created on the server by copying it (DEPLOYMENT.md, step 6),
so a later upload can never overwrite it. A missing `config.php` gives the generic 503. Values starting
with `CHANGE_ME` count as **not configured**. Until they are replaced, every PHP page returns a generic 503.
**Do not overwrite `config.php` when uploading later updates.**

| Key | Default | Meaning |
|---|---|---|
| `app.base_url` | `https://tricom.com` | scheme + host, no path, no trailing slash |
| `app.base_path` | `/` | install path; `/tricom/` for a subfolder (must start and end with `/`) |
| `app.timezone` | `Europe/Belgrade` | PHP and DB session time zone |
| `app.debug` | `false` | `true` shows exception details on the error page (temporary troubleshooting only) |
| `app.asset_version` | `2026-10-27` | `?v=` cache-buster for CSS/JS on every page; set a new value after uploading changed CSS/JS (an existing server keeps its own `config.php`, so raise it there by hand) |
| `db.host` / `db.port` | `localhost` / `3306` | |
| `db.name` / `db.user` / `db.pass` | `CHANGE_ME_…` | placeholders, to be filled by the owner |
| `security.setup_secret` | `''` | ≥16 chars to unlock `admin/setup-admin.php`; reset to `''` afterwards |
| `security.session_name` | `tricom_admin` | admin session cookie name |
| `security.session_idle_minutes` / `session_max_hours` | `30` / `8` | idle logout / absolute session lifetime |
| `security.force_https` | `true` | admin redirects `http://` → `https://` (set `false` only for local HTTP testing) |
| `security.login_max_per_user` / `login_max_per_ip` / `login_window_minutes` | `5` / `20` / `15` | failed logins allowed per (IP + username) / per IP in a sliding window |
| `security.trust_proxy_headers` | `false` | `true` only behind a proxy/CDN that sets `X-Forwarded-*` / `CF-Connecting-IP` |
| `uploads.max_mb` / `uploads.max_pixels` | `8` / `40000000` | per-file limits (the PHP `upload_max_filesize` / `post_max_size` also apply) |

Failure handling:
- A missing or incomplete config, an unreachable DB or a missing schema returns a **503** with a generic message and a reference code.
- The details go to `app/storage/logs/app-YYYY-MM.log`. The DB password and the setup secret are scrubbed from the log.
- `zend.exception_ignore_args` keeps arguments out of stack traces.
- Stack traces and messages are never shown publicly unless `app.debug` is `true`.

---

## 7. Admin (implemented)

- **First admin:**
  1. Set `security.setup_secret` in the config.
  2. Open `/admin/setup-admin.php` and enter the secret, a username (`[a-z0-9._-]{3,50}`) and a password (≥12 characters, ≤72 bytes, confirmed).

  The insert is atomic (`… WHERE NOT EXISTS (SELECT 1 FROM admin_users)`). After that the page always answers
  "already exists" (403) and tells the owner to **delete `admin/setup-admin.php`** and clear the secret.
  The dashboard also warns while either one remains. Setup attempts are rate-limited per IP (5 / 15 min).
- **Login / logout:**
  - `password_verify` runs even for unknown usernames, and the error message is generic.
  - Hashes are upgraded when needed, and the session id is regenerated on login.
  - Logout is POST + CSRF only.
- **Sessions:**
  - The cookie is scoped to `<base_path>admin/`, with HttpOnly, SameSite=Lax and Secure on HTTPS.
  - Strict mode is on, with idle and absolute timeouts.
  - Session files go to `app/storage/sessions` when it is writable.
- **CSRF:** a per-session token is required on every POST, and a cross-site `Origin` is rejected.
- **Headers:**
  - CSP `default-src 'none'` (self for CSS/JS/images)
  - `X-Frame-Options: DENY`
  - `nosniff`
  - `Referrer-Policy: same-origin`
  - `noindex`
  - `no-store`
  - HSTS on HTTPS
- **Shell:** `admin/index.php` is the start page:
  - one tile per module with row counts
  - "Brze radnje": a direct link per module to its most common action (new record, upload images, edit contact), plus the public page where the content appears
  - links to the public home pages (SR/EN) and `sitemap.xml`
  - import status of 001/002, and whether patch 003/004 is still needed
  - warnings (setup file present, setup secret set, patch missing)

  Module menu:
  - Kategorije proizvoda
  - Proizvodi
  - Usluge
  - Reference
  - Galerije
  - Česta pitanja
  - Kontakt

  `?m=<key>` loads `app/admin/modules/<key>.php` when it exists. Until then, a module notice is shown.
  All modules are built: Kategorije proizvoda, Proizvodi (§13), Usluge, Reference (§14), Galerije, Česta pitanja, Kontakt (§15).
- The admin interface is in Serbian Latin. It needs no JavaScript.

---

## 8. Shared helpers (`app/lib/`)

| File | Provides |
|---|---|
| `errors.php` | `AppUnavailableException` (503), `HttpException` (4xx with a safe message), handlers, `app_log()`, generic error page |
| `config.php` | `config_load()`, validation, placeholder detection, `config('a.b')` |
| `db.php` | `db()` (lazy PDO: utf8mb4, native prepares, exceptions), `db_run/all/one/value`, `db_insert/update`, `db_transaction`, `db_ident`, `db_table_exists`, `db_import_done` |
| `http.php` | `url()`, `absolute_url()`, `admin_url()`, `media_url()`, `render_path()`, `asset_url()`, `is_https()`, `client_ip()`, `redirect()` (internal only), `safe_admin_next()`, `enforce_https()` |
| `html.php` | `e()`, `e_lines()`, `e_paragraphs()`, `safe_url()`, `json_for_script()` |
| `i18n.php` | `LANGS`, `field($row, 'title', 'en')` with SR fallback, `field_lines/paragraphs`, `text_lines/paragraphs`, `missing_translations()` |
| `validate.php` | `input_str/int/bool/list` (UTF-8 check, control chars stripped), `is_valid_slug`, `slugify` (đ→dj), `Validator` (required, length, slug, email, url, sitePath, intRange, in) |
| `upload.php` | `upload_receive()`: JPEG/PNG/WebP (+PDF for documents), type detected from content, pixel limit, random name in `uploads/<dir>/<year>/`. Also `upload_delete()` (only inside `uploads/`) and limits/messages. |
| `session.php`, `flash.php`, `csrf.php`, `auth.php` | admin session, flash messages, CSRF, login/rate limiting/password policy |

### Web access protection
- `app/`, `app/storage/`, `database/` and `_tools/` each have a `.htaccess` that denies everything (Apache 2.2 and 2.4 syntax).
- Every PHP file in `app/` also starts with `defined('TRICOM') || exit;`.
- `uploads/.htaccess`:
  - Serves only `jpg|jpeg|png|webp|pdf` and denies scripts, HTML and SVG.
  - Removes PHP/CGI handlers and turns the PHP engine off where `mod_php` is used.
  - Sends `nosniff` and a sandboxing CSP.
  - Directory listing is blocked.
- The root `.htaccess` now also denies these anywhere on the site: dotfiles, `*.sql`, `*.md`, `*.log`, `*.bak`/`.old`/`.orig`/`.swp`, `*.ini`, `*.dist`, `*.sh`, `*.lock`, `*.env`, `*~`.

---

## 9. Existing URLs

Every current URL and hash stays the same. Rewrites cover **only the exact paths a built module owns**.
They are relative (no `RewriteBase`), so they also work from a subfolder. Implemented so far (§13):

| Public URL | Served by | Rule in |
|---|---|---|
| `proizvodi.html` | `proizvodi.php` | `.htaccess` |
| `usluge.html` | `usluge.php` | `.htaccess` |
| `reference.html` | `reference.php` | `.htaccess` |
| `detalji/<slug>.html` (products, services, capabilities) | `detalji.php?slug=` | `.htaccess` |
| `js/items.js` | `items-js.php` | `.htaccess` |
| `sitemap.xml` | `sitemap.php` (template `app/data/sitemap-pages.xml`) | `.htaccess` |
| `robots.txt` | `robots.php` (no database) | `.htaccess` |
| `konfigurator.html` | `konfigurator.php` (no database) | `.htaccess` |
| `en/configurator.html` | `en/configurator.php` (no database) | `en/.htaccess` |
| `en/products.html` | `en/products.php` | `en/.htaccess` |
| `en/services.html` | `en/services.php` | `en/.htaccess` |
| `en/references.html` | `en/references.php` | `en/.htaccess` |
| `en/details/<slug>.html` | `en/details.php?slug=` | `en/.htaccess` |
| `/`, `index.html`, `o-nama.html`, `galerija.html`, `kontakt.html`, `plazma.html`, `kalkulatori.html`, `404.html` | `index.php`, `o-nama.php`, … (same name, `.php`) | `.htaccess` |
| `en/`, `en/index.html`, `about.html`, `gallery.html`, `contact.html`, `plasma-cutting.html`, `calculators.html`, `404.html` | `en/index.php`, `en/about.php`, … | `en/.htaccess` |

`ErrorDocument 404` now points to `/404.php` and `/en/404.php` (always status 404). For a subfolder install, put the folder in front of both paths. No static `.html` page remains (§16).

- Requests to the `.php` entry points themselves are 301-redirected to the `.html` address. A rewritten request keeps its `.html` address in `REQUEST_URI`, so this cannot loop.
- `/index.php` and `/en/index.php` redirect to `/` and `/en/`. `/index.html` (the logo link on every page) serves the same page with `canonical` `/`, as the static site did, so there is one entry point and no extra redirect on each logo click.
- An unknown or inactive slug returns the 404 page (`404.php` / `en/404.php`) with status 404.
- Slugs of products, services, references and categories are immutable after creation.
- Products, services, capabilities, references and the static items in `js/items.js` share one slug namespace (`data-item`, `#item=`); the admin rejects a slug that is already used anywhere in it.
- **mod_rewrite is required.** Without it, these addresses (including the home page) return 404. Check `/` and `/proizvodi.html` right after deployment.
- **The database is required for every page except the configurator and `robots.txt`.** Those two need only `app/config.php`; an unreachable database gives the generic 503 page everywhere else.

---

## 10. Findings, open points and missing content

1. **Domain.** The config default is `https://tricom.com`, as instructed. All pages build canonical/OG/JSON-LD from
   `base_url`, as do `sitemap.xml` and `robots.txt`. The e-mail addresses are content and still use `tricom.rs`
   (`office@tricom.rs`…), imported unchanged. **Confirm the real domain before go-live.**
2. **English home FAQ wording differed from the English About FAQ.** The 6 questions are the same, but the EN
   phrasing differed in all six entries. The About wording was imported, and since §16 the home page renders the same
   records, so **the EN home FAQ now shows the About wording** (an existing, approved translation; nothing was
   newly translated). SR is identical on both pages. The SR home `FAQPage` JSON-LD listed only 4 of the 6 visible
   questions; it now lists all visible questions.
3. **Missing translations:** none. Every imported field has both SR and EN.
4. **Not managed (stay static):**
   - The `catalog.js` technical tables (also used by the calculators and configurator)
   - The kontakt "Uslovi poslovanja" Q&A (7) and the plazma FAQ (5)
   - The featured Karađorđevo reference with its counters (references page and home), the references marquee and the 462-partner list
   - Product cards in the `usluge.html#profilisanje` section (their own short texts)
   - The text of fixed tiles that point to records: the machine "cap" tiles on `usluge.html` (sečenje, savijanje), `plazma.html` and the home plasma block; the home lineup, showcase and program tiles; the profile lineup in the Krov tab; the product cards in `usluge.html#profilisanje`. Their text is curated page copy, their modals use the database records, and since §16 **a tile disappears when its record is hidden or deleted**.
   - The count in the services page heading ("Četrnaest usluga obrade" / "Fourteen …") is page copy and does not follow the number of services
   - Group/info records
   - Contact literals in `kb.js` / `kb.en.js` (assistant answers), `js/i18n/*.js` (form messages, calculator print footer), `print.css` and the configurator print stamp; see §15. The home and contact JSON-LD contact values come from the database since §16.
   - The non-contact parts of the home JSON-LD (description, founding year, names, the Ugrinovci hall entry)
5. **Placeholders already in the source:**
   - `TEMP: confirm with client` comments on `maloprodaja@tricom.rs`, the bank account, the "founded 1992" date and the opening hours
   - Temporary photos `assets/tricom-1/2/3`
   - `catalog.js` TEMP values

   They were imported as they are.
6. **Verification so far:**
   - In phase 3, a portable PHP 8.3 build (scratchpad only, not part of the project) was used for `php -l` on all PHP files and for the template parity check in §13.
   - In phase 4a the same build was used for `php -l` on the changed files, the template parity check in §14, and one render of the new admin views with sample rows (no database).
   - In phase 4b: `php -l` on all PHP files, the parity check extended to every converted page (§15), and one render of the new admin views with sample rows. Uploads (including multi-file upload and thumbnails) were not exercised.
   - In phase 4c (§16): `php -l` on all 137 PHP files; the parity check over all 116 pages (including both configurator pages); one render each of hidden records, empty lists, `sitemap.xml`, `robots.txt` and the admin start page with sample rows.
   - No MySQL/MariaDB is available locally. The SQL was checked structurally against the schema but not executed, and the admin screens have not been run against a database.
   - Running both belongs to the final QA phase.
7. **Hosting requirements:**
   - PHP 8.3 with `pdo_mysql`, `mbstring` and `fileinfo` (GD is optional, for later image work)
   - Apache `.htaccess` with `AllowOverride` for auth, FileInfo, headers and **mod_rewrite** (required since phase 3)
   - Writable `app/storage/logs`, `app/storage/sessions` and `uploads/`

---

## 11. Files changed in phase 2

New:
- `app/.htaccess`, `app/config.php`, `app/config.example.php`, `app/bootstrap.php`
- `app/lib/{errors,config,db,http,html,i18n,validate,upload,session,flash,csrf,auth}.php`
- `app/admin/admin.php`, `app/views/admin/{layout,layout-bare,login,setup,dashboard,module}.php`
- `app/storage/.htaccess`, `app/storage/logs/index.html`, `app/storage/sessions/index.html`
- `admin/.htaccess`, `admin/index.php`, `admin/login.php`, `admin/logout.php`, `admin/setup-admin.php`, `admin/assets/admin.css`
- `uploads/.htaccess`, `uploads/index.html`
- `database/.htaccess`, `database/001-schema.sql`, `database/002-existing-content.sql` (generated)
- `_tools/.htaccess`, `_tools/db/build-existing-content.js` (local tool, not deployed)

Modified:
- `.htaccess`: header comment, plus the private-file `FilesMatch` block. The existing rules are unchanged.
- `TRICOM_IMPLEMENTATION.md` (this file)

Not deployed to the host: `_tools/`, `README.md`, `TRICOM_IMPLEMENTATION.md`. `database/` may be uploaded, since it is
access-denied, but it is only needed in phpMyAdmin.

---

## 12. Next phases

4. **Remaining modules**, each built the same way as §13/§14 (admin screens, then its pages as PHP views generated from the existing markup, plus narrow rewrites):
   - ~~Services~~, ~~References~~ — done (§14)
   - ~~Galleries~~, ~~FAQ (About)~~, ~~Contact~~ — done (§15)
5. **Final phase:** full QA. The checklist is in §16, "Must be checked in the final phase". The deployment notes are in §16; the README hosting section was corrected in §16.

---

## 13. Product categories and products module (phase 3)

### Public frontend
- **Products page** (`proizvodi.html`, `en/products.html`):
  - `app/views/site/products/page-{sr,en}.php` was generated from the finished page by `_tools/site/convert-products.js`.
    Only the parts that come from the database are PHP:
    - the "Proizvodi" submenu (header and mobile)
    - the tab buttons
    - the tab panels
    - the asset version and domain
  - Each existing tab keeps its static design content (catalog tables, exploded drawings, lineup, lists) in
    `panel-{sr,en}-<slug>.php`. Its heading, intro and cards come from the database.
  - Card style follows the tab, as before: `pcard` (krov, cevi), list `prog__i` (oluci), text `card` (alati).
  - A **new category** gets a generic tab: heading, intro and a `pcard` grid.
  - Products assigned to a tab that had no cards (limovi, kovano) are appended as a `pcard` grid.
  - Hidden categories have no tab and no submenu entry.
- **Product detail pages** (`detalji/<slug>.html`, `en/details/<slug>.html`):
  - One template, `app/views/site/detail/page.php`, reproduces the old generator's markup:
    - pagehead, description, technical-data table, applications with image or factory drawing
    - calculator section (only with `calc_id`, which also adds `kalkulator.css` and the calc scripts)
    - related cards (max 6)
    - inquiry CTA with the same `konfig=` prefill, JSON-LD, and the inline item subset for the modal
  - Header, menu, footer and scripts are verbatim partials (`{sr,en}-{head,top,bottom,tail}.php`).
    The only change: the stray `aria-current` on "Usluge" in the old detail-page footer was removed.
  - New products get both URLs automatically, and the language switch targets the same slug through `hreflang`.
  - For subfolder installs, PHP pages add `<html data-site-path>`, and `js/lang.js` strips that prefix (small backward-compatible change).
- **`js/items.js`** (`items-js.php`):
  - Sends the unchanged static file plus a small override in which active products from the database replace the file's product records.
  - Every page's modal (home lineup, services profiling cards and so on) therefore shows current product data with no HTML change.
  - Sent with `no-cache` + ETag.
- **`sitemap.xml`** (`sitemap.php`): the static file, with product detail entries regenerated from active products and the domain taken from `app.base_url`.
- **Service pages:** in phase 3 `detalji.php` passed the 16 static service/capability pages through; since §14 they are rendered from the database with the same template.
- **Parity check:** the 62 product pages plus both products pages were rendered locally from the same rows as the SQL and compared with the original static files. Whitespace, attribute order and the unused legacy item field `cat` were normalized. Result: **64/64 identical**. The `items.js` output matches all 170 records semantically.
- **Removed static files:** `proizvodi.html`, `en/products.html` and the 62 product detail pages. Snapshots are in `_tools/source/` (not deployed), so the import and conversion tools can be re-run.
  **When updating an existing server, delete those files there too** (the rewrites take precedence anyway).

### Admin (`admin/index.php?m=kategorije`, `?m=proizvodi`)
- **Categories:**
  - List with order numbers, visibility and counts (primary products / tab cards).
  - Bilingual form: tab name, submenu label, heading, intro. The slug can be set only when creating.
  - Delete: a confirmation page lists the products whose primary category this is. They **must be moved** to a chosen category first.
    The tab's cards are removed; products are never deleted with a category. If it is the only category and has products, the page suggests hiding it instead.
- **Products:**
  - List with category filter, search, order, status, thumbnail and missing-EN hints.
  - **Form sections:**
    - basic data: slug (create only), primary category, order, visibility
    - SR | EN side by side: name, summary, description (paragraphs), tags and applications (one per line)
    - technical data rows, image, factory drawing, calculator/configurator, related slugs (validated against all known items)
    - tab listings, with optional per-tab card title/text/tags/image/alt
  - **Technical data:**
    - Rows with label and value per language.
    - Add, move up/down (small `admin/assets/admin.js`) and remove. Without JS: three blank rows and an order number.
    - Units and symbols are kept as written, and line breaks become `<br>`.
    - An empty EN value falls back to SR (for language-neutral values).
    - There are no spec groups: every product has a single "Osnovni podaci" table. The grouped catalog tables stay in `catalog.js`.
  - **Images:**
    - Choose an existing render (`assets/render`) or an existing illustration (trusted SVG from the old site), or upload a JPG/PNG/WebP photo (`uploads/products/<year>/`).
    - Factory drawing ("document"): pick an existing one in `assets/old/tr/` or upload an image (`uploads/products/drawings/<year>/`).
    - **No new SVG uploads.** Uploads are type-checked server-side, randomly named and non-executable.
  - **Card text in tabs** allows only `<strong>`; everything else is escaped (`e_rich()`).
  - **Delete:**
    - The confirmation lists the tabs, the related links that will be removed from other products/services, and warns when a still-static page (home, services) shows the product's card.
    - Specs and tab cards cascade, and the slug is removed from other items' related lists.
    - Uploaded files are deleted **only if no other record uses them**. Files in `assets/` are never deleted.
- Saving runs in one transaction. Uploads happen only after validation passes, and are removed again if the save fails.
  Replaced or cleared uploads are cleaned up after commit, under the same "not used elsewhere" rule.

### Data notes
- The public pages load the catalog tables once per request (tens of rows) and work in memory: `app/site/catalog.php`.
- `app/data/items-static.json` holds group records (related links to existing pages) and the trusted SVG illustrations. It is generated by the builder.
- Not handled by this module:
  - the home lineup/program tiles and the `usluge.html#profilisanje` product cards keep their text; their modals use DB data, and since §16 they disappear with a hidden or deleted product. The submenu now comes from the database on every page (§15).
  - the TR 40/230 PDF guide (catalog statics)
  - `catalog.js` tables, calculators and configurator (unchanged)

### Files (phase 3)
New:
- Entry points: `proizvodi.php`, `detalji.php`, `items-js.php`, `sitemap.php`, `en/products.php`, `en/details.php`
- Public layer: `app/site/{site,catalog,products}.php`, `app/data/items-static.json`
- Views: `app/views/site/products/{page-sr,page-en,panel-sr-*,panel-en-*}.php`, `app/views/site/detail/{page,sr-*,en-*}.php`
- Admin: `app/admin/{form,catalog-admin}.php`, `app/admin/modules/{kategorije,proizvodi}.php`
- Admin views: `app/views/admin/{categories-list,category-form,category-delete,products-list,product-form,product-delete}.php`
- `admin/assets/admin.js`
- Patch: `database/patches/003-products-module.sql`
- Local tools: `_tools/site/convert-products.js`, `_tools/source/` (snapshot of the removed pages)

Modified:
- `.htaccess` (narrow rewrites), `en/.htaccess` (narrow rewrites)
- `js/lang.js` (subfolder prefix)
- `database/001-schema.sql` (`categories.nav_label_*`)
- `database/002-existing-content.sql` (regenerated: nav labels, `<strong>` in card texts)
- `_tools/db/build-existing-content.js` (nav labels, rich card text, patch, static items, fixtures)
- `admin/assets/admin.css`, `TRICOM_IMPLEMENTATION.md`

Removed: `proizvodi.html`, `en/products.html`, `detalji/<31 product slugs>.html`, `en/details/<31 product slugs>.html`.

---

## 14. Services and references modules (phase 4a)

### What the existing pages contain (findings)
- **`usluge.html` / `en/services.html`:**
  - Section 01 "Sve usluge" is the services listing: 14 rows, one per `kind = service` record, in record order.
    A row shows a running number (01…), a line icon, the title, the summary, and the first two tags (first one bold).
  - Sections 02–03 contain machine "cap" tiles with curated text (for example three tiles for `savijanje-limova`). They are page copy, not records.
  - Section 04 holds product cards (products module, static text). Sections 05–07 are page copy.
- **Service detail pages** (16 + 16, `detalji/`, `en/details/`) were made by the same generator as the product pages. Differences:
  - ghost word and marker: Usluga / Mogućnost mašine
  - parent link: Usluge → `usluge.html`, CNC plazma → `plazma.html`
  - "Back" button and breadcrumb JSON-LD follow the parent link
  - `Service` JSON-LD instead of `Product`
  - no calculator
- **Capabilities** (`radni-sto`, `ponovljivost`) have no list. They appear as detail pages, as tiles on `plazma.html` and in the home plasma block.
- **`reference.html` / `en/references.html`:**
  - 3 "demand" cards: icon, image (one temporary photo, two renders) and text with `<strong>`.
  - 3 "scope" cards: title and text.
  - 32 "project" rows: title, text and label.
  - References have **no detail pages**; they open in the modal, with previous/next navigation between cards of the page.
  - Every reference has at most one image, and no gallery exists, so no multi-image support was added.
  - Page copy: the Karađorđevo highlight with counters, the marquee and the partner list.
- **Home page and navigation:**
  - No service or reference records are listed on the home page. Its plasma block has three cap tiles; the Karađorđevo block is page copy.
  - The "Usluge" submenu links to page sections, not records.
  - The home page therefore needed no conversion: its tiles open the database records through `js/items.js`.

### Public frontend
- **Services page:** `app/views/site/services/page-{sr,en}.php` (generated by `_tools/site/convert-services-references.js`).
  - The listing rows and the "Proizvodi" submenu come from the database (`site_service_rows()` in `app/site/services.php`). Everything else is the original markup.
  - Hidden services drop out of the list. A new service gets a row in the same design, with the icon chosen in the admin.
- **Service and capability detail pages:** `detalji.php` / `en/details.php` now render active services and capabilities with the product detail template.
  - `site_detail_page()` and `site_detail_model($row, $L, $kind)` generalize the phase 3 code.
  - The kind-specific texts are in `site_detail_kind_labels()`.
  - A new service gets both URLs automatically, and the language switch targets the same slug.
- **References page:** `app/views/site/references/page-{sr,en}.php`. The three card groups come from the database (`site_reference_cards()` in `app/site/references.php`).
  - Card text allows only `<strong>` (`e_rich()`).
  - Demand-card images:
    - renders use the light/dark `rg-pic` pair, with the frame shape cycling a/b/c by position, as before
    - the temporary `assets/tricom-N.jpg` photos keep their decorative frame
    - uploaded photos fill the same `rg-cap` frame
- **`js/items.js`:** the database now replaces all products, services, capabilities and references (`SITE_DB_KINDS`). The modal therefore shows current data on every page, including still-static ones (home, plazma). Gallery, info and group records still come from the file.
  - Reference text is sent without `<strong>`, as before.
- **`sitemap.xml`:** detail entries for active products **and services** come from the database. Detail priority is now 0.6, as in the static file (phase 3 used 0.7).
- **Icons:** `app/data/icons.json` holds the 14 service row icons and 3 reference card icons taken from the existing pages (trusted SVG). Records store only a key (`icon_key`). No SVG can be uploaded.
- **Parity check:** the same rows as the SQL were rendered and compared with the original static files, using the same normalization as §13.
  - **100/100 pages identical:** 62 product detail pages, 32 service/capability detail pages, and the products, services and references pages in SR and EN.
  - `items.js`: all 170 records match.
- **Removed static files:** `usluge.html`, `en/services.html`, `reference.html`, `en/references.html` and the 32 service detail pages. Snapshots are in `_tools/source/`.
  **Delete them on an existing server too** (the rewrites take precedence anyway).

### Admin (`?m=usluge`, `?m=reference`)
- **Shared code:** products and services use the same content helpers in `app/admin/catalog-admin.php`:
  - `adm_content_input` / `_validate` / `_uploads` / `_data`
  - `adm_specs_input`, `adm_save_specs`, `adm_specs_of`
  - `adm_related_mentions`, `adm_drawing_choices`

  The shared form partial is `app/views/admin/content-fields.php`. The products module was moved onto them with no change in behavior.
- **Usluge:**
  - **List:** kind filter, order numbers, thumbnail, icon, spec count, status, and a link to the public page.
  - **Form:**
    - basic data: slug (create only), kind (service / CNC plasma capability), order, visibility, icon picker with previews
    - SR | EN content and technical data rows (add, move, remove), as for products
    - image (render, illustration or uploaded photo), factory drawing, related slugs
    - no calculator or configurator, since no service uses them
  - **Delete:**
    - The confirmation lists the related links that will be removed.
    - It warns when a fixed page tile (usluge sections, plazma, home) carries the slug.
    - Specs cascade, and uploads are deleted only when no other record uses them.
- **Reference:**
  - **List:** type filter, order within the type, status, and a link that opens the card on the site (`reference.html#item=<slug>`).
  - **Form:**
    - slug (create only; suggestion `ref-<title>`), type, order, visibility
    - SR | EN title, text (`<strong>` allowed) and label
    - image (render or uploaded photo) with alt text, and an icon picker
  - **Delete:** confirmation; the uploaded photo is removed only if no other record uses it.
- **Slug checks:** a new product, service or reference slug must be unused across products, services, references, static groups and the remaining `items.js` records.
- **Uploads** use the shared `upload_receive()`: JPG/PNG/WebP only, checked server-side, randomly named, stored in `uploads/services/…` and `uploads/references/…`, not executable.

### Data and SQL
- **Schema:**
  - `services.icon_key` and `client_references.icon_key` (`VARCHAR(60) NULL`, after `image_alt_en`)
  - `client_references.summary_*` may contain `<strong>`
- **Fresh install:** `001` and `002` already contain both changes (002 was regenerated).
- **Existing database:** `database/patches/004-services-references.sql`, as described in §5.

### Known limitations
- The cap tiles, the Karađorđevo highlight, the marquee, the partner list and the heading count stay page copy.
  ~~If a service is hidden or deleted, its tiles stay visible but no longer open.~~ Since §16 such tiles disappear with the record.
- The admin screens and both patches have not been run against MySQL/MariaDB (final QA phase).

### Files (phase 4a)
New:
- Entry points: `usluge.php`, `reference.php`, `en/services.php`, `en/references.php`
- Public layer: `app/site/services.php`, `app/site/references.php`, `app/data/icons.json`
- Views: `app/views/site/services/page-{sr,en}.php`, `app/views/site/references/page-{sr,en}.php`
- Admin: `app/admin/modules/{usluge,reference}.php`
- Admin views:
  - `app/views/admin/{content-fields,services-list,service-form,service-delete,references-list,reference-form,reference-delete}.php`
- Patch: `database/patches/004-services-references.sql`
- Local tools: `_tools/site/convert-lib.js`, `_tools/site/convert-services-references.js`

Modified:
- `.htaccess`, `en/.htaccess` (four exact rewrites)
- `detalji.php`, `en/details.php`
- `app/site/{site,catalog,products}.php`, `app/views/site/detail/page.php`
- `app/admin/catalog-admin.php`, `app/admin/modules/proizvodi.php`, `app/views/admin/{product-form,product-delete}.php`
- `admin/assets/admin.css`
- `database/001-schema.sql`, `database/002-existing-content.sql` (regenerated)
- `_tools/db/build-existing-content.js`, `_tools/site/convert-products.js` (uses `convert-lib.js`)
- `TRICOM_IMPLEMENTATION.md`

Removed (snapshots in `_tools/source/`):
- `usluge.html`, `en/services.html`, `reference.html`, `en/references.html`
- `detalji/<16 service slugs>.html`, `en/details/<16 service slugs>.html`

---

## 15. Galleries, About FAQ and contact information (phase 4b)

### What the existing pages contain (findings)
- **Gallery (`galerija.html` / `en/gallery.html`):**
  - One flat gallery with **categories, no albums**: five filter buttons after "Sve"/"All", and 73 tiles (59 photos, 14 light/dark renders).
  - A tile carries a category tag, a caption and a grid label (`data-figlabel`).
    - The original labels shorten long captions differently per language: SR after 38 characters, EN at the last word within 37 characters. Both rules are reproduced.
  - `js/main.js` drives the filter and the lightbox: "FIG. NN / total · CATEGORY", the full image from `data-full`, the caption from `data-cap`.
  - The modal reads `js/items.js` (kind `gallery`).
  - Photos use `-310w` / `-620w` WebP variants.
  - Crop positions come from `css/components.css` (`data-pos`; all existing photos use `tl`).
  - The `zoom` column has no CSS counterpart and stays unused.
- **About FAQ:**
  - `#faq2` accordion with 6 questions, plus a `FAQPage` JSON-LD block (EN adds `inLanguage`).
  - The home page has its own FAQ block with different EN wording. Since the request covers only the About page, the home FAQ **stays page copy**.
- **Contact data** appears on every page in the same shared places:
  - header phone
  - mobile-menu contact (phone, e-mail, address, hours)
  - footer call button and hours, footer social links (Facebook, e-mail, phone)
  - footer contact table (both locations with their footer phones, e-mail, hours, PIB), PIB in the bottom line
  - "Pozovite …" / "Call …" buttons in page call-to-action bands
  - The contact page adds: the hours badge, two location blocks (address, all phones, e-mails, hours), the company block, two map cards (Google map loaded only after a click) and the "Lokacije" heading and intro.
- **Contact form:**
  - It has **no server submission**. `js/main.js` validates it and opens the visitor's e-mail program with a prefilled `mailto:` message to `office@tricom.rs`.
  - No SMTP, API or external form service exists or is needed, so none was added.
  - The behavior is unchanged. Only the recipient now comes from the settings (`<form data-mailto>`); the old address remains the fallback.
  - **For the handover:** inquiries arrive only if the visitor actually sends the prepared e-mail from their own program. Nothing is stored or sent by the site.

### Public frontend
- **Remaining pages are PHP views** (`app/views/site/pages/{home,about,gallery,contact,plasma,calculators,404}-{sr,en}.php`), generated by `_tools/site/convert-pages.js` with the shared `contactChrome()` in `convert-lib.js`.
  - The products, services, references and detail views were regenerated with the same function. **Every page except the configurator** now takes the shared contact data and the "Proizvodi" submenu from the database.
  - The phase 3 limitation "submenu on still-static pages" is resolved.
- **Contact** (`app/site/contact.php`):
  - `site_c()` returns single values: primary phone = first phone of the first location; e-mail; short address; hours; PIB; Facebook.
  - `site_footer_sheet()` builds the footer contact table.
  - `site_contact_blocks()` and `site_contact_locs()` build the contact-page blocks and map cards. Map URLs are always built from the stored query as `https://www.google.com/maps?...`, never taken as entered.
  - The footer hours element carries `data-open` / `data-close`, so the "Open / Closed" status follows the settings. `js/main.js` falls back to 9–17.
- **Gallery** (`app/site/gallery.php`):
  - Filters come from visible categories that have visible images.
  - Tiles reproduce the existing markup (photo with responsive variants, or light/dark render).
  - Uploaded photos use their own WebP variants when the server could create them; otherwise the file itself is shown.
- **FAQ** (`app/site/pages.php`): the accordion and the `FAQPage` JSON-LD come from visible records. The JSON-LD is omitted when no record is visible.
- **404:** `site_not_found()` renders the 404 view. `<base>` follows `app.base_path`, which fixes the 404 page in a subfolder install.
- **`js/items.js`:** gallery records now also come from the database (`SITE_DB_KINDS`). Only group and info records still come from the file.
- **Parity check:** the same rows as the SQL were rendered and compared with the original files, using §13's normalization plus removal of HTML comments and the three new attributes (`data-open`, `data-close`, `data-mailto`).
  - **114/114 pages identical:** all list pages, 94 detail pages, and home, About, gallery, contact, plasma, calculators and 404 in SR and EN.
  - `items.js`: 170/170 records match.
  - HTML comments are not reproduced on the contact and gallery pages: the `TEMP: confirm with client` notes and `OLD SITE PHOTO` marks. The TEMP items are listed in §10 item 5. The OLD SITE PHOTO mark is emitted again for every photo under `assets/old/foto/`.
- **Removed static files:** `index.html`, `o-nama.html`, `galerija.html`, `kontakt.html`, `plazma.html`, `kalkulatori.html`, `404.html` and their EN pairs. Snapshots are in `_tools/source/`. **Delete them on an existing server too.**

### Admin
- **Galerije (`?m=galerije`):**
  - **Images:**
    - **List:** category filter, thumbnail, FIG number, captions SR/EN, status.
    - **Bulk actions:** "save order" and "delete selected" (with a confirmation page).
  - **Multiple upload:**
    - Pick a category and up to 30 JPG/PNG/WebP files at once, with an optional shared caption and alt text in SR/EN.
    - Each file gets the next FIG number and a free `g-NN` slug.
    - Images without an SR caption are saved **hidden** until a caption is added.
    - A failed file is reported and does not stop the others.
  - **Edit:**
    - caption and alt text SR/EN, category, FIG number, order, visibility
    - crop position (the CSS values)
    - photo replacement, or switching to an existing render
  - **Delete:** one image or the selected images. A file in `uploads/` is deleted only if no other record uses it (`adm_cleanup_files`); `assets/` files are never deleted.
  - **Categories (the filters):** add, edit SR/EN name, order, hide.
    - Deleting a category that has images requires moving them to another category first.
    - The last remaining category with images cannot be deleted; hiding is suggested instead.
- **Česta pitanja (`?m=pitanja`):** list with order and visibility; add, edit and delete. Question and answer are side by side in SR and EN, plain text, with paragraphs separated by a blank line.
- **Kontakt (`?m=kontakt`):** one settings form.
  - **Shared values:** e-mail (also the form recipient), Facebook URL and label, opening/closing hour, PIB, registration number, activity code, bank, director.
  - **Translated text:** hours, VAT text, business activity, founding text, the "Lokacije" heading and intro.
  - **Locations:** the two existing ones are edited, not added or removed.
    - title and short name (SR/EN), street, postal code, place, city (SR/EN), purpose (SR/EN)
    - e-mails (one per line), map query and map title (SR/EN), order
    - phones: call number, SR/EN display, "in footer", order; add or remove rows
  - **VAT documents:** the certificate and register record can be replaced with an uploaded PDF or image.
  - **Validation:**
    - e-mail format
    - Facebook only as `https://` on facebook.com / fb.com hosts
    - map query only as coordinates or plain address characters
    - call numbers in `+381…` form; display text limited to digits, spaces and `+ ( ) / -`
    - hours 0–24 with closing after opening; at least one phone
    - digits only for PIB, registration number and activity code
  - Everything is stored and printed as escaped plain text; no HTML is accepted anywhere.
- **Shared media handling** (`app/lib/upload.php`):
  - `upload_files()` and `upload_receive_file()` add multi-file uploads with the same server-side checks as before.
  - `upload_make_variants()` creates `-310w` / `-620w` WebP thumbnails only when GD with WebP support and enough memory are available.
  - `upload_delete()` also removes those variants.
- **Slug namespace:** `adm_slug_taken()` now also covers gallery images. `adm_static_mentions()` scans the generated views instead of the removed static files.

### Data and SQL
- No schema or content change. `001` / `002` are unchanged, and **no patch is needed**: a database imported in an earlier phase only needs the earlier patches (§5).
- The generator now also writes gallery, FAQ and contact rows to the local fixtures. It accepts the new form of the hour fallbacks in `js/main.js`.

### Known limitations
- **Contact literals that stay static:**
  - assistant knowledge base (`js/kb.js`, `js/kb.en.js`)
  - form and print strings in `js/i18n/*.js` (for example "write to office@tricom.rs" after the form opens the e-mail program)
  - `print.css`, the configurator print stamp
  - ~~the home-page JSON-LD (`Organization`, `LocalBusiness` with address, geo coordinates and hours)~~: its contact values come from the settings since §16

  If an address, phone or e-mail changes, these also need a manual edit.
- ~~The home-page FAQ is page copy (see findings).~~ Since §16 it renders the same records as the About FAQ.
- Thumbnails for new gallery photos depend on GD WebP support on the host. Without it the full upload is shown in the grid.
- Admin flows and uploads have not been run against MySQL/MariaDB or a real upload (final QA phase).

### Files (phase 4b)
New:
- Entry points:
  - `index.php`, `o-nama.php`, `galerija.php`, `kontakt.php`, `plazma.php`, `kalkulatori.php`, `404.php`
  - `en/{index,about,gallery,contact,plasma-cutting,calculators,404}.php`
- Public layer: `app/site/{gallery,contact,pages}.php`
- Views: `app/views/site/pages/{home,about,gallery,contact,plasma,calculators,404}-{sr,en}.php`
- Admin: `app/admin/modules/{galerije,pitanja,kontakt}.php`
- Admin views:
  - `app/views/admin/{gallery-list,gallery-upload,gallery-form,gallery-delete,gallery-cats,gallery-cat-form,gallery-cat-delete,faq-list,faq-form,faq-delete,contact-form}.php`
- Local tool: `_tools/site/convert-pages.js`

Modified:
- `.htaccess`, `en/.htaccess` (exact rewrites, `ErrorDocument` → PHP 404)
- `js/main.js` (hours and form recipient from data attributes, same fallbacks)
- `app/lib/upload.php` (multi-file, variants, variant cleanup)
- `app/site/{site,catalog,products}.php`
- `app/admin/{admin,catalog-admin}.php`
- Regenerated views (contact partials): `app/views/site/{products,services,references}/page-{sr,en}.php`, `app/views/site/detail/{sr,en}-{top,bottom}.php`
- `_tools/site/{convert-lib,convert-products,convert-services-references}.js`, `_tools/db/build-existing-content.js`
- `TRICOM_IMPLEMENTATION.md`

Removed (snapshots in `_tools/source/`):
- `index.html`, `o-nama.html`, `galerija.html`, `kontakt.html`, `plazma.html`, `kalkulatori.html`, `404.html`
- `en/index.html`, `en/about.html`, `en/gallery.html`, `en/contact.html`, `en/plasma-cutting.html`, `en/calculators.html`, `en/404.html`

---

## 16. Final integration and deployment (phase 4c)

### Integration completed in this phase
- **Home page, same records as the managed pages:**
  - **FAQ:** the `#faq` accordion and its `FAQPage` JSON-LD render the FAQ records, as on About (`site_faq_items($faq, $L, 'faq')`). EN wording: see §10 item 2.
  - **Fixed tiles** (lineup, showcase, program, CNC plasma caps) keep their curated text, but each one is shown only while its product or service is active (`site_item_on()`). This also covers the cap tiles and profiling cards on the services page, the plasma page tiles and the profile lineup in the Krov tab. Static group tiles (`limovi`, `cevi-i-zp-profili`, …) are unaffected.
- **Structured data (JSON-LD) from the contact settings:** `Organization` and `LocalBusiness` on the home page and `LocalBusiness` on the contact page (SR/EN).
  - From the settings: phones, e-mail, Facebook (`sameAs`), PIB, legal name (without typographic quotes), registration number, activity code, the address of each location, coordinates (only when the map query is "lat,lng") and opening hours.
  - Rule: the `Organization` address is location `direkcija`; the `#prodaja` business uses location `prodaja` (location slugs are fixed).
  - Names, description and the Ugrinovci hall stay page copy. An empty value drops its key.
  - The street now prints as stored (`16–18` with an en dash instead of `16-18`).
- **Empty states:** a short SR/EN note with a link to the contact page instead of an empty list (`site_empty()`, style `.empty-note` in `css/base.css`). It appears for:
  - services list, each reference group, gallery
  - FAQ (About and home; the `FAQPage` JSON-LD is then omitted)
  - a new category tab without products, and the products page without any visible category
- **Configurator:** `konfigurator.html` / `en/configurator.html` are PHP views now (`app/views/site/pages/configurator-{sr,en}.php`) for one reason: `canonical`/`hreflang`/OG take the domain from `app.base_url`, and `?v=` from `app.asset_version`, like every other page.
  - No database. Markup, scripts and configurator logic are unchanged (parity check identical).
- **`robots.txt`:** `robots.php`, same content, with the sitemap address from `app.base_url`. No database. It only takes effect at the domain root, so a subfolder install can't serve a working one.
- **`sitemap.xml`:** generated on each request (no cron, nothing to run after edits).
  - Fixed pages come from the template `app/data/sitemap-pages.xml` (20 entries, moved from the root `sitemap.xml`).
  - Detail pages are added for active products, services and capabilities only.
  - `lastmod` of a list page is its template date or the newest `updated_at` among the records it shows, whichever is newer. Deleting a record does not move `lastmod`.
- **Admin start page:** quick actions, public links and patch status (§7). The FAQ and contact module texts now name the home page too. The delete warnings for products and services now say a fixed tile disappears with the record.
- **Cleanup:**
  - removed the empty `detalji/` and `en/details/` folders, the root `sitemap.xml` and `robots.txt`
  - static configurator pages moved to `_tools/source/`
  - no debug output (`var_dump`, `print_r`, `phpinfo`, `console.log`) and no test or development endpoint in the deliverable
  - `app.debug` is `false`
  - `asset_version` raised to `2026-10-27`
  - README "Postavljanje na hosting" corrected (it still described a static site)
- **Unchanged and verified:** URLs and hashes, SR/EN switching through `hreflang` (also for new records), relative asset/upload paths at root, `/en/` and both detail depths, the `<base>` of the 404 page, real 404 status for unknown/inactive slugs, escaping (`e()`, `e_rich()` for `<strong>` only, JSON through `site_json()` with `JSON_HEX_TAG`).

### Deployment file inventory
**Upload** (Apache shared hosting, document root or a subfolder):

| Path | Contents |
|---|---|
| `.htaccess` | rewrites, 404, compression, caching, private-file block |
| `index.php`, `o-nama.php`, `proizvodi.php`, `usluge.php`, `reference.php`, `galerija.php`, `kontakt.php`, `plazma.php`, `kalkulatori.php`, `konfigurator.php`, `404.php`, `detalji.php`, `items-js.php`, `sitemap.php`, `robots.php` | public entry points |
| `en/` | `.htaccess` + `index`, `about`, `products`, `services`, `references`, `gallery`, `contact`, `plasma-cutting`, `calculators`, `configurator`, `404`, `details` `.php` |
| `admin/` | admin entry points, `assets/admin.css`, `assets/admin.js`; **delete `admin/setup-admin.php` after creating the admin** |
| `app/` | code, views, `data/`, `storage/` (+ `config.php`, filled in on the server only) |
| `assets/`, `css/`, `js/` | unchanged front end; `js/items.js` stays, it is the base that `items-js.php` extends |
| `uploads/` | `.htaccess` + `index.html` only (must be writable) |

**Do not upload:** `_tools/` (local converters, generator, snapshots), `README.md`, `TRICOM_IMPLEMENTATION.md`.
`database/` is only needed in phpMyAdmin; upload it only if that is easier (it is access-denied).

**Runtime dependencies:** none beyond PHP itself (no Composer, no vendor PHP libraries, no Node, no cron, no background workers). `js/vendor/three.min.js` is the existing front-end library and is part of `js/`.

**Server requirements:**
- PHP 8.3 with `pdo_mysql`, `mbstring`, `fileinfo` (GD with WebP is optional, for gallery thumbnails)
- MySQL 5.7+ / MariaDB 10.3+
- Apache with `.htaccess` (`AllowOverride` incl. FileInfo, so `RewriteEngine`/`ErrorDocument` work) and **mod_rewrite**
- writable `app/storage/logs`, `app/storage/sessions`, `uploads/`

### Installation steps (fresh)
1. Upload the files above.
2. In phpMyAdmin, select the database and import `database/001-schema.sql`, then `database/002-existing-content.sql` (§5, path A).
3. Fill in `app/config.php`:
   - `db.*`
   - `app.base_url` (real domain) and `app.base_path` (`/`, or `/folder/`)
   - a temporary `security.setup_secret`

   For a subfolder install, also prefix both `ErrorDocument` paths (`.htaccess`, `en/.htaccess`).
4. Open `/admin/setup-admin.php`, create the admin, then delete that file and clear the secret (the start page warns until both are done).
5. Check `/`, `/proizvodi.html`, `/en/`, `/detalji/tr-35-270.html`, `/sitemap.xml` and a missing address (must give the 404 page with status 404).

### Updating a server that has an earlier phase
1. Upload the files; **keep the server's `app/config.php`**, then raise `app.asset_version` there.
2. Import the missing patches (§5, path B); the admin start page lists any that are still needed.
3. Delete the obsolete static files. The rewrites take precedence anyway, but without this a server with mod_rewrite off would serve stale copies:
   - root: `index.html`, `o-nama.html`, `proizvodi.html`, `usluge.html`, `reference.html`, `galerija.html`, `kontakt.html`, `plazma.html`, `kalkulatori.html`, `konfigurator.html`, `404.html`, `sitemap.xml`, `robots.txt`
   - `en/`: `index.html`, `about.html`, `products.html`, `services.html`, `references.html`, `gallery.html`, `contact.html`, `plasma-cutting.html`, `calculators.html`, `configurator.html`, `404.html`
   - the folders `detalji/` and `en/details/` (47 + 47 old `.html` pages)

### Must be checked in the final phase
- **Database:** both SQL files imported on real MySQL/MariaDB (fresh path), and the patch path on a phase 2/3 copy. Nothing has been executed against a database yet.
- **Admin flows:** create, edit, hide and delete in every module; ordering; CSRF/session/rate limits; setup lock.
- **Uploads:** single and multi-file uploads, type rejection, `uploads/.htaccess` (no execution), WebP thumbnails with and without GD WebP, file cleanup rules.
- **Apache:**
  - rewrites for every URL in §9
  - 301 from `.php`, with no loops
  - `ErrorDocument` 404 status at all depths, including a subfolder install
  - access denial for `app/`, `database/`, `_tools/`, `*.md` / `*.sql`
- **Pages in a browser:**
  - SR/EN switching on all pages and on new records
  - modal and `#item=`, gallery filter and lightbox, accordions
  - Open/Closed status, mailto form, configurator and calculators
  - empty states, hidden-record behavior on fixed tiles
- **SEO output:** canonical/hreflang with the real `base_url`, `sitemap.xml` validity, `robots.txt`, JSON-LD (validator).
- **Content decisions for the owner:**
  - real domain (`tricom.com` default vs `tricom.rs` in e-mail addresses)
  - the EN home FAQ now shows the About wording
  - the `TEMP: confirm with client` items (§10 item 5)
  - the contact form remains mailto-only (§15): inquiries are not stored or sent by the site
  - contact literals that stay static (assistant knowledge base, i18n/print strings, configurator print stamp)

### Files (phase 4c)
New:
- `konfigurator.php`, `en/configurator.php`, `robots.php`
- `app/views/site/pages/configurator-{sr,en}.php`
- `app/data/sitemap-pages.xml`

Modified:
- `.htaccess`, `en/.htaccess`
- `app/site/{site,pages,contact,products,services,references,gallery}.php`
- `app/lib/db.php` (`db_column_exists`)
- `app/admin/{admin,catalog-admin}.php`, `app/admin/modules/pitanja.php`
- `admin/index.php`
- `app/views/admin/{dashboard,faq-list,product-delete,service-delete,reference-delete}.php`
- regenerated views: `app/views/site/pages/*`, `app/views/site/services/page-{sr,en}.php`, `app/views/site/products/*`, `app/views/site/references/*`, `app/views/site/detail/{sr,en}-*.php`
- `css/base.css` (`.empty-note`)
- `app/config.php`, `app/config.example.php` (`asset_version`)
- `_tools/site/{convert-lib,convert-pages,convert-products,convert-services-references}.js`
- `README.md`, `TRICOM_IMPLEMENTATION.md`

Removed:
- `konfigurator.html`, `en/configurator.html` (snapshots in `_tools/source/`)
- root `sitemap.xml` (now `app/data/sitemap-pages.xml`), `robots.txt` (now `robots.php`)
- the empty `detalji/` and `en/details/` folders

SQL: no change; `001`/`002` are unchanged and no patch was added.

---

## 17. Final QA (phase 5)

Full results: `QA-REPORT.md` (Serbian). The tests ran against a copy of the deliverable outside the project:
- Apache 2.4 with `.htaccess`, plus MariaDB 11.4 in strict mode with a limited user, plus PHP 8.3
- Chrome headless through the DevTools protocol
- both a root install and a `/tricom/` subfolder install

Defects found and fixed:
- `uploads/.htaccess`: double-extension names (`x.php.jpg`) were executed by an `AddHandler`-based PHP setup. The fix denies any name containing a script extension, plus `SetHandler default-handler` for every file.
- `admin/assets/admin.css`: wide tables widened the whole admin page on phones. Fixed with `minmax(0, 1fr)` and `min-width: 0`.
- `app/site/catalog.php`: a missing schema gave 500 on public pages. It now gives 503, without extra queries.
- `app/lib/csrf.php`: a POST larger than `post_max_size` showed the CSRF error. It now gives a clear 413 message.
- `app/admin/modules/galerije.php` and `gallery-upload.php`: the file count was not capped at PHP `max_file_uploads`. It now is, and the page shows the real limits.
- `app/bootstrap.php`: added a PHP ≥ 8.1 check and a check for the required extensions (`pdo_mysql`, `mbstring`, `fileinfo`).
- `app/config.php` removed from the deliverable. The `config.example.php` header now explains the copy step.

No SQL change: `001`/`002` and the patches are unchanged.
