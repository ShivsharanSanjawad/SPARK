import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAllPages } from '../api';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [extraPages, setExtraPages] = useState([]);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const pages = await getAllPages();
        if (!cancelled && Array.isArray(pages)) {
          // Show only top-level pages (no parent) and avoid duplicating About.
          const filtered = pages.filter(
            (p) => (!p.parent || p.parent === 0) && p.slug !== 'about'
          );
          // Sort by menu_order then title for a stable nav.
          filtered.sort((a, b) => {
            if (a.menu_order !== b.menu_order) {
              return a.menu_order - b.menu_order;
            }
            return (a.title?.rendered || '').localeCompare(
              b.title?.rendered || ''
            );
          });
          setExtraPages(filtered);
        }
      } catch {
        // Fail silently; core nav still works.
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="nav-shell">
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="nav-brand" onClick={closeMenu}>
              The Collegiate Review
            </Link>
          </div>

          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span />
            <span />
          </button>

          <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
            <NavLink
              to="/"
              className="nav-link"
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/articles"
              className="nav-link"
              onClick={closeMenu}
            >
              Articles
            </NavLink>
            <NavLink
              to="/magazine"
              className="nav-link"
              onClick={closeMenu}
            >
              Magazine
            </NavLink>
            <NavLink
              to="/reports"
              className="nav-link"
              onClick={closeMenu}
            >
              Annual Reports
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              onClick={closeMenu}
            >
              About
            </NavLink>
            {extraPages.map((page) => (
              <NavLink
                key={page.id}
                to={`/pages/${page.slug}`}
                className="nav-link"
                onClick={closeMenu}
              >
                {page.title?.rendered || page.slug}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;


