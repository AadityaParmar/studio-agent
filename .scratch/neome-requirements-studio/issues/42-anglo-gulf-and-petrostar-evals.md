# 42 — `anglo-gulf-crm` + `petrostar-crm` eval cases

**What to build:** Two real-world Eval cases: `anglo-gulf-crm` full flow (golden 59 Requirements, 28 OIs) and `petrostar-crm` mapping only, with baseline results recorded. Spec: Testing Decisions.

**Blocked by:** 40 — Anonymised eval Inputs and golden docs; 41 — Eval runner + scorecard + `tiny-synthetic`

**Status:** ready-for-human

- [x] Each case: Inputs, answer key, golden JSON in BRD-data shape, README
- [x] `anglo-gulf-crm` runs full flow; `petrostar-crm` scores mapping only (new golden `score` field)
- [ ] Baseline scorecard committed; maintainer spot-checks ~10 matches

## Comments

- 2026-10-29: cases built, `run.mjs check` ok, `npm test` 353/353. Golden anglo-gulf = 56 Requirements (IMP-01..03 are plan phases, dropped), 28 OIs. Baseline run not done yet (LLM cost; needs maintainer go).
