<?php
/** Admin authentication: login / logout / status / change password. */
declare(strict_types=1);
require __DIR__ . '/common.php';

$action = $_GET['action'] ?? '';

if ($action === 'status') {
    $a = admin_data();
    json_out(['ok' => true, 'logged_in' => admin_logged_in(), 'is_default_password' => !empty($a['is_default']), 'csrf_token' => csrf_token()]);
}

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $user = trim((string)($_POST['username'] ?? ''));
    $pass = (string)($_POST['password'] ?? '');
    if (admin_login($user, $pass)) {
        json_out(['ok' => true, 'csrf_token' => csrf_token()]);
    }
    audit('login_failed');
    usleep(400000); // slow brute force
    fail('Invalid username or password.', 401);
}

if ($action === 'logout') {
    audit('logout');
    $_SESSION = [];
    session_destroy();
    json_out(['ok' => true]);
}

if ($action === 'change_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    check_csrf();
    $current = (string)($_POST['current'] ?? '');
    $new = (string)($_POST['new'] ?? '');
    if (!password_verify($current, admin_data()['hash'])) fail('Current password is incorrect.', 403);
    if (strlen($new) < 10) fail('New password must be at least 10 characters.');
    $a = admin_data();
    $a['hash'] = password_hash($new, PASSWORD_BCRYPT, ['cost' => 12]);
    $a['is_default'] = false;
    write_json(ADMIN_FILE, $a);
    audit('password_changed');
    json_out(['ok' => true]);
}

fail('Unknown action.', 404);
