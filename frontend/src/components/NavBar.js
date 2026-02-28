import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteContext';
import { getAllPages } from '../services/apiService';

/* Minimal flame mark — amber */
function SparkMark({ size = 20 }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 120 160" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M60 8C60 8 20 60 20 100C20 130 38 152 60 152C82 152 100 130 100 100C100 60 60 8 60 8Z" fill="#f97316" opacity="0.85" />
      <path d="M60 40C60 40 38 72 38 96C38 116 48 132 60 132C72 132 82 116 82 96C82 72 60 40 60 40Z" fill="#fbbf24" opacity="0.7" />
      <path d="M60 70C60 70 48 88 48 102C48 114 54 122 60 122C66 122 72 114 72 102C72 88 60 70 60 70Z" fill="#fafaf9" opacity="0.6" />
    </svg>
  );
}

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [extraPages, setExtraPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings, menus } = useSiteSettings();

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  const hasPrimaryMenu = menus?.primary?.assigned && menus.primary.items.length > 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (hasPrimaryMenu) { setLoading(false); return; }
    let cancelled = false;
    async function load() {
      try {
        const pages = await getAllPages();
        if (!cancelled && Array.isArray(pages)) {
          const filtered = pages
            .filter((p) => (!p.parent || p.parent === 0) && p.slug !== 'about')
            .sort((a, b) => (a.menu_order - b.menu_order) || (a.title?.rendered || '').localeCompare(b.title?.rendered || ''));
          setExtraPages(filtered);
        }
      } catch (e) { console.error('Failed to load pages:', e); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [hasPrimaryMenu]);

  const renderLink = (to, label, key, end = false) => (
    <NavLink
      key={key}
      to={to}
      end={end}
      className={({ isActive }) => `nav-link-dark ${isActive ? 'active' : ''}`}
      onClick={closeMenu}
    >
      {label}
    </NavLink>
  );

  return (
    <header className={`nav-dark ${scrolled ? 'scrolled' : ''}`}>
      <nav className="app-container">
        <div className="flex items-center justify-between" style={{ height: scrolled ? 56 : 68, transition: 'height 0.3s' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <span className="transition-transform duration-300 group-hover:scale-110">
              <SparkMark size={18} />
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.05em', color: 'var(--cream)', textTransform: 'uppercase' }}>
              SPARK
            </span>
          </Link>

          {/* Hamburger – mobile */}
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className={`absolute h-0.5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`} style={{ background: 'var(--muted)' }} />
            <span className={`absolute h-0.5 w-5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: 'var(--muted)' }} />
            <span className={`absolute h-0.5 w-5 transition-all duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`} style={{ background: 'var(--muted)' }} />
          </button>

          {/* Links */}
          <div
            className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-auto left-0 right-0 md:left-auto md:right-auto flex-col md:flex-row items-start md:items-center gap-2 md:gap-7 p-5 md:p-0 z-40`}
            style={{
              background: menuOpen ? 'rgba(9,9,11,0.95)' : 'transparent',
              backdropFilter: menuOpen ? 'blur(20px)' : 'none',
              borderBottom: menuOpen ? '1px solid var(--border)' : 'none',
            }}
          >
            {hasPrimaryMenu ? (
              menus.primary.items.map((item) =>
                renderLink(item.path || item.url, item.title, item.id)
              )
            ) : (
              <>
                {renderLink('/', 'Home', 'home', true)}
                {renderLink('/articles', 'Articles', 'articles')}
                {renderLink('/magazine', 'Magazine', 'magazine')}
                {renderLink('/reports', 'Reports', 'reports')}
                {renderLink('/about', 'About', 'about')}
                {extraPages.map((page) =>
                  renderLink(`/pages/${page.slug}`, page.title?.rendered || page.title, page.id)
                )}
              </>
            )}

            {/* CTA */}
            <Link to="/articles" className="nav-cta hide-mobile" onClick={closeMenu}>
              Read
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;


