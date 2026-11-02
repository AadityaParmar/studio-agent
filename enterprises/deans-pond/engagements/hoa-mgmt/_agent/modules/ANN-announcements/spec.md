# ANN — Announcements

Prefix: ANN
Name: Announcements
Status: resolved
Sources: RFP-1

## 1 Purpose and KPIs

- Purpose: Let the HOA Board communicate important information to Society Members. [RFP-1]
- KPI: All Members see notices in one place; no notices missed. (proposed, to confirm)
- OI-39: What goes wrong today with announcements, and which number shows it works?

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Create, publish and view announcements; publish Event / Party Announcements |  | [RFP-1] |
| Member | View General and Event / Party Announcements (read-only) |  | [RFP-1] |

- OI-27: Headcount of Board Members and Members not stated.

## 3 Process

- OI-39: How announcements reach Members today, and what goes wrong, is not stated.
- TO-BE: Board Member creates announcement → announcement published → Members view announcement. [RFP-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| General Announcement | Title | text | yes | (proposed, to confirm) |  |
| General Announcement | Message | text | yes | (proposed, to confirm) |  |
| General Announcement | Attachment | file | no | (proposed, to confirm) |  |
| General Announcement | Publish date | date | yes | (proposed, to confirm) |  |
| General Announcement | Status | choice | yes | Values: Draft / Published / Archived (proposed, to confirm) |  |
| Event / Party Announcement | Event title | text | yes | required-ness open, see OI-06 | [RFP-1] |
| Event / Party Announcement | Event description | text | no | see OI-06 | [RFP-1] |
| Event / Party Announcement | Event date | date | yes | see OI-06 | [RFP-1] |
| Event / Party Announcement | Start time | text | no | time of day; see OI-06 | [RFP-1] |
| Event / Party Announcement | End time | text | no | time of day; see OI-06 | [RFP-1] |
| Event / Party Announcement | Venue / location | text | no | see OI-06 | [RFP-1] |
| Event / Party Announcement | Contact person | text | no | see OI-06 | [RFP-1] |
| Event / Party Announcement | Status | choice | yes | Values: Draft / Published / Archived (proposed, to confirm) |  |

- OI-40: Which fields does a General Announcement hold?
- OI-06: Which fields are required for Event / Party Announcements?
- OI-07: Is RSVP or event registration required?

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| draft | start | OI-42 | (proposed, to confirm) |
| published |  | OI-42 | [RFP-1] |
| archived | end | OI-42 | (proposed, to confirm) |

| from | to | trigger | Source |
|---|---|---|---|
| draft | published | Board Member publishes | [RFP-1] |
| published | archived | Board Member archives; Event / Party Announcement archives after the event date (proposed, to confirm) |  |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| No publish approval | Board Member publishes | Any Board Member publishes; no approval step (proposed, to confirm) |  |
| Read-only for Members | Member opens an announcement | No create, edit or delete action offered | [RFP-1] |
| New announcement notification | Announcement published | Members notified (needs confirmation) | [RFP-1] |
| New event notification | Event / Party Announcement published | Members notified (needs confirmation) | [RFP-1] |

- OI-41: Does an announcement need another Board Member's approval before publish?
- OI-08: Are new announcement and new event notifications required?
- OI-23: Which notification channels?

## 7 Exceptions

- Published announcement wrong or out of date: Board Member edits or archives it; not deleted. (proposed, to confirm)
- OI-42: Can a published announcement be edited, removed or expire?

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Upcoming events | Board Member | Event / Party Announcements with event date from today (potential dashboard) | [RFP-1] |

- OI-26: Reporting and dashboard requirements not yet defined.

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | out | Announcements; Neome is the only place they are posted (proposed, to confirm) | OI-43 |  |

- OI-23: Email / SMS / WhatsApp channels open.
- OI-43: Is Neome the only place announcements are posted (system of record)?

## 10 Volumes and NFRs

- OI-43: How many announcements and events a month?
- OI-27: Number of Members and Board Members not stated.

## 11 Requirements

### ANN-01 — General announcements

Statement: Board Members can create announcements, publish them, and view previously published announcements. [RFP-1]
Acceptance:
- Board Members can create and publish announcements. [RFP-1]
- Members can view announcements but cannot modify them. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-37
Proposed: yes

### ANN-02 — Member read-only access

Statement: Members have read-only access to announcements and cannot create, modify, or delete them. [RFP-1]
Acceptance:
- A Member is offered no create, edit or delete action on any announcement. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-37
Proposed: yes

### ANN-03 — Event and party announcements

Statement: Board Members can publish party or event-related announcements through a separate form. [RFP-1]
Acceptance:
- The event / party form is separate from the general announcement form. [RFP-1]
- The form holds Event title, Event description, Event date, Start time, End time, Venue / location and Contact person; Event title and Event date are required. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-06, OI-07, OI-37
Proposed: yes

### ANN-04 — General announcement form

Statement: A General Announcement holds Title, Message and Publish date (required) and an optional Attachment. (proposed, to confirm)
Acceptance:
- A General Announcement cannot be published without Title and Message. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-40, OI-37
Proposed: yes

### ANN-05 — Announcement stages

Statement: An announcement moves Draft → Published → Archived; a Board Member can edit or archive a published announcement, and an Event / Party Announcement archives after its event date. (proposed, to confirm)
Acceptance:
- A Draft is not visible to Members. (proposed, to confirm)
- An Archived announcement no longer shows in the Members' current list and is not deleted. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-42, OI-37
Proposed: yes

### ANN-06 — Publish without approval

Statement: Any Board Member can publish an announcement without another Board Member's approval. (proposed, to confirm)
Acceptance:
- A Board Member's publish makes the announcement visible to Members at once. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-41, OI-37
Proposed: yes

### ANN-07 — New announcement and event notifications

Statement: Members are notified when a new announcement or a new Event / Party Announcement is published. [RFP-1]
Acceptance:
- On publish, every Member gets a notification on the agreed channel. (proposed, to confirm)
Priority: Should
Scope: Neome TBC
Sources: RFP-1
OIs: OI-08, OI-23, OI-37
Proposed: yes

### ANN-08 — Upcoming events

Statement: Board Members see a list of upcoming events. [RFP-1]
Acceptance:
- A Board Member sees Event / Party Announcements with an event date from today, soonest first. (proposed, to confirm)
Priority: Could
Scope: Neome
Sources: RFP-1
OIs: OI-26, OI-37
Proposed: yes

## 12 Neome mapping

Neome App: `internal-community-forum`
Delivery: Configuration
How: General Announcement → Forum post in an Announcements category; Event / Party Announcement → post in an Events category with event fields (Event Management for events if RSVP is needed, OI-07); only Board Members may post, Members read-only; no pre-publish approval; Draft / Published / Archived stages; new-post notification to Members; Upcoming events list for Board Members; HOA Members as people who are not employees (OI-38); hangs on OI-06, OI-07, OI-08, OI-23, OI-40, OI-41, OI-42 (proposed, to confirm)

## 13 Open Items

- OI-06: Which fields are required for Event / Party Announcements?
- OI-07: Is RSVP or event registration required?
- OI-08: Are new announcement and new event notifications required?
- OI-23: Which notification channels — Neome application notification, email, SMS, WhatsApp?
- OI-24: Existing data may need migration.
- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-26: Reporting and dashboard requirements not yet defined.
- OI-27: Number of Members and Board Members not stated.
- OI-29: Currency, language, date format.
- OI-30: Hosting, data residency, SSO needs.
- OI-31: Who trains Board Members and Members.
- OI-32: Support after go-live.
- OI-37: Confirm proposed priority, Scope tag and acceptance criteria of ANN Requirements.
- OI-39: What goes wrong today with announcements, and which KPI shows it works?
- OI-40: Which fields does a General Announcement hold?
- OI-41: Does an announcement need approval before publish?
- OI-42: Announcement stages; can a published one be edited, removed or expire?
- OI-43: Announcements and events per month; is Neome the only place they are posted?
