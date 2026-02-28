/**
 * Enhanced WordPress REST API Service
 * Handles all communication with WordPress backend
 * Supports custom post types, blocks, and committee members
 */

import axios from 'axios';

const WP_BASE_URL = process.env.REACT_APP_WP_BASE_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: WP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Build REST route URL
 */
const buildRestRoute = (pathAndQuery) => {
  return `/?rest_route=${pathAndQuery}`;
};

/**
 * Handle API errors with proper logging
 */
const handleError = (error) => {
  const message = error.response?.data?.message || error.message;
  console.error('API Error:', message);
  throw new Error(message);
};

// ==================== POSTS ====================

export const getPosts = async ({ perPage = 12, page = 1, search = '' } = {}) => {
  try {
    const params = new URLSearchParams({
      per_page: perPage,
      page: page,
      _embed: 1,
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await apiClient.get(buildRestRoute(`/wp/v2/posts&${params}`));
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPostBySlug = async (slug) => {
  try {
    const response = await apiClient.get(
      buildRestRoute(`/wp/v2/posts&_embed&slug=${encodeURIComponent(slug)}`)
    );
    return response.data[0] || null;
  } catch (error) {
    handleError(error);
  }
};

export const getPostById = async (id) => {
  try {
    const response = await apiClient.get(buildRestRoute(`/wp/v2/posts/${id}&_embed=1`));
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== CATEGORIES ====================

export const getCategories = async () => {
  try {
    const response = await apiClient.get(
      buildRestRoute('/wp/v2/categories&per_page=100')
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPostsByCategory = async (categoryId, { perPage = 12, page = 1 } = {}) => {
  try {
    const response = await apiClient.get(
      buildRestRoute(
        `/wp/v2/posts&_embed&categories=${categoryId}&per_page=${perPage}&page=${page}`
      )
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== PAGES ====================

export const getAllPages = async () => {
  try {
    const response = await apiClient.get(buildRestRoute('/wp/v2/pages&per_page=100'));
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPageBySlug = async (slug) => {
  try {
    const response = await apiClient.get(
      buildRestRoute(`/wp/v2/pages&slug=${encodeURIComponent(slug)}&_embed`)
    );
    return response.data[0] || null;
  } catch (error) {
    handleError(error);
  }
};

export const getPageById = async (id) => {
  try {
    const response = await apiClient.get(buildRestRoute(`/wp/v2/pages/${id}&_embed`));
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== COMMITTEE MEMBERS ====================

export const getCommitteeMembers = async () => {
  try {
    const response = await apiClient.get(
      buildRestRoute('/wp/v2/committee_member&per_page=100&_embed')
    );
    return response.data;
  } catch (error) {
    console.warn('Committee members endpoint not available');
    return [];
  }
};

export const getCommitteeMemberById = async (id) => {
  try {
    const response = await apiClient.get(buildRestRoute(`/wp/v2/committee_member/${id}&_embed`));
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== CUSTOM BLOCKS ====================

/**
 * Parse WordPress blocks from post content
 * Supports standard blocks and custom Spark blocks
 */
export const parseBlocks = (content) => {
  if (!content) return [];

  const blockRegex = /<!-- wp:([^\s]+)(?: (.*?))?\/?\s*-->([\s\S]*?)(?=<!-- wp:|$)/g;
  const blocks = [];
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    const [, blockType, attributes, blockContent] = match;
    
    let parsedAttributes = {};
    try {
      if (attributes) {
        parsedAttributes = JSON.parse(attributes);
      }
    } catch (e) {
      console.warn('Failed to parse block attributes:', attributes);
    }

    blocks.push({
      type: blockType,
      attributes: parsedAttributes,
      content: blockContent.trim(),
    });
  }

  return blocks;
};

/**
 * Format blocks back to WordPress format
 */
export const formatBlocksToContent = (blocks) => {
  return blocks
    .map((block) => {
      const attrs = Object.keys(block.attributes).length > 0
        ? ` ${JSON.stringify(block.attributes)}`
        : '';
      return `<!-- wp:${block.type}${attrs} -->${block.content}<!-- /wp:${block.type} -->`;
    })
    .join('\n');
};

// ==================== SITE SETTINGS ====================

/**
 * Fetch Spark site settings from /spark/v1/settings
 * (branding, colours, footer, hero, social links, CTAs)
 */
export const getSiteSettings = async () => {
  try {
    const response = await apiClient.get(buildRestRoute('/spark/v1/settings'));
    return response.data;
  } catch (error) {
    console.warn('Site settings endpoint not available, using defaults');
    return null;
  }
};

// ==================== NAVIGATION MENUS ====================

/**
 * Fetch all registered menu locations with their items
 */
export const getMenus = async () => {
  try {
    const response = await apiClient.get(buildRestRoute('/spark/v1/menus'));
    return response.data;
  } catch (error) {
    console.warn('Menus endpoint not available');
    return null;
  }
};

/**
 * Fetch menu items for a specific location (e.g. 'primary', 'footer')
 */
export const getMenuByLocation = async (location) => {
  try {
    const response = await apiClient.get(buildRestRoute(`/spark/v1/menus/${location}`));
    return response.data?.items || [];
  } catch (error) {
    console.warn(`Menu location "${location}" not available`);
    return [];
  }
};

export default apiClient;
