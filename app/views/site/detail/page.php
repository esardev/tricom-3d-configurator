<?php defined('TRICOM') || exit; ?>
<?php
/* Strana detalja proizvoda, usluge ili mogućnosti plazme (/detalji/<slug>.html, /en/details/<slug>.html).
   Isti markup kao strane koje je ranije pravio generator iz js/items.js.
   Ulaz: $d (site_detail_model), $L, $navCats, $V, $SITE.
   Zaglavlje, meni, futer i skripte su u {sr,en}-{head,top,bottom,tail}.php. */
$lab = $d['lab'];
$x = $d['x'];
$R = $d['R'];
$secs = 4 + ($d['calc'] ? 1 : 0) - ($d['rel'] ? 0 : 1);
$n = 0;
$num = static function () use (&$n, $secs): string { $n++; return sprintf('%02d / %02d', $n, $secs); };
$dataNum = static function () use (&$n): string { return sprintf('%02d', $n + 1); };
$calcBtn = $d['calc'] ? '<a class="btn btn--ghost" href="#kalkulator">' . e($lab['calculate']) . '</a>' : '';
$inquiry = '<a class="btn" href="' . e($d['inquiry']) . '">' . e($lab['inquiry']) . ' ' . SITE_ARROW . '</a>';
?>
<!DOCTYPE html>
<html lang="<?= $L === 'en' ? 'en' : 'sr' ?>" data-root="<?= $R ?>" data-base="../"<?= $d['sitePath'] ?>>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title><?= e($d['title']) ?> | TRICOM</title>
<meta name="description" content="<?= e($d['sum']) ?>">
<meta name="theme-color" content="#EEF1F5">
<meta name="author" content="TRICOM d.o.o.">
<link rel="canonical" href="<?= e($d['url']) ?>">
<link rel="alternate" hreflang="sr" href="<?= e($d['urlSr']) ?>">
<link rel="alternate" hreflang="en" href="<?= e($d['urlEn']) ?>">
<link rel="alternate" hreflang="x-default" href="<?= e($d['urlSr']) ?>">

<meta property="og:type" content="website">
<meta property="og:site_name" content="TRICOM d.o.o.">
<meta property="og:locale" content="<?= e($lab['locale']) ?>">
<meta property="og:title" content="<?= e($d['title']) ?> | TRICOM">
<meta property="og:description" content="<?= e($d['sum']) ?>">
<meta property="og:url" content="<?= e($d['url']) ?>">
<meta property="og:image" content="<?= e($d['og']) ?>">
<meta property="og:image:alt" content="<?= e($d['title']) ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= e($d['og']) ?>">

<?php require __DIR__ . '/' . $L . '-head.php'; ?>
<script type="application/ld+json">
<?= $d['breadcrumb'] ?>

</script>
<script type="application/ld+json">
<?= $d['schema'] ?>

</script>
</head>
<body class="ph-2">
<?php require __DIR__ . '/' . $L . '-top.php'; ?>
<section class="pagehead pagehead--2 pagehead--item tex-grid">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__horizon" aria-hidden="true"></div>
  <div class="pagehead__ghost" aria-hidden="true"><span data-parallax="0.2"><?= e($lab['ghost']) ?></span></div>
  <div class="wrap u-rel">
    <nav class="crumbs" aria-label="<?= e($lab['crumbs']) ?>"><a href="../index.html"><?= e($lab['home']) ?></a><span class="sep" aria-hidden="true">/</span><a href="<?= e($d['parentHref']) ?>"><?= e($d['parent']) ?></a><span class="sep" aria-hidden="true">/</span><span aria-current="page"><?= e($d['title']) ?></span></nav>
    <div class="split split--60 ditem-head">
      <div>
        <p class="marker"><?= e($lab['marker']) ?></p>
        <h1><?= e($d['title']) ?></h1>
        <p class="lead"><?= e($d['sum']) ?></p>
<?php if ($x['tags']): ?>
        <ul class="pill-row u-mt-24"><?php foreach ($x['tags'] as $tag): ?><li class="pill"><?= e($tag) ?></li><?php endforeach; ?></ul>
<?php endif; ?>
        <div class="u-acts u-mt-32"><?= $inquiry ?><?= $calcBtn ?><?php if ((string) $d['p']['konf_hash'] !== ''): ?><a class="btn btn--ghost" href="<?= e('../' . $lab['konfPage'] . '#' . $d['p']['konf_hash']) ?>"><?= e($lab['see3d']) ?></a><?php endif; ?></div>
      </div>
    </div>
  </div>
<?php if ($d['hero'] !== ''): ?>
  <div class="pagehead__media shape-b ditem-hero"><?= $d['hero'] ?></div>
<?php endif; ?>
</section>
<main id="main">
<section class="section--tight ditem-sec" data-num="<?= $dataNum() ?>" data-rail-label="<?= e($lab['desc']) ?>">
  <div class="wrap">
    <p class="sectionix"><?= $num() ?></p>
    <div class="split split--60 u-start">
      <div class="prose">
        <p class="marker"><?= e($lab['desc']) ?></p>
<?php foreach ($x['desc'] as $para): ?>
        <p><?= e($para) ?></p>
<?php endforeach; ?>
        <p class="u-sm muted"><?= e($lab['note']) ?></p>
      </div>
      <div>
<?php if ($x['specs']): ?>
        <h2 class="ditem-h"><?= e($lab['tech']) ?></h2>
        <div class="tbl-glass"><div class="spec-wrap"><table class="spec"><caption class="mono muted spec__cap"><?= e($lab['caption']) ?></caption><thead><tr><th scope="col" class="spec__no">#</th><th scope="col"><?= e($lab['thItem']) ?></th><th scope="col"><?= e($lab['thValue']) ?></th></tr></thead><tbody><?php foreach ($x['specs'] as $i => $s): ?><tr><td class="spec__no"><?= sprintf('%02d', $i + 1) ?></td><th scope="row"><?= e_lines($s[0]) ?></th><td><?= e_lines($s[1]) ?></td></tr><?php endforeach; ?></tbody></table></div></div>
<?php endif; ?>
      </div>
    </div>
  </div>
</section>
<section class="section soft ditem-sec" data-num="<?= $dataNum() ?>" data-rail-label="<?= e($lab['apps']) ?>">
  <div class="wrap">
    <p class="sectionix"><?= $num() ?></p>
    <div class="split split--60 u-start">
      <div>
        <p class="marker"><?= e($lab['apps']) ?></p>
        <h2 data-reveal="cut"><?= e($lab['appsH']) ?></h2>
<?php if ($x['apps']): ?>
        <ul class="checklist u-mt-32"><?php foreach ($x['apps'] as $a): ?><li><?= e($a) ?></li><?php endforeach; ?></ul>
<?php endif; ?>
      </div>
      <div>
<?php if ($d['side'] !== ''): ?>
        <?= $d['side'] ?>

<?php endif; ?>
      </div>
    </div>
  </div>
</section>
<?php if ($d['calc']): ?>
<section class="section ditem-sec" id="kalkulator" data-num="<?= $dataNum() ?>" data-rail-label="<?= e($lab['calc']) ?>">
  <div class="wrap">
    <p class="sectionix"><?= $num() ?></p>
    <div class="shead">
      <div>
        <p class="marker"><?= e($lab['calc']) ?></p>
        <h2 data-reveal="cut"><?= e($lab['calcH']) ?></h2>
      </div>
      <div class="shead__aside">
        <p><?= e($lab['calcP']) ?></p>
        <a class="link-kerf u-mt-16" href="<?= e('../' . $lab['calcPage'] . '#' . $d['p']['calc_id']) ?>"><?= e($lab['allCalc']) ?> <?= SITE_ARROW ?></a>
      </div>
    </div>
    <div class="calc-embed" data-calc-mount data-calc="<?= e($d['p']['calc_id']) ?>" data-calc-tabs="<?= e((string) $d['p']['calc_tabs']) ?>"></div>
  </div>
</section>
<?php endif; ?>
<?php if ($d['rel']): ?>
<section class="section soft ditem-sec" data-num="<?= $dataNum() ?>" data-rail-label="<?= e($lab['rel']) ?>">
  <div class="wrap">
    <p class="sectionix"><?= $num() ?></p>
    <p class="marker"><?= e($lab['rel']) ?></p>
    <h2 class="u-mb-32" data-reveal="cut"><?= e($lab['relH']) ?></h2>
    <div class="grid g3">
<?php foreach ($d['rel'] as $it): ?>
      <?= site_rel_card($it, $L, $R, $d['heroKey']) ?>

<?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>
<section class="section section--tight ditem-sec" data-num="<?= $dataNum() ?>">
  <div class="wrap">
    <p class="sectionix"><?= $num() ?></p>
    <div class="g-card g-card--solid ditem-cta">
      <div>
        <h2 class="ditem-h"><?= e($lab['ctaH']) ?></h2>
        <p class="muted u-mt-16"><?= e($lab['ctaP']) ?></p>
      </div>
      <div class="u-acts">
        <?= $inquiry ?>

<?php if ($d['calc']): ?>
        <?= $calcBtn ?>

<?php endif; ?>
        <a class="btn btn--ghost" href="<?= e($d['parentHref']) ?>"><?= e($lab['back']) ?></a>
      </div>
    </div>
  </div>
</section>
</main>
<?php require __DIR__ . '/' . $L . '-bottom.php'; ?>
<script data-items-inline>/* podskup stavki za ovu stranu (iz baze) */(function(w){var A=<?= $d['inline'] ?>,B={};A.forEach(function(x){B[x.slug]=x});w.TRICOM_ITEMS={list:A,illu:<?= $d['inlineIllu'] ?>,get:function(s){return B[s]||null},hasPage:function(x){return!!x&&(x.kind==="product"||x.kind==="service"||x.kind==="capability")}};})(window);</script>
<?php $scriptList = $d['scriptList']; require __DIR__ . '/' . $L . '-tail.php'; ?>
</body>
</html>
