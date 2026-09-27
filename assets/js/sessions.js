/**
 * sessions.js — FEATURE 2 (Project 2): Agent sessions and projects.
 *
 * A coding-agent session is mostly input, and mostly cached input, so counting
 * its output alone understates it. Sessions are logged in the tracker by
 * tokens of each type (fresh input, cache writes, cache reads, output) and
 * costed in core.js (sessionParts, sessionTriple). Each logged session counts
 * once, in its own day's AI total, while "use my log" is on.
 *
 * Sessions can carry a project name. The project view sums a project's tagged
 * sessions across the retained log history. A separate project estimate costs
 * a whole project from typed-in token totals; it is shown beside the AI total
 * and never added to it, so nothing is counted twice.
 */
(function (AIPF) {
  'use strict';

  const { el, esc } = AIPF;
  const HISTORY_DAYS = 120;  // matches the tracker's retention window
  const FIELDS = ['fresh', 'write', 'read', 'out'];
  const DEFAULT_MODEL = 'claude-opus-4-8';

  let root = null;

  // ---- Formatting ----
  // Central value in bold, range after it: every session figure has one.
  function fig(t, fmt) {
    return '<b>' + fmt(t[0]) + '</b> <span class="aipf-tk-range">(' + fmt(t[1]) + '–' + fmt(t[2]) + ')</span>';
  }
  function allMetrics(s) {
    return fig(AIPF.sessionTriple(s, 'energy'), AIPF.fmtEnergy) + ' · ' +
      fig(AIPF.sessionTriple(s, 'carbon'), AIPF.fmtCarbon) + ' · ' +
      fig(AIPF.sessionTriple(s, 'water'), AIPF.fmtWater);
  }
  function breakdown(s) {
    const p = AIPF.sessionParts(s);
    return '<ul class="aipf-ss-parts">' +
      '<li><span>Output</span><span>' + fig(p.output, AIPF.fmtEnergy) + '</span></li>' +
      '<li><span>Fresh input and cache writes</span><span>' + fig(p.input, AIPF.fmtEnergy) + '</span></li>' +
      '<li><span>Cache reads <em>(our estimate)</em></span><span>' + fig(p.cacheRead, AIPF.fmtEnergy) + '</span></li>' +
      '</ul>';
  }
  const tokens = (n) => Math.round(n).toLocaleString('en-US');

  // ---- Reading token fields ----
  // Empty means zero; anything else must be a whole number of tokens.
  function readTokens(prefix) {
    const out = {};
    for (const f of FIELDS) {
      const raw = root.querySelector('#' + prefix + f).value.replace(/[,\s]/g, '');
      if (raw === '') { out[f] = 0; continue; }
      const n = Number(raw);
      if (!isFinite(n) || n < 0 || Math.floor(n) !== n) return null;
      out[f] = n;
    }
    return out;
  }

  function fillModelSelect(sel, current) {
    sel.innerHTML = '';
    const groups = [];
    for (const m of AIPF.MODELS) {
      let g = groups.find((x) => x.name === m.group);
      if (!g) { g = { name: m.group, items: [] }; groups.push(g); }
      g.items.push(m);
    }
    for (const g of groups) {
      const og = document.createElement('optgroup');
      og.label = g.name;
      for (const m of g.items) og.appendChild(AIPF.option(m.id, m.name, m.id === current));
      sel.appendChild(og);
    }
  }

  // ---- Logging a session ----
  function logSession() {
    const msg = root.querySelector('#aipf-ss-msg');
    const t = readTokens('aipf-ss-');
    if (!t) { msg.textContent = 'Token counts must be whole numbers of zero or more.'; return; }
    if (!FIELDS.some((f) => t[f] > 0)) { msg.textContent = 'Enter at least one token count.'; return; }
    const project = root.querySelector('#aipf-ss-project').value.trim().slice(0, 60);
    const entry = Object.assign({ k: 'session', m: root.querySelector('#aipf-ss-model').value }, t);
    if (project) entry.p = project;
    AIPF.trackerLog(entry);
    msg.textContent = AIPF.tracker.useLog ? 'Session logged.' : 'Session logged. It is not counted while “Use my log” is off.';
    for (const f of FIELDS) root.querySelector('#aipf-ss-' + f).value = '';
  }

  // The most recent session logged today, with its breakdown.
  function renderLast() {
    const box = root.querySelector('#aipf-ss-last');
    const today = AIPF.tracker ? AIPF.tracker.today : [];
    let last = null;
    for (let i = today.length - 1; i >= 0; i--) if (AIPF.entryKind(today[i]) === 'session') { last = today[i]; break; }
    if (!last) { box.innerHTML = ''; return; }
    box.innerHTML =
      '<p class="aipf-ss-last-h">Last session logged' + (last.p ? ' · ' + esc(last.p) : '') + ' · ' + esc(AIPF.getModel(last.m).name) + '</p>' +
      '<p class="aipf-ss-line">' + allMetrics(last) + '</p>' + breakdown(last) +
      '<p class="aipf-ss-tok">' + tokens(last.fresh) + ' fresh input · ' + tokens(last.write) + ' cache-write · ' +
        tokens(last.read) + ' cache-read · ' + tokens(last.out) + ' output tokens</p>';
  }

  // ---- Project view ----
  function sessionsByProject() {
    const byName = new Map();
    const today = AIPF.dayKey();
    for (const day of AIPF.dayKeysBack(HISTORY_DAYS)) {
      const entries = day === today ? AIPF.tracker.today : AIPF.trackerLoadDay(day);
      for (const e of entries) {
        if (AIPF.entryKind(e) !== 'session' || !e.p) continue;
        if (!byName.has(e.p)) byName.set(e.p, []);
        byName.get(e.p).push({ day: day, e: e });
      }
    }
    return byName;
  }

  function renderProjects() {
    const box = root.querySelector('#aipf-pj-list');
    const list = root.querySelector('#aipf-ss-projects');
    const byName = sessionsByProject();
    list.innerHTML = '';
    for (const name of byName.keys()) list.appendChild(AIPF.option(name, name));
    if (!byName.size) {
      box.innerHTML = '<p class="aipf-tk-empty">No projects yet. Give a session a project name when you log it, and its sessions add up here.</p>';
      return;
    }
    const metric = AIPF.state.metric;
    const fmt = AIPF.fmtMetric;
    box.innerHTML = '';
    for (const [name, items] of byName) {
      const sum = (m) => items.reduce((acc, it) => {
        const t = AIPF.sessionTriple(it.e, m);
        return [acc[0] + t[0], acc[1] + t[1], acc[2] + t[2]];
      }, [0, 0, 0]);
      const card = el('div', 'aipf-pj-card');
      card.appendChild(el('p', 'aipf-pj-name', esc(name) + ' <span class="aipf-pj-n">' + items.length + ' session' + (items.length === 1 ? '' : 's') + '</span>'));
      card.appendChild(el('p', 'aipf-ss-line', fig(sum('energy'), AIPF.fmtEnergy) + ' · ' + fig(sum('carbon'), AIPF.fmtCarbon) + ' · ' + fig(sum('water'), AIPF.fmtWater)));
      const rows = el('div', 'aipf-pj-rows');
      for (const it of items.slice().reverse()) {
        const date = new Date(it.day + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const line = el('div', 'aipf-tk-entry');
        line.appendChild(el('span', 'aipf-tk-entry-time', esc(date)));
        line.appendChild(el('span', 'aipf-tk-entry-what', esc(AIPF.getModel(it.e.m).name)));
        line.appendChild(el('span', 'aipf-tk-entry-val', fmt(AIPF.sessionTriple(it.e, metric)[0])));
        rows.appendChild(line);
      }
      card.appendChild(rows);
      box.appendChild(card);
    }
  }

  // ---- Project estimate ----
  function fillExample() {
    for (const f of FIELDS) root.querySelector('#aipf-pe-' + f).value = tokens(AIPF.PROJECT_EXAMPLE[f]);
    root.querySelector('#aipf-pe-model').value = DEFAULT_MODEL;
  }
  function isExample(t) { return FIELDS.every((f) => t[f] === AIPF.PROJECT_EXAMPLE[f]); }

  function renderEstimate() {
    const box = root.querySelector('#aipf-pe-result');
    const t = readTokens('aipf-pe-');
    if (!t) { box.innerHTML = '<p class="aipf-ss-msg">Token counts must be whole numbers of zero or more.</p>'; return; }
    const s = Object.assign({ m: root.querySelector('#aipf-pe-model').value }, t);
    const ai = AIPF.aiDailyTriple(AIPF.state.metric);
    box.innerHTML =
      '<p class="aipf-ss-last-h">' + (isExample(t) ? 'The example project (one developer, 28 days)' : 'Your project estimate') + '</p>' +
      '<p class="aipf-ss-line">' + allMetrics(s) + '</p>' + breakdown(s) +
      '<p class="aipf-pe-beside">Beside it, your AI total today is ' + fig(ai, AIPF.fmtMetric) +
        '. This estimate is not added to that total or to any other figure on the page.</p>';
  }

  function render() { renderLast(); renderProjects(); renderEstimate(); }

  AIPF.initSessions = function (rootEl) {
    root = rootEl;
    if (!root.querySelector('#aipf-tk-session') || typeof AIPF.trackerLog !== 'function') return;
    fillModelSelect(root.querySelector('#aipf-ss-model'), AIPF.tracker.model);
    fillModelSelect(root.querySelector('#aipf-pe-model'), DEFAULT_MODEL);
    fillExample();

    root.querySelector('#aipf-ss-log').addEventListener('click', logSession);
    root.querySelector('#aipf-pe-form').addEventListener('input', renderEstimate);
    root.querySelector('#aipf-pe-model').addEventListener('change', renderEstimate);
    root.querySelector('#aipf-pe-reset').addEventListener('click', () => { fillExample(); renderEstimate(); });

    AIPF.onUpdate(render);
  };
})(window.AIPF = window.AIPF || {});
