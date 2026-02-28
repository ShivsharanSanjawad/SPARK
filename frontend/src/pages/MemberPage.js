import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCommitteeMemberById, getCommitteeMembers } from '../services/apiService';
import ContentRenderer from '../components/ContentRenderer';
import { useReveal } from '../hooks/useAnimations';

function RevealItem({ children, index = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 80}ms` }}>
      {children}
    </div>
  );
}

function MemberPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [otherMembers, setOtherMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerRef, headerVisible] = useReveal();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [data, allMembers] = await Promise.all([
          getCommitteeMemberById(id),
          getCommitteeMembers(),
        ]);
        if (!cancelled) {
          if (!data) setError('Member not found.');
          else {
            setMember(data);
            setOtherMembers((allMembers || []).filter(m => m.id !== data.id).slice(0, 4));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load member details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
        <div className="skeleton" style={{ height: 192 }} />
        <div className="app-container py-12">
          <div style={{ maxWidth: 960, margin: '0 auto' }} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1"><div className="skeleton" style={{ height: 320, borderRadius: 12 }} /></div>
            <div className="md:col-span-2 space-y-4"><div className="skeleton" style={{ height: 28, width: '75%' }} /><div className="skeleton" style={{ height: 18, width: '50%' }} /><div className="skeleton" style={{ height: 14 }} /><div className="skeleton" style={{ height: 14 }} /><div className="skeleton" style={{ height: 14, width: '66%' }} /></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
        <section className="pt-32 pb-20 text-center">
          <div className="app-container">
            <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>✦</div>
            <h1 style={{ marginBottom: 16 }}>Member Not Found</h1>
            <p style={{ color: 'var(--dim)', marginBottom: 32 }}>{error}</p>
            <Link to="/about" className="btn btn-amber">← Back to About</Link>
          </div>
        </section>
      </div>
    );
  }

  const featured = member._embedded?.['wp:featuredmedia']?.[0];
  const name = member.title?.rendered || 'Committee Member';
  const position = member.position || member.meta?.position || '';
  const role = position || (member.excerpt?.rendered ? member.excerpt.rendered.replace(/<[^>]*>/g, '').trim() : '');
  const bio = member.content?.rendered || '';

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: 'var(--black)' }}>
        <div ref={headerRef} className={`app-container reveal ${headerVisible ? 'visible' : ''}`}>
          <nav className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--dim)' }}>
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/about" className="hover:text-amber-400 transition-colors">About</Link>
            <span>/</span>
            <span style={{ color: 'var(--cream)' }}>{name}</span>
          </nav>
          <h1 style={{ marginBottom: 12 }}>{name}</h1>
          {role && <span className="badge-amber text-sm">{role}</span>}
        </div>
      </section>

      {/* Main Content */}
      <section className="app-container pb-20">
        <div style={{ maxWidth: 960, margin: '0 auto' }} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Photo */}
          <div className="md:col-span-1">
            <RevealItem>
              {featured?.source_url && (
                <div className="overflow-hidden mb-6" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
                  <img src={featured.source_url} alt={name} className="w-full h-auto object-cover" style={{ filter: 'saturate(0.85)' }} />
                </div>
              )}
              {role && (
                <div className="card-dark p-4 mb-4 text-center">
                  <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-label)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Position</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cream)' }}>{role}</p>
                </div>
              )}
              <Link to="/about" className="btn btn-outline-amber w-full text-center text-sm group">
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                All Committee Members
              </Link>
            </RevealItem>
          </div>

          {/* Right: Bio */}
          <div className="md:col-span-2">
            <RevealItem index={1}>
              {bio ? (
                <div className="prose-dark" style={{ maxWidth: 'none' }}>
                  <ContentRenderer content={bio} />
                </div>
              ) : (
                <div className="text-center py-16">
                  <p style={{ color: 'var(--dim)', fontSize: '1.1rem' }}>No detailed bio available for this member.</p>
                </div>
              )}
            </RevealItem>
          </div>
        </div>
      </section>

      {/* Other Members */}
      {otherMembers.length > 0 && (
        <section className="py-20" style={{ background: 'var(--surface)' }}>
          <div className="app-container">
            <div className="mb-10 text-center">
              <div className="overline justify-center mb-3"><span className="overline-dot" /> The Team</div>
              <h2>Other Committee Members</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {otherMembers.map((m, i) => {
                const mImg = m._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const mName = m.title?.rendered || 'Member';
                const mRole = m.position || m.meta?.position || (m.excerpt?.rendered ? m.excerpt.rendered.replace(/<[^>]*>/g, '').trim() : '');
                return (
                  <RevealItem key={m.id} index={i}>
                    <Link to={`/committee/${m.id}`} className="group text-center block">
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-4 transition-all duration-300" style={{ border: '2px solid var(--border)' }}>
                        {mImg ? (
                          <img src={mImg} alt={mName} className="w-full h-full object-cover" style={{ filter: 'saturate(0.8)' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                            <span style={{ color: 'var(--dim)', fontSize: '1.5rem', fontWeight: 700 }}>{mName[0]}</span>
                          </div>
                        )}
                      </div>
                      <p className="group-hover:text-amber-400 transition-colors" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--cream)' }}>{mName}</p>
                      {mRole && <p style={{ fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 500, marginTop: 4 }}>{mRole.slice(0, 50)}</p>}
                    </Link>
                  </RevealItem>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default MemberPage;
