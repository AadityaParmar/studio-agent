// Template bank refine tool: apply an approved change list to reference/template-bank/ and write the report.
// Script only. Works on a copy first; the real Template bank changes only when checkBank passes on the copy.
//
// Order: drop old seenIn rows of this run's Builds (updated / removed; all rows with --full) → each change in list
// order → swap references to IDs that changed (rename / merge → new ID, split → all parts, retire → removed) →
// retire every entry whose seenIn hit zero → CHANGELOG lines (shape: reference/template-bank/CHANGELOG.md).
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stringify } from "yaml";
import { checkBank, loadBank } from "../../engine/template-bank.mjs";
import { idsOf, prefixOf, refOf } from "./refine-shapes.mjs";

const FOLDER = { PAT: "patterns", TMOD: "template-modules", TPL: "templates" };
const KIND = { PAT: "pattern", TMOD: "template-module", TPL: "template" };
const ORDER = {
  pattern: ["id", "kind", "name", "workaround", "seenIn"],
  "template-module": ["id", "kind", "name", "aliases", "patterns", "neomeApp", "delivery", "seenIn"],
  template: ["id", "kind", "name", "businessType", "modules", "seenIn"],
};
const FLOW = { collectionStyle: "flow", flowCollectionPadding: false, lineWidth: 0 };
const y = (v) => stringify(v, FLOW).trimEnd();

/** Entry file text: front matter in format order (flow lists, one seenIn row per line) + body. */
export function entryText(fm, body) {
  const keys = [...(ORDER[fm.kind] ?? []), ...Object.keys(fm).filter((k) => !(ORDER[fm.kind] ?? []).includes(k))];
  const lines = [];
  for (const k of keys) {
    if (!(k in fm)) continue;
    const v = fm[k];
    if (k === "seenIn" && Array.isArray(v)) lines.push("seenIn:", ...v.map((r) => `  - ${y({ build: r.build, area: r.area })}`));
    else if (k === "modules" && v && typeof v === "object" && !Array.isArray(v)) {
      lines.push("modules:", ...Object.entries(v).map(([mk, mv]) => `  ${mk}: ${y(mv)}`));
    } else lines.push(`${k}: ${y(v)}`);
  }
  const b = String(body ?? "");
  return `---\n${lines.join("\n")}\n---\n${b.startsWith("\n") ? b : `\n${b}`}`.replace(/\n*$/, "\n");
}

const rowKey = (r) => `${r.build}\u0000${r.area}`;
const num = (code) => Number(String(code).slice(3));
/** Union of seenIn rows, no repeats, sorted by Build code (row order inside a Build kept). */
export function unionRows(...lists) {
  const out = [];
  const seen = new Set();
  for (const r of lists.flat()) {
    if (!r || seen.has(rowKey(r))) continue;
    seen.add(rowKey(r));
    out.push({ build: String(r.build), area: String(r.area) });
  }
  return out.map((r, i) => [r, i]).sort((a, b) => num(a[0].build) - num(b[0].build) || a[1] - b[1]).map(([r]) => r);
}

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const renameHeading = (body, name) => (/^# .+$/m.test(body) ? body.replace(/^# .+$/m, `# ${name}`) : body);
const addAlias = (fm, ...names) => {
  if (fm.kind !== "template-module") return;
  const have = new Set([fm.name, ...(fm.aliases ?? [])].map((n) => String(n).toLowerCase()));
  fm.aliases = [...(fm.aliases ?? [])];
  for (const n of names.flat()) if (n && !have.has(String(n).toLowerCase())) { fm.aliases.push(n); have.add(String(n).toLowerCase()); }
};

/**
 * Pure plan: no disk writes. args = {bankDir, changes (approved, list order), drafts: Map id → {fm, body},
 * refresh: [NB-NN] | null (null = drop every row, --full), date}.
 * → {errors, entries: Map id → {fm, body, dirty}, removed: Set, log: [line], applied, autoRetired, rowsDropped}
 */
export function planApply({ bankDir, changes, drafts = new Map(), refresh, date }) {
  const errors = [];
  const { entries, changelog } = loadBank(bankDir);
  const state = new Map(entries.map((e) => [e.id, { fm: structuredClone(e.fm), body: e.body, dirty: false }]));
  const everUsed = new Set([...state.keys(), ...changelog.flatMap((c) => [...c.ids, ...(c.replacedBy ?? [])])]);
  const removed = new Set();
  const repl = new Map(); // old ID → [new IDs] ([] = retired)
  const log = [];
  const applied = [];
  const logged = new Set();
  const line = (change, ids, reason) => `- ${date} | ${change} | ${ids} | ${clean(reason) || "no reason given"}`;

  // 1. Old seenIn rows of this run's Builds go; this run's change list brings back what the Builds still have.
  const drop = refresh === null ? null : new Set(refresh);
  const rowsDropped = [];
  for (const [id, e] of state) {
    const rows = Array.isArray(e.fm.seenIn) ? e.fm.seenIn : [];
    const keep = rows.filter((r) => drop && !drop.has(String(r.build)));
    if (keep.length !== rows.length) {
      rowsDropped.push({ id, builds: [...new Set(rows.filter((r) => !keep.includes(r)).map((r) => String(r.build)))] });
      e.fm.seenIn = keep;
      e.dirty = true;
    }
  }

  const fromDraft = (id) => {
    const d = drafts.get(id);
    if (!d) return null;
    const fm = { ...structuredClone(d.fm), id, kind: KIND[prefixOf(id)] };
    return { fm, body: d.body };
  };
  const get = (id, at) => {
    const e = state.get(id);
    if (!e) errors.push(`${at}: ${id} not in Template bank`);
    return e;
  };
  const fresh = (id, at) => {
    if (everUsed.has(id)) { errors.push(`${at}: ${id} already used; IDs never reused`); return false; }
    everUsed.add(id);
    return true;
  };
  const remove = (id, to) => { state.delete(id); removed.add(id); repl.set(id, to); };

  // 2. Changes, in list order.
  for (const c of changes) {
    const at = refOf(c);
    const rows = Array.isArray(c.seenIn) ? c.seenIn : [];
    if (c.change === "add") {
      if (!fresh(c.id, at)) continue;
      const e = fromDraft(c.id);
      if (!e) { errors.push(`${at}: draft missing`); continue; }
      e.fm.seenIn = unionRows(rows);
      state.set(c.id, { ...e, dirty: true });
      log.push(line("add", c.id, c.reason));
    } else if (c.change === "enhance") {
      const cur = get(c.id, at);
      if (!cur) continue;
      const d = fromDraft(c.id);
      const next = d ?? { fm: cur.fm, body: cur.body };
      next.fm.seenIn = unionRows(cur.fm.seenIn ?? [], rows);
      state.set(c.id, { ...next, dirty: true });
      log.push(line("enhance", c.id, c.reason));
    } else if (c.change === "rename") {
      const cur = get(c.from, at);
      if (!cur || !fresh(c.to, at)) continue;
      const d = fromDraft(c.to);
      const oldName = cur.fm.name;
      const next = d ?? { fm: { ...cur.fm, id: c.to, name: c.name ?? cur.fm.name }, body: c.name ? renameHeading(cur.body, c.name) : cur.body };
      next.fm.seenIn = unionRows(cur.fm.seenIn ?? [], rows);
      if (next.fm.name !== oldName) addAlias(next.fm, oldName);
      remove(c.from, [c.to]);
      state.set(c.to, { ...next, dirty: true });
      log.push(line("rename", `${c.from} -> ${c.to}`, c.reason));
    } else if (c.change === "split") {
      const cur = get(c.from, at);
      if (!cur) continue;
      const parts = c.into ?? [];
      if (!parts.every((p) => fresh(p.id, at))) continue;
      const made = parts.map((p) => [p.id, fromDraft(p.id), p.seenIn]);
      if (made.some(([, e]) => !e)) { errors.push(`${at}: draft missing for a part`); continue; }
      remove(c.from, parts.map((p) => p.id));
      for (const [id, e, r] of made) { e.fm.seenIn = unionRows(r ?? []); state.set(id, { ...e, dirty: true }); }
      log.push(line("split", `${c.from} -> ${parts.map((p) => p.id).join(", ")}`, c.reason));
    } else if (c.change === "merge") {
      const kept = get(c.into, at);
      const gone = (c.from ?? []).map((id) => [id, get(id, at)]);
      if (!kept || gone.some(([, e]) => !e)) continue;
      const d = fromDraft(c.into);
      const next = d ?? { fm: kept.fm, body: kept.body };
      if (d) addAlias(next.fm, kept.fm.aliases ?? []);
      for (const [, e] of gone) addAlias(next.fm, e.fm.name, e.fm.aliases ?? []);
      next.fm.seenIn = unionRows(kept.fm.seenIn ?? [], ...gone.map(([, e]) => e.fm.seenIn ?? []), rows);
      for (const [id] of gone) remove(id, [c.into]);
      state.set(c.into, { ...next, dirty: true });
      log.push(line("merge", `${c.from.join(", ")} -> ${c.into}`, c.reason));
    } else if (c.change === "retire") {
      if (!get(c.id, at)) continue;
      remove(c.id, []);
      log.push(line("retire", c.id, c.reason));
    } else {
      errors.push(`${at}: unknown change`);
      continue;
    }
    for (const id of Object.values(idsOf(c)).flat()) logged.add(id);
    applied.push({ ref: at, change: c.change, line: log.at(-1), reason: clean(c.reason) });
  }

  // 3 + 4. References follow ID changes; seenIn at zero → retire. Repeat until nothing moves.
  const autoRetired = [];
  const follow = (id, seen = new Set()) => {
    if (!repl.has(id)) return [id];
    if (seen.has(id)) return [];
    seen.add(id);
    return repl.get(id).flatMap((n) => follow(n, seen));
  };
  const swap = (list) => [...new Set((list ?? []).flatMap((id) => follow(id)))];
  for (;;) {
    for (const e of state.values()) {
      if (e.fm.kind === "template-module" && Array.isArray(e.fm.patterns)) {
        const next = swap(e.fm.patterns);
        if (next.join() !== e.fm.patterns.join()) { e.fm.patterns = next; e.dirty = true; }
      }
      if (e.fm.kind === "template" && e.fm.modules && typeof e.fm.modules === "object") {
        for (const k of ["core", "optional"]) {
          if (!Array.isArray(e.fm.modules[k])) continue;
          let next = swap(e.fm.modules[k]);
          if (k === "optional") next = next.filter((id) => !(e.fm.modules.core ?? []).includes(id)); // core wins
          if (next.join() !== e.fm.modules[k].join()) { e.fm.modules = { ...e.fm.modules, [k]: next }; e.dirty = true; }
        }
      }
    }
    const zero = [...state.entries()].filter(([, e]) => !(e.fm.seenIn ?? []).length).map(([id]) => id);
    if (!zero.length) break;
    for (const id of zero) {
      remove(id, []);
      autoRetired.push(id);
      log.push(line("retire", id, "seenIn hit zero"));
    }
  }

  // Rows dropped from an entry no change touched: one enhance line so CHANGELOG shows it.
  for (const { id, builds } of rowsDropped) {
    if (logged.has(id) || removed.has(id)) continue;
    log.push(line("enhance", id, `seenIn: ${builds.join(", ")} rows dropped (Build re-tagged or removed)`));
  }
  return { errors, entries: state, removed, log, applied, autoRetired, rowsDropped };
}

/** Write a plan into a Template bank folder: delete removed files, write dirty entries, append CHANGELOG lines. */
export function writePlan(bankDir, plan) {
  for (const id of plan.removed) {
    if (plan.entries.has(id)) continue;
    const p = join(bankDir, FOLDER[prefixOf(id)], `${id}.md`);
    if (existsSync(p)) unlinkSync(p);
  }
  for (const [id, e] of plan.entries) {
    if (!e.dirty) continue;
    writeFileSync(join(bankDir, FOLDER[prefixOf(id)], `${id}.md`), entryText(e.fm, e.body));
  }
  if (plan.log.length) {
    const p = join(bankDir, "CHANGELOG.md");
    const cur = existsSync(p) ? readFileSync(p, "utf8") : "# Template bank changelog\n\n## Changes\n";
    const sep = cur.endsWith("\n") ? "" : "\n";
    if (!existsSync(p)) writeFileSync(p, cur);
    appendFileSync(p, `${sep}${plan.log.join("\n")}\n`);
  }
}

/**
 * Plan → write on a copy → checkBank on the copy → only then the real Template bank.
 * opts = planApply args + {catalogSlugsPath, scrubWords, dryRun}. → {errors, warnings, plan}.
 */
export function applyChanges(opts) {
  const plan = planApply(opts);
  if (plan.errors.length) return { errors: plan.errors, warnings: [], plan };
  const tmp = mkdtempSync(join(tmpdir(), "neome-tb-apply-"));
  try {
    const copy = join(tmp, "template-bank");
    cpSync(opts.bankDir, copy, { recursive: true });
    writePlan(copy, plan);
    const check = checkBank(copy, { ...(opts.catalogSlugsPath ? { catalogSlugsPath: opts.catalogSlugsPath } : {}), scrubWords: opts.scrubWords ?? [] });
    if (check.errors.length || opts.dryRun) return { errors: check.errors, warnings: check.warnings, plan };
    writePlan(opts.bankDir, plan);
    return { errors: [], warnings: check.warnings, plan };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Markdown report: what changed and why, what was dropped, Builds, tokens. Reasons only; proof lines stay in raw. */
export function renderReport({ run, applied, tokens = [] }) {
  const out = [`# Template bank refine ${run.run}`, ""];
  out.push(`Mode: ${run.mode}. Builds: ${run.builds.map((b) => `${b.code} ${b.state}`).join(", ") || "none"}.`, "");
  out.push(`## Applied (${applied.applied.length})`, "", "| Change | IDs | Reason | Decided by |", "|---|---|---|---|");
  for (const a of applied.applied) {
    const [, , ids] = a.line.split(" | ");
    out.push(`| ${a.change} | ${ids} | ${a.reason.replaceAll("|", "/")} | ${a.by} |`);
  }
  out.push("", `## Retired at zero seenIn (${applied.autoRetired.length})`, "");
  out.push(...(applied.autoRetired.length ? applied.autoRetired.map((id) => `- ${id}`) : ["None."]));
  out.push("", `## seenIn rows replaced (${applied.rowsDropped.length})`, "");
  out.push(...(applied.rowsDropped.length ? applied.rowsDropped.map((r) => `- ${r.id}: ${r.builds.join(", ")}`) : ["None."]));
  out.push("", `## Not applied (${applied.dropped.length})`, "");
  out.push(...(applied.dropped.length ? applied.dropped.map((d) => `- ${d.ref}: ${d.why}`) : ["None."]));
  out.push("", "## Tokens", "", "| Stage | Build | In | Out | Source | Provider / model |", "|---|---|---|---|---|---|");
  for (const t of tokens) out.push(`| ${t.stage} | ${t.build} | ${t.in} | ${t.out} | ${t.source} | ${t.provider} / ${t.model} |`);
  const sum = (k) => tokens.reduce((n, t) => n + (Number(t[k]) || 0), 0);
  out.push(`| total | | ${sum("in")} | ${sum("out")} | | |`, "", `CHANGELOG lines: ${applied.log.length}. Check: ${applied.check}.`, "");
  return out.join("\n");
}
