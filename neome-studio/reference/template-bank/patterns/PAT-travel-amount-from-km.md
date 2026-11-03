---
id: PAT-travel-amount-from-km
kind: pattern
name: Travel amount from km and rate
workaround: false
seenIn:
  - {build: NB-02, area: Conveyance}
  - {build: NB-04, area: Expenses}
  - {build: NB-05, area: Expenses}
---

# Travel amount from km and rate

## Task

Work out a travel claim from start and end km (with meter photos) and a rate per vehicle type.

## How

- Start and end km numbers with camera photos.
- Rate per vehicle type kept on the employee row, fetched by a query or button.
- Formula for total km and amount.

## Workaround

No. Direct feature (formula and query).

## Limits

- Readings are typed; photos are the only proof.

## Flowchart

```mermaid
flowchart TD
  A["Employee adds start and end km"]
  B["Rate fetched"]
  C["Km and amount worked out"]
  A --> B
  B --> C
```
