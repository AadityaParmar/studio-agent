---
id: TPL-vehicle-rental-company
kind: template
name: Vehicle rental company
businessType: "Rents vehicles to customers on daily or weekly plans, with deposit, prepaid balance, service and exit settlement."
modules:
  core: [TMOD-rental-customer-and-fleet, TMOD-customer-onboarding, TMOD-asset-assignment, TMOD-customer-payments, TMOD-customer-account-ledger, TMOD-customer-exit-settlement]
  optional: [TMOD-customer-complaints, TMOD-service-job-work, TMOD-lead-management, TMOD-employee-master, TMOD-management-reports, TMOD-my-profile, TMOD-master-data, TMOD-support-tools]
seenIn:
  - {build: NB-01, area: "*"}
---

# Vehicle rental company

## Modules

Core:

- TMOD-rental-customer-and-fleet (Rental customers, plans and fleet)
- TMOD-customer-onboarding (Customer onboarding)
- TMOD-asset-assignment (Asset assignment to customer)
- TMOD-customer-payments (Customer payments)
- TMOD-customer-account-ledger (Customer account ledger)
- TMOD-customer-exit-settlement (Customer exit and settlement)

Optional:

- TMOD-customer-complaints (Customer complaints)
- TMOD-service-job-work (Service job work)
- TMOD-lead-management (Lead management)
- TMOD-employee-master (Employee master)
- TMOD-management-reports (Management reports)
- TMOD-my-profile (My profile view)
- TMOD-master-data (Master data lists)
- TMOD-support-tools (Support and test tools)

## Links between modules

- Onboarding makes the customer row (customer onboarding → rental customers).
- Asset assignment refs customer and vehicle.
- Payments, ledger and exit ref the customer.
- Complaints ref the customer; service jobs ref the complaint.

## Flowchart

```mermaid
flowchart LR
  T["Vehicle rental company"]
  T --> C0["Rental customers, plans and fleet"]
  T --> C1["Customer onboarding"]
  T --> C2["Asset assignment to customer"]
  T --> C3["Customer payments"]
  T --> C4["Customer account ledger"]
  T --> C5["Customer exit and settlement"]
  T -.-> O0["Customer complaints"]
  T -.-> O1["Service job work"]
  T -.-> O2["Lead management"]
  T -.-> O3["Employee master"]
  T -.-> O4["Management reports"]
  T -.-> O5["My profile view"]
  T -.-> O6["Master data lists"]
  T -.-> O7["Support and test tools"]
```
