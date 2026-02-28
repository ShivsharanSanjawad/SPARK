import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getCategories } from '../services/apiService';
import { useSiteSettings } from '../context/SiteContext';
import { useReveal } from '../hooks/useAnimations';
import { getMediaUrl } from '../utils/media';

/* ── Helper ─────────────────────────────────────── */
const strip = (html) => (html || '').replace(/<[^>]*>/g, '');
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const featImg = (p) => p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
const catName = (p) => p._embedded?.['wp:term']?.[0]?.[0]?.name;

/* ── HERO ───────────────────────────────────────── */
function HeroSection({ featured, posts, settings }) {
  const [ref, vis] = useReveal();
  const marqueeItems = posts.slice(0, 8);

  return (
    <section className="hero-cinematic">
      <div className="hero-glow" />

      <div className="app-container relative z-10 py-32 md:py-0 md:min-h-screen md:flex md:items-center">
        <div ref={ref} className={`w-full reveal ${vis ? 'visible' : ''}`}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <div className="overline mb-6"><span className="overline-dot" /> Welcome to Spark</div>
              <h1 className="mb-6">{settings.hero_title || 'Ideas That Ignite'}</h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 480 }}>
                {settings.hero_subtitle || 'A student-run editorial exploring technology, culture, and the unknown.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                {settings.hero_cta_text && (
                  <Link to={settings.hero_cta_url || '/articles'} className="btn btn-amber">{settings.hero_cta_text}</Link>
                )}
                {settings.hero_cta2_text && (
                  <Link to={settings.hero_cta2_url || '/about'} className="btn btn-outline-amber">{settings.hero_cta2_text}</Link>
                )}
              </div>
            </div>

            {/* Featured image with clip */}
            {featured && featImg(featured) && (
              <div className="hero-featured-clip" style={{ height: 420 }}>
                <img src={featImg(featured)} alt={strip(featured.title?.rendered)} className="w-full h-full object-cover" />
                <div className="picks-big-overlay">
                  {catName(featured) && <span className="badge-amber mb-2 self-start">{catName(featured)}</span>}
                  <h3 style={{ color: 'var(--cream)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
                    {strip(featured.title?.rendered)}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator hide-mobile">
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
        <div className="scroll-line" />
        <div className="scroll-dot" />
      </div>

      {/* Marquee */}
      {marqueeItems.length > 0 && (
        <div className="marquee-container">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((p, i) => (
              <span key={i} className="flex items-center gap-4 shrink-0">
                <span className="marquee-separator">✦</span>
                <span style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{strip(p.title?.rendered)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── THE STACK ──────────────────────────────────── */
function TheStack({ posts }) {
  const [ref, vis] = useReveal();
  if (posts.length < 3) return null;
  const items = posts.slice(0, 3);

  return (
    <section className="py-24" style={{ background: 'var(--black)' }}>
      <div className="app-container">
        <div ref={ref} className={`text-center mb-12 reveal ${vis ? 'visible' : ''}`}>
          <div className="overline justify-center mb-4"><span className="overline-dot" /> The Stack</div>
          <h2>Editor&apos;s Picks</h2>
        </div>
        <div className="stack-container">
          {items.map((p, i) => (
            <Link key={p.id} to={`/articles/${p.slug}`} className="stack-card card-dark overflow-hidden" style={{ zIndex: i === 1 ? 2 : 1 }}>
              <div style={{ height: 220, overflow: 'hidden' }}>
                {featImg(p) ? (
                  <img src={featImg(p)} alt={strip(p.title?.rendered)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: 'var(--surface-2)' }} />
                )}
              </div>
              <div className="p-5">
                {catName(p) && <span className="badge-amber mb-2 inline-block">{catName(p)}</span>}
                <h3 style={{ fontSize: '1.1rem', marginTop: 8 }}>{strip(p.title?.rendered)}</h3>
                <p className="line-clamp-2 mt-2" style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>{strip(p.excerpt?.rendered).slice(0, 100)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── THE FEED ───────────────────────────────────── */
function TheFeed({ posts }) {
  const [ref, vis] = useReveal();
  if (posts.length === 0) return null;

  return (
    <section className="py-24" style={{ background: 'var(--surface)' }}>
      <div className="app-container">
        <div ref={ref} className={`mb-12 reveal ${vis ? 'visible' : ''}`}>
          <div className="overline mb-4"><span className="overline-dot" /> The Feed</div>
          <h2>Recent Stories</h2>
        </div>
        <div>
          {posts.map((p, i) => (
            <Link key={p.id} to={`/articles/${p.slug}`} className="feed-row">
              <div className="feed-number">{String(i + 1).padStart(2, '0')}</div>
              <div>
                {catName(p) && <span className="badge-amber mb-2 inline-block">{catName(p)}</span>}
                <h3 style={{ fontSize: '1.15rem', margin: '4px 0' }}>{strip(p.title?.rendered)}</h3>
                <p className="line-clamp-2 hide-mobile" style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>{strip(p.excerpt?.rendered).slice(0, 120)}</p>
                <time style={{ color: 'var(--dim)', fontSize: '0.7rem', fontFamily: 'var(--font-label)' }}>{fmtDate(p.date)}</time>
              </div>
              <div className="feed-thumb hide-mobile">
                {featImg(p) ? <img src={featImg(p)} alt="" /> : <div className="w-full h-full" style={{ background: 'var(--surface-2)' }} />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SPARK PICKS ────────────────────────────────── */
function SparkPicks({ posts }) {
  const [ref, vis] = useReveal();
  if (posts.length < 4) return null;
  const big = posts[0];
  const smalls = posts.slice(1, 5);

  return (
    <section className="py-24" style={{ background: 'var(--black)' }}>
      <div className="app-container">
        <div ref={ref} className={`mb-12 reveal ${vis ? 'visible' : ''}`}>
          <div className="overline mb-4"><span className="overline-dot" /> Spark Picks</div>
          <h2>Don&apos;t Miss</h2>
        </div>
        <div className="picks-grid">
          {/* Big card */}
          <Link to={`/articles/${big.slug}`} className="picks-big card-dark overflow-hidden">
            {featImg(big) ? (
              <img src={featImg(big)} alt={strip(big.title?.rendered)} />
            ) : (
              <div className="w-full h-full" style={{ background: 'var(--surface-2)' }} />
            )}
            <div className="picks-big-overlay">
              {catName(big) && <span className="badge-amber mb-3">{catName(big)}</span>}
              <h3 style={{ fontSize: '1.6rem', color: 'var(--cream)' }}>{strip(big.title?.rendered)}</h3>
              <p className="line-clamp-2 mt-2" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{strip(big.excerpt?.rendered).slice(0, 150)}</p>
            </div>
          </Link>

          {/* Small list */}
          <div>
            {smalls.map((p) => (
              <Link key={p.id} to={`/articles/${p.slug}`} className="picks-small-item block">
                {catName(p) && <span className="badge-amber mb-1">{catName(p)}</span>}
                <h3 style={{ fontSize: '1rem', margin: '4px 0' }}>{strip(p.title?.rendered)}</h3>
                <time style={{ color: 'var(--dim)', fontSize: '0.7rem', fontFamily: 'var(--font-label)' }}>{fmtDate(p.date)}</time>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TOPIC CLOUDS ───────────────────────────────── */
function TopicClouds({ categories }) {
  const [ref, vis] = useReveal();
  const topics = useMemo(
    () =>
      (categories || []).map((c, i) => ({
        ...c,
        size: `${1 + Math.random() * 1.8}rem`,
        rot: `${(Math.random() - 0.5) * 8}deg`,
      })),
    [categories]
  );

  if (topics.length === 0) return null;

  return (
    <section className="py-24 text-center" style={{ background: 'var(--surface)' }}>
      <div className="app-container">
        <div ref={ref} className={`mb-12 reveal ${vis ? 'visible' : ''}`}>
          <div className="overline justify-center mb-4"><span className="overline-dot" /> Explore</div>
          <h2>Topic Cloud</h2>
          <p className="mt-4" style={{ color: 'var(--muted)', maxWidth: 400, margin: '16px auto 0' }}>
            Wander through the ideas. Click to filter.
          </p>
        </div>
        <div className="topic-cloud">
          {topics.map((t) => (
            <Link
              key={t.id}
              to={`/articles?cat=${t.id}`}
              className="topic-word"
              style={{ '--topic-size': t.size, '--topic-rot': t.rot }}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── MAIN HOME PAGE ─────────────────────────────── */
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSiteSettings();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [data, cats] = await Promise.all([
          getPosts({ perPage: 12 }),
          getCategories ? getCategories().catch(() => []) : Promise.resolve([]),
        ]);
        if (!cancelled) { setPosts(data); setCategories(cats); }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40 }} className="skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter app-container py-40 text-center">
        <p style={{ color: 'var(--amber)' }}>Error loading articles</p>
        <p style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>{error}</p>
      </div>
    );
  }

  const hero = posts[0];
  const stackPosts = posts.slice(1, 4);
  const feedPosts = posts.slice(4, 9);
  const pickPosts = posts.slice(0, 5);

  return (
    <div className="page-enter">
      <HeroSection featured={hero} posts={posts} settings={settings} />
      <TheStack posts={stackPosts} />
      <TheFeed posts={feedPosts} />
      <SparkPicks posts={pickPosts} />
      <TopicClouds categories={categories} />

      {/* CTA */}
      {settings.home_cta_show && (
        <section className="py-24 text-center" style={{ background: 'var(--black)' }}>
          <div className="app-container">
            <h2 className="mb-4">{settings.home_cta_title}</h2>
            <p style={{ color: 'var(--muted)', maxWidth: 500, margin: '0 auto 32px' }}>{settings.home_cta_text}</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}
                required
              />
              <button type="submit" className="btn btn-amber">Subscribe</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;


