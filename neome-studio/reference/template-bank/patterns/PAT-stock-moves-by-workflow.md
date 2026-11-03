---
id: PAT-stock-moves-by-workflow
kind: pattern
name: Stock moves by workflow
workaround: false
seenIn:
  - {build: NB-03, area: Inventory}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: MasterData}
  - {build: NB-05, area: AssetManagement}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: FinishGood}
  - {build: NB-06, area: Inward}
  - {build: NB-06, area: QualityChecking}
  - {build: NB-06, area: RequestMaterial}
  - {build: NB-06, area: Return}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-06, area: ProductionMasterData}
---

# Stock moves by workflow

## Task

Receiving, issuing, transferring, producing, dispatching or reserving goods changes stock per item and place.

## How

- Stock sheet per item (and warehouse) with log number quantity fields.
- Workflow on insert-after or on status change (Received, Transferred, Approved).
- Iterate the grid lines; query the stock row; update its log field, or insert a new stock row when none exists.
- Reserve on order approval, release on dispatch; reverse when approval is undone.
- Processed flag per line so a line is counted once.

## Workaround

No. Direct workflow and log fields; stock is kept by workflow, not computed.

## Limits

- No floor on log fields; a branch may reset negative stock.
- Edits after the status change do not move stock again unless built.
- No stock ledger view; reports read movement sheets.

## Flowchart

```mermaid
flowchart TD
  A["Movement row status set"]
  B["Iterate grid lines"]
  C["Find stock row"]
  D["Update or insert stock row"]
  A --> B
  B --> C
  C --> D
```
