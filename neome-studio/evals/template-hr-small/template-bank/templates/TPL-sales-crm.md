---
id: TPL-sales-crm
kind: template
name: Small sales office
businessType: Trading or distribution company with a field sales team
modules:
  core: [TMOD-employee-master, TMOD-expenses]
  optional: [TMOD-attendance]
seenIn:
  - {build: NB-84, area: "*"}
  - {build: NB-86, area: "*"}
---

# Small sales office

## Modules

- Core: Employee master (sales reps and their managers), Expenses (claims from the road).
- Optional: Attendance (field check-in).
- The sales pipeline (leads, quotations, orders) runs on the `crm` Neome App; no Template module for it in this Template bank yet.

## Links between modules

- Expenses → Employee master: sales rep and manager (ref).
- Attendance → Employee master (ref).

## Flowchart

```mermaid
flowchart LR
  EM[Employee master]
  EX[Expenses] --> EM
  AT[Attendance] -.-> EM
```
