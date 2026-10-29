// BRD Sign-off mode, ticket 27.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { proposedItems, applySignedOff, signOffBlockers } from "../brd/signoff.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "brd");
const schema = JSON.parse(readFileSync(join(here, "..", "..", "skills", "build-brd", "references", "brd-data.schema.json"), "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: true, strictTypes: false }).compile(schema);

function enterprise(name) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-so-")), "harbor-tiles");
  cpSync(join(fixtures, name), root, { recursive: true });
  return { root, engagement: join(root, "engagements", "crm"), agent: join(root, "engagements", "crm", "_agent") };
}

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

// The signed copy, registered as a Source (as ingest would).
const addEvidence = (e, id = "SO-1") =>
  appendFileSync(join(e.root, "_agent", "sources.md"), `| ${id} | sign-off | Signed BRD v1 | 2026-10-28 | inputs/${id}-signed.pdf | crm | |\n`);

function run(engagement, ...args) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr, stderr: r.stderr };
}
const release = (engagement, summary = "For review.") => run(engagement, "--mode", "release", "--summary", summary);
const SIGNERS = ["--signers", "Asha Rao | Sales head | 2026-10-28", "Ravi Menon | Consultant | 2026-10-28"];
const signOff = (engagement, evidence = "SO-1") => run(engagement, "--mode", "sign-off", ...SIGNERS, "--evidence", evidence);
const file = (engagement, ...p) => join(engagement, ...p);
const snapshotFile = (engagement, n) => file(engagement, "_agent", "brd", "versions", `v${n}.json`);
const snapshot = (engagement, n) => JSON.parse(readFileSync(snapshotFile(engagement, n), "utf8"));
const pageOf = (engagement, n) => readFileSync(file(engagement, "brd", `v${n}.html`), "utf8");
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// ---- signed, then later builds ----

const s = enterprise("resolved");
const rel1 = release(s.engagement, "First draft for the sales head.");
const v1Released = readFileSync(snapshotFile(s.engagement, 1), "utf8");
addEvidence(s);
const signed = signOff(s.engagement);
const v1Signed = { json: readFileSync(snapshotFile(s.engagement, 1), "utf8"), html: pageOf(s.engagement, 1) };
const again = signOff(s.engagement);

test("sign-off stamps the released version: status, signers, evidence, schema-valid", () => {
  assert.equal(rel1.code, 0, rel1.out);
  assert.equal(signed.code, 0, signed.out);
  assert.match(signed.out, /signed off v1 \(2 Open Item\(s\) open at sign-off, 16 proposed item\(s\) accepted\)/);
  const v1 = snapshot(s.engagement, 1);
  assert.ok(validate(v1), JSON.stringify(validate.errors));
  assert.equal(v1.engagement.version, 1);
  assert.equal(v1.engagement.status, "signed-off");
  assert.equal(v1.changelog[0].status, "signed-off", "signed entry carries its own status (next release copies it as stored)");
  assert.deepEqual(v1.signOff.enterpriseSigner, { name: "Asha Rao", role: "Sales head", date: "2026-10-28" });
  assert.deepEqual(v1.signOff.neomentaSigner, { name: "Ravi Menon", role: "Consultant", date: "2026-10-28" });
  assert.equal(v1.signOff.evidence, "SO-1");
  assert.ok(v1.sources.some((x) => x.id === "SO-1"), "evidence Source is in the snapshot");
  // Everything else is as released.
  const before = JSON.parse(v1Released);
  for (const k of ["modules", "general", "plan", "glossary", "process", "openItems"]) assert.deepEqual(v1[k], before[k], k);
});

test("sign-off block: Open Items open at sign-off and proposed items accepted", () => {
  const { signOff: block } = snapshot(s.engagement, 1);
  assert.deepEqual(block.openAtSignOff, ["OI-01", "OI-03"]);
  assert.deepEqual(block.acceptedProposed, [
    "glossary[Quote]",
    "process.steps[approve-discount]",
    "process.edges[draft-quote→approve-discount]",
    "modules[LEAD].records[Lead].fields[Company]",
    "modules[LEAD].exceptions[0]",
    "modules[LEAD].requirements[LEAD-02]",
    "modules[QUO].roles[Sales head]",
    "modules[QUO].statuses[pending-approval]",
    "modules[QUO].transitions[draft→pending-approval]",
    "modules[QUO].transitions[pending-approval→sent]",
    "modules[QUO].rules[Discount approval]",
    "modules[QUO].requirements[QUO-02]",
    "general.requirements[GEN-02]",
    "plan.phases[uat]",
    "plan.phases[go-live]",
    "plan.notPlaced[0]",
  ]);
});

test("signed page: Signed off, signer names instead of empty boxes, both lists, accepted chips", () => {
  const html = v1Signed.html;
  const text = strip(html);
  assert.match(text, /v1 · Signed off/);
  assert.doesNotMatch(html, /class="signline"/);
  assert.match(text, /Asha Rao , Sales head/);
  assert.match(text, /Ravi Menon , Consultant/);
  assert.match(text, /Evidence: SO-1/);
  assert.match(text, /Open at sign-off OI-01 OI-03/);
  assert.match(text, /Accepted on sign-off .* QUO-02 .* glossary\[Quote\]|Accepted on sign-off .* glossary\[Quote\] .* QUO-02/);
  assert.doesNotMatch(text, /proposed, to confirm/);
  assert.match(text, /proposed, accepted on sign-off/);
  assert.match(html, /<div class="m"><div class="num">\d+<\/div><div class="lab">Must<\/div>/);
});

test("re-run on a signed version refuses; files never change", () => {
  assert.equal(again.code, 1);
  assert.match(again.stderr, /v1 is already signed off; signed versions never change/);
  assert.equal(readFileSync(snapshotFile(s.engagement, 1), "utf8"), v1Signed.json);
  assert.equal(pageOf(s.engagement, 1), v1Signed.html);
});

// Next builds after Sign-off.
const pre = run(s.engagement);
const live = JSON.parse(readFileSync(file(s.engagement, "_agent", "brd", "brd-data.json"), "utf8"));
edit(s.agent, {
  "modules/LEAD-leads/spec.md": [["- Duplicate phone number: warn and link to the existing Lead. (proposed, to confirm)", "- Duplicate phone number: block the save. (proposed, to confirm)"]],
  "open-items.md": [["| Over 10% | open | QN-2026-10-10 | |", "| Over 10% | closed | QN-2026-10-10 | QA-1 |"]],
});
const rel2 = release(s.engagement, "Discount limit agreed.");

test("next build clears proposed on everything in the signed version; glossary terms become agreed", () => {
  assert.equal(pre.code, 0, pre.out);
  assert.match(pre.out, /v1 is signed off; 16 item\(s\) accepted then are no longer proposed/);
  assert.ok(validate(live), JSON.stringify(validate.errors));
  assert.deepEqual(proposedItems(live), []);
  const quote = live.glossary.find((t) => t.term === "Quote");
  assert.equal(quote.proposed, false);
  assert.deepEqual(quote.sources, ["CE-1", "QA-1", "SO-1"]);
  const quo02 = live.modules.find((m) => m.prefix === "QUO").requirements.find((r) => r.id === "QUO-02");
  assert.equal(quo02.proposed, false);
  assert.deepEqual(quo02.sources, ["CE-1", "SO-1"], "accepted item cites the sign-off evidence");
  assert.ok(live.sources.some((x) => x.id === "SO-1"));
  const chips = readFileSync(file(s.engagement, "brd", "preview.html"), "utf8").match(/proposed, to confirm/g) ?? [];
  assert.equal(chips.length, 2, "only the How to read legend (screen + print) keeps the chip");
});

test("later changes go into a new draft-for-review version; changed proposals stay proposed", () => {
  assert.equal(rel2.code, 0, rel2.out);
  const v2 = snapshot(s.engagement, 2);
  assert.ok(validate(v2), JSON.stringify(validate.errors));
  assert.equal(v2.engagement.status, "draft-for-review");
  assert.equal(v2.signOff, undefined);
  assert.deepEqual(v2.changelog[0], snapshot(s.engagement, 1).changelog[0], "signed entry copied as stored");
  assert.equal(v2.changelog[0].status, "signed-off");
  assert.equal(v2.changelog[1].status, "draft-for-review");
  // The edited exception is a new proposal; everything else accepted at v1 is agreed.
  assert.deepEqual(proposedItems(v2).map((x) => x.ref), ["modules[LEAD].exceptions[0]"]);
  assert.deepEqual(
    v2.changelog[1].changes.map((c) => c.text),
    [
      "OI-01: closed [QA-1]",
      "Plan phase uat (Testing and UAT): confirmed",
      "Plan phase go-live (Go-live and training): confirmed",
      'Not yet placed "Price list sync with Tally": confirmed',
      'Glossary "Quote": agreed',
    ],
  );
  // v1 frozen.
  assert.equal(readFileSync(snapshotFile(s.engagement, 1), "utf8"), v1Signed.json);
  assert.equal(pageOf(s.engagement, 1), v1Signed.html);
});

test("superseded is derived on the page, not stored", () => {
  const text = strip(pageOf(s.engagement, 2));
  assert.match(text, /v1 Signed off · superseded/);
  assert.match(text, /v2 Draft for review/);
  assert.doesNotMatch(readFileSync(snapshotFile(s.engagement, 2), "utf8"), /superseded/);
});

test("signing the new version: v2 lists only what is still proposed", () => {
  const r = signOff(s.engagement);
  assert.equal(r.code, 0, r.out);
  const v2 = snapshot(s.engagement, 2);
  assert.deepEqual(v2.signOff.acceptedProposed, ["modules[LEAD].exceptions[0]"]);
  assert.deepEqual(v2.signOff.openAtSignOff, ["OI-03"]);
  assert.deepEqual(v2.changelog.map((c) => c.status), ["signed-off", "signed-off"]);
});

// ---- blocked cases: each exits 1, names the problem, leaves the version as released ----

function blocked(name, setup, expected) {
  test(`sign-off blocked: ${name}`, () => {
    const e = enterprise(setup.fixture ?? "resolved");
    if (setup.edits) edit(e.agent, setup.edits);
    const r1 = release(e.engagement);
    assert.equal(r1.code, 0, r1.out);
    const before = { json: readFileSync(snapshotFile(e.engagement, 1), "utf8"), html: pageOf(e.engagement, 1) };
    if (setup.evidence !== false) addEvidence(e);
    const r = signOff(e.engagement, setup.evidenceId);
    assert.equal(r.code, 1, r.out);
    for (const line of expected) assert.ok(r.stderr.includes(line), `missing "${line}" in:\n${r.stderr}`);
    assert.match(r.stderr, /v1 not signed off/);
    assert.equal(readFileSync(snapshotFile(e.engagement, 1), "utf8"), before.json);
    assert.equal(pageOf(e.engagement, 1), before.html);
  });
}

blocked("Module not resolved or merged", { fixture: "in-progress" }, [
  "error [sign-off] Module QUO is claimed; every Module must be resolved or merged",
  "error [sign-off] Module SVC is open; every Module must be resolved or merged",
]);
blocked("Across all Modules topic not covered", { edits: { "general.md": [["## Training\n\nN/A: The sales head trains the team in-house. [QA-1]\n\n", ""]] } }, [
  'error [sign-off] Across all Modules: topic "training" is not covered',
]);
blocked("Requirement with priority TBC", { edits: { "modules/QUO-quotation/spec.md": [["Priority: Must\nScope: Neome\nSources: CE-1, PL-1", "Priority: TBC\nScope: Neome\nSources: CE-1, PL-1"]] } }, [
  "error [sign-off] QUO-01: priority is TBC",
]);
blocked("Must Requirement with scope Open", { edits: { "modules/QUO-quotation/spec.md": [["Priority: Must\nScope: Neome\nSources: CE-1, PL-1", "Priority: Must\nScope: Open\nSources: CE-1, PL-1"]] } }, [
  "error [sign-off] QUO-01: Must Requirement with scope Open",
]);
blocked("evidence Source not in the register", { evidence: false }, [
  "error [missing-source] evidence Source SO-1 is not in the Source register",
]);

test("sign-off with no released version refuses", () => {
  const e = enterprise("resolved");
  addEvidence(e);
  const r = signOff(e.engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /no released BRD version to sign off/);
});

test("sign-off arguments: signers and evidence required and well-formed; only for sign-off", () => {
  const e = enterprise("resolved");
  const cases = [
    [["--mode", "sign-off", "--evidence", "SO-1"], /sign-off needs --signers/],
    [["--mode", "sign-off", "--signers", "Asha Rao | Sales head | 2026-10-28", "Ravi | Consultant", "--evidence", "SO-1"], /Neomenta signer must be/],
    [["--mode", "sign-off", "--signers", "Asha Rao | Sales head | 2026-02-30", "Ravi | Consultant | 2026-10-28", "--evidence", "SO-1"], /Enterprise signer must be/],
    [["--mode", "sign-off", ...SIGNERS], /sign-off needs --evidence/],
    [["--mode", "sign-off", ...SIGNERS, "--evidence", "SO-1", "--summary", "x"], /--summary is only for --mode release/],
    [["--evidence", "SO-1"], /--signers and --evidence are only for --mode sign-off/],
  ];
  for (const [args, msg] of cases) {
    const r = run(e.engagement, ...args);
    assert.equal(r.code, 2, args.join(" "));
    assert.match(r.stderr, msg);
  }
});

// ---- unit ----

test("proposed items: withdrawn Requirements, merged Modules and disputed terms are not accepted", () => {
  const data = {
    glossary: [
      { term: "A", proposed: true, sources: [] },
      { term: "B", proposed: true, sources: [], disputed: "OI-01" },
    ],
    modules: [
      { prefix: "ENQ", status: "merged-into:QUO", requirements: [{ id: "ENQ-01", proposed: true, sources: [] }] },
      { prefix: "QUO", status: "resolved", requirements: [{ id: "QUO-01", proposed: true, sources: [] }, { id: "QUO-02", proposed: true, sources: [], withdrawn: "x" }] },
    ],
  };
  assert.deepEqual(proposedItems(data).map((x) => x.ref), ["glossary[A]", "modules[QUO].requirements[QUO-01]"]);
});

test("after sign-off: only accepted, unchanged items are cleared", () => {
  const signedData = {
    glossary: [{ term: "A", definition: "x", proposed: true, sources: [] }, { term: "B", definition: "y", proposed: true, sources: [] }],
    signOff: { evidence: "SO-1", acceptedProposed: ["glossary[A]", "glossary[B]"] },
  };
  const cur = {
    glossary: [
      { term: "A", definition: "x", proposed: true, sources: ["CE-1"] },
      { term: "B", definition: "changed", proposed: true, sources: [] },
      { term: "C", definition: "new", proposed: true, sources: [] },
    ],
  };
  assert.deepEqual(applySignedOff(cur, signedData), ["glossary[A]"]);
  assert.deepEqual(cur.glossary.map((t) => [t.term, t.proposed, t.sources]), [
    ["A", false, ["CE-1", "SO-1"]],
    ["B", true, []],
    ["C", true, []],
  ]);
});

test("blockers include GEN Requirements and skip withdrawn ones", () => {
  const data = {
    modules: [],
    general: {
      requirements: [
        { id: "GEN-01", topic: "access", priority: "TBC", scope: "neome" },
        { id: "GEN-02", topic: "access", priority: "TBC", scope: "neome", withdrawn: "x" },
        { id: "GEN-03", topic: "access", priority: "Should", scope: "open" },
      ],
      na: ["localisation", "hosting", "migration", "training", "support", "other"].map((topic) => ({ topic, sources: ["CE-1"] })),
      oiRefs: [],
    },
  };
  assert.deepEqual(signOffBlockers(data).map((b) => b.msg), ["GEN-01: priority is TBC (set Must, Should, Could or Won't)"]);
});
