/**
 * store.js — namespaced localStorage with safe fallbacks.
 *
 * Every read and write is wrapped: a private window, cleared site data, or a
 * browser set to block storage all throw on access rather than returning
 * empty, and the page has to render correctly anyway. When storage is
 * unavailable we fall back to an in-memory map so a session still works for as
 * long as the tab is open.
 */
(function (AIPF) {
  'use strict';

  const PREFIX = 'aipf:';
  const memory = new Map();
  let available = null;

  function canUse() {
    if (available !== null) return available;
    try {
      const k = PREFIX + '__probe';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      available = true;
    } catch (e) {
      available = false;
    }
    return available;
  }

  AIPF.store = {
    get(key, fallback) {
      const k = PREFIX + key;
      try {
        const raw = canUse() ? window.localStorage.getItem(k) : memory.get(k);
        if (raw == null) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      const k = PREFIX + key;
      try {
        const raw = JSON.stringify(value);
        if (canUse()) window.localStorage.setItem(k, raw);
        else memory.set(k, raw);
        return true;
      } catch (e) {
        // Quota exceeded, or storage blocked mid-session. Keep the tab working.
        try { memory.set(k, JSON.stringify(value)); } catch (e2) { /* give up quietly */ }
        return false;
      }
    },
    remove(key) {
      const k = PREFIX + key;
      try { if (canUse()) window.localStorage.removeItem(k); } catch (e) { /* ignore */ }
      memory.delete(k);
    },
    isPersistent() { return canUse(); },
  };

  // ---- Dates: local-day keys, so a log lands on the day the user saw ----
  AIPF.dayKey = function (d) {
    d = d || new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  AIPF.monthKey = function (d) {
    d = d || new Date();
    return AIPF.dayKey(d).slice(0, 7);
  };
  AIPF.dayKeysBack = function (n, from) {
    const out = [];
    const base = from ? new Date(from) : new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      out.push(AIPF.dayKey(d));
    }
    return out;
  };
})(window.AIPF = window.AIPF || {});
