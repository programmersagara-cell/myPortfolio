<?php
/**
 * Secure contact endpoint (XAMPP-compatible).
 * CSRF token + honeypot + rate limiting + input validation/sanitization.
 * Messages are appended to a log file; wire up mail() as needed.
 */
declare(strict_types=1);

session_name('jms_contact');
session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict',
]);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
function token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

/* --- Token request --- */
if (($_GET['action'] ?? '') === 'token') {
    respond(['token' => token()]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

/* --- Rate limiting: max 5 messages per 10 minutes per session/IP --- */
$now = time();
$_SESSION['hits'] = array_values(array_filter($_SESSION['hits'] ?? [], fn($t) => $now - $t < 600));
if (count($_SESSION['hits']) >= 5) {
    respond(['error' => 'Too many messages. Please wait a few minutes.'], 429);
}

/* --- Honeypot: bots fill hidden field --- */
if (!empty($_POST['website'] ?? '')) {
    $_SESSION['hits'][] = $now;
    respond(['ok' => true]); // pretend success
}

/* --- CSRF check --- */
$token = $_POST['csrf_token'] ?? '';
if (!$token || !hash_equals(token(), $token)) {
    respond(['error' => 'Invalid or expired form token. Please reload the page.', 'csrf_token' => token()], 403);
}

/* --- Validation & sanitization --- */
$name    = trim(mb_substr((string)($_POST['name'] ?? ''), 0, 100));
$email   = trim(mb_substr((string)($_POST['email'] ?? ''), 0, 200));
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));

$errors = [];
if (mb_strlen($name) < 2 || mb_strlen($name) > 100) $errors[] = 'Name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 200) $errors[] = 'Email';
if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) $errors[] = 'Message';
// Header-injection guard
foreach ([$name, $email] as $f) { if (preg_match('/[\r\n]/', $f)) $errors[] = 'Input'; }
if ($errors) {
    $_SESSION['hits'][] = $now;
    respond(['error' => 'Invalid input in: ' . implode(', ', array_unique($errors)), 'csrf_token' => token()], 422);
}

/* --- Store safely (no secrets in code; adjust path outside webroot ideally) --- */
$logLine = sprintf(
    "[%s] name=%s | email=%s | msg=%s%s",
    date('c'),
    str_replace(["\r", "\n"], ' ', $name),
    $email,
    str_replace(["\r", "\n"], ' ', $message),
    PHP_EOL
);
@file_put_contents(__DIR__ . '/private_messages.log', $logLine, FILE_APPEND | LOCK_EX);

/*
 * To actually receive email on XAMPP, configure sendmail in php.ini and uncomment:
 * mail('[Add Email]', 'Portfolio contact from ' . $name, $message,
 *      'From: no-reply@localhost' . "\r\n" . 'Reply-To: ' . $email);
 */

$_SESSION['hits'][] = $now;
respond(['ok' => true, 'message' => 'Message received.']);
