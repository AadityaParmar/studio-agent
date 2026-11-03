---
id: PAT-low-stock-alert
kind: pattern
name: Low stock alert
workaround: false
seenIn:
  - {build: NB-03, area: Inventory}
  - {build: NB-06, area: ProductionMasterData}
  - {build: NB-06, area: Inventory}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
---

# Low stock alert

## Task

Tell a group when stock goes under a reorder or minimum level, or above a maximum.

## How

- Min, max, reorder or safety stock fields on the item.
- Workflow on update-after of the stock row; branch on quantity against the levels.
- sendMessageToGroups per level.
- Plain variant: a spreadsheet action listing items near the minimum.

## Workaround

No. Direct workflow and message nodes. The list-only variant is a stand-in for an alert.

## Limits

- Fires on every stock update under the level; no once-only guard unless built.

## Flowchart

```mermaid
flowchart TD
  A["Stock row updated"]
  B["Below min or reorder?"]
  C["Message the group"]
  A --> B
  B --> C
```
