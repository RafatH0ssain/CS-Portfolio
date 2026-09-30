# LEARNINGS.md — what an earlier portfolio taught us

Before this project, a different student's portfolio was built with Next.js,
React and Tailwind, scaffolded by an AI site generator and edited by hand over
about a year. It was reviewed while planning this one. It has nothing to do
with this site's owner, and none of its content belongs here. What it left is
a list of mistakes, each now a rule. The rules are binding, alongside
`AGENTS.md`.

---

## What went wrong, and the rule that prevents it

**1. Content lived inside page code.** About three quarters of its commits
were copy edits, each one inside a 400-line component file. Featured projects
and credentials were written out twice, on two pages.
→ **Rule:** all content lives in `content/`, validated by the schemas. A
template never contains a sentence about the owner. Each fact exists once. If
you are about to paste the same text into two components, stop.

**2. Four of ten project images were AI-generated, not screenshots.** They had
garbled interface text, a 10×10 board for an 8×8 game, and invented dashboards.
A recruiter who zooms in sees fake evidence, which is worse than no image.
→ **Rule:** never create, generate or source an image that stands for the
owner's work. Use a real capture from the owner, or the drawn schematic.

**3. Images were not optimised.** 1024×1024 PNGs up to 926 KB each; the home
page loaded about 1.8 MB of them.
→ **Rule:** Astro `<Picture>` only, AVIF and WebP, explicit sizes.
`check-budget.mjs` fails any built image over 200 KB.

**4. Build safety was switched off.** Type errors and lint errors were set to
be ignored during builds, so they shipped silently.
→ **Rule:** never disable type checking or any check to make a build pass. Fix
the cause, or stop and ask the owner.

**5. The generator left its fingerprint.** A `<meta name="generator">` tag
naming the tool, and a package name containing it. Recruiters and tools that
spot generated sites look for exactly this.
→ **Rule:** no generator meta tag and no tool names in package names, metadata,
comments or commit messages. `check-design.mjs` enforces the tag.

**6. The design hit six of the common tells of an AI-generated site:** a
fashionable serif with one italic accent word in the hero, all-caps kicker
labels above every heading, a numbered stat banner, middle-dot metadata
("2025 · Team of five") and three identical image cards in a row.
→ **Rule:** DESIGN.md's banned list, checked by `check-design.mjs` on every
build. Don't argue with it; fix the output.

**7. The centrepiece was a desktop-only effect that never stopped.** The hero
ran a per-pixel canvas animation on every frame, forever, driven by the mouse,
with a hint telling visitors to move their cursor. Phones have no cursor, and it
kept draining the battery after it scrolled away.
→ **Rule:** interactions are input-driven, not frame-driven. No animation loop
that runs while idle or offscreen. Everything works by touch and keyboard
first. The scrubber and the parts explorer meet this; keep it that way.

**8. The deploy broke on a lockfile** made on one operating system that failed
to build on another.
→ **Rule:** CI builds on Linux with `npm ci` for every push. Commit
`package-lock.json` only after `npm install` succeeds, and never hand-edit it.

**9. Giant commits.** "Redesigned all pages" landed as one commit that could
not be reviewed or partly reverted.
→ **Rule:** one logical change per commit, on a branch per step.

**10. A dead link shipped** and needed a fix after launch.
→ **Rule:** internal links are relative to the site. `check-links.mjs` checks
every link and anchor in `dist/`; `--external` checks outside links too.

**11. Contact had rough edges.** The form's error path was a browser `alert()`.
A personal phone number was published in plain text. Two email addresses
competed.
→ **Rule:** one email address, a form whose errors appear inline in the page's
own voice, and never a phone number. The schemas and the pre-commit hook
reject phone numbers.

**12. Everything ran in the browser.** The navigation was client-side code only
to highlight the current link; the footer too, for no reason.
→ **Rule:** decide everything at build time. Only the three approved scripts
run in the browser.

---

## What went right — keep these

- **`<details>` / `<summary>` for disclosure.** Extra detail opened with no
  JavaScript, and worked with keyboard and screen reader. Used here for extra
  outcomes in the revisions table and the mobile menu.
- **Experience grouped by kind of work, with promotions shown inside one
  organisation.** Used here as revision letters and a "Promoted twice" tag.
- **Proof next to projects:** "Still in use", "Team of five". Here they are the
  title block's Status, Users and Team fields.
- **A verification link on every certification.** Evidence over claims.
- **A plain-prose short version** for people who read instead of clicking.
  Here it is the general notes on sheet 1.
- **Zero border radius and `prefers-reduced-motion` respected.** Same here.
