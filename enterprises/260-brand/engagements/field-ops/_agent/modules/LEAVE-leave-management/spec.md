# LEAVE — Leave Management

Prefix: LEAVE
Name: Leave Management
Status: resolved
Sources: RFP-1, WS-3

## 1 Purpose and KPIs

- Purpose: Employees apply for Casual or Sick Leave with automatic balance checks; the Sales Supervisor approves. [RFP-1]
- KPI: Every leave request decided by the Sales Supervisor within 48 hours; leave balance always correct with no manual Excel. [WS-3]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Employee | Applies for leave; cancels own Pending request. Every Sales Agent, Tricycle Rider and Sales Supervisor is an Employee | 93 (60 Sales Agents, 25 Tricycle Riders, 8 Sales Supervisors) | [RFP-1, WS-3] |
| Sales Supervisor | Approves or rejects leave of own Employees | 8 | [WS-3] |
| Area Sales Manager | Gets leave not acted on in 48 hours | 3 | [WS-3] |
| Owner | Sets leave balances; keeps the yearly holiday list | 1 | [WS-3] |
| Regional Sales Manager | Sees the Leave register | 2 | [WS-3] |
| Sales Head | Sees the Leave register | 1 | [WS-3] |

## 3 Process

- Employee: Apply Leave → Pending, goes to the Sales Supervisor for approval → Approved: Update Leave Balance → Leave Sheet; Rejected → Leave Sheet. [RFP-1, WS-3]
- Leave Management marked Pending in RFP-1 scope. [RFP-1]
- Pain today: leave tracked on paper and WhatsApp; balances wrong and approvals slow. [WS-3]
- Half Day takes 0.5 day; days beyond the balance are allowed as Unpaid Leave. [WS-3]
- Sundays and public holidays are not counted in leave. [WS-3]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Leave | Employee | person | yes | | [RFP-1] |
| Leave | Casual/Sick Leave Balance | number | no | Auto, from Employee Master | [RFP-1] |
| Leave | Leave For | choice | yes | Values: Full Day / Half Day | [RFP-1, WS-3] |
| Leave | Type Of Leave | choice | yes | Values: Casual Leave / Sick Leave | [RFP-1, WS-3] |
| Leave | From Date | date | yes | | [RFP-1] |
| Leave | To Date | date | yes | | [RFP-1] |
| Leave | Leave Reason | text | no | | [RFP-1] |
| Leave | Days | number | no | Auto; Half Day = 0.5; Sundays and holidays not counted | [WS-3] |
| Leave | Unpaid Days | number | no | Days beyond the balance | [WS-3] |
| Leave | Status | choice | yes | Values: Pending / Approved / Rejected | [RFP-1, WS-3] |
| Leave | Approved By | person | no | Sales Supervisor, or Area Sales Manager after escalation (proposed, to confirm) | |
| Leave Balance | Employee | person | yes | | [WS-3] |
| Leave Balance | Type Of Leave | choice | yes | Values: Casual Leave / Sick Leave | [WS-3] |
| Leave Balance | Year Quota | number | yes | Casual 12, Sick 10, credited 1 Jan; set by the Owner | [WS-3] |
| Leave Balance | Carry Forward | number | no | Casual up to 5; Sick none | [WS-3] |
| Holiday | Date | date | yes | | [WS-3] |
| Holiday | Name | text | yes | Zambia public holiday | [WS-3] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| pending | start | | [RFP-1, WS-3] |
| approved | end | | [RFP-1, WS-3] |
| rejected | end | | [RFP-1, WS-3] |

| from | to | trigger | Source |
|---|---|---|---|
| pending | approved | Sales Supervisor approves | [RFP-1, WS-3] |
| pending | rejected | Sales Supervisor rejects | [RFP-1, WS-3] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Update balance | Leave approved | Leave Balance reduced by the days | [RFP-1, WS-3] |
| Yearly credit | 1 January | Casual 12 and Sick 10 days credited; Casual carries forward max 5, Sick none | [WS-3] |
| Half Day | Leave For = Half Day | 0.5 day taken from the balance | [WS-3] |
| Beyond balance | Request is for more days than the balance | Allowed; the extra days are Unpaid Leave | [WS-3] |
| Days not counted | Leave spans a Sunday or public holiday | Those days are not counted | [WS-3] |
| Approval | Employee applies | The Employee's Sales Supervisor approves or rejects | [WS-3] |
| Escalation | Sales Supervisor has not acted in 48 hours | Goes to the Area Sales Manager | [WS-3] |
| Push on decision | Leave approved or rejected | Push to the Employee; no other push | [WS-3] |

## 7 Exceptions

- Sales Supervisor away: after 48 hours the Area Sales Manager decides. [WS-3]
- Leave rejected: the Employee adds a new request; no reopen. [WS-3]
- Employee can cancel own Pending request; approved leave cannot be cancelled by the Employee. [WS-3]
- Leave beyond balance: allowed as Unpaid Leave. [WS-3]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Leave Sheet | | Leaves with status | [RFP-1] |
| Leave register | Sales Supervisor and above | Leave per Employee with Status and days; filters date, area, supervisor, agent; Excel export | [RFP-1, WS-3] |

## 9 Integrations

N/A: Employees come from SAP through Masters; leave stays in neome and is not sent to SAP [WS-3].

## 10 Volumes and NFRs

- About 93 Employees; a few leave requests a day. [WS-3]
- Online only: applying and approving leave needs network. [WS-3]

## 11 Requirements

### LEAVE-01 — Apply for leave

Statement: An Employee applies for Casual or Sick Leave, Full Day or Half Day, with From Date, To Date and reason, seeing the balance automatically; Half Day takes 0.5 day and Sundays and public holidays are not counted. [RFP-1, WS-3]
Acceptance:
- The form shows the Employee's current balance for the chosen leave type. [WS-3]
- A Half Day request takes 0.5 day. [WS-3]
- A request from Friday to Monday counts Friday and Monday only (Sunday not counted). [WS-3]
- A request for more days than the balance can be sent; the extra days are marked Unpaid Leave. [WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
OIs: OI-30, OI-31
Proposed: no

### LEAVE-02 — Balance check

Statement: Leave applications are checked against the Employee's leave balance automatically; days beyond the balance become Unpaid Leave. [RFP-1, WS-3]
Acceptance:
- A request for more days than the balance shows the Unpaid Days before it is sent. [WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
OIs: OI-30
Proposed: no

### LEAVE-03 — Supervisor approval

Statement: A leave request starts Pending and goes to the Employee's Sales Supervisor, who approves or rejects it; if not acted on in 48 hours it goes to the Area Sales Manager. [RFP-1, WS-3]
Acceptance:
- A pending request shows to the Sales Supervisor; after approval its Status is Approved. [WS-3]
- A request not acted on in 48 hours goes to the Area Sales Manager. [WS-3]
- The Employee can cancel own Pending request; a rejected request is not reopened, the Employee adds a new one. [WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
OIs: OI-29
Proposed: no

### LEAVE-04 — Update balance on approval

Statement: When leave is approved, the Employee's leave balance is updated. [RFP-1, WS-3]
Acceptance:
- Approving 2 days Casual Leave lowers Casual Leave Balance by 2; rejecting changes nothing. [WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
OIs: OI-22
Proposed: no

### LEAVE-05 — Leave balance set-up

Statement: The Owner sets the yearly leave balances: Casual 12 days and Sick 10 days, credited 1 January; Casual carries forward max 5 days, Sick none. [WS-3]
Acceptance:
- On 1 January each Employee gets 12 Casual and 10 Sick days. [WS-3]
- An unused Casual balance of 8 carries forward as 5; unused Sick carries forward as 0. [WS-3]
Priority: Must
Scope: Neome
Sources: WS-3
OIs: OI-22
Proposed: no

### LEAVE-06 — Holiday list

Statement: The Owner keeps a yearly list of Zambian public holidays; Sundays and listed holidays are not counted in leave. [WS-3]
Acceptance:
- A public holiday on the list inside a leave request is not counted. [WS-3]
Priority: Must
Scope: Neome
Sources: WS-3
OIs: OI-31
Proposed: no

### LEAVE-07 — Leave register

Statement: Sales Supervisor and above see a Leave register, filtered by date, area, supervisor and agent, with Excel export. [RFP-1, WS-3]
Acceptance:
- The register lists each Employee's leave with Status and days. [WS-3]
- The register exports to Excel. [WS-3]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-3
Proposed: no

### LEAVE-08 — Push on leave decision

Statement: The Employee gets a push when leave is approved or rejected; no other leave push. [WS-3]
Acceptance:
- Approving or rejecting a request sends a push to the Employee. [WS-3]
Priority: Should
Scope: Neome
Sources: WS-3
Proposed: no

## 12 Neome mapping

Neome App: `attendance-and-leave`
Delivery: Configuration
How: Leave with Leave For, Type Of Leave, dates, Status → Leave request; Leave Balance → Leave type with quota and Leave balance, set up with the Owner's yearly quota, Casual carry forward of 5 and Unpaid Days beyond balance; routing to the Sales Supervisor with 48-hour escalation to the Area Sales Manager → line manager approval from Employee Directory with platform escalation; Holiday List added as an extra record so Sundays and holidays are not counted; Leave register is not one of the App's named reports, so set up as a report with filters and Excel export; push on decision as platform mechanics (proposed, to confirm)

## 13 Open Items

None open.
