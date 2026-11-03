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
