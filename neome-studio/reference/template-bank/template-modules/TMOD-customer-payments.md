---
id: TMOD-customer-payments
kind: template-module
name: Customer payments
aliases: [Customer rent payment]
patterns: [PAT-running-total-by-log-field, PAT-copy-fields-from-ref, PAT-pdf-from-report, PAT-generated-id, PAT-stop-save-by-workflow-check, PAT-message-on-event, PAT-online-payment-event, PAT-photo-and-document-capture, PAT-act-on-status-change, PAT-outside-service-by-plugin]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-01, area: Payments}
  - {build: NB-06, area: Payment}
---

# Customer payments

## Usual needs

- Usually has to record a payment from a customer against an order or account.
- Usually has to keep payment mode, reference and documents.
- Usually has to update the order due amount and the customer balance.
- Usually has to make a receipt PDF and tell the customer.
- Usually has to sometimes take online payments and mark them paid on their own.

## Process steps

1. Accounts or customer adds a payment.
2. Number is made.
3. Payment marked paid.
4. Order and customer balances updated.
5. Receipt made and sent.

## Usual sheets, key fields, roles

- Payment: PaymentId, Date, Customer, Order or plan ref, Amount, PaymentMode {Cash|UPI|Bank Transfer|Cheque|Online}, PaymentStatus {Pending|Paid}, Documents, Receipt
- Roles: Accounts, Employee, Customer.

## Neome App / Delivery hint

Neome App: none in the catalog. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Accounts or customer adds a payment."]
  B["Number is made."]
  C["Payment marked paid."]
  D["Order and customer balances updated."]
  E["Receipt made and sent."]
  A --> B
  B --> C
  C --> D
  D --> E
```
