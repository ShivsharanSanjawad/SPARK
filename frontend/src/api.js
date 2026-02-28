/**
 * DEPRECATED - This file is now a compatibility shim
 * 
 * All API functions have been moved to services/apiService.js
 * 
 * If you're importing from this file, please update your imports:
 * 
 * OLD:   import { getPosts } from './api';
 * NEW:   import { getPosts } from './services/apiService';
 * 
 * This file will be removed in a future release.
 */

/* Re-export everything from the new location for backwards compatibility */
export {
  getPosts,
  getPostBySlug,
  getPostById,
  getCategories,
  getPostsByCategory,
  getAllPages,
  getPageBySlug,
  getPageById,
  getCommitteeMembers,
  getCommitteeMemberById,
  parseBlocks,
  formatBlocksToContent,
  getSiteSettings,
  getMenus,
  getMenuByLocation,
  default as apiClient,
} from './services/apiService';

/**
 * Helper functions (re-implemented by delegating to apiService)
 */

export async function getMagazineIssues() {
  const { getCategories, getPosts } = await import('./services/apiService');
  const categories = await getCategories();
  const magazineCategory = categories.find((cat) => cat.slug === 'magazine');
  
  if (!magazineCategory) {
    return [];
  }

  return getPosts({ perPage: 100, categories: magazineCategory.id });
}

export async function getAnnualReports() {
  const { getCategories, getPosts } = await import('./services/apiService');
  const categories = await getCategories();
  const reportsCategory = categories.find((cat) => cat.slug === 'annual-report');
  
  if (!reportsCategory) {
    return [];
  }

  return getPosts({ perPage: 100, categories: reportsCategory.id });
}



