/* ==========================================================================
   TRICOM — items.js
   Jedini izvor podataka za kartice koje se otvaraju u modalu (js/modal.js) i
   za strane detalja (detalji/<slug>.html, en/details/<slug>.html — generiše
   ih _tools/items/gen-details.js iz ovog fajla, pa se tekst menja OVDE).

   Polja jedne stavke:
     slug   ime fajla strane detalja i heš #item=<slug> (isti na oba jezika)
     kind   product | service | capability → ima stranu detalja
            group (kategorija; „Detaljnije“ vodi na postojeću stranu: page)
            info | reference | gallery → samo modal, bez strane
     cat    grupa za srodne stavke
     img    osnova rendera u assets/render (<img>-light|dark.webp/jpg) ili
            { src, w, h } za fotografiju; svg = ključ ilustracije (ILLU, dole)
     calc   id kalkulatora (tr10 | tr20 | tr35 | tr40 | crep) — „Izračunaj“
            vodi na kalkulatori.html#<calc>; calcTabs 'trapez' = sva četiri
            trapezna profila na strani detalja
     konf   heš 3D konfiguratora (konfigurator.html#…), ako se proizvod vidi na objektu
     page   postojeća strana umesto generisane (za group)
     drawing  fabrički crtež sa dosadašnjeg sajta (assets/old/tr/…)
     rel    srodne stavke (slug)
     sr/en  t naslov · sum sažetak · desc pasusi · specs [[naziv, vrednost]]
            · tags · apps primene
   Tekst je preuzet sa postojećih strana (proizvodi, usluge, plazma, početna)
   i iz _content/old/facts.md — bez novih podataka.
   Stavke referenci i galerije (kind reference | gallery) generiše
   _tools/items/extract-media.py iz reference.html / galerija.html (blok MEDIA).
   ========================================================================== */
(function (w) {
  'use strict';

  var ITEMS = [

  /* ---------------------------------------------------------------- KROVNI PROGRAM */
  { slug: 'trapezni-lim', kind: 'product', cat: 'krov', img: 'tr35', calc: 'tr20', calcTabs: 'trapez',
    konf: 'o=dvovodni&p=tr35', rel: ['tr-10-162', 'tr-20-185', 'tr-35-270', 'tr-40-230', 'tr-60-210', 'imitacija-crepa', 'antikondenz-filc'],
    sr: { t: 'Trapezni pokrivni lim', sum: 'Pet profila za krov i fasadu, u pocinkovanoj i plastificiranoj izvedbi po RAL karti. Dužina se reže po meri objekta.',
      desc: ['Trapezne limove proizvodimo na sopstvenim profilirkama iz kotura, pa dužina ide po meri objekta — krov ili fasada bez poprečnih preklopa.',
        'U programu su TR 10/162,5, TR 20/185, TR 35/270, TR 40/230 i TR 60/210, od pocinkovanog, pocinkovano plastificiranog i aluminijumskog lima; boje iz RAL karte, ostale boje i materijali po dogovoru. Na naličje se pri izradi profila može zalepiti antikondenz filc.',
        'Trapezni lim do 2,5 m (rebro 15/10/15) radimo i na hidrauličnoj presi. Debljine i raspoložive boje proverite sa prodajom — zavise od trenutnog lagera kotura.'],
      specs: [['Profili', 'TR 10, TR 20, TR 35, TR 40, TR 60'], ['Visina rebra', '10–60 mm'], ['Pokrivna širina', '840–1110 mm'], ['Dužina', 'po meri objekta'], ['Materijal', 'pocinkovani, plastificirani (RAL), aluminijum'], ['Antikondenz filc', 'po izboru']],
      tags: ['TR 10/162,5', 'TR 20/185', 'TR 35/270', 'TR 40/230'], apps: ['krovovi kuća i pomoćnih objekata', 'hale, magacini i poljoprivredni objekti', 'fasade i parapeti', 'nadstrešnice i garaže'] },
    en: { t: 'Trapezoidal profiled sheet', sum: 'Five profiles for roof and façade, galvanised or pre-painted to the RAL chart. The length is cut to suit the building.',
      desc: ['We roll-form trapezoidal sheet from coil on our own machines, so the length is made to suit the building — a roof or façade with no transverse laps.',
        'The range covers TR 10/162.5, TR 20/185, TR 35/270, TR 40/230 and TR 60/210 in galvanised, pre-painted galvanised and aluminium sheet; colours from the RAL chart, other colours and materials by arrangement. Anti-condensation felt can be bonded to the underside during roll forming.',
        'Trapezoidal sheet up to 2.5 m (rib 15/10/15) is also made on a hydraulic press. Check thicknesses and available colours with sales — they depend on current coil stock.'],
      specs: [['Profiles', 'TR 10, TR 20, TR 35, TR 40, TR 60'], ['Rib height', '10–60 mm'], ['Cover width', '840–1,110 mm'], ['Length', 'to suit the building'], ['Material', 'galvanised, pre-painted (RAL), aluminium'], ['Anti-condensation felt', 'optional']],
      tags: ['TR 10/162.5', 'TR 20/185', 'TR 35/270', 'TR 40/230'], apps: ['roofs of houses and outbuildings', 'production halls, warehouses and agricultural buildings', 'façades and parapets', 'canopies and garages'] } },

  { slug: 'tr-10-162', kind: 'product', cat: 'krov', img: 'tr10', calc: 'tr10', calcTabs: 'trapez', konf: 'o=dvovodni&p=tr10',
    drawing: 'assets/old/tr/tr10-dimenzije.jpg', rel: ['trapezni-lim', 'tr-20-185', 'parapetni-lim', 'lamperija'],
    sr: { t: 'Trapezni lim TR 10/162,5', sum: 'Niski profil za fasade, parapete i krovove manjeg raspona; postavlja se na punu podlogu.',
      desc: ['TR 10/162,5 je najniži profil u programu: rebro od 10 mm na koraku 162,5 mm i pokrivna širina 975 mm. Koristi se za fasade i parapete i za krovove manjeg raspona, uvek na punoj podlozi.',
        'Dužina table se reže po meri objekta. Može od pocinkovanog ili pocinkovano plastificiranog lima u boji iz RAL karte.'],
      specs: [['Visina rebra', '10 mm'], ['Korak rebra', '162,5 mm'], ['Pokrivna širina', '975 mm'], ['Gornji pojas rebra', '20 mm'], ['Dužina table', 'po meri, 500–13 500 mm'], ['Materijal', 'pocinkovani, plastificirani (RAL)']],
      tags: ['fasada', 'parapet', 'puna podloga'], apps: ['fasade', 'parapeti', 'krovovi manjeg raspona na punoj podlozi'] },
    en: { t: 'Trapezoidal sheet TR 10/162.5', sum: 'Low profile for façades, parapets and short-span roofs; laid on a continuous deck.',
      desc: ['TR 10/162.5 is the lowest profile in the range: a 10 mm rib at 162.5 mm pitch and a cover width of 975 mm. It is used for façades and parapets and for short-span roofs, always on a continuous deck.',
        'Sheets are cut to the length the building needs. Available in galvanised or pre-painted galvanised sheet in a RAL colour.'],
      specs: [['Rib height', '10 mm'], ['Rib pitch', '162.5 mm'], ['Cover width', '975 mm'], ['Rib top', '20 mm'], ['Sheet length', 'to order, 500–13,500 mm'], ['Material', 'galvanised, pre-painted (RAL)']],
      tags: ['façade', 'parapet', 'solid substrate'], apps: ['façades', 'parapets', 'short-span roofs on a continuous deck'] } },

  { slug: 'tr-20-185', kind: 'product', cat: 'krov', img: 'tr20', calc: 'tr20', calcTabs: 'trapez', konf: 'o=dvovodni&p=tr20',
    drawing: 'assets/old/tr/tr20-dimenzije.jpg', rel: ['trapezni-lim', 'tr-10-162', 'tr-35-270', 'antikondenz-filc'],
    sr: { t: 'Trapezni lim TR 20/185', sum: 'Univerzalni krovni i fasadni pokrivač — rebro 20 mm, pokrivna širina 1110 mm.',
      desc: ['TR 20/185 je univerzalni profil za krov i fasadu: rebro 20 mm na koraku 185 mm, pokrivna širina 1110 mm iz razvijene širine 1250 mm.',
        'Profilišemo ga iz kotura na dužinu koju traži objekat, od pocinkovanog ili plastificiranog lima u boji iz RAL karte, po želji sa antikondenz filcom na naličju.'],
      specs: [['Visina rebra', '20 mm'], ['Korak rebra', '185 mm'], ['Pokrivna širina', '1110 mm'], ['Razvijena širina', '1250 mm'], ['Dužina table', 'po meri, 500–13 500 mm'], ['Antikondenz filc', 'po izboru']],
      tags: ['krov', 'fasada', 'univerzalni'], apps: ['krovovi stambenih i pomoćnih objekata', 'fasade', 'nadstrešnice'] },
    en: { t: 'Trapezoidal sheet TR 20/185', sum: 'All-purpose roof and façade covering — 20 mm rib, 1,110 mm cover width.',
      desc: ['TR 20/185 is the all-purpose profile for roofs and façades: a 20 mm rib at 185 mm pitch and a cover width of 1,110 mm from a 1,250 mm developed width.',
        'We roll-form it from coil to the length the building needs, in galvanised or pre-painted sheet in a RAL colour, with anti-condensation felt on the underside if required.'],
      specs: [['Rib height', '20 mm'], ['Rib pitch', '185 mm'], ['Cover width', '1,110 mm'], ['Developed width', '1,250 mm'], ['Sheet length', 'to order, 500–13,500 mm'], ['Anti-condensation felt', 'optional']],
      tags: ['roof', 'façade', 'all-purpose'], apps: ['roofs of residential and ancillary buildings', 'façades', 'canopies'] } },

  { slug: 'tr-35-270', kind: 'product', cat: 'krov', img: 'tr35', calc: 'tr35', calcTabs: 'trapez', konf: 'o=dvovodni&p=tr35',
    drawing: 'assets/old/tr/tr-35.jpg', rel: ['trapezni-lim', 'tr-20-185', 'tr-40-230', 'antikondenz-filc'],
    sr: { t: 'Trapezni lim TR 35/270', sum: 'Industrijski krovovi i veći raspon rožnjača; može da se savija u luk.',
      desc: ['TR 35/270 ima rebro od 35 mm na koraku 270 mm i pokrivnu širinu 1080 mm (sa antikondenz filcom od 0,9 mm 1090–1095 mm). Namenjen je industrijskim krovovima i većem rasponu rožnjača, a može da se savija i u luk.',
        'Preporučeni razmak rožnjača je 60 cm do najviše 1 m; način šrafljenja i razmak rožnjača uvek određuje tehničko lice prema nagibu i površini krova. U drvenu konstrukciju lim se pričvršćuje samobušećim vijcima 6,3×70 – 6×90 mm, u metalnu samourezujućim 6,3×50 – 6,3×70 mm, uz neoprensku i metalnu podlošku.'],
      specs: [['Visina rebra', '35 mm'], ['Korak rebra', '270 mm'], ['Pokrivna širina', '1080 mm'], ['Ulazna traka', '1250 mm'], ['Razmak rožnjača', '0,6–1 m'], ['Savijanje u luk', 'moguće']],
      tags: ['industrijski krov', 'veći raspon', 'luk'], apps: ['industrijski i poslovni krovovi', 'hale i magacini', 'lučni krovovi i nadstrešnice'] },
    en: { t: 'Trapezoidal sheet TR 35/270', sum: 'Industrial roofs and longer purlin spans; can be arc-bent.',
      desc: ['TR 35/270 has a 35 mm rib at 270 mm pitch and a cover width of 1,080 mm (1,090–1,095 mm with 0.9 mm anti-condensation felt). It is intended for industrial roofs and longer purlin spans, and it can also be arc-bent.',
        'The recommended purlin spacing is 60 cm to a maximum of 1 m; the screw pattern and purlin spacing are always set by the responsible engineer according to the roof pitch and area. On timber it is fixed with self-drilling screws 6.3×70 – 6×90 mm, on steel with self-tapping screws 6.3×50 – 6.3×70 mm, with a neoprene and metal washer.'],
      specs: [['Rib height', '35 mm'], ['Rib pitch', '270 mm'], ['Cover width', '1,080 mm'], ['Input strip', '1,250 mm'], ['Purlin spacing', '0.6–1 m'], ['Arc bending', 'possible']],
      tags: ['industrial roof', 'longer span', 'arc'], apps: ['industrial and commercial roofs', 'production halls and warehouses', 'arched roofs and canopies'] } },

  { slug: 'tr-40-230', kind: 'product', cat: 'krov', img: 'tr40', calc: 'tr40', calcTabs: 'trapez', konf: 'o=dvovodni&p=tr40',
    drawing: 'assets/old/tr/tr40-dimenzije.jpg', rel: ['trapezni-lim', 'tr-35-270', 'tr-60-210', 'antikondenz-filc'],
    sr: { t: 'Trapezni lim TR 40/230', sum: 'Hale i veliki rasponi — dobra statička nosivost za krovove nagiba većeg od 4 %.',
      desc: ['TR 40/230 ima rebro od 40 mm na koraku 230 mm i pokrivnu širinu 920 mm iz trake 1250 mm. Zbog dobre statičke nosivosti koristi se na krovovima nagiba većeg od 4 % — kuće, pomoćni objekti i garaže, ali i hale, magacini i poljoprivredni objekti.',
        'Izrađuje se ojačan u gornjoj zoni (dodatni žlebovi u pojasu). Debljine po uputstvu za izbor (ojačan): 0,6–1,0 mm.'],
      specs: [['Visina rebra', '40 mm'], ['Korak rebra', '230 mm'], ['Pokrivna širina', '920 mm'], ['Ulazna traka', '1250 mm'], ['Izvedba', 'ojačan u gornjoj zoni'], ['Nagib krova', 'veći od 4 %']],
      tags: ['hale', 'veliki rasponi', 'ojačan'], apps: ['hale i magacini', 'poljoprivredni objekti', 'kuće, pomoćni objekti i garaže'] },
    en: { t: 'Trapezoidal sheet TR 40/230', sum: 'Production halls and long spans — good load capacity for roofs with a pitch above 4 %.',
      desc: ['TR 40/230 has a 40 mm rib at 230 mm pitch and a cover width of 920 mm from 1,250 mm strip. Thanks to its good load capacity it is used on roofs with a pitch above 4 % — houses, outbuildings and garages, but also production halls, warehouses and agricultural buildings.',
        'It is made reinforced in the upper zone (additional stiffening grooves in the flange). Thicknesses per the selection guide (reinforced): 0.6–1.0 mm.'],
      specs: [['Rib height', '40 mm'], ['Rib pitch', '230 mm'], ['Cover width', '920 mm'], ['Input strip', '1,250 mm'], ['Version', 'reinforced in the upper zone'], ['Roof pitch', 'above 4 %']],
      tags: ['production halls', 'long spans', 'reinforced'], apps: ['production halls and warehouses', 'agricultural buildings', 'houses, outbuildings and garages'] } },

  { slug: 'tr-60-210', kind: 'product', cat: 'krov', img: 'tr60', drawing: 'assets/old/tr/TR-60-210.jpg', rel: ['trapezni-lim', 'tr-40-230', 'antikondenz-filc'],
    sr: { t: 'Trapezni lim TR 60/210', sum: 'Najviši profil u programu, za najveći raspon rožnjača.',
      desc: ['Najviši profil u programu: rebro 60 mm, korak 210 mm, pokrivna širina 840 mm (ukupna 937 mm) iz trake 1250 mm, debljine 0,5–1,0 mm, od pocinkovanog i pocinkovanog plastificiranog lima.',
        'Tolerancije po EN 10143, premaz po EN 10169, nosivost po EN 1993-1-3 i EN 1993-1-5. Može i sa antikondenz filcom. Namena: poslovni, proizvodni i magacinski objekti, hladnjače, skladišta, stambeni i pomoćni objekti, garaže.'],
      specs: [['Visina rebra', '60 mm'], ['Korak rebra', '210 mm'], ['Pokrivna širina', '840 mm'], ['Ukupna širina', '937 mm'], ['Debljina', '0,5–1,0 mm'], ['Standardi', 'EN 10143, EN 10169, EN 1993-1-3, EN 1993-1-5']],
      tags: ['najveći raspon', 'hladnjače', 'skladišta'], apps: ['poslovni i proizvodni objekti', 'hladnjače i skladišta', 'stambeni i pomoćni objekti, garaže'] },
    en: { t: 'Trapezoidal sheet TR 60/210', sum: 'The tallest profile in the range, for the longest purlin spans.',
      desc: ['The tallest profile in the range: rib height 60 mm, pitch 210 mm, cover width 840 mm (overall 937 mm) from 1,250 mm strip, thicknesses 0.5–1.0 mm, in galvanised and galvanised pre-painted sheet.',
        'Tolerances to EN 10143, coating to EN 10169, load capacity to EN 1993-1-3 and EN 1993-1-5. Also available with anti-condensation felt. Uses: commercial, production and warehouse buildings, cold stores, storage buildings, residential and ancillary buildings, garages.'],
      specs: [['Rib height', '60 mm'], ['Rib pitch', '210 mm'], ['Cover width', '840 mm'], ['Overall width', '937 mm'], ['Thickness', '0.5–1.0 mm'], ['Standards', 'EN 10143, EN 10169, EN 1993-1-3, EN 1993-1-5']],
      tags: ['longest span', 'cold stores', 'storage'], apps: ['commercial and production buildings', 'cold stores and storage buildings', 'residential and ancillary buildings, garages'] } },

  { slug: 'imitacija-crepa', kind: 'product', cat: 'krov', img: 'crep', calc: 'crep', calcTabs: 'none', konf: 'o=dvovodni&p=crep&m=plast',
    rel: ['trapezni-lim', 'antikondenz-filc', 'gradjevinska-limarija', 'oluci-i-vertikale'],
    sr: { t: 'Imitacija crepa', sum: 'Panel sa profilom crepa — klasičan izgled krova uz brzinu montaže čeličnog pokrivača.',
      desc: ['Panel sa profilom crepa za krovove gde se traži klasičan izgled uz prednosti čeličnog pokrivača. Novi model proizvodimo od jula 2020; radi se jedan red (pet crepova) ili dužina po narudžbini u više redova.',
        'Dužina crepa je promenljiva: standard je 350 mm, preporuka 350–450 mm. Materijal je obično lim 0,5 mm (pocinkovan 140 g/m², fabrički bojen 25 µm lice / 8 µm naličje). Mala težina, ispod 5 kg/m² (klasičan crep 30–50 kg/m²), znači i jeftiniju konstrukciju; najmanji nagib krova je 14°.'],
      specs: [['Modul (dužina crepa)', '350 mm (350–450)'], ['Debljina', '0,5 mm ili po zahtevu'], ['Premaz', '25 µm lice / 8 µm naličje'], ['Težina', 'ispod 5 kg/m²'], ['Najmanji nagib', '14°'], ['Boja', 'RAL po izboru']],
      tags: ['plastificiran', 'RAL po izboru', 'modul 350 mm'], apps: ['stambeni krovovi', 'rekonstrukcija starih krovova (lakša konstrukcija)', 'pomoćni objekti'] },
    en: { t: 'Tile-effect roofing sheet', sum: 'A panel with a roof-tile profile — the classic look of a tiled roof with the installation speed of steel roofing.',
      desc: ['A panel with a roof-tile profile for roofs that call for a traditional look with the advantages of steel roofing. We have made the new model since July 2020; it is made as one row (five tiles) or in lengths to order covering several rows.',
        'The tile length is variable: 350 mm is standard, 350–450 mm recommended. The material is usually 0.5 mm sheet (galvanised 140 g/m², factory-painted 25 µm face / 8 µm reverse). Its low weight, under 5 kg/m² (classic tiles 30–50 kg/m²), also means a cheaper roof structure; the minimum roof pitch is 14°.'],
      specs: [['Module (tile length)', '350 mm (350–450)'], ['Thickness', '0.5 mm or to order'], ['Coating', '25 µm face / 8 µm reverse'], ['Weight', 'under 5 kg/m²'], ['Minimum pitch', '14°'], ['Colour', 'RAL of your choice']],
      tags: ['pre-painted', 'RAL of your choice', '350 mm module'], apps: ['residential roofs', 'refurbishing old roofs (lighter structure)', 'outbuildings'] } },

  { slug: 'parapetni-lim', kind: 'product', cat: 'krov', img: 'tr20', rel: ['lamperija', 'tr-10-162', 'profilisanje-parapeta-i-lamperije'],
    sr: { t: 'Parapetni lim', sum: 'Tri profila (PR 83/34, PR 38/15, PR 71/10) od lima 0,4–2 mm, u bojenoj, pocinkovanoj i HVL izvedbi.',
      desc: ['Fasadni i parapetni profil, u bojenoj i pocinkovanoj izvedbi. Profilišemo ga na sopstvenoj mašini za parapet u tri profila: PR 83/34, PR 38/15 i PR 71/10.',
        'Radi se po narudžbini, prema dimenzijama tabli na lageru; dužine i boje proverite sa prodajom.'],
      specs: [['Profili', 'PR 83/34, PR 38/15, PR 71/10'], ['Debljina lima', '0,4–2 mm'], ['Izvedba', 'bojeni, pocinkovani, HVL'], ['Izrada', 'po narudžbini']],
      tags: ['fasada', 'parapet'], apps: ['fasade', 'parapeti i atike', 'ograđivanje objekata'] },
    en: { t: 'Parapet lining sheet', sum: 'Three profiles (PR 83/34, PR 38/15, PR 71/10) from 0.4–2 mm sheet, painted, galvanised or cold-rolled.',
      desc: ['A façade and parapet profile, pre-painted or galvanised. We roll-form it on our own parapet machine in three profiles: PR 83/34, PR 38/15 and PR 71/10.',
        'It is made to order, to the dimensions of the sheets in stock; check lengths and colours with sales.'],
      specs: [['Profiles', 'PR 83/34, PR 38/15, PR 71/10'], ['Sheet thickness', '0.4–2 mm'], ['Finish', 'painted, galvanised, cold-rolled'], ['Production', 'to order']],
      tags: ['façade', 'parapet'], apps: ['façades', 'parapets and attics', 'enclosing buildings'] } },

  { slug: 'lamperija', kind: 'product', cat: 'krov', img: 'tr10', rel: ['parapetni-lim', 'aluminijumski-profili-i-lajsne', 'profilisanje-parapeta-i-lamperije'],
    sr: { t: 'Lamperija i lajsne', sum: 'Metalna lamperija za plafone, strehe i oblaganje, sa pratećim lajsnama; standardna dužina 2,5 m.',
      desc: ['Metalna lamperija za plafone, strehe i oblaganje, sa pratećim lajsnama — od bojenog aluminijuma, pocinkovano bojenog, prohromskog i bakarnog lima.',
        'Standardna dužina table je 2,5 m, po narudžbini i u drugim dužinama. Aluminijumska lamperija je plastificirana braon ili belo, glatka ili embosirana (kora pomorandže); čista pokrivna površina table je 0,65 m², a muški i ženski žleb daju neprimetan nastavak.'],
      specs: [['Standardna dužina', '2,5 m'], ['Pokrivna površina table', '0,65 m² (alu)'], ['Materijal', 'bojeni alu, pocinkovano bojeni, inox, bakar'], ['Spoj', 'muški / ženski žleb']],
      tags: ['plafoni', 'strehe', 'oblaganje'], apps: ['plafoni i strehe', 'oblaganje zidova', 'nadstrešnice'] },
    en: { t: 'Metal cladding panels and trims', sum: 'Metal cladding panels for ceilings, eaves and lining, with matching trims; standard length 2.5 m.',
      desc: ['Metal cladding panels for ceilings, eaves and wall lining, with matching trims — from painted aluminium, painted galvanised, stainless steel and copper sheet.',
        'The standard panel length is 2.5 m, other lengths to order. Aluminium panels are coated brown or white, smooth or embossed (orange-peel); the net cover area of a panel is 0.65 m², and the tongue-and-groove edge gives an invisible joint.'],
      specs: [['Standard length', '2.5 m'], ['Cover area per panel', '0.65 m² (aluminium)'], ['Material', 'painted aluminium, painted galvanised, stainless steel, copper'], ['Joint', 'tongue and groove']],
      tags: ['ceilings', 'eaves', 'cladding'], apps: ['ceilings and eaves', 'wall lining', 'canopies'] } },

  { slug: 'antikondenz-filc', kind: 'product', cat: 'krov', img: 'xray-sheet-layers', rel: ['trapezni-lim', 'tr-35-270', 'tr-40-230', 'imitacija-crepa'],
    sr: { t: 'Antikondenz filc', sum: 'Sloj na naličju pokrivnog lima koji upija kondenzat i sprečava kapljanje sa unutrašnje strane.',
      desc: ['Filc za trapezni i pokrivni lim koji sprečava kondenzaciju na unutrašnjoj strani pokrivača — bitno za hale i nadstrešnice. Antikondenz filc (DR!PSTOP) lepi se na naličje lima pri izradi profila.',
        'Sa filcom od 0,9 mm pokrivna širina TR 35 raste na 1090–1095 mm.'],
      specs: [['Oznaka', 'DR!PSTOP'], ['Debljina', '0,9 mm'], ['Nanošenje', 'na naličje, pri profilisanju'], ['Uz profile', 'TR 20, TR 35, TR 40, TR 60, imitacija crepa']],
      tags: ['hale', 'nadstrešnice'], apps: ['hale i magacini', 'nadstrešnice', 'poljoprivredni objekti'] },
    en: { t: 'Anti-condensation felt', sum: 'A layer on the underside of the roofing sheet that absorbs condensate and prevents dripping on the inner side.',
      desc: ['Felt for trapezoidal and roofing sheet that prevents condensation on the inner side of the roof covering — important for production halls and canopies. The anti-condensation felt (DR!PSTOP) is bonded to the underside of the sheet during roll forming.',
        'With 0.9 mm felt the cover width of TR 35 grows to 1,090–1,095 mm.'],
      specs: [['Product', 'DR!PSTOP'], ['Thickness', '0.9 mm'], ['Application', 'underside, during roll forming'], ['With profiles', 'TR 20, TR 35, TR 40, TR 60, tile-effect sheet']],
      tags: ['production halls', 'canopies'], apps: ['production halls and warehouses', 'canopies', 'agricultural buildings'] } },

  { slug: 'paneli', kind: 'product', cat: 'krov', img: 'panel', rel: ['trapezni-lim', 'antikondenz-filc'],
    sr: { t: 'Paneli', sum: 'Panelni program za krov i fasadu, za objekte gde se traži i termička izolacija.',
      desc: ['Panelni program za krov i fasadu, za objekte gde se traži i termička izolacija. Ponudu, debljine i boje panela proverite sa prodajom.'],
      specs: [['Primena', 'krov i fasada'], ['Namena', 'objekti sa termičkom izolacijom'], ['Ponuda', 'po upitu']],
      tags: ['krov', 'fasada'], apps: ['hale i magacini', 'hladnjače', 'poslovni objekti'] },
    en: { t: 'Panels', sum: 'Panel range for roofs and façades, for buildings that also need thermal insulation.',
      desc: ['Panel range for roofs and façades, for buildings that also need thermal insulation. Check the range, thicknesses and colours with sales.'],
      specs: [['Use', 'roof and façade'], ['Purpose', 'insulated buildings'], ['Range', 'on request']],
      tags: ['roof', 'façade'], apps: ['production halls and warehouses', 'cold stores', 'commercial buildings'] } },

  { slug: 'kanali-za-ventilaciju', kind: 'product', cat: 'krov', img: 'duct', rel: ['gradjevinska-limarija', 'savijanje-limova'],
    sr: { t: 'Kanali za ventilaciju', sum: 'Pravougaoni i okrugli kanali i fazonski elementi za ventilaciju i klimatizaciju.',
      desc: ['Pravougaoni i okrugli kanali i fazonski elementi za ventilaciju i klimatizaciju, izrađeni na sopstvenoj mašini za kanale — po specifikaciji kupca.'],
      specs: [['Oblik', 'pravougaoni i okrugli'], ['Fazonski komadi', 'da'], ['Izrada', 'po specifikaciji']],
      tags: ['po specifikaciji'], apps: ['ventilacija', 'klimatizacija', 'industrijski objekti'] },
    en: { t: 'Ventilation ducts', sum: 'Rectangular and circular ducts and fittings for ventilation and air conditioning.',
      desc: ['Rectangular and circular ducts and fittings for ventilation and air conditioning, made on our own duct machine — to the customer\'s specification.'],
      specs: [['Shape', 'rectangular and circular'], ['Fittings', 'yes'], ['Production', 'to specification']],
      tags: ['to specification'], apps: ['ventilation', 'air conditioning', 'industrial buildings'] } },

  /* ---------------------------------------------------------------- OLUCI I LIMARIJA */
  { slug: 'oluci-i-vertikale', kind: 'product', cat: 'oluci', img: 'gutter-halfround', konf: 'o=dvovodni&g=pk125&v=ok100',
    rel: ['gradjevinska-limarija', 'izrada-oluka', 'snegobrani', 'imitacija-crepa'],
    sr: { t: 'Oluci i vertikale', sum: 'Poluokrugli i četvrtasti oluci, okrugle i četvrtaste vertikale u dužini po želji, sa kompletnim priborom.',
      desc: ['Oluke i vertikale radimo u dužini po želji kupca. Uz njih ide kompletna galanterija za odvodnjavanje i obradu krovnih detalja — sve u istom limu i istoj boji kao pokrivač.',
        'Poluokrugli oluci RŠ 250–400 i četvrtasti do 8,2 m; okrugle vertikale Ø80–Ø150 i četvrtaste. Poluokrugle oluke RŠ 333 i okrugle vertikale Ø100 od pocinkovanog lima radimo u neograničenoj dužini, na automatizovanim linijama. Pribor: kuke, obujmice, danca, kolena, vodokotlići, vinklovi, zaštitnici, snegobrani.'],
      specs: [['Poluokrugli oluci', 'RŠ 250–400 mm'], ['Neograničena dužina', 'RŠ 333 i vertikala Ø100'], ['Okrugle vertikale', 'Ø80–Ø150'], ['Četvrtasti oluci', 'do 8,2 m'], ['Materijal', 'pocinkovani, bojeni, bakar, aluminijum, inox']],
      tags: ['pocinkovani', 'bojeni', 'bakarni'], apps: ['stambeni objekti', 'poslovni objekti i hale', 'rekonstrukcije krovova'] },
    en: { t: 'Gutters and downpipes', sum: 'Half-round and box gutters, round and square downpipes in any length you need, with a full set of accessories.',
      desc: ['We make gutters and downpipes in any length the customer needs. They come with a complete set of accessories for drainage and roof detailing — all in the same sheet and the same colour as the roof covering.',
        'Half-round gutters (developed width 250–400 mm) and box gutters up to 8.2 m; round downpipes Ø80–Ø150 and square downpipes. Half-round gutters with a 333 mm developed width and round Ø100 downpipes in galvanised sheet are made in unlimited lengths on automated lines. Accessories: brackets, clips, end caps, elbows, hopper heads, corners, guards, snow guards.'],
      specs: [['Half-round gutters', 'developed width 250–400 mm'], ['Unlimited length', '333 mm gutter and Ø100 downpipe'], ['Round downpipes', 'Ø80–Ø150'], ['Box gutters', 'up to 8.2 m'], ['Material', 'galvanised, painted, copper, aluminium, stainless steel']],
      tags: ['galvanised', 'painted', 'copper'], apps: ['residential buildings', 'commercial buildings and halls', 'roof refurbishment'] } },

  { slug: 'gradjevinska-limarija', kind: 'product', cat: 'oluci', img: 'flashing-set',
    rel: ['uvale', 'okapnice', 'slemena', 'opsivke', 'savijanje-limova'],
    sr: { t: 'Građevinska limarija', sum: 'Uvale, iksne, veterlajsne, okapnice, opšivke, slemena, snegobrani, kape za dimnjake — po vašim merama.',
      desc: ['Kompletnu građevinsku limariju savijamo po vašim merama, od svih vrsta lima. Apkant presa od 8,2 m radi opšivke, okapnice i slemena bez poprečnog spoja koji kasnije propušta ili se vidi.',
        'Šaljite razvijenu meru ili nacrt sa uglovima savijanja — ako imate samo gotov presek, izračunaćemo razvijenu dužinu. Za vidljive elemente navedite koja strana lima ide na vidnu stranu.'],
      specs: [['Dužina iz jednog komada', 'do 8,2 m'], ['Materijal', 'sve vrste lima'], ['Izrada', 'po meri / po nacrtu'], ['Boja', 'kao pokrivač, RAL']],
      tags: ['po meri', 'sve vrste lima'], apps: ['krovovi i fasade', 'atike i zidovi', 'dimnjaci i prodori'] },
    en: { t: 'Construction sheet-metal work', sum: 'Valley flashings, penetration flashings, verge flashings, eaves drip flashings, flashings, ridge caps, snow guards, chimney caps — to your dimensions.',
      desc: ['We bend complete building sheet-metal work to your dimensions, from all types of sheet. The 8.2 m press brake makes flashings, eaves drips and ridge caps with no transverse joint that later leaks or shows.',
        'Send the developed width or a drawing with bend angles — if you only have the finished cross-section, we will calculate the developed length. For visible elements, state which side of the sheet is the exposed face.'],
      specs: [['Length in one piece', 'up to 8.2 m'], ['Material', 'all sheet types'], ['Production', 'to measure / to drawing'], ['Colour', 'matching the roof, RAL']],
      tags: ['made to measure', 'all sheet types'], apps: ['roofs and façades', 'parapets and walls', 'chimneys and penetrations'] } }

  ];

  /* Elementi građevinske limarije (proizvodi.html, tab „Oluci“): isti obrazac */
  [['uvale', 'Uvale', 'spoj dve krovne ravni', 'Valley flashings', 'junction of two roof planes'],
   ['iksne', 'Iksne', 'obrada oko dimnjaka i prodora', 'Penetration flashings', 'detailing around chimneys and penetrations'],
   ['veterlajsne', 'Veterlajsne', 'završetak na čeonoj strani krova', 'Verge flashings', 'finish at the gable end of the roof'],
   ['okapnice', 'Okapnice', 'odvođenje vode sa ivice', 'Eaves drip flashings', 'shed water off the edge'],
   ['opsivke', 'Opšivke', 'atika, zidovi, prodori', 'Flashings', 'parapets, walls, penetrations'],
   ['slemena', 'Slemena', 'vrh krova, ventilisana i puna', 'Ridge caps', 'roof apex, ventilated and solid'],
   ['snegobrani', 'Snegobrani', 'zadržavanje snega nad ulazima', 'Snow guards', 'hold back snow above entrances'],
   ['kape-za-dimnjake', 'Kape za dimnjake', 'zaštita dimnjaka od vode', 'Chimney caps', 'keep water out of the chimney'],
   ['gazista', 'Gazišta', 'pocinkovana, za stepenice i platforme', 'Stair treads', 'galvanised, for stairs and platforms']
  ].forEach(function (r) {
    var it = { slug: r[0], kind: 'product', cat: 'limarija', img: r[0] === 'snegobrani' ? 'snowguard-row' : 'flashing-set',
      rel: ['gradjevinska-limarija', 'oluci-i-vertikale', 'savijanje-limova'],
      sr: { t: r[1], sum: r[2].charAt(0).toUpperCase() + r[2].slice(1) + '.',
        desc: [r[1] + ' — ' + r[2] + '. Deo građevinske limarije koju savijamo po vašim merama, od svih vrsta lima i u boji pokrivača.',
          'Apkant presa od 8,2 m daje element bez poprečnog spoja. Šaljite razvijenu meru ili nacrt sa uglovima savijanja; ako imate samo gotov presek, izračunaćemo razvijenu dužinu.'],
        specs: [['Namena', r[2]], ['Dužina iz jednog komada', 'do 8,2 m'], ['Materijal', 'sve vrste lima'], ['Izrada', 'po meri']],
        tags: ['po meri'], apps: [r[2]] },
      en: { t: r[3], sum: r[4].charAt(0).toUpperCase() + r[4].slice(1) + '.',
        desc: [r[3] + ' — ' + r[4] + '. Part of the building sheet-metal work we bend to your dimensions, from all sheet types and in the colour of the roof covering.',
          'The 8.2 m press brake gives an element with no transverse joint. Send the developed width or a drawing with bend angles; if you only have the finished cross-section, we will calculate the developed length.'],
        specs: [['Purpose', r[4]], ['Length in one piece', 'up to 8.2 m'], ['Material', 'all sheet types'], ['Production', 'to measure']],
        tags: ['made to measure'], apps: [r[4]] } };
    if (r[0] === 'snegobrani') {
      // catalog.js (galanterija „snego“) i stari sajt (F526, tabela snegobrana za crep)
      it.sr.desc = ['Snegobrani — zadržavanje snega nad ulazima. Cevni snegobran sa nosačima zadržava sneg da ne sklizne u oluk.', 'Snegobrani za crep: tegola (zelena, braon, bordo, crna — 0,5 mm); biber (pocinkovano, braon, bordo, bakar — 1 mm); kikinda, bečej, tondach (pocinkovan, braon, bordo, metaliza, bakar — 1 mm).'];
      it.sr.specs = [['Namena', r[2]], ['Izvedba', 'cevni snegobran sa nosačima'], ['Dužina komada', '3 m'], ['Za crep', 'tegola 0,5 mm; biber, kikinda, bečej, tondach 1 mm']];
      it.sr.tags = ['limarska galanterija'];
      it.en.desc = ['Snow guards — hold back snow above entrances. A tubular snow guard on brackets holds the snow back so it does not slide into the gutter.', 'Snow guards for roof tiles: tegola (green, brown, burgundy, black — 0.5 mm); biber (galvanised, brown, burgundy, copper — 1 mm); Kikinda, Bečej, Tondach (galvanised, brown, burgundy, metallic, copper — 1 mm).'];
      it.en.specs = [['Purpose', r[4]], ['Design', 'tubular snow guard on brackets'], ['Piece length', '3 m'], ['For roof tiles', 'tegola 0.5 mm; biber, Kikinda, Bečej, Tondach 1 mm']];
      it.en.tags = ['sheet-metal roofing accessories'];
    }
    if (r[0] === 'kape-za-dimnjake') {
      // usluge.html: rundovanje — cilindri, konusi, kape za dimnjake, po radiusu
      it.sr.desc[1] = 'Izrađuju se rundovanjem, po radiusu — kao cilindri i konusi. Šaljite meru ili nacrt.';
      it.sr.specs = [['Namena', r[2]], ['Izrada', 'rundovanje, po radiusu'], ['Materijal', 'sve vrste lima'], ['Mera', 'po meri']];
      it.en.desc[1] = 'They are made by plate rolling, to radius — like cylinders and cones. Send the dimensions or a drawing.';
      it.en.specs = [['Purpose', r[4]], ['Production', 'plate rolling, to radius'], ['Material', 'all sheet types'], ['Size', 'to measure']];
    }
    if (r[0] === 'gazista') {
      it.cat = 'kovano'; it.img = 'flashing-set';
      it.sr.desc = ['Pocinkovana gazišta za stepenice i platforme, od toplovaljanog lima S235, toplo cinkovana ili farbana.', 'Standardne dimenzije: 200×1000, 250×1000, 300×1000, 500×1000, 500×500 i 1000×1000 mm.'];
      it.sr.specs = [['Dimenzije', '200–1000 × 500–1000 mm'], ['Materijal', 'toplovaljani lim S235'], ['Zaštita', 'toplo cinkovano ili farbano']];
      it.en.desc = ['Galvanised stair treads for stairs and platforms, from hot-rolled S235 sheet, hot-dip galvanised or painted.', 'Standard sizes: 200×1,000, 250×1,000, 300×1,000, 500×1,000, 500×500 and 1,000×1,000 mm.'];
      it.en.specs = [['Sizes', '200–1,000 × 500–1,000 mm'], ['Material', 'hot-rolled S235 sheet'], ['Protection', 'hot-dip galvanised or painted']];
      it.rel = ['celicni-profili', 'kvadratne-i-pravougaone-cevi'];
    }
    ITEMS.push(it);
  });

  ITEMS.push(

  /* ---------------------------------------------------------------- CEVI I PROFILI */
  { slug: 'kvadratne-i-pravougaone-cevi', kind: 'product', cat: 'cevi', img: 'tubes', rel: ['okrugle-cevi', 'precizne-cevi', 'secenje-profila', 'celicni-profili'],
    sr: { t: 'Kvadratne i pravougaone cevi', sum: 'Šavne hladno oblikovane cevi (ZP profili) za konstrukcije, ograde i kapije.',
      desc: ['Šavne hladno oblikovane cevi (ZP profili) za konstrukcije, ograde i kapije. Sečemo ih na trakastim testerama na dužinu koju tražite, pa ne plaćate ostatak šipke koji vam ne treba.', 'Dimenzije, standarde i mase po dimenziji pogledajte u tabeli cevi na strani prodajnog programa.'],
      specs: [['Vrsta', 'šavne, hladno oblikovane (ZP)'], ['Oblik', 'kvadratne i pravougaone'], ['Sečenje na meru', 'trakasta testera, do 60°']],
      tags: ['ZP profil', 'sečenje na meru'], apps: ['metalne konstrukcije', 'ograde i kapije', 'nadstrešnice'] },
    en: { t: 'Square and rectangular tubes', sum: 'Welded cold-formed tubes (ZP hollow sections) for structures, fences and gates.',
      desc: ['Welded cold-formed tubes (ZP hollow sections) for structures, fences and gates. We cut them on band saws to the length you ask for, so you do not pay for the rest of the bar that you do not need.', 'See the tube table on the product range page for dimensions, standards and weights.'],
      specs: [['Type', 'welded, cold-formed (ZP)'], ['Shape', 'square and rectangular'], ['Cutting to length', 'band saw, up to 60°']],
      tags: ['ZP section', 'cut to size'], apps: ['steel structures', 'fences and gates', 'canopies'] } },

  { slug: 'okrugle-cevi', kind: 'product', cat: 'cevi', img: 'tubes', rel: ['kvadratne-i-pravougaone-cevi', 'precizne-cevi', 'lucno-savijanje'],
    sr: { t: 'Okrugle cevi', sum: 'Crne okrugle colovne i pocinkovane okrugle cevi, za ograde i instalacije.',
      desc: ['Crne okrugle colovne i pocinkovane okrugle cevi, za ograde i instalacije. Sečemo ih na meru, a okrugle cevi 1/2"–2" i lučno savijamo za zaobljene elemente i ograde.'],
      specs: [['Vrsta', 'colovne crne, pocinkovane'], ['Lučno savijanje', '1/2"–2" (zid 2–3 mm)'], ['Sečenje na meru', 'da']],
      tags: ['colovne', 'pocinkovane'], apps: ['ograde', 'instalacije', 'konstrukcije'] },
    en: { t: 'Round tubes', sum: 'Black round tubes in inch sizes and galvanised round tubes, for railings and building services.',
      desc: ['Black round tubes in inch sizes and galvanised round tubes, for railings and building services. We cut them to size and arc-bend round tubes 1/2"–2" for curved elements and railings.'],
      specs: [['Type', 'black inch-size, galvanised'], ['Arc bending', '1/2"–2" (wall 2–3 mm)'], ['Cutting to length', 'yes']],
      tags: ['inch sizes', 'galvanised'], apps: ['railings', 'building services', 'structures'] } },

  { slug: 'precizne-cevi', kind: 'product', cat: 'cevi', img: 'tubes', rel: ['okrugle-cevi', 'kvadratne-i-pravougaone-cevi'],
    sr: { t: 'Precizne cevi', sum: 'Ovalne i okrugle precizne cevi sa užim tolerancijama, za zahtevnije konstrukcije.',
      desc: ['Ovalne i okrugle precizne cevi sa užim tolerancijama (tačnost mere) — za metalni nameštaj, enterijere, sanitarne uređaje, automobile, bicikle i konstrukcije. Sečemo ih na dužinu koju tražite.'],
      specs: [['Oblik', 'okrugle i ovalne'], ['Tolerancije', 'uže (tačnost mere)'], ['Sečenje na meru', 'da']],
      tags: ['precizne', 'ovalne'], apps: ['metalni nameštaj i enterijeri', 'sanitarni uređaji', 'konstrukcije'] },
    en: { t: 'Precision tubes', sum: 'Oval and round precision tubes with tighter tolerances, for more demanding structures.',
      desc: ['Oval and round precision tubes with tighter tolerances (dimensional accuracy) — for metal furniture, interiors, sanitary fittings, cars, bicycles and structures. We cut them to the length you need.'],
      specs: [['Shape', 'round and oval'], ['Tolerances', 'tighter (dimensional accuracy)'], ['Cutting to length', 'yes']],
      tags: ['precision', 'oval'], apps: ['metal furniture and interiors', 'sanitary fittings', 'structures'] } },

  /* ---------------------------------------------------------------- ALATI I OPREMA */
  { slug: 'elektricni-i-rucni-alat', kind: 'product', cat: 'alati', svg: 'alati', rel: ['oprema-za-varenje', 'srafovska-roba-i-okov', 'merdevine-i-pomocna-oprema'],
    sr: { t: 'Električni i ručni alat', sum: 'Bušilice, brusilice, testere, odvijači, merni i ručni limarski alat sa potrošnim sredstvima.',
      desc: ['Bušilice, brusilice, ubodne i ugaone testere, odvijači, merni alat, ručni limarski alat i prateća potrošna sredstva — rezne i brusne ploče, burgije, listovi.', 'Ideja je da limar i bravar u jednoj kupovini uzmu i materijal i sve što treba da se on ugradi. Držimo alat vodećih brendova (Bosch, Makita, DeWalt).'],
      specs: [['Brendovi', 'Bosch, Makita, DeWalt'], ['Električni alat', 'bušilice, brusilice, testere, odvijači'], ['Potrošni materijal', 'ploče, burgije, listovi']],
      tags: ['Bosch', 'Makita', 'DeWalt'], apps: ['limarske radionice', 'bravarija', 'gradilište'] },
    en: { t: 'Power and hand tools', sum: 'Drills, grinders, saws, screwdrivers, measuring tools and sheet-metal hand tools with consumables.',
      desc: ['Drills, grinders, jigsaws and mitre saws, screwdrivers, measuring tools, sheet-metal hand tools and consumables — cutting and grinding discs, drill bits, saw blades.', 'The idea is that a sheet-metal worker or metal fabricator gets the material and everything needed to install it in a single purchase. We stock tools from leading brands (Bosch, Makita, DeWalt).'],
      specs: [['Brands', 'Bosch, Makita, DeWalt'], ['Power tools', 'drills, grinders, saws, screwdrivers'], ['Consumables', 'discs, drill bits, blades']],
      tags: ['Bosch', 'Makita', 'DeWalt'], apps: ['sheet-metal workshops', 'metal fabrication', 'building sites'] } },

  { slug: 'oprema-za-varenje', kind: 'product', cat: 'alati', svg: 'alati', rel: ['elektricni-i-rucni-alat', 'srafovska-roba-i-okov'],
    sr: { t: 'Oprema za varenje', sum: 'Aparati, prateći materijal i oprema za varenje Varstroj — elektrode, žice, maske i zaštita.',
      desc: ['Aparati, prateći materijal i oprema za varenje Varstroj — elektrode, žice, maske i zaštita. Raspoložive modele i potrošni materijal proverite sa prodajom.'],
      specs: [['Brend', 'Varstroj'], ['Program', 'aparati, elektrode, žice'], ['Zaštita', 'maske i zaštitna oprema']],
      tags: ['Varstroj'], apps: ['bravarija', 'metalne konstrukcije', 'održavanje'] },
    en: { t: 'Welding equipment', sum: 'Welding machines, consumables and equipment by Varstroj — electrodes, wire, helmets and protective gear.',
      desc: ['Welding machines, consumables and equipment by Varstroj — electrodes, wire, welding helmets and protective gear. Check available models and consumables with sales.'],
      specs: [['Brand', 'Varstroj'], ['Range', 'machines, electrodes, wire'], ['Protection', 'helmets and protective gear']],
      tags: ['Varstroj'], apps: ['metal fabrication', 'steel structures', 'maintenance'] } },

  { slug: 'srafovska-roba-i-okov', kind: 'product', cat: 'alati', svg: 'alati', rel: ['elektricni-i-rucni-alat', 'oprema-za-varenje'],
    sr: { t: 'Šrafovska roba i okov', sum: 'Vijci, navrtke, podloške, ankeri, tiplovi, brave i okovi za kapije i vrata.',
      desc: ['Vijci, navrtke, podloške, ankeri i tiplovi, brave, okovi za kapije i vrata, šarke, reze, katanci.', 'Brave i okovi Bane Sekulić (Sombor) i italijanskih proizvođača PETITI, FIMET i HOPE.'],
      specs: [['Program', 'vijci, navrtke, podloške, ankeri, tiplovi'], ['Okov', 'brave, šarke, reze, katanci'], ['Brendovi', 'Bane Sekulić, PETITI, FIMET, HOPE']],
      tags: ['vijci', 'okov'], apps: ['kapije i ograde', 'vrata', 'montaža limarije'] },
    en: { t: 'Fasteners and hardware', sum: 'Screws, nuts, washers, anchors, wall plugs, locks and gate and door hardware.',
      desc: ['Screws, nuts, washers, anchors and wall plugs, locks, gate and door hardware, hinges, latches, padlocks.', 'Locks and hardware from Bane Sekulić (Sombor) and the Italian manufacturers PETITI, FIMET and HOPE.'],
      specs: [['Range', 'screws, nuts, washers, anchors, wall plugs'], ['Hardware', 'locks, hinges, latches, padlocks'], ['Brands', 'Bane Sekulić, PETITI, FIMET, HOPE']],
      tags: ['screws', 'hardware'], apps: ['gates and fences', 'doors', 'fixing sheet-metal work'] } },

  { slug: 'aluminijumski-profili-i-lajsne', kind: 'product', cat: 'alati', img: 'sections', rel: ['lamperija', 'gradjevinska-limarija'],
    sr: { t: 'Aluminijumski profili i lajsne', sum: 'Profili, lajsne i završni elementi za suvu montažu, oblaganje i limarske detalje.',
      desc: ['Profili, lajsne i završni elementi za suvu montažu, oblaganje i limarske detalje. Raspoložive dimenzije proverite sa prodajom.'],
      specs: [['Materijal', 'aluminijum'], ['Program', 'profili, lajsne, završni elementi'], ['Primena', 'suva montaža, oblaganje']],
      tags: ['aluminijum'], apps: ['suva montaža', 'oblaganje', 'limarski detalji'] },
    en: { t: 'Aluminium profiles and trims', sum: 'Profiles, trims and finishing pieces for dry construction, cladding and sheet-metal details.',
      desc: ['Profiles, trims and finishing pieces for dry construction, cladding and sheet-metal details. Check available sizes with sales.'],
      specs: [['Material', 'aluminium'], ['Range', 'profiles, trims, finishing pieces'], ['Use', 'dry construction, cladding']],
      tags: ['aluminium'], apps: ['dry construction', 'cladding', 'sheet-metal details'] } },

  { slug: 'merdevine-i-pomocna-oprema', kind: 'product', cat: 'alati', svg: 'alati', rel: ['elektricni-i-rucni-alat', 'srafovska-roba-i-okov'],
    sr: { t: 'Merdevine i pomoćna oprema', sum: 'Aluminijumske merdevine Alpos — profesionalne EXPERT i poluprofesionalne RATIO — i pribor Mimont.',
      desc: ['Aluminijumske merdevine Alpos (Slovenija) — profesionalne EXPERT i poluprofesionalne RATIO — i pomoćni pribor Mimont.'],
      specs: [['Merdevine', 'Alpos EXPERT, RATIO'], ['Materijal', 'aluminijum'], ['Pribor', 'Mimont']],
      tags: ['Alpos', 'Mimont'], apps: ['gradilište', 'radionica', 'održavanje objekata'] },
    en: { t: 'Ladders and ancillary equipment', sum: 'Aluminium ladders by Alpos — professional EXPERT and semi-professional RATIO — and Mimont accessories.',
      desc: ['Aluminium ladders by Alpos (Slovenia) — professional EXPERT and semi-professional RATIO — and ancillary accessories by Mimont.'],
      specs: [['Ladders', 'Alpos EXPERT, RATIO'], ['Material', 'aluminium'], ['Accessories', 'Mimont']],
      tags: ['Alpos', 'Mimont'], apps: ['building sites', 'workshops', 'building maintenance'] } },

  /* ---------------------------------------------------------------- KATEGORIJE (postojeće strane) */
  { slug: 'limovi', kind: 'group', cat: 'limovi', img: 'sheet-stack', page: 'proizvodi.html?grupa=limovi#prog', rel: ['secenje-makazama', 'slitovanje', 'secenje-cnc-plazma'],
    sr: { t: 'Limovi u tablama i koturu', sum: 'Pocinkovani, aluminijumski, bakarni, crni toplo- i hladnovaljani, plastificirani po RAL karti i prohromski limovi.',
      desc: ['Osnovni materijal za svaki limarski posao. Držimo pocinkovane, aluminijumske, bakarne, crne toplo- i hladnovaljane, plastificirane po RAL karti i prohromske limove.', 'Pocinkovani lim svih formata, 0,4–2 mm, toplocinkovan 140, 200 i 275 g/m². Konfekcioniramo ga u svim oblicima za dalju doradu: sečenje iz kotura na potrebnu dužinu, sečenje table na meru, slitovanje.'],
      specs: [['Vrste', 'pocinkovani, alu, bakar, HVL, TVL, bojeni, inox'], ['Pocinkovani', '0,4–2 mm; 140, 200, 275 g/m²'], ['Sečenje', 'makaze do 13 mm, inox do 9 mm'], ['Slitovanje', 'kotur do 1260 mm']],
      tags: ['pocinkovani', 'aluminijumski', 'bakarni', 'inox'], apps: ['krov, oluci, galanterija, opšivke', 'fasade', 'konstrukcije i mašinska obrada'] },
    en: { t: 'Sheet metal in sheets and coils', sum: 'Galvanised, aluminium, copper, black hot- and cold-rolled, pre-painted (RAL) and stainless steel sheet.',
      desc: ['The basic material for any sheet-metal job. We stock galvanised, aluminium, copper, black hot- and cold-rolled, pre-painted (RAL colour chart) and stainless steel sheet.', 'Galvanised sheet in all formats, 0.4–2 mm, hot-dip galvanised 140, 200 and 275 g/m². We prepare it in any form for further processing: cutting from coil to the required length, cutting sheets to size, slitting.'],
      specs: [['Types', 'galvanised, aluminium, copper, CR, HR, pre-painted, stainless'], ['Galvanised', '0.4–2 mm; 140, 200, 275 g/m²'], ['Cutting', 'guillotine up to 13 mm, stainless up to 9 mm'], ['Slitting', 'coil up to 1,260 mm']],
      tags: ['galvanised', 'aluminium', 'copper', 'stainless steel'], apps: ['roofing, gutters, accessories, flashings', 'façades', 'structures and machining'] } },

  { slug: 'cevi-i-zp-profili', kind: 'group', cat: 'cevi', img: 'tubes', page: 'proizvodi.html?grupa=cevi#prog', rel: ['kvadratne-i-pravougaone-cevi', 'okrugle-cevi', 'precizne-cevi', 'secenje-profila'],
    sr: { t: 'Cevi i ZP profili', sum: 'Kvadratne, pravougaone, colovne, precizne i grifovane cevi — sečene na meru.',
      desc: ['Šavne i precizne cevi i hladno oblikovani ZP profili. Sečemo ih na trakastim testerama na dužinu koju tražite, a šipkaste profile po potrebi i grifujemo.'],
      specs: [['Program', 'kvadratne, pravougaone, colovne, precizne, grifovane'], ['Sečenje', 'trakasta testera, do 60°'], ['Dorada', 'grifovanje, lučno savijanje']],
      tags: ['kvadratne', 'pravougaone', 'colovne', 'precizne'], apps: ['konstrukcije', 'ograde i kapije', 'instalacije'] },
    en: { t: 'Tubes and hollow sections', sum: 'Square, rectangular, inch-size, precision and embossed tubes — cut to size.',
      desc: ['Welded and precision tubes and cold-formed ZP hollow sections. We cut them to the length you need on band saws, and emboss bar sections on request.'],
      specs: [['Range', 'square, rectangular, inch-size, precision, embossed'], ['Cutting', 'band saw, up to 60°'], ['Finishing', 'embossing, arc bending']],
      tags: ['square', 'rectangular', 'inch-size', 'precision'], apps: ['structures', 'fences and gates', 'building services'] } },

  { slug: 'celicni-profili', kind: 'group', cat: 'cevi', img: 'sections', page: 'proizvodi.html?grupa=cevi#prog', rel: ['secenje-profila', 'grifovanje', 'cevi-i-zp-profili'],
    sr: { t: 'Čelični profili', sum: 'Flah, ugaonik, U i I profil, kvadratni pun — sečeni na dužinu koju tražite.',
      desc: ['Standardni čelični profili: flah, ugaonici, U i I profili i puni kvadratni profili. Trakastim testerama ih sečemo na dužinu koju tražite — pa ne plaćate ostatak šipke koji vam ne treba; flah i kvadrat po potrebi grifujemo.'],
      specs: [['Program', 'flah, ugaonik, U, I, kvadratni pun'], ['Sečenje', 'pojedinačno ili u snopu, do 60°'], ['Dorada', 'grifovanje, peglanje flaha']],
      tags: ['flah', 'ugaonik', 'U profil', 'I profil'], apps: ['metalne konstrukcije', 'kovane ograde i kapije'] },
    en: { t: 'Steel sections', sum: 'Flat bar, angle, channel, I-beam and solid square bar — cut to the length you need.',
      desc: ['Standard steel sections: flat bar, angles, channels, I-sections and solid square bar. We cut them on band saws to the length you ask for — so you do not pay for the rest of the bar you do not need; flat and square bar can be embossed on request.'],
      specs: [['Range', 'flat bar, angle, channel, I-beam, solid square'], ['Cutting', 'single or bundle, up to 60°'], ['Finishing', 'embossing, flat bar straightening']],
      tags: ['flat bar', 'angle', 'channel', 'I-beam'], apps: ['steel structures', 'wrought-iron fences and gates'] } },

  { slug: 'alati-okov-oprema', kind: 'group', cat: 'alati', svg: 'alati', page: 'proizvodi.html?grupa=alati#prog', rel: ['elektricni-i-rucni-alat', 'oprema-za-varenje', 'srafovska-roba-i-okov', 'merdevine-i-pomocna-oprema'],
    sr: { t: 'Alati, okov i oprema', sum: 'Električni i ručni alat vodećih brendova, oprema za varenje Varstroj i kompletna šrafovska roba.',
      desc: ['Ideja je da limar i bravar u jednoj kupovini uzmu i materijal i sve što treba da se on ugradi. Držimo električni i ručni alat vodećih brendova, opremu za varenje i kompletnu šrafovsku robu.'],
      specs: [['Alat', 'Bosch, Makita, DeWalt'], ['Varenje', 'Varstroj'], ['Okov', 'Bane Sekulić, PETITI, FIMET, HOPE'], ['Merdevine', 'Alpos']],
      tags: ['Bosch', 'Makita', 'DeWalt', 'Varstroj'], apps: ['limarske radionice', 'bravarija', 'gradilište'] },
    en: { t: 'Tools, hardware and equipment', sum: 'Power and hand tools from leading brands, Varstroj welding equipment and a complete range of fasteners.',
      desc: ['The idea is that a sheet-metal worker or metal fabricator gets the material and everything needed to install it in a single purchase. We stock power and hand tools from leading brands, welding equipment and a complete range of fasteners.'],
      specs: [['Tools', 'Bosch, Makita, DeWalt'], ['Welding', 'Varstroj'], ['Hardware', 'Bane Sekulić, PETITI, FIMET, HOPE'], ['Ladders', 'Alpos']],
      tags: ['Bosch', 'Makita', 'DeWalt', 'Varstroj'], apps: ['sheet-metal workshops', 'metal fabrication', 'building sites'] } },

  { slug: 'usluge-obrade', kind: 'group', cat: 'usluge', img: 'plasma-plate', page: 'usluge.html', rel: ['secenje-cnc-plazma', 'secenje-makazama', 'savijanje-limova', 'slitovanje'],
    sr: { t: 'Usluge obrade', sum: 'Sečenje na CNC plazmi i makazama, gasno rezanje, slitovanje, savijanje, rundovanje, probijanje i sečenje profila.',
      desc: ['Sečenje na CNC plazmi i makazama, gasno rezanje, slitovanje i premotavanje kotura, savijanje i rundovanje, probijanje i isecanje uglova, sečenje profila na trakastim testerama.', 'Materijal možete kupiti u fabričkom pakovanju ili ga uzeti obrađenog — sve operacije radimo na svojim mašinama u Batajnici i Ugrinovcima.'],
      specs: [['Usluga', '14 vrsta obrade'], ['Plazma / gas', 'do 30 / do 150 mm'], ['Apkant presa', '8,2 m'], ['Slitovanje', 'kotur do 1260 mm']],
      tags: ['plazma', 'makaze', 'savijanje', 'slitovanje'], apps: ['limari', 'bravari', 'izvođači'] },
    en: { t: 'Processing services', sum: 'CNC plasma and guillotine cutting, oxy-fuel cutting, slitting, bending, plate rolling, punching and section cutting.',
      desc: ['Cutting on CNC plasma and guillotine shears, oxy-fuel cutting, slitting and recoiling of coils, bending and plate rolling, punching and corner notching, cutting sections on band saws.', 'You can buy material in mill packaging or have it processed — we carry out every operation on our own machines in Batajnica and Ugrinovci.'],
      specs: [['Services', '14 processes'], ['Plasma / oxy-fuel', 'up to 30 / up to 150 mm'], ['Press brake', '8.2 m'], ['Slitting', 'coil up to 1,260 mm']],
      tags: ['plasma', 'guillotine', 'bending', 'slitting'], apps: ['sheet-metal workers', 'metal fabricators', 'contractors'] } },

  { slug: 'prodajni-program', kind: 'group', cat: 'program', img: 'sheet-stack', page: 'proizvodi.html', rel: ['limovi', 'trapezni-lim', 'oluci-i-vertikale', 'cevi-i-zp-profili'],
    sr: { t: 'Prodajni program', sum: 'Limovi, trapezni i krovni limovi, oluci, cevi i ZP profili, čelični profili, kovani elementi, šrafovska roba i alat.',
      desc: ['Limovi u tablama i koturu, trapezni i krovni limovi, oluci i vertikale, šavne cevi i ZP profili, čelični profili, kovani elementi, pletiva, šrafovska roba, alat i oprema za varenje.', 'Šest grupa proizvoda pokriva sve što jedna radionica troši. Dimenzije i raspoloživost na lageru proverite sa prodajom.'],
      specs: [['Grupe proizvoda', '6'], ['Cena', 'zavisi od količine'], ['Popust', 'od jedne tone naviše']],
      tags: ['limovi', 'krov', 'oluci', 'cevi'], apps: ['limarske i bravarske radionice', 'izvođači', 'kupci na malo'] },
    en: { t: 'Product range', sum: 'Sheet metal, trapezoidal and roofing sheet, gutters, tubes and hollow sections, steel sections, wrought-iron elements, fasteners and tools.',
      desc: ['Sheet metal in sheets and coils, trapezoidal and roofing sheet, gutters and downpipes, welded tubes and hollow sections, steel sections, wrought-iron elements, wire mesh, screws and fasteners, tools and welding equipment.', 'Six product groups cover everything a workshop uses. Check dimensions and stock availability with sales.'],
      specs: [['Product groups', '6'], ['Price', 'depends on quantity'], ['Discount', 'from one tonne upwards']],
      tags: ['sheet metal', 'roofing', 'gutters', 'tubes'], apps: ['sheet-metal and fabrication workshops', 'contractors', 'retail customers'] } },

  { slug: 'proizvodnja-po-meri', kind: 'group', cat: 'program', img: 'tr35', page: 'usluge.html#profilisanje', rel: ['trapezni-lim', 'oluci-i-vertikale', 'lamperija', 'gradjevinska-limarija'],
    sr: { t: 'Proizvodnja po meri', sum: 'Trapezni lim, oluci i vertikale u dužini po želji, lamperija, parapetni lim, građevinska limarija, kanali, gazišta.',
      desc: ['Trapezni pokrivni lim, oluci i vertikale u dužini po želji, lamperija, parapetni lim, kompletna građevinska limarija, kanali za ventilaciju, pocinkovana gazišta.', 'Profilirke rade iz kotura, pa dužinu diktira vaš objekat — krov ili fasada bez poprečnih preklopa.'],
      specs: [['Dužina', 'po meri objekta'], ['Profili', 'TR 10 – TR 60, imitacija crepa'], ['Oluci', 'RŠ 333 neograničeno']],
      tags: ['trapezni lim', 'oluci', 'lamperija'], apps: ['krovovi', 'fasade', 'odvodnjavanje'] },
    en: { t: 'Made-to-measure production', sum: 'Trapezoidal sheet, gutters and downpipes in any length, cladding panels, parapet sheet, building flashings, ducts, stair treads.',
      desc: ['Trapezoidal profiled roofing sheet, gutters and downpipes in any length you choose, metal cladding panels, parapet lining sheet, complete building sheet-metal work, ventilation ducts, galvanised stair treads.', 'The roll formers work from coil, so the length is set by your building — a roof or façade with no transverse laps.'],
      specs: [['Length', 'to suit the building'], ['Profiles', 'TR 10 – TR 60, tile-effect sheet'], ['Gutters', '333 mm unlimited length']],
      tags: ['trapezoidal sheet', 'gutters', 'cladding panels'], apps: ['roofs', 'façades', 'drainage'] } }
  );

  /* ---------------------------------------------------------------- USLUGE (usluge.html, 14 redova) */
  var SVC = [
    ['secenje-cnc-plazma', 'plasma-plate', null, ['gasno-rezanje', 'radni-sto', 'ponovljivost', 'secenje-makazama'],
      { t: 'Sečenje na CNC plazmi', sum: 'Kompjuterski vođeno rezanje po nacrtu. Čelik, inox, bakar i aluminijum do 30 mm.',
        desc: ['Mašina je u potpunosti kompjuterski vođena, pa je mogućnost greške svedena na minimum. Plazma je nezamenljiva za sve što nije prava linija — konture, radijuse, rupe, proreze i ugnježdene delove; ponovljivost u seriji je potpuna.',
          'Najbolji format nacrta je DXF ili DWG; radimo i po PDF-u, crtežu ili skici sa kotama. Kada cela specifikacija stigne odjednom, delovi se raspoređuju po tabli tako da otpad bude najmanji.'],
        specs: [['Debljina', 'do 30 mm'], ['Materijali', 'crni čelik, inox, bakar, aluminijum'], ['Radni sto', '2,5 × 8 m'], ['Nacrt', 'DXF, DWG, PDF, skica']], tags: ['do 30 mm', 'CNC plazma'], apps: ['delovi po nacrtu', 'konture, rupe, prorezi', 'serije sa punom ponovljivošću'] },
      { t: 'CNC plasma cutting', sum: 'Computer-controlled cutting to drawing. Steel, stainless steel, copper and aluminium up to 30 mm.',
        desc: ['The machine is fully computer-controlled, so the chance of error is reduced to a minimum. Plasma is indispensable for anything that is not a straight line — contours, radii, holes, slots and nested parts; repeatability across a series is complete.',
          'The best drawing format is DXF or DWG; we also work from a PDF, a drawing or a dimensioned sketch. When the full specification arrives at once, the parts are laid out on the sheet so that scrap is minimal.'],
        specs: [['Thickness', 'up to 30 mm'], ['Materials', 'black steel, stainless steel, copper, aluminium'], ['Cutting table', '2.5 × 8 m'], ['Drawing', 'DXF, DWG, PDF, sketch']], tags: ['up to 30 mm', 'CNC plasma'], apps: ['parts to drawing', 'contours, holes, slots', 'series with full repeatability'] }],
    ['gasno-rezanje', 'plasma-plate', null, ['secenje-cnc-plazma', 'radni-sto'],
      { t: 'Gasno rezanje', sum: 'Za debele ploče i masivne pripremke — do 150 mm debljine materijala.',
        desc: ['Gasno rezanje koristimo iznad debljina gde plazma više nije ekonomična — za ploče do 150 mm, masivne pripremke i grubu pripremu.', 'Reže se na istom CNC stolu od 2,5 × 8 m, po nacrtu.'],
        specs: [['Debljina', 'do 150 mm'], ['Materijal', 'crni čelik — ploče'], ['Radni sto', '2,5 × 8 m']], tags: ['do 150 mm', 'gasno'], apps: ['debele ploče', 'masivni pripremci', 'gruba priprema'] },
      { t: 'Oxy-fuel cutting', sum: 'For thick plate and heavy blanks — material thickness up to 150 mm.',
        desc: ['Oxy-fuel cutting is what we use above the thicknesses where plasma is no longer economical — for plate up to 150 mm, heavy blanks and rough preparation.', 'It is cut on the same 2.5 × 8 m CNC table, to drawing.'],
        specs: [['Thickness', 'up to 150 mm'], ['Material', 'black steel — plate'], ['Cutting table', '2.5 × 8 m']], tags: ['up to 150 mm', 'oxy-fuel'], apps: ['thick plate', 'heavy blanks', 'rough preparation'] }],
    ['secenje-makazama', 'sheet-stack', null, ['slitovanje', 'secenje-cnc-plazma', 'limovi'],
      { t: 'Sečenje limova makazama', sum: 'Hidraulične i elektromotorne makaze; lim do 13 mm, prohrom do 9 mm.',
        desc: ['Makaze su najbrže i najjeftinije rešenje kada su vam potrebni ravni rezovi i formatiranje table na meru. Nema toplotnog uticaja na materijal i rez je čist.', 'Hidraulične makaze MHS 3100/13 seku do 13 mm (inox do 9 mm) na dužini reza do 3100 mm; elektromotorne makaze do 1,5 mm na dužini 2 m.'],
        specs: [['Lim', 'do 13 mm (450 MPa)'], ['Inox', 'do 9 mm (650 MPa)'], ['Dužina reza', 'do 3100 mm'], ['Tanak lim', 'do 1,5 mm na 2 m']], tags: ['lim do 13 mm', 'prohrom do 9 mm'], apps: ['formatiranje table', 'ravni rezovi', 'inox bez oštećenja površine'] },
      { t: 'Sheet cutting on guillotine shears', sum: 'Hydraulic and electric guillotine shears; sheet up to 13 mm, stainless steel up to 9 mm.',
        desc: ['Guillotine shears are the fastest and cheapest solution when you need straight cuts and sheets cut to size. There is no heat input into the material and the cut is clean.', 'The MHS 3100/13 hydraulic shear cuts up to 13 mm (stainless steel up to 9 mm) over a cutting length of up to 3,100 mm; the electric shear up to 1.5 mm over 2 m.'],
        specs: [['Sheet', 'up to 13 mm (450 MPa)'], ['Stainless steel', 'up to 9 mm (650 MPa)'], ['Cutting length', 'up to 3,100 mm'], ['Thin sheet', 'up to 1.5 mm over 2 m']], tags: ['sheet up to 13 mm', 'stainless up to 9 mm'], apps: ['cutting sheets to size', 'straight cuts', 'stainless steel without surface damage'] }],
    ['slitovanje', 'coil', null, ['premotavanje-kotura', 'secenje-makazama', 'limovi'],
      { t: 'Podužno sečenje kotura (slitovanje)', sum: 'Traka iz kotura u željenoj širini, do 1260 mm ulazne širine.',
        desc: ['Slitovanje je za one koji rade sa koturom: umesto da kupujete traku fabričke širine, dobijate baš onu koja vam treba, pa nemate otpad po dužini.', 'Sliter seče lim do 1 mm iz kotura širine do 1260 mm, najviše 7 traka željene širine; kotur do 6 t, koturići po dogovoru.'],
        specs: [['Ulazna širina', 'do 1260 mm'], ['Debljina', 'do 1 mm'], ['Broj traka', 'do 7'], ['Kotur', 'do 6 t']], tags: ['do 1260 mm', 'ulazna širina'], apps: ['trake za profilisanje', 'olučne trake', 'serijska proizvodnja'] },
      { t: 'Longitudinal coil cutting (slitting)', sum: 'Strip from coil in the width you need, input coil width up to 1,260 mm.',
        desc: ['Slitting is for those who work from coil: instead of buying strip in the mill width, you get exactly the width you need, so there is no scrap along the length.', 'The slitter cuts sheet up to 1 mm from coils up to 1,260 mm wide, into up to 7 strips of the required width; coil up to 6 t, small coils by arrangement.'],
        specs: [['Input width', 'up to 1,260 mm'], ['Thickness', 'up to 1 mm'], ['Strips', 'up to 7'], ['Coil', 'up to 6 t']], tags: ['up to 1,260 mm', 'input width'], apps: ['strip for roll forming', 'gutter strip', 'series production'] }],
    ['premotavanje-kotura', 'coil', null, ['slitovanje', 'limovi'],
      { t: 'Premotavanje limova u koturu', sum: 'Prepakivanje i priprema kotura za dalju obradu ili transport.',
        desc: ['Prepakivanje za dalju obradu, transport ili manje serije. Odmotač–namotač radi lim do 1,2 mm i širine do 1260 mm, uz kontrolu dužine.', 'Kotur do 6 t, fabrički otvor 500–600 mm; premotani otvor 490–600 mm. Uslove dogovaramo uz ponudu.'],
        specs: [['Debljina', 'do 1,2 mm'], ['Širina', 'do 1260 mm'], ['Kotur', 'do 6 t'], ['Otvor', '490–600 mm']], tags: ['kotur', 'transport'], apps: ['manje serije', 'transport', 'priprema za obradu'] },
      { t: 'Recoiling of sheet coils', sum: 'Repacking and preparing coils for further processing or transport.',
        desc: ['Repacking for further processing, transport or smaller batches. The decoiler–recoiler handles sheet up to 1.2 mm and up to 1,260 mm wide, with length control.', 'Coil up to 6 t, mill inner diameter 500–600 mm; rewound inner diameter 490–600 mm. Terms are agreed with the quote.'],
        specs: [['Thickness', 'up to 1.2 mm'], ['Width', 'up to 1,260 mm'], ['Coil', 'up to 6 t'], ['Inner diameter', '490–600 mm']], tags: ['coil', 'transport'], apps: ['smaller batches', 'transport', 'preparation for processing'] }],
    ['savijanje-limova', 'flashing-set', null, ['gradjevinska-limarija', 'probijanje-i-isecanje-uglova', 'lucno-savijanje'],
      { t: 'Savijanje i oblikovanje limova', sum: 'NC presa 3 m i apkant presa 8,2 m — opšivke i profili u jednom prolazu.',
        desc: ['Dužina prese je ono što se u praksi najviše oseti: opšivka, okapnica ili slemena od preko osam metara izlazi iz jednog prolaza, bez poprečnog spoja koji kasnije propušta ili se vidi.', 'NC hidraulična presa 200 t savija čelik do 10 mm (inox do 7 mm) na dužini do 3100 mm; rundovanje radi cilindre, konuse i kape za dimnjake (do 0,8 mm Ø80–Ø800, do 4 mm najmanji prečnik 190 mm).'],
        specs: [['Apkant presa', '8,2 m (do 0,8 mm); ravan lim do 4 mm na 8 m'], ['NC presa 200 t', 'čelik 10 mm, inox 7 mm, 3100 mm'], ['Rundovanje', 'Ø80–Ø800 (do 0,8 mm)'], ['Apoling 2 m', 'do 1,5 mm']], tags: ['NC presa 3 m', 'apkant presa 8,2 m'], apps: ['opšivke, okapnice, slemena', 'hladno oblikovani profili', 'cilindri i konusi'] },
      { t: 'Sheet bending and forming', sum: '3 m NC press brake and 8.2 m press brake — flashings and profiles in a single pass.',
        desc: ['In practice, the length of the press is what makes the biggest difference: a flashing, eaves drip flashing or ridge cap over eight metres long comes out of a single pass, with no transverse joint that later leaks or shows.', 'The 200 t NC hydraulic press brake bends steel up to 10 mm (stainless up to 7 mm) over lengths up to 3,100 mm; plate rolling makes cylinders, cones and chimney caps (up to 0.8 mm Ø80–Ø800, up to 4 mm minimum diameter 190 mm).'],
        specs: [['Press brake', '8.2 m (up to 0.8 mm); flat sheet up to 4 mm over 8 m'], ['NC press brake 200 t', 'steel 10 mm, stainless 7 mm, 3,100 mm'], ['Plate rolling', 'Ø80–Ø800 (up to 0.8 mm)'], ['Folding machine 2 m', 'up to 1.5 mm']], tags: ['3 m NC press brake', '8.2 m press brake'], apps: ['flashings, eaves drips, ridge caps', 'cold-formed sections', 'cylinders and cones'] }],
    ['lucno-savijanje', 'tubes', null, ['okrugle-cevi', 'kvadratne-i-pravougaone-cevi', 'ispravljanje-flahova'],
      { t: 'Lučno savijanje cevi i flahova', sum: 'Kružno i lučno oblikovanje cevi i flahova za zaobljene elemente i ograde.',
        desc: ['Kružno i lučno oblikovanje cevi i flahova za zaobljene elemente, ograde i kapije.', 'Mašina savija okrugle cevi 1/2"–2", kvadratne do 50×50 mm i pravougaone do 40×60 mm, sa zidom 2–3 mm.'],
        specs: [['Okrugle cevi', '1/2"–2"'], ['Kvadratne', 'do 50×50 mm'], ['Pravougaone', 'do 40×60 mm'], ['Zid', '2–3 mm']], tags: ['cevi', 'flahovi'], apps: ['ograde', 'lučni elementi', 'kapije'] },
      { t: 'Arc bending of tubes and flat bars', sum: 'Circular and arc forming of tubes and flat bars for curved elements and railings.',
        desc: ['Circular and arc forming of tubes and flat bars for curved elements, railings and gates.', 'The machine bends round tubes 1/2"–2", square up to 50×50 mm and rectangular up to 40×60 mm, with a 2–3 mm wall.'],
        specs: [['Round tubes', '1/2"–2"'], ['Square', 'up to 50×50 mm'], ['Rectangular', 'up to 40×60 mm'], ['Wall', '2–3 mm']], tags: ['tubes', 'flat bars'], apps: ['railings', 'curved elements', 'gates'] }],
    ['ispravljanje-flahova', 'sections', null, ['lucno-savijanje', 'grifovanje', 'celicni-profili'],
      { t: 'Ispravljanje i peglanje flahova', sum: 'Ravnanje i peglanje pljosnatih profila pre dalje obrade ili ugradnje.',
        desc: ['Ravnanje i peglanje pljosnatih profila pre dalje obrade ili ugradnje.', 'Mašina za ispravljanje (peglanje) flahova radi do 10 mm, sa obaranjem ivica.'],
        specs: [['Debljina flaha', 'do 10 mm'], ['Dorada', 'obaranje ivica']], tags: ['flah', 'peglanje'], apps: ['priprema za obradu', 'kovane ograde', 'konstrukcije'] },
      { t: 'Straightening and flattening of flat bars', sum: 'Straightening and flattening of flat sections before further processing or installation.',
        desc: ['Straightening and flattening of flat sections before further processing or installation.', 'The flat bar straightening machine handles up to 10 mm, with edge chamfering.'],
        specs: [['Flat bar thickness', 'up to 10 mm'], ['Finishing', 'edge chamfering']], tags: ['flat bar', 'flattening'], apps: ['preparation for processing', 'wrought-iron fences', 'structures'] }],
    ['izrada-trapeznog-lima', 'tr35', 'tr20', ['trapezni-lim', 'tr-35-270', 'imitacija-crepa'],
      { t: 'Izrada trapeznog pokrivnog lima', sum: 'Pet TR profila, dužina po meri objekta — bez poprečnih spojeva.',
        desc: ['Profilirke rade iz kotura, pa dužinu diktira vaš objekat — krov ili fasada bez poprečnih preklopa. Profilišemo TR 10 – TR 60 i imitaciju crepa (novi model od 2020).', 'Trapezni lim do 2,5 m (rebro 15/10/15) radimo i na hidrauličnoj presi, do 1 mm (aluminijum i bakar do 1,5 mm), sa brojem rebara po želji.'],
        specs: [['Profili', 'TR 10 – TR 60'], ['Dužina', 'po meri objekta'], ['Presa do 2,5 m', 'rebro 15/10/15'], ['Imitacija crepa', 'novi model od 2020']], tags: ['pet TR profila', 'po meri objekta'], apps: ['krovovi', 'fasade', 'nadstrešnice'] },
      { t: 'Trapezoidal profiled sheet production', sum: 'Five TR profiles, length to suit the building — no transverse joints.',
        desc: ['The roll formers work from coil, so the length is set by your building — a roof or façade with no transverse laps. We roll-form TR 10 – TR 60 and tile-effect roofing sheet (new model since 2020).', 'Trapezoidal sheet up to 2.5 m (rib 15/10/15) is also made on a hydraulic press, up to 1 mm (aluminium and copper up to 1.5 mm), with any number of ribs.'],
        specs: [['Profiles', 'TR 10 – TR 60'], ['Length', 'to suit the building'], ['Press up to 2.5 m', 'rib 15/10/15'], ['Tile-effect sheet', 'new model since 2020']], tags: ['five TR profiles', 'to suit the building'], apps: ['roofs', 'façades', 'canopies'] }],
    ['izrada-oluka', 'gutter-halfround', null, ['oluci-i-vertikale', 'gradjevinska-limarija'],
      { t: 'Izrada oluka i vertikala', sum: 'Poluokrugli i četvrtasti oluci, okrugle i četvrtaste vertikale, dužina po želji.',
        desc: ['Poluokrugle oluke RŠ 333 i vertikale Ø100 profilišemo na automatizovanim pokretnim linijama u neograničenoj dužini; ostale formate i materijale do dužina iz tabele.', 'Uz oluke izrađujemo i kompletan pribor u istom limu i boji kao pokrivač.'],
        specs: [['Oluk RŠ 333', 'neograničena dužina'], ['Vertikala Ø100', 'neograničena dužina'], ['Linije', 'automatizovane, pokretne']], tags: ['poluokrugli', 'četvrtasti'], apps: ['stambeni objekti', 'hale', 'rekonstrukcije'] },
      { t: 'Gutter and downpipe production', sum: 'Half-round and box gutters, round and square downpipes, any length you need.',
        desc: ['We roll-form half-round gutters with a 333 mm developed width and Ø100 downpipes on automated mobile lines in unlimited lengths; other formats and materials up to the lengths in the table.', 'We also make the full set of accessories in the same sheet and colour as the roof covering.'],
        specs: [['Gutter 333 mm', 'unlimited length'], ['Downpipe Ø100', 'unlimited length'], ['Lines', 'automated, mobile']], tags: ['half-round', 'box'], apps: ['residential buildings', 'production halls', 'refurbishment'] }],
    ['profilisanje-parapeta-i-lamperije', 'tr10', null, ['parapetni-lim', 'lamperija', 'kanali-za-ventilaciju'],
      { t: 'Profilisanje parapetnog lima i lamperije', sum: 'Fasadni i unutrašnji profili sa sopstvenih profilirki.',
        desc: ['Parapetni lim profilišemo u tri profila (PR 83/34, 38/15, 71/10), a lamperiju u standardnoj dužini 2,5 m — po narudžbini i u drugim dužinama.', 'Na sopstvenoj mašini radimo i kanale za ventilaciju i fazonske komade, po specifikaciji.'],
        specs: [['Parapet', 'PR 83/34, 38/15, 71/10'], ['Lamperija', '2,5 m (i druge dužine)'], ['Kanali', 'po specifikaciji']], tags: ['fasadni', 'unutrašnji'], apps: ['fasade', 'plafoni', 'ventilacija'] },
      { t: 'Roll forming of parapet lining sheet and metal cladding panels', sum: 'Façade and interior profiles from our own roll formers.',
        desc: ['We roll-form parapet sheet in three profiles (PR 83/34, 38/15, 71/10) and cladding panels in a standard 2.5 m length — other lengths also to order.', 'Our own machine also makes ventilation ducts and fittings, to specification.'],
        specs: [['Parapet', 'PR 83/34, 38/15, 71/10'], ['Cladding panels', '2.5 m (other lengths too)'], ['Ducts', 'to specification']], tags: ['façade', 'interior'], apps: ['façades', 'ceilings', 'ventilation'] }],
    ['probijanje-i-isecanje-uglova', 'plasma-plate', null, ['savijanje-limova', 'secenje-makazama'],
      { t: 'Probijanje i isecanje uglova', sum: 'Prese za otvore, rupe i pripremu spojeva pre savijanja.',
        desc: ['Otvori i priprema spojeva pre savijanja, po radnom nalogu.', 'Presa za isecanje uglova radi čelični lim do 4 mm pod uglom 30°–140°; Iron Worker je kombinovana mašina za probijanje, deformaciju, isecanje uglova i sečenje lima i profila.'],
        specs: [['Isecanje uglova', 'lim do 4 mm, 30°–140°'], ['Iron Worker', 'probijanje i deformacija'], ['Izrada', 'po nalogu']], tags: ['otvori', 'pre savijanja'], apps: ['priprema za savijanje', 'kutije i maske', 'konstrukcije'] },
      { t: 'Punching and corner notching', sum: 'Presses for openings, holes and joint preparation before bending.',
        desc: ['Openings and joint preparation before bending, per work order.', 'The corner notching press handles steel sheet up to 4 mm at angles of 30°–140°; the Iron Worker is a combination machine for punching, forming, corner notching and cutting sheet and sections.'],
        specs: [['Corner notching', 'sheet up to 4 mm, 30°–140°'], ['Iron Worker', 'punching and forming'], ['Production', 'per work order']], tags: ['openings', 'before bending'], apps: ['preparation for bending', 'boxes and covers', 'structures'] }],
    ['secenje-profila', 'sections', null, ['grifovanje', 'celicni-profili', 'cevi-i-zp-profili'],
      { t: 'Sečenje čeličnih profila', sum: 'Trakaste testere za flah, ugaonike, U i I profile, cevi i pune profile.',
        desc: ['Trakastim testerama sečemo flah, ugaonike, U i I profile, cevi i pune profile na dužinu koju tražite — pa ne plaćate ostatak šipke koji vam ne treba.', 'Trakasta testera seče pod uglom do 60°, pojedinačno ili u snopu, uz hlađenje emulzijom (motor 1,3/1,5 kW, brzina reza 38/76 m/min, list 3090×27×0,9 mm).'],
        specs: [['Ugao reza', 'do 60°'], ['Način', 'pojedinačno ili u snopu'], ['Brzina reza', '38/76 m/min'], ['List', '3090×27×0,9 mm']], tags: ['trakasta testera', 'U i I profili'], apps: ['metalne konstrukcije', 'ograde i kapije'] },
      { t: 'Cutting steel sections', sum: 'Band saws for flat bar, angles, channels, I-sections, tubes and solid bars.',
        desc: ['On band saws we cut flat bar, angles, channels, I-sections, tubes and solid bars to the length you ask for — so you do not pay for the rest of the bar that you do not need.', 'The band saw cuts at angles up to 60°, singly or in bundles, with emulsion cooling (motor 1.3/1.5 kW, cutting speed 38/76 m/min, blade 3,090×27×0.9 mm).'],
        specs: [['Cutting angle', 'up to 60°'], ['Mode', 'single or bundle'], ['Cutting speed', '38/76 m/min'], ['Blade', '3,090×27×0.9 mm']], tags: ['band saw', 'channels, I-sections'], apps: ['steel structures', 'fences and gates'] }],
    ['grifovanje', 'sections', null, ['secenje-profila', 'ispravljanje-flahova', 'celicni-profili'],
      { t: 'Grifovanje šipkastih profila', sum: 'Dekorativna tekstura na flahu i kvadratnom profilu za kovane elemente.',
        desc: ['Grifovanje je dekorativna tekstura koja se utiskuje po dužini šipkastog profila. Koristi se za kovane ograde, kapije i ogradne elemente gde se traži izgled ručno kovanog gvožđa.', 'Grifujemo flah, firkant i kutijaste profile svih komercijalnih dimenzija, uz graviranje (šaranje) flaha. Držimo i gotov grifovani flah i grifovane cevi na lageru.'],
        specs: [['Profili', 'flah, firkant, kutijasti'], ['Dimenzije', 'sve komercijalne'], ['Dodatno', 'graviranje flaha'], ['Lager', 'grifovani flah i cevi']], tags: ['flah', 'kvadratni profil'], apps: ['kovane ograde', 'kapije', 'ogradni elementi'] },
      { t: 'Embossing of bar sections', sum: 'Decorative texture on flat bar and square bar for wrought-iron elements.',
        desc: ['Embossing is a decorative texture pressed along the length of a bar section. It is used for wrought-iron railings, gates and fence elements where the look of hand-forged iron is wanted.', 'We emboss flat bar, square bar and box sections in all commercial sizes, and engrave patterns on flat bar. We also keep ready-made embossed flat bar and embossed tubes in stock.'],
        specs: [['Sections', 'flat bar, square bar, box sections'], ['Sizes', 'all commercial'], ['Extra', 'engraved patterns on flat bar'], ['Stock', 'embossed flat bar and tubes']], tags: ['flat bar', 'square bar'], apps: ['wrought-iron fences', 'gates', 'fence elements'] }]
  ];
  SVC.forEach(function (r) {
    var it = { slug: r[0], kind: 'service', cat: 'usluge', img: r[1], rel: r[3], sr: r[4], en: r[5] };
    if (r[2]) { it.calc = r[2]; it.calcTabs = 'trapez'; }
    ITEMS.push(it);
  });

  ITEMS.push(
  /* ---------------------------------------------------------------- MOGUĆNOSTI (plazma.html) */
  { slug: 'radni-sto', kind: 'capability', cat: 'plazma', img: 'plasma-plate', rel: ['secenje-cnc-plazma', 'ponovljivost', 'gasno-rezanje'],
    sr: { t: 'Radni sto 2,5 × 8 m', sum: 'Ugnježdavanje više delova iz jedne table.',
      desc: ['Radni sto CNC plazme je 2,5 × 8 m, pa ostavlja prostora da se iz jedne table izvuče više komada. Raspored delova po tabli (ugnježdavanje) obično se dogovara pri prijemu specifikacije.', 'Po pravilu, cela specifikacija poslata odjednom daje manje otpada nego naručivanje komad po komad, a razlika u ceni po delu ume da bude značajna.'],
      specs: [['Dimenzije stola', '2,5 × 8 m'], ['Plazma', 'do 30 mm'], ['Gasno', 'do 150 mm'], ['Raspored', 'ugnježdavanje po specifikaciji']], tags: ['2,5 × 8 m', 'ugnježdavanje'], apps: ['veće serije', 'veliki delovi', 'manje otpada'] },
    en: { t: 'Cutting table 2.5 × 8 m', sum: 'Nesting several parts from one sheet.',
      desc: ['The CNC plasma cutting table is 2.5 × 8 m, which leaves room to get more parts out of one sheet. The layout of parts on the sheet (nesting) is usually agreed when we receive the specification.', 'As a rule, a full specification sent at once produces less scrap than ordering part by part, and the difference in price per part can be significant.'],
      specs: [['Table size', '2.5 × 8 m'], ['Plasma', 'up to 30 mm'], ['Oxy-fuel', 'up to 150 mm'], ['Layout', 'nesting per specification']], tags: ['2.5 × 8 m', 'nesting'], apps: ['larger series', 'large parts', 'less scrap'] } },
  { slug: 'ponovljivost', kind: 'capability', cat: 'plazma', img: 'plasma-plate', rel: ['secenje-cnc-plazma', 'radni-sto'],
    sr: { t: 'Ponovljivost', sum: 'Isti program — isti deo, od prvog do poslednjeg komada.',
      desc: ['Pošto se glava kreće po programu, a ne po ruci operatera, oblik reza je tačno onaj sa nacrta — od prvog do poslednjeg komada u seriji.', 'Plazma ostavlja usku zonu toplotnog uticaja i blagi kosi rez; ako vam treba ivica bez ikakve dorade, recite unapred — za ravne rezove su makaze po pravilu bolji i jeftiniji izbor.'],
      specs: [['Upravljanje', 'CNC program'], ['Serija', 'od jednog komada do serije'], ['Nacrt', 'DXF / DWG direktno u program']], tags: ['CNC program'], apps: ['serijski delovi', 'ponovljene narudžbine', 'složene konture'] },
    en: { t: 'Repeatability', sum: 'Same program — same part, from the first piece to the last.',
      desc: ['Because the torch follows a program, not the operator\'s hand, the shape of the cut is exactly the one on the drawing — from the first to the last piece in the series.', 'Plasma leaves a narrow heat-affected zone and a slight bevel on the cut; if you need an edge with no finishing at all, tell us in advance — for straight cuts the guillotine shear is, as a rule, the better and cheaper choice.'],
      specs: [['Control', 'CNC program'], ['Batch', 'from a single piece to a series'], ['Drawing', 'DXF / DWG straight into the program']], tags: ['CNC program'], apps: ['series parts', 'repeat orders', 'complex contours'] } }
  );

  /* ---------------------------------------------------------------- PRIPREMA NACRTA (plazma.html, samo modal) */
  [['dxf-dwg', 'DXF ili DWG', 'Najbolji format. Geometrija ide direktno u program mašine, bez precrtavanja i bez rizika od greške u prenosu mera.',
     'DXF or DWG', 'The best format. The geometry goes straight into the machine program, with no redrawing and no risk of errors when transferring dimensions.'],
   ['pdf-crtez', 'PDF ili tehnički crtež', 'Radimo i po PDF-u ili crtežu, ako su kote čitke i potpune. Napomenite razmeru ako crtež nije kotiran.',
     'PDF or technical drawing', 'We also work from a PDF or a drawing, if the dimensions are legible and complete. State the scale if the drawing is not dimensioned.'],
   ['skica-sa-kotama', 'Skica sa kotama', 'Skica rukom je dovoljna za jednostavne oblike. Važno je da su sve mere upisane i da je jasno šta je spolja, a šta otvor.',
     'Dimensioned sketch', 'A hand sketch is enough for simple shapes. What matters is that all dimensions are written in and that it is clear what is the outer contour and what is an opening.'],
   ['uzorak-ili-fotografija', 'Uzorak ili fotografija', 'Ako imate postojeći komad, donesite ga u Batajnicu. Snimićemo mere i napraviti nacrt za mašinu. Svaku fotografiju ili sliku oblika, uz određenu korekciju, prilagođavamo rezanju na plazmi — u granicama mogućnosti mašine.',
     'Sample or photo', 'If you have an existing part, bring it to Batajnica. We will measure it and make a drawing for the machine. With some correction, we adapt any photo or image of a shape for plasma cutting — within the limits of the machine.']
  ].forEach(function (r) {
    ITEMS.push({ slug: r[0], kind: 'info', cat: 'priprema', img: 'plasma-plate', rel: ['secenje-cnc-plazma', 'uz-nacrt-navedite'],
      sr: { t: r[1], sum: r[2], desc: [], specs: [], tags: ['priprema nacrta'] }, en: { t: r[3], sum: r[4], desc: [], specs: [], tags: ['drawing preparation'] } });
  });
  ITEMS.push({ slug: 'uz-nacrt-navedite', kind: 'info', cat: 'priprema', img: 'plasma-plate', rel: ['secenje-cnc-plazma', 'dxf-dwg'],
    sr: { t: 'Uz nacrt navedite', sum: 'Što je specifikacija kompletnija, to je ponuda tačnija i rok kraći.', desc: [],
      specs: [['Materijal', 'crni čelik, inox, bakar ili aluminijum'], ['Debljinu', 'u milimetrima'], ['Količinu', 'po pozicijama — od nje zavisi cena i raspored po tabli'], ['Materijal dajete vi?', 'ili ga uzimate od nas'], ['Toleranciju', 'ako je uža od uobičajene za plazmu'], ['Dalju obradu', 'ako deo ide na savijanje — zbog vlakana i mesta krivina']], tags: ['priprema nacrta'] },
    en: { t: 'With the drawing, state', sum: 'The more complete the specification, the more accurate the quote and the shorter the lead time.', desc: [],
      specs: [['Material', 'black steel, stainless steel, copper or aluminium'], ['Thickness', 'in millimetres'], ['Quantity', 'per item — price and sheet layout depend on it'], ['Supplying the material?', 'or buying it from us'], ['Tolerance', 'if tighter than usual for plasma'], ['Further processing', 'if the part will be bent — grain direction and bend positions']], tags: ['drawing preparation'] } });

  /* Ilustracije za stavke bez rendera (iste linije kao na početnoj, „Alati, okov i oprema“) */
  var ILLU = {
    alati: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g stroke="currentColor" stroke-opacity=".16" stroke-width="1"><path d="M0 150 H400 M133 0 V300 M266 0 V300"/></g><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="66" cy="76" r="30"/><circle cx="66" cy="76" r="8"/><path d="M90 56 L116 44 L116 108 L90 96"/><path d="M172 100 L172 62 L188 46 L216 46 L216 62 L200 62 L200 100 Z"/><path d="M186 46 L186 30 L202 30 L202 46"/><path d="M296 44 L340 44 L340 60 L326 60 L326 106 L310 106 L310 60 L296 60 Z"/><path d="M40 196 L96 196 L96 264 L40 264 Z M40 210 L96 210 M68 196 L68 264"/><circle cx="190" cy="230" r="30"/><path d="M190 200 L190 230 L212 244"/><path d="M296 200 L340 200 M296 216 L340 216 M296 232 L340 232 M296 248 L322 248"/></g></svg>'
  };

  /* @@MEDIA-START — generiše _tools/items/extract-media.py; ne menjati ručno */
  var MEDIA = [
    {"slug":"ref-rad-na-visini","kind":"reference","cat":"reference","sr":{"t":"Rad na visini","sum":"Limarska galanterija i spusne vertikale na Kliničkom centru Srbije, na visini preko 30 m. Na stambenim objektima u Beogradu, silosima i šećeranama — preko 50 m.","meta":""},"en":{"t":"Working at height","sum":"Sheet-metal roofing accessories and downpipes at the University Clinical Centre of Serbia, at a height of over 30 m. On residential buildings in Belgrade, silos and sugar factories — over 50 m.","meta":""},"photo":{"src":"assets/tricom-1.jpg","w":1672,"h":941}},
    {"slug":"ref-velike-kolicine","kind":"reference","cat":"reference","sr":{"t":"Velike količine","sum":"Kompletni krovopokrivački i limarski radovi od bakarnog lima na Rezidenciji predsednika republike u Karađorđevu — preko 30 tona bakra.","meta":""},"en":{"t":"Large quantities","sum":"Complete roofing and sheet-metal work in copper sheet at the Residence of the President of the Republic in Karađorđevo — over 30 tonnes of copper.","meta":""},"img":"sheet-stack"},
    {"slug":"ref-slozeni-detalji","kind":"reference","cat":"reference","sr":{"t":"Složeni detalji","sum":"Bakarni krovovi predsedničke rezidencije u Beogradu, više desetina vila na Dedinju u diplomatskoj upotrebi, pozorište KPGT u staroj šećerani, mlinovi, poslovne zgrade i proizvodne hale.","meta":""},"en":{"t":"Complex details","sum":"Copper roofs of the presidential residence in Belgrade, dozens of villas in Dedinje used by diplomatic missions, the KPGT theatre in the old sugar factory, mills, office buildings and production halls.","meta":""},"img":"flashing-set"},
    {"slug":"ref-krovopokrivacki-i-olucni-elementi","kind":"reference","cat":"reference","sr":{"t":"Krovopokrivački i olučni elementi","sum":"Beskonačni oluci, vetar lajsne, pokrivne table (pocinkovane, bakarne), pomoćna konstrukcija, limarska galanterija, kompletni pokrivači i opšivke za stambene, poslovne i rezidencijalne objekte — kao podizvođač i za izvođačku firmu Ganex Krečković na rekonstrukciji pijace Zeleni venac.","meta":""},"en":{"t":"Roofing and gutter elements","sum":"Seamless gutters, verge flashings, roofing sheets (galvanised, copper), substructure, sheet-metal roofing accessories, complete roof coverings and flashings for residential, commercial and prestige residential buildings — as a subcontractor, and for the contractor Ganex Krečković on the reconstruction of the Zeleni Venac market.","meta":""}},
    {"slug":"ref-proizvodi-od-limenih-tabli","kind":"reference","cat":"reference","sr":{"t":"Proizvodi od limenih tabli","sum":"Reklamni panoi, maske za nadstrešnice i fasade (benzinske pumpe, poslovni objekti) i limovi za enterijer — natprozorne limene maske za ceo PC Ušće.","meta":""},"en":{"t":"Products made from sheet","sum":"Advertising panels, cover panels for canopies and façades (petrol stations, commercial buildings) and sheet for interiors — sheet-metal window-head cover panels for the whole Ušće Business Centre.","meta":""}},
    {"slug":"ref-metalne-konstrukcije","kind":"reference","cat":"reference","sr":{"t":"Metalne konstrukcije","sum":"Noseće rešetke, stubovi od čeličnih profila i druge metalne konstrukcije po projektu izvođača.","meta":""},"en":{"t":"Metal structures","sum":"Load-bearing trusses, columns made of steel sections and other metal structures to the contractor’s design.","meta":""}},
    {"slug":"ref-rezidencija-predsednika-republike-karadjordjevo","kind":"reference","cat":"reference","sr":{"t":"Rezidencija predsednika republike, Karađorđevo","sum":"Kompletni krovopokrivački radovi na rezidencijalnom predsedničkom kompleksu — obrada lima za pokrivanje, proizvodnja svih pratećih elemenata ekskluzivnog bakarnog krova i ugradnja.","meta":"32 t BAKRA · 48 DANA"},"en":{"t":"Residence of the President of the Republic, Karađorđevo","sum":"Complete roofing work on the presidential residential complex — processing of the roofing sheet, manufacture of all accompanying elements of an exclusive copper roof, and installation.","meta":"32 t OF COPPER · 48 DAYS"}},
    {"slug":"ref-predsednicka-rezidencija-beograd","kind":"reference","cat":"reference","sr":{"t":"Predsednička rezidencija, Beograd","sum":"TRICOM limarija i metalni elementi.","meta":"BAKAR · LIMARIJA"},"en":{"t":"Presidential Residence, Belgrade","sum":"TRICOM sheet-metal work and metal elements.","meta":"COPPER · SHEET-METAL WORK"}},
    {"slug":"ref-vile-na-dedinju","kind":"reference","cat":"reference","sr":{"t":"Vile na Dedinju","sum":"Više desetina vila koje koriste diplomatsko-konzularna predstavništva — bakarni krovovi i komplikovani limarski detalji.","meta":"DIPLOMATSKI OBJEKTI"},"en":{"t":"Villas in Dedinje","sum":"Dozens of villas used by diplomatic and consular missions — copper roofs and intricate sheet-metal details.","meta":"DIPLOMATIC BUILDINGS"}},
    {"slug":"ref-beograd-na-vodi","kind":"reference","cat":"reference","sr":{"t":"Beograd na vodi","sum":"Isporuka elemenata za fasadu i krov na objektima kompleksa.","meta":"STAMBENO-POSLOVNI"},"en":{"t":"Belgrade Waterfront","sum":"Supply of façade and roof elements for buildings in the complex.","meta":"RESIDENTIAL AND COMMERCIAL"}},
    {"slug":"ref-poslovni-centar-usce","kind":"reference","cat":"reference","sr":{"t":"Poslovni centar Ušće","sum":"Isporuka za ugradnju plastificiranih nadprozorskih maski i delova enterijera za ceo PC Ušće.","meta":"POSLOVNI OBJEKAT"},"en":{"t":"Ušće Business Centre","sum":"Supply of pre-painted window-head cover panels and interior parts for installation throughout the Ušće Business Centre.","meta":"OFFICE BUILDING"}},
    {"slug":"ref-pijaca-zeleni-venac-beograd","kind":"reference","cat":"reference","sr":{"t":"Pijaca Zeleni venac, Beograd","sum":"Isporuka elemenata za rekonstrukciju tržnice, za Ganex Krečković.","meta":"ZA GANEX KREČKOVIĆ"},"en":{"t":"Zeleni Venac market, Belgrade","sum":"Supply of elements for the reconstruction of the market hall, for Ganex Krečković.","meta":"FOR GANEX KREČKOVIĆ"}},
    {"slug":"ref-klinicki-centar-srbije","kind":"reference","cat":"reference","sr":{"t":"Klinički centar Srbije","sum":"Limarska galanterija i spusne vertikale, uz rad na visini preko 30 metara.","meta":"RAD NA VISINI +30 m"},"en":{"t":"University Clinical Centre of Serbia","sum":"Sheet-metal roofing accessories and downpipes, with work at a height of over 30 metres.","meta":"WORK AT HEIGHT +30 m"}},
    {"slug":"ref-pupinova-palata-novi-sad","kind":"reference","cat":"reference","sr":{"t":"Pupinova palata, Novi Sad","sum":"Isporuka limarskih i metalnih elemenata za javni objekat u Novom Sadu.","meta":"JAVNI OBJEKAT"},"en":{"t":"Pupin Palace, Novi Sad","sum":"Supply of sheet-metal and metal elements for a public building in Novi Sad.","meta":"PUBLIC BUILDING"}},
    {"slug":"ref-pozoriste-kpgt-stara-secerana","kind":"reference","cat":"reference","sr":{"t":"Pozorište KPGT, stara šećerana","sum":"Radovi na adaptaciji stare šećerane u pozorišni prostor.","meta":"ADAPTACIJA"},"en":{"t":"KPGT Theatre, old sugar factory","sum":"Work on converting the old sugar factory into a theatre space.","meta":"CONVERSION"}},
    {"slug":"ref-lidl-objekti-u-srbiji","kind":"reference","cat":"reference","sr":{"t":"LIDL — objekti u Srbiji","sum":"TRICOM limarija i metalni elementi.","meta":"MALOPRODAJA"},"en":{"t":"LIDL — stores in Serbia","sum":"TRICOM sheet-metal work and metal elements.","meta":"RETAIL"}},
    {"slug":"ref-idea-maloprodajni-objekti","kind":"reference","cat":"reference","sr":{"t":"IDEA — maloprodajni objekti","sum":"TRICOM limarija i metalni elementi.","meta":"MALOPRODAJA"},"en":{"t":"IDEA — retail stores","sum":"TRICOM sheet-metal work and metal elements.","meta":"RETAIL"}},
    {"slug":"ref-continental-subotica","kind":"reference","cat":"reference","sr":{"t":"Continental, Subotica","sum":"Fabrika guma — isporuka elemenata konstrukcija, enterijera i oblaganja fasadnih i pokrivnih površina.","meta":"PROIZVODNA HALA"},"en":{"t":"Continental, Subotica","sum":"Tyre factory — supply of elements for structures, interiors and façade and roof cladding.","meta":"PRODUCTION HALL"}},
    {"slug":"ref-zf-pancevo","kind":"reference","cat":"reference","sr":{"t":"ZF, Pančevo","sum":"Fabrika autodelova — isporuka elemenata konstrukcija, enterijera i oblaganja fasadnih i pokrivnih površina.","meta":"PROIZVODNA HALA"},"en":{"t":"ZF, Pančevo","sum":"Automotive parts factory — supply of elements for structures, interiors and façade and roof cladding.","meta":"PRODUCTION HALL"}},
    {"slug":"ref-geze-zrenjanin","kind":"reference","cat":"reference","sr":{"t":"GEZE, Zrenjanin","sum":"Fabrika sistema za vrata i prozore — isporuka elemenata za fasadne i pokrivne površine.","meta":"PROIZVODNA HALA"},"en":{"t":"GEZE, Zrenjanin","sum":"Door and window systems factory — supply of elements for façades and roofs.","meta":"PRODUCTION HALL"}},
    {"slug":"ref-mitas-ruma","kind":"reference","cat":"reference","sr":{"t":"MITAS, Ruma","sum":"Proizvodnja pneumatika — isporuka limarskih i metalnih elemenata.","meta":"PROIZVODNA HALA"},"en":{"t":"MITAS, Ruma","sum":"Tyre manufacturing — supply of sheet-metal and metal elements.","meta":"PRODUCTION HALL"}},
    {"slug":"ref-mei-ta-obrenovac","kind":"reference","cat":"reference","sr":{"t":"MEI TA, Obrenovac","sum":"Proizvodnja automobilskih delova — isporuka limarskih i metalnih elemenata.","meta":"PROIZVODNA HALA"},"en":{"t":"MEI TA, Obrenovac","sum":"Automotive parts manufacturing — supply of sheet-metal and metal elements.","meta":"PRODUCTION HALL"}},
    {"slug":"ref-boysen-subotica","kind":"reference","cat":"reference","sr":{"t":"BOYSEN, Subotica","sum":"Proizvodnja izduvnih sistema za automobilsku industriju — isporuka limarskih i metalnih elemenata.","meta":"PROIZVODNA HALA"},"en":{"t":"BOYSEN, Subotica","sum":"Exhaust systems for the automotive industry — supply of sheet-metal and metal elements.","meta":"PRODUCTION HALL"}},
    {"slug":"ref-nelt-dobanovci","kind":"reference","cat":"reference","sr":{"t":"NELT, Dobanovci","sum":"Logističke usluge — isporuka limarskih i metalnih elemenata na logističkom kompleksu.","meta":"LOGISTIKA"},"en":{"t":"NELT, Dobanovci","sum":"Logistics services — supply of sheet-metal and metal elements for the logistics complex.","meta":"LOGISTICS"}},
    {"slug":"ref-kuehne-nagel-dobanovci","kind":"reference","cat":"reference","sr":{"t":"Kuehne + Nagel, Dobanovci","sum":"Međunarodni transport robe — isporuka limarskih i metalnih elemenata.","meta":"LOGISTIKA"},"en":{"t":"Kuehne + Nagel, Dobanovci","sum":"International freight transport — supply of sheet-metal and metal elements.","meta":"LOGISTICS"}},
    {"slug":"ref-ipb-simanovci","kind":"reference","cat":"reference","sr":{"t":"IPB, Šimanovci","sum":"Industrijski park — isporuka limarskih i metalnih elemenata.","meta":"LOGISTIKA"},"en":{"t":"IPB, Šimanovci","sum":"Industrial park — supply of sheet-metal and metal elements.","meta":"LOGISTICS"}},
    {"slug":"ref-sport-vision-simanovci","kind":"reference","cat":"reference","sr":{"t":"Sport Vision, Šimanovci","sum":"Isporuka limarskih i metalnih elemenata na logističko-poslovnom objektu.","meta":"LOGISTIKA"},"en":{"t":"Sport Vision, Šimanovci","sum":"Supply of sheet-metal and metal elements for a logistics and office building.","meta":"LOGISTICS"}},
    {"slug":"ref-terra-indjija","kind":"reference","cat":"reference","sr":{"t":"TERRA, Inđija","sum":"Uslužna punionica — limarski elementi na proizvodno-skladišnom objektu.","meta":"INDUSTRIJA"},"en":{"t":"TERRA, Inđija","sum":"Contract filling plant — sheet-metal elements on a production and warehouse building.","meta":"INDUSTRY"}},
    {"slug":"ref-gomex-zrenjanin","kind":"reference","cat":"reference","sr":{"t":"Gomex, Zrenjanin","sum":"Gomex marketi — limarija na maloprodajnim i skladišnim objektima.","meta":"MALOPRODAJA"},"en":{"t":"Gomex, Zrenjanin","sum":"Gomex supermarkets — sheet-metal work on retail and warehouse buildings.","meta":"RETAIL"}},
    {"slug":"ref-savacoop-novi-sad","kind":"reference","cat":"reference","sr":{"t":"SAVACOOP, Novi Sad","sum":"Uvoz i distribucija sredstava za zaštitu bilja — krovni i fasadni limarski program.","meta":"INDUSTRIJA"},"en":{"t":"SAVACOOP, Novi Sad","sum":"Import and distribution of plant protection products — roof and façade sheet-metal range.","meta":"INDUSTRY"}},
    {"slug":"ref-brze-pruge-srbije","kind":"reference","cat":"reference","sr":{"t":"Brze pruge Srbije","sum":"Metalni i limarski elementi na infrastrukturnim objektima.","meta":"INFRASTRUKTURA"},"en":{"t":"Brze pruge Srbije (Serbian high-speed rail)","sum":"Metal and sheet-metal elements on infrastructure facilities.","meta":"INFRASTRUCTURE"}},
    {"slug":"ref-knez-petrol","kind":"reference","cat":"reference","sr":{"t":"Knez Petrol","sum":"Limarija i metalni elementi na mreži objekata.","meta":"MREŽA OBJEKATA"},"en":{"t":"Knez Petrol","sum":"Sheet-metal work and metal elements across its network of sites.","meta":"NETWORK OF SITES"}},
    {"slug":"ref-kuca-velikog-brata","kind":"reference","cat":"reference","sr":{"t":"„Kuća Velikog brata“","sum":"Izrada i isporuka delova konstrukcije i delova enterijera objekta za montažu.","meta":"TV OBJEKAT"},"en":{"t":"“Big Brother House”","sum":"Fabrication and supply of structural and interior parts of the building for assembly.","meta":"TV BUILDING"}},
    {"slug":"ref-knez-agrar","kind":"reference","cat":"reference","sr":{"t":"Knez Agrar","sum":"Isporuka limarskih i metalnih elemenata, uz objekte Knez Petrola.","meta":"MREŽA OBJEKATA"},"en":{"t":"Knez Agrar","sum":"Supply of sheet-metal and metal elements, alongside the Knez Petrol sites.","meta":"NETWORK OF SITES"}},
    {"slug":"ref-qvattro-company","kind":"reference","cat":"reference","sr":{"t":"Qvattro company","sum":"Trgovinsko preduzeće — isporuka limarskih i metalnih elemenata.","meta":"TRGOVINA"},"en":{"t":"Qvattro company","sum":"Trading company — supply of sheet-metal and metal elements.","meta":"TRADE"}},
    {"slug":"ref-stambene-zgrade-gelenderi-i-ograde","kind":"reference","cat":"reference","sr":{"t":"Stambene zgrade, gelenderi i ograde","sum":"Zgrade za stanovanje, gelenderi i ograde za terase, proizvodni objekti i tržni centri — elementi za izvođače.","meta":"STAMBENI OBJEKTI"},"en":{"t":"Residential buildings, railings and fences","sum":"Residential buildings, railings and fences for terraces, production buildings and shopping centres — elements for contractors.","meta":"RESIDENTIAL BUILDINGS"}},
    {"slug":"ref-silosi-i-secerane","kind":"reference","cat":"reference","sr":{"t":"Silosi i šećerane","sum":"Limarska galanterija i spusne vertikale, uz rad na visini preko 50 metara.","meta":"RAD NA VISINI +50 m"},"en":{"t":"Silos and sugar factories","sum":"Sheet-metal roofing accessories and downpipes, with work at a height of over 50 metres.","meta":"WORK AT HEIGHT +50 m"}},
    {"slug":"ref-mlinovi-i-prehrambena-industrija","kind":"reference","cat":"reference","sr":{"t":"Mlinovi i prehrambena industrija","sum":"Komplikovani limarski radovi na proizvodnim objektima prehrambene industrije.","meta":"INDUSTRIJA"},"en":{"t":"Mills and food industry","sum":"Intricate sheet-metal work on food-industry production buildings.","meta":"INDUSTRY"}},
    {"slug":"g-01","kind":"gallery","cat":"pogon","fig":"01","sr":{"t":"Proizvodna hala i centralni magacin u Ugrinovcima, 1600 m²","meta":"Pogon","alt":"Proizvodna hala TRICOM-a u Ugrinovcima sa kapijom i dvorištem"},"en":{"t":"Production hall and central warehouse in Ugrinovci, 1,600 m²","meta":"Plant","alt":"TRICOM’s production hall in Ugrinovci with gate and yard"},"photo":{"src":"assets/old/foto/hala-ugrinovci.jpg","w":1600,"h":375}},
    {"slug":"g-02","kind":"gallery","cat":"plazma","fig":"02","sr":{"t":"CNC plazma u radu — rezanje po nacrtu","meta":"Plazma","alt":"CNC plazma reže čelični lim na radnom stolu"},"en":{"t":"CNC plasma at work — cutting to drawing","meta":"Plasma","alt":"CNC plasma cutting steel sheet on the cutting table"},"photo":{"src":"assets/old/foto/plazma-rez.jpg","w":800,"h":600}},
    {"slug":"g-03","kind":"gallery","cat":"plazma","fig":"03","sr":{"t":"Komadi isečeni na CNC plazmi","meta":"Plazma","alt":"Delovi isečeni na plazmi složeni na paleti"},"en":{"t":"Parts cut on the CNC plasma","meta":"Plasma","alt":"Plasma-cut parts stacked on a pallet"},"photo":{"src":"assets/old/foto/plazma-komadi.jpg","w":800,"h":600}},
    {"slug":"g-04","kind":"gallery","cat":"pogon","fig":"04","sr":{"t":"Hidraulične makaze MHS 3100/13 — lim do 13 mm, dužina reza 3100 mm","meta":"Pogon","alt":"Hidraulične makaze za sečenje lima u pogonu"},"en":{"t":"Hydraulic guillotine shear MHS 3100/13 — sheet up to 13 mm, cutting length 3,100 mm","meta":"Plant","alt":"Hydraulic guillotine shear for cutting sheet in the plant"},"photo":{"src":"assets/old/foto/makaze.jpg","w":800,"h":600}},
    {"slug":"g-05","kind":"gallery","cat":"pogon","fig":"05","sr":{"t":"Sliter — podužno sečenje kotura do 1260 mm, najviše 7 traka","meta":"Pogon","alt":"Linija za slitovanje lima iz kotura"},"en":{"t":"Slitter — slitting coil up to 1,260 mm, maximum 7 strips","meta":"Plant","alt":"Line for slitting sheet from coil"},"photo":{"src":"assets/old/foto/sliter.jpg","w":800,"h":600}},
    {"slug":"g-06","kind":"gallery","cat":"pogon","fig":"06","sr":{"t":"CNC apipong 8,2 m — opšivke i profili bez spoja","meta":"Pogon","alt":"CNC apkant presa dužine 8,2 m"},"en":{"t":"CNC folding machine 8.2 m — flashings and profiles without joints","meta":"Plant","alt":"CNC press brake, 8.2 m long"},"photo":{"src":"assets/old/foto/apipong.jpg","w":800,"h":600}},
    {"slug":"g-07","kind":"gallery","cat":"pogon","fig":"07","sr":{"t":"Rund mašina — kružno savijanje do 4 mm na dužini 2 m","meta":"Pogon","alt":"Mašina za rundovanje lima"},"en":{"t":"Plate rolling machine — rolling up to 4 mm over a length of 2 m","meta":"Plant","alt":"Plate rolling machine for sheet"},"photo":{"src":"assets/old/foto/rund.jpg","w":800,"h":600}},
    {"slug":"g-08","kind":"gallery","cat":"pogon","fig":"08","sr":{"t":"Iron Worker — probijanje, isecanje uglova, sečenje profila","meta":"Pogon","alt":"Kombinovana mašina Iron Worker"},"en":{"t":"Iron Worker — punching, corner notching, cutting sections","meta":"Plant","alt":"Iron Worker combination machine"},"photo":{"src":"assets/old/foto/iron-worker.jpg","w":800,"h":450}},
    {"slug":"g-09","kind":"gallery","cat":"pogon","fig":"09","sr":{"t":"Profilirka za poluokrugli oluk — neograničena dužina","meta":"Pogon","alt":"Profilirka za oluke u pogonu"},"en":{"t":"Roll former for half-round gutters — unlimited length","meta":"Plant","alt":"Gutter roll former in the plant"},"photo":{"src":"assets/old/foto/profilirka-oluk.jpg","w":800,"h":600}},
    {"slug":"g-10","kind":"gallery","cat":"pogon","fig":"10","sr":{"t":"Profilirka za okrugle vertikale Ø100","meta":"Pogon","alt":"Profilirka za olučne vertikale"},"en":{"t":"Roll former for round downpipes Ø100","meta":"Plant","alt":"Roll former for downpipes"},"photo":{"src":"assets/old/foto/profilirka-vertikala.jpg","w":800,"h":600}},
    {"slug":"g-11","kind":"gallery","cat":"pogon","fig":"11","sr":{"t":"Mašina za grifovanje flahova, firkanta i kutijastih profila","meta":"Pogon","alt":"Mašina za grifovanje šipkastih profila"},"en":{"t":"Machine for embossing flat bars, square bars and box sections","meta":"Plant","alt":"Machine for embossing bar sections"},"photo":{"src":"assets/old/foto/grifovanje.jpg","w":716,"h":800}},
    {"slug":"g-12","kind":"gallery","cat":"pogon","fig":"12","sr":{"t":"Trakasta testera — profili i puni preseci pod uglom do 60°","meta":"Pogon","alt":"Trakasta testera za sečenje metalnih profila"},"en":{"t":"Band saw — sections and solid bars at angles up to 60°","meta":"Plant","alt":"Band saw for cutting metal sections"},"photo":{"src":"assets/old/foto/testera.jpg","w":800,"h":600}},
    {"slug":"g-13","kind":"gallery","cat":"pogon","fig":"13","sr":{"t":"Mašina za izradu lamperije","meta":"Pogon","alt":"Profilirka za metalnu lamperiju"},"en":{"t":"Machine for making metal cladding panels","meta":"Plant","alt":"Roll former for metal cladding panels"},"photo":{"src":"assets/old/foto/masina-lamperija.jpg","w":800,"h":600}},
    {"slug":"g-14","kind":"gallery","cat":"pogon","fig":"14","sr":{"t":"Lager kotura pocinkovanog i bojenog lima","meta":"Pogon","alt":"Police sa koturima lima u magacinu"},"en":{"t":"Stock of galvanised and pre-painted sheet coils","meta":"Plant","alt":"Racks with sheet coils in the warehouse"},"photo":{"src":"assets/old/foto/polica-koturi.jpg","w":800,"h":600}},
    {"slug":"g-15","kind":"gallery","cat":"krov","fig":"15","sr":{"t":"Bojeni trapezni lim TR 20/185","meta":"Krov i fasada","alt":"Table bojenog trapeznog lima TR 20"},"en":{"t":"Pre-painted trapezoidal profiled sheet TR 20/185","meta":"Roof and façade","alt":"Pre-painted trapezoidal profiled sheets TR 20"},"photo":{"src":"assets/old/foto/tr20-bojeni.jpg","w":800,"h":600}},
    {"slug":"g-16","kind":"gallery","cat":"krov","fig":"16","sr":{"t":"Bojeni trapezni lim TR 10/162,5","meta":"Krov i fasada","alt":"Table bojenog trapeznog lima TR 10"},"en":{"t":"Pre-painted trapezoidal profiled sheet TR 10/162.5","meta":"Roof and façade","alt":"Pre-painted trapezoidal profiled sheets TR 10"},"photo":{"src":"assets/old/foto/tr10-bojeni.jpg","w":800,"h":600}},
    {"slug":"g-17","kind":"gallery","cat":"krov","fig":"17","sr":{"t":"Trapezni lim TR 35/270","meta":"Krov i fasada","alt":"Table trapeznog lima TR 35"},"en":{"t":"Trapezoidal profiled sheet TR 35/270","meta":"Roof and façade","alt":"Trapezoidal profiled sheets TR 35"},"photo":{"src":"assets/old/foto/tr35.jpg","w":800,"h":600}},
    {"slug":"g-18","kind":"gallery","cat":"krov","fig":"18","sr":{"t":"Trapezni lim TR 60/210","meta":"Krov i fasada","alt":"Tabla trapeznog lima TR 60 sa visokim rebrom"},"en":{"t":"Trapezoidal profiled sheet TR 60/210","meta":"Roof and façade","alt":"Trapezoidal profiled sheet TR 60 with a high rib"},"photo":{"src":"assets/old/foto/tr60.jpg","w":800,"h":600}},
    {"slug":"g-19","kind":"gallery","cat":"krov","fig":"19","sr":{"t":"Imitacija crepa — tabla novog modela","meta":"Krov i fasada","alt":"Tabla lima u obliku crepa"},"en":{"t":"Tile-effect roofing sheet — new model","meta":"Roof and façade","alt":"Sheet shaped like roof tiles"},"photo":{"src":"assets/old/foto/crep-tabla.jpg","w":1200,"h":1600}},
    {"slug":"g-20","kind":"gallery","cat":"krov","fig":"20","sr":{"t":"Imitacija crepa na krovu","meta":"Krov i fasada","alt":"Krov pokriven imitacijom crepa"},"en":{"t":"Tile-effect roofing sheet on a roof","meta":"Roof and façade","alt":"Roof covered with tile-effect roofing sheet"},"photo":{"src":"assets/old/foto/crep-krov.jpg","w":900,"h":675}},
    {"slug":"g-21","kind":"gallery","cat":"krov","fig":"21","sr":{"t":"Parapetni lim PR 83/34","meta":"Krov i fasada","alt":"Bojeni parapetni lim profil 83/34"},"en":{"t":"Parapet lining sheet PR 83/34","meta":"Roof and façade","alt":"Pre-painted parapet lining sheet, profile 83/34"},"photo":{"src":"assets/old/foto/parapet-1.jpg","w":800,"h":600}},
    {"slug":"g-22","kind":"gallery","cat":"krov","fig":"22","sr":{"t":"Parapetni lim PR 38/15","meta":"Krov i fasada","alt":"Parapetni lim profil 38/15"},"en":{"t":"Parapet lining sheet PR 38/15","meta":"Roof and façade","alt":"Parapet lining sheet, profile 38/15"},"photo":{"src":"assets/old/foto/parapet-2.jpg","w":800,"h":600}},
    {"slug":"g-23","kind":"gallery","cat":"krov","fig":"23","sr":{"t":"Metalna lamperija","meta":"Krov i fasada","alt":"Table metalne lamperije"},"en":{"t":"Metal cladding panels","meta":"Roof and façade","alt":"Lengths of metal cladding panels"},"photo":{"src":"assets/old/foto/lamperija.jpg","w":800,"h":600}},
    {"slug":"g-24","kind":"gallery","cat":"krov","fig":"24","sr":{"t":"Lamperija u enterijeru — skriveni spoj","meta":"Krov i fasada","alt":"Zid obložen metalnom lamperijom"},"en":{"t":"Metal cladding panels indoors — concealed joint","meta":"Roof and façade","alt":"Wall clad with metal cladding panels"},"photo":{"src":"assets/old/foto/lamperija-enterijer.jpg","w":1600,"h":2011}},
    {"slug":"g-25","kind":"gallery","cat":"krov","fig":"25","sr":{"t":"Maketa krova sa izolacijom od kamene vune (izložbeni prostor, Kneza Paskača 18)","meta":"Krov i fasada","alt":"Maketa slojeva krova sa kamenom vunom"},"en":{"t":"Roof mock-up with stone wool insulation (showroom, Kneza Paskača 18)","meta":"Roof and façade","alt":"Mock-up of roof layers with stone wool"},"photo":{"src":"assets/old/foto/maketa-krova.jpg","w":800,"h":600}},
    {"slug":"g-26","kind":"gallery","cat":"krov","fig":"26","sr":{"t":"Zidni sendvič panel","meta":"Krov i fasada","alt":"Zidni panel sa ispunom"},"en":{"t":"Wall sandwich panel","meta":"Roof and façade","alt":"Wall panel with insulation core"},"photo":{"src":"assets/old/foto/panel-zidni.jpg","w":714,"h":513}},
    {"slug":"g-27","kind":"gallery","cat":"krov","fig":"27","sr":{"t":"Krovni sendvič panel","meta":"Krov i fasada","alt":"Krovni panel sa ispunom"},"en":{"t":"Roof sandwich panel","meta":"Roof and façade","alt":"Roof panel with insulation core"},"photo":{"src":"assets/old/foto/panel-krovni.jpg","w":741,"h":533}},
    {"slug":"g-28","kind":"gallery","cat":"oluci","fig":"28","sr":{"t":"Poluokrugli oluci","meta":"Oluci i limarija","alt":"Poluokrugli oluci složeni u pogonu"},"en":{"t":"Half-round gutters","meta":"Gutters and flashings","alt":"Half-round gutters stacked in the plant"},"photo":{"src":"assets/old/foto/oluk-poluokrugli.jpg","w":848,"h":600}},
    {"slug":"g-29","kind":"gallery","cat":"oluci","fig":"29","sr":{"t":"Četvrtasti oluk","meta":"Oluci i limarija","alt":"Četvrtasti bojeni oluk"},"en":{"t":"Box gutter","meta":"Gutters and flashings","alt":"Pre-painted box gutter"},"photo":{"src":"assets/old/foto/oluk-cetvrtasti.jpg","w":800,"h":600}},
    {"slug":"g-30","kind":"gallery","cat":"oluci","fig":"30","sr":{"t":"Okrugle vertikale","meta":"Oluci i limarija","alt":"Okrugle olučne vertikale"},"en":{"t":"Round downpipes","meta":"Gutters and flashings","alt":"Round gutter downpipes"},"photo":{"src":"assets/old/foto/vertikale-okrugle.jpg","w":800,"h":663}},
    {"slug":"g-31","kind":"gallery","cat":"oluci","fig":"31","sr":{"t":"Četvrtasta vertikala","meta":"Oluci i limarija","alt":"Četvrtasta olučna vertikala"},"en":{"t":"Square downpipe","meta":"Gutters and flashings","alt":"Square gutter downpipe"},"photo":{"src":"assets/old/foto/vertikala-cetvrtasta.jpg","w":800,"h":599}},
    {"slug":"g-32","kind":"gallery","cat":"oluci","fig":"32","sr":{"t":"Iksna","meta":"Oluci i limarija","alt":"Limarska iksna"},"en":{"t":"Penetration flashing","meta":"Gutters and flashings","alt":"Sheet-metal penetration flashing"},"photo":{"src":"assets/old/foto/iksna.jpg","w":800,"h":600}},
    {"slug":"g-33","kind":"gallery","cat":"oluci","fig":"33","sr":{"t":"Okapnica","meta":"Oluci i limarija","alt":"Limarska okapnica"},"en":{"t":"Eaves drip flashing","meta":"Gutters and flashings","alt":"Sheet-metal eaves drip flashing"},"photo":{"src":"assets/old/foto/okapnica.jpg","w":800,"h":600}},
    {"slug":"g-34","kind":"gallery","cat":"oluci","fig":"34","sr":{"t":"Uvala","meta":"Oluci i limarija","alt":"Limarska uvala"},"en":{"t":"Valley flashing","meta":"Gutters and flashings","alt":"Sheet-metal valley flashing"},"photo":{"src":"assets/old/foto/uvala.jpg","w":800,"h":600}},
    {"slug":"g-35","kind":"gallery","cat":"oluci","fig":"35","sr":{"t":"Veter lajsna","meta":"Oluci i limarija","alt":"Limarska veter lajsna"},"en":{"t":"Verge flashing","meta":"Gutters and flashings","alt":"Sheet-metal verge flashing"},"photo":{"src":"assets/old/foto/veter-lajsna.jpg","w":800,"h":600}},
    {"slug":"g-36","kind":"gallery","cat":"oluci","fig":"36","sr":{"t":"Opšivka dimnjaka 40×40 cm","meta":"Oluci i limarija","alt":"Pocinkovana opšivka za dimnjak"},"en":{"t":"Chimney flashing 40 × 40 cm","meta":"Gutters and flashings","alt":"Galvanised chimney flashing"},"photo":{"src":"assets/old/foto/opsivka-dimnjak.jpg","w":800,"h":599}},
    {"slug":"g-37","kind":"gallery","cat":"oluci","fig":"37","sr":{"t":"Držači oluka","meta":"Oluci i limarija","alt":"Držači (kuke) za oluk"},"en":{"t":"Gutter brackets","meta":"Gutters and flashings","alt":"Gutter brackets (hooks)"},"photo":{"src":"assets/old/foto/drzac.jpg","w":800,"h":600}},
    {"slug":"g-38","kind":"gallery","cat":"oluci","fig":"38","sr":{"t":"Danca (čela) oluka","meta":"Oluci i limarija","alt":"Danca za oluk"},"en":{"t":"Gutter end caps","meta":"Gutters and flashings","alt":"Gutter end cap"},"photo":{"src":"assets/old/foto/danca.jpg","w":600,"h":800}},
    {"slug":"g-39","kind":"gallery","cat":"oluci","fig":"39","sr":{"t":"Vodokotlić","meta":"Oluci i limarija","alt":"Olučni vodokotlić"},"en":{"t":"Hopper head","meta":"Gutters and flashings","alt":"Gutter hopper head"},"photo":{"src":"assets/old/foto/vodokotlic.jpg","w":801,"h":600}},
    {"slug":"g-40","kind":"gallery","cat":"oluci","fig":"40","sr":{"t":"Kolena za vertikale","meta":"Oluci i limarija","alt":"Olučna kolena"},"en":{"t":"Downpipe elbows","meta":"Gutters and flashings","alt":"Gutter elbows"},"photo":{"src":"assets/old/foto/kolena.jpg","w":800,"h":600}},
    {"slug":"g-41","kind":"gallery","cat":"oluci","fig":"41","sr":{"t":"Obujmice","meta":"Oluci i limarija","alt":"Obujmice za vertikale"},"en":{"t":"Downpipe clips","meta":"Gutters and flashings","alt":"Clips for downpipes"},"photo":{"src":"assets/old/foto/obujmice.jpg","w":800,"h":600}},
    {"slug":"g-42","kind":"gallery","cat":"oluci","fig":"42","sr":{"t":"Snegobrani za crep","meta":"Oluci i limarija","alt":"Snegobrani"},"en":{"t":"Snow guards for tiled roofs","meta":"Gutters and flashings","alt":"Snow guards"},"photo":{"src":"assets/old/foto/snegobrani.jpg","w":800,"h":600}},
    {"slug":"g-43","kind":"gallery","cat":"oluci","fig":"43","sr":{"t":"Afteri (zadržači vode)","meta":"Oluci i limarija","alt":"Afteri za falcovani krov"},"en":{"t":"Rainwater diverters (afteri)","meta":"Gutters and flashings","alt":"Rainwater diverters (afteri) for a seamed roof"},"photo":{"src":"assets/old/foto/afteri.jpg","w":800,"h":600}},
    {"slug":"g-44","kind":"gallery","cat":"oluci","fig":"44","sr":{"t":"Maskice za eksere","meta":"Oluci i limarija","alt":"Maskice za glave eksera"},"en":{"t":"Nail covers","meta":"Gutters and flashings","alt":"Caps for nail heads"},"photo":{"src":"assets/old/foto/maskice.jpg","w":800,"h":745}},
    {"slug":"g-45","kind":"gallery","cat":"oluci","fig":"45","sr":{"t":"Vinkl (ugao oluka)","meta":"Oluci i limarija","alt":"Vinkl za oluk"},"en":{"t":"Gutter corner","meta":"Gutters and flashings","alt":"Gutter corner piece"},"photo":{"src":"assets/old/foto/vinkl.jpg","w":800,"h":600}},
    {"slug":"g-46","kind":"gallery","cat":"oluci","fig":"46","sr":{"t":"Ventilacioni kanal i koleno","meta":"Oluci i limarija","alt":"Pravougaoni ventilacioni kanal sa kolenom"},"en":{"t":"Ventilation duct and elbow","meta":"Gutters and flashings","alt":"Rectangular ventilation duct with elbow"},"photo":{"src":"assets/old/foto/ventilacioni-kanal.jpg","w":800,"h":600}},
    {"slug":"g-47","kind":"gallery","cat":"oluci","fig":"47","sr":{"t":"T-račva za ventilaciju","meta":"Oluci i limarija","alt":"Limena T-račva"},"en":{"t":"Ventilation T-piece","meta":"Gutters and flashings","alt":"Sheet-metal T-piece"},"photo":{"src":"assets/old/foto/t-racva.jpg","w":800,"h":600}},
    {"slug":"g-48","kind":"gallery","cat":"oluci","fig":"48","sr":{"t":"Redukcija","meta":"Oluci i limarija","alt":"Limena redukcija kanala"},"en":{"t":"Reducer","meta":"Gutters and flashings","alt":"Sheet-metal duct reducer"},"photo":{"src":"assets/old/foto/redukcija.jpg","w":800,"h":600}},
    {"slug":"g-49","kind":"gallery","cat":"profili","fig":"49","sr":{"t":"Pano kovanih elemenata","meta":"Profili i cevi","alt":"Izložbeni pano kovanih i grifovanih elemenata"},"en":{"t":"Display board of wrought-iron elements","meta":"Sections and tubes","alt":"Display board of wrought-iron and embossed elements"},"photo":{"src":"assets/old/foto/pano-elemenata.jpg","w":800,"h":600}},
    {"slug":"g-50","kind":"gallery","cat":"profili","fig":"50","sr":{"t":"Grifovani krug i bubreg","meta":"Profili i cevi","alt":"Grifovani dekorativni elementi"},"en":{"t":"Embossed circle and kidney shape","meta":"Sections and tubes","alt":"Embossed decorative elements"},"photo":{"src":"assets/old/foto/grifovani-krug.jpg","w":800,"h":600}},
    {"slug":"g-51","kind":"gallery","cat":"profili","fig":"51","sr":{"t":"Grifovani firkant","meta":"Profili i cevi","alt":"Grifovani kvadratni pun profil"},"en":{"t":"Embossed square bar","meta":"Sections and tubes","alt":"Embossed solid square bar"},"photo":{"src":"assets/old/foto/grifovani-firkant.jpg","w":800,"h":600}},
    {"slug":"g-52","kind":"gallery","cat":"profili","fig":"52","sr":{"t":"Grifovana cev","meta":"Profili i cevi","alt":"Grifovana kvadratna cev"},"en":{"t":"Embossed tube","meta":"Sections and tubes","alt":"Embossed square tube"},"photo":{"src":"assets/old/foto/grifovana-cev.jpg","w":800,"h":600}},
    {"slug":"g-53","kind":"gallery","cat":"profili","fig":"53","sr":{"t":"Grifovani flah sa šarom","meta":"Profili i cevi","alt":"Grifovani flah sa dezenom"},"en":{"t":"Embossed flat bar with pattern","meta":"Sections and tubes","alt":"Embossed patterned flat bar"},"photo":{"src":"assets/old/foto/grifovani-flah.jpg","w":800,"h":600}},
    {"slug":"g-54","kind":"gallery","cat":"profili","fig":"54","sr":{"t":"Pocinkovano gazište","meta":"Profili i cevi","alt":"Pocinkovana rešetka gazišta"},"en":{"t":"Galvanised stair tread","meta":"Sections and tubes","alt":"Galvanised stair tread grating"},"photo":{"src":"assets/old/foto/gaziste.jpg","w":800,"h":600}},
    {"slug":"g-55","kind":"gallery","cat":"profili","fig":"55","sr":{"t":"Pocinkovana kanalska rešetka","meta":"Profili i cevi","alt":"Kanalska rešetka"},"en":{"t":"Galvanised drainage grating","meta":"Sections and tubes","alt":"Drainage grating"},"photo":{"src":"assets/old/foto/kanalska-resetka.jpg","w":800,"h":600}},
    {"slug":"g-56","kind":"gallery","cat":"profili","fig":"56","sr":{"t":"Grifovano pletivo","meta":"Profili i cevi","alt":"Grifovano pletivo za ograde"},"en":{"t":"Crimped wire mesh","meta":"Sections and tubes","alt":"Crimped wire mesh for fences"},"photo":{"src":"assets/old/foto/grifovano-pletivo.jpg","w":797,"h":600}},
    {"slug":"g-57","kind":"gallery","cat":"profili","fig":"57","sr":{"t":"Rukohvat od cevi","meta":"Profili i cevi","alt":"Rukohvat"},"en":{"t":"Tube handrail","meta":"Sections and tubes","alt":"Handrail"},"photo":{"src":"assets/old/foto/rukohvat.jpg","w":800,"h":600}},
    {"slug":"g-58","kind":"gallery","cat":"krov","fig":"58","sr":{"t":"Stambena zgrada sa limarijom i ogradama terasa","meta":"Krov i fasada","alt":"Stambena zgrada sa limenim opšivkama i gelenderima"},"en":{"t":"Residential building with sheet-metal work and terrace railings","meta":"Roof and façade","alt":"Residential building with sheet-metal flashings and railings"},"photo":{"src":"assets/old/foto/objekat-1.jpg","w":1280,"h":960}},
    {"slug":"g-59","kind":"gallery","cat":"krov","fig":"59","sr":{"t":"Objekat sa TRICOM limarijom","meta":"Krov i fasada","alt":"Fasada objekta sa limarskim elementima"},"en":{"t":"Building with TRICOM sheet-metal work","meta":"Roof and façade","alt":"Building façade with sheet-metal elements"},"photo":{"src":"assets/old/foto/objekat-3.jpg","w":960,"h":1280}},
    {"slug":"g-61","kind":"gallery","cat":"krov","fig":"61","sr":{"t":"TR 35/270 — render","meta":"Krov i fasada","alt":"TR 35/270 — render"},"en":{"t":"TR 35/270 — render","meta":"Roof and façade","alt":"TR 35/270 — render"},"img":"tr35"},
    {"slug":"g-62","kind":"gallery","cat":"oluci","fig":"62","sr":{"t":"Poluokrugli oluk — render","meta":"Oluci i limarija","alt":"Poluokrugli oluk — render"},"en":{"t":"Half-round gutter — render","meta":"Gutters and flashings","alt":"Half-round gutter — render"},"img":"gutter-halfround"},
    {"slug":"g-64","kind":"gallery","cat":"plazma","fig":"64","sr":{"t":"Ploča isečena na CNC plazmi — render","meta":"Plazma","alt":"Ploča isečena na CNC plazmi — render"},"en":{"t":"Plate cut on the CNC plasma — render","meta":"Plasma","alt":"Plate cut on the CNC plasma — render"},"img":"plasma-plate"},
    {"slug":"g-66","kind":"gallery","cat":"krov","fig":"66","sr":{"t":"TR 10/162,5 — render","meta":"Krov i fasada","alt":"TR 10/162,5 — render"},"en":{"t":"TR 10/162.5 — render","meta":"Roof and façade","alt":"TR 10/162.5 — render"},"img":"tr10"},
    {"slug":"g-67","kind":"gallery","cat":"krov","fig":"67","sr":{"t":"TR 20/185 — render","meta":"Krov i fasada","alt":"TR 20/185 — render"},"en":{"t":"TR 20/185 — render","meta":"Roof and façade","alt":"TR 20/185 — render"},"img":"tr20"},
    {"slug":"g-68","kind":"gallery","cat":"krov","fig":"68","sr":{"t":"TR 40/230 — render","meta":"Krov i fasada","alt":"TR 40/230 — render"},"en":{"t":"TR 40/230 — render","meta":"Roof and façade","alt":"TR 40/230 — render"},"img":"tr40"},
    {"slug":"g-69","kind":"gallery","cat":"krov","fig":"69","sr":{"t":"Imitacija crepa — render","meta":"Krov i fasada","alt":"Imitacija crepa — render"},"en":{"t":"Tile-effect roofing sheet — render","meta":"Roof and façade","alt":"Tile-effect roofing sheet — render"},"img":"crep"},
    {"slug":"g-71","kind":"gallery","cat":"oluci","fig":"71","sr":{"t":"Četvrtasti oluk — render","meta":"Oluci i limarija","alt":"Četvrtasti oluk — render"},"en":{"t":"Box gutter — render","meta":"Gutters and flashings","alt":"Box gutter — render"},"img":"gutter-box"},
    {"slug":"g-72","kind":"gallery","cat":"oluci","fig":"72","sr":{"t":"Oluk, rendgenski prikaz — render","meta":"Oluci i limarija","alt":"Oluk, rendgenski prikaz — render"},"en":{"t":"Gutter, X-ray view — render","meta":"Gutters and flashings","alt":"Gutter, X-ray view — render"},"img":"xray-gutter"},
    {"slug":"g-73","kind":"gallery","cat":"oluci","fig":"73","sr":{"t":"Opšivke — render","meta":"Oluci i limarija","alt":"Opšivke — render"},"en":{"t":"Flashings — render","meta":"Gutters and flashings","alt":"Flashings — render"},"img":"flashing-set"},
    {"slug":"g-76","kind":"gallery","cat":"krov","fig":"76","sr":{"t":"Snegobrani — render","meta":"Krov i fasada","alt":"Snegobrani — render"},"en":{"t":"Snow guards — render","meta":"Roof and façade","alt":"Snow guards — render"},"img":"snowguard-row"},
    {"slug":"g-78","kind":"gallery","cat":"krov","fig":"78","sr":{"t":"Slojevi lima, rendgenski prikaz — render","meta":"Krov i fasada","alt":"Slojevi lima, rendgenski prikaz — render"},"en":{"t":"Sheet layers, X-ray view — render","meta":"Roof and façade","alt":"Sheet layers, X-ray view — render"},"img":"xray-sheet-layers"},
    {"slug":"g-79","kind":"gallery","cat":"pogon","fig":"79","sr":{"t":"Limovi u tablama — render","meta":"Pogon","alt":"Limovi u tablama — render"},"en":{"t":"Sheet metal in sheets — render","meta":"Plant","alt":"Sheet metal in sheets — render"},"img":"sheet-stack"},
    {"slug":"g-80","kind":"gallery","cat":"pogon","fig":"80","sr":{"t":"Lim u koturu — render","meta":"Pogon","alt":"Lim u koturu — render"},"en":{"t":"Sheet metal in coil — render","meta":"Plant","alt":"Sheet metal in coil — render"},"img":"coil"}
  ];
  /* @@MEDIA-END */

  var ALL = ITEMS.concat(MEDIA), BY = {};
  ALL.forEach(function (it) { BY[it.slug] = it; });

  w.TRICOM_ITEMS = {
    list: ALL,
    illu: ILLU,
    get: function (slug) { return BY[slug] || null; },
    /* stavka ima generisanu stranu detalja */
    hasPage: function (it) { return !!it && (it.kind === 'product' || it.kind === 'service' || it.kind === 'capability'); }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = w.TRICOM_ITEMS;
})(typeof window !== 'undefined' ? window : globalThis);
