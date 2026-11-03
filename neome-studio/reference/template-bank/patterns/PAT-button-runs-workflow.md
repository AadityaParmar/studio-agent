---
id: PAT-button-runs-workflow
kind: pattern
name: Button runs a workflow
workaround: false
seenIn:
  - {build: NB-01, area: Payments}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: RequestMaterialNotification}
  - {build: NB-07, area: HR Desk}
---

# Button runs a workflow

## Task

User taps a button to fetch details, get a balance or mark a row done.

## How

- button field on the form.
- eventManualTrigger workflow or a report fetch tied to the button.
- Row update with the result.

## Workaround

No. Direct feature (button and manual trigger).

## Limits

- User must remember to tap it.

## Flowchart

```mermaid
flowchart TD
  A["User taps button"]
  B["Workflow or fetch runs"]
  C["Row updated"]
  A --> B
  B --> C
```
