# ANN — Announcements

Prefix: ANN
Name: Announcements
Status: resolved
Sources: RFP-1, QA-1, QA-2

## 1 Purpose and KPIs

- Purpose: Let the HOA Board communicate important information to Society Members. [RFP-1]
- Fix: all Members see notices in one place. [QA-1]
- KPI: No notices missed. [QA-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Create, publish and view announcements; publish Event / Party Announcements |  | [RFP-1] |
| Member | View General and Event / Party Announcements (read-only) |  | [RFP-1] |

- Headcount: no limit; any number of Board Members and Members. [QA-2]

## 3 Process

- Today notices do not reach all Members in one place, so some are missed. [QA-1]
- TO-BE: Board Member creates announcement → announcement published → Members view announcement. [RFP-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| General Announcement | Title | text | yes |  | [QA-1] |
| General Announcement | Message | text | yes |  | [QA-1] |
| General Announcement | Attachment | file | no |  | [QA-1] |
| General Announcement | Publish date | date | yes |  | [QA-1] |
| General Announcement | Status | choice | yes | Values: Draft / Published / Archived | [QA-1] |
| Event / Party Announcement | Event title | text | yes |  | [RFP-1, QA-1] |
| Event / Party Announcement | Event description | text | no |  | [RFP-1, QA-1] |
| Event / Party Announcement | Event date | date | yes |  | [RFP-1, QA-1] |
| Event / Party Announcement | Start time | text | no | time of day | [RFP-1, QA-1] |
| Event / Party Announcement | End time | text | no | time of day | [RFP-1, QA-1] |
| Event / Party Announcement | Venue / location | text | no |  | [RFP-1, QA-1] |
| Event / Party Announcement | Contact person | text | no |  | [RFP-1, QA-1] |
| Event / Party Announcement | Status | choice | yes | Values: Draft / Published / Archived | [QA-1] |

- No RSVP or event registration; an Event / Party Announcement is notice only. [QA-1]

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start |  | [QA-1] |
| published |  |  | [RFP-1] |
| archived | end |  | [QA-1] |

| from | to | trigger | Source |
|---|---|---|---|
| draft | published | Board Member publishes | [RFP-1] |
| published | archived | Board Member archives; Event / Party Announcement archives after the event date | [QA-1] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| No publish approval | Board Member publishes | Any Board Member publishes; no approval step | [QA-1] |
| Read-only for Members | Member opens an announcement | No create, edit or delete action offered | [RFP-1] |
| New announcement notification | Announcement published | All Members notified by Neome app notification | [RFP-1, QA-1] |
| New event notification | Event / Party Announcement published | All Members notified by Neome app notification | [RFP-1, QA-1] |

- Notification channel: Neome app notification only; no email, SMS or WhatsApp. [QA-1]

## 7 Exceptions

- Published announcement wrong or out of date: Board Member edits or archives it; not deleted. [QA-1]
- Event / Party Announcement archives after its event date. [QA-1]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Upcoming events | Board Member | Event / Party Announcements with event date from today (potential dashboard) | [RFP-1] |

- Board dashboard: total Members; open tickets and tickets by status; payments due, collected, pending, overdue; upcoming events. [QA-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | out | Announcements; Neome is the only place they are posted | Board Member | [QA-1] |

- No email, SMS or WhatsApp; Neome app notification only. [QA-1]

## 10 Volumes and NFRs

- Volumes: no limit; announcements, events, Members and Board Members are unlimited. [QA-2]

## 11 Requirements

### ANN-01 — General announcements

Statement: Board Members can create announcements, publish them, and view previously published announcements. [RFP-1]
Acceptance:
- Board Members can create and publish announcements. [RFP-1]
- Members can view announcements but cannot modify them. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-37
Proposed: no

### ANN-02 — Member read-only access

Statement: Members have read-only access to announcements and cannot create, modify, or delete them. [RFP-1]
Acceptance:
- A Member is offered no create, edit or delete action on any announcement. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-37
Proposed: no

### ANN-03 — Event and party announcements

Statement: Board Members can publish party or event-related announcements through a separate form. [RFP-1]
Acceptance:
- The event / party form is separate from the general announcement form. [RFP-1]
- The form holds Event title, Event description, Event date, Start time, End time, Venue / location and Contact person; Event title and Event date are required. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-06, OI-07, OI-37
Proposed: no

### ANN-04 — General announcement form

Statement: A General Announcement holds Title, Message and Publish date (required) and an optional Attachment. [QA-1]
Acceptance:
- A General Announcement cannot be published without Title and Message. [QA-1]
Priority: Must
Scope: Neome
Sources: QA-1
OIs: OI-40, OI-37
Proposed: no

### ANN-05 — Announcement stages

Statement: An announcement moves Draft → Published → Archived; a Board Member can edit or archive a published announcement, and an Event / Party Announcement archives after its event date. [QA-1]
Acceptance:
- A Draft is not visible to Members. [QA-1]
- An Archived announcement no longer shows in the Members' current list and is not deleted. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-42, OI-37
Proposed: no

### ANN-06 — Publish without approval

Statement: Any Board Member can publish an announcement without another Board Member's approval. [QA-1]
Acceptance:
- A Board Member's publish makes the announcement visible to Members at once. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-41, OI-37
Proposed: no

### ANN-07 — New announcement and event notifications

Statement: Members are notified when a new announcement or a new Event / Party Announcement is published. [RFP-1]
Acceptance:
- On publish, every Member gets a Neome app notification. [QA-1]
Priority: Should
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-08, OI-23, OI-37
Proposed: no

### ANN-08 — Upcoming events

Statement: Board Members see a list of upcoming events. [RFP-1]
Acceptance:
- A Board Member sees Event / Party Announcements with an event date from today, soonest first. [QA-1]
Priority: Could
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-26, OI-37
Proposed: no

## 12 Neome mapping

Neome App: `internal-community-forum`
Delivery: Configuration
How: General Announcement → Forum post in an Announcements category; Event / Party Announcement → post in an Events category with event fields (no RSVP, so no Event Management [QA-1]); only Board Members may post, Members read-only; no pre-publish approval; Draft / Published / Archived stages; new-post Neome app notification to Members [QA-1]; Upcoming events list for Board Members; HOA Members as people who are not employees (OI-38) (proposed, to confirm)

## 13 Open Items

- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
