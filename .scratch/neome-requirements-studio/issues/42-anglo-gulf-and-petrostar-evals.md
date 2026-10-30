# 42 — `anglo-gulf-crm` eval case

**What to build:** One real-world Eval case: `anglo-gulf-crm` full flow (golden 59 Requirements, 28 OIs), with baseline results recorded. Spec: Testing Decisions.

**Blocked by:** 40 — Anonymised eval Inputs and golden docs; 41 — Eval runner + scorecard + `tiny-synthetic`

**Status:** resolved

- [x] Each case: Inputs, answer key, golden JSON in BRD-data shape, README
- [x] `anglo-gulf-crm` runs full flow
- [x] Baseline scorecard committed; maintainer spot-checks ~10 matches

## Comments

- 2026-10-29: cases built, `run.mjs check` ok, `npm test` 353/353. Golden anglo-gulf = 56 Requirements (IMP-01..03 are plan phases, dropped), 28 OIs. Baseline run not done yet (LLM cost; needs maintainer go).
- 2026-10-30: anglo-gulf-crm baseline committed (`results/2026-10-30-anglo-gulf-crm.md`, fail on A14 false Don't-know, accepted, spot-checked). Left: petrostar-crm baseline + spot-check.
- 2026-10-30 (resume log, multi-session, no rework): petrostar run stopped on Claude 5-hour limit. Workspace moved out of /var/folders temp to `~/neome-eval-work/petrostar-crm-eI2wGH` (remotes + `run/case.json` repointed). Done: ingest, review-draft (17 Modules), resolved CUS, PRN, APR, OPP; RFQ claimed, half done (uncommitted spec in clone `a`). Resume: `node neome-studio/evals/run.mjs replay ~/neome-eval-work/petrostar-crm-eI2wGH --from resolve-modules`, then `judge <work>`, `score <work>`, spot-check, commit result. On another limit stop: look at `git -C <work>/a log` for the last resolved Module, then the same resume command (the skill picks the next open Module).
- 2026-10-30 15:00: auto-resume script stopped by maintainer; resume by hand next session (command above).
- 2026-10-30: `petrostar-crm` case dropped by maintainer; only `anglo-gulf-crm` used for testing. Case folder and eval workspace deleted. Resolved.
