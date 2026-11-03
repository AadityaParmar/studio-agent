#!/usr/bin/env node
// Scrub (Template bank, spec §3; ticket .scratch/template-bank/issues/06-mining-pipeline.md). Script, no model:
// runs right after digest.mjs, before any model of any provider sees a digest.
//
// Per Build word list <raw>/scrub/<NB-NN>.txt (gitignored), seeded from Build name + about on first run; the
// maintainer adds client, people and place names once. Removes: Build name → «build», about → «about», listed
// words → «name» (case-insensitive, also inside longer names), email → «email», phone → «phone», message
// bodies → «msg». Sheet / field names stay unless they hold a listed word. File names are scrubbed the same way.
// HARD FAIL: if a listed word, the Build name, the about, a message body, an email or a phone survives in any
// output file (checked accent- and case-blind), the Build's scrubbed dir is removed and the exit code is 1.
//
// Neome App Builds (NA-<slug>, Neome-owned): no word list, Build name and about kept; message bodies, email and
// phone are still scrubbed and leak-checked.
//
//   node neome-studio/maintainer/template-bank/scrub.mjs [--raw <dir>] [NB-NN | NA-<slug> …]
//     reads <raw>/digests/<NB-NN>/ (all Builds by default), writes <raw>/scrubbed/<NB-NN>/.
//     stdout: seeded | NB-NN | <word list> | …   ·   scrub | NB-NN | <n> files clean
//             leak | NB-NN | <file>:<line> | Build name|about|word #<n>|message body|email|phone   (line 0 = file name)
//             error | NB-NN | <text>
//     Exit 0 = all clean, 1 = any leak or error, 2 = bad arguments or raw dir not gitignored.
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inside, parseArgs, rawDirProblem, resetInside, writeInside } from "./raw-dir.mjs";
import { slugify } from "./render.mjs";

export const MSG = "«msg»";
const USE = "Usage: scrub.mjs [--raw <dir>] [NB-NN | NA-<slug> …]";
const CODE = /^(?:NB-\d+|NA-[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/;
const DIGEST_FILE = /\.(md|mmd)$/;

// Generic words never seeded (they name sheets and fields, not clients). The maintainer can still list them.
const STOP = new Set(`about also and app apps application account accounts approval approvals association attendance
build business call care center centre clinic college community company consulting construction contact corp
corporation crm customer customers data demo digital employee employees enterprise
enterprises erp facility finance food foods for from global group hospital hrms human industries international
inventory leave limited logistics ltd maintenance management manufacturing master member members mgmt mobile
module neome network office online operations order orders owners payroll platform portal private process product
products project projects property purchase request requests resource resources retail sales school service
services shop shops software solution solutions staff store studio system systems team tech technologies technology
test that the this tracker tracking trading ventures with workflow your`.split(/\s+/));

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Accent-, case- and zero-width-blind form used by the leak check. */
export const norm = (s) => String(s).normalize("NFKD").replace(/\p{M}/gu, "").replace(/[​-‍⁠﻿­]/g, "").toLowerCase();
const bounded = (s, flags = "giu") => new RegExp(`(?<![\\p{L}\\p{N}])${esc(s)}(?![\\p{L}\\p{N}])`, flags);
const TOKEN = /«(?:build|about|name|email|phone|msg)»/g; // our own placeholders never count as leaks
const usable = (s) => typeof s === "string" && s.trim().length >= 3 && s.trim() !== "—";

export const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
export const PHONE = /\+?\(?\d[\d ().-]{6,}\d/g;
// Phone: 8–15 digits with + or separators, or 10–12 bare digits. Keeps dates, 86400000-style constants, epoch ms.
export const isPhone = (m) => {
  const n = (m.match(/\d/g) || []).length;
  if (/^\d{4}-\d\d-\d\d/.test(m)) return false;
  return /^\d+$/.test(m) ? n >= 10 && n <= 12 : n >= 8 && n <= 15;
};
const MSG_MD = /msg "[^"\n]*"/g; // area .md:   msg "…"
const MSG_MMD = /msg '[^'"\n]*'?/g; // .mmd labels: msg '…'  (label may be cut before the closing quote)
const MSG_LEFT = /msg ["']/;

/** Word list text for a new Build: Build name, its words, proper names from about. One per line, # = comment. */
export function seedWordList({ name, about }) {
  const words = [];
  const add = (w) => { if (w && !words.some((x) => x.toLowerCase() === w.toLowerCase())) words.push(w); };
  const keep = (w) => w.length >= 4 && !STOP.has(w.toLowerCase()) && !/[@\d]/.test(w);
  const tokens = (s) => String(s || "").split(/\s+/).map((t) => ({ raw: t, w: t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "") })).filter((t) => t.w);
  if (usable(name)) add(name.trim());
  for (const t of tokens(name)) if (keep(t.w)) add(t.w);
  let start = true;
  for (const t of tokens(usable(about) ? about : "")) {
    if (!start && /^\p{Lu}/u.test(t.w) && keep(t.w)) add(t.w);
    start = /[.!?]$/.test(t.raw);
  }
  return [
    "# Scrub word list. One word or phrase per line; # starts a comment.",
    "# Matched case-insensitive, also inside longer names (\"Acme\" hits \"AcmeOrders\"). Keep generic words out.",
    "# Seeded from Build name + about. Add client, people and place names, then a line `# checked`, then re-run.",
    ...words,
    "",
  ].join("\n");
}

export const parseWordList = (text) => String(text).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));

/** terms = {name, about, words}. Order: messages, about, Build name, email, phone, listed words (longest first). */
export function scrubText(text, { name, about, words = [] }) {
  let s = String(text).replace(MSG_MD, `msg ${MSG}`).replace(MSG_MMD, `msg ${MSG}`);
  if (usable(about)) s = s.replace(bounded(about.trim()), "«about»");
  if (usable(name)) s = s.replace(bounded(name.trim()), "«build»");
  s = s.replace(EMAIL, "«email»").replace(PHONE, (m) => (isPhone(m) ? "«phone»" : m));
  for (const w of [...words].sort((a, b) => b.length - a.length)) s = s.replace(new RegExp(esc(w), "giu"), "«name»");
  return s;
}

/** {fileName: text} → scrubbed {fileName: text}; names scrubbed like text, so links in overview still match. */
export const scrubFiles = (files, terms) =>
  Object.fromEntries(Object.entries(files).map(([n, t]) => [scrubText(n, { ...terms, about: "" }), scrubText(t, terms)]));

/**
 * Leak check on {fileName: text}: [{file, line, what}] (line 0 = file name; `what` names a word by its number in
 * the list, never the word). Accent-, case- and zero-width-blind, so it also catches spellings replace missed.
 */
export function findLeaks(files, { name, about, words = [] }) {
  const leaks = [];
  const nName = usable(name) ? norm(name.trim()) : null;
  const nAbout = usable(about) ? norm(about.trim()) : null;
  const nWords = words.map((w) => norm(w)).filter(Boolean);
  for (const [file, text] of Object.entries(files)) {
    const slug = slugify(norm(file.replace(TOKEN, " ")));
    if (nName && slug.includes(slugify(nName))) leaks.push({ file, line: 0, what: "Build name" });
    nWords.forEach((w, i) => { if (slug.includes(slugify(w))) leaks.push({ file, line: 0, what: `word #${i + 1}` }); });
    const all = norm(String(text).replace(TOKEN, " "));
    if (nAbout && bounded(nAbout, "u").test(all)) {
      const at = all.search(bounded(nAbout, "u"));
      leaks.push({ file, line: all.slice(0, at).split("\n").length, what: "about" });
    }
    String(text).split("\n").forEach((raw, i) => {
      const line = norm(raw.replace(TOKEN, " ")), at = { file, line: i + 1 };
      if (nName && bounded(nName, "u").test(line)) leaks.push({ ...at, what: "Build name" });
      nWords.forEach((w, j) => { if (line.includes(w)) leaks.push({ ...at, what: `word #${j + 1}` }); });
      if (MSG_LEFT.test(raw)) leaks.push({ ...at, what: "message body" });
      if (new RegExp(EMAIL.source).test(raw)) leaks.push({ ...at, what: "email" });
      if ((raw.match(PHONE) || []).some(isPhone)) leaks.push({ ...at, what: "phone" });
    });
  }
  const order = (l) => (l.line === 0 ? 1 : 0);
  return leaks.sort((a, b) => order(a) - order(b));
}

/** {name: text} of the digest files (.md / .mmd) in dir. */
export const readDigestDir = (dir) =>
  Object.fromEntries(readdirSync(dir).filter((f) => DIGEST_FILE.test(f)).sort().map((f) => [f, readFileSync(join(dir, f), "utf8")]));

/** Terms for one Build from <raw>: meta.json of its digest + its word list (seeded if missing). NA-: no list. */
export function termsFor(raw, code) {
  if (code.startsWith("NA-")) return { terms: { name: "", about: "", words: [] }, listPath: null, seeded: false };
  const meta = JSON.parse(readFileSync(join(raw, "digests", code, "meta.json"), "utf8"));
  const listPath = inside(raw, "scrub", `${code}.txt`);
  let seeded = false;
  if (!existsSync(listPath)) { writeInside(raw, join("scrub", `${code}.txt`), seedWordList(meta)); seeded = true; }
  return { terms: { name: meta.name, about: meta.about, words: parseWordList(readFileSync(listPath, "utf8")) }, listPath, seeded };
}

export async function main(argv) {
  const args = parseArgs(argv);
  if (args.error) { console.error(`scrub: ${args.error}\n${USE}`); return 2; }
  if (args.rest.some((c) => !CODE.test(c))) { console.error(`scrub: Build codes look like NB-01 or NA-<slug>\n${USE}`); return 2; }
  const { raw } = args;
  const problem = rawDirProblem(raw);
  if (problem) { console.error(`scrub: ${problem}`); return 2; }
  const digests = join(raw, "digests");
  const codes = args.rest.length ? args.rest : existsSync(digests) ? readdirSync(digests).filter((c) => CODE.test(c)).sort() : [];
  if (!codes.length) { console.error(`scrub: no digests in ${digests}; run digest.mjs first`); return 1; }
  let failed = false;
  for (const code of codes) {
    const src = join(digests, code);
    if (!existsSync(join(src, "meta.json"))) { console.log(`error | ${code} | no digest (run digest.mjs)`); failed = true; continue; }
    const { terms, listPath, seeded } = termsFor(raw, code);
    if (seeded) console.log(`seeded | ${code} | ${listPath} | add client, people and place names, then re-run`);
    const out = scrubFiles(readDigestDir(src), terms);
    const dest = join("scrubbed", code);
    let leaks = findLeaks(out, terms);
    if (!leaks.length) {
      resetInside(raw, dest);
      for (const [n, t] of Object.entries(out)) writeInside(raw, join(dest, n), t);
      leaks = findLeaks(readDigestDir(inside(raw, dest)), terms); // what is on disk, not what we meant to write
    }
    if (leaks.length) {
      rmSync(inside(raw, dest), { recursive: true, force: true });
      for (const l of leaks) console.log(`leak | ${code} | ${l.file}:${l.line} | ${l.what}`);
      failed = true;
      continue;
    }
    console.log(`scrub | ${code} | ${Object.keys(out).length} files clean`);
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
