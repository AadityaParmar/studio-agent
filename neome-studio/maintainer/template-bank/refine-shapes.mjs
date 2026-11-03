// Template bank refine tool: shape checks for tag sheets, change lists and review verdicts, and the review rule
// (auto-apply or ask the maintainer). Shapes: prompts/shapes.md (same folder). Script only; no model.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { frontMatter } from "../../engine/markdown.mjs";
import { loadBank } from "../../engine/template-bank.mjs";
import { EMAIL, isPhone, PHONE } from "./scrub.mjs";
import { isApp } from "./apps.mjs";
import { areaFiles, BUILD_SHEET, CODE, scrubbedDir, scrubHit, tagSheets } from "./refine-state.mjs";

export const CHANGE_KINDS = ["add", "enhance", "split", "merge", "rename", "retire"];
export const AUTO_KINDS = ["add", "enhance", "rename"]; // may be auto-applied; split / merge / retire always ask
const ID = /^(PAT|TMOD|TPL|APP)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
// App baseline IDs are fixed by the catalog slug: never renamed, split or merged.
export const APP_KINDS = ["add", "enhance", "retire"];
export const prefixOf = (id) => String(id).split("-")[0];

const text = (v) => typeof v === "string" && v.trim() !== "";
const oneLine = (v) => text(v) && !/\n/.test(v.trim());
const textList = (v) => Array.isArray(v) && v.every(text);
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const unknownKeys = (o, keys, at, err) => { for (const k of Object.keys(o)) if (!keys.includes(k)) err(`${at}unknown key ${k}`); };

/** Leak check on model-written text: scrub word (by number), email, phone. [] = clean. */
export function leaks(str, words) {
  const out = [];
  const n = scrubHit(str, words);
  if (n) out.push(`scrub word #${n} found`);
  if (new RegExp(EMAIL.source).test(str)) out.push("email found");
  if ((String(str).match(PHONE) || []).some(isPhone)) out.push("phone found");
  return out;
}

const liveIds = (bankDir) => new Map(loadBank(bankDir).entries.map((e) => [e.id, e]));

function checkProofList(list, source, at, err) {
  if (!Array.isArray(list) || !list.length) return err(`${at}proof must be a non-empty list of lines from ${source.name}`);
  list.forEach((line, i) => {
    if (!oneLine(line)) return err(`${at}proof ${i + 1} must be one line of text`);
    if (!source.text.includes(line.trim())) err(`${at}proof ${i + 1} not found in ${source.name} (quote lines as written)`);
  });
}

function checkGuessId(id, prefix, live, at, err) {
  if (id === "new") return;
  if (typeof id !== "string" || !id.startsWith(`${prefix}-`)) return err(`${at}id must be "new" or a ${prefix}- ID from the Template bank names`);
  if (!live.has(id)) err(`${at}id ${id} not in Template bank (use "new")`);
}

/**
 * Tag sheets of one Build vs its scrubbed digest. {errors: ["<sheet>: …"], sheets: n}.
 * Expected: one <area>.yaml per scrubbed area file + _build.yaml for the overview.
 */
export function validateTags(raw, code, bankDir, words = []) {
  const errors = [];
  const areas = areaFiles(raw, code);
  if (!areas.length) return { errors: [`no scrubbed digest for ${code} (run prepare)`], sheets: 0 };
  const sheets = tagSheets(raw, code);
  const byName = new Map(sheets.map((s) => [s.sheet, s]));
  const want = [...areas.map((a) => a.sheet), BUILD_SHEET];
  for (const w of want) if (!byName.has(w)) errors.push(`${w}: missing`);
  for (const s of sheets) if (!want.includes(s.sheet)) errors.push(`${s.sheet}: no Build area with this file name`);
  const live = liveIds(bankDir);
  const src = (file) => ({ name: file, text: readFileSync(join(scrubbedDir(raw, code), file), "utf8") });
  const areaNames = areas.map((a) => a.area);

  for (const s of sheets) {
    if (!want.includes(s.sheet)) continue;
    const err = (m) => errors.push(`${s.sheet}: ${m}`);
    if (s.error) { err(`not valid YAML (${s.error})`); continue; }
    for (const l of leaks(s.text, words)) err(l);
    const d = s.data;
    if (!isObj(d)) { err("must be a YAML map"); continue; }
    if (d.build !== code) err(`build must be ${code}`);
    if (s.sheet === BUILD_SHEET) {
      unknownKeys(d, ["build", "file", "template"], "", err);
      if (d.file !== "overview.md") err("file must be overview.md");
      const t = d.template;
      if (t === null || t === undefined) continue;
      if (!isObj(t)) { err("template must be a map or null"); continue; }
      unknownKeys(t, ["name", "id", "businessType", "core", "optional", "links", "proof"], "template: ", err);
      if (!text(t.name)) err("template: name missing");
      checkGuessId(t.id, "TPL", live, "template: ", err);
      if (!text(t.businessType)) err("template: businessType missing");
      if (!textList(t.core) || !t.core.length) err("template: core must be a non-empty list of Build area names");
      for (const a of [...(textList(t.core) ? t.core : []), ...(textList(t.optional) ? t.optional : [])]) {
        if (!areaNames.includes(a)) err(`template: "${a}" is not a Build area of ${code}`);
      }
      if (t.optional !== undefined && !textList(t.optional)) err("template: optional must be a list");
      if (t.links !== undefined && !textList(t.links)) err("template: links must be a list of text");
      checkProofList(t.proof, src("overview.md"), "template: ", err);
      continue;
    }
    const area = areas.find((a) => a.sheet === s.sheet);
    unknownKeys(d, ["build", "area", "file", "weight", "templateModule", "patterns", ...(isApp(code) ? ["gives"] : [])], "", err);
    if (isApp(code)) {
      if (!textList(d.gives)) err("gives must be a list of text (Neome App Build: what the App gives out of the box)");
      else if (!d.gives.length && d.weight !== "low") err("gives must not be empty (Neome App Build area)");
    }
    if (d.area !== area.area) err(`area must be "${area.area}"`);
    if (d.file !== area.file) err(`file must be ${area.file}`);
    if (!["normal", "low"].includes(d.weight)) err("weight must be normal or low");
    const source = src(area.file);
    const m = d.templateModule;
    if (m !== null && m !== undefined) {
      if (!isObj(m)) err("templateModule must be a map or null");
      else {
        unknownKeys(m, ["name", "id", "needs", "steps", "sheets", "roles", "proof"], "templateModule: ", err);
        if (!text(m.name)) err("templateModule: name missing");
        checkGuessId(m.id, "TMOD", live, "templateModule: ", err);
        for (const k of ["needs", "steps", "sheets", "roles"]) if (!textList(m[k])) err(`templateModule: ${k} must be a list of text (may be empty)`);
        checkProofList(m.proof, source, "templateModule: ", err);
      }
    }
    if (!Array.isArray(d.patterns)) { err("patterns must be a list (may be empty)"); continue; }
    d.patterns.forEach((p, i) => {
      const at = `patterns ${i + 1}: `;
      if (!isObj(p)) return err(`${at}must be a map`);
      unknownKeys(p, ["name", "id", "task", "how", "workaround", "why", "proof"], at, err);
      for (const k of ["name", "task", "how"]) if (!text(p[k])) err(`${at}${k} missing`);
      checkGuessId(p.id, "PAT", live, at, err);
      if (typeof p.workaround !== "boolean") err(`${at}workaround must be true or false`);
      if (p.workaround === true && !text(p.why)) err(`${at}why missing (needed when workaround: true)`);
      if (p.workaround === false && p.why !== undefined && p.why !== null && p.why !== "" && !text(p.why)) err(`${at}why must be text`);
      checkProofList(p.proof, source, at, err);
    });
  }
  return { errors, sheets: sheets.length };
}

/** Area names of one Build's tag sheets ("*" = whole Build) and a finder for proof lines. */
function tagIndex(raw, code) {
  const sheets = tagSheets(raw, code).filter((s) => s.data && isObj(s.data));
  const byArea = new Map();
  for (const s of sheets) byArea.set(s.sheet === BUILD_SHEET ? "*" : String(s.data.area), s.text);
  return byArea;
}

/** "<change> <main ID>": the key review verdicts and maintainer answers use. */
export function refOf(c) {
  if (!isObj(c)) return "?";
  const main = { rename: c.from, split: c.from, merge: c.into }[c.change] ?? c.id;
  return `${c.change} ${main}`;
}

/** IDs a change creates / removes / keeps. */
export function idsOf(c) {
  switch (c.change) {
    case "add": return { creates: [c.id], removes: [], keeps: [] };
    case "enhance": return { creates: [], removes: [], keeps: [c.id] };
    case "retire": return { creates: [], removes: [c.id], keeps: [] };
    case "rename": return { creates: [c.to], removes: [c.from], keeps: [] };
    case "split": return { creates: (Array.isArray(c.into) ? c.into : []).map((p) => p?.id), removes: [c.from], keeps: [] };
    case "merge": return { creates: [], removes: Array.isArray(c.from) ? c.from : [], keeps: [c.into] };
    default: return { creates: [], removes: [], keeps: [] };
  }
}

const KEYS = {
  add: ["change", "id", "seenIn", "reason", "proof"],
  enhance: ["change", "id", "seenIn", "reason", "proof"],
  rename: ["change", "from", "to", "name", "seenIn", "reason", "proof"],
  split: ["change", "from", "into", "reason", "proof"],
  merge: ["change", "from", "into", "seenIn", "reason", "proof"],
  retire: ["change", "id", "reason", "proof"],
};

export const readChanges = (dir) => {
  const p = join(dir, "changes.yaml");
  if (!existsSync(p)) return { error: "changes.yaml missing" };
  try {
    const d = parse(readFileSync(p, "utf8"));
    if (!isObj(d) || !Array.isArray(d.changes)) return { error: "changes.yaml: needs `changes:` list (may be empty)" };
    return { changes: d.changes };
  } catch (e) {
    return { error: `changes.yaml: not valid YAML (${e.message.split("\n")[0]})` };
  }
};

/** Draft entry of a run: {fm, body, text} | null | {error}. */
export function readDraft(dir, id) {
  const p = join(dir, "drafts", `${id}.md`);
  if (!existsSync(p)) return null;
  const t = readFileSync(p, "utf8");
  try {
    const { fm, body } = frontMatter(t);
    if (!isObj(fm)) return { error: "front matter missing" };
    return { fm, body, text: t };
  } catch {
    return { error: "front matter is not valid YAML" };
  }
}

/**
 * Change list shape + IDs + drafts + proof lines. ctx = {raw, bankDir, dir (run dir), builds (cluster input codes),
 * words}. {errors, warnings, changes}.
 */
export function validateChanges(changes, { raw, bankDir, dir, builds, words = [] }) {
  const errors = [];
  const warnings = [];
  const { entries, changelog } = loadBank(bankDir);
  const live = new Map(entries.map((e) => [e.id, e]));
  const everUsed = new Set([...live.keys(), ...changelog.flatMap((c) => [...c.ids, ...(c.replacedBy ?? [])])]);
  const tags = new Map();
  const tagsOf = (code) => { if (!tags.has(code)) tags.set(code, tagIndex(raw, code)); return tags.get(code); };
  const touched = new Map();
  const refs = new Set();

  changes.forEach((c, i) => {
    const ref = refOf(c);
    const err = (m) => errors.push(`change ${i + 1} (${ref}): ${m}`);
    if (!isObj(c)) return err("must be a map");
    if (!CHANGE_KINDS.includes(c.change)) return err(`change must be one of ${CHANGE_KINDS.join(", ")}`);
    if (refs.has(ref)) err("same change listed twice");
    refs.add(ref);
    unknownKeys(c, KEYS[c.change], "", err);
    if (!oneLine(c.reason)) err("reason must be one line of text");
    for (const l of leaks(JSON.stringify(c), words)) err(l);

    const { creates, removes, keeps } = idsOf(c);
    for (const id of [...creates, ...removes, ...keeps]) {
      if (typeof id !== "string" || !ID.test(id)) { err(`"${id}" is not a Template bank ID`); continue; }
      if (touched.has(id)) err(`${id} already used by change ${touched.get(id)}; one change per ID`);
      else touched.set(id, i + 1);
    }
    for (const id of creates) if (ID.test(id ?? "") && everUsed.has(id)) err(`${id} already used in Template bank or CHANGELOG.md; IDs never reused`);
    for (const id of [...removes, ...keeps]) if (ID.test(id ?? "") && !live.has(id)) err(`${id} not in Template bank`);
    const kinds = new Set([...creates, ...removes, ...keeps].filter((x) => ID.test(x ?? "")).map(prefixOf));
    if (kinds.size > 1) err("all IDs of one change must be the same kind (PAT / TMOD / TPL / APP)");
    if (kinds.has("APP") && !APP_KINDS.includes(c.change)) err("App baseline IDs are fixed (APP-<catalog slug>): add, enhance or retire only");
    if (kinds.has("APP") && ["add", "enhance"].includes(c.change) && Array.isArray(c.seenIn)) {
      const own = `NA-${String(c.id).slice(4)}`;
      c.seenIn.forEach((r, k) => { if (isObj(r) && r.build !== own) err(`seenIn row ${k + 1}: an App baseline is seen only in its own Neome App Build ${own}`); });
    }
    if (c.change === "merge" && (!Array.isArray(c.from) || !c.from.length)) err("from must be a non-empty list of IDs");
    if (c.change === "merge" && Array.isArray(c.from) && c.from.includes(c.into)) err("into must not be in from");
    if (c.change === "split" && (!Array.isArray(c.into) || c.into.length < 2)) err("into must list two or more {id, seenIn}");
    if (c.change === "rename" && c.name !== undefined && !oneLine(c.name)) err("name must be one line of text");

    // Proof lines: quoted from this run's tag sheets.
    const proof = c.proof ?? [];
    if (!Array.isArray(proof) || (c.change !== "retire" && !proof.length)) err("proof must be a non-empty list of {build, area, line}");
    else proof.forEach((p, j) => {
      const at = `proof ${j + 1}: `;
      if (!isObj(p) || !CODE.test(String(p.build)) || !text(p.area) || !oneLine(p.line)) return err(`${at}must be {build: NB-NN|NA-<slug>, area, line}`);
      const sheet = tagsOf(p.build).get(p.area);
      if (sheet === undefined) err(`${at}no tag sheet for ${p.build} / ${p.area}`);
      else if (!sheet.includes(p.line.trim())) err(`${at}line not found in tag sheet ${p.build} / ${p.area}`);
    });

    // seenIn rows: Builds of this run (split: also the Builds the old entry already has).
    const own = c.change === "split" && live.has(c.from) ? new Set((live.get(c.from).fm.seenIn ?? []).map((r) => r?.build)) : new Set();
    const rowSets = c.change === "split" ? (Array.isArray(c.into) ? c.into : []).map((p, k) => [`into ${k + 1}: `, p?.seenIn]) : [["", c.seenIn ?? []]];
    if (c.change === "split") (Array.isArray(c.into) ? c.into : []).forEach((p, k) => { if (!isObj(p)) err(`into ${k + 1}: must be {id, seenIn}`); else unknownKeys(p, ["id", "seenIn"], `into ${k + 1}: `, err); });
    if (["add"].includes(c.change) && (!Array.isArray(c.seenIn) || !c.seenIn.length)) err("seenIn must be a non-empty list of {build, area}");
    for (const [at, rows] of rowSets) {
      if (!Array.isArray(rows)) { err(`${at}seenIn must be a list`); continue; }
      if (c.change === "split" && !rows.length) err(`${at}seenIn must not be empty`);
      rows.forEach((r, k) => {
        const where = `${at}seenIn row ${k + 1}: `;
        if (!isObj(r) || !CODE.test(String(r.build)) || !text(String(r.area ?? ""))) return err(`${where}must be {build: NB-NN|NA-<slug>, area}`);
        if (!builds.includes(r.build) && !own.has(r.build)) return err(`${where}${r.build} not in this run's tag sheets`);
        if (own.has(r.build) && !builds.includes(r.build)) return;
        if (!tagsOf(r.build).has(String(r.area))) err(`${where}${r.build} has no Build area "${r.area}"`);
      });
    }
    if (c.change === "split" && live.has(c.from)) {
      const parts = (Array.isArray(c.into) ? c.into : []).flatMap((p) => (Array.isArray(p?.seenIn) ? p.seenIn : []));
      for (const r of live.get(c.from).fm.seenIn ?? []) {
        if (!builds.includes(r.build) && !parts.some((x) => x.build === r.build && x.area === r.area)) {
          warnings.push(`change ${i + 1} (${ref}): seenIn ${r.build} / ${r.area} of ${c.from} goes to no part`);
        }
      }
    }

    // Drafts: needed for add and split parts; optional for enhance, rename, merge (kept ID); none for retire.
    const needDraft = c.change === "add" ? [c.id] : c.change === "split" ? creates : [];
    const mayDraft = { enhance: [c.id], rename: [c.to], merge: [c.into] }[c.change] ?? [];
    for (const id of [...needDraft, ...mayDraft]) {
      if (!ID.test(id ?? "")) continue;
      const d = readDraft(dir, id);
      if (!d) { if (needDraft.includes(id)) err(`drafts/${id}.md missing`); continue; }
      if (d.error) { err(`drafts/${id}.md: ${d.error}`); continue; }
      if (d.fm.id !== id) err(`drafts/${id}.md: id must be ${id}`);
      for (const l of leaks(d.text, words)) err(`drafts/${id}.md: ${l}`);
    }
  });
  return { errors, warnings };
}

export const readVerdicts = (dir) => {
  const p = join(dir, "verdicts.yaml");
  if (!existsSync(p)) return { error: "verdicts.yaml missing" };
  try {
    const d = parse(readFileSync(p, "utf8"));
    if (!isObj(d) || !Array.isArray(d.verdicts)) return { error: "verdicts.yaml: needs `verdicts:` list" };
    return { verdicts: d.verdicts };
  } catch (e) {
    return { error: `verdicts.yaml: not valid YAML (${e.message.split("\n")[0]})` };
  }
};

/** Verdicts must name every change once. {errors}. */
export function validateVerdicts(verdicts, changes, words = []) {
  const errors = [];
  const want = changes.map(refOf);
  const seen = new Set();
  verdicts.forEach((v, i) => {
    const err = (m) => errors.push(`verdict ${i + 1}${isObj(v) && v.ref ? ` (${v.ref})` : ""}: ${m}`);
    if (!isObj(v)) return err("must be a map");
    unknownKeys(v, ["ref", "verdict", "backed", "agrees", "note", "question"], "", err);
    if (!want.includes(v.ref)) err(`ref must be one of the change refs ("<change> <ID>")`);
    if (seen.has(v.ref)) err("ref listed twice");
    seen.add(v.ref);
    if (!["apply", "ask", "drop"].includes(v.verdict)) err("verdict must be apply, ask or drop");
    for (const k of ["backed", "agrees"]) if (typeof v[k] !== "boolean") err(`${k} must be true or false`);
    if (!oneLine(v.note)) err("note must be one line of text");
    if (v.question !== undefined && !oneLine(v.question)) err("question must be one line of text");
    for (const l of leaks(JSON.stringify(v), words)) err(l);
  });
  for (const r of want) if (!seen.has(r)) errors.push(`no verdict for ${r}`);
  return { errors };
}

/**
 * Review rule (ticket 09): auto-apply add / enhance / rename when the reviewer says apply, proof backs it and it
 * agrees with the clusterer. Everything else asks the maintainer. Nothing is dropped without the maintainer.
 */
export function decide(changes, verdicts) {
  const byRef = new Map(verdicts.map((v) => [v.ref, v]));
  return changes.map((c) => {
    const ref = refOf(c);
    const v = byRef.get(ref);
    const why = [];
    if (!AUTO_KINDS.includes(c.change)) why.push(`${c.change} changes IDs`);
    if (!v.backed) why.push("proof lines do not back it");
    if (!v.agrees) why.push("reviewer disagrees with clusterer");
    if (v.verdict === "drop") why.push("reviewer says drop");
    if (v.verdict === "ask") why.push("reviewer unsure");
    if (!why.length) return { ref, decision: "apply", by: "review", note: v.note };
    return { ref, decision: "ask", by: null, why, note: v.note, question: v.question ?? `${ref}: ${c.reason} Apply?` };
  });
}
