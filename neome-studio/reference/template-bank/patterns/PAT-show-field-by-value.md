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

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: Form, VarType, Type, ASection, HideA, ShowA, ClearA, IsA. Needs first: Form.

1. Control: `add kind=var kind=setOfText name=VarType deploy=fixedOnDeploy value={…}` → `add kind=field type=pickText name=Type source=VarType`.
2. Targets: `add kind=composite type=section name=ASection` per type; Yes/No variant: `type=bool Has` + qty fields.
3. Actions: `add kind=formEventAction kind=hidden name=HideA comps=[ASection] actionOn=component`; `kind=visible name=ShowA`; optional `kind=clear name=ClearA comps=[…]`.
4. Condition: `add kind=formEventCondition name=IsA statement={lhs:Type,operator:equalTo,rhs:{argName:"rhs",kind:"constant",value:{type:"text",value:{value:"keyA"}}}}` (`hasValue`: omit rhs).
5. Event: `add kind=formEvent kind=onInitAndOnChange eventComps=[Type] actions=[{action:ShowA,condition:IsA},{action:HideA,condition:IsA,negate:true}]`.
6. `validate` till ok=true.

Gaps: rhs takes option key vs label unconfirmed; `actionOn` for a section (verify: describe).
