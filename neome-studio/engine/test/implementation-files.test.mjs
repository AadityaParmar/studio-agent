// Implementation files (build-phase spec §3, tickets 03/04/06): `implement init` (Frozen copy + target + names + steps/),
// `implement check` (lint), `implement next` (strict line, paused on revisit), `implement fields` (spec type → Studio type).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const ENT = "e-qMihNWulraS4gYKTspkfbygWZ";

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, "implement", ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr, lines: r.stdout.trim().split("\n").filter(Boolean) };
};
function swap(file, from, to) {
  const t = readFileSync(file, "utf8");
  assert.ok(t.includes(from), `fixture edit: "${from}" not in ${file}`);
  writeFileSync(file, t.replaceAll(from, to));
}
// brd/resolved with every Requirement cleared (gate ready).
function ready() {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-impl-")), "enterprises", "harbor-tiles");
  cpSync(join(here, "fixtures", "brd", "resolved"), ent, { recursive: true });
  const eng = join(ent, "engagements", "crm");
  const a = join(eng, "_agent");
  for (const f of ["modules/LEAD-leads/spec.md", "modules/QUO-quotation/spec.md", "general.md"]) swap(join(a, f), "Proposed: yes", "Proposed: no");
  swap(join(a, "open-items.md"), "| Over 10% | open | QN-2026-10-10 | |", "| Over 10% | closed | QN-2026-10-10 | CE-1 |");
  return { eng, impl: join(a, "implementation") };
}
const init = (eng) => run("init", eng, "--ent", ENT, "--ent-name", "ent103");
const stepFile = (impl, name, body) => {
  mkdirSync(join(impl, "steps"), { recursive: true });
  writeFileSync(join(impl, "steps", name), body);
};
const step = ({ title = "x", status = "open", modules = "LEAD", reqs = "LEAD-01", needs = "—", body = "1. add role Sales" } = {}) =>
  `# ${title}\n\nStatus: ${status}\nModules: ${modules}\nRequirements: ${reqs}\nNeeds: ${needs}\n\n${body}\n\n## Run log\n`;
// A complete, valid plan: setup, one file per layer used, deploy; covers LEAD-01, LEAD-02, QUO-01, QUO-02, GEN-01, GEN-02.
function plan(impl) {
  writeFileSync(join(impl, "target.md"), readFileSync(join(impl, "target.md"), "utf8").replace("| LEAD | lead-management |  |", "| LEAD | lead-management | B |").replace("| QUO | quotation-and-order-flow |  |", "| QUO | quotation-and-order-flow | A |"));
  stepFile(impl, "00-setup.md", step({ status: "done", modules: "LEAD, QUO", reqs: "—", body: "- [x] HUMAN: take edit lock — Studio › Edit" }));
  stepFile(impl, "01-roles-vars-all.md", step({ modules: "LEAD, QUO", reqs: "GEN-01, GEN-02" }));
  stepFile(impl, "02-masters-lead.md", step({ reqs: "LEAD-01, LEAD-02" }));
  stepFile(impl, "03-transactions-quo.md", step({ modules: "QUO", reqs: "QUO-01, QUO-02" }));
  stepFile(impl, "04-deploy.md", step({ modules: "LEAD, QUO", reqs: "—", body: "- [ ] HUMAN: set deploy vars — Studio › Deploy\n1. validate" }));
}

// ---- init ----

test("init: refuses while the Implementation gate is blocked; writes nothing", () => {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-impl-")), "enterprises", "harbor-tiles");
  cpSync(join(here, "fixtures", "brd", "resolved"), ent, { recursive: true });
  const eng = join(ent, "engagements", "crm");
  const r = init(eng);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /implement init: blocked \(4 blocker\(s\)\)/);
  assert.match(r.out, /QUO-02: Open Item OI-01 is open/);
  assert.ok(!existsSync(join(eng, "_agent", "implementation")));
});

test("init: bad entId is a usage error", () => {
  const { eng } = ready();
  assert.equal(run("init", eng, "--ent", "ent103", "--ent-name", "ent103").code, 2);
});

test("init: writes the Frozen copy, target, names and steps/; refuses a second time", () => {
  const { eng, impl } = ready();
  const r = init(eng);
  assert.equal(r.code, 0, r.out);
  const frozen = JSON.parse(readFileSync(join(impl, "frozen-brd-data.json"), "utf8"));
  assert.deepEqual(frozen.modules.map((m) => m.prefix), ["LEAD", "QUO", "ENQ"]);
  const target = readFileSync(join(impl, "target.md"), "utf8");
  assert.match(target, new RegExp(`^entId: ${ENT}$`, "m"));
  assert.match(target, /^Studio Enterprise: ent103$/m);
  assert.match(target, /^\| LEAD \| lead-management \|  \|$/m);
  assert.match(target, /^\| QUO \| quotation-and-order-flow \|  \|$/m);
  assert.doesNotMatch(target, /\| ENQ \|/);
  assert.match(readFileSync(join(impl, "names.md"), "utf8"), /^\| term \| kind \| studio name \|$/m);
  assert.deepEqual(readdirSync(join(impl, "steps")), []);
  assert.ok(r.lines.includes(`init | ${ENT} | 2 Module(s), 6 Requirement(s) frozen`));
  const again = init(eng);
  assert.equal(again.code, 1);
  assert.match(again.out, /already planned/);
});

// ---- check ----

test("check: a complete plan passes", () => {
  const { eng, impl } = ready();
  init(eng);
  plan(impl);
  writeFileSync(join(impl, "names.md"), readFileSync(join(impl, "names.md"), "utf8") + "| Sales head | role | SalesHead |\n| Lead | form | LeadForm |\n");
  const r = run("check", eng);
  assert.equal(r.code, 0, r.out);
  assert.ok(r.lines.includes("check | ok | 5 step file(s), 0 warning(s)"), r.out);
});

test("check: errors in target, names and step files", () => {
  const { eng, impl } = ready();
  init(eng);
  plan(impl);
  swap(join(impl, "target.md"), "| QUO | quotation-and-order-flow | A |", "| QUO | quotation-and-order-flow | C |");
  writeFileSync(join(impl, "names.md"), readFileSync(join(impl, "names.md"), "utf8") + "| Lead | form | lead form |\n| Lead | form | LeadForm |\n| Quote | form | LeadForm |\n| X | widget | Thing |\n");
  stepFile(impl, "02-masters-lead.md", step({ status: "half", reqs: "LEAD-01, LEAD-09" }));
  stepFile(impl, "06-reports-lead.md", step({ reqs: "QUO-03" }));
  stepFile(impl, "badname.md", step());
  stepFile(impl, "00-setup.md", step({ status: "done", reqs: "—", body: "- [ ] HUMAN: take edit lock — Studio › Edit\n- [ ] HUMAN: no where part" }));
  const r = run("check", eng);
  assert.equal(r.code, 1, r.out);
  const errs = r.lines.filter((l) => l.startsWith("error |"));
  for (const want of [
    "error | target.md | QUO: Neome App choice must be A (install by hand) or B (build from scratch), got \"C\"",
    "error | names.md | \"lead form\" (form) is not a Studio name (Uppercase first letter, then letters and digits)",
    "error | names.md | form LeadForm named twice",
    "error | names.md | X: unknown kind \"widget\"",
    "error | steps/badname.md | name must be NN-<layer>-<what>.md",
    "error | steps/02-masters-lead.md | Status must be open, done or failed (got \"half\")",
    "error | steps/02-masters-lead.md | LEAD-09 is not a live Requirement in the Frozen copy",
    "error | steps/06-reports-lead.md | QUO-03 is not a live Requirement in the Frozen copy",
    "error | steps/06-reports-lead.md | numbers must run 00, 01, 02… with no gap (expected 05)",
    "error | steps/00-setup.md | HUMAN line needs \"<what> — <where in Studio>\": - [ ] HUMAN: no where part",
    "error | steps/00-setup.md | Status done, but 2 HUMAN line(s) not ticked",
  ]) assert.ok(errs.includes(want), `missing: ${want}\n${r.out}`);
});

test("check: layer order, setup first, coverage only once a deploy file exists, call cap warning", () => {
  const { eng, impl } = ready();
  init(eng);
  stepFile(impl, "00-masters-lead.md", step({ body: Array.from({ length: 41 }, (_, i) => `${i + 1}. add field F${i}`).join("\n") }));
  stepFile(impl, "01-roles-vars-all.md", step());
  let r = run("check", eng);
  assert.ok(r.lines.includes("error | steps/00-masters-lead.md | first step file must be 00-setup"), r.out);
  assert.ok(r.lines.includes("error | steps/01-roles-vars-all.md | layer roles-vars comes before masters (order: setup, roles-vars, masters, transactions, logic, actions, workflows, reports, deploy)"), r.out);
  assert.ok(r.lines.includes("warning | steps/00-masters-lead.md | 41 MCP calls (cap ~40): split by Module"), r.out);
  assert.ok(r.lines.includes("warning | steps | no deploy step file yet"), r.out);
  assert.ok(!r.lines.some((l) => l.includes("not covered")), "coverage waits for the deploy file");

  const p = ready();
  init(p.eng);
  plan(p.impl);
  stepFile(p.impl, "03-transactions-quo.md", step({ modules: "QUO", reqs: "QUO-01" }));
  r = run("check", p.eng);
  assert.ok(r.lines.includes("error | steps | QUO-02 is not covered by any step file"), r.out);
});

test("check: rework files may follow deploy in any layer", () => {
  const { eng, impl } = ready();
  init(eng);
  plan(impl);
  stepFile(impl, "05-rework-quo.md", step({ modules: "QUO", reqs: "QUO-01" }));
  stepFile(impl, "06-masters-lead.md", step({ reqs: "LEAD-02" }));
  stepFile(impl, "07-deploy.md", step({ modules: "LEAD, QUO", reqs: "—" }));
  const r = run("check", eng);
  assert.equal(r.code, 0, r.out);
});

// ---- next ----

test("next: strict line; failed first in order; done when all done", () => {
  const { eng, impl } = ready();
  init(eng);
  assert.deepEqual(run("next", eng).lines, ["none | no step files yet"]);
  plan(impl);
  assert.deepEqual(run("next", eng).lines, ["next | 01-roles-vars-all.md | open"]);
  swap(join(impl, "steps", "01-roles-vars-all.md"), "Status: open", "Status: failed");
  assert.deepEqual(run("next", eng).lines, ["next | 01-roles-vars-all.md | failed"]);
  for (const f of ["01-roles-vars-all.md", "02-masters-lead.md", "03-transactions-quo.md"]) swap(join(impl, "steps", f), /Status: (open|failed)/.exec(readFileSync(join(impl, "steps", f), "utf8"))[0], "Status: done");
  assert.deepEqual(run("next", eng).lines, ["next | 04-deploy.md | open"]);
  swap(join(impl, "steps", "04-deploy.md"), "Status: open", "Status: done");
  swap(join(impl, "steps", "04-deploy.md"), "- [ ] HUMAN", "- [x] HUMAN");
  assert.deepEqual(run("next", eng).lines, ["done | all 5 step file(s) done"]);
});

test("next: paused when the next file's Module is no longer resolved (revisit)", () => {
  const { eng, impl } = ready();
  init(eng);
  plan(impl);
  swap(join(impl, "steps", "01-roles-vars-all.md"), "Status: open", "Status: done");
  const ticket = join(eng, "_agent", "modules", "LEAD-leads", "ticket.md");
  swap(ticket, "status: resolved", "status: needs-revisit");
  assert.deepEqual(run("next", eng).lines, ["paused | 02-masters-lead.md | LEAD is needs-revisit: resolve it, then refreeze"]);
});

// ---- fields ----

test("fields: spec type → Studio type, with name hints", () => {
  const { eng } = ready();
  init(eng);
  assert.deepEqual(run("fields", eng, "LEAD").lines, [
    "field | Lead | Name | text | text |",
    "field | Lead | Source channel | choice | pickText | setOfText var first (Walk-in, Phone, Website)",
    "field | Lead | Owner | person | pickUser | roleIdDataSource = roles whose users show",
    "field | Lead | Company | link-to-entity | ref | spreadsheet CustomerSheet + list/card layout on it",
  ]);
  assert.deepEqual(run("fields", eng, "QUO").lines.slice(2, 3), ["field | Quote | Total | money | decimal | currency via prefix"]);
  assert.equal(run("fields", eng, "NOPE").code, 1);
});

test("fields: type hints from field names", async () => {
  const { studioFieldType } = await import("../implementation/files.mjs");
  const t = (name, type) => studioFieldType({ name, type }).type;
  assert.equal(t("Contact Number", "text"), "mobileNumber");
  assert.equal(t("Email", "text"), "email");
  assert.equal(t("Address", "text"), "paragraph");
  assert.equal(t("Additional Notes", "text"), "paragraph");
  assert.equal(t("Website", "text"), "hyperlink");
  assert.equal(t("Government ID Proof", "file"), "document");
  assert.equal(t("Photo", "file"), "image");
  assert.equal(t("Start date", "date"), "date");
  assert.equal(t("Visits", "number"), "number");
});
