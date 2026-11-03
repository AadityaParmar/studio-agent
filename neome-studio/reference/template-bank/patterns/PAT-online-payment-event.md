---
id: PAT-online-payment-event
kind: pattern
name: Online payment event
workaround: false
seenIn:
  - {build: NB-01, area: Onboarding}
---

# Online payment event

## Task

When an online payment comes in, mark the matching row (onboarding, job, payment) paid.

## How

- eventPaymentReceipt workflow.
- Switch on which sheet the payment belongs to.
- rowUpdate on that sheet.

## Workaround

No. Direct feature (payment receipt event).

## Limits

- Payment link must carry enough to find the row.

## Flowchart

```mermaid
flowchart TD
  A["Payment received"]
  B["Switch on source sheet"]
  C["Row marked paid"]
  A --> B
  B --> C
```
