---
id: TMOD-purchase-orders
kind: template-module
name: Purchase orders
aliases: [Raw material purchasing]
patterns: [PAT-approval-by-status, PAT-message-on-event, PAT-scheduled-reminder-message, PAT-generated-id, PAT-line-items-grid-with-totals, PAT-status-from-quantities, PAT-copy-fields-from-ref, PAT-query-report-with-filter]
neomeApp: purchase-management
delivery: configuration
seenIn:
  - {build: NB-05, area: Orphans (maybe dead)}
  - {build: NB-06, area: PurchaseOrder}
---

# Purchase orders

## Usual needs

- Usually has to raise a purchase order to a vendor with material lines, rate and tax.
- Usually has to work out totals, tax and landing cost.
- Usually has to let an approver approve or reject and tell the vendor.
- Usually has to track status from receipts and checks (part received, in check, received).
- Usually has to remind the team weekly about open orders.
- Usually has to print the order.

## Process steps

1. Store adds an order for a vendor; number is made.
2. Lines and totals are filled.
3. Approver decides; vendor and group are told.
4. Receipts and checks update quantities.
5. Status moves to received or closed.

## Usual sheets, key fields, roles

- PurchaseOrder: PurchaseOrderNo, Vendor, ExpectedDeliveryDate, lines (Material, Quantity, Rate, Total, received, approved, rejected), ApprovalStatus, Status
- Roles: Store manager, Approver.

## Neome App / Delivery hint

Neome App: purchase-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Store adds an order for a vendor number is made."]
  B["Lines and totals are filled."]
  C["Approver decides vendor and group are told."]
  D["Receipts and checks update quantities."]
  E["Status moves to received or closed."]
  A --> B
  B --> C
  C --> D
  D --> E
```
