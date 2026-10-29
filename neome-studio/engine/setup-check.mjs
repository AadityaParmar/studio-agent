// setup-check [<repo-root>]: the Consultant's prerequisites, for the studio skill (ticket 38).
// Read-only. One line per check: `ok | <check> | <detail>` or `miss | <check> | <what is wrong>. <fix>`.
// Checks: git clone with a reachable remote, git user.name (claims and locks use it), node_modules
// matching package.json pins, pinned Mermaid CLI, neome-studio plugin enabled in the project settings.
// Exit 0 = all ok, 1 = something missing, 2 = bad arguments.
// Imports only node built-ins (and the mmdc lookup), so it runs before `npm ci`.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { findMmdc, checkMmdc } from "./brd/diagrams.mjs";

const USE = "Usage: setup-check [<repo-root>]";
const PLUGIN = "neome-studio@neome";
const REMOTE_TIMEOUT_MS = 20000;

export function setupCheck(args) {
  if (args.length > 1 || args.some((a) => a.startsWith("--"))) {
    console.error(USE);
    return 2;
  }
  const root = resolve(args[0] ?? process.cwd());
  if (!existsSync(root)) {
    console.error(`setup-check: ${root} does not exist\n${USE}`);
    return 2;
  }
  const results = [...gitChecks(root), nodeModules(root), mmdc(root), plugin(root)];
  for (const r of results) console.log(`${r.ok ? "ok" : "miss"} | ${r.name} | ${r.text}`);
  const missing = results.filter((r) => !r.ok).length;
  console.log(`setup-check: ${results.length - missing} ok, ${missing} missing`);
  return missing ? 1 : 0;
}

const ok = (name, text) => ({ ok: true, name, text });
const miss = (name, text) => ({ ok: false, name, text });

function git(root, args, extra = {}) {
  const r = spawnSync("git", ["-C", root, ...args], { encoding: "utf8", ...extra });
  return { code: r.error ? null : r.status, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim(), error: r.error };
}

const lastLine = (s) => s.split("\n").filter(Boolean).pop() ?? "";

function gitChecks(root) {
  const top = git(root, ["rev-parse", "--show-toplevel"]);
  if (top.error) return [miss("git", "git is not installed. Install git, then run studio again.")];
  const user = git(root, ["config", "user.name"]);
  const who = user.out
    ? ok("git user", `${user.out} (claims and locks show this name)`)
    : miss("git user", 'git user.name is not set; claims and locks need it. Run `git config --global user.name "Your Name"` once.');
  if (top.code !== 0) {
    return [miss("git", "This folder is not a git clone. Clone the team repo and open the clone in Claude Code."), who];
  }
  const remotes = git(root, ["remote"]).out.split("\n").filter(Boolean);
  if (!remotes.length) {
    return [miss("git", "No git remote, so skills cannot push. Clone the team repo (not a copy of the folder)."), who];
  }
  const remote = remotes.includes("origin") ? "origin" : remotes[0];
  const url = git(root, ["remote", "get-url", remote]).out;
  const env = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
  if (!env.GIT_SSH_COMMAND) env.GIT_SSH_COMMAND = "ssh -o BatchMode=yes -o ConnectTimeout=10";
  const reach = git(root, ["ls-remote", "--heads", remote], { env, timeout: REMOTE_TIMEOUT_MS });
  if (reach.code !== 0) {
    const why = reach.error?.code === "ETIMEDOUT" ? `no answer in ${REMOTE_TIMEOUT_MS / 1000} s` : lastLine(reach.err) || `exit ${reach.code}`;
    return [
      miss("git", `Remote ${remote} (${url}) not reachable: ${why}. Check network or VPN and your GitHub access (ask the maintainer for repo access).`),
      who,
    ];
  }
  return [ok("git", `remote ${remote} (${url}) reachable`), who];
}

function nodeModules(root) {
  const pkgFile = join(root, "package.json");
  if (!existsSync(pkgFile)) return miss("node_modules", `No package.json in ${root}. Open the repo root in Claude Code.`);
  let pins;
  try {
    pins = JSON.parse(readFileSync(pkgFile, "utf8")).dependencies ?? {};
  } catch {
    return miss("node_modules", "package.json is not valid JSON. Pull the team version.");
  }
  if (!existsSync(join(root, "node_modules"))) return miss("node_modules", "node_modules missing. Run `npm ci` in the repo root.");
  const bad = [];
  for (const [name, want] of Object.entries(pins)) {
    const file = join(root, "node_modules", name, "package.json");
    const have = existsSync(file) ? safeVersion(file) : null;
    if (have !== want) bad.push(`${name} ${have ?? "missing"} (need ${want})`);
  }
  if (bad.length) return miss("node_modules", `node_modules out of date: ${bad.join(", ")}. Run \`npm ci\` in the repo root.`);
  return ok("node_modules", `${Object.keys(pins).length} pinned package(s) installed`);
}

function safeVersion(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8")).version ?? null;
  } catch {
    return null;
  }
}

function mmdc(root) {
  const bin = findMmdc(root);
  const problem = checkMmdc(bin);
  return problem ? miss("mmdc", problem.msg) : ok("mmdc", `Mermaid CLI pinned version at ${bin}`);
}

// Project settings enable the plugin (ticket 15); a local settings file can switch it off.
function plugin(root) {
  const fix = "Restore `.claude/settings.json` from the team repo (pull), reopen the repo in Claude Code, trust the `neome` marketplace and enable neome-studio (`/plugin`).";
  const project = readJson(join(root, ".claude", "settings.json"));
  if (!project) return miss("plugin", `.claude/settings.json missing or not valid JSON. ${fix}`);
  if (!project.extraKnownMarketplaces?.neome) return miss("plugin", `.claude/settings.json does not register the \`neome\` marketplace. ${fix}`);
  if (project.enabledPlugins?.[PLUGIN] !== true) return miss("plugin", `.claude/settings.json does not enable ${PLUGIN}. ${fix}`);
  const local = readJson(join(root, ".claude", "settings.local.json"));
  if (local?.enabledPlugins?.[PLUGIN] === false) {
    return miss("plugin", `${PLUGIN} is switched off in .claude/settings.local.json. Enable it again with \`/plugin\` (or delete that line).`);
  }
  const market = readJson(join(root, ".claude-plugin", "marketplace.json"));
  if (!market?.plugins?.some((p) => p.name === "neome-studio")) {
    return miss("plugin", `.claude-plugin/marketplace.json does not list neome-studio. ${fix}`);
  }
  if (!existsSync(join(root, "neome-studio", ".claude-plugin", "plugin.json"))) {
    return miss("plugin", `neome-studio/.claude-plugin/plugin.json missing. ${fix}`);
  }
  return ok("plugin", `${PLUGIN} enabled in .claude/settings.json`);
}

function readJson(file) {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}
