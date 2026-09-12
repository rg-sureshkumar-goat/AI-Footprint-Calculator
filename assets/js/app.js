/**
 * app.js — boots the calculator and every company feature attached to it.
 *
 * Each module registers its renderer through AIPF.onUpdate during init, so the
 * single emitUpdate() below paints the whole page once everything is wired.
 */
(function (AIPF) {
  'use strict';

  function init() {
    const root = document.getElementById('aipf');
    if (!root || root.dataset.ready === '1') return;
    root.dataset.ready = '1';

    AIPF.initCalculator(root);

    // Company features opt in by exposing an init function; each is independent,
    // so the page still works if one is removed.
    for (const name of ['initTracker', 'initTeam', 'initBudget']) {
      if (typeof AIPF[name] === 'function') AIPF[name](root);
    }

    AIPF.emitUpdate();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})(window.AIPF = window.AIPF || {});
