<?php
// api/config.php
// Store database credentials and settings here.
// In a real environment, load these from a .env file outside public_html.

$host = getenv('DB_HOST') ?: '127.0.0.1';
$dbname = getenv('DB_NAME') ?: 'yash_industries';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // DO NOT output real error in production
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Mail settings for Quote emails
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.hostinger.com');
define('SMTP_USER', getenv('SMTP_USER') ?: 'yashindustries@rediffmail.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: 'YourEmailPassword123');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 465);

// Start secure session
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);
session_start();
