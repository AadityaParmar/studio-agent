// Build digest text: field notation, form logic, workflow tree, area file, overview (ticket 04 v2).
// Kept: actions, sheets (fields, refs, options, roles, logic), reports, other forms, workflows.
// Dropped: automations (legacy), layouts, styles, IDs, positions, per-field permissions, NeoQL text,
// deeplink / driveSheet / translation detail, dividers / labels / info fields.
import { idsIn, isRef, vals } from "./build-json.mjs";
import { UN } from "./areas.mjs";

export const DROPPED_FIELDS = ["divider", "label", "info"];
export const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
/** Strip tags, squash spaces, cut at n with "…". */
export const short = (s, n = 70) => {
  s = String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) + "…" : s;
};
/** Message body as written in a digest: quotes swapped for backticks so scrub can find the end (`msg "…"`). */
export const msgText = (s) => short(s, 60).replace(/["']/g, "`");
const kb = (n) => (n / 1024).toFixed(1);

/** One field as `Name:type→Ref(area){opts}@roles⇐copied*`; null for dropped kinds. homeKey: annotate refs leaving it. */
export function fieldStr(f, ix, ar, homeKey) {
  const t = f.type;
  if (DROPPED_FIELDS.includes(t)) return null;
  let s = `${f.details?.name}:${t}`;
  if (isRef(f) && f.spreadsheetId) {
    s += `→${ix.N(f.spreadsheetId)}`;
    const ta = homeKey !== undefined && ix.sheetById[f.spreadsheetId] && ar.sheetArea.get(f.spreadsheetId);
    if (ta && ta !== homeKey) s += `(${ar.areas.get(ta)?.name})`;
  }
  if (t === "pickText" && f.sourceVarId) {
    const v = ix.varById[f.sourceVarId];
    const opts = v ? vals(v.value).map((o) => o.value).filter(Boolean) : [];
    s += `{${opts.slice(0, 8).join("|")}${opts.length > 8 ? "|…" : ""}}`;
  }
  if (t === "pickUser" && f.roleIdDataSource) s += `@${ix.Ns(f.roleIdDataSource.roleIdSet || f.roleIdDataSource)}`;
  if (f.refTargetId) s += `⇐${ix.N(f.refFieldId)}`;
  if (f.required) s += "*";
  return s;
}

function formLogic(fm, ix) {
  const bits = [];
  for (const x of vals(fm.formulaMap)) bits.push(`formula ${ix.N(x.assignToFieldId)} = ${short(String(x.formula?.value || "").replace(/\$\{f:([^}]+)\}/g, "$1"), 90)}`);
  for (const x of vals(fm.visibilityRuleMap)) bits.push(`visibility ${x.name}: if ${ix.N(x.visibilityCondMap?.statement?.lhs)} ${x.visibilityCondMap?.statement?.operator || "…"}`);
  for (const x of vals(fm.eventMap)) bits.push(`event ${x.kind} ${x.name}`);
  return bits;
}

/** Lines for a sheet's form: one per composite, then up to 6 logic bits. */
export function formLines(fm, ix, ar, homeKey) {
  const byComp = new Map();
  for (const e of ix.fieldsOf.get(fm.metaId) || []) {
    const s = fieldStr(e.f, ix, ar, homeKey);
    if (!s) continue;
    const k = `${e.comp.details?.name}${e.comp.type === "grid" ? " (grid)" : ""}`;
    byComp.set(k, [...(byComp.get(k) || []), s]);
  }
  const lines = [...byComp].map(([k, fs]) => `  - ${k}: ${fs.join(", ")}`);
  const lg = formLogic(fm, ix);
  if (lg.length) lines.push(`  - logic (${lg.length}): ${lg.slice(0, 6).join("; ")}${lg.length > 6 ? "; …" : ""}`);
  return lines;
}

// ---------- workflow nodes ----------

/** argBinder → readable text (Curr.Status, "Approved", var:X, ctx:attr). */
export function arg(b, ix) {
  if (b == null) return "?";
  if (typeof b !== "object") return String(b);
  const v = b.value || {};
  switch (b.kind) {
    case "parameter": return `${(v.paramId || "").startsWith("$") ? v.paramId.slice(1) : "param"}.${v.fieldId === "$RowId" ? "RowId" : ix.N(v.fieldId)}`;
    case "field": return ix.N(v.fieldId);
    case "constant": return JSON.stringify(v.value?.value ?? v.value ?? v);
    case "derived": {
      if (v.valueOptionId) {
        const f = ix.fieldById.get(v.derivedFieldId);
        const sv = f && ix.varById[f.sourceVarId];
        return `"${sv?.value?.map?.[v.valueOptionId]?.value || v.valueOptionId}"`;
      }
      const x = v.valueBoolean ?? v.valueText ?? v.valueNumber ?? v.valueDecimal;
      return x === undefined ? "…" : JSON.stringify(x);
    }
    case "variable": return `var:${ix.N(v.varId)}`;
    case "context": return `ctx:${v.attribute}`;
    default: return b.kind || "?";
  }
}

export function cond(c, ix) {
  if (!c) return "";
  if (c.statement) return `${arg(c.statement.lhs, ix)} ${c.statement.operator}${c.statement.rhs ? " " + arg(c.statement.rhs, ix) : ""}`;
  const m = c.keys ? vals(c) : vals(c.map);
  return m.length ? "(" + m.map((x) => cond(x, ix)).join(c.andOr === false || c.andOr === "or" ? " or " : " and ") + ")" : "";
}

const defaultName = (n) => !n.name || /^Neo/.test(n.name) || n.name.toLowerCase() === String(n.kind).toLowerCase();

/** kind(sheets/reports) "builder name" [if …; on …; msg "…"; to …; every …; deeplink …; plugin …] */
export function nodeLabel(n, ix) {
  const t = [...new Set(idsIn(n, "mss").concat(idsIn(n, "mrp")).map(ix.N).filter((x) => x !== "?"))];
  let s = n.kind + (t.length ? `(${t.join(",")})` : "");
  if (!defaultName(n)) s += ` "${n.name}"`;
  const extra = [];
  if (n.condition) extra.push(`if ${cond(n.condition, ix)}`);
  if (n.kind === "branchSwitchCase" && n.field) extra.push(`on ${arg({ kind: "parameter", value: n.field }, ix)}`);
  const msg = n.subject?.value || n.customTitle?.value || n.message?.value || (n.templateVarMap ? n.templateVarMap.keys?.join(" ") : null);
  if (msg) extra.push(`msg "${msgText(msg)}"`);
  if (n.toUsers?.users) extra.push(`to ${arg(n.toUsers.users, ix)}`);
  if (n.scheduler?.repeatSetting) {
    const r = n.scheduler.repeatSetting;
    extra.push(`every ${r.frequency || 1} ${r.repeatFrequencyKind}${r.setOfTime ? " @" + r.setOfTime.join(",") : ""}`);
  }
  if (n.deeplinkId) extra.push(`deeplink ${ix.N(n.deeplinkId)}`);
  if (n.pluginId) extra.push(`plugin ${ix.N(n.pluginId)}`);
  return extra.length ? `${s} [${extra.join("; ")}]` : s;
}

/** Workflow as an indented tree from edgeMap (start = node with no incoming edge); branch kind shown, ↺ = seen. */
export function workflowTree(d, ix) {
  const nodes = d.nodeMap || {}, edges = Object.values(d.edgeMap || {});
  const outs = new Map();
  for (const e of edges) outs.set(e.fromNodeId, [...(outs.get(e.fromNodeId) || []), e]);
  const hasIn = new Set(edges.map((e) => e.toNodeId));
  const lines = [`### Workflow: ${d.label || d.name} (${Object.keys(nodes).length} nodes)`];
  const seen = new Set();
  const walk = (id, depth, via) => {
    const n = nodes[id];
    if (!n) return;
    const pre = `${"  ".repeat(depth)}- ${via && via !== "NEXT" ? `[${via}] ` : ""}`;
    if (seen.has(id)) { lines.push(`${pre}↺ ${n.kind}`); return; }
    seen.add(id);
    lines.push(`${pre}${nodeLabel(n, ix)}`);
    for (const e of outs.get(id) || []) walk(e.toNodeId, depth + 1, e.kind);
  };
  for (const id of Object.keys(nodes)) if (!hasIn.has(id)) walk(id, 0);
  return lines;
}

// ---------- files ----------

export function renderArea(a, ix, ar) {
  const { N, Ns, ent } = ix;
  const out = [];
  const w = (s = "") => out.push(s);
  w(`# Build area: ${a.name}`);
  w(`Build: ${ent.details.name} · area source: ${a.source}`);
  if (a.key === UN) w(`ORPHAN: no menu action, workflow or ref reaches these. Maybe dead or test. Low weight for Pattern tagging.`);
  w(`field notation: Name:type, →RefSheet (other area named), {pickText options}, @roles, ⇐copied-from-ref, * required. Dividers/labels dropped.`);
  w();
  if (a.actions.length) {
    w(`## Actions (→ target @roles)`);
    for (const { a: x, roles } of a.actions) w(`- ${x.details?.name} [${x.kind} → ${N(x.spreadsheetId || x.reportId || x.inputFormId)}]${roles?.length ? ` @${Ns(roles)}` : ""}`);
    w();
  }
  if (a.sheets.size) {
    w(`## Sheets`);
    for (const sid of a.sheets) {
      const s = ix.sheetById[sid];
      const perm = (k) => (s[k]?.length ? `${k.replace("RoleSet", "")}@${Ns(s[k])}` : null);
      const perms = ["insertRoleSet", "updateRoleSet", "readRoleSet", "removeRoleSet"].map(perm).filter(Boolean).join(" ");
      const hw = ar.how.get(sid);
      w(`### ${s.details?.name}${s.isMasterSheet ? " (master)" : ""}${hw && hw !== "direct" ? ` (placed by ${hw})` : ""}${perms ? ` — ${perms}` : ""}`);
      const fm = ix.formById[s.formId];
      if (fm) formLines(fm, ix, ar, a.key).forEach((l) => w(l));
    }
    w();
  }
  if (a.reports.size) {
    w(`## Reports`);
    for (const rid of a.reports) {
      const r = ix.reportById[rid];
      const from = r.fromSpreadsheetIdSet || (r.fromSpreadsheetId ? [r.fromSpreadsheetId] : []);
      const merge = r.mergeReportIdSet ? ` merge[${Ns(r.mergeReportIdSet)}]` : "";
      w(`- ${r.details?.name} [${r.kind}] from ${Ns(from) || "—"}${merge} in:${N(r.inputFormId)} out:${N(r.outputFormId)}`);
    }
    w();
  }
  if (a.forms.size) {
    w(`## Other forms (report/action input/output)`);
    for (const fid of a.forms) {
      const fs = (ix.fieldsOf.get(fid) || []).map((e) => fieldStr(e.f, ix, ar)).filter(Boolean);
      w(`- ${N(fid)}: ${fs.slice(0, 10).join(", ")}${fs.length > 10 ? `, …(+${fs.length - 10})` : ""}`);
    }
    w();
  }
  if (a.wfs.length) {
    w(`## Workflows`);
    for (const d of a.wfs) workflowTree(d, ix).forEach((l) => w(l));
    w();
  }
  return out.join("\n");
}

/** Cross-area ref counts: Map "fromKey\u0000toKey" → n, in first-seen order. */
export function crossRefs(ix, ar) {
  const cross = new Map();
  for (const [from, to] of ix.refPairs) {
    const fa = ar.sheetArea.get(from), ta = ar.sheetArea.get(to);
    if (fa !== ta) { const k = `${fa}\u0000${ta}`; cross.set(k, (cross.get(k) || 0) + 1); }
  }
  return cross;
}

/** areaFiles: areaKey → file name; sizes: areaKey → chars. */
export function renderOverview(ix, ar, areaFiles, sizes) {
  const { ent, modules, groups, vars, roles } = ix;
  const count = (label, m) => `${vals(m).length} ${label}`;
  const out = [];
  const w = (s = "") => out.push(s);
  w(`# Build digest: ${ent.details.name}`);
  w(`about: ${ent.details.about || "—"} · version ${ent.version}`);
  w(`counts: ${[count("forms", ent.formMap), count("sheets", ent.spreadsheetMap), count("roles", ent.roleMap), count("actions", ent.actionMap), count("reports", ent.reportMap), count("groups", ent.groupMap), count("vars", ent.varMap), count("workflows", ent.autoDiaMap), count("modules", ent.moduleMap)].join(" · ")}`);
  w(`Build area source: Module tag, else Group actions, else workflow/ref neighbours`);
  w();
  w(`## Roles`);
  w(roles.map((r) => r.details?.name).join(", "));
  w();
  w(`## Build areas`);
  for (const a of ar.list) w(`- [${a.name}](${areaFiles.get(a.key)}): ${a.sheets.size} sheets, ${a.actions.length} actions, ${a.reports.size} reports, ${a.wfs.length} workflows · ${kb(sizes.get(a.key))} KB`);
  const chatOnly = modules.length ? [] : groups.filter((g) => !vals(g.actionPermissionMap).length).map((g) => g.details?.name);
  if (chatOnly.length) w(`- chat-only Groups (no actions): ${chatOnly.join(", ")}`);
  w();
  w(`## Cross-area refs`);
  for (const [k, n] of crossRefs(ix, ar)) { const [f, t] = k.split("\u0000"); w(`- ${ar.areas.get(f).name} → ${ar.areas.get(t).name} (${n})`); }
  w();
  w(`## Option lists (setOfText vars)`);
  for (const v of vars.filter((v) => v.kind === "setOfText")) {
    const opts = vals(v.value).map((o) => o.value).filter(Boolean);
    w(`- ${v.details?.name}: ${opts.slice(0, 12).join(" | ")}${opts.length > 12 ? " | …" : ""}`);
  }
  return out.join("\n");
}
