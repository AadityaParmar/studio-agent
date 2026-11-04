---
id: TMOD-vendor-return
kind: template-module
name: Return to vendor
aliases: [Return rejected material to vendor]
patterns: [PAT-pick-from-report-ref, PAT-pick-many-rows, PAT-update-linked-rows, PAT-message-on-event, PAT-show-field-by-value]
neomeApp: purchase-management
delivery: configuration
seenIn:
  - {build: NB-06, area: Return}
---

# Return to vendor

## Usual needs

- Usually has to return rejected material to the vendor.
- Usually has to show rejected and still-to-return quantity per material.
- Usually has to pick and update the returned units.
- Usually has to note transport, vehicle and labour cost with a document.
- Usually has to tell the vendor.

## Process steps

1. Store adds a return for a vendor.
2. Rejected lines and units picked.
3. Units updated.
4. Vendor told.

## Usual sheets, key fields, roles

- Return: ReturnDate, Vendor, Transport, VehicleNo, cost, Document, lines (rejected ref, units, ReturnQty)
- Roles: Store manager.

## Neome App / Delivery hint

Neome App: purchase-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Store adds a return for a vendor."]
  B["Rejected lines and units picked."]
  C["Units updated."]
  D["Vendor told."]
  A --> B
  B --> C
  C --> D
```
