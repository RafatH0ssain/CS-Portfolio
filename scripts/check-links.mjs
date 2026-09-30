#!/usr/bin/env node
// check-links — fails on links that go nowhere. An earlier portfolio (see
// docs/LEARNINGS.md) shipped a "Résumé" button pointing at "#resume", which did not
// exist. This script exists so that never happens again.
//
//   node scripts/check-links.mjs              # internal links and anchors only
//   node scripts/check-links.mjs --external   # also request every external URL
import { readdir, readFile, access } from 'node:fs/promises';
import { join, relative, dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const EXTERNAL = args.includes('--external');
const ROOT = resolve(args.find(a => !a.startsWith('--')) || 'dist');

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { console.error(`check-links: cannot read "${dir}". Run the build first.`); process.exit(2); }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out); else out.push(p);
  }
  return out;
}
const exists = f => access(f).then(() => true, () => false);

const pages = (await walk(ROOT)).filter(f => f.endsWith('.html'));
const idsByFile = new Map();
for (const p of pages) {
  const html = await readFile(p, 'utf8');
  idsByFile.set(p, new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m => m[1])));
}

async function targetFile(page, path) {
  let f = path.startsWith('/') ? join(ROOT, path) : join(dirname(page), path);
  if (path === '' ) return page;
  if (f.endsWith('/')) f = join(f, 'index.html');
  if (await exists(f)) return (await exists(join(f, 'index.html'))) ? join(f, 'index.html') : f;
  if (await exists(f + '.html')) return f + '.html';
  if (await exists(join(f, 'index.html'))) return join(f, 'index.html');
  return null;
}

const problems = [];
const external = new Set();

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const name = relative(ROOT, page);
  for (const m of html.matchAll(/<(a|link|img|script|source|form)\b[^>]*?\s(href|src|action)=["']([^"']*)["']/gi)) {
    const [, tag, attr, raw] = m;
    const url = raw.trim();
    if (tag.toLowerCase() === 'link' && /preconnect|dns-prefetch/.test(m[0])) continue;
    if (url === '' || url === '#') { problems.push(`${name}: <${tag} ${attr}="${url}"> goes nowhere`); continue; }
    if (/^javascript:/i.test(url)) { problems.push(`${name}: javascript: URL`); continue; }
    if (/^mailto:/i.test(url)) {
      if (!/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(url.split('?')[0])) problems.push(`${name}: malformed ${url}`);
      if (/example\.com/i.test(url)) problems.push(`${name}: placeholder address ${url}`);
      continue;
    }
    if (/^tel:/i.test(url)) { problems.push(`${name}: tel: link found; the phone number is not published`); continue; }
    if (/^https?:\/\//i.test(url)) {
      if (/FORMSPREE_ID|example\.com/.test(url)) problems.push(`${name}: placeholder URL ${url}`);
      external.add(url); continue;
    }
    if (/^(data:|\/\/)/.test(url)) continue;

    const [pathPart, hash] = url.split('#');
    const file = await targetFile(page, pathPart.split('?')[0]);
    if (!file) { problems.push(`${name}: ${url} does not exist`); continue; }
    if (hash && file.endsWith('.html') && !idsByFile.get(file)?.has(decodeURIComponent(hash))) {
      problems.push(`${name}: ${url} points to #${hash}, which is not on ${relative(ROOT, file)}`);
    }
  }
}

if (EXTERNAL) {
  for (const url of external) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
      if (res.status === 405 || res.status === 403) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
      clearTimeout(t);
      if (res.status >= 400) problems.push(`external ${url} returned ${res.status}`);
    } catch (e) {
      problems.push(`external ${url} failed: ${e.name === 'AbortError' ? 'timeout' : e.message}`);
    }
  }
}

if (problems.length) {
  console.error(`\ncheck-links: ${problems.length} broken link${problems.length === 1 ? '' : 's'}\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}
console.log(`check-links: ${pages.length} pages, internal links OK${EXTERNAL ? `, ${external.size} external links OK` : ` (${external.size} external not requested; use --external)`}.`);
