// BRD preview page (ticket 23): build-brd --mode preview also writes brd/preview.html.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures", "brd");

function enterprise(name) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-page-")), "harbor-tiles");
  cpSync(join(fixtures, name), root, { recursive: true });
  return join(root, "engagements", "crm");
}

function build(engagement) {
  const r = spawnSync(process.execPath, [cli, "build-brd", engagement], { encoding: "utf8" });
  const page = join(engagement, "brd", "preview.html");
  return { code: r.status, out: r.stdout + r.stderr, html: existsSync(page) ? readFileSync(page, "utf8") : null };
}

const resolved = build(enterprise("resolved"));
const inProgress = build(enterprise("in-progress"));

const screenOf = (html) => html.slice(html.indexOf('<div id="screen">'), html.indexOf('<div id="print">'));
const printOf = (html) => html.slice(html.indexOf('<div id="print">'), html.indexOf("<script>"));
const noScript = (html) => html.replace(/<script>[\s\S]*?<\/script>/g, "");
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const ids = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

// ---- file ----

test("preview build writes one HTML page next to the data file", () => {
  assert.equal(resolved.code, 0, resolved.out);
  assert.ok(resolved.html, "brd/preview.html missing");
  assert.match(resolved.out, /preview\.html/);
  assert.match(resolved.html, /^<!doctype html>/);
  assert.match(resolved.html, /Working draft — not for circulation/);
});

test("in-progress Engagement builds a page too (warnings only)", () => {
  assert.equal(inProgress.code, 0, inProgress.out);
  assert.ok(inProgress.html);
});

test("no page is written when the build fails", () => {
  const eng = enterprise("resolved");
  const file = join(eng, "_agent", "modules", "LEAD-leads", "spec.md");
  writeFileSync(file, readFileSync(file, "utf8").replaceAll("CE-1", "ZZ-9"));
  const r = build(eng);
  assert.equal(r.code, 1, r.out);
  assert.equal(r.html, null);
});

// ---- self-contained ----

test("no external JS, no mermaid.js, no external CSS or fonts", () => {
  const html = resolved.html;
  assert.doesNotMatch(html, /<script[^>]*\bsrc=/i);
  assert.doesNotMatch(html, /mermaid(\.min)?\.js|mermaid\.(initialize|render|run)\(/);
  assert.doesNotMatch(html, /<link\b/i);
  assert.doesNotMatch(html, /@import/i);
  assert.doesNotMatch(html, /url\(\s*['"]?(https?:)?\/\//i);
  assert.equal((html.match(/<script>/g) ?? []).length, 1, "one inline script only");
  assert.match(html, /@font-face\{font-family:'Schibsted Grotesk'[^}]*data:font\/woff2;base64,/);
  assert.match(html, /@font-face\{font-family:'JetBrains Mono'[^}]*data:font\/woff2;base64,/);
});

test("content works with script off: views, cards, acceptance and register are plain HTML", () => {
  const html = noScript(resolved.html);
  const screen = strip(screenOf(html));
  assert.match(screen, /A Sales executive can capture a Lead with name, phone and channel\./);
  assert.match(screen, /A new Lead shows in the list with status New\./);
  assert.match(html, /<details><summary>Acceptance criteria<\/summary>/);
  assert.match(html, /<tr id="OI-01"/);
  // views are hidden only once the script marks the page .js
  assert.match(html, /\.js \.view\{display:none\}/);
  assert.doesNotMatch(html, /(^|[}\n])\.view\{[^}]*display:none/);
});

// ---- print ----

test("print CSS: A4, hidden print container, page breaks, repeated headers, no split rows, footer", () => {
  const html = resolved.html;
  assert.match(html, /#print\{display:none\}/);
  assert.match(html, /@media print\{[\s\S]*#screen\{display:none!important\}[\s\S]*#print\{display:block\}/);
  assert.match(html, /@page\{size:A4/);
  assert.match(html, /\.psec\{break-before:page/);
  assert.match(html, /thead\{display:table-header-group\}/);
  assert.match(html, /tr,[^{]*\{break-inside:avoid\}/);
  assert.match(html, /@bottom-center\{content:"Sales CRM · Preview · Working draft — not for circulation · page " counter\(page\) " \/ " counter\(pages\)/);
});

// ---- order ----

test("sections in fixed order, same on screen and print", () => {
  const html = resolved.html;
  const expected = ["process", "mod-LEAD", "mod-QUO", "general", "plan", "open-items", "glossary", "sources", "versions"];
  const screen = ids(screenOf(html), /<section class="view" id="([^"]+)"/g);
  assert.deepEqual(screen, ["summary", ...expected]);
  const print = ids(printOf(html), /<section class="psec[^"]*" id="p-([^"]+)"/g);
  assert.deepEqual(print, ["cover", "how-to-read", "fit", ...expected]);
  // Summary view keeps the same inner order: cover, How to read, scope, fit
  const summary = strip(screenOf(html).split('id="process"')[0]);
  const at = (s) => summary.indexOf(s);
  assert.ok(at("Modules resolved") < at("How to read this document"));
  assert.ok(at("How to read this document") < at("Scope at a glance"));
  assert.ok(at("Scope at a glance") < at("How Neome delivers each Module"));
});

test("Module order follows the Engagement map in the in-progress fixture", () => {
  const print = ids(printOf(inProgress.html), /id="p-(mod-[A-Z]+)"/g);
  assert.deepEqual(print, ["mod-LEAD", "mod-QUO", "mod-SVC"]);
});

// ---- sidebar ----

test("sidebar: Overview, Modules with Delivery chip + progress bar, Register with Open Items count", () => {
  const side = resolved.html.slice(resolved.html.indexOf("<aside>"), resolved.html.indexOf("</aside>"));
  const text = strip(side);
  for (const s of ["Overview", "Summary and fit", "Process", "Modules", "Register", "Open Items", "Glossary", "Sources", "Versions and sign-off"]) {
    assert.ok(text.includes(s), `sidebar missing ${s}`);
  }
  assert.ok(text.indexOf("Overview") < text.indexOf("Modules") && text.indexOf("Modules") < text.indexOf("Register"));
  // LEAD: OI-02 is closed → 2/2 Requirements clear; QUO: QUO-02 hangs on open OI-01 → 1/2 (withdrawn QUO-03 not counted)
  assert.match(side, /data-view="mod-LEAD"><span>LEAD · Leads<\/span><span class="chip cfg">Configuration<\/span><\/a><div class="bar"[^>]*><i style="width:100%">/);
  assert.match(side, /data-view="mod-QUO"><span>QUO · Quotes<\/span><span class="chip cfg">Configuration<\/span><\/a><div class="bar"[^>]*><i style="width:50%">/);
  assert.match(side, /Open Items<\/span><span class="chip open">2<\/span>/);
  assert.doesNotMatch(side, /mod-ENQ/, "merged Module not in nav");
});

test("unmapped Module shows an Open Delivery chip", () => {
  assert.match(inProgress.html, /data-view="mod-SVC"><span>SVC · After-sales service<\/span><span class="chip open">Open<\/span>/);
});

// ---- summary ----

test("summary: metrics, scope at a glance, fit table, How to read legend", () => {
  const summary = strip(screenOf(resolved.html).split('id="process"')[0]);
  // live Requirements: LEAD-01, LEAD-02, QUO-01, QUO-02 (QUO-03 withdrawn, ENQ merged) + GEN-01, GEN-02
  assert.match(summary, /6 Requirements in 2 Modules and across all/);
  assert.match(summary, /4 Proposed Must/);
  assert.match(summary, /2 Open Items to close/);
  assert.match(summary, /2\/2 Modules resolved/);
  assert.match(summary, /6 Neome 0 Neome, TBC 0 Third party 0 Harbor Tiles 0 Out of scope 0 Open/);
  assert.match(summary, /Module What it covers How Neome delivers it Neome App Delivery/);
  assert.match(summary, /LEAD Leads Track every tile enquiry .* Lead Management Configuration/);
  assert.match(summary, /ENQ Enquiries Merged into LEAD Merged/);
  assert.match(summary, /Priority \(MoSCoW\).*Scope tag.*Delivery \(indicative\)/);
  assert.doesNotMatch(summary.split("How Neome delivers each Module")[1], /In progress/);
});

test("in-progress summary: Modules resolved 1/3 and draft warning", () => {
  const summary = strip(screenOf(inProgress.html).split('id="process"')[0]);
  assert.match(summary, /1\/3 Modules resolved/);
  assert.match(summary, /Some Modules are still in progress/);
});

// ---- Module view ----

test("Module view: eyebrow, name, purpose, mapping card, filters, Requirement cards, OI box", () => {
  const html = screenOf(resolved.html);
  const quo = html.slice(html.indexOf('id="mod-QUO"'), html.indexOf('id="open-items"'));
  const text = strip(quo);
  assert.match(text, /Module · QUO · formerly QT/);
  assert.match(text, /Quotes/);
  assert.match(text, /Neome App Quotation &amp; Order Flow Delivery · indicative Configuration How Quotation &amp; Order Flow with a discount approval step\./);
  assert.match(quo, /data-filter="all" class="on">All<.*data-filter="must">Must<.*data-filter="open-scope">Open scope<.*data-filter="has-oi">Has Open Item</s);
  assert.match(quo, /<div class="req" id="QUO-02" data-priority="Must" data-open-scope="no" data-has-oi="yes">/);
  assert.match(quo, /id="QUO-02"[\s\S]*?proposed, to confirm[\s\S]*?<span class="chip cus">Custom<\/span>/);
  assert.match(quo, /<a class="src" href="#src-PL-1">PL-1<\/a>/);
  assert.match(quo, /class="oibox"[\s\S]*OI-01[\s\S]*Which discount needs the sales head to approve\?/);
  assert.match(quo, /<figure class="diagram" aria-label="QUO status flow"><svg id="dgm-mod-QUO"/);
});

test("withdrawn Requirement greyed; merged Module has no view", () => {
  const html = resolved.html;
  assert.match(html, /<div class="req dead" id="QUO-03"/);
  assert.match(html, /Withdrawn: Enterprise sends Quotes by WhatsApp only/);
  assert.doesNotMatch(html, /id="mod-ENQ"|id="p-mod-ENQ"/);
});

test("unresolved Modules carry the In progress chip", () => {
  const html = screenOf(inProgress.html);
  const head = (p) => strip(html.slice(html.indexOf(`id="mod-${p}"`)).split("</h2>")[0]);
  assert.match(head("QUO"), /In progress/);
  assert.match(head("SVC"), /In progress/);
  assert.doesNotMatch(head("LEAD"), /In progress/);
});

// ---- links ----

test("every OI link jumps to an existing register row (screen and print)", () => {
  for (const html of [resolved.html, inProgress.html]) {
    const anchors = new Set(ids(html, /\bid="([^"]+)"/g));
    const links = ids(html, /<a class="oi" href="#([^"]+)"/g);
    assert.ok(links.length > 0);
    for (const l of links) assert.ok(anchors.has(l), `OI link #${l} has no target`);
    const screenLinks = ids(screenOf(html), /<a class="oi" href="#([^"]+)"/g);
    assert.ok(screenLinks.every((l) => /^OI-\d+$/.test(l)));
    const printLinks = ids(printOf(html), /<a class="oi" href="#([^"]+)"/g);
    assert.ok(printLinks.every((l) => /^p-OI-\d+$/.test(l)));
  }
});

// ---- look ----

test("Vendorgate tokens and Delivery colours", () => {
  const html = resolved.html;
  for (const t of ["--neome:#1877D5", "--accent:#F47100", "--std:#1E8E5A", "--cfg:#1877D5", "--cus:#F47100"]) assert.ok(html.includes(t), t);
  assert.match(html, /\.chip\.std\{border-color:var\(--std\)/);
  assert.match(html, /\.chip\.open\{border-style:dashed;color:var\(--accent\)/);
});
