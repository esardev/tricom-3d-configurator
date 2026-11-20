<?php
/* TRICOM — jednokratne poruke posle preusmerenja (Post/Redirect/Get). */
defined('TRICOM') || exit;

const FLASH_TYPES = ['success', 'error', 'warning', 'info'];

function flash(string $type, string $message): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }
    $_SESSION['_flash'][] = ['type' => in_array($type, FLASH_TYPES, true) ? $type : 'info', 'message' => $message];
}

/** Vraća i briše sve poruke. @return list<array{type: string, message: string}> */
function flash_pull(): array
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return [];
    }
    $messages = $_SESSION['_flash'] ?? [];
    unset($_SESSION['_flash']);
    return is_array($messages) ? $messages : [];
}
