import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const HOW_TO_TALK = readFileSync(join(here, "..", "..", "reference", "how-to-talk.md"), "utf8");
const LICENCE = "MIT License\n\nCopyright (c) 2026 Matt Pocock\n";

// Builds a throwaway plugin folder. skills: { name: { frontMatter, body } }
function makePlugin({ skills, licence = false }) {
  const root = mkdtempSync(join(tmpdir(), "neome-check-"));
  for (const [dir, { frontMatter, body }] of Object.entries(skills)) {
    mkdirSync(join(root, "skills", dir), { recursive: true });
    writeFileSync(join(root, "skills", dir, "SKILL.md"), `---\n${frontMatter}\n---\n\n${body}\n`);
  }
  if (licence) writeFileSync(join(root, "LICENSE-upstream"), LICENCE);
  return root;
}

function check(root) {
  const r = spawnSync(process.execPath, [cli, "check", root], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
}

const goodBody = `# Skill\n\n${HOW_TO_TALK}\nDo the thing.`;
const good = { frontMatter: "name: ingest\ndescription: Register Inputs as Sources.", body: goodBody };

test("valid plugin passes", () => {
  const r = check(makePlugin({ skills: { ingest: good } }));
  assert.equal(r.code, 0, r.out);
});

test("skill without How to talk block fails", () => {
  const r = check(makePlugin({ skills: { ingest: { ...good, body: "# Skill\n\nDo the thing." } } }));
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: How to talk block missing or changed/);
});

test("skill with edited How to talk block fails", () => {
  const body = goodBody.replace("No fancy words.", "No big words.");
  const r = check(makePlugin({ skills: { ingest: { ...good, body } } }));
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: How to talk block missing or changed/);
});

test("skill without front-matter fails", () => {
  const root = makePlugin({ skills: {} });
  mkdirSync(join(root, "skills", "ingest"), { recursive: true });
  writeFileSync(join(root, "skills", "ingest", "SKILL.md"), goodBody);
  const r = check(root);
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: front-matter missing/);
});

test("skill folder without SKILL.md fails", () => {
  const root = makePlugin({ skills: {} });
  mkdirSync(join(root, "skills", "ingest"), { recursive: true });
  const r = check(root);
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: SKILL\.md missing/);
});

test("front-matter that is not valid YAML fails", () => {
  const r = check(makePlugin({ skills: { ingest: { ...good, frontMatter: "name: ingest\ndescription: [oops" } } }));
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: front-matter is not valid YAML/);
});

test("name must match folder", () => {
  const r = check(makePlugin({ skills: { ingest: { ...good, frontMatter: "name: ingester\ndescription: x" } } }));
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: name "ingester" does not match folder/);
});

test("description is required", () => {
  const r = check(makePlugin({ skills: { ingest: { ...good, frontMatter: "name: ingest" } } }));
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: description missing/);
});

test("every error is reported, not just the first", () => {
  const r = check(makePlugin({
    skills: {
      ingest: { ...good, frontMatter: "name: ingest" },
      studio: { frontMatter: "name: studio\ndescription: Router.", body: "no block" },
    },
  }));
  assert.equal(r.code, 1);
  assert.match(r.out, /ingest: description missing/);
  assert.match(r.out, /studio: How to talk block missing or changed/);
});

const cloned = (extra) => ({
  frontMatter: `name: questionnaire\ndescription: Export Open Items.\n${extra}`,
  body: goodBody,
});

test("cloned skill with upstream pin and licence passes", () => {
  const r = check(makePlugin({
    skills: { questionnaire: cloned("upstream: skills/productivity/to-questionnaire\nupstreamVersion: 1.3.1") },
    licence: true,
  }));
  assert.equal(r.code, 0, r.out);
});

test("upstream may list several paths", () => {
  const r = check(makePlugin({
    skills: { questionnaire: cloned("upstream:\n  - skills/productivity/grilling\n  - skills/engineering/grill-with-docs\nupstreamVersion: 1.3.1") },
    licence: true,
  }));
  assert.equal(r.code, 0, r.out);
});

test("upstream without upstreamVersion fails", () => {
  const r = check(makePlugin({
    skills: { questionnaire: cloned("upstream: skills/productivity/to-questionnaire") },
    licence: true,
  }));
  assert.equal(r.code, 1);
  assert.match(r.out, /questionnaire: upstream set but upstreamVersion missing/);
});

test("upstreamVersion must be a release version", () => {
  const r = check(makePlugin({
    skills: { questionnaire: cloned("upstream: skills/productivity/to-questionnaire\nupstreamVersion: main") },
    licence: true,
  }));
  assert.equal(r.code, 1);
  assert.match(r.out, /questionnaire: upstreamVersion "main" is not a version like 1\.3\.1/);
});

test("upstream licence required when any skill has upstream", () => {
  const r = check(makePlugin({
    skills: { questionnaire: cloned("upstream: skills/productivity/to-questionnaire\nupstreamVersion: 1.3.1") },
  }));
  assert.equal(r.code, 1);
  assert.match(r.out, /LICENSE-upstream missing/);
});

test("no licence needed when no skill has upstream", () => {
  const r = check(makePlugin({ skills: { ingest: good } }));
  assert.equal(r.code, 0, r.out);
});

test("upstreamDiverged needs a reason", () => {
  const r = check(makePlugin({
    skills: { questionnaire: cloned("upstream: skills/productivity/to-questionnaire\nupstreamVersion: 1.3.1\nupstreamDiverged: ''") },
    licence: true,
  }));
  assert.equal(r.code, 1);
  assert.match(r.out, /questionnaire: upstreamDiverged needs a reason/);
});

test("unknown command exits 2", () => {
  const r = spawnSync(process.execPath, [cli, "nope"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Unknown command: nope/);
});
