import React, { useEffect, useState } from 'react';
import { getPageBySlug, getCommitteeMembers } from '../api';
import { getFeaturedImageUrl } from '../utils/media';

function AboutPage() {
  const [page, setPage] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [pageData, memberData] = await Promise.all([
          getPageBySlug('about'),
          getCommitteeMembers(),
        ]);

        if (!cancelled) {
          if (!pageData) {
            setError('About page not found in WordPress.');
          } else {
            setPage(pageData);
            setMembers(memberData || []);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load About page.');
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
              {page.title?.rendered || 'About'}
            </h1>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{
                __html: page.content?.rendered || '',
              }}
            />

            {/* Committee members section */}
            {members.length > 0 && (
              <section className="about-committee">
                <h2 className="section-title-large">Editorial Committee</h2>
                <p className="section-intro">
                  The committee responsible for the curation and direction of the journal.
                </p>
                <div className="about-members-grid">
                  {members.map((member) => {
                    const imageUrl = getFeaturedImageUrl(member);
                    return (
                      <article key={member.id} className="about-member-card">
                        <div className="about-member-photo-wrapper">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={member.title?.rendered || 'Committee member'}
                              className="about-member-photo"
                              loading="lazy"
                            />
                          ) : (
                            <div className="about-member-placeholder">
                              <span>{member.title?.rendered?.[0] || 'M'}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="about-member-name">
                          {member.title?.rendered || 'Committee Member'}
                        </h3>
                        {member.excerpt?.rendered && (
                          <div
                            className="about-member-role"
                            dangerouslySetInnerHTML={{
                              __html: member.excerpt.rendered,
                            }}
                          />
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default AboutPage;


