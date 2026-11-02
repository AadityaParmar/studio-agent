# TKT — Tickets

Prefix: TKT
Name: Tickets
Status: resolved
Sources: RFP-1, QA-1, QA-2

## 1 Purpose and KPIs

- Purpose: Let Members report HOA-related concerns or requests and let Board Members resolve them. [RFP-1]
- KPI: Every concern tracked in one place; every ticket gets a Board response. [QA-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Member | Raise tickets, view and track their own tickets, view Board responses and updates |  | [RFP-1] |
| Board Member | Raise tickets; view all tickets; review, act on and update status; provide updates or comments |  | [RFP-1] |

- Headcount: no limit on Board Members or Members. [QA-2]

## 3 Process

- AS-IS: concerns are not tracked in one place and some get no Board response. [QA-1]
- TO-BE: Member raises ticket → Board Member reviews ticket → Board Member takes action → ticket status updated → Member views update → ticket closed. [RFP-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Ticket | Ticket number | text | yes | Auto-numbered, e.g. TKT-0001 (proposed, to confirm) |  |
| Ticket | Ticket title | text | yes | Required [QA-1] | [RFP-1, QA-1] |
| Ticket | Category | choice | yes | Values: Maintenance / Landscaping / Security / Noise / Other [QA-1] | [RFP-1, QA-1] |
| Ticket | Description | text | yes | Required [QA-1] | [RFP-1, QA-1] |
| Ticket | Attachment / photo | file | no | Optional photo or document [QA-1] | [RFP-1, QA-1] |
| Ticket | Date | date | yes | Date raised; set automatically [QA-1] | [RFP-1, QA-1] |
| Ticket | Priority | choice | no | Optional [QA-1]; values High / Normal (proposed, to confirm) | [RFP-1, QA-1] |
| Ticket | Raised by | person | yes | Links to: Member; set automatically (proposed, to confirm) |  |
| Ticket | Status | choice | yes | Values: Open / In Progress / Resolved / Closed | [RFP-1, QA-1] |
| Ticket update | Ticket | link-to-entity | yes | Links to: Ticket | [RFP-1] |
| Ticket update | Comment | text | yes | Board Member's update or comment; Member can also comment on own ticket [QA-1] | [RFP-1, QA-1] |
| Ticket update | By | person | yes | Links to: Member; set automatically (proposed, to confirm) |  |
| Ticket update | Date | date | yes | Set automatically (proposed, to confirm) |  |

- Required: Ticket title, Category, Description; optional: Attachment / photo, Priority; Date set automatically. [QA-1]

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| open | start |  | [RFP-1, QA-1] |
| in-progress |  |  | [RFP-1, QA-1] |
| resolved |  |  | [RFP-1, QA-1] |
| closed | end |  | [RFP-1, QA-1] |

| from | to | trigger | Source |
|---|---|---|---|
| open | in-progress | Board Member takes action on the ticket | [RFP-1] |
| in-progress | resolved | Board Member marks the ticket resolved (proposed, to confirm) |  |
| resolved | closed | Board Member closes the ticket | [QA-1] |

- A Board Member closes a resolved ticket; a closed ticket is not reopened. [QA-1]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Own tickets only | Member opens the ticket list | Member sees only tickets they raised | [RFP-1] |
| All tickets for Board | Board Member opens the ticket list | Board Member sees all tickets | [RFP-1] |
| Status update by Board only | Ticket status changes | Only a Board Member can change status | [RFP-1] |
| Shared Board queue | Ticket raised | No assignment to one Board Member; any Board Member picks it up; no response-time target; no approval step | [QA-1] |
| Ticket status update notification | Status changes | Member who raised it notified, Neome app notification | [RFP-1, QA-1] |
| Ticket response notification | Board Member adds an update or comment | Member who raised it notified, Neome app notification | [RFP-1, QA-1] |
| New ticket notification | Ticket raised | Board Members notified, Neome app notification (proposed, to confirm) | [QA-1] |

- Notifications go by Neome app notification only; no email, SMS or WhatsApp. [QA-1]

## 7 Exceptions

- Member not satisfied with a resolution: Member raises a new ticket; a closed ticket is not reopened. [QA-1]
- Ticket raised by mistake or a duplicate: Board Member closes it with a comment. (proposed, to confirm)

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Open tickets | Board Member | Count and list of tickets not Closed (Board dashboard) | [RFP-1, QA-1] |
| Tickets by status | Board Member | Count of tickets per status (Board dashboard) | [RFP-1, QA-1] |

- Board dashboard shows open tickets and tickets by status. [QA-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Tickets; Neome is the only place tickets are raised | HOA | [QA-1] |

- No email, SMS or WhatsApp channel. [QA-1]

## 10 Volumes and NFRs

- No volume limits; all entries unlimited. [QA-2]
- Members raise tickets from phone, with a photo when allowed. (proposed, to confirm)

## 11 Requirements

### TKT-01 — Raise tickets

Statement: Members can create tickets related to community or HOA matters. [RFP-1]
Acceptance:
- Members can raise HOA-related tickets. [RFP-1]
- A ticket cannot be saved without Ticket title, Category and Description. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-09, OI-12, OI-37
Proposed: no

### TKT-02 — Member ticket view

Statement: A Member sees only the tickets they created, can track their status, and can view responses or updates provided by Board Members. [RFP-1]
Acceptance:
- Members can view only their own tickets. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-11, OI-37
Proposed: no

### TKT-03 — Board ticket handling

Statement: Board Members can view all tickets submitted by all members, review ticket details, act on tickets, update ticket status, and provide updates or comments. [RFP-1]
Acceptance:
- Board Members can view and manage all tickets. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-37
Proposed: no

### TKT-04 — Ticket lifecycle

Statement: Ticket status moves through Open, In Progress, Resolved and Closed. [RFP-1]
Acceptance:
- Every ticket is in exactly one of the four statuses at any time. [QA-1]
- Only a Board Member can change a ticket's status. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-10, OI-45, OI-37
Proposed: no

### TKT-05 — Ticket updates and comments

Statement: Board Members add updates or comments on a ticket, and the Member who raised it sees them on the ticket. [RFP-1]
Acceptance:
- Each update shows who wrote it and when. [QA-1]
- A Member sees every Board update on their own ticket. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-11, OI-37
Proposed: no

### TKT-06 — Ticket notifications

Statement: The Member who raised a ticket is notified when its status changes or a Board Member responds. [RFP-1]
Acceptance:
- On a status change or new Board update, the Member gets a notification on the agreed channel. [QA-1]
- Board Members are notified when a new ticket is raised. [QA-1]
Priority: Should
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-13, OI-23, OI-37
Proposed: no

### TKT-07 — Shared Board queue

Statement: Tickets are not assigned to one Board Member; any Board Member can pick up and act on any ticket, with no approval step. [QA-1]
Acceptance:
- Every Board Member sees every Open ticket and can move it to In Progress. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-46, OI-37
Proposed: no

### TKT-08 — Close without reopen

Statement: A Board Member closes a resolved ticket; a closed ticket is not reopened, and a Member who is not satisfied raises a new ticket. [QA-1]
Acceptance:
- A Closed ticket offers no status change. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-45, OI-37
Proposed: no

### TKT-09 — Ticket dashboard

Statement: Board Members see open tickets and tickets by status. [RFP-1]
Acceptance:
- A Board Member sees the count of tickets per status and the list of tickets not Closed. [QA-1]
Priority: Could
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-26, OI-37
Proposed: no

## 12 Neome mapping

Neome App: `ticketing-and-task-management`
Delivery: Configuration
How: Ticket → Ticket with HOA categories (Maintenance / Landscaping / Security / Noise / Other) and fields Ticket title, Category, Description, Attachment / photo, Date, Priority; own stages Open / In Progress / Resolved / Closed; raiser = Member, who sees only own tickets; Board Members as one shared queue, no assignment, SLA or approval; Ticket update → ticket comments and status history; status-change, response and new-ticket notifications by Neome app notification only; Open tickets and Tickets by status reports; close without reopen; HOA Members as people who are not employees (OI-38) (proposed, to confirm)

## 13 Open Items

- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-38: Can Neome hold HOA Members (not employees) as ticket raisers with their own login?
