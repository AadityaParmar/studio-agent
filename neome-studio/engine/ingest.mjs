// ingest helpers. The ingest skill calls these so folder set-up, Source IDs, renames,
// register rows and the Engagement lock are the same every run; the skill does the reading and drafting.
//   init-engagement <enterprise-dir> <slug> [--name "<Enterprise name>"] [--title "<Engagement title>"]
//   add-source <enterprise-dir> <file> --engagement <slug> [--prefix XX --type "..." --title "..." [--slug s] [--date YYYY-MM-DD] [--notes "..."]]
//   lock <engagement-dir> --who <name> --skill <skill>
//   unlock <engagement-dir> --who <name> [--force]
// Files are created, never overwritten. Bad arguments exit 2 with nothing written.
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, readdirSync, statSync } from "node:fs";
import { join, resolve, basename, dirname, extname, relative, sep } from "node:path";
import { tables, column, list } from "./markdown.mjs";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TEXT_EXT = new Set([".md", ".txt", ".csv", ".tsv"]);
const TOPICS = ["Access", "Localisation", "Hosting", "Migration", "Training", "Support", "Other"];
const REGISTER_HEAD = "| ID | type | title | date | file | engagement(s) | notes |\n|---|---|---|---|---|---|---|\n";

export function parse(args, flags, bools = []) {
  const pos = [];
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a.startsWith("--")) { pos.push(a); continue; }
    const k = a.slice(2);
    if (bools.includes(k)) { opts[k] = true; continue; }
    if (!flags.includes(k)) return { problem: `Unknown option ${a}` };
    if (i + 1 >= args.length) return { problem: `${a} needs a value` };
    opts[k] = args[++i];
  }
  return { pos, opts };
}

export const usage = (msg, use) => {
  console.error(`${msg}\nUsage: ${use}`);
  return 2;
};

export const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();

// ---- init-engagement ----

const INIT_USE = 'init-engagement <enterprise-dir> <slug> [--name "<Enterprise name>"] [--title "<Engagement title>"]';

export function initEngagement(args) {
  const { pos, opts, problem } = parse(args, ["name", "title"]);
  if (problem) return usage(problem, INIT_USE);
  const [entArg, slug] = pos ?? [];
  if (!entArg || !slug || pos.length > 2) return usage("init-engagement: needs <enterprise-dir> and <slug>", INIT_USE);
  const ent = resolve(entArg);
  if (!KEBAB.test(basename(ent))) return usage(`init-engagement: Enterprise folder "${basename(ent)}" must be kebab-case`, INIT_USE);
  if (!KEBAB.test(slug)) return usage(`init-engagement: Engagement slug "${slug}" must be kebab-case, no dates`, INIT_USE);
  const glossary = join(ent, "_agent", "GLOSSARY.md");
  const eng = join(ent, "engagements", slug, "_agent");
  if (!existsSync(glossary) && !opts.name?.trim()) return usage("init-engagement: new Enterprise needs --name", INIT_USE);
  if (!existsSync(join(eng, "map.md")) && !opts.title?.trim()) return usage("init-engagement: new Engagement needs --title", INIT_USE);

  const made = [];
  const dir = (p) => { if (!existsSync(p)) { mkdirSync(p, { recursive: true }); made.push(p); } };
  const file = (p, text) => {
    if (existsSync(p)) return;
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, text);
    made.push(p);
  };
  dir(join(ent, "inputs"));
  dir(join(ent, "confidential"));
  dir(join(ent, "_agent", "sources"));
  file(glossary, `# ${opts.name?.trim()}\n\n## Language\n`);
  file(join(ent, "_agent", "sources.md"), `# Sources\n\n${REGISTER_HEAD}`);
  dir(join(eng, "modules"));
  const title = opts.title?.trim();
  file(join(eng, "map.md"),
    `# Map: ${title}\n\n## Destination\n\nA signed-off BRD for ${title}.\n\n## Notes\n\n## Modules\n\n| Prefix | Module | Status |\n|---|---|---|\n\n## Change log\n\n- ${today()}: Engagement created.\n`);
  file(join(eng, "process.md"), "# Process\n");
  file(join(eng, "open-items.md"),
    "# Open Items\n\n| ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source |\n|---|---|---|---|---|---|---|---|---|\n");
  file(join(eng, "general.md"), `# Across all Modules\n\n${TOPICS.map((t) => `## ${t}\n`).join("\n")}`);
  for (const p of made) console.log(`created ${relative(ent, p) || "."}`);
  if (!made.length) console.log("init-engagement: everything already exists");
  return 0;
}

// ---- add-source ----

const ADD_USE =
  'add-source <enterprise-dir> <file> --engagement <slug> --prefix <XX> --type "<type>" --title "<title>" [--slug <slug>] [--date YYYY-MM-DD] [--notes "..."]\n' +
  "       (file already registered: only --engagement needed; adds the Engagement to its row)";

export function addSource(args) {
  const { pos, opts, problem } = parse(args, ["engagement", "prefix", "type", "title", "slug", "date", "notes"]);
  if (problem) return usage(problem, ADD_USE);
  const [entArg, fileArg] = pos ?? [];
  if (!entArg || !fileArg || pos.length > 2) return usage("add-source: needs <enterprise-dir> and <file>", ADD_USE);
  const ent = resolve(entArg);
  const regPath = join(ent, "_agent", "sources.md");
  if (!existsSync(regPath)) return usage(`add-source: ${ent} has no _agent/sources.md (run init-engagement first)`, ADD_USE);
  if (!opts.engagement || !KEBAB.test(opts.engagement)) return usage("add-source: needs --engagement <slug>", ADD_USE);
  const file = resolve(fileArg);
  const rel = relative(ent, file).split(sep).join("/");
  if (!/^(inputs|confidential)\/[^/]+$/.test(rel)) return usage(`add-source: ${fileArg} must sit directly in inputs/ or confidential/`, ADD_USE);
  if (!existsSync(file) || !statSync(file).isFile()) return usage(`add-source: ${fileArg} not found`, ADD_USE);

  const text = readFileSync(regPath, "utf8");
  const t = tables(text).find((x) => column(x, "id") && column(x, "title"));
  if (!t) return usage("add-source: sources.md has no register table", ADD_USE);
  const idCol = column(t, "id");
  const fileCol = column(t, "file");
  const engCol = column(t, "engagement");

  // Already registered: only add the Engagement.
  const existing = t.rows.find((r) => r[fileCol] === rel);
  if (existing) {
    const id = existing[idCol];
    const engs = list(existing[engCol]);
    if (!engs.includes(opts.engagement)) {
      const lines = text.split("\n");
      const i = lines.findIndex((l) => new RegExp(`^\\|\\s*${id}\\s*\\|`).test(l));
      const cells = lines[i].trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);
      const k = t.headers.indexOf(engCol);
      cells[k] = ` ${[...engs, opts.engagement].join(", ")} `;
      lines[i] = `|${cells.join("|")}|`;
      writeFileSync(regPath, lines.join("\n"));
    }
    console.log(`id: ${id}\nfile: ${rel}\nalready registered; engagement(s): ${[...new Set([...engs, opts.engagement])].join(", ")}`);
    return 0;
  }

  const prefix = opts.prefix ?? "";
  if (!/^[A-Z]{2,4}$/.test(prefix) || prefix === "OI" || prefix === "GEN") return usage(`add-source: --prefix "${prefix}" must be 2–4 capital letters (not OI or GEN)`, ADD_USE);
  if (!opts.type?.trim() || !opts.title?.trim()) return usage("add-source: new Source needs --type and --title", ADD_USE);
  if (opts.date && !/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) return usage(`add-source: --date "${opts.date}" must be YYYY-MM-DD`, ADD_USE);
  const slug = opts.slug ?? slugify(opts.title);
  if (!KEBAB.test(slug)) return usage(`add-source: slug "${slug}" must be kebab-case`, ADD_USE);

  // Next number for this prefix, across the register and any file already carrying an ID.
  const taken = new Set(t.rows.map((r) => r[idCol]));
  for (const d of ["inputs", "confidential"]) {
    if (!existsSync(join(ent, d))) continue;
    for (const f of readdirSync(join(ent, d))) {
      const m = f.match(/^([A-Z]{2,4}-\d+)-/);
      if (m) taken.add(m[1]);
    }
  }
  let n = 1;
  while (taken.has(`${prefix}-${n}`)) n++;
  const id = `${prefix}-${n}`;
  const folder = rel.split("/")[0];
  const newRel = `${folder}/${id}-${slug}${extname(file).toLowerCase()}`;
  const target = join(ent, newRel);
  if (existsSync(target)) return usage(`add-source: ${newRel} already exists`, ADD_USE);

  renameSync(file, target);
  const confidential = folder === "confidential";
  const notes = [confidential ? "confidential" : "", opts.notes ?? ""].filter((s) => s.trim()).join("; ");
  const row = `| ${[id, opts.type, opts.title, opts.date ?? "", newRel, opts.engagement, notes].map(cell).join(" | ")} |`;
  const lines = text.replace(/\n+$/, "").split("\n");
  const head = lines.findIndex((l) => /^\|.*\bID\b.*\btitle\b/i.test(l));
  let end = head + 2;
  while (end < lines.length && lines[end].trim().startsWith("|")) end++;
  lines.splice(end, 0, row);
  writeFileSync(regPath, lines.join("\n") + "\n");

  const copyRel = `_agent/sources/${id}.md`;
  let state = "needed";
  if (TEXT_EXT.has(extname(file).toLowerCase())) {
    mkdirSync(join(ent, "_agent", "sources"), { recursive: true });
    writeFileSync(join(ent, copyRel), `${copyHeader(id, opts, newRel)}${readFileSync(target, "utf8").replace(/\s+$/, "")}\n`);
    state = "written";
  }
  console.log(`id: ${id}\nfile: ${newRel}\ntext: ${copyRel} (${state})`);
  if (state === "needed") console.log(`header for the text copy:\n${copyHeader(id, opts, newRel)}`);
  return 0;
}

const copyHeader = (id, o, file) =>
  `# ${id} — ${o.title.trim()}\n\nType: ${o.type.trim()} · Date: ${o.date ?? "unknown"} · File: ${file}\n\n---\n\n`;

export function slugify(s) {
  const words = s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  let out = "";
  for (const w of words) {
    if ((out + "-" + w).length > 40 && out) break;
    out = out ? `${out}-${w}` : w;
  }
  out = out.replace(/(-(and|or|of|the|with|for|to|a|on|in))+$/, "");
  return out || "input";
}

// ---- lock / unlock ----

const LOCK_USE = "lock <engagement-dir> --who <name> --skill <skill> | unlock <engagement-dir> --who <name> [--force]";
const LOCK_LINE = /^lock:\s*(.+?)\s*·\s*(.+?)\s*·\s*(.+?)\s*$/m;

export function readLock(mapText) {
  const m = mapText.match(LOCK_LINE);
  return m ? { who: m[1], skill: m[2], since: m[3] } : null;
}

function mapOf(dirArg) {
  const p = join(resolve(dirArg ?? ""), "_agent", "map.md");
  return existsSync(p) ? p : null;
}

export function lock(args) {
  const { pos, opts, problem } = parse(args, ["who", "skill"]);
  if (problem) return usage(problem, LOCK_USE);
  const p = mapOf(pos?.[0]);
  if (!p) return usage(`lock: ${pos?.[0] ?? "(none)"} is not an Engagement folder (no _agent/map.md)`, LOCK_USE);
  if (!opts.who?.trim() || !opts.skill?.trim()) return usage("lock: needs --who and --skill", LOCK_USE);
  const text = readFileSync(p, "utf8");
  const held = readLock(text);
  if (held) {
    if (held.who === opts.who.trim() && held.skill === opts.skill.trim()) {
      console.log(`lock: already held by you (${held.skill}, since ${held.since})`);
      return 0;
    }
    console.error(`lock: locked by ${held.who} (${held.skill}, since ${held.since})`);
    return 1;
  }
  const since = new Date().toISOString().slice(0, 16) + "Z";
  const line = `lock: ${opts.who.trim()} · ${opts.skill.trim()} · ${since}`;
  const out = /^# .*\n/.test(text) ? text.replace(/^(# .*\n)\n?/, `$1\n${line}\n\n`) : `${line}\n\n${text}`;
  writeFileSync(p, out);
  console.log(line);
  return 0;
}

export function unlock(args) {
  const { pos, opts, problem } = parse(args, ["who"], ["force"]);
  if (problem) return usage(problem, LOCK_USE);
  const p = mapOf(pos?.[0]);
  if (!p) return usage(`unlock: ${pos?.[0] ?? "(none)"} is not an Engagement folder (no _agent/map.md)`, LOCK_USE);
  if (!opts.who?.trim()) return usage("unlock: needs --who", LOCK_USE);
  const text = readFileSync(p, "utf8");
  const held = readLock(text);
  if (!held) {
    console.log("unlock: no lock");
    return 0;
  }
  if (held.who !== opts.who.trim() && !opts.force) {
    console.error(`unlock: lock held by ${held.who} (${held.skill}, since ${held.since}); clear it only with --force after asking`);
    return 1;
  }
  writeFileSync(p, text.replace(/^lock:.*\n\n?/m, ""));
  console.log(`unlock: cleared lock of ${held.who} (${held.skill})`);
  return 0;
}
