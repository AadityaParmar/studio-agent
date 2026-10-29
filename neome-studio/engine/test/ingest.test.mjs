// ingest helpers (ticket 28): init-engagement, add-source, lock, unlock.
// Plus the hand-run sample: a first ingest's output must pass the preview build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "ingest");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr, stdout: r.stdout };
};

// A fresh Enterprise folder with Inputs dropped (no _agent/ yet).
function dropped(files = {}) {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-ingest-")), "harbor-tiles");
  mkdirSync(join(ent, "inputs"), { recursive: true });
  mkdirSync(join(ent, "confidential"), { recursive: true });
  for (const [rel, text] of Object.entries(files)) writeFileSync(join(ent, rel), text);
  return ent;
}

const init = (ent, slug = "crm", ...extra) =>
  run("init-engagement", ent, slug, "--name", "Harbor Tiles", "--title", "Sales CRM", ...extra);
const read = (...p) => readFileSync(join(...p), "utf8");
const registerRows = (ent) => read(ent, "_agent", "sources.md").split("\n").filter((l) => /^\| [A-Z]{2,4}-\d+ /.test(l));

function build(engagement) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement], { encoding: "utf8" });
  const out = join(engagement, "_agent", "brd", "brd-data.json");
  return { code: r.status, out: r.stdout + r.stderr, data: existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null };
}

// ---- init-engagement ----

test("init-engagement creates the Enterprise and Engagement agent files", () => {
  const ent = dropped();
  const r = init(ent);
  assert.equal(r.code, 0, r.out);
  for (const p of [
    "_agent/GLOSSARY.md", "_agent/sources.md", "_agent/sources",
    "engagements/crm/_agent/map.md", "engagements/crm/_agent/process.md", "engagements/crm/_agent/open-items.md",
    "engagements/crm/_agent/general.md", "engagements/crm/_agent/modules",
  ]) assert.ok(existsSync(join(ent, p)), `${p} missing`);
  assert.match(read(ent, "_agent", "GLOSSARY.md"), /^# Harbor Tiles\n/);
  assert.match(read(ent, "_agent", "sources.md"), /\| ID \| type \| title \| date \| file \| engagement\(s\) \| notes \|/);
  assert.match(read(ent, "engagements", "crm", "_agent", "map.md"), /^# Map: Sales CRM\n[\s\S]*## Modules\n\n\| Prefix \| Module \| Status \|/);
  assert.match(read(ent, "engagements", "crm", "_agent", "open-items.md"), /\| ID \| question \| Module\(s\) \| owner \| ask to \| suggested \| status \| asked in \| answer Source \|/);
  const general = read(ent, "engagements", "crm", "_agent", "general.md");
  const topics = [...general.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(topics, ["Access", "Localisation", "Hosting", "Migration", "Training", "Support", "Other"]);
});

test("a fresh Engagement passes the preview build", () => {
  const ent = dropped();
  init(ent);
  const r = build(join(ent, "engagements", "crm"));
  assert.equal(r.code, 0, r.out);
  assert.equal(r.data.enterprise.name, "Harbor Tiles");
  assert.equal(r.data.engagement.title, "Sales CRM");
  assert.deepEqual(r.data.modules, []);
});

test("init-engagement never overwrites; a second Engagement reuses the Enterprise files", () => {
  const ent = dropped();
  init(ent);
  writeFileSync(join(ent, "_agent", "GLOSSARY.md"), "# Harbor Tiles\n\nkept\n");
  const again = init(ent);
  assert.equal(again.code, 0, again.out);
  assert.match(read(ent, "_agent", "GLOSSARY.md"), /kept/);
  const second = run("init-engagement", ent, "warehouse", "--title", "Warehouse");
  assert.equal(second.code, 0, second.out);
  assert.match(read(ent, "_agent", "GLOSSARY.md"), /kept/);
  assert.ok(existsSync(join(ent, "engagements", "warehouse", "_agent", "map.md")));
});

test("init-engagement refuses bad slugs and missing names", () => {
  const ent = dropped();
  assert.equal(init(ent, "Sales CRM").code, 2);
  assert.equal(run("init-engagement", ent, "crm", "--title", "Sales CRM").code, 2, "new Enterprise needs --name");
  assert.equal(run("init-engagement", ent, "crm", "--name", "Harbor Tiles").code, 2, "new Engagement needs --title");
  assert.equal(existsSync(join(ent, "_agent")), false, "nothing written on bad args");
  const bad = join(dirname(ent), "Harbor Tiles");
  mkdirSync(bad);
  assert.equal(init(bad).code, 2, "Enterprise folder must be kebab-case");
});

test("build-brd --check validates without writing anything or needing mmdc", () => {
  const ent = dropped();
  init(ent);
  const eng = join(ent, "engagements", "crm");
  const env = { ...process.env, NEOME_MMDC: join(tmpdir(), "no-such-dir", "mmdc") };
  const ok = spawnSync(process.execPath, [cli, "build-brd", eng, "--check"], { encoding: "utf8", env });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.match(ok.stdout, /check passed/);
  assert.equal(existsSync(join(eng, "_agent", "brd")), false);
  assert.equal(existsSync(join(eng, "brd")), false);
  const oi = join(eng, "_agent", "open-items.md");
  writeFileSync(oi, read(oi) + "| OI-01 | Who approves? | QUO | Enterprise | | | open | | |\n");
  const bad = spawnSync(process.execPath, [cli, "build-brd", eng, "--check"], { encoding: "utf8", env });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /error \[unknown-module\]/);
  // --check is a dry run in every mode (ticket 37): same errors, still nothing written.
  assert.equal(spawnSync(process.execPath, [cli, "build-brd", eng, "--check", "--mode", "release", "--summary", "x"], { env }).status, 1);
  assert.equal(existsSync(join(eng, "_agent", "brd")), false);
});

// ---- add-source ----

const add = (ent, file, prefix, title, ...extra) =>
  run("add-source", ent, file, "--prefix", prefix, "--type", "call notes", "--title", title, "--engagement", "crm", ...extra);

test("add-source gives a stable ID, renames in place, registers and keeps a text copy", () => {
  const ent = dropped({ "inputs/Kickoff notes FINAL (2).md": "Sales head: we lose Leads.\n", "inputs/second call.txt": "More notes.\n" });
  init(ent);
  const r = add(ent, join(ent, "inputs", "Kickoff notes FINAL (2).md"), "CE", "Kick-off call with sales head", "--date", "2026-10-01");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^id: CE-1$/m);
  assert.match(r.stdout, /^file: inputs\/CE-1-kick-off-call-with-sales-head\.md$/m);
  assert.match(r.stdout, /^text: _agent\/sources\/CE-1\.md \(written\)$/m);
  assert.deepEqual(readdirSync(join(ent, "inputs")).sort(), ["CE-1-kick-off-call-with-sales-head.md", "second call.txt"]);
  assert.deepEqual(registerRows(ent), ["| CE-1 | call notes | Kick-off call with sales head | 2026-10-01 | inputs/CE-1-kick-off-call-with-sales-head.md | crm |  |"]);
  const copy = read(ent, "_agent", "sources", "CE-1.md");
  assert.match(copy, /^# CE-1 — Kick-off call with sales head/);
  assert.match(copy, /Sales head: we lose Leads\./);

  const r2 = add(ent, join(ent, "inputs", "second call.txt"), "CE", "Second call", "--slug", "second-call");
  assert.equal(r2.code, 0, r2.out);
  assert.match(r2.stdout, /^id: CE-2$/m);
  assert.ok(existsSync(join(ent, "inputs", "CE-2-second-call.txt")));
});

test("IDs are unique across the Enterprise, numbered per prefix", () => {
  const ent = dropped({ "inputs/a.md": "a", "inputs/b.md": "b", "inputs/c.md": "c" });
  init(ent);
  add(ent, join(ent, "inputs", "a.md"), "CE", "A");
  run("init-engagement", ent, "warehouse", "--title", "Warehouse");
  const b = run("add-source", ent, join(ent, "inputs", "b.md"), "--prefix", "CE", "--type", "email", "--title", "B", "--engagement", "warehouse");
  assert.match(b.stdout, /^id: CE-2$/m, b.out);
  const c = add(ent, join(ent, "inputs", "c.md"), "RFP", "C");
  assert.match(c.stdout, /^id: RFP-1$/m, c.out);
  assert.deepEqual(registerRows(ent).map((l) => l.split("|")[1].trim()), ["CE-1", "CE-2", "RFP-1"]);
});

test("a confidential Source gets a register row pointing at confidential/ and a text copy", () => {
  const ent = dropped({ "confidential/prices.csv": "tile,price\nA,10\n" });
  init(ent);
  const r = add(ent, join(ent, "confidential", "prices.csv"), "PL", "2026 price list");
  assert.equal(r.code, 0, r.out);
  assert.ok(existsSync(join(ent, "confidential", "PL-1-2026-price-list.csv")));
  const [row] = registerRows(ent);
  assert.match(row, /\| confidential\/PL-1-2026-price-list\.csv \| crm \| confidential \|$/);
  assert.match(read(ent, "_agent", "sources", "PL-1.md"), /tile,price/);
  const b = build(join(ent, "engagements", "crm"));
  assert.equal(b.code, 0, b.out);
  assert.equal(b.data.sources[0].confidential, true);
});

test("a binary Input is registered; its text copy is left for the agent", () => {
  const ent = dropped({ "inputs/Deck v3.PDF": "%PDF-1.4" });
  init(ent);
  const r = add(ent, join(ent, "inputs", "Deck v3.PDF"), "DK", "Company deck");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^file: inputs\/DK-1-company-deck\.pdf$/m);
  assert.match(r.stdout, /^text: _agent\/sources\/DK-1\.md \(needed\)$/m);
  assert.equal(existsSync(join(ent, "_agent", "sources", "DK-1.md")), false);
});

test("re-adding a registered Input for another Engagement lists both Engagements", () => {
  const ent = dropped({ "inputs/a.md": "a" });
  init(ent);
  add(ent, join(ent, "inputs", "a.md"), "CE", "A");
  run("init-engagement", ent, "warehouse", "--title", "Warehouse");
  const r = run("add-source", ent, join(ent, "inputs", "CE-1-a.md"), "--engagement", "warehouse");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^id: CE-1$/m);
  assert.match(r.stdout, /already registered/);
  assert.deepEqual(registerRows(ent), ["| CE-1 | call notes | A |  | inputs/CE-1-a.md | crm, warehouse |  |"]);
  assert.equal(run("add-source", ent, join(ent, "inputs", "CE-1-a.md"), "--engagement", "warehouse").code, 0, "idempotent");
  assert.equal(registerRows(ent)[0].match(/warehouse/g).length, 1);
});

test("add-source refuses bad input", () => {
  const ent = dropped({ "inputs/a.md": "a", "elsewhere.md": "x" });
  init(ent);
  assert.equal(add(ent, join(ent, "inputs", "a.md"), "ce", "A").code, 2, "prefix must be 2–4 capitals");
  assert.equal(add(ent, join(ent, "inputs", "a.md"), "OI", "A").code, 2, "OI is not a Source prefix");
  assert.equal(add(ent, join(ent, "elsewhere.md"), "CE", "A").code, 2, "file must sit in inputs/ or confidential/");
  assert.equal(add(ent, join(ent, "inputs", "missing.md"), "CE", "A").code, 2);
  assert.equal(add(ent, join(ent, "inputs", "a.md"), "CE", "A", "--date", "1 Oct").code, 2);
  assert.equal(run("add-source", ent, join(ent, "inputs", "a.md"), "--prefix", "CE", "--type", "x", "--title", "A").code, 2, "needs --engagement");
  assert.deepEqual(registerRows(ent), []);
  assert.ok(existsSync(join(ent, "inputs", "a.md")), "not renamed");
});

// ---- lock / unlock ----

const map = (ent) => read(ent, "engagements", "crm", "_agent", "map.md");

test("lock writes who, skill, since under the map title; unlock clears it", () => {
  const ent = dropped();
  init(ent);
  const eng = join(ent, "engagements", "crm");
  const r = run("lock", eng, "--who", "Asha", "--skill", "ingest");
  assert.equal(r.code, 0, r.out);
  assert.match(map(ent), /^# Map: Sales CRM\n\nlock: Asha · ingest · \d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\n\n## Destination/);
  assert.equal(build(eng).code, 0, "lock line does not break the build");
  assert.equal(run("lock", eng, "--who", "Asha", "--skill", "ingest").code, 0, "same holder: no-op");
  assert.equal(map(ent).match(/^lock:/gm).length, 1);
  const u = run("unlock", eng, "--who", "Asha");
  assert.equal(u.code, 0, u.out);
  assert.doesNotMatch(map(ent), /lock:/);
  assert.match(map(ent), /^# Map: Sales CRM\n\n## Destination/);
  assert.equal(run("unlock", eng, "--who", "Asha").code, 0, "no lock: fine");
});

test("lock held by someone else is refused; unlock needs --force for another holder", () => {
  const ent = dropped();
  init(ent);
  const eng = join(ent, "engagements", "crm");
  run("lock", eng, "--who", "Asha", "--skill", "review-draft");
  const r = run("lock", eng, "--who", "Ravi", "--skill", "ingest");
  assert.equal(r.code, 1);
  assert.match(r.out, /locked by Asha \(review-draft, since \d{4}-/);
  assert.equal(run("unlock", eng, "--who", "Ravi").code, 1);
  assert.match(map(ent), /lock: Asha/);
  assert.equal(run("unlock", eng, "--who", "Ravi", "--force").code, 0);
  assert.doesNotMatch(map(ent), /lock:/);
  assert.equal(run("lock", join(ent, "engagements", "nope"), "--who", "A", "--skill", "ingest").code, 2);
});

// ---- sample first run (hand-run of the ingest skill, kept as a fixture) ----

test("sample first ingest output passes the preview build with no errors", () => {
  const root = join(mkdtempSync(join(tmpdir(), "neome-ingest-")), "harbor-tiles");
  cpSync(join(fixtures, "first-run", "harbor-tiles"), root, { recursive: true });
  const r = build(join(root, "engagements", "crm"));
  assert.equal(r.code, 0, r.out);
  assert.doesNotMatch(r.out, /^error/m);
  const d = r.data;
  assert.ok(d.modules.length >= 2);
  for (const m of d.modules) assert.equal(m.status, "open");
  assert.ok(d.general.requirements.length >= 1, "GEN Requirements drafted");
  assert.ok(d.openItems.length >= 1, "gaps became Open Items");
  assert.ok(d.glossary.length >= 1 && d.glossary.every((t) => t.proposed && t.sources.length), "glossary cited + proposed");
  assert.ok(d.sources.some((s) => s.confidential), "confidential Source registered");
  for (const id of d.sources.map((s) => s.id)) assert.ok(existsSync(join(root, "_agent", "sources", `${id}.md`)), `text copy ${id}`);
});
