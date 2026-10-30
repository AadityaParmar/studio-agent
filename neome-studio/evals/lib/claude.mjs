// The only place the runner reaches an LLM: headless Claude Code (`claude -p`, JSON output).
// NEOME_EVAL_CLAUDE = path of the claude binary (default `claude` on PATH); tests point it at a fake.
// Prompts go on stdin (no argv size limit); system prompts (a few KB) as an argument.
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const HOUR = 60 * 60 * 1000;

export function claudeCli({ bin = process.env.NEOME_EVAL_CLAUDE || "claude", model, judgeModel, budgetUsd, env = process.env } = {}) {
  const call = (args, { cwd, input, timeout = HOUR }) => {
    const isNode = /\.m?js$/.test(bin);
    const r = spawnSync(isNode ? process.execPath : bin, isNode ? [bin, ...args] : args, {
      cwd,
      input,
      encoding: "utf8",
      env,
      timeout,
      maxBuffer: 64 * 1024 * 1024,
    });
    if (r.error) throw new Error(`claude did not run (${r.error.code ?? r.error.message}); install Claude Code or set NEOME_EVAL_CLAUDE`);
    let out;
    try {
      out = JSON.parse(r.stdout);
    } catch {
      throw new Error(`claude exit ${r.status}, output is not JSON: ${(r.stdout + r.stderr).slice(0, 400)}`);
    }
    if (out.is_error || r.status !== 0) throw new Error(`claude failed: ${String(out.result ?? r.stderr).slice(0, 400)}`);
    return out;
  };
  const common = (m) => ["-p", "--output-format", "json", ...(m ? ["--model", m] : []), ...(budgetUsd ? ["--max-budget-usd", String(budgetUsd)] : [])];

  return {
    // One turn of a user skill session in a clone. First turn: prompt = `/neome-studio:<skill> <args>`.
    skillTurn({ cwd, prompt, session }) {
      const args = [
        ...common(model),
        "--permission-mode", "bypassPermissions",
        "--plugin-dir", join(cwd, "neome-studio"),
        ...(session ? ["--resume", session] : []),
      ];
      const out = call(args, { cwd, input: prompt });
      return { text: String(out.result ?? ""), session: out.session_id, cost: out.total_cost_usd ?? 0 };
    },
    // A tool-less call with its own system prompt and a JSON Schema for the answer (simulated client, judge).
    ask({ cwd, system, prompt, schema, session, judge = false }) {
      // `claude --json-schema` rejects the draft 2020-12 `$schema` URL; the shape is the same without it.
      const { $schema, ...answerShape } = schema;
      const args = [
        ...common(judge ? judgeModel ?? model : model),
        "--tools", "",
        "--system-prompt", system,
        "--json-schema", JSON.stringify(answerShape),
        ...(session ? ["--resume", session] : []),
      ];
      const out = call(args, { cwd, input: prompt });
      return { json: structured(out), session: out.session_id, cost: out.total_cost_usd ?? 0 };
    },
  };
}

// Structured output, else the result text as JSON (fences stripped).
function structured(out) {
  if (out.structured_output && typeof out.structured_output === "object") return out.structured_output;
  const text = String(out.result ?? "").trim().replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`answer is not JSON: ${text.slice(0, 300)}`);
  }
}
