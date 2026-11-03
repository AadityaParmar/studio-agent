// Template bank slice 3: refine tool (maintainer/refine-template-bank.mjs + template-bank/refine-*.mjs).
// Synthetic only: the made-up Acme Build (fixtures/template-bank/acme-build.json) and made-up Template bank
// entries / tag sheets / change lists. No model is called; the tests play the tag, cluster and review children.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { checkBank, checkTemplateRef, loadBank, replacedBy } from "../template-bank.mjs";
import { applyChanges, entryText, planApply } from "../../maintainer/template-bank/refine-apply.mjs";
import { decide, refOf, validateChanges } from "../../maintainer/template-bank/refine-shapes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, "..", "..");
const tool = join(plugin, "maintainer", "refine-template-bank.mjs");
const acme = join(here, "fixtures", "template-bank", "acme-build.json");
const CATALOG = join(here, "fixtures", "template-bank", "catalog-slugs.json");
const CLIENT = /acme|zorbia|widgets sells|555|ops@/i; // words of the made-up client: must never reach output

const box = () => mkdtempSync(join(tmpdir(), "neome-tb-refine-"));
const run = (args, opts = {}) => {
  const r = spawnSync(process.execPath, [tool, ...args], { encoding: "utf8", ...opts });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const gitEnv = (dir) => {
  const global = join(dir, ".gitconfig-test");
  writeFileSync(global, "[user]\n\tname = Refine Bot\n\temail = bot@example.com\n[init]\n\tdefaultBranch = main\n");
  return { ...process.env, GIT_CONFIG_GLOBAL: global, GIT_CONFIG_NOSYSTEM: "1" };
};
const git = (cwd, env, ...args) => {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env });
  assert.equal(r.status, 0, `git ${args.join(" ")}: ${r.stderr}`);
  return r.stdout.trim();
};

// ---------- synthetic Template bank ----------

const SECTIONS = {
  pattern: ["Task", "How", "Workaround", "Limits", "Flowchart"],
  "template-module": ["Usual needs", "Process steps", "Usual sheets, key fields, roles", "Neome App / Delivery hint", "Flowchart"],
  template: ["Modules", "Links between modules", "Flowchart"],
};
const body = (kind, name) =>
  `\n# ${name}\n\n${SECTIONS[kind].map((s) => (s === "Flowchart" ? `## ${s}\n\n\`\`\`mermaid\nflowchart LR\n  A --> B\n\`\`\`` : `## ${s}\n\n- ${name} ${s.toLowerCase()}.`)).join("\n\n")}\n`;
const row = (build, area) => ({ build, area });
const PAT = (id, name, seenIn) => ({ fm: { id, kind: "pattern", name, workaround: false, seenIn }, body: body("pattern", name) });
const TMOD = (id, name, seenIn, extra = {}) => ({
  fm: { id, kind: "template-module", name, aliases: [], patterns: [], neomeApp: "none", delivery: "configuration", seenIn, ...extra },
  body: body("template-module", name),
});
const TPL = (id, name, seenIn, modules) => ({ fm: { id, kind: "template", name, businessType: "Small shop", modules, seenIn }, body: body("template", name) });
const FOLDER = { pattern: "patterns", "template-module": "template-modules", template: "templates" };

function writeBank(dir, entries, log = []) {
  for (const f of Object.values(FOLDER)) mkdirSync(join(dir, f), { recursive: true });
  for (const e of entries) writeFileSync(join(dir, FOLDER[e.fm.kind], `${e.fm.id}.md`), entryText(e.fm, e.body));
  writeFileSync(join(dir, "CHANGELOG.md"), `# Template bank changelog\n\n## Changes\n\n${log.map((l) => `${l}\n`).join("")}`);
  return dir;
}
// Empty Template bank: shipped README + CHANGELOG header only (never the real entries, change lines or reports).
const emptyBank = (dir) => {
  const src = join(plugin, "reference", "template-bank");
  mkdirSync(dir, { recursive: true });
  cpSync(join(src, "README.md"), join(dir, "README.md"));
  const log = readFileSync(join(src, "CHANGELOG.md"), "utf8").split("\n").filter((l) => !/^- \d{4}-\d{2}-\d{2} \|/.test(l)).join("\n");
  writeFileSync(join(dir, "CHANGELOG.md"), log);
  for (const f of Object.values(FOLDER)) mkdirSync(join(dir, f), { recursive: true });
  return dir;
};
const draft = (dir, e) => {
  mkdirSync(join(dir, "drafts"), { recursive: true });
  writeFileSync(join(dir, "drafts", `${e.fm.id}.md`), entryText(e.fm, e.body));
};
const drafts = (...es) => new Map(es.map((e) => [e.fm.id, structuredClone(e)]));

// Start bank for the change-kind tests: NB-90, NB-91 (updated this run), NB-92.
const START = () => [
  PAT("PAT-sign-off-by-flag", "Sign-off by flag", [row("NB-90", "Widgets"), row("NB-91", "Widgets")]),
  PAT("PAT-flag-old", "Flag old", [row("NB-91", "Widgets")]),
  PAT("PAT-dusty", "Dusty", [row("NB-90", "Gizmos")]),
  PAT("PAT-only-91", "Only in 91", [row("NB-91", "Gizmos")]),
  TMOD("TMOD-widgets", "Widgets", [row("NB-90", "Widgets"), row("NB-91", "Widgets")], { patterns: ["PAT-sign-off-by-flag", "PAT-flag-old"], neomeApp: "widget-desk" }),
  TMOD("TMOD-widget-desk", "Widget desk", [row("NB-92", "Desk")], { aliases: ["Desk"] }),
  TMOD("TMOD-gizmos", "Gizmos", [row("NB-90", "Gizmos"), row("NB-91", "Gizmos")], { patterns: ["PAT-dusty"] }),
  TPL("TPL-widget-shop", "Widget shop", [row("NB-90", "*")], { core: ["TMOD-widgets"], optional: ["TMOD-gizmos", "TMOD-widget-desk"] }),
];
const START_LOG = [
  "- 2026-01-01 | add | PAT-sign-off-by-flag, PAT-flag-old, PAT-dusty, PAT-only-91 | seen in NB-90, NB-91",
  "- 2026-01-01 | add | TMOD-widgets, TMOD-widget-desk, TMOD-gizmos, TPL-widget-shop | seen in NB-90, NB-91, NB-92",
  "- 2026-01-02 | retire | PAT-ancient | seenIn hit zero",
];

// Every change kind at once. NB-91 is the updated Build of this run.
const CHANGES = () => [
  { change: "add", id: "PAT-stock-count", seenIn: [row("NB-91", "Gizmos")], reason: "Stock count by grid seen in NB-91.", proof: [] },
  { change: "enhance", id: "TMOD-widgets", seenIn: [row("NB-91", "Widgets")], reason: "NB-91 still has widgets.", proof: [] },
  { change: "rename", from: "PAT-flag-old", to: "PAT-flag-check", name: "Flag check", seenIn: [row("NB-91", "Widgets")], reason: "Clearer name.", proof: [] },
  {
    change: "split", from: "TMOD-gizmos",
    into: [{ id: "TMOD-gizmo-stock", seenIn: [row("NB-90", "Gizmos")] }, { id: "TMOD-gizmo-repair", seenIn: [row("NB-91", "Gizmos")] }],
    reason: "Two flows: stock and repair.", proof: [],
  },
  { change: "merge", from: ["TMOD-widget-desk"], into: "TMOD-widgets", reason: "Same flow as widgets.", proof: [] },
  { change: "retire", id: "PAT-dusty", reason: "Maintainer asked: test leftover." },
];
const CHANGE_DRAFTS = () => drafts(
  PAT("PAT-stock-count", "Stock count", []),
  TMOD("TMOD-gizmo-stock", "Gizmo stock", [], { patterns: ["PAT-stock-count"] }),
  TMOD("TMOD-gizmo-repair", "Gizmo repair", [], { patterns: ["PAT-dusty"] }),
);
const rows = (e) => e.fm.seenIn.map((r) => `${r.build}/${r.area}`);

test("apply: every change kind, refs follow, updated Build's seenIn replaced, zero → retired, CHANGELOG parses, check clean", () => {
  const bank = writeBank(join(box(), "template-bank"), START(), START_LOG);
  const res = applyChanges({ bankDir: bank, changes: CHANGES(), drafts: CHANGE_DRAFTS(), refresh: ["NB-91"], date: "2026-11-03", catalogSlugsPath: CATALOG });
  assert.deepEqual(res.errors, []);
  const { entries, changelog } = loadBank(bank);
  const by = new Map(entries.map((e) => [e.id, e]));
  assert.deepEqual([...by.keys()].sort(), [
    "PAT-flag-check", "PAT-sign-off-by-flag", "PAT-stock-count",
    "TMOD-gizmo-repair", "TMOD-gizmo-stock", "TMOD-widgets", "TPL-widget-shop",
  ]);
  for (const gone of ["PAT-flag-old", "PAT-dusty", "PAT-only-91", "TMOD-gizmos", "TMOD-widget-desk"]) {
    assert.ok(!readdirSync(join(bank, gone.startsWith("PAT") ? "patterns" : "template-modules")).includes(`${gone}.md`), `${gone} file deleted`);
  }

  // seenIn: NB-91 rows of the updated Build replaced, not added; merged rows kept.
  assert.deepEqual(rows(by.get("TMOD-widgets")), ["NB-90/Widgets", "NB-91/Widgets", "NB-92/Desk"]);
  assert.deepEqual(rows(by.get("PAT-sign-off-by-flag")), ["NB-90/Widgets"], "NB-91 row dropped: change list did not list it again");
  assert.deepEqual(rows(by.get("PAT-flag-check")), ["NB-91/Widgets"]);
  assert.deepEqual(rows(by.get("TMOD-gizmo-stock")), ["NB-90/Gizmos"]);
  assert.deepEqual(rows(by.get("TPL-widget-shop")), ["NB-90/*"]);

  // merge → aliases; rename keeps content, new name + heading; references follow every ID change.
  assert.deepEqual(by.get("TMOD-widgets").fm.aliases, ["Widget desk", "Desk"]);
  assert.equal(by.get("PAT-flag-check").fm.name, "Flag check");
  assert.match(by.get("PAT-flag-check").body, /^# Flag check$/m);
  assert.deepEqual(by.get("TMOD-widgets").fm.patterns, ["PAT-sign-off-by-flag", "PAT-flag-check"]);
  assert.deepEqual(by.get("TMOD-gizmo-repair").fm.patterns, [], "retired Pattern dropped from refs");
  assert.deepEqual(by.get("TPL-widget-shop").fm.modules, { core: ["TMOD-widgets"], optional: ["TMOD-gizmo-stock", "TMOD-gizmo-repair"] }, "split → all parts; merged into core → not optional");

  // CHANGELOG: one line per change, parsed by loadBank, replacedBy right; zero seenIn → retire; dropped rows logged.
  const mine = changelog.filter((c) => c.date === "2026-11-03").map((c) => `${c.change} ${c.ids.join(",")}${c.replacedBy?.length ? ` -> ${c.replacedBy.join(",")}` : ""} | ${c.reason}`);
  assert.deepEqual(mine, [
    "add PAT-stock-count | Stock count by grid seen in NB-91.",
    "enhance TMOD-widgets | NB-91 still has widgets.",
    "rename PAT-flag-old -> PAT-flag-check | Clearer name.",
    "split TMOD-gizmos -> TMOD-gizmo-stock,TMOD-gizmo-repair | Two flows: stock and repair.",
    "merge TMOD-widget-desk -> TMOD-widgets | Same flow as widgets.",
    "retire PAT-dusty | Maintainer asked: test leftover.",
    "retire PAT-only-91 | seenIn hit zero",
    "enhance PAT-sign-off-by-flag | seenIn: NB-91 rows dropped (Build re-tagged or removed)",
  ]);
  assert.deepEqual(replacedBy(bank, "PAT-flag-old"), ["PAT-flag-check"]);
  assert.deepEqual(replacedBy(bank, "TMOD-gizmos"), ["TMOD-gizmo-stock", "TMOD-gizmo-repair"]);
  assert.deepEqual(replacedBy(bank, "TMOD-widget-desk"), ["TMOD-widgets"]);
  assert.deepEqual(replacedBy(bank, "PAT-only-91"), []);
  assert.deepEqual(checkTemplateRef(bank, "TMOD-gizmos").suggest, ["TMOD-gizmo-stock", "TMOD-gizmo-repair"]);

  const check = checkBank(bank, { catalogSlugsPath: CATALOG, scrubWords: ["Zorbia"] });
  assert.deepEqual(check.errors, []);
  assert.deepEqual(check.warnings, []);
});

test("apply: removed Build drops rows; --full drops every row; untouched entries keep their bytes", () => {
  const bank = writeBank(join(box(), "template-bank"), START(), START_LOG);
  const untouched = join(bank, "patterns", "PAT-dusty.md");
  const before = readFileSync(untouched, "utf8");
  const plan = planApply({ bankDir: bank, changes: [], refresh: ["NB-92"], date: "2026-11-03" });
  assert.deepEqual(plan.errors, []);
  assert.deepEqual(plan.autoRetired, ["TMOD-widget-desk"]);
  assert.ok(!plan.entries.get("PAT-dusty").dirty);
  const res = applyChanges({ bankDir: bank, changes: [], refresh: ["NB-92"], date: "2026-11-03", catalogSlugsPath: CATALOG });
  assert.deepEqual(res.errors, []);
  assert.equal(readFileSync(untouched, "utf8"), before);
  assert.deepEqual(loadBank(bank).entries.find((e) => e.id === "TPL-widget-shop").fm.modules.optional, ["TMOD-gizmos"]);
  assert.deepEqual(loadBank(bank).changelog.at(-1), { date: "2026-11-03", change: "retire", ids: ["TMOD-widget-desk"], replacedBy: [], reason: "seenIn hit zero" });

  const full = planApply({ bankDir: writeBank(join(box(), "b"), START(), START_LOG), changes: [], refresh: null, date: "2026-11-03" });
  assert.equal(full.entries.size, 0, "--full with an empty change list retires everything");
});

test("apply: IDs never reused; a failing check leaves the Template bank untouched", () => {
  const bank = writeBank(join(box(), "template-bank"), START(), START_LOG);
  const snap = () => ["patterns", "template-modules", "templates"].flatMap((f) => readdirSync(join(bank, f)).map((n) => readFileSync(join(bank, f, n), "utf8"))).join("\n") + readFileSync(join(bank, "CHANGELOG.md"), "utf8");
  const before = snap();

  const reuse = applyChanges({ bankDir: bank, changes: [{ change: "add", id: "PAT-ancient", seenIn: [row("NB-90", "Widgets")], reason: "back again" }], drafts: drafts(PAT("PAT-ancient", "Ancient", [])), refresh: ["NB-90"], date: "2026-11-03" });
  assert.match(reuse.errors.join("\n"), /PAT-ancient already used; IDs never reused/);
  const live = applyChanges({ bankDir: bank, changes: [{ change: "rename", from: "PAT-dusty", to: "PAT-sign-off-by-flag", reason: "x" }], refresh: [], date: "2026-11-03" });
  assert.match(live.errors.join("\n"), /PAT-sign-off-by-flag already used/);

  const emptyCore = applyChanges({ bankDir: bank, changes: [{ change: "retire", id: "TMOD-widgets", reason: "gone" }], refresh: [], date: "2026-11-03", catalogSlugsPath: CATALOG });
  assert.match(emptyCore.errors.join("\n"), /TPL-widget-shop: modules\.core must be a non-empty list/);

  const leak = applyChanges({ bankDir: bank, changes: [{ change: "enhance", id: "PAT-dusty", reason: "more" }], drafts: drafts({ ...PAT("PAT-dusty", "Dusty at Zorbia", []) }), refresh: [], date: "2026-11-03", catalogSlugsPath: CATALOG, scrubWords: ["Zorbia"] });
  assert.match(leak.errors.join("\n"), /scrub word "Zorbia" found/);
  assert.equal(snap(), before, "Template bank unchanged after every refused apply");
});

test("review rule: auto only for add / enhance / rename that pass; split / merge / retire and doubts ask", () => {
  const changes = CHANGES();
  const v = (ref, verdict, backed = true, agrees = true) => ({ ref, verdict, backed, agrees, note: "n" });
  const verdicts = [
    v("add PAT-stock-count", "apply"),
    v("enhance TMOD-widgets", "apply", false),
    v("rename PAT-flag-old", "apply", true, false),
    v("split TMOD-gizmos", "apply"),
    v("merge TMOD-widgets", "apply"),
    { ...v("retire PAT-dusty", "drop"), question: "Keep it?" },
  ];
  assert.deepEqual(changes.map(refOf), verdicts.map((x) => x.ref));
  const d = decide(changes, verdicts);
  assert.deepEqual(d.map((x) => `${x.decision}${x.by ? ` by ${x.by}` : ""}`), ["apply by review", "ask", "ask", "ask", "ask", "ask"]);
  assert.deepEqual(d[1].why, ["proof lines do not back it"]);
  assert.deepEqual(d[2].why, ["reviewer disagrees with clusterer"]);
  assert.deepEqual(d[3].why, ["split changes IDs"]);
  assert.deepEqual(d[5].why, ["retire changes IDs", "reviewer says drop"]);
  assert.equal(d[5].question, "Keep it?");
  assert.match(d[1].question, /enhance TMOD-widgets/);
});

// ---------- CLI: the synthetic Acme Build through every script step ----------

function acmeTags(raw) {
  const t = join(raw, "tags", "NB-01");
  const y = (name, data) => writeFileSync(join(t, name), stringify(data));
  y("sales.yaml", {
    build: "NB-01", area: "Sales", file: "sales.md", weight: "normal",
    templateModule: {
      name: "Sales orders", id: "new", needs: ["Rep raises an order."], steps: ["Rep adds order.", "Manager approves."],
      sheets: ["Order: Customer, Status {Draft|Approved|Rejected}"], roles: ["Sales Rep", "Manager"], proof: ["### Order — update@Manager"],
    },
    patterns: [{
      name: "Approval by status", id: "new", task: "Manager approves an order.", how: "Status pickText + branch.", workaround: true,
      why: "No approval step.", proof: ['- branchIfElse "Approved?" [if Curr.Status equalTo "Approved"]'],
    }, {
      // workaround: false needs no why
      name: "Branch on status", id: "new", task: "Flow splits on status.", how: "Workflow branch on Status.", workaround: false,
      proof: ['- branchIfElse "Approved?" [if Curr.Status equalTo "Approved"]'],
    }],
  });
  y("quotes.yaml", { build: "NB-01", area: "Quotes", file: "quotes.md", weight: "normal", templateModule: null, patterns: [] });
  y("orphans-maybe-dead.yaml", { build: "NB-01", area: "Orphans (maybe dead)", file: "orphans-maybe-dead.md", weight: "low", templateModule: null, patterns: [] });
  y("_build.yaml", {
    build: "NB-01", file: "overview.md",
    template: { name: "Small trading company", id: "new", businessType: "Sells goods to shops.", core: ["Sales"], optional: ["Quotes"], links: [], proof: ["- Quotes → Sales (1)"] },
  });
}

function acmeCluster(dir) {
  const proof = (area, line) => ({ build: "NB-01", area, line });
  writeFileSync(join(dir, "changes.yaml"), stringify({
    changes: [
      { change: "add", id: "PAT-approval-by-status", seenIn: [row("NB-01", "Sales")], reason: "Approval by status list seen in NB-01.", proof: [proof("Sales", "name: Approval by status")] },
      { change: "add", id: "TMOD-sales-orders", seenIn: [row("NB-01", "Sales")], reason: "Order flow seen in NB-01.", proof: [proof("Sales", "name: Sales orders")] },
      { change: "add", id: "TPL-small-trading", seenIn: [row("NB-01", "*")], reason: "Small trading company seen in NB-01.", proof: [proof("*", "businessType: Sells goods to shops.")] },
    ],
  }));
  draft(dir, PAT("PAT-approval-by-status", "Approval by status", []));
  draft(dir, TMOD("TMOD-sales-orders", "Sales orders", [], { patterns: ["PAT-approval-by-status"] }));
  draft(dir, TPL("TPL-small-trading", "Small trading company", [], { core: ["TMOD-sales-orders"], optional: [] }));
}

test("CLI: first mining run end to end on the synthetic Acme Build; output never holds client words; commit on branch, no merge, no push", () => {
  const root = box();
  const env = gitEnv(root);
  const repo = join(root, "repo");
  const bank = emptyBank(join(repo, "neome-studio", "reference", "template-bank"));
  git(repo, env, "init", "-q");
  git(repo, env, "add", "-A");
  git(repo, env, "commit", "-q", "-m", "start");
  const raw = join(root, "raw"); // outside the repo: no gitignore needed
  mkdirSync(raw);
  cpSync(acme, join(raw, "client-export.json"));
  const T = (...a) => {
    const r = run([...a, "--raw", raw, "--bank", bank, "--catalog", CATALOG], { env });
    assert.doesNotMatch(r.out + r.err, CLIENT, `client words in output of ${a[0]}`);
    assert.doesNotMatch(r.out + r.err, /client-export/, "raw file names never printed");
    return r;
  };

  let r = T("status");
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^build \| \(no code yet\) \| new \| v7$/m);
  assert.match(r.out, /^done \| 1 new, 0 updated, 0 current, 0 removed$/m);

  r = T("prepare", "--date", "2026-11-03");
  assert.equal(r.code, 3, "first prepare seeds the word list and stops");
  assert.match(r.out, /^words \| NB-01 \| .*scrub\/NB-01\.txt \| seeded/m);
  assert.equal(existsSync(join(raw, "runs")), false, "no run before the maintainer checked the word list");
  const wl = join(raw, "scrub", "NB-01.txt");
  r = T("prepare", "--date", "2026-11-03");
  assert.equal(r.code, 3, "word list without `# checked` still stops");
  assert.match(r.out, /^words \| NB-01 \| .* \| not checked/m);
  writeFileSync(wl, readFileSync(wl, "utf8") + "# checked\n");

  r = T("prepare", "--date", "2026-11-03");
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^scrub \| NB-01 \| 10 files clean$/m);
  assert.match(r.out, /^tag \| NB-01 \| new \| 3 areas \| /m);
  assert.match(r.out, /^run \| 2026-11-03 \| incremental \| /m);
  const dir = join(raw, "runs", "2026-11-03");
  assert.deepEqual(JSON.parse(readFileSync(join(dir, "run.json"), "utf8")), { run: "2026-11-03", date: "2026-11-03", mode: "incremental", builds: [{ code: "NB-01", state: "new", version: "7", areas: 3 }] });

  r = T("prompt", "tag", "NB-01");
  assert.equal(r.code, 0, r.out + r.err);
  assert.doesNotMatch(r.out, /\{\{/);
  assert.match(r.out, /Sonnet 5\.5, effort medium/);
  assert.match(r.out, /`sales\.md` → `sales\.yaml` \(area: Sales\)/);
  assert.match(r.out, /scrubbed\/NB-01/);
  assert.match(r.out, /empty: first mining run/);

  // tag child (played here): sheets with one invented proof line → refused; fixed → ok.
  acmeTags(raw);
  const sales = join(raw, "tags", "NB-01", "sales.yaml");
  const good = readFileSync(sales, "utf8");
  writeFileSync(sales, good.replace("### Order — update@Manager", "Orders approved by the boss"));
  r = T("validate-tags");
  assert.equal(r.code, 1);
  assert.match(r.out, /^error \| NB-01 \| sales\.yaml: templateModule: proof 1 not found in sales\.md/m);
  writeFileSync(sales, good);
  r = T("validate-tags");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /^ok \| NB-01 \| 4 sheets$/m);

  r = T("prompt", "cluster");
  assert.equal(r.code, 0, r.out + r.err);
  assert.doesNotMatch(r.out, /\{\{/);
  assert.match(r.out, /Opus 5\.5, effort high/);
  assert.match(r.out, /tags\/NB-01\/_build\.yaml/);

  // cluster child (played here)
  acmeCluster(dir);
  r = T("validate-changes");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /^ok \| 3 changes$/m);

  r = T("prompt", "review");
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /not the clusterer/);

  // review child (played here): two pass, the Template is a doubt → ask.
  writeFileSync(join(dir, "verdicts.yaml"), stringify({
    verdicts: [
      { ref: "add PAT-approval-by-status", verdict: "apply", backed: true, agrees: true, note: "Branch on status shown." },
      { ref: "add TMOD-sales-orders", verdict: "apply", backed: true, agrees: true, note: "Order sheet shown." },
      { ref: "add TPL-small-trading", verdict: "ask", backed: true, agrees: true, note: "One Build only.", question: "Add a Template from one Build?" },
    ],
  }));
  r = T("decide");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /^auto \| add PAT-approval-by-status$/m);
  assert.match(r.out, /^ask \| add TPL-small-trading \| reviewer unsure \| Add a Template from one Build\?$/m);
  r = T("apply");
  assert.equal(r.code, 1, "open ask blocks apply");
  r = T("answer", "add TPL-small-trading", "apply", "--note", "Fine for now.");
  assert.equal(r.code, 0, r.out);

  r = T("apply");
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^applied \| - 2026-11-03 \| add \| TMOD-sales-orders \| Order flow seen in NB-01\.$/m);
  assert.match(r.out, /^done \| 3 applied, 0 dropped, 0 retired at zero, 3 CHANGELOG lines$/m);
  const { entries, changelog } = loadBank(bank);
  assert.deepEqual(entries.map((e) => e.id).sort(), ["PAT-approval-by-status", "TMOD-sales-orders", "TPL-small-trading"]);
  assert.deepEqual(entries.find((e) => e.id === "TMOD-sales-orders").fm.seenIn, [{ build: "NB-01", area: "Sales" }]);
  assert.equal(changelog.length, 3);
  assert.deepEqual(checkBank(bank, { catalogSlugsPath: CATALOG, scrubWords: ["Acme", "Zorbia"] }).errors, []);
  assert.equal(T("apply").code, 1, "a run applies once");

  assert.equal(T("tokens", "tag", "NB-01", "--provider", "claudeAgent_claude_sales", "--model", "claude-sonnet-5-5").code, 0);
  r = T("tokens", "cluster", "all", "--in", "1200", "--out", "300");
  assert.match(r.out, /^tokens \| cluster \| all \| 1200 \| 300 \| reported \| - \| -$/m);
  assert.equal(T("tokens", "cluster", "NB-01").code, 2);
  const tsv = readFileSync(join(dir, "tokens.tsv"), "utf8").trim().split("\n");
  assert.equal(tsv.length, 3);
  assert.match(tsv[1], /^tag\tNB-01\t\d+\t\d+\testimate\tclaudeAgent_claude_sales\tclaude-sonnet-5-5$/);

  r = T("report");
  assert.equal(r.code, 0, r.out);
  const rep = readFileSync(join(dir, "report.md"), "utf8");
  assert.match(rep, /\| add \| TPL-small-trading \| Small trading company seen in NB-01\. \| maintainer \|/);
  assert.match(rep, /\| add \| PAT-approval-by-status \| .* \| review \|/);
  assert.match(rep, /\| total \| \| \d+ \| \d+ \|/);
  assert.doesNotMatch(rep, CLIENT);

  assert.equal(T("check").code, 0);
  r = T("status");
  assert.match(r.out, /^build \| NB-01 \| current \| v7$/m);
  assert.match(r.out, /^run \| 2026-11-03 \| applied, not committed$/m);

  // commit: branch template-bank-refine-<run>, only the Template bank folder, never merges or pushes.
  writeFileSync(join(repo, "stray.txt"), "not mine\n");
  git(repo, env, "add", "stray.txt");
  r = T("commit");
  assert.equal(r.code, 1, "staged file outside the Template bank blocks commit");
  git(repo, env, "reset", "-q", "stray.txt");
  r = T("commit");
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^commit \| template-bank-refine-2026-11-03 \| [0-9a-f]+$/m);
  assert.equal(git(repo, env, "rev-parse", "--abbrev-ref", "HEAD"), "template-bank-refine-2026-11-03");
  assert.equal(git(repo, env, "log", "-1", "--format=%s"), "template-bank: refine 2026-11-03 (3 changes)");
  const files = git(repo, env, "show", "--name-only", "--format=", "HEAD").split("\n");
  assert.ok(files.every((f) => f.startsWith("neome-studio/reference/template-bank/")), files.join(", "));
  assert.ok(files.includes("neome-studio/reference/template-bank/reports/2026-11-03.md"), "report committed with the changes");
  assert.equal(git(repo, env, "rev-parse", "main"), git(repo, env, "rev-parse", "HEAD~1"), "main not moved: no merge");
  assert.equal(git(repo, env, "remote"), "", "no push target touched");
  assert.ok(existsSync(join(repo, "stray.txt")), "other work left alone");

  // Updated Build: same NB code, old tag sheets kept aside, re-tag needed.
  const ent = JSON.parse(readFileSync(acme, "utf8"));
  ent.payload.studioEnt.version = "xxy30tipDBW0IhSS0ve";
  ent.payload.studioEnt.versionCode = 8;
  writeFileSync(join(raw, "client-export.json"), JSON.stringify(ent));
  r = T("status");
  assert.match(r.out, /^build \| NB-01 \| updated \| vxxy30tipDBW0IhSS0ve \(tagged v7\)$/m);
  r = T("prepare", "--date", "2026-11-03");
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^tag \| NB-01 \| updated \| 3 areas \| /m);
  assert.match(r.out, /^run \| 2026-11-03-2 \| incremental/m);
  assert.ok(existsSync(join(raw, "tags-old", "NB-01-v7", "sales.yaml")), "old tag sheets kept aside");
  assert.deepEqual(readdirSync(join(raw, "tags", "NB-01")), []);
});

test("CLI: scrub hard fail stops prepare before any run; scrub word in the Template bank blocks commit", () => {
  const root = box();
  const env = gitEnv(root);
  const raw = join(root, "raw");
  mkdirSync(raw);
  const ent = JSON.parse(readFileSync(acme, "utf8"));
  ent.payload.studioEnt.spreadsheetMap.map["mss-prod"].details.name = "Ünicorn Parts";
  writeFileSync(join(raw, "b.json"), JSON.stringify(ent));
  const bank = emptyBank(join(root, "template-bank"));
  const T = (...a) => run([...a, "--raw", raw, "--bank", bank, "--catalog", CATALOG], { env });
  assert.equal(T("prepare", "--date", "2026-11-03").code, 3);
  const list = join(raw, "scrub", "NB-01.txt");
  writeFileSync(list, readFileSync(list, "utf8") + "Unicorn\n");
  const r = T("prepare", "--date", "2026-11-03");
  assert.equal(r.code, 1);
  assert.match(r.out, /^leak \| NB-01 \| \S+ \| word #5$/m);
  assert.match(r.out, /^stop \| scrub failed/m);
  assert.doesNotMatch(r.out, /nicorn/i);
  assert.equal(existsSync(join(raw, "runs")), false);
  assert.equal(existsSync(join(raw, "scrubbed", "NB-01")), false);

  // A Template bank entry holding a listed word: check fails, commit refuses, no branch.
  const repo = join(root, "repo");
  const b2 = writeBank(join(repo, "template-bank"), [PAT("PAT-unicorn-count", "Unicorn count", [row("NB-01", "Sales")])], ["- 2026-11-03 | add | PAT-unicorn-count | seen in NB-01"]);
  git(repo, env, "init", "-q");
  git(repo, env, "commit", "-q", "--allow-empty", "-m", "start");
  const dir = join(raw, "runs", "2026-11-03");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "run.json"), JSON.stringify({ run: "2026-11-03", date: "2026-11-03", mode: "incremental", builds: [] }));
  writeFileSync(join(dir, "applied.json"), JSON.stringify({ applied: [], dropped: [], autoRetired: [], rowsDropped: [], log: [] }));
  const U = (...a) => run([...a, "--raw", raw, "--bank", b2, "--catalog", CATALOG], { env });
  const c = U("check");
  assert.equal(c.code, 1);
  assert.match(c.out, /scrub word "Unicorn" found/);
  const cm = U("commit");
  assert.equal(cm.code, 1);
  assert.match(cm.out, /^stop \| check failed: nothing committed$/m);
  assert.equal(git(repo, env, "branch", "--list", "template-bank-refine-*"), "");
  assert.equal(git(repo, env, "rev-list", "--count", "HEAD"), "1");
});

test("validate-changes: invented proof, evidence from outside the run, missing draft, reused ID, one change per ID", () => {
  const root = box();
  const raw = join(root, "raw");
  const bank = writeBank(join(root, "template-bank"), START(), START_LOG);
  // NB-91 tag sheet (synthetic) + scrubbed area so the Build has a Widgets area.
  mkdirSync(join(raw, "tags", "NB-91"), { recursive: true });
  writeFileSync(join(raw, "tags", "NB-91", "widgets.yaml"), stringify({ build: "NB-91", area: "Widgets", file: "widgets.md", weight: "normal", templateModule: { name: "Widgets", proof: ["### Widget request"] }, patterns: [] }));
  const dir = join(raw, "runs", "2026-11-03");
  mkdirSync(dir, { recursive: true });
  const ctx = { raw, bankDir: bank, dir, builds: ["NB-91"], words: ["Zorbia"] };
  const p = (line) => [{ build: "NB-91", area: "Widgets", line }];
  const v = validateChanges([
    { change: "enhance", id: "TMOD-widgets", seenIn: [row("NB-91", "Widgets")], reason: "ok", proof: p("### Widget request") },
    { change: "enhance", id: "PAT-dusty", seenIn: [row("NB-92", "Desk")], reason: "x", proof: p("made up line") },
    { change: "add", id: "PAT-new-thing", seenIn: [row("NB-91", "Widgets")], reason: "y", proof: p("### Widget request") },
    { change: "add", id: "PAT-ancient", seenIn: [row("NB-91", "Nope")], reason: "z", proof: p("### Widget request") },
    { change: "retire", id: "TMOD-widgets", reason: "twice" },
    { change: "enhance", id: "PAT-sign-off-by-flag", seenIn: [], reason: "at Zorbia", proof: p("### Widget request"), extra: 1 },
  ], ctx);
  const all = v.errors.join("\n");
  assert.match(all, /change 2 \(enhance PAT-dusty\): proof 1: line not found in tag sheet NB-91 \/ Widgets/);
  assert.match(all, /change 2 \(enhance PAT-dusty\): seenIn row 1: NB-92 not in this run's tag sheets/);
  assert.match(all, /change 3 \(add PAT-new-thing\): drafts\/PAT-new-thing\.md missing/);
  assert.match(all, /change 4 \(add PAT-ancient\): PAT-ancient already used in Template bank or CHANGELOG\.md; IDs never reused/);
  assert.match(all, /change 4 \(add PAT-ancient\): seenIn row 1: NB-91 has no Build area "Nope"/);
  assert.match(all, /change 5 \(retire TMOD-widgets\): TMOD-widgets already used by change 1; one change per ID/);
  assert.match(all, /change 6 \(enhance PAT-sign-off-by-flag\): unknown key extra/);
  assert.match(all, /change 6 \(enhance PAT-sign-off-by-flag\): scrub word #1 found/);
  assert.doesNotMatch(all, /change 1 /, "the good change passes");
});

test("docs: driver names every command and stage; README lists the tool; studio never names it; prompts fill", () => {
  const driver = readFileSync(join(plugin, "maintainer", "refine-template-bank.md"), "utf8");
  const header = readFileSync(tool, "utf8").split("\nimport ")[0];
  for (const cmd of ["status", "prepare", "prompt", "validate-tags", "validate-changes", "decide", "answer", "apply", "tokens", "report", "check", "commit"]) {
    assert.match(header, new RegExp(`^//\\s+${cmd}\\b`, "m"), `script header lists ${cmd}`);
    assert.match(driver, new RegExp(`TOOL ${cmd}\\b`), `driver uses ${cmd}`);
  }
  for (const s of ["claudeAgent_claude_sales", "claudeAgent`", "acpRegistry_local_acp", "GLM-5.3-Flash", "GLM-5.3", "claude-sonnet-5-5", "claude-opus-5-5", "effort: \"medium\"", "effort: \"high\"", "isolation: \"shared\"", "template-bank-refine-<run>", "Never merge, never push"]) {
    assert.ok(driver.includes(s), `driver lacks ${s}`);
  }
  const readme = readFileSync(join(plugin, "README.md"), "utf8");
  assert.match(readme, /neome-studio\/maintainer\/refine-template-bank\.md/);
  assert.ok(!readFileSync(join(plugin, "skills", "studio", "SKILL.md"), "utf8").includes("refine-template-bank"), "studio never names the refine tool");
  for (const f of ["tag", "cluster", "review", "shapes"]) assert.ok(existsSync(join(plugin, "maintainer", "template-bank", "prompts", `${f}.md`)));
});

test("apply --full: entries the cluster did not re-list would retire → refused until --confirm-retire", () => {
  const root = box();
  const raw = join(root, "raw");
  const bank = writeBank(join(root, "template-bank"), START(), START_LOG);
  const dir = join(raw, "runs", "2026-11-04");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "run.json"), JSON.stringify({ run: "2026-11-04", date: "2026-11-04", mode: "full", builds: [] }));
  writeFileSync(join(dir, "changes.yaml"), stringify({ changes: [] }));
  writeFileSync(join(dir, "decisions.json"), "[]");
  const T = (...a) => run([...a, "--raw", raw, "--bank", bank, "--catalog", CATALOG, "--run", "2026-11-04"]);
  let r = T("apply");
  assert.equal(r.code, 1, r.out + r.err);
  assert.match(r.out, /^retire\? \| TMOD-widgets \| --full/m);
  assert.match(r.out, /re-run apply --confirm-retire/);
  assert.equal(loadBank(bank).entries.length, START().length, "Template bank unchanged");
  r = T("apply", "--confirm-retire");
  assert.equal(r.code, 0, r.out + r.err);
  assert.equal(loadBank(bank).entries.length, 0);
});
