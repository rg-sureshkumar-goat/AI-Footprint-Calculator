/**
 * devices.js — FEATURE 4 (Project 2): Device manufacturing spread over use.
 *
 * Most of a phone's, laptop's, or TV's life-cycle carbon comes from making it,
 * so an activity-only digital day leaves most of it out. Employees list the
 * devices they own; each device's manufacturing carbon is spread evenly over
 * the days they keep it and divided among the people who share it. The sum is
 * added to the digital-day total as its own "manufacturing" component (never
 * to the AI total), in carbon, and in water for phones only.
 *
 * Manufacturing energy is not counted for any device: no source reports it.
 */
(function (AIPF) {
  'use strict';

  const { el, esc, store } = AIPF;
  const MFG = AIPF.DEVICE_MFG;
  const STORE_KEY = 'digital:devices';
  const byId = (id) => MFG.find((d) => d.id === id);

  let root = null;
  let devices = [];  // [{ id, n: number owned, years, share: people sharing }]

  const clampNum = (v, min, max, dflt) => {
    const n = Number(v);
    return isFinite(n) ? Math.max(min, Math.min(max, n)) : dflt;
  };
  function normalise(d) {
    const m = byId(d.id) || MFG[0];
    return {
      id: m.id,
      n: Math.round(clampNum(d.n, 0, 50, 1)),
      years: clampNum(d.years, 0.5, 30, m.years),
      share: Math.round(clampNum(d.share, 1, 50, 1)),
    };
  }

  // Daily share of one device row: kg x number / (years x 365) / sharers.
  function perDay(d) {
    const m = byId(d.id);
    const k = d.n / (d.years * 365) / d.share;
    return { carbon: m.kg * 1000 * k, water: m.waterL ? m.waterL * k : null };
  }

  // The manufacturing component of the digital-day total.
  function component() {
    const rows = devices.filter((d) => d.n > 0);
    if (!rows.length) return null;
    let c = 0, w = 0;
    const items = rows.map((d) => {
      const p = perDay(d);
      c += p.carbon; if (p.water) w += p.water;
      return { d: d, m: byId(d.id), p: p };
    });
    const summary = '<b>' + AIPF.fmtCarbon(c) + '</b> · ' + (w ? '<b>' + AIPF.fmtWater(w) + '</b> (phones only, mostly grey water)' : 'no water figure') + ' · no energy';
    let detail = '<p class="aipf-dg-h">Manufacturing, per device</p><ul class="aipf-dg-act-parts aipf-mf-parts">';
    for (const it of items) {
      detail += '<li><span class="aipf-mf-name">' + esc(it.m.label) + (it.d.n > 1 ? ' × ' + it.d.n : '') +
        '</span> <span class="aipf-tag aipf-tag--typ">' + esc(it.m.tag) + '</span>: <b>' + AIPF.fmtCarbon(it.p.carbon) + '</b> a day' +
        ' · water: ' + (it.p.water ? '<b>' + AIPF.fmtWater(it.p.water) + '</b> a day, mostly grey water' : 'no manufacturing water figure found') + '</li>';
    }
    detail += '</ul>';
    const cardNote = 'Includes device manufacturing in carbon' + (w ? ' and phone manufacturing water (mostly grey water, measured differently from the other water figures)' : '') +
      '; energy excludes it, because no source reports manufacturing energy.';
    return { id: 'manufacturing', label: 'Manufacturing (spread per day kept)', carbon: [c, c, c], water: [w, w, w], summary: summary, detail: detail, cardNote: cardNote };
  }
  AIPF.digitalExtras = AIPF.digitalExtras || [];
  AIPF.digitalExtras.push(component);
  AIPF.deviceManufacturing = component;

  // ---- "My devices" list ----
  function save() { store.set(STORE_KEY, devices); }
  function load() {
    const v = store.get(STORE_KEY, null);
    if (Array.isArray(v)) devices = v.filter((d) => d && byId(d.id)).map(normalise);
  }

  function numberInput(value, min, max, step, label, onSet) {
    const inp = document.createElement('input');
    inp.type = 'number'; inp.min = String(min); inp.max = String(max); inp.step = String(step);
    inp.value = String(value);
    inp.setAttribute('aria-label', label);
    inp.addEventListener('change', () => onSet(inp));
    return inp;
  }

  function renderList() {
    const box = root.querySelector('#aipf-mf-rows');
    box.innerHTML = '';
    devices.forEach((d, i) => {
      const m = byId(d.id);
      const line = el('div', 'aipf-mf-row');
      const sel = el('select', 'aipf-dg-sel');
      sel.setAttribute('aria-label', 'Device type');
      for (const x of MFG) sel.appendChild(AIPF.option(x.id, x.label, x.id === d.id));
      // A new type starts from its own source's default years.
      sel.addEventListener('change', () => { d.id = sel.value; d.years = byId(d.id).years; save(); renderList(); AIPF.emitUpdate(); });
      line.appendChild(sel);

      const set = (key, min, max, round) => (inp) => {
        let v = clampNum(inp.value, min, max, d[key]);
        if (round) v = Math.round(v);
        d[key] = v; inp.value = String(v); save(); AIPF.emitUpdate();
      };
      const fields = el('div', 'aipf-mf-fields');
      const f = (text, input) => { const l = el('label', 'aipf-mf-field'); l.appendChild(input); l.appendChild(document.createTextNode(' ' + text)); fields.appendChild(l); };
      f('owned', numberInput(d.n, 0, 50, 1, 'Number owned', set('n', 0, 50, true)));
      f('years kept', numberInput(d.years, 0.5, 30, 0.5, 'Years kept', set('years', 0.5, 30, false)));
      f('people sharing', numberInput(d.share, 1, 50, 1, 'Shared with how many people, including you', set('share', 1, 50, true)));
      line.appendChild(fields);

      const rm = el('button', 'aipf-rowdel', '×');
      rm.type = 'button'; rm.setAttribute('aria-label', 'Remove this device');
      rm.addEventListener('click', () => { devices.splice(i, 1); save(); renderList(); AIPF.emitUpdate(); });
      line.appendChild(rm);

      line.appendChild(el('p', 'aipf-mf-src',
        'About ' + m.kg + ' kg CO₂e to make (' + esc(m.tag) + '): ' + esc(m.basis) + ', <a href="' + m.url + '" target="_blank" rel="noopener">' + esc(m.src) + '</a>. ' +
        'Default ' + m.years + ' years, the source’s own assumption.'));
      box.appendChild(line);
    });
    if (!devices.length) box.appendChild(el('p', 'aipf-tk-empty', 'No devices yet.'));
  }

  AIPF.initDevices = function (rootEl) {
    root = rootEl;
    if (!root.querySelector('#aipf-mf-rows')) return;
    load();
    renderList();
    root.querySelector('#aipf-mf-add').addEventListener('click', () => {
      devices.push(normalise({ id: 'phone', n: 1, years: byId('phone').years, share: 1 }));
      save(); renderList(); AIPF.emitUpdate();
    });
  };
})(window.AIPF = window.AIPF || {});
