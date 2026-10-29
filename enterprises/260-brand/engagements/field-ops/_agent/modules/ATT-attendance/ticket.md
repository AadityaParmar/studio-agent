---
status: open
prefix: ATT
name: Attendance
blockedBy: [MST]
revisitReason:
formerly:
claimedBy:
---

# ATT — Attendance

Name: Attendance

## 1 Purpose and KPIs

- Purpose: Record employee clock in/out with camera verification, and overtime. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Employee | Clocks in/out; adds overtime | | [RFP-1] |

## 3 Process

- Employee: Add Attendance → Attedance Sheet/Report. [RFP-1]
- Employee: Add overtime → Overtime sheet/report. [RFP-1]
- Employee Attendance marked Completed in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Attendance | Employee | person | yes | | [RFP-1] |
| Attendance | Clock In | date | yes | date and time | [RFP-1] |
| Attendance | In Camera | file | yes | photo | [RFP-1] |
| Attendance | Clock Out | date | no | date and time | [RFP-1] |
| Attendance | Out Camera | file | no | photo | [RFP-1] |
| Attendance | Arrival Status | choice | no | Values: OnTime / Late | [RFP-1] |
| Overtime | Date | date | yes | | [RFP-1] |
| Overtime | Employee | person | yes | | [RFP-1] |
| Overtime | From Time | text | yes | | [RFP-1] |
| Overtime | To Time | text | yes | | [RFP-1] |
| Overtime | Remarks | text | no | | [RFP-1] |
| Overtime | Status | choice | no | OI-27 | [RFP-1] |

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Attedance Sheet/Report | | Clock in/out per employee | [RFP-1] |
| Overtime sheet/report | | Overtime per employee | [RFP-1] |

## 11 Requirements

### ATT-01 — Clock in and out with photo

Statement: An Employee clocks in and out, and a camera photo is taken at each. [RFP-1]
Acceptance:
- Clock in cannot be saved without a photo. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-26, OI-28
Proposed: yes

### ATT-02 — Arrival Status

Statement: Each clock in gets an Arrival Status of OnTime or Late. [RFP-1]
Acceptance:
- A clock in after the set start time shows Late. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-25
Proposed: yes

### ATT-03 — Overtime entry

Statement: An Employee records overtime with Date, From Time, To Time and Remarks, and it carries a Status. [RFP-1]
Acceptance:
- Saved overtime shows in the Overtime sheet/report with its Status. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-27
Proposed: yes

### ATT-04 — Attendance and overtime sheets

Statement: The system shows an Attedance Sheet/Report and an Overtime sheet/report. [RFP-1]
Acceptance:
- The sheet lists each employee's clock in/out for a chosen date. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

## 13 Open Items

- OI-05: Are Sales Agents and Tricycle Riders Employees too?
- OI-25: Start time and grace for Late.
- OI-26: Photo only or face match; location?
- OI-27: Overtime purpose, approver, Status values.
- OI-28: Missed clock out.
