// spec-check <engagement-dir> <PREFIX>
// The Module spec done check (write-module-spec), run before the Module ticket closes.
// Passes only when the spec has its header and 13 fixed sections, each filled / N/A: <reason> / Open Items,
// every live Requirement is complete, section 12 holds one indicative Neome App + Delivery,
// section 13 lists the Module's open Open Items, no earlier Requirement ID is gone,
// and the whole Engagement builds with this Module held to resolved strictness.
// Reads only; writes nothing. Exit 0 = done, 1 = not done, 2 = bad arguments.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readEngagement, SPEC_SECTIONS } from "./brd/read-engagement.mjs";
import { schemaErrors, crossRefErrors, completeness, SCHEMA_VERSION } from "./brd/validate.mjs";
import { frontMatter, sections, bullets, isEmpty, normHeader } from "./markdown.mjs";
import { parse, usage, today } from "./ingest.mjs";

const USE = "spec-check <engagement-dir> <PREFIX>";
const TITLES = [
  "Purpose and KPIs", "Roles", "Process", "Records and data", "Statuses", "Rules and notifications",
  "Exceptions", "Reports", "Integrations", "Volumes and NFRs", "Requirements", "Neome mapping", "Open Items",
];
const HEADER_KEYS = ["Prefix", "Name", "Status", "Sources"];

export function specCheck(args) {
  const p = parse(args, []);
  if (p.problem) return usage(p.problem, USE);
  const [dir, prefix] = p.pos;
  if (!dir || !prefix || p.pos.length > 2) return usage("spec-check needs <engagement-dir> and <PREFIX>", USE);
  if (!existsSync(join(dir, "_agent"))) return usage(`spec-check: ${dir} is not an Engagement folder (no _agent/)`, USE);

  const errors = [];
  const err = (cls, msg) => errors.push({ cls, msg });
  const folder = moduleFolder(join(dir, "_agent", "modules"), prefix);
  if (!folder) {
    console.error(`error [spec] no Module ${prefix} in ${join(dir, "_agent", "modules")}`);
    return 1;
  }
  const specPath = join(folder, "spec.md");
  if (!existsSync(specPath)) {
    console.error(`error [spec] Module ${prefix}: spec.md missing (write-module-spec writes it)`);
    console.error(`spec-check: ${prefix} not done: 1 error(s)`);
    return 1;
  }
  const spec = readFileSync(specPath, "utf8");
  const where = `Module ${prefix} spec.md`;
  const s = (msg) => err("spec", `${where}: ${msg}`);

  // Header lines.
  const top = spec.split(/^##\s/m)[0];
  const header = Object.fromEntries(HEADER_KEYS.map((k) => {
    const m = top.match(new RegExp(`^\\s*${k}:\\s*(.*)$`, "im"));
    return [k, m ? m[1].trim() : null];
  }));
  for (const k of HEADER_KEYS) if (isEmpty(header[k])) s(`header line "${k}:" missing or empty`);
  if (!isEmpty(header.Prefix) && header.Prefix !== prefix) s(`header "Prefix: ${header.Prefix}" is not ${prefix}`);

  // 13 H2 sections: numbered, fixed order, nothing else.
  const h2 = sections(spec, 2);
  const want = TITLES.map((t, i) => `${i + 1} ${t}`);
  const got = h2.map((x) => x.title);
  if (got.join("\n").toLowerCase() !== want.join("\n").toLowerCase()) {
    for (const w of want) if (!got.some((g) => g.toLowerCase() === w.toLowerCase())) s(`section "## ${w}" missing (never delete a heading; write N/A: <reason>)`);
    for (const g of got) if (!want.some((w) => w.toLowerCase() === g.toLowerCase())) s(`"## ${g}" is not one of the 13 spec sections (write "## <n> <title>")`);
    const known = got.filter((g) => want.some((w) => w.toLowerCase() === g.toLowerCase()));
    const inOrder = want.filter((w) => known.some((g) => g.toLowerCase() === w.toLowerCase()));
    if (known.map((g) => g.toLowerCase()).join("\n") !== inOrder.map((w) => w.toLowerCase()).join("\n")) s("sections are not in the fixed order 1–13");
  }
  const body = (n) => h2.find((x) => normHeader(x.title.replace(/^\d+\s*/, "")) === SPEC_SECTIONS[n - 1])?.body ?? null;
  for (const [i, t] of TITLES.entries()) {
    const b = body(i + 1);
    if (b === null) continue;
    if (!b.trim()) s(`section ${i + 1} ${t} is empty (fill it, write N/A: <reason>, or list its Open Items)`);
    else if (/^N\/A\b/i.test(b.trim()) && !/^N\/A:\s*\S/i.test(b.trim())) s(`section ${i + 1} ${t}: N/A needs a reason (N/A: <reason> [Source])`);
  }
  for (const n of [11, 12]) if (/^N\/A\b/i.test((body(n) ?? "").trim())) s(`section ${n} ${TITLES[n - 1]} cannot be N/A`);

  // Requirement blocks, as written.
  const blocks = sections(body(11) ?? "", 3);
  for (const { title, body: b } of blocks) {
    const id = title.match(/^([A-Z]{2,5}-\d+)/)?.[1] ?? title;
    const line = (k) => b.match(new RegExp(`^\\s*${k}:\\s*(.*)$`, "im"));
    if (line("Withdrawn")) {
      if (isEmpty(line("Withdrawn")[1])) s(`${id}: Withdrawn needs a reason`);
      continue;
    }
    for (const k of ["Statement", "Priority", "Scope", "Sources"]) {
      if (!line(k) || isEmpty(line(k)[1])) s(`${id}: "${k}:" missing or empty${k === "Sources" ? " (Source IDs, or (proposed, to confirm))" : ""}`);
    }
    const acc = b.match(/^\s*Acceptance:\s*(.*)\n((?:\s*[-*]\s.*\n?)*)/im);
    if (!acc || (isEmpty(acc[1]) && bullets(acc[2]).length === 0)) s(`${id}: "Acceptance:" needs at least 1 bullet`);
    const prop = line("Proposed")?.[1].trim().toLowerCase();
    if (!["yes", "no"].includes(prop)) s(`${id}: "Proposed: yes|no" line missing`);
    else if (prop === "no" && /\(proposed, to confirm\)/i.test(b)) s(`${id}: says Proposed: no but part of it is (proposed, to confirm)`);
  }

  // Section 12 lines, as written.
  const s12 = body(12) ?? "";
  const count = (k) => [...s12.matchAll(new RegExp(`^\\s*(?:[-*]\\s+)?${k}:`, "gim"))].length;
  for (const k of ["Neome App", "Delivery", "How"]) {
    if (count(k) !== 1) s(`section 12: needs exactly one "${k}:" line (one Neome App and one Delivery per Module), found ${count(k)}`);
  }

  // Data checks: the whole Engagement as build-brd reads it.
  const { data, meta, register, errors: parseErrors } = readEngagement(dir, { schemaVersion: SCHEMA_VERSION, date: today() });
  errors.push(...parseErrors, ...schemaErrors(data));
  const mod = data.modules.find((m) => m.prefix === prefix);
  if (errors.every((e) => e.cls === "spec") && mod) {
    errors.push(...crossRefErrors(data, register));
    // This Module at resolved strictness, whatever its ticket says.
    const status = mod.status;
    mod.status = "resolved";
    errors.push(...completeness(data, meta).errors.filter((e) => e.msg.startsWith(`Module ${prefix} `)));
    mod.status = status;

    for (const r of mod.requirements) {
      if (!r.withdrawn && r.delivery && mod.mapping && r.delivery === mod.mapping.delivery) {
        s(`${r.id}: Delivery override equals the Module Delivery (${r.delivery}); remove the line`);
      }
    }

    // Header Sources list every cited Source.
    const listed = new Set((header.Sources ?? "").split(",").map((x) => x.trim()).filter(Boolean));
    const cited = new Set();
    const walk = (v) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) k === "sources" ? x.forEach((id) => cited.add(id)) : walk(x);
    };
    walk(mod);
    const missing = [...cited].filter((id) => !listed.has(id)).sort();
    if (missing.length) s(`header "Sources:" does not list ${missing.join(", ")} (cited in the spec)`);

    // Section 13 = the Module's open Open Items, no closed ones.
    const ois = new Map(data.openItems.map((o) => [o.id, o]));
    const live = mod.requirements.filter((r) => !r.withdrawn);
    const mine = data.openItems.filter((o) => o.status === "open"
      && (o.modules.includes(prefix) || live.some((r) => r.ois.includes(o.id))));
    for (const o of mine) if (!mod.oiRefs.includes(o.id)) s(`section 13 misses open ${o.id} (${o.modules.includes(prefix) ? `Module(s) ${o.modules.join(", ")}` : "on a Requirement's OIs line"})`);
    for (const id of mod.oiRefs) if (ois.get(id)?.status === "closed") s(`section 13 lists ${id}, which is closed; drop it there (keep it on OIs: lines)`);

    // Requirement IDs never dropped: every ID this Module had in an earlier build or version is still there.
    const now = new Set(mod.requirements.map((r) => r.id));
    for (const { id, seen } of earlierIds(dir, mod)) {
      if (!now.has(id)) s(`${id} was in ${seen} and is gone; keep the block and mark it Withdrawn: <reason> (IDs are never reused)`);
    }
  } else if (!mod && errors.every((e) => e.cls === "spec")) {
    err("spec", `Module ${prefix} not read by the build`);
  }

  for (const e of errors) console.error(`error [${e.cls}] ${e.msg}`);
  if (errors.length) {
    console.error(`spec-check: ${prefix} not done: ${errors.length} error(s)`);
    return 1;
  }
  console.log(`spec-check: ${prefix} done`);
  return 0;
}

function moduleFolder(modulesDir, prefix) {
  if (!existsSync(modulesDir)) return null;
  for (const d of readdirSync(modulesDir, { withFileTypes: true })) {
    if (!d.isDirectory() || !(d.name === prefix || d.name.startsWith(prefix + "-"))) continue;
    const t = join(modulesDir, d.name, "ticket.md");
    if (!existsSync(t)) continue;
    try {
      if (String(frontMatter(readFileSync(t, "utf8")).fm?.prefix ?? "") === prefix) return join(modulesDir, d.name);
    } catch {
      // Bad front-matter: the build reports it.
    }
  }
  return null;
}

// Requirement IDs this Module (or its former prefix) had in the live data file or any released version.
function earlierIds(dir, mod) {
  const files = [];
  const live = join(dir, "_agent", "brd", "brd-data.json");
  if (existsSync(live)) files.push({ file: live, seen: "the last build" });
  const vdir = join(dir, "_agent", "brd", "versions");
  if (existsSync(vdir)) {
    for (const f of readdirSync(vdir).filter((x) => /^v\d+\.json$/.test(x)).sort()) files.push({ file: join(vdir, f), seen: f.replace(".json", "") });
  }
  const prefixes = [mod.prefix, mod.formerly].filter(Boolean);
  const out = new Map();
  for (const { file, seen } of files) {
    let data;
    try {
      data = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      continue;
    }
    for (const m of data.modules ?? []) {
      if (!prefixes.includes(m.prefix)) continue;
      for (const r of m.requirements ?? []) if (!out.has(r.id)) out.set(r.id, seen);
    }
  }
  return [...out].map(([id, seen]) => ({ id, seen }));
}
