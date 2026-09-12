/**
 * team-data.js — the company roster the team dashboard reads.
 *
 * ⚠ THE FIGURES BELOW ARE ILLUSTRATIVE SAMPLE DATA, NOT MEASURED USAGE.
 * They describe a fictional company so the dashboard has something to show out
 * of the box. Replace them before drawing any real conclusion.
 *
 * To wire this to real usage, drop this file and call AIPF.setTeamData() with
 * the same shape once your own data has loaded:
 *
 *   fetch('/api/ai-usage/teams')
 *     .then((r) => r.json())
 *     .then((d) => AIPF.setTeamData(d));
 *
 * A company would normally generate `profile` by aggregating the API-gateway
 * or SSO-proxy logs that already sit in front of its model providers: group a
 * month of requests by team, map each request to the nearest output-length
 * bucket, and divide by headcount and working days.
 *
 * Shape:
 *   company  { name, headcount, workingDays }  headcount covers everyone,
 *                                              including people who never use AI
 *   teams[]  { id, name, headcount, profile[] }
 *   profile[] { model, size, count }           average prompts per person per
 *                                              working day; fractional is fine
 *
 * `model` must match an id in data.js MODELS; `size` an id in SIZES.
 */
(function (AIPF) {
  'use strict';

  AIPF.TEAM_DATA = {
    sample: true,  // drives the "sample data" warning in the UI; omit for real data
    company: { name: 'Northwind Labs', headcount: 1240, workingDays: 250 },
    teams: [
      {
        id: 'eng', name: 'Engineering', headcount: 380,
        profile: [
          { model: 'claude-opus-4-8',        size: 'agent',   count: 1.1 },
          { model: 'claude-sonnet-4-6',      size: 'agent',   count: 2.4 },
          { model: 'claude-sonnet-4-6',      size: 'chat',    count: 22 },
          { model: 'gpt-5.5',                size: 'chat',    count: 9 },
          { model: 'gpt-5.4-mini',           size: 'email',   count: 6 },
        ],
      },
      {
        id: 'data', name: 'Data Science', headcount: 95,
        profile: [
          { model: 'claude-opus-4-8',        size: 'agent',   count: 0.6 },
          { model: 'gpt-5.5',                size: 'report',  count: 2.5 },
          { model: 'claude-sonnet-4-6',      size: 'chat',    count: 18 },
          { model: 'gemini-3.1-pro-preview', size: 'summary', count: 7 },
        ],
      },
      {
        id: 'product', name: 'Product', headcount: 120,
        profile: [
          { model: 'claude-sonnet-4-6',      size: 'report',  count: 1.2 },
          { model: 'claude-sonnet-4-6',      size: 'chat',    count: 14 },
          { model: 'gpt-5.5',                size: 'summary', count: 8 },
          { model: 'gemini-3.5-flash',       size: 'email',   count: 5 },
        ],
      },
      {
        id: 'marketing', name: 'Marketing', headcount: 140,
        profile: [
          { model: 'gpt-5.5',                size: 'report',  count: 1.6 },
          { model: 'gpt-5.5',                size: 'chat',    count: 11 },
          { model: 'claude-sonnet-4-6',      size: 'summary', count: 6 },
          { model: 'gemini-3.5-flash',       size: 'tweet',   count: 12 },
        ],
      },
      {
        id: 'sales', name: 'Sales', headcount: 210,
        profile: [
          { model: 'gpt-5.4-mini',           size: 'email',   count: 18 },
          { model: 'claude-sonnet-4-6',      size: 'chat',    count: 7 },
          { model: 'gemini-3.5-flash',       size: 'summary', count: 4 },
        ],
      },
      {
        id: 'support', name: 'Customer Support', headcount: 180,
        profile: [
          { model: 'claude-haiku-4-5-20251001', size: 'chat',  count: 46 },
          { model: 'gemini-3.1-flash-lite',     size: 'email', count: 22 },
          { model: 'claude-sonnet-4-6',         size: 'chat',  count: 4 },
        ],
      },
      {
        id: 'legal', name: 'Legal & Compliance', headcount: 45,
        profile: [
          { model: 'claude-opus-4-8',        size: 'long',    count: 0.9 },
          { model: 'claude-opus-4-8',        size: 'report',  count: 2.2 },
          { model: 'claude-sonnet-4-6',      size: 'chat',    count: 6 },
        ],
      },
      {
        id: 'people', name: 'People & Ops', headcount: 70,
        profile: [
          { model: 'claude-sonnet-4-6',      size: 'chat',    count: 6 },
          { model: 'gpt-5.4-mini',           size: 'email',   count: 9 },
          { model: 'gemini-3.5-flash',       size: 'summary', count: 3 },
        ],
      },
    ],
  };
})(window.AIPF = window.AIPF || {});
