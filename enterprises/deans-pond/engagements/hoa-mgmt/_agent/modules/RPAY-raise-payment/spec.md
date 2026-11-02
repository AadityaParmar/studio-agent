# RPAY — Raise Payment

Prefix: RPAY
Name: Raise Payment
Status: resolved
Sources: RFP-1, WS-1, WS-2, QA-1, QA-2

## 1 Purpose and KPIs

- Purpose: Let Board Members raise a payment for a list of Members; each raise creates one Payment entry per listed Member. [RFP-1, WS-1]
- KPI: Every raise reaches all listed Members; no Member missed. [QA-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Raise payments and pick the Members each raise applies to |  | [RFP-1, WS-1] |
| Member | Cannot raise a payment; sees only the Payment entry created for them (in Payment) |  | [RFP-1] |

- Headcount: no limit on Board Members or Members. [QA-2]

## 3 Process

- AS-IS: some Members are missed when dues are raised. [QA-1]
- TO-BE: Board Member raises payment collection → payment assigned to applicable Members → Member views pending payment (Payment). [RFP-1]
- TO-BE: Board Member picks Members from the member list, or all Members; saving creates one Payment entry per listed Member. [WS-1, WS-2]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Raise Payment | Raise number | text | yes | Auto-numbered, e.g. RPAY-0001 (proposed, to confirm) |  |
| Raise Payment | Payment title | text | yes | Required [QA-1] | [RFP-1, QA-1] |
| Raise Payment | Description | text | no | Optional [QA-1] | [RFP-1, QA-1] |
| Raise Payment | Amount | money | yes | Required [QA-1]; same amount for every listed Member (proposed, to confirm) | [RFP-1, QA-1] |
| Raise Payment | Due date | date | yes | Required [QA-1] | [RFP-1, QA-1] |
| Raise Payment | Applicable members | link-to-entity | yes | Links to: Member. Picked from the member list; select all allowed; no limit. One Payment entry per Member | [RFP-1, WS-1, WS-2] |
| Raise Payment | Payment category | choice | no | Values: Annual dues / Special assessment / Other [QA-1] | [RFP-1, QA-1] |
| Raise Payment | Raised by | person | yes | Links to: Member (Board Member); set automatically (proposed, to confirm) |  |
| Raise Payment | Status | choice | yes | Values: Draft / Raised / Cancelled | [QA-1] |

- Required: Payment title, Amount, Due date, Applicable members; optional: Description. [QA-1]

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start |  | [QA-1] |
| raised |  |  | [QA-1] |
| cancelled | end |  | [QA-1] |

| from | to | trigger | Source |
|---|---|---|---|
| draft | raised | Board Member saves the raise; one Payment entry per listed Member is created | [WS-1, QA-1] |
| raised | cancelled | Board Member cancels the raise; unpaid Payment entries are cancelled | [QA-1] |

- After Raised, only Members can be added. [QA-1]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Board only | Raise payment | Only Board Members can raise a payment collection | [RFP-1] |
| One entry per Member | Raise saved | One Payment entry per listed Member, with the raise's amount and due date | [WS-1] |
| Tracking only | Always | No online payment, no payment gateway | [WS-1] |
| No approval | Raise saved | No second Board Member approval; any Board Member raises | [QA-1] |
| New payment request notification | Raise saved | Each listed Member notified, Neome app notification | [RFP-1, QA-1] |

- Notifications go by Neome app notification only; no email, SMS or WhatsApp. [QA-1]

## 7 Exceptions

- Wrong amount or due date after raising: Board Member cancels the raise and raises again. [QA-1]
- Member missed from a raise: Board Member adds the Member to the raise; one more Payment entry is created. [QA-1]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Raises list | Board Member | Each raise with category, due date, Members count, total amount (proposed, to confirm) |  |

- Board dashboard shows payments due, collected, pending and overdue (Payment). [QA-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Payment raises; Neome is the system of record | Deans Pond HOA | [WS-2] |

- No payment gateway. [WS-1]
- No email, SMS or WhatsApp channel. [QA-1]

## 10 Volumes and NFRs

- No limit on raises or on Members per raise. [WS-2]
- No volume limits; all entries unlimited. [QA-2]

## 11 Requirements

### RPAY-01 — Raise Payment

Statement: Board Members can create a payment request / collection for HOA members. [RFP-1]
Acceptance:
- Board Members can raise payment collections. [RFP-1]
- A Member has no raise action. [RFP-1]
- A raise cannot be saved without Payment title, Amount, Due date and at least one Member. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-18, OI-37
Proposed: no

### RPAY-02 — One Payment entry per listed Member

Statement: Each raise holds a list of Members and inserts one entry per listed Member into Payment. [WS-1]
Acceptance:
- Saving a raise for N Members creates N Payment entries, one per Member, with the raise's amount and due date. [QA-1]
Priority: Must
Scope: Neome
Sources: WS-1, QA-1
OIs: OI-37
Proposed: no

### RPAY-03 — Pick Members, or all

Statement: The Board Member picks the Members for a raise from the member list, or picks all Members; there is no limit on Members per raise. [WS-2]
Acceptance:
- One action selects every Member. [WS-2]
- Only Members in the Member Directory can be picked. [QA-1]
Priority: Must
Scope: Neome
Sources: WS-2, QA-1
OIs: OI-37
Proposed: no

### RPAY-04 — Raise stages and cancel

Statement: A raise moves Draft → Raised with no second Board Member approval, and a Board Member can cancel it, which cancels its unpaid Payment entries. [QA-1]
Acceptance:
- A Draft raise creates no Payment entries. [QA-1]
- Cancelling a raise cancels every unpaid entry; paid entries stay. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-50, OI-49, OI-37
Proposed: no

### RPAY-05 — New payment request notification

Statement: Each listed Member is notified when a payment is raised for them. [RFP-1]
Acceptance:
- On saving a raise, every listed Member gets a notification on the agreed channel. [QA-1]
Priority: Should
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-17, OI-23, OI-37
Proposed: no

### RPAY-06 — Raises list

Statement: Board Members see a list of raises with category, due date, Members count and total amount. [QA-1]
Acceptance:
- A Board Member can filter raises by category and due date. [QA-1]
Priority: Could
Scope: Neome
Sources: QA-1
OIs: OI-26, OI-37
Proposed: no

## 12 Neome mapping

Neome App: none
Delivery: Custom module
How: Raise Payment → new record built on the Neome platform: form with Payment title, Description, Amount, Due date, Payment category master list (Annual dues / Special assessment / Other), Applicable members picked from the Member Directory with select all (Employee Directory people, OI-38); stages Draft / Raised / Cancelled, no approval; on save a workflow automation creates one Payment entry per Member and sends the new payment request notification by Neome app notification; raises list as a sheet with filters; no payment gateway (proposed, to confirm)

## 13 Open Items

- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-38: Can Neome hold HOA Members (not employees) as the Members picked for a raise?
