// build-prototype (ticket 33): spec.md + prototype-data.json → one offline Prototype HTML from the fixed template.
// Fixture: write-module-spec after-spec + QUO prototype-data.json written by hand following the skill.
// The done check (every Requirement in at least one tab, every transition in at least one scenario) is asserted
// on the page's embedded model and, in headless Chrome, on the screens themselves.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, "..", "..");
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};
function copy() {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-proto-")), "harbor-tiles");
  cpSync(join(fixtures, "build-prototype", "after-prototype", "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const quo = (eng, f) => join(eng, "_agent", "modules", "QUO-quotations", f);
const view = (eng) => join(eng, "prototypes", "QUO-quotations.html");
const edit = (file, fn) => writeFileSync(file, fn(readFileSync(file, "utf8")));
const editData = (eng, fn) => {
  const d = JSON.parse(readFileSync(quo(eng, "prototype-data.json"), "utf8"));
  fn(d);
  writeFileSync(quo(eng, "prototype-data.json"), JSON.stringify(d, null, 2));
};
const build = (eng, prefix = "QUO") => run("build-prototype", eng, prefix);
const modelOf = (html) => JSON.parse(html.match(/<script type="application\/json" id="proto-data">([\s\S]*?)<\/script>/)[1]);
// Fails with the data edit; nothing written.
function refused(fn, pattern) {
  const { eng } = copy();
  editData(eng, fn);
  const r = build(eng);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, pattern);
  assert.match(r.out, /Prototype not written/);
  assert.ok(!existsSync(view(eng)));
  return r;
}

// ---- happy path ----

test("fixture: builds prototypes/QUO-quotations.html from spec + prototype-data.json", () => {
  const { eng } = copy();
  const r = build(eng);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /wrote .*prototypes\/QUO-quotations\.html \(7 Requirements traced, 8 transitions in scenarios, 0 warning\(s\)\)/);
  const html = readFileSync(view(eng), "utf8");
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<title>PROTOTYPE · Harbor Tiles · QUO Quotations<\/title>/);
});

test("fixed template: the agent's data is embedded as JSON only; same input gives the same file", () => {
  const { eng } = copy();
  build(eng);
  const a = readFileSync(view(eng), "utf8");
  build(eng);
  assert.equal(readFileSync(view(eng), "utf8"), a);
  // The page = shell + template CSS + template script + data. No HTML from prototype-data.json.
  const css = readFileSync(join(plugin, "engine", "prototype", "proto.css"), "utf8");
  const js = readFileSync(join(plugin, "engine", "prototype", "proto.js"), "utf8");
  assert.ok(a.includes(css) && a.includes(js));
  const { eng: eng2 } = copy();
  editData(eng2, (d) => { d.rows[0].values.Buyer = "<b>x</b></script><script>alert(1)</script>"; });
  assert.equal(build(eng2).code, 0);
  const b = readFileSync(view(eng2), "utf8");
  assert.ok(!b.includes("</script><script>alert(1)"), "data cannot close the script tag");
  assert.equal(modelOf(b).rows[0].values.Buyer, "<b>x</b></script><script>alert(1)</script>");
});

test("offline: no external JS, CSS, fonts or requests; system font fallback; in memory only; reset", () => {
  const { eng } = copy();
  build(eng);
  const html = readFileSync(view(eng), "utf8");
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link\b/i);
  assert.doesNotMatch(html, /@import|url\(\s*['"]?https?:/i);
  assert.doesNotMatch(html, /\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|document\.cookie/);
  assert.match(html, /--font:Roboto,'Helvetica Neue',Arial,system-ui,sans-serif/);
  assert.doesNotMatch(html, /@font-face/);
  assert.match(html, /data-on", "reset"|attr\("on", "reset"\)/);
  assert.match(html, />Reset</);
});

test("header: Module, Enterprise, not-live tag; counts and indicative Neome App + Delivery only in Consultant mode", () => {
  const { eng } = copy();
  build(eng);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  assert.equal(m.enterprise, "Harbor Tiles");
  assert.equal(m.prefix, "QUO");
  assert.equal(m.name, "Quotations");
  assert.equal(m.requirements.length, 7);
  // Open OIs of the Module (section 13) + any open OI on an element.
  assert.deepEqual(Object.keys(m.ois), ["OI-03", "OI-09", "OI-10", "OI-11", "OI-12"]);
  assert.equal(m.app, "Quotation & Order Flow");
  assert.equal(m.delivery, "Configuration");
  const js = readFileSync(join(plugin, "engine", "prototype", "proto.js"), "utf8");
  for (const s of ["Prototype · not the live app", "how it will work in Neome", "All names and records are made-up examples", "our suggestion, please confirm", "Requirements · ", "Open Items · ", "indicative", "Neome App: "]) assert.ok(js.includes(s), s);
  assert.match(js, /cinfo c-only/);
});

test("App data: sheet + kanban by status, roles for the switcher, an action per transition, bot notification to the next role", () => {
  const { eng } = copy();
  build(eng);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  assert.equal(m.entity, "Quotation");
  assert.deepEqual(m.statuses.map((s) => s.id), ["draft", "waiting-approval", "sent", "accepted", "lost", "expired", "replaced"]);
  assert.deepEqual(m.roles.map((r) => `${r.person} (${r.role})`), ["Arjun (Sales exec)", "Meera (Sales head)", "Joel (Accounts)"]);
  assert.equal(m.transitions.length, 8);
  for (const t of m.transitions) assert.ok(t.action && t.by.length, t.id);
  const t = (id) => m.transitions.find((x) => x.id === id);
  assert.deepEqual(t("draft>waiting-approval").notify, ["Sales head", "Accounts"]); // as written
  assert.deepEqual(t("sent>expired").notify, ["Sales exec"]); // derived: end status → owner
  assert.deepEqual(t("draft>sent").notify, []); // derived: next actor is the one who acted → nobody
  assert.deepEqual(t("draft>sent").guard, [{ field: "Discount %", op: "<=", value: 8 }]);
  assert.deepEqual(m.others, ["Enquiries"]);
  assert.deepEqual(m.records.map((r) => r.entity), ["Quotation", "Quotation line"]);
});

test("chips: proposed fields, roles, statuses and transitions from the spec; OI chip only for open Open Items", () => {
  const { eng } = copy();
  build(eng);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  const q = m.records[0].fields;
  assert.deepEqual(q.filter((f) => f.proposed).map((f) => f.name), ["Number", "Total"]);
  assert.equal(q.find((f) => f.name === "Valid until").oi, "OI-11");
  assert.deepEqual(m.transitions.filter((t) => t.proposed).map((t) => t.id), ["waiting-approval>draft", "sent>lost"]);
  assert.equal(m.statuses.find((s) => s.id === "lost").oi, "OI-09");
  assert.equal(m.roles.find((r) => r.role === "Sales head").oi, "OI-10");
  // QUO-02 has OIs OI-01 (closed) and OI-10 (open): only the open one gets a chip.
  assert.deepEqual(m.requirements.find((r) => r.id === "QUO-02").ois, ["OI-10"]);
  const js = readFileSync(join(plugin, "engine", "prototype", "proto.js"), "utf8");
  // Proposed = dotted underline; open question = "?" (OI id only in Consultant mode); chat layout marked guessed.
  assert.match(js, /class="sug" title="Our suggestion, please confirm"/);
  assert.match(js, /class="qmark"[^]*chip oi c-only/);
  assert.match(js, /layout guessed/);
  assert.doesNotMatch(js, /chip sample/);
});

test("scenarios: guided steps with actor, action, screen and what each step proves; all proposed", () => {
  const { eng } = copy();
  build(eng);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  assert.equal(m.scenarios.length, 7);
  const s = m.scenarios[1].steps[1];
  assert.deepEqual({ actor: s.actor, screen: s.screen, transition: s.transition, status: s.status, proves: s.proves, oi: s.oi },
    { actor: "Sales head", screen: "chat", transition: "waiting-approval>sent", status: "sent", proves: ["QUO-02"], oi: "OI-10" });
  assert.deepEqual(s.notify, ["Sales exec"]);
  const js = readFileSync(join(plugin, "engine", "prototype", "proto.js"), "utf8");
  for (const s of ["What this shows", "Behind the scenes", "Who gets a message", "Does this look right?", "Question for you", "Next story ›"]) assert.ok(js.includes(s), s);
});

test("done check: every Requirement shows in at least one tab; every transition is in at least one scenario", () => {
  const { eng } = copy();
  build(eng);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  for (const r of m.requirements) {
    assert.ok(m.trace[r.id].length >= 1, `${r.id} traced`);
    for (const p of m.trace[r.id]) assert.ok(["how", "try"].includes(p.tab));
  }
  const inScenario = new Set(m.scenarios.flatMap((sc) => sc.steps.map((s) => s.transition)));
  for (const t of m.transitions) assert.ok(inScenario.has(t.id), `${t.id} in a scenario`);
  // Mobile + trace: phones for every key role (acts on or is told about a transition).
  assert.deepEqual(m.roles.filter((r) => r.key).map((r) => r.role), ["Sales exec", "Sales head", "Accounts"]);
});

// Builds after a data edit and returns the page model.
function modelAfter(fn = () => {}) {
  const { eng } = copy();
  editData(eng, fn);
  const r = build(eng);
  assert.equal(r.code, 0, r.out);
  return modelOf(readFileSync(view(eng), "utf8"));
}

test("steps: label defaults to the button name, else first 4 words; explicit label kept", () => {
  let m = modelAfter();
  assert.equal(m.scenarios[0].steps[0].label, "Send PDF");
  assert.equal(m.scenarios[2].steps[1].label, "Arjun sees Q-1040 back…");
  assert.equal(m.scenarios[6].steps[0].label, "Meera opens Quotations to…");
  m = modelAfter((d) => { d.scenarios[0].steps[0].label = "Send it"; });
  assert.equal(m.scenarios[0].steps[0].label, "Send it");
});

test("steps: label over 40 chars refused", () => {
  refused((d) => { d.scenarios[0].steps[0].label = "x".repeat(41); }, /label is 41 chars \(max 40\)/);
});

test("steps: behind and notify optional; derived when missing; notify must be roles", () => {
  let m = modelAfter();
  const submit = m.scenarios[1].steps[0];
  assert.deepEqual(submit.behind, [
    "Discount above 8% → Waits for the sales head; sales head told",
    "Contractor has an invoice overdue over 60 days → Waits for accounts OK",
  ]);
  assert.deepEqual(submit.notify, ["Sales head", "Accounts"]);
  assert.deepEqual(m.scenarios[2].steps[1].behind, []);
  assert.deepEqual(m.scenarios[2].steps[1].notify, []);
  m = modelAfter((d) => { d.scenarios[2].steps[1].behind = ["A"]; d.scenarios[2].steps[1].notify = ["Accounts"]; });
  assert.deepEqual(m.scenarios[2].steps[1].behind, ["A"]);
  assert.deepEqual(m.scenarios[2].steps[1].notify, ["Accounts"]);
  refused((d) => { d.scenarios[0].steps[0].notify = ["Boss"]; }, /notify "Boss" is not a role in section 2/);
  refused((d) => { d.scenarios[0].steps[0].behind = "x"; }, /behind must be a list/);
});

test("steps: create step = first touch of a start-status row, no transition, action makes the record", () => {
  const m = modelAfter((d) => {
    d.scenarios[1].steps.unshift({ actor: "Sales exec", action: "Makes Q-1044 at 12%", row: "Q-1044", proves: [] });
    d.scenarios[1].steps.push({ actor: "Sales exec", action: "Looks at Q-1044 again", row: "Q-1044", proves: [] });
  });
  const [make, submit, , again] = m.scenarios[1].steps;
  assert.equal(make.create, true);
  assert.equal(make.from, null);
  assert.equal(make.status, "draft");
  assert.deepEqual(make.behind, ["Number is filled in by Neome"]);
  assert.equal(submit.create, false);
  assert.equal(submit.from, "draft");
  assert.equal(again.create, false);
  // A later look at the same row is never a create step.
  assert.equal(m.scenarios[2].steps[1].create, false);
  // Any role creates when the action says so; a look by the owner is not a create step.
  const m2 = modelAfter((d) => {
    d.scenarios[1].steps.unshift({ actor: "Accounts", action: "Raises Q-1044 for a contractor", row: "Q-1044", proves: [] });
    d.scenarios[0].steps.unshift({ actor: "Sales exec", action: "Opens Q-1046 and checks the buyer", row: "Q-1046", proves: [] });
  });
  assert.equal(m2.scenarios[1].steps[0].create, true);
  assert.equal(m2.scenarios[0].steps[0].create, false);
});

test("scenarios: kind, lanes and proposed steps", () => {
  const m = modelAfter();
  assert.deepEqual(m.scenarios.map((s) => s.kind),
    ["normal flow", "open question", "other case", "other case", "open question", "open question", "report"]);
  assert.deepEqual(m.scenarios[1].lanes, ["Sales exec", "Sales head"]);
  assert.deepEqual(m.scenarios[2].lanes, ["Sales exec", "Accounts"]);
  assert.deepEqual(m.scenarios[4].lanes, ["system"]);
  // waiting-approval → draft is "(proposed, to confirm)" in the spec.
  assert.equal(m.scenarios[2].steps[0].proposed, true);
  assert.equal(m.scenarios[1].steps[0].proposed, false);
});

test("trace: places are in How it works or Try it (phone places marked)", () => {
  const m = modelAfter();
  const all = Object.values(m.trace).flat();
  assert.ok(all.some((p) => p.tab === "how" && Number.isInteger(p.sc) && Number.isInteger(p.step)));
  assert.ok(all.some((p) => p.tab === "try" && p.phone === true && p.role));
  assert.ok(all.some((p) => p.tab === "try" && !p.phone));
});

test("done check fails: a Requirement in no tab", () => {
  refused((d) => {
    d.reports = [];
    d.roles.find((r) => r.role === "Sales head").reqs = ["QUO-02"];
    d.scenarios.at(-1).steps[0].proves = [];
  }, /error \[prototype\] done check: QUO-07 shows in no tab/);
});

test("done check fails: a transition in no scenario", () => {
  refused((d) => { d.scenarios.splice(5, 1); }, /done check: transition sent → lost is in no scenario/);
});

// ---- data checks ----

test("rows: 4–8 sample rows spread over every status", () => {
  refused((d) => { d.rows = d.rows.slice(0, 3); }, /rows: 3 sample rows; write 4–8/);
  refused((d) => { d.rows = d.rows.filter((r) => r.status !== "expired"); }, /no sample row in status expired/);
  refused((d) => { d.rows.push(...d.rows.slice(0, 2).map((r, i) => ({ ...r, id: `X-${i}` }))); }, /rows: 10 sample rows/);
  refused((d) => { d.rows[1].id = d.rows[0].id; }, /id Q-1036 used twice/);
  refused((d) => { d.rows[0].status = "won"; }, /status "won" is not in section 5/);
  refused((d) => { d.rows[0].values.Colour = "red"; }, /"Colour" is not a field of Quotation/);
  refused((d) => { d.rows[0].children["Quotation line"][0].Size = 1; }, /"Size" is not a field of Quotation line/);
});

test("references: every name in prototype-data.json must exist in the spec", () => {
  refused((d) => { d.bogus = 1; }, /unknown key "bogus"/);
  refused((d) => { d.entity = "Order"; }, /entity "Order" is not a record/);
  refused((d) => { d.fields[0].name = "Colour"; }, /no field "Colour" in Quotation/);
  refused((d) => { d.roles[0].role = "Driver"; }, /unknown role "Driver"/);
  refused((d) => { d.roles[0].reqs = ["QUO-99"]; }, /unknown Requirement QUO-99/);
  refused((d) => { d.fields[0].oi = "OI-77"; }, /unknown Open Item OI-77/);
  refused((d) => { d.transitions.pop(); }, /transition sent → replaced has no entry in prototype-data\.json transitions/);
  refused((d) => { d.transitions[0].to = "accepted"; }, /draft → accepted: no such transition/);
  refused((d) => { d.transitions[0].by = ["Driver"]; }, /by "Driver" is not a role/);
  refused((d) => { d.transitions[0].rules = ["Bonus"]; }, /unknown rule "Bonus"/);
  refused((d) => { d.transitions[3].guard[0].field = "Colour"; }, /guard field "Colour"/);
  refused((d) => { d.rules[0].rule = "Bonus"; }, /rules\[0\]: unknown rule "Bonus"/);
  refused((d) => { d.reports[0].name = "Sales"; }, /reports\[0\]: unknown report "Sales"/);
});

test("scenarios must replay: actor does the transition, row is in the from status, guards hold", () => {
  refused((d) => { d.scenarios[0].steps[0].actor = "Accounts"; }, /actor "Accounts" does not do draft → sent/);
  refused((d) => { d.scenarios[0].steps.reverse(); }, /Q-1046 is "draft" here, not "sent"/);
  refused((d) => { d.scenarios[0].steps[0].row = "Q-1044"; d.scenarios[0].steps[1].row = "Q-1044"; }, /Q-1044 fails guard Discount % <= 8/);
  refused((d) => { d.scenarios[6].steps[0].report = "Sales"; }, /screen report needs "report"/);
  refused((d) => { d.scenarios[0].steps[0].screen = "map"; }, /screen "map"/);
  refused((d) => { d.scenarios = []; }, /scenarios: write at least one/);
});

test("withdrawn Requirement or closed Open Item", () => {
  const { eng } = copy();
  edit(quo(eng, "spec.md"), (t) => t.replace("Proposed: yes\nDelivery: Standard", "Proposed: yes\nDelivery: Standard\nWithdrawn: Not needed (proposed, to confirm)"));
  let r = build(eng);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /QUO-07 is withdrawn/);
  const { eng: e2 } = copy();
  editData(e2, (d) => { d.fields[0].oi = "OI-01"; });
  r = build(e2);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warning \[prototype\] fields\[0\] Enquiry: OI-01 is closed; no OI chip shown/);
  assert.equal(modelOf(readFileSync(view(e2), "utf8")).records[0].fields.find((f) => f.name === "Enquiry").oi, null);
});

test("refuses: no spec.md, no prototype-data.json, bad JSON, merged Module, broken Engagement, bad arguments", () => {
  const { eng } = copy();
  let r = build(eng, "ENQ");
  assert.equal(r.code, 1);
  assert.match(r.out, /Module ENQ: spec\.md missing/);
  r = build(eng, "XYZ");
  assert.equal(r.code, 1);
  assert.match(r.out, /no Module XYZ/);
  rmSync(quo(eng, "prototype-data.json"));
  r = build(eng);
  assert.equal(r.code, 1);
  assert.match(r.out, /prototype-data\.json missing/);
  writeFileSync(quo(eng, "prototype-data.json"), "{ nope");
  r = build(eng);
  assert.match(r.out, /prototype-data\.json is not valid JSON/);
  const { eng: e2 } = copy();
  edit(quo(e2, "spec.md"), (t) => t.replace("OIs: OI-03\n", "OIs: OI-88\n"));
  r = build(e2);
  assert.equal(r.code, 1);
  assert.match(r.out, /error \[missing-oi\][^\n]*OI-88/);
  assert.ok(!existsSync(view(e2)));
  const { eng: e3 } = copy();
  edit(join(e3, "_agent", "modules", "ENQ-enquiries", "ticket.md"), (t) => t.replace("status: open", "status: merged-into QUO"));
  writeFileSync(join(e3, "_agent", "modules", "ENQ-enquiries", "spec.md"), readFileSync(quo(e3, "spec.md"), "utf8"));
  assert.match(build(e3, "ENQ").out, /Module ENQ is merged-into QUO; it has no Prototype/);
  assert.equal(run("build-prototype", eng).code, 2);
  assert.equal(run("build-prototype", join(eng, "nope"), "QUO").code, 2);
});

test("module rename moves the Prototype view; merge removes it", () => {
  const { eng } = copy();
  assert.equal(build(eng).code, 0);
  edit(quo(eng, "ticket.md"), (t) => t.replace("status: claimed", "status: resolved"));
  let r = run("module", "rename", eng, "QUO", "--to", "QT", "--name", "Quotes");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /prototype: prototypes\/QUO-quotations\.html → prototypes\/QT-quotes\.html; rebuild it \(build-prototype QT\)/);
  assert.ok(!existsSync(view(eng)));
  assert.ok(existsSync(join(eng, "prototypes", "QT-quotes.html")));
  assert.equal(build(eng, "QT").code, 0);
  r = run("module", "merge", eng, "QT", "--into", "ENQ");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /prototype: prototypes\/QT-quotes\.html removed/);
  assert.ok(!existsSync(join(eng, "prototypes", "QT-quotes.html")));
});

// ---- skill + reference ----

test("skill: writes data only, calls the engine; reference documents every key and the done check", () => {
  const skill = readFileSync(join(plugin, "skills", "build-prototype", "SKILL.md"), "utf8");
  assert.doesNotMatch(skill, /Stub\./);
  assert.match(skill, /ENGINE build-prototype <eng> <PREFIX>/);
  assert.match(skill, /prototype-data\.json/);
  assert.match(skill, /Runs no git/);
  const ref = readFileSync(join(plugin, "skills", "build-prototype", "references", "prototype-data.md"), "utf8");
  for (const k of ["entity", "roles", "fields", "transitions", "rules", "reports", "rows", "scenarios"]) assert.match(ref, new RegExp("\\| `" + k + "` \\|"), k);
  assert.match(ref, /every live Requirement[^\n]*at least one tab/);
  assert.match(ref, /every section 5 transition is in at least one scenario/);
  const example = ref.match(/`(neome-studio\/engine\/test\/fixtures\/[^`]+prototype-data\.json)`/)[1];
  assert.ok(existsSync(join(plugin, "..", example)), "example path exists");
});

// ---- the page itself, in headless Chrome ----

let puppeteer = null;
try {
  puppeteer = (await import("puppeteer")).default;
} catch {
  // No Chrome here: the eyeball checklist covers it.
}

test("headless Chrome: how it works, try it, by role, questions, consultant mode, no errors or requests", { skip: !puppeteer && "puppeteer not installed" }, async () => {
  const { eng } = copy();
  assert.equal(build(eng).code, 0);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  const browser = await puppeteer.launch({ headless: true, args: process.platform === "linux" ? ["--no-sandbox"] : [] });
  try {
    const page = await browser.newPage();
    const problems = [];
    page.on("pageerror", (e) => problems.push(`pageerror ${e.message}`));
    page.on("console", (msg) => msg.type() === "error" && problems.push(`console ${msg.text()}`));
    page.on("request", (q) => !q.url().startsWith("file:") && problems.push(`request ${q.url()}`));
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(pathToFileURL(view(eng)).href);
    const text = () => page.evaluate(() => document.body.innerText);
    const click = async (sel) => { await page.click(sel); };

    // Header + How it works: flow map of scenario 1, step 1, hotspot on the button pressed.
    let t = await text();
    for (const s of ["Quotations", "Harbor Tiles", "Prototype · not the live app", "How it works", "Questions for you", "Step 1 of 2"]) assert.ok(t.includes(s), s);
    assert.match(t, /who gets a message/i);
    assert.equal((await page.$$(".box")).length, m.scenarios[0].steps.length);
    assert.equal((await page.$$(".hot")).length, 1, "hotspot on Send PDF");
    assert.ok(t.includes("Arjun presses Send PDF"));
    // Customer view: no studio words, no OI ids.
    assert.doesNotMatch(t, /\bOI-\d|Requirement|transition|\bQUO-0\d/);
    // Click a flow box; the step moves.
    await click('[data-on="scen"][data-sc="1"]');
    await click('.box[data-i="1"]');
    t = await text();
    assert.ok(t.includes("Step 2 of 2") && /question for you/i.test(t) && t.includes("When the sales head is away"));
    assert.ok(t.includes("Meera presses Approve and send"), "hotspot in the bot chat");
    // Next walks every step of every scenario and wraps to the start.
    await click('[data-on="scen"][data-sc="0"]');
    const total = m.scenarios.reduce((a, sc) => a + sc.steps.length, 0);
    for (let i = 0; i < total; i++) await click('[data-on="step"][data-d="1"]');
    t = await text();
    assert.ok(t.includes("Step 1 of 2") && t.includes("Small discount"), "wrapped to story 1");
    // Step feedback.
    await click('[data-on="fb"][data-v="change"]');
    await page.type('textarea[data-change="note"]', "PDF needs GST");

    // Try it: role chips, kanban, guarded action, working action, bot message to the next role, phone, reset.
    await click('[data-on="tab"][data-v="try"]');
    t = await text();
    assert.ok(t.includes("Draft (2)") && t.includes("Waiting approval (1)") && t.includes("Arjun can:"));
    await click('[data-on="open"][data-row="Q-1044"]');
    assert.ok(await page.$('button[data-on="act"][data-t="draft>sent"][disabled]'), "Send PDF blocked by the 8% rule");
    await click('button[data-on="act"][data-t="draft>waiting-approval"]');
    t = await text();
    assert.ok(t.includes("Waiting approval (2)") && t.includes("Waiting on Meera, Joel"));
    await click('[data-on="role"][data-role="Sales head"]');
    t = await text();
    assert.ok(/Waiting approval!\s*Q-1044: Submit for approval by Arjun \(Sales exec\)/.test(t), "bot message to the next role");
    await click('[data-on="device"][data-v="phone"]');
    assert.equal((await page.$$(".phone")).length, 3);
    await click('[data-on="reset"]');
    await click('[data-on="device"][data-v="desk"]');
    t = await text();
    assert.ok(t.includes("Draft (2)") && t.includes("Waiting approval (1)"));

    // By role: each role's buttons; See it as → Try it.
    await click('[data-on="tab"][data-v="role"]');
    t = await text();
    for (const s of ["Submit for approval", "Approve and send", "See it as Joel"]) assert.ok(t.includes(s), s);
    assert.match(t, /gets a message when/i);
    await click('[data-on="seeas"][data-role="Accounts"]');
    assert.ok((await text()).includes("Joel can:"));

    // Questions: answer, copy as text for a PF Input.
    await click('[data-on="tab"][data-v="q"]');
    await page.type('textarea[data-change="answer"][data-key="OI-10"]', "Kochi manager");
    await click('[data-on="copy"]');
    const out = await page.$eval("#copy-out", (el) => el.value);
    assert.match(out, /^Prototype feedback · Harbor Tiles · QUO Quotations/);
    assert.match(out, /Q OI-10: When the sales head is away[^\n]*\nA: Kochi manager/);
    assert.match(out, /Q OI-03: [^\n]*\nA: \(no answer\)/);
    assert.match(out, /step 1 \(Arjun \(Sales exec\): [^)]*\): Needs change: PDF needs GST/);

    // Consultant mode: IDs + coverage + trace; every Requirement lights up somewhere.
    await click('[data-change="consult"]');
    t = await text();
    assert.ok(t.includes("7 Requirements") && t.includes("Configuration · indicative") && /requirement trace/i.test(t));
    assert.ok(!t.includes("✗"), "every status change is in a story");
    const ids = await page.$$eval('.trace .r[data-on="trace"]', (els) => els.map((e) => e.dataset.id));
    assert.equal(ids.length, 7);
    for (const id of ids) {
      const n = await page.$$eval(`.trace a[data-on="goto"][data-id="${id}"]`, (els) => els.length);
      let lit = 0;
      for (let i = 0; i < n && !lit; i++) {
        await click(`.trace a[data-on="goto"][data-id="${id}"][data-i="${i}"]`);
        lit = (await page.$$(".hl")).length;
      }
      assert.ok(lit > 0, `${id} lights up somewhere`);
    }
    assert.deepEqual(problems, []);
  } finally {
    await browser.close();
  }
});

test("headless Chrome: a sheet-only Module (no statuses) renders every tab", { skip: !puppeteer && "puppeteer not installed" }, async () => {
  const { eng } = copy();
  assert.equal(build(eng).code, 0);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  m.statuses = [];
  m.transitions = [];
  for (const r of m.rows) r.status = null;
  for (const sc of m.scenarios) for (const s of sc.steps) { s.transition = null; s.status = null; s.from = null; s.notify = []; }
  const { renderPrototypeHtml } = await import(pathToFileURL(join(plugin, "engine", "prototype", "render.mjs")).href);
  const browser = await puppeteer.launch({ headless: true, args: process.platform === "linux" ? ["--no-sandbox"] : [] });
  try {
    const page = await browser.newPage();
    const problems = [];
    page.on("pageerror", (e) => problems.push(e.message));
    await page.setContent(renderPrototypeHtml(m));
    for (const v of ["try", "role", "q", "how"]) await page.click(`[data-on="tab"][data-v="${v}"]`);
    await page.click('[data-on="tab"][data-v="try"]');
    assert.ok((await page.evaluate(() => document.body.innerText)).includes("8 records"));
    assert.deepEqual(problems, []);
  } finally {
    await browser.close();
  }
});
