---
id: TMOD-dealer-stock-count
kind: template-module
name: Dealer stock count
aliases: [Dealer stock taking]
patterns: [PAT-line-items-grid-with-totals, PAT-customer-price-list, PAT-composite-report, PAT-copy-fields-from-ref]
neomeApp: fmcg-field-sales-and-distribution
delivery: configuration
seenIn:
  - {build: NB-04, area: Stock}
---

# Dealer stock count

## Usual needs

- Usually has to let a rep count stock held by a dealer by product.
- Usually has to apply the dealer's discount to the rate and work out the value.
- Usually has to report by dealer, month and product.
- Usually has to list dealers missing a count.

## Process steps

1. Rep adds a count for a dealer.
2. Discount fetched before insert.
3. Quantity, rate and value worked out.

## Usual sheets, key fields, roles

- Stock count: Date, EnteredBy, Customer, product grid (Product, Quantity, Discount, Rate, Total), FinalAmount
- Roles: Sales rep, Manager, Admin.

## Neome App / Delivery hint

Neome App: fmcg-field-sales-and-distribution. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Rep adds a count for a dealer."]
  B["Discount fetched before insert."]
  C["Quantity, rate and value worked out."]
  A --> B
  B --> C
```
