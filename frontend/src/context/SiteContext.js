import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings, getMenus } from '../services/apiService';

/**
 * Default settings matching the WordPress plugin defaults.
 * Used as fallback when the API is unreachable.
 */
const defaultSettings = {
  site_name: 'Spark',
  site_tagline: 'A journal of ideas and essays from a curious campus.',
  site_description: 'Explore diverse perspectives across disciplines.',

  hero_title: 'Spark',
  hero_subtitle:
    'A journal of ideas, essays, and reflections from a curious campus. Explore diverse perspectives across disciplines.',
  hero_cta_text: 'Explore Articles',
  hero_cta_url: '/articles',
  hero_cta2_text: 'About Us',
  hero_cta2_url: '/about',

  color_primary: '#0284c7',
  color_secondary: '#38bdf8',
  color_accent: '#0ea5e9',

  footer_brand: 'Spark',
  footer_tagline: 'A journal of ideas and essays from a curious campus.',
  footer_copyright: `© ${new Date().getFullYear()} All rights reserved.`,

  social_twitter: '',
  social_github: '',
  social_email: '',
  social_instagram: '',
  social_linkedin: '',
  social_facebook: '',

  home_cta_title: 'Stay Updated',
  home_cta_text:
    'Subscribe to receive the latest articles and publications directly to your inbox.',
  home_cta_show: true,

  about_cta_title: 'Get Involved',
  about_cta_text:
    'We welcome submissions from students, faculty, and guest writers. Contribute your voice to the conversation.',
  about_cta_button: 'Submit an Article',
  about_cta_url: '#contact',

  custom_css: '',
};

const SiteContext = createContext({
  settings: defaultSettings,
  menus: { primary: { items: [] }, footer: { items: [] } },
  loading: true,
});

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [menus, setMenus] = useState({ primary: { items: [] }, footer: { items: [] } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [settingsData, menusData] = await Promise.all([
          getSiteSettings(),
          getMenus(),
        ]);

        if (!cancelled) {
          if (settingsData) setSettings({ ...defaultSettings, ...settingsData });
          if (menusData) setMenus(menusData);
        }
      } catch (err) {
        console.warn('Failed to load site settings/menus:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Inject CSS custom properties for theme colours
  useEffect(() => {
    if (settings.color_primary) {
      document.documentElement.style.setProperty('--color-primary', settings.color_primary);
    }
    if (settings.color_secondary) {
      document.documentElement.style.setProperty('--color-secondary', settings.color_secondary);
    }
    if (settings.color_accent) {
      document.documentElement.style.setProperty('--color-accent', settings.color_accent);
    }
  }, [settings.color_primary, settings.color_secondary, settings.color_accent]);

  // Inject custom CSS from WordPress admin into <head>
  useEffect(() => {
    const STYLE_ID = 'spark-wp-custom-css';
    let styleEl = document.getElementById(STYLE_ID);

    if (settings.custom_css) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = settings.custom_css;
    } else if (styleEl) {
      styleEl.remove();
    }

    return () => {
      // Cleanup on unmount
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, [settings.custom_css]);

  return (
    <SiteContext.Provider value={{ settings, menus, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteContext);
}

export default SiteContext;
