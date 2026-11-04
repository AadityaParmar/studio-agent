# Map: Build phase (Labels: wayfinder:map)

## Destination

Locked spec for plugin v3: the studio runs end to end, Inputs → resolved Modules → Enterprise built, checked and deployed in Neome Studio via the `neome-studio` MCP, by the Consultant in this plugin. Includes the final skill set (add / merge / hide). Editing skills and engine come after.

## Spec

Combined spec: [spec.md](spec.md) (all decisions + 10 build slices). Route clear 2026-11-04; only [Check the build](issues/07-check-build.md) on hold.

**Handed off 2026-11-04:** slices 1–2 built (`55fa224`, `e4040f2`); slices 3–10 continue as [Implementation v3 build map](../implementation-v3/map.md).

## Notes

- Plugin change: follow `docs/route.md`. Gate `npm test` + evals. Terms per `GLOSSARY.md`.
- Started from a review comparing neome-studio with mattpocock flow (2026-11-04). Mapping: ingest/review-draft/resolve-module ≈ wayfinder; build-brd ≈ to-spec. Missing: to-tickets, implement, code-review, research-type tickets, retro.
- Build inputs exist: template bank `## Execute` sections (142 entries, guide `neome-studio/reference/template-bank/EXECUTE.md` + `execute-guide/`), `docs/studio-ai-docs/`. Fixes from `OPUS-RECHECK.md` applied 2026-11-04 (456/456 tests), still uncommitted on branch `template-bank-refine-2026-11-03-2`.
- Execute steps cross Modules (e.g. TMOD-employee-master step 7 needs TMOD-leave, which needs EmployeeSheet). Build order ≠ Module order.
- MCP writes hit the live Enterprise draft. CLAUDE.md: confirm before `add`/`set`/`remove`/`deploy`.
- implement-spec lesson: parallel workers collide on shared resources. One Enterprise draft = shared.
- On hold: [Check the build](issues/07-check-build.md): `check-build` stays a todo skill, built later with full browser testing. Nothing blocks on it.
- Skills: /grilling, /domain-modeling, /research, /prototype.

## Decisions so far

- [Who builds, and destination check](issues/02-who-builds.md): Consultant builds with this plugin, same repo; build starts when every Module is resolved and every Requirement cleared (no Sign-off wait; supersedes D12 "Phase 2 takes latest signed-off snapshot"); build = several step files run one after another
- [MCP build capabilities](issues/01-mcp-build-capabilities.md): writes one at a time, checked on write; no App install, no Enterprise create, no edit lock, no users, no data import, no deploy vars; revert drops whole draft and refuses on never-deployed Enterprise
- [Build input contract](issues/03-build-input-contract.md): cleared = no open OI + not proposed, all priorities + Engagement-wide; engine gate + `status` step line; build reads frozen `brd-data.json` copy; revisit mid-build pauses its step files, rebuild delta only
- [Build ticket unit and order](issues/04-build-ticket-unit.md): step files by layer then Module, ~40 writes each, strict `NN-` line; header + MCP calls + human checklist + validate + Status/log; folder `_agent/implementation/` (snapshot, names, target, steps); Standard Delivery: Consultant picks per Module, install App by hand or build from scratch
- [Write confirmation and build lock](issues/05-write-confirm-and-lock.md): one yes per step file; Engagement lock + Studio edit lock; fail → 2 fix tries then stop `failed`, resume there; idempotent via list; file 00 deploys empty Enterprise once for undo; last file deploys on explicit yes after diff
- [Human steps inside the build](issues/12-human-steps.md): `- [ ] HUMAN:` lines in file 00 (edit lock, empty deploy, App installs), deploy file (deploy vars), go-live list (users, data); agent checks via MCP where it can; plugins = human step, suggested only where absolutely needed
- [Dry run: build one Module on a sandbox](issues/06-dry-run-one-module.md): VEN built on ent103 in 3 files, 26 writes, validate ok; write check ≠ validate (validate per call group), `diff_enterprise` broken on new forms, schemas too big for context, need spec→Studio type table, `All` OIs vs gate open
- [Close Neomenta-owned Open Items](issues/09-neomenta-open-items.md): new user skill `resolve-open-items` (read-only research, Source type `NR`); unsettled → stays open "ask Neome product team"; changed Module → needs-revisit; `studio` routes to it
- [UAT and change loop](issues/08-uat-and-change-loop.md): user gives feedback/changes to the agent directly; one `CR-NN.md` per change session until closed; built wrong → rework step file, need changed → Module revisit → rebuild difference from frozen copies; re-deploy needs yes; Sign-off when user asks
- [Evals for the build phase](issues/10-build-evals.md): engine fixture tests in `npm test`; live evals on ent103 only on build skill text change; gates validate / counts / coverage / types / no unconfirmed write; reset by revert breaks if someone deploys ent103 (VEN now deployed there; kept as baseline)
- [Final skill set and router](issues/11-final-skill-set.md): 9 user skills (+ `resolve-open-items`, `implement` plan|run, `change`); `neome-mapping` merged into `write-module-spec`; building blocks hidden; `build-brd` views mode; spec/mapping/Prototype as background agent; `change` flow note → sort + impact → update Modules (big → revisit) → BRD todo → build → close; unclear change item blocks only itself
- Glossary clash fixes (user, 2026-11-04): new phase = **Implementation**, skill `implement`, folder `_agent/implementation/`, Frozen copy, Studio Enterprise, Step file, Change request (`CR`); "build" stays with Neome Build / `build-brd` / `build-prototype`: [glossary-draft.md](glossary-draft.md)

## Not yet specified

- Migration topic: bulk data import into sheets after build. Not via MCP (01); Studio UI or other path.
- Translations, deep links, user layouts: in build scope or later.
- Going live: user onboarding, roles to real people, after deploy. Not via MCP (01).
- Change file location and item shape (08, 11): Source type `CR` decided; folder and fields not yet.
- Upstream pins for new skills (to-tickets, implement, code-review).

## Out of scope

- Fixing Execute content (done in thread "Explore Project and Document Findings").
- Editing skills / engine for real (after map).
- Pricing, RFP-response genre (D00).
