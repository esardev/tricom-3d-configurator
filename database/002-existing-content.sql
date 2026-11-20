-- ==========================================================================
-- TRICOM — 002-existing-content.sql
-- Postojeći sadržaj sajta (SR + EN) preuzet iz frontenda.
-- GENERISANO: node _tools/db/build-existing-content.js — ne menjati ručno.
--
-- Uvoz: posle 001-schema.sql, u istu bazu, preko phpMyAdmin → Import.
-- Ponovni uvoz ne radi ništa: svaka naredba proverava oznaku
-- '002-existing-content' u tabeli schema_imports, pa se sadržaj ne duplira
-- i ne prepisuju se kasnije izmene iz administracije (ni obrisani redovi se
-- ne vraćaju). Bez DROP, TRUNCATE i DELETE.
-- Putanje medija su relativne od korena sajta (assets/…), bez početne kose
-- crte, pa rade i u korenu domena i u podfolderu.
-- ==========================================================================

SET NAMES utf8mb4;
START TRANSACTION;

-- --------------------------------------------------------------------------
-- Kategorije proizvoda
-- --------------------------------------------------------------------------
INSERT INTO `categories` (`id`, `slug`, `name_sr`, `name_en`, `nav_label_sr`, `nav_label_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
  SELECT 1, 'limovi', 'Limovi', 'Sheet metal', 'Limovi', 'Sheet metal', 'Limovi u tablama i koturu', 'Sheet metal in sheets and coils', 'Osnovni materijal za svaki limarski posao. Držimo pocinkovane, aluminijumske, bakarne, crne toplo- i hladnovaljane, plastificirane po RAL karti i prohromske limove.', 'The basic material for any sheet-metal job. We stock galvanised, aluminium, copper, black hot- and cold-rolled, pre-painted (RAL colour chart) and stainless steel sheet.', 10, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `categories` (`id`, `slug`, `name_sr`, `name_en`, `nav_label_sr`, `nav_label_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
  SELECT 2, 'krov', 'Krov i fasada', 'Roof and façade', 'Krovni program', 'Roofing range', 'Krovni i fasadni program', 'Roofing and façade range', 'Trapezne limove i imitaciju crepa proizvodimo na sopstvenim profilirkama, pa dužina ide po meri objekta — bez poprečnih preklopa na krovu.', 'We make trapezoidal profiled sheet and tile-effect roofing sheet on our own roll-forming machines, so the length is made to suit the building — no transverse laps on the roof.', 20, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `categories` (`id`, `slug`, `name_sr`, `name_en`, `nav_label_sr`, `nav_label_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
  SELECT 3, 'oluci', 'Oluci i limarija', 'Gutters and flashings', 'Oluci i vertikale', 'Gutters and downpipes', 'Oluci, vertikale i limarska galanterija', 'Gutters, downpipes and sheet-metal roofing accessories', 'Oluke i vertikale radimo u dužini po želji kupca. Uz njih ide kompletna galanterija za odvodnjavanje i obradu krovnih detalja — sve u istom limu i istoj boji kao pokrivač.', 'We make gutters and downpipes in any length the customer needs. They come with a complete set of accessories for drainage and roof detailing — all in the same sheet and the same colour as the roof covering.', 30, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `categories` (`id`, `slug`, `name_sr`, `name_en`, `nav_label_sr`, `nav_label_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
  SELECT 4, 'cevi', 'Cevi i profili', 'Tubes and sections', 'Cevi i profili', 'Tubes and sections', 'Cevi, ZP profili i čelični profili', 'Tubes, ZP hollow sections and steel sections', 'Šavne i precizne cevi, hladno oblikovani ZP profili i standardni čelični profili. Sečemo na trakastim testerama na dužinu koju tražite, a šipkaste profile po potrebi i grifujemo.', 'Welded and precision tubes, cold-formed ZP hollow sections and standard steel sections. We cut them to the length you need on band saws, and emboss bar sections on request.', 40, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `categories` (`id`, `slug`, `name_sr`, `name_en`, `nav_label_sr`, `nav_label_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
  SELECT 5, 'kovano', 'Kovano i pletiva', 'Wrought iron and mesh', 'Kovano i pletiva', 'Wrought iron and mesh', 'Kovani elementi i pletiva', 'Wrought-iron elements and wire mesh', 'Za kovane ograde, kapije i ogradne elemente držimo kovane profile i dekorativne elemente, šiljke za ograde, žice i pletiva.', 'For wrought-iron fences, gates and fencing elements we stock wrought-iron sections and decorative elements, fence spikes, wire and wire mesh.', 50, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `categories` (`id`, `slug`, `name_sr`, `name_en`, `nav_label_sr`, `nav_label_en`, `heading_sr`, `heading_en`, `intro_sr`, `intro_en`, `sort_order`, `is_active`)
  SELECT 6, 'alati', 'Alati i oprema', 'Tools and equipment', 'Alati i oprema', 'Tools and equipment', 'Alati, oprema za varenje i šrafovska roba', 'Tools, welding equipment and fasteners', 'Ideja je da limar i bravar u jednoj kupovini uzmu i materijal i sve što treba da se on ugradi. Držimo električni i ručni alat vodećih brendova, opremu za varenje i kompletnu šrafovsku robu.', 'The idea is that a sheet-metal worker or metal fabricator gets the material and everything needed to install it in a single purchase. We stock power and hand tools from leading brands, welding equipment and a complete range of fasteners.', 60, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Proizvodi
-- --------------------------------------------------------------------------
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 1, 'trapezni-lim', 2, 'Trapezni pokrivni lim', 'Pet profila za krov i fasadu, u pocinkovanoj i plastificiranoj izvedbi po RAL karti. Dužina se reže po meri objekta.', 'Trapezne limove proizvodimo na sopstvenim profilirkama iz kotura, pa dužina ide po meri objekta — krov ili fasada bez poprečnih preklopa.

U programu su TR 10/162,5, TR 20/185, TR 35/270, TR 40/230 i TR 60/210, od pocinkovanog, pocinkovano plastificiranog i aluminijumskog lima; boje iz RAL karte, ostale boje i materijali po dogovoru. Na naličje se pri izradi profila može zalepiti antikondenz filc.

Trapezni lim do 2,5 m (rebro 15/10/15) radimo i na hidrauličnoj presi. Debljine i raspoložive boje proverite sa prodajom — zavise od trenutnog lagera kotura.', 'TR 10/162,5
TR 20/185
TR 35/270
TR 40/230', 'krovovi kuća i pomoćnih objekata
hale, magacini i poljoprivredni objekti
fasade i parapeti
nadstrešnice i garaže', 'Trapezoidal profiled sheet', 'Five profiles for roof and façade, galvanised or pre-painted to the RAL chart. The length is cut to suit the building.', 'We roll-form trapezoidal sheet from coil on our own machines, so the length is made to suit the building — a roof or façade with no transverse laps.

The range covers TR 10/162.5, TR 20/185, TR 35/270, TR 40/230 and TR 60/210 in galvanised, pre-painted galvanised and aluminium sheet; colours from the RAL chart, other colours and materials by arrangement. Anti-condensation felt can be bonded to the underside during roll forming.

Trapezoidal sheet up to 2.5 m (rib 15/10/15) is also made on a hydraulic press. Check thicknesses and available colours with sales — they depend on current coil stock.', 'TR 10/162.5
TR 20/185
TR 35/270
TR 40/230', 'roofs of houses and outbuildings
production halls, warehouses and agricultural buildings
façades and parapets
canopies and garages', 'render', 'tr35', NULL, NULL, NULL, NULL, NULL, 'tr20', 'trapez', 'o=dvovodni&p=tr35', 'tr-10-162,tr-20-185,tr-35-270,tr-40-230,tr-60-210,imitacija-crepa,antikondenz-filc', 10, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 2, 'tr-10-162', 2, 'Trapezni lim TR 10/162,5', 'Niski profil za fasade, parapete i krovove manjeg raspona; postavlja se na punu podlogu.', 'TR 10/162,5 je najniži profil u programu: rebro od 10 mm na koraku 162,5 mm i pokrivna širina 975 mm. Koristi se za fasade i parapete i za krovove manjeg raspona, uvek na punoj podlozi.

Dužina table se reže po meri objekta. Može od pocinkovanog ili pocinkovano plastificiranog lima u boji iz RAL karte.', 'fasada
parapet
puna podloga', 'fasade
parapeti
krovovi manjeg raspona na punoj podlozi', 'Trapezoidal sheet TR 10/162.5', 'Low profile for façades, parapets and short-span roofs; laid on a continuous deck.', 'TR 10/162.5 is the lowest profile in the range: a 10 mm rib at 162.5 mm pitch and a cover width of 975 mm. It is used for façades and parapets and for short-span roofs, always on a continuous deck.

Sheets are cut to the length the building needs. Available in galvanised or pre-painted galvanised sheet in a RAL colour.', 'façade
parapet
solid substrate', 'façades
parapets
short-span roofs on a continuous deck', 'render', 'tr10', NULL, NULL, NULL, NULL, 'assets/old/tr/tr10-dimenzije.jpg', 'tr10', 'trapez', 'o=dvovodni&p=tr10', 'trapezni-lim,tr-20-185,parapetni-lim,lamperija', 20, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 3, 'tr-20-185', 2, 'Trapezni lim TR 20/185', 'Univerzalni krovni i fasadni pokrivač — rebro 20 mm, pokrivna širina 1110 mm.', 'TR 20/185 je univerzalni profil za krov i fasadu: rebro 20 mm na koraku 185 mm, pokrivna širina 1110 mm iz razvijene širine 1250 mm.

Profilišemo ga iz kotura na dužinu koju traži objekat, od pocinkovanog ili plastificiranog lima u boji iz RAL karte, po želji sa antikondenz filcom na naličju.', 'krov
fasada
univerzalni', 'krovovi stambenih i pomoćnih objekata
fasade
nadstrešnice', 'Trapezoidal sheet TR 20/185', 'All-purpose roof and façade covering — 20 mm rib, 1,110 mm cover width.', 'TR 20/185 is the all-purpose profile for roofs and façades: a 20 mm rib at 185 mm pitch and a cover width of 1,110 mm from a 1,250 mm developed width.

We roll-form it from coil to the length the building needs, in galvanised or pre-painted sheet in a RAL colour, with anti-condensation felt on the underside if required.', 'roof
façade
all-purpose', 'roofs of residential and ancillary buildings
façades
canopies', 'render', 'tr20', NULL, NULL, NULL, NULL, 'assets/old/tr/tr20-dimenzije.jpg', 'tr20', 'trapez', 'o=dvovodni&p=tr20', 'trapezni-lim,tr-10-162,tr-35-270,antikondenz-filc', 30, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 4, 'tr-35-270', 2, 'Trapezni lim TR 35/270', 'Industrijski krovovi i veći raspon rožnjača; može da se savija u luk.', 'TR 35/270 ima rebro od 35 mm na koraku 270 mm i pokrivnu širinu 1080 mm (sa antikondenz filcom od 0,9 mm 1090–1095 mm). Namenjen je industrijskim krovovima i većem rasponu rožnjača, a može da se savija i u luk.

Preporučeni razmak rožnjača je 60 cm do najviše 1 m; način šrafljenja i razmak rožnjača uvek određuje tehničko lice prema nagibu i površini krova. U drvenu konstrukciju lim se pričvršćuje samobušećim vijcima 6,3×70 – 6×90 mm, u metalnu samourezujućim 6,3×50 – 6,3×70 mm, uz neoprensku i metalnu podlošku.', 'industrijski krov
veći raspon
luk', 'industrijski i poslovni krovovi
hale i magacini
lučni krovovi i nadstrešnice', 'Trapezoidal sheet TR 35/270', 'Industrial roofs and longer purlin spans; can be arc-bent.', 'TR 35/270 has a 35 mm rib at 270 mm pitch and a cover width of 1,080 mm (1,090–1,095 mm with 0.9 mm anti-condensation felt). It is intended for industrial roofs and longer purlin spans, and it can also be arc-bent.

The recommended purlin spacing is 60 cm to a maximum of 1 m; the screw pattern and purlin spacing are always set by the responsible engineer according to the roof pitch and area. On timber it is fixed with self-drilling screws 6.3×70 – 6×90 mm, on steel with self-tapping screws 6.3×50 – 6.3×70 mm, with a neoprene and metal washer.', 'industrial roof
longer span
arc', 'industrial and commercial roofs
production halls and warehouses
arched roofs and canopies', 'render', 'tr35', NULL, NULL, NULL, NULL, 'assets/old/tr/tr-35.jpg', 'tr35', 'trapez', 'o=dvovodni&p=tr35', 'trapezni-lim,tr-20-185,tr-40-230,antikondenz-filc', 40, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 5, 'tr-40-230', 2, 'Trapezni lim TR 40/230', 'Hale i veliki rasponi — dobra statička nosivost za krovove nagiba većeg od 4 %.', 'TR 40/230 ima rebro od 40 mm na koraku 230 mm i pokrivnu širinu 920 mm iz trake 1250 mm. Zbog dobre statičke nosivosti koristi se na krovovima nagiba većeg od 4 % — kuće, pomoćni objekti i garaže, ali i hale, magacini i poljoprivredni objekti.

Izrađuje se ojačan u gornjoj zoni (dodatni žlebovi u pojasu). Debljine po uputstvu za izbor (ojačan): 0,6–1,0 mm.', 'hale
veliki rasponi
ojačan', 'hale i magacini
poljoprivredni objekti
kuće, pomoćni objekti i garaže', 'Trapezoidal sheet TR 40/230', 'Production halls and long spans — good load capacity for roofs with a pitch above 4 %.', 'TR 40/230 has a 40 mm rib at 230 mm pitch and a cover width of 920 mm from 1,250 mm strip. Thanks to its good load capacity it is used on roofs with a pitch above 4 % — houses, outbuildings and garages, but also production halls, warehouses and agricultural buildings.

It is made reinforced in the upper zone (additional stiffening grooves in the flange). Thicknesses per the selection guide (reinforced): 0.6–1.0 mm.', 'production halls
long spans
reinforced', 'production halls and warehouses
agricultural buildings
houses, outbuildings and garages', 'render', 'tr40', NULL, NULL, NULL, NULL, 'assets/old/tr/tr40-dimenzije.jpg', 'tr40', 'trapez', 'o=dvovodni&p=tr40', 'trapezni-lim,tr-35-270,tr-60-210,antikondenz-filc', 50, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 6, 'tr-60-210', 2, 'Trapezni lim TR 60/210', 'Najviši profil u programu, za najveći raspon rožnjača.', 'Najviši profil u programu: rebro 60 mm, korak 210 mm, pokrivna širina 840 mm (ukupna 937 mm) iz trake 1250 mm, debljine 0,5–1,0 mm, od pocinkovanog i pocinkovanog plastificiranog lima.

Tolerancije po EN 10143, premaz po EN 10169, nosivost po EN 1993-1-3 i EN 1993-1-5. Može i sa antikondenz filcom. Namena: poslovni, proizvodni i magacinski objekti, hladnjače, skladišta, stambeni i pomoćni objekti, garaže.', 'najveći raspon
hladnjače
skladišta', 'poslovni i proizvodni objekti
hladnjače i skladišta
stambeni i pomoćni objekti, garaže', 'Trapezoidal sheet TR 60/210', 'The tallest profile in the range, for the longest purlin spans.', 'The tallest profile in the range: rib height 60 mm, pitch 210 mm, cover width 840 mm (overall 937 mm) from 1,250 mm strip, thicknesses 0.5–1.0 mm, in galvanised and galvanised pre-painted sheet.

Tolerances to EN 10143, coating to EN 10169, load capacity to EN 1993-1-3 and EN 1993-1-5. Also available with anti-condensation felt. Uses: commercial, production and warehouse buildings, cold stores, storage buildings, residential and ancillary buildings, garages.', 'longest span
cold stores
storage', 'commercial and production buildings
cold stores and storage buildings
residential and ancillary buildings, garages', 'render', 'tr60', NULL, NULL, NULL, NULL, 'assets/old/tr/TR-60-210.jpg', NULL, NULL, NULL, 'trapezni-lim,tr-40-230,antikondenz-filc', 60, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 7, 'imitacija-crepa', 2, 'Imitacija crepa', 'Panel sa profilom crepa — klasičan izgled krova uz brzinu montaže čeličnog pokrivača.', 'Panel sa profilom crepa za krovove gde se traži klasičan izgled uz prednosti čeličnog pokrivača. Novi model proizvodimo od jula 2020; radi se jedan red (pet crepova) ili dužina po narudžbini u više redova.

Dužina crepa je promenljiva: standard je 350 mm, preporuka 350–450 mm. Materijal je obično lim 0,5 mm (pocinkovan 140 g/m², fabrički bojen 25 µm lice / 8 µm naličje). Mala težina, ispod 5 kg/m² (klasičan crep 30–50 kg/m²), znači i jeftiniju konstrukciju; najmanji nagib krova je 14°.', 'plastificiran
RAL po izboru
modul 350 mm', 'stambeni krovovi
rekonstrukcija starih krovova (lakša konstrukcija)
pomoćni objekti', 'Tile-effect roofing sheet', 'A panel with a roof-tile profile — the classic look of a tiled roof with the installation speed of steel roofing.', 'A panel with a roof-tile profile for roofs that call for a traditional look with the advantages of steel roofing. We have made the new model since July 2020; it is made as one row (five tiles) or in lengths to order covering several rows.

The tile length is variable: 350 mm is standard, 350–450 mm recommended. The material is usually 0.5 mm sheet (galvanised 140 g/m², factory-painted 25 µm face / 8 µm reverse). Its low weight, under 5 kg/m² (classic tiles 30–50 kg/m²), also means a cheaper roof structure; the minimum roof pitch is 14°.', 'pre-painted
RAL of your choice
350 mm module', 'residential roofs
refurbishing old roofs (lighter structure)
outbuildings', 'render', 'crep', NULL, NULL, NULL, NULL, NULL, 'crep', 'none', 'o=dvovodni&p=crep&m=plast', 'trapezni-lim,antikondenz-filc,gradjevinska-limarija,oluci-i-vertikale', 70, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 8, 'parapetni-lim', 2, 'Parapetni lim', 'Tri profila (PR 83/34, PR 38/15, PR 71/10) od lima 0,4–2 mm, u bojenoj, pocinkovanoj i HVL izvedbi.', 'Fasadni i parapetni profil, u bojenoj i pocinkovanoj izvedbi. Profilišemo ga na sopstvenoj mašini za parapet u tri profila: PR 83/34, PR 38/15 i PR 71/10.

Radi se po narudžbini, prema dimenzijama tabli na lageru; dužine i boje proverite sa prodajom.', 'fasada
parapet', 'fasade
parapeti i atike
ograđivanje objekata', 'Parapet lining sheet', 'Three profiles (PR 83/34, PR 38/15, PR 71/10) from 0.4–2 mm sheet, painted, galvanised or cold-rolled.', 'A façade and parapet profile, pre-painted or galvanised. We roll-form it on our own parapet machine in three profiles: PR 83/34, PR 38/15 and PR 71/10.

It is made to order, to the dimensions of the sheets in stock; check lengths and colours with sales.', 'façade
parapet', 'façades
parapets and attics
enclosing buildings', 'render', 'tr20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lamperija,tr-10-162,profilisanje-parapeta-i-lamperije', 80, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 9, 'lamperija', 2, 'Lamperija i lajsne', 'Metalna lamperija za plafone, strehe i oblaganje, sa pratećim lajsnama; standardna dužina 2,5 m.', 'Metalna lamperija za plafone, strehe i oblaganje, sa pratećim lajsnama — od bojenog aluminijuma, pocinkovano bojenog, prohromskog i bakarnog lima.

Standardna dužina table je 2,5 m, po narudžbini i u drugim dužinama. Aluminijumska lamperija je plastificirana braon ili belo, glatka ili embosirana (kora pomorandže); čista pokrivna površina table je 0,65 m², a muški i ženski žleb daju neprimetan nastavak.', 'plafoni
strehe
oblaganje', 'plafoni i strehe
oblaganje zidova
nadstrešnice', 'Metal cladding panels and trims', 'Metal cladding panels for ceilings, eaves and lining, with matching trims; standard length 2.5 m.', 'Metal cladding panels for ceilings, eaves and wall lining, with matching trims — from painted aluminium, painted galvanised, stainless steel and copper sheet.

The standard panel length is 2.5 m, other lengths to order. Aluminium panels are coated brown or white, smooth or embossed (orange-peel); the net cover area of a panel is 0.65 m², and the tongue-and-groove edge gives an invisible joint.', 'ceilings
eaves
cladding', 'ceilings and eaves
wall lining
canopies', 'render', 'tr10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'parapetni-lim,aluminijumski-profili-i-lajsne,profilisanje-parapeta-i-lamperije', 90, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 10, 'antikondenz-filc', 2, 'Antikondenz filc', 'Sloj na naličju pokrivnog lima koji upija kondenzat i sprečava kapljanje sa unutrašnje strane.', 'Filc za trapezni i pokrivni lim koji sprečava kondenzaciju na unutrašnjoj strani pokrivača — bitno za hale i nadstrešnice. Antikondenz filc (DR!PSTOP) lepi se na naličje lima pri izradi profila.

Sa filcom od 0,9 mm pokrivna širina TR 35 raste na 1090–1095 mm.', 'hale
nadstrešnice', 'hale i magacini
nadstrešnice
poljoprivredni objekti', 'Anti-condensation felt', 'A layer on the underside of the roofing sheet that absorbs condensate and prevents dripping on the inner side.', 'Felt for trapezoidal and roofing sheet that prevents condensation on the inner side of the roof covering — important for production halls and canopies. The anti-condensation felt (DR!PSTOP) is bonded to the underside of the sheet during roll forming.

With 0.9 mm felt the cover width of TR 35 grows to 1,090–1,095 mm.', 'production halls
canopies', 'production halls and warehouses
canopies
agricultural buildings', 'render', 'xray-sheet-layers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'trapezni-lim,tr-35-270,tr-40-230,imitacija-crepa', 100, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 11, 'paneli', 2, 'Paneli', 'Panelni program za krov i fasadu, za objekte gde se traži i termička izolacija.', 'Panelni program za krov i fasadu, za objekte gde se traži i termička izolacija. Ponudu, debljine i boje panela proverite sa prodajom.', 'krov
fasada', 'hale i magacini
hladnjače
poslovni objekti', 'Panels', 'Panel range for roofs and façades, for buildings that also need thermal insulation.', 'Panel range for roofs and façades, for buildings that also need thermal insulation. Check the range, thicknesses and colours with sales.', 'roof
façade', 'production halls and warehouses
cold stores
commercial buildings', 'render', 'panel', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'trapezni-lim,antikondenz-filc', 110, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 12, 'kanali-za-ventilaciju', 2, 'Kanali za ventilaciju', 'Pravougaoni i okrugli kanali i fazonski elementi za ventilaciju i klimatizaciju.', 'Pravougaoni i okrugli kanali i fazonski elementi za ventilaciju i klimatizaciju, izrađeni na sopstvenoj mašini za kanale — po specifikaciji kupca.', 'po specifikaciji', 'ventilacija
klimatizacija
industrijski objekti', 'Ventilation ducts', 'Rectangular and circular ducts and fittings for ventilation and air conditioning.', 'Rectangular and circular ducts and fittings for ventilation and air conditioning, made on our own duct machine — to the customer''s specification.', 'to specification', 'ventilation
air conditioning
industrial buildings', 'render', 'duct', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,savijanje-limova', 120, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 13, 'oluci-i-vertikale', 3, 'Oluci i vertikale', 'Poluokrugli i četvrtasti oluci, okrugle i četvrtaste vertikale u dužini po želji, sa kompletnim priborom.', 'Oluke i vertikale radimo u dužini po želji kupca. Uz njih ide kompletna galanterija za odvodnjavanje i obradu krovnih detalja — sve u istom limu i istoj boji kao pokrivač.

Poluokrugli oluci RŠ 250–400 i četvrtasti do 8,2 m; okrugle vertikale Ø80–Ø150 i četvrtaste. Poluokrugle oluke RŠ 333 i okrugle vertikale Ø100 od pocinkovanog lima radimo u neograničenoj dužini, na automatizovanim linijama. Pribor: kuke, obujmice, danca, kolena, vodokotlići, vinklovi, zaštitnici, snegobrani.', 'pocinkovani
bojeni
bakarni', 'stambeni objekti
poslovni objekti i hale
rekonstrukcije krovova', 'Gutters and downpipes', 'Half-round and box gutters, round and square downpipes in any length you need, with a full set of accessories.', 'We make gutters and downpipes in any length the customer needs. They come with a complete set of accessories for drainage and roof detailing — all in the same sheet and the same colour as the roof covering.

Half-round gutters (developed width 250–400 mm) and box gutters up to 8.2 m; round downpipes Ø80–Ø150 and square downpipes. Half-round gutters with a 333 mm developed width and round Ø100 downpipes in galvanised sheet are made in unlimited lengths on automated lines. Accessories: brackets, clips, end caps, elbows, hopper heads, corners, guards, snow guards.', 'galvanised
painted
copper', 'residential buildings
commercial buildings and halls
roof refurbishment', 'render', 'gutter-halfround', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'o=dvovodni&g=pk125&v=ok100', 'gradjevinska-limarija,izrada-oluka,snegobrani,imitacija-crepa', 130, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 14, 'gradjevinska-limarija', 3, 'Građevinska limarija', 'Uvale, iksne, veterlajsne, okapnice, opšivke, slemena, snegobrani, kape za dimnjake — po vašim merama.', 'Kompletnu građevinsku limariju savijamo po vašim merama, od svih vrsta lima. Apkant presa od 8,2 m radi opšivke, okapnice i slemena bez poprečnog spoja koji kasnije propušta ili se vidi.

Šaljite razvijenu meru ili nacrt sa uglovima savijanja — ako imate samo gotov presek, izračunaćemo razvijenu dužinu. Za vidljive elemente navedite koja strana lima ide na vidnu stranu.', 'po meri
sve vrste lima', 'krovovi i fasade
atike i zidovi
dimnjaci i prodori', 'Construction sheet-metal work', 'Valley flashings, penetration flashings, verge flashings, eaves drip flashings, flashings, ridge caps, snow guards, chimney caps — to your dimensions.', 'We bend complete building sheet-metal work to your dimensions, from all types of sheet. The 8.2 m press brake makes flashings, eaves drips and ridge caps with no transverse joint that later leaks or shows.

Send the developed width or a drawing with bend angles — if you only have the finished cross-section, we will calculate the developed length. For visible elements, state which side of the sheet is the exposed face.', 'made to measure
all sheet types', 'roofs and façades
parapets and walls
chimneys and penetrations', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uvale,okapnice,slemena,opsivke,savijanje-limova', 140, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 15, 'uvale', 3, 'Uvale', 'Spoj dve krovne ravni.', 'Uvale — spoj dve krovne ravni. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.', 'po meri', 'spoj dve krovne ravni', 'Valley flashings', 'Junction of two roof planes.', 'Valley flashings — junction of two roof planes. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.', 'made to measure', 'junction of two roof planes', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 150, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 16, 'iksne', 3, 'Iksne', 'Obrada oko dimnjaka i prodora.', 'Iksne — obrada oko dimnjaka i prodora. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.', 'po meri', 'obrada oko dimnjaka i prodora', 'Penetration flashings', 'Detailing around chimneys and penetrations.', 'Penetration flashings — detailing around chimneys and penetrations. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.', 'made to measure', 'detailing around chimneys and penetrations', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 160, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 17, 'veterlajsne', 3, 'Veterlajsne', 'Završetak na čeonoj strani krova.', 'Veterlajsne — završetak na čeonoj strani krova. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.', 'po meri', 'završetak na čeonoj strani krova', 'Verge flashings', 'Finish at the gable end of the roof.', 'Verge flashings — finish at the gable end of the roof. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.', 'made to measure', 'finish at the gable end of the roof', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 170, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 18, 'okapnice', 3, 'Okapnice', 'Odvođenje vode sa ivice.', 'Okapnice — odvođenje vode sa ivice. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.', 'po meri', 'odvođenje vode sa ivice', 'Eaves drip flashings', 'Shed water off the edge.', 'Eaves drip flashings — shed water off the edge. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.', 'made to measure', 'shed water off the edge', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 180, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 19, 'opsivke', 3, 'Opšivke', 'Atika, zidovi, prodori.', 'Opšivke — atika, zidovi, prodori. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.', 'po meri', 'atika, zidovi, prodori', 'Flashings', 'Parapets, walls, penetrations.', 'Flashings — parapets, walls, penetrations. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.', 'made to measure', 'parapets, walls, penetrations', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 190, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 20, 'slemena', 3, 'Slemena', 'Vrh krova, ventilisana i puna.', 'Slemena — vrh krova, ventilisana i puna. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.', 'po meri', 'vrh krova, ventilisana i puna', 'Ridge caps', 'Roof apex, ventilated and solid.', 'Ridge caps — roof apex, ventilated and solid. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.', 'made to measure', 'roof apex, ventilated and solid', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 200, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 21, 'snegobrani', 3, 'Snegobrani', 'Zadržavanje snega nad ulazima.', 'Snegobrani — zadržavanje snega nad ulazima. Cevni snegobran sa nosačima zadržava sneg da ne sklizne u oluk.

Snegobrani za crep: tegola (zelena, braon, bordo, crna — 0,5 mm); biber (pocinkovano, braon, bordo, bakar — 1 mm); kikinda, bečej, tondach (pocinkovan, braon, bordo, metaliza, bakar — 1 mm).', 'limarska galanterija', 'zadržavanje snega nad ulazima', 'Snow guards', 'Hold back snow above entrances.', 'Snow guards — hold back snow above entrances. A tubular snow guard on brackets holds the snow back so it does not slide into the gutter.

Snow guards for roof tiles: tegola (green, brown, burgundy, black — 0.5 mm); biber (galvanised, brown, burgundy, copper — 1 mm); Kikinda, Bečej, Tondach (galvanised, brown, burgundy, metallic, copper — 1 mm).', 'sheet-metal roofing accessories', 'hold back snow above entrances', 'render', 'snowguard-row', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 210, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 22, 'kape-za-dimnjake', 3, 'Kape za dimnjake', 'Zaštita dimnjaka od vode.', 'Kape za dimnjake — zaštita dimnjaka od vode. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.

Izrađuju se rundovanjem, po radiusu — kao cilindri i konusi. Šaljite meru ili nacrt.', 'po meri', 'zaštita dimnjaka od vode', 'Chimney caps', 'Keep water out of the chimney.', 'Chimney caps — keep water out of the chimney. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.

They are made by plate rolling, to radius — like cylinders and cones. Send the dimensions or a drawing.', 'made to measure', 'keep water out of the chimney', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,oluci-i-vertikale,savijanje-limova', 220, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 23, 'gazista', 5, 'Gazišta', 'Pocinkovana, za stepenice i platforme.', 'Pocinkovana gazišta za stepenice i platforme, od toplovaljanog lima S235, toplo cinkovana ili farbana.

Standardne dimenzije: 200×1000, 250×1000, 300×1000, 500×1000, 500×500 i 1000×1000 mm.', 'po meri', 'pocinkovana, za stepenice i platforme', 'Stair treads', 'Galvanised, for stairs and platforms.', 'Galvanised stair treads for stairs and platforms, from hot-rolled S235 sheet, hot-dip galvanised or painted.

Standard sizes: 200×1,000, 250×1,000, 300×1,000, 500×1,000, 500×500 and 1,000×1,000 mm.', 'made to measure', 'galvanised, for stairs and platforms', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'celicni-profili,kvadratne-i-pravougaone-cevi', 230, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 5 AND `slug` = 'kovano')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 24, 'kvadratne-i-pravougaone-cevi', 4, 'Kvadratne i pravougaone cevi', 'Šavne hladno oblikovane cevi (ZP profili) za konstrukcije, ograde i kapije.', 'Šavne hladno oblikovane cevi (ZP profili) za konstrukcije, ograde i kapije. Sečemo ih na trakastim testerama na dužinu koju tražite, pa ne plaćate ostatak šipke koji vam ne treba.

Dimenzije, standarde i mase po dimenziji pogledajte u tabeli cevi na strani prodajnog programa.', 'ZP profil
sečenje na meru', 'metalne konstrukcije
ograde i kapije
nadstrešnice', 'Square and rectangular tubes', 'Welded cold-formed tubes (ZP hollow sections) for structures, fences and gates.', 'Welded cold-formed tubes (ZP hollow sections) for structures, fences and gates. We cut them on band saws to the length you ask for, so you do not pay for the rest of the bar that you do not need.

See the tube table on the product range page for dimensions, standards and weights.', 'ZP section
cut to size', 'steel structures
fences and gates
canopies', 'render', 'tubes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'okrugle-cevi,precizne-cevi,secenje-profila,celicni-profili', 240, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 4 AND `slug` = 'cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 25, 'okrugle-cevi', 4, 'Okrugle cevi', 'Crne okrugle colovne i pocinkovane okrugle cevi, za ograde i instalacije.', 'Crne okrugle colovne i pocinkovane okrugle cevi, za ograde i instalacije. Sečemo ih na meru, a okrugle cevi 1/2"–2" i lučno savijamo za zaobljene elemente i ograde.', 'colovne
pocinkovane', 'ograde
instalacije
konstrukcije', 'Round tubes', 'Black round tubes in inch sizes and galvanised round tubes, for railings and building services.', 'Black round tubes in inch sizes and galvanised round tubes, for railings and building services. We cut them to size and arc-bend round tubes 1/2"–2" for curved elements and railings.', 'inch sizes
galvanised', 'railings
building services
structures', 'render', 'tubes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kvadratne-i-pravougaone-cevi,precizne-cevi,lucno-savijanje', 250, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 4 AND `slug` = 'cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 26, 'precizne-cevi', 4, 'Precizne cevi', 'Ovalne i okrugle precizne cevi sa užim tolerancijama, za zahtevnije konstrukcije.', 'Ovalne i okrugle precizne cevi sa užim tolerancijama (tačnost mere) — za metalni nameštaj, enterijere, sanitarne uređaje, automobile, bicikle i konstrukcije. Sečemo ih na dužinu koju tražite.', 'precizne
ovalne', 'metalni nameštaj i enterijeri
sanitarni uređaji
konstrukcije', 'Precision tubes', 'Oval and round precision tubes with tighter tolerances, for more demanding structures.', 'Oval and round precision tubes with tighter tolerances (dimensional accuracy) — for metal furniture, interiors, sanitary fittings, cars, bicycles and structures. We cut them to the length you need.', 'precision
oval', 'metal furniture and interiors
sanitary fittings
structures', 'render', 'tubes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'okrugle-cevi,kvadratne-i-pravougaone-cevi', 260, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 4 AND `slug` = 'cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `illu_key`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 27, 'elektricni-i-rucni-alat', 6, 'Električni i ručni alat', 'Bušilice, brusilice, testere, odvijači, merni i ručni limarski alat sa potrošnim sredstvima.', 'Bušilice, brusilice, ubodne i ugaone testere, odvijači, merni alat, ručni limarski alat i prateća potrošna sredstva — rezne i brusne ploče, burgije, listovi.

Ideja je da limar i bravar u jednoj kupovini uzmu i materijal i sve što treba da se on ugradi. Držimo alat vodećih brendova (Bosch, Makita, DeWalt).', 'Bosch
Makita
DeWalt', 'limarske radionice
bravarija
gradilište', 'Power and hand tools', 'Drills, grinders, saws, screwdrivers, measuring tools and sheet-metal hand tools with consumables.', 'Drills, grinders, jigsaws and mitre saws, screwdrivers, measuring tools, sheet-metal hand tools and consumables — cutting and grinding discs, drill bits, saw blades.

The idea is that a sheet-metal worker or metal fabricator gets the material and everything needed to install it in a single purchase. We stock tools from leading brands (Bosch, Makita, DeWalt).', 'Bosch
Makita
DeWalt', 'sheet-metal workshops
metal fabrication
building sites', 'illu', 'alati', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'oprema-za-varenje,srafovska-roba-i-okov,merdevine-i-pomocna-oprema', 270, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `illu_key`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 28, 'oprema-za-varenje', 6, 'Oprema za varenje', 'Aparati, prateći materijal i oprema za varenje Varstroj — elektrode, žice, maske i zaštita.', 'Aparati, prateći materijal i oprema za varenje Varstroj — elektrode, žice, maske i zaštita. Raspoložive modele i potrošni materijal proverite sa prodajom.', 'Varstroj', 'bravarija
metalne konstrukcije
održavanje', 'Welding equipment', 'Welding machines, consumables and equipment by Varstroj — electrodes, wire, helmets and protective gear.', 'Welding machines, consumables and equipment by Varstroj — electrodes, wire, welding helmets and protective gear. Check available models and consumables with sales.', 'Varstroj', 'metal fabrication
steel structures
maintenance', 'illu', 'alati', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'elektricni-i-rucni-alat,srafovska-roba-i-okov', 280, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `illu_key`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 29, 'srafovska-roba-i-okov', 6, 'Šrafovska roba i okov', 'Vijci, navrtke, podloške, ankeri, tiplovi, brave i okovi za kapije i vrata.', 'Vijci, navrtke, podloške, ankeri i tiplovi, brave, okovi za kapije i vrata, šarke, reze, katanci.

Brave i okovi Bane Sekulić (Sombor) i italijanskih proizvođača PETITI, FIMET i HOPE.', 'vijci
okov', 'kapije i ograde
vrata
montaža limarije', 'Fasteners and hardware', 'Screws, nuts, washers, anchors, wall plugs, locks and gate and door hardware.', 'Screws, nuts, washers, anchors and wall plugs, locks, gate and door hardware, hinges, latches, padlocks.

Locks and hardware from Bane Sekulić (Sombor) and the Italian manufacturers PETITI, FIMET and HOPE.', 'screws
hardware', 'gates and fences
doors
fixing sheet-metal work', 'illu', 'alati', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'elektricni-i-rucni-alat,oprema-za-varenje', 290, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 30, 'aluminijumski-profili-i-lajsne', 6, 'Aluminijumski profili i lajsne', 'Profili, lajsne i završni elementi za suvu montažu, oblaganje i limarske detalje.', 'Profili, lajsne i završni elementi za suvu montažu, oblaganje i limarske detalje. Raspoložive dimenzije proverite sa prodajom.', 'aluminijum', 'suva montaža
oblaganje
limarski detalji', 'Aluminium profiles and trims', 'Profiles, trims and finishing pieces for dry construction, cladding and sheet-metal details.', 'Profiles, trims and finishing pieces for dry construction, cladding and sheet-metal details. Check available sizes with sales.', 'aluminium', 'dry construction
cladding
sheet-metal details', 'render', 'sections', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lamperija,gradjevinska-limarija', 300, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `products` (`id`, `slug`, `category_id`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `illu_key`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`)
  SELECT 31, 'merdevine-i-pomocna-oprema', 6, 'Merdevine i pomoćna oprema', 'Aluminijumske merdevine Alpos — profesionalne EXPERT i poluprofesionalne RATIO — i pribor Mimont.', 'Aluminijumske merdevine Alpos (Slovenija) — profesionalne EXPERT i poluprofesionalne RATIO — i pomoćni pribor Mimont.', 'Alpos
Mimont', 'gradilište
radionica
održavanje objekata', 'Ladders and ancillary equipment', 'Aluminium ladders by Alpos — professional EXPERT and semi-professional RATIO — and Mimont accessories.', 'Aluminium ladders by Alpos (Slovenia) — professional EXPERT and semi-professional RATIO — and ancillary accessories by Mimont.', 'Alpos
Mimont', 'building sites
workshops
building maintenance', 'illu', 'alati', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'elektricni-i-rucni-alat,srafovska-roba-i-okov', 310, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Tehnički podaci proizvoda
-- --------------------------------------------------------------------------
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 1, 1, 10, 'Profili', 'TR 10, TR 20, TR 35, TR 40, TR 60', 'Profiles', 'TR 10, TR 20, TR 35, TR 40, TR 60'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 1 AND `slug` = 'trapezni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 2, 1, 20, 'Visina rebra', '10–60 mm', 'Rib height', '10–60 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 1 AND `slug` = 'trapezni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 3, 1, 30, 'Pokrivna širina', '840–1110 mm', 'Cover width', '840–1,110 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 1 AND `slug` = 'trapezni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 4, 1, 40, 'Dužina', 'po meri objekta', 'Length', 'to suit the building'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 1 AND `slug` = 'trapezni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 5, 1, 50, 'Materijal', 'pocinkovani, plastificirani (RAL), aluminijum', 'Material', 'galvanised, pre-painted (RAL), aluminium'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 1 AND `slug` = 'trapezni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 6, 1, 60, 'Antikondenz filc', 'po izboru', 'Anti-condensation felt', 'optional'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 1 AND `slug` = 'trapezni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 7, 2, 10, 'Visina rebra', '10 mm', 'Rib height', '10 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 2 AND `slug` = 'tr-10-162')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 8, 2, 20, 'Korak rebra', '162,5 mm', 'Rib pitch', '162.5 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 2 AND `slug` = 'tr-10-162')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 9, 2, 30, 'Pokrivna širina', '975 mm', 'Cover width', '975 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 2 AND `slug` = 'tr-10-162')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 10, 2, 40, 'Gornji pojas rebra', '20 mm', 'Rib top', '20 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 2 AND `slug` = 'tr-10-162')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 11, 2, 50, 'Dužina table', 'po meri, 500–13 500 mm', 'Sheet length', 'to order, 500–13,500 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 2 AND `slug` = 'tr-10-162')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 12, 2, 60, 'Materijal', 'pocinkovani, plastificirani (RAL)', 'Material', 'galvanised, pre-painted (RAL)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 2 AND `slug` = 'tr-10-162')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 13, 3, 10, 'Visina rebra', '20 mm', 'Rib height', '20 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 3 AND `slug` = 'tr-20-185')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 14, 3, 20, 'Korak rebra', '185 mm', 'Rib pitch', '185 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 3 AND `slug` = 'tr-20-185')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 15, 3, 30, 'Pokrivna širina', '1110 mm', 'Cover width', '1,110 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 3 AND `slug` = 'tr-20-185')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 16, 3, 40, 'Razvijena širina', '1250 mm', 'Developed width', '1,250 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 3 AND `slug` = 'tr-20-185')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 17, 3, 50, 'Dužina table', 'po meri, 500–13 500 mm', 'Sheet length', 'to order, 500–13,500 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 3 AND `slug` = 'tr-20-185')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 18, 3, 60, 'Antikondenz filc', 'po izboru', 'Anti-condensation felt', 'optional'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 3 AND `slug` = 'tr-20-185')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 19, 4, 10, 'Visina rebra', '35 mm', 'Rib height', '35 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 4 AND `slug` = 'tr-35-270')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 20, 4, 20, 'Korak rebra', '270 mm', 'Rib pitch', '270 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 4 AND `slug` = 'tr-35-270')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 21, 4, 30, 'Pokrivna širina', '1080 mm', 'Cover width', '1,080 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 4 AND `slug` = 'tr-35-270')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 22, 4, 40, 'Ulazna traka', '1250 mm', 'Input strip', '1,250 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 4 AND `slug` = 'tr-35-270')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 23, 4, 50, 'Razmak rožnjača', '0,6–1 m', 'Purlin spacing', '0.6–1 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 4 AND `slug` = 'tr-35-270')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 24, 4, 60, 'Savijanje u luk', 'moguće', 'Arc bending', 'possible'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 4 AND `slug` = 'tr-35-270')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 25, 5, 10, 'Visina rebra', '40 mm', 'Rib height', '40 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 5 AND `slug` = 'tr-40-230')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 26, 5, 20, 'Korak rebra', '230 mm', 'Rib pitch', '230 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 5 AND `slug` = 'tr-40-230')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 27, 5, 30, 'Pokrivna širina', '920 mm', 'Cover width', '920 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 5 AND `slug` = 'tr-40-230')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 28, 5, 40, 'Ulazna traka', '1250 mm', 'Input strip', '1,250 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 5 AND `slug` = 'tr-40-230')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 29, 5, 50, 'Izvedba', 'ojačan u gornjoj zoni', 'Version', 'reinforced in the upper zone'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 5 AND `slug` = 'tr-40-230')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 30, 5, 60, 'Nagib krova', 'veći od 4 %', 'Roof pitch', 'above 4 %'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 5 AND `slug` = 'tr-40-230')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 31, 6, 10, 'Visina rebra', '60 mm', 'Rib height', '60 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 6 AND `slug` = 'tr-60-210')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 32, 6, 20, 'Korak rebra', '210 mm', 'Rib pitch', '210 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 6 AND `slug` = 'tr-60-210')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 33, 6, 30, 'Pokrivna širina', '840 mm', 'Cover width', '840 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 6 AND `slug` = 'tr-60-210')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 34, 6, 40, 'Ukupna širina', '937 mm', 'Overall width', '937 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 6 AND `slug` = 'tr-60-210')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 35, 6, 50, 'Debljina', '0,5–1,0 mm', 'Thickness', '0.5–1.0 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 6 AND `slug` = 'tr-60-210')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 36, 6, 60, 'Standardi', 'EN 10143, EN 10169, EN 1993-1-3, EN 1993-1-5', 'Standards', 'EN 10143, EN 10169, EN 1993-1-3, EN 1993-1-5'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 6 AND `slug` = 'tr-60-210')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 37, 7, 10, 'Modul (dužina crepa)', '350 mm (350–450)', 'Module (tile length)', '350 mm (350–450)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 38, 7, 20, 'Debljina', '0,5 mm ili po zahtevu', 'Thickness', '0.5 mm or to order'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 39, 7, 30, 'Premaz', '25 µm lice / 8 µm naličje', 'Coating', '25 µm face / 8 µm reverse'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 40, 7, 40, 'Težina', 'ispod 5 kg/m²', 'Weight', 'under 5 kg/m²'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 41, 7, 50, 'Najmanji nagib', '14°', 'Minimum pitch', '14°'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 42, 7, 60, 'Boja', 'RAL po izboru', 'Colour', 'RAL of your choice'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 43, 8, 10, 'Profili', 'PR 83/34, PR 38/15, PR 71/10', 'Profiles', 'PR 83/34, PR 38/15, PR 71/10'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 8 AND `slug` = 'parapetni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 44, 8, 20, 'Debljina lima', '0,4–2 mm', 'Sheet thickness', '0.4–2 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 8 AND `slug` = 'parapetni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 45, 8, 30, 'Izvedba', 'bojeni, pocinkovani, HVL', 'Finish', 'painted, galvanised, cold-rolled'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 8 AND `slug` = 'parapetni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 46, 8, 40, 'Izrada', 'po narudžbini', 'Production', 'to order'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 8 AND `slug` = 'parapetni-lim')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 47, 9, 10, 'Standardna dužina', '2,5 m', 'Standard length', '2.5 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 9 AND `slug` = 'lamperija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 48, 9, 20, 'Pokrivna površina table', '0,65 m² (alu)', 'Cover area per panel', '0.65 m² (aluminium)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 9 AND `slug` = 'lamperija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 49, 9, 30, 'Materijal', 'bojeni alu, pocinkovano bojeni, inox, bakar', 'Material', 'painted aluminium, painted galvanised, stainless steel, copper'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 9 AND `slug` = 'lamperija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 50, 9, 40, 'Spoj', 'muški / ženski žleb', 'Joint', 'tongue and groove'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 9 AND `slug` = 'lamperija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 51, 10, 10, 'Oznaka', 'DR!PSTOP', 'Product', 'DR!PSTOP'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 10 AND `slug` = 'antikondenz-filc')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 52, 10, 20, 'Debljina', '0,9 mm', 'Thickness', '0.9 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 10 AND `slug` = 'antikondenz-filc')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 53, 10, 30, 'Nanošenje', 'na naličje, pri profilisanju', 'Application', 'underside, during roll forming'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 10 AND `slug` = 'antikondenz-filc')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 54, 10, 40, 'Uz profile', 'TR 20, TR 35, TR 40, TR 60, imitacija crepa', 'With profiles', 'TR 20, TR 35, TR 40, TR 60, tile-effect sheet'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 10 AND `slug` = 'antikondenz-filc')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 55, 11, 10, 'Primena', 'krov i fasada', 'Use', 'roof and façade'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 11 AND `slug` = 'paneli')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 56, 11, 20, 'Namena', 'objekti sa termičkom izolacijom', 'Purpose', 'insulated buildings'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 11 AND `slug` = 'paneli')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 57, 11, 30, 'Ponuda', 'po upitu', 'Range', 'on request'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 11 AND `slug` = 'paneli')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 58, 12, 10, 'Oblik', 'pravougaoni i okrugli', 'Shape', 'rectangular and circular'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 12 AND `slug` = 'kanali-za-ventilaciju')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 59, 12, 20, 'Fazonski komadi', 'da', 'Fittings', 'yes'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 12 AND `slug` = 'kanali-za-ventilaciju')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 60, 12, 30, 'Izrada', 'po specifikaciji', 'Production', 'to specification'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 12 AND `slug` = 'kanali-za-ventilaciju')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 61, 13, 10, 'Poluokrugli oluci', 'RŠ 250–400 mm', 'Half-round gutters', 'developed width 250–400 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 13 AND `slug` = 'oluci-i-vertikale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 62, 13, 20, 'Neograničena dužina', 'RŠ 333 i vertikala Ø100', 'Unlimited length', '333 mm gutter and Ø100 downpipe'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 13 AND `slug` = 'oluci-i-vertikale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 63, 13, 30, 'Okrugle vertikale', 'Ø80–Ø150', 'Round downpipes', 'Ø80–Ø150'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 13 AND `slug` = 'oluci-i-vertikale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 64, 13, 40, 'Četvrtasti oluci', 'do 8,2 m', 'Box gutters', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 13 AND `slug` = 'oluci-i-vertikale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 65, 13, 50, 'Materijal', 'pocinkovani, bojeni, bakar, aluminijum, inox', 'Material', 'galvanised, painted, copper, aluminium, stainless steel'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 13 AND `slug` = 'oluci-i-vertikale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 66, 14, 10, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 14 AND `slug` = 'gradjevinska-limarija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 67, 14, 20, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 14 AND `slug` = 'gradjevinska-limarija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 68, 14, 30, 'Izrada', 'po meri / po nacrtu', 'Production', 'to measure / to drawing'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 14 AND `slug` = 'gradjevinska-limarija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 69, 14, 40, 'Boja', 'kao pokrivač, RAL', 'Colour', 'matching the roof, RAL'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 14 AND `slug` = 'gradjevinska-limarija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 70, 15, 10, 'Namena', 'spoj dve krovne ravni', 'Purpose', 'junction of two roof planes'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 15 AND `slug` = 'uvale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 71, 15, 20, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 15 AND `slug` = 'uvale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 72, 15, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 15 AND `slug` = 'uvale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 73, 15, 40, 'Izrada', 'po meri', 'Production', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 15 AND `slug` = 'uvale')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 74, 16, 10, 'Namena', 'obrada oko dimnjaka i prodora', 'Purpose', 'detailing around chimneys and penetrations'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 16 AND `slug` = 'iksne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 75, 16, 20, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 16 AND `slug` = 'iksne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 76, 16, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 16 AND `slug` = 'iksne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 77, 16, 40, 'Izrada', 'po meri', 'Production', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 16 AND `slug` = 'iksne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 78, 17, 10, 'Namena', 'završetak na čeonoj strani krova', 'Purpose', 'finish at the gable end of the roof'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 17 AND `slug` = 'veterlajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 79, 17, 20, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 17 AND `slug` = 'veterlajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 80, 17, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 17 AND `slug` = 'veterlajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 81, 17, 40, 'Izrada', 'po meri', 'Production', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 17 AND `slug` = 'veterlajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 82, 18, 10, 'Namena', 'odvođenje vode sa ivice', 'Purpose', 'shed water off the edge'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 18 AND `slug` = 'okapnice')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 83, 18, 20, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 18 AND `slug` = 'okapnice')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 84, 18, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 18 AND `slug` = 'okapnice')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 85, 18, 40, 'Izrada', 'po meri', 'Production', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 18 AND `slug` = 'okapnice')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 86, 19, 10, 'Namena', 'atika, zidovi, prodori', 'Purpose', 'parapets, walls, penetrations'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 19 AND `slug` = 'opsivke')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 87, 19, 20, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 19 AND `slug` = 'opsivke')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 88, 19, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 19 AND `slug` = 'opsivke')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 89, 19, 40, 'Izrada', 'po meri', 'Production', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 19 AND `slug` = 'opsivke')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 90, 20, 10, 'Namena', 'vrh krova, ventilisana i puna', 'Purpose', 'roof apex, ventilated and solid'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 20 AND `slug` = 'slemena')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 91, 20, 20, 'Dužina iz jednog komada', 'do 8,2 m', 'Length in one piece', 'up to 8.2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 20 AND `slug` = 'slemena')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 92, 20, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 20 AND `slug` = 'slemena')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 93, 20, 40, 'Izrada', 'po meri', 'Production', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 20 AND `slug` = 'slemena')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 94, 21, 10, 'Namena', 'zadržavanje snega nad ulazima', 'Purpose', 'hold back snow above entrances'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 21 AND `slug` = 'snegobrani')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 95, 21, 20, 'Izvedba', 'cevni snegobran sa nosačima', 'Design', 'tubular snow guard on brackets'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 21 AND `slug` = 'snegobrani')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 96, 21, 30, 'Dužina komada', '3 m', 'Piece length', '3 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 21 AND `slug` = 'snegobrani')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 97, 21, 40, 'Za crep', 'tegola 0,5 mm; biber, kikinda, bečej, tondach 1 mm', 'For roof tiles', 'tegola 0.5 mm; biber, Kikinda, Bečej, Tondach 1 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 21 AND `slug` = 'snegobrani')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 98, 22, 10, 'Namena', 'zaštita dimnjaka od vode', 'Purpose', 'keep water out of the chimney'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 22 AND `slug` = 'kape-za-dimnjake')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 99, 22, 20, 'Izrada', 'rundovanje, po radiusu', 'Production', 'plate rolling, to radius'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 22 AND `slug` = 'kape-za-dimnjake')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 100, 22, 30, 'Materijal', 'sve vrste lima', 'Material', 'all sheet types'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 22 AND `slug` = 'kape-za-dimnjake')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 101, 22, 40, 'Mera', 'po meri', 'Size', 'to measure'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 22 AND `slug` = 'kape-za-dimnjake')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 102, 23, 10, 'Dimenzije', '200–1000 × 500–1000 mm', 'Sizes', '200–1,000 × 500–1,000 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 23 AND `slug` = 'gazista')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 103, 23, 20, 'Materijal', 'toplovaljani lim S235', 'Material', 'hot-rolled S235 sheet'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 23 AND `slug` = 'gazista')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 104, 23, 30, 'Zaštita', 'toplo cinkovano ili farbano', 'Protection', 'hot-dip galvanised or painted'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 23 AND `slug` = 'gazista')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 105, 24, 10, 'Vrsta', 'šavne, hladno oblikovane (ZP)', 'Type', 'welded, cold-formed (ZP)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 24 AND `slug` = 'kvadratne-i-pravougaone-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 106, 24, 20, 'Oblik', 'kvadratne i pravougaone', 'Shape', 'square and rectangular'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 24 AND `slug` = 'kvadratne-i-pravougaone-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 107, 24, 30, 'Sečenje na meru', 'trakasta testera, do 60°', 'Cutting to length', 'band saw, up to 60°'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 24 AND `slug` = 'kvadratne-i-pravougaone-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 108, 25, 10, 'Vrsta', 'colovne crne, pocinkovane', 'Type', 'black inch-size, galvanised'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 25 AND `slug` = 'okrugle-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 109, 25, 20, 'Lučno savijanje', '1/2"–2" (zid 2–3 mm)', 'Arc bending', '1/2"–2" (wall 2–3 mm)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 25 AND `slug` = 'okrugle-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 110, 25, 30, 'Sečenje na meru', 'da', 'Cutting to length', 'yes'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 25 AND `slug` = 'okrugle-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 111, 26, 10, 'Oblik', 'okrugle i ovalne', 'Shape', 'round and oval'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 26 AND `slug` = 'precizne-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 112, 26, 20, 'Tolerancije', 'uže (tačnost mere)', 'Tolerances', 'tighter (dimensional accuracy)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 26 AND `slug` = 'precizne-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 113, 26, 30, 'Sečenje na meru', 'da', 'Cutting to length', 'yes'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 26 AND `slug` = 'precizne-cevi')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 114, 27, 10, 'Brendovi', 'Bosch, Makita, DeWalt', 'Brands', 'Bosch, Makita, DeWalt'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 27 AND `slug` = 'elektricni-i-rucni-alat')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 115, 27, 20, 'Električni alat', 'bušilice, brusilice, testere, odvijači', 'Power tools', 'drills, grinders, saws, screwdrivers'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 27 AND `slug` = 'elektricni-i-rucni-alat')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 116, 27, 30, 'Potrošni materijal', 'ploče, burgije, listovi', 'Consumables', 'discs, drill bits, blades'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 27 AND `slug` = 'elektricni-i-rucni-alat')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 117, 28, 10, 'Brend', 'Varstroj', 'Brand', 'Varstroj'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 28 AND `slug` = 'oprema-za-varenje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 118, 28, 20, 'Program', 'aparati, elektrode, žice', 'Range', 'machines, electrodes, wire'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 28 AND `slug` = 'oprema-za-varenje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 119, 28, 30, 'Zaštita', 'maske i zaštitna oprema', 'Protection', 'helmets and protective gear'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 28 AND `slug` = 'oprema-za-varenje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 120, 29, 10, 'Program', 'vijci, navrtke, podloške, ankeri, tiplovi', 'Range', 'screws, nuts, washers, anchors, wall plugs'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 29 AND `slug` = 'srafovska-roba-i-okov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 121, 29, 20, 'Okov', 'brave, šarke, reze, katanci', 'Hardware', 'locks, hinges, latches, padlocks'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 29 AND `slug` = 'srafovska-roba-i-okov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 122, 29, 30, 'Brendovi', 'Bane Sekulić, PETITI, FIMET, HOPE', 'Brands', 'Bane Sekulić, PETITI, FIMET, HOPE'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 29 AND `slug` = 'srafovska-roba-i-okov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 123, 30, 10, 'Materijal', 'aluminijum', 'Material', 'aluminium'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 30 AND `slug` = 'aluminijumski-profili-i-lajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 124, 30, 20, 'Program', 'profili, lajsne, završni elementi', 'Range', 'profiles, trims, finishing pieces'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 30 AND `slug` = 'aluminijumski-profili-i-lajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 125, 30, 30, 'Primena', 'suva montaža, oblaganje', 'Use', 'dry construction, cladding'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 30 AND `slug` = 'aluminijumski-profili-i-lajsne')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 126, 31, 10, 'Merdevine', 'Alpos EXPERT, RATIO', 'Ladders', 'Alpos EXPERT, RATIO'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 31 AND `slug` = 'merdevine-i-pomocna-oprema')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 127, 31, 20, 'Materijal', 'aluminijum', 'Material', 'aluminium'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 31 AND `slug` = 'merdevine-i-pomocna-oprema')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `product_specs` (`id`, `product_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 128, 31, 30, 'Pribor', 'Mimont', 'Accessories', 'Mimont'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 31 AND `slug` = 'merdevine-i-pomocna-oprema')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Prikaz proizvoda u tabovima kategorija
-- --------------------------------------------------------------------------
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 7, 2, 10, NULL, NULL, 'Panel sa profilom crepa — klasičan izgled krova uz brzinu montaže čeličnog pokrivača.', 'Sheet with a roof-tile profile — the classic look of a tiled roof with the installation speed of steel roofing.', 'plastificiran
RAL', 'pre-painted
RAL', 'inherit', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 7 AND `slug` = 'imitacija-crepa') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 8, 2, 20, NULL, NULL, 'Fasadni i parapetni profil, u bojenoj i pocinkovanoj izvedbi.', 'Façade and parapet profile, pre-painted or galvanised.', 'fasada', 'façade', 'render', 'tr10', NULL, NULL, NULL, 'Trapezni lim TR 10/162,5 — fasada i parapet', 'Trapezoidal sheet TR 10/162.5 — façades and parapets'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 8 AND `slug` = 'parapetni-lim') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 9, 2, 30, 'Lamperija', 'Metal cladding panels', 'Metalna lamperija za plafone, strehe i oblaganje, sa pratećim lajsnama.', 'Metal cladding panels for ceilings, eaves and lining, with matching trims.', 'plafoni
strehe', 'ceilings
eaves', 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 9 AND `slug` = 'lamperija') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 10, 2, 40, NULL, NULL, 'Sloj koji se nanosi na pokrivni lim i sprečava kondenzaciju na unutrašnjoj strani.', 'A layer applied to the roofing sheet that prevents condensation on the inner side.', NULL, NULL, 'inherit', NULL, NULL, NULL, NULL, 'Slojevi pokrivnog lima', 'Layers of the roofing sheet'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 10 AND `slug` = 'antikondenz-filc') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 11, 2, 50, NULL, NULL, NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 11 AND `slug` = 'paneli') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 12, 2, 60, NULL, NULL, NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 12 AND `slug` = 'kanali-za-ventilaciju') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 15, 3, 10, NULL, NULL, 'spoj dve krovne ravni', 'junction of two roof planes', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 15 AND `slug` = 'uvale') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 16, 3, 20, NULL, NULL, 'obrada oko dimnjaka i prodora', 'detailing around chimneys and penetrations', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 16 AND `slug` = 'iksne') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 17, 3, 30, NULL, NULL, 'završetak na čeonoj strani krova', 'finish at the gable end of the roof', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 17 AND `slug` = 'veterlajsne') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 18, 3, 40, NULL, NULL, 'odvođenje vode sa ivice', 'shed water off the edge', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 18 AND `slug` = 'okapnice') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 19, 3, 50, NULL, NULL, 'atika, zidovi, prodori', 'parapets, walls, penetrations', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 19 AND `slug` = 'opsivke') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 20, 3, 60, NULL, NULL, 'vrh krova, ventilisana i puna', 'roof apex, ventilated and solid', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 20 AND `slug` = 'slemena') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 21, 3, 70, NULL, NULL, 'zadržavanje snega nad ulazima', 'hold back snow above entrances', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 21 AND `slug` = 'snegobrani') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 22, 3, 80, NULL, NULL, 'zaštita dimnjaka od vode', 'keep water out of the chimney', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 22 AND `slug` = 'kape-za-dimnjake') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 23, 3, 90, NULL, NULL, 'pocinkovana, za stepenice i platforme', 'galvanised, for stairs and platforms', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 23 AND `slug` = 'gazista') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 24, 4, 10, NULL, NULL, NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 24 AND `slug` = 'kvadratne-i-pravougaone-cevi') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 4 AND `slug` = 'cevi')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 25, 4, 20, NULL, NULL, NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 25 AND `slug` = 'okrugle-cevi') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 4 AND `slug` = 'cevi')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 26, 4, 30, NULL, NULL, NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 26 AND `slug` = 'precizne-cevi') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 4 AND `slug` = 'cevi')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 27, 6, 10, NULL, NULL, 'Bušilice, brusilice, ubodne i ugaone testere, odvijači, merni alat, ručni limarski alat i prateća potrošna sredstva — rezne i brusne ploče, burgije, listovi.', 'Drills, grinders, jigsaws and mitre saws, screwdrivers, measuring tools, sheet-metal hand tools and consumables — cutting and grinding discs, drill bits, saw blades.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 27 AND `slug` = 'elektricni-i-rucni-alat') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 28, 6, 20, NULL, NULL, 'Aparati, prateći materijal i oprema za varenje <strong>Varstroj</strong> — elektrode, žice, maske i zaštita.', 'Welding machines, consumables and equipment by <strong>Varstroj</strong> — electrodes, wire, welding helmets and protective gear.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 28 AND `slug` = 'oprema-za-varenje') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 29, 6, 30, NULL, NULL, 'Vijci, navrtke, podloške, ankeri i tiplovi, brave, okovi za kapije i vrata, šarke, reze, katanci. Brave i okovi <strong>Bane Sekulić</strong> (Sombor) i italijanskih proizvođača PETITI, FIMET i HOPE.', 'Screws, nuts, washers, anchors and wall plugs, locks, gate and door hardware, hinges, latches, padlocks. Locks and hardware from <strong>Bane Sekulić</strong> (Sombor) and the Italian manufacturers PETITI, FIMET and HOPE.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 29 AND `slug` = 'srafovska-roba-i-okov') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 30, 6, 40, NULL, NULL, NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 30 AND `slug` = 'aluminijumski-profili-i-lajsne') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 31, 6, 50, NULL, NULL, 'Aluminijumske merdevine <strong>Alpos</strong> (Slovenija) — profesionalne EXPERT i poluprofesionalne RATIO — i pomoćni pribor <strong>Mimont</strong>.', 'Aluminium ladders by <strong>Alpos</strong> (Slovenia) — professional EXPERT and semi-professional RATIO — and ancillary accessories by <strong>Mimont</strong>.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 31 AND `slug` = 'merdevine-i-pomocna-oprema') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;
INSERT INTO `product_categories` (`product_id`, `category_id`, `sort_order`, `card_title_sr`, `card_title_en`, `card_text_sr`, `card_text_en`, `card_tags_sr`, `card_tags_en`, `card_image_type`, `card_render_key`, `card_photo_path`, `card_photo_width`, `card_photo_height`, `card_image_alt_sr`, `card_image_alt_en`)
  SELECT 10, 6, 60, NULL, NULL, 'Filc za trapezni i pokrivni lim koji sprečava kondenzaciju na unutrašnjoj strani pokrivača — bitno za hale i nadstrešnice.', 'Felt for trapezoidal and roofing sheet that prevents condensation on the inner side of the roof covering — important for production halls and canopies.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `products` WHERE `id` = 10 AND `slug` = 'antikondenz-filc') AND EXISTS (SELECT 1 FROM `categories` WHERE `id` = 6 AND `slug` = 'alati')
  ON DUPLICATE KEY UPDATE `product_id` = `product_id`;

-- --------------------------------------------------------------------------
-- Usluge i mogućnosti
-- --------------------------------------------------------------------------
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 1, 'secenje-cnc-plazma', 'service', 'Sečenje na CNC plazmi', 'Kompjuterski vođeno rezanje po nacrtu. Čelik, inox, bakar i aluminijum do 30 mm.', 'Mašina je u potpunosti kompjuterski vođena, pa je mogućnost greške svedena na minimum. Plazma je nezamenljiva za sve što nije prava linija — konture, radijuse, rupe, proreze i ugnježdene delove; ponovljivost u seriji je potpuna.

Najbolji format nacrta je DXF ili DWG; radimo i po PDF-u, crtežu ili skici sa kotama. Kada cela specifikacija stigne odjednom, delovi se raspoređuju po tabli tako da otpad bude najmanji.', 'do 30 mm
CNC plazma', 'delovi po nacrtu
konture, rupe, prorezi
serije sa punom ponovljivošću', 'CNC plasma cutting', 'Computer-controlled cutting to drawing. Steel, stainless steel, copper and aluminium up to 30 mm.', 'The machine is fully computer-controlled, so the chance of error is reduced to a minimum. Plasma is indispensable for anything that is not a straight line — contours, radii, holes, slots and nested parts; repeatability across a series is complete.

The best drawing format is DXF or DWG; we also work from a PDF, a drawing or a dimensioned sketch. When the full specification arrives at once, the parts are laid out on the sheet so that scrap is minimal.', 'up to 30 mm
CNC plasma', 'parts to drawing
contours, holes, slots
series with full repeatability', 'render', 'plasma-plate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gasno-rezanje,radni-sto,ponovljivost,secenje-makazama', 10, 1, 'secenje-cnc-plazma'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 2, 'gasno-rezanje', 'service', 'Gasno rezanje', 'Za debele ploče i masivne pripremke — do 150 mm debljine materijala.', 'Gasno rezanje koristimo iznad debljina gde plazma više nije ekonomična — za ploče do 150 mm, masivne pripremke i grubu pripremu.

Reže se na istom CNC stolu od 2,5 × 8 m, po nacrtu.', 'do 150 mm
gasno', 'debele ploče
masivni pripremci
gruba priprema', 'Oxy-fuel cutting', 'For thick plate and heavy blanks — material thickness up to 150 mm.', 'Oxy-fuel cutting is what we use above the thicknesses where plasma is no longer economical — for plate up to 150 mm, heavy blanks and rough preparation.

It is cut on the same 2.5 × 8 m CNC table, to drawing.', 'up to 150 mm
oxy-fuel', 'thick plate
heavy blanks
rough preparation', 'render', 'plasma-plate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'secenje-cnc-plazma,radni-sto', 20, 1, 'gasno-rezanje'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 3, 'secenje-makazama', 'service', 'Sečenje limova makazama', 'Hidraulične i elektromotorne makaze; lim do 13 mm, prohrom do 9 mm.', 'Makaze su najbrže i najjeftinije rešenje kada su vam potrebni ravni rezovi i formatiranje table na meru. Nema toplotnog uticaja na materijal i rez je čist.

Hidraulične makaze MHS 3100/13 seku do 13 mm (inox do 9 mm) na dužini reza do 3100 mm; elektromotorne makaze do 1,5 mm na dužini 2 m.', 'lim do 13 mm
prohrom do 9 mm', 'formatiranje table
ravni rezovi
inox bez oštećenja površine', 'Sheet cutting on guillotine shears', 'Hydraulic and electric guillotine shears; sheet up to 13 mm, stainless steel up to 9 mm.', 'Guillotine shears are the fastest and cheapest solution when you need straight cuts and sheets cut to size. There is no heat input into the material and the cut is clean.

The MHS 3100/13 hydraulic shear cuts up to 13 mm (stainless steel up to 9 mm) over a cutting length of up to 3,100 mm; the electric shear up to 1.5 mm over 2 m.', 'sheet up to 13 mm
stainless up to 9 mm', 'cutting sheets to size
straight cuts
stainless steel without surface damage', 'render', 'sheet-stack', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'slitovanje,secenje-cnc-plazma,limovi', 30, 1, 'secenje-makazama'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 4, 'slitovanje', 'service', 'Podužno sečenje kotura (slitovanje)', 'Traka iz kotura u željenoj širini, do 1260 mm ulazne širine.', 'Slitovanje je za one koji rade sa koturom: umesto da kupujete traku fabričke širine, dobijate baš onu koja vam treba, pa nemate otpad po dužini.

Sliter seče lim do 1 mm iz kotura širine do 1260 mm, najviše 7 traka željene širine; kotur do 6 t, koturići po dogovoru.', 'do 1260 mm
ulazna širina', 'trake za profilisanje
olučne trake
serijska proizvodnja', 'Longitudinal coil cutting (slitting)', 'Strip from coil in the width you need, input coil width up to 1,260 mm.', 'Slitting is for those who work from coil: instead of buying strip in the mill width, you get exactly the width you need, so there is no scrap along the length.

The slitter cuts sheet up to 1 mm from coils up to 1,260 mm wide, into up to 7 strips of the required width; coil up to 6 t, small coils by arrangement.', 'up to 1,260 mm
input width', 'strip for roll forming
gutter strip
series production', 'render', 'coil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'premotavanje-kotura,secenje-makazama,limovi', 40, 1, 'slitovanje'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 5, 'premotavanje-kotura', 'service', 'Premotavanje limova u koturu', 'Prepakivanje i priprema kotura za dalju obradu ili transport.', 'Prepakivanje za dalju obradu, transport ili manje serije. Odmotač–namotač radi lim do 1,2 mm i širine do 1260 mm, uz kontrolu dužine.

Kotur do 6 t, fabrički otvor 500–600 mm; premotani otvor 490–600 mm. Uslove dogovaramo uz ponudu.', 'kotur
transport', 'manje serije
transport
priprema za obradu', 'Recoiling of sheet coils', 'Repacking and preparing coils for further processing or transport.', 'Repacking for further processing, transport or smaller batches. The decoiler–recoiler handles sheet up to 1.2 mm and up to 1,260 mm wide, with length control.

Coil up to 6 t, mill inner diameter 500–600 mm; rewound inner diameter 490–600 mm. Terms are agreed with the quote.', 'coil
transport', 'smaller batches
transport
preparation for processing', 'render', 'coil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'slitovanje,limovi', 50, 1, 'premotavanje-kotura'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 6, 'savijanje-limova', 'service', 'Savijanje i oblikovanje limova', 'NC presa 3 m i apkant presa 8,2 m — opšivke i profili u jednom prolazu.', 'Dužina prese je ono što se u praksi najviše oseti: opšivka, okapnica ili slemena od preko osam metara izlazi iz jednog prolaza, bez poprečnog spoja koji kasnije propušta ili se vidi.

NC hidraulična presa 200 t savija čelik do 10 mm (inox do 7 mm) na dužini do 3100 mm; rundovanje radi cilindre, konuse i kape za dimnjake (do 0,8 mm Ø80–Ø800, do 4 mm najmanji prečnik 190 mm).', 'NC presa 3 m
apkant presa 8,2 m', 'opšivke, okapnice, slemena
hladno oblikovani profili
cilindri i konusi', 'Sheet bending and forming', '3 m NC press brake and 8.2 m press brake — flashings and profiles in a single pass.', 'In practice, the length of the press is what makes the biggest difference: a flashing, eaves drip flashing or ridge cap over eight metres long comes out of a single pass, with no transverse joint that later leaks or shows.

The 200 t NC hydraulic press brake bends steel up to 10 mm (stainless up to 7 mm) over lengths up to 3,100 mm; plate rolling makes cylinders, cones and chimney caps (up to 0.8 mm Ø80–Ø800, up to 4 mm minimum diameter 190 mm).', '3 m NC press brake
8.2 m press brake', 'flashings, eaves drips, ridge caps
cold-formed sections
cylinders and cones', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gradjevinska-limarija,probijanje-i-isecanje-uglova,lucno-savijanje', 60, 1, 'savijanje-limova'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 7, 'lucno-savijanje', 'service', 'Lučno savijanje cevi i flahova', 'Kružno i lučno oblikovanje cevi i flahova za zaobljene elemente i ograde.', 'Kružno i lučno oblikovanje cevi i flahova za zaobljene elemente, ograde i kapije.

Mašina savija okrugle cevi 1/2"–2", kvadratne do 50×50 mm i pravougaone do 40×60 mm, sa zidom 2–3 mm.', 'cevi
flahovi', 'ograde
lučni elementi
kapije', 'Arc bending of tubes and flat bars', 'Circular and arc forming of tubes and flat bars for curved elements and railings.', 'Circular and arc forming of tubes and flat bars for curved elements, railings and gates.

The machine bends round tubes 1/2"–2", square up to 50×50 mm and rectangular up to 40×60 mm, with a 2–3 mm wall.', 'tubes
flat bars', 'railings
curved elements
gates', 'render', 'tubes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'okrugle-cevi,kvadratne-i-pravougaone-cevi,ispravljanje-flahova', 70, 1, 'lucno-savijanje'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 8, 'ispravljanje-flahova', 'service', 'Ispravljanje i peglanje flahova', 'Ravnanje i peglanje pljosnatih profila pre dalje obrade ili ugradnje.', 'Ravnanje i peglanje pljosnatih profila pre dalje obrade ili ugradnje.

Mašina za ispravljanje (peglanje) flahova radi do 10 mm, sa obaranjem ivica.', 'flah
peglanje', 'priprema za obradu
kovane ograde
konstrukcije', 'Straightening and flattening of flat bars', 'Straightening and flattening of flat sections before further processing or installation.', 'Straightening and flattening of flat sections before further processing or installation.

The flat bar straightening machine handles up to 10 mm, with edge chamfering.', 'flat bar
flattening', 'preparation for processing
wrought-iron fences
structures', 'render', 'sections', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lucno-savijanje,grifovanje,celicni-profili', 80, 1, 'ispravljanje-flahova'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 9, 'izrada-trapeznog-lima', 'service', 'Izrada trapeznog pokrivnog lima', 'Pet TR profila, dužina po meri objekta — bez poprečnih spojeva.', 'Profilirke rade iz kotura, pa dužinu diktira vaš objekat — krov ili fasada bez poprečnih preklopa. Profilišemo TR 10 – TR 60 i imitaciju crepa (novi model od 2020).

Trapezni lim do 2,5 m (rebro 15/10/15) radimo i na hidrauličnoj presi, do 1 mm (aluminijum i bakar do 1,5 mm), sa brojem rebara po želji.', 'pet TR profila
po meri objekta', 'krovovi
fasade
nadstrešnice', 'Trapezoidal profiled sheet production', 'Five TR profiles, length to suit the building — no transverse joints.', 'The roll formers work from coil, so the length is set by your building — a roof or façade with no transverse laps. We roll-form TR 10 – TR 60 and tile-effect roofing sheet (new model since 2020).

Trapezoidal sheet up to 2.5 m (rib 15/10/15) is also made on a hydraulic press, up to 1 mm (aluminium and copper up to 1.5 mm), with any number of ribs.', 'five TR profiles
to suit the building', 'roofs
façades
canopies', 'render', 'tr35', NULL, NULL, NULL, NULL, NULL, 'tr20', 'trapez', NULL, 'trapezni-lim,tr-35-270,imitacija-crepa', 90, 1, 'izrada-trapeznog-lima'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 10, 'izrada-oluka', 'service', 'Izrada oluka i vertikala', 'Poluokrugli i četvrtasti oluci, okrugle i četvrtaste vertikale, dužina po želji.', 'Poluokrugle oluke RŠ 333 i vertikale Ø100 profilišemo na automatizovanim pokretnim linijama u neograničenoj dužini; ostale formate i materijale do dužina iz tabele.

Uz oluke izrađujemo i kompletan pribor u istom limu i boji kao pokrivač.', 'poluokrugli
četvrtasti', 'stambeni objekti
hale
rekonstrukcije', 'Gutter and downpipe production', 'Half-round and box gutters, round and square downpipes, any length you need.', 'We roll-form half-round gutters with a 333 mm developed width and Ø100 downpipes on automated mobile lines in unlimited lengths; other formats and materials up to the lengths in the table.

We also make the full set of accessories in the same sheet and colour as the roof covering.', 'half-round
box', 'residential buildings
production halls
refurbishment', 'render', 'gutter-halfround', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'oluci-i-vertikale,gradjevinska-limarija', 100, 1, 'izrada-oluka'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 11, 'profilisanje-parapeta-i-lamperije', 'service', 'Profilisanje parapetnog lima i lamperije', 'Fasadni i unutrašnji profili sa sopstvenih profilirki.', 'Parapetni lim profilišemo u tri profila (PR 83/34, 38/15, 71/10), a lamperiju u standardnoj dužini 2,5 m — po narudžbini i u drugim dužinama.

Na sopstvenoj mašini radimo i kanale za ventilaciju i fazonske komade, po specifikaciji.', 'fasadni
unutrašnji', 'fasade
plafoni
ventilacija', 'Roll forming of parapet lining sheet and metal cladding panels', 'Façade and interior profiles from our own roll formers.', 'We roll-form parapet sheet in three profiles (PR 83/34, 38/15, 71/10) and cladding panels in a standard 2.5 m length — other lengths also to order.

Our own machine also makes ventilation ducts and fittings, to specification.', 'façade
interior', 'façades
ceilings
ventilation', 'render', 'tr10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'parapetni-lim,lamperija,kanali-za-ventilaciju', 110, 1, 'profilisanje-parapeta-i-lamperije'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 12, 'probijanje-i-isecanje-uglova', 'service', 'Probijanje i isecanje uglova', 'Prese za otvore, rupe i pripremu spojeva pre savijanja.', 'Otvori i priprema spojeva pre savijanja, po radnom nalogu.

Presa za isecanje uglova radi čelični lim do 4 mm pod uglom 30°–140°; Iron Worker je kombinovana mašina za probijanje, deformaciju, isecanje uglova i sečenje lima i profila.', 'otvori
pre savijanja', 'priprema za savijanje
kutije i maske
konstrukcije', 'Punching and corner notching', 'Presses for openings, holes and joint preparation before bending.', 'Openings and joint preparation before bending, per work order.

The corner notching press handles steel sheet up to 4 mm at angles of 30°–140°; the Iron Worker is a combination machine for punching, forming, corner notching and cutting sheet and sections.', 'openings
before bending', 'preparation for bending
boxes and covers
structures', 'render', 'plasma-plate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'savijanje-limova,secenje-makazama', 120, 1, 'probijanje-i-isecanje-uglova'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 13, 'secenje-profila', 'service', 'Sečenje čeličnih profila', 'Trakaste testere za flah, ugaonike, U i I profile, cevi i pune profile.', 'Trakastim testerama sečemo flah, ugaonike, U i I profile, cevi i pune profile na dužinu koju tražite — pa ne plaćate ostatak šipke koji vam ne treba.

Trakasta testera seče pod uglom do 60°, pojedinačno ili u snopu, uz hlađenje emulzijom (motor 1,3/1,5 kW, brzina reza 38/76 m/min, list 3090×27×0,9 mm).', 'trakasta testera
U i I profili', 'metalne konstrukcije
ograde i kapije', 'Cutting steel sections', 'Band saws for flat bar, angles, channels, I-sections, tubes and solid bars.', 'On band saws we cut flat bar, angles, channels, I-sections, tubes and solid bars to the length you ask for — so you do not pay for the rest of the bar that you do not need.

The band saw cuts at angles up to 60°, singly or in bundles, with emulsion cooling (motor 1.3/1.5 kW, cutting speed 38/76 m/min, blade 3,090×27×0.9 mm).', 'band saw
channels, I-sections', 'steel structures
fences and gates', 'render', 'sections', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'grifovanje,celicni-profili,cevi-i-zp-profili', 130, 1, 'secenje-profila'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 14, 'grifovanje', 'service', 'Grifovanje šipkastih profila', 'Dekorativna tekstura na flahu i kvadratnom profilu za kovane elemente.', 'Grifovanje je dekorativna tekstura koja se utiskuje po dužini šipkastog profila. Koristi se za kovane ograde, kapije i ogradne elemente gde se traži izgled ručno kovanog gvožđa.

Grifujemo flah, firkant i kutijaste profile svih komercijalnih dimenzija, uz graviranje (šaranje) flaha. Držimo i gotov grifovani flah i grifovane cevi na lageru.', 'flah
kvadratni profil', 'kovane ograde
kapije
ogradni elementi', 'Embossing of bar sections', 'Decorative texture on flat bar and square bar for wrought-iron elements.', 'Embossing is a decorative texture pressed along the length of a bar section. It is used for wrought-iron railings, gates and fence elements where the look of hand-forged iron is wanted.

We emboss flat bar, square bar and box sections in all commercial sizes, and engrave patterns on flat bar. We also keep ready-made embossed flat bar and embossed tubes in stock.', 'flat bar
square bar', 'wrought-iron fences
gates
fence elements', 'render', 'sections', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'secenje-profila,ispravljanje-flahova,celicni-profili', 140, 1, 'grifovanje'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 15, 'radni-sto', 'capability', 'Radni sto 2,5 × 8 m', 'Ugnježdavanje više delova iz jedne table.', 'Radni sto CNC plazme je 2,5 × 8 m, pa ostavlja prostora da se iz jedne table izvuče više komada. Raspored delova po tabli (ugnježdavanje) obično se dogovara pri prijemu specifikacije.

Po pravilu, cela specifikacija poslata odjednom daje manje otpada nego naručivanje komad po komad, a razlika u ceni po delu ume da bude značajna.', '2,5 × 8 m
ugnježdavanje', 'veće serije
veliki delovi
manje otpada', 'Cutting table 2.5 × 8 m', 'Nesting several parts from one sheet.', 'The CNC plasma cutting table is 2.5 × 8 m, which leaves room to get more parts out of one sheet. The layout of parts on the sheet (nesting) is usually agreed when we receive the specification.

As a rule, a full specification sent at once produces less scrap than ordering part by part, and the difference in price per part can be significant.', '2.5 × 8 m
nesting', 'larger series
large parts
less scrap', 'render', 'plasma-plate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'secenje-cnc-plazma,ponovljivost,gasno-rezanje', 150, 1, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `services` (`id`, `slug`, `kind`, `title_sr`, `summary_sr`, `description_sr`, `tags_sr`, `apps_sr`, `title_en`, `summary_en`, `description_en`, `tags_en`, `apps_en`, `image_type`, `render_key`, `illu_key`, `photo_path`, `photo_width`, `photo_height`, `drawing_path`, `calc_id`, `calc_tabs`, `konf_hash`, `related_slugs`, `sort_order`, `is_active`, `icon_key`)
  SELECT 16, 'ponovljivost', 'capability', 'Ponovljivost', 'Isti program — isti deo, od prvog do poslednjeg komada.', 'Pošto se glava kreće po programu, a ne po ruci operatera, oblik reza je tačno onaj sa nacrta — od prvog do poslednjeg komada u seriji.

Plazma ostavlja usku zonu toplotnog uticaja i blagi kosi rez; ako vam treba ivica bez ikakve dorade, recite unapred — za ravne rezove su makaze po pravilu bolji i jeftiniji izbor.', 'CNC program', 'serijski delovi
ponovljene narudžbine
složene konture', 'Repeatability', 'Same program — same part, from the first piece to the last.', 'Because the torch follows a program, not the operator''s hand, the shape of the cut is exactly the one on the drawing — from the first to the last piece in the series.

Plasma leaves a narrow heat-affected zone and a slight bevel on the cut; if you need an edge with no finishing at all, tell us in advance — for straight cuts the guillotine shear is, as a rule, the better and cheaper choice.', 'CNC program', 'series parts
repeat orders
complex contours', 'render', 'plasma-plate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'secenje-cnc-plazma,radni-sto', 160, 1, NULL
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Tehnički podaci usluga
-- --------------------------------------------------------------------------
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 1, 1, 10, 'Debljina', 'do 30 mm', 'Thickness', 'up to 30 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 1 AND `slug` = 'secenje-cnc-plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 2, 1, 20, 'Materijali', 'crni čelik, inox, bakar, aluminijum', 'Materials', 'black steel, stainless steel, copper, aluminium'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 1 AND `slug` = 'secenje-cnc-plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 3, 1, 30, 'Radni sto', '2,5 × 8 m', 'Cutting table', '2.5 × 8 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 1 AND `slug` = 'secenje-cnc-plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 4, 1, 40, 'Nacrt', 'DXF, DWG, PDF, skica', 'Drawing', 'DXF, DWG, PDF, sketch'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 1 AND `slug` = 'secenje-cnc-plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 5, 2, 10, 'Debljina', 'do 150 mm', 'Thickness', 'up to 150 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 2 AND `slug` = 'gasno-rezanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 6, 2, 20, 'Materijal', 'crni čelik — ploče', 'Material', 'black steel — plate'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 2 AND `slug` = 'gasno-rezanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 7, 2, 30, 'Radni sto', '2,5 × 8 m', 'Cutting table', '2.5 × 8 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 2 AND `slug` = 'gasno-rezanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 8, 3, 10, 'Lim', 'do 13 mm (450 MPa)', 'Sheet', 'up to 13 mm (450 MPa)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 3 AND `slug` = 'secenje-makazama')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 9, 3, 20, 'Inox', 'do 9 mm (650 MPa)', 'Stainless steel', 'up to 9 mm (650 MPa)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 3 AND `slug` = 'secenje-makazama')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 10, 3, 30, 'Dužina reza', 'do 3100 mm', 'Cutting length', 'up to 3,100 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 3 AND `slug` = 'secenje-makazama')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 11, 3, 40, 'Tanak lim', 'do 1,5 mm na 2 m', 'Thin sheet', 'up to 1.5 mm over 2 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 3 AND `slug` = 'secenje-makazama')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 12, 4, 10, 'Ulazna širina', 'do 1260 mm', 'Input width', 'up to 1,260 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 4 AND `slug` = 'slitovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 13, 4, 20, 'Debljina', 'do 1 mm', 'Thickness', 'up to 1 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 4 AND `slug` = 'slitovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 14, 4, 30, 'Broj traka', 'do 7', 'Strips', 'up to 7'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 4 AND `slug` = 'slitovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 15, 4, 40, 'Kotur', 'do 6 t', 'Coil', 'up to 6 t'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 4 AND `slug` = 'slitovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 16, 5, 10, 'Debljina', 'do 1,2 mm', 'Thickness', 'up to 1.2 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 5 AND `slug` = 'premotavanje-kotura')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 17, 5, 20, 'Širina', 'do 1260 mm', 'Width', 'up to 1,260 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 5 AND `slug` = 'premotavanje-kotura')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 18, 5, 30, 'Kotur', 'do 6 t', 'Coil', 'up to 6 t'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 5 AND `slug` = 'premotavanje-kotura')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 19, 5, 40, 'Otvor', '490–600 mm', 'Inner diameter', '490–600 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 5 AND `slug` = 'premotavanje-kotura')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 20, 6, 10, 'Apkant presa', '8,2 m (do 0,8 mm); ravan lim do 4 mm na 8 m', 'Press brake', '8.2 m (up to 0.8 mm); flat sheet up to 4 mm over 8 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 6 AND `slug` = 'savijanje-limova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 21, 6, 20, 'NC presa 200 t', 'čelik 10 mm, inox 7 mm, 3100 mm', 'NC press brake 200 t', 'steel 10 mm, stainless 7 mm, 3,100 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 6 AND `slug` = 'savijanje-limova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 22, 6, 30, 'Rundovanje', 'Ø80–Ø800 (do 0,8 mm)', 'Plate rolling', 'Ø80–Ø800 (up to 0.8 mm)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 6 AND `slug` = 'savijanje-limova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 23, 6, 40, 'Apoling 2 m', 'do 1,5 mm', 'Folding machine 2 m', 'up to 1.5 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 6 AND `slug` = 'savijanje-limova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 24, 7, 10, 'Okrugle cevi', '1/2"–2"', 'Round tubes', '1/2"–2"'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 7 AND `slug` = 'lucno-savijanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 25, 7, 20, 'Kvadratne', 'do 50×50 mm', 'Square', 'up to 50×50 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 7 AND `slug` = 'lucno-savijanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 26, 7, 30, 'Pravougaone', 'do 40×60 mm', 'Rectangular', 'up to 40×60 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 7 AND `slug` = 'lucno-savijanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 27, 7, 40, 'Zid', '2–3 mm', 'Wall', '2–3 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 7 AND `slug` = 'lucno-savijanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 28, 8, 10, 'Debljina flaha', 'do 10 mm', 'Flat bar thickness', 'up to 10 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 8 AND `slug` = 'ispravljanje-flahova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 29, 8, 20, 'Dorada', 'obaranje ivica', 'Finishing', 'edge chamfering'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 8 AND `slug` = 'ispravljanje-flahova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 30, 9, 10, 'Profili', 'TR 10 – TR 60', 'Profiles', 'TR 10 – TR 60'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 9 AND `slug` = 'izrada-trapeznog-lima')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 31, 9, 20, 'Dužina', 'po meri objekta', 'Length', 'to suit the building'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 9 AND `slug` = 'izrada-trapeznog-lima')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 32, 9, 30, 'Presa do 2,5 m', 'rebro 15/10/15', 'Press up to 2.5 m', 'rib 15/10/15'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 9 AND `slug` = 'izrada-trapeznog-lima')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 33, 9, 40, 'Imitacija crepa', 'novi model od 2020', 'Tile-effect sheet', 'new model since 2020'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 9 AND `slug` = 'izrada-trapeznog-lima')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 34, 10, 10, 'Oluk RŠ 333', 'neograničena dužina', 'Gutter 333 mm', 'unlimited length'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 10 AND `slug` = 'izrada-oluka')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 35, 10, 20, 'Vertikala Ø100', 'neograničena dužina', 'Downpipe Ø100', 'unlimited length'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 10 AND `slug` = 'izrada-oluka')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 36, 10, 30, 'Linije', 'automatizovane, pokretne', 'Lines', 'automated, mobile'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 10 AND `slug` = 'izrada-oluka')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 37, 11, 10, 'Parapet', 'PR 83/34, 38/15, 71/10', 'Parapet', 'PR 83/34, 38/15, 71/10'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 11 AND `slug` = 'profilisanje-parapeta-i-lamperije')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 38, 11, 20, 'Lamperija', '2,5 m (i druge dužine)', 'Cladding panels', '2.5 m (other lengths too)'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 11 AND `slug` = 'profilisanje-parapeta-i-lamperije')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 39, 11, 30, 'Kanali', 'po specifikaciji', 'Ducts', 'to specification'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 11 AND `slug` = 'profilisanje-parapeta-i-lamperije')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 40, 12, 10, 'Isecanje uglova', 'lim do 4 mm, 30°–140°', 'Corner notching', 'sheet up to 4 mm, 30°–140°'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 12 AND `slug` = 'probijanje-i-isecanje-uglova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 41, 12, 20, 'Iron Worker', 'probijanje i deformacija', 'Iron Worker', 'punching and forming'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 12 AND `slug` = 'probijanje-i-isecanje-uglova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 42, 12, 30, 'Izrada', 'po nalogu', 'Production', 'per work order'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 12 AND `slug` = 'probijanje-i-isecanje-uglova')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 43, 13, 10, 'Ugao reza', 'do 60°', 'Cutting angle', 'up to 60°'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 13 AND `slug` = 'secenje-profila')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 44, 13, 20, 'Način', 'pojedinačno ili u snopu', 'Mode', 'single or bundle'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 13 AND `slug` = 'secenje-profila')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 45, 13, 30, 'Brzina reza', '38/76 m/min', 'Cutting speed', '38/76 m/min'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 13 AND `slug` = 'secenje-profila')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 46, 13, 40, 'List', '3090×27×0,9 mm', 'Blade', '3,090×27×0.9 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 13 AND `slug` = 'secenje-profila')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 47, 14, 10, 'Profili', 'flah, firkant, kutijasti', 'Sections', 'flat bar, square bar, box sections'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 14 AND `slug` = 'grifovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 48, 14, 20, 'Dimenzije', 'sve komercijalne', 'Sizes', 'all commercial'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 14 AND `slug` = 'grifovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 49, 14, 30, 'Dodatno', 'graviranje flaha', 'Extra', 'engraved patterns on flat bar'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 14 AND `slug` = 'grifovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 50, 14, 40, 'Lager', 'grifovani flah i cevi', 'Stock', 'embossed flat bar and tubes'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 14 AND `slug` = 'grifovanje')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 51, 15, 10, 'Dimenzije stola', '2,5 × 8 m', 'Table size', '2.5 × 8 m'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 15 AND `slug` = 'radni-sto')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 52, 15, 20, 'Plazma', 'do 30 mm', 'Plasma', 'up to 30 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 15 AND `slug` = 'radni-sto')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 53, 15, 30, 'Gasno', 'do 150 mm', 'Oxy-fuel', 'up to 150 mm'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 15 AND `slug` = 'radni-sto')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 54, 15, 40, 'Raspored', 'ugnježdavanje po specifikaciji', 'Layout', 'nesting per specification'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 15 AND `slug` = 'radni-sto')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 55, 16, 10, 'Upravljanje', 'CNC program', 'Control', 'CNC program'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 16 AND `slug` = 'ponovljivost')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 56, 16, 20, 'Serija', 'od jednog komada do serije', 'Batch', 'from a single piece to a series'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 16 AND `slug` = 'ponovljivost')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `service_specs` (`id`, `service_id`, `sort_order`, `label_sr`, `value_sr`, `label_en`, `value_en`)
  SELECT 57, 16, 30, 'Nacrt', 'DXF / DWG direktno u program', 'Drawing', 'DXF / DWG straight into the program'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `services` WHERE `id` = 16 AND `slug` = 'ponovljivost')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Reference
-- --------------------------------------------------------------------------
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 1, 'ref-rad-na-visini', 'demand', 'Rad na visini', 'Limarska galanterija i spusne vertikale na Kliničkom centru Srbije, na visini <strong>preko 30 m</strong>. Na stambenim objektima u Beogradu, silosima i šećeranama — <strong>preko 50 m</strong>.', NULL, 'Working at height', 'Sheet-metal roofing accessories and downpipes at the University Clinical Centre of Serbia, at a height of <strong>over 30 m</strong>. On residential buildings in Belgrade, silos and sugar factories — <strong>over 50 m</strong>.', NULL, 'ref-rad-na-visini', 'photo', NULL, 'assets/tricom-1.jpg', 1672, 941, NULL, NULL, 10, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 2, 'ref-velike-kolicine', 'demand', 'Velike količine', 'Kompletni krovopokrivački i limarski radovi od bakarnog lima na Rezidenciji predsednika republike u Karađorđevu — <strong>preko 30 tona bakra</strong>.', NULL, 'Large quantities', 'Complete roofing and sheet-metal work in copper sheet at the Residence of the President of the Republic in Karađorđevo — <strong>over 30 tonnes of copper</strong>.', NULL, 'ref-velike-kolicine', 'render', 'sheet-stack', NULL, NULL, NULL, 'Limovi u tablama', 'Sheet metal in sheets', 20, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 3, 'ref-slozeni-detalji', 'demand', 'Složeni detalji', 'Bakarni krovovi predsedničke rezidencije u Beogradu, više desetina vila na Dedinju u diplomatskoj upotrebi, pozorište KPGT u staroj šećerani, mlinovi, poslovne zgrade i proizvodne hale.', NULL, 'Complex details', 'Copper roofs of the presidential residence in Belgrade, dozens of villas in Dedinje used by diplomatic missions, the KPGT theatre in the old sugar factory, mills, office buildings and production halls.', NULL, 'ref-slozeni-detalji', 'render', 'flashing-set', NULL, NULL, NULL, 'Opšivke', 'Flashings', 30, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 4, 'ref-krovopokrivacki-i-olucni-elementi', 'scope', 'Krovopokrivački i olučni elementi', 'Beskonačni oluci, vetar lajsne, pokrivne table (pocinkovane, bakarne), pomoćna konstrukcija, limarska galanterija, kompletni pokrivači i opšivke za stambene, poslovne i rezidencijalne objekte — kao podizvođač i za izvođačku firmu Ganex Krečković na rekonstrukciji pijace Zeleni venac.', NULL, 'Roofing and gutter elements', 'Seamless gutters, verge flashings, roofing sheets (galvanised, copper), substructure, sheet-metal roofing accessories, complete roof coverings and flashings for residential, commercial and prestige residential buildings — as a subcontractor, and for the contractor Ganex Krečković on the reconstruction of the Zeleni Venac market.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 40, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 5, 'ref-proizvodi-od-limenih-tabli', 'scope', 'Proizvodi od limenih tabli', 'Reklamni panoi, maske za nadstrešnice i fasade (benzinske pumpe, poslovni objekti) i limovi za enterijer — natprozorne limene maske za ceo PC Ušće.', NULL, 'Products made from sheet', 'Advertising panels, cover panels for canopies and façades (petrol stations, commercial buildings) and sheet for interiors — sheet-metal window-head cover panels for the whole Ušće Business Centre.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 50, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 6, 'ref-metalne-konstrukcije', 'scope', 'Metalne konstrukcije', 'Noseće rešetke, stubovi od čeličnih profila i druge metalne konstrukcije po projektu izvođača.', NULL, 'Metal structures', 'Load-bearing trusses, columns made of steel sections and other metal structures to the contractor’s design.', NULL, NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 60, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 7, 'ref-rezidencija-predsednika-republike-karadjordjevo', 'project', 'Rezidencija predsednika republike, Karađorđevo', 'Kompletni krovopokrivački radovi na rezidencijalnom predsedničkom kompleksu — obrada lima za pokrivanje, proizvodnja svih pratećih elemenata ekskluzivnog bakarnog krova i ugradnja.', '32 t BAKRA · 48 DANA', 'Residence of the President of the Republic, Karađorđevo', 'Complete roofing work on the presidential residential complex — processing of the roofing sheet, manufacture of all accompanying elements of an exclusive copper roof, and installation.', '32 t OF COPPER · 48 DAYS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 70, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 8, 'ref-predsednicka-rezidencija-beograd', 'project', 'Predsednička rezidencija, Beograd', 'TRICOM limarija i metalni elementi.', 'BAKAR · LIMARIJA', 'Presidential Residence, Belgrade', 'TRICOM sheet-metal work and metal elements.', 'COPPER · SHEET-METAL WORK', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 80, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 9, 'ref-vile-na-dedinju', 'project', 'Vile na Dedinju', 'Više desetina vila koje koriste diplomatsko-konzularna predstavništva — bakarni krovovi i komplikovani limarski detalji.', 'DIPLOMATSKI OBJEKTI', 'Villas in Dedinje', 'Dozens of villas used by diplomatic and consular missions — copper roofs and intricate sheet-metal details.', 'DIPLOMATIC BUILDINGS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 90, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 10, 'ref-beograd-na-vodi', 'project', 'Beograd na vodi', 'Isporuka elemenata za fasadu i krov na objektima kompleksa.', 'STAMBENO-POSLOVNI', 'Belgrade Waterfront', 'Supply of façade and roof elements for buildings in the complex.', 'RESIDENTIAL AND COMMERCIAL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 100, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 11, 'ref-poslovni-centar-usce', 'project', 'Poslovni centar Ušće', 'Isporuka za ugradnju plastificiranih nadprozorskih maski i delova enterijera za ceo PC Ušće.', 'POSLOVNI OBJEKAT', 'Ušće Business Centre', 'Supply of pre-painted window-head cover panels and interior parts for installation throughout the Ušće Business Centre.', 'OFFICE BUILDING', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 110, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 12, 'ref-pijaca-zeleni-venac-beograd', 'project', 'Pijaca Zeleni venac, Beograd', 'Isporuka elemenata za rekonstrukciju tržnice, za Ganex Krečković.', 'ZA GANEX KREČKOVIĆ', 'Zeleni Venac market, Belgrade', 'Supply of elements for the reconstruction of the market hall, for Ganex Krečković.', 'FOR GANEX KREČKOVIĆ', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 120, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 13, 'ref-klinicki-centar-srbije', 'project', 'Klinički centar Srbije', 'Limarska galanterija i spusne vertikale, uz rad na visini preko 30 metara.', 'RAD NA VISINI +30 m', 'University Clinical Centre of Serbia', 'Sheet-metal roofing accessories and downpipes, with work at a height of over 30 metres.', 'WORK AT HEIGHT +30 m', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 130, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 14, 'ref-pupinova-palata-novi-sad', 'project', 'Pupinova palata, Novi Sad', 'Isporuka limarskih i metalnih elemenata za javni objekat u Novom Sadu.', 'JAVNI OBJEKAT', 'Pupin Palace, Novi Sad', 'Supply of sheet-metal and metal elements for a public building in Novi Sad.', 'PUBLIC BUILDING', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 140, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 15, 'ref-pozoriste-kpgt-stara-secerana', 'project', 'Pozorište KPGT, stara šećerana', 'Radovi na adaptaciji stare šećerane u pozorišni prostor.', 'ADAPTACIJA', 'KPGT Theatre, old sugar factory', 'Work on converting the old sugar factory into a theatre space.', 'CONVERSION', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 150, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 16, 'ref-lidl-objekti-u-srbiji', 'project', 'LIDL — objekti u Srbiji', 'TRICOM limarija i metalni elementi.', 'MALOPRODAJA', 'LIDL — stores in Serbia', 'TRICOM sheet-metal work and metal elements.', 'RETAIL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 160, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 17, 'ref-idea-maloprodajni-objekti', 'project', 'IDEA — maloprodajni objekti', 'TRICOM limarija i metalni elementi.', 'MALOPRODAJA', 'IDEA — retail stores', 'TRICOM sheet-metal work and metal elements.', 'RETAIL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 170, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 18, 'ref-continental-subotica', 'project', 'Continental, Subotica', 'Fabrika guma — isporuka elemenata konstrukcija, enterijera i oblaganja fasadnih i pokrivnih površina.', 'PROIZVODNA HALA', 'Continental, Subotica', 'Tyre factory — supply of elements for structures, interiors and façade and roof cladding.', 'PRODUCTION HALL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 180, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 19, 'ref-zf-pancevo', 'project', 'ZF, Pančevo', 'Fabrika autodelova — isporuka elemenata konstrukcija, enterijera i oblaganja fasadnih i pokrivnih površina.', 'PROIZVODNA HALA', 'ZF, Pančevo', 'Automotive parts factory — supply of elements for structures, interiors and façade and roof cladding.', 'PRODUCTION HALL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 190, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 20, 'ref-geze-zrenjanin', 'project', 'GEZE, Zrenjanin', 'Fabrika sistema za vrata i prozore — isporuka elemenata za fasadne i pokrivne površine.', 'PROIZVODNA HALA', 'GEZE, Zrenjanin', 'Door and window systems factory — supply of elements for façades and roofs.', 'PRODUCTION HALL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 200, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 21, 'ref-mitas-ruma', 'project', 'MITAS, Ruma', 'Proizvodnja pneumatika — isporuka limarskih i metalnih elemenata.', 'PROIZVODNA HALA', 'MITAS, Ruma', 'Tyre manufacturing — supply of sheet-metal and metal elements.', 'PRODUCTION HALL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 210, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 22, 'ref-mei-ta-obrenovac', 'project', 'MEI TA, Obrenovac', 'Proizvodnja automobilskih delova — isporuka limarskih i metalnih elemenata.', 'PROIZVODNA HALA', 'MEI TA, Obrenovac', 'Automotive parts manufacturing — supply of sheet-metal and metal elements.', 'PRODUCTION HALL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 220, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 23, 'ref-boysen-subotica', 'project', 'BOYSEN, Subotica', 'Proizvodnja izduvnih sistema za automobilsku industriju — isporuka limarskih i metalnih elemenata.', 'PROIZVODNA HALA', 'BOYSEN, Subotica', 'Exhaust systems for the automotive industry — supply of sheet-metal and metal elements.', 'PRODUCTION HALL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 230, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 24, 'ref-nelt-dobanovci', 'project', 'NELT, Dobanovci', 'Logističke usluge — isporuka limarskih i metalnih elemenata na logističkom kompleksu.', 'LOGISTIKA', 'NELT, Dobanovci', 'Logistics services — supply of sheet-metal and metal elements for the logistics complex.', 'LOGISTICS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 240, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 25, 'ref-kuehne-nagel-dobanovci', 'project', 'Kuehne + Nagel, Dobanovci', 'Međunarodni transport robe — isporuka limarskih i metalnih elemenata.', 'LOGISTIKA', 'Kuehne + Nagel, Dobanovci', 'International freight transport — supply of sheet-metal and metal elements.', 'LOGISTICS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 250, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 26, 'ref-ipb-simanovci', 'project', 'IPB, Šimanovci', 'Industrijski park — isporuka limarskih i metalnih elemenata.', 'LOGISTIKA', 'IPB, Šimanovci', 'Industrial park — supply of sheet-metal and metal elements.', 'LOGISTICS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 260, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 27, 'ref-sport-vision-simanovci', 'project', 'Sport Vision, Šimanovci', 'Isporuka limarskih i metalnih elemenata na logističko-poslovnom objektu.', 'LOGISTIKA', 'Sport Vision, Šimanovci', 'Supply of sheet-metal and metal elements for a logistics and office building.', 'LOGISTICS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 270, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 28, 'ref-terra-indjija', 'project', 'TERRA, Inđija', 'Uslužna punionica — limarski elementi na proizvodno-skladišnom objektu.', 'INDUSTRIJA', 'TERRA, Inđija', 'Contract filling plant — sheet-metal elements on a production and warehouse building.', 'INDUSTRY', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 280, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 29, 'ref-gomex-zrenjanin', 'project', 'Gomex, Zrenjanin', 'Gomex marketi — limarija na maloprodajnim i skladišnim objektima.', 'MALOPRODAJA', 'Gomex, Zrenjanin', 'Gomex supermarkets — sheet-metal work on retail and warehouse buildings.', 'RETAIL', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 290, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 30, 'ref-savacoop-novi-sad', 'project', 'SAVACOOP, Novi Sad', 'Uvoz i distribucija sredstava za zaštitu bilja — krovni i fasadni limarski program.', 'INDUSTRIJA', 'SAVACOOP, Novi Sad', 'Import and distribution of plant protection products — roof and façade sheet-metal range.', 'INDUSTRY', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 300, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 31, 'ref-brze-pruge-srbije', 'project', 'Brze pruge Srbije', 'Metalni i limarski elementi na infrastrukturnim objektima.', 'INFRASTRUKTURA', 'Brze pruge Srbije (Serbian high-speed rail)', 'Metal and sheet-metal elements on infrastructure facilities.', 'INFRASTRUCTURE', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 310, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 32, 'ref-knez-petrol', 'project', 'Knez Petrol', 'Limarija i metalni elementi na mreži objekata.', 'MREŽA OBJEKATA', 'Knez Petrol', 'Sheet-metal work and metal elements across its network of sites.', 'NETWORK OF SITES', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 320, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 33, 'ref-kuca-velikog-brata', 'project', '„Kuća Velikog brata“', 'Izrada i isporuka delova konstrukcije i delova enterijera objekta za montažu.', 'TV OBJEKAT', '“Big Brother House”', 'Fabrication and supply of structural and interior parts of the building for assembly.', 'TV BUILDING', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 330, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 34, 'ref-knez-agrar', 'project', 'Knez Agrar', 'Isporuka limarskih i metalnih elemenata, uz objekte Knez Petrola.', 'MREŽA OBJEKATA', 'Knez Agrar', 'Supply of sheet-metal and metal elements, alongside the Knez Petrol sites.', 'NETWORK OF SITES', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 340, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 35, 'ref-qvattro-company', 'project', 'Qvattro company', 'Trgovinsko preduzeće — isporuka limarskih i metalnih elemenata.', 'TRGOVINA', 'Qvattro company', 'Trading company — supply of sheet-metal and metal elements.', 'TRADE', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 350, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 36, 'ref-stambene-zgrade-gelenderi-i-ograde', 'project', 'Stambene zgrade, gelenderi i ograde', 'Zgrade za stanovanje, gelenderi i ograde za terase, proizvodni objekti i tržni centri — elementi za izvođače.', 'STAMBENI OBJEKTI', 'Residential buildings, railings and fences', 'Residential buildings, railings and fences for terraces, production buildings and shopping centres — elements for contractors.', 'RESIDENTIAL BUILDINGS', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 360, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 37, 'ref-silosi-i-secerane', 'project', 'Silosi i šećerane', 'Limarska galanterija i spusne vertikale, uz rad na visini preko 50 metara.', 'RAD NA VISINI +50 m', 'Silos and sugar factories', 'Sheet-metal roofing accessories and downpipes, with work at a height of over 50 metres.', 'WORK AT HEIGHT +50 m', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 370, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `client_references` (`id`, `slug`, `ref_type`, `title_sr`, `summary_sr`, `label_sr`, `title_en`, `summary_en`, `label_en`, `icon_key`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `image_alt_sr`, `image_alt_en`, `sort_order`, `is_active`)
  SELECT 38, 'ref-mlinovi-i-prehrambena-industrija', 'project', 'Mlinovi i prehrambena industrija', 'Komplikovani limarski radovi na proizvodnim objektima prehrambene industrije.', 'INDUSTRIJA', 'Mills and food industry', 'Intricate sheet-metal work on food-industry production buildings.', 'INDUSTRY', NULL, 'none', NULL, NULL, NULL, NULL, NULL, NULL, 380, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Galerije
-- --------------------------------------------------------------------------
INSERT INTO `gallery_categories` (`id`, `slug`, `name_sr`, `name_en`, `sort_order`, `is_active`)
  SELECT 1, 'plazma', 'Plazma', 'Plasma', 10, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_categories` (`id`, `slug`, `name_sr`, `name_en`, `sort_order`, `is_active`)
  SELECT 2, 'krov', 'Krov i fasada', 'Roof and façade', 20, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_categories` (`id`, `slug`, `name_sr`, `name_en`, `sort_order`, `is_active`)
  SELECT 3, 'oluci', 'Oluci i limarija', 'Gutters and flashings', 30, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_categories` (`id`, `slug`, `name_sr`, `name_en`, `sort_order`, `is_active`)
  SELECT 4, 'profili', 'Profili i cevi', 'Sections and tubes', 40, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_categories` (`id`, `slug`, `name_sr`, `name_en`, `sort_order`, `is_active`)
  SELECT 5, 'pogon', 'Pogon', 'Plant', 50, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 1, 'g-01', 5, '01', 'Proizvodna hala i centralni magacin u Ugrinovcima, 1600 m²', 'Proizvodna hala TRICOM-a u Ugrinovcima sa kapijom i dvorištem', 'Production hall and central warehouse in Ugrinovci, 1,600 m²', 'TRICOM’s production hall in Ugrinovci with gate and yard', 'photo', NULL, 'assets/old/foto/hala-ugrinovci.jpg', 1600, 375, 'tl', NULL, 10, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 2, 'g-02', 1, '02', 'CNC plazma u radu — rezanje po nacrtu', 'CNC plazma reže čelični lim na radnom stolu', 'CNC plasma at work — cutting to drawing', 'CNC plasma cutting steel sheet on the cutting table', 'photo', NULL, 'assets/old/foto/plazma-rez.jpg', 800, 600, 'tl', NULL, 20, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 1 AND `slug` = 'plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 3, 'g-03', 1, '03', 'Komadi isečeni na CNC plazmi', 'Delovi isečeni na plazmi složeni na paleti', 'Parts cut on the CNC plasma', 'Plasma-cut parts stacked on a pallet', 'photo', NULL, 'assets/old/foto/plazma-komadi.jpg', 800, 600, 'tl', NULL, 30, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 1 AND `slug` = 'plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 4, 'g-04', 5, '04', 'Hidraulične makaze MHS 3100/13 — lim do 13 mm, dužina reza 3100 mm', 'Hidraulične makaze za sečenje lima u pogonu', 'Hydraulic guillotine shear MHS 3100/13 — sheet up to 13 mm, cutting length 3,100 mm', 'Hydraulic guillotine shear for cutting sheet in the plant', 'photo', NULL, 'assets/old/foto/makaze.jpg', 800, 600, 'tl', NULL, 40, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 5, 'g-05', 5, '05', 'Sliter — podužno sečenje kotura do 1260 mm, najviše 7 traka', 'Linija za slitovanje lima iz kotura', 'Slitter — slitting coil up to 1,260 mm, maximum 7 strips', 'Line for slitting sheet from coil', 'photo', NULL, 'assets/old/foto/sliter.jpg', 800, 600, 'tl', NULL, 50, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 6, 'g-06', 5, '06', 'CNC apipong 8,2 m — opšivke i profili bez spoja', 'CNC apkant presa dužine 8,2 m', 'CNC folding machine 8.2 m — flashings and profiles without joints', 'CNC press brake, 8.2 m long', 'photo', NULL, 'assets/old/foto/apipong.jpg', 800, 600, 'tl', NULL, 60, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 7, 'g-07', 5, '07', 'Rund mašina — kružno savijanje do 4 mm na dužini 2 m', 'Mašina za rundovanje lima', 'Plate rolling machine — rolling up to 4 mm over a length of 2 m', 'Plate rolling machine for sheet', 'photo', NULL, 'assets/old/foto/rund.jpg', 800, 600, 'tl', NULL, 70, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 8, 'g-08', 5, '08', 'Iron Worker — probijanje, isecanje uglova, sečenje profila', 'Kombinovana mašina Iron Worker', 'Iron Worker — punching, corner notching, cutting sections', 'Iron Worker combination machine', 'photo', NULL, 'assets/old/foto/iron-worker.jpg', 800, 450, 'tl', NULL, 80, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 9, 'g-09', 5, '09', 'Profilirka za poluokrugli oluk — neograničena dužina', 'Profilirka za oluke u pogonu', 'Roll former for half-round gutters — unlimited length', 'Gutter roll former in the plant', 'photo', NULL, 'assets/old/foto/profilirka-oluk.jpg', 800, 600, 'tl', NULL, 90, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 10, 'g-10', 5, '10', 'Profilirka za okrugle vertikale Ø100', 'Profilirka za olučne vertikale', 'Roll former for round downpipes Ø100', 'Roll former for downpipes', 'photo', NULL, 'assets/old/foto/profilirka-vertikala.jpg', 800, 600, 'tl', NULL, 100, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 11, 'g-11', 5, '11', 'Mašina za grifovanje flahova, firkanta i kutijastih profila', 'Mašina za grifovanje šipkastih profila', 'Machine for embossing flat bars, square bars and box sections', 'Machine for embossing bar sections', 'photo', NULL, 'assets/old/foto/grifovanje.jpg', 716, 800, 'tl', NULL, 110, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 12, 'g-12', 5, '12', 'Trakasta testera — profili i puni preseci pod uglom do 60°', 'Trakasta testera za sečenje metalnih profila', 'Band saw — sections and solid bars at angles up to 60°', 'Band saw for cutting metal sections', 'photo', NULL, 'assets/old/foto/testera.jpg', 800, 600, 'tl', NULL, 120, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 13, 'g-13', 5, '13', 'Mašina za izradu lamperije', 'Profilirka za metalnu lamperiju', 'Machine for making metal cladding panels', 'Roll former for metal cladding panels', 'photo', NULL, 'assets/old/foto/masina-lamperija.jpg', 800, 600, 'tl', NULL, 130, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 14, 'g-14', 5, '14', 'Lager kotura pocinkovanog i bojenog lima', 'Police sa koturima lima u magacinu', 'Stock of galvanised and pre-painted sheet coils', 'Racks with sheet coils in the warehouse', 'photo', NULL, 'assets/old/foto/polica-koturi.jpg', 800, 600, 'tl', NULL, 140, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 15, 'g-15', 2, '15', 'Bojeni trapezni lim TR 20/185', 'Table bojenog trapeznog lima TR 20', 'Pre-painted trapezoidal profiled sheet TR 20/185', 'Pre-painted trapezoidal profiled sheets TR 20', 'photo', NULL, 'assets/old/foto/tr20-bojeni.jpg', 800, 600, 'tl', NULL, 150, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 16, 'g-16', 2, '16', 'Bojeni trapezni lim TR 10/162,5', 'Table bojenog trapeznog lima TR 10', 'Pre-painted trapezoidal profiled sheet TR 10/162.5', 'Pre-painted trapezoidal profiled sheets TR 10', 'photo', NULL, 'assets/old/foto/tr10-bojeni.jpg', 800, 600, 'tl', NULL, 160, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 17, 'g-17', 2, '17', 'Trapezni lim TR 35/270', 'Table trapeznog lima TR 35', 'Trapezoidal profiled sheet TR 35/270', 'Trapezoidal profiled sheets TR 35', 'photo', NULL, 'assets/old/foto/tr35.jpg', 800, 600, 'tl', NULL, 170, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 18, 'g-18', 2, '18', 'Trapezni lim TR 60/210', 'Tabla trapeznog lima TR 60 sa visokim rebrom', 'Trapezoidal profiled sheet TR 60/210', 'Trapezoidal profiled sheet TR 60 with a high rib', 'photo', NULL, 'assets/old/foto/tr60.jpg', 800, 600, 'tl', NULL, 180, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 19, 'g-19', 2, '19', 'Imitacija crepa — tabla novog modela', 'Tabla lima u obliku crepa', 'Tile-effect roofing sheet — new model', 'Sheet shaped like roof tiles', 'photo', NULL, 'assets/old/foto/crep-tabla.jpg', 1200, 1600, 'tl', NULL, 190, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 20, 'g-20', 2, '20', 'Imitacija crepa na krovu', 'Krov pokriven imitacijom crepa', 'Tile-effect roofing sheet on a roof', 'Roof covered with tile-effect roofing sheet', 'photo', NULL, 'assets/old/foto/crep-krov.jpg', 900, 675, 'tl', NULL, 200, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 21, 'g-21', 2, '21', 'Parapetni lim PR 83/34', 'Bojeni parapetni lim profil 83/34', 'Parapet lining sheet PR 83/34', 'Pre-painted parapet lining sheet, profile 83/34', 'photo', NULL, 'assets/old/foto/parapet-1.jpg', 800, 600, 'tl', NULL, 210, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 22, 'g-22', 2, '22', 'Parapetni lim PR 38/15', 'Parapetni lim profil 38/15', 'Parapet lining sheet PR 38/15', 'Parapet lining sheet, profile 38/15', 'photo', NULL, 'assets/old/foto/parapet-2.jpg', 800, 600, 'tl', NULL, 220, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 23, 'g-23', 2, '23', 'Metalna lamperija', 'Table metalne lamperije', 'Metal cladding panels', 'Lengths of metal cladding panels', 'photo', NULL, 'assets/old/foto/lamperija.jpg', 800, 600, 'tl', NULL, 230, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 24, 'g-24', 2, '24', 'Lamperija u enterijeru — skriveni spoj', 'Zid obložen metalnom lamperijom', 'Metal cladding panels indoors — concealed joint', 'Wall clad with metal cladding panels', 'photo', NULL, 'assets/old/foto/lamperija-enterijer.jpg', 1600, 2011, 'tl', NULL, 240, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 25, 'g-25', 2, '25', 'Maketa krova sa izolacijom od kamene vune (izložbeni prostor, Kneza Paskača 18)', 'Maketa slojeva krova sa kamenom vunom', 'Roof mock-up with stone wool insulation (showroom, Kneza Paskača 18)', 'Mock-up of roof layers with stone wool', 'photo', NULL, 'assets/old/foto/maketa-krova.jpg', 800, 600, 'tl', NULL, 250, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 26, 'g-26', 2, '26', 'Zidni sendvič panel', 'Zidni panel sa ispunom', 'Wall sandwich panel', 'Wall panel with insulation core', 'photo', NULL, 'assets/old/foto/panel-zidni.jpg', 714, 513, 'tl', NULL, 260, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 27, 'g-27', 2, '27', 'Krovni sendvič panel', 'Krovni panel sa ispunom', 'Roof sandwich panel', 'Roof panel with insulation core', 'photo', NULL, 'assets/old/foto/panel-krovni.jpg', 741, 533, 'tl', NULL, 270, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 28, 'g-28', 3, '28', 'Poluokrugli oluci', 'Poluokrugli oluci složeni u pogonu', 'Half-round gutters', 'Half-round gutters stacked in the plant', 'photo', NULL, 'assets/old/foto/oluk-poluokrugli.jpg', 848, 600, 'tl', NULL, 280, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 29, 'g-29', 3, '29', 'Četvrtasti oluk', 'Četvrtasti bojeni oluk', 'Box gutter', 'Pre-painted box gutter', 'photo', NULL, 'assets/old/foto/oluk-cetvrtasti.jpg', 800, 600, 'tl', NULL, 290, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 30, 'g-30', 3, '30', 'Okrugle vertikale', 'Okrugle olučne vertikale', 'Round downpipes', 'Round gutter downpipes', 'photo', NULL, 'assets/old/foto/vertikale-okrugle.jpg', 800, 663, 'tl', NULL, 300, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 31, 'g-31', 3, '31', 'Četvrtasta vertikala', 'Četvrtasta olučna vertikala', 'Square downpipe', 'Square gutter downpipe', 'photo', NULL, 'assets/old/foto/vertikala-cetvrtasta.jpg', 800, 599, 'tl', NULL, 310, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 32, 'g-32', 3, '32', 'Iksna', 'Limarska iksna', 'Penetration flashing', 'Sheet-metal penetration flashing', 'photo', NULL, 'assets/old/foto/iksna.jpg', 800, 600, 'tl', NULL, 320, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 33, 'g-33', 3, '33', 'Okapnica', 'Limarska okapnica', 'Eaves drip flashing', 'Sheet-metal eaves drip flashing', 'photo', NULL, 'assets/old/foto/okapnica.jpg', 800, 600, 'tl', NULL, 330, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 34, 'g-34', 3, '34', 'Uvala', 'Limarska uvala', 'Valley flashing', 'Sheet-metal valley flashing', 'photo', NULL, 'assets/old/foto/uvala.jpg', 800, 600, 'tl', NULL, 340, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 35, 'g-35', 3, '35', 'Veter lajsna', 'Limarska veter lajsna', 'Verge flashing', 'Sheet-metal verge flashing', 'photo', NULL, 'assets/old/foto/veter-lajsna.jpg', 800, 600, 'tl', NULL, 350, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 36, 'g-36', 3, '36', 'Opšivka dimnjaka 40×40 cm', 'Pocinkovana opšivka za dimnjak', 'Chimney flashing 40 × 40 cm', 'Galvanised chimney flashing', 'photo', NULL, 'assets/old/foto/opsivka-dimnjak.jpg', 800, 599, 'tl', NULL, 360, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 37, 'g-37', 3, '37', 'Držači oluka', 'Držači (kuke) za oluk', 'Gutter brackets', 'Gutter brackets (hooks)', 'photo', NULL, 'assets/old/foto/drzac.jpg', 800, 600, 'tl', NULL, 370, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 38, 'g-38', 3, '38', 'Danca (čela) oluka', 'Danca za oluk', 'Gutter end caps', 'Gutter end cap', 'photo', NULL, 'assets/old/foto/danca.jpg', 600, 800, 'tl', NULL, 380, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 39, 'g-39', 3, '39', 'Vodokotlić', 'Olučni vodokotlić', 'Hopper head', 'Gutter hopper head', 'photo', NULL, 'assets/old/foto/vodokotlic.jpg', 801, 600, 'tl', NULL, 390, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 40, 'g-40', 3, '40', 'Kolena za vertikale', 'Olučna kolena', 'Downpipe elbows', 'Gutter elbows', 'photo', NULL, 'assets/old/foto/kolena.jpg', 800, 600, 'tl', NULL, 400, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 41, 'g-41', 3, '41', 'Obujmice', 'Obujmice za vertikale', 'Downpipe clips', 'Clips for downpipes', 'photo', NULL, 'assets/old/foto/obujmice.jpg', 800, 600, 'tl', NULL, 410, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 42, 'g-42', 3, '42', 'Snegobrani za crep', 'Snegobrani', 'Snow guards for tiled roofs', 'Snow guards', 'photo', NULL, 'assets/old/foto/snegobrani.jpg', 800, 600, 'tl', NULL, 420, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 43, 'g-43', 3, '43', 'Afteri (zadržači vode)', 'Afteri za falcovani krov', 'Rainwater diverters (afteri)', 'Rainwater diverters (afteri) for a seamed roof', 'photo', NULL, 'assets/old/foto/afteri.jpg', 800, 600, 'tl', NULL, 430, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 44, 'g-44', 3, '44', 'Maskice za eksere', 'Maskice za glave eksera', 'Nail covers', 'Caps for nail heads', 'photo', NULL, 'assets/old/foto/maskice.jpg', 800, 745, 'tl', NULL, 440, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 45, 'g-45', 3, '45', 'Vinkl (ugao oluka)', 'Vinkl za oluk', 'Gutter corner', 'Gutter corner piece', 'photo', NULL, 'assets/old/foto/vinkl.jpg', 800, 600, 'tl', NULL, 450, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 46, 'g-46', 3, '46', 'Ventilacioni kanal i koleno', 'Pravougaoni ventilacioni kanal sa kolenom', 'Ventilation duct and elbow', 'Rectangular ventilation duct with elbow', 'photo', NULL, 'assets/old/foto/ventilacioni-kanal.jpg', 800, 600, 'tl', NULL, 460, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 47, 'g-47', 3, '47', 'T-račva za ventilaciju', 'Limena T-račva', 'Ventilation T-piece', 'Sheet-metal T-piece', 'photo', NULL, 'assets/old/foto/t-racva.jpg', 800, 600, 'tl', NULL, 470, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 48, 'g-48', 3, '48', 'Redukcija', 'Limena redukcija kanala', 'Reducer', 'Sheet-metal duct reducer', 'photo', NULL, 'assets/old/foto/redukcija.jpg', 800, 600, 'tl', NULL, 480, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 49, 'g-49', 4, '49', 'Pano kovanih elemenata', 'Izložbeni pano kovanih i grifovanih elemenata', 'Display board of wrought-iron elements', 'Display board of wrought-iron and embossed elements', 'photo', NULL, 'assets/old/foto/pano-elemenata.jpg', 800, 600, 'tl', NULL, 490, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 50, 'g-50', 4, '50', 'Grifovani krug i bubreg', 'Grifovani dekorativni elementi', 'Embossed circle and kidney shape', 'Embossed decorative elements', 'photo', NULL, 'assets/old/foto/grifovani-krug.jpg', 800, 600, 'tl', NULL, 500, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 51, 'g-51', 4, '51', 'Grifovani firkant', 'Grifovani kvadratni pun profil', 'Embossed square bar', 'Embossed solid square bar', 'photo', NULL, 'assets/old/foto/grifovani-firkant.jpg', 800, 600, 'tl', NULL, 510, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 52, 'g-52', 4, '52', 'Grifovana cev', 'Grifovana kvadratna cev', 'Embossed tube', 'Embossed square tube', 'photo', NULL, 'assets/old/foto/grifovana-cev.jpg', 800, 600, 'tl', NULL, 520, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 53, 'g-53', 4, '53', 'Grifovani flah sa šarom', 'Grifovani flah sa dezenom', 'Embossed flat bar with pattern', 'Embossed patterned flat bar', 'photo', NULL, 'assets/old/foto/grifovani-flah.jpg', 800, 600, 'tl', NULL, 530, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 54, 'g-54', 4, '54', 'Pocinkovano gazište', 'Pocinkovana rešetka gazišta', 'Galvanised stair tread', 'Galvanised stair tread grating', 'photo', NULL, 'assets/old/foto/gaziste.jpg', 800, 600, 'tl', NULL, 540, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 55, 'g-55', 4, '55', 'Pocinkovana kanalska rešetka', 'Kanalska rešetka', 'Galvanised drainage grating', 'Drainage grating', 'photo', NULL, 'assets/old/foto/kanalska-resetka.jpg', 800, 600, 'tl', NULL, 550, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 56, 'g-56', 4, '56', 'Grifovano pletivo', 'Grifovano pletivo za ograde', 'Crimped wire mesh', 'Crimped wire mesh for fences', 'photo', NULL, 'assets/old/foto/grifovano-pletivo.jpg', 797, 600, 'tl', NULL, 560, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 57, 'g-57', 4, '57', 'Rukohvat od cevi', 'Rukohvat', 'Tube handrail', 'Handrail', 'photo', NULL, 'assets/old/foto/rukohvat.jpg', 800, 600, 'tl', NULL, 570, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 4 AND `slug` = 'profili')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 58, 'g-58', 2, '58', 'Stambena zgrada sa limarijom i ogradama terasa', 'Stambena zgrada sa limenim opšivkama i gelenderima', 'Residential building with sheet-metal work and terrace railings', 'Residential building with sheet-metal flashings and railings', 'photo', NULL, 'assets/old/foto/objekat-1.jpg', 1280, 960, 'tl', NULL, 580, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 59, 'g-59', 2, '59', 'Objekat sa TRICOM limarijom', 'Fasada objekta sa limarskim elementima', 'Building with TRICOM sheet-metal work', 'Building façade with sheet-metal elements', 'photo', NULL, 'assets/old/foto/objekat-3.jpg', 960, 1280, 'tl', NULL, 590, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 60, 'g-61', 2, '61', 'TR 35/270 — render', 'TR 35/270 — render', 'TR 35/270 — render', 'TR 35/270 — render', 'render', 'tr35', NULL, NULL, NULL, NULL, NULL, 600, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 61, 'g-62', 3, '62', 'Poluokrugli oluk — render', 'Poluokrugli oluk — render', 'Half-round gutter — render', 'Half-round gutter — render', 'render', 'gutter-halfround', NULL, NULL, NULL, NULL, NULL, 610, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 62, 'g-64', 1, '64', 'Ploča isečena na CNC plazmi — render', 'Ploča isečena na CNC plazmi — render', 'Plate cut on the CNC plasma — render', 'Plate cut on the CNC plasma — render', 'render', 'plasma-plate', NULL, NULL, NULL, NULL, NULL, 620, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 1 AND `slug` = 'plazma')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 63, 'g-66', 2, '66', 'TR 10/162,5 — render', 'TR 10/162,5 — render', 'TR 10/162.5 — render', 'TR 10/162.5 — render', 'render', 'tr10', NULL, NULL, NULL, NULL, NULL, 630, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 64, 'g-67', 2, '67', 'TR 20/185 — render', 'TR 20/185 — render', 'TR 20/185 — render', 'TR 20/185 — render', 'render', 'tr20', NULL, NULL, NULL, NULL, NULL, 640, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 65, 'g-68', 2, '68', 'TR 40/230 — render', 'TR 40/230 — render', 'TR 40/230 — render', 'TR 40/230 — render', 'render', 'tr40', NULL, NULL, NULL, NULL, NULL, 650, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 66, 'g-69', 2, '69', 'Imitacija crepa — render', 'Imitacija crepa — render', 'Tile-effect roofing sheet — render', 'Tile-effect roofing sheet — render', 'render', 'crep', NULL, NULL, NULL, NULL, NULL, 660, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 67, 'g-71', 3, '71', 'Četvrtasti oluk — render', 'Četvrtasti oluk — render', 'Box gutter — render', 'Box gutter — render', 'render', 'gutter-box', NULL, NULL, NULL, NULL, NULL, 670, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 68, 'g-72', 3, '72', 'Oluk, rendgenski prikaz — render', 'Oluk, rendgenski prikaz — render', 'Gutter, X-ray view — render', 'Gutter, X-ray view — render', 'render', 'xray-gutter', NULL, NULL, NULL, NULL, NULL, 680, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 69, 'g-73', 3, '73', 'Opšivke — render', 'Opšivke — render', 'Flashings — render', 'Flashings — render', 'render', 'flashing-set', NULL, NULL, NULL, NULL, NULL, 690, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 3 AND `slug` = 'oluci')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 70, 'g-76', 2, '76', 'Snegobrani — render', 'Snegobrani — render', 'Snow guards — render', 'Snow guards — render', 'render', 'snowguard-row', NULL, NULL, NULL, NULL, NULL, 700, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 71, 'g-78', 2, '78', 'Slojevi lima, rendgenski prikaz — render', 'Slojevi lima, rendgenski prikaz — render', 'Sheet layers, X-ray view — render', 'Sheet layers, X-ray view — render', 'render', 'xray-sheet-layers', NULL, NULL, NULL, NULL, NULL, 710, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 2 AND `slug` = 'krov')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 72, 'g-79', 5, '79', 'Limovi u tablama — render', 'Limovi u tablama — render', 'Sheet metal in sheets — render', 'Sheet metal in sheets — render', 'render', 'sheet-stack', NULL, NULL, NULL, NULL, NULL, 720, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `gallery_images` (`id`, `slug`, `category_id`, `fig_no`, `caption_sr`, `alt_sr`, `caption_en`, `alt_en`, `image_type`, `render_key`, `photo_path`, `photo_width`, `photo_height`, `crop_pos`, `zoom`, `sort_order`, `is_active`)
  SELECT 73, 'g-80', 5, '80', 'Lim u koturu — render', 'Lim u koturu — render', 'Sheet metal in coil — render', 'Sheet metal in coil — render', 'render', 'coil', NULL, NULL, NULL, NULL, NULL, 730, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `gallery_categories` WHERE `id` = 5 AND `slug` = 'pogon')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Česta pitanja
-- --------------------------------------------------------------------------
INSERT INTO `faq_items` (`id`, `question_sr`, `question_en`, `answer_sr`, `answer_en`, `sort_order`, `is_active`)
  SELECT 1, 'Do koje debljine sečete lim?', 'What sheet thickness can you cut?', 'Makazama sečemo lim do 13 mm, a prohromski (inox) lim do 9 mm. Na CNC plazmi sečemo do 30 mm, a gasnim rezanjem do 150 mm. Radni sto plazme je 2,5 x 8 m.', 'On the guillotine shear we cut sheet up to 13 mm, and stainless steel sheet up to 9 mm. On the CNC plasma we cut up to 30 mm, and with oxy-fuel cutting up to 150 mm. The plasma cutting table is 2.5 × 8 m.', 10, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `faq_items` (`id`, `question_sr`, `question_en`, `answer_sr`, `answer_en`, `sort_order`, `is_active`)
  SELECT 2, 'Da li TRICOM radi montažu na objektu?', 'Does TRICOM do on-site installation?', 'Ne. Od 2006. godine primarna delatnost su proizvodnja i prodaja metalnih proizvoda. Montažu ne radimo kako ne bismo bili konkurencija zanatskim radionicama i preduzećima koja kod nas kupuju materijal. Umesto toga nudimo kompletnu pripremu elemenata za ugradnju i savetodavnu podršku.', 'No. Since 2006 our core business has been the manufacture and sale of metal products. We do not do installation, so that we do not compete with the trade workshops and companies that buy material from us. Instead, we offer complete preparation of elements for installation and advisory support.', 20, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `faq_items` (`id`, `question_sr`, `question_en`, `answer_sr`, `answer_en`, `sort_order`, `is_active`)
  SELECT 3, 'Kako se naručuje i šta je radni nalog?', 'How do I order, and what is a work order?', 'Svaki proizvod koji se naruči definiše se radnim nalogom koji naručilac potpisuje, pa se pri preuzimanju jasno vidi gde je eventualna greška nastala. Za svaku narudžbinu ostavlja se akontacija. Za bezgotovinsko plaćanje narudžbine primamo telefonom, faksom i e-poštom.', 'Every product ordered is defined by a work order that the customer signs, so on collection it is clear where any error occurred. An advance payment is made for every order. For non-cash payment, we accept orders by phone, fax and email.', 30, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `faq_items` (`id`, `question_sr`, `question_en`, `answer_sr`, `answer_en`, `sort_order`, `is_active`)
  SELECT 4, 'Koji su načini plaćanja?', 'What are the payment methods?', 'Gotovinski preko fiskalne kase, bezgotovinski virmanom, čekovima građana, platnim karticama Dina, Visa i MasterCard, kao i putem bankarskog kredita uz predračun na ime banke. Prodaju na rate ne vršimo jer su po propisima samo banke ovlašćene za davanje kredita.', 'Cash through the fiscal cash register, non-cash by bank transfer, personal cheques, Dina, Visa and MasterCard payment cards, and bank loans against a pro forma invoice made out to the bank. We do not sell on instalments, because by law only banks are authorised to grant credit.', 40, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `faq_items` (`id`, `question_sr`, `question_en`, `answer_sr`, `answer_en`, `sort_order`, `is_active`)
  SELECT 5, 'Kako dobijam cenu i da li ima popusta?', 'How do I get a price, and are there discounts?', 'Da bismo dali ponudu, potrebno je da definišete debljinu, dimenziju i količinu. Količina određuje cenu: od jedne tone naviše moguć je popust, a za veće količine popust je veći.', 'To give you a quote, we need you to specify the thickness, dimensions and quantity. Quantity determines the price: a discount is possible from one tonne upwards, and the larger the quantity, the larger the discount.', 50, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `faq_items` (`id`, `question_sr`, `question_en`, `answer_sr`, `answer_en`, `sort_order`, `is_active`)
  SELECT 6, 'Kakva su pravila za reklamaciju i povraćaj robe?', 'What are the rules for complaints and returns?', 'Za bilo kakav povraćaj robe obavezan je račun, a za vrednost preko 500 dinara i lična karta. Reklamacija kvaliteta kupljene robe vrši se najkasnije 3 dana od prodaje, zamenom ili povraćajem novca.', 'Any return of goods requires the invoice, and for amounts over RSD 500 also an identity card. Complaints about the quality of purchased goods must be made within 3 days of sale at the latest, and are settled by replacement or refund.', 60, 1
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;

-- --------------------------------------------------------------------------
-- Kontakt
-- --------------------------------------------------------------------------
INSERT INTO `contact_settings` (`id`, `hours_sr`, `hours_en`, `open_hour`, `close_hour`, `footer_email`, `company_name`, `company_legal_name`, `pib`, `registration_no`, `activity_code`, `vat_sr`, `vat_en`, `vat_certificate_path`, `vat_record_path`, `bank_name`, `bank_account`, `activity_sr`, `activity_en`, `founded_sr`, `founded_en`, `director`, `facebook_url`, `facebook_label`, `locations_heading_sr`, `locations_heading_en`, `locations_intro_sr`, `locations_intro_en`)
  SELECT 1, 'Radnim danima 09:00–17:00', 'Weekdays 09:00–17:00', 9, 17, 'office@tricom.rs', 'TRICOM d.o.o. Beograd — Batajnica', '„TRICOM“ preduzeće za proizvodnju i promet roba i usluga, export-import d.o.o.', '100093247', '06660231', '2599', 'u sistemu PDV od 01.01.2005.', 'VAT-registered since 1 January 2005', 'assets/old/docs/pdv-potvrda.jpg', 'assets/old/docs/pdv-evidencija.pdf', 'Banca Intesa', '160-216272-93', 'Proizvodnja i prodaja metalnih proizvoda', 'Manufacture and sale of metal products', '1966. (radionica), 1992. (preduzeće)', '1966 (workshop), 1992 (company)', 'Dragan Trivanović', 'https://www.facebook.com/Tricom-doo-Metalni-proizvodi-108948334180239', 'Tricom doo — Metalni proizvodi', 'Dve adrese u Batajnici, hala u Ugrinovcima.', 'Two addresses in Batajnica, a production hall in Ugrinovci.', 'Roba se preuzima na adresi prodaje u Kneza Paskača; tu je i izložbeni prostor (Kneza Paskača 18) sa maketom krova sa izolacijom od kamene vune. Centralni magacin i proizvodna hala od 1600 m² su u Ugrinovcima, Zemun.', 'Goods are collected at the sales address in Kneza Paskača; the showroom (Kneza Paskača 18) is there too, with a roof mock-up with stone wool insulation. The central warehouse and the 1,600 m² production hall are in Ugrinovci, Zemun.'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_locations` (`id`, `slug`, `title_sr`, `title_en`, `short_name_sr`, `short_name_en`, `street`, `postal_code`, `place`, `city_sr`, `city_en`, `purpose_sr`, `purpose_en`, `emails`, `map_query`, `map_title_sr`, `map_title_en`, `sort_order`)
  SELECT 1, 'prodaja', 'Prodaja — Batajnica', 'Sales — Batajnica', 'Prodaja', 'Sales', 'Kneza Paskača 16–18', '11273', 'Batajnica', 'Beograd', 'Belgrade', 'Preuzimanje robe, narudžbine, upiti', 'Collection of goods, orders, inquiries', 'office@tricom.rs
veleprodaja@tricom.rs
maloprodaja@tricom.rs', '44.89779,20.27798', 'Mapa — TRICOM prodaja, Kneza Paskača 16–18, Batajnica', 'Map — TRICOM sales, Kneza Paskača 16–18, Batajnica', 10
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_locations` (`id`, `slug`, `title_sr`, `title_en`, `short_name_sr`, `short_name_en`, `street`, `postal_code`, `place`, `city_sr`, `city_en`, `purpose_sr`, `purpose_en`, `emails`, `map_query`, `map_title_sr`, `map_title_en`, `sort_order`)
  SELECT 2, 'direkcija', 'Direkcija', 'Head office', 'Direkcija', 'Head office', 'Kralja Vladislava 82', '11273', 'Batajnica', 'Beograd', 'Belgrade', 'Komercijalni i administrativni poslovi', 'Commercial and administrative matters', NULL, 'Kralja Vladislava 82, Batajnica, Beograd', 'Mapa — TRICOM direkcija, Kralja Vladislava 82, Batajnica', 'Map — TRICOM head office, Kralja Vladislava 82, Batajnica', 20
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_phones` (`id`, `location_id`, `tel`, `display_sr`, `display_en`, `in_footer`, `sort_order`)
  SELECT 1, 1, '+381638503000', '063 850 30 00', '+381 63 850 30 00', 1, 10
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `contact_locations` WHERE `id` = 1 AND `slug` = 'prodaja')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_phones` (`id`, `location_id`, `tel`, `display_sr`, `display_en`, `in_footer`, `sort_order`)
  SELECT 2, 1, '+381603801668', '060 380 16 68', '+381 60 380 16 68', 1, 20
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `contact_locations` WHERE `id` = 1 AND `slug` = 'prodaja')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_phones` (`id`, `location_id`, `tel`, `display_sr`, `display_en`, `in_footer`, `sort_order`)
  SELECT 3, 1, '+381117870348', '011 787 03 48', '+381 11 787 03 48', 0, 30
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `contact_locations` WHERE `id` = 1 AND `slug` = 'prodaja')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_phones` (`id`, `location_id`, `tel`, `display_sr`, `display_en`, `in_footer`, `sort_order`)
  SELECT 4, 2, '+381117870024', '011 787 00 24', '+381 11 787 00 24', 1, 10
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `contact_locations` WHERE `id` = 2 AND `slug` = 'direkcija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_phones` (`id`, `location_id`, `tel`, `display_sr`, `display_en`, `in_footer`, `sort_order`)
  SELECT 5, 2, '+381117870348', '011 787 03 48', '+381 11 787 03 48', 0, 20
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `contact_locations` WHERE `id` = 2 AND `slug` = 'direkcija')
  ON DUPLICATE KEY UPDATE `id` = `id`;
INSERT INTO `contact_phones` (`id`, `location_id`, `tel`, `display_sr`, `display_en`, `in_footer`, `sort_order`)
  SELECT 6, 2, '+381117870349', '011 787 03 49', '+381 11 787 03 49', 0, 30
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `schema_imports` WHERE `import_key` = '002-existing-content') AND EXISTS (SELECT 1 FROM `contact_locations` WHERE `id` = 2 AND `slug` = 'direkcija')
  ON DUPLICATE KEY UPDATE `id` = `id`;

INSERT INTO `schema_imports` (`import_key`, `imported_at`, `note`)
VALUES ('002-existing-content', NOW(), 'Postojeći sadržaj frontenda')
ON DUPLICATE KEY UPDATE `import_key` = `import_key`;

COMMIT;
