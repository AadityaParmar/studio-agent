// Implementation files (build-phase spec §3). Folder <engagement>/_agent/implementation/:
//   frozen-brd-data.json   Frozen copy: BRD data as it stood at `implement init`; Implementation reads only this
//   target.md              Studio Enterprise (entId, name) + per-Module Neome App choice (A install by hand / B build from scratch)
//   names.md               Enterprise term → Studio name: | term | kind | studio name |
//   steps/NN-<layer>-<what>.md   Step files, run in a strict line
//
//   implement init   <engagement-dir> --ent <entId> --ent-name <name>   refuses (1) unless the gate is ready, or if already planned
//   implement check  <engagement-dir>        lint: `error | <file> | <msg>`, `warning | …`, then `check | ok | …` (exit 0) or exit 1
//   implement next   <engagement-dir>        `next | <file> | open|failed`, `paused | <file> | <why>`, `done | …`, `none | …`
//   implement fields <engagement-dir> <PREFIX>   `field | <entity> | <field> | <spec type> | <Studio type> | <note>` (from the Frozen copy)
// Bad arguments exit 2.
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { tables, column, isEmpty, list } from "../markdown.mjs";
import { parse, usage, today } from "../ingest.mjs";
import { validateEngagement } from "../build-brd.mjs";
import { frontierReport } from "../modules.mjs";
import { implementationBlockers } from "./gate.mjs";

const USE = [
  "implement init <engagement-dir> --ent <entId> --ent-name <name>",
  "implement check <engagement-dir>",
  "implement next <engagement-dir>",
  "implement fields <engagement-dir> <PREFIX>",
].join("\n       ");

export const LAYERS = ["setup", "roles-vars", "masters", "transactions", "logic", "actions", "workflows", "reports", "deploy"];
const ANY_LAYER = ["rework", ...LAYERS];
export const KINDS = [
  "role", "group", "module", "form", "spreadsheet", "report", "action", "layoutUser", "var", "plugin", "deeplink", "driveSheet",
  "translation", "workflow", "composite", "field", "formEvent", "formEventAction", "formEventCondition", "formFormula",
  "formLayout", "gridLayout", "spreadsheetLayout", "node",
];
const CALL_CAP = 40;
const STUDIO_NAME = /^[A-Z][A-Za-z0-9]*$/;
const ENT_ID = /^e-[A-Za-z0-9]+$/;
const FILE = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

const out = (l) => console.log(l);
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const dirOf = (eng) => join(resolve(eng), "_agent", "implementation");
const merged = (m) => String(m.status).startsWith("merged-into:");

export function implement(args) {
  const [action, ...rest] = args;
  const { pos, opts, problem } = parse(rest, ["ent", "ent-name"]);
  if (problem) return usage(problem, USE);
  const [eng, prefix, ...extra] = pos;
  if (!["init", "check", "next", "fields"].includes(action)) return usage(`implement: unknown action "${action ?? "(none)"}"`, USE);
  if (!eng || !existsSync(join(resolve(eng), "_agent", "map.md"))) return usage(`implement ${action}: ${eng ?? "(none)"} is not an Engagement folder`, USE);
  if (extra.length || (prefix && action !== "fields")) return usage(`implement ${action}: too many arguments`, USE);
  if (action === "init") return init(eng, opts);
  if (!existsSync(join(dirOf(eng), "frozen-brd-data.json"))) {
    console.error(`implement ${action}: no Frozen copy yet; run implement init first`);
    return 1;
  }
  if (action === "check") return check(eng);
  if (action === "next") return next(eng);
  if (!prefix) return usage("implement fields: needs a Module prefix", USE);
  return fields(eng, prefix);
}

// ---- init ----

function init(eng, opts) {
  if (!opts.ent || !ENT_ID.test(opts.ent)) return usage(`implement init: --ent must be a Studio Enterprise id (e-…), got "${opts.ent ?? ""}"`, USE);
  if (isEmpty(opts["ent-name"])) return usage("implement init: --ent-name needed", USE);
  const dir = dirOf(eng);
  if (existsSync(join(dir, "frozen-brd-data.json"))) {
    console.error(`implement init: already planned (${join(dir, "frozen-brd-data.json")} exists)`);
    return 1;
  }
  const r = validateEngagement(eng, { release: true });
  if (r.errors.length) {
    console.error(`implement init: the Engagement does not build (${r.errors.length} error(s)); run build-brd preview`);
    return 1;
  }
  const blockers = implementationBlockers(r.data);
  if (blockers.length) {
    console.error(`implement init: blocked (${blockers.length} blocker(s))`);
    for (const b of blockers) console.error(`blocker | ${b.msg}`);
    return 1;
  }
  const live = r.data.modules.filter((m) => !merged(m));
  const reqs = liveRequirements(r.data);
  mkdirSync(join(dir, "steps"), { recursive: true });
  writeFileSync(join(dir, "frozen-brd-data.json"), JSON.stringify(r.data, null, 2) + "\n");
  writeFileSync(join(dir, "target.md"), [
    "# Target", "",
    `Studio Enterprise: ${opts["ent-name"].trim()}`,
    `entId: ${opts.ent}`,
    `Frozen: ${today()} (${live.length} Module(s), ${reqs.length} Requirement(s))`, "",
    "## Neome Apps", "",
    "Choice per Module with a Neome App: A = install the App by hand in Studio first; B = build from scratch.", "",
    "| Module | Neome App | choice |", "|---|---|---|",
    ...live.map((m) => {
      const app = m.mapping?.neomeApp ?? "none";
      return `| ${m.prefix} | ${app} | ${app === "none" ? "—" : ""} |`;
    }),
    "",
  ].join("\n"));
  writeFileSync(join(dir, "names.md"), [
    "# Names", "",
    "Enterprise term → Studio name. Studio names: Uppercase first letter, then letters and digits. Option keys (`keyActive`) in the term cell as `<var>: <label> → <key>`.", "",
    "| term | kind | studio name |", "|---|---|---|", "",
  ].join("\n"));
  out(`init | ${opts.ent} | ${live.length} Module(s), ${reqs.length} Requirement(s) frozen`);
  return 0;
}

const liveRequirements = (data) =>
  [...data.modules.filter((m) => !merged(m)).flatMap((m) => m.requirements), ...(data.general?.requirements ?? [])].filter((r) => !r.withdrawn);

// ---- step files ----

function stepFiles(dir) {
  const d = join(dir, "steps");
  if (!existsSync(d)) return [];
  return readdirSync(d).filter((f) => f.endsWith(".md")).sort().map((name) => {
    const text = read(join(d, name));
    const m = name.match(FILE);
    const head = (k) => text.match(new RegExp(`^${k}:\\s*(.*)$`, "m"))?.[1].trim() ?? null;
    const humans = [...text.matchAll(/^- \[( |x)\] HUMAN:(.*)$/gm)].map((h) => ({ done: h[1] === "x", line: h[0], text: h[2] }));
    const calls = (text.split(/^## Run log/m)[0].match(/^\d+\.\s/gm) ?? []).length;
    return {
      name, text, num: m ? Number(m[1]) : null, layer: m ? layerOf(m[2]) : null,
      status: head("Status"), modules: list(head("Modules") ?? ""), reqs: list(head("Requirements") ?? ""), humans, calls,
    };
  });
}

// Longest known layer at the start of "<layer>-<what>".
function layerOf(rest) {
  const parts = rest.split("-");
  for (let i = parts.length; i > 0; i--) {
    const l = parts.slice(0, i).join("-");
    if (ANY_LAYER.includes(l)) return l;
  }
  return null;
}

// ---- check ----

function check(eng) {
  const dir = dirOf(eng);
  const frozen = JSON.parse(read(join(dir, "frozen-brd-data.json")));
  const errors = [];
  const warnings = [];
  const err = (f, m) => errors.push(`error | ${f} | ${m}`);
  const warn = (f, m) => warnings.push(`warning | ${f} | ${m}`);
  const live = frozen.modules.filter((m) => !merged(m));
  const prefixes = new Set(live.map((m) => m.prefix));
  const liveIds = new Set(liveRequirements(frozen).map((r) => r.id));

  // target.md
  const target = read(join(dir, "target.md"));
  if (!ENT_ID.test(target.match(/^entId:\s*(\S+)/m)?.[1] ?? "")) err("target.md", "entId line missing or not a Studio Enterprise id (e-…)");
  const apps = tables(target).find((t) => column(t, "module") && column(t, "choice"));
  for (const row of apps?.rows ?? []) {
    const app = String(row[column(apps, "neome app")] ?? "").trim();
    const choice = String(row[column(apps, "choice")] ?? "").trim();
    if (!app || app === "none") continue;
    if (!["A", "B"].includes(choice)) err("target.md", `${row[column(apps, "module")]}: Neome App choice must be A (install by hand) or B (build from scratch), got "${choice}"`);
  }

  // names.md
  const names = tables(read(join(dir, "names.md"))).find((t) => column(t, "term") && column(t, "studio name"));
  const seen = new Set();
  for (const row of names?.rows ?? []) {
    const term = String(row[column(names, "term")] ?? "").trim();
    const kind = String(row[column(names, "kind")] ?? "").trim();
    const name = String(row[column(names, "studio name")] ?? "").trim();
    if (!KINDS.includes(kind)) { err("names.md", `${term}: unknown kind "${kind}"`); continue; }
    if (!STUDIO_NAME.test(name)) { err("names.md", `"${name}" (${kind}) is not a Studio name (Uppercase first letter, then letters and digits)`); continue; }
    if (seen.has(`${kind}/${name}`)) err("names.md", `${kind} ${name} named twice`);
    seen.add(`${kind}/${name}`);
  }

  // steps/
  const files = stepFiles(dir);
  let expect = 0;
  let order = 0;
  let deployed = false;
  for (const f of files) {
    const at = `steps/${f.name}`;
    if (f.num === null || !f.layer) { err(at, "name must be NN-<layer>-<what>.md"); continue; }
    if (f.num !== expect) err(at, `numbers must run 00, 01, 02… with no gap (expected ${String(expect).padStart(2, "0")})`);
    expect = f.num + 1;
    if (f.num === 0 && f.layer !== "setup") err(at, "first step file must be 00-setup");
    if (!deployed && f.layer !== "rework") {
      const i = LAYERS.indexOf(f.layer);
      if (i < order) err(at, `layer ${f.layer} comes before ${LAYERS[order]} (order: ${LAYERS.join(", ")})`);
      else order = i;
    }
    if (f.layer === "deploy") deployed = true;
    if (!["open", "done", "failed"].includes(f.status)) err(at, `Status must be open, done or failed (got "${f.status ?? ""}")`);
    for (const p of f.modules) if (!prefixes.has(p)) err(at, `Module ${p} is not a live Module in the Frozen copy`);
    for (const id of f.reqs) if (!liveIds.has(id)) err(at, `${id} is not a live Requirement in the Frozen copy`);
    for (const h of f.humans) if (!/\S.*\s—\s.*\S/.test(h.text)) err(at, `HUMAN line needs "<what> — <where in Studio>": ${h.line}`);
    const open = f.humans.filter((h) => !h.done).length;
    if (f.status === "done" && open) err(at, `Status done, but ${open} HUMAN line(s) not ticked`);
    if (f.calls > CALL_CAP) warn(at, `${f.calls} MCP calls (cap ~${CALL_CAP}): split by Module`);
  }
  if (!files.some((f) => f.layer === "deploy")) warn("steps", "no deploy step file yet");
  else {
    const covered = new Set(files.flatMap((f) => f.reqs));
    for (const id of liveIds) if (!covered.has(id)) err("steps", `${id} is not covered by any step file`);
  }

  for (const l of [...errors, ...warnings]) out(l);
  if (errors.length) return 1;
  out(`check | ok | ${files.length} step file(s), ${warnings.length} warning(s)`);
  return 0;
}

// ---- next ----

function next(eng) {
  const files = stepFiles(dirOf(eng));
  if (!files.length) return out("none | no step files yet"), 0;
  const f = files.find((x) => x.status !== "done");
  if (!f) return out(`done | all ${files.length} step file(s) done`), 0;
  const status = new Map(frontierReport(eng).modules.map((m) => [m.prefix, String(m.fm.status ?? "")]));
  const off = f.modules.find((p) => status.has(p) && status.get(p) !== "resolved");
  if (off) return out(`paused | ${f.name} | ${off} is ${status.get(off)}: resolve it, then refreeze`), 0;
  out(`next | ${f.name} | ${f.status}`);
  return 0;
}

// ---- fields: spec type → Studio type ----

const sheetName = (entity) => `${String(entity).replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./, (c) => c.toUpperCase())}Sheet`;

export function studioFieldType(f) {
  const n = String(f.name ?? "").toLowerCase();
  switch (f.type) {
    case "text":
      if (/phone|mobile|contact number|whatsapp/.test(n)) return { type: "mobileNumber", note: "" };
      if (/e-?mail/.test(n)) return { type: "email", note: "" };
      if (/website|url|\blink\b/.test(n)) return { type: "hyperlink", note: "" };
      if (/address|notes?\b|description|remarks|comments?/.test(n)) return { type: "paragraph", note: "" };
      return { type: "text", note: "" };
    case "number": return { type: "number", note: "" };
    case "money": return { type: "decimal", note: "currency via prefix" };
    case "date": return { type: "date", note: "" };
    case "choice": return { type: "pickText", note: `setOfText var first${f.choices?.length ? ` (${f.choices.join(", ")})` : ""}` };
    case "person": return { type: "pickUser", note: "roleIdDataSource = roles whose users show" };
    case "link-to-entity": return { type: "ref", note: `spreadsheet ${sheetName(f.linkTo ?? "Target")} + list/card layout on it` };
    case "file": return /photo|image|picture|logo|avatar/.test(n) ? { type: "image", note: "" } : { type: "document", note: "" };
    default: return { type: "text", note: `unknown spec type "${f.type}": check` };
  }
}

function fields(eng, prefix) {
  const frozen = JSON.parse(read(join(dirOf(eng), "frozen-brd-data.json")));
  const m = frozen.modules.find((x) => x.prefix === prefix && !merged(x));
  if (!m) {
    console.error(`implement fields: ${prefix} is not a live Module in the Frozen copy`);
    return 1;
  }
  for (const rec of m.records ?? []) {
    for (const f of rec.fields) {
      const s = studioFieldType(f);
      out(`field | ${rec.entity} | ${f.name} | ${f.type} | ${s.type} | ${s.note}`.trimEnd());
    }
  }
  return 0;
}
