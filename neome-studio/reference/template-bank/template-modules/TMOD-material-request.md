---
id: TMOD-material-request
kind: template-module
name: Material request and issue
aliases: [Material request lines with scanner]
patterns: [PAT-generated-id, PAT-forward-row, PAT-stock-moves-by-workflow, PAT-bar-code-per-unit, PAT-button-runs-workflow, PAT-copy-fields-from-ref, PAT-line-items-grid-with-totals, PAT-show-field-by-value]
neomeApp: inventory-and-stock-management
delivery: configuration
seenIn:
  - {build: NB-06, area: RequestMaterial}
  - {build: NB-06, area: RequestMaterialNotification}
---

# Material request and issue

## Usual needs

- Usually has to let the floor ask the store for material with quantity and reason.
- Usually has to let the store issue and record issued quantity.
- Usually has to show stock on hand while issuing.
- Usually has to scan or type unit codes to issue.
- Usually has to cut stock once per line.
- Usually has to show who asked and who issued.

## Process steps

1. Floor adds a request; ID is made.
2. Lines forwarded to the store.
3. Store scans units and issues quantity.
4. Stock updated once per line.

## Usual sheets, key fields, roles

- Request: RequestId, Date, RequestedBy, IssuedBy
- Request line: Material, RequestedQuantity, Reason, IssuedQuantity, picked units grid (Code, Quantity, Processed)
- Roles: Floor manager, Store manager.

## Neome App / Delivery hint

Neome App: inventory-and-stock-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Floor adds a request ID is made."]
  B["Lines forwarded to the store."]
  C["Store scans units and issues quantity."]
  D["Stock updated once per line."]
  A --> B
  B --> C
  C --> D
```
