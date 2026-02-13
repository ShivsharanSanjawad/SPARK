import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getCategories } from '../api';
import { getFeaturedImageUrl } from '../utils/media';

function ArticlesPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [postData, categoryData] = await Promise.all([
          getPosts({ perPage: 24 }),
          getCategories(),
        ]);
        if (!cancelled) {
          setPosts(postData);
          setCategories(categoryData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load articles.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPosts =
    activeCategory === 'all'
      ? posts
      : posts.filter((post) =>
          (post.categories || []).includes(Number(activeCategory))
        );

  return (
    <div className="page">
      <section className="section section-narrow">
        <header className="section-header">
          <h1 className="section-title-large">Articles</h1>
          <p className="section-intro">
            Essays, reflections, and reports from across the disciplines.
          </p>
        </header>

        {/* Category filters */}
        <div className="filter-bar">
          <button
            type="button"
            className={
              activeCategory === 'all'
                ? 'filter-pill filter-pill-active'
                : 'filter-pill'
            }
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={
                activeCategory === String(cat.id)
                  ? 'filter-pill filter-pill-active'
                  : 'filter-pill'
              }
              onClick={() => setActiveCategory(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="status-message">Loading articles…</div>
        )}

        {error && !loading && (
          <div className="status-message status-error">
            {error}
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="status-message">
            No articles yet. Check back soon.
          </div>
        )}

        {!loading && !error && filteredPosts.length > 0 && (
          <div className="card-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="card">
                <Link to={`/articles/${post.slug}`} className="card-image-link">
                  <div className="card-image-wrapper">
                    {getFeaturedImageUrl(post) ? (
                      <img
                        src={getFeaturedImageUrl(post)}
                        alt={post.title?.rendered || 'Article image'}
                        className="card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="card-placeholder">
                        <span>{post.title?.rendered?.[0] || 'A'}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="card-body">
                  <p className="meta-line">
                    {post.date && (
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </p>
                  <h3 className="card-title">
                    <Link to={`/articles/${post.slug}`}>
                      {post.title?.rendered || 'Untitled article'}
                    </Link>
                  </h3>
                  <div
                    className="card-excerpt"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt?.rendered || '',
                    }}
                  />
                  <Link to={`/articles/${post.slug}`} className="read-link">
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ArticlesPage;


