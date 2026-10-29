// resolve-module helpers (ticket 34): module frontier / claim / release / close / revisit, rename --who,
// the claim race over a real git remote (map-logic.md, Claim), and the hand-run sample:
// QUO resolved end to end (process refined, GEN-04 added under the lock, ticket closed) must pass the build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
const fixtures = join(here, "fixtures");

const run = (...args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};
function copy(rel) {
  const ent = join(mkdtempSync(join(tmpdir(), "neome-resolve-")), "harbor-tiles");
  cpSync(join(fixtures, rel, "harbor-tiles"), ent, { recursive: true });
  return { ent, eng: join(ent, "engagements", "crm") };
}
const reviewed = () => copy("review-draft/after-review"); // ENQ, QUO open; QUO blockedBy ENQ
const prototyped = () => copy("build-prototype/after-prototype"); // QUO claimed by Asha, spec + data written
const resolved = () => copy("resolve-module/after-resolve"); // QUO resolved (view not stored: rebuild)

const read = (...p) => readFileSync(join(...p), "utf8");
const agent = (eng, ...p) => join(eng, "_agent", ...p);
const ticket = (eng, folder) => read(agent(eng, "modules", folder, "ticket.md"));
const fm = (text) => parseYaml(text.match(/^---\n([\s\S]*?)\n---\n/)[1]);
const mapRow = (eng, p) => read(agent(eng, "map.md")).match(new RegExp(`^\\| ${p} \\|.*$`, "m"))?.[0];
const lastLog = (eng) => read(agent(eng, "map.md")).trim().split("\n").pop();
const setFm = (eng, folder, from, to) => {
  const p = agent(eng, "modules", folder, "ticket.md");
  writeFileSync(p, readFileSync(p, "utf8").replace(from, to));
};

function snapshot(dir) {
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

// ---- frontier ----

test("frontier: confirmed, unblocked Modules first; blocked ones say why", () => {
  const { eng } = reviewed();
  const r = run("module", "frontier", eng);
  assert.equal(r.code, 0, r.out);
  assert.equal(r.out.trim(), "next | ENQ | Enquiries | open\nblocked | QUO | Quotations | is blocked by ENQ (not resolved yet)");
});

test("frontier: needs-revisit before open, with its reason; claimed shows who; draft points at review-draft", () => {
  const { eng } = resolved();
  setFm(eng, "QUO-quotations", "blockedBy: [ENQ]", "blockedBy: []");
  assert.equal(run("module", "revisit", eng, "QUO", "--reason", "Validity settled [QA-1]").code, 0);
  run("module", "new", eng, "DEL", "--name", "Deliveries");
  const r = run("module", "frontier", eng);
  assert.equal(r.code, 0, r.out);
  const lines = r.out.trim().split("\n");
  assert.deepEqual(lines.slice(0, 2), ["next | QUO | Quotations | needs-revisit | Validity settled [QA-1]", "next | ENQ | Enquiries | open"]);
  assert.ok(lines.includes("draft | DEL | Deliveries | run review-draft"));
  assert.equal(run("module", "claim", eng, "ENQ", "--who", "Ben").code, 0);
  assert.match(run("module", "frontier", eng).out, /^claimed \| ENQ \| Enquiries \| by Ben$/m);
});

// ---- claim ----

test("claim: sets status claimed + claimedBy, map row and change log; build still passes", () => {
  const { eng } = reviewed();
  const r = run("module", "claim", eng, "ENQ", "--who", "Asha");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /claimed: ENQ by Asha \(first pass\)/);
  const t = ticket(eng, "ENQ-enquiries");
  assert.match(t, /^---\nstatus: claimed\nprefix: ENQ\nname: Enquiries\nblockedBy: \[\]\nrevisitReason:\nformerly:\nclaimedBy: Asha\n---\n/);
  assert.equal(mapRow(eng, "ENQ"), "| ENQ | Enquiries | claimed |");
  assert.match(lastLog(eng), /^- \d{4}-\d{2}-\d{2}: resolve-module: ENQ claimed by Asha\.$/);
  assert.equal(run("build-brd", eng, "--check").code, 0);
});

test("claim refused when someone else holds it: names them, suggests the next Module, writes nothing", () => {
  const { eng } = reviewed();
  run("module", "new", eng, "DEL", "--name", "Deliveries");
  run("module", "confirm", eng, "DEL");
  assert.equal(run("module", "claim", eng, "ENQ", "--who", "Asha").code, 0);
  const before = snapshot(eng);
  const r = run("module", "claim", eng, "ENQ", "--who", "Ben");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ENQ is claimed by Asha; next on the frontier: DEL/);
  assert.deepEqual(snapshot(eng), before);
});

test("claim refused when blocked, draft, resolved or merged; nothing written", () => {
  const cases = [
    [reviewed, "QUO", () => {}, /QUO is blocked by ENQ/],
    [reviewed, "DEL", (eng) => run("module", "new", eng, "DEL", "--name", "Deliveries"), /DEL is still draft/],
    [resolved, "QUO", () => {}, /QUO is resolved/],
    [reviewed, "ENQ", (eng) => run("module", "merge", eng, "ENQ", "--into", "QUO"), /ENQ is merged-into QUO/],
  ];
  for (const [mk, p, prep, pattern] of cases) {
    const { eng } = mk();
    prep(eng);
    const before = snapshot(eng);
    const r = run("module", "claim", eng, p, "--who", "Asha");
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, pattern);
    assert.deepEqual(snapshot(eng), before);
  }
});

test("claim by the holder again (resumed session) is a no-op; --who is required", () => {
  const { eng } = prototyped();
  const before = snapshot(eng);
  const r = run("module", "claim", eng, "QUO", "--who", "Asha");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /already claimed by you; nothing written/);
  assert.deepEqual(snapshot(eng), before);
  assert.equal(run("module", "claim", eng, "QUO").code, 2);
});

test("blocker merged into a resolved Module counts as resolved", () => {
  const { eng } = resolved();
  run("module", "new", eng, "DEL", "--name", "Deliveries");
  run("module", "confirm", eng, "DEL", "--blocked-by", "QUO");
  assert.match(run("module", "frontier", eng).out, /^next \| DEL \| Deliveries \| open$/m);
  setFm(eng, "QUO-quotations", "status: resolved", "status: open");
  assert.match(run("module", "frontier", eng).out, /^blocked \| DEL \| Deliveries \| is blocked by QUO/m);
});

// ---- release ----

test("release: back to open, claimedBy cleared; only the holder (or --force)", () => {
  const { eng } = reviewed();
  run("module", "claim", eng, "ENQ", "--who", "Asha");
  const refused = run("module", "release", eng, "ENQ", "--who", "Ben");
  assert.equal(refused.code, 1);
  assert.match(refused.out, /claimed by Asha, not Ben; release it only with --force/);
  const r = run("module", "release", eng, "ENQ", "--who", "Asha");
  assert.equal(r.code, 0, r.out);
  const f = fm(ticket(eng, "ENQ-enquiries"));
  assert.equal(f.status, "open");
  assert.equal(f.claimedBy, null);
  assert.equal(mapRow(eng, "ENQ"), "| ENQ | Enquiries | open |");
  assert.match(lastLog(eng), /resolve-module: ENQ claim of Asha released\.$/);
  run("module", "claim", eng, "ENQ", "--who", "Asha");
  assert.equal(run("module", "release", eng, "ENQ", "--who", "Ben", "--force").code, 0);
  assert.match(lastLog(eng), /claim of Asha released by Ben\.$/);
});

// ---- close ----

test("close: refused without the Prototype; after build-prototype → resolved, claimedBy kept, spec Status", () => {
  const { eng } = prototyped();
  const before = snapshot(eng);
  const no = run("module", "close", eng, "QUO", "--who", "Asha");
  assert.equal(no.code, 1, no.out);
  assert.match(no.out, /missing prototypes\/QUO-quotations\.html/);
  assert.deepEqual(snapshot(eng), before);
  assert.equal(run("build-prototype", eng, "QUO").code, 0);
  const r = run("module", "close", eng, "QUO", "--who", "Asha");
  assert.equal(r.code, 0, r.out);
  const f = fm(ticket(eng, "QUO-quotations"));
  assert.equal(f.status, "resolved");
  assert.equal(f.claimedBy, "Asha");
  assert.equal(f.revisitReason, null);
  assert.match(read(agent(eng, "modules", "QUO-quotations", "spec.md")), /^Status: resolved$/m);
  assert.equal(mapRow(eng, "QUO"), "| QUO | Quotations | resolved |");
  assert.match(lastLog(eng), /resolve-module: QUO resolved\.$/);
  assert.equal(run("build-brd", eng, "--check").code, 0);
});

test("close: refused when spec-check fails or another Consultant holds the claim; open OIs do not block", () => {
  const { eng } = prototyped();
  assert.equal(run("build-prototype", eng, "QUO").code, 0);
  const other = run("module", "close", eng, "QUO", "--who", "Ben");
  assert.equal(other.code, 1);
  assert.match(other.out, /claimed by Asha, not Ben/);
  const spec = agent(eng, "modules", "QUO-quotations", "spec.md");
  const good = readFileSync(spec, "utf8");
  writeFileSync(spec, good.replace(/^Neome App: .*\n/m, ""));
  const before = snapshot(eng);
  const r = run("module", "close", eng, "QUO", "--who", "Asha");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /spec-check fails/);
  assert.deepEqual(snapshot(eng), before);
  writeFileSync(spec, good);
  assert.match(read(agent(eng, "open-items.md")), /\| OI-09 \|[^\n]*\| open \|/);
  assert.equal(run("module", "close", eng, "QUO", "--who", "Asha").code, 0);
});

// ---- revisit ----

test("revisit pass: needs-revisit with reason → claim (revisit) → rebuild → close clears the reason", () => {
  const { eng } = resolved();
  setFm(eng, "ENQ-enquiries", "status: open", "status: resolved");
  const r = run("module", "revisit", eng, "QUO", "--reason", "Validity 30 days for contractors [QA-1]");
  assert.equal(r.code, 0, r.out);
  let f = fm(ticket(eng, "QUO-quotations"));
  assert.equal(f.status, "needs-revisit");
  assert.equal(f.revisitReason, "Validity 30 days for contractors [QA-1]");
  assert.match(lastLog(eng), /ingest: QUO needs revisit: Validity 30 days for contractors \[QA-1\]$/);
  run("module", "revisit", eng, "QUO", "--reason", "PF-1 asks for a lost reason");
  assert.equal(fm(ticket(eng, "QUO-quotations")).revisitReason, "Validity 30 days for contractors [QA-1]; PF-1 asks for a lost reason");
  const c = run("module", "claim", eng, "QUO", "--who", "Ben");
  assert.equal(c.code, 0, c.out);
  assert.match(c.out, /claimed: QUO by Ben \(revisit: Validity 30 days/);
  assert.match(read(agent(eng, "modules", "QUO-quotations", "spec.md")), /^Status: claimed$/m);
  const blocked = run("module", "revisit", eng, "QUO", "--reason", "more [QA-2]");
  assert.equal(blocked.code, 1);
  assert.match(blocked.out, /claimed by Ben; tell them/);
  assert.equal(run("build-prototype", eng, "QUO").code, 0);
  assert.equal(run("module", "close", eng, "QUO", "--who", "Ben").code, 0);
  f = fm(ticket(eng, "QUO-quotations"));
  assert.equal(f.status, "resolved");
  assert.equal(f.revisitReason, null);
  assert.equal(f.claimedBy, "Ben");
  assert.match(lastLog(eng), /resolve-module: QUO resolved \(revisit\)\.$/);
});

test("release of a revisit keeps it needs-revisit; revisit refused on an open Module", () => {
  const { eng } = resolved();
  setFm(eng, "ENQ-enquiries", "status: open", "status: resolved");
  run("module", "revisit", eng, "QUO", "--reason", "x [QA-1]");
  run("module", "claim", eng, "QUO", "--who", "Ben");
  assert.equal(run("module", "release", eng, "QUO", "--who", "Ben").code, 0);
  assert.equal(fm(ticket(eng, "QUO-quotations")).status, "needs-revisit");
  assert.equal(mapRow(eng, "QUO"), "| QUO | Quotations | needs-revisit |");
  setFm(eng, "ENQ-enquiries", "status: resolved", "status: open");
  const r = run("module", "revisit", eng, "ENQ", "--reason", "y [QA-1]");
  assert.equal(r.code, 1);
  assert.match(r.out, /ENQ is open; only a resolved Module needs a revisit/);
});

// ---- rename / merge with a Prototype ----

test("rename --who: the holder renames its claimed Module; the view follows and rebuilds under the new prefix", () => {
  const { eng } = prototyped();
  assert.equal(run("build-prototype", eng, "QUO").code, 0);
  const other = run("module", "rename", eng, "QUO", "--name", "Price quotes", "--who", "Ben");
  assert.equal(other.code, 1);
  assert.match(other.out, /claimed by Asha/);
  const r = run("module", "rename", eng, "QUO", "--to", "PQ", "--name", "Price quotes", "--who", "Asha");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /prototypes\/QUO-quotations\.html → prototypes\/PQ-price-quotes\.html; rebuild it/);
  assert.ok(existsSync(join(eng, "prototypes", "PQ-price-quotes.html")));
  assert.ok(!existsSync(join(eng, "prototypes", "QUO-quotations.html")));
  assert.equal(fm(ticket(eng, "PQ-price-quotes")).status, "claimed");
  const b = run("build-prototype", eng, "PQ");
  assert.equal(b.code, 0, b.out);
  assert.match(read(join(eng, "prototypes", "PQ-price-quotes.html")), /<title>PROTOTYPE · Harbor Tiles · PQ Price quotes<\/title>/);
  assert.equal(run("module", "close", eng, "PQ", "--who", "Asha").code, 0);
});

test("merge after release: merged Module's view removed; resolved target needs-revisit", () => {
  const { eng } = resolved();
  // QUO resolved with its view; ENQ claimed, then the Enterprise says ENQ is part of QUO.
  setFm(eng, "QUO-quotations", "status: resolved", "status: claimed");
  assert.equal(run("build-prototype", eng, "QUO").code, 0);
  setFm(eng, "QUO-quotations", "status: claimed", "status: resolved");
  mkdirSync(join(eng, "prototypes"), { recursive: true });
  writeFileSync(join(eng, "prototypes", "ENQ-enquiries.html"), "<!doctype html>");
  assert.equal(run("module", "claim", eng, "ENQ", "--who", "Asha").code, 0);
  assert.equal(run("module", "release", eng, "ENQ", "--who", "Asha").code, 0);
  const m = run("module", "merge", eng, "ENQ", "--into", "QUO");
  assert.equal(m.code, 0, m.out);
  assert.match(m.out, /prototype: prototypes\/ENQ-enquiries\.html removed/);
  assert.match(m.out, /rebuild prototypes\/QUO-quotations\.html/);
  assert.ok(!existsSync(join(eng, "prototypes", "ENQ-enquiries.html")));
  const v = run("module", "revisit", eng, "QUO", "--reason", "ENQ merged in [WS-3]", "--skill", "resolve-module");
  assert.equal(v.code, 0, v.out);
  assert.match(lastLog(eng), /resolve-module: QUO needs revisit: ENQ merged in \[WS-3\]$/);
  assert.match(run("module", "frontier", eng).out, /^next \| QUO \| Quotations \| needs-revisit \| ENQ merged in \[WS-3\]$/m);
});

// ---- claim race over git (map-logic Claim step 4) ----

const gitOk = spawnSync("git", ["--version"]).status === 0;

test("claim race: second push rejected; recovery per map-logic ends in 'claimed by', nothing lost", { skip: !gitOk && "git missing" }, () => {
  const root = mkdtempSync(join(tmpdir(), "neome-race-"));
  const git = (cwd, ...a) => {
    const r = spawnSync("git", a, { cwd, encoding: "utf8" });
    return { code: r.status, out: r.stdout + r.stderr };
  };
  const remote = join(root, "remote.git");
  git(root, "init", "--bare", "-b", "main", remote);
  const seed = join(root, "seed");
  git(root, "clone", remote, seed);
  cpSync(join(fixtures, "review-draft", "after-review", "harbor-tiles"), join(seed, "enterprises", "harbor-tiles"), { recursive: true });
  for (const [k, v] of [["user.name", "Seed"], ["user.email", "s@x"]]) git(seed, "config", k, v);
  git(seed, "add", "-A");
  git(seed, "commit", "-m", "seed");
  assert.equal(git(seed, "push", "origin", "HEAD:main").code, 0);
  const clone = (who) => {
    const d = join(root, who);
    git(root, "clone", remote, d);
    git(d, "config", "user.name", who);
    git(d, "config", "user.email", `${who}@x`);
    return d;
  };
  const asha = clone("Asha");
  const ben = clone("Ben");
  const eng = (d) => join(d, "enterprises", "harbor-tiles", "engagements", "crm");
  const claimFiles = ["_agent/map.md", "_agent/modules/ENQ-enquiries/ticket.md"].map((f) => join("enterprises/harbor-tiles/engagements/crm", f));
  const claimAndPush = (d, who) => {
    assert.equal(run("module", "claim", eng(d), "ENQ", "--who", who).code, 0);
    git(d, "add", ...claimFiles);
    git(d, "commit", "-m", "resolve-module: harbor-tiles/crm claim ENQ");
    return git(d, "push");
  };
  // Both pulled before either pushed.
  assert.equal(claimAndPush(asha, "Asha").code, 0);
  const rejected = claimAndPush(ben, "Ben");
  assert.notEqual(rejected.code, 0);
  // Step 4: pull --rebase conflicts (same lines) → abort, undo own claim commit, discard, pull, claim again.
  const pull = git(ben, "pull", "--rebase", "--autostash");
  assert.notEqual(pull.code, 0, pull.out);
  assert.equal(git(ben, "rebase", "--abort").code, 0);
  assert.equal(git(ben, "reset", "--mixed", "HEAD~1").code, 0);
  assert.equal(git(ben, "checkout", "--", ...claimFiles).code, 0);
  assert.equal(git(ben, "pull", "--rebase", "--autostash").code, 0);
  const again = run("module", "claim", eng(ben), "ENQ", "--who", "Ben");
  assert.equal(again.code, 1);
  assert.match(again.out, /ENQ is claimed by Asha/);
  assert.equal(git(ben, "status", "--porcelain").out.trim(), "");
  assert.equal(git(ben, "log", "-1", "--format=%an").out.trim(), "Asha");
});

// ---- hand-run sample: QUO resolved end to end ----

test("hand-run resolve of QUO: ticket resolved, spec done, build passes with no QUO warnings", () => {
  const { eng } = resolved();
  const f = fm(ticket(eng, "QUO-quotations"));
  assert.deepEqual([f.status, f.claimedBy, f.revisitReason], ["resolved", "Asha", null]);
  assert.equal(mapRow(eng, "QUO"), "| QUO | Quotations | resolved |");
  assert.doesNotMatch(read(agent(eng, "map.md")), /^lock:/m);
  assert.equal(run("spec-check", eng, "QUO").code, 0);
  const c = run("build-brd", eng, "--check");
  assert.equal(c.code, 0, c.out);
  assert.doesNotMatch(c.out, /Module QUO/);
  // The Prototype view is not stored; it rebuilds from the fixture.
  setFm(eng, "QUO-quotations", "status: resolved", "status: claimed");
  assert.equal(run("build-prototype", eng, "QUO").code, 0);
});

test("hand-run resolve: QUO section of process.md refined from WS-2; GEN-04 added for the ask no Module owns", () => {
  const { eng } = resolved();
  const proc = read(agent(eng, "process.md"));
  const quo = proc.slice(proc.indexOf("## QUO"), proc.indexOf("## Edges"));
  assert.match(quo, /\| approve-discount \| head \| QUO \| Approve discount \| Discount above 8% \| decision \| OI-10 \| WS-2 \|/);
  assert.doesNotMatch(quo, /OI-01|OI-04/); // closed by WS-2
  assert.match(quo, /\| buyer-decides \|/);
  assert.match(proc, /\| buyer-decides \| make-quotation \| changes asked: revised quotation replaces it \| yes \| WS-2 \|/);
  // ENQ's section untouched.
  const before = read(join(fixtures, "build-prototype", "after-prototype", "harbor-tiles", "engagements", "crm", "_agent", "process.md"));
  const enq = (t) => t.slice(t.indexOf("## ENQ"), t.indexOf("## QUO"));
  assert.equal(enq(proc), enq(before));
  const gen = read(agent(eng, "general.md"));
  const access = gen.slice(gen.indexOf("## Access"), gen.indexOf("## Localisation"));
  assert.match(access, /### GEN-04 — Buyers' phone numbers only for their own sales exec\n\nStatement: .*\[WS-2\]/);
  assert.match(read(join(eng, "..", "..", "inputs", "WS-2-grill-module-session-quo.md")), /must not see each other's buyers' phone numbers/);
  const { code, out } = (() => {
    const r = spawnSync(process.execPath, [cli, "build-brd", eng], { encoding: "utf8" });
    return { code: r.status, out: r.stdout + r.stderr };
  })();
  assert.equal(code, 0, out);
  const data = JSON.parse(read(agent(eng, "brd", "brd-data.json")));
  assert.equal(data.general.requirements.find((q) => q.id === "GEN-04").topic, "access");
  assert.equal(data.modules.find((m) => m.prefix === "QUO").status, "resolved");
});

test("resolve-module skill: claim before work, the four blocks in order, close, revisit, shared edits under the lock", () => {
  const s = read(here, "..", "..", "skills", "resolve-module", "SKILL.md");
  const order = ["ENGINE module claim", "Run the `grill-module`", "section of `process.md`", "Run the `write-module-spec`", "Run the `build-prototype`", "under its topic in `general.md`", "ENGINE module close"]
    .map((x) => s.indexOf(x));
  assert.ok(order.every((i) => i > 0), order.join());
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  for (const x of ["revisitReason", "Engagement lock", "module rename", "module release", "module revisit", "Not yet placed", "someone else claimed"]) {
    assert.ok(s.includes(x), x);
  }
  assert.doesNotMatch(s, /Stub\./);
});
