---
id: TPL-small-manufacturer
kind: template
name: Small manufacturer with trade orders
businessType: "Buys material, makes goods and sells them by quotation, order and dispatch, keeping stock per warehouse."
modules:
  core: [TMOD-quotation, TMOD-sales-order, TMOD-dispatch, TMOD-inventory, TMOD-master-data]
  optional: [TMOD-manufacturing, TMOD-purchase-orders, TMOD-goods-inward, TMOD-incoming-quality-check, TMOD-vendor-return, TMOD-material-request, TMOD-customer-payments, TMOD-customer-master, TMOD-employee-master, TMOD-management-reports]
seenIn:
  - {build: NB-03, area: "*"}
  - {build: NB-06, area: "*"}
---

# Small manufacturer with trade orders

## Modules

Core:

- TMOD-quotation (Quotation)
- TMOD-sales-order (Sales order)
- TMOD-dispatch (Dispatch)
- TMOD-inventory (Inventory and stock)
- TMOD-master-data (Master data lists)

Optional:

- TMOD-manufacturing (Manufacturing)
- TMOD-purchase-orders (Purchase orders)
- TMOD-goods-inward (Goods inward)
- TMOD-incoming-quality-check (Incoming quality check)
- TMOD-vendor-return (Return to vendor)
- TMOD-material-request (Material request and issue)
- TMOD-customer-payments (Customer payments)
- TMOD-customer-master (Customer master)
- TMOD-employee-master (Employee master)
- TMOD-management-reports (Management reports)

## Links between modules

- Sales chain: quotation → sales order → dispatch → customer payment.
- Purchase chain: purchase order → goods inward → quality check → inventory.
- Manufacturing uses products, units and warehouses; production adds stock and uses material.
- Dispatch takes stock from a warehouse; material requests and returns change stock.
- Master data feeds every module.

## Flowchart

```mermaid
flowchart LR
  T["Small manufacturer with trade orders"]
  T --> C0["Quotation"]
  T --> C1["Sales order"]
  T --> C2["Dispatch"]
  T --> C3["Inventory and stock"]
  T --> C4["Master data lists"]
  T -.-> O0["Manufacturing"]
  T -.-> O1["Purchase orders"]
  T -.-> O2["Goods inward"]
  T -.-> O3["Incoming quality check"]
  T -.-> O4["Return to vendor"]
  T -.-> O5["Material request and issue"]
  T -.-> O6["Customer payments"]
  T -.-> O7["Customer master"]
  T -.-> O8["Employee master"]
  T -.-> O9["Management reports"]
```
