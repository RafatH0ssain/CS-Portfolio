#!/usr/bin/env node
// check-budget — fails when any built page is heavier than the budget in
// docs/SPEC.md. Measures what a first visit downloads: the HTML, its
// stylesheets, its scripts and its preloaded fonts, all gzip-compressed
// (fonts are already compressed). Images are checked one by one.
//
//   node scripts/check-budget.mjs          # checks ./dist
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname, relative, dirname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(process.argv[2] || 'dist');
const PAGE_BUDGET_KB = 160;   // html + css + js + preloaded fonts, first load
const JS_BUDGET_KB = 8;       // all scripts on a page, gzipped
const IMAGE_BUDGET_KB = 200;  // any single image file

const kb = n => n / 1024;
const gz = buf => gzipSync(buf, { level: 9 }).length;

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { console.error(`check-budget: cannot read "${dir}". Run the build first.`); process.exit(2); }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out); else out.push(p);
  }
  return out;
}

function resolveRef(pageFile, ref) {
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) return null;
  const clean = ref.split(/[?#]/)[0];
  return clean.startsWith('/') ? join(ROOT, clean) : join(dirname(pageFile), clean);
}

async function sizeOf(file, compress) {
  try { const b = await readFile(file); return compress ? gz(b) : b.length; }
  catch { return null; }
}

const files = await walk(ROOT);
const problems = [];
const rows = [];

for (const page of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(page, 'utf8');
  let total = gz(Buffer.from(html));
  let js = 0;
  const external = [];

  for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)) {
    const href = m[0].match(/href=["']([^"']+)["']/)?.[1];
    if (!href) continue;
    const f = resolveRef(page, href);
    if (!f) { external.push(href); continue; }
    const s = await sizeOf(f, true); if (s != null) total += s;
  }
  for (const m of html.matchAll(/<link[^>]+rel=["']preload["'][^>]*>/gi)) {
    const href = m[0].match(/href=["']([^"']+)["']/)?.[1];
    if (!href) continue;
    const f = resolveRef(page, href);
    if (!f) { external.push(href); continue; }
    const s = await sizeOf(f, false); if (s != null) total += s;
  }
  for (const m of html.matchAll(/<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi)) {
    const f = resolveRef(page, m[1]);
    if (!f) { external.push(m[1]); continue; }
    const s = await sizeOf(f, true); if (s != null) { total += s; js += s; }
  }
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)(?![^>]*application\/(?:ld\+)?json)[^>]*>([\s\S]*?)<\/script>/gi)) {
    js += gz(Buffer.from(m[1]));
  }

  const name = relative(ROOT, page);
  rows.push([name, kb(total).toFixed(1), kb(js).toFixed(1)]);
  if (kb(total) > PAGE_BUDGET_KB) problems.push(`${name}: first load ${kb(total).toFixed(1)} KB > ${PAGE_BUDGET_KB} KB`);
  if (kb(js) > JS_BUDGET_KB) problems.push(`${name}: JavaScript ${kb(js).toFixed(1)} KB gz > ${JS_BUDGET_KB} KB`);
  const thirdParty = external.filter(u => !/formspree\.io/.test(u));
  if (thirdParty.length) problems.push(`${name}: loads from another origin: ${thirdParty.join(', ')}`);
}

for (const img of files.filter(f => ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'].includes(extname(f).toLowerCase()))) {
  const s = (await stat(img)).size;
  if (kb(s) > IMAGE_BUDGET_KB) problems.push(`${relative(ROOT, img)}: image ${kb(s).toFixed(0)} KB > ${IMAGE_BUDGET_KB} KB`);
}

console.log('\npage                                   first load (KB)   JS gz (KB)');
for (const [n, t, j] of rows) console.log(`${n.padEnd(40)} ${t.padStart(10)}   ${j.padStart(10)}`);
if (problems.length) {
  console.error(`\ncheck-budget: ${problems.length} over budget\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}
console.log(`\ncheck-budget: every page within ${PAGE_BUDGET_KB} KB, JS within ${JS_BUDGET_KB} KB.`);
