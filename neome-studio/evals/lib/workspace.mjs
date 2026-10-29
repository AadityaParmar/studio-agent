// Eval workspace: a temp copy of the repo where a case replays, never the real repo.
//   <work>/remote.git   local bare remote (main), so skills can pull, claim, lock and push
//   <work>/a, <work>/b  two Consultant clones (replay.yaml consultants a, b), node_modules symlinked
//   <work>/run/         case.json, log.jsonl, transcript.md, judge input/output (outside both clones)
// The clones get the plugin without evals/ and engine/test/, so no skill session can read a golden file or answer key.
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, symlinkSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";

// Repo files a Consultant's clone has (plus enterprises/ from the case).
const COPY = [
  ".claude/settings.json",
  ".claude-plugin",
  "neome-studio",
  "CLAUDE.md",
  "GLOSSARY.md",
  "GLOSSARY-MAP.md",
  "README.md",
  ".gitignore",
  "package.json",
  "package-lock.json",
];
const SKIP = ["neome-studio/evals", "neome-studio/engine/test"];

export function git(cwd, args, env = process.env) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
}

function mustGit(cwd, args, env) {
  const r = git(cwd, args, env);
  if (r.code !== 0) throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${r.out}`);
  return r.out;
}

export const engagementPath = (replay) => `enterprises/${replay.enterprise}/engagements/${replay.engagement}`;

// Builds the workspace for one loaded case. Returns the case.json object (also written to run/case.json).
export function prepareWorkspace({ repoRoot, kase, work, date, branch = "unknown", commit = null, env = process.env }) {
  const root = work ? resolve(work) : mkdtempSync(join(tmpdir(), `neome-eval-${kase.name}-`));
  mkdirSync(root, { recursive: true });
  if (readdirSync(root).length) throw new Error(`work folder ${root} is not empty`);
  const { replay } = kase;
  const remote = join(root, "remote.git");
  const a = join(root, "a");
  const b = join(root, "b");
  const run = join(root, "run");
  mkdirSync(run);
  mustGit(root, ["init", "--bare", "-b", "main", remote], env);
  mustGit(root, ["clone", "-q", remote, a], env);

  for (const f of COPY) {
    const from = join(repoRoot, f);
    if (!existsSync(from)) continue;
    cpSync(from, join(a, f), {
      recursive: true,
      filter: (src) => {
        const rel = relative(repoRoot, src).split(sep).join("/");
        return !SKIP.some((s) => rel === s || rel.startsWith(`${s}/`)) && !rel.endsWith(".DS_Store");
      },
    });
  }
  const inputs = join(a, "enterprises", replay.enterprise, "inputs");
  mkdirSync(inputs, { recursive: true });
  for (const f of kase.inputs) cpSync(join(kase.dir, "inputs", f), join(inputs, f));

  configure(a, replay.consultants.a, repoRoot, env);
  mustGit(a, ["add", "-A"], env);
  mustGit(a, ["commit", "-q", "-m", `eval: seed ${kase.name}`], env);
  mustGit(a, ["push", "-q", "-u", "origin", "main"], env);
  mustGit(root, ["clone", "-q", remote, b], env);
  configure(b, replay.consultants.b, repoRoot, env);

  const info = {
    case: kase.name,
    caseDir: kase.dir,
    repoRoot,
    date,
    branch,
    commit,
    work: root,
    enterprise: replay.enterprise,
    engagement: replay.engagement,
    remote,
    clones: { a, b },
    run,
  };
  writeFileSync(join(run, "case.json"), JSON.stringify(info, null, 2) + "\n");
  return info;
}

function configure(clone, who, repoRoot, env) {
  mustGit(clone, ["config", "user.name", who.name], env);
  mustGit(clone, ["config", "user.email", who.email], env);
  mustGit(clone, ["config", "commit.gpgsign", "false"], env);
  mustGit(clone, ["config", "pull.rebase", "true"], env);
  // The symlink is a file to git, so `node_modules/` in .gitignore misses it.
  appendFileSync(join(clone, ".git", "info", "exclude"), "\nnode_modules\n");
  const nm = join(repoRoot, "node_modules");
  if (existsSync(nm) && !existsSync(join(clone, "node_modules"))) symlinkSync(nm, join(clone, "node_modules"), "dir");
}

export function readWorkspace(work) {
  const f = join(resolve(work), "run", "case.json");
  if (!existsSync(f)) throw new Error(`${work} is not an eval workspace (no run/case.json)`);
  return JSON.parse(readFileSync(f, "utf8"));
}
