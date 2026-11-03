---
id: TMOD-my-profile
kind: template-module
name: My profile view
aliases: [My profile, My profile dashboard]
patterns: [PAT-composite-report]
neomeApp: none
delivery: configuration
seenIn:
  - {build: NB-01, area: Profile}
  - {build: NB-02, area: MyProfile}
  - {build: NB-04, area: MyProfile}
---

# My profile view

## Usual needs

- Usually has to show each user their own details, balances and items on one screen (leave, holidays, targets, visits, expenses, complaints, transactions).

## Process steps

1. User opens own profile report.
2. Parts load for the user and the optional date.

## Usual sheets, key fields, roles

- No own sheets; reads other modules.
- Roles: Every user role.

## Neome App / Delivery hint

Neome App: none. Delivery: configuration (composite report). Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["User opens own profile report."]
  B["Parts load for the user and the optional date."]
  A --> B
```
