# Spec: Implementation (plugin v3)

Gists every decision of [map.md](map.md); detail lives in each ticket. Terms per `GLOSSARY.md`. Change process: `docs/route.md`.

Supersedes **D12** in part: Implementation does not wait for Sign-off ("Phase 2 takes latest signed-off snapshot" gone); Sign-off happens when the user asks. Extends D00 scope: Implementation in Neome Studio is now in scope.

Terms (draft for `GLOSSARY.md`, slice 9): [glossary-draft.md](glossary-draft.md). **Implementation** = building the Studio Enterprise; never "build" (taken by Neome Build, `build-brd`, `build-prototype`).

## 1. What it adds

The Consultant goes on in the same repo and Engagement from resolved Modules to a Studio Enterprise built, deployed and changed via the `neome-studio` MCP ([02](issues/02-who-builds.md)). New user skills: `implement` (plan | run), `change`, `resolve-open-items`. `check-build` on hold ([07](issues/07-check-build.md)).

## 2. Implementation gate ([02](issues/02-who-builds.md), [03](issues/03-build-input-contract.md))

- Implementation may start when every Module is `resolved` and every Requirement is **cleared**: no open Open Item on it, not `(proposed, to confirm)`. All priorities, Engagement-wide Requirements too.
- Engine checks it; `status` prints a `implement` step line; `studio` routes there.
- Exception, `change` only: an unclear change item (Open Item) blocks only itself ([11](issues/11-final-skill-set.md)).

## 3. Implementation files ([03](issues/03-build-input-contract.md), [04](issues/04-build-ticket-unit.md))

Folder `<eng>/_agent/implementation/`:

- `frozen-brd-data.json`: Frozen copy of `brd-data.json` taken at `implement plan`. Build reads only this.
- `names.md`: Enterprise term → Studio name, plus option keys (`keyActive`) ([06](issues/06-dry-run-one-module.md)).
- `target.md`: Studio Enterprise `entId` and name, per-Module Neome App choice (A install by hand / B build from scratch).
- `steps/NN-<layer>-<module>.md`: run in a strict line, each needs all before it.

Cut: by layer, then Module in layer: roles + vars → master sheets → transaction forms/sheets → formulas + form events → actions + groups → workflows → reports. ~40 MCP writes per file; big layer splits by Module.

Step file: header (Modules, Requirement IDs, needs), numbered MCP calls (kind, name, key props), `- [ ] HUMAN: <what> — <where in Studio>` lines, `validate` checkpoints, `Status: open|done|failed`, run log.

Spec type → Studio type table in `implement plan` ([06](issues/06-dry-run-one-module.md)): choice → pickText + setOfText var; file → document (+ permissionMatrix); phone → mobileNumber; long text → paragraph; person → pickUser; link → ref.

Revisit during Implementation: that Module's step files pause; after it, new Frozen copy, rebuild the difference only.

## 4. Running a step file ([05](issues/05-write-confirm-and-lock.md), [06](issues/06-dry-run-one-module.md))

- Show the file's call list; one Consultant yes covers every write in it. CLAUDE.md MCP rule gets a matching line.
- Engagement lock while running; Studio edit lock (human) guards the Enterprise.
- Writes strictly one at a time, `entId` on every call.
- `validate` after each call group, not only at file end (write check ≠ validate).
- Failure: 2 fix tries (`schema`, retry); then stop, `failed`, logged; next run resumes at that call. Never skip.
- Resume: `list` / `describe` first, skip what exists.
- Schema: never read whole into context (list layout = 88 KB); use execute-guide or a script extract.

## 5. Human steps ([12](issues/12-human-steps.md))

- `00`: take Studio edit lock, deploy empty Enterprise once (so revert works), install Neome Apps (choice A).
- Deploy file: set deploy var values before deploy.
- Go-live list after deploy: users, roles to people, data import (not MCP).
- Agent checks via MCP where it can (`list`, `list_enterprises`); else Consultant "done" logged with name + date.
- Plugins: always a human step; suggested only where absolutely needed.

## 6. Deploy ([05](issues/05-write-confirm-and-lock.md), [06](issues/06-dry-run-one-module.md))

Last file `NN-deploy.md`: `validate` 0 errors → change summary → explicit yes → `deploy_enterprise` → poll `deploy_status`. `diff_enterprise` fails on a draft with new forms ("form not found"): summary falls back to `describe ent` counts + `list` per kind vs step files. Report the bug to the Neome MCP team.

## 7. `change` skill ([08](issues/08-uat-and-change-loop.md), [11](issues/11-final-skill-set.md))

User tells the agent feedback or changes directly.

1. Note: `CR-NN.md`, one per session, items verbatim, who, date; Source type `CR`.
2. Sort + impact: built wrong / need changed / new need / unclear (→ Open Item); show Modules, Requirements, step files, other Modules touched; Consultant confirms.
3. Update Module files: small → edit `spec.md` citing `CR-n`, withdraw never delete, `spec-check`, rebuild Prototype. Big (adds a Module, changes the flow, > 3 Requirements in a Module) → needs-revisit → `resolve-module`.
4. BRD: preview always; released version touched → todo "release BRD v<N+1>".
5. Build: `implement plan` new Frozen copy → difference step files appended (rework files for built wrong); done files never edited. `implement run`, yes per file, deploy on yes.
6. Close when every item is built, withdrawn or an Open Item.

## 8. `resolve-open-items` ([09](issues/09-neomenta-open-items.md))

Closes Neomenta-owned Open Items from catalog, Template bank, `docs/studio-ai-docs/`, MCP `schema` (read-only). Answer = research note, Source type `NR`. Can't settle → stays open, "ask Neome product team". Changes a resolved Module → needs-revisit. `studio` routes to it when any are open.

## 9. Skill set ([11](issues/11-final-skill-set.md))

- User (9): `studio`, `ingest`, `review-draft`, `resolve-module`, `questionnaire`, `build-brd`, `resolve-open-items`, `implement`, `change`.
- Building blocks (4, `user-invocable: false`): `grill-module`, `write-module-spec` (absorbs `neome-mapping`), `build-prototype`, `enterprise-glossary`.
- `build-brd`: new views-only rebuild mode (BRD + Prototypes). Sign-off mode runs when the user asks.
- `resolve-module`: grilling with the Consultant; spec, mapping, Prototype as a fresh background agent (eval-gated).
- On hold: `check-build` (browser testing, later effort).
- Maintainer: `/retro` after real Engagements.

## 10. Evals ([10](issues/10-build-evals.md))

- `npm test`: fixture Frozen copy → expected step files; gate + step file lint.
- Live eval on ent103 `e-qMihNWulraS4gYKTspkfbygWZ` (baseline: VEN deployed), only when `implement` skill text changes. Gates: `validate` ok; counts per kind = step files; every cleared Requirement covered; no text field for people / choices / links; 0 writes without a yes.
- Reset: revert works only back to last deploy; a human deploy moves the baseline. Pick remove-all + deploy, or a protected eval Enterprise, when building.

## 11. Out of scope

`check-build` (on hold), data import, go-live detail, plugin build, pricing, RFP-response genre.

## Build slices (plugin work, suggested order)

| # | Slice | Main files |
|---|---|---|
| 1 | **Done 2026-11-04.** Engine gate: cleared rule; `status` prints `implement | ready` / `blocked` + blockers (info only). The `step | implement` line moves to slice 4, when the skill exists | `engine/status.mjs`, `engine/implementation/gate.mjs`, `test/implementation-gate.test.mjs` |
| 2 | Engine Implementation files: Frozen copy, names, target, step file format + lint, type table | new `engine/implementation/*.mjs`, fixtures, tests |
| 3 | execute-guide fixes from dry run (list `categoryFields` rejects pickText; option keys; schema size) | `reference/template-bank/execute-guide/` |
| 4 | Skill `implement` plan mode + `step | implement` line in `status` (USER_SKILLS, studio table) | `skills/implement/SKILL.md` + `references/` |
| 5 | Skill `implement` run mode (MCP, yes per file, human steps, resume, deploy file) + CLAUDE.md MCP line | `skills/implement/`, `CLAUDE.md` |
| 6 | Skill `change` + Source type `CR` | `skills/change/`, `engine/ingest.mjs` prefixes, schema Source regex |
| 7 | Skill `resolve-open-items` + Source type `NR` | `skills/resolve-open-items/` |
| 8 | Skill set cleanup: merge `neome-mapping`, hide building blocks, `build-brd` views mode, `resolve-module` background agent | skills, `engine/check.mjs`, evals |
| 9 | Router + docs: `studio`, `next-session.md`, READMEs, HOW-TO-RUN, `GLOSSARY.md`, `docs/v3/decisions.md` (supersedes D12 part), `route.md` rows | docs |
| 10 | Live eval case on ent103 + release 3.0.0 | `evals/`, `plugin.json` |

## Builder's choices (not decisions, pick in slice)

- Change file folder and item fields; `NR` note shape.
- Exact write cap per step file; how layers split by Module.
- Glossary: "build" vs existing term **Neome Build** (JSON export) clash: run `/domain-modeling` in slice 9 (new terms: Step file, Frozen copy, Change).
- Eval reset method (section 10).
