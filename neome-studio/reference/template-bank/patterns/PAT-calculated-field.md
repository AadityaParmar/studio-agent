---
id: PAT-calculated-field
kind: pattern
name: Calculated field by formula
workaround: false
seenIn:
  - {build: NB-01, area: Deboarding}
  - {build: NB-01, area: Onboarding}
  - {build: NB-01, area: Payments}
  - {build: NB-02, area: Attendance}
  - {build: NB-02, area: MasterData}
  - {build: NB-04, area: SalesExecutives}
  - {build: NB-05, area: MasterData}
  - {build: NB-05, area: Payroll}
  - {build: NB-05, area: Leave}
  - {build: NB-06, area: FinishGood}
  - {build: NB-06, area: Inward}
  - {build: NB-06, area: Inventory}
  - {build: NB-06, area: QualityChecking}
  - {build: NB-07, area: ADGCentral}
  - {build: NB-07, area: HRCentral}
---

# Calculated field by formula

## Task

Work out a value on the form from other fields (refund, hours, day status, salary parts, leave days, days taken, weekday).

## How

- Formula logic on the target field.
- onInitAndOnChange event so it updates as the user types.
- JavaScript expressions for dates, rounding and lookup maps.

## Workaround

No. Direct feature (formula logic).

## Limits

- Long formulas are hard to check; keep them short or split them.
- Values only change when the form runs; rows changed by workflows keep the old value.

## Flowchart

```mermaid
flowchart TD
  A["User fills input fields"]
  B["Formula runs on change"]
  C["Target field shows result"]
  A --> B
  B --> C
```
