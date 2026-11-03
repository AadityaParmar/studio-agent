---
id: PAT-show-field-by-value
kind: pattern
name: Show or hide fields by value
workaround: false
seenIn:
  - {build: NB-01, area: AssignVehicle}
  - {build: NB-01, area: Complaints}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: Onboarding}
  - {build: NB-04, area: Lead}
  - {build: NB-04, area: VisitBook}
  - {build: NB-04, area: Sampling}
  - {build: NB-05, area: Visits}
  - {build: NB-06, area: Inventory}
  - {build: NB-06, area: Inward}
  - {build: NB-06, area: RequestMaterialNotification}
  - {build: NB-06, area: Return}
  - {build: NB-07, area: HRCentral}
  - {build: NB-07, area: DevCentral}
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-employee-directory, area: EmployeeDirectory}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-gate-pass-management, area: GatePassManagement}
  - {build: NA-knowledge-library, area: KnowledgeLibrary}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-product-lifecycle-management, area: ProductLifecycleManagement}
  - {build: NA-project-management, area: ProjectManagement}
  - {build: NA-quality-control, area: QualityControl}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Show or hide fields by value

## Task

Show only the fields or sections that fit the chosen type, source or status.

## How

- Visibility logic on the field or section, keyed on a pickText value or hasValue.
- onInitAndOnChange event.
- One section per type (visit type, lead source), shown by its rule.
- Yes or No item with quantity fields shown only on Yes.

## Workaround

No. Direct feature (visibility logic).

## Limits

- Hidden fields keep old values; clear them in a workflow if needed.
- Many rules on one form get hard to follow.

## Flowchart

```mermaid
flowchart TD
  A["User picks type or status"]
  B["Visibility rule runs"]
  C["Matching fields or section shown"]
  A --> B
  B --> C
```
