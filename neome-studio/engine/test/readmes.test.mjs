// READMEs (ticket 39): the Consultant README (repo root) and the plugin README (maintainer doc) stay true to the
// pack: section order, only real skills named, origins match front-matter pins, engine commands exist, links resolve.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const engine = join(here, "..");
const plugin = join(engine, "..");
const repo = join(plugin, "..");
const SIX = ["studio", "ingest", "review-draft", "resolve-module", "questionnaire", "build-brd"];

const consultant = readFileSync(join(repo, "README.md"), "utf8");
const maintainer = readFileSync(join(plugin, "README.md"), "utf8");

const skills = readdirSync(join(plugin, "skills"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    const text = readFileSync(join(plugin, "skills", d.name, "SKILL.md"), "utf8");
    return { name: d.name, fm: parse(text.split(/^---$/m)[1]) };
  });

const h2 = (text) => [...text.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
const section = (text, title) => {
  const start = text.indexOf(`\n## ${title}\n`);
  assert.ok(start >= 0, `section ${title} missing`);
  const next = text.indexOf("\n## ", start + 1);
  return text.slice(start, next < 0 ? undefined : next);
};
const tableRows = (text) =>
  text.split("\n").filter((l) => /^\| `[a-z-]+`/.test(l)).map((l) => l.split("|").map((c) => c.trim()).slice(1, -1));

function assertLinks(text, base) {
  for (const link of [...text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)].map((m) => m[1])) {
    if (/^https?:/.test(link)) continue;
    assert.ok(existsSync(join(base, link)), `broken link ${link}`);
  }
}

// Backticked repo paths (no placeholders) must exist.
function assertPaths(text) {
  for (const p of new Set([...text.matchAll(/`((?:neome-studio|\.claude|\.github|enterprises)\/[^`\s<>*]*)`/g)].map((m) => m[1]))) {
    if (p.startsWith("enterprises/")) continue; // per-Enterprise shape, not in the repo
    assert.ok(existsSync(join(repo, p)), `path ${p} named but missing`);
  }
}

test("Consultant README: sections in the agreed order", () => {
  assert.deepEqual(h2(consultant), [
    "Setup checklist",
    "First run",
    "The cycle at a glance",
    "Skills you run",
    "Where things live",
    "Rules of thumb",
    "Troubleshooting",
  ]);
  // "what it is" = the lines before the first section
  assert.match(consultant.slice(0, consultant.indexOf("\n## ")), /Claude Code plugin/);
});

test("Consultant README: names only the six user skills, each with its own entry", () => {
  const named = [...new Set([...consultant.matchAll(/\/neome-studio:([a-z-]+)/g)].map((m) => m[1]))].sort();
  assert.deepEqual(named, [...SIX].sort());
  const entries = [...section(consultant, "Skills you run").matchAll(/^### `\/neome-studio:([a-z-]+)`$/gm)].map((m) => m[1]);
  assert.deepEqual(entries, SIX);
  for (const s of SIX) assert.ok(existsSync(join(plugin, "skills", s, "SKILL.md")), `${s} skill missing`);
  const blocks = skills.filter((s) => !SIX.includes(s.name)).map((s) => s.name);
  for (const b of blocks) assert.ok(!consultant.includes(`\`${b}\``), `building block ${b} named in Consultant README`);
});

test("Consultant README: setup, updates, Troubleshooting cover the agreed cases", () => {
  const setup = section(consultant, "Setup checklist");
  for (const s of ["npm ci", "git config --global user.name", "Trust", "/neome-studio:studio", "/reload-plugins", "pull"]) {
    assert.ok(setup.includes(s), `setup lacks ${s}`);
  }
  const trouble = section(consultant, "Troubleshooting");
  for (const s of ["Mermaid CLI", "mmdc-failed", "Push rejected", "Stale lock", "npm ci"]) assert.ok(trouble.includes(s), `Troubleshooting lacks ${s}`);
  const where = section(consultant, "Where things live");
  for (const s of ["inputs/", "confidential/", "_agent/", "brd/", "preview.html", "v<N>.html", "prototypes/", "questionnaires/"]) {
    assert.ok(where.includes(s), `Where things live lacks ${s}`);
  }
  // npm ci installs the Mermaid CLI pin the README promises
  const pkg = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
  assert.ok(pkg.dependencies["@mermaid-js/mermaid-cli"], "mermaid-cli not pinned");
  assertLinks(consultant, repo);
  assertPaths(consultant);
});

test("plugin README: building blocks = model-invoked skills; origins match front-matter, no versions", () => {
  const model = skills.filter((s) => s.fm["disable-model-invocation"] !== true).map((s) => s.name).sort();
  const user = skills.filter((s) => s.fm["disable-model-invocation"] === true).map((s) => s.name).sort();
  assert.deepEqual(user, [...SIX].sort());
  const blocks = tableRows(section(maintainer, "Skills").split("### Origins")[0]).map((r) => r[0].replaceAll("`", ""));
  assert.deepEqual([...blocks].sort(), model);

  const origins = section(maintainer, "Skills").split("### Origins")[1].split("\n### ")[0];
  const rows = tableRows(origins);
  assert.deepEqual(rows.map((r) => r[0].replaceAll("`", "")).sort(), skills.map((s) => s.name).sort());
  for (const [cell, upstream] of rows) {
    const s = skills.find((k) => `\`${k.name}\`` === cell);
    assert.doesNotMatch(upstream, /\d+\.\d+/, `${s.name}: origins table must not carry a version`);
    const paths = [s.fm.upstream ?? []].flat();
    if (!paths.length) assert.match(upstream, /^new\b/, `${s.name} has no upstream pin, origin must say new`);
    for (const p of paths) assert.ok(upstream.includes(`\`${p.split("/").pop()}\``), `${s.name}: origin lacks ${p}`);
    if (s.fm.upstreamDiverged) assert.match(upstream, /diverged/, `${s.name}: diverged not said`);
  }
});

test("plugin README: engine commands exist, maintainer tools and eyeball checklist present, links resolve", () => {
  const cli = readFileSync(join(engine, "cli.mjs"), "utf8");
  const known = [...cli.matchAll(/^\s+"?([a-z-]+)"?: lazy\(/gm)].map((m) => m[1]);
  const table = section(maintainer, "Engine");
  const named = [...new Set(tableRows(table).flatMap((r) => [...r[0].matchAll(/`([a-z-]+)`/g)].map((m) => m[1])))];
  assert.deepEqual([...named].sort(), [...known].sort(), "engine table must list every cli.mjs command, and only those");

  const tools = section(maintainer, "Maintainer tools");
  for (const s of ["npm test", "upstream-check", "neome-studio/maintainer/upstream-check.md", "Eval runner", "### Eyeball checklist", "### Gate"]) {
    assert.ok(tools.includes(s), `Maintainer tools lacks ${s}`);
  }
  assert.ok(existsSync(join(plugin, "maintainer", "upstream-check.mjs")));
  for (const h of ["### BRD look", "### Questionnaire look", "### Prototype look"]) {
    const name = h.slice(4);
    assert.ok(readFileSync(join(plugin, "evals", "README.md"), "utf8").includes(h), `evals/README.md lacks ${h}`);
    assert.ok(tools.includes(`**${name}**`), `plugin README eyeball list lacks ${name}`);
  }
  assertLinks(maintainer, plugin);
  assertPaths(maintainer);
});
