import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../api';
import { getFeaturedImageUrl } from '../utils/media';

function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPostBySlug(slug);
        if (!cancelled) {
          if (!data) {
            setError('Article not found.');
          } else {
            setPost(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load article.');
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
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <section className="article-shell">
          <div className="status-message">Loading article…</div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page">
        <section className="article-shell">
          <div className="status-message status-error">{error}</div>
          <Link to="/articles" className="read-link">
            Back to Articles
          </Link>
        </section>
      </div>
    );
  }

  const imageUrl = getFeaturedImageUrl(post);

  return (
    <div className="page">
      <article className="article-shell">
        <p className="article-kicker">Article</p>
        <h1 className="article-title">
          {post.title?.rendered || 'Untitled article'}
        </h1>
        <div className="article-meta">
          {post.date && (
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>

        {imageUrl && (
          <figure className="article-figure">
            <img
              src={imageUrl}
              alt={post.title?.rendered || 'Article image'}
              className="article-image"
              loading="lazy"
            />
          </figure>
        )}

        <div
          className="article-body"
          // We trust this HTML because it is authored in our own WordPress instance.
          dangerouslySetInnerHTML={{
            __html: post.content?.rendered || '',
          }}
        />

        <hr className="article-separator" />

        <div className="article-footer-nav">
          <Link to="/articles" className="read-link">
            Back to Articles
          </Link>
        </div>
      </article>
    </div>
  );
}

export default ArticlePage;


