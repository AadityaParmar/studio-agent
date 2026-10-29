# 26 — BRD release mode + change log

**What to build:** `--mode release --summary "..."` freezes the next integer BRD version (HTML + data snapshot) with a change log auto-diffed from the previous version, and warns on release gaps. Spec: Release and Sign-off rules, stories 121–123.

**Blocked by:** 24 — BRD process and status diagrams; 25 — Across all Modules + Implementation plan

**Status:** resolved

- [x] Next integer N; writes frozen `v<N>` data snapshot and HTML; may include in-progress Modules
- [x] Change log diff vs `v<N-1>`: Modules resolved/merged/renamed/needs-revisit; Requirements added/changed (fields listed, e.g. `QUO-06: priority Should→Must`)/withdrawn; OIs raised/closed with answer Source; plan and glossary diffed
- [x] "Changed" = statement, acceptance, priority, scope, delivery or withdrawn
- [x] Earlier entries copied forward; Consultant summary line stored
- [x] Completeness errors for GEN at release
- [x] Warnings: uncovered GEN topic; plan phase without weeks or still proposed; resolved Module not placed
- [x] Unsigned version shows empty signature boxes ready to print
- [x] Fixture: two releases → expected change-log entries

## Comments

- Done 2026-10-29. `build-brd <eng> --mode release --summary "..."` in `neome-studio/engine/build-brd.mjs`: N = highest `_agent/brd/versions/v<N>.json` + 1; writes `_agent/brd/versions/v<N>.json` + `brd/v<N>.html` (both or neither: diagrams drawn first), `status: draft-for-review`, in-progress Modules allowed. New `engine/brd/changelog.mjs` (diff `v<N-1>` vs new data). `engine/brd/validate.mjs`: `completeness(..., {release})` makes GEN gaps errors; new `releaseWarnings()`. Renderer: change log newest first, changes grouped; unsigned = empty Name / Role / Signature / Date lines in both boxes (`page.css` `.signline`). Schema: `changelogEntry.summary` now non-empty text, new `change` def `{group, kind, id, text, fields?}` (still 1.0.0, nothing released yet). Docs: `brd-data-schema.md` new "Release" section + warning classes `uncovered-topic`, `plan`; eyeball checklist line in `evals/README.md`. Tests `engine/test/brd-release.test.mjs` (18): two releases of `resolved` fixture with edits → exact change-log entries, copy-forward, warnings, GEN error, in-progress release, arg errors, unit diffs (merged / renamed / added Module, field-level, withdrawn / reinstated, plan, glossary). `npm test`: 138 pass.
- Small choices (my call; revisit if wrong):
  - `--summary` required for release (exit 2 if missing/blank); refused in other modes. Whitespace collapsed to one line.
  - Release does not touch live `brd-data.json` / `preview.html`. Refuses if `v<N>.json` or `v<N>.html` already exists (stray file = never overwrite).
  - v1 has `changes: []` (nothing to diff; summary carries it). Earlier entries copied verbatim from `v<N-1>.json`.
  - Module change kinds also include `added` (new Module since last version), not in the spec list, else new Modules would be silent. Renamed = new prefix whose `formerly` was a prefix in `v<N-1>`. Needs-revisit reason not shown (not in the data file).
  - Requirement "delivery" compared as effective Delivery (override, else Module mapping), so a Module Delivery change shows on each of its Requirements. Title-only change is not a change. Withdrawn → `withdrawn — <reason>` (+ any other field changes); un-withdrawn → `changed` with `reinstated`. Statement / acceptance show as `statement changed` (no wording diff). Text format `QUO-06: priority Should→Must`, raw enum values (`scope neome→open`).
  - OI: `raised — <question>`; `closed — <answer> [<answer Source>]`. Reopened OIs not logged (not in spec).
  - Plan diff: whole plan added/removed; phases by `id` (name, weeks, covers, Modules, proposed→`confirmed`); Not yet placed by text (OIs, Modules, proposed). Glossary by term (definition, avoid, proposed→`agreed`, disputed).
  - Warnings: topic uncovered = no live (non-withdrawn) GEN Requirement, no N/A, no listed OI. Phase "without weeks" = both weeks empty (one-sided weeks are deliberate, ticket 25). "Not placed" = resolved Module in no phase and not in Not yet placed. No `plan.md` = no plan warnings (plan optional).
  - GEN completeness at release = only "Requirement without acceptance" (the only GEN gap preview knows); topic coverage stays a warning per spec.
- Verified in headless Chrome: v1 page Versions view renders boxes, no console errors. Not verified: A4 print of the signature boxes on paper, change log readability with many changes, Safari/Firefox. Sign-off (ticket 27) must update the signed entry's `status` in its own snapshot; copy-forward takes entries as stored.
