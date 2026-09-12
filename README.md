# AI Footprint Calculator — Company Edition

An adaptation of [Andy Masley's AI prompt footprint calculator](https://andymasley.com/visuals/ai-prompt-footprint)
for employees at a company that uses AI heavily, so they can watch their own
footprint build up in real time instead of estimating an "average day."

The original asks you to describe a typical day and shows you what it costs.
That is the right question for a curious reader and the wrong one for someone
who uses AI all day at work: nobody knows their own average, the estimate never
moves, and an individual number gives no sense of what it means at the scale of
an organisation. The three features below are aimed at those gaps.

## The three features

### 1. Live session tracker

Logs prompts as they actually happen rather than asking you to recall them.

- Log by model and output length, `+5` for bursts, and three quick buttons for
  the shapes of work whose costs genuinely differ. Pressing <kbd>L</kbd>
  anywhere logs one prompt, so tracking does not mean leaving what you were doing.
- A running total for today that updates live, with time since the last prompt
  and a straight-line pace projection to 6pm, both refreshed on a timer.
- An hour-by-hour chart of the day and a seven-day history strip.
- **Use my log to drive this page** feeds the log into the calculator, so the
  verdict and every comparison chart below reflect real usage instead of a guess.

Entries are kept per local day in `localStorage`, so they survive a refresh and
build the history the other two features read back. Prompts logged in another
tab appear here too.

### 2. Team & company dashboard

Puts one person's number in the context that makes it actionable.

- You today, your team's average, and the company average side by side, with
  the company figure spread over full headcount so colleagues who never touch
  AI are counted.
- A ratio verdict against your team, and a per-person bar for every team.
- Company-wide daily and annual totals, anchored to transatlantic flights
  (carbon) or showers (water).
- **If everyone worked like you** — your day scaled to full headcount, against
  where the company actually is. One person's habits are invisible at org
  scale until you multiply them.

Only ratios and team averages are shown, never a ranking of individuals. The
roster holds team-level data, so any per-person league table would be invented.

### 3. Monthly budget, alerts, and model swaps

Knowing a footprint does not change it. This gives it a target and a next step.

- A monthly allowance per metric, defaulting to the company average so the
  first number you see is a real reference point.
- Month-to-date summed from the tracker's logs, with the meter going amber at
  75% and red at 100%, plus a pace projection that warns *before* the cap.
- One dismissible alert per threshold per month — a warning, not a nag.
- **Ranked model swaps** computed from your own logged usage, showing what each
  would save over a full month, and flagging any single swap big enough to
  close the projected overshoot.

Swaps only ever suggest the next model down within the same provider's family.
Opus straight to Haiku would show a far bigger saving, but it is not a
substitution most teams can make, and advice nobody can follow is not advice.

## Running it

No build step and no dependencies — plain HTML, CSS, and JavaScript. Open
`index.html` directly, or serve the folder:

```bash
npx serve .
```

Pushing to `main` publishes the site to GitHub Pages via
`.github/workflows/deploy-pages.yml`.

## Connecting real company data

`assets/js/team-data.js` ships with **illustrative sample data for a fictional
company**, and the dashboard shows a warning banner while that sample flag is
set. Nothing in it is measured usage. Replace it by calling `setTeamData` with
your own figures:

```js
fetch('/api/ai-usage/teams')
  .then((r) => r.json())
  .then((d) => AIPF.setTeamData(d));
```

A company would normally generate the `profile` arrays by aggregating the
API-gateway or SSO-proxy logs already sitting in front of its model providers:
group a month of requests by team, map each request to the nearest
output-length bucket, then divide by headcount and working days. The team panel
hides itself entirely when no roster is present.

## Where the numbers come from

Per-model energy, carbon, and water estimates, including the uncertainty
ranges, come from the [EcoLogits](https://ecologits.ai/) library v0.10 — the
engine behind the [EcoLogits calculator](https://huggingface.co/spaces/genai-impact/ecologits-calculator).
Electricity is costed on the grid of the region you select and EcoLogits'
embodied hardware emissions are kept as-is. Training, image and video
generation, and retries are excluded. Every other figure is cited in the
methodology section at the bottom of the page.

The Claude estimates carry the most uncertainty: Anthropic has not published
Claude's architecture, so EcoLogits assumes a mixture-of-experts design. If
that assumption is wrong, the Claude figures here run low.

## Layout

```
index.html                 the page
assets/css/base.css        design tokens + the original calculator's styles
assets/css/features.css    styles for the three added features
assets/js/data.js          EcoLogits model figures and comparison baselines
assets/js/store.js         namespaced localStorage with safe fallbacks
assets/js/core.js          shared state, formatting, carbon/water math
assets/js/calculator.js    the original calculator UI
assets/js/tracker.js       FEATURE 1 — live session tracker
assets/js/team-data.js     sample company roster (replace with real data)
assets/js/team.js          FEATURE 2 — team & company dashboard
assets/js/budget.js        FEATURE 3 — budget, alerts, model swaps
assets/js/app.js           bootstrap
```

Features are independent: each registers a renderer through `AIPF.onUpdate` and
exposes an `init` function that `app.js` calls if present. Deleting any one
feature file leaves the rest working.

## Privacy

Everything stays in the browser. Logs, budgets, and team selection live in
`localStorage` on the employee's own device; nothing is sent anywhere, and there
is no backend. That is a deliberate choice for a tool whose whole subject is
individual usage — but it also means the figures are self-reported and local,
not an audit trail.

## Credit and licence

Built on Andy Masley's calculator, dedicated to the public domain under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) with explicit
permission to copy without credit. Credit is given anyway, because the
estimates rest on his work. This adaptation is released on the same terms — see
[LICENSE](LICENSE).
