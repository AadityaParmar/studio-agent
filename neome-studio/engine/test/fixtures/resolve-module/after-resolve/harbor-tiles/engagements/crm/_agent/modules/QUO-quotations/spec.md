# QUO — Quotations

Prefix: QUO
Name: Quotations
Status: resolved
Sources: CE-1, CE-2, WS-1, WS-2

## 1 Purpose and KPIs

- Purpose: Send priced quotations to serious enquiries, with discount and credit checks, before invoicing in Tally. [CE-1, CE-2]
- KPI: A quotation goes out the same day the enquiry turns serious. [WS-2]
- KPI: Share of quotations that turn into orders, per sales exec. [WS-2]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales exec | Makes, revises and sends quotations | 9 | [CE-1] |
| Sales head | Approves discounts above 8%; sees all quotations | 1 | [CE-1, WS-2] |
| Accounts | Checks overdue invoices of contractors; raises invoices in Tally | 2 | [WS-1, WS-2] |

## 3 Process

- Quotations are made in Excel and emailed as PDF. [CE-1]
- Buyers often ask for changes; a revised quotation replaces the old one. [WS-2]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Quotation | Number | text | yes | Given by the system (proposed, to confirm) | |
| Quotation | Enquiry | link-to-entity | yes | Links to: Enquiry | [CE-1] |
| Quotation | Buyer | text | yes | | [CE-1] |
| Quotation | Discount % | number | no | One discount for the whole quotation | [WS-2] |
| Quotation | Total | money | yes | Sum of lines less discount (proposed, to confirm) | |
| Quotation | Valid until | date | yes | | [CE-2] |
| Quotation | Status | choice | yes | Values: Draft / Waiting approval / Sent / Accepted / Lost / Expired / Replaced | [WS-2] |
| Quotation | Replaces | link-to-entity | no | Links to: Quotation. Set on a revised quotation | [WS-2] |
| Quotation line | Tile | text | yes | | [WS-2] |
| Quotation line | Boxes | number | yes | | [WS-2] |
| Quotation line | Square feet | number | yes | | [WS-2] |
| Quotation line | Rate | money | yes | | [WS-2] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start | | [WS-2] |
| waiting-approval | | | [WS-2] |
| sent | | | [WS-2] |
| accepted | end | | [WS-2] |
| lost | end | OI-09 | [WS-2] |
| expired | end | OI-09 | [WS-2] |
| replaced | end | | [WS-2] |

| from | to | trigger | Source |
|---|---|---|---|
| draft | waiting-approval | Discount above 8%, or contractor with an invoice overdue over 60 days | [WS-2] |
| waiting-approval | sent | Sales head (discount) or accounts (credit) approves; sales exec sends | [WS-2] |
| waiting-approval | draft | Rejected (proposed, to confirm) | |
| draft | sent | No approval needed; sales exec sends the PDF | [CE-1, WS-2] |
| sent | accepted | Buyer accepts | [CE-1] |
| sent | lost | Buyer says no (proposed, to confirm) | |
| sent | expired | Validity ends without acceptance | [CE-2, WS-2] |
| sent | replaced | Revised quotation made | [WS-2] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Discount approval | Discount above 8% | Waits for the sales head; sales head told | [WS-2] |
| Stand-in approver | Sales head away | Kochi showroom manager approves (proposed, to confirm) | |
| Credit check | Contractor has an invoice overdue over 60 days | Waits for accounts OK | [CE-2, WS-2] |
| Approval result | Sales head approves or rejects | Sales exec told | [WS-2] |
| Expiry | Validity ends | Quotation marked expired; price re-check before sending again | [CE-2] |

## 7 Exceptions

- Buyer asks for changes: a revised quotation is made and the old one becomes replaced. [WS-2]
- OI-10: Who approves discounts when the sales head is away?
- OI-09: Can a lost or expired quotation be reopened, and by whom?

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Quotations to orders | Sales head | Quotations sent and turned into orders, per sales exec, per month | [WS-2] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Tally | out | Accepted quotation for invoicing; Tally is the master for invoices and customer balances | OI-03 | [CE-1, WS-2] |

## 10 Volumes and NFRs

- About 300 enquiries a month in season. [CE-1]
- About 120 quotations a month in season. [WS-2]
- Sales execs make quotations on their phones at the showroom. [WS-2]

## 11 Requirements

### QUO-01 — Make and send a quotation

Statement: A sales exec makes a quotation for an enquiry and emails it to the buyer as a PDF. [CE-1, WS-2]
Acceptance:
- A quotation made from an enquiry is emailed to the buyer as a PDF. [WS-2]
- A sales exec can make and send it from a phone. [WS-2]
Priority: Must
Scope: Neome
Sources: CE-1, WS-2
Proposed: no
Delivery: Standard

### QUO-02 — Discount approval

Statement: A discount above 8% needs the sales head's approval before the quotation is sent. [CE-1, WS-2]
Acceptance:
- A quotation with a 9% discount cannot be sent until the sales head approves; one with 8% can. [WS-2]
Priority: Must
Scope: Neome
Sources: CE-1, WS-2
OIs: OI-01, OI-10
Proposed: no

### QUO-03 — Credit check for overdue contractors

Statement: A contractor with an invoice overdue more than 60 days gets no new quotation without the accounts OK; other buyers need no credit check. [CE-2, WS-2]
Acceptance:
- For a contractor with an invoice 61 days overdue, the quotation cannot be sent until accounts approves. [WS-2]
- A walk-in buyer's quotation needs no credit check. [WS-2]
Priority: Must
Scope: Neome
Sources: CE-2, WS-2
OIs: OI-04
Proposed: no

### QUO-04 — Quotation validity

Statement: A quotation is valid for a set number of days; after that its prices must be re-checked before it is sent again. [CE-2, WS-2]
Acceptance:
- A quotation past its validity is marked expired and needs a price re-check. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: CE-2, WS-2
OIs: OI-11, OI-12
Proposed: yes

### QUO-05 — To Tally only on acceptance

Statement: A quotation goes to Tally for invoicing only after the buyer accepts it; Tally stays the master for invoices and customer balances. [CE-1, WS-2]
Acceptance:
- A quotation not yet accepted never reaches Tally. [WS-2]
Priority: Should
Scope: Open
Sources: CE-1, WS-2
OIs: OI-03
Proposed: no

### QUO-06 — Revised quotation

Statement: A sales exec can revise a sent quotation; the revision links to the old one, which becomes replaced. [WS-2]
Acceptance:
- Revising a sent quotation makes a new quotation linked to the old one, and the old one shows as replaced. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: WS-2
OIs: OI-12
Proposed: yes

### QUO-07 — Quotations to orders report

Statement: The sales head sees, per month and per sales exec, how many quotations were sent and how many turned into orders. [WS-2]
Acceptance:
- For a chosen month the report shows, per sales exec, quotations sent and accepted. (proposed, to confirm)
Priority: Could
Scope: Neome
Sources: WS-2
OIs: OI-12
Proposed: yes
Delivery: Standard

## 12 Neome mapping

Neome App: `quotation-and-order-flow`
Delivery: Configuration
How: Quotation and Quotation line are the App's quotation and its lines. Set up: statuses Waiting approval, Lost and Replaced plus the Replaces link for a revised quotation; one discount approval level above 8% for the sales head in place of the App's default limits; the contractor credit check as a second approval step for accounts, which needs overdue invoices from Tally (OI-03). Make and send (QUO-01) and the Quote to order report (QUO-07) are the App as is. (proposed, to confirm)

## 13 Open Items

- OI-03: How do accepted quotations reach Tally, and who owns that link?
- OI-09: Can a lost or expired quotation be reopened, and by whom?
- OI-10: Who approves discounts when the sales head is away?
- OI-11: Quotation valid 15 days (CE-2) or 30 days for contractors (WS-2)?
- OI-12: Confirm proposed priority, scope and acceptance of QUO-04, QUO-06, QUO-07.
