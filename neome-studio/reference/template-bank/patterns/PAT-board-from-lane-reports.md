---
id: PAT-board-from-lane-reports
kind: pattern
name: Board from lane reports
workaround: true
seenIn:
  - {build: NB-07, area: DevCentral}
---

# Board from lane reports

## Task

See items in lanes side by side (backlog, next sprint, current sprint).

## How

- One spreadsheet report per lane.
- Composite report merges the lanes into one screen.

## Workaround

Yes. No board view; lane reports stand in.

## Limits

- No drag between lanes; status is changed on the row.

## Flowchart

```mermaid
flowchart TD
  A["Lane reports run"]
  B["Composite merges lanes"]
  C["User opens row to move it"]
  A --> B
  B --> C
```
