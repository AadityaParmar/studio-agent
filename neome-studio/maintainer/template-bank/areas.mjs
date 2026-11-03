// Build area rule (ticket 04 v2). Per sheet, first hit wins:
//   1. Module tag (form's details.modules) — vote 100; Module-tagged actions vote 10
//   2. Group whose menu actions target the sheet — 1 vote per action, most votes wins
//   3. workflow: area of the other sheets the same workflow touches
//   4. ref neighbours (who refs me, whom I ref), repeated till stable
//   5. `Orphans (maybe dead)` — low weight for Pattern tagging
// Reports follow the action that opens them, else their first source sheet. Workflows: diagram Module (Modules
// mode), else the event node's sheet, else the most-touched sheet. Forms that back no sheet follow the report or
// action using them. Ties go to the first area seen.
import { idsIn, vals } from "./build-json.mjs";

export const UN = "unassigned";
export const ORPHANS = "Orphans (maybe dead)";

const top = (counts) => [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
const tally = (keys) => { const c = new Map(); for (const k of keys) c.set(k, (c.get(k) || 0) + 1); return c; };
const moduleOf = (x) => x?.details?.modules?.moduleIdSet?.[0];

/**
 * @returns {{areas: Map<string, Area>, list: Area[], sheetArea: Map, how: Map, reportArea: Map, formArea: Map}}
 *   Area = {key, name, source: "Module"|"Group"|"none", sheets:Set, actions:[{a, roles}], reports:Set, wfs:[], forms:Set}
 *   list = areas with any sheet, action, report or workflow, in creation order. how: sheetId → direct|workflow|refs.
 */
export function assignAreas(ent, ix) {
  const { sheets, actions, reports, groups, modules, dias, forms, sheetById } = ix;
  const moduleIds = new Set(modules.map((m) => m.metaId));
  const areas = new Map();
  const area = (key, name) => {
    if (!areas.has(key)) {
      const source = key === UN ? "none" : moduleIds.has(key) ? "Module" : "Group";
      areas.set(key, { key, name: name ?? (key === UN ? ORPHANS : key), source, sheets: new Set(), actions: [], reports: new Set(), wfs: [], forms: new Set() });
    }
    return areas.get(key);
  };

  // 1 + 2: votes
  const votes = new Map(); // sheetId -> Map(areaKey -> votes)
  const vote = (sid, key, n = 1) => {
    if (!sid || !sheetById[sid]) return;
    const m = votes.get(sid) || new Map();
    m.set(key, (m.get(key) || 0) + n);
    votes.set(sid, m);
  };
  const reportArea = new Map();
  for (const m of modules) area(m.metaId, m.name);
  for (const s of sheets) { const k = moduleOf(ix.formById[s.formId]); if (k) vote(s.metaId, k, 100); }
  const moduleTagged = new Set();
  for (const a of actions) {
    const k = moduleOf(a);
    if (!k) continue;
    moduleTagged.add(a.metaId);
    area(k).actions.push({ a, roles: [] });
    vote(a.spreadsheetId, k, 10);
    if (a.reportId) reportArea.set(a.reportId, k);
  }
  for (const r of reports) { const k = moduleOf(r); if (k) reportArea.set(r.metaId, k); }
  for (const g of groups) {
    const perms = vals(g.actionPermissionMap);
    if (!perms.length) continue;
    const ar = area(g.metaId, g.details?.name);
    for (const p of perms) {
      const a = ix.actionById[p.metaId];
      if (!a || moduleTagged.has(a.metaId)) continue;
      ar.actions.push({ a, roles: p.roleIdSet });
      vote(a.spreadsheetId, g.metaId);
      if (a.reportId && !reportArea.has(a.reportId)) reportArea.set(a.reportId, g.metaId);
    }
  }
  const sheetArea = new Map();
  const how = new Map();
  const place = (sid, key, by) => { sheetArea.set(sid, key); how.set(sid, by); };
  for (const s of sheets) { const m = votes.get(s.metaId); if (m) place(s.metaId, top(m), "direct"); }

  // 3: workflow neighbours
  for (const d of dias) {
    const ids = idsIn(d.nodeMap, "mss").filter((x) => sheetById[x]);
    const known = ids.map((x) => sheetArea.get(x)).filter(Boolean);
    if (!known.length) continue;
    const k = top(tally(known));
    for (const x of ids) if (!sheetArea.has(x)) place(x, k, "workflow");
  }

  // 4: ref neighbours
  for (let changed = true; changed; ) {
    changed = false;
    for (const s of sheets) {
      if (sheetArea.has(s.metaId)) continue;
      const near = ix.refPairs
        .map(([a, b]) => (a === s.metaId ? b : b === s.metaId ? a : null))
        .map((o) => o && sheetArea.get(o))
        .filter(Boolean);
      if (near.length) { place(s.metaId, top(tally(near)), "refs"); changed = true; }
    }
  }

  // 5: the rest → Orphans
  for (const s of sheets) {
    const k = sheetArea.get(s.metaId) || UN;
    sheetArea.set(s.metaId, k);
    area(k).sheets.add(s.metaId);
  }

  for (const r of reports) {
    let k = reportArea.get(r.metaId);
    if (!k) { const from = r.fromSpreadsheetIdSet?.[0] || r.fromSpreadsheetId; k = from ? sheetArea.get(from) : UN; }
    reportArea.set(r.metaId, k || UN);
    area(k || UN).reports.add(r.metaId);
  }

  const useModules = modules.length > 0;
  for (const d of dias) {
    let k = useModules && d.moduleId && areas.has(d.moduleId) ? d.moduleId : null;
    if (!k) {
      const ev = Object.values(d.nodeMap || {}).find((n) => n.kind?.startsWith("event") && n.spreadsheetId);
      if (ev) k = sheetArea.get(ev.spreadsheetId);
    }
    if (!k) k = top(tally(idsIn(d.nodeMap, "mss").map((sid) => sheetArea.get(sid)).filter(Boolean)));
    area(k || UN).wfs.push(d);
  }

  const formArea = new Map();
  for (const r of reports) for (const f of [r.inputFormId, r.outputFormId]) if (f && !formArea.has(f)) formArea.set(f, reportArea.get(r.metaId));
  for (const a of actions) if (a.inputFormId && !formArea.has(a.inputFormId)) formArea.set(a.inputFormId, sheetArea.get(a.spreadsheetId) || UN);
  for (const fm of forms) if (!ix.formSheet.has(fm.metaId)) area(formArea.get(fm.metaId) || UN).forms.add(fm.metaId);

  const list = [...areas.values()].filter((a) => a.sheets.size || a.actions.length || a.reports.size || a.wfs.length);
  return { areas, list, sheetArea, how, reportArea, formArea };
}
