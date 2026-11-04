---
id: PAT-scheduled-job-over-rows
kind: pattern
name: Scheduled job over rows
workaround: false
seenIn:
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-02, area: Location}
  - {build: NB-04, area: Attendance}
  - {build: NB-05, area: Attendence}
  - {build: NB-06, area: ProductionMasterData}
  - {build: NB-07, area: HR Desk}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-purchase-management, area: PurchaseManagement}
---

# Scheduled job over rows

## Task

Run a job each day, week, month or year over many rows (deduct rent, close the day, credit leave, count down credit days).

## How

- eventSchedule with the time and repeat.
- Query, report or branchIterateSpreadsheet to list rows.
- Per row: branch, row update, log number update or row insert.
- Optional error message to a developer group.

## Workaround

No. Direct feature (schedule and iterate nodes).

## Limits

- One run touches many rows; failures half way need a gap check report.
- Time zone and partition limits apply to big sheets.

## Flowchart

```mermaid
flowchart TD
  A["Schedule fires"]
  B["List rows"]
  C["For each row: check"]
  D["Update or insert"]
  A --> B
  B --> C
  C --> D
```
