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
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-project-management, area: ProjectManagement}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quality-control, area: QualityControl}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
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

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: FilterForm, OutForm, OutGrid, OutTable, OutContent, ListReport, ListReportAction, Role. Needs first: source sheets, filter fields in their `queryables`.

1. Filter form: `add kind=form name=FilterForm` → `kind=composite type=section` → fields (`type=date` / `type=dateRange`, `type=pickUser roleIdDataSource=[Role]`, `type=ref spreadsheet=ZoneSheet layoutSpreadsheet=<list|card> copyFieldMap` for text + rowId (verify: describe)).
2. Output form: `add kind=form name=OutForm` → `kind=composite type=grid name=OutGrid` → result fields → `add kind=gridLayout kind=table showComps=[…]` → `add kind=formLayout type=content rootLayout=true direction=vertical` with `flexCenter.gridLayouts=[OutTable]`.
3. Report: `schema kind=report variant=query` → `add kind=report kind=query inputForm=FilterForm outputForm=OutForm fromSpreadsheets=[…] neoQL={value:"…"}`.
4. Action: `add kind=action kind=report name=ListReportAction report=ListReport outputFormContentLayout=OutContent`.
5. `set kind=group actionPermissionMap={"ListReportAction":{"roles":[Role]}}`, one action per role that needs it.
6. `validate` till ok=true. `describe kind=report` to confirm.

Gaps: neoQL syntax for filter inputs and output columns not in guide (verify: describe an existing query report). copyFieldMap shape unconfirmed.
