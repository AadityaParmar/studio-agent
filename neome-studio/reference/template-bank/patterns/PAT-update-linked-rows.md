---
id: PAT-update-linked-rows
kind: pattern
name: Update linked rows from a workflow
workaround: false
seenIn:
  - {build: NB-01, area: AssignVehicle}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: JobWork}
  - {build: NB-02, area: LeaveApplication}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-04, area: Leave}
  - {build: NB-04, area: VisitBook}
  - {build: NB-04, area: Order}
  - {build: NB-06, area: Inward}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: QualityChecking}
  - {build: NB-06, area: Return}
  - {build: NB-07, area: Sales Desk}
---

# Update linked rows from a workflow

## Task

An event on one row writes into linked rows (vehicle and customer on assign, attendance on leave, parent status from child, plan done on visit).

## How

- Workflow on insert-after or update-after.
- rowUpdate on the linked sheet using the copied rowId.
- Switch on a value (duration, status) to pick what to write.
- fieldRemove to clear links on unassign.
- Loop variant: iterate a sheet to copy a value to many related rows.

## Workaround

No. Direct feature (rowUpdate and fieldRemove nodes). The loop variant stands in for a live link.

## Limits

- Needs the rowId of the target on the source row.
- Loops over big sheets are slow.

## Flowchart

```mermaid
flowchart TD
  A["Source row event"]
  B["Find linked row"]
  C["Update or clear fields"]
  A --> B
  B --> C
```
