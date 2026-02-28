import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts, getCategories } from '../services/apiService';
import { useReveal } from '../hooks/useAnimations';

const strip = (h) => (h || '').replace(/<[^>]*>/g, '');
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function RevealItem({ children, index }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 60}ms` }}>
      {children}
    </div>
  );
}

function ArticlesPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [headerRef, headerVisible] = useReveal();

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [postData, categoryData] = await Promise.all([getPosts({ perPage: 48 }), getCategories()]);
        if (!cancelled) { setPosts(postData); setCategories(categoryData); }
      } catch (err) { if (!cancelled) setError(err.message); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchCat = activeCategory === 'all' || (post.categories || []).includes(Number(activeCategory));
    const matchSearch = searchTerm === '' ||
      (post.title?.rendered || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt?.rendered || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: 'var(--black)' }}>
        <div ref={headerRef} className={`app-container reveal ${headerVisible ? 'visible' : ''}`}>
          <div className="overline mb-4"><span className="overline-dot" /> Explore</div>
          <h1>Articles</h1>
          <p className="mt-4" style={{ color: 'var(--muted)', maxWidth: 500 }}>
            Dive into essays, reflections, and reports spanning diverse topics and perspectives.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="app-container pb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5"
              style={{ background: 'var(--black)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}
            />
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={activeCategory === 'all' ? 'badge-amber' : 'badge-amber'}
                style={activeCategory === 'all'
                  ? { background: 'var(--amber)', color: 'var(--black)' }
                  : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--dim)' }
                }
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(String(cat.id))}
                  className="badge-amber"
                  style={activeCategory === String(cat.id)
                    ? { background: 'var(--amber)', color: 'var(--black)' }
                    : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--dim)' }
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4" style={{ color: 'var(--dim)', fontSize: '0.75rem', fontFamily: 'var(--font-label)' }}>
          Showing <span style={{ color: 'var(--cream)' }}>{filteredPosts.length}</span> article{filteredPosts.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </section>

      {/* Articles Grid */}
      <section className="app-container pb-24">
        {error && (
          <div className="p-4 mb-8" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--amber)' }}>
            <p style={{ fontWeight: 600 }}>Error loading articles</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card-dark overflow-hidden">
                <div className="skeleton" style={{ height: 200 }} />
                <div className="p-5 space-y-3">
                  <div className="skeleton" style={{ height: 18, width: '75%' }} />
                  <div className="skeleton" style={{ height: 14, width: '100%' }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((article, i) => {
              const ft = article._embedded?.['wp:featuredmedia']?.[0];
              const cats = article._embedded?.['wp:term']?.[0] || [];
              const ttl = strip(article.title?.rendered) || 'Untitled';
              const exc = strip(article.excerpt?.rendered).slice(0, 120);

              return (
                <RevealItem key={article.id} index={i % 6}>
                  <Link to={`/articles/${article.slug}`} className="card-dark overflow-hidden group block h-full">
                    <div className="relative overflow-hidden" style={{ height: 200 }}>
                      {ft?.source_url ? (
                        <img src={ft.source_url} alt={ttl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" style={{ filter: 'saturate(0.8)' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--dim)' }}>S</span>
                        </div>
                      )}
                      {cats[0] && <span className="badge-amber absolute top-3 left-3">{cats[0].name}</span>}
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-2 transition-colors group-hover:text-amber-400" style={{ fontSize: '1rem', marginBottom: 8 }}>{ttl}</h3>
                      <p className="line-clamp-2" style={{ color: 'var(--dim)', fontSize: '0.8rem', marginBottom: 12 }}>{exc}</p>
                      <div className="flex items-center justify-between" style={{ fontSize: '0.7rem', fontFamily: 'var(--font-label)', color: 'var(--dim)' }}>
                        <time dateTime={article.date}>{fmtDate(article.date)}</time>
                        <span style={{ color: 'var(--amber)' }} className="group-hover:translate-x-1 transition-transform inline-block">Read →</span>
                      </div>
                    </div>
                  </Link>
                </RevealItem>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>✦</div>
            <h3 style={{ marginBottom: 8 }}>No articles found</h3>
            <p style={{ color: 'var(--dim)' }}>{searchTerm ? `Nothing matched "${searchTerm}"` : 'Try selecting a different category.'}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ArticlesPage;


