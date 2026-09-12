/**
 * nav.js — the sticky section bar.
 *
 * The page runs to roughly eight screens. Without this you cannot tell where
 * you are in it, cannot jump between sections, and cannot reach the
 * carbon/water toggle from anywhere below the fold — it sits at the very top,
 * so switching metric while reading the team charts meant scrolling all the
 * way back up and losing your place.
 *
 * The bar carries three things: the running total for today (the number the
 * whole page is about, so it should never be off screen), links to every
 * section with the current one marked, and the metric toggle.
 */
(function (AIPF) {
  'use strict';

  const SECTIONS = [
    { id: 'session',     label: 'Session' },
    { id: 'usage',       label: 'Your use' },
    { id: 'budget',      label: 'Budget' },
    { id: 'team',        label: 'Team' },
    { id: 'context',     label: 'In a year' },
    { id: 'methodology', label: 'Method' },
  ];

  let root = null;
  let bar = null;
  let links = [];
  let targets = [];
  let activeId = null;

  // An anchor jump lands a section at (nav height + NAV_GAP) from the top,
  // set by scroll-margin-top in the CSS. The line that decides which section
  // is current has to sit below where a jump lands, or the section you just
  // jumped to reads as not yet reached and the previous link stays lit.
  const NAV_GAP = 12;   // keep in step with scroll-margin-top
  const SPY_SLACK = 12; // detection line = nav height + NAV_GAP + this

  // Fade the right edge only while the row is actually cut off, and drop the
  // fade once the end is in view, so the cue always means "there is more".
  function syncClip() {
    const row = bar && bar.querySelector('.aipf-nav-links');
    if (!row) return;
    const more = row.scrollWidth - row.clientWidth - row.scrollLeft > 4;
    row.classList.toggle('is-clipped', more);
  }

  // Keep anchor jumps from parking a heading underneath the sticky bar.
  function syncOffset() {
    const h = bar ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty('--aipf-nav-h', h + 'px');
  }

  // The active section is the last one whose top has passed under the bar.
  // Near the very bottom the final section may be too short to ever reach
  // that line, so the end of the page always selects the last link.
  function currentId() {
    const line = (bar ? bar.offsetHeight : 0) + NAV_GAP + SPY_SLACK;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) return targets.length ? targets[targets.length - 1].id : null;
    let id = targets.length ? targets[0].id : null;
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top <= line) id = t.id;
      else break;
    }
    return id;
  }

  function paint() {
    const id = currentId();
    if (id === activeId) return;
    activeId = id;
    for (const a of links) {
      const on = a.dataset.target === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  }
  // Called straight from the scroll handler rather than deferred to an
  // animation frame. The work is six rect reads and an early return when
  // nothing changed, which is cheap enough not to need throttling, and a
  // requestAnimationFrame gate would stop updating entirely wherever frames
  // are suspended — a background tab, a hidden pane — while leaving its own
  // "already queued" latch stuck on.
  const onScroll = paint;

  function renderTotal() {
    const box = root.querySelector('#aipf-nav-total');
    if (!box) return;
    // Mirror whichever figure the page is actually driven by: the logged day
    // when the tracker owns the rows, the entered estimate otherwise.
    const driving = typeof AIPF.trackerIsLogDriving === 'function' && AIPF.trackerIsLogDriving();
    box.textContent = AIPF.fmtMetric(AIPF.aiDaily(AIPF.state.metric));
    const label = root.querySelector('#aipf-nav-label');
    if (label) label.textContent = driving ? 'logged today' : 'a day (example)';
  }

  AIPF.initNav = function (rootEl) {
    root = rootEl;
    bar = root.querySelector('#aipf-nav');
    if (!bar) return;

    links = Array.from(bar.querySelectorAll('.aipf-nav-link'));
    targets = SECTIONS
      .map((s) => ({ id: s.id, el: document.getElementById(s.id) }))
      .filter((t) => t.el);

    // Scroll from script rather than letting the browser follow the fragment.
    // Two reasons. The hash already carries the calculator's shareable state
    // (k=, l=, r= ...), so writing #budget into it would throw away someone's
    // shared estimate on the next reload. And native fragment scrolling proved
    // unreliable with scroll-behavior: smooth, landing nowhere at all.
    // The href stays on each link, so this still works with scripting off.
    const method = document.getElementById('methodology');
    for (const a of links) {
      a.addEventListener('click', (ev) => {
        const id = a.dataset.target;
        const el = document.getElementById(id);
        if (!el) return;
        ev.preventDefault();
        // Jumping to a collapsed disclosure would land on nothing.
        if (id === 'methodology' && method) method.open = true;
        // Jump rather than animate, which is what following the link natively
        // would do. Animating across a page this tall is a long slow pan that
        // makes it harder, not easier, to tell where you have landed, and an
        // instant jump behaves the same everywhere — including contexts where
        // frame-driven animation is suspended.
        const top = el.getBoundingClientRect().top + window.scrollY -
                    (bar ? bar.offsetHeight : 0) - NAV_GAP;
        window.scrollTo(0, Math.max(0, top));
        paint();
      });
    }

    syncOffset();
    syncClip();
    const row = bar.querySelector('.aipf-nav-links');
    if (row) row.addEventListener('scroll', syncClip, { passive: true });
    window.addEventListener('resize', () => { syncOffset(); syncClip(); onScroll(); });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Second trigger, belt and braces. A section crossing the top of the
    // viewport is exactly when the highlight should move, and the observer
    // notices that independently of scroll events. It only asks for a
    // recount — the geometry in currentId still decides, so the two triggers
    // cannot disagree.
    if (typeof window.IntersectionObserver === 'function') {
      const io = new window.IntersectionObserver(onScroll, {
        threshold: [0, 0.01, 0.5, 0.99, 1],
      });
      for (const t of targets) io.observe(t.el);
    }

    paint();

    AIPF.onUpdate(renderTotal);
  };
})(window.AIPF = window.AIPF || {});
