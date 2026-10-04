---
title: "Canon film scanners"
plateTitle: "Canon scanners"
version: "v1.0.0"
level: 2
order: 1
kind: "Systems"
summary: "Two desktop apps that turn a Canon EOS R7 into a film scanner, one over USB at 59.79 fps and one over Wi-Fi at 3.98."
role: "Built both transports, the film inversion and the packaged desktop app"
team: "Solo build"
duration: "Just under 4 weeks"
status: "Stable"
stack: ["Python", "NumPy", "Canon EDSDK", "Canon CCAPI", "LibRaw", "PyInstaller"]
links:
  repo: "https://github.com/RafatH0ssain/Canon-EDSDK-Film-Scanner"
figure:
  image: "../../src/assets/projects/canon-scanners.png"
  alt: "Film Scanner app showing a live negative preview with focus peaking highlighted in red and capture controls on the right."
  schematic: "chart"
  callouts:
    - { x: 0.45, y: 0.3, title: "59.79 fps over USB", note: "EDSDK live view at 960x640, against 3.98 fps on the Wi-Fi build." }
    - { x: 0.5, y: 0.55, title: "One inversion path", note: "Every step is a scalar of one input, so the preview and the saved file cannot drift." }
    - { x: 0.12, y: 0.8, title: "A bundled mock camera", note: "The build runs with no Python, no SDK and no hardware attached." }
    - { x: 0.9, y: 0.35, title: "Fine focus, 1x1", note: "The SDK minimum, chosen by hand at 8x magnification, not by the frame metric." }
added:
  - "Two apps for one job: EDSDK at 59.79 fps over USB, CCAPI at 3.98 fps over Wi-Fi, 15x the frame rate."
  - "A double-clickable build of 66 MB with a mock camera, and 250 tests that need neither a camera nor the SDK."
changed:
  - "Dropped OpenCV for Pillow, tifffile and numpy, taking the packaged app from 176 MB to 66 MB."
  - "Stopped reading Canon HEIF as sRGB and read the PQ transfer characteristic out of the file instead."
issues:
  - "Corner-by-corner alignment is not built; the per-region sharpness it needs is."
  - "The CCAPI build still previews colour negatives cyan, because its inversion is the first linear flip."
decisions:
  - title: "Change SDK, do not tune Wi-Fi"
    chose: "port the app to EDSDK, which does have a USB transport"
    instead: "optimising the CCAPI live view loop further"
    because: "CCAPI has no USB path and the R7 is Wi-Fi 4 on 2.4 GHz, so the link itself was the ceiling at 251 ms a frame."
  - title: "Read PQ from the file"
    chose: "read the NCLX transfer characteristic and convert through the same lookup table"
    instead: "decoding Canon HEIF as sRGB"
    because: "decoded as sRGB it was 3.1% mean error against 0.9% on a real negative's range, and 31x across a 30x range."
history:
  - { version: "v0.1.0", date: "2026-08", note: "CCAPI build: live view, remote capture, then focus drive, peaking and a sharpness readout." }
  - { version: "v0.2.0", date: "2026-08", note: "EDSDK measured at 59.79 fps against 3.98 on Wi-Fi, and the port followed." }
  - { version: "v0.3.0", date: "2026-08", note: "Film inversion, HEIF developed as PQ, capture settings, and rolls with a naming template." }
  - { version: "v0.4.0", date: "2026-08", note: "macOS support, the SDK moved onto the main thread, and a packaged double-clickable app." }
  - { version: "v1.0.0", date: "2026-08", note: "OpenCV dropped and notices shipped, then a 25-check walkthrough on the real R7 passed 25 of 25." }
---

Two apps do the same job: scan a film negative with a Canon EOS R7 on a copy stand. Both invert the negative live, so you work in positive, push focus from the keyboard, and fire the shutter without touching the rig.

I ported the app to EDSDK and got 59.79 fps on the same body at the same resolution, a 15x gain, with the camera's own output rate the remaining limit rather than the link. The inversion is one code path for the preview and the saved file, because every step is a scalar function of one input and collapses into a lookup table.