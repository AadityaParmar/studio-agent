---
id: PAT-status-from-quantities
kind: pattern
name: Status from quantities
workaround: true
seenIn:
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-06, area: Dispatch}
---

# Status from quantities

## Task

Order status (part dispatched, delivered, part received, received) follows the quantities still open.

## How

- Log number fields for dispatched or received quantity per line, updated by child rows.
- Remaining quantity formula.
- Branch or formula on remaining against ordered sets the status; flag on the parent for pending dispatch.

## Workaround

Yes. No delivery or receipt tracking step; remaining quantity and a status list stand in.

## Limits

- Status is only right if every child row updates the parent.

## Flowchart

```mermaid
flowchart TD
  A["Child row moves quantity"]
  B["Parent quantity updated"]
  C["Remaining worked out"]
  D["Status set"]
  A --> B
  B --> C
  C --> D
```
