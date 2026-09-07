<?php
/** Serves content overrides to the public site (as JS) and saves admin edits. */
declare(strict_types=1);
require __DIR__ . '/common.php';

/* ---------- Serve as JS: window.CONTENT_OVERRIDES = {...} ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['format'] ?? '') !== 'json') {
    header('Content-Type: application/javascript; charset=utf-8');
    $c = read_json(CONTENT_FILE);
    echo 'window.CONTENT_OVERRIDES = ' . json_encode($c, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ';';
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(['ok' => true, 'content' => read_json(CONTENT_FILE)]);
}

/* ---------- Save (admin only) ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!admin_logged_in()) fail('Unauthorized.', 401);
    check_csrf();
    $body = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($body)) fail('Invalid JSON body.');
    if (!isset($body['section']) || !isset($body['data']) || !is_array($body['data'])) fail('Missing section/data.');

    $c = read_json(CONTENT_FILE);
    $allowed = ['stats', 'contact', 'about', 'projects', 'timeline', 'certifications'];
    $section = $body['section'];
    if (!in_array($section, $allowed, true)) fail('Unknown section.');

    // Light sanitization: strings only, enforce types
    $data = sanitize_section($section, $body['data']);
    if ($data === null) fail('Invalid data for section.');

    if (in_array($section, ['projects', 'timeline', 'certifications'], true)) {
        $c[$section] = $data;               // full replace for lists
    } else {
        $c[$section] = array_merge($c[$section] ?? [], $data); // merge for objects
    }
    if (!write_json(CONTENT_FILE, $c)) fail('Could not write content file (check folder permissions).', 500);
    audit('save_' . $section);
    json_out(['ok' => true]);
}

function sanitize_str($v, int $max = 5000): string {
    if (!is_scalar($v)) return '';
    $s = trim((string)$v);
    // Scrub invalid UTF-8 (e.g. pasted from Word/Excel) so json_encode can't fail silently
    if (!mb_check_encoding($s, 'UTF-8')) $s = function_exists('mb_scrub') ? mb_scrub($s, 'UTF-8') : mb_convert_encoding($s, 'UTF-8', 'UTF-8');
    return mb_substr($s, 0, $max);
}
function sanitize_img_path(string $s): string {
    $s = ltrim(sanitize_str($s, 200), '/');
    return (preg_match('#^[A-Za-z0-9._\-/]+$#', $s) && !str_contains($s, '..')) ? $s : '';
}
function sanitize_list(array $arr, int $maxItems): array {
    // PHP 8.0-compatible is_list() check
    if ($arr === [] || array_keys($arr) !== range(0, count($arr) - 1)) return [];
    return array_slice($arr, 0, $maxItems);
}
function sanitize_section(string $section, array $d): ?array {
    switch ($section) {
        case 'stats':
            return [
                'projects' => sanitize_str($d['projects'] ?? '', 10),
                'technologies' => sanitize_str($d['technologies'] ?? '', 10),
            ];
        case 'contact':
            $out = [];
            foreach (['email', 'linkedin', 'github', 'facebook', 'other'] as $k) {
                $out[$k] = mb_substr(sanitize_str($d[$k] ?? ''), 0, 300);
            }
            return $out;
        case 'about':
            return ['paragraphs' => sanitize_list($d['paragraphs'] ?? [], 8)];
        case 'projects':
            $out = [];
            foreach (sanitize_list($d, 30) as $p) {
                if (!is_array($p)) continue;
                $out[] = [
                    'id' => sanitize_str($p['id'] ?? bin2hex(random_bytes(4)), 40),
                    'title' => sanitize_str($p['title'] ?? '', 120),
                    'category' => in_array($p['category'] ?? '', ['web', 'infra'], true) ? $p['category'] : 'web',
                    'problem' => sanitize_str($p['problem'] ?? ''),
                    'solution' => sanitize_str($p['solution'] ?? ''),
                    'tech' => array_map(fn($t) => sanitize_str($t, 40), sanitize_list($p['tech'] ?? [], 15)),
                    'role' => sanitize_str($p['role'] ?? '', 200),
                    'features' => array_map(fn($f) => sanitize_str($f, 300), sanitize_list($p['features'] ?? [], 15)),
                    'security' => array_map(fn($s) => sanitize_str($s, 300), sanitize_list($p['security'] ?? [], 15)),
                    'improvements' => sanitize_str($p['improvements'] ?? '', 400),
                    'github' => filter_var($p['github'] ?? '', FILTER_VALIDATE_URL) ?: '',
                    'demo' => filter_var($p['demo'] ?? '', FILTER_VALIDATE_URL) ?: '',
                    'screenshots' => array_values(array_filter(array_map(fn($s) => sanitize_img_path((string)$s), sanitize_list($p['screenshots'] ?? [], 12)))),
                ];
            }
            return $out;
        case 'timeline':
            $out = [];
            foreach (sanitize_list($d, 15) as $t) {
                if (!is_array($t)) continue;
                $out[] = [
                    'period' => sanitize_str($t['period'] ?? '', 40),
                    'title' => sanitize_str($t['title'] ?? '', 100),
                    'desc' => sanitize_str($t['desc'] ?? '', 500),
                ];
            }
            return $out;
        case 'certifications':
            $out = [];
            foreach (sanitize_list($d, 20) as $ct) {
                if (!is_array($ct)) continue;
                $out[] = [
                    'category' => sanitize_str($ct['category'] ?? '', 40),
                    'name' => sanitize_str($ct['name'] ?? '', 150),
                    'issuer' => sanitize_str($ct['issuer'] ?? '', 100),
                    'year' => sanitize_str($ct['year'] ?? '', 10),
                    'image' => sanitize_img_path($ct['image'] ?? ''),
                ];
            }
            return $out;
    }
    return null;
}
