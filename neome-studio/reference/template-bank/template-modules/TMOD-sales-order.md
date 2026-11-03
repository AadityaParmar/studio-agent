---
id: TMOD-sales-order
kind: template-module
name: Sales order
aliases: [Sales orders]
patterns: [PAT-order-from-quote-or-direct, PAT-approval-by-status, PAT-line-items-grid-with-totals, PAT-pdf-from-report, PAT-stock-moves-by-workflow, PAT-per-row-scheduler, PAT-stop-save-by-workflow-check, PAT-message-on-event, PAT-customer-price-list, PAT-status-from-quantities, PAT-insert-row-in-other-sheet, PAT-update-linked-rows, PAT-pick-from-report-ref, PAT-generated-id]
neomeApp: quotation-and-order-flow
delivery: configuration
seenIn:
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: Order}
  - {build: NB-05, area: Quotation}
  - {build: NB-06, area: SalesOrder}
---

# Sales order

## Usual needs

- Usually has to raise an order for a customer from a quotation (or visit, enquiry, lead) or directly.
- Usually has to copy customer, transport and tax details from the customer.
- Usually has to work out line prices with customer discount, tax and totals.
- Usually has to let a manager approve or reject; tell the group or roles.
- Usually has to reserve stock and raise customer outstanding on approval.
- Usually has to track status through production, dispatch and delivery, and payment status.
- Usually has to send the order as a PDF by email or WhatsApp.
- Usually has to block remove once approved or dispatched; auto cancel and payment reminder by schedule.

## Process steps

1. Sales adds an order from a source or direct.
2. Number is made; source is marked.
3. Approver approves or rejects.
4. Stock is reserved; outstanding goes up.
5. Dispatch and payment update status and due amount.

## Usual sheets, key fields, roles

- Order: OrderId, Date, Source, source ref, Customer, products grid (Item, Rate, Discount, Quantity, DispatchedQty, Total), totals, ApprovalStatus {Pending|Approved|Rejected}, OrderStatus, PaymentStatus, DueAmount, PDF
- Roles: Sales rep or coordinator, Manager, Accounts, Admin.

## Neome App / Delivery hint

Neome App: quotation-and-order-flow. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Sales adds an order from a source or direct."]
  B["Number is made source is marked."]
  C["Approver approves or rejects."]
  D["Stock is reserved outstanding goes up."]
  E["Dispatch and payment update status and due amount."]
  A --> B
  B --> C
  C --> D
  D --> E
```
