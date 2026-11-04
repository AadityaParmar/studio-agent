---
id: TMOD-customer-complaints
kind: template-module
name: Customer complaints
aliases: []
patterns: [PAT-copy-fields-from-ref, PAT-admin-kept-pick-list, PAT-photo-and-document-capture, PAT-show-field-by-value, PAT-query-report-with-filter]
neomeApp: ticketing-and-task-management
delivery: configuration
seenIn:
  - {build: NB-01, area: Complaints}
  - {build: NB-04, area: Complaint}
---

# Customer complaints

## Usual needs

- Usually has to let a customer or staff log a complaint for a customer with type, place, text and photos.
- Usually has to keep a complaint type list.
- Usually has to move the complaint through a status list.
- Usually has to list open complaints.

## Process steps

1. Customer or rep adds a complaint.
2. Staff updates status.
3. Admin reviews open complaints.

## Usual sheets, key fields, roles

- Complaint: Date, Customer ref, Type, Location, Description, photos, Status {Open|In Service|Resolved|Closed|Cancelled}
- ComplaintType: ComplaintType
- Roles: Customer, Employee or rep, Admin.

## Neome App / Delivery hint

Neome App: ticketing-and-task-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Customer or rep adds a complaint."]
  B["Staff updates status."]
  C["Admin reviews open complaints."]
  A --> B
  B --> C
```
