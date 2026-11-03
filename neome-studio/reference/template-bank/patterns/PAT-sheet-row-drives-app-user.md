---
id: PAT-sheet-row-drives-app-user
kind: pattern
name: Sheet row drives app user
workaround: false
seenIn:
  - {build: NB-01, area: Employee}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-02, area: MasterData}
  - {build: NB-03, area: Inventory}
  - {build: NB-04, area: SalesExecutives}
---

# Sheet row drives app user

## Task

Adding, changing or removing a person row (employee, customer) adds, updates or removes the app user.

## How

- Workflow on insert-after: userAdd, then write the user back to the row.
- Update-after: branch on roles, manager or status change; userUpdate; switch on status to activate or deactivate.
- Remove-before: userRemove.

## Workaround

No. Direct feature (user nodes in workflow).

## Limits

- Handle and contact must be valid before insert or userAdd fails.
- Role lists on the row must match enterprise roles.

## Flowchart

```mermaid
flowchart TD
  A["Admin adds person row"]
  B["userAdd"]
  C["Role or status changes: userUpdate"]
  D["Row removed: userRemove"]
  A --> B
  B --> C
  C --> D
```
