---
id: APP-quotation-and-order-flow
kind: app
name: Quotation & Order Flow
seenIn:
  - {build: NA-quotation-and-order-flow, area: Quotation & Order Flow}
---

# Quotation & Order Flow

## Gives

- Rep drafts a quote for a customer.
- Manager approves a quote; approved quote turns into an order.

## Sheets, key fields, roles

- Quote: Customer, Items, Total, Status `{Draft|Approved|Rejected}`.
- Roles: Sales Rep, Manager.

## Workflows

- Quote approval: on submit → Manager approves or rejects → notify Rep.

## Flowchart

```mermaid
flowchart LR
  A[Draft quote] --> B{Approved?} -->|yes| C[Order]
```
