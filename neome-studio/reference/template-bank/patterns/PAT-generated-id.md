---
id: PAT-generated-id
kind: pattern
name: Readable ID made after insert
workaround: false
seenIn:
  - {build: NB-01, area: Payments}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-06, area: Quotation}
  - {build: NB-06, area: RequestMaterial}
  - {build: NB-06, area: ProductionMasterData}
---

# Readable ID made after insert

## Task

Give each row a readable number (payment, order, quotation, request) and set derived codes.

## How

- identifier field for the sequence.
- Workflow on insert-after: applyFormula builds the number, rowUpdate writes it.

## Workaround

No. Direct feature (identifier field and formula).

## Limits

- Number appears only after save.

## Flowchart

```mermaid
flowchart TD
  A["Row saved"]
  B["Formula builds number"]
  C["Row updated"]
  A --> B
  B --> C
```
