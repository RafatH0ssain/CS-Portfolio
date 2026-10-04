---
title: "WorkSync"
version: "v0.5.0"
level: 1
order: 8
kind: "Product"
summary: "Employee management and payroll app I built on my own: employees log hours on a worksheet, HR forwards the request, admin pays it."
role: "The Express API, the MongoDB collections and the React client"
team: "Solo build"
duration: "Six weeks, Jan to Feb 2025"
status: "Archived"
stack: ["React", "Express", "MongoDB", "Firebase Auth", "TanStack Table", "Vite"]
links:
  live: "https://worksync-2ca3b.web.app"
  repo: "https://github.com/RafatH0ssain/WorkSync-Client"
figure:
  image: "../../src/assets/projects/worksync.png"
  alt: "WorkSync architecture: React client views for employee, HR and admin, an Express API grouped by resource, and MongoDB collections plus Firebase auth."
  schematic: "pipeline"
  callouts:
    - { x: 0.9, y: 0.8, title: "Firebase sign-in", note: "AuthProvider.jsx takes an email, a password or Google, then reads the UID from the Users collection." }
    - { x: 0.1, y: 0.78, title: "EmployeeWorksheets", note: "One row per logged day: hoursWorked and a date, read back per employee by the HR screen." }
    - { x: 0.37, y: 0.78, title: "PaymentRequests", note: "One transaction writes the payment record and deletes the worksheet rows it paid." }
    - { x: 0.17, y: 0.93, title: "Twenty per hour", note: "Amount owed is hoursWorked times a literal 20; the employee record holds no rate." }
added:
  - "The payroll path: employees log hours, HR forwards the request, admin marks it paid and the paid rows leave the worksheet."
  - "Sign-in by email, password or Google, plus a server check that signs out anyone whose record says status fired."
changed:
  - "Fixed the payment pipeline after a 2025-01-26 commit recorded the database updating while the worksheet entries stayed behind."
  - "Added the fired-user check at login, one day after the firing system itself landed on 2025-01-19."
issues:
  - "The hourly rate is a literal 20 inside the amount-owed query, and the employee record has no rate field, so a pay change means a redeploy."
  - "The README claims JWT authentication for role-based access, but the server has no jsonwebtoken dependency and no auth middleware on any route."
decisions:
  - title: "Firebase for sign-in, MongoDB for roles"
    chose: "Firebase Authentication for the password and Google sign-in, MongoDB for userType and status"
    instead: "issuing sessions and hashing passwords inside the Express server"
    because: "the server already initialises firebase-admin, and /check-user-status reads the user's own record on every login, so a fired account can be turned away without the server holding a credential."
  - title: "Two repositories, two hosts"
    chose: "the client on Firebase Hosting and the server on Vercel, each in its own repository"
    instead: "one repository holding both halves"
    because: "each README links the other repository, and each side has its own deploy commit on 2025-01-29."
history:
  - { version: "v0.1.0", date: "2025-01", note: "First commits in both repositories: React, Tailwind and daisyUI, plus the Express server and its Mongo connection." }
  - { version: "v0.2.0", date: "2025-01", note: "Firebase email and Google sign-in, user records in Mongo, and the pages split by user type." }
  - { version: "v0.3.0", date: "2025-01", note: "HR and admin routes, the worksheet entries, and the HR to admin payment handoff." }
  - { version: "v0.4.0", date: "2025-01", note: "The firing system, the fired check at login, and the contact form handled by the server." }
  - { version: "v0.5.0", date: "2025-02", note: "Client on Firebase Hosting and server on Vercel; READMEs written up, with the API documented." }
---

WorkSync is an employee management and payroll application I built on my own: an Express API over MongoDB, and a React client in front of it. An employee logs hours on a worksheet, HR reviews the request and forwards it, admin marks it paid.

Paying writes a payment record and deletes the worksheet rows it paid; promoting someone to HR deletes the employee row, inserts the HR row and updates the shared user record. Both run inside a MongoDB transaction, because a write that stops halfway leaves the collections disagreeing about what an employee is owed, and that is the number payroll is built on.
