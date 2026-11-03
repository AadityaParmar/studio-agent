---
id: PAT-line-items-grid-with-totals
kind: pattern
name: Line items grid with totals
workaround: false
seenIn:
  - {build: NB-01, area: JobWork}
  - {build: NB-02, area: Expense}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: CreditNote}
  - {build: NB-04, area: Expenses}
  - {build: NB-04, area: MasterData}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: Quotation}
  - {build: NB-04, area: Stock}
  - {build: NB-05, area: Lead}
  - {build: NB-05, area: Quotation}
  - {build: NB-05, area: Orphans (maybe dead)}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-06, area: Quotation}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-06, area: Inward}
  - {build: NB-06, area: RequestMaterialNotification}
  - {build: NB-07, area: Orphans (maybe dead)}
  - {build: NA-field-visit-management, area: VisitManagement}
  - {build: NA-inventory-and-stock-management, area: Inventory}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
---

# Line items grid with totals

## Task

List items (products, parts, expenses, materials) on one row and total them with discount and tax.

## How

- Grid section; each line refs the product or item master and copies price, unit and tax.
- Formula per line: amount = quantity x rate, tax, discount.
- Summary formulas: SUM over the grid, grand total, amount in words.
- onInitAndOnChange events keep totals live.

## Workaround

No. Direct feature (grid plus formula logic).

## Limits

- Formulas run on the form; values written later by workflows need their own recalculation.
- Tax rules are hand-written in formulas.

## Flowchart

```mermaid
flowchart TD
  A["Add grid line"]
  B["Pick item, price copied"]
  C["Line amount by formula"]
  D["Summary totals by SUM"]
  A --> B
  B --> C
  C --> D
```
