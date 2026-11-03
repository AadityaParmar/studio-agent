// Template bank reader support (Template bank slice 5): index command, `template:` / `templateModule:` fields,
// "ID gone" warning. Fixture Template bank and Engagement are made up.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { bankIndex, readTemplate, readTemplateModule, templateWarnings } from "../template-bank-match.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");
const BANK = join(fixtures, "template-bank-match", "bank");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, stdout: r.stdout, out: r.stdout + r.stderr };
};
const lines = (s) => s.trim().split("\n");

// Copy of the reviewed harbor-tiles Enterprise (Modules ENQ, QUO); returns { ent, eng }.
function engagement() {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-tbm-")), "harbor-tiles");
  cpSync(join(fixtures, "review-draft", "after-review", "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const map = (eng) => join(eng, "_agent", "map.md");
const ticket = (eng, folder) => join(eng, "_agent", "modules", folder, "ticket.md");
const read = (p) => readFileSync(p, "utf8");
const fm = (text) => parseYaml(text.match(/^---\n([\s\S]*?)\n---\n/)[1]);
const set = (...args) => run("template-bank", "set", ...args, "--bank", BANK);
const fields = (eng) => run("template-bank", "fields", eng, "--bank", BANK);

// ---- index ----

test("index: one line per entry with ID, name, aliases, business type, seenIn count", () => {
  const r = run("template-bank", "index", "--bank", BANK);
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(lines(r.stdout), [
    "index | 2 Template(s), 2 Template module(s), 1 Pattern(s)",
    "TPL-garden-club | Garden club office | business type: Members club with bookings | seen in 1 Build(s)",
    "TPL-tile-trade | Tile trading desk | business type: Small tile and stone trader | seen in 2 Build(s)",
    "TMOD-enquiry-desk | Enquiry desk | aliases: Enquiries, Leads | seen in 3 Build(s)",
    "TMOD-quotes | Quotes | aliases: Quotations, Estimates | seen in 1 Build(s)",
    "PAT-approval-by-flag | Approval by flag | seen in 2 Build(s)",
  ]);
  assert.deepEqual(bankIndex(BANK), lines(r.stdout));
});

test("index: empty or missing Template bank prints a zero header, exit 0", () => {
  const r = run("template-bank", "index", "--bank", join(tmpdir(), "no-such-template-bank"));
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(lines(r.stdout), ["index | 0 Template(s), 0 Template module(s), 0 Pattern(s)"]);
});

// ---- fields: none vs missing ----

test("fields: missing = not checked; none = checked, no match", () => {
  const { eng } = engagement();
  let r = fields(eng);
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(lines(r.stdout), ["template | not checked", "module | ENQ | not checked", "module | QUO | not checked"]);
  assert.equal(readTemplate(eng), null);

  assert.equal(set(eng, "--template", "none").code, 0);
  assert.equal(set(eng, "QUO", "--template-module", "none").code, 0);
  assert.equal(readTemplate(eng), "none");
  assert.equal(readTemplateModule(ticket(eng, "QUO-quotations")), "none");
  assert.equal(readTemplateModule(ticket(eng, "ENQ-enquiries")), null);
  r = fields(eng);
  assert.deepEqual(lines(r.stdout), ["template | none", "module | ENQ | not checked", "module | QUO | none"]);
});

// ---- set: writes ----

test("set --template: adds front matter to map.md, keeps the rest byte-identical; overwrite edits in place", () => {
  const { eng } = engagement();
  const before = read(map(eng));
  const r = set(eng, "--template", "TPL-tile-trade");
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /template \| TPL-tile-trade/);
  const after = read(map(eng));
  assert.equal(after, `---\ntemplate: TPL-tile-trade\n---\n\n${before}`);
  assert.deepEqual(fm(after), { template: "TPL-tile-trade" });

  assert.equal(set(eng, "--template", "TPL-garden-club").code, 0);
  assert.equal(read(map(eng)), `---\ntemplate: TPL-garden-club\n---\n\n${before}`);
  assert.equal(readTemplate(eng), "TPL-garden-club");
});

test("set --template-module: one key in the ticket front matter, other keys and body untouched", () => {
  const { eng } = engagement();
  const p = ticket(eng, "QUO-quotations");
  const before = read(p);
  const r = set(eng, "QUO", "--template-module", "TMOD-quotes");
  assert.equal(r.code, 0, r.out);
  const after = read(p);
  assert.equal(after, before.replace("claimedBy:\n---", "claimedBy:\ntemplateModule: TMOD-quotes\n---"));
  assert.equal(fm(after).templateModule, "TMOD-quotes");
  assert.deepEqual(fm(after).blockedBy, ["ENQ"]);

  assert.equal(set(eng, "QUO", "--template-module", "none").code, 0);
  assert.equal(read(p), before.replace("claimedBy:\n---", "claimedBy:\ntemplateModule: none\n---"));
  assert.deepEqual(lines(fields(eng).stdout).slice(1), ["module | ENQ | not checked", "module | QUO | none"]);
});

test("set: refuses unknown or wrong-kind IDs and bad arguments; writes nothing", () => {
  const { eng } = engagement();
  const m0 = read(map(eng));
  const t0 = read(ticket(eng, "QUO-quotations"));
  // Gone ID: refused, with the replacement suggested.
  let r = set(eng, "QUO", "--template-module", "TMOD-quote-desk");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /TMOD-quote-desk.*not in the Template bank.*TMOD-quotes/);
  r = set(eng, "QUO", "--template-module", "TMOD-nothing-like-it");
  assert.equal(r.code, 1, r.out);
  // Wrong kind for the field.
  assert.equal(set(eng, "QUO", "--template-module", "TPL-tile-trade").code, 2);
  assert.equal(set(eng, "--template", "TMOD-quotes").code, 2);
  // No such Module; both or neither flag.
  assert.equal(set(eng, "XYZ", "--template-module", "TMOD-quotes").code, 1);
  assert.equal(set(eng, "QUO", "--template", "TPL-tile-trade").code, 2);
  assert.equal(set(eng).code, 2);
  assert.equal(run("template-bank", "set", join(tmpdir(), "nowhere"), "--template", "none").code, 2);
  assert.equal(read(map(eng)), m0);
  assert.equal(read(ticket(eng, "QUO-quotations")), t0);
});

// ---- "ID gone" warning ----

test("ID gone: warning (never error) with replacement IDs from the CHANGELOG, chains followed", () => {
  const { eng } = engagement();
  // Simulate a later refine: IDs written when they existed, then merged / split / retired / renamed.
  writeFileSync(map(eng), `---\ntemplate: TPL-tile-shop\n---\n\n${read(map(eng))}`);
  const put = (folder, id) => {
    const p = ticket(eng, folder);
    writeFileSync(p, read(p).replace("claimedBy:\n---", `claimedBy:\ntemplateModule: ${id}\n---`));
  };
  put("ENQ-enquiries", "TMOD-sales-desk");
  put("QUO-quotations", "TMOD-showroom");

  const w = templateWarnings(eng, BANK);
  assert.deepEqual(w.map((x) => [x.where, x.id, x.suggest]), [
    ["template", "TPL-tile-shop", ["TPL-tile-trade"]],
    ["ENQ", "TMOD-sales-desk", ["TMOD-enquiry-desk", "TMOD-quotes"]], // split, one half later merged
    ["QUO", "TMOD-showroom", []], // retired: nothing to suggest
  ]);
  assert.ok(w.every((x) => x.level === "warning"));

  const r = fields(eng);
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(lines(r.stdout), [
    "template | TPL-tile-shop",
    "module | ENQ | TMOD-sales-desk",
    "module | QUO | TMOD-showroom",
    "warning | template | TPL-tile-shop is not in the Template bank; maybe TPL-tile-trade; review-draft re-matches",
    "warning | ENQ | TMOD-sales-desk is not in the Template bank; maybe TMOD-enquiry-desk, TMOD-quotes; next resolve-module re-matches",
    "warning | QUO | TMOD-showroom is not in the Template bank; no replacement; next resolve-module re-matches",
  ]);
});

test("ID gone: status shows the warning; build-brd check still passes", () => {
  const { eng } = engagement();
  const before = run("status", eng, "--bank", BANK).stdout;
  const p = ticket(eng, "QUO-quotations");
  writeFileSync(p, read(p).replace("claimedBy:\n---", "claimedBy:\ntemplateModule: TMOD-quote-desk\n---"));
  const s = run("status", eng, "--bank", BANK);
  assert.equal(s.code, 0, s.out);
  const added = lines(s.stdout).filter((l) => !lines(before).includes(l));
  assert.deepEqual(added, [
    "template | warning | QUO | TMOD-quote-desk is not in the Template bank; maybe TMOD-quotes; next resolve-module re-matches",
  ]);
  const b = run("build-brd", eng, "--check");
  assert.equal(b.code, 0, b.out);
});

test("valid IDs: no warning, status output unchanged", () => {
  const { eng } = engagement();
  const before = run("status", eng, "--bank", BANK).stdout;
  assert.equal(set(eng, "--template", "TPL-tile-trade").code, 0);
  assert.equal(set(eng, "ENQ", "--template-module", "TMOD-enquiry-desk").code, 0);
  assert.equal(set(eng, "QUO", "--template-module", "none").code, 0);
  assert.deepEqual(templateWarnings(eng, BANK), []);
  assert.equal(run("status", eng, "--bank", BANK).stdout, before);
});

// ---- other engine commands live with the fields ----

test("map.md front matter: lock / unlock, build-brd, module rename keep working; IDs stay out of BRD data", () => {
  const { eng } = engagement();
  assert.equal(set(eng, "--template", "TPL-tile-trade").code, 0);
  assert.equal(set(eng, "QUO", "--template-module", "TMOD-quotes").code, 0);

  assert.equal(run("lock", eng, "--who", "asha", "--skill", "review-draft").code, 0);
  const locked = read(map(eng));
  assert.ok(locked.startsWith("---\ntemplate: TPL-tile-trade\n---\n"), locked.slice(0, 80));
  assert.match(locked, /^# Map: Sales CRM\n\nlock: asha · review-draft · /m);
  assert.equal(readTemplate(eng), "TPL-tile-trade");
  assert.equal(run("unlock", eng, "--who", "asha").code, 0);
  assert.doesNotMatch(read(map(eng)), /^lock:/m);
  assert.equal(readTemplate(eng), "TPL-tile-trade");

  const r = run("module", "rename", eng, "QUO", "--to", "EST", "--name", "Estimates");
  assert.equal(r.code, 0, r.out);
  assert.equal(readTemplateModule(ticket(eng, "EST-estimates")), "TMOD-quotes");

  const b = spawnSync(process.execPath, [cli, "build-brd", eng], { encoding: "utf8" });
  assert.equal(b.status, 0, b.stdout + b.stderr);
  const data = read(join(eng, "_agent", "brd", "brd-data.json"));
  assert.equal(JSON.parse(data).engagement.title, "Sales CRM");
  assert.doesNotMatch(data, /TPL-|TMOD-|PAT-/);
  const page = join(eng, "brd", "preview.html");
  if (existsSync(page)) assert.doesNotMatch(read(page), /TPL-|TMOD-|PAT-/);
});
