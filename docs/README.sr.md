# TRICOM — sajt

HTML / CSS / JS bez build sistema i zavisnosti; strane i sadržaj iz baze služi PHP
(v. „Postavljanje na hosting“ i `TRICOM_IMPLEMENTATION.md`). Opisi dizajna i skripti
niže važe i dalje; nazivi `.html` u strukturi su javne adrese (fajlovi su sada PHP
pogledi u `app/views/site/`).

## Struktura

```
index.html          Početna
o-nama.html         O firmi, istorijat, kapaciteti, sertifikati
usluge.html         14 usluga obrade (sečenje, savijanje, profilisanje)
plazma.html         CNC plazma — zasebna strana, glavna usluga
proizvodi.html      Prodajni program u 6 tabova
reference.html      Objekti i partneri
galerija.html       Tehnički prikazi sa filterom i lightboxom
kontakt.html        Forma, dve lokacije, mape, uslovi poslovanja
404.html            Strana za nepostojeće adrese
konfigurator.html   3D konfigurator krova i oluka (v. „3D konfigurator“ niže)
en/                 Engleska verzija svih strana (v. „Engleska verzija“ niže)

css/
  base.css          Tokeni (boje, tipografija, razmaci), reset, utilities
  layout.css        Header i navigacija (devet stavki), prekidač teme,
                    hero („cinema“ panel), zaglavlja podstranica, futer,
                    mobilna navigacija, kursor
  components.css    Dugmad, kartice, tabele, tabovi, akordeon, galerija, forme
  widgets.css       Dock (AI asistent + nazad na vrh)
  pages.css         Blokovi pojedinačnih strana + lineup profila, rastavljeni
                    crteži (lim, oluk), numerisani niz, „cinema“ panel
  print.css         List za štampu (media="print") — v. „Štampa“ niže
  glass.css         „The Board · Glass“: staklene ploče, prostor (fasete / klinička
                    soba), HUD uglovi, jezičci, okviri fotografija, pokret — poslednji
                    sloj na svim stranama osim konfiguratora
  konfigurator.css  Sve što je specifično za konfigurator (traka, šina, panel, štampa)
  modal.css         Ploča kartice (modal) i razlike strana detalja

js/
  hero3d.js         3D objekti u hero-u i zaglavljima (Three.js se učitava tek
                    kad zatreba; statična slika kao rezerva)
  theme.js          Prekidač svetle i tamne teme
  lang.js           Prekidač jezika SR | EN (v. „Engleska verzija“ niže)
  i18n/sr.js, en.js Tekstovi koje ispisuju skripte + pomoćnik L10N
  kb.en.js          Engleska baza znanja asistenta
  kb.js             Baza znanja AI asistenta — OVDE se dopunjavaju odgovori
  assistant.js      Logika asistenta (pretraga po bazi, bez API-ja)
  main.js           Sve ostale interakcije
  items.js          Podaci kartica: proizvodi, usluge, mogućnosti, reference, galerija
                    (jedini izvor za modal i strane detalja — v. „Kartice, modal i strane detalja“)
  modal.js          Kartica → modal (fokus, Esc, heš #item=<slug>, lightbox za galeriju)
  glass.js          Prostor i paralaksa, klasa .gl, vodeće ploče sa brojem sekcije,
                    budžet zamućenja (≤ 4 ploče + traka), sjaj, nagib, magnetna dugmad,
                    lepljiva kraća kolona, prelaz teme (View Transitions)
  konfigurator/     3D konfigurator: k-data, k-textures, k-materials, k-geo,
                    k-house, k-env, k-fx, k-weather, k-tools, k-ui, k-app
                    (obične skripte, bez modula)
  vendor/           Three.js r147 (three.min.js, OrbitControls, BufferGeometryUtils)

assets/
  tricom-logo.png       Logo u punoj rezoluciji — Open Graph i JSON-LD
  tricom-logo-web.png   Logo optimizovan za zaglavlje i futer
  tricom-1/2/3.png      Originalne fotografije (nisu direktno u upotrebi)
  tricom-1/2/3.jpg      Optimizovane fotografije koje sajt zaista koristi; svaka strana
                        ima svoju (klasa ph-1/2/3 na <body>), isečak se menja po mestu
  logo.png              Stari logo — nije više u upotrebi, ostavljen za arhivu
  favicon.svg           Ikonica sajta
  hero/                 Statične slike 3D objekata (sheet, roof, plate, coil,
                        gutter; koriste se *-dark — hero i zaglavlja su tamni u
                        obe teme; *-light su ostale u folderu, ne učitavaju se)

robots.txt          Dozvola indeksiranja + putanja do sitemap-a
sitemap.xml         Mapa sajta za pretraživače
```

## Kartice, modal i strane detalja

Svaka kartica na početnoj, uslugama, plazmi, proizvodima, referencama i galeriji
nosi `data-item="<slug>"`; klik (ili Enter / razmak) otvara staklenu ploču
(`js/modal.js`, `css/modal.css`) sa podacima iz `js/items.js`. Heš `#item=<slug>`
otvara ploču pri učitavanju (deljiv link). Proizvodi, usluge i mogućnosti imaju i
statičnu stranu detalja: `detalji/<slug>.html` i `en/details/<slug>.html`.

- tekst stavke se menja u `js/items.js`, pa se strane ponovo generišu:
  `node _tools/items/gen-details.js` (piše i blok strana detalja u `sitemap.xml`;
  zaglavlje i futer uzima iz `usluge.html` / `en/services.html`)
- reference i galerija: posle izmene na strani `python _tools/items/extract-media.py`
  (prepisuje blok MEDIA u `js/items.js`)
- nove kartice: dodati stavku u `items.js` i `data-item` na karticu
  (`_tools/items/wire-cards.py` je jednokratna skripta koja je to uradila za postojeće)
- strane detalja su fasciklu dublje: `<html data-root data-base>` govori skriptama
  (`L10N.root`, `L10N.page`, `lang.js`, asistent) gde je koren sajta
- natpisi strana detalja i modala su u `js/i18n` (ključevi `item.*`)

## 3D konfigurator

`konfigurator.html` je samostalna strana: umesto navigacije ima traku u merama
zaglavlja sajta (logo, „Nazad na sajt“, alati **Kiša / Zima / Kote / Uporedi /
Foto**, dan/noć, „Sačuvaj / podeli“, „Zatražite ponudu“), a dok (asistent +
nazad na vrh) se na njoj ne učitava. Radi i dvoklikom (`file://`) — Three.js je
**priložen** u `js/vendor/` kao obična UMD skripta (r147, poslednja serija koja
još isporučuje `examples/js`), bez `node_modules`, bez bundlera i bez ES modula.
Nijedna slika se ne učitava: sve teksture (cink, bakar sa patinom, malter,
opeka, trava, beton, asfalt, oblaci, drveće, horizont) crtaju se na `<canvas>`
pri pokretanju.

| Fajl | Šta radi |
|---|---|
| `k-data.js` | Katalog: tipovi kuća, profili (mere u metrima), RAL paleta, oluci, cevi, fasade, boje stolarije, limarski detalji, datumi za putanju sunca, kapaciteti odvodnje, fabričke dužine opšivki |
| `k-textures.js` | Proceduralne teksture |
| `k-materials.js` | Materijali po ulozi, grupisani u „set“ (krov, oluk, opšivke, tri zone fasade, stolarija); poređenje i susedne kuće koriste dodatne setove. Svi obični materijali namerno imaju isti skup mapa (v. „Brzina učitavanja“) |
| `k-geo.js` | Presek profila (isti niz tačaka crta i 3D lim i SVG presek), krovna obloga isečena po poligonu krovne ravni, položaji vijaka po rebrima, snežni pokrivač, „sweep“ za oluke i opšivke, cevi sa kolenima, linije stalne debljine u pikselima |
| `k-house.js` | Gradi celu kuću iz parametara; vraća količine izmerene na toj geometriji, kote, mesta za inspektor detalja i podatke za kišu i sneg |
| `k-env.js` | Nebo i oblaci, sunce po datumu i satu, senke, travnjak sa 3D vlatima, živica, ograda, prilaz, staza, ulica, susedi (isti generator kuće), mapa okruženja snimljena iz same scene |
| `k-fx.js` | Ambijentalna okluzija (SSAO), završni prolaz (sRGB + FXAA u pokretu), foto-režim |
| `k-weather.js` | Kiša (čestice, prskanje, voda u oluku i iz vertikala, prelivanje, očitavanje kapaciteta) i zima (sneg na krovu, klizanje bez snegobrana) |
| `k-tools.js` | Kote, inspektor detalja, specifikacija (BOM), reprodukcija dana, vodič, mirovanje |
| `k-ui.js` | Šina sa 8 koraka, panel, tačke na kući, alati u traci, poređenje, lupa, štampa |
| `k-app.js` | Stanje ↔ adresa, renderer, kamera, sličice, foto, upit |

**Dodavanje profila ili boje:** novi red u `D.profiles` (visina rebra, korak,
širina pojasa, broj rebara) odnosno u `D.ral` u `k-data.js` — panel, 3D lim,
presek, vijci i količine ga preuzimaju sami.

**Adresa nosi celu konfiguraciju**, npr.
`#kuca=dvovodni&krov=tr35&mat=plast&boja=ral7016&oluk=polukrug125&cev=okrugla100&fasada=malter.bela&zona1=lamperijav.7016&prozori=antracit&okolina=predgradje&sat=15&detalji=sleme,vetar,okapnica,snego`.
Dodatni ključevi: `datum=jun|dec` (putanja sunca), `starenje=0–100` (cink),
`kisa=1`, `zima=1`, `kote=1`. U poređenju adresa nosi obe varijante:
`#a=kuca:dvovodni;krov:tr35;…&b=kuca:dvovodni;krov:crep;…` (unutar `a` i `b`
parovi su razdvojeni sa `;`, a ključ i vrednost sa `:`). Promena opcije
prepisuje adresu preko `history.replaceState` (bez novih stavki u istoriji).

**Alati**

- *Kiša* — pljusak, prskanje po krovu i terasi, voda teče olukom ka izlivu i
  ističe iz vertikala; očitavanje „Oluk Ø125 · 4 vertikale Ø100 · odvodi krov
  od 130 m²“. Ako je površina po vertikali veća od kapaciteta (`D.capacity`,
  orijentaciona tabela za pljusak 300 l/s·ha), oluk vidno preliva.
- *Zima* — sneg na krovu, olucima i solbancima, putanja sunca za 21. decembar.
  Sa snegobranima sneg ostaje iznad njih; bez njih sklizne u komadu preko
  strehe i ostane na gomili ispod.
- *Kote* — dužina slemena, krovne ravni, strehe, oluka, vertikale, dimnjaka,
  nagib i korisna širina table, ispisani na modelu.
- *Uporedi* — dve varijante sa pomičnom granicom; klik na stranu (A/B) bira
  koju panel menja, „Zameni“ ih menja mestima. PDF prikazuje obe.
- *Foto* — slika 3840 × 2560 (na telefonu 1920 × 1280) iz 24 uzorka
  (supersempling + dubinska oštrina), sa vinjetom, zrnom, trakama i šifrom
  konfiguracije; preuzima se kao JPG. Ista slika ide i u PDF.
- *Korak 07* — „Detalj“ pored svake opšivke (ili klik na nju na kući) vodi
  kameru do elementa, zatamni ostalo i otvara karticu sa presekom, razvijenom
  širinom i redosledom ugradnje u tri koraka.
- *Korak 06* — „Reprodukuj dan“ (06–22 h za 12 s) i izbor datuma.
- *Korak 08* — specifikacija: table po dužinama, opšivke zaokružene na fabričke
  dužine (`D.stock`), elementi oluka i vertikala, snegobran, vijci, boje;
  „Kopiraj specifikaciju“ i „Zatražite ponudu“.
- *Vodič* — šest koraka pri prvoj poseti (pamti se u `localStorage` pod
  `tk-tour-v1`), dugme „?“ ga ponavlja. Posle 12 s mirovanja na početnom
  ekranu kamera polako kruži i kiša se jednom uključi i isključi.

**Upit:** „Zatražite ponudu“ otvara `kontakt.html?konfig=<tekst>#upit`; modul
`konfigUpit` na dnu `js/main.js` upisuje taj tekst (izbor + cela specifikacija)
u polje poruke.

**Količine su orijentacione.** Mere kuća su tipske; tačnu količinu potvrđuje
prodaja. Tabela kapaciteta odvodnje u `D.capacity` je iskustvena — proverite je
sa prodajom pre objave.

**Kvalitet prikaza:** na uređajima užim od 820 px (ili sa grubim pokazivačem)
mapa senki je 2048 umesto 4096, gustina piksela najviše 1,5, bez SSAO, sa manje
vlati trave, vijaka i kapi. Dok kamera miruje kadar se crta sa 4× MSAA; u
pokretu bez njega (FXAA) i, ako treba, u nižoj rezoluciji. Na računaru trava i
oblaci se blago kreću (oko 20 kadrova u sekundi dok se ništa drugo ne dešava).
Uz `prefers-reduced-motion` nema kruženja kamere, kretanja oblaka i trave ni
animacija kiše i snega (prikazuje se miran kadar), a kamera skače bez leta.
Parametri za probu: `?auto=0` (bez vodiča i kruženja), `?tour=0`, `?anim=0`,
`?ao=0`, `?tier=mobile`, `?debug=1` (provera grešaka u šejderima).

**Brzina učitavanja:** na Windows-u svaki šejder program košta 0,1–0,25 s pri
prvom pokretanju (posle toga ga pregledač kešira). Zato: (1) svi obični
materijali imaju isti skup mapa (`M.std` / `M.fill` dopunjavaju prazna mesta
teksturom od 1 px), pa dele jedan program; (2) glavna scena, snimak okruženja i
foto-režim crtaju se u isti linearni međubafer, pa koriste iste programe;
(3) kuća se prikaže prva, a dvorište, susedi, trava i SSAO stižu u naredna
tri koraka. Novi materijal pravite preko `TK.mat.std({...})`.

## Tema (svetla i tamna) — „Cinematic Industrial“

Sajt ima **dve teme**. **Svetla je podrazumevana za sve posetioce**
(hladna, svetla podloga `#F8FAFC`, paneli korak svetliji, skoro crn tekst);
tamna (grafit) se dobija samo prekidačem. Prekidač (sunce / mesec) stoji u
traci pored SR | EN, u podnožju mobilnog menija i u traci konfiguratora.

- Tema se bira atributom `html[data-theme="light" | "dark"]`.
- Mala skripta u `<head>`-u **svake** strane, pre stilova, postavlja
  `dark` **samo** ako je `localStorage['tricom-theme'] === 'dark'`; u svakom
  drugom slučaju `light`. Sistemska postavka (svetla / tamna u OS-u) se
  namerno ne prati — ni u skripti, ni u `theme.js`, ni u CSS-u (jedan izvor
  istine). Nema bleska pogrešne teme. Ista skripta podešava
  `<meta name="theme-color">` (`#F8FAFC` / `#0B0E13`).
- `js/theme.js` vezuje dugmad (`[data-theme-toggle]`, `aria-pressed`), pamti
  izbor i šalje događaj `tricom:theme`.
- **Svetla tema nema nijednu tamnu površinu** (izmena 2026-10-24): hero,
  zaglavlja podstranica, 404, „cinema“ sekcije (`.dark`), traka brojeva,
  poziv u konfigurator, Karađorđevo i futer u svetloj temi leže na podlozi
  strane; odvajaju ih staklene ploče, hairline linije i razmak, nikad tamna
  ispuna. Tamni skup tokena u `base.css` / `glass.css` važi za
  `html[data-theme="dark"]` i — **samo u tamnoj temi** — za `.dark`,
  `.pagehead`, `.emptyhead`, `.site-header.is-over` i `.site-footer`: ti
  selektori nose nulti kvalifikator `:where(html[data-theme="dark"])`, pa se
  tamna tema ni u čemu ne menja (ista specifičnost, isti redosled). Isti
  kvalifikator nose i sva pravila sa tamnom ispunom tih površina (fasete,
  lomljeni čelik `--bg-steel`, `.bd-*`, `.gl.dark`, `.kcta`, `.refhero`,
  `.hm-tri`, pojas poziva u futeru). Tokeni `--cine-*` su u korenu tamne
  konstante (natpisi preko fotografija, lightbox); u svetloj temi `.dark`,
  futer, zaglavlja i traka dobijaju njihove svetle vrednosti (blok
  „Svetla tema“ na vrhu `glass.css`). Futer čita lokalne tokene `--ft-*`
  (svetle vrednosti u `.site-footer`, tamne u bloku tamne teme). Tamne
  slike rendera u tim sekcijama idu u paru `.theme-img--light / --dark`.

**Tokeni** su u `css/base.css`. Komponente čitaju samo semantičke tokene:
`--bg`, `--bg-elev`, `--surface`, `--surface-2`, `--surface-3`, `--line`,
`--line-strong`, `--fg`, `--fg-strong`, `--fg-muted`, `--fg-faint`,
`--brand`, `--brand-ink`, `--accent`, `--arc`, `--spark`, `--ghost`,
`--hero-*` (zid, pod, tekst hero-a), `--photo-filter` / `--photo-tint`
(toniranje fotografija po temi). Stara imena (`--hairline`, `--bg-soft`,
`--tricom` …) ostaju kao pseudonimi.

Boje su uzorkovane iz `assets/tricom-logo.png` (histogram neprovidnih
piksela): slova `#0650C5` (= `--brand`, jedina primarna boja), obrub slova
`#072173` (`--brand-deep`), grafit `#3A393B` (`--graphite`), srebro
`#BEBDBF` (`--silver`), senka lima `#717171` (`--steel-logo`). `--arc`
`#5B9BFF` je svetlo (sjaj, hairline na 3D objektu), `--spark` `#FFAE52`
samo mikro-akcenat (tačke statusa, vrhovi oznaka) — nikad površina.

Klasa `.dark` znači površinu koja je **tamna samo u tamnoj temi**: futer,
„cinema“ panel (CNC plazma na početnoj, kapaciteti na *O nama*, profili na
*Uslugama*), traka brojeva, Karađorđevo na početnoj i u referencama, poziv u
konfigurator. U svetloj temi je providna (podloga strane) sa tamnim
tekstom. Klasa `.soft` daje smenjivu površinu `--bg-elev`.

Svi parovi tekst / pozadina u obe teme i na tamnom panelu prolaze WCAG AA
(117 parova; najniži: `--fg-faint` na `--surface-3` u tamnoj temi, 4.95:1).

**Dizajn sistem (dorada):** jedna mreža od 12 kolona, 1440 px sadržaja,
žleb 24 / 16 px (`.grid12`, `.split` i `.shead` stoje na njoj); sekcije
120 / 88 / 64 px; mono oznake jedne veličine (11 px, 0.16em, verzal);
naslovi ≥ 56 px −0.03em, 32–56 px −0.02em, manji 0; telo 17/1.6 (16/1.6 na
telefonu); bez senki — dubina samo kroz korake površine i hairline; radijus
2 px osim pilula; dve vrste dugmeta (puno i obrisno, obe 48 px); ikone
potez 1.5, 16 / 20 / 24 px; jedna kriva pokreta `cubic-bezier(.2,.7,.2,1)`
i trajanja 200 / 400 / 600 ms; reveal je samo rez (maska).

## Hero na početnoj — tri ekrana na čistoj podlozi

Markup je u `index.html` / `en/index.html` (`section.hero`), stil u
`css/layout.css` (blok „HERO“) i `css/glass.css` (6b), ponašanje u
`js/hero-slider.js`. Hero je 100svh; **pozadina je čista podloga strane**
aktivne teme (isti prostor kao `body` — bez fotografije, preliva i mreže
poda; izmena 2026-10-24). Na njoj stoje:

- gore levo mono blok `BATAJNICA · BEOGRAD / METALOPRERADA / OD 1966`;
- uska staklena ploča sa tri ekrana (oznaka `01 / 03`, naslov u dva reza,
  rečenica, obrisno dugme), strelice levo / desno, šina `01 — 03` u desnom
  žlebu (na telefonu tačke), autoplay 7 s, swipe, ← / →, `#s=1|2|3` u adresi
  (1-based);
- desno, centriran u svojoj polovini, 3D objekat ekrana (`js/hero3d.js`,
  host `#hero3d` sa `data-bed`: tabla TR 35/270, ploča posle plazme, paket
  tabli) sa kotama koje prate projektovane 3D tačke; promena ekrana šalje
  `tricom:hero` i menja objekat; uz statičnu sliku kote dolaze iz
  `data-kote-still-*`;
- dole na sredini „SKROLUJTE“ uz tanku liniju.

Uklonjeni su (2026-10-24): fotografije ekrana (`.hero__photo`), mono lista
gore desno (`.hero__lists`), blok „Jedno mesto za limara, bravara i
izvođača“, kartica sa presekom / parametrima / zalihama (`.hero__cards`) i
traka ispod hero-a (`.herobase`). Fotografije `assets/tricom-1/2/3.jpg`
ostaju jer ih koriste druge sekcije i strane.

## 3D objekti (`js/hero3d.js`)

Na početnoj (tabla TR 35/270 na radnom stolu) i u zaglavljima *Usluga*
(oluk), *CNC plazme* (ploča) i *Prodajnog programa* (krov):
TR 35/270 sa olukom Ø125 i kukama, poluokrugli oluk sa kukom i čepom, ploča
isečena plazmom sa lukom reza, kotur i paket tabli. Objekti se njišu ±8°
(bez punog okreta), ne lebde i prate pokazivač. Presek profila i oluka
dolazi iz konfiguratora (`TK.geo.profilePoints`, `TK.geo.gutterSection`).
Three.js i ta dva fajla se učitavaju tek kada je strana učitana i objekat na
ekranu — naslov ostaje najveći element prvog kadra (LCP).

Statična slika iste scene (`assets/hero/<objekat>-<tema>.webp`; PNG izvornici u `_tools/render/out/hero-png/`) se
prikazuje pre prvog kadra i **ostaje jedini prikaz** uz
`prefers-reduced-motion`, `navigator.hardwareConcurrency <= 4` i širinu
ispod 768 px. Probe: `?hero3d=on` (uvek 3D), `?hero3d=off` (uvek slika).
Slike se prave iz same scene: `?hero3d=still` izlaže
`window.tricomHero3D.capture(objekat, širina, visina)`.

## Navigacija — devet stavki

Početna · O nama · Proizvodi · Usluge · Konfigurator · Kalkulatori · Reference · Galerija ·
Kontakt (isto u zaglavlju, mobilnom meniju i koloni „Meni“ u futeru).
*Proizvodi* ima podmeni sa šest tabova (`proizvodi.html#limovi`, `#krov`,
`#oluci`, `#cevi`, `#kovano`, `#alati`), *Usluge* podmeni CNC plazma
(`plazma.html`) + `usluge.html#secenje`, `#savijanje`, `#profilisanje`,
`#profili`, *Kalkulatori* podmeni Trapez 10 / 20 / 35 / 40 i Imitacija crepa
(`kalkulatori.html#tr10` … `#crep` — heš otvara tab, promena taba menja heš) + „Svi kalkulatori“
(dodato na svih 114 strana sa navigacijom alatom `_tools/nav-calc.js`). Strelica podmenija stoji posle oznake i zasebno je dugme
(`aria-expanded`): hover, klik, Enter / Space, ↓ / ↑ otvaraju; u podmeniju
↑ ↓ Home End, Esc zatvara i vraća fokus (modul 4b u `js/main.js`). Aktivna
strana: `aria-current="page"` i plava podvlaka od 2 px u širini oznake; na
*CNC plazmi* stavka *Usluge* nosi `aria-current="true"`. Od 1181 px naviše
cela navigacija je u jednom redu, do 1180 px je mobilni meni.

## Zaglavlja podstranica

Isti tamni „cinema“ panel kao hero početne, kraći (56svh): plate preliv,
perspektivna mreža poda, vodeni žig sa imenom strane („USLUGE“, „PLAZMA“, „PROIZVODI“, „REFERENCE“,
„GALERIJA“, „KONTAKT“, „1966“ na *O nama*), naslov u dva reza (puni + tanki
nastavak, `<span class="lt">`), mono putanja i desno mali 3D objekat ili
tonirana fotografija (`.pagehead__photo`, slika po klasi `.pagehead--1/2/3`).

## Potpisni blokovi

- **Lineup profila** (`.lineup` / `.lu`) na početnoj i u tabu *Krov i
  fasada*: TR 10, TR 20, TR 35, TR 40 i imitacija crepa — presek u stvarnim
  proporcijama na ploči, ime i jedan red iz tabele profila.
- **Rastavljeni list** (`.xplode`) na početnoj i u tabu *Limovi*: pet slojeva
  sa linijama oznaka. **Rastavljeni olučni sistem** u tabu *Oluci i
  limarija*: oluk, kuka, čep, sabirnik, koleno, vertikala, obujmica.
- SVG crteži su generisani iz istog preseka kao 3D (skripta van projekta);
  boje dolaze iz tokena, pa crteži prate temu. Linije oznaka se iscrtavaju
  kada blok uđe u ekran.
- **Proces 01–04** na početnoj, *Uslugama* i *Kontaktu*; **numerisani niz**
  (`.numrow`) za pripremu DXF/DWG na *CNC plazmi*.

## Providno zaglavlje (9 strana sa punim zaglavljem)

Na **svakoj** strani traka kreće providna, preko hero-a. `<header>` u
markupu nosi `class="site-header is-over"` — `is-over` stoji već u HTML-u da
ne bi bilo bleska pune trake pre nego što se JS učita.

Modul `header()` u `js/main.js` traži **prvi element koji odgovara
`.hero, .pagehead, .emptyhead`** i skida `is-over` čim se prescroluje njegova
donja ivica; tada uključuje `is-solid` (puna podloga u boji teme i hairline).
Prag je uvek donja ivica tog pojasa. U providnom stanju traka nosi boju
teksta hero-a (`--hero-fg`) — tamnu na betonu, svetlu na grafitu.

| Strana | Pojas ispod trake |
|---|---|
| `index.html` | `.hero` (tri ekrana) |
| 7 podstranica | `.pagehead` |
| `404.html` | `.emptyhead` |

## Engleska verzija

Engleske strane su u `en/`, sa engleskim nazivima fajlova; svaka je ista
strana kao srpska (isti markup, isti `id`-jevi i heševi, isti CSS/JS preko
`../css/`, `../js/`, `../assets/`), samo je tekst na engleskom (britanski,
tehnički registar; rečnik pojmova je u `_content/en/glossary.md`).

| Srpska strana | Engleska strana |
|---|---|
| `index.html` | `en/index.html` |
| `o-nama.html` | `en/about.html` |
| `usluge.html` | `en/services.html` |
| `plazma.html` | `en/plasma-cutting.html` |
| `proizvodi.html` | `en/products.html` |
| `reference.html` | `en/references.html` |
| `galerija.html` | `en/gallery.html` |
| `kontakt.html` | `en/contact.html` |
| `konfigurator.html` | `en/configurator.html` |
| `404.html` | `en/404.html` |

**Prekidač SR | EN** (`js/lang.js`) vodi na istu stranu na drugom jeziku i
zadržava heš (`#limovi`, `#upit`, stanje konfiguratora), pa deljeni linkovi
rade na oba jezika. Par strana čita iz `<link rel="alternate" hreflang>` u
zaglavlju. Nema automatskog preusmeravanja po jeziku pregledača.

**Tekstovi iz skripti** (poruke forme, status „Otvoreno/Zatvoreno“, galerija,
asistent, tabele kataloga, konfigurator) su u `js/i18n/sr.js` i
`js/i18n/en.js` — isti ključevi u oba fajla. `sr.js` se učitava na svim
stranama pre ostalih skripti i sadrži pomoćnik `L10N` (`L10N.t(ključ)`,
`L10N.lang()`, `L10N.num()`, `L10N.root`, `L10N.page()`); engleske strane
posle njega učitavaju i `en.js`. Ključ bez prevoda pada na srpski tekst.

**Katalog** (`js/catalog.js`): uz svako srpsko polje za prikaz stoji englesko
sa sufiksom `_en` (`name_en`, `note_en`, …); `catalog-render.js` i
konfigurator ih koriste na engleskim stranama.

**Asistent**: engleska baza je `js/kb.en.js` (isti `id`-jevi kao `kb.js`,
linkovi na engleske strane). Na engleskim stranama asistent prvo traži u
engleskoj bazi, a ako je pitanje na srpskom, odgovara iz `kb.js`. Izmena
odgovora: menjati oba fajla.

**SEO**: svaka strana ima `canonical` na sebe i tri `hreflang` veze (`sr`,
`en`, `x-default` → srpska), recipročno; engleske strane imaju
`og:locale` `en_GB`, sopstvene OG slike u `assets/og/en/` i JSON-LD sa
`inLanguage: "en"`. `sitemap.xml` sadrži obe verzije sa `xhtml:link`
alternativama.

**Nova strana**: napraviti srpsku i englesku, dodati par u mapu u
`js/lang.js` i `L10N` (`js/i18n/sr.js`, `PAGES`), `hreflang` veze na obe
strane i obe adrese u `sitemap.xml`.

## Postavljanje na hosting

Sajt više nije čisto statičan: javne strane su PHP (PHP 8.3 + MySQL/MariaDB, Apache sa
mod_rewrite) na **istim .html adresama**, a sadržaj (proizvodi, usluge, reference, galerija,
česta pitanja, kontakt) uređuje se u administraciji `/admin/`. Nije potreban SSH, Composer,
Node ni build korak na serveru.

Instalacija, spisak fajlova za hosting, SQL fajlovi (nova instalacija / zakrpe) i podešavanja:
**`TRICOM_IMPLEMENTATION.md`, §16 „Postavljanje (deployment)“**.

Na hosting **ne idu** `_tools/`, `README.md` i `TRICOM_IMPLEMENTATION.md`.

Fontovi (Archivo, IBM Plex — SIL OFL) su u `assets/fonts` (`css/fonts.css`).

### Verzija resursa (`?v=`) i keširanje

Strane dobijaju `?v=` iz `app.asset_version` u `app/config.php`. **Posle izmene CSS-a ili JS-a**
upišite tamo novu oznaku (npr. datum). Reference unutar CSS/JS fajlova (pozadine, fontovi) imaju
svoju oznaku u samom fajlu. Putanje slika u podacima nemaju verziju: izmenjenu sliku sačuvajte
pod novim imenom (otpremljene slike uvek dobijaju novo, jedinstveno ime).

Domen za `canonical`, Open Graph, JSON-LD, `sitemap.xml` i `robots.txt` dolazi iz
`app.base_url` (i `app.base_path`) — u HTML fajlovima ga više ne treba menjati.

## Dopunjavanje AI asistenta

Asistent ne koristi nikakav API i ne šalje podatke nikome — sve radi u
pregledaču posetioca. Odgovori su u `js/kb.js` (engleski u `js/kb.en.js`), u nizu `entries` — baza se učitava tek kad
posetilac otvori asistenta:

```js
{
  k: ['plazma', 'sečenje plazmom', 'cnc'],   // ključne reči i fraze
  q: 'Sečenje na CNC plazmi',                // naslov odgovora
  a: '<p>Tekst odgovora, dozvoljen HTML.</p>',
  w: 1.2,                                    // težina (opciono, podrazumevano 1)
  actions: [{ label: 'Detaljno', href: 'plazma.html' }]
}
```

Nov odgovor se dodaje kao nov objekat u niz. Matcher sam radi sa padežima,
ćirilicom i dijakritikom, pa ključne reči pišite u osnovnom obliku.

Predloge dugmića koje asistent nudi na početku menjate u `chips` nizu istog fajla.

## Temporary photos to replace

Sve ilustracije su zamenjene fotografijama. Trenutno su u upotrebi **tri
privremene fotografije** — `assets/tricom-1.jpg`, `tricom-2.jpg` i
`tricom-3.jpg`. Svaki blok sa privremenom slikom u HTML-u nosi komentar:

```html
<!-- TEMP PHOTO: replace with client photography -->
```

pa se sva mesta nalaze pretragom po `TEMP PHOTO`.

> **Natpisi idu zajedno sa fotografijama.** Natpisi u galeriji (`data-cap` i
> `.gitem__cap`), oznake na FIG tablicama (`data-figlabel`) i `alt` tekstovi
> pisani su tako da opisuju **privremenu** fotografiju („…— privremena
> fotografija“). Kada stignu prave fotografije, ti natpisi se pišu iznova —
> tek tada mogu da opisuju ono što se stvarno vidi (presek profila, rez
> plazmom, pogon). Isto važi za naslov i opis strane `galerija.html`.

| Strana | Blokovi sa fotografijom | Broj `<img>` |
|---|---|---|
| `index.html` | „Šta TRICOM radi“, `#plazma-blok` (2), „Reference“, `.refhero`, „Kako ide posao“, bočna kolona uz česta pitanja | 10 |
| `o-nama.html` | bočna kolona uvoda, „Sve na jednom mestu“, „Istorijat“, `#kapaciteti` (panorama), „Politika kvaliteta“, „Društvena odgovornost“ | 6 |
| `usluge.html` | `#secenje`, `#savijanje`, 6 `.pcard` kartica profilisanja, `#profili` (2), „Naručivanje“ | 11 |
| `plazma.html` | bočna kolona „Kako to radi“ (2), „Priprema“, bočna kolona čestih pitanja | 4 |
| `proizvodi.html` | svih šest tabova: limovi, krov (6 `.pcard`), oluci (2), cevi (3 `.pcard`), kovano (2), alati; plus „Cena zavisi od količine“ | 16 |
| `reference.html` | `.refhero`, tri kartice „vrste zahtevnosti“, „Objekti i partneri“ | 5 |
| `galerija.html` | 28 pločica sa lightboxom | 28 |
| `kontakt.html` | bočna kolona uz formu, „Uslovi poslovanja“ | 2 |

Kao CSS pozadine (u `css/layout.css`) fotografije koriste još i:

| Pravilo | Slika |
|---|---|
| `.pagehead--1` / `--2` / `--3 .pagehead__photo` (*O nama*, *Reference*, *Galerija*, *Kontakt*) | tricom-1 / 2 / 3 |
| `.footer__cta::before` (poziv na akciju iznad futera, na svih 9 strana) | tricom-2 |

Pošto se iste tri slike ponavljaju mnogo puta, kadar se namerno pomera:
klase `.figbox--top/bottom/left/right/tl/tr/bl/br` i atribut `data-pos`
menjaju `object-position`, a `data-zoom` u galeriji menja i uvećanje. Odnosi
stranica se takođe smenjuju (`--wide` 16/10, `--film` 2/1, `--pano` 21/9,
`--sq`, `--tall`). Kada stignu prave fotografije, ta varijacija više nije
neophodna, ali ne smeta.

### Kako ih zameniti finalnim fotografijama

**Najjednostavniji put:** snimite finalne fotografije pod istim imenima
(`assets/tricom-1.jpg`, `-2.jpg`, `-3.jpg`) i ništa u kodu ne treba menjati.
Preporučena veličina je do 1920 px po dužoj ivici, JPEG kvalitet ~82.

**Ako želite više različitih fotografija**, menja se samo `src` (i `alt`) u
postojećim `<img>` tagovima — putanje i klase ostaju iste:

```html
<img src="assets/foto/krov-hala.jpg" alt="Opis šta se vidi na fotografiji"
     width="1672" height="941" loading="lazy" decoding="async">
```

Obavezno zadržite `alt`, `width` i `height` (sprečavaju skakanje layouta) i
`loading="lazy"` za sve što nije u prvom ekranu.

Nosači slika već imaju `aspect-ratio` i `object-fit: cover`, pa se fotografija
nikad ne izobličava: `.figbox` (panel u tekstu), `.pcard__fig` (kartica
proizvoda), `.gitem` (galerija), `.refhero .figbox`.

U galeriji uz svaku pločicu ide i `data-full="assets/tricom-N.jpg"` — to je
slika koju otvara lightbox. Ako imate veću verziju, upišite njenu putanju tu.

Zaglavlja *O nama*, *Reference*, *Galerija* i *Kontakt* nose toniranu
fotografiju desno (`.pagehead__photo`); putanje su u `css/layout.css`, u
pravilima `.pagehead--1 .pagehead__photo`, `--2` i `--3` (o-nama → 1,
reference → 2, galerija → 3, kontakt → 1). *Usluge*, *CNC plazma* i
*Prodajni program* umesto fotografije imaju 3D objekat.

Male tehničke ikonice (`.prog__svg` u mreži programa, ikone u karticama i
futeru) namerno **ostaju SVG** — to su piktogrami, ne fotografije.

## Deset dodataka u dizajnu (i kako se gase)

Svaki od njih je zaokružen blok sa komentarom u CSS-u ili JS-u i može da se
ukloni nezavisno od ostalih.

| # | Šta je | Gde |
|---|---|---|
| 01 | FIG tablice — registarski uglovi + mono oznaka na svakoj fotografiji | `components.css`, blok „UPGRADE 01“; brojevi su `data-fig` / `data-figlabel` u HTML-u |
| 02 | Indeks sekcije „01 / 08“ u gornjem levom uglu | `pages.css`, `.sectionix`; brojevi su u HTML-u (`<p class="sectionix">`) |
| 03 | Tabele kao list iz kataloga — redni broj, desno poravnate jedinice, lepljiva glava, brend linija, zebra | `components.css`, blok „UPGRADE 03“; `td.spec__no` u HTML-u |
| 04 | Živi status „Otvoreno / Zatvoreno“ — **preseljen iz zaglavlja u futer** (v. dodatak 19) | modul 25 u `main.js`; proračun je `window.tricomHours(date)`, izgled `.fhours` u `layout.css` |
| 05 | Tipografski vodeni žig „TRICOM“ u futeru | `layout.css`, `.site-footer::after` |
| 06 | Kerf podvlaka na svim tekstualnim vezama | `components.css`, blok „UPGRADE 06“ + `.nav__link::after` |
| 07 | Mikropokret dugmadi (strelica 4 px) i prsten fokusa; magnetna dugmad i nagib kartica su isključeni u doradi | `components.css`, blok „UPGRADE 07“ |
| 08 | Toniranje fotografija po temi: hladno i desaturisano u svetloj, dublje senke i plavo u svetlima u tamnoj (`--photo-filter` / `--photo-tint`) | `base.css` (tokeni) + `components.css`, blok „UPGRADE 08“ |
| 09 | Forma kao instrument tabla — numerisane oznake, linija na fokus, brojač znakova | `components.css`, blok „UPGRADE 09“ + modul 27 u `main.js` |
| 10 | Veza između koraka procesa se puni pri skrolu | `pages.css`, blok „UPGRADE 10“ + modul 26 u `main.js` |

Napomene:
- Pilula radnog vremena **više nije u zaglavlju**. Isti proračun sada stoji u
  redu „RADNO VREME“ datasheet tabele u futeru (dodatak 19).
- Uz `prefers-reduced-motion` linija procesa je puna i statična, a svi koraci
  označeni.

## Još deset dodataka (i kako se gase)

Drugi krug. Isto pravilo: svaki je zaokružen blok sa komentarom i može da se
ukloni nezavisno od ostalih.

| # | Šta je | Gde |
|---|---|---|
| 11 | Mere u naslovima (`30 mm`, `2400 m²`, `1966.`) u mono slovu, brend plavo, sa podvlakom | modul 28 u `main.js` + `h1 .num, h2 .num, h3 .num, .lead .num` u `components.css` |
| 12 | Kote ispod brojeva — hairline sa krajnjim crticama i jedinicom na sredini | `components.css`, blok „UPGRADE 02“ (drugi krug); jedinica je `data-kote` u HTML-u |
| 13 | Bočna šina sa pregledom sekcija (desktop ≥ 1200 px) | modul 29 u `main.js` + `.rail` u `pages.css`; natpis se može zadati sa `data-rail-label` na sekciji |
| 14 | Brojači kao mehanički kotur (odometar) | modul 6 u `main.js` + `.odo` u `components.css` |
| 15 | „Cinema“ panel (grafit sa jedva vidljivom nacrtnom mrežom, tamna u obe teme) + pločica `SHEET 01 · TRICOM · 1:1` | `pages.css`, blok „Cinema panel“; važi za `main > .section.dark` |
| 16 | Nišan samo nad interaktivnim elementom (prsten nad vezom / dugmetom / poljem, „UVEĆAJ“ nad pločicom galerije); van njih nema dodatnog kursora | modul kursora u `main.js` + `.cursor__lbl` / `.cursor.is-*` u `layout.css` |
| 17 | Lepljiva traka tabova i filtera galerije | `components.css`, `.tabs__nav { position: sticky }` + `.tabs { scroll-margin-top }` |
| 18 | Traka sa podacima u lightboxu + oznaka kategorije na pločici galerije | modul galerije u `main.js` + `.lightbox__meta` / `.gitem__tag` u `components.css` |
| 19 | Futer kao datasheet (PRODAJA / DIREKCIJA / E-POŠTA / RADNO VREME / PIB) sa živim statusom | `layout.css`, `.fsheet` / `.fhours` + modul 25 u `main.js` |
| 20 | List za štampu | `css/print.css`, `media="print"` na svih 9 strana |

Napomene:
- Šina (13) je ispod 1200 px i pod `prefers-reduced-motion` providna, ali
  **ostaje dohvatljiva tastaturom** — fokus je otkriva, isto kao `.skip-link`.
  Zato `opacity: 0`, a ne `display: none`.
- Klasa `.num` (11) već postoji na ćelijama tabele specifikacija, pa je pravilo
  namerno ograničeno na naslove i `.lead`. U tom opsegu na sajtu ima **osam**
  vrednosti (`index` 2, `o-nama` 3, `usluge` 3); ostale mere stoje u tabelama,
  HUD traci i `.cap__v`, koje već imaju svoje mono oblikovanje.
- Blueprint (15) postoji samo tamo gde strana ima tamnu akcentnu sekciju:
  `index #plazma-blok`, `o-nama #kapaciteti`, `usluge #profili`. Ostalih šest
  strana nema takvu sekciju i nije im dodata.

## Štampa

`css/print.css` se učitava sa `media="print"` i ne utiče na ekran. Skida
zaglavlje, navigaciju futera, dok, asistenta, slajder, nišan, šinu i poruke;
otvara sve tabove i akordeone; vraća dokument na crno na belom; tabelama daje
pun okvir; adrese spoljnih veza ispisuje iza teksta veze.

Zaglavlje se ponavlja na svakoj štampanoj strani preko `body::before`
(`position: fixed`), a `@page { margin-top }` mu ostavlja mesto. Ako se menja
adresa ili telefon, tekst zaglavlja je u `content:` tog pravila — mora ručno da
se uskladi sa futerom.

## Pristupačnost i performanse

- Sve animacije se gase pod `prefers-reduced-motion`.
- Mapa na kontaktu je fasada (ilustracija `assets/map/map-facade.svg`, dugme „Prikaži mapu“ i veza ka
  Google mapama): iframe se ubacuje tek na klik — pre toga nema nijednog zahteva ka Google-u.
- Nema loadera preko cele strane: tekst, slike i hero poster se crtaju odmah. Fontovi su
  `font-display: swap` sa rezervama podešene veličine (`base.css`); preload samo za font naslova
  (Archivo latin). Fontovi su podskup znakova koje sajt koristi (`python _tools/font-subset.py`,
  izvornici u `_tools/fonts-src/`; pokrenuti ponovo ako tekst dobije nova slova).
- Skripte strane kreću posle prvog crtanja (ugrađeni pokretač na kraju `<body>`, unos
  first-contentful-paint, istim redom; `_tools/script-boot.js`). Kad se poslednja izvrši:
  `html[data-ready]` i događaj `tricom:ready` — provere čekaju taj znak, ne pauze.
  `js/glass-dom.js` je jedina sinhrona skripta: pre prvog rasporeda dodaje klase stakla, jezičke,
  HUD uglove, slojeve prostora i razred (`tier-*`), pa posle učitavanja nema preračunavanja stila
  cele strane. Fasete tamne teme su statična pločica (`node _tools/facets.js`).
- Telefon (≤ 768 px) i slab hardver (`tier-low`): bez `backdrop-filter`-a — staklo je puna providna
  ispuna iste nijanse (`glass.css`, odeljak 10). Desktop je nepromenjen.
- Konfigurator: loader stoji samo preko 3D scene, ispod je slika izabranog tipa objekta (poster,
  WebP). Na slabom uređaju (`tier-low`) počinje slikom, koracima i specifikacijom, a 3D je jedan
  dodir dalje („Prikaži 3D“, `?gl=1`).
- Gubitak WebGL konteksta (npr. reset GPU procesa): hero se vraća na statičnu sliku, konfigurator
  na ilustraciju sa istim koracima; kad pregledač vrati kontekst, scena se gradi ponovo.
- Hero se pauzira kada je tab u pozadini ili hero van ekrana; najveći element
  prvog kadra je naslov, a 3D se pokreće tek posle učitavanja strane.
- Lista objekata u referencama je mirna mreža — van hero platna nema
  neprekidnih animacija.
- Tabovi, akordeon, galerija, lightbox i slajder rade sa tastature.
- Svaki par tekst/pozadina zadovoljava WCAG AA — i tamo gde tekst stoji preko
  fotografije (hero i zaglavlja podstranica). Ako menjate fotografije za
  svetlije, proverite čitljivost ili pojačajte preliv preko promenljivih
  `--ph-a1…--ph-a4` (`.pagehead`) odnosno `--h-a1…--h-a4` (`.hero__overlay`).
