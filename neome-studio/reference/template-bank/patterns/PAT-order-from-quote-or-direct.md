---
id: PAT-order-from-quote-or-direct
kind: pattern
name: Order from a quotation or direct
workaround: false
seenIn:
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: Order}
  - {build: NB-05, area: Quotation}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-06, area: Quotation}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
---

# Order from a quotation or direct

## Task

An order starts from a quotation (or visit, enquiry, lead) or is typed in directly; the source is marked.

## How

- Source pickText (quotation or direct) on the order.
- Ref to the source row; visibility shows the right fields.
- Lines filled from the source by a report ref.
- Workflow on insert-after updates the source (order created flag or status).

## Workaround

No. Direct feature (pickText, ref, branch). The order-created Yes or No flag on the quotation stands in for a link status.

## Limits

- Changes to the quotation after the order do not flow to the order.

## Flowchart

```mermaid
flowchart TD
  A["Pick source type"]
  B["From quotation: pick it, lines filled"]
  C["Direct: add lines"]
  D["Source marked"]
  A --> B
  B --> C
  C --> D
```
