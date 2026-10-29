// Questionnaire helpers (ticket 35, used by the questionnaire skill).
//   new-questionnaire <engagement-dir> --to "<name>" [--role "<role>"] [--from "<name>"] [--module "QUO, All"] [--check]
//   export-questionnaire <engagement-dir> <QN-id>
// new-questionnaire picks the open Open Items owned by the Enterprise (all, or those naming the given Modules),
// orders them (sections by Module, `All` first then map order; Must first in each section, then register order),
// writes the master `_agent/questionnaires/QN-<date>[-n].md`, adds the QN to each item's `asked in` cell and
// a map change-log line. `--check` prints the selection and warnings, writes nothing.
// export-questionnaire renders the master (only) to `questionnaires/QN-….html` (Neome look, A4, no JS)
// and `.txt` (WhatsApp / email: numbered, no tables). Views are overwritten; the master never is.
// Exit 0 = done, 1 = refused (nothing written), 2 = bad arguments.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { readEngagement } from "./brd/read-engagement.mjs";
import { schemaErrors, crossRefErrors, SCHEMA_VERSION } from "./brd/validate.mjs";
import { normHeader, provenance } from "./markdown.mjs";
import { parse, usage, today } from "./ingest.mjs";
import { renderQuestionnaireHtml, renderQuestionnaireTxt } from "./questionnaire/render.mjs";

export const SOFT_CAP = 25;
const QN_ID = /^QN-\d{4}-\d{2}-\d{2}(-[a-z0-9-]+)?$/;
const NEW_USE = 'new-questionnaire <engagement-dir> --to "<name>" [--role "<role>"] [--from "<name>"] [--module "QUO, All"] [--check]';
const EXPORT_USE = "export-questionnaire <engagement-dir> <QN-id>";

const refuse = (msgs) => {
  for (const e of msgs) console.error(`error [${e.cls}] ${e.msg}`);
  return 1;
};

// ---- new-questionnaire ----

export function newQuestionnaire(args) {
  const { pos, opts, problem } = parse(args, ["to", "role", "from", "module"], ["check"]);
  if (problem) return usage(problem, NEW_USE);
  const [dirArg] = pos;
  if (!dirArg || pos.length > 1) return usage("new-questionnaire: needs <engagement-dir>", NEW_USE);
  const dir = resolve(dirArg);
  if (!existsSync(join(dir, "_agent", "open-items.md"))) {
    return usage(`new-questionnaire: ${dirArg} is not an Engagement folder (no _agent/open-items.md)`, NEW_USE);
  }
  const to = (opts.to ?? "").trim();
  if (!to) return usage("new-questionnaire: needs --to <name of the one Enterprise contact>", NEW_USE);
  const filter = opts.module === undefined ? null : opts.module.split(",").map((s) => s.trim()).filter(Boolean);
  if (filter && !filter.length) return usage("new-questionnaire: --module needs one or more prefixes (or All)", NEW_USE);

  // The register must read cleanly: same reader and checks as build-brd.
  const { data, register, errors: parseErrors } = readEngagement(dir, { schemaVersion: SCHEMA_VERSION, date: today() });
  const errors = [...parseErrors, ...schemaErrors(data)];
  if (!errors.length) errors.push(...crossRefErrors(data, register));
  if (errors.length) {
    refuse(errors);
    console.error(`new-questionnaire: ${errors.length} error(s); fix the Engagement first (build-brd --check)`);
    return 1;
  }
  const known = new Set(["All", ...data.modules.map((m) => m.prefix)]);
  const unknown = (filter ?? []).filter((p) => !known.has(p));
  if (unknown.length) return refuse([{ cls: "questionnaire", msg: `no Module ${unknown.join(", ")} in this Engagement (known: ${[...known].join(", ")})` }]);

  const sections = select(data, filter);
  const items = sections.flatMap((s) => s.items);
  if (!items.length) {
    return refuse([{ cls: "questionnaire", msg: `no open Enterprise-owned Open Items${filter ? ` for ${filter.join(", ")}` : ""}; nothing to ask` }]);
  }

  const warnings = [];
  for (const it of items) {
    if (!it.askTo) warnings.push({ cls: "no-ask-to", msg: `${it.id}: no "ask to" role in open-items.md` });
    if (!it.suggested) warnings.push({ cls: "no-suggested", msg: `${it.id}: no suggested answer in open-items.md` });
  }
  if (items.length > SOFT_CAP) {
    const split = sections.map((s) => `--module ${s.key} (${s.items.length})`).join(", ");
    warnings.push({ cls: "size", msg: `${items.length} items, over ~${SOFT_CAP}. Suggest one Questionnaire per Module: ${split}` });
  }

  const date = today();
  const qnDir = join(dir, "_agent", "questionnaires");
  const id = freeId(qnDir, date);

  for (const s of sections) {
    for (const it of s.items) {
      const tags = [it.must ? "Must" : null, it.askedIn.length ? `asked before (${it.askedIn.join(", ")})` : null].filter(Boolean);
      console.log(`${s.key.padEnd(5)} ${it.id}${it.askTo ? ` · For: ${it.askTo}` : ""}${tags.length ? ` · ${tags.join(" · ")}` : ""}`);
    }
  }
  for (const w of warnings) console.error(`warning [${w.cls}] ${w.msg}`);
  if (opts.check) {
    console.log(`new-questionnaire: ${items.length} item(s) for ${to} as ${id} (check only, nothing written)`);
    return 0;
  }

  const head = {
    id, to, role: (opts.role ?? "").trim(), from: (opts.from ?? "").trim(),
    enterprise: data.enterprise.name, engagement: data.engagement.title, slug: data.engagement.slug, date,
    modules: filter ? filter.join(", ") : "all",
  };
  // Register first in memory: refuse before writing anything if the column is missing.
  const regPath = join(dir, "_agent", "open-items.md");
  const reg = addAskedIn(readFileSync(regPath, "utf8"), new Set(items.map((i) => i.id)), id);
  if (reg.problem) return refuse([{ cls: "questionnaire", msg: `open-items.md: ${reg.problem}` }]);

  mkdirSync(qnDir, { recursive: true });
  const master = join(qnDir, `${id}.md`);
  writeFileSync(master, masterText(head, sections));
  writeFileSync(regPath, reg.text);
  const mapPath = join(dir, "_agent", "map.md");
  if (existsSync(mapPath)) {
    writeFileSync(mapPath, withChangeLog(readFileSync(mapPath, "utf8"), `- ${date}: questionnaire: ${id} to ${to}, ${items.length} Open Item(s).`));
  }
  console.log(`new-questionnaire: wrote ${master} (${items.length} item(s) for ${to}); asked in = ${id} on ${items.length} register row(s)`);
  return 0;
}

// Sections in order: `All` first, then map order. Items: Must first, then register order.
function select(data, filter) {
  const order = ["All", ...data.modules.map((m) => m.prefix)];
  const names = new Map([["All", "Across all Modules"], ...data.modules.map((m) => [m.prefix, m.name])]);
  const must = new Set();
  const reqs = [...data.modules.flatMap((m) => m.requirements), ...(data.general?.requirements ?? [])];
  for (const r of reqs) if (!r.withdrawn && r.priority === "Must") for (const oi of r.ois ?? []) must.add(oi);

  const byKey = new Map();
  for (const oi of data.openItems) {
    if (oi.owner !== "enterprise" || oi.status !== "open") continue;
    const cands = filter ? oi.modules.filter((m) => filter.includes(m)) : oi.modules;
    if (!cands.length) continue;
    const key = cands.includes("All") ? "All" : [...cands].sort((a, b) => rank(order, a) - rank(order, b))[0];
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push({
      id: oi.id, question: plain(oi.question), askTo: plain(oi.askTo ?? ""), suggested: plain(oi.suggested ?? ""),
      askedIn: oi.askedIn ?? [], must: must.has(oi.id),
    });
  }
  return [...byKey.keys()]
    .sort((a, b) => rank(order, a) - rank(order, b))
    .map((key) => ({
      key, name: names.get(key) ?? key,
      items: byKey.get(key).map((it, i) => ({ it, i })).sort((a, b) => (b.it.must - a.it.must) || (a.i - b.i)).map((x) => x.it),
    }));
}

const rank = (order, k) => (order.includes(k) ? order.indexOf(k) : order.length);

// What the Enterprise reads: no Source IDs, no "(proposed, to confirm)", no markdown marks, one line.
function plain(s) {
  return provenance(String(s ?? "")).text.replace(/\*\*|__|`/g, "").replace(/\s+/g, " ").trim();
}

function freeId(qnDir, date) {
  const base = `QN-${date}`;
  if (!existsSync(join(qnDir, `${base}.md`))) return base;
  for (let n = 2; ; n++) if (!existsSync(join(qnDir, `${base}-${n}.md`))) return `${base}-${n}`;
}

const splitRow = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);

// Appends the QN to the `asked in` cell of each chosen register row.
function addAskedIn(text, ids, qn) {
  const lines = text.split("\n");
  const h = lines.findIndex((l, i) => l.trim().startsWith("|") && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? "")
    && splitRow(l).map(normHeader).includes("question"));
  if (h < 0) return { problem: "no register table" };
  const heads = splitRow(lines[h]).map(normHeader);
  const idCol = heads.indexOf("id");
  const col = heads.indexOf("asked in");
  if (col < 0) return { problem: 'no "asked in" column (header: ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source)' };
  let done = 0;
  for (let j = h + 2; j < lines.length && lines[j].trim().startsWith("|"); j++) {
    const cells = splitRow(lines[j]);
    if (!ids.has(cells[idCol]?.trim())) continue;
    while (cells.length <= col) cells.push(" ");
    const now = cells[col].split(",").map((s) => s.trim()).filter(Boolean);
    if (!now.includes(qn)) now.push(qn);
    cells[col] = ` ${now.join(", ")} `;
    lines[j] = `|${cells.join("|")}|`;
    done++;
  }
  if (done !== ids.size) return { problem: `found ${done} of ${ids.size} rows to mark` };
  return { text: lines.join("\n") };
}

function withChangeLog(text, line) {
  const lines = text.replace(/\n+$/, "").split("\n");
  const h = lines.findIndex((l) => /^##\s+change log/i.test(l));
  if (h < 0) lines.push("", "## Change log", "", line);
  else {
    let end = h + 1;
    while (end < lines.length && !/^##\s/.test(lines[end])) end++;
    while (end > h + 1 && !lines[end - 1].trim()) end--;
    lines.splice(end, 0, line);
  }
  return lines.join("\n") + "\n";
}

// ---- master markdown ----

function itemHead(it) {
  return [it.id, it.askTo ? `For: ${it.askTo}` : null, it.askedIn.length ? `asked before (${it.askedIn.join(", ")})` : null]
    .filter(Boolean).join(" · ");
}

const replyLine = (it) => (it.suggested ? "Reply: Yes / Edit: ___ / Don't know" : "Reply: Answer: ___ / Don't know");

function masterText(h, sections) {
  const n = sections.reduce((a, s) => a + s.items.length, 0);
  const out = [
    `# Questionnaire ${h.id}`, "",
    `To: ${h.to}${h.role ? ` (${h.role})` : ""}`,
    ...(h.from ? [`From: ${h.from}, Neomenta`] : []),
    `Enterprise: ${h.enterprise}`,
    `Engagement: ${h.engagement} (${h.slug})`,
    `Date: ${h.date}`,
    `Modules: ${h.modules}`,
    `Items: ${n}`,
  ];
  for (const s of sections) {
    out.push("", `## ${s.key} — ${s.name}`);
    for (const it of s.items) {
      out.push("", `### ${itemHead(it)}`, it.question);
      if (it.suggested) out.push(`Suggested: ${it.suggested}`);
      out.push(replyLine(it));
    }
  }
  return out.join("\n") + "\n";
}

// Reads a master back: { head, sections: [{key, name, items: [{id, askTo, askedIn, question, suggested}]}] } or errors.
export function readMaster(text, id) {
  const errors = [];
  const bad = (msg) => errors.push({ cls: "questionnaire", msg: `${id}.md: ${msg}` });
  const lines = text.split(/\r?\n/);
  const h1 = lines.find((l) => /^#\s/.test(l)) ?? "";
  const m1 = h1.match(/^#\s+Questionnaire\s+(\S+)\s*$/);
  if (!m1) bad("needs a `# Questionnaire <QN-id>` heading");
  else if (m1[1] !== id) bad(`heading names ${m1[1]}, file is ${id}`);
  const head = { id };
  const sections = [];
  let sec = null;
  let item = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /^#\s/.test(line)) continue;
    let m;
    if ((m = line.match(/^##\s+(.+?)\s+—\s+(.+)$/)) && !line.startsWith("###")) {
      sec = { key: m[1].trim(), name: m[2].trim(), items: [] };
      sections.push(sec);
      item = null;
    } else if (line.startsWith("###")) {
      if (!sec) { bad(`item before any \`## <Module> — <name>\` section: ${line}`); continue; }
      const parts = line.replace(/^###\s+/, "").split(" · ").map((s) => s.trim());
      item = { id: parts[0], askTo: "", askedIn: [], question: "", suggested: "" };
      if (!/^OI-\d{2,3}$/.test(item.id)) bad(`item heading must start with an Open Item ID: ${line}`);
      for (const p of parts.slice(1)) {
        let q;
        if ((q = p.match(/^For:\s*(.+)$/))) item.askTo = q[1].trim();
        else if ((q = p.match(/^asked before \((.+)\)$/))) item.askedIn = q[1].split(",").map((s) => s.trim());
        else bad(`${item.id}: unknown part "${p}" in item heading`);
      }
      sec.items.push(item);
    } else if (/^##\s/.test(line)) {
      bad(`section heading must be \`## <Module> — <name>\`: ${line}`);
    } else if (item) {
      if (/^Suggested:/.test(line)) item.suggested = line.replace(/^Suggested:\s*/, "");
      else if (/^Reply:/.test(line)) continue;
      else if (!item.question) item.question = line;
      else bad(`${item.id}: question must be one line`);
    } else if (!sec && (m = line.match(/^([A-Za-z]+):\s*(.*)$/))) {
      head[m[1].toLowerCase()] = m[2].trim();
    } else {
      bad(`unexpected line: ${line}`);
    }
  }
  if (!head.to) bad("needs a `To: <name>` line (one named contact)");
  const items = sections.flatMap((s) => s.items);
  if (!items.length) bad("no items");
  for (const s of sections) if (!s.items.length) bad(`section ${s.key} has no items`);
  for (const it of items) if (!it.question) bad(`${it.id}: no question`);
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.id)) bad(`${it.id} appears twice`);
    seen.add(it.id);
  }
  if (head.items !== undefined && Number(head.items) !== items.length) bad(`Items: ${head.items} but ${items.length} item(s) listed`);
  return { head, sections, errors };
}

// ---- export-questionnaire ----

export function exportQuestionnaire(args) {
  const { pos, problem } = parse(args, []);
  if (problem) return usage(problem, EXPORT_USE);
  const [dirArg, idArg] = pos;
  if (!dirArg || !idArg || pos.length > 2) return usage("export-questionnaire: needs <engagement-dir> and <QN-id>", EXPORT_USE);
  const id = idArg.replace(/\.md$/, "");
  if (!QN_ID.test(id)) return usage(`export-questionnaire: "${idArg}" is not a QN id like QN-2026-10-29`, EXPORT_USE);
  const dir = resolve(dirArg);
  if (!existsSync(join(dir, "_agent"))) return usage(`export-questionnaire: ${dirArg} is not an Engagement folder (no _agent/)`, EXPORT_USE);
  const master = join(dir, "_agent", "questionnaires", `${id}.md`);
  if (!existsSync(master)) return refuse([{ cls: "questionnaire", msg: `${master} missing (new-questionnaire writes it)` }]);

  const q = readMaster(readFileSync(master, "utf8"), id);
  if (q.errors.length) {
    refuse(q.errors);
    console.error(`export-questionnaire: ${q.errors.length} error(s); nothing written`);
    return 1;
  }
  const out = join(dir, "questionnaires");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${id}.html`), renderQuestionnaireHtml(q));
  writeFileSync(join(out, `${id}.txt`), renderQuestionnaireTxt(q));
  const n = q.sections.reduce((a, s) => a + s.items.length, 0);
  console.log(`export-questionnaire: wrote ${join(out, `${id}.html`)} and .txt (${n} item(s), ${q.sections.length} section(s))`);
  return 0;
}
