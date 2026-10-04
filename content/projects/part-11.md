---
title: "Launch Window Engine"
plateTitle: "Launch windows"
version: "v1.0.0"
level: 2
order: 11
kind: "Systems"
summary: "Finds every launch window from Spaceport Nova Scotia for a target orbit, timed to orbital injection, with a scored weather probability on each."
role: "Designed the API contract, built the FastAPI service and the first frontend"
team: "Team of 5"
duration: "3 days"
status: "Stable"
stack: ["Python", "FastAPI", "JSON Schema", "pandas", "JavaScript", "Leaflet"]
links:
  live: "https://rafath0ssain.github.io/launch-window-engine/"
  repo: "https://github.com/RafatH0ssain/launch-window-engine"
figure:
  image: "../../src/assets/projects/launch-window-engine.png"
  alt: "The public view: Earth with the ascent from Canso drawn on it, a countdown to the next launch window and dials for azimuth and time to orbit."
  schematic: "pipeline"
  callouts:
    - { x: 0.28, y: 0.37, title: "Ascent from the pad", note: "The climb from Canso to orbit, drawn from the API's own ascent ephemeris." }
    - { x: 0.86, y: 0.2, title: "Live countdown", note: "Counts down to the next window and says plainly whether its weather is a go." }
    - { x: 0.85, y: 0.66, title: "Solved at injection", note: "Aim azimuth, time to orbit and reached inclination for the selected window." }
    - { x: 0.45, y: 0.92, title: "Every crossing in range", note: "A timeline of each window, scrubbable at up to 600x speed." }
added:
  - "Every launch window from Canso for LEO, polar, SSO or custom orbits, timed to injection rather than liftoff."
  - "A FastAPI service with a frozen /v1 contract, provenance on every response and a pip-installable Python client."
changed:
  - "Restricted the viewing map to the ascent of the selected window, after two full orbits marked every city visible."
  - "Moved the API's recorded ground tracks out of the shared fixtures, which the frontend owns, after the two collided."
issues:
  - "Sentinel-3A and 3B only reproduce after a 10 minute vehicle-profile correction fitted to those same launches."
  - "The weather forecast beats climatology out to day 5 only; days 6 to 10 fall back to the seasonal average."
decisions:
  - title: "Freeze the contract first"
    chose: "eight JSON Schemas, tagged before any engine, weather or frontend code existed"
    instead: "letting the API shape follow whatever the engine happened to return"
    because: "four people built in parallel against one interface, so an unannounced schema change would have broken three of them at once."
  - title: "Unreachable is an answer"
    chose: "HTTP 200 with reachable false and the plane-change penalty in the body"
    instead: "a 4xx status for an orbit the pad cannot reach"
    because: "the physics result is the useful part of the response, and 4xx stays reserved for input that is actually malformed."
history:
  - { version: "v0.1.0", date: "2026-10", note: "API contract frozen: eight schemas, their examples and tests, tagged before other work began." }
  - { version: "v0.2.0", date: "2026-10", note: "FastAPI service on an engine stub, with provenance, the error model and offline fixtures." }
  - { version: "v0.3.0", date: "2026-10", note: "Weather, ephemeris, citation and caching endpoints, plus the launchwin Python client." }
  - { version: "v0.4.0", date: "2026-10", note: "Frontend screens: countdown, trajectory map, weather panel, viewing map and an analysis view." }
  - { version: "v1.0.0", date: "2026-10", note: "Live engine wired in, and the 24-check integration gate passing on a clean clone." }
---

Pick a target orbit and the engine lists every launch window from the Canso pad in Nova Scotia. It solves for the moment the rocket reaches orbit rather than the moment it leaves the pad, then puts a weather probability on each window from two forecast ensembles.

I wrote the contract first: eight JSON Schemas, frozen and tagged before anyone wrote engine code, so the four parts could be built side by side and still fit. The engine reproduces four published SSO launch windows with an average miss of 1.3 minutes, and the weather forecast beats the seasonal average for five days, which is where the app switches over and says so.
