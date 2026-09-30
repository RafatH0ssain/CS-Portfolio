import type { APIRoute } from 'astro';

// Derived from `site` in astro.config.mjs so it can never go stale when the
// domain changes. docs/SPEC.md lists this as public/robots.txt; an endpoint is
// used instead so the owner only has to set the domain in one place.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /
Sitemap: ${new URL('/sitemap.xml', site).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
