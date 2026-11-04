---
id: PAT-insert-row-in-other-sheet
kind: pattern
name: Insert a row in another sheet on event
workaround: false
seenIn:
  - {build: NB-01, area: Onboarding}
  - {build: NB-04, area: Lead}
  - {build: NB-04, area: VisitBook}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: MyVisitPlanner}
  - {build: NB-06, area: Inward}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
---

# Insert a row in another sheet on event

## Task

An event on one row makes a row elsewhere (approved request makes a customer, follow-up date makes a planned visit, received lot makes unit rows).

## How

- Workflow on insert-after or on a field change.
- Branch on the condition (approved, date has value, flag true).
- paramUpdate to map fields, then rowInsert into the target sheet.
- Copy variant: insert a copy for a second user on the same sheet.

## Workaround

No. Direct feature (rowInsert node). The copy-for-a-colleague variant stands in for shared rows.

## Limits

- No link back unless the new rowId is written to the source row.

## Flowchart

```mermaid
flowchart TD
  A["Source row event"]
  B["Condition met?"]
  C["Map fields"]
  D["Insert target row"]
  A --> B
  B --> C
  C --> D
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: SourceSheet, TargetSheet, TargetForm, InsertWf, Pipe. Needs first: both sheets.

1. Workflow: `add kind=workflow name=InsertWf` (4 maps `{}`).
2. Event: `kind=eventSsInsertAfter` or `eventSsUpdateAfter spreadsheet=SourceSheet pipelineVarMap{Pipe:{variableForm:TargetForm}}` (verify: describe).
3. Branch: `kind=branchIfElse option=Condition condition{statement{lhs, operator:equalTo|hasValue|hasChanged, rhs}}`.
4. Map: `kind=paramUpdate option=Mapping pipelineParam=Pipe outputMapping{fromForm, toForm:TargetForm, fieldMappingMap}`.
5. Insert: `kind=rowInsert spreadsheet=TargetSheet outputParam=Pipe`.
6. Link back (optional): `kind=rowUpdate rowIdPointer{spreadsheet:SourceSheet, row}` writes the new rowId.
7. `set kind=workflow edgeMap`: event → branch NEXT; TRUE → paramUpdate; paramUpdate → rowInsert NEXT + outputPipelineParamId=Pipe.
8. Copy variant: TargetSheet = SourceSheet; mapping sets the second user field.
9. `validate` till ok=true.

Gaps: pipelineVarMap entry shape; edgeMap keys; where rowInsert puts the new rowId unverified.
