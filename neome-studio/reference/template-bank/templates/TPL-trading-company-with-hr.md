---
id: TPL-trading-company-with-hr
kind: template
name: Trading company with HR
businessType: "Sells products to retailers and distributors through salesmen and runs staff attendance, leave, claims and payroll in the same app."
modules:
  core: [TMOD-master-data, TMOD-customer-master, TMOD-lead-management, TMOD-quotation, TMOD-sales-order, TMOD-field-visits, TMOD-attendance, TMOD-leave, TMOD-payroll, TMOD-employee-master]
  optional: [TMOD-expense-claims, TMOD-asset-allocation, TMOD-employee-grievance, TMOD-management-reports, TMOD-purchase-orders]
seenIn:
  - {build: NB-05, area: "*"}
---

# Trading company with HR

## Modules

Core:

- TMOD-master-data (Master data lists)
- TMOD-customer-master (Customer master)
- TMOD-lead-management (Lead management)
- TMOD-quotation (Quotation)
- TMOD-sales-order (Sales order)
- TMOD-field-visits (Field visits)
- TMOD-attendance (Attendance)
- TMOD-leave (Leave)
- TMOD-payroll (Payroll)
- TMOD-employee-master (Employee master)

Optional:

- TMOD-expense-claims (Expense claims)
- TMOD-asset-allocation (Asset allocation)
- TMOD-employee-grievance (Employee grievance)
- TMOD-management-reports (Management reports)
- TMOD-purchase-orders (Purchase orders)

## Links between modules

- Lead, quotation and visit ref customer and product from master data.
- Quotation refs lead; order refs quotation.
- Leave refs leave type; attendance refs department and designation.
- Asset allocation refs the employee.
- Payroll reads attendance and leave.

## Flowchart

```mermaid
flowchart LR
  T["Trading company with HR"]
  T --> C0["Master data lists"]
  T --> C1["Customer master"]
  T --> C2["Lead management"]
  T --> C3["Quotation"]
  T --> C4["Sales order"]
  T --> C5["Field visits"]
  T --> C6["Attendance"]
  T --> C7["Leave"]
  T --> C8["Payroll"]
  T --> C9["Employee master"]
  T -.-> O0["Expense claims"]
  T -.-> O1["Asset allocation"]
  T -.-> O2["Employee grievance"]
  T -.-> O3["Management reports"]
  T -.-> O4["Purchase orders"]
```
