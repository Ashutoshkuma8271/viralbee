import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * The site's public address. Canonical links, social-preview URLs, structured data, robots.txt and sitemap.xml are
 * all built from this one value. PLACEHOLDER: set the real domain before launch (or set SITE_URL in the hosting
 * environment), otherwise search engines are told the pages live on this domain.
 */
const SITE_URL = (process.env.SITE_URL || 'https://vyralbee.com').replace(/\/$/, '');

/** Public, indexable routes. Keep in step with the routes in src/App.tsx (404 is deliberately not listed). */
const ROUTES = ['/', '/about', '/services', '/process', '/work', '/packages', '/contact', '/privacy'];

function seoFiles(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'viral-bee-seo-files',
    configResolved(resolved) {
      config = resolved;
    },
    // index.html uses %SITE_URL% wherever an absolute address is required
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', SITE_URL);
    },
    // Written after Vite copies /public, so these generated versions are the ones that ship
    closeBundle() {
      if (config.command !== 'build') return;
      const out = path.resolve(config.root, config.build.outDir);
      const today = new Date().toISOString().slice(0, 10);
      const urls = ROUTES.map(
        (route) =>
          `  <url><loc>${SITE_URL}${route}</loc><lastmod>${today}</lastmod><priority>${route === '/' ? '1.0' : '0.7'}</priority></url>`,
      ).join('\n');
      fs.writeFileSync(
        path.join(out, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Keep Vite's dep cache outside OneDrive; OneDrive sync locks files and causes EPERM on rmdir.
  cacheDir: path.join(os.tmpdir(), 'vite-cache', 'viral-bee'),
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  plugins: [react(), tailwindcss(), seoFiles()],
  build: {
    // The real-time 3D scenes (three.js) live in one lazy chunk that only downloads after the page has painted,
    // so its size is expected; raise the warning limit just above it.
    chunkSizeWarningLimit: 1200,
  },
});
