// Module set helpers (ticket 30, used by review-draft). The skill decides with the Consultant;
// these make ticket, folder, map and cross-reference edits the same every time.
//   module list    <engagement-dir>
//   module confirm <engagement-dir> <PREFIX> [--blocked-by "A, B"]
//   module rename  <engagement-dir> <PREFIX> [--to <NEW>] [--name "<Name>"]
//   module merge   <engagement-dir> <FROM> --into <TO>
//   module new     <engagement-dir> <PREFIX> --name "<Name>" [--after <PREFIX>]
//   module move    <engagement-dir> <REQ-ID>... --to <PREFIX>
// Claim and close (ticket 34, used by resolve-module; map-logic.md):
//   module frontier <engagement-dir>
//   module claim    <engagement-dir> <PREFIX> --who <name>
//   module release  <engagement-dir> <PREFIX> --who <name> [--force]
//   module close    <engagement-dir> <PREFIX> --who <name>
//   module revisit  <engagement-dir> <PREFIX> --reason "<what changed + Source>" [--skill <skill>]
// Requirements are edited in the Module's spec.md when it exists, else in ticket.md (same rule as build-brd).
// Requirement IDs are never reused or renumbered: a merged or moved Requirement gets the next free ID
// in the target Module and the old block stays, withdrawn with "Merged into X-NN" / "Moved to X-NN".
// A renamed Module's Prototype view (prototypes/<PREFIX>-<slug>.html) is renamed with its folder; a merged
// Module's view is removed. Both print a rebuild line for the build-prototype skill.
// Bad arguments exit 2; a refused change exits 1. Nothing is written then.
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { frontMatter, normHeader, sections } from "./markdown.mjs";
import { parse, usage, today, slugify } from "./ingest.mjs";
import { specCheck } from "./spec-check.mjs";

const PREFIX = /^[A-Z]{2,5}$/;
const REQ_ID = /^([A-Z]{2,5})-(\d{2,3})$/;
const USE = [
  "module list <engagement-dir>",
  'module confirm <engagement-dir> <PREFIX> [--blocked-by "A, B"]',
  'module rename <engagement-dir> <PREFIX> [--to <NEW>] [--name "<Name>"]',
  "module merge <engagement-dir> <FROM> --into <TO>",
  'module new <engagement-dir> <PREFIX> --name "<Name>" [--after <PREFIX>]',
  "module move <engagement-dir> <REQ-ID>... --to <PREFIX>",
  "module frontier <engagement-dir>",
  "module claim <engagement-dir> <PREFIX> --who <name>",
  "module release <engagement-dir> <PREFIX> --who <name> [--force]",
  "module close <engagement-dir> <PREFIX> --who <name>",
  'module revisit <engagement-dir> <PREFIX> --reason "<what changed + Source>" [--skill <skill>]',
  'module rename ... --who <name>   (rename a Module claimed by <name>)',
].join("\n       ");
const FM_ORDER = ["status", "prefix", "name", "draft", "blockedBy", "revisitReason", "formerly", "claimedBy"];

const ACTIONS = { list, confirm, rename, merge, new: create, move, frontier, claim, release, close, revisit };

export function modules(args) {
  const [action, ...rest] = args;
  if (!ACTIONS[action]) return usage(`module: unknown action "${action ?? "(none)"}"`, USE);
  const { pos, opts, problem } = parse(rest, ["blocked-by", "to", "name", "into", "after", "who", "reason", "skill"], ["force"]);
  if (problem) return usage(problem, USE);
  const [engArg, ...names] = pos;
  const agent = join(resolve(engArg ?? ""), "_agent");
  if (!engArg || !existsSync(join(agent, "map.md"))) {
    return usage(`module ${action}: ${engArg ?? "(none)"} is not an Engagement folder (no _agent/map.md)`, USE);
  }
  const ctx = { agent, names, opts, files: new Map(), log: [], mods: readAll(agent) };
  const code = ACTIONS[action](ctx);
  if (code !== 0) return code;
  // Everything checked: write.
  for (const [from, to] of ctx.renames ?? []) renameSync(from, to);
  for (const p of ctx.removes ?? []) rmSync(p);
  for (const [p, text] of ctx.files) {
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, p.endsWith(".md") ? text.replace(/\n*$/, "\n") : text);
  }
  for (const l of ctx.log) console.log(l);
  return 0;
}

const refuse = (msg) => {
  console.error(msg);
  return 1;
};

// ---- reading ----

const prototypeView = (ctx, folder) => join(ctx.agent, "..", "prototypes", `${folder}.html`);

function readAll(agent) {
  const dir = join(agent, "modules");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => {
    const path = join(dir, d.name, "ticket.md");
    if (!existsSync(path)) return null;
    const text = readFileSync(path, "utf8");
    let fm = {};
    try { fm = frontMatter(text).fm ?? {}; } catch { fm = {}; }
    const spec = join(dir, d.name, "spec.md");
    return {
      folder: d.name, dir: join(dir, d.name), ticket: path, fm, prefix: String(fm.prefix ?? ""),
      doc: existsSync(spec) ? spec : path,
    };
  }).filter(Boolean);
}

// Current text of a file, with edits made earlier in this run.
const text = (ctx, p) => ctx.files.get(p) ?? (existsSync(p) ? readFileSync(p, "utf8") : "");
const put = (ctx, p, t) => ctx.files.set(p, t);

const find = (ctx, prefix) => ctx.mods.find((m) => m.prefix === prefix) ?? null;
const merged = (m) => /^merged-into/.test(String(m.fm.status ?? ""));
const isDraft = (m) => m.fm.draft === true;

function needModule(ctx, prefix, action) {
  if (!prefix || !PREFIX.test(prefix)) return { code: usage(`module ${action}: needs a Module prefix like QUO`, USE) };
  const m = find(ctx, prefix);
  if (!m) return { code: refuse(`module ${action}: no Module ${prefix} in modules/`) };
  return { m };
}

// A new prefix must not clash with any prefix or former prefix (Requirement IDs keep old prefixes).
function prefixTaken(ctx, p) {
  return p === "GEN" || ctx.mods.some((m) => m.prefix === p || String(m.fm.formerly ?? "") === p)
    || mapRows(text(ctx, mapPath(ctx))).some((r) => r.prefix === p);
}

// ---- front-matter ----

function fmValue(v) {
  if (Array.isArray(v)) return ` [${v.join(", ")}]`;
  if (v === null || v === undefined || v === "") return "";
  const s = String(v);
  return /^[\w .\-/]+$/.test(s) && !/^\s|\s$/.test(s) ? ` ${s}` : ` ${JSON.stringify(s)}`;
}

function setFrontMatter(ctx, m, changes) {
  const t = text(ctx, m.ticket);
  const { body } = frontMatter(t);
  const fm = { ...m.fm, ...changes };
  for (const [k, v] of Object.entries(changes)) if (v === undefined) delete fm[k];
  const keys = [...FM_ORDER.filter((k) => k in fm), ...Object.keys(fm).filter((k) => !FM_ORDER.includes(k))];
  const head = keys.map((k) => `${k}:${fmValue(fm[k])}`).join("\n");
  put(ctx, m.ticket, `---\n${head}\n---\n${body.startsWith("\n") ? body : "\n" + body}`);
  m.fm = fm;
}

// Full front-matter of a confirmed ticket (map-logic.md).
const confirmedFm = (m, extra = {}) => ({
  status: m.fm.status ?? "open", prefix: m.prefix, name: m.fm.name ?? null, draft: undefined,
  blockedBy: m.fm.blockedBy ?? [], revisitReason: m.fm.revisitReason ?? null, formerly: m.fm.formerly ?? null,
  claimedBy: m.fm.claimedBy ?? null, ...extra,
});

// ---- map ----

const mapPath = (ctx) => join(ctx.agent, "map.md");

function mapRows(t) {
  const out = [];
  const lines = t.split("\n");
  let inModules = false;
  lines.forEach((l, i) => {
    if (/^##\s/.test(l)) inModules = /^##\s+modules\b/i.test(l);
    const m = inModules && l.match(/^\|\s*([A-Z]{2,5})\s*\|([^|]*)\|([^|]*)\|/);
    if (m) out.push({ line: i, prefix: m[1], name: m[2].trim(), status: m[3].trim() });
  });
  return out;
}

const row = (prefix, name, status) => `| ${prefix} | ${name} | ${status} |`;

function setMapRow(ctx, prefix, { to, name, status }) {
  const p = mapPath(ctx);
  const lines = text(ctx, p).split("\n");
  const r = mapRows(lines.join("\n")).find((x) => x.prefix === prefix);
  if (!r) return false;
  lines[r.line] = row(to ?? prefix, name ?? r.name, status ?? r.status);
  put(ctx, p, lines.join("\n"));
  return true;
}

function addMapRow(ctx, prefix, name, status, after) {
  const p = mapPath(ctx);
  const t = text(ctx, p);
  const rows = mapRows(t);
  const lines = t.split("\n");
  let at;
  const a = after && rows.find((r) => r.prefix === after);
  if (a) at = a.line + 1;
  else if (rows.length) at = rows[rows.length - 1].line + 1;
  else {
    const h = lines.findIndex((l) => /^\|\s*Prefix\s*\|/i.test(l));
    if (h < 0) return false;
    at = h + 2;
  }
  lines.splice(at, 0, row(prefix, name, status));
  put(ctx, p, lines.join("\n"));
  return true;
}

function changeLog(ctx, what) {
  const p = mapPath(ctx);
  const lines = text(ctx, p).replace(/\n+$/, "").split("\n");
  const h = lines.findIndex((l) => /^##\s+change log/i.test(l));
  const line = `- ${today()}: ${what}`;
  if (h < 0) lines.push("", "## Change log", "", line);
  else {
    let end = h + 1;
    while (end < lines.length && !/^##\s/.test(lines[end])) end++;
    while (end > h + 1 && !lines[end - 1].trim()) end--;
    lines.splice(end, 0, line);
  }
  put(ctx, p, lines.join("\n") + "\n");
}

// ---- prefix references in other files ----

// Rewrites the Module column(s) of every table in a file: list cells, OLD → NEW, deduped.
function rewriteTables(ctx, p, headerNames, fn) {
  if (!existsSync(p) && !ctx.files.has(p)) return 0;
  const lines = text(ctx, p).split("\n");
  let changed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith("|") || !/^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? "") || !(lines[i + 1] ?? "").includes("-")) continue;
    const split = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);
    const heads = split(lines[i]).map(normHeader);
    const cols = heads.map((h, k) => (headerNames.includes(h) ? k : -1)).filter((k) => k >= 0);
    let j = i + 2;
    for (; j < lines.length && lines[j].trim().startsWith("|"); j++) {
      if (!cols.length) continue;
      const cells = split(lines[j]);
      let touched = false;
      for (const k of cols) {
        const before = (cells[k] ?? "").trim();
        const after = fn(before);
        if (after !== before) { cells[k] = ` ${after} `; touched = true; }
      }
      if (touched) { lines[j] = `|${cells.join("|")}|`; changed++; }
    }
    i = j - 1;
  }
  if (changed) put(ctx, p, lines.join("\n"));
  return changed;
}

const swapList = (from, to) => (cell) => {
  const items = cell.split(",").map((s) => s.trim()).filter(Boolean);
  if (!items.includes(from)) return cell;
  return [...new Set(items.map((s) => (s === from ? to : s)))].join(", ");
};

// OI register, process steps, plan, other tickets' blockedBy / merged-into: FROM → TO.
function repoint(ctx, from, to, self) {
  const n = {
    "open-items.md": rewriteTables(ctx, join(ctx.agent, "open-items.md"), ["module", "modules"], swapList(from, to)),
    "process.md": rewriteTables(ctx, join(ctx.agent, "process.md"), ["module", "modules"], swapList(from, to)),
    "plan.md": rewriteTables(ctx, join(ctx.agent, "plan.md"), ["module", "modules"], swapList(from, to)),
  };
  for (const [f, c] of Object.entries(n)) if (c) ctx.log.push(`repointed ${from} → ${to}: ${f} (${c} row${c > 1 ? "s" : ""})`);
  for (const m of ctx.mods) {
    if (m === self) continue;
    const changes = {};
    const blocked = Array.isArray(m.fm.blockedBy) ? m.fm.blockedBy.map(String) : [];
    if (blocked.includes(from)) changes.blockedBy = [...new Set(blocked.map((b) => (b === from ? to : b)))].filter((b) => b !== m.prefix);
    if (String(m.fm.status ?? "") === `merged-into ${from}` || String(m.fm.status ?? "") === `merged-into:${from}`) {
      changes.status = `merged-into ${to}`;
      setMapRow(ctx, m.prefix, { status: `merged-into ${to}` });
    }
    if (Object.keys(changes).length) {
      setFrontMatter(ctx, m, changes);
      ctx.log.push(`repointed ${from} → ${to}: ${m.folder}/ticket.md`);
    }
  }
}

// ---- Requirement blocks in a Module doc ----

const SECTION = (n, name) => new RegExp(`^##\\s+(?:${n}[.)]?\\s+)?${name}\\b`, "i");

function sectionRange(lines, n, name) {
  const s = lines.findIndex((l) => SECTION(n, name).test(l));
  if (s < 0) return null;
  let e = s + 1;
  while (e < lines.length && !/^##\s/.test(lines[e])) e++;
  return { start: s, end: e };
}

function reqBlocks(lines) {
  const r = sectionRange(lines, 11, "requirements");
  if (!r) return [];
  const out = [];
  for (let i = r.start + 1; i < r.end; i++) {
    const h = lines[i].match(/^###\s+([A-Z]{2,5}-\d+)\b/);
    if (!h) continue;
    let e = i + 1;
    while (e < r.end && !/^###\s/.test(lines[e])) e++;
    const body = lines.slice(i, e);
    out.push({ id: h[1], start: i, end: e, lines: body, withdrawn: body.some((l) => /^\s*\**withdrawn\**:\s*\S/i.test(l)) });
  }
  return out;
}

// Next free Requirement number for a Module (its prefix and former prefix both count).
function nextId(lines, m, taken) {
  const own = [m.prefix, String(m.fm.formerly ?? "")].filter(Boolean);
  let max = 0;
  for (const b of reqBlocks(lines)) {
    const x = b.id.match(REQ_ID);
    if (x && own.includes(x[1])) max = Math.max(max, Number(x[2]));
  }
  for (const id of taken) max = Math.max(max, Number(id.match(REQ_ID)[2]));
  const n = max + 1;
  return `${m.prefix}-${String(n).padStart(n > 99 ? 3 : 2, "0")}`;
}

// Appends lines at the end of section n (made, in number order, when missing).
function appendToSection(lines, n, name, title, add) {
  let r = sectionRange(lines, n, name);
  if (!r) {
    let at = lines.length;
    for (let i = 0; i < lines.length; i++) {
      const h = lines[i].match(/^##\s+(\d+)/);
      if (h && Number(h[1]) > n) { at = i; break; }
    }
    while (at > 0 && !lines[at - 1].trim()) at--;
    lines.splice(at, 0, "", `## ${n} ${title}`, "");
    r = sectionRange(lines, n, name);
  }
  let end = r.end;
  while (end > r.start + 1 && !lines[end - 1].trim()) end--;
  const block = ["", ...add];
  lines.splice(end, 0, ...block);
  if (end + block.length < lines.length && lines[end + block.length].trim()) lines.splice(end + block.length, 0, "");
}

function withdraw(block, reason) {
  const out = [...block.lines];
  let last = out.length;
  while (last > 1 && !out[last - 1].trim()) last--;
  out.splice(last, 0, `Withdrawn: ${reason}`);
  return out;
}

function oiBullets(lines, ids) {
  const r = sectionRange(lines, 13, "open items");
  if (!r) return [];
  return lines.slice(r.start + 1, r.end).filter((l) => ids.some((id) => new RegExp(`^[-*]\\s+${id}\\b`).test(l)));
}

const oisOf = (block) => {
  const l = block.lines.find((x) => /^\s*\**(ois|open items)\**:/i.test(x));
  return l ? [...l.matchAll(/\bOI-\d+\b/g)].map((m) => m[0]) : [];
};

// Moves Requirement blocks into `to`; returns [oldId, newId] pairs. Edits ctx files.
function moveBlocks(ctx, src, blocks, to, verb) {
  const srcLines = text(ctx, src.doc).split("\n");
  const toLines = text(ctx, to.doc).split("\n");
  const pairs = [];
  const taken = [];
  const add = [];
  const ois = [];
  for (const b of blocks) {
    const id = nextId(toLines, to, taken);
    taken.push(id);
    pairs.push([b.id, id]);
    const copy = [b.lines[0].replace(b.id, id), ...b.lines.slice(1)];
    while (copy.length && !copy[copy.length - 1].trim()) copy.pop();
    add.push(...(add.length ? [""] : []), ...copy);
    ois.push(...oisOf(b));
  }
  for (const b of [...blocks].sort((a, c) => c.start - a.start)) {
    const id = pairs.find(([o]) => o === b.id)[1];
    srcLines.splice(b.start, b.end - b.start, ...withdraw(b, `${verb} ${id}`));
  }
  appendToSection(toLines, 11, "requirements", "Requirements", add);
  const have = oiBullets(toLines, [...new Set(ois)]).map((l) => l.match(/OI-\d+/)[0]);
  const bring = oiBullets(srcLines, [...new Set(ois)].filter((o) => !have.includes(o)));
  if (bring.length) appendToSection(toLines, 13, "open items", "Open Items", bring);
  put(ctx, src.doc, srcLines.join("\n"));
  put(ctx, to.doc, toLines.join("\n"));
  return { pairs, ois: [...new Set(ois)] };
}

// ---- actions ----

function list(ctx) {
  const rows = mapRows(text(ctx, mapPath(ctx)));
  const order = [...rows.map((r) => r.prefix), ...ctx.mods.map((m) => m.prefix).filter((p) => !rows.some((r) => r.prefix === p))];
  for (const p of order) {
    const m = find(ctx, p);
    if (!m) { ctx.log.push(`${p} | (map row, no ticket)`); continue; }
    const blocked = Array.isArray(m.fm.blockedBy) && m.fm.blockedBy.length ? ` | blockedBy ${m.fm.blockedBy.join(", ")}` : "";
    const formerly = m.fm.formerly ? ` | formerly ${m.fm.formerly}` : "";
    ctx.log.push(`${p} | ${m.fm.name ?? m.folder} | ${m.fm.status ?? "?"} | ${isDraft(m) ? "draft" : "confirmed"}${blocked}${formerly}`);
  }
  if (!order.length) ctx.log.push("module list: no Modules");
  return 0;
}

function confirm(ctx) {
  const { m, code } = needModule(ctx, ctx.names[0], "confirm");
  if (!m) return code;
  if (ctx.names.length > 1) return usage("module confirm: one prefix at a time", USE);
  if (merged(m)) return refuse(`module confirm: ${m.prefix} is ${m.fm.status}`);
  if (!isDraft(m)) return refuse(`module confirm: ${m.prefix} is already confirmed`);
  const blockedBy = ctx.opts["blocked-by"] === undefined ? (m.fm.blockedBy ?? []) : ctx.opts["blocked-by"].split(",").map((s) => s.trim()).filter(Boolean);
  for (const b of blockedBy) {
    const o = find(ctx, b);
    if (b === m.prefix) return refuse(`module confirm: ${m.prefix} cannot be blocked by itself`);
    if (!o) return refuse(`module confirm: blocked-by names unknown Module "${b}"`);
    if (merged(o)) return refuse(`module confirm: blocked-by ${b} is ${o.fm.status}; name ${String(o.fm.status).split(/[\s:]/).pop()}`);
  }
  setFrontMatter(ctx, m, confirmedFm(m, { blockedBy }));
  setMapRow(ctx, m.prefix, { status: m.fm.status }) || addMapRow(ctx, m.prefix, m.fm.name ?? m.folder, m.fm.status);
  changeLog(ctx, `review-draft: ${m.prefix} confirmed.`);
  ctx.log.push(`confirmed: ${m.prefix}${blockedBy.length ? ` (blockedBy ${blockedBy.join(", ")})` : ""}`);
  return 0;
}

function rename(ctx) {
  const { m, code } = needModule(ctx, ctx.names[0], "rename");
  if (!m) return code;
  const { to, name } = ctx.opts;
  if (!to && !name?.trim()) return usage("module rename: needs --to <NEW> and/or --name", USE);
  if (merged(m)) return refuse(`module rename: ${m.prefix} is ${m.fm.status}`);
  // resolve-module may rename the Module it holds (--who = claimedBy); anyone else waits.
  if (m.fm.status === "claimed" && String(m.fm.claimedBy ?? "") !== (ctx.opts.who ?? "").trim()) {
    return refuse(`module rename: ${m.prefix} is claimed by ${m.fm.claimedBy}; wait until it is free`);
  }
  const old = m.prefix;
  const prefix = to ?? old;
  if (to && to !== old) {
    if (!PREFIX.test(to)) return usage(`module rename: --to "${to}" must be 2–5 capital letters`, USE);
    if (prefixTaken(ctx, to)) return refuse(`module rename: prefix ${to} is taken (a Module, a former prefix, or GEN)`);
    if (m.fm.formerly && String(m.fm.formerly) !== to) {
      return refuse(`module rename: ${old} was already renamed from ${m.fm.formerly}; its Requirement IDs keep that prefix. Keep ${old} or rename back`);
    }
  }
  const newName = name?.trim() || m.fm.name || null;
  const slug = name?.trim() ? slugify(name) : m.folder.slice(old.length + 1) || slugify(newName ?? old);
  const folder = `${prefix}-${slug}`;
  const target = join(m.dir, "..", folder);
  if (folder !== m.folder && existsSync(target)) return refuse(`module rename: modules/${folder} already exists`);

  const changes = { prefix, name: newName };
  if (to && to !== old) changes.formerly = String(m.fm.formerly ?? "") === to ? null : old;
  setFrontMatter(ctx, m, changes);
  // Heading and Name: line in the ticket (and spec when it exists).
  for (const p of new Set([m.ticket, m.doc])) {
    const t = text(ctx, p)
      .replace(new RegExp(`^#\\s+${old}\\b\\s*[—–-]\\s*.*$`, "m"), `# ${prefix} — ${newName ?? ""}`.trim())
      .replace(/^(\s*(?:[-*]\s+)?\**Name\**:\s*).+$/m, (s, k) => (newName ? `${k}${newName}` : s))
      .replace(/^(\s*(?:[-*]\s+)?\**Prefix\**:\s*).+$/m, `$1${prefix}`);
    put(ctx, p, t);
  }
  const mapStatus = isDraft(m) ? "draft" : m.fm.status;
  setMapRow(ctx, old, { to: prefix, name: newName ?? undefined, status: mapStatus });
  if (prefix !== old) repoint(ctx, old, prefix, m);
  // Move pending writes of this folder with it.
  if (folder !== m.folder) {
    for (const [p, t] of [...ctx.files]) {
      if (p.startsWith(m.dir + "/")) { ctx.files.delete(p); ctx.files.set(join(target, p.slice(m.dir.length + 1)), t); }
    }
    ctx.renames = [[m.dir, target]];
    // The Prototype view follows the folder name; its banner still shows the old prefix until rebuilt.
    const view = prototypeView(ctx, m.folder);
    if (existsSync(view)) {
      ctx.renames.push([view, prototypeView(ctx, folder)]);
      ctx.log.push(`prototype: prototypes/${m.folder}.html → prototypes/${folder}.html; rebuild it (build-prototype ${prefix})`);
    }
  }
  changeLog(ctx, prefix !== old
    ? `review-draft: ${old} renamed to ${prefix} (${newName}); Requirement IDs keep ${old}.`
    : `review-draft: ${old} renamed to ${newName}.`);
  ctx.log.push(`renamed: ${old} → ${prefix}${newName ? ` (${newName})` : ""}; folder modules/${folder}`);
  return 0;
}

function merge(ctx) {
  const { m: from, code } = needModule(ctx, ctx.names[0], "merge");
  if (!from) return code;
  const into = ctx.opts.into;
  if (!into) return usage("module merge: needs --into <PREFIX>", USE);
  const { m: to, code: c2 } = needModule(ctx, into, "merge");
  if (!to) return c2;
  if (from === to) return refuse("module merge: a Module cannot merge into itself");
  if (merged(from)) return refuse(`module merge: ${from.prefix} is already ${from.fm.status}`);
  if (merged(to)) return refuse(`module merge: ${to.prefix} is ${to.fm.status}; merge into that one`);
  for (const x of [from, to]) if (x.fm.status === "claimed") return refuse(`module merge: ${x.prefix} is claimed by ${x.fm.claimedBy}`);

  const live = reqBlocks(text(ctx, from.doc).split("\n")).filter((b) => !b.withdrawn);
  const { pairs } = live.length ? moveBlocks(ctx, from, live, to, "Merged into") : { pairs: [] };
  setFrontMatter(ctx, from, { status: `merged-into ${to.prefix}`, draft: undefined });
  setMapRow(ctx, from.prefix, { status: `merged-into ${to.prefix}` });
  repoint(ctx, from.prefix, to.prefix, from);
  // Sections other than Requirements and Open Items are for the skill to fold in by hand.
  const left = sections(text(ctx, from.doc).replace(/^---[\s\S]*?\n---\n/, ""), 2)
    .filter((s) => s.body.trim() && !/requirements|open items/i.test(s.title)).map((s) => s.title);
  changeLog(ctx, `review-draft: ${from.prefix} merged into ${to.prefix}${pairs.length ? ` (${pairs.map(([a, b]) => `${a}→${b}`).join(", ")})` : ""}.`);
  ctx.log.push(`merged: ${from.prefix} → ${to.prefix}`);
  // A merged Module has no Prototype; the target's Prototype needs a rebuild with the moved Requirements.
  const view = prototypeView(ctx, from.folder);
  if (existsSync(view)) {
    ctx.removes = [view];
    ctx.log.push(`prototype: prototypes/${from.folder}.html removed`);
  }
  if (existsSync(prototypeView(ctx, to.folder))) ctx.log.push(`prototype: rebuild prototypes/${to.folder}.html (build-prototype ${to.prefix})`);
  for (const [a, b] of pairs) ctx.log.push(`requirement: ${a} → ${b}`);
  if (left.length) ctx.log.push(`fold in by hand (from ${from.folder} into ${to.folder}): ${left.join("; ")}`);
  return 0;
}

function create(ctx) {
  const prefix = ctx.names[0];
  const name = ctx.opts.name?.trim();
  if (!prefix || !PREFIX.test(prefix) || ctx.names.length > 1) return usage("module new: needs one prefix of 2–5 capital letters", USE);
  if (!name) return usage("module new: needs --name", USE);
  if (prefixTaken(ctx, prefix)) return refuse(`module new: prefix ${prefix} is taken (a Module, a former prefix, or GEN)`);
  if (ctx.opts.after && !mapRows(text(ctx, mapPath(ctx))).some((r) => r.prefix === ctx.opts.after)) {
    return refuse(`module new: --after ${ctx.opts.after} is not in the map`);
  }
  const folder = `${prefix}-${slugify(name)}`;
  const dir = join(ctx.agent, "modules", folder);
  if (existsSync(dir)) return refuse(`module new: modules/${folder} already exists`);
  put(ctx, join(dir, "ticket.md"),
    `---\nstatus: open\nprefix: ${prefix}\nname:${fmValue(name)}\ndraft: true\nblockedBy: []\n---\n\n# ${prefix} — ${name}\n\nName: ${name}\n`);
  if (!addMapRow(ctx, prefix, name, "draft", ctx.opts.after)) return refuse("module new: map.md has no Modules table");
  changeLog(ctx, `review-draft: ${prefix} (${name}) added as draft.`);
  ctx.log.push(`new: ${prefix} (${name}) draft; folder modules/${folder}`);
  return 0;
}

function move(ctx) {
  const ids = ctx.names;
  const toPrefix = ctx.opts.to;
  if (!ids.length || !ids.every((id) => REQ_ID.test(id))) return usage("module move: needs Requirement IDs like QUO-03", USE);
  if (!toPrefix) return usage("module move: needs --to <PREFIX>", USE);
  const { m: to, code } = needModule(ctx, toPrefix, "move");
  if (!to) return code;
  if (merged(to)) return refuse(`module move: ${to.prefix} is ${to.fm.status}`);
  // Group by source Module.
  const bySrc = new Map();
  for (const id of ids) {
    const src = ctx.mods.find((m) => reqBlocks(text(ctx, m.doc).split("\n")).some((b) => b.id === id));
    if (!src) return refuse(`module move: Requirement ${id} not found in any Module`);
    if (src === to) return refuse(`module move: ${id} is already in ${to.prefix}`);
    const b = reqBlocks(text(ctx, src.doc).split("\n")).find((x) => x.id === id);
    if (b.withdrawn) return refuse(`module move: ${id} is withdrawn`);
    for (const x of [src, to]) if (x.fm.status === "claimed") return refuse(`module move: ${x.prefix} is claimed by ${x.fm.claimedBy}`);
    if (!bySrc.has(src)) bySrc.set(src, []);
    bySrc.get(src).push(id);
  }
  const allPairs = [];
  const allOis = new Set();
  for (const [src, list] of bySrc) {
    const blocks = reqBlocks(text(ctx, src.doc).split("\n")).filter((b) => list.includes(b.id));
    const { pairs, ois } = moveBlocks(ctx, src, blocks, to, "Moved to");
    allPairs.push(...pairs);
    ois.forEach((o) => allOis.add(o));
  }
  // Open Items on moved Requirements now also bite the target Module.
  const regPath = join(ctx.agent, "open-items.md");
  const lines = text(ctx, regPath).split("\n");
  const head = lines.findIndex((l) => /^\|\s*ID\s*\|/i.test(l));
  const split = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);
  const k = head < 0 ? -1 : split(lines[head]).map(normHeader).indexOf("module");
  let added = 0;
  for (const oi of k < 0 ? [] : allOis) {
    const i = lines.findIndex((l) => new RegExp(`^\\|\\s*${oi}\\s*\\|`).test(l));
    if (i < 0) continue;
    const cells = split(lines[i]);
    const items = (cells[k] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (items.includes("All") || items.includes(to.prefix)) continue;
    cells[k] = ` ${[...items, to.prefix].join(", ")} `;
    lines[i] = `|${cells.join("|")}|`;
    added++;
  }
  if (added) { put(ctx, regPath, lines.join("\n")); ctx.log.push(`open-items.md: ${to.prefix} added to ${added} Open Item(s)`); }
  changeLog(ctx, `review-draft: ${allPairs.map(([a, b]) => `${a}→${b}`).join(", ")} moved to ${to.prefix}.`);
  for (const [a, b] of allPairs) ctx.log.push(`requirement: ${a} → ${b}`);
  return 0;
}

// ---- claim and close (resolve-module) ----

const resolvedLike = (ctx, p) => {
  const o = find(ctx, p);
  if (!o) return false;
  const st = String(o.fm.status ?? "");
  if (st === "resolved") return true;
  const into = st.match(/^merged-into[\s:]+([A-Z]{2,5})$/);
  return Boolean(into && find(ctx, into[1])?.fm.status === "resolved");
};

// Why a Module is not on the frontier, or null when it is (map-logic.md, Frontier).
function notFree(ctx, m) {
  const st = String(m.fm.status ?? "");
  if (merged(m)) return `is ${st}`;
  if (isDraft(m)) return "is still draft (review-draft confirms it first)";
  if (st === "claimed") return `is claimed by ${m.fm.claimedBy}`;
  if (st === "resolved") return "is resolved (ingest sets needs-revisit when new info touches it)";
  if (st !== "open" && st !== "needs-revisit") return `has status "${st}"`;
  const blockers = (Array.isArray(m.fm.blockedBy) ? m.fm.blockedBy : []).map(String).filter((b) => !resolvedLike(ctx, b));
  if (blockers.length) return `is blocked by ${blockers.join(", ")} (not resolved yet)`;
  return null;
}

// Map order, needs-revisit first, then open.
function frontierOf(ctx) {
  const rows = mapRows(text(ctx, mapPath(ctx))).map((r) => r.prefix);
  const order = [...rows, ...ctx.mods.map((m) => m.prefix).filter((p) => !rows.includes(p))];
  const mods = order.map((p) => find(ctx, p)).filter(Boolean);
  const free = mods.filter((m) => !notFree(ctx, m));
  return [...free.filter((m) => m.fm.status === "needs-revisit"), ...free.filter((m) => m.fm.status !== "needs-revisit")];
}

const nameOf = (m) => m.fm.name ?? m.folder;
const suggest = (ctx, skip) => {
  const next = frontierOf(ctx).filter((m) => m !== skip);
  return next.length ? `next on the frontier: ${next.map((m) => m.prefix).join(", ")}` : "no other Module is free now (module frontier shows who holds what)";
};

function frontier(ctx) {
  const rows = mapRows(text(ctx, mapPath(ctx))).map((r) => r.prefix);
  const order = [...rows, ...ctx.mods.map((m) => m.prefix).filter((p) => !rows.includes(p))];
  const free = frontierOf(ctx);
  for (const m of free) {
    const why = m.fm.status === "needs-revisit" ? ` | ${m.fm.revisitReason ?? ""}` : "";
    ctx.log.push(`next | ${m.prefix} | ${nameOf(m)} | ${m.fm.status}${why}`);
  }
  for (const p of order) {
    const m = find(ctx, p);
    if (!m || free.includes(m) || merged(m)) continue;
    const st = String(m.fm.status ?? "");
    if (isDraft(m)) ctx.log.push(`draft | ${m.prefix} | ${nameOf(m)} | run review-draft`);
    else if (st === "claimed") ctx.log.push(`claimed | ${m.prefix} | ${nameOf(m)} | by ${m.fm.claimedBy}`);
    else if (st === "resolved") ctx.log.push(`resolved | ${m.prefix} | ${nameOf(m)}`);
    else ctx.log.push(`blocked | ${m.prefix} | ${nameOf(m)} | ${notFree(ctx, m)}`);
  }
  if (!free.length) ctx.log.push(order.length ? "frontier: empty" : "frontier: no Modules");
  return 0;
}

// Read-only view for `status` (studio): the `module frontier` lines, plus every ticket
// (folder, prefix, front-matter) and whether its Prototype view exists. Writes nothing.
export function frontierReport(engDir) {
  const agent = join(resolve(engDir), "_agent");
  const ctx = { agent, names: [], opts: {}, files: new Map(), log: [], mods: readAll(agent) };
  frontier(ctx);
  const modules = ctx.mods.map((m) => ({
    folder: m.folder, prefix: m.prefix, fm: m.fm,
    hasData: existsSync(join(m.dir, "prototype-data.json")), hasView: existsSync(prototypeView(ctx, m.folder)),
  }));
  return { lines: ctx.log, modules };
}

function needWho(ctx, action) {
  const who = (ctx.opts.who ?? "").trim();
  return who ? { who } : { code: usage(`module ${action}: needs --who <name> (git config user.name)`, USE) };
}

// Keeps the spec header "Status:" equal to the ticket status (write-module-spec rule).
function specStatus(ctx, m, status) {
  const spec = join(m.dir, "spec.md");
  if (!existsSync(spec)) return;
  put(ctx, spec, text(ctx, spec).replace(/^(\s*Status:\s*).*$/m, `$1${status}`));
}

function claim(ctx) {
  const { m, code } = needModule(ctx, ctx.names[0], "claim");
  if (!m) return code;
  const { who, code: c2 } = needWho(ctx, "claim");
  if (!who) return c2;
  if (m.fm.status === "claimed" && String(m.fm.claimedBy ?? "") === who) {
    ctx.log.push(`claim: ${m.prefix} already claimed by you; nothing written`);
    return 0;
  }
  const why = notFree(ctx, m);
  if (why) return refuse(`module claim: ${m.prefix} ${why}; ${suggest(ctx, m)}`);
  const pass = m.fm.status === "needs-revisit" ? "revisit" : "first pass";
  setFrontMatter(ctx, m, { ...confirmedFm(m), status: "claimed", claimedBy: who });
  setMapRow(ctx, m.prefix, { status: "claimed" });
  specStatus(ctx, m, "claimed");
  changeLog(ctx, `resolve-module: ${m.prefix} claimed by ${who}${pass === "revisit" ? " (revisit)" : ""}.`);
  ctx.log.push(`claimed: ${m.prefix} by ${who} (${pass}${pass === "revisit" ? `: ${m.fm.revisitReason ?? ""}` : ""})`);
  return 0;
}

function holder(ctx, m, who, action) {
  if (m.fm.status !== "claimed") return refuse(`module ${action}: ${m.prefix} is not claimed (status ${m.fm.status})`);
  if (String(m.fm.claimedBy ?? "") !== who && !(action === "release" && ctx.opts.force)) {
    return refuse(`module ${action}: ${m.prefix} is claimed by ${m.fm.claimedBy}, not ${who}${action === "release" ? "; release it only with --force after asking" : ""}`);
  }
  return 0;
}

function release(ctx) {
  const { m, code } = needModule(ctx, ctx.names[0], "release");
  if (!m) return code;
  const { who, code: c2 } = needWho(ctx, "release");
  if (!who) return c2;
  const bad = holder(ctx, m, who, "release");
  if (bad) return bad;
  // Back to what it was before the claim: a revisit keeps its reason until it is resolved.
  const status = String(m.fm.revisitReason ?? "").trim() ? "needs-revisit" : "open";
  const by = m.fm.claimedBy;
  setFrontMatter(ctx, m, { status, claimedBy: null });
  setMapRow(ctx, m.prefix, { status });
  specStatus(ctx, m, status);
  changeLog(ctx, `resolve-module: ${m.prefix} claim of ${by} released${by !== who ? ` by ${who}` : ""}.`);
  ctx.log.push(`released: ${m.prefix} (${status})`);
  return 0;
}

function close(ctx) {
  const { m, code } = needModule(ctx, ctx.names[0], "close");
  if (!m) return code;
  const { who, code: c2 } = needWho(ctx, "close");
  if (!who) return c2;
  const bad = holder(ctx, m, who, "close");
  if (bad) return bad;
  const view = prototypeView(ctx, m.folder);
  const missing = [
    !existsSync(join(m.dir, "prototype-data.json")) && `modules/${m.folder}/prototype-data.json (build-prototype writes it)`,
    !existsSync(view) && `prototypes/${m.folder}.html (ENGINE build-prototype writes it)`,
  ].filter(Boolean);
  // The spec done check prints its own lines; open Open Items do not block a close.
  const spec = specCheck([join(ctx.agent, ".."), m.prefix]);
  if (spec !== 0 || missing.length) {
    for (const x of missing) console.error(`module close: missing ${x}`);
    return refuse(`module close: ${m.prefix} not closed: ${spec !== 0 ? "spec-check fails" : ""}${spec !== 0 && missing.length ? "; " : ""}${missing.length ? "no Prototype" : ""}`);
  }
  const was = String(m.fm.revisitReason ?? "").trim();
  setFrontMatter(ctx, m, { status: "resolved", revisitReason: null });
  setMapRow(ctx, m.prefix, { status: "resolved" });
  specStatus(ctx, m, "resolved");
  changeLog(ctx, `resolve-module: ${m.prefix} resolved${was ? " (revisit)" : ""}.`);
  ctx.log.push(`closed: ${m.prefix} resolved; claimedBy ${m.fm.claimedBy} kept`);
  return 0;
}

function revisit(ctx) {
  const { m, code } = needModule(ctx, ctx.names[0], "revisit");
  if (!m) return code;
  const reason = (ctx.opts.reason ?? "").trim();
  if (!reason) return usage("module revisit: needs --reason \"<what changed + Source ID>\"", USE);
  const st = String(m.fm.status ?? "");
  if (st === "claimed") {
    return refuse(`module revisit: ${m.prefix} is claimed by ${m.fm.claimedBy}; tell them what changed, or set needs-revisit after it closes`);
  }
  if (st !== "resolved" && st !== "needs-revisit") return refuse(`module revisit: ${m.prefix} is ${st}; only a resolved Module needs a revisit`);
  const prev = String(m.fm.revisitReason ?? "").trim();
  const revisitReason = prev && !prev.includes(reason) ? `${prev}; ${reason}` : reason;
  setFrontMatter(ctx, m, { ...confirmedFm(m), status: "needs-revisit", revisitReason });
  setMapRow(ctx, m.prefix, { status: "needs-revisit" });
  specStatus(ctx, m, "needs-revisit");
  const skill = (ctx.opts.skill ?? "").trim() || "ingest";
  changeLog(ctx, `${skill}: ${m.prefix} needs revisit: ${reason}`);
  ctx.log.push(`revisit: ${m.prefix} needs-revisit (${revisitReason})`);
  return 0;
}
