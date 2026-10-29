# Quotes

Prefix: QUO
Name: Quotes
Status: resolved
Sources: CE-1, QA-1, PL-1

## 1 Purpose and KPIs

- Purpose: Send priced Quotes fast and keep discounts under control. [CE-1]
- KPI: Quote sent within 1 working day. [CE-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales executive | Drafts and sends Quotes | 6 | CE-1 |
| Sales head | Approves big discounts | 1 | CE-1 (proposed, to confirm) |

## 3 Process

- AS-IS: Quotes typed in Word from the price list. [CE-1, PL-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Quote | Number | text | yes | | CE-1 |
| Quote | Lead | link-to-entity | yes | Links to: Lead | CE-1 |
| Quote | Total | money | yes | | PL-1 |
| Quote line | Tile | text | yes | | PL-1 |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start | | CE-1 |
| pending-approval | | OI-01 | (proposed, to confirm) |
| sent | | | CE-1 |
| won | end | | CE-1 |
| lost | end | | CE-1 |

| from | to | trigger | Source |
|---|---|---|---|
| draft | pending-approval | Discount over limit | (proposed, to confirm) |
| draft | sent | Sales executive sends | CE-1 |
| pending-approval | sent | Sales head approves | (proposed, to confirm) |
| sent | won | Customer accepts | CE-1 |
| sent | lost | Customer declines | CE-1 |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Discount approval | Discount over limit [OI-01] | Notify Sales head | (proposed, to confirm) |

## 7 Exceptions

N/A: no exceptions raised [CE-1].

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Quotes won and lost | Sales head | Value by month | CE-1 |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Tally ERP | out | Won Quote as sales order | Accounts | CE-1 |

## 10 Volumes and NFRs

- About 120 Quotes a month. [CE-1]

## 11 Requirements

### QUO-01 — Draft a Quote from a Lead

Statement: A Sales executive can draft a Quote from a qualified Lead with prices from the price list. [CE-1, PL-1]
Acceptance:
- Quote lines take the current list price.
- Quote links back to its Lead.
Priority: Must
Scope: Neome
Sources: CE-1, PL-1
OIs: —
Proposed: no

### QUO-02 — Discount approval

Statement: A discount over the limit needs Sales head approval before sending.
Acceptance:
- A Quote over the limit cannot be sent until approved.
Priority: Must
Scope: Neome
Sources: CE-1
OIs: OI-01
Proposed: yes
Delivery: custom

### QUO-03 — Print Quote on letterhead

Statement: Quotes print on Harbor Tiles letterhead. [CE-1]
Acceptance:
- PDF shows the letterhead.
Priority: Could
Scope: Neome
Sources: CE-1
OIs: —
Proposed: no
Withdrawn: Enterprise sends Quotes by WhatsApp only [QA-1]

## 12 Neome mapping

Neome App: `quotation-and-order-flow`
Delivery: Configuration
How: Quotation & Order Flow with a discount approval step.

## 13 Open Items

- OI-01: Which discount needs the sales head to approve?
