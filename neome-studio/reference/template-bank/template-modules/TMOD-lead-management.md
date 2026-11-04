---
id: TMOD-lead-management
kind: template-module
name: Lead management
aliases: [Lead tracking, Sales inquiry, Lead pipeline]
patterns: [PAT-assign-by-mapping-sheet, PAT-role-views-of-one-sheet, PAT-show-field-by-value, PAT-insert-row-in-other-sheet, PAT-running-total-by-log-field, PAT-follow-up-log, PAT-line-items-grid-with-totals, PAT-query-report-with-filter, PAT-stage-sections-on-one-record, PAT-lead-or-customer-pick, PAT-copy-fields-from-ref, PAT-pick-from-report-ref, PAT-composite-report, PAT-message-on-event, PAT-act-on-status-change, PAT-per-row-scheduler, PAT-scheduled-job-over-rows, PAT-admin-kept-pick-list, PAT-ai-reads-into-form]
neomeApp: lead-management
delivery: configuration
seenIn:
  - {build: NB-01, area: Inquiry}
  - {build: NB-04, area: Lead}
  - {build: NB-05, area: Lead}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: Orphans (maybe dead)}
  - {build: NA-crm, area: CRM}
  - {build: NA-lead-management, area: Lead}
---

# Lead management

## Usual needs

- Usually has to add a lead with source, contact, place, category and type.
- Usually has to start a lead from a visit or an existing customer.
- Usually has to assign the lead to a rep, by hand or by zone, and tell the rep.
- Usually has to track lead status or stage and a follow-up date.
- Usually has to log follow-ups and visits; count activities or days since the last visit.
- Usually has to remind about follow-ups and chase inactive leads daily.
- Usually has to list the products and quantity the lead wants.
- Usually has to plan a visit for the lead.
- Usually has to hand lead data to a quotation.
- Usually has to show lead counts, funnel, source, rep performance and revenue reports.
- Usually has to sometimes score a lead from source, status and activity count.
- Usually has to sometimes turn a won lead into a customer, contact and opportunity.
- Usually has to sometimes make a lead from an uploaded document or a chat message.

## Process steps

1. Rep or marketing adds a lead.
2. Lead is assigned to a rep; rep is told.
3. Rep follows up, plans visits and logs talks.
4. Stage moves demo, quote, won or lost.
5. Quotation or customer is made from the lead.
6. Reports show the funnel.

## Usual sheets, key fields, roles

- Lead: LeadId, Date, Source, contact, place, Category, AssignTo, Status or Stage, FollowUpDate, products grid, follow-up grid, activity count (log number)
- Activity or follow-up: Lead ref, ActivityType, Discussion, FollowUpDateTime
- Source, activity type and stage lists; scoring rules (optional)
- Stage to probability list (optional)
- Roles: Sales rep, Marketing, Manager, Owner or Admin.

## Neome App / Delivery hint

Neome App: lead-management (crm when accounts and opportunities are needed). Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Rep or marketing adds a lead."]
  B["Lead is assigned to a rep rep is told."]
  C["Rep follows up, plans visits and logs talks."]
  D["Stage moves demo, quote, won or lost."]
  E["Quotation or customer is made from the lead."]
  F["Reports show the funnel."]
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: LeadForm, LeadSheet, ActivityForm, ActivitySheet, LeadWf. Needs first: customer sheet (TMOD-customer-master), product sheet (TMOD-product-catalog), zone lists (TMOD-master-data). If Neome App lead-management (or crm) is installed, `list` and reuse.

1. Roles + vars: `add kind=role` SalesRep, Marketing, Manager, Owner, Admin; `add kind=var kind=setOfText` VarLeadSource, VarLeadStage, VarActivityType; `kind=sequence` for LeadId.
2. Lists: `apply PAT-admin-kept-pick-list Execute` (source, activity type, stage; stage-probability if asked).
3. Lead: LeadForm section (LeadId `type=identifier`, Date, Source / Stage `type=pickText`, ContactName `type=text`, Mobile `type=mobileNumber`, Place `type=location`, AssignTo `type=pickUser`, FollowUpDate `type=date`, ActivityCount `type=logNumber`) + `composite type=grid` Products, FollowUps → LeadSheet → table + list + `kind=kanban kanbanField=Stage`.
4. Activity: ActivityForm section (ActivityType `type=pickText`, Discussion `type=paragraph`, FollowUpDateTime `type=dateTime`) → ActivitySheet → Lead `type=ref`.
5. Form logic, apply Execute: PAT-lead-or-customer-pick, PAT-copy-fields-from-ref, PAT-pick-from-report-ref, PAT-show-field-by-value, PAT-line-items-grid-with-totals, PAT-stage-sections-on-one-record.
6. Assign + tell: `apply PAT-assign-by-mapping-sheet Execute` (zone → rep) + `PAT-message-on-event` (`eventSsInsertAfter` → `sendMessageToUsers` AssignTo).
7. Follow-ups: `PAT-follow-up-log` + `PAT-running-total-by-log-field` (`rowUpdateFieldLogNumber operation=add`); visit plan row `PAT-insert-row-in-other-sheet`.
8. Stage: `apply PAT-act-on-status-change Execute` (won → customer / quotation rows via `PAT-insert-row-in-other-sheet`).
9. Schedules: `PAT-per-row-scheduler` (follow-up reminder), `PAT-scheduled-job-over-rows` (daily inactive chase).
10. AI (optional): `apply PAT-ai-reads-into-form Execute` (document or chat → lead).
11. Actions: `rowInsert` + `apply PAT-role-views-of-one-sheet Execute` → `set kind=group actionPermissionMap`.
12. Reports: `PAT-composite-report`, `PAT-query-report-with-filter` (funnel, source, rep, revenue).
13. `validate` till ok=true. `describe` LeadSheet, LeadWf to confirm.

Gaps: lead score rules not in Template (Open Item when asked). `kanbanField` allowed types unstated (verify: describe).
