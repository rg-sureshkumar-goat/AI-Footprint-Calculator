/**
 * team.js — FEATURE 2: Team and company dashboard.
 *
 * A personal number on its own does not tell an employee much. This sets their
 * footprint against their team's average and the company's, scales the whole
 * organisation's daily and annual total, and answers the question that
 * actually changes behaviour: what would the company emit if everyone worked
 * the way I do?
 *
 * Roster data comes from AIPF.TEAM_DATA (see team-data.js). A real deployment
 * replaces it by calling AIPF.setTeamData() with data from its own gateway
 * logs; the panel hides itself entirely when no roster is present.
 */
(function (AIPF) {
  'use strict';

  const { el } = AIPF;

  let root = null;
  let data = null;

  const team = { myTeam: null };
  AIPF.team = team;

  // ---- Model ----
  // A team profile is "average prompts per person per working day", so its
  // footprint is costed exactly like a set of calculator rows.
  function profileFootprint(profile, metric) {
    let t = 0;
    for (const p of profile) {
      const model = AIPF.getModel(p.model);
      if (!model.sizes[p.size]) continue;
      t += p.count * AIPF.perPromptTriple(model, p.size, metric)[0];
    }
    return t;
  }
  function profilePrompts(profile) {
    let n = 0;
    for (const p of profile) n += p.count;
    return n;
  }
  function getTeam(id) { return data.teams.find((t) => t.id === id) || data.teams[0]; }

  // Company average is headcount-weighted across teams, then diluted over the
  // full headcount so people outside these teams count as non-users.
  function companyPerPerson(metric) {
    let total = 0, covered = 0;
    for (const t of data.teams) {
      total += profileFootprint(t.profile, metric) * t.headcount;
      covered += t.headcount;
    }
    const head = data.company.headcount || covered;
    return { perPerson: total / head, dailyTotal: total, covered: covered, headcount: head };
  }

  // ---- Rendering ----
  function renderPicker() {
    const sel = root.querySelector('#aipf-tm-team');
    sel.innerHTML = '';
    for (const t of data.teams) sel.appendChild(AIPF.option(t.id, t.name, t.id === team.myTeam));
    root.querySelector('#aipf-tm-company').textContent = data.company.name;
  }

  function renderCompare() {
    const metric = AIPF.state.metric;
    const you = AIPF.aiDaily(metric);
    const mine = getTeam(team.myTeam);
    const teamAvg = profileFootprint(mine.profile, metric);
    const co = companyPerPerson(metric);

    const cells = [
      { k: 'you',  label: 'You, today',                   v: you,          sub: AIPF.totalPrompts().toLocaleString('en-US') + ' prompts' },
      { k: 'team', label: mine.name + ' average',         v: teamAvg,      sub: Math.round(profilePrompts(mine.profile)) + ' prompts a day, ' + mine.headcount + ' people' },
      { k: 'co',   label: data.company.name + ' average', v: co.perPerson, sub: 'across all ' + co.headcount.toLocaleString('en-US') + ' people' },
    ];
    const box = root.querySelector('#aipf-tm-cells');
    box.innerHTML = '';
    const max = Math.max.apply(null, cells.map((c) => c.v).concat([1e-9]));
    for (const c of cells) {
      const cell = el('div', 'aipf-tm-cell' + (c.k === 'you' ? ' is-you' : ''));
      cell.appendChild(el('p', 'aipf-tm-cell-label', AIPF.esc(c.label)));
      cell.appendChild(el('p', 'aipf-tm-cell-fig', AIPF.fmtMetric(c.v)));
      const track = el('div', 'aipf-tm-cell-track');
      const fill = el('div', 'aipf-tm-cell-fill');
      fill.style.width = Math.max(1.5, (c.v / max) * 100).toFixed(1) + '%';
      track.appendChild(fill);
      cell.appendChild(track);
      cell.appendChild(el('p', 'aipf-tm-cell-sub', AIPF.esc(c.sub)));
      box.appendChild(cell);
    }

    // The comparison sentence. Ratios only, no ranking of individuals: the
    // roster holds team averages, not per-person data, so a "rank" would be invented.
    const verdict = root.querySelector('#aipf-tm-verdict');
    if (you <= 0) {
      verdict.innerHTML = 'Log some use above, or enter an estimate, to see how you compare.';
      return;
    }
    const ratio = teamAvg > 0 ? you / teamAvg : 0;
    let word, cls;
    if (ratio < 0.75) { word = 'below'; cls = 'is-under'; }
    else if (ratio <= 1.25) { word = 'about in line with'; cls = 'is-level'; }
    else { word = 'above'; cls = 'is-over'; }
    const ratioStr = ratio >= 10 ? Math.round(ratio) + '×' : ratio.toFixed(2).replace(/0$/, '') + '×';
    verdict.className = 'aipf-tm-verdict ' + cls;
    verdict.innerHTML = 'Your day is <b>' + ratioStr + '</b> the ' + AIPF.esc(mine.name) +
      ' average — ' + (word === 'about in line with' ? 'about in line with' : word) + ' your team.';
  }

  function renderCompanyTotal() {
    const metric = AIPF.state.metric;
    const co = companyPerPerson(metric);
    const days = data.company.workingDays || 250;
    const yr = co.dailyTotal * days;

    root.querySelector('#aipf-tm-co-daily').textContent = AIPF.fmtMetric(co.dailyTotal);
    root.querySelector('#aipf-tm-co-annual').textContent = AIPF.fmtMetric(yr);
    root.querySelector('#aipf-tm-co-sub').textContent =
      'Across ' + co.headcount.toLocaleString('en-US') + ' people over ' + days + ' working days.';

    // Anchor the annual figure to something a reader already has a feel for.
    const anchor = root.querySelector('#aipf-tm-co-anchor');
    if (metric === 'carbon') {
      const flights = yr / 1.6e6;  // transatlantic round trip ≈ 1.6 t CO2e (Wynes & Nicholas)
      anchor.textContent = flights >= 0.5
        ? 'About ' + AIPF.sig(flights) + ' transatlantic round-trip flights a year.'
        : '';
    } else {
      const showers = yr / (21 * AIPF.GAL_TO_L); // 10-minute hot shower ≈ 21 gal (EPA WaterSense)
      anchor.textContent = showers >= 1
        ? 'About ' + AIPF.sig(showers) + ' ten-minute showers a year.'
        : '';
    }
  }

  function renderTeamBars() {
    const metric = AIPF.state.metric;
    const rows = data.teams.map((t) => ({
      label: t.name,
      v: profileFootprint(t.profile, metric),
      mine: t.id === team.myTeam,
    })).sort((a, b) => b.v - a.v);

    const you = AIPF.aiDaily(metric);
    if (you > 0) rows.push({ label: 'You, today', v: you, focal: true });
    rows.sort((a, b) => b.v - a.v);

    const max = Math.max.apply(null, rows.map((r) => r.v).concat([1e-9]));
    const box = root.querySelector('#aipf-tm-bars');
    box.innerHTML = '';
    for (const r of rows) {
      const row = el('div', 'aipf-bar-row' + (r.focal ? ' is-focal' : '') + (r.mine ? ' is-mine' : ''));
      let label = AIPF.esc(r.label);
      if (r.mine) label += ' <span class="aipf-tag aipf-tag--mine">your team</span>';
      row.appendChild(el('div', 'aipf-bar-label', label));
      const track = el('div', 'aipf-bar-track');
      const fill = el('div', 'aipf-bar-fill');
      fill.style.width = Math.max(0.4, (r.v / max) * 100).toFixed(2) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('div', 'aipf-bar-val', AIPF.fmtMetric(r.v)));
      box.appendChild(row);
    }
  }

  // The question that actually changes behaviour at an organisation: scale one
  // person's day to everyone and compare it with where the company is now.
  function renderIfEveryone() {
    const metric = AIPF.state.metric;
    const you = AIPF.aiDaily(metric);
    const co = companyPerPerson(metric);
    const days = data.company.workingDays || 250;
    const box = root.querySelector('#aipf-tm-ifall');

    if (you <= 0) {
      box.innerHTML = '<p class="aipf-tm-ifall-empty">Log a day of your own use to see this.</p>';
      return;
    }
    const projDaily = you * co.headcount;
    const projYr = projDaily * days;
    const nowYr = co.dailyTotal * days;
    const diff = projYr - nowYr;
    const pct = nowYr > 0 ? Math.abs(diff / nowYr) * 100 : 0;
    const up = diff > 0;

    box.innerHTML =
      '<p class="aipf-tm-ifall-fig">' + AIPF.fmtMetric(projYr) + '<span class="aipf-tm-ifall-unit"> a year</span></p>' +
      '<p class="aipf-tm-ifall-say">if all ' + co.headcount.toLocaleString('en-US') + ' people at ' +
        AIPF.esc(data.company.name) + ' used AI the way you did today.</p>' +
      '<p class="aipf-tm-ifall-delta ' + (up ? 'is-over' : 'is-under') + '">' +
        'That is <b>' + AIPF.fmtMetric(Math.abs(diff)) + '</b> ' + (up ? 'more' : 'less') +
        ' than the company&rsquo;s current ' + AIPF.fmtMetric(nowYr) + ' a year, a ' +
        AIPF.sig(pct) + '% ' + (up ? 'increase' : 'reduction') + '.</p>';
  }

  function render() {
    if (!data) return;
    renderCompare(); renderCompanyTotal(); renderTeamBars(); renderIfEveryone();
  }

  // ---- Wiring ----
  function applyData(next) {
    data = next;
    if (!data || !Array.isArray(data.teams) || !data.teams.length) { data = null; return false; }
    const saved = AIPF.store.get('team:mine', null);
    team.myTeam = data.teams.some((t) => t.id === saved) ? saved : data.teams[0].id;
    return true;
  }

  // Public hook so a deployment can supply real roster data after it loads.
  AIPF.setTeamData = function (next) {
    if (!root) { AIPF.TEAM_DATA = next; return; }
    if (!applyData(next)) return;
    root.querySelector('#aipf-team').hidden = false;
    renderPicker();
    render();
  };

  AIPF.initTeam = function (rootEl) {
    root = rootEl;
    const panel = root.querySelector('#aipf-team');
    if (!applyData(AIPF.TEAM_DATA)) { if (panel) panel.hidden = true; return; }
    panel.hidden = false;

    // Sample data must never be mistaken for the company's real numbers.
    const warn = root.querySelector('#aipf-tm-sample');
    if (warn) warn.hidden = !data.sample;

    renderPicker();
    root.querySelector('#aipf-tm-team').addEventListener('change', (e) => {
      team.myTeam = e.target.value;
      AIPF.store.set('team:mine', team.myTeam);
      AIPF.emitUpdate();
    });

    AIPF.onUpdate(render);
  };
})(window.AIPF = window.AIPF || {});
