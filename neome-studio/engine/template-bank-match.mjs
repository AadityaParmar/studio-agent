// Template bank matching support for the reader skills (ingest, review-draft, grill-module, neome-mapping).
// The model matches against the index and reads only matched entries whole; the engine keeps the fields.
//   template-bank index  [--bank <dir>]
//   template-bank fields <engagement-dir> [--bank <dir>]
//   template-bank set    <engagement-dir> --template <TPL-…|none> [--bank <dir>]
//   template-bank set    <engagement-dir> <PREFIX> --template-module <TMOD-…|none> [--bank <dir>]
// Fields: Engagement `_agent/map.md` front matter `template:`; Module ticket front matter `templateModule:`.
// `none` = checked, no match; field missing = not checked.
// An ID no longer in the Template bank is a warning, never an error (shown by `fields` and `status`),
// with replacement IDs from the Template bank CHANGELOG. `set` refuses such IDs (exit 1).
// Template bank IDs are agent-side only: no client-facing view renderer reads these fields.
// Bad arguments exit 2; a refused change exits 1. Nothing is written then.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { frontMatter } from "./markdown.mjs";
import { parse, usage } from "./ingest.mjs";
import { frontierReport } from "./modules.mjs";
import { BANK_DIR, loadBank, checkTemplateRef } from "./template-bank.mjs";

const USE = [
  "template-bank index [--bank <dir>]",
  "template-bank fields <engagement-dir> [--bank <dir>]",
  "template-bank set <engagement-dir> --template <TPL-…|none> [--bank <dir>]",
  "template-bank set <engagement-dir> <PREFIX> --template-module <TMOD-…|none> [--bank <dir>]",
].join("\n       ");
const ID = /^(TPL|TMOD|PAT)-[a-z0-9]+(-[a-z0-9]+)*$/;
const KIND_ORDER = ["template", "template-module", "pattern"];

export function templateBank(args) {
  const [action, ...rest] = args;
  const { pos, opts, problem } = parse(rest, ["bank", "template", "template-module"]);
  if (problem) return usage(problem, USE);
  const bank = resolve(opts.bank ?? BANK_DIR);
  if (action === "index") {
    if (pos.length) return usage("template-bank index: takes no folder", USE);
    for (const l of bankIndex(bank)) console.log(l);
    return 0;
  }
  if (action !== "fields" && action !== "set") return usage(`template-bank: unknown action "${action ?? "(none)"}"`, USE);
  const [engArg, prefix, ...extra] = pos;
  if (!engArg || !existsSync(mapFile(engArg))) {
    return usage(`template-bank ${action}: ${engArg ?? "(none)"} is not an Engagement folder (no _agent/map.md)`, USE);
  }
  if (action === "fields") {
    if (prefix) return usage("template-bank fields: takes only the Engagement folder", USE);
    for (const l of fieldLines(engArg, bank)) console.log(l);
    return 0;
  }
  if (extra.length) return usage("template-bank set: too many arguments", USE);
  return prefix ? setModule(engArg, prefix, opts, bank) : setEngagement(engArg, opts, bank);
}

// ---- index ----

const plural = (n, word) => `${n} ${word}(s)`;
const builds = (fm) => new Set((Array.isArray(fm.seenIn) ? fm.seenIn : []).map((s) => s?.build).filter(Boolean)).size;
const listOf = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(String);

// One line per entry: ID | name | aliases / business type | seen in N Build(s). Templates, then Template modules, then Patterns.
export function bankIndex(bankDir = BANK_DIR) {
  const { entries } = loadBank(bankDir);
  const sorted = [...entries].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.id.localeCompare(b.id));
  const count = (k) => entries.filter((e) => e.kind === k).length;
  const out = [`index | ${plural(count("template"), "Template")}, ${plural(count("template-module"), "Template module")}, ${plural(count("pattern"), "Pattern")}`];
  for (const e of sorted) {
    const aliases = listOf(e.fm.aliases);
    out.push([
      e.id,
      e.fm.name ?? "(no name)",
      e.kind === "template" && e.fm.businessType ? `business type: ${e.fm.businessType}` : null,
      aliases.length ? `aliases: ${aliases.join(", ")}` : null,
      `seen in ${plural(builds(e.fm), "Build")}`,
    ].filter(Boolean).join(" | "));
  }
  return out;
}

// ---- fields: read ----

const mapFile = (eng) => join(resolve(eng), "_agent", "map.md");
const ticketFile = (eng, folder) => join(resolve(eng), "_agent", "modules", folder, "ticket.md");

function fmField(path, key) {
  if (!existsSync(path)) return null;
  let fm;
  try { fm = frontMatter(readFileSync(path, "utf8")).fm; } catch { return null; }
  const v = fm?.[key];
  return v === null || v === undefined || String(v).trim() === "" ? null : String(v).trim();
}

// TPL-… | "none" | null (not checked).
export const readTemplate = (eng) => fmField(mapFile(eng), "template");
// TMOD-… | "none" | null (not checked).
export const readTemplateModule = (ticketPath) => fmField(ticketPath, "templateModule");

// Live Modules (not merged), as `module frontier` reads them.
function liveModules(eng) {
  return frontierReport(eng).modules
    .filter((m) => !/^merged-into/.test(String(m.fm.status ?? "")) && m.prefix)
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

// Every set ID that is no longer in the Template bank: [{ where: "template" | PREFIX, id, level, message, suggest }].
export function templateWarnings(eng, bankDir = BANK_DIR) {
  const refs = [{ where: "template", id: readTemplate(eng), next: "review-draft re-matches" }];
  for (const m of liveModules(eng)) {
    refs.push({ where: m.prefix, id: readTemplateModule(ticketFile(eng, m.folder)), next: "next resolve-module re-matches" });
  }
  const out = [];
  for (const r of refs.filter((x) => x.id && x.id !== "none")) {
    const c = checkTemplateRef(bankDir, r.id);
    if (c.ok) continue;
    const suggest = c.suggest ?? [];
    const hint = suggest.length ? `maybe ${suggest.join(", ")}` : "no replacement";
    out.push({ where: r.where, id: r.id, level: "warning", suggest, message: `${r.id} is not in the Template bank; ${hint}; ${r.next}` });
  }
  return out;
}

function fieldLines(eng, bank) {
  const shown = (v) => v ?? "not checked";
  const out = [`template | ${shown(readTemplate(eng))}`];
  for (const m of liveModules(eng)) out.push(`module | ${m.prefix} | ${shown(readTemplateModule(ticketFile(eng, m.folder)))}`);
  for (const w of templateWarnings(eng, bank)) out.push(`warning | ${w.where} | ${w.message}`);
  return out;
}

// ---- fields: write ----

// Sets one top-level key in the YAML front matter; adds front matter if none. Everything else stays byte-identical.
export function setFrontMatterKey(text, key, value) {
  const line = `${key}: ${value}`;
  const m = text.match(/^---\r?\n([\s\S]*?\r?\n)?---\r?\n/);
  if (!m) return `---\n${line}\n---\n\n${text}`;
  const head = m[1] ?? "";
  const re = new RegExp(`^${key}:.*$`, "m");
  const next = re.test(head) ? head.replace(re, line) : `${head}${line}\n`;
  return `---\n${next}---\n${text.slice(m[0].length)}`;
}

// Value must be `none` or a Template bank ID of the right kind that exists. Returns exit code or 0.
function checkValue(value, kindPrefix, flag, bank) {
  if (value === "none") return 0;
  if (!ID.test(value) || !value.startsWith(`${kindPrefix}-`)) {
    return usage(`template-bank set: --${flag} must be ${kindPrefix}-<slug> or none (got "${value}")`, USE);
  }
  const c = checkTemplateRef(bank, value);
  if (c.ok) return 0;
  const suggest = c.suggest ?? [];
  console.error(`template-bank set: ${value} is not in the Template bank${suggest.length ? `; maybe ${suggest.join(", ")}` : ""}; nothing written`);
  return 1;
}

function setEngagement(eng, opts, bank) {
  if (opts["template-module"] !== undefined) return usage("template-bank set: --template-module needs a Module prefix", USE);
  const value = opts.template?.trim();
  if (!value) return usage("template-bank set: needs --template <TPL-…|none> or <PREFIX> --template-module <TMOD-…|none>", USE);
  const code = checkValue(value, "TPL", "template", bank);
  if (code) return code;
  const p = mapFile(eng);
  writeFileSync(p, setFrontMatterKey(readFileSync(p, "utf8"), "template", value));
  console.log(`template | ${value}`);
  return 0;
}

function setModule(eng, prefix, opts, bank) {
  if (opts.template !== undefined) return usage("template-bank set: --template takes no Module prefix", USE);
  const value = opts["template-module"]?.trim();
  if (!value) return usage("template-bank set: <PREFIX> needs --template-module <TMOD-…|none>", USE);
  const code = checkValue(value, "TMOD", "template-module", bank);
  if (code) return code;
  const m = liveModules(eng).find((x) => x.prefix === prefix);
  if (!m) {
    console.error(`template-bank set: no live Module ${prefix} in modules/`);
    return 1;
  }
  const p = ticketFile(eng, m.folder);
  writeFileSync(p, setFrontMatterKey(readFileSync(p, "utf8"), "templateModule", value));
  console.log(`module | ${prefix} | ${value}`);
  return 0;
}
