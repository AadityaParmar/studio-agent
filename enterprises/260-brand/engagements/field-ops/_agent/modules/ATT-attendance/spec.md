# ATT — Attendance

Prefix: ATT
Name: Attendance
Status: resolved
Sources: RFP-1, WS-2

## 1 Purpose and KPIs

- Purpose: Record Employee clock in/out with camera verification, and Overtime. [RFP-1]
- KPI: Every Employee clock in and out recorded with photo and GPS; no Missed Clock-out left unfixed. [WS-2]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Employee | Clocks in and out; requests Overtime. Every Sales Agent, Tricycle Rider and Sales Supervisor is an Employee | 93 (60 Sales Agents, 25 Tricycle Riders, 8 Sales Supervisors) | [RFP-1, WS-2] |
| Sales Supervisor | Approves Overtime; fixes the time of a Missed Clock-out | 8 | [WS-2] |
| Area Sales Manager | Gets Overtime not acted on in 48 hours | 3 | [WS-2] |
| Regional Sales Manager | Sees Attendance and Overtime reports | 2 | [WS-2] |
| Sales Head | Sees Attendance and Overtime reports | 1 | [WS-2] |
| Owner | Sees Attendance and Overtime reports | 1 | [WS-2] |

## 3 Process

- Employee: Add Attendance → Attedance Sheet/Report. [RFP-1]
- Employee: Add overtime → Overtime sheet/report. [RFP-1]
- Employee Attendance marked Completed in RFP-1 scope; the Enterprise says Completed was an old pilot, all is built new. [RFP-1, WS-2]
- Pain today: Attendance not tracked reliably; late arrivals and Overtime hard to check. [WS-2]
- Clock in and out take a selfie photo and GPS location; no face match. [WS-2]
- Late: after 08:15 (start 08:00, grace 15 min, same for all). [WS-2]
- Overtime is hours after 17:00 on weekdays or on Sunday; the Employee requests it and the Sales Supervisor approves. [WS-2]
- No clock out by 23:59: the app clocks out and marks Missed Clock-out; the Sales Supervisor fixes the time. [WS-2]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Attendance | Employee | person | yes | | [RFP-1] |
| Attendance | Clock In | date | yes | date and time | [RFP-1] |
| Attendance | In Camera | file | yes | selfie photo | [RFP-1, WS-2] |
| Attendance | In Location | text | yes | GPS location at clock in | [WS-2] |
| Attendance | Clock Out | date | no | date and time | [RFP-1] |
| Attendance | Out Camera | file | no | selfie photo | [RFP-1, WS-2] |
| Attendance | Out Location | text | no | GPS location at clock out | [WS-2] |
| Attendance | Arrival Status | choice | no | Values: OnTime / Late | [RFP-1, WS-2] |
| Attendance | Clock Out Mark | choice | no | Values: Normal / Missed Clock-out (proposed, to confirm) | |
| Overtime | Date | date | yes | | [RFP-1] |
| Overtime | Employee | person | yes | | [RFP-1] |
| Overtime | From Time | text | yes | | [RFP-1] |
| Overtime | To Time | text | yes | | [RFP-1] |
| Overtime | Remarks | text | no | | [RFP-1] |
| Overtime | Status | choice | yes | Values: Pending / Approved / Rejected | [WS-2] |
| Overtime | Approved By | person | no | Sales Supervisor, or Area Sales Manager after escalation (proposed, to confirm) | |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| pending | start | | [WS-2] |
| approved | end | | [WS-2] |
| rejected | end | | [WS-2] |

| from | to | trigger | Source |
|---|---|---|---|
| pending | approved | Sales Supervisor approves the Overtime | [WS-2] |
| pending | rejected | Sales Supervisor rejects the Overtime | [WS-2] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Late | Clock in after 08:15 | Arrival Status = Late; start 08:00 and grace 15 min are the same for all | [WS-2] |
| Photo and GPS | Employee clocks in or out | Selfie photo and GPS location are taken; no face match | [WS-2] |
| Missed Clock-out | No clock out by 23:59 | App clocks out at 23:59 and marks Missed Clock-out; Sales Supervisor fixes the time | [WS-2] |
| Overtime approval | Employee requests Overtime | Sales Supervisor approves or rejects | [WS-2] |
| Overtime escalation | Sales Supervisor has not acted in 48 hours | Goes to the Area Sales Manager | [WS-2] |
| No extra push | Attendance or Overtime event | No push beyond the events already agreed | [WS-2] |

## 7 Exceptions

- Missed Clock-out: auto clock-out at 23:59, Sales Supervisor fixes the time. [WS-2]
- Overtime rejected: the Employee adds a new request; no reopen. [WS-2]
- Sales Supervisor away: after 48 hours the Area Sales Manager approves. [WS-2]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Attedance Sheet/Report | Sales Supervisor and above | Clock in/out per Employee; filters date, area, supervisor, agent; Excel export | [RFP-1, WS-2] |
| Overtime sheet/report | Sales Supervisor and above | Overtime per Employee with Status; Excel export | [RFP-1, WS-2] |

## 9 Integrations

N/A: Employees come from SAP through Masters; Attendance stays in neome and is not sent to SAP [WS-2].

## 10 Volumes and NFRs

- About 93 Employees, one clock in and one clock out each per day. [WS-2]
- Works offline: clock in and out with no network; syncs when online. [WS-2]

## 11 Requirements

### ATT-01 — Clock in and out with photo and GPS

Statement: An Employee clocks in and out, and a selfie photo and GPS location are taken at each; no face match. [RFP-1, WS-2]
Acceptance:
- Clock in cannot be saved without a photo and a GPS location. [WS-2]
- Clock out saves a photo and a GPS location. [WS-2]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-2
Proposed: no

### ATT-02 — Arrival Status

Statement: Each clock in gets an Arrival Status of OnTime or Late; start 08:00, grace 15 minutes, the same for all. [RFP-1, WS-2]
Acceptance:
- A clock in at 08:15 shows OnTime; at 08:16 shows Late. [WS-2]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-2
Proposed: no

### ATT-03 — Overtime request and approval

Statement: An Employee requests Overtime (hours after 17:00 on weekdays or on Sunday) with Date, From Time, To Time and Remarks; the Sales Supervisor approves or rejects it; Status is Pending, Approved or Rejected. [RFP-1, WS-2]
Acceptance:
- A new request has Status Pending. [WS-2]
- The Sales Supervisor sets it Approved or Rejected. [WS-2]
- A request not acted on in 48 hours goes to the Area Sales Manager. [WS-2]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-2
OIs: OI-27
Proposed: no

### ATT-04 — Attendance and Overtime reports

Statement: Sales Supervisor and above see an Attedance Sheet/Report and an Overtime sheet/report, filtered by date, area, supervisor and agent, with Excel export. [RFP-1, WS-2]
Acceptance:
- The sheet lists each Employee's clock in/out for a chosen date. [WS-2]
- The Overtime report lists Overtime with its Status. [WS-2]
- The sheets export to Excel. [WS-2]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-2
Proposed: no

### ATT-05 — Missed Clock-out

Statement: An Employee with no clock out by 23:59 is clocked out by the app and marked Missed Clock-out; the Sales Supervisor fixes the time. [WS-2]
Acceptance:
- At 23:59 an open Attendance gets Clock Out 23:59 and the mark Missed Clock-out. [WS-2]
- The Sales Supervisor can change the Clock Out time. [WS-2]
Priority: Must
Scope: Neome
Sources: WS-2
OIs: OI-28
Proposed: no

### ATT-06 — Attendance offline

Statement: An Employee clocks in and out with no network; records sync when online. [WS-2]
Acceptance:
- With the phone offline, clock in saves and shows after sync. [WS-2]
Priority: Must
Scope: Neome
Sources: WS-2
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Attendance with Clock In / Clock Out, photo and GPS, Arrival Status → Executive attendance with location verified; the 08:15 Late rule, Missed Clock-out at 23:59, Overtime with Pending / Approved / Rejected, Sales Supervisor approval and 48-hour escalation set up as extra fields, statuses and approval steps; Employee side from Employee Directory; offline sync as platform mechanics; second App `attendance-and-leave` for the sheets (proposed, to confirm)

## 13 Open Items

None open.
