// BRD Sign-off (ticket 12): preconditions, the sign-off block, and what a signed version means
// for later builds. A signed snapshot keeps `proposed: true` as history; its `signOff.acceptedProposed`
// lists the refs of those items. Every later build clears `proposed` on the same items (if unchanged).
import { GENERAL_TOPICS } from "./read-engagement.mjs";

// Topics of "Across all Modules" with no live Requirement, no N/A and no listed Open Item.
export function uncoveredTopics(data) {
  const general = data.general ?? { requirements: [], na: [], oiRefs: [] };
  return GENERAL_TOPICS.filter(
    (topic) =>
      !general.requirements.some((r) => r.topic === topic && !r.withdrawn) &&
      !general.na.some((n) => n.topic === topic) &&
      !general.oiRefs.some((o) => o.topic === topic),
  );
}

// Hard preconditions for Sign-off, checked on the released snapshot. Returns [{ cls, msg }].
export function signOffBlockers(data) {
  const out = [];
  const block = (msg) => out.push({ cls: "sign-off", msg });
  for (const m of data.modules) {
    if (m.status !== "resolved" && !m.status.startsWith("merged-into:")) {
      block(`Module ${m.prefix} is ${m.status}; every Module must be resolved or merged`);
    }
  }
  for (const topic of uncoveredTopics(data)) {
    block(`Across all Modules: topic "${topic}" is not covered (add a Requirement, N/A with a Source, or an Open Item)`);
  }
  const live = [...data.modules.filter((m) => !m.status.startsWith("merged-into:")).flatMap((m) => m.requirements), ...(data.general?.requirements ?? [])].filter(
    (r) => !r.withdrawn,
  );
  for (const r of live) {
    if (r.priority === "TBC") block(`${r.id}: priority is TBC (set Must, Should, Could or Won't)`);
    else if (r.priority === "Must" && r.scope === "open") block(`${r.id}: Must Requirement with scope Open (settle the scope)`);
  }
  return out;
}

// Every live fact object still marked proposed, as { ref, obj }. A proposed object is listed whole
// (its parts are not walked). Withdrawn Requirements, merged Modules and disputed terms are not accepted.
// ref = path by stable key, e.g. `modules[QUO].requirements[QUO-01]`, `glossary[Quote]`, `plan.phases[uat]`.
export function proposedItems(data) {
  const out = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${path}[${keyOf(item, i)}]`));
      return;
    }
    if (!node || typeof node !== "object") return;
    if (node.withdrawn || node.status?.startsWith?.("merged-into:") || node.disputed) return;
    if (node.proposed === true) {
      out.push({ ref: path, obj: node });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (v && typeof v === "object") walk(v, path ? `${path}.${k}` : k);
    }
  };
  for (const key of ["glossary", "process", "modules", "general", "plan"]) if (data[key]) walk(data[key], key);
  return out;
}

function keyOf(item, i) {
  if (!item || typeof item !== "object") return i;
  const key = item.id ?? item.prefix ?? item.term ?? item.entity ?? item.name ?? item.role ?? item.system ?? item.rule;
  if (typeof key === "string" && key) return key;
  if (item.from !== undefined && item.to !== undefined) return `${item.from}→${item.to}`;
  return i;
}

// The sign-off block stored in the snapshot.
export function signOffBlock(data, { enterpriseSigner, neomentaSigner, evidence }) {
  return {
    enterpriseSigner,
    neomentaSigner,
    evidence,
    openAtSignOff: data.openItems.filter((o) => o.status === "open").map((o) => o.id),
    acceptedProposed: proposedItems(data).map((x) => x.ref),
  };
}

// After Sign-off: clear `proposed` on every item the signed snapshot accepted, if it is unchanged
// since (same content apart from sources and proposed). It gains the evidence Source, so it stays cited.
// Changed items stay proposed: they are new proposals. Mutates data; returns the refs cleared.
export function applySignedOff(data, signed) {
  const accepted = new Set(signed.signOff?.acceptedProposed ?? []);
  const was = new Map(proposedItems(signed).filter((x) => accepted.has(x.ref)).map((x) => [x.ref, x.obj]));
  const cleared = [];
  for (const { ref, obj } of proposedItems(data)) {
    const old = was.get(ref);
    if (!old || !sameContent(old, obj) || !Array.isArray(obj.sources)) continue;
    obj.proposed = false;
    if (!obj.sources.includes(signed.signOff.evidence)) obj.sources = [...obj.sources, signed.signOff.evidence];
    cleared.push(ref);
  }
  return cleared;
}

function sameContent(a, b) {
  const strip = ({ sources, proposed, ...rest }) => rest;
  return canonical(strip(a)) === canonical(strip(b));
}

function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
