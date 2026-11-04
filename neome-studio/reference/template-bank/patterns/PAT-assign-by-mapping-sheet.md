---
id: PAT-assign-by-mapping-sheet
kind: pattern
name: Auto assign by mapping sheet
workaround: false
seenIn:
  - {build: NB-04, area: Lead}
  - {build: NB-04, area: ProjectDatabase}
---

# Auto assign by mapping sheet

## Task

A lead or project goes to the executive (and manager) of its zone.

## How

- Mapping sheet of executive, zone and manager.
- Ref to the mapping row; assignee and manager pickUser copied from the ref.

## Workaround

No. Direct feature (ref with copied pickUser).

## Limits

- One executive per zone row; sharing needs more rows.

## Flowchart

```mermaid
flowchart TD
  A["User picks zone mapping"]
  B["Assignee copied"]
  C["Row shows in assignee view"]
  A --> B
  B --> C
```
