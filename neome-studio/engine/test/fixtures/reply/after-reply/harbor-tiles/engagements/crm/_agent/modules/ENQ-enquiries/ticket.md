---
status: open
prefix: ENQ
name: Enquiries
blockedBy: []
revisitReason:
formerly:
claimedBy:
---

# ENQ — Enquiries

Name: Enquiries

## 1 Purpose and KPIs

- Purpose: Capture every tile enquiry from phone, WhatsApp and walk-in at the two showrooms and make sure it is followed up. [CE-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales exec | Takes and follows up own enquiries | 9 | [CE-1] |
| Sales head | Sees all enquiries | 1 | [CE-1] |

## 3 Process

- Enquiries come by phone, WhatsApp and walk-in; staff lose track and nobody follows up after a week. [CE-1]

## 10 Volumes and NFRs

- About 300 enquiries a month in season. [CE-1]
- Most staff use only WhatsApp on phones. [CE-1]

## 11 Requirements

### ENQ-01 — Log an enquiry from any channel

Statement: A sales exec can log an enquiry that came by phone, WhatsApp or walk-in, with its channel and showroom. [CE-1]
Acceptance:
- An enquiry logged from each of the three channels shows its channel and showroom. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1
Proposed: yes

### ENQ-02 — Follow-up reminder

Statement: The system reminds the sales exec when an enquiry has had no follow-up for 5 days. [QA-1]
Acceptance:
- An enquiry with no activity for 5 days raises a reminder to its sales exec. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1, QA-1
OIs: OI-02
Proposed: yes

### ENQ-03 — Who sees which enquiries

Statement: A sales exec sees only their own enquiries; the sales head sees all enquiries. [CE-1]
Acceptance:
- Exec A cannot open an enquiry owned by exec B; the sales head can open both. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: CE-1
Proposed: yes

## 13 Open Items

N/A: no open Open Items.
