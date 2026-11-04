---
id: PAT-action-set-menu
kind: pattern
name: Menu by action set
workaround: false
seenIn:
  - {build: NB-01, area: MasterData}
  - {build: NB-01, area: VehicleMaster}
  - {build: NA-crm, area: MasterData}
---

# Menu by action set

## Task

Admin opens all master lists from one place.

## How

- actionsSet action for the role that groups the list actions.

## Workaround

No. Direct feature (actionsSet).

## Limits

- Groups actions only; it cannot show counts or reports.

## Flowchart

```mermaid
flowchart TD
  A["Admin opens action set"]
  B["Picks a list action"]
  C["Sheet opens"]
  A --> B
  B --> C
```
