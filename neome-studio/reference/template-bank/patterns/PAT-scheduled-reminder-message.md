---
id: PAT-scheduled-reminder-message
kind: pattern
name: Scheduled reminder message
workaround: false
seenIn:
  - {build: NB-02, area: Location}
  - {build: NB-04, area: Attendance}
  - {build: NB-05, area: MasterData}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-07, area: Monitoring}
  - {build: NB-07, area: Service Desk}
---

# Scheduled reminder message

## Task

Send reminders or summaries at set times (missing punch, open orders, daily summary, check message).

## How

- eventSchedule at fixed times.
- Report or query lists who to remind; iterate the grid.
- Push, user, WhatsApp template or group message per row.
- Summary variant: run a report and forward a trigger row.

## Workaround

No. Direct feature (schedule plus message nodes).

## Limits

- Message templates must be approved for WhatsApp.
- No snooze or opt-out unless built.

## Flowchart

```mermaid
flowchart TD
  A["Schedule fires"]
  B["Report lists people"]
  C["For each: send message"]
  A --> B
  B --> C
```
