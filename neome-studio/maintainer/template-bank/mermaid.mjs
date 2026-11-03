// Mermaid flowcharts for a Build digest, no model: build.mmd (areas + cross-area ref counts),
// <area>.refs.mmd (sheet refs, outside targets as stadium nodes), <area>.wf.mmd (one flowchart per workflow).
import { isRef } from "./build-json.mjs";
import { crossRefs, nodeLabel, short } from "./render.mjs";

/** Mermaid-safe node id. */
export const mid = (id) => String(id).replace(/[^A-Za-z0-9]/g, "");
/** Mermaid-safe label text: no double quotes, no brackets. */
export const q = (s) => String(s).replace(/"/g, "'").replace(/[\[\]{}()<>]/g, " ");

export function buildMmd(ix, ar) {
  const lines = [`%% Build: areas, cross-area refs`, `flowchart LR`];
  for (const a of ar.list) lines.push(`  A${mid(a.key)}["${q(a.name)}<br/>${a.sheets.size} sheets · ${a.wfs.length} wf"]`);
  const shown = new Set(ar.list.map((a) => a.key));
  for (const [k, n] of crossRefs(ix, ar)) {
    const [f, t] = k.split("\u0000");
    if (shown.has(f) && shown.has(t)) lines.push(`  A${mid(f)} -->|${n}| A${mid(t)}`);
  }
  return lines.join("\n") + "\n";
}

export function refsMmd(a, ix, ar) {
  const lines = [`%% Build area ${a.name}: sheet refs`, `flowchart LR`];
  const ext = new Set(), edges = new Set();
  for (const sid of a.sheets) {
    lines.push(`  S${mid(sid)}["${q(ix.N(sid))}"]`);
    for (const e of ix.fieldsOf.get(ix.sheetById[sid].formId) || []) {
      const t = e.f.spreadsheetId;
      if (isRef(e.f) && t && ix.sheetById[t]) {
        if (!a.sheets.has(t)) ext.add(t);
        edges.add(`  S${mid(sid)} --> S${mid(t)}`);
      }
    }
  }
  for (const t of ext) lines.push(`  S${mid(t)}(["${q(ix.N(t))} · ${q(ar.areas.get(ar.sheetArea.get(t))?.name || "?")}"])`);
  lines.push(...edges);
  return lines.join("\n") + "\n";
}

/** null when the area has no workflow. */
export function wfMmd(a, ix) {
  if (!a.wfs.length) return null;
  const lines = [];
  for (const d of a.wfs) {
    lines.push(`%% ${d.label || d.name}`, `flowchart TD`);
    for (const [id, n] of Object.entries(d.nodeMap || {})) lines.push(`  ${mid(id)}["${q(short(nodeLabel(n, ix), 80))}"]`);
    for (const e of Object.values(d.edgeMap || {})) lines.push(`  ${mid(e.fromNodeId)} -->${e.kind && e.kind !== "NEXT" ? `|${e.kind}|` : ""} ${mid(e.toNodeId)}`);
    lines.push("");
  }
  return lines.join("\n");
}
