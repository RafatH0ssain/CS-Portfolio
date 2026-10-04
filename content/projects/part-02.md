---
title: "SPECTRA-ICA"
plateTitle: "SPECTRA-ICA"
version: "v1.0.0"
level: 2
order: 2
kind: "ML"
summary: "A team-built EEG artifact remover that strips only artifact-characteristic frequencies during detected events, and beat plain ICA on all 7 P300 metrics."
role: "My part of Team DMLS: the algorithm and the 10-subject LOPOCV benchmark"
team: "Team DMLS"
duration: "One day, March 2026"
status: "Archived"
stack: ["Python", "MNE", "scikit-learn", "NumPy", "ICLabel"]
links:
  repo: "https://github.com/RafatH0ssain/SPECTRAICA-Surge-NeuroHack-2026"
figure:
  image: "../../src/assets/projects/spectra-ica.png"
  alt: "Title slide from the SPECTRA-ICA talk: independent component analysis decomposes EEG into sources and removes artifact components."
  schematic: "pipeline"
  callouts:
    - { x: 0.2, y: 0.2, title: "Temporal gate", note: "Blink, muscle, cardiac and channel-noise events detected per component." }
    - { x: 0.3, y: 0.52, title: "Spectral profile", note: "Each component's own STFT decides which frequencies are artifact." }
    - { x: 0.72, y: 0.4, title: "Gated subtraction", note: "Removal scaled by the ICLabel probability instead of a binary cut." }
    - { x: 0.7, y: 0.75, title: "10-subject LOPOCV", note: "7,200 P300 epochs, Euclidean Alignment then logistic regression." }
added:
  - "Beat standard ICA on all 7 P300 BCI metrics across 10 subjects, Cohen's d = 0.703, a medium effect."
  - "Found 28 more P300 targets and produced 11 fewer false alarms than binary ICA exclusion."
changed:
  - "Dropped the spectral path for muscle components after it measurably degraded neural preservation."
issues:
  - "The spectral path needs at least 5 STFT frames of artifact; fewer than 5 blinks or heartbeats falls back to broadband."
  - "The Gini quality threshold of 0.05 was never tuned systematically against the full dataset."
decisions:
  - title: "Gate in time and frequency"
    chose: "remove only artifact-characteristic frequencies, only inside detected artifact windows"
    instead: "subtracting whole artifact components, as binary ICA does"
    because: "binary exclusion removes artifact energy in every sample and scored OCI 0.499, roughly half the neural power gone."
  - title: "Subtract the uniform gain first"
    chose: "subtract the mean per-frequency power ratio before normalising it into a weight"
    instead: "using the raw artifact-minus-clean power difference"
    because: "a blink lifts the whole component's amplitude, so the raw difference marks alpha and beta as artifact too."
history:
  - { version: "v0.1.0", date: "2026-03", note: "Implementation, proof script and the report with the full 10-subject LOPOCV results." }
  - { version: "v1.0.0", date: "2026-03", note: "Competition report dated 22 March, same day as every code commit." }
  - { version: "v1.0.0", date: "2026-05", note: "NeuroHack slides added to the repository, and the NeuroHack PDF deleted." }
---

Standard EEG cleaning throws away a whole independent component when it thinks that component carries a blink.

It gates in time, detecting blinks, muscle bursts, heartbeats and channel noise per component, and it gates in frequency, estimating a per-component weight from the STFT of that component's own artifact windows against its own clean windows.

Across 10 subjects on a P300 oddball BCI benchmark it beat standard ICA on all 7 metrics, with balanced accuracy 0.6270 to 0.6505 (+2.35 pp), AUC +1.89 pp, Cohen's d of 0.703, and 6 of 10 subjects improved.