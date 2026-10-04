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
  schematic: "pipeline"
  callouts:
    - { x: 0.15, y: 0.4, title: "Frozen /v1 contract", note: "Eight JSON Schemas and 63 good and bad examples, tagged before anyone wrote engine code." }
    - { x: 0.4, y: 0.6, title: "Physics answers are 200s", note: "An unreachable orbit returns HTTP 200 with its 26.8 m/s plane change, never an error." }
    - { x: 0.65, y: 0.35, title: "Same request, same answer", note: "Every run gets a citation id hashed from the request and constants, stored for replay." }
    - { x: 0.88, y: 0.6, title: "24-check integration gate", note: "One script boots the app and checks every endpoint end to end on a clean clone." }
added:
  - "Every launch window from Canso for LEO, polar, SSO or custom orbits, timed to injection rather than liftoff."
  - "A FastAPI service with a frozen /v1 contract, provenance on every response and a pip-installable Python client."
  - "A web app with a live countdown, ground-track map, weather panel and viewing map that still runs offline."
  - "Checked against published SSO launches: four reproduce with an average miss of 1.3 minutes."
changed:
  - "Restricted the viewing map to the ascent of the selected window, after two full orbits marked every city visible."
  - "Moved the API's recorded ground tracks out of the shared fixtures, which the frontend owns, after the two collided."
  - "Made jsonschema a runtime dependency after a clean install crashed on its first request."
issues:
  - "Sentinel-3A and 3B only reproduce after a 10 minute vehicle-profile correction fitted to those same launches."
  - "The weather forecast beats climatology out to day 5 only; days 6 to 10 fall back to the seasonal average."
  - "The free API host sleeps when idle, so the first request after a pause takes about 30 seconds."
decisions:
  - title: "Freeze the contract first"
    chose: "eight JSON Schemas, tagged before any engine, weather or frontend code existed"
    instead: "letting the API shape follow whatever the engine happened to return"
    because: "four people built in parallel against one interface, so an unannounced schema change would have broken three of them at once."
  - title: "Unreachable is an answer"
    chose: "HTTP 200 with reachable false and the plane-change penalty in the body"
    instead: "a 4xx status for an orbit the pad cannot reach"
    because: "the physics result is the useful part of the response, and 4xx stays reserved for input that is actually malformed."
  - title: "Deterministic citation ids"
    chose: "an id hashed from the request, the constants and the config"
    instead: "a random id per run"
    because: "the same request has to come back with the same id, or a stored run cannot be replayed and checked against its source."
history:
  - { version: "v0.1.0", date: "2026-10", note: "API contract frozen: eight schemas, their examples and tests, tagged before other work began." }
  - { version: "v0.2.0", date: "2026-10", note: "FastAPI service on an engine stub, with provenance, the error model and offline fixtures." }
  - { version: "v0.3.0", date: "2026-10", note: "Weather, ephemeris, citation and caching endpoints, plus the launchwin Python client." }
  - { version: "v0.4.0", date: "2026-10", note: "Frontend screens: countdown, trajectory map, weather panel, viewing map and an analysis view." }
  - { version: "v1.0.0", date: "2026-10", note: "Live engine wired in, and the 24-check integration gate passing on a clean clone." }
---

Pick a target orbit and the engine lists every launch window from the Canso pad in Nova Scotia. It solves for the moment the rocket reaches orbit rather than the moment it leaves the pad, then puts a weather probability on each window from two forecast ensembles. Every response carries the constants, site data and sources it was computed from.

Five of us split it into an orbital engine, a weather layer, an API and a frontend. I wrote the contract first: eight JSON Schemas, frozen and tagged before anyone wrote engine code, so the four parts could be built side by side and still fit. I then built the FastAPI service around that contract, the Python client, the integration script that gates the whole build, and the first version of the frontend with its countdown, maps and weather panel.

The checks are what I would point to. The engine reproduces four published SSO launch windows with an average miss of 1.3 minutes, and the weather forecast beats the seasonal average for five days, which is where the app switches over and says so. What is not right yet is in the issues: two launches only pass after a correction fitted to themselves, and the free host is slow to wake.
