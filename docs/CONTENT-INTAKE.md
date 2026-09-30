# CONTENT-INTAKE.md — getting the owner's details into `content/`

The owner's real details (experience, projects, certifications, contact
information) are **not in this repo**. They are in the owner's **Obsidian notes
on this computer**. This file is how you collect them. It is build step 1 in
`BUILD-PLAN.md`, and it happens with the owner, one file at a time.

---

## Rules for the vault

1. **Ask the owner for the vault's folder path.** Do not search the disk for it.
   Reading outside the repo will trigger a permission prompt; that is expected.
2. **Read only.** Never create, edit, move, rename or delete anything in the
   vault. Never run a command that writes inside it.
3. **Never copy vault files into the repo**, and never read or copy the vault's
   `.obsidian/` settings folder. Only the facts you extract go into `content/`.
4. **Ask before reading.** List the note names you think are relevant (by file
   name, for example `Experience.md`, `Projects/`, `Certifications.md`) and ask
   the owner which to read. Don't open journals, diaries, finance, health or
   anything that is clearly private.
5. **Public facts only.** A portfolio is public. Never put any of these into
   `content/`, even if a note contains them:
   - phone numbers (never, even if asked casually: confirm twice)
   - home or mailing address, date of birth, student number, SIN, passport or
     immigration details
   - GPA or grades (only if the owner explicitly says "publish my GPA")
   - salary, private opinions about people, references' contact details
   - anything about another person beyond their public role ("Manager")
   When unsure, leave it out and ask.
6. **Never invent or improve facts.** If a note has no number, the site has no
   number. If a date is missing, ask. If two notes disagree, show both and ask.

### Reading Obsidian notes

- Notes are Markdown. Many start with YAML frontmatter between `---` lines;
  that often holds dates, tags and links.
- `[[Note name]]` and `[[Note name|shown text]]` are links between notes. Use
  the shown text (after `|`) or the note name, without brackets. Follow a link
  only if the owner agrees.
- `#tag` words are tags; ignore them unless they help you find things.
- `![[image.png]]` embeds an attachment from the vault. See "Images" below.
- Callouts look like `> [!note]`. Treat them as normal text.

---

## The order

Do these in order. For each file:

1. Tell the owner which notes you will read for it and wait for a yes.
2. Draft the file from the notes. Rewrite the wording to fit the site's voice
   (past tense, specific, numbers where the notes have them, no banned words,
   sentence case; see DESIGN.md, "Voice").
3. Show the owner the complete draft, plus a short list: what you could not
   find, and what you inferred. Ask them to approve or correct it.
4. Only after approval, write the file (the write will ask for permission).
5. Run `npm run build`. If validation fails, show the error, fix the file with
   the owner, and run it again.
6. Mark the file done in `docs/PROGRESS.md`.

### 1. `content/profile.json`

From the contact or "about me" notes, and by asking:

- First and last name, exactly as the owner wants them shown (each 14
  characters at most; ask about accents and hyphens).
- The email address recruiters should use (ask; there may be several).
- GitHub URL, LinkedIn URL (optional), and whether to show their city
  (`location`, optional).
- Confirm the fixed facts: Bachelor of Computer Science, Dalhousie University,
  graduating May 2027. If any of these is wrong, stop and tell the owner that
  the whole design is dated to May 2027, and ask how to proceed.
- `head` and `bio`: draft two options for the owner to pick from. The bio is one
  or two sentences: what they build, the lean toward ML and product, open to
  new grad roles across CS.
- `shortVersion`: two or three notes, each a bold lead and a short remainder.
- `featured`: fill this in after the projects are done (step 5 below).
- `figure.modules`: show the default labels (Languages, Algorithms, Systems,
  Web, ML, Product) and ask whether they fit the owner's path.
- `formspreeId`: see "Formspree" below. Can be filled in last.
- `updated`: this month, `YYYY-MM`.

### 2. `content/revisions.json`

The scrubber's six stops. Ask the owner for the month they started the degree,
and whether they did a co-op or internship term (and when). Fill in dates, and
for each past stop draft a headline (40 characters at most) and a one- or
two-sentence bio from what the notes say they did that year. Show the table:

| rev | era | date | level | headline | bio |

The v0.9 stop has no headline or bio (it uses the profile's). The v1.0 stop's
text stays as in the example.

**Assigning levels to everything else.** A skill, project or job gets the level
of the latest stop that started on or before the thing began. Example: stops
at 2023-09 (0), 2024-09 (1), 2025-01 (2), 2025-09 (3), 2026-09 (4); a project
started 2025-03 gets level 2. Show the owner the resulting levels.

### 3. `content/skills.json`

4 to 24 skills, each with the level at which the owner first used it for real.
Tools and languages, not soft skills. No ratings. Ask the owner to cut the list
to what they would be happy to be interviewed on.

### 4. `content/experience.json`

One entry per organisation (company, lab, society, course they TA'd, hackathon).
For each: org name, location (optional), stream (development, research,
leadership, awards), and roles newest first. For a promotion, list each title as
its own role in the same organisation. For each role: title, start and end
(`YYYY-MM`, `null` for current), a one-line summary that is an outcome, up to
six more outcome bullets, and who can vouch ("Manager, reference on request";
never a name or contact details unless the owner insists).

### 5. `content/projects/<slug>.md`, one at a time

Ask the owner which 3 to 12 projects to include, and which 3 or 4 are featured
(then fill in `profile.featured`, top plate first). For each project, fill in
every field of `content/projects/project-one.example.md`. Notes rarely have all
of it, so ask directly:

- What did you personally build or own? What was the team?
- What is the version now, roughly? (Ask how many real iterations it had. Use
  `v0.x.0` for unfinished work.)
- Who used it, if anyone? (Leave `users` out if unknown.)
- What went into it (up to six technologies)?
- Added: what does it do, and what changed because of it? Any number?
- Changed: what did you rebuild after getting it wrong the first time?
- **Known issue: what is its biggest limitation today?** (Required.)
- One to three decisions: what did you choose, instead of what, and why?
- A short history: versions and dates.
- Links: repository, live site, write-up. Only real, working URLs.
- A screenshot? (See "Images".) If not, which schematic fits best: `grid`,
  `chart`, `nodes` or `pipeline`? Suggest one.
- Two to four callouts: the parts of the figure the owner built, each with a
  point on the figure (x and y from 0 to 1) and one line of explanation.

The slug is the file name: lowercase, hyphens, short (`course-planner`).

### 6. `content/certifications.json` (only if the owner has any)

Title, issuer, year, credential ID (optional) and the issuer's verification
URL. No verification URL, no listing: ask the owner to find it.

### 7. `content/academics.json` (ask first)

Ask: "Do you want an academics block (standing, awards) under certifications?"
If no, don't create the file. GPA only on an explicit yes.

### 8. The résumé

Ask the owner for their current résumé PDF and its path. Copy it to
`public/resume.pdf` (ask first). Check it has no phone number or home address;
if it does, tell the owner and ask them to supply a version without, since the
file will be public. Never create or edit a résumé.

---

## Images

- **Only real screenshots of the owner's own work**, supplied or confirmed by
  the owner. Never generate, draw, download or source an image to stand in for
  their work. If there is no screenshot, use the schematic.
- If a note embeds a screenshot, ask the owner whether it is a real capture of
  that project and whether to use it.
- Copy it (with permission) to `src/assets/projects/<slug>.png` or `.jpg`,
  and add `image` and `alt` to the project's `figure`. Crop out browser chrome,
  personal bookmarks, email addresses, names of other people and anything
  private. If you cannot crop it, ask the owner for a clean one.
- Astro makes the small AVIF and WebP versions at build time. The source file
  can be large; the built files must each stay under 200 KB (the budget check
  enforces this).

## Formspree

The contact form sends messages to the owner's email through Formspree. The
owner does this part themselves:

1. Sign up or log in at formspree.io with the email that should receive
   messages.
2. Create a new form. Formspree shows its endpoint, like
   `https://formspree.io/f/abcdwxyz`.
3. Give you the last part (`abcdwxyz`). You put it in `profile.formspreeId`.

The free plan has a monthly submission limit; mention this to the owner.
Until the ID is in, the site still builds (the form's action is
`https://formspree.io/f/FORMSPREE_ID`), but `check-content --dist` fails on
purpose, so the site cannot ship with a broken form.
