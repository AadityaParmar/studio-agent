---
status: open
prefix: COM
name: Communication
blockedBy: [VB, CMP]
revisitReason:
formerly:
claimedBy:
---

# COM — Communication

Name: Communication

## 1 Purpose and KPIs

- Purpose: Reach users and customers through WhatsApp, push notifications, market-specific messages and a Notice Board. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Customer | Gets WhatsApp order confirmations, payment updates and complaint resolutions (OI-60) | | [RFP-1] |
| Owner | Posts notices and market messages (OI-59, OI-61) | | (proposed, to confirm) |

## 3 Process

- Market Specific Communication, Database Push Notifications and Notice Board marked Pending in RFP-1 scope. [RFP-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| WhatsApp | out | Order confirmations, payment updates, complaint resolutions | OI-60 | [RFP-1] |

## 11 Requirements

### COM-01 — WhatsApp messages

Statement: The system sends WhatsApp messages automatically for order confirmations, payment updates and complaint resolutions. [RFP-1]
Acceptance:
- Placing an order sends a WhatsApp confirmation. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-60
Proposed: yes

### COM-02 — Push notifications

Statement: The system sends custom alerts and system-made updates to users as push notifications in real time. [RFP-1]
Acceptance:
- A user gets a push notification when a system event for them happens. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-61
Proposed: yes

### COM-03 — Market Specific Communication

Statement: The system supports Market Specific Communication. [RFP-1]
Acceptance:
- A message sent to one market reaches only users of that market. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-59
Proposed: yes

### COM-04 — Notice Board

Statement: The system has a Notice Board. [RFP-1]
Acceptance:
- A notice posted shows to its audience in the app. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-61
Proposed: yes

## 13 Open Items

- OI-59: Meaning of "market"; what, who, channel.
- OI-60: WhatsApp messages, recipients, provider, cost.
- OI-61: Push triggers; Notice Board posters and audience.
