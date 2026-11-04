---
id: TMOD-service-job-work
kind: template-module
name: Service job work
aliases: []
patterns: [PAT-line-items-grid-with-totals, PAT-copy-fields-from-ref, PAT-admin-kept-pick-list, PAT-update-linked-rows, PAT-act-on-status-change, PAT-split-payment-by-script, PAT-message-on-event, PAT-photo-and-document-capture, PAT-per-row-scheduler, PAT-scheduled-reminder-message, PAT-shared-sub-workflow, PAT-calculated-field, PAT-query-report-with-filter, PAT-composite-report]
neomeApp: field-service
delivery: configuration
seenIn:
  - {build: NB-01, area: JobWork}
  - {build: NA-field-service, area: FieldService}
---

# Service job work

## Usual needs

- Usually has to open a service job or request for a customer or asset, from a complaint or direct, with type and priority.
- Usually has to assign the job to a technician and tell the manager.
- Usually has to sometimes work out an SLA escalation time and message while the job is open.
- Usually has to let the technician log the visit with place, photo, resolution note and customer signature.
- Usually has to list parts used with price, quantity and amount.
- Usually has to total parts, service cost and discount.
- Usually has to mark the asset not available while the job is open.
- Usually has to resolve the linked complaint or request when done.
- Usually has to take payment from deposit, balance, cash or online.
- Usually has to tell the customer when paid.
- Usually has to sometimes show request, visit and SLA breach counts.

## Process steps

1. Staff adds a job with customer, service type and parts.
2. Job assigned; asset set not available; complaint updated.
3. Technician visits and completes the job.
4. Asset available; complaint or request resolved.
5. Payment taken; customer told.

## Usual sheets, key fields, roles

- JobWork or ServiceRequest: Customer, Complaint ref, ServiceType, Priority, Territory, photos, Technician, Status {Open|In Progress|Waiting Parts|Completed|Cancelled}, EscalateDateTime, parts grid, totals, PaymentMode, PaymentStatus
- ServiceVisit: request ref, Location, ResolutionDateTime, ResolutionImage, CustomerSignature
- Part: PartName, MRP, Price
- ServiceType: ServiceType, SLAHours; territory and priority lists
- Roles: Technician, Service manager, Admin.

## Neome App / Delivery hint

Neome App: field-service (amc-and-service-management for contract visits). Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Staff adds a job with customer, service type and parts."]
  B["Job assigned asset set not available complaint updated."]
  C["Technician visits and completes the job."]
  D["Asset available complaint or request resolved."]
  E["Payment taken customer told."]
  A --> B
  B --> C
  C --> D
  D --> E
```
