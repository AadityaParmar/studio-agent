---
id: TPL-hr-small
kind: template
name: Small company HR desk
businessType: Small or mid company running staff HR on mobile
modules:
  core: [TMOD-employee-master, TMOD-attendance, TMOD-leave]          # only TMOD-leave written
  optional: [TMOD-payroll, TMOD-expenses, TMOD-grievance, TMOD-assets] # (not written)
seenIn:
  - {build: NB-05, area: "*"}
---

# Small company HR desk

## Modules

- Core: Employee master, Attendance, Leave.
- Optional: Payroll, Expenses, Grievance, Assets.

## Links between modules

- Leave → Employee master: leave type and employee rows (ref).
- Attendance → Employee master (ref).
- Assets → Employee master (ref).
- Leave → Attendance: approved leave marks attendance (NB-04, not NB-05).
- Payroll: no ref to other areas seen in NB-05 digest.

## Flowchart

```mermaid
flowchart LR
  EM[Employee master]
  AT[Attendance] --> EM
  LV[Leave] --> EM
  LV -.-> AT
  AS[Assets] --> EM
```
