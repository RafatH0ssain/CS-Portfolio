---
title: "lazy-catalog"
plateTitle: "lazy-catalog"
version: "v0.2.0"
level: 4
order: 5
kind: "Systems"
summary: "A zero-dependency catalogue for a film folder, combining TMDB metadata with ffprobe facts read out of the files themselves."
role: "Wrote the catalogue, the CLI and the no-facts-from-the-model rule"
team: "Solo build"
duration: "1 month"
status: "In progress"
stack: ["Python 3.9+", "ffprobe", "TMDB API", "OMDb API", "Ollama", "launchd"]
links:
  repo: "https://github.com/RafatH0ssain/lazy-catalog"
figure:
  schematic: "grid"
  callouts:
    - { x: 0.28, y: 0.21, title: "299 tests", note: "Covered by unittest, run with a single discover command." }
    - { x: 0.58, y: 0.30, title: "Facts from files", note: "Codecs, resolution and subtitles come from ffprobe, not from a filename." }
    - { x: 0.82, y: 0.66, title: "Picks by number", note: "The model chooses from a list it is handed, so it cannot invent a title." }
    - { x: 0.20, y: 0.74, title: "Never a fact", note: "The model only cleans up unreadable folder names and writes mood tags." }
added:
  - "A browsable offline library page plus a CONTENTS.md, both rebuilt when the folder changes."
  - "A watchlist of films you do not own, each one looked up on TMDB before it is shown to you."
  - "Subtitle downloads capped at 25 files a run, because the free providers are rate limited."
changed:
  - "Defaulted to a 12B model: a 24B measured 20 GB resident and 12.7 s a call against 8.6 GB and 4.7 s."
  - "Switched reasoning off after gemma4 spent 126 tokens and 11.6 s on a one-word answer with it on."
  - "Rewrote release-name parsing to end a title at season markers in any spelling and read a bracketed year as the release year."
issues:
  - "macOS only, and the library page needs the CLI running: a page opened off disk cannot launch VLC."
  - "A year in a title is guesswork: (2017) wins over a bare number, and a year that has not happened is part of the name."
  - "Ollama and subliminal are optional, and each one degrades gracefully when missing."
decisions:
  - title: "The model never states a fact"
    chose: "take runtimes, genres and ratings from TMDB and codecs from ffprobe"
    instead: "asking the local model for a runtime or a rating"
    because: "a small model asked for a runtime will confidently invent one, and a wrong fact is not an opinion."
  - title: "Serve the page, do not open it"
    chose: "serve the library page from 127.0.0.1 and keep it running until you stop it"
    instead: "opening the generated page straight off disk with file://"
    because: "VLC registers no URL scheme on macOS, so a file:// page has no way to launch anything."
  - title: "Let the model choose an index"
    chose: "hand the model the catalogue as a numbered list and check every number against it"
    instead: "letting the model name a title from memory"
    because: "every number is checked, so it cannot recommend a film that is not in the library."
history:
  - { version: "v0.1.0", date: "2026-08", note: "Library scanner, release-name parser, cache and the CONTENTS.md renderer." }
  - { version: "v0.1.0", date: "2026-08", note: "TMDB and ffprobe enrichment, the web view, lazy-pick, the watcher and .nfo sidecars." }
  - { version: "v0.2.0", date: "2026-09", note: "lazy-suggest added: films you do not own, each verified against TMDB and saved to a watchlist." }
  - { version: "v0.2.0", date: "2026-09", note: "Trash-backed delete, Rotten Tomatoes scores, and versioned enrichment." }
---

Point it at a folder of films and series and it gives you back a readable table, an offline web page, and a CLI that tells you what to watch. Runtimes, genres and ratings come from TMDB. Resolution, codecs and embedded subtitles come from ffprobe reading your actual files. A background job notices when the folder changes and rebuilds the catalogue, and a new title is not published until its file size stops changing, so a half-finished download never lands in it.

The rule underneath is that the model is never asked for a fact. It cleans up folder names nobody can read and writes mood tags, which are opinions. Everything else is verified: 299 tests, no Python dependencies, and a pick command where the model chooses a number from a list it was handed, so it cannot recommend a film you do not own. Suggest does the opposite, reading the library as a taste profile and checking every candidate on TMDB before you see it.

What is left is macOS-only, the release-name parser is rules rather than certainty, and the optional pieces fail quietly: no Ollama means no mood tags, no subliminal means no subtitles.