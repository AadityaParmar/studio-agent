---
id: PAT-default-value-on-form
kind: pattern
name: Default value on a form
workaround: false
seenIn:
  - {build: NB-02, area: MasterData}
  - {build: NB-05, area: Payroll}
  - {build: NB-05, area: Attendence}
---

# Default value on a form

## Task

Fields start with a sensible value (current month and year, Pending status).

## How

- Formula on the field with onInitAndOnChange.
- Or insert-before workflow with fieldSet.

## Workaround

No. Direct feature (formula or fieldSet).

## Limits

- Formula defaults can overwrite a user change if not guarded.

## Flowchart

```mermaid
flowchart TD
  A["Form opens"]
  B["Default set"]
  C["User may change"]
  A --> B
  B --> C
```
