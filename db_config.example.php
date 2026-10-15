<?php
if (basename($_SERVER['PHP_SELF'] ?? '') === 'db_config.php' || basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'db_config.php') {
    http_response_code(403);
    exit(json_encode(['error' => 'Direct access forbidden']));
}
/**
 * Exposed Propagandus - Database & Environment Configuration Template
 * 
 * Copy this file to db_config.php on your web host and insert your actual database credentials.
 * NEVER commit db_config.php containing real passwords to public git repositories.
 */

// MySQL Database Credentials (e.g., from InfinityFree / cPanel / Localhost)
defined('DB_HOST') || define('DB_HOST', 'sql200.infinityfree.com');
defined('DB_PORT') || define('DB_PORT', 3306);
defined('DB_USER') || define('DB_USER', 'YOUR_DB_USERNAME');
defined('DB_PASS') || define('DB_PASS', 'YOUR_DB_PASSWORD');
defined('DB_NAME') || define('DB_NAME', 'YOUR_DB_DATABASE_NAME');

// Master Admin Security Key & Fallback Credentials
defined('ADMIN_SECRET_KEY') || define('ADMIN_SECRET_KEY', 'JaiHindBharatMataKiJai2024!');
defined('ADMIN_EMAIL')      || define('ADMIN_EMAIL', 'omkumar.working@gmail.com');
defined('ADMIN_PASSWORD')   || define('ADMIN_PASSWORD', 'Q0gng04bk3');
