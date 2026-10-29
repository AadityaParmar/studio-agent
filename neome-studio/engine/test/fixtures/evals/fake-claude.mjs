#!/usr/bin/env node
// Fake `claude -p --output-format json` for the eval runner tests (NEOME_EVAL_CLAUDE). No LLM, no network.
// Logs every call (cwd, args, stdin, system prompt) to FAKE_CLAUDE_LOG as JSON lines.
//   skill turn (no --json-schema): first turn asks two questions; a resumed turn reports done.
//     FAKE_SEED=<dir>: first turn of /neome-studio:ingest copies <dir> to enterprises/<basename> and commits + pushes.
//   client (system prompt is the simulated client): "Report: done" → end; else answers, one Don't know.
//     FAKE_CLIENT_BAD=1 → answer that breaks the client schema.
//   judge (system prompt "# Eval judge"): matches golden to replay items with the same ID.
//     FAKE_JUDGE_SKIP=1 drops the first requirements entry; FAKE_INVENTED=<id>; FAKE_DK_NULL=1.
import { appendFileSync, cpSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const stdin = readFileSync(0, "utf8");
const flag = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
const system = flag("--system-prompt");
if (process.env.FAKE_CLAUDE_LOG) {
  appendFileSync(process.env.FAKE_CLAUDE_LOG, JSON.stringify({ cwd: process.cwd(), args, stdin, system }) + "\n");
}
const say = (out) => {
  process.stdout.write(JSON.stringify({ type: "result", is_error: false, session_id: `s-${Math.random().toString(36).slice(2, 8)}`, total_cost_usd: 0.01, ...out }));
};

if (!flag("--json-schema")) {
  if (flag("--resume")) say({ result: "Report: done. Next: new session.", session_id: flag("--resume") });
  else {
    if (stdin.startsWith("/neome-studio:ingest") && process.env.FAKE_SEED) {
      const seed = process.env.FAKE_SEED;
      cpSync(seed, join(process.cwd(), "enterprises", basename(seed)), { recursive: true });
      for (const a of [["add", "-A"], ["commit", "-q", "-m", "ingest: seeded"], ["push", "-q"]]) spawnSync("git", a, { cwd: process.cwd() });
    }
    say({ result: "1. Which Enterprise name?\n2. How many showrooms?" });
  }
} else if (system.startsWith("# Eval judge")) {
  say({ result: "", structured_output: judge(stdin) });
} else if (process.env.FAKE_CLIENT_BAD) {
  say({ result: "", structured_output: { action: "maybe" } });
} else if (stdin.includes("Report: done")) {
  say({ result: "", structured_output: { action: "end", text: "", answers: [] } });
} else {
  say({
    result: "",
    structured_output: {
      action: "reply",
      text: "1. Harbor Tiles\n2. Don't know",
      answers: [
        { question: "Which Enterprise name?", answer: "Harbor Tiles", keys: ["K-01"], dontKnow: false, as: "enterprise" },
        { question: "How many showrooms?", answer: "Don't know", keys: [], dontKnow: true, as: "enterprise" },
      ],
    },
  });
}

function judge(text) {
  const blocks = [...text.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => JSON.parse(m[1]));
  const [golden, replay, dk] = blocks;
  const reqIds = replay.requirements.map((r) => r.id);
  const ois = replay.openItems.map((o) => o.id);
  const goldReqs = [...golden.modules.flatMap((m) => m.requirements), ...golden.general.requirements];
  const requirements = goldReqs.map((g) => ({ golden: g.id, matchedBy: reqIds.includes(g.id) ? [g.id] : [], note: "" }));
  if (process.env.FAKE_JUDGE_SKIP) requirements.shift();
  const matched = new Set(requirements.flatMap((r) => r.matchedBy));
  return {
    requirements,
    openItems: golden.openItems.map((g) => ({ golden: g.id, coveredBy: ois.includes(g.id) ? [g.id] : [], note: "" })),
    modules: golden.modules.map((g) => ({ golden: g.prefix, matchedBy: replay.modules.some((m) => m.prefix === g.prefix) ? [g.prefix] : [], note: "" })),
    extras: reqIds.filter((id) => !matched.has(id)).map((id) => ({ id, tag: id.startsWith("GEN") ? "plausible" : "noise", note: "fake" })),
    sourceCheck: reqIds.map((id) => ({ id, verdict: id === process.env.FAKE_INVENTED ? "invented" : "supported", note: id === process.env.FAKE_INVENTED ? "fake: not in Source" : "" })),
    dontKnow: dk.map((d) => ({ n: d.n, oi: process.env.FAKE_DK_NULL ? null : ois[0], note: "" })),
  };
}
