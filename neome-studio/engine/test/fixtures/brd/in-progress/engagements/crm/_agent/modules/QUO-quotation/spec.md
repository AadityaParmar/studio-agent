# Quotes

Prefix: QUO
Name: Quotes
Status: claimed
Sources: CE-1

## 1 Purpose and KPIs

- Purpose: Send priced Quotes fast and keep discounts under control. [CE-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales executive | Drafts and sends Quotes | 6 | CE-1 |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start | | CE-1 |
| sent | end | | CE-1 |

| from | to | trigger | Source |
|---|---|---|---|
| draft | sent | Sales executive sends | CE-1 |

## 11 Requirements

### QUO-01 — Draft a Quote from a Lead

Statement: A Sales executive can draft a Quote from a qualified Lead. [CE-1]
Acceptance:
- Quote links back to its Lead.
Priority: Must
Scope: Neome
Sources: CE-1
OIs: —
Proposed: no

### QUO-02 — Discount approval

Statement: A discount over the limit needs approval before sending. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: —
OIs: OI-01

## 13 Open Items

- OI-01: Which discount needs the sales head to approve?
