import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCommitteeMembers } from '../services/apiService';
import { useReveal } from '../hooks/useAnimations';

function RevealItem({ children, index }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 80}ms` }}>
      {children}
    </div>
  );
}

function CommitteeMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMembers() {
      try {
        setLoading(true);
        const data = await getCommitteeMembers();
        if (!cancelled) setMembers(data || []);
      } catch (err) {
        if (!cancelled) { setError(err.message); console.error('Failed to load committee members:', err); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMembers();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-dark overflow-hidden">
            <div className="skeleton" style={{ height: 260 }} />
            <div className="p-5 space-y-3"><div className="skeleton" style={{ height: 18, width: '75%' }} /><div className="skeleton" style={{ height: 14, width: '50%' }} /></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--amber)' }}>
        <p style={{ fontWeight: 600 }}>Error loading committee members</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>{error}</p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-16">
        <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>✦</div>
        <p style={{ color: 'var(--dim)' }}>No committee members found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, i) => {
        const name = member.title?.rendered || 'Unknown';
        const position = member.position || member.meta?.position || '';
        const role = position || (member.excerpt?.rendered ? member.excerpt.rendered.replace(/<[^>]*>/g, '').trim() : '');
        const imgUrl = member._embedded?.['wp:featuredmedia']?.[0]?.source_url;

        return (
          <RevealItem key={member.id} index={i}>
            <Link to={`/committee/${member.id}`} className="card-dark overflow-hidden group block">
              <div className="relative overflow-hidden" style={{ height: 260 }}>
                {imgUrl ? (
                  <img src={imgUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" style={{ filter: 'saturate(0.8)' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--dim)' }}>{name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <h3 className="group-hover:text-amber-400 transition-colors" style={{ fontSize: '1.1rem', marginBottom: 8 }}>
                  {name}
                </h3>
                {role && <span className="badge-amber text-xs">{role}</span>}
                <p className="mt-3 text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--amber)', fontFamily: 'var(--font-label)', fontWeight: 500 }}>
                  View Profile
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </p>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </div>
  );
}

export default CommitteeMembers;
