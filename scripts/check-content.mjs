#!/usr/bin/env node
// check-content — fails when placeholder text would reach the live site.
//
//   node scripts/check-content.mjs          # scans content/ (all copy lives there)
//   node scripts/check-content.mjs --dist   # scans the built HTML in dist/
//
// Flags:
//   [Anything in square brackets]   the placeholder shape used in content/*.example.*
//   FORMSPREE_ID                    the contact form was never connected
//   example.com / you@example.com   a placeholder address or link
//   "Reference prototype" / "Sample content"   prototype text copied into the site
//
// Files whose name contains ".example." are templates and are skipped.
// If this script flags something you believe is correct, do NOT edit the
// script. Stop and ask the owner.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = process.argv.includes('--dist');
// Source mode reads content/ only: templates in src/ hold no copy (LEARNINGS rule 1),
// and code is full of [attribute] selectors and obj[key] lookups. Anything a
// template puts on the page is caught afterwards by --dist.
const ROOTS = DIST ? ['dist'] : ['content'];
const EXTS = DIST ? new Set(['.html']) : new Set(['.md', '.mdx', '.json', '.yaml', '.yml']);
const SKIP = new Set(['node_modules', '.git', '.astro', 'docs']);

const PLACEHOLDER = /\[[A-Za-z][^\]\n]{2,60}\]/g;   // [Company], [One line.]
const MD_LINK = /\[[^\]\n]*\]\(/;                     // [text](url) is a real link
const OTHER = [
  [/FORMSPREE_ID/g, 'contact form not connected (FORMSPREE_ID)'],
  [/\b[\w.+-]*@?example\.(com|org|net)\b/gi, 'placeholder address or link'],
  [/Reference prototype|Sample content/gi, 'prototype banner text'],
];

const hits = [];

function scan(path, text) {
  if (DIST) {
    // only visible text and attribute values matter in the built site
    // (inline CSS and JS contain [attribute] selectors, which are not placeholders;
    // JSON data blocks are kept because they carry content)
    text = text
      .replace(/<style[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ''))
      .replace(/<script(?![^>]*application\/(?:ld\+)?json)[^>]*>[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ''));
  }
  text.split('\n').forEach((line, i) => {
    if (!DIST && MD_LINK.test(line)) {
      // still check the non-link parts of the line
      line = line.replace(/\[[^\]\n]*\]\([^)]*\)/g, '');
    }
    for (const m of line.matchAll(PLACEHOLDER)) hits.push({ path, line: i + 1, text: m[0], why: 'placeholder' });
    for (const [re, why] of OTHER) for (const m of line.matchAll(re)) hits.push({ path, line: i + 1, text: m[0], why });
  });
}

async function walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch {
    if (DIST) { console.error(`check-content: cannot read "${dir}". Run the build first.`); process.exit(2); }
    return;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const path = join(dir, e.name);
    if (e.isDirectory()) await walk(path);
    else if (EXTS.has(extname(e.name)) && !e.name.includes('.example.')) scan(path, await readFile(path, 'utf8'));
  }
}

for (const root of ROOTS) await walk(root);

if (hits.length) {
  console.error(`\ncheck-content: ${hits.length} placeholder${hits.length === 1 ? '' : 's'} still in the ${DIST ? 'built site' : 'source'}\n`);
  for (const h of hits.slice(0, 80)) console.error(`  ${h.path}:${h.line}  ${h.text}   (${h.why})`);
  if (hits.length > 80) console.error(`  ...and ${hits.length - 80} more`);
  console.error('\n  Replace them with the owner\'s real content (ask the owner if you do not have it), then run again.\n');
  process.exit(1);
}
console.log(`check-content: no placeholders in ${DIST ? 'dist' : 'content/'}.`);
