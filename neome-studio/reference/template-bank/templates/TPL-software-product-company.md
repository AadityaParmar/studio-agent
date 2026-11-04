---
id: TPL-software-product-company
kind: template
name: Software product company
businessType: "Builds and sells software; runs leads, delivery projects, tickets, HR and office expenses in one app."
modules:
  core: [TMOD-lead-management, TMOD-ticket-tracker, TMOD-leave, TMOD-employee-master]
  optional: [TMOD-office-petty-cash, TMOD-asset-allocation, TMOD-bulk-marketing-messages, TMOD-management-reports]
seenIn:
  - {build: NB-07, area: "*"}
---

# Software product company

## Modules

Core:

- TMOD-lead-management (Lead management)
- TMOD-ticket-tracker (Ticket tracker)
- TMOD-leave (Leave)
- TMOD-employee-master (Employee master)

Optional:

- TMOD-office-petty-cash (Office petty cash)
- TMOD-asset-allocation (Asset allocation)
- TMOD-bulk-marketing-messages (Bulk marketing messages)
- TMOD-management-reports (Management reports)

## Links between modules

- Projects come from won leads; tickets ref the project.
- Tickets ref the customer list.
- Leave reads the employee master.

## Flowchart

```mermaid
flowchart LR
  T["Software product company"]
  T --> C0["Lead management"]
  T --> C1["Ticket tracker"]
  T --> C2["Leave"]
  T --> C3["Employee master"]
  T -.-> O0["Office petty cash"]
  T -.-> O1["Asset allocation"]
  T -.-> O2["Bulk marketing messages"]
  T -.-> O3["Management reports"]
```
