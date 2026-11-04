# Opus Recheck — Template Bank Refine (2026-11-04)

Verification brief for Claude Opus. Written from a 5-agent GLM-5.3-Flash
exploration; raw notes: `.scratch/explore-2026-11-04/MEMORY.md`.
Tally: 35 findings — 2 high, 15 medium, 18 low. All verified by the auditing agent
reading/running the code or files; none self-confirmed by a second pass — that's your job.

Repo: `/Users/aditya/Documents/neome/studio agent` (paths below are repo-relative).
Branch: `template-bank-refine-2026-11-03-2`. Working tree: 146 modified files
(+2408/−2, uncommitted) + untracked `EXECUTE.md`, `execute-guide/`, eval result,
`docs/v2/`. The change adds an optional `## Execute` section (MCP build steps) to
all 142 bank entries, an engine guard, and glue docs.

Your job: verify the findings below are real, reject the false ones, and settle
the judgment calls at the end. Each finding lists how to verify it.

## Already verified clean — don't redo

- Engine tests: 113 pass / 0 fail (7 template-bank test files, `node --test`).
- `cli.mjs check` → "Template bank 142 entries OK".
- Guard line byte-exact in all 142 files; `## Execute` placed last, after Flowchart,
  in every file; step numbering contiguous; `Placeholders:` / `Needs first:` / `Gaps:` present.
- 0 dangling ID references across the whole bank, including all 437 `apply <ID> Execute`
  refs inside Execute bodies (scripted; the engine itself does NOT check body refs —
  see validator-gap note).
- `execute-guide/` names only real MCP tools (`list`/`schema`/`add`/`set`/`remove`/
  `validate`/`describe`/`diff_enterprise`/`deploy_enterprise` per `CLAUDE.md`).
- Eval result `neome-studio/evals/results/2026-11-04-template-hr-small.md` is
  format-correct; its single failure (A14, dontKnow 1 > max 0) is backed by the
  fixture golden; fix already committed in 5e66fda.
- `.scratch/template-bank-execute/` = 3 files byte-identical to shipped
  `execute-guide/` — safe to delete, nothing forgotten there.

## High findings (2) — verify first

**H1. Execute step reads sheets from modules its Needs first omits**
`neome-studio/reference/template-bank/template-modules/TMOD-purchase-orders.md:76`
Step applies PAT-update-linked-rows with `eventSsUpdateAfter` on goods inward /
quality check sheets, but line 68 "Needs first: Vendor and Material sheets
(TMOD-master-data)" omits both sources.
Fix: add TMOD-goods-inward + TMOD-quality-check to Needs first, or mark step 7
"only if those modules are in the Enterprise".

**H2. Needs first attributes an asset sheet to a module that has none**
`neome-studio/reference/template-bank/template-modules/TMOD-asset-assignment.md:59`
Says Customer and Asset sheets both come from TMOD-customer-master; verified
customer-master builds only CustomerSheet/StateSheet/CitySheet/ProductSheet.
Fix: Customer sheet ← TMOD-customer-master; Asset sheet ← TMOD-asset-allocation
or the vehicle-and-driver-management App sheet.

## Medium findings (15) — verify second

**M1. Execute step contradicts the file's own Sheets section**
`neome-studio/reference/template-bank/apps/APP-amc-and-service-management.md:62`
Category/Location/Customer typed `pickText source=VarAssetCategory`, but Sheets refs
AssetCategory/Location/Customer sheets; those masters are never built; step 3 builds
a CustomerSheet that the Asset step doesn't use.
Verify: read the file end to end. Fix: point Category/Location at built sheets, make
Customer `type=ref spreadsheet=CustomerSheet`.

**M2. Execute uses status vars never declared or created**
`apps/APP-field-visit-management.md:68` (VarPlanStatus), `apps/APP-inventory-and-stock-management.md:73` (VarGrnStatus), `apps/APP-manufacturing.md:74-75` (VarWoStatus, VarProdStatus).
No `add kind=var` step exists; vars absent from each file's Placeholders line.
Verify: grep each file for the var and for `kind=var`. Fix: add a var step + Placeholders entry.

**M3. Template links/Execute need modules it never offers**
`neome-studio/reference/template-bank/templates/TPL-software-product-company.md:33`
"Tickets ref the customer list" + Execute says apply TMOD-customer-master first —
but it's in neither modules.core nor modules.optional.
Verify: read modules block vs Execute. Fix: add to modules.optional or drop the dependency.

**M4. Cluster prompt never lets the model read APP baselines**
`neome-studio/maintainer/template-bank/prompts/cluster.md:16` — read list is
`patterns/, template-modules/, templates/ and CHANGELOG.md`; omits `apps/` while the
same prompt says to enhance existing `APP-` entries. Pre-existing at HEAD, not from this diff.
Verify: read the prompt + diff. Fix: add `apps/` to the list.

**M5. docs/v2 links to history that doesn't exist**
`docs/v2/decisions.md:5` → `history/map.md`, `history/spec.md`, `history/issues/01…11`
— `docs/v2/history/` not created yet (README says "later").
Verify: `ls docs/v2/`. Fix: move history from `.scratch/template-bank/` or retarget links.

**M6. docs/v2 broken link to nonexistent README**
`docs/v2/build.md:35` → `[README.md](README.md#evals)`; no `docs/v2/README.md` exists;
evals README is `neome-studio/evals/README.md`.
Verify: ls + click the path. Fix: retarget.

**M7. docs/v2 record omits the App-baseline work**
`docs/v2/build.md:11` — slice table stops at slice 8; slices S9–S11 (commits 4f64d4c,
2f29375, 594c786) added the `app` kind, `apps/`, NA- codes; counts stale (113 vs 142).
Verify: `git log --oneline` + read the table. Fix: add slices, refresh counts.

**M8. Bank-format decisions predate the app kind**
`docs/v2/decisions.md:32` — D49/D51 say IDs `PAT-`/`TMOD-`/`TPL-` and 3 folders; no
`kind: app`, no `APP-`, no `## Execute` — contradicts `reference/template-bank/README.md` and engine KINDS.
Verify: read D49/D51 vs README. Fix: add an App-baseline decision or amend D49/D51.

**M9. Markdown section parser is fence-blind (engine)**
`neome-studio/engine/markdown.mjs:26` — `sections()` doesn't skip fenced code blocks;
a `## ` line inside a fence becomes a phantom section. Verified:
`sections("# Doc\n\n## How\n\n```md\n## Execute\n\njunk\n```\n", 2)` → `["How","Execute"]`.
The new Execute guard makes this reachable: a bank doc quoting a fenced `## Execute`
example would false-fail. `parseChangelog` (template-bank.mjs:82-84) already tracks fences.
Verify: run the one-liner above in node. Fix: track ``` fences in `sections()`.

**M10. "Needs first: none" contradicts its own step; circular with TMOD-leave**
`template-modules/TMOD-employee-master.md:68` — step 7 inserts into TMOD-leave's
register sheet, while TMOD-leave lists employee-master as a need.
Fix: Needs first: TMOD-leave (register sheet) + state which Execute runs first.

**M11. Product sheet source unnamed**
`template-modules/TMOD-customer-master.md:61` — Placeholders has ProductSheet;
Needs first says only "Product sheet for prices" with no TMOD id.
Fix: name the source (TMOD-master-data or TMOD-product-catalog).

**M12. Two TMODs build divergent ProductSheets that will drift**
`template-modules/TMOD-master-data.md:68` (Code, Name, Price) vs
`template-modules/TMOD-product-catalog.md:64` (CostPrice, Price, images, history).
Fix: make TMOD-product-catalog the product-sheet owner; master-data references it.

**M13. Step recipe diverges from the pattern it cites**
`template-modules/TMOD-approval-requests.md:71` — cites PAT-insert-row-in-other-sheet
but builds a `branchIterateSpreadsheet` chain, while that pattern's Execute builds
branchIfElse+paramUpdate+rowInsert; PAT-multi-level-approval.md:59 has the matching
matrix recipe for the same log-row flow.
Fix: cite PAT-multi-level-approval, or add an iterate variant to the cited pattern.

**M14. Daily-rollup steps cannot produce the promised output**
`patterns/PAT-device-location-trail.md:63` — one `rowInsert` inside an iterate over
all of today's points yields one row total, not "one row per person" (line 28).
Fix: iterate persons or partition points per person; extend the Gaps line.

**M15. Needs first omits the three patterns its Execute applies**
`patterns/PAT-multi-level-approval.md:53` — lines 59/61 apply
PAT-insert-row-in-other-sheet, PAT-forward-row, PAT-message-on-event.
Fix: add all three to Needs first.

## Low findings (14)

| # | Path:line | What | Fix |
|---|-----------|------|-----|
| L1 | `apps/APP-product-catalog.md:59` + product-lifecycle:51, project-management:60, purchase-management:64, quality-control:55, quotation-and-order-flow:60, ticketing-and-task-management:63 | Execute placeholder role "Admin" but Sheets defines OrganizationAdmin | rename |
| L2 | `apps/APP-crm.md:28` | Sheets omits Contact sheet that Gives/Workflows/Execute (ContactSheet) rely on | add bullet |
| L3 | `apps/APP-knowledge-library.md:41` | Flowchart label truncated mid-word ("…set to Pub") | complete |
| L4 | `apps/APP-field-visit-management.md:47` | Flowchart label truncated ("…km worked o") | complete |
| L5 | `apps/APP-field-service.md:27` | ResolutionHours computed in Gives+Execute but not in Sheets field lists | add field |
| L6 | 8 apps' Gaps lines (employee-directory:69, field-service:77, field-visit:76, gate-pass:68, inventory:80, lead-management:75, manufacturing:80, knowledge-library:67) | "per client" vs glossary term Enterprise | reword |
| L7 | `apps/APP-employee-directory.md:41` + 19 other APP files | Execute intro has 3 phrasings across 20 APPs; one variant never names the app slug | pick one slug-naming phrasing |
| L8 | `engine/template-bank.mjs:235` | guard `startsWith` accepts extra text after the guard on the same line; README/EXECUTE.md say "first line, exactly" (no current file does this) | compare first body line `=== EXECUTE_GUARD`, or loosen docs |
| L9 | `engine/test/template-bank.test.mjs:145` | guard-test gaps: no "## Execution" must-not-trigger case, no empty-body case, no guard-with-extra-text case, no APP/TPL case | add cases |
| L10 | `engine/template-bank-match.mjs:26` | local ID regex accepts digit-first slugs (`TMOD-01`) that ANY_ID forbids → shape passes then "not in Template bank" (pre-existing) | reuse ANY_ID slug shape |
| L11 | `engine/template-bank.mjs:230` | README says Execute is the last section; validator never enforces placement | check last section is Execute when present |
| L12 | `execute-guide/forms-layouts.md:31`, `workflows.md:157` | stale cross-ref `(logic.md)` — actual file is `logic-sheets.md` | rename refs |
| L13 | `reference/template-bank/README.md:61` | "Left out" wording conflicts with `EXECUTE.md:53` (keep section with guard + one-line why); engine accepts both; a maintainer following README alone omits the guard line | reword README to match EXECUTE.md |
| L14 | `evals/results/2026-11-04-template-hr-small.md` | untracked although the change it judged is committed (5e66fda), against eval.md:34 commit rule; spot-check box unticked | `git add` with next judged change |
| L15 | `template-modules/TMOD-leave.md:80` | fan-out says "one register row per employee" but balance is per employee per leave type (register carries LeaveType) | reword |
| L16 | `template-modules/TMOD-purchase-orders.md:83` | "tax rule per client" — "Client" banned for Enterprise per GLOSSARY.md | "per Enterprise" |
| L17 | `patterns/PAT-approval-by-status.md:88` | Line-wise variant uses grid `Lines` that no step defines and Placeholders omits | add to Placeholders or Needs first |
| L18 | `patterns/PAT-line-items-grid-with-totals.md:72` | host form missing from Placeholders; grid + summary added without `parent=` unlike sibling patterns | add host form + `parent=` |

## Validator gap worth a decision

The engine validates section sets and heading guard, but not ID references inside
Execute bodies (the 437 `apply <ID> Execute` refs are clean only because a scripted
pass checked them). Opus: decide whether `checkBank` should validate body refs —
the bank is at 142 entries and growing; manual checks won't scale.

## Judgment calls for Opus

1. L8: exact-line enforcement vs loosening the docs (pick one; tests in L9 follow).
2. L11: enforce placement in engine, or drop "last section" from README.
3. M5: create `docs/v2/history/` now (move from `.scratch/template-bank/`) vs retarget links.
4. E-docs wording: `EXECUTE.md` vs README L13 discrepancy — which is the contract?
5. `.scratch/template-bank-execute/` — confirm deletable, then delete.
6. ProductSheet ownership: make TMOD-product-catalog the owner, master-data references it (M12).

## Patterns+tmods semantic audit (the 2 high + 6 of the mediums above)

Deep-read: 14 PAT + 12 TMOD (largest-diff 6+6, smallest 4+4, random 4+2) plus 5
dependency cross-checks. All sampled Execute sections use real guide kinds/props/
node names and a sensible create order (forms → sheets → logic → actions → group →
validate); every TMOD delegates to pattern Executes, front-matter `patterns` lists
match the steps; no silent undeclared pattern deps inside the sample.

The weak spot the scripted checks cannot see is cross-module hygiene in TMOD
`Needs first` lines: unnamed or mis-attributed sheet sources (H1, H2, M10, M11),
one duplicated resource with divergent shape (M12), one divergent duplicate recipe
(M13). Opus: sample a few TMODs beyond this set specifically for Needs-first
attribution — this is where drift lives.
