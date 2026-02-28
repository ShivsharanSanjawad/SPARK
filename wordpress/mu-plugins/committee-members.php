<?php
/**
 * Plugin Name: Committee Members
 * Description: Registers a Committee Member content type for the About page.
 * Author: Headless Setup
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register a "Committee Member" custom post type.
 *
 * This gives you a simple interface in WordPress under
 *  - Committee Members → Add New
 * where each entry represents one person on the editorial / advisory committee.
 *
 * Fields you can use:
 *  - Title: the person's name
 *  - Featured Image: portrait photo
 *  - Excerpt: role + affiliation (e.g. "Editor-in-Chief, Department of History")
 *  - Content: optional longer bio (not currently shown in the frontend)
 */
add_action('init', function () {
    $labels = [
        'name'               => 'Committee Members',
        'singular_name'      => 'Committee Member',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Committee Member',
        'edit_item'          => 'Edit Committee Member',
        'new_item'           => 'New Committee Member',
        'all_items'          => 'All Committee Members',
        'view_item'          => 'View Committee Member',
        'search_items'       => 'Search Committee Members',
        'not_found'          => 'No committee members found',
        'not_found_in_trash' => 'No committee members found in Trash',
        'menu_name'          => 'Committee Members',
    ];

    $args = [
        'labels'             => $labels,
        'public'             => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true, // important for the REST API / React
        'has_archive'        => false,
        'rewrite'            => ['slug' => 'committee-member'],
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
        'menu_position'      => 21,
        'menu_icon'          => 'dashicons-groups',
    ];

    register_post_type('committee_member', $args);

    // Register "position" meta field for REST API access
    register_post_meta('committee_member', 'position', [
        'show_in_rest'  => true,
        'single'        => true,
        'type'          => 'string',
        'default'       => '',
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        },
    ]);
});

/**
 * Add a "Position of Responsibility" meta box in the editor.
 */
add_action('add_meta_boxes', function () {
    add_meta_box(
        'committee_member_position',
        'Position of Responsibility',
        function ($post) {
            $value = get_post_meta($post->ID, 'position', true);
            wp_nonce_field('committee_member_position_nonce', 'position_nonce');
            echo '<p style="margin-bottom:6px"><label for="committee_position"><strong>Enter the member\'s position / role:</strong></label></p>';
            echo '<input type="text" id="committee_position" name="committee_position" value="' . esc_attr($value) . '" style="width:100%;font-size:14px;padding:8px;" placeholder="e.g. President, Secretary, Advisor" />';
            echo '<p class="description">This is prominently shown on the committee listing page and member detail page.</p>';
        },
        'committee_member',
        'normal',
        'high'
    );
});

/**
 * Save the position meta on post save.
 */
add_action('save_post_committee_member', function ($post_id) {
    if (!isset($_POST['position_nonce']) || !wp_verify_nonce($_POST['position_nonce'], 'committee_member_position_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    if (isset($_POST['committee_position'])) {
        update_post_meta($post_id, 'position', sanitize_text_field($_POST['committee_position']));
    }
});

/**
 * Ensure the position meta is always present in REST API responses.
 */
add_filter('rest_prepare_committee_member', function ($response, $post) {
    $data = $response->get_data();
    $data['position'] = get_post_meta($post->ID, 'position', true) ?: '';
    $response->set_data($data);
    return $response;
}, 10, 2);


