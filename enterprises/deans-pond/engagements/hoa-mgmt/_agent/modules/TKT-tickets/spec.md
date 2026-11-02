# TKT — Tickets

Prefix: TKT
Name: Tickets
Status: resolved
Sources: RFP-1

## 1 Purpose and KPIs

- Purpose: Let Members report HOA-related concerns or requests and let Board Members resolve them. [RFP-1]
- KPI: Every concern tracked in one place; every ticket gets a Board response. (proposed, to confirm)
- OI-44: What goes wrong today with HOA concerns and requests, and which number shows it works?

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Member | Raise tickets, view and track their own tickets, view Board responses and updates |  | [RFP-1] |
| Board Member | Raise tickets; view all tickets; review, act on and update status; provide updates or comments |  | [RFP-1] |

- OI-27: Headcount of Board Members and Members not stated.

## 3 Process

- OI-44: How concerns and requests reach the Board today, and what goes wrong, is not stated.
- TO-BE: Member raises ticket → Board Member reviews ticket → Board Member takes action → ticket status updated → Member views update → ticket closed. [RFP-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Ticket | Ticket number | text | yes | Auto-numbered, e.g. TKT-0001 (proposed, to confirm) |  |
| Ticket | Ticket title | text | yes | required-ness open, see OI-09 | [RFP-1] |
| Ticket | Category | choice | yes | Values open, see OI-10 | [RFP-1] |
| Ticket | Description | text | yes | required-ness open, see OI-09 | [RFP-1] |
| Ticket | Attachment / photo | file | no | see OI-12 | [RFP-1] |
| Ticket | Date | date | yes | Date raised; set automatically (proposed, to confirm) | [RFP-1] |
| Ticket | Priority | choice | no | Values: High / Normal (proposed, to confirm); see OI-09 | [RFP-1] |
| Ticket | Raised by | person | yes | Links to: Member; set automatically (proposed, to confirm) |  |
| Ticket | Status | choice | yes | Values: Open / In Progress / Resolved / Closed; see OI-10 | [RFP-1] |
| Ticket update | Ticket | link-to-entity | yes | Links to: Ticket | [RFP-1] |
| Ticket update | Comment | text | yes | Board Member's update or comment; Member reply open, see OI-11 | [RFP-1] |
| Ticket update | By | person | yes | Links to: Member; set automatically (proposed, to confirm) |  |
| Ticket update | Date | date | yes | Set automatically (proposed, to confirm) |  |

- OI-09: Which fields are required for a ticket?
- OI-10: Which ticket categories and statuses are required?
- OI-12: Should ticket photos / documents be supported?

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| open | start | OI-10 | [RFP-1] |
| in-progress |  | OI-10 | [RFP-1] |
| resolved |  | OI-10 | [RFP-1] |
| closed | end | OI-10, OI-45 | [RFP-1] |

| from | to | trigger | Source |
|---|---|---|---|
| open | in-progress | Board Member takes action on the ticket | [RFP-1] |
| in-progress | resolved | Board Member marks the ticket resolved (proposed, to confirm) |  |
| resolved | closed | Board Member closes the ticket after the Member has seen the update (proposed, to confirm) |  |

- OI-45: Who closes a resolved ticket, and can a closed ticket be reopened?

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Own tickets only | Member opens the ticket list | Member sees only tickets they raised | [RFP-1] |
| All tickets for Board | Board Member opens the ticket list | Board Member sees all tickets | [RFP-1] |
| Status update by Board only | Ticket status changes | Only a Board Member can change status | [RFP-1] |
| Shared Board queue | Ticket raised | No assignment to one Board Member; any Board Member picks it up; no approval step (proposed, to confirm) |  |
| Ticket status update notification | Status changes | Member who raised it notified (needs confirmation) | [RFP-1] |
| Ticket response notification | Board Member adds an update or comment | Member who raised it notified (needs confirmation) | [RFP-1] |
| New ticket notification | Ticket raised | Board Members notified (proposed, to confirm) |  |

- OI-46: Is a ticket assigned to one Board Member or shared, is there a response-time target, and does any ticket action need approval?
- OI-13: Are ticket status update and ticket response notifications required?
- OI-23: Which notification channels?

## 7 Exceptions

- Member not satisfied with a resolution: Member raises a new ticket; a closed ticket is not reopened. (proposed, to confirm)
- Ticket raised by mistake or a duplicate: Board Member closes it with a comment. (proposed, to confirm)
- OI-45: Who closes a resolved ticket, and can a closed ticket be reopened?

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Open tickets | Board Member | Count and list of tickets not Closed (potential dashboard) | [RFP-1] |
| Tickets by status | Board Member | Count of tickets per status (potential dashboard) | [RFP-1] |

- OI-26: Reporting and dashboard requirements not yet defined.

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Tickets; Neome is the only place tickets are raised (proposed, to confirm) | OI-47 |  |

- OI-23: Email / SMS / WhatsApp channels open.
- OI-47: How many tickets a month, and is Neome the only place tickets are raised (system of record)?

## 10 Volumes and NFRs

- OI-47: How many tickets a month?
- OI-27: Number of Members and Board Members not stated.
- Members raise tickets from phone, with a photo when allowed. (proposed, to confirm)

## 11 Requirements

### TKT-01 — Raise tickets

Statement: Members can create tickets related to community or HOA matters. [RFP-1]
Acceptance:
- Members can raise HOA-related tickets. [RFP-1]
- A ticket cannot be saved without Ticket title, Category and Description. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-09, OI-12, OI-37
Proposed: yes

### TKT-02 — Member ticket view

Statement: A Member sees only the tickets they created, can track their status, and can view responses or updates provided by Board Members. [RFP-1]
Acceptance:
- Members can view only their own tickets. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-11, OI-37
Proposed: yes

### TKT-03 — Board ticket handling

Statement: Board Members can view all tickets submitted by all members, review ticket details, act on tickets, update ticket status, and provide updates or comments. [RFP-1]
Acceptance:
- Board Members can view and manage all tickets. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-37
Proposed: yes

### TKT-04 — Ticket lifecycle

Statement: Ticket status moves through Open, In Progress, Resolved and Closed. [RFP-1]
Acceptance:
- Every ticket is in exactly one of the four statuses at any time. (proposed, to confirm)
- Only a Board Member can change a ticket's status. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-10, OI-45, OI-37
Proposed: yes

### TKT-05 — Ticket updates and comments

Statement: Board Members add updates or comments on a ticket, and the Member who raised it sees them on the ticket. [RFP-1]
Acceptance:
- Each update shows who wrote it and when. (proposed, to confirm)
- A Member sees every Board update on their own ticket. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-11, OI-37
Proposed: yes

### TKT-06 — Ticket notifications

Statement: The Member who raised a ticket is notified when its status changes or a Board Member responds. [RFP-1]
Acceptance:
- On a status change or new Board update, the Member gets a notification on the agreed channel. (proposed, to confirm)
- Board Members are notified when a new ticket is raised. (proposed, to confirm)
Priority: Should
Scope: Neome TBC
Sources: RFP-1
OIs: OI-13, OI-23, OI-37
Proposed: yes

### TKT-07 — Shared Board queue

Statement: Tickets are not assigned to one Board Member; any Board Member can pick up and act on any ticket, with no approval step. (proposed, to confirm)
Acceptance:
- Every Board Member sees every Open ticket and can move it to In Progress. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-46, OI-37
Proposed: yes

### TKT-08 — Close without reopen

Statement: A Board Member closes a resolved ticket; a closed ticket is not reopened, and a Member who is not satisfied raises a new ticket. (proposed, to confirm)
Acceptance:
- A Closed ticket offers no status change. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-45, OI-37
Proposed: yes

### TKT-09 — Ticket dashboard

Statement: Board Members see open tickets and tickets by status. [RFP-1]
Acceptance:
- A Board Member sees the count of tickets per status and the list of tickets not Closed. (proposed, to confirm)
Priority: Could
Scope: Neome
Sources: RFP-1
OIs: OI-26, OI-37
Proposed: yes

## 12 Neome mapping

Neome App: `ticketing-and-task-management`
Delivery: Configuration
How: Ticket → Ticket with HOA categories (OI-10) and fields Ticket title, Category, Description, Attachment / photo, Date, Priority (OI-09, OI-12); own stages Open / In Progress / Resolved / Closed; raiser = Member, who sees only own tickets; Board Members as one shared queue, no assignment, SLA or approval (OI-46); Ticket update → ticket comments and status history; status-change, response and new-ticket notifications (OI-13, OI-23); Open tickets and Tickets by status reports; close without reopen (OI-45); HOA Members as people who are not employees (OI-38) (proposed, to confirm)

## 13 Open Items

- OI-09: Which fields are required for a ticket?
- OI-10: Which ticket categories and statuses are required?
- OI-11: Should Members be able to comment or respond on their own tickets?
- OI-12: Should ticket photos / documents be supported?
- OI-13: Are ticket status update and ticket response notifications required?
- OI-23: Which notification channels — Neome application notification, email, SMS, WhatsApp?
- OI-24: Existing data may need migration.
- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-26: Reporting and dashboard requirements not yet defined.
- OI-27: Number of Members and Board Members not stated.
- OI-29: Currency, language, date format.
- OI-30: Hosting, data residency, SSO needs.
- OI-31: Who trains Board Members and Members.
- OI-32: Support after go-live.
- OI-38: Can Neome hold HOA Members (not employees) as ticket raisers with their own login?
- OI-37: Confirm proposed priority, Scope tag and acceptance criteria of TKT Requirements.
- OI-44: What goes wrong today with concerns and requests, and which KPI shows it works?
- OI-45: Who closes a resolved ticket; can a closed ticket be reopened?
- OI-46: Assignment, response-time target, approvals for tickets.
- OI-47: Tickets per month; is Neome the only place tickets are raised?
