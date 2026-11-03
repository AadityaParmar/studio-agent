---
id: PAT-soft-disable-by-status
kind: pattern
name: Soft disable by status or flag
workaround: true
seenIn:
  - {build: NB-06, area: ProductionMasterData}
---

# Soft disable by status or flag

## Task

Stop using a customer, item or employee without deleting it.

## How

- Active or inactive pickText, or a disable bool, on the master row.
- Lists and refs filter on it.

## Workaround

Yes. No archive; a status list or flag stands in.

## Limits

- Every ref and report must filter on the flag.

## Flowchart

```mermaid
flowchart TD
  A["Admin sets inactive"]
  B["Row hidden from picks"]
  C["History kept"]
  A --> B
  B --> C
```
