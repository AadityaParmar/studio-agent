---
id: TMOD-samples
kind: template-module
name: Samples given
aliases: [Samples and marketing material]
patterns: [PAT-show-field-by-value, PAT-lead-or-customer-pick, PAT-deeplink-to-form, PAT-calculated-field, PAT-line-items-grid-with-totals]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-04, area: Sampling}
---

# Samples given

## Usual needs

- Usually has to record samples and display material given to a lead or customer, with quantity, value and photos.
- Usually has to work out total sample cost.
- Usually has to request a sample box for a customer and send the request link by email.

## Process steps

1. Rep adds sampling for a lead or customer.
2. Items marked Yes with quantity and value; total worked out.
3. Admin raises a sample box request; link emailed.

## Usual sheets, key fields, roles

- Sampling: Date, EnteredBy, type {Lead|Current Customer}, target, item Yes or No with quantity and value, TotalSamplingCost
- Sample box request: Date, Customer, samples grid, Status
- Roles: Sales rep, Manager, Admin.

## Neome App / Delivery hint

Neome App: none in the catalog. Delivery: configuration. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Rep adds sampling for a lead or customer."]
  B["Items marked Yes with quantity and value total worked out."]
  C["Admin raises a sample box request link emailed."]
  A --> B
  B --> C
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: Sampling, SampleBoxRequest, roles SalesRep, Manager, Admin. Needs first: Lead and Customer sheets (TMOD-lead-management, TMOD-customer-master).

1. Roles + vars: `add kind=role` x3; `add kind=var kind=setOfText` SamplingType {Lead|CurrentCustomer}, RequestStatus.
2. Sampling form: section → `type=date` Date, `type=userId defaultValue=createdBy` EnteredBy, `type=pickText source=SamplingType`, target pick (`apply PAT-lead-or-customer-pick Execute`); per item `type=bool` Given + `type=number` Quantity + `type=decimal` Value (or grid: `apply PAT-line-items-grid-with-totals Execute`), `type=image` Photos, `type=decimal` TotalSamplingCost → `SamplingSheet` → table layout.
3. Logic: `apply PAT-show-field-by-value Execute` (qty/value only when Yes); `apply PAT-calculated-field Execute` (TotalSamplingCost).
4. SampleBoxRequest form: `type=date` Date, `type=ref` Customer, grid Samples, `type=pickText` Status → `SampleBoxRequestSheet` → table layout.
5. Request link by email: `apply PAT-deeplink-to-form Execute` (`add kind=deeplink kind=spreadsheetInsert` → workflow `generateDeeplink` → `sendEmail`).
6. Actions + group: `kind=rowInsert` / `kind=spreadsheetEditor` per sheet → `set kind=group actionPermissionMap` (roles on every entry).
7. `validate` till ok=true.

Gaps: item list (fixed fields vs grid) per Enterprise (Open Item).
