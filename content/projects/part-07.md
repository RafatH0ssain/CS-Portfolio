---
title: "Greenland ice segmentation"
plateTitle: "Greenland ice"
version: "v0.2.0"
level: 2
order: 7
kind: "ML"
summary: "U-Net segmentation of snow and glacier ice in a Landsat-8 archive over West Greenland, scored against a published ice mask."
role: "U-Net models, GIMP mask validation and the patch datasets the team trains on"
team: "Research group under Zahra Sadeghi"
duration: "Summer 2025 to now"
status: "In progress"
stack: ["Python", "U-Net", "Google Earth Engine", "Landsat 8", "NSIDC GIMP"]
figure:
  image: "../../src/assets/projects/greenland-ice.png"
  alt: "Two Greenland scenes, ice sheet interior and ice margin, shown as an RGB composite, a spectral index, the glacier mask and the GIMP ice mask."
  schematic: "pipeline"
  callouts:
    - { x: 0.14, y: 0.28, title: "40,836 patches", note: "Four year-season sets over West Greenland, 132 GB, on one 30 m grid." }
    - { x: 0.88, y: 0.28, title: "NSIDC-0714", note: "An independently published ice mask already on the same EPSG:3413 grid." }
    - { x: 0.88, y: 0.78, title: "IoU 0.766", note: "The U-Net against that mask on 10,318 summer 2020 patches, centre crops only." }
    - { x: 0.4, y: 0.78, title: "Zero-shot transfer", note: "The validated model never saw a Greenland label; it was trained in the Alps." }
added:
  - "IoU 0.766 for the U-Net against an independent ice mask on 10,318 patches, 3.1x the spectral rule beside it."
  - "40,836 patches and 132 GB across four sets, after re-exporting a winter set that had lost two of its four tiles."
  - "A DL4GAM split script on the official folds, after finding 140 of 239 test glaciers inside the training fold."
  - "A season audit that found August imagery filed as winter across two export sets, and 4,009 duplicate patches."
changed:
  - "Rejected the R/B channel swap: it made the U-Net measurably worse, IoU 0.744 down to 0.619."
  - "Fixed the nodata rule to reject NaN as well as -9999, which 21.7% of a winter re-export had slipped past."
  - "Moved the 2015 re-exports into a new folder rather than over the live ones, so nobody read a half-written directory."
issues:
  - "About 16% of winter pixels carry reflectance above 1.0, so no winter number can be checked against the ice mask at all."
  - "The 0.520 precision from the refit is provisional: a reflectance filter removes the water half of the denominator."
  - "IoU 0.766 is about 89% of the 0.862 that two independent published ice products agree on between themselves."
decisions:
  - title: "Validate against the ice mask"
    chose: "score the U-Net against NSIDC-0714, an independently published ice mask"
    instead: "evaluating against the pseudo-labels the model learned from"
    because: "the easier evaluation was circular, and it would have overstated the result."
  - title: "Keep the channel order as it is"
    chose: "leave the bands as R, G, B, confirmed four independent ways"
    instead: "fixing the order to match the code comment, which says B, G, R"
    because: "the swap was measured, and it made the U-Net worse: IoU 0.744 down to 0.619."
  - title: "Score centre crops only"
    chose: "score the 64x64 centre crop of every 256x256 patch"
    instead: "scoring whole patches"
    because: "patches are laid on a 64 px stride and overlap fourfold, so whole patches are not independent samples."
history:
  - { version: "v0.1.0", date: "2025-07", note: "Started the research position: Greenland patch datasets and U-Net training." }
  - { version: "v0.2.0", date: "2026-09", note: "Archive rebuilt to 40,836 patches, and the U-Net scored at IoU 0.766 against the ice mask." }
---

An undergraduate research position at Dalhousie, supervised by Zahra Sadeghi. My part of the group's work is the patch datasets and the U-Net models. The archive is Landsat-8 Collection 2 surface reflectance over West Greenland, 30 m, median composites, cut into 256x256 patches on a 64 px stride. Four other researchers in the group train against those patch sets.

Most of my time on it went into auditing. An export named files without the season in them, so summer and winter 2020 wrote identical filenames and collided on Drive: the winter TIFFs were gone and two of four tiles had never arrived, which is why one season had 3,322 patches against summer's 10,827. Two 2015 sets turned out to be August imagery carrying winter weather, and 4,009 of 4,039 patches in the old winter folder were byte-identical to summer. Re-exporting both 2015 seasons and all four winter tiles left 40,836 patches and 132 GB.

The U-Nets are scored against NSIDC-0714, an independently published ice mask that already sits on the same grid, so validation is a lookup rather than a judgement call. That matters, because a model trained on the spectral labels reproduces them faithfully, errors and all: it scores IoU 0.2499 against the mask where the labels themselves score 0.2492, while the U-Net reaches 0.766, about 89% of what two expert products manage between themselves. Winter is the open problem: its surface reflectance saturates over bright snow, about 16% of winter pixels carry a value above 1.0, and the mask labels ice sheet where a snow index labels any snow at all, so no winter number can be checked against it. Summer is the row to read.