---
title: "PhotosByRH"
plateTitle: "PhotosByRH"
version: "v1.0.0"
level: 2
order: 6
kind: "Web"
summary: "A photography portfolio that keeps motion off the critical path, so the first photographs paint from the HTML."
role: "Built the galleries, the lightbox and the image pipeline that feeds both"
team: "Solo build"
duration: "8 months"
status: "In production"
stack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Framer Motion", "Vercel"]
links:
  live: "https://photosbyrh.vercel.app"
  repo: "https://github.com/RafatH0ssain/PhotosByRH"
figure:
  schematic: "grid"
  callouts:
    - { x: 0.28, y: 0.21, title: "No reveal on LCP", note: "Above-the-fold images paint from the HTML instead of waiting for hydration." }
    - { x: 0.58, y: 0.30, title: "Lightbox on click", note: "Only the photo you tapped mounts first; its neighbours follow once it is up." }
    - { x: 0.82, y: 0.66, title: "2560px masters", note: "A repeatable script downsamples every master, and the source JPEGs are gone." }
    - { x: 0.20, y: 0.74, title: "19.3:1 button", note: "A white pill with a black label, because a UI colour fights the photographs." }
added:
  - "Six galleries deployed, with a repeatable optimize script anyone can re-run after adding photos."
  - "Static image imports, so every gallery renders a blur placeholder at the right aspect ratio."
  - "A branded 404 page, cross-origin isolation headers, and text that clears WCAG AA."
changed:
  - "Found why no full-size photo ever loaded: a quality of 85 against an allow-list of 75, which Next 16 answers with a 400."
  - "Cut lightbox open latency by asking for 2x density and deferring the neighbours' prefetch."
  - "Reverted the spring-driven redesign back to the pre-redesign lightbox implementation."
issues:
  - "A CSP nonce is not viable while every route is statically prerendered, so the policy ships without one."
  - "Any quality passed to next/image must be listed in images.qualities, and an unlisted one is a silent 400."
decisions:
  - title: "CSS on the page, Framer in the lightbox"
    chose: "plain CSS transitions for page and grid motion, Framer Motion only inside the lightbox"
    instead: "animating every gallery with Framer Motion"
    because: "CSS transitions run on the compositor, and hero entrances then start at first paint rather than after hydration."
  - title: "Monochrome, not a brand hue"
    chose: "a white pill with a black label, 19.3:1, as the primary action"
    instead: "a saturated accent colour for the primary action"
    because: "on a page that is almost entirely photographs, a UI colour competes with the only thing meant to carry colour."
  - title: "Mount the lightbox late"
    chose: "mount only the photo that was clicked, on its first frame"
    instead: "mounting the whole lightbox with every neighbour up front"
    because: "the neighbours are prefetched once the photo is on screen, so arrowing does not stall on a cold fetch."
history:
  - { version: "v0.1.0", date: "2025-12", note: "First commits: base files, the image set, and a landing page that stopped breaking." }
  - { version: "v0.2.0", date: "2026-02", note: "Sports, pets, wildlife and about sections, an image lightbox, and the galleries moved to WebP." }
  - { version: "v0.3.0", date: "2026-08", note: "Image pipeline, blur placeholders, a 404 page, and a lightbox that actually loads." }
  - { version: "v1.0.0", date: "2026-08", note: "System typography and a redesign, then the redesigned lightbox reverted to the earlier one." }
---

My own photographs, in six galleries: wildlife, sports, pets, film, brands and event work. It is a portfolio, so the only thing that matters is that the picture arrives and nothing is in the way of it. Hero entrances are CSS animations, above-the-fold images are never hidden behind a scroll reveal, and the lightbox mounts only the photo you tapped on its first frame, with its neighbours prefetched once that one is on screen.

The palette is monochrome on purpose. On a page that is almost entirely photographs, a saturated interface colour competes with the only thing meant to carry colour, so the primary action is a white pill with a black label at 19.3:1. Chrome is a translucent material that fades in once content scrolls under it and honours the reduced-transparency and contrast settings.

One bug is worth naming. The lightbox had been requesting a quality Next 16 does not allow, and Next answers an unlisted quality with a 400 rather than clamping it, so no full-size photo ever loaded and the blur placeholder simply stayed up. A later redesign rebuilt the lightbox around spring-driven gestures, and it was reverted to the earlier implementation.