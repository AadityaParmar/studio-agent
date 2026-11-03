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
