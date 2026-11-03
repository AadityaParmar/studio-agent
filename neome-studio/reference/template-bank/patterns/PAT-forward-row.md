---
id: PAT-forward-row
kind: pattern
name: Forward a row to another role
workaround: false
seenIn:
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-06, area: RequestMaterial}
  - {build: NB-07, area: Service Desk}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
---

# Forward a row to another role

## Task

Pass a new row on to the next role or sheet (request lines to the store, order onward, summary trigger).

## How

- rowForward node after insert.
- Row update after forward.

## Workaround

No. Direct feature (rowForward).

## Limits

- Forward targets are fixed in the flow.

## Flowchart

```mermaid
flowchart TD
  A["Row added"]
  B["rowForward"]
  C["Next role sees it"]
  A --> B
  B --> C
```
