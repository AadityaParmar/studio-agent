// Pack lint: valid front-matter, no own How to talk block (root CLAUDE.md is its one home);
// cloned skills pin their upstream, and the upstream licence ships while any do;
// every user skill (`disable-model-invocation: true`) ends with the Next session step (ticket 45):
// a `## <n>. Next session` heading that links reference/next-session.md.
// Also the Template bank format check (reference/template-bank/, if present).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { checkBank } from "./template-bank.mjs";

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
  const bank = bankCheck(pluginDir);
  errors.push(...bank.errors.map((e) => `template-bank: ${e}`));
  for (const w of bank.warnings) console.error(`template-bank: warning: ${w}`);
  for (const e of errors) console.error(e);
  if (errors.length) return 1;
  const bankNote = bank.entries === null ? "" : `, Template bank ${bank.entries} entries OK`;
  console.log(`check: ${skills.length} skills OK${bankNote}`);
  return 0;
}

// Template bank check. Scrub words: *.txt (one per line, # comments) in NEOME_SCRUB_DIR,
// else the gitignored raw/scrub folder when present (maintainer machine only).
function bankCheck(pluginDir) {
  const bankDir = join(pluginDir, "reference", "template-bank");
  if (!existsSync(bankDir)) return { errors: [], warnings: [], entries: null };
  const envDir = process.env.NEOME_SCRUB_DIR;
  const scrubDir = envDir || join(pluginDir, "..", ".scratch", "template-bank", "raw", "scrub");
  const pre = [];
  let scrubWords = [];
  if (existsSync(scrubDir)) scrubWords = readScrubWords(scrubDir);
  else if (envDir) pre.push(`NEOME_SCRUB_DIR not found: ${envDir}`);
  const r = checkBank(bankDir, { catalogSlugsPath: join(pluginDir, "reference", "neome-app-catalog-slugs.json"), scrubWords });
  const entries = ["patterns", "template-modules", "templates", "apps"]
    .map((d) => join(bankDir, d))
    .filter(existsSync)
    .reduce((n, d) => n + readdirSync(d).filter((f) => f.endsWith(".md")).length, 0);
  return { errors: [...pre, ...r.errors], warnings: r.warnings, entries };
}

function readScrubWords(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".txt"))
    .flatMap((f) => readFileSync(join(dir, f), "utf8").split(/\r?\n/))
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

// Returns { errors, cloned } for one skill folder.
function checkSkill(dir, name) {
  const fail = (errors) => ({ errors, cloned: false });
  const file = join(dir, "SKILL.md");
  if (!existsSync(file)) return fail(["SKILL.md missing"]);
  const text = readFileSync(file, "utf8");
  const errors = [];
  if (/^## How to talk$/m.test(text)) errors.push("How to talk block duplicates root CLAUDE.md: remove it");

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
  if (fm["disable-model-invocation"] === true) {
    if (!/^## \d+\. Next session$/m.test(text)) errors.push("user skill without a `## <n>. Next session` step");
    if (!text.includes("](../../reference/next-session.md)")) errors.push("user skill does not link reference/next-session.md");
  }
  if (fm.upstreamDiverged !== undefined && !String(fm.upstreamDiverged ?? "").trim()) {
    errors.push("upstreamDiverged needs a reason");
  }
  return { errors, cloned };
}
