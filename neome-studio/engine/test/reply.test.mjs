// Questionnaire reply loop, ticket 36: `reply items` (match-list skeleton, read-only), `reply close` (Yes = master's
// suggested text; section 13 / prototype "oi" drops; named lines), `reply note`, `reply new-oi`, `reply confirm`
// (Requirements agreed citing QA-n), plus the hand-run sample: Meera's WhatsApp reply QA-1 to QN-2026-10-29.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readEngagement } from "../brd/read-engagement.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");
const skills = join(here, "..", "..", "skills");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr, stdout: r.stdout };
};
function copy(rel) {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-reply-")), "harbor-tiles");
  cpSync(join(fixtures, rel, "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const read = (...p) => readFileSync(join(...p), "utf8");
const agent = (eng, ...p) => join(eng, "_agent", ...p);
const QUO = (eng, f = "spec.md") => agent(eng, "modules", "QUO-quotations", f);
const ENQ = (eng) => agent(eng, "modules", "ENQ-enquiries", "ticket.md");
const edit = (path, from, to) => {
  const t = readFileSync(path, "utf8");
  assert.ok(t.includes(from), `${from} not in ${path}`);
  writeFileSync(path, t.replace(from, to));
};
const row = (eng, id) => {
  const text = read(agent(eng, "open-items.md"));
  const lines = text.split("\n");
  const heads = lines.find((l) => /^\| ID \|/.test(l)).split("|").slice(1, -1).map((s) => s.trim());
  const cells = lines.find((l) => new RegExp(`^\\| ${id} \\|`).test(l)).split(/(?<!\\)\|/).slice(1, -1).map((s) => s.trim());
  return Object.fromEntries(heads.map((h, i) => [h, cells[i] ?? ""]));
};
function snapshot(dir) {
  const out = {};
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out[p.slice(dir.length)] = readFileSync(p, "utf8");
    }
  };
  walk(dir);
  return out;
}

// After-questionnaire + Meera's reply registered as QA-1 (what ingest step 3 does).
function replied({ notes = "reply to QN-2026-10-29", prefix = "QA", engagement = "crm" } = {}) {
  const c = copy("questionnaire/after-questionnaire");
  const file = join(c.ent, "inputs", "reply.txt");
  writeFileSync(file, "1. Yes\n2. Sales execs and accounts\n");
  const args = ["add-source", c.ent, file, "--engagement", engagement, "--prefix", prefix, "--type", "questionnaire reply", "--title", "Meera reply"];
  const r = run(...args, ...(notes ? ["--notes", notes] : []));
  assert.equal(r.code, 0, r.out);
  return { ...c, src: r.stdout.match(/^id: (\S+)/m)[1] };
}
const reply = (eng, action, ...rest) => run("reply", action, eng, ...rest);

// ---- the reply Source ----

test("--source must be a registered QA-n reply of this Engagement naming an existing Questionnaire", () => {
  const { eng } = replied();
  assert.equal(reply(eng, "items").code, 2);
  let r = reply(eng, "items", "--source", "QA-9");
  assert.equal(r.code, 1);
  assert.match(r.out, /QA-9 is not in the Source register/);
  r = reply(eng, "items", "--source", "CE-1");
  assert.equal(r.code, 1);
  assert.match(r.out, /not a QA-n Source/);

  const noNotes = replied({ notes: "" });
  r = reply(noNotes.eng, "items", "--source", "QA-1");
  assert.equal(r.code, 1);
  assert.match(r.out, /notes name no Questionnaire/);

  const missing = replied({ notes: "reply to QN-2026-10-01" });
  r = reply(missing.eng, "items", "--source", "QA-1");
  assert.equal(r.code, 1);
  assert.match(r.out, /QN-2026-10-01\.md is missing/);

  const other = replied({ engagement: "stock" });
  r = reply(other.eng, "items", "--source", "QA-1");
  assert.equal(r.code, 1);
  assert.match(r.out, /not registered for Engagement crm/);
});

// ---- items ----

test("items: match-list skeleton in sent order, where a Yes and an Edit land; writes nothing", () => {
  const { ent, eng } = replied();
  const before = snapshot(ent);
  const r = reply(eng, "items", "--source", "QA-1");
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(snapshot(ent), before);
  assert.match(r.stdout, /^qn \| QN-2026-10-29 \| to Meera Shah \(Sales head\) \| 10 item\(s\)$/m);
  const lines = r.stdout.split("\n").filter((l) => l.startsWith("item |"));
  assert.deepEqual(lines.map((l) => l.split(" | ").slice(1, 3).join(" ")),
    ["1 OI-05", "2 OI-06", "3 OI-07", "4 OI-08", "5 OI-12", "6 OI-02", "7 OI-10", "8 OI-03", "9 OI-09", "10 OI-11"]);
  const line = (id) => lines.find((l) => l.includes(` ${id} |`));
  assert.match(line("OI-05"), /yes: general\.md Migration \(GEN-01\) \| edit: general\.md Migration \(GEN-01\) \| suggested: The current customer Excel sheet/);
  assert.match(line("OI-07"), /yes: general\.md Hosting \(topic bullet\)/);
  assert.match(line("OI-06"), /yes: n\/a \(no suggested; any answer is an edit\) \| edit: general\.md Training \(GEN-02\) \| suggested: \(none\)/);
  assert.match(line("OI-12"), /yes: reply confirm QUO-04 QUO-06 QUO-07 \| edit: confirm accepted IDs; rest: QUO: module revisit/);
  assert.match(line("OI-02"), /yes: ENQ open: write ticket\.md \| edit: ENQ open: write ticket\.md \| suggested: 7 days$/);
  assert.match(line("OI-10"), /yes: QUO resolved: spec\.md in place, no revisit \| edit: QUO: module revisit/);
  assert.doesNotMatch(r.stdout, /proposed, to confirm/);
});

test("items: answered and claimed items say so", () => {
  const { eng } = replied();
  edit(agent(eng, "open-items.md"), "| OI-09 | Can a lost or expired quotation be reopened, and by whom? | QUO | Enterprise | Sales head | No; make a new quotation (proposed, to confirm) | open |",
    "| OI-09 | Can a lost or expired quotation be reopened, and by whom? | QUO | Enterprise | Sales head | No; make a new quotation (proposed, to confirm) | closed |");
  edit(QUO(eng, "ticket.md"), "status: resolved", "status: claimed");
  edit(QUO(eng, "ticket.md"), "claimedBy: Asha", "claimedBy: Ravi");
  const r = reply(eng, "items", "--source", "QA-1");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /item \| 9 \| OI-09 \| QUO \| closed \| already answered: new info → new Open Item or revisit/);
  assert.match(r.stdout, /OI-10 .*yes: QUO claimed by Ravi: hold \(register \+ map Note\)/);
});

// ---- close ----

test("close --yes: answer = master's plain suggested text; answer column added; section 13 and prototype oi dropped", () => {
  const { eng } = replied();
  const r = reply(eng, "close", "OI-10", "--source", "QA-1", "--yes");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^closed: OI-10 — Kochi showroom manager \[QA-1\]$/m);
  const reg = read(agent(eng, "open-items.md"));
  assert.match(reg, /^\| ID \| question \| Module\(s\) \| owner \| ask to \| suggested \| status \| asked in \| answer \| answer Source \|$/m);
  assert.match(reg, /^\|---\|---\|---\|---\|---\|---\|---\|---\|---\|---\|$/m);
  assert.deepEqual(
    [row(eng, "OI-10").status, row(eng, "OI-10").answer, row(eng, "OI-10")["answer Source"]],
    ["closed", "Kochi showroom manager", "QA-1"],
  );
  assert.equal(row(eng, "OI-01")["answer Source"], "WS-2", "other rows keep their cells");
  assert.doesNotMatch(read(QUO(eng)).split("## 13 Open Items")[1], /OI-10/);
  assert.match(read(QUO(eng)), /OIs: OI-01, OI-10/, "OIs: lines keep closed OIs");
  assert.doesNotMatch(read(QUO(eng, "prototype-data.json")), /"oi": "OI-10"/);
  JSON.parse(read(QUO(eng, "prototype-data.json")));
  assert.match(r.stdout, /^dropped: OI-10 from _agent\/modules\/QUO-quotations\/spec\.md section 13$/m);
  assert.match(r.stdout, /^named: keep \| _agent\/modules\/QUO-quotations\/spec\.md:\d+ \| OIs: OI-01, OI-10$/m);
  assert.match(r.stdout, /^named: rewrite \| _agent\/modules\/QUO-quotations\/spec\.md:\d+ \| - OI-10: Who approves/m);
  assert.match(r.stdout, /^named: rewrite \| _agent\/process\.md:\d+ \| \| approve-discount/m);
  assert.equal(run("build-brd", eng, "--check").code, 0);
  assert.equal(run("spec-check", eng, "QUO").code, 0);
});

test("close --answer; emptied section 13 says N/A; refusals write nothing", () => {
  const { ent, eng } = replied();
  let r = reply(eng, "close", "OI-02", "--source", "QA-1", "--answer", "5 days | not 7");
  assert.equal(r.code, 0, r.out);
  assert.equal(row(eng, "OI-02").answer, "5 days \\| not 7");
  assert.match(read(ENQ(eng)), /## 13 Open Items\n\nN\/A: no open Open Items\.\n$/);
  assert.equal(run("build-brd", eng, "--check").code, 0);

  const before = snapshot(ent);
  r = reply(eng, "close", "OI-02", "--source", "QA-1", "--answer", "again");
  assert.equal(r.code, 1);
  assert.match(r.out, /OI-02 is closed \(answer Source QA-1\)/);
  r = reply(eng, "close", "OI-06", "--source", "QA-1", "--yes");
  assert.equal(r.code, 1);
  assert.match(r.out, /went out with no suggested answer/);
  r = reply(eng, "close", "OI-01", "--source", "QA-1", "--yes");
  assert.equal(r.code, 1);
  r = reply(eng, "close", "OI-99", "--source", "QA-1", "--answer", "x");
  assert.equal(r.code, 1);
  assert.equal(reply(eng, "close", "OI-05", "--source", "QA-1", "--yes", "--answer", "x").code, 2);
  assert.equal(reply(eng, "close", "OI-05", "--source", "QA-1").code, 2);
  assert.deepEqual(snapshot(ent), before);
});

test("close on a claimed Module: register only, its files untouched, hold printed", () => {
  const { eng } = replied();
  edit(QUO(eng, "ticket.md"), "status: resolved", "status: claimed");
  const spec = read(QUO(eng));
  const pd = read(QUO(eng, "prototype-data.json"));
  const r = reply(eng, "close", "OI-10", "--source", "QA-1", "--yes");
  assert.equal(r.code, 0, r.out);
  assert.equal(row(eng, "OI-10").status, "closed");
  assert.equal(read(QUO(eng)), spec);
  assert.equal(read(QUO(eng, "prototype-data.json")), pd);
  assert.match(r.stdout, /^hold: QUO is claimed by Asha; its files are theirs \(map Note for them\)$/m);
  assert.match(r.stdout, /^named: drop \| _agent\/modules\/QUO-quotations\/spec\.md:\d+ \| - OI-10:/m);
});

test("close of a dispute Open Item points at the glossary Settle step", () => {
  const { ent, eng } = replied();
  edit(join(ent, "_agent", "GLOSSARY.md"), "_Source_: CE-1 · _Status_: proposed · _Used in_: crm\n\n**Quotation**",
    "_Source_: CE-1 · _Status_: proposed · _Used in_: crm · _Disputed_: crm/OI-07\n\n**Quotation**");
  const r = reply(eng, "close", "OI-07", "--source", "QA-1", "--yes");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^glossary: "Enquiry" is disputed by crm\/OI-07; settle, split or rename it now \(enterprise-glossary Settle\) with --source QA-1$/m);
});

// ---- note, new-oi ----

test("note: Don't know / no answer keeps the Open Item open with a note column", () => {
  const { eng } = replied();
  let r = reply(eng, "note", "OI-08", "--source", "QA-1", "--note", "Don't know; ask Joel (accounts)");
  assert.equal(r.code, 0, r.out);
  assert.deepEqual([row(eng, "OI-08").status, row(eng, "OI-08").note], ["open", "Don't know; ask Joel (accounts) [QA-1]"]);
  r = reply(eng, "note", "OI-08", "--source", "QA-1", "--note", "no answer");
  assert.equal(row(eng, "OI-08").note, "Don't know; ask Joel (accounts) [QA-1]; no answer [QA-1]");
  assert.equal(reply(eng, "note", "OI-08", "--source", "QA-1").code, 2);
  assert.equal(reply(eng, "note", "OI-01", "--source", "QA-1", "--note", "x").code, 1);
  assert.equal(run("build-brd", eng, "--check").code, 0);
});

test("new-oi: next free ID, raised in QA-n; bad Module or owner refused", () => {
  const { ent, eng } = replied();
  const before = snapshot(ent);
  assert.equal(reply(eng, "new-oi", "--source", "QA-1", "--question", "GST on PDF?", "--modules", "XYZ", "--owner", "Enterprise").code, 1);
  assert.equal(reply(eng, "new-oi", "--source", "QA-1", "--question", "GST on PDF?", "--modules", "QUO", "--owner", "Them").code, 2);
  assert.equal(reply(eng, "new-oi", "--source", "QA-1", "--modules", "QUO", "--owner", "Neomenta").code, 2);
  assert.deepEqual(snapshot(ent), before);
  const r = reply(eng, "new-oi", "--source", "QA-1", "--question", "Can the PDF show GST numbers?", "--modules", "QUO, All", "--owner", "neomenta", "--ask-to", "Sales head");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^id: OI-13$/m);
  const o = row(eng, "OI-13");
  assert.deepEqual([o.question, o["Module(s)"], o.owner, o["ask to"], o.status, o["raised in"]],
    ["Can the PDF show GST numbers?", "QUO, All", "Neomenta", "Sales head", "open", "QA-1"]);
  const { data } = readEngagement(eng, { schemaVersion: "x", date: "2026-10-29" });
  assert.equal(data.openItems.find((x) => x.id === "OI-13").raisedIn, "QA-1");
});

// ---- confirm ----

test("confirm: Requirements agreed citing QA-n, Proposed: no, header Sources; spec-check passes", () => {
  const { eng } = replied();
  assert.equal(reply(eng, "close", "OI-12", "--source", "QA-1", "--yes").code, 0);
  const r = reply(eng, "confirm", "QUO-04", "QUO-06", "QUO-07", "--source", "QA-1");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^confirmed: QUO-04 \(_agent\/modules\/QUO-quotations\/spec\.md\) Proposed: no, cites QA-1$/m);
  const spec = read(QUO(eng));
  const block = (id) => spec.match(new RegExp(`### ${id}[\\s\\S]*?(?=\\n###|\\n## )`))[0];
  for (const id of ["QUO-04", "QUO-06", "QUO-07"]) {
    assert.doesNotMatch(block(id), /proposed, to confirm/);
    assert.match(block(id), /\nProposed: no/);
    assert.match(block(id), /\nSources: .*QA-1/);
  }
  assert.match(block("QUO-06"), /shows as replaced\. \[QA-1\]\n/);
  assert.match(spec, /^Sources: CE-1, CE-2, WS-1, WS-2, QA-1$/m);
  assert.equal(run("spec-check", eng, "QUO").code, 0);
  assert.equal(run("build-brd", eng, "--check").code, 0);

  const again = reply(eng, "confirm", "QUO-04", "--source", "QA-1");
  assert.equal(again.code, 0);
  assert.match(again.stdout, /already agreed: QUO-04/);
  assert.equal(read(QUO(eng)), spec);
});

test("confirm: inline citations merge; GEN in general.md; refusals", () => {
  const { ent, eng } = replied();
  edit(ENQ(eng), "Statement: A sales exec can log an enquiry that came by phone, WhatsApp or walk-in, with its channel and showroom. [CE-1]",
    "Statement: A sales exec can log an enquiry that came by phone, WhatsApp or walk-in, with its channel and showroom. [CE-1] (proposed, to confirm)");
  let r = reply(eng, "confirm", "ENQ-01", "GEN-02", "--source", "QA-1");
  assert.equal(r.code, 0, r.out);
  assert.match(read(ENQ(eng)), /with its channel and showroom\. \[CE-1, QA-1\]\n/);
  assert.match(read(agent(eng, "general.md")), /### GEN-02[\s\S]*?Sources: CE-1, QA-1\nOIs: OI-06\nProposed: no/);
  assert.match(r.stdout, /confirmed: GEN-02 .*warning: priority still TBC/);

  const before = snapshot(ent);
  assert.equal(reply(eng, "confirm", "QUO-99", "--source", "QA-1").code, 1);
  assert.equal(reply(eng, "confirm", "nope", "--source", "QA-1").code, 2);
  edit(QUO(eng, "ticket.md"), "status: resolved", "status: claimed");
  r = reply(eng, "confirm", "QUO-04", "--source", "QA-1");
  assert.equal(r.code, 1);
  assert.match(r.out, /claimed by Asha; hold it/);
  edit(QUO(eng, "ticket.md"), "status: claimed", "status: resolved");
  assert.deepEqual(snapshot(ent), before);
});

// ---- hand-run sample ----

const after = () => copy("reply/after-reply");

test("sample after-reply: builds, QUO spec done, Prototype has no closed OI chips", () => {
  const { eng } = after();
  const r = run("build-brd", eng, "--check");
  assert.equal(r.code, 0, r.out);
  assert.equal(run("spec-check", eng, "QUO").code, 0);
  const p = run("build-prototype", eng, "QUO");
  assert.equal(p.code, 0, p.out);
  assert.match(p.out, /0 warning\(s\)/);
});

test("sample after-reply: register, Modules, general.md, glossary as the rules say", () => {
  const { ent, eng } = after();
  const { data } = readEngagement(eng, { schemaVersion: "x", date: "2026-10-29" });
  const oi = Object.fromEntries(data.openItems.map((o) => [o.id, o]));
  for (const id of ["OI-02", "OI-05", "OI-06", "OI-07", "OI-09", "OI-10", "OI-11", "OI-12"]) {
    assert.deepEqual([oi[id].status, oi[id].answerSource], ["closed", "QA-1"], id);
  }
  assert.equal(oi["OI-05"].answer, "The current customer Excel sheet, all its columns, loaded with Neome's Excel import");
  assert.deepEqual([oi["OI-03"].status, oi["OI-08"].status, oi["OI-13"].status], ["open", "open", "open"]);
  assert.equal(row(eng, "OI-08").note, "Don't know; ask Joel (accounts) [QA-1]");
  assert.equal(row(eng, "OI-08")["ask to"], "Accounts");
  assert.equal(row(eng, "OI-03").note, "no answer [QA-1]");
  assert.deepEqual([oi["OI-13"].owner, oi["OI-13"].raisedIn], ["neomenta", "QA-1"]);

  assert.match(read(agent(eng, "..", "..", "..", "_agent", "sources.md")), /\| QA-1 \| questionnaire reply \| .* \| inputs\/QA-1-meera-reply-qn-2026-10-29\.txt \| crm \| reply to QN-2026-10-29 \|/);
  // Yes on a resolved Module: in place, no revisit for it; Edits: needs-revisit with reasons citing QA-1.
  const quo = read(QUO(eng, "ticket.md"));
  assert.match(quo, /status: needs-revisit/);
  assert.match(quo, /revisitReason: "OI-09 answered: .*\[QA-1\]; OI-11 answered: .*\[QA-1\]"/);
  assert.match(read(QUO(eng)), /\| Stand-in approver \| Sales head away \| Kochi showroom manager approves discounts above 8% \| \[QA-1\] \|/);
  assert.equal(data.modules.find((m) => m.prefix === "QUO").requirements.filter((r) => r.proposed).length, 0);
  // Open Module: answer written where the Open Item bit; no status change.
  assert.match(read(ENQ(eng)), /status: open/);
  assert.match(read(ENQ(eng)), /no follow-up for 5 days\. \[QA-1\]/);
  // `All` Open Items land in Engagement-wide Requirements.
  const gen = Object.fromEntries(data.general.requirements.map((r) => [r.id, r]));
  assert.equal(gen["GEN-05"].topic, "hosting");
  assert.deepEqual(gen["GEN-05"].sources, ["QA-1"]);
  assert.ok(gen["GEN-01"].sources.includes("QA-1") && gen["GEN-02"].sources.includes("QA-1"));
  assert.doesNotMatch(read(agent(eng, "general.md")), /^- OI-07:/m);
  // Glossary term confirmed in the reply → agreed.
  assert.match(read(ent, "_agent", "GLOSSARY.md"), /\*\*Quotation\*\*:\n.*\n_Avoid_: Quote\n_Source_: CE-1, CE-2, QA-1 · _Status_: agreed/);
});

test("sample after-reply: the engine steps replay to the same register", () => {
  const { ent, eng } = replied();
  const steps = [
    ["close", "OI-05", "--yes"],
    ["close", "OI-06", "--answer", "Sales execs and both accounts staff are trained; the sales head runs the training after Neome trains her"],
    ["close", "OI-07", "--yes"],
    ["note", "OI-08", "--note", "Don't know; ask Joel (accounts)"],
    ["close", "OI-12", "--yes"],
    ["close", "OI-02", "--answer", "5 days, not 7"],
    ["close", "OI-10", "--yes"],
    ["note", "OI-03", "--note", "no answer"],
    ["close", "OI-09", "--answer", "The sales head can reopen a lost quotation within 30 days; an expired one needs a new quotation"],
    ["close", "OI-11", "--answer", "15 days for all buyers, contractors too"],
  ];
  for (const [action, id, ...rest] of steps) assert.equal(reply(eng, action, id, "--source", "QA-1", ...rest).code, 0, `${action} ${id}`);
  assert.equal(reply(eng, "new-oi", "--source", "QA-1", "--question", "Can the quotation PDF show Harbor Tiles' GST number and the buyer's GST number?", "--modules", "QUO", "--owner", "Neomenta").code, 0);
  edit(agent(eng, "open-items.md"), "| All | Enterprise | Sales head | Standard Neome support;", "| All | Enterprise | Accounts | Standard Neome support;");
  const sample = after();
  assert.equal(read(agent(eng, "open-items.md")), read(agent(sample.eng, "open-items.md")));
  assert.ok(existsSync(join(ent, "_agent", "sources", "QA-1.md")));
});

// ---- skill text ----

test("ingest skill: reply loop wired; reference names every rule and command", () => {
  const skill = read(skills, "ingest", "SKILL.md");
  assert.doesNotMatch(skill, /not built yet \(ticket 36\)/);
  assert.match(skill, /\[reply-loop\.md\]\(references\/reply-loop\.md\)/);
  assert.match(skill, /--prefix QA .*--notes "reply to <QN>"/);
  const ref = read(skills, "ingest", "references", "reply-loop.md");
  for (const s of ["reply items", "reply close", "reply note", "reply new-oi", "reply confirm", "module revisit", "glossary agree", "Match list", "Yes", "Edit", "Don't know", "New question", "`All`", "claimed"]) {
    assert.ok(ref.includes(s), `reply-loop.md names ${s}`);
  }
});
