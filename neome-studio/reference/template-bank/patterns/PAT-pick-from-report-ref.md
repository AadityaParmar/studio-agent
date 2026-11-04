---
id: PAT-pick-from-report-ref
kind: pattern
name: Pick rows from a report ref
workaround: false
seenIn:
  - {build: NB-02, area: LeaveApplication}
  - {build: NB-03, area: Inventory}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-05, area: MasterData}
  - {build: NB-05, area: Quotation}
  - {build: NB-05, area: Lead}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: Inward}
  - {build: NB-06, area: QualityChecking}
  - {build: NB-06, area: Return}
  - {build: NB-06, area: Quotation}
  - {build: NB-06, area: SalesOrder}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-project-management, area: ProjectManagement}
  - {build: NA-quality-control, area: QualityControl}
---

# Pick rows from a report ref

## Task

Fill a field or grid line from live data that a plain ref cannot give (stock per warehouse, ordered and dispatched quantity, balance, shipping address).

## How

- Query report with the form as input (entity input) and an output form.
- refReport field on the form or in a grid column.
- Fields copied from the report pick.

## Workaround

No. Direct feature (refReport).

## Limits

- Values are taken at pick time.
- Each pick needs its own query report.

## Flowchart

```mermaid
flowchart TD
  A["Form fills filter values"]
  B["Report runs on pick"]
  C["User picks a report row"]
  D["Copied fields fill"]
  A --> B
  B --> C
  C --> D
```
