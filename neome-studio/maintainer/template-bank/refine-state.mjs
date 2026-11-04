// Template bank refine tool: where things live in the raw dir, which Builds are new / updated / removed, runs, scrub
// words. Spec: Template bank §7; ticket .scratch/template-bank/issues/09-bank-refine-skill.md.
//
// <raw>/ (gitignored, client data; never committed)
//   *.json                       Neome Build JSON (dropped by the maintainer)
//   neome-template/*.json        Neome App Build JSON + app-slugs.txt (apps.mjs); code NA-<catalog slug>
//   builds.json                  Build code → {entId, name}            (digest.mjs)
//   digests/<NB-NN>/             unscrubbed digest + meta.json          (digest.mjs; never shown to a model)
//   scrub/<NB-NN>.txt            scrub word list                        (scrub.mjs seeds, maintainer adds; none for NA-)
//   scrubbed/<NB-NN>/            scrubbed digest                        (scrub.mjs; the only digest a model reads)
//   tags/<NB-NN>/<area>.yaml     tag sheet per Build area, _build.yaml for the overview (tag child; kept for good)
//   tags/<NB-NN>/sheets.json     {code, version, sheets} written by validate-tags: sheets ready, not yet applied
//   tags/<NB-NN>/tagged.json     {code, version, sheets, run} written by apply: the Template bank holds this version
//   tags-old/<NB-NN>-v<n>/       tag sheets of an older version of an updated Build
//   runs/<run>/run.json          {run, date, mode, builds: [{code, state, version, areas}]}  (prepare)
//   runs/<run>/changes.yaml      change list (cluster child)   runs/<run>/drafts/<ID>.md  entry drafts (cluster child)
//   runs/<run>/verdicts.yaml     review verdicts (review child)
//   runs/<run>/decisions.json    auto / ask / maintainer answers (decide, answer)
//   runs/<run>/applied.json      what apply did             runs/<run>/report.md     report
//   runs/<run>/tokens.tsv        tokens per stage per Build
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parse } from "yaml";
import { parseBuild, pickBuilds, versionId } from "./build-json.mjs";
import { parseWordList } from "./scrub.mjs";
import { BUILD_CODE, loadBank } from "../../engine/template-bank.mjs";
import { appBuilds } from "./apps.mjs";

/** Build code: NB-NN (client Neome Build) or NA-<catalog slug> (Neome App Build). */
export const CODE = BUILD_CODE;
export const BUILD_SHEET = "_build.yaml";
export const ORPHANS = "Orphans (maybe dead)";

const readJson = (p, fallback = null) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback);
export const readYaml = (p) => parse(readFileSync(p, "utf8"));
const dirs = (p, re) => (existsSync(p) ? readdirSync(p).filter((d) => re.test(d)).sort() : []);

export const tagDir = (raw, code) => join(raw, "tags", code);
export const scrubbedDir = (raw, code) => join(raw, "scrubbed", code);
export const runDir = (raw, run) => join(raw, "runs", run);

/** Build JSON in raw: [{file, entId, version}] after dedupe (newest version per entId). Names never returned. */
export function rawBuilds(raw) {
  const files = existsSync(raw) ? readdirSync(raw).filter((f) => f.endsWith(".json") && f !== "builds.json").sort() : [];
  const entries = [];
  const unreadable = [];
  for (const file of files) {
    try { entries.push({ file, ent: parseBuild(readFileSync(join(raw, file), "utf8")) }); }
    catch { unreadable.push(file); }
  }
  const { builds } = pickBuilds(entries);
  return { builds: builds.map((b) => ({ file: b.file, entId: b.ent.entId, version: versionId(b.ent) })), unreadable };
}

/** {code, version, sheets} of the last validated tagging, or null. */
export const tagged = (raw, code) => readJson(join(tagDir(raw, code), "tagged.json"));

/** Build codes named in any seenIn row of the Template bank. */
export function bankBuilds(bankDir) {
  const out = new Set();
  for (const e of loadBank(bankDir).entries) for (const r of Array.isArray(e.fm.seenIn) ? e.fm.seenIn : []) if (r?.build) out.add(String(r.build));
  return out;
}

/**
 * Per Build: state new | updated | current | removed.
 *   new      JSON in raw, never tagged (code may be null before the first digest)
 *   updated  JSON version differs from the tagged version
 *   current  tagged at the JSON version
 *   removed  tagged or in Template bank seenIn, but no JSON in raw any more
 * Neome App Builds (<raw>/neome-template/) get rows too, code NA-<slug> from app-slugs.txt. `problems` (unknown
 * App name, bad app-slugs.txt line) = hard stop for the caller; those Builds get no row.
 */
export function buildStatus(raw, bankDir, catalogPath) {
  const reg = readJson(join(raw, "builds.json"), {});
  const codeOf = new Map(Object.entries(reg).map(([c, v]) => [v.entId, c]));
  const { builds, unreadable } = rawBuilds(raw);
  const rows = [];
  const seen = new Set();
  for (const b of builds) {
    const code = codeOf.get(b.entId) ?? null;
    if (code) seen.add(code);
    const t = code ? tagged(raw, code) : null;
    const state = !t ? "new" : String(t.version) !== b.version ? "updated" : "current";
    rows.push({ code, state, version: b.version, taggedVersion: t ? String(t.version) : null, file: b.file });
  }
  const apps = appBuilds(raw, ...(catalogPath ? [catalogPath] : []));
  for (const b of apps.builds) {
    seen.add(b.code);
    const t = tagged(raw, b.code);
    const state = !t ? "new" : String(t.version) !== b.version ? "updated" : "current";
    rows.push({ code: b.code, state, version: b.version, taggedVersion: t ? String(t.version) : null, file: b.file, app: true });
  }
  unreadable.push(...apps.unreadable);
  const gone = new Set([...dirs(join(raw, "tags"), CODE).filter((c) => tagged(raw, c)), ...bankBuilds(bankDir)]);
  for (const code of [...gone].sort()) {
    if (!seen.has(code)) rows.push({ code, state: "removed", version: null, taggedVersion: tagged(raw, code)?.version ?? null, file: null, app: code.startsWith("NA-") });
  }
  return { rows, unreadable, problems: apps.problems };
}

/** Area files of a scrubbed Build: [{file, area, sheet}] (overview excluded). Area name from "# Build area: <name>". */
export function areaFiles(raw, code) {
  const dir = scrubbedDir(raw, code);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "overview.md")
    .sort()
    .map((file) => {
      const head = readFileSync(join(dir, file), "utf8").match(/^# Build area: (.+)$/m);
      return { file, area: head ? head[1].trim() : basename(file, ".md"), sheet: `${basename(file, ".md")}.yaml` };
    });
}

/** Tag sheets of one Build: [{sheet, path, text, data|null, error}]. */
export function tagSheets(raw, code) {
  const dir = tagDir(raw, code);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort().map((sheet) => {
    const path = join(dir, sheet);
    const text = readFileSync(path, "utf8");
    try { return { sheet, path, text, data: parse(text), error: null }; }
    catch (e) { return { sheet, path, text, data: null, error: e.message.split("\n")[0] }; }
  });
}

/** Runs, oldest first. */
export const runs = (raw) => dirs(join(raw, "runs"), /^\d{4}-\d{2}-\d{2}(-\d+)?$/);

/** Next free run id for a date: 2026-11-03, then 2026-11-03-2 … */
export function nextRun(raw, date) {
  const have = new Set(runs(raw));
  if (!have.has(date)) return date;
  let n = 2;
  while (have.has(`${date}-${n}`)) n++;
  return `${date}-${n}`;
}

/** run.json of a run (default: latest), or an error. */
export function loadRun(raw, run) {
  const id = run ?? runs(raw).at(-1);
  if (!id) return { error: "no run yet: run prepare first" };
  const p = join(runDir(raw, id), "run.json");
  if (!existsSync(p)) return { error: `run ${id} not found` };
  return { run: readJson(p), dir: runDir(raw, id) };
}

/** {code, version, sheets} of tag sheets validated but not yet applied, or null. */
export const sheetsReady = (raw, code) => readJson(join(tagDir(raw, code), "sheets.json"));

/** Builds this run tags (new / updated). */
export const runTargets = (run) => run.builds.filter((b) => b.state === "new" || b.state === "updated").map((b) => b.code);

/** Builds whose tag sheets the cluster reads: this run's (incremental) or every tagged Build (full). */
export function clusterBuilds(raw, run) {
  const targets = runTargets(run);
  if (run.mode !== "full") return targets;
  const gone = new Set(run.builds.filter((b) => b.state === "removed").map((b) => b.code));
  return [...new Set([...dirs(join(raw, "tags"), CODE).filter((c) => tagged(raw, c)), ...targets])].filter((c) => !gone.has(c)).sort();
}

/** Builds whose old seenIn rows apply drops before adding this run's rows. */
export const refreshBuilds = (run) => (run.mode === "full" ? null : run.builds.map((b) => b.code));

/**
 * Scrub words for the Template bank check: every <raw>/scrub/<NB-NN>.txt + Build names from builds.json.
 * {words, lists: Set<code>}.
 */
export function scrubWords(raw) {
  const dir = join(raw, "scrub");
  const words = [];
  const lists = new Set();
  for (const f of dirs(dir, /^NB-\d+\.txt$/)) {
    lists.add(f.slice(0, -4));
    words.push(...parseWordList(readFileSync(join(dir, f), "utf8")));
  }
  for (const v of Object.values(readJson(join(raw, "builds.json"), {}))) if (v?.name && String(v.name).trim().length >= 3) words.push(String(v.name).trim());
  return { words: [...new Set(words)], lists };
}

/** Text holds a scrub word (case-insensitive)? Returns the word's number in the list (never the word), or 0. */
export function scrubHit(text, words) {
  const lower = String(text).toLowerCase();
  const i = words.findIndex((w) => w && lower.includes(w.toLowerCase()));
  return i + 1;
}
