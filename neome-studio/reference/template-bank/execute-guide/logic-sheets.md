# MCP cheat sheet: logic + sheets kinds

Src: `docs/studio-ai-docs/` (live `schema`). Flow: `schema kind=X [variant=Y]` -> `add` -> `validate` -> fix till `ok=true`. Writes serial, pass `entId`. Names: Uppercase first + alphanumeric. `details` = `{}` or `{modules:[Mod]}` (deeplink/driveSheet/plugin: top-level `modules`).

## Create order (README)

1. `module`, `role`, `var` (option lists, durations; condition/mapping vars after their forms).
2. Per entity, parent -> child: `form` (name/details only) -> `composite type=section` -> non-ref fields -> `spreadsheet` (`form=` REQUIRED, name `*Sheet`) -> `spreadsheetLayout` (table for editor; list|card for refs) -> ref fields -> `formFormula` / `formEventAction` + `formEventCondition` -> `formEvent`.
3. Report: output form -> grid composite + fields -> `gridLayout` (same form) -> content `formLayout rootLayout=true` -> `var kind=mapping` -> `report` -> `action kind=report` -> `set group actionPermissionMap`.
4. `layoutUser` before `action kind=user`; `report` before `action`/`deeplink kind=report`; actions before group set. Then `validate`.

## `var`

Req all: `name`, `details`, `deploy` (`fixedOnDeploy` = constant, set value | `requiredOnDeploy` = value empty, set per Enterprise; always pass), `kind`. Run `schema kind=var variant=<kind>` first.

| kind | use | value shape |
|---|---|---|
| setOfText | option list for pickText/setOfText fields (`source=<var>`) | `value` = map keyed by option key, in order. `{"Out Of Stock":{}}` -> key `keyOutOfStock`, label from key. Keep key when relabeling (rows store key) |
| setOfNumber / setOfDay / setOfTime | lists | `value` REQUIRED: `{valueSet:[...]}` (number[] / day str[] / "HH:MM:SS"[]) |
| setOfDate | holidays | `{valueSet:[ISO UTC midnight]}` (not required) |
| setOfUser | user selector (approvers; sheet `readRole`) | `{node, sourceForm?}` |
| condition | bool rule (filters, workflows; `filterCondition.cond`) | `{node, sourceForm?, sourceGrid?, inputForm?}`; node = leaf statement or andOr+children. sourceForm if field/derived used; inputForm if input; sourceGrid = per-row |
| function | reusable JS fn | `{inputFuncArgMap:{<argName>:{...}}, outputKind: number\|text\|numberArray\|textArray, javascript:{value:"..."}}` |
| sequence | auto counter (invoice/ticket no.) | `{value:<start number>}` |
| mapOfText | key->text pairs (templates, labels) | `{map:{<key>:...}, sourceForm?}` ordered; missing key removes |
| tree | parent/child options (category/sub) | `value` REQUIRED: `{value:{map:{...}}}` |
| userSetting | per-user preference | `{userSettingOptionKind (REQ): text\|number\|decimal\|pickOne\|pickMany, optionDataSource:<setOfText> (REQ if pick*), defaultValue?, doNotShowOnUserSettings?, doNotShowValueToAdmin?}` |
| bool | flag | `{value:true}` |
| number / decimal | int / fraction | `{value:n}` |
| duration | timeouts, SLAs, loan days; spreadsheet read/invisibleAfterDuration | `{value:{unit: seconds\|minutes\|hours\|days\|weeks\|months\|quarters\|years, value:n}}` |
| text / paragraph / html | templates | `{value:"Hello ${name}", paramSet:["name"]}` ; `${}` never `{{}}` |
| date / dateTime | | one of `{value:<relative enum: now, startOfMonth, createdOn...>}` / `{customValue:ISO UTC}`; dateTime + `time:"HH:MM:SS"`. Date = local midnight as UTC |
| time | | `{value:"now"}` or `{customValue:"09:30:00"}` |
| email/currency/icon/timeZone/language/hyperlink | | `{value:"str"}` (hyperlink + `displayText`, `kind: general\|youtube`) |
| day/month/quarter/symbol/UI enums | | `value` = bare string (color `{value,shade}`) |

### var mapping
All wiring under `properties.value`, never top-level.
```
value: { fromForm: SheetForm, toForm: OutForm (REQ), toGrid?: Grid, fromGrid?: Grid,
  fieldMappingMap: { Title:{from:{kind:"field",value:{field:"Title"}},to:"Title"}, ... },
  gridMappingMap?: {...} }
```
- fromForm needed when any `from` binder is kind field/derived; else only constant/context/variable.
- section->grid: set `toGrid`. section->section (single record): omit toGrid. grid->grid: `gridMappingMap` entries carry own grids.
- fieldMappingMap may also hold `toKey`/`fromKey` (match keys), `emptyFieldVariant: ignoreEmptyField|overrideEmptyField`, `insertVariant: insertForced|skipEmptyKeyField|doNotInsert`, `updateVariant: updateForced|doNotUpdate`, `removeVariant: removeForced|doNotRemove`.
- Never `fieldMappingMap:{}`, never bare string entry. One entry per target field. Prefer same names both sides.

## `formFormula` (parent=form)
Req: `name`, `assignToField`, `formula`. Create after target field.
- `assignToField`: field name; `Grid.Field` if name repeats across grids.
- `formula.value`: JS; fields `${f:Field}`, grid `${f:Grid.Field}`, agg `SUM(${f:Grid.Field})`. Never bare names.
- `condition`: `{cond:<resource name>, negation:bool}` optional.

## `formEventAction` (parent=form)
Req: `name`, `kind`. kind: `blink|clear|click|disable|enable|executeAction|executeFormula|hidden|highlight|invisible|optional|required|reset|setValue|shake|visible`.
- `comps`: targets. `actionOn`: `component|field|layout|sendButton`. `layouts`, `groups`: opt scope.
- `setValue`: `source` ArgBinder `{argName, kind, value}` (see `schema kind=argBinder`).
- `executeFormula`: `formula:{value:"JS"}`. `executeAction`: `action=<enterprise action>`. Also `mapping`, `outputMapping` (mapping var names).
- NO condition here.

## `formEventCondition` (parent=form)
Req: `name`. Leaf: `statement:{lhs:<field>, operator, rhs?}`.
- operator: `hasChanged|hasNoValue|hasValue|equalTo|notEqualTo|greaterThan|lessThan|greaterThanOrEqualTo|lessThanOrEqualTo|contains`. hasValue/hasNoValue: omit rhs.
- rhs ArgBinder: `{"argName":"rhs","kind":"constant","value":{"type":"text","value":{"value":"Single"}}}`. kind = constant/field/variable/...; never mapOfText/condition/mapping/text.
- Composite: `andOr:bool` + `map:{<childName>:{...}}` inline (no separate resources) instead of statement.

## `formEvent` (parent=form)
Req: `name`, `kind`: `onChange|onInitForm|onSubmitForm|onClickButton|onInitAndOnChange`.
- `eventComps`: trigger fields (onChange/onInitAndOnChange/onClickButton; omit for onInitForm/onSubmitForm).
- `actions`: ordered `[{action:<formEventAction> (REQ), condition?:<formEventCondition>, negate?:bool}]`. No formula here.
- Show/hide pattern: Hide action (hidden, comps=[X]) + Show action (visible, comps=[X]) + condition IsY -> event `onInitAndOnChange eventComps=[Ctrl]` actions `[{action:HideX,condition:IsY},{action:ShowX,condition:IsY,negate:true}]`.

## `spreadsheet`
Req: `name` (`*Sheet`, not form name), `details`, `form` (existing, fields done).
- Rights (role name arrays): `insertRoles` (named roles ONLY, no `$Manager`-style derived), `updateRoles`, `removeRoles` (derived OK), `clearRoles` (bulk wipe; only if asked), `auditTrailFormRoles` (see audit trail; derived OK), `bypassDurationRoles`.
- `readRoles`: who sees row posted in a group (not general read). `readRole`: setOfUser var. Field visibility = form permissionMatrix.
- History: no on/off flag. `historys` = fields in audit summary line (full before/after always stored). View via `action kind=spreadsheetHistory`.
- Data: `queryables` (fields used in conditions; unique fields must be here), `searchables` (small), `uniqueIndexs` + `uniquenessMode: individual|combined`, `partitionMap:{<name>:{assignPartitionField:<text field>, formula}}` (one row per key, e.g. per day).
- Time locks: `readAfterDuration`, `invisibleAfterDuration` = duration var names.
- Forward: `userForwardRolePermissionMap:{Role:[Role]}`, `groupForwardRolePermissionMap:{Role:[Group]}`.
- Flags: `isMasterSheet`, `supportOffline`, `asideDefaultLayout`.

## `report`
Base req: `name`, `kind`, `details`, `outputForm`. Opt `inputForm` (filter form), `label`. Call `schema variant=<kind>` first (variant=spreadsheet mandatory; open schema omits fromSpreadsheet).

| kind | extra required | optional |
|---|---|---|
| spreadsheet | `fromSpreadsheet`, `outputFormMapping` (mapping var) | `filterCondition:{cond:<condition var>,negation}`, `orderByField`, `ascOrder`, `limit` |
| query | `neoQL:{value:"..."}` | `fromSpreadsheets[]` |
| mapper | `mappedReport`, `outputFormMapping` | `inputFormMapping`, `saveToSpreadsheet` |
| composite | `mergeReports[]` | |
| plugin | `pluginApi:{metaIdPlugin}`, `outputFormMapping` | `inputFormMapping` |

Multi-row -> grid on NEW output form (never on sheet form). Single record -> section.

## `action`
Base req: `name`, `kind`, `details`. Common opt: `label`, `icon`, `tooltip`, `aiInstructions`, `defaultValueMap`, colors, `increaseAsideWidth`. NO `groups` prop.

| kind | required | key optional |
|---|---|---|
| spreadsheetEditor | `spreadsheet` + `layoutSpreadsheet` (validate demands; table on same sheet) | `readOnly`, `filterCondition{cond,negation}`, `inputForm`, `bulkInsert/UpdateFields`, `bulkInsert/UpdateRoles`, `sendMessageToGroup`, `actionPermissionMap` |
| rowInsert | `spreadsheet` | `formEditorLayout`, `formRenderingModeKind: bottom\|dialog\|aside\|main`, `sendMessageToInbox`, `chatBubbleHeader{title,subTitle}` (REQ if sheet has partitionMap) |
| rowUpdate | `spreadsheet`, `layoutSpreadsheet` | `lookupField`, `filterCondition` |
| spreadsheetHistory | `spreadsheet` | |
| report | `report` (report name, never sheet/layout), `outputFormContentLayout` (root content layout on output form) | mobile/template layouts, `sendMessageToInbox` |
| actionsSet | `actions[]` (action names) | `renderingMode: grid\|list` |
| executeCallable | - | `workflowPointer:{autoDia,startNode}` or `automation` |
| uiUpdate | `updateKind: groupSwitcher` | `group` |
| user | - (create `layoutUser` first) | `layoutUser` (omit if web/mobile default set) |

## `group`
Req: `name`, `details`.
- `actionPermissionMap:{<ActionName>:{roles:[Role..]}}` roles REQUIRED each entry (`schema kind=actionPermission` for full entry). Set via `set kind=group`; also settable on form/composite. Then `describe` group to confirm.
- `pinnedActions[]`, `pinnedActionIdSetMobile[]`, `defaultAction`, `hideActionMenu`.
- Also `groupPermissions[]`, `chatPermissions[]`, `removeMessagePermissions[]`, `hideMembers`, `freeze*`. No `reports` prop: expose reports via `action kind=report` in actionPermissionMap.

## `role` / `module`
- role req `name`, `details`; opt `label`, `description`. No hierarchy/derived-role config.
- module req `name` only. Others link via `details.modules` / `modules`.

## `deeplink`
Base req: `name`, `kind`, `visibilityConstraint` (`enforceGlobalUserSignIn|enforceEnterpriseUserSignIn|makeAnEnterpriseUser|allowPublicSharing`), `creationRoles[]`, `expiry` (`onFirstClick|withinOneWeek|withinOneMonth|noExpiry`). Opt: `makeUserDefaultRoles`, `targetUser*`, `userFieldMap`, header bools, `modules`.

| kind | extra required | optional |
|---|---|---|
| report | `report`, `outputFormContentLayout` | mobile/template layouts |
| spreadsheetEditor | `spreadsheet` | `layoutSpreadsheet`, `mobileLayoutSpreadsheet` |
| spreadsheetInsert | `spreadsheet`, `successMessage:{arg?, argBinderMap?}` | `formEditorLayout`, `showRepeatButton`, `repeatButtonLabel`, `successDeeplink` |
| spreadsheetRow | `spreadsheet` | `formContentLayout`, `formTemplateLayout` |

## `driveSheet` / `translation` / `plugin`
- driveSheet req: `name`, `spreadsheet`, `partitionedData:bool`, `roles[]`. Opt `dataPartitionPeriod: daily|hourly|weekly|monthly|quarterly|yearly`, `dataRetentionDuration:{unit,value}`, `attachmentRoles`, `exportKindSet`.
- translation req: `name`, `phrase`, `type: text|paragraph`. Opt `translationMap` (shape: describe), `doNotShareWithPublicLibrary`.
- plugin req: `name`, `pluginBundle`, `plugin`, `pluginName`, `mode: agent|javascript|webService`, `pluginVersion`, `pluginApiIdKeys`, `pluginApiIdMap`, `pluginFormKeys`, `pluginFormMap`, `pluginVarKeys`, `pluginVarMap`. Import only.

## Validation gotchas
- Refs point at sheet name, not form.
- Ref field `layoutSpreadsheet` must be list|card on TARGET sheet (table -> "Invalid spreadsheet layout type (supported: List, Card)"). Unique layout names per sheet (no bare "Table") or name resolves to wrong sheet.
- Report done only when all of create-order step 3 exist + mapping non-empty + validate ok. gridLayout needs `showComps`; root `flexCenter.gridLayouts` = layout on SAME form. Sublayouts rootLayout=false via root `flexCenter.formLayouts`; action points at root.

## Not possible / unclear
- ArgBinder kinds + value shapes: not in these docs; run `schema kind=argBinder` (also `argBinderMap`, `actionPermission`).
- Shapes unclear (check `describe` on an existing one): setOfText entry w/ explicit label (likely `{Key:{value:"Label"}}`), condition/setOfUser `value.node`, formEventCondition `map` children, mapOfText/tree entries, function `inputFuncArgMap`, partitionMap `formula`, translationMap, group `*Permissions` values, plugin report API id.
- formFormula / filterCondition `cond`: "Resource name" — likely var kind=condition; confirm.
- No sheet history toggle; no general sheet read roles. Group: no reports/members props. Role: no hierarchy / derived-role defs. sequence: no prefix/format. Plugin: import only.
