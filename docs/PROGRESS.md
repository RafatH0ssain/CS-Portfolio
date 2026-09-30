# PROGRESS.md

Build log. The coding is done; what is left is the owner's own content, which
only the owner can supply. See `docs/OWNER-TASKS.md` for the single pass that
finishes it.

## Steps

- [x] **0 — Set up.** `node_modules` installed, git initialised on `main`.
- [x] **1 — Structure.** `content/` written with `[TODO ...]` placeholders in
      the shape the schemas require. 9 projects, 4 featured, 6 experience orgs,
      12 skills, 6 revisions, 2 certifications, academics block on.
- [x] **2 — The sheet frame.** `src/styles/blueprint.css` ported from the
      prototype (font URL changed, `.proto-banner` dropped, section 22 added
      for the inline styles the prototype used). `Sheet.astro`, `Masthead.astro`,
      `SheetFoot.astro`, `404.astro`, `public/favicon.svg`.
- [x] **3 — Sheet 1, the hero.** `Fig1.astro` (both wide and narrow drawings,
      module labels from `profile.figure.modules`, release count computed),
      `Hero.astro`, `GeneralNotes.astro`, `src/lib/derive.ts`.
- [x] **4 — The scrubber and chips.** `Scrubber.astro` generates the ticks and
      six stops from `content/revisions.json`; `Chips.astro`;
      `src/scripts/scrubber.ts`.
- [x] **5 — Sheet 2, the exploded view.** `Parts.astro` renders featured
      projects bottom plate first so upper plates paint over lower ones;
      `Schematic.astro` with all eight drawings (four plate, four sheet);
      `src/scripts/parts.ts`.
- [x] **6 — Sheets 3 to 5.** `PartsList.astro`, `Revisions.astro`,
      `Certifications.astro`, `Inspection.astro`. Sheet count is 5 while
      `content/certifications.json` exists and drops to 4 when it is deleted.
- [x] **7 — Approval block and form.** `Approval.astro`,
      `src/scripts/form.ts`. Form action uses `profile.formspreeId`, falling
      back to `FORMSPREE_ID` so the site cannot ship with a dead form.
- [x] **8 — Part sheets.** `src/pages/parts/[slug].astro`, `PartHead.astro`,
      `Fig31.astro` (screenshot with callout overlay, or the large schematic),
      `ReleaseNotes.astro`.
- [x] **9 — Metadata and small files.** `Sheet.astro` sets title, description,
      canonical, Open Graph and the font preload. `sitemap.xml.ts`,
      `robots.txt.ts`.
- [ ] **10 — Full review.** Blocked on the owner's content: several checklist
      items in BUILD-PLAN step 10 can only pass once real content is in.
- [ ] **11 — Launch.** The owner pushes, connects Cloudflare and sets the domain.

## Deviations from docs/BUILD-PLAN.md

Two, both deliberate and both small:

1. **The title block lives inside `Fig1.astro`** rather than a separate
   `TitleBlock.astro`. In the prototype it is the last child of the figure box
   and is only ever used there. One use, one file.
2. **`src/pages/robots.txt.ts` is an endpoint, not `public/robots.txt`.** It
   reads `site` from `astro.config.mjs`, so the domain lives in one place and
   the file cannot go stale. `dist/robots.txt` is identical either way.
3. **Every sheet on the home page ends with a `.sheet-foot`, not only the last
   one.** DESIGN.md says each sheet ends with one; the prototype only shows the
   last. The design document was followed, since BUILD-PLAN step 2 defines
   `SheetFoot` as a per-sheet component. The approval block reuses the last
   sheet's number, as in the prototype.

## Verification actually run

Every gate except the content gate, on the placeholder content:

| check | result |
|---|---|
| `npx astro check` | 0 errors, 0 warnings, 0 hints |
| `npx astro build` | 11 pages |
| `npm run check:design` | 17 files, no banned patterns |
| `npm run check:budget` | every page within 160 KB, JS within 8 KB (home is 71 KB, 1.4 KB JS) |
| `npm run check:links` | 3 findings, all owner-supplied (below) |
| `npm run check:content` | 215 placeholders in `content/`, 346 in `dist/` — all `[TODO ...]` |

Every content file was also checked field by field against the zod schemas in
`src/lib/content.ts` and `src/content.config.ts`, and the sheet-4 grouping logic
was exercised against the rules in SPEC.md (letters, dates, promotions, group
order).

The built pages were rendered in headless Chromium at 390, 768 and 1440 and
compared with `docs/reference/screens/`. Two real defects were found and fixed
that way:

- The callout overlay on a part sheet inherited `.fig31 svg`'s opaque
  `background: var(--deep)`, which hid the schematic underneath. The rule is now
  `.fig31 svg.fig31__overlay` so it wins on specificity.
- The `data-max-lvl` guide circles in FIG. 1 rendered visible with JavaScript
  off at v0.9. The initial class is now computed from the current stop, like
  every other element the scrubber drives.

## Still to do, and why

Two failures remain in `npm run verify`, both by design:

- `check-content` on `content/` and on `dist/` — every owner-specific value is
  a `[TODO ...]` placeholder. The check exists to stop the site shipping with
  placeholders, so it is doing its job.
- `check-links` on `/resume.pdf` (the hero button and the approval block) and on
  the form's `FORMSPREE_ID` action. The résumé is deliberately not fabricated,
  and the site must not ship with a dead form.

Everything else passes. See `docs/OWNER-TASKS.md` for the single pass that
clears the rest.

