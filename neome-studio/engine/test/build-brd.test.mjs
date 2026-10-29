import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "brd");
const schema = JSON.parse(readFileSync(join(here, "..", "..", "skills", "build-brd", "references", "brd-data.schema.json"), "utf8"));

// Copies a fixture Enterprise to a temp folder and applies edits.
// edits: { "<path from Engagement _agent/ or ../../_agent/>": [[from, to], ...] }
function enterprise(name, edits = {}) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-brd-")), "harbor-tiles");
  cpSync(join(fixtures, name), root, { recursive: true });
  const agent = join(root, "engagements", "crm", "_agent");
  for (const [rel, swaps] of Object.entries(edits)) {
    const file = join(agent, rel);
    let text = readFileSync(file, "utf8");
    for (const [from, to] of swaps) {
      assert.ok(text.includes(from), `fixture edit: "${from}" not in ${rel}`);
      text = text.replace(from, to);
    }
    writeFileSync(file, text);
  }
  return { root, engagement: join(root, "engagements", "crm"), agent };
}

function build(engagement, ...args) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement, ...args], { encoding: "utf8" });
  const out = join(engagement, "_agent", "brd", "brd-data.json");
  return {
    code: r.status,
    out: r.stdout + r.stderr,
    stderr: r.stderr,
    data: existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null,
  };
}

const LEAD = "modules/LEAD-leads/spec.md";
const QUO = "modules/QUO-quotation/spec.md";

// Walks every object in the data.
function* objects(v, path = "") {
  if (Array.isArray(v)) for (const [i, x] of v.entries()) yield* objects(x, `${path}[${i}]`);
  else if (v && typeof v === "object") {
    yield [path, v];
    for (const [k, x] of Object.entries(v)) yield* objects(x, `${path}.${k}`);
  }
}

// ---- valid Engagements ----

test("valid fully resolved Engagement builds a schema-valid data file with no warnings", () => {
  const r = build(enterprise("resolved").engagement);
  assert.equal(r.code, 0, r.out);
  assert.doesNotMatch(r.out, /^(warning|error)/m);
  const validate = new Ajv2020({ allErrors: true, strictTypes: false }).compile(schema);
  assert.ok(validate(r.data), JSON.stringify(validate.errors));
  assert.equal(r.data.schemaVersion, schema.properties.schemaVersion.const);
  assert.match(r.data.schemaVersion, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(r.data.enterprise, { id: "harbor-tiles", name: "Harbor Tiles" });
  assert.equal(r.data.engagement.slug, "crm");
  assert.equal(r.data.engagement.title, "Sales CRM");
  assert.equal(r.data.engagement.version, null);
  assert.equal(r.data.engagement.status, "working-draft");
});

test("data file carries every Module spec section", () => {
  const { data } = build(enterprise("resolved").engagement);
  const lead = data.modules.find((m) => m.prefix === "LEAD");
  for (const key of ["purpose", "kpis", "asIs", "roles", "records", "statuses", "transitions", "rules", "exceptions",
    "reports", "integrations", "volumes", "requirements", "mapping", "oiRefs"]) {
    assert.ok(key in lead, `LEAD missing ${key}`);
  }
  assert.equal(lead.name, "Leads");
  assert.match(lead.purpose.text, /Track every tile enquiry/);
  assert.equal(lead.kpis.length, 1);
  assert.equal(lead.roles.length, 2);
  assert.deepEqual(lead.statuses.map((s) => [s.id, s.start, s.end]), [
    ["new", true, false], ["qualified", false, false], ["dropped", false, true], ["quoted", false, true],
  ]);
  assert.equal(lead.transitions.length, 3);
  assert.equal(lead.rules[0].action, "Notify owner");
  assert.equal(lead.exceptions.length, 1);
  assert.equal(lead.reports[0].audience, "Sales head");
  assert.deepEqual(lead.integrations, []);
  assert.equal(lead.volumes.length, 1);
  assert.deepEqual(lead.mapping, { neomeApp: "lead-management", delivery: "configuration", how: "Lead Management with a custom channel list and reminder rule.", indicative: true });
  assert.deepEqual(lead.oiRefs, ["OI-02"]);

  const fields = lead.records.find((r) => r.entity === "Lead").fields;
  const channel = fields.find((f) => f.name === "Source channel");
  assert.equal(channel.type, "choice");
  assert.equal(channel.required, true);
  assert.deepEqual(channel.choices, ["Walk-in", "Phone", "Website"]);
  assert.equal(fields.find((f) => f.name === "Company").linkTo, "Customer");

  const quo = data.modules.find((m) => m.prefix === "QUO");
  assert.deepEqual(quo.integrations.map((i) => [i.system, i.direction, i.owner]), [["Tally ERP", "out", "Accounts"]]);
  assert.equal(quo.statuses.find((s) => s.id === "pending-approval").oi, "OI-01");
  const r1 = quo.requirements.find((r) => r.id === "QUO-01");
  assert.deepEqual(r1.acceptance, ["Quote lines take the current list price.", "Quote links back to its Lead."]);
  assert.equal(r1.priority, "Must");
  assert.equal(r1.scope, "neome");
  assert.deepEqual(r1.sources, ["CE-1", "PL-1"]);
  assert.equal(quo.requirements.find((r) => r.id === "QUO-02").delivery, "custom");
});

test("process, Open Items, Sources and glossary are carried", () => {
  const { data } = build(enterprise("resolved").engagement);
  assert.deepEqual(data.process.lanes.map((l) => [l.id, l.kind]), [["sales", "person"], ["head", "person"], ["tally", "external"]]);
  assert.equal(data.process.lanes.find((l) => l.id === "tally").oi, "OI-03");
  const step = data.process.steps.find((s) => s.id === "approve-discount");
  assert.deepEqual([step.lane, step.module, step.kind, step.oi], ["head", "QUO", "decision", "OI-01"]);
  assert.equal(data.process.steps.find((s) => s.id === "post-invoice").module, null);
  assert.deepEqual(data.process.edges.filter((e) => e.alternate).map((e) => `${e.from}>${e.to}`), ["qualify>capture-lead", "draft-quote>approve-discount"]);

  const oi1 = data.openItems.find((o) => o.id === "OI-01");
  assert.deepEqual(oi1, {
    id: "OI-01", question: "Which discount needs the sales head to approve?", modules: ["QUO"], owner: "enterprise",
    status: "open", askedIn: ["QN-2026-10-10"], suggested: "Over 10%", askTo: "Sales head",
  });
  assert.equal(data.openItems.find((o) => o.id === "OI-02").answerSource, "QA-1");
  assert.deepEqual(data.openItems.find((o) => o.id === "OI-03").modules, ["All"]);

  // Only this Engagement's Sources and glossary terms.
  assert.deepEqual(data.sources.map((s) => s.id), ["CE-1", "QA-1", "PL-1"]);
  assert.equal(data.sources.find((s) => s.id === "PL-1").confidential, true);
  assert.deepEqual(data.glossary.map((t) => t.term), ["Lead", "Quote"]);
  assert.deepEqual(data.glossary.find((t) => t.term === "Lead").avoid, ["Prospect", "enquiry"]);
  assert.equal(data.glossary.find((t) => t.term === "Quote").proposed, true);
});

test("a Source from another Engagement is included when this Engagement cites it", () => {
  const { data, code, out } = build(enterprise("resolved", { [LEAD]: [["- About 300 new Leads a month. [CE-1]", "- About 300 new Leads a month. [WH-1]"]] }).engagement);
  assert.equal(code, 0, out);
  assert.ok(data.sources.some((s) => s.id === "WH-1"));
});

test("every fact object carries sources and proposed; any proposed part makes it proposed", () => {
  const { data } = build(enterprise("resolved").engagement);
  const factKeys = ["glossary", "lanes", "steps", "edges", "kpis", "asIs", "roles", "fields", "statuses", "transitions",
    "rules", "exceptions", "reports", "integrations", "volumes", "requirements"];
  let count = 0;
  for (const [path, obj] of objects(data)) {
    if (!factKeys.some((k) => new RegExp(`\\.${k}\\[\\d+\\]$`).test(path)) && !path.endsWith(".purpose")) continue;
    count++;
    assert.ok(Array.isArray(obj.sources), `${path} has no sources`);
    assert.equal(typeof obj.proposed, "boolean", `${path} has no proposed`);
    if (!obj.proposed) assert.ok(obj.sources.length >= 1, `${path} is not proposed but has no Source`);
  }
  assert.ok(count > 40, `only ${count} fact objects checked`);
  const quo = data.modules.find((m) => m.prefix === "QUO");
  const head = quo.roles.find((r) => r.role === "Sales head");
  assert.deepEqual([head.sources, head.proposed], [["CE-1"], true]);
  const lead = data.modules.find((m) => m.prefix === "LEAD");
  assert.equal(lead.records[0].fields.find((f) => f.name === "Company").proposed, true);
  assert.equal(lead.requirements.find((r) => r.id === "LEAD-02").proposed, true);
});

test("derived values are never stored", () => {
  const { data } = build(enterprise("resolved").engagement);
  const banned = /^(fit|fitTable|metrics?|progress|percent|counts?|total|totals|totalWeeks|mermaid|diagram|svg|superseded)$/i;
  for (const [path, obj] of objects(data)) {
    for (const key of Object.keys(obj)) assert.doesNotMatch(key, banned, `${path}.${key} is derived`);
  }
  assert.doesNotMatch(JSON.stringify(data), /flowchart|stateDiagram/);
});

test("withdrawn Requirements and merged or renamed Modules are kept", () => {
  const { data } = build(enterprise("resolved").engagement);
  const quo = data.modules.find((m) => m.prefix === "QUO");
  const withdrawn = quo.requirements.find((r) => r.id === "QUO-03");
  assert.equal(withdrawn.withdrawn, "Enterprise sends Quotes by WhatsApp only");
  assert.ok(withdrawn.sources.includes("QA-1"));
  assert.equal(quo.formerly, "QT");
  const enq = data.modules.find((m) => m.prefix === "ENQ");
  assert.equal(enq.status, "merged-into:LEAD");
  assert.equal(enq.requirements[0].id, "ENQ-01");
  assert.deepEqual(data.modules.map((m) => m.prefix), ["LEAD", "QUO", "ENQ"]);
});

test("valid in-progress Engagement builds with completeness warnings", () => {
  const r = build(enterprise("in-progress").engagement);
  assert.equal(r.code, 0, r.out);
  assert.match(r.stderr, /warning \[completeness\] Module QUO \(in progress\): QUO-02 has no acceptance criteria/);
  assert.match(r.stderr, /warning \[completeness\] Module QUO \(in progress\): spec section "Neome mapping" missing/);
  assert.match(r.stderr, /warning \[completeness\] Module SVC \(in progress\): spec\.md missing/);
  assert.doesNotMatch(r.stderr, /Module LEAD/);
  assert.doesNotMatch(r.stderr, /^error/m);
  const svc = r.data.modules.find((m) => m.prefix === "SVC");
  assert.equal(svc.name, "After-sales service");
  assert.equal(svc.status, "open");
  assert.deepEqual(svc.requirements.map((q) => [q.id, q.priority, q.scope]), [["SVC-01", "TBC", "open"]]);
  assert.equal(svc.mapping, null);
  const quo2 = r.data.modules.find((m) => m.prefix === "QUO").requirements.find((q) => q.id === "QUO-02");
  assert.deepEqual([quo2.proposed, quo2.sources, quo2.acceptance], [true, [], []]);
});

// ---- completeness ----

test("resolved Module missing acceptance is an error", () => {
  const e = enterprise("resolved", {
    [LEAD]: [["Acceptance:\n- Reminder arrives on day 3 with no activity.\n", ""]],
  });
  const r = build(e.engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[completeness\] Module LEAD \(resolved\): LEAD-02 has no acceptance criteria/);
  assert.equal(r.data, null, "data file must not be written on error");
});

test("resolved Module missing a spec section is an error", () => {
  const r = build(enterprise("resolved", { [LEAD]: [["## 7 Exceptions", "## 7 Oddities"]] }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[completeness\] Module LEAD \(resolved\): spec section "Exceptions" missing/);
});

// ---- Layer 2: broken references ----

const broken = [
  ["missing Source", { [QUO]: [["Sources: CE-1, PL-1", "Sources: CE-1, XX-9"]] }, /error \[missing-source\] Source XX-9 is cited but not in the Source register \(cited in Module QUO\)/],
  ["missing Source on an Open Item answer", { "open-items.md": [["| QA-1 |", "| QA-7 |"]] }, /error \[missing-source\] Source QA-7 .*open-items/],
  ["missing OI", { [LEAD]: [["OIs: OI-02", "OIs: OI-09"]] }, /error \[missing-oi\] LEAD-01 refers to OI-09, which is not in open-items\.md/],
  ["missing OI in Module Open Items", { [LEAD]: [["- OI-02: Do Leads", "- OI-08: Do Leads"]] }, /error \[missing-oi\] Module LEAD Open Items refers to OI-08/],
  ["duplicate Requirement ID", { [QUO]: [["### QUO-02 — Discount approval", "### QUO-01 — Discount approval"]] }, /error \[requirement-id\] Requirement ID QUO-01 is used twice/],
  ["mis-prefixed Requirement ID", { [LEAD]: [["### LEAD-02 —", "### QUO-09 —"]] }, /error \[requirement-id\] Requirement QUO-09 is in Module LEAD but has prefix QUO/],
  ["transition to unknown status", { [LEAD]: [["| qualified | quoted |", "| qualified | invoiced |"]] }, /error \[unknown-status\] Module LEAD: transition qualified → invoiced uses unknown status "invoiced"/],
  ["step to unknown lane", { "process.md": [["| capture-lead | sales |", "| capture-lead | marketing |"]] }, /error \[unknown-lane\] process step capture-lead is in unknown lane "marketing"/],
  ["step to unknown Module", { "process.md": [["| draft-quote | sales | QUO |", "| draft-quote | sales | INV |"]] }, /error \[unknown-module\] process step draft-quote belongs to unknown Module "INV"/],
  ["edge to unknown step", { "process.md": [["| capture-lead | qualify |", "| capture-lead | qualify-lead |"]] }, /error \[unknown-step\] process edge capture-lead → qualify-lead uses unknown step "qualify-lead"/],
  ["Open Item names unknown Module", { "open-items.md": [["| QUO | Enterprise | Sales head |", "| INV | Enterprise | Sales head |"]] }, /error \[unknown-module\] OI-01 names unknown Module "INV"/],
  ["unknown catalog slug", { [LEAD]: [["`lead-management`", "`lead-magic`"]] }, /error \[unknown-app\] Module LEAD: Neome App "lead-magic" is not a catalog slug/],
  ["disputed term with closed OI", { "../../../_agent/GLOSSARY.md": [["_Used in_: crm\n\n**Quote**", "_Used in_: crm · _Disputed_: OI-02\n\n**Quote**"]] }, /error \[disputed-term\] glossary term "Lead" is disputed but OI-02 is closed/],
  ["disputed term with missing OI", { "../../../_agent/GLOSSARY.md": [["_Used in_: crm\n\n**Quote**", "_Used in_: crm · _Disputed_: OI-44\n\n**Quote**"]] }, /error \[disputed-term\] glossary term "Lead" is disputed by OI-44, which is not in open-items\.md/],
  ["duplicate Source ID", { "../../../_agent/sources.md": [["| WH-1 | call notes |", "| CE-1 | call notes |"]] }, /error \[duplicate-source\] Source CE-1 is registered twice/],
];

for (const [name, edits, message] of broken) {
  test(`broken reference: ${name}`, () => {
    const r = build(enterprise("resolved", edits).engagement);
    assert.equal(r.code, 1, r.out);
    assert.match(r.stderr, message);
    assert.equal(r.data, null);
  });
}

test("GEN as a Module prefix is an error", () => {
  const e = enterprise("resolved", {
    "modules/ENQ-enquiries/ticket.md": [["prefix: ENQ", "prefix: GEN"]],
    "modules/ENQ-enquiries/spec.md": [["### ENQ-01", "### GEN-01"]],
  });
  renameSync(join(e.agent, "modules", "ENQ-enquiries"), join(e.agent, "modules", "GEN-enquiries"));
  const r = build(e.engagement);
  assert.equal(r.code, 1, r.out);
  assert.match(r.stderr, /error \[reserved-prefix\] Module Enquiries: prefix GEN is reserved for Engagement-wide Requirements/);
});

test("all broken references are reported, not just the first", () => {
  const r = build(enterprise("resolved", {
    [QUO]: [["Sources: CE-1, PL-1", "Sources: CE-1, XX-9"]],
    [LEAD]: [["`lead-management`", "`lead-magic`"], ["| qualified | quoted |", "| qualified | invoiced |"]],
  }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /missing-source/);
  assert.match(r.stderr, /unknown-app/);
  assert.match(r.stderr, /unknown-status/);
});

// ---- Layer 1: schema ----

test("bad enum value is a schema error", () => {
  const r = build(enterprise("resolved", { [QUO]: [["Priority: Could", "Priority: Urgent"]] }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[schema\] modules\[QUO\]\.requirements\[QUO-03\]\.priority: "Urgent" is not one of Must, Should, Could, Won't, TBC/);
  assert.doesNotMatch(r.stderr, /unevaluated/);
  assert.match(r.stderr, /build-brd: 1 error\(s\)/);
});

test("missing priority is a schema error", () => {
  const r = build(enterprise("resolved", { [QUO]: [["Priority: Could\n", ""]] }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[schema\] modules\[QUO\]\.requirements\[QUO-03\]: must have required property 'priority'/);
});

test("uncited fact that is not proposed is an error", () => {
  const r = build(enterprise("resolved", { [LEAD]: [["| Sales head | Reviews pipeline | 1 | CE-1 |", "| Sales head | Reviews pipeline | 1 | |"]] }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[uncited\] modules\[LEAD\]\.roles\[1\]: not proposed, so it needs at least 1 Source/);
});

test("bad Requirement ID format is a schema error", () => {
  const r = build(enterprise("resolved", { [LEAD]: [["### LEAD-02 —", "### LEAD-2 —"]] }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[schema\] .*"LEAD-2" has the wrong format/);
});

test("no Neome App with non-custom Delivery is a schema error", () => {
  const r = build(enterprise("resolved", { [LEAD]: [["`lead-management`", "none"]] }).engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[schema\] modules\[LEAD\]\.mapping\.delivery: no Neome App means Delivery must be custom/);
});

test("no Neome App with custom Delivery is valid", () => {
  const r = build(enterprise("resolved", { [LEAD]: [["`lead-management`", "none"], ["Delivery: Configuration", "Delivery: Custom module"]] }).engagement);
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(r.data.modules[0].mapping.neomeApp, null);
  assert.equal(r.data.modules[0].mapping.delivery, "custom");
});

// ---- parse errors ----

test("missing register file is a parse error", () => {
  const e = enterprise("resolved");
  writeFileSync(join(e.agent, "open-items.md"), "# Open Items\n\nOI-01 is somewhere.\n");
  const r = build(e.engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[parse\] open-items\.md: no register table/);
});

test("ticket without front-matter is a parse error", () => {
  const e = enterprise("resolved");
  writeFileSync(join(e.agent, "modules", "ENQ-enquiries", "ticket.md"), "# ENQ\n");
  const r = build(e.engagement);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[parse\] modules\/ENQ-enquiries\/ticket\.md: front-matter missing/);
});

// ---- CLI ----

test("missing Engagement folder exits 2", () => {
  const r = spawnSync(process.execPath, [cli, "build-brd"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /engagement folder missing/);
});

test("non-Engagement folder exits 2", () => {
  const r = build(mkdtempSync(join(tmpdir(), "neome-brd-")));
  assert.equal(r.code, 2);
  assert.match(r.stderr, /not an Engagement folder/);
});

test("unknown mode exits 2", () => {
  const r = build(enterprise("resolved").engagement, "--mode", "draft");
  assert.equal(r.code, 2);
  assert.match(r.stderr, /unknown mode "draft"/);
});

test("sign-off mode needs signers (details in brd-signoff.test.mjs)", () => {
  const r = build(enterprise("resolved").engagement, "--mode", "sign-off");
  assert.equal(r.code, 2);
  assert.match(r.stderr, /sign-off needs --signers/);
});

test("explicit preview mode works", () => {
  const r = build(enterprise("resolved").engagement, "--mode", "preview");
  assert.equal(r.code, 0, r.out);
  assert.ok(r.data);
});
