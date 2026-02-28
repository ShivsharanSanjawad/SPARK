<?php
/**
 * Plugin Name: Headless WordPress CORS
 * Description: Enable CORS for headless WordPress setup with dynamic origins
 * Version: 2.0.0
 * Author: Spark
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Allowed origins list.  Extend via the SPARK_CORS_ORIGINS env-var
 * (comma-separated) or by filtering 'spark_cors_allowed_origins'.
 */
function spark_get_allowed_origins() {
    $defaults = array(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    );

    // Allow extra origins from environment (set in docker-compose)
    $env = getenv('SPARK_CORS_ORIGINS');
    if ($env) {
        $defaults = array_merge($defaults, array_map('trim', explode(',', $env)));
    }

    return apply_filters('spark_cors_allowed_origins', $defaults);
}

function spark_send_cors_headers() {
    $origin  = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    $allowed = spark_get_allowed_origins();

    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } elseif (empty($origin)) {
        // Same-origin requests (or tools like curl) – allow so REST works
        header('Access-Control-Allow-Origin: *');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    header('Access-Control-Allow-Credentials: true');
}

// REST API requests
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($served) {
        spark_send_cors_headers();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }

        return $served;
    }, 10, 1);
}, 15);

// Early catch for REST requests that arrive before rest_api_init
add_action('init', function () {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/wp-json/') !== false || strpos($uri, 'rest_route=') !== false) {
        spark_send_cors_headers();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
});


