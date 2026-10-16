import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  /** Keep the page out of search results (404, thank-you pages) */
  noindex?: boolean;
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets the tab title, search description, social tags, canonical link and robots tag for the current page.
 * Search engines run this script; social platforms read only index.html, so the home-page tags there stay as the default.
 */
export function usePageMeta({ title, description, noindex = false }: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    // One address per page: the configured domain, the current path, no trailing slash (except the home page)
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const url = `${__SITE_URL__}${path === '/' ? '/' : path}`;
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, noindex]);
}
