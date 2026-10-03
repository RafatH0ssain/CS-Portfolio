---
title: "Lumen Gallery"
plateTitle: "Lumen Gallery"
version: "v1.0.0"
level: 3
order: 4
kind: "Web"
summary: "A snap-through feed of the Cleveland Museum of Art's open collection, with docent notes written once and cached for good."
role: "Wrote the spec, the museum API migration and the cost controls"
team: "Solo build"
duration: "About 2 months"
status: "In production"
stack: ["React 18", "Vite 6", "Tailwind 4", "Cloudflare Pages", "Workers KV", "OpenAI"]
links:
  live: "https://lumen-gallery.pages.dev"
  repo: "https://github.com/RafatH0ssain/Lumen-Gallery"
figure:
  schematic: "pipeline"
  callouts:
    - { x: 0.28, y: 0.21, title: "Cleveland Open Access", note: "Keyless and CC0, so the browser can call it directly and the key never ships." }
    - { x: 0.58, y: 0.30, title: "Write-once note", note: "Each docent note is generated once, then served from KV at about $0.0001." }
    - { x: 0.82, y: 0.66, title: "Genre loop", note: "Double-tap a work and the next few come from its genre, then it drifts back." }
    - { x: 0.20, y: 0.74, title: "41,511 works", note: "The explore pool, up from the 1,000 the previous source would serve." }
added:
  - "AI docent notes for $0 a month: cached per artwork, rate limited per IP, capped in the OpenAI dashboard."
  - "Grew the explore pool from 1,000 reachable works to 41,511 by moving off a capped search API."
  - "Lighthouse accessibility 100 and CLS 0, with the first search fired from an inline script before the bundle."
changed:
  - "Moved the whole feed from Chicago to Cleveland in one release after their CDN began 403ing images."
  - "Fixed a pagination cap nobody had measured: 1,000 records, not the 10,000 the spec assumed."
  - "Replaced the catalogue grid with a full-screen snap feed, a single-tap lightbox and pinch zoom."
issues:
  - "Cleveland publishes no IIIF service, so the fixed web rendition is the only usable image size."
  - "The OpenAI key is live on a keyless public endpoint; the dashboard budget cap is the only backstop."
decisions:
  - title: "Generate each note once, ever"
    chose: "write every description through to KV on first request and serve it from there"
    instead: "calling OpenAI on every page view"
    because: "a keyless public endpoint has to cost nothing to run, and the note is about $0.0001 once per artwork."
  - title: "Call the museum from the browser"
    chose: "call the museum's free, keyless API from the client and proxy only OpenAI traffic"
    instead: "proxying every artwork request through a Pages Function"
    because: "the only secret worth protecting is the OpenAI key, and the endpoint validates each id against the catalogue first."
  - title: "A blocked CDN is not a proxy problem"
    chose: "migrate the feed to the Cleveland Museum of Art Open Access API"
    instead: "proxying images through a server to get around the block"
    because: "the block was reproduced from residential, cellular, datacenter and edge vantage points, so a proxy would be blocked too."
history:
  - { version: "v0.1.0", date: "2026-07", note: "Verified against the live APIs; the pagination cap fixed and a User-Agent added to the worker fetch." }
  - { version: "v0.2.0", date: "2026-07", note: "Redesign into a full-screen snap feed with a single-tap lightbox and ambient UI." }
  - { version: "v1.0.0", date: "2026-08", note: "Artwork source migrated from Art Institute of Chicago to Cleveland Museum of Art." }
---

One artwork per screen, hung on a black wall in De Stijl red, blue and yellow. Tap a piece to open it full-screen, then pinch, double-tap or scroll to get into the brushwork. Double-tap something you like and the next few pieces come from the same genre, weighted by a hierarchy that goes culture, then technique, then type, and the feed reverts to serendipity once you scroll past them untapped. Every piece carries a docent note that streams in token by token.

The cost of the API calls shaped the design. The museum's API is free and keyless, so the browser calls it directly and the only secret that has to be protected is the OpenAI key, which never leaves a Pages Function. Each note is generated once, written through to a Workers KV namespace, and served from there after that, which puts the whole thing at about $0.0001 per artwork, once, forever.

The rewrite came from a header. On 5 December 2025 the previous source's image host started answering every programmatic request with a Cloudflare challenge and a header forbidding cross-origin embedding, so every artwork rendered as a broken-image icon. I reproduced it from residential, cellular, datacenter and edge vantage points, which ruled out a server-side proxy, and eventually moved the whole feed to Cleveland's CC0 API in a single release.