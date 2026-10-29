// Questionnaire reply loop helpers (ticket 36, used by the ingest skill). The skill reads the reply and
// agrees the match list with the Consultant; these make the register and Requirement edits the same every time.
//   reply items   <engagement-dir> --source QA-n
//   reply close   <engagement-dir> OI-NN --source QA-n (--yes | --answer "<text>")
//   reply note    <engagement-dir> OI-NN --source QA-n --note "<text>"
//   reply new-oi  <engagement-dir> --source QA-n --question "<q>" --modules "QUO, All" --owner Enterprise|Neomenta [--ask-to "<role>"] [--suggested "<text>"]
//   reply confirm <engagement-dir> <REQ-ID>... --source QA-n
// --source must be a registered QA-n Source of this Engagement whose register notes name the Questionnaire(s)
// it answers (`reply to QN-…`); each named master `_agent/questionnaires/<QN>.md` must exist and read cleanly.
// items is read-only: the match-list skeleton (item number as in the sent TXT/HTML, OI, where a Yes / an Edit lands).
// close: status closed, answer (Yes = the master's suggested text), answer Source; prints every line still naming the OI.
// note: Open Item stays open; `<text> [QA-n]` added to its note cell. new-oi: next free OI-NN, raised in QA-n.
// confirm: Requirement(s) agreed: `(proposed, to confirm)` marks dropped, QA-n cited, `Proposed: no`.
// Bad arguments exit 2; a refused change exits 1. Nothing is written then.
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, basename, relative, sep } from "node:path";
import { tables, column, list, normHeader, frontMatter, sections } from "./markdown.mjs";
import { parse, usage } from "./ingest.mjs";
import { readMaster } from "./questionnaire.mjs";

const OI = /^OI-\d{2,3}$/;
const REQ = /^(?:GEN|[A-Z]{2,5})-\d{2,3}$/;
const QN = /QN-\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+)?/g;
const MARK = /\s*\(?proposed(?:\s+by\s+neomenta)?,\s*to\s+confirm\)?/gi;
const ENGAGEMENT_OI = /^Confirm the proposed priority, Scope tag and acceptance criteria of:\s*(.+)$/i;
const USE = [
  "reply items <engagement-dir> --source QA-n",
  'reply close <engagement-dir> OI-NN --source QA-n (--yes | --answer "<text>")',
  'reply note <engagement-dir> OI-NN --source QA-n --note "<text>"',
  'reply new-oi <engagement-dir> --source QA-n --question "<q>" --modules "QUO, All" --owner Enterprise|Neomenta [--ask-to "<role>"] [--suggested "<text>"]',
  "reply confirm <engagement-dir> <REQ-ID>... --source QA-n",
].join("\n       ");

const ACTIONS = { items, close, note, "new-oi": newOi, confirm };

export function reply(args) {
  const [action, ...rest] = args;
  if (!ACTIONS[action]) return usage(`reply: unknown action "${action ?? "(none)"}"`, USE);
  const { pos, opts, problem } = parse(rest, ["source", "answer", "note", "question", "modules", "owner", "ask-to", "suggested"], ["yes"]);
  if (problem) return usage(problem, USE);
  const [engArg, ...names] = pos;
  const eng = resolve(engArg ?? "");
  if (!engArg || !existsSync(join(eng, "_agent", "open-items.md"))) {
    return usage(`reply ${action}: ${engArg ?? "(none)"} is not an Engagement folder (no _agent/open-items.md)`, USE);
  }
  if (!opts.source) return usage(`reply ${action}: needs --source QA-n (the registered reply)`, USE);
  const ctx = { eng, agent: join(eng, "_agent"), ent: resolve(eng, "..", ".."), slug: basename(eng), names, opts, files: new Map(), log: [] };
  const src = replySource(ctx, opts.source);
  if (src.problem) return refuse(src.problem);
  ctx.source = opts.source;
  ctx.qns = src.qns;
  const code = ACTIONS[action](ctx);
  if (code !== 0) return code;
  for (const [p, t] of ctx.files) writeFileSync(p, t.replace(/\n*$/, "\n"));
  for (const l of ctx.log) console.log(l);
  return 0;
}

const refuse = (msg) => {
  console.error(msg);
  return 1;
};

// ---- the reply Source and its Questionnaire(s) ----

function replySource(ctx, id) {
  if (!/^QA-\d+$/.test(id)) return { problem: `reply: --source ${id} is not a QA-n Source (a Questionnaire reply is registered with add-source --prefix QA)` };
  const regPath = join(ctx.ent, "_agent", "sources.md");
  const t = existsSync(regPath) ? tables(readFileSync(regPath, "utf8")).find((x) => column(x, "id") && column(x, "title")) : null;
  const row = t?.rows.find((r) => r[column(t, "id")] === id);
  if (!row) return { problem: `reply: Source ${id} is not in the Source register (add-source it first)` };
  const engs = list(row[column(t, "engagement")] ?? "");
  if (!engs.includes(ctx.slug)) return { problem: `reply: Source ${id} is not registered for Engagement ${ctx.slug} (engagement(s): ${engs.join(", ") || "none"})` };
  const qnIds = [...new Set(String(row[column(t, "notes")] ?? "").match(QN) ?? [])];
  if (!qnIds.length) return { problem: `reply: Source ${id} notes name no Questionnaire (register it with --notes "reply to QN-…")` };
  const qns = [];
  for (const q of qnIds) {
    const p = join(ctx.agent, "questionnaires", `${q}.md`);
    if (!existsSync(p)) return { problem: `reply: ${id} answers ${q}, but _agent/questionnaires/${q}.md is missing` };
    const m = readMaster(readFileSync(p, "utf8"), q);
    if (m.errors.length) return { problem: m.errors.map((e) => `error [${e.cls}] ${e.msg}`).join("\n") };
    qns.push(m);
  }
  return { qns };
}

// The item an OI was sent as (last Questionnaire that has it wins).
function sentItem(ctx, oi) {
  let found = null;
  for (const q of ctx.qns) for (const s of q.sections) for (const it of s.items) if (it.id === oi) found = { qn: q.head.id, it };
  return found;
}

// ---- Open Items register ----

const rawCells = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);
const cellText = (s) => String(s ?? "").replace(/\\\|/g, "|").trim();
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const rowLine = (cells) => `|${cells.map((c) => (cellText(c) ? ` ${String(c).trim()} ` : " ")).join("|")}|`;

function readRegister(ctx) {
  const path = join(ctx.agent, "open-items.md");
  const text = ctx.files.get(path) ?? readFileSync(path, "utf8");
  const lines = text.split("\n");
  const h = lines.findIndex((l, i) => l.trim().startsWith("|") && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? "")
    && rawCells(l).map(normHeader).includes("question"));
  if (h < 0) return { problem: "reply: open-items.md has no register table" };
  let end = h + 2;
  while (end < lines.length && lines[end].trim().startsWith("|")) end++;
  const reg = { path, lines, h, end, heads: rawCells(lines[h]).map(normHeader) };
  for (const need of ["id", "question", "module", "owner", "status"]) {
    if (col(reg, need) < 0) return { problem: `reply: open-items.md register has no "${need}" column` };
  }
  return reg;
}

const col = (reg, name) => reg.heads.findIndex((h) => h === name || h.startsWith(name));
const rowIndex = (reg, id) => {
  for (let j = reg.h + 2; j < reg.end; j++) if (cellText(rawCells(reg.lines[j])[col(reg, "id")]) === id) return j;
  return -1;
};
const getCell = (reg, j, name) => (col(reg, name) < 0 ? "" : cellText(rawCells(reg.lines[j])[col(reg, name)]));

function oiRow(reg, j) {
  return {
    id: getCell(reg, j, "id"), question: getCell(reg, j, "question"), modules: list(getCell(reg, j, "module")),
    owner: getCell(reg, j, "owner"), status: getCell(reg, j, "status").toLowerCase(), answerSource: getCell(reg, j, "answer source"),
  };
}

// Adds an optional column (empty in every row) before `before`, else at the end. Returns its index.
function ensureColumn(reg, name, before) {
  const have = reg.heads.indexOf(name);
  if (have >= 0) return have;
  const b = before ? reg.heads.indexOf(before) : -1;
  const at = b >= 0 ? b : reg.heads.length;
  for (let j = reg.h; j < reg.end; j++) {
    const cells = rawCells(reg.lines[j]);
    while (cells.length < reg.heads.length) cells.push(" ");
    cells.splice(at, 0, j === reg.h ? ` ${name} ` : j === reg.h + 1 ? "---" : " ");
    reg.lines[j] = j === reg.h + 1 ? `|${cells.map((c) => c.trim() || "---").join("|")}|` : rowLine(cells);
  }
  reg.heads.splice(at, 0, name);
  return at;
}

function setCells(reg, j, values) {
  const cells = rawCells(reg.lines[j]);
  while (cells.length < reg.heads.length) cells.push(" ");
  for (const [name, v] of Object.entries(values)) cells[reg.heads.indexOf(name)] = cell(v);
  reg.lines[j] = rowLine(cells);
}

const putRegister = (ctx, reg) => ctx.files.set(reg.path, reg.lines.join("\n"));

function openRow(ctx, reg, id, action) {
  if (!OI.test(id ?? "")) return { code: usage(`reply ${action}: needs one Open Item ID (OI-NN)`, USE) };
  const j = rowIndex(reg, id);
  if (j < 0) return { code: refuse(`reply ${action}: ${id} is not in open-items.md`) };
  const oi = oiRow(reg, j);
  if (oi.status !== "open") return { code: refuse(`reply ${action}: ${id} is ${oi.status}${oi.answerSource ? ` (answer Source ${oi.answerSource})` : ""}; a new answer to it is new info: raise a new Open Item or a revisit`) };
  return { j, oi };
}

// ---- Modules ----

function readModules(agent) {
  const dir = join(agent, "modules");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => {
    const ticket = join(dir, d.name, "ticket.md");
    if (!existsSync(ticket)) return null;
    let fm = {};
    try { fm = frontMatter(readFileSync(ticket, "utf8")).fm ?? {}; } catch { fm = {}; }
    const spec = join(dir, d.name, "spec.md");
    return {
      folder: d.name, prefix: String(fm.prefix ?? ""), formerly: String(fm.formerly ?? ""), status: String(fm.status ?? ""),
      draft: fm.draft === true, claimedBy: String(fm.claimedBy ?? ""), doc: existsSync(spec) ? spec : ticket,
    };
  }).filter(Boolean);
}

// Follows merged-into to the live Module.
function liveModule(mods, prefix, seen = new Set()) {
  const m = mods.find((x) => x.prefix === prefix) ?? mods.find((x) => x.formerly === prefix && !/^merged-into/.test(x.status));
  if (!m || seen.has(m.prefix)) return m ?? null;
  const into = m.status.match(/^merged-into[\s:]+([A-Z]{2,5})$/);
  if (!into) return m;
  seen.add(m.prefix);
  return liveModule(mods, into[1], seen);
}

// Where a Yes and an Edit to an Open Item land, per the reply rules (reply-loop.md).
function landing(ctx, mods, oi) {
  const eoi = oi.question.match(ENGAGEMENT_OI);
  if (eoi) {
    const ids = eoi[1].match(/\b(?:GEN|[A-Z]{2,5})-\d{2,3}\b/g) ?? [];
    const edit = [...new Set(ids.map((id) => {
      if (id.startsWith("GEN-")) return "GEN: general.md";
      const m = liveModule(mods, id.split("-")[0]);
      return m ? moduleRule(m, "edit") : `${id}: no Module`;
    }))];
    return { yes: `reply confirm ${ids.join(" ")}`, edit: `confirm accepted IDs; rest: ${edit.join("; ")}` };
  }
  const parts = { yes: [], edit: [] };
  for (const p of oi.modules) {
    if (p === "All") {
      const home = `general.md ${generalHome(ctx, oi.id)}`;
      parts.yes.push(home);
      parts.edit.push(home);
      continue;
    }
    const m = liveModule(mods, p);
    if (!m) { parts.yes.push(`${p}: no Module`); parts.edit.push(`${p}: no Module`); continue; }
    parts.yes.push(moduleRule(m, "yes"));
    parts.edit.push(moduleRule(m, "edit"));
  }
  return { yes: parts.yes.join("; "), edit: parts.edit.join("; ") };
}

function moduleRule(m, kind) {
  const doc = basename(m.doc);
  if (m.status === "claimed") return `${m.prefix} claimed by ${m.claimedBy}: hold (register + map Note)`;
  if (m.draft || m.status === "open") return `${m.prefix} ${m.draft ? "draft" : "open"}: write ${doc}`;
  if (m.status === "resolved" || m.status === "needs-revisit") {
    return kind === "yes" ? `${m.prefix} ${m.status}: ${doc} in place, no revisit` : `${m.prefix}: module revisit`;
  }
  return `${m.prefix} ${m.status}: ask the Consultant`;
}

// The general.md topic (and GEN Requirement) that names the Open Item.
function generalHome(ctx, id) {
  const p = join(ctx.agent, "general.md");
  if (!existsSync(p)) return "(no general.md)";
  const re = new RegExp(`\\b${id}\\b`);
  for (const { title, body } of sections(readFileSync(p, "utf8"), 2)) {
    if (!re.test(body)) continue;
    const gens = sections(body, 3).filter((s) => re.test(s.body)).map((s) => s.title.match(/^(GEN-\d+)/)?.[1]).filter(Boolean);
    return `${title}${gens.length ? ` (${gens.join(", ")})` : " (topic bullet)"}`;
  }
  return "(not named; pick the topic)";
}

// ---- actions ----

function items(ctx) {
  if (ctx.names.length) return usage("reply items: takes only <engagement-dir> --source QA-n", USE);
  const reg = readRegister(ctx);
  if (reg.problem) return refuse(reg.problem);
  const mods = readModules(ctx.agent);
  for (const q of ctx.qns) {
    const all = q.sections.flatMap((s) => s.items);
    ctx.log.push(`qn | ${q.head.id} | to ${q.head.to} | ${all.length} item(s)`);
    all.forEach((it, i) => {
      const j = rowIndex(reg, it.id);
      if (j < 0) { ctx.log.push(`item | ${i + 1} | ${it.id} | missing from open-items.md | ask the Consultant`); return; }
      const oi = oiRow(reg, j);
      const head = `item | ${i + 1} | ${it.id} | ${oi.modules.join(", ")}`;
      if (oi.status !== "open") {
        ctx.log.push(`${head} | ${oi.status}${oi.answerSource ? ` by ${oi.answerSource}` : ""} | already answered: new info → new Open Item or revisit`);
        return;
      }
      const l = landing(ctx, mods, oi);
      ctx.log.push(`${head} | open | yes: ${it.suggested ? l.yes : "n/a (no suggested; any answer is an edit)"} | edit: ${l.edit} | suggested: ${it.suggested || "(none)"}`);
    });
  }
  ctx.log.push(`reply items: ${ctx.source}; read-only. Don't know / no answer → reply note; new question → reply new-oi`);
  return 0;
}

function close(ctx) {
  const { opts } = ctx;
  if (Boolean(opts.yes) === Boolean(opts.answer?.trim())) return usage("reply close: give --yes (accept the suggested answer) or --answer \"<text>\", not both", USE);
  const reg = readRegister(ctx);
  if (reg.problem) return refuse(reg.problem);
  const id = ctx.names[0];
  if (ctx.names.length > 1) return usage("reply close: one Open Item at a time", USE);
  const { j, code } = openRow(ctx, reg, id, "close");
  if (code !== undefined) return code;
  let answer = opts.answer?.trim();
  if (opts.yes) {
    const sent = sentItem(ctx, id);
    if (!sent) return refuse(`reply close: ${id} is not in ${ctx.qns.map((q) => q.head.id).join(", ")}; a Yes needs the item it answers`);
    if (!sent.it.suggested) return refuse(`reply close: ${id} went out with no suggested answer (${sent.qn}); use --answer "<what they said>"`);
    answer = sent.it.suggested;
  }
  ensureColumn(reg, "answer", "answer source");
  ensureColumn(reg, "answer source");
  setCells(reg, j, { status: "closed", answer, "answer source": ctx.source });
  putRegister(ctx, reg);
  ctx.log.push(`closed: ${id} — ${answer} [${ctx.source}]`);
  dropRefs(ctx, id);
  for (const l of namedLines(ctx, id)) ctx.log.push(l);
  for (const l of disputedTerms(ctx, id)) ctx.log.push(l);
  return 0;
}

function note(ctx) {
  const text = (ctx.opts.note ?? "").trim();
  if (!text) return usage('reply note: needs --note "<text>" (e.g. Don\'t know; no answer)', USE);
  if (ctx.names.length !== 1) return usage("reply note: one Open Item at a time", USE);
  const reg = readRegister(ctx);
  if (reg.problem) return refuse(reg.problem);
  const { j, code } = openRow(ctx, reg, ctx.names[0], "note");
  if (code !== undefined) return code;
  ensureColumn(reg, "note");
  const add = `${text} [${ctx.source}]`;
  const now = getCell(reg, j, "note");
  if (!now.includes(add)) setCells(reg, j, { note: now ? `${now}; ${add}` : add });
  putRegister(ctx, reg);
  ctx.log.push(`noted: ${ctx.names[0]} stays open — ${add}`);
  return 0;
}

function newOi(ctx) {
  const { opts } = ctx;
  if (ctx.names.length) return usage("reply new-oi: takes no positional IDs", USE);
  const question = (opts.question ?? "").replace(/\s+/g, " ").trim();
  if (!question) return usage('reply new-oi: needs --question "<one line>"', USE);
  const owner = { enterprise: "Enterprise", neomenta: "Neomenta" }[(opts.owner ?? "").trim().toLowerCase()];
  if (!owner) return usage("reply new-oi: --owner Enterprise or Neomenta", USE);
  const mods = list(opts.modules ?? "");
  if (!mods.length) return usage('reply new-oi: needs --modules "QUO" (prefixes or All)', USE);
  const live = readModules(ctx.agent).filter((m) => !/^merged-into/.test(m.status)).map((m) => m.prefix);
  const unknown = mods.filter((p) => p !== "All" && !live.includes(p));
  if (unknown.length) return refuse(`reply new-oi: no live Module ${unknown.join(", ")} (known: All, ${live.join(", ")})`);
  const reg = readRegister(ctx);
  if (reg.problem) return refuse(reg.problem);
  let max = 0;
  for (let j = reg.h + 2; j < reg.end; j++) {
    const m = getCell(reg, j, "id").match(/^OI-(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  const n = max + 1;
  const id = `OI-${String(n).padStart(n > 99 ? 3 : 2, "0")}`;
  ensureColumn(reg, "raised in");
  const values = {
    id, question, owner, status: "open", "raised in": ctx.source,
    "ask to": (opts["ask-to"] ?? "").trim(), suggested: (opts.suggested ?? "").trim(),
  };
  const cells = reg.heads.map((h) => {
    if (h.startsWith("module")) return cell(mods.join(", "));
    const k = Object.keys(values).find((x) => h === x);
    return k ? cell(values[k]) : "";
  });
  if (col(reg, "ask to") < 0 && values["ask to"]) return refuse('reply new-oi: open-items.md has no "ask to" column');
  if (col(reg, "suggested") < 0 && values.suggested) return refuse('reply new-oi: open-items.md has no "suggested" column');
  reg.lines.splice(reg.end, 0, rowLine(cells));
  reg.end++;
  putRegister(ctx, reg);
  ctx.log.push(`id: ${id}`, `raised: ${id} — ${question} (${mods.join(", ")}, ${owner}) [${ctx.source}]`);
  ctx.log.push(`name it where it bites: a Requirement's OIs: line and ## 13 Open Items, or a general.md topic bullet`);
  return 0;
}

function confirm(ctx) {
  const ids = ctx.names;
  if (!ids.length) return usage("reply confirm: needs one or more Requirement IDs", USE);
  const bad = ids.filter((id) => !REQ.test(id));
  if (bad.length) return usage(`reply confirm: not a Requirement ID: ${bad.join(", ")}`, USE);
  const mods = readModules(ctx.agent);
  const docText = (p) => ctx.files.get(p) ?? readFileSync(p, "utf8");
  const plan = [];
  for (const id of ids) {
    let path;
    if (id.startsWith("GEN-")) path = join(ctx.agent, "general.md");
    else {
      const m = liveModule(mods, id.split("-")[0]);
      if (!m) return refuse(`reply confirm: no Module for ${id}`);
      if (m.status === "claimed") return refuse(`reply confirm: ${id} is in ${m.prefix}, claimed by ${m.claimedBy}; hold it (map Note for them), nothing written`);
      // A merged/moved Requirement's old block is withdrawn; its live copy has another ID.
      path = [m.doc, ...mods.filter((x) => x !== m && x.prefix === id.split("-")[0]).map((x) => x.doc)].find((p) => blockRange(docText(p).split("\n"), id));
      path ??= m.doc;
    }
    if (!existsSync(path)) return refuse(`reply confirm: ${relative(ctx.eng, path)} missing`);
    const lines = docText(path).split("\n");
    const r = blockRange(lines, id);
    if (!r) return refuse(`reply confirm: no "### ${id}" block in ${rel(ctx, path)}`);
    const block = lines.slice(r.start, r.end);
    if (block.some((l) => /^\s*\**withdrawn\**:\s*\S/i.test(l))) return refuse(`reply confirm: ${id} is withdrawn`);
    const out = agreeBlock(block, ctx.source);
    if (out.join("\n") === block.join("\n")) { plan.push({ id, path, skip: true }); continue; }
    lines.splice(r.start, r.end - r.start, ...out);
    let t = lines.join("\n");
    if (basename(path) === "spec.md") t = headerSource(t, ctx.source);
    ctx.files.set(path, t);
    plan.push({ id, path, tbc: out.some((l) => /^\s*\**priority\**:\s*tbc\b/i.test(l)) });
  }
  for (const p of plan) {
    if (p.skip) ctx.log.push(`already agreed: ${p.id} (${rel(ctx, p.path)}); nothing to change`);
    else ctx.log.push(`confirmed: ${p.id} (${rel(ctx, p.path)}) Proposed: no, cites ${ctx.source}${p.tbc ? "; warning: priority still TBC" : ""}`);
  }
  return 0;
}

const rel = (ctx, p) => relative(ctx.eng, p).split(sep).join("/");

function blockRange(lines, id) {
  const start = lines.findIndex((l) => new RegExp(`^###\\s+${id}\\b`).test(l));
  if (start < 0) return null;
  let end = start + 1;
  while (end < lines.length && !/^#{1,3}\s/.test(lines[end])) end++;
  while (end > start + 1 && !lines[end - 1].trim()) end--;
  return { start, end };
}

const KEY = /^\s*(?:[-*]\s+)?\**([A-Za-z ]+?)\**:\s*(.*)$/;
const CITE_END = /\[([A-Z]{2,4}(?:-\d+)?(?:\s*,\s*[A-Z]{2,4}(?:-\d+)?)*)\](\s*\.?\s*)$/;

// One Requirement block, agreed: marks dropped, QA-n cited where a mark stood (statement, acceptance),
// added to Sources, Proposed: no.
function agreeBlock(block, src) {
  let key = null;
  let sawProposed = false;
  const out = block.map((line, i) => {
    if (i === 0) return line.replace(MARK, "");
    const m = line.match(KEY);
    const k = m ? m[1].trim().toLowerCase() : null;
    if (m && ["statement", "acceptance", "acceptance criteria", "priority", "scope", "scope tag", "sources", "source", "ois", "oi", "open items", "proposed", "delivery", "withdrawn"].includes(k)) key = k;
    if (m && (k === "sources" || k === "source")) {
      const ids = list(m[2].replace(MARK, ""));
      if (!ids.includes(src)) ids.push(src);
      return line.slice(0, line.indexOf(":") + 1) + ` ${ids.join(", ")}`;
    }
    if (m && k === "proposed") { sawProposed = true; return line.slice(0, line.indexOf(":") + 1) + " no"; }
    MARK.lastIndex = 0;
    if (!MARK.test(line)) return line;
    MARK.lastIndex = 0;
    const clean = line.replace(MARK, "").replace(/\s+$/, "");
    if (!["statement", "acceptance", "acceptance criteria"].includes(key)) return clean;
    const c = clean.match(CITE_END);
    if (c) {
      const have = c[1].split(",").map((s) => s.trim());
      return have.includes(src) ? clean : clean.replace(CITE_END, `[${[...have, src].join(", ")}]$2`).replace(/\s+$/, "");
    }
    return `${clean} [${src}]`;
  });
  if (!sawProposed) out.push("Proposed: no");
  return out;
}

// spec.md header `Sources:` lists every cited Source (spec-check).
function headerSource(text, src) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length && !/^##\s/.test(lines[i]); i++) {
    const m = lines[i].match(/^(\s*Sources:\s*)(.*)$/);
    if (!m) continue;
    const ids = list(m[2]);
    if (!ids.includes(src)) lines[i] = `${m[1]}${[...ids, src].join(", ")}`;
    return lines.join("\n");
  }
  return text;
}

// A closed Open Item leaves `## 13 Open Items` (ticket and spec) and prototype-data.json "oi" of every Module
// not claimed (a claimed Module's files belong to its holder). An emptied section 13 says N/A.
function dropRefs(ctx, id) {
  const read = (p) => ctx.files.get(p) ?? readFileSync(p, "utf8");
  const views = new Set();
  for (const m of readModules(ctx.agent)) {
    const dir = join(ctx.agent, "modules", m.folder);
    if (m.status === "claimed") {
      const names = ["ticket.md", "spec.md", "prototype-data.json"].map((x) => join(dir, x)).filter(existsSync).some((f) => new RegExp(`\\b${id}\\b`).test(read(f)));
      if (names) ctx.log.push(`hold: ${m.prefix} is claimed by ${m.claimedBy}; its files are theirs (map Note for them)`);
      continue;
    }
    for (const f of ["ticket.md", "spec.md"].map((x) => join(dir, x)).filter(existsSync)) {
      const lines = read(f).split("\n");
      const s = lines.findIndex((l) => /^##\s+(13\b|open items\b)/i.test(l));
      if (s < 0) continue;
      let e = s + 1;
      while (e < lines.length && !/^#{1,2}\s/.test(lines[e])) e++;
      const body = lines.slice(s + 1, e);
      const kept = body.filter((l) => !new RegExp(`^[-*]\\s+${id}\\b`).test(l.trim()));
      if (kept.length === body.length) continue;
      if (!kept.some((l) => l.trim())) kept.splice(0, kept.length, "", "N/A: no open Open Items.", ...(e < lines.length ? [""] : []));
      lines.splice(s + 1, e - s - 1, ...kept);
      ctx.files.set(f, lines.join("\n"));
      ctx.log.push(`dropped: ${id} from ${rel(ctx, f)} section 13`);
    }
    const pd = join(dir, "prototype-data.json");
    if (!existsSync(pd)) continue;
    const before = read(pd);
    const after = before
      .replace(new RegExp(`,\\s*"oi":\\s*"${id}"`, "g"), "")
      .replace(new RegExp(`"oi":\\s*"${id}",\\s*`, "g"), "");
    if (after === before) continue;
    try { JSON.parse(after); } catch { continue; } // left as a drop line for the agent
    ctx.files.set(pd, after);
    ctx.log.push(`dropped: ${id} from ${rel(ctx, pd)}`);
    if (existsSync(join(ctx.eng, "prototypes", `${m.folder}.html`))) views.add(m.prefix);
  }
  for (const p of views) ctx.log.push(`rebuild: ENGINE build-prototype <eng> ${p} (its Prototype view still shows ${id})`);
}

// Every line outside the register, Questionnaires and BRD files that still names the Open Item:
// keep = a Requirement's OIs: line (closed ones stay there); drop = `## 13 Open Items` bullet or a
// prototype-data.json "oi"; rewrite = anything else (the fact goes there, or the OI cell empties).
function namedLines(ctx, id) {
  const re = new RegExp(`\\b${id}\\b`);
  const files = ["general.md", "process.md", "plan.md"].map((f) => join(ctx.agent, f));
  const modDir = join(ctx.agent, "modules");
  if (existsSync(modDir)) {
    for (const d of readdirSync(modDir, { withFileTypes: true }).filter((x) => x.isDirectory())) {
      for (const f of ["ticket.md", "spec.md", "prototype-data.json"]) files.push(join(modDir, d.name, f));
    }
  }
  const out = [];
  for (const p of files.filter(existsSync)) {
    let h2 = "";
    (ctx.files.get(p) ?? readFileSync(p, "utf8")).split("\n").forEach((line, i) => {
      if (/^##\s/.test(line)) h2 = line;
      if (!re.test(line)) return;
      let tag = "rewrite";
      if (p.endsWith(".json")) tag = new RegExp(`"oi":\\s*"${id}"`).test(line) ? "drop" : "rewrite";
      else if (/^\s*\**(ois|open items)\**:/i.test(line)) tag = "keep";
      else if (/^##\s+13\b/.test(h2) && /^[-*]\s/.test(line.trim())) tag = "drop";
      out.push(`named: ${tag} | ${rel(ctx, p)}:${i + 1} | ${line.trim()}`);
    });
  }
  return out;
}

function disputedTerms(ctx, id) {
  const p = join(ctx.ent, "_agent", "GLOSSARY.md");
  if (!existsSync(p)) return [];
  const out = [];
  let term = null;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.match(/^\*\*(.+?)\*\*:\s*$/);
    if (t) term = t[1];
    if (term && /_Disputed_/.test(line) && line.includes(`${ctx.slug}/${id}`)) {
      out.push(`glossary: "${term}" is disputed by ${ctx.slug}/${id}; settle, split or rename it now (enterprise-glossary Settle) with --source ${ctx.source}`);
    }
  }
  return out;
}
