---
id: TMOD-field-visits
kind: template-module
name: Field visits
aliases: [Field visit log, Customer visits, Client and visits]
patterns: [PAT-show-field-by-value, PAT-deeplink-to-form, PAT-insert-row-in-other-sheet, PAT-update-linked-rows, PAT-running-total-by-log-field, PAT-message-on-event, PAT-device-location-trail, PAT-role-views-of-one-sheet, PAT-role-copy-of-report, PAT-copy-fields-from-ref, PAT-calculated-field]
neomeApp: field-visit-management
delivery: configuration
seenIn:
  - {build: NB-02, area: Client}
  - {build: NB-04, area: VisitBook}
  - {build: NB-05, area: Visits}
---

# Field visits

## Usual needs

- Usually has to let a rep log a visit to a customer or lead with place, photos and remarks.
- Usually has to pick visit type and show the right outcome questions.
- Usually has to work out visit time from start and end.
- Usually has to start a new lead or order from the visit outcome.
- Usually has to turn a follow-up date into a new planned visit.
- Usually has to add the visit place to the location trail.
- Usually has to let managers see team visits and many visit reports.
- Usually has to sometimes send a thank-you message to the contact.

## Process steps

1. Rep picks the customer or planned visit.
2. Rep starts and ends the visit with place and photos.
3. Rep sets type, outcome and next step.
4. Outcome may open a lead or order form.
5. Follow-up adds a new plan; lead visit count updates.

## Usual sheets, key fields, roles

- Visit: VisitId, VisitedBy, Date, customer or plan ref, VisitType, outcome fields, Location, photos, NextFollowUp, FollowupDate
- Roles: Sales rep, Manager, Admin, Owner.

## Neome App / Delivery hint

Neome App: field-visit-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Rep picks the customer or planned visit."]
  B["Rep starts and ends the visit with place and photos."]
  C["Rep sets type, outcome and next step."]
  D["Outcome may open a lead or order form."]
  E["Follow-up adds a new plan lead visit count updates."]
  A --> B
  B --> C
  C --> D
  D --> E
```
