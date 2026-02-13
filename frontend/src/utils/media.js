// Utility functions for working with WordPress media objects

export function getFeaturedImageUrl(post) {
  if (!post || !post._embedded || !post._embedded['wp:featuredmedia']) {
    return null;
  }

  const media = post._embedded['wp:featuredmedia'][0];
  if (!media || !media.source_url) {
    return null;
  }

  return media.source_url;
}


