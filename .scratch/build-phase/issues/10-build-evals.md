# Evals for the build phase

Type: grilling
Status: resolved
Blocked by: 01, 06

## Question

How to test build skills without a live Enterprise each run: MCP mock, record/replay, or a fixed sandbox Enterprise reset by `revert_enterprise`? Gates (e.g. validate ok, no text field for people, every Requirement mapped to a resource).

## Answer

User, 2026-11-04, yes to all:

1. Engine tests (`npm test`, no MCP): fixture Frozen copy → expected step files.
2. Live eval Enterprise: ent103 `e-qMihNWulraS4gYKTspkfbygWZ`, never deployed by evals; reset before each run with `revert_enterprise`.
3. Live run gates: `validate` ok; counts per kind = step files; every cleared Requirement covered by ≥1 step; no text field for people / choices / links; 0 writes without a yes.
4. Live evals only when build skill text changes (like today's eval gate).
5. Revert ent103 now: tried 2026-11-04 → refused "Draft not found". ent103 had been **deployed with the VEN dry run** (not by the agent; `diff_enterprise` = no draft changes). Revert only returns to the last deploy.

Caveat on 2: a human deploy of the eval Enterprise moves its baseline. Reset must also work from a deployed state: `remove` every resource (one at a time) + deploy, or a protected eval Enterprise nobody deploys by hand. Decide when building evals.

## Comments

- 2026-11-04 user: choice A, keep deployed VEN as ent103 baseline; evals start from "VEN built".
