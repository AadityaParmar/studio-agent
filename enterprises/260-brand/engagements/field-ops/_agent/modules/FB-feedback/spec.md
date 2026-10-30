# FB — Feedback

Prefix: FB
Name: Feedback
Status: resolved
Sources: RFP-1, WS-10

## 1 Purpose and KPIs

- Purpose: A Sales Agent records customer feedback as question and response pairs. [RFP-1, WS-10]
- KPI: Every customer feedback recorded by the Sales Agent with a rating per question; the Sales Head sees how customers rate us; no paper forms. [WS-10]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Records feedback given by the customer; sees own | 60 | [RFP-1, WS-10] |
| Owner | Sets and changes the list of feedback questions; sees all | 1 | [WS-10] |
| Sales Supervisor | Sees all feedback | 8 | [WS-10] |
| Area Sales Manager | Sees all feedback | 3 | [WS-10] |
| Regional Sales Manager | Sees all feedback | 2 | [WS-10] |
| Sales Head | Sees all feedback | 1 | [WS-10] |

## 3 Process

- Customer gives feedback to the Sales Agent; the Sales Agent records it: the date, who entered it, and for each question a response. [RFP-1, WS-10]
- The Owner sets the questions, a fixed list that the Owner can change. [WS-10]
- Hand-off in: Masters (Customer). Hand-off out: none. [WS-10]
- Pain today: customer feedback is not recorded; it is only heard on visits and lost. [WS-10]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Feedback | Date | date | yes | | [RFP-1] |
| Feedback | Entered By | person | yes | The Sales Agent | [RFP-1, WS-10] |
| Feedback | Customer | link-to-entity | no | Links to: Customer. Which customer gave it (proposed, to confirm) OI-82 | |
| Feedback answer | Question | link-to-entity | yes | Links to: Feedback question | [RFP-1, WS-10] |
| Feedback answer | Rating | number | yes | Values: 1 / 2 / 3 / 4 / 5 | [WS-10] |
| Feedback answer | Comment | text | no | Optional | [RFP-1, WS-10] |
| Feedback question | Question text | text | yes | Fixed list set by the Owner | [WS-10] |

## 5 Statuses

N/A: feedback has no status, it is only recorded. [RFP-1]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Fixed question list | Sales Agent records feedback | The questions come from the list the Owner set; the Sales Agent cannot add or change them | [WS-10] |
| Edit same day | Feedback is saved | The Sales Agent can edit it until the day ends (proposed, to confirm) | |
| No extra push | Feedback is saved | No push notification | [WS-10] |

## 7 Exceptions

- No network: the Sales Agent records feedback offline; it syncs when online. [WS-10]
- Owner changes the question list: feedback already recorded keeps the questions it was given on. (proposed, to confirm)
- Comment left empty: allowed; the rating is enough. [WS-10]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Feedback Sheet | Sales Agent own; Sales Supervisor and above all | Feedback with each question, rating and comment; filters date, area, supervisor, agent, question; average rating per question; Excel export (proposed, to confirm) | |

## 9 Integrations

N/A: no other system; feedback stays in neome and is not sent to SAP. [WS-10]

## 10 Volumes and NFRs

- 60 Sales Agents record feedback; 1 Owner keeps the questions. [WS-10]
- Recording works offline; syncs when online. [WS-10]
- OI-81: Feedbacks per day.

## 11 Requirements

### FB-01 — Record customer feedback

Statement: A Sales Agent records customer feedback with Date, Entered By, and for each question a rating from 1 to 5 and an optional comment; it works offline and can be edited the same day. [RFP-1, WS-10]
Acceptance:
- A saved feedback shows each question with its rating and comment. [WS-10]
- A rating outside 1 to 5 cannot be saved. [WS-10]
- Feedback recorded offline appears after sync. [WS-10]
- The Sales Agent can edit a feedback until the day ends. [WS-10]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-10
OIs: OI-81, OI-82, OI-83
Proposed: no

### FB-02 — Feedback question list

Statement: The Owner sets the feedback questions as a fixed list and can change it; Sales Agents use only this list. [WS-10]
Acceptance:
- The Owner can add, change and remove a question. [WS-10]
- The Sales Agent sees the Owner's current questions and cannot change them. [WS-10]
Priority: Must
Scope: Neome
Sources: WS-10
Proposed: no

### FB-03 — Feedback reports

Statement: A Feedback Sheet where the Sales Agent sees own feedback and Sales Supervisor and above see all, with Excel export. [WS-10]
Acceptance:
- The Feedback Sheet filters by date, area, supervisor, agent and question, and exports to Excel. [WS-10]
- The Feedback Sheet shows the average rating per question. [WS-10]
Priority: Should
Scope: Neome
Sources: WS-10
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Custom module
How: Feedback and Feedback answer (question, 1 to 5 rating, comment) have no entity in the field sales App; built as a new record type on the App's Outlet visit mechanics with offline capture; the Owner's fixed question list is a new master; Feedback Sheet with average rating per question is set up as a report with filters and Excel export; Configuration or Custom module is torn, higher proposed, OI-83 (proposed, to confirm)

## 13 Open Items

- OI-81: Feedbacks per day.
- OI-82: Which customer gave each feedback.
- OI-83: Neomenta to check: Feedback Configuration or Custom module.
