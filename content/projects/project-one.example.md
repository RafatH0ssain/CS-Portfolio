---
title: "[Project name, 40 characters at most]"
plateTitle: "[18 characters at most; delete if the title is already that short]"
version: "v1.0.0"
level: 2
order: 1
kind: "[Product | ML | Systems | Web | Algorithms]"
summary: "[One line: the problem this solved, and who had it.]"
role: "[What the owner personally owned]"
team: "[Solo build | Team of N]"
duration: "[N months]"
status: "In production"
stack: ["[Language]", "[Framework]", "[Datastore]"]
links:
  repo: "https://github.com/[user]/[repo]"
figure:
  schematic: "grid"
  callouts:
    - { x: 0.28, y: 0.21, title: "[The part they built]", note: "[One line on what it does.]" }
    - { x: 0.58, y: 0.30, title: "[A second part]", note: "[One line.]" }
added:
  - "[The core capability, with the outcome it produced.]"
changed:
  - "[Something rebuilt after learning it was wrong the first time.]"
issues:
  - "[The limitation they know about and have not fixed.]"
decisions:
  - title: "[The decision, in a few words]"
    chose: "[What they went with.]"
    instead: "[The alternative they rejected.]"
    because: "[The reason. This is the line an interviewer will ask about.]"
history:
  - { version: "v1.0.0", date: "2025-03", note: "[First working version.]" }
---

[Two or three short paragraphs: what this is, who needed it, and why it mattered.
Plain language, the way the owner would explain it to another engineer who has
five minutes.]

<!--
Screenshots: only a real capture the owner provides. Save it as
src/assets/projects/<slug>.png (or .jpg), then add under figure:
  image: "../../src/assets/projects/<slug>.png"
  alt: "What the screenshot shows, in one sentence."
Without one, the schematic named above is drawn instead. Never generate an image.
-->
