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

test("banner: PROTOTYPE, Enterprise, prefix, Requirement and Open Item counts, indicative Neome App + Delivery", () => {
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
  for (const s of ["<b>PROTOTYPE</b>", "Requirements · ", "Open Items · ", "indicative", "Neome App: "]) assert.ok(js.includes(s), s);
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
  assert.match(js, /chip prop[^]*proposed/);
  assert.match(js, /chip oi/);
  assert.match(js, /chip sample[^]*>sample</);
  assert.match(js, /chip guess[^]*>guessed</);
  assert.match(js, /Approve from bot chat · guessed/);
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
  assert.match(js, /proposed by Neomenta, to confirm/);
  assert.match(js, /This step proves/);
});

test("done check: every Requirement shows in at least one tab; every transition is in at least one scenario", () => {
  const { eng } = copy();
  build(eng);
  const m = modelOf(readFileSync(view(eng), "utf8"));
  for (const r of m.requirements) {
    assert.ok(m.trace[r.id].length >= 1, `${r.id} traced`);
    for (const p of m.trace[r.id]) assert.ok(["app", "scen", "mob"].includes(p.tab));
  }
  const inScenario = new Set(m.scenarios.flatMap((sc) => sc.steps.map((s) => s.transition)));
  for (const t of m.transitions) assert.ok(inScenario.has(t.id), `${t.id} in a scenario`);
  // Mobile + trace: phones for every key role (acts on or is told about a transition).
  assert.deepEqual(m.roles.filter((r) => r.key).map((r) => r.role), ["Sales exec", "Sales head", "Accounts"]);
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

test("skill: How to talk, writes data only, calls the engine; reference documents every key and the done check", () => {
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

test("headless Chrome: tabs render, actions work, every Requirement lights up somewhere, reset, no errors or requests", { skip: !puppeteer && "puppeteer not installed" }, async () => {
  const { eng } = copy();
  assert.equal(build(eng).code, 0);
  const browser = await puppeteer.launch({ headless: true, args: process.platform === "linux" ? ["--no-sandbox"] : [] });
  try {
    const page = await browser.newPage();
    const problems = [];
    page.on("pageerror", (e) => problems.push(`pageerror ${e.message}`));
    page.on("console", (m) => m.type() === "error" && problems.push(`console ${m.text()}`));
    page.on("request", (q) => !q.url().startsWith("file:") && problems.push(`request ${q.url()}`));
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(pathToFileURL(view(eng)).href);
    const text = () => page.evaluate(() => document.body.innerText);
    const click = async (sel) => { await page.click(sel); };

    // Banner + App: kanban by status, record drawer, working action, bot notification to the next role.
    let t = await text();
    for (const s of ["PROTOTYPE", "Harbor Tiles", "QUO", "7 Requirements", "5 Open Items", "Quotation & Order Flow", "Configuration · indicative", "Draft (2)", "Waiting approval (1)"]) assert.ok(t.includes(s), s);
    await click('[data-on="open"][data-row="Q-1044"]');
    t = await text();
    assert.ok(t.includes("DETAILS") && t.includes("ACTIVITY") && t.includes("Green Villa Interiors"));
    assert.ok(await page.$('button[data-on="act"][data-t="draft>sent"][disabled]'), "Send PDF blocked by the 8% rule");
    await click('button[data-on="act"][data-t="draft>waiting-approval"]');
    t = await text();
    assert.ok(t.includes("Waiting approval (2)") && t.includes("Waiting on Sales head, Accounts"));
    await page.select('[data-change="role"]', "Sales head");
    t = await text();
    assert.ok(/Waiting approval!\s*Q-1044: Submit for approval by Arjun \(Sales exec\)/.test(t), "bot notification to the next role");
    // Sample marks.
    assert.ok((await page.$$(".chip.sample")).length >= 8);

    // Scenarios: steps, proof, coverage, OI callout, next role's phone.
    await click('[data-on="tab"][data-v="scen"]');
    await click('[data-on="scen"][data-sc="1"]');
    await click('[data-on="step"][data-d="1"]');
    t = await text();
    for (const s of ["THIS STEP PROVES", "OI-10 open:", "Approve and send", "Neome tells the next role", "guessed"]) assert.ok(t.includes(s), s);
    assert.ok(!t.includes("✗"), "coverage lists show no gaps");

    // Mobile + trace: phones per key role; each Requirement's places light up at least one element.
    await click('[data-on="tab"][data-v="mob"]');
    t = await text();
    assert.ok(t.includes("REQUIREMENT TRACE") && t.includes("home · bot notifications") && t.includes("record"));
    const ids = await page.$$eval('.C-trace .r[data-on="trace"]', (els) => els.map((e) => e.dataset.id));
    assert.equal(ids.length, 7);
    for (const id of ids) {
      await click('[data-on="tab"][data-v="mob"]');
      const n = await page.$$eval(`.C-trace a[data-on="goto"][data-id="${id}"]`, (els) => els.length);
      let lit = 0;
      for (let i = 0; i < n && !lit; i++) {
        await click('[data-on="tab"][data-v="mob"]');
        await click(`.C-trace a[data-on="goto"][data-id="${id}"][data-i="${i}"]`);
        lit = (await page.$$(".hl")).length;
      }
      assert.ok(lit > 0, `${id} lights up somewhere`);
    }

    // Reset puts the sample data back.
    await click('[data-on="reset"]');
    await click('[data-on="tab"][data-v="app"]');
    await click('[data-on="clear"]');
    t = await text();
    assert.ok(t.includes("Draft (2)") && t.includes("Waiting approval (1)"));
    assert.deepEqual(problems, []);
  } finally {
    await browser.close();
  }
});
