---
id: TMOD-weekly-update
kind: template-module
name: Weekly update note
aliases: [Weekly update]
patterns: [PAT-lead-or-customer-pick, PAT-delayed-call-by-formula, PAT-query-report-with-filter]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-04, area: WeeklyUpdate}
---

# Weekly update note

## Usual needs

- Usually has to let a rep write a weekly note about a lead or customer.
- Usually has to make a weekly summary report to share.

## Process steps

1. Rep adds a weekly update.
2. Summary report is made.

## Usual sheets, key fields, roles

- Weekly update: Date, PreparedBy, target, Remarks
- Roles: Sales rep, Manager, Admin.

## Neome App / Delivery hint

Neome App: none. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Rep adds a weekly update."]
  B["Summary report is made."]
  A --> B
```
