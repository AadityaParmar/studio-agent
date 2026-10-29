// write-module-spec + neome-mapping (ticket 32): template and sample shape, catalog reference,
// the spec done check (`spec-check`), and the hand-run sample: QUO's grilling output written as a spec,
// mapped, and built as a resolved Module.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, "..", "..");
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");
const refs = join(plugin, "skills", "write-module-spec", "references");

const read = (...p) => readFileSync(join(...p), "utf8");
const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};

function copy(rel = "write-module-spec/after-spec") {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-spec-")), "harbor-tiles");
  cpSync(join(fixtures, rel, "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const agent = (eng, ...p) => join(eng, "_agent", ...p);
const quo = (eng, f = "spec.md") => agent(eng, "modules", "QUO-quotations", f);
const edit = (file, fn) => writeFileSync(file, fn(readFileSync(file, "utf8")));
const check = (eng, prefix = "QUO") => run("spec-check", eng, prefix);
const resolve = (eng) => edit(quo(eng, "ticket.md"), (t) => t.replace("status: claimed", "status: resolved"));

const TITLES = [
  "Purpose and KPIs", "Roles", "Process", "Records and data", "Statuses", "Rules and notifications",
  "Exceptions", "Reports", "Integrations", "Volumes and NFRs", "Requirements", "Neome mapping", "Open Items",
];
const h2 = (t) => [...t.matchAll(/^## (.+)$/gm)].map((m) => m[1]);

// ---- template, sample, catalog ----

test("template: 13 H2 sections in fixed order, header lines, Requirement block lines, done check", () => {
  const t = read(refs, "spec-template.md");
  const tpl = t.match(/```markdown\n([\s\S]*?)\n```/)[1];
  assert.deepEqual(h2(tpl), TITLES.map((x, i) => `${i + 1} ${x}`));
  for (const k of ["Prefix", "Name", "Status", "Sources"]) assert.match(tpl.split("\n## ")[0], new RegExp(`^${k}: `, "m"), k);
  for (const k of ["Statement", "Acceptance", "Priority", "Scope", "Sources", "OIs", "Proposed", "Delivery", "Withdrawn"]) {
    assert.match(tpl, new RegExp(`^${k}:`, "m"), k);
  }
  assert.match(tpl, /^Neome App: /m);
  assert.match(t, /N\/A: <reason>/);
  assert.match(t, /never reused/i);
  assert.match(t, /\(proposed, to confirm\)/);
  assert.match(t, /## Done check[\s\S]*spec-check/);
});

test("sample: the filled example is the hand-run QUO spec and passes the done check", () => {
  const { eng } = copy();
  assert.equal(read(refs, "spec-example.md"), read(quo(eng)));
  assert.deepEqual(h2(read(refs, "spec-example.md")), TITLES.map((x, i) => `${i + 1} ${x}`));
  const r = check(eng);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /spec-check: QUO done/);
});

test("catalog reference + slug list shipped; Delivery heuristics in it; skills point at them", () => {
  const catalog = read(plugin, "reference", "neome-app-catalog.md");
  assert.match(catalog, /^## 4\. Mapping heuristics \(Standard \/ Configuration \/ Custom module\)/m);
  assert.match(catalog, /^### 4b\. Heuristics/m);
  const slugs = JSON.parse(read(plugin, "reference", "neome-app-catalog-slugs.json")).apps;
  assert.equal(slugs.length, 30);
  const mapping = read(plugin, "skills", "neome-mapping", "SKILL.md");
  assert.match(mapping, /neome-app-catalog\.md/);
  assert.match(mapping, /neome-app-catalog-slugs\.json/);
  assert.match(mapping, /Neome App: none/);
  const write = read(plugin, "skills", "write-module-spec", "SKILL.md");
  for (const s of ["spec-template.md", "spec-example.md", "neome-mapping", "spec-check"]) assert.ok(write.includes(s), s);
});

// ---- hand-run sample ----

test("hand-run: written spec builds with no completeness gaps once the Module is resolved", () => {
  const { eng } = copy();
  resolve(eng);
  const r = spawnSync(process.execPath, [cli, "build-brd", eng, "--check"], { encoding: "utf8" });
  const out = r.stdout + r.stderr;
  assert.equal(r.status, 0, out);
  assert.doesNotMatch(out, /Module QUO/);
});

test("hand-run: data file carries the mapping, overrides and every Requirement", () => {
  const { eng } = copy();
  resolve(eng);
  const r = spawnSync(process.execPath, [cli, "build-brd", eng], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const data = JSON.parse(read(agent(eng, "brd", "brd-data.json")));
  const m = data.modules.find((x) => x.prefix === "QUO");
  assert.equal(m.status, "resolved");
  assert.deepEqual({ ...m.mapping, how: undefined }, { neomeApp: "quotation-and-order-flow", delivery: "configuration", how: undefined, indicative: true });
  assert.match(m.mapping.how, /OI-03/);
  assert.deepEqual(m.requirements.filter((x) => x.delivery).map((x) => [x.id, x.delivery]), [["QUO-01", "standard"], ["QUO-07", "standard"]]);
  assert.deepEqual(m.requirements.map((x) => x.id), ["QUO-01", "QUO-02", "QUO-03", "QUO-04", "QUO-05", "QUO-06", "QUO-07"]);
  assert.deepEqual(m.oiRefs, ["OI-03", "OI-09", "OI-10", "OI-11", "OI-12"]);
});

test("hand-run: ticket body cut to a pointer; spec header lists every cited Source", () => {
  const { eng } = copy();
  const t = read(quo(eng, "ticket.md"));
  assert.match(t, /^Spec: \[spec\.md\]\(spec\.md\)/m);
  assert.doesNotMatch(t, /^## /m);
  assert.match(read(quo(eng)), /^Prefix: QUO\nName: Quotations\nStatus: claimed\nSources: CE-1, CE-2, WS-1, WS-2$/m);
});

// ---- done check: each gap fails ----

const fails = (name, change, pattern) =>
  test(`done check fails: ${name}`, () => {
    const { eng } = copy();
    change(eng);
    const r = check(eng);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, pattern);
    assert.match(r.out, /spec-check: QUO not done/);
  });

const spec = (fn) => (eng) => edit(quo(eng), fn);

test("done check fails: no spec.md yet (grilling output only)", () => {
  const { eng } = copy("grill-module/after-grill");
  const r = check(eng);
  assert.equal(r.code, 1);
  assert.match(r.out, /error \[spec\] Module QUO: spec\.md missing/);
});

test("done check: bad arguments and unknown Module", () => {
  const { eng } = copy();
  assert.equal(run("spec-check", eng).code, 2);
  const r = check(eng, "XYZ");
  assert.equal(r.code, 1);
  assert.match(r.out, /no Module XYZ/);
});

fails("header line missing", spec((t) => t.replace(/^Status: claimed\n/m, "")), /header line "Status:" missing/);
fails("header Sources misses a cited Source", spec((t) => t.replace("Sources: CE-1, CE-2, WS-1, WS-2", "Sources: CE-1, CE-2, WS-2")), /does not list WS-1/);
fails("a section heading deleted", spec((t) => t.replace(/## 8 Reports\n\n[\s\S]*?(?=## 9 )/, "")), /section "## 8 Reports" missing/);
fails("sections out of order", spec((t) => {
  const seven = t.match(/## 7 Exceptions\n[\s\S]*?(?=## 8 )/)[0];
  return t.replace(seven, "").replace("## 10 Volumes", seven + "## 10 Volumes");
}), /not in the fixed order/);
fails("an extra H2", spec((t) => t.replace("## 13 Open Items", "## Notes\n\n- stray\n\n## 13 Open Items")), /"## Notes" is not one of the 13/);
fails("a section left empty", spec((t) => t.replace(/(## 7 Exceptions\n)[\s\S]*?(?=## 8 )/, "$1\n")), /section 7 Exceptions is empty/);
fails("N/A without a reason", spec((t) => t.replace(/(## 8 Reports\n)[\s\S]*?(?=## 9 )/, "$1\nN/A\n\n")), /N\/A needs a reason/);
fails("Requirement without acceptance", spec((t) => t.replace("Acceptance:\n- A quotation with a 9% discount cannot be sent until the sales head approves; one with 8% can. [WS-2]\n", "")), /QUO-02: "Acceptance:" needs at least 1 bullet/);
fails("Requirement without Sources line", spec((t) => t.replace("Sources: CE-2, WS-2\nOIs: OI-04\n", "OIs: OI-04\n")), /QUO-03: "Sources:" missing/);
fails("Requirement without Proposed line", spec((t) => t.replace("OIs: OI-03\nProposed: no\n", "OIs: OI-03\n")), /QUO-05: "Proposed: yes\|no" line missing/);
fails("Proposed: no on a proposed block", spec((t) => t.replace("Sources: WS-2\nOIs: OI-12\nProposed: yes\nDelivery", "Sources: WS-2\nOIs: OI-12\nProposed: no\nDelivery")), /QUO-07: says Proposed: no/);
fails("uncited fact", spec((t) => t.replace("| Quotation | Buyer | text | yes | | [CE-1] |", "| Quotation | Buyer | text | yes | | |")), /error \[uncited\]/);
fails("Requirement ID dropped since a released version", (eng) => {
  resolve(eng);
  assert.equal(spawnSync(process.execPath, [cli, "build-brd", eng, "--mode", "release", "--summary", "v1"], { encoding: "utf8" }).status, 0);
  edit(quo(eng), (t) => t.replace(/### QUO-06 — [\s\S]*?(?=### QUO-07)/, ""));
}, /QUO-06 was in v1 and is gone; keep the block and mark it Withdrawn/);
fails("withdrawn without a reason", spec((t) => t.replace("OIs: OI-12\nProposed: yes\n\n### QUO-07", "OIs: OI-12\nProposed: yes\nWithdrawn: -\n\n### QUO-07")), /QUO-06: Withdrawn needs a reason/);
fails("section 12 missing", spec((t) => t.replace(/(## 12 Neome mapping\n)[\s\S]*?(?=## 13 )/, "$1\n")), /section 12 Neome mapping is empty/);
fails("section 12 with two Deliveries", spec((t) => t.replace("Delivery: Configuration\n", "Delivery: Configuration\nDelivery: Standard\n")), /exactly one "Delivery:" line/);
fails("unknown catalog slug", spec((t) => t.replace("`quotation-and-order-flow`", "`quotes`")), /error \[unknown-app\]/);
fails("no App fits but Delivery not Custom module", spec((t) => t.replace("`quotation-and-order-flow`", "none")), /no Neome App means Delivery must be custom/);
fails("override equal to the Module Delivery", spec((t) => t.replace("Proposed: no\nDelivery: Standard\n", "Proposed: no\nDelivery: Configuration\n")), /QUO-01: Delivery override equals the Module Delivery/);
fails("section 13 misses an open Open Item", spec((t) => t.replace(/^- OI-10: .*\n(?=- OI-11)/m, "")), /section 13 misses open OI-10/);
fails("section 13 lists a closed Open Item", spec((t) => t.replace("## 13 Open Items\n\n", "## 13 Open Items\n\n- OI-01: Discount limit.\n")), /section 13 lists OI-01, which is closed/);
fails("broken reference elsewhere in the Engagement", (eng) => edit(agent(eng, "process.md"), (t) => t.replace("| sales | QUO | Make quotation |", "| nowhere | QUO | Make quotation |")), /error \[unknown-lane\]/);

test("done check: no App fits = none + Custom module passes", () => {
  const { eng } = copy();
  edit(quo(eng), (t) => t.replace("`quotation-and-order-flow`", "none").replace("Delivery: Configuration\n", "Delivery: Custom module\n"));
  const r = check(eng);
  assert.equal(r.code, 0, r.out);
  resolve(eng);
  const b = spawnSync(process.execPath, [cli, "build-brd", eng], { encoding: "utf8" });
  assert.equal(b.status, 0, b.stdout + b.stderr);
  const m = JSON.parse(read(agent(eng, "brd", "brd-data.json"))).modules.find((x) => x.prefix === "QUO");
  assert.equal(m.mapping.neomeApp, null);
  assert.equal(m.mapping.delivery, "custom");
});

test("done check: a withdrawn Requirement with its reason passes and keeps its ID", () => {
  const { eng } = copy();
  edit(quo(eng), (t) => t.replace("OIs: OI-12\nProposed: yes\n\n### QUO-07", "OIs: OI-12\nProposed: yes\nWithdrawn: Buyers never ask for changes after sending [WS-2]\n\n### QUO-07"));
  // QUO-06 no longer live: OI-12 still on QUO-04 and QUO-07, so section 13 stays as is.
  const r = check(eng);
  assert.equal(r.code, 0, r.out);
});

test("done check: in-progress Module held to resolved strictness", () => {
  const { eng } = copy();
  edit(quo(eng), (t) => t.replace(/(## 9 Integrations\n)[\s\S]*?(?=## 10 )/, "$1\n"));
  // build --check only warns (Module claimed) ...
  const b = run("build-brd", eng, "--check");
  assert.equal(b.code, 0, b.out);
  assert.match(b.out, /warning \[completeness\] Module QUO/);
  // ... the done check fails.
  const r = check(eng);
  assert.equal(r.code, 1);
  assert.match(r.out, /error \[completeness\] Module QUO \(resolved\)/);
});

test("done check writes nothing", () => {
  const { eng } = copy();
  check(eng);
  assert.equal(existsSync(agent(eng, "brd")), false);
});
