// Pack lint: every skill keeps the How to talk block verbatim and valid front-matter;
// cloned skills pin their upstream, and the upstream licence ships while any do.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const HOW_TO_TALK = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "reference", "how-to-talk.md"),
  "utf8",
).trim();

export function check(pluginDir) {
  if (!pluginDir) {
    console.error("Usage: check <plugin-dir>");
    return 2;
  }
  const skillsDir = join(pluginDir, "skills");
  const skills = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];
  const results = skills.map((name) => ({ name, ...checkSkill(join(skillsDir, name), name) }));
  const errors = results.flatMap(({ name, errors }) => errors.map((e) => `${name}: ${e}`));
  if (results.some((r) => r.cloned) && !existsSync(join(pluginDir, "LICENSE-upstream"))) {
    errors.push("LICENSE-upstream missing: required while any skill has upstream");
  }
  for (const e of errors) console.error(e);
  if (errors.length) return 1;
  console.log(`check: ${skills.length} skills OK`);
  return 0;
}

// Returns { errors, cloned } for one skill folder.
function checkSkill(dir, name) {
  const fail = (errors) => ({ errors, cloned: false });
  const file = join(dir, "SKILL.md");
  if (!existsSync(file)) return fail(["SKILL.md missing"]);
  const text = readFileSync(file, "utf8");
  const errors = [];
  if (!text.includes(HOW_TO_TALK)) errors.push("How to talk block missing or changed");

  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return fail([...errors, "front-matter missing"]);
  let fm;
  try {
    fm = parse(match[1]);
  } catch {
    return fail([...errors, "front-matter is not valid YAML"]);
  }
  if (!fm || typeof fm !== "object") return fail([...errors, "front-matter missing"]);
  if (fm.name !== name) errors.push(`name "${fm.name}" does not match folder`);
  if (typeof fm.description !== "string" || !fm.description.trim()) errors.push("description missing");

  const cloned = fm.upstream !== undefined;
  if (cloned) {
    if (fm.upstreamVersion === undefined) errors.push("upstream set but upstreamVersion missing");
    else if (!/^\d+\.\d+\.\d+$/.test(String(fm.upstreamVersion))) {
      errors.push(`upstreamVersion "${fm.upstreamVersion}" is not a version like 1.3.1`);
    }
  }
  if (fm.upstreamDiverged !== undefined && !String(fm.upstreamDiverged ?? "").trim()) {
    errors.push("upstreamDiverged needs a reason");
  }
  return { errors, cloned };
}
