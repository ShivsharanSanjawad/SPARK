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
});


