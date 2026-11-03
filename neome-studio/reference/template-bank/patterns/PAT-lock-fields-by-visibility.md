---
id: PAT-lock-fields-by-visibility
kind: pattern
name: Lock fields until saved or closed
workaround: true
seenIn:
  - {build: NB-01, area: Employee}
  - {build: NB-02, area: Conveyance}
  - {build: NB-03, area: Inventory}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-gate-pass-management, area: GatePassManagement}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-product-lifecycle-management, area: ProductLifecycleManagement}
  - {build: NA-purchase-management, area: PurchaseManagement}
---

# Lock fields until saved or closed

## Task

Status or other fields cannot be changed until the row is saved, or after it is closed.

## How

- Visibility rule that disables the field when the row ID (or linked user) has no value.
- Bool flag set on close; a rule disables all fields when the flag is true.
- onInitAndOnChange event.

## Workaround

Yes. No read-only-until-saved or lock feature; visibility rules and bool flags stand in.

## Limits

- Role rights still allow edits from other actions; the rule only guards the form.
- The flag must be set by a workflow or formula.

## Flowchart

```mermaid
flowchart TD
  A["New row: status disabled"]
  B["Row saved, ID set"]
  C["Status enabled"]
  D["Closed: flag set, fields disabled"]
  A --> B
  B --> C
  C --> D
```
