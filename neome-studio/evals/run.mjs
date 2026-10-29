#!/usr/bin/env node
// Eval runner: maintainer-only (tickets 18, 41). Not a skill, not an engine command, never shown by studio.
// Driver prompt: eval.md (same folder). Run from the repo root. Cases: neome-studio/evals/<case>/.
//
//   run.mjs run <case>... | --all [--model <m>] [--judge-model <m>] [--budget <usd>] [--results <dir>] [--branch <b>]
//     prepare + replay + judge + score, per case. The one command before merging a skill text change to main.
//   run.mjs list                               case | <name> | ok | <n> problem(s)
//   run.mjs check [<case>...]                  case layout + golden/replay shape (no LLM). Exit 1 on any problem
//   run.mjs prepare <case> [--work <dir>] [--date YYYY-MM-DD] [--branch <b>]
//     temp workspace: bare remote + clones a, b (plugin without evals/), case Inputs in clone a. Prints `work | <dir>`
//   run.mjs replay <work> [--from <step-id>] [--model <m>] [--budget <usd>]
//     replays replay.yaml: skills headless (`claude -p`), simulated client on the answer key only. LLM.
//   run.mjs judge <work> [--judge-model <m>]   writes run/judge.json (LLM)
//   run.mjs score <work> [--results <dir>]     deterministic: gates, metrics, regression → results/<date>-<case>.md
//
// Lines: `case | …`, `problem | <case> | <text>`, `work | <dir>`, `step | <id> | …`, `result | <case> | pass|fail | <file>`,
// `fail | <case> | <failure>`, `done | <n> pass, <n> fail`. Exit 0 = all pass, 1 = any fail or error, 2 = bad arguments.
// LLM calls go through `claude` (Claude Code CLI, logged in) or NEOME_EVAL_CLAUDE. `npm test` never runs this.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EVALS_DIR, caseDir, listCases, loadCase } from "./lib/case.mjs";
import { prepareWorkspace, readWorkspace, git } from "./lib/workspace.mjs";
import { replayCase, readLog } from "./lib/replay.mjs";
import { runJudge } from "./lib/judge.mjs";
import { readThresholds, scoreRun } from "./lib/scorecard.mjs";
import { claudeCli } from "./lib/claude.mjs";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const USE = [
  "Usage: run.mjs run <case>... | --all [--model <m>] [--judge-model <m>] [--budget <usd>] [--results <dir>] [--branch <b>]",
  "       run.mjs list | check [<case>...]",
  "       run.mjs prepare <case> [--work <dir>] [--date YYYY-MM-DD] [--branch <b>]",
  "       run.mjs replay <work> [--from <step-id>] [--model <m>] [--budget <usd>]",
  "       run.mjs judge <work> [--judge-model <m>]",
  "       run.mjs score <work> [--results <dir>]",
].join("\n");
const FLAGS = new Set(["--model", "--judge-model", "--budget", "--results", "--branch", "--work", "--date", "--from"]);

function parse(args) {
  const opts = { pos: [], all: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--all") opts.all = true;
    else if (FLAGS.has(a)) {
      if (args[i + 1] === undefined || args[i + 1].startsWith("--")) return { problem: `${a} needs a value` };
      opts[a.slice(2).replace(/-(.)/g, (_, c) => c.toUpperCase())] = args[++i];
    } else if (a.startsWith("--")) return { problem: `unknown option ${a}` };
    else opts.pos.push(a);
  }
  if (opts.date && !/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) return { problem: "--date must be YYYY-MM-DD" };
  if (opts.budget && !(Number(opts.budget) > 0)) return { problem: "--budget must be a positive number" };
  return opts;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function repoBranch() {
  const b = git(REPO, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const c = git(REPO, ["rev-parse", "--short", "HEAD"]);
  return { branch: b.code === 0 ? b.out : "unknown", commit: c.code === 0 ? c.out : null };
}

function usage(msg) {
  if (msg) console.error(`eval: ${msg}`);
  console.error(USE);
  return 2;
}

function loaded(name) {
  const k = loadCase(caseDir(name));
  for (const p of k.problems) console.log(`problem | ${k.name} | ${p}`);
  return k.problems.length ? null : k;
}

const llmFor = (opts) => claudeCli({ model: opts.model, judgeModel: opts.judgeModel, budgetUsd: opts.budget ? Number(opts.budget) : undefined });

function prepare(kase, opts) {
  const { branch, commit } = repoBranch();
  const info = prepareWorkspace({ repoRoot: REPO, kase, work: opts.work, date: opts.date ?? today(), branch: opts.branch ?? branch, commit });
  console.log(`work | ${info.work}`);
  return info;
}

function replay(info, kase, opts, llm) {
  const r = replayCase({ info, kase, llm, from: opts.from ?? null });
  for (const p of r.problems) console.log(`step | ${p}`);
  console.log(`replay | ${kase.name} | ${r.problems.length} problem(s) | cost $${r.cost.toFixed(2)} | ${join(info.run, "transcript.md")}`);
}

function score(info, kase, opts) {
  const judgeFile = join(info.run, "judge.json");
  let judge;
  try {
    judge = JSON.parse(readFileSync(judgeFile, "utf8"));
  } catch {
    console.log(`problem | ${kase.name} | no usable ${judgeFile}; run judge first`);
    return false;
  }
  const thresholds = readThresholds(readFileSync(join(EVALS_DIR, "README.md"), "utf8"));
  let r;
  try {
    r = scoreRun({
      info,
      kase,
      judge,
      log: readLog(join(info.run, "log.jsonl")),
      resultsDir: resolve(opts.results ?? join(EVALS_DIR, "results")),
      thresholds,
      judgeModel: opts.judgeModel,
    });
  } catch (e) {
    for (const p of e.problems ?? [e.message]) console.log(`problem | ${kase.name} | judge ${p}`);
    return false;
  }
  for (const f of r.verdict.failures) console.log(`fail | ${kase.name} | ${f}`);
  console.log(`result | ${kase.name} | ${r.verdict.pass ? "pass" : "fail"} | ${r.file}`);
  return r.verdict.pass;
}

function withWork(opts) {
  if (opts.pos.length !== 1) return { problem: "give one <work> folder" };
  let info;
  try {
    info = readWorkspace(opts.pos[0]);
  } catch (e) {
    return { problem: e.message };
  }
  const kase = loaded(info.caseDir);
  return kase ? { info, kase } : { failed: true };
}

export async function main(argv) {
  const [cmd, ...rest] = argv;
  const opts = parse(rest);
  if (opts.problem) return usage(opts.problem);

  if (cmd === "list" || cmd === "check") {
    const names = cmd === "check" && opts.pos.length ? opts.pos : listCases();
    let bad = 0;
    for (const n of names) {
      const k = loadCase(caseDir(n));
      if (cmd === "check") for (const p of k.problems) console.log(`problem | ${k.name} | ${p}`);
      console.log(`case | ${k.name} | ${k.problems.length ? `${k.problems.length} problem(s)` : "ok"}`);
      if (k.problems.length) bad++;
    }
    return bad && cmd === "check" ? 1 : 0;
  }

  if (cmd === "prepare") {
    if (opts.pos.length !== 1) return usage("give one <case>");
    const kase = loaded(opts.pos[0]);
    if (!kase) return 1;
    prepare(kase, opts);
    return 0;
  }

  if (cmd === "replay" || cmd === "judge" || cmd === "score") {
    const w = withWork(opts);
    if (w.problem) return usage(w.problem);
    if (w.failed) return 1;
    try {
      if (cmd === "replay") replay(w.info, w.kase, opts, llmFor(opts));
      if (cmd === "judge") {
        runJudge({ info: w.info, kase: w.kase, log: readLog(join(w.info.run, "log.jsonl")), llm: llmFor(opts) });
        console.log(`judge | ${w.kase.name} | ${join(w.info.run, "judge.json")}`);
      }
    } catch (e) {
      console.log(`problem | ${w.kase.name} | ${e.message}`);
      return 1;
    }
    if (cmd === "score") return score(w.info, w.kase, opts) ? 0 : 1;
    return 0;
  }

  if (cmd === "run") {
    const names = opts.all ? listCases() : opts.pos;
    if (!names.length) return usage("give <case>... or --all");
    if (opts.work && names.length > 1) return usage("--work takes one case");
    let pass = 0;
    let fail = 0;
    for (const n of names) {
      const kase = loaded(n);
      let ok = false;
      if (kase) {
        try {
          const info = prepare(kase, opts);
          const llm = llmFor(opts);
          replay(info, kase, opts, llm);
          runJudge({ info, kase, log: readLog(join(info.run, "log.jsonl")), llm });
          ok = score(info, kase, opts);
        } catch (e) {
          console.log(`problem | ${n} | ${e.message}`);
        }
      }
      if (ok) pass++;
      else fail++;
    }
    console.log(`done | ${pass} pass, ${fail} fail`);
    return fail ? 1 : 0;
  }

  return usage(cmd ? `unknown command ${cmd}` : null);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
