/* ==========================================================================
   TRICOM — kb.js
   Baza znanja za asistenta na sajtu. Radi lokalno, bez API-ja i bez mreže.
   Svi podaci su iz zvanične dokumentacije i sadržaja firme.

   Struktura zapisa:
     id    — jedinstvena oznaka
     k     — ključne reči (bez dijakritike je dovoljno, matcher normalizuje)
     w     — težina zapisa (podrazumevano 1)
     q     — kratak naslov odgovora
     a     — HTML odgovora
     acts  — [{label, href, icon}] opcione akcije
   ========================================================================== */

window.TRICOM_KB = {

  /* ---------------------------------------------------------------- Podaci */
  company: {
    name: 'TRICOM d.o.o.',
    since: 1966,
    pib: '100093247',
    email: 'office@tricom.rs',
    email2: 'veleprodaja@tricom.rs',
    prodaja: {
      label: 'Proizvodnja i prodaja',
      addr: 'Kneza Paskača 16–18, 11273 Batajnica, Beograd',
      tel: ['+381 63 850 30 00', '+381 60 380 16 68', '+381 11 787 00 24', '+381 11 787 03 48', '+381 11 787 03 49']
    }
  },

  /* -------------------------------------------------------- Brzi predlozi */
  chips: [
    'Do koje debljine sečete lim?',
    'Koje trapezne limove imate?',
    'Gde se nalazite i kad radite?',
    'Kako se naručuje i plaća?',
    'Da li radite montažu?',
    'Tražim ponudu za pocinkovani lim'
  ],

  /* ----------------------------------------------------------- Pozdravi itd. */
  greetings: {
    k: ['dobar dan', 'zdravo', 'pozdrav', 'hello', 'hi', 'ćao', 'cao', 'dobro jutro', 'dobro vece', 'dobro veče', 'hej'],
    a: 'Dobar dan. Ja sam asistent na sajtu <strong>TRICOM</strong>-a — pomažem oko mogućnosti mašina, asortimana, uslova naručivanja i kontakta.<br><br>Pitajte slobodno, ili izaberite jedan od predloga ispod.'
  },

  thanks: {
    k: ['hvala', 'thanks', 'thank you', 'super', 'odlicno', 'odlično', 'mnogo hvala', 'puno hvala'],
    a: 'Nema na čemu. Ako treba konkretna ponuda, najbrže je da pozovete prodaju ili pošaljete specifikaciju na mejl — odgovor stiže u najkraćem roku.'
  },

  bye: {
    k: ['dovidjenja', 'doviđenja', 'bye', 'prijatno', 'ciao', 'hvala dovidjenja'],
    a: 'Prijatno. TRICOM je dostupan na <a href="tel:+381638503000">+381 63 850 30 00</a> — radno vreme: {hours}.'
  },

  /* ----------------------------------------------------------- Fallback */
  fallback: {
    a: 'Na to ne mogu da odgovorim sa sigurnošću iz onoga što imam u bazi, a ne želim da pogađam kada je reč o tehničkim podacima.<br><br>Mogu da pomognem oko: <strong>mogućnosti mašina</strong> (plazma, makaze, prese, profilirke), <strong>asortimana</strong> (limovi, cevi, profili, oluci, alati), <strong>uslova naručivanja i plaćanja</strong>, <strong>referenci</strong> i <strong>kontakta</strong>.<br><br>Za sve ostalo najbolje je direktno kontaktirati prodaju:',
    acts: [
      { label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' },
      { label: 'Pošaljite upit', href: 'mailto:office@tricom.rs', icon: 'mail' },
      { label: 'Kontakt stranica', href: 'kontakt.html', icon: 'arrow' }
    ]
  },

  /* ================================================================ Zapisi */
  entries: [

    /* ---- Sečenje / plazma ---- */
    {
      id: 'plazma',
      w: 1.2,
      k: ['plazma', 'plazmi', 'plazmom', 'cnc', 'cnc plazma', 'secenje plazmom', 'rezanje plazmom', 'plasma',
          'debljina plazma', 'koliko debelo plazma', '30mm', '30 mm',
          'imate li plazmu', 'da li imate plazmu', 'plazma secenje', 'plazma rezanje',
          '25mm', '25 mm', '20mm', '20 mm', '15mm', '15 mm', '12mm', '12 mm', '10mm', '10 mm',
          'secete li celik', 'sečete li čelik', 'celik', 'čelik', 'konture', 'kontura', 'rupe u limu',
          'slozeni oblik', 'složeni oblik', 'po nacrtu', 'nacrt'],
      q: 'Sečenje na CNC plazmi',
      a: 'Na CNC plazmi sečemo lim <strong>do 30 mm</strong>, a gasnim rezanjem <strong>do 150 mm</strong>. Radni sto je <strong>2,5 × 8 m</strong>.<br><br>Mašina je u potpunosti kompjuterski vođena, pa je mogućnost greške svedena na minimum. Sečemo:<ul><li>obojene metale — bakar, aluminijum</li><li>razne vrste čelika</li><li>prohromske (inox) limove</li></ul>Radimo po vašem DXF/DWG fajlu ili skici. Takođe možemo skoro svaku fotografiju, uz određenu korekciju, prilagoditi rezanju na plazmi — u granicama mogućnosti mašine.',
      acts: [{ label: 'Detaljno o plazmi', href: 'plazma.html', icon: 'arrow' }]
    },
    {
      id: 'gasno',
      k: ['gasno', 'gasno rezanje', 'autogeno', '150mm', '150 mm', 'debeo lim', 'debele ploce', 'debele ploče', 'grube ploce',
          'najdeblja ploca', 'najdeblja ploča', 'najdeblje', 'koliko debelo mozete', 'koliko debelo možete',
          'maksimalna debljina', 'najveca debljina', 'najveća debljina', 'ploca', 'ploča', '100mm', '100 mm',
          '50mm', '50 mm', '40mm', '40 mm'],
      q: 'Gasno rezanje',
      a: 'Gasnim rezanjem idemo <strong>do 150 mm</strong> debljine. Koristi se za debele ploče i grube pripremke gde plazma nije dovoljna — noseće ploče, temeljne ploče, masivni delovi.<br><br>Radni sto je zajednički sa plazmom: <strong>2,5 × 8 m</strong>.',
      acts: [{ label: 'Detaljno o rezanju', href: 'plazma.html', icon: 'arrow' }]
    },
    {
      id: 'makaze',
      w: 1.1,
      k: ['makaze', 'makazama', 'secenje lima', 'sečenje lima', 'secenje makazama', '13mm', '13 mm', 'giljotina',
          'hidraulicne makaze', 'hidraulične makaze', 'do koje debljine', 'koja debljina', 'debljina lima'],
      q: 'Sečenje lima makazama',
      a: 'Elektromotornim i hidrauličnim makazama sečemo:<ul><li>lim <strong>do 13 mm</strong> debljine</li><li>prohromski (inox) lim <strong>do 9 mm</strong></li></ul>Za veće debljine ide plazma (do 30 mm) ili gasno rezanje (do 150 mm).',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'slitovanje',
      k: ['slitovanje', 'slitovati', 'poduzno secenje', 'podužno sečenje', 'premotavanje', 'kotur', 'koturu',
          'traka', 'trake', '1260', 'sirina kotura', 'širina kotura'],
      q: 'Podužno sečenje (slitovanje) i premotavanje',
      a: 'Podužno sečenje (slitovanje) i premotavanje lima u koturu radimo do <strong>1260 mm širine</strong>.<br><br>Od kotura dobijate trake željene širine, spremne za dalju profilaciju ili prodaju. Premotavanje se koristi i za prepakivanje kotura na manje težine.',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'savijanje',
      k: ['savijanje', 'savijati', 'abkant', 'apkant', 'presa', 'abkant presa', 'rundovanje', 'oblikovanje',
          'deformacija lima', 'krivljenje', 'nc presa',
          'probijanje', 'probijanje rupa', 'isecanje uglova', 'isecanje', 'probijati',
          'otvori u limu', 'stancovanje', 'stancanje'],
      q: 'Savijanje i oblikovanje limova',
      a: 'Savijamo i oblikujemo lim na:<ul><li><strong>NC presi dužine 3 m</strong></li><li><strong>apkant presi dužine 8,2 m</strong> — za dugačke opšivke i profile</li></ul>Radimo i probijanja, isecanje uglova, ispravljanje i peglanje flahova, te lučno savijanje cevi i flahova.',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'flahovi',
      k: ['ispravljanje', 'peglanje', 'ispravljanje flahova', 'peglanje flahova', 'flah', 'flahovi',
          'ravnanje', 'ravnanje flahova', 'iskrivljen flah', 'krivi flah',
          'lucno savijanje', 'lučno savijanje', 'lucno', 'savijanje cevi', 'rundovanje', 'luk',
          'zaobljavanje', 'kruzno savijanje', 'kružno savijanje'],
      q: 'Ispravljanje flahova i lučno savijanje',
      a: 'Dve operacije nad pljosnatim i cevastim profilima:<ul>'
       + '<li><strong>Ispravljanje i peglanje flahova</strong> — ravnanje pljosnatih profila pre dalje obrade ili ugradnje.</li>'
       + '<li><strong>Lučno savijanje cevi i flahova</strong> — kružno i lučno oblikovanje za zaobljene elemente, lukove i ograde.</li>'
       + '</ul>Obe se rade u pogonu, uz ostale operacije nad profilima (sečenje na meru, grifovanje).',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'testera',
      k: ['testera', 'trakasta testera', 'secenje profila', 'sečenje profila', 'secenje cevi', 'rezanje cevi',
          'skracivanje', 'skraćivanje', 'secenje na meru'],
      q: 'Sečenje metalnih profila',
      a: 'Na trakastim testerama sečemo čelične profile na meru — cevi, firkant, flah, ugaonike, U i I profile.<br><br>Dodatno radimo varenje i pripremu profila, kao i grifovanje šipkastih profila.',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'grifovanje',
      k: ['grifovanje', 'grifovan', 'grifovano', 'grif', 'grifovani flah', 'grifovane cevi', 'kovani izgled'],
      q: 'Grifovanje šipkastih profila',
      a: 'Grifovanje je mehanička obrada kojom profil dobija karakterističnu ornamentiranu (kovanu) površinu. Radimo grifovanje:<ul><li>flahova</li><li>kvadratnih i pravougaonih cevi</li><li>punih kvadratnih profila</li></ul>Grifovani profili se najviše koriste za kovane ograde, kapije i gelendere.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },

    /* ---- Trapezni lim ---- */
    {
      id: 'trapezni',
      w: 1.2,
      k: ['trapezni', 'trapezni lim', 'tr lim', 'tr-lim', 'krovni lim', 'pokrivni lim', 'profilisani lim',
          'tr 40', 'tr40', 'tr 35', 'tr 20', 'tr 10', 'plafonski lim', 'fasadni lim', 'tipovi trapeznog'],
      q: 'Trapezni (profilisani) limovi',
      a: 'Proizvodimo trapezni pokrivni lim u profilima:<ul><li><span class="mono">TR 10/162,5</span></li><li><span class="mono">TR 20/185</span></li><li><span class="mono">TR 35/270</span></li><li><span class="mono">TR 40/230</span></li><li><span class="mono">TR 40/230</span> — ojačan u gornjoj zoni</li></ul>Radimo i <strong>imitaciju crepa</strong>, <strong>parapetni lim</strong> i <strong>lamperiju</strong>. Dužina se reže <strong>po meri kupca</strong>, a lim može biti pocinkovani, plastificirani (bojeni po RAL karti) ili aluminijumski.<br><br>Za krovove je u ponudi i verzija sa <strong>antikondenz filcom</strong>.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'antikondenz',
      k: ['antikondenz', 'anti kondenz', 'filc', 'kondenzacija', 'rosa', 'kapljanje', 'vlaga na limu'],
      q: 'Lim sa antikondenz filcom',
      a: 'TR lim i imitacija crepa mogu se dobiti sa <strong>antikondenz filcom</strong> — sloj na donjoj strani lima koji upija kondenzat i sprečava kapljanje.<br><br>Koristi se na nadstrešnicama, halama, garažama i svuda gde nema dodatne izolacije ispod pokrivača.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'crep',
      k: ['imitacija crepa', 'crep', 'crep ploca', 'crep ploča', 'lim u obliku crepa', 'crep lim'],
      q: 'Imitacija crepa',
      a: 'Imitacija crepa je profilisani lim koji izgledom prati klasični crep, a ima prednosti lima — mala težina, brza montaža, manje nosivosti potrebno u krovnoj konstrukciji.<br><br>Dostupna je u pocinkovanoj i plastificiranoj (bojenoj) varijanti, sa ili bez antikondenz filca.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },

    /* ---- Oluci ---- */
    {
      id: 'oluci',
      w: 1.15,
      k: ['oluk', 'oluci', 'oluke', 'vertikala', 'vertikale', 'olucni sistem', 'olučni sistem', 'kisnica', 'rs', 'format', 'rš',
          'kišnica', 'poluokrugli oluk', 'cetvrtasti oluk', 'četvrtasti oluk', 'beskonacni oluk', 'beskonačni oluk'],
      q: 'Oluci i vertikale',
      a: 'Proizvodimo kompletan olučni sistem:<ul><li><strong>poluokrugli</strong> i <strong>četvrtasti oluci</strong></li><li><strong>okrugle</strong> i <strong>četvrtaste vertikale</strong></li><li>prateća galanterija — kuke, šelne, obujmice, kolena, vodokotlići, skupljači kišnice</li></ul>Oluci se izrađuju na profilirkama, <strong>dužine po želji kupca</strong> — praktično beskonačno, bez spojeva na dužini. Materijal: pocinkovani, plastificirani (u boji) ili bakarni lim.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'galanterija',
      k: ['limarska galanterija', 'gradjevinska limarija', 'građevinska limarija', 'opsivke', 'opšivke',
          'uvale', 'iksne', 'veterlajsne', 'vetar lajsne', 'okapnice', 'snegobran', 'lajsne', 'dimnjak kapa'],
      q: 'Limarska galanterija i opšivke',
      a: 'Izrađujemo kompletnu građevinsku limariju i limarsku galanteriju: <strong>uvale, iksne, vetar lajsne, okapnice, opšivke, slemena, snegobrane, kape za dimnjake, vodokotliće</strong> i ostalo.<br><br>Sve po skici ili po standardnim šemama, od pocinkovanog, plastificiranog, bakarnog, aluminijumskog ili inox lima. Za nestandardne detalje dovoljno je da donesete skicu.',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'lamperija',
      k: ['lamperija', 'lamperiju', 'aluminijumska lamperija', 'metalna lamperija', 'obloga plafona', 'podgled'],
      q: 'Lamperija',
      a: 'Proizvodimo metalnu i <strong>aluminijumsku lamperiju</strong> u raznim bojama i od raznih materijala, sa pratećim aluminijumskim lajsnama.<br><br>Koristi se za podgledе strehe, plafonske obloge, fasadne detalje i nadstrešnice.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'ventilacija',
      k: ['ventilacija', 'klimatizacija', 'kanali', 'kanal za ventilaciju', 'ventilacioni kanal', 'hvac', 'spiro'],
      q: 'Kanali za ventilaciju i klimatizaciju',
      a: 'Izrađujemo kanale za ventilaciju i klimatizaciju od pocinkovanog lima, po projektu ili po meri — pravougaone i okrugle sekcije sa pratećim elementima.',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'gazista',
      k: ['gazista', 'gazišta', 'gaziste', 'gazište', 'resetka', 'rešetka', 'resetkasto', 'pocinkovana gazista',
          'podest', 'platforma', 'pjesacka staza'],
      q: 'Pocinkovana gazišta',
      a: 'Izrađujemo <strong>pocinkovana gazišta</strong> (rešetkaste podeste) za industrijske platforme, stepenice, prelaze i servisne staze.<br><br>Gazište je ujedno i motiv u našem logotipu — to je proizvod sa kojim firma radi decenijama.',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'paneli',
      k: ['panel', 'paneli', 'sendvic panel', 'sendvič panel', 'termo panel', 'izolacioni panel'],
      q: 'Paneli i pokrivanje sa izolacijom',
      a: 'U programu pokrivanja krovnih konstrukcija nudimo <strong>panele</strong> i varijantu <strong>pokrivanja sa ručno postavljanom izolacijom</strong> — kada se izolacioni sloj postavlja na objektu, ispod pokrivnog lima.<br><br>Koje rešenje je bolje zavisi od raspona, nagiba i namene objekta — prodaja vam može dati preporuku na osnovu projekta.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },

    /* ---- Limovi ---- */
    {
      id: 'limovi',
      w: 1.1,
      k: ['lim', 'limovi', 'tabla', 'table', 'koji limovi', 'vrste limova', 'asortiman limova',
          'hvl', 'tvl', 'hvl i tvl', 'hladnovaljan', 'toplovaljan', 'hladno valjan', 'toplo valjan',
          'crni lim', 'rebrast lim', 'rebrasti lim', 'kotur', 'koturu'],
      q: 'Limovi u ponudi',
      a: 'U prodaji imamo limove u <strong>tablama i koturu</strong>:<ul><li><strong>pocinkovani</strong> lim</li><li><strong>aluminijumski</strong> lim</li><li><strong>bakarni</strong> lim</li><li><strong>crni limovi</strong> — hladnovaljani (HVL) i toplovaljani (TVL), ravan i rebrast TVL</li><li><strong>bojeni / plastificirani</strong> limovi po RAL karti</li><li><strong>prohromski (inox)</strong> limovi</li></ul>Sve možemo iseći, sliteovati, premotati ili profilisati po vašoj specifikaciji.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'pocinkovani',
      k: ['pocinkovan', 'pocinkovani lim', 'pocinkovana', 'cinkovan', 'plech', 'galvanizovan'],
      q: 'Pocinkovani lim',
      a: 'Pocinkovani lim imamo u tablama i koturu, u više debljina.<br><br>Za ponudu je potrebno da definišete <strong>debljinu, dimenziju table i količinu</strong> — količina određuje cenu. Od 1 tone naviše moguć je popust, a za veće količine popust je veći.',
      acts: [
        { label: 'Pošaljite specifikaciju', href: 'mailto:office@tricom.rs?subject=Upit%20-%20pocinkovani%20lim', icon: 'mail' },
        { label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }
      ]
    },
    {
      id: 'bakar',
      k: ['bakar', 'bakarni', 'bakarni lim', 'copper', 'bakarni oluk', 'bakarni krov'],
      q: 'Bakarni lim',
      a: 'Bakarni lim je materijal sa kojim TRICOM ima najviše iskustva na zahtevnim objektima. Na rezidencijalnom predsedničkom kompleksu u <strong>Karađorđevu</strong> obradili smo i ugradili <strong>32 tone bakra</strong>, a ceo posao je završen za <strong>48 dana</strong>.<br><br>Radimo bakarne pokrivne table, oluke, vertikale i kompletnu galanteriju.',
      acts: [{ label: 'Reference', href: 'reference.html', icon: 'arrow' }]
    },
    {
      id: 'inox',
      k: ['inox', 'prohrom', 'prohromski', 'nerdjajuci', 'nerđajući', 'rostfraj', 'stainless'],
      q: 'Prohromski (inox) limovi',
      a: 'Prohromski (inox) limovi su u ponudi u tablama.<br><br>Za obradu: makazama sečemo inox <strong>do 9 mm</strong>, a na CNC plazmi <strong>do 30 mm</strong>.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'aluminijum',
      k: ['aluminijum', 'aluminijumski', 'alu', 'aluminium', 'aluminijumski profili'],
      q: 'Aluminijum i aluminijumski profili',
      a: 'U ponudi je aluminijumski program:<ul><li>aluminijumski lim (table i kotur)</li><li>aluminijumski profili i lajsne</li><li>aluminijumski trapezni lim</li><li>aluminijumska lamperija</li></ul>',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'ral',
      k: ['ral', 'boja', 'boje', 'u boji', 'bojeni lim', 'plastificiran', 'plastificirani', 'ral karta', 'koje boje'],
      q: 'Boje i plastifikacija',
      a: 'Bojeni (plastificirani) limovi rade se po <strong>RAL karti</strong>. Najtraženije nijanse u limariji su:<ul><li><span class="mono">RAL 9002</span> bela · <span class="mono">RAL 9006</span> siva</li><li><span class="mono">RAL 9005</span> crna · <span class="mono">RAL 7016</span> antracit</li><li><span class="mono">RAL 8019</span> braon · <span class="mono">RAL 3009</span> crvena</li></ul>Raspoloživost po boji i debljini proverite sa prodajom — zalihe se menjaju.',
      acts: [{ label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }]
    },

    /* ---- Cevi i profili ---- */
    {
      id: 'cevi',
      w: 1.1,
      k: ['cev', 'cevi', 'savne cevi', 'šavne cevi', 'kvadratna cev', 'pravougaona cev', 'okrugla cev',
          'firkant', 'zp profil', 'zp profili', 'colovne', 'precizne cevi'],
      q: 'Cevi i ZP profili',
      a: 'U prodaji su šavne cevi i hladno oblikovani ZP profili:<ul><li><strong>kvadratne</strong> i <strong>kvadratne grifovane</strong> cevi</li><li><strong>pravougaone</strong> i <strong>pravougaone grifovane</strong> cevi</li><li><strong>crne okrugle</strong> cevi (colovne)</li><li><strong>pocinkovane okrugle</strong> cevi</li><li><strong>ovalne precizne</strong> i <strong>okrugle precizne</strong> cevi</li></ul>Sečemo na meru i lučno savijamo.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'profili',
      k: ['profil', 'profili', 'celicni profili', 'čelični profili', 'flah', 'ugaonik', 'l profil', 'u profil',
          'i profil', 'kvadratni pun', 'hladno oblikovani', 'nosac', 'nosač'],
      q: 'Čelični profili',
      a: 'Čelični profili u ponudi:<ul><li><strong>flah</strong> i <strong>grifovani flah</strong></li><li><strong>ugaonik (L profil)</strong></li><li><strong>U profil</strong> i <strong>I profil</strong></li><li><strong>kvadratni pun</strong> profil</li><li><strong>hladno oblikovani</strong> profili</li></ul>Za dimenzije i raspoloživost na lageru pozovite prodaju — asortiman je širok i menja se.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'kovani',
      k: ['kovani', 'kovani elementi', 'kovano gvozdje', 'kovano gvožđe', 'ograda', 'ograde', 'kapija',
          'gelender', 'siljci', 'šiljci', 'ukrasni elementi'],
      q: 'Profili i elementi za kovane ograde',
      a: 'Za izradu kovanih ograda i kapija nudimo:<ul><li>grifovane profile (flah, cevi, kvadrat)</li><li><strong>kovane elemente</strong> — rozete, listove, kopita, spirale</li><li><strong>šiljke za ograde</strong></li><li>brave, okove i šarke</li></ul>',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'pletiva',
      k: ['pletivo', 'pletiva', 'grifovano pletivo', 'zica', 'žica', 'zice', 'resetke', 'mreza', 'mreža'],
      q: 'Žice, pletiva i rešetke',
      a: 'U ponudi su žice, pletiva (uključujući <strong>grifovano pletivo</strong>), rešetke i srodni proizvodi.<br><br>Za dimenzije okaca, debljine žice i raspoloživost pozovite prodaju.',
      acts: [{ label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }]
    },

    /* ---- Alati ---- */
    {
      id: 'alati',
      k: ['alat', 'alati', 'brusilica', 'busilica', 'bušilica', 'makita', 'bosch', 'bosh', 'dewalt', 'stanley',
          'black decker', 'elektricni alat', 'električni alat', 'merdevine', 'mimont'],
      q: 'Alati i oprema',
      a: 'Prodajemo alat i opremu za limare i bravare: <strong>Bosch, Makita, DeWalt, Stanley, Black &amp; Decker</strong>.<br><br>Uz to: ploče za sečenje i dijamantske ploče, burgije, tiplovi, šelne, šrafovska roba, brave, okovi, šarke, merdevine i Mimont pribor.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },
    {
      id: 'varenje',
      k: ['varenje', 'aparat za varenje', 'varstroj', 'zavarivanje', 'elektrode', 'zica za varenje',
          'maska za varenje', 'oprema za varenje', 'co2 aparat', 'tig', 'mig'],
      q: 'Oprema i materijal za varenje',
      a: 'U ponudi su <strong>Varstroj</strong> aparati za varenje, prateća oprema (maske, kablovi, držači) i pomoćni materijal za varenje.<br><br>Za konkretan model i specifikaciju pozovite prodaju.',
      acts: [{ label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }]
    },
    {
      id: 'srafovi',
      k: ['sraf', 'šraf', 'srafovi', 'šrafovi', 'srafovska roba', 'samoresci', 'samorezac', 'tipl', 'tiplovi',
          'selne', 'šelne', 'vijci', 'brava', 'brave', 'okov', 'okovi', 'sarke', 'šarke'],
      q: 'Šrafovska roba i materijal za bravare',
      a: 'Kompletna šrafovska roba i materijal za bravare: vijci, samorezci, tiplovi, šelne, burgije, brave, okovi, šarke, šiljci za ograde, ploče za sečenje i brušenje.',
      acts: [{ label: 'Prodajni program', href: 'proizvodi.html', icon: 'arrow' }]
    },

    /* ---- Poslovanje ---- */
    {
      id: 'narucivanje',
      w: 1.2,
      k: ['narucivanje', 'naručivanje', 'narudzbina', 'narudžbina', 'kako narucujem', 'kako se narucuje',
          'radni nalog', 'akontacija', 'avans', 'kako da narucim', 'porudzbina'],
      q: 'Kako se naručuje',
      a: 'Svaki proizvod koji se naruči definiše se <strong>radnim nalogom</strong>. Naručilac potpisuje radni nalog, pa se pri preuzimanju jasno vidi da li je eventualna greška nastala kod nas ili u specifikaciji.<br><br>Za svaku narudžbinu ostavlja se <strong>akontacija</strong> kao garancija da će narudžbina biti preuzeta. Ako je dogovorena i isporuka, ceo iznos mora biti plaćen, a račun je prateći dokument do mesta isporuke.<br><br>Za <strong>bezgotovinsko plaćanje</strong> (preko računa) narudžbine primamo telefonom, faksom i mejlom.',
      acts: [
        { label: 'Pošaljite specifikaciju', href: 'mailto:office@tricom.rs?subject=Narud%C5%BEbina', icon: 'mail' },
        { label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }
      ]
    },
    {
      id: 'placanje',
      w: 1.15,
      k: ['placanje', 'plaćanje', 'kako se placa', 'kartica', 'kartice', 'visa', 'master', 'dina', 'cek', 'ček',
          'cekovi', 'virman', 'gotovina', 'na rate', 'rate', 'kredit', 'odlozeno placanje', 'odloženo plaćanje'],
      q: 'Načini plaćanja',
      a: 'Prihvatamo:<ul><li>gotovinsko plaćanje preko fiskalne kase</li><li>bezgotovinsko plaćanje virmanom</li><li>čekove građana</li><li>platne kartice — <strong>Dina, Visa, MasterCard</strong> (sve vrste)</li><li>bankarski kredit — izdajemo predračun na ime banke, banka plaća u korist kreditiranog</li></ul><strong>Prodaju na rate ne vršimo</strong> — po propisima samo banke mogu davati kredite pravnim i fizičkim licima. Ako vam treba kredit, izdaćemo predračun za banku.',
      acts: [{ label: 'Često postavljana pitanja', href: 'o-nama.html#faq', icon: 'arrow' }]
    },
    {
      id: 'popust',
      k: ['popust', 'rabat', 'cena', 'cene', 'cenovnik', 'koliko kosta', 'koliko košta', 'ponuda', 'predracun',
          'predračun', 'skuplje', 'jeftinije', 'kolicinski popust', 'količinski popust'],
      q: 'Cene, ponude i popusti',
      a: 'Cenovnik ne objavljujemo na sajtu jer cena zavisi od materijala, debljine, dimenzije i <strong>količine</strong>.<br><br>Da bismo dali ponudu, potrebno je da definišete tražnju: <strong>debljina, veličina table / dimenzija, količina</strong>. Od <strong>1 tone</strong> naviše moguć je popust, a za veće količine popust je veći.<br><br>Za usluge obrade pošaljite skicu ili DXF/DWG fajl.',
      acts: [
        { label: 'Pošaljite upit', href: 'mailto:office@tricom.rs?subject=Zahtev%20za%20ponudu', icon: 'mail' },
        { label: 'Kontakt forma', href: 'kontakt.html#upit', icon: 'arrow' }
      ]
    },
    {
      id: 'reklamacija',
      k: ['reklamacija', 'povracaj', 'povraćaj', 'zamena', 'vracanje robe', 'vraćanje robe', 'garancija',
          'izgubio racun', 'izgubio račun', 'bez racuna', 'bez računa'],
      q: 'Reklamacije i povraćaj robe',
      a: 'Propisi za povraćaj robe su strogi:<ul><li>za bilo kakav povraćaj <strong>obavezan je račun</strong></li><li>za vrednost preko 500 dinara potrebna je i lična karta</li><li>reklamacija kvaliteta vrši se <strong>najkasnije 3 dana</strong> od prodaje — zamenom ili povraćajem novca</li></ul>U ostalim slučajevima zamena i povraćaj nisu mogući. Roba izrađena po meri (radni nalog) po prirodi stvari ne može se vratiti kao standardna.',
      acts: [{ label: 'Često postavljana pitanja', href: 'o-nama.html#faq', icon: 'arrow' }]
    },
    {
      id: 'isporuka',
      k: ['isporuka', 'dostava', 'prevoz', 'transport', 'da li dostavljate', 'dovozite', 'na adresu',
          'kamion', 'rok isporuke', 'koliko traje', 'rok',
          'da li isporucujete', 'da li isporučujete', 'isporucujete', 'isporučujete',
          'dostavljate', 'dovoz', 'preuzimanje', 'preuzimam', 'gde se preuzima', 'sopstveni prevoz'],
      q: 'Isporuka i rokovi',
      a: 'Roba se <strong>preuzima u Batajnici</strong>, na adresi prodaje. Za isporuku se raspitajte u prodaji — dogovara se uz narudžbinu. Ako je isporuka dogovorena, <strong>ceo dogovoreni iznos mora biti plaćen</strong>, a račun prati robu do mesta isporuke.<br><br>Rok zavisi od toga da li je artikal na lageru ili se izrađuje po radnom nalogu, kao i od količine. Rok se dogovara uz ponudu.',
      acts: [{ label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }]
    },
    {
      id: 'montaza',
      w: 1.2,
      k: ['montaza', 'montaža', 'da li montirate', 'ugradnja', 'da li ugradjujete', 'da li ugrađujete',
          'izvodjenje', 'izvođenje', 'radnici na terenu', 'postavljanje', 'pokrivanje krova', 'majstori'],
      q: 'Da li TRICOM radi montažu',
      a: '<strong>Ne — montažu ne radimo od 2006. godine.</strong><br><br>Tada je doneta strateška odluka da primarna delatnost budu <strong>proizvodnja i prodaja</strong> metalnih proizvoda, upravo zato da ne bismo bili konkurencija zanatskim radionicama i preduzećima koja kod nas kupuju materijal.<br><br>Umesto montaže nudimo:<ul><li>kompletnu izradu i pripremu elemenata za ugradnju</li><li><strong>savetodavnu podršku i konsalting</strong> na osnovu decenijskog izvođačkog iskustva</li></ul>Ako vam treba majstor, prodaja vam može uputiti na limare i bravare koji rade sa nama.',
      acts: [{ label: 'Istorijat firme', href: 'o-nama.html#istorijat', icon: 'arrow' }]
    },

    /* ---- Firma ---- */
    {
      id: 'kontakt',
      w: 1.3,
      k: ['kontakt', 'telefon', 'broj telefona', 'mejl', 'mail', 'email', 'gde ste', 'adresa', 'lokacija',
          'kako da vas nadjem', 'kako da vas nađem', 'radno vreme', 'kad radite', 'do kad radite',
          'da li radite subotom', 'subota', 'nedelja', 'batajnica', 'ugrinovci',
          'gde se nalazite', 'nalazite', 'gde vas ima', 'mapa', 'dolazak', 'kako da dodjem',
          'kako da dođem', 'ulica', 'sediste', 'sedište', 'kancelarija', 'magacin', 'poslovnica',
          'pogon', 'hala', 'grad', 'beograd', 'zemun'],
      q: 'Kontakt, lokacije i radno vreme',
      a: 'Radno vreme: <strong>{hours}</strong>.<br><br><strong>Proizvodnja i prodaja</strong><br>Kneza Paskača 16–18, 11273 Batajnica, Beograd<br><a href="tel:+381638503000">+381 63 850 30 00</a> · <a href="tel:+381603801668">+381 60 380 16 68</a><br><a href="tel:+381117870024">+381 11 787 00 24</a> · <a href="tel:+381117870348">+381 11 787 03 48</a><br><br>Mejl: <a href="mailto:office@tricom.rs">office@tricom.rs</a>',
      acts: [
        { label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' },
        { label: 'Kontakt stranica', href: 'kontakt.html', icon: 'arrow' }
      ]
    },
    {
      id: 'onama',
      k: ['o nama', 'ko ste', 'ko ste vi', 'cime se bavite', 'čime se bavite', 'sta radite', 'šta radite',
          'delatnost', 'firma', 'kompanija', 'o firmi', 'tricom', 'trivanovic', 'trivanović'],
      q: 'O firmi TRICOM',
      a: 'TRICOM je porodična firma iz Batajnice, u metaloprerađivačkoj delatnosti <strong>od 1966. godine</strong>.<br><br>Trivanovići su i pre Drugog svetskog rata bili kovači i limari; 1966. otvaraju limarsko-bravarsku radionicu, koja 1992. prerasta u preduzeće i širi delatnost na trgovinu metalom i metalnom galanterijom.<br><br>Danas je TRICOM orijentisan na <strong>izradu i isporuku limarskih proizvoda za građevinarstvo</strong> i na <strong>prodaju pratećeg pribora, opreme i alata</strong> za limare i bravare.',
      acts: [{ label: 'O nama', href: 'o-nama.html', icon: 'arrow' }]
    },
    {
      id: 'istorijat',
      k: ['istorijat', 'istorija', 'od kad postojite', 'koliko dugo', 'kada osnovana', '1966', '1992', '2006', '2009',
          'tradicija', 'godine postojanja',
          'od kada postojite', 'od kada radite', 'koliko godina', 'koliko dugo radite',
          'kada je osnovana', 'kada ste osnovani', 'osnovano', 'osnivanje', 'postojite', 'porodicna firma',
          'porodična firma'],
      q: 'Istorijat',
      a: 'Ključne godine:<ul><li><strong>1966.</strong> — počinje limarsko-bravarska radionica Trivanović</li><li><strong>1992.</strong> — radionica se preregistruje u preduzeće i širi se na trgovinu metalom</li><li><strong>2006.</strong> — strateška odluka: bez montaže, fokus na proizvodnju i prodaju</li><li><strong>2009.</strong> — nova proizvodna hala i centralni magacin u Ugrinovcima, <strong>1600 m²</strong>, uz postojeći objekat u Batajnici od <strong>800 m²</strong></li></ul>Iz izvođačkog perioda ostali su i radovi na velikim visinama — preko 30 m na Kliničkom centru Srbije i preko 50 m na silosima i šećeranama.',
      acts: [{ label: 'Ceo istorijat', href: 'o-nama.html#istorijat', icon: 'arrow' }]
    },
    {
      id: 'kapaciteti',
      k: ['kapacitet', 'kapaciteti', 'hala', 'hale', 'magacin', 'kvadratura', 'masine', 'mašine', 'oprema',
          '1600', '800', 'pogon', 'proizvodni kapacitet'],
      q: 'Kapaciteti i mašinski park',
      a: 'Dva objekta, ukupno <strong>2400 m²</strong>:<ul><li>Batajnica — <strong>800 m²</strong></li><li>Ugrinovci (Zemun) — proizvodna hala i centralni magacin, <strong>1600 m²</strong> (od 2009.)</li></ul>Mašinski park:<ul><li>CNC plazma do <strong>30 mm</strong> + gasno rezanje do <strong>150 mm</strong>, sto <strong>2,5 × 8 m</strong></li><li>hidraulične makaze do <strong>13 mm</strong></li><li>NC presa <strong>3 m</strong>, apkant presa <strong>8,2 m</strong></li><li>profilirke za oluk i vertikalu, profilirke za TR lim</li><li>mašina za parapet, mašina za lamperiju</li><li>trakaste testere i razne prese</li></ul>',
      acts: [{ label: 'Sve usluge', href: 'usluge.html', icon: 'arrow' }]
    },
    {
      id: 'sertifikati',
      k: ['sertifikat', 'sertifikati', 'bonitet', 'rejting', 'aaa', 'zlatni sertifikat', 'bisnode', 'coface',
          'excellent sme', 'kreditni rejting', 'iso', 'kvalitet', 'priznanja'],
      q: 'Sertifikati i bonitet',
      a: 'TRICOM ima:<ul><li><strong>Excellent SME Serbia</strong> — Privredna komora Srbije u saradnji sa Coface Srbija</li><li><strong>Rejting A</strong> — među 1% najuspešnijih kompanija u Srbiji po metodologiji EFQM (2014)</li><li><strong>Sertifikat bonitetne izvrsnosti AA</strong> (Bisnode) — svega 2% firmi u Srbiji</li><li><strong>Sertifikat AAA</strong> (Bisnode) na osnovu rezultata 2015.</li><li><strong>Zlatni sertifikat</strong> (2017, na osnovu rezultata 2014–2016) — dobilo ga je 115 od 446.449 aktivnih pravnih subjekata u Srbiji</li></ul>',
      acts: [{ label: 'Sertifikati', href: 'o-nama.html#sertifikati', icon: 'arrow' }]
    },
    {
      id: 'reference',
      w: 1.1,
      k: ['reference', 'referenca', 'objekti', 'gde ste radili', 'karadjordjevo', 'karađorđevo', 'usce', 'ušće',
          'zeleni venac', 'beograd na vodi', 'lidl', 'projekti', 'poznati objekti'],
      q: 'Reference',
      a: 'Najveći izvođački poduhvat: <strong>rezidencijalni predsednički kompleks u Karađorđevu</strong> — kompletni krovopokrivački radovi, <strong>32 tone bakra</strong> obrađeno i ugrađeno, sve završeno za <strong>48 dana</strong>.<br><br>Isporuke i radovi na objektima: Beograd na vodi, PC Ušće, pijaca Zeleni venac (za Ganex Krečković), LIDL, Continental Subotica, ZF Pančevo, GEZE Zrenjanin, MITAS Ruma, MEI TA Obrenovac, BOYSEN Subotica, NELT Dobanovci, Kuehne+Nagel Dobanovci, IPB Šimanovci, Sport Vision Šimanovci, TERRA Inđija, Gomex Zrenjanin, SAVACOOP Novi Sad, Pupinova palata, Brze pruge Srbije.',
      acts: [{ label: 'Sve reference', href: 'reference.html', icon: 'arrow' }]
    },
    {
      id: 'pib',
      k: ['pib', 'maticni broj', 'matični broj', 'pdv', 'podaci o firmi', 'racun firme', 'račun firme',
          'zvanicni podaci', 'zvanični podaci', 'faktura podaci'],
      q: 'Podaci o firmi',
      a: '<strong>TRICOM d.o.o.</strong>, Batajnica, Beograd<br>PIB: <span class="mono">100093247</span><br>Sedište: Kralja Vladislava 82, 11273 Batajnica<br>Mejl: <a href="mailto:office@tricom.rs">office@tricom.rs</a><br><br>Za potvrdu PDV evidencije i ostale zvanične dokumente obratite se direkciji.',
      acts: [{ label: 'Kontakt', href: 'kontakt.html', icon: 'arrow' }]
    },
    {
      id: 'dxf',
      k: ['dxf', 'dwg', 'crtez', 'crtež', 'fajl', 'skica', 'projekat', 'cad', 'nacrt', 'kako da posaljem crtez',
          'format fajla', 'autocad'],
      q: 'Dostavljanje crteža i skica',
      a: 'Za sečenje na plazmi najbolje je poslati <strong>DXF ili DWG</strong> fajl. Prihvatamo i:<ul><li>skicu sa kotama (i rukom nacrtanu)</li><li>PDF nacrt</li><li>fotografiju motiva — uz određenu korekciju prilagođavamo je rezanju, u granicama mogućnosti mašine</li></ul>Pošaljite na <a href="mailto:office@tricom.rs">office@tricom.rs</a> uz materijal, debljinu i količinu.',
      acts: [{ label: 'Pošaljite crtež', href: 'mailto:office@tricom.rs?subject=Crte%C5%BE%20za%20plazma%20rezanje', icon: 'mail' }]
    },
    {
      id: 'kupci',
      k: ['kome prodajete', 'da li radite fizickim licima', 'fizicka lica', 'fizička lica', 'pravna lica',
          'maloprodaja', 'veleprodaja', 'za koga radite', 'da li mogu kao privatno lice', 'komitenti'],
      q: 'Kome TRICOM prodaje',
      a: 'Radimo i sa pravnim i sa fizičkim licima: zanatske radionice, limari, bravari, izvođači radova, preduzeća koja dalje dorađuju proizvode, ali i privatna lica i „uradi sam" kupci.<br><br>U prodaji imamo i <strong>veleprodaju</strong> i <strong>maloprodaju</strong>, uz fiskalnu kasu za gotovinsko plaćanje.',
      acts: [{ label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }]
    },
    {
      id: 'kvalitet',
      k: ['politika kvaliteta', 'standardi', 'kontrola kvaliteta', 'zasto vas', 'zašto vas', 'zasto tricom',
          'prednosti', 'sve na jednom mestu'],
      q: 'Zašto TRICOM',
      a: 'Suština ponude je da poslovni partner dobije materijal <strong>u fazi isporuke koja mu odgovara</strong>:<ul><li>materijal u fabričkom pakovanju</li><li>obrada u obliku, količini i izgledu koji partner želi</li><li>izrada konkretnog proizvoda koji je partneru potreban</li><li>preuzimanje u Batajnici, uz isporuku po dogovoru</li></ul>Filozofija firme je da nema konkurenciju, već samo poslovne prijatelje i saradnike — zato od 2006. ne izlazimo na terenu kao izvođač.',
      acts: [{ label: 'O nama', href: 'o-nama.html', icon: 'arrow' }]
    },
    {
      id: 'galerija',
      k: ['galerija', 'slike', 'fotografije', 'primeri', 'kako izgleda', 'radovi', 'portfolio'],
      q: 'Galerija',
      a: 'U galeriji su primeri paneli sečenih na plazmi, limarske galanterije, olučnih sistema, profila i gotovih objekata.',
      acts: [{ label: 'Otvorite galeriju', href: 'galerija.html', icon: 'arrow' }]
    },
    {
      id: 'posao',
      k: ['posao', 'zaposlenje', 'konkurs', 'radno mesto', 'trazim posao', 'tražim posao', 'cv', 'prijava za posao'],
      q: 'Zaposlenje',
      a: 'Otvorene pozicije se ne objavljuju na sajtu. Prijavu i CV možete poslati na <a href="mailto:office@tricom.rs?subject=Prijava%20za%20posao">office@tricom.rs</a> — direkcija razmatra prijave kada ima potrebu.<br><br>TRICOM ima sporazum o <strong>poslovno-tehničkoj saradnji</strong> sa Akademijom tehničkih strukovnih studija u Beogradu (2022).',
      acts: [{ label: 'Pošaljite prijavu', href: 'mailto:office@tricom.rs?subject=Prijava%20za%20posao', icon: 'mail' }]
    },
    {
      id: 'assistant',
      k: ['ko si ti', 'da li si robot', 'da li si covek', 'da li si čovek', 'ai', 'bot', 'asistent',
          'sa kim razgovaram', 'jesi li pravi'],
      q: 'O asistentu',
      a: 'Nisam čovek — ja sam asistent ugrađen u sajt. Radim <strong>lokalno u vašem pregledaču</strong>, bez interneta i bez spoljnih servisa, i odgovaram iz baze podataka o TRICOM-u koju je sajt dobio.<br><br>Zato nemam pristup lageru, cenama u realnom vremenu ni statusu vaše narudžbine — za to su tu ljudi iz prodaje.',
      acts: [{ label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' }]
    },
    /* ---- Preneto sa starog sajta tricom.co.rs (oktobar 2026) — v. _content/old/facts.md ---- */
    {
      id: 'tr60',
      k: ['tr 60', 'tr60', 'tr 60/210', '60/210', 'visoki trapez', 'najveci raspon', 'najveći raspon', 'trapezni lim 60'],
      q: 'TR 60/210',
      a: 'Najviši profil u programu: rebro <strong>60 mm</strong>, korak 210 mm, pokrivna širina <strong>840 mm</strong> (ukupna 937 mm) iz trake 1250 mm, debljine 0,5–1,0 mm, od pocinkovanog i pocinkovanog plastificiranog lima. Može i sa antikondenz filcom. Tabela dozvoljenog opterećenja (2, 3 i 4 oslonca) je na strani proizvoda.',
      acts: [{ label: 'Krovni i fasadni sistemi', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'pokrivne-sirine',
      k: ['pokrivna sirina', 'pokrivna širina', 'korisna sirina', 'korisna širina', 'ulazna sirina', 'ulazna širina', 'sirina table', 'širina table', 'koliko pokriva tabla', 'razvijena sirina', 'rš'],
      q: 'Pokrivne širine trapeznih profila',
      a: 'Sa fabričkih crteža: <strong>TR 10/162,5 — 975 mm</strong> (ulazna 1025), <strong>TR 20/185 — 1110 mm</strong> (ulazna 1165), <strong>TR 35/270 — 1080 mm</strong> (ukupna 1109,7), <strong>TR 40/230 — 920 mm</strong>, <strong>TR 60/210 — 840 mm</strong> (ukupna 937); ulazna traka za TR 35–60 je 1250 mm. Imitacija crepa: red od 5 crepova 1190 mm, pokrivna 1150 mm. Što je pokrivna širina manja, nosivost table je veća.',
      acts: [{ label: 'Tabela profila', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'montaza-tr',
      k: ['razmak roznjaca', 'razmak rožnjača', 'roznjaca', 'rožnjača', 'srafljenje', 'šrafljenje', 'vijci za lim', 'samobuseci', 'samobušeći', 'samourezujuci', 'kalota', 'jahac', 'jahač', 'distancer', 'kako se montira tr lim', 'preklop tabli', 'prepust u oluk', 'pricvrscivanje', 'pričvršćivanje'],
      q: 'Pričvršćivanje TR lima',
      a: 'Preporuka sa naših uputstava: razmak rožnjača <strong>0,6–1 m</strong> (TR 35), a način šrafljenja određuje tehničko lice. U drvenu konstrukciju idu samobušeći vijci 6,3×70–6×90 mm, u metalnu samourezujući 6,3×50–6,3×70 mm, uvek sa neoprenskom i metalnom podloškom. Savet je pričvršćivanje <strong>u gornjoj zoni</strong> (u rebro) sa PVC kalotom distancerom i limenim kalota jahačem — vijak u donjoj zoni vremenom proširi rupu. Lim se prepušta u oluk 5–8 cm; zadnje rebro table ide gore.',
      acts: [{ label: 'Uputstvo za montažu', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'statika-tr',
      k: ['nosivost', 'staticka nosivost', 'statička nosivost', 'dozvoljeno opterecenje', 'dozvoljeno opterećenje', 'statika', 'kolika debljina lima za krov', 'koju debljinu lima', 'kn/m2', 'kg/m2 nosivost', 'moment inercije'],
      q: 'Nosivost trapeznog lima',
      a: 'Za TR 40/230 i TR 60/210 imamo tabele dozvoljenog opterećenja po razmaku oslonaca (1–4 m) i debljini lima 0,5–1,0 mm. Primer: TR 40/230, 0,7 mm, jednopoljni nosač na 2 m — 166 kg/m²; TR 60/210, 0,7 mm, 2 oslonca na 2 m — 3,84 kN/m² (ugib L/200). Statičke karakteristike TR 40: 0,5 mm — 5,33 kg/m², I 11,78 cm⁴/m; 1,0 mm — 10,74 kg/m², I 23,38 cm⁴/m.',
      acts: [{ label: 'Tabele statike', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'crep-detalji',
      k: ['boje crepa', 'boje imitacije crepa', 'imitacije crepa', 'imitacija crepa boje', 'novi model crepa', 'modul crepa', 'duzina crepa', 'dužina crepa', 'tezina crepa', 'težina crepa', 'granulirana', 'hrapava boja', 'nagib za crep', 'ral tdm', 'kg/m2 crep'],
      q: 'Imitacija crepa — podaci',
      a: 'Novi model (od jula 2020.): 1 red od 5 crepova ili dužina po narudžbini; dužina crepa standardno <strong>350 mm</strong> (preporuka 350–450). Širina reda 1190 mm, pokrivna 1150 mm, lim 0,5 mm (pocinkovan 140 g/m², boja 25 µm lice / 8 µm naličje, može i 25/25). Boje: plava 5010, zelena 6028, bordo 3009, braon TDM, crna 9005, prljavo bela 9002, metaliza 9006, miš siva 7016; granulirane: crna, bordo, braon. Težina ispod 5 kg/m² (klasičan crep 30–50 kg/m²), najmanji nagib 14°.',
      acts: [{ label: 'Imitacija crepa', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'parapet',
      k: ['parapet', 'parapetni lim', 'parapeti', 'pr 83/34', 'pr 38/15', 'pr 71/10', 'lim za parapet', 'fasadni profil'],
      q: 'Parapetni limovi',
      a: 'Tri profila: <strong>PR 83/34</strong> (pokrivno 910 mm iz 1000, 1160 mm iz 1250), <strong>PR 38/15</strong> (967 / 1213 mm) i <strong>PR 71/10</strong> (924 / 1209 mm). Lim 0,4–0,8 mm — bojeni, pocinkovani, HVL; profil 71/10 i od 0,5–2 mm (preporučeno 0,8–2 mm). Radimo po narudžbini, prema dimenzijama tabli na lageru.',
      acts: [{ label: 'Krovni i fasadni sistemi', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'lamperija-detalji',
      k: ['duzina lamperije', 'dužina lamperije', 'aluminijumska lamperija', 'alu lamperija', 'lamperija 2,5', 'embosirana', 'inox lamperija', 'prohromska lamperija', 'bakarna lamperija', 'lamperija za kupatilo', 'lamperija za strehu', 'alu lajsne'],
      q: 'Lamperija — materijali i mere',
      a: 'Lamperiju radimo od bojenog aluminijuma, pocinkovano bojenog, prohromskog i bakarnog lima; standardna dužina je <strong>2,5 m</strong>, na veću količinu i druge dužine. Spoj je skriven i vodonepropusan. Inox lamperija (ogledalo, mat, brušena) ispunjava norme za prostorije za pripremu hrane. <strong>Aluminijumska lamperija</strong>: plastificirana braon ili bela, glatka ili embosirana, table 2,5 m sa čistom pokrivnom površinom 0,65 m²; ne korodira i ne traži održavanje — kupatila, plafoni, hodnici, strehe; završne lajsne i aluminijumski ekseri.',
      acts: [{ label: 'Krovni i fasadni sistemi', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'paneli-detalji',
      k: ['sendvic panel', 'sendvič panel', 'kamena vuna', 'mineralna vuna', 'pur panel', 'pir panel', 'negorivost', 'vatrootpornost', 'a1', 'klasa pozara', 'klasa požara', 'zidni panel', 'krovni panel', 'boje panela'],
      q: 'Sendvič paneli',
      a: 'Panel su dva čelična pocinkovana bojena lima sa termoizolacionom ispunom — samonoseća ploča, zidna ili krovna. Nudimo panele sa ispunom od <strong>kamene vune</strong>, jedine sa negorivošću <strong>A1</strong> (euroklasa A1/A2, s1, d0; otpornost na požar 30–240 min; trajno iznad 300 °C) — što je često uslov za tehničku saglasnost magacina i proizvodnih objekata. Boje: RAL 3000, 3009, 5010, 6028, 7016, 8019, 9002, 9006.',
      acts: [{ label: 'Paneli', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'pokrivanje-krova',
      k: ['kako pokriti krov', 'nacin pokrivanja', 'način pokrivanja', 'slojevi krova', 'izolacija krova', 'paropropusna folija', 'binder', 'z profil', 'maketa', 'izlozbeni prostor', 'izložbeni prostor', 'koji lim za krov'],
      q: 'Kako se pokriva krovna konstrukcija',
      a: 'Četiri načina: TR lim ili imitacija crepa; isto sa antikondenz filcom; sendvič paneli; ručno postavljana izolacija. Slojevi krova sa kamenom vunom: binder → Z rožnjača → TR 40/230 kao donji nosač → paropropusna folija → kamena vuna (poželjno 200 mm) → vodonepropusna paropropusna folija → TR 20/35/40 → oluk → snegobran → veter lajsna. Maketa takvog krova stoji u našem izložbenom prostoru u Kneza Paskača 18. Za lim se najčešće bira bojeni pocinkovani: dobro zaštićen i znatno povoljniji od bojenog aluminijuma.',
      acts: [{ label: 'Vodič na strani proizvoda', href: 'proizvodi.html?grupa=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'oluci-formati',
      k: ['rs 333', 'rš 333', 'rs 250', 'rs 270', 'rs 400', 'format oluka', 'formati oluka', 'precnik vertikale', 'prečnik vertikale', 'fi 100', 'ø100', 'ø 100', 'fi 80', 'fi 120', 'fi 150', 'duzina oluka', 'dužina oluka', 'koliko dugacak oluk', 'cetvrtasta vertikala dimenzije', '12x12', '10x10', 'boje oluka', 'oluci na lageru'],
      q: 'Formati oluka i vertikala',
      a: 'Poluokrugli oluci <strong>RŠ 250 i 270</strong> (komadi do 4 m), <strong>RŠ 333</strong> (pocinkovani neograničeno, ostali do 6,5 m) i <strong>RŠ 400</strong> (do 6 m); četvrtasti do 8,2 m. Okrugle vertikale Ø80, Ø120 i Ø150 do 6 m, <strong>Ø100 neograničeno</strong>; četvrtaste 10×10, 12×12, 12×10 i 11×8 cm po 6 m. Materijali: pocinkovani, bojeni, bakar, aluminijum, inox. Na lageru: pocinkovani i bojeni (braon, bordo, metaliza, prljavo belo, crno, zeleno) u dužinama 4, 5 i 6 m. Boje pribora: RAL 8019, 3009, 9002, 9005, 9006.',
      acts: [{ label: 'Tabela formata', href: 'proizvodi.html?grupa=oluci#prog', icon: 'arrow' }]
    },
    {
      id: 'galanterija-detalji',
      k: ['drzac za oluk', 'držač za oluk', 'kuka za oluk', 'dance', 'danca', 'vodokotlic', 'vodokotlić', 'kotlic', 'vinkl', 'zastitnik', 'zaštitnik', 'kolena', 'koleno', 'obujmica', 'selna', 'šelna', 'afteri', 'zadrzac vode', 'maskice', 'maske za eksere', 'snegobran za crep', 'tegola', 'biber', 'tondach', 'kikinda', 'becej'],
      q: 'Limarska galanterija za oluke',
      a: 'Za sve formate i boje oluka: <strong>držači</strong> (F 250 4×25×430 … F 400 5×30×730), <strong>danca</strong> (i brzomontirajuća za F 333), <strong>vodokotlići</strong> (F 250/80 … F 400/150), <strong>vinklovi</strong> spoljni i unutrašnji, <strong>zaštitnici</strong>, <strong>kolena</strong> Ø80–Ø150, <strong>obujmice</strong> okrugle (na klin i na tipl 100/150/200) i četvrtaste (F 250–625), <strong>snegobrani</strong> za tegolu, biber, kikindu, bečej i tondach, <strong>afteri</strong> i <strong>maskice za eksere</strong>. Bakar i inox po narudžbini.',
      acts: [{ label: 'Tabele galanterije', href: 'proizvodi.html?grupa=oluci#prog', icon: 'arrow' }]
    },
    {
      id: 'opsivke-detalji',
      k: ['veter lajsna duzina', 'veter lajsna', 'vetar lajsna', 'uvala duzina', 'iksna duzina', 'okapnica duzina', 'opsivka dimnjaka', 'opšivka dimnjaka', 'opsivka za dimnjak', '8,2 m', 'limarski profili na lageru', 'format 333', 'format 500'],
      q: 'Veter lajsne, uvale, iksne, okapnice',
      a: 'Sve radimo od lima do <strong>0,8 mm</strong> (inox do 0,6 mm) u dužinama do <strong>8,2 m</strong>. Na lageru su pocinkovane veter lajsne (formati 333 i 500 mm), uvale (500 mm) i iksne (250 i 333 mm) u dužinama 4, 5 i 6 m; okapnice isključivo po narudžbini. Opšivke dimnjaka od lima 0,5 mm za sve dimenzije; pocinkovana opšivka 40×40 cm je uvek na lageru.',
      acts: [{ label: 'Limarski profili', href: 'proizvodi.html?grupa=oluci#prog', icon: 'arrow' }]
    },
    {
      id: 'pocinkovani-lager',
      k: ['debljine pocinkovanog', 'pocinkovani lim debljina', 'tezina lima', 'težina lima', 'kg/m2', 'dx51d', 'nanos cinka', '275 g', '140 g', 'format table', '1250x2500', '1000x2000', '1500x3000', 'slit', 'limarski formati', 'pocinkovani u koturu', 'pocinkovana tabla'],
      q: 'Pocinkovani lim — lager i kvalitet',
      a: 'Pocinkovani lim 0,4–2 mm svih formata, toplocinkovan <strong>140, 200 i 275 g/m²</strong>, kvalitet DX51D/DX53D/DX54D (EN 10142, EN 10327). Kotur 0,45–4 mm u širinama 1000/1250 (od 0,8 mm i 1500), table 0,4–3 mm u 1000×2000, 1250×2500 i 1500×3000; slit 0,5 mm u širinama 200, 250, 270, 312, 333, 375, 417, 500 i 625 mm. Težina: 0,5 mm — 4,0 kg/m², 1 mm — 8,0 kg/m².',
      acts: [{ label: 'Tabele limova', href: 'proizvodi.html?grupa=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'bojeni-lager',
      k: ['boje lima', 'koje boje imate', 'bojeni lim boje', 'plastificirani lim boje', 'ral 9002', 'ral 9016', 'ral 7016', 'ral 6028', 'ral 3009', 'ral 5010', 'ral 9005', 'imitacija drveta', 'reljefni lim', 'obostrano bojen', 'debljina bojenog lima', '0,45', 'slojevi lima', 'poliester 25', 'prajmer'],
      q: 'Bojeni (plastificirani) lim — boje na lageru',
      a: 'Jednostrano bojeni kotur 0,50×1250 u bojama RAL 9002, 9016, 9006, 7016, TDM braon, 6028, 6002 (0,55), 6011, 3009, 5010, 5015, 9005, 3020, reljefni TDM i 9005 i imitacija drveta; 0,60×1250 u 9002, 9006, TDM i 3009. Obostrano bojeni 0,50×1000: 9002, 9006, TDM, 6028, 3009, 9005; slitovi 333/417/500 (i 271/396 obostrano). Debljine najčešće 0,45/0,5/0,55 mm. Slojevi: poliester 25 µm, prajmer 8 µm, neutralizacioni sloj 6 µm, cink, čelik 0,50 mm. Veće količine u bilo kojoj RAL boji po dogovoru sa proizvođačem.',
      acts: [{ label: 'Tabele limova', href: 'proizvodi.html?grupa=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'alu-bakar-lager',
      k: ['aluminijumski lim debljina', 'alu lim kotur', 'alu tabla', 'rebrasti aluminijum', 'bakarni lim debljina', 'bakar u koturu', 'bakar tabla', 'bakar slit', 'tezina bakra', 'težina bakra', 'polutvrdi'],
      q: 'Aluminijumski i bakarni lim — lager',
      a: '<strong>Aluminijum</strong> (polutvrdi): kotur 0,6–0,8 mm u širinama 1000–1250 (1,65–1,90 kg/m²), table 1–5 mm do 1500×3000, rebrasti 1,2/1,7 do 5/6 mm; bojeni alu kotur 0,6 i 0,7 mm u RAL 9010, 8019, 5010, 3009, 9002, 9006. <strong>Bakar</strong> (polutvrdi, za galanteriju): kotur 0,50 / 0,55 / 0,60 × 1000, slit 270/333/396/600, table 1000×2000 od 0,5 do 5 mm (4,5–45,45 kg/m²); i bakarna lamperija.',
      acts: [{ label: 'Tabele limova', href: 'proizvodi.html?grupa=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'crni-inox-lager',
      k: ['hvl debljina', 'tvl debljina', 'dc01', 's235jr', 'toplovaljani lim debljina', 'hladnovaljani lim debljina', 'rebrasti lim', 'suza', 'romb', 'inox 1.4301', '1.4016', '1.4401', 'kiselootporni', 'inox tabla', 'inox kotur', 'prohrom debljina'],
      q: 'Crni (HVL, TVL) i inox lim — lager',
      a: '<strong>HVL</strong> 0,4–2,5 mm (širine 1000/1250), kvalitet DC01; table 0,4–3 mm. <strong>TVL</strong> ravan 1,5–15 mm (1000/1250/1500), S235JR, table do 30 mm i 1500×6000; rebrasti suza i romb 2/3–5/6 mm × 1500×3000. <strong>Inox</strong>: kiselootporni i vodootporni, mat/ogledalo/brušeno, sa i bez folije — kotur 0,5 i 0,6 × 1000/1250, slit 0,5×333, table 0,8–4 mm; kvaliteti 1.4016, 1.4301, 1.4401.',
      acts: [{ label: 'Tabele limova', href: 'proizvodi.html?grupa=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'cevi-detalji',
      k: ['dimenzije cevi', 'kvadratne cevi dimenzije', 'pravougaone cevi dimenzije', 'colovne cevi', 'colovna cev', '3/8', 'okrugle cevi dimenzije', 'pocinkovane cevi', 'zp profil', 'zp profili', 'precizne cevi', 'ovalne cevi', 'masa cevi', 'tezina cevi', 'unis', 'fahop', 'hidroispitane', 'debljina zida'],
      q: 'Cevi — dimenzije i mase',
      a: 'Kvadratne <strong>13×13 – 150×150</strong>, pravougaone <strong>10×20 – 100×200</strong>, dužine 6 m, zid 1–8 mm; crne okrugle colovne 3/8"–3" (konstrukcione zid 1,5–2,5 mm ili hidroispitane sa atestom, pritisak 50 bar); pocinkovane 1/2"–2" (zid od 2,5 mm); ZP profili 35×35 i 50×30 u 11 oblika preseka; precizne okrugle Ø16–114,3 i ovalne (npr. 36×18×1,5 — 1,048 kg/m), paletirane po 6 m. Primer masa: 40×40×2 — 2,386 kg/m, 60×40×2 — 3,014 kg/m. Proizvođači: Unis Derventa, Fahop Aleksinac.',
      acts: [{ label: 'Čelične cevi i profili', href: 'proizvodi.html?grupa=cevi#prog', icon: 'arrow' }]
    },
    {
      id: 'profili-detalji',
      k: ['l profil dimenzije', 'ugaonik dimenzije', 'u profil', 'unp', 'i profil', 'inp', 'nosaci', 'nosači', 'flah dimenzije', 'vuceni flah', 'vučeni flah', 'firkant', 'kvadratni pun', 'hop', 'hladno oblikovani profili', 'svetlo vuceni', 'svetlo vučeni', 'okrugli pun', 'masa profila', 'kvalitet celika', 'kvalitet čelika', 'c0361'],
      q: 'Čelični profili — dimenzije',
      a: 'Ugaonici 20×20×3 do 200×200×24 (EN 10056-1), UNP 30×15 do 400, INP 80 do 600 — kvaliteti S235JR, S275, S355 (EN 10025). Flah od TVL na lageru sečen na 3000 mm (2×20 do 5×60), vučeni flah 4–8 × 20–50 mm po 6 m, grifovani flah 4–10 × 12–50 mm do 6 m. Firkant 6×6 do 20×20 (S235) po 6 m, preko 40×40 na tačnu meru. Hladno oblikovani profili na presi 200 t do 10 mm i 3100 mm (najmanji radijus 5–70 mm po debljini). Svetlo vučeni okrugli Ø5–Ø28. Profile prodajemo cele ili na pola, sečemo po specifikaciji.',
      acts: [{ label: 'Čelične cevi i profili', href: 'proizvodi.html?grupa=cevi#prog', icon: 'arrow' }]
    },
    {
      id: 'zice-detalji',
      k: ['grifovano pletivo', 'sulc mreza', 'šulc mreža', 'paljena zica', 'paljena žica', 'pocinkovana zica', 'pocinkovana žica', 'rabic', 'rabic pletivo', 'gazista dimenzije', 'gazišta dimenzije', 'kanalska resetka', 'kanalska rešetka', 'gromobranska traka', 'pocinkovana traka', 'zica za vezivanje'],
      q: 'Žice, pletiva, rešetke, trake',
      a: 'Grifovano pletivo (veće količine do 2000×6000 mm), šulc mreža 2 mm 1000×2000, paljena žica (žarena na 680–700 °C, koturi 30–150 kg), pocinkovana žica 2,0–3,1 mm (2 mm ≈ 40 m/kg), rabic pletivo u koturu 1000 mm × 25 m sa okcima 12×12, pocinkovane kanalske rešetke i gazišta 200×1000 do 1000×1000 mm (S235, toplo cinkovano ili farbano) i gromobranska traka 3×20, 4×25, 4×30, 4×40 mm — sve sečeno na meru.',
      acts: [{ label: 'Ogradni sistemi i građevinska bravarija', href: 'proizvodi.html?grupa=kovano#prog', icon: 'arrow' }]
    },
    {
      id: 'okov-detalji',
      k: ['brave', 'okovi', 'bane sekulic', 'bane sekulić', 'petiti', 'fimet', 'hope', 'klizna vrata', 'sarke', 'šarke', 'sarka', 'kvake', 'burgije', 'tiplovi', 'selne', 'šelne', 'hss', 'ploce za secenje', 'ploče za sečenje', 'brusne ploce', 'ginic', 'ginić', 'tocila', 'dijamantske ploce', 'piranha', 'pihrana'],
      q: 'Okov, šarke, burgije, ploče',
      a: 'Brave i okovi <strong>Bane Sekulić</strong> (Sombor) i italijanskih proizvođača PETITI, FIMET i HOPE; komplet za klizna vrata atestiran do 700 kg po klizaču; kvake. <strong>Šarke</strong> bez kuglice Ø10×50 do Ø18×90 i sa kuglicom Ø20×100 do Ø32×300, ukrasne za kovane ograde. Burgije HSS i za beton (DeWalt, Piranha), tiplovi i šelne; ploče za sečenje, brušenje i poliranje Ø115–Ø500, uključujući Ginić tocila.',
      acts: [{ label: 'Alati i oprema', href: 'proizvodi.html?grupa=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'srafovi-detalji',
      k: ['din 933', 'din 7504', 'din 7981', 'din 571', 'masinski vijak', 'mašinski vijak', 'vijak za lim', 'vijak za drvo', 'samourezujuci vijak', 'vijak sa burgijom', 'pop nitne', 'friulsider', 'koelner', 'lessman', 'sariv', 'gips karton vijak', 'kvalitet 8.8'],
      q: 'Šrafovska roba — vrste i standardi',
      a: 'Mašinski vijci pocinkovani, kvalitet 5.6 i 8.8 (DIN 933, 84, 963, 603 „torban“); vijci za lim (DIN 7971, 7981, 7982); samourezujući sa burgijom (DIN 7504 K/P/N); vijci za drvo — salonit DIN 571, hol šraf DIN 97, rajser DIN 7997; vijci za gips-karton. Proizvođači: FRIULSIDER, KOELNER, LESSMAN, pop nitne SARIV.',
      acts: [{ label: 'Alati i oprema', href: 'proizvodi.html?grupa=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'varstroj-detalji',
      k: ['varex', 'varmig', 'varin', 'vartig', 'varcut', 'tackasto zavarivanje', 'tačkasto zavarivanje', 'aparat za varenje', 'inverter', 'mig mag', 'tig', 'co2 aparat', 'elektrode', 'koji aparat za varenje'],
      q: 'Varstroj — program aparata',
      a: 'Varstroj (Slovenija): <strong>VAREX</strong> 152/160/162 (MMA, 40–155 A), <strong>VARMIG</strong> 1600–1800 (MIG/MAG, 25–170 A, žica 0,6–0,8), <strong>VARIN</strong> 1105–3000 (MMA inverter, do 320 A, elektrode do 6 mm; 1700 i 2000 CEL i TIG), <strong>VARTIG</strong> 1605/2005/3000 AC/DC (TIG i MMA, do 300 A), tačkaste VST-3 i VST-25 PE/N, CNC rezač VARCUT. Podaci su iz kataloga sa dosadašnjeg sajta; aktuelne modele i cene daje prodaja, tehnika na varstroj.si.',
      acts: [{ label: 'Varstroj program', href: 'proizvodi.html?grupa=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'merdevine',
      w: 1.3,
      k: ['merdevine', 'koje merdevine', 'lestve', 'alpos', 'expert', 'ratio', 'aluminijumske merdevine', 'profesionalne merdevine', 'visina merdevina'],
      q: 'Merdevine Alpos',
      a: 'Aluminijumske merdevine <strong>Alpos</strong> (Slovenija): profesionalne <strong>EXPERT</strong> 38-10 do 38-15 sa sertifikatom (razvučene 6,4–10,2 m, radna visina do 10,9 m, 20–39 kg) i poluprofesionalne <strong>RATIO</strong> 44-10 (razvučene 5,9 m, 15,4 kg). Uz njih pomoćni pribor Mimont.',
      acts: [{ label: 'Alati i oprema', href: 'proizvodi.html?grupa=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'alu-profili',
      k: ['aluminijumski profili', 'alu profili', 'legura 6060', '6063', 'ekstrudirani profili', 'profili za bravariju', 'alu kutija', 'alu cev'],
      q: 'Aluminijumski profili',
      a: 'Trgovački aluminijumski profili za građevinsku bravariju — ekstrudirani od legura 6060 i 6063 na bazi primarnog aluminijuma, u oblicima L, T, kutije i cevi. Uglavnom se prodaju sirovi, u boji aluminijuma.',
      acts: [{ label: 'Alati i oprema', href: 'proizvodi.html?grupa=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'masine-detalji',
      k: ['mhs 3100', 'sliter', 'premotavanje', 'odmotac', 'namotač', 'koturic', 'koturić', 'presa 200 t', 'nc presa', 'rundovanje', 'rund masina', 'lucno savijanje', 'lučno savijanje', 'savijanje cevi', 'savijanje u luk', 'peglanje flahova', 'ispravljanje flahova', 'isecanje uglova', 'iron worker', 'trakasta testera', 'masinski park', 'mašinski park', 'koje masine imate'],
      q: 'Mašinski park — kapaciteti',
      a: 'Hidraulične makaze <strong>MHS 3100/13</strong> (13 mm / inox 9 mm, rez 3100 mm) i elektromotorne do 1,5 mm; sliter do 1 mm, 7 traka, kotur 6 t i 1260 mm; odmotač–namotač do 1,2 mm; <strong>NC presa 200 t</strong> (10 mm, inox 7 mm, 3100 mm); CNC apipong 8,2 m (0,8 mm) i 8 m za ravan lim do 4 mm; rund mašine do 0,8 mm (Ø80–800) i do 4 mm (min Ø190); lučno savijanje cevi 1/2"–2", kvadratnih do 50×50 i pravougaonih do 40×60; peglanje flahova do 10 mm; isecanje uglova do 4 mm (30–140°); Iron Worker; trakasta testera (ugao do 60°, u snopu); profilirke za TR lim, oluk, vertikalu, parapet, lamperiju i kanale; mašina za grifovanje; linija „dupli falc“.',
      acts: [{ label: 'Datasheet mašina', href: 'usluge.html#masine', icon: 'arrow' }]
    },
    {
      id: 'falc',
      k: ['falc', 'dupli falc', 'sufalc', 'šufalc', 'falcovanje', 'falcovani krov', 'stojeci falc', 'stojeći falc', 'afteri za falc'],
      q: 'Dupli falc (šufalc)',
      a: 'Imamo liniju za pokrivanje po sistemu „dupli falc“ (šufalc) — table od pocinkovanog, bakarnog i plastificiranog lima za montažere, kao i gaćaste držače (aftere) od lima po izboru. Montažu na objektu ne radimo od 2006.',
      acts: [{ label: 'Profilisanje', href: 'usluge.html#profilisanje', icon: 'arrow' }]
    },
    {
      id: 'firma-podaci',
      k: ['maticni broj', 'matični broj', 'sifra delatnosti', 'šifra delatnosti', 'pun naziv', 'naziv firme', 'pdv', 'u sistemu pdv', 'tekuci racun', 'tekući račun', 'ziro racun', 'žiro račun', 'banca intesa', 'direktor', 'vlasnik', 'trivanovic', 'trivanović', 'ko je vlasnik'],
      q: 'Podaci o firmi',
      a: 'Pun naziv: „TRICOM“ preduzeće za proizvodnju i promet roba i usluga, export-import d.o.o. (skraćeno TRICOM d.o.o. Beograd — Batajnica). PIB <strong>100093247</strong>, matični broj <strong>06660231</strong>, šifra delatnosti 2599, u sistemu PDV od 01.01.2005. Sedište: Kralja Vladislava 82, Batajnica. Direktor: Dragan Trivanović. Tekući račun: Banca Intesa 160-216272-93.',
      acts: [{ label: 'Podaci o firmi', href: 'kontakt.html#upit', icon: 'arrow' }]
    },
    {
      id: 'mediji',
      k: ['mediji', 'iz medija', 'novine', 'clanak', 'članak', 'preduzetnik godine', 'blic preduzetnik', 'n1', 'svet novca', 'nagrada', 'najpozeljniji poslodavci', 'ey', 'koliko zaposlenih', 'broj radnika', 'zaposleni'],
      q: 'TRICOM u medijima',
      a: 'Dragan Trivanović je bio među učesnicima konkursa <strong>EY Preduzetnik godine 2014</strong>, a firma među kandidatima za nagradu <strong>Blic preduzetnik 2013</strong> (članak „Najpoželjniji poslodavci“: proizvodnja na dve lokacije, tada 15 zaposlenih). N1 je u emisiji „Svet novca“ emitovao reportažu o preduzetnicima i birokratiji. Isečci su na strani O nama.',
      acts: [{ label: 'Iz medija', href: 'o-nama.html#mediji', icon: 'arrow' }]
    },
    {
      id: 'partneri',
      k: ['partneri', 'poslovni partneri', 'nasi partneri', 'naši partneri', 'sa kim saradjujete', 'sa kim sarađujete', 'klijenti', 'lista partnera', 'ko kupuje kod vas', 'unicef', 'klub prijatelja'],
      q: 'Poslovni partneri',
      a: 'Pored nekoliko hiljada fizičkih lica, sa TRICOM-om sarađuje preko 460 firmi i ustanova — od limarskih i bravarskih radionica do industrije (Gorenje Tiki, Energoprojekt Oprema, Galenika Magmasil, Minel General Electric, Nexe Beton, Pioneer, Volvo, Žito Dunav Agro, KBC Zemun, Istorijski muzej Srbije…). Cela lista je na strani referenci. Kompanija je član Kluba prijatelja UNICEF-a.',
      acts: [{ label: 'Lista partnera', href: 'reference.html#partneri', icon: 'arrow' }]
    },
    {
      id: 'pocetak-firme',
      k: ['1992', '1993', 'kada je osnovano preduzece', 'preregistrovana', 'ko je osnovao', 'porodicna firma', 'porodična firma', 'profesor', '1995', 'nasledio', 'istorija firme'],
      q: 'Od radionice do preduzeća',
      a: 'Limarsko-bravarska radionica Trivanović radi od <strong>1966</strong>, a <strong>1992</strong>. se preregistruje u preduzeće i širi delatnost na trgovinu metalom. Dragan Trivanović je pre toga radio kao profesor u školi; 1995. napušta taj poziv i preuzima porodični posao. Od 2006. firma ne radi montažu, a 2009. gradi halu u Ugrinovcima.',
      acts: [{ label: 'Istorijat', href: 'o-nama.html#istorijat', icon: 'arrow' }]
    },
    {
      id: 'lager',
      k: ['lager', 'na lageru', 'ima li na stanju', 'stanje', 'dostupnost', 'da li imate', 'raspolozivost',
          'raspoloživost', 'zaliha', 'zalihe'],
      q: 'Stanje lagera',
      a: 'Stanje lagera se menja svakodnevno i nemam pristup magacinskoj evidenciji, pa ne bih da vas pošaljem po robu koje trenutno nema.<br><br>Raspoloživost se najbrže proverava telefonom — prodaja vam odmah kaže šta ima i u kojim dimenzijama.',
      acts: [
        { label: 'Pozovite prodaju', href: 'tel:+381638503000', icon: 'phone' },
        { label: 'Ili pišite', href: 'mailto:office@tricom.rs?subject=Provera%20lagera', icon: 'mail' }
      ]
    }
  ]
};
