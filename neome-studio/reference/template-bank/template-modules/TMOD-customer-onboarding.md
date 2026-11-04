---
id: TMOD-customer-onboarding
kind: template-module
name: Customer onboarding
aliases: []
patterns: [PAT-approval-by-status, PAT-insert-row-in-other-sheet, PAT-pdf-from-report, PAT-online-payment-event, PAT-calculated-field, PAT-show-field-by-value, PAT-copy-fields-from-ref, PAT-message-on-event, PAT-photo-and-document-capture]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-01, area: Onboarding}
---

# Customer onboarding

## Usual needs

- Usually has to sign up a new customer with contact, ID documents, photo and signature.
- Usually has to pick a plan, start date and duration; work out rent, deposit and total.
- Usually has to take payment by cash or online and make a receipt.
- Usually has to review and approve or reject the sign-up.
- Usually has to create the customer and a first ledger row on approval.
- Usually has to tell the customer on approval and on payment.

## Process steps

1. Staff adds onboarding in Draft.
2. Plan and amounts filled.
3. Status In Review, then Approved or Rejected.
4. On approval the customer and ledger rows are made.
5. On payment a receipt is made and sent.

## Usual sheets, key fields, roles

- Onboarding: Branch, CustomerName, Mobile, City, ID documents, Plan, duration, amounts, PaymentMode, PaymentStatus, Receipt, Signature, Status {Draft|In Review|Approved|Rejected}
- Roles: Employee.

## Neome App / Delivery hint

Neome App: none in the catalog. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Staff adds onboarding in Draft."]
  B["Plan and amounts filled."]
  C["Status In Review, then Approved or Rejected."]
  D["On approval the customer and ledger rows are made."]
  E["On payment a receipt is made and sent."]
  A --> B
  B --> C
  C --> D
  D --> E
```
