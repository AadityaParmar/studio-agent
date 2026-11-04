---
id: PAT-admin-kept-pick-list
kind: pattern
name: Pick list kept by admin
workaround: false
seenIn:
  - {build: NB-01, area: Complaints}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: Employee}
  - {build: NB-01, area: Inquiry}
  - {build: NB-01, area: JobWork}
  - {build: NB-02, area: Attendance}
  - {build: NB-02, area: LeaveApplication}
  - {build: NB-02, area: MasterData}
  - {build: NB-04, area: Expenses}
  - {build: NB-05, area: Orphans (maybe dead)}
  - {build: NB-06, area: Inventory}
  - {build: NB-06, area: ProductionMasterData}
  - {build: NB-06, area: RequestMaterialNotification}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: HR Desk}
  - {build: NB-07, area: Service Desk}
  - {build: NA-crm, area: CRM}
  - {build: NA-employee-directory, area: EmployeeDirectory}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-gate-pass-management, area: GatePassManagement}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-project-management, area: ProjectManagement}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Pick list kept by admin

## Task

Admin or HR keeps short lists (type, category, branch, unit, reason) that other sheets pick from.

## How

- One small sheet per list, often one text field.
- Insert, update and remove for Admin or HR only; others read.
- spreadsheetEditor action per list for the keeper roles.
- Other sheets pick with a ref field and copy the text and rowId.
- Two-level lists: a sub list sheet refs its parent list.

## Workaround

No. Direct feature (sheet rights plus ref).

## Limits

- Many small lists mean many sheets and actions; group them in a menu.
- A pickText field is lighter when the list never changes.

## Flowchart

```mermaid
flowchart TD
  A["Admin edits list sheet"]
  B["User opens a form"]
  C["Ref picks a list row"]
  D["Text and rowId copied"]
  A --> B
  B --> C
  C --> D
```
