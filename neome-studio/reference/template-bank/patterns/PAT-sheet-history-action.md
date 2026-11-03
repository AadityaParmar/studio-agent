---
id: PAT-sheet-history-action
kind: pattern
name: Sheet history action
workaround: false
seenIn:
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: DevCentral}
  - {build: NB-07, area: HRCentral}
---

# Sheet history action

## Task

See who changed a row and when.

## How

- spreadsheetHistory action on the sheet for the roles that check.

## Workaround

No. Direct feature (spreadsheetHistory).

## Limits

- Shows changes per row; no report across rows.

## Flowchart

```mermaid
flowchart TD
  A["User opens history action"]
  B["Picks row"]
  C["Sees changes"]
  A --> B
  B --> C
```
