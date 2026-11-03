---
id: PAT-lead-or-customer-pick
kind: pattern
name: Pick a lead or a customer from one list
workaround: true
seenIn:
  - {build: NB-04, area: MyVisitPlanner}
  - {build: NB-04, area: ProductDevelopmentRequest}
  - {build: NB-04, area: Sampling}
  - {build: NB-04, area: WeeklyUpdate}
  - {build: NB-04, area: ProjectDatabase}
  - {build: NB-04, area: Lead}
---

# Pick a lead or a customer from one list

## Task

Pick a target that may be a lead or an existing customer (or a visit) from one list.

## How

- Query report that returns lead and customer rows together.
- refReport field with copied name, category and contact.
- Optional type pickText (lead or current customer) to pick the source.

## Workaround

Yes. Lead and customer are two sheets; a combined report stands in for one list.

## Limits

- Copied data does not follow when a lead becomes a customer.
- Every form that needs it repeats the report ref.

## Flowchart

```mermaid
flowchart TD
  A["User opens form"]
  B["Combined report lists leads and customers"]
  C["User picks one"]
  D["Details copied"]
  A --> B
  B --> C
  C --> D
```
