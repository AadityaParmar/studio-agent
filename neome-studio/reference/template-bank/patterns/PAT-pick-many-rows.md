---
id: PAT-pick-many-rows
kind: pattern
name: Pick many rows
workaround: false
seenIn:
  - {build: NB-06, area: QualityChecking}
  - {build: NB-06, area: Return}
  - {build: NB-07, area: DevCentral}
---

# Pick many rows

## Task

Link one row to several rows of another sheet (approved and rejected units, returned units, customers on a ticket).

## How

- refSet field to the other sheet.
- Workflow iterates the set to update each picked row.
- Fixed variant: a few ref fields, each shown when the one before has a value.

## Workaround

No with refSet. The fixed-ref variant is a stand-in for a multi-pick.

## Limits

- Fixed refs cap the count.

## Flowchart

```mermaid
flowchart TD
  A["User picks many rows"]
  B["Set saved"]
  C["Workflow updates each"]
  A --> B
  B --> C
```
