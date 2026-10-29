---
status: open
prefix: FB
name: Feedback
blockedBy: [MST]
revisitReason:
formerly:
claimedBy:
---

# FB — Feedback

Name: Feedback

## 1 Purpose and KPIs

- Purpose: Record customer feedback as question and response pairs. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Records feedback | | [RFP-1] |

## 3 Process

- Sales Agent: Record feedback → End. [RFP-1]
- Feedback marked Pending in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Feedback | Date | date | yes | | [RFP-1] |
| Feedback | Entered By | person | yes | | [RFP-1] |
| Feedback answer | Question | text | yes | OI-52 | [RFP-1] |
| Feedback answer | Response | text | no | OI-52 | [RFP-1] |

## 11 Requirements

### FB-01 — Record customer feedback

Statement: A Sales Agent records customer feedback with Date, Entered By and a list of Question and Response. [RFP-1]
Acceptance:
- A saved feedback shows each question with its response. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-52
Proposed: yes

## 13 Open Items

- OI-52: Who gives feedback, who sets questions, response type.
