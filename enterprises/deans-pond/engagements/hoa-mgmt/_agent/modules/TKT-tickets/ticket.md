---
status: open
prefix: TKT
name: Tickets
draft: true
blockedBy: []
---

# TKT — Tickets

Name: Tickets

## 1 Purpose and KPIs

- Purpose: Let Members report HOA-related concerns or requests and let Board Members resolve them. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Member | Raise tickets, view and track their own tickets, view responses |  | [RFP-1] |
| Board Member | View, review and act on all tickets; update status; provide updates or comments |  | [RFP-1] |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| open | start |  | [RFP-1] |
| in-progress |  |  | [RFP-1] |
| resolved |  |  | [RFP-1] |
| closed | end |  | [RFP-1] |

| from | to | trigger | Source |
|---|---|---|---|
| open | in-progress | Board Member acts on the ticket | [RFP-1] |
| in-progress | resolved | Board Member resolves the ticket | (proposed, to confirm) |
| resolved | closed | Ticket is closed | (proposed, to confirm) |

## 11 Requirements

### TKT-01 — Raise tickets

Statement: Members can create tickets related to community or HOA matters. [RFP-1]
Acceptance:
- Members can raise HOA-related tickets. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-09, OI-12
Proposed: no

### TKT-02 — Member ticket view

Statement: A Member sees only the tickets they created, can track their status, and can view responses or updates provided by Board Members. [RFP-1]
Acceptance:
- Members can view only their own tickets. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-11
Proposed: no

### TKT-03 — Board ticket handling

Statement: Board Members can view all tickets submitted by all members, review ticket details, act on tickets, update ticket status, and provide updates or comments. [RFP-1]
Acceptance:
- Board Members can view and manage all tickets. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: no

### TKT-04 — Ticket lifecycle

Statement: Ticket status moves through Open, In Progress, Resolved and Closed. [RFP-1]
Acceptance:
- Every ticket is in exactly one of the four statuses at any time. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-10
Proposed: yes

## 13 Open Items

- OI-09: Which fields are required for a ticket?
- OI-10: Which ticket categories and statuses are required?
- OI-11: Should Members be able to comment or respond on their own tickets?
- OI-12: Should ticket photos / documents be supported?
- OI-13: Are ticket status update and ticket response notifications required?
