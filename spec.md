# Technical Specification

> EDITING DIRECTIVE: USER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE USER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Define what the completed project must do so it can be planned, built, and verified.

## Instructions for the user

Translate the approved research into a specification without distorting its evidence, limitations, or uncertainty. Direct the work toward the intended result, judge gaps and trade-offs rather than accepting invented requirements, and approve only a complete, testable specification grounded in the research.

## Instructions for the agent

Read AGENTS.md, brief.md, research.md, and this file. Begin with a concise orientation and one focused question.

Guide the specification one feature at a time. Help turn approved decisions into precise requirements and surface gaps or trade-offs without inventing requirements or making product decisions. Draft concise updates for review, focus on the intended result rather than implementation steps, and never approve the specification on the user's behalf.

## Goal

State what the completed project should accomplish for its intended audience.

The completed calculator helps employees of a creative-media company estimate the resource use of their professional AI use and see it alongside the rest of their digital lives, so they can reach their own informed conclusions. It presents its sources, methods, limitations, and uncertainty openly and argues neither that AI is harmless nor that it is harmful.

It must represent the professional AI use described in `research.md`, including image generation and long coding-agent sessions as well as text prompts, and the everyday digital activities and devices that employees such as Alex, Jordan, and Robin use.

### The final calculation

Decided by the user on 2026-09-26: the calculator reports **two totals side by side**.

- **AI total:** the existing daily AI total, extended to include generated images (feature 1) and agent sessions (feature 2). The session tracker, team dashboard, and monthly budget continue to use this AI total.
- **Digital-day total:** a separate total for non-AI digital activities and devices (features 3 and 4).
- The two totals are shown next to each other. AI is not presented as a share or percentage of the digital-day total.
- The user confirmed on 2026-09-26 that the tracker, dashboard, and budget stay AI-only and that AI is never shown as a percentage of the digital-day total.
- Feature 5 changes how both totals are compared with everyday items, so that the comparisons use definitions that match the figures being compared.

## Features

For each feature, define:

- the need it addresses and intended audience outcome
- its behavior, inputs, and outputs
- its calculations, supporting evidence, and uncertainty
- its interface expectations and acceptance checks

### Feature 1. Image generation logging

**Need and outcome.** Creative staff such as Alex generate images routinely, but the calculator counts text only (research §1). After this feature, an employee can include the images they generate in their AI total and see how uncertain the figure for an image is.

**Behavior, inputs, and outputs.**

- Input: the number of images generated, including discarded variations. Decided by the user on 2026-09-26: there is no model or tool choice and no settings input (resolution, steps, or quality); every image uses one general evidence range.
- Output: the images' energy, carbon, and water as a central value with a low–high range, added to the AI total described under Goal.
- Where the input appears: the session tracker only (decided by the user on 2026-09-26). Images are logged as they are made, like prompts, and are not part of the calculator's typed-in estimate. Consequence: when "Use my log to drive this page" is off, images are not counted in the page's totals.

**Calculation, evidence, and uncertainty.**

- Energy per image: low about 0.09 Wh (S3, lowest of 17 open models, 0.086 Wh) to high about 11.5 Wh (S1, least efficient model, 11.49 Wh). Central value 1.35 Wh, the median across S1's image models (decided by the user on 2026-09-26), disclosed as coming from 2022–23 open models on an A100 GPU.
- Carbon: energy × the selected region's grid carbon intensity, the same method the calculator uses for text electricity. No embodied hardware carbon is added, because no image source reports it; this is disclosed.
- Water: energy × 4.88 L/kWh, labelled as derived (decided by the user on 2026-09-26). The factor is S46's US data-centre average on-site water use (0.36 L/kWh) plus its indirect water through electricity (4.52 L/kWh), for 2023. This matches the scope of the EcoLogits text figures (on-site cooling plus power-plant water, per the EcoLogits methodology). Limitations to state: US-only, modelled, and ignores power-purchase agreements (stated by S46's authors); the location of the data centre serving a request is unknown.
- Limitations to state in the interface: all figures come from open models on research hardware (a consumer RTX 4090 in S3, an A100 in S1), not the commercial tools employees are likely to use; no commercial image provider publishes per-image figures; each model ran at its own default resolution and steps, so the range already includes differences in settings; the sources measured different system boundaries.
- Why there are no settings inputs: resolution and steps do change energy (1.3–4.7× from 512 to 1024 px, S3; roughly 2× for doubled steps, S2), but the general range already mixes these, commercial tools rarely expose steps, and no source measured above 1024 px.

**Interface expectations.**

- The session tracker offers a way to log generated images, separately from text prompts, including more than one at a time.
- Logged images appear in the tracker's running total, recent entries, and history, and can be undone like prompts.
- Image results show the central value with its low–high range.
- A plain-language note explains why the range is wide, that no commercial image tool publishes figures, that water is derived, and that no embodied carbon is included, with links to S1, S2, S3, and S46.
- The methodology section of `index.html` documents the image figures and sources.

**Acceptance checks (feature 1).** With the United States region selected (grid intensity 380 g CO₂e/kWh):

1. Logging one image adds 1.35 Wh (range 0.086–11.49 Wh), about 0.51 g CO₂e (0.033–4.37 g), and about 6.6 mL of water (0.42–56 mL) to today's AI total.
2. Logging N images adds N times those amounts.
3. Changing the region changes image carbon by the new grid intensity and leaves image energy and water unchanged.
4. Logged images persist after a page refresh, appear in the recent list and history, and are removed by "Undo last".
5. With "Use my log to drive this page" on, images are included wherever the AI total is used, including the monthly budget. With it off, images are not counted.
6. Every image figure shown has a working link to its source, and the image result is labelled with its range and the limitations above.

### Feature 2. Agent session and project estimator

**Need and outcome.** The calculator's "coding / agent session" counts 100,000 output tokens only, but real agent sessions are dominated by input tokens, mostly cached, and the same task can vary many times over in tokens (research §3; S7, S8, S9). Jordan finds "prompts per day" too simplistic and wants assumptions, ranges, and project-level totals. After this feature, an employee can estimate a session from its token composition and add sessions up into a project total.

**Behavior, inputs, and outputs.**

- Session input: token counts entered directly by type (decided by the user on 2026-09-26). The fields start empty. Beside them, a labelled reference note describes S8's median Claude Code session (about 592,000 tokens, mostly cache reads, 24 model calls, estimated by its author at about 41 Wh) as one developer's illustrative data, not a typical value. S8 does not publish that session's breakdown by token type, so it is not used to pre-fill the fields.
- Project total: sessions can be summed into a project total. The project fields can be pre-filled with the 28-day example from S59 (980,326 fresh input, 108,060,378 cache-write, 15,202,019,495 cache-read, and 20,156,852 output tokens), labelled as one developer's around-the-clock use on one repository (decided by the user on 2026-09-26). Employees can overwrite it.
- Token types: four input fields, matching what tools such as Claude Code log (S8, S59): fresh input, cache writes, cache reads, and output (decided by the user on 2026-09-26). Cache writes are costed at the fresh-input rate, and the interface explains that they are new context processed for the first time and then stored (S7 observes that fresh-input and cache-write tokens track each other closely).
- Cache-read energy (decided by the user on 2026-09-26): a range from 0 to 4 Wh per 10,000 tokens, with a central value of 0.39 Wh per 10,000 tokens from S8. The bounds are the project's own reasoning, not a sourced figure: a cache read avoids reprocessing, so it should cost no more than fresh input, and it is not free because the stored context is still used during generation and storage has a hardware footprint (S10, S12). The interface labels this as "our estimate; no measurement exists" and states that S8's central value is derived from API prices. Cache reads are included in the total.
- Fresh-input and cache-write energy: range 1–4 Wh per 10,000 tokens (S8, S10, S11), central value about 2.1 Wh per 10,000 tokens from S10 (decided by the user on 2026-09-26). The methodology notes that the cache-read central value (0.39) is therefore about one-fifth of the fresh-input central value, not the one-tenth implied by S8's own pricing ratio, because the two central values come from different sources.
- Output energy: the employee chooses a model from the calculator's existing list, and output tokens use that model's EcoLogits energy per output token, with its range (S9). Input rates are the same for every model because no source gives them per model; the interface says so. (Proposed by the agent; the user did not object on 2026-09-26.)
- Where sessions are entered (decided by the user on 2026-09-26): the session tracker only. The tracker's "Agent session" action opens the session form (model plus four token fields), and each logged session is added to that day's AI total. The existing output-only "coding / agent session" size (100,000 output tokens) is removed from both the tracker and the calculator. As with images, sessions are not counted when "Use my log to drive this page" is off.
- Projects (decided by the user on 2026-09-26):
  - When logging a session, the employee can optionally attach a project name. A project view sums each project's tagged sessions across days. Those sessions count toward the AI total once, on the day they were logged.
  - Separately, a project estimate form calculates a whole project from typed-in token totals by type (pre-filled with the S59 example). Its result is shown beside the AI total and is never added to it, so nothing is counted twice.

**Calculation, evidence, and uncertainty.**

- Energy for a session (central, low, and high computed separately):
  - output tokens × the chosen model's EcoLogits energy per output token (its 100,000-token figure ÷ 100,000), with EcoLogits' range (S9);
  - plus (fresh-input + cache-write tokens) × 2.1 Wh per 10,000 (range 1–4);
  - plus cache-read tokens × 0.39 Wh per 10,000 (range 0–4).
- Carbon: energy × the selected region's grid intensity, plus EcoLogits' embodied hardware carbon for the output tokens only (decided by the user on 2026-09-26, following the image method). No embodied carbon is added for input tokens because no source gives one; the interface says so.
- Water: EcoLogits' water for the output tokens, plus input energy (fresh input, cache writes, and cache reads) × 4.88 L/kWh from S46, labelled as derived (decided by the user on 2026-09-26). The methodology discloses that the two parts use different water intensities (EcoLogits' own for output, S46's for input).
- Project estimate: the same calculation applied to typed-in project totals.
- Limitations to state in the interface:
  - no public source measures input, cache-write, or cache-read energy for frontier cloud models, and no provider publishes per-session energy;
  - the input rates come from GPT-4o-era estimates (S10, S11) and a price-based proxy (S8), and are the same for every model;
  - input cost grows faster than linearly with context length (S10), which a flat per-token rate does not capture;
  - cache-read energy is the project's own bounded estimate, and for realistic sessions it is usually the largest and least certain component;
  - the same task can vary up to 30× in tokens between runs (S7);
  - the S8 and S59 examples are single developers and not typical use.

**Interface expectations.**

- The tracker's "Agent session" action opens a form with a model choice, the four token fields, an optional project name, and the S8 reference note beside the fields.
- A logged session shows its energy, carbon, and water as a central value with a low–high range, and a breakdown showing how much comes from output, fresh input and cache writes, and cache reads.
- The project view lists each project's tagged sessions and their summed total with its range.
- The project estimate form is pre-filled with the S59 example, clearly labelled, and shows its result beside the AI total with a statement that it is not added to it.
- The limitations above are stated in plain language with links to S7, S8, S9, S10, S11, S46, and S59, and the methodology section of `index.html` documents the method.

**Acceptance checks (feature 2).** With the United States region selected (380 g CO₂e/kWh) and Claude Opus 4.8 as the model:

1. Logging a session of 10,000 fresh-input, 10,000 cache-write, 500,000 cache-read, and 5,000 output tokens adds about 46.7 Wh (17.7–238 Wh), about 18.2 g CO₂e (7.2–91 g), and about 202 mL of water (61–1,136 mL) to today's AI total. The breakdown shows output about 23.0 Wh, fresh input and cache writes 4.2 Wh, and cache reads 19.5 Wh.
2. Each token type changes the result independently: for example, raising only the cache-read count raises only the cache-read component.
3. The calculator's typed-in rows and the tracker no longer offer the output-only "coding / agent session" size.
4. Sessions tagged with the same project name appear together in the project view, and its total equals the sum of those sessions. Each session counts once in its own day's AI total.
5. The project estimate form, left at its S59 pre-fill, shows about 708 kWh (74–6,246 kWh), about 271 kg CO₂e (30–2,375 kg), and about 3,350 L of water (259–30,376 L), and does not change the AI total.
6. Logged sessions persist after a page refresh, are removed by "Undo last", are included in the monthly budget when "Use my log to drive this page" is on, and are not counted when it is off.
7. Every figure shown has a working link to its source, and the cache-read component is labelled as the project's own estimate.

### Feature 3. Digital day builder

**Need and outcome.** The calculator cannot represent video calls, streaming, social media, or gaming, although all three profiles spend substantial time on them, and every source agrees that the device dominates their footprint (research §5–8). After this feature, an employee can enter hours of these activities by device and see a digital-day total beside their AI total.

**Behavior, inputs, and outputs.**

- Boundary (decided by the user on 2026-09-26): each hour counts the user's device, the home router, the network, and data centres, following S25's full breakdown. The interface states that the home router is usually on regardless of the activity and that its share (38% in S25) depends on how shared energy is allocated, and that the AI total does not count the employee's own device or router, so the two totals are not measured on the same boundary.
- Home router (decided by the user on 2026-09-26): counted at its actual draw, 10 Wh per hour of activity on home broadband or Wi-Fi (S25's 10 W baseload router), and not at all on a cellular connection. S25's headline 71 Wh per hour is not used, because it allocates router energy by data volume (0.025 kWh per GB), the per-gigabyte method S19 criticises. Overlapping activities (decided by the user on 2026-09-26): the router is counted for no more than 10 Wh per clock hour. The typical-day panel has a field, "Hours your home Wi-Fi is in use for these activities", which starts at the sum of the home-Wi-Fi activity hours (capped at 24) and can be lowered when activities overlap. For logged activities, overlap is calculated from the log times.
- Network (decided by the user on 2026-09-26): data volume × S25's conventional intensities, 0.0065 kWh per GB on fixed broadband and 0.1 kWh per GB on mobile networks, using each activity's data use per hour. The methodology discloses that S19 finds network energy is not proportional to data volume, that S25's own power model gives a much smaller and flatter network figure, and that the network and the router are therefore counted by different methods.
- Data centres: about 1 Wh per hour of video streaming (S25). Social media adds a flat 15 Wh per day for anyone who enters any social media use (decided by the user on 2026-09-26), from Meta's 2024 electricity intensity of 0.0055 MWh per daily active person per year (S32); it is labelled as Meta's company-wide per-person average across all workloads, not tied to hours of use and not specific to other platforms. No data-centre figure is counted for video calls, music streaming, or gaming, and the interface says so.
- Data use per hour (decided by the user on 2026-09-26): video streaming SD 1 GB, HD 3 GB, 4K 7 GB on fixed broadband, and 0.17–3 GB on mobile depending on the data setting (S25, from Netflix figures); video calls 0.5–3.4 GB depending on the app, with a central value of 1.95 GB, the midpoint, labelled as the project's own construction because S22 does not name which app used how much (decided by the user on 2026-09-26); music streaming about 11–144 MB depending on the quality setting (S60). Social media and gaming have no verified data-use figure, so their network share is not counted, and the interface says so. For social media on a cellular connection the omitted network share could be large relative to a phone's own draw, and the interface states this plainly.
- Device power (proposed by the agent; the user did not object on 2026-09-26, and chose the monitor figure):

  | Device | Power | Source |
  | --- | --- | --- |
  | Smartphone | 1 W | S25 |
  | Laptop | 22 W | S25 |
  | Office desktop with monitor | 115 W | S25 |
  | TV | 100 W ("conservative for 2020") | S25 |
  | Console, gaming | 214–219 W (PS5) | S33 |
  | Console, streaming or menus | 43–47 W (PS5 home menu, used as a stand-in) | S33 |
  | Gaming PC, gaming | 305–359 W for the PC plus 14 W (10–29 W) for the monitor, about 315–388 W | S36, S37, S61 |

- Central values and ranges (decided by the user on 2026-09-26): the phone, laptop, office desktop, and TV use S25's single figures, labelled "single estimate, no range available", with no invented range. Console gaming uses about 216 W (range 214–219 W). The gaming PC uses about 373 W (S36's measured 358.6 W plus the 14 W monitor), with a range of about 315–388 W (S37's 305.1 W plus a 10 W monitor, to S36's 358.6 W plus a 29 W monitor).

- Inputs (decided by the user on 2026-09-26): both a typical-day panel and optional tracker logging.
  - Typical-day panel: rows of activity, device, connection (home broadband or Wi-Fi, or cellular), hours per day, and a quality setting where it applies (video resolution, music quality).
  - Activities and devices offered (proposed by the agent for review): video calls on a phone, laptop, or office desktop; video streaming on a phone, laptop, office desktop, TV, or console (menus figure); music streaming on a phone, laptop, or office desktop; social media on a phone, laptop, or office desktop; gaming on a phone, console, or gaming PC. The cellular connection is offered for the phone only; video streaming on cellular offers S25's mobile data settings (save data 0.17 GB, automatic 0.25 GB, maximum 3 GB per hour).
  - Tracker: employees can log individual calls, streams, social media, or gaming sessions as they happen, with the same fields and a duration.
  - Which counts: activity by activity. If an activity has been logged today, today's logs replace that activity's typical-day entry; every other activity keeps its typical-day hours. The interface shows which activities come from the log and which from the typical-day panel, and states that the total mixes a record with an estimate.
- Carbon: energy × the selected region's grid intensity, as elsewhere in the calculator.
- Water (decided by the user on 2026-09-26): device, router, and network electricity × 4.35 L/kWh (S46, water used to generate US electricity overall); the data-centre share × 4.88 L/kWh (S46, as for AI). Both are US averages, so the interface notes that water does not change with the region setting.

**Calculation, evidence, and uncertainty.**

- For each activity entry: energy = hours × device power + hours × data per hour × network intensity (fixed or mobile) + hours × data-centre energy where one exists. Social media adds its flat 15 Wh per day once. The router adds 10 Wh × home-Wi-Fi hours (as defined above). Central, low, and high values are computed separately where a range exists.
- Output: the digital-day total's energy, carbon, and water, with a breakdown by activity and by component (device, router, network, data centres), shown beside the AI total, never as a share of it (see Goal).
- Limitations to state in the interface:
  - the device dominates every activity, and the TV, laptop, phone, and office-desktop figures are single 2020-era estimates without ranges (S25);
  - the network is costed per gigabyte, which S19 disputes, while the router is costed by its actual draw;
  - social media and gaming have no network share because no verified data-use figure was found, which may understate social media on cellular considerably;
  - there is no data-centre figure for calls, music, or gaming; the social media server share is Meta's company-wide average;
  - S25 was seed-funded by Netflix through DIMPACT, and its figures are European averages for 2020;
  - device manufacturing is not included here (see feature 4);
  - the AI total does not count the employee's own device or router, so the two totals use different boundaries.

**Interface expectations.**

- A typical-day panel with rows for activity, device, connection, hours per day, and quality where relevant, plus the home-Wi-Fi hours field.
- The tracker offers logging of digital activities with the same fields and a duration.
- The digital-day total appears beside the AI total with its range and a breakdown by activity and component, marking which activities come from the log and which from the typical-day panel.
- Plain-language notes cover the limitations above, with links to S19, S22, S25, S32, S33, S36, S37, S46, S60, and S61; the methodology section of `index.html` documents the method.

**Acceptance checks (feature 3).** With the United States region selected (380 g CO₂e/kWh), nothing logged, and a typical day of 2 hours of video calls on a laptop over home Wi-Fi, 2 hours of HD video streaming on a TV over home Wi-Fi, 1 hour of social media on a phone over cellular, and home-Wi-Fi hours left at 4:

1. The digital-day total is about 366 Wh (348–385 Wh), about 139 g CO₂e (132–146 g), and about 1.60 L of water (1.52–1.68 L).
2. The breakdown shows the laptop 44 Wh, the TV 200 Wh, the phone 1 Wh, the router 40 Wh, the network about 64 Wh (calls about 25 Wh, streaming 39 Wh), and data centres 17 Wh (streaming 2 Wh, social media 15 Wh).
3. Lowering home-Wi-Fi hours from 4 to 3 lowers the total by 10 Wh; the field cannot exceed the sum of home-Wi-Fi activity hours or 24.
4. Logging a 30-minute HD stream on the TV today replaces the typical-day streaming entry (the total falls to reflect 0.5 hours of streaming), leaves calls and social media from the typical day, and labels each activity's origin.
5. Switching the social media entry to 0 hours removes its 15 Wh data-centre share.
6. Changing the region changes carbon but not energy or water.
7. The digital-day total never changes the AI total, the monthly budget, or the team view.
8. Every figure shown has a working link to its source, and single-estimate devices are labelled "single estimate, no range available".

### Feature 4. Device manufacturing spread over use

**Need and outcome.** Manufacturing accounts for about 70–76% of the life-cycle carbon of current phones, laptops, and TVs (S39, S40, S42), so an activity-only view leaves out most of a device's footprint, and the calculator's existing device figures are outdated or unsupported (research §9). After this feature, an employee can enter the devices they own and how long they keep them, and see manufacturing emissions included in their digital-day total.

**Behavior, inputs, and outputs.**

- How manufacturing counts (decided by the user on 2026-09-26): it is added to the digital-day total as its own "manufacturing" component, in the same way that the AI total already includes data-centre hardware manufacturing through EcoLogits' embodied carbon.
- Spreading (decided by the user on 2026-09-26): per day kept. Each device's daily share is its manufacturing carbon ÷ (years kept × 365), whatever the hours of use that day. The employee enters how many years they keep each device.
- Device figures (rows 1–5 proposed by the agent and not objected to by the user; rows 6–8 decided by the user on 2026-09-26). Default years kept follow each source's own assumption and can be changed by the employee.

  | Device | Manufacturing carbon | Default years | Source and label |
  | --- | --- | --- | --- |
  | Smartphone | about 42 kg | 3 | S39: 76% of the iPhone 17's 55 kg; one model |
  | Laptop | about 110 kg | 4 | S40: 71% of the MacBook Air's 155 kg; one model. S41's 215 kg median (158–287 kg) is cradle-to-grave including use and is disclosed, not used |
  | TV, about 55-inch | about 370 kg | 7 | S43: derived from a commercial signage display, labelled as a proxy |
  | TV, 75-inch | about 690 kg | 7 | S42 |
  | Office desktop | 198 kg | 4 | S44: whole life cycle, because the manufacturing share is not published as text, so it overstates manufacturing; excludes the monitor |
  | Console | 190 kg | 5 | S62 (Xbox Series X), labelled as a stand-in for all consoles because Sony publishes no figure; S66's 89 kg for a PS4 is disclosed |
  | Gaming PC | 112 kg | 4 | S63 (office-desktop proxy), labelled as a conservative lower bound; excludes the monitor |
  | Monitor | 194 kg | 5 | S64, labelled as a whole-life-cycle total because the manufacturing share cannot be separated; S65's about 334 kg (older Dell method) is disclosed |

- Energy and water (decided by the user on 2026-09-26): manufacturing is counted in carbon for every device. In water, only the smartphone has a figure: about 12,075 L (3,190 gallons) of production water from S51, spread per day kept (about 11 L per day over three years), labelled as mostly grey water, a notional dilution volume rather than water consumed. Other devices show "no manufacturing water figure found". No manufacturing energy is counted for any device, because no source reports it; the energy view says so. The interface notes that this water figure is measured differently from the AI and digital-day water figures (see feature 5).
- Inputs (decided by the user on 2026-09-26): a separate "My devices" list, independent of the digital-day activities. Each row has a device type (from the table above), the number owned, and years kept, pre-filled with the default.
- Shared devices (decided by the user on 2026-09-26): each device row has an optional "shared with how many people" field, defaulting to 1, and the employee counts their share.
- Existing device comparisons (proposed by the agent for review): the calculator's current yearly comparison items and methodology text for a new smartphone (about 70 kg, Apple), a new laptop (about 250 kg, devera.ai), and a new flat-screen TV (about 350 kg, an EPA document that does not contain that figure) are replaced with the manufacturing figures above (about 42 kg, 110 kg, and 370 kg) and their sources. Their water comparisons are left to feature 5.

**Calculation, evidence, and uncertainty.**

- Daily manufacturing carbon for each device row = manufacturing carbon × number owned ÷ (years kept × 365) ÷ number of people sharing. The rows are summed into the digital-day total's "manufacturing" component.
- Daily manufacturing water applies to smartphone rows only, calculated the same way from about 12,075 L.
- Output: the manufacturing component of the digital-day total, with a per-device breakdown, in carbon (and phone water only).
- Limitations to state in the interface:
  - figures are manufacturer self-reports or proxies for one model each, not averages across the market (Apple notes inherent modelling uncertainty);
  - the office-desktop and monitor figures are whole-life-cycle totals, which overstate manufacturing, while the gaming-PC figure is an office-desktop lower bound;
  - the console figure is an Xbox stand-in because Sony publishes none;
  - sources disagree on monitors by about 2.7 times (S64 against S65);
  - the default years kept are each source's own assumption, and results depend strongly on them;
  - manufacturing energy is not counted, and manufacturing water is available for phones only and is mostly grey water.

**Interface expectations.**

- A "My devices" list with rows for device type, number owned, years kept (pre-filled), and "shared with how many people" (default 1).
- The digital-day breakdown shows "manufacturing" as its own component with a per-device breakdown.
- Each device figure shows its source and label (proxy, lower bound, or whole life cycle), with links to S39, S40, S41, S42, S43, S44, S51, S62, S63, S64, S65, and S66; the methodology section of `index.html` documents the method.

**Acceptance checks (feature 4).** With a smartphone (1, kept 3 years, not shared), a laptop (1, kept 4 years, not shared), and a 55-inch TV (1, kept 7 years, shared with 3 people):

1. The manufacturing component is about 162 g CO₂e per day: phone about 38.4 g, laptop about 75.3 g, TV about 48.3 g.
2. Changing the TV to "shared with 1" raises its share to about 144.8 g per day; changing the phone to 2 owned doubles its share.
3. Changing years kept changes the daily share in inverse proportion (for example, the phone kept 6 years gives about 19.2 g per day).
4. In the water view, the manufacturing component is about 11.0 L per day from the phone only, labelled as mostly grey water, and other devices show "no manufacturing water figure found".
5. In the energy view, manufacturing is not added, and a note says no source reports manufacturing energy.
6. The manufacturing component changes the digital-day total and never the AI total.
7. The yearly comparison items for a new smartphone, laptop, and TV show about 42 kg, 110 kg, and 370 kg with working links to S39, S40, and S43.

### Feature 5. Like-for-like comparisons

**Need and outcome.** Comparisons that mix accounting methods can make AI look trivial or significant depending on the pairing, which conflicts with the brief's neutrality requirement and which a skeptical reader such as Robin would reasonably question (research §10–11; S50, S51, S57, S58). After this feature, every everyday comparison uses a definition that matches the figures it is compared with, and says which definition it uses.

**Current state (checked in the code on 2026-09-26, before the item-by-item verification below).** The water charts already draw from separate blue-water lists (`DAILY_WATER_ITEMS`, `ANNUAL_WATER_ITEMS` in `assets/js/data.js`); the full-footprint figures that research §10 describes (a burger at about 1,700 L, coffee at about 140 L, a smartphone at about 12,800 L) appear in the methodology text of `index.html`. Remaining inconsistencies found:

1. The burger's blue water is 1.6 gal (about 6 L), traced on 2026-09-26 to a UK-specific figure (S80, about 67 L/kg), against the global average of 550 L/kg (S68).
2. The smartphone's yearly water (3,370 gal, about 12,760 L) sits in the blue-water chart but cites a phone-recycling blog, and S51 describes a similar total as mostly grey water.
3. "A day of home electricity" and "an hour of air conditioning" use NREL's 0.47 gal/kWh (about 1.8 L/kWh), while the AI and digital-day totals use S46's 4.35–4.88 L/kWh.
4. The other blue-water values (coffee, bread, egg, milk, rice, avocado, almonds, T-shirt, jeans, lawn items) had not been checked against their sources (now checked; see the tables below).
5. The methodology text quotes full-footprint water figures next to blue-water charts.
6. The carbon comparisons' boundaries and sources had not been checked against the AI and digital-day figures (now checked; see the tables below).

**Scope (decided by the user on 2026-09-26):** water and carbon. Every water and carbon comparison item is checked for its source and boundary against the AI and digital-day figures, and corrected, relabelled, or removed.

- Rule (decided by the user on 2026-09-26):
  - Water items use a sourced blue-water consumption figure, the same kind of water as the AI and digital-day figures. Items based on electricity use S46's 4.35 L/kWh.
  - Carbon items use a sourced figure with a stated boundary (life cycle, or electricity only). Electricity-based items use kWh × the selected region's grid intensity, as the AI figures do.
  - Items that cannot be verified to this standard are removed, not kept with a caveat.
  - The methodology text is rewritten to match the figures actually used.
- Where comparisons appear (decided by the user on 2026-09-26): beside both totals. The AI total and the digital-day total each appear as a highlighted bar in the daily and yearly comparison charts, next to each other and never combined (see Goal).
- Verification timing (decided by the user on 2026-09-26): done during this specification stage, item by item, with new sources added to `research.md` for the user's assessment.
- Water figures use global averages (decided by the user on 2026-09-26). Serving and garment masses are the project's stated assumptions and are shown in the interface (for example "per 113 g patty").
- Daily water comparison items (accepted by the user on 2026-09-26):

  | Item | Blue water | Basis |
  | --- | --- | --- |
  | A cup of coffee (7 g roasted) | about 1.0 L | 139 L/kg, roasted coffee (S67) |
  | A slice of bread (30 g) | about 9.0 L | 301 L/kg, wheat bread (S67) |
  | An egg (60 g) | about 14.6 L | 244 L/kg (S68) |
  | A glass of milk (250 g) | about 21.5 L | 86 L/kg (S68) |
  | A bowl of rice (75 g dry) | about 33 L | 443 L/kg, husked rice (S67) |
  | An avocado (200 g) | about 57 L | 283 L/kg (S67) |
  | A beef burger (113 g patty) | about 62 L | 550 L/kg (S68) |
  | A handful of almonds (28 g) | about 107 L | 3,816 L/kg, shelled (S67) |
  | A day of home electricity (29.6 kWh) | about 129 L | 10,791 kWh per year (S69) × 4.35 L/kWh (S46) |

  Removed: "Printing a book" (the paper study does not separate green from blue water for the forestry stage, S71) and "An hour of air conditioning" (no source for its 3 kWh). The burger's water is shown with its range: about 67 L/kg for UK beef to nearly 2,000 L/kg for US irrigated systems (S80), around the global 550 L/kg (S68).
- Yearly water comparison items (accepted by the user on 2026-09-26):

  | Item | Blue water | Basis |
  | --- | --- | --- |
  | A year of daily coffee | about 355 L | 365 × the cup above |
  | A cotton T-shirt (250 g) | about 1,230 L | 4,917 L/kg, final cotton textile (S70) |
  | A pair of jeans (800 g) | about 3,930 L | as above, cotton only |
  | A year of daily almonds | about 39,000 L | 365 × the handful above |
  | Buying five fewer cotton garments for a year (a cut) | about 6,150 L | five T-shirts as above |

  Removed: "A new smartphone" (mostly grey water, S51, and its current source is a recycling blog), and both lawn items (EPA gives no per-lawn figure, S72). The yearly "ways to cut water" chart therefore has one item, which the interface presents as is.
- Daily carbon comparison items (accepted by the user on 2026-09-26):

  | Item | Carbon | Boundary and basis |
  | --- | --- | --- |
  | A cup of coffee (7 g roasted) | about 0.20 kg | farm to retail; 28.53 kg/kg (S73) |
  | An hour on a PS5 | 0.216 kWh × the selected region's grid | electricity only (S33) |
  | A mile in a gas car | about 0.40 kg | tailpipe CO₂ only (S74) |
  | Printing a paperback book | about 2.71 kg | cradle to gate (S78) |
  | A beef burger (113 g patty) | about 11.2 kg (low 3.8 kg) | farm to retail; beef-herd beef 99.48 kg/kg, with dairy-herd beef 33.3 kg/kg as the low end (S73) |

  Removed: 3 minutes in a microwave, a 10-minute hot shower, a dishwasher load, a dryer load, and an hour of air conditioning (no verifiable electricity figure, or dependent on an assumed heater type).
- Yearly carbon "add" items (accepted by the user on 2026-09-26): a year of daily coffee about 73 kg (S73); a pair of jeans about 33 kg, life cycle (S79); a beef burger every week for a year about 580 kg (S73); a new smartphone, laptop, and TV at about 42, 110, and 370 kg (feature 4); a transatlantic round trip about 1.6 t per passenger (S75, S77); a year of driving about 4.6 t, tailpipe only, 11,500 miles (S74). Removed: a cotton T-shirt, a new sofa, a new bicycle, manufacturing a new car (their cited source gives no figures), and the short-haul and US cross-country flights (unverifiable calculator outputs).
- Yearly carbon "cut" items (accepted by the user on 2026-09-26), per person per year: hang-drying clothes about 210 kg and recycling about 210 kg (S75); a hybrid car about 0.7 t (−0.2 to 3.1 t), heat-pump heating about 0.8 t, a deep home retrofit about 0.9 t, a vegan diet about 0.9 t, green electricity about 1.5 t (0.3–2.5 t), and an electric car about 2.0 t (−1.9 to 5.4 t; S75 gives 1.15 t, disclosed) (S76); living car-free about 2.4 t (S75; S76 median 2.0 t, 0.6–3.6 t). Removed: LED bulbs (not quantified by S75).

- Baseline driving setting (decided by the user on 2026-09-26): brought into line with S74 so that the page gives one figure for a year of average driving. "An average amount" becomes about 4,600 kg CO₂ a year (11,500 miles, tailpipe only); "a little" and "a lot" are scaled by the same ratio (about 1,150 kg and 9,580 kg) and labelled as scaled from the EPA average. The methodology text's "~12,000 mi" becomes 11,500 miles.

**Interface expectations.**

- The daily and yearly comparison charts show the AI total and the digital-day total as two separate highlighted bars beside the everyday items.
- Each item's label or tooltip states its unit and assumption (for example "per 113 g patty") and its boundary (blue water; farm to retail; tailpipe only; cradle to gate; life cycle; electricity only).
- Items with a reported range (the burger, the Ivanova cuts) show the range.
- The methodology section of `index.html` is rewritten so that every figure it quotes matches the figures used, removed items and their citations are deleted, and the reasons for the definitions are explained in plain language, including why a burger's total water (about 15,000 L/kg) differs from its blue water.

**Acceptance checks (feature 5).**

1. Every comparison item in `assets/js/data.js` appears in the tables above with the stated value, and no removed item remains in the data or the methodology text.
2. Every comparison item has a working link to its source and a visible boundary or assumption.
3. In the water view, a cup of coffee shows about 1.0 L and a beef burger about 62 L; a day of home electricity shows about 129 L.
4. With the United States region selected, an hour on a PS5 shows about 0.082 kg CO₂e (0.216 kWh × 380 g/kWh); changing the region changes it.
5. The daily and yearly charts show both the AI total and the digital-day total as separate highlighted bars; neither is shown as a share of the other.
6. The methodology text contains no full-footprint water figure presented as comparable to the AI figures.

## User approval

Review the completed specification directly and explicitly approve it before planning begins. The agent cannot complete this approval on the user's behalf.

Approved by the user on 2026-09-26 ("i approve the specification"). At approval, sources S59–S80 in `research.md` were still marked as not yet assessed by the user.

## Out of scope

Record ideas that will not be part of this project.

Alternatives rejected when the features were selected (`research.md`, Selected features):

- **Video generation logging.** Commercial-tool figures are inferred estimates (S5), sources conflict for the same model family (S2, S4), and EcoLogits' video outputs have not been checked.
- **Ranges carried through every result.** Too large for one feature; ranges are included within features 1–4 where the evidence gives them.
- **Water boundary selector.** Overlaps with feature 5.
- **A "why sources differ" and disclosure panel as a separate feature.** Disclosures appear within each feature instead.
- **AI as a share of the digital day.** Excluded by the Goal: the two totals are shown side by side, never as a percentage of each other.
- **Attempts per final output as a separate feature.** Covered by counting discarded variations in feature 1 and by token counts in feature 2.
- **A home grid region selector for US grids.** Not researched; the existing region setting is used unchanged.

Excluded by decisions made during this specification:

- Choosing an image model or settings (feature 1), and entering images or agent sessions in the calculator's typed-in estimate rather than the tracker (features 1 and 2).
- Per-model energy rates for input, cache-write, and cache-read tokens (feature 2; no source gives them).
- Cloud gaming, and a network share for social media and gaming (feature 3; no verified data-use figure).
- Counting the digital-day total in the session tracker's AI total, the monthly budget, or the team view (Goal).
- Manufacturing energy for any device, and manufacturing water for devices other than the smartphone (feature 4).
- Comparison items that could not be verified to feature 5's rule, including the lawn, microwave, shower, dishwasher, dryer, air-conditioning, T-shirt carbon, sofa, bicycle, car-manufacturing, LED-bulb, and short-haul and cross-country flight items.

Not changed by this project:

- The existing EcoLogits text-prompt figures and the yearly baseline footprint (region, home, diet, and flying settings). The driving setting is the one exception, brought into line with EPA under feature 5.

## Revisions

If implementation changes the intended result, update the specification and record what changed and why.

- 2026-09-26 (specification stage): Feature 1 as approved in `research.md` logged images "by model type and settings (resolution, quality or steps)". The user decided to use one general range with no model or settings inputs, because no commercial tool has published figures, the open-model studies ran each model at its own default settings (so the range already includes settings differences), and applying settings multipliers on top would partly double-count.
- 2026-09-26 (specification stage): Feature 2 as approved in `research.md` described three token types (fresh input, cached input, output). The user decided on four input fields, splitting cached input into cache writes and cache reads, because real tools log them separately and cache writes involve fresh processing.
- 2026-09-26 (specification stage): Feature 5 as approved in `research.md` corrected the everyday comparisons so that water is compared like for like. The user widened it to cover carbon as well, to show the comparisons beside both totals, to verify every comparison item against a rule and remove those that fail, and to bring the baseline driving setting into line with EPA, because checking the code showed that several carbon and water figures did not match their cited sources.

## Commands

### Start specification

User: Open the project repository as your workspace, start a fresh chat, and type `start specification`.

### Save transcript

Agent: After the user approves the specification, remind them that the transcript is a deliverable and ask them to say `save transcript`. Wait for that direction.

When the user directs the agent to save the transcript, the agent saves the entire conversation in the `transcripts/` directory as `spec-YYYY-MM-DD_HHMMSS.md`, marks user and agent responses clearly, and confirms the saved relative path.
