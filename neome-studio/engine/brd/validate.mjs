// BRD data file validation.
// Layer 1: JSON Schema (shape, types, enums, provenance). Layer 2: cross-references.
// Completeness: errors for resolved Modules, warnings for in-progress ones.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { citedSources } from "./read-engagement.mjs";
import { uncoveredTopics } from "./signoff.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const pluginDir = join(here, "..", "..");
export const SCHEMA = JSON.parse(readFileSync(join(pluginDir, "skills", "build-brd", "references", "brd-data.schema.json"), "utf8"));
export const SCHEMA_VERSION = SCHEMA.properties.schemaVersion.const;
const CATALOG = new Set(
  JSON.parse(readFileSync(join(pluginDir, "reference", "neome-app-catalog-slugs.json"), "utf8")).apps.map((a) => a.slug),
);
const CATALOG_NAMES = new Set(
  JSON.parse(readFileSync(join(pluginDir, "reference", "neome-app-catalog-slugs.json"), "utf8")).apps.map((a) => a.name.toLowerCase()),
);
const validateShape = new Ajv2020({ allErrors: true, strict: true, strictTypes: false }).compile(SCHEMA);

// Layer 1. Returns [{ cls, msg }].
export function schemaErrors(data) {
  if (validateShape(data)) return [];
  const out = [];
  const all = validateShape.errors;
  for (const e of all) {
    if (["if", "oneOf", "anyOf"].includes(e.keyword)) continue;
    // A failed subschema also flags its parent as having unevaluated properties: noise.
    if (e.keyword === "unevaluatedProperties" && all.some((o) => o !== e && o.instancePath.startsWith(e.instancePath) && o.keyword !== "unevaluatedProperties")) continue;
    if (e.keyword === "unevaluatedProperties") {
      out.push({ cls: "schema", msg: `${readablePath(data, e.instancePath)}: unknown property "${e.params.unevaluatedProperty}"` });
      continue;
    }
    const where = readablePath(data, e.instancePath);
    if (e.keyword === "minItems" && /^\/general\/na\/\d+\/sources$/.test(e.instancePath)) {
      out.push({ cls: "uncited", msg: `${where.replace(/\.sources$/, "")}: N/A needs at least 1 Source (cite the Source that says it does not apply)` });
    } else if (e.keyword === "minItems" && e.instancePath.endsWith("/sources")) {
      out.push({ cls: "uncited", msg: `${where.replace(/\.sources$/, "")}: not proposed, so it needs at least 1 Source (cite one or mark it "(proposed, to confirm)")` });
    } else if (e.keyword === "enum") {
      out.push({ cls: "schema", msg: `${where}: "${valueAt(data, e.instancePath)}" is not one of ${e.params.allowedValues.join(", ")}` });
    } else if (e.keyword === "const" && e.instancePath.endsWith("/delivery")) {
      out.push({ cls: "schema", msg: `${where}: no Neome App means Delivery must be custom` });
    } else if (e.keyword === "pattern") {
      out.push({ cls: "schema", msg: `${where}: "${valueAt(data, e.instancePath)}" has the wrong format` });
    } else {
      out.push({ cls: "schema", msg: `${where}: ${e.message}` });
    }
  }
  return dedupe(out);
}

// Layer 2. Returns [{ cls, msg }].
export function crossRefErrors(data, register) {
  const errors = [];
  const err = (cls, msg) => errors.push({ cls, msg });
  const sourceIds = new Set(register.map((s) => s.id));
  const seenSource = new Set();
  for (const s of register) {
    if (seenSource.has(s.id)) err("duplicate-source", `Source ${s.id} is registered twice in sources.md`);
    seenSource.add(s.id);
  }
  const ois = new Map(data.openItems.map((o) => [o.id, o]));
  const seenOi = new Set();
  for (const o of data.openItems) {
    if (seenOi.has(o.id)) err("duplicate-oi", `Open Item ${o.id} is in open-items.md twice`);
    seenOi.add(o.id);
  }
  const prefixes = new Set();
  for (const m of data.modules) {
    if (m.prefix === "GEN") err("reserved-prefix", `Module ${m.name}: prefix GEN is reserved for Engagement-wide Requirements`);
    if (prefixes.has(m.prefix)) err("duplicate-module", `Module prefix ${m.prefix} is used by two Modules`);
    prefixes.add(m.prefix);
  }

  // Every cited Source exists.
  for (const id of citedSources(data)) {
    if (!sourceIds.has(id)) err("missing-source", `Source ${id} is cited but not in the Source register (${whereCited(data, id)})`);
  }
  // Every referenced Open Item exists.
  const needOi = (id, where) => {
    if (!ois.has(id)) err("missing-oi", `${where} refers to ${id}, which is not in open-items.md`);
  };
  for (const m of data.modules) {
    for (const id of m.oiRefs) needOi(id, `Module ${m.prefix} Open Items`);
    for (const r of m.requirements) for (const id of r.ois) needOi(id, r.id);
    for (const s of m.statuses) if (s.oi) needOi(s.oi, `Module ${m.prefix} status ${s.id}`);
  }
  const general = data.general ?? { requirements: [], na: [], oiRefs: [] };
  for (const r of general.requirements) for (const id of r.ois) needOi(id, r.id);
  for (const { id, topic } of general.oiRefs) {
    const where = `Across all Modules (${topic})`;
    needOi(id, where);
    const o = ois.get(id);
    if (o && !o.modules.includes("All")) err("oi-module", `${where} lists ${id}, but its Module(s) are ${o.modules.join(", ")}, not All`);
  }
  for (const l of data.process.lanes) if (l.oi) needOi(l.oi, `process lane ${l.id}`);
  for (const s of data.process.steps) if (s.oi) needOi(s.oi, `process step ${s.id}`);

  // Requirement IDs: unique across the Engagement and carry their Module prefix.
  const reqIds = new Set();
  for (const m of data.modules) {
    const allowed = [m.prefix, m.formerly].filter(Boolean);
    for (const r of m.requirements) {
      if (reqIds.has(r.id)) err("requirement-id", `Requirement ID ${r.id} is used twice (IDs are never reused)`);
      reqIds.add(r.id);
      const p = r.id.split("-")[0];
      if (!allowed.includes(p)) err("requirement-id", `Requirement ${r.id} is in Module ${m.prefix} but has prefix ${p}`);
    }
  }

  for (const r of general.requirements) {
    if (reqIds.has(r.id)) err("requirement-id", `Requirement ID ${r.id} is used twice (IDs are never reused)`);
    reqIds.add(r.id);
  }

  // Implementation plan: Module prefixes (incl. GEN) and OIs exist; weekFrom <= weekTo.
  if (data.plan) {
    const known = (p) => p === "GEN" || prefixes.has(p);
    const phaseIds = new Set();
    for (const ph of data.plan.phases) {
      const where = `plan phase ${ph.id}`;
      if (phaseIds.has(ph.id)) err("duplicate-phase", `plan phase ID ${ph.id} is used twice`);
      phaseIds.add(ph.id);
      for (const p of ph.modules) if (!known(p)) err("unknown-module", `${where} names unknown Module "${p}"`);
      if (ph.weekFrom !== null && ph.weekTo !== null && ph.weekFrom > ph.weekTo) {
        err("plan-weeks", `${where}: week from (${ph.weekFrom}) is after week to (${ph.weekTo})`);
      }
    }
    for (const n of data.plan.notPlaced) {
      const where = `plan Not yet placed "${n.text}"`;
      for (const p of n.modules) if (!known(p)) err("unknown-module", `${where} names unknown Module "${p}"`);
      for (const id of n.ois) needOi(id, where);
    }
  }

  // Statuses and transitions.
  for (const m of data.modules) {
    const ids = new Set(m.statuses.map((s) => s.id));
    for (const t of m.transitions) {
      for (const end of ["from", "to"]) {
        if (!ids.has(t[end])) err("unknown-status", `Module ${m.prefix}: transition ${t.from} → ${t.to} uses unknown status "${t[end]}"`);
      }
    }
    const target = m.status.startsWith("merged-into:") ? m.status.slice("merged-into:".length) : null;
    if (target && !data.modules.some((x) => x.prefix === target)) {
      err("unknown-module", `Module ${m.prefix} is merged into ${target}, which does not exist`);
    }
  }

  // Process: steps → lanes and Modules; edges → steps.
  const lanes = new Set(data.process.lanes.map((l) => l.id));
  const steps = new Set(data.process.steps.map((s) => s.id));
  for (const s of data.process.steps) {
    if (!lanes.has(s.lane)) err("unknown-lane", `process step ${s.id} is in unknown lane "${s.lane}"`);
    if (s.module !== null && !prefixes.has(s.module)) err("unknown-module", `process step ${s.id} belongs to unknown Module "${s.module}"`);
  }
  for (const e of data.process.edges) {
    for (const end of ["from", "to"]) {
      if (!steps.has(e[end])) err("unknown-step", `process edge ${e.from} → ${e.to} uses unknown step "${e[end]}"`);
    }
  }

  // Open Items name existing Modules (or All); answer Source checked above.
  for (const o of data.openItems) {
    for (const p of o.modules) {
      if (p !== "All" && !prefixes.has(p)) err("unknown-module", `${o.id} names unknown Module "${p}"`);
    }
  }

  // Neome mapping slug in the catalog.
  for (const m of data.modules) {
    if (m.mapping?.neomeApp && !CATALOG.has(m.mapping.neomeApp)) {
      err("unknown-app", `Module ${m.prefix}: Neome App "${m.mapping.neomeApp}" is not a catalog slug`);
    }
  }

  // Disputed glossary terms need an open Open Item.
  for (const t of data.glossary) {
    if (t.disputed === undefined) continue;
    const o = ois.get(t.disputed);
    if (!o) err("disputed-term", `glossary term "${t.term}" is disputed by ${t.disputed}, which is not in open-items.md`);
    else if (o.status !== "open") err("disputed-term", `glossary term "${t.term}" is disputed but ${t.disputed} is closed; resolve the term`);
  }
  return errors;
}

// Completeness. Returns { errors, warnings } as [{ cls, msg }].
// At release, gaps in Engagement-wide (GEN) Requirements are errors.
export function completeness(data, meta, { release = false } = {}) {
  const errors = [];
  const warnings = [];
  for (const m of data.modules) {
    if (m.status.startsWith("merged-into:")) continue;
    const resolved = m.status === "resolved";
    const out = resolved ? errors : warnings;
    const gap = (msg) => out.push({ cls: "completeness", msg: `Module ${m.prefix} (${resolved ? "resolved" : "in progress"}): ${msg}` });
    const info = meta.get(m);
    if (info && !info.hasSpec) gap("spec.md missing");
    else if (info) {
      for (const s of info.missingSections) gap(`spec section "${title(s)}" missing`);
      for (const s of info.emptySections) gap(`spec section "${title(s)}" is empty (fill it, write N/A: <reason>, or list its Open Items)`);
    }
    const sectionMissing = (s) => info?.hasSpec && info.missingSections.concat(info.emptySections).includes(s);
    if (!m.purpose && !sectionMissing("purpose and kpis")) gap("purpose missing");
    if (!m.mapping && !sectionMissing("neome mapping")) gap("Neome mapping missing");
    if (!m.requirements.some((r) => !r.withdrawn)) gap("no Requirements");
    for (const r of m.requirements) {
      if (!r.withdrawn && r.acceptance.length === 0) gap(`${r.id} has no acceptance criteria`);
    }
  }
  // Engagement-wide Requirements: warnings in preview, errors at release.
  for (const r of data.general?.requirements ?? []) {
    if (!r.withdrawn && r.acceptance.length === 0) {
      (release ? errors : warnings).push({ cls: "completeness", msg: `Across all Modules: ${r.id} has no acceptance criteria` });
    }
  }
  return { errors, warnings };
}

// Enterprise glossary holds the Enterprise's words only: no Neome App names, no term → Neome mapping
// (that lives in Module spec section 12). Returns [{ cls, msg }] warnings.
export function glossaryWarnings(data) {
  const out = [];
  for (const t of data.glossary) {
    if (CATALOG_NAMES.has(t.term.toLowerCase())) {
      out.push({ cls: "catalog-term", msg: `glossary term "${t.term}" is a Neome App name; keep only the Enterprise's own words` });
    } else if (/\bneome\b/i.test(t.definition)) {
      out.push({ cls: "catalog-term", msg: `glossary term "${t.term}" mentions Neome; a term → Neome mapping belongs in Module spec section 12` });
    }
  }
  return out;
}

// Release warnings: things to fix before sending, which do not block a release.
// Returns [{ cls, msg }].
export function releaseWarnings(data) {
  const out = [];
  for (const topic of uncoveredTopics(data)) {
    out.push({ cls: "uncovered-topic", msg: `Across all Modules: topic "${topic}" is not covered (add a Requirement, N/A with a Source, or an Open Item)` });
  }
  if (data.plan) {
    for (const ph of data.plan.phases) {
      if (ph.weekFrom === null && ph.weekTo === null) out.push({ cls: "plan", msg: `plan phase ${ph.id}: no weeks set (only the Consultant sets weeks)` });
      if (ph.proposed) out.push({ cls: "plan", msg: `plan phase ${ph.id}: still proposed (confirm it or change it)` });
    }
    const placed = new Set([...data.plan.phases, ...data.plan.notPlaced].flatMap((x) => x.modules));
    for (const m of data.modules) {
      if (m.status === "resolved" && !placed.has(m.prefix)) {
        out.push({ cls: "plan", msg: `Module ${m.prefix} is resolved but not in any plan phase or Not yet placed` });
      }
    }
  }
  return out;
}

const title = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace("kpis", "KPIs").replace("nfrs", "NFRs").replace("neome", "Neome");

// "/modules/0/requirements/1/priority" → "modules[QUO].requirements[QUO-02].priority"
function readablePath(data, path) {
  if (!path) return "(root)";
  let node = data;
  let out = "";
  for (const part of path.split("/").slice(1)) {
    if (Array.isArray(node)) {
      const item = node[Number(part)];
      const key = item && typeof item === "object" ? (item.id ?? item.prefix ?? item.term ?? item.entity ?? item.name ?? item.topic ?? part) : part;
      out += `[${key}]`;
    } else {
      out += (out ? "." : "") + part;
    }
    node = node?.[Array.isArray(node) ? Number(part) : part];
  }
  return out;
}

function valueAt(data, path) {
  return path.split("/").slice(1).reduce((n, p) => n?.[p], data);
}

function whereCited(data, id) {
  const where = [];
  for (const m of data.modules) {
    if (JSON.stringify(m).includes(`"${id}"`)) where.push(`Module ${m.prefix}`);
  }
  if (data.glossary.some((t) => t.sources.includes(id))) where.push("glossary");
  if (JSON.stringify(data.process).includes(`"${id}"`)) where.push("process");
  if (JSON.stringify(data.general ?? {}).includes(`"${id}"`)) where.push("general");
  if (JSON.stringify(data.plan ?? {}).includes(`"${id}"`)) where.push("plan");
  if (data.openItems.some((o) => o.answerSource === id || o.raisedIn === id)) where.push("open-items");
  return `cited in ${where.join(", ") || "the data"}`;
}

function dedupe(list) {
  const seen = new Set();
  return list.filter((e) => !seen.has(e.msg) && seen.add(e.msg));
}
