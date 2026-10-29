# Request for Proposal: CRM System Implementation

Falcon Ridge Trading LLC
Issued by: Daniel Sousa, Finance Manager and Project Coordinator
September 2026

## 1. Purpose

Falcon Ridge invites proposals for a CRM system covering our full quote-to-cash process. Today we run on Excel, email and WhatsApp.

## 2. About us

Falcon Ridge is a trading company supplying equipment and materials to oil and gas operators in the Gulf. We work back to back: we represent manufacturers (principals) and sell their products to operators and their contractors. About 10 users will use the system (sales, operations, finance).

## 3. Scope

All modules in Section 5, plus security (Section 6), integration (Section 7) and implementation (Section 8).

## 4. Our process

### 4.1 Quote to cash

1. Before any tender, a product must be approved by each operator. For each candidate product and manufacturer: principal agreement signed, documents submitted to the operator, audit or due diligence, then approved or rejected. Approved products are added to that operator's approved makes. Each operator runs its own approval process.
2. Opportunity: tender stage, probability, competitors, expected value.
3. Enquiry (RFQ) from the customer: RFQ number, customer, project, items, quantities, deadline.
4. Quotation: principal cost, selling price, margin, validity, Incoterms.
5. Clarify and negotiate: technical queries (TQs), drawings and datasheets; price revisions.
6. Customer PO received and checked against the quotation we submitted.
7. Principal PO raised on the principal; production and shipment followed up.
8. Post-order documents: ITP, GAD, MTC, WPS/PQR, inspection records, client approval. These must close before goods move.
9. Delivery: inspection, RFI, shipping, customs, delivery to site with delivery note.
10. Receivables: invoice, due date, outstanding. We pay the principal back to back once the customer pays.
11. After-sales: complaints, warranty, replacement, feedback.

There are two kinds of order:

- **Own-account orders** run through our books (steps 6 to 10 above).
- **Commission orders**: the buyer orders directly from the principal. We track the order and earn a pre-agreed commission, around 3%, which we invoice to the principal. These must stay separate from our own order book.

### 4.2 General requirements

1. Reminders for quote validity, RFQ deadlines, open TQs and overdue invoices.
2. Notifications by email and WhatsApp, not only inside the system.
3. Mobile use in the field, including where there is no signal.
...
13. Every record and transaction must have a named owner and assignees.

## 5. Functional requirements

| # | Module | Requirement |
|---|---|---|
| 5.1 | Customer Master | Name, industry, location, contacts, departments, approved vendor status |
| 5.2 | Supplier / Principal Master | Manufacturer, contact, approved makes, lead time, pricing, certifications |
| 5.3 | End-User Product Approval | Agreement signing, document submission, audit, tracking until approval |
| 5.4 | Opportunity / Project | Tender stage, probability, competitors, expected value |
| 5.5 | Enquiry / RFQ | RFQ number, date, customer, project, items, quantities, deadline |
| 5.6 | Quotation | Number, cost, selling price, margin, validity, Incoterms, delivery |
| 5.7 | Offer Follow-Ups | Track every quotation from submission to PO |
| 5.8 | Technical Clarifications | Customer comments, TQ status, drawings, datasheets, approvals |
| 5.9 | Commercial Negotiation | Initial, revised, discount and target price, history |
| 5.10 | Profit Optimization | Review historical cost and price data to optimise margin |
| 5.11 | PO Management | PO number, value, delivery date, payment terms, status |
| 5.12 | Commission Management | Commission orders, progress, commission invoicing, payment realisation |
| 5.13 | Post-Order Document Approval | ITP, GAD, MTC, WPS/PQR, inspection, deviations, client approval |
| 5.14 | Delivery Tracking | Production, inspection, RFI, shipping, customs, delivery to site |
| 5.15 | Receivables | Invoice, due date, payment status, outstanding amount |
| 5.16 | After-Sales | Complaints, warranty, replacement, customer feedback |
| 5.17 | Reports / Dashboards | Pipeline, won/lost RFQs, margins, pending deliveries, receivables, notifications |

## 6. Security and access

Cost, margin, commission terms and principal pricing are sensitive and must be visible only to a named few.

1. Role-based access and field-level permissions.
2. Two-factor authentication.
3. Audit trail of changes to sensitive records (pricing, margins, deal values, contact details).
4. Restrict bulk export and download.
5. State where our data will be hosted, your certifications, and your backup and recovery arrangements.
6. State whether any third party will need access to our data during implementation.

## 7. Integration

SAP stays our system of record for orders and finance. No live integration is needed now. Describe how the CRM could connect to SAP later.

## 8. Implementation

Describe your approach and timeline, including data migration of existing customer, supplier and historical tender and order records, training for users and administrators, and support after go-live with response times.

## 9. Commercials

Licensing, implementation services and optional items. May be sent separately.

## 10. Vendor profile

Company background, customers in the region, relevant experience, references.

## 11. Submission

Send proposals to Daniel Sousa by email by 15 October 2026.
