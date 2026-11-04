// Template bank: read entries + CHANGELOG, check the format, and the "ID gone" warning.
// Format: reference/template-bank/README.md. CHANGELOG line shape: reference/template-bank/CHANGELOG.md.
// Shared contract for readers (index, ID check) and the maintainer refine tool: keep exports stable.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { frontMatter, sections } from "./markdown.mjs";

const pluginDir = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BANK_DIR = join(pluginDir, "reference", "template-bank");
const CATALOG_SLUGS = join(pluginDir, "reference", "neome-app-catalog-slugs.json");

const KINDS = {
  pattern: {
    folder: "patterns",
    prefix: "PAT",
    keys: ["id", "kind", "name", "workaround", "seenIn"],
    sections: ["Task", "How", "Workaround", "Limits", "Flowchart"],
  },
  "template-module": {
    folder: "template-modules",
    prefix: "TMOD",
    keys: ["id", "kind", "name", "aliases", "patterns", "neomeApp", "delivery", "seenIn"],
    sections: ["Usual needs", "Process steps", "Usual sheets, key fields, roles", "Neome App / Delivery hint", "Flowchart"],
  },
  template: {
    folder: "templates",
    prefix: "TPL",
    keys: ["id", "kind", "name", "businessType", "modules", "seenIn"],
    sections: ["Modules", "Links between modules", "Flowchart"],
  },
  // App baseline: what one Neome App gives out of the box, learnt from its Neome App Build (NA-<slug>).
  app: {
    folder: "apps",
    prefix: "APP",
    keys: ["id", "kind", "name", "seenIn"],
    sections: ["Gives", "Sheets, key fields, roles", "Workflows", "Flowchart"],
  },
};
// Optional "## Execute" section (MCP build steps) must open with this line.
export const EXECUTE_GUARD = "Only use this to apply this into a Studio Enterprise via MCP.";
const DELIVERY = ["standard", "configuration", "custom"]; // = BRD data schema delivery enum
const CHANGES = ["add", "enhance", "split", "merge", "rename", "retire"];
const ANY_ID = /^(PAT|TMOD|TPL|APP)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const idPattern = (prefix) => new RegExp(`^${prefix}-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`);
export const SLUG = "[a-z][a-z0-9]*(?:-[a-z0-9]+)*";
const REF_IN_TEXT = new RegExp(`\\b(?:PAT|TMOD|TPL|APP)-${SLUG}`, "g");
// Build codes: NB-NN = client Neome Build; NA-<catalog slug> = Neome App Build (App baseline).
export const BUILD_CODE = new RegExp(`^(?:NB-\\d{2,}|NA-${SLUG})$`);
export const appSlugOf = (id) => String(id).replace(/^(APP|NA)-/, "");

// Raw read: every *.md in the three kind folders + parsed CHANGELOG, with problems found on the way.
function readBank(bankDir) {
  const files = [];
  for (const [kind, { folder }] of Object.entries(KINDS)) {
    const dir = join(bankDir, folder);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((n) => n.endsWith(".md")).sort()) {
      const file = join(dir, name);
      const text = readFileSync(file, "utf8");
      let fm = null, body = text, yamlError = false;
      try {
        ({ fm, body } = frontMatter(text));
      } catch {
        yamlError = true;
      }
      files.push({ kind, folder, name, file, text, fm, body, yamlError });
    }
  }
  const logFile = join(bankDir, "CHANGELOG.md");
  const logText = existsSync(logFile) ? readFileSync(logFile, "utf8") : "";
  return { files, logText, ...parseChangelog(logText) };
}

const isEntry = (f) => f.fm && typeof f.fm === "object" && !Array.isArray(f.fm);
const entryId = (f) => (typeof f.fm?.id === "string" ? f.fm.id : basename(f.name, ".md"));

// "- <date> | <change> | <old IDs> [-> <new IDs>] | <reason>", outside ``` fences.
function parseChangelog(text) {
  const changelog = [];
  const problems = [];
  let fenced = false;
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (fenced || !line.startsWith("- ")) return;
    const bad = (msg) => problems.push(`CHANGELOG.md line ${i + 1}: ${msg}`);
    const parts = line.slice(2).split(/\s*\|\s*/);
    if (parts.length < 3) return bad('must be "- <date> | <change> | <IDs> | <reason>"');
    const [date, change, idField] = parts.map((p) => p.trim());
    const reason = parts.slice(3).join(" | ").trim();
    const before = problems.length;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) bad("date must be YYYY-MM-DD");
    if (!CHANGES.includes(change)) bad(`change "${change}" must be one of ${CHANGES.join(", ")}`);
    const [left, right, ...extra] = idField.split("->");
    const ids = splitIds(left);
    const arrow = right !== undefined;
    const news = arrow ? splitIds(right) : [];
    if (extra.length) bad('only one "->" allowed');
    for (const id of [...ids, ...news]) if (!ANY_ID.test(id)) bad(`"${id}" is not a Template bank ID`);
    if (!ids.length) bad("IDs missing");
    if (["split", "merge", "rename"].includes(change)) {
      if (!arrow || !news.length) bad(`${change} needs "old -> new"`);
      else if (change === "rename" && (ids.length !== 1 || news.length !== 1)) bad("rename is one old -> one new");
      else if (change === "merge" && news.length !== 1) bad("merge keeps one ID: old -> kept");
      else if (change === "split" && (ids.length !== 1 || news.length < 2)) bad("split is one old -> two or more new");
    } else if (arrow) bad(`${change} takes no "->"`);
    if (!reason) bad("reason missing");
    if (problems.length > before) return;
    const replaced = change === "retire" ? [] : arrow ? news : null;
    changelog.push({ date, change, ids, replacedBy: replaced, reason, line: i + 1 });
  });
  return { changelog, problems };
}
const splitIds = (s) => String(s ?? "").split(",").map((x) => x.trim()).filter(Boolean);

// Entries with parsed front matter + CHANGELOG rows. Tolerant: bad files / lines are left out (checkBank names them).
export function loadBank(bankDir = BANK_DIR) {
  const { files, changelog } = readBank(bankDir);
  const entries = files.filter(isEntry).map((f) => ({ id: entryId(f), kind: f.kind, fm: f.fm, body: f.body, file: f.file }));
  return { entries, changelog: changelog.map(({ line, ...row }) => row) };
}

// Linked App baseline of a Template module (neomeApp slug → APP-<slug> on file), or null.
export function appFor(entries, tmod) {
  const slug = tmod?.fm?.neomeApp;
  if (!slug || slug === "none") return null;
  return entries.find((e) => e.kind === "app" && e.id === `APP-${slug}`) ?? null;
}

// Direct new IDs from the last ID-changing CHANGELOG line for `id`: [] = retired, null = never replaced.
export function replacedBy(bankDir = BANK_DIR, id) {
  return lastReplace(loadBank(bankDir).changelog, id)?.replacedBy.slice() ?? null;
}
const lastReplace = (changelog, id) => changelog.findLast((c) => c.replacedBy && c.ids.includes(id));

// "ID gone" check for a `template:` / `templateModule:` value. Missing ID = warning, never error.
export function checkTemplateRef(bankDir = BANK_DIR, id) {
  if (id === "none") return { ok: true };
  const { entries, changelog } = loadBank(bankDir);
  const live = new Set(entries.map((e) => e.id));
  if (live.has(id)) return { ok: true };
  const suggest = liveSuccessors(id, live, changelog);
  const last = lastReplace(changelog, id);
  const message = !last
    ? `${id} not in Template bank. Re-match.`
    : suggest.length
      ? `${id} gone from Template bank (${last.change}). Maybe ${suggest.join(", ")}. Re-match.`
      : `${id} gone from Template bank (${last.change}), nothing replaces it. Re-match.`;
  return { ok: false, level: "warning", message, suggest };
}

// Follows replacedBy chains to IDs still on file. Order kept, no repeats, cycle safe.
function liveSuccessors(id, live, changelog, seen = new Set()) {
  if (seen.has(id)) return [];
  seen.add(id);
  if (live.has(id)) return [id];
  const out = [];
  for (const next of lastReplace(changelog, id)?.replacedBy ?? []) {
    for (const x of liveSuccessors(next, live, changelog, seen)) if (!out.includes(x)) out.push(x);
  }
  return out;
}

// Format check for one Template bank folder. Errors fail `npm test`; warnings do not.
export function checkBank(bankDir = BANK_DIR, { catalogSlugsPath = CATALOG_SLUGS, scrubWords = [] } = {}) {
  const errors = [];
  const warnings = [];
  if (!existsSync(bankDir)) return { errors, warnings };
  const { files, logText, changelog, problems } = readBank(bankDir);
  errors.push(...problems);

  let slugs = null;
  const needSlugs = files.some((f) => isEntry(f) && (f.kind === "template-module" || f.kind === "app" || (Array.isArray(f.fm.seenIn) && f.fm.seenIn.some((r) => String(r?.build ?? "").startsWith("NA-")))));
  if (needSlugs) {
    try {
      slugs = new Set(JSON.parse(readFileSync(catalogSlugsPath, "utf8")).apps.map((a) => a.slug));
    } catch {
      errors.push(`Neome App catalog slugs unreadable: ${catalogSlugsPath}`);
    }
  }

  const byId = new Map();
  for (const f of files) {
    if (f.yamlError) { errors.push(`${f.name}: front matter is not valid YAML`); continue; }
    if (!isEntry(f)) { errors.push(`${f.name}: front matter missing`); continue; }
    const id = entryId(f);
    byId.set(id, [...(byId.get(id) ?? []), f]);
  }
  const kindOf = (id) => byId.get(id)?.[0].kind;
  const execRefs = [];

  for (const f of files.filter(isEntry)) {
    const { fm, kind, folder, name, body } = f;
    const spec = KINDS[kind];
    const id = entryId(f);
    const err = (msg) => errors.push(`${id}: ${msg}`);

    if (typeof fm.id !== "string" || !fm.id) err("id missing");
    else if (fm.id !== basename(name, ".md")) errors.push(`${name}: id "${fm.id}" does not match file name`);
    if (!idPattern(spec.prefix).test(id)) err(`id must look like ${spec.prefix}-<slug> in ${folder} (lowercase words joined by -)`);
    if (fm.kind === undefined) err("kind missing");
    else if (fm.kind !== kind) err(`kind "${fm.kind}" does not match folder ${folder}`);
    for (const k of Object.keys(fm)) if (!spec.keys.includes(k)) err(`unknown front matter key ${k}`);
    if (!nonEmptyText(fm.name)) err("name missing");
    checkSeenIn(fm.seenIn, err, slugs, kind === "app" ? `NA-${appSlugOf(id)}` : null);

    if (kind === "pattern") {
      if (typeof fm.workaround !== "boolean") err("workaround must be true or false");
    }
    if (kind === "template-module") {
      if (!isTextList(fm.aliases)) err("aliases must be a list (may be empty)");
      if (!isTextList(fm.patterns)) err("patterns must be a list (may be empty)");
      else checkRefs(fm.patterns, "pattern", "patterns", kindOf, err);
      if (!nonEmptyText(fm.neomeApp)) err("neomeApp must be a catalog slug or none");
      else if (fm.neomeApp !== "none" && slugs && !slugs.has(fm.neomeApp)) err(`neomeApp "${fm.neomeApp}" not in Neome App catalog slugs`);
      if (!DELIVERY.includes(fm.delivery)) err(`delivery must be one of ${DELIVERY.join(", ")}`);
    }
    if (kind === "app" && idPattern("APP").test(id) && slugs && !slugs.has(appSlugOf(id))) err(`${appSlugOf(id)} not in Neome App catalog slugs (APP-<catalog slug>)`);
    if (kind === "template") {
      if (!nonEmptyText(fm.businessType)) err("businessType missing");
      const m = fm.modules;
      if (!m || typeof m !== "object" || Array.isArray(m)) err("modules must have core and optional lists");
      else {
        for (const k of Object.keys(m)) if (!["core", "optional"].includes(k)) err(`modules: unknown key ${k}`);
        if (!isTextList(m.core) || !m.core.length) err("modules.core must be a non-empty list");
        else checkRefs(m.core, "template-module", "modules.core", kindOf, err);
        if (m.optional !== undefined && !isTextList(m.optional)) err("modules.optional must be a list");
        else checkRefs(m.optional ?? [], "template-module", "modules.optional", kindOf, err);
      }
    }

    const secs = sections(body, 2);
    const found = new Map(secs.map((s) => [s.title, s.body]));
    for (const title of spec.sections) {
      if (!found.has(title)) err(`body section "## ${title}" missing`);
    }
    if (found.has("Flowchart") && !/^```mermaid\s*$/m.test(found.get("Flowchart"))) err("Flowchart has no mermaid block");
    if (found.has("Execute")) {
      const exec = found.get("Execute");
      if (exec.split(/\r?\n/).find((l) => l.trim()) !== EXECUTE_GUARD) err(`Execute must start with "${EXECUTE_GUARD}"`);
      if (secs.at(-1).title !== "Execute") err('"## Execute" must be the last section');
      execRefs.push([id, exec]);
    }
  }

  // Bank IDs named inside Execute steps must be on file.
  for (const [id, exec] of execRefs) {
    for (const ref of new Set(exec.match(REF_IN_TEXT) ?? [])) if (!byId.has(ref)) errors.push(`${id}: Execute: ${ref} not in Template bank`);
  }

  for (const [id, fs] of byId) {
    if (fs.length > 1) errors.push(`${id}: id used by more than one file (${fs.map((f) => `${f.folder}/${f.name}`).join(", ")})`);
  }

  // App baseline with no Template module pointing at it: fine, but say so (TMOD neomeApp is the only link).
  const linked = new Set(files.filter((f) => isEntry(f) && f.kind === "template-module").map((f) => f.fm.neomeApp));
  for (const id of byId.keys()) {
    if (kindOf(id) === "app" && !linked.has(appSlugOf(id))) warnings.push(`${id}: no Template module has neomeApp: ${appSlugOf(id)}`);
  }

  // IDs never reused: an ID retired or replaced in CHANGELOG must not be on file.
  for (const id of byId.keys()) {
    if (lastReplace(changelog, id)) errors.push(`${id}: retired or replaced in CHANGELOG.md but file still there`);
  }
  for (const c of changelog) {
    for (const next of c.replacedBy ?? []) {
      if (!byId.has(next) && !lastReplace(changelog, next)) {
        warnings.push(`CHANGELOG.md line ${c.line}: ${next} not in Template bank and not replaced later`);
      }
    }
  }

  const words = scrubWords.map((w) => String(w ?? "").trim()).filter(Boolean);
  const scan = [...files.map((f) => [basename(f.name, ".md"), f.text]), ["CHANGELOG.md", logText]];
  for (const [label, text] of scan) {
    const lower = text.toLowerCase();
    for (const w of words) if (lower.includes(w.toLowerCase())) errors.push(`${label}: scrub word "${w}" found`);
  }
  return { errors, warnings };
}

const nonEmptyText = (v) => typeof v === "string" && v.trim() !== "";
const isTextList = (v) => Array.isArray(v) && v.every(nonEmptyText);

// own = the one Build code an App baseline may name (its NA-<slug>); null = any NB-NN / NA-<catalog slug>.
function checkSeenIn(rows, err, slugs, own) {
  if (!Array.isArray(rows) || !rows.length) return err("seenIn must be a non-empty list of {build: NB-NN, area}");
  rows.forEach((row, i) => {
    const at = `seenIn row ${i + 1}`;
    if (!row || typeof row !== "object" || Array.isArray(row)) return err(`${at}: must be {build: NB-NN, area}`);
    for (const k of Object.keys(row)) if (!["build", "area"].includes(k)) err(`${at}: unknown key ${k}`);
    const b = row.build === undefined ? undefined : String(row.build);
    if (b === undefined) err(`${at}: build missing`);
    else if (own && b !== own) err(`${at}: build must be ${own}`);
    else if (!BUILD_CODE.test(b)) err(`${at}: build "${row.build}" must look like NB-NN or NA-<catalog slug>`);
    else if (b.startsWith("NA-") && slugs && !slugs.has(appSlugOf(b))) err(`${at}: ${b} not in Neome App catalog slugs`);
    if (row.area === undefined || row.area === null || String(row.area).trim() === "") err(`${at}: area missing`);
  });
}

const KIND_NAME = { pattern: "Pattern", "template-module": "Template module" };
function checkRefs(ids, want, field, kindOf, err) {
  for (const ref of ids) {
    const k = kindOf(ref);
    if (!k) err(`${field}: ${ref} not in Template bank`);
    else if (k !== want) err(`${field}: ${ref} is not a ${KIND_NAME[want]}`);
  }
}
