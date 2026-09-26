# Research

> EDITING DIRECTIVE: USER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE USER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Develop and record the evidence and decisions that will guide the technical specification.

## Instructions for the user

You are responsible for the ethics, accuracy, and fairness of the research. Direct the inquiry toward useful questions, judge sources and suggestions rather than accepting them at face value, and approve only results supported by verified evidence and audience needs. Seek evidence that challenges your assumptions, represent uncertainty honestly, and reject claims you cannot verify. See [UNESCO's Guidance for generative AI in education and research](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research).

## Instructions for the agent

Read AGENTS.md, brief.md, and this file. Begin with a concise orientation and one focused question.

Guide the research one stage at a time. Help the user explore options, assess sources, and identify contrary evidence or uncertainty without making decisions for them. Draft concise updates for review, and never mark research or feature choices approved on the user's behalf.

## Reference employee profiles

- Alex — Los Angeles, 24, junior video editor: Uses text, image, and video-generation tools for production work. Streams reference media and uses social platforms across a phone, laptop, and television. Wants to understand impacts beyond text prompts and is particularly attentive to water use.
- Jordan — Austin, 38, creative technologist: Uses coding agents and generative tools in long, irregular sessions. Games on a desktop PC and participates in frequent video calls. Finds "prompts per day" too simplistic and wants assumptions, ranges, and project-level totals.
- Robin — Chicago, 56, operations manager: Uses text AI occasionally but spends substantial time in video meetings, streaming media, and social platforms. Is skeptical of the company's motives and needs plain-language explanations, visible sources, and honest indications of uncertainty.

These are fictional starting profiles, not evidence about demographic groups. Research the activities, circumstances, and needs they represent rather than making assumptions based on age or location.

## Audience needs

Record information about the activities, circumstances, and needs represented by all three reference profiles. Separate evidence from assumptions that still need checking.

Researched activity by activity. Reviewed by the user on 2026-09-26 ("its all good with research.md").

### 1. Image generation (Alex)

Evidence (figures checked against the source text; see Source assessments S1–S3):

- Energy per image varies by more than two orders of magnitude across studies: about 0.09 Wh to 4.1 Wh across 17 open models on a consumer GPU (S3); a median of 1.35 Wh, mean of 2.9 Wh, and maximum of 11.5 Wh across 2022–23 open models on a data-center GPU (S1); about 0.32 Wh GPU-only, or about 0.63 Wh with overhead, for Stable Diffusion 3 Medium at 1024×1024 and 25 steps (S2).
- Settings matter: model choice changed energy up to 46×, doubling resolution raised it 1.3–4.7× (S3), and doubling diffusion steps roughly doubled it (S2). Prompt length had no statistically significant effect, and higher quality did not always cost more energy (S3).
- For scale, the calculator's current EcoLogits figure for one GPT-5.5 chatbot reply is about 2.7 Wh, so one image ranges from well below one text reply to a few times above it, depending on the model.

Limitations:

- No source measured the commercial tools creative staff are likely to use (for example Midjourney, OpenAI, Google, or Adobe Firefly image models), and no per-image energy disclosure from those providers was found. This is a search result, not proof that none exists.
- Studies differ in hardware (A100, H100, RTX 4090) and scope (GPU-only vs. whole system), so their figures are not directly comparable.
- The models measured are older open-source ones; newer commercial architectures could use more or less energy.
- EcoLogits, the calculator's existing data source, covers text and video generation but not images.

Assumptions still to check:

- Water per image: no direct figure found. Any value would be derived from energy and data-center and grid water intensity, and must be labelled as derived.
- How many images a professional generates per task or day, including discarded variations.
- Which image tools the company's employees actually use (to confirm with the client).

### 2. Video generation (Alex)

Evidence (figures checked against the source text; see Source assessments S2 and S4–S6):

- Energy per video spans more than three orders of magnitude: about 0.14 Wh (AnimateDiff) to over 415 Wh (WAN2.1-14B) across seven open models at default settings on one H100 GPU; CogVideoX-5B used about 25 Wh (S4).
- Estimates for commercial models, for one 8-second 720p video: Veo 3 about 20–43 Wh, Seedance-1 about 72–88 Wh, Runway Gen-4.5 about 242–411 Wh, and Sora 2 Pro about 315–534 Wh; Sora 2 Pro averaged about 1,313 Wh for a 12-second 1080p video (S5).
- An older, low-quality CogVideoX model used about 30 Wh (109,000 J) per video and a newer 5-second, 16 fps version about 940 Wh (3.4 MJ) (S2).
- Energy grows roughly with the square of resolution and of video length, and linearly with denoising steps (S4), so longer or sharper clips cost disproportionately more.
- EcoLogits now estimates energy, carbon, water, and embodied impacts per video for commercial providers including Google, OpenAI, Runway, Kling, and ByteDance (S6).
- For scale, against the calculator's figure of about 2.7 Wh for one GPT-5.5 chatbot reply, one Veo 3 clip is roughly 10 replies and one Sora 2 Pro 1080p clip several hundred. Unlike images, video can be far above text.

Limitations:

- Commercial-model figures are estimates inferred from API generation times and assumed hardware, not measurements, and are unconfirmed by the providers (S5).
- Sources disagree for the same model family (about 25 Wh in S4 vs. about 940 Wh in S2 for CogVideoX versions), probably because of different versions and settings; this has not been fully reconciled.
- EcoLogits attributes the whole server's power to each request, with no sharing across concurrent requests, which likely pushes estimates upward (S6).
- S4 and S5 are preprints, and S2, S4, and S5 all involve the same researcher (Luccioni), so they are not independent confirmations.
- EcoLogits' video methodology was produced with the GenAI footprint Alliance, a Publicis Groupe initiative with corporate members. This does not make it wrong but should be disclosed to readers concerned about corporate motives.
- Audio generation is not studied in S4 and is described as less well grounded in S5.

Assumptions still to check:

- How many clips a professional generates per finished shot. S5 cites a news report that one AI-generated Coca-Cola advertisement involved over 70,000 generated videos; this is secondhand, an extreme case, and not yet verified. If iteration dominates, the calculator may need to ask about attempts rather than only final outputs.
- Water per video: the EcoLogits figure is derived from energy and water intensity, not measured.
- Which video tools the company's employees use, and at what length and resolution.
- Whether the EcoLogits calculator's outputs match the figures in S5 (to check during specification).

### 3. Coding agents and long, irregular sessions (Jordan)

Evidence (see Source assessments S7–S13):

- The calculator currently treats one "coding / agent session" as 100,000 output tokens priced with EcoLogits' per-output-token energy, giving for example about 459 Wh (314–604) for Claude Opus 4.8 and about 644 Wh for GPT-5.5 (`assets/js/data.js`). EcoLogits models energy from output tokens only and does not model input tokens (S9).
- Real agent sessions are dominated by input tokens. Across eight frontier models on SWE-bench Verified, agentic coding used about 1,000× more tokens than code chat or code reasoning, with input rather than output tokens driving cost even with caching; runs of the same task varied up to 30× in total tokens, and more tokens did not mean higher accuracy (S7).
- One developer's Claude Code logs (8,825 API calls) show a median session of 24 model calls (5 user messages, 19 tool-call responses) and about 592,000 tokens, mostly cache reads. He estimated about 41 Wh per median session and about 1,300 Wh per median working day running two or three agents at once (S8).
- Energy for fresh input tokens: three estimation methods roughly agree to within a few times, implying about 1–4 Wh for 10,000 extra input tokens: about 2.1 Wh from a compute model (S10), under about 1.7 Wh from API-latency inference (S11), and about 2–4 Wh from a price-based proxy (S8). S10 estimates that input cost grows roughly quadratically with length, reaching about 40 Wh for a 100,000-token input.
- Energy for cached input tokens: no evidence-based figure found. The only number (one-tenth of fresh input) is an assumption taken from API pricing (S8). Caching avoids recomputation and saves operating energy, but the storage hardware adds embodied carbon (S12).
- "Energy per token" can mislead: in one measurement study, longer outputs lowered joules per token (7.46 to 0.72 J/token) while raising total energy (1.19 to 5.93 kJ) (S12).

Limitations:

- No public source measures per-input-token or per-cached-token energy for the frontier cloud models used for coding, and no provider publishes per-session energy for its coding agents.
- S8 is self-described "napkin math" from one user on one model, and assumes energy scales with API price. S7 measures tokens and cost, not energy, on benchmark bug-fix tasks that may not resemble creative-technology work. S10 and S11 are models or inferences rather than direct measurements.
- Measured studies of whole agent tasks found so far use small local models on consumer or workstation GPUs (for example SWEnergy, arXiv:2512.09543; AgentStop, arXiv:2605.15206; only titles and abstracts read) and do not represent cloud frontier models.

Relevance to Jordan's stated needs:

- "Prompts per day is too simplistic" is supported: one user message triggers many model calls, and the same task can vary 30×.
- The evidence supports wide ranges and visible assumptions rather than a single session figure.

Options identified for the calculator (for the user to decide, not decisions):

1. Keep the current output-only EcoLogits figure and disclose that it ignores input tokens and real session structure.
2. Add an input-token component using the approximate 1–4 Wh per 10,000 fresh input tokens range, with cached tokens shown as an explicitly unknown range.
3. Show a session-level range built from the structure evidence (S7, with S8 as a worked example), clearly labelled as illustrative.

Assumptions still to check:

- How long and how frequent Jordan-like sessions are in practice (only one blogger's data so far).
- Whether provider documentation gives average usage figures for coding tools that could serve as a second data point.

### 4. Occasional text AI (Robin)

Evidence (see Source assessments S9–S11 and S14–S17):

- Published "typical prompt" figures cluster around 0.24–0.42 Wh: 0.24 Wh for the median Gemini Apps text prompt, measured in production (S14); about 0.34 Wh for an "average" ChatGPT query, with no method given (S15); about 0.3 Wh for a typical GPT-4o query (S10); and 0.42 Wh for a short GPT-4o prompt (S11).
- The calculator's EcoLogits figures for a 300-word reply range from about 0.04 Wh (Claude Haiku 4.5) to about 5.4 Wh (Gemini 3.1 Pro); GPT-5.5 is about 2.7 Wh and 9.6 mL (S9, `assets/js/data.js`). Figures for flagship models are therefore several times higher than the published typical-prompt figures.
- Water per prompt varies by more than 100× depending on what is counted: 0.26 mL for on-site cooling only (S14); about 1–22 mL for a 300-word reply including power-plant water (EcoLogits, S9); and 45 mL across the full life cycle including manufacturing for a 400-token Le Chat response (S16).
- Google reports that energy per median prompt fell 33× over one year (S14), so figures can date quickly.

Why the figures disagree (material for a plain-language explanation):

1. Which prompt: a median across a mix of models, including small ones (S14), versus specific flagship models at a fixed reply length (S9).
2. How it is obtained: measured in production (S14) versus modelled or inferred (S9–S11).
3. What water is counted: on-site cooling only, on-site plus power-plant water, or the full life cycle.
4. How carbon is counted: market-based, which is reduced by clean-energy purchases (S14), versus location-based on the local grid mix.
5. When: 2025 figures may not describe 2026 models.

Limitations and contrary evidence:

- Experts disputed Google's figures for excluding power-plant water and reporting only market-based carbon; Shaolei Ren (UC Riverside) said Google was "hiding the critical information" (S17). Google's paper had not been peer reviewed when published.
- Google argues that a median is more representative than a mean because a small share of heavy prompts skews the average (S14).
- OpenAI's figure (S15) has no published method.

Assumptions still to check:

- How the model and reply length Robin would realistically use relate to a "median prompt".
- Whether EcoLogits tends to estimate high for current models; no direct validation against measured production data was found.
- Andy Masley, author of the original calculator, has published a rebuttal to some criticism of Google's figures; it has not been read yet, and because this calculator is adapted from his work it would need careful handling if used.

### 5. Video calls (Jordan, Robin)

Evidence (see Source assessments S18–S24):

- The most widely quoted figure is 150–1,000 g CO₂ per hour of videoconferencing or streaming, with turning the camera off said to cut this by 96% (S18). It covers data transmission and data centres per gigabyte, not the user's device.
- Peer-reviewed research argues that network energy is not proportional to data volume, so "kWh per gigabyte" methods such as S18's are insufficient for estimating real network energy (S19). S18 used a 2015 network intensity of 0.06 kWh/GB, against the IEA's 0.002 kWh/GB (S20, background).
- Two sources point to a camera-off saving of roughly half rather than 96%: about 2.1× less phone battery energy with audio only (S23), and about half the data on a 4G phone (S24).
- The user's device probably dominates: 61% of videoconferencing carbon came from the user device in S23, and for streaming a 50-inch television uses about 100× a phone's electricity and about 5× a laptop's (S21).
- Data use varies with the app, from 0.5 to 3.4 GB per hour across Google Meet, GoToMeeting, Microsoft Teams, and Zoom in one lab test (S22), although under S19 this changes network energy little.
- No provider disclosure was found. Zoom's Impact page and FY2026 Impact Report announcement give no per-meeting, per-minute, or per-hour figure (the full FY26 report could not be located); no Microsoft figure for Teams was found, and a customer's request for one on Microsoft Q&A went unanswered; no Google figure for Meet was found. A widely repeated "50 g CO₂ per hour" figure traces to IdleForest, a browser-extension company whose method has not been seen, and is not proposed for use.

Limitations:

- No recent, peer-reviewed, whole-system energy figure per hour of video calling was found.
- Most tests are one-to-one; in group calls every participant's device and connection adds energy.
- Sources date from 2020–2025, and devices, codecs, and networks have become more efficient.

Assumptions still to check:

- Power draw of typical laptops, desktops, and meeting-room displays during a call (overlaps with activity 9, devices); needed to build any estimate.
- Whether the calculator should count the user's device at all, since it would be owned anyway. This is a methodology choice for the user.

### 6. Video and music streaming (Alex, Robin)

Evidence (see Source assessments S21 and S25–S28):

- Video streaming in Europe in 2020 averaged about 188 Wh and about 55 gCO₂e per hour: viewing devices and peripherals 96 Wh (51%), home router 71 Wh (38%), network 20 Wh (10%), and data centres about 1 Wh (1%) (S25). The IEA's central estimate for 2019 is about 77 Wh and 36 gCO₂ per hour (S21). The two central estimates differ about 2.4×, mainly because of device, router, and network assumptions.
- The viewing device dominates: a 50-inch television uses about 4.5× a laptop and about 90× a smartphone (S25; similar ratios in S21).
- For scale, one hour of video streaming at 77–188 Wh equals about 30–70 GPT-5.5 chatbot replies at the calculator's figure of about 2.7 Wh.
- Music streaming: no verified per-hour figure was found. Spotify stopped counting listener device and data-transfer emissions (Scope 3 Category 11) from 2023, citing a lack of industry-accepted methods; it had previously reported 103,920 tCO₂e of such "end-use" emissions for 2022 (S26). Audio uses far less data than video, and on phones and laptops the device probably dominates, but this is not quantified.

Limitations and contrary points:

- The home router is 38% of S25's figure but is usually on regardless of streaming; counting it depends on how shared energy is allocated. S25 states its headline figures "are not designed to be used as representative figures for any given scenario" and that the power model (S19) better represents the effect of changing viewing. Savings claimed for switching from HD to SD or streaming less are therefore likely overstated by per-gigabyte methods.
- S25 was seed-funded by Netflix through DIMPACT, a University of Bristol-led project with media-company members (Spotify is also a member).
- Figures cover operational electricity only; device manufacturing is excluded, although production is about 80% of a phone's lifecycle carbon (S21).
- Data are from 2019–2020 and European; carbon varies strongly by country grid, and US figures would differ.
- A widely reported figure of 1.037 gCO₂e per hour of Spotify listening, attributed to Greenly (S27), could not be located on Greenly's page and is not proposed for use.

Assumptions still to check:

- Current (2024–2026) device power draw for televisions, laptops, and phones (overlaps with activity 9).
- US grid carbon intensity for the profiles' locations, if carbon is reported.

### 7. Social media use (Alex, Robin)

Evidence (see Source assessments S29–S32):

- Scrolling a feed for one minute on an Android phone over Wi-Fi was estimated at 0.47 gCO₂e (LinkedIn) to 0.96 gCO₂e (TikTok), with Instagram and YouTube at 0.87 and Facebook at 0.63 (S29, 2023; rejected by the user as a source, so not to be used for figures). A 2021 edition from the same company reportedly gave about 2.63 g per minute for TikTok and an average of about 1.15 g, but that page is offline and unarchived, so the figures could not be verified (S30).
- Another consultancy estimated 2.921 gCO₂e per minute on TikTok and total TikTok emissions close to those of Greece; TikTok disputed this, saying ByteDance's 2023 total emissions were "less than 20%" of the estimate (S31).
- Across sources and years, per-minute estimates range from about 0.5 to about 3 gCO₂e. Within one source, apps differ about 2×; between sources, the same app differs about 3×. Video-heavy feeds come out higher.
- Meta discloses about 5.5 kWh of electricity (roughly 15 Wh per day) and about 15 gCO₂e of market-based Scope 1 and 2 emissions per daily active person per year in 2024, from total electricity use of 18.4 TWh (S32). This is a company-wide data-centre average across all workloads, including AI and advertising, not tied to time spent, and it excludes users' devices and networks. For scale, 15 Wh is about six GPT-5.5 chatbot replies at the calculator's figure.

Limitations and contrary points:

- The per-minute sources are commercial companies selling digital-sobriety or carbon-accounting services; none is peer reviewed, and one is directly disputed by the platform concerned.
- Network and server impacts in S29 are modelled with unpublished factors, likely per data volume, which S19 criticises.
- All per-minute tests used one Android phone for one minute; laptop and television use is not covered.
- Meta's carbon figure is market-based and lowered by renewable-energy matching; its location-based total across all scopes was 15.6 million tCO₂e in 2024. Its "use of sold products" category covers Meta's own hardware (such as Quest headsets), not users' phones. Its per-person water metric could not be interpreted consistently and is not proposed for use.
- No per-user or per-hour figure from TikTok was found.

Assumptions still to check:

- Whether social media should be modelled as device-dominated phone or laptop use drawing on the streaming evidence (S21, S25) plus Meta's data-centre share, rather than on the consultancy per-minute figures. This is a methodology choice for the user.

### 8. Gaming (Jordan)

Evidence (see Source assessments S33–S38):

- Current PS5 models draw about 214–219 W playing PS5 games, 88–110 W playing PS4 games, about 43–47 W on the home menu, and 0.3 W in low-power rest, according to Sony's self-tests dated 02/05/2026 (S33). The calculator's existing figure of about 200 W is consistent, but its cited link (`playstation.com/en-us/legal/ecodesign/`) now returns 404; Sony's figures are on its UK page.
- Desktop gaming PCs draw about 300–360 W for the PC alone while gaming: 358.6 W measured for *Baldur's Gate 3* on one test PC with background power removed (S36), and a modelled weighted average of 305.1 W across Steam hardware (S37). Both exclude the monitor. This is roughly 1.5× a PS5.
- A typical gaming PC including display was estimated at about 1,400 kWh per year from measurements of five PCs with circa-2015 components; intensive users "could easily" use double; measured peak power ran about 50% below nameplate for complete systems (S35).
- Energy varied as much by which of 37 games was played as by hardware across 26 measured systems; US gaming used about 34 TWh per year, 2.4% of residential electricity (S34).
- Cloud gaming uses "markedly higher" energy than local play (S34), up to about 3× in the most extreme cases because of data-centre cooling and network energy (S38).
- For scale, one hour of PS5 gaming (about 216 Wh) equals about 80 GPT-5.5 chatbot replies at the calculator's figure, similar to an hour of video streaming at S25's 188 Wh; a gaming PC hour is about 110–130 replies before the monitor.

Limitations and contrary points:

- No recent, independent, whole-system measurement of typical desktop gaming PCs was found. S36 is one game on one PC in a preprint; S37 is modelled from rated component power, which S35 suggests overstates real draw.
- The best per-machine yearly figure (S35) dates from 2016 with 2015 hardware. Modern GPUs are more efficient per frame but can draw more in total; the direction is not evidenced here.
- Sony's figures are manufacturer self-tests under a voluntary agreement.
- Console figures exclude the display while S35 includes it, so they are not directly comparable.
- Commercial blogs claiming 400–900 W for high-end systems cite no measurements and are not proposed for use.
- S37 raises the Carbon Trust's streaming delivery figure by 50% for cloud gaming on the basis of higher bandwidth, a per-data adjustment of the kind S19 criticises.

Assumptions still to check:

- How many hours per week Jordan-like users game.
- Monitor power to add to PC figures (overlaps with activity 9).

### 9. Device manufacturing (all three profiles)

Evidence (see Source assessments S39–S44):

- Making a device accounts for about 70–76% of its life-cycle carbon in current manufacturer reports: iPhone 17, 55 kgCO₂e (256GB) with about 76% from production over an assumed three years (S39); MacBook Air 15-inch with M4, 155 kgCO₂e with 71% from production over four years (S40); Samsung 75-inch QLED TV, 982 kgCO₂e with 70.4% (about 690 kg) from production over seven years (S42). This is consistent with the IEA's figure of about 80% for mobile devices (S21).
- Laptops across models: median 215 kgCO₂e, P10–P90 158–287 kg, from 10,000 Monte Carlo simulations by a commercial LCA vendor (S41).
- Typical-size TV proxy: a Samsung 55-inch commercial signage display totals 1,691 kgCO₂e with 21.9% from production, implying about 370 kg to manufacture (derived from S43). Consumer 55-inch TVs from LG and Samsung hold Carbon Trust certifications, but their figures are not published.
- Desktop PC: a current office tower (Dell OptiPlex Tower Plus 7020, Core i3, integrated graphics) totals 198 kgCO₂e over four years, excluding the monitor; Dell corrected an earlier published 257 kg as a calculation error (S44). No footprint report was found for any gaming desktop (for example Dell Alienware or HP OMEN); S37 also had to use a laptop as a proxy.
- Manufacturing impacts could be spread over hours of use. For example, about 42 kg of production emissions for an iPhone 17 over three years at three hours per day is about 13 gCO₂e per hour of use. This is illustrative arithmetic, not a sourced figure, and depends entirely on the assumed lifetime and daily hours.

Problems with the calculator's existing device citations (for correction during implementation, not now):

- "New flat-screen TV ≈ 350 kg" cites an EPA document (`epa.gov/.../lca_tv.pdf`) that contains per-kilogram material emission factors for a 32-inch LCD model, with no per-TV total and no 350 kg figure.
- "New smartphone ≈ 70 kg (Apple)" is out of date; the current iPhone 17 report gives 55 kg (256GB).
- "New laptop ≈ 250 kg" cites devera.ai, which now gives a median of 215 kg (S41).
- The smartphone water figure (~12,800 L) cites a UK phone-recycling company's blog that has not been evaluated.

Limitations:

- Figures are manufacturer self-reports (Apple, Dell) or manufacturer reports calculated by the Carbon Trust (Samsung); Apple notes "inherent uncertainty in modeling carbon emissions due primarily to data limitations."
- Only the best-documented brands and models are covered; the 55-inch figure is a commercial-display proxy; gaming desktops are undocumented and likely higher than office PCs.
- Assumed use periods differ (three, four, and seven years), which changes any per-hour spread.
- Manufacturing water is not quantified in these reports.
- An independent peer-reviewed review of variation in phone and tablet LCAs (Clément, Jacquemotte & Hilty, 2020, *Environmental Impact Assessment Review*, 84, 106416, <https://doi.org/10.1016/j.eiar.2020.106416>) could not be retrieved and has not been used.

Assumptions still to check:

- How long employees keep devices and how many hours per day they use them.
- Whether to count manufacturing at all in an activity-based calculator, since devices are owned anyway (the same methodology choice as in section 5; the user's decision).

### 10. Water (Alex; relevant to all profiles)

Evidence (see Source assessments S45–S51):

- AI's water use spans three scopes: on-site water evaporated for data-centre cooling (scope 1), off-site water used in generating the electricity (scope 2), and supply-chain water for manufacturing chips and servers (scope 3). Water withdrawal (water taken, much of it returned) differs from water consumption (water evaporated or otherwise removed); AI figures are usually consumption (S45).
- In the US, power-plant water far outweighs cooling water. US data centres directly consumed about 66 billion litres in 2023, while their indirect footprint through electricity was nearly 800 billion litres, about 12× larger; indirect intensity was 4.52 L/kWh for data centres against 4.35 L/kWh for US electricity overall, and average on-site water use was about 0.36 L/kWh (S46). Across 472 hyperscale sites, electricity-related water was about three-quarters of an operational total of about 300 GL per year (range 205–451) (S47).
- Location matters: direct cooling burdens concentrate in water-stressed western and south-central basins, while electricity-related burdens concentrate in a few eastern, fossil-heavy grid regions; three of 24 grid operators account for 59% of electricity-related water (S47). Community burden at ten US sites spans 0.2% to 134% of local utility capacity (S48).
- US average domestic use was 82 gallons (about 310 L) per person per day in 2015 (S49). This is delivered water, mostly returned through sewers, not consumption.
- Why earlier per-prompt water figures disagree: 0.26 mL counts on-site cooling only (S14); about 1–22 mL for a 300-word reply counts cooling plus power-plant water (EcoLogits, S9); 45 mL counts the full life cycle including manufacturing (S16). Because scope 2 is about 12× scope 1 in the US, leaving it out shrinks the figure by roughly an order of magnitude.
- Water Footprint Network definitions: green water is precipitation stored in the soil and used by plants; blue water is surface or groundwater that is evaporated, incorporated into a product, or returned elsewhere or later; grey water is the notional freshwater needed to dilute pollutants to water-quality standards. Beef averages about 15,000 L/kg, of which 93% is green, 4% blue, and 3% grey (S50). A smartphone's water footprint is about 3,190 gallons (about 12,100 L), mostly grey water (S51).

Consistency problem in the calculator's comparisons (for correction during implementation; the fix is the user's decision):

- AI water from EcoLogits is consumption for cooling and power (mainly blue water), but the everyday comparisons use whole-supply-chain footprints: a beef burger at about 1,700 L (15,400 L/kg), a smartphone at about 12,800 L, and a cup of coffee at about 140 L (`index.html`).
- The burger figure is about 93% green water; its blue share is about 70 L (derived from S50). The smartphone figure is mostly grey water, a notional dilution volume (S51). The coffee figure's composition was not checked.
- Comparing like with like (blue with blue) reduces the burger comparison by about 25×. Inconsistent accounting can make AI look trivial or significant depending on the pairing, which bears on the brief's neutrality requirement.

Limitations and contrary points:

- On-site intensity estimates disagree: S45 cites about 1–9 L/kWh evaporated (1 L/kWh for Google's global average, 9 L/kWh for an Arizona data centre in summer), while S46's modelled US average is about 0.36 L/kWh and notes some hyperscalers report 0.1–0.3 L/kWh for certain systems. This gap is unresolved.
- Power-plant water factors are grid averages that ignore renewable-energy contracts (S46 states this) and vary by county.
- Which data centre serves a given request is unknown to users, so AI water cannot honestly be localised to Los Angeles or anywhere else.
- S47 and S48 are preprints; S48 includes Shaolei Ren, co-author of S45 and a critic of Google's figures (S17).

Assumptions still to check:

- Whether water stress can be represented honestly without knowing data-centre locations, for example by explaining the geography qualitatively rather than as a number (the user's decision).
- The composition of the coffee water figure.

### 11. Trust and communication (Robin)

Evidence (see Source assessments S52–S58):

- Communicating uncertainty as numbers or ranges does not meaningfully damage trust. Across five experiments (n = 5,780), including a field experiment on BBC News, communicating uncertainty produced only a small decrease in trust in numbers and sources, mostly for verbal uncertainty (S52). A review of 48 experiments found quantified error ranges and probabilities had only positive or null effects, while negative effects came mostly from uncertainty framed as disagreement among scientists ("consensus uncertainty"); prior beliefs and worldviews moderated effects (S53). A 2026 meta-analysis of 28 studies found uncertainty communication neither systematically undermined nor enhanced trust in the source (S54).
- Verbal uncertainty terms are widely misread: people's numerical readings of IPCC terms such as "likely" deviated significantly from the IPCC's definitions even when the definitions were provided (S55).
- Disclosing a conflict of interest does not automatically produce appropriate trust: people do not discount biased advice as much as they should even after disclosure, and disclosure can lead advisors to exaggerate more (S56).
- Employees who perceive their company's sustainability communication as greenwashing show lower trust and loyalty (S57) and less green behaviour of their own (S58).

Implications for Robin's stated needs (for the user's judgement, not decisions):

- Show ranges as numbers rather than vague words; this is the best-supported finding and matches the earlier sections, where most figures are genuinely ranges.
- Present real disagreements between sources (for example Google and its critics, TikTok and Greenly, the CogVideoX figures) with an explanation of why they differ (boundaries and methods, as in sections 4 and 10), since unexplained disagreement is the form of uncertainty most linked to lost trust.
- Disclose funding (for example Netflix for S25, Publicis for S6, and the company's own role), but do not rely on disclosure alone; visible sources and methods probably matter more.
- An employer-provided tool starts with a credibility risk, which supports the brief's requirement that the calculator argue neither that AI is harmless nor that it is harmful.

Limitations:

- Most uncertainty experiments use fictitious scenarios and general audiences rather than employees using a company tool (S54).
- The greenwashing studies are cross-sectional surveys of employees in China and may not transfer to a US creative-media company.
- S56 studies advisors paid to bias estimates, a different situation from a company publishing a calculator.
- No study was found on employer-provided environmental calculators specifically.
- Robin is a fictional profile; these findings describe tendencies, not what any particular employee will think.

## Possible features

Generate several possibilities before choosing. Keep the initial notes brief. For each idea, record:

- what it would help someone learn or do
- the profiles or needs it would serve
- any evidence or implementation challenge that might affect it

Reviewed by the user on 2026-09-26. Tags: P = improves representation of professional AI use; D = connects AI use to broader digital life; X = cross-cutting candidate for the strongest remaining need. See Selected features for the user's choice.

1. **Image generation logging (P).** Log generated images by model type and settings (resolution, quality or steps) so they contribute to the day's total. Serves Alex. Challenge: only open-model figures exist (about 0.09–11.5 Wh per image); no commercial-model data; water must be derived (Audience needs §1).
2. **Video generation logging (P).** Log clips by tool, length, and resolution using EcoLogits' video methodology. Serves Alex. Challenge: commercial figures are estimates (for example Veo 3 about 20–43 Wh and Sora 2 Pro about 315–534 Wh per 8-second 720p clip); EcoLogits calculator outputs not yet checked against S5 (§2).
3. **Attempts per final output (P).** Record how many drafts or variations go into one finished image, clip, or task. Serves Alex and Jordan. Challenge: variation is well evidenced (up to 30× for coding tasks, S7), but the 70,000-video advertisement example is unverified; could be folded into ideas 1 and 2.
4. **Agent session and project estimator (P).** Estimate coding-agent sessions from their length and token composition (fresh input, cached input, output) and sum them across a project. Serves Jordan. Challenge: replaces the current output-only method (§3); cached-token energy is unknown and would need an explicit wide range.
5. **Digital day builder (D).** Enter hours of video calls, streaming, social media, and gaming by device (phone, laptop, TV, console, PC). Serves all three profiles. Challenge: the device dominates in every source (a TV uses about 90× a phone); social media and music streaming evidence is weak (§5–8).
6. **Device manufacturing spread over use (D).** Enter owned devices and how long they are kept to see manufacturing emissions per day of use. Serves all three profiles. Challenge: whether to count manufacturing at all is the user's methodology decision; gaming PCs are undocumented and the typical-TV figure is a proxy (§9).
7. **AI in the context of the whole digital day (D).** Show AI as a share of the user's total digital footprint, calculated from ideas 1–4 plus 5 (and 6). Serves all three profiles. Challenge: depends on idea 5; framing must not imply AI is trivial or dominant.
8. **Water boundary selector (X).** Switch between on-site cooling only, cooling plus power-plant water, and full life cycle, and see why per-prompt water varies more than 100×. Serves Alex and Robin. Challenge: well evidenced (§4, §10) but needs consistent definitions for every item.
9. **Like-for-like comparisons (X).** Compare against everyday items using matching definitions (for example blue water against blue water), correcting the current burger and smartphone mismatches. Serves Alex and Robin. Challenge: the correction approach is the user's decision; the coffee figure's composition is unchecked (§10).
10. **Ranges carried through every result (X).** Show every total as a numeric low–high range carried through all calculations rather than a single figure. Serves Robin and Jordan. Challenge: best-supported by the trust evidence (§11); requires a range for every input.
11. **"Why sources differ" and disclosure panel (X).** Beside each figure, show its boundary, method, funding, and any disagreement between sources. Serves Robin. Challenge: evidence favours explaining disagreement (§11); partly presentational, so it would need to affect the calculation (for example by choosing which source feeds the total) to count as a feature.
12. **Home grid region selector (D/X).** Choose a region (for example the Los Angeles, Austin, or Chicago grid) for the carbon from home-device use. Serves all three profiles. Challenge: not yet researched (US regional grid data not checked); cannot honestly localise the data centres serving AI requests.

Early observations (not choices): ideas 1–4 are the natural professional-AI candidates (3 could merge into 1 and 2); ideas 5 and 6 are the strongest digital-life candidates, with 7 depending on 5; ideas 8–11 address trust and consistent accounting, which appears to be the largest remaining gap, with 10 the best evidenced; idea 12 needs further research.

## Source assessments

For each source, record:

- the full citation and working link
- the claim or figure the project may use
- evidence checked directly
- important limitations or uncertainty
- confidence and decision: use, use with qualifications, or reject

Reviewed by the user on 2026-09-26, who accepted the decisions below; the user decided S15 and S29 directly.

### S1. Luccioni, Jernite & Strubell (2024)

- Citation: Luccioni, A. S., Jernite, Y., & Strubell, E. (2024). Power Hungry Processing: Watts Driving the Cost of AI Deployment? *Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency (FAccT '24)*. <https://arxiv.org/abs/2311.16863>
- Claim or figure: image generation used a median of 1.35 kWh, and a mean of 2.907 kWh (SD 3.31), per 1,000 inferences; the least efficient model (stable-diffusion-xl-base-1.0) used 11.49 kWh per 1,000.
- Evidence checked: figures read from the paper's text and Table 2 (arXiv HTML, v3).
- Limitations: open models from 2022–23; one NVIDIA A100 GPU on AWS, with idle power from the machine's other GPUs included; the authors state the results are not representative of all deployment contexts, including commercial systems.
- Proposed confidence and decision: moderate; use with qualifications (as an upper-range, older-model reference).

### S2. O'Donnell & Crownhart, MIT Technology Review (2025)

- Citation: O'Donnell, J., & Crownhart, C. (2025, May 20). We did the math on AI's energy footprint. Here's the story you haven't heard. *MIT Technology Review*. <https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/>; methodology: <https://www.technologyreview.com/2025/05/20/1116331/ai-energy-demand-methodology/>
- Claim or figure: Stable Diffusion 3 Medium (2B parameters), 1024×1024, 25 steps: about 1,141 J (0.32 Wh) of GPU energy, doubled to about 2,282 J (0.63 Wh) for non-GPU overhead; about 4,402 J (1.2 Wh) at 50 steps. Video (CogVideoX, measured by Sasha Luccioni with CodeCarbon): about 109,000 J (30 Wh) per video for an older 8 fps model, and about 3.4 million J (940 Wh) per 5-second, 16 fps video for a newer one.
- Evidence checked: article and methodology page read directly; image measurements by the ML.Energy team on an NVIDIA H100.
- Limitations: journalism rather than peer review; the doubling rule is one the methodology says is untested for diffusion models; unclear whether the 4,402 J figure is GPU-only or doubled; one open model per modality; the newer CogVideoX video figure is far higher than S4's figure for CogVideoX-5B and has not been reconciled.
- Proposed confidence and decision: moderate; use with qualifications.

### S3. Bertazzini et al. (2025)

- Citation: Bertazzini, G., Albisani, C., Baracchi, D., Shullani, D., & Verdecchia, R. (2025). The Hidden Cost of an Image: Quantifying the Energy Consumption of AI Image Generation. arXiv:2506.17016. <https://arxiv.org/abs/2506.17016>
- Claim or figure: median energy per image from 8.6 × 10⁻⁵ kWh (0.086 Wh, LCM_SSD_1B) to 4.08 × 10⁻³ kWh (4.08 Wh, Lumina) across 17 models, a 46× spread; doubling resolution raised energy 1.3–4.7×; prompt length had no significant effect.
- Evidence checked: figures read from the paper's text (arXiv HTML).
- Limitations: preprint, with no peer-reviewed version found; consumer NVIDIA RTX 4090 workstation rather than a data center; whole-system energy measured with CodeCarbon; excludes DALL·E and Midjourney.
- Proposed confidence and decision: moderate; use with qualifications.

### S4. Delavande, Pierrard & Luccioni (2025)

- Citation: Delavande, J., Pierrard, R., & Luccioni, S. (2025). Video Killed the Energy Budget: Characterizing the Latency and Power Regimes of Open Text-to-Video Models. arXiv:2509.19222 (workshop paper, "What Makes a Good Video: Next Practices in Video Generation and Evaluation"). <https://arxiv.org/abs/2509.19222>
- Claim or figure: total energy per video at default settings from about 0.14 Wh (AnimateDiff) to over 415 Wh (WAN2.1-T2V-14B), nearly 3,000×; CogVideoX-5B about 21.6 Wh GPU plus 3.7 Wh CPU and RAM. Energy scales quadratically with resolution and frame count and linearly with denoising steps; GPU is over 80% of energy.
- Evidence checked: figures read from Table 4 and the text (arXiv HTML, v1).
- Limitations: preprint (workshop paper); open models only, run with the Hugging Face codebase without production optimisations; one hardware platform (NVIDIA H100 SXM); audio and perceptual quality excluded.
- Proposed confidence and decision: moderate; use with qualifications (for scaling behaviour and the open-model range).

### S5. Jegham, Gamazaychikov & Luccioni (2026)

- Citation: Jegham, N., Gamazaychikov, B., & Luccioni, S. (2026). Lights, Camera, Carbon: Architectural Scaling Laws for Video Generation Energy Consumption. arXiv:2607.04553. <https://arxiv.org/abs/2607.04553>
- Claim or figure: estimated energy for one 8-second 720p video: Veo 3 19.8–43.4 Wh (mean 30.8), Seedance-1 72.1–87.9 Wh (mean 80.0), Gen-4.5 241.6–410.9 Wh (mean 322.0), Sora 2.0 Pro 315.1–534.4 Wh (mean 418.5); Sora 2.0 Pro about 1,313 Wh on average for a 12-second 1080p video.
- Evidence checked: figures read from section 4.4 and the limitations from section 5 (arXiv HTML, v1).
- Limitations: preprint; proprietary figures are inferred from API generation times and assumed hardware (for example TPU v6e for Veo), not measured; audio estimates are described as less well grounded; the authors note that decoding and some cost components are not fully captured. The Coca-Cola "70,000 videos" figure is cited from a news report and not verified here.
- Proposed confidence and decision: moderate to low for proprietary figures; use with qualifications, presented as ranges and labelled as estimates.

### S6. EcoLogits video generation methodology (2026)

- Citation: GenAI Impact / EcoLogits. (2026). Environmental Impacts of Video Generation (methodology) and AI Videos in EcoLogits (announcement, June 18, 2026). <https://ecologits.ai/latest/methodology/video_generation/>; <https://ecologits.ai/latest/blog/2026/06/18/video-impacts/>
- Claim or figure: per-video estimates of energy, carbon, water, and embodied impacts for commercial video models, computed as latency (regressions from S5) × whole-server power × PUE, with carbon from electricity-mix factors and water from the Li et al. (2025) WUE method, reported as intervals.
- Evidence checked: methodology page and announcement read directly. The EcoLogits calculator's outputs have not yet been run or compared with S5.
- Limitations: modelled rather than measured; attributes the whole server's power to each request with no batching allocation; water figures are derived; the work was produced with the GenAI footprint Alliance, a Publicis Groupe initiative with corporate members, which should be disclosed.
- Proposed confidence and decision: moderate; use with qualifications. It is consistent with the calculator's existing EcoLogits text data.

### S7. Bai et al. (2026)

- Citation: Bai, L., Huang, Z., Wang, X., Sun, J., Mihalcea, R., Brynjolfsson, E., Pentland, A., & Pei, J. (2026). How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks. arXiv:2604.22750. <https://arxiv.org/abs/2604.22750>
- Claim or figure: agentic coding consumes about 1,000× more tokens than code reasoning and code chat, with input tokens driving cost; runs on the same task differ by up to 30× in total tokens; higher token use does not mean higher accuracy; models underestimate their own token use.
- Evidence checked: abstract and relevant sections read (arXiv abstract page and HTML).
- Limitations: preprint; measures tokens and cost, not energy; SWE-bench Verified benchmark tasks; eight models, some already superseded.
- Proposed confidence and decision: moderate; use with qualifications (for session structure and variability, not energy).

### S8. Couch (2026)

- Citation: Couch, S. P. (2026, January 20). Electricity use of AI coding agents. *Simon P. Couch* (personal blog). <https://simonpcouch.com/blog/2026-01-20-cc-impact/>
- Claim or figure: median Claude Code session of 24 requests and 592,439 tokens, estimated at about 41 Wh; median working day about 1,300 Wh; derived rates of about 390 Wh per million input tokens, 1,950 output, 490 cache write, and 39 cache read.
- Evidence checked: full post read directly.
- Limitations: the author calls it "napkin math"; one user, mostly one model (Opus 4.5); per-token energy derived from Epoch AI's GPT-4o estimate (S10) and scaled by API prices on the assumption that energy tracks price; deliberately pessimistic long-context rates; the author says he has "no idea" whether the cache rates are reasonable; not peer reviewed.
- Proposed confidence and decision: low for energy figures; use only as an illustrative worked example of session structure.

### S9. EcoLogits LLM inference methodology

- Citation: GenAI Impact / EcoLogits. Environmental Impacts of LLM Inference (methodology). <https://ecologits.ai/latest/methodology/llm_inference/>
- Claim or figure: GPU energy per request is estimated as the number of output tokens × energy per output token (a function of active parameters, batch size fixed at 64); input tokens are not modelled; only text-to-text generation is covered.
- Evidence checked: methodology and "Assumptions and limitations" sections read directly.
- Limitations: this is the source of the calculator's existing figures; output-only modelling does not fit input-dominated agent sessions; parameter counts for closed models are estimated.
- Proposed confidence and decision: moderate; continue to use for text, with its output-only limitation disclosed for agent sessions.

### S10. You, Epoch AI (2025)

- Citation: You, J. (2025). How much energy does ChatGPT use? *Epoch AI, Gradient Updates*. <https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use>
- Claim or figure: a typical GPT-4o query uses about 0.3 Wh; about 2.4–2.5 Wh with a 10,000-token input and almost 40 Wh with a 100,000-token input; prefill cost scales roughly quadratically for long inputs; because of the KV cache, input processing is an upfront cost not repeated on each turn.
- Evidence checked: article and appendix text read directly.
- Limitations: a compute model with assumed parameter count, hardware, and utilisation rather than a measurement; self-described as somewhat pessimistic; the author notes input-cost scaling can almost certainly be improved in practice; GPT-4o only.
- Proposed confidence and decision: moderate; use with qualifications as one end of an input-cost range.

### S11. Jegham, Abdelatti, Koh, Elmoubarki & Hendawi (2025)

- Citation: Jegham, N., Abdelatti, M., Koh, C. Y., Elmoubarki, L., & Hendawi, A. (2025). How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference. arXiv:2505.09598 (v6, November 24, 2025). <https://arxiv.org/abs/2505.09598>
- Claim or figure: per-query energy for three prompt sizes; for example GPT-4.1 uses 0.871 Wh (100 input, 300 output tokens), 3.161 Wh (1,000 input, 1,000 output), and 4.833 Wh (10,000 input, 1,500 output).
- Evidence checked: abstract and results table read (arXiv abstract page and HTML).
- Limitations: preprint; inferred from public API latency and throughput with assumed hardware and environmental multipliers, not metered; the prompt sizes change input and output together, so input cost cannot be fully isolated.
- Proposed confidence and decision: moderate to low; use with qualifications as one end of an input-cost range.

### S12. Background sources on inference energy mechanisms

- Chung, J.-W., Wu, R., Ma, J. J., & Chowdhury, M. (2026). Where Do the Joules Go? Diagnosing Inference Energy Consumption. arXiv:2601.22076 (ML.ENERGY Leaderboard v3.0). <https://arxiv.org/abs/2601.22076> — 46 models, 1,858 configurations on H100 and B200; LLM task type can cause 25× energy differences.
- Vellaisamy, P., Lam, V., Blanton, S., & Shen, J. P. (2026). Characterization of Request and Token Energy Costs for LLM Inference Workloads on GPU Platforms. *IISWC 2026* (accepted). arXiv:2608.28044. <https://arxiv.org/abs/2608.28044> — longer outputs reduced energy per token from 7.46 to 0.72 J/token while total energy rose from 1.19 to 5.93 kJ (Llama-3.2-1B, H200).
- Tian, Y., Sun, D., Ding, Y., & Liu, S. (2025). Cache Your Prompt When It's Green: Carbon-Aware Caching for Large Language Model Serving. arXiv:2505.23970. <https://arxiv.org/abs/2505.23970> — caching reduces operational carbon by avoiding recomputation but adds embodied carbon from storage.
- Evidence checked: abstracts and relevant passages read directly.
- Limitations: small or open models; none gives per-token energy for frontier cloud models or cached tokens.
- Proposed confidence and decision: use as background on mechanisms only, not for calculator figures.

### S13. Rejected: "cache hits use 90% less energy"

- Source: a claim attributed to an Introl blog post (<https://introl.com/blog/prompt-caching-infrastructure-llm-cost-latency-reduction-guide-2025>), seen only in a search-result summary.
- Evidence checked: the page could not be retrieved in readable form, and no primary measurement behind the claim was found.
- Proposed decision: reject. It is an unsupported vendor claim that matches API pricing rather than measured energy.

### S14. Elsworth et al., Google (2025)

- Citation: Elsworth, C., Huang, K., Patterson, D., Schneider, I., Sedivy, R., Goodman, S., Townsend, B., Ranganathan, P., Dean, J., Vahdat, A., Gomes, B., & Manyika, J. (2025). Measuring the environmental impact of delivering AI at Google Scale. arXiv:2508.15734. <https://arxiv.org/abs/2508.15734>
- Claim or figure: the median Gemini Apps text prompt (May 2025) uses 0.24 Wh, emits 0.03 gCO₂e, and consumes 0.26 mL of water; a narrower "existing approach" gives 0.10 Wh, 0.01 gCO₂e, and 0.15 mL; energy per median prompt fell 33× and carbon 44× over one year.
- Evidence checked: abstract, methodology, boundary, and Table 2 read (arXiv abstract page and HTML).
- Limitations: company self-report, not peer reviewed at publication; median across models rather than per model; market-based carbon; water limited to on-site cooling; excludes training, external networking, and user devices; Gemini only.
- Proposed confidence and decision: moderate; use with qualifications, stating its boundaries explicitly.

### S15. Altman (2025)

- Citation: Altman, S. (2025, June). The Gentle Singularity. *Sam Altman* (personal blog). <https://blog.samaltman.com/the-gentle-singularity>
- Claim or figure: the average ChatGPT query uses about 0.34 Wh and about 0.000085 gallons (about 0.32 mL) of water.
- Evidence checked: post read directly.
- Limitations: no method, boundary, model, or query definition given; statement by a company CEO.
- Confidence and decision: low; use only as a stated company claim without a published method (decided by the user on 2026-09-26).

### S16. Mistral AI life-cycle analysis (2025)

- Citation: Mistral AI. (2025, July 22). Our contribution to a global environmental standard for AI. <https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai>
- Claim or figure: marginal inference impact of Le Chat for a 400-token response, excluding user devices: 1.14 gCO₂e, 45 mL of water, and 0.16 mg Sb eq; training and 18 months of use: 20.4 ktCO₂e and 281,000 m³ of water.
- Evidence checked: announcement read directly; conducted with Carbone 4 and ADEME and reviewed by the consultancies Resilio and Hubblo.
- Limitations: company-commissioned; full life-cycle boundary including upstream manufacturing, so not comparable with operational-only figures; no energy (Wh) figure given; one provider and model.
- Proposed confidence and decision: moderate; use with qualifications as the full life-cycle comparison point.

### S17. Criticism of Google's figures (2025)

- Citation: Kask, K. (2025, August 22). Experts are skeptical about Google's AI water consumption claims. *PCWorld*. <https://www.pcworld.com/article/2886730/experts-are-skeptical-about-googles-ai-water-consumption-claims.html> (reporting on coverage in *The Verge*).
- Claim or figure: experts, including Shaolei Ren (UC Riverside), argue that Google's figures omit power-plant water and use only market-based carbon.
- Evidence checked: PCWorld article read directly; the original Verge article could not be retrieved, so the quotation is secondhand.
- Limitations: secondary news coverage; the critics' own estimates use different boundaries.
- Proposed confidence and decision: moderate; use as documented disagreement, not as a figure.

### S18. Obringer et al. (2021)

- Citation: Obringer, R., Rachunok, B., Maia-Silva, D., Arbabzadeh, M., Nateghi, R., & Madani, K. (2021). The overlooked environmental footprint of increasing Internet use. *Resources, Conservation and Recycling*, 167, 105389. <https://doi.org/10.1016/j.resconrec.2020.105389>
- Claim or figure: one hour of videoconferencing or streaming emits 150–1,000 g CO₂ and requires 2–12 litres of water; turning the camera off reduces these footprints by 96%.
- Evidence checked: figures and citation confirmed through the Purdue University press release (<https://www.sciencedaily.com/releases/2021/01/210114134033.htm>); the paper itself was not accessible.
- Limitations: per-gigabyte method criticised by S19; network intensity of 0.06 kWh/GB (a 2015 value) against the IEA's 0.002 kWh/GB (S20); excludes user devices; the 96% camera-off figure is contradicted by S23 and S24.
- Proposed confidence and decision: low; reject the figures for calculator use, or cite only as a widely quoted claim that later evidence disputes.

### S19. Mytton, Lundén & Malmodin (2024)

- Citation: Mytton, D., Lundén, D., & Malmodin, J. (2024). Network energy use not directly proportional to data volume: The power model approach for more reliable network energy consumption calculations. *Journal of Industrial Ecology*, 28(4), 966–980. <https://doi.org/10.1111/jiec.13512>
- Claim or figure: network energy consumption is not proportional to data volume; simple kWh-per-GB intensity calculations are insufficient for estimating real-world network energy; the power model is a more reliable alternative.
- Evidence checked: citation and abstract confirmed through Crossref metadata; the publisher page could not be retrieved.
- Limitations: methodological argument rather than a per-activity figure; only the abstract was read.
- Proposed confidence and decision: high for the methodological point; use.

### S20. Mytton, blog notes on Obringer et al.

- Citation: Mytton, D. Paper Notes: The overlooked environmental footprint of increasing Internet use. *David Mytton* (blog). <https://davidmytton.blog/paper-notes-the-overlooked-environmental-footprint-of-increasing-internet-use/>
- Claim or figure: S18 used 0.06 kWh/GB for networks against the IEA's 0.002 kWh/GB, and a data-centre intensity of 0.01 kWh/GB whose source could not be traced.
- Evidence checked: post read directly.
- Limitations: blog post; the author co-wrote S19, so not independent.
- Proposed confidence and decision: background only.

### S21. Kamiya, IEA (2020)

- Citation: Kamiya, G. (2020, December 10). The carbon footprint of streaming video: fact-checking the headlines. IEA. <https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines>
- Claim or figure: one hour of streaming video in 2019 typically used about 0.077 kWh (central estimate 36 gCO₂ after an 11 December 2020 update); a 50-inch LED television uses about 100× a smartphone's electricity and about 5× a laptop's; production accounts for about 80% of lifecycle carbon for mobile devices and about a third for televisions.
- Evidence checked: read from an Internet Archive copy (<https://web.archive.org/web/2025/https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines>) because the live page presented a bot check.
- Limitations: 2019 data; commentary rather than peer-reviewed; about streaming, not video calls.
- Proposed confidence and decision: moderate; use with qualifications for device comparisons (and for activity 6, streaming).

### S22. Jones & Zhu, CableLabs (2021)

- Citation: Jones, D., & Zhu, J. (2021, May 6). Hourly Data Consumption of Popular Video Conferencing Applications. CableLabs. <https://www.cablelabs.com/blog/hourly-data-consumption-of-popular-video-conferencing-applications>
- Claim or figure: video conferences used from 0.5 to 3.4 GB per hour depending on the app (Google Meet, GoToMeeting, Microsoft Teams, Zoom), under the same setup.
- Evidence checked: post read directly.
- Limitations: industry lab test on one cable network in 2021; data volume only, not energy.
- Proposed confidence and decision: moderate; use for data volume only.

### S23. Greenspector (2022)

- Citation: Greenspector. (2022, September 6). The impact of our videoconferencing uses on mobile and PC! 2022 edition. <https://greenspector.com/en/videoconferencing-apps-2022/>
- Claim or figure: across 10 apps, one minute of audio-only conferencing on a phone used 6.68 mAh against 14.29 mAh with cameras on (about 2.1×); 61% of carbon came from the user device; the average across apps was about 0.66 gCO₂e per minute.
- Evidence checked: post read directly.
- Limitations: commercial consultancy; one-to-one calls in one-minute tests; methodology not fully published; Android 8 phone and one PC.
- Proposed confidence and decision: moderate to low; use with qualifications.

### S24. Mortas (2025)

- Citation: Mortas, F. (2025). Assessing the Carbon Footprint of Virtual Meetings: A Quantitative Analysis of Camera Usage. arXiv:2601.06045 (short paper accepted at IARIA GREEN 2025). <https://arxiv.org/abs/2601.06045>
- Claim or figure: turning the camera off can halve data consumption and associated emissions, particularly on mobile networks; this challenges prevalent claims.
- Evidence checked: abstract and metadata read (arXiv abstract page).
- Limitations: four-page short paper by one author; one phone on 4G; measures data and derives emissions per data volume, the approach S19 criticises.
- Proposed confidence and decision: low to moderate; use with qualifications as contrary evidence on the camera-off claim, not as a figure.

### S25. Carbon Trust (2021)

- Citation: Carbon Trust. (2021, June). *Carbon impact of video streaming* (white paper). <https://www.carbontrust.com/sites/default/files/documents/resource/public/Carbon-impact-of-video-streaming.pdf>; announcement (June 11, 2021): <https://www.carbontrust.com/news-and-insights/news/updated-calculation-released-on-the-carbon-impact-of-online-video-streaming>
- Claim or figure: European average for 2020 of about 188 Wh and about 55 gCO₂e per hour of video streaming (conventional approach), split into data centres about 1 Wh, network 20 Wh, home routers 71 Wh, and end-user devices 96 Wh; a 50-inch TV's device footprint is about 4.5× a laptop's and about 90× a smartphone's.
- Evidence checked: the full 102-page white paper was read (text extracted from the PDF) along with the announcement.
- Limitations: seed-funded by Netflix through DIMPACT; conventional average-allocation method, which the authors say does not suit estimating the effect of changing viewing; operational electricity only; European grid and device mix for 2020; the authors warn the figures are not representative of any given scenario.
- Proposed confidence and decision: moderate; use with qualifications as the main video-streaming source, disclosing the funding and explaining the router allocation.

### S26. Spotify Equity & Impact Reports (2023 and 2024)

- Citation: Spotify. (2024). *Equity & Impact Report 2023*. <https://www.lifeatspotify.com/reports/Spotify-Equity-Impact-Report-2023.pdf>; Spotify. (2025). *Equity & Impact Report 2024*. <https://s29.q4cdn.com/175625835/files/doc_governance/2025/Mar/10/Spotify-Equity-Impact-Report-2024-9b1865.pdf>
- Claim or figure: from 2023, Spotify excludes Scope 3 Category 11 ("use of sold products"), which it describes as covering "the end user's device energy usage, app downloads, and data transfer energy usage," because of a lack of accepted methods; "Previously reported 2022 end-use emissions were 103,920 tCO₂e." The 2024 report keeps the exclusion.
- Evidence checked: both full reports read (text extracted from the PDFs).
- Limitations: company self-report; gives no listening hours or method for the 2022 end-use total, so no per-hour figure can be derived.
- Proposed confidence and decision: moderate; use with qualifications for the reporting change and the 2022 total, not for a per-hour figure.

### S27. Greenly (2025)

- Citation: Anderson, K. (2025, February 14). The Carbon Cost of Streaming. *Greenly*. <https://greenly.earth/en-us/leaf-media/data-stories/the-carbon-cost-of-streaming>
- Claim or figure: platform-level streaming emissions based on the S25 figure; states that Spotify's latest emissions report no longer accounts for user-device electricity (confirmed by S26).
- Evidence checked: page read directly; the widely reported figure of 1.037 gCO₂e per hour of Spotify listening could not be located on it.
- Limitations: commercial carbon-accounting company's "data story" by a copywriter; derived estimates rather than measurements.
- Proposed confidence and decision: low; reject for figures.

### S28. Boon, The Conversation (2025)

- Citation: Boon, H. (2025, July 25). As Spotify moves to video, the environmental footprint of music streaming hits the high notes. *The Conversation*. <https://theconversation.com/as-spotify-moves-to-video-the-environmental-footprint-of-music-streaming-hits-the-high-notes-259939>
- Claim or figure: video streaming is about 50× audio streaming in carbon; relays S25's 55 gCO₂e per hour and country figures.
- Evidence checked: article read directly; author is a Principal Lecturer in Music at the University of Westminster with no declared conflicts.
- Limitations: commentary relaying others' figures, not original measurement; the source of the "50×" comparison was not traced.
- Proposed confidence and decision: background only.

### S29. Greenspector social networking study (2023)

- Citation: Greenspector. (2023, June 21). What is the environmental footprint of social networking applications? 2023 Edition. <https://blog.greenspector.com/en/what-is-the-environmental-footprint-of-social-networking-applications-2023/>; methodology: <https://blog.greenspector.com/en/environmental-footprint-methodology/>
- Claim or figure: one minute of feed scrolling on a Samsung Galaxy S10 (Android 10, Wi-Fi, 50% brightness, at least three runs): LinkedIn 0.47, Twitch 0.51, Twitter 0.52, Facebook 0.63, Snapchat 0.65, Pinterest 0.66, Instagram 0.87, YouTube 0.87, Reddit 0.92, and TikTok 0.96 gCO₂e.
- Evidence checked: study page and methodology page read directly.
- Limitations: commercial consultancy; network and server impacts modelled with unpublished factors and a "100% worldwide" server-location assumption; includes device manufacturing through battery wear; methodology reviewed by the consultancy EVEA but not published in a journal; one phone, one-minute tests.
- Confidence and decision: low; reject (decided by the user on 2026-09-26).

### S30. Greenspector social media study (2021) — unverifiable

- Citation: Greenspector. (2021). What is the environmental footprint for social media applications? 2021 Edition. <https://blog.greenspector.com/en/social-media-2021/>
- Claim or figure: reported in search results as about 2.63 gCO₂e per minute for TikTok and an average of about 1.15 g across ten apps.
- Evidence checked: the page returns 404, has no Internet Archive copy, and the figures could not be verified.
- Proposed decision: reject.

### S31. Greenly TikTok estimate, reported by Fortune (2024)

- Citation: Lake, S. (2024, December 13). Doomscrolling has reportedly made TikTok's annual carbon footprint almost the same as the entire country of Greece. *Fortune*. <https://fortune.com/2024/12/13/tiktok-carbon-footprint-emissions-doomscrolling-greece-greenly>
- Claim or figure: one minute on TikTok emits 2.921 gCO₂e; TikTok's annual emissions are nearly equal to Greece's; TikTok responded that ByteDance's 2023 total emissions were "less than 20% of the estimated emissions by Greenly."
- Evidence checked: article read directly (Greenly's underlying analysis not read).
- Limitations: news report of a commercial consultancy's estimate; method not published in detail; directly disputed by the platform.
- Proposed confidence and decision: low; use only as a documented, disputed claim.

### S32. Meta 2025 Sustainability Report and Environmental Data Index

- Citation: Meta. (2025). *2025 Sustainability Report* <https://sustainability.atmeta.com/asset/2025-sustainability-report/> and *2025 Environmental Data Index* <https://sustainability.atmeta.com/asset/2025-environmental-data-index/>
- Claim or figure: for 2024, electricity intensity of 0.0055 MWh per daily active person, market-based Scope 1 and 2 GHG intensity of 0.000015 tCO₂e per daily active person, total electricity of 18,423,634 MWh (data centres 18,061,781 MWh), and location-based total emissions of 15,627,509 tCO₂e; Scope 3 Category 11 (17,521 tCO₂e) covers Meta's augmented and virtual reality consumer hardware.
- Evidence checked: both full PDFs read (text extracted); per-person figures cross-checked against totals, implying about 3.35 billion daily active people. An independent accountants' review report is published alongside but was not read.
- Limitations: company self-report; per-person yearly average across all Meta workloads, not per hour of use; excludes users' devices and networks; market-based carbon reduced by renewable matching; the per-person water metric's units could not be reconciled.
- Proposed confidence and decision: moderate; use with qualifications for the data-centre share only, labelled as a per-person yearly average.

### S33. Sony Interactive Entertainment, PlayStation Energy Efficiency page

- Citation: Sony Interactive Entertainment. Energy Efficiency (Legal; statement under the UK Games Console Voluntary Agreement). PlayStation.com. <https://www.playstation.com/en-gb/legal/ecodesign/>
- Claim or figure: PS5 CFI-21 and CFI-71: active gaming (average of three PS5 games) 213.25–219.2 W depending on model and resolution; PS4 games 88.4–110.2 W; home menu 43.4–47.06 W; low-power rest 0.30 W; tested 02/05/2026 on Death Stranding 2, Demon's Souls, and COD Black Ops 7.
- Evidence checked: page read directly. The calculator's existing link (`https://www.playstation.com/en-us/legal/ecodesign/`) returns 404 and should be replaced.
- Limitations: manufacturer self-test; specific titles; excludes the display.
- Proposed confidence and decision: moderate to high; use with qualifications, replacing the calculator's dead link.

### S34. Mills et al. (2019)

- Citation: Mills, E., Bourassa, N., Rainer, L., Mai, J., Shehabi, A., & Mills, N. (2019). Toward Greener Gaming: Estimating National Energy Use and Energy Efficiency Potential. *The Computer Games Journal*, 8, 157–178. <https://doi.org/10.1007/s40869-019-00084-2>
- Claim or figure: 26 gaming systems measured; energy varied as widely by which of 37 game titles or 11 benchmarks was run as by hardware; cloud gaming energy in data centres and networks is markedly higher than local gaming; US gaming is 34 TWh per year (2.4% of residential electricity) and 24 MtCO₂ per year.
- Evidence checked: abstract and article metadata read on the publisher's page (paywalled; full text not read). Funded by the California Energy Commission; authors declare no conflicts.
- Limitations: 2017–18 hardware; US only; only the abstract was read.
- Proposed confidence and decision: moderate; use with qualifications.

### S35. Mills & Mills (2016)

- Citation: Mills, N., & Mills, E. (2016). Taming the energy use of gaming computers. *Energy Efficiency*, 9, 321–338. <https://doi.org/10.1007/s12053-015-9371-1>
- Claim or figure: the typical gaming computer including display uses about 1,400 kWh per year; intensive users could easily use double; measured peak power is about 50% below nameplate for complete systems.
- Evidence checked: abstract read on the publisher's page (paywalled; full text not read).
- Limitations: five measured PCs with circa-2015 components; yearly figure whose assumed hours of use were not visible in the abstract.
- Proposed confidence and decision: moderate for the nameplate finding; low to moderate for the yearly figure as a current value; use with qualifications.

### S36. Pérez et al. (2024)

- Citation: Pérez, C., Verón, J., Pérez, F., Moraga, M. Á., Calero, C., & Cetina, C. (2024). A Comparative Analysis of Energy Consumption Between the Widespread Unreal and Unity Video Game Engines. arXiv:2402.06346. <https://arxiv.org/abs/2402.06346>
- Claim or figure: average power while playing *Baldur's Gate 3* was 358.6 W for the game alone, with background processes removed, measured with a hardware meter (the EET device of the FEETINGS framework).
- Evidence checked: paper text read (arXiv HTML, v2).
- Limitations: preprint; one game on one test PC whose specification was not located; baseline subtracted and monitor excluded, so a real player's total is higher; the figure appears in the introduction rather than the main study.
- Proposed confidence and decision: low to moderate; use with qualifications as one measured data point.

### S37. Hazas et al. (2026)

- Citation: Hazas, M., Dalli, K. C., Menon, A., Abraham, B., & Nordgren, O. (2026). Hot Games: Towards a Holistic Assessment of the Planet Warming Emissions of Video Games based on 2024–2025 Data. arXiv:2608.19040. <https://arxiv.org/abs/2608.19040>
- Claim or figure: a weighted average PC gaming power of 305.1 W from the Sustainable Games Alliance's Steam hardware model (Steam Hardware Survey combined with component TDPs); cloud-gaming delivery taken as the Carbon Trust's streaming figure increased by 50% for higher bandwidth.
- Evidence checked: abstract and relevant sections read (arXiv HTML).
- Limitations: preprint; PC power modelled from rated TDPs rather than measured; monitor excluded; bandwidth-based cloud adjustment conflicts with S19.
- Proposed confidence and decision: low to moderate; use with qualifications as a modelled estimate that may run high.

### S38. Berkeley Lab Green Gaming: Cloud Gaming

- Citation: Lawrence Berkeley National Laboratory. Cloud Gaming. *Green Gaming*. <https://greengaming.lbl.gov/cloud-gaming>
- Claim or figure: cloud gaming requires significantly more energy than similarly powerful home equipment, up to three times as much in the most extreme cases, because of data-centre ventilation and cooling plus network energy.
- Evidence checked: page read directly.
- Limitations: summary web page of the S34 research group; testing dates from about 2017–2019.
- Proposed confidence and decision: moderate; use with qualifications.

### S39. Apple, iPhone 17 Product Environmental Report (2025)

- Citation: Apple. (2025, September). *iPhone 17 Product Environmental Report*. <https://www.apple.com/environment/pdf/products/iphone/iPhone_17_PER_Sept2025.pdf>
- Claim or figure: 55 kgCO₂e (256GB) and 61 kgCO₂e (512GB); breakdown for 256GB: production materials and processes 53%, production electricity 23%, charging 18%, transportation 4%, renewable energy emissions 1%, end-of-life 0%; assumes three years of use.
- Evidence checked: full report read (text extracted from the PDF).
- Limitations: manufacturer self-report under ISO 14040/14044/14067; Apple acknowledges inherent modelling uncertainty; one model.
- Proposed confidence and decision: moderate; use with qualifications.

### S40. Apple, MacBook Air with M4 Product Environmental Report (2025)

- Citation: Apple. (2025, March). *MacBook Air with M4 Product Environmental Report*. <https://www.apple.com/environment/pdf/products/notebooks/M4_MacBook_Air_PER_March2025.pdf>
- Claim or figure: MacBook Air 15-inch with M4 (512GB SSD): 155 kgCO₂e total; production 71%, transportation 3%, product use 25%, end-of-life under 1%; four years of use.
- Evidence checked: full report read (text extracted from the PDF).
- Limitations: manufacturer self-report; one configuration; Apple laptops may not represent other brands.
- Proposed confidence and decision: moderate; use with qualifications.

### S41. devera.ai laptop LCA benchmark (2026)

- Citation: devera.ai. (2026, March 14, last updated). Carbon Footprint of a Laptop: LCA Benchmark (10,000 Simulations). <https://devera.ai/benchmarks/carbon-footprint-of-a-laptop>
- Claim or figure: median 215.1 kgCO₂e per laptop cradle-to-grave; P10–P90 157.9–286.7 kg; based on Ecoinvent 3.9.1 background data.
- Evidence checked: page read directly. The calculator currently cites this page for "≈ 250 kg", which no longer matches.
- Limitations: commercial LCA-software vendor; model and input assumptions not fully published.
- Proposed confidence and decision: low to moderate; use with qualifications for the laptop range.

### S42. Samsung, QLED Q60C Product Environmental Report (2023)

- Citation: Samsung Electronics. (2023, December 28). *QLED Q60C Product Environmental Report*. <https://www.samsung.com/global/sustainability/media/pdf/TV_QLED_Environmental_Report_EN.pdf>
- Claim or figure: QLED 75Q60C life-cycle emissions 982 kgCO₂eq: production 70.4%, use 26.5%, distribution 2.0%, disposal 1.0%; seven years of use; distribution from Hungary to the UK; calculated by the Carbon Trust under PAS 2050:2011.
- Evidence checked: full report read (text extracted from the PDF).
- Limitations: manufacturer report; a 75-inch model, larger than typical; UK use and grid assumptions.
- Proposed confidence and decision: moderate; use with qualifications as a large-TV example.

### S43. Samsung, UHD Signage QMC Product Environmental Report (2025)

- Citation: Samsung Electronics. (2025). *UHD Signage QMC Product Environmental Report*. <https://www.samsung.com/global/sustainability/landing_hub-file/AY_wFeS6BzIALYNu/Signage_QMC_Environmental_Report_EN_2503.pdf>
- Claim or figure: Signage QM55C (55-inch) life-cycle emissions 1,691 kgCO₂eq: use 76.9%, production 21.9%, distribution 0.9%, disposal 0.3%; implies about 370 kg from production (derived).
- Evidence checked: report read (text extracted from the PDF); calculated by the Carbon Trust.
- Limitations: commercial signage display designed for long operating hours and high brightness, not a consumer TV; the production figure is derived from percentages.
- Proposed confidence and decision: low to moderate; use with qualifications only as a proxy for a typical-size TV's manufacturing footprint.

### S44. Dell, OptiPlex Tower Plus 7020 Life Cycle Assessment (2024)

- Citation: Dell Technologies. (2024, August). *Life Cycle Assessment: OptiPlex Tower Plus 7020*. <https://www.delltechnologies.com/asset/en-us/products/desktops-and-all-in-ones/technical-support/optiplex-tower-plus-7020-pcf-report.pdf>
- Claim or figure: total carbon footprint 198 kgCO₂e (EU use baseline, excluding end-of-life credits); four-year lifetime; 47.2 kWh per year; Core i3-14100, 8 GB RAM, 256 GB SSD; graphics card 14% of manufacturing; a previously stated 257 kg was corrected as a calculation error.
- Evidence checked: full three-page report read (text extracted from the PDF).
- Limitations: manufacturer report from a parametric modelling tool; office PC rather than gaming PC; monitor excluded.
- Proposed confidence and decision: moderate for office desktops; use with qualifications, noting that gaming desktops are undocumented.

### S45. Li, Yang, Islam & Ren (2025)

- Citation: Li, P., Yang, J., Islam, M. A., & Ren, S. (2025). Making AI Less "Thirsty": Uncovering and Addressing the Secret Water Footprint of AI Models. *Communications of the ACM*, 68(7), 54–61. <https://doi.org/10.1145/3724499>; preprint: <https://arxiv.org/abs/2304.03271>
- Claim or figure: AI water use spans scope 1 (on-site cooling), scope 2 (electricity generation), and scope 3 (manufacturing); definitions of withdrawal and consumption; data centres evaporate about 1–9 L per kWh of server energy (1 L/kWh for Google's annualised global average, 9 L/kWh for a large commercial data centre in Arizona in summer); US electricity water intensity of 3.14 L/kWh used as a conservative factor.
- Evidence checked: preprint text read (arXiv HTML); publication in CACM confirmed through Crossref.
- Limitations: estimates rather than measurements; the 1–9 L/kWh range conflicts with S46's modelled average; lead author Ren is a prominent critic of company disclosures (S17).
- Proposed confidence and decision: moderate to high for definitions; moderate for figures; use.

### S46. Shehabi et al., Berkeley Lab (2024)

- Citation: Shehabi, A., Smith, S. J., Hubbard, A., Newkirk, A., Lei, N., Siddik, M. A. B., Holecek, B., Koomey, J., Masanet, E., & Sartor, D. (2024). *2024 United States Data Center Energy Usage Report*. Lawrence Berkeley National Laboratory. <https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf>
- Claim or figure: US data centres used about 176 TWh in 2023 (4.4% of US electricity); directly consumed about 66 billion litres of water; indirect water through electricity nearly 800 billion litres; indirect intensity 4.52 L/kWh (US electricity overall 4.35 L/kWh); average on-site WUE just over 0.36 L/kWh through 2023.
- Evidence checked: full report read (text extracted from the PDF).
- Limitations: modelled estimates; indirect factors ignore power purchase agreements and on-site generation (stated by the authors); US only.
- Proposed confidence and decision: high; use.

### S47. Guidi & Dominici (2026)

- Citation: Guidi, G., & Dominici, F. (2026). The Hidden Water Geography of U.S. Hyperscale Data Centers in the AI Era. arXiv:2607.02531. <https://arxiv.org/abs/2607.02531>
- Claim or figure: across 472 US hyperscale facilities, operational water consumption is about 300 GL per year (range 205–451), with electricity-related water about three-quarters; cooling burdens concentrate in stressed western and south-central basins and electricity-related burdens in a few eastern fossil-heavy grid regions; 3 of 24 balancing authorities account for 59% of electricity-related water.
- Evidence checked: abstract read (arXiv abstract page).
- Limitations: preprint; modelled; only the abstract was read.
- Proposed confidence and decision: moderate; use with qualifications.

### S48. Akinade, Amanambu, Frame & Ren (2026)

- Citation: Akinade, B. A., Amanambu, A. C., Frame, J. M., & Ren, S. (2026). AI Data Centers and the Water Use Feedback Loop. arXiv:2606.21760. <https://arxiv.org/abs/2606.21760>
- Claim or figure: community-scale burden of data-centre water use across ten US sites spans 0.2% to 134% of host utility capacity.
- Evidence checked: abstract read (arXiv abstract page).
- Limitations: preprint review; ten sites; only the abstract was read; includes the lead author of S45.
- Proposed confidence and decision: background only.

### S49. Dieter & Maupin, USGS (2017)

- Citation: Dieter, C. A., & Maupin, M. A. (2017). *Public Supply and Domestic Water Use in the United States, 2015* (Open-File Report 2017–1131). U.S. Geological Survey. <https://pubs.usgs.gov/of/2017/1131/ofr20171131.pdf>
- Claim or figure: national average total domestic per capita use was 82 gallons per capita per day in 2015 (down from 88 in 2010), ranging from 35 (Connecticut) to 184 (Idaho).
- Evidence checked: report read (text extracted from the PDF).
- Limitations: 2015 data; delivered water rather than consumption, so not directly comparable with AI consumption figures.
- Proposed confidence and decision: high for what it measures; use with qualifications.

### S50. Water Footprint Network, "What is a water footprint?"

- Citation: Water Footprint Network. What is a water footprint? <https://www.waterfootprint.org/water-footprint-2/what-is-a-water-footprint/>
- Claim or figure: definitions of green, blue, and grey water footprints; one kilogram of beef requires about 15,000 litres (93% green, 4% blue, 3% grey), with large variation by production system.
- Evidence checked: page read directly.
- Limitations: advocacy and standards organisation; global averages.
- Proposed confidence and decision: high for definitions; moderate for the beef figure; use.

### S51. GRACE Communications, Water Footprint Calculator: "The Hidden Water in Everyday Products"

- Citation: GRACE Communications Foundation. The Hidden Water in Everyday Products. *Water Footprint Calculator*. <https://watercalculator.org/footprint/the-hidden-water-in-everyday-products/>
- Claim or figure: a smartphone's production water footprint is an estimated 3,190 gallons, with the grey water footprint making up the largest portion.
- Evidence checked: page read directly (the calculator already cites this page for its beef figure).
- Limitations: nonprofit explainer; underlying study and blue/grey split not given on the page.
- Proposed confidence and decision: low to moderate; use with qualifications.

### S52. van der Bles, van der Linden, Freeman & Spiegelhalter (2020)

- Citation: van der Bles, A. M., van der Linden, S., Freeman, A. L. J., & Spiegelhalter, D. J. (2020). The effects of communicating uncertainty on public trust in facts and numbers. *Proceedings of the National Academy of Sciences*, 117(14), 7672–7683. <https://doi.org/10.1073/pnas.1913678117>
- Claim or figure: five experiments (n = 5,780), including a preregistered national replication and a BBC News field experiment; communicating uncertainty produced only a small decrease in trust in numbers and source trustworthiness, mostly for verbal uncertainty.
- Evidence checked: abstract read through Crossref metadata.
- Limitations: UK samples; facts on general topics rather than environmental calculators; only the abstract was read.
- Proposed confidence and decision: high; use.

### S53. Gustafson & Rice (2020)

- Citation: Gustafson, A., & Rice, R. E. (2020). A review of the effects of uncertainty in public science communication. *Public Understanding of Science*, 29(6), 614–633. <https://doi.org/10.1177/0963662520942122>
- Claim or figure: across 48 experiments, negative effects mostly arose from consensus uncertainty (disagreement), which never had positive effects; quantified error ranges and probabilities (technical uncertainty) had only positive or null effects; prior beliefs and worldviews moderated effects.
- Evidence checked: abstract read through Crossref metadata.
- Limitations: narrative review rather than meta-analysis; only the abstract was read.
- Proposed confidence and decision: high; use.

### S54. Dries et al. (2026)

- Citation: Dries, C., Schneider, C. R., Oeberst, A., McDowell, M., Egharevba, G., & Rebitschek, F. G. (2026). The impact of uncertainty communication on trust in its sources: a systematic review and meta-analysis. *Royal Society Open Science*, 13(4). <https://doi.org/10.1098/rsos.251896>
- Claim or figure: a random-effects meta-analysis of 28 studies found no overall effect of uncertainty communication on trust in the source; most studies used fictitious communication contexts.
- Evidence checked: abstract and author names read through Crossref metadata.
- Limitations: few moderators identified; methodological issues across the field noted by the authors; only the abstract was read.
- Proposed confidence and decision: high; use.

### S55. Budescu, Broomell & Por (2009)

- Citation: Budescu, D. V., Broomell, S., & Por, H.-H. (2009). Improving Communication of Uncertainty in the Reports of the Intergovernmental Panel on Climate Change. *Psychological Science*, 20(3), 299–308. <https://doi.org/10.1111/j.1467-9280.2009.02284.x>
- Claim or figure: people's numerical interpretations of IPCC probability terms deviated significantly from the IPCC guidelines, even when the guidelines were available.
- Evidence checked: abstract read through Crossref metadata.
- Limitations: 2009; climate-report context; only the abstract was read.
- Proposed confidence and decision: high; use.

### S56. Cain, Loewenstein & Moore (2005)

- Citation: Cain, D. M., Loewenstein, G., & Moore, D. A. (2005). The Dirt on Coming Clean: Perverse Effects of Disclosing Conflicts of Interest. *The Journal of Legal Studies*, 34(1), 1–25. <https://doi.org/10.1086/426699>
- Claim or figure: people do not discount advice from biased advisors as much as they should even when conflicts are disclosed, and disclosure can increase bias by leading advisors to exaggerate.
- Evidence checked: abstract read on IDEAS/RePEc (<https://ideas.repec.org/a/ucp/jlstud/v34y2005p1-25.html>).
- Limitations: laboratory experiments with paid advisors; a different setting from a company publishing a calculator; only the abstract was read.
- Proposed confidence and decision: moderate; use with qualifications.

### S57. Mu & Lee (2023)

- Citation: Mu, H., & Lee, Y. (2023). Greenwashing in Corporate Social Responsibility: A Dual-Faceted Analysis of Its Impact on Employee Trust and Identification. *Sustainability*, 15(22), 15693. <https://doi.org/10.3390/su152215693>
- Claim or figure: among 304 employees in China, greenwashing in primary-stakeholder-oriented CSR was negatively related to trust, and greenwashing reduced loyalty indirectly through trust and identification.
- Evidence checked: abstract and author names read through Crossref metadata.
- Limitations: cross-sectional survey; China; associations, not causal effects; only the abstract was read.
- Proposed confidence and decision: low to moderate; use with qualifications.

### S58. Ma et al. (2024)

- Citation: Ma, Y., Zhao, S., Chen, J., Hu, C., & Qu, J. (2024). Perceived greenwashing and employee green behavior: The roles of green organizational identity and self-serving leadership. *Business Ethics, the Environment & Responsibility*, 34(4), 1475–1486. <https://doi.org/10.1111/beer.12723>
- Claim or figure: in a two-wave survey of 232 employees in China, perceived greenwashing was negatively related to employee green behaviour, mediated by green organisational identity.
- Evidence checked: abstract read through Crossref metadata.
- Limitations: survey; China; associations, not causal effects; only the abstract was read.
- Proposed confidence and decision: low to moderate; use with qualifications.

## Selected features

List the five selected features. Briefly explain why each was selected and how the set serves all three reference profiles. Name a few serious alternatives and explain why they were rejected.

Selected by the user and explicitly approved by the user on 2026-09-26 ("yes i aprove of the features").

### The five selected features

1. **Image generation logging (professional AI use).** Employees can log generated images by model type and settings (resolution, quality or steps), and those images count toward the day's total. Selected because the calculator currently covers text only, and creative staff generate images routinely. The evidence shows energy per image varies more than 100× by model and settings (about 0.09–11.5 Wh; S1–S3), so settings are worth capturing. The feature must disclose that no commercial image tool publishes figures and that the data come from open models, and any water figure must be labelled as derived.

2. **Agent session and project estimator (professional AI use).** Employees can estimate coding-agent and long-session use from session length and token composition (fresh input, cached input, output), and sum it across a project. Selected because the current "coding / agent session" figure counts 100,000 output tokens only, while real agent sessions are dominated by input tokens and vary up to 30× on the same task (S7–S9). It replaces a known flaw and answers the stated need for assumptions, ranges, and project totals. Fresh-input energy can be given as a range of about 1–4 Wh per 10,000 tokens (S8, S10, S11); cached-token energy has no evidence-based figure and must be shown as an explicitly uncertain range.

3. **Digital day builder (broader digital life).** Employees can enter hours of video calls, video and music streaming, social media, and gaming by device (phone, laptop, TV, console, PC), and see these alongside their AI use. Selected because the calculator cannot represent any of these activities today, and every source agrees that the viewing or playing device dominates (a 50-inch TV uses about 90× a phone; a PS5 draws about 216 W; S21, S25, S33). Categories with weak evidence (social media, music streaming, gaming PCs) must be presented with visible uncertainty rather than precise figures (S31, S32, S36, S37; S29 and S30 were rejected).

4. **Device manufacturing spread over use (broader digital life).** Employees can enter the devices they own and how long they keep them, and see manufacturing emissions spread over their use. Selected because manufacturing accounts for about 70–76% of the life-cycle carbon of phones, laptops, and TVs in current manufacturer reports (S39, S40, S42), so an activity-only view leaves out most of a device's footprint. It also replaces the calculator's outdated or unsupported device figures (S41; the EPA TV citation). Whether and how manufacturing counts in totals remains a user decision for the specification, and gaming desktops and typical-size TVs rely on gaps or proxies (S43, S44).

5. **Like-for-like comparisons (strongest remaining need).** The calculator's everyday comparisons are corrected to use definitions that match the AI figures, for example blue water compared with blue water. Selected because research found that the current comparisons mix accounting methods: AI water is consumption for cooling and power, while the beef-burger figure is about 93% rainfall ("green") water and the smartphone figure is mostly notional dilution ("grey") water (S50, S51). Mismatched comparisons can make AI look trivial or significant depending on the pairing, which conflicts with the brief's requirement that the calculator argue neither position, and which a skeptical reader would reasonably question (S57, S58). The exact correction approach is a user decision for the specification.

### How the set serves the three reference profiles

- **Alex** (image, video, and text generation; streaming and social media on phone, laptop, and TV; attentive to water): image logging (1), streaming and social media by device (3), device manufacturing (4), and consistent water comparisons (5).
- **Jordan** (coding agents in long, irregular sessions; gaming on a desktop PC; frequent video calls; wants assumptions, ranges, and project totals): the agent and project estimator (2), video calls and gaming (3), and desktop PC manufacturing (4).
- **Robin** (occasional text AI; substantial video meetings, streaming, and social media; skeptical; wants plain language, visible sources, and honest uncertainty): video meetings, streaming, and social media (3), device manufacturing (4), and comparisons that use consistent, explained definitions (5).

The brief's requirements are met: features 1 and 2 improve the representation of professional AI use; features 3 and 4 connect AI use to employees' broader digital lives; and feature 5 addresses the strongest remaining need identified through research, inconsistent accounting that undermines honest comparison.

Known gaps in the selected set:

- Alex's video-generation use is not represented (see "Video generation logging" below).
- Robin's need for visible uncertainty is not the focus of any single feature; ranges are included within features 2 and 3 but not carried through every result (see "Ranges carried through every result" below).
- Jordan's gaming-PC figures rely on one measured data point and one modelled estimate (S36, S37), with no gaming-desktop manufacturing report.

### Serious alternatives considered and rejected

- **Video generation logging (idea 2).** Commercial-tool figures are estimates inferred from API timings and assumed hardware (S5), sources conflict for the same model family (S2 against S4), and EcoLogits calculator outputs have not been checked. Too uncertain to present as a logged value now.
- **Ranges carried through every result (idea 10).** Best supported by the trust evidence (S52–S54), but it would require a range for every input across the whole calculator, which is too large for one feature. Ranges are included within features 2 and 3.
- **Water boundary selector (idea 8).** Overlaps with feature 5; consistent definitions are a prerequisite for a meaningful selector.
- **"Why sources differ" and disclosure panel (idea 11).** Mostly presentational; it would count as a feature only if tied to the calculation.
- **AI as a share of the digital day (idea 7).** Depends on feature 3 and is closer to a view than a separate feature.
- **Attempts per final output (idea 3).** Adds little on its own; it can be an input within features 1 and 2.
- **Home grid region selector (idea 12).** Not yet researched; US regional grid data were not checked.

User approval: Review the completed research directly. Confirm that sources exist and support the claims the project will use, correct the document as needed, and explicitly approve the selected features before developing the specification. The agent cannot complete this approval on the user's behalf.

## Commands

### Start research

User: Open the project repository as your workspace, start a fresh chat, and type `start research`.

### Save transcript

Agent: After the user approves the selected features, remind them that the transcript is a deliverable and ask them to say `save transcript`. Wait for that direction.

When the user directs the agent to save the transcript, the agent saves the entire conversation in the `transcripts/` directory as `research-YYYY-MM-DD_HHMMSS.md`, marks user and agent responses clearly, and confirms the saved relative path.
