import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BANK_DIR, loadBank, checkBank, replacedBy, checkTemplateRef } from "../template-bank.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const FIX = join(here, "fixtures", "template-bank");
const GOOD = join(FIX, "good");
const SLUGS = join(FIX, "catalog-slugs.json");
const cli = join(here, "..", "cli.mjs");

// Copy of the good fixture bank in a temp dir, ready to break.
function bankCopy() {
  const dir = join(mkdtempSync(join(tmpdir(), "neome-bank-")), "template-bank");
  cpSync(GOOD, dir, { recursive: true });
  return dir;
}
const edit = (dir, rel, fn) => writeFileSync(join(dir, rel), fn(readFileSync(join(dir, rel), "utf8")));
const check = (dir, opts = {}) => checkBank(dir, { catalogSlugsPath: SLUGS, ...opts });
const TMOD = "template-modules/TMOD-widgets.md";
const PAT = "patterns/PAT-sign-off-by-flag.md";
const TPL = "templates/TPL-widget-shop.md";

function assertError(r, re) {
  assert.ok(r.errors.some((e) => re.test(e)), `no error matching ${re}; got:\n${r.errors.join("\n")}`);
}

// --- loadBank ---

test("BANK_DIR points at the plugin's reference/template-bank", () => {
  assert.equal(BANK_DIR, join(here, "..", "..", "reference", "template-bank"));
});

test("loadBank reads every entry with kind, front matter, body, file", () => {
  const { entries } = loadBank(GOOD);
  const ids = entries.map((e) => e.id).sort();
  assert.deepEqual(ids, ["PAT-sign-off-by-flag", "TMOD-gizmos", "TMOD-widgets", "TPL-widget-shop"]);
  const tmod = entries.find((e) => e.id === "TMOD-widgets");
  assert.equal(tmod.kind, "template-module");
  assert.equal(tmod.fm.neomeApp, "widget-desk");
  assert.match(tmod.body, /^# Widgets/m);
  assert.equal(tmod.file, join(GOOD, TMOD));
  assert.equal(entries.find((e) => e.id === "PAT-sign-off-by-flag").kind, "pattern");
  assert.equal(entries.find((e) => e.id === "TPL-widget-shop").kind, "template");
});

test("loadBank parses CHANGELOG lines, skips text and fenced blocks", () => {
  const { changelog } = loadBank(GOOD);
  assert.equal(changelog.length, 10);
  assert.deepEqual(changelog[0], { date: "2026-01-01", change: "add", ids: ["PAT-sign-off-by-flag"], replacedBy: null, reason: "seen in NB-90, NB-91" });
  assert.deepEqual(changelog[1].ids, ["TMOD-widget-requests", "TMOD-widgets"]);
  const split = changelog.find((c) => c.change === "split");
  assert.deepEqual(split.ids, ["TMOD-old-things"]);
  assert.deepEqual(split.replacedBy, ["TMOD-things-a", "TMOD-gizmos"]);
  const retire = changelog.find((c) => c.change === "retire");
  assert.deepEqual(retire.replacedBy, []);
  assert.equal(changelog.find((c) => c.change === "enhance").reason, "more usual needs | with a pipe");
});

test("loadBank on a missing or empty Template bank gives empty lists", () => {
  const dir = mkdtempSync(join(tmpdir(), "neome-bank-"));
  assert.deepEqual(loadBank(join(dir, "nope")), { entries: [], changelog: [] });
  for (const d of ["patterns", "template-modules", "templates"]) mkdirSync(join(dir, d));
  writeFileSync(join(dir, "patterns", ".gitkeep"), "");
  assert.deepEqual(loadBank(dir), { entries: [], changelog: [] });
});

// --- checkBank: passes ---

test("good fixture Template bank passes with no errors or warnings", () => {
  assert.deepEqual(check(GOOD), { errors: [], warnings: [] });
});

test("empty Template bank passes", () => {
  const dir = mkdtempSync(join(tmpdir(), "neome-bank-"));
  for (const d of ["patterns", "template-modules", "templates"]) mkdirSync(join(dir, d));
  writeFileSync(join(dir, "CHANGELOG.md"), "# Template bank changelog\n");
  assert.deepEqual(check(dir), { errors: [], warnings: [] });
});

test("real Template bank in the plugin passes", () => {
  const r = checkBank(BANK_DIR);
  assert.deepEqual(r.errors, []);
});

// --- checkBank: errors ---

test("front matter missing or not YAML", () => {
  const dir = bankCopy();
  edit(dir, PAT, (t) => t.replace(/^---\n[\s\S]*?\n---\n/, ""));
  edit(dir, TPL, (t) => t.replace("name: Small widget shop", "name: [oops"));
  const r = check(dir);
  assertError(r, /PAT-sign-off-by-flag\.md: front matter missing/);
  assertError(r, /TPL-widget-shop\.md: front matter is not valid YAML/);
});

test("required front matter fields per kind", () => {
  const dir = bankCopy();
  edit(dir, PAT, (t) => t.replace("workaround: true\n", "").replace("name: Sign-off by flag\n", ""));
  edit(dir, TMOD, (t) => t.replace("aliases: [Widgets, WidgetRequests]\n", "").replace("delivery: configuration\n", ""));
  edit(dir, TPL, (t) => t.replace("businessType: Small shop that hands out widgets\n", ""));
  const r = check(dir);
  assertError(r, /PAT-sign-off-by-flag: name missing/);
  assertError(r, /PAT-sign-off-by-flag: workaround must be true or false/);
  assertError(r, /TMOD-widgets: aliases must be a list/);
  assertError(r, /TMOD-widgets: delivery must be one of standard, configuration, custom/);
  assertError(r, /TPL-widget-shop: businessType missing/);
});

test("wrong-typed fields fail", () => {
  const dir = bankCopy();
  edit(dir, TMOD, (t) => t.replace("patterns: [PAT-sign-off-by-flag]", "patterns: PAT-sign-off-by-flag").replace("delivery: configuration", "delivery: Bespoke"));
  edit(dir, TPL, (t) => t.replace("  core: [TMOD-widgets]\n", "  core: []\n").replace("  optional: [TMOD-gizmos]", "  optional: TMOD-gizmos"));
  const r = check(dir);
  assertError(r, /TMOD-widgets: patterns must be a list/);
  assertError(r, /TMOD-widgets: delivery must be one of/);
  assertError(r, /TPL-widget-shop: modules\.core must be a non-empty list/);
  assertError(r, /TPL-widget-shop: modules\.optional must be a list/);
});

test("kind in front matter must match folder", () => {
  const dir = bankCopy();
  edit(dir, PAT, (t) => t.replace("kind: pattern", "kind: template"));
  assertError(check(dir), /PAT-sign-off-by-flag: kind "template" does not match folder patterns/);
});

test("required body sections and mermaid flowchart", () => {
  const dir = bankCopy();
  edit(dir, PAT, (t) => t.replace("## Limits\n", "## Caveats\n"));
  edit(dir, TMOD, (t) => t.replace(/```mermaid[\s\S]*?```\n/, "See picture.\n"));
  edit(dir, TPL, (t) => t.replace("## Links between modules\n", ""));
  const r = check(dir);
  assertError(r, /PAT-sign-off-by-flag: body section "## Limits" missing/);
  assertError(r, /TMOD-widgets: Flowchart has no mermaid block/);
  assertError(r, /TPL-widget-shop: body section "## Links between modules" missing/);
});

test("file name must equal id", () => {
  const dir = bankCopy();
  edit(dir, TMOD, (t) => t.replace("id: TMOD-widgets", "id: TMOD-widget"));
  assertError(check(dir), /TMOD-widgets\.md: id "TMOD-widget" does not match file name/);
});

test("id prefix must match folder, slug must be lowercase words", () => {
  const dir = bankCopy();
  rmSync(join(dir, PAT));
  writeFileSync(join(dir, "patterns", "TMOD-stray.md"), readFileSync(join(GOOD, PAT), "utf8").replace("id: PAT-sign-off-by-flag", "id: TMOD-stray"));
  writeFileSync(join(dir, "patterns", "PAT-01.md"), readFileSync(join(GOOD, PAT), "utf8").replace("id: PAT-sign-off-by-flag", "id: PAT-01"));
  writeFileSync(join(dir, "patterns", "PAT-Big_One.md"), readFileSync(join(GOOD, PAT), "utf8").replace("id: PAT-sign-off-by-flag", "id: PAT-Big_One"));
  const r = check(dir);
  assertError(r, /TMOD-stray: id must look like PAT-<slug> in patterns/);
  assertError(r, /PAT-01: id must look like PAT-<slug> in patterns/);
  assertError(r, /PAT-Big_One: id must look like PAT-<slug> in patterns/);
});

test("ids must be unique", () => {
  const dir = bankCopy();
  cpSync(join(dir, PAT), join(dir, "templates", "PAT-sign-off-by-flag.md"));
  assertError(check(dir), /PAT-sign-off-by-flag: id used by more than one file/);
});

test("PAT- and TMOD- references must resolve", () => {
  const dir = bankCopy();
  edit(dir, TMOD, (t) => t.replace("patterns: [PAT-sign-off-by-flag]", "patterns: [PAT-sign-off-by-flag, PAT-ghost]"));
  edit(dir, TPL, (t) => t.replace("optional: [TMOD-gizmos]", "optional: [TMOD-gizmos, TMOD-ghost, PAT-sign-off-by-flag]"));
  const r = check(dir);
  assertError(r, /TMOD-widgets: patterns: PAT-ghost not in Template bank/);
  assertError(r, /TPL-widget-shop: modules\.optional: TMOD-ghost not in Template bank/);
  assertError(r, /TPL-widget-shop: modules\.optional: PAT-sign-off-by-flag is not a Template module/);
});

test("neomeApp must be a catalog slug or none", () => {
  const dir = bankCopy();
  edit(dir, TMOD, (t) => t.replace("neomeApp: widget-desk", "neomeApp: widget-palace"));
  edit(dir, "template-modules/TMOD-gizmos.md", (t) => t.replace("neomeApp: none\n", ""));
  const r = check(dir);
  assertError(r, /TMOD-widgets: neomeApp "widget-palace" not in Neome App catalog slugs/);
  assertError(r, /TMOD-gizmos: neomeApp must be a catalog slug or none/);
});

test("seenIn rows must be {build: NB-NN, area}", () => {
  const dir = bankCopy();
  edit(dir, PAT, (t) => t.replace("{build: NB-90, area: Widgets}", "{build: Acme, area: Widgets}").replace("{build: NB-91, area: Widgets}", "{build: NB-91}"));
  edit(dir, TPL, (t) => t.replace('  - {build: NB-90, area: "*"}\n', "").replace("seenIn:\n", "seenIn: []\n"));
  edit(dir, TMOD, (t) => t.replace("{build: NB-90, area: Widgets}", "{build: NB-90, area: Widgets, client: x}"));
  const r = check(dir);
  assertError(r, /PAT-sign-off-by-flag: seenIn row 1: build "Acme" must look like NB-NN/);
  assertError(r, /PAT-sign-off-by-flag: seenIn row 2: area missing/);
  assertError(r, /TPL-widget-shop: seenIn must be a non-empty list/);
  assertError(r, /TMOD-widgets: seenIn row 1: unknown key client/);
});

test("scrub word anywhere in an entry or CHANGELOG fails, any case", () => {
  const dir = bankCopy();
  edit(dir, TMOD, (t) => t.replace("- Checker ticks done.", "- Checker at FooCorp ticks done."));
  edit(dir, "CHANGELOG.md", (t) => t + "- 2026-01-08 | enhance | TMOD-gizmos | asked by jane roe\n");
  const r = check(dir, { scrubWords: ["foocorp", "Jane Roe", "  ", ""] });
  assertError(r, /TMOD-widgets: scrub word "foocorp" found/);
  assertError(r, /CHANGELOG\.md: scrub word "Jane Roe" found/);
  assert.equal(r.errors.length, 2, r.errors.join("\n"));
});

test("bad CHANGELOG lines fail", () => {
  const dir = bankCopy();
  edit(dir, "CHANGELOG.md", (t) => t + [
    "- 2026-1-8 | add | TMOD-gizmos | bad date",
    "- 2026-01-08 | adopt | TMOD-gizmos | bad change kind",
    "- 2026-01-08 | merge | TMOD-gizmos | merge needs ->",
    "- 2026-01-08 | retire | PAT-x -> PAT-y | retire takes no ->",
    "- 2026-01-08 | add | TMOD-gizmos |",
    "- 2026-01-08 | add | gizmos | not an id",
    "",
  ].join("\n"));
  const r = check(dir);
  assertError(r, /CHANGELOG\.md line \d+: date must be YYYY-MM-DD/);
  assertError(r, /CHANGELOG\.md line \d+: change "adopt" must be one of add, enhance, split, merge, rename, retire/);
  assertError(r, /CHANGELOG\.md line \d+: merge needs "old -> new"/);
  assertError(r, /CHANGELOG\.md line \d+: retire takes no "->"/);
  assertError(r, /CHANGELOG\.md line \d+: reason missing/);
  assertError(r, /CHANGELOG\.md line \d+: "gizmos" is not a Template bank ID/);
});

test("replaced or retired ID still on file fails: IDs never reused", () => {
  const dir = bankCopy();
  edit(dir, "CHANGELOG.md", (t) => t + "- 2026-01-08 | retire | TMOD-gizmos | gone\n");
  edit(dir, TPL, (t) => t.replace("optional: [TMOD-gizmos]", "optional: []"));
  assertError(check(dir), /TMOD-gizmos: retired or replaced in CHANGELOG\.md but file still there/);
});

test("replacedBy target that is not in Template bank and not replaced again warns", () => {
  const dir = bankCopy();
  edit(dir, "CHANGELOG.md", (t) => t + "- 2026-01-08 | rename | TMOD-zed -> TMOD-zed-two | typo\n");
  const r = check(dir);
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => /TMOD-zed-two/.test(w)), r.warnings.join("\n"));
});

// --- replacedBy ---

test("replacedBy gives direct new IDs, [] for retired, null when never replaced", () => {
  assert.deepEqual(replacedBy(GOOD, "TMOD-widget-requests"), ["TMOD-widgets"]);
  assert.deepEqual(replacedBy(GOOD, "TMOD-old-things"), ["TMOD-things-a", "TMOD-gizmos"]);
  assert.deepEqual(replacedBy(GOOD, "PAT-dusty"), []);
  assert.equal(replacedBy(GOOD, "TMOD-widgets"), null);
  assert.equal(replacedBy(GOOD, "TMOD-never-heard"), null);
});

// --- checkTemplateRef ("ID gone" warning) ---

test("checkTemplateRef: live ID and none are ok", () => {
  assert.deepEqual(checkTemplateRef(GOOD, "TMOD-widgets"), { ok: true });
  assert.deepEqual(checkTemplateRef(GOOD, "TPL-widget-shop"), { ok: true });
  assert.deepEqual(checkTemplateRef(GOOD, "none"), { ok: true });
});

test("checkTemplateRef: merged ID gone → warning suggesting the kept ID", () => {
  const r = checkTemplateRef(GOOD, "TMOD-widget-requests");
  assert.equal(r.ok, false);
  assert.equal(r.level, "warning");
  assert.deepEqual(r.suggest, ["TMOD-widgets"]);
  assert.match(r.message, /TMOD-widget-requests/);
  assert.match(r.message, /TMOD-widgets/);
});

test("checkTemplateRef: follows replacedBy chains to live IDs", () => {
  const r = checkTemplateRef(GOOD, "TMOD-old-things");
  assert.equal(r.level, "warning");
  assert.deepEqual(r.suggest, ["TMOD-widgets", "TMOD-gizmos"]);
});

test("checkTemplateRef: retired or unknown ID → warning, nothing to suggest", () => {
  for (const id of ["PAT-dusty", "TMOD-never-heard"]) {
    const r = checkTemplateRef(GOOD, id);
    assert.equal(r.ok, false);
    assert.equal(r.level, "warning");
    assert.deepEqual(r.suggest, []);
    assert.match(r.message, new RegExp(id));
  }
});

// --- wired into `cli check` ---

function pluginWithBank(bankDir) {
  const root = mkdtempSync(join(tmpdir(), "neome-check-"));
  mkdirSync(join(root, "skills", "ingest"), { recursive: true });
  writeFileSync(join(root, "skills", "ingest", "SKILL.md"), "---\nname: ingest\ndescription: x\n---\n\n# Skill\n");
  mkdirSync(join(root, "reference"));
  cpSync(SLUGS, join(root, "reference", "neome-app-catalog-slugs.json"));
  if (bankDir) cpSync(bankDir, join(root, "reference", "template-bank"), { recursive: true });
  return root;
}
const cliCheck = (root, env = {}) => {
  const r = spawnSync(process.execPath, [cli, "check", root], { encoding: "utf8", env: { ...process.env, ...env } });
  return { code: r.status, out: r.stdout + r.stderr };
};

test("cli check runs Template bank checks and fails on errors", () => {
  const dir = bankCopy();
  edit(dir, TMOD, (t) => t.replace("neomeApp: widget-desk", "neomeApp: widget-palace"));
  const r = cliCheck(pluginWithBank(dir));
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /template-bank: TMOD-widgets: neomeApp "widget-palace"/);
});

test("cli check passes on a good Template bank and without one", () => {
  const ok = cliCheck(pluginWithBank(GOOD));
  assert.equal(ok.code, 0, ok.out);
  assert.match(ok.out, /Template bank 4 entries OK/);
  assert.equal(cliCheck(pluginWithBank(null)).code, 0);
});

test("cli check reads scrub words from NEOME_SCRUB_DIR", () => {
  const scrub = mkdtempSync(join(tmpdir(), "neome-scrub-"));
  writeFileSync(join(scrub, "NB-90.txt"), "# made-up words\n\nGizmo\n");
  const r = cliCheck(pluginWithBank(GOOD), { NEOME_SCRUB_DIR: scrub });
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /scrub word "Gizmo" found/);
  assert.ok(existsSync(scrub));
});
