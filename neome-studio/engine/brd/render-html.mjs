// Renders the BRD HTML page from the BRD data file only.
// One self-contained file: embedded fonts, inline CSS, a small inline script for nav and filters.
// Screen (#screen) = app with sidebar; print (#print) = full linear A4 document from the same data.
// Derived values (metrics, scope counts, fit table, progress) are computed here, never stored.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { svgWithId } from "./diagrams.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const pluginDir = join(here, "..", "..");
const CSS = readFileSync(join(here, "page.css"), "utf8");
const SCRIPT = readFileSync(join(here, "page.js"), "utf8");

const DELIVERY = {
  standard: ["Standard", "std"],
  configuration: ["Configuration", "cfg"],
  custom: ["Custom", "cus"],
};
const SCOPES = ["neome", "neome-tbc", "third-party", "enterprise", "out-of-scope", "open"];
const PRIORITIES = ["Must", "Should", "Could", "Won't", "TBC"];
const STATUS_LABEL = {
  "working-draft": "Working draft — not for circulation",
  "draft-for-review": "Draft for review",
  "signed-off": "Signed off",
};
const IN_PROGRESS = new Set(["open", "claimed", "needs-revisit"]);
// Engagement-wide Requirement topics, in BRD order.
const TOPICS = [
  ["access", "Access", "users, roles and permissions"],
  ["localisation", "Localisation", "currencies and languages"],
  ["hosting", "Hosting", "hosting, data residency, SSO and security"],
  ["migration", "Migration", "moving existing data"],
  ["training", "Training", "teaching people to use it"],
  ["support", "Support", "help after go-live"],
  ["other", "Other", "anything else no single Module owns"],
];
const EMPTY_GENERAL = { requirements: [], na: [], oiRefs: [] };

// svgs = static diagram SVGs from diagrams.mjs, keyed "process" and "mod-<PREFIX>".
export function renderBrdHtml(data, svgs = {}) {
  const ctx = context(data, svgs);
  const title = `${data.engagement.title} · BRD · ${ctx.versionLabel}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="generator" content="neome-studio build-brd">
<title>${esc(title)}</title>
<style>
${fontFaces()}
${CSS}
${pageRule(ctx)}
</style>
</head>
<body>
<div id="screen">${screen(ctx)}</div>
<div id="print">${print(ctx)}</div>
<script>
${SCRIPT}
</script>
</body>
</html>
`;
}

// ---------- derived model ----------

function context(data, svgs) {
  const catalog = appNames();
  const modules = data.modules.filter((m) => !m.status.startsWith("merged-into:"));
  const live = (m) => m.requirements.filter((r) => !r.withdrawn);
  const openOIs = new Set(data.openItems.filter((o) => o.status === "open").map((o) => o.id));
  const general = data.general ?? EMPTY_GENERAL;
  const genLive = general.requirements.filter((r) => !r.withdrawn);
  const allLive = [...modules.flatMap(live), ...genLive];
  const enterprise = data.enterprise.name;
  const status = data.engagement.status;
  return {
    data,
    svgs,
    catalog,
    enterprise,
    modules,
    live,
    openOIs,
    allLive,
    general,
    genLive,
    plan: data.plan ?? null,
    totalWeeks: totalWeeks(data.plan),
    knownOIs: new Set(data.openItems.map((o) => o.id)),
    knownSources: new Set(data.sources.map((s) => s.id)),
    versionLabel: data.engagement.version == null ? "Preview" : `v${data.engagement.version}`,
    statusLabel: STATUS_LABEL[status] ?? status,
    signed: status === "signed-off",
    inProgress: (m) => IN_PROGRESS.has(m.status),
    hasOpenOI: (r) => r.ois.some((id) => openOIs.has(id)),
    progress: (m) => {
      const rs = live(m);
      return rs.length ? Math.round((100 * rs.filter((r) => !r.ois.some((id) => openOIs.has(id))).length) / rs.length) : 0;
    },
    affects: (oi) => [...data.modules.flatMap((m) => m.requirements), ...general.requirements].filter((r) => r.ois.includes(oi)).map((r) => r.id),
  };
}

// Last week of the plan (relative weeks start at 1). Null when no phase has weeks yet.
function totalWeeks(plan) {
  const ends = (plan?.phases ?? []).map((ph) => ph.weekTo ?? ph.weekFrom).filter((w) => w !== null);
  return ends.length ? Math.max(...ends) : null;
}

function appNames() {
  const file = join(pluginDir, "reference", "neome-app-catalog-slugs.json");
  return Object.fromEntries(JSON.parse(readFileSync(file, "utf8")).apps.map((a) => [a.slug, a.name]));
}

// ---------- text helpers ----------

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// Inline markdown (bold, italic, code, http links) + OI IDs linked to the register.
function md(ctx, p, s) {
  let out = esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<i>$2</i>")
    .replace(/(^|[^\w])_([^_\s][^_]*)_(?!\w)/g, "$1<i>$2</i>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\bOI-\d{2,3}\b/g, (id) => (ctx.knownOIs.has(id) ? oiLink(p, id) : id));
  return out;
}

const oiLink = (p, id) => `<a class="oi" href="#${p}${id}">${id}</a>`;
const oiLinks = (p, ids) => ids.map((id) => oiLink(p, id)).join(" ");
const srcLinks = (ctx, p, ids) =>
  ids.map((id) => (ctx.knownSources.has(id) ? `<a class="src" href="#${p}src-${id}">${id}</a>` : `<span class="src">${esc(id)}</span>`)).join(", ");

function delivery(d) {
  if (!d) return '<span class="chip open">Open</span>';
  const [label, cls] = DELIVERY[d];
  return `<span class="chip ${cls}">${label}</span>`;
}
const deliveryOf = (m) => m.mapping?.delivery ?? null;
const priority = (p) => `<span class="chip${p === "Must" ? " must" : ""}">${esc(p)}</span>`;
function scopeLabel(ctx, s) {
  return { neome: "Neome", "neome-tbc": "Neome, TBC", "third-party": "Third party", enterprise: ctx.enterprise, "out-of-scope": "Out of scope", open: "Open" }[s] ?? s;
}
const scope = (ctx, s) => `<span class="chip${s === "open" ? " open" : ""}">${esc(scopeLabel(ctx, s))}</span>`;
// A signed snapshot keeps `proposed` as history; the Enterprise accepted those items on sign-off.
const propChip = (ctx) => `<span class="chip prop">${ctx.signed ? "proposed, accepted on sign-off" : "proposed, to confirm"}</span>`;
const progChip = '<span class="chip prog">In progress</span>';
const head = (eyebrow, h, lead) =>
  `<div><div class="eyebrow">${eyebrow}</div><div class="rule"></div><h2>${h}</h2>${lead ? `<p class="lead" style="margin-top:6px">${lead}</p>` : ""}</div>`;
const table = (cols, rows) =>
  `<div class="tablewrap"><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;

// Static SVG, own id per copy (p = "" screen, "p-" print) so ids and Mermaid's scoped styles never clash.
function diagram(ctx, p, key, what, empty) {
  const svg = ctx.svgs[key];
  if (!svg) return `<p class="empty">${empty}</p>`;
  return `<figure class="diagram" aria-label="${esc(what)}">${svgWithId(svg, `${p}dgm-${key}`)}</figure>`;
}

const statusDiagram = (ctx, p, m) =>
  `<div class="label">Status flow</div>${diagram(ctx, p, `mod-${m.prefix}`, `${m.prefix} status flow`, "No statuses yet.")}`;

// ---------- sections (shared by screen and print; p = anchor prefix) ----------

function metrics(ctx) {
  const must = ctx.allLive.filter((r) => r.priority === "Must").length;
  const resolved = ctx.modules.filter((m) => m.status === "resolved").length;
  const weeks = ctx.plan
    ? `\n<div class="m"><div class="num">${ctx.totalWeeks ?? "TBC"}</div><div class="lab">Weeks, indicative</div></div>`
    : "";
  return `<div class="metrics${ctx.plan ? " m5" : ""}">
<div class="m"><div class="num">${ctx.allLive.length}</div><div class="lab">Requirements in ${ctx.modules.length} Modules${ctx.genLive.length ? " and across all" : ""}</div></div>
<div class="m"><div class="num">${must}</div><div class="lab">${ctx.signed ? "Must" : "Proposed Must"}</div></div>
<div class="m"><div class="num hl">${ctx.openOIs.size}</div><div class="lab">Open Items to close</div></div>
<div class="m"><div class="num">${resolved}/${ctx.modules.length}</div><div class="lab">Modules resolved</div></div>${weeks}
</div>`;
}

const draftNote = (ctx) =>
  ctx.modules.some(ctx.inProgress)
    ? '<div class="draftnote">Some Modules are still in progress. Their Requirements are draft and may change.</div>'
    : "";
const banner = (ctx) => (ctx.data.engagement.status === "working-draft" ? `<div class="banner">${esc(ctx.statusLabel)}</div>` : "");

function cover(ctx) {
  const { data } = ctx;
  return `<div class="logo"><i></i>Neome</div>
${banner(ctx)}
<div><div class="eyebrow">Business Requirements Document</div><div class="rule"></div><h1>${esc(data.engagement.title)} for ${esc(ctx.enterprise)}</h1>
<p class="lead" style="margin-top:14px">What ${esc(data.engagement.title)} on Neome must do for ${esc(ctx.enterprise)}, how each Requirement will be accepted, and what is still open.</p></div>
${metrics(ctx)}
${draftNote(ctx)}
<div class="grid g4 small"><div><div class="label">Prepared by</div>Neomenta</div><div><div class="label">Prepared for</div>${esc(ctx.enterprise)}</div><div><div class="label">Version · date</div>${ctx.versionLabel} · ${esc(data.engagement.date)}</div><div><div class="label">Status</div>${esc(ctx.statusLabel)}</div></div>`;
}

function howToRead(ctx) {
  return `${head("About this document", "How to read this document", "Each Requirement is numbered, prioritised, scoped and traced to a Source. Anything not agreed is an Open Item, not a guess.")}
<div class="grid g3">
<div class="card"><div class="label">Priority (MoSCoW)</div><p class="small">Proposed by Neomenta for ${esc(ctx.enterprise)} to confirm. TBC = not set yet.</p><div class="legend">${PRIORITIES.map(priority).join(" ")}</div></div>
<div class="card"><div class="label">Scope tag</div><p class="small">Who delivers it.</p><div class="legend">${SCOPES.map((s) => scope(ctx, s)).join(" ")}</div></div>
<div class="card"><div class="label">Delivery (indicative)</div><p class="small">From the public Neome catalog. Final in the build phase.</p><div class="legend">${delivery("standard")} ${delivery("configuration")} ${delivery("custom")} ${delivery(null)}</div></div>
</div>
<p class="small">${propChip(ctx)} marks a Neomenta proposal ${ctx.signed ? "accepted by" : "not yet confirmed by"} ${esc(ctx.enterprise)}${ctx.signed ? " on sign-off" : ""}. ${progChip} marks a Module still being worked out. Source IDs are shown in mono; <span class="oi">OI-NN</span> links go to the Open Items register.</p>`;
}

function appName(ctx, m) {
  if (!m.mapping) return "Not mapped yet";
  return m.mapping.neomeApp ? esc(ctx.catalog[m.mapping.neomeApp] ?? m.mapping.neomeApp) : "No catalog App (custom)";
}

function scopeAndFit(ctx, p) {
  const counts = SCOPES.map((s) => [s, ctx.allLive.filter((r) => r.scope === s).length]);
  const merged = ctx.data.modules.filter((m) => !ctx.modules.includes(m));
  const rows = [
    ...ctx.modules.map(
      (m) =>
        `<tr><td class="id"><a href="#${p}mod-${m.prefix}">${m.prefix}</a></td><td><b class="t">${esc(m.name)}</b>${m.purpose ? md(ctx, p, m.purpose.text) : ""}</td><td>${m.mapping ? md(ctx, p, m.mapping.how) : '<span class="empty">Not mapped yet</span>'}</td><td>${appName(ctx, m)}</td><td>${delivery(deliveryOf(m))} ${ctx.inProgress(m) ? progChip : ""}</td></tr>`,
    ),
    ...merged.map(
      (m) =>
        `<tr class="dead"><td class="id">${m.prefix}</td><td><b class="t">${esc(m.name)}</b></td><td colspan="2">Merged into ${esc(m.status.slice("merged-into:".length))}</td><td><span class="chip dead">Merged</span></td></tr>`,
    ),
  ];
  return `${head("Scope at a glance", "What is in, what sits elsewhere, what is open")}
<div class="grid g6">${counts.map(([s, n]) => `<div class="card"><div class="num">${n}</div><div class="lab">${esc(scopeLabel(ctx, s))}</div></div>`).join("")}</div>
${head("Neome fit", "How Neome delivers each Module", "Neome App and Delivery are indicative, from the public catalog.")}
${table(["Module", "What it covers", "How Neome delivers it", "Neome App", "Delivery"], rows)}`;
}

function processSection(ctx, p) {
  const { lanes, steps } = ctx.data.process;
  const laneName = Object.fromEntries(lanes.map((l) => [l.id, l.name]));
  const rows = steps.map(
    (s) =>
      `<tr><td>${esc(laneName[s.lane] ?? s.lane)}</td><td><b class="t">${md(ctx, p, s.label)}</b>${s.note ? md(ctx, p, s.note) : ""}${s.proposed ? ` ${propChip(ctx)}` : ""}</td><td class="id">${s.module ? `<a href="#${p}mod-${s.module}">${s.module}</a>` : "—"}</td><td>${esc(s.kind)}</td><td>${s.oi ? oiLink(p, s.oi) : ""}</td></tr>`,
  );
  return `${head("Business process", "End to end", "Each step names the Module that owns it. Steps that hang on an Open Item show its ID.")}
${diagram(ctx, p, "process", "End-to-end process diagram", "No process diagram yet.")}
${steps.length ? '<p class="small">Each box: Module · step. Diamonds are decisions. Dotted arrows are other paths. Grey is an outside system. Dashed orange hangs on an Open Item. Lanes are a guide only; the layout is drawn automatically.</p>' : ""}
${steps.length ? table(["Lane", "Step", "Module", "Kind", "Open Item"], rows) : '<p class="empty">No process steps yet.</p>'}`;
}

function moduleHead(ctx, p, m) {
  return `<div><div class="eyebrow">Module · ${m.prefix}${m.formerly ? ` · formerly ${esc(m.formerly)}` : ""}</div><div class="rule"></div>
<h2>${esc(m.name)} ${ctx.inProgress(m) ? progChip : ""}</h2>
<p class="lead" style="margin-top:6px">${m.purpose ? md(ctx, p, m.purpose.text) + (m.purpose.proposed ? ` ${propChip(ctx)}` : "") : '<span class="empty">Purpose not written yet.</span>'}</p></div>`;
}

function mappingCard(ctx, p, m) {
  return `<div class="mapcard"><div class="card"><div class="label">Neome App</div><h3>${appName(ctx, m)}</h3></div>
<div class="card"><div class="label">Delivery · indicative</div>${delivery(deliveryOf(m))}</div>
<div class="card"><div class="label">How</div><p class="small">${m.mapping ? md(ctx, p, m.mapping.how) : "Not mapped yet."}</p></div></div>`;
}

function moduleOIs(ctx, p, m) {
  const ids = new Set([...m.oiRefs, ...m.requirements.flatMap((r) => r.ois)]);
  const list = ctx.data.openItems.filter((o) => o.status === "open" && (ids.has(o.id) || o.modules.includes(m.prefix)));
  if (!list.length) return "";
  return `<div class="oibox"><div class="label" style="color:var(--accent)">Open Items for this Module</div>${list
    .map((o) => `<p>${oiLink(p, o.id)} ${md(ctx, p, o.question)} <span class="src">· ${esc(owner(ctx, o))}</span></p>`)
    .join("")}</div>`;
}

const acceptance = (ctx, p, r) =>
  r.acceptance.length ? `<ul>${r.acceptance.map((a) => `<li>${md(ctx, p, a)}</li>`).join("")}</ul>` : '<p class="empty">No acceptance criteria yet.</p>';

function reqCard(ctx, m, r) {
  const dead = Boolean(r.withdrawn);
  const attrs = `data-priority="${esc(r.priority)}" data-open-scope="${r.scope === "open" || r.scope === "neome-tbc" ? "yes" : "no"}" data-has-oi="${ctx.hasOpenOI(r) ? "yes" : "no"}"`;
  return `<div class="req${dead ? " dead" : ""}" id="${r.id}" ${attrs}>
<div class="rid">${r.id}</div>
<div><b class="t">${md(ctx, "", r.title)}</b>${r.proposed ? ` ${propChip(ctx)}` : ""}${dead ? ` <span class="chip dead">Withdrawn</span>` : ""}
<div>${md(ctx, "", r.statement)}</div>${dead ? `<div class="small">Withdrawn: ${md(ctx, "", r.withdrawn)}</div>` : ""}
<details><summary>Acceptance criteria</summary>${acceptance(ctx, "", r)}</details></div>
<div class="side">${priority(r.priority)}${scope(ctx, r.scope)}${r.delivery ? delivery(r.delivery) : ""}<span>${srcLinks(ctx, "", r.sources)}</span><span>${oiLinks("", r.ois)}</span></div>
</div>`;
}

function reqRow(ctx, p, r) {
  const dead = Boolean(r.withdrawn);
  return `<tr class="${dead ? "dead" : ""}"><td class="id">${r.id}</td><td><b class="t">${md(ctx, p, r.title)}</b>${md(ctx, p, r.statement)}${r.proposed ? ` ${propChip(ctx)}` : ""}${dead ? `<div class="small">Withdrawn: ${md(ctx, p, r.withdrawn)}</div>` : ""}</td><td>${acceptance(ctx, p, r)}</td><td>${priority(r.priority)}</td><td>${scope(ctx, r.scope)}${r.delivery ? ` ${delivery(r.delivery)}` : ""}</td><td>${srcLinks(ctx, p, r.sources)}${r.ois.length ? `<div>${oiLinks(p, r.ois)}</div>` : ""}</td></tr>`;
}

const sortReqs = (m) => [...m.requirements].sort((a, b) => Boolean(a.withdrawn) - Boolean(b.withdrawn));

function moduleScreen(ctx, m) {
  const reqs = sortReqs(m);
  const filters = [["all", "All"], ["must", "Must"], ["open-scope", "Open scope"], ["has-oi", "Has Open Item"]];
  return `${moduleHead(ctx, "", m)}
${mappingCard(ctx, "", m)}
<div>${statusDiagram(ctx, "", m)}</div>
<div class="filters" role="group" aria-label="Filter Requirements">${filters.map(([k, l], i) => `<button type="button" data-filter="${k}"${i ? "" : ' class="on"'}>${l}</button>`).join("")}</div>
<div>${reqs.map((r) => reqCard(ctx, m, r)).join("")}<p class="nomatch empty${reqs.length ? "" : " on"}">No Requirements match.</p></div>
${moduleOIs(ctx, "", m)}`;
}

function modulePrint(ctx, m) {
  const reqs = sortReqs(m);
  return `${moduleHead(ctx, "p-", m)}
${mappingCard(ctx, "p-", m)}
<div>${statusDiagram(ctx, "p-", m)}</div>
${reqs.length ? table(["ID", "Requirement", "Acceptance criteria", "Priority", "Scope", "Sources · OIs"], reqs.map((r) => reqRow(ctx, "p-", r))) : '<p class="empty">No Requirements yet.</p>'}
${moduleOIs(ctx, "p-", m)}`;
}

// ---------- Across all Modules ----------

function generalHead() {
  return head("Across all Modules", "Engagement-wide Requirements", "Requirements no single Module owns, grouped by topic. They are not mapped to a Neome App and are not in the fit table.");
}

// One topic: its Requirements (cards on screen, table in print), N/A with Source, listed Open Items.
function topicBlock(ctx, p, [topic, label, gist], reqsHtml) {
  const reqs = sortReqs(ctx.general).filter((r) => r.topic === topic);
  const na = ctx.general.na.filter((n) => n.topic === topic);
  const oiIds = ctx.general.oiRefs.filter((o) => o.topic === topic).map((o) => o.id);
  const ois = ctx.data.openItems.filter((o) => oiIds.includes(o.id));
  const parts = [];
  if (reqs.length) parts.push(reqsHtml(reqs));
  for (const n of na) parts.push(`<p class="small">Not applicable${n.reason ? `: ${md(ctx, p, n.reason)}` : ""} ${srcLinks(ctx, p, n.sources)}</p>`);
  if (ois.length) {
    parts.push(`<div class="oibox">${ois
      .map((o) => `<p>${oiLink(p, o.id)} ${md(ctx, p, o.question)} <span class="src">· ${esc(owner(ctx, o))}</span>${o.status === "closed" ? ' <span class="chip">Closed</span>' : ""}</p>`)
      .join("")}</div>`);
  }
  if (!parts.length) parts.push('<p class="empty">Not covered yet.</p>');
  return `<div class="gen-topic" id="${p}topic-${topic}"><h3>${label} <span class="small">· ${gist}</span></h3>${parts.join("\n")}</div>`;
}

// Open Module = All Items not listed under any topic yet.
function generalOtherOIs(ctx, p) {
  const listed = new Set(ctx.general.oiRefs.map((o) => o.id));
  const list = ctx.data.openItems.filter((o) => o.status === "open" && o.modules.includes("All") && !listed.has(o.id));
  if (!list.length) return "";
  return `<div class="oibox"><div class="label" style="color:var(--accent)">Other Open Items across all Modules</div>${list
    .map((o) => `<p>${oiLink(p, o.id)} ${md(ctx, p, o.question)} <span class="src">· ${esc(owner(ctx, o))}</span></p>`)
    .join("")}</div>`;
}

function generalScreen(ctx) {
  const filters = [["all", "All"], ["must", "Must"], ["open-scope", "Open scope"], ["has-oi", "Has Open Item"]];
  const any = ctx.general.requirements.length > 0;
  return `${generalHead()}
${any ? `<div class="filters" role="group" aria-label="Filter Requirements">${filters.map(([k, l], i) => `<button type="button" data-filter="${k}"${i ? "" : ' class="on"'}>${l}</button>`).join("")}</div>` : ""}
${TOPICS.map((t) => topicBlock(ctx, "", t, (reqs) => reqs.map((r) => reqCard(ctx, null, r)).join(""))).join("\n")}
${any ? '<p class="nomatch empty">No Requirements match.</p>' : ""}
${generalOtherOIs(ctx, "")}`;
}

function generalPrint(ctx) {
  const cols = ["ID", "Requirement", "Acceptance criteria", "Priority", "Scope", "Sources · OIs"];
  return `${generalHead()}
${TOPICS.map((t) => topicBlock(ctx, "p-", t, (reqs) => table(cols, reqs.map((r) => reqRow(ctx, "p-", r))))).join("\n")}
${generalOtherOIs(ctx, "p-")}`;
}

// ---------- Implementation plan (optional; no pricing, no calendar dates) ----------

function weeksLabel(ph) {
  const { weekFrom: a, weekTo: b } = ph;
  if (a === null && b === null) return '<span class="empty">Weeks not set</span>';
  if (a !== null && b !== null) return a === b ? `Week ${a}` : `Weeks ${a}–${b}`;
  return a !== null ? `From week ${a}` : `Until week ${b}`;
}

function planModules(ctx, p, prefixes) {
  const live = new Set(ctx.modules.map((m) => m.prefix));
  return prefixes
    .map((x) => (x === "GEN" ? `<a href="#${p}general">GEN</a>` : live.has(x) ? `<a href="#${p}mod-${x}">${x}</a>` : esc(x)))
    .join(", ");
}

function planSection(ctx, p) {
  const { phases, notPlaced } = ctx.plan;
  const rows = phases.map(
    (ph) =>
      `<tr><td><b class="t">${md(ctx, p, ph.name)}</b>${ph.proposed ? propChip(ctx) : ""}</td><td class="plan-weeks">${weeksLabel(ph)}</td><td>${md(ctx, p, ph.covers)}</td><td class="src">${planModules(ctx, p, ph.modules)}</td></tr>`,
  );
  const waiting = notPlaced.map(
    (n) =>
      `<tr><td>${md(ctx, p, n.text)}${n.proposed ? ` ${propChip(ctx)}` : ""}</td><td>${oiLinks(p, n.ois)}</td><td class="src">${planModules(ctx, p, n.modules)}</td></tr>`,
  );
  const total = ctx.totalWeeks === null ? "Total: not set yet." : `Total: about ${ctx.totalWeeks} week${ctx.totalWeeks === 1 ? "" : "s"}, counted from the start of work.`;
  return `${head("Implementation plan", "How delivery could run", "Neomenta's estimate, indicative. Work that depends on other parties runs on its own plan.")}
${rows.length ? table(["Phase", "Weeks", "What it covers", "Modules"], rows) : '<p class="empty">No phases yet.</p>'}
<p class="small">${total} Weeks are relative, not calendar dates.</p>
<div><h3>Not yet placed</h3><p class="small" style="margin:4px 0 8px">Work with no slot yet: custom builds, third-party work, and scope that hangs on an Open Item.</p>
${waiting.length ? table(["What", "Open Items", "Modules"], waiting) : '<p class="empty">Nothing waiting.</p>'}</div>`;
}

function owner(ctx, o) {
  const who = o.owner === "enterprise" ? ctx.enterprise : "Neomenta";
  return o.askTo ? `${who} (${o.askTo})` : who;
}

function openItems(ctx, p) {
  const list = [...ctx.data.openItems].sort((a, b) => (a.status === b.status ? 0 : a.status === "open" ? -1 : 1));
  const rows = list.map((o) => {
    const affects = [...o.modules, ...ctx.affects(o.id)].join(", ");
    const answer = o.status === "closed"
      ? `<div class="small" style="margin-top:3px">${o.answer ? `Answer: ${md(ctx, p, o.answer)} ` : "Answered "}${o.answerSource ? `(${srcLinks(ctx, p, [o.answerSource])})` : ""}</div>`
      : o.suggested ? `<div class="small" style="margin-top:3px">Suggested: ${md(ctx, p, o.suggested)}</div>` : "";
    return `<tr id="${p}${o.id}" class="${o.status === "closed" ? "dead" : ""}"><td class="id">${o.id}</td><td>${md(ctx, p, o.question)}${answer}</td><td>${esc(owner(ctx, o))}</td><td class="src">${esc(affects)}</td><td>${o.status === "open" ? '<span class="chip open">Open</span>' : '<span class="chip">Closed</span>'}</td></tr>`;
  });
  return `${head("Open Items register", `${ctx.openOIs.size} questions to close`, "Nothing here has been assumed in the Requirements.")}
${rows.length ? table(["ID", "Question", "Answer from", "Affects", "Status"], rows) : '<p class="empty">No Open Items.</p>'}`;
}

function glossary(ctx, p) {
  const rows = ctx.data.glossary.map(
    (g) =>
      `<tr><td><b class="t">${esc(g.term)}</b>${g.proposed ? propChip(ctx) : ""}</td><td>${md(ctx, p, g.definition)}${g.avoid.length ? `<div class="small">Avoid: ${esc(g.avoid.join(", "))}</div>` : ""}${g.disputed ? `<div class="small">Disputed: ${oiLink(p, g.disputed)}</div>` : ""}</td><td>${srcLinks(ctx, p, g.sources)}</td></tr>`,
  );
  return `${head("Glossary", `${esc(ctx.enterprise)} terms used in this document`)}
${rows.length ? table(["Term", `Meaning at ${esc(ctx.enterprise)}`, "Sources"], rows) : '<p class="empty">No terms yet.</p>'}`;
}

function sourcesSection(ctx, p) {
  const rows = ctx.data.sources.map(
    (s) =>
      `<tr id="${p}src-${s.id}"><td class="id">${s.id}</td><td>${esc(s.type)}</td><td>${md(ctx, p, s.title)}${s.confidential ? ' <span class="chip">confidential</span>' : ""}</td><td class="src">${esc(s.date ?? "")}</td></tr>`,
  );
  return `${head("Sources", "Where each Requirement came from")}
${rows.length ? table(["ID", "Type", "Source", "Date"], rows) : '<p class="empty">No Sources yet.</p>'}`;
}

const CHANGE_GROUPS = [
  ["modules", "Modules"],
  ["requirements", "Requirements"],
  ["openItems", "Open Items"],
  ["plan", "Implementation plan"],
  ["glossary", "Glossary"],
];

// Change log newest first; each entry = summary + its changes grouped. Unsigned = empty boxes to sign on paper.
function versions(ctx, p) {
  const { changelog, signOff } = ctx.data;
  // Superseded is derived (a newer version exists), never stored.
  const entryStatus = (c) => `${STATUS_LABEL[c.status] ?? c.status}${c.version < ctx.data.engagement.version ? " · superseded" : ""}`;
  const changes = (list) =>
    CHANGE_GROUPS.map(([g, label]) => {
      const items = list.filter((x) => x.group === g);
      return items.length ? `<div class="label">${label}</div><ul>${items.map((x) => `<li>${md(ctx, p, x.text)}</li>`).join("")}</ul>` : "";
    }).join("");
  const rows = [...changelog].reverse().map(
    (c) =>
      `<tr><td class="id">v${esc(c.version)}<div class="small">${esc(entryStatus(c))}</div></td><td class="src">${esc(c.date)}</td><td>${md(ctx, p, c.summary)}${c.changes.length ? changes(c.changes) : c.version === 1 ? "" : '<div class="small">No changes to Modules, Requirements, Open Items, plan or glossary.</div>'}</td></tr>`,
  );
  const blank = (label) => `<div class="signline"><span class="label">${label}</span><span class="line"></span></div>`;
  const box = (label, s) =>
    `<div class="card"><div class="label">For ${esc(label)}</div>${
      s
        ? `<div><b>${esc(s.name)}</b>, ${esc(s.role)}</div><div class="src">${esc(s.date)}</div>`
        : `${blank("Name")}${blank("Role")}${blank("Signature")}${blank("Date")}`
    }</div>`;
  return `${head("Versions and sign-off", `${ctx.versionLabel} · ${esc(ctx.statusLabel)}`)}
${rows.length ? table(["Version", "Date", "What changed"], rows) : '<p class="empty">No released versions yet. This is a working preview.</p>'}
<div class="signbox">${box(ctx.enterprise, signOff?.enterpriseSigner)}${box("Neomenta", signOff?.neomentaSigner)}</div>
${signOff ? signOffLists(ctx, p, signOff) : ""}`;
}

// Sign-off block: evidence, Open Items open at sign-off, proposed items accepted on sign-off.
function signOffLists(ctx, p, s) {
  const accepted = s.acceptedProposed.map((ref) => `<li class="src">${esc(refLabel(ref))}</li>`).join("");
  return `<p class="small">Evidence: ${srcLinks(ctx, p, [s.evidence])}</p>
<div class="signbox signlists">
<div class="card"><div class="label">Open at sign-off</div>${s.openAtSignOff.length ? `<p>${oiLinks(p, s.openAtSignOff)}</p><p class="small">Still to close; agreed to stay open.</p>` : '<p class="empty">None.</p>'}</div>
<div class="card"><div class="label">Accepted on sign-off</div>${accepted ? `<p class="small">Neomenta proposals ${esc(ctx.enterprise)} accepted by signing.</p><ul>${accepted}</ul>` : '<p class="empty">None.</p>'}</div>
</div>`;
}

// "modules[QUO].requirements[QUO-01]" → "QUO-01"; other refs as stored.
function refLabel(ref) {
  return ref.match(/\.requirements\[([A-Z]+-\d+)\]$/)?.[1] ?? ref;
}

// ---------- screen ----------

function screen(ctx) {
  const { data } = ctx;
  const nav = (id, label, extra = "") => `<a href="#${id}" data-view="${id}"><span>${label}</span>${extra}</a>`;
  const side = `<aside><div class="logo"><i></i>Neome</div>
<div class="meta">${esc(data.engagement.title)} · ${esc(ctx.enterprise)}<br>${ctx.versionLabel} · ${esc(ctx.statusLabel)}</div>
<nav aria-label="BRD sections">
<div class="grp">Overview</div>${nav("summary", "Summary and fit")}${nav("process", "Process")}
<div class="grp">Modules</div>${ctx.modules
    .map((m) => {
      const d = deliveryOf(m);
      const chip = d ? `<span class="chip ${DELIVERY[d][1]}">${DELIVERY[d][0]}</span>` : '<span class="chip open">Open</span>';
      return nav(`mod-${m.prefix}`, `${m.prefix} · ${esc(m.name)}`, chip) + `<div class="bar" title="${ctx.progress(m)}% of Requirements with no open Open Item"><i style="width:${ctx.progress(m)}%"></i></div>`;
    })
    .join("")}
${nav("general", "Across all Modules")}${ctx.plan ? nav("plan", "Implementation plan") : ""}
<div class="grp">Register</div>${nav("open-items", "Open Items", `<span class="chip open">${ctx.openOIs.size}</span>`)}${nav("glossary", "Glossary")}${nav("sources", "Sources")}${nav("versions", "Versions and sign-off")}
</nav></aside>`;
  const view = (id, html) => `<section class="view" id="${id}">${html}</section>`;
  const views = [
    view("summary", `${cover(ctx)}${howToRead(ctx)}${scopeAndFit(ctx, "")}`),
    view("process", processSection(ctx, "")),
    ...ctx.modules.map((m) => view(`mod-${m.prefix}`, moduleScreen(ctx, m))),
    view("general", generalScreen(ctx)),
    ...(ctx.plan ? [view("plan", planSection(ctx, ""))] : []),
    view("open-items", openItems(ctx, "")),
    view("glossary", glossary(ctx, "")),
    view("sources", sourcesSection(ctx, "")),
    view("versions", versions(ctx, "")),
  ];
  return `<div class="app">${side}<main>${views.join("\n")}</main></div>`;
}

// ---------- print ----------

function print(ctx) {
  const sec = (id, html, cls = "") => `<section class="psec${cls}" id="p-${id}">${html}</section>`;
  return [
    sec("cover", cover(ctx), " cover"),
    sec("how-to-read", howToRead(ctx)),
    sec("fit", scopeAndFit(ctx, "p-")),
    sec("process", processSection(ctx, "p-")),
    ...ctx.modules.map((m) => sec(`mod-${m.prefix}`, modulePrint(ctx, m))),
    sec("general", generalPrint(ctx)),
    ...(ctx.plan ? [sec("plan", planSection(ctx, "p-"))] : []),
    sec("open-items", openItems(ctx, "p-")),
    sec("glossary", glossary(ctx, "p-")),
    sec("sources", sourcesSection(ctx, "p-")),
    sec("versions", versions(ctx, "p-")),
  ].join("\n");
}

// A4, footer: Engagement · version · status · page x / y.
function pageRule(ctx) {
  const footer = cssString(`${ctx.data.engagement.title} · ${ctx.versionLabel} · ${ctx.statusLabel} · page `);
  return `@page{size:A4;margin:14mm 14mm 18mm;
  @bottom-center{content:${footer} counter(page) " / " counter(pages);font-family:'JetBrains Mono',ui-monospace,monospace;font-size:8pt;color:#8A8A8E}}`;
}

function cssString(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\r\n]+/g, " ")}"`;
}

// Schibsted Grotesk + JetBrains Mono, embedded so the page works offline.
function fontFaces() {
  const dir = join(pluginDir, "reference", "fonts");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".woff2"))
    .sort()
    .map((f) => {
      const [, name, weight] = f.match(/^(\w+)-(\d+)\.woff2$/);
      const family = { SchibstedGrotesk: "Schibsted Grotesk", JetBrainsMono: "JetBrains Mono" }[name] ?? name;
      const b64 = readFileSync(join(dir, f)).toString("base64");
      return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
    })
    .join("\n");
}
