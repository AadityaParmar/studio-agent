// studio router (ticket 38): setup-check (each miss explained, runs before `npm ci`), status (frontier, claims,
// lock, Open Items, Inputs waiting, BRD readiness, next steps naming only the six user skills; writes nothing),
// the SKILL text, and the one write (stale lock / claim cleared after asking) over a real git remote.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync, cpSync, readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync, mkdirSync, symlinkSync, rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const engine = join(here, "..");
const cli = join(engine, "cli.mjs");
const plugin = join(engine, "..");
const repo = join(plugin, "..");
const fixtures = join(here, "fixtures");
const SIX = ["studio", "ingest", "review-draft", "resolve-module", "questionnaire", "build-brd"];

const tmp = (p) => mkdtempSync(join(tmpdir(), `neome-studio-${p}-`));
// Global git config under our control: no user's name leaks in, no system config.
const gitEnv = (home) => {
  const global = join(home, ".gitconfig-test");
  if (!existsSync(global)) writeFileSync(global, "");
  return { GIT_CONFIG_GLOBAL: global, GIT_CONFIG_NOSYSTEM: "1" };
};
const run = (args, { env = {}, cwd, bin = cli } = {}) => {
  const r = spawnSync(process.execPath, [bin, ...args], { encoding: "utf8", env: { ...process.env, ...env }, cwd });
  return { code: r.status, out: r.stdout + r.stderr, stdout: r.stdout, stderr: r.stderr };
};
const git = (cwd, env, ...args) => {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env: { ...process.env, ...env } });
  return { code: r.status, out: (r.stdout + r.stderr).trim() };
};
const lines = (out) => out.trim().split("\n");
const stepSkills = (out) => lines(out).filter((l) => l.startsWith("step | ")).map((l) => l.split(" | ")[1]);

// Every file under dir → content, to prove status writes nothing.
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

function enterprise(rel, name = "harbor-tiles") {
  const root = tmp("ent");
  const ent = join(root, "enterprises", name);
  cpSync(join(fixtures, rel), ent, { recursive: true });
  return { root, ent, eng: join(ent, "engagements", "crm") };
}

// A repo root as a Consultant's clone has it: settings, marketplace, plugin manifest, package.json, node_modules.
function repoRoot(dir) {
  for (const f of [".claude/settings.json", ".claude-plugin/marketplace.json", "neome-studio/.claude-plugin/plugin.json", "package.json"]) {
    mkdirSync(dirname(join(dir, f)), { recursive: true });
    cpSync(join(repo, f), join(dir, f));
  }
  symlinkSync(join(repo, "node_modules"), join(dir, "node_modules"), "dir");
  return dir;
}

// ---- setup-check ----

test("setup-check: a good clone passes every check (remote reachable, user, node_modules, mmdc, plugin)", () => {
  const box = tmp("setup");
  const env = gitEnv(box);
  const remote = join(box, "remote.git");
  git(box, env, "init", "--bare", "-b", "main", remote);
  const root = join(box, "clone");
  git(box, env, "clone", remote, root);
  git(root, env, "config", "user.name", "Asha");
  repoRoot(root);
  const r = run(["setup-check", root], { env });
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^ok \| git \| remote origin \(.*remote\.git\) reachable$/m);
  assert.match(r.stdout, /^ok \| git user \| Asha /m);
  assert.match(r.stdout, /^ok \| node_modules \| 3 pinned package\(s\) installed$/m);
  assert.match(r.stdout, /^ok \| mmdc \| Mermaid CLI pinned version at /m);
  assert.match(r.stdout, /^ok \| plugin \| neome-studio@neome enabled in \.claude\/settings\.json$/m);
  assert.match(r.stdout, /setup-check: 5 ok, 0 missing/);

  // Remote moved or offline → explained, exit 1.
  git(root, env, "remote", "set-url", "origin", join(box, "gone.git"));
  const off = run(["setup-check", root], { env });
  assert.equal(off.code, 1);
  assert.match(off.stdout, /^miss \| git \| Remote origin \(.*gone\.git\) not reachable: .*Check network or VPN and your GitHub access/m);
  git(root, env, "remote", "remove", "origin");
  assert.match(run(["setup-check", root], { env }).stdout, /^miss \| git \| No git remote, so skills cannot push\. Clone the team repo/m);

  // Plugin switched off locally.
  writeFileSync(join(root, ".claude", "settings.local.json"), JSON.stringify({ enabledPlugins: { "neome-studio@neome": false } }));
  assert.match(run(["setup-check", root], { env }).stdout, /^miss \| plugin \| neome-studio@neome is switched off in \.claude\/settings\.local\.json/m);
});

test("setup-check: each miss says what is wrong and the fix", () => {
  const root = tmp("bare-folder");
  const env = gitEnv(root);
  cpSync(join(repo, "package.json"), join(root, "package.json"));
  const wrong = tmp("mmdc");
  cpSync(join(fixtures, "mmdc", "wrong-version"), wrong, { recursive: true });
  const r = run(["setup-check", root], { env: { ...env, NEOME_MMDC: join(wrong, "mmdc") } });
  assert.equal(r.code, 1);
  assert.match(r.stdout, /^miss \| git \| This folder is not a git clone\. Clone the team repo/m);
  assert.match(r.stdout, /^miss \| git user \| git user\.name is not set; claims and locks need it\. Run `git config --global user\.name/m);
  assert.match(r.stdout, /^miss \| node_modules \| node_modules missing\. Run `npm ci` in the repo root\.$/m);
  assert.match(r.stdout, /^miss \| mmdc \| Mermaid CLI is 11\.4\.0, BRD needs 12\.0\.0.*npm ci/m);
  assert.match(r.stdout, /^miss \| plugin \| \.claude\/settings\.json missing or not valid JSON\. Restore/m);
  assert.match(r.stdout, /setup-check: 0 ok, 5 missing/);

  // node_modules present but not the pinned versions.
  mkdirSync(join(root, "node_modules", "yaml"), { recursive: true });
  writeFileSync(join(root, "node_modules", "yaml", "package.json"), JSON.stringify({ version: "2.0.0" }));
  assert.match(
    run(["setup-check", root], { env }).stdout,
    /^miss \| node_modules \| node_modules out of date: .*yaml 2\.0\.0 \(need 2\.9\.1\).*Run `npm ci`/m,
  );
  assert.equal(run(["setup-check", root, "extra"]).code, 2);
  assert.equal(run(["setup-check", join(root, "nope")]).code, 2);
});

test("setup-check runs before `npm ci`: the engine loads no package for it", () => {
  const box = tmp("no-modules");
  const copy = join(box, "neome-studio", "engine");
  cpSync(engine, copy, { recursive: true, filter: (p) => !p.includes(`${join(engine, "test")}`) });
  const root = join(box, "root");
  mkdirSync(root);
  cpSync(join(repo, "package.json"), join(root, "package.json"));
  const r = run(["setup-check", root], { bin: join(copy, "cli.mjs"), env: { ...gitEnv(box), NEOME_MMDC: "" } });
  assert.equal(r.code, 1, r.out);
  assert.doesNotMatch(r.out, /ERR_MODULE_NOT_FOUND|Cannot find package/);
  assert.match(r.stdout, /^miss \| node_modules \| node_modules missing\. Run `npm ci`/m);
  assert.match(r.stdout, /^miss \| mmdc \| Mermaid CLI \(mmdc\) not found\. Run `npm ci`/m);
});

// ---- status: one Engagement ----

test("status: frontier, Open Items to chase, BRD readiness and next steps; writes nothing", () => {
  const e = enterprise("reply/after-reply/harbor-tiles");
  const before = files(e.root);
  const r = run(["status", e.eng, "--who", "Asha"]);
  assert.equal(r.code, 0, r.out);
  const l = lines(r.stdout);
  assert.equal(l[0], "engagement | harbor-tiles/crm | Sales CRM");
  assert.equal(l[1], "lock | none");
  assert.ok(l.includes("next | ENQ | Enquiries | open"));
  assert.ok(l.includes("blocked | QUO | Quotations | is blocked by ENQ (not resolved yet)"));
  assert.ok(l.includes("oi | open | 3 (Enterprise 2, Neomenta 1)"));
  assert.ok(l.includes("oi | chased | OI-03: no answer [QA-1]"));
  assert.ok(l.includes("oi | chased | OI-08: Don't know; ask Joel (accounts) [QA-1]"));
  assert.ok(l.includes("brd | no released version"));
  assert.ok(l.includes("release | ready | v1 would log 0 change(s) since start | 10 warning(s)"));
  assert.ok(l.includes("signoff | next | blocked | Module QUO is needs-revisit; every Module must be resolved or merged"));
  assert.deepEqual(l.filter((x) => x.startsWith("step |")), [
    "step | resolve-module | enterprises/harbor-tiles/engagements/crm ENQ | next: ENQ (one per session)",
    "step | questionnaire | enterprises/harbor-tiles/engagements/crm | Enterprise Open Items: 2 to chase",
    "step | build-brd | enterprises/harbor-tiles/engagements/crm | preview any time to share progress",
  ]);
  assert.deepEqual(files(e.root), before);
});

test("status: lock (who, skill, since, age), claims with since, holds, Inputs waiting, Prototype gap", () => {
  const e = enterprise("build-prototype/after-prototype/harbor-tiles"); // QUO claimed by Asha
  assert.equal(run(["lock", e.eng, "--who", "Ben", "--skill", "build-brd"]).code, 0);
  const since = readFileSync(join(e.eng, "_agent", "map.md"), "utf8").match(/^lock: Ben · build-brd · (\S+)$/m)[1];
  const now = new Date(Date.parse(since) + (2 * 60 + 5) * 60000).toISOString();
  const map = join(e.eng, "_agent", "map.md");
  writeFileSync(map, readFileSync(map, "utf8").replace("## Notes\n", "## Notes\n\n- QA-1 answers OI-10 (QUO, claimed by Asha): Kochi showroom manager. Apply in the open resolve-module session.\n"));
  writeFileSync(join(e.ent, "inputs", "call with joel.txt"), "notes");
  mkdirSync(join(e.ent, "confidential"), { recursive: true });
  writeFileSync(join(e.ent, "confidential", "salaries.csv"), "x");

  const mine = run(["status", e.eng, "--who", "Asha", "--now", now]);
  assert.equal(mine.code, 0, mine.out);
  const l = lines(mine.stdout);
  assert.ok(l.includes(`lock | Ben | build-brd | ${since} | 2h 5m`), mine.out);
  assert.ok(l.some((x) => /^claimed \| QUO \| Quotations \| by Asha \| since 2026-10-29 \| \d+(d \d+h|h \d+m|m) \| yours$/.test(x)), mine.out);
  assert.ok(l.includes("hold | QUO | Asha | QA-1 answers OI-10 (QUO, claimed by Asha): Kochi showroom manager. Apply in the open resolve-module session."));
  assert.ok(l.includes("input | confidential/salaries.csv | not in the Source register"));
  assert.ok(l.includes("input | inputs/call with joel.txt | not in the Source register"));
  assert.equal(stepSkills(mine.stdout)[0], "ingest");
  assert.match(mine.stdout, /^step \| ingest \| enterprises\/harbor-tiles\/engagements\/crm \| 2 new Input\(s\) not registered yet$/m);

  // Own claim → resume it, Module prefix in the args (a stopped resolve-module session keeps its claim).
  assert.match(mine.stdout, /^step \| resolve-module \| enterprises\/harbor-tiles\/engagements\/crm QUO \| resume QUO: claimed by you$/m);

  const ben = run(["status", e.eng, "--who", "Ben", "--now", now]);
  assert.match(ben.stdout, new RegExp(`^lock \\| Ben \\| build-brd \\| ${since} \\| 2h 5m \\| yours$`, "m"));
  assert.doesNotMatch(ben.stdout, /^claimed .*\| yours$/m);
  assert.doesNotMatch(ben.stdout, /resume QUO/);

  // Resolved Module without its Prototype view → gap.
  const done = enterprise("resolve-module/after-resolve/harbor-tiles");
  assert.match(run(["status", done.eng]).stdout, /^gap \| QUO \| resolved without its Prototype: prototypes\/QUO-quotations\.html missing$/m);
  assert.match(run(["status", done.eng]).stdout, /^oi \| not asked \| OI-02, OI-03, OI-05/m);
  assert.match(run(["status", done.eng]).stdout, /^step \| questionnaire \| enterprises\/harbor-tiles\/engagements\/crm \| Enterprise Open Items: 10 not asked yet$/m);
});

test("status: draft Modules → review-draft; no Modules → ingest", () => {
  const d = enterprise("ingest/first-run/harbor-tiles");
  const r = run(["status", d.eng]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.stdout, /^draft \| [A-Z]+ \| .* \| run review-draft$/m);
  assert.match(r.stdout, /^step \| review-draft \| enterprises\/harbor-tiles\/engagements\/crm \| draft Module\(s\) to confirm: .* \(fresh session\)$/m);

  const root = tmp("init");
  const ent = join(root, "acme");
  assert.equal(run(["init-engagement", ent, "crm", "--name", "Acme", "--title", "CRM"]).code, 0);
  const empty = run(["status", join(ent, "engagements", "crm")]);
  assert.equal(empty.code, 0, empty.out);
  assert.match(empty.stdout, /^step \| ingest \| enterprises\/acme\/engagements\/crm \| no Modules yet: drop Inputs in inputs\/, then ingest drafts them$/m);
});

test("status: BRD readiness through release and Sign-off", () => {
  const e = enterprise("brd/resolved");
  const first = run(["status", e.eng]);
  assert.match(first.stdout, /^release \| ready \| v1 would log 0 change\(s\) since start \| 3 warning\(s\)$/m);
  assert.match(first.stdout, /^signoff \| next \| ready$/m);
  assert.match(first.stdout, /^step \| build-brd \| enterprises\/harbor-tiles\/engagements\/crm \| release v1 \(ready for Sign-off once released\)$/m);

  // Broken reference → release blocked, errors listed, build-brd preview to see them all.
  const reg = join(e.ent, "_agent", "sources.md");
  const ok = readFileSync(reg, "utf8");
  writeFileSync(reg, ok.replace(/^\| CE-1 .*\n/m, ""));
  const broken = run(["status", e.eng]);
  assert.match(broken.stdout, /^release \| blocked \| \d+ error\(s\), \d+ warning\(s\)$/m);
  assert.match(broken.stdout, /^release \| error \| \[[a-z-]+\] .*CE-1/m);
  assert.match(broken.stdout, /^step \| build-brd \| enterprises\/harbor-tiles\/engagements\/crm \| preview shows the \d+ error\(s\) to fix and which skill fixes each$/m);
  writeFileSync(reg, ok);

  assert.equal(run(["build-brd", e.eng, "--mode", "release", "--summary", "First version"]).code, 0);
  const released = run(["status", e.eng]);
  assert.match(released.stdout, /^brd \| v1 draft-for-review \d{4}-\d{2}-\d{2}$/m);
  assert.match(released.stdout, /^signoff \| v1 \| ready$/m);
  assert.match(released.stdout, /^release \| ready \| v2 would log 0 change\(s\) since v1/m);
  assert.match(released.stdout, /^step \| build-brd \| enterprises\/harbor-tiles\/engagements\/crm \| sign-off v1 once its signed copy is in inputs\/ and ingested$/m);

  appendFileSync(reg, "| SO-1 | sign-off | Signed BRD v1 | 2026-10-28 | inputs/SO-1-signed.pdf | crm | |\n");
  const signed = run(["build-brd", e.eng, "--mode", "sign-off", "--signers", "Asha Rao | Sales head | 2026-10-28", "Ravi Menon | Consultant | 2026-10-28", "--evidence", "SO-1"]);
  assert.equal(signed.code, 0, signed.out);
  const after = run(["status", e.eng]);
  assert.match(after.stdout, /^brd \| v1 signed-off /m);
  assert.match(after.stdout, /^release \| ready \| v2 would log 4 change\(s\) since v1 \(4 only accepted at Sign-off\) \| 1 warning\(s\)$/m);
  assert.doesNotMatch(after.stdout, /^signoff \| v1/m);
  assert.match(after.stdout, /^done \| v1 signed off; nothing changed since$/m);
});

// ---- status: every Engagement ----

test("status from the repo root: one line per Engagement; Enterprises with Inputs only; empty repo → ingest", () => {
  const e = enterprise("reply/after-reply/harbor-tiles");
  mkdirSync(join(e.root, "enterprises", "acme", "inputs"), { recursive: true });
  writeFileSync(join(e.root, "enterprises", "acme", "inputs", "rfp.pdf"), "x");
  const r = run(["status", "--who", "Asha"], { cwd: e.root });
  assert.equal(r.code, 0, r.out);
  assert.deepEqual(lines(r.stdout), [
    "enterprise | acme | no Engagement yet | 1 Input(s) waiting",
    "engagement | harbor-tiles/crm | Sales CRM | Modules: 1 next, 1 blocked | 3 open Open Item(s) | no lock",
    "status | 1 Engagement(s)",
    "step | ingest |  | 1 Input(s) waiting to be registered",
  ]);
  assert.deepEqual(lines(run(["status", e.ent]).stdout).slice(-1), ["status | 1 Engagement(s)"]);

  const empty = tmp("empty");
  mkdirSync(join(empty, "enterprises"));
  assert.match(run(["status", empty]).stdout, /^step \| ingest \|  \| first run: drop the Enterprise's Inputs in enterprises\/<ent>\/inputs\//m);
  assert.equal(run(["status", tmp("nothing")]).code, 2);
  assert.equal(run(["status", e.eng, "--now", "soon"]).code, 2);
  assert.equal(run(["status", e.eng, "--force"]).code, 2);
});

test("status steps name only the six user skills, across every fixture Engagement", () => {
  const engs = [];
  const walk = (d) => {
    for (const x of readdirSync(d, { withFileTypes: true })) {
      if (!x.isDirectory()) continue;
      const p = join(d, x.name);
      if (existsSync(join(p, "_agent", "map.md"))) engs.push(p);
      else walk(p);
    }
  };
  walk(fixtures);
  assert.ok(engs.length >= 8, `found ${engs.length}`);
  for (const eng of engs) {
    const r = run(["status", eng]);
    assert.equal(r.code, 0, `${eng}\n${r.out}`);
    const skills = stepSkills(r.stdout);
    assert.ok(skills.length || /^done \|/m.test(r.stdout), `${eng}: no next step`);
    for (const s of skills) assert.ok(SIX.includes(s), `${eng}: step names ${s}`);
    // Always 4 cells; args = the Engagement path, + one Module prefix for resolve-module only.
    for (const l of lines(r.stdout).filter((x) => x.startsWith("step | "))) {
      const cells = l.split(" | ");
      assert.equal(cells.length, 4, `${eng}: ${l}`);
      const re = cells[1] === "resolve-module" ? /^enterprises\/[a-z0-9-]+\/engagements\/[a-z0-9-]+ [A-Z]{2,5}$/ : /^enterprises\/[a-z0-9-]+\/engagements\/[a-z0-9-]+$/;
      assert.match(cells[2], re, `${eng}: ${l}`);
      assert.ok(cells[3].trim(), `${eng}: ${l}`);
    }
  }
});

// ---- SKILL text ----

test("studio SKILL: six user skills only, read-only engine calls, stale lock / claim cleared only after asking", () => {
  const text = readFileSync(join(plugin, "skills", "studio", "SKILL.md"), "utf8");
  const named = [...new Set([...text.matchAll(/\/neome-studio:([a-z-]+)/g)].map((m) => m[1]))].sort();
  assert.deepEqual(named, [...SIX].sort());
  const calls = [...new Set([...text.matchAll(/ENGINE ([a-z-]+(?: [a-z]+)?)/g)].map((m) => m[1].replace(/ <.*$/, "")))];
  for (const c of calls) assert.ok(["setup-check", "status", "unlock", "module release"].includes(c), `unexpected engine call: ${c}`);
  assert.match(text, /ENGINE unlock <eng> --who "<who>" --force/);
  assert.match(text, /ENGINE module release <eng> <P> --who "<who>" --force/);
  assert.match(text, /Act only on a clear yes/);
  assert.match(text, /\[git-protocol\.md\]\(\.\.\/\.\.\/reference\/git-protocol\.md\)/);
  assert.match(text, /\[problems\.md\]\(\.\.\/build-brd\/references\/problems\.md\)/);
  for (const link of [...text.matchAll(/\]\(([^)#]+)\)/g)].map((m) => m[1])) {
    assert.ok(existsSync(join(plugin, "skills", "studio", link)), `broken link ${link}`);
  }
});

// ---- the one write: stale lock and stale claim, over a real git remote ----

test("stale lock and claim: cleared with --force after asking, one studio commit each, pushed", () => {
  const box = tmp("stale");
  const env = gitEnv(box);
  const remote = join(box, "remote.git");
  git(box, env, "init", "--bare", "-b", "main", remote);
  const seed = join(box, "seed");
  git(box, env, "clone", remote, seed);
  cpSync(join(fixtures, "build-prototype", "after-prototype", "harbor-tiles"), join(seed, "enterprises", "harbor-tiles"), { recursive: true });
  const clone = (who) => {
    const d = join(box, who);
    git(box, env, "clone", remote, d);
    git(d, env, "config", "user.name", who);
    git(d, env, "config", "user.email", `${who}@x`);
    return d;
  };
  git(seed, env, "config", "user.name", "Seed");
  git(seed, env, "config", "user.email", "s@x");
  git(seed, env, "add", "-A");
  git(seed, env, "commit", "-m", "seed");
  assert.equal(git(seed, env, "push", "origin", "HEAD:main").code, 0);

  // Ben takes the lock, pushes it, then his session dies.
  const ben = clone("Ben");
  const engRel = join("enterprises", "harbor-tiles", "engagements", "crm");
  assert.equal(run(["lock", join(ben, engRel), "--who", "Ben", "--skill", "ingest"]).code, 0);
  git(ben, env, "add", join(engRel, "_agent", "map.md"));
  git(ben, env, "commit", "-m", "ingest: harbor-tiles/crm lock");
  assert.equal(git(ben, env, "push").code, 0);

  // Ravi runs studio: sees the lock and Asha's claim; the Consultant says yes to both.
  const ravi = clone("Ravi");
  const eng = join(ravi, engRel);
  const before = run(["status", eng, "--who", "Ravi"]);
  assert.match(before.stdout, /^lock \| Ben \| ingest \| /m);
  assert.match(before.stdout, /^claimed \| QUO \| Quotations \| by Asha \| since /m);
  assert.equal(git(ravi, env, "status", "--porcelain").out, "", "status wrote nothing");

  assert.equal(git(ravi, env, "pull", "--rebase", "--autostash").code, 0);
  const un = run(["unlock", eng, "--who", "Ravi", "--force"]);
  assert.equal(un.code, 0, un.out);
  assert.match(un.stdout, /unlock: cleared lock of Ben \(ingest\)/);
  assert.deepEqual(git(ravi, env, "status", "--porcelain").out.split("\n"), [`M ${join(engRel, "_agent", "map.md")}`]);
  git(ravi, env, "add", join(engRel, "_agent", "map.md"));
  git(ravi, env, "commit", "-m", "studio: harbor-tiles/crm clear stale lock of Ben (ingest)");
  assert.equal(git(ravi, env, "push").code, 0);

  const rel = run(["module", "release", eng, "QUO", "--who", "Ravi", "--force"]);
  assert.equal(rel.code, 0, rel.out);
  const changed = git(ravi, env, "status", "--porcelain").out.split("\n").map((x) => x.replace(/^\s*M\s+/, "")).sort();
  const quo = join(engRel, "_agent", "modules", "QUO-quotations");
  assert.deepEqual(changed, [join(engRel, "_agent", "map.md"), join(quo, "spec.md"), join(quo, "ticket.md")].sort());
  git(ravi, env, "add", ...changed);
  git(ravi, env, "commit", "-m", "studio: harbor-tiles/crm release stale claim of Asha on QUO");
  assert.equal(git(ravi, env, "push").code, 0);

  const after = run(["status", eng, "--who", "Ravi"]);
  assert.match(after.stdout, /^lock \| none$/m);
  assert.doesNotMatch(after.stdout, /^claimed \|/m);
  assert.match(after.stdout, /^blocked \| QUO \| Quotations \| is blocked by ENQ/m);
  assert.match(after.stdout, /^step \| resolve-module \| enterprises\/harbor-tiles\/engagements\/crm ENQ \| next: ENQ \(one per session\)$/m);
  assert.equal(git(ravi, env, "status", "--porcelain").out, "");
  // Ben pulls: lock gone on his side too.
  assert.equal(git(ben, env, "pull", "--rebase", "--autostash").code, 0);
  assert.match(run(["status", join(ben, engRel)]).stdout, /^lock \| none$/m);
  assert.deepEqual(
    git(ravi, env, "log", "--format=%s", "-2").out.split("\n"),
    ["studio: harbor-tiles/crm release stale claim of Asha on QUO", "studio: harbor-tiles/crm clear stale lock of Ben (ingest)"],
  );
  rmSync(box, { recursive: true, force: true });
});
