// Eval runner (ticket 41): case layout check, workspace, replay driver, judge hand-off, scorecard, results and
// regression, all run through neome-studio/evals/run.mjs with a fake `claude` (fixtures/evals/fake-claude.mjs).
// No LLM, no network. The mini-case fixture replays onto the reply/after-reply Engagement.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateEngagement } from "../build-brd.mjs";
import { computeMetrics, uncitedFacts, verdict } from "../../evals/lib/scorecard.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, "..", "..");
const repo = join(plugin, "..");
const evals = join(plugin, "evals");
const tool = join(evals, "run.mjs");
const fixtures = join(here, "fixtures");
const mini = join(fixtures, "evals", "mini-case");
const fake = join(fixtures, "evals", "fake-claude.mjs");
const HOW_TO_TALK = readFileSync(join(plugin, "reference", "how-to-talk.md"), "utf8");

const box = () => mkdtempSync(join(tmpdir(), "neome-eval-test-"));
function gitEnv(dir) {
  const global = join(dir, ".gitconfig-test");
  if (!existsSync(global)) writeFileSync(global, "");
  return { GIT_CONFIG_GLOBAL: global, GIT_CONFIG_NOSYSTEM: "1" };
}
function run(args, env = {}) {
  const r = spawnSync(process.execPath, [tool, ...args], { encoding: "utf8", cwd: repo, env: { ...process.env, ...env } });
  return { code: r.status, out: r.stdout + r.stderr, lines: r.stdout.trim().split("\n") };
}
const calls = (file) => readFileSync(file, "utf8").trim().split("\n").map(JSON.parse);
const dataBlock = (text) => JSON.parse(text.match(/## Data\s+```json\s+([\s\S]*?)```/)[1]);

// One end-to-end run of mini-case, shared by the tests below.
let W;
before(() => {
  const dir = box();
  const env = {
    ...gitEnv(dir),
    NEOME_EVAL_CLAUDE: fake,
    FAKE_SEED: join(fixtures, "reply", "after-reply", "harbor-tiles"),
    FAKE_CLAUDE_LOG: join(dir, "calls.jsonl"),
  };
  const r = run(["run", mini, "--work", join(dir, "w"), "--results", join(dir, "results"), "--branch", "main", "--date", "2026-10-29"], env);
  W = { dir, env, r, work: join(dir, "w"), results: join(dir, "results"), calls: join(dir, "calls.jsonl") };
  W.eng = join(W.work, "a", "enterprises", "harbor-tiles", "engagements", "crm");
});

// ---------- case layout ----------

test("check: tiny-synthetic and every shipped case are valid; mini-case fixture too", () => {
  const r = run(["check"]);
  assert.equal(r.code, 0, r.out);
  for (const c of ["tiny-synthetic", "anglo-gulf-crm"]) assert.ok(r.lines.includes(`case | ${c} | ok`), r.out);
  const m = run(["check", mini]);
  assert.equal(m.code, 0, m.out);
  assert.deepEqual(run(["list"]).lines, r.lines);
});

test("check: broken cases list each problem, exit 1", () => {
  const dir = box();
  const bad = join(dir, "mini-case");
  cpSync(mini, bad, { recursive: true });
  rmSync(join(bad, "README.md"));
  const g = JSON.parse(readFileSync(join(bad, "golden.json"), "utf8"));
  g.modules[0].requirements[0].sources = ["nowhere.md"];
  g.modules[1].mapping.neomeApp = "not-an-app";
  g.modules[1].requirements.push({ ...g.modules[0].requirements[1] });
  g.openItems[0].modules = ["XYZ"];
  g.mechanics.push({ id: "bad", what: "x", type: "file" });
  writeFileSync(join(bad, "golden.json"), JSON.stringify(g));
  writeFileSync(join(bad, "replay.yaml"), readFileSync(join(bad, "replay.yaml"), "utf8").replace("skill: ingest", "skill: grill-module"));
  const r = run(["check", bad]);
  assert.equal(r.code, 1);
  for (const want of [
    /missing README\.md/,
    /golden\/mechanics\/6 must have required property 'path'/,
    /replay\/steps\/0 /,
  ]) assert.match(r.out, want);

  // Shape fixed, references still wrong.
  g.mechanics.pop();
  writeFileSync(join(bad, "golden.json"), JSON.stringify(g));
  writeFileSync(join(bad, "README.md"), "# x\n");
  cpSync(join(mini, "replay.yaml"), join(bad, "replay.yaml"));
  const r2 = run(["check", bad]);
  assert.equal(r2.code, 1);
  for (const want of [
    /golden ENQ-01: source "nowhere\.md" is neither a case Input nor an answer-key fact/,
    /golden QUO: neomeApp not-an-app not in the catalog/,
    /golden Requirement: ENQ-02 used twice/,
    /golden ENQ-02: prefix is not its Module QUO/,
    /golden OI-01: unknown Module XYZ/,
  ]) assert.match(r2.out, want);
  assert.ok(r2.lines.includes("case | mini-case | 5 problem(s)"), r2.out);
});

test("tiny-synthetic covers the ticket 18 mechanics and keeps golden, key and Inputs linked", () => {
  const g = JSON.parse(readFileSync(join(evals, "tiny-synthetic", "golden.json"), "utf8"));
  const kinds = g.mechanics.map((m) => m.id);
  for (const k of ["glossary-conflict", "questionnaire-sent", "reply-closes-oi", "reply-new-question", "reply-dont-know", "needs-revisit", "gen", "v1-released", "v2-signed", "v2-change-log", "claim-held", "stale-lock-cleared", "stale-claim-released"]) {
    assert.ok(kinds.includes(k), `tiny-synthetic lacks mechanic ${k}`);
  }
  assert.ok(g.general.requirements.length >= 3);
  const replay = readFileSync(join(evals, "tiny-synthetic", "replay.yaml"), "utf8");
  for (const s of ["skill: questionnaire", "skill: studio", "engine: [module, claim", "engine: [lock", "read: \"questionnaires/QN-*.txt\"", "sign-off"]) {
    assert.ok(replay.includes(s), `replay lacks ${s}`);
  }
  const key = readFileSync(join(evals, "tiny-synthetic", "answer-key.md"), "utf8");
  assert.match(key, /## Questionnaire reply/);
  assert.match(key, /## Sign-off/);
});

test("prepare tiny-synthetic: both Inputs in clone a, nothing of the case beyond them, Consultants from replay.yaml", () => {
  const dir = box();
  const r = run(["prepare", "tiny-synthetic", "--work", join(dir, "w"), "--date", "2026-10-29"], gitEnv(dir));
  assert.equal(r.code, 0, r.out);
  const a = join(dir, "w", "a");
  assert.deepEqual(readdirSync(join(a, "enterprises")), ["marlin-marine"]);
  assert.deepEqual(readdirSync(join(a, "enterprises", "marlin-marine", "inputs")).sort(), ["parts-counter-whatsapp.txt", "workshop-call-notes.md"]);
  const info = JSON.parse(readFileSync(join(dir, "w", "run", "case.json"), "utf8"));
  assert.equal(info.engagement, "service-crm");
  const name = (c) => spawnSync("git", ["config", "user.name"], { cwd: join(dir, "w", c), encoding: "utf8" }).stdout.trim();
  assert.deepEqual([name("a"), name("b")], ["Asha Rao", "Ben Okafor"]);
});

// ---------- thresholds ----------

test("thresholds: README table holds ticket 18 starting values; the runner refuses a table missing a row", async () => {
  const { readThresholds } = await import("../../evals/lib/scorecard.mjs");
  const readme = readFileSync(join(evals, "README.md"), "utf8");
  const t = readThresholds(readme);
  assert.deepEqual(Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v.pass])), {
    valid: 0, uncited: 0, invented: 0, dontKnow: 0, mechanics: 0, replay: 0,
    recall: 80, openItems: 70, modules: 80, mapping: 70, regression: 5,
  });
  assert.throws(() => readThresholds(readme.replace(/^\| Module set.*$/m, "")), /no row for modules/);
});

// ---------- run end to end ----------

test("run: prepare + replay + judge + score with a fake claude → result file and lines", () => {
  const { r } = W;
  assert.equal(r.code, 1, r.out); // mini-case fails on purpose
  assert.match(r.out, /^work \| .*\/w$/m);
  assert.match(r.out, /^replay \| mini-case \| 0 problem\(s\) \| cost \$\d+\.\d\d \| .*transcript\.md$/m);
  assert.deepEqual(r.lines.filter((l) => l.startsWith("fail |")), [
    "fail | mini-case | Case mechanics failed: 1 (max 0)",
    "fail | mini-case | Open Items caught: 66.7% (min 70%)",
    "fail | mini-case | Mapping (Delivery class): 50% (min 70%)",
  ]);
  assert.ok(r.lines.includes(`result | mini-case | fail | ${join(W.results, "2026-10-29-mini-case.md")}`));
  assert.equal(r.lines.at(-1), "done | 0 pass, 1 fail");

  const text = readFileSync(join(W.results, "2026-10-29-mini-case.md"), "utf8");
  for (const h of ["## Gates (hard)", "## Soft metrics", "## Mechanics", "## Requirements", "## Open Items", "## Modules and mapping", "## Extra Requirements (not failed)", "## Source check", "## Don't know → Open Item", "## Problems", "## Maintainer spot-check", "## Data"]) {
    assert.ok(text.includes(h), `result lacks ${h}`);
  }
  assert.match(text, /\| Requirement recall \| 83\.3% \| 5 \/ 6 \| 80% \|/);
  assert.match(text, /\| QUO-09 \| Something the replay never wrote\. \| — \| \*\*missed\*\* \|/);
  assert.match(text, /\| ENQ \| Enquiries \| ENQ \| standard \| ENQ: none \| match \| \*\*differs\*\* \|/);
  assert.match(text, /\| v1 \| v1 released \| v1\.json missing \| \*\*fail\*\* \|/);
  assert.match(text, /\| claim \| Ben's claim pushed \| 1 commit\(s\)/);
  assert.match(text, /4 plausible, 6 noise\./);
  assert.match(text, /15 Requirement\(s\) checked against their cited Source text; 0 invented\./);
  const d = dataBlock(text);
  assert.equal(d.branch, "main");
  assert.equal(d.verdict, "fail");
  assert.deepEqual(d.metrics, { valid: 0, uncited: 0, invented: 0, dontKnow: 0, mechanics: 1, replay: 0, recall: 83.3, openItems: 66.7, modules: 100, mapping: 50 });
});

test("prepare: temp clones a and b over a bare remote; plugin without evals/ or tests; case Inputs only in a", () => {
  const a = join(W.work, "a");
  const b = join(W.work, "b");
  assert.ok(existsSync(join(W.work, "remote.git", "HEAD")));
  assert.ok(existsSync(join(a, "neome-studio", "engine", "cli.mjs")));
  assert.ok(!existsSync(join(a, "neome-studio", "evals")), "golden files must not reach the clone");
  assert.ok(!existsSync(join(a, "neome-studio", "engine", "test")));
  assert.ok(existsSync(join(a, ".claude", "settings.json")));
  assert.ok(existsSync(join(a, "enterprises", "harbor-tiles", "inputs", "note.md")));
  assert.ok(existsSync(join(a, "node_modules")));
  const git = (cwd, ...args) => spawnSync("git", args, { cwd, encoding: "utf8", env: { ...process.env, ...W.env } }).stdout.trim();
  assert.ok(!git(a, "ls-files").split("\n").some((f) => f.startsWith("node_modules")), "node_modules symlink committed");
  assert.equal(git(a, "config", "user.name"), "Asha Rao");
  assert.equal(git(b, "config", "user.name"), "Ben Okafor");
  assert.deepEqual(git(a, "log", "--format=%an: %s").split("\n"), [
    "Ben Okafor: resolve-module: harbor-tiles/crm claim ENQ",
    "Asha Rao: ingest: seeded",
    "Asha Rao: eval: seed mini-case",
  ]);
  const info = JSON.parse(readFileSync(join(W.work, "run", "case.json"), "utf8"));
  assert.equal(info.case, "mini-case");
  assert.equal(info.branch, "main");
  assert.equal(info.date, "2026-10-29");
  assert.deepEqual(info.clones, { a, b });
  // Never into a non-empty folder; never into the real repo.
  const again = run(["prepare", mini, "--work", W.work], W.env);
  assert.equal(again.code, 1);
  assert.match(again.out, /is not empty/);
  assert.ok(!existsSync(join(repo, "enterprises", "harbor-tiles")));
});

test("replay: skills headless in the right clone, client gets the answer key only, steps in order, repeat, placeholders", () => {
  const log = calls(W.calls);
  const skills = log.filter((c) => !c.args.includes("--json-schema"));
  const clients = log.filter((c) => c.args.includes("--json-schema") && !c.system.startsWith("# Eval judge"));
  const judges = log.filter((c) => c.system?.startsWith("# Eval judge"));
  // ingest: 2 turns; resolve: repeated twice while ENQ stays claimed (max 2), 2 turns each.
  assert.deepEqual(skills.map((c) => c.stdin.split("\n")[0]), [
    "/neome-studio:ingest harbor-tiles crm",
    "1. Harbor Tiles",
    "/neome-studio:resolve-module harbor-tiles crm ENQ",
    "1. Harbor Tiles",
    "/neome-studio:resolve-module harbor-tiles crm ENQ",
    "1. Harbor Tiles",
  ]);
  for (const c of skills) {
    assert.equal(c.cwd, realpathSync(join(W.work, "a")));
    assert.ok(c.args.includes("-p") && c.args.includes("--output-format"));
    assert.equal(c.args[c.args.indexOf("--permission-mode") + 1], "bypassPermissions");
    assert.equal(c.args[c.args.indexOf("--plugin-dir") + 1], join(W.work, "a", "neome-studio"));
  }
  assert.ok(skills[1].args.includes("--resume"), "second turn resumes the skill session");
  const key = readFileSync(join(mini, "answer-key.md"), "utf8").trim();
  const golden = readFileSync(join(mini, "golden.json"), "utf8");
  for (const c of clients) {
    assert.equal(c.args[c.args.indexOf("--tools") + 1], "", "client has no tools");
    assert.ok(c.system.includes(key), "client sees the answer key");
    assert.ok(c.system.includes("# Simulated client"));
    assert.ok(!c.system.includes("QUO-09") && !c.system.includes('"mechanics"') && !golden.includes(c.system.slice(0, 50)), "client never sees golden");
    assert.equal(c.cwd, realpathSync(join(W.work, "run")), "client runs outside the clones");
  }
  assert.match(clients[0].stdin, /^Step ingest-first\. You are Asha Rao.*\nBrief: First run for enterprises\/harbor-tiles\./);
  assert.match(clients.find((c) => c.stdin.includes("Step reply")).stdin, /Brief: Reply as Meera on 2026-10-29\./);
  assert.match(clients.find((c) => c.stdin.includes("Step resolve")).stdin, /Brief: Ask for ENQ, held by Ben Okafor\./);
  assert.equal(judges.length, 1);
  assert.ok(judges[0].stdin.includes('"QUO-09"'), "judge sees golden");
  assert.ok(!judges[0].stdin.includes("Quotations are valid 15 days"), "judge never sees the answer key");

  // Enterprise step wrote the Input; transcript + log.
  assert.equal(readFileSync(join(W.work, "a", "enterprises", "harbor-tiles", "inputs", "meera-reply.txt"), "utf8"), "1. Harbor Tiles\n2. Don't know\n");
  const t = readFileSync(join(W.work, "run", "transcript.md"), "utf8");
  for (const s of ["## ingest-first (skill, a)", "## ben-claims (engine, b)", "## reply (enterprise, enterprise)", "## resolve (skill, a, run 2)", "A2 enterprise · Don't know: How many showrooms?", "claimed: ENQ by Ben Okafor", "Status after step:", "## End"]) {
    assert.ok(t.includes(s), `transcript lacks ${s}`);
  }
  const entries = readFileSync(join(W.work, "run", "log.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.deepEqual(entries.filter((e) => e.kind === "answer").map((e) => e.n), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("replay: unusable client answer and failed engine step are replay problems (hard gate)", () => {
  const dir = box();
  const kase = join(dir, "mini-case");
  cpSync(mini, kase, { recursive: true });
  writeFileSync(join(kase, "replay.yaml"), readFileSync(join(kase, "replay.yaml"), "utf8").replace('"{next}", --who', '"NOPE", --who'));
  const env = { ...gitEnv(dir), NEOME_EVAL_CLAUDE: fake, FAKE_SEED: join(fixtures, "reply", "after-reply", "harbor-tiles") };
  const p = run(["prepare", kase, "--work", join(dir, "w"), "--date", "2026-10-29"], env);
  assert.equal(p.code, 0, p.out);
  const r = run(["replay", join(dir, "w")], { ...env, FAKE_CLIENT_BAD: "1" });
  assert.equal(r.code, 0, r.out);
  assert.ok(r.lines.some((l) => /^step \| ingest-first: client answer unusable: client /.test(l)), r.out);
  assert.ok(r.lines.some((l) => /^step \| ben-claims: engine module exit 1, expected 0: module claim: no Module NOPE/.test(l)), r.out);
  assert.match(r.out, /replay \| mini-case \| 3 problem\(s\)/);
  // --from resumes at a step; an unknown step is a problem.
  const f = run(["replay", join(dir, "w"), "--from", "nope"], env);
  assert.match(f.out, /step \| replay: no step nope/);
});

// ---------- judge output and score ----------

function rescore(judgeEnv, results = box()) {
  const j = run(["judge", W.work], { ...W.env, ...judgeEnv });
  assert.equal(j.code, 0, j.out);
  return { s: run(["score", W.work, "--results", results], W.env), results };
}

test("score: judge output that skips an item is refused, nothing written", () => {
  const { s, results } = rescore({ FAKE_JUDGE_SKIP: "1" });
  assert.equal(s.code, 1);
  assert.ok(s.lines.includes("problem | mini-case | judge requirements: ENQ-01 missing"), s.out);
  assert.equal(s.lines.filter((l) => l.startsWith("problem |")).length, 1, s.out);
  assert.deepEqual(existsSync(results) ? readdirSync(results) : [], []);
});

test("score: invented fact and Don't know with no Open Item fail the hard gates", () => {
  const { s, results } = rescore({ FAKE_INVENTED: "QUO-03", FAKE_DK_NULL: "1" });
  assert.equal(s.code, 1);
  assert.ok(s.lines.includes("fail | mini-case | Invented facts: 1 (max 0)"), s.out);
  assert.ok(s.lines.includes("fail | mini-case | Don't know without an Open Item: 4 (max 0)"), s.out);
  const text = readFileSync(join(results, readdirSync(results)[0]), "utf8");
  assert.match(text, /\| QUO-03 \| CE-2, WS-2 \| fake: not in Source \|/);
  assert.match(text, /\| A2 \| ingest-first \| How many showrooms\? \| \*\*none\*\* \|/);
});

test("score: regression vs the last main result; other branches ignored; same-day runs numbered", () => {
  const results = box();
  const prior = (file, branch, metrics) =>
    writeFileSync(join(results, file), `# old\n\n## Data\n\n\`\`\`json\n${JSON.stringify({ case: "mini-case", date: file.slice(0, 10), branch, metrics })}\n\`\`\`\n`);
  prior("2026-10-01-mini-case.md", "main", { recall: 99, openItems: 70, modules: 100, mapping: 50 });
  prior("2026-10-02-mini-case.md", "main", { recall: 90, openItems: 70, modules: 100, mapping: 50 });
  prior("2026-10-03-mini-case.md", "skill-edit", { recall: 50, openItems: 0, modules: 0, mapping: 0 });
  prior("2026-10-29-mini-case.md", "skill-edit", { recall: 83.3 });
  const { s } = rescore({}, results);
  assert.equal(s.code, 1);
  assert.ok(s.lines.includes("fail | mini-case | Requirement recall dropped 6.7 pts vs 2026-10-02-mini-case.md (max 5)"), s.out);
  assert.ok(!s.lines.some((l) => /Open Items caught dropped/.test(l)), "3.3 pts drop is allowed");
  assert.ok(s.lines.at(-1).endsWith("2026-10-29-mini-case-2.md"), s.out);
  const text = readFileSync(join(results, "2026-10-29-mini-case-2.md"), "utf8");
  assert.match(text, /baseline: 2026-10-02-mini-case\.md \(main\)/);
  assert.match(text, /\| Requirement recall \| 83\.3% \| 5 \/ 6 \| 80% \| 90 \| 6\.7 \| \*\*fail\*\* \|/);
});

test("score: released versions are validated and feed the version mechanic; a broken snapshot fails the valid gate", () => {
  const v = validateEngagement(W.eng, { release: true, summary: "test" });
  const dir = join(W.eng, "_agent", "brd", "versions");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "v1.json"), JSON.stringify(v.data, null, 2));
  try {
    const { s, results } = rescore({});
    assert.ok(!s.lines.some((l) => /mechanics/.test(l)), s.out);
    const text = readFileSync(join(results, readdirSync(results)[0]), "utf8");
    assert.match(text, /\| v1 \| v1 released \| v1 is draft-for-review \| pass \|/);
    assert.equal(dataBlock(text).metrics.valid, 0);

    const broken = { ...v.data, openItems: [...v.data.openItems, { ...v.data.openItems[0] }] };
    writeFileSync(join(dir, "v1.json"), JSON.stringify(broken));
    const b = rescore({});
    assert.ok(b.s.lines.includes("fail | mini-case | Schema + cross-ref valid (errors): 1 (max 0)"), b.s.out);
    assert.match(readFileSync(join(b.results, readdirSync(b.results)[0]), "utf8"), /- validation \[duplicate-oi\] v1\.json: /);
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("uncited facts: any fact not proposed with no Source is listed by path", () => {
  const data = {
    modules: [{ prefix: "QUO", purpose: { text: "x", sources: [], proposed: false }, requirements: [{ id: "QUO-01", sources: [], proposed: false }, { id: "QUO-02", sources: [], proposed: true }, { id: "QUO-03", sources: ["CE-1"], proposed: false }] }],
    sources: [{ id: "CE-1" }],
  };
  assert.deepEqual(uncitedFacts(data), ["$.modules[0].purpose", "$.modules[0].requirements[0] (QUO-01)"]);
});

test("score: golden `score` limits soft metrics; the rest are n/a and never fail", () => {
  const golden = {
    score: ["modules", "mapping"],
    modules: [{ prefix: "QUO", name: "Quotation", mapping: { neomeApp: "crm", delivery: "standard" }, requirements: [{ id: "QUO-01", statement: "x" }] }],
    general: { requirements: [] },
    openItems: [{ id: "OI-01", question: "q", modules: ["QUO"] }],
  };
  const judge = {
    requirements: [{ golden: "QUO-01", matchedBy: [], note: "" }],
    openItems: [{ golden: "OI-01", coveredBy: [], note: "" }],
    modules: [{ golden: "QUO", matchedBy: ["QT"], note: "" }],
    extras: [], sourceCheck: [], dontKnow: [],
  };
  const actual = { errors: [], uncited: [], modules: [{ prefix: "QT", mapping: { delivery: "standard" } }] };
  const m = computeMetrics({ golden, actual, judge, log: [], mechanics: [], replayProblems: [] });
  assert.equal(m.values.recall, null);
  assert.equal(m.values.openItems, null);
  assert.equal(m.values.modules, 100);
  assert.equal(m.values.mapping, 100);
  const t = Object.fromEntries(["valid", "uncited", "invented", "dontKnow", "mechanics", "replay"].map((k) => [k, { pass: 0 }]));
  for (const k of ["recall", "openItems", "modules", "mapping"]) t[k] = { pass: 80 };
  t.regression = { pass: 5 };
  assert.equal(verdict(m.values, t, null).pass, true);
  assert.equal(computeMetrics({ golden: { ...golden, score: undefined }, actual, judge, log: [], mechanics: [], replayProblems: [] }).values.recall, 0);
});

// ---------- arguments, maintainer-only, docs ----------

test("bad arguments exit 2; no claude → clear problem", () => {
  for (const args of [[], ["nope"], ["prepare"], ["score"], ["run"], ["run", "x", "--budget", "-1"], ["run", "x", "--date", "29-10-2026"], ["run", "--model"], ["list", "--frobnicate"]]) {
    assert.equal(run(args).code, 2, `args ${args.join(" ")}`);
  }
  assert.match(run(["score", "/nowhere"]).out, /not an eval workspace/);
  const dir = box();
  const r = run(["run", mini, "--work", join(dir, "w")], { ...gitEnv(dir), NEOME_EVAL_CLAUDE: join(dir, "no-such-claude") });
  assert.equal(r.code, 1);
  assert.match(r.out, /problem \| .*claude did not run/);
});

test("maintainer-only: not a skill, not an engine command, named by no skill, never in npm test's LLM path", () => {
  const skills = readdirSync(join(plugin, "skills"));
  assert.ok(!skills.some((s) => /eval/.test(s)));
  for (const n of skills) {
    const text = readFileSync(join(plugin, "skills", n, "SKILL.md"), "utf8");
    assert.doesNotMatch(text, /evals\/|run\.mjs|eval runner/i, `${n} names the eval runner`);
  }
  assert.ok(!existsSync(join(evals, "SKILL.md")));
  const r = spawnSync(process.execPath, [join(plugin, "engine", "cli.mjs"), "eval"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  const pkg = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
  assert.doesNotMatch(pkg.scripts.test, /evals\/run\.mjs/);
  assert.doesNotMatch(readFileSync(join(repo, ".github", "workflows", "checks.yml"), "utf8"), /evals/);
});

test("driver prompt, client and judge prompts, READMEs", () => {
  const driver = readFileSync(join(evals, "eval.md"), "utf8");
  assert.ok(driver.includes(HOW_TO_TALK.trim()));
  assert.match(driver, /`TOOL` = `node neome-studio\/evals\/run\.mjs`/);
  for (const s of ["`TOOL run --all`", "`TOOL check`", "`TOOL judge <work>`", "`TOOL score <work>`", "npm test", "spot-check", "main"]) assert.ok(driver.includes(s), `driver lacks ${s}`);
  const client = readFileSync(join(evals, "prompts", "simulated-client.md"), "utf8");
  for (const s of ["answer key", "Don't know", "K-NN", "dontKnow: true", "`action: \"end\"`"]) assert.ok(client.includes(s), `client prompt lacks ${s}`);
  const judge = readFileSync(join(evals, "prompts", "judge.md"), "utf8");
  for (const s of ["**requirements**", "**openItems**", "**modules**", "**extras**", "**sourceCheck**", "**dontKnow**", "exactly once"]) assert.ok(judge.includes(s), `judge prompt lacks ${s}`);
  const readme = readFileSync(join(evals, "README.md"), "utf8");
  for (const s of ["node neome-studio/evals/run.mjs run --all", "## Thresholds", "## Gate", "## Eyeball checklist", "tiny-synthetic"]) assert.ok(readme.includes(s), `evals/README.md lacks ${s}`);
  const tools = readFileSync(join(plugin, "README.md"), "utf8");
  assert.match(tools, /\| Eval runner \| .*`node neome-studio\/evals\/run\.mjs run --all`/);
  assert.match(readFileSync(join(plugin, "maintainer", "upstream-check.md"), "utf8"), /node neome-studio\/evals\/run\.mjs run --all/);
});
