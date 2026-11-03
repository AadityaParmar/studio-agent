---
id: PAT-pdf-from-report
kind: pattern
name: PDF from a report
workaround: false
seenIn:
  - {build: NB-01, area: Onboarding}
  - {build: NB-01, area: Payments}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: Quotation}
  - {build: NB-04, area: ProductDevelopmentRequest}
  - {build: NB-05, area: Payroll}
  - {build: NA-crm, area: CRM}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
---

# PDF from a report

## Task

Make a PDF (receipt, quotation, order, payslip, request) and keep or send it.

## How

- Composite report merging a section part and a grid part into an output form.
- Workflow on approval, payment or insert: executeReport, generatePdf.
- Row update stores the PDF in a document field; optional deeplink.
- Send by email, WhatsApp or user message.

## Workaround

No. Direct feature (report plus generatePdf).

## Limits

- Layout follows the output form; fine print layout is limited.
- Regenerate when the source changes, or the PDF goes stale.

## Flowchart

```mermaid
flowchart TD
  A["Approved or paid"]
  B["Run report"]
  C["Generate PDF"]
  D["Store on row"]
  E["Send"]
  A --> B
  B --> C
  C --> D
  D --> E
```
