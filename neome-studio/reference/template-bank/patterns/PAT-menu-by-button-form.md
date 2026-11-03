---
id: PAT-menu-by-button-form
kind: pattern
name: Menu by button form
workaround: true
seenIn:
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: AdminReports}
  - {build: NB-04, area: AllReporting}
  - {build: NB-04, area: ManagerReports}
  - {build: NA-amc-and-service-management, area: AmcServiceManagment}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
---

# Menu by button form

## Task

User picks one of many reports or master sheets from one screen.

## How

- Report whose output form holds one button per target.
- Each button opens a report or sheet action.
- One report action opens the menu per role.

## Workaround

Yes. No grouped menu of reports or masters; a form of buttons stands in.

## Limits

- New reports need a new button by hand.
- Buttons do not hide by role; make one menu per role.

## Flowchart

```mermaid
flowchart TD
  A["User opens menu report"]
  B["Taps a button"]
  C["Target report or sheet opens"]
  A --> B
  B --> C
```
