// Eval features for the Template bank (template-bank effort, ticket 10 / build slice 6): golden `forbidden` +
// hard gate `forbidden`, mechanic `absent`, glob paths in `text`, `owner` on `oi`, the case-owned fixture
// Template bank swapped into the clones by prepare, and the guarded hook to the bank checks (checkBank).
// No LLM, no network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { computeMetrics, judgeProblems, runMechanics, verdict, readThresholds, HARD } from "../../evals/lib/scorecard.mjs";
import { bankChecks, caseDir, loadCase } from "../../evals/lib/case.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, "..", "..");
const repo = join(plugin, "..");
const evals = join(plugin, "evals");
const tool = join(evals, "run.mjs");
const CASE = join(evals, "template-hr-small");
const BANK_MODULE = join(plugin, "engine", "template-bank.mjs");

const box = () => mkdtempSync(join(tmpdir(), "neome-eval-tb-test-"));
function run(args, env = {}) {
  const r = spawnSync(process.execPath, [tool, ...args], { encoding: "utf8", cwd: repo, env: { ...process.env, ...env } });
  return { code: r.status, out: r.stdout + r.stderr, lines: r.stdout.trim().split("\n") };
}
function gitEnv(dir) {
  const global = join(dir, ".gitconfig-test");
  if (!existsSync(global)) writeFileSync(global, "");
  return { GIT_CONFIG_GLOBAL: global, GIT_CONFIG_NOSYSTEM: "1" };
}
function write(root, rel, text) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
}
const files = (dir, base = "") =>
  readdirSync(join(dir, base), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(dir, join(base, e.name)) : [join(base, e.name)],
  ).sort();

// ---------- mechanic `absent` ----------

const actualOk = { missing: false, ois: [], reqs: [], modules: [], versions: {} };
const BANK_RE = "TPL-|TMOD-|PAT-|NB-\\d|[Ss]een in";
const absent = { id: "no-bank-ids", what: "No Template bank IDs in views", type: "absent", paths: ["brd/**", "prototypes/**", "questionnaires/**"], pattern: BANK_RE };

test("absent: passes when no file under the paths matches; names the scanned count", () => {
  const eng = box();
  write(eng, "brd/preview.html", "<p>Leave requests need manager approval.</p>");
  write(eng, "questionnaires/QN-2026-11-03.txt", "1. Can unused annual leave carry over?");
  write(eng, "prototypes/LV-leave.html", "<div>Leave</div>");
  write(eng, "_agent/modules/LV-leave/ticket.md", "templateModule: TMOD-leave\n"); // agent side: not scanned
  const [r] = runMechanics([absent], { engDir: eng, actual: actualOk, clone: eng });
  assert.equal(r.pass, true, r.detail);
  assert.match(r.detail, /0 match\(es\) in 3 file\(s\)/);
});

test("absent: any match in any path fails and names file and hit; nested folders are scanned", () => {
  const eng = box();
  write(eng, "brd/preview.html", "<p>Usual for Leave (seen in 3 Builds)</p>");
  write(eng, "prototypes/LV-leave.html", "<div>TMOD-leave</div>");
  write(eng, "questionnaires/sub/QN-1.txt", "From NB-04");
  write(eng, "brd/v1.html", "clean");
  const [r] = runMechanics([absent], { engDir: eng, actual: actualOk, clone: eng });
  assert.equal(r.pass, false);
  for (const s of ["brd/preview.html: seen in", "prototypes/LV-leave.html: TMOD-", "questionnaires/sub/QN-1.txt: NB-0"]) assert.ok(r.detail.includes(s), r.detail);
  assert.ok(!r.detail.includes("brd/v1.html"), r.detail);
});

test("absent: nothing to scan fails (a missing view must not pass by default)", () => {
  const eng = box();
  mkdirSync(join(eng, "_agent"));
  const [r] = runMechanics([absent], { engDir: eng, actual: actualOk, clone: eng });
  assert.equal(r.pass, false);
  assert.match(r.detail, /no file matches brd\/\*\*, prototypes\/\*\*, questionnaires\/\*\*/);
});

test("absent: multiline pattern on one file (no Attendance Module row in the map)", () => {
  const eng = box();
  write(eng, "_agent/map.md", "| Prefix | Module | Status |\n|---|---|---|\n| LV | Leave | resolved |\n| EMP | Employee master | open |\n\n- Attendance: dropped (Consultant said no)\n");
  const m = { id: "no-att", what: "no Attendance Module", type: "absent", paths: ["_agent/map.md"], pattern: "^\\|\\s*[A-Z]{2,5}\\s*\\|\\s*Attendance" };
  assert.equal(runMechanics([m], { engDir: eng, actual: actualOk, clone: eng })[0].pass, true);
  write(eng, "_agent/map.md", "| ATT | Attendance | open |\n");
  assert.equal(runMechanics([m], { engDir: eng, actual: actualOk, clone: eng })[0].pass, false);
});

// ---------- `text` with a glob path, `oi` owner ----------

test("text: a glob path passes when any matching file matches; plain paths work as before", () => {
  const eng = box();
  write(eng, "_agent/modules/LV-leave-requests/ticket.md", "---\nstatus: resolved\ntemplateModule: TMOD-leave\n---\n");
  write(eng, "_agent/modules/VIS-visitor-log/ticket.md", "---\nstatus: open\ntemplateModule: none\n---\n");
  write(eng, "_agent/map.md", "---\ntemplate: TPL-hr-small\n---\n");
  const ms = [
    { id: "lv", what: "x", type: "text", path: "_agent/modules/*leave*/ticket.md", pattern: "^templateModule:\\s*TMOD-leave\\s*$" },
    { id: "vis", what: "x", type: "text", path: "_agent/modules/*visitor*/ticket.md", pattern: "^templateModule:\\s*TMOD-leave\\s*$" },
    { id: "exp", what: "x", type: "text", path: "_agent/modules/*expense*/ticket.md", pattern: "^status:" },
    { id: "map", what: "x", type: "text", path: "_agent/map.md", pattern: "^template:\\s*TPL-hr-small\\s*$" },
  ];
  const r = Object.fromEntries(runMechanics(ms, { engDir: eng, actual: actualOk, clone: eng }).map((x) => [x.id, x]));
  assert.equal(r.lv.pass, true, r.lv.detail);
  assert.match(r.lv.detail, /_agent\/modules\/LV-leave-requests\/ticket\.md matches/);
  assert.equal(r.vis.pass, false);
  assert.equal(r.exp.pass, false);
  assert.match(r.exp.detail, /no file matches _agent\/modules\/\*expense\*\/ticket\.md/);
  assert.equal(r.map.pass, true);
});

test("oi: owner filter (Delivery mismatch Open Item owned by Neomenta)", () => {
  const actual = {
    ...actualOk,
    ois: [
      { id: "OI-01", question: "Standard or Configuration for Leave?", owner: "enterprise", status: "open" },
      { id: "OI-02", question: "Template bank hint says Standard; heuristics say Configuration. Which?", owner: "neomenta", status: "open" },
    ],
  };
  const m = { id: "mm", what: "x", type: "oi", where: { questionIncludes: "standard", owner: "neomenta" } };
  const [r] = runMechanics([m], { engDir: box(), actual, clone: null });
  assert.equal(r.pass, true);
  assert.match(r.detail, /^1 Open Item\(s\): OI-02 /);
});

// ---------- golden `forbidden` + hard gate ----------

const golden = {
  modules: [{ prefix: "LV", name: "Leave", requirements: [{ id: "LV-01", statement: "Apply for leave." }] }],
  general: { requirements: [] },
  openItems: [],
  forbidden: [
    { id: "FB-01", statement: "Employees can apply for half-day leave." },
    { id: "FB-02", statement: "The team is told when leave is approved." },
  ],
};
const judgeOf = (fb) => ({
  requirements: [{ golden: "LV-01", matchedBy: ["LV-01"], note: "" }],
  openItems: [],
  modules: [{ golden: "LV", matchedBy: ["LV"], note: "" }],
  extras: [{ id: "LV-02", tag: "noise", note: "" }],
  sourceCheck: [{ id: "LV-01", verdict: "supported", note: "" }, { id: "LV-02", verdict: "proposed", note: "" }],
  dontKnow: [],
  forbidden: fb,
});
const actual = {
  errors: [], uncited: [], ois: [],
  modules: [{ prefix: "LV", mapping: null }],
  reqs: [{ id: "LV-01", module: "LV" }, { id: "LV-02", module: "LV", proposed: true }],
};
const thresholds = () => {
  const t = Object.fromEntries(HARD.map((k) => [k, { pass: 0 }]));
  for (const k of ["recall", "openItems", "modules", "mapping"]) t[k] = { pass: 0 };
  t.regression = { pass: 5 };
  return t;
};

test("forbidden: a Requirement (even proposed) matching a forbidden statement fails the hard gate", () => {
  const j = judgeOf([
    { golden: "FB-01", matchedBy: ["LV-02"], note: "half day slipped in as proposed" },
    { golden: "FB-02", matchedBy: [], note: "" },
  ]);
  assert.deepEqual(judgeProblems(j, golden, actual, []), []);
  const m = computeMetrics({ golden, actual, judge: j, log: [], mechanics: [], replayProblems: [] });
  assert.equal(m.values.forbidden, 1);
  assert.deepEqual(m.rows.forbidden.map((r) => [r.g.id, r.m.matchedBy]), [["FB-01", ["LV-02"]], ["FB-02", []]]);
  const v = verdict(m.values, thresholds(), null);
  assert.equal(v.pass, false);
  assert.ok(v.failures.includes("Forbidden Requirements: 1 (max 0)"), v.failures.join("\n"));
});

test("forbidden: none matched passes; a case without forbidden scores 0 and needs no judge list", () => {
  const j = judgeOf([{ golden: "FB-01", matchedBy: [], note: "" }, { golden: "FB-02", matchedBy: [], note: "" }]);
  const m = computeMetrics({ golden, actual, judge: j, log: [], mechanics: [], replayProblems: [] });
  assert.equal(m.values.forbidden, 0);
  assert.equal(verdict(m.values, thresholds(), null).pass, true);
  const plain = { ...golden, forbidden: undefined };
  const j0 = judgeOf([]);
  assert.deepEqual(judgeProblems(j0, plain, actual, []), []);
  assert.equal(computeMetrics({ golden: plain, actual, judge: j0, log: [], mechanics: [], replayProblems: [] }).values.forbidden, 0);
});

test("forbidden: judge must list every forbidden item once, naming only replay Requirements", () => {
  const j = judgeOf([
    { golden: "FB-01", matchedBy: ["OI-03"], note: "" },
    { golden: "FB-01", matchedBy: [], note: "" },
    { golden: "FB-09", matchedBy: [], note: "" },
  ]);
  const p = judgeProblems(j, golden, actual, []);
  for (const want of ["forbidden: FB-01 listed twice", "forbidden: FB-09 is not expected here", "forbidden: FB-02 missing", "forbidden FB-01: OI-03 is not in the replay's BRD data"]) {
    assert.ok(p.includes(want), `${want}\n${p.join("\n")}`);
  }
});

test("thresholds: README has the forbidden hard gate, max 0, with a reason", () => {
  const readme = readFileSync(join(evals, "README.md"), "utf8");
  const t = readThresholds(readme);
  assert.deepEqual(t.forbidden, { kind: "hard, max", pass: 0 });
  assert.match(readme, /\| Forbidden Requirements \| `forbidden` \| hard, max \| 0 \| .*ticket 10/);
  assert.match(readme, /`absent`/);
  assert.match(readme, /`forbidden`/);
});

test("golden schema: forbidden needs id + statement; absent needs paths + pattern; check names bad refs", () => {
  const dir = box();
  const bad = join(dir, "template-hr-small");
  spawnSync("cp", ["-R", CASE, bad]);
  const g = JSON.parse(readFileSync(join(bad, "golden.json"), "utf8"));
  g.forbidden.push({ id: "FB-90", statement: "x", sources: ["nowhere.md"] }, { id: g.forbidden[0].id, statement: "dup" });
  writeFileSync(join(bad, "golden.json"), JSON.stringify(g));
  const k = loadCase(bad);
  assert.ok(k.problems.some((p) => /golden FB-90: source "nowhere\.md" is neither a case Input nor an answer-key fact/.test(p)), k.problems.join("\n"));
  assert.ok(k.problems.some((p) => new RegExp(`golden forbidden: ${g.forbidden[0].id} used twice`).test(p)), k.problems.join("\n"));
  g.forbidden = [{ id: "FB-01" }];
  g.mechanics.push({ id: "abs-bad", what: "x", type: "absent", pattern: "x" });
  writeFileSync(join(bad, "golden.json"), JSON.stringify(g));
  const k2 = loadCase(bad);
  assert.ok(k2.problems.some((p) => /golden\/forbidden\/0 must have required property 'statement'/.test(p)), k2.problems.join("\n"));
  assert.ok(k2.problems.some((p) => /must have required property 'paths'/.test(p)), k2.problems.join("\n"));
});

// ---------- the case ----------

test("check: template-hr-small is a valid case; bank checks run, or skip with a note while slice 1 is unmerged", () => {
  const r = run(["check", "template-hr-small"]);
  assert.equal(r.code, 0, r.out);
  assert.ok(r.lines.includes("case | template-hr-small | ok"), r.out);
  const note = r.lines.find((l) => l.startsWith("note | template-hr-small | Template bank checks skipped"));
  if (existsSync(BANK_MODULE)) assert.equal(note, undefined, r.out);
  else assert.match(note ?? "", /engine\/template-bank\.mjs not found/, r.out);
  // Cases without a fixture Template bank print no note.
  assert.ok(!run(["check", "tiny-synthetic"]).out.includes("note |"));
});

test("bankChecks: missing module → skipped; errors → problems; warnings kept; no checkBank export → problem", async () => {
  const kase = loadCase(caseDir("template-hr-small"));
  assert.ok(kase.bankDir?.endsWith(join("template-hr-small", "template-bank")));
  const notFound = Object.assign(new Error(`Cannot find module '${BANK_MODULE}'`), { code: "ERR_MODULE_NOT_FOUND" });
  const s = await bankChecks(kase, { load: async () => { throw notFound; } });
  assert.match(s.skipped, /engine\/template-bank\.mjs not found/);
  assert.deepEqual([s.errors, s.warnings], [[], []]);

  let seen;
  const fake = {
    checkBank: async (dir, opts) => {
      seen = { dir, opts };
      return { errors: ["TMOD-leave: unknown Pattern PAT-nope", { msg: "TPL-x: bad" }], warnings: ["TMOD-old gone"] };
    },
  };
  const r = await bankChecks(kase, { load: async () => fake });
  assert.equal(r.skipped, null);
  assert.deepEqual(r.errors, ["TMOD-leave: unknown Pattern PAT-nope", "TPL-x: bad"]);
  assert.deepEqual(r.warnings, ["TMOD-old gone"]);
  assert.equal(seen.dir, kase.bankDir);
  assert.ok(seen.opts.catalogSlugsPath.endsWith(join("reference", "neome-app-catalog-slugs.json")));
  assert.ok(seen.opts.scrubWords.includes("Fernbrook Interiors"), "fixture must not leak the case Enterprise");

  const none = await bankChecks(kase, { load: async () => ({}) });
  assert.deepEqual(none.errors, ["engine/template-bank.mjs has no checkBank export"]);
  // A real import error inside the module is not hidden as "missing".
  await assert.rejects(bankChecks(kase, { load: async () => { throw new SyntaxError("boom"); } }), /boom/);
  // A case with no fixture: nothing to check.
  assert.deepEqual(await bankChecks(loadCase(caseDir("tiny-synthetic"))), { skipped: null, errors: [], warnings: [] });
});

test("prepare: the case fixture becomes the clones' Template bank; cases without one get none (real bank never used)", () => {
  const dir = box();
  const r = run(["prepare", "template-hr-small", "--work", join(dir, "w"), "--date", "2026-11-03"], gitEnv(dir));
  assert.equal(r.code, 0, r.out);
  const a = join(dir, "w", "a");
  const bank = join(a, "neome-studio", "reference", "template-bank");
  assert.deepEqual(files(bank), files(join(CASE, "template-bank")));
  assert.deepEqual(readdirSync(join(a, "enterprises", "fernbrook", "inputs")).sort(), readdirSync(join(CASE, "inputs")).sort());
  const tracked = spawnSync("git", ["ls-files", "neome-studio/reference/template-bank"], { cwd: a, encoding: "utf8" }).stdout;
  assert.match(tracked, /templates\/TPL-hr-small\.md/, "fixture is committed in the seed");
  assert.ok(!existsSync(join(a, "neome-studio", "evals")));

  const d2 = box();
  const t = run(["prepare", "tiny-synthetic", "--work", join(d2, "w"), "--date", "2026-11-03"], gitEnv(d2));
  assert.equal(t.code, 0, t.out);
  assert.ok(!existsSync(join(d2, "w", "a", "neome-studio", "reference", "template-bank")));
});

test("template-hr-small: fixture entries, traps, replay and mechanics per ticket 10", () => {
  const bank = join(CASE, "template-bank");
  assert.deepEqual(files(bank), [
    "CHANGELOG.md",
    "patterns/PAT-approval-by-status.md",
    "template-modules/TMOD-attendance.md",
    "template-modules/TMOD-employee-master.md",
    "template-modules/TMOD-expenses.md",
    "template-modules/TMOD-leave.md",
    "templates/TPL-hr-small.md",
    "templates/TPL-sales-crm.md",
  ]);
  const fm = (rel) => parseYaml(readFileSync(join(bank, rel), "utf8").match(/^---\n([\s\S]*?)\n---\n/)[1]);
  for (const f of files(bank).filter((f) => f !== "CHANGELOG.md")) assert.equal(fm(f).id, f.split("/")[1].replace(/\.md$/, ""), f);
  const leave = fm("template-modules/TMOD-leave.md");
  assert.equal(leave.delivery, "standard", "Delivery hint must mismatch the payroll link in the Inputs");
  assert.equal(leave.neomeApp, "attendance-and-leave");
  assert.deepEqual(fm("templates/TPL-hr-small.md").modules, {
    core: ["TMOD-employee-master", "TMOD-attendance", "TMOD-leave"],
    optional: ["TMOD-expenses"],
  });
  assert.doesNotMatch(files(bank).map((f) => readFileSync(join(bank, f), "utf8")).join("\n"), /Fernbrook|Lindqvist|Northgate/);

  const g = JSON.parse(readFileSync(join(CASE, "golden.json"), "utf8"));
  assert.deepEqual(g.score, undefined, "all four soft metrics scored");
  assert.ok(g.forbidden.length >= 3);
  const mech = Object.fromEntries(g.mechanics.map((m) => [m.id, m]));
  for (const id of ["template-matched", "leave-tmod", "visitor-none", "employee-master-added", "no-attendance-module", "delivery-mismatch-oi", "no-bank-ids-in-views"]) {
    assert.ok(mech[id], `lacks mechanic ${id}`);
  }
  assert.deepEqual(mech["no-bank-ids-in-views"].paths, ["brd/**", "prototypes/**", "questionnaires/**"]);
  assert.equal(mech["no-bank-ids-in-views"].pattern, BANK_RE);
  assert.deepEqual(mech["delivery-mismatch-oi"].where.owner, "neomenta");

  const replay = parseYaml(readFileSync(join(CASE, "replay.yaml"), "utf8"));
  assert.deepEqual(replay.steps.map((s) => s.skill), ["ingest", "review-draft", "resolve-module", "resolve-module", "build-brd", "questionnaire"]);
  assert.match(replay.steps[2].brief, /Leave/);
  assert.match(replay.steps[2].brief, /live/i);
  assert.match(replay.steps[3].brief, /Expenses/);
  assert.match(replay.steps[3].brief, /from Inputs/i);
  assert.doesNotMatch(replay.steps[4].args ?? "", /release|sign-off/);
  const evalsReadme = readFileSync(join(evals, "README.md"), "utf8");
  assert.match(evalsReadme, /\[template-hr-small\]\(template-hr-small\/README\.md\)/);
});
