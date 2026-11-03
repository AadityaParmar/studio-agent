---
id: PAT-deeplink-to-form
kind: pattern
name: Deep link opens a form or row
workaround: false
seenIn:
  - {build: NB-04, area: VisitBook}
  - {build: NB-04, area: Sampling}
  - {build: NB-05, area: Payroll}
---

# Deep link opens a form or row

## Task

Send the user straight to a form or row (new lead or order from a visit, request link by email, payslip link).

## How

- generateDeeplink node to an action or row.
- Row update stores the link; message or email sends it.

## Workaround

No. Direct feature (deeplink).

## Limits

- Link opens only for users with rights to the target.

## Flowchart

```mermaid
flowchart TD
  A["Event on row"]
  B["Make deep link"]
  C["Store or send link"]
  D["User opens target"]
  A --> B
  B --> C
  C --> D
```
