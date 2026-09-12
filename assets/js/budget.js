/**
 * budget.js — FEATURE 3: Monthly budget, alerts, and model-swap suggestions.
 *
 * Knowing your footprint does not change it. This gives an employee a monthly
 * allowance, shows month-to-date against it with a live pace projection, warns
 * before the cap rather than after, and — the part that actually helps — ranks
 * the specific model swaps in their own logged usage by how much each would
 * save.
 *
 * Month-to-date is summed from the tracker's per-day logs, so the budget and
 * the tracker can never disagree.
 */
(function (AIPF) {
  'use strict';

  const { el, store } = AIPF;

  // The next model down within the same provider's family. Only one step, and
  // never across providers: moving an agent session from Opus straight to
  // Haiku would show a far bigger saving, but it is not a substitution most
  // teams can actually make, and advice nobody can follow is not advice.
  // Someone who takes the step down sees the next one on their return.
  const NEXT_DOWN = {
    'gpt-5.5-pro':            'gpt-5.5',
    'gpt-5.5':                'gpt-5.4-mini',
    'claude-opus-4-8':        'claude-sonnet-4-6',
    'claude-sonnet-4-6':      'claude-haiku-4-5-20251001',
    'gemini-3.1-pro-preview': 'gemini-3.5-flash',
    'gemini-3.5-flash':       'gemini-3.1-flash-lite',
  };

  const WARN_AT = 0.75;   // amber from here
  const OVER_AT = 1.0;
  const SUGGESTIONS_SHOWN = 3;

  let root = null;

  // Budgets are kept per metric, in base units (g CO2e / liters).
  const budget = { carbon: null, water: null, dismissed: null };
  AIPF.budget = budget;

  const amount = () => budget[AIPF.state.metric];

  // ---- Month-to-date ----
  function monthDays() {
    const now = new Date();
    const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return { elapsed: now.getDate(), total: total, left: total - now.getDate() };
  }
  function monthKeys() {
    const now = new Date();
    const out = [];
    for (let d = 1; d <= now.getDate(); d++) {
      out.push(AIPF.dayKey(new Date(now.getFullYear(), now.getMonth(), d)));
    }
    return out;
  }
  function monthToDate(metric) {
    let t = 0;
    for (const k of monthKeys()) t += AIPF.trackerDayTotal(k, metric);
    return t;
  }

  // ---- Defaults ----
  // Anchor the starting budget to the company average where a roster exists,
  // so the first number an employee sees is a real reference point rather
  // than an arbitrary round figure.
  function defaultBudget(metric) {
    const d = AIPF.TEAM_DATA;
    const days = monthDays().total;
    if (d && Array.isArray(d.teams) && d.teams.length) {
      let total = 0, covered = 0;
      for (const t of d.teams) {
        for (const p of t.profile) {
          const model = AIPF.getModel(p.model);
          if (!model.sizes[p.size]) continue;
          total += p.count * AIPF.perPromptTriple(model, p.size, metric)[0] * t.headcount;
        }
        covered += t.headcount;
      }
      const perPerson = total / (d.company.headcount || covered);
      if (perPerson > 0) return perPerson * days;
    }
    return metric === 'carbon' ? 5000 : 400; // 5 kg CO2e, or 400 L, a month
  }

  // ---- Model-swap suggestions ----
  // Rank the swaps available in this month's actual usage by monthly saving.
  function suggestions(metric) {
    const days = monthDays();
    const scale = days.elapsed > 0 ? days.total / days.elapsed : 1; // month-to-date -> full month

    // Aggregate the month's logged prompts by model + size.
    const byKey = new Map();
    for (const k of monthKeys()) {
      for (const e of AIPF.trackerLoadDay(k)) {
        const key = e.m + '|' + e.s;
        if (!byKey.has(key)) byKey.set(key, { model: e.m, size: e.s, count: 0 });
        byKey.get(key).count++;
      }
    }
    // With nothing logged, fall back to the rows on screen so the panel is
    // still useful for someone exploring an estimate.
    if (!byKey.size) {
      for (const r of AIPF.state.rows) {
        if (!r.count) continue;
        const key = r.model + '|' + r.size;
        if (!byKey.has(key)) byKey.set(key, { model: r.model, size: r.size, count: 0 });
        byKey.get(key).count += r.count * days.total;
      }
      if (!byKey.size) return [];
      return rank(byKey, metric, 1);
    }
    return rank(byKey, metric, scale);
  }

  function rank(byKey, metric, scale) {
    const out = [];
    for (const u of byKey.values()) {
      const altId = NEXT_DOWN[u.model];
      if (!altId) continue;
      const from = AIPF.getModel(u.model);
      const to = AIPF.getModel(altId);
      if (!from.sizes[u.size] || !to.sizes[u.size]) continue;
      const fromCost = AIPF.perPromptTriple(from, u.size, metric)[0];
      const toCost = AIPF.perPromptTriple(to, u.size, metric)[0];
      const count = Math.round(u.count * scale);
      const saving = (fromCost - toCost) * count;
      if (saving <= 0 || count <= 0) continue;
      const size = AIPF.getSize(u.size);
      out.push({
        fromName: from.name, toName: to.name,
        // Singular reads better for a one-off; plural for the usual case.
        what: count === 1 ? AIPF.sizeLabel(u.model, size).replace(/^An? /, '').toLowerCase()
                          : (size.plural || 'prompts'),
        count: count,
        saving: saving,
        share: fromCost > 0 ? (1 - toCost / fromCost) * 100 : 0,
      });
    }
    return out.sort((a, b) => b.saving - a.saving);
  }

  // ---- Rendering ----
  function renderInput() {
    const metric = AIPF.state.metric;
    const input = root.querySelector('#aipf-bg-amount');
    const unit = root.querySelector('#aipf-bg-unit');
    const amt = amount();
    if (metric === 'carbon') {
      unit.textContent = 'kg CO₂e per month';
      input.value = String(Math.round((amt / 1000) * 100) / 100);
    } else {
      unit.textContent = 'L per month';
      input.value = String(Math.round(amt * 10) / 10);
    }
  }

  function renderMeter() {
    const metric = AIPF.state.metric;
    const amt = amount();
    const mtd = monthToDate(metric);
    const days = monthDays();
    const frac = amt > 0 ? mtd / amt : 0;

    const state = frac >= OVER_AT ? 'is-over' : frac >= WARN_AT ? 'is-warn' : 'is-ok';
    const meter = root.querySelector('#aipf-bg-meter');
    meter.className = 'aipf-bg-meter ' + state;
    root.querySelector('#aipf-bg-fill').style.width = Math.min(100, Math.max(0, frac * 100)).toFixed(1) + '%';

    root.querySelector('#aipf-bg-pct').textContent = Math.round(frac * 100) + '% used';
    root.querySelector('#aipf-bg-used').textContent =
      AIPF.fmtMetric(mtd) + ' of ' + AIPF.fmtMetric(amt) + ' · day ' + days.elapsed + ' of ' + days.total;

    // Pace: straight-line from the month so far.
    const paced = days.elapsed > 0 ? (mtd / days.elapsed) * days.total : 0;
    const pace = root.querySelector('#aipf-bg-pace');
    if (mtd <= 0) {
      pace.className = 'aipf-bg-pace';
      pace.textContent = 'Nothing logged this month yet.';
    } else if (paced > amt) {
      pace.className = 'aipf-bg-pace is-over';
      pace.innerHTML = 'On pace for <b>' + AIPF.fmtMetric(paced) + '</b> — ' +
        AIPF.sig(((paced - amt) / amt) * 100) + '% over budget. ' +
        'That leaves <b>' + AIPF.fmtMetric(Math.max(0, amt - mtd)) + '</b> for ' + days.left + ' more days.';
    } else {
      pace.className = 'aipf-bg-pace is-ok';
      pace.innerHTML = 'On pace for <b>' + AIPF.fmtMetric(paced) + '</b> — inside budget, with <b>' +
        AIPF.fmtMetric(Math.max(0, amt - mtd)) + '</b> left for ' + days.left + ' more days.';
    }
    return { frac, mtd, amt };
  }

  // A single alert, shown once per month per threshold crossed, and dismissible
  // so the page warns rather than nags.
  function renderAlert(frac) {
    const box = root.querySelector('#aipf-bg-alert');
    const mk = AIPF.monthKey();
    const level = frac >= OVER_AT ? 'over' : frac >= WARN_AT ? 'warn' : null;
    if (!level || budget.dismissed === mk + ':' + level) { box.hidden = true; return; }

    box.hidden = false;
    box.className = 'aipf-bg-alert ' + (level === 'over' ? 'is-over' : 'is-warn');
    box.innerHTML = '';
    const text = level === 'over'
      ? 'You have used your whole ' + AIPF.metricWord() + ' budget for this month. The swaps below are the quickest way back under.'
      : 'You are past three quarters of this month’s ' + AIPF.metricWord() + ' budget.';
    box.appendChild(el('span', 'aipf-bg-alert-text', AIPF.esc(text)));
    const x = el('button', 'aipf-bg-alert-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Dismiss this alert');
    x.addEventListener('click', () => {
      budget.dismissed = mk + ':' + level;
      store.set('budget:dismissed', budget.dismissed);
      box.hidden = true;
    });
    box.appendChild(x);
  }

  function renderSuggestions(gap) {
    const metric = AIPF.state.metric;
    const box = root.querySelector('#aipf-bg-swaps');
    const list = suggestions(metric).slice(0, SUGGESTIONS_SHOWN);
    box.innerHTML = '';
    if (!list.length) {
      box.appendChild(el('p', 'aipf-bg-empty',
        'Everything logged so far is already on the smallest model its provider offers. Shorter outputs are the remaining lever: cost scales with reply length.'));
      return;
    }
    for (const s of list) {
      const row = el('div', 'aipf-bg-swap');
      row.appendChild(el('p', 'aipf-bg-swap-what',
        'Your <b>' + s.count.toLocaleString('en-US') + ' ' + AIPF.esc(s.what) + '</b> a month on ' +
        AIPF.esc(s.fromName) + ' <span class="aipf-bg-arrow">&rarr;</span> <b>' + AIPF.esc(s.toName) + '</b>'));
      const right = el('div', 'aipf-bg-swap-right');
      right.appendChild(el('span', 'aipf-bg-swap-save', '−' + AIPF.fmtMetric(s.saving)));
      right.appendChild(el('span', 'aipf-bg-swap-pct', AIPF.sig(s.share) + '% cheaper each'));
      row.appendChild(right);
      // Say plainly when a single swap would close the gap.
      if (gap > 0 && s.saving >= gap) row.appendChild(el('span', 'aipf-bg-swap-enough', 'enough on its own'));
      box.appendChild(row);
    }
  }

  function render() {
    if (budget.carbon == null) budget.carbon = defaultBudget('carbon');
    if (budget.water == null) budget.water = defaultBudget('water');
    renderInput();
    const m = renderMeter();
    renderAlert(m.frac);
    // The gap is what a full month is projected to overshoot by.
    const days = monthDays();
    const paced = days.elapsed > 0 ? (m.mtd / days.elapsed) * days.total : 0;
    renderSuggestions(Math.max(0, paced - m.amt));
  }

  // ---- Wiring ----
  function save() {
    store.set('budget', { carbon: budget.carbon, water: budget.water });
  }
  function setFromInput(raw) {
    const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
    if (!isFinite(n) || n <= 0) return;
    budget[AIPF.state.metric] = AIPF.state.metric === 'carbon' ? n * 1000 : n;
    save();
    AIPF.emitUpdate();
  }

  AIPF.initBudget = function (rootEl) {
    root = rootEl;
    const saved = store.get('budget', null);
    if (saved && typeof saved === 'object') {
      if (typeof saved.carbon === 'number' && saved.carbon > 0) budget.carbon = saved.carbon;
      if (typeof saved.water === 'number' && saved.water > 0) budget.water = saved.water;
    }
    budget.dismissed = store.get('budget:dismissed', null);

    const input = root.querySelector('#aipf-bg-amount');
    input.addEventListener('change', (e) => setFromInput(e.target.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') setFromInput(e.target.value); });

    // Presets tie the budget to the comparisons the company already uses.
    root.querySelector('#aipf-bg-presets').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-preset]');
      if (!btn) return;
      const metric = AIPF.state.metric;
      const base = defaultBudget(metric);
      const mult = parseFloat(btn.dataset.preset);
      budget[metric] = base * mult;
      save();
      AIPF.emitUpdate();
    });

    AIPF.onUpdate(render);
  };
})(window.AIPF = window.AIPF || {});
