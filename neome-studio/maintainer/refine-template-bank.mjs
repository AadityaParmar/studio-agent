#!/usr/bin/env node
// refine-template-bank: maintainer-only tool (Template bank spec §7; ticket .scratch/template-bank/issues/09-bank-refine-skill.md).
// Not a skill, not an engine command, never shown by studio. Driver prompt: refine-template-bank.md (same folder).
// Every deterministic step of a refine run; the model stages (tag, cluster, review) run as delegate_task children.
// Run from the repo root. Raw dir layout: template-bank/refine-state.mjs. YAML shapes: template-bank/prompts/shapes.md.
//
// Options: --raw <dir> (default .scratch/template-bank/raw, must be gitignored) · --bank <dir> (default
// neome-studio/reference/template-bank) · --run <id> (default latest run) · --catalog <slugs.json>.
// Output never holds a raw file name, a Build name or a scrub word: Build codes and counts only. Exception: Neome App
// Builds (<raw>/neome-template/, code NA-<catalog slug>, template-bank/apps.mjs) are Neome-owned, so a `stop` line may
// name an App JSON file or App name (unknown App name = hard stop until the maintainer adds it to app-slugs.txt).
//
//   status                     build | NB-NN|NA-<slug> | new|updated|current|removed | v<n> [tagged v<m>]  ·  run | <id> | <stage>
//                              stop | <app-slugs problem>   (exit 1)
//                              done | <n> new, <n> updated, <n> current, <n> removed
//   prepare [--full] [--date YYYY-MM-DD]
//                              digest + scrub of new / updated Builds, then a new run (runs/<id>/run.json).
//                              digest | NB-NN | …  ·  over | NB-NN | <area file> | <n> KB > 25 KB cap  ·  scrub | NB-NN | <n> files clean
//                              leak | NB-NN | <file>:<line> | <what>   ·   NA- Builds: no word list, same leak check
//                              words | NB-NN | <list path> | seeded … | not checked …   (exit 3: maintainer adds names + `# checked`, re-run)
//                              tag | NB-NN | new|updated | <n> areas | <tags dir> [| sheets ready]
//                              removed | NB-NN | its seenIn rows will be dropped  ·  run | <id> | <mode> | <run dir>
//                              nothing | …   (no new, updated or removed Builds and no --full)
//   prompt tag <NB-NN> | cluster | review
//                              prints the child task text (template from template-bank/prompts/, paths filled in)
//   validate-tags [NB-NN …]    ok | NB-NN | <n> sheets   ·   error | NB-NN | <sheet>: <text>
//   validate-changes           ok | <n> changes  ·  error | change <i> (<ref>): <text>  ·  warning | …  (dry-run apply included)
//   decide                     review rule → runs/<id>/decisions.json.  auto | <ref>  ·  ask | <ref> | <why> | <question>
//   answer "<ref>" apply|drop [--note <text>]
//                              records the maintainer's answer to an ask
//   apply                      approved changes → Template bank (copy first; real bank only if checkBank passes).
//                              applied | <CHANGELOG line>  ·  retired | <ID> | seenIn hit zero  ·  done | …
//   tokens <tag|cluster|review> <NB-NN|all> [--in <n> --out <n>] [--provider <id> --model <id>]
//                              appends to runs/<id>/tokens.tsv; no --in/--out = estimate from file sizes (chars / 4)
//   report                     runs/<id>/report.md (changes + reasons, tokens). report | <path> | <n> applied …
//   check                      checkBank with scrub words from <raw>/scrub/*.txt. ok | … · error | … · warning | …
//   commit                     check + leak check, then git: branch template-bank-refine-<run>, add the Template bank
//                              folder only, commit. Never merges, never pushes. commit | <branch> | <sha>
// Exit 0 = ok, 1 = errors found / step refused, 2 = bad arguments or raw dir not gitignored, 3 = scrub word list seeded.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BANK_DIR, checkBank, loadBank } from "../engine/template-bank.mjs";
import { bankIndex } from "../engine/template-bank-match.mjs";
import { DEFAULT_RAW, rawDirProblem } from "./template-bank/raw-dir.mjs";
import { isApp } from "./template-bank/apps.mjs";
import { parseBuild } from "./template-bank/build-json.mjs";
import { writeDigest } from "./template-bank/digest.mjs";
import {
  areaFiles, bankBuilds, buildStatus, clusterBuilds, CODE, loadRun, nextRun, refreshBuilds, runDir, runs, runTargets,
  scrubbedDir, scrubWords, sheetsReady, tagDir, tagSheets, tagged,
} from "./template-bank/refine-state.mjs";
import { decide, leaks, readChanges, readDraft, readVerdicts, refOf, validateChanges, validateTags, validateVerdicts, idsOf } from "./template-bank/refine-shapes.mjs";
import { applyChanges, renderReport } from "./template-bank/refine-apply.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const TB = join(here, "template-bank");
const PROMPTS = join(TB, "prompts");
const repoRoot = resolve(here, "..", "..");
const USE = `Usage: refine-template-bank.mjs <status|prepare|prompt|validate-tags|validate-changes|decide|answer|apply|tokens|report|check|commit> [args] [--raw <dir>] [--bank <dir>] [--run <id>]`;
const FLAGS = ["raw", "bank", "run", "date", "in", "out", "provider", "model", "note", "catalog"];
const BOOL = ["full", "confirm-retire"];

const out = (...parts) => console.log(parts.join(" | "));
const today = () => new Date().toISOString().slice(0, 10);
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const writeJson = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2) + "\n");

function parseFlags(argv) {
  const flags = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { pos.push(a); continue; }
    const k = a.slice(2);
    if (BOOL.includes(k)) { flags[k] = true; continue; }
    if (!FLAGS.includes(k) || i + 1 >= argv.length) return { error: `unknown or empty option ${a}` };
    flags[k] = argv[++i];
  }
  return { flags, pos };
}

export async function main(argv) {
  const [cmd, ...rest] = argv;
  const p = parseFlags(rest);
  if (p.error || !cmd) return usage(p.error);
  const ctx = {
    raw: resolve(p.flags.raw ?? DEFAULT_RAW),
    bank: resolve(p.flags.bank ?? BANK_DIR),
    flags: p.flags,
    pos: p.pos,
  };
  ctx.checkOpts = p.flags.catalog ? { catalogSlugsPath: resolve(p.flags.catalog) } : {};
  ctx.catalog = p.flags.catalog ? resolve(p.flags.catalog) : undefined;
  const problem = rawDirProblem(ctx.raw);
  if (problem) { console.error(`refine-template-bank: ${problem}`); return 2; }
  const cmds = { status, prepare, prompt, "validate-tags": validateTagsCmd, "validate-changes": validateChangesCmd, decide: decideCmd, answer, apply, tokens, report, check, commit };
  if (!cmds[cmd]) return usage(`unknown command ${cmd}`);
  return cmds[cmd](ctx);
}

function usage(msg) {
  if (msg) console.error(`refine-template-bank: ${msg}`);
  console.error(USE);
  return 2;
}

function needRun(ctx) {
  const r = loadRun(ctx.raw, ctx.flags.run);
  if (r.error) out("error", r.error);
  return r.error ? null : r;
}

// ---------- status ----------

function stageOf(dir) {
  const has = (f) => existsSync(join(dir, f));
  const applied = has("applied.json") ? readJson(join(dir, "applied.json")) : null;
  if (applied?.commit) return `committed ${applied.commit}`;
  if (applied) return "applied, not committed";
  if (has("decisions.json")) return readJson(join(dir, "decisions.json")).some((d) => d.decision === "ask") ? "waiting for maintainer answers" : "decided, not applied";
  if (has("verdicts.yaml")) return "reviewed, not decided";
  if (has("changes.yaml")) return "clustered, not reviewed";
  return "prepared, tagging";
}

function status(ctx) {
  const { rows, unreadable, problems } = buildStatus(ctx.raw, ctx.bank, ctx.catalog);
  if (unreadable.length) out("skip", `${unreadable.length} raw file(s)`, "not Neome Build JSON");
  if (problems.length) { for (const p of problems) out("stop", p); return 1; }
  const n = { new: 0, updated: 0, current: 0, removed: 0 };
  for (const r of rows) {
    n[r.state]++;
    const v = r.version === null ? "no JSON" : `v${r.version}`;
    out("build", r.code ?? "(no code yet)", r.state, r.taggedVersion !== null && r.state !== "current" ? `${v} (tagged v${r.taggedVersion})` : v);
  }
  const last = runs(ctx.raw).at(-1);
  if (last) out("run", last, stageOf(runDir(ctx.raw, last)));
  out("done", `${n.new} new, ${n.updated} updated, ${n.current} current, ${n.removed} removed`);
  return 0;
}

// ---------- prepare ----------

function node(script, args) {
  const r = spawnSync(process.execPath, [join(TB, script), ...args], { encoding: "utf8" });
  return { code: r.status, lines: `${r.stdout}`.split("\n").filter(Boolean) };
}

function prepare(ctx) {
  const date = ctx.flags.date ?? today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return usage("--date must be YYYY-MM-DD");
  const full = Boolean(ctx.flags.full);
  const { rows, unreadable, problems } = buildStatus(ctx.raw, ctx.bank, ctx.catalog);
  if (unreadable.length) out("skip", `${unreadable.length} raw file(s)`, "not Neome Build JSON");
  if (problems.length) { for (const p of problems) out("stop", p); return 1; }
  const targets = rows.filter((r) => r.state === "new" || r.state === "updated");
  const removed = rows.filter((r) => r.state === "removed");
  if (!targets.length && !removed.length && !full) { out("nothing", "no new, updated or removed Builds (use --full to re-cluster)"); return 0; }

  let codes = [];
  if (targets.length) {
    const nb = targets.filter((t) => !t.app);
    if (nb.length) {
      const d = node("digest.mjs", ["--raw", ctx.raw, ...nb.map((t) => join(ctx.raw, t.file))]);
      for (const l of d.lines) if (/^(digest|kinds|over) \| /.test(l)) console.log(l);
      if (d.code !== 0) { out("error", "digest", `exit ${d.code}`); return 1; }
    }
    // Neome App Builds: code fixed by app-slugs.txt, never in builds.json (client map).
    for (const t of targets.filter((x) => x.app)) {
      const path = join(ctx.raw, t.file);
      for (const l of writeDigest(ctx.raw, t.code, parseBuild(readFileSync(path, "utf8")), statSync(path).size)) console.log(l);
    }
    const fresh = buildStatus(ctx.raw, ctx.bank, ctx.catalog).rows;
    codes = targets.map((t) => fresh.find((f) => f.file === t.file)?.code).filter(Boolean);
    const s = node("scrub.mjs", ["--raw", ctx.raw, ...codes]);
    const seeded = [];
    for (const l of s.lines) {
      const m = l.match(/^seeded \| (NB-\d+) \| (.+?) \|/);
      if (m) seeded.push([m[1], m[2]]);
      else if (/^(scrub|leak|error) \| /.test(l)) console.log(l);
    }
    if (s.code !== 0) { out("stop", "scrub failed: a listed word, contact or message body survived. Fix the word list, re-run prepare. No model sees this Build"); return 1; }
    if (seeded.length) {
      for (const [c, path] of seeded) out("words", c, path, "seeded: add client, people and place names, then re-run prepare");
      return 3;
    }
    const unchecked = codes.filter((c) => !isApp(c) && !listChecked(ctx.raw, c));
    if (unchecked.length) {
      for (const c of unchecked) out("words", c, join(ctx.raw, "scrub", `${c}.txt`), "not checked: add client, people and place names, then a line `# checked`, then re-run prepare");
      return 3;
    }
  }

  const fresh = buildStatus(ctx.raw, ctx.bank, ctx.catalog).rows;
  const builds = [];
  for (const t of targets) {
    const row = fresh.find((f) => f.file === t.file);
    const code = row.code;
    const ready = sheetsReady(ctx.raw, code);
    const dir = tagDir(ctx.raw, code);
    if (!(ready && String(ready.version) === row.version) && existsSync(dir)) {
      const old = tagged(ctx.raw, code);
      if (old) {
        let dest = join(ctx.raw, "tags-old", `${code}-v${old.version}`);
        for (let n = 2; existsSync(dest); n++) dest = join(ctx.raw, "tags-old", `${code}-v${old.version}-${n}`);
        mkdirSync(dirname(dest), { recursive: true });
        renameSync(dir, dest);
      } else rmSync(dir, { recursive: true, force: true });
    }
    mkdirSync(dir, { recursive: true });
    const areas = areaFiles(ctx.raw, code);
    const isReady = ready && String(ready.version) === row.version;
    builds.push({ code, state: t.state, version: row.version, areas: areas.length });
    out("tag", code, t.state, `${areas.length} areas`, dir, ...(isReady ? ["sheets ready"] : []));
  }
  for (const r of removed) {
    builds.push({ code: r.code, state: "removed", version: null, areas: 0 });
    out("removed", r.code, "its seenIn rows will be dropped; entries left at zero retire");
  }
  const id = nextRun(ctx.raw, date);
  const dir = runDir(ctx.raw, id);
  mkdirSync(join(dir, "drafts"), { recursive: true });
  writeJson(join(dir, "run.json"), { run: id, date, mode: full ? "full" : "incremental", builds });
  out("run", id, full ? "full" : "incremental", dir);
  return 0;
}

// Word list reviewed by the maintainer: a line `# checked` (seeded lists never have it).
function listChecked(raw, code) {
  const p = join(raw, "scrub", `${code}.txt`);
  return existsSync(p) && readFileSync(p, "utf8").split("\n").some((l) => /^#\s*checked\b/i.test(l.trim()));
}

// ---------- prompt ----------

const list = (xs, empty = "(none)") => (xs.length ? xs.map((x) => `- ${x}`).join("\n") : empty);

function usedIds(bankDir) {
  const { entries, changelog } = loadBank(bankDir);
  const live = new Set(entries.map((e) => e.id));
  return [...new Set(changelog.flatMap((c) => [...c.ids, ...(c.replacedBy ?? [])]))].filter((id) => !live.has(id)).sort();
}

function prompt(ctx) {
  const [stage, code] = ctx.pos;
  if (!["tag", "cluster", "review"].includes(stage)) return usage("prompt tag <NB-NN> | cluster | review");
  const r = needRun(ctx);
  if (!r) return 1;
  const index = loadBank(ctx.bank).entries.length ? bankIndex(ctx.bank).join("\n") : "(empty: first mining run, use open names, every id is new)";
  const vars = {
    RUN: r.run.run, DATE: r.run.date, MODE: r.run.mode, RAW: ctx.raw, RUN_DIR: r.dir, BANK_DIR: ctx.bank,
    SHAPES: join(PROMPTS, "shapes.md"), BANK_README: join(ctx.bank, "README.md"), GLOSSARY: join(repoRoot, "GLOSSARY.md"),
    BANK_INDEX: index, CHANGES: join(r.dir, "changes.yaml"), DRAFTS: join(r.dir, "drafts"), VERDICTS: join(r.dir, "verdicts.yaml"),
  };
  if (stage === "tag") {
    const b = r.run.builds.find((x) => x.code === code && x.state !== "removed");
    if (!b) { out("error", `${code ?? "(none)"} is not tagged in run ${r.run.run}`); return 1; }
    Object.assign(vars, {
      CODE: code, VERSION: String(b.version), SCRUBBED: scrubbedDir(ctx.raw, code), TAGS: tagDir(ctx.raw, code),
      BUILD_KIND: isApp(code) ? appNote(code) : CLIENT_NOTE,
      AREAS: list(areaFiles(ctx.raw, code).map((a) => `\`${a.file}\` → \`${a.sheet}\` (area: ${a.area})`)),
    });
  } else {
    const codes = clusterBuilds(ctx.raw, r.run);
    Object.assign(vars, {
      BUILDS: list(r.run.builds.map((b) => `${b.code} ${b.state}`)),
      CLUSTER_BUILDS: codes.join(", ") || "(none)",
      TAG_SHEETS: list(codes.flatMap((c) => tagSheets(ctx.raw, c).map((s) => s.path))),
      USED_IDS: usedIds(ctx.bank).join(", ") || "(none)",
      SCRUBBED_DIRS: list(codes.map((c) => scrubbedDir(ctx.raw, c))),
      APP_BUILDS: codes.filter(isApp).map((c) => `${c} → APP-${c.slice(3)}`).join(", ") || "(none)",
    });
  }
  const tpl = readFileSync(join(PROMPTS, `${stage}.md`), "utf8");
  const missing = new Set();
  const text = tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in vars ? vars[k] : (missing.add(k), m)));
  if (missing.size) { out("error", `prompt ${stage}: unknown placeholder ${[...missing].join(", ")}`); return 1; }
  process.stdout.write(text.endsWith("\n") ? text : `${text}\n`);
  return 0;
}

const CLIENT_NOTE = "This is a client Neome Build (code NB-NN). Area sheets have no `gives` key.";
const appNote = (code) => [
  `This is a Neome App Build: Neomenta's own out-of-box build of the catalog Neome App \`${code.slice(3)}\` (code ${code}), not a client Build.`,
  "It is the App baseline: what the App gives before any configuration.",
  "- Every area sheet also has `gives:` (shape file): what the App does out of the box, one short line each, from the area file only. Non-empty unless `weight: low`.",
  "- Reuse Template bank names and IDs hard: this App's Patterns and Module shape should land on existing entries when they fit; `new` only when nothing fits.",
  "- `_build.yaml`: an App is one Module, so `template: null` unless the overview clearly shows a small enterprise.",
].join("\n");

// ---------- validate ----------

function validateTagsCmd(ctx) {
  const r = needRun(ctx);
  if (!r) return 1;
  const codes = ctx.pos.length ? ctx.pos : runTargets(r.run);
  if (ctx.pos.some((c) => !CODE.test(c))) return usage("Build codes look like NB-01");
  const { words } = scrubWords(ctx.raw);
  let bad = false;
  for (const code of codes) {
    const b = r.run.builds.find((x) => x.code === code);
    if (!b || b.state === "removed") { out("error", code, `not tagged in run ${r.run.run}`); bad = true; continue; }
    const v = validateTags(ctx.raw, code, ctx.bank, words);
    for (const e of v.errors) out("error", code, e);
    if (v.errors.length) { bad = true; rmSync(join(tagDir(ctx.raw, code), "sheets.json"), { force: true }); continue; }
    writeJson(join(tagDir(ctx.raw, code), "sheets.json"), { code, version: b.version, sheets: v.sheets });
    out("ok", code, `${v.sheets} sheets`);
  }
  return bad ? 1 : 0;
}

function draftsOf(dir, changes) {
  const m = new Map();
  for (const c of changes) {
    const { creates, keeps } = idsOf(c);
    for (const id of [...creates, ...keeps]) {
      const d = typeof id === "string" ? readDraft(dir, id) : null;
      if (d && !d.error) m.set(id, d);
    }
  }
  return m;
}

function checkChanges(ctx, r) {
  const c = readChanges(r.dir);
  if (c.error) return { errors: [c.error], warnings: [] };
  const missingTags = runTargets(r.run).filter((code) => !sheetsReady(ctx.raw, code));
  if (missingTags.length) return { errors: [`tag sheets not validated: ${missingTags.join(", ")} (run validate-tags)`], warnings: [] };
  const { words } = scrubWords(ctx.raw);
  const v = validateChanges(c.changes, { raw: ctx.raw, bankDir: ctx.bank, dir: r.dir, builds: clusterBuilds(ctx.raw, r.run), words });
  if (v.errors.length) return { ...v, changes: c.changes };
  const dry = applyChanges({ bankDir: ctx.bank, changes: c.changes, drafts: draftsOf(r.dir, c.changes), refresh: refreshBuilds(r.run), date: r.run.date, scrubWords: words, dryRun: true, ...ctx.checkOpts });
  return { errors: dry.errors.map((e) => `dry-run apply: ${e}`), warnings: [...v.warnings, ...dry.warnings.map((w) => `dry-run apply: ${w}`)], changes: c.changes };
}

function validateChangesCmd(ctx) {
  const r = needRun(ctx);
  if (!r) return 1;
  const v = checkChanges(ctx, r);
  for (const e of v.errors) out("error", e);
  for (const w of v.warnings) out("warning", w);
  if (!v.errors.length) out("ok", `${v.changes.length} changes`);
  return v.errors.length ? 1 : 0;
}

// ---------- decide / answer ----------

function decideCmd(ctx) {
  const r = needRun(ctx);
  if (!r) return 1;
  const v = checkChanges(ctx, r);
  if (v.errors.length) { for (const e of v.errors) out("error", e); return 1; }
  const vr = readVerdicts(r.dir);
  if (vr.error) { out("error", vr.error); return 1; }
  const vv = validateVerdicts(vr.verdicts, v.changes, scrubWords(ctx.raw).words);
  if (vv.errors.length) { for (const e of vv.errors) out("error", e); return 1; }
  const p = join(r.dir, "decisions.json");
  const before = existsSync(p) ? new Map(readJson(p).filter((d) => d.by === "maintainer").map((d) => [d.ref, d])) : new Map();
  const decisions = decide(v.changes, vr.verdicts).map((d) => (d.decision === "ask" && before.has(d.ref) ? { ...d, ...before.get(d.ref) } : d));
  writeJson(p, decisions);
  for (const d of decisions) {
    if (d.by === "review") out("auto", d.ref);
    else if (d.decision === "ask") out("ask", d.ref, d.why.join("; "), d.question);
    else out("answered", d.ref, d.decision);
  }
  const asks = decisions.filter((d) => d.decision === "ask").length;
  out("done", `${decisions.filter((d) => d.by === "review").length} auto, ${asks} ask`);
  return 0;
}

function answer(ctx) {
  const [ref, choice] = ctx.pos;
  if (!ref || !["apply", "drop"].includes(choice)) return usage('answer "<change> <ID>" apply|drop [--note <text>]');
  const r = needRun(ctx);
  if (!r) return 1;
  const p = join(r.dir, "decisions.json");
  if (!existsSync(p)) { out("error", "run decide first"); return 1; }
  const decisions = readJson(p);
  const d = decisions.find((x) => x.ref === ref);
  if (!d) { out("error", `no change ${ref}`); return 1; }
  if (d.by === "review") { out("error", `${ref} was auto-applied by review; nothing to answer`); return 1; }
  Object.assign(d, { decision: choice, by: "maintainer", ...(ctx.flags.note ? { answer: ctx.flags.note } : {}) });
  writeJson(p, decisions);
  out("answered", ref, choice);
  return 0;
}

// ---------- apply ----------

function apply(ctx) {
  const r = needRun(ctx);
  if (!r) return 1;
  if (existsSync(join(r.dir, "applied.json"))) { out("error", `run ${r.run.run} already applied`); return 1; }
  const p = join(r.dir, "decisions.json");
  if (!existsSync(p)) { out("error", "run decide first"); return 1; }
  const decisions = readJson(p);
  const open = decisions.filter((d) => d.decision === "ask");
  if (open.length) { for (const d of open) out("ask", d.ref, d.question); out("error", `${open.length} change(s) wait for the maintainer (answer)`); return 1; }
  const c = readChanges(r.dir);
  if (c.error) { out("error", c.error); return 1; }
  const byRef = new Map(decisions.map((d) => [d.ref, d]));
  const missing = c.changes.filter((x) => !byRef.has(refOf(x)));
  if (missing.length) { out("error", `changes.yaml changed after decide (${missing.map(refOf).join(", ")}): run decide again`); return 1; }
  const approved = c.changes.filter((x) => byRef.get(refOf(x)).decision === "apply");
  const { words, lists } = scrubWords(ctx.raw);
  const noList = runTargets(r.run).filter((code) => !isApp(code) && !lists.has(code));
  if (noList.length) { out("error", `no scrub word list for ${noList.join(", ")}`); return 1; }
  if (r.run.mode === "full" && !ctx.flags["confirm-retire"]) {
    const dry = applyChanges({ bankDir: ctx.bank, changes: approved, drafts: draftsOf(r.dir, approved), refresh: refreshBuilds(r.run), date: r.run.date, scrubWords: words, dryRun: true, ...ctx.checkOpts });
    const gone = dry.plan?.autoRetired ?? [];
    if (gone.length) {
      for (const id of gone) out("retire?", id, "--full: not re-listed by the cluster, seenIn hits zero");
      out("error", `${gone.length} entr(ies) would retire in a --full run: check them, then re-run apply --confirm-retire`);
      return 1;
    }
  }
  const res = applyChanges({ bankDir: ctx.bank, changes: approved, drafts: draftsOf(r.dir, approved), refresh: refreshBuilds(r.run), date: r.run.date, scrubWords: words, ...ctx.checkOpts });
  if (res.errors.length) { for (const e of res.errors) out("error", e); out("stop", "Template bank unchanged"); return 1; }
  for (const w of res.warnings) out("warning", w);
  const plan = res.plan;
  const applied = {
    applied: plan.applied.map((a) => ({ ...a, by: byRef.get(a.ref).by })),
    dropped: decisions.filter((d) => d.decision === "drop").map((d) => ({ ref: d.ref, why: d.answer ?? (d.why ?? []).join("; ") })),
    autoRetired: plan.autoRetired,
    rowsDropped: plan.rowsDropped,
    log: plan.log,
  };
  writeJson(join(r.dir, "applied.json"), applied);
  // Mark tagged Builds; move tag sheets of removed Builds out of the way.
  for (const b of r.run.builds) {
    const dir = tagDir(ctx.raw, b.code);
    if (b.state === "removed") {
      if (existsSync(dir)) {
        const dest = join(ctx.raw, "tags-old", `${b.code}-removed-${r.run.run}`);
        mkdirSync(dirname(dest), { recursive: true });
        renameSync(dir, dest);
      }
      continue;
    }
    const ready = sheetsReady(ctx.raw, b.code);
    writeJson(join(dir, "tagged.json"), { code: b.code, version: b.version, sheets: ready?.sheets ?? null, run: r.run.run });
  }
  for (const l of plan.log) out("applied", l);
  for (const id of plan.autoRetired) out("retired", id, "seenIn hit zero");
  out("done", `${plan.applied.length} applied, ${applied.dropped.length} dropped, ${plan.autoRetired.length} retired at zero, ${plan.log.length} CHANGELOG lines`);
  return 0;
}

// ---------- tokens ----------

const size = (p) => (existsSync(p) ? statSync(p).size : 0);
const dirSize = (d, re = /./) => (existsSync(d) ? readdirSync(d).filter((f) => re.test(f)).reduce((n, f) => n + size(join(d, f)), 0) : 0);

function estimate(ctx, r, stage, build) {
  const t = (chars) => Math.round(chars / 4);
  const prompt = size(join(PROMPTS, `${stage}.md`)) + size(join(PROMPTS, "shapes.md"));
  if (stage === "tag") {
    const areas = areaFiles(ctx.raw, build).length;
    const sd = scrubbedDir(ctx.raw, build);
    const inChars = prompt + size(join(sd, "overview.md")) * (areas + 1) + dirSize(sd, /\.md$/);
    return { in: t(inChars), out: t(dirSize(tagDir(ctx.raw, build), /\.yaml$/)) };
  }
  const sheets = clusterBuilds(ctx.raw, r.run).reduce((n, c) => n + dirSize(tagDir(ctx.raw, c), /\.yaml$/), 0);
  const bank = ["patterns", "template-modules", "templates", "apps"].reduce((n, f) => n + dirSize(join(ctx.bank, f)), 0) + size(join(ctx.bank, "README.md"));
  const changes = size(join(r.dir, "changes.yaml")) + dirSize(join(r.dir, "drafts"));
  if (stage === "cluster") return { in: t(prompt + sheets + bank), out: t(changes) };
  return { in: t(prompt + sheets + changes + bank), out: t(size(join(r.dir, "verdicts.yaml"))) };
}

function tokens(ctx) {
  const [stage, build] = ctx.pos;
  if (!["tag", "cluster", "review"].includes(stage) || !build) return usage("tokens <tag|cluster|review> <NB-NN|all> [--in n --out n]");
  if (stage === "tag" ? !CODE.test(build) : build !== "all") return usage("tag takes a Build code; cluster and review take all");
  const r = needRun(ctx);
  if (!r) return 1;
  const given = ctx.flags.in !== undefined && ctx.flags.out !== undefined;
  if (given && [ctx.flags.in, ctx.flags.out].some((x) => !/^\d+$/.test(x))) return usage("--in and --out are token counts");
  const n = given ? { in: Number(ctx.flags.in), out: Number(ctx.flags.out) } : estimate(ctx, r, stage, build);
  const row = [stage, build, n.in, n.out, given ? "reported" : "estimate", ctx.flags.provider ?? "-", ctx.flags.model ?? "-"];
  const p = join(r.dir, "tokens.tsv");
  if (!existsSync(p)) writeFileSync(p, "stage\tbuild\tin\tout\tsource\tprovider\tmodel\n");
  appendFileSync(p, `${row.join("\t")}\n`);
  out("tokens", ...row);
  return 0;
}

function readTokens(dir) {
  const p = join(dir, "tokens.tsv");
  if (!existsSync(p)) return [];
  const [head, ...rows] = readFileSync(p, "utf8").trim().split("\n");
  const keys = head.split("\t");
  return rows.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [keys[i], v])));
}

// ---------- check / report / commit ----------

function bankCheck(ctx) {
  const { words, lists } = scrubWords(ctx.raw);
  const r = checkBank(ctx.bank, { scrubWords: words, ...ctx.checkOpts });
  const errors = [...r.errors];
  const builds = new Set([...bankBuilds(ctx.bank)].filter((b) => !isApp(b))); // NA-: Neome-owned, no word list
  if (builds.size && !lists.size) errors.unshift(`no scrub word lists in ${join(ctx.raw, "scrub")}`);
  for (const b of [...builds].sort()) if (lists.size && !lists.has(b)) errors.push(`no scrub word list for ${b}`);
  return { errors, warnings: r.warnings, entries: loadBank(ctx.bank).entries.length };
}

function check(ctx) {
  const r = bankCheck(ctx);
  for (const e of r.errors) out("error", e);
  for (const w of r.warnings) out("warning", w);
  if (!r.errors.length) out("ok", "Template bank", `${r.entries} entries`);
  return r.errors.length ? 1 : 0;
}

function buildReport(ctx, r) {
  const applied = readJson(join(r.dir, "applied.json"));
  const c = bankCheck(ctx);
  applied.check = c.errors.length ? `${c.errors.length} error(s)` : "pass";
  return { text: renderReport({ run: r.run, applied, tokens: readTokens(r.dir) }), applied, check: c };
}

function report(ctx) {
  const r = needRun(ctx);
  if (!r) return 1;
  if (!existsSync(join(r.dir, "applied.json"))) { out("error", "run apply first"); return 1; }
  const { text, applied, check: c } = buildReport(ctx, r);
  const bad = leaks(text, scrubWords(ctx.raw).words);
  if (bad.length) { for (const l of bad) out("error", `report: ${l}`); return 1; }
  const p = join(r.dir, "report.md");
  writeFileSync(p, text);
  out("report", p, `${applied.applied.length} applied, ${applied.dropped.length} dropped, ${applied.autoRetired.length} retired at zero`, `check ${applied.check}`);
  for (const e of c.errors) out("error", e);
  return c.errors.length ? 1 : 0;
}

function git(cwd, ...args) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return { code: r.status, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim() };
}

function commit(ctx) {
  const r = needRun(ctx);
  if (!r) return 1;
  const ap = join(r.dir, "applied.json");
  if (!existsSync(ap)) { out("error", "run apply first"); return 1; }
  if (readJson(ap).commit) { out("error", `run ${r.run.run} already committed`); return 1; }
  const { text, applied, check: c } = buildReport(ctx, r);
  if (c.errors.length) { for (const e of c.errors) out("error", e); out("stop", "check failed: nothing committed"); return 1; }
  const msg = [`template-bank: refine ${r.run.run} (${applied.applied.length} changes)`, "", ...applied.log].join("\n") + "\n";
  const { words } = scrubWords(ctx.raw);
  const bad = [...leaks(text, words).map((l) => `report: ${l}`), ...leaks(msg, words).map((l) => `commit message: ${l}`)];
  if (bad.length) { for (const l of bad) out("error", l); out("stop", "scrub check failed: nothing committed"); return 1; }
  writeFileSync(join(r.dir, "report.md"), text);
  // The report ships with the commit (scrub-checked above): reports/<run>.md inside the Template bank folder.
  mkdirSync(join(ctx.bank, "reports"), { recursive: true });
  writeFileSync(join(ctx.bank, "reports", `${r.run.run}.md`), text);

  const top = git(ctx.bank, "rev-parse", "--show-toplevel");
  if (top.code !== 0) { out("error", "Template bank folder is not in a git repo"); return 1; }
  const root = top.out;
  const rel = relative(realpathSync(root), realpathSync(ctx.bank)) || ".";
  const staged = git(root, "diff", "--cached", "--name-only").out.split("\n").filter(Boolean);
  const outside = staged.filter((f) => !(f === rel || f.startsWith(`${rel}/`)));
  if (outside.length) { out("error", `${outside.length} staged file(s) outside the Template bank: unstage them first`); return 1; }
  const branch = `template-bank-refine-${r.run.run}`;
  const cur = git(root, "rev-parse", "--abbrev-ref", "HEAD").out;
  if (cur !== branch) {
    if (git(root, "rev-parse", "--verify", "--quiet", `refs/heads/${branch}`).code === 0) { out("error", `branch ${branch} exists: switch to it or remove it, then re-run commit`); return 1; }
    const sw = git(root, "switch", "-c", branch);
    if (sw.code !== 0) { out("error", `git switch -c ${branch}: ${sw.err}`); return 1; }
  }
  const add = git(root, "add", "-A", "--", rel);
  if (add.code !== 0) { out("error", `git add: ${add.err}`); return 1; }
  if (!git(root, "diff", "--cached", "--name-only").out) { out("nothing", "no Template bank change to commit"); return 0; }
  const cm = spawnSync("git", ["commit", "-q", "-F", "-"], { cwd: root, input: msg, encoding: "utf8" });
  if (cm.status !== 0) { out("error", `git commit: ${(cm.stderr ?? "").trim()}`); return 1; }
  const sha = git(root, "rev-parse", "--short", "HEAD").out;
  writeJson(ap, { ...readJson(ap), commit: sha, branch });
  out("commit", branch, sha);
  out("next", "maintainer skims the report and merges; this tool never merges or pushes");
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
