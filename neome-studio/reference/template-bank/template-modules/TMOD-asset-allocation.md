---
id: TMOD-asset-allocation
kind: template-module
name: Asset allocation
aliases: [Asset register]
patterns: [PAT-stock-moves-by-workflow, PAT-copy-fields-from-ref, PAT-admin-kept-pick-list]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-05, area: AssetManagement}
  - {build: NB-07, area: HRCentral}
---

# Asset allocation

## Usual needs

- Usually has to keep a list of company assets with category, serial number, purchase date and quantity.
- Usually has to give assets to employees and take them back.
- Usually has to keep the available quantity right after each give or take back.

## Process steps

1. HR adds asset categories and assets.
2. HR records an allocation to an employee.
3. HR records a recovery.
4. Available quantity updates on its own.

## Usual sheets, key fields, roles

- Asset: AssetName or type, category, SerialNumber, PurchaseDate, Quantity (log number), holder
- Allocation and recovery: Date, Employee, grid of Asset and Quantity
- Roles: HR, Owner, Employee.

## Neome App / Delivery hint

Neome App: none in the catalog. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["HR adds asset categories and assets."]
  B["HR records an allocation to an employee."]
  C["HR records a recovery."]
  D["Available quantity updates on its own."]
  A --> B
  B --> C
  C --> D
```
