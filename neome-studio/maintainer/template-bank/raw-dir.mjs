// The raw dir holds client data (Build JSON, digests, word lists, Build code map). It must stay gitignored, and
// the template-bank scripts write nowhere else.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const DEFAULT_RAW = join(repoRoot, ".scratch", "template-bank", "raw");

/** null if usable; else why not. Inside a git work tree it must be gitignored. */
export function rawDirProblem(rawDir) {
  let probe = resolve(rawDir);
  while (!existsSync(probe)) probe = dirname(probe);
  const inTree = spawnSync("git", ["-C", probe, "rev-parse", "--is-inside-work-tree"], { encoding: "utf8" });
  if (inTree.status !== 0 || inTree.stdout.trim() !== "true") return null;
  const ignored = spawnSync("git", ["-C", probe, "check-ignore", "-q", join(resolve(rawDir), ".probe")]);
  return ignored.status === 0 ? null : `raw dir ${rawDir} is inside a git repo and not gitignored`;
}

/** Path under rawDir; throws if rel escapes it. */
export function inside(rawDir, ...rel) {
  const root = resolve(rawDir), p = resolve(root, ...rel);
  const r = relative(root, p);
  if (r === "" || r.startsWith("..") || r.startsWith(sep) || resolve(r) === r) throw new Error(`refusing to write outside raw dir: ${p}`);
  return p;
}

export function writeInside(rawDir, rel, content) {
  const p = inside(rawDir, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  return p;
}

export function resetInside(rawDir, rel) {
  const p = inside(rawDir, rel);
  rmSync(p, { recursive: true, force: true });
  mkdirSync(p, { recursive: true });
  return p;
}

/** Parse `[--raw <dir>] [rest…]`; unknown --flags → error. */
export function parseArgs(argv) {
  let raw = DEFAULT_RAW;
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--raw") { raw = argv[++i]; if (!raw) return { error: "--raw needs a dir" }; }
    else if (argv[i].startsWith("--")) return { error: `unknown option ${argv[i]}` };
    else rest.push(argv[i]);
  }
  return { raw: resolve(raw), rest };
}
