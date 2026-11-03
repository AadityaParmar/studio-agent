---
id: PAT-stop-save-by-workflow-check
kind: pattern
name: Stop a save by workflow check
workaround: true
seenIn:
  - {build: NB-01, area: Payments}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: FinishGood}
  - {build: NB-06, area: SalesOrder}
---

# Stop a save by workflow check

## Task

Refuse a save or remove that breaks a rule (stock short, order approved, missing refs).

## How

- Workflow on insert-before, update-before, or remove event.
- Branch on the rule (quantity against stock, approval status, empty refs).
- stopAndError with a message, or param update to mark the row.

## Workaround

Yes. No cross-field validation rule; a before or after event with stopAndError stands in.

## Limits

- After events roll back with an error; the user sees the message only after saving.
- Rules live in workflows, not on the form.

## Flowchart

```mermaid
flowchart TD
  A["User saves"]
  B["Workflow checks rule"]
  C["Broken? stop and error"]
  D["Else save goes on"]
  A --> B
  B --> C
  C --> D
```
