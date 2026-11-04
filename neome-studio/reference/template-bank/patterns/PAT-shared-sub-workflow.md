---
id: PAT-shared-sub-workflow
kind: pattern
name: Shared sub workflow
workaround: false
seenIn:
  - {build: NB-01, area: Payments}
  - {build: NB-02, area: Conveyance}
  - {build: NB-04, area: Order}
  - {build: NB-05, area: MasterData}
  - {build: NB-06, area: Dispatch}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Shared sub workflow

## Task

Steps used from several events (insert and update, approve) live in one sub workflow.

## How

- eventSubWorkflow with the shared steps.
- executeSubWorkflow from each calling branch.

## Workaround

No. Direct feature (sub workflows).

## Limits

- Inputs must be passed the same way from every caller.

## Flowchart

```mermaid
flowchart TD
  A["Insert or update event"]
  B["Branch"]
  C["Call sub workflow"]
  D["Shared steps run"]
  A --> B
  B --> C
  C --> D
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: SharedWf, SubStart, SubInForm, caller workflows. Needs first: caller workflows.

1. Input form (if values are passed): `add kind=form name=SubInForm` → `kind=composite type=section` → fields passed in.
2. Shared steps: `add kind=workflow name=SharedWf` (4 maps `{}`) → `add kind=node kind=eventSubWorkflow name=SubStart inputForm={form:SubInForm} sharedParameters=[…]` → shared step nodes.
3. `set kind=workflow ref=SharedWf edgeMap`: SubStart → steps NEXT.
4. Each caller: `add kind=node kind=executeSubWorkflow startNode=SubStart sharedParamMap=…` in the calling branch; wire it NEXT in that caller's edgeMap. No edge into SubStart.
5. `validate` till ok=true.

Gaps: `startNode` across workflows vs same workflow unconfirmed; `sharedParamMap` / `sharedParameters` entry shape unknown (verify: describe).
