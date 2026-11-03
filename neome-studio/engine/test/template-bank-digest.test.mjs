// Template bank slice 2: Build digest (maintainer/template-bank/digest.mjs). Synthetic fixture only
// (fixtures/template-bank/acme-build.json, made-up "Acme Widgets"); never client data.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assignCodes, digestBuild, parseBuild, pickBuilds, unknownKinds } from "../../maintainer/template-bank/digest.mjs";
import { assignAreas, ORPHANS } from "../../maintainer/template-bank/areas.mjs";
import { buildIndex } from "../../maintainer/template-bank/build-json.mjs";
import { extractKinds } from "../../maintainer/template-bank/extract-kinds.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..");
const tb = join(repo, "neome-studio", "maintainer", "template-bank");
const fixture = join(here, "fixtures", "template-bank", "acme-build.json");
const text = readFileSync(fixture, "utf8");
const load = () => parseBuild(text);
const box = () => mkdtempSync(join(tmpdir(), "neome-tb-digest-"));
const cli = (args, opts = {}) => {
  const r = spawnSync(process.execPath, [join(tb, "digest.mjs"), ...args], { encoding: "utf8", ...opts });
  return { code: r.status, out: r.stdout, err: r.stderr };
};

// ---------- Build area rule ----------

test("area rule: Module tag → Group votes → workflow → refs → Orphans", () => {
  const ent = load();
  const ix = buildIndex(ent);
  const ar = assignAreas(ent, ix);
  const areaOf = (sid) => ar.areas.get(ar.sheetArea.get(sid)).name;
  assert.equal(areaOf("mss-quote"), "Quotes", "Module tag beats a Group action");
  assert.equal(ar.how.get("mss-quote"), "direct");
  assert.equal(areaOf("mss-cust"), "Sales");
  assert.equal(areaOf("mss-order"), "Sales");
  assert.equal(areaOf("mss-line"), "Sales");
  assert.equal(ar.how.get("mss-line"), "workflow");
  assert.equal(areaOf("mss-prod"), "Sales");
  assert.equal(ar.how.get("mss-prod"), "refs");
  assert.equal(areaOf("mss-old"), ORPHANS);
  assert.equal(ar.reportArea.get("mrp-sum"), "mgp-sales", "report follows its sheet");
  assert.equal(ar.areas.get(ar.reportArea.get("mrp-old")).name, ORPHANS);
  const homes = Object.fromEntries([...ar.areas.values()].flatMap((a) => a.wfs.map((d) => [d.label, a.name])));
  assert.deepEqual(homes, { "Order approval": "Sales", "Nightly cleanup": ORPHANS }, "workflow home = event node's sheet");
  assert.deepEqual(ar.list.map((a) => [a.name, a.source]), [["Quotes", "Module"], ["Sales", "Group"], [ORPHANS, "none"]]);
});

test("area rule: Groups only (no Modules) → chat-only Groups listed, Module-less areas", () => {
  const ent = load();
  ent.moduleMap = { keys: [], map: {} };
  delete ent.formMap.map["mf-quote"].details.modules;
  const d = digestBuild(ent);
  assert.match(d.files["overview.md"], /^- chat-only Groups \(no actions\): Lobby$/m);
  assert.ok(!("quotes.md" in d.files));
  assert.match(d.files["sales.md"], /^### Quote$/m, "Quote now placed by its Group action");
});

// ---------- digest files ----------

test("digest: file set, overview, sizes", () => {
  const d = digestBuild(load());
  assert.deepEqual(Object.keys(d.files).sort(), [
    "build.mmd", "orphans-maybe-dead.md", "orphans-maybe-dead.refs.mmd", "orphans-maybe-dead.wf.mmd",
    "overview.md", "quotes.md", "quotes.refs.mmd", "sales.md", "sales.refs.mmd", "sales.wf.mmd",
  ]);
  const ov = d.files["overview.md"];
  assert.match(ov, /^# Build digest: Acme Widgets$/m);
  assert.match(ov, /^about: Acme Widgets sells .* · version 7$/m);
  assert.match(ov, /6 sheets · 2 roles · 3 actions · 2 reports · 2 groups · 2 vars · 2 workflows · 1 modules/);
  assert.match(ov, /^## Roles\nSales Rep, Manager$/m);
  assert.match(ov, /^- \[Sales\]\(sales\.md\): 4 sheets, 3 actions, 1 reports, 1 workflows · \d+\.\d KB$/m);
  assert.match(ov, /^- \[Orphans \(maybe dead\)\]\(orphans-maybe-dead\.md\): 1 sheets, 0 actions, 1 reports, 1 workflows/m);
  assert.match(ov, /^- Quotes → Sales \(1\)$/m);
  assert.match(ov, /^- Order Status: Draft \| Approved \| Rejected$/m);
  assert.doesNotMatch(ov, /chat-only/, "Module mode: no chat-only list (v2)");
  assert.doesNotMatch(Object.values(d.files).join("\n"), /legacy|automation/i, "automations dropped");
  assert.deepEqual(d.meta, { entId: "ent-acme01", version: 7, name: "Acme Widgets", about: load().details.about });
  assert.equal(d.stats.areas, 3);
  assert.equal(d.stats.orphanSheets, 1);
  assert.equal(d.stats.sheets, 6);
});

test("digest: area file shows actions, sheets, fields, logic, reports, other forms", () => {
  const s = digestBuild(load()).files["sales.md"];
  assert.match(s, /^# Build area: Sales\nBuild: Acme Widgets · area source: Group$/m);
  assert.match(s, /^- New order \[rowInsert → Order\] @Sales Rep, Manager$/m);
  assert.match(s, /^### Customer \(master\) — insert@Sales Rep read@Sales Rep, Manager$/m);
  assert.match(s, /^ {2}- Details: Name:text\*, Phone:mobileNumber, Kind:pickText\{Retail\|Wholesale\}$/m, "divider dropped");
  assert.match(s, /^ {2}- Details: Customer:ref→Customer, CustName:text⇐Name, Status:pickText\{Draft\|Approved\|Rejected\}\*, Amount:number, Approver:pickUser@Manager$/m);
  assert.match(s, /^ {2}- Lines \(grid\): Line:ref→Order Line$/m);
  assert.match(s, /^ {2}- logic \(3\): formula Amount = Details\.Amount \* 1\.1; visibility show approver: if Status hasValue; event onChange on status$/m);
  assert.match(s, /^### Order Line \(placed by workflow\)$/m);
  assert.match(s, /^### Product \(placed by refs\)$/m);
  assert.match(s, /^- Order Summary \[query\] from Order in:\? out:Summary Out$/m);
  assert.match(s, /^## Other forms \(report\/action input\/output\)\n- Summary Out: Total:number$/m);
  const q = digestBuild(load()).files["quotes.md"];
  assert.match(q, /area source: Module/);
  assert.match(q, /Customer:ref→Customer\(Sales\)/, "ref into other area names that area");
  const o = digestBuild(load()).files["orphans-maybe-dead.md"];
  assert.match(o, /^ORPHAN: .*Low weight for Pattern tagging\.$/m);
  assert.match(o, /^- Old Dump \[spreadsheet\] from Old Import/m);
});

test("workflow: tree from edgeMap with TRUE / FALSE / ITERATE branches, loop mark, condition, msg, schedule", () => {
  const d = digestBuild(load());
  const wf = d.files["sales.md"].split("## Workflows\n")[1];
  assert.equal(wf.trim(), [
    "### Workflow: Order approval (6 nodes)",
    "- eventSsUpdateAfter(Order)",
    "  - branchIfElse \"Approved?\" [if Curr.Status equalTo \"Approved\"]",
    "    - [TRUE] sendMessageToUsers \"Tell rep\" [msg \"Hi `Acme` team, order for Zorbia approved\"; to Curr.Approver]",
    "      - branchIterateGrid",
    "        - [ITERATE] rowInsert(Order Line)",
    "          - ↺ branchIterateGrid",
    "    - [FALSE] rowUpdate(Order) \"Mark rejected\"",
  ].join("\n"));
  assert.match(d.files["orphans-maybe-dead.md"], /^- eventSchedule \[every 1 day @02:00\]$/m);
  assert.match(d.files["orphans-maybe-dead.md"], /^ {2}- ssRemoveRows\(Old Import\) "Purge"$/m);
});

test("mermaid: build.mmd, refs.mmd, wf.mmd", () => {
  const f = digestBuild(load()).files;
  assert.equal(f["build.mmd"], [
    "%% Build: areas, cross-area refs", "flowchart LR",
    "  Ammdquotes[\"Quotes<br/>1 sheets · 0 wf\"]",
    "  Amgpsales[\"Sales<br/>4 sheets · 1 wf\"]",
    "  Aunassigned[\"Orphans  maybe dead <br/>1 sheets · 1 wf\"]",
    "  Ammdquotes -->|1| Amgpsales", "",
  ].join("\n"));
  assert.equal(f["quotes.refs.mmd"], [
    "%% Build area Quotes: sheet refs", "flowchart LR",
    "  Smssquote[\"Quote\"]",
    "  Smsscust([\"Customer · Sales\"])",
    "  Smssquote --> Smsscust", "",
  ].join("\n"));
  assert.match(f["sales.refs.mmd"], /^ {2}Smssorder --> Smssline$/m);
  const wf = f["sales.wf.mmd"];
  assert.match(wf, /^%% Order approval\nflowchart TD$/m);
  assert.match(wf, /^ {2}vanev\["eventSsUpdateAfter Order "\]$/m);
  assert.match(wf, /^ {2}vanif -->\|TRUE\| vanmsg$/m);
  assert.match(wf, /^ {2}vanif -->\|FALSE\| vanrej$/m);
  assert.match(wf, /^ {2}vanloop -->\|ITERATE\| vanline$/m);
  assert.match(wf, /^ {2}vanline --> vanloop$/m, "NEXT edges unlabelled");
  assert.match(wf, /^ {2}vanmsg\["sendMessageToUsers 'Tell rep'  msg 'Hi `Acme` team, order for Zorbia app[^"]*…"\]$/m, "labels cut at 80, no quotes inside");
  for (const [name, body] of Object.entries(f)) if (name.endsWith(".mmd")) {
    for (const l of body.split("\n").filter((l) => /\["/.test(l))) assert.match(l, /^\s+\w+\(?\["[^"]*"\]\)?$/, `${name}: bad label ${l}`);
  }
});

// ---------- dedupe, codes, kinds ----------

test("dedupe by entId + version; older version of same entId skipped", () => {
  const a = load(), b = load(), old = load(), other = load();
  old.version = 6;
  other.entId = "ent-other";
  const r = pickBuilds([{ file: "a.json", ent: a }, { file: "b.json", ent: b }, { file: "old.json", ent: old }, { file: "o.json", ent: other }]);
  assert.deepEqual(r.builds.map((x) => x.file), ["a.json", "o.json"]);
  assert.deepEqual(r.skipped, [{ file: "b.json", reason: "duplicate of a.json" }, { file: "old.json", reason: "older version than a.json" }]);
  const r2 = pickBuilds([{ file: "old.json", ent: old }, { file: "a.json", ent: a }]);
  assert.deepEqual(r2.builds.map((x) => x.file), ["a.json"], "newer version wins whatever the order");
});

test("real exports: version is a string ID, versionCode orders; same ID = duplicate", () => {
  const a = load(), b = load(), old = load();
  a.version = "RebpBQwnImW4kLcNjrv"; a.versionCode = 5;
  b.version = "RebpBQwnImW4kLcNjrv"; b.versionCode = 5;
  old.version = "sU85XXPpNanZmlpWpux"; old.versionCode = 1;
  const r = pickBuilds([{ file: "old.json", ent: old }, { file: "a.json", ent: a }, { file: "b.json", ent: b }]);
  assert.deepEqual(r.builds.map((x) => x.file), ["a.json"]);
  assert.deepEqual(r.skipped, [{ file: "old.json", reason: "older version than a.json" }, { file: "b.json", reason: "duplicate of a.json" }]);
});

test("Build codes: stable per entId, seeded from NB map by name, next free number", () => {
  const ents = [{ entId: "e1", details: { name: "One" } }, { entId: "e2", details: { name: "Two Co" } }, { entId: "e3", details: { name: "Three" } }];
  const reg = assignCodes(ents, { "NB-01": { entId: "e1", name: "One" } }, "NB-04 Two Co (file: x)\nNB-02 Other\n");
  assert.deepEqual(Object.keys(reg).sort(), ["NB-01", "NB-04", "NB-05"]);
  assert.equal(reg["NB-04"].entId, "e2");
  assert.equal(reg["NB-05"].entId, "e3");
  const again = assignCodes(ents, reg, "");
  assert.deepEqual(again, reg);
});

test("kinds dictionary: committed kinds.json matches docs/studio-ai-docs; unknown kinds reported", () => {
  const kinds = JSON.parse(readFileSync(join(tb, "kinds.json"), "utf8"));
  assert.deepEqual(extractKinds(join(repo, "docs", "studio-ai-docs")).kinds, kinds, "re-run extract-kinds.mjs");
  assert.equal(Object.keys(kinds).length, 24);
  assert.equal(Object.values(kinds).flat().length, 297);
  assert.deepEqual(unknownKinds(load(), kinds), []);
  const ent = load();
  ent.formMap.map["mf-prod"].compositeMap.map["msc-prod"].fieldMap.map["mfd-pname"].type = "hologram";
  ent.autoDiaMap.map["mad-nightly"].nodeMap["van-x"].kind = "teleport";
  assert.deepEqual(unknownKinds(ent, kinds), ["field hologram", "node teleport"]);
});

test("extract-kinds: ## kind / ### kind / variant headings, gaps reported", () => {
  const dir = box();
  writeFileSync(join(dir, "a.md"), "# T\n## `form`\n## `field`\n### `field / text`\n### `field / bool`\n### `field / text`\n### `stray / x`\n");
  const r = extractKinds(dir);
  assert.deepEqual(r.kinds, { form: [], field: ["text", "bool"], stray: ["x"] });
  assert.equal(r.skipped.length, 2);
});

// ---------- CLI ----------

test("CLI: writes only inside the raw dir, dedupes, keeps Build codes, warns nothing for known kinds", () => {
  const raw = join(box(), "raw");
  const inputs = box();
  writeFileSync(join(inputs, "first.json"), text);
  writeFileSync(join(inputs, "copy.json"), text);
  const r = cli(["--raw", raw, join(inputs, "first.json"), join(inputs, "copy.json")]);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /^skip \| copy\.json \| duplicate of first\.json$/m);
  assert.match(r.out, /^digest \| NB-01 \| \d+ KB json → overview [\d.]+ KB \+ 3 areas \(max [\d.]+ KB, total \d+ KB\) · modules 1 · orphan sheets 1\/6$/m);
  assert.doesNotMatch(r.out, /Acme/, "stdout carries codes, not names");
  assert.deepEqual(readdirSync(inputs).sort(), ["copy.json", "first.json"], "inputs untouched");
  const out = join(raw, "digests", "NB-01");
  assert.ok(existsSync(join(out, "overview.md")));
  assert.deepEqual(JSON.parse(readFileSync(join(out, "meta.json"), "utf8")).name, "Acme Widgets");
  assert.equal(JSON.parse(readFileSync(join(raw, "builds.json"), "utf8"))["NB-01"].entId, "ent-acme01");
  // default inputs = raw/*.json; same code on re-run; stale file of a Build's old run removed
  writeFileSync(join(raw, "again.json"), text);
  writeFileSync(join(out, "stale.md"), "x");
  const r2 = cli(["--raw", raw]);
  assert.equal(r2.code, 0, r2.err);
  assert.match(r2.out, /^digest \| NB-01 \|/m);
  assert.ok(!existsSync(join(out, "stale.md")));
});

test("CLI: refuses a raw dir inside a git repo that is not gitignored; bad args", () => {
  const repoDir = box();
  spawnSync("git", ["init", "-q", repoDir]);
  const raw = join(repoDir, "raw");
  mkdirSync(raw);
  writeFileSync(join(raw, "b.json"), text);
  const r = cli(["--raw", raw]);
  assert.equal(r.code, 2);
  assert.match(r.err, /not gitignored/);
  assert.ok(!existsSync(join(raw, "digests")));
  writeFileSync(join(repoDir, ".gitignore"), "raw/\n");
  assert.equal(cli(["--raw", raw]).code, 0);
  assert.equal(cli(["--nope"]).code, 2);
  const empty = join(box(), "raw");
  assert.equal(cli(["--raw", empty]).code, 1, "no Build JSON = error");
});

test("default raw dir is the gitignored .scratch/template-bank/raw", () => {
  const r = spawnSync("git", ["check-ignore", "-q", ".scratch/template-bank/raw/x.json"], { cwd: repo });
  assert.equal(r.status, 0);
});
