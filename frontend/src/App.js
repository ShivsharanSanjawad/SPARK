import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteProvider, useSiteSettings } from './context/SiteContext';
import NavBar from './components/NavBar';
import SplashScreen from './components/SplashScreen';
import EmberParticles from './components/EmberParticles';
import GrainOverlay from './components/GrainOverlay';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import MagazinePage from './pages/MagazinePage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import PagePage from './pages/PagePage';
import MemberPage from './pages/MemberPage';
import './index.css';

/* ── Spark Flame SVG for footer ── */
function FooterFlame() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.85 }}>
      <path d="M32 4c0 0-20 22-20 38a20 20 0 0040 0C52 26 32 4 32 4z" fill="url(#ff1)" />
      <path d="M32 20c0 0-10 12-10 22a10 10 0 0020 0C42 32 32 20 32 20z" fill="url(#ff2)" />
      <defs>
        <linearGradient id="ff1" x1="32" y1="4" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" /><stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="ff2" x1="32" y1="20" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" /><stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Social Icons ── */
const socialIcons = {
  Twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  GitHub: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ),
  Facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  Email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
};

function AppShell() {
  const { settings } = useSiteSettings();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  const socialLinks = [
    settings.social_twitter && { label: 'Twitter', url: settings.social_twitter },
    settings.social_github && { label: 'GitHub', url: settings.social_github },
    settings.social_email && { label: 'Email', url: `mailto:${settings.social_email}` },
    settings.social_instagram && { label: 'Instagram', url: settings.social_instagram },
    settings.social_linkedin && { label: 'LinkedIn', url: settings.social_linkedin },
    settings.social_facebook && { label: 'Facebook', url: settings.social_facebook },
  ].filter(Boolean);

  return (
    <>
      <EmberParticles />
      <GrainOverlay />
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <div className={`app min-h-screen flex flex-col ${splashDone ? 'page-enter' : 'opacity-0'}`} style={{ background: 'var(--black)' }}>
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/magazine" element={<MagazinePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/committee/:id" element={<MemberPage />} />
            <Route path="/pages/:slug" element={<PagePage />} />
          </Routes>
        </main>

        {/* ── Footer ── */}
        <footer className="footer-spark relative overflow-hidden">
          <div className="relative z-10">
            <div className="app-container py-16 md:py-20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                {/* Brand */}
                <div className="md:col-span-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <FooterFlame />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cream)' }}>
                      {settings.footer_brand || 'Spark'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--dim)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 320 }}>
                    {settings.footer_tagline || 'What ignites SP \u2014 a student-run journal of ideas, analysis, and creativity.'}
                  </p>
                </div>

                {/* Navigation */}
                <div className="md:col-span-2">
                  <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-label)', fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Navigate</h4>
                  <ul className="space-y-3">
                    {[
                      { label: 'Home', href: '/' },
                      { label: 'Articles', href: '/articles' },
                      { label: 'Magazine', href: '/magazine' },
                      { label: 'About', href: '/about' },
                    ].map(link => (
                      <li key={link.href}>
                        <a href={link.href} style={{ fontSize: '0.875rem', color: 'var(--muted)' }} className="hover:text-amber-400 transition-colors">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="md:col-span-2">
                  <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-label)', fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Resources</h4>
                  <ul className="space-y-3">
                    {[
                      { label: 'Reports', href: '/reports' },
                      { label: 'Submit Article', href: '#' },
                      { label: 'Contact Us', href: '#' },
                    ].map(link => (
                      <li key={link.label}>
                        <a href={link.href} style={{ fontSize: '0.875rem', color: 'var(--muted)' }} className="hover:text-amber-400 transition-colors">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social */}
                <div className="md:col-span-4">
                  <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-label)', fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Connect</h4>
                  {socialLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map(link => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-amber-400 transition-all"
                          style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', border: '1px solid var(--border)' }}
                          title={link.label}
                        >
                          {socialIcons[link.label] || <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{link.label[0]}</span>}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--dim)' }}>No social links configured.</p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }} className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <p style={{ color: 'var(--dim)' }}>
                  Published by{' '}
                  <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{settings.site_name || 'Spark'}</span>
                </p>
                <p style={{ color: 'var(--dim)' }}>{settings.footer_copyright || `\u00A9 ${new Date().getFullYear()} Spark. All rights reserved.`}</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  );
}

export default App;


