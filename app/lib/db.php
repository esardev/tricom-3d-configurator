<?php
/* TRICOM — PDO (MySQL, utf8mb4, pravi pripremljeni upiti).
   Veza se otvara pri prvom db() pozivu; neuspeh → AppUnavailableException
   (503, detalji samo u dnevniku). Svi upiti idu kroz db_run() sa parametrima. */
defined('TRICOM') || exit;

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $c = config('db');
    $dsn = 'mysql:host=' . $c['host'] . ';port=' . (int) $c['port'] . ';dbname=' . $c['name'] . ';charset=utf8mb4';
    try {
        $pdo = new PDO($dsn, (string) $c['user'], (string) $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_STRINGIFY_FETCHES  => false,
            PDO::ATTR_TIMEOUT            => 5,
        ]);
        $pdo->exec('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
        /* vreme u bazi = vreme PHP-a (DATETIME kolone, ograničenje prijave) */
        $pdo->exec('SET time_zone = ' . $pdo->quote(date('P')));
    } catch (PDOException $e) {
        $pdo = null;
        throw new AppUnavailableException('Veza sa bazom nije uspela (SQLSTATE ' . $e->getCode() . ').', 0, $e);
    }
    return $pdo;
}

/** Izvršava pripremljeni upit; celi brojevi, null i bool se vezuju sa svojim tipom. */
function db_run(string $sql, array $params = []): PDOStatement
{
    $stmt = db()->prepare($sql);
    foreach ($params as $key => $value) {
        $type = match (true) {
            is_int($value)  => PDO::PARAM_INT,
            is_bool($value) => PDO::PARAM_INT,
            $value === null => PDO::PARAM_NULL,
            default         => PDO::PARAM_STR,
        };
        if (is_bool($value)) {
            $value = (int) $value;
        }
        $stmt->bindValue(is_int($key) ? $key + 1 : ':' . ltrim((string) $key, ':'), $value, $type);
    }
    $stmt->execute();
    return $stmt;
}

function db_all(string $sql, array $params = []): array
{
    return db_run($sql, $params)->fetchAll();
}

function db_one(string $sql, array $params = []): ?array
{
    $row = db_run($sql, $params)->fetch();
    return $row === false ? null : $row;
}

function db_value(string $sql, array $params = []): mixed
{
    $value = db_run($sql, $params)->fetchColumn();
    return $value === false ? null : $value;
}

/** Ime tabele/kolone sa navodnicima; dozvoljena samo mala slova, brojevi i _. */
function db_ident(string $name): string
{
    if (!preg_match('/^[a-z_][a-z0-9_]{0,63}$/', $name)) {
        throw new InvalidArgumentException('Neispravan SQL identifikator.');
    }
    return '`' . $name . '`';
}

/** INSERT iz asocijativnog niza; vraća novi id. */
function db_insert(string $table, array $data): int
{
    $cols = array_map('db_ident', array_keys($data));
    $sql = 'INSERT INTO ' . db_ident($table) . ' (' . implode(', ', $cols) . ') VALUES (' . implode(', ', array_fill(0, count($data), '?')) . ')';
    db_run($sql, array_values($data));
    return (int) db()->lastInsertId();
}

/** UPDATE iz asocijativnog niza; $where sa pozicionim parametrima (?). Vraća broj izmenjenih redova. */
function db_update(string $table, array $data, string $where, array $whereParams = []): int
{
    $set = implode(', ', array_map(static fn($c) => db_ident($c) . ' = ?', array_keys($data)));
    $sql = 'UPDATE ' . db_ident($table) . ' SET ' . $set . ' WHERE ' . $where;
    return db_run($sql, array_merge(array_values($data), array_values($whereParams)))->rowCount();
}

/** Izvršava $fn u transakciji; izuzetak poništava sve izmene. */
function db_transaction(callable $fn): mixed
{
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $result = $fn($pdo);
        $pdo->commit();
        return $result;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function db_table_exists(string $table): bool
{
    return (bool) db_value(
        'SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? LIMIT 1',
        [$table]
    );
}

function db_column_exists(string $table, string $column): bool
{
    return (bool) db_value(
        'SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1',
        [$table, $column]
    );
}

/** Da li su SQL fajlovi uvezeni (tabela schema_imports). */
function db_import_done(string $key): bool
{
    if (!db_table_exists('schema_imports')) {
        return false;
    }
    return (bool) db_value('SELECT 1 FROM `schema_imports` WHERE `import_key` = ?', [$key]);
}
