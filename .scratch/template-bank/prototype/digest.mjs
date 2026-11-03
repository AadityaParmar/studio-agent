// PROTOTYPE, throwaway. Template bank ticket "Build digest + flowchart prototype" (v2).
// Usage: node .scratch/template-bank/prototype/digest.mjs [raw/*.json ...]
// Writes raw/digests/<NN>/{overview.md, <area>.md, build.mmd, <area>.wf.mmd}.
// Output holds client data: stays in gitignored raw/.
// v2 decisions: split per Build area; area = Modules if any, else Groups; automations dropped
// (legacy, replaced by workflows); workflow nodes carry builder name + condition/message;
// sheets nothing reaches go to an 'Orphans (maybe dead)' area, flagged.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(here, "..", "raw");
const outRoot = path.join(rawDir, "digests");
fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(rawDir).filter((f) => f.endsWith(".json")).map((f) => path.join(rawDir, f));

const vals = (m) => (m && m.keys ? m.keys.map((k) => m.map[k]).filter(Boolean) : Object.values(m?.map || {}));
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
const mid = (id) => id.replace(/[^A-Za-z0-9]/g, "");
const q = (s) => String(s).replace(/"/g, "'").replace(/[\[\]{}()<>]/g, " ");
const short = (s, n = 70) => { s = String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) + "…" : s; };
const seen = new Set();
const summary = [];

for (const file of files) {
  const ent = JSON.parse(fs.readFileSync(file, "utf8")).payload.studioEnt;
  const dedupe = `${ent.entId}@${ent.version}`;
  if (seen.has(dedupe)) { console.log(`skip dup ${path.basename(file)}`); continue; }
  seen.add(dedupe);
  const NN = String(seen.size).padStart(2, "0");
  const outDir = path.join(outRoot, NN);
  fs.mkdirSync(outDir);

  // ---------- id -> name index ----------
  const name = new Map();
  const put = (id, n) => id && n && name.set(id, n);
  const forms = vals(ent.formMap), sheets = vals(ent.spreadsheetMap), roles = vals(ent.roleMap);
  const actions = vals(ent.actionMap), reports = vals(ent.reportMap), groups = vals(ent.groupMap);
  const vars = vals(ent.varMap), modules = vals(ent.moduleMap), dias = vals(ent.autoDiaMap);
  const fieldsOf = new Map();
  for (const fm of forms) {
    put(fm.metaId, fm.details.name);
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
  const fieldById = new Map([...fieldsOf.values()].flat().map((e) => [e.f.metaId, e.f]));
  const Ns = (ids) => (ids || []).map(N).join(", ");
  const sheetById = ent.spreadsheetMap.map;
  const formSheet = new Map(sheets.map((s) => [s.formId, s]));
  const idsIn = (obj, prefix) => [...new Set((JSON.stringify(obj).match(new RegExp(`"(${prefix}-[A-Za-z0-9]+)"`, "g")) || []).map((s) => s.slice(1, -1)))];

  // ---------- Build areas: Modules if any, else Groups ----------
  const useModules = modules.length > 0;
  const areas = new Map(); // key -> {name, sheets:Set, actions:[], reports:Set, wfs:[], forms:Set}
  const area = (key, nm) => { if (!areas.has(key)) areas.set(key, { key, name: nm, sheets: new Set(), actions: [], reports: new Set(), wfs: [], forms: new Set() }); return areas.get(key); };
  const UN = "unassigned";
  const sheetVotes = new Map(); // sheetId -> Map(areaKey -> votes)
  const vote = (sid, key, n = 1) => { if (!sid || !sheetById[sid]) return; const m = sheetVotes.get(sid) || new Map(); m.set(key, (m.get(key) || 0) + n); sheetVotes.set(sid, m); };
  const reportArea = new Map();
  const modOf = (x) => x?.details?.modules?.moduleIdSet?.[0];
  // per item: Module tag wins; Groups vote for the rest
  for (const m of modules) area(m.metaId, m.name);
  for (const s of sheets) { const k = modOf(ent.formMap.map[s.formId]); if (k) vote(s.metaId, k, 100); }
  for (const a of actions) { const k = modOf(a); if (!k) continue; area(k).actions.push({ a, roles: [] }); vote(a.spreadsheetId, k, 10); if (a.reportId) reportArea.set(a.reportId, k); }
  for (const r of reports) { const k = modOf(r); if (k) reportArea.set(r.metaId, k); }
  const moduleTagged = new Set(actions.filter(modOf).map((a) => a.metaId));
  for (const g of groups) {
    const ap = vals(g.actionPermissionMap);
    if (!ap.length) continue;
    const ar = area(g.metaId, g.details.name);
    for (const p of ap) {
      const a = ent.actionMap.map[p.metaId];
      if (!a || moduleTagged.has(a.metaId)) continue;
      ar.actions.push({ a, roles: p.roleIdSet });
      vote(a.spreadsheetId, g.metaId);
      if (a.reportId && !reportArea.has(a.reportId)) reportArea.set(a.reportId, g.metaId);
    }
  }
  const sheetArea = new Map();
  const how = new Map(); // sheetId -> how assigned
  const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
  for (const s of sheets) { const m = sheetVotes.get(s.metaId); if (m) { sheetArea.set(s.metaId, top(m)); how.set(s.metaId, "direct"); } }
  // fallback 1: workflows touching an unassigned sheet -> area of the other sheets they touch
  for (const d of dias) {
    const ids = idsIn(d.nodeMap, "mss").filter((x) => sheetById[x]);
    const known = ids.map((x) => sheetArea.get(x)).filter(Boolean);
    if (!known.length) continue;
    const c = new Map(); known.forEach((k) => c.set(k, (c.get(k) || 0) + 1));
    for (const x of ids) if (!sheetArea.has(x)) { sheetArea.set(x, top(c)); how.set(x, "workflow"); }
  }
  // fallback 2: ref neighbours (who refs me, whom I ref), repeat till stable
  const refPairs = [];
  for (const s of sheets) for (const e of fieldsOf.get(s.formId) || []) if ((e.f.type === "ref" || e.f.type === "refSet") && sheetById[e.f.spreadsheetId]) refPairs.push([s.metaId, e.f.spreadsheetId]);
  for (let changed = true; changed; ) {
    changed = false;
    for (const s of sheets) {
      if (sheetArea.has(s.metaId)) continue;
      const c = new Map();
      for (const [a, b] of refPairs) { const o = a === s.metaId ? b : b === s.metaId ? a : null; const k = o && sheetArea.get(o); if (k) c.set(k, (c.get(k) || 0) + 1); }
      if (c.size) { sheetArea.set(s.metaId, top(c)); how.set(s.metaId, "refs"); changed = true; }
    }
  }
  for (const s of sheets) {
    const k = sheetArea.get(s.metaId) || UN;
    sheetArea.set(s.metaId, k);
    area(k, k === UN ? "Orphans (maybe dead)" : undefined).sheets.add(s.metaId);
  }
  for (const r of reports) {
    let k = reportArea.get(r.metaId);
    if (!k) { const from = r.fromSpreadsheetIdSet?.[0] || r.fromSpreadsheetId; k = from ? sheetArea.get(from) : UN; }
    reportArea.set(r.metaId, k || UN);
    area(k || UN, "Orphans (maybe dead)").reports.add(r.metaId);
  }
  // workflow home: diagram moduleId (modules mode), else event node's sheet, else most-touched sheet
  for (const d of dias) {
    let k = useModules && d.moduleId && areas.has(d.moduleId) ? d.moduleId : null;
    const nodes = Object.values(d.nodeMap || {});
    if (!k) { const ev = nodes.find((n) => n.kind?.startsWith("event") && n.spreadsheetId); if (ev) k = sheetArea.get(ev.spreadsheetId); }
    if (!k) { const c = new Map(); for (const sid of idsIn(d.nodeMap, "mss")) { const a = sheetArea.get(sid); if (a) c.set(a, (c.get(a) || 0) + 1); } k = [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]; }
    area(k || UN, "Orphans (maybe dead)").wfs.push(d);
  }
  // non-sheet forms: home of the report/action using them
  const formArea = new Map();
  for (const r of reports) for (const f of [r.inputFormId, r.outputFormId]) if (f && !formArea.has(f)) formArea.set(f, reportArea.get(r.metaId));
  for (const a of actions) if (a.inputFormId && !formArea.has(a.inputFormId)) formArea.set(a.inputFormId, sheetArea.get(a.spreadsheetId) || UN);
  for (const fm of forms) if (!formSheet.has(fm.metaId)) area(formArea.get(fm.metaId) || UN, "Orphans (maybe dead)").forms.add(fm.metaId);

  // ---------- renderers ----------
  const fieldStr = ({ f }) => {
    const t = f.type;
    if (["divider", "label", "info"].includes(t)) return null;
    let s = `${f.details.name}:${t}`;
    if ((t === "ref" || t === "refSet") && f.spreadsheetId) {
      const ta = sheetArea.get(f.spreadsheetId);
      s += `→${N(f.spreadsheetId)}`;
    }
    if (t === "pickText" && f.sourceVarId) {
      const v = ent.varMap.map[f.sourceVarId];
      const opts = v ? vals(v.value).map((o) => o.value).filter(Boolean) : [];
      s += `{${opts.slice(0, 8).join("|")}${opts.length > 8 ? "|…" : ""}}`;
    }
    if (t === "pickUser" && f.roleIdDataSource) s += `@${Ns(f.roleIdDataSource.roleIdSet || f.roleIdDataSource)}`;
    if (f.refTargetId) s += `⇐${N(f.refFieldId)}`;
    if (f.required) s += "*";
    return s;
  };
  const formLogic = (fm) => {
    const bits = [];
    for (const x of vals(fm.formulaMap)) bits.push(`formula ${N(x.assignToFieldId)} = ${short(String(x.formula?.value || "").replace(/\$\{f:([^}]+)\}/g, "$1"), 90)}`);
    for (const x of vals(fm.visibilityRuleMap)) bits.push(`visibility ${x.name}: if ${N(x.visibilityCondMap?.statement?.lhs)} ${x.visibilityCondMap?.statement?.operator || "…"}`);
    for (const x of vals(fm.eventMap)) bits.push(`event ${x.kind} ${x.name}`);
    return bits;
  };
  const formLines = (fm) => {
    const lines = [];
    const byComp = new Map();
    for (const e of fieldsOf.get(fm.metaId) || []) {
      const s = fieldStr(e);
      if (!s) continue;
      const k = `${e.comp.details?.name}${e.comp.type === "grid" ? " (grid)" : ""}`;
      byComp.set(k, [...(byComp.get(k) || []), s]);
    }
    for (const [k, fs] of byComp) lines.push(`  - ${k}: ${fs.join(", ")}`);
    const lg = formLogic(fm);
    if (lg.length) lines.push(`  - logic (${lg.length}): ${lg.slice(0, 6).join("; ")}${lg.length > 6 ? "; …" : ""}`);
    return lines;
  };
  // argBinder -> readable
  const arg = (b) => {
    if (b == null) return "?";
    if (typeof b !== "object") return String(b);
    const v = b.value || {};
    switch (b.kind) {
      case "parameter": return `${(v.paramId || "").startsWith("$") ? v.paramId.slice(1) : "param"}.${v.fieldId === "$RowId" ? "RowId" : N(v.fieldId)}`;
      case "field": return N(v.fieldId);
      case "constant": return JSON.stringify(v.value?.value ?? v.value ?? v);
      case "derived": {
        if (v.valueOptionId) { const f = fieldById.get(v.derivedFieldId); const sv = f && ent.varMap.map[f.sourceVarId]; return `"${sv?.value?.map?.[v.valueOptionId]?.value || v.valueOptionId}"`; }
        const x = v.valueBoolean ?? v.valueText ?? v.valueNumber ?? v.valueDecimal;
        return x === undefined ? "…" : JSON.stringify(x);
      }
      case "variable": return `var:${N(v.varId)}`;
      case "context": return `ctx:${v.attribute}`;
      default: return b.kind || "?";
    }
  };
  const cond = (c) => {
    if (!c) return "";
    if (c.statement) return `${arg(c.statement.lhs)} ${c.statement.operator}${c.statement.rhs ? " " + arg(c.statement.rhs) : ""}`;
    const m = c.keys ? vals(c) : vals(c.map);
    return m.length ? "(" + m.map(cond).join(c.andOr === false || c.andOr === "or" ? " or " : " and ") + ")" : "";
  };
  const defaultName = (n) => !n.name || /^Neo/.test(n.name) || n.name.toLowerCase() === n.kind.toLowerCase();
  const nodeLabel = (n) => {
    const t = [...new Set(idsIn(n, "mss").concat(idsIn(n, "mrp")).map(N).filter((x) => x !== "?"))];
    let s = n.kind + (t.length ? `(${t.join(",")})` : "");
    if (!defaultName(n)) s += ` "${n.name}"`;
    const extra = [];
    if (n.condition) extra.push(`if ${cond(n.condition)}`);
    if (n.kind === "branchSwitchCase" && n.field) extra.push(`on ${arg({ kind: "parameter", value: n.field })}`);
    const msg = n.subject?.value || n.customTitle?.value || n.message?.value || (n.templateVarMap ? n.templateVarMap.keys?.join(" ") : null);
    if (msg) extra.push(`msg "${short(msg, 60)}"`);
    if (n.toUsers?.users) extra.push(`to ${arg(n.toUsers.users)}`);
    if (n.scheduler?.repeatSetting) { const r = n.scheduler.repeatSetting; extra.push(`every ${r.frequency || 1} ${r.repeatFrequencyKind}${r.setOfTime ? " @" + r.setOfTime.join(",") : ""}`); }
    if (n.deeplinkId) extra.push(`deeplink ${N(n.deeplinkId)}`);
    if (n.pluginId) extra.push(`plugin ${N(n.pluginId)}`);
    return extra.length ? `${s} [${extra.join("; ")}]` : s;
  };
  const wfBlock = (d, w, mmd) => {
    const nodes = d.nodeMap || {}, edges = Object.values(d.edgeMap || {});
    const outs = new Map();
    for (const e of edges) outs.set(e.fromNodeId, [...(outs.get(e.fromNodeId) || []), e]);
    const hasIn = new Set(edges.map((e) => e.toNodeId));
    const starts = Object.keys(nodes).filter((id) => !hasIn.has(id));
    w(`### Workflow: ${d.label || d.name} (${Object.keys(nodes).length} nodes)`);
    const seenN = new Set();
    const walk = (id, depth, via) => {
      const n = nodes[id];
      if (!n) return;
      const pre = `${"  ".repeat(depth)}- ${via && via !== "NEXT" ? `[${via}] ` : ""}`;
      if (seenN.has(id)) { w(`${pre}↺ ${n.kind}`); return; }
      seenN.add(id);
      w(`${pre}${nodeLabel(n)}`);
      for (const e of outs.get(id) || []) walk(e.toNodeId, depth + 1, e.kind);
    };
    for (const s of starts) walk(s, 0);
    mmd.push(`%% ${d.label || d.name}`, `flowchart TD`);
    for (const [id, n] of Object.entries(nodes)) mmd.push(`  ${mid(id)}["${q(short(nodeLabel(n), 80))}"]`);
    for (const e of edges) mmd.push(`  ${mid(e.fromNodeId)} -->${e.kind && e.kind !== "NEXT" ? `|${e.kind}|` : ""} ${mid(e.toNodeId)}`);
    mmd.push("");
  };
  const c = (n, m) => `${vals(m).length} ${n}`;
  const head = (w) => {
    w(`about: ${ent.details.about || "—"} · version ${ent.version}`);
  };

  // ---------- per-area files ----------
  const areaFile = new Map();
  const areaList = [...areas.values()].filter((a) => a.sheets.size || a.actions.length || a.reports.size || a.wfs.length);
  for (const a of areaList) areaFile.set(a.key, `${slugify(a.name)}.md`);
  const areaSizes = [];
  for (const a of areaList) {
    const out = [];
    const w = (s = "") => out.push(s);
    const mmd = [];
    w(`# Build area: ${a.name}`);
    w(`Build: ${ent.details.name} · area source: ${a.key === UN ? "none" : modules.some((m) => m.metaId === a.key) ? "Module" : "Group"}`);
    if (a.key === UN) w(`ORPHAN: no menu action, workflow or ref reaches these. Maybe dead or test. Low weight for Pattern tagging.`);
    w(`field notation: Name:type, →RefSheet (other area named), {pickText options}, @roles, ⇐copied-from-ref, * required. Dividers/labels dropped.`);
    w();
    if (a.actions.length) {
      w(`## Actions (→ target @roles)`);
      for (const { a: x, roles: r } of a.actions) w(`- ${x.details.name} [${x.kind} → ${N(x.spreadsheetId || x.reportId || x.inputFormId)}]${r?.length ? ` @${Ns(r)}` : ""}`);
      w();
    }
    if (a.sheets.size) {
      w(`## Sheets`);
      for (const sid of a.sheets) {
        const s = sheetById[sid];
        const r = (k) => (s[k]?.length ? `${k.replace("RoleSet", "")}@${Ns(s[k])}` : null);
        const perms = ["insertRoleSet", "updateRoleSet", "readRoleSet", "removeRoleSet"].map(r).filter(Boolean).join(" ");
        const hw = how.get(sid); w(`### ${s.details.name}${s.isMasterSheet ? " (master)" : ""}${hw && hw !== "direct" ? ` (placed by ${hw})` : ""}${perms ? ` — ${perms}` : ""}`);
        let lines = formLines(ent.formMap.map[s.formId]);
        // annotate refs into other areas
        lines = lines.map((l) => l.replace(/→([A-Za-z0-9_]+)/g, (m0, nm) => {
          const tgt = sheets.find((x) => x.details.name === nm);
          const ta = tgt && sheetArea.get(tgt.metaId);
          return ta && ta !== a.key ? `→${nm}(${areas.get(ta)?.name})` : m0;
        }));
        lines.forEach((l) => w(l));
      }
      w();
    }
    if (a.reports.size) {
      w(`## Reports`);
      for (const rid of a.reports) {
        const r = ent.reportMap.map[rid];
        const from = r.fromSpreadsheetIdSet || (r.fromSpreadsheetId ? [r.fromSpreadsheetId] : []);
        const merge = r.mergeReportIdSet ? ` merge[${Ns(r.mergeReportIdSet)}]` : "";
        w(`- ${r.details.name} [${r.kind}] from ${Ns(from) || "—"}${merge} in:${N(r.inputFormId)} out:${N(r.outputFormId)}`);
      }
      w();
    }
    if (a.forms.size) {
      w(`## Other forms (report/action input/output)`);
      for (const fid of a.forms) {
        const fs = (fieldsOf.get(fid) || []).map(fieldStr).filter(Boolean);
        w(`- ${N(fid)}: ${fs.slice(0, 10).join(", ")}${fs.length > 10 ? `, …(+${fs.length - 10})` : ""}`);
      }
      w();
    }
    if (a.wfs.length) {
      w(`## Workflows`);
      for (const d of a.wfs) wfBlock(d, w, mmd);
      w();
    }
    // area flowchart: area sheets + ref targets outside
    const am = [`%% Build area ${a.name}: sheet refs`, `flowchart LR`];
    const ext = new Set();
    const edgesA = new Set();
    for (const sid of a.sheets) {
      am.push(`  ${"S" + mid(sid)}["${q(N(sid))}"]`);
      for (const e of fieldsOf.get(sheetById[sid].formId) || []) {
        const t = e.f.spreadsheetId;
        if ((e.f.type === "ref" || e.f.type === "refSet") && t && sheetById[t]) {
          if (!a.sheets.has(t)) ext.add(t);
          edgesA.add(`  S${mid(sid)} --> S${mid(t)}`);
        }
      }
    }
    for (const t of ext) am.push(`  S${mid(t)}(["${q(N(t))} · ${q(areas.get(sheetArea.get(t))?.name || "?")}"])`);
    am.push(...edgesA);
    const body = out.join("\n");
    fs.writeFileSync(path.join(outDir, areaFile.get(a.key)), body);
    fs.writeFileSync(path.join(outDir, areaFile.get(a.key).replace(/\.md$/, ".refs.mmd")), am.join("\n") + "\n");
    if (mmd.length) fs.writeFileSync(path.join(outDir, areaFile.get(a.key).replace(/\.md$/, ".wf.mmd")), mmd.join("\n"));
    areaSizes.push(body.length);
    a.size = body.length;
  }

  // ---------- overview ----------
  const out = [];
  const w = (s = "") => out.push(s);
  w(`# Build digest: ${ent.details.name}`);
  head(w);
  w(`counts: ${[c("forms", ent.formMap), c("sheets", ent.spreadsheetMap), c("roles", ent.roleMap), c("actions", ent.actionMap), c("reports", ent.reportMap), c("groups", ent.groupMap), c("vars", ent.varMap), c("workflows", ent.autoDiaMap), c("modules", ent.moduleMap)].join(" · ")}`);
  w(`Build area source: Module tag, else Group actions, else workflow/ref neighbours`);
  w();
  w(`## Roles`);
  w(roles.map((r) => r.details.name).join(", "));
  w();
  w(`## Build areas`);
  for (const a of areaList) w(`- [${a.name}](${areaFile.get(a.key)}): ${a.sheets.size} sheets, ${a.actions.length} actions, ${a.reports.size} reports, ${a.wfs.length} workflows · ${(a.size / 1024).toFixed(1)} KB`);
  const emptyGroups = useModules ? [] : groups.filter((g) => !vals(g.actionPermissionMap).length).map((g) => g.details.name);
  if (emptyGroups.length) w(`- chat-only Groups (no actions): ${emptyGroups.join(", ")}`);
  w();
  w(`## Cross-area refs`);
  const cross = new Map();
  for (const s of sheets) for (const e of fieldsOf.get(s.formId) || []) {
    const t = e.f.spreadsheetId;
    if ((e.f.type === "ref" || e.f.type === "refSet") && t && sheetById[t]) {
      const fa = sheetArea.get(s.metaId), ta = sheetArea.get(t);
      if (fa !== ta) { const k = `${areas.get(fa).name} → ${areas.get(ta).name}`; cross.set(k, (cross.get(k) || 0) + 1); }
    }
  }
  for (const [k, n] of cross) w(`- ${k} (${n})`);
  w();
  w(`## Option lists (setOfText vars)`);
  for (const v of vars.filter((v) => v.kind === "setOfText")) {
    const opts = vals(v.value).map((o) => o.value).filter(Boolean);
    w(`- ${v.details.name}: ${opts.slice(0, 12).join(" | ")}${opts.length > 12 ? " | …" : ""}`);
  }
  const ov = out.join("\n");
  fs.writeFileSync(path.join(outDir, "overview.md"), ov);

  // build flowchart: areas as nodes, cross-area refs as weighted edges
  const bm = [`%% Build: areas, cross-area refs`, `flowchart LR`];
  for (const a of areaList) bm.push(`  A${mid(a.key)}["${q(a.name)}<br/>${a.sheets.size} sheets · ${a.wfs.length} wf"]`);
  for (const [k, n] of cross) { const [f, t] = k.split(" → "); const fa = areaList.find((x) => x.name === f), ta = areaList.find((x) => x.name === t); if (fa && ta) bm.push(`  A${mid(fa.key)} -->|${n}| A${mid(ta.key)}`); }
  fs.writeFileSync(path.join(outDir, "build.mmd"), bm.join("\n") + "\n");

  const max = Math.max(...areaSizes);
  const line = `${NN} ${ent.details.name}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB json → overview ${(ov.length / 1024).toFixed(1)} KB + ${areaList.length} areas (max ${(max / 1024).toFixed(1)} KB, total ${(areaSizes.reduce((a, b) => a + b, 0) / 1024).toFixed(0)} KB) · modules ${modules.length} · unassigned sheets ${areas.get(UN)?.sheets.size || 0}/${sheets.length}`;
  console.log(line);
  summary.push(line);
}
