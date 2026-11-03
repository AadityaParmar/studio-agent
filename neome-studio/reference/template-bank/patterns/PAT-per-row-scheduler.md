---
id: PAT-per-row-scheduler
kind: pattern
name: Per-row scheduler
workaround: false
seenIn:
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-06, area: SalesOrder}
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-crm, area: CRM}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Per-row scheduler

## Task

Each row gets its own timed job (next deduction, auto cancel, payment reminder), reset when the row changes.

## How

- schedulerId and dateTime fields on the row.
- applyFormula works out the next date.
- executeScheduler sets the job; executeSchedulerRemove clears it on change or remove.

## Workaround

No. Direct feature (scheduler nodes on a row).

## Limits

- Old scheduler must be removed before a new one is set, or jobs double.

## Flowchart

```mermaid
flowchart TD
  A["Row saved"]
  B["Work out next date"]
  C["Set scheduler"]
  D["Row changes: remove and set again"]
  A --> B
  B --> C
  C --> D
```
