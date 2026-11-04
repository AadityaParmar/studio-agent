# Exploration Memory (TEMP) — 2026-11-04

Scratch notes for the multi-agent exploration. Disposable — delete after
`OPUS-RECHECK.md` (repo root) is consumed. Not part of the plugin.

## Goal

Find mistake areas to improve in the current working tree, feed a recheck doc
for Claude Opus with exact paths + findings.

## Context

- Branch: `template-bank-refine-2026-11-03-2`, 146 modified files (+2408/−2), uncommitted.
- The change: optional `## Execute` section added across APP/PAT/TMOD/TPL docs,
  engine guard `EXECUTE_GUARD` in `neome-studio/engine/template-bank.mjs:40`,
  new untracked `EXECUTE.md`, `execute-guide/`, eval result `2026-11-04-template-hr-small.md`.
- Guard line every Execute section must open with:
  `Only use this to apply this into a Studio Enterprise via MCP.`

## Delegate assignments (5 × GLM-5.3-Flash, parallel)

Concurrency limit hit at 5 parallel agents (effective limit ~3). Maintained ≤3 by
queueing; all five areas now DONE.

| # | Area | Scope | Status |
|---|------|-------|--------|
| A | engine-code | `engine/template-bank.mjs` + tests; run tests; guard edge cases | relaunching |
| B | diff-hunks | all 146 diff hunks; mechanical consistency of added Execute blocks | running |
| C | apps+templates | whole-file audit of `apps/*.md` (20) + `templates/*.md` (5) | DONE |
| D | patterns+tmods | whole-file audit of `patterns/*.md` (~90) + `template-modules/*.md` (55) | queued (slot-limited) |
| E | new-docs+prompts+evals | `EXECUTE.md`, `execute-guide/`, `prompts/cluster.md`, `README.md`, `evals/`, `docs/v2/` | running |

Note: apps folder holds 20 APP files, not 22.

## Findings (filled as reports land)

### A — engine-code
TESTS: 113 pass 0 fail (7 template-bank test files via `node --test`; main file alone 38/38).
- med | engine/markdown.mjs:26 | sections() does not skip fenced code blocks → a `## ` line inside a fence becomes a phantom section; a fenced `## Execute` example (e.g. quoted in a bank doc) would false-trigger the new guard error; verified empirically; contrast parseChangelog (template-bank.mjs:82-84) which does track fences | fix: track ``` fences in sections()
- low | engine/template-bank.mjs:235 | guard `startsWith` looser than docs' "first line, exactly" (extra text on same line passes) | fix: compare first body line `=== EXECUTE_GUARD` (same as B#2)
- low | engine/test/template-bank.test.mjs:145 | guard-test gaps: no "## Execution" must-not-trigger case, no empty-body case, no guard-with-extra-text case, no APP/TPL kind case
- low | engine/template-bank-match.mjs:26 | local ID regex accepts digit-first slugs (TMOD-01) that ANY_ID forbids → shape passes then "not in Template bank" (pre-existing) | fix: reuse ANY_ID slug shape
- low | engine/template-bank.mjs:230 | README says Execute is last section after Flowchart but validator never enforces placement | fix: check last key of `found` is "Execute" when present
Verified correct: body excludes heading; "Execution"/"Execute steps" don't false-match; guard applies to all 4 kinds; empty body errors; error message id-prefixed with exact expected line; no duplicated guard logic elsewhere; ANY_ID matches all ~142 filenames; cross-refs validated on disk (APP links via catalog slugs as documented).

### B — diff-hunks
142/142 bank entries modified, +2408/−2. Test runs: template-bank.test.mjs 38/38 pass,
readmes+digest 19/19 pass, `cli.mjs check` → "Template bank 142 entries OK".
- low | apps/APP-employee-directory.md:41 | APP Execute intro uses 3 phrasings across 20 APP files (9x/7x/4x); one variant never names the app slug | fix: pick one slug-naming phrasing
- low | engine/template-bank.mjs:235 | engine `startsWith(EXECUTE_GUARD)` allows extra text after guard on same line, but README/EXECUTE.md say "first line, exactly" (no current file does this) | fix: line-anchored check
Clean: guard byte-exact ×142, headings/placement/numbering uniform, 437 `apply <ID> Execute` body refs all resolve (engine does NOT validate body refs — unchecked surface, but currently clean), −2 deleted lines safe (cluster.md + README), prompt/test/engine string aligned.
Note: engine does not validate Execute-body ID references — validator gap worth telling Opus.

### C — apps+templates
25 files audited, 0 dangling refs, 0 section violations (all pass engine checks).
- med | apps/APP-amc-and-service-management.md:62 | Execute Asset step contradicts Sheets: Category/Location/Customer typed `pickText source=VarAssetCategory`, but Sheets refs AssetCategory/Location/Customer sheets; masters never built; step 3 builds CustomerSheet | fix: ref built sheets or `type=ref spreadsheet=CustomerSheet`
- med | apps/APP-field-visit-management.md:68 | Execute uses status vars never declared in Placeholders nor created by any step (VarPlanStatus); same: APP-inventory-and-stock-management.md:73 (VarGrnStatus), APP-manufacturing.md:74-75 (VarWoStatus, VarProdStatus) | fix: add `add kind=var kind=setOfText` step + list in Placeholders
- med | templates/TPL-software-product-company.md:33 | Links/Execute need customer+product sheets but TMOD-customer-master absent from modules.core AND modules.optional | fix: add to modules.optional or drop links/step
- low | APP-product-catalog.md:59 + 6 more apps (product-lifecycle:51, project-management:60, purchase-management:64, quality-control:55, quotation-and-order-flow:60, ticketing-and-task-management:63) | Execute placeholder role "Admin" but Sheets defines OrganizationAdmin | fix: rename
- low | apps/APP-crm.md:28 | Sheets omits Contact sheet that Gives/Workflows/Execute rely on (ContactSheet) | fix: add bullet
- low | apps/APP-knowledge-library.md:41, APP-field-visit-management.md:47 | Flowchart node labels truncated mid-word ("...set to Pub", "...km worked o")
- low | apps/APP-field-service.md:27 | ResolutionHours computed in Gives+Execute but missing from Sheets field lists
- low | 8 apps' Gaps line says "per client" — glossary says Enterprise | fix: reword
Impact: findings 1-3 would mislead an MCP apply agent; none break npm test.

### D — patterns+tmods
DEEP-READ: 14 PAT + 12 TMOD (largest-diff 6+6, smallest 4+4, random 4+2) + 5 dependency cross-checks.
Execute steps use real guide kinds/props/node names, sensible create order; TMOD front-matter pattern lists match steps; no silent undeclared pattern deps in sample.
- HIGH | template-modules/TMOD-purchase-orders.md:76 | step updates goods-inward/quality-check sheets; Needs first omits both | fix: add TMOD-goods-inward + TMOD-quality-check, or scope step
- HIGH | template-modules/TMOD-asset-assignment.md:59 | Needs first says asset sheet from TMOD-customer-master — verified none there (only Customer/State/City/Product) | fix: split attribution (TMOD-asset-allocation or vehicle app)
- med | template-modules/TMOD-employee-master.md:68 | "Needs first: none" but step 7 inserts into TMOD-leave register; circular | fix: state TMOD-leave need + ordering
- med | template-modules/TMOD-customer-master.md:61 | ProductSheet source unnamed in Needs first | fix: name TMOD-master-data or TMOD-product-catalog
- med | template-modules/TMOD-master-data.md:68 vs TMOD-product-catalog.md:64 | two divergent ProductSheet builds, will drift | fix: product-catalog owns, master-data refs
- med | template-modules/TMOD-approval-requests.md:71 | cites PAT-insert-row-in-other-sheet but builds a different node chain (vs that pattern's Execute and PAT-multi-level-approval.md:59) | fix: cite multi-level-approval or add iterate variant
- med | patterns/PAT-device-location-trail.md:63 | daily-rollup: single rowInsert inside point-iterate → 1 row total, not per-person (line 28 promises per-person) | fix: restructure iterate
- med | patterns/PAT-multi-level-approval.md:53 | Needs first omits 3 patterns its Execute applies (insert-row-in-other-sheet, forward-row, message-on-event) | fix: add
- low | template-modules/TMOD-leave.md:80 | "one register row per employee" vs per-employee-per-type balance | fix wording
- low | template-modules/TMOD-purchase-orders.md:83 | "client" banned term (GLOSSARY) | fix per Enterprise
- low | patterns/PAT-approval-by-status.md:88 | Line-wise variant grid `Lines` undefined in Placeholders | fix: add
- low | patterns/PAT-line-items-grid-with-totals.md:72 | host form missing from Placeholders; no `parent=` on steps | fix: add
Theme: TMOD `Needs first` attribution hygiene is the blind spot of the scripted checks.

### E — new-docs+prompts+evals
Execute feature tightly consistent end-to-end (guard string matches across engine/EXECUTE.md/README/cluster.md/142 files; guide MCP tool names all real per CLAUDE.md; eval result format-correct, verdict backed by fixture golden).
- med | maintainer/template-bank/prompts/cluster.md:16 | read list omits `apps/` while prompt says to enhance APP- entries (pre-existing at HEAD) | fix: add apps/
- med | docs/v2/decisions.md:5 | links to docs/v2/history/* which doesn't exist yet | fix: create history/ (move from .scratch/template-bank/) or retarget links
- med | docs/v2/build.md:35 | broken link: no docs/v2/README.md; evals README lives at neome-studio/evals/README.md | fix: retarget
- med | docs/v2/build.md:11 | record omits App-baseline slices S9–S11 (commits 4f64d4c, 2f29375, 594c786); counts stale (113 vs 142 entries incl. 20 APP) | fix: add slices, refresh counts
- med | docs/v2/decisions.md:32 | D49/D51 describe bank format without kind:app / APP- IDs / ## Execute — contradicts README + engine KINDS | fix: add App-baseline decision
- low | execute-guide/forms-layouts.md:31 + workflows.md:157 | stale cross-ref "(logic.md)" — actual file is logic-sheets.md | fix: rename refs
- low | reference/template-bank/README.md:61 | "Left out" wording conflicts with EXECUTE.md:53 (which says keep section with guard + one-line why; engine accepts both) | fix: reword README to match EXECUTE.md
- low | evals/results/2026-11-04-template-hr-small.md | untracked though change it judged is committed (5e66fda), against eval.md:34 commit rule; spot-check box unticked | fix: git add with next change
Also: .scratch/template-bank-execute/ = 3 files byte-identical to shipped execute-guide/ — safe to delete.

## Cross-cutting observations

- Engine guard uses `found.get("Execute").trim().startsWith(EXECUTE_GUARD)` —
  check blank-line/whitespace/CJK-case edge behavior and test coverage. (A to confirm)
