import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, getPosts } from '../services/apiService';
import ContentRenderer from '../components/ContentRenderer';
import { useReveal } from '../hooks/useAnimations';
import { getFeaturedImageUrl } from '../utils/media';

const strip = (h) => (h || '').replace(/<[^>]*>/g, '');

function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /* Reading progress */
  const onScroll = useCallback(() => {
    const el = document.getElementById('article-body');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.scrollHeight - window.innerHeight;
    const current = -rect.top;
    setProgress(Math.max(0, Math.min(100, (current / total) * 100)));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getPostBySlug(slug);
        if (!cancelled) {
          if (!data) { setError('Article not found.'); } else {
            setPost(data);
            try {
              const allPosts = await getPosts({ perPage: 100 });
              setRelatedPosts(allPosts.filter(p => p.id !== data.id).slice(0, 3));
            } catch (e) { console.warn('Related posts failed:', e); }
          }
        }
      } catch (err) { if (!cancelled) setError(err.message || 'Failed to load article.'); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
        <div className="skeleton" style={{ height: 400 }} />
        <div className="app-container py-12 space-y-4" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 36, width: '75%' }} />
          <div className="skeleton" style={{ height: 18, width: '50%' }} />
          <div className="skeleton" style={{ height: 14, width: '100%' }} />
          <div className="skeleton" style={{ height: 14, width: '100%' }} />
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
        <section className="pt-32 pb-16 text-center">
          <div className="app-container">
            <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>✦</div>
            <h1 style={{ fontSize: '2.5rem' }}>Article Not Found</h1>
            <p style={{ color: 'var(--dim)', marginTop: 8, marginBottom: 24 }}>{error}</p>
            <Link to="/articles" className="btn btn-amber">← Back to Articles</Link>
          </div>
        </section>
      </div>
    );
  }

  const featured = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const title = strip(post.title?.rendered) || 'Untitled';
  const authorName = post._embedded?.['author']?.[0]?.name || 'Anonymous';
  const dateStr = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="page-enter" style={{ background: 'var(--black)' }}>
      {/* Reading progress bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: featured?.source_url ? 480 : 300 }}>
        {featured?.source_url && (
          <>
            <img src={featured.source_url} alt={title} className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.7) brightness(0.5)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--black) 0%, rgba(9,9,11,0.3) 60%, transparent 100%)' }} />
          </>
        )}
        {!featured?.source_url && (
          <div className="absolute inset-0" style={{ background: 'var(--surface)' }} />
        )}

        <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: featured?.source_url ? 480 : 300, padding: '0 0 3rem 0' }}>
          <div className="app-container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-4" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-label)', color: 'var(--dim)' }}>
              <Link to="/" style={{ color: 'var(--dim)' }} className="hover:text-amber-400 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/articles" style={{ color: 'var(--dim)' }} className="hover:text-amber-400 transition-colors">Articles</Link>
            </nav>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(cat => <span key={cat.id} className="badge-amber">{cat.name}</span>)}
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', maxWidth: 800 }}>{title}</h1>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article id="article-body" className="app-container py-12 md:py-16">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-10 pb-6" style={{ borderBottom: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--dim)', fontFamily: 'var(--font-label)' }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span style={{ color: 'var(--cream)' }}>{authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <time dateTime={post.date}>{dateStr}</time>
            </div>
          </div>

          {/* Excerpt as pull-quote */}
          {post.excerpt?.rendered && (
            <blockquote className="prose-dark" style={{
              fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.5rem', lineHeight: 1.4,
              color: 'var(--amber)', textAlign: 'center', padding: '0', border: 'none', margin: '0 0 2.5rem'
            }}>
              <p style={{ color: 'var(--amber)' }}>{strip(post.excerpt.rendered)}</p>
            </blockquote>
          )}

          {/* Body */}
          <div className="prose-dark mb-12">
            <ContentRenderer content={post.content?.rendered} useBlocks={false} />
          </div>

          {/* Back */}
          <div className="py-8" style={{ borderTop: '1px solid var(--border)' }}>
            <Link to="/articles" className="btn-ghost inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              Back to Articles
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="py-20" style={{ background: 'var(--surface)' }}>
          <div className="app-container">
            <div className="text-center mb-12">
              <div className="overline justify-center mb-4"><span className="overline-dot" /> Keep Reading</div>
              <h2>Related Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((article) => {
                const imgUrl = getFeaturedImageUrl(article);
                const artTitle = strip(article.title?.rendered) || 'Untitled';
                const artCats = article._embedded?.['wp:term']?.[0] || [];
                return (
                  <Link key={article.id} to={`/articles/${article.slug}`} className="card-dark overflow-hidden group block">
                    <div className="relative overflow-hidden" style={{ height: 200 }}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={artTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" style={{ filter: 'saturate(0.8)' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--dim)' }}>{artTitle[0]}</span>
                        </div>
                      )}
                      {artCats[0] && <span className="badge-amber absolute top-3 left-3">{artCats[0].name}</span>}
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-2 group-hover:text-amber-400 transition-colors" style={{ fontSize: '1rem' }}>{artTitle}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ArticlePage;


