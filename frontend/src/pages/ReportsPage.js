import { useEffect, useState } from 'react';
import { getAnnualReports } from '../api';
import { getFeaturedImageUrl } from '../utils/media';
import { useReveal } from '../hooks/useAnimations';

function RevealItem({ children, index }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
      {children}
    </div>
  );
}

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerRef, headerVisible] = useReveal();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getAnnualReports();
        if (!cancelled) setReports(data);
      } catch (err) { if (!cancelled) setError(err.message); }
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
          <div className="overline mb-4"><span className="overline-dot" /> Documents</div>
          <h1>Annual Reports</h1>
          <p className="mt-4" style={{ color: 'var(--muted)', maxWidth: 500 }}>
            Yearly summaries and institutional reflections, available as PDFs.
          </p>
        </div>
      </section>

      <section className="app-container pb-24">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-dark overflow-hidden"><div className="skeleton" style={{ height: 280 }} /><div className="p-5 space-y-3"><div className="skeleton" style={{ height: 18, width: '75%' }} /><div className="skeleton" style={{ height: 14, width: '50%' }} /></div></div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="p-4" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--amber)' }}>
            <p style={{ fontWeight: 600 }}>Error</p><p style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>{error}</p>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="text-center py-24">
            <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>✦</div>
            <h3 style={{ marginBottom: 8 }}>No reports yet</h3>
            <p style={{ color: 'var(--dim)' }}>Annual reports will appear here once published.</p>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, i) => {
              const imageUrl = getFeaturedImageUrl(report);
              const contentHtml = report.content?.rendered || '';
              const pdfMatch = contentHtml.match(/href="([^"]+\.pdf)"/i);
              const pdfUrl = pdfMatch ? pdfMatch[1] : null;
              const year = report.date ? new Date(report.date).getFullYear() : '';

              return (
                <RevealItem key={report.id} index={i}>
                  <article className="card-dark overflow-hidden group">
                    <div className="relative overflow-hidden" style={{ height: 280 }}>
                      {imageUrl ? (
                        <img src={imageUrl} alt={report.title?.rendered || 'Report'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" style={{ filter: 'saturate(0.8)' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--dim)' }}>{year}</span>
                        </div>
                      )}
                      {year && <span className="badge-amber absolute top-4 left-4">{year}</span>}
                    </div>
                    <div className="p-5">
                      <h3 className="group-hover:text-amber-400 transition-colors" style={{ fontSize: '1.1rem', marginBottom: 10 }}>
                        {report.title?.rendered || 'Annual Report'}
                      </h3>
                      {pdfUrl && (
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-amber text-sm w-full justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Download PDF
                        </a>
                      )}
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ReportsPage;


