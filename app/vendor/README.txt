TRICOM — biblioteke trećih strana (krug 10: upit iz kalkulatora e-poštom sa PDF-om)

Fascikla se otprema na server cela (FTP / File Manager), kao i ostatak app/.
Composer nije potreban. app/.htaccess zatvara celu fasciklu za pristup sa weba.

1) tFPDF 1.34 (2026-10-11), zasnovan na FPDF 1.85 — licenca LGPL
   Izvor: http://www.fpdf.org/en/script/script92.php (paket tfpdf.zip)
   Fajlovi: tfpdf/tfpdf.php, tfpdf/font/unifont/ttfonts.php, tfpdf/info.htm
   Font: DejaVu Sans Condensed i Condensed Bold (iz istog paketa; licenca u
   tfpdf/font/unifont/DejaVu_LICENSE.txt) — srpska latinica i ćirilica.
   Pri prvom PDF-u biblioteka u tfpdf/font/unifont/ upisuje keš metrike fonta
   (*.mtx.php, *.cw.dat, *.cw127.php) sa putanjom sa servera. Ti fajlovi se NE
   otpremaju sa drugog računara; ako fascikla nije upisiva, PDF radi i bez keša
   (malo sporije). Neispravan keš app/lib/quote-pdf.php briše sam.
   SHA-256:
     27ba5742ccf1532bbb537d2eef66b159743edb91f1bd0095c3819950eb936f9f  tfpdf.php
     a0049222d637f0aa1aab10af99895f1dd59ffb4bd31d5184bb6f9e9cd2973b5c  font/unifont/ttfonts.php
     8550cd5ca1acb65a8fc7877c46939cd0b4d909f8e7bc1e24716873d918c5e549  font/unifont/DejaVuSansCondensed.ttf
     38098d0b8edd8430a0f53fb2831b5d36037563a998a620d3c87a4d7591766d20  font/unifont/DejaVuSansCondensed-Bold.ttf

2) PHPMailer 7.1.1 (2026-05-18) — licenca LGPL 2.1 (phpmailer/LICENSE)
   Izvor: https://github.com/PHPMailer/PHPMailer/releases/tag/v7.1.1
   (arhiva v7.1.1.zip, SHA-256 c45a1ad58cb835921827b9ec2e86a55f5abdbdb6b17345fd1ab55a7dfd31119f)
   Fajlovi: phpmailer/PHPMailer.php, SMTP.php, Exception.php (iz src/), LICENSE, VERSION
   SHA-256:
     45599a196ae7944ee2dcd4f3d3da0ac4243513d346b2d77bbd15dbd0c37f7064  PHPMailer.php
     522bcf0d07be7e7e00114711db5c9ce2b4d59ac041c5ec36eaadd979d5fa7046  SMTP.php
     22ab858ae438d98f58f41f38ad2191d1b0d59570aebea0463a7948cfae1021b7  Exception.php

Potrebno na hostingu: PHP 8.1+ sa proširenjima mbstring i zlib (standardno);
za SMTP sa šifrovanjem i openssl. Ništa se ne instalira niti pokreće na serveru.
