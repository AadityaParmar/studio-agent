// upstream-check (ticket 43): maintainer-only tool in neome-studio/maintainer/. Runs against a local
// fixture upstream repo built here (tags v1.3.1, v1.3.2, v1.4.0), so no network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(here, "..", "..");
const tool = join(pluginRoot, "maintainer", "upstream-check.mjs");
const driver = join(pluginRoot, "maintainer", "upstream-check.md");
const cli = join(pluginRoot, "engine", "cli.mjs");
const HOW_TO_TALK = readFileSync(join(pluginRoot, "reference", "how-to-talk.md"), "utf8");

const box = () => mkdtempSync(join(tmpdir(), "neome-upstream-test-"));
const gitEnv = (dir) => {
  const global = join(dir, ".gitconfig-test");
  writeFileSync(global, "[user]\n\tname = Upstream Bot\n\temail = bot@example.com\n");
  return { ...process.env, GIT_CONFIG_GLOBAL: global, GIT_CONFIG_NOSYSTEM: "1" };
};
const git = (cwd, env, ...args) => {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env });
  assert.equal(r.status, 0, `git ${args.join(" ")}: ${r.stderr}`);
  return r.stdout;
};
const run = (args, opts = {}) => {
  const r = spawnSync(process.execPath, [tool, ...args], { encoding: "utf8", ...opts });
  return { code: r.status, out: r.stdout, err: r.stderr };
};

// ---------- fixture upstream ----------

const changelog = (sections) =>
  `# mattpocock-skills\n\n${sections.map(([v, body]) => `## ${v}\n\n### Patch Changes\n\n${body}\n`).join("\n")}`;
const ENTRY_131 = "- `ask-matt` points at `/retro` once the fix is in.";
const ENTRY_132 = "- grilling: separate questions with a horizontal rule.\n\n  Second paragraph of the grilling entry.";
const ENTRY_140A = "- `prototype` gains a LOOK.md with the visual rules.";
const ENTRY_140B = "- Remove the **`wizard`** skill.";
const ENTRY_140C = "- Quote the description in `to-spec`.";

const V131 = {
  "package.json": JSON.stringify({ name: "mattpocock-skills", version: "1.3.1" }, null, 2),
  "CHANGELOG.md": changelog([["1.3.1", ENTRY_131]]),
  LICENSE: "MIT License\n\nCopyright (c) 2026 Matt Pocock\n",
  "skills/engineering/prototype/SKILL.md": "# prototype\n\nBuild a throwaway prototype.\n",
  "skills/productivity/grilling/SKILL.md": "# grilling\n\nAsk one question at a time.\n",
  "skills/engineering/domain-modeling/SKILL.md": "# domain-modeling\n\nKeep a glossary.\n",
  "skills/productivity/to-questionnaire/SKILL.md": "# to-questionnaire\n\nTurn questions into a questionnaire.\n",
  "skills/engineering/ask-matt/SKILL.md": "# ask-matt\n\nRoute to a skill.\n",
  "skills/engineering/wizard/SKILL.md": "# wizard\n\nWrite a bash wizard.\n",
};
const V132 = {
  ...V131,
  "package.json": JSON.stringify({ name: "mattpocock-skills", version: "1.3.2" }, null, 2),
  "CHANGELOG.md": changelog([["1.3.2", ENTRY_132], ["1.3.1", ENTRY_131]]),
  "skills/productivity/grilling/SKILL.md": "# grilling\n\nAsk one question at a time.\n\n---\n",
};
const V140 = {
  ...V132,
  "package.json": JSON.stringify({ name: "mattpocock-skills", version: "1.4.0" }, null, 2),
  "CHANGELOG.md": changelog([["1.4.0", `${ENTRY_140A}\n\n${ENTRY_140B}\n\n${ENTRY_140C}`], ["1.3.2", ENTRY_132], ["1.3.1", ENTRY_131]]),
  LICENSE: "MIT License\n\nCopyright (c) 2026-2027 Matt Pocock\n",
  "skills/engineering/prototype/SKILL.md": "# prototype\n\nBuild a throwaway prototype. Read LOOK.md first.\n",
  "skills/engineering/prototype/LOOK.md": "# Look\n\nGrey title bars.\n",
  "skills/engineering/ask-matt/SKILL.md": "# ask-matt\n\nRoute to a skill. Now with retro.\n",
  "skills/engineering/wizard/SKILL.md": null,
};

// Builds a git repo with one commit per version; tags each version unless tags = false.
function makeUpstream(dir, { tags = true } = {}) {
  const env = gitEnv(dir);
  const repo = join(dir, "upstream");
  mkdirSync(repo);
  git(repo, env, "init", "-q", "-b", "main");
  for (const [version, files] of [["1.3.1", V131], ["1.3.2", V132], ["1.4.0", V140]]) {
    for (const [path, body] of Object.entries(files)) {
      const target = join(repo, path);
      if (body === null) rmSync(target, { force: true });
      else {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, body);
      }
    }
    git(repo, env, "add", "-A");
    git(repo, env, "commit", "-q", "-m", `Version ${version}`);
    git(repo, env, "commit", "-q", "--allow-empty", "-m", `work after ${version}`);
    if (tags) git(repo, env, "tag", `v${version}`, "HEAD~1");
  }
  return repo;
}

// ---------- fixture plugin ----------

const skill = (name, extra = "") =>
  `---\nname: ${name}\ndescription: "Test skill ${name}."\n${extra}---\n\n# ${name}\n\n${HOW_TO_TALK}\nBody of ${name}.\n`;

function makePlugin(dir, more = {}) {
  const root = join(dir, "plugin");
  const skills = {
    "build-prototype": skill("build-prototype", "upstream:\n  - skills/engineering/prototype\nupstreamVersion: 1.3.1\n"),
    "grill-module": skill(
      "grill-module",
      "upstream:\n  - skills/productivity/grilling\n  - skills/engineering/domain-modeling\nupstreamVersion: 1.3.1\n",
    ),
    questionnaire: skill("questionnaire", "upstream:\n  - skills/productivity/to-questionnaire\nupstreamVersion: 1.3.1\n"),
    studio: skill(
      "studio",
      'upstream:\n  - skills/engineering/ask-matt\nupstreamVersion: 1.3.1\nupstreamDiverged: "Routes studio skills; no shared text."\n',
    ),
    wiz: skill("wiz", "upstream:\n  - skills/engineering/wizard\nupstreamVersion: 1.3.1\n"),
    "enterprise-glossary": skill("enterprise-glossary", "upstream:\n  - skills/engineering/domain-modeling\nupstreamVersion: 1.4.0\n"),
    ingest: skill("ingest"),
    ...more,
  };
  for (const [name, text] of Object.entries(skills)) {
    mkdirSync(join(root, "skills", name), { recursive: true });
    writeFileSync(join(root, "skills", name, "SKILL.md"), text);
  }
  writeFileSync(join(root, "LICENSE-upstream"), V131.LICENSE);
  return root;
}

const snapshot = (root) =>
  Object.fromEntries(
    readdirSync(join(root, "skills")).map((n) => [n, readFileSync(join(root, "skills", n, "SKILL.md"), "utf8")]),
  );

// ---------- diff ----------

test("diff: one line per tracked skill, files written, plugin untouched", () => {
  const dir = box();
  const repo = makeUpstream(dir);
  const plugin = makePlugin(dir);
  const before = snapshot(plugin);
  const out = join(dir, "out");
  const r = run(["diff", plugin, "--repo", repo, "--out", out]);
  assert.equal(r.code, 0, r.out + r.err);

  const lines = r.out.trim().split("\n");
  assert.match(lines[0], /^upstream \| .*upstream \| 1\.4\.0 \(tag v1\.4\.0\) \| out .*out$/);
  assert.deepEqual(lines.slice(1), [
    "skill | build-prototype | changed | 1.3.1 → 1.4.0 | skills/engineering/prototype: 2 files +4 -1",
    "skill | enterprise-glossary | current | 1.4.0",
    "skill | grill-module | changed | 1.3.1 → 1.4.0 | skills/productivity/grilling: 1 files +2 -0; skills/engineering/domain-modeling: unchanged",
    "skill | questionnaire | unchanged | 1.3.1 → 1.4.0 | pin-only bump",
    "skill | studio | skipped | diverged: Routes studio skills; no shared text.",
    "skill | wiz | gone | 1.3.1 → 1.4.0 | skills/engineering/wizard not in upstream at 1.4.0",
    "licence | changed | 1.3.1 → 1.4.0 | see licence.diff; update LICENSE-upstream",
    "done | 2 changed, 1 unchanged, 1 gone, 1 current, 1 skipped, 0 errors",
  ]);

  // Never auto-merges: no skill text changed.
  assert.deepEqual(snapshot(plugin), before);

  // Diff, snapshots and CHANGELOG for a changed skill.
  const bp = join(out, "build-prototype");
  const patch = readFileSync(join(bp, "upstream.diff"), "utf8");
  assert.match(patch, /^\+Build a throwaway prototype\. Read LOOK\.md first\.$/m);
  assert.match(patch, /LOOK\.md/);
  assert.equal(readFileSync(join(bp, "old/skills/engineering/prototype/SKILL.md"), "utf8"), V131["skills/engineering/prototype/SKILL.md"]);
  assert.equal(readFileSync(join(bp, "new/skills/engineering/prototype/LOOK.md"), "utf8"), V140["skills/engineering/prototype/LOOK.md"]);
  assert.ok(!existsSync(join(bp, "old/skills/engineering/prototype/LOOK.md")));
  const bpLog = readFileSync(join(bp, "changelog.md"), "utf8");
  assert.match(bpLog, /^# Upstream CHANGELOG 1\.3\.1 → 1\.4\.0, entries naming `prototype`$/m);
  assert.ok(bpLog.includes(ENTRY_140A));
  assert.ok(!bpLog.includes("wizard") && !bpLog.includes("grilling"));

  // Multi-path skill: diff covers only what changed; changelog picks the "grilling:" entry, continuation kept.
  const gm = join(out, "grill-module");
  assert.match(readFileSync(join(gm, "upstream.diff"), "utf8"), /grilling\/SKILL\.md/);
  assert.doesNotMatch(readFileSync(join(gm, "upstream.diff"), "utf8"), /domain-modeling/);
  assert.ok(readFileSync(join(gm, "changelog.md"), "utf8").includes(ENTRY_132));
  assert.ok(existsSync(join(gm, "new/skills/engineering/domain-modeling/SKILL.md")));

  // Unchanged skill: empty diff. Gone skill: no new snapshot, changelog names its removal.
  assert.equal(readFileSync(join(out, "questionnaire", "upstream.diff"), "utf8"), "");
  assert.ok(!existsSync(join(out, "wiz", "new")));
  assert.ok(readFileSync(join(out, "wiz", "changelog.md"), "utf8").includes(ENTRY_140B));

  // Diverged and current skills get no folder.
  assert.ok(!existsSync(join(out, "studio")) && !existsSync(join(out, "enterprise-glossary")));

  // Whole-range CHANGELOG: newer than the oldest pin, up to the target, newest first.
  const all = readFileSync(join(out, "changelog.md"), "utf8");
  assert.ok(all.indexOf("## 1.4.0") < all.indexOf("## 1.3.2"));
  assert.ok(all.includes(ENTRY_140C) && !all.includes("## 1.3.1"));
  assert.match(readFileSync(join(out, "licence.diff"), "utf8"), /^\+Copyright \(c\) 2026-2027 Matt Pocock$/m);
});

test("diff --to: older target narrows the range", () => {
  const dir = box();
  const repo = makeUpstream(dir);
  const plugin = makePlugin(dir);
  const out = join(dir, "out");
  const r = run(["diff", plugin, "--repo", repo, "--to", "1.3.2", "--out", out]);
  assert.equal(r.code, 1, r.out); // enterprise-glossary pinned 1.4.0 is newer than 1.3.2
  assert.match(r.out, /^skill \| build-prototype \| unchanged \| 1\.3\.1 → 1\.3\.2 \| pin-only bump$/m);
  assert.match(r.out, /^skill \| grill-module \| changed \| 1\.3\.1 → 1\.3\.2 \| /m);
  assert.match(r.out, /^skill \| wiz \| unchanged /m);
  assert.match(r.out, /^error \| enterprise-glossary \| pinned 1\.4\.0 is newer than 1\.3\.2$/m);
  assert.match(r.out, /^licence \| unchanged \| 1\.3\.1 → 1\.3\.2$/m);
  assert.ok(!readFileSync(join(out, "changelog.md"), "utf8").includes("1.4.0"));
});

test("diff: no tags → versions found from package.json commits; --to needed", () => {
  const dir = box();
  const repo = makeUpstream(dir, { tags: false });
  const plugin = makePlugin(dir);
  const none = run(["diff", plugin, "--repo", repo, "--out", join(dir, "a")]);
  assert.equal(none.code, 1);
  assert.match(none.err, /has no version tags; pass --to <version>/);

  const r = run(["diff", plugin, "--repo", repo, "--to", "1.4.0", "--out", join(dir, "b")]);
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^upstream \| .* \| 1\.4\.0 \(commit [0-9a-f]{7}, package\.json 1\.4\.0\) \| /m);
  assert.match(r.out, /^skill \| build-prototype \| changed \| 1\.3\.1 → 1\.4\.0 \| skills\/engineering\/prototype: 2 files \+4 -1$/m);
  assert.match(r.out, /^skill \| questionnaire \| unchanged /m);
});

test("diff: errors are clear and set exit 1; other skills still reported", () => {
  const dir = box();
  const repo = makeUpstream(dir);
  const plugin = makePlugin(dir, {
    typo: skill("typo", "upstream: skills/engineering/nope\nupstreamVersion: 1.3.1\n"),
    ancient: skill("ancient", "upstream: skills/engineering/prototype\nupstreamVersion: 0.9.0\n"),
  });
  const r = run(["diff", plugin, "--repo", repo, "--out", join(dir, "out")]);
  assert.equal(r.code, 1);
  assert.match(r.out, /^error \| typo \| skills\/engineering\/nope not in upstream at 1\.3\.1; fix the upstream key$/m);
  assert.match(r.out, /^error \| ancient \| pinned version 0\.9\.0 not found upstream$/m);
  assert.match(r.out, /^skill \| questionnaire \| unchanged /m);
  assert.match(r.out, /2 errors$/m);

  const missing = run(["diff", plugin, "--repo", repo, "--to", "9.9.9", "--out", join(dir, "o2")]);
  assert.equal(missing.code, 1);
  assert.match(missing.err, /version 9\.9\.9 not found in /);

  const noRepo = run(["diff", plugin, "--repo", join(dir, "nowhere.git"), "--out", join(dir, "o3")]);
  assert.equal(noRepo.code, 1);
  assert.match(noRepo.err, /cannot fetch /);
});

test("diff: bad arguments exit 2", () => {
  const dir = box();
  const plugin = makePlugin(dir);
  assert.equal(run([]).code, 2);
  assert.equal(run(["diff"]).code, 2);
  assert.equal(run(["diff", plugin, "--to", "latest"]).code, 2);
  assert.equal(run(["diff", plugin, "--bogus", "x"]).code, 2);
  assert.equal(run(["diff", join(dir, "nothing")]).code, 2);
  mkdirSync(join(dir, "full"));
  writeFileSync(join(dir, "full", "x"), "");
  const full = run(["diff", plugin, "--out", join(dir, "full")]);
  assert.equal(full.code, 2);
  assert.match(full.err, /is not empty/);
});

// ---------- pin ----------

test("pin: bumps only the upstreamVersion line; check still passes", () => {
  const dir = box();
  const plugin = makePlugin(dir);
  const before = snapshot(plugin);
  const r = run(["pin", plugin, "grill-module", "1.4.0"]);
  assert.equal(r.code, 0, r.err);
  assert.equal(r.out, "pinned | grill-module | 1.3.1 → 1.4.0\n");
  const after = snapshot(plugin);
  assert.equal(after["grill-module"], before["grill-module"].replace("upstreamVersion: 1.3.1", "upstreamVersion: 1.4.0"));
  for (const n of Object.keys(before)) if (n !== "grill-module") assert.equal(after[n], before[n]);
  const c = spawnSync(process.execPath, [cli, "check", plugin], { encoding: "utf8" });
  assert.equal(c.status, 0, c.stderr);
});

test("pin: refuses diverged, unpinned, unknown and not-newer", () => {
  const dir = box();
  const plugin = makePlugin(dir);
  const before = snapshot(plugin);
  const cases = [
    [["studio", "1.4.0"], /studio: upstreamDiverged is set; pin stays for history/],
    [["ingest", "1.4.0"], /ingest: no upstream key; nothing to pin/],
    [["nope", "1.4.0"], /nope: no skill folder/],
    [["enterprise-glossary", "1.4.0"], /pinned 1\.4\.0; 1\.4\.0 is not newer/],
    [["questionnaire", "1.3.0"], /pinned 1\.3\.1; 1\.3\.0 is not newer/],
  ];
  for (const [[name, v], msg] of cases) {
    const r = run(["pin", plugin, name, v]);
    assert.equal(r.code, 1, `${name}: ${r.out}`);
    assert.match(r.err, msg);
  }
  assert.equal(run(["pin", plugin, "questionnaire", "v1.4"]).code, 2);
  assert.equal(run(["pin", plugin, "questionnaire"]).code, 2);
  assert.deepEqual(snapshot(plugin), before);
});

// ---------- maintainer-only ----------

test("maintainer-only: not a skill, not an engine command, not named by studio or any skill", () => {
  const skills = readdirSync(join(pluginRoot, "skills"));
  assert.ok(!skills.includes("upstream-check"));
  for (const n of skills) {
    const text = readFileSync(join(pluginRoot, "skills", n, "SKILL.md"), "utf8");
    assert.doesNotMatch(text, /upstream-check|maintainer\//, `${n} names the maintainer tool`);
  }
  assert.ok(!readdirSync(join(pluginRoot, "maintainer")).includes("SKILL.md"));
  const r = spawnSync(process.execPath, [cli, "upstream-check"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Unknown command: upstream-check/);
});

test("driver prompt: How to talk verbatim, both commands, accept per skill, gate", () => {
  const text = readFileSync(driver, "utf8");
  assert.ok(text.includes(HOW_TO_TALK.trim()));
  assert.match(text, /`TOOL` = `node neome-studio\/maintainer\/upstream-check\.mjs`/);
  assert.match(text, /`TOOL diff neome-studio \[--to <to>\]`/);
  assert.match(text, /`TOOL pin neome-studio <skill> <to>`/);
  for (const status of ["changed", "unchanged", "gone", "current", "skipped", "error", "licence"]) {
    assert.match(text, new RegExp(`\`${status}\``), `driver handles ${status}`);
  }
  assert.match(text, /GLOSSARY\.md/);
  assert.match(text, /npm test/);
  assert.match(text, /skills-main/);
});
