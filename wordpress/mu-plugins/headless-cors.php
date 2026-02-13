<?php
/**
 * Plugin Name: Headless WordPress CORS
 * Description: Enable CORS for headless WordPress setup
 * Version: 1.0.0
 * Author: Auto-generated
 */

if (!defined('ABSPATH')) {
    exit;
}

// Add CORS headers to REST API requests
add_action('rest_api_init', function() {
    // Remove default CORS headers if any
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    // Add our custom CORS headers
    add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        
        // Handle preflight OPTIONS requests
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }
        
        return $served;
    }, 10, 4);
}, 15);

// Add CORS headers to all responses
add_action('init', function() {
    // Only add headers if it's a REST API request
    if (strpos($_SERVER['REQUEST_URI'], '/wp-json/') !== false || strpos($_SERVER['REQUEST_URI'], 'rest_route=') !== false) {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        
        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
});

// Disable WordPress frontend (optional - makes it truly headless)
add_action('template_redirect', function() {
    if (!is_admin() && strpos($_SERVER['REQUEST_URI'], '/wp-json/') === false && strpos($_SERVER['REQUEST_URI'], 'rest_route=') === false) {
        wp_redirect(home_url('/wp-json'), 301);
        exit;
    }
});


