---
id: PAT-follow-up-log
kind: pattern
name: Follow-up log on a record
workaround: false
seenIn:
  - {build: NB-05, area: Lead}
  - {build: NB-07, area: Orphans (maybe dead)}
---

# Follow-up log on a record

## Task

Log dated follow-ups or remarks against a lead or other record.

## How

- Grid of date and remarks on the record, or a follow-up sheet with refTarget to any row.
- Formula copies the target name.

## Workaround

No. Direct feature (grid or refTarget).

## Limits

- Grid logs are not reportable across records as easily as a sheet.

## Flowchart

```mermaid
flowchart TD
  A["Rep talks to contact"]
  B["Adds follow-up line"]
  C["Next date set"]
  A --> B
  B --> C
```
