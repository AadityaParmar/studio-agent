# Leads

Prefix: LEAD
Name: Leads
Status: resolved
Sources: CE-1, QA-1

## 1 Purpose and KPIs

- Purpose: Track every tile enquiry until it becomes a Quote or is dropped. [CE-1]
- KPI: Lead to Quote rate per month. [CE-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales executive | Captures and works Leads | 6 | CE-1 |
| Sales head | Reviews pipeline | 1 | CE-1 |

## 3 Process

- AS-IS: Leads kept in a shared Excel sheet; follow-ups get missed. [CE-1]
- TO-BE: see process.md, LEAD section.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Lead | Name | text | yes | | CE-1 |
| Lead | Source channel | choice | yes | Values: Walk-in / Phone / Website | CE-1, QA-1 |
| Lead | Owner | person | yes | | CE-1 |
| Lead | Company | link-to-entity | no | Links to: Customer | (proposed, to confirm) |

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| new | start | | CE-1 |
| qualified | | | CE-1 |
| dropped | end | | CE-1 |
| quoted | end | | CE-1 |

| from | to | trigger | Source |
|---|---|---|---|
| new | qualified | Sales executive confirms need | CE-1 |
| new | dropped | No reply after 3 follow-ups | CE-1 |
| qualified | quoted | Quote sent | CE-1 |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Follow-up reminder | Lead untouched 3 days | Notify owner | CE-1 |

## 7 Exceptions

- Duplicate phone number: warn and link to the existing Lead. (proposed, to confirm)

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Lead funnel | Sales head | Count by status, by month | CE-1 |

## 9 Integrations

N/A: Leads are captured by hand only [QA-1].

## 10 Volumes and NFRs

- About 300 new Leads a month. [CE-1]

## 11 Requirements

### LEAD-01 — Capture a Lead

Statement: A Sales executive can capture a Lead with name, phone and channel. [CE-1]
Acceptance:
- A new Lead shows in the list with status New.
- Channel offers only Walk-in, Phone and Website.
Priority: Must
Scope: Neome
Sources: CE-1
OIs: OI-02
Proposed: no

### LEAD-02 — Follow-up reminder

Statement: The owner gets a reminder when a Lead is untouched for 3 days.
Acceptance:
- Reminder arrives on day 3 with no activity.
Priority: Should
Scope: Neome
Sources: CE-1
OIs: —
Proposed: yes

## 12 Neome mapping

Neome App: `lead-management`
Delivery: Configuration
How: Lead Management with a custom channel list and reminder rule.

## 13 Open Items

- OI-02: Do Leads come from the website form?
