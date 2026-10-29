// Eval case: load and check one case folder (neome-studio/evals/<case>/).
// Layout (ticket 18): inputs/ (anonymised raw Inputs), answer-key.md, golden.json, README.md, plus replay.yaml
// (the steps the runner replays). Deterministic; no LLM.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
export const EVALS_DIR = join(here, "..");
const PLUGIN_DIR = join(EVALS_DIR, "..");
const ajv = new Ajv2020({ allErrors: true, strict: true, strictTypes: false, strictRequired: false });
const load = (f) => JSON.parse(readFileSync(join(here, f), "utf8"));
export const SCHEMAS = {
  golden: load("golden.schema.json"),
  replay: load("replay.schema.json"),
  judge: load("judge.schema.json"),
  client: load("client.schema.json"),
};
const validators = Object.fromEntries(Object.entries(SCHEMAS).map(([k, s]) => [k, ajv.compile(s)]));
const CATALOG = new Set(
  JSON.parse(readFileSync(join(PLUGIN_DIR, "reference", "neome-app-catalog-slugs.json"), "utf8")).apps.map((a) => a.slug),
);
export const CASE_FILES = ["README.md", "answer-key.md", "golden.json", "replay.yaml"];

// Shape errors as "<where> <what>" strings; [] when valid.
export function shapeErrors(kind, value) {
  const v = validators[kind];
  if (v(value)) return [];
  return v.errors.map((e) => `${kind}${e.instancePath || ""} ${e.message}`);
}

// Case folders under a root: every child folder holding golden.json.
export function listCases(root = EVALS_DIR) {
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(root, e.name, "golden.json")))
    .map((e) => e.name)
    .sort();
}

export function caseDir(nameOrDir, root = EVALS_DIR) {
  return existsSync(join(nameOrDir, "golden.json")) ? nameOrDir : join(root, nameOrDir);
}

// Reads a case and lists every problem. Never throws on bad content.
export function loadCase(dir) {
  const problems = [];
  const kase = { name: basename(dir), dir, inputs: [], problems };
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    problems.push(`no case folder ${dir}`);
    return kase;
  }
  for (const f of CASE_FILES) if (!existsSync(join(dir, f))) problems.push(`missing ${f}`);
  const inputsDir = join(dir, "inputs");
  if (existsSync(inputsDir)) kase.inputs = readdirSync(inputsDir).filter((f) => !f.startsWith(".")).sort();
  if (!kase.inputs.length) problems.push("inputs/ is missing or empty");
  const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : null);
  kase.readme = read("README.md");
  kase.answerKey = read("answer-key.md");
  try {
    kase.golden = read("golden.json") && JSON.parse(read("golden.json"));
  } catch (e) {
    problems.push(`golden.json is not JSON: ${e.message}`);
  }
  try {
    kase.replay = read("replay.yaml") && parseYaml(read("replay.yaml"));
  } catch (e) {
    problems.push(`replay.yaml is not YAML: ${e.message}`);
  }
  if (kase.golden) problems.push(...shapeErrors("golden", kase.golden), ...goldenRefErrors(kase.golden, kase.inputs, kase.answerKey ?? ""));
  if (kase.replay) problems.push(...shapeErrors("replay", kase.replay));
  if (kase.golden && kase.replay && !problems.length) {
    if (kase.golden.case !== kase.name) problems.push(`golden.json case "${kase.golden.case}" is not the folder name "${kase.name}"`);
    if (kase.golden.enterprise.id !== kase.replay.enterprise) problems.push("golden.json enterprise.id differs from replay.yaml enterprise");
    if (kase.golden.engagement.slug !== kase.replay.engagement) problems.push("golden.json engagement.slug differs from replay.yaml engagement");
    const ids = kase.replay.steps.map((s) => s.id);
    for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) problems.push(`replay.yaml step id ${id} used twice`);
  }
  if (kase.answerKey !== null && !/\bK-\d{2,3}\b/.test(kase.answerKey ?? "")) problems.push("answer-key.md has no fact IDs (K-NN)");
  return kase;
}

// Golden IDs unique, prefixes match their Module, App slugs in the catalog, sources name a case Input or a key fact.
function goldenRefErrors(golden, inputs, answerKey) {
  const out = [];
  if (!Array.isArray(golden.modules) || !Array.isArray(golden.openItems) || !golden.general) return out;
  const keyIds = new Set([...answerKey.matchAll(/\bK-\d{2,3}\b/g)].map((m) => m[0]));
  const seen = new Set();
  const once = (id, where) => {
    if (seen.has(id)) out.push(`golden ${where}: ${id} used twice`);
    seen.add(id);
  };
  const sources = (item) => {
    for (const s of item.sources ?? []) {
      if (!inputs.includes(s) && !keyIds.has(s)) out.push(`golden ${item.id}: source "${s}" is neither a case Input nor an answer-key fact`);
    }
  };
  for (const m of golden.modules) {
    once(m.prefix, "Module");
    if (m.prefix === "GEN") out.push("golden Module: GEN is reserved");
    if (m.mapping?.neomeApp && !CATALOG.has(m.mapping.neomeApp)) out.push(`golden ${m.prefix}: neomeApp ${m.mapping.neomeApp} not in the catalog`);
    if (m.mapping && m.mapping.neomeApp === null && m.mapping.delivery !== "custom") out.push(`golden ${m.prefix}: no App ⇒ delivery custom`);
    for (const r of m.requirements ?? []) {
      once(r.id, "Requirement");
      if (!r.id?.startsWith(`${m.prefix}-`)) out.push(`golden ${r.id}: prefix is not its Module ${m.prefix}`);
      sources(r);
    }
  }
  for (const r of golden.general.requirements ?? []) {
    once(r.id, "Requirement");
    sources(r);
  }
  const prefixes = new Set(golden.modules.map((m) => m.prefix));
  for (const oi of golden.openItems) {
    once(oi.id, "Open Item");
    for (const p of oi.modules ?? []) if (p !== "All" && !prefixes.has(p)) out.push(`golden ${oi.id}: unknown Module ${p}`);
  }
  for (const m of golden.mechanics ?? []) once(m.id, "mechanic");
  return out;
}

// Golden Requirements flat: Module ones then GEN.
export function goldenRequirements(golden) {
  return [
    ...golden.modules.flatMap((m) => m.requirements.map((r) => ({ ...r, module: m.prefix }))),
    ...golden.general.requirements.map((r) => ({ ...r, module: "GEN" })),
  ];
}
