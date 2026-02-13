import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import MagazinePage from './pages/MagazinePage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import PagePage from './pages/PagePage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <main className="main-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/magazine" element={<MagazinePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Generic WordPress pages route, e.g. /pages/contact, /pages/team */}
            <Route path="/pages/:slug" element={<PagePage />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>
            Published by the <span className="footer-accent">Collegiate Review</span>.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;


