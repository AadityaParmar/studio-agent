#!/usr/bin/env node
// Build digest (Template bank, spec §2; ticket .scratch/template-bank/issues/04-build-digest-prototype.md v2).
// Maintainer only, no model. Neome Build JSON → per Build, in <raw>/digests/<NB-NN>/:
//   overview.md            about, counts, roles, Build areas (size each), chat-only Groups, cross-area refs, option lists
//   <area>.md              one per Build area: actions, sheets + fields + logic, reports, other forms, workflows
//                          (cap 25 KB, AREA_CAP: bigger areas still written, flagged `over | …` for the maintainer)
//   build.mmd              Mermaid: Build areas + cross-area ref counts
//   <area>.refs.mmd        Mermaid: sheet refs of the area, outside targets marked
//   <area>.wf.mmd          Mermaid: one flowchart per workflow (from workflow.edgeMap)
//   meta.json              entId, version, Build name, about (scrub seeds its word list from it)
// Also <raw>/builds.json: Build code → {entId, name} (client map, raw only). Codes stay per entId; a new Build
// takes a code from <raw>/scrub/nb-map.txt (`NB-NN <Build name> …`) when its name is there, else the next free one.
// Output holds client data: run scrub.mjs before any model sees it.
//
//   node neome-studio/maintainer/template-bank/digest.mjs [--raw <dir>] [<build.json> …]
//     <dir> default .scratch/template-bank/raw (must be gitignored); inputs default <dir>/*.json.
//     stdout: skip | <file> | <reason>   ·   digest | NB-NN | <sizes>   ·   kinds | NB-NN | unknown: …
//             over | NB-NN | <area file> | <n> KB > 25 KB cap
//     Exit 0 = done, 1 = no input / unreadable JSON, 2 = bad arguments or raw dir not gitignored.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assignAreas, UN } from "./areas.mjs";
import { buildIndex, parseBuild, pickBuilds, unknownKinds } from "./build-json.mjs";
import { buildMmd, refsMmd, wfMmd } from "./mermaid.mjs";
import { renderArea, renderOverview, slugify } from "./render.mjs";
import { parseArgs, rawDirProblem, resetInside, writeInside } from "./raw-dir.mjs";

export { parseBuild, pickBuilds, unknownKinds };

const here = dirname(fileURLToPath(import.meta.url));
export const KINDS = JSON.parse(readFileSync(join(here, "kinds.json"), "utf8"));
const USE = "Usage: digest.mjs [--raw <dir>] [<build.json> …]";
/** Build area digest size cap (chars). Spec §10: 25 KB for every Build (was 17 KB). */
export const AREA_CAP = 25 * 1024;

/**
 * One Build → {files: {name: text}, meta, stats}. Pure: no disk.
 * stats: {overview, areas, maxArea, totalArea (chars), modules, sheets, orphanSheets, overCap: [{file, size}]}.
 */
export function digestBuild(ent, { cap = AREA_CAP } = {}) {
  const ix = buildIndex(ent);
  const ar = assignAreas(ent, ix);
  const files = {};
  const areaFiles = new Map(), sizes = new Map(), used = new Set();
  for (const a of ar.list) {
    let base = slugify(a.name), n = 1;
    while (used.has(base + (n > 1 ? `-${n}` : ""))) n++;
    base += n > 1 ? `-${n}` : "";
    used.add(base);
    areaFiles.set(a.key, `${base}.md`);
  }
  for (const a of ar.list) {
    const file = areaFiles.get(a.key);
    const body = renderArea(a, ix, ar);
    files[file] = body;
    files[file.replace(/\.md$/, ".refs.mmd")] = refsMmd(a, ix, ar);
    const wf = wfMmd(a, ix);
    if (wf) files[file.replace(/\.md$/, ".wf.mmd")] = wf;
    sizes.set(a.key, body.length);
  }
  files["overview.md"] = renderOverview(ix, ar, areaFiles, sizes);
  files["build.mmd"] = buildMmd(ix, ar);
  const areaSizes = [...sizes.values()];
  return {
    files,
    meta: { entId: ent.entId, version: ent.version, name: ent.details.name, about: ent.details.about || "" },
    stats: {
      overview: files["overview.md"].length,
      areas: ar.list.length,
      maxArea: Math.max(0, ...areaSizes),
      totalArea: areaSizes.reduce((x, y) => x + y, 0),
      modules: ix.modules.length,
      sheets: ix.sheets.length,
      orphanSheets: ar.areas.get(UN)?.sheets.size || 0,
      overCap: ar.list.filter((a) => sizes.get(a.key) > cap).map((a) => ({ file: areaFiles.get(a.key), size: sizes.get(a.key) })),
    },
  };
}

const codeNum = (c) => Number(c.slice(3));
const pad = (n) => `NB-${String(n).padStart(2, "0")}`;

/**
 * Build codes. registry = {"NB-NN": {entId, name}} (from <raw>/builds.json). Returns a new registry holding every
 * ent: same entId keeps its code; else the code nbMapText gives its name (`NB-NN <name>[ …]`); else next free.
 */
export function assignCodes(ents, registry = {}, nbMapText = "") {
  const reg = structuredClone(registry);
  const seeded = [...nbMapText.matchAll(/^(NB-\d+)\s+(.*?)\s*$/gm)].map((m) => ({ code: m[1], text: m[2] }));
  const taken = () => new Set([...Object.keys(reg), ...seeded.map((s) => s.code)]);
  for (const ent of ents) {
    const name = ent.details?.name || "";
    let code = Object.keys(reg).find((c) => reg[c].entId === ent.entId);
    if (!code) {
      const hit = seeded.find((s) => !reg[s.code] && (s.text === name || s.text.startsWith(name + " ")));
      code = hit ? hit.code : pad(Math.max(0, ...[...taken()].map(codeNum)) + 1);
    }
    reg[code] = { entId: ent.entId, name };
  }
  return Object.fromEntries(Object.entries(reg).sort(([a], [b]) => codeNum(a) - codeNum(b)));
}

export async function main(argv) {
  const args = parseArgs(argv);
  if (args.error) { console.error(`digest: ${args.error}\n${USE}`); return 2; }
  const { raw } = args;
  const problem = rawDirProblem(raw);
  if (problem) { console.error(`digest: ${problem}`); return 2; }
  const files = args.rest.length
    ? args.rest.map((f) => resolve(f))
    : existsSync(raw) ? readdirSync(raw).filter((f) => f.endsWith(".json") && f !== "builds.json").sort().map((f) => join(raw, f)) : [];
  if (!files.length) { console.error(`digest: no Build JSON in ${raw}`); return 1; }

  const entries = [];
  for (const file of files) {
    try { entries.push({ file: basename(file), path: file, ent: parseBuild(readFileSync(file, "utf8")) }); }
    catch (e) { console.error(`digest: ${basename(file)}: ${e.message}`); return 1; }
  }
  const { builds, skipped } = pickBuilds(entries);
  for (const s of skipped) console.log(`skip | ${s.file} | ${s.reason}`);

  const regPath = join(raw, "builds.json");
  const nbMap = join(raw, "scrub", "nb-map.txt");
  const reg = assignCodes(
    builds.map((b) => b.ent),
    existsSync(regPath) ? JSON.parse(readFileSync(regPath, "utf8")) : {},
    existsSync(nbMap) ? readFileSync(nbMap, "utf8") : "",
  );
  writeInside(raw, "builds.json", JSON.stringify(reg, null, 2) + "\n");
  const codeOf = new Map(Object.entries(reg).map(([c, v]) => [v.entId, c]));

  for (const { path, ent } of builds) for (const l of writeDigest(raw, codeOf.get(ent.entId), ent, statSync(path).size)) console.log(l);
  return 0;
}

/**
 * Digest one Build into <raw>/digests/<code>/ (code = NB-NN or NA-<slug>). Returns the stdout lines
 * (digest | over | kinds). Used by main and by the refine tool for Neome App Builds (no builds.json entry).
 */
export function writeDigest(raw, code, ent, jsonBytes = 0) {
  const d = digestBuild(ent);
  resetInside(raw, join("digests", code));
  for (const [name, body] of Object.entries(d.files)) writeInside(raw, join("digests", code, name), body);
  writeInside(raw, join("digests", code, "meta.json"), JSON.stringify({ code, ...d.meta }, null, 2) + "\n");
  const s = d.stats, k = (n) => (n / 1024).toFixed(1);
  const lines = [`digest | ${code} | ${(jsonBytes / 1024).toFixed(0)} KB json → overview ${k(s.overview)} KB + ${s.areas} areas (max ${k(s.maxArea)} KB, total ${(s.totalArea / 1024).toFixed(0)} KB) · modules ${s.modules} · orphan sheets ${s.orphanSheets}/${s.sheets}`];
  for (const o of s.overCap) lines.push(`over | ${code} | ${o.file} | ${k(o.size)} KB > ${AREA_CAP / 1024} KB cap`);
  const unknown = unknownKinds(ent, KINDS);
  if (unknown.length) lines.push(`kinds | ${code} | unknown: ${unknown.join(", ")} (docs/studio-ai-docs behind? re-run extract-kinds.mjs)`);
  return lines;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
