<?php
/* TRICOM — izgled PDF specifikacije (tFPDF). Učitava se tek posle
   app/vendor/tfpdf/tfpdf.php (iz quote_pdf_build() u app/lib/quote-pdf.php). */
defined('TRICOM') || exit;

final class TricomQuotePdf extends tFPDF
{
    public string $lang = 'sr';
    public string $footText = '';
    private const W = 180.0;          // širina sadržaja (A4 − 2 × 15 mm)
    private const ROW = 6.0;          // visina reda tabele, mm
    private const BLUE = [6, 80, 197];

    public function Footer(): void
    {
        $this->SetY(-14);
        $this->SetDrawColor(0, 0, 0);
        $this->SetLineWidth(0.2);
        $this->Line(15, $this->GetY(), 195, $this->GetY());
        $this->SetFont('dv', '', 7);
        $this->SetTextColor(60, 60, 60);
        $this->Cell(140, 6, $this->footText, 0, 0, 'L');
        $this->Cell(40, 6, qp_t($this->lang, 'pdf.page', ['p' => $this->PageNo(), 'n' => '{nb}']), 0, 0, 'R');
        $this->SetTextColor(0, 0, 0);
    }

    /** Ima li mesta za $h mm na strani; ako nema, nova strana. Vraća true kad je počela nova strana. */
    private function room(float $h): bool
    {
        if ($this->GetY() + $h > $this->PageBreakTrigger) {
            $this->AddPage();
            return true;
        }
        return false;
    }

    public function head(string $title, string $sub): void
    {
        $x = 15;
        $y = $this->GetY();
        $this->SetLineWidth(0.3);
        $this->RoundedRect($x, $y, self::W, 19, 3);
        $logo = SITE_DIR . '/assets/tricom-logo-web.png';
        if (is_file($logo)) {
            $this->Image($logo, $x + 4, $y + 4, 0, 11);
        }
        $this->SetXY($x + 60, $y + 3.5);
        $this->SetFont('dv', 'B', 13);
        $this->Cell(self::W - 64, 7, $title, 0, 2, 'R');
        $this->SetFont('dv', '', 8);
        $this->Cell(self::W - 64, 5, $sub, 0, 2, 'R');
        $this->SetXY($x, $y + 23);
    }

    public function section(string $title): void
    {
        $this->room(16);
        $this->Ln(3);
        $this->SetFont('dv', 'B', 10.5);
        $this->Cell(self::W, 6, $title, 0, 1, 'L');
    }

    /** Naslov stavke: kod profila (plavo, kao .k-print__code) i kratak red (.calc-print__line). */
    public function itemHead(string $code, string $line, bool $invalid): void
    {
        $this->room(40);                  // naslov se ne ostavlja sam na dnu strane
        $this->Ln(5);
        $this->SetDrawColor(0, 0, 0);
        $this->SetLineWidth(0.4);
        $this->Line(15, $this->GetY(), 195, $this->GetY());
        $this->Ln(2.5);
        $this->SetFont('dv', 'B', 11);
        $this->SetTextColor(...self::BLUE);
        $this->Cell(self::W, 6, $code, 0, 1, 'L');
        $this->SetTextColor($invalid ? 160 : 0, 0, 0);
        $this->SetFont('dv', '', 9);
        if ($line !== '') {
            $this->MultiCell(self::W, 4.6, $line, 0, 'L');
        }
        $this->SetTextColor(0, 0, 0);
    }

    private function caption(string $text, bool $cont): void
    {
        $this->SetFont('dv', 'B', 7.6);
        $this->Cell(self::W, 5, mb_strtoupper($text . ($cont ? ' ' . qp_t($this->lang, 'pdf.cont') : ''), 'UTF-8'), 0, 1, 'L');
    }

    /** Visina reda (mm) prema najdužoj ćeliji. */
    private function rowHeight(array $cells, array $widths, string $style = '', float $size = 8.2): float
    {
        $this->SetFont('dv', $style, $size);
        $lines = 1;
        foreach ($cells as $k => $c) {
            $lines = max($lines, $this->lineCount((string) $c, $widths[$k] - 3));
        }
        return max(self::ROW, $lines * 4.2 + 1.8);
    }

    /** Red tabele: ćelije sa okvirom; poravnanje po koloni; visina prema najdužoj ćeliji. */
    private function row(array $cells, array $widths, array $align, string $style = '', float $size = 8.2, bool $fill = false): void
    {
        $h = $this->rowHeight($cells, $widths, $style, $size);
        $this->SetFont('dv', $style, $size);
        $x = 15;
        $y = $this->GetY();
        foreach ($cells as $k => $c) {
            $this->SetXY($x, $y);
            if ($fill) {
                $this->SetFillColor(242, 244, 247);
            }
            $this->Rect($x, $y, $widths[$k], $h, $fill ? 'DF' : 'D');
            $this->SetXY($x + 1.5, $y + 0.9);
            $this->MultiCell($widths[$k] - 3, 4.2, (string) $c, 0, $align[$k]);
            $x += $widths[$k];
        }
        $this->SetXY(15, $y + $h);
    }

    /** Broj redova koje tekst zauzima u širini $w (za visinu reda). */
    private function lineCount(string $text, float $w): int
    {
        $n = 0;
        foreach (explode("\n", $text) as $para) {
            $words = preg_split('/ +/u', $para) ?: [''];
            $cur = '';
            $count = 1;
            foreach ($words as $word) {
                $try = $cur === '' ? $word : $cur . ' ' . $word;
                if ($this->GetStringWidth($try) > $w && $cur !== '') {
                    $count++;
                    $cur = $word;
                } else {
                    $cur = $try;
                }
            }
            $n += $count;
        }
        return max(1, $n);
    }

    /** Tabela „Stavka | Vrednost“ (kao tbl() u M.print); $head = red zaglavlja. */
    public function kvTable(string $cap, array $rows, bool $head = true): void
    {
        $w = [72, self::W - 72];
        $al = ['L', 'R'];
        $this->room(5 + self::ROW * 3);
        $this->Ln(3);
        $printHead = function (bool $cont) use ($cap, $head, $w): void {
            $this->caption($cap, $cont);
            if ($head) {
                $this->row([mb_strtoupper(qp_t($this->lang, 'calc.print.th.item'), 'UTF-8'), mb_strtoupper(qp_t($this->lang, 'calc.print.th.val'), 'UTF-8')], $w, ['L', 'R'], 'B', 6.8, true);
            }
        };
        $printHead(false);
        foreach ($rows as [$k, $v]) {
            if ($this->room($this->rowHeight([$k, $v], $w) + 0.5)) {
                $printHead(true);
            }
            $this->row([$k, $v], $w, $al);
        }
    }

    /** Razbijanje po dužinama (brkTable): # · dužina · kom · dužni m · m², sa zbirom. */
    public function brkTable(array $brk): void
    {
        $w = [12, 62, 30, 38, 38];
        $al = ['L', 'R', 'R', 'R', 'R'];
        $this->room(5 + self::ROW * 4);
        $this->Ln(3);
        $printHead = function (bool $cont) use ($brk, $w, $al): void {
            $this->caption($brk['cap'], $cont);
            $this->row(array_map(static fn($h) => mb_strtoupper($h, 'UTF-8'), $brk['head']), $w, $al, 'B', 6.8, true);
        };
        $printHead(false);
        foreach ($brk['rows'] as $r) {
            if ($this->room($this->rowHeight($r, $w) + self::ROW + 0.5)) {     // zbir ne ostaje sam na novoj strani
                $printHead(true);
            }
            $this->row($r, $w, $al);
        }
        $this->SetLineWidth(0.5);
        /* „Ukupno“ preko prve dve kolone (colspan="2" u štampi) */
        $this->row([$brk['total'][0], $brk['total'][2], $brk['total'][3], $brk['total'][4]], [$w[0] + $w[1], $w[2], $w[3], $w[4]], ['L', 'R', 'R', 'R'], 'B');
        $this->SetLineWidth(0.2);
    }

    /** Napomena sa levom linijom (.k-note); $warn = istaknuta (.k-note--warn). */
    public function note(string $label, string $text, bool $warn = false): void
    {
        $this->room(12);
        $this->Ln(3);
        $y = $this->GetY();
        $this->SetX(18);
        if ($label !== '') {
            $this->SetFont('dv', 'B', 8.2);
            $this->Write(4.4, $label);
        }
        $this->SetFont('dv', '', 8.2);
        $this->SetLeftMargin(18);
        $this->Write(4.4, $text);
        $this->SetLeftMargin(15);
        $this->Ln(5);
        $this->SetLineWidth($warn ? 0.6 : 0.4);
        $this->SetDrawColor(...($warn ? self::BLUE : [0, 0, 0]));
        $this->Line(15.5, $y, 15.5, $this->GetY() - 0.6);
        $this->SetDrawColor(0, 0, 0);
        $this->SetLineWidth(0.2);
    }

    public function small(string $text): void
    {
        $this->room(8);
        $this->Ln(1.5);
        $this->SetFont('dv', '', 7.4);
        $this->SetTextColor(60, 60, 60);
        $this->MultiCell(self::W, 3.8, $text, 0, 'L');
        $this->SetTextColor(0, 0, 0);
    }

    /** Pravougaonik sa zaobljenim uglovima (kartica zaglavlja). */
    public function RoundedRect(float $x, float $y, float $w, float $h, float $r): void
    {
        $k = $this->k;
        $hp = $this->h;
        $c = 4 / 3 * (M_SQRT2 - 1);
        $op = sprintf('%.2F %.2F m ', ($x + $r) * $k, ($hp - $y) * $k);
        $op .= sprintf('%.2F %.2F l ', ($x + $w - $r) * $k, ($hp - $y) * $k);
        $op .= $this->arc($x + $w - $r + $r * $c, $y, $x + $w, $y + $r - $r * $c, $x + $w, $y + $r);
        $op .= sprintf('%.2F %.2F l ', ($x + $w) * $k, ($hp - ($y + $h - $r)) * $k);
        $op .= $this->arc($x + $w, $y + $h - $r + $r * $c, $x + $w - $r + $r * $c, $y + $h, $x + $w - $r, $y + $h);
        $op .= sprintf('%.2F %.2F l ', ($x + $r) * $k, ($hp - ($y + $h)) * $k);
        $op .= $this->arc($x + $r - $r * $c, $y + $h, $x, $y + $h - $r + $r * $c, $x, $y + $h - $r);
        $op .= sprintf('%.2F %.2F l ', $x * $k, ($hp - ($y + $r)) * $k);
        $op .= $this->arc($x, $y + $r - $r * $c, $x + $r - $r * $c, $y, $x + $r, $y);
        $this->_out($op . 'S');
    }

    private function arc(float $x1, float $y1, float $x2, float $y2, float $x3, float $y3): string
    {
        $h = $this->h;
        $k = $this->k;
        return sprintf('%.2F %.2F %.2F %.2F %.2F %.2F c ', $x1 * $k, ($h - $y1) * $k, $x2 * $k, ($h - $y2) * $k, $x3 * $k, ($h - $y3) * $k);
    }
}
