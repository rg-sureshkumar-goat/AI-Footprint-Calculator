# Agent Instructions

Read this file first in every session. `brief.md` is the authoritative project
frame; this file only explains how to work in this repository.

## Project

A static AI footprint calculator (plain HTML, CSS, and JavaScript; no build
step, no dependencies), adapted from Andy Masley's calculator for a
creative-media company's employees. Project 1 added a live session tracker, a
team dashboard, and a monthly budget. Project 2, on the `project-2` branch,
expands it with five research-backed features as described in `brief.md`.

## Roles

The user directs the work and makes every consequential decision. The agent
supports that work: it proposes, drafts, checks, and flags, but never makes or
approves decisions on the user's behalf. Employees are the calculator's
audience; Alex, Jordan, and Robin in `research.md` are fictional reference
profiles, not evidence about real groups.

## Stage workflow

Project 2 runs in stages, each in its own fresh chat. The user starts a stage
by typing a command; the full instructions for each command are in the
**Commands** section of the named file. Follow them exactly.

| Command | Instructions in | Transcript saved as |
| --- | --- | --- |
| `start research` | `research.md` | `transcripts/research-YYYY-MM-DD_HHMMSS.md` |
| `start specification` | `spec.md` | `transcripts/spec-YYYY-MM-DD_HHMMSS.md` |
| `start planning` | `plan.md` | `transcripts/plan-YYYY-MM-DD_HHMMSS.md` |
| `start implementation` | `plan.md` | `transcripts/build-YYYY-MM-DD_HHMMSS.md` |
| `save transcript` | the current stage's file | as above |

Rules that apply to every stage:

- Work one step at a time and begin with a concise orientation and one focused
  question.
- Never mark research, feature choices, the specification, the plan, or any
  approval gate or user-verification item as approved or complete. Only the
  user can.
- Do not start a stage whose prerequisite has not been approved (for example,
  no implementation before the plan is approved).
- Stay on the current stage's goal. Do not expand scope or invent
  requirements.
- Do not edit `brief.md`. Edit `research.md`, `spec.md`, and `plan.md` only as
  drafts for the user to review.

## Evidence and claims

- Every factual or numerical claim needs a full citation and a working link
  that has been checked directly. Never present an unverified source or figure
  as fact; say when something could not be verified.
- Look for contrary evidence and state limitations and uncertainty. Present
  estimates as ranges where the evidence supports ranges.
- The calculator must neither argue that AI is harmless nor that it is harmful.

## Code

- Entry point is `index.html`; styles are in `assets/css/`, scripts in
  `assets/js/`, loaded in order as plain scripts sharing the `window.AIPF`
  namespace. Features register an `init*` function that `app.js` calls, so one
  failing feature does not stop the others.
- Existing per-model figures come from EcoLogits (see `README.md`). Keep new
  data sourced and cited in the same way.
- Run locally by opening `index.html` directly, with `npx serve .`, or in
  Claude Code with the `footprint` preview server (`.claude/launch.json`,
  port 4173).
- Match the surrounding code's style, naming, and comment density.

## Git

- Work on `project-2`. Do not commit to or push `main`: `main` holds the
  submitted Project 1 commit, and every push to it deploys the site to GitHub
  Pages.
- Commit and push only when the user asks.

## Transcripts

- Record the learner's name as **RG Sureshkumar**. Quoted command output (such
  as `git log`) stays verbatim.
- Mark user and agent turns clearly and save to `transcripts/` with the file
  name from the table above. Follow the sanitising conventions in
  `transcripts/README.md` and update that README when a new kind of transcript
  is added.
