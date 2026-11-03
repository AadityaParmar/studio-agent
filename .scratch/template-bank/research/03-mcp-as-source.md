# 03 - MCP as Build source (research)

Date: 2026-11-03. Read-only calls only (status, list_enterprises, list, describe). Sampled ENT-A (smallest-looking of 5).

## 1. list_enterprises
- 5 enterprises, loadFailures 0. ~1.1k chars.
- Fields per row: entId, name, about (optional), isDraft, everDeployed, editLock, errorCount, active.
- No counts, no size. Names can repeat (2 rows same name) -> use entId.

## 2. ENT-A (17 forms, 11 sheets, 36 actions, 56 vars, 8 workflows, 13 reports, 7 roles)

`describe kind=ent` (~0.6k chars): name, timeZone, date format, and counts per kind (roleCount, groupCount, moduleCount, formCount, spreadsheetCount, reportCount, actionCount, layoutUserCount, varCount, pluginCount, deeplinkCount, driveSheetCount, translationCount, workflowCount). Good manifest / size probe.

`list kind=X` returns flat array of {id, name[, type|kind]}. No detail.
| list | items | approx chars |
|---|---|---|
| form | 17 | 1.0k |
| spreadsheet | 11 | 0.6k |
| workflow | 8 | 0.5k |
| action | 36 | 3.0k (has kind: rowInsert, spreadsheetEditor, report, ...) |
| role | 7 | 0.4k |
| field (1 form, 37 fields) | 37 | 3.5k (has type) |
| formLayout (1 form) | 6 | 0.5k (has type) |
| node (1 workflow) | 2 | 0.3k (has kind) |

Parent-scoped kinds need parent: field, composite, formEvent, formEventAction, formEventCondition, formFormula, formLayout, gridLayout (parent form); spreadsheetLayout (parent sheet); node (parent workflow).

`describe` is SHALLOW. Samples:
- form (Form103, 37 fields): ~0.6k chars. Only permissionMatrix, counts (compositeCount 6, fieldCount 37, formFormulaCount 15, formLayoutCount 6, gridLayoutCount 3, formEventCount 0), default layouts, comment roles. NO fields, NO composites inline. Fields live under separate list/describe.
- spreadsheet (Sheet103): ~0.8k chars. Has form ref, alias, role lists (insert/read/update/remove/clear/audit), searchables, queryables, layout count + default layout. Layouts need separate calls.
- workflow (Diagram1, 2 nodes): ~0.7k chars. edgeMap inline (from/to node), viewport, nodeCount. Nodes via list node + describe node.
- field (pickText): ~0.2k chars. Only type-specific props (source=var name). Small.
- node (eventChat): ~0.25k chars. Just point (x,y) + variant. Node config sparse/empty in sample.

Describe returns: kind, variant, id, name, label, description, properties. `schema kind=X [variant]` gives JSON Schema of properties (add/set shape); static docs, not Build data.

## 3. Whole-enterprise export
- None. Tools: list, describe, schema, add, set, remove, validate, diff_enterprise, status (+ list_enterprises, switch/revert/deploy, deploy_status). diff_enterprise = draft vs deployed delta, not an export (not called; may be useful for change detection).
- Full structure = tree walk: 1 ent describe + ~14 top-level lists + per form (describe + list field/composite/formLayout/gridLayout/formEvent/formFormula/... ~7 lists) + per field/composite/layout/formula describe + per sheet (describe + layouts) + per workflow (describe + nodes) + per var/action/report/role/group describe.
- Estimate ENT-A: ~800-1000 calls. Rough: 17 forms x ~25 fields avg = ~400 field describes; + composites, layouts, formulas (Form103 alone: 6 composites, 6 layouts, 3 grid layouts, 15 formulas = 30 more); + 56 vars, 36 actions, 13 reports, 11 sheets + their layouts, 8 workflows + nodes.
- Chars: ~0.2-0.8k per describe -> ~250-400k chars total (~80-120k tokens), mostly overhead of tiny responses. Number is an estimate, not measured end to end.
- Selective use cheap: one form shape = 1 list field (~3.5k) + describes only for fields wanted.

## 4. Verdict: COMPLEMENT, not replacement

Pros
- Live: reflects current draft, no manual export step.
- Read-only safe if only list/describe/schema used.
- Per-call output small; good for targeted lookups (field names/types, role lists, sheet perms, counts).
- list_enterprises + describe ent = cheap catalog/size probe.
- schema = authoritative property shape per kind/variant (useful to read raw JSON).
- Server-side validation (errorCount) and diff vs deployed.

Cons
- No bulk export: ~1000 calls for one mid-size Build. Too chatty to snapshot into a template bank.
- Describe drops depth: forms show counts not structure; need many follow-up calls. Possibly lossy vs raw JSON (unverified: not all kinds diffed against raw).
- Needs live access + API key; not reproducible offline or in git; state changes under you (draft vs deployed, editLock true on all 5).
- Same-name enterprises -> must use entId.
- Not checked: rate limits (none hit in ~20 calls), complex node/action/var describe size, describe of formula/event content.

Recommendation
- Keep raw JSON as the stored source of truth for the template bank.
- Use MCP to: pick/verify a Build (counts, list names), spot-check fields/permissions, read schema, check drift vs deployed.
- Open question for a follow-up: ask platform team for an export/get_enterprise call (single JSON dump). That would flip verdict to "replacement".
