<?php
/* TRICOM — PDF specifikacija upita iz kalkulatora (prilog e-poruke prodaji).

   Sadržaj je isti kao štampa kalkulatora (app/lib/quote-print.php ← js/calc-ui.js
   M.print), za sve stavke upita, uz podatke kupca i njegovu poruku. Izgled prati
   css/print.css (.k-print): kartica zaglavlja sa logotipom, kod profila, kratak
   red, tabele „Ulazni podaci“ / razbijanje po dužinama / „Rezultat“, napomena za
   proizvodnju, upozorenje i adresa proračuna. Cene se ne prikazuju (kao u štampi).

   Biblioteka: tFPDF 1.34 (LGPL, app/vendor/tfpdf) — čist PHP, bez proširenja osim
   mbstring i zlib; font DejaVu Sans Condensed (srpska latinica, ugrađuje se samo
   podskup znakova). Tabele prelaze na sledeću stranu sa ponovljenim zaglavljem. */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/quote-print.php';

if (!defined('FPDF_FONTPATH')) {
    define('FPDF_FONTPATH', APP_DIR . '/vendor/tfpdf/font/');
}

/** Da li je biblioteka za PDF na serveru (otpremljen app/vendor/tfpdf). */
function quote_pdf_available(): bool
{
    return is_file(APP_DIR . '/vendor/tfpdf/tfpdf.php')
        && is_file(FPDF_FONTPATH . 'unifont/ttfonts.php')
        && is_file(FPDF_FONTPATH . 'unifont/DejaVuSansCondensed.ttf')
        && is_file(FPDF_FONTPATH . 'unifont/DejaVuSansCondensed-Bold.ttf');
}

/**
 * tFPDF pri prvoj upotrebi fonta upisuje keš metrike (font/unifont/*.mtx.php, *.cw.dat,
 * *.cw127.php) sa APSOLUTNOM putanjom do .ttf fajla. Ako je sajt premešten (ili je keš
 * slučajno otpremljen sa drugog računara), putanja ne postoji i PDF ne bi nastao — takav
 * keš se briše, pa ga tFPDF pravi ponovo (ili radi bez njega ako fascikla nije upisiva).
 */
function quote_pdf_font_cache_check(): void
{
    foreach (glob(FPDF_FONTPATH . 'unifont/*.mtx.php') ?: [] as $mtx) {
        $src = (string) @file_get_contents($mtx);
        if (preg_match("/\\\$ttffile='([^']*)'/", $src, $m) && is_file($m[1])) {
            continue;
        }
        $base = substr($mtx, 0, -strlen('.mtx.php'));
        foreach (['.mtx.php', '.cw.dat', '.cw127.php'] as $ext) {
            @unlink($base . $ext);
        }
    }
}

/**
 * PDF za upit (red iz tabele inquiries). Vraća sadržaj PDF fajla.
 * Datum u zaglavlju je datum prijema upita (isti PDF i pri ponovnom slanju).
 */
function quote_pdf_build(array $inq): string
{
    require_once APP_DIR . '/vendor/tfpdf/tfpdf.php';
    require_once APP_DIR . '/lib/quote-pdf-doc.php';
    quote_pdf_font_cache_check();
    $L = ($inq['lang'] ?? 'sr') === 'en' ? 'en' : 'sr';
    $ts = (int) strtotime((string) $inq['created_at']);
    $date = $L === 'en' ? date('d/m/Y', $ts) : date('j. n. Y.', $ts);

    $pdf = new TricomQuotePdf('P', 'mm', 'A4');
    $pdf->lang = $L;
    $pdf->footText = qp_t($L, 'calc.print.foot');
    $pdf->SetTitle(qp_t($L, 'pdf.title', ['ref' => $inq['ref_code']]), true);
    $pdf->SetAuthor('TRICOM d.o.o.', true);
    $pdf->SetCreator('tricom.rs', true);
    $pdf->AddFont('dv', '', 'DejaVuSansCondensed.ttf', true);
    $pdf->AddFont('dv', 'B', 'DejaVuSansCondensed-Bold.ttf', true);
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(true, 20);
    $pdf->AliasNbPages('{nb}');
    $pdf->AddPage();

    /* zaglavlje (kartica): logotip levo, naslov i datum desno */
    $pdf->head(qp_t($L, 'pdf.title', ['ref' => $inq['ref_code']]), qp_t($L, 'pdf.sub', ['date' => $date]));

    /* podaci kupca */
    $topic = (string) $inq['topic'];
    if ($L === 'en' && isset(QP_TOPICS_EN[$topic])) {
        $topic = QP_TOPICS_EN[$topic];
    }
    $pdf->kvTable(qp_t($L, 'pdf.customer'), [
        [qp_t($L, 'pdf.ref'), (string) $inq['ref_code']],
        [qp_t($L, 'pdf.date'), $date],
        [qp_t($L, 'pdf.name'), (string) $inq['name']],
        [qp_t($L, 'pdf.email'), (string) $inq['email']],
        [qp_t($L, 'pdf.tel'), (string) $inq['phone'] !== '' ? (string) $inq['phone'] : qp_t($L, 'pdf.none')],
        [qp_t($L, 'pdf.topic'), $topic !== '' ? $topic : qp_t($L, 'pdf.none')],
    ], false);

    /* stavke — kao M.print, jedna za drugom */
    $items = qp_items((string) $inq['config_refs'], $L);
    foreach ($items as $i => $it) {
        $pdf->itemHead(qp_t($L, 'pdf.item', ['i' => $i + 1]) . ' · ' . $it['code'], $it['line'], $it['invalid']);
        if ($it['inputs']) {
            $pdf->kvTable(qp_t($L, 'calc.print.inputs'), $it['inputs']);
        }
        if ($it['brk']) {
            $pdf->brkTable($it['brk']);
        }
        if ($it['results']) {
            $pdf->kvTable(qp_t($L, 'calc.print.results'), $it['results']);
        }
        if ($it['note'] !== '') {
            $pdf->note(qp_t($L, 'calc.print.note') . ': ', $it['note']);
        }
        if ($it['url'] !== '') {
            $pdf->small($it['url']);
        }
    }
    if ($items) {
        $pdf->note('', qp_t($L, 'disclaimer'), true);
    }

    /* poruka kupca (može preći na više strana) */
    if (trim((string) $inq['message']) !== '') {
        $pdf->section(qp_t($L, 'pdf.message'));
        $pdf->SetFont('dv', '', 9);
        $pdf->MultiCell(0, 4.4, (string) $inq['message'], 0, 'L');
    }
    return $pdf->Output('S');
}
