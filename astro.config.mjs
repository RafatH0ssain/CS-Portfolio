// Astro configuration. Verified against Astro 7.3.5.
// Ask the owner before changing anything in this file.
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Replace with the real domain once the owner has one (ask them).
  // Used for canonical URLs, Open Graph tags and the sitemap.
  site: 'https://portfolio.invalid',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'never', // one cached stylesheet for every page
  },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
});
