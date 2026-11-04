---
id: PAT-composite-report
kind: pattern
name: Composite report from merged parts
workaround: false
seenIn:
  - {build: NB-01, area: Dashboard}
  - {build: NB-01, area: Profile}
  - {build: NB-02, area: Attendance}
  - {build: NB-02, area: Conveyance}
  - {build: NB-02, area: Expense}
  - {build: NB-02, area: Location}
  - {build: NB-02, area: MyProfile}
  - {build: NB-02, area: Reporting}
  - {build: NB-02, area: MasterData}
  - {build: NB-03, area: Inventory}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: AdminReports}
  - {build: NB-04, area: Location}
  - {build: NB-04, area: MyLocation}
  - {build: NB-04, area: MyProfile}
  - {build: NB-04, area: Stock}
  - {build: NB-04, area: Orphans (maybe dead)}
  - {build: NB-05, area: Attendence}
  - {build: NB-05, area: Expenses}
  - {build: NB-05, area: Reporting}
  - {build: NB-06, area: Orphans (maybe dead)}
  - {build: NB-06, area: Quotation}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: DevCentral}
  - {build: NB-07, area: HRCentral}
  - {build: NB-07, area: Orphans (maybe dead)}
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-employee-directory, area: EmployeeDirectory}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-gate-pass-management, area: GatePassManagement}
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

# Composite report from merged parts

## Task

Show one screen (dashboard, profile, summary, print) built from several report parts.

## How

- One query report per part: a section of totals, grids of details, charts.
- Composite report merges the parts into one output form.
- One filter form (date range, month, team, user) feeds all parts.
- Report action per role.

## Workaround

No. Direct feature (composite report).

## Limits

- Each part is its own query; many parts slow the screen.
- Role scoping needs a copy per role (see PAT-role-copy-of-report).

## Flowchart

```mermaid
flowchart TD
  A["User sets filter"]
  B["Each part query runs"]
  C["Composite merges parts"]
  D["One screen shown"]
  A --> B
  B --> C
  C --> D
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: filter form `DashFilter`, part reports `TotalsPart` / `DetailsPart`, `DashOut` form, `DashReport`, role `Manager`. Needs first: source sheets.

1. Filter form: `add kind=form name=DashFilter` → section → `type=dateRange name=Period`, `type=pickUser name=User roleIdDataSource=[...]`.
2. Part output forms: per part `add kind=form` → `kind=composite type=section` (totals) or `type=grid` (details) → fields → `kind=gridLayout kind=table showComps=[...]` or chart kind (`xyChartBarGraph xAxis=...`).
3. Part reports: `add kind=report kind=query name=TotalsPart inputForm=DashFilter outputForm=TotalsOut neoQL={value:"..."} fromSpreadsheets=[...]`. Repeat per part.
4. Merged form: `add kind=form name=DashOut` with the parts' composites → `kind=formLayout type=content name=DashView direction=vertical rootLayout=true flexCenter={gridLayouts:[...]}`.
5. Composite: `add kind=report kind=composite name=DashReport inputForm=DashFilter outputForm=DashOut mergeReports=["TotalsPart","DetailsPart"]`.
6. Action: `add kind=action kind=report name=Dashboard report=DashReport outputFormContentLayout=DashView` → `set kind=group actionPermissionMap` `{"Dashboard":{"roles":["Manager"]}}`.
7. `validate` till ok=true.

Gaps: how parts' outputs map into the merged form (same composite names?) unconfirmed (verify: describe).
