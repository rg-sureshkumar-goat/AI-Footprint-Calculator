/**
 * digital.js — FEATURE 3 (Project 2): Digital day builder.
 *
 * Video calls, streaming, music, social media, and gaming, entered as a
 * typical day and optionally logged in the tracker as they happen. Each hour
 * counts the user's device, the home router, the network, and data centres.
 * The result is a digital-day total shown beside the AI total, never as a
 * share of it, and never read by the tracker, budget, or team view.
 *
 * Which counts is decided activity by activity: an activity logged today
 * (while "use my log" is on) replaces that activity's typical-day hours;
 * every other activity keeps them.
 *
 * Other features add their own components to the total through
 * AIPF.digitalExtras (device manufacturing, feature 4).
 */
(function (AIPF) {
  'use strict';

  const { el, esc, store } = AIPF;
  const D = AIPF.DIGITAL;
  const ACT = D.activities, DEV = D.devices;
  const CONN = { home: 'Home Wi-Fi or broadband', cell: 'Cellular' };
  const DEFAULT_QUALITY = { home: 'hd', cell: 'auto', any: 'normal' };
  const STORE_KEY = 'digital:typical';
  const MAX_HOURS = 24;

  let root = null;
  let typical = { rows: [], wifi: null };  // wifi: null = follow the sum of home Wi-Fi hours

  // Components that other features add to the digital-day total. Each is a
  // function returning null or { id, label, energy, carbon, water, summary,
  // detail, cardNote }, where energy, carbon, and water are optional triples.
  AIPF.digitalExtras = AIPF.digitalExtras || [];

  // ---- Entries: activity, device, connection, quality ----
  function qualityList(a, c) {
    const q = ACT[a] && ACT[a].quality;
    if (!q) return null;
    return q.any || q[c] || null;
  }
  const connections = (d) => (d === 'phone' ? ['home', 'cell'] : ['home']);

  // Keep an entry to the allowed combinations, filling defaults where needed.
  function normalise(item) {
    if (!ACT[item.a]) item.a = 'call';
    const act = ACT[item.a];
    if (act.devices.indexOf(item.d) === -1) item.d = act.devices[0];
    if (connections(item.d).indexOf(item.c) === -1) item.c = 'home';
    const ql = qualityList(item.a, item.c);
    if (!ql) delete item.q;
    else if (!ql.some((q) => q.id === item.q)) item.q = DEFAULT_QUALITY[act.quality.any ? 'any' : item.c];
    return item;
  }
  function valid(e) {
    const act = ACT[e.a];
    return !!act && act.devices.indexOf(e.d) !== -1 && connections(e.d).indexOf(e.c) !== -1;
  }

  function describe(item) {
    const ql = qualityList(item.a, item.c);
    const q = ql && ql.find((x) => x.id === item.q);
    return DEV[item.d].label + ' · ' + CONN[item.c] + (q ? ' · ' + q.label : '');
  }
  AIPF.digitalLabel = (e) => (valid(e) ? ACT[e.a].label + ' · ' + DEV[e.d].label + ' · ' + fmtMinutes(e.min) : 'Digital activity');

  function fmtMinutes(min) {
    if (min < 60) return Math.round(min) + ' min';
    const h = Math.floor(min / 60), m = Math.round(min - h * 60);
    return h + ' h' + (m ? ' ' + m + ' min' : '');
  }
  const fmtHours = (h) => (Math.round(h * 100) / 100) + ' h';

  // ---- Energy (Wh) of one entry for a number of hours, by component ----
  function devicePower(item) {
    const w = DEV[item.d].w;
    return Array.isArray(w) ? w : w[item.a === 'gaming' ? 'gaming' : 'stream'];
  }
  function dataPerHour(item) {
    const act = ACT[item.a];
    if (act.noNetwork) return [0, 0, 0];
    if (act.gb) return act.gb.slice();
    const q = qualityList(item.a, item.c).find((x) => x.id === item.q);
    return [q.gb, q.gb, q.gb];
  }
  function entryParts(item, hours) {
    const whPerGb = D.netKwhPerGb[item.c] * 1000;
    const dc = ACT[item.a].dcWhPerHour || 0;
    return {
      device: devicePower(item).map((w) => w * hours),
      network: dataPerHour(item).map((gb) => gb * hours * whPerGb),
      dc: [dc * hours, dc * hours, dc * hours],
    };
  }

  const zero = () => [0, 0, 0];
  const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

  // Length of the union of [start, end] intervals, in hours, so overlapping
  // logged activities never count the router twice in the same clock time.
  function unionHours(intervals) {
    const s = intervals.slice().sort((x, y) => x[0] - y[0]);
    let total = 0, cur = null;
    for (const iv of s) {
      if (!cur || iv[0] > cur[1]) { if (cur) total += cur[1] - cur[0]; cur = iv.slice(); }
      else cur[1] = Math.max(cur[1], iv[1]);
    }
    if (cur) total += cur[1] - cur[0];
    return total / 3600000;
  }

  // Today's logged digital activities, which count only while the log is on.
  function loggedToday() {
    const t = AIPF.tracker;
    if (!t || !t.useLog) return [];
    return t.today.filter((e) => AIPF.entryKind(e) === 'digital' && valid(e) && e.min > 0);
  }

  // Home Wi-Fi hours field: starts at the sum of the typical day's home Wi-Fi
  // hours (capped at 24) and can only be lowered.
  function wifiMax() {
    let h = 0;
    for (const r of typical.rows) if (r.c === 'home') h += r.h || 0;
    return Math.min(MAX_HOURS, h);
  }
  const wifiValue = () => (typical.wifi == null ? wifiMax() : Math.min(typical.wifi, wifiMax()));

  // ---- The digital-day total ----
  function compute() {
    const log = loggedToday();
    const loggedActs = new Set(log.map((e) => e.a));
    const byAct = new Map();
    function addTo(a, source, item, hours) {
      if (!byAct.has(a)) byAct.set(a, { a: a, source: source, hours: 0, items: [], device: zero(), network: zero(), dc: zero() });
      const g = byAct.get(a);
      const p = entryParts(item, hours);
      g.hours += hours;
      g.device = add3(g.device, p.device); g.network = add3(g.network, p.network); g.dc = add3(g.dc, p.dc);
      g.items.push({ item: item, hours: hours, parts: p });
    }

    // Typical-day rows, except for activities replaced by today's log.
    let typicalHome = 0;
    for (const r of typical.rows) {
      if (!(r.h > 0) || loggedActs.has(r.a)) continue;
      addTo(r.a, 'typical', r, r.h);
      if (r.c === 'home') typicalHome += r.h;
    }
    const intervals = [];
    for (const e of log) {
      addTo(e.a, 'log', e, e.min / 60);
      if (e.c === 'home') intervals.push([e.t - e.min * 60000, e.t]);
    }

    // Social media's data-centre share is flat per day, once for any use.
    const social = byAct.get('social');
    if (social && social.hours > 0) {
      const s = D.socialDcWhPerDay;
      social.dc = add3(social.dc, [s, s, s]);
      social.socialDc = s;
    }

    // Router: the typical day's Wi-Fi hours (never more than the typical
    // activities still counted) plus the logged activities' own time.
    const routerHours = Math.min(MAX_HOURS, Math.min(wifiValue(), typicalHome) + unionHours(intervals));
    const r = routerHours * D.routerW;

    const acts = Array.from(byAct.values());
    const comp = { device: zero(), router: [r, r, r], network: zero(), dc: zero() };
    for (const g of acts) {
      comp.device = add3(comp.device, g.device);
      comp.network = add3(comp.network, g.network);
      comp.dc = add3(comp.dc, g.dc);
    }
    const extras = AIPF.digitalExtras.map((fn) => { try { return fn(); } catch (e) { return null; } }).filter(Boolean);
    return { acts: acts, comp: comp, routerHours: routerHours, extras: extras, logged: log.length > 0 };
  }

  // Energy triples to carbon (selected grid) and water (US averages): device,
  // router, and network electricity at 4.35 L/kWh, data centres at 4.88.
  const toCarbon = (wh) => wh.map((x) => (x / 1000) * AIPF.getLoc().grid);
  const toWater = (whElec, whDc) => [0, 1, 2].map((i) =>
    (whElec[i] / 1000) * D.gridWaterLPerKwh + (whDc[i] / 1000) * AIPF.DC_WATER_L_PER_KWH);

  function totals(res) {
    const c = res.comp;
    const elec = add3(add3(c.device, c.router), c.network);
    let energy = add3(elec, c.dc), carbon = toCarbon(energy), water = toWater(elec, c.dc);
    for (const x of res.extras) {
      if (x.energy) energy = add3(energy, x.energy);
      if (x.carbon) carbon = add3(carbon, x.carbon);
      if (x.water) water = add3(water, x.water);
    }
    return { energy: energy, carbon: carbon, water: water };
  }
  AIPF.digitalDayTriple = (metric) => totals(compute())[metric];
  AIPF.digitalDayCompute = compute;

  // ---- Rendering ----
  function fig(t, fmt) {
    if (Math.abs(t[2] - t[1]) < 1e-9) return '<b>' + fmt(t[0]) + '</b>';
    return '<b>' + fmt(t[0]) + '</b> <span class="aipf-tk-range">(' + fmt(t[1]) + '–' + fmt(t[2]) + ')</span>';
  }
  const E = (t) => fig(t, AIPF.fmtEnergy);

  function renderTotals(res) {
    const t = totals(res);
    const ai = { energy: AIPF.aiDailyTriple('energy'), carbon: AIPF.aiDailyTriple('carbon'), water: AIPF.aiDailyTriple('water') };
    const card = (title, x, sub) =>
      '<div class="aipf-dg-card"><p class="aipf-dg-card-h">' + title + '</p>' +
      '<p class="aipf-dg-card-fig">' + fig(x.energy, AIPF.fmtEnergy) + '</p>' +
      '<p class="aipf-dg-card-fig">' + fig(x.carbon, AIPF.fmtCarbon) + '</p>' +
      '<p class="aipf-dg-card-fig">' + fig(x.water, AIPF.fmtWater) + '</p>' +
      '<p class="aipf-dg-card-sub">' + sub + '</p></div>';
    const extraNotes = res.extras.map((x) => (x.cardNote ? ' ' + x.cardNote : '')).join('');
    root.querySelector('#aipf-dg-totals').innerHTML =
      card('Your AI total today', ai, 'Prompts, images, and agent sessions. Counts data centres only, not your own device or router.') +
      card('Your digital day', t, 'Your devices, home router, network, and data centres.' + extraNotes);
  }

  function renderBreakdown(res) {
    const box = root.querySelector('#aipf-dg-breakdown');
    if (!res.acts.length && !res.extras.length) {
      box.innerHTML = '<p class="aipf-tk-empty">Add an activity to your typical day, or log one in the tracker, to see your digital day.</p>';
      return;
    }
    const c = res.comp;
    let html = '<p class="aipf-dg-h">By component</p><ul class="aipf-ss-parts">' +
      '<li><span>Your devices</span><span>' + E(c.device) + '</span></li>' +
      '<li><span>Home router (' + fmtHours(res.routerHours) + ' of home Wi-Fi)</span><span>' + E(c.router) + '</span></li>' +
      '<li><span>Network</span><span>' + E(c.network) + '</span></li>' +
      '<li><span>Data centres</span><span>' + E(c.dc) + '</span></li>';
    for (const x of res.extras) {
      html += '<li><span>' + esc(x.label) + '</span><span>' + (x.summary || '') + '</span></li>';
    }
    html += '</ul>';
    if (res.acts.length) {
      html += '<p class="aipf-dg-h">By activity</p>';
      if (res.logged) html += '<p class="aipf-dg-mix">This total mixes a record (today&rsquo;s log) with an estimate (your typical day).</p>';
      for (const g of res.acts) {
        const tag = g.source === 'log' ? '<span class="aipf-tag aipf-tag--log">today&rsquo;s log</span>' : '<span class="aipf-tag aipf-tag--typ">typical day</span>';
        html += '<div class="aipf-dg-act"><p class="aipf-dg-act-h"><span>' + esc(ACT[g.a].label) + ' ' + tag + '</span><span>' + E(add3(add3(g.device, g.network), g.dc)) + '</span></p><ul class="aipf-dg-act-parts">';
        for (const it of g.items) {
          const single = DEV[it.item.d].single ? ' <em>single estimate, no range available</em>' : '';
          html += '<li>' + esc(fmtHours(it.hours) + ' · ' + describe(it.item)) + ': device ' + E(it.parts.device) + single +
            (ACT[g.a].noNetwork ? ' · no network share counted' : ' · network ' + E(it.parts.network)) +
            (ACT[g.a].dcWhPerHour ? ' · data centres ' + E(it.parts.dc) : '') + '</li>';
        }
        if (g.socialDc) html += '<li>Data centres, flat per day for any social media use: ' + E([g.socialDc, g.socialDc, g.socialDc]) + '</li>';
        html += '</ul></div>';
      }
    }
    for (const x of res.extras) if (x.detail) html += x.detail;
    box.innerHTML = html;
  }

  // ---- Controls for an entry (typical-day row or log form) ----
  function select(options, current, label) {
    const s = el('select', 'aipf-dg-sel');
    s.setAttribute('aria-label', label);
    for (const o of options) s.appendChild(AIPF.option(o[0], o[1], o[0] === current));
    return s;
  }
  function buildControls(box, item, onChange) {
    box.innerHTML = '';
    normalise(item);
    const a = select(Object.keys(ACT).map((k) => [k, ACT[k].label]), item.a, 'Activity');
    const d = select(ACT[item.a].devices.map((k) => [k, DEV[k].label]), item.d, 'Device');
    const c = select(connections(item.d).map((k) => [k, CONN[k]]), item.c, 'Connection');
    box.appendChild(a); box.appendChild(d); box.appendChild(c);
    const ql = qualityList(item.a, item.c);
    let q = null;
    if (ql) { q = select(ql.map((x) => [x.id, x.label]), item.q, 'Quality'); box.appendChild(q); }
    const change = () => {
      item.a = a.value; item.d = d.value; item.c = c.value; if (q) item.q = q.value;
      buildControls(box, item, onChange);
      onChange();
    };
    [a, d, c, q].forEach((s) => { if (s) s.addEventListener('change', change); });
  }

  // ---- Typical-day panel ----
  function save() { store.set(STORE_KEY, typical); }
  function load() {
    const v = store.get(STORE_KEY, null);
    if (!v || !Array.isArray(v.rows)) return;
    typical.rows = v.rows.filter((r) => r && ACT[r.a]).map((r) => normalise({ a: r.a, d: r.d, c: r.c, q: r.q, h: Math.max(0, Math.min(MAX_HOURS, Number(r.h) || 0)) }));
    typical.wifi = typeof v.wifi === 'number' ? v.wifi : null;
  }

  function renderRows() {
    const box = root.querySelector('#aipf-dg-rows');
    box.innerHTML = '';
    typical.rows.forEach((row, i) => {
      const line = el('div', 'aipf-dg-row');
      const ctl = el('div', 'aipf-dg-ctl');
      buildControls(ctl, row, () => { save(); AIPF.emitUpdate(); });
      line.appendChild(ctl);
      const hrs = el('label', 'aipf-dg-hours');
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = '0'; inp.max = String(MAX_HOURS); inp.step = '0.25'; inp.value = String(row.h);
      inp.setAttribute('aria-label', 'Hours per day');
      inp.addEventListener('change', () => {
        const v = Math.max(0, Math.min(MAX_HOURS, Number(inp.value) || 0));
        row.h = v; inp.value = String(v); save(); AIPF.emitUpdate();
      });
      hrs.appendChild(inp);
      hrs.appendChild(document.createTextNode(' h a day'));
      line.appendChild(hrs);
      const rm = el('button', 'aipf-rowdel', '×');
      rm.type = 'button'; rm.setAttribute('aria-label', 'Remove this activity');
      rm.addEventListener('click', () => { typical.rows.splice(i, 1); save(); renderRows(); AIPF.emitUpdate(); });
      line.appendChild(rm);
      box.appendChild(line);
    });
    if (!typical.rows.length) box.appendChild(el('p', 'aipf-tk-empty', 'No activities yet.'));
  }

  function renderWifi() {
    const inp = root.querySelector('#aipf-dg-wifi');
    const max = wifiMax();
    inp.max = String(max);
    if (document.activeElement !== inp) inp.value = String(Math.round(wifiValue() * 100) / 100);
    root.querySelector('#aipf-dg-wifi-max').textContent = 'up to ' + fmtHours(max) + ', the sum of your home Wi-Fi activities';
  }

  function render() {
    const res = compute();
    renderWifi(); renderTotals(res); renderBreakdown(res);
  }

  // ---- Tracker log form ----
  function bindLogForm() {
    const item = normalise({ a: 'stream', d: 'tv', c: 'home' });
    const ctl = root.querySelector('#aipf-dg-log-ctl');
    buildControls(ctl, item, () => {});
    root.querySelector('#aipf-dg-log-btn').addEventListener('click', () => {
      const minInput = root.querySelector('#aipf-dg-log-min');
      const min = Math.round(Number(minInput.value));
      const msg = root.querySelector('#aipf-dg-log-msg');
      if (!(min >= 1 && min <= MAX_HOURS * 60)) { msg.textContent = 'Enter a duration from 1 to 1,440 minutes.'; minInput.focus(); return; }
      const entry = { k: 'digital', a: item.a, d: item.d, c: item.c, min: min };
      if (item.q) entry.q = item.q;
      AIPF.trackerLog(entry);
      msg.textContent = AIPF.tracker.useLog
        ? 'Logged. Today’s hours of ' + ACT[item.a].label.toLowerCase() + ' now come from your log.'
        : 'Logged. It is not counted while “Use my log” is off.';
    });
  }

  AIPF.initDigital = function (rootEl) {
    root = rootEl;
    if (!root.querySelector('#digital')) return;
    load();
    renderRows();
    root.querySelector('#aipf-dg-add').addEventListener('click', () => {
      typical.rows.push(normalise({ a: 'call', d: 'laptop', c: 'home', h: 1 }));
      save(); renderRows(); AIPF.emitUpdate();
    });
    const wifi = root.querySelector('#aipf-dg-wifi');
    wifi.addEventListener('change', () => {
      const max = wifiMax();
      const v = Math.max(0, Math.min(max, Number(wifi.value) || 0));
      typical.wifi = v >= max ? null : v;
      save(); AIPF.emitUpdate();
    });
    root.querySelector('#aipf-dg-wifi-reset').addEventListener('click', () => { typical.wifi = null; save(); AIPF.emitUpdate(); });
    if (root.querySelector('#aipf-dg-log-ctl') && typeof AIPF.trackerLog === 'function') bindLogForm();
    AIPF.onUpdate(render);
  };
})(window.AIPF = window.AIPF || {});
