# OWNER-TASKS.md — your one pass, at the end

The website is built and working. Every page renders, every check that can pass
on placeholder content does, and the design matches the reference screenshots.

What is left is the part only you can supply: **your own content.** It is not
scattered through the code. It all lives in `content/`, and it is all written
as `[TODO ...]` so you can see exactly what is missing and nothing else.

Do the steps below in order. Nothing else needs changing.

Right now, two checks fail on purpose and both are cleared by this one pass:

| check | why it fails |
|---|---|
| `check-content` | every owner value is a `[TODO ...]` placeholder |
| `check-links` | `/resume.pdf` does not exist, and the form action is still `FORMSPREE_ID` |


---

## Before you start

`node --version` must be 22.12 or newer. Run `npm run build` once to see where
you are; it will fail on placeholders, which is expected.

---

## 1. `content/profile.json` — who you are

The only file with your name in it. Fill in:

| field | what to put |
|---|---|
| `name.first`, `name.last` | exactly as you want them shown, 14 characters each. Accents and hyphens are fine. |
| `email` | the one address recruiters should use. One address only. |
| `location` | your city, or delete the line to hide it. |
| `links.github`, `links.linkedin` | your real profile URLs. Delete `linkedin` if you have none. |
| `formspreeId` | the last part of your Formspree form URL. Leave it out until you have one; the form will show `FORMSPREE_ID` and the site will refuse to ship. |
| `updated` | this month as `YYYY-MM`. |
| `head` | the headline at v0.9, 40 characters at most. |
| `bio` | one or two sentences, under 220 characters. |
| `featured` | the four slugs of the projects you want on the exploded plates, top plate first. The slugs are the file names in `content/projects/`. |
| `shortVersion` | two or three notes, a bold lead and a short remainder. |
| `figure.modules` | three pairs of short labels for the FIG. 1 boxes, appearing at years 2, 3 and 4. Six words total. |

Already correct, do not change: `drawingNo`, `program`, `programLong`,
`shipsOn`, `openTo`.

## 2. `content/revisions.json` — the scrubber's six stops

Six stops, already dated and levelled. Fill in `head` and `bio` for stops 0.1,
0.3, 0.5 and 0.7: one line each, what you actually did that year. The v0.9
stop has no text of its own; it uses `profile.head` and `profile.bio`.

Check the dates against when you started the degree. If the fourth stop was not
a co-op, rename its `era` and `short` (an internship, a research term, a summer
project) and rewrite its `head` and `bio`.

## 3. `content/skills.json` — the chips

4 to 24 tools and languages, each with the level at which you first used it for
real (0 to 4). No ratings, no percentages. Cut the list down to what you would
be happy to be interviewed on.

## 4. `content/experience.json` — sheet 4

One entry per organisation: company, lab, society, course you taught, hackathon.
For each, one role (or one role per promotion), the dates, a one-line outcome
summary, and up to six outcome bullets.

`stream` is one of `development`, `research`, `leadership`, `awards`. The
letters A, B, C and the group headings are generated for you.

`approvedBy` is who can vouch for the work, phrased without a name or contact
details: "Manager, reference on request".

## 5. `content/projects/part-01.md` … `part-09.md`

One file per project. The file name is the slug and the URL. Delete the ones
you do not have, and add new ones by copying an existing file.

The fields worth reading before you answer:

- `summary` — one line: the problem, and who had it.
- `role` — what **you** personally owned. This is the one an interviewer reads.
- `issues` — every project admits a known limitation. Keep it real.
- `decisions` — what you chose, instead of what, and why. The `because` line
  is the interesting one.
- `history` — versions and dates, newest first.
- `links` — only URLs that work today. Delete a key rather than leave it empty.
- `figure.schematic` — which drawing stands in for the work: `grid`, `chart`,
  `nodes` or `pipeline`.

Then, for the four featured projects, make sure `profile.featured` lists exactly
their slugs, top plate first.

## 6. `content/certifications.json`

Keep it only if you have certifications. Every row needs the issuer's own
verification URL; without one, it does not go on the site. Delete the file
entirely and the site drops to four sheets automatically.

## 7. `content/academics.json`

Set `"show": false` to hide the inspection report under certifications, or
delete the file.

**The GPA is not in there and must not go in unless you decide to publish it.**
Add a `gpa` key only if you want it public.

## 8. Files you have to drop in

| path | what it is |
|---|---|
| `public/resume.pdf` | your current résumé. It will be public: check it has no phone number and no home address before you put it in. Never create one for yourself. |
| `src/assets/projects/<slug>.png` | optional. A **real** screenshot of that project, browser chrome and personal bookmarks cropped out. Then add `image` and `alt` under `figure` in that project's file. If you have no real screenshot, do not add one: the drawn schematic is the correct answer. |

## 9. `astro.config.mjs` — the domain

Replace `https://portfolio.invalid` with the real domain once you have one.
Canonical URLs, Open Graph and the sitemap all read from it, so this is the only
place the address appears.

---

## Then, in order

```sh
npm run verify      # everything green
npm run check:external   # every outside link responds
```

If `check:external` reports a site that blocks automated requests, open those
links by hand and confirm they work. Then commit on a branch and push. Ask
MiMo Code to review the checklist in BUILD-PLAN step 10 if you want a second
pair of eyes before you launch.

## Launch, when you are ready

1. `git push -u origin main`
2. Cloudflare dashboard: Workers and Pages, Create, Import a repository, choose
   the repo. Build command `npm run build`, deploy command `npx wrangler deploy`.
3. Add your custom domain in the Worker's settings.
4. Open the live site on a phone and send yourself a test message through the
   form. That is the only way to know the Formspree ID is right.
5. Check that the `ci` workflow passed on `main` in GitHub.

---

## Never do these

- No phone number anywhere, ever.
- No home address, student number, date of birth.
- No GPA unless you have decided to publish it.
- No AI-generated or stock image standing in for your work. A real capture, or
  the drawn schematic.
- No tool names in commit messages.
