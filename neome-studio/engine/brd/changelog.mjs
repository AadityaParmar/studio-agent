// BRD change log: diff of the previous released snapshot (v<N-1>) against the new one (v<N>).
// Facts only; each change = { group, kind, id, text, fields? }. `text` is the line the BRD shows.
// IDs are stable and never reused (dead things stay in the data), so matching by ID is reliable.

// "Changed" Requirement = any change to these fields (ticket 12).
export const REQUIREMENT_FIELDS = ["statement", "acceptance", "priority", "scope", "delivery", "withdrawn"];

export function changeLog(prev, cur) {
  if (!prev) return [];
  return [
    ...moduleChanges(prev, cur),
    ...requirementChanges(prev, cur),
    ...openItemChanges(prev, cur),
    ...planChanges(prev.plan, cur.plan),
    ...glossaryChanges(prev.glossary, cur.glossary),
  ];
}

// ---- Modules: added, resolved, merged, renamed, needs-revisit ----

function moduleChanges(prev, cur) {
  const out = [];
  const before = new Map(prev.modules.map((m) => [m.prefix, m]));
  const add = (kind, id, text) => out.push({ group: "modules", kind, id, text: `${id}: ${text}` });
  for (const m of cur.modules) {
    let old = before.get(m.prefix);
    if (!old && m.formerly && before.has(m.formerly)) {
      old = before.get(m.formerly);
      add("renamed", m.prefix, `renamed from ${m.formerly}`);
    }
    if (!old) add("added", m.prefix, `added (${m.name})`);
    const was = old?.status;
    if (m.status === was) continue;
    if (m.status === "resolved") add("resolved", m.prefix, "resolved");
    else if (m.status === "needs-revisit") add("needs-revisit", m.prefix, "set to needs-revisit");
    else if (m.status.startsWith("merged-into:") && !was?.startsWith("merged-into:")) {
      add("merged", m.prefix, `merged into ${m.status.slice("merged-into:".length)}`);
    }
  }
  return out;
}

// ---- Requirements: added, changed (fields listed), withdrawn ----

function requirementChanges(prev, cur) {
  const out = [];
  const before = new Map(allRequirements(prev).map((r) => [r.id, r]));
  const now = allRequirements(cur);
  const ids = new Set(now.map((r) => r.id));
  for (const r of now) {
    const old = before.get(r.id);
    if (!old) {
      out.push({ group: "requirements", kind: "added", id: r.id, text: `${r.id}: added — ${r.title}` });
      continue;
    }
    const fields = REQUIREMENT_FIELDS.filter((f) => !same(old[f] ?? null, r[f] ?? null));
    if (!fields.length) continue;
    const withdrawn = !old.withdrawn && r.withdrawn;
    const details = fields.filter((f) => !(withdrawn && f === "withdrawn")).map((f) => detail(f, old, r));
    const text = withdrawn
      ? `${r.id}: withdrawn — ${r.withdrawn}${details.length ? `; ${details.join("; ")}` : ""}`
      : `${r.id}: ${details.join("; ")}`;
    out.push({ group: "requirements", kind: withdrawn ? "withdrawn" : "changed", id: r.id, text, fields });
  }
  // IDs are never dropped from the data; if one is, the BRD still shows it went.
  for (const [id] of before) {
    if (!ids.has(id)) out.push({ group: "requirements", kind: "withdrawn", id, text: `${id}: withdrawn (no longer in the BRD)` });
  }
  return out;
}

// Module Requirements carry the Module's Delivery unless they override it; GEN ones have no Module.
function allRequirements(data) {
  const out = [];
  for (const m of data.modules) {
    for (const r of m.requirements) out.push({ ...r, delivery: r.delivery ?? m.mapping?.delivery ?? null });
  }
  for (const r of data.general?.requirements ?? []) out.push({ ...r, delivery: r.delivery ?? null });
  return out;
}

function detail(field, old, r) {
  const show = (v) => (v === null || v === undefined || v === "" ? "—" : v);
  if (field === "priority" || field === "scope" || field === "delivery") return `${field} ${show(old[field])}→${show(r[field])}`;
  if (field === "withdrawn") return "reinstated";
  return `${field} changed`;
}

// ---- Open Items: raised, closed (with answer Source) ----

function openItemChanges(prev, cur) {
  const out = [];
  const before = new Map(prev.openItems.map((o) => [o.id, o]));
  for (const o of cur.openItems) {
    const old = before.get(o.id);
    if (!old) out.push({ group: "openItems", kind: "raised", id: o.id, text: `${o.id}: raised — ${o.question}` });
    if (o.status === "closed" && old?.status !== "closed") {
      const answer = o.answer ? ` — ${o.answer}` : "";
      const src = o.answerSource ? ` [${o.answerSource}]` : "";
      out.push({ group: "openItems", kind: "closed", id: o.id, text: `${o.id}: closed${answer}${src}` });
    }
  }
  return out;
}

// ---- Implementation plan: phases and Not yet placed items added / changed / removed ----

const PHASE_FIELDS = [
  ["name", "name"],
  ["weekFrom", "week from"],
  ["weekTo", "week to"],
  ["covers", "covers"],
  ["modules", "Modules"],
  ["proposed", "proposed"],
];
const PLACED_FIELDS = [
  ["ois", "Open Items"],
  ["modules", "Modules"],
  ["proposed", "proposed"],
];

function planChanges(prev, cur) {
  const out = [];
  const add = (kind, id, text, fields) => out.push({ group: "plan", kind, id, text, ...(fields ? { fields } : {}) });
  if (!prev && !cur) return out;
  if (!prev) add("added", "plan", "Implementation plan: added");
  if (!cur) {
    add("removed", "plan", "Implementation plan: removed");
    return out;
  }
  const keyed = (list, key, label, fields) => {
    const before = new Map((list.before ?? []).map((x) => [x[key], x]));
    if (!prev) return;
    const ids = new Set();
    for (const x of list.now) {
      ids.add(x[key]);
      const old = before.get(x[key]);
      if (!old) {
        add("added", x[key], `${label(x)}: added`);
        continue;
      }
      const changed = fields.filter(([f]) => !same(old[f], x[f]));
      if (changed.length) {
        add("changed", x[key], `${label(x)}: ${changed.map(([f, name]) => (f === "proposed" ? (x.proposed ? "back to proposed" : "confirmed") : valueChange(name, old[f], x[f]))).join("; ")}`, changed.map(([f]) => f));
      }
    }
    for (const [k, old] of before) if (!ids.has(k)) add("removed", k, `${label(old)}: removed`);
  };
  keyed({ before: prev?.phases, now: cur.phases }, "id", (p) => `Plan phase ${p.id} (${p.name})`, PHASE_FIELDS);
  keyed({ before: prev?.notPlaced, now: cur.notPlaced }, "text", (n) => `Not yet placed "${n.text}"`, PLACED_FIELDS);
  return out;
}

// ---- Glossary: terms added / changed / removed ----

const TERM_FIELDS = [
  ["definition", "definition"],
  ["avoid", "avoid"],
  ["proposed", "proposed"],
  ["disputed", "disputed"],
];

function glossaryChanges(prev, cur) {
  const out = [];
  const before = new Map(prev.map((t) => [t.term, t]));
  const terms = new Set();
  for (const t of cur) {
    terms.add(t.term);
    const old = before.get(t.term);
    if (!old) {
      out.push({ group: "glossary", kind: "added", id: t.term, text: `Glossary "${t.term}": added` });
      continue;
    }
    const changed = TERM_FIELDS.filter(([f]) => !same(old[f] ?? null, t[f] ?? null));
    if (!changed.length) continue;
    const parts = changed.map(([f, name]) => {
      if (f === "proposed") return t.proposed ? "back to proposed" : "agreed";
      if (f === "disputed") return t.disputed ? `disputed (${t.disputed})` : "no longer disputed";
      if (f === "avoid") return valueChange(name, old.avoid, t.avoid);
      return `${name} changed`;
    });
    out.push({ group: "glossary", kind: "changed", id: t.term, text: `Glossary "${t.term}": ${parts.join("; ")}`, fields: changed.map(([f]) => f) });
  }
  for (const [term] of before) {
    if (!terms.has(term)) out.push({ group: "glossary", kind: "removed", id: term, text: `Glossary "${term}": removed` });
  }
  return out;
}

// ---- helpers ----

function valueChange(name, from, to) {
  if (typeof from === "string" && typeof to === "string" && (from.length > 40 || to.length > 40)) return `${name} changed`;
  return `${name} ${show(from)}→${show(to)}`;
}

function show(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
