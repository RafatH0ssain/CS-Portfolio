---
title: "DEEBug"
version: "v0.6.0"
level: 1
order: 9
kind: "ML"
summary: "A Python debugging platform built with a course team: five locked sections of Keras code, run on a server, scored against a known-good file."
role: "The five-section Monaco editor: templates, locked ranges and per-section saving"
team: "Team of 5"
duration: "Sep 2024 to Apr 2025"
status: "Archived"
stack: ["React", "Flask", "TensorFlow", "Gemini API", "Pyodide", "MySQL"]
figure:
  schematic: "grid"
  callouts:
    - { x: 0.26, y: 0.22, title: "Five sections", note: "CodeEditorPage.js: data-preparation, model-definition, training-configuration, evaluation, visualization." }
    - { x: 0.58, y: 0.46, title: "Locked ranges", note: "CodeTemplates.jsx finds each marker line and hands Monaco a read-only range below it." }
    - { x: 0.82, y: 0.68, title: "run_code", note: "app.py appends a fixed harness to the student's script, then runs it with subprocess." }
    - { x: 0.22, y: 0.86, title: "Diff accuracy", note: "calculate_accuracy counts unified_diff lines against the matching file named _correct.py." }
added:
  - "The five-section editor, with next and previous navigation between sections and a sticky header over them."
  - "Templates for both supervised and unsupervised mode, each section opening on the same starter Keras code."
  - "Template locking: a marker line per section, and Monaco read-only ranges below it, so the harness cannot be edited away."
  - "Per-section saving with a validity check, so an edit that drops a required call is refused instead of overwriting the section."
changed:
  - "Fixed the supervised data preparation step on 2025-03-27, after templating it stopped running."
  - "Fixed the model definition step in unsupervised mode on 2025-03-27, where the required Dense layers did not match the harness."
  - "Kept the last valid text per section rather than resetting the whole section, added 2025-03-04 when an invalid edit wiped a stage."
  - "Rebuilt the editor page around the desktop wireframe, with a sticky header, on 2025-01-30."
issues:
  - "The editable ranges are anchored to fixed line numbers, and a comment in CodeTemplates.jsx says so: add an import line and every boundary shifts."
  - "app.py unpacks model, X, Y from generateModel(), which returns a single log filename, so /train_with_logging cannot run as written."
  - "The only test in the repository is the Create React App placeholder in src/App.test.js; none of the Flask routes have one."
decisions:
  - title: "Lock the harness, not the student"
    chose: "marker lines in each template, and Monaco read-only ranges below them"
    instead: "a free editor the student can rename anything in"
    because: "/api/run_code appends a fixed harness that calls load_data, build_model, train_model and evaluate_model, so renaming one breaks the run for reasons that have nothing to do with the bug under study."
  - title: "Run the Python on the server"
    chose: "writing the student's script to disk and running it with subprocess from Flask"
    instead: "running the student's Python in the browser"
    because: "the script imports TensorFlow, pandas and scikit-learn, trains for a few epochs and writes training_plot.png, and the frontend fetches that image back from /api/get_plot."
history:
  - { version: "v0.1.0", date: "2024-09", note: "Course repository opens: the Flask API and the Create React App shell, September 2024." }
  - { version: "v0.2.0", date: "2024-10", note: "Accuracy against the matching correct file reaches the frontend, and the Docker dev and production setups arrive." }
  - { version: "v0.3.0", date: "2024-11", note: "The feedback box: the student sends the current code plus a note, and Gemini returns a second pass." }
  - { version: "v0.4.0", date: "2025-02", note: "Monaco landed on all five stage pages, with one layout across them and next and previous buttons." }
  - { version: "v0.5.0", date: "2025-03", note: "Templates for both modes, the locked ranges, and per-section saving that survives an invalid edit." }
  - { version: "v0.6.0", date: "2025-04", note: "Last editor pass on 2025-04-03, fixing supervised data preparation and unsupervised model definition." }
---

DEEBug is a Python debugging platform built with a course team, and my share was the editor the student works in. You bring a Keras script, it is split into five sections, and you fix it one section at a time. The backend runs the script for you, diffs the output against a known-good copy of the same file, and hands back a number.

My part was that editor: data preparation, model definition, training configuration, evaluation and visualization, in a Monaco editor with next and previous navigation and a sticky header above them. Each section opens from a template, and each template carries a marker line; everything below that marker becomes a read-only range. That is the piece I am happiest with, because the harness the server appends to the script calls load_data, build_model, train_model and evaluate_model by name. A student who renames one of them breaks the run for reasons that have nothing to do with the bug being chased, and the read-only ranges are what stop that.

The repository holds 340 commits; 26 of those are mine, between 2025-01-27 and 2025-04-03. The locking is also the weakest thing about it: the editable ranges are anchored to fixed line numbers, and the code admits that in a comment. Pyodide sits in package.json with nothing importing it, the only test is the Create React App placeholder, and /train_with_logging unpacks three values from a function that returns one.
