---
id: PAT-copy-fields-from-ref
kind: pattern
name: Copy fields from a picked row
workaround: false
seenIn:
  - {build: NB-01, area: AssignVehicle}
  - {build: NB-01, area: Complaints}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: Deboarding}
  - {build: NB-01, area: JobWork}
  - {build: NB-01, area: Onboarding}
  - {build: NB-01, area: Payments}
  - {build: NB-01, area: Transactions}
  - {build: NB-02, area: Client}
  - {build: NB-02, area: MasterData}
  - {build: NB-02, area: PlumberMeet}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: Complaint}
  - {build: NB-04, area: CreditNote}
  - {build: NB-04, area: Lead}
  - {build: NB-04, area: Quotation}
  - {build: NB-04, area: Stock}
  - {build: NB-05, area: AssetManagement}
  - {build: NB-05, area: Lead}
  - {build: NB-05, area: Quotation}
  - {build: NB-05, area: Visits}
  - {build: NB-05, area: Orphans (maybe dead)}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: Payment}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-06, area: ProductionMasterData}
  - {build: NB-06, area: RequestMaterial}
  - {build: NB-06, area: RequestMaterialNotification}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-employee-directory, area: EmployeeDirectory}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-gate-pass-management, area: GatePassManagement}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-knowledge-library, area: KnowledgeLibrary}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-product-lifecycle-management, area: ProductLifecycleManagement}
  - {build: NA-project-management, area: ProjectManagement}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quality-control, area: QualityControl}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Copy fields from a picked row

## Task

Pick a master or parent row once and show its details (contact, price, plan, balance) on the new row.

## How

- ref field to the master or parent sheet.
- Fields copied from the ref (text, number, pickText, logNumber) plus a rowId field for later workflow updates.
- Sometimes a button to fetch details again.

## Workaround

No. Direct feature (ref with copied fields).

## Limits

- Copied values are taken at pick time; later master changes do not flow down.
- Copied logNumber shows the balance at pick time only.

## Flowchart

```mermaid
flowchart TD
  A["User picks master row in ref field"]
  B["Copied fields fill"]
  C["rowId kept for workflows"]
  A --> B
  B --> C
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: master `Customer` / `CustomerSheet` (list layout `CustomerPickList`), picking form `Order`. Needs first: master sheet with a list or card layout.

1. Copy targets on `Order`: `type=text name=ContactName disabled=true`, `type=decimal name=Price disabled=true`, `type=pickText name=Plan source=<same var as master>`, `type=logNumber name=Balance`, `type=text name=CustomerRowId disabled=true`.
2. Ref: `add kind=field parent=Order type=ref name=Customer spreadsheet=CustomerSheet layoutSpreadsheet=CustomerPickList keyFields=[...] copyFieldMap=<master field → target field, rowId → CustomerRowId>` (verify: describe).
3. Fetch again: `refreshOn=refreshOnDemand` on the ref, or a `type=button` (see PAT-button-runs-workflow).
4. `validate` till ok=true.

Gaps: `copyFieldMap` shape and how rowId is copied unconfirmed; copied values do not follow later master changes.
