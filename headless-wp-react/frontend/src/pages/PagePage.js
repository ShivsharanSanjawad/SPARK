import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../api';

function PagePage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPageBySlug(slug);
        if (!cancelled) {
          if (!data) {
            setError('Page not found.');
          } else {
            setPage(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load page.');
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

  return (
    <div className="page">
      <section className="article-shell">
        {loading && (
          <div className="status-message">Loading…</div>
        )}

        {error && !loading && (
          <div className="status-message status-error">
            {error}
          </div>
        )}

        {page && !loading && !error && (
          <>
            <h1 className="article-title">
              {page.title?.rendered || 'Page'}
            </h1>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{
                __html: page.content?.rendered || '',
              }}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default PagePage;


