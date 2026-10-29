// build-brd skill (ticket 37): the engine pieces the skill leans on (mmdc-check, --check as a dry run
// of release and sign-off), the problems reference covering every engine error class, the SKILL text,
// and one release run end to end over a real git remote, following the skill's steps.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const engine = join(here, "..");
const cli = join(engine, "cli.mjs");
const plugin = join(engine, "..");
const skillDir = join(plugin, "skills", "build-brd");
const fixtures = join(here, "fixtures", "brd");

const run = (args, env = {}, cwd) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8", env: { ...process.env, ...env }, cwd });
  return { code: r.status, out: r.stdout + r.stderr, stdout: r.stdout, stderr: r.stderr };
};
const brd = (eng, ...args) => run(["build-brd", eng, ...args]);

function enterprise(name) {
  const root = join(mkdtempSync(join(tmpdir(), "neome-brd-skill-")), "harbor-tiles");
  cpSync(join(fixtures, name), root, { recursive: true });
  return { root, eng: join(root, "engagements", "crm"), agent: join(root, "engagements", "crm", "_agent") };
}

// Every file under dir → content, to prove a dry run writes nothing.
function files(dir) {
  const out = {};
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out[p.slice(dir.length)] = readFileSync(p, "utf8");
    }
  };
  walk(dir);
  return out;
}

const addEvidence = (e, id = "SO-1") =>
  appendFileSync(join(e.root, "_agent", "sources.md"), `| ${id} | sign-off | Signed BRD v1 | 2026-10-28 | inputs/${id}-signed.pdf | crm | |\n`);
const SIGNERS = ["--signers", "Asha Rao | Sales head | 2026-10-28", "Ravi Menon | Consultant | 2026-10-28"];

// ---- mmdc-check ----

test("mmdc-check: pinned mmdc found → exit 0; missing or wrong version → class + `npm ci`", () => {
  const ok = run(["mmdc-check"]);
  assert.equal(ok.code, 0, ok.out);
  assert.match(ok.stdout, /mmdc-check: Mermaid CLI 12\.0\.0 \(pinned\) at /);

  const missing = run(["mmdc-check"], { NEOME_MMDC: join(tmpdir(), "no-such-dir", "mmdc") });
  assert.equal(missing.code, 1);
  assert.match(missing.stderr, /error \[mmdc-missing\] .*Run `npm ci` in the repo root/);

  const wrong = mkdtempSync(join(tmpdir(), "neome-mmdc-"));
  cpSync(join(here, "fixtures", "mmdc", "wrong-version"), wrong, { recursive: true });
  const old = run(["mmdc-check"], { NEOME_MMDC: join(wrong, "mmdc") });
  assert.equal(old.code, 1);
  assert.match(old.stderr, /error \[mmdc-version\] Mermaid CLI is 11\.4\.0, BRD needs 12\.0\.0.*npm ci/);

  assert.equal(run(["mmdc-check", "a", "b"]).code, 2);
});

// ---- release --check ----

test("release --check: dry run lists the change-log lines v<N> would get; writes nothing; no mmdc needed", () => {
  const e = enterprise("resolved");
  const noMmdc = { NEOME_MMDC: join(tmpdir(), "no-such-dir", "mmdc") };
  const before = files(e.root);
  const first = run(["build-brd", e.eng, "--mode", "release", "--check"], noMmdc);
  assert.equal(first.code, 0, first.out);
  assert.match(first.stdout, /check passed: v1 would have 0 change\(s\) since start \(3 warning\(s\)\); nothing written/);
  assert.match(first.stderr, /warning \[plan\] plan phase go-live: no weeks set/);
  assert.deepEqual(files(e.root), before);

  assert.equal(brd(e.eng, "--mode", "release", "--summary", "First draft.").code, 0);
  const ticket = join(e.agent, "modules", "LEAD-leads", "ticket.md");
  writeFileSync(ticket, readFileSync(ticket, "utf8").replace("status: resolved", "status: needs-revisit"));
  const released = files(e.root);
  const second = run(["build-brd", e.eng, "--mode", "release", "--check", "--summary", "Lead revisit."], noMmdc);
  assert.equal(second.code, 0, second.out);
  assert.match(second.stdout, /^change: LEAD: set to needs-revisit$/m);
  assert.match(second.stdout, /^note \[sign-off\] Module LEAD is needs-revisit; every Module must be resolved or merged$/m);
  assert.match(second.stdout, /check passed: v2 would have 1 change\(s\) since v1/);
  assert.deepEqual(files(e.root), released);
});

test("release --check: release errors still fail it; empty --summary refused", () => {
  const e = enterprise("resolved");
  const general = join(e.agent, "general.md");
  const text = readFileSync(general, "utf8");
  const acc = text.match(/Acceptance:\n(- .*\n)+/)[0];
  writeFileSync(general, text.replace(acc, "Acceptance:\n"));
  const preview = brd(e.eng, "--check");
  assert.equal(preview.code, 0, preview.out);
  const r = brd(e.eng, "--mode", "release", "--check");
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[completeness\] Across all Modules: GEN-\d+ has no acceptance criteria/);
  assert.match(r.stderr, /check failed/);
  assert.equal(existsSync(join(e.agent, "brd")), false);

  const blank = brd(e.eng, "--mode", "release", "--check", "--summary", "  ");
  assert.equal(blank.code, 2);
  assert.match(blank.stderr, /--summary is empty/);
});

// ---- sign-off --check ----

test("sign-off --check: no version → release first; passes with counts; evidence checked when given; writes nothing", () => {
  const e = enterprise("resolved");
  const none = brd(e.eng, "--mode", "sign-off", "--check");
  assert.equal(none.code, 1);
  assert.match(none.stderr, /no released BRD version to sign off; release one first/);

  assert.equal(brd(e.eng, "--mode", "release", "--summary", "First draft.").code, 0);
  const before = files(e.root);
  const ok = brd(e.eng, "--mode", "sign-off", "--check");
  assert.equal(ok.code, 0, ok.out);
  assert.match(ok.stdout, /check passed: v1 can be signed off \(2 Open Item\(s\) open, \d+ proposed item\(s\) would be accepted; evidence Source not checked\); nothing written/);

  const absent = brd(e.eng, "--mode", "sign-off", "--check", "--evidence", "SO-9");
  assert.equal(absent.code, 1);
  assert.match(absent.stderr, /error \[missing-source\] evidence Source SO-9 is not in the Source register/);
  assert.match(absent.stderr, /v1 cannot be signed off/);
  assert.deepEqual(files(e.root), before);

  addEvidence(e);
  const withEvidence = brd(e.eng, "--mode", "sign-off", "--check", "--evidence", "SO-1", ...SIGNERS);
  assert.equal(withEvidence.code, 0, withEvidence.out);
  assert.doesNotMatch(withEvidence.stdout, /not checked/);
  assert.equal(readFileSync(join(e.agent, "brd", "versions", "v1.json"), "utf8"), before["/engagements/crm/_agent/brd/versions/v1.json"]);

  const bad = brd(e.eng, "--mode", "sign-off", "--check", "--signers", "Asha", "Ravi | Consultant | 2026-10-28");
  assert.equal(bad.code, 2);
  assert.match(bad.stderr, /Enterprise signer must be/);

  assert.equal(brd(e.eng, "--mode", "sign-off", ...SIGNERS, "--evidence", "SO-1").code, 0);
  const again = brd(e.eng, "--mode", "sign-off", "--check");
  assert.equal(again.code, 1);
  assert.match(again.stderr, /v1 is already signed off/);
});

test("sign-off --check: blockers are errors, nothing written", () => {
  const e = enterprise("in-progress");
  assert.equal(brd(e.eng, "--mode", "release", "--summary", "Early look.").code, 0);
  const before = files(e.root);
  const r = brd(e.eng, "--mode", "sign-off", "--check");
  assert.equal(r.code, 1);
  assert.match(r.stderr, /error \[sign-off\] Module QUO is claimed; every Module must be resolved or merged/);
  assert.match(r.stderr, /v1 cannot be signed off/);
  assert.deepEqual(files(e.root), before);
});

// ---- problems reference ----

test("problems.md: every class the build can print has a plain line; mmdc ones say `npm ci`", () => {
  const sources = [join(engine, "build-brd.mjs"), ...readdirSync(join(engine, "brd")).filter((f) => f.endsWith(".mjs")).map((f) => join(engine, "brd", f))];
  const classes = new Set();
  for (const f of sources) {
    for (const m of readFileSync(f, "utf8").matchAll(/(?:cls: "|err\(")([a-z-]+)"/g)) classes.add(m[1]);
  }
  assert.ok(classes.size >= 25, `only ${classes.size} classes found`);
  const problems = readFileSync(join(skillDir, "references", "problems.md"), "utf8");
  const missing = [...classes].filter((c) => !problems.includes(`\`${c}\``));
  assert.deepEqual(missing, []);
  for (const c of ["mmdc-missing", "mmdc-version"]) {
    assert.match(problems.split("\n").find((l) => l.startsWith(`| \`${c}\``)), /npm ci/);
  }
});

// ---- SKILL text ----

test("SKILL.md: built (not the stub), every mode, lock + git, engine only, links resolve", () => {
  const skill = readFileSync(join(skillDir, "SKILL.md"), "utf8");
  assert.doesNotMatch(skill, /Stub\. Built in ticket 37/);
  for (const must of [
    "ENGINE mmdc-check",
    "--mode <mode> --check",
    '--mode release --summary "<summary line>"',
    "--mode sign-off --signers",
    "--evidence <ID>",
    "--skill build-brd",
    "ENGINE glossary agree enterprises/<ent> --signed",
    "npm ci",
    "/neome-studio:ingest",
  ]) {
    assert.ok(skill.includes(must), `SKILL.md lacks ${must}`);
  }
  assert.match(skill, /only writer of the BRD data file, snapshots and pages/);
  for (const [, link] of skill.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
    assert.ok(existsSync(resolve(skillDir, link)), `broken link ${link}`);
  }
});

// ---- the skill's release run over git (git-protocol: pull, lock pushed first, build, unlock, one commit) ----

const gitOk = spawnSync("git", ["--version"]).status === 0;

test("release run over git: lock commit pushed first, then work + cleared lock in one commit", { skip: !gitOk && "git missing" }, () => {
  const root = mkdtempSync(join(tmpdir(), "neome-brd-git-"));
  const git = (cwd, ...a) => {
    const r = spawnSync("git", a, { cwd, encoding: "utf8" });
    return { code: r.status, out: (r.stdout + r.stderr).trim() };
  };
  const remote = join(root, "remote.git");
  git(root, "init", "--bare", "-b", "main", remote);
  const repo = join(root, "repo");
  git(root, "clone", remote, repo);
  for (const [k, v] of [["user.name", "Asha"], ["user.email", "asha@x"]]) git(repo, "config", k, v);
  cpSync(join(fixtures, "resolved"), join(repo, "enterprises", "harbor-tiles"), { recursive: true });
  git(repo, "add", "-A");
  git(repo, "commit", "-m", "seed");
  assert.equal(git(repo, "push", "origin", "HEAD:main").code, 0);
  git(repo, "branch", "--set-upstream-to=origin/main");

  const eng = "enterprises/harbor-tiles/engagements/crm";
  const at = (args) => run(args, {}, repo);
  // 1–2. Pull, check (no lock yet).
  assert.equal(git(repo, "pull", "--rebase", "--autostash").code, 0);
  assert.equal(at(["mmdc-check"]).code, 0);
  assert.equal(at(["build-brd", eng, "--mode", "release", "--check"]).code, 0);
  // 4. Lock, commit map.md only, push.
  assert.equal(at(["lock", eng, "--who", "Asha", "--skill", "build-brd"]).code, 0);
  git(repo, "add", `${eng}/_agent/map.md`);
  git(repo, "commit", "-m", "build-brd: harbor-tiles/crm lock");
  assert.equal(git(repo, "push").code, 0);
  // 5. Build + map change-log line.
  const built = at(["build-brd", eng, "--mode", "release", "--summary", "First draft for the sales head."]);
  assert.equal(built.code, 0, built.out);
  const map = join(repo, eng, "_agent", "map.md");
  writeFileSync(map, readFileSync(map, "utf8").trimEnd() + "\n- 2026-10-29: BRD v1 released: First draft for the sales head.\n");
  // 7. Unlock, End.
  assert.equal(at(["unlock", eng, "--who", "Asha"]).code, 0);
  git(repo, "add", `${eng}/_agent/brd/versions/v1.json`, `${eng}/brd/v1.html`, `${eng}/_agent/map.md`);
  git(repo, "commit", "-m", "build-brd: harbor-tiles/crm release v1");
  assert.equal(git(repo, "push").code, 0);

  assert.equal(git(repo, "status", "--porcelain").out, "");
  assert.deepEqual(git(remote, "log", "--format=%s", "main").out.split("\n"), [
    "build-brd: harbor-tiles/crm release v1",
    "build-brd: harbor-tiles/crm lock",
    "seed",
  ]);
  const lockedMap = git(remote, "show", `main~1:${eng}/_agent/map.md`).out;
  assert.match(lockedMap, /^lock: Asha · build-brd · \d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/m);
  const endMap = git(remote, "show", `main:${eng}/_agent/map.md`).out;
  assert.doesNotMatch(endMap, /^lock:/m);
  assert.match(endMap, /BRD v1 released: First draft for the sales head\.$/);
  assert.deepEqual(git(remote, "show", "--name-only", "--format=", "main").out.split("\n").sort(), [
    `${eng}/_agent/brd/versions/v1.json`,
    `${eng}/_agent/map.md`,
    `${eng}/brd/v1.html`,
  ]);
});
