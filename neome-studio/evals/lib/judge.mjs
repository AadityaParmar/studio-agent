// LLM judge: one tool-less call. Gets the golden file, the replay's BRD data (Requirements, Open Items, Modules),
// the text copy of every cited Source and the client's Don't know answers; returns matches (judge.schema.json).
// Matching by meaning is the only judgement; scorecard.mjs counts.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SCHEMAS, EVALS_DIR, goldenRequirements } from "./case.mjs";
import { actualState, dontKnows } from "./scorecard.mjs";

export const JUDGE_PROMPT = join(EVALS_DIR, "prompts", "judge.md");

export function judgeInput({ info, kase, log }) {
  const ent = join(info.clones.a, "enterprises", info.enterprise);
  const actual = actualState(join(ent, "engagements", info.engagement));
  const golden = { ...kase.golden };
  delete golden.mechanics;
  const cited = [...new Set(actual.reqs.flatMap((r) => r.sources ?? []))].sort();
  const sources = cited.map((id) => {
    const f = join(ent, "_agent", "sources", `${id}.md`);
    return `### ${id}\n\n${existsSync(f) ? readFileSync(f, "utf8").trim() : "(no text copy)"}`;
  });
  const replay = {
    modules: actual.modules.map((m) => ({ prefix: m.prefix, name: m.name, status: m.status, mapping: m.mapping })),
    requirements: actual.reqs.map((r) => ({
      id: r.id, module: r.module, title: r.title, statement: r.statement, acceptance: r.acceptance, sources: r.sources, proposed: r.proposed,
    })),
    openItems: actual.ois.map((o) => ({ id: o.id, question: o.question, modules: o.modules, status: o.status, answer: o.answer, answerSource: o.answerSource })),
  };
  const dk = dontKnows(log).map((a) => ({ n: a.n, step: a.step, question: a.question, answer: a.answer }));
  const prompt = [
    `# Case ${kase.name}`,
    "",
    `Golden Requirements: ${goldenRequirements(kase.golden).length} · golden Open Items: ${kase.golden.openItems.length} · golden Modules: ${kase.golden.modules.length}`,
    `Replay Requirements: ${replay.requirements.length} · replay Open Items: ${replay.openItems.length} · Don't know answers: ${dk.length}`,
    "",
    "## Golden",
    "",
    "```json",
    JSON.stringify(golden, null, 2),
    "```",
    "",
    "## Replay BRD data",
    "",
    "```json",
    JSON.stringify(replay, null, 2),
    "```",
    "",
    "## Don't know answers",
    "",
    "```json",
    JSON.stringify(dk, null, 2),
    "```",
    "",
    "## Source text copies",
    "",
    ...(sources.length ? sources : ["(none cited)"]),
    "",
  ].join("\n");
  return { prompt, system: readFileSync(JUDGE_PROMPT, "utf8") };
}

export function runJudge({ info, kase, log, llm }) {
  const { prompt, system } = judgeInput({ info, kase, log });
  writeFileSync(join(info.run, "judge-input.md"), prompt);
  const r = llm.ask({ cwd: info.run, system, prompt, schema: SCHEMAS.judge, judge: true });
  writeFileSync(join(info.run, "judge.json"), JSON.stringify(r.json, null, 2) + "\n");
  return r;
}
