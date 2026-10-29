#!/usr/bin/env node
// upstream-check: maintainer-only tool (ticket 43). Not a skill, not an engine command, never shown by studio.
// Driver prompt: upstream-check.md (same folder). Run from the repo root.
//
//   upstream-check.mjs diff <plugin-dir> [--to <version>] [--repo <url|dir>] [--out <dir>]
//     Clones upstream (bare) into <out> (default: a new temp dir), then for each skill whose front-matter has
//     `upstream` and no `upstreamDiverged`: diffs each upstream path from the pinned `upstreamVersion` to <version>
//     (default: highest version tag) and collects the CHANGELOG entries in between. Writes to <out>:
//       changelog.md                  all CHANGELOG entries (oldest pin, target]
//       <skill>/upstream.diff         git diff old pin → target over the skill's upstream paths
//       <skill>/changelog.md          entries in its range that name one of its upstream skills
//       <skill>/old/<path>, new/<path> upstream files at the old pin and at the target
//       licence.diff                  only when upstream LICENSE changed
//     Never writes inside <plugin-dir>. Lines on stdout:
//       upstream | <repo> | <version> (<ref>) | out <dir>
//       skill | <name> | changed | <old> → <new> | <path>: <n> files +<a> -<d>; ...   (propose a re-adapt)
//       skill | <name> | unchanged | <old> → <new> | pin-only bump
//       skill | <name> | gone | <old> → <new> | <path> not in upstream at <new>      (maintainer decides)
//       skill | <name> | current | <version>
//       skill | <name> | skipped | diverged: <reason>
//       error | <name> | <text>
//       licence | unchanged|changed | ...
//       done | <n> changed, <n> unchanged, <n> gone, <n> current, <n> skipped, <n> errors
//     Exit 0 = report written, 1 = any error line or upstream unusable, 2 = bad arguments.
//
//   upstream-check.mjs pin <plugin-dir> <skill> <version>
//     Pin-only bump: rewrites the `upstreamVersion:` line of one skill's front-matter, nothing else.
//     Refuses a skill with no `upstream`, with `upstreamDiverged` (pin stays for history), or a version not newer.
//     Exit 0 = pinned, 1 = refused, 2 = bad arguments.
//
// Upstream version → git ref: tag v<version>, <version> or mattpocock-skills@<version>; else the oldest commit
// whose package.json has that version.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export const DEFAULT_REPO = "https://github.com/mattpocock/skills";
const USE = [
  "Usage: upstream-check.mjs diff <plugin-dir> [--to <version>] [--repo <url|dir>] [--out <dir>]",
  "       upstream-check.mjs pin <plugin-dir> <skill> <version>",
].join("\n");
const VERSION = /^\d+\.\d+\.\d+$/;

export async function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === "diff") return diff(rest);
  if (cmd === "pin") return pin(rest);
  console.error(USE);
  return 2;
}

// ---------- shared ----------

function usage(msg) {
  if (msg) console.error(`upstream-check: ${msg}`);
  console.error(USE);
  return 2;
}

function parseFlags(args, known) {
  const flags = {};
  const pos = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a.startsWith("--")) {
      pos.push(a);
      continue;
    }
    const key = a.slice(2);
    if (!known.includes(key) || i + 1 >= args.length) return { bad: a };
    flags[key] = args[++i];
  }
  return { flags, pos };
}

const cmp = (a, b) => {
  const x = a.split(".").map(Number);
  const y = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

// Reads the skills of a plugin: [{ name, file, text, fm }]; fm null when front-matter is unreadable.
function readSkills(pluginDir) {
  const skillsDir = join(pluginDir, "skills");
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort()
    .map((name) => {
      const file = join(skillsDir, name, "SKILL.md");
      const text = readFileSync(file, "utf8");
      const m = text.match(/^---\n([\s\S]*?)\n---\n/);
      let fm = null;
      try {
        fm = m ? parse(m[1]) : null;
      } catch {
        fm = null;
      }
      return { name, file, text, fm: fm && typeof fm === "object" ? fm : null };
    });
}

const pathsOf = (fm) => (Array.isArray(fm.upstream) ? fm.upstream : [fm.upstream]).map(String);

// ---------- diff ----------

function diff(args) {
  const { flags, pos, bad } = parseFlags(args, ["to", "repo", "out"]);
  if (bad) return usage(`unknown or incomplete option ${bad}`);
  if (pos.length !== 1) return usage();
  const pluginDir = resolve(pos[0]);
  if (!existsSync(join(pluginDir, "skills"))) return usage(`${pluginDir} has no skills/ folder`);
  if (flags.to !== undefined && !VERSION.test(flags.to)) return usage(`--to "${flags.to}" is not a version like 1.4.0`);

  let out;
  if (flags.out) {
    out = resolve(flags.out);
    if (existsSync(out) && readdirSync(out).length) return usage(`--out ${out} is not empty`);
    mkdirSync(out, { recursive: true });
  } else {
    out = mkdtempSync(join(tmpdir(), "neome-upstream-"));
  }

  const repoArg = flags.repo ?? DEFAULT_REPO;
  const repo = existsSync(repoArg) ? resolve(repoArg) : repoArg;
  const bare = join(out, "upstream.git");
  const clone = spawnSync("git", ["clone", "--bare", "--quiet", repo, bare], {
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (clone.error || clone.status !== 0) {
    console.error(`upstream-check: cannot fetch ${repo}: ${(clone.stderr || String(clone.error)).trim()}`);
    return 1;
  }
  const up = new Upstream(bare);

  const to = flags.to ?? up.latestVersion();
  if (!to) {
    console.error(`upstream-check: ${repo} has no version tags; pass --to <version>`);
    return 1;
  }
  const toRef = up.ref(to);
  if (!toRef) {
    console.error(`upstream-check: version ${to} not found in ${repo} (no tag v${to}, ${to} or mattpocock-skills@${to}, no package.json at ${to})`);
    return 1;
  }
  console.log(`upstream | ${repo} | ${to} (${toRef.label}) | out ${out}`);

  const changelog = parseChangelog(up.show(toRef.sha, "CHANGELOG.md") ?? "");
  const counts = { changed: 0, unchanged: 0, gone: 0, current: 0, skipped: 0, errors: 0 };
  const error = (name, text) => {
    counts.errors++;
    console.log(`error | ${name} | ${text}`);
  };
  let oldest = null;

  for (const s of readSkills(pluginDir)) {
    if (!s.fm) {
      error(s.name, "front-matter unreadable; run check");
      continue;
    }
    if (s.fm.upstream === undefined) continue;
    if (s.fm.upstreamDiverged !== undefined) {
      counts.skipped++;
      console.log(`skill | ${s.name} | skipped | diverged: ${String(s.fm.upstreamDiverged).trim()}`);
      continue;
    }
    const from = String(s.fm.upstreamVersion ?? "");
    if (!VERSION.test(from)) {
      error(s.name, `upstreamVersion "${from}" is not a version like 1.3.1; run check`);
      continue;
    }
    const c = cmp(from, to);
    if (c === 0) {
      counts.current++;
      console.log(`skill | ${s.name} | current | ${to}`);
      continue;
    }
    if (c > 0) {
      error(s.name, `pinned ${from} is newer than ${to}`);
      continue;
    }
    const fromRef = up.ref(from);
    if (!fromRef) {
      error(s.name, `pinned version ${from} not found upstream`);
      continue;
    }
    const paths = pathsOf(s.fm);
    const missingOld = paths.filter((p) => !up.has(fromRef.sha, p));
    if (missingOld.length) {
      error(s.name, `${missingOld.join(", ")} not in upstream at ${from}; fix the upstream key`);
      continue;
    }
    if (!oldest || cmp(from, oldest) < 0) oldest = from;

    const dir = join(out, s.name);
    mkdirSync(dir, { recursive: true });
    for (const p of paths) {
      up.snapshot(fromRef.sha, p, join(dir, "old"));
      up.snapshot(toRef.sha, p, join(dir, "new"));
    }
    const patch = up.git(["diff", "--no-color", fromRef.sha, toRef.sha, "--", ...paths]);
    writeFileSync(join(dir, "upstream.diff"), patch);
    const names = paths.map((p) => p.split("/").filter(Boolean).pop());
    writeFileSync(join(dir, "changelog.md"), renderChangelog(changelog, from, to, names));

    const gone = paths.filter((p) => !up.has(toRef.sha, p));
    const range = `${from} → ${to}`;
    if (gone.length) {
      counts.gone++;
      console.log(`skill | ${s.name} | gone | ${range} | ${gone.join(", ")} not in upstream at ${to}`);
    } else if (!patch.trim()) {
      counts.unchanged++;
      console.log(`skill | ${s.name} | unchanged | ${range} | pin-only bump`);
    } else {
      counts.changed++;
      const stats = paths.map((p) => {
        const rows = up
          .git(["diff", "--numstat", fromRef.sha, toRef.sha, "--", p])
          .split("\n")
          .filter(Boolean)
          .map((l) => l.split("\t"));
        const add = rows.reduce((n, r) => n + (Number(r[0]) || 0), 0);
        const del = rows.reduce((n, r) => n + (Number(r[1]) || 0), 0);
        return rows.length ? `${p}: ${rows.length} files +${add} -${del}` : `${p}: unchanged`;
      });
      console.log(`skill | ${s.name} | changed | ${range} | ${stats.join("; ")}`);
    }
  }

  if (oldest) {
    writeFileSync(join(out, "changelog.md"), renderChangelog(changelog, oldest, to, null));
    const fromRef = up.ref(oldest);
    const lic = up.git(["diff", "--no-color", fromRef.sha, toRef.sha, "--", "LICENSE"]);
    if (lic.trim()) {
      writeFileSync(join(out, "licence.diff"), lic);
      console.log(`licence | changed | ${oldest} → ${to} | see licence.diff; update LICENSE-upstream`);
    } else {
      console.log(`licence | unchanged | ${oldest} → ${to}`);
    }
  }
  console.log(
    `done | ${counts.changed} changed, ${counts.unchanged} unchanged, ${counts.gone} gone, ${counts.current} current, ${counts.skipped} skipped, ${counts.errors} errors`,
  );
  return counts.errors ? 1 : 0;
}

class Upstream {
  constructor(bare) {
    this.bare = bare;
    this.refs = new Map();
  }

  run(args) {
    const r = spawnSync("git", ["--git-dir", this.bare, ...args], { encoding: "buffer", maxBuffer: 256 * 1024 * 1024 });
    return { code: r.status, out: r.stdout ?? Buffer.alloc(0) };
  }

  git(args) {
    const r = this.run(args);
    return r.code === 0 ? r.out.toString("utf8") : "";
  }

  // Highest X.Y.Z among tags v<X.Y.Z>, <X.Y.Z>, <pkg>@<X.Y.Z>.
  latestVersion() {
    const versions = this.git(["tag", "--list"])
      .split("\n")
      .map((t) => t.trim().match(/^(?:v|[\w.-]+@)?(\d+\.\d+\.\d+)$/)?.[1])
      .filter(Boolean);
    return versions.sort(cmp).pop() ?? null;
  }

  // { sha, label } for a version, or null.
  ref(version) {
    if (this.refs.has(version)) return this.refs.get(version);
    let found = null;
    for (const tag of [`v${version}`, version, `mattpocock-skills@${version}`]) {
      const sha = this.git(["rev-parse", "--verify", "--quiet", `refs/tags/${tag}^{commit}`]).trim();
      if (sha) {
        found = { sha, label: `tag ${tag}` };
        break;
      }
    }
    if (!found) {
      // No tag: oldest commit whose package.json carries this version.
      const shas = this.git(["log", "--all", "--reverse", "--format=%H", "-S", `"version": "${version}"`, "--", "package.json"])
        .split("\n")
        .filter(Boolean);
      for (const sha of shas) {
        try {
          if (JSON.parse(this.show(sha, "package.json") ?? "{}").version === version) {
            found = { sha, label: `commit ${sha.slice(0, 7)}, package.json ${version}` };
            break;
          }
        } catch {
          /* not JSON at that commit */
        }
      }
    }
    this.refs.set(version, found);
    return found;
  }

  show(sha, file) {
    const r = this.run(["show", `${sha}:${file}`]);
    return r.code === 0 ? r.out.toString("utf8") : null;
  }

  has(sha, path) {
    return this.git(["ls-tree", "--name-only", sha, "--", path.replace(/\/+$/, "")]).trim() !== "";
  }

  snapshot(sha, path, intoDir) {
    const files = this.git(["ls-tree", "-r", "--name-only", sha, "--", path]).split("\n").filter(Boolean);
    for (const f of files) {
      const target = join(intoDir, f);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, this.run(["show", `${sha}:${f}`]).out);
    }
  }
}

// CHANGELOG.md (changesets shape): `## X.Y.Z` sections, `- ` top-level entries with indented continuations.
function parseChangelog(text) {
  const sections = [];
  let cur = null;
  let entry = null;
  for (const line of text.split("\n")) {
    const h = line.match(/^## (\d+\.\d+\.\d+)\s*$/);
    if (h) {
      cur = { version: h[1], entries: [] };
      sections.push(cur);
      entry = null;
      continue;
    }
    if (!cur) continue;
    if (line.startsWith("- ")) {
      entry = [line];
      cur.entries.push(entry);
    } else if (entry && (line.startsWith(" ") || line === "")) {
      entry.push(line);
    } else {
      entry = null;
    }
  }
  return sections.map((s) => ({ version: s.version, entries: s.entries.map((e) => e.join("\n").trimEnd()) }));
}

// Entries with from < version ≤ to, newest first. names → keep only entries naming one of those skills.
function renderChangelog(sections, from, to, names) {
  const named = (e) =>
    names.some((n) => {
      const q = n.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
      return new RegExp(`\`${q}\`|\\*\\*${q}\\*\\*|/${q}\\b|(^|\\s)${q}:`).test(e);
    });
  const picked = sections
    .filter((s) => cmp(s.version, from) > 0 && cmp(s.version, to) <= 0)
    .sort((a, b) => cmp(b.version, a.version))
    .map((s) => ({ version: s.version, entries: names ? s.entries.filter(named) : s.entries }));
  const head = names
    ? `# Upstream CHANGELOG ${from} → ${to}, entries naming ${names.map((n) => `\`${n}\``).join(", ")}\n`
    : `# Upstream CHANGELOG ${from} → ${to}\n`;
  const body = picked
    .filter((s) => s.entries.length)
    .map((s) => `\n## ${s.version}\n\n${s.entries.join("\n\n")}\n`)
    .join("");
  return head + (body || "\nNo entries.\n");
}

// ---------- pin ----------

function pin(args) {
  if (args.length !== 3 || args.some((a) => a.startsWith("--"))) return usage();
  const [dir, name, version] = args;
  const pluginDir = resolve(dir);
  if (!VERSION.test(version)) return usage(`"${version}" is not a version like 1.4.0`);
  const refuse = (msg) => {
    console.error(`upstream-check: ${name}: ${msg}`);
    return 1;
  };
  const s = readSkills(pluginDir).find((x) => x.name === name);
  if (!s) return refuse(`no skill folder with SKILL.md in ${join(pluginDir, "skills")}`);
  if (!s.fm) return refuse("front-matter unreadable; run check");
  if (s.fm.upstream === undefined) return refuse("no upstream key; nothing to pin");
  if (s.fm.upstreamDiverged !== undefined) return refuse("upstreamDiverged is set; pin stays for history");
  const from = String(s.fm.upstreamVersion ?? "");
  if (VERSION.test(from) && cmp(version, from) <= 0) return refuse(`pinned ${from}; ${version} is not newer`);

  const end = s.text.indexOf("\n---\n", 4);
  const front = s.text.slice(0, end);
  const line = /^upstreamVersion:.*$/m;
  const next = line.test(front)
    ? front.replace(line, `upstreamVersion: ${version}`)
    : `${front}\nupstreamVersion: ${version}`;
  writeFileSync(s.file, next + s.text.slice(end));
  console.log(`pinned | ${name} | ${from || "(none)"} → ${version}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
