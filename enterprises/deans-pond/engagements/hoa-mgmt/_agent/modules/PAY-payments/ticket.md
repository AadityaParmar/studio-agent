---
status: open
prefix: PAY
name: Payments
draft: true
blockedBy: []
---

# PAY — Payments

Name: Payments

## 1 Purpose and KPIs

- Purpose: Let Board Members manage HOA payment obligations and Members view their payment information. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Raise payment collections, view paid and pending payments for all members, track status |  | [RFP-1] |
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

## 13 Open Items

- OI-14: How will HOA payments actually be collected?
- OI-15: Will Members pay online through the Neome platform, or will the system only track payment records?
- OI-16: Should overdue payment reminders also be sent after the due date?
- OI-17: Are new payment request, payment received confirmation, and overdue payment reminder notifications required?
- OI-18: Which fields and payment categories apply to a payment collection?
