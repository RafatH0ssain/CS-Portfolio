# SPEC.md — what the site is

A static portfolio for a computer science student (Bachelor of Computer Science,
Dalhousie University, graduating **May 2027**) applying to **new grad roles
across all of CS**, with a slight lean toward machine learning and product.

Visual direction: **Blueprint**. The site is a set of engineering drawings of
one person, treated as a system that gets revised over time. See `DESIGN.md`
and the working prototype in `docs/reference/prototype/`.

---

## Who it is for

A recruiter or hiring engineer, often on a phone, who found the link in an
application and will give it about two minutes. In order, the site answers:

1. **By 15 seconds:** who this is, what they do, what they are open to, and
   when they are available. (The name, the headline, the title block's
   "Ships May 2027".)
2. **By 45 seconds:** is there a project relevant to a real engineering
   problem? (The exploded parts view.)
3. **By 90 seconds:** what did they personally own, and can it be checked? (A
   part sheet, with callouts and links.)
4. **By 2 minutes:** is it worth getting in touch? (The approval block.)

The revision scrubber is the memorable part, but nothing important hides behind
it. At the default revision (v0.9), everything a recruiter needs is visible
without touching anything, and without JavaScript.

---

## Pages

| route | what it is | prototype |
|---|---|---|
| `/` | Sheets 1 to 5 plus the approval block (details below) | `index.html` |
| `/parts/<slug>/` | One project as a part sheet | `part.html` |
| `/404` | "Sheet not found." Same frame, one line, a link home | (build from the frame) |
| `/resume.pdf` | The owner's résumé, a static file in `public/` | — |
| `/robots.txt`, `/sitemap.xml` | Plain files | — |

Home page, top to bottom:

1. **Sheet 1, the hero.** Stamp row (rev badge, era, status), the name, the
   revision headline and bio, "Email me" and "Résumé (PDF)" buttons, FIG. 1
   (the system block diagram), the title block, the revision scrubber, the
   skills as chips ("Parts on hand"), and the general notes (the short
   version).
2. **Sheet 2, the exploded view.** The featured projects (four, or three) as an isometric
   stack of plates, with labels, a mobile picker and a spec panel per part.
3. **Sheet 3, the parts list.** Every project in a table: number, name (links to
   its part sheet), version, material (stack), kind, status.
4. **Sheet 4, revisions.** Experience grouped by stream, one row per
   organisation, lettered A, B, C…
5. **Sheet 5, certifications.** Only if `content/certifications.json` exists.
   The inspection report (academics) appears under it only if
   `content/academics.json` has `"show": true`. If neither exists, the approval
   block becomes sheet 5 and the sheet count in the footer and title block is 4.
6. **Approval block.** Contact form, email, GitHub, LinkedIn, résumé.

Not in scope unless the owner asks: blog, dark/light toggle, lens pages for
different roles, a projects filter, animations beyond DESIGN.md, analytics,
comments, a CMS.

---

## Content model

Every fact about the owner lives in `content/`, once. Templates only read it.
The schemas that enforce this already exist and are tested:
`src/content.config.ts` (projects) and `src/lib/content.ts` (the JSON files).
Each `content/*.example.*` file shows the shape; copy it without `.example` and
fill it in with the owner (see `CONTENT-INTAKE.md`). Example files are ignored
by the build.

### `content/profile.json` (required)

| field | used for |
|---|---|
| `name.first`, `name.last` | the hero name (two lines, uppercase), masthead, title block "Drawn by", page titles |
| `email` | "Email me" buttons (`mailto:`), the approval block |
| `location` | optional; shown in the approval block as "Based in" only if present |
| `links.github`, `links.linkedin` | approval block; LinkedIn is optional |
| `links.resume` | `/resume.pdf`; the file must exist in `public/` |
| `formspreeId` | the form posts to `https://formspree.io/f/<formspreeId>`; optional until launch |
| `drawingNo` | `PF-2027-001`, shown in the masthead and sheet footers |
| `program` | short form for the title block: "BCS, Dalhousie" |
| `programLong` | the full degree, used in meta descriptions |
| `shipsOn` | "May 2027": title block "Ships", the v1.0 stamp |
| `openTo` | "New grad roles, any field": approval block "Issued for" |
| `updated` | "Updated YYYY-MM" in the last sheet footer |
| `head`, `bio` | the headline and bio at the current revision |
| `featured` | three or four project slugs for the exploded view, top plate first (four is the design; three only if the owner has fewer strong projects) |
| `shortVersion` | 2 or 3 items `{ lead, rest }` for the general notes: `lead` is bold chalk, `rest` is dim |
| `figure.modules` | FIG. 1 box labels, three pairs, appearing at levels 1, 2, 3 |

### `content/revisions.json` (required)

Exactly six scrubber stops, in order: v0.1 Year 1, v0.3 Year 2, v0.5 Year 3,
v0.7 Co-op, v0.9 Year 4 (`"current": true`), v1.0 May 2027 (`"locked": true`).
Each has a `level` from 0 to 4 that never goes down. The current stop has no
`head` or `bio` of its own; it uses `profile.head` and `profile.bio`. If the
owner did not do a co-op, ask what the fourth stop should be (an internship,
a research term, a summer project) and rename its `era` and `short`.

**Levels drive everything the scrubber shows.** Anything with `level: n` (a
skill, a project, a FIG. 1 module) exists from the first stop whose level is `n`.
At a stop with level `L`: things with level `> L` are "not built yet"; things
with level `== L` are "new" (amber), unless the stop is locked; the rest are
normal.

### `content/skills.json` (required)

4 to 24 items `{ name, level }`. Shown as chips in the order given.

### `content/projects/<slug>.md` (3 to 12 files)

The file name is the slug and the URL. Frontmatter fields and limits are in
`src/content.config.ts`; the example file explains each one. Key rules:

- `issues` has at least one line. Every project admits a known limitation.
- `plateTitle` (18 characters at most) is required when `title` is longer.
- `order` sets the row order in the parts list. Part numbers (`01`, `02`…) come
  from that order.
- `figure.image` is a real screenshot in `src/assets/projects/`, or absent.
  `figure.schematic` names one of the four drawn schematics (`grid`, `chart`,
  `nodes`, `pipeline`) used on the plate and, when there is no screenshot, as
  FIG. 3.1 on the part sheet.
- The Markdown body (two or three short paragraphs) is the part sheet's intro.
- `links` has only real URLs. Omit a key rather than leave it empty.

### `content/experience.json` (required)

One entry per organisation: `{ org, location?, stream, roles[] }`, roles newest
first. `stream` is one of `development`, `research`, `leadership`, `awards`,
shown as the groups "Software development", "Research", "Leadership and
teaching", "Hackathons and awards" (only groups that have entries appear).

How a row is built:
- **Letter:** sort all organisations by the `start` of their oldest role,
  oldest first; the oldest is `A`, then `B`, and so on. The newest letter is
  amber (`rev-letter--latest`). Rows are shown newest first inside each group.
- **Heading:** "`<newest role title>`, `<org>`", except in `awards`, where it is
  "`<org>`, `<title>`" (for example "HackX, 2nd place").
- **Dates:** the year of the oldest role's start, then " — present" if the
  newest role's `end` is null, " — <year>" if the end year differs, or nothing
  if they are the same year.
- **Promotions:** if there is more than one role, a tag "Promoted once",
  "Promoted twice" or "Promoted N times", and a line "Previously <older
  titles, oldest first, joined with ', then '>."
- **Body:** the newest role's `summary`. Its `bullets`, if any, go in a
  `<details class="more">` whose summary reads "N more outcomes" (or "1 more
  outcome").
- **Approved by:** the newest role's `approvedBy`, or leave the cell empty.

### `content/certifications.json` (optional)

`{ title, issuer, year, credentialId?, verifyUrl, verifyLabel? }`. Numbered C1,
C2… in the order given. Every row links to the issuer's own verification page;
the link text is `verifyLabel` or "Verify on <issuer>".

### `content/academics.json` (optional)

`{ show, standing?, gpa?, awards[] }`. Rendered as the inspection report only
when `show` is true. The GPA is published only if the owner explicitly says so.

### Also in the repo, supplied by the owner

- `public/resume.pdf` — the owner's current résumé. Ask for it; never create one.
- `src/assets/projects/<slug>.png|jpg` — real screenshots only.

---

## JavaScript

Static HTML and CSS first. Exactly three scripts, ported from the prototype
into `src/scripts/` and loaded with a plain `<script>` tag inside the component
that needs them (Astro bundles them):

1. `scrubber.ts` — from `assets/scrubber.js`. Reads the stops from
   `<script type="application/json" id="revisions-data">`.
2. `parts.ts` — from `assets/parts.js`.
3. `form.ts` — from `assets/form.js`.

Keep the markup contracts written at the top of each prototype script. All
scripts together stay under **8 KB gzipped** (the prototype's are about 2.5 KB).
Any other client-side JS needs the owner's approval. No frameworks, no
libraries, no `requestAnimationFrame` loops, no analytics.

## Contact

- A Formspree form: Name, Email, Company and role (optional), Message, and a
  hidden honeypot field named `_gotcha`. It works without JavaScript (Formspree
  shows its own thank-you page); with JavaScript it sends in place and shows the
  result inline. Never `alert()`.
- The owner creates the form at formspree.io with their own account and gives
  you the ID. Until then the template uses the literal action
  `https://formspree.io/f/FORMSPREE_ID`: the site builds, but
  `check-content --dist` fails on it, so it cannot ship.
- An email link, GitHub, LinkedIn (optional) and the résumé.
- **No phone number, anywhere, ever.** No street address.

## Performance budget (enforced by `npm run check:budget`)

- Each page's first load, gzipped (HTML, CSS, JS, preloaded font): **160 KB**
  at most. The prototype's home page is about 75 KB.
- JavaScript: **8 KB** gzipped per page at most.
- Any single image file: **200 KB** at most. Use Astro's `<Picture>` with
  `formats={['avif', 'webp']}`, `fallbackFormat="jpg"`, `width={960}`,
  `widths={[480, 960]}`, `quality={70}`, and meaningful `alt` text.
- FIG. 1 and every schematic are inline SVG, never raster images.
- The font is self-hosted and preloaded. No request to any other origin except
  the Formspree form post.

## Accessibility

- WCAG 2.2 AA. Contrast pairs are listed in DESIGN.md; only use those.
- Real `<table>` markup with `<th scope>` for the parts list, revisions and
  certifications. On mobile they restyle into stacked rows (CSS in the prototype).
- The scrubber is a native `<input type="range">` with a label and
  `aria-valuetext`, plus stop buttons, plus a polite live region.
- In the exploded view, the labels are the links; plates are `aria-hidden`.
- One `<h1>` per page (the name on `/`, the part title on a part sheet).
- A skip link, visible focus (2px amber outline), `lang="en"`.
- `prefers-reduced-motion: reduce` removes all motion.

## Metadata

- `<title>`: "First Last — Portfolio" on `/`; "Project title — First Last" on
  part sheets; "Sheet not found — First Last" on 404.
- Meta description from `profile.bio` or the project `summary`.
- Canonical URL, Open Graph title/description/url, `theme-color` `#0F2350`.
- Favicon: a small SVG in `public/favicon.svg`, an amber 45° diamond (the
  scrubber thumb) on `#0F2350`. No other icons.
- No `<meta name="generator">`.

## Hosting

Cloudflare Workers with static assets (`wrangler.jsonc`, free tier). The owner
connects the GitHub repo in the Cloudflare dashboard (Workers, "Import a
repository"), with build command `npm run build` and deploy command
`npx wrangler deploy`. The owner sets the custom domain. You never deploy and
never run `wrangler login`.

## Definition of done, per page

1. Matches the prototype at 390px, 768px and 1440px, with no horizontal scroll.
2. Renders fully with JavaScript off.
3. Keyboard-only pass: everything reachable, focus visible.
4. Checked against DESIGN.md's banned list.
5. `npm run verify` passes.
6. The owner has seen it and said "approved".
