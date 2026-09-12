/**
 * tracker.js — FEATURE 1: Live session tracker.
 *
 * The original calculator asks you to describe an average day. That is the
 * wrong question for someone who uses AI all day at work: nobody knows their
 * own average, and the estimate never changes as the day goes on. This logs
 * prompts as they actually happen, keeps a running total that updates live,
 * and projects where the day is heading at the current pace.
 *
 * When "use my log" is on, today's log drives the whole page — the verdict,
 * the comparison charts, the budget, and the team view all read real usage
 * instead of a guess.
 *
 * Entries are stored per local day under aipf:log:<YYYY-MM-DD>, so they survive
 * a refresh and build a history the team and budget features read back.
 */
(function (AIPF) {
  'use strict';

  const { el, store } = AIPF;
  const RECENT_SHOWN = 6;
  const RETAIN_DAYS = 120;          // how much history to keep when pruning
  const TICK_MS = 20000;            // how often the "live" readouts refresh

  // Quick-log buttons, chosen to cover the shapes of work that actually differ
  // in cost: a normal exchange, a long document, and a full agent run.
  const QUICK = [
    { label: 'Quick chat',    size: 'chat',   hint: 'a normal back-and-forth reply' },
    { label: 'Long output',   size: 'report', hint: 'a multi-page document' },
    { label: 'Agent session', size: 'agent',  hint: 'a full coding / agent run' },
  ];

  let root = null;
  let tickTimer = null;

  const tracker = {
    useLog: true,
    model: 'claude-sonnet-4-6',
    size: 'chat',
    today: [],      // [{ t: epoch ms, m: modelId, s: sizeId }]
  };
  AIPF.tracker = tracker;

  // ---- Persistence ----
  const logKey = (day) => 'log:' + day;

  function loadDay(day) {
    const v = store.get(logKey(day), []);
    return Array.isArray(v) ? v : [];
  }
  function saveToday() {
    store.set(logKey(AIPF.dayKey()), tracker.today);
    store.set('tracker:prefs', { useLog: tracker.useLog, model: tracker.model, size: tracker.size });
  }
  function loadPrefs() {
    const p = store.get('tracker:prefs', null);
    if (!p || typeof p !== 'object') return;
    if (typeof p.useLog === 'boolean') tracker.useLog = p.useLog;
    if (AIPF.MODELS.some((m) => m.id === p.model)) tracker.model = p.model;
    if (AIPF.SIZES.some((s) => s.id === p.size)) tracker.size = p.size;
  }
  // Drop logs older than the retention window so storage does not grow forever.
  function prune() {
    const keep = new Set(AIPF.dayKeysBack(RETAIN_DAYS));
    try {
      for (let i = window.localStorage.length - 1; i >= 0; i--) {
        const k = window.localStorage.key(i);
        if (!k || k.indexOf('aipf:log:') !== 0) continue;
        if (!keep.has(k.slice('aipf:log:'.length))) window.localStorage.removeItem(k);
      }
    } catch (e) { /* storage unavailable; nothing to prune */ }
  }

  // ---- Totals ----
  // One entry's cost, in the metric asked for. Reads the same per-prompt figures
  // as the calculator, so a logged prompt and a typed-in prompt always agree.
  function entryCost(entry, metric) {
    const model = AIPF.getModel(entry.m);
    if (!model.sizes[entry.s]) return 0;
    return AIPF.perPromptTriple(model, entry.s, metric)[0];
  }
  function sumEntries(entries, metric) {
    let t = 0;
    for (const e of entries) t += entryCost(e, metric);
    return t;
  }
  AIPF.trackerDayTotal = function (day, metric) {
    const entries = day === AIPF.dayKey() ? tracker.today : loadDay(day);
    return sumEntries(entries, metric);
  };
  AIPF.trackerDayCount = function (day) {
    return (day === AIPF.dayKey() ? tracker.today : loadDay(day)).length;
  };
  AIPF.trackerLoadDay = loadDay;

  // Collapse the log into the calculator's row shape: one row per
  // model + output-size pair, counted.
  function rowsFromLog() {
    const byKey = new Map();
    for (const e of tracker.today) {
      const k = e.m + '|' + e.s;
      if (!byKey.has(k)) byKey.set(k, { model: e.m, size: e.s, count: 0 });
      byKey.get(k).count++;
    }
    return Array.from(byKey.values())
      .sort((a, b) => b.count - a.count)
      .map((r) => ({ uid: AIPF.nextUid(), model: r.model, size: r.size, count: r.count }));
  }
  // Push the log into shared state so every other panel reflects real usage.
  function syncRows() {
    if (!tracker.useLog) return;
    AIPF.state.rows = rowsFromLog();
    AIPF.renderRows();
  }
  AIPF.trackerSyncRows = syncRows;

  // ---- Logging ----
  function logPrompt(modelId, sizeId, count) {
    const now = Date.now();
    for (let i = 0; i < (count || 1); i++) tracker.today.push({ t: now, m: modelId, s: sizeId });
    saveToday();
    syncRows();
    AIPF.emitUpdate();
  }
  function undoLast() {
    if (!tracker.today.length) return;
    tracker.today.pop();
    saveToday(); syncRows(); AIPF.emitUpdate();
  }
  function clearToday() {
    tracker.today = [];
    saveToday(); syncRows(); AIPF.emitUpdate();
  }

  // ---- Pace ----
  // Straight-line projection from the working day so far. Deliberately simple:
  // the point is a directional "where is this heading", not a forecast.
  function paceProjection(metric) {
    if (tracker.today.length < 2) return null;
    const first = tracker.today[0].t;
    const now = Date.now();
    const elapsedH = (now - first) / 3600000;
    if (elapsedH < 0.25) return null;  // too early to say anything useful
    const so_far = sumEntries(tracker.today, metric);
    const perHour = so_far / elapsedH;
    const end = new Date(); end.setHours(18, 0, 0, 0);
    const leftH = Math.max(0, (end - now) / 3600000);
    if (leftH < 0.25) return null;     // past the end of the day
    return { total: so_far + perHour * leftH, perHour: perHour };
  }

  function agoText(ts) {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 minute ago';
    if (mins < 60) return mins + ' minutes ago';
    const h = Math.floor(mins / 60);
    return h === 1 ? '1 hour ago' : h + ' hours ago';
  }
  function timeText(ts) {
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  // ---- Rendering ----
  function renderHeadline() {
    const metric = AIPF.state.metric;
    const total = sumEntries(tracker.today, metric);
    const n = tracker.today.length;
    root.querySelector('#aipf-tk-total').textContent = AIPF.fmtMetric(total);
    root.querySelector('#aipf-tk-count').textContent = n.toLocaleString('en-US') + (n === 1 ? ' prompt' : ' prompts');

    const live = root.querySelector('#aipf-tk-live');
    const paceBox = root.querySelector('#aipf-tk-pace');
    if (!n) {
      live.textContent = 'Nothing logged yet today.';
      paceBox.textContent = '';
      return;
    }
    live.textContent = 'Last logged ' + agoText(tracker.today[n - 1].t) + '.';
    const p = paceProjection(metric);
    paceBox.textContent = p
      ? 'At this pace, about ' + AIPF.fmtMetric(p.total) + ' by 6pm (' + AIPF.fmtMetric(p.perHour) + ' an hour).'
      : '';
  }

  // A bar per hour of the working day, so the shape of the day is visible.
  function renderHours() {
    const metric = AIPF.state.metric;
    const box = root.querySelector('#aipf-tk-hours');
    const START = 7, END = 20;
    const buckets = new Array(END - START + 1).fill(0);
    for (const e of tracker.today) {
      const h = new Date(e.t).getHours();
      const i = Math.min(buckets.length - 1, Math.max(0, h - START));
      buckets[i] += entryCost(e, metric);
    }
    const max = Math.max.apply(null, buckets.concat([1e-9]));
    const nowH = new Date().getHours();
    box.innerHTML = '';
    buckets.forEach((v, i) => {
      const h = START + i;
      const col = el('div', 'aipf-tk-hour' + (h === nowH ? ' is-now' : ''));
      const fill = el('div', 'aipf-tk-hour-fill');
      fill.style.height = (v > 0 ? Math.max(6, (v / max) * 100) : 0).toFixed(1) + '%';
      col.appendChild(fill);
      col.title = (h % 12 === 0 ? 12 : h % 12) + (h < 12 ? 'am' : 'pm') + ': ' + AIPF.fmtMetric(v);
      box.appendChild(col);
    });
  }

  function renderRecent() {
    const box = root.querySelector('#aipf-tk-recent');
    box.innerHTML = '';
    if (!tracker.today.length) {
      box.appendChild(el('p', 'aipf-tk-empty', 'Log your first prompt to start today’s total.'));
      return;
    }
    const recent = tracker.today.slice(-RECENT_SHOWN).reverse();
    for (const e of recent) {
      const line = el('div', 'aipf-tk-entry');
      line.appendChild(el('span', 'aipf-tk-entry-time', AIPF.esc(timeText(e.t))));
      const model = AIPF.getModel(e.m);
      const size = AIPF.getSize(e.s);
      line.appendChild(el('span', 'aipf-tk-entry-what',
        AIPF.esc(model.name) + ' <span class="aipf-tk-dot">·</span> ' + AIPF.esc(AIPF.sizeLabel(e.m, size))));
      line.appendChild(el('span', 'aipf-tk-entry-val', AIPF.fmtMetric(entryCost(e, AIPF.state.metric))));
      box.appendChild(line);
    }
    if (tracker.today.length > RECENT_SHOWN) {
      box.appendChild(el('p', 'aipf-tk-more', '+ ' + (tracker.today.length - RECENT_SHOWN) + ' earlier today'));
    }
  }

  // Seven-day strip, so today has something to be compared against.
  function renderHistory() {
    const metric = AIPF.state.metric;
    const box = root.querySelector('#aipf-tk-history');
    const days = AIPF.dayKeysBack(7);
    const vals = days.map((d) => AIPF.trackerDayTotal(d, metric));
    const max = Math.max.apply(null, vals.concat([1e-9]));
    box.innerHTML = '';
    days.forEach((d, i) => {
      const cell = el('div', 'aipf-tk-day' + (i === days.length - 1 ? ' is-today' : ''));
      const track = el('div', 'aipf-tk-day-track');
      const fill = el('div', 'aipf-tk-day-fill');
      fill.style.height = (vals[i] > 0 ? Math.max(5, (vals[i] / max) * 100) : 0).toFixed(1) + '%';
      track.appendChild(fill);
      cell.appendChild(track);
      const dow = new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'narrow' });
      cell.appendChild(el('span', 'aipf-tk-day-label', AIPF.esc(dow)));
      cell.title = d + ': ' + AIPF.fmtMetric(vals[i]);
      box.appendChild(cell);
    });
  }

  function renderMode() {
    const cb = root.querySelector('#aipf-tk-uselog');
    cb.checked = tracker.useLog;
    root.classList.toggle('aipf-log-driven', tracker.useLog);
    const note = root.querySelector('#aipf-rows-note');
    if (note) {
      note.textContent = tracker.useLog
        ? 'These rows are your actual logged prompts for today. Turn off “use my log” above to enter an estimate by hand instead.'
        : '';
      note.style.display = tracker.useLog ? '' : 'none';
    }
  }

  function render() {
    renderMode(); renderHeadline(); renderHours(); renderRecent(); renderHistory();
  }

  // ---- Wiring ----
  function fillSelects() {
    const ms = root.querySelector('#aipf-tk-model');
    const groups = [];
    for (const m of AIPF.MODELS) {
      let g = groups.find((x) => x.name === m.group);
      if (!g) { g = { name: m.group, items: [] }; groups.push(g); }
      g.items.push(m);
    }
    ms.innerHTML = '';
    for (const g of groups) {
      const og = document.createElement('optgroup');
      og.label = g.name;
      for (const m of g.items) og.appendChild(AIPF.option(m.id, m.name, m.id === tracker.model));
      ms.appendChild(og);
    }
    const ss = root.querySelector('#aipf-tk-size');
    ss.innerHTML = '';
    for (const s of AIPF.SIZES) ss.appendChild(AIPF.option(s.id, AIPF.sizeLabel(tracker.model, s), s.id === tracker.size));
  }

  function bind() {
    root.querySelector('#aipf-tk-model').addEventListener('change', (e) => {
      tracker.model = e.target.value; fillSelects(); saveToday();
    });
    root.querySelector('#aipf-tk-size').addEventListener('change', (e) => {
      tracker.size = e.target.value; saveToday();
    });
    root.querySelector('#aipf-tk-log').addEventListener('click', () => logPrompt(tracker.model, tracker.size, 1));
    root.querySelector('#aipf-tk-log5').addEventListener('click', () => logPrompt(tracker.model, tracker.size, 5));

    const quickBox = root.querySelector('#aipf-tk-quick');
    for (const q of QUICK) {
      const b = el('button', 'aipf-tk-quickbtn', AIPF.esc(q.label));
      b.type = 'button';
      b.title = 'Log ' + q.hint + ' on the model selected above';
      b.addEventListener('click', () => logPrompt(tracker.model, q.size, 1));
      quickBox.appendChild(b);
    }

    root.querySelector('#aipf-tk-undo').addEventListener('click', undoLast);
    root.querySelector('#aipf-tk-clear').addEventListener('click', () => {
      if (tracker.today.length && !window.confirm('Clear everything logged today? This cannot be undone.')) return;
      clearToday();
    });
    root.querySelector('#aipf-tk-uselog').addEventListener('change', (e) => {
      tracker.useLog = e.target.checked;
      if (tracker.useLog) syncRows();
      else { AIPF.setDefaultRows(); AIPF.renderRows(); }
      saveToday(); AIPF.emitUpdate();
    });

    // Keyboard shortcut: L logs one prompt with the current selection, so
    // logging does not mean leaving what you were doing.
    document.addEventListener('keydown', (ev) => {
      if (ev.key !== 'l' && ev.key !== 'L') return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      ev.preventDefault();
      logPrompt(tracker.model, tracker.size, 1);
    });
  }

  AIPF.initTracker = function (rootEl) {
    root = rootEl;
    loadPrefs();
    prune();
    tracker.today = loadDay(AIPF.dayKey());
    fillSelects();
    bind();
    if (tracker.useLog) syncRows();

    // The "live" parts (time since last prompt, pace) are time-dependent, so
    // they need to refresh on their own even when nothing is clicked.
    tickTimer = setInterval(renderHeadline, TICK_MS);
    window.addEventListener('pagehide', () => clearInterval(tickTimer));

    // Another tab logging a prompt should show up here too.
    window.addEventListener('storage', (ev) => {
      if (ev.key !== 'aipf:' + logKey(AIPF.dayKey())) return;
      tracker.today = loadDay(AIPF.dayKey());
      syncRows(); AIPF.emitUpdate();
    });

    AIPF.onUpdate(render);
  };
})(window.AIPF = window.AIPF || {});
