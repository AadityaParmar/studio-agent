// enterprise-glossary helpers (ticket 29). The skill decides; these make the GLOSSARY.md edits
// the same every time, check the facts they rest on, and never touch any other file.
//   glossary agree   <enterprise-dir> --term "<T>" --source <ID>         Enterprise confirmed the term (Questionnaire reply)
//   glossary agree   <enterprise-dir> --signed                           every term shown in a signed-off BRD version
//   glossary dispute <enterprise-dir> --term "<T>" --engagement <slug> --oi OI-NN
//   glossary settle  <enterprise-dir> --term "<T>" --source <ID> [--definition "<text>"]
//   glossary split   <enterprise-dir> --term "<T>" --into "<Term> | <definition> | <slugs>" "<Term> | <definition> | <slugs>" [--source <ID>]
//   glossary rename  <enterprise-dir> --term "<Old>" --to "<New>" [--source <ID>]
// split and rename print the lines of open Engagements' markdown that still use the old word
// (the skill rewrites them); Engagements whose latest BRD version is signed off are skipped.
// Bad arguments exit 2; a refused change (unknown term, Source not registered, OI not open…) exits 1. Nothing written then.
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";
import { tables, column, list, idList, isEmpty } from "./markdown.mjs";
import { parse, usage } from "./ingest.mjs";
import { latestSigned } from "./build-brd.mjs";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const USE = [
  'glossary agree <enterprise-dir> --term "<T>" --source <ID>',
  "glossary agree <enterprise-dir> --signed",
  'glossary dispute <enterprise-dir> --term "<T>" --engagement <slug> --oi OI-NN',
  'glossary settle <enterprise-dir> --term "<T>" --source <ID> [--definition "<text>"]',
  'glossary split <enterprise-dir> --term "<T>" --into "<Term> | <definition> | <slugs>" "<Term> | <definition> | <slugs>" [--source <ID>]',
  'glossary rename <enterprise-dir> --term "<Old>" --to "<New>" [--source <ID>]',
].join("\n       ");

const ACTIONS = { agree, dispute, settle, split, rename };

export function glossary(args) {
  const [action, ...rest] = args;
  if (!ACTIONS[action]) return usage(`glossary: unknown action "${action ?? "(none)"}"`, USE);
  // --into takes two values.
  let into = null;
  const i = rest.indexOf("--into");
  if (i >= 0) {
    into = rest.slice(i + 1, i + 3);
    rest.splice(i, 3);
  }
  const { pos, opts, problem } = parse(rest, ["term", "source", "engagement", "oi", "definition", "to"], ["signed"]);
  if (problem) return usage(problem, USE);
  if (pos.length !== 1) return usage(`glossary ${action}: needs <enterprise-dir>`, USE);
  const ent = resolve(pos[0]);
  const file = join(ent, "_agent", "GLOSSARY.md");
  if (!existsSync(file)) return usage(`glossary: ${pos[0]} has no _agent/GLOSSARY.md (run init-engagement first)`, USE);
  if (into) opts.into = into;
  const g = readGlossaryFile(file);
  const ctx = { ent, file, g, opts, refuse, register: () => registerIds(ent) };
  return ACTIONS[action](ctx);
}

const refuse = (msg) => {
  console.error(msg);
  return 1;
};

// ---- actions ----

function agree(ctx) {
  const { g, opts } = ctx;
  if (opts.signed) {
    if (opts.term || opts.source) return usage("glossary agree: --signed takes no --term or --source", USE);
    return agreeSigned(ctx);
  }
  if (!opts.term?.trim() || !opts.source?.trim()) return usage("glossary agree: needs --term and --source (or --signed)", USE);
  const e = find(g, opts.term);
  if (!e) return refuse(notFound(g, opts.term));
  if (!ctx.register().has(opts.source)) return refuse(noSource(opts.source));
  if (e.disputed) return refuse(`glossary agree: "${e.term}" is disputed (${e.disputed}); settle, split or rename it first`);
  const was = e.status;
  e.status = "agreed";
  addSource(e, opts.source);
  save(ctx.file, g, [[e, [e]]]);
  console.log(`${was === "agreed" ? "already agreed" : "agreed"}: "${e.term}" [${opts.source}]`);
  return 0;
}

// Terms shown in the latest signed-off version of any Engagement become agreed,
// unless disputed or changed (definition or Avoid) since that version.
function agreeSigned(ctx) {
  const { g, ent } = ctx;
  const done = [];
  for (const slug of engagements(ent)) {
    const snap = latestSigned(join(ent, "engagements", slug));
    if (!snap) continue;
    const v = `${slug} v${snap.engagement.version}`;
    for (const t of snap.glossary ?? []) {
      if (t.disputed) continue;
      const e = find(g, t.term);
      if (!e) { console.log(`not found: "${t.term}" (${v}; renamed or split since)`); continue; }
      if (e.disputed) { console.log(`kept: "${e.term}" is disputed (${e.disputed})`); continue; }
      if (e.status === "agreed") continue;
      if (definition(e) !== t.definition || e.avoid.join("\n") !== t.avoid.join("\n")) {
        console.log(`kept proposed: "${e.term}" changed since ${v}`);
        continue;
      }
      console.log(`agreed: "${e.term}" (${v}) [${snap.signOff.evidence}]`);
      e.status = "agreed";
      addSource(e, snap.signOff.evidence);
      if (!done.includes(e)) done.push(e);
    }
  }
  if (!done.length) {
    console.log("glossary agree: nothing to agree");
    return 0;
  }
  save(ctx.file, g, done.map((e) => [e, [e]]));
  return 0;
}

function dispute(ctx) {
  const { g, opts, ent } = ctx;
  if (!opts.term?.trim() || !opts.engagement || !opts.oi) return usage("glossary dispute: needs --term, --engagement and --oi", USE);
  if (!KEBAB.test(opts.engagement)) return usage(`glossary dispute: --engagement "${opts.engagement}" must be a kebab-case slug`, USE);
  if (!/^OI-\d{2,3}$/.test(opts.oi)) return usage(`glossary dispute: --oi "${opts.oi}" must look like OI-07`, USE);
  const e = find(g, opts.term);
  if (!e) return refuse(notFound(g, opts.term));
  if (e.disputed) return refuse(`glossary dispute: "${e.term}" is already disputed (${e.disputed}); add this meaning to that Open Item`);
  const oi = openItem(ent, opts.engagement, opts.oi);
  if (!oi) return refuse(`glossary dispute: ${opts.oi} is not in engagements/${opts.engagement}/_agent/open-items.md; raise it first`);
  if (oi.status !== "open") return refuse(`glossary dispute: ${opts.oi} is ${oi.status || "not open"}; a dispute needs an open Open Item`);
  if (!/enterprise/i.test(oi.owner)) return refuse(`glossary dispute: ${opts.oi} owner is "${oi.owner}"; the Enterprise settles meanings (owner Enterprise)`);
  e.disputed = `${opts.engagement}/${opts.oi}`;
  if (!e.usedIn.includes(opts.engagement)) e.usedIn.push(opts.engagement);
  save(ctx.file, g, [[e, [e]]]);
  console.log(`disputed: "${e.term}" (${e.disputed}); meaning kept as is`);
  return 0;
}

function settle(ctx) {
  const { g, opts } = ctx;
  if (!opts.term?.trim() || !opts.source?.trim()) return usage("glossary settle: needs --term and --source (the Open Item's answer Source)", USE);
  if (opts.definition !== undefined && !opts.definition.trim()) return usage("glossary settle: --definition is empty", USE);
  const e = find(g, opts.term);
  if (!e) return refuse(notFound(g, opts.term));
  if (!e.disputed) return refuse(`glossary settle: "${e.term}" is not disputed`);
  if (!ctx.register().has(opts.source)) return refuse(noSource(opts.source));
  const was = e.disputed;
  e.disputed = null;
  if (opts.definition) e.def = [opts.definition.trim()];
  e.status = "agreed";
  addSource(e, opts.source);
  save(ctx.file, g, [[e, [e]]]);
  console.log(`settled: "${e.term}" (${was}) ${opts.definition ? "new meaning" : "meaning kept"}, agreed [${opts.source}]`);
  return 0;
}

// One term with two real meanings → two qualified terms; the bare word goes into both Avoid lists.
function split(ctx) {
  const { g, opts } = ctx;
  if (!opts.term?.trim() || !opts.into) return usage("glossary split: needs --term and --into (two terms)", USE);
  const parts = opts.into.map((s) => String(s ?? "").split("|").map((x) => x.trim()));
  if (parts.length !== 2 || parts.some((p) => p.length !== 3 || !p[0] || !p[1] || !list(p[2]).length)) {
    return usage('glossary split: --into needs two values "<Term> | <definition> | <slugs>"', USE);
  }
  for (const p of parts) for (const s of list(p[2])) if (!KEBAB.test(s)) return usage(`glossary split: Engagement slug "${s}" must be kebab-case`, USE);
  const e = find(g, opts.term);
  if (!e) return refuse(notFound(g, opts.term));
  const names = parts.map((p) => p[0]);
  if (names[0].toLowerCase() === names[1].toLowerCase()) return refuse("glossary split: the two terms must differ");
  for (const n of names) {
    if (n.toLowerCase() === e.term.toLowerCase()) return refuse(`glossary split: "${n}" is the bare word; qualify it (e.g. "Sales ${e.term}")`);
    if (find(g, n)) return refuse(`glossary split: "${n}" is already a term`);
  }
  const status = resolveStatus(ctx, e, "split");
  if (typeof status === "number") return status;
  const made = parts.map(([term, def, slugs]) => ({
    term,
    def: [def],
    avoid: uniq([...e.avoid.filter((a) => !names.some((n) => n.toLowerCase() === a.toLowerCase())), e.term]),
    sources: uniq([...e.sources, ...(opts.source ? [opts.source] : [])]),
    status,
    usedIn: list(slugs),
    disputed: null,
  }));
  save(ctx.file, g, [[e, made]]);
  console.log(`split: "${e.term}" → "${names[0]}", "${names[1]}" (${status})`);
  mentions(ctx.ent, e.term, names.join('" or "'));
  return 0;
}

// The new name becomes the entry; the old name goes into its Avoid.
function rename(ctx) {
  const { g, opts } = ctx;
  if (!opts.term?.trim() || !opts.to?.trim()) return usage("glossary rename: needs --term and --to", USE);
  const e = find(g, opts.term);
  if (!e) return refuse(notFound(g, opts.term));
  const to = opts.to.trim();
  if (to === e.term) return refuse("glossary rename: --to is the same name");
  const other = find(g, to);
  if (other && other !== e) return refuse(`glossary rename: "${to}" is already a term`);
  const status = resolveStatus(ctx, e, "rename");
  if (typeof status === "number") return status;
  const old = e.term;
  e.term = to;
  e.avoid = uniq([...e.avoid.filter((a) => a.toLowerCase() !== to.toLowerCase()), old]);
  if (opts.source) addSource(e, opts.source);
  e.status = status;
  e.disputed = null;
  save(ctx.file, g, [[e, [e]]]);
  console.log(`renamed: "${old}" → "${to}" (${status})`);
  mentions(ctx.ent, old, to);
  return 0;
}

// Status after a split or rename. Settling a dispute or changing an agreed term needs the
// Enterprise's answer (--source) and gives an agreed term; a proposed term stays proposed.
function resolveStatus(ctx, e, verb) {
  const { opts } = ctx;
  if (opts.source && !ctx.register().has(opts.source)) return refuse(noSource(opts.source));
  if (e.disputed || e.status === "agreed") {
    if (!opts.source) {
      return refuse(`glossary ${verb}: "${e.term}" is ${e.disputed ? `disputed (${e.disputed})` : "agreed"}; needs --source: the Enterprise's answer to the Open Item`);
    }
    return "agreed";
  }
  return "proposed";
}

// ---- open Engagements that still use a word ----

function mentions(ent, word, now) {
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s|es)?\\b`, "i");
  let hits = 0;
  for (const slug of engagements(ent)) {
    const dir = join(ent, "engagements", slug);
    const signed = latestSigned(dir);
    if (signed && latestVersion(dir) === signed.engagement.version) {
      console.log(`skipped: ${slug} (latest version v${signed.engagement.version} signed off; never rewritten)`);
      continue;
    }
    for (const f of mdFiles(join(dir, "_agent"))) {
      readFileSync(f, "utf8").split("\n").forEach((line, i) => {
        if (!re.test(line)) return;
        hits++;
        console.log(`rewrite: ${relative(ent, f).split(sep).join("/")}:${i + 1}: ${line.trim()}`);
      });
    }
  }
  console.log(hits ? `${hits} line(s) in open Engagements still say "${word}"; rewrite to "${now}" where it means this term` : `no open Engagement markdown says "${word}"`);
}

function mdFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== "brd") out.push(...mdFiles(p)); // _agent/brd holds data files and frozen versions
    } else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function latestVersion(dir) {
  const folder = join(dir, "_agent", "brd", "versions");
  if (!existsSync(folder)) return 0;
  return Math.max(0, ...readdirSync(folder).map((f) => f.match(/^v([1-9]\d*)\.json$/)).filter(Boolean).map((m) => Number(m[1])));
}

function engagements(ent) {
  const dir = join(ent, "engagements");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((s) => existsSync(join(dir, s, "_agent"))).sort();
}

// ---- registers ----

function registerIds(ent) {
  const p = join(ent, "_agent", "sources.md");
  if (!existsSync(p)) return new Set();
  const t = tables(readFileSync(p, "utf8")).find((x) => column(x, "id") && column(x, "title"));
  if (!t) return new Set();
  const c = column(t, "id");
  return new Set(t.rows.map((r) => r[c]));
}

function openItem(ent, slug, id) {
  const p = join(ent, "engagements", slug, "_agent", "open-items.md");
  if (!existsSync(p)) return null;
  const t = tables(readFileSync(p, "utf8")).find((x) => column(x, "id") && column(x, "question"));
  if (!t) return null;
  const [cid, cstatus, cowner] = [column(t, "id"), column(t, "status"), column(t, "owner")];
  const row = t.rows.find((r) => r[cid] === id);
  return row ? { status: (row[cstatus] ?? "").toLowerCase(), owner: row[cowner] ?? "" } : null;
}

const noSource = (id) => `glossary: Source ${id} is not in the Source register (ingest it first)`;

// ---- GLOSSARY.md read / write ----
// Same entry grammar as build-brd's reader. Edits replace only the lines of the entries they touch.

export function readGlossaryFile(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  const entries = [];
  let cur = null;
  const close = (i) => {
    if (!cur) return;
    let end = i;
    while (end > cur.start + 1 && !lines[end - 1].trim()) end--;
    cur.end = end;
    entries.push(cur);
    cur = null;
  };
  lines.forEach((line, i) => {
    const head = line.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
    if (head) {
      close(i);
      cur = { start: i, term: head[1].trim(), def: head[2].trim() ? [head[2].trim()] : [], avoid: [], sources: [], status: "", usedIn: [], disputed: null };
      return;
    }
    if (!cur) return;
    if (/^#/.test(line)) return close(i);
    const avoid = line.match(/^_Avoid_:\s*(.*)$/);
    if (avoid) { cur.avoid = list(avoid[1]); return; }
    if (/^_Source_:/.test(line) || /_Status_:/.test(line) || /_Used in_:/.test(line)) {
      for (const part of line.split("·")) {
        const m = part.trim().match(/^_(.+?)_:\s*(.*)$/);
        if (!m) continue;
        const key = m[1].toLowerCase();
        if (key === "source") cur.sources = idList(m[2]);
        else if (key === "status") cur.status = m[2].trim().toLowerCase();
        else if (key === "used in") cur.usedIn = list(m[2]);
        else if (key === "disputed") cur.disputed = isEmpty(m[2]) ? null : m[2].trim();
      }
      return;
    }
    if (line.trim()) cur.def.push(line.trim());
  });
  close(lines.length);
  return { lines, entries };
}

export function renderEntry(e) {
  const meta = [`_Source_: ${e.sources.join(", ") || "—"}`, `_Status_: ${e.status || "proposed"}`, `_Used in_: ${e.usedIn.join(", ")}`];
  if (e.disputed) meta.push(`_Disputed_: ${e.disputed}`);
  return [`**${e.term}**:`, definition(e), ...(e.avoid.length ? [`_Avoid_: ${e.avoid.join(", ")}`] : []), meta.join(" · ")];
}

// edits = [[entry, [entries to write in its place]]]
function save(file, g, edits) {
  const lines = [...g.lines];
  for (const [e, repl] of [...edits].sort((a, b) => b[0].start - a[0].start)) {
    const out = repl.flatMap((r, i) => (i ? ["", ...renderEntry(r)] : renderEntry(r)));
    lines.splice(e.start, e.end - e.start, ...out);
  }
  writeFileSync(file, lines.join("\n"));
}

const definition = (e) => e.def.join(" ").trim();
const find = (g, term) => g.entries.find((e) => e.term === term.trim()) ?? null;
const uniq = (a) => [...new Set(a)];
const addSource = (e, id) => { if (!e.sources.includes(id)) e.sources.push(id); };

function notFound(g, term) {
  const near = g.entries.find((e) => e.term.toLowerCase() === term.trim().toLowerCase());
  return `glossary: no term "${term}"${near ? ` (did you mean "${near.term}"?)` : ""}`;
}
