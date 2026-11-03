// Neome Build JSON: parse, index, dedupe, kind check. Shape: {type:"ent", payload:{studioEnt:{…}}};
// every *Map = {keys:[…], map:{id→obj}}. Ticket: .scratch/template-bank/issues/01-sample-neome-builds.md.

/** Values of a `{keys, map}` resource map, in `keys` order. */
export const vals = (m) => (m && m.keys ? m.keys.map((k) => m.map[k]).filter(Boolean) : Object.values(m?.map || {}));

/** Distinct `<prefix>-<id>` strings anywhere inside obj (e.g. "mss" = spreadsheet, "mrp" = report). */
export const idsIn = (obj, prefix) =>
  [...new Set((JSON.stringify(obj).match(new RegExp(`"(${prefix}-[A-Za-z0-9]+)"`, "g")) || []).map((s) => s.slice(1, -1)))];

export const isRef = (f) => f.type === "ref" || f.type === "refSet";

/** Build JSON text → studioEnt. Throws on a file that is not a Neome Build export. */
export function parseBuild(text) {
  const ent = JSON.parse(text)?.payload?.studioEnt;
  if (!ent || !ent.entId || !ent.details) throw new Error("not a Neome Build JSON (payload.studioEnt with entId + details)");
  return ent;
}

/** Build version ID as text (real exports: opaque string ID; old fixtures: number). */
export const versionId = (ent) => String(ent.version);
/** Number for newest-first ordering: versionCode when present, else numeric version, else 0. */
const versionOrder = (ent) => (Number.isFinite(Number(ent.versionCode)) && ent.versionCode != null ? Number(ent.versionCode) : Number.isFinite(Number(ent.version)) ? Number(ent.version) : 0);

/**
 * Dedupe [{file, ent}] by entId + version; of several versions of one entId keep the newest
 * (a Build keeps one Build code). Returns {builds, skipped:[{file, reason}]}, input order kept.
 */
export function pickBuilds(entries) {
  const best = new Map();
  const skipped = [];
  for (const e of entries) {
    const cur = best.get(e.ent.entId);
    if (!cur) { best.set(e.ent.entId, e); continue; }
    if (String(e.ent.version) === String(cur.ent.version)) { skipped.push({ file: e.file, reason: `duplicate of ${cur.file}` }); continue; }
    const [a, b] = [versionOrder(e.ent), versionOrder(cur.ent)];
    if (a === b) skipped.push({ file: e.file, reason: `duplicate of ${cur.file}` });
    else if (a < b) skipped.push({ file: e.file, reason: `older version than ${cur.file}` });
    else { skipped.push({ file: cur.file, reason: `older version than ${e.file}` }); best.set(e.ent.entId, e); }
  }
  const keep = new Set(best.values());
  return { builds: entries.filter((e) => keep.has(e)), skipped };
}

/** Lookup tables every digest step needs. */
export function buildIndex(ent) {
  const name = new Map();
  const put = (id, n) => id && n && name.set(id, n);
  const forms = vals(ent.formMap), sheets = vals(ent.spreadsheetMap), roles = vals(ent.roleMap);
  const actions = vals(ent.actionMap), reports = vals(ent.reportMap), groups = vals(ent.groupMap);
  const vars = vals(ent.varMap), modules = vals(ent.moduleMap), dias = vals(ent.autoDiaMap);
  const fieldsOf = new Map(); // formId -> [{comp, f}]
  for (const fm of forms) {
    put(fm.metaId, fm.details?.name);
    const list = [];
    for (const c of vals(fm.compositeMap)) {
      put(c.metaId, c.details?.name);
      for (const f of vals(c.fieldMap)) { put(f.metaId, f.details?.name); list.push({ comp: c, f }); }
    }
    fieldsOf.set(fm.metaId, list);
  }
  for (const x of [...sheets, ...roles, ...actions, ...reports, ...groups, ...vars]) put(x.metaId, x.details?.name);
  for (const x of [...modules, ...vals(ent.deeplinkMap)]) put(x.metaId, x.name || x.details?.name);
  for (const p of vals(ent.pluginMap)) put(p.metaId, p.details?.name || p.name);
  const N = (id) => name.get(id) || "?";
  return {
    ent, forms, sheets, roles, actions, reports, groups, vars, modules, dias, fieldsOf, N,
    Ns: (ids) => (Array.isArray(ids) ? ids : []).map(N).join(", "),
    fieldById: new Map([...fieldsOf.values()].flat().map((e) => [e.f.metaId, e.f])),
    sheetById: ent.spreadsheetMap?.map || {},
    formById: ent.formMap?.map || {},
    varById: ent.varMap?.map || {},
    reportById: ent.reportMap?.map || {},
    actionById: ent.actionMap?.map || {},
    formSheet: new Map(sheets.map((s) => [s.formId, s])),
    /** [fromSheetId, toSheetId] for every ref / refSet field between sheets. */
    refPairs: sheets.flatMap((s) => (fieldsOf.get(s.formId) || [])
      .filter((e) => isRef(e.f) && ent.spreadsheetMap.map[e.f.spreadsheetId])
      .map((e) => [s.metaId, e.f.spreadsheetId])),
  };
}

/**
 * Kinds in the Build missing from the parser dictionary (kinds.json, from docs/studio-ai-docs): a hint the docs
 * or the digest are behind. Returns ["field hologram", "node teleport", …] sorted, deduped.
 */
export function unknownKinds(ent, kinds) {
  const ix = buildIndex(ent);
  const out = new Set();
  const check = (kind, v) => { if (v && kinds[kind] && !kinds[kind].includes(v)) out.add(`${kind} ${v}`); };
  for (const fm of ix.forms) for (const c of vals(fm.compositeMap)) {
    check("composite", c.type);
    for (const f of vals(c.fieldMap)) check("field", f.type);
  }
  for (const v of ix.vars) check("var", v.kind);
  for (const r of ix.reports) check("report", r.kind);
  for (const a of ix.actions) check("action", a.kind);
  for (const d of ix.dias) for (const n of Object.values(d.nodeMap || {})) check("node", n.kind);
  return [...out].sort();
}
