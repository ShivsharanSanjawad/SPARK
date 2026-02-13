import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';

import { getFeaturedImageUrl } from '../utils/media';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPosts({ perPage: 7 });
        if (!cancelled) {
          setPosts(data);
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

  const hero = posts[0];
  const sidePosts = posts.slice(1, 4);
  const gridPosts = posts.slice(4);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <p className="hero-kicker">A Journal of Ideas</p>
            <h1 className="hero-title">
              Quietly ambitious writing from a curious campus.
            </h1>
            <p className="hero-subtitle">
              Essays, reports, and long-form pieces from students, faculty, and
              invited writers across disciplines.
            </p>
            <Link to="/articles" className="hero-cta">
              Explore Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured articles */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Articles</h2>
        </div>

        {loading && (
          <div className="status-message">Loading articles…</div>
        )}

        {error && !loading && (
          <div className="status-message status-error">
            {error}
          </div>
        )}

        {!loading && !error && hero && (
          <div className="feature-layout">
            {/* Hero feature on the left */}
            <article className="feature-hero">
              <Link to={`/articles/${hero.slug}`} className="feature-hero-image-link">
                <div className="feature-hero-image-wrapper">
                  {getFeaturedImageUrl(hero) ? (
                    <img
                      src={getFeaturedImageUrl(hero)}
                      alt={hero.title?.rendered || 'Featured article'}
                      className="feature-hero-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="feature-hero-placeholder">
                      <span>{hero.title?.rendered?.[0] || 'A'}</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="feature-hero-body">
                <p className="meta-line">
                  {hero.date && (
                    <time dateTime={hero.date}>
                      {new Date(hero.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </p>
                <h3 className="feature-hero-title">
                  <Link to={`/articles/${hero.slug}`}>
                    {hero.title?.rendered || 'Untitled article'}
                  </Link>
                </h3>
                <div
                  className="feature-hero-excerpt"
                  dangerouslySetInnerHTML={{
                    __html: hero.excerpt?.rendered || '',
                  }}
                />
                <Link to={`/articles/${hero.slug}`} className="read-link">
                  Read full article
                </Link>
              </div>
            </article>

            {/* Side articles on the right */}
            <div className="feature-side-list">
              {sidePosts.map((post) => (
                <article key={post.id} className="feature-side-item">
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
                  <h4 className="feature-side-title">
                    <Link to={`/articles/${post.slug}`}>
                      {post.title?.rendered || 'Untitled article'}
                    </Link>
                  </h4>
                  <div
                    className="feature-side-excerpt"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt?.rendered || '',
                    }}
                  />
                  <Link to={`/articles/${post.slug}`} className="read-link">
                    Read more
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Additional grid below */}
        {!loading && !error && gridPosts.length > 0 && (
          <div className="card-grid">
            {gridPosts.map((post) => (
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

export default HomePage;


