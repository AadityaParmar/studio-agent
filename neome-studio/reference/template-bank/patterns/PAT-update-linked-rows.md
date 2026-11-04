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
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-gate-pass-management, area: GatePassManagement}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-product-lifecycle-management, area: ProductLifecycleManagement}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
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

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: SourceSheet, TargetSheet, Target, TargetRowId, Status, LinkWf. Needs first: TargetSheet with a list|card layout.

1. Link: `type=ref name=Target spreadsheet=TargetSheet layoutSpreadsheet=<list> copyFieldMap` copying rowId into TargetRowId (verify: describe).
2. Workflow: `add kind=workflow name=LinkWf` (4 maps `{}`) → `eventSsInsertAfter` or `eventSsUpdateAfter spreadsheet=SourceSheet`.
3. Write: `rowUpdate rowIdPointer={spreadsheet:TargetSheet,row:<B field $Curr TargetRowId>} option=Mapping outputMapping={fromForm,toForm,fieldMappingMap}`.
4. Switch: `branchSwitchCase field=Status` → VALUE per key → its own `rowUpdate`.
5. Unassign: `rowGet` target → `fieldRemove field={param:"$Prev",field:…}` → `rowUpdate`.
6. Loop variant: `branchIterateSpreadsheet spreadsheet=TargetSheet filterCondition=…` → `rowUpdate` on `$Iter` row.
7. `set kind=workflow edgeMap` (NEXT, VALUE `value`=key, ITERATE). `validate` till ok=true.

Gaps: copyFieldMap shape; `$Curr` / `$Iter` row binder shape (verify: `schema kind=argBinder`). edgeMap entry keys unverified.
