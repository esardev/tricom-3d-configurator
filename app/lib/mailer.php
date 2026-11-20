<?php
/* TRICOM — slanje e-pošte sa servera (PHPMailer 7.1.1, LGPL, app/vendor/phpmailer).

   Podešavanje je u app/config.php, ključ 'mail' (v. config.example.php):
     transport  'mail' = PHP mail() hostinga (podrazumevano) · 'smtp' = SMTP nalog
     from       adresa pošiljaoca na domenu sajta (npr. sajt@tricom.rs); prazno = slanje isključeno
   Uspeh znači da je transport (lokalni MTA ili SMTP server) PRIHVATIO poruku sa prilogom;
   isporuka u sanduče se ne može potvrditi sa sajta. Lozinka SMTP-a ne ide u dnevnik. */
defined('TRICOM') || exit;

/** Zašto slanje nije moguće (tekst za administraciju i dnevnik) ili null kad je sve podešeno. */
function mailer_problem(): ?string
{
    foreach (['PHPMailer.php', 'SMTP.php', 'Exception.php'] as $f) {
        if (!is_file(APP_DIR . '/vendor/phpmailer/' . $f)) {
            return 'Nedostaje app/vendor/phpmailer/' . $f . ' (otpremite fasciklu app/vendor/).';
        }
    }
    $from = (string) config('mail.from', '');
    if ($from === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        return 'U app/config.php nije upisana ispravna adresa pošiljaoca (mail.from).';
    }
    $t = (string) config('mail.transport', 'mail');
    if ($t === 'mail') {
        return function_exists('mail') ? null : 'PHP funkcija mail() je isključena na hostingu — podesite mail.transport = \'smtp\'.';
    }
    if ($t !== 'smtp') {
        return 'mail.transport mora biti \'mail\' ili \'smtp\'.';
    }
    if (trim((string) config('mail.smtp_host', '')) === '') {
        return 'Za SMTP upišite mail.smtp_host (i korisnika i lozinku naloga).';
    }
    return null;
}

/**
 * Šalje jednu poruku. $m: to (adresa), reply_to [adresa, ime], subject, text,
 * attachments [[sadržaj, ime fajla, MIME tip]], message_id ('<…@…>').
 * Vraća null kad je transport prihvatio poruku, inače kratak opis greške.
 */
function mailer_send(array $m): ?string
{
    if ($p = mailer_problem()) {
        return $p;
    }
    require_once APP_DIR . '/vendor/phpmailer/Exception.php';
    require_once APP_DIR . '/vendor/phpmailer/PHPMailer.php';
    require_once APP_DIR . '/vendor/phpmailer/SMTP.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->CharSet = PHPMailer\PHPMailer\PHPMailer::CHARSET_UTF8;
        $mail->Encoding = PHPMailer\PHPMailer\PHPMailer::ENCODING_QUOTED_PRINTABLE;
        $mail->XMailer = ' ';
        $mail->Timeout = max(5, (int) config('mail.timeout', 20));
        if (config('mail.transport', 'mail') === 'smtp') {
            $mail->isSMTP();
            $mail->Host = (string) config('mail.smtp_host');
            $mail->Port = (int) config('mail.smtp_port', 587);
            $secure = (string) config('mail.smtp_secure', 'tls');
            $mail->SMTPSecure = $secure === 'ssl' ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : ($secure === 'tls' ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS : '');
            $mail->SMTPAutoTLS = $secure !== 'none';
            $user = (string) config('mail.smtp_user', '');
            if ($user !== '') {
                $mail->SMTPAuth = true;
                $mail->Username = $user;
                $mail->Password = (string) config('mail.smtp_pass', '');
            }
        } else {
            $mail->isMail();
        }
        $from = (string) config('mail.from');
        $mail->setFrom($from, (string) config('mail.from_name', 'TRICOM sajt'));
        $mail->Sender = $from;                       // povratna adresa (Return-Path)
        $mail->addAddress((string) $m['to']);
        if (!empty($m['reply_to'][0]) && PHPMailer\PHPMailer\PHPMailer::validateAddress((string) $m['reply_to'][0])) {
            $mail->addReplyTo((string) $m['reply_to'][0], (string) ($m['reply_to'][1] ?? ''));
        }
        if (!empty($m['message_id'])) {
            $mail->MessageID = (string) $m['message_id'];
        }
        $mail->Subject = (string) $m['subject'];
        $mail->isHTML(false);
        $mail->Body = (string) $m['text'];
        foreach ($m['attachments'] ?? [] as [$data, $name, $type]) {
            $mail->addStringAttachment((string) $data, (string) $name, PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64, (string) $type);
        }
        $mail->send();
        return null;
    } catch (Throwable $e) {
        $msg = $mail->ErrorInfo !== '' ? $mail->ErrorInfo : $e->getMessage();
        return mb_substr(trim(preg_replace('/\s+/', ' ', $msg) ?? ''), 0, 240) ?: 'Slanje nije uspelo.';
    }
}
