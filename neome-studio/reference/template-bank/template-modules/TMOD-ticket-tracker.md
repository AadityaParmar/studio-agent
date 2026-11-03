---
id: TMOD-ticket-tracker
kind: template-module
name: Ticket tracker
aliases: [Ticket and sprint tracker, Change request log]
patterns: [PAT-role-views-of-one-sheet, PAT-sheet-history-action, PAT-composite-report, PAT-board-from-lane-reports, PAT-query-report-with-filter, PAT-message-on-event, PAT-scheduled-reminder-message, PAT-trigger-row-for-workflow, PAT-pick-many-rows, PAT-update-linked-rows]
neomeApp: ticketing-and-task-management
delivery: configuration
seenIn:
  - {build: NB-04, area: Development}
  - {build: NB-07, area: DevCentral}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: Service Desk}
---

# Ticket tracker

## Usual needs

- Usually has to log bugs, features, tasks or change requests as tickets with type, priority and module.
- Usually has to link a ticket to customers, a project, a parent or a duplicate.
- Usually has to assign an owner, a developer and a sprint.
- Usually has to move the ticket through a status list to closed and verified.
- Usually has to show my tickets, assigned to me, and change history.
- Usually has to show a dashboard and sprint lanes.
- Usually has to tell people on new tickets and comments, and send a daily summary.

## Process steps

1. Reporter adds a ticket.
2. Owner assigns developer and sprint.
3. Ticket moves through statuses.
4. QA verifies and closes.
5. Daily summary goes out.

## Usual sheets, key fields, roles

- Ticket: TicketId, Type, Priority, Module, Status, Sprint ref, Parent ref, customer refs, AssignedTo, OwnedBy, VerifyBy
- Sprint: Name, DateRange
- Roles: Reporter, Developer, QA, Owner, Manager.

## Neome App / Delivery hint

Neome App: ticketing-and-task-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Reporter adds a ticket."]
  B["Owner assigns developer and sprint."]
  C["Ticket moves through statuses."]
  D["QA verifies and closes."]
  E["Daily summary goes out."]
  A --> B
  B --> C
  C --> D
  D --> E
```
