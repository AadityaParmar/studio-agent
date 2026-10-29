// Enterprise glossary lifecycle, ticket 29: agree (Questionnaire reply, Sign-off), dispute, settle, split, rename.
// Base: the `resolved` fixture (crm) released and signed off as v1, plus an open second Engagement (warehouse).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, appendFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { readEngagement } from "../brd/read-engagement.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};
const g = (action, ent, ...args) => run("glossary", action, ent, ...args);
const read = (...p) => readFileSync(join(...p), "utf8");
const glossaryOf = (ent) => read(ent, "_agent", "GLOSSARY.md");
// The lines of one entry, from its `**Term**:` line to the meta line.
const entry = (ent, term) => {
  const m = glossaryOf(ent).match(new RegExp(`^\\*\\*${term}\\*\\*:\\n[\\s\\S]*?_Source_:.*$`, "m"));
  return m ? m[0] : null;
};
const termsOf = (engagement) =>
  readEngagement(engagement, { schemaVersion: "1.0.0", date: "2026-10-29" }).data.glossary;
const check = (engagement) => run("build-brd", engagement, "--check");

// Every file under a folder → content (to prove only GLOSSARY.md changed).
function files(root) {
  const out = {};
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else out[relative(root, p)] = readFileSync(p, "utf8");
    }
  };
  walk(root);
  return out;
}

// ---- base Enterprise, built once (release + sign-off need mmdc) ----

const base = join(mkdtempSync(join(tmpdir(), "neome-gl-")), "harbor-tiles");
cpSync(join(here, "fixtures", "brd", "resolved"), base, { recursive: true });
const crmDir = join(base, "engagements", "crm");
const rel = run("build-brd", crmDir, "--mode", "release", "--summary", "For review.");
appendFileSync(join(base, "_agent", "sources.md"),
  "| SO-1 | sign-off | Signed BRD v1 | 2026-10-28 | inputs/SO-1-signed.pdf | crm | |\n" +
  "| QA-2 | questionnaire reply | Reply to QN-2026-10-20 | 2026-10-22 | inputs/QA-2-reply.txt | warehouse | QN-2026-10-20 |\n");
const so = run("build-brd", crmDir, "--mode", "sign-off",
  "--signers", "Asha Rao | Sales head | 2026-10-28", "Ravi Menon | Consultant | 2026-10-28", "--evidence", "SO-1");
const init = run("init-engagement", base, "warehouse", "--title", "Warehouse");
const whAgent = join(base, "engagements", "warehouse", "_agent");
writeFileSync(join(whAgent, "open-items.md"), `# Open Items

| ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source |
|---|---|---|---|---|---|---|---|---|
| OI-01 | Is a "Quote" the stock hold for a contractor, or the priced offer sales sends? | STK | Enterprise | Warehouse head | | open | | |
| OI-02 | Pallet size? | STK | Enterprise | | | closed | | QA-2 |
| OI-03 | Who hosts the scanner app? | All | Neomenta | | | open | | |
`);
mkdirSync(join(whAgent, "modules", "STK-stock"), { recursive: true });
writeFileSync(join(whAgent, "modules", "STK-stock", "ticket.md"), `---
status: open
prefix: STK
name: Stock
draft: true
---

# STK — Stock

## 1. Purpose and KPIs

- Purpose: hold stock against each Quote until the contractor pays. [WH-1]

## 11. Requirements

### STK-01 — Hold stock for Quotes

Statement: Stock on a quote is held for 15 days.
Priority: TBC
Scope: Open
Sources: WH-1
Proposed: no
`);
writeFileSync(join(whAgent, "map.md"), read(whAgent, "map.md").replace("|---|---|---|\n", "|---|---|---|\n| STK | Stock | draft |\n"));

function enterprise() {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-gl-")), "harbor-tiles");
  cpSync(base, ent, { recursive: true });
  return { ent, crm: join(ent, "engagements", "crm"), wh: join(ent, "engagements", "warehouse") };
}

test("base: crm v1 released and signed off; warehouse open and valid", () => {
  assert.equal(rel.code, 0, rel.out);
  assert.equal(so.code, 0, so.out);
  assert.equal(init.code, 0, init.out);
  const { crm, wh } = enterprise();
  assert.equal(check(crm).code, 0);
  const r = check(wh);
  assert.equal(r.code, 0, r.out);
});

// ---- agree ----

test("agree --signed: terms shown in a signed-off version become agreed, citing the evidence", () => {
  const { ent, crm } = enterprise();
  const before = glossaryOf(ent);
  const r = g("agree", ent, "--signed");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /agreed: "Quote" \(crm v1\) \[SO-1\]/);
  assert.equal(entry(ent, "Quote"), `**Quote**:
A priced offer for tiles sent to a Lead.
_Avoid_: Quotation, estimate
_Source_: CE-1, QA-1, SO-1 · _Status_: agreed · _Used in_: crm`);
  // Only the Quote entry changed.
  const changed = before.split("\n").filter((l, i) => l !== glossaryOf(ent).split("\n")[i]);
  assert.deepEqual(changed, ["_Source_: CE-1, QA-1 · _Status_: proposed · _Used in_: crm"]);
  assert.match(entry(ent, "Pallet"), /_Status_: agreed · _Used in_: warehouse$/, "other Engagement's term untouched");
  const again = g("agree", ent, "--signed");
  assert.equal(again.code, 0);
  assert.match(again.out, /nothing to agree/);
  assert.equal(check(crm).code, 0);
  assert.equal(termsOf(crm).find((t) => t.term === "Quote").proposed, false);
});

test("agree --signed: a term changed since the signed version stays proposed", () => {
  const { ent } = enterprise();
  const p = join(ent, "_agent", "GLOSSARY.md");
  writeFileSync(p, glossaryOf(ent).replace("A priced offer for tiles sent to a Lead.", "A priced offer sent to a Lead or a contractor."));
  const r = g("agree", ent, "--signed");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /kept proposed: "Quote" changed since crm v1/);
  assert.match(entry(ent, "Quote"), /_Status_: proposed/);
});

test("agree --term: confirmed in a Questionnaire reply", () => {
  const { ent } = enterprise();
  const r = g("agree", ent, "--term", "Quote", "--source", "QA-2");
  assert.equal(r.code, 0, r.out);
  assert.match(entry(ent, "Quote"), /_Source_: CE-1, QA-1, QA-2 · _Status_: agreed · _Used in_: crm$/);
  assert.match(g("agree", ent, "--term", "Lead", "--source", "QA-2").out, /already agreed/);
});

test("agree refuses unknown terms and unregistered Sources; nothing written", () => {
  const { ent } = enterprise();
  const before = glossaryOf(ent);
  const a = g("agree", ent, "--term", "quote", "--source", "QA-2");
  assert.equal(a.code, 1);
  assert.match(a.out, /no term "quote" \(did you mean "Quote"\?\)/);
  const b = g("agree", ent, "--term", "Quote", "--source", "QA-9");
  assert.equal(b.code, 1);
  assert.match(b.out, /QA-9 is not in the Source register/);
  assert.equal(glossaryOf(ent), before);
});

// ---- dispute ----

test("dispute: new meaning raises the flag in the finding Engagement; the meaning is never overwritten", () => {
  const { ent, crm, wh } = enterprise();
  const r = g("dispute", ent, "--term", "Quote", "--engagement", "warehouse", "--oi", "OI-01");
  assert.equal(r.code, 0, r.out);
  assert.equal(entry(ent, "Quote"), `**Quote**:
A priced offer for tiles sent to a Lead.
_Avoid_: Quotation, estimate
_Source_: CE-1, QA-1 · _Status_: proposed · _Used in_: crm, warehouse · _Disputed_: warehouse/OI-01`);
  assert.equal(termsOf(wh).find((t) => t.term === "Quote").disputed, "OI-01");
  assert.equal(termsOf(crm).find((t) => t.term === "Quote").disputed, undefined, "OI IDs are per Engagement");
  assert.equal(check(wh).code, 0);
  assert.equal(check(crm).code, 0);
  // Disputed terms are not agreed by a Questionnaire reply or a Sign-off.
  assert.equal(g("agree", ent, "--term", "Quote", "--source", "QA-2").code, 1);
  assert.match(g("agree", ent, "--signed").out, /kept: "Quote" is disputed \(warehouse\/OI-01\)/);
  assert.match(entry(ent, "Quote"), /_Status_: proposed/);
  // OI closed without settling the term → build error.
  const oi = join(wh, "_agent", "open-items.md");
  writeFileSync(oi, read(oi).replace("| Warehouse head | | open |", "| Warehouse head | | closed |"));
  const c = check(wh);
  assert.equal(c.code, 1);
  assert.match(c.out, /error \[disputed-term\] glossary term "Quote" is disputed but OI-01 is closed/);
});

test("dispute refuses: missing, closed or Neomenta-owned Open Item; already disputed", () => {
  const { ent } = enterprise();
  const before = glossaryOf(ent);
  const cases = [["OI-09", /not in engagements\/warehouse/], ["OI-02", /is closed/], ["OI-03", /owner Enterprise/]];
  for (const [oi, msg] of cases) {
    const r = g("dispute", ent, "--term", "Quote", "--engagement", "warehouse", "--oi", oi);
    assert.equal(r.code, 1, oi);
    assert.match(r.out, msg);
  }
  assert.equal(glossaryOf(ent), before);
  g("dispute", ent, "--term", "Quote", "--engagement", "warehouse", "--oi", "OI-01");
  const twice = g("dispute", ent, "--term", "Quote", "--engagement", "crm", "--oi", "OI-01");
  assert.equal(twice.code, 1);
  assert.match(twice.out, /already disputed \(warehouse\/OI-01\)/);
});

// ---- settle ----

test("settle: the Enterprise's answer keeps or replaces the meaning; term agreed", () => {
  const { ent } = enterprise();
  g("dispute", ent, "--term", "Quote", "--engagement", "warehouse", "--oi", "OI-01");
  assert.equal(g("settle", ent, "--term", "Quote").code, 2, "needs the answer Source");
  const r = g("settle", ent, "--term", "Quote", "--source", "QA-2", "--definition", "A priced offer for tiles sent to a Lead or a contractor.");
  assert.equal(r.code, 0, r.out);
  assert.equal(entry(ent, "Quote"), `**Quote**:
A priced offer for tiles sent to a Lead or a contractor.
_Avoid_: Quotation, estimate
_Source_: CE-1, QA-1, QA-2 · _Status_: agreed · _Used in_: crm, warehouse`);
  assert.equal(g("settle", ent, "--term", "Quote", "--source", "QA-2").code, 1, "no longer disputed");
});

// ---- split ----

test("split: two real meanings → two qualified terms, bare word in Avoid; open Engagements listed, signed ones skipped", () => {
  const { ent } = enterprise();
  g("dispute", ent, "--term", "Quote", "--engagement", "warehouse", "--oi", "OI-01");
  const before = files(ent);
  const into = ["--into", "Sales Quote | A priced offer for tiles sent to a Lead. | crm", "Stock Quote | Stock held for a contractor until they pay. | warehouse"];
  assert.equal(g("split", ent, "--term", "Quote", ...into).code, 1, "disputed: needs the Enterprise's answer");
  const r = g("split", ent, "--term", "Quote", ...into, "--source", "QA-2");
  assert.equal(r.code, 0, r.out);
  assert.equal(entry(ent, "Quote"), null);
  assert.equal(entry(ent, "Sales Quote"), `**Sales Quote**:
A priced offer for tiles sent to a Lead.
_Avoid_: Quotation, estimate, Quote
_Source_: CE-1, QA-1, QA-2 · _Status_: agreed · _Used in_: crm`);
  assert.equal(entry(ent, "Stock Quote"), `**Stock Quote**:
Stock held for a contractor until they pay.
_Avoid_: Quotation, estimate, Quote
_Source_: CE-1, QA-1, QA-2 · _Status_: agreed · _Used in_: warehouse`);
  assert.match(r.out, /skipped: crm \(latest version v1 signed off; never rewritten\)/);
  assert.match(r.out, /rewrite: engagements\/warehouse\/_agent\/modules\/STK-stock\/ticket\.md:\d+: - Purpose: hold stock against each Quote/);
  assert.match(r.out, /rewrite: engagements\/warehouse\/_agent\/modules\/STK-stock\/ticket\.md:\d+: ### STK-01 — Hold stock for Quotes/);
  assert.doesNotMatch(r.out, /rewrite: engagements\/crm/);
  // Only GLOSSARY.md changed; signed versions and specs untouched.
  const after = files(ent);
  for (const [p, text] of Object.entries(before)) if (p !== join("_agent", "GLOSSARY.md")) assert.equal(after[p], text, p);
  assert.equal(check(join(ent, "engagements", "crm")).code, 0);
});

test("split of an undisputed proposed term stays proposed; bad input refused", () => {
  const { ent } = enterprise();
  const before = glossaryOf(ent);
  assert.equal(g("split", ent, "--term", "Quote", "--into", "Quote | x | crm", "Stock Quote | y | warehouse").code, 1, "bare word kept");
  assert.equal(g("split", ent, "--term", "Quote", "--into", "Lead | x | crm", "Stock Quote | y | warehouse").code, 1, "existing term");
  assert.equal(g("split", ent, "--term", "Quote", "--into", "Sales Quote | x").code, 2);
  assert.equal(glossaryOf(ent), before);
  const r = g("split", ent, "--term", "Quote", "--into", "Sales Quote | x | crm", "Stock Quote | y | warehouse");
  assert.equal(r.code, 0, r.out);
  assert.match(entry(ent, "Sales Quote"), /_Status_: proposed/);
});

// ---- rename ----

test("rename: new name is the entry, old name in Avoid; signed versions untouched", () => {
  const { ent, crm } = enterprise();
  const v1 = read(crm, "_agent", "brd", "versions", "v1.json");
  const r = g("rename", ent, "--term", "Quote", "--to", "Offer");
  assert.equal(r.code, 0, r.out);
  assert.equal(entry(ent, "Offer"), `**Offer**:
A priced offer for tiles sent to a Lead.
_Avoid_: Quotation, estimate, Quote
_Source_: CE-1, QA-1 · _Status_: proposed · _Used in_: crm`);
  assert.match(r.out, /skipped: crm/);
  assert.match(r.out, /4 line\(s\) in open Engagements still say "Quote"; rewrite to "Offer"/);
  assert.equal(read(crm, "_agent", "brd", "versions", "v1.json"), v1);
  assert.equal(JSON.parse(v1).glossary.some((t) => t.term === "Quote"), true);
});

test("rename of an agreed term needs the Enterprise's answer; stays agreed", () => {
  const { ent } = enterprise();
  const a = g("rename", ent, "--term", "Pallet", "--to", "Tile pallet");
  assert.equal(a.code, 1);
  assert.match(a.out, /agreed; needs --source/);
  const b = g("rename", ent, "--term", "Pallet", "--to", "Tile pallet", "--source", "QA-2");
  assert.equal(b.code, 0, b.out);
  assert.match(entry(ent, "Tile pallet"), /_Avoid_: Skid, Pallet\n_Source_: WH-1, QA-2 · _Status_: agreed · _Used in_: warehouse$/);
  assert.equal(g("rename", ent, "--term", "Lead", "--to", "Tile pallet", "--source", "QA-2").code, 1, "name taken");
});

test("bad arguments exit 2", () => {
  const { ent } = enterprise();
  assert.equal(run("glossary").code, 2);
  assert.equal(g("forget", ent).code, 2);
  assert.equal(g("agree", ent).code, 2);
  assert.equal(g("agree", ent, "--signed", "--term", "Quote").code, 2);
  assert.equal(g("dispute", ent, "--term", "Quote", "--engagement", "Warehouse", "--oi", "OI-01").code, 2);
  assert.equal(g("dispute", ent, "--term", "Quote", "--engagement", "warehouse", "--oi", "7").code, 2);
  assert.equal(g("agree", join(ent, "nowhere"), "--signed").code, 2);
});

// ---- catalog terms ----

test("build warns on a Neome App name or a Neome mapping in the glossary", () => {
  const { ent, crm } = enterprise();
  appendFileSync(join(ent, "_agent", "GLOSSARY.md"), `
**CRM**:
Where sales keeps Leads.
_Source_: CE-1 · _Status_: proposed · _Used in_: crm

**Showroom**:
A shop; maps to the Neome Appointment Booking app.
_Source_: CE-1 · _Status_: proposed · _Used in_: crm
`);
  const r = check(crm);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warning \[catalog-term\] glossary term "CRM" is a Neome App name/);
  assert.match(r.out, /warning \[catalog-term\] glossary term "Showroom" mentions Neome; a term → Neome mapping belongs in Module spec section 12/);
});
