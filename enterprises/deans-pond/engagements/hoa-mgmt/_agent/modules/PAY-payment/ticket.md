---
status: open
prefix: PAY
name: Payment
blockedBy: [RPAY]
revisitReason:
formerly:
claimedBy:
---

# PAY — Payment

Name: Payment

## 1 Purpose and KPIs

- Purpose: Track one Payment entry per Member per raise: Members see their own and get reminders; Board Members see all and record payment. No online payment. [RFP-1, WS-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | View paid and pending payments for all members, track status; record payment received (proposed, to confirm) |  | [RFP-1] |
| Member | View own pending payments, upcoming payments and payment history; receive reminders |  | [RFP-1] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Payment reminder | Approximately one month before a payment due date | The Member receives a reminder (channel TBC, see OI-23) | [RFP-1] |

## 11 Requirements

### PAY-01 — Member payment view

Statement: Each Member can view their current pending payments, upcoming payments, previous payment history, payment amount and payment status, for their own account only. [RFP-1]
Acceptance:
- Members can view their pending payments and payment history. [RFP-1]
- A Member cannot see another Member's payment information. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### PAY-02 — Payment reminder

Statement: Members receive a reminder for upcoming payments approximately one month before the payment due date. [RFP-1]
Acceptance:
- Members receive upcoming payment reminders as defined. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-16, OI-23
Proposed: no

### PAY-03 — Board payment overview

Statement: Board Members can view payments for all members, see paid and pending payments separately, and track payment status. [RFP-1]
Acceptance:
- Board Members can monitor paid and pending payments. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
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

Statement: The system only tracks Payment entries; Members do not pay online and there is no payment gateway. [WS-1]
Acceptance:
- No Payment screen offers an online pay action. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: WS-1
Proposed: yes

### PAY-06 — Board Member records payment received

Statement: A Board Member marks a Member's Payment entry as paid when payment is received. (proposed, to confirm)
Acceptance:
- Once marked paid, the entry moves from pending to paid in the Member's payment history. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: WS-1
OIs: OI-28
Proposed: yes

## 13 Open Items

- OI-16: Should overdue payment reminders also be sent after the due date?
- OI-17: Are new payment request, payment received confirmation, and overdue payment reminder notifications required?
- OI-28: Who marks a Payment entry as paid, and how?
