# PAY — Payment

Prefix: PAY
Name: Payment
Status: claimed
Sources: RFP-1, WS-1, WS-2, WS-3, QA-1, QA-2

## 1 Purpose and KPIs

- Purpose: Track one Payment entry per Member per raise: Members see their own and get reminders; Board Members see all and record payment. No online payment. [RFP-1, WS-1]
- KPI: More Payment entries paid by the due date; no overdue entry left unchased. [WS-3]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | View all Payment entries (paid, pending, overdue); record payment with proof; waive; undo a wrong Paid; only role that changes status |  | [RFP-1, WS-3] |
| Member | View own Payment entries and history; download invoice; see own proof of payment; receive reminders; no status action |  | [RFP-1, WS-3] |

- Headcount: no limit on Board Members or Members; all entries unlimited. [QA-2]

## 3 Process

- Pain: Members must get notification alerts for dues. [WS-3]
- AS-IS: dues tracked in a spreadsheet; Board chases unpaid Members by hand and misses some. [QA-1]
- TO-BE: Raise Payment creates Payment entry → Member views pending payment → reminder one month before due date → Board Member records payment with proof → payment history updated. [RFP-1, WS-1, WS-3]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Payment | Payment number | text | yes | Auto-numbered, e.g. PAY-0001 (proposed, to confirm) |  |
| Payment | Raise Payment | link-to-entity | yes | Links to: Raise Payment. Set when the raise is saved | [WS-1] |
| Payment | Member | link-to-entity | yes | Links to: Member | [WS-1] |
| Payment | Payment title | text | yes | Copied from the raise (proposed, to confirm) | [RFP-1] |
| Payment | Amount | money | yes | Copied from the raise; no partial payment | [RFP-1, WS-3] |
| Payment | Due date | date | yes | Copied from the raise | [RFP-1] |
| Payment | Status | choice | yes | Values: Pending / Overdue / Paid / Waived / Cancelled | [WS-3] |
| Payment | Paid date | date | no | Required when marked Paid | [WS-3] |
| Payment | Payment method | choice | no | Values: Check / Bank transfer / Cash / Other. Required when marked Paid | [WS-3] |
| Payment | Reference number | text | no | Optional | [WS-3] |
| Payment | Proof of payment | file | no | Document upload by Board Member; seen by Board Members and own Member only; optional [QA-1] | [WS-3] |
| Payment | Status reason | text | no | Required on Waived and on undo of a wrong Paid | [WS-3] |
| Payment | Recorded by | person | no | Board Member who marked Paid; set automatically (proposed, to confirm) |  |
| Invoice | (PDF per Payment entry) | file | no | Made by Neome: HOA name, Member, title, amount, due date, status; once Paid adds paid date and method | [WS-3] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| pending | start |  | [RFP-1, WS-3] |
| overdue |  |  | [WS-3] |
| paid | end |  | [RFP-1, WS-3] |
| waived | end |  | [WS-3] |
| cancelled | end |  | [WS-3] |

| from | to | trigger | Source |
|---|---|---|---|
| pending | overdue | Due date passes (automatic) | [WS-3] |
| pending | paid | Board Member records payment | [WS-3] |
| overdue | paid | Board Member records payment | [WS-3] |
| pending | waived | Board Member waives with a reason | [WS-3] |
| overdue | waived | Board Member waives with a reason | [WS-3] |
| pending | cancelled | Raise is cancelled | [WS-3] |
| overdue | cancelled | Raise is cancelled | [WS-3] |
| paid | pending | Board Member undoes a wrong Paid with a reason, due date not passed | [WS-3] |
| paid | overdue | Board Member undoes a wrong Paid with a reason, due date passed | [WS-3] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Board only status | Any status change | Only Board Members change Payment status | [WS-3] |
| Tracking only | Always | No online payment, no payment gateway | [WS-1] |
| No partial payment | Recording payment | Entry is paid in full or stays Pending / Overdue | [WS-3] |
| Payment reminder | About one month before the due date | Member notified, Neome app notification and email | [RFP-1, WS-3] |
| Overdue reminder | Weekly after the due date until Paid, Waived or Cancelled | Member notified, Neome app notification and email | [WS-3] |
| Payment received | Entry marked Paid | Member notified, Neome app notification and email | [WS-3] |
| Change log | Status changes | Each change kept with who, when and reason | [WS-3] |

- OI-23: Notification channels for the other Modules still open; Payment uses Neome app notification and email. [WS-3]

## 7 Exceptions

- Entry marked Paid by mistake: Board Member sets it back to Pending / Overdue with a reason; the change is logged. [WS-3]
- Member not liable: Board Member sets Waived with a reason; final. [WS-3]
- Raise cancelled: open entries become Cancelled. [WS-3]
- Part payment: not allowed; entry stays Pending / Overdue until paid in full. [WS-3]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Payment dashboard | Board Member | Total due, collected, pending, overdue; by raise and by Member | [RFP-1, WS-3] |
| Overdue list | Board Member | Overdue entries with Member, raise, due date, amount | [WS-3] |
| My payments | Member | Own pending, upcoming, history, amount, status | [RFP-1] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Payment entries; Neome is the system of record | Deans Pond HOA | [WS-3] |

- No payment gateway; no accounting software link. [WS-1, WS-3]
- Notifications go by Neome app notification and email. [WS-3]

## 10 Volumes and NFRs

- No limit on raises, so no limit on Payment entries. [WS-2, WS-3]
- Retention: no limit; Payment entries kept. [WS-3]
- Devices: Members mostly on phone; Board Members on phone or desk. [QA-1]
- No volume limits; all entries unlimited. [QA-2]

## 11 Requirements

### PAY-01 — Member payment view

Statement: Each Member can view their current pending payments, upcoming payments, previous payment history, payment amount and payment status, for their own account only. [RFP-1, WS-3]
Acceptance:
- Members can view their pending payments and payment history. [RFP-1]
- A Member cannot see another Member's payment information. [WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
Proposed: no

### PAY-02 — Payment reminder

Statement: Members receive a reminder for upcoming payments approximately one month before the payment due date, by Neome app notification and email. [RFP-1, WS-3]
Acceptance:
- Members receive upcoming payment reminders about one month before the due date, in the app and by email. [RFP-1, WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
OIs: OI-16, OI-23
Proposed: no

### PAY-03 — Board payment overview

Statement: Board Members can view payments for all members, see paid, pending and overdue payments separately, and track payment status. [RFP-1, WS-3]
Acceptance:
- Board Members can monitor paid, pending and overdue payments. [RFP-1, WS-3]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-3
Proposed: no

### PAY-04 — Raise payment collection

Statement: Board Members can create a payment request / collection for HOA members. [RFP-1]
Acceptance:
- Board Members can raise payment collections. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-18
Proposed: no
Withdrawn: Moved to RPAY-01

### PAY-05 — Payment tracking only

Statement: The system only tracks Payment entries; Members do not pay online and there is no payment gateway. [WS-1, WS-3]
Acceptance:
- No Payment screen offers an online pay action. [WS-3]
Priority: Must
Scope: Neome
Sources: WS-1, WS-3
Proposed: no

### PAY-06 — Board Member records payment received

Statement: A Board Member marks a Member's Payment entry as Paid, recording paid date, payment method, an optional reference number and a proof of payment document. [WS-3]
Acceptance:
- Once marked Paid, the entry moves from pending to paid in the Member's payment history. [WS-3]
- The proof of payment document is visible to Board Members and to the entry's own Member only. [WS-3]
Priority: Must
Scope: Neome
Sources: WS-1, WS-3
OIs: OI-28, OI-53
Proposed: no

### PAY-07 — Only Board changes status

Statement: Only Board Members can change a Payment entry's status. [WS-3]
Acceptance:
- A Member has no status action on any Payment entry. [WS-3]
Priority: Must
Scope: Neome
Sources: WS-3
Proposed: no

### PAY-08 — Payment stages

Statement: A Payment entry moves Pending → Overdue automatically after the due date, and ends Paid, Waived (with a reason) or Cancelled (raise cancelled); part payment is not allowed. [WS-3]
Acceptance:
- An unpaid entry shows Overdue the day after its due date. [WS-3]
- Waived needs a reason. [WS-3]
- An entry cannot be marked paid for part of its amount. [WS-3]
Priority: Must
Scope: Neome
Sources: WS-3
Proposed: no

### PAY-09 — Download invoice

Statement: A Member can download a PDF invoice for each of their Payment entries. [WS-3]
Acceptance:
- The invoice shows HOA name, Member, title, amount, due date and status; once Paid it adds paid date and method. [WS-3]
Priority: Should
Scope: Neome
Sources: WS-3
Proposed: no

### PAY-10 — Overdue reminder

Statement: A Member receives an overdue reminder weekly after the due date until the entry is Paid, Waived or Cancelled. [WS-3]
Acceptance:
- Reminders stop once the entry is Paid, Waived or Cancelled. [WS-3]
Priority: Should
Scope: Neome
Sources: WS-3
OIs: OI-16
Proposed: no

### PAY-11 — Payment received notification

Statement: A Member is notified when a Board Member marks their Payment entry Paid. [WS-3]
Acceptance:
- The Member gets an app notification and email when the entry is marked Paid. [WS-3]
Priority: Should
Scope: Neome
Sources: WS-3
Proposed: no

### PAY-12 — Board payment dashboard

Statement: Board Members see total due, collected, pending and overdue amounts, by raise and by Member, and an overdue list. [WS-3]
Acceptance:
- A Board Member can filter the dashboard by raise and by Member. [WS-3]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-3
Proposed: no

### PAY-13 — Undo wrong Paid

Statement: A Board Member can set a wrongly Paid entry back to Pending or Overdue with a reason; the change is logged. [WS-3]
Acceptance:
- The log shows who changed it, when and why. [WS-3]
Priority: Should
Scope: Neome
Sources: WS-3
Proposed: no

### PAY-14 — Keep payment records

Statement: Payment entries, proof of payment documents and status changes are kept with no time limit. [WS-3]
Acceptance:
- A Board Member can open any past Payment entry with its proof and change log. [QA-1]
Priority: Must
Scope: Neome
Sources: WS-3, QA-1
OIs: OI-37
Proposed: no

## 12 Neome mapping

Neome App: none
Delivery: Custom module
How: Payment → new record built on the Neome platform, created by the Raise Payment workflow, one per Member (Member Directory people, OI-38); fields incl. paid date, method master list, reference, proof of payment file; stages Pending / Overdue / Paid / Waived / Cancelled with Board-only actions and audit trail; reminder automations (one month before due, weekly overdue) and payment received notification by app and email (OI-23); invoice PDF per entry; Member sheet scoped to own entries, Board sheet and dashboard; no payment gateway (proposed, to confirm)

## 13 Open Items

- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
