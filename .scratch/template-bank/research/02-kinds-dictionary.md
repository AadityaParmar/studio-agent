# 02 — Kinds dictionary from studio-ai-docs: findings

Source: `docs/studio-ai-docs/{forms,layouts,logic,spreadsheets-reports-actions,workflows}.md` (+ README).
Extractor: `research/extract-kinds.mjs` → `research/kinds.json` (shape `{kind: [variants...]}`).
Parsing rule: `## \`kind\`` opens a top-level kind; `### \`kind / variant\`` opens a variant.
README "Resource kinds" lists 24 kinds; headings yield the same 24 — exact match.

## Counts per kind (24 kinds, 297 variants)

| kind | file | variants | variant axis |
|---|---|---|---|
| form | forms.md | 0 | — |
| composite | forms.md | 3 | type: grid, section, spreadsheetRef |
| field | forms.md | 84 | type (bool…refContact) |
| formLayout | layouts.md | 4 | type: content, editor, report, template |
| gridLayout | layouts.md | 11 | kind: card…xyChartScatterPlot |
| spreadsheetLayout | layouts.md | 11 | same 11 kinds as gridLayout |
| layoutUser | layouts.md | 0 | kind enum hierarchy\|tree (no ### sections) |
| var | logic.md | 49 | kind (bool…tree) |
| formFormula | logic.md | 0 | — |
| formEvent | logic.md | 0 | kind enum (onChange etc., no ### sections) |
| formEventAction | logic.md | 0 | — |
| formEventCondition | logic.md | 0 | — |
| spreadsheet | spreadsheets-reports-actions.md | 0 | — |
| report | spreadsheets-reports-actions.md | 5 | kind: composite, mapper, plugin, query, spreadsheet |
| action | spreadsheets-reports-actions.md | 9 | kind: actionsSet…user |
| group | spreadsheets-reports-actions.md | 0 | — |
| role | spreadsheets-reports-actions.md | 0 | — |
| module | spreadsheets-reports-actions.md | 0 | — |
| plugin | spreadsheets-reports-actions.md | 0 | — |
| deeplink | spreadsheets-reports-actions.md | 4 | kind: report, spreadsheetEditor, spreadsheetInsert, spreadsheetRow |
| driveSheet | spreadsheets-reports-actions.md | 0 | — |
| translation | spreadsheets-reports-actions.md | 0 | — |
| workflow | workflows.md | 0 | — |
| node | workflows.md | 117 | kind (acquireLock…wait) |

## Digest-relevant properties per kind

Parent link = "Needs parent X" in the section intro. Refs = properties typed "Resource name" or
doc'd as pointing at another resource. Polymorphic kinds (composite/field/formLayout/gridLayout/
spreadsheetLayout/var/report/action/deeplink/node) hide variant properties from the open schema —
digest must call schema again per variant.

| kind | parent | refs / links a digest needs |
|---|---|---|
| form | — | mobileDefaultLayout/asideDefaultLayout (formLayout), chatLabelField/Pattern.arg (var), details.modules (module), permissionMatrix + actionPermissionMap (roles, actions) |
| composite | form | fieldMap (field ids), disabledField/disabledRoles (field, role), spreadsheetRef→spreadsheet (variant) |
| field | form | composite (comp name); type=ref/refSet: spreadsheet + layoutSpreadsheet (list\|card); pickUser/refUser: roleIdDataSource [role]; pickText: source=setOfText var; pickReportRow→report; pickGridRow→grid |
| formLayout | form | content: fields/gridLayouts/formLayouts in start/flexCenter/end; editor: layoutCompositeMap (composite→gridLayout); nested sublayouts rootLayout=false referenced from root formLayouts |
| gridLayout | form | composite=<grid name\|id> when >1 grid; bgColorField/toolTipField (field); variants hold column/filter config |
| spreadsheetLayout | spreadsheet | same shape as gridLayout; ref layouts must be list\|card (table rejected) |
| layoutUser | — (global) | includeRoles/excludeRoles (role); consumed by action kind=user |
| var | — (global) | details.modules (module); condition kind refs fields; mapping kind maps sheet form→output form |
| formFormula | form | assignToField (field, Grid.Field qualified); formula.value ${f:Field}/${f:Grid.Field}; condition.cond (formEventCondition) |
| formEvent | form | actions[]: action→formEventAction, condition→formEventCondition (+negate); eventComps (fields/comps); kind enum of 5 events |
| formEventAction | form | comps (target fields/comps), mapping/outputMapping (mapping var), action (enterprise action, kind=executeAction), formula (kind=executeFormula), source ArgBinder (var/field) |
| formEventCondition | form | statement.lhs (field name), rhs ArgBinder; andOr + map (inline nested conditions, not separate resources) |
| spreadsheet | — (links to form) | **form (required)**; insert/update/remove/read/clear/bypass/audit Roles (role); queryables/searchables/uniqueIndexs/historys (field); readRole (setOfUser var); asideDefaultLayout (spreadsheetLayout) |
| report | — (global) | **outputForm (required)**, inputForm; variant spreadsheet: fromSpreadsheet + outputFormMapping (mapping var); action kind=report binds report + outputFormContentLayout |
| action | — (global) | variant rowInsert/rowUpdate/spreadsheetEditor: spreadsheet (+layoutSpreadsheet); variant report: report resource; variant user: layoutUser; assigned to group via group.actionPermissionMap roles |
| group | — | actionPermissionMap (action→roles), defaultAction/pinnedActions (action), groupPermissions/chatPermissions (strings), details.modules |
| role | — | none (pure name/label/details) |
| module | — | none (pure name; referenced by details.modules everywhere) |
| plugin | — | pluginFormMap/pluginVarMap (form, var); pluginConfigForm (form); pluginBundle/pluginApiIdMap |
| deeplink | — | variant targets: report / spreadsheet+layout / spreadsheet; creationRoles/makeUserDefaultRoles (role); targetUserSpreadsheet/HandleField |
| driveSheet | — | **spreadsheet (required)**; roles/attachmentRoles (role) |
| translation | — | none (phrase + translationMap) |
| workflow | — | module; **nodeMap/edgeMap/noteMap/regionMap (required)** — edges carry node links, shape undocumented |
| node | workflow | parentRegion (region); kind enum of 117 node types; **no next/branch properties on the node itself** — variant branchIfElse/branchSwitchCase expose condition/option but NOT outgoing links |

## Doc gaps / oddities

1. **Node next/branch links are undocumented.** `workflow.edgeMap` is "Keyed as describe prints" with
   no property table; `node` variants have no `next`/`branch`/`cases` properties anywhere. A digest
   cannot reconstruct workflow topology from the docs — it must take edgeMap as an opaque map.
2. **Polymorphic double-fetch contract**: 9 kinds state the open schema omits variant properties
   ("call schema again with variant"). report variant=spreadsheet additionally hides `fromSpreadsheet`
   and `outputFormMapping` even from the variant hint on the open schema.
3. **No ### sections for some kind enums**: layoutUser (hierarchy|tree), formEvent (5 events),
   formEventAction (15 kinds), translation (text|paragraph) have enum-only kinds with no per-variant
   headings — kinds.json records them as 0-variant kinds.
4. **field has 84 variant headings vs an 84-value type enum** — extractor and enum agree; but
   `logCounter`/`logNumber`/`logDecimal` (log-* audit types) exist only as enum members, easy to miss.
5. **role/module/group are permission-bearing by reference**: permissions live on form/composite/
   spreadsheet/group (`permissionMatrix`, `actionPermissionMap`, `*Roles` arrays), not on role itself —
   a digest must invert these back-references.
6. **Name-collision conventions**: spreadsheet must NOT share the form's name (prefer `*Sheet`);
   refs always point at the *spreadsheet* name, never the form.
7. **README duplicates kind intros verbatim** (creation-order guidance like "create gridLayout
   first", "formEventAction/Condition before formEvent") — ordering constraints live in prose,
   not in the property tables, so a digest should mine the section intros too.
