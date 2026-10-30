---
status: claimed
prefix: LEAVE
name: Leave Management
blockedBy: [MST]
revisitReason:
formerly:
claimedBy: Aditya Parmar
---

# LEAVE — Leave Management

Name: Leave Management

## 1 Purpose and KPIs

- Purpose: Employees apply for casual/sick leave with automatic balance checks; supervisor approves. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Employee | Applies for leave | | [RFP-1] |
| Sales Supervisor | Approves or rejects leave (RFP-1 says "supervisor"; OI-04, OI-29) | | (proposed, to confirm) |

## 3 Process

- Employee: Apply Leave → Pending, goes to supervisor for approval → Approved: Update Leave Balance → Leave Sheet; Rejected → Leave Sheet. [RFP-1]
- Leave Management marked Pending in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Leave | Employee | person | yes | | [RFP-1] |
| Leave | Casual/Sick Leave Balance | number | no | Auto, from Employee Master | [RFP-1] |
| Leave | Leave For | choice | yes | Values: Full Day / Half Day | [RFP-1] |
| Leave | Type Of Leave | choice | yes | Values: Casual Leave / Sick Leave | [RFP-1] |
| Leave | From Date | date | yes | | [RFP-1] |
| Leave | To Date | date | yes | | [RFP-1] |
| Leave | Leave Reason | text | no | | [RFP-1] |
| Leave | Status | choice | yes | Values: Pending / Approved / Rejected | [RFP-1] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| pending | start | | [RFP-1] |
| approved | end | | [RFP-1] |
| rejected | end | | [RFP-1] |

| from | to | trigger | Source |
|---|---|---|---|
| pending | approved | Supervisor approves | [RFP-1] |
| pending | rejected | Supervisor rejects | [RFP-1] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Update balance | Leave approved | Leave Balance reduced | [RFP-1] |

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Leave Sheet | | Leaves with status | [RFP-1] |

## 11 Requirements

### LEAVE-01 — Apply for leave

Statement: An Employee applies for Casual or Sick leave, Full Day or Half Day, with From Date, To Date and reason, seeing the balance automatically. [RFP-1]
Acceptance:
- The form shows the employee's current balance for the chosen leave type. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-30, OI-31
Proposed: yes

### LEAVE-02 — Balance check

Statement: Leave applications are checked against the employee's leave balance automatically. [RFP-1]
Acceptance:
- A request for more days than the balance is blocked or flagged. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-30
Proposed: yes

### LEAVE-03 — Supervisor approval

Statement: A leave request starts Pending and goes to the supervisor, who approves or rejects it. [RFP-1]
Acceptance:
- A pending request shows to the supervisor; after approval its Status is Approved. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-29
Proposed: yes

### LEAVE-04 — Update balance on approval

Statement: When leave is approved, the employee's leave balance is updated. [RFP-1]
Acceptance:
- Approving 2 days Casual Leave lowers Casual Leave Balance by 2; rejecting changes nothing. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-22
Proposed: yes

## 13 Open Items

- OI-04: Is "Supervisor" the Sales Supervisor?
- OI-22: Who sets leave balances; quota, accrual.
- OI-29: Who approves; escalation.
- OI-30: Half day deduction; leave beyond balance.
- OI-31: Weekly offs and holidays in leave count.
