---
status: claimed
prefix: RPAY
name: Raise Payment
blockedBy: [MEM]
revisitReason:
formerly:
claimedBy: Aditya Parmar
---

# RPAY — Raise Payment

Name: Raise Payment

## 1 Purpose and KPIs

- Purpose: Let Board Members raise a payment for a list of Members; each raise creates one Payment entry per listed Member. [RFP-1, WS-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Raise payments and pick the Members each raise applies to |  | [RFP-1, WS-1] |

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Raise Payment | Payment title | text | no | required TBC, see OI-18 | [RFP-1] |
| Raise Payment | Description | text | no | required TBC, see OI-18 | [RFP-1] |
| Raise Payment | Amount | money | no | required TBC, see OI-18 | [RFP-1] |
| Raise Payment | Due date | date | no | required TBC, see OI-18 | [RFP-1] |
| Raise Payment | Applicable members | link-to-entity | no | Links to: Member. One Payment entry per Member; required TBC | [RFP-1, WS-1] |
| Raise Payment | Payment category | choice | no | categories TBC, see OI-18 | [RFP-1] |

## 11 Requirements

### RPAY-01 — Raise Payment

Statement: Board Members can create a payment request / collection for HOA members. [RFP-1]
Acceptance:
- Board Members can raise payment collections. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-18
Proposed: no

### RPAY-02 — One Payment entry per listed Member

Statement: Each raise holds a list of Members and inserts one entry per listed Member into Payment. [WS-1]
Acceptance:
- Saving a raise for N Members creates N Payment entries, one per Member, with the raise's amount and due date. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: WS-1
Proposed: yes

## 13 Open Items

- OI-18: Which fields and payment categories apply to a Raise Payment?
