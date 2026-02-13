import React, { useEffect, useState } from 'react';
import { getAnnualReports } from '../api';
import { getFeaturedImageUrl } from '../utils/media';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnnualReports();
        if (!cancelled) {
          setReports(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load annual reports.');
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

  return (
    <div className="page">
      <section className="section section-narrow">
        <header className="section-header">
          <h1 className="section-title-large">Annual Reports</h1>
          <p className="section-intro">
            Yearly summaries and institutional reflections, available as PDFs.
          </p>
        </header>

        {loading && (
          <div className="status-message">Loading reports…</div>
        )}

        {error && !loading && (
          <div className="status-message status-error">
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="status-message">
            No annual reports have been published yet.
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="mag-grid">
            {reports.map((report) => {
              const imageUrl = getFeaturedImageUrl(report);
              const contentHtml = report.content?.rendered || '';
              const pdfMatch = contentHtml.match(
                /href="([^"]+\.pdf)"/i
              );
              const pdfUrl = pdfMatch ? pdfMatch[1] : null;

              return (
                <article key={report.id} className="mag-card">
                  <div className="mag-cover-wrapper">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={report.title?.rendered || 'Report cover'}
                        className="mag-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="mag-placeholder">
                        <span>{report.title?.rendered?.[0] || 'R'}</span>
                      </div>
                    )}
                  </div>
                  <div className="mag-body">
                    <h3 className="mag-title">
                      {report.title?.rendered || 'Annual Report'}
                    </h3>
                    {report.date && (
                      <p className="meta-line">
                        <time dateTime={report.date}>
                          {new Date(report.date).getFullYear()}
                        </time>
                      </p>
                    )}
                    {pdfUrl && (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ReportsPage;


