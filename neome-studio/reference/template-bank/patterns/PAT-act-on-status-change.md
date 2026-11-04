---
id: PAT-act-on-status-change
kind: pattern
name: Act on status or field change
workaround: false
seenIn:
  - {build: NB-01, area: AssignVehicle}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: Deboarding}
  - {build: NB-01, area: JobWork}
  - {build: NB-01, area: Payments}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-04, area: Quotation}
  - {build: NB-04, area: SalesExecutives}
  - {build: NB-05, area: Expenses}
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-crm, area: CRM}
  - {build: NA-employee-directory, area: EmployeeDirectory}
  - {build: NA-gate-pass-management, area: GatePassManagement}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-project-management, area: ProjectManagement}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Act on status or field change

## Task

Run steps when a status (or another key field) on a row changes.

## How

- pickText status field on the sheet.
- Workflow on update-after with a branch Curr value not equal to Prior value.
- Switch on the new value; each case runs its own steps or a sub workflow.
- Typical steps: row update on linked sheets, user update, message to the creator or a role.

## Workaround

No. Direct workflow feature.

## Limits

- Every branch must check the change itself, or saves without a change re-run the steps.
- Many cases in one switch get hard to read; sub workflows help.

## Flowchart

```mermaid
flowchart TD
  A["Row updated"]
  B["Field changed?"]
  C["Switch on new value"]
  D["Run steps for that value"]
  A --> B
  B --> C
  C --> D
```
