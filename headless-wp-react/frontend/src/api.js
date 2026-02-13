// Simple API helper for talking to the WordPress REST API.
// Centralizes the base URL and common query patterns.

const WP_BASE_URL =
  process.env.REACT_APP_WP_BASE_URL || 'http://localhost:8080';

// NOTE: Your local WordPress instance exposes the REST API reliably via the
// "rest_route" query parameter, not the pretty /wp-json/... path. We therefore
// build URLs of the form:
//   http://localhost:8080/?rest_route=/wp/v2/posts&_embed&...

async function fetchRestRoute(pathAndQuery) {
  const url = `${WP_BASE_URL}/?rest_route=${pathAndQuery}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Request failed ${response.status} ${response.statusText} for ${url} – ${text.slice(
        0,
        200
      )}`
    );
  }

  return response.json();
}

export async function getPosts({ perPage = 12, page = 1 } = {}) {
  return fetchRestRoute(
    `/wp/v2/posts&_embed&per_page=${perPage}&page=${page}`
  );
}

export async function getPostBySlug(slug) {
  const results = await fetchRestRoute(
    `/wp/v2/posts&_embed&slug=${encodeURIComponent(slug)}`
  );
  return results[0] || null;
}

export async function getPostById(id) {
  return fetchRestRoute(`/wp/v2/posts/${id}&_embed=1`);
}

export async function getCategories() {
  return fetchRestRoute('/wp/v2/categories&per_page=100');
}

export async function getPageBySlug(slug) {
  const results = await fetchRestRoute(
    `/wp/v2/pages&_embed&slug=${encodeURIComponent(slug)}`
  );
  return results[0] || null;
}

// Helper to fetch posts that belong to a category with a given slug
// (e.g. "magazine" or "annual-report").
async function getPostsByCategorySlug(slug, { perPage = 24 } = {}) {
  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) {
    return [];
  }
  return fetchRestRoute(
    `/wp/v2/posts&_embed&per_page=${perPage}&categories=${category.id}`
  );
}

export async function getMagazineIssues() {
  return getPostsByCategorySlug('magazine');
}

export async function getAnnualReports() {
  return getPostsByCategorySlug('annual-report');
}

export async function getCommitteeMembers() {
  return fetchRestRoute('/wp/v2/committee_member&_embed&per_page=100');
}

export async function getAllPages() {
  // Fetch all pages so we can surface top-level ones in the navigation.
  return fetchRestRoute('/wp/v2/pages&per_page=100');
}


