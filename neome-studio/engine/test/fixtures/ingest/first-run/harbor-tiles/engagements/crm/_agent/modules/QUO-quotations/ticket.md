---
status: open
prefix: QUO
name: Quotations
draft: true
blockedBy: []
---

# QUO — Quotations

Name: Quotations

## 1 Purpose and KPIs

- Purpose: Send priced quotations to serious enquiries, with discount and credit checks, before invoicing in Tally. [CE-1, CE-2]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales exec | Makes and sends quotations | 9 | [CE-1] |
| Sales head | Approves discounts above the usual | 1 | [CE-1] |
| Accounts | Checks unpaid bills; raises invoices in Tally | | [CE-1, CE-2] |

## 3 Process

- Quotations are made in Excel and emailed as PDF. [CE-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Tally | out | Accepted quotation for invoicing | OI-03 | [CE-1] |

## 11 Requirements

### QUO-01 — Make and send a quotation

Statement: A sales exec makes a quotation for an enquiry and emails it to the buyer as a PDF. [CE-1]
Acceptance:
- A quotation made from an enquiry is emailed to the buyer as a PDF. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1
Proposed: yes

### QUO-02 — Discount approval

Statement: A discount above the usual needs the sales head's approval before the quotation is sent. [CE-1]
Acceptance:
- A quotation with a discount above the limit cannot be sent until the sales head approves. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1
OIs: OI-01
Proposed: yes

### QUO-03 — Credit check for overdue buyers

Statement: A contractor with invoices overdue more than 60 days gets no new quotation without the accounts OK. [CE-2]
Acceptance:
- For a contractor with an invoice 61 days overdue, the quotation cannot be sent until accounts approves. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-2
OIs: OI-04
Proposed: yes

### QUO-04 — Quotation valid for 15 days

Statement: A quotation is valid for 15 days; after that its prices must be re-checked before it is sent again. [CE-2]
Acceptance:
- A quotation older than 15 days is marked expired and needs a price re-check. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-2
Proposed: yes

### QUO-05 — To Tally only on acceptance

Statement: A quotation goes to Tally for invoicing only after the buyer accepts it. [CE-1]
Acceptance:
- A quotation not yet accepted never reaches Tally. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1
OIs: OI-03
Proposed: yes

## 13 Open Items

- OI-01: What discount is "the usual"; above what does the sales head approve?
- OI-03: How do accepted quotations reach Tally, and who owns that link?
- OI-04: Credit check for all buyers or only contractors?
