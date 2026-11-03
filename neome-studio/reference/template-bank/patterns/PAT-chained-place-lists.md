---
id: PAT-chained-place-lists
kind: pattern
name: Chained place lists
workaround: false
seenIn:
  - {build: NB-02, area: MasterData}
  - {build: NB-04, area: MasterData}
  - {build: NB-05, area: MasterData}
  - {build: NB-06, area: ProductionMasterData}
---

# Chained place lists

## Task

Country, state, city (or zone, state, town, area) lists link up; picking the lowest level fills the levels above.

## How

- One sheet per level; each refs its parent and copies the parent text and rowId.
- Lower levels copy all levels above through the ref chain.
- A zone can hold a grid of cities.
- Lighter form: city sheet with state as pickText.

## Workaround

No. Direct feature (chained refs with copied fields).

## Limits

- Renaming a place does not update rows that copied it earlier.

## Flowchart

```mermaid
flowchart TD
  A["Admin adds country"]
  B["State refs country"]
  C["City refs state"]
  D["Form picks city"]
  E["State and country filled"]
  A --> B
  B --> C
  C --> D
  D --> E
```
