#!/usr/bin/env node
// check-design — fails the build when the built site shows a banned pattern
// from docs/DESIGN.md. Deterministic: reads dist/ (or a folder given as the
// first argument) and inspects CSS and HTML text. No network, no browser.
//
//   node scripts/check-design.mjs          # checks ./dist
//   node scripts/check-design.mjs some/dir # checks another folder
//
// If this script flags something you believe is correct, do NOT edit the
// script. Stop and ask the owner.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

const ROOT = process.argv[2] || 'dist';

const ALLOWED_FONTS = ['anybody', 'arial narrow', 'helvetica neue', 'arial', 'sans-serif', 'inherit', 'var(--font)'];
const BANNED_FONTS = ['inter', 'roboto', 'geist', 'space grotesk', 'instrument serif', 'fraunces', 'poppins', 'montserrat', 'playfair', 'archivo', 'mona sans', 'monospace', 'courier', 'menlo', 'consolas'];
// Selectors that may use text-transform: uppercase (drafting vernacular only).
const UPPERCASE_OK = [/\.label\b/, /\.name\b/, /thead/, /\.group\b/, /\.form__field\b/, /\.proto-banner\b/, /\.d-text\b/];
const BANNED_WORDS = ['passionate', 'seamless', 'seamlessly', 'leverage', 'leveraging', 'cutting-edge', 'robust', 'innovative', 'crafted', 'journey', 'dive in', 'unlock', 'empower', 'elevate', 'synergy', 'world-class'];

const problems = [];
const add = (file, rule, detail) => problems.push({ file: relative(process.cwd(), file), rule, detail });

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { console.error(`check-design: cannot read "${dir}". Run the build first.`); process.exit(2); }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

function checkCss(file, css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // innermost "selector { declarations }" pairs; @media wrappers fall away naturally
  for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    const body = m[2];
    if (selector.startsWith('@font-face')) continue;
    for (const d of body.split(';')) {
      const i = d.indexOf(':');
      if (i < 0) continue;
      const prop = d.slice(0, i).trim().toLowerCase();
      const val = d.slice(i + 1).trim().toLowerCase();
      if (!prop || prop.startsWith('--')) continue;

      if ((prop === 'box-shadow' || prop === 'text-shadow') && val !== 'none') add(file, 'no shadows', `${selector} { ${prop}: ${val} }`);
      if (prop === 'backdrop-filter' || (prop === 'filter' && /blur|drop-shadow/.test(val))) add(file, 'no blur or glass', `${selector} { ${prop}: ${val} }`);
      if (prop.startsWith('border') && prop.includes('radius')) {
        const ok = val.split(/\s+/).every(v => v === '0' || v === '0px' || v === '50%');
        if (!ok) add(file, 'radius is 0 (circles only for balloons)', `${selector} { ${prop}: ${val} }`);
      }
      if (/(linear|radial|conic)-gradient/.test(val) && !/transparent 1px/.test(val)) add(file, 'gradients only for the grid pattern', `${selector} { ${prop}: ${val.slice(0, 80)} }`);
      if (/#fff\b|#ffffff\b|#000\b|#000000\b|rgb\(\s*255\s*,\s*255\s*,\s*255|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/.test(val)) add(file, 'no pure black or white', `${selector} { ${prop}: ${val} }`);
      if (prop === 'text-transform' && val === 'uppercase' && !UPPERCASE_OK.some(r => r.test(selector))) add(file, 'uppercase only for drafting labels', selector);
      if (prop === 'font-family') {
        const fams = val.split(',').map(f => f.trim().replace(/["']/g, ''));
        for (const f of fams) {
          if (BANNED_FONTS.some(b => f === b || f.startsWith(b + ' '))) add(file, 'Anybody is the only typeface', `${selector} { font-family: ${val} }`);
          else if (!ALLOWED_FONTS.includes(f) && !f.startsWith('var(')) add(file, 'unexpected font family', `${selector} { font-family: ${val} }`);
        }
      }
    }
  }
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

function checkHtml(file, html) {
  if (/<meta[^>]+name=["']generator["']/i.test(html)) add(file, 'no generator meta tag', '<meta name="generator">');
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html)) add(file, 'fonts are self-hosted', 'Google Fonts request found');
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) checkCss(file, m[1]);
  for (const m of html.matchAll(/\sstyle="([^"]*)"/gi)) checkCss(file, `inline{${m[1]}}`);

  const text = textOf(html);
  const emoji = text.match(/\p{Extended_Pictographic}/gu)?.filter(c => !'©®™'.includes(c));
  if (emoji?.length) add(file, 'no emoji', emoji.slice(0, 5).join(' '));
  if (/[→←⟶➔➜]/.test(text)) add(file, 'no arrow glyphs in text', (text.match(/.{0,30}[→←⟶➔➜].{0,10}/) || [''])[0].trim());
  if (/\S · \S.*·/.test(text)) add(file, 'no middle-dot meta strings', (text.match(/[^.]{0,30}·[^.]{0,30}/) || [''])[0].trim());
  const lower = text.toLowerCase();
  for (const w of BANNED_WORDS) {
    const re = new RegExp(`\\b${w.replace('-', '\\-')}\\b`);
    if (re.test(lower)) add(file, 'banned word', w);
  }
  if (/\b(ai-generated|lorem ipsum)\b/i.test(text)) add(file, 'filler content', 'lorem ipsum / placeholder filler');
}

const files = await walk(ROOT);
for (const f of files) {
  const ext = extname(f).toLowerCase();
  if (ext === '.css') checkCss(f, await readFile(f, 'utf8'));
  else if (ext === '.html') checkHtml(f, await readFile(f, 'utf8'));
}

if (problems.length) {
  console.error(`\ncheck-design: ${problems.length} problem${problems.length === 1 ? '' : 's'} (see docs/DESIGN.md, "Banned")\n`);
  for (const p of problems) console.error(`  [${p.rule}] ${p.file}\n      ${p.detail}`);
  console.error('');
  process.exit(1);
}
console.log(`check-design: ${files.length} files, no banned patterns.`);
