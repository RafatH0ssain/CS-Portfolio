# Portfolio — build kit

This folder is everything needed to build your portfolio website with MiMo
Code. The design, the rules and the step-by-step plan are already written. The
coding agent (Space Bunny) does the building; you answer its questions,
approve its steps, and push to GitHub yourself.

The site: a set of engineering drawings of you, "revision 0.9", shipping v1.0
when you graduate in May 2027. Dark blueprint paper, one bold typeface, a
revision slider that rewinds your degree year by year, and your projects drawn
as an exploded stack of parts. Open `docs/reference/screens/01-home-desktop-1440.jpg`
to see it.

Your own details (name, experience, projects, certifications, contact) are
**not** in this folder. The agent will collect them from your Obsidian notes,
with you, and ask you to approve every file.

---

## What you need

- **MiMo Code**, set to the **Space Bunny** model at **medium** effort.
- **Node.js 22.12 or newer** (`node --version` to check) and **git**.
- The **folder path of your Obsidian vault** (the agent reads it, never writes).
- Your **résumé as a PDF**, without your phone number or home address (it will
  be public).
- Real **screenshots** of your projects, if you have any. Not required.
- Later: a **GitHub** account (for the code), a free **Formspree** account (for
  the contact form), and a free **Cloudflare** account (for hosting).

## Set up (about 5 minutes)

1. Put this folder where you keep projects, and open a terminal in it.
2. Make it a git repository and turn on the safety hooks:
   ```sh
   git init -b main
   sh scripts/setup-hooks.sh
   ```
   The hooks make every `git push` ask you to type `push`, and stop secrets or
   Obsidian files from being committed.
3. Start MiMo Code in this folder, and choose Space Bunny, medium effort.
4. Paste this as your first message (put in your vault path):

   > Read AGENTS.md and follow it exactly. Then start step 0 of
   > docs/BUILD-PLAN.md. My Obsidian vault is at: `/path/to/your/vault`.
   > Ask me before every decision, and wait for my approval at the end of
   > every step.

## What to expect

- **Lots of questions.** That's intended: it is told to ask rather than guess.
  Answer in plain words; you can always say "show me the options".
- **Permission prompts.** MiMo Code will ask before it installs packages,
  commits, reads your vault or writes your content files. Read what it wants
  to do, then allow or deny. `mimocode.json` in this folder sets these rules.
- **Approval at the end of each step** (there are 12, numbered 0 to 11). Look
  at the pages at phone and desktop width before saying "approved".
- **It cannot push.** When a step is committed, it gives you a command like
  `git push -u origin main`. Run it in your own terminal and type `push` when
  asked. Create the empty GitHub repository first (no README, no licence), and
  connect it once with `git remote add origin <url>`.
- **It cannot deploy.** Step 11 tells you the few clicks in Cloudflare.

## Things the agent is told never to do

Invent anything about you; publish a phone number, address or GPA (unless you
say so); generate images of your work; write to your Obsidian vault; push,
force-push or deploy; change the check scripts or the git hooks; add analytics
or trackers. If you see it trying, say no and tell it to re-read AGENTS.md.

## If something goes wrong

- **It seems lost or repeats itself:** start a new MiMo session in this folder
  and say: "Read AGENTS.md, then docs/PROGRESS.md, and continue from the first
  unfinished step." Progress lives in `docs/PROGRESS.md`, so nothing is lost.
- **A check fails and it wants to change the check:** say no. The checks are
  the quality bar. Ask it to fix the page instead.
- **It wants to redesign something:** say no, and point it to
  `docs/reference/prototype/`. The design is decided.
- **A push is rejected by the hook:** that's the hook asking you to type
  `push`; run the push yourself in a normal terminal.

## What's in this folder

| path | what it is |
|---|---|
| `AGENTS.md` | the agent's instructions (MiMo Code reads it automatically) |
| `mimocode.json` | what the agent may do without asking, must ask for, or may never do |
| `docs/BUILD-PLAN.md` | the 12 build steps |
| `docs/SPEC.md` | what the site contains and the rules for your content |
| `docs/DESIGN.md` | the visual rules |
| `docs/CONTENT-INTAKE.md` | how the agent reads your Obsidian notes, safely |
| `docs/LEARNINGS.md` | mistakes from an earlier portfolio, turned into rules |
| `docs/reference/` | the working prototype and its screenshots: the design itself |
| `content/*.example.*` | the shape of each content file; real ones are made with you |
| `src/` | the content schemas (already written and tested) |
| `scripts/` | quality checks and the hook installer |
| `.githooks/` | the push confirmation and the commit guard |
| `.github/workflows/ci.yml` | runs every check on GitHub after each push |

Font: Anybody, by The Anybody Project Authors (Etcetera Type Co.), under the SIL Open Font License
(`public/fonts/OFL-LICENSE.txt`).
