// Replay driver: runs a case's replay.yaml steps in the workspace clones.
//   skill step      headless skill session (llm.skillTurn); every message goes to the simulated client
//                   (llm.ask, answer key only), whose reply goes back, until the client says end or maxTurns.
//   engine step     a Consultant acts outside a skill: pull, one engine command, commit, push. No LLM.
//   enterprise step the simulated Enterprise writes an Input (Questionnaire reply, signed copy) into clone a.
// After each step: `status <eng> --who <name>` snapshot. Everything goes to run/log.jsonl and run/transcript.md.
// Client answers are numbered (n) across the run; the judge checks each Don't know ended as an Open Item.
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { SCHEMAS, shapeErrors, EVALS_DIR } from "./case.mjs";
import { engagementPath, git } from "./workspace.mjs";

export const CLIENT_PROMPT = join(EVALS_DIR, "prompts", "simulated-client.md");
const DEFAULT_TURNS = 40;

// Placeholders in replay.yaml strings: {eng} {ent} (repo-relative paths), {who} (this step's Consultant),
// {a} {b} (Consultant names), {date} (run date), {next} {claimed} (first prefix on the `next` / `claimed`
// line of `status` in this step's clone, read when the step starts).
export function fill(text, ctx) {
  return String(text).replace(/\{(eng|ent|who|a|b|date|next|claimed)\}/g, (_, k) => ctx[k] ?? `{${k}}`);
}

function frontierPrefixes(cwd, eng, who) {
  const out = existsSync(join(cwd, eng, "_agent")) ? engine(cwd, ["status", eng, "--who", who]).out : "";
  const first = (kind) => out.split("\n").map((l) => l.split(" | ")).find((c) => c[0] === kind)?.[1];
  return { next: first("next"), claimed: first("claimed") };
}

// The simulated client's whole system prompt: role prompt + case cast + answer key. Nothing else from the case.
export function clientSystem(kase) {
  const { a, b } = kase.replay.consultants;
  return [
    readFileSync(CLIENT_PROMPT, "utf8").trim(),
    "",
    "# Cast",
    "",
    `- Consultant a: ${a.name}`,
    `- Consultant b: ${b.name}`,
    "",
    "# Answer key",
    "",
    kase.answerKey.trim(),
    "",
  ].join("\n");
}

export function replayCase({ info, kase, llm, from = null, log: logFile = join(info.run, "log.jsonl") }) {
  const { replay } = kase;
  const eng = engagementPath(replay);
  const names = { a: replay.consultants.a.name, b: replay.consultants.b.name };
  const system = clientSystem(kase);
  let n = existsSync(logFile)
    ? readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse).filter((e) => e.kind === "answer").length
    : 0;
  const problems = [];
  let cost = 0;
  const log = (entry) => appendFileSync(logFile, JSON.stringify(entry) + "\n");
  const problem = (step, text) => {
    problems.push(`${step}: ${text}`);
    log({ kind: "problem", step, text });
  };

  let started = from === null;
  for (const step of replay.steps) {
    if (!started && step.id !== from) continue;
    started = true;
    const as = step.as ?? "a";
    const cwd = info.clones[as];
    const ctx = { eng, ent: `enterprises/${replay.enterprise}`, who: names[as], a: names.a, b: names.b, date: info.date };
    if (/\{(next|claimed)\}/.test(JSON.stringify(step))) {
      git(cwd, ["pull", "-q", "--rebase", "--autostash"]);
      Object.assign(ctx, frontierPrefixes(cwd, eng, names[as]));
    }
    const type = step.skill ? "skill" : step.engine ? "engine" : "enterprise";

    if (type === "engine") {
      log({ kind: "step", step: step.id, type, as });
      git(cwd, ["pull", "-q", "--rebase", "--autostash"]);
      const args = step.engine.map((x) => fill(x, ctx));
      const r = engine(cwd, args);
      log({ kind: "engine", step: step.id, args, code: r.code, out: r.out });
      const want = step.expectExit ?? 0;
      if (r.code !== want) problem(step.id, `engine ${args[0]} exit ${r.code}, expected ${want}: ${r.out.split("\n")[0]}`);
      else if (r.code === 0) {
        git(cwd, ["add", "-A"]);
        const c = git(cwd, ["commit", "-q", "-m", fill(step.commit, ctx)]);
        const p = git(cwd, ["push", "-q"]);
        log({ kind: "git", step: step.id, commit: c.code, push: p.code, out: `${c.out}\n${p.out}`.trim() });
        if (c.code || p.code) problem(step.id, `commit/push failed: ${`${c.out} ${p.out}`.trim().slice(0, 200)}`);
      }
    } else if (type === "enterprise") {
      log({ kind: "step", step: step.id, type, as: "enterprise" });
      const a = info.clones.a;
      git(a, ["pull", "-q", "--rebase", "--autostash"]);
      let view = "";
      if (step.enterprise.read) {
        const f = newest(join(a, eng), step.enterprise.read);
        if (!f) {
          problem(step.id, `no file matches ${step.enterprise.read}`);
          continue;
        }
        view = `\n\n# ${basename(f)}\n\n${readFileSync(f, "utf8")}`;
      }
      const prompt = `Step ${step.id}. You write as the Enterprise, not to a skill.\nBrief: ${fill(step.brief, ctx)}${view}\n\nPut the whole message in text, action reply.`;
      const r = llm.ask({ cwd: info.run, system, prompt, schema: SCHEMAS.client });
      cost += r.cost ?? 0;
      const bad = shapeErrors("client", r.json);
      if (bad.length || !r.json.text.trim()) {
        problem(step.id, `client answer unusable: ${bad[0] ?? "empty text"}`);
        continue;
      }
      n = logAnswers(log, step.id, r.json, n);
      const out = join(a, "enterprises", replay.enterprise, "inputs", step.enterprise.write);
      writeFileSync(out, r.json.text.trimEnd() + "\n");
      log({ kind: "input", step: step.id, file: step.enterprise.write, text: r.json.text });
    } else {
      const max = step.repeat?.max ?? 1;
      for (let run = 1; run <= max; run++) {
        if (step.repeat) {
          git(cwd, ["pull", "-q", "--rebase", "--autostash"]);
          const s = engine(cwd, ["status", eng, "--who", names[as]]);
          if (!new RegExp(step.repeat.whileStatus, "m").test(s.out)) break;
        }
        log({ kind: "step", step: step.id, type, as, run });
        const r = skillSession({ cwd, run: info.run, step, ctx, llm, system, log, n, problem });
        n = r.n;
        cost += r.cost;
        if (r.fatal) break;
      }
    }
    snapshot(log, step.id, step.skill || step.engine ? cwd : info.clones.a, eng, ctx.who);
  }
  if (!started) problem("replay", `no step ${from}`);
  git(info.clones.a, ["pull", "-q", "--rebase", "--autostash"]);
  log({ kind: "end", problems: problems.length, cost });
  writeFileSync(join(info.run, "transcript.md"), transcript(logFile, kase.name));
  return { problems, cost };
}

function skillSession({ cwd, run, step, ctx, llm, system, log, n, problem }) {
  let prompt = `/neome-studio:${step.skill}${step.args ? ` ${fill(step.args, ctx)}` : ""}`;
  let session = null;
  let clientSession = null;
  let cost = 0;
  const turns = step.maxTurns ?? DEFAULT_TURNS;
  for (let turn = 1; turn <= turns; turn++) {
    const s = llm.skillTurn({ cwd, prompt, session });
    session = s.session;
    cost += s.cost ?? 0;
    log({ kind: "skill", step: step.id, turn, session, prompt, text: s.text });
    const head = turn === 1
      ? `Step ${step.id}. You are ${ctx.who}, the Consultant running /neome-studio:${step.skill}.\nBrief: ${fill(step.brief, ctx)}\n\n`
      : "";
    const c = llm.ask({ cwd: run, system, prompt: `${head}Message from the skill (turn ${turn}):\n\n${s.text}`, schema: SCHEMAS.client, session: clientSession });
    clientSession = c.session;
    cost += c.cost ?? 0;
    const bad = shapeErrors("client", c.json);
    if (bad.length) {
      problem(step.id, `client answer unusable: ${bad[0]}`);
      return { n, cost, fatal: true };
    }
    log({ kind: "client", step: step.id, turn, action: c.json.action, text: c.json.text });
    n = logAnswers(log, step.id, c.json, n);
    if (c.json.action === "end") return { n, cost };
    if (!c.json.text.trim()) {
      problem(step.id, `client replied with empty text at turn ${turn}`);
      return { n, cost, fatal: true };
    }
    prompt = c.json.text;
  }
  problem(step.id, `turn limit ${turns} reached; the skill session did not end`);
  return { n, cost, fatal: true };
}

function logAnswers(log, step, json, n) {
  for (const a of json.answers) log({ kind: "answer", n: ++n, step, ...a });
  return n;
}

function engine(cwd, args) {
  const r = spawnSync(process.execPath, [join(cwd, "neome-studio", "engine", "cli.mjs"), ...args], { cwd, encoding: "utf8" });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
}

function snapshot(log, step, cwd, eng, who) {
  if (!existsSync(join(cwd, eng, "_agent"))) return;
  log({ kind: "status", step, out: engine(cwd, ["status", eng, "--who", who]).out });
}

// Newest (by name) file in <dir>/<sub> matching a one-level glob like questionnaires/QN-*.txt.
export function newest(engDir, pattern) {
  const dir = join(engDir, dirname(pattern));
  if (!existsSync(dir)) return null;
  const re = new RegExp(`^${basename(pattern).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
  const hits = readdirSync(dir).filter((f) => re.test(f)).sort();
  return hits.length ? join(dir, hits.at(-1)) : null;
}

// Human-readable log for the maintainer.
export function transcript(logFile, name) {
  const out = [`# Replay transcript: ${name}`, ""];
  const quote = (t) => String(t).trim().split("\n").map((l) => `> ${l}`).join("\n");
  for (const e of readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse)) {
    if (e.kind === "step") out.push(`## ${e.step} (${e.type}, ${e.as}${e.run > 1 ? `, run ${e.run}` : ""})`, "");
    else if (e.kind === "skill") out.push(`**Skill, turn ${e.turn}:**`, "", quote(e.text), "");
    else if (e.kind === "client") out.push(`**Client (${e.action}):**`, "", e.text ? quote(e.text) : "_(nothing)_", "");
    else if (e.kind === "answer") out.push(`- A${e.n} ${e.as}${e.dontKnow ? " · Don't know" : ""}${e.keys.length ? ` · ${e.keys.join(", ")}` : ""}: ${e.question} → ${e.answer}`, "");
    else if (e.kind === "engine") out.push(`\`engine ${e.args.map((x) => (/\s/.test(x) ? `"${x}"` : x)).join(" ")}\` → exit ${e.code}`, "", "```", e.out, "```", "");
    else if (e.kind === "git") out.push(`git commit ${e.commit} push ${e.push}`, "");
    else if (e.kind === "input") out.push(`**Input written:** \`${e.file}\``, "", quote(e.text), "");
    else if (e.kind === "status") out.push("", "Status after step:", "", "```", e.out, "```", "");
    else if (e.kind === "problem") out.push(`**Problem:** ${e.text}`, "");
    else if (e.kind === "end") out.push(`## End`, "", `${e.problems} problem(s), cost $${(e.cost ?? 0).toFixed(2)}`, "");
  }
  return out.join("\n") + "\n";
}

export function readLog(file) {
  return existsSync(file) ? readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : [];
}
