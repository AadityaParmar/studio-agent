// BRD release mode + change log, ticket 26.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { changeLog } from "../brd/changelog.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "brd");
const schema = JSON.parse(readFileSync(join(here, "..", "..", "skills", "build-brd", "references", "brd-data.schema.json"), "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: true, strictTypes: false }).compile(schema);

function enterprise(name) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-rel-")), "harbor-tiles");
  cpSync(join(fixtures, name), root, { recursive: true });
  return { engagement: join(root, "engagements", "crm"), agent: join(root, "engagements", "crm", "_agent") };
}

// Applies [[from, to], ...] swaps to files under the Engagement _agent/ (or ../../_agent/ for the Enterprise).
function edit(agent, edits) {
  for (const [rel, swaps] of Object.entries(edits)) {
    const file = join(agent, rel);
    let text = readFileSync(file, "utf8");
    for (const [from, to] of swaps) {
      assert.ok(text.includes(from), `fixture edit: "${from}" not in ${rel}`);
      text = text.replace(from, to);
    }
    writeFileSync(file, text);
  }
}

function run(engagement, ...args) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr, stderr: r.stderr };
}

const release = (engagement, summary) => run(engagement, "--mode", "release", "--summary", summary);
const snapshot = (engagement, n) => JSON.parse(readFileSync(join(engagement, "_agent", "brd", "versions", `v${n}.json`), "utf8"));
const page = (engagement, n) => readFileSync(join(engagement, "brd", `v${n}.html`), "utf8");
const warnings = (out) => out.split("\n").filter((l) => l.startsWith("warning"));
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// ---- two releases of the resolved fixture ----

const two = enterprise("resolved");
const v1run = release(two.engagement, "First draft for the sales head.");
const QUO = "modules/QUO-quotation/spec.md";
edit(two.agent, {
  [QUO]: [
    ["Priority: Must\nScope: Neome\nSources: CE-1, PL-1", "Priority: Should\nScope: Neome\nSources: CE-1, PL-1"],
    ["A discount over the limit needs", "A discount over 10% needs"],
    [
      "## 12 Neome mapping",
      "### QUO-04 — Quote expiry\n\nStatement: A Quote expires 30 days after sending. [QA-1]\nAcceptance:\n- An expired Quote cannot be accepted.\nPriority: Should\nScope: Neome\nSources: QA-1\nOIs: —\nProposed: no\n\n## 12 Neome mapping",
    ],
  ],
  "general.md": [["OIs: —\nProposed: yes", "OIs: —\nProposed: yes\nWithdrawn: Leads start fresh in Neome [QA-1]"]],
  "open-items.md": [
    ["| Over 10% | open | QN-2026-10-10 | |", "| Over 10% | closed | QN-2026-10-10 | QA-1 |"],
    ["| OI-03 | Who owns the price list in Tally? | All | Neomenta | | | open | | |", "| OI-03 | Who owns the price list in Tally? | All | Neomenta | | | open | | |\n| OI-04 | Do Leads need a region? | LEAD | Enterprise | | | open | | |"],
  ],
  "modules/LEAD-leads/ticket.md": [["status: resolved", "status: needs-revisit"]],
  "plan.md": [
    ["| go-live | Go-live and training | | |", "| go-live | Go-live and training | 5 | 6 |"],
    ["| UAT with the sales team | LEAD, QUO | (proposed, to confirm) |", "| UAT with the sales team | LEAD, QUO | QA-1 |"],
  ],
  "../../../_agent/GLOSSARY.md": [["_Source_: CE-1, QA-1 · _Status_: proposed", "_Source_: CE-1, QA-1 · _Status_: agreed"]],
});
const v2run = release(two.engagement, "Discount limit agreed; Lead migration dropped.");

test("first release: v1 snapshot + page, draft-for-review, summary stored, no changes", () => {
  assert.equal(v1run.code, 0, v1run.out);
  const v1 = snapshot(two.engagement, 1);
  assert.ok(validate(v1), JSON.stringify(validate.errors));
  assert.equal(v1.engagement.version, 1);
  assert.equal(v1.engagement.status, "draft-for-review");
  assert.deepEqual(v1.changelog, [
    { version: 1, date: v1.engagement.date, status: "draft-for-review", summary: "First draft for the sales head.", changes: [] },
  ]);
  assert.match(v1run.out, /released v1/);
});

test("second release: next integer, earlier entries copied forward", () => {
  assert.equal(v2run.code, 0, v2run.out);
  const v1 = snapshot(two.engagement, 1);
  const v2 = snapshot(two.engagement, 2);
  assert.ok(validate(v2), JSON.stringify(validate.errors));
  assert.equal(v2.engagement.version, 2);
  assert.equal(v2.changelog.length, 2);
  assert.deepEqual(v2.changelog[0], v1.changelog[0]);
  assert.equal(v2.changelog[1].summary, "Discount limit agreed; Lead migration dropped.");
  assert.deepEqual(readdirSync(join(two.engagement, "brd")).sort(), ["v1.html", "v2.html"]);
});

test("two releases → expected change-log entries", () => {
  const changes = snapshot(two.engagement, 2).changelog[1].changes;
  assert.deepEqual(
    changes.map((c) => [c.group, c.kind, c.text]),
    [
      ["modules", "needs-revisit", "LEAD: set to needs-revisit"],
      ["requirements", "changed", "QUO-01: priority Must→Should"],
      ["requirements", "changed", "QUO-02: statement changed"],
      ["requirements", "added", "QUO-04: added — Quote expiry"],
      ["requirements", "withdrawn", "GEN-02: withdrawn — Leads start fresh in Neome"],
      ["openItems", "closed", "OI-01: closed [QA-1]"],
      ["openItems", "raised", "OI-04: raised — Do Leads need a region?"],
      ["plan", "changed", "Plan phase uat (Testing and UAT): confirmed"],
      ["plan", "changed", "Plan phase go-live (Go-live and training): week from —→5; week to —→6"],
      ["glossary", "changed", 'Glossary "Quote": agreed'],
    ],
  );
  assert.deepEqual(changes.find((c) => c.id === "QUO-01").fields, ["priority"]);
});

test("v1 files are not touched by v2", () => {
  const v1 = snapshot(two.engagement, 1);
  assert.equal(v1.changelog.length, 1);
  assert.equal(v1.engagement.version, 1);
});

test("release page: version + status label, change log newest first, empty signature boxes", () => {
  const html = page(two.engagement, 2);
  assert.match(html, /<title>[^<]*v2[^<]*<\/title>/);
  const text = strip(html);
  assert.match(text, /v2 · Draft for review/);
  assert.doesNotMatch(text, /Working draft — not for circulation/);
  const versions = text.slice(text.indexOf("Versions and sign-off v2"));
  assert.ok(versions.indexOf("Discount limit agreed") < versions.indexOf("First draft for the sales head"), "newest first");
  assert.match(versions, /QUO-01: priority Must→Should/);
  for (const l of ["Name", "Role", "Signature", "Date"]) assert.match(html, new RegExp(`<span class="label">${l}</span><span class="line"></span>`));
  assert.equal((html.match(/class="signline"/g) ?? []).length, 16, "4 lines × 2 boxes × screen + print");
});

test("release warnings: plan phase without weeks or still proposed; withdrawn-only topic is uncovered", () => {
  assert.deepEqual(warnings(v1run.out), [
    "warning [plan] plan phase uat: still proposed (confirm it or change it)",
    "warning [plan] plan phase go-live: no weeks set (only the Consultant sets weeks)",
    "warning [plan] plan phase go-live: still proposed (confirm it or change it)",
  ]);
  // v2 set weeks and confirmed uat; withdrawing GEN-02 left migration uncovered.
  assert.deepEqual(warnings(v2run.out), [
    'warning [uncovered-topic] Across all Modules: topic "migration" is not covered (add a Requirement, N/A with a Source, or an Open Item)',
    "warning [plan] plan phase go-live: still proposed (confirm it or change it)",
  ]);
});

// ---- warnings and errors ----

test("release warns: uncovered Across all Modules topic, resolved Module not placed", () => {
  const e = enterprise("resolved");
  edit(e.agent, {
    "general.md": [["## Training\n\nN/A: The sales head trains the team in-house. [QA-1]\n\n", ""]],
    "plan.md": [["| workflow | Workflow set-up | 2 | 3 | Discount approval and reminders | QUO | CE-1 |", "| workflow | Workflow set-up | 2 | 3 | Discount approval and reminders | | CE-1 |"], ["| UAT with the sales team | LEAD, QUO |", "| UAT with the sales team | LEAD |"], ["| Price list sync with Tally | OI-03 | QUO |", "| Price list sync with Tally | OI-03 | |"]],
  });
  const r = release(e.engagement, "Test.");
  assert.equal(r.code, 0, r.out);
  const w = warnings(r.out);
  assert.ok(w.includes('warning [uncovered-topic] Across all Modules: topic "training" is not covered (add a Requirement, N/A with a Source, or an Open Item)'), r.out);
  assert.ok(w.includes("warning [plan] Module QUO is resolved but not in any plan phase or Not yet placed"), r.out);
  assert.ok(!w.some((x) => x.includes("Module LEAD")), r.out);
});

test("preview does not give release warnings", () => {
  const e = enterprise("resolved");
  const r = run(e.engagement);
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(warnings(r.out), []);
});

test("Not yet placed counts as placed for a resolved Module", () => {
  const e = enterprise("resolved");
  edit(e.agent, {
    "plan.md": [["| Discount approval and reminders | QUO | CE-1 |", "| Discount approval and reminders | | CE-1 |"], ["| UAT with the sales team | LEAD, QUO |", "| UAT with the sales team | LEAD |"]],
  });
  const r = release(e.engagement, "Test.");
  assert.equal(r.code, 0, r.out);
  assert.ok(!r.out.includes("Module QUO is resolved"), r.out);
});

test("GEN Requirement without acceptance: warning in preview, error at release", () => {
  const e = enterprise("resolved");
  edit(e.agent, { "general.md": [["Acceptance:\n- Every open Lead in the spreadsheet shows in Neome with its owner.\n", "Acceptance:\n"]] });
  const p = run(e.engagement);
  assert.equal(p.code, 0, p.out);
  assert.match(p.out, /warning \[completeness\] Across all Modules: GEN-02 has no acceptance criteria/);
  const r = release(e.engagement, "Test.");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /error \[completeness\] Across all Modules: GEN-02 has no acceptance criteria/);
  assert.match(r.out, /BRD version not released/);
  assert.equal(existsSync(join(e.engagement, "_agent", "brd", "versions")), false);
  assert.equal(existsSync(join(e.engagement, "brd", "v1.html")), false);
});

test("release may include in-progress Modules (completeness stays a warning)", () => {
  const e = enterprise("in-progress");
  const r = release(e.engagement, "Early look.");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warning \[completeness\] Module QUO \(in progress\)/);
  assert.equal(snapshot(e.engagement, 1).engagement.version, 1);
});

test("release needs --summary; --summary only with release", () => {
  const e = enterprise("resolved");
  for (const args of [["--mode", "release"], ["--mode", "release", "--summary", "  "]]) {
    const r = run(e.engagement, ...args);
    assert.equal(r.code, 2);
    assert.match(r.stderr, /release needs --summary/);
  }
  const r = run(e.engagement, "--summary", "x");
  assert.equal(r.code, 2);
  assert.match(r.stderr, /--summary is only for --mode release/);
});

test("a stray v<N>.html with no snapshot blocks the release (versions never change)", () => {
  const e = enterprise("resolved");
  mkdirSync(join(e.engagement, "brd"));
  writeFileSync(join(e.engagement, "brd", "v1.html"), "old");
  const r = release(e.engagement, "Test.");
  assert.equal(r.code, 1);
  assert.match(r.stderr, /v1 already exists/);
});

// ---- change log diff, unit ----

const base = () => ({
  modules: [
    { prefix: "ENQ", name: "Enquiries", status: "open", mapping: null, requirements: [] },
    { prefix: "QT", name: "Quotes", status: "claimed", mapping: { delivery: "configuration" }, requirements: [req("QT-01")] },
  ],
  general: { requirements: [], na: [], oiRefs: [] },
  openItems: [],
  glossary: [{ term: "Quote", definition: "A priced offer.", avoid: [], sources: ["CE-1"], proposed: true }],
});
function req(id, extra = {}) {
  return { id, title: "T", statement: "S", acceptance: ["A"], priority: "Must", scope: "neome", sources: ["CE-1"], ois: [], proposed: false, ...extra };
}

test("change log: merged, renamed, resolved, added Module; effective delivery change", () => {
  const prev = base();
  const cur = base();
  cur.modules[0].status = "merged-into:QUO";
  cur.modules[1] = { ...cur.modules[1], prefix: "QUO", formerly: "QT", status: "resolved", mapping: { delivery: "custom" } };
  cur.modules.push({ prefix: "SVC", name: "Service", status: "open", mapping: null, requirements: [] });
  assert.deepEqual(changeLog(prev, cur).map((c) => c.text), [
    "ENQ: merged into QUO",
    "QUO: renamed from QT",
    "QUO: resolved",
    "SVC: added (Service)",
    "QT-01: delivery configuration→custom",
  ]);
});

test("change log: every Requirement field counts; title alone does not", () => {
  const prev = base();
  const cur = base();
  cur.modules[1].requirements = [req("QT-01", { title: "New title", scope: "open", acceptance: ["A", "B"], delivery: "custom" })];
  const [c] = changeLog(prev, cur);
  assert.equal(c.text, "QT-01: acceptance changed; scope neome→open; delivery configuration→custom");
  assert.deepEqual(c.fields, ["acceptance", "scope", "delivery"]);
  const t = base();
  t.modules[1].requirements = [req("QT-01", { title: "Only the title" })];
  assert.deepEqual(changeLog(prev, t), []);
});

test("change log: withdrawn with other changes, reinstated, OI closed with answer", () => {
  const prev = base();
  prev.openItems = [{ id: "OI-01", question: "Q?", status: "open" }];
  const cur = base();
  cur.modules[1].requirements = [req("QT-01", { withdrawn: "Not needed [QA-1]", priority: "Could" })];
  cur.openItems = [{ id: "OI-01", question: "Q?", status: "closed", answer: "Yes", answerSource: "QA-1" }];
  assert.deepEqual(changeLog(prev, cur).map((c) => [c.kind, c.text]), [
    ["withdrawn", "QT-01: withdrawn — Not needed [QA-1]; priority Must→Could"],
    ["closed", "OI-01: closed — Yes [QA-1]"],
  ]);
  assert.deepEqual(changeLog(cur, prev).map((c) => c.text)[0], "QT-01: priority Could→Must; reinstated");
});

test("change log: plan and glossary added / removed", () => {
  const prev = base();
  const cur = base();
  cur.plan = { phases: [{ id: "p1", name: "One", weekFrom: 1, weekTo: 2, covers: "", modules: [], sources: [], proposed: true }], notPlaced: [] };
  cur.glossary = [{ term: "Lead", definition: "A person.", avoid: [], sources: ["CE-1"], proposed: false }];
  assert.deepEqual(changeLog(prev, cur).map((c) => c.text), ["Implementation plan: added", 'Glossary "Lead": added', 'Glossary "Quote": removed']);
  const later = structuredClone(cur);
  later.plan.phases = [];
  later.plan.notPlaced = [{ text: "Tally sync", ois: [], modules: [], sources: [], proposed: true }];
  assert.deepEqual(changeLog(cur, later).map((c) => c.text), ["Plan phase p1 (One): removed", 'Not yet placed "Tally sync": added']);
});

test("change log: no previous version → no changes", () => {
  assert.deepEqual(changeLog(null, base()), []);
});
