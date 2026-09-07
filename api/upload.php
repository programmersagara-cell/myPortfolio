<?php
/** Secure image upload for project screenshots (admin only). */
declare(strict_types=1);
require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('POST only.');
require_admin();
check_csrf();

if (empty($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) fail('No file received.');
$f = $_FILES['image'];

if ($f['error'] !== UPLOAD_ERR_OK) fail('Upload error code ' . $f['error']);
if ($f['size'] > 3 * 1024 * 1024) fail('File too large. Max 3 MB.');

// Real MIME check — extension alone is never trusted
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$info = @getimagesize($f['tmp_name']);
if (!$info || !isset($allowed[$info['mime']])) fail('Only JPG, PNG or WebP images allowed.');

if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0775, true);

$name = date('Ymd') . '-' . bin2hex(random_bytes(8)) . '.' . $allowed[$info['mime']];
$dest = UPLOAD_DIR . '/' . $name;

if (!move_uploaded_file($f['tmp_name'], $dest)) fail('Could not save file.');
@chmod($dest, 0644);
audit('upload_' . $name);
json_out(['ok' => true, 'url' => UPLOAD_URL . '/' . $name]);
