# 25 — Across all Modules + Implementation plan in the BRD

**What to build:** Engagement-wide Requirements (`general.md`) and the optional Implementation plan (`plan.md`) flow into the BRD data file and render as the "Across all Modules" and "Implementation plan" sections. Spec: Engagement-wide Requirements, Implementation plan, stories 96–103.

**Blocked by:** 23 — BRD preview HTML page

**Status:** resolved

- [x] `general` parsed: Requirements with fixed topic tag and `GEN-NN` IDs, N/A topics with Source, OI refs (Module = `All`)
- [x] Across all Modules section grouped by topic; no Neome App mapping; not in fit table
- [x] `plan` parsed: phases (weekFrom/weekTo may be null) + Not yet placed; total weeks derived in summary when plan exists
- [x] Cross-ref: plan Module prefixes (incl. `GEN`) and OI IDs exist; `weekFrom <= weekTo`
- [x] Plan shows no pricing and no calendar dates; sidebar entry only when plan exists
- [x] Fixtures for bad plan refs and `weekFrom > weekTo`

## Comments

- Done 2026-10-29. `build-brd` preview now reads `_agent/general.md` and `_agent/plan.md` (`engine/brd/read-engagement.mjs`), checks them (`engine/brd/validate.mjs`) and renders "Across all Modules" + "Implementation plan" (`engine/brd/render-html.mjs`, `page.css`). Fixture `resolved` gained `general.md` (GEN-01 access, GEN-02 migration, 4 N/A topics, OI-03 under Other) and `plan.md` (4 phases, one with no weeks, 1 Not yet placed); `in-progress` has neither (tests the missing-file path). New tests `engine/test/brd-general-plan.test.mjs` (33): data, 16 bad-input fixtures (bad plan Module/OI refs, `weekFrom > weekTo`, bad week, duplicate phase, GEN ID/OI/Source errors, N/A without Source, unknown topic, OI not `All`), page order/sidebar/summary/print/no pricing or dates. `brd-page.test.mjs` counts + order updated for the new fixture. Schema docs (`brd-data-schema.md`) + eyeball checklist (`evals/README.md`) updated. `npm test`: 120 pass.
- Markdown shapes (my call; skills in tickets 28/30/34 must write these, see `brd-data-schema.md`):
  - `general.md`: H2 per topic (`## Access` … `## Other`, bracket text ignored, `Localization` accepted). Under a topic: H3 Requirement blocks (same lines as Module Requirements), or `N/A: <reason> [Source]`, and/or `- OI-NN: gist` bullets. N/A + Requirements in one topic = parse error. Missing file = empty `general` (preview works any time); missing topic H2 = no error (coverage is ticket 26).
  - `plan.md`: phases table `ID | name | week from | week to | covers | Modules | Source` (row order = phase order) + Not yet placed table `what | OIs | Modules | Source`. Empty week = null; non-whole number = parse error. No `plan.md` = no `plan`, no section, no sidebar entry, no weeks metric.
- Schema changes (still `1.0.0`, nothing released yet): `general` now required (always written); `na[]` gains optional `reason` (so the BRD can say why a topic does not apply); `oiRefs[]` items are `{id, topic}` not bare IDs (topic needed for grouping and for ticket 26's per-topic coverage).
- Other small choices:
  - New error classes: `oi-module` (OI listed in `general.md` whose Module(s) lack `All`), `duplicate-phase`, `plan-weeks`. Plan bad prefix → `unknown-module`, bad OI → `missing-oi`. GEN IDs share the Engagement-wide uniqueness check with Module Requirements.
  - One-sided weeks allowed (`From week 5` / `Until week 3`); release warning for missing weeks is ticket 26.
  - GEN Requirement without acceptance = preview warning (release error is ticket 26).
  - Total weeks = highest `weekTo` (or `weekFrom`) across phases; `TBC` when none set. 5th summary metric "Weeks, indicative".
  - GEN Requirements count in summary totals, Proposed Must and scope counts; metric label becomes "Requirements in N Modules and across all" when any exist. Not in fit table, no mapping card, no progress bar in the sidebar.
  - Open `All` OIs not listed under any topic show in an "Other Open Items across all Modules" box at the end of the section. Register "Affects" now includes GEN Requirement IDs.
  - Plan Modules link to the Module view (`GEN` → Across all Modules); merged prefixes shown as plain text.
- Verified in headless Chrome: both views render, Must filter works on GEN cards, no console errors. Not verified: Safari/Firefox, long real plans, A4 print of the new sections (PDF generated, not inspected). Release warnings (uncovered topic, plan phase without weeks / still proposed, resolved Module unplaced) and GEN completeness errors are ticket 26.
