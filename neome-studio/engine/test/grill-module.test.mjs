// grill-module (ticket 31): question bank shape, catalog hints source, OI-only bullets in a spec section,
// and the hand-run sample: one Module grilled live on top of review-draft output must pass the build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, "..", "..");
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");
const bankFile = join(plugin, "skills", "grill-module", "references", "question-bank.md");
const skillFile = join(plugin, "skills", "grill-module", "SKILL.md");

const read = (...p) => readFileSync(join(...p), "utf8");
const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};

function copy(rel) {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-grill-")), "harbor-tiles");
  cpSync(join(fixtures, rel, "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const agent = (eng, ...p) => join(eng, "_agent", ...p);

// Full preview build (data file written); returns data.
function build(eng) {
  const r = spawnSync(process.execPath, [cli, "build-brd", eng], { encoding: "utf8" });
  const out = agent(eng, "brd", "brd-data.json");
  return { code: r.status, out: r.stdout + r.stderr, data: existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null };
}

// ---- question bank ----

const TOPICS = [
  "Purpose and pain", "Roles", "Process", "Records and data", "Statuses", "Rules",
  "Exceptions", "Reports", "Integrations", "Volumes and NFRs", "Priority and Scope tag",
];
const SPEC_SECTIONS = [
  "Purpose and KPIs", "Roles", "Process", "Records and data", "Statuses", "Rules and notifications",
  "Exceptions", "Reports", "Integrations", "Volumes and NFRs", "Requirements", "Neome mapping", "Open Items",
];

function topics() {
  const parts = read(bankFile).split(/^## /m).slice(1).filter((p) => /^\d+ /.test(p));
  return parts.map((p) => {
    const [title, ...lines] = p.split("\n");
    const body = lines.join("\n");
    const line = (k) => body.match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1] ?? null;
    const ask = body.match(/^Ask:\n((?:- .+\n?)+)/m)?.[1].trim().split("\n") ?? [];
    return { title: title.trim(), aim: line("Aim"), ask, prefill: line("Pre-fill"), feeds: line("Feeds"), always: line("Always ask") };
  });
}

test("question bank: 11 topics in default order, each with aim, 2-4 questions, pre-fill and target spec section", () => {
  const t = topics();
  assert.deepEqual(t.map((x) => x.title), TOPICS.map((name, i) => `${i + 1} ${name}`));
  for (const x of t) {
    assert.ok(x.aim, `${x.title}: Aim`);
    assert.ok(x.ask.length >= 2 && x.ask.length <= 4, `${x.title}: 2-4 questions, got ${x.ask.length}`);
    assert.ok(x.prefill, `${x.title}: Pre-fill`);
    assert.ok(x.feeds, `${x.title}: Feeds`);
    const named = [...x.feeds.matchAll(/spec (\d+) ([A-Za-z ]+?)(?=[,;.]|$| \+)/g)];
    assert.ok(named.length, `${x.title}: Feeds names a spec section`);
    for (const [, n, name] of named) assert.equal(SPEC_SECTIONS[Number(n) - 1], name.trim(), `${x.title}: spec ${n}`);
  }
});

test("question bank: the 8 always-asked facts are marked, each on its topic", () => {
  const always = Object.fromEntries(topics().filter((x) => x.always).map((x) => [x.title.replace(/^\d+ /, ""), x.always]));
  assert.deepEqual(always, {
    "Purpose and pain": "goals and KPIs",
    Roles: "roles and headcount",
    Statuses: "final status list",
    Rules: "approval thresholds and approvers",
    Integrations: "system of record; integration ownership",
    "Volumes and NFRs": "volumes",
    "Priority and Scope tag": "priority",
  });
});

test("question bank: App hints point at the shipped catalog reference, never copied", () => {
  const bank = read(bankFile);
  assert.match(bank, /reference\/neome-app-catalog\.md/);
  const catalog = read(plugin, "reference", "neome-app-catalog.md");
  const apps = [...catalog.matchAll(/^## App: (.+)$/gm)].map((m) => m[1]);
  assert.equal(apps.length, 30);
  const slugs = JSON.parse(read(plugin, "reference", "neome-app-catalog-slugs.json"));
  const list = Array.isArray(slugs) ? slugs : slugs.apps ?? Object.keys(slugs);
  for (const s of list.map((x) => (typeof x === "string" ? x : x.slug))) assert.match(catalog, new RegExp("`" + s + "`"), s);
  // No App section text (e.g. default discount limits) copied into the bank.
  assert.doesNotMatch(bank, /up to 5%|Head of sales any|QT-2041/);
  assert.match(read(skillFile), /question-bank\.md/);
});

// ---- an open topic written as Open Item bullets ----

test("a bullet section holding only Open Item bullets counts as filled and adds no fact", () => {
  const { eng } = copy("review-draft/after-review");
  const f = agent(eng, "modules", "QUO-quotations", "ticket.md");
  writeFileSync(f, read(f).replace("## 9 Integrations", "## 7 Exceptions\n\n- OI-04: Credit check for all buyers or only contractors?\n\n## 10 Volumes and NFRs\n\n- OI-01: Above what discount does the sales head approve?\n\n## 9 Integrations"));
  const r = build(eng);
  assert.equal(r.code, 0, r.out);
  const quo = r.data.modules.find((m) => m.prefix === "QUO");
  assert.deepEqual(quo.exceptions, []);
  assert.deepEqual(quo.volumes, []);
  assert.doesNotMatch(r.out, /QUO.*"(Exceptions|Volumes and NFRs)" is empty/);
});

// ---- hand-run sample: QUO grilled live (WS-2) ----

const grilled = () => copy("grill-module/after-grill");
const quoTicket = (eng) => read(agent(eng, "modules", "QUO-quotations", "ticket.md"));
const reqBlocks = (t) => Object.fromEntries(t.split(/^### /m).slice(1).map((b) => [b.match(/^([A-Z]+-\d+)/)[1], b]));

test("hand-run grill of QUO passes the build; only spec.md and mapping gaps remain", () => {
  const { eng } = grilled();
  assert.equal(run("build-brd", eng, "--check").code, 0);
  const r = build(eng);
  assert.equal(r.code, 0, r.out);
  const quoWarnings = r.out.split("\n").filter((l) => /Module QUO/.test(l));
  assert.ok(quoWarnings.length > 0);
  for (const w of quoWarnings) assert.match(w, /spec\.md|mapping|Neome mapping/, w);
});

test("hand-run grill: every topic section 1-11 + 13 present and filled, no Neome mapping", () => {
  const { eng } = grilled();
  const t = quoTicket(eng);
  for (const [i, name] of SPEC_SECTIONS.entries()) {
    const sec = t.match(new RegExp(`^## ${i + 1} ${name}\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
    if (name === "Neome mapping") assert.equal(sec, null, "section 12 is neome-mapping's");
    else assert.ok(sec && sec[1].trim(), `section ${i + 1} ${name}`);
  }
  assert.equal(parseYaml(t.match(/^---\n([\s\S]*?)\n---\n/)[1]).status, "claimed");
});

test("hand-run grill: live answers logged as WS-2 with speaker names", () => {
  const { ent } = grilled();
  assert.match(read(ent, "_agent", "sources.md"), /^\| WS-2 \| session log \| grill-module session QUO \| 2026-10-29 \| inputs\/WS-2-grill-module-session-quo\.md \| crm \|/m);
  const log = read(ent, "_agent", "sources", "WS-2.md");
  assert.match(log, /Meera \(sales head\)/);
  assert.match(log, /Joel \(accounts\)/);
  assert.equal(log.split("---\n").slice(1).join("---\n").trim(), read(ent, "inputs", "WS-2-grill-module-session-quo.md").trim());
});

test("hand-run grill: Consultant's own view is proposed + Open Item; clash with Inputs is an Open Item", () => {
  const { eng } = grilled();
  const ois = read(agent(eng, "open-items.md"));
  const t = quoTicket(eng);
  // Asha's own view on a stand-in approver.
  assert.match(t, /Kochi showroom manager.*\(proposed, to confirm\)/);
  assert.match(ois, /^\| OI-10 \| .*away.* \| QUO \| Enterprise \|/m);
  // Meera (WS-2) vs Joel (CE-2) on validity.
  assert.match(ois, /^\| OI-11 \| .*15 days.*CE-2.*30 days.*WS-2.* \| QUO \| Enterprise \| .* \| open \|/m);
  // Answered live → closed with the session as answer Source.
  assert.match(ois, /^\| OI-01 \| .* \| closed \| \| WS-2 \|$/m);
  assert.match(ois, /^\| OI-04 \| .* \| closed \| \| WS-2 \|$/m);
});

test("hand-run grill: bulk confirm; unconfirmed Requirements roll into one Engagement Open Item", () => {
  const { eng } = grilled();
  const blocks = reqBlocks(quoTicket(eng));
  const row = read(agent(eng, "open-items.md")).match(/^\| (OI-\d+) \| Confirm the proposed priority, Scope tag and acceptance criteria of: ([^|]+) \| All \| Enterprise \|.*\| open \|/m);
  assert.ok(row, "one Engagement Open Item, Module(s) All");
  const pending = row[2].trim().split(/,\s*/);
  assert.deepEqual(pending, ["QUO-04", "QUO-06", "QUO-07"]);
  for (const [id, b] of Object.entries(blocks)) {
    assert.match(b, /^Priority: (Must|Should|Could|Won't)$/m, `${id}: MoSCoW drafted`);
    if (pending.includes(id)) {
      assert.match(b, /^Proposed: yes$/m, id);
      assert.match(b, new RegExp(`^OIs: .*${row[1]}`, "m"), `${id} names ${row[1]}`);
    } else {
      assert.match(b, /^Proposed: no$/m, id);
      assert.match(b, /^Sources: .*WS-2/m, `${id} cites WS-2`);
      assert.doesNotMatch(b, /\(proposed, to confirm\)/, id);
    }
  }
});

test("hand-run grill: new Enterprise term added to the glossary, citing WS-2", () => {
  const { ent } = grilled();
  assert.match(read(ent, "_agent", "GLOSSARY.md"), /\*\*Revised quotation\*\*:\n.+\n_Source_: WS-2 · _Status_: proposed · _Used in_: crm/);
});
