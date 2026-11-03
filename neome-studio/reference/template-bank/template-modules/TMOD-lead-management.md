---
id: TMOD-lead-management
kind: template-module
name: Lead management
aliases: [Lead tracking, Sales inquiry, Lead pipeline]
patterns: [PAT-assign-by-mapping-sheet, PAT-role-views-of-one-sheet, PAT-show-field-by-value, PAT-insert-row-in-other-sheet, PAT-running-total-by-log-field, PAT-follow-up-log, PAT-line-items-grid-with-totals, PAT-query-report-with-filter, PAT-stage-sections-on-one-record, PAT-lead-or-customer-pick, PAT-copy-fields-from-ref, PAT-pick-from-report-ref, PAT-composite-report]
neomeApp: lead-management
delivery: configuration
seenIn:
  - {build: NB-01, area: Inquiry}
  - {build: NB-04, area: Lead}
  - {build: NB-05, area: Lead}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: Orphans (maybe dead)}
---

# Lead management

## Usual needs

- Usually has to add a lead with source, contact, place, category and type.
- Usually has to start a lead from a visit or an existing customer.
- Usually has to assign the lead to a rep, by hand or by zone.
- Usually has to track lead status or stage and a follow-up date.
- Usually has to log follow-ups and visits; count days since the last visit.
- Usually has to list the products and quantity the lead wants.
- Usually has to plan a visit for the lead.
- Usually has to hand lead data to a quotation.
- Usually has to show lead counts, funnel and revenue reports.

## Process steps

1. Rep or marketing adds a lead.
2. Lead is assigned to a rep.
3. Rep follows up, plans visits and logs talks.
4. Stage moves (demo, quote, won or lost).
5. Quotation is made from the lead.
6. Reports show the funnel.

## Usual sheets, key fields, roles

- Lead: LeadId, Date, Source, contact, place, Category, AssignTo, Status or Stage, FollowUpDate, products grid, follow-up grid
- Stage to probability list (optional)
- Roles: Sales rep, Marketing, Manager, Owner or Admin.

## Neome App / Delivery hint

Neome App: lead-management. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Rep or marketing adds a lead."]
  B["Lead is assigned to a rep."]
  C["Rep follows up, plans visits and logs talks."]
  D["Stage moves demo, quote, won or lost ."]
  E["Quotation is made from the lead."]
  F["Reports show the funnel."]
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
```
