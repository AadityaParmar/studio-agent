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

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: Doc (host form), Lines, ItemSheet, ItemList. Needs first: host form Doc; item master sheet with a list or card layout.

1. Grid: `add kind=composite parent=Doc type=grid name=Lines` → `type=ref Item spreadsheet=ItemSheet layoutSpreadsheet=ItemList copyFieldMap` → `type=decimal` Rate, TaxPct, Discount; `type=text Unit`; `type=number Qty`; `type=decimal` Amount, LineTax (`disabled=true`).
2. Summary: `add kind=composite parent=Doc type=section name=Summary` → `type=decimal` SubTotal, TaxTotal, GrandTotal; `type=text AmountInWords` (all `disabled=true`).
3. `kind=gridLayout kind=table composite=Lines showComps=[…]`.
4. Line formulas: `formFormula assignToField=Lines.Amount formula{value:"${f:Lines.Qty}*${f:Lines.Rate}-${f:Lines.Discount}"}`; same for `Lines.LineTax`.
5. Totals: `formFormula assignToField=SubTotal formula{value:"SUM(${f:Lines.Amount})"}`; TaxTotal, GrandTotal; AmountInWords (JS, or `var kind=function`).
6. Live: form `calculateFormulaMode=automatic`, or `formEventAction kind=executeFormula` + `formEvent kind=onInitAndOnChange eventComps=[Lines.Qty, Lines.Rate, Lines.Discount]`.
7. `validate` till ok=true.

Gaps: copyFieldMap shape (describe); amount-in-words JS by hand; values written by workflows need own recalculation.
