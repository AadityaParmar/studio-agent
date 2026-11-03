# Template matching evals

Type: grilling (HITL)
Status: resolved
Blocked by: 08

## Question

Which Eval cases guard Template bank use from Skill integration: ingest match (right `template:` / `templateModule:` or `none`), review-draft missing-Module suggestion, grill-module Template bank tier (usual need asked, never a Requirement without Enterprise yes), neome-mapping mismatch → Open Item, no IDs in client-facing views. New Eval case(s) or extend existing? Fixture: a sample Template bank entry set vs real one. What fails the gate.


## Answer

Locked with user (2026-11-03).

- **Case:** new Eval case `template-hr-small` (made-up small HR firm). tiny-synthetic and anglo-gulf-crm untouched (baselines kept).
- **Fixture:** case ships own `template-bank/`; `prepare` swaps it into clones' `reference/template-bank/`. Real Template bank never used by evals. `run.mjs check` runs the `npm test` bank checks on the fixture.
- **Fixture entries:** `TPL-hr-small` (core Employee master, Attendance, Leave; optional Expenses), decoy `TPL-sales-crm`, `TMOD-leave`, `TMOD-expenses`, `TMOD-attendance`, `TMOD-employee-master`, `PAT-approval-by-status`.
- **Inputs:** Leave, Expenses, Visitor log (no match).
- **Replay (6 steps):** ingest → review-draft → resolve-module Leave (live) → resolve-module Expenses (from Inputs) → build-brd → questionnaire. No release / Sign-off.
- **Traps:** Visitor log → `templateModule: none`. review-draft suggests Employee master (Consultant yes → Module, left open) and Attendance (no → dropped). `TMOD-leave` Delivery hint `standard` vs Inputs needing payroll link → mismatch Open Item, owner Neomenta. Leave usual needs: yes → Requirement; no → forbidden; Don't know → Open Item. No merge/split trap.
- **New golden field `forbidden`:** statements that must not become Requirements; judge matches by meaning. New hard gate `forbidden`, max 0 (Thresholds row). Today a refused usual need slips through as a "proposed" extra.
- **New mechanic type `absent`:** regex must not match in paths. Used on `brd/**`, `prototypes/**`, `questionnaires/**` for `TPL-|TMOD-|PAT-|NB-\d|seen in`.
- **Mechanics:** `template: TPL-hr-small` in `_agent/map.md`; `templateModule: TMOD-leave` on Leave; `none` on Visitor log; Employee master Module exists, no Attendance Module; mismatch `oi` (Delivery, Neomenta); `absent` as above. Soft metrics: all four. New case → no regression baseline until first `main` result.
- **"ID gone" warning:** `npm test` unit test only, not eval.
- **Gate:** skill text change to ingest / review-draft / grill-module / neome-mapping → `npm test` + `run --all`. Refine → `npm test` only (bank checks + fixture `check`); `run --all` only if refine tool changes bank format. Amends Bank refine skill regression guard.
