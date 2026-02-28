import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ArticleCard - Reusable component for displaying article thumbnails
 */
export function ArticleCard({ article, linkPath = '/articles' }) {
  const featured = article._embedded?.['wp:featuredmedia']?.[0];
  const categories = article._embedded?.['wp:term']?.[0] || [];
  const title = article.title?.rendered || (typeof article.title === 'string' ? article.title : 'Untitled');
  const rawExcerpt = article.excerpt?.rendered || (typeof article.excerpt === 'string' ? article.excerpt : '');
  const plainExcerpt = String(rawExcerpt).replace(/<[^>]*>/g, '').slice(0, 150);

  return (
    <Link
      to={`${linkPath}/${article.slug}`}
      className="card overflow-hidden hover:shadow-card-lg transition-shadow group"
    >
      {/* Featured Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-200">
        {featured?.source_url ? (
          <img
            src={featured.source_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
            <span className="text-slate-300 text-4xl">📄</span>
          </div>
        )}

        {/* Category Badge */}
        {categories.length > 0 && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary">
              {categories[0]?.name || 'Article'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {plainExcerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <span className="text-primary-600 font-medium hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * ArticleGrid - Component for displaying multiple articles
 */
export function ArticleGrid({ articles, linkPath = '/articles', columns = 3 }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg">No articles found.</p>
      </div>
    );
  }

  const colsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-6`}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          linkPath={linkPath}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Loading placeholder
 */
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-56 w-full"></div>
      <div className="p-6 space-y-3">
        <div className="skeleton h-6 w-3/4"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-2/3"></div>
      </div>
    </div>
  );
}

/**
 * SkeletonGrid - Loading skeleton grid
 */
export function SkeletonGrid({ count = 6, columns = 3 }) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default ArticleCard;
