# Implementation Plan

> EDITING DIRECTIVE: USER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE USER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into ordered, updatable implementation and verification work.

## Instructions for the user

Preserve the approved requirements and verify the completed work. Direct priorities, scope, and meaningful checkpoints; judge technical choices, risks, and proposed changes; and approve results only after checking them against the specification rather than relying solely on the agent's report.

If the intended result changes, update the specification. If only the route changes, update this plan and record the revision.

## Instructions for the agent

Read AGENTS.md, brief.md, research.md, spec.md, and this file, then inspect the relevant project files. Begin with a concise orientation and one focused question.

Guide planning one stage at a time. Surface dependencies, risks, and verification needs without expanding scope or making decisions for the user. Draft concise, project-specific tasks and keep them current. Never mark approval gates or user-verification items complete on the user's behalf.

## Approach

Describe the technical approach, important dependencies, and the order in which the features will be built. Explain any non-obvious choices and identify likely risks.

Draft for the user's review (planning stage, 2026-09-26).

**Structure.** The calculator stays plain HTML, CSS, and JavaScript with no build step. New code follows the existing pattern: figures in `assets/js/data.js` (or a new data file loaded before the features), shared maths in `assets/js/core.js`, and each feature in its own file that registers an `init*` function in `app.js` and re-renders through `AIPF.onUpdate`. New files are expected to be `digital.js` (feature 3), `devices.js` (feature 4), and possibly `sessions.js` (feature 2's project view and estimate); features 1 and 2's logging extends `tracker.js`.

**Metric display (decided by the user on 2026-09-26).** The page keeps its Carbon / Water switch. Energy is shown as a figure with its range inside the new panels (images, agent sessions, digital day, devices), not as a third switch option.

**The two totals.**

- *AI total.* Today it is built only from `state.rows` (model × output size × count, `aiDailyTriple` in `core.js`), and the tracker turns its log back into those rows. Images and sessions do not fit that shape, so a foundation step comes first: tracker entries gain a kind (prompt, image, session; old entries without a kind are read as prompts), and one shared function returns the AI total's central, low, and high values as rows plus today's logged images and sessions. The calculator, the tracker's running total, `trackerDayTotal` (read by the budget), and the report all switch to that function, so the AI total is computed in one place. Images and sessions are counted only when "Use my log to drive this page" is on (spec, features 1 and 2).
- *Digital-day total.* A separate function in the feature 3 module, extended by feature 4's manufacturing component. It is never read by the tracker, budget, or team view.

**Build order and dependencies.**

1. Foundation: entry kinds in the tracker log and the shared AI-total function, with no change to results (checked by confirming today's figures are identical before and after).
2. Feature 1, image logging (depends on 1).
3. Feature 2, agent sessions, project view, and project estimate (depends on 1); removes the output-only "coding / agent session" size.
4. Feature 3, digital day builder: typical-day panel, tracker logging of activities, router overlap, and the digital-day total beside the AI total.
5. Feature 4, "My devices" and the manufacturing component (depends on 4).
6. Feature 5, comparison items, both totals as bars, driving setting, and the methodology rewrite (depends on 4 and 5 for the digital-day bar and the device items).

Each step ends with that feature's acceptance checks from `spec.md`, run in the `footprint` preview, before the next begins. The methodology section of `index.html` is updated feature by feature rather than all at the end.

**Likely risks.**

- *Removing the "agent" output size.* It is also used by the fictional team profiles in `team-data.js`, by existing tracker history, and by saved share links. Decided by the user on 2026-09-26: remove it completely. Old "agent" log entries are ignored in every total, and the team profiles' "agent" rows are deleted with nothing in their place (decided by the user on 2026-09-26; recorded in `spec.md`, feature 2). Share links encode each output size by its position in the `SIZES` list, so removing "agent" would shift "Re-write the Lord of the Rings trilogy" into its slot; old links must be read with the old positions, and an old "agent" row is skipped.
- *Router overlap from log times* (feature 3) is the most intricate calculation: overlapping logged activities on home Wi-Fi must not count the router for more than 10 Wh per clock hour.
- *Mixing log and typical day* (feature 3): the per-activity replacement rule must be clear in the interface, or the total will look inconsistent.
- *Rounding.* The spec's acceptance values are "about"; checks should compare against the unrounded arithmetic, so display rounding is not mistaken for a calculation error.
- *Methodology rewrite* (feature 5) touches many citations in `index.html`; removed items must disappear from both the data and the text.
- *Sources S59–S80* are used by the build but are still marked "not yet assessed by the user" in `research.md`.

## Checklist

Replace or expand the implementation placeholders below with tasks specific to the approved specification.

### Approval gates

Ticked at the user's direction on 2026-09-26 ("I approve the plan, tick all three gates"). The research features were approved on 2026-09-26 (`research.md`), the specification on 2026-09-26 with its planning-stage revisions (`spec.md`), and this plan on 2026-09-26.

- [x] User has reviewed, verified, and approved the research claims and selected features
- [x] User has reviewed and approved the specification
- [x] User has reviewed and approved the implementation approach and task sequence

### Implementation

Draft for the user's review. One checkpoint per build step (decided by the user on 2026-09-26): the agent completes the step's tasks and runs its acceptance checks in the `footprint` preview, the user verifies them, and the step is committed when the user asks. Keep this plan and `spec.md` aligned with any approved change.

**Checkpoint 1. Foundation for the AI total**

- [x] Give tracker log entries a kind (prompt, image, session, digital activity); read entries without a kind as prompts
- [x] Add one shared function for the AI total (central, low, high) covering rows plus today's logged images and sessions, and an energy counterpart
- [x] Switch the calculator headline, running line, charts, tracker total, `trackerDayTotal` (budget), nav total, and report to that function
- [x] Agent confirms every figure on the page is unchanged before and after (default day and a sample log). Done 2026-09-26: the page text, tooltips, AI totals, 40 days of tracker totals, energy, and the generated report were identical in all three cases (example day; a seeded log driving the page; the same log with "Use my log" off)
- [x] User verifies checkpoint 1; commit when asked. Ticked at the user's direction on 2026-09-26 ("tick the six user verification items"); committed as `6b57f78`

**Checkpoint 2. Feature 1, image logging**

- [x] Add the image figures (0.086, 1.35, 11.49 Wh per image), the 4.88 L/kWh water factor, and source links to the data
- [x] Add an "Image" logging action to the tracker with a count, feeding the running total, recent list, history, and "Undo last"
- [x] Show image results as central value with low–high range in energy, carbon, and water
- [x] Add the plain-language limitations note (S1, S2, S3, S46) and the methodology text in `index.html`
- [x] Agent runs feature 1 acceptance checks 1–6. Done 2026-09-26: all six passed in the preview (one image adds 1.35 Wh, 0.086–11.49; 0.513 g, 0.033–4.37; 6.59 mL, 0.42–56.1); checked at phone width and in dark mode
- [x] Make logged prompts follow "Use my log" in the tracker total, history, and budget, as images do (decided by the user on 2026-09-26; see Revisions)
- [x] User verifies checkpoint 2; commit when asked. Ticked at the user's direction on 2026-09-26 ("tick the six user verification items"); committed as `397e7eb`

**Checkpoint 3. Feature 2, agent sessions and projects**

- [x] Add the input rates (fresh input and cache writes 2.1, 1–4 Wh; cache reads 0.39, 0–4 Wh per 10,000 tokens) and per-model output energy from EcoLogits' agent figures ÷ 100,000
- [x] Replace the tracker's "Agent session" quick button with a form: model, four token fields, optional project name, and the S8 reference note
- [x] Show each session's energy, carbon, and water with range and the output / input / cache-read breakdown; carbon adds EcoLogits embodied carbon for output only; water as specified
- [x] Add the project view (tagged sessions summed across days) and the project estimate form pre-filled with S59, shown beside the AI total and never added to it
- [x] Remove the "agent" size from `SIZES`, the calculator menus, the tracker, and `team-data.js`; ignore old "agent" log entries; keep old share links reading the old size positions. The "lines of code" estimate, which applied only to "agent" rows, went with it
- [x] Add the limitations notes (S7, S8, S9, S10, S11, S46, S59) and the methodology text
- [x] Agent runs feature 2 acceptance checks 1–7. Done 2026-09-26: all seven passed in the preview (session 46.65 Wh, 17.69–238.2; 18.18 g, 7.17–90.97; 201.7 mL, 60.8–1,136; breakdown 22.95 / 4.2 / 19.5 Wh; S59 estimate 708 kWh, 271 kg, 3,352 L with matching ranges); feature 1 checks re-run; checked at phone width and in dark mode
- [x] User verifies checkpoint 3; commit when asked. Ticked at the user's direction on 2026-09-26 ("tick the six user verification items"); committed as `3210da9`

**Checkpoint 4. Feature 3, digital day builder**

- [x] Add device powers, data use per hour, network intensities, data-centre figures, router draw, and water factors (4.35 and 4.88 L/kWh) with sources
- [x] Build the typical-day panel: activity, device, connection, hours, quality where relevant, with only the allowed combinations, plus the home-Wi-Fi hours field (defaulting to the capped sum, never above it)
- [x] Add tracker logging of digital activities with duration; logged activities replace that activity's typical-day entry for today; calculate router overlap from log times
- [x] Compute the digital-day total (central, low, high; energy, carbon, water) and its breakdown by activity and component; show it beside the AI total, never as a share, with each activity's origin (log or typical day)
- [x] Add the limitations notes, "single estimate, no range available" labels, and the methodology text
- [x] Agent runs feature 3 acceptance checks 1–8. Done 2026-09-26: all eight passed in the preview (366.4 Wh, 347.6–385.3; 139.2 g, 132.1–146.4; 1.60 L, 1.52–1.69; breakdown as specified). Check 7 first failed, because a logged digital activity alone switched the page into log-driven mode and zeroed the AI total; fixed so that only AI entries do that. Features 1 and 2 re-checked; checked at phone width and in dark mode
- [x] User verifies checkpoint 4; commit when asked. Ticked at the user's direction on 2026-09-26 ("tick the six user verification items"); committed as `c6624c1`

**Checkpoint 5. Feature 4, device manufacturing**

- [x] Add the eight device manufacturing figures, default years kept, labels, and the smartphone production water (about 12,075 L) with sources
- [x] Build the "My devices" list: device type, number owned, years kept, shared with how many people
- [x] Add the manufacturing component to the digital-day total in carbon, and phone-only water, with a per-device breakdown; note beside the energy figure that manufacturing energy is not counted
- [x] Replace the yearly comparison figures for a new smartphone, laptop, and TV with about 42, 110, and 370 kg and their sources
- [x] Add the limitations notes and the methodology text
- [x] Agent runs feature 4 acceptance checks 1–7. Done 2026-09-26: all seven passed in the preview (162.0 g a day: phone 38.4, laptop 75.3, TV 48.3; TV unshared 144.8 g; phone kept 6 years 19.2 g; phone water 11.03 L; digital-day energy unchanged at 366.4 Wh with feature 3's typical day). Features 1–3 re-checked; checked at phone width and in dark mode
- [x] User verifies checkpoint 5; commit when asked. Ticked at the user's direction on 2026-09-26 ("tick the six user verification items"); committed as `e793423`

**Checkpoint 6. Feature 5, like-for-like comparisons**

- [x] Replace `DAILY_ITEMS`, `ANNUAL_ITEMS`, `DAILY_WATER_ITEMS`, and `ANNUAL_WATER_ITEMS` with exactly the items and values in the specification's tables; electricity-based items computed from kWh (PS5 carbon by the selected grid; home electricity water × 4.35 L/kWh)
- [x] Give every item its unit, assumption, boundary, source link, and range where reported (burger, Ivanova cuts)
- [x] Show the AI total and the digital-day total as two separate highlighted bars in the daily and yearly charts
- [x] Change the driving setting to about 1,150, 4,600, and 9,580 kg with its label, and 11,500 miles in the methodology
- [x] Rewrite the comparison methodology in `index.html`: remove deleted items and their citations, match every quoted figure, explain blue against total water; update `REPORT_REFS`
- [x] Agent runs feature 5 acceptance checks 1–6. Done 2026-09-26: all six passed in the preview (coffee 0.97 L, burger 62 L with 7.6–226 L, home electricity 129 L; PS5 82 g in the US and 27 g in the UK; both totals as separate highlighted bars in all three charts and the report). Also corrected two pre-Project-2 notes that said image generation was excluded. Features 1–4 re-checked; checked at phone width and in dark mode
- [x] Remove the team view's "ten-minute showers" water anchor (decided by the user on 2026-09-26; see Revisions)
- [x] User verifies checkpoint 6; commit when asked. Ticked at the user's direction on 2026-09-26 ("tick the six user verification items"); committed as `87fdd88`

**Across all checkpoints**

- [x] Agent re-runs every earlier acceptance check after each checkpoint to catch regressions
- [x] Agent checks the page at phone width and in both light and dark themes after checkpoints 2–6

### Verification

Ticked at the user's direction on 2026-09-26 ("tick the four verification items").

- [x] User has checked feature behavior and calculations against the specification and sources independently of the agent
- [x] User has assessed sources S59–S80 in `research.md`, which the build uses but which were added during the specification stage and are still marked "not yet assessed by the user"
- [x] User has confirmed factual and numerical claims have working citations and communicate important limitations or uncertainty
- [x] User has confirmed the project runs locally, serves all three reference profiles, and matches the specification

### Delivery

- [x] Commit meaningful checkpoints and export the working chat transcripts. Ticked at the user's direction on 2026-09-26 ("tick the delivery items"): six checkpoint commits, and the research, specification, planning, and implementation transcripts with PDFs in `transcripts/`
- [ ] Add the provided Project 2 debrief, complete it after verification, and export its transcript

## Revisions

Record material changes to the approach, sequence, or checklist and explain why they were made.

- 2026-09-26 (checkpoint 6): Added a task. The team view's company anchor compared AI water with showers, a withdrawal figure outside feature 5's tables; the user decided to remove it under feature 5's rule. Recorded in `spec.md` under Revisions.
- 2026-09-26 (checkpoint 5): S51 gives two mismatched values for a phone's production water (3,190 gallons, and 12,760 L). The user decided to keep the specification's 12,075 L from the gallons figure and disclose the mismatch; recorded in `spec.md` under Revisions.
- 2026-09-26 (checkpoint 4): Three feature 3 details were open in the specification (the console's central streaming draw, router hours when log and typical day mix, and the time window of a logged activity). The user decided them before the build; recorded in `spec.md` under Revisions.
- 2026-09-26 (checkpoint 2): Added a task to checkpoint 2. Building feature 1 showed that the budget counted logged prompts even with "Use my log" off, while the spec excludes images then. The user chose to make logged prompts follow the setting as well, so every logged kind is treated alike; recorded in `spec.md` under Revisions.

## Commands

### Start planning

User: Open the project repository as your workspace, start a fresh chat, and type `start planning`.

### Start implementation

User: After approving the plan, open the project repository in a fresh chat and type `start implementation`.

Agent: Read AGENTS.md, brief.md, spec.md, and this file, then inspect only the project files relevant to the approved work. Follow AGENTS.md and the approved plan. Do not begin implementation if the plan has not been approved. Keep the plan current, but never mark approval gates or user-verification items complete on the user's behalf.

### Save transcript

Agent: At the end of planning, remind the user that the transcript is a deliverable and ask them to say `save transcript`. Wait for that direction. When directed, save the entire conversation in the `transcripts/` directory as `plan-YYYY-MM-DD_HHMMSS.md`, mark user and agent responses clearly, and confirm the saved relative path.

Agent: At the end of every implementation chat, remind the user to say `save transcript`. When directed, save the entire conversation as `build-YYYY-MM-DD_HHMMSS.md` using the same location and formatting.
