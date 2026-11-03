---
id: TPL-field-sales-company
kind: template
name: Field sales company
businessType: "Runs a field sales team that visits dealers, sites and customers; tracks attendance, leave, claims and location, and often leads, quotes and orders."
modules:
  core: [TMOD-attendance, TMOD-leave, TMOD-expense-claims, TMOD-field-visits, TMOD-employee-master, TMOD-master-data]
  optional: [TMOD-visit-planning, TMOD-location-tracking, TMOD-lead-management, TMOD-quotation, TMOD-sales-order, TMOD-customer-master, TMOD-customer-complaints, TMOD-my-profile, TMOD-management-reports, TMOD-office-petty-cash, TMOD-samples, TMOD-new-product-request, TMOD-credit-note-request, TMOD-dealer-stock-count, TMOD-weekly-update, TMOD-knowledge-library, TMOD-bulk-marketing-messages, TMOD-site-project-pipeline, TMOD-contact-meet-log, TMOD-support-tools, TMOD-inventory, TMOD-ticket-tracker]
seenIn:
  - {build: NB-02, area: "*"}
  - {build: NB-04, area: "*"}
---

# Field sales company

## Modules

Core:

- TMOD-attendance (Attendance)
- TMOD-leave (Leave)
- TMOD-expense-claims (Expense claims)
- TMOD-field-visits (Field visits)
- TMOD-employee-master (Employee master)
- TMOD-master-data (Master data lists)

Optional:

- TMOD-visit-planning (Visit planning)
- TMOD-location-tracking (Field staff location tracking)
- TMOD-lead-management (Lead management)
- TMOD-quotation (Quotation)
- TMOD-sales-order (Sales order)
- TMOD-customer-master (Customer master)
- TMOD-customer-complaints (Customer complaints)
- TMOD-my-profile (My profile view)
- TMOD-management-reports (Management reports)
- TMOD-office-petty-cash (Office petty cash)
- TMOD-samples (Samples given)
- TMOD-new-product-request (New product request)
- TMOD-credit-note-request (Credit note request)
- TMOD-dealer-stock-count (Dealer stock count)
- TMOD-weekly-update (Weekly update note)
- TMOD-knowledge-library (Knowledge library)
- TMOD-bulk-marketing-messages (Bulk marketing messages)
- TMOD-site-project-pipeline (Site project pipeline)
- TMOD-contact-meet-log (Contact meet log)
- TMOD-support-tools (Support and test tools)
- TMOD-inventory (Inventory and stock)
- TMOD-ticket-tracker (Ticket tracker)

## Links between modules

- Clients, leads and expenses pick from master data lists (place, category, expense category).
- Visits ref planned visits; follow-ups add new plans.
- Quotation refs customer; order refs quotation and visit.
- Clock and visit events feed the location trail.
- Petty cash is given to an employee.

## Flowchart

```mermaid
flowchart LR
  T["Field sales company"]
  T --> C0["Attendance"]
  T --> C1["Leave"]
  T --> C2["Expense claims"]
  T --> C3["Field visits"]
  T --> C4["Employee master"]
  T --> C5["Master data lists"]
  T -.-> O0["Visit planning"]
  T -.-> O1["Field staff location tracking"]
  T -.-> O2["Lead management"]
  T -.-> O3["Quotation"]
  T -.-> O4["Sales order"]
  T -.-> O5["Customer master"]
  T -.-> O6["Customer complaints"]
  T -.-> O7["My profile view"]
  T -.-> O8["Management reports"]
  T -.-> O9["Office petty cash"]
  T -.-> O10["Samples given"]
  T -.-> O11["New product request"]
  T -.-> O12["Credit note request"]
  T -.-> O13["Dealer stock count"]
  T -.-> O14["Weekly update note"]
  T -.-> O15["Sales material library"]
  T -.-> O16["Bulk marketing messages"]
  T -.-> O17["Site project pipeline"]
  T -.-> O18["Contact meet log"]
  T -.-> O19["Support and test tools"]
  T -.-> O20["Inventory and stock"]
  T -.-> O21["Ticket tracker"]
```
