---
id: PAT-role-views-of-one-sheet
kind: pattern
name: Role views of one sheet
workaround: false
seenIn:
  - {build: NB-01, area: Inquiry}
  - {build: NB-02, area: Client}
  - {build: NB-02, area: Conveyance}
  - {build: NB-02, area: PlumberMeet}
  - {build: NB-04, area: TeamVisitPlanner}
  - {build: NB-04, area: Leave}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: Quotation}
  - {build: NB-05, area: Expenses}
  - {build: NB-05, area: Grievance}
  - {build: NB-05, area: Leave}
  - {build: NB-05, area: Visits}
  - {build: NB-05, area: Lead}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: DevCentral}
  - {build: NB-07, area: HR Desk}
---

# Role views of one sheet

## Task

Each role sees its own slice of one sheet: my rows, assigned to me, my team, pending, all.

## How

- rowInsert action to add, for the asking roles.
- Several spreadsheetEditor actions on the same sheet, one per view and role.
- Assign variant: pickUser limited to a role plus an assigned-to-me view.
- Outside role can get its own action on a sheet.

## Workaround

No. Direct feature (one action per view).

## Limits

- Many actions on one sheet crowd the menu.
- Read rights still decide what each role can open.

## Flowchart

```mermaid
flowchart TD
  A["Row added by asker"]
  B["My view: own rows"]
  C["Team view: manager"]
  D["All view: admin"]
  A --> B
  B --> C
  C --> D
```
