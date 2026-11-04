---
id: PAT-bulk-message-loop
kind: pattern
name: Bulk message loop with delay
workaround: true
seenIn:
  - {build: NB-04, area: Marketing}
  - {build: NB-07, area: Sales Desk}
  - {build: NB-07, area: Orphans (maybe dead)}
---

# Bulk message loop with delay

## Task

Send one message to every customer or lead in a list, one by one.

## How

- Send sheet with a grid of recipients copied from customers or leads.
- Workflow on insert-after iterates the grid with a wait node.
- Random delay per row from a formula (delay number plus duration field).
- sendWhatsappMessage or email per row; row update marks it sent.

## Workaround

Yes. No bulk send or throttle step; a grid loop with a random wait stands in.

## Limits

- Long lists run long; one send row per batch helps.
- Message rules of the channel still apply.

## Flowchart

```mermaid
flowchart TD
  A["Admin adds send row with recipients"]
  B["Loop over grid"]
  C["Wait random time"]
  D["Send and mark sent"]
  A --> B
  B --> C
  C --> D
```
