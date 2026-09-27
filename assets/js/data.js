/**
 * data.js — reference figures for the calculator.
 *
 * Per-model energy / carbon / water estimates (mean plus EcoLogits' own 95%
 * interval) come from the EcoLogits library v0.10, the engine behind the
 * EcoLogits calculator at huggingface.co/spaces/genai-impact/ecologits-calculator.
 * Every other figure is sourced in the methodology section of index.html.
 *
 * Carried over unchanged from Andy Masley's original calculator (CC0).
 */
(function (AIPF) {
  'use strict';

  // ---- Per-prompt model impacts from EcoLogits v0.10 (mean + 95% range) ----
  // wh = electricity (Wh), emb = embodied hardware carbon (g CO2e), ml = water (mL)
  // Each model's "agent" entry is EcoLogits' 100,000-output-token "assist
  // application development" benchmark. It is no longer an output size; agent
  // sessions (feature 2) divide it by 100,000 to cost each output token.
  AIPF.MODELS = [{"id":"gpt-5.5","name":"GPT-5.5","group":"OpenAI","sizes":{"tweet":{"wh":0.4064,"whmin":0.2917,"whmax":0.5212,"emb":0.0241,"embmin":0.0241,"embmax":0.0241,"ml":1.4658,"mlmin":1.0518,"mlmax":1.8797},"email":{"wh":1.1791,"whmin":0.7888,"whmax":1.5694,"emb":0.0395,"embmin":0.0395,"embmax":0.0395,"ml":4.2522,"mlmin":2.8447,"mlmax":5.6597},"summary":{"wh":1.6942,"whmin":1.1203,"whmax":2.2682,"emb":0.0498,"embmin":0.0498,"embmax":0.0498,"ml":6.1098,"mlmin":4.0399,"mlmax":8.1797},"chat":{"wh":2.6601,"whmin":1.7417,"whmax":3.5784,"emb":0.0692,"embmin":0.0692,"embmax":0.0692,"ml":9.5929,"mlmin":6.2811,"mlmax":12.9047},"report":{"wh":32.279,"whmin":20.7997,"whmax":43.7584,"emb":0.6622,"embmin":0.6622,"embmax":0.6622,"ml":116.4068,"mlmin":75.0091,"mlmax":157.8045},"long":{"wh":96.6681,"whmin":62.23,"whmax":131.1063,"emb":1.9514,"embmin":1.9514,"embmax":1.9514,"ml":348.611,"mlmin":224.4178,"mlmax":472.8041},"agent":{"wh":644.1723,"whmin":414.5847,"whmax":873.76,"emb":12.9507,"embmin":12.9507,"embmax":12.9507,"ml":2323.0577,"mlmin":1495.103,"mlmax":3151.012},"novel":{"wh":3219.5382,"whmin":2071.5998,"whmax":4367.4766,"emb":64.4772,"embmin":64.4772,"embmax":64.4772,"ml":11610.5134,"mlmin":7470.7415,"mlmax":15750.2854}}},{"id":"gpt-5.5-pro","name":"GPT-5.5 Pro","group":"OpenAI","sizes":{"tweet":{"wh":20.758,"whmin":15.2479,"whmax":26.2681,"emb":2.063,"embmin":2.063,"embmax":2.063,"ml":74.859,"mlmin":54.9881,"mlmax":94.7299},"email":{"wh":48.4781,"whmin":29.7437,"whmax":67.2124,"emb":2.4102,"embmin":2.4102,"embmax":2.4102,"ml":174.8249,"mlmin":107.2638,"mlmax":242.386},"summary":{"wh":66.9581,"whmin":39.4076,"whmax":94.5086,"emb":2.6417,"embmin":2.6417,"embmax":2.6417,"ml":241.4689,"mlmin":142.1143,"mlmax":340.8234},"chat":{"wh":101.6082,"whmin":57.5274,"whmax":145.689,"emb":3.0757,"embmin":3.0757,"embmax":3.0757,"ml":366.4263,"mlmin":207.459,"mlmax":525.3935},"report":{"wh":1164.2105,"whmin":613.2001,"whmax":1715.2209,"emb":16.3859,"embmin":16.3859,"embmax":16.3859,"ml":4198.4535,"mlmin":2211.363,"mlmax":6185.5441},"long":{"wh":3474.2155,"whmin":1821.1842,"whmax":5127.2468,"emb":45.3211,"embmin":45.3211,"embmax":45.3211,"ml":12528.9476,"mlmin":6567.676,"mlmax":18490.2193},"agent":{"wh":23130.7433,"whmin":12110.535,"whmax":34150.952,"emb":295.7463,"embmin":295.7463,"embmax":295.7463,"ml":83415.629,"mlmin":43673.818,"mlmax":123157.44},"novel":{"wh":115509.4586,"whmin":60408.4155,"whmax":170610.5016,"emb":1448.6776,"embmin":1448.6776,"embmax":1448.6776,"ml":416557.9101,"mlmin":217848.8553,"mlmax":615266.9648}}},{"id":"gpt-5.4-mini","name":"GPT-5.4 mini","group":"OpenAI","sizes":{"tweet":{"wh":0.041,"whmin":0.0108,"whmax":0.0711,"emb":0.0011,"embmin":0.0004,"embmax":0.0018,"ml":0.1477,"mlmin":0.039,"mlmax":0.2564},"email":{"wh":0.133,"whmin":0.0342,"whmax":0.2317,"emb":0.0024,"embmin":0.001,"embmax":0.0039,"ml":0.4795,"mlmin":0.1234,"mlmax":0.8356},"summary":{"wh":0.1943,"whmin":0.0498,"whmax":0.3388,"emb":0.0033,"embmin":0.0013,"embmax":0.0053,"ml":0.7008,"mlmin":0.1798,"mlmax":1.2217},"chat":{"wh":0.3093,"whmin":0.0791,"whmax":0.5395,"emb":0.005,"embmin":0.002,"embmax":0.008,"ml":1.1155,"mlmin":0.2854,"mlmax":1.9457},"report":{"wh":3.8366,"whmin":0.9771,"whmax":6.6961,"emb":0.0563,"embmin":0.0225,"embmax":0.0901,"ml":13.8358,"mlmin":3.5236,"mlmax":24.148},"long":{"wh":11.5045,"whmin":2.9291,"whmax":20.08,"emb":0.1678,"embmin":0.0671,"embmax":0.2684,"ml":41.4884,"mlmin":10.5631,"mlmax":72.4137},"agent":{"wh":76.688,"whmin":19.524,"whmax":133.8523,"emb":1.1167,"embmin":0.4467,"embmax":1.7867,"ml":276.558,"mlmin":70.4083,"mlmax":482.7073},"novel":{"wh":383.3997,"whmin":97.6029,"whmax":669.1964,"emb":5.5745,"embmin":2.2298,"embmax":8.9193,"ml":1382.6414,"mlmin":351.9819,"mlmax":2413.3008}}},{"id":"claude-opus-4-8","name":"Claude Opus 4.8","group":"Anthropic","sizes":{"tweet":{"wh":0.2673,"whmin":0.1938,"whmax":0.3408,"emb":0.013,"embmin":0.013,"embmax":0.013,"ml":0.9982,"mlmin":0.6301,"mlmax":1.3662},"email":{"wh":0.818,"whmin":0.5701,"whmax":1.0659,"emb":0.0238,"embmin":0.0238,"embmax":0.0238,"ml":3.0632,"mlmin":1.8537,"mlmax":4.2727},"summary":{"wh":1.1852,"whmin":0.821,"whmax":1.5493,"emb":0.0309,"embmin":0.0309,"embmax":0.0309,"ml":4.4398,"mlmin":2.6693,"mlmax":6.2103},"chat":{"wh":1.8735,"whmin":1.2914,"whmax":2.4557,"emb":0.0444,"embmin":0.0444,"embmax":0.0444,"ml":7.0211,"mlmin":4.1987,"mlmax":9.8434},"report":{"wh":22.9837,"whmin":15.7164,"whmax":30.2509,"emb":0.4575,"embmin":0.4575,"embmax":0.4575,"ml":86.179,"mlmin":51.0998,"mlmax":121.2581},"long":{"wh":68.8752,"whmin":47.0752,"whmax":90.6752,"emb":1.3555,"embmin":1.3555,"embmax":1.3555,"ml":258.2614,"mlmin":153.0588,"mlmax":363.464},"agent":{"wh":459.042,"whmin":313.7117,"whmax":604.3727,"emb":9.0083,"embmin":9.0083,"embmax":9.0083,"ml":1721.2837,"mlmin":1019.991,"mlmax":2422.5763},"novel":{"wh":2294.617,"whmin":1567.9779,"whmax":3021.256,"emb":44.9079,"embmin":44.9079,"embmax":44.9079,"ml":8604.2603,"mlmin":5098.0702,"mlmax":12110.4504}}},{"id":"claude-sonnet-4-6","name":"Claude Sonnet 4.6","group":"Anthropic","sizes":{"tweet":{"wh":0.1135,"whmin":0.0886,"whmax":0.1384,"emb":0.0072,"embmin":0.0072,"embmax":0.0072,"ml":0.4214,"mlmin":0.2881,"mlmax":0.5547},"email":{"wh":0.3424,"whmin":0.2588,"whmax":0.426,"emb":0.0148,"embmin":0.0148,"embmax":0.0148,"ml":1.2745,"mlmin":0.8414,"mlmax":1.7077},"summary":{"wh":0.495,"whmin":0.3722,"whmax":0.6178,"emb":0.0198,"embmin":0.0198,"embmax":0.0198,"ml":1.8433,"mlmin":1.2102,"mlmax":2.4764},"chat":{"wh":0.7811,"whmin":0.5849,"whmax":0.9773,"emb":0.0292,"embmin":0.0292,"embmax":0.0292,"ml":2.9097,"mlmin":1.9018,"mlmax":3.9176},"report":{"wh":9.5558,"whmin":7.1079,"whmax":12.0038,"emb":0.3186,"embmin":0.3186,"embmax":0.3186,"ml":35.6133,"mlmin":23.1103,"mlmax":48.1162},"long":{"wh":28.6313,"whmin":21.2882,"whmax":35.9744,"emb":0.9476,"embmin":0.9476,"embmax":0.9476,"ml":106.708,"mlmin":69.2157,"mlmax":144.2002},"agent":{"wh":190.8147,"whmin":141.8623,"whmax":239.7673,"emb":6.3037,"embmin":6.3037,"embmax":6.3037,"ml":711.1667,"mlmin":461.246,"mlmax":961.0873},"novel":{"wh":953.79,"whmin":709.0334,"whmax":1198.5467,"emb":31.4554,"embmin":31.4554,"embmax":31.4554,"ml":3554.8002,"mlmin":2305.3271,"mlmax":4804.2734}}},{"id":"claude-haiku-4-5-20251001","name":"Claude Haiku 4.5","group":"Anthropic","sizes":{"tweet":{"wh":0.0062,"whmin":0.0035,"whmax":0.0089,"emb":0.0003,"embmin":0.0002,"embmax":0.0004,"ml":0.0236,"mlmin":0.0114,"mlmax":0.0358},"email":{"wh":0.0194,"whmin":0.0107,"whmax":0.028,"emb":0.0007,"embmin":0.0005,"embmax":0.001,"ml":0.0735,"mlmin":0.0349,"mlmax":0.1121},"summary":{"wh":0.0281,"whmin":0.0156,"whmax":0.0407,"emb":0.001,"embmin":0.0007,"embmax":0.0014,"ml":0.1068,"mlmin":0.0506,"mlmax":0.163},"chat":{"wh":0.0446,"whmin":0.0246,"whmax":0.0645,"emb":0.0015,"embmin":0.001,"embmax":0.002,"ml":0.1693,"mlmin":0.0801,"mlmax":0.2585},"report":{"wh":0.5485,"whmin":0.3023,"whmax":0.7946,"emb":0.0173,"embmin":0.0116,"embmax":0.0231,"ml":2.084,"mlmin":0.9829,"mlmax":3.1851},"long":{"wh":1.6439,"whmin":0.9059,"whmax":2.3818,"emb":0.0517,"embmin":0.0344,"embmax":0.0689,"ml":6.2465,"mlmin":2.9455,"mlmax":9.5474},"agent":{"wh":10.9567,"whmin":6.038,"whmax":15.8757,"emb":0.344,"embmin":0.2293,"embmax":0.4587,"ml":41.634,"mlmin":19.6317,"mlmax":63.6363},"novel":{"wh":54.7726,"whmin":30.1826,"whmax":79.3626,"emb":1.717,"embmin":1.1447,"embmax":2.2894,"ml":208.1266,"mlmin":98.1348,"mlmax":318.1184}}},{"id":"gemini-3.1-pro-preview","name":"Gemini 3.1 Pro","group":"Google","sizes":{"tweet":{"wh":0.8453,"whmin":0.607,"whmax":1.0837,"emb":0.0521,"embmin":0.0521,"embmax":0.0521,"ml":3.4225,"mlmin":2.4575,"mlmax":4.3874},"email":{"wh":2.4033,"whmin":1.5929,"whmax":3.2136,"emb":0.0693,"embmin":0.0693,"embmax":0.0693,"ml":9.73,"mlmin":6.4492,"mlmax":13.0107},"summary":{"wh":3.4419,"whmin":2.2502,"whmax":4.6336,"emb":0.0807,"embmin":0.0807,"embmax":0.0807,"ml":13.9349,"mlmin":9.1103,"mlmax":18.7596},"chat":{"wh":5.3893,"whmin":3.4827,"whmax":7.296,"emb":0.1021,"embmin":0.1021,"embmax":0.1021,"ml":21.8193,"mlmin":14.0999,"mlmax":29.5387},"report":{"wh":65.1103,"whmin":41.2769,"whmax":88.9437,"emb":0.7585,"embmin":0.7585,"embmax":0.7585,"ml":263.6065,"mlmin":167.1144,"mlmax":360.0987},"long":{"wh":194.9386,"whmin":123.4384,"whmax":266.4387,"emb":2.1854,"embmin":2.1854,"embmax":2.1854,"ml":789.2309,"mlmin":499.7544,"mlmax":1078.7075},"agent":{"wh":1298.9363,"whmin":822.2687,"whmax":1775.604,"emb":14.4193,"embmin":14.4193,"embmax":14.4193,"ml":5258.8917,"mlmin":3329.048,"mlmax":7188.7353},"novel":{"wh":6491.6081,"whmin":4108.2694,"whmax":8874.9469,"emb":71.392,"embmin":71.392,"embmax":71.392,"ml":26282.014,"mlmin":16632.7959,"mlmax":35931.2321}}},{"id":"gemini-3.5-flash","name":"Gemini 3.5 Flash","group":"Google","sizes":{"tweet":{"wh":0.305,"whmin":0.2305,"whmax":0.3795,"emb":0.0162,"embmin":0.0162,"embmax":0.0162,"ml":1.2348,"mlmin":0.9333,"mlmax":1.5364},"email":{"wh":0.8888,"whmin":0.6355,"whmax":1.142,"emb":0.0209,"embmin":0.0209,"embmax":0.0209,"ml":3.5982,"mlmin":2.573,"mlmax":4.6234},"summary":{"wh":1.2779,"whmin":0.9055,"whmax":1.6503,"emb":0.0241,"embmin":0.0241,"embmax":0.0241,"ml":5.1738,"mlmin":3.6661,"mlmax":6.6815},"chat":{"wh":2.0076,"whmin":1.4118,"whmax":2.6035,"emb":0.0301,"embmin":0.0301,"embmax":0.0301,"ml":8.1281,"mlmin":5.7158,"mlmax":10.5404},"report":{"wh":24.3849,"whmin":16.937,"whmax":31.8328,"emb":0.2136,"embmin":0.2136,"embmax":0.2136,"ml":98.7251,"mlmin":68.5713,"mlmax":128.8789},"long":{"wh":73.0312,"whmin":50.6874,"whmax":95.375,"emb":0.6124,"embmin":0.6124,"embmax":0.6124,"ml":295.6751,"mlmin":205.2137,"mlmax":386.1366},"agent":{"wh":486.6687,"whmin":337.71,"whmax":635.6273,"emb":4.0353,"embmin":4.0353,"embmax":4.0353,"ml":1970.334,"mlmin":1367.258,"mlmax":2573.41},"novel":{"wh":2432.3763,"whmin":1687.583,"whmax":3177.1697,"emb":19.9542,"embmin":19.9542,"embmax":19.9542,"ml":9847.7523,"mlmin":6832.3716,"mlmax":12863.1329}}},{"id":"gemini-3.1-flash-lite","name":"Gemini 3.1 Flash-Lite","group":"Google","sizes":{"tweet":{"wh":0.0159,"whmin":0.0045,"whmax":0.0273,"emb":0.0008,"embmin":0.0003,"embmax":0.0012,"ml":0.0644,"mlmin":0.0182,"mlmax":0.1105},"email":{"wh":0.0478,"whmin":0.0128,"whmax":0.0827,"emb":0.0012,"embmin":0.0005,"embmax":0.0019,"ml":0.1933,"mlmin":0.0517,"mlmax":0.335},"summary":{"wh":0.069,"whmin":0.0183,"whmax":0.1197,"emb":0.0015,"embmin":0.0006,"embmax":0.0024,"ml":0.2793,"mlmin":0.074,"mlmax":0.4846},"chat":{"wh":0.1088,"whmin":0.0286,"whmax":0.189,"emb":0.002,"embmin":0.0008,"embmax":0.0032,"ml":0.4405,"mlmin":0.1159,"mlmax":0.7652},"report":{"wh":1.3299,"whmin":0.3458,"whmax":2.3141,"emb":0.0182,"embmin":0.0073,"embmax":0.0292,"ml":5.3844,"mlmin":1.3999,"mlmax":9.369},"long":{"wh":3.9846,"whmin":1.0352,"whmax":6.9339,"emb":0.0535,"embmin":0.0214,"embmax":0.0856,"ml":16.1321,"mlmin":4.1913,"mlmax":28.0729},"agent":{"wh":26.5553,"whmin":6.898,"whmax":46.2123,"emb":0.3547,"embmin":0.142,"embmax":0.5673,"ml":107.5117,"mlmin":27.9277,"mlmax":187.0957},"novel":{"wh":132.7348,"whmin":34.4741,"whmax":230.9956,"emb":1.7636,"embmin":0.7054,"embmax":2.8218,"ml":537.3921,"mlmin":139.5723,"mlmax":935.2119}}}];

  AIPF.SIZES = [
    { id: 'tweet',   label: 'A tweet',                 words: '40 words',        w: 38, plural: 'tweets' },
    { id: 'email',   label: 'A short email',           words: '130 words',       w: 128, plural: 'short emails' },
    { id: 'summary', label: 'An article summary',      words: '190 words',       w: 188, plural: 'article summaries' },
    { id: 'chat',    label: 'A chatbot reply',         words: '300 words',       w: 300, plural: 'chatbot replies' },
    { id: 'report',  label: 'A 5-page report',         words: '3,800 words',     w: 3750, plural: '5-page reports' },
    { id: 'long',    label: 'A long document',         words: '11,000 words',    w: 11250, plural: 'long documents' },
    { id: 'novel',   label: 'Re-write the Lord of the Rings trilogy', words: '~480,000 words', w: 480000, plural: 'trilogy rewrites' },
  ];
  AIPF.SIZE_LABEL_OVERRIDES = {};

  // Share links before Project 2 encoded each output size by its position in
  // this older list, which still included the removed 'agent' size.
  AIPF.LEGACY_SIZE_IDS = ['tweet', 'email', 'summary', 'chat', 'report', 'long', 'agent', 'novel'];

  AIPF.WPM = 238;
  AIPF.TOKENS_PER_WORD = 0.75;

  AIPF.DEFAULT_ROWS = [
    ['gpt-5.5', 'chat', 15],
    ['claude-sonnet-4-6', 'chat', 8],
    ['gemini-3.5-flash', 'summary', 4],
  ];

  AIPF.WORLD_GRID = 480; // global-average grid carbon intensity, g CO2e/kWh (Ember)

  // ---- Generated images (feature 1): one general range, Wh per image ----
  // Central: median across Luccioni et al. 2024's image models (1.35 kWh per
  // 1,000 inferences, 2022–23 open models on an A100). Low: Bertazzini et al.
  // 2025's lowest of 17 open models (8.6e-5 kWh, LCM_SSD_1B, RTX 4090). High:
  // Luccioni et al.'s least efficient model (11.49 kWh per 1,000, SDXL base).
  AIPF.IMAGE = { wh: 1.35, whmin: 0.086, whmax: 11.49 };

  // ---- Agent sessions (feature 2): Wh per 10,000 input-side tokens ----
  // Fresh input and cache writes: central 2.1 from Epoch AI (a GPT-4o query with
  // a 10,000-token input costs about 2.4 Wh against about 0.3 Wh for a typical
  // query); range 1-4 across Epoch AI, Jegham et al. 2025, and Couch 2026.
  AIPF.SESSION_INPUT = { wh: 2.1, whmin: 1, whmax: 4 };
  // Cache reads: central 0.39 from Couch 2026 (39 Wh per million tokens, a
  // price-based proxy). The 0-4 bounds are this project's own reasoning: no
  // more than fresh input, not free. No measurement exists.
  AIPF.SESSION_CACHE_READ = { wh: 0.39, whmin: 0, whmax: 4 };
  AIPF.AGENT_OUTPUT_TOKENS = 100000;  // tokens behind each model's "agent" figure

  // Peng, Lin & Lee 2026, Period A: one developer, Claude Code on one
  // repository, 28 days, often running unattended around the clock.
  AIPF.PROJECT_EXAMPLE = { fresh: 980326, write: 108060378, read: 15202019495, out: 20156852 };

  // ---- Digital day (feature 3): non-AI activities, per hour ----
  // Unless noted, from the Carbon Trust's 2021 white paper on video streaming
  // (European averages for 2020; seed-funded by Netflix through DIMPACT).
  // Power triples are [central, low, high] watts; single estimates repeat one value.
  AIPF.DIGITAL = {
    routerW: 10,                              // home router, counted per hour of home Wi-Fi use
    netKwhPerGb: { home: 0.0065, cell: 0.1 }, // fixed and mobile network intensities
    socialDcWhPerDay: 5500 / 365,             // Meta 2024: 0.0055 MWh per daily active person per year
    gridWaterLPerKwh: 4.35,                   // Berkeley Lab: water to generate US electricity overall
    devices: {
      phone:    { label: 'Smartphone', w: [1, 1, 1], single: true },
      laptop:   { label: 'Laptop', w: [22, 22, 22], single: true },
      desktop:  { label: 'Office desktop with monitor', w: [115, 115, 115], single: true },
      tv:       { label: 'TV', w: [100, 100, 100], single: true },
      // PS5 (Sony): active gaming 213.25-219.2 W; home menu 43.4-47.06 W, a
      // stand-in for streaming. Central values are the midpoints.
      console:  { label: 'Games console', w: { gaming: [216.2, 213.25, 219.2], stream: [45.2, 43.4, 47.06] } },
      // Pérez et al. 2024's measured 358.6 W plus a 14.2 W monitor (ENERGY STAR
      // median); low: Hazas et al. 2026's modelled 305.1 W plus 10 W; high:
      // 358.6 W plus 29 W (ENERGY STAR 10th and 90th percentiles).
      gamingpc: { label: 'Gaming PC with monitor', w: [372.8, 315.1, 387.6] },
    },
    activities: {
      // CableLabs 2021: 0.5-3.4 GB an hour across four apps; the midpoint
      // is this project's own construction.
      call:   { label: 'Video calls', devices: ['phone', 'laptop', 'desktop'], gb: [1.95, 0.5, 3.4] },
      stream: {
        label: 'Video streaming', devices: ['phone', 'laptop', 'desktop', 'tv', 'console'], dcWhPerHour: 1,
        quality: {
          home: [{ id: 'sd', label: 'SD', gb: 1 }, { id: 'hd', label: 'HD', gb: 3 }, { id: 'uhd', label: '4K', gb: 7 }],
          cell: [{ id: 'save', label: 'Save data', gb: 0.17 }, { id: 'auto', label: 'Automatic', gb: 0.25 }, { id: 'max', label: 'Maximum data', gb: 3 }],
        },
      },
      // Spotify's quality settings: 24, 96, 160, and 320 kbit/s.
      music: {
        label: 'Music streaming', devices: ['phone', 'laptop', 'desktop'],
        quality: { any: [
          { id: 'low', label: 'Low', gb: 24 * 3600 / 8e6 },
          { id: 'normal', label: 'Normal', gb: 96 * 3600 / 8e6 },
          { id: 'high', label: 'High', gb: 160 * 3600 / 8e6 },
          { id: 'vhigh', label: 'Very high', gb: 320 * 3600 / 8e6 },
        ] },
      },
      social: { label: 'Social media', devices: ['phone', 'laptop', 'desktop'], noNetwork: true, dcPerDay: true },
      gaming: { label: 'Gaming', devices: ['phone', 'console', 'gamingpc'], noNetwork: true },
    },
  };

  // ---- Device manufacturing (feature 4), kg CO2e per device ----
  // Spread per day kept: kg / (years x 365) / people sharing. Default years
  // follow each source's own assumption. `label` says how far the figure is
  // from a manufacturing-only average for that kind of device.
  AIPF.DEVICE_MFG = [
    { id: 'phone', label: 'Smartphone', kg: 42, years: 3, tag: 'one model',
      basis: '76% of the iPhone 17’s 55 kg life cycle', src: 'Apple', url: 'https://www.apple.com/environment/pdf/products/iphone/iPhone_17_PER_Sept2025.pdf',
      // GRACE Communications: 3,190 gallons of production water, mostly grey.
      waterL: 3190 * 3.785411784 },
    { id: 'laptop', label: 'Laptop', kg: 110, years: 4, tag: 'one model',
      basis: '71% of the 15-inch MacBook Air’s 155 kg life cycle', src: 'Apple', url: 'https://www.apple.com/environment/pdf/products/notebooks/M4_MacBook_Air_PER_March2025.pdf' },
    { id: 'tv55', label: 'TV, about 55-inch', kg: 370, years: 7, tag: 'proxy',
      basis: '21.9% of a 55-inch commercial signage display’s 1,691 kg', src: 'Samsung', url: 'https://www.samsung.com/global/sustainability/landing_hub-file/AY_wFeS6BzIALYNu/Signage_QMC_Environmental_Report_EN_2503.pdf' },
    { id: 'tv75', label: 'TV, 75-inch', kg: 690, years: 7, tag: 'one model',
      basis: '70.4% of the QLED 75Q60C’s 982 kg life cycle', src: 'Samsung', url: 'https://www.samsung.com/global/sustainability/media/pdf/TV_QLED_Environmental_Report_EN.pdf' },
    { id: 'desktop', label: 'Office desktop (no monitor)', kg: 198, years: 4, tag: 'whole life cycle',
      basis: 'OptiPlex Tower Plus 7020, whole life cycle, since the manufacturing share is not published as text', src: 'Dell', url: 'https://www.delltechnologies.com/asset/en-us/products/desktops-and-all-in-ones/technical-support/optiplex-tower-plus-7020-pcf-report.pdf' },
    { id: 'console', label: 'Games console', kg: 190, years: 5, tag: 'stand-in',
      basis: 'Xbox Series X production; Sony publishes no figure for the PS5', src: 'Microsoft', url: 'https://download.microsoft.com/download/4/8/D/48D50344-33CD-4D9A-BA11-0C7DCA1A3948/EcoProfile_XboxSeries_X.pdf' },
    { id: 'gamingpc', label: 'Gaming PC (no monitor)', kg: 112, years: 4, tag: 'lower bound',
      basis: 'an office-desktop proxy the authors call the lower end of the gaming range', src: 'Hazas et al. 2026', url: 'https://arxiv.org/abs/2608.19040' },
    { id: 'monitor', label: 'Monitor', kg: 194, years: 5, tag: 'whole life cycle',
      basis: 'Dell P2725H 27-inch, whole life cycle, since the manufacturing share cannot be separated', src: 'Dell', url: 'https://www.delltechnologies.com/asset/en-us/products/electronics-and-accessories/technical-support/p2725h-monitor-pcf-report.pdf' },
  ];

  // Data-centre water per kWh, derived: Berkeley Lab's 2023 US average on-site
  // use (0.36 L/kWh) plus indirect water through electricity (4.52 L/kWh).
  AIPF.DC_WATER_L_PER_KWH = 0.36 + 4.52;


  // location = regional baseline for goods, services, shared infrastructure
  // (home energy and driving are separate knobs below, so they are excluded here)
  // w = BLUE water footprint per capita (freshwater from rivers/lakes/aquifers),
  // gal/yr; green rainwater excluded. The full blue footprint sits on "location";
  // home/diet water are folded in (set to 0) to avoid double-counting.
  AIPF.LOCATIONS = [
    { id: 'us',    label: 'the US',    c: 3000, w: 119000, grid: 380 },
    { id: 'eu',    label: 'the EU',    c: 1800, w: 66000,  grid: 215 },
    { id: 'uk',    label: 'the UK',    c: 1700, w: 45000,  grid: 125 },
    { id: 'cn',    label: 'China',     c: 2500, w: 79000,  grid: 580 },
    { id: 'in',    label: 'India',     c: 900,  w: 106000, grid: 700 },
    { id: 'world', label: 'the world', c: 1800, w: 40000,  grid: AIPF.WORLD_GRID },
  ];
  AIPF.HOMES = [
    { id: 'apt', label: 'a small apartment', c: 1500, w: 0 },
    { id: 'med', label: 'a medium home',     c: 3500, w: 0 },
    { id: 'big', label: 'a big house',       c: 7000, w: 0 },
  ];
  AIPF.DRIVING = [
    { id: 'd0',   label: 'not at all',        c: 0,     w: 0 },
    // US EPA: about 4.6 t CO2 a year for 11,500 miles, tailpipe only; 'a
    // little' and 'a lot' are scaled from it by the calculator's original ratios.
    { id: 'dlo',  label: 'a little (scaled from the EPA average)', c: 1150, w: 0 },
    { id: 'davg', label: 'an average amount (EPA, 11,500 miles)',  c: 4600, w: 0 },
    { id: 'dhi',  label: 'a lot (scaled from the EPA average)',    c: 9580, w: 0 },
  ];
  // Diet water (w) set to 0: on a blue-water basis the personal footprint is
  // dominated by irrigated agriculture and counted in the regional figure above.
  AIPF.DIETS = [
    { id: 'heavy', label: 'a lot of meat',      c: 3200, w: 0 },
    { id: 'avg',   label: 'an average diet',    c: 2500, w: 0 },
    { id: 'light', label: 'little meat',        c: 2000, w: 0 },
    { id: 'pesc',  label: 'a pescatarian diet', c: 1700, w: 0 },
    { id: 'veg',   label: 'a vegetarian diet',  c: 1500, w: 0 },
    { id: 'vegan', label: 'a vegan diet',       c: 1050, w: 0 },
  ];
  AIPF.FLYING = [
    { id: 'never', label: 'never',     c: 0,    w: 0 },
    { id: 'rare',  label: 'rarely',    c: 560,  w: 0 },
    { id: 'some',  label: 'sometimes', c: 2300, w: 0 },
    { id: 'often', label: 'often',     c: 8000, w: 0 },
  ];
  // Typical diet by region; the diet default follows the country you pick.
  AIPF.COUNTRY_DIET = { us: 'avg', eu: 'light', uk: 'avg', cn: 'light', in: 'light', world: 'light' };

  // Sources cited in the generated report (footnote order).
  AIPF.REPORT_REFS = [
    { url: 'https://ecologits.ai/', label: 'EcoLogits (v0.10) — per-prompt energy, carbon, and water for each model, behind the EcoLogits calculator.' },
    { url: 'https://ember-energy.org/latest-insights/global-electricity-review-2024/', label: 'Ember, Global Electricity Review 2024, with Our World in Data — grid carbon intensity by region, used to cost the electricity.' },
    { url: 'https://ourworldindata.org/co2-emissions', label: 'Our World in Data — consumption-based emissions, used for the regional baseline.' },
    { url: 'https://www.eia.gov/consumption/residential/', label: 'US EIA Residential Energy Consumption Survey, with Goldstein et al. 2020 (PNAS) — home energy.' },
    { url: 'https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle', label: 'US EPA — about 400 g CO2 per mile and 4.6 t for 11,500 miles a year, tailpipe only; the driving setting and comparisons.' },
    { url: 'https://www.science.org/doi/10.1126/science.aaq0216', label: 'Poore & Nemecek 2018 (Science) and Scarborough et al. 2023 (Nature Food) — diet footprints.' },
    { url: 'https://iopscience.iop.org/article/10.1088/1748-9326/aa7541', label: 'Wynes & Nicholas 2017 — flights and lifestyle cuts.' },
    { url: 'https://iopscience.iop.org/article/10.1088/1748-9326/ab8589', label: 'Ivanova et al. 2020 — housing and transport mitigation options.' },
    { url: 'https://www.founderspledge.com/research/climate-and-lifestyle-report', label: 'Founders Pledge, Climate & Lifestyle report — secondary confirmation of the transatlantic flight.' },
    { url: 'https://www.waterfootprint.org/', label: 'Water Footprint Network (Mekonnen & Hoekstra) and the Water Footprint Calculator — water-consumption figures and the personal water footprint.' },
    { url: 'https://arxiv.org/abs/2311.16863', label: 'Luccioni, Jernite & Strubell 2024 (FAccT) — median and highest energy per generated image.' },
    { url: 'https://arxiv.org/abs/2506.17016', label: 'Bertazzini et al. 2025 (preprint) — lowest energy per generated image across 17 open models.' },
    { url: 'https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf', label: 'Shehabi et al. 2024, Berkeley Lab — US data-centre on-site and indirect water per kWh.' },
    { url: 'https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use', label: 'You 2025, Epoch AI — energy of a GPT-4o query with a long input; the central input-token rate.' },
    { url: 'https://simonpcouch.com/blog/2026-01-20-cc-impact/', label: 'Couch 2026 — worked estimate of a Claude Code session; the central cache-read rate (a price-based proxy).' },
    { url: 'https://arxiv.org/abs/2505.09598', label: 'Jegham et al. 2025 (preprint) — per-query energy at different input lengths; one end of the input-token range.' },
    { url: 'https://ourworldindata.org/grapher/ghg-per-kg-poore', label: 'Poore & Nemecek 2018 (Science), via Our World in Data — food carbon per kg, farm to retail.' },
    { url: 'https://doi.org/10.1111/j.1530-9290.2011.00414.x', label: 'Wells et al. 2012 (Journal of Industrial Ecology) — a paperback book, cradle to gate.' },
    { url: 'https://www.playstation.com/en-gb/legal/ecodesign/', label: 'Sony Interactive Entertainment — PS5 power while gaming.' },
    { url: 'https://www.levistrauss.com/wp-content/uploads/2015/03/Full-LCA-Results-Deck-FINAL.pdf', label: 'Levi Strauss & Co. 2015 — life cycle of a pair of 501 jeans.' },
    { url: 'https://www.apple.com/environment/pdf/products/iphone/iPhone_17_PER_Sept2025.pdf', label: 'Apple and Samsung product environmental reports — device manufacturing (iPhone 17, MacBook Air, 55-inch signage proxy).' },
    { url: 'https://doi.org/10.5194/hess-15-1577-2011', label: 'Mekonnen & Hoekstra 2011 (HESS) — blue water footprint of crops and crop products.' },
    { url: 'https://waterfootprint.org/media/downloads/Mekonnen-Hoekstra-2012-WaterFootprintFarmAnimalProducts.pdf', label: 'Mekonnen & Hoekstra 2012 (Ecosystems) — blue water footprint of farm animal products.' },
    { url: 'https://waterfootprint.org/resources/Report18.pdf', label: 'Chapagain et al. 2005 (UNESCO-IHE) — blue water footprint of cotton textiles.' },
    { url: 'https://www.eia.gov/tools/faqs/faq.php?id=97', label: 'US EIA — average household electricity use, 10,791 kWh a year.' },
  ];

  // ---- Everyday comparisons (feature 5): like for like ----
  // Water items are blue water (freshwater consumed), the same kind as the AI
  // and digital-day figures; carbon items state their boundary. Each item:
  //   label; note = the assumption and boundary shown with it; src/url = source;
  //   c = kg CO2e, or kwh = electricity costed on the selected grid (carbon) or
  //   at 4.35 L/kWh (water); w = litres of blue water; lo/hi = a reported
  //   range in the same unit as c or w; dir = 'add' or 'save' (yearly charts);
  //   src2/url2 = a second source where the item draws on two.
  const OWID_POORE = 'https://ourworldindata.org/grapher/ghg-per-kg-poore';
  const MH2011 = 'https://doi.org/10.5194/hess-15-1577-2011';
  const MH2012 = 'https://waterfootprint.org/media/downloads/Mekonnen-Hoekstra-2012-WaterFootprintFarmAnimalProducts.pdf';
  const COTTON = 'https://waterfootprint.org/resources/Report18.pdf';
  const WYNES = 'https://doi.org/10.1088/1748-9326/aa7541';
  const IVANOVA = 'https://doi.org/10.1088/1748-9326/ab8589';
  const EPA_CAR = 'https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle';

  // Per-serving masses are this calculator's own stated assumptions.
  const COFFEE_KG = 0.007, PATTY_KG = 0.113, ALMONDS_KG = 0.028, TSHIRT_KG = 0.25, JEANS_KG = 0.8;
  const COFFEE_W = COFFEE_KG * 139, ALMONDS_W = ALMONDS_KG * 3816, TSHIRT_W = TSHIRT_KG * 4917;
  const COFFEE_C = COFFEE_KG * 28.53, BURGER_C = PATTY_KG * 99.48;

  AIPF.DAILY_ITEMS = [
    { label: 'A cup of coffee', c: COFFEE_C, note: '7 g roasted coffee · farm to retail', src: 'Poore & Nemecek 2018', url: OWID_POORE },
    { label: 'An hour on a PS5', kwh: 0.216, note: '0.216 kWh on your grid · electricity only', src: 'Sony', url: 'https://www.playstation.com/en-gb/legal/ecodesign/' },
    { label: 'A mile in a gas car', c: 0.4, note: 'tailpipe CO₂ only', src: 'US EPA', url: EPA_CAR },
    { label: 'Printing a paperback book', c: 2.71, note: 'cradle to gate', src: 'Wells et al. 2012', url: 'https://doi.org/10.1111/j.1530-9290.2011.00414.x' },
    { label: 'A beef burger', c: BURGER_C, lo: PATTY_KG * 33.3, hi: BURGER_C, note: '113 g patty · farm to retail; low end is dairy-herd beef', src: 'Poore & Nemecek 2018', url: OWID_POORE },
  ];
  AIPF.ANNUAL_ITEMS = [
    { label: 'A pair of jeans', c: 33.4, dir: 'add', note: 'one pair · life cycle', src: 'Levi Strauss & Co.', url: 'https://www.levistrauss.com/wp-content/uploads/2015/03/Full-LCA-Results-Deck-FINAL.pdf' },
    { label: 'A new smartphone (manufacturing)', c: 42, dir: 'add', note: 'one model · manufacturing only', src: 'Apple', url: 'https://www.apple.com/environment/pdf/products/iphone/iPhone_17_PER_Sept2025.pdf' },
    { label: 'A year of daily coffee', c: 365 * COFFEE_C, dir: 'add', note: '7 g a cup · farm to retail', src: 'Poore & Nemecek 2018', url: OWID_POORE },
    { label: 'A new laptop (manufacturing)', c: 110, dir: 'add', note: 'one model · manufacturing only', src: 'Apple', url: 'https://www.apple.com/environment/pdf/products/notebooks/M4_MacBook_Air_PER_March2025.pdf' },
    { label: 'A new 55-inch TV (manufacturing)', c: 370, dir: 'add', note: 'signage-display proxy · manufacturing only', src: 'Samsung', url: 'https://www.samsung.com/global/sustainability/landing_hub-file/AY_wFeS6BzIALYNu/Signage_QMC_Environmental_Report_EN_2503.pdf' },
    { label: 'A beef burger every week', c: 52 * BURGER_C, dir: 'add', note: '113 g patty · farm to retail', src: 'Poore & Nemecek 2018', url: OWID_POORE },
    { label: 'A transatlantic round-trip flight', c: 1600, dir: 'add', note: 'per passenger', src: 'Wynes & Nicholas 2017', url: WYNES },
    { label: 'A year of driving', c: 4600, dir: 'add', note: '11,500 miles · tailpipe CO₂ only', src: 'US EPA', url: EPA_CAR },
    { label: 'Hang-drying your clothes', c: 210, dir: 'save', note: 'per person a year', src: 'Wynes & Nicholas 2017', url: WYNES },
    { label: 'Recycling for a year', c: 210, dir: 'save', note: 'comprehensive recycling, per person', src: 'Wynes & Nicholas 2017', url: WYNES },
    { label: 'Switching to a hybrid car', c: 700, lo: -200, hi: 3100, dir: 'save', note: 'per person a year', src: 'Ivanova et al. 2020', url: IVANOVA },
    { label: 'Heat-pump heating', c: 800, dir: 'save', note: 'per person a year', src: 'Ivanova et al. 2020', url: IVANOVA },
    { label: 'A deep retrofit of your home', c: 900, dir: 'save', note: 'per person a year', src: 'Ivanova et al. 2020', url: IVANOVA },
    { label: 'Going vegan', c: 900, dir: 'save', note: 'per person a year', src: 'Ivanova et al. 2020', url: IVANOVA },
    { label: 'Buying green electricity', c: 1500, lo: 300, hi: 2500, dir: 'save', note: 'per person a year', src: 'Ivanova et al. 2020', url: IVANOVA },
    { label: 'Switching to an electric car', c: 2000, lo: -1900, hi: 5400, dir: 'save', note: 'per person a year; Wynes & Nicholas give 1.15 t', src: 'Ivanova et al. 2020', url: IVANOVA },
    { label: 'Living car-free', c: 2400, dir: 'save', note: 'per person a year; Ivanova et al.: median 2.0 t (0.6–3.6 t)', src: 'Wynes & Nicholas 2017', url: WYNES },
  ];

  AIPF.DAILY_WATER_ITEMS = [
    { label: 'A cup of coffee', w: COFFEE_W, note: '7 g roasted coffee · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'A slice of bread', w: 0.03 * 301, note: '30 g wheat bread · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'An egg', w: 0.06 * 244, note: '60 g · blue water', src: 'Mekonnen & Hoekstra 2012', url: MH2012 },
    { label: 'A glass of milk', w: 0.25 * 86, note: '250 g · blue water', src: 'Mekonnen & Hoekstra 2012', url: MH2012 },
    { label: 'A bowl of rice', w: 0.075 * 443, note: '75 g dry husked rice · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'An avocado', w: 0.2 * 283, note: '200 g · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'A beef burger', w: PATTY_KG * 550, lo: PATTY_KG * 67, hi: PATTY_KG * 2000, note: '113 g patty · blue water, global average; range from UK beef to US irrigated systems', src: 'Mekonnen & Hoekstra 2012', url: MH2012,
      src2: 'Hess & Williams 2023', url2: 'https://theconversation.com/heres-how-much-water-it-takes-to-make-a-serving-of-beef-and-why-where-it-comes-from-is-so-important-208155' },
    { label: 'A handful of almonds', w: ALMONDS_W, note: '28 g shelled · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'A day of home electricity', kwh: 10791 / 365, note: '29.6 kWh, the US average × 4.35 L/kWh · power-plant water', src: 'US EIA', url: 'https://www.eia.gov/tools/faqs/faq.php?id=97',
      src2: 'Berkeley Lab', url2: 'https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf' },
  ];
  AIPF.ANNUAL_WATER_ITEMS = [
    { label: 'A year of daily coffee', w: 365 * COFFEE_W, dir: 'add', note: '7 g a cup · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'A cotton T-shirt', w: TSHIRT_W, dir: 'add', note: '250 g of cotton textile · blue water', src: 'Chapagain et al. 2005', url: COTTON },
    { label: 'A pair of jeans', w: JEANS_KG * 4917, dir: 'add', note: '800 g, cotton only · blue water', src: 'Chapagain et al. 2005', url: COTTON },
    { label: 'A year of daily almonds', w: 365 * ALMONDS_W, dir: 'add', note: '28 g a day · blue water', src: 'Mekonnen & Hoekstra 2011', url: MH2011 },
    { label: 'Buying five fewer cotton garments', w: 5 * TSHIRT_W, dir: 'save', note: 'five 250 g T-shirts a year · blue water', src: 'Chapagain et al. 2005', url: COTTON },
  ];

  AIPF.GAL_TO_L = 3.785411784;
  AIPF.DAYS = 365;
})(window.AIPF = window.AIPF || {});
