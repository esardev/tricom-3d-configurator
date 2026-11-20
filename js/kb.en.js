/* ==========================================================================
   TRICOM — kb.en.js
   English knowledge base for the site assistant (loaded on /en/ pages only,
   after kb.js). Same structure, ids, weights and facts as kb.js
   (window.TRICOM_KB); assistant.js scores English questions against this
   file first and falls back to the Serbian base for Serbian questions.

   Entry fields:
     id    — unique id (identical to kb.js)
     k     — English keywords and phrases (the matcher normalises and stems)
     w     — entry weight (default 1)
     q     — short answer title
     a     — answer HTML
     acts  — [{label, href, icon}] optional actions (English page names)
   ========================================================================== */

window.TRICOM_KB_EN = {

  /* ---------------------------------------------------------------- Company */
  company: {
    name: 'TRICOM d.o.o.',
    since: 1966,
    pib: '100093247',
    email: 'office@tricom.rs',
    email2: 'veleprodaja@tricom.rs',
    prodaja: {
      label: 'Production and sales',
      addr: 'Kneza Paskača 16–18, 11273 Batajnica, Belgrade',
      tel: ['+381 63 850 30 00', '+381 60 380 16 68', '+381 11 787 00 24', '+381 11 787 03 48', '+381 11 787 03 49']
    }
  },

  /* ------------------------------------------------------------ Suggestions */
  chips: [
    'What sheet thickness can you cut?',
    'Which trapezoidal sheets do you have?',
    'Where are you and when are you open?',
    'How do I order and pay?',
    'Do you do installation?',
    'I need a quote for galvanised sheet'
  ],

  /* -------------------------------------------------------- Greetings etc. */
  greetings: {
    k: ['hello', 'hi', 'hey', 'hiya', 'howdy', 'greetings', 'good morning', 'good afternoon', 'good evening', 'good day', 'hello there', 'hi there'],
    a: 'Hello. I am the assistant on the <strong>TRICOM</strong> website — I can help with machine capabilities, the product range, ordering terms and contact details.<br><br>Ask away, or choose one of the suggestions below.'
  },

  thanks: {
    k: ['thanks', 'thank you', 'thank you very much', 'many thanks', 'thanks a lot', 'thx', 'ty', 'cheers', 'great', 'perfect', 'excellent', 'super', 'brilliant'],
    a: 'You are welcome. If you need a specific quote, the fastest way is to call sales or email your specification — you will get a reply as soon as possible.'
  },

  bye: {
    k: ['bye', 'goodbye', 'good bye', 'bye bye', 'see you', 'see you later', 'ciao', 'have a nice day', 'thanks bye'],
    a: 'Goodbye. TRICOM is available on <a href="tel:+381638503000">+381 63 850 30 00</a> — opening hours: {hours}.'
  },

  /* ---------------------------------------------------------------- Fallback */
  fallback: {
    a: 'I cannot answer that with certainty from what I have in my database, and I do not want to guess when it comes to technical data.<br><br>I can help with: <strong>machine capabilities</strong> (plasma, guillotine shears, presses, roll formers), <strong>the product range</strong> (sheet, tubes, sections, gutters, tools), <strong>ordering and payment terms</strong>, <strong>references</strong> and <strong>contact details</strong>.<br><br>For anything else, it is best to contact sales directly:',
    acts: [
      { label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' },
      { label: 'Send an inquiry', href: 'mailto:office@tricom.rs', icon: 'mail' },
      { label: 'Contact page', href: 'contact.html', icon: 'arrow' }
    ]
  },

  /* ================================================================ Entries */
  entries: [

    /* ---- Cutting / plasma ---- */
    {
      id: 'plazma',
      w: 1.2,
      k: ['plasma', 'cnc', 'cnc plasma', 'plasma cutting', 'plasma cut', 'plasma cutter', 'cut with plasma', 'plasma table',
          'plasma thickness', 'how thick plasma', 'plasma table size', 'work table', 'cutting table', '30mm', '30 mm',
          'do you have plasma', 'cnc cutting', 'laser', 'laser cutting', 'profile cutting',
          '25mm', '25 mm', '20mm', '20 mm', '15mm', '15 mm', '12mm', '12 mm', '10mm', '10 mm',
          'cut steel', 'steel cutting', 'steel', 'contour', 'contours', 'shapes', 'holes in sheet',
          'complex shape', 'custom shape', 'to drawing', 'from drawing', 'cut from photo'],
      q: 'CNC plasma cutting',
      a: 'On our CNC plasma we cut sheet <strong>up to 30 mm</strong>, and with oxy-fuel cutting <strong>up to 150 mm</strong>. The work table is <strong>2.5 × 8 m</strong>.<br><br>The machine is fully computer-controlled, so the possibility of error is kept to a minimum. We cut:<ul><li>non-ferrous metals — copper, aluminium</li><li>various types of steel</li><li>stainless steel sheet</li></ul>We work from your DXF/DWG file or sketch. With some correction, we can also adapt almost any photograph for plasma cutting — within the limits of the machine.',
      acts: [{ label: 'More about plasma cutting', href: 'plasma-cutting.html', icon: 'arrow' }]
    },
    {
      id: 'gasno',
      k: ['oxy-fuel', 'oxy fuel', 'oxyfuel', 'oxy-fuel cutting', 'flame cutting', 'gas cutting', 'oxy acetylene', 'oxy-acetylene',
          'torch cutting', 'autogenous cutting', '150mm', '150 mm', 'thick plate', 'thick plates', 'heavy plate', 'heavy plates',
          'thickest plate', 'thickest', 'how thick can you cut', 'maximum plate thickness', 'max plate thickness',
          '100mm', '100 mm', '50mm', '50 mm', '40mm', '40 mm', 'base plate', 'foundation plate'],
      q: 'Oxy-fuel cutting',
      a: 'Oxy-fuel cutting takes us <strong>up to 150 mm</strong> thickness. It is used for thick plates and rough blanks where plasma is not enough — bearing plates, foundation plates, massive parts.<br><br>The work table is shared with the plasma: <strong>2.5 × 8 m</strong>.',
      acts: [{ label: 'More about cutting', href: 'plasma-cutting.html', icon: 'arrow' }]
    },
    {
      id: 'makaze',
      w: 1.1,
      k: ['shear', 'shears', 'guillotine', 'guillotine shear', 'guillotine shears', 'shearing', 'sheet cutting', 'cutting sheet',
          'cut sheet', 'cut sheet metal', 'shear cutting', '13mm', '13 mm', 'hydraulic shear', 'hydraulic shears',
          'hydraulic guillotine', 'what thickness', 'which thickness', 'sheet thickness', 'thickness can you cut',
          'how thick a sheet'],
      q: 'Sheet cutting on guillotine shears',
      a: 'With electric and hydraulic guillotine shears we cut:<ul><li>sheet <strong>up to 13 mm</strong> thick</li><li>stainless steel sheet <strong>up to 9 mm</strong></li></ul>Thicker material goes to the plasma (up to 30 mm) or oxy-fuel cutting (up to 150 mm).',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'slitovanje',
      k: ['slitting', 'slit', 'slit coil', 'coil slitting', 'slitting width', 'longitudinal cutting', 'recoiling', 'rewinding',
          'recoil', 'coil', 'strip', 'strips', 'cut coil into strips', '1260', '1,260', 'coil width', 'width of coil'],
      q: 'Slitting and recoiling',
      a: 'We slit and recoil sheet coil up to <strong>1,260 mm wide</strong>.<br><br>From the coil you get strips of the width you need, ready for further roll forming or for sale. Recoiling is also used to repack coils into smaller weights.',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'savijanje',
      k: ['bending', 'bend', 'sheet bending', 'bend sheet', 'press brake', 'press brakes', 'brake press', 'folding', 'fold',
          'press', 'nc press', 'forming', 'sheet forming', 'shaping', 'punching', 'punch holes', 'hole punching',
          'corner notching', 'notching', 'stamping', '8.2 m', '8.2m', 'bending length', 'longest bend', 'how long can you bend'],
      q: 'Bending and forming sheet',
      a: 'We bend and form sheet on:<ul><li>an <strong>NC press brake, 3 m long</strong></li><li>a <strong>press brake, 8.2 m long</strong> — for long flashings and profiles</li></ul>We also do punching, corner notching, straightening and flattening of flat bars, and arc bending of tubes and flat bars.',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'flahovi',
      k: ['straightening', 'flattening', 'flat bar straightening', 'flat bar flattening', 'straighten flat bar', 'flat bar', 'flat bars',
          'levelling', 'bent flat bar', 'arc bending', 'tube bending', 'pipe bending', 'bending tubes', 'bend tube',
          'rolling', 'curved', 'curving', 'arch', 'arches', 'radius bending', 'circular bending'],
      q: 'Flat bar straightening and arc bending',
      a: 'Two operations on flat and tubular sections:<ul>'
       + '<li><strong>Straightening and flattening of flat bars</strong> — levelling flat sections before further processing or installation.</li>'
       + '<li><strong>Arc bending of tubes and flat bars</strong> — circular and arc forming for curved elements, arches and railings.</li>'
       + '</ul>Both are done in our plant, alongside other operations on sections (cutting to length, embossing).',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'testera',
      k: ['saw', 'band saw', 'bandsaw', 'sawing', 'cutting sections', 'cut sections', 'cutting tubes', 'cut tubes', 'cut pipe',
          'cutting pipes', 'cut to length', 'cutting to length', 'cutting profiles', 'cut beams', 'shortening'],
      q: 'Cutting steel sections',
      a: 'On band saws we cut steel sections to length — tubes, square bars, flat bars, angles, channels and I-beams.<br><br>We also do welding and preparation of sections, as well as embossing of bar sections.',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'grifovanje',
      k: ['embossing', 'embossed', 'emboss', 'embossed flat bar', 'embossed tube', 'embossed tubes', 'wrought look',
          'forged look', 'hammered look', 'textured bar', 'decorative bar', 'decorative pattern'],
      q: 'Embossing of bar sections',
      a: 'Embossing is a mechanical process that gives a section a characteristic ornamental (wrought-iron look) surface. We emboss:<ul><li>flat bars</li><li>square and rectangular tubes</li><li>solid square bars</li></ul>Embossed sections are mostly used for wrought-iron fences, gates and railings.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },

    /* ---- Trapezoidal sheet ---- */
    {
      id: 'trapezni',
      w: 1.2,
      k: ['trapezoidal', 'trapezoidal sheet', 'trapezoidal profiled sheet', 'trapezoidal profile', 'trapezoidal profiles',
          'trapezoid', 'trapezium', 'tr sheet', 'tr profile', 'profiled sheet', 'corrugated sheet', 'corrugated',
          'roofing sheet', 'roof sheet', 'roof sheeting', 'metal roofing', 'tr 40', 'tr40', 'tr 35', 'tr35', 'tr 20', 'tr20',
          'tr 10', 'tr10', 'ceiling sheet', 'wall cladding sheet', 'cladding sheet', 'types of trapezoidal', 'which profiles'],
      q: 'Trapezoidal profiled sheet',
      a: 'We manufacture trapezoidal profiled roofing sheet in these profiles:<ul><li><span class="mono">TR 10/162.5</span></li><li><span class="mono">TR 20/185</span></li><li><span class="mono">TR 35/270</span></li><li><span class="mono">TR 40/230</span></li><li><span class="mono">TR 40/230</span> — reinforced in the upper zone</li></ul>We also make <strong>tile-effect roofing sheet</strong>, <strong>parapet lining sheet</strong> and <strong>metal cladding panels</strong>. Length is cut <strong>to the customer’s measurements</strong>, and the sheet can be galvanised, pre-painted (to the RAL chart) or aluminium.<br><br>For roofs there is also a version with <strong>anti-condensation felt</strong>.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'antikondenz',
      k: ['anti-condensation', 'anti condensation', 'anticondensation', 'anti-condensation felt', 'felt', 'fleece',
          'condensation', 'condensate', 'dripping', 'anti-drip', 'anti drip', 'moisture', 'sweating roof', 'damp under roof'],
      q: 'Sheet with anti-condensation felt',
      a: 'TR sheet and tile-effect sheet are available with <strong>anti-condensation felt</strong> — a layer on the underside of the sheet that absorbs condensation and stops dripping.<br><br>It is used on canopies, production halls, garages and anywhere there is no additional insulation under the roofing.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'crep',
      k: ['tile effect', 'tile-effect', 'tile effect sheet', 'tile-effect sheet', 'tile-effect roofing sheet', 'tile effect roofing',
          'roof tile', 'roof tiles', 'tile', 'tiles', 'tile sheet', 'tile profile', 'imitation tile', 'tile look',
          'metal tile', 'metal tiles', 'roof tile sheet', 'tile pattern'],
      q: 'Tile-effect roofing sheet',
      a: 'Tile-effect roofing sheet is a profiled sheet that looks like classic roof tiles but has the advantages of sheet metal — low weight, fast installation and less load capacity needed in the roof structure.<br><br>It is available galvanised or pre-painted (coloured), with or without anti-condensation felt.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },

    /* ---- Gutters ---- */
    {
      id: 'oluci',
      w: 1.15,
      k: ['gutter', 'gutters', 'guttering', 'downpipe', 'downpipes', 'down pipe', 'downspout', 'downspouts', 'rain pipe',
          'rain pipes', 'rainpipe', 'rainwater pipe', 'rainwater pipes', 'rainwater', 'rainwater system', 'rainwater goods', 'gutter system', 'half-round gutter',
          'half round gutter', 'box gutter', 'square gutter', 'seamless gutter', 'endless gutter', 'eavestrough'],
      q: 'Gutters and downpipes',
      a: 'We manufacture a complete gutter system:<ul><li><strong>half-round</strong> and <strong>box gutters</strong></li><li><strong>round</strong> and <strong>square downpipes</strong></li><li>accessories — gutter brackets, pipe clamps, downpipe clips, elbows, hopper heads, rainwater collectors</li></ul>Gutters are made on roll formers, <strong>in any length the customer needs</strong> — practically endless, with no joints along the length. Material: galvanised, pre-painted (coloured) or copper sheet.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'galanterija',
      k: ['roofing accessories', 'sheet-metal roofing accessories', 'sheet metal accessories', 'building sheet metal',
          'architectural sheet metal', 'flashing', 'flashings', 'valley', 'valley flashing', 'valleys', 'verge', 'verge flashing',
          'eaves flashing', 'drip flashing', 'eaves drip', 'snow guard', 'snow guards', 'snow stop', 'trim', 'trims',
          'chimney cap', 'ridge cap', 'ridge', 'penetration flashing'],
      q: 'Sheet-metal roofing accessories and flashings',
      a: 'We make all building sheet-metal work and sheet-metal roofing accessories: <strong>valley flashings, penetration flashings, verge flashings, eaves drip flashings, flashings, ridge caps, snow guards, chimney caps, hopper heads</strong> and more.<br><br>Everything to your sketch or to standard designs, from galvanised, pre-painted, copper, aluminium or stainless steel sheet. For non-standard details, just bring a sketch.',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'lamperija',
      k: ['cladding panels', 'cladding panel', 'metal cladding panels', 'metal cladding', 'aluminium cladding',
          'aluminum cladding', 'soffit', 'soffits', 'ceiling panels', 'ceiling lining', 'panelling', 'paneling', 'lining'],
      q: 'Metal cladding panels',
      a: 'We manufacture metal and <strong>aluminium cladding panels</strong> in various colours and materials, with matching aluminium trims.<br><br>They are used for eaves soffits, ceiling linings, façade details and canopies.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'ventilacija',
      k: ['ventilation', 'ventilation duct', 'ventilation ducts', 'air conditioning', 'air-conditioning', 'hvac', 'duct',
          'ducts', 'ductwork', 'air duct', 'spiral duct', 'spiro'],
      q: 'Ventilation and air-conditioning ducts',
      a: 'We make ventilation and air-conditioning ducts from galvanised sheet, to design or to measure — rectangular and round sections with fittings.',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'gazista',
      k: ['stair treads', 'stair tread', 'treads', 'grating', 'gratings', 'galvanised grating', 'galvanized grating',
          'walkway', 'walkways', 'platform', 'platforms', 'catwalk', 'landing', 'floor grating', 'grid flooring'],
      q: 'Galvanised stair treads',
      a: 'We make <strong>galvanised stair treads</strong> (grating platforms) for industrial platforms, stairs, crossings and service walkways.<br><br>The grating is also the motif of our logo — it is a product the company has made for decades.',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'paneli',
      k: ['panel', 'panels', 'sandwich panel', 'sandwich panels', 'insulated panel', 'insulated panels', 'thermal panel',
          'insulation', 'insulated roof', 'roof with insulation'],
      q: 'Panels and roofing with insulation',
      a: 'In our roof covering range we offer <strong>panels</strong> and <strong>roofing with manually installed insulation</strong> — where the insulation layer is installed on site, under the roofing sheet.<br><br>Which solution is better depends on the span, pitch and use of the building — sales can give you a recommendation based on the design.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },

    /* ---- Sheet ---- */
    {
      id: 'limovi',
      w: 1.1,
      k: ['sheet', 'sheets', 'sheet metal', 'metal sheet', 'steel sheet', 'which sheets', 'types of sheet', 'sheet range',
          'cold rolled', 'cold-rolled', 'hot rolled', 'hot-rolled', 'black sheet', 'black steel', 'mild steel sheet',
          'chequer plate', 'checker plate', 'chequered', 'hvl', 'tvl', 'coil', 'coils'],
      q: 'Sheet in our range',
      a: 'We sell sheet as <strong>sheets and coils</strong>:<ul><li><strong>galvanised</strong> sheet</li><li><strong>aluminium</strong> sheet</li><li><strong>copper</strong> sheet</li><li><strong>black sheet</strong> — cold-rolled and hot-rolled, flat and chequer hot-rolled plate</li><li><strong>painted / pre-painted</strong> sheet to the RAL chart</li><li><strong>stainless steel</strong> sheet</li></ul>We can cut, slit, recoil or roll form everything to your specification.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'pocinkovani',
      k: ['galvanised', 'galvanized', 'galvanised sheet', 'galvanized sheet', 'galvanised steel', 'galvanized steel',
          'galvanised metal', 'zinc coated', 'zinc-coated', 'zinc', 'gi sheet', 'galvanised sheets'],
      q: 'Galvanised sheet',
      a: 'We stock galvanised sheet in sheets and coils, in several thicknesses.<br><br>For a quote, please specify the <strong>thickness, sheet size and quantity</strong> — quantity determines the price. A discount is possible from 1 tonne upwards, and the larger the quantity, the larger the discount.',
      acts: [
        { label: 'Send your specification', href: 'mailto:office@tricom.rs?subject=Inquiry%20-%20galvanised%20sheet', icon: 'mail' },
        { label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }
      ]
    },
    {
      id: 'bakar',
      k: ['copper', 'copper sheet', 'copper gutter', 'copper gutters', 'copper roof', 'copper roofing'],
      q: 'Copper sheet',
      a: 'Copper sheet is the material TRICOM has the most experience with on demanding buildings. On the presidential residential complex in <strong>Karađorđevo</strong> we processed and installed <strong>32 tonnes of copper</strong>, and the whole job was completed in <strong>48 days</strong>.<br><br>We make copper roofing sheets, gutters, downpipes and all accessories.',
      acts: [{ label: 'References', href: 'references.html', icon: 'arrow' }]
    },
    {
      id: 'inox',
      k: ['stainless', 'stainless steel', 'inox', 'stainless sheet', 'stainless steel sheet', 'ss sheet', 'rustproof', 'rust-proof'],
      q: 'Stainless steel sheet',
      a: 'Stainless steel sheet is available in sheets.<br><br>Processing: our guillotine shears cut stainless steel <strong>up to 9 mm</strong>, and the CNC plasma <strong>up to 30 mm</strong>.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'aluminijum',
      k: ['aluminium', 'aluminum', 'alu', 'aluminium sheet', 'aluminum sheet', 'aluminium sections', 'aluminium profiles'],
      q: 'Aluminium and aluminium sections',
      a: 'Our aluminium range:<ul><li>aluminium sheet (sheets and coil)</li><li>aluminium sections and trims</li><li>aluminium trapezoidal sheet</li><li>aluminium cladding panels</li></ul>',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'ral',
      k: ['ral', 'colour', 'color', 'colours', 'colors', 'coloured', 'colored', 'in colour', 'painted sheet', 'pre-painted',
          'prepainted', 'pre painted', 'coil coated', 'coil-coated', 'powder coated', 'ral chart', 'which colours', 'what colours', 'paint'],
      q: 'Colours and pre-painted sheet',
      a: 'Painted (pre-painted) sheet is made to the <strong>RAL chart</strong>. The most requested shades in sheet-metal work are:<ul><li><span class="mono">RAL 9002</span> white · <span class="mono">RAL 9006</span> grey</li><li><span class="mono">RAL 9005</span> black · <span class="mono">RAL 7016</span> anthracite</li><li><span class="mono">RAL 8019</span> brown · <span class="mono">RAL 3009</span> red</li></ul>Check availability by colour and thickness with sales — stock changes.',
      acts: [{ label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }]
    },

    /* ---- Tubes and sections ---- */
    {
      id: 'cevi',
      w: 1.1,
      k: ['tube', 'tubes', 'tubing', 'pipe', 'pipes', 'welded tube', 'welded tubes', 'square tube', 'square tubes',
          'rectangular tube', 'rectangular tubes', 'round tube', 'round tubes', 'box section', 'box sections',
          'hollow section', 'hollow sections', 'rhs', 'shs', 'chs', 'zp section', 'zp sections', 'precision tube',
          'precision tubes', 'steel tube', 'steel pipe'],
      q: 'Tubes and ZP sections',
      a: 'We sell welded tubes and cold-formed ZP sections:<ul><li><strong>square</strong> and <strong>embossed square</strong> tubes</li><li><strong>rectangular</strong> and <strong>embossed rectangular</strong> tubes</li><li><strong>black round</strong> tubes (inch sizes)</li><li><strong>galvanised round</strong> tubes</li><li><strong>oval precision</strong> and <strong>round precision</strong> tubes</li></ul>We cut to length and arc-bend.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'profili',
      k: ['section', 'sections', 'steel sections', 'profile', 'profiles', 'steel profiles', 'flat bar', 'angle', 'angles',
          'angle iron', 'l section', 'channel', 'channels', 'U channel', 'I beam', 'I-beam', 'beam', 'beams', 'girder',
          'solid square bar', 'square bar', 'cold-formed', 'cold formed', 'structural steel'],
      q: 'Steel sections',
      a: 'Steel sections in our range:<ul><li><strong>flat bar</strong> and <strong>embossed flat bar</strong></li><li><strong>angle (L section)</strong></li><li><strong>channel (U section)</strong> and <strong>I-beam</strong></li><li><strong>solid square</strong> bar</li><li><strong>cold-formed</strong> sections</li></ul>For sizes and stock availability call sales — the range is wide and changes.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'kovani',
      k: ['wrought iron', 'wrought-iron', 'wrought iron elements', 'forged elements', 'ornamental', 'decorative elements',
          'fence', 'fences', 'fencing', 'gate', 'gates', 'railing', 'railings', 'balustrade', 'handrail', 'spikes',
          'fence spikes', 'rosettes', 'scrolls'],
      q: 'Sections and elements for wrought-iron fences',
      a: 'For wrought-iron fences and gates we offer:<ul><li>embossed sections (flat bar, tubes, square bar)</li><li><strong>wrought-iron elements</strong> — rosettes, leaves, feet, scrolls</li><li><strong>fence spikes</strong></li><li>locks, hardware and hinges</li></ul>',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'pletiva',
      k: ['wire mesh', 'mesh', 'wire', 'crimped mesh', 'crimped wire mesh', 'netting', 'wire netting', 'chain link',
          'chain-link', 'grille', 'grilles', 'fence mesh'],
      q: 'Wire, wire mesh and gratings',
      a: 'We offer wire, wire mesh (including <strong>crimped wire mesh</strong>), gratings and related products.<br><br>For mesh openings, wire gauges and availability, call sales.',
      acts: [{ label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }]
    },

    /* ---- Tools ---- */
    {
      id: 'alati',
      k: ['tools', 'tool', 'power tools', 'electric tools', 'hand tools', 'grinder', 'angle grinder', 'drill', 'drills',
          'bosch', 'makita', 'dewalt', 'stanley', 'black decker', 'black and decker', 'ladder', 'ladders', 'mimont', 'equipment'],
      q: 'Tools and equipment',
      a: 'We sell tools and equipment for sheet-metal workers and metal fabricators: <strong>Bosch, Makita, DeWalt, Stanley, Black &amp; Decker</strong>.<br><br>Also: cutting discs and diamond discs, drill bits, wall plugs, pipe clamps, screws and fasteners, locks, hardware, hinges, ladders and Mimont accessories.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },
    {
      id: 'varenje',
      k: ['welding', 'welder', 'weld', 'welding machine', 'welding equipment', 'varstroj', 'electrodes', 'welding wire',
          'welding helmet', 'welding mask', 'co2 welder', 'tig', 'mig', 'welding supplies'],
      q: 'Welding equipment and consumables',
      a: 'We offer <strong>Varstroj</strong> welding machines, accessories (helmets, cables, holders) and welding consumables.<br><br>For a specific model and specification, call sales.',
      acts: [{ label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }]
    },
    {
      id: 'srafovi',
      k: ['screws', 'screw', 'fasteners', 'fastener', 'bolts', 'bolt', 'nuts', 'self-tapping screws', 'self tapping',
          'wall plugs', 'dowels', 'anchors', 'clamps', 'pipe clamps', 'locks', 'lock', 'hardware', 'hinges', 'hinge'],
      q: 'Fasteners and metal-fabrication supplies',
      a: 'A complete range of fasteners and metal-fabrication supplies: bolts, self-tapping screws, wall plugs, pipe clamps, drill bits, locks, hardware, hinges, fence spikes, cutting and grinding discs.',
      acts: [{ label: 'Product range', href: 'products.html', icon: 'arrow' }]
    },

    /* ---- Business ---- */
    {
      id: 'narucivanje',
      w: 1.2,
      k: ['order', 'ordering', 'orders', 'how to order', 'how do I order', 'how can I order', 'place an order', 'placing an order',
          'make an order', 'work order', 'advance payment', 'deposit', 'down payment', 'purchase order', 'order process'],
      q: 'How to order',
      a: 'Every product ordered is defined by a <strong>work order</strong>. The customer signs the work order, so on collection it is clear whether any error was ours or in the specification.<br><br>Every order requires an <strong>advance payment</strong> as a guarantee that the order will be collected. If delivery has been agreed, the full amount must be paid, and the invoice accompanies the goods to the delivery point.<br><br>For <strong>non-cash payment</strong> (bank transfer) we accept orders by phone, fax and email.',
      acts: [
        { label: 'Send your specification', href: 'mailto:office@tricom.rs?subject=Order', icon: 'mail' },
        { label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }
      ]
    },
    {
      id: 'placanje',
      w: 1.15,
      k: ['payment', 'payments', 'pay', 'paying', 'how to pay', 'how can I pay', 'payment methods', 'payment options',
          'card', 'cards', 'credit card', 'debit card', 'visa', 'mastercard', 'dina', 'cheque', 'cheques', 'check',
          'bank transfer', 'wire transfer', 'cash', 'instalments', 'installments', 'loan', 'credit', 'deferred payment', 'pay later'],
      q: 'Payment methods',
      a: 'We accept:<ul><li>cash payment through the fiscal cash register</li><li>non-cash payment by bank transfer</li><li>personal cheques</li><li>payment cards — <strong>Dina, Visa, MasterCard</strong> (all types)</li><li>bank loan — we issue a pro forma invoice in the bank’s name, and the bank pays on behalf of the borrower</li></ul><strong>We do not sell on instalments</strong> — by law, only banks may grant loans to companies and individuals. If you need a loan, we will issue a pro forma invoice for the bank.',
      acts: [{ label: 'Frequently asked questions', href: 'about.html#faq', icon: 'arrow' }]
    },
    {
      id: 'popust',
      k: ['discount', 'discounts', 'price', 'prices', 'pricing', 'price list', 'pricelist', 'cost', 'costs', 'how much',
          'how much does it cost', 'quote', 'quotation', 'request a quote', 'get a quote', 'pro forma', 'proforma',
          'cheaper', 'expensive', 'bulk discount', 'quantity discount', 'volume discount', 'rebate', 'estimate'],
      q: 'Prices, quotes and discounts',
      a: 'We do not publish a price list on the website, because the price depends on the material, thickness, size and <strong>quantity</strong>.<br><br>To give you a quote, we need your requirements: <strong>thickness, sheet size / dimensions, quantity</strong>. A discount is possible from <strong>1 tonne</strong> upwards, and the larger the quantity, the larger the discount.<br><br>For processing services, send a sketch or a DXF/DWG file.',
      acts: [
        { label: 'Send an inquiry', href: 'mailto:office@tricom.rs?subject=Request%20for%20a%20quote', icon: 'mail' },
        { label: 'Contact form', href: 'contact.html#upit', icon: 'arrow' }
      ]
    },
    {
      id: 'reklamacija',
      k: ['complaint', 'complaints', 'quality claim', 'return', 'returns', 'refund', 'exchange', 'return goods', 'returning goods',
          'warranty', 'guarantee', 'lost receipt', 'lost invoice', 'no receipt', 'without receipt', 'receipt', 'defective', 'faulty'],
      q: 'Complaints and returns',
      a: 'The rules for returns are strict:<ul><li>an <strong>invoice is required</strong> for any return</li><li>for goods worth more than RSD 500, an ID card is also required</li><li>quality complaints must be made <strong>within 3 days</strong> of sale at the latest — by replacement or refund</li></ul>In all other cases, exchange and refund are not possible. Goods made to measure (on a work order) naturally cannot be returned like standard goods.',
      acts: [{ label: 'Frequently asked questions', href: 'about.html#faq', icon: 'arrow' }]
    },
    {
      id: 'isporuka',
      k: ['delivery', 'deliveries', 'deliver', 'do you deliver', 'shipping', 'ship', 'transport', 'home delivery',
          'to my address', 'truck', 'lead time', 'delivery time', 'how long', 'how long does it take',
          'collection', 'collect', 'pick up', 'pickup', 'where to collect', 'own transport'],
      q: 'Delivery and lead times',
      a: 'Goods are <strong>collected in Batajnica</strong>, at the sales address. Ask sales about delivery — it is arranged with the order. If delivery is agreed, <strong>the full agreed amount must be paid</strong>, and the invoice accompanies the goods to the delivery point.<br><br>The lead time depends on whether the item is in stock or made to a work order, and on the quantity. It is agreed with the quote.',
      acts: [{ label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }]
    },
    {
      id: 'montaza',
      w: 1.2,
      k: ['installation', 'install', 'installer', 'installers', 'do you install', 'do you do installation', 'fitting', 'fitters',
          'mounting', 'assembly', 'on site', 'on-site', 'roofer', 'roofers', 'roofing contractor', 'contractors',
          'fitters on site', 'tradesman', 'tradesmen', 'cover my roof', 'put up', 'fit my gutters', 'install my gutters',
          'gutter installation', 'gutter fitting'],
      q: 'Does TRICOM do installation',
      a: '<strong>No — we have not done installation since 2006.</strong><br><br>That year a strategic decision was made that our primary activity would be the <strong>production and sale</strong> of metal products, precisely so that we would not compete with the craft workshops and companies that buy material from us.<br><br>Instead of installation we offer:<ul><li>complete manufacture and preparation of elements for installation</li><li><strong>advisory support and consulting</strong> based on decades of contracting experience</li></ul>If you need a tradesman, sales can refer you to sheet-metal workers and metal fabricators who work with us.',
      acts: [{ label: 'Company history', href: 'about.html#istorijat', icon: 'arrow' }]
    },

    /* ---- Company ---- */
    {
      id: 'kontakt',
      w: 1.3,
      k: ['contact', 'contact details', 'phone', 'phone number', 'telephone', 'call', 'email', 'e-mail', 'mail', 'address',
          'location', 'located', 'where are you', 'where are you located', 'how to find you', 'find you', 'directions',
          'opening hours', 'working hours', 'business hours', 'office hours', 'hours', 'open', 'when are you open',
          'what time', 'saturday', 'sunday', 'weekend', 'batajnica', 'ugrinovci', 'map', 'visit', 'come to you',
          'street', 'head office', 'office', 'warehouse', 'branch', 'belgrade', 'zemun'],
      q: 'Contact, locations and opening hours',
      a: 'Opening hours: <strong>{hours}</strong>.<br><br><strong>Production and sales</strong><br>Kneza Paskača 16–18, 11273 Batajnica, Belgrade<br><a href="tel:+381638503000">+381 63 850 30 00</a> · <a href="tel:+381603801668">+381 60 380 16 68</a><br><a href="tel:+381117870024">+381 11 787 00 24</a> · <a href="tel:+381117870348">+381 11 787 03 48</a><br><br>Email: <a href="mailto:office@tricom.rs">office@tricom.rs</a>',
      acts: [
        { label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' },
        { label: 'Contact page', href: 'contact.html', icon: 'arrow' }
      ]
    },
    {
      id: 'onama',
      k: ['about us', 'about the company', 'about tricom', 'who are you', 'what do you do', 'what does tricom do',
          'what is tricom', 'company', 'business', 'activity', 'line of business', 'tricom', 'trivanovic'],
      q: 'About TRICOM',
      a: 'TRICOM is a family company from Batajnica, in metalworking <strong>since 1966</strong>.<br><br>Even before the Second World War the Trivanović family were blacksmiths and sheet-metal workers; in 1966 they opened a sheet-metal and metal fabrication workshop, which in 1992 grew into a company and expanded into trading in metal and metal hardware.<br><br>Today TRICOM focuses on <strong>making and supplying sheet-metal products for construction</strong> and on <strong>selling accessories, equipment and tools</strong> for sheet-metal workers and metal fabricators.',
      acts: [{ label: 'About us', href: 'about.html', icon: 'arrow' }]
    },
    {
      id: 'istorijat',
      k: ['history', 'company history', 'since when', 'how long have you been', 'how long in business', 'founded',
          'when founded', 'when was the company founded', 'when were you founded', 'established', 'foundation',
          '1966', '1992', '2006', '2009', 'tradition', 'years in business', 'how many years', 'how old',
          'since when do you exist', 'family business', 'family company'],
      q: 'History',
      a: 'Key years:<ul><li><strong>1966</strong> — the Trivanović sheet-metal and metal fabrication workshop opens</li><li><strong>1992</strong> — the workshop is re-registered as a company and expands into metal trading</li><li><strong>2006</strong> — strategic decision: no installation, focus on production and sales</li><li><strong>2009</strong> — new production hall and central warehouse in Ugrinovci, <strong>1,600 m²</strong>, alongside the existing <strong>800 m²</strong> facility in Batajnica</li></ul>The contracting years also included work at great heights — over 30 m on the University Clinical Centre of Serbia and over 50 m on silos and sugar factories.',
      acts: [{ label: 'Full history', href: 'about.html#istorijat', icon: 'arrow' }]
    },
    {
      id: 'kapaciteti',
      k: ['capacity', 'capacities', 'production capacity', 'facility', 'facilities', 'production hall', 'hall', 'halls',
          'warehouse', 'floor area', 'square metres', 'square meters', 'how big', 'machines', 'machinery', 'equipment',
          '1600', '1,600', '800', '2400', '2,400', 'plant', 'production facility'],
      q: 'Capacities and machinery',
      a: 'Two facilities, <strong>2,400 m²</strong> in total:<ul><li>Batajnica — <strong>800 m²</strong></li><li>Ugrinovci (Zemun) — production hall and central warehouse, <strong>1,600 m²</strong> (since 2009)</li></ul>Machinery:<ul><li>CNC plasma up to <strong>30 mm</strong> + oxy-fuel cutting up to <strong>150 mm</strong>, table <strong>2.5 × 8 m</strong></li><li>hydraulic guillotine shears up to <strong>13 mm</strong></li><li>NC press brake <strong>3 m</strong>, press brake <strong>8.2 m</strong></li><li>roll formers for gutters and downpipes, roll formers for TR sheet</li><li>parapet sheet machine, cladding panel machine</li><li>band saws and various presses</li></ul>',
      acts: [{ label: 'All services', href: 'services.html', icon: 'arrow' }]
    },
    {
      id: 'sertifikati',
      k: ['certificate', 'certificates', 'certification', 'certified', 'credit rating', 'rating', 'aaa', 'gold certificate',
          'bisnode', 'coface', 'excellent sme', 'iso', 'quality certificate', 'awards', 'recognition', 'accreditation',
          'creditworthiness', 'bonitet'],
      q: 'Certificates and credit rating',
      a: 'TRICOM holds:<ul><li><strong>Excellent SME Serbia</strong> — Chamber of Commerce and Industry of Serbia in cooperation with Coface Serbia</li><li><strong>Rating A</strong> — among the 1% most successful companies in Serbia under the EFQM methodology (2014)</li><li><strong>Bonitetna izvrsnost (credit-rating excellence) AA certificate</strong> (Bisnode) — held by only 2% of companies in Serbia</li><li><strong>AAA certificate</strong> (Bisnode) based on 2015 results</li><li><strong>Zlatni sertifikat (Gold Certificate)</strong> (2017, based on 2014–2016 results) — awarded to 115 of 446,449 active legal entities in Serbia</li></ul>',
      acts: [{ label: 'Certificates', href: 'about.html#sertifikati', icon: 'arrow' }]
    },
    {
      id: 'reference',
      w: 1.1,
      k: ['references', 'reference', 'projects', 'past projects', 'notable projects', 'buildings', 'where have you worked',
          'karadjordjevo', 'usce', 'zeleni venac', 'belgrade waterfront', 'lidl',
          'famous buildings', 'case studies', 'jobs done', 'track record'],
      q: 'References',
      a: 'Our largest contracting project: the <strong>presidential residential complex in Karađorđevo</strong> — complete roofing works, <strong>32 tonnes of copper</strong> processed and installed, all completed in <strong>48 days</strong>.<br><br>Supplies and works on buildings: Belgrade Waterfront, Ušće Business Centre, Zeleni Venac market (for Ganex Krečković), LIDL, Continental Subotica, ZF Pančevo, GEZE Zrenjanin, MITAS Ruma, MEI TA Obrenovac, BOYSEN Subotica, NELT Dobanovci, Kuehne+Nagel Dobanovci, IPB Šimanovci, Sport Vision Šimanovci, TERRA Inđija, Gomex Zrenjanin, SAVACOOP Novi Sad, Pupin Palace, Brze pruge Srbije (Serbian high-speed railways).',
      acts: [{ label: 'All references', href: 'references.html', icon: 'arrow' }]
    },
    {
      id: 'pib',
      k: ['pib', 'tax id', 'tax number', 'tax identification number', 'vat', 'vat number', 'company details', 'company data',
          'billing details', 'invoice details', 'official details', 'company information'],
      q: 'Company details',
      a: '<strong>TRICOM d.o.o.</strong>, Batajnica, Belgrade<br>Tax ID (PIB): <span class="mono">100093247</span><br>Registered office: Kralja Vladislava 82, 11273 Batajnica<br>Email: <a href="mailto:office@tricom.rs">office@tricom.rs</a><br><br>For confirmation of VAT registration and other official documents, please contact the head office.',
      acts: [{ label: 'Contact', href: 'contact.html', icon: 'arrow' }]
    },
    {
      id: 'dxf',
      k: ['dxf', 'dwg', 'drawing', 'drawings', 'file', 'files', 'file format', 'sketch', 'cad', 'autocad', 'send a drawing',
          'how to send a drawing', 'how do I send a drawing', 'blueprint', 'pdf drawing', 'design file', 'vector file'],
      q: 'Sending drawings and sketches',
      a: 'For plasma cutting it is best to send a <strong>DXF or DWG</strong> file. We also accept:<ul><li>a dimensioned sketch (hand-drawn is fine)</li><li>a PDF drawing</li><li>a photo of the design — with some correction we adapt it for cutting, within the limits of the machine</li></ul>Send it to <a href="mailto:office@tricom.rs">office@tricom.rs</a> with the material, thickness and quantity.',
      acts: [{ label: 'Send a drawing', href: 'mailto:office@tricom.rs?subject=Drawing%20for%20plasma%20cutting', icon: 'mail' }]
    },
    {
      id: 'kupci',
      k: ['who do you sell to', 'do you sell to individuals', 'private individuals', 'private individual', 'private person',
          'private customers', 'individuals', 'companies', 'retail', 'wholesale', 'trade customers', 'sell to the public',
          'can I buy as a private person', 'diy', 'customers', 'b2b', 'b2c', 'end users'],
      q: 'Who TRICOM sells to',
      a: 'We work with both companies and private individuals: craft workshops, sheet-metal workers, metal fabricators, contractors, companies that further process the products, as well as private and DIY customers.<br><br>Our sales cover both <strong>wholesale</strong> and <strong>retail</strong>, with a fiscal cash register for cash payments.',
      acts: [{ label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }]
    },
    {
      id: 'kvalitet',
      k: ['quality policy', 'standards', 'quality control', 'why you', 'why tricom', 'why choose', 'why should I choose',
          'advantages', 'benefits', 'one stop shop', 'one-stop shop', 'all in one place', 'everything in one place'],
      q: 'Why TRICOM',
      a: 'The essence of our offer is that a business partner gets the material <strong>at the stage of supply that suits them</strong>:<ul><li>material in factory packaging</li><li>processing in the shape, quantity and finish the partner wants</li><li>manufacture of the specific product the partner needs</li><li>collection in Batajnica, with delivery by arrangement</li></ul>The company’s philosophy is that it has no competitors, only business friends and associates — which is why since 2006 we have not worked on site as a contractor.',
      acts: [{ label: 'About us', href: 'about.html', icon: 'arrow' }]
    },
    {
      id: 'galerija',
      k: ['gallery', 'photos', 'photographs', 'pictures', 'images', 'examples', 'what does it look like', 'portfolio',
          'work samples', 'samples of work', 'show me'],
      q: 'Gallery',
      a: 'The gallery shows examples of plasma-cut panels, sheet-metal roofing accessories, gutter systems, sections and finished buildings.',
      acts: [{ label: 'Open the gallery', href: 'gallery.html', icon: 'arrow' }]
    },
    {
      id: 'posao',
      k: ['job', 'jobs', 'employment', 'vacancy', 'vacancies', 'career', 'careers', 'hiring', 'are you hiring', 'work for you',
          'apply for a job', 'job application', 'cv', 'resume', 'internship', 'looking for a job'],
      q: 'Jobs',
      a: 'Open positions are not published on the website. You can send an application and CV to <a href="mailto:office@tricom.rs?subject=Job%20application">office@tricom.rs</a> — the head office considers applications when there is a need.<br><br>TRICOM has a <strong>business and technical cooperation</strong> agreement with the Academy of Technical Applied Studies Belgrade (2022).',
      acts: [{ label: 'Send an application', href: 'mailto:office@tricom.rs?subject=Job%20application', icon: 'mail' }]
    },
    {
      id: 'assistant',
      k: ['are you a robot', 'are you human', 'are you a person', 'are you real', 'are you a bot', 'ai', 'bot', 'chatbot',
          'assistant', 'who am I talking to', 'who am I speaking to', 'what are you', 'artificial intelligence', 'chatgpt'],
      q: 'About the assistant',
      a: 'I am not a person — I am an assistant built into the website. I run <strong>locally in your browser</strong>, without the internet or external services, and answer from the database about TRICOM that the website was given.<br><br>So I have no access to stock, real-time prices or the status of your order — that is what the sales team is for.',
      acts: [{ label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' }]
    },
    /* ---- Carried over from the old website tricom.co.rs (October 2026) — see _content/old/facts.md ---- */
    {
      id: 'tr60',
      k: ['tr 60', 'tr60', 'tr 60/210', '60/210', 'high trapezoidal', 'high profile', 'tall profile', 'deep profile',
          'largest span', 'longest span', 'biggest span', 'highest profile', 'trapezoidal sheet 60'],
      q: 'TR 60/210',
      a: 'The highest profile in our range: rib height <strong>60 mm</strong>, pitch 210 mm, cover width <strong>840 mm</strong> (overall 937 mm) from a 1,250 mm strip, thickness 0.5–1.0 mm, in galvanised and galvanised pre-painted sheet. Also available with anti-condensation felt. The allowable load table (2, 3 and 4 supports) is on the products page.',
      acts: [{ label: 'Roofing and façade systems', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'pokrivne-sirine',
      k: ['cover width', 'covering width', 'coverage width', 'effective width', 'useful width', 'input width', 'sheet width',
          'width of sheet', 'how much does a sheet cover', 'how wide', 'overall width', 'developed width',
          'cover width of tr', 'width of tr', 'cover width tr', 'tr cover width'],
      q: 'Cover widths of trapezoidal profiles',
      a: 'From the factory drawings: <strong>TR 10/162.5 — 975 mm</strong> (input 1,025), <strong>TR 20/185 — 1,110 mm</strong> (input 1,165), <strong>TR 35/270 — 1,080 mm</strong> (overall 1,109.7), <strong>TR 40/230 — 920 mm</strong>, <strong>TR 60/210 — 840 mm</strong> (overall 937); the input strip for TR 35–60 is 1,250 mm. Tile-effect sheet: a row of 5 tiles is 1,190 mm, cover width 1,150 mm. The smaller the cover width, the higher the load capacity of the sheet.',
      acts: [{ label: 'Profile table', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'montaza-tr',
      k: ['purlin spacing', 'purlin', 'purlins', 'distance between purlins', 'roofing screws', 'screws for roofing',
          'screws for sheet', 'fixing', 'fixings', 'fastening', 'fasten', 'self-drilling', 'self drilling', 'saddle',
          'spacer', 'how to install tr sheet', 'how to fix trapezoidal sheet', 'how to install trapezoidal sheet',
          'sheet overlap', 'overlap', 'overhang into gutter', 'screw in rib', 'installation instructions'],
      q: 'Fixing TR sheet',
      a: 'Our installation guidance: purlin spacing <strong>0.6–1 m</strong> (TR 35); the fixing pattern is decided by a responsible engineer. Timber structures take self-drilling screws 6.3×70–6×90 mm, steel structures self-tapping screws 6.3×50–6.3×70 mm, always with a neoprene and a metal washer. We recommend fixing <strong>in the upper zone</strong> (through the rib) with a PVC spacer saddle and a sheet-metal cap saddle — a screw in the lower zone widens its hole over time. The sheet overhangs into the gutter by 5–8 cm; the last rib of the sheet goes on top.',
      acts: [{ label: 'Installation guide', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'statika-tr',
      k: ['load capacity', 'load', 'load table', 'load tables', 'load-bearing', 'bearing capacity', 'allowable load',
          'permissible load', 'statics', 'structural data', 'what thickness for roof', 'which thickness for roof',
          'what thickness for a roof', 'thickness should I use', 'should I use for my roof', 'thickness for my roof', 'kn/m2', 'kg/m2 load', 'moment of inertia', 'deflection', 'snow load', 'span table'],
      q: 'Load capacity of trapezoidal sheet',
      a: 'For TR 40/230 and TR 60/210 we have allowable load tables by support spacing (1–4 m) and sheet thickness 0.5–1.0 mm. Example: TR 40/230, 0.7 mm, single span of 2 m — 166 kg/m²; TR 60/210, 0.7 mm, 2 supports at 2 m — 3.84 kN/m² (deflection L/200). Section properties of TR 40: 0.5 mm — 5.33 kg/m², I 11.78 cm⁴/m; 1.0 mm — 10.74 kg/m², I 23.38 cm⁴/m.',
      acts: [{ label: 'Load tables', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'crep-detalji',
      k: ['tile colours', 'tile colors', 'tile-effect colours', 'tile effect colours', 'tile effect colors', 'tile sheet colours',
          'colours of tile', 'colours of tile-effect', 'colours of tile-effect sheet', 'colors of tile-effect', 'new tile model', 'tile module', 'tile length', 'tile weight', 'weight of tile', 'textured',
          'granular', 'granulated', 'minimum pitch', 'minimum roof pitch', 'pitch for tile', 'roof pitch', 'tdm', 'kg/m2 tile'],
      q: 'Tile-effect roofing sheet — data',
      a: 'New model (since July 2020): 1 row of 5 tiles or length to order; tile length <strong>350 mm</strong> as standard (350–450 recommended). Row width 1,190 mm, cover width 1,150 mm, sheet 0.5 mm (zinc coating 140 g/m², paint 25 µm face / 8 µm reverse, 25/25 also possible). Colours: blue 5010, green 6028, burgundy 3009, brown TDM, black 9005, off-white 9002, metallic 9006, anthracite grey 7016; textured: black, burgundy, brown. Weight under 5 kg/m² (classic tiles 30–50 kg/m²), minimum roof pitch 14°.',
      acts: [{ label: 'Tile-effect sheet', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'parapet',
      k: ['parapet', 'parapet sheet', 'parapet lining sheet', 'parapet profile', 'parapet profiles', 'pr 83/34', 'pr 38/15',
          'pr 71/10', 'sheet for parapet', 'façade profile', 'facade profile', 'facade sheet', 'wall profile'],
      q: 'Parapet lining sheet',
      a: 'Three profiles: <strong>PR 83/34</strong> (cover width 910 mm from 1,000, 1,160 mm from 1,250), <strong>PR 38/15</strong> (967 / 1,213 mm) and <strong>PR 71/10</strong> (924 / 1,209 mm). Sheet 0.4–0.8 mm — pre-painted, galvanised, cold-rolled; profile 71/10 also in 0.5–2 mm (0.8–2 mm recommended). Made to order, based on the sheet sizes in stock.',
      acts: [{ label: 'Roofing and façade systems', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'lamperija-detalji',
      k: ['cladding panel length', 'panel length', 'length of cladding panels', 'aluminium cladding panels',
          'aluminum cladding panels', 'cladding 2.5', 'embossed panels', 'stainless cladding', 'copper cladding',
          'bathroom panels', 'bathroom ceiling', 'eaves panels', 'aluminium trims', 'aluminum trims'],
      q: 'Metal cladding panels — materials and sizes',
      a: 'We make cladding panels from pre-painted aluminium, pre-painted galvanised, stainless steel and copper sheet; the standard length is <strong>2.5 m</strong>, other lengths for larger quantities. The joint is concealed and watertight. Stainless steel panels (mirror, matt, brushed) meet the standards for food-preparation rooms. <strong>Aluminium cladding panels</strong>: pre-painted brown or white, smooth or embossed, 2.5 m panels with a net cover area of 0.65 m²; they do not corrode and need no maintenance — bathrooms, ceilings, corridors, eaves; edge trims and aluminium nails.',
      acts: [{ label: 'Roofing and façade systems', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'paneli-detalji',
      k: ['sandwich panel', 'sandwich panels', 'stone wool', 'mineral wool', 'rock wool', 'rockwool', 'pur panel', 'pir panel',
          'non-combustible', 'non combustible', 'fire resistance', 'fire rating', 'fire class', 'a1', 'wall panel',
          'wall panels', 'roof panel', 'roof panels', 'panel colours', 'panel colors'],
      q: 'Sandwich panels',
      a: 'A panel is two galvanised pre-painted steel sheets with a thermal insulation core — a self-supporting board for walls or roofs. We offer panels with a <strong>stone wool</strong> core, the only ones with non-combustibility class <strong>A1</strong> (Euroclass A1/A2, s1, d0; fire resistance 30–240 min; permanently above 300 °C) — often a condition for technical approval of warehouses and production buildings. Colours: RAL 3000, 3009, 5010, 6028, 7016, 8019, 9002, 9006.',
      acts: [{ label: 'Panels', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'pokrivanje-krova',
      k: ['how to cover a roof', 'roof covering', 'roof build-up', 'roof buildup', 'roof layers', 'layers of a roof',
          'roof insulation', 'vapour membrane', 'vapor barrier', 'breathable membrane', 'membrane', 'z purlin',
          'mock-up', 'roof mock-up', 'showroom', 'which sheet for roof', 'best sheet for roof', 'roof structure'],
      q: 'How a roof structure is covered',
      a: 'Four ways: TR sheet or tile-effect sheet; the same with anti-condensation felt; sandwich panels; manually installed insulation. Roof layers with stone wool: roof girder → Z purlin → TR 40/230 as the lower support → vapour-permeable membrane → stone wool (preferably 200 mm) → waterproof vapour-permeable membrane → TR 20/35/40 → gutter → snow guard → verge flashing. A mock-up of such a roof stands in our showroom at Kneza Paskača 18. The sheet most often chosen is pre-painted galvanised: well protected and much cheaper than pre-painted aluminium.',
      acts: [{ label: 'Guide on the products page', href: 'products.html?group=krov#prog', icon: 'arrow' }]
    },
    {
      id: 'oluci-formati',
      k: ['gutter sizes', 'gutter size', 'gutter dimensions', 'gutter formats', 'gutter width', 'developed width 333', '333',
          'rs 333', 'downpipe diameter', 'downpipe size', 'downpipe sizes', 'ø100', '100 mm downpipe', 'gutter length',
          'how long gutter', 'longest gutter', 'square downpipe dimensions', '12x12', '10x10', 'gutter colours',
          'gutter colors', 'gutters in stock'],
      q: 'Gutter and downpipe sizes',
      a: 'Half-round gutters with a developed width of <strong>250 and 270 mm</strong> (pieces up to 4 m), <strong>333 mm</strong> (galvanised unlimited, others up to 6.5 m) and <strong>400 mm</strong> (up to 6 m); box gutters up to 8.2 m. Round downpipes Ø80, Ø120 and Ø150 up to 6 m, <strong>Ø100 unlimited</strong>; square 10×10, 12×12, 12×10 and 11×8 cm in 6 m lengths. Materials: galvanised, pre-painted, copper, aluminium, stainless steel. In stock: galvanised and pre-painted (brown, burgundy, metallic, off-white, black, green) in lengths of 4, 5 and 6 m. Accessory colours: RAL 8019, 3009, 9002, 9005, 9006.',
      acts: [{ label: 'Size table', href: 'products.html?group=oluci#prog', icon: 'arrow' }]
    },
    {
      id: 'galanterija-detalji',
      k: ['gutter bracket', 'gutter brackets', 'gutter hanger', 'gutter hook', 'gutter hooks', 'end cap', 'end caps',
          'gutter end cap', 'hopper head', 'hopper heads', 'hopper', 'gutter outlet', 'gutter corner', 'gutter corners',
          'gutter guard', 'elbow', 'elbows', 'downpipe clip', 'downpipe clips', 'downpipe bracket', 'snow guard for tiles',
          'shingles', 'beaver tail', 'tondach', 'kikinda', 'becej', 'nail covers', 'rainwater diverter', 'rainwater diverters', 'downpipe diverter'],
      q: 'Gutter accessories',
      a: 'For all gutter sizes and colours: <strong>brackets</strong> (F 250 4×25×430 … F 400 5×30×730), <strong>gutter end caps</strong> (including a quick-fit type for F 333), <strong>hopper heads</strong> (F 250/80 … F 400/150), external and internal <strong>gutter corners</strong>, <strong>guards</strong>, <strong>elbows</strong> Ø80–Ø150, <strong>downpipe clips</strong> round (with spike and with wall plug, 100/150/200) and square (F 250–625), <strong>snow guards</strong> for shingles, beaver-tail tiles, Kikinda, Bečej and Tondach tiles, <strong>rainwater diverters</strong> and <strong>nail covers</strong>. Copper and stainless steel to order.',
      acts: [{ label: 'Accessory tables', href: 'products.html?group=oluci#prog', icon: 'arrow' }]
    },
    {
      id: 'opsivke-detalji',
      k: ['verge flashing length', 'verge flashing', 'verge flashings', 'valley flashing', 'valley flashing length',
          'penetration flashing', 'penetration flashings', 'chimney flashing', 'chimney flashings', 'flashing for chimney', 'eaves drip flashing',
          'drip flashing length', 'flashing length', 'how long flashing', '8.2 m', 'flashings in stock',
          'format 333', 'format 500'],
      q: 'Verge flashings, valley flashings, penetration flashings, eaves drip flashings',
      a: 'We make all of them from sheet up to <strong>0.8 mm</strong> (stainless steel up to 0.6 mm) in lengths up to <strong>8.2 m</strong>. In stock: galvanised verge flashings (333 and 500 mm sizes), valley flashings (500 mm) and penetration flashings (250 and 333 mm) in lengths of 4, 5 and 6 m; eaves drip flashings only to order. Chimney flashings from 0.5 mm sheet for all sizes; a galvanised 40×40 cm chimney flashing is always in stock.',
      acts: [{ label: 'Sheet-metal profiles', href: 'products.html?group=oluci#prog', icon: 'arrow' }]
    },
    {
      id: 'pocinkovani-lager',
      k: ['galvanised thickness', 'galvanized thickness', 'galvanised sheet thickness', 'galvanized sheet thickness',
          'thickness of galvanised', 'sheet weight', 'weight of sheet', 'kg/m2', 'dx51d', 'zinc coating', 'zinc layer',
          '275 g', '140 g', 'sheet size', 'sheet sizes', 'standard sheet sizes', '1250x2500', '1000x2000', '1500x3000',
          'slit coil', 'galvanised coil', 'galvanized coil', 'galvanised in stock'],
      q: 'Galvanised sheet — stock and quality',
      a: 'Galvanised sheet 0.4–2 mm in all sizes, hot-dip galvanised <strong>140, 200 and 275 g/m²</strong>, grade DX51D/DX53D/DX54D (EN 10142, EN 10327). Coil 0.45–4 mm in widths of 1,000/1,250 (from 0.8 mm also 1,500), sheets 0.4–3 mm in 1,000×2,000, 1,250×2,500 and 1,500×3,000; slit coil 0.5 mm in widths of 200, 250, 270, 312, 333, 375, 417, 500 and 625 mm. Weight: 0.5 mm — 4.0 kg/m², 1 mm — 8.0 kg/m².',
      acts: [{ label: 'Sheet tables', href: 'products.html?group=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'bojeni-lager',
      k: ['sheet colours', 'sheet colors', 'colours in stock', 'colors in stock', 'which colours do you have',
          'pre-painted colours', 'prepainted colors', 'pre-painted sheet colours', 'ral 9002', 'ral 9016', 'ral 7016',
          'ral 6028', 'ral 3009', 'ral 5010', 'ral 9005', 'wood effect', 'wood grain', 'textured sheet',
          'double-sided painted', 'painted both sides', 'pre-painted thickness', '0.45', 'coating layers', 'polyester', 'primer'],
      q: 'Pre-painted (coil-coated) sheet — colours in stock',
      a: 'Single-side pre-painted coil 0.50×1,250 in RAL 9002, 9016, 9006, 7016, TDM brown, 6028, 6002 (0.55), 6011, 3009, 5010, 5015, 9005, 3020, textured TDM and 9005, and wood effect; 0.60×1,250 in 9002, 9006, TDM and 3009. Double-sided 0.50×1,000: 9002, 9006, TDM, 6028, 3009, 9005; slit coils 333/417/500 (and 271/396 double-sided). Thicknesses mostly 0.45/0.5/0.55 mm. Layers: polyester 25 µm, primer 8 µm, pretreatment layer 6 µm, zinc, steel 0.50 mm. Larger quantities in any RAL colour by arrangement with the manufacturer.',
      acts: [{ label: 'Sheet tables', href: 'products.html?group=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'alu-bakar-lager',
      k: ['aluminium sheet thickness', 'aluminum sheet thickness', 'aluminium coil', 'aluminum coil', 'aluminium sheet sizes',
          'aluminium chequer plate', 'chequer aluminium', 'copper sheet thickness', 'copper coil', 'copper sheets',
          'copper slit', 'copper weight', 'half-hard', 'half hard'],
      q: 'Aluminium and copper sheet — stock',
      a: '<strong>Aluminium</strong> (half-hard): coil 0.6–0.8 mm in widths of 1,000–1,250 (1.65–1.90 kg/m²), sheets 1–5 mm up to 1,500×3,000, chequer plate 1.2/1.7 to 5/6 mm; pre-painted aluminium coil 0.6 and 0.7 mm in RAL 9010, 8019, 5010, 3009, 9002, 9006. <strong>Copper</strong> (half-hard, for accessories): coil 0.50 / 0.55 / 0.60 × 1,000, slit 270/333/396/600, sheets 1,000×2,000 from 0.5 to 5 mm (4.5–45.45 kg/m²); also copper cladding panels.',
      acts: [{ label: 'Sheet tables', href: 'products.html?group=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'crni-inox-lager',
      k: ['cold rolled thickness', 'cold-rolled sheet thickness', 'hot rolled thickness', 'hot-rolled sheet thickness',
          'dc01', 's235jr', 'chequer plate', 'checker plate', 'tread plate', 'teardrop', 'diamond plate', '1.4301', '1.4016',
          '1.4401', 'acid resistant', 'acid-resistant', 'stainless sheet sizes', 'stainless coil', 'stainless thickness',
          'stainless steel thickness', 'mirror finish', 'brushed stainless'],
      q: 'Black (cold-rolled, hot-rolled) and stainless steel sheet — stock',
      a: '<strong>Cold-rolled</strong> 0.4–2.5 mm (widths 1,000/1,250), grade DC01; sheets 0.4–3 mm. <strong>Hot-rolled</strong> flat 1.5–15 mm (1,000/1,250/1,500), S235JR, sheets up to 30 mm and 1,500×6,000; chequer plate, teardrop and diamond pattern, 2/3–5/6 mm × 1,500×3,000. <strong>Stainless steel</strong>: acid-resistant and corrosion-resistant, matt/mirror/brushed, with and without protective film — coil 0.5 and 0.6 × 1,000/1,250, slit 0.5×333, sheets 0.8–4 mm; grades 1.4016, 1.4301, 1.4401.',
      acts: [{ label: 'Sheet tables', href: 'products.html?group=limovi#prog', icon: 'arrow' }]
    },
    {
      id: 'cevi-detalji',
      k: ['tube sizes', 'tube dimensions', 'pipe sizes', 'square tube sizes', 'square tube dimensions', 'rectangular tube sizes',
          'inch pipe', 'inch tubes', 'black pipe', '3/8', 'round tube sizes', 'galvanised pipe', 'galvanized pipe',
          'galvanised tubes', 'zp section', 'zp sections', 'precision tube', 'oval tube', 'oval tubes', 'tube weight',
          'weight per metre', 'kg/m', 'unis', 'fahop', 'hydrotested', 'wall thickness'],
      q: 'Tubes — sizes and weights',
      a: 'Square <strong>13×13 – 150×150</strong>, rectangular <strong>10×20 – 100×200</strong>, 6 m lengths, wall 1–8 mm; black round tubes in inch sizes 3/8"–3" (structural, wall 1.5–2.5 mm, or hydrotested with a test certificate, pressure 50 bar); galvanised 1/2"–2" (wall from 2.5 mm); ZP sections 35×35 and 50×30 in 11 cross-section shapes; precision round Ø16–114.3 and oval (e.g. 36×18×1.5 — 1.048 kg/m), palletised in 6 m lengths. Example weights: 40×40×2 — 2.386 kg/m, 60×40×2 — 3.014 kg/m. Manufacturers: Unis Derventa, Fahop Aleksinac.',
      acts: [{ label: 'Steel tubes and sections', href: 'products.html?group=cevi#prog', icon: 'arrow' }]
    },
    {
      id: 'profili-detalji',
      k: ['angle sizes', 'angle dimensions', 'channel sizes', 'unp', 'inp', 'beam sizes', 'beams', 'flat bar sizes',
          'flat bar dimensions', 'drawn flat bar', 'square bar', 'solid square', 'cold-formed sections', 'cold formed sections',
          'bright drawn', 'round bar', 'solid round', 'section weight', 'steel grade', 's355', 's275', 'en 10025'],
      q: 'Steel sections — sizes',
      a: 'Angles 20×20×3 to 200×200×24 (EN 10056-1), UNP 30×15 to 400, INP 80 to 600 — grades S235JR, S275, S355 (EN 10025). Flat bar from hot-rolled sheet in stock cut to 3,000 mm (2×20 to 5×60), drawn flat bar 4–8 × 20–50 mm in 6 m lengths, embossed flat bar 4–10 × 12–50 mm up to 6 m. Solid square bar 6×6 to 20×20 (S235) in 6 m lengths, over 40×40 cut to exact length. Cold-formed sections on a 200 t press up to 10 mm and 3,100 mm (minimum radius 5–70 mm depending on thickness). Bright-drawn round bar Ø5–Ø28. Sections are sold whole or halved, and cut to specification.',
      acts: [{ label: 'Steel tubes and sections', href: 'products.html?group=cevi#prog', icon: 'arrow' }]
    },
    {
      id: 'zice-detalji',
      k: ['crimped wire mesh', 'welded mesh', 'welded wire mesh', 'annealed wire', 'binding wire', 'tie wire',
          'galvanised wire', 'galvanized wire', 'rabitz', 'plaster mesh', 'lath', 'grating sizes', 'stair tread sizes',
          'drain grating', 'drainage grating', 'lightning conductor', 'earthing strip', 'galvanised strip', 'galvanized strip'],
      q: 'Wire, mesh, gratings, strip',
      a: 'Crimped wire mesh (larger quantities up to 2,000×6,000 mm), welded wire mesh 2 mm 1,000×2,000, annealed wire (annealed at 680–700 °C, coils of 30–150 kg), galvanised wire 2.0–3.1 mm (2 mm ≈ 40 m/kg), rabitz mesh in rolls 1,000 mm × 25 m with 12×12 openings, galvanised drain gratings and stair treads 200×1,000 to 1,000×1,000 mm (S235, hot-dip galvanised or painted) and lightning-conductor strip 3×20, 4×25, 4×30, 4×40 mm — all cut to size.',
      acts: [{ label: 'Fencing systems and architectural metalwork', href: 'products.html?group=kovano#prog', icon: 'arrow' }]
    },
    {
      id: 'okov-detalji',
      k: ['locks', 'hardware', 'fittings', 'bane sekulic', 'petiti', 'fimet', 'hope', 'sliding gate', 'sliding door',
          'hinges', 'hinge', 'door handles', 'handles', 'drill bits', 'hss', 'cutting discs', 'grinding discs',
          'grinding wheels', 'ginic', 'diamond discs', 'piranha', 'wall plugs'],
      q: 'Hardware, hinges, drill bits, discs',
      a: 'Locks and hardware from <strong>Bane Sekulić</strong> (Sombor) and the Italian manufacturers PETITI, FIMET and HOPE; a sliding-gate kit certified up to 700 kg per carriage; door handles. <strong>Hinges</strong> without ball Ø10×50 to Ø18×90 and with ball Ø20×100 to Ø32×300, decorative hinges for wrought-iron fences. HSS and masonry drill bits (DeWalt, Piranha), wall plugs and pipe clamps; cutting, grinding and polishing discs Ø115–Ø500, including Ginić grinding wheels.',
      acts: [{ label: 'Tools and equipment', href: 'products.html?group=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'srafovi-detalji',
      k: ['din 933', 'din 7504', 'din 7981', 'din 571', 'machine bolt', 'machine bolts', 'sheet metal screw', 'sheet metal screws',
          'wood screw', 'wood screws', 'self-drilling screw', 'self-drilling screws', 'tek screw', 'blind rivets',
          'pop rivets', 'rivets', 'friulsider', 'koelner', 'lessman', 'sariv', 'plasterboard screws', 'drywall screws',
          'grade 8.8', '8.8', 'carriage bolt'],
      q: 'Fasteners — types and standards',
      a: 'Galvanised machine bolts, grade 5.6 and 8.8 (DIN 933, 84, 963, 603 carriage bolts); sheet-metal screws (DIN 7971, 7981, 7982); self-drilling screws (DIN 7504 K/P/N); wood screws — coach screws DIN 571, DIN 97 and DIN 7997 wood screws; plasterboard screws. Manufacturers: FRIULSIDER, KOELNER, LESSMAN, SARIV blind rivets.',
      acts: [{ label: 'Tools and equipment', href: 'products.html?group=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'varstroj-detalji',
      k: ['varex', 'varmig', 'varin', 'vartig', 'varcut', 'spot welding', 'spot welder', 'welding machine', 'welding machines',
          'inverter', 'mig mag', 'tig', 'co2 welder', 'electrodes', 'which welding machine'],
      q: 'Varstroj — welding machine range',
      a: 'Varstroj (Slovenia): <strong>VAREX</strong> 152/160/162 (MMA, 40–155 A), <strong>VARMIG</strong> 1600–1800 (MIG/MAG, 25–170 A, wire 0.6–0.8), <strong>VARIN</strong> 1105–3000 (MMA inverter, up to 320 A, electrodes up to 6 mm; 1700 and 2000 CEL and TIG), <strong>VARTIG</strong> 1605/2005/3000 AC/DC (TIG and MMA, up to 300 A), spot welders VST-3 and VST-25 PE/N, CNC cutter VARCUT. The data come from the catalogue on the previous website; sales can give you current models and prices, technical details are at varstroj.si.',
      acts: [{ label: 'Varstroj range', href: 'products.html?group=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'merdevine',
      w: 1.3,
      k: ['ladder', 'ladders', 'which ladders', 'alpos', 'expert', 'ratio', 'aluminium ladders', 'aluminum ladders',
          'professional ladders', 'ladder height', 'extension ladder', 'step ladder', 'stepladder'],
      q: 'Alpos ladders',
      a: '<strong>Alpos</strong> aluminium ladders (Slovenia): professional <strong>EXPERT</strong> 38-10 to 38-15 with certificate (extended 6.4–10.2 m, working height up to 10.9 m, 20–39 kg) and semi-professional <strong>RATIO</strong> 44-10 (extended 5.9 m, 15.4 kg). Plus Mimont accessories.',
      acts: [{ label: 'Tools and equipment', href: 'products.html?group=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'alu-profili',
      k: ['aluminium sections', 'aluminum sections', 'aluminium profiles', 'aluminum profiles', 'alloy 6060', '6060', '6063',
          'extruded', 'extrusions', 'extruded profiles', 'aluminium box section', 'aluminium tube', 'aluminum tube'],
      q: 'Aluminium sections',
      a: 'Commercial aluminium sections for architectural metalwork — extruded from 6060 and 6063 alloys based on primary aluminium, in L, T, box and tube shapes. They are mostly sold mill-finish, in natural aluminium colour.',
      acts: [{ label: 'Tools and equipment', href: 'products.html?group=alati#prog', icon: 'arrow' }]
    },
    {
      id: 'masine-detalji',
      k: ['mhs 3100', 'slitter', 'recoiling', 'decoiler', 'recoiler', 'press 200 t', '200 t', 'nc press brake', 'plate rolling',
          'rolling machine', 'arc bending', 'tube bending', 'pipe bending', 'bending in an arc', 'flat bar flattening',
          'flat bar straightening', 'corner notching', 'iron worker', 'ironworker', 'band saw', 'machine park',
          'which machines', 'what machines', 'machine list', 'list of machines', 'machinery'],
      q: 'Machinery — capacities',
      a: 'Hydraulic guillotine shear <strong>MHS 3100/13</strong> (13 mm / stainless steel 9 mm, cut length 3,100 mm) and electric shears up to 1.5 mm; slitter up to 1 mm, 7 strips, coil 6 t and 1,260 mm; decoiler–recoiler up to 1.2 mm; <strong>NC press brake 200 t</strong> (10 mm, stainless steel 7 mm, 3,100 mm); CNC folding machine 8.2 m (0.8 mm) and 8 m for flat sheet up to 4 mm; plate rolling machines up to 0.8 mm (Ø80–800) and up to 4 mm (min. Ø190); arc bending of tubes 1/2"–2", square up to 50×50 and rectangular up to 40×60; flattening of flat bars up to 10 mm; corner notching up to 4 mm (30–140°); Iron Worker; band saw (angle up to 60°, bundle cutting); roll formers for TR sheet, gutters, downpipes, parapet sheet, cladding panels and ducts; embossing machine; double standing seam line.',
      acts: [{ label: 'Machine datasheet', href: 'services.html#masine', icon: 'arrow' }]
    },
    {
      id: 'falc',
      k: ['standing seam', 'double standing seam', 'standing-seam', 'seam', 'seaming', 'seamed roof', 'falc', 'seam clips',
          'cleats for standing seam'],
      q: 'Double standing seam',
      a: 'We have a line for double standing seam roofing — sheets of galvanised, copper and pre-painted sheet for installers, as well as standing-seam clips from the sheet of your choice. We have not done on-site installation since 2006.',
      acts: [{ label: 'Roll forming', href: 'services.html#profilisanje', icon: 'arrow' }]
    },
    {
      id: 'firma-podaci',
      k: ['company registration number', 'registration number', 'company number', 'activity code', 'full name',
          'company name', 'legal name', 'registered name', 'vat', 'vat registered', 'bank account', 'account number',
          'banca intesa', 'director', 'owner', 'who owns', 'who is the owner', 'ceo', 'managing director', 'trivanovic'],
      q: 'Company details',
      a: 'Full registered name: “TRICOM” company for the production and trade of goods and services, export-import d.o.o. (short name TRICOM d.o.o. Beograd — Batajnica). Tax ID (PIB) <strong>100093247</strong>, company registration number <strong>06660231</strong>, activity code 2599, VAT-registered since 1 January 2005. Registered office: Kralja Vladislava 82, Batajnica. Director: Dragan Trivanović. Bank account: Banca Intesa 160-216272-93.',
      acts: [{ label: 'Company details', href: 'contact.html#upit', icon: 'arrow' }]
    },
    {
      id: 'mediji',
      k: ['media', 'in the media', 'in the press', 'press coverage', 'news', 'newspaper', 'article', 'articles',
          'entrepreneur of the year', 'blic', 'blic entrepreneur', 'n1', 'svet novca', 'award', 'most desirable employers',
          'ey', 'how many employees', 'number of employees', 'employees', 'staff'],
      q: 'TRICOM in the media',
      a: 'Dragan Trivanović was among the participants of <strong>EY Entrepreneur Of The Year 2014</strong>, and the company was among the candidates for the <strong>Blic Entrepreneur 2013</strong> award (article “Most desirable employers”: production at two locations, 15 employees at the time). N1 broadcast a report on entrepreneurs and bureaucracy in its programme “Svet novca” (World of Money). The clippings are on the About page.',
      acts: [{ label: 'In the media', href: 'about.html#mediji', icon: 'arrow' }]
    },
    {
      id: 'partneri',
      k: ['partners', 'business partners', 'our partners', 'your partners', 'who do you work with', 'clients', 'client list',
          'customer list', 'list of partners', 'who buys from you', 'unicef', 'friends club'],
      q: 'Business partners',
      a: 'Besides several thousand private customers, more than 460 companies and institutions work with TRICOM — from sheet-metal and metal fabrication workshops to industry (Gorenje Tiki, Energoprojekt Oprema, Galenika Magmasil, Minel General Electric, Nexe Beton, Pioneer, Volvo, Žito Dunav Agro, KBC Zemun, Historical Museum of Serbia…). The full list is on the References page. The company is a member of the UNICEF Friends’ Club.',
      acts: [{ label: 'List of partners', href: 'references.html#partneri', icon: 'arrow' }]
    },
    {
      id: 'pocetak-firme',
      k: ['1992', '1993', 'when did the company start', 'when was the company registered', 're-registered', 'who founded',
          'founder', 'family company', 'family business', 'teacher', 'professor', '1995', 'took over', 'inherited',
          'from workshop to company', 'company history'],
      q: 'From workshop to company',
      a: 'The Trivanović sheet-metal and metal fabrication workshop has been operating since <strong>1966</strong>, and in <strong>1992</strong> it was re-registered as a company and expanded into metal trading. Before that, Dragan Trivanović worked as a school teacher; in 1995 he left teaching and took over the family business. Since 2006 the company has not done installation, and in 2009 it built the production hall in Ugrinovci.',
      acts: [{ label: 'History', href: 'about.html#istorijat', icon: 'arrow' }]
    },
    {
      id: 'lager',
      k: ['stock', 'in stock', 'is it in stock', 'do you have it in stock', 'have in stock', 'availability', 'available',
          'on hand', 'inventory', 'stock levels', 'stock level', 'out of stock'],
      q: 'Stock levels',
      a: 'Stock levels change daily and I have no access to the warehouse records, so I would rather not send you for goods that are currently out of stock.<br><br>Availability is checked fastest by phone — sales will tell you straight away what is available and in which sizes.',
      acts: [
        { label: 'Call sales', href: 'tel:+381638503000', icon: 'phone' },
        { label: 'Or write to us', href: 'mailto:office@tricom.rs?subject=Stock%20check', icon: 'mail' }
      ]
    }
  ]
};
