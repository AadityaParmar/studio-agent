// BRD diagrams (ticket 24): BRD data file → Mermaid text → pinned mmdc → static SVG in the page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, existsSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { processMermaid, statusMermaid, MERMAID_CLI_PIN, checkMmdc } from "../brd/diagrams.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "brd");
const repoRoot = join(here, "..", "..", "..");

function enterprise(name) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-dgm-")), "harbor-tiles");
  cpSync(join(fixtures, name), root, { recursive: true });
  return join(root, "engagements", "crm");
}

function build(engagement, env = {}) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement], { encoding: "utf8", env: { ...process.env, ...env } });
  const page = join(engagement, "brd", "preview.html");
  const data = join(engagement, "_agent", "brd", "brd-data.json");
  return {
    code: r.status,
    out: r.stdout + r.stderr,
    html: existsSync(page) ? readFileSync(page, "utf8") : null,
    data: existsSync(data) ? JSON.parse(readFileSync(data, "utf8")) : null,
  };
}

const svgs = (html) => Object.fromEntries([...html.matchAll(/<svg id="([^"]+)"[\s\S]*?<\/svg>/g)].map((m) => [m[1], m[0]]));
const step = (o) => ({ note: "", kind: "step", module: "LEAD", sources: ["CE-1"], proposed: false, ...o });

const resolvedEng = enterprise("resolved");
const resolved = build(resolvedEng);
const inProgress = build(enterprise("in-progress"));

// ---- Mermaid text ----

test("process: flowchart TB, subgraph per lane, Module prefix, diamonds, dotted labelled alternates, grey externals", () => {
  const text = processMermaid({
    lanes: [
      { id: "sales", name: "Sales team", kind: "person" },
      { id: "tally", name: "Tally ERP", kind: "external" },
    ],
    steps: [
      step({ id: "capture-lead", lane: "sales", label: "Capture Lead", note: "From a call" }),
      step({ id: "qualify", lane: "sales", label: "Qualified?", kind: "decision" }),
      step({ id: "post-invoice", lane: "tally", module: null, label: "Post invoice", kind: "external" }),
    ],
    edges: [
      { from: "capture-lead", to: "qualify", label: "", alternate: false },
      { from: "qualify", to: "capture-lead", label: "no, nurture", alternate: true },
      { from: "qualify", to: "post-invoice", label: "yes", alternate: false },
    ],
  });
  const lines = text.split("\n");
  assert.equal(lines[0], "flowchart TB");
  assert.ok(lines.includes('  subgraph lane_sales["Sales team"]'), text);
  assert.ok(lines.includes('  subgraph lane_tally["Tally ERP"]'), text);
  assert.ok(lines.includes('    step_capture_lead["LEAD · Capture Lead<br/><small>From a call</small>"]'), text);
  assert.ok(lines.includes('    step_qualify{"LEAD · Qualified?"}'), text);
  assert.ok(lines.includes('    step_post_invoice["Post invoice"]'), "no Module → no prefix");
  assert.ok(lines.includes("  step_capture_lead --> step_qualify"), text);
  assert.ok(lines.includes('  step_qualify -.->|"no, nurture"| step_capture_lead'), text);
  assert.ok(lines.includes('  step_qualify -->|"yes"| step_post_invoice'), text);
  assert.ok(lines.includes("  class step_post_invoice ext"), text);
  assert.match(text, /classDef ext fill:#F2F2F0,stroke:#C7C7C5/);
  assert.match(text, /style lane_tally fill:#F2F2F0/);
});

test("process: OI-dependent steps and lanes dashed orange with the OI ID", () => {
  const text = processMermaid({
    lanes: [{ id: "head", name: "Sales head", kind: "person", oi: "OI-04" }],
    steps: [step({ id: "approve", lane: "head", module: "QUO", label: "Approve discount", kind: "decision", oi: "OI-01" })],
    edges: [],
  });
  assert.match(text, /subgraph lane_head\["Sales head · OI-04"\]/);
  assert.match(text, /step_approve\{"QUO · Approve discount · OI-01"\}/);
  assert.match(text, /classDef open [^\n]*stroke:#F47100,stroke-dasharray:5 3/);
  assert.match(text, /class step_approve open/);
  assert.match(text, /style lane_head [^\n]*stroke-dasharray/);
});

test("status: stateDiagram-v2, direction LR, [*] start/end, triggers as labels, open state dashed orange with OI", () => {
  const text = statusMermaid({
    statuses: [
      { id: "draft", start: true, end: false },
      { id: "pending-approval", start: false, end: false, oi: "OI-01" },
      { id: "won", start: false, end: true },
    ],
    transitions: [
      { from: "draft", to: "pending-approval", trigger: "Discount over limit" },
      { from: "pending-approval", to: "won", trigger: "Customer accepts" },
    ],
  });
  const lines = text.split("\n");
  assert.deepEqual(lines.slice(0, 2), ["stateDiagram-v2", "  direction LR"]);
  assert.ok(lines.includes('  state "Pending approval · OI-01" as st_pending_approval'), text);
  assert.ok(lines.includes("  [*] --> st_draft"), text);
  assert.ok(lines.includes("  st_won --> [*]"), text);
  assert.ok(lines.includes("  st_draft --> st_pending_approval : Discount over limit"), text);
  assert.ok(lines.includes("  class st_pending_approval open"), text);
});

test("labels: quotes, colons, semicolons and markdown cannot break the Mermaid text", () => {
  const text = statusMermaid({
    statuses: [{ id: "a", start: true, end: true }],
    transitions: [{ from: "a", to: "a", trigger: 'Say "hi": **now**; #1 <b>' }],
  });
  assert.match(text, /st_a --> st_a : Say #34;hi#34;#58; now#59; #35;1 #60;b#62;\n/);
  assert.equal(processMermaid({ lanes: [], steps: [], edges: [] }), null);
  assert.equal(statusMermaid({ statuses: [], transitions: [] }), null);
});

// ---- page ----

test("HTML contains static SVG for the process and each Module, screen and print", () => {
  assert.equal(resolved.code, 0, resolved.out);
  const s = svgs(resolved.html);
  for (const id of ["dgm-process", "dgm-mod-LEAD", "dgm-mod-QUO", "p-dgm-process", "p-dgm-mod-LEAD", "p-dgm-mod-QUO"]) {
    assert.ok(s[id], `svg ${id} missing`);
    assert.match(s[id], /<g\b/);
  }
  assert.match(s["dgm-process"], /aria-roledescription="flowchart-v2"/);
  assert.match(s["dgm-mod-QUO"], /aria-roledescription="stateDiagram"/);
  assert.ok(!Object.keys(s).some((id) => id.includes("ENQ")), "merged Module has no diagram");
  assert.doesNotMatch(resolved.html, /later build/);
  // Labels come through as text: Module prefix, OI ID, trigger.
  assert.match(s["dgm-process"], /QUO · Approve discount · OI-01/);
  assert.match(s["dgm-mod-QUO"], /Pending approval · OI-01/);
  assert.match(s["dgm-mod-QUO"], /Customer accepts/);
});

test("Module with no statuses shows a note, not an empty diagram", () => {
  assert.equal(inProgress.code, 0, inProgress.out);
  const s = svgs(inProgress.html);
  assert.ok(s["dgm-process"] && s["dgm-mod-LEAD"] && s["dgm-mod-QUO"]);
  assert.ok(!s["dgm-mod-SVC"]);
  const svc = inProgress.html.slice(inProgress.html.indexOf('id="mod-SVC"'));
  assert.match(svc.slice(0, svc.indexOf("</section>")), /No statuses yet\./);
});

test("static: no script inside SVG, no mermaid.js, every id in the page unique", () => {
  const html = resolved.html;
  for (const svg of Object.values(svgs(html))) assert.doesNotMatch(svg, /<script|\son\w+=/i);
  assert.doesNotMatch(html, /mermaid(\.min)?\.js|mermaid\.(initialize|render|run)\(/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
  assert.doesNotMatch(html, /neome-diagram/, "mmdc placeholder id replaced");
});

test("Mermaid theme uses BRD tokens; SVG carries no font copies", () => {
  const s = svgs(resolved.html)["dgm-process"];
  assert.match(s, /font-family:'Schibsted Grotesk'/);
  assert.match(s, /#1877D5/i, "Neome blue borders");
  assert.match(s, /#8A8A8E/i, "grey lines");
  assert.match(s, /#F47100/i, "orange for open");
  assert.doesNotMatch(s, /@font-face/);
});

test("same data → byte-identical SVG across builds", () => {
  const again = build(resolvedEng);
  assert.equal(again.code, 0, again.out);
  assert.deepEqual(svgs(again.html), svgs(resolved.html));
});

// Page CSS must not reach into the SVG: any page selector that could match a Mermaid element
// is either neutralised by a `.diagram svg …` reset or listed here as harmless.
const HARMLESS_TAGS = { "*": "box-sizing / print colour only", p: "margin:0, same as Mermaid's own rule" };

test("page CSS does not leak into the SVG", () => {
  const css = readFileSync(join(here, "..", "brd", "page.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const all = Object.values(svgs(resolved.html)).concat(Object.values(svgs(inProgress.html))).join("");
  const svgClasses = new Set([...all.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)));
  const svgTags = new Set([...all.matchAll(/<([a-zA-Z][\w-]*)/g)].map((m) => m[1].toLowerCase()));
  const selectors = [...css.matchAll(/([^{}@;]+)\{[^{}]*\}/g)].flatMap((m) => m[1].split(",").map((x) => x.trim())).filter(Boolean);
  const resets = new Set(selectors.filter((x) => x.startsWith(".diagram svg ")).flatMap((x) => [...x.matchAll(/\.([\w-]+)/g)].map((m) => m[1])));
  const leaks = [];
  for (const sel of selectors.filter((x) => !x.startsWith(".diagram"))) {
    const subject = sel.replace(/\[[^\]]*\]|::?[\w-]+(\([^)]*\))?/g, "").trim().split(/\s*[\s>+~]\s*/).pop();
    if (!subject) continue;
    const tag = subject.match(/^[a-zA-Z*][\w-]*/)?.[0]?.toLowerCase();
    const classes = [...subject.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
    if (subject.includes("#")) continue;
    const tagHits = !tag || tag === "*" || svgTags.has(tag);
    const classHits = classes.every((c) => svgClasses.has(c));
    if (!tagHits || !classHits) continue;
    if (classes.length ? classes.every((c) => resets.has(c)) : tag in HARMLESS_TAGS) continue;
    leaks.push(sel);
  }
  assert.deepEqual(leaks, []);
});

// ---- mmdc setup ----

test("mmdc pin matches the repo package.json and lock", () => {
  const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
  assert.equal(pkg.dependencies["@mermaid-js/mermaid-cli"], MERMAID_CLI_PIN);
  const lock = JSON.parse(readFileSync(join(repoRoot, "package-lock.json"), "utf8"));
  assert.equal(lock.packages["node_modules/@mermaid-js/mermaid-cli"].version, MERMAID_CLI_PIN);
  assert.equal(checkMmdc(join(repoRoot, "node_modules", ".bin", "mmdc")), null, "installed mmdc is the pinned one");
});

test("mmdc missing → clear 'run npm ci' error, nothing written", () => {
  const eng = enterprise("resolved");
  const r = build(eng, { NEOME_MMDC: join(tmpdir(), "no-such-dir", "mmdc") });
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /error \[mmdc-missing\] Mermaid CLI \(mmdc\) not found/);
  assert.match(r.out, /Run `npm ci`/);
  assert.equal(r.data, null);
  assert.equal(r.html, null);
});

test("mmdc version ≠ pin → clear error naming both versions, nothing written", () => {
  const dir = mkdtempSync(join(tmpdir(), "neome-mmdc-"));
  cpSync(join(here, "fixtures", "mmdc", "wrong-version"), dir, { recursive: true });
  chmodSync(join(dir, "mmdc"), 0o755);
  const eng = enterprise("resolved");
  const r = build(eng, { NEOME_MMDC: join(dir, "mmdc") });
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, new RegExp(`error \\[mmdc-version\\] Mermaid CLI is 11\\.4\\.0, BRD needs ${MERMAID_CLI_PIN.replace(/\./g, "\\.")}`));
  assert.match(r.out, /Run `npm ci`/);
  assert.equal(r.data, null);
  assert.equal(r.html, null);
});
