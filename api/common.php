<?php
/**
 * Shared bootstrap for portfolio admin/API.
 * Storage: JSON files in /storage (web access denied via .htaccess).
 */
declare(strict_types=1);

define('PORT_ROOT', dirname(__DIR__));
define('STORAGE', PORT_ROOT . '/storage');
define('CONTENT_FILE', STORAGE . '/content.json');
define('ADMIN_FILE', STORAGE . '/admin.json');
define('UPLOAD_DIR', PORT_ROOT . '/assets/img/uploads');
define('UPLOAD_URL', 'assets/img/uploads');

/* ---------- Session ---------- */
if (session_status() === PHP_SESSION_NONE) {
    session_name('jms_admin');
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
        'cookie_path' => '/',
    ]);
}
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function json_out(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
function fail(string $msg, int $code = 400): void {
    json_out(['ok' => false, 'error' => $msg], $code);
}

/* ---------- Storage helpers ---------- */
function read_json(string $file, array $default = []): array {
    if (!is_file($file)) return $default;
    $raw = file_get_contents($file);
    $d = json_decode($raw ?: '', true);
    return is_array($d) ? $d : $default;
}
function write_json(string $file, array $data): bool {
    if (!is_dir(dirname($file))) mkdir(dirname($file), 0775, true);
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

/* ---------- Admin account ---------- */
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'ChangeMe2026!';

function admin_data(): array {
    $a = read_json(ADMIN_FILE);
    if (empty($a['hash'])) {
        // First run: create default account (must change password after login)
        $a = [
            'user' => DEFAULT_ADMIN_USER,
            'hash' => password_hash(DEFAULT_ADMIN_PASS, PASSWORD_BCRYPT, ['cost' => 12]),
            'is_default' => true,
            'created' => date('c'),
        ];
        write_json(ADMIN_FILE, $a);
    }
    return $a;
}
function admin_login(string $user, string $pass): bool {
    $a = admin_data();
    // Rate limiting: 5 attempts / 10 minutes
    $now = time();
    $_SESSION['login_hits'] = array_values(array_filter($_SESSION['login_hits'] ?? [], fn($t) => $now - $t < 600));
    if (count($_SESSION['login_hits']) >= 5) { usleep(500000); return false; }
    $_SESSION['login_hits'][] = $now;
    if (!hash_equals($a['user'], $user) || !password_verify($pass, $a['hash'])) return false;
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['admin_user'] = $a['user'];
    unset($_SESSION['login_hits']);
    audit('login_success');
    return true;
}
function admin_logged_in(): bool { return !empty($_SESSION['admin']); }
function require_admin(): void { if (!admin_logged_in()) fail('Unauthorized. Please log in.', 401); }

/* ---------- CSRF ---------- */
function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function check_csrf(): void {
    $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf_token'] ?? '');
    if (!$t || !hash_equals(csrf_token(), $t)) fail('Invalid CSRF token. Reload the page.', 403);
}

/* ---------- Audit log ---------- */
function audit(string $event): void {
    @file_put_contents(STORAGE . '/audit.log', sprintf("[%s] %s %s %s\n", date('c'), $event, $_SERVER['REMOTE_ADDR'] ?? '-', $_SESSION['admin_user'] ?? 'guest'), FILE_APPEND | LOCK_EX);
}
