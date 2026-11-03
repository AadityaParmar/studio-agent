---
id: PAT-delayed-call-by-formula
kind: pattern
name: Delayed report call by formula
workaround: true
seenIn:
  - {build: NB-04, area: WeeklyUpdate}
  - {build: NB-05, area: MasterData}
---

# Delayed report call by formula

## Task

Fetch data once the form has the values it needs (zone of the person, salary parts).

## How

- Helper text field with a formula that gets a value only when the inputs are filled.
- Its change fires the report call or the next formulas.

## Workaround

Yes. No on-load report call; a changing helper field triggers it.

## Limits

- Hard to see why it fires; name the helper field clearly.

## Flowchart

```mermaid
flowchart TD
  A["Form fills inputs"]
  B["Helper field gets value"]
  C["Change fires report call"]
  A --> B
  B --> C
```
