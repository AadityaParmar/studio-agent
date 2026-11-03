---
id: PAT-query-report-with-filter
kind: pattern
name: Query report with filter form
workaround: false
seenIn:
  - {build: NB-01, area: Reporting}
  - {build: NB-01, area: Transactions}
  - {build: NB-01, area: Developer}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: Complaints}
  - {build: NB-02, area: TodaysAllLocation}
  - {build: NB-02, area: TodaysTeamLocation}
  - {build: NB-04, area: AdminReports}
  - {build: NB-04, area: Expenses}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: Support}
  - {build: NB-04, area: VisitBook}
  - {build: NB-05, area: HRReporting}
  - {build: NB-05, area: Lead}
  - {build: NB-05, area: Quotation}
  - {build: NB-05, area: Reporting}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: FinishGood}
  - {build: NB-06, area: Inventory}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-06, area: Reporting}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: DevCentral}
---

# Query report with filter form

## Task

List or count rows for a date range, user, zone or status (open items, gap checks, counts, history, planning).

## How

- Filter form as report input: dates, pickUser, ref to zone or employee with copied text and rowId.
- Query report over one or more sheets.
- Output form with the result fields.
- Report action per role.

## Workaround

No. Direct feature (query report with filter and output forms).

## Limits

- Each new view is a new report; reuse output forms where you can.

## Flowchart

```mermaid
flowchart TD
  A["User fills filter form"]
  B["Query runs"]
  C["Output form shows rows"]
  A --> B
  B --> C
```
