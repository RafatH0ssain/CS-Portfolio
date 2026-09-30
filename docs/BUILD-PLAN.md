# BUILD-PLAN.md — the build, step by step

Work through these steps in order, one at a time. Each step has: what to build,
the files, how, **Done when** (checks you run), and **Show the owner** (what to
show before asking for approval). Do not start a step until the owner has
approved the one before it. Record progress in `docs/PROGRESS.md`.

General method for every step:

1. Re-read the step. Open the matching part of the prototype
   (`docs/reference/prototype/index.html` or `part.html`) and of
   `assets/blueprint.css`.
2. Ask the owner to approve creating the step's branch
   (`git switch -c step-<n>-<name>`).
3. Build by **copying the prototype's markup** into Astro components and
   replacing sample text with values from `content/`. Keep every class name and
   `data-` attribute. Do not restyle.
4. Run `npm run build`, then `npm run verify` when the step says so. Fix failures
   in your code, never in the checks.
5. Show the owner the result (see "Showing the owner" below), wait for
   "approved", then ask to commit. After the commit, ask whether to merge the
   branch into `main` (`git switch main`, `git merge --no-ff step-<n>-<name>`).
   Then tell the owner the push command; they push.

**Showing the owner.** If you can capture screenshots yourself (for example a
browser tool in this app, or Playwright if it is already installed), capture
the page at 390px, 768px and 1440px wide and show them next to the matching
reference screenshots in `docs/reference/screens/`. If you cannot, ask the owner
to run `npm run dev`, open http://localhost:4321 and use the browser's
responsive mode at those three widths, and tell them exactly what to compare
against which reference screenshot.

---

## Step 0 — Set up (no code)

1. Read every document listed in `AGENTS.md`.
2. Create `docs/PROGRESS.md` with a checklist of steps 0 to 11, and the content
   files from `CONTENT-INTAKE.md`. Tick items as the owner approves them.
3. Check the environment: `node --version` must be 22.12 or newer. If not, stop
   and tell the owner to install Node 22 LTS.
4. Ask the owner:
   - Is this folder already a git repository, and is there a GitHub repository
     for it yet? If it is not a repository, ask permission to run `git init -b
     main`. (Creating the GitHub repository is the owner's job; tell them it
     should be empty, with no README or licence, so the first push is clean.)
   - Branch per step (recommended), or one `build` branch for everything?
5. With permission, run `npm install`. Commit `package-lock.json` in step 0's
   commit (ask first).
6. Run `npm run hooks` to install the git hooks. Explain to the owner in one
   sentence what they do (every push asks them to type "push"; secrets and
   vault files cannot be committed).
7. Look at the prototype: ask the owner to run
   `npx serve docs/reference/prototype` (or
   `python3 -m http.server 8765 --directory docs/reference/prototype`) and open
   it, or read `docs/reference/screens/` yourself. Opening the HTML file
   directly will not load the font; it must be served.

**Done when:** `node_modules` exists, `npx astro check` runs, hooks are
installed (`git config core.hooksPath` prints `.githooks`; the owner can run
this to confirm), `docs/PROGRESS.md` exists.

**Show the owner:** the progress checklist, and the list of what you will need
from them in step 1 (their Obsidian vault path, résumé PDF, screenshots if they
have any, and later a Formspree ID).

---

## Step 1 — Content intake (with the owner)

Follow `docs/CONTENT-INTAKE.md` exactly, one file at a time, with approval for
each. The content is validated when a page imports it, so after the first
JSON file is written, create a temporary `src/pages/index.astro` that imports
everything and prints only counts (comment out imports of files that do not
exist yet):

```astro
---
import { getCollection } from 'astro:content';
import { profile, revisions, skills, experience } from '../lib/content';
const projects = await getCollection('projects');
---
<p>{profile.name.first}: {revisions.length} stops, {skills.length} skills, {experience.length} organisations, {projects.length} projects</p>
```

Step 3 replaces it.

**Done when:** every required content file exists and was approved; `npm run
build` succeeds; `node scripts/check-content.mjs` passes (no `[placeholders]`
left in `content/`).

**Show the owner:** the counts line, and the list of anything still missing
(for example the Formspree ID or screenshots).

---

## Step 2 — The sheet frame

Files:
- `src/styles/blueprint.css` — copy `assets/blueprint.css` whole. Change only
  the font URL to `/fonts/anybody-latin.woff2`, and delete the `.proto-banner`
  rule. Keep section numbers and comments.
- `src/layouts/Sheet.astro` — the page shell used by every page. Props:
  `title`, `description`, `sheetCount`. It renders:
  - `<!doctype html>`, `<html lang="en">`, `<meta charset>`, viewport,
    `<title>`, meta description, `<meta name="theme-color" content="#0F2350">`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
    canonical URL (`new URL(Astro.url.pathname, Astro.site)`), Open Graph
    title/description/url/type, the font preload (see DESIGN.md), and
    `import '../styles/blueprint.css'` in the frontmatter.
  - The skip link, then `.sheet` with the four zone strips and the masthead,
    then `<main id="main">` with a `<slot />`. Copy the structure from the
    top and bottom of `index.html`.
- `src/components/Masthead.astro` — from the prototype's `<header
  class="masthead">`, including the mobile `<details>` menu. Name from
  `profile.name`, drawing number from `profile.drawingNo`. Nav links, as in
  the prototype: "Parts" (`/#parts`), "Parts list" (`/#parts-list`),
  "Revisions" (`/#revisions`), and the amber "Email me" (`mailto:` +
  `profile.email`). On part sheets the
  links point to `/#…` too. Mark nothing as current with JavaScript.
- `src/components/SheetFoot.astro` — `.sheet-foot`: left label, right label
  "DWG <drawingNo> — Sheet n of N".
- `src/pages/404.astro` — the frame, a `.section` with the label "Sheet not
  found", a `.t-sheet` heading "Sheet not found.", one line "This drawing number
  is not on file." and a secondary button "Back to sheet 1" linking to `/`.
- `public/favicon.svg`:
  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0F2350"/><rect x="9" y="9" width="14" height="14" fill="#FFB547" transform="rotate(45 16 16)"/></svg>
  ```

**Done when:** `npm run verify` passes on the 404 page and the temporary index
(check-links may complain about `/#parts` targets that do not exist yet; if so,
note it for step 3 and continue); the frame matches the reference screenshots'
border, zones, masthead and grid at all three widths.

**Show the owner:** the 404 page at 390px and 1440px.

---

## Step 3 — Sheet 1: the hero, without the scrubber

Files: `src/pages/index.astro` (replace the temporary one),
`src/components/Hero.astro`, `Fig1.astro`, `TitleBlock.astro`,
`GeneralNotes.astro`, and `src/lib/derive.ts`.

`src/lib/derive.ts` holds small pure functions, used by every later step:

```ts
// the current stop: revisions.find(s => s.current)
export function currentStop(revisions) { ... }
// head/bio for a stop: the current stop takes profile.head and profile.bio
export function stopText(stop, profile) { ... }
// --chars for the name: Math.max(first.length, last.length)
export function nameChars(profile) { ... }
// projects sorted by `order`, each with its two-digit part number '01', '02'…
export function numberedProjects(projects) { ... }
// state of an item with level n at stop s: 'future' | 'new' | 'built'
//   future: n > s.level;  new: n === s.level && !s.locked;  otherwise built
export function stateAt(n, stop) { ... }
```

Render at the **current stop**, as static HTML, exactly as `index.html` does at
v0.9: the stamp row, the `.name-box` with the name (`--chars` from
`nameChars`), headline and bio, the two buttons ("Email me" → `mailto:`,
"Résumé (PDF)" → `profile.links.resume`), FIG. 1, the title block, and the
general notes (`profile.shortVersion`).

For every element the scrubber changes, put the `data-` attributes in now,
exactly as in the prototype (`data-rev-field`, `data-lvl`, `data-only-lvl`,
`data-max-lvl`, `data-locked-only`), and put the **initial state classes** in
the HTML as the current stop requires (`is-future`, `is-new`, `is-off`,
`is-on`), computed with `stateAt`. That way the page is correct with JavaScript
off.

FIG. 1: copy both SVGs (wide and narrow). Replace the six module labels with
`profile.figure.modules` (pair 0 at `data-lvl="1"`, pair 1 at `"2"`, pair 2 at
`"3"`), uppercased in the template with `.toUpperCase()`. Replace `9 RELEASES`
with the number of projects. Replace `SHIPS MAY 2027` with
`'SHIPS ' + profile.shipsOn.toUpperCase()`. Everything else in the drawing stays
as it is. Set the SVG's `<desc>` to name the modules.

Title block: Drawn by = first and last name; Program = `profile.program`;
Ships = `profile.shipsOn`; Rev and Date from the current stop (with
`data-rev-field`); Sheet = "1 of N" (N is 5, or 4 without certifications).

**Done when:** `npm run verify` passes; with JavaScript disabled in the browser
the hero looks like `docs/reference/screens/01-home-desktop-1440.jpg` (top part)
and `02-home-mobile-390.jpg`; the name fills its column without wrapping at 390px.

**Show the owner:** the hero at 390px, 768px and 1440px. Ask specifically about
the headline, bio and name size.

---

## Step 4 — The revision scrubber and the skills chips

Files: `src/components/Scrubber.astro`, `src/components/Chips.astro`,
`src/scripts/scrubber.ts`.

- Scrubber markup: copy the `.scrubber` block from `index.html` (the one with
  `data-scrubber-controls hidden`). Generate the ticks and the six stop buttons
  from `content/revisions.json` (`<b>v{rev}</b>`, long label `era`, short label
  `short`). Set `aria-pressed="true"` on the current one. The range input has
  `min="0"`, `max="5"`, `value` = the current index, and `aria-valuetext`.
  Set `--v` on `.scrubber__track` to the current index and `--stops` to 6.
- The count line `N of M releases built by vX` is computed for the current stop.
- Emit the stops for the script, **after** filling the current stop's head and
  bio from the profile (tested with Astro 7.3.5):
  ```astro
  ---
  const stopsForScript = revisions.map((s) => (s.current ? { ...s, head: profile.head, bio: profile.bio } : s));
  const json = JSON.stringify(stopsForScript).replace(/</g, '\\u003c');
  ---
  <script type="application/json" id="revisions-data" set:html={json} />
  ```
- `src/scripts/scrubber.ts`: port `assets/scrubber.js` line by line to
  TypeScript (types only; same logic, same selectors). Load it from
  `Scrubber.astro` with `<script>import '../scripts/scrubber.ts';</script>`.
- Chips: `<ul>` of `<li class="chip" data-lvl="n">` from `content/skills.json`,
  with the initial class from `stateAt`.

**Done when:** `npm run verify` passes (JS stays under 8 KB); dragging, clicking
stops and arrow keys all work; each stop matches `03a`, `03b` and `03c` in
`docs/reference/screens/` in behaviour; with JavaScript off the controls are
not visible and the page shows the current stop.

**Show the owner:** stops v0.1, v0.5 and v1.0 at 1440px, and the scrubber at
390px.

---

## Step 5 — Sheet 2: the exploded parts view

Files: `src/components/Parts.astro`, `src/components/Schematic.astro`,
`src/scripts/parts.ts`.

- Featured projects come from `profile.featured` (slugs, top plate first). If a
  slug has no matching project, throw an error naming the slug.
- Copy the `.parts` block from `index.html`. `style="--n:<count>"` on
  `.parts`. For featured position `i` (0 = top): `.plate-wrap data-part="i"
  data-lvl="<project level>" style="--i:i"`. **Render the plates in reverse
  order** (bottom plate first in the HTML) so upper plates paint over lower
  ones, as in the prototype. Labels, picker buttons and spec panels are in
  normal order.
- On each plate: the schematic (or the screenshot, cropped into the figure
  window with `object-fit: cover`), the balloon (`i + 1`), `PART <part
  number>` (the project's number in the parts list), `plateTitle ?? title`, and
  `version`.
- `Schematic.astro` takes `name` (`grid | chart | nodes | pipeline`) and `size`
  (`plate | sheet`). The `plate` versions are the four small SVGs in the
  prototype's plates. The `sheet` versions (820×480) are used in step 8; for now
  render `plate` only.
- Labels (`.part-label`) link to `/parts/<slug>/`. Spec panels list the
  project's summary, its `added`, `changed` and `issues` lines as release lines,
  the stack as "Material", and an "Open release notes" link.
- Port `assets/parts.js` to `src/scripts/parts.ts`, loaded from `Parts.astro`.

**Done when:** `npm run verify` passes; hover and focus lift the right plate
and show the right panel on desktop; the picker works under 1024px; plates not
built at the selected stop fade; nothing is hidden behind the plate above
(check the safe zone); with JavaScript off all spec panels show.

**Show the owner:** the view at 1440px with part 2 hovered, and at 390px with
part 3 picked (compare with `04a` and `04b`).

---

## Step 6 — Sheets 3 to 5: parts list, revisions, certifications

Files: `PartsList.astro`, `Revisions.astro`, `Certifications.astro`,
`Inspection.astro`.

- **Parts list:** copy the table from `index.html`. One row per project in
  `order`: number, title linked to its part sheet, version, stack joined with
  ", ", kind, status. Each row has `data-release data-lvl="<level>"` and the
  initial class from `stateAt`. Keep the three status spans (`st-released`,
  `st-new` with "New in v<rev>", `st-future` with "Not built at v<rev>").
- **Revisions:** follow the rules in SPEC.md ("content/experience.json"):
  letters, headings, dates, promotions, `details.more`, approved-by. Groups in
  this order: development, research, leadership, awards, skipping empty ones.
- **Certifications:** only if `certifications` is defined. Rows C1, C2…
- **Inspection report:** only if `academics?.show`. Standing and awards cells;
  GPA only if present.
- Sheet labels and numbers: "Sheet 3 — Parts list", "Sheet 4 — Revision
  history", "Sheet 5 — Certificates of conformance". The last sheet's foot says
  "Updated <profile.updated>".

**Done when:** `npm run verify` passes; tables stack into rows at 390px; the
scrubber dims and counts the parts list rows; letters are in date order.

**Show the owner:** all three sheets at 390px and 1440px. Ask them to check
every date and title.

---

## Step 7 — The approval block and contact form

Files: `Approval.astro`, `src/scripts/form.ts`.

- Copy the `#approval` section. Form action:
  `https://formspree.io/f/${profile.formspreeId ?? 'FORMSPREE_ID'}`,
  `method="POST"`, `data-enhance`. Keep the honeypot exactly.
- Side cells: Issued for (`profile.openTo`), Email (`mailto:` link), then
  links: GitHub, LinkedIn (only if present), Résumé. "Based in" only if
  `profile.location` is present. The signature cell stays as in the prototype.
- Replace the prototype's inline `style=""` attributes with small classes in
  `blueprint.css` (add them at the end under a new section 22, ask the owner
  first since it touches the stylesheet).
- Port `assets/form.js` to `src/scripts/form.ts`. Status messages stay as in
  the prototype, unless the owner wants other wording.

**Done when:** `npm run verify` passes except `check-content --dist` if the
Formspree ID is not in yet (that is expected; tell the owner); the form submits
without JavaScript (to Formspree's page) and with JavaScript (inline status),
once the ID is in. Test a real submission only with the owner's permission.

**Show the owner:** the block at 390px and 1440px. Remind them about the
Formspree ID if it is missing.

---

## Step 8 — Part sheets

Files: `src/pages/parts/[slug].astro`, `PartHead.astro`, `Fig31.astro`,
`ReleaseNotes.astro`, and the `sheet` size in `Schematic.astro`.

- `getStaticPaths` from the projects collection; slug = entry `id`.
- Copy `part.html`. Label "Sheet 3.<n> — Part <nn> of <NN>". Title block from
  frontmatter (Part no., Rev = version, Role, Duration, Status, Users only if
  present, Material = stack).
- Intro: render the Markdown body (`const { Content } = await render(entry)`).
- FIG. 3.1: if `figure.image`, use `<Picture>` from `astro:assets` with the
  settings in SPEC.md ("Performance budget"), inside a wrapper with an absolutely
  positioned SVG overlay for the callouts. Otherwise use `<Schematic
  size="sheet">` (820×480). Callouts: for callout `k` at `(x, y)`, draw a small
  amber dot at `(x·W, y·H)`, a 1.5px amber leader line to a 28px balloon 40px
  up and to the left (or right, if `x < 0.1`), and the number `k + 1` in the
  balloon. The legend beside it lists the callouts' titles and notes.
- "Inspect it yourself": one button per real link (Live site, Source code,
  Write-up). None if there are no links.
- Release notes: three columns from `added`, `changed`, `issues`. General
  notes: each decision as "Chose <chose> instead of <instead>, because
  <because>" with its title in bold. Revisions: the `history` table.
- Previous and next sheet links in `order`, wrapping around.
- The three `sheet` schematics that do not exist yet (`chart`, `nodes`,
  `pipeline`): draw them in the style of the `grid` one in `part.html`. **Show
  the owner each new drawing before using it.**

**Done when:** `npm run verify` passes; every project has a page; every link
on it works; `05` and `06` in `docs/reference/screens/` match in layout.

**Show the owner:** one part sheet with a screenshot (if any) and one with a
schematic, at 390px and 1440px.

---

## Step 9 — Metadata and small files

- Check every page's `<title>`, description, canonical and Open Graph tags
  (SPEC.md, "Metadata").
- `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://<domain>/sitemap.xml
  ```
  Ask the owner for the domain. If they don't have one yet, use the
  `workers.dev` address they will get from Cloudflare later, and note it in
  PROGRESS.md.
- `src/pages/sitemap.xml.ts`, a static endpoint (tested with Astro 7.3.5; no
  package needed):
  ```ts
  import type { APIRoute } from 'astro';
  import { getCollection } from 'astro:content';
  export const GET: APIRoute = async ({ site }) => {
    const projects = await getCollection('projects');
    const urls = ['/', ...projects.map((p) => `/parts/${p.id}/`)].map((p) => new URL(p, site).href);
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
    return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
  };
  ```
- Update `site` in `astro.config.mjs` to the real domain (ask first).
- Ask the owner whether they want an Open Graph image. If yes, it is a static
  1200×630 PNG they approve, in `public/og.png`, under 200 KB; add `og:image`.
  Do not generate a picture of the owner.

**Done when:** `npm run verify` passes; `dist/sitemap.xml` and
`dist/robots.txt` exist and are correct.

---

## Step 10 — Full review

Run through this list and report each item as pass or fail to the owner:

1. `npm run verify` passes, including `check-content --dist` (the Formspree ID
   is in).
2. `npm run check:external` passes (every external link responds). If a site
   blocks automated requests, list it for the owner to click by hand.
3. Every page at 390px, 768px and 1440px: no horizontal scroll, nothing
   overlaps, the name fits, tables stack on mobile.
4. JavaScript off: every page is complete and readable.
5. Keyboard only: skip link, masthead, buttons, scrubber (arrows), part labels,
   picker, form, part sheet links. Focus is always visible.
6. `prefers-reduced-motion` on (in the browser's rendering settings): nothing
   moves; the scrubber still works.
7. DESIGN.md's banned list, read line by line against the pages.
8. No phone number, address or GPA anywhere (search `dist/` for digits in
   phone-number patterns: `grep -rE "[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}" dist`).
9. Every fact on the site traces to a file in `content/` that the owner
   approved.
10. If Chrome is installed, a Lighthouse run on `/` in mobile mode (the owner
    can do this in Chrome DevTools): accessibility and best practices 100,
    performance 95 or more. Report the numbers.

**Show the owner:** the checklist results and screenshots of every page at
390px and 1440px.

---

## Step 11 — Launch (the owner does the account work)

Prepare, then hand over. Tell the owner these steps; do not do them yourself:

1. Push `main` to the GitHub repository (they run `git push -u origin main`).
2. In the Cloudflare dashboard: Workers & Pages → Create → Import a repository
   → choose the repo. Build command `npm run build`, deploy command
   `npx wrangler deploy`. Save and deploy.
3. Add the custom domain in the Worker's settings, if they have one.
4. Open the live site on a phone and submit a test message through the form.
5. In GitHub, check the "ci" workflow passed on `main`.

After launch, when content changes (a new project, a new job), the process is:
update `content/` with the owner (CONTENT-INTAKE.md rules), run `npm run
verify`, commit on a branch, owner pushes.
