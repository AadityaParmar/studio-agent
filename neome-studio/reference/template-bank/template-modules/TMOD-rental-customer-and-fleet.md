---
id: TMOD-rental-customer-and-fleet
kind: template-module
name: "Rental customers, plans and fleet"
aliases: [Rental customer and vehicle master]
patterns: [PAT-admin-kept-pick-list, PAT-copy-fields-from-ref, PAT-running-total-by-log-field, PAT-scheduled-job-over-rows, PAT-per-row-scheduler, PAT-sheet-row-drives-app-user, PAT-outside-service-by-plugin, PAT-feature-flag-by-var, PAT-message-on-event, PAT-update-linked-rows, PAT-show-field-by-value, PAT-query-report-with-filter, PAT-act-on-status-change]
neomeApp: vehicle-and-driver-management
delivery: custom
seenIn:
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: VehicleMaster}
---

# Rental customers, plans and fleet

## Usual needs

- Usually has to keep rental customers, vehicles and small vehicle lists (branch, model, colour, type).
- Usually has to keep rental plans with price, duration, grace amount and km rules.
- Usually has to give each customer a plan, a vehicle, a rent balance and a km balance.
- Usually has to deduct rent and km on a schedule and log each deduction.
- Usually has to block the vehicle when balance is low and unblock after payment, through the device service.
- Usually has to tell the customer on low balance and on block or unblock.
- Usually has to add, update and remove the customer app user with the customer status.

## Process steps

1. Admin adds customer with plan and vehicle.
2. App user is created.
3. Schedule deducts rent and km; ledger row added.
4. Low balance blocks the vehicle and messages the customer.
5. Inactive status clears links and removes the user.

## Usual sheets, key fields, roles

- Customer: Branch, Status, Plan, Vehicle, RentalBalance (log), KmBalance (log)
- RentalPlan: PlanName, PlanDuration {Daily|Weekly}, RentalPrice, GraceAmount, km rules, Status
- Vehicle: Branch, Type, Model, VehicleStatus, MobilizationStatus, Customer
- Roles: Admin, Developer, Customer.

## Neome App / Delivery hint

Neome App: vehicle-and-driver-management (closest). Delivery: custom (device plugin, balance rules). Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Admin adds customer with plan and vehicle."]
  B["App user is created."]
  C["Schedule deducts rent and km ledger row added."]
  D["Low balance blocks the vehicle and messages the customer."]
  E["Inactive status clears links and removes the user."]
  A --> B
  B --> C
  C --> D
  D --> E
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: Customer, RentalPlan, Vehicle, RentLedger, Branch/Model/Colour/Type lists, roles Admin, Developer, Customer. Needs first: device service plugin (import only). Closest Neome App vehicle-and-driver-management is not a fit; build custom.

1. Roles + vars: `add kind=role` x3; `add kind=var kind=setOfText` PlanDuration {Daily|Weekly}, CustomerStatus, VehicleStatus, MobilizationStatus {Blocked|Unblocked}; `kind=bool` flag for device block (`apply PAT-feature-flag-by-var Execute`). Lists: `apply PAT-admin-kept-pick-list Execute` (Branch, Model, Colour, Type sheets).
2. RentalPlan form: `type=text` PlanName, `type=pickText` PlanDuration, Status, `type=decimal` RentalPrice, GraceAmount, km rules → `RentalPlanSheet` + table + list layouts.
3. Vehicle form: `type=ref` Branch, Type, Model, `type=pickText` VehicleStatus, MobilizationStatus, `type=ref` Customer → `VehicleSheet` + table + list layouts.
4. Customer form: `type=ref` Branch, Plan, Vehicle (`apply PAT-copy-fields-from-ref Execute`), `type=pickText` Status, `type=logDecimal` RentalBalance, KmBalance → `CustomerSheet` + table layout. RentLedger form + sheet for each deduction.
5. Deduct: `apply PAT-scheduled-job-over-rows Execute` or `apply PAT-per-row-scheduler Execute` (`rowUpdateFieldLogNumber operation=subtract` + `rowInsert spreadsheet=RentLedgerSheet`); `apply PAT-running-total-by-log-field Execute`.
6. Block/unblock: `apply PAT-outside-service-by-plugin Execute` (`executePlugin`) on low balance / payment; tell customer: `apply PAT-message-on-event Execute`.
7. App user: `apply PAT-sheet-row-drives-app-user Execute` (`userAdd` / `userUpdate` / `userRemove` by Status); inactive clears links: `apply PAT-act-on-status-change Execute` + `apply PAT-update-linked-rows Execute`.
8. Form logic: `apply PAT-show-field-by-value Execute`. Reports: `apply PAT-query-report-with-filter Execute`.
9. Actions + group: `kind=rowInsert` / `kind=spreadsheetEditor` per sheet, `kind=report` → `set kind=group actionPermissionMap` (roles on every entry).
10. `validate` till ok=true.

Gaps: plugin is import only (MCP can't make it); balance and km rules are per-Enterprise rules (Open Item).
