// Across all Modules (general.md) and Implementation plan (plan.md), ticket 25.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "brd");

// Copies a fixture Enterprise to a temp folder and applies edits (paths from the Engagement _agent/).
function enterprise(name, edits = {}) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-gen-")), "harbor-tiles");
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
  return { engagement: join(root, "engagements", "crm"), agent };
}

function build(engagement) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement], { encoding: "utf8" });
  const out = join(engagement, "_agent", "brd", "brd-data.json");
  const page = join(engagement, "brd", "preview.html");
  return {
    code: r.status,
    out: r.stdout + r.stderr,
    stderr: r.stderr,
    data: existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null,
    html: existsSync(page) ? readFileSync(page, "utf8") : null,
  };
}

const screenOf = (html) => html.slice(html.indexOf('<div id="screen">'), html.indexOf('<div id="print">'));
const printOf = (html) => html.slice(html.indexOf('<div id="print">'), html.indexOf("<script>"));
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const between = (html, from, to) => html.slice(html.indexOf(from), html.indexOf(to, html.indexOf(from)));

const resolved = build(enterprise("resolved").engagement);
const inProgress = build(enterprise("in-progress").engagement);

// ---- general: data ----

test("general.md: GEN Requirements with topic, N/A topics with Source, OI refs", () => {
  assert.equal(resolved.code, 0, resolved.out);
  assert.doesNotMatch(resolved.out, /^(warning|error)/m);
  const g = resolved.data.general;
  assert.deepEqual(g.requirements.map((r) => [r.id, r.topic, r.priority, r.scope, r.proposed]), [
    ["GEN-01", "access", "Must", "neome", false],
    ["GEN-02", "migration", "Should", "neome", true],
  ]);
  const gen1 = g.requirements[0];
  assert.equal(gen1.title, "Roles and permissions");
  assert.equal(gen1.acceptance.length, 2);
  assert.deepEqual(gen1.sources, ["CE-1"]);
  assert.deepEqual(g.na, [
    { topic: "localisation", reason: "One currency (AED) and English only.", sources: ["CE-1"] },
    { topic: "hosting", reason: "Neome cloud; no on-premise or SSO ask.", sources: ["CE-1"] },
    { topic: "training", reason: "The sales head trains the team in-house.", sources: ["QA-1"] },
    { topic: "support", reason: "Standard Neome support only.", sources: ["QA-1"] },
  ]);
  assert.deepEqual(g.oiRefs, [{ id: "OI-03", topic: "other" }]);
  assert.equal(resolved.data.modules.some((m) => m.prefix === "GEN"), false, "GEN is not a Module");
});

test("no general.md: empty general, build still works", () => {
  assert.equal(inProgress.code, 0, inProgress.out);
  assert.deepEqual(inProgress.data.general, { requirements: [], na: [], oiRefs: [] });
  assert.equal("plan" in inProgress.data, false);
});

// ---- plan: data ----

test("plan.md: ordered phases with nullable weeks + Not yet placed", () => {
  const p = resolved.data.plan;
  assert.deepEqual(p.phases.map((x) => [x.id, x.weekFrom, x.weekTo, x.modules, x.proposed]), [
    ["masters", 1, 2, ["LEAD", "GEN"], false],
    ["workflow", 2, 3, ["QUO"], false],
    ["uat", 4, 4, ["LEAD", "QUO"], true],
    ["go-live", null, null, ["GEN"], true],
  ]);
  assert.equal(p.phases[0].name, "Masters and core set-up");
  assert.equal(p.phases[0].covers, "Users, roles, Lead and Quote set-up");
  assert.deepEqual(p.phases[0].sources, ["CE-1"]);
  assert.deepEqual(p.notPlaced, [
    { text: "Price list sync with Tally", ois: ["OI-03"], modules: ["QUO"], sources: [], proposed: true },
  ]);
  assert.equal(JSON.stringify(p).match(/total/i), null, "total weeks is derived, never stored");
});

// ---- broken references and bad input ----

const bad = [
  ["plan phase names unknown Module", { "plan.md": [["| QUO | CE-1 |", "| INV | CE-1 |"]] }, /error \[unknown-module\] plan phase workflow names unknown Module "INV"/],
  ["plan Not yet placed names unknown Module", { "plan.md": [["| OI-03 | QUO |", "| OI-03 | INV |"]] }, /error \[unknown-module\] plan Not yet placed "Price list sync with Tally" names unknown Module "INV"/],
  ["plan Not yet placed refers to unknown OI", { "plan.md": [["| OI-03 | QUO |", "| OI-09 | QUO |"]] }, /error \[missing-oi\] plan Not yet placed "Price list sync with Tally" refers to OI-09, which is not in open-items\.md/],
  ["plan weekFrom after weekTo", { "plan.md": [["| 2 | 3 |", "| 3 | 2 |"]] }, /error \[plan-weeks\] plan phase workflow: week from \(3\) is after week to \(2\)/],
  ["plan week not a whole number", { "plan.md": [["| 4 | 4 |", "| 4 | four |"]] }, /error \[parse\] plan\.md: phase uat: week to "four" must be a whole number or empty/],
  ["plan phase ID twice", { "plan.md": [["| uat |", "| workflow |"]] }, /error \[duplicate-phase\] plan phase ID workflow is used twice/],
  ["plan Source missing from register", { "plan.md": [["| LEAD, GEN | CE-1 |", "| LEAD, GEN | XX-9 |"]] }, /error \[missing-source\] Source XX-9 is cited but not in the Source register \(cited in plan\)/],
  ["GEN Requirement refers to unknown OI", { "general.md": [["OIs: —\nProposed: no", "OIs: OI-09\nProposed: no"]] }, /error \[missing-oi\] GEN-01 refers to OI-09, which is not in open-items\.md/],
  ["GEN Requirement ID twice", { "general.md": [["### GEN-02", "### GEN-01"]] }, /error \[requirement-id\] Requirement ID GEN-01 is used twice/],
  ["GEN Requirement with a Module prefix", { "general.md": [["### GEN-02", "### LEAD-09"]] }, /error \[schema\] general\.requirements\[LEAD-09\]\.id: "LEAD-09" has the wrong format/],
  ["N/A topic without a Source", { "general.md": [["in-house. [QA-1]", "in-house."]] }, /error \[uncited\] general\.na\[training\]: N\/A needs at least 1 Source/],
  ["unknown topic heading", { "general.md": [["## Other", "## Payroll"]] }, /error \[parse\] general\.md: "Payroll" is not a topic \(access, localisation, hosting, migration, training, support, other\)/],
  ["topic with N/A and Requirements", { "general.md": [["## Migration\n", "## Migration\n\nN/A: nothing to move. [CE-1]\n"]] }, /error \[parse\] general\.md: topic "migration" says N\/A but also has Requirements/],
  ["general OI ref missing", { "general.md": [["- OI-03:", "- OI-07:"]] }, /error \[missing-oi\] Across all Modules \(other\) refers to OI-07, which is not in open-items\.md/],
  ["general OI ref not Module All", { "general.md": [["- OI-03:", "- OI-01:"]] }, /error \[oi-module\] Across all Modules \(other\) lists OI-01, but its Module\(s\) are QUO, not All/],
  ["GEN Requirement cites unknown Source", { "general.md": [["Sources: CE-1\nOIs: —\nProposed: yes", "Sources: ZZ-1\nOIs: —\nProposed: yes"]] }, /error \[missing-source\] Source ZZ-1 is cited but not in the Source register \(cited in general\)/],
];

for (const [name, edits, message] of bad) {
  test(`bad input: ${name}`, () => {
    const r = build(enterprise("resolved", edits).engagement);
    assert.equal(r.code, 1, r.out);
    assert.match(r.stderr, message);
    assert.equal(r.data, null);
  });
}

test("plan phase with weekFrom equal to weekTo and one-sided weeks are fine", () => {
  const r = build(enterprise("resolved", { "plan.md": [["| Go-live and training | | |", "| Go-live and training | 5 | |"]] }).engagement);
  assert.equal(r.code, 0, r.out);
  assert.deepEqual([r.data.plan.phases[3].weekFrom, r.data.plan.phases[3].weekTo], [5, null]);
});

test("GEN Requirement without acceptance warns in preview", () => {
  const r = build(enterprise("resolved", {
    "general.md": [["Acceptance:\n- Every open Lead in the spreadsheet shows in Neome with its owner.\n", ""]],
  }).engagement);
  assert.equal(r.code, 0, r.out);
  assert.match(r.stderr, /warning \[completeness\] Across all Modules: GEN-02 has no acceptance criteria/);
});

// ---- page: Across all Modules ----

test("Across all Modules sits after the last Module, then Implementation plan, then Register (screen + print)", () => {
  const screen = [...screenOf(resolved.html).matchAll(/<section class="view" id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(screen, ["summary", "process", "mod-LEAD", "mod-QUO", "general", "plan", "open-items", "glossary", "sources", "versions"]);
  const print = [...printOf(resolved.html).matchAll(/<section class="psec[^"]*" id="p-([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(print, ["cover", "how-to-read", "fit", "process", "mod-LEAD", "mod-QUO", "general", "plan", "open-items", "glossary", "sources", "versions"]);
});

test("Across all Modules: grouped by topic in fixed order, cards + filters, N/A with Source, topic OIs, no mapping", () => {
  const view = between(screenOf(resolved.html), 'id="general"', 'id="plan"');
  const text = strip(view);
  const order = ["Access", "Localisation", "Hosting", "Migration", "Training", "Support", "Other"].map((t) => text.indexOf(`${t} ·`));
  assert.ok(order.every((i) => i > 0), `topics missing: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "topics out of order");
  assert.match(view, /<div class="req" id="GEN-01" data-priority="Must" data-open-scope="no" data-has-oi="no">/);
  assert.match(view, /data-filter="all" class="on">All<.*data-filter="has-oi">Has Open Item</s);
  assert.match(text, /Not applicable: One currency \(AED\) and English only\. CE-1/);
  assert.match(view, /<a class="oi" href="#OI-03">OI-03<\/a> Who owns the price list in Tally\?/);
  assert.doesNotMatch(view, /mapcard|Delivery · indicative|class="chip (std|cfg|cus)"/);
  assert.match(text, /not mapped to a Neome App/i);
});

test("Across all Modules: not in the fit table; GEN Requirements counted in summary totals", () => {
  const summary = strip(screenOf(resolved.html).split('id="process"')[0]);
  const fit = summary.split("How Neome delivers each Module")[1];
  assert.doesNotMatch(fit, /GEN|Across all Modules/);
  // LEAD-01, LEAD-02, QUO-01, QUO-02 + GEN-01, GEN-02
  assert.match(summary, /6 Requirements in 2 Modules and across all/);
  assert.match(summary, /4 Proposed Must/);
  assert.match(summary, /6 Neome 0 Neome, TBC/);
});

test("Across all Modules: in-progress Engagement with no general.md shows the section with nothing yet", () => {
  const view = strip(between(screenOf(inProgress.html), 'id="general"', 'id="open-items"'));
  assert.match(view, /Across all Modules/);
  assert.match(view, /Not covered yet/);
});

test("Open Items register: GEN Requirement OIs show as affected", () => {
  const r = build(enterprise("resolved", { "general.md": [["OIs: —\nProposed: no", "OIs: OI-03\nProposed: no"]] }).engagement);
  assert.equal(r.code, 0, r.out);
  assert.match(strip(between(screenOf(r.html), 'id="OI-03"', "</tr>")), /All, GEN-01/);
  assert.match(between(screenOf(r.html), 'id="general"', 'id="plan"'), /<div class="req" id="GEN-01"[^>]*data-has-oi="yes"/);
});

// ---- page: Implementation plan ----

test("Implementation plan: indicative header, phases on relative weeks, Not yet placed", () => {
  const view = between(screenOf(resolved.html), 'id="plan"', 'id="open-items"');
  const text = strip(view);
  assert.match(text, /Neomenta's estimate, indicative\. Work that depends on other parties runs on its own plan\./);
  assert.match(text, /Masters and core set-up Weeks 1–2 Users, roles, Lead and Quote set-up/);
  assert.match(text, /Week 4/);
  assert.match(text, /Weeks not set/);
  assert.match(view, /<a href="#general">GEN<\/a>/);
  assert.match(view, /<a href="#mod-LEAD">LEAD<\/a>/);
  assert.match(text, /Not yet placed/);
  assert.match(text, /Price list sync with Tally/);
  assert.match(view, /<a class="oi" href="#OI-03">OI-03<\/a>/);
  assert.match(text, /proposed, to confirm/);
});

test("Implementation plan: no pricing, no calendar dates", () => {
  for (const view of [between(screenOf(resolved.html), 'id="plan"', 'id="open-items"'), between(printOf(resolved.html), 'id="p-plan"', 'id="p-open-items"')]) {
    const text = strip(view);
    assert.doesNotMatch(text, /\d{4}-\d{2}-\d{2}/, "no ISO dates");
    assert.doesNotMatch(text, /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/, "no month names");
    assert.doesNotMatch(text, /(AED|USD|INR|\$|€|£|price:|cost|fee)/i, "no pricing");
  }
});

test("total weeks shows in the summary only when a plan exists", () => {
  const summary = strip(screenOf(resolved.html).split('id="process"')[0]);
  assert.match(summary, /4 Weeks, indicative/);
  assert.match(resolved.html, /class="metrics m5"/);
  const summary2 = strip(screenOf(inProgress.html).split('id="process"')[0]);
  assert.doesNotMatch(summary2, /Weeks, indicative/);
});

test("total weeks with no weeks set says TBC", () => {
  const e = enterprise("resolved", { "plan.md": [["| 1 | 2 |", "| | |"], ["| 2 | 3 |", "| | |"], ["| 4 | 4 |", "| | |"]] });
  const r = build(e.engagement);
  assert.equal(r.code, 0, r.out);
  assert.match(strip(screenOf(r.html).split('id="process"')[0]), /TBC Weeks, indicative/);
});

test("sidebar: Across all Modules after the last Module, Implementation plan only when plan exists", () => {
  const side = (html) => html.slice(html.indexOf("<aside>"), html.indexOf("</aside>"));
  const s = side(resolved.html);
  const at = (x) => s.indexOf(x);
  assert.ok(at('data-view="mod-QUO"') < at('data-view="general"'));
  assert.ok(at('data-view="general"') < at('data-view="plan"'));
  assert.ok(at('data-view="plan"') < at(">Register<"));
  assert.match(s, /data-view="general"><span>Across all Modules<\/span>/);
  assert.match(s, /data-view="plan"><span>Implementation plan<\/span>/);
  const s2 = side(inProgress.html);
  assert.match(s2, /data-view="general"/);
  assert.doesNotMatch(s2, /data-view="plan"/);
  assert.doesNotMatch(inProgress.html, /id="plan"|id="p-plan"/);
});

test("removing plan.md removes the plan section", () => {
  const e = enterprise("resolved");
  rmSync(join(e.agent, "plan.md"));
  const r = build(e.engagement);
  assert.equal(r.code, 0, r.out);
  assert.equal("plan" in r.data, false);
  assert.doesNotMatch(r.html, /id="plan"|data-view="plan"/);
});

test("print: Across all Modules as tables per topic; plan table", () => {
  const gen = strip(between(printOf(resolved.html), 'id="p-general"', 'id="p-plan"'));
  assert.match(gen, /Access ·.*GEN-01 Roles and permissions/);
  assert.match(gen, /ID Requirement Acceptance criteria Priority Scope Sources · OIs/);
  const plan = strip(between(printOf(resolved.html), 'id="p-plan"', 'id="p-open-items"'));
  assert.match(plan, /Phase Weeks What it covers Modules/);
  assert.match(plan, /Not yet placed/);
});
