// Neome App Builds (App baseline): Neome's own catalog App JSON, Build code NA-<catalog slug>.
// Spec: Template bank §10; ticket .scratch/template-bank/issues/12-neome-app-builds.md.
//
// <raw>/neome-template/            (gitignored, like the rest of the raw dir; never committed)
//   *.json                         Neome App Build JSON (one App = one Module), dropped by the maintainer
//   app-slugs.txt                  hand-kept map, one line per App: `<catalog slug> | <App name as in the JSON>`
//                                  (# = comment). Slug must be in reference/neome-app-catalog-slugs.json.
//                                  A JSON whose name is not in the map = hard stop (never guessed).
// No scrub word list (Neome-owned); the email / phone / message-body leak check still runs. NA Builds never go
// into <raw>/builds.json (the client code map whose names are scrub words).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBuild, pickBuilds, versionId } from "./build-json.mjs";

export const APP_DIR = "neome-template";
export const APP_SLUGS = "app-slugs.txt";
export const NA_CODE = /^NA-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
export const isApp = (code) => NA_CODE.test(String(code));
const SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const CATALOG = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "reference", "neome-app-catalog-slugs.json");

/** Catalog slugs (Set). */
export const catalogSlugs = (path = CATALOG) => new Set(JSON.parse(readFileSync(path, "utf8")).apps.map((a) => a.slug));

/** app-slugs.txt → {map: Map name → slug, problems: [text]}. Missing file = empty map, no problem. */
export function readAppSlugs(raw, catalogPath = CATALOG) {
  const p = join(raw, APP_DIR, APP_SLUGS);
  const map = new Map();
  const problems = [];
  if (!existsSync(p)) return { map, problems, path: p, exists: false };
  const slugs = catalogSlugs(catalogPath);
  const seen = new Map();
  readFileSync(p, "utf8").split(/\r?\n/).forEach((line, i) => {
    const t = line.trim();
    if (!t || t.startsWith("#")) return;
    const at = `${APP_SLUGS} line ${i + 1}`;
    const m = t.match(/^(\S+)\s*\|\s*(.+)$/);
    if (!m) return problems.push(`${at}: must be "<catalog slug> | <App name>"`);
    const [, slug, name] = m;
    if (!SLUG.test(slug)) return problems.push(`${at}: "${slug}" is not a slug`);
    if (!slugs.has(slug)) return problems.push(`${at}: ${slug} not in Neome App catalog slugs`);
    if (map.has(name.trim())) return problems.push(`${at}: App name listed twice`);
    if (seen.has(slug)) return problems.push(`${at}: ${slug} already used on line ${seen.get(slug)}`);
    seen.set(slug, i + 1);
    map.set(name.trim(), slug);
  });
  return { map, problems, path: p, exists: true };
}

/**
 * Neome App Build JSON in <raw>/neome-template/ after dedupe (newest version per entId):
 * {builds: [{file: "neome-template/<f>", entId, version, code}], problems, unreadable}.
 * Unknown App name, two JSON for one slug, or a bad app-slugs.txt line → problems (hard stop for the caller).
 */
export function appBuilds(raw, catalogPath = CATALOG) {
  const dir = join(raw, APP_DIR);
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).sort() : [];
  if (!files.length) return { builds: [], problems: [], unreadable: [] };
  const { map, problems, path, exists } = readAppSlugs(raw, catalogPath);
  if (!exists) return { builds: [], problems: [`${path} missing: one line per App, "<catalog slug> | <App name>"`], unreadable: [] };
  const entries = [];
  const unreadable = [];
  for (const f of files) {
    try { entries.push({ file: `${APP_DIR}/${f}`, ent: parseBuild(readFileSync(join(dir, f), "utf8")) }); }
    catch { unreadable.push(`${APP_DIR}/${f}`); }
  }
  const builds = [];
  const bySlug = new Map();
  for (const b of pickBuilds(entries).builds) {
    const name = String(b.ent.details?.name ?? "").trim();
    const slug = map.get(name);
    if (!slug) { problems.push(`unknown App name "${name}" (${b.file}): add "<catalog slug> | ${name}" to ${APP_SLUGS}`); continue; }
    if (bySlug.has(slug)) { problems.push(`${b.file} and ${bySlug.get(slug)} both map to ${slug}: keep one`); continue; }
    bySlug.set(slug, b.file);
    builds.push({ file: b.file, entId: b.ent.entId, version: versionId(b.ent), code: `NA-${slug}` });
  }
  return { builds, problems, unreadable };
}
