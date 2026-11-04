// Implementation gate (build-phase spec §2, tickets 02/03): every Module resolved (or merged) and every live
// Requirement cleared: not proposed, no open Open Item on its OIs line. Engagement-wide Requirements too.
import { test } from "node:test";
import assert from "node:assert/strict";
import { implementationBlockers } from "../implementation/gate.mjs";

const req = (id, extra = {}) => ({ id, title: id, statement: "s", acceptance: [], priority: "Must", scope: "neome", sources: ["CE-1"], ois: [], proposed: false, ...extra });
const mod = (prefix, status, requirements) => ({ prefix, name: prefix, status, requirements });
const oi = (id, status) => ({ id, question: "q", modules: ["All"], owner: "enterprise", status, askedIn: [] });
const data = ({ modules = [], general = [], openItems = [] } = {}) => ({ modules, general: { requirements: general, na: [], oiRefs: [] }, openItems });
const msgs = (d) => implementationBlockers(d).map((b) => b.msg);

test("gate: all resolved, nothing proposed, OIs closed → no blockers", () => {
  const d = data({
    modules: [mod("VEN", "resolved", [req("VEN-01", { ois: ["OI-01"] })])],
    general: [req("GEN-01", { topic: "access" })],
    openItems: [oi("OI-01", "closed")],
  });
  assert.deepEqual(msgs(d), []);
});

test("gate: a Module not resolved blocks; merged Modules and their Requirements are skipped", () => {
  const d = data({
    modules: [
      mod("VEN", "claimed", [req("VEN-01")]),
      mod("OLD", "merged-into:VEN", [req("OLD-01", { proposed: true })]),
      mod("PAY", "needs-revisit", []),
    ],
  });
  assert.deepEqual(msgs(d), [
    "Module VEN is claimed; every Module must be resolved or merged",
    "Module PAY is needs-revisit; every Module must be resolved or merged",
  ]);
});

test("gate: proposed Requirement and open Open Item block, in Modules and Engagement-wide; withdrawn skipped", () => {
  const d = data({
    modules: [
      mod("VEN", "resolved", [
        req("VEN-01", { proposed: true }),
        req("VEN-04", { ois: ["OI-25", "OI-20"] }),
        req("VEN-09", { proposed: true, withdrawn: "dropped [QA-1]" }),
      ]),
    ],
    general: [req("GEN-02", { topic: "hosting", ois: ["OI-30"] })],
    openItems: [oi("OI-25", "open"), oi("OI-20", "closed"), oi("OI-30", "open")],
  });
  assert.deepEqual(msgs(d), [
    "VEN-01: still (proposed, to confirm)",
    "VEN-04: Open Item OI-25 is open",
    "GEN-02: Open Item OI-30 is open",
  ]);
});

test("gate: an OI named on a Requirement but missing from the register blocks", () => {
  const d = data({ modules: [mod("VEN", "resolved", [req("VEN-01", { ois: ["OI-99"] })])] });
  assert.deepEqual(msgs(d), ["VEN-01: Open Item OI-99 is not in the register"]);
});

test("gate: every blocker has class implementation", () => {
  const d = data({ modules: [mod("VEN", "open", [])] });
  assert.deepEqual(implementationBlockers(d).map((b) => b.cls), ["implementation"]);
});

// ---- status lines ----
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "cli.mjs");
function engagement(rel) {
  const root = mkdtempSync(join(tmpdir(), "neome-gate-"));
  const ent = join(root, "enterprises", "harbor-tiles");
  cpSync(join(here, "fixtures", rel), ent, { recursive: true });
  return join(ent, "engagements", "crm");
}
const status = (eng) => {
  const r = spawnSync(process.execPath, [cli, "status", eng], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  return r.stdout.trim().split("\n");
};
const implLines = (l) => l.filter((x) => x.startsWith("implement |"));
function swap(file, from, to) {
  const t = readFileSync(file, "utf8");
  assert.ok(t.includes(from), `fixture edit: "${from}" not in ${file}`);
  writeFileSync(file, t.replaceAll(from, to));
}

test("status: implement | blocked with the first 5 blockers and a count of the rest", () => {
  const l = status(engagement("reply/after-reply/harbor-tiles"));
  assert.deepEqual(implLines(l), [
    "implement | blocked | 12 blocker(s)",
    "implement | blocker | Module ENQ is open; every Module must be resolved or merged",
    "implement | blocker | Module QUO is needs-revisit; every Module must be resolved or merged",
    "implement | blocker | ENQ-01: still (proposed, to confirm)",
    "implement | blocker | ENQ-02: still (proposed, to confirm)",
    "implement | blocker | ENQ-03: still (proposed, to confirm)",
    "implement | blocker | 7 more",
  ]);
  assert.ok(!l.some((x) => x.startsWith("step | implement")), "no implement step before the skill exists");
});

test("status: resolved Engagement with proposed Requirements and an open OI is blocked", () => {
  assert.deepEqual(implLines(status(engagement("brd/resolved"))), [
    "implement | blocked | 4 blocker(s)",
    "implement | blocker | LEAD-02: still (proposed, to confirm)",
    "implement | blocker | QUO-02: still (proposed, to confirm)",
    "implement | blocker | QUO-02: Open Item OI-01 is open",
    "implement | blocker | GEN-02: still (proposed, to confirm)",
  ]);
});

test("status: every Module resolved and every Requirement cleared → implement | ready", () => {
  const eng = engagement("brd/resolved");
  const a = join(eng, "_agent");
  for (const f of ["modules/LEAD-leads/spec.md", "modules/QUO-quotation/spec.md", "general.md"]) swap(join(a, f), "Proposed: yes", "Proposed: no");
  swap(join(a, "open-items.md"), "| Over 10% | open | QN-2026-10-10 | |", "| Over 10% | closed | QN-2026-10-10 | CE-1 |");
  assert.deepEqual(implLines(status(eng)), ["implement | ready | every Module resolved, every Requirement cleared"]);
});
