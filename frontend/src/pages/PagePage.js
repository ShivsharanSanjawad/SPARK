import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../services/apiService';
import ContentRenderer from '../components/ContentRenderer';

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
          if (!data) setError('Page not found.');
          else setPage(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load page.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* Page Header */}
      {page && !loading && !error && (
        <section className="pt-32 pb-16" style={{ background: 'var(--black)' }}>
          <div className="app-container">
            <h1>{page.title?.rendered || 'Page'}</h1>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="app-container pb-24">
        {loading && (
          <div className="space-y-4 pt-32">
            <div className="skeleton" style={{ height: 384 }} />
            <div className="skeleton" style={{ height: 16 }} />
            <div className="skeleton" style={{ height: 16, width: '83%' }} />
          </div>
        )}

        {error && !loading && (
          <div className="p-6" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--amber)' }}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Error</p>
            <p style={{ color: 'var(--dim)' }}>{error}</p>
          </div>
        )}

        {page && !loading && !error && (
          <div style={{ maxWidth: 720, margin: '0 auto' }} className="prose-dark">
            <ContentRenderer content={page.content?.rendered} />
          </div>
        )}
      </section>
    </div>
  );
}

export default PagePage;


