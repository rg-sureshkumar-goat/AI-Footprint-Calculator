/**
 * core.js — shared state, formatting, and the carbon / water math.
 *
 * Base units throughout: carbon in grams CO2e, water in liters. Everything the
 * UI renders is derived from these two, so a value can be moved between the
 * calculator, the live tracker, the team view, and the budget without
 * conversion bugs.
 *
 * Ported from Andy Masley's original calculator (CC0).
 */
(function (AIPF) {
  'use strict';

  const { MODELS, SIZES, LOCATIONS, HOMES, DRIVING, DIETS, FLYING,
          SIZE_LABEL_OVERRIDES, GAL_TO_L, DAYS,
          TOKENS_PER_WORD, TOKENS_PER_LINE, CODE_FRACTION } = AIPF;

  let uidSeq = 1;
  AIPF.nextUid = () => uidSeq++;

  // The single source of truth the whole app reads from.
  AIPF.state = {
    rows: [], metric: 'carbon',
    loc: 'us', home: 'med', drive: 'davg', diet: 'avg', fly: 'some',
  };
  const state = AIPF.state;

  AIPF.getModel = (id) => MODELS.find((m) => m.id === id) || MODELS[0];
  AIPF.getLoc = () => LOCATIONS.find((x) => x.id === state.loc) || LOCATIONS[0];
  AIPF.getSize = (id) => SIZES.find((s) => s.id === id) || SIZES[0];

  AIPF.sizeLabel = function (modelId, s) {
    const o = SIZE_LABEL_OVERRIDES[modelId];
    return (o && o[s.id]) ? o[s.id] : s.label;
  };

  // ---- Formatting ----
  function fmtNum(n) {
    if (n >= 100) return Math.round(n).toLocaleString('en-US');
    if (n >= 10) return n.toFixed(1);
    if (n >= 1) return n.toFixed(2);
    if (n >= 0.01) return n.toFixed(3);
    return n > 0 ? n.toPrecision(2) : '0';
  }
  function fmtCarbon(g) {
    if (g >= 1e6) return fmtNum(g / 1e6) + ' t CO₂e';
    if (g >= 1000) return fmtNum(g / 1000) + ' kg CO₂e';
    return fmtNum(g) + ' g CO₂e';
  }
  function fmtWater(l) {
    if (l >= 1) return fmtNum(l) + ' L';
    return fmtNum(l * 1000) + ' mL';
  }
  const fmtMetric = (v) => (state.metric === 'carbon' ? fmtCarbon(v) : fmtWater(v));
  const metricWord = () => (state.metric === 'carbon' ? 'carbon' : 'water');

  // ~2 significant figures, rounded not padded, for chart labels.
  function sig(n) {
    if (!isFinite(n) || n === 0) return '0';
    const a = Math.abs(n);
    if (a >= 1000) return Math.round(n).toLocaleString('en-US');
    if (a >= 10) return String(Math.round(n));
    if (a >= 1) return String(Math.round(n * 10) / 10);
    if (a >= 0.1) return String(Math.round(n * 100) / 100);
    return String(Number(n.toPrecision(2)));
  }
  // One fixed unit per chart so bar values are directly comparable.
  function chartUnit(metric, scale) {
    if (metric === 'carbon') return scale === 'annual' ? 'kg' : 'g';
    return 'L';
  }
  function fmtUnit(v, unit) {
    if (unit === 'g') return sig(v) + ' g CO₂e';
    if (unit === 'kg') return sig(v / 1000) + ' kg CO₂e';
    if (unit === 't') return sig(v / 1e6) + ' t CO₂e';
    if (unit === 'mL') return sig(v * 1000) + ' mL';
    if (unit === 'L') return sig(v) + ' L';
    return sig(v);
  }
  function fmtEnergy(wh) { return wh >= 1000 ? fmtNum(wh / 1000) + ' kWh' : fmtNum(wh) + ' Wh'; }
  function fmtWords(n) { return n >= 1e6 ? fmtNum(n / 1e6) + ' million' : Math.round(n).toLocaleString('en-US'); }
  function fmtReadingTime(minutes) {
    if (minutes < 1) return 'under a minute';
    if (minutes < 90) { const m = Math.round(minutes); return m + ' minute' + (m === 1 ? '' : 's'); }
    const hours = minutes / 60;
    if (hours < 48) return fmtNum(hours) + ' hours';
    const days = hours / 24;
    if (days < 14) return fmtNum(days) + ' days';
    const weeks = days / 7;
    if (weeks < 9) return fmtNum(weeks) + ' weeks';
    const months = days / 30.44;
    if (months < 18) return fmtNum(months) + ' months';
    return fmtNum(days / 365) + ' years';
  }
  // Percentages appear in several places; keep one rounding rule for all of them.
  function fmtPct(pct) {
    if (pct >= 1) return pct.toFixed(pct >= 10 ? 0 : 1) + '%';
    if (pct >= 0.01) return pct.toFixed(2) + '%';
    return pct > 0 ? 'under 0.01%' : '0%';
  }

  Object.assign(AIPF, { fmtNum, fmtCarbon, fmtWater, fmtMetric, metricWord, sig,
                        chartUnit, fmtUnit, fmtEnergy, fmtWords, fmtReadingTime, fmtPct });

  // ---- Math (base units: carbon grams, water liters) ----

  // Mean, low, and high impact of one prompt. Carbon = electricity costed on the
  // selected region's grid + EcoLogits' (grid-independent) embodied hardware carbon.
  // Energy (Wh) is available too, for the panels that show it beside the metric.
  function perPromptTriple(model, size, metric) {
    const s = model.sizes[size];
    if (metric === 'energy') return [s.wh, s.whmin, s.whmax];
    if (metric === 'carbon') {
      const grid = AIPF.getLoc().grid; // g CO2e per kWh
      return [
        (s.wh / 1000) * grid + s.emb,
        (s.whmin / 1000) * grid + s.embmin,
        (s.whmax / 1000) * grid + s.embmax,
      ];
    }
    return [s.ml / 1000, s.mlmin / 1000, s.mlmax / 1000];
  }
  const perPrompt = (modelId, sizeId, metric) => perPromptTriple(AIPF.getModel(modelId), sizeId, metric)[0];

  function totalPrompts() { let n = 0; for (const r of state.rows) n += r.count || 0; return n; }

  // ---- Tracker log entries ----
  // Each logged entry has a kind. Entries saved before kinds existed have none
  // and are prompts. Only the AI kinds ever reach the AI total; digital
  // activities belong to the separate digital-day total.
  const AI_KINDS = ['prompt', 'image', 'session'];
  const entryKind = (e) => e.k || 'prompt';
  const isAiEntry = (e) => AI_KINDS.indexOf(entryKind(e)) !== -1;

  // Convert an energy triple (Wh) to the metric asked for. Carbon is the
  // electricity on the selected grid, with no embodied carbon; water uses the
  // derived data-centre factor (on-site plus power-plant water).
  function fromEnergy(wh, metric) {
    if (metric === 'energy') return wh.slice();
    if (metric === 'carbon') {
      const grid = AIPF.getLoc().grid;
      return wh.map((x) => (x / 1000) * grid);
    }
    return wh.map((x) => (x / 1000) * AIPF.DC_WATER_L_PER_KWH);
  }

  // One generated image, from the general evidence range (no model or settings).
  const imageTriple = (metric) => fromEnergy([AIPF.IMAGE.wh, AIPF.IMAGE.whmin, AIPF.IMAGE.whmax], metric);

  // Mean, low, and high impact of one logged entry, in carbon, water, or energy.
  function entryTriple(entry, metric) {
    const kind = entryKind(entry);
    if (kind === 'prompt') {
      const model = AIPF.getModel(entry.m);
      if (!model.sizes[entry.s]) return [0, 0, 0];
      return perPromptTriple(model, entry.s, metric);
    }
    if (kind === 'image') return imageTriple(metric);
    // Agent sessions (feature 2) are costed here once their figures are added;
    // any other kind is not AI use.
    return [0, 0, 0];
  }

  // Today's logged entries that count toward the AI total. The tracker
  // replaces this while its log is driving the page.
  AIPF.aiLoggedEntries = () => [];

  // The AI total: the one place it is computed. Typed-in (or log-derived)
  // prompt rows, plus today's logged entries that are not prompts, since
  // logged prompts already reach the rows through the tracker.
  function aiDailyTriple(metric) {
    let a = 0, b = 0, c = 0;
    for (const r of state.rows) {
      if (!r.count) continue;
      const t = perPromptTriple(AIPF.getModel(r.model), r.size, metric);
      a += r.count * t[0]; b += r.count * t[1]; c += r.count * t[2];
    }
    for (const e of AIPF.aiLoggedEntries()) {
      if (entryKind(e) === 'prompt' || !isAiEntry(e)) continue;
      const t = entryTriple(e, metric);
      a += t[0]; b += t[1]; c += t[2];
    }
    return [a, b, c];
  }
  const aiDaily = (metric) => aiDailyTriple(metric)[0];
  const aiDailyEnergy = () => aiDailyTriple('energy')[0];
  // How many of today's counted entries are of a given kind (e.g. 'image').
  const aiLoggedCount = (kind) => AIPF.aiLoggedEntries().filter((e) => entryKind(e) === kind).length;

  function dailyFootprint(metric) {
    const loc = AIPF.getLoc();
    const home = HOMES.find((x) => x.id === state.home) || HOMES[1];
    const drive = DRIVING.find((x) => x.id === state.drive) || DRIVING[2];
    const diet = DIETS.find((x) => x.id === state.diet) || DIETS[1];
    const fly = FLYING.find((x) => x.id === state.fly) || FLYING[2];
    if (metric === 'carbon') return ((loc.c + home.c + drive.c + diet.c + fly.c) * 1000) / DAYS;
    return ((loc.w + home.w + drive.w + diet.w + fly.w) * GAL_TO_L) / DAYS;
  }
  function itemBase(item, metric) { return metric === 'carbon' ? item.c * 1000 : item.w * GAL_TO_L; }

  // An "agent" row is real code only when the model has not relabelled that size.
  function isCodeRow(row) {
    if (row.size !== 'agent') return false;
    const o = SIZE_LABEL_OVERRIDES[row.model];
    return !(o && o.agent);
  }
  function linesForSize(s) { return Math.round((s.w / TOKENS_PER_WORD) * CODE_FRACTION / TOKENS_PER_LINE); }
  function dailyWords() {
    let n = 0;
    for (const r of state.rows) if (r.count && !isCodeRow(r)) n += r.count * AIPF.getSize(r.size).w;
    return n;
  }
  function dailyCodeLines() {
    let n = 0;
    for (const r of state.rows) if (r.count && isCodeRow(r)) n += r.count * linesForSize(AIPF.getSize(r.size));
    return n;
  }

  Object.assign(AIPF, { perPromptTriple, perPrompt, totalPrompts, entryKind, isAiEntry,
                        fromEnergy, imageTriple, entryTriple, aiDailyTriple, aiDaily, aiLoggedCount,
                        aiDailyEnergy, dailyFootprint, itemBase, isCodeRow, linesForSize,
                        dailyWords, dailyCodeLines });

  // ---- DOM helpers ----
  AIPF.el = function (tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  AIPF.option = function (value, text, selected) {
    const o = document.createElement('option');
    o.value = value; o.textContent = text;
    if (selected) o.selected = true;
    return o;
  };
  AIPF.esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  AIPF.escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Features subscribe here so a change anywhere re-renders everything that
  // depends on it. Keeps the tracker, team view, and budget in step with the
  // calculator without any of them knowing about each other.
  const listeners = [];
  AIPF.onUpdate = (fn) => { listeners.push(fn); };
  AIPF.emitUpdate = function () {
    for (const fn of listeners) {
      try { fn(); } catch (e) { console.error('AIPF update listener failed', e); }
    }
  };
})(window.AIPF = window.AIPF || {});
