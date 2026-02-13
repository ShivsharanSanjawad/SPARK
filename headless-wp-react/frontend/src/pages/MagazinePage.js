import React, { useEffect, useState } from 'react';
import { getMagazineIssues } from '../api';
import { getFeaturedImageUrl } from '../utils/media';

function MagazinePage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMagazineIssues();
        if (!cancelled) {
          setIssues(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load magazine issues.');
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
          <h1 className="section-title-large">Magazine Archive</h1>
          <p className="section-intro">
            Collected issues of the journal, available as downloadable PDFs.
          </p>
        </header>

        {loading && (
          <div className="status-message">Loading issues…</div>
        )}

        {error && !loading && (
          <div className="status-message status-error">
            {error}
          </div>
        )}

        {!loading && !error && issues.length === 0 && (
          <div className="status-message">
            No magazine issues have been published yet.
          </div>
        )}

        {!loading && !error && issues.length > 0 && (
          <div className="mag-grid">
            {issues.map((issue) => {
              const imageUrl = getFeaturedImageUrl(issue);
              // For now, look for the first link to a PDF in the rendered content.
              const contentHtml = issue.content?.rendered || '';
              const pdfMatch = contentHtml.match(
                /href="([^"]+\.pdf)"/i
              );
              const pdfUrl = pdfMatch ? pdfMatch[1] : null;

              return (
                <article key={issue.id} className="mag-card">
                  <div className="mag-cover-wrapper">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={issue.title?.rendered || 'Magazine cover'}
                        className="mag-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="mag-placeholder">
                        <span>{issue.title?.rendered?.[0] || 'M'}</span>
                      </div>
                    )}
                  </div>
                  <div className="mag-body">
                    <h3 className="mag-title">
                      {issue.title?.rendered || 'Issue'}
                    </h3>
                    {issue.date && (
                      <p className="meta-line">
                        <time dateTime={issue.date}>
                          {new Date(issue.date).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'long',
                            }
                          )}
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

export default MagazinePage;


