# RPAY — Raise Payment

Prefix: RPAY
Name: Raise Payment
Status: resolved
Sources: RFP-1, WS-1, WS-2

## 1 Purpose and KPIs

- Purpose: Let Board Members raise a payment for a list of Members; each raise creates one Payment entry per listed Member. [RFP-1, WS-1]
- KPI: Every raise reaches all listed Members; no Member missed. (proposed, to confirm)
- OI-48: What must Raise Payment fix today, and which number shows it works?

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Raise payments and pick the Members each raise applies to |  | [RFP-1, WS-1] |
| Member | Cannot raise a payment; sees only the Payment entry created for them (in Payment) |  | [RFP-1] |

- OI-27: Headcount of Board Members and Members not stated.

## 3 Process

- OI-48: How dues are raised today, and what goes wrong, is not stated.
- TO-BE: Board Member raises payment collection → payment assigned to applicable Members → Member views pending payment (Payment). [RFP-1]
- TO-BE: Board Member picks Members from the member list, or all Members; saving creates one Payment entry per listed Member. [WS-1, WS-2]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Raise Payment | Raise number | text | yes | Auto-numbered, e.g. RPAY-0001 (proposed, to confirm) |  |
| Raise Payment | Payment title | text | yes | required-ness open, see OI-18 | [RFP-1] |
| Raise Payment | Description | text | no | required-ness open, see OI-18 | [RFP-1] |
| Raise Payment | Amount | money | yes | Same amount for every listed Member (proposed, to confirm); see OI-18 | [RFP-1] |
| Raise Payment | Due date | date | yes | required-ness open, see OI-18 | [RFP-1] |
| Raise Payment | Applicable members | link-to-entity | yes | Links to: Member. Picked from the member list; select all allowed; no limit. One Payment entry per Member | [RFP-1, WS-1, WS-2] |
| Raise Payment | Payment category | choice | no | Values: Annual dues / Special assessment / Other (proposed, to confirm); see OI-18 | [RFP-1] |
| Raise Payment | Raised by | person | yes | Links to: Member (Board Member); set automatically (proposed, to confirm) |  |
| Raise Payment | Status | choice | yes | Values: Draft / Raised / Cancelled (proposed, to confirm); see OI-50 |  |

- OI-18: Which fields and payment categories apply to a Raise Payment?

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start | OI-50 | (proposed, to confirm) |
| raised |  | OI-50 | (proposed, to confirm) |
| cancelled | end | OI-50 | (proposed, to confirm) |

| from | to | trigger | Source |
|---|---|---|---|
| draft | raised | Board Member saves the raise; one Payment entry per listed Member is created (proposed, to confirm) |  |
| raised | cancelled | Board Member cancels the raise; unpaid Payment entries are cancelled (proposed, to confirm) |  |

- OI-50: What stages does a raise have, and can it be changed or cancelled after Payment entries are created?

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Board only | Raise payment | Only Board Members can raise a payment collection | [RFP-1] |
| One entry per Member | Raise saved | One Payment entry per listed Member, with the raise's amount and due date | [WS-1] |
| Tracking only | Always | No online payment, no payment gateway | [WS-1] |
| No approval | Raise saved | No second Board Member approval (proposed, to confirm) |  |
| New payment request notification | Raise saved | Each listed Member notified (needs confirmation) | [RFP-1] |

- OI-49: Does a raise need another Board Member's approval before Payment entries are created?
- OI-17: Are new payment request notifications required?
- OI-23: Which notification channels?

## 7 Exceptions

- Wrong amount or due date after raising: Board Member cancels the raise and raises again. (proposed, to confirm)
- Member missed from a raise: Board Member adds the Member to the raise; one more Payment entry is created. (proposed, to confirm)
- OI-50: Can a raise be changed or cancelled after Payment entries are created?

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Raises list | Board Member | Each raise with category, due date, Members count, total amount (proposed, to confirm) |  |

- OI-26: Reporting and dashboard requirements not yet defined.

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Payment raises; Neome is the system of record | Deans Pond HOA | [WS-2] |

- No payment gateway. [WS-1]
- OI-23: Email / SMS / WhatsApp channels open.

## 10 Volumes and NFRs

- No limit on raises or on Members per raise. [WS-2]
- OI-27: Number of Members and raises per month not stated.

## 11 Requirements

### RPAY-01 — Raise Payment

Statement: Board Members can create a payment request / collection for HOA members. [RFP-1]
Acceptance:
- Board Members can raise payment collections. [RFP-1]
- A Member has no raise action. [RFP-1]
- A raise cannot be saved without Payment title, Amount, Due date and at least one Member. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-18, OI-37
Proposed: yes

### RPAY-02 — One Payment entry per listed Member

Statement: Each raise holds a list of Members and inserts one entry per listed Member into Payment. [WS-1]
Acceptance:
- Saving a raise for N Members creates N Payment entries, one per Member, with the raise's amount and due date. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: WS-1
OIs: OI-37
Proposed: yes

### RPAY-03 — Pick Members, or all

Statement: The Board Member picks the Members for a raise from the member list, or picks all Members; there is no limit on Members per raise. [WS-2]
Acceptance:
- One action selects every Member. [WS-2]
- Only Members in the Member Directory can be picked. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: WS-2
OIs: OI-37
Proposed: yes

### RPAY-04 — Raise stages and cancel

Statement: A raise moves Draft → Raised with no second Board Member approval, and a Board Member can cancel it, which cancels its unpaid Payment entries. (proposed, to confirm)
Acceptance:
- A Draft raise creates no Payment entries. (proposed, to confirm)
- Cancelling a raise cancels every unpaid entry; paid entries stay. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-50, OI-49, OI-37
Proposed: yes

### RPAY-05 — New payment request notification

Statement: Each listed Member is notified when a payment is raised for them. [RFP-1]
Acceptance:
- On saving a raise, every listed Member gets a notification on the agreed channel. (proposed, to confirm)
Priority: Should
Scope: Neome TBC
Sources: RFP-1
OIs: OI-17, OI-23, OI-37
Proposed: yes

### RPAY-06 — Raises list

Statement: Board Members see a list of raises with category, due date, Members count and total amount. (proposed, to confirm)
Acceptance:
- A Board Member can filter raises by category and due date. (proposed, to confirm)
Priority: Could
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-26, OI-37
Proposed: yes

## 12 Neome mapping

Neome App: none
Delivery: Custom module
How: Raise Payment → new record built on the Neome platform: form with Payment title, Description, Amount, Due date, Payment category master list (OI-18), Applicable members picked from the Member Directory with select all (Employee Directory people, OI-38); stages Draft / Raised / Cancelled (OI-50), no approval (OI-49); on save a workflow automation creates one Payment entry per Member and sends the new payment request notification (OI-17, OI-23); raises list as a sheet with filters; no payment gateway (proposed, to confirm)

## 13 Open Items

- OI-17: Is a new payment request notification required?
- OI-18: Which fields and payment categories apply to a Raise Payment?
- OI-23: Which notification channels — Neome application notification, email, SMS, WhatsApp?
- OI-24: Existing data may need migration.
- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-26: Reporting and dashboard requirements not yet defined.
- OI-27: Number of Members and raises not stated.
- OI-29: Currency, language, date format.
- OI-30: Hosting, data residency, SSO needs.
- OI-31: Who trains Board Members and Members.
- OI-32: Support after go-live.
- OI-37: Confirm proposed priority, Scope tag and acceptance criteria of RPAY Requirements.
- OI-38: Can Neome hold HOA Members (not employees) as the Members picked for a raise?
- OI-48: What must Raise Payment fix today, and which KPI shows it works?
- OI-49: Does a raise need another Board Member's approval?
- OI-50: Raise stages; change or cancel after Payment entries are created.
