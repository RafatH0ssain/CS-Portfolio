---
title: "LBook"
version: "v0.3.0"
level: 0
order: 10
kind: "Web"
summary: "Staff-facing library system built with a team of three: catalog books, track students and loans, and put every page behind a login."
role: "My part: books and employee pages, staff signup, and the January 2025 cleanup"
team: "Team of 3"
duration: "Build 3 days, cleanup Jan 2025"
status: "In progress"
stack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "Bootstrap"]
links:
  repo: "https://github.com/nafisahnubah/lbook"
figure:
  schematic: "grid"
  callouts:
    - { x: 0.24, y: 0.22, title: "Five tables, five files", note: "books, students, employees, borrowbooks and user, each created by a runnable file in db/." }
    - { x: 0.62, y: 0.28, title: "One gate on every page", note: "loggedin() in includes/functions.php redirects to login.php after 1800 idle seconds." }
    - { x: 0.80, y: 0.64, title: "The loan list is a join", note: "borrow_books_list.php joins students, borrowbooks and books in one query." }
    - { x: 0.30, y: 0.80, title: "md5 for passwords", note: "checking.php hashes the posted password with md5 and keeps the hash in the session." }
added:
  - "Eight add and list pages over five tables, every one of them behind a staff login."
  - "Adding a loan wrote the borrowbooks row and set books.status to 1 in the same request."
  - "A dashboard of eight stat tiles and four percentage dials, each tile one query."
  - "A loan list that joins students, borrowbooks and books, so one row shows the student and the book."
changed:
  - "Removed a debug print_r that was left in the tree."
  - "Replaced the seven per-day shift checkboxes on the employee form with one three-way shift field."
  - "Took the icons off the list pages."
  - "Stripped the starter template's redundant comments and reformatted the HTML, CSS and JS, in five commits in January 2025."
issues:
  - "Passwords are md5, and checking.php keeps the same hash in the session for the life of the login."
  - "No prepared statements anywhere: the id from ?eid= goes into four SELECTs unescaped, and the list pages delete on a posted id."
  - "The dashboard's Unavailable tile counts books.status = 2, but the book form only writes 0 or 1, so that tile reads zero."
decisions:
  - title: "One integer for state"
    chose: "carry a status column on books, students, employees and borrowbooks, and flip it from the borrow form"
    instead: "deriving the state in the query, or a lookup table of states"
    because: "each dashboard tile is a SELECT id FROM a table WHERE status = n and the list pages read the same integer, so one column is what every screen already expects"
  - title: "A gate in every file"
    chose: "call loggedin() from includes/functions.php at the top of all nine pages, with a 1800 second idle timeout"
    instead: "one front controller or a rewrite rule that checks the session once"
    because: "there is no front controller and no rewrite config, so each page is its own top-level script and the same guard is what sends an expired session back to login.php"
  - title: "Tables made by opening a page"
    chose: "five scripts under db/ that include config.php and run one CREATE TABLE each"
    instead: "a single .sql file to import in phpMyAdmin"
    because: "the mysqli connection already lives in config.php, so each script reuses it and echoes whether the table was created"
history:
  - { version: "v0.1.0", date: "2024-06", note: "Five tables and the eight add and list pages, built over three days of commits." }
  - { version: "v0.2.0", date: "2024-11", note: "README written up with the dashboard and page screenshots." }
  - { version: "v0.3.0", date: "2025-01", note: "Debug output removed, template comments stripped, HTML, CSS and JS reformatted." }
---

LBook is a staff-facing library system. You add books, students and employees, hand a book out against a borrow date and a due date, and read it all back off one dashboard. Staff sign up first: every page behind the menu calls loggedin() in includes/functions.php, which throws the session away after 1800 seconds of quiet. The storage is five MySQL tables, books, students, employees, borrowbooks and user, each defined by a small script in db/ that you open once to create the table.

I built the books pages and the employee pages, and I wrote the staff signup. Adding a loan wrote the borrowbooks row and set books.status to 1 in the same request, so the book list and the dashboard read one column instead of counting open loans. The loan list is a three-table join across students, borrowbooks and books. Three days of commits in June 2024 got the app to that state; the log holds 106 commits, 32 of them mine.

I came back in January 2025 and stripped the starter template's redundant comments and reformatted the HTML, CSS and JS, in five commits, then fixed the README. What is still wrong is in the issues: md5 passwords kept in the session, no prepared statements anywhere, and a dashboard tile counting a status the book form never writes.
