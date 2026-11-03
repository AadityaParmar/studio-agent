---
id: TPL-hr-small
kind: template
name: Small company HR desk
businessType: Small or mid company running staff HR on mobile
modules:
  core: [TMOD-employee-master, TMOD-attendance, TMOD-leave]
  optional: [TMOD-expenses]
seenIn:
  - {build: NB-81, area: "*"}
  - {build: NB-83, area: "*"}
---

# Small company HR desk

## Modules

- Core: Employee master, Attendance, Leave.
- Optional: Expenses.

## Links between modules

- Leave → Employee master: employee and line manager (ref).
- Attendance → Employee master (ref).
- Expenses → Employee master: claimant and line manager (ref).
- Leave → Attendance: approved leave marks the day "on leave" (NB-81 only).

## Flowchart

```mermaid
flowchart LR
  EM[Employee master]
  AT[Attendance] --> EM
  LV[Leave] --> EM
  LV -.-> AT
  EX[Expenses] --> EM
```
