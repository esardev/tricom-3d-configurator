/* ==========================================================================
   TRICOM — catalog.js
   Jedini izvor podataka o onome što konfigurator prodaje: profili, materijali,
   boje, oluci i vertikale, limarija i pravila proračuna. Konfigurator čita
   samo odavde (preko js/konfigurator/k-data.js); kasnije isti objekat može da
   hrani i strane prodajnog programa.

   Nazivi polja su na engleskom i stabilni; tekst za prikaz je na srpskom.
   Mere: mm za preseke i širine, m za dužine, stepeni za nagib.
   Engleski tekst za prikaz stoji pored srpskog, u polju sa sufiksom _en
   (name → name_en, note → note_en, fillings → fillings_en …); engleske
   strane (L10N.lang() === 'en') čitaju _en, a srpske ostaju na srpskom polju.
   Polje bez _en para je jezički neutralno (šifre, standardi, RAL, mere).

   Izvori: proizvodi.html (tabela trapeznih profila, oluci i galanterija),
   js/kb.js (RAL, dužina po meri, presa 8,2 m) i postojeći kod konfiguratora
   (geometrija preseka, RAL heks vrednosti, kapaciteti oluka, dužine komada).
   Vrednost koje nema ni u jednom od ta tri izvora nosi komentar
   „TEMP: confirm with client“ i ispisuje se u bloku „Pretpostavke proračuna“.
   Oktobar 2026: pokrivne širine profila i modul crepa potvrđeni crtežima sa
   starog sajta tricom.co.rs (v. _content/old/facts.md F213–F215, F237, F503);
   blok `sales` nosi ceo prodajni program prenet sa starog sajta.
   ========================================================================== */
window.TRICOM_CATALOG = {
  version: 1,

  /* ---- Trapezni profili i imitacija crepa --------------------------------
     coverWidth  korisna (pokrivna) širina table, mm
     ribHeight   visina rebra, mm (proizvodi.html)
     pitch       korak rebra, mm (proizvodi.html, kolona „Korisna širina“)
     geometry    presek za 3D i crteže (postojeći k-data.js): ribs = broj
                 koraka u korisnoj širini, crown/web u mm, stiff = žlebovi    */
  profiles: [
    { id: 'tr10', name: 'TR 10/162,5', name_en: 'TR 10/162.5', ribHeight: 10, pitch: 162.5,
      coverWidth: 975,               // crtež TR 10/162,5/975 (stari sajt, tr10-dimenzije.jpg)
      minSlopeDeg: 12,               // TEMP: confirm with client
      thicknesses: [0.5, 0.6],       // TEMP: confirm with client
      use: 'both',
      maxSheetLength: 12,            // TEMP: confirm with client
      overlapLong: 200,              // TEMP: confirm with client
      overlapSide: 1,
      note: 'Niski profil za fasade, parapete i krovove manjeg raspona; puna podloga.', inputWidth: 1025,
      note_en: 'Low profile for façades, parapets and short-span roofs; laid on a continuous deck.',
      geometry: { ribs: 7, crown: 46, web: 10, stiff: 0 } },
    { id: 'tr20', name: 'TR 20/185', name_en: 'TR 20/185', ribHeight: 20, pitch: 185,
      coverWidth: 1110,              // crtež TR 20/185/1110 (stari sajt, tr20-dimenzije.jpg)
      minSlopeDeg: 8,                // TEMP: confirm with client
      thicknesses: [0.5, 0.6, 0.7],  // TEMP: confirm with client
      use: 'both',
      maxSheetLength: 12,            // TEMP: confirm with client
      overlapLong: 200,              // TEMP: confirm with client
      overlapSide: 1,
      note: 'Univerzalni krovni i fasadni pokrivač.', inputWidth: 1165,
      note_en: 'Universal roof and wall cladding.',
      geometry: { ribs: 6, crown: 60, web: 18, stiff: 0 } },
    { id: 'tr35', name: 'TR 35/270', name_en: 'TR 35/270', ribHeight: 35, pitch: 270,
      coverWidth: 1080,              // crtež TR-35: efektivna širina 1080 (stari sajt, tr-35.jpg)
      minSlopeDeg: 5,                // TEMP: confirm with client
      thicknesses: [0.5, 0.6, 0.7],  // TEMP: confirm with client
      use: 'roof',
      maxSheetLength: 12,            // TEMP: confirm with client
      overlapLong: 200,              // TEMP: confirm with client
      overlapSide: 1,
      note: 'Industrijski krovovi, veći raspon rožnjača; može da se savija u luk.', inputWidth: 1250,
      note_en: 'Industrial roofs, longer purlin spans; can be arc-bent.',
      geometry: { ribs: 4, crown: 40, web: 30, stiff: 2 } },
    { id: 'tr40', name: 'TR 40/230', name_en: 'TR 40/230', ribHeight: 40, pitch: 230,
      coverWidth: 920,               // 920 po Bendexu i pismu klijenta (crtež TR 40/230/930 sa starog sajta kaže 930 — v. client-questions.md)
      minSlopeDeg: 3,                // stari sajt: nagib krova veći od 4 % (≈ 2,3°) — TEMP: confirm with client
      thicknesses: [0.5, 0.6, 0.7, 0.8, 1.0], // uputstvo TR 40/230 (statika za 0,5–1,0 mm)
      use: 'roof',
      maxSheetLength: 12,            // TEMP: confirm with client
      overlapLong: 200,              // TEMP: confirm with client
      overlapSide: 1,
      note: 'Hale i veliki rasponi; nagib krova veći od 4 %.', inputWidth: 1250,
      note_en: 'Production halls and long spans; roof pitch above 4%.',
      geometry: { ribs: 4, crown: 36, web: 34, stiff: 1 } },
    { id: 'tr40o', name: 'TR 40/230 ojačan', name_en: 'TR 40/230 reinforced', ribHeight: 40, pitch: 230,
      coverWidth: 920,               // 920 po Bendexu i pismu klijenta (crtež ojačanog sa starog sajta kaže 930 — v. client-questions.md)
      minSlopeDeg: 3,                // stari sajt: nagib krova veći od 4 % — TEMP: confirm with client
      thicknesses: [0.6, 0.7, 0.8, 1.0], // uputstvo TR 40/230
      use: 'roof',
      maxSheetLength: 12,            // TEMP: confirm with client
      overlapLong: 200,              // TEMP: confirm with client
      overlapSide: 1,
      note: 'Najveća opterećenja i rasponi — dodatni žlebovi u pojasu.', inputWidth: 1250,
      note_en: 'Highest loads and spans — additional stiffening grooves in the flange.',
      geometry: { ribs: 4, crown: 36, web: 34, stiff: 3, crownGroove: true } },
    { id: 'crep', name: 'Imitacija crepa', name_en: 'Tile-effect roofing sheet', ribHeight: 24, pitch: 183.3,
      coverWidth: 1150,              // stari sajt: pokrivna širina reda 1150 mm (širina 1190) — novi model od 2020.
      module: 350,                   // modul crepa, mm — stari sajt: standard 350, preporuka 350–450
      minSlopeDeg: 14,               // stari sajt: najmanje 14°
      thicknesses: [0.5],            // stari sajt: obično 0,5 mm ili po zahtevu
      use: 'roof',
      maxSheetLength: 6,             // TEMP: confirm with client
      overlapLong: 250,              // TEMP: confirm with client
      overlapSide: 1,
      note: 'Panel sa profilom crepa — klasičan izgled krova uz brzinu montaže čeličnog pokrivača.',
      note_en: 'Panel with a roof-tile profile — the classic look of a tiled roof with the fast installation of steel roofing.',
      geometry: { ribs: 6, tile: true, step: 22 } }
  ],

  /* ---- Materijali ----------------------------------------------------------
     defaultThickness  postojeći konfigurator (debljina lima po materijalu)
     colorSet          'ral' = bira se boja iz colors[]
     pbr               parametri za Three.js (MeshPhysicalMaterial), isti za
                       konfigurator i js/hero3d.js; hero = varijanta koju
                       koristi 3D na naslovnoj (ista vrednost kao ranije)      */
  materials: [
    { id: 'cink', name: 'Pocinkovani lim', short: 'Pocinkovani',
      name_en: 'Galvanised sheet', short_en: 'Galvanised',
      finish: 'metalni sjaj cinka; vremenom posivi i postaje mat', colorSet: null, defaultThickness: 0.50,
      finish_en: 'metallic zinc sheen; turns grey and matt over time',
      pbr: { metalness: 1, roughness: 0.44, agedMetalness: 0.82, agedRoughness: 0.78, envMapIntensity: 1.15, agedEnvMapIntensity: 0.8,
        hero: { color: '#D4D8DC', metalness: 1, roughness: 0.34 } } },
    { id: 'plast', name: 'Pocinkovano-plastificirani (RAL)', short: 'Plastificirani',
      name_en: 'Pre-painted galvanised (RAL)', short_en: 'Pre-painted',
      finish: 'poliesterski premaz po RAL karti', colorSet: 'ral', defaultThickness: 0.50,
      finish_en: 'polyester coating, colours from the RAL chart',
      pbr: { metalness: 0.2, roughness: 0.45, metallicColorMetalness: 0.75, metallicColorRoughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.35, envMapIntensity: 1,
        hero: { color: '#2B3035', metalness: 0.3, roughness: 0.46, clearcoat: 0.35, clearcoatRoughness: 0.4 } } },
    { id: 'bakar', name: 'Bakarni lim', short: 'Bakar',
      name_en: 'Copper sheet', short_en: 'Copper',
      finish: 'prirodni bakar; vremenom tamni, pa dobija zelenu patinu', colorSet: null, defaultThickness: 0.55,
      finish_en: 'natural copper; darkens over time, then develops a green patina',
      pbr: { metalness: 1, roughness: 1, envMapIntensity: 1.4 } },
    { id: 'alu', name: 'Aluminijum natur', short: 'Aluminijum',
      name_en: 'Natural aluminium', short_en: 'Aluminium',
      finish: 'prirodni aluminijum, svetao mat sjaj', colorSet: null, defaultThickness: 0.70,
      finish_en: 'natural aluminium, light matt sheen',
      pbr: { color: '#E3E6E8', metalness: 1, roughness: 0.5, envMapIntensity: 1.25 } },
    { id: 'inox', name: 'Prohromski lim (inox)', short: 'Inox',
      name_en: 'Stainless steel sheet', short_en: 'Stainless steel',
      finish: 'nerđajući čelik, brušena površina', colorSet: null, defaultThickness: 0.50,
      finish_en: 'stainless steel, brushed finish',
      pbr: { color: '#D0D3D6', metalness: 1, roughness: 0.2, envMapIntensity: 1.3 } }
  ],

  /* ---- Boje — JEDNA lista (`colours`; `colors` je pseudonim iste liste za
     konfigurator, v. dno fajla). Spojeni RAL spisak postojećeg konfiguratora i
     spisak boja iz Bendex.web prodavnice (Jednostran - RAL … - 0,50 mm - Kotur 1250).
     heks          standardna digitalna aproksimacija
     availableFor  materijali / proizvodi za koje se boja nudi
     finish        TEMP: confirm with client — mat varijante nisu navedene na sajtu
     shop/shop_en  naziv boje u Bendex prodavnici (kalkulatori ga prikazuju uz RAL)
     shopOrder     redosled u Bendex spisku (te boje idu prve u kalkulatorima) */
  colours: [
    { ral: '3000', name: 'vatreno crvena',   hex: '#A72920', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast'], name_en: 'flame red', family_en: 'Reds and browns', finish_en: 'gloss' },
    { ral: '3009', name: 'oksid crvena',     hex: '#6D342D', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'oxide red', family_en: 'Reds and browns', finish_en: 'gloss', shop: 'bordo', shop_en: 'burgundy', shopOrder: 5 },
    { ral: '3011', name: 'braon crvena',     hex: '#792423', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast'], name_en: 'brown red', family_en: 'Reds and browns', finish_en: 'gloss' },
    { ral: '8004', name: 'bakar braon',      hex: '#8D4931', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'copper brown', family_en: 'Reds and browns', finish_en: 'gloss' },
    { ral: '8017', name: 'čokoladno braon',  hex: '#442F29', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'chocolate brown', family_en: 'Reds and browns', finish_en: 'gloss' },
    { ral: '8019', name: 'sivo braon',       hex: '#3D3635', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast'], name_en: 'grey brown', family_en: 'Reds and browns', finish_en: 'gloss', shop: 'braon', shop_en: 'brown', shopOrder: 1 },
    { ral: '7016', name: 'antracit',         hex: '#383E42', family: 'Sive i crne',    finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'anthracite', family_en: 'Greys and blacks', finish_en: 'gloss', shop: 'antracit', shop_en: 'anthracite', shopOrder: 2 },
    { ral: '7024', name: 'grafit siva',      hex: '#45494E', family: 'Sive i crne',    finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'graphite grey', family_en: 'Greys and blacks', finish_en: 'gloss' },
    { ral: '7035', name: 'svetlo siva',      hex: '#C5C7C4', family: 'Sive i crne',    finish: 'sjaj', availableFor: ['plast'], name_en: 'light grey', family_en: 'Greys and blacks', finish_en: 'gloss' },
    { ral: '9005', name: 'crna',             hex: '#0E0E10', family: 'Sive i crne',    finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'black', family_en: 'Greys and blacks', finish_en: 'gloss', shop: 'crna', shop_en: 'black', shopOrder: 3 },
    { ral: '9006', name: 'belo aluminijum',  hex: '#A1A1A0', family: 'Sive i crne',    finish: 'metalik', availableFor: ['plast', 'lamperija'], name_en: 'white aluminium', family_en: 'Greys and blacks', finish_en: 'metallic', shop: 'metaliza', shop_en: 'metallic silver', shopOrder: 4 },
    { ral: '9007', name: 'sivo aluminijum',  hex: '#878581', family: 'Sive i crne',    finish: 'metalik', availableFor: ['plast', 'lamperija'], name_en: 'grey aluminium', family_en: 'Greys and blacks', finish_en: 'metallic' },
    { ral: '9010', name: 'bela',             hex: '#F1ECE1', family: 'Bele i svetle',  finish: 'sjaj', availableFor: ['plast'], name_en: 'white', family_en: 'Whites and light shades', finish_en: 'gloss' },
    { ral: '9002', name: 'sivo bela',        hex: '#D7D5CB', family: 'Bele i svetle',  finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'grey white', family_en: 'Whites and light shades', finish_en: 'gloss', shop: 'prljavo bela', shop_en: 'off-white', shopOrder: 7 },
    { ral: '1015', name: 'slonovača',        hex: '#E6D2B5', family: 'Bele i svetle',  finish: 'sjaj', availableFor: ['plast'], name_en: 'ivory', family_en: 'Whites and light shades', finish_en: 'gloss' },
    { ral: '6005', name: 'mahovina zelena',  hex: '#114232', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast', 'lamperija'], name_en: 'moss green', family_en: 'Greens and blues', finish_en: 'gloss' },
    { ral: '6020', name: 'hrom zelena',      hex: '#37422F', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'chrome green', family_en: 'Greens and blues', finish_en: 'gloss' },
    { ral: '5010', name: 'encijan plava',    hex: '#004F7C', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'gentian blue', family_en: 'Greens and blues', finish_en: 'gloss' },
    /* boje sa lagera starog sajta (bojeni limovi u koturu / slitu, imitacija crepa) */
    { ral: '9016', name: 'saobraćajno bela', hex: '#F1F0EA', family: 'Bele i svetle',  finish: 'sjaj', availableFor: ['plast'], name_en: 'traffic white', family_en: 'Whites and light shades', finish_en: 'gloss' },
    { ral: '3020', name: 'saobraćajno crvena', hex: '#BB1E10', family: 'Crvene i braon', finish: 'sjaj', availableFor: ['plast'], name_en: 'traffic red', family_en: 'Reds and browns', finish_en: 'gloss' },
    { ral: '6002', name: 'lisno zelena',     hex: '#2D5546', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'leaf green', family_en: 'Greens and blues', finish_en: 'gloss' },
    { ral: '6011', name: 'rezeda zelena',    hex: '#6C7C59', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'reseda green', family_en: 'Greens and blues', finish_en: 'gloss' },
    { ral: '6026', name: 'opal zelena',      hex: '#005F4E', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'opal green', family_en: 'Greens and blues', finish_en: 'gloss' },
    { ral: '6028', name: 'borovo zelena',    hex: '#2E4E3F', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'pine green', family_en: 'Greens and blues', finish_en: 'gloss', shop: 'zelena', shop_en: 'green', shopOrder: 6 },
    { ral: '5015', name: 'nebo plava',       hex: '#2874B2', family: 'Zelene i plave', finish: 'sjaj', availableFor: ['plast'], name_en: 'sky blue', family_en: 'Greens and blues', finish_en: 'gloss' }
  ],

  /* ---- Boje po profilu (klijent, 2026-11) ----------------------------------
     Profil sa ograničenim izborom RAL boja za nove porudžbine / konfiguracije.
     Kalkulator (js/calc-ui.js) i 3D konfigurator (js/konfigurator) nude samo
     ove boje; sačuvana stavka ili veza sa drugom bojom se ne menja, nego se
     označava za ponovni izbor. Profili kojih nema ovde: sve boje kao ranije. */
  profileColours: {
    tr10: ['9006', '9002', '7016']    // TP10 = TR 10/162,5
  },

  /* ---- Kalkulatori (kalkulatori.html, js/calc.js, js/calc-ui.js) ----------
     Jedini izvor za pet kalkulatora: TR 10/162, TR 20/185, TR 35/270,
     TR 40/230 i imitacija crepa. Mere u mm. Vrednosti iz Bendex XML-a i
     pisma klijenta Bendexu (oktobar 2026). TEMP = privremeno, potvrditi. */
  calculators: {
    SHOW_PRICES: false,               /* krug 9: iznosi su samo interni (administracija → Cenovnik / Upiti); TEMP 25 €/m² ispod se ne prikazuje i ne koristi za obračun */
    tileLengthTolerance: 20,          /* TEMP mm — dozvoljeno odstupanje koraka crepa u režimu „Zadati kraj“ */
    defaultThickness: 0.5,            // mm, podrazumevana debljina lima (samo za procenu mase)
    steelDensity: 7.85,               // kg/(m²·mm) — čelik 7,85 t/m³
    defaultColour: '7016',            // RAL antracit
    currency: 'EUR',
    defaults: { L: 4000, n: 10, W: 10000 },
    maxRows: 15,                      // trapez: najviše dužina u jednoj stavci (tehnička granica — tekst upita ima 2000 znakova)
    profiles: {
      tr10: { name: 'TR 10/162', coverWidth: 975,  developedWidth: 1250, lengthMin: 500, lengthMax: 13500,
              priceEurPerM2: 25 /* TEMP — Bendex value, confirm */ },
      tr20: { name: 'TR 20/185', coverWidth: 1110, developedWidth: 1250, lengthMin: 500, lengthMax: 13500,
              priceEurPerM2: 25 /* TEMP — Bendex value, confirm */ },
      tr35: { name: 'TR 35/270', coverWidth: 1080, developedWidth: 1250, lengthMin: 500, lengthMax: 13500,
              priceEurPerM2: 25 /* TEMP — Bendex value, confirm */ },
      tr40: { name: 'TR 40/230', coverWidth: 920,  developedWidth: 1250, lengthMin: 500, lengthMax: 13500,
              reinforced: true,       // klijent uvek poručuje ojačan — nema izbora u kalkulatoru
              priceEurPerM2: 25 /* TEMP — Bendex value, confirm */ }
    },
    crep: {
      name: 'Imitacija crepa', name_en: 'Tile-effect roofing sheet',
      developedWidth: 1250,
      coverWidth: null,               /* TODO client — dok je null, kalkulator nudi samo broj tabli (bez režima širine krova) */
      start: 30,                      // KRAJ table (suprotno od oluka), mm — uvek 30, ne unosi se (klijent, 2026-11)
      tile: 350,                      // dužina jednog crepa, mm
      endMin: 20,                     // najmanji POČETAK table (kod oluka), mm — slobodan ili zadat početak
      step: 20,                       // visina koraka: svaki korak dodaje 20 mm materijala, (crepova + 1) puta
      lengthMin: 400,                 // = kraj 30 + tile + najmanji početak 20
      lengthMax: 13500,
      defaultLength: 5000,
      priceEurPerM2: 25 /* TEMP — Bendex value, confirm; osnovica: razvijena površina dok pokrivna širina nije poznata */
    }
  },

  /* ---- Oluci i vertikale (proizvodi.html: poluokrugli i četvrtasti oluci,
     okrugle i četvrtaste vertikale, dužina po meri; prečnici, kapaciteti i
     dužine iz postojećeg konfiguratora)
     capacityArea  osnova krova (m²) po izlivu pri pljusku 300 l/s·ha       */
  gutters: [
    { id: 'polukrug125', code: 'pk125', shape: 'poluokrugli', size: 125, name: 'Poluokrugli Ø125', capacityArea: 83,  hook: 'kuka za poluokrugli oluk',
      shape_en: 'half-round', name_en: 'Half-round Ø125', hook_en: 'gutter bracket for half-round gutter' },
    { id: 'polukrug150', code: 'pk150', shape: 'poluokrugli', size: 150, name: 'Poluokrugli Ø150', capacityArea: 150, hook: 'kuka za poluokrugli oluk',
      shape_en: 'half-round', name_en: 'Half-round Ø150', hook_en: 'gutter bracket for half-round gutter' },
    { id: 'cetvrt120',   code: 'ck120', shape: 'četvrtasti',  size: 120, name: 'Četvrtasti 120',   capacityArea: 100, hook: 'kuka za četvrtasti oluk',
      shape_en: 'box', name_en: 'Box 120', hook_en: 'gutter bracket for box gutter' },
    { id: 'cetvrt150',   code: 'ck150', shape: 'četvrtasti',  size: 150, name: 'Četvrtasti 150',   capacityArea: 170, hook: 'kuka za četvrtasti oluk',
      shape_en: 'box', name_en: 'Box 150', hook_en: 'gutter bracket for box gutter' }
  ],
  downpipes: [
    { id: 'okrugla80',  code: 'ok80',  shape: 'okrugla',    size: 80,  name: 'Okrugla Ø80',        capacityArea: 83,  clamp: 'obujmica za okruglu vertikalu',
      shape_en: 'round', name_en: 'Round Ø80', clamp_en: 'downpipe clip for round downpipe' },
    { id: 'okrugla100', code: 'ok100', shape: 'okrugla',    size: 100, name: 'Okrugla Ø100',       capacityArea: 150, clamp: 'obujmica za okruglu vertikalu',
      shape_en: 'round', name_en: 'Round Ø100', clamp_en: 'downpipe clip for round downpipe' },
    { id: 'okrugla120', code: 'ok120', shape: 'okrugla',    size: 120, name: 'Okrugla Ø120',       capacityArea: 243, clamp: 'obujmica za okruglu vertikalu',
      shape_en: 'round', name_en: 'Round Ø120', clamp_en: 'downpipe clip for round downpipe' },
    { id: 'cetvrt80',   code: 'ck80',  shape: 'četvrtasta', size: 80,  name: 'Četvrtasta 80×80',   capacityArea: 100, clamp: 'obujmica za četvrtastu vertikalu',
      shape_en: 'square', name_en: 'Square 80×80', clamp_en: 'downpipe clip for square downpipe' },
    { id: 'cetvrt100',  code: 'ck100', shape: 'četvrtasta', size: 100, name: 'Četvrtasta 100×100', capacityArea: 190, clamp: 'obujmica za četvrtastu vertikalu',
      shape_en: 'square', name_en: 'Square 100×100', clamp_en: 'downpipe clip for square downpipe' }
  ],
  // delovi olučnog sistema (proizvodi.html: kuke, obujmice, čepovi, kolena, sabirnici)
  drainageParts: [
    { id: 'kuka',     name: 'Kuka za oluk',         unit: 'kom', name_en: 'Gutter bracket',  unit_en: 'pcs' },
    { id: 'cep',      name: 'Čep (čeona kapica)',   unit: 'kom', name_en: 'Stop end (end plug)', unit_en: 'pcs' },
    { id: 'ugao',     name: 'Ugaoni komad oluka',   unit: 'kom', name_en: 'Gutter corner',   unit_en: 'pcs' },
    { id: 'sabirnik', name: 'Sabirnik (kotlić, izlivnik)',  unit: 'kom', name_en: 'Hopper head', unit_en: 'pcs' },
    { id: 'koleno',   name: 'Koleno',               unit: 'kom', name_en: 'Elbow',           unit_en: 'pcs' },
    { id: 'izlivno',  name: 'Izlivno koleno',       unit: 'kom', name_en: 'Downpipe shoe',   unit_en: 'pcs' },
    { id: 'obujmica', name: 'Obujmica (šelna)',     unit: 'kom', name_en: 'Downpipe clip',   unit_en: 'pcs' },
    { id: 'ukras',    name: 'Ugaoni ukras',         unit: 'kom', name_en: 'Decorative corner piece', unit_en: 'pcs' },
    { id: 'dance',    name: 'Dance (čelo oluka)',   unit: 'kom', name_en: 'Gutter end cap',  unit_en: 'pcs' }
  ],

  /* ---- Građevinska limarija i snegobrani (proizvodi.html, kb.js)
     pieceLength  dužina jednog savijenog komada, m (postojeći konfigurator) —
                  TEMP: confirm with client (apkant presa savija do 8,2 m)     */
  accessories: [
    { id: 'sleme',    name: 'Sleme i grebeni',     unit: 'm',   pieceLength: 2.5, text: 'Pokriva spoj krovnih ravni na vrhu krova; ispod ide zaptivna traka po profilu lima.',
      name_en: 'Ridge and hip caps', unit_en: 'm', text_en: 'Covers the joint of the roof planes at the top of the roof; a profiled sealing strip matching the sheet goes underneath.' },
    { id: 'vetar',    name: 'Vetar lajsna',        unit: 'm',   pieceLength: 2.5, text: 'Zatvara bočnu ivicu krova na zabatu i štiti lim od podizanja vetrom.',
      name_en: 'Verge flashing', unit_en: 'm', text_en: 'Closes the side edge of the roof at the gable and stops the wind lifting the sheets.' },
    { id: 'okapnica', name: 'Okapnica',            unit: 'm',   pieceLength: 2.5, text: 'Vodi vodu sa strehe pravo u oluk i čuva čeonu dasku.',
      name_en: 'Eaves drip flashing', unit_en: 'm', text_en: 'Leads water from the eaves straight into the gutter and protects the fascia board.' },
    { id: 'snego',    name: 'Snegobrani',          unit: 'm',   pieceLength: 3,   text: 'Cevni snegobran sa nosačima zadržava sneg da ne sklizne u oluk.', rows: 'po nagibu i dužini krovne ravni (v. pravila)',
      name_en: 'Snow guards', unit_en: 'm', text_en: 'A tubular snow guard on brackets holds the snow back so it does not slide into the gutter.', rows_en: 'by roof pitch and roof plane length (see rules)' },
    { id: 'opsivka',  name: 'Opšivka dimnjaka',    unit: 'komplet',               text: 'Stepenasta opšivka zaptiva spoj dimnjaka i krovne ravni.',
      name_en: 'Chimney flashing', unit_en: 'set', text_en: 'Stepped flashing seals the joint between the chimney and the roof plane.' },
    { id: 'iksna',    name: 'Iksna oko dimnjaka',  unit: 'komplet',               text: 'Ležeći oluk iza i pored dimnjaka koji vodu sprovodi oko njega.',
      name_en: 'Penetration flashing', unit_en: 'set', text_en: 'A flat-lying gutter behind and beside the chimney that leads water around it.' },
    { id: 'kapa',     name: 'Kapa za dimnjak',     unit: 'kom',                   text: 'Štiti dimnjački kanal od kiše i snega, ne smeta promaji.',
      name_en: 'Chimney cap', unit_en: 'pcs', text_en: 'Protects the flue from rain and snow without blocking the draught.' },
    { id: 'uvala',    name: 'Uvala',               unit: 'm',   pieceLength: 3,   text: 'Lim u obliku slova V na unutrašnjem spoju dve krovne ravni.',
      name_en: 'Valley flashing', unit_en: 'm', text_en: 'V-shaped sheet at the internal joint of two roof planes.' },
    { id: 'parapet',  name: 'Parapetni lim',       unit: 'm',   pieceLength: 3,   text: 'Pokriva vrh atike, sa okapnicom od 20 mm na obe strane.',
      name_en: 'Parapet lining sheet', unit_en: 'm', text_en: 'Covers the top of the parapet wall, with a 20 mm drip edge on both sides.' },
    { id: 'solbank',  name: 'Prozorske okapnice',  unit: 'm',                     text: 'Solbank ispod prozora odvodi vodu od fasade.',
      name_en: 'Window sills', unit_en: 'm', text_en: 'The external sill under the window sheds water away from the façade.' }
  ],
  ridgeTypes: [
    { id: 'ugaono', name: 'Ugaono sleme', name_en: 'Angular ridge cap' },
    { id: 'polu',   name: 'Poluokruglo sleme', name_en: 'Half-round ridge cap' }
  ],

  /* ---- Pravila proračuna. Svako se ispisuje u „Pretpostavke proračuna“. ---- */
  rules: {
    sheetRound: 0.05,           // dužina table se zaokružuje naviše na 5 cm
    wastePct: 3,                // % rezerve na m² za porudžbinu — TEMP: confirm with client
    tileEnd: 0.08,              // m, završetak table crepa iza poslednjeg modula — TEMP: confirm with client
    hookSpacing: 0.6,           // m, razmak kuka oluka (postojeći konfigurator) — TEMP: confirm with client
    hookEndMargin: 0.15,        // m, prva i poslednja kuka od kraja oluka — TEMP: confirm with client
    gutterFall: 3,              // mm/m, pad oluka ka izlivu (postojeći konfigurator)
    downpipeEvery: 10,          // m strehe po dodatnoj vertikali (najmanje jedna po strehi) — TEMP: confirm with client
    downpipeExtra: 0.3,         // m, dodatak na visinu strehe za koleno i izlivno koleno — TEMP: confirm with client
    elbowsPerPipe: 2,           // kolena po vertikali (postojeći konfigurator)
    outletElbowsPerPipe: 1,     // izlivna kolena po vertikali (postojeći konfigurator)
    clampSpacing: 2.0,          // m, razmak obujmica (postojeći konfigurator) — TEMP: confirm with client
    trimOverlap: 0.10,          // m, preklop komada limarije na nastavku — TEMP: confirm with client
    snowMinDeg: 10,             // ° — ispod ovog nagiba snegobrani se ne predlažu — TEMP: confirm with client
    snowFirstRow: 0.75,         // m od strehe do prvog reda (postojeći konfigurator)
    snowRowEvery: [             // m nagnute dužine po redu, po nagibu — TEMP: confirm with client
      { maxDeg: 30, every: 5.0 },
      { maxDeg: 45, every: 4.0 },
      { maxDeg: 90, every: 3.0 }
    ],
    snowEdgeMargin: 0.3,        // m, red snegobrana se završava pre ivice ravni (postojeći konfigurator)
    snowBracketSpacing: 0.9,    // m, razmak nosača snegobrana (postojeći konfigurator)
    snowTubes: 2,               // cevi Ø28 po redu (postojeći konfigurator)
    screwsPerTrimM: 4,          // vijaka po metru limarije (postojeći konfigurator)
    screwPack: 250              // vijaka u pakovanju (postojeći konfigurator)
  },


  /* ---- Prodajni program (preneto sa starog sajta tricom.co.rs, oktobar 2026) ----
     Sve što prodajne strane prikazuju u tabelama čita se odavde (js/catalog-render.js).
     Konfigurator ovaj deo ne koristi. Izvor svakog bloka je stara strana ili PDF/slika
     navedena u _content/old/facts.md (oznake F###). Mere u mm ako nije drugačije rečeno. */
  sales: {

    /* TR profili koji nisu u konfiguratoru (F210, F500–F506, F199–F205) */
    extraProfiles: [
      { id: 'tr60', name: 'TR 60/210', ribHeight: 60, pitch: 210, coverWidth: 840, totalWidth: 937, inputWidth: 1250,
        name_en: 'TR 60/210',
        thicknesses: [0.5, 0.6, 0.7, 0.8, 1.0], use: 'roof',
        note: 'Najveći raspon rožnjača; poslovni, proizvodni i magacinski objekti, hladnjače, skladišta, stambeni i pomoćni objekti, garaže. Može i sa antikondenz filcom.',
        note_en: 'Longest purlin span; commercial, production and warehouse buildings, cold stores, storage buildings, residential and ancillary buildings, garages. Also available with anti-condensation felt.',
        materials: 'pocinkovani i pocinkovani plastificirani lim', ribTop: 40, flank: '57°',
        materials_en: 'galvanised and pre-painted galvanised sheet',
        standards: 'tolerancije EN 10143, premaz EN 10169, nosivost EN 1993-1-3 i EN 1993-1-5',
        standards_en: 'tolerances EN 10143, coating EN 10169, load capacity EN 1993-1-3 and EN 1993-1-5',
        geometry: { ribs: 4, crown: 40, web: 48, stiff: 3 } },
      { id: 'pr151015', name: 'TR 15/10/15 (presa, do 2,5 m)', ribHeight: 15, pitch: null, coverWidth: null, inputWidth: null,
        name_en: 'TR 15/10/15 (press, up to 2.5 m)',
        thicknesses: [1.0], use: 'wall',
        note: 'Rebro 15/10/15 na hidrauličnoj presi; iz lima 1000 mm 8 rebara, iz 1250 mm 10 rebara. Rebro je nepromenljivo, a razmak rebara se bira po želji (rebro na početku i na kraju table). Na lageru pocinkovani sa 8 rebara.',
        note_en: 'Rib 15/10/15 formed on a hydraulic press; 8 ribs from 1,000 mm sheet, 10 ribs from 1,250 mm. The rib is fixed, while the rib spacing is chosen to order (a rib at the start and at the end of the sheet). In stock: galvanised with 8 ribs.',
        materials: 'pocinkovani, crni i plastificirani do 1 mm; aluminijum i bakar do 1,5 mm', maxLength: 2.5,
        materials_en: 'galvanised, black and pre-painted up to 1 mm; aluminium and copper up to 1.5 mm',
        uses: 'montažni objekti, parapeti, ograđivanje objekata i gradilišta, nastrešnice',
        uses_en: 'prefabricated buildings, parapets, fencing of buildings and construction sites, canopies',
        setup: 'štelovanje mašine 2 h rada dva radnika, naplaćuje se 50 EUR; male količine neisplative',
        setup_en: 'machine set-up takes two workers 2 hours and is charged at 50 EUR; small quantities are not cost-effective' }
    ],

    /* Dopunske mere profila iz crteža (F213–F215, F503–F506) */
    profileDetails: {
      tr10:  { inputWidth: 1025, developedWidth: 1070, ribTop: 20, ribBase: 40, endRib: '9,4 × 18,5', drawing: 'assets/old/tr/tr10-dimenzije.jpg',
               endRib_en: '9.4 × 18.5' },
      tr20:  { inputWidth: 1165, developedWidth: 1250, ribTop: 30, ribBase: 63, endRib: '17,4 × 28,5', drawing: 'assets/old/tr/tr20-dimenzije.jpg',
               endRib_en: '17.4 × 28.5' },
      tr35:  { inputWidth: 1250, totalWidth: 1109.7, ribTop: 40, ribHeightReal: '34,3–35', feltCover: '1090–1095 (sa antikondenz filcom 0,9 mm)', arch: 'može da se savija u luk', drawing: 'assets/old/tr/tr-35.jpg',
               ribHeightReal_en: '34.3–35', feltCover_en: '1,090–1,095 (with 0.9 mm anti-condensation felt)', arch_en: 'can be arc-bent' },
      tr40:  { inputWidth: 1250, developedWidth: 1250, ribTop: 30, ribBase: 60, radius: 4, endRib: '28, R 5', minSlopePct: 4, drawing: 'assets/old/tr/tr40-dimenzije.jpg' },
      tr40o: { inputWidth: 1250, ribTop: 30, ribBase: 60, flank: '70°', radius: 3.5, stiffDepth: 3.5, endRib: '29 / 15 / 10', minSlopePct: 4, drawing: 'assets/old/tr/tr40-ojacan-skica-2d.jpg' },
      tr60:  { inputWidth: 1250, totalWidth: 937, ribTop: 40, flank: '57°', grooves: '22 / 26 / 22', drawing: 'assets/old/tr/TR-60-210.jpg' },
      crep:  { rowWidth: 1190, coverWidth: 1150, moduleStd: 350, moduleRange: '350–450', sheetWidthLegacy: 1100, pitchLegacy: 183 }
    },

    /* Statika (F501, F502, F508–F510) — izvod; kompletne tabele su u slikama/PDF-u */
    statics: {
      tr40: {
        source: 'Uputstvo za izbor i montažu TR lima 40/230 (PDF), proračun za δ = 1450 kg/cm²',
        source_en: 'Selection and installation guide for TR 40/230 sheet (PDF), calculated for δ = 1,450 kg/cm²',
        rows: [
          { t: 0.5, kg: 5.33, I: 11.78, W: 4.08 }, { t: 0.6, kg: 6.52, I: 14.1, W: 4.9 }, { t: 0.7, kg: 7.47, I: 16.42, W: 5.72 },
          { t: 0.8, kg: 8.53, I: 18.76, W: 6.56 }, { t: 1.0, kg: 10.74, I: 23.38, W: 8.82 }
        ],
        spans: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00],
        single: { 0.5: [482, 309, 215, 158, 120, 95, 77, 64, 53, 46, 39, 34, 31], 0.6: [568, 364, 253, 186, 142, 112, 91, 75, 63, 54, 46, 40, 36], 0.7: [664, 425, 295, 217, 166, 131, 106, 88, 74, 63, 54, 47, 41], 0.8: [761, 487, 338, 248, 190, 150, 122, 101, 85, 72, 62, 54, 48], 1.0: [954, 610, 424, 311, 238, 188, 153, 126, 116, 90, 78, 68, 60] },
        multi:  { 0.5: [604, 387, 269, 197, 151, 119, 97, 80, 67, 57, 50, 43, 37], 0.6: [711, 455, 316, 232, 178, 140, 114, 94, 79, 67, 59, 51, 44], 0.7: [829, 531, 369, 271, 207, 164, 133, 110, 92, 79, 68, 59, 52], 0.8: [951, 609, 423, 311, 238, 188, 152, 126, 106, 90, 78, 68, 59], 1.0: [1192, 763, 530, 389, 298, 235, 191, 158, 132, 113, 97, 85, 74] },
        unit: 'kg/m²',
        alu: { note: 'Aluminijumski plastificirani lim iz trake 1250 mm', rows: [ { t: 0.7, I: 19.60, W: 6.50, kgm: 2.18, kgm2: 2.62 }, { t: 0.8, I: 22.20, W: 7.36, kgm: 2.48, kgm2: 2.99 }, { t: 1.0, I: 28.15, W: 9.28, kgm: 3.10, kgm2: 3.74 } ],
               note_en: 'Pre-painted aluminium sheet from 1,250 mm coil' }
      },
      tr60: {
        source: 'Tabela TR 60/210 (slika sa starog sajta), ugib u = L/200, oslanjanje na 2 oslonca',
        source_en: 'TR 60/210 table (image from the old website), deflection limit L/200, 2 supports',
        geom: [ { t: 0.5, Id: 27.679, Wd: 6.559, Ig: 22.438, Wg: 6.690 }, { t: 0.6, Id: 37.184, Wd: 9.233, Ig: 29.757, Wg: 9.458 }, { t: 0.7, Id: 47.388, Wd: 12.267, Ig: 36.570, Wg: 11.990 }, { t: 0.8, Id: 57.007, Wd: 15.117, Ig: 43.411, Wg: 14.398 }, { t: 1.0, Id: 74.572, Wd: 20.133, Ig: 57.909, Wg: 18.483 } ],
        spans: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00],
        two: { 0.5: [8.221, 5.261, 3.654, 2.684, 2.055, 1.624, 1.315, 1.073, 0.827, 0.650, 0.521, 0.423, 0.349], 0.6: [11.57, 7.406, 5.143, 3.779, 2.893, 2.286, 1.852, 1.442, 1.111, 0.873, 0.699, 0.569, 0.469], 0.7: [15.37, 9.840, 6.833, 5.020, 3.844, 3.037, 2.446, 1.837, 1.415, 1.113, 0.891, 0.725, 0.597], 0.8: [18.95, 12.13, 8.421, 6.187, 4.737, 3.743, 2.942, 2.210, 1.703, 1.339, 1.072, 0.872, 0.718], 1.0: [25.23, 16.15, 11.21, 8.239, 6.308, 4.984, 3.849, 2.892, 2.227, 1.752, 1.403, 1.140, 0.940] },
        three: { 0.5: [8.385, 5.366, 3.727, 2.738, 2.096, 1.656, 1.342, 1.109, 0.932, 0.794, 0.684, 0.596, 0.524], 0.6: [11.85, 7.587, 5.268, 3.871, 2.964, 2.342, 1.897, 1.567, 1.317, 1.122, 0.968, 0.843, 0.741], 0.7: [15.03, 9.618, 6.679, 4.907, 3.757, 2.968, 2.404, 1.987, 1.670, 1.423, 1.227, 1.069, 0.939], 0.8: [18.05, 11.55, 8.020, 5.892, 4.511, 3.565, 2.887, 2.386, 2.005, 1.708, 1.473, 1.283, 1.128], 1.0: [23.17, 14.83, 10.30, 7.564, 5.791, 4.576, 3.706, 3.063, 2.574, 2.193, 1.891, 1.647, 1.448] },
        unit: 'kN/m²'
      }
    },

    /* Montaža TR lima (F217–F225, F511–F514) */
    mounting: {
      purlinSpacing: 'razmak rožnjača 0,6 m – najviše 1 m (TR 35)',
      who: 'način šrafljenja i razmak rožnjača određuje tehničko lice prema nagibu i površini krova',
      wood: 'drvena konstrukcija: samobušeći vijci sa neoprenskom i metalnom podloškom 6,3×70 – 6×90 mm (TR 40: vijci za drvo 6×80)',
      steel: 'metalna konstrukcija: samourezujući vijci sa neoprenskom i metalnom podloškom 6,3×50 – 6,3×70 mm (TR 40: samorezci 6,3×70/80)',
      wayOne: 'I način: pričvršćivanje u donjoj zoni vijcima 4,8 ili 6 (6,3) mm, obavezno i u gornjoj zoni na preklopu početnog i završnog rebra; lim se prepušta u oluk 5–8 cm',
      wayTwo: 'II način (preporuka): isključivo u gornjoj zoni, u rebro, sa PVC kalotom distancerom ispod lima i limenim kalota jahačem iznad rebra, uz metalnu i gumiranu podlošku',
      why: 'usled slabe konstrukcije i stalnog pomeranja zavrtanj u donjoj zoni vremenom proširi rupu i na tom mestu prolazi voda',
      widthNote: 'fabrička širina lima pre profilisanja je 1246–1254 mm, pa TR 35 može imati početni deo 3–5 mm; zadnje rebro table ide gore, početno dole',
      inputNote: 'ulazna širina trake je obično 1250 mm – što je pokrivna širina manja, nosivost i kvalitet su veći',
      wrong: ['povećanje pokrivne širine povećanjem ugla rebra – gubitak nosivosti', 'skraćeno rebro (gornji lim panela upotrebljen kao TR lim)', 'ušteda na početnom i završnom rebru – prodor vode na nastavku'],
      right: 'dodatni oslonac u rebru i sigurnosni kanal (sakupljač kapilarne vode) na preklopu',
      felt: 'antikondenz filc se lepi na naličje lima u proizvodnji; koristi se kad je na krovu samo jednostruki lim bez daščanja (nadstrešnice); kondenz se skuplja od zalaska sunca, filc ga upija i osuši se tokom dana',
      purlinSpacing_en: 'purlin spacing 0.6 m – max. 1 m (TR 35)',
      who_en: 'the fixing method and purlin spacing are determined by a responsible engineer according to the roof pitch and roof area',
      wood_en: 'timber structure: self-drilling screws with neoprene and metal washer 6.3×70 – 6×90 mm (TR 40: wood screws 6×80)',
      steel_en: 'steel structure: self-tapping screws with neoprene and metal washer 6.3×50 – 6.3×70 mm (TR 40: self-tapping screws 6.3×70/80)',
      wayOne_en: 'Method I: fixing in the lower zone with 4.8 or 6 (6.3) mm screws, and always also in the upper zone at the overlap of the starting and edge ribs; the sheet overhangs into the gutter by 5–8 cm',
      wayTwo_en: 'Method II (recommended): only in the upper zone, through the rib, with a PVC spacer saddle under the sheet and a sheet-metal saddle washer over the rib, plus a metal and a rubber-backed washer',
      why_en: 'with a weak structure and constant movement, a screw in the lower zone gradually widens its hole and water gets through at that point',
      widthNote_en: 'the mill width of the sheet before roll forming is 1,246–1,254 mm, so TR 35 may have a 3–5 mm starting strip; the last rib of the sheet goes on top, the starting rib underneath',
      inputNote_en: 'the input coil width is usually 1,250 mm – the smaller the cover width, the higher the load capacity and quality',
      wrong_en: ['increasing the cover width by widening the rib angle – loss of load capacity', 'shortened rib (the top sheet of a sandwich panel used as TR sheet)', 'saving on the starting and edge ribs – water penetration at the joint'],
      right_en: 'an additional support in the rib and a safety channel (capillary water collector) at the overlap',
      felt_en: 'anti-condensation felt is bonded to the underside of the sheet during production; it is used where the roof is a single sheet without boarding (canopies); condensation forms from sunset, the felt absorbs it and dries out during the day'
    },

    /* Imitacija crepa – novi model (F232–F239, F516) */
    tile: {
      since: 'jul 2020.', rows: '1 red (5 crepova) ili dužina po narudžbini (više redova)',
      since_en: 'July 2020', rows_en: '1 row (5 tiles) or length to order (several rows)',
      module: 'dužina crepa standardno 350 mm, preporuka 350–450 mm; manje dužine uz doplatu',
      module_en: 'tile length 350 mm as standard, 350–450 mm recommended; shorter lengths at extra charge',
      rowWidth: 1190, coverWidth: 1150, thickness: 'obično 0,5 mm ili po zahtevu',
      thickness_en: 'usually 0.5 mm, or on request',
      coating: 'pocinkovani lim 140 g/m², fabrički bojen 25 µm lice / 8 µm naličje; moguće obostrano 25/25 µm',
      coating_en: 'galvanised sheet 140 g/m², factory-painted 25 µm face / 8 µm reverse; 25/25 µm on both sides possible',
      colors: [ { ral: '5010', name: 'plava' }, { ral: '6028', name: 'zelena' }, { ral: '3009', name: 'bordo' }, { ral: 'TDM', name: 'braon' }, { ral: '9005', name: 'crna' }, { ral: '9002', name: 'prljavo bela' }, { ral: '9006', name: 'metaliza' }, { ral: '7016', name: 'miš siva' } ],
      colors_en: [ { ral: '5010', name: 'blue' }, { ral: '6028', name: 'green' }, { ral: '3009', name: 'burgundy' }, { ral: 'TDM', name: 'brown' }, { ral: '9005', name: 'black' }, { ral: '9002', name: 'off-white' }, { ral: '9006', name: 'metallic silver' }, { ral: '7016', name: 'anthracite grey' } ],
      textured: [ { ral: '9005', name: 'crna' }, { ral: '3009', name: 'bordo (boja cigle)' }, { ral: 'TDM', name: 'braon' } ],
      textured_en: [ { ral: '9005', name: 'black' }, { ral: '3009', name: 'burgundy (brick colour)' }, { ral: 'TDM', name: 'brown' } ],
      weight: 'manje od 5 kg/m² (klasičan crep 30–50 kg/m²)', minSlopeDeg: 14,
      weight_en: 'less than 5 kg/m² (conventional clay tiles 30–50 kg/m²)',
      install: ['daska kao podloga', 'paropropusna folija', 'letva 5×3 cm', 'kontra letva', 'pocinkovani bojeni lim'],
      install_en: ['boarding as the substrate', 'vapour-permeable membrane', 'batten 5×3 cm', 'counter-batten', 'pre-painted galvanised sheet'],
      installNotes: ['razmak letvi 35 cm, prva letva 30 cm od strehe', 'redosled montaže tabli 1–12 sa desna na levo; table na strehu vertikalno, pod 90°', 'ne seći brusilicom; po krovu hodati po donjem delu talasa'],
      installNotes_en: ['batten spacing 35 cm, first batten 30 cm from the eaves', 'sheet installation order 1–12 from right to left; sheets meet the eaves vertically, at 90°', 'do not cut with an angle grinder; walk on the roof only on the lower part of the wave']
    },

    /* Sleme (F228) */
    ridgeVariants: ['bez preklopa', 'pravougaoni preklop', 'na jednu vodu (nastrešnica)', 'na jednu vodu', 'poluokrugli preklop'],
    ridgeVariants_en: ['without overlap', 'rectangular overlap', 'mono-pitch (canopy)', 'mono-pitch', 'half-round overlap'],
    ridgeFor: ['TR 20/185', 'TR 35/270', 'TR 40/230', 'imitacija crepa'],
    ridgeFor_en: ['TR 20/185', 'TR 35/270', 'TR 40/230', 'tile-effect roofing sheet'],

    /* Parapetni limovi (F257, F571–F573) */
    parapets: [
      { no: 1, code: 'PR 83/34', rib: '83 / 34', t: '0,4–0,8', cover1000: 910, cover1250: 1160, materials: 'bojeni, pocinkovani, HVL',
        t_en: '0.4–0.8', materials_en: 'pre-painted, galvanised, cold-rolled' },
      { no: 2, code: 'PR 38/15', rib: '38 / 15', t: '0,4–0,8', cover1000: 967, cover1250: 1213, materials: 'bojeni, pocinkovani, HVL',
        t_en: '0.4–0.8', materials_en: 'pre-painted, galvanised, cold-rolled' },
      { no: 3, code: 'PR 71/10', rib: '71 / 10', t: '0,5–2,0 (preporučeno 0,8 / 1 / 1,5 / 2)', cover1000: 924, cover1250: 1209, materials: 'pocinkovani, HVL',
        t_en: '0.5–2.0 (recommended 0.8 / 1 / 1.5 / 2)', materials_en: 'galvanised, cold-rolled' }
    ],

    /* Lamperija (F194–F197, F258–F261) */
    lamperija: {
      materials: 'bojeni aluminijum, pocinkovano bojeni lim, prohromski lim, bakarni lim', stdLength: 2.5, longer: 'na veću količinu po željenim dužinama',
      materials_en: 'pre-painted aluminium, pre-painted galvanised sheet, stainless steel sheet, copper sheet', longer_en: 'any length to order for larger quantities',
      joint: 'skriveni, vodonepropusan spoj – nastavak tabli po širini se ne vidi', care: 'lako održavanje sredstvima za čišćenje',
      joint_en: 'concealed, watertight joint – the side joint between panels is not visible', care_en: 'easy to clean with standard cleaning agents',
      inox: 'inox lamperija (ogledalo, mat, brušena) ispunjava norme za prostorije za pripremu hrane',
      inox_en: 'stainless steel cladding panels (mirror, matt, brushed) meet the standards for food preparation areas',
      alu: { colors: 'plastificirana braon ili bela', surface: 'glatka ili embosirana (kora pomorandže)', length: 2.5, coverArea: 0.65, joint: 'početni „muški“ i završni „ženski“ žleb se ne računaju u pokrivnu površinu',
        props: 'otporna na vodu i atmosferilije, ne korodira, bez održavanja', uses: 'kupatila, plafoni, hodnici, spoljne strehe', trims: 'završne lajsne; zakucava se aluminijumskim ekserima za roštilj ili rog',
        colors_en: 'pre-painted brown or white', surface_en: 'smooth or embossed (orange peel)', joint_en: 'the starting ‘male’ and closing ‘female’ grooves do not count towards the cover area',
        props_en: 'resistant to water and weather, does not corrode, maintenance-free', uses_en: 'bathrooms, ceilings, corridors, external eaves soffits', trims_en: 'finishing trims; nailed to the battens or rafters with aluminium nails' }
    },

    /* Sendvič paneli (F242–F250, F518) */
    panels: {
      def: 'dva čelična pocinkovana bojena lima sa termoizolacionom ispunom – fabrički formirana samonoseća ploča',
      def_en: 'two pre-painted galvanised steel sheets with a thermal-insulation core – a factory-made self-supporting panel',
      fillings: ['PUR (poliuretan)', 'PIR (poliizocijanurat)', 'kamena vuna (mineralna vuna)'],
      fillings_en: ['PUR (polyurethane)', 'PIR (polyisocyanurate)', 'stone wool (mineral wool)'],
      offer: 'kamena vuna – jedina ispuna sa A1 negorivošću', kinds: ['zidni', 'krovni'],
      offer_en: 'stone wool – the only core with non-combustibility class A1', kinds_en: ['wall', 'roof'],
      colors: [ { ral: '3000', name: 'crvena' }, { ral: '3009', name: 'tamno crvena' }, { ral: '5010', name: 'srednje plava' }, { ral: '6028', name: 'tamno zelena' }, { ral: '7016', name: 'grafitno siva' }, { ral: '8019', name: 'tamno smeđa' }, { ral: '9002', name: 'sivo bela' }, { ral: '9006', name: 'srebrna' } ],
      colors_en: [ { ral: '3000', name: 'red' }, { ral: '3009', name: 'dark red' }, { ral: '5010', name: 'medium blue' }, { ral: '6028', name: 'dark green' }, { ral: '7016', name: 'graphite grey' }, { ral: '8019', name: 'dark brown' }, { ral: '9002', name: 'grey white' }, { ral: '9006', name: 'silver' } ],
      fire: 'mineralna vuna: euroklasa A1/A2 (negorivo), s1 (neznatan dim), d0 (bez užarenih kapi); trajna otpornost iznad 300 °C; otpornost na požar panela 30–240 min',
      fire_en: 'mineral wool: Euroclass A1/A2 (non-combustible), s1 (very little smoke), d0 (no flaming droplets); permanent resistance above 300 °C; panel fire resistance 30–240 min',
      why: 'vatrootpornost pokrivača je uslov za tehničku saglasnost objekta (magacini, proizvodnja, prodaja)',
      why_en: 'fire resistance of the cladding is a condition for the building’s technical approval (warehouses, production, retail)',
      uses: 'krovovi, plafoni, fasade i pregrade; visoka toplotna izolacija, dug vek, brza montaža; kuće, hale, saloni',
      uses_en: 'roofs, ceilings, façades and partitions; high thermal insulation, long service life, fast installation; houses, production halls, showrooms'
    },

    /* Načini pokrivanja krovne konstrukcije (F251–F254) */
    roofing: {
      structures: 'čelične, betonske, drvene',
      structures_en: 'steel, concrete, timber',
      ways: ['TR lim (trapezni profilisani lim) i imitacija crepa', 'TR lim i imitacija crepa sa antikondenz filcom', 'sendvič paneli (ispuna između dva lima)', 'pokrivanje sa ručno postavljanom izolacijom'],
      ways_en: ['TR sheet (trapezoidal profiled sheet) and tile-effect roofing sheet', 'TR sheet and tile-effect roofing sheet with anti-condensation felt', 'sandwich panels (core between two sheets)', 'roofing with insulation laid by hand'],
      sheets: ['pocinkovani lim', 'fabrički bojeni (plastificirani) pocinkovani lim', 'fabrički bojeni (plastificirani) aluminijumski lim'],
      sheets_en: ['galvanised sheet', 'factory pre-painted (coil-coated) galvanised sheet', 'factory pre-painted (coil-coated) aluminium sheet'],
      sheetNote: 'najčešće se koristi bojeni pocinkovani lim – kvalitetno zaštićen, a znatno povoljniji od plastificiranog aluminijuma',
      sheetNote_en: 'Pre-painted galvanised sheet is used most often – well protected and considerably cheaper than pre-painted aluminium.',
      layers: ['primarni rešetkasti nosač – binder', 'Z profil – sekundarni nosač (rožnjača)', 'TR lim 40/230 – donji nosač izolacije', 'paropropusna folija', 'kamena vuna, poželjno 200 mm', 'vodonepropusna paropropusna folija', 'TR 20/185, TR 35/270 ili TR 40/230 (po veličini krova)', 'oluk sa pratećim elementima', 'snegobran za TR lim', 'bočna veter-lajsna'],
      layers_en: ['primary lattice girder (truss)', 'Z section – secondary member (purlin)', 'TR 40/230 sheet – lower support for the insulation', 'vapour-permeable membrane', 'stone wool, preferably 200 mm', 'waterproof vapour-permeable membrane', 'TR 20/185, TR 35/270 or TR 40/230 (depending on roof size)', 'gutter with accessories', 'snow guard for TR sheet', 'verge flashing'],
      model: 'maketa krova sa izolacijom od kamene vune stoji u izložbenom prostoru TRICOM-a, Kneza Paskača 18',
      model_en: 'A roof mock-up with stone wool insulation is on display in the TRICOM showroom, Kneza Paskača 18.'
    },

    /* Oluci i vertikale – prodajni formati (F185–F193, F270–F283) */
    gutters: {
      semiRound: [ { rs: 250, maxLen: 'do 4 m' }, { rs: 270, maxLen: 'do 4 m' }, { rs: 333, maxLen: 'neograničeno (pocinkovani); ostali materijali do 6,5 m' }, { rs: 400, maxLen: 'do 6 m' } ],
      semiRound_en: [ { rs: 250, maxLen: 'up to 4 m' }, { rs: 270, maxLen: 'up to 4 m' }, { rs: 333, maxLen: 'unlimited (galvanised); other materials up to 6.5 m' }, { rs: 400, maxLen: 'up to 6 m' } ],
      square: { thickness: 'do 0,8 mm (inox do 0,6 mm)', maxLen: 'do 8,2 m', materials: 'pocinkovani, pocinkovano bojeni, bakarni, aluminijumski; aluminijumski bojeni do 1,2 m; prohromski do 0,6 m',
        thickness_en: 'up to 0.8 mm (stainless steel up to 0.6 mm)', maxLen_en: 'up to 8.2 m', materials_en: 'galvanised, pre-painted galvanised, copper, aluminium; pre-painted aluminium up to 1.2 m; stainless steel up to 0.6 m' },
      materials: 'pocinkovani, pocinkovano bojeni, bakarni, aluminijumski, prohromski',
      materials_en: 'galvanised, pre-painted galvanised, copper, aluminium, stainless steel',
      rsStandard: '0,25 / 0,33 / 0,417 m', stockLengths: '4, 5 i 6 m',
      rsStandard_en: '0.25 / 0.33 / 0.417 m', stockLengths_en: '4, 5 and 6 m',
      colors: [ { ral: '—', name: 'pocinkovani, bez boje' }, { ral: '8019', name: 'braon' }, { ral: '3009', name: 'crvena (bordo)' }, { ral: '9002', name: 'bela' }, { ral: '9005', name: 'crna' }, { ral: '9006', name: 'siva (metaliza)' } ],
      colors_en: [ { ral: '—', name: 'galvanised, unpainted' }, { ral: '8019', name: 'brown' }, { ral: '3009', name: 'red (burgundy)' }, { ral: '9002', name: 'white' }, { ral: '9005', name: 'black' }, { ral: '9006', name: 'grey (metallic silver)' } ],
      stockColors: ['pocinkovani', 'braon', 'bordo', 'metaliza', 'prljavo belo', 'crno', 'zeleno'],
      stockColors_en: ['galvanised', 'brown', 'burgundy', 'metallic silver', 'off-white', 'black', 'green'],
      stockSemi: { 250: '4 m', 270: '4 m', 333: '4, 5 i 6 m', 400: '6 m' },
      stockSemi_en: { 250: '4 m', 270: '4 m', 333: '4, 5 and 6 m', 400: '6 m' },
      stockSquare: { 333: '6 m (boje: pocinkovani, braon, bordo, metaliza, plavo-belo, crna, zelena)' },
      stockSquare_en: { 333: '6 m (colours: galvanised, brown, burgundy, metallic silver, blue-white, black, green)' },
      system: { horizontal: ['oluk', 'kuka za oluk', 'dance (čelo oluka)', 'ugao oluka', 'ugaoni ukras'], vertical: ['kotlić', 'koleno', 'vertikalna cev', 'šelna'],
        horizontal_en: ['gutter', 'gutter bracket', 'gutter end cap', 'gutter corner', 'decorative corner piece'], vertical_en: ['hopper head', 'elbow', 'downpipe', 'downpipe clip'] },
      afteri: 'gaćasti držači (afteri) od lima po izboru naručioca',
      afteri_en: 'standing-seam clips (afteri) from sheet of the customer’s choice'
    },
    downpipes: {
      round: [ { d: 80, maxLen: 'do 6 m' }, { d: 100, maxLen: 'neograničeno (pocinkovane na željene dužine)' }, { d: 120, maxLen: 'do 6 m' }, { d: 150, maxLen: 'do 6 m' } ],
      round_en: [ { d: 80, maxLen: 'up to 6 m' }, { d: 100, maxLen: 'unlimited (galvanised, any length)' }, { d: 120, maxLen: 'up to 6 m' }, { d: 150, maxLen: 'up to 6 m' } ],
      roundMaterials: 'pocinkovani, pocinkovano bojeni, bakarni, aluminijumski, prohromski (prohromske do 2 m)',
      roundMaterials_en: 'galvanised, pre-painted galvanised, copper, aluminium, stainless steel (stainless steel up to 2 m)',
      square: ['10×10', '12×12', '12×10', '11×8'], squareUnit: 'cm',
      squareSpec: { thickness: 'do 0,6 mm (inox do 0,5 mm)', length: 'komadi po 6 m', materials: 'pocinkovani, pocinkovano bojeni, bakarni, aluminijumski; aluminijumski bojeni do 1 m; prohromski do 0,6 m',
        thickness_en: 'up to 0.6 mm (stainless steel up to 0.5 mm)', length_en: '6 m pieces', materials_en: 'galvanised, pre-painted galvanised, copper, aluminium; pre-painted aluminium up to 1 m; stainless steel up to 0.6 m' },
      stockRound: { 80: '4 m', 100: '4, 5 i 6 m', 120: '6 m' },
      stockRound_en: { 80: '4 m', 100: '4, 5 and 6 m', 120: '6 m' },
      stockSquare: { 333: '6 m' },
      stockColors: ['pocinkovane', 'braon', 'bordo', 'metaliza', 'prljavo bela', 'crna', 'zelena'],
      stockColors_en: ['galvanised', 'brown', 'burgundy', 'metallic silver', 'off-white', 'black', 'green']
    },

    /* Limarski profili i opšivke (F284–F288) */
    trims: [
      { name: 'Veter lajsna', t: 'do 0,8 mm (inox do 0,6 mm)', len: 'do 8,2 m', stock: 'pocinkovane, formati 333 i 500 mm, dužine 4, 5 i 6 m',
        name_en: 'Verge flashing', t_en: 'up to 0.8 mm (stainless steel up to 0.6 mm)', len_en: 'up to 8.2 m', stock_en: 'galvanised, sizes 333 and 500 mm, lengths 4, 5 and 6 m' },
      { name: 'Uvala', t: 'do 0,8 mm (inox do 0,6 mm)', len: 'do 8,2 m', stock: 'pocinkovane, format 500 mm, dužine 4, 5 i 6 m',
        name_en: 'Valley flashing', t_en: 'up to 0.8 mm (stainless steel up to 0.6 mm)', len_en: 'up to 8.2 m', stock_en: 'galvanised, size 500 mm, lengths 4, 5 and 6 m' },
      { name: 'Iksna', t: 'do 0,8 mm (inox do 0,6 mm)', len: 'do 8,2 m', stock: 'pocinkovane, formati 250 i 333 mm, dužine 4, 5 i 6 m',
        name_en: 'Penetration flashing', t_en: 'up to 0.8 mm (stainless steel up to 0.6 mm)', len_en: 'up to 8.2 m', stock_en: 'galvanised, sizes 250 and 333 mm, lengths 4, 5 and 6 m' },
      { name: 'Okapnica', t: 'do 0,8 mm (inox do 0,6 mm)', len: 'do 8,2 m', stock: 'isključivo po narudžbini',
        name_en: 'Eaves drip flashing', t_en: 'up to 0.8 mm (stainless steel up to 0.6 mm)', len_en: 'up to 8.2 m', stock_en: 'to order only' },
      { name: 'Opšivka dimnjaka', t: '0,5 mm', len: 'za sve dimenzije dimnjaka', stock: 'pocinkovana opšivka za dimnjak 40×40 cm',
        name_en: 'Chimney flashing', t_en: '0.5 mm', len_en: 'for all chimney sizes', stock_en: 'galvanised chimney flashing for a 40×40 cm chimney' }
    ],

    /* Limarska galanterija (F289, F519–F528) */
    galanterija: {
      colors: ['braon', 'bordo', 'metaliza', 'prljavo bela', 'crna', 'zelena', 'pocinkovano', 'bakar*', 'inox*'],
      colors_en: ['brown', 'burgundy', 'metallic silver', 'off-white', 'black', 'green', 'galvanised', 'copper*', 'stainless steel*'],
      colorNote: '* bakar i inox po narudžbini',
      colorNote_en: '* copper and stainless steel to order',
      holders: [ { f: 'F 250', dims: '4×25×430' }, { f: 'F 270', dims: '5×25×430 / 5×25×500' }, { f: 'F 333', dims: '5×25×500 / 5×25×600' }, { f: 'F 400', dims: '5×30×600 / 5×30×730' }, { f: 'F 333 četvrtasti', dims: '5×25×500 / 5×25×600' } ],
      holders_en: [ { f: 'F 250', dims: '4×25×430' }, { f: 'F 270', dims: '5×25×430 / 5×25×500' }, { f: 'F 333', dims: '5×25×500 / 5×25×600' }, { f: 'F 400', dims: '5×30×600 / 5×30×730' }, { f: 'F 333 box', dims: '5×25×500 / 5×25×600' } ],
      holdersNote: 'bakarni držači: F 270, F 333 i F 333 četvrtasti; druge dimenzije i boje po dogovoru',
      holdersNote_en: 'Copper brackets: F 270, F 333 and F 333 box; other dimensions and colours by arrangement',
      ends: { formats: ['poluokruglo F 250', 'F 270', 'F 333', 'F 400', 'četvrtasto F 333'], quick: 'brzomontirajuća danca samo za poluokruglo F 333',
        formats_en: ['half-round F 250', 'F 270', 'F 333', 'F 400', 'box F 333'], quick_en: 'quick-fit end caps for half-round F 333 only' },
      outlets: ['F 250/80', 'F 270/80', 'F 333/80', 'F 333/100', 'F 333/120', 'F 400/120', 'F 400/150'],
      protectors: 'za kraj oluka i za vinkl, sve boje (uključujući belo), bakar i inox',
      protectors_en: 'for the gutter end and for the gutter corner, all colours (including white), copper and stainless steel',
      corners: { formats: ['F 250', 'F 270', 'F 333', 'F 400'], kinds: 'spoljni i unutrašnji', kinds_en: 'external and internal' },
      elbows: { sizes: ['Ø80', 'Ø100', 'Ø120', 'Ø150'], note: 'bakar i inox do Ø120', note_en: 'copper and stainless steel up to Ø120' },
      clampsRound: [ { d: 'Ø80', pin: '—', dowel: '100 / 150' }, { d: 'Ø100', pin: '100 / 150 / 200', dowel: '100 / 150 / 200' }, { d: 'Ø120', pin: '150 / 200', dowel: '100 / 150 / 200' } ],
      clampsSquare: { formats: ['F 250', 'F 270', 'F 312', 'F 333', 'F 417', 'F 500', 'F 625'], dowel: '100 / 150 / 200' },
      snowGuards: [ { tile: 'tegola', colors: 'zelena, braon, bordo, crna', t: '0,5 mm' }, { tile: 'biber', colors: 'pocinkovano, braon, bordo, bakar', t: '1 mm' }, { tile: 'kikinda', colors: 'pocinkovan, braon, bordo, metaliza, bakar', t: '1 mm' }, { tile: 'bečej', colors: 'pocinkovan, braon, bordo, metaliza, bakar', t: '1 mm' }, { tile: 'tondach', colors: 'pocinkovan, braon, bordo, metaliza, bakar', t: '1 mm' } ],
      snowGuards_en: [ { tile: 'Tegola', colors: 'green, brown, burgundy, black', t: '0.5 mm' }, { tile: 'beaver-tail', colors: 'galvanised, brown, burgundy, copper', t: '1 mm' }, { tile: 'Kikinda', colors: 'galvanised, brown, burgundy, metallic silver, copper', t: '1 mm' }, { tile: 'Bečej', colors: 'galvanised, brown, burgundy, metallic silver, copper', t: '1 mm' }, { tile: 'Tondach', colors: 'galvanised, brown, burgundy, metallic silver, copper', t: '1 mm' } ],
      afteri: { what: 'pri pokrivanju ravnim limom pričvršćuju dva susedna lima za podlogu neposredno pre falcovanja', colors: 'pocinkovani, bakarni, beli, prljavo beli, braon, bordo, zeleni, crni, metaliza, plavi',
        what_en: 'used in flat-sheet roofing to fix two adjacent sheets to the substrate just before seaming', colors_en: 'galvanised, copper, white, off-white, brown, burgundy, green, black, metallic silver, blue' },
      nailCaps: { what: 'sakrivaju glavu eksera pri montaži građevinske limarije', kinds: [ { k: 'pocinkovane', c: '—' }, { k: 'pocinkovano bojene', c: 'bela, prljavo bela, braon, bordo, metaliza, crna, zelena, plava' }, { k: 'aluminijumske', c: 'nebojene, braon, bela, metaliza' }, { k: 'bakarne', c: '—' }, { k: 'inox', c: 'ogledalo, mat, brušene' } ],
        what_en: 'They hide the nail heads when building sheet-metal work is installed', kinds_en: [ { k: 'galvanised', c: '—' }, { k: 'pre-painted galvanised', c: 'white, off-white, brown, burgundy, metallic silver, black, green, blue' }, { k: 'aluminium', c: 'unpainted, brown, white, metallic silver' }, { k: 'copper', c: '—' }, { k: 'stainless steel', c: 'mirror, matt, brushed' } ] }
    },

    /* Limovi – lager i kvaliteti (F301–F321, F529–F545) */
    sheets: {
      formats: ['1000×2000', '1250×2500', '1500×3000'],
      formats_en: ['1,000×2,000', '1,250×2,500', '1,500×3,000'],
      legend: 'tabele prikazuju standardne dimenzije; raspoloživost na lageru proverite sa prodajom (roba na lageru / nabavka po dogovoru)',
      legend_en: 'the tables show standard dimensions; check stock availability with sales (goods in stock / supply by arrangement)',
      galv: {
        range: '0,4–2 mm, svi formati', zinc: '140, 200 i 275 g/m²', standards: 'EN 10142, EN 10327',
        range_en: '0.4–2 mm, all formats', zinc_en: '140, 200 and 275 g/m²',
        quality: [ ['DX51D+Z', '1.0226', 'FePO2 G Z', 'St 02 Z', 'C Zn02'], ['DX53D+Z', '1.0355', 'FePO5 G Z', 'St 05 Z', 'C Zn04'], ['DX54D+Z', '1.0306', 'FePO6 G Z', 'St 06 Z', 'C Zn05'] ],
        qualityHead: ['EN 10142:2000', 'EN 10142:1991', 'DIN 17162-1', 'SRPS C.B4.025', ''],
        mech: [ ['DX51D', '—', '≤ 500', '22'], ['DX53D', '≤ 260', '≤ 380', '30'], ['DX54D', '≤ 220', '≤ 350', '36'] ],
        mechHead: ['Oznaka', 'Re N/mm²', 'Rm N/mm²', 'A %'],
        mechHead_en: ['Grade', 'Re N/mm²', 'Rm N/mm²', 'A %'],
        coil: [ [0.45, 3.6, '1000 / 1250'], [0.50, 4.0, '1000 / 1250'], [0.55, 4.4, '1000 / 1250'], [0.60, 4.8, '1000 / 1250'], [0.70, 5.6, '1000 / 1250'], [0.80, 6.4, '1000 / 1250 / 1500'], [1.00, 8.0, '1000 / 1250 / 1500'], [1.20, 9.6, '1000 / 1250 / 1500'], [1.50, 12.0, '1000 / 1250 / 1500'], [2.00, 16.0, '1000 / 1250 / 1500'], [3.00, 24.0, '1000 / 1250 / 1500'], [4.00, 32.0, '1000 / 1250 / 1500'] ],
        coil_en: [ [0.45, 3.6, '1,000 / 1,250'], [0.50, 4.0, '1,000 / 1,250'], [0.55, 4.4, '1,000 / 1,250'], [0.60, 4.8, '1,000 / 1,250'], [0.70, 5.6, '1,000 / 1,250'], [0.80, 6.4, '1,000 / 1,250 / 1,500'], [1.00, 8.0, '1,000 / 1,250 / 1,500'], [1.20, 9.6, '1,000 / 1,250 / 1,500'], [1.50, 12.0, '1,000 / 1,250 / 1,500'], [2.00, 16.0, '1,000 / 1,250 / 1,500'], [3.00, 24.0, '1,000 / 1,250 / 1,500'], [4.00, 32.0, '1,000 / 1,250 / 1,500'] ],
        sheet: [ [0.40, 3.2], [0.50, 4.0], [0.60, 4.8], [0.70, 5.6], [0.80, 6.4], [0.90, 7.2], [1.00, 8.0], [1.20, 9.6], [1.50, 12.0], [2.00, 16.0], [2.50, 20.0], [3.00, 24.0] ],
        slit: '0,50 mm: 200, 250, 270, 312, 333, 375, 417, 500, 625 mm',
        slit_en: '0.50 mm: 200, 250, 270, 312, 333, 375, 417, 500, 625 mm',
        formatsRS: 'limarski formati RŠ 200, 250, 333, 375, 417, 500 i 625 mm uz standardne širine 1000 i 1250 mm; 0,5 / 0,55 mm uvek na lageru',
        formatsRS_en: 'Sheet-metal strip formats with developed widths of 200, 250, 333, 375, 417, 500 and 625 mm, besides the standard widths of 1,000 and 1,250 mm; 0.5 / 0.55 mm always in stock',
        services: ['sečenje iz kotura na potrebnu dužinu', 'sečenje table na zahtevane dimenzije', 'slitovanje (podužno sečenje)'],
        services_en: ['cutting from coil to the required length', 'cutting sheets to the required dimensions', 'slitting (longitudinal cutting)']
      },
      colored: {
        note: 'bojeni pocinkovani lim 0,5 mm nosi kao bojeni aluminijum 0,75 mm; jeftiniji, odlično zaštićen',
        note_en: 'pre-painted galvanised sheet 0.5 mm carries as much as pre-painted aluminium 0.75 mm; cheaper and very well protected',
        thick: 'najčešće 0,45 / 0,5 / 0,55 mm, ređe 0,6 / 0,7 / 0,8 mm', weights: '0,5 mm – 4,0 kg/m²; 0,55 – 4,4; 0,6 – 4,8',
        thick_en: 'most often 0.45 / 0.5 / 0.55 mm, less often 0.6 / 0.7 / 0.8 mm', weights_en: '0.5 mm – 4.0 kg/m²; 0.55 – 4.4; 0.6 – 4.8',
        layers: ['poliester 25 µm', 'prajmer 8 µm', 'neutralizacioni sloj 6 µm', 'sloj cinka', 'čelik 0,50 mm', 'sloj cinka', 'neutralizacioni sloj 6 µm', 'prajmer 8 µm (naličje)'],
        layers_en: ['polyester 25 µm', 'primer 8 µm', 'pretreatment layer 6 µm', 'zinc layer', 'steel 0.50 mm', 'zinc layer', 'pretreatment layer 6 µm', 'primer 8 µm (reverse side)'],
        coilOneSide: [ ['9002', 'prljavo bela', '0,50×1250 / 0,60×1250'], ['9016', 'bela', '0,50×1250'], ['9006', 'metaliza', '0,50×1250 / 0,60×1250'], ['7016', 'miš siva', '0,50×1250'], ['TDM', 'braon', '0,50×1250 / 0,60×1250'], ['6028', 'tamno zelena', '0,50×1250'], ['6002', 'svetlo zelena', '0,55×1250'], ['6011', 'SMB zelena', '0,50×1250'], ['3009', 'bordo', '0,50×1250 / 0,60×1250'], ['5010', 'tamno plava', '0,50×1250'], ['5015', 'svetlo plava', '0,50×1250'], ['9005', 'crna', '0,50×1250'], ['3020', 'crvena', '0,50×1250'], ['TDM reljefni', 'tamno braon', '0,50×1250'], ['9005 reljefni', 'crna', '0,50×1250'], ['—', 'imitacija drveta', '0,50×1250'] ],
        coilOneSide_en: [ ['9002', 'off-white', '0.50×1,250 / 0.60×1,250'], ['9016', 'white', '0.50×1,250'], ['9006', 'metallic silver', '0.50×1,250 / 0.60×1,250'], ['7016', 'anthracite grey', '0.50×1,250'], ['TDM', 'brown', '0.50×1,250 / 0.60×1,250'], ['6028', 'dark green', '0.50×1,250'], ['6002', 'light green', '0.55×1,250'], ['6011', 'SMB green', '0.50×1,250'], ['3009', 'burgundy', '0.50×1,250 / 0.60×1,250'], ['5010', 'dark blue', '0.50×1,250'], ['5015', 'light blue', '0.50×1,250'], ['9005', 'black', '0.50×1,250'], ['3020', 'red', '0.50×1,250'], ['TDM textured', 'dark brown', '0.50×1,250'], ['9005 textured', 'black', '0.50×1,250'], ['—', 'wood effect', '0.50×1,250'] ],
        slitOneSide: '0,5 × 333 / 417 / 500 mm: RAL 9002, 9016, 9006, 3009, 9005, reljefni TDM, reljefni 9005, imitacija drveta; TDM braon i 250 / 375 / 625 mm',
        slitOneSide_en: 'Slit strip 0.5 × 333 / 417 / 500 mm: RAL 9002, 9016, 9006, 3009, 9005, textured TDM, textured 9005, wood effect; TDM brown also 250 / 375 / 625 mm',
        coilTwoSide: 'obostrano bojeni kotur 0,50×1000: RAL 9002, 9006, TDM, 6028, 3009, 9005',
        coilTwoSide_en: 'Coil painted on both sides 0.50×1,000: RAL 9002, 9006, TDM, 6028, 3009, 9005',
        slitTwoSide: 'obostrano bojeni slit 0,5 × 271 / 333 / 396 mm (iste boje); TDM braon i 250 / 270 / 375 / 417 / 500 / 625 mm',
        slitTwoSide_en: 'slit strip painted on both sides 0.5 × 271 / 333 / 396 mm (same colours); TDM brown also 250 / 270 / 375 / 417 / 500 / 625 mm',
        bigger: 'veće količine u boji po želji iz RAL karte – po dogovoru sa proizvođačem',
        bigger_en: 'Larger quantities in any colour from the RAL chart – by arrangement with the manufacturer',
        ralCard: [ { ral: '9002', name: 'prljavo bela' }, { ral: '9006', name: 'metaliza' }, { ral: '8019', name: 'braon' }, { ral: '6002', name: 'zelena' }, { ral: '6026', name: 'zelena' }, { ral: '6028', name: 'zelena' }, { ral: '3009', name: 'bordo' }, { ral: '5010', name: 'plava' }, { ral: '5015', name: 'plava' } ],
        ralCard_en: [ { ral: '9002', name: 'off-white' }, { ral: '9006', name: 'metallic silver' }, { ral: '8019', name: 'brown' }, { ral: '6002', name: 'green' }, { ral: '6026', name: 'green' }, { ral: '6028', name: 'green' }, { ral: '3009', name: 'burgundy' }, { ral: '5010', name: 'blue' }, { ral: '5015', name: 'blue' } ],
        /* standardne boje plastificiranog bojenog lima — spisak klijenta (2026-11); nazivi boja iz postojećih tabela.
           Širine po boji: čeka se poseban spisak klijenta (tabela coilOneSide ostaje kakva jeste). */
        standard: [ { ral: '8019', name: 'braon' }, { ral: '7016', name: 'miš siva' }, { ral: '9005', name: 'crna' }, { ral: '9006', name: 'metaliza' }, { ral: '3009', name: 'bordo' }, { ral: '9002', name: 'prljavo bela' }, { ral: '6028', name: 'tamno zelena' } ],
        standard_en: [ { ral: '8019', name: 'brown' }, { ral: '7016', name: 'anthracite grey' }, { ral: '9005', name: 'black' }, { ral: '9006', name: 'metallic silver' }, { ral: '3009', name: 'burgundy' }, { ral: '9002', name: 'off-white' }, { ral: '6028', name: 'dark green' } ]
      },
      alu: {
        range: 'kotur 0,6–0,8 mm (širine 1000–1250 mm); table 1–5 mm (širine 1000–1500 mm); polutvrdi aluminijum',
        range_en: 'Coil 0.6–0.8 mm (widths 1,000–1,250 mm); sheets 1–5 mm (widths 1,000–1,500 mm); half-hard aluminium.',
        coil: [ [0.6, 1.65, '1000 / 1250'], [0.7, 1.90, '1000 / 1250'], [1.0, 2.75, '1000'] ],
        coil_en: [ [0.6, 1.65, '1,000 / 1,250'], [0.7, 1.90, '1,000 / 1,250'], [1.0, 2.75, '1,000'] ],
        coilColored: { sizes: '0,6×1000, 0,6×1250, 0,7×1000, 0,7×1250', colors: 'RAL 9010 bela, 8019 braon, 5010 plava, 3009 bordo, 9002 prljavo bela, 9006 metalik siva; jednostrano ili obostrano, sa i bez folije',
          sizes_en: '0.6×1,000, 0.6×1,250, 0.7×1,000, 0.7×1,250', colors_en: 'RAL 9010 white, 8019 brown, 5010 blue, 3009 burgundy, 9002 off-white, 9006 metallic grey; painted on one or both sides, with or without protective film' },
        sheet: [ [1.0, 2.7], [1.2, 3.25], [1.5, 4.1], [2.0, 5.4], [3.0, 8.1], [4.0, 10.8], [5.0, 13.5] ],
        ribbed: [ ['1,2/1,7', 3.65, '1000×2000'], ['1,5/2,5', 4.50, 'svi formati'], ['2/3', 6.00, 'svi formati'], ['3/4', 8.50, 'svi formati'], ['4/5', 11.00, 'svi formati'], ['5/6', 13.10, 'svi formati'] ],
        ribbed_en: [ ['1.2/1.7', 3.65, '1,000×2,000'], ['1.5/2.5', 4.50, 'all formats'], ['2/3', 6.00, 'all formats'], ['3/4', 8.50, 'all formats'], ['4/5', 11.00, 'all formats'], ['5/6', 13.10, 'all formats'] ]
      },
      copper: {
        use: 'krovni pokrivač, limarija, od skoro i obloge fasada', quality: 'polutvrdi bakar za limarsku galanteriju',
        use_en: 'roofing, sheet-metal work and, more recently, façade cladding', quality_en: 'Half-hard copper for sheet-metal roofing accessories',
        coil: [ [0.50, 4.55, '1000'], [0.55, 5.00, '1000'], [0.60, 5.45, '1000'] ],
        coil_en: [ [0.50, 4.55, '1,000'], [0.55, 5.00, '1,000'], [0.60, 5.45, '1,000'] ],
        slit: '0,50 i 0,55 × 270 / 333 / 396 / 600 mm; 0,60 × 600 mm',
        slit_en: '0.50 and 0.55 × 270 / 333 / 396 / 600 mm; 0.60 × 600 mm',
        sheet: [ [0.50, 4.50], [0.55, 5.00], [0.80, 7.27], [1.00, 9.09], [1.20, 10.91], [1.50, 13.64], [2.00, 18.18], [3.00, 27.27], [4.00, 36.36], [5.00, 45.45] ],
        sheetFormat: '1000×2000', lamperija: 'bakarna lamperija',
        sheetFormat_en: '1,000×2,000', lamperija_en: 'copper cladding panels'
      },
      hvl: {
        range: '0,4–2,5 mm, širine 1000 ili 1250 mm; kvalitet DC01 (JUS Č0146)',
        range_en: '0.4–2.5 mm, widths 1,000 or 1,250 mm; grade DC01 (JUS Č0146)',
        quality: [ ['DC01 (FeP01)', '1.0330', 'St 12', 'Č0146'], ['DC03 (FeP03)', '1.0347', 'RRSt 13', 'Č0147'], ['DC04 (FeP04)', '1.0338', 'St 14', 'Č0148'] ],
        qualityHead: ['EN 10027-1', 'EN 10027-2', 'DIN 1623', 'JUS C.B4.016'],
        sheet: [ [0.40, 3.2], [0.50, 4.0], [0.60, 4.8], [0.70, 5.6], [0.80, 6.4], [0.90, 7.2], [1.00, 8.0], [1.20, 9.6], [1.50, 12.0], [2.00, 16.0], [2.50, 20.0], [3.00, 24.0] ]
      },
      tvl: {
        range: 'ravan 1,5–15 mm, širine 1000 / 1250 / 1500 mm; kvalitet S235JR (JUS Č0361)', formats: ['1000×2000', '1250×2500', '1500×3000', '1500×6000'],
        range_en: 'plain 1.5–15 mm, widths 1,000 / 1,250 / 1,500 mm; grade S235JR (JUS Č0361)', formats_en: ['1,000×2,000', '1,250×2,500', '1,500×3,000', '1,500×6,000'],
        quality: [ ['S235JR', 'S235JRG2', '1.0038', 'RSt 37-2', 'Č0361'], ['S275J2', 'S275J2G3', '1.0144', 'St 44-3 N', 'Č0453'], ['S355JO', 'S355JO', '1.0553', 'St 52-3 U', 'Č0562'], ['S355J2', 'S355J2G3', '1.0570', 'St 52-3 N', 'Č0563'] ],
        qualityHead: ['EN 10025-2', 'EN 10027-1', 'EN 10027-2', 'DIN 17100', 'SRPS C.B0.500*'], qualityNote: '* nije u upotrebi; umesto SRPS C.B0.500 važi SRPS EN 10025',
        qualityNote_en: '* withdrawn; SRPS C.B0.500 has been replaced by SRPS EN 10025',
        sheet: [ [1.5, 12], [2.0, 16], [2.5, 20], [3.0, 24], [4.0, 32], [5.0, 40], [6.0, 48], [7.0, 56], [8.0, 64], [9.0, 72], [10.0, 80], [12.0, 96], [15.0, 120], [20.0, 160], [25.0, 200], [30.0, 240] ],
        ribbed: { range: 'suza i romb 2–8 mm, širina 1500 mm, S235JR', sizes: ['2/3', '3/4', '3/4,5', '4/5', '5/6'], format: '1500×3000',
          range_en: 'teardrop and diamond pattern 2–8 mm, width 1,500 mm, S235JR', sizes_en: ['2/3', '3/4', '3/4.5', '4/5', '5/6'], format_en: '1,500×3,000' },
        processing: 'sečenje na meru: makaze do 13 mm, plazma do 30 mm; savijanje na presi do 10 mm; rundovanje do 4 mm na dužini 2000 mm',
        processing_en: 'Cutting to size: guillotine shear up to 13 mm, plasma up to 30 mm; press brake bending up to 10 mm; plate rolling up to 4 mm over a length of 2,000 mm'
      },
      inox: {
        quality: [ ['X6Cr17', '1.4016', 'Č4174'], ['X5CrNi18-10', '1.4301', 'Č4580'], ['X5CrNiMo17-12-2', '1.4401', 'Č4573'] ], qualityHead: ['EN 10027-1', 'EN 10027-2', 'JUS C.B0.600'],
        kinds: 'kiselootporni i vodootporni; sa i bez folije; površina mat, ogledalo, brušeno',
        kinds_en: 'acid-resistant and water-resistant; with or without protective film; matt, mirror or brushed finish',
        coil: '0,5 i 0,6 × 1000 / 1250 mm; slit 0,5×333 mm', sheet: '0,8 / 1 / 1,5 / 2 / 3 / 4 mm u 1000×2000, 1250×2500, 1500×3000', note: 'ostale dimenzije i debljine po dogovoru', lamperija: 'prohromska lamperija',
        coil_en: '0.5 and 0.6 × 1,000 / 1,250 mm; slit strip 0.5×333 mm', sheet_en: '0.8 / 1 / 1.5 / 2 / 3 / 4 mm in 1,000×2,000, 1,250×2,500, 1,500×3,000', note_en: 'other dimensions and thicknesses by arrangement', lamperija_en: 'stainless steel cladding panels'
      }
    },

    /* Cevi i ZP profili (F330–F352, F546–F549) */
    tubes: {
      square: { range: '13×13 – 150×150 mm', length: '6 m', wall: '1–8 mm (tabela masa)', standards: 'JUS C.B5.249, DIN 2395, DIN 59411, GOST 8639, ISO 4019, GOST 13663, NF A 49-652/654', masses: 'EN 10219-1/2, EN 10305-5', sample: [ ['20×20×2', 1.130], ['30×30×2', 1.758], ['40×40×2', 2.386], ['50×50×3', 4.275], ['60×60×3', 5.217], ['80×80×3', 7.101], ['100×100×4', 11.78] ],
        wall_en: '1–8 mm (weight table)' },
      rect: { range: '10×20 – 100×200 mm', length: '6 m', sample: [ ['40×20×2', 1.758], ['50×30×2', 2.386], ['60×40×2', 3.014], ['80×40×3', 5.217], ['100×50×3', 6.159], ['120×80×4', 11.78] ] },
      uses: ['metalni nameštaj', 'bravarija', 'lake čelične konstrukcije', 'automobili i kamioni', 'poljoprivredne mašine i alatke', 'mašinogradnja', 'široka potrošnja'],
      uses_en: ['metal furniture', 'metal fabrication', 'light steel structures', 'cars and lorries', 'agricultural machinery and tools', 'mechanical engineering', 'consumer goods'],
      shape: 'zaobljene ivice r = 1,5 s (po zahtevu r = s)',
      shape_en: 'rounded edges r = 1.5 s (on request r = s)',
      material: ['hladnovaljana traka Č.0146 / 0147 / 0148 (DC01–DC04, DIN 1623), zid 1–2 mm', 'toplovaljana traka (DIN 1614), zid 2–4 mm', 'toplovaljana traka Č.0361 (RSt 37-2, DIN 17100), zid 2–4 mm'],
      material_en: ['cold-rolled strip Č.0146 / 0147 / 0148 (DC01–DC04, DIN 1623), wall 1–2 mm', 'hot-rolled strip (DIN 1614), wall 2–4 mm', 'hot-rolled strip Č.0361 (RSt 37-2, DIN 17100), wall 2–4 mm'],
      blackRound: { range: '3/8" – 3" (colovne), veći preseci po narudžbini', standards: 'JUS C.B5.225, DIN 2440, GOST 3262, UNI 6363, BS 1387, ISO 65, ASTM A120, Schedule 40',
        range_en: '3/8" – 3" (inch sizes), larger sizes to order',
        kinds: ['konstrukcione (neispitane), zid 1,5–2,5 mm', 'hidroispitane, zid preko 2 mm, sa atestom'], makers: 'Unis Derventa, Fahop Aleksinac',
        kinds_en: ['structural (untested), wall 1.5–2.5 mm', 'hydrostatically tested, wall over 2 mm, with test certificate'],
        uses: 'instalacije za fluide, aparati i sudovi, čelične konstrukcije, građevinarstvo, poljoprivredne mašine', thread: 'na krajevima može da se nareže cevni navoj', material: 'toplovaljana traka Č.0361 (JUS C.B0.500 / RSt 37-2)',
        uses_en: 'fluid installations, apparatus and vessels, steel structures, construction, agricultural machinery', thread_en: 'the ends can be pipe-threaded', material_en: 'hot-rolled strip Č.0361 (JUS C.B0.500 / RSt 37-2)',
        test: 'hidraulično ispitivanje nepropustljivosti po JUS C.A4.024, ispitni pritisak 50 bar', delivery: ['hladnovaljane svetlo tvrde (S)', 'hladnovaljane meko žarene (SM)', 'bez unutrašnjeg vara iznad 1"', 'obrađeni krajevi', 'ravnoća 1 mm/m'],
        test_en: 'hydraulic leak test to JUS C.A4.024, test pressure 50 bar', delivery_en: ['cold-rolled, bright hard (S)', 'cold-rolled, soft annealed (SM)', 'no internal weld bead above 1"', 'finished ends', 'straightness 1 mm/m'] },
      galvRound: { range: '1/2" – 2", zid 2,5 mm i deblje', stock: ['1/2"', '3/4"', '1"', '5/4"', '2"'], length: 6000,
        range_en: '1/2" – 2", wall 2.5 mm and thicker' },
      zp: { sizes: '35×35 i 50×30 mm (najčešće)', length: '6 m', shapes: [ ['1004', '65×34', 2.83, 'serija 34'], ['1104', '65×34', 2.90, 'serija 34'], ['1204', '65×34', 2.90, 'serija 34'], ['1304', '50×34', 2.40, 'serija 34'], ['1604', '65×34', 3.00, 'serija 34'], ['1704', '35×34', null, 'serija 34'], ['1804', '50×34', 2.50, 'serija 34'], ['1021', '60×50', 3.13, 'serija 50'], ['1121', '60×50', 2.74, 'serija 50'], ['1221', '60×50', 3.24, 'serija 50'], ['1321', '45×50', 2.75, 'serija 50'] ],
        sizes_en: '35×35 and 50×30 mm (most common)',
        shapes_en: [ ['1004', '65×34', 2.83, 'series 34'], ['1104', '65×34', 2.90, 'series 34'], ['1204', '65×34', 2.90, 'series 34'], ['1304', '50×34', 2.40, 'series 34'], ['1604', '65×34', 3.00, 'series 34'], ['1704', '35×34', null, 'series 34'], ['1804', '50×34', 2.50, 'series 34'], ['1021', '60×50', 3.13, 'series 50'], ['1121', '60×50', 2.74, 'series 50'], ['1221', '60×50', 3.24, 'series 50'], ['1321', '45×50', 2.75, 'series 50'] ] },
      precision: { who: 'specijalizovani proizvođači metalnog nameštaja i enterijera – nabavka za poznatog kupca', maker: 'Unis Derventa', length: 'paletirane, 6 m (druge dužine po narudžbini)',
        who_en: 'Specialised manufacturers of metal furniture and interiors – supplied to order for a known customer', length_en: 'palletised, 6 m (other lengths to order)',
        round: { standards: 'JUS C.B5.050/250, DIN 2394, GOST 9567/8734, UNI 7947, BS 3059, NF A 49-644/642', uses: 'automobili, bicikli, metalni nameštaj, enterijeri, sanitarni uređaji, konstrukcije', note: 'tačnost mere, dobro stanje površine, mala debljina zida; bez unutrašnjeg vara od Ø28', range: 'Ø16 – Ø114,3 mm, zid 1,0–4,0 mm', sample: [ ['Ø20×1,5', 0.684], ['Ø25×1,5', 0.869], ['Ø30×2', 1.381], ['Ø40×2', 1.874], ['Ø50×2', 2.367], ['Ø60,3×2', 2.900] ],
          uses_en: 'Cars, bicycles, metal furniture, interiors, sanitary fittings, structures', note_en: 'Dimensional accuracy, good surface condition, thin wall; no internal weld bead from Ø28', range_en: 'Ø16 – Ø114.3 mm, wall 1.0–4.0 mm', sample_en: [ ['Ø20×1.5', 0.684], ['Ø25×1.5', 0.869], ['Ø30×2', 1.381], ['Ø40×2', 1.874], ['Ø50×2', 2.367], ['Ø60.3×2', 2.900] ] },
        oval: { standards: 'JUS C.B5.249, DIN 2395, GOST 8644/8642', shape: 'pljosnato ovalne, zid 1–2 mm', uses: 'metalni nameštaj, enterijeri', masses: [ ['23,5×14×1,5', 0.758], ['30×15×2,0', 1.136], ['36×18×1,2', 0.646], ['36×18×1,5', 1.048], ['36×18×2', 1.320], ['47×25×1,5', 1.424], ['47×25×1,8', 1.696], ['47×25×2', 1.874], ['64,5×25×1,5', 1.798], ['64,5×14×1,8', 2.100], ['64,5×25×2', 2.359] ], note: 'druge dimenzije po posebnom dogovoru',
          shape_en: 'flat oval, wall 1–2 mm', uses_en: 'Metal furniture, interiors', masses_en: [ ['23.5×14×1.5', 0.758], ['30×15×2.0', 1.136], ['36×18×1.2', 0.646], ['36×18×1.5', 1.048], ['36×18×2', 1.320], ['47×25×1.5', 1.424], ['47×25×1.8', 1.696], ['47×25×2', 1.874], ['64.5×25×1.5', 1.798], ['64.5×14×1.8', 2.100], ['64.5×25×2', 2.359] ], note_en: 'other dimensions by special arrangement' } }
    },

    /* Čelični profili (F353–F361, F550–F557) */
    steel: {
      sale: 'profili se prodaju celi ili sečeni na pola; uslužno sečenje po specifikaciji; druge dimenzije po dogovoru',
      sale_en: 'Sections are sold whole or cut in half; cutting service to specification; other dimensions by arrangement',
      quality: [ ['S235JRG2', '1.0038', 'S235JR', 'RSt 37-2', 'Č0361'], ['S275J2G3', '1.0144', 'S275J2', 'St 44-3 N', 'Č0453'], ['S355JO', '1.0553', 'S355JO', 'St 52-3 U', 'Č0562'], ['S355J2G3', '1.0570', 'S355J2', 'St 52-3 N', 'Č0563'] ],
      qualityHead: ['EN 10027-1', 'EN 10027-2', 'EN 10025-2', 'DIN 17100', 'SRPS C.B0.500'],
      flatQuality: [ ['S235JRG2', '1.0038', 'S235JR', 'RSt 37-2', 'Č0361'], ['S235JO', '1.0114', 'S235JO', 'St 37-3 U', 'Č0362'], ['S235JRG3', '1.0116', 'S235J2', 'St 37-3 N', 'Č0363'], ['S275JR', '1.0044', 'S275JR', 'St 44-2', 'Č0451'], ['S275JO', '1.0143', 'S275JO', 'St 44-3 U', 'Č0452'], ['S275J2G3', '1.0144', 'S275J2', 'St 44-3 N', 'Č0453'], ['S355JR', '1.0045', 'S355JR', '—', 'Č0561'], ['S355JO', '1.0553', 'S355JO', 'St 52-3 U', 'Č0562'], ['S355J2G3', '1.0570', 'S355J2', 'St 52-3 N', 'Č0563'] ],
      L: { standard: 'EN 10056-1', count: 42, range: '20×20×3 (0,882 kg/m) – 200×200×24 (71,1 kg/m)', sample: [ ['20×20×3', 0.882], ['25×25×3', 1.12], ['30×30×3', 1.36], ['40×40×4', 2.42], ['50×50×5', 3.77], ['60×60×6', 5.42], ['80×80×8', 9.63], ['100×100×10', 15.0], ['120×120×12', 21.6], ['150×150×15', 33.8], ['200×200×20', 59.9] ],
        range_en: '20×20×3 (0.882 kg/m) – 200×200×24 (71.1 kg/m)' },
      U: { range: 'UNP 30×15 (1,74 kg/m) – UNP 400 (74 kg/m), 24 dimenzije', sample: [ ['UNP 40×20', 2.87], ['UNP 50', 5.59], ['UNP 65', 7.09], ['UNP 80', 8.9], ['UNP 100', 10.9], ['UNP 120', 13.7], ['UNP 140', 16.4], ['UNP 160', 19.3], ['UNP 200', 26], ['UNP 240', 34], ['UNP 300', 48] ],
        range_en: 'UNP 30×15 (1.74 kg/m) – UNP 400 (74 kg/m), 24 sizes' },
      I: { range: 'INP 80 (5,94 kg/m) – INP 600 (199 kg/m)', quality: 'S235JRG2, S275JR, S355J2G3 po EN 10025', sample: [ ['INP 80', 5.94], ['INP 100', 8.34], ['INP 120', 11.1], ['INP 140', 14.3], ['INP 160', 17.9], ['INP 180', 21.9], ['INP 200', 26.2], ['INP 240', 36.2], ['INP 300', 54.2] ],
        range_en: 'INP 80 (5.94 kg/m) – INP 600 (199 kg/m)', quality_en: 'S235JRG2, S275JR, S355J2G3 to EN 10025' },
      flat: { tvl: { length: 3000, sizes: ['2×20', '2×25', '2×30', '2,5×25', '2,5×30', '3×17', '3×20', '3×25', '3×30', '3×40', '3×50', '3×60', '4×20', '4×25', '4×30', '4×40', '4×50', '4×60', '4,5×25', '5×20', '5×25', '5×30', '5×40', '5×50', '5×60'],
                     sizes_en: ['2×20', '2×25', '2×30', '2.5×25', '2.5×30', '3×17', '3×20', '3×25', '3×30', '3×40', '3×50', '3×60', '4×20', '4×25', '4×30', '4×40', '4×50', '4×60', '4.5×25', '5×20', '5×25', '5×30', '5×40', '5×50', '5×60'] },
              drawn: { range: '4–8 mm × 20–50 mm, dužine 6000 mm', sizes: ['4×40', '5×14 (3970)', '5×20', '5×30', '5×40', '6×12', '8×30', '8×40', '10×20'],
                       range_en: '4–8 mm × 20–50 mm, lengths 6,000 mm', sizes_en: ['4×40', '5×14 (3,970)', '5×20', '5×30', '5×40', '6×12', '8×30', '8×40', '10×20'] },
              grif: { range: '4–10 mm × 12–50 mm, dužine do 6 m', note: 'pored klasičnog grifovanja i graviranje (šaranje) u dezenima po širini; savijanje u lukove po specifikaciji',
                      range_en: '4–10 mm × 12–50 mm, lengths up to 6 m', note_en: 'besides classic embossing, also engraved patterns across the width; arc bending to specification' } },
      firkant: { range: '6×6 – 20×20 mm, dužine do 6000 mm, kvalitet S235 (Č0361)', note: 'celi ili na pola; preko 40×40 na tačnu meru', stock: '10 / 12 / 14 / 16 / 20 mm',
        range_en: '6×6 – 20×20 mm, lengths up to 6,000 mm, grade S235 (Č0361)', note_en: 'whole or cut in half; above 40×40 cut to exact size',
        rows: [ ['6×6', 0.283], ['8×8', 0.502], ['10×10', 0.785], ['12×12', 1.13], ['14×14', 1.54], ['16×16', 2.01], ['18×18', 2.54], ['20×20', 3.14], ['22×22', 3.80], ['25×25', 4.91], ['30×30', 7.07], ['35×35', 9.62], ['40×40', 12.6], ['50×50', 19.6], ['60×60', 28.3] ] },
      hop: { press: 'hidraulična presa 200 t', limits: 'profili do 10 mm debljine i do 3100 mm dužine, po specifikaciji', material: 'svi čelici koji dozvoljavaju hladno oblikovanje, najčešće toplovaljana traka po EN 10025',
        press_en: 'hydraulic press brake 200 t', limits_en: 'sections up to 10 mm thick and up to 3,100 mm long, to specification', material_en: 'all steels suitable for cold forming, most often hot-rolled strip to EN 10025',
        minBend: [ ['do 1', 5], ['1–2', 10], ['2–4', 19], ['4–5', 24], ['5–7', 30], ['7–8', 40], ['8–10', 70] ],
        minBend_en: [ ['up to 1', 5], ['1–2', 10], ['2–4', 19], ['4–5', 24], ['5–7', 30], ['7–8', 40], ['8–10', 70] ] },
      drawnRound: { note: 'celi ili na pola; preko Ø20 na tačnu meru', length: 6000, rows: [ ['Ø5', 0.150], ['Ø6', 0.220], ['Ø8', 0.400], ['Ø10', 0.617], ['Ø12', 0.888], ['Ø14', 1.020], ['Ø16', 1.580], ['Ø20', 2.470], ['Ø22', 2.980], ['Ø25', 3.850], ['Ø28', 4.830] ],
        note_en: 'whole or cut in half; above Ø20 cut to exact size' },
      grifTubes: { square: '15×15 – 60×60 mm, zid 2–3 mm', rect: '20×30 – 40×60 mm, zid 2–3 mm',
        square_en: '15×15 – 60×60 mm, wall 2–3 mm', rect_en: '20×30 – 40×60 mm, wall 2–3 mm' }
    },

    /* Žice, pletiva, rešetke (F175–F177, F364–F369, F558–F559) */
    wire: {
      grifMesh: 'grifovano pletivo od svetlo vučene žice, različiti prečnici i okca; ograde, kapije, gelenderi, metalni nameštaj; veće količine do 2000 × 6000 mm',
      grifMesh_en: 'embossed wire mesh of bright-drawn wire, various wire diameters and mesh sizes; fences, gates, railings, metal furniture; larger quantities up to 2,000 × 6,000 mm',
      sulc: 'šulc mreža za cementne košuljice: žica 2 mm, 1000 × 2000 mm',
      sulc_en: 'welded mesh for cement screeds: wire 2 mm, 1,000 × 2,000 mm',
      annealed: 'paljena žica – žarena na 680–700 °C u zaštitnoj atmosferi, meka i savitljiva; vezivanje i pakovanje; koturi 30–150 kg; sve dimenzije na lageru',
      annealed_en: 'annealed wire – annealed at 680–700 °C in a protective atmosphere, soft and flexible; for tying and packing; coils of 30–150 kg; all sizes in stock',
      galv: { sizes: '2,0 / 2,5 / 3,0 / 3,1 mm', perKg: [ ['2 mm', '40 m'], ['3 mm', '18 m'], ['3,1 mm', '16,67 m'], ['3,2 mm', '15,8 m'] ],
        sizes_en: '2.0 / 2.5 / 3.0 / 3.1 mm', perKg_en: [ ['2 mm', '40 m'], ['3 mm', '18 m'], ['3.1 mm', '16.67 m'], ['3.2 mm', '15.8 m'] ] },
      rabic: 'rabic pletivo u koturu širine 1000 mm, okca 12×12 mm, kotur 25 m; sečeno na tačnu meru; armiranje košuljica i maltera',
      rabic_en: 'Rabitz wire lath in coils 1,000 mm wide, mesh 12×12 mm, 25 m per coil; cut to exact size; reinforcement of screeds and plaster',
      grating: { sizes: ['200×1000', '250×1000', '300×1000', '500×1000', '500×500', '1000×1000'], material: 'toplovaljani lim S235', finish: 'toplo cinkovanje ili farbanje', note: 'veće količine po željenim dimenzijama',
        sizes_en: ['200×1,000', '250×1,000', '300×1,000', '500×1,000', '500×500', '1,000×1,000'], material_en: 'hot-rolled sheet S235', finish_en: 'hot-dip galvanising or painting', note_en: 'larger quantities in custom dimensions' },
      strip: { what: 'pocinkovana (gromobranska) traka za uzemljenje – toplo cinkovana toplovaljana traka u koturima, sečena na meru', sizes: ['3×20', '4×25', '4×30', '4×40'],
        what_en: 'galvanised (lightning-protection) earthing strip – hot-dip galvanised hot-rolled strip in coils, cut to length' }
    },

    /* Alati, okov, varenje, merdevine (F380–F405) */
    tools: {
      brands: ['Bosch', 'Makita', 'DeWalt', 'Stanley', 'Black & Decker', 'Varstroj', 'Mimont'],
      locks: { makers: 'Bane Sekulić (Sombor); italijanski PETITI, FIMET, HOPE', slide: 'komplet za klizna vrata atestiran do 700 kg po klizaču', items: 'brave, okovi, kvake',
        makers_en: 'Bane Sekulić (Sombor); Italian PETITI, FIMET, HOPE', slide_en: 'sliding gate kit certified up to 700 kg per roller', items_en: 'locks, hardware, handles' },
      drills: 'DeWalt profesionalni pribor; Piranha (Black & Decker); HSS burgije za metal, burgije za beton; šelne; tiplovi za ciglu, blok i beton',
      drills_en: 'DeWalt professional accessories; Piranha (Black & Decker); HSS drill bits for metal, masonry drill bits for concrete; pipe clamps; wall plugs for brick, block and concrete',
      discs: 'ploče za sečenje, brušenje, poliranje i oštrenje – svetski proizvođači i Ginić tocila; Ø115–Ø500; čelik, aluminijum, plemeniti metali, cigla, beton',
      discs_en: 'discs for cutting, grinding, polishing and sharpening – leading international manufacturers and Ginić grinding wheels; Ø115–Ø500; steel, aluminium, precious metals, brick, concrete',
      hinges: { plain: ['Ø10×50', 'Ø12×60', 'Ø14×60', 'Ø16×80', 'Ø18×90'], ball: ['Ø20×100', 'Ø22×100', 'Ø22×150', 'Ø25×150', 'Ø25×200', 'Ø28×160', 'Ø30×300', 'Ø32×150', 'Ø32×200', 'Ø32×300'], decorative: ['Ø20×100', 'Ø22×150', 'Ø25×150', 'Ø25×200'] },
      screws: { makers: 'FRIULSIDER, KOELNER, LESSMAN, pop nitne SARIV',
        makers_en: 'FRIULSIDER, KOELNER, LESSMAN, SARIV pop rivets',
        rows: [ ['Mašinski vijak, pocinkovan, kvalitet 5.6 i 8.8', 'DIN 933 (JUS MB1.053), DIN 84 (MB1.103), DIN 963 (MB1.130), DIN 603 „torban“ (MB1.171)'], ['Vijak za lim', 'DIN 7971, DIN 7981, DIN 7982'], ['Samourezujući vijak sa burgijom', 'DIN 7504 K / P / N'], ['Vijak za drvo', 'salonit DIN 571 (MB1.500), hol šraf DIN 97 (MB1.510), rajser DIN 7997 (MB1.515)'], ['Vijak za gips-karton', 'fosfatiran (crn), upuštena glava, krstasti urez'] ],
        rows_en: [ ['Machine bolt, galvanised, property class 5.6 and 8.8', 'DIN 933 (JUS MB1.053), DIN 84 (MB1.103), DIN 963 (MB1.130), DIN 603 carriage bolt (MB1.171)'], ['Sheet-metal screw', 'DIN 7971, DIN 7981, DIN 7982'], ['Self-drilling screw', 'DIN 7504 K / P / N'], ['Wood screw', 'coach screw DIN 571 (MB1.500), slotted countersunk wood screw DIN 97 (MB1.510), cross-recessed countersunk wood screw DIN 7997 (MB1.515)'], ['Drywall screw', 'phosphated (black), countersunk head, cross recess'] ] },
      varstroj: { site: 'www.varstroj.si',
        series: [ ['VAREX 152 / 160 / 162', 'MMA, oplaštena elektroda', '40–120 / 40–155 / 45–140 A', '1,5–3,15 mm', '13–19 kg'], ['VARMIG 1600 / 1600 PROFI / 1700 / 1800', 'MIG/MAG u zaštiti gasa', '30–160 / 25–170 A', 'žica 0,6–0,8 mm', '28–40 kg'], ['VARIN 1105 – 3000', 'MMA inverter (1700/2000 i TIG)', '5–100 do 5–320 A', 'elektrode do 6 mm', '2,2–25 kg'], ['VARTIG 1605 / 2005 / 3000 AC/DC', 'TIG DC/AC i MMA', '5–165 / 5–200 / 3–300 A', 'MMA do 4–6 mm', '16,5–43 kg'], ['VST-3 / VST-25 PE/N', 'tačkasto zavarivanje', '2,7 / 11 kA', 'limovi 1+1 / 3+3 mm', '15 / 230 kg'], ['VARCUT S.P2', 'CNC portalni rezač (plazma/plamen)', 'pomak 12.000 mm/min', 'CNC Phantom / Burny 10', 'EN 28206'] ],
        series_en: [ ['VAREX 152 / 160 / 162', 'MMA, covered electrode', '40–120 / 40–155 / 45–140 A', '1.5–3.15 mm', '13–19 kg'], ['VARMIG 1600 / 1600 PROFI / 1700 / 1800', 'MIG/MAG with shielding gas', '30–160 / 25–170 A', 'wire 0.6–0.8 mm', '28–40 kg'], ['VARIN 1105 – 3000', 'MMA inverter (1700/2000 also TIG)', '5–100 to 5–320 A', 'electrodes up to 6 mm', '2.2–25 kg'], ['VARTIG 1605 / 2005 / 3000 AC/DC', 'TIG DC/AC and MMA', '5–165 / 5–200 / 3–300 A', 'MMA up to 4–6 mm', '16.5–43 kg'], ['VST-3 / VST-25 PE/N', 'spot welding', '2.7 / 11 kA', 'sheets 1+1 / 3+3 mm', '15 / 230 kg'], ['VARCUT S.P2', 'CNC gantry cutter (plasma/oxy-fuel)', 'travel speed 12,000 mm/min', 'CNC Phantom / Burny 10', 'EN 28206'] ],
        other: 'oprema za elektrootporno zavarivanje, naprave za kružno zavarivanje MIG/MAG, pomoćni materijal i zaštitna oprema',
        other_en: 'Resistance welding equipment, MIG/MAG circular welding fixtures, consumables and protective equipment',
        legend: 'podaci iz kataloga sa starog sajta (2018); aktuelne modele i cene daje prodaja',
        legend_en: 'Data from the catalogue on the old website (2018); sales will confirm current models and prices' },
      ladders: { maker: 'Alpos (Slovenija)', expert: { note: 'EXPERT – profesionalne, sa sertifikatom, ispunjavaju uslove zaštite na radu', head: ['Tip', 'Visina složene (m)', 'Visina razvučene (m)', 'Radna visina (m)', 'A-položaj (m)', 'Radna A (m)', 'Masa (kg)', 'Prečke'],
          note_en: 'EXPERT – professional, certified, meet occupational safety requirements', head_en: ['Type', 'Closed height (m)', 'Extended height (m)', 'Working height (m)', 'A-frame height (m)', 'Working height, A-frame (m)', 'Weight (kg)', 'Rungs'],
          rows: [ ['38-10', '3,0', '6,4', '5,6 / 7,4', '4,7', '3,4 / 5,2', '20,4', '3×10'], ['38-11', '3,3', '7,2', '6,4 / 8,2', '5,0', '3,7 / 5,5', '23,6', '3×11'], ['38-12', '3,5', '8,3', '7,5 / 9,3', '5,8', '4,5 / 6,3', '29,5', '3×12'], ['38-13', '3,8', '8,6', '7,8 / 9,6', '6,1', '4,8 / 6,6', '30,6', '3×13'], ['38-15', '4,4', '10,2', '9,1 / 10,9', '6,9', '5,5 / 7,3', '39,1', '3×15'] ],
          rows_en: [ ['38-10', '3.0', '6.4', '5.6 / 7.4', '4.7', '3.4 / 5.2', '20.4', '3×10'], ['38-11', '3.3', '7.2', '6.4 / 8.2', '5.0', '3.7 / 5.5', '23.6', '3×11'], ['38-12', '3.5', '8.3', '7.5 / 9.3', '5.8', '4.5 / 6.3', '29.5', '3×12'], ['38-13', '3.8', '8.6', '7.8 / 9.6', '6.1', '4.8 / 6.6', '30.6', '3×13'], ['38-15', '4.4', '10.2', '9.1 / 10.9', '6.9', '5.5 / 7.3', '39.1', '3×15'] ] },
        ratio: { note: 'RATIO 44-10 – poluprofesionalne; ne ispunjavaju sve uslove zaštite na radu za profesionalnu upotrebu', row: ['44-10', '2,8', '5,9', '5,1 / 6,9', '4,3', '3,1 / 4,9', '15,4', '3×10'],
          note_en: 'RATIO 44-10 – semi-professional; do not meet all occupational safety requirements for professional use', row_en: ['44-10', '2.8', '5.9', '5.1 / 6.9', '4.3', '3.1 / 4.9', '15.4', '3×10'] },
        maker_en: 'Alpos (Slovenia)' },
      aluProfiles: 'trgovački profili za građevinsku bravariju – ekstruzija legura 6060 i 6063; L, T, kutije, cevi; uglavnom sirovi, boja aluminijuma',
      aluProfiles_en: 'merchant sections for architectural metal fabrication – extruded alloys 6060 and 6063; angles, tees, box sections, tubes; mostly mill finish (natural aluminium colour)',
      mimont: 'Mimont – pomoćni pribor',
      mimont_en: 'Mimont – accessories'
    },

    /* Mašinski park (F108, F158–F181) – datasheet usluga */
    machines: [
      { group: 'Sečenje', name: 'CNC plazma', spec: 'lim do 30 mm; gasno rezanje do 150 mm', detail: 'radni sto 2,5 × 8 m; čelik, inox, bakar, aluminijum',
        group_en: 'Cutting', name_en: 'CNC plasma', spec_en: 'sheet up to 30 mm; oxy-fuel cutting up to 150 mm', detail_en: 'cutting table 2.5 × 8 m; steel, stainless steel, copper, aluminium' },
      { group: 'Sečenje', name: 'Hidraulične makaze MHS 3100/13', spec: 'do 13 mm (450 MPa); inox do 9 mm (650 MPa)', detail: 'dužina reza do 3100 mm',
        group_en: 'Cutting', name_en: 'Hydraulic guillotine shear MHS 3100/13', spec_en: 'up to 13 mm (450 MPa); stainless steel up to 9 mm (650 MPa)', detail_en: 'cutting length up to 3,100 mm' },
      { group: 'Sečenje', name: 'Elektromotorne makaze', spec: 'do 1,5 mm', detail: 'dužina reza do 2 m',
        group_en: 'Cutting', name_en: 'Electric guillotine shear', spec_en: 'up to 1.5 mm', detail_en: 'cutting length up to 2 m' },
      { group: 'Sečenje', name: 'Sliter (podužno sečenje)', spec: 'do 1 mm, širina kotura do 1260 mm', detail: 'najviše 7 traka željene širine; kotur do 6 t; koturići po dogovoru',
        group_en: 'Cutting', name_en: 'Slitter (slitting)', spec_en: 'up to 1 mm, coil width up to 1,260 mm', detail_en: 'up to 7 strips of the required width; coil up to 6 t; small coils by arrangement' },
      { group: 'Sečenje', name: 'Odmotač–namotač (premotavanje)', spec: 'do 1,2 mm, širina do 1260 mm', detail: 'kotur do 6 t, fabrički otvor 500–600 mm; premotani otvor 490–600 mm, kontrola dužine',
        group_en: 'Cutting', name_en: 'Decoiler–recoiler (rewinding)', spec_en: 'up to 1.2 mm, width up to 1,260 mm', detail_en: 'coil up to 6 t, mill inner diameter 500–600 mm; rewound inner diameter 490–600 mm, length control' },
      { group: 'Sečenje', name: 'Presa za isecanje uglova', spec: 'čelični lim do 4 mm', detail: 'ugao 30°–140°',
        group_en: 'Cutting', name_en: 'Corner notching press', spec_en: 'steel sheet up to 4 mm', detail_en: 'angle 30°–140°' },
      { group: 'Sečenje', name: 'Iron Worker', spec: 'kombinovana mašina', detail: 'probijanje, deformacija, isecanje uglova, sečenje lima i profila',
        group_en: 'Cutting', name_en: 'Iron Worker', spec_en: 'combination machine', detail_en: 'punching, forming, corner notching, cutting of sheet and sections' },
      { group: 'Sečenje', name: 'Trakasta testera', spec: 'profili i puni preseci, ugao do 60°', detail: 'motor 1,3/1,5 kW; 38/76 m/min; list 3090×27×0,9 mm; 267 kg; hlađenje emulzijom; rez pojedinačno ili u snopu',
        group_en: 'Cutting', name_en: 'Band saw', spec_en: 'sections and solid bars, angle up to 60°', detail_en: 'motor 1.3/1.5 kW; 38/76 m/min; blade 3,090×27×0.9 mm; 267 kg; emulsion cooling; single or bundle cutting' },
      { group: 'Savijanje', name: 'CNC apoling (apkant) 8,2 m', spec: 'kutijasti profili do 0,8 mm, dužina do 8,2 m', detail: 'ravan lim do 4 mm na 8 m (8100 mm)',
        group_en: 'Bending', name_en: 'CNC folding machine 8.2 m', spec_en: 'box sections up to 0.8 mm, length up to 8.2 m', detail_en: 'flat sheet up to 4 mm over 8 m (8,100 mm)' },
      { group: 'Savijanje', name: 'Apoling 2 m', spec: 'do 1,5 mm', detail: 'dužina profila do 2 m',
        group_en: 'Bending', name_en: 'Folding machine 2 m', spec_en: 'up to 1.5 mm', detail_en: 'section length up to 2 m' },
      { group: 'Savijanje', name: 'NC hidraulična presa 200 t (2000 kN)', spec: 'čelik do 10 mm (450 MPa); inox do 7 mm (650 MPa)', detail: 'dužina do 3100 mm; hladno oblikovani profili (HOP)',
        group_en: 'Bending', name_en: 'NC hydraulic press brake 200 t (2,000 kN)', spec_en: 'steel up to 10 mm (450 MPa); stainless steel up to 7 mm (650 MPa)', detail_en: 'length up to 3,100 mm; cold-formed sections' },
      { group: 'Savijanje', name: 'Rund mašina (kružno savijanje)', spec: 'do 0,8 mm × 2 m: Ø80–Ø800', detail: 'do 4 mm × 2 m: najmanji prečnik 190 mm',
        group_en: 'Bending', name_en: 'Plate rolling machine', spec_en: 'up to 0.8 mm × 2 m: Ø80–Ø800', detail_en: 'up to 4 mm × 2 m: minimum diameter 190 mm' },
      { group: 'Savijanje', name: 'Mašina za lučno savijanje cevi i flahova', spec: 'okrugle 1/2"–2" (zid 2–3 mm)', detail: 'kvadratne do 50×50, pravougaone do 40×60 mm (zid 2–3 mm)',
        group_en: 'Bending', name_en: 'Arc bending machine for tubes and flat bars', spec_en: 'round 1/2"–2" (wall 2–3 mm)', detail_en: 'square up to 50×50, rectangular up to 40×60 mm (wall 2–3 mm)' },
      { group: 'Savijanje', name: 'Mašina za ispravljanje (peglanje) flahova', spec: 'do 10 mm', detail: 'sa obaranjem ivica',
        group_en: 'Bending', name_en: 'Flat bar straightening and flattening machine', spec_en: 'up to 10 mm', detail_en: 'with edge chamfering' },
      { group: 'Profilisanje', name: 'Profilirke za TR lim', spec: 'TR 10 – TR 60, dužina po meri', detail: 'imitacija crepa – novi model od 2020.',
        group_en: 'Roll forming', name_en: 'Roll formers for TR sheet', spec_en: 'TR 10 – TR 60, cut to length', detail_en: 'tile-effect roofing sheet – new model since 2020' },
      { group: 'Profilisanje', name: 'Hidraulična presa za TR do 2,5 m', spec: 'rebro 15/10/15; do 1 mm (alu i bakar 1,5 mm)', detail: 'broj rebara po želji',
        group_en: 'Roll forming', name_en: 'Hydraulic press for TR up to 2.5 m', spec_en: 'rib 15/10/15; up to 1 mm (aluminium and copper 1.5 mm)', detail_en: 'number of ribs to order' },
      { group: 'Profilisanje', name: 'Profilirke za oluk i vertikalu', spec: 'poluokrugli oluk RŠ 333 neograničeno; vertikala Ø100 neograničeno', detail: 'automatizovane pokretne linije',
        group_en: 'Roll forming', name_en: 'Roll formers for gutters and downpipes', spec_en: 'half-round gutter, developed width 333, unlimited length; downpipe Ø100, unlimited length', detail_en: 'automated mobile lines' },
      { group: 'Profilisanje', name: 'Mašina za parapet, mašina za lamperiju', spec: 'parapeti PR 83/34, 38/15, 71/10; lamperija 2,5 m', detail: 'po narudžbini i u drugim dužinama',
        group_en: 'Roll forming', name_en: 'Parapet sheet machine, cladding panel machine', spec_en: 'parapet sheets PR 83/34, 38/15, 71/10; cladding panels 2.5 m', detail_en: 'other lengths also to order' },
      { group: 'Profilisanje', name: 'Mašina za kanale za ventilaciju', spec: 'kanali i fazonski komadi', detail: 'po specifikaciji',
        group_en: 'Roll forming', name_en: 'Ventilation duct machine', spec_en: 'ducts and fittings', detail_en: 'to specification' },
      { group: 'Profilisanje', name: 'Linija za pokrivanje „dupli falc“ (šufalc)', spec: 'pocinkovani, bakarni, plastificirani lim', detail: 'falcovane table za montažere; afteri po izboru',
        group_en: 'Roll forming', name_en: 'Double standing seam roofing line', spec_en: 'galvanised, copper, pre-painted sheet', detail_en: 'seamed panels for installers; standing-seam clips to choice' },
      { group: 'Dorada', name: 'Mašina za grifovanje', spec: 'flah, firkant, kutijasti profili', detail: 'sve komercijalne dimenzije; graviranje (šaranje) flaha',
        group_en: 'Finishing', name_en: 'Embossing machine', spec_en: 'flat bar, square bar, box sections', detail_en: 'all commercial sizes; engraved patterns on flat bar' }
    ]
  },

  disclaimer: 'Orijentaciono — tačne količine i cenu potvrđuje prodaja TRICOM-a po prijemu upita.',
  disclaimer_en: 'Indicative — TRICOM sales will confirm exact quantities and price on receipt of your inquiry.'
};
/* `colors` = pseudonim jedne liste boja (konfigurator i catalog-render čitaju to ime). */
window.TRICOM_CATALOG.colors = window.TRICOM_CATALOG.colours;
