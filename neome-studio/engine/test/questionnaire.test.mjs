// questionnaire helpers (ticket 35): new-questionnaire (selection, order, master, register `asked in`,
// re-ask marks, size warning) and export-questionnaire (HTML + TXT shape), plus the hand-run sample:
// QN-2026-10-29 to Meera Shah from the resolved QUO Engagement.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr, stdout: r.stdout };
};
function copy(rel) {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-qn-")), "harbor-tiles");
  cpSync(join(fixtures, rel, "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const resolved = () => copy("resolve-module/after-resolve"); // 10 open Enterprise OIs, OI-01/04 closed
const sent = () => copy("questionnaire/after-questionnaire"); // QN-2026-10-29 written (views not stored)

const read = (...p) => readFileSync(join(...p), "utf8");
const agent = (eng, ...p) => join(eng, "_agent", ...p);
const edit = (path, from, to) => {
  const t = readFileSync(path, "utf8");
  assert.ok(t.includes(from), `${from} not in ${path}`);
  writeFileSync(path, t.replace(from, to));
};
const addRows = (eng, rows) => {
  const p = agent(eng, "open-items.md");
  writeFileSync(p, readFileSync(p, "utf8").replace(/\n*$/, "\n") + rows.join("\n") + "\n");
};
const qnId = (out) => out.match(/(QN-\d{4}-\d{2}-\d{2}(?:-\d+)?)\.md/)[1];
const master = (eng, id) => read(agent(eng, "questionnaires", `${id}.md`));
const itemIds = (text) => [...text.matchAll(/^### (OI-\d+)/gm)].map((m) => m[1]);
const sectionKeys = (text) => [...text.matchAll(/^## (\S+) — /gm)].map((m) => m[1]);
const askedIn = (eng, id) => read(agent(eng, "open-items.md")).match(new RegExp(`^\\| ${id} \\|.*$`, "m"))[0].split("|")[8].trim();

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

const ALL_ORDER = ["OI-05", "OI-06", "OI-07", "OI-08", "OI-12", "OI-02", "OI-10", "OI-03", "OI-09", "OI-11"];

// ---- new-questionnaire ----

test("--check lists the items in order with warnings and writes nothing", () => {
  const { ent, eng } = resolved();
  const before = snapshot(ent);
  const r = run("new-questionnaire", eng, "--to", "Meera Shah", "--check");
  assert.equal(r.code, 0, r.out);
  assert.deepEqual([...r.stdout.matchAll(/^\S+\s+(OI-\d+)/gm)].map((m) => m[1]), ALL_ORDER);
  assert.match(r.out, /QUO\s+OI-10 · For: Sales head · Must/);
  assert.match(r.out, /warning \[no-suggested\] OI-05/);
  assert.match(r.out, /10 item\(s\) for Meera Shah as QN-\d{4}-\d{2}-\d{2} \(check only, nothing written\)/);
  assert.deepEqual(snapshot(ent), before);
});

test("writes the master: one named contact, sections All first then map order, Must first, open Enterprise OIs only", () => {
  const { eng } = resolved();
  addRows(eng, ["| OI-13 | Which Neome plan fits? | QUO | Neomenta | | | open | | |"]);
  const r = run("new-questionnaire", eng, "--to", "Meera Shah", "--role", "Sales head", "--from", "Asha");
  assert.equal(r.code, 0, r.out);
  const id = qnId(r.out);
  const text = master(eng, id);
  assert.match(text, new RegExp(`^# Questionnaire ${id}\n\nTo: Meera Shah \\(Sales head\\)\nFrom: Asha, Neomenta\nEnterprise: Harbor Tiles\nEngagement: Sales CRM \\(crm\\)\nDate: \\d{4}-\\d{2}-\\d{2}\nModules: all\nItems: 10\n`));
  assert.deepEqual(sectionKeys(text), ["All", "ENQ", "QUO"]);
  assert.deepEqual(itemIds(text), ALL_ORDER); // OI-10 (on Must QUO-02) leads QUO; closed OI-01/04 and Neomenta OI-13 out
  assert.equal((text.match(/^To: /gm) ?? []).length, 1);
  // Item shape; what the Enterprise reads has no Source IDs or "(proposed, to confirm)".
  assert.match(text, /### OI-10 · For: Sales head\nWhen the sales head is away, who approves discounts above 8%\?\nSuggested: Kochi showroom manager\nReply: Yes \/ Edit: ___ \/ Don't know\n/);
  assert.match(text, /### OI-03 · For: Accounts\nHow should accepted quotations reach Tally, and who owns that link\?\nReply: Answer: ___ \/ Don't know\n/);
  assert.doesNotMatch(text, /proposed, to confirm|\[[A-Z]{2,4}-\d+\]/);
});

test("Must first holds in the All section too (OI on a Must Engagement-wide Requirement)", () => {
  const { eng } = resolved();
  edit(agent(eng, "general.md"), "Staff are trained before go-live. [CE-1]\nAcceptance:\n- Every sales exec has done the training before go-live. (proposed, to confirm)\nPriority: TBC",
    "Staff are trained before go-live. [CE-1]\nAcceptance:\n- Every sales exec has done the training before go-live. (proposed, to confirm)\nPriority: Must");
  const r = run("new-questionnaire", eng, "--to", "Meera Shah");
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(itemIds(master(eng, qnId(r.out))).slice(0, 5), ["OI-06", "OI-05", "OI-07", "OI-08", "OI-12"]);
});

test("updates the register (asked in) and the map change log; the Engagement still builds", () => {
  const { eng } = resolved();
  const r = run("new-questionnaire", eng, "--to", "Meera Shah", "--role", "Sales head");
  assert.equal(r.code, 0, r.out);
  const id = qnId(r.out);
  for (const oi of ALL_ORDER) assert.equal(askedIn(eng, oi), id, oi);
  for (const oi of ["OI-01", "OI-04"]) assert.equal(askedIn(eng, oi), "", oi);
  assert.equal(read(agent(eng, "map.md")).trim().split("\n").pop(), `- ${id.slice(3, 13)}: questionnaire: ${id} to Meera Shah, 10 Open Item(s).`);
  const b = run("build-brd", eng, "--check");
  assert.equal(b.code, 0, b.out);
});

test("--module narrows the selection; All is its own choice; unknown Module refused", () => {
  const { eng } = resolved();
  let r = run("new-questionnaire", eng, "--to", "Joel", "--module", "QUO", "--check");
  assert.equal(r.code, 0, r.out);
  assert.deepEqual([...r.stdout.matchAll(/^(\S+)\s+(OI-\d+)/gm)].map((m) => `${m[1]} ${m[2]}`), ["QUO OI-10", "QUO OI-03", "QUO OI-09", "QUO OI-11"]);
  r = run("new-questionnaire", eng, "--to", "Joel", "--module", "All, ENQ");
  assert.equal(r.code, 0, r.out);
  const text = master(eng, qnId(r.out));
  assert.match(text, /^Modules: All, ENQ$/m);
  assert.deepEqual(itemIds(text), ["OI-05", "OI-06", "OI-07", "OI-08", "OI-12", "OI-02"]);
  r = run("new-questionnaire", eng, "--to", "Joel", "--module", "LEAD");
  assert.equal(r.code, 1);
  assert.match(r.out, /error \[questionnaire\] no Module LEAD/);
});

test("re-asked items are marked asked before (QN-…); a second QN the same day gets -2", () => {
  const { eng } = sent();
  const r = run("new-questionnaire", eng, "--to", "Joel", "--module", "QUO");
  assert.equal(r.code, 0, r.out);
  const id = qnId(r.out);
  assert.match(id, /^QN-\d{4}-\d{2}-\d{2}(-2)?$/);
  const text = master(eng, id);
  assert.match(text, /^### OI-10 · For: Sales head · asked before \(QN-2026-10-29\)$/m);
  assert.equal(askedIn(eng, "OI-10"), `QN-2026-10-29, ${id}`);
  assert.equal(askedIn(eng, "OI-05"), "QN-2026-10-29");
  const again = run("new-questionnaire", eng, "--to", "Joel", "--module", "QUO");
  assert.equal(again.code, 0, again.out);
  assert.equal(qnId(again.out), `${id.slice(0, 13)}-${id.length > 13 ? 3 : 2}`);
  assert.match(master(eng, qnId(again.out)), /asked before \(QN-2026-10-29, QN-[\d-]+\)/);
});

test("over ~25 items: warning suggests a split by Module (still writes)", () => {
  const { eng } = resolved();
  addRows(eng, Array.from({ length: 16 }, (_, i) => `| OI-${20 + i} | Extra question ${i}? | ENQ | Enterprise | Sales head | Yes | open | | |`));
  const r = run("new-questionnaire", eng, "--to", "Meera Shah");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warning \[size\] 26 items, over ~25\. Suggest one Questionnaire per Module: --module All \(5\), --module ENQ \(17\), --module QUO \(4\)/);
  assert.ok(existsSync(agent(eng, "questionnaires", `${qnId(r.out)}.md`)));
  const small = resolved();
  assert.doesNotMatch(run("new-questionnaire", small.eng, "--to", "Meera Shah", "--check").out, /warning \[size\]/);
});

test("refusals: nothing to ask, broken Engagement (exit 1, nothing written); bad arguments (exit 2)", () => {
  const none = resolved();
  const p = agent(none.eng, "open-items.md");
  writeFileSync(p, readFileSync(p, "utf8").replace(/\| open \|/g, "| closed |"));
  const snap = snapshot(none.ent);
  let r = run("new-questionnaire", none.eng, "--to", "Joel");
  assert.equal(r.code, 1);
  assert.match(r.out, /no open Enterprise-owned Open Items; nothing to ask/);
  assert.deepEqual(snapshot(none.ent), snap);

  const broken = resolved();
  addRows(broken.eng, ["| OI-13 | Who? | LEAD | Enterprise | | | open | | |"]);
  const snap2 = snapshot(broken.ent);
  r = run("new-questionnaire", broken.eng, "--to", "Joel");
  assert.equal(r.code, 1);
  assert.match(r.out, /error \[unknown-module\]/);
  assert.deepEqual(snapshot(broken.ent), snap2);

  const { ent, eng } = resolved();
  const before = snapshot(ent);
  assert.equal(run("new-questionnaire", eng).code, 2); // no --to
  assert.equal(run("new-questionnaire", eng, "--to", " ").code, 2);
  assert.equal(run("new-questionnaire").code, 2);
  assert.equal(run("new-questionnaire", join(ent, "nope"), "--to", "Joel").code, 2);
  assert.equal(run("new-questionnaire", eng, "--to", "Joel", "--wat", "x").code, 2);
  assert.equal(run("new-questionnaire", eng, "--to", "Joel", "--module", " , ").code, 2);
  assert.deepEqual(snapshot(ent), before);
});

// ---- export-questionnaire ----

const exported = () => {
  const s = sent();
  const r = run("export-questionnaire", s.eng, "QN-2026-10-29");
  assert.equal(r.code, 0, r.out);
  return {
    ...s,
    html: read(s.eng, "questionnaires", "QN-2026-10-29.html"),
    txt: read(s.eng, "questionnaires", "QN-2026-10-29.txt"),
  };
};
const SENT_ORDER = ["OI-05", "OI-06", "OI-07", "OI-08", "OI-12", "OI-02", "OI-10", "OI-03", "OI-09", "OI-11"];

test("HTML: Neome look, A4 print, no script, nothing external, items in master order", () => {
  const { html } = exported();
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /(src|href)=["']?https?:|@import|url\(\s*["']?https?:/i);
  assert.match(html, /@page\{size:A4/);
  assert.match(html, /break-inside:avoid/);
  assert.match(html, /--primary:#1976D2/); // Neome product tokens
  assert.match(html, /<title>Questionnaire QN-2026-10-29 · Harbor Tiles · Sales CRM<\/title>/);
  assert.match(html, /<h1>Questions for Meera Shah<\/h1>/);
  assert.match(html, /<dt>To<\/dt><dd>Meera Shah \(Sales head\)<\/dd>/);
  assert.deepEqual([...html.matchAll(/<article class="item" id="(OI-\d+)"/g)].map((m) => m[1]), SENT_ORDER);
  assert.deepEqual([...html.matchAll(/<span class="key">([^<]+)<\/span>/g)].map((m) => m[1]), ["All", "ENQ", "QUO"]);
  assert.match(html, /<span class="oi">OI-10<\/span><span class="for">For: <b>Sales head<\/b><\/span><\/div>\n<p class="q">When the sales head is away, who approves discounts above 8%\?<\/p>\n<p class="sug"><span class="lbl">Suggested<\/span>Kochi showroom manager<\/p>/);
  assert.match(html, /<span class="box"><\/span>Yes<\/span><span class="opt grow"><span class="box"><\/span>Edit:/);
  assert.match(html, /Don&#39;t know/);
});

test("TXT: numbered items, no tables, item shape lines, sections All first", () => {
  const { txt } = exported();
  assert.doesNotMatch(txt, /^\s*\|/m);
  assert.doesNotMatch(txt, /<[a-z]/i);
  assert.match(txt, /^\*Questionnaire QN-2026-10-29\*\nTo: Meera Shah \(Sales head\)\nFrom: Asha, Neomenta\nHarbor Tiles · Sales CRM · 2026-10-29\n10 questions\.\n/);
  assert.deepEqual([...txt.matchAll(/^(\d+)\. (OI-\d+)/gm)].map((m) => `${m[1]} ${m[2]}`), SENT_ORDER.map((id, i) => `${i + 1} ${id}`));
  assert.deepEqual([...txt.matchAll(/^\*(\S+) · /gm)].map((m) => m[1]), ["All", "ENQ", "QUO"]);
  assert.match(txt, /\n7\. OI-10 · For: Sales head\nWhen the sales head is away, who approves discounts above 8%\?\nSuggested: Kochi showroom manager\nReply: Yes \/ Edit: ___ \/ Don't know\n/);
  assert.match(txt, /\n2\. OI-06 · For: Sales head\nWho is trained .*\nReply: Answer: ___ \/ Don't know\n/);
});

test("re-asked marks reach both views; same master gives byte-identical views", () => {
  const { eng } = sent();
  const r = run("new-questionnaire", eng, "--to", "Joel", "--module", "ENQ");
  const id = qnId(r.out);
  assert.equal(run("export-questionnaire", eng, id).code, 0);
  const html = read(eng, "questionnaires", `${id}.html`);
  const txt = read(eng, "questionnaires", `${id}.txt`);
  assert.match(html, /<span class="again">asked before \(QN-2026-10-29\)<\/span>/);
  assert.match(txt, /^1\. OI-02 · For: Sales head · asked before \(QN-2026-10-29\)$/m);
  assert.equal(run("export-questionnaire", eng, `${id}.md`).code, 0);
  assert.equal(read(eng, "questionnaires", `${id}.html`), html);
  assert.equal(read(eng, "questionnaires", `${id}.txt`), txt);
});

test("export refusals: missing or broken master (exit 1, no views); bad arguments (exit 2)", () => {
  const { ent, eng } = sent();
  let r = run("export-questionnaire", eng, "QN-2026-01-01");
  assert.equal(r.code, 1);
  assert.match(r.out, /error \[questionnaire\] .*QN-2026-01-01\.md missing/);
  const p = agent(eng, "questionnaires", "QN-2026-10-29.md");
  const good = readFileSync(p, "utf8");
  for (const [from, to, msg] of [
    ["To: Meera Shah (Sales head)\n", "", /needs a `To: <name>` line/],
    ["### OI-06 · For: Sales head", "### OI-05 · For: Sales head", /OI-05 appears twice/],
    ["Items: 10", "Items: 9", /Items: 9 but 10 item\(s\) listed/],
    ["# Questionnaire QN-2026-10-29", "# Questionnaire QN-2026-10-28", /heading names QN-2026-10-28/],
    ["Reply: Yes / Edit: ___ / Don't know\n\n### OI-08", "Second line\nReply: Yes / Edit: ___ / Don't know\n\n### OI-08", /OI-07: question must be one line/],
  ]) {
    assert.ok(good.includes(from), from);
    writeFileSync(p, good.replace(from, to));
    r = run("export-questionnaire", eng, "QN-2026-10-29");
    assert.equal(r.code, 1, from);
    assert.match(r.out, msg);
    assert.ok(!existsSync(join(eng, "questionnaires")), "no views written");
  }
  assert.equal(run("export-questionnaire", eng).code, 2);
  assert.equal(run("export-questionnaire", eng, "march").code, 2);
  assert.equal(run("export-questionnaire", join(ent, "nope"), "QN-2026-10-29").code, 2);
});

// ---- hand-run sample ----

test("hand-run sample: the stored master is what the engine writes from the resolved Engagement", () => {
  const { eng: base } = resolved();
  const { eng: done } = sent();
  // The skill filled OI-05's suggested answer in the register before building (its only register edit).
  const reg = (e) => read(agent(e, "open-items.md"));
  edit(agent(base, "open-items.md"), "| OI-05 | Which Excel customer list, which columns and how many rows move? | All | Enterprise | Accounts | |",
    "| OI-05 | Which Excel customer list, which columns and how many rows move? | All | Enterprise | Accounts | The current customer Excel sheet, all its columns, loaded with Neome's Excel import (proposed, to confirm) |");
  const r = run("new-questionnaire", base, "--to", "Meera Shah", "--role", "Sales head", "--from", "Asha");
  assert.equal(r.code, 0, r.out);
  const id = qnId(r.out);
  const date = id.slice(3, 13);
  const norm = (t) => t.replaceAll(id, "QN-X").replaceAll("QN-2026-10-29", "QN-X").replaceAll(date, "D").replaceAll("2026-10-29", "D");
  assert.equal(norm(master(base, id)), norm(master(done, "QN-2026-10-29")));
  assert.equal(norm(reg(base)), norm(reg(done)));
  assert.match(master(done, "QN-2026-10-29"), /Suggested: The current customer Excel sheet, all its columns, loaded with Neome's Excel import\n/);
  const b = run("build-brd", done, "--check");
  assert.equal(b.code, 0, b.out);
});
