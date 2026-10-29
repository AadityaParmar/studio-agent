// Scorecard (ticket 18): deterministic. Reads the replay's end state, the judge's match file and the client log;
// computes hard gates, soft metrics and regression; writes results/<date>-<case>.md with per-item match tables.
// The LLM judge only matches by meaning; every count, percentage, threshold and verdict is computed here.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { validateEngagement, versionsOf } from "../../engine/build-brd.mjs";
import { readRegister } from "../../engine/brd/read-engagement.mjs";
import { schemaErrors, crossRefErrors } from "../../engine/brd/validate.mjs";
import { tables, column, sections } from "../../engine/markdown.mjs";
import { goldenRequirements, shapeErrors } from "./case.mjs";
import { git } from "./workspace.mjs";
import { newest } from "./replay.mjs";

export const HARD = ["valid", "uncited", "invented", "dontKnow", "mechanics", "replay"];
export const SOFT = ["recall", "openItems", "modules", "mapping"];
const LABEL = {
  valid: "Schema + cross-ref valid (errors)",
  uncited: "Uncited non-proposed facts",
  invented: "Invented facts",
  dontKnow: "Don't know without an Open Item",
  mechanics: "Case mechanics failed",
  replay: "Replay problems",
  recall: "Requirement recall",
  openItems: "Open Items caught",
  modules: "Module set",
  mapping: "Mapping (Delivery class)",
  regression: "Regression (max drop vs last main)",
};

// ---------- thresholds (evals/README.md "## Thresholds" table) ----------

export function readThresholds(readme) {
  const sec = sections(readme, 2).find((s) => s.title === "Thresholds");
  if (!sec) throw new Error("evals/README.md has no ## Thresholds section");
  const t = tables(sec.body).find((x) => column(x, "key") && column(x, "pass"));
  if (!t) throw new Error("evals/README.md Thresholds: no table with Key and Pass columns");
  const out = {};
  for (const row of t.rows) {
    const key = row[column(t, "key")].replaceAll("`", "").trim();
    const pass = Number.parseFloat(row[column(t, "pass")]);
    if (!Number.isFinite(pass)) throw new Error(`evals/README.md Thresholds: ${key} has no number in Pass`);
    out[key] = { kind: row[column(t, "kind")].trim(), pass };
  }
  for (const k of [...HARD, ...SOFT, "regression"]) if (!out[k]) throw new Error(`evals/README.md Thresholds: no row for ${k}`);
  return out;
}

// ---------- actual end state ----------

export function actualState(engDir) {
  if (!existsSync(join(engDir, "_agent"))) {
    return { missing: true, errors: [`[parse] no Engagement at ${engDir}`], data: null, reqs: [], ois: [], modules: [], uncited: [] };
  }
  const v = validateEngagement(engDir);
  const errors = v.errors.map((e) => `[${e.cls}] ${e.msg}`);
  const { register } = readRegister(engDir);
  const vs = versionsOf(engDir);
  const versions = {};
  for (const k of [...vs.nums].sort((a, b) => a - b)) {
    let snap;
    try {
      snap = JSON.parse(readFileSync(vs.file(k), "utf8"));
    } catch (e) {
      errors.push(`[parse] v${k}.json: ${e.message}`);
      continue;
    }
    versions[k] = snap;
    const se = schemaErrors(snap);
    const ce = se.length ? [] : crossRefErrors(snap, register);
    for (const e of [...se, ...ce]) errors.push(`[${e.cls}] v${k}.json: ${e.msg}`);
  }
  const data = v.data;
  const live = (r) => !r.withdrawn;
  const modules = (data.modules ?? []).filter((m) => !String(m.status).startsWith("merged-into"));
  const reqs = [
    ...modules.flatMap((m) => (m.requirements ?? []).filter(live).map((r) => ({ ...r, module: m.prefix }))),
    ...(data.general?.requirements ?? []).filter(live).map((r) => ({ ...r, module: "GEN" })),
  ];
  return { missing: false, data, errors, versions, reqs, ois: data.openItems ?? [], modules, uncited: uncitedFacts(data) };
}

// Every fact object (has `sources` and `proposed`) that is not proposed and cites nothing: JSON paths.
export function uncitedFacts(data) {
  const out = [];
  const walk = (x, path) => {
    if (Array.isArray(x)) return x.forEach((v, i) => walk(v, `${path}[${i}]`));
    if (!x || typeof x !== "object") return;
    if (Array.isArray(x.sources) && "proposed" in x && x.proposed === false && x.sources.length === 0) out.push(path + (x.id ? ` (${x.id})` : ""));
    for (const [k, v] of Object.entries(x)) if (k !== "sources") walk(v, `${path}.${k}`);
  };
  walk(data, "$");
  return out;
}

// ---------- judge output must cover everything exactly once ----------

export function judgeProblems(judge, golden, actual, log) {
  const shape = shapeErrors("judge", judge);
  if (shape.length) return shape;
  const out = [];
  const reqIds = actual.reqs.map((r) => r.id);
  const oiIds = actual.ois.map((o) => o.id);
  const prefixes = actual.modules.map((m) => m.prefix);
  const exactlyOnce = (what, got, want) => {
    const seen = new Set();
    for (const g of got) {
      if (seen.has(g)) out.push(`${what}: ${g} listed twice`);
      seen.add(g);
      if (!want.includes(g)) out.push(`${what}: ${g} is not expected here`);
    }
    for (const w of want) if (!seen.has(w)) out.push(`${what}: ${w} missing`);
  };
  const known = (what, ids, allowed) => {
    for (const id of ids) if (!allowed.includes(id)) out.push(`${what}: ${id} is not in the replay's BRD data`);
  };
  exactlyOnce("requirements", judge.requirements.map((x) => x.golden), goldenRequirements(golden).map((r) => r.id));
  for (const x of judge.requirements) known(`requirements ${x.golden}`, x.matchedBy, reqIds);
  exactlyOnce("openItems", judge.openItems.map((x) => x.golden), golden.openItems.map((o) => o.id));
  for (const x of judge.openItems) known(`openItems ${x.golden}`, x.coveredBy, [...oiIds, ...reqIds]);
  exactlyOnce("modules", judge.modules.map((x) => x.golden), golden.modules.map((m) => m.prefix));
  for (const x of judge.modules) known(`modules ${x.golden}`, x.matchedBy, prefixes);
  const matched = new Set(judge.requirements.flatMap((x) => x.matchedBy));
  exactlyOnce("extras", judge.extras.map((x) => x.id), reqIds.filter((id) => !matched.has(id)));
  exactlyOnce("sourceCheck", judge.sourceCheck.map((x) => x.id), reqIds);
  exactlyOnce("dontKnow", judge.dontKnow.map((x) => String(x.n)), dontKnows(log).map((a) => String(a.n)));
  for (const x of judge.dontKnow) if (x.oi !== null) known(`dontKnow ${x.n}`, [x.oi], oiIds);
  return out;
}

export const dontKnows = (log) => log.filter((e) => e.kind === "answer" && e.dontKnow && e.as !== "consultant");

// ---------- mechanics (golden.mechanics) ----------

export function runMechanics(mechanics = [], { engDir, actual, clone }) {
  return mechanics.map((m) => {
    const r = mechanic(m, engDir, actual, clone);
    return { id: m.id, what: m.what, pass: r.pass, detail: r.detail };
  });
}

function mechanic(m, engDir, actual, clone) {
  const min = m.min ?? 1;
  const atLeast = (n, what) => ({ pass: n >= min, detail: `${n} ${what} (need ≥ ${min})` });
  if (actual.missing && m.type !== "git") return { pass: false, detail: "no Engagement" };
  switch (m.type) {
    case "file": {
      const f = newest(engDir, m.path);
      const n = f ? countMatches(engDir, m.path) : 0;
      return atLeast(n, `file(s) match ${m.path}`);
    }
    case "text": {
      const f = join(engDir, m.path);
      if (!existsSync(f)) return { pass: false, detail: `${m.path} missing` };
      const ok = new RegExp(m.pattern, "mi").test(readFileSync(f, "utf8"));
      return { pass: ok, detail: `${m.path} ${ok ? "matches" : "does not match"} /${m.pattern}/` };
    }
    case "oi": {
      const w = m.where;
      const hits = actual.ois.filter(
        (o) =>
          (!w.status || o.status === w.status) &&
          (!w.questionIncludes || o.question.toLowerCase().includes(w.questionIncludes.toLowerCase())) &&
          (!w.answerSourcePrefix || String(o.answerSource ?? "").startsWith(`${w.answerSourcePrefix}-`)) &&
          (!w.raisedInPrefix || String(o.raisedIn ?? "").startsWith(`${w.raisedInPrefix}-`)),
      );
      return atLeast(hits.length, `Open Item(s)${hits.length ? `: ${hits.map((o) => o.id).join(", ")}` : ""}`);
    }
    case "gen":
      return atLeast(actual.reqs.filter((r) => r.module === "GEN").length, "live GEN Requirement(s)");
    case "version": {
      const snap = actual.versions[m.version];
      if (!snap) return { pass: false, detail: `v${m.version}.json missing` };
      return { pass: snap.engagement?.status === m.status, detail: `v${m.version} is ${snap.engagement?.status}` };
    }
    case "changes": {
      const snap = actual.versions[m.version];
      if (!snap) return { pass: false, detail: `v${m.version}.json missing` };
      const entry = (snap.changelog ?? []).find((c) => c.version === m.version);
      const n = (entry?.changes ?? []).filter((c) => c.group === m.group && (!m.kind || c.kind === m.kind)).length;
      return atLeast(n, `${m.group}${m.kind ? ` ${m.kind}` : ""} change(s) in v${m.version}`);
    }
    case "modules": {
      const bad = actual.modules.filter((x) => x.status !== m.status);
      const ok = actual.modules.length > 0 && bad.length === 0;
      return { pass: ok, detail: ok ? `all ${actual.modules.length} ${m.status}` : bad.length ? bad.map((x) => `${x.prefix} ${x.status}`).join(", ") : "no Modules" };
    }
    case "git": {
      const r = git(clone, ["log", "--format=%s"]);
      const re = new RegExp(m.pattern);
      const n = r.code === 0 ? r.out.split("\n").filter((l) => re.test(l)).length : 0;
      return atLeast(n, `commit(s) match /${m.pattern}/`);
    }
    default:
      return { pass: false, detail: `unknown type ${m.type}` };
  }
}

function countMatches(engDir, pattern) {
  const parts = pattern.split("/");
  const dir = join(engDir, ...parts.slice(0, -1));
  const re = new RegExp(`^${parts.at(-1).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
  return existsSync(dir) ? readdirSync(dir).filter((f) => re.test(f)).length : 0;
}

// ---------- metrics ----------

const pct = (hit, of) => (of ? Math.round((1000 * hit) / of) / 10 : null);

export function computeMetrics({ golden, actual, judge, log, mechanics, replayProblems }) {
  const gReqs = goldenRequirements(golden);
  const byGolden = (list, id) => list.find((x) => x.golden === id);
  const reqRows = gReqs.map((g) => ({ g, m: byGolden(judge.requirements, g.id) }));
  const oiRows = golden.openItems.map((g) => ({ g, m: byGolden(judge.openItems, g.id) }));
  const modRows = golden.modules.map((g) => ({ g, m: byGolden(judge.modules, g.prefix) }));
  const mapRows = golden.modules
    .filter((g) => g.mapping)
    .map((g) => {
      const matched = byGolden(judge.modules, g.prefix).matchedBy.map((p) => actual.modules.find((x) => x.prefix === p));
      const got = matched.map((x) => `${x.prefix}: ${x.mapping?.delivery ?? "none"}`);
      const hit = matched.length > 0 && matched.every((x) => x.mapping?.delivery === g.mapping.delivery);
      return { g, got, hit };
    });
  const invented = judge.sourceCheck.filter((x) => x.verdict === "invented");
  const dk = dontKnows(log).map((a) => ({ a, j: judge.dontKnow.find((x) => x.n === a.n) }));
  const hits = (rows, key) => rows.filter((r) => r.m[key].length > 0).length;
  const failedMech = mechanics.filter((m) => !m.pass);
  const scored = (k, v) => (!golden.score || golden.score.includes(k) ? v : null);
  return {
    values: {
      valid: actual.errors.length,
      uncited: actual.uncited.length,
      invented: invented.length,
      dontKnow: dk.filter((x) => x.j.oi === null).length,
      mechanics: failedMech.length,
      replay: replayProblems.length,
      recall: scored("recall", pct(hits(reqRows, "matchedBy"), reqRows.length)),
      openItems: scored("openItems", pct(hits(oiRows, "coveredBy"), oiRows.length)),
      modules: scored("modules", pct(hits(modRows, "matchedBy"), modRows.length)),
      mapping: scored("mapping", pct(mapRows.filter((r) => r.hit).length, mapRows.length)),
    },
    counts: {
      recall: [hits(reqRows, "matchedBy"), reqRows.length],
      openItems: [hits(oiRows, "coveredBy"), oiRows.length],
      modules: [hits(modRows, "matchedBy"), modRows.length],
      mapping: [mapRows.filter((r) => r.hit).length, mapRows.length],
    },
    rows: { reqRows, oiRows, modRows, mapRows, invented, dk },
  };
}

// Verdict from values, thresholds and the baseline (last result on main, or null).
export function verdict(values, thresholds, baseline) {
  const failures = [];
  for (const k of HARD) if (values[k] > thresholds[k].pass) failures.push(`${LABEL[k]}: ${values[k]} (max ${thresholds[k].pass})`);
  for (const k of SOFT) if (values[k] !== null && values[k] < thresholds[k].pass) failures.push(`${LABEL[k]}: ${values[k]}% (min ${thresholds[k].pass}%)`);
  const drops = {};
  if (baseline) {
    for (const k of SOFT) {
      const was = baseline.metrics?.[k];
      if (values[k] === null || was === null || was === undefined) continue;
      drops[k] = Math.round((was - values[k]) * 10) / 10;
      if (drops[k] > thresholds.regression.pass) failures.push(`${LABEL[k]} dropped ${drops[k]} pts vs ${baseline.file} (max ${thresholds.regression.pass})`);
    }
  }
  return { pass: failures.length === 0, failures, drops };
}

// ---------- results files ----------

const RESULT = (name) => new RegExp(`^(\\d{4}-\\d{2}-\\d{2})-${name.replace(/[-]/g, "\\-")}(?:-(\\d+))?\\.md$`);

export function parseResult(text) {
  const m = text.match(/## Data\s+```json\s+([\s\S]*?)```/);
  return m ? JSON.parse(m[1]) : null;
}

// Latest result of this case recorded on main (date, then run number). Null when none.
export function lastMainResult(resultsDir, name, except = null) {
  if (!existsSync(resultsDir)) return null;
  const found = readdirSync(resultsDir)
    .map((f) => ({ f, m: f.match(RESULT(name)) }))
    .filter((x) => x.m && x.f !== except)
    .map((x) => ({ file: x.f, key: `${x.m[1]}-${String(x.m[2] ?? 1).padStart(4, "0")}`, data: parseResult(readFileSync(join(resultsDir, x.f), "utf8")) }))
    .filter((x) => x.data?.branch === "main")
    .sort((a, b) => a.key.localeCompare(b.key));
  const last = found.at(-1);
  return last ? { file: last.file, ...last.data } : null;
}

export function resultFile(resultsDir, name, date) {
  let file = `${date}-${name}.md`;
  for (let k = 2; existsSync(join(resultsDir, file)); k++) file = `${date}-${name}-${k}.md`;
  return file;
}

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();
const title = (actual, id) => {
  const r = actual.reqs.find((x) => x.id === id);
  if (r) return `${id} ${r.title ?? ""}`.trim();
  const o = actual.ois.find((x) => x.id === id);
  return o ? `${id} ${o.question}` : id;
};

export function renderResult({ info, kase, actual, judge, metrics, mechanics, verdict: v, thresholds, baseline, replayProblems, judgeModel }) {
  const { values, counts, rows } = metrics;
  const lines = [];
  const p = (...l) => lines.push(...l);
  const ok = (b) => (b ? "pass" : "**fail**");
  p(`# Eval result: ${kase.name} · ${info.date}`, "");
  p(`Verdict: **${v.pass ? "pass" : "fail"}**${v.pass ? "" : ` (${v.failures.length} failure(s))`}`, "");
  p(`- Branch: \`${info.branch}\`${info.commit ? ` · commit \`${info.commit}\`` : ""}`);
  p(`- Workspace: \`${info.work ?? info.run}\` (temp; transcript in \`run/transcript.md\`)`);
  p(`- Judge: ${judgeModel ?? "default model"} · baseline: ${baseline ? `${baseline.file} (main)` : "none on main yet"}`, "");
  if (!v.pass) p("Failures:", "", ...v.failures.map((f) => `- ${f}`), "");

  p("## Gates (hard)", "", "| Gate | Value | Max | Result |", "|---|---|---|---|");
  for (const k of HARD) p(`| ${LABEL[k]} | ${values[k]} | ${thresholds[k].pass} | ${ok(values[k] <= thresholds[k].pass)} |`);
  p("", "## Soft metrics", "", "| Metric | Score | Hit / of | Min | Last main | Drop | Result |", "|---|---|---|---|---|---|---|");
  for (const k of SOFT) {
    const val = values[k];
    const was = baseline?.metrics?.[k];
    const drop = v.drops[k];
    const res = val === null ? "n/a" : ok(val >= thresholds[k].pass && !(drop > thresholds.regression.pass));
    p(`| ${LABEL[k]} | ${val === null ? "n/a" : `${val}%`} | ${counts[k][0]} / ${counts[k][1]} | ${thresholds[k].pass}% | ${was ?? "—"} | ${drop ?? "—"} | ${res} |`);
  }
  p("", `Regression rule: no soft metric drops more than ${thresholds.regression.pass} pts vs the last result on \`main\`.`, "");

  if (mechanics.length) {
    p("## Mechanics", "", "| Check | What | Detail | Result |", "|---|---|---|---|");
    for (const m of mechanics) p(`| ${m.id} | ${cell(m.what)} | ${cell(m.detail)} | ${ok(m.pass)} |`);
    p("");
  }

  p("## Requirements", "", "| Golden | Statement | Matched by | Result | Judge note |", "|---|---|---|---|---|");
  for (const { g, m } of rows.reqRows) {
    p(`| ${g.id} | ${cell(g.statement)} | ${cell(m.matchedBy.map((id) => title(actual, id)).join("; ")) || "—"} | ${m.matchedBy.length ? "match" : "**missed**"} | ${cell(m.note)} |`);
  }
  p("", "## Open Items", "", "| Golden | Question | Covered by | Result | Judge note |", "|---|---|---|---|---|");
  for (const { g, m } of rows.oiRows) {
    p(`| ${g.id} | ${cell(g.question)} | ${cell(m.coveredBy.map((id) => title(actual, id)).join("; ")) || "—"} | ${m.coveredBy.length ? "covered" : "**missed**"} | ${cell(m.note)} |`);
  }
  p("", "## Modules and mapping", "", "| Golden | Name | Matched by | Golden Delivery | Actual Delivery | Module | Delivery | Judge note |", "|---|---|---|---|---|---|---|---|");
  for (const { g, m } of rows.modRows) {
    const map = rows.mapRows.find((r) => r.g.prefix === g.prefix);
    p(`| ${g.prefix} | ${cell(g.name)} | ${m.matchedBy.join(", ") || "—"} | ${g.mapping?.delivery ?? "—"} | ${cell(map?.got.join("; ")) || "—"} | ${m.matchedBy.length ? "match" : "**missed**"} | ${map ? (map.hit ? "match" : "**differs**") : "n/a"} | ${cell(m.note)} |`);
  }
  p("", "## Extra Requirements (not failed)", "");
  if (judge.extras.length) {
    p("| ID | Title | Tag | Judge note |", "|---|---|---|---|");
    for (const x of judge.extras) p(`| ${x.id} | ${cell(actual.reqs.find((r) => r.id === x.id)?.title)} | ${x.tag} | ${cell(x.note)} |`);
    p("", `${judge.extras.filter((x) => x.tag === "plausible").length} plausible, ${judge.extras.filter((x) => x.tag === "noise").length} noise.`);
  } else p("None.");
  p("", "## Source check", "", `${judge.sourceCheck.length} Requirement(s) checked against their cited Source text; ${rows.invented.length} invented.`, "");
  if (rows.invented.length) {
    p("| ID | Sources | Judge note |", "|---|---|---|");
    for (const x of rows.invented) p(`| ${x.id} | ${cell(actual.reqs.find((r) => r.id === x.id)?.sources?.join(", "))} | ${cell(x.note)} |`);
    p("");
  }
  p("## Don't know → Open Item", "");
  if (rows.dk.length) {
    p("| # | Step | Question | Open Item | Judge note |", "|---|---|---|---|---|");
    for (const { a, j } of rows.dk) p(`| A${a.n} | ${a.step} | ${cell(a.question)} | ${j.oi ?? "**none**"} | ${cell(j.note)} |`);
  } else p("The simulated client said Don't know to nothing.");
  p("", "## Problems", "");
  const probs = [...actual.errors.map((e) => `validation ${e}`), ...actual.uncited.map((u) => `uncited ${u}`), ...replayProblems.map((r) => `replay ${r}`)];
  p(...(probs.length ? probs.map((x) => `- ${cell(x)}`) : ["None."]));
  p("", "## Maintainer spot-check", "", "Open ~10 rows above (mix of match, missed, extras), read both sides, tick when the judge was right.", "");
  p("- [ ] Spot-check done · judge wrong on: ___ · approved by: ___", "");
  const data = { case: kase.name, date: info.date, branch: info.branch, verdict: v.pass ? "pass" : "fail", metrics: values, failures: v.failures };
  p("## Data", "", "```json", JSON.stringify(data, null, 2), "```", "");
  return lines.join("\n");
}

// Scores one workspace. Throws on unusable judge output (nothing written then).
export function scoreRun({ info, kase, judge, log, resultsDir, thresholds, judgeModel }) {
  const engDir = join(info.clones.a, "enterprises", info.enterprise, "engagements", info.engagement);
  const actual = actualState(engDir);
  const problems = judgeProblems(judge, kase.golden, actual, log);
  if (problems.length) {
    const e = new Error(`judge output does not cover the case:\n${problems.map((x) => `  ${x}`).join("\n")}`);
    e.problems = problems;
    throw e;
  }
  const replayProblems = log.filter((e) => e.kind === "problem").map((e) => `${e.step}: ${e.text}`);
  const mechanics = runMechanics(kase.golden.mechanics, { engDir, actual, clone: info.clones.a });
  const metrics = computeMetrics({ golden: kase.golden, actual, judge, log, mechanics, replayProblems });
  mkdirSync(resultsDir, { recursive: true });
  const file = resultFile(resultsDir, kase.name, info.date);
  const baseline = lastMainResult(resultsDir, kase.name, file);
  const v = verdict(metrics.values, thresholds, baseline);
  const text = renderResult({ info, kase, actual, judge, metrics, mechanics, verdict: v, thresholds, baseline, replayProblems, judgeModel });
  writeFileSync(join(resultsDir, file), text);
  return { file: join(resultsDir, file), verdict: v, values: metrics.values, baseline, mechanics };
}
