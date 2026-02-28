import { useEffect, useState } from 'react';
import { getPageBySlug } from '../services/apiService';
import { useSiteSettings } from '../context/SiteContext';
import CommitteeMembers from '../components/CommitteeMembers';
import ContentRenderer from '../components/ContentRenderer';
import { useReveal } from '../hooks/useAnimations';

function RevealSection({ children, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function AboutPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSiteSettings();
  const [headerRef, headerVisible] = useReveal();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const pageData = await getPageBySlug('about');
        if (!cancelled) {
          if (!pageData) setError('About page not found in WordPress.');
          else setPage(pageData);
        }
      } catch (err) { if (!cancelled) setError(err.message || 'Failed to load About page.'); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: 'var(--black)' }}>
        <div ref={headerRef} className={`app-container reveal ${headerVisible ? 'visible' : ''}`}>
          <div className="overline mb-4"><span className="overline-dot" /> Our Story</div>
          <h1>About Spark</h1>
          <p className="mt-4" style={{ color: 'var(--muted)', maxWidth: 500 }}>
            Learn about our mission, the team, and what drives the journal forward.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="app-container pb-16">
        {loading && (
          <div style={{ maxWidth: 720, margin: '0 auto' }} className="space-y-4">
            <div className="skeleton" style={{ height: 20 }} /><div className="skeleton" style={{ height: 20, width: '80%' }} /><div className="skeleton" style={{ height: 20 }} /><div className="skeleton" style={{ height: 20, width: '60%' }} />
          </div>
        )}

        {error && !loading && (
          <div className="p-4" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--amber)' }}>
            <p style={{ fontWeight: 600 }}>Error</p><p style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>{error}</p>
          </div>
        )}

        {page && !loading && !error && (
          <RevealSection>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <div className="prose-dark mb-16">
                <ContentRenderer content={page.content?.rendered} />
              </div>
            </div>
          </RevealSection>
        )}
      </section>

      {/* Committee Members */}
      <section className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="app-container">
          <RevealSection>
            <div className="mb-12 text-center" style={{ maxWidth: 600, margin: '0 auto 3rem' }}>
              <div className="overline justify-center mb-4"><span className="overline-dot" /> The Team</div>
              <h2>Editorial Committee</h2>
              <p className="mt-4" style={{ color: 'var(--muted)' }}>
                Meet the talented individuals who curate and direct the journal.
              </p>
            </div>
          </RevealSection>
          <RevealSection>
            <CommitteeMembers />
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      {settings.about_cta_title && (
        <section className="py-24 text-center" style={{ background: 'var(--black)' }}>
          <div className="app-container">
            <RevealSection className="space-y-6" style={{ maxWidth: 600, margin: '0 auto' }}>
              <h2>{settings.about_cta_title}</h2>
              <p style={{ color: 'var(--muted)' }}>{settings.about_cta_text}</p>
              {settings.about_cta_button && (
                <a href={settings.about_cta_url} className="btn btn-amber inline-flex">
                  {settings.about_cta_button}
                </a>
              )}
            </RevealSection>
          </div>
        </section>
      )}
    </div>
  );
}

export default AboutPage;


