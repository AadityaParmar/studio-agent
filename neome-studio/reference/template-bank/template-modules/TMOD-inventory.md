---
id: TMOD-inventory
kind: template-module
name: Inventory and stock
aliases: [Material and item inventory, Finished goods stock, Stock upload and report]
patterns: [PAT-stock-moves-by-workflow, PAT-running-total-by-log-field, PAT-low-stock-alert, PAT-pick-from-report-ref, PAT-lock-fields-by-visibility, PAT-composite-report, PAT-bar-code-per-unit, PAT-stop-save-by-workflow-check, PAT-undo-on-cancel, PAT-show-field-by-value, PAT-calculated-field, PAT-line-items-grid-with-totals, PAT-error-field-check, PAT-act-on-status-change, PAT-copy-fields-from-ref, PAT-query-report-with-filter]
neomeApp: inventory-and-stock-management
delivery: configuration
seenIn:
  - {build: NB-03, area: Inventory}
  - {build: NB-04, area: Inventory}
  - {build: NB-04, area: MasterData}
  - {build: NB-06, area: Inventory}
  - {build: NB-06, area: FinishGood}
  - {build: NA-inventory-and-stock-management, area: Inventory}
---

# Inventory and stock

## Usual needs

- Usually has to keep items and materials with unit, min and max levels or reorder and safety stock.
- Usually has to keep stock per item and warehouse, changed by receipts, issues, transfers, production and dispatch.
- Usually has to record goods received into a warehouse, issues out and moves between warehouses.
- Usually has to block a move or issue above stock on hand.
- Usually has to alert when stock is low.
- Usually has to show a stock dashboard, a stock ledger and stock in and out reports.
- Usually has to sometimes upload closing stock in bulk.

## Process steps

1. Goods come in; stock goes up.
2. Transfers move stock between warehouses.
3. Issues, production and dispatch take stock out.
4. Low stock tells the group.
5. Dashboard and ledger show stock.

## Usual sheets, key fields, roles

- Item or material: name, category, unit, Min or ReorderLevel, Max or SafetyStock, price
- Stock per warehouse: Warehouse, Item, AvailableQuantity (log number)
- Receipt (GRN): Warehouse, Vendor, lines, Status {Pending|Received|Cancelled}
- Transfer: Date, From, To, lines, Status {Pending|Transferred|Cancelled}, Error
- Stock out or outward: Date, Warehouse, lines, Status, Error
- Roles: Store or inventory staff, Production, Operations manager, Admin.

## Neome App / Delivery hint

Neome App: inventory-and-stock-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Goods come in stock goes up."]
  B["Transfers move stock between warehouses."]
  C["Issues, production and dispatch take stock out."]
  D["Low stock tells the group."]
  E["Dashboard and ledger show stock."]
  A --> B
  B --> C
  C --> D
  D --> E
```
