<?php defined('TRICOM') || exit; ?>
<link rel="icon" href="../../assets/favicon.svg?v=<?= $V ?>" type="image/svg+xml">
<link rel="apple-touch-icon" href="../../assets/tricom-logo.png?v=<?= $V ?>">

<script>
/* Fontovi (Archivo, IBM Plex — OFL, assets/fonts): preko http(s) sa sopstvenog servera
   (css/fonts.css); preko file:// pregledač ne pušta lokalne
   fontove (CORS), pa se tada uzimaju sa Google Fonts. Preload samo za font naslova
   (Archivo); ostali stižu sa font-display: swap (rezerve podešene veličine u base.css). */
(function(d,R){var h=d.head,f=location.protocol==='file:';function l(a){var e=d.createElement('link');for(var k in a)e.setAttribute(k,a[k]);h.appendChild(e);return e}if(!f&&!/\bGecko\/\d/.test(navigator.userAgent))['archivo-latin-79dc5e'].forEach(function(x){l({rel:'preload',as:'font',type:'font/woff2',crossorigin:'',href:R+'assets/fonts/'+x+'.woff2?v=<?= $V ?>'})});l({rel:'stylesheet',href:f?'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap':R+'css/fonts.css?v=<?= $V ?>'})})(document,'../../');
</script>
<noscript><link rel="stylesheet" href="../../css/fonts.css?v=<?= $V ?>"></noscript>

<script>
/* Tema bez bleska: svetla je podrazumevana za sve posetioce; tamna samo ako je
   posetilac izabere prekidačem — i to samo za tekuću sesiju kartice
   (sessionStorage['tricom-theme'] === 'dark'); nova poseta počinje svetlo.
   Sistemska postavka se namerno ne prati (v. README, „Tema“). Sadržaj se crta
   odmah: fontovi su font-display: swap sa rezervama podešene veličine (base.css). */
(function(d){var r=d.documentElement,t;try{t=sessionStorage.getItem('tricom-theme');localStorage.removeItem('tricom-theme')}catch(e){}t=t==='dark'?'dark':'light';r.setAttribute('data-theme',t);var m=d.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0A0D12':'#EEF1F5')})(document);
</script>

<link rel="stylesheet" href="../../css/base.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/layout.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/components.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/widgets.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/pages.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/motion.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/glass.css?v=<?= $V ?>">
<link rel="stylesheet" href="../../css/modal.css?v=<?= $V ?>">
<?php if ($d['calc']): ?>
<link rel="stylesheet" href="../../css/kalkulator.css?v=<?= $V ?>">
<?php endif; ?>
<link rel="stylesheet" href="../../css/print.css?v=<?= $V ?>" media="print">

