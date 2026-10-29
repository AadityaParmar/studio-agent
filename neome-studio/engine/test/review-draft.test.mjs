// review-draft helpers (ticket 30): module list / confirm / rename / merge / new / move.
// Plus the hand-run sample: review-draft output on the first ingest must pass the preview build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};

// Copy of an Enterprise fixture; returns { ent, eng }.
function copy(rel) {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-review-")), "harbor-tiles");
  cpSync(join(fixtures, rel, "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const draft = () => copy("ingest/first-run");
const reviewed = () => copy("review-draft/after-review");

const read = (...p) => readFileSync(join(...p), "utf8");
const agent = (eng, ...p) => join(eng, "_agent", ...p);
const ticket = (eng, folder) => read(agent(eng, "modules", folder, "ticket.md"));
const fm = (text) => parseYaml(text.match(/^---\n([\s\S]*?)\n---\n/)[1]);
const mapRow = (eng, p) => read(agent(eng, "map.md")).match(new RegExp(`^\\| ${p} \\|.*$`, "m"))?.[0];
const oiRow = (eng, id) => read(agent(eng, "open-items.md")).match(new RegExp(`^\\| ${id} \\|.*$`, "m"))[0];
const check = (eng) => run("build-brd", eng, "--check");

// Full preview build (data file written); returns data.
function build(eng) {
  const r = spawnSync(process.execPath, [cli, "build-brd", eng], { encoding: "utf8" });
  const out = agent(eng, "brd", "brd-data.json");
  return { code: r.status, out: r.stdout + r.stderr, data: existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null };
}

// All files under a folder → text, to prove a refused command wrote nothing.
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

// ---- list / confirm ----

test("module list shows each Module in map order, draft or confirmed", () => {
  const { eng } = draft();
  const r = run("module", "list", eng);
  assert.equal(r.code, 0, r.out);
  assert.equal(r.out.trim(), "ENQ | Enquiries | open | draft\nQUO | Quotations | open | draft");
});

test("confirm clears draft, writes the full ticket front-matter, map row and change log", () => {
  const { eng } = draft();
  assert.equal(run("module", "confirm", eng, "ENQ").code, 0);
  const r = run("module", "confirm", eng, "QUO", "--blocked-by", "ENQ");
  assert.equal(r.code, 0, r.out);
  const t = ticket(eng, "QUO-quotations");
  assert.match(t, /^---\nstatus: open\nprefix: QUO\nname: Quotations\nblockedBy: \[ENQ\]\nrevisitReason:\nformerly:\nclaimedBy:\n---\n\n# QUO — Quotations\n/);
  assert.equal(fm(t).draft, undefined);
  assert.equal(mapRow(eng, "QUO"), "| QUO | Quotations | open |");
  assert.match(read(agent(eng, "map.md")), /- \d{4}-\d{2}-\d{2}: review-draft: QUO confirmed\.\n$/);
  assert.match(run("module", "list", eng).out, /QUO \| Quotations \| open \| confirmed \| blockedBy ENQ/);
  assert.equal(check(eng).code, 0);
});

test("confirm refuses an already confirmed Module and bad blocked-by; nothing written", () => {
  const { ent, eng } = draft();
  run("module", "confirm", eng, "ENQ");
  const before = snapshot(ent);
  let r = run("module", "confirm", eng, "ENQ");
  assert.equal(r.code, 1);
  assert.match(r.out, /already confirmed/);
  r = run("module", "confirm", eng, "QUO", "--blocked-by", "ENQ, NOPE");
  assert.equal(r.code, 1);
  assert.match(r.out, /unknown Module "NOPE"/);
  assert.equal(run("module", "confirm", eng, "QUO", "--blocked-by", "QUO").code, 1);
  assert.equal(run("module", "confirm", eng, "XYZ").code, 1);
  assert.equal(run("module", "confirm", eng, "quo").code, 2);
  assert.equal(run("module", "confirm", join(ent, "engagements", "nope"), "QUO").code, 2);
  assert.equal(run("module", "frobnicate", eng).code, 2);
  assert.deepEqual(snapshot(ent), before);
});

// ---- rename ----

test("rename: folder renamed, formerly recorded, references repointed, IDs kept", () => {
  const { eng } = draft();
  run("module", "confirm", eng, "ENQ");
  run("module", "confirm", eng, "QUO", "--blocked-by", "ENQ");
  // ENQ → LEAD; QUO's blockedBy and the OI register must follow.
  const r = run("module", "rename", eng, "ENQ", "--to", "LEAD", "--name", "Leads");
  assert.equal(r.code, 0, r.out);
  assert.ok(!existsSync(agent(eng, "modules", "ENQ-enquiries")));
  const t = ticket(eng, "LEAD-leads");
  assert.deepEqual([fm(t).prefix, fm(t).formerly, fm(t).name], ["LEAD", "ENQ", "Leads"]);
  assert.match(t, /^# LEAD — Leads$/m);
  assert.match(t, /^Name: Leads$/m);
  assert.match(t, /^### ENQ-01 — /m, "Requirement IDs keep the old prefix");
  assert.equal(mapRow(eng, "LEAD"), "| LEAD | Leads | open |");
  assert.equal(mapRow(eng, "ENQ"), undefined);
  assert.match(oiRow(eng, "OI-02"), /\| LEAD \|/);
  assert.deepEqual(fm(ticket(eng, "QUO-quotations")).blockedBy, ["LEAD"]);
  assert.match(read(agent(eng, "map.md")), /review-draft: ENQ renamed to LEAD \(Leads\); Requirement IDs keep ENQ\./);
  const b = check(eng);
  assert.equal(b.code, 0, b.out);
});

test("rename name only keeps the prefix and moves the folder; draft stays draft", () => {
  const { eng } = draft();
  const r = run("module", "rename", eng, "QUO", "--name", "Quotes");
  assert.equal(r.code, 0, r.out);
  const t = ticket(eng, "QUO-quotes");
  assert.equal(fm(t).draft, true);
  assert.equal(fm(t).formerly, undefined);
  assert.equal(mapRow(eng, "QUO"), "| QUO | Quotes | draft |");
  assert.equal(check(eng).code, 0);
});

test("rename refuses a taken prefix, GEN, or a second prefix change", () => {
  const { ent, eng } = draft();
  const before = snapshot(ent);
  assert.equal(run("module", "rename", eng, "QUO", "--to", "ENQ").code, 1);
  assert.equal(run("module", "rename", eng, "QUO", "--to", "GEN").code, 1);
  assert.equal(run("module", "rename", eng, "QUO").code, 2);
  assert.deepEqual(snapshot(ent), before);
  run("module", "rename", eng, "QUO", "--to", "QT");
  const r = run("module", "rename", eng, "QT", "--to", "QX");
  assert.equal(r.code, 1);
  assert.match(r.out, /already renamed from QUO/);
  assert.equal(run("module", "rename", eng, "ENQ", "--to", "QUO").code, 1, "a former prefix is taken");
});

// ---- merge / new / move (split) ----

test("merge keeps the old folder merged-into, moves live Requirements with new IDs, repoints OIs", () => {
  const { eng } = draft();
  const r = run("module", "merge", eng, "ENQ", "--into", "QUO");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /requirement: ENQ-01 → QUO-06/);
  assert.match(r.out, /fold in by hand .*Purpose and KPIs/);
  const old = ticket(eng, "ENQ-enquiries");
  assert.equal(fm(old).status, "merged-into QUO");
  assert.equal(fm(old).draft, undefined);
  assert.match(old, /### ENQ-02 — Follow-up reminder[\s\S]*?Withdrawn: Merged into QUO-07/);
  const quo = ticket(eng, "QUO-quotations");
  assert.match(quo, /### QUO-06 — Log an enquiry from any channel/);
  assert.match(quo, /### QUO-08 — Who sees which enquiries/);
  assert.match(quo, /## 13 Open Items[\s\S]*- OI-02:/, "OI bullet brought along");
  assert.equal(mapRow(eng, "ENQ"), "| ENQ | Enquiries | merged-into QUO |");
  assert.match(oiRow(eng, "OI-02"), /\| QUO \|/);
  const b = build(eng);
  assert.equal(b.code, 0, b.out);
  const enq = b.data.modules.find((m) => m.prefix === "ENQ");
  assert.equal(enq.status, "merged-into:QUO");
  assert.ok(enq.requirements.every((q) => q.withdrawn));
  assert.equal(run("module", "merge", eng, "ENQ", "--into", "QUO").code, 1, "already merged");
  assert.equal(run("module", "merge", eng, "QUO", "--into", "ENQ").code, 1, "into a merged Module");
});

test("split = new parts + move + merge the rest; old folder kept merged-into", () => {
  const { eng } = draft();
  let r = run("module", "new", eng, "CRD", "--name", "Credit checks", "--after", "QUO");
  assert.equal(r.code, 0, r.out);
  r = run("module", "new", eng, "QT", "--name", "Quotes", "--after", "QUO");
  assert.equal(r.code, 0, r.out);
  assert.equal(fm(ticket(eng, "CRD-credit-checks")).draft, true);
  assert.deepEqual(read(agent(eng, "map.md")).match(/^\| [A-Z]+ \|/gm), ["| ENQ |", "| QUO |", "| QT |", "| CRD |"]);
  r = run("module", "move", eng, "QUO-03", "--to", "CRD");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /requirement: QUO-03 → CRD-01/);
  assert.match(oiRow(eng, "OI-04"), /\| QUO, CRD \|/);
  assert.match(ticket(eng, "CRD-credit-checks"), /## 11 Requirements\n\n### CRD-01 — Credit check[\s\S]*## 13 Open Items\n\n- OI-04:/);
  r = run("module", "merge", eng, "QUO", "--into", "QT");
  assert.equal(r.code, 0, r.out);
  assert.equal(fm(ticket(eng, "QUO-quotations")).status, "merged-into QT");
  assert.match(ticket(eng, "QUO-quotations"), /### QUO-03 — [\s\S]*?Withdrawn: Moved to CRD-01/);
  assert.match(ticket(eng, "QT-quotes"), /### QT-03 — Quotation valid for 15 days/);
  assert.match(oiRow(eng, "OI-04"), /\| QT, CRD \|/);
  for (const p of ["QT", "CRD", "ENQ"]) assert.equal(run("module", "confirm", eng, p).code, 0);
  const b = check(eng);
  assert.equal(b.code, 0, b.out);
  assert.equal(run("module", "move", eng, "QUO-03", "--to", "QT").code, 1, "withdrawn Requirement");
  assert.equal(run("module", "move", eng, "QT-01", "--to", "QT").code, 1, "same Module");
  assert.equal(run("module", "new", eng, "QUO", "--name", "Again").code, 1, "prefix kept by merged folder");
  assert.equal(run("module", "new", eng, "GEN", "--name", "General").code, 1);
});

// ---- sample review-draft run (hand-run of the skill, kept as a fixture) ----

test("sample review-draft output passes the preview build: confirmed tickets, process, topics, plan skeleton", () => {
  const { ent, eng } = reviewed();
  const b = build(eng);
  assert.equal(b.code, 0, b.out);
  assert.doesNotMatch(b.out, /^error/m);
  const d = b.data;
  // One confirmed ticket per Module, full front-matter, map mirrors it.
  for (const folder of readdirSync(agent(eng, "modules"))) {
    const f = fm(ticket(eng, folder));
    assert.equal(f.draft, undefined, `${folder} still draft`);
    for (const k of ["status", "prefix", "blockedBy", "revisitReason", "formerly", "claimedBy"]) assert.ok(k in f, `${folder}: ${k}`);
    assert.equal(mapRow(eng, f.prefix).split("|")[3].trim(), f.status);
  }
  assert.doesNotMatch(read(agent(eng, "map.md")), /^lock:/m, "lock cleared");
  // Process skeleton: lanes, and steps for every live Module.
  assert.ok(d.process.lanes.length >= 2);
  for (const m of d.modules.filter((x) => !x.status.startsWith("merged"))) {
    assert.ok(d.process.steps.some((s) => s.module === m.prefix), `no step for ${m.prefix}`);
    assert.ok(m.roles.length, `no roles for ${m.prefix}`);
  }
  // Every Engagement-wide topic covered; topic OIs are Module All.
  const topics = ["access", "localisation", "hosting", "migration", "training", "support", "other"];
  for (const t of topics) {
    const g = d.general;
    assert.ok(g.requirements.some((r) => r.topic === t) || g.na.some((n) => n.topic === t) || g.oiRefs.some((o) => o.topic === t), `${t} uncovered`);
  }
  for (const o of d.general.oiRefs) assert.deepEqual(d.openItems.find((x) => x.id === o.id).modules, ["All"]);
  // Plan skeleton: 4 default phases, no weeks, all proposed, every live Module placed.
  assert.deepEqual(d.plan.phases.map((p) => p.id), ["masters", "workflow", "uat", "go-live"]);
  for (const p of d.plan.phases) {
    assert.equal(p.weekFrom, null);
    assert.equal(p.weekTo, null);
    assert.equal(p.proposed, true);
  }
  for (const m of d.modules.filter((x) => !x.status.startsWith("merged"))) {
    assert.ok(d.plan.phases.some((p) => p.modules.includes(m.prefix)) || d.plan.notPlaced.some((n) => n.modules.includes(m.prefix)), `${m.prefix} unplaced`);
  }
  // Consultant-relayed answers cite the session log Source.
  assert.ok(d.sources.some((s) => s.id === "WS-1"));
  assert.ok(existsSync(join(ent, "_agent", "sources", "WS-1.md")));
});

test("re-run: only the Module a later ingest drafted is still draft; confirmed ones are refused", () => {
  const { eng } = reviewed();
  const dir = agent(eng, "modules", "DEL-deliveries");
  mkdirSync(dir);
  writeFileSync(join(dir, "ticket.md"),
    "---\nstatus: open\nprefix: DEL\nname: Deliveries\ndraft: true\nblockedBy: []\n---\n\n# DEL — Deliveries\n\nName: Deliveries\n");
  const map = read(agent(eng, "map.md")).replace("| QUO | Quotations | open |", "| QUO | Quotations | open |\n| DEL | Deliveries | draft |");
  writeFileSync(agent(eng, "map.md"), map);
  const list = run("module", "list", eng).out.trim().split("\n");
  assert.deepEqual(list.filter((l) => / \| draft( |$)/.test(l)).map((l) => l.split(" ")[0]), ["DEL"]);
  assert.equal(run("module", "confirm", eng, "ENQ").code, 1);
  const r = run("module", "confirm", eng, "DEL", "--blocked-by", "QUO");
  assert.equal(r.code, 0, r.out);
  assert.equal(mapRow(eng, "DEL"), "| DEL | Deliveries | open |");
  assert.equal(check(eng).code, 0);
});
