---
id: TMOD-quality-check
kind: template-module
name: Quality check
aliases: [Incoming quality check]
patterns: [PAT-pick-from-report-ref, PAT-pick-many-rows, PAT-error-field-check, PAT-calculated-field, PAT-update-linked-rows, PAT-photo-and-document-capture, PAT-copy-fields-from-ref, PAT-show-field-by-value, PAT-composite-report, PAT-query-report-with-filter]
neomeApp: quality-control
delivery: configuration
seenIn:
  - {build: NB-06, area: QualityChecking}
  - {build: NA-quality-control, area: QualityControl}
---

# Quality check

## Usual needs

- Usually has to check received material against a purchase order, and sometimes production output.
- Usually has to sometimes check against a checklist of parameters with tolerance, pass or fail each.
- Usually has to record approved and rejected quantity per material or unit.
- Usually has to attach lab, lab report and photo.
- Usually has to keep rejected share and reason.
- Usually has to block wrong entries.
- Usually has to update order and stock from the result.
- Usually has to sometimes show pass, fail and rejection counts by date range.

## Process steps

1. Store or inspector adds a check for an order or production.
2. Received lines or checklist parameters are pulled in.
3. Approved and rejected units or pass and fail marked.
4. Order, stock and unit status updated.

## Usual sheets, key fields, roles

- QualityCheck: Order ref, Lab ref, ReceivedDate, LabDocument, Image, lines (ApprovedQty, RejectedQty, RejectedPercentage, RejectedReason, Error)
- Checklist (optional): Name, parameter grid (ParameterName, ToleranceRange)
- Inspection (optional): InspectionType {GRN|Production}, checklist ref, Result per parameter, Pass and Failed counts
- Roles: Store manager or quality inspector, Admin.

## Neome App / Delivery hint

Neome App: quality-control. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Store or inspector adds a check for an order or production."]
  B["Received lines or checklist parameters are pulled in."]
  C["Approved and rejected units or pass and fail marked."]
  D["Order, stock and unit status updated."]
  A --> B
  B --> C
  C --> D
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: QualityCheck, Checklist, Inspection, Lab, roles QualityInspector, StoreManager, Admin. Needs first: PurchaseOrderSheet (TMOD-purchase-orders), stock sheet (TMOD-inventory). If Neome App quality-control is installed, `list` and reuse it; build only gaps.

1. Roles + vars: `add kind=role` x3; `add kind=var kind=setOfText` InspectionType {GRN|Production}, Result {Pass|Fail}, RejectedReason.
2. QualityCheck form: section → `type=ref` Order (`spreadsheet=PurchaseOrderSheet`, list layout), `type=ref` Lab, `type=date` ReceivedDate, `type=document` LabDocument, `type=image` Image; grid Lines (`type=text` Material, `type=decimal` ApprovedQty, RejectedQty, RejectedPercentage, `type=pickText` RejectedReason, `type=error` Error) → `QualityCheckSheet` → table layout.
3. Pull received lines: `apply PAT-pick-from-report-ref Execute`; pick units: `apply PAT-pick-many-rows Execute`; `apply PAT-copy-fields-from-ref Execute`.
4. Math + blocks: `apply PAT-calculated-field Execute` (RejectedPercentage), `apply PAT-error-field-check Execute` (approved + rejected > received), `apply PAT-show-field-by-value Execute` (reason only when rejected).
5. Files: `apply PAT-photo-and-document-capture Execute`.
6. Optional Checklist form: section Name; grid Parameters (`type=text` ParameterName, ToleranceRange) → `ChecklistSheet` + list layout. Inspection form: `type=pickText` InspectionType, `type=ref` Checklist, grid Result per parameter, `type=number` PassCount, FailedCount → `InspectionSheet`.
7. Update order + stock: `apply PAT-update-linked-rows Execute` (`eventSsInsertAfter spreadsheet=QualityCheckSheet` → `rowUpdate` order lines, stock rows).
8. Counts: `apply PAT-query-report-with-filter Execute` + `apply PAT-composite-report Execute`.
9. Actions + group: `kind=rowInsert` / `kind=spreadsheetEditor` per sheet, `kind=report` → `set kind=group actionPermissionMap` (roles on every entry).
10. `validate` till ok=true.

Gaps: grid of checklist parameters copied into Inspection grid (mapping `gridMappingMap`) (verify: describe).
