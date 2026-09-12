/**
 * calculator.js — the original calculator UI: usage rows, the headline verdict,
 * the comparison bar charts, the cited report, and URL state for sharing.
 *
 * Ported from Andy Masley's original calculator (CC0). The company features
 * (tracker, team, budget) live in their own files and hook in via AIPF.onUpdate.
 */
(function (AIPF) {
  'use strict';

  const { MODELS, SIZES, LOCATIONS, HOMES, DRIVING, DIETS, FLYING, COUNTRY_DIET,
          DAILY_ITEMS, ANNUAL_ITEMS, DAILY_WATER_ITEMS, ANNUAL_WATER_ITEMS,
          DEFAULT_ROWS, REPORT_REFS, GAL_TO_L, DAYS, WPM } = AIPF;
  const { el, option, esc, escXml, state } = AIPF;

  let root = null;

  // ---- URL state ----
  function buildShareURL() {
    const r = state.rows.map((row) =>
      MODELS.findIndex((m) => m.id === row.model) + '-' +
      SIZES.findIndex((s) => s.id === row.size) + '-' + (row.count || 0)).join('.');
    const p = new URLSearchParams();
    p.set('k', state.metric); p.set('l', state.loc); p.set('h', state.home);
    p.set('v', state.drive); p.set('d', state.diet); p.set('f', state.fly); p.set('r', r);
    return location.origin + location.pathname + '#' + p.toString();
  }
  function readURL() {
    try {
      const h = (location.hash || '').replace(/^#/, '');
      if (!h) return;
      const p = new URLSearchParams(h);
      const k = p.get('k'); if (k === 'carbon' || k === 'water') state.metric = k;
      const l = p.get('l'); if (l && LOCATIONS.some((x) => x.id === l)) state.loc = l;
      const hh = p.get('h'); if (hh && HOMES.some((x) => x.id === hh)) state.home = hh;
      const vv = p.get('v'); if (vv && DRIVING.some((x) => x.id === vv)) state.drive = vv;
      const d = p.get('d'); if (d && DIETS.some((x) => x.id === d)) state.diet = d;
      const f = p.get('f'); if (f && FLYING.some((x) => x.id === f)) state.fly = f;
      const r = p.get('r');
      if (r) {
        const rows = [];
        for (const part of r.split('.')) {
          const a = part.split('-').map(Number);
          if (MODELS[a[0]] && SIZES[a[1]] && a[2] >= 0) {
            rows.push({ uid: AIPF.nextUid(), model: MODELS[a[0]].id, size: SIZES[a[1]].id, count: Math.min(100000, a[2]) });
          }
        }
        if (rows.length) state.rows = rows;
      }
    } catch (e) { /* ignore */ }
  }
  function setDefaultRows() {
    state.rows = DEFAULT_ROWS.map((r) => ({ uid: AIPF.nextUid(), model: r[0], size: r[1], count: r[2] }));
  }
  AIPF.setDefaultRows = setDefaultRows;

  // ---- Usage rows ----
  function modelSelect(row) {
    const sel = el('select', 'aipf-rsel');
    sel.setAttribute('aria-label', 'Model');
    const groups = [];
    for (const m of MODELS) {
      let g = groups.find((x) => x.name === m.group);
      if (!g) { g = { name: m.group, items: [] }; groups.push(g); }
      g.items.push(m);
    }
    for (const g of groups) {
      const og = document.createElement('optgroup');
      og.label = g.name;
      for (const m of g.items) og.appendChild(option(m.id, m.name, m.id === row.model));
      sel.appendChild(og);
    }
    sel.addEventListener('change', () => { row.model = sel.value; renderRows(); AIPF.emitUpdate(); });
    return sel;
  }
  function sizeSelect(row) {
    const sel = el('select', 'aipf-rsel');
    sel.setAttribute('aria-label', 'Typical output length');
    for (const s of SIZES) sel.appendChild(option(s.id, AIPF.sizeLabel(row.model, s) + ' (' + s.words + ')', s.id === row.size));
    sel.addEventListener('change', () => { row.size = sel.value; AIPF.emitUpdate(); });
    return sel;
  }
  function bump(row, input, dir) {
    const cur = row.count || 0;
    let step = 1;
    if (cur >= 50) step = 10; else if (cur >= 20) step = 5;
    let next = cur + dir * step;
    if (dir < 0 && cur > 0 && cur <= step) next = 0;
    row.count = Math.max(0, Math.min(100000, next));
    input.value = String(row.count);
    AIPF.emitUpdate();
  }
  function stepper(row) {
    const ctrl = el('div', 'aipf-stepper');
    const minus = el('button', 'aipf-step', '−'); minus.type = 'button'; minus.setAttribute('aria-label', 'Fewer');
    const input = document.createElement('input');
    input.type = 'text'; input.inputMode = 'numeric'; input.className = 'aipf-count';
    input.value = String(row.count || 0); input.setAttribute('aria-label', 'Per day');
    const plus = el('button', 'aipf-step', '+'); plus.type = 'button'; plus.setAttribute('aria-label', 'More');
    minus.addEventListener('click', () => bump(row, input, -1));
    plus.addEventListener('click', () => bump(row, input, 1));
    input.addEventListener('input', () => {
      row.count = Math.max(0, Math.min(100000, parseInt(input.value.replace(/[^0-9]/g, ''), 10) || 0));
      AIPF.emitUpdate();
    });
    input.addEventListener('blur', () => { input.value = String(row.count || 0); });
    ctrl.appendChild(minus); ctrl.appendChild(input); ctrl.appendChild(plus);
    return ctrl;
  }
  function renderRows() {
    const wrap = root.querySelector('#aipf-rows');
    wrap.innerHTML = '';
    for (const row of state.rows) {
      const wrapEl = el('div', 'aipf-rowwrap');
      wrapEl.dataset.uid = String(row.uid);
      const r = el('div', 'aipf-row');
      r.appendChild(modelSelect(row));
      r.appendChild(sizeSelect(row));
      r.appendChild(stepper(row));
      const rm = el('button', 'aipf-rowdel', '×');
      rm.type = 'button'; rm.setAttribute('aria-label', 'Remove this row');
      rm.addEventListener('click', () => {
        state.rows = state.rows.filter((x) => x.uid !== row.uid);
        renderRows(); AIPF.emitUpdate();
      });
      r.appendChild(rm);
      wrapEl.appendChild(r);
      wrapEl.appendChild(el('div', 'aipf-row-meta'));
      wrap.appendChild(wrapEl);
    }
    if (!state.rows.length) wrap.appendChild(el('p', 'aipf-empty', 'No usage yet. Add a kind of use to begin.'));
  }
  AIPF.renderRows = renderRows;

  function updateRowMeta() {
    const total = AIPF.aiDaily(state.metric);
    for (const row of state.rows) {
      const wrapEl = root.querySelector('.aipf-rowwrap[data-uid="' + row.uid + '"] .aipf-row-meta');
      if (!wrapEl) continue;
      const per = AIPF.perPromptTriple(AIPF.getModel(row.model), row.size, state.metric)[0];
      const contr = (row.count || 0) * per;
      const share = total > 0 ? (contr / total) * 100 : 0;
      const shareStr = share >= 10 ? Math.round(share) : share.toFixed(1);
      wrapEl.textContent = AIPF.fmtMetric(per) + ' each, ' + AIPF.fmtMetric(contr) + ' a day, ' + shareStr + '% of your AI ' + AIPF.metricWord();
    }
  }
  function renderLifeSelects() {
    function fill(id, list, cur) {
      const sel = root.querySelector(id);
      sel.innerHTML = '';
      for (const x of list) sel.appendChild(option(x.id, x.label, x.id === cur));
    }
    fill('#aipf-loc', LOCATIONS, state.loc);
    fill('#aipf-home', HOMES, state.home);
    fill('#aipf-drive', DRIVING, state.drive);
    fill('#aipf-diet', DIETS, state.diet);
    fill('#aipf-fly', FLYING, state.fly);
  }

  // ---- Outputs ----
  function renderRunning() {
    const box = root.querySelector('#aipf-running');
    const n = AIPF.totalPrompts();
    const cD = AIPF.aiDaily('carbon'), wD = AIPF.aiDaily('water'), eD = AIPF.aiDailyEnergy();
    if (n <= 0) { box.innerHTML = 'Nothing entered yet.'; return; }
    box.innerHTML =
      'That is <b>' + n.toLocaleString('en-US') + '</b> prompts a day, costing about <b>' + AIPF.fmtCarbon(cD) +
      '</b> and <b>' + AIPF.fmtWater(wD) + '</b> (' + AIPF.fmtEnergy(eD) + '). Over a year, <b>' + AIPF.fmtCarbon(cD * DAYS) +
      '</b> and <b>' + AIPF.fmtWater(wD * DAYS) + '</b>.';
  }

  function renderHeadline() {
    const box = root.querySelector('#aipf-headline');
    const t = AIPF.aiDailyTriple(state.metric);
    const ai = t[0], day = AIPF.dailyFootprint(state.metric);
    const pct = day > 0 ? (ai / day) * 100 : 0;
    box.innerHTML =
      '<div class="aipf-verdict-fig">' + AIPF.fmtPct(pct) + '</div>' +
      '<p class="aipf-verdict-say">of your daily ' + AIPF.metricWord() + ' footprint.</p>' +
      '<p class="aipf-verdict-detail">A day of your AI use is ' + AIPF.fmtMetric(ai) + ' (' + AIPF.fmtMetric(t[1]) + ' to ' + AIPF.fmtMetric(t[2]) +
        '). A day of your life is ' + AIPF.fmtMetric(day) + '.</p>' +
      '<div class="aipf-prop"><div class="aipf-prop-fill" style="width:' + Math.max(0.5, Math.min(100, pct)).toFixed(2) + '%"></div></div>' +
      '<div class="aipf-prop-cap"><span class="accent">your AI use</span><span>a full day</span></div>';
  }

  function renderGridNote() {
    const box = root.querySelector('#aipf-grid-note');
    box.style.display = '';
    if (state.metric === 'carbon') box.textContent = 'AI carbon uses the ' + AIPF.getLoc().label + ' grid for electricity, plus EcoLogits’ embodied hardware emissions.';
    else box.textContent = 'Water is blue water only: freshwater drawn from rivers, lakes, and aquifers. Green rainwater (most of food’s footprint) is excluded.';
  }

  function renderWords() {
    const box = root.querySelector('#aipf-words');
    const wd = AIPF.dailyWords(), cd = AIPF.dailyCodeLines();
    if (wd <= 0 && cd <= 0) { box.innerHTML = 'Add some use to see how much your AI is writing.'; return; }
    let html = '';
    if (wd > 0) {
      const wy = wd * DAYS;
      html += 'About <b>' + AIPF.fmtWords(wd) + ' words a day</b>, roughly <b>' + AIPF.fmtWords(wy) + ' a year</b>. At the average American reading pace of ' + WPM +
        ' words a minute, that is <b>' + AIPF.fmtReadingTime(wd / WPM) + '</b> of reading a day, or <b>' + AIPF.fmtReadingTime(wy / WPM) + '</b> nonstop across the year.';
    } else {
      html += 'Almost all of your use is code, not prose to read.';
    }
    if (cd > 0) {
      const cy = cd * DAYS;
      html += '<span class="aipf-words-code">It also writes about <b>' + AIPF.fmtWords(cd) + ' lines of code a day</b>, roughly <b>' + AIPF.fmtWords(cy) + '</b> a year.</span>';
    }
    const miles = Math.round(AIPF.aiDaily('carbon') * DAYS / 400); // EPA ~400 g CO2 per vehicle-mile
    html += '<span class="aipf-words-miles">If you use chatbots this much every day, your annual use emits as much as driving the average gas car <b>' + miles.toLocaleString('en-US') + '</b> mile' + (miles === 1 ? '' : 's') + ' once.</span>';
    box.innerHTML = html;
  }

  // ---- Bar charts ----
  function renderBars(targetId, focalLabel, focalVal, items, unit) {
    const rows = [{ label: focalLabel, v: focalVal, focal: true }];
    for (const it of items) {
      const v = AIPF.itemBase(it, state.metric);
      if (v <= 0) continue; // skip items with no impact in this metric (keeps the water view clean)
      rows.push({ label: it.label, v: v, dir: it.dir });
    }
    rows.sort((a, b) => b.v - a.v);
    const max = Math.max.apply(null, rows.map((r) => r.v).concat([1e-9]));
    const box = root.querySelector(targetId);
    box.innerHTML = '';
    for (const r of rows) {
      const row = el('div', 'aipf-bar-row' + (r.focal ? ' is-focal' : ''));
      let labelHtml = esc(r.label);
      if (r.dir === 'save') labelHtml += ' <span class="aipf-tag aipf-tag--save">saved</span>';
      else if (r.dir === 'add') labelHtml += ' <span class="aipf-tag aipf-tag--add">added</span>';
      row.appendChild(el('div', 'aipf-bar-label', labelHtml));
      const track = el('div', 'aipf-bar-track');
      const fill = el('div', 'aipf-bar-fill');
      fill.style.width = Math.max(0.4, (r.v / max) * 100).toFixed(2) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('div', 'aipf-bar-val', AIPF.fmtUnit(r.v, unit)));
      box.appendChild(row);
    }
  }
  AIPF.renderBars = renderBars;

  function renderDaily() {
    const ai = AIPF.aiDaily(state.metric);
    const unit = AIPF.chartUnit(state.metric, 'daily');
    root.querySelector('#aipf-daily-sub').innerHTML = 'A day of your AI use (highlighted below) is ' + AIPF.fmtUnit(ai, unit) + '.';
    const items = state.metric === 'water' ? DAILY_WATER_ITEMS : DAILY_ITEMS;
    renderBars('#aipf-daily-bars', 'Your daily AI use', ai, items, unit);
  }
  function renderAnnualSplit() {
    const aiYr = AIPF.aiDaily(state.metric) * DAYS;
    const strip = (it) => ({ label: it.label, c: it.c, w: it.w });
    const src = state.metric === 'water' ? ANNUAL_WATER_ITEMS : ANNUAL_ITEMS;
    const adds = src.filter((it) => it.dir === 'add').map(strip);
    const cuts = src.filter((it) => it.dir === 'save').map(strip);
    const noun = state.metric === 'water' ? 'water' : 'emissions';
    root.querySelector('#aipf-add-title').textContent = 'In a year, ways you add ' + noun;
    root.querySelector('#aipf-cut-title').textContent = 'In a year, ways you can cut ' + noun;
    const unit = AIPF.chartUnit(state.metric, 'annual');
    root.querySelector('#aipf-add-sub').innerHTML = 'Your AI use (highlighted) is ' + AIPF.fmtUnit(aiYr, unit) + ' a year, next to other things that add to your footprint.';
    renderBars('#aipf-add-bars', 'A year of your AI use', aiYr, adds, unit);
    root.querySelector('#aipf-cut-sub').innerHTML = 'Cutting your AI use (highlighted) would save ' + AIPF.fmtUnit(aiYr, unit) + ' a year, next to the bigger cuts you could make.';
    renderBars('#aipf-cut-bars', 'Cut your AI use', aiYr, cuts, unit);
  }

  function updateOutputs() {
    renderRunning(); updateRowMeta(); renderHeadline(); renderGridNote();
    renderWords(); renderDaily(); renderAnnualSplit();
  }

  // ---- Cited report ----
  function reportBarsSVG(rows, fmt) {
    fmt = fmt || AIPF.fmtCarbon;
    rows = rows.slice().sort((a, b) => b.v - a.v);
    const W = 700, padL = 250, padR = 90, rowH = 26, top = 8;
    const max = Math.max.apply(null, rows.map((r) => r.v).concat([1e-9]));
    const barMax = W - padL - padR;
    const H = top * 2 + rows.length * rowH;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px" role="img">';
    rows.forEach((r, i) => {
      const y = top + i * rowH, cy = y + rowH / 2;
      const bw = Math.max(2, (r.v / max) * barMax);
      const col = r.focal ? '#BF5700' : '#D8C3B2';
      s += '<text x="' + (padL - 8) + '" y="' + (cy + 4) + '" text-anchor="end" font-size="12.5" fill="#1A1512">' + escXml(r.label) + '</text>';
      s += '<rect x="' + padL + '" y="' + (y + 5) + '" width="' + bw.toFixed(1) + '" height="' + (rowH - 12) + '" fill="' + col + '"/>';
      s += '<text x="' + (padL + bw + 6).toFixed(1) + '" y="' + (cy + 4) + '" font-size="11.5" fill="#6E6259">' + escXml(fmt(r.v)) + '</text>';
    });
    return s + '</svg>';
  }

  function reportHTML() {
    let rowsHtml = '', aiDay = 0, aiMin = 0, aiMax = 0, eD = 0, wDay = 0, wMin = 0, wMax = 0;
    for (const r of state.rows) {
      if (!r.count) continue;
      const md = AIPF.getModel(r.model);
      const ct = AIPF.perPromptTriple(md, r.size, 'carbon');
      const wt = AIPF.perPromptTriple(md, r.size, 'water');
      const d = r.count * ct[0];
      aiDay += d; aiMin += r.count * ct[1]; aiMax += r.count * ct[2]; eD += r.count * md.sizes[r.size].wh;
      wDay += r.count * wt[0]; wMin += r.count * wt[1]; wMax += r.count * wt[2];
      rowsHtml += '<tr><td>' + escXml(md.name) + '</td><td>' + escXml(AIPF.sizeLabel(r.model, AIPF.getSize(r.size))) + '</td><td class="n">' + r.count + '</td><td class="n">' + AIPF.fmtCarbon(d) + '</td><td class="n">' + AIPF.fmtWater(r.count * wt[0]) + '</td></tr>';
    }
    const aiYr = aiDay * DAYS, wYr = wDay * DAYS;
    const day = AIPF.dailyFootprint('carbon');
    const pctStr = AIPF.fmtPct(day > 0 ? (aiDay / day) * 100 : 0);
    const dayW = AIPF.dailyFootprint('water');
    const pctWStr = AIPF.fmtPct(dayW > 0 ? (wDay / dayW) * 100 : 0);
    const loc = AIPF.getLoc();
    const home = HOMES.find((x) => x.id === state.home), drive = DRIVING.find((x) => x.id === state.drive);
    const diet = DIETS.find((x) => x.id === state.diet), fly = FLYING.find((x) => x.id === state.fly);
    const fp = [['Where I live (' + loc.label + ')', loc.c], ['Home (' + home.label + ')', home.c],
                ['Driving (' + drive.label + ')', drive.c], ['Diet (' + diet.label + ')', diet.c],
                ['Flying (' + fly.label + ')', fly.c]];
    let fpHtml = '';
    for (const f of fp) fpHtml += '<tr><td>' + escXml(f[0]) + '</td><td class="n">' + AIPF.fmtCarbon(f[1] * 1000) + ' / yr</td></tr>';
    const dailyRows = [{ label: 'My daily AI use', v: aiDay, focal: true }].concat(DAILY_ITEMS.map((it) => ({ label: it.label, v: it.c * 1000 })));
    const addRows = [{ label: 'A year of my AI use', v: aiYr, focal: true }].concat(ANNUAL_ITEMS.filter((it) => it.dir === 'add').map((it) => ({ label: it.label, v: it.c * 1000 })));
    const cutRows = [{ label: 'Cut my AI use', v: aiYr, focal: true }].concat(ANNUAL_ITEMS.filter((it) => it.dir === 'save').map((it) => ({ label: it.label, v: it.c * 1000 })));
    const dailyWaterRows = [{ label: 'My daily AI use', v: wDay, focal: true }].concat(DAILY_WATER_ITEMS.map((it) => ({ label: it.label, v: it.w * GAL_TO_L })));
    const addWaterRows = [{ label: 'A year of my AI use', v: wYr, focal: true }].concat(ANNUAL_WATER_ITEMS.filter((it) => it.dir === 'add').map((it) => ({ label: it.label, v: it.w * GAL_TO_L })));
    const cutWaterRows = [{ label: 'Cut my AI use', v: wYr, focal: true }].concat(ANNUAL_WATER_ITEMS.filter((it) => it.dir === 'save').map((it) => ({ label: it.label, v: it.w * GAL_TO_L })));
    let refsHtml = '';
    REPORT_REFS.forEach((r, i) => { refsHtml += '<li id="ref' + (i + 1) + '">[' + (i + 1) + '] ' + escXml(r.label) + ' <a href="' + r.url + '">' + escXml(r.url) + '</a></li>'; });
    const fn = (n) => '<sup><a href="#ref' + n + '">[' + n + ']</a></sup>';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>How my AI use contributes to my carbon emissions and water use</title><style>' +
      'body{font-family:Georgia,"Times New Roman",serif;color:#1A1512;max-width:760px;margin:2.5rem auto;padding:0 1.25rem;line-height:1.55;}' +
      'h1{font-size:1.65rem;line-height:1.2;margin:0 0 .25rem;}.date{color:#6E6259;font-size:.85rem;margin:0 0 1.5rem;}' +
      'h2{font-size:1.15rem;margin:2rem 0 .6rem;border-bottom:1px solid #ddd;padding-bottom:.25rem;}p{margin:.6rem 0;}' +
      'table{border-collapse:collapse;width:100%;font-size:.85rem;margin:.5rem 0;}th,td{text-align:left;padding:.35rem .5rem;border-bottom:1px solid #eee;}' +
      'th{color:#6E6259;font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.03em;}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;}' +
      '.big{font-size:2.1rem;font-weight:700;}a{color:#BF5700;}sup a{text-decoration:none;}ol.refs{font-size:.8rem;color:#444;padding-left:1.2rem;}ol.refs li{margin:.35rem 0;word-break:break-word;}' +
      '.muted{color:#6E6259;font-size:.85rem;}@media print{a{color:#000;}body{margin:0;}}</style></head><body>' +
      '<h1>How my AI use contributes to my carbon emissions and water use</h1>' +
      '<p class="date">Generated ' + date + ', based on exactly the inputs below.</p>' +
      '<h2>1. What I entered</h2>' +
      '<table><thead><tr><th>Model</th><th>Typical output</th><th class="n">Prompts/day</th><th class="n">CO₂e/day</th><th class="n">Water/day</th></tr></thead><tbody>' +
      (rowsHtml || '<tr><td colspan="5">No usage entered.</td></tr>') + '</tbody></table>' +
      '<p class="muted">Per-prompt figures come from the EcoLogits model' + fn(1) + '; the electricity is costed on the ' + escXml(loc.label) + ' grid' + fn(2) + ', and EcoLogits’ embodied hardware emissions are kept.</p>' +
      '<h2>2. My AI carbon</h2>' +
      '<p>Across these prompts, my AI use comes to about <strong>' + AIPF.fmtCarbon(aiDay) + ' per day</strong> (range ' + AIPF.fmtCarbon(aiMin) + ' to ' + AIPF.fmtCarbon(aiMax) + '), or <strong>' + AIPF.fmtCarbon(aiYr) + ' per year</strong>, drawing about ' + AIPF.fmtEnergy(eD) + ' of electricity a day.' + fn(1) + fn(2) + ' The range is EcoLogits’ 95% interval, mostly uncertainty in the parameter counts of closed models.' + fn(1) + '</p>' +
      '<h2>3. How that compares with the rest of my life</h2>' +
      '<p><span class="big">' + pctStr + '</span><br>of an average day of my own carbon footprint (' + AIPF.fmtCarbon(day) + ' / day), built from:</p>' +
      '<table><tbody>' + fpHtml + '</tbody></table>' +
      '<p class="muted">Regional baseline' + fn(3) + '; home energy' + fn(4) + '; driving' + fn(5) + '; diet' + fn(6) + '; flying' + fn(7) + '.</p>' +
      '<h2>4. My daily AI use, next to everyday things</h2>' + reportBarsSVG(dailyRows) +
      '<p class="muted">Everyday comparisons from diet' + fn(6) + ', driving' + fn(5) + ', and product life-cycle studies listed on the source page.</p>' +
      '<h2>5. In a year, ways I add emissions</h2>' + reportBarsSVG(addRows) +
      '<h2>6. In a year, ways I could cut emissions</h2>' + reportBarsSVG(cutRows) +
      '<p class="muted">Lifestyle-cut figures from the Founders Pledge comparison' + fn(9) + ', drawing on Wynes &amp; Nicholas' + fn(7) + ' and Ivanova et al.' + fn(8) + '</p>' +
      '<h2>7. My AI water</h2>' +
      '<p>The same prompts consume about <strong>' + AIPF.fmtWater(wDay) + ' of water a day</strong> (range ' + AIPF.fmtWater(wMin) + ' to ' + AIPF.fmtWater(wMax) + '), or <strong>' + AIPF.fmtWater(wYr) + ' a year</strong> — <span class="big">' + pctWStr + '</span> of my daily blue-water footprint (' + AIPF.fmtWater(dayW) + '). All water figures here are blue water (freshwater drawn from rivers, lakes, and aquifers); green rainwater and grey pollution-dilution water are excluded, so the AI and lifestyle figures match.' + fn(1) + fn(10) + '</p>' +
      '<h2>8. My daily AI water, next to everyday things</h2>' + reportBarsSVG(dailyWaterRows, AIPF.fmtWater) +
      '<h2>9. In a year, water I add</h2>' + reportBarsSVG(addWaterRows, AIPF.fmtWater) +
      '<h2>10. In a year, water I could cut</h2>' + reportBarsSVG(cutWaterRows, AIPF.fmtWater) +
      '<p class="muted">Water comparisons from EcoLogits' + fn(1) + ' and the Water Footprint Network' + fn(10) + '.</p>' +
      '<h2>References</h2><ol class="refs">' + refsHtml + '</ol>' +
      '</body></html>';
  }
  function generateReport() {
    try {
      const blob = new Blob([reportHTML()], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (e) { /* ignore */ }
  }
  AIPF.reportBarsSVG = reportBarsSVG;

  function renderMetricToggle() {
    root.querySelectorAll('.aipf-metric').forEach((b) => {
      const on = b.dataset.metric === state.metric;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // Small helper the copy buttons share: swap the label, then put it back.
  function copyFeedback(btn, text, doneLabel, restoreLabel) {
    const done = () => { btn.textContent = doneLabel; setTimeout(() => { btn.textContent = restoreLabel; }, 1800); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else done();
    } catch (err) { done(); }
  }
  AIPF.copyFeedback = copyFeedback;

  function bindEvents() {
    root.querySelector('#aipf-addrow').addEventListener('click', () => {
      state.rows.push({ uid: AIPF.nextUid(), model: 'gpt-5.5', size: 'chat', count: 1 });
      renderRows(); AIPF.emitUpdate();
    });
    root.querySelector('#aipf-reset').addEventListener('click', () => {
      setDefaultRows(); renderRows(); AIPF.emitUpdate();
    });
    root.querySelector('#aipf-share').addEventListener('click', (e) => {
      copyFeedback(e.currentTarget, buildShareURL(), 'Link copied', 'Copy link');
    });
    const rb = root.querySelector('#aipf-report');
    if (rb) rb.addEventListener('click', generateReport);
    root.querySelector('#aipf-loc').addEventListener('change', (e) => {
      state.loc = e.target.value;
      const d = COUNTRY_DIET[state.loc];
      if (d) { state.diet = d; const ds = root.querySelector('#aipf-diet'); if (ds) ds.value = d; }
      AIPF.emitUpdate();
    });
    root.querySelector('#aipf-home').addEventListener('change', (e) => { state.home = e.target.value; AIPF.emitUpdate(); });
    root.querySelector('#aipf-drive').addEventListener('change', (e) => { state.drive = e.target.value; AIPF.emitUpdate(); });
    root.querySelector('#aipf-diet').addEventListener('change', (e) => { state.diet = e.target.value; AIPF.emitUpdate(); });
    root.querySelector('#aipf-fly').addEventListener('change', (e) => { state.fly = e.target.value; AIPF.emitUpdate(); });
    root.querySelectorAll('.aipf-metric').forEach((b) => {
      b.addEventListener('click', () => { state.metric = b.dataset.metric; renderMetricToggle(); AIPF.emitUpdate(); });
    });
  }

  AIPF.initCalculator = function (rootEl) {
    root = rootEl;
    setDefaultRows();
    readURL();
    renderRows(); renderLifeSelects(); renderMetricToggle(); bindEvents();
    AIPF.onUpdate(updateOutputs);
  };
})(window.AIPF = window.AIPF || {});
