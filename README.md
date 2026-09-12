# AI Footprint Calculator — Company Edition

An adaptation of [Andy Masley's AI prompt footprint calculator](https://andymasley.com/visuals/ai-prompt-footprint)
for employees at a company that uses AI heavily, so they can see their own
footprint build up in real time rather than estimating an "average day."

The original is dedicated to the public domain under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), and its author
gives explicit permission to copy the numbers and design without credit. Credit
is given here anyway, because it is his work the estimates rest on.

## Running it

No build step and no dependencies — it is plain HTML, CSS, and JavaScript.
Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

## Where the numbers come from

Per-model energy, carbon, and water estimates (with uncertainty ranges) come
from the [EcoLogits](https://ecologits.ai/) library v0.10. Every other figure is
cited in the methodology section at the bottom of the page.

## Layout

```
index.html              the page
assets/css/base.css     design tokens + the original calculator's styles
assets/js/data.js       EcoLogits model figures and comparison baselines
assets/js/core.js       shared state, formatting, carbon/water math
assets/js/calculator.js the original calculator UI
assets/js/app.js        bootstrap
```
