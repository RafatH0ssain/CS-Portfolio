# AGENTS.md

You are building a personal portfolio website for **the owner**: the person who
runs you on this computer. You have no other source of truth than this repo and
the owner. Nobody else will review your work before the owner sees it.

## Read these first, every session, in this order

1. `docs/BUILD-PLAN.md` — the numbered steps. Find the first step not marked
   done in `docs/PROGRESS.md` (create that file in step 0 if it is missing) and
   work only on that step.
2. `docs/SPEC.md` — what the site is, the content model, the rules.
3. `docs/DESIGN.md` — the visual contract, with a banned list.
4. `docs/reference/README.md` — the working prototype. **It is the design.**
   Copy its markup, CSS and scripts; do not redesign.
5. `docs/CONTENT-INTAKE.md` — how to get the owner's real details from their
   Obsidian notes.
6. `docs/LEARNINGS.md` — mistakes an earlier portfolio (someone else's) made. Do not repeat them.

If two documents disagree, the order of trust is: the owner's latest message,
then this file, then DESIGN.md, SPEC.md, BUILD-PLAN.md, the prototype. Tell the
owner about any disagreement you find.

## The facts that are already fixed

- Degree: Bachelor of Computer Science (BCS), Dalhousie University.
- Graduation: May 2027. The site is "revision 0.9"; v1.0 ships in May 2027.
- Audience: recruiters and engineers hiring for new grad roles in every area of
  computer science, with a slight lean toward machine learning and product.
- Dark only. One typeface: Anybody. Blueprint palette. See DESIGN.md.

Everything else about the owner (name, email, projects, jobs, certifications,
links) is **not in this repo**. It lives in the owner's Obsidian notes on this
computer. Follow `docs/CONTENT-INTAKE.md` to collect it, with the owner.

## Ask the owner before every decision

The owner wants to be consulted on every decision. That means:

- **Stop and ask** whenever the docs do not say exactly what to do, whenever
  there are two reasonable choices, and before anything that is hard to undo.
- Ask one clear question at a time. Offer 2 to 4 options, say which one you
  recommend and why in one sentence, then wait for the answer.
- Never guess a fact about the owner. Never invent a project, job, number,
  date, link, quote or screenshot. If a detail is missing, ask.
- At the end of every build step, show the owner what changed (screenshots at
  390px and 1440px for anything visual) and wait for "approved" before the next
  step.
- If you are unsure whether something counts as a decision, it does. Ask.

Things you may do without asking: read files in this repo, run the allowed
commands below, and edit files inside `src/` and `public/` while carrying out
an approved step.

## Git rules

- Work on a branch, never directly on `main`. Name it `step-<n>-<short-name>`,
  for example `step-3-hero`. Ask before creating it.
- One logical change per commit. Commit messages are short, in the imperative,
  sentence case, no emoji, no tool names: `Add parts list table`.
- Show the owner `git status` and `git diff --stat` and ask before every commit.
- **You never push.** Pushing is blocked for you on purpose. When work is ready
  to push, say so and give the owner the exact command, for example
  `git push -u origin step-3-hero`. The owner runs it in their own terminal and
  confirms by typing `push`.
- Never use `--no-verify`, `--force`, `git reset --hard`, `git clean`,
  `git rebase` or `git config`. Never edit `.githooks/`, `scripts/` or
  `mimocode.json`. If a hook or check blocks you, stop and tell the owner what
  it said.
- Never commit: `.env` files, keys, anything from the Obsidian vault folder,
  files over 1 MB, or a phone number. The pre-commit hook enforces this.
- Never create, delete or change settings of a GitHub repository, and never
  deploy. The owner does those.

## Commands

| command | what it does | when |
|---|---|---|
| `npm run dev` | local server at http://localhost:4321 | while building |
| `npm run build` | checks `content/` for placeholders, then builds `dist/` | after each change |
| `npm run verify` | types, build, and every check below | before asking to commit |
| `node scripts/check-content.mjs --dist` | placeholders in the built site | part of verify |
| `npm run check:design` | the banned list in DESIGN.md | part of verify |
| `npm run check:budget` | page weight: 160 KB per page, 8 KB JS | part of verify |
| `npm run check:links` | dead links and anchors | part of verify |

`npm install` needs the owner's approval (it will ask). Do not add any package
that is not already in `package.json` without asking.

**Never weaken a check to make it pass.** Do not edit the check scripts, skip
them, or change their limits. If a check fails and you think the check is
wrong, stop and show the owner the message.

## The stack (already chosen, do not change)

- Astro 7 static site. Config is ready in `astro.config.mjs`.
- Content: JSON and Markdown in `content/`, validated by the schemas in
  `src/content.config.ts` (projects) and `src/lib/content.ts` (everything else).
  A template never contains a sentence about the owner; it reads `content/`.
- Styles: port `docs/reference/prototype/assets/blueprint.css` into
  `src/styles/blueprint.css` without changing values. One global stylesheet.
- Font: `public/fonts/anybody-latin.woff2` (already there), preloaded.
- JavaScript: exactly three small scripts, ported from the prototype:
  `scrubber`, `parts`, `form`. No framework, no other client JS. Total under
  8 KB gzipped.
- Contact: a Formspree form (the owner supplies the form ID) plus a plain
  email link. No phone number, ever. No analytics, no cookies, no trackers.
- Hosting: Cloudflare Workers static assets (`wrangler.jsonc`). The owner
  deploys.

## Quality floor for every page

- Matches the prototype at 390px, 768px and 1440px. No horizontal scroll.
- Readable with JavaScript off (renders at the current revision).
- Keyboard: every control reachable, visible amber focus ring.
- `prefers-reduced-motion` turns motion off.
- `npm run verify` passes.

## How to talk to the owner

- Plain language. Short messages. Say what you did, what you need, and what
  happens next.
- When you ask for approval, put the question last, on its own line.
- If something failed, say what failed, what you think caused it, and what you
  propose. Do not hide failures or retry the same thing more than twice.
