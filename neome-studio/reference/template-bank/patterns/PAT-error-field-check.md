---
id: PAT-error-field-check
kind: pattern
name: Error field check on the form
workaround: false
seenIn:
  - {build: NB-02, area: LeaveApplication}
  - {build: NB-02, area: PlumberMeet}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-06, area: QualityChecking}
  - {build: NB-07, area: HR Desk}
---

# Error field check on the form

## Task

Show an error on the form before save (balance short, material short, repeated numbers, bad quantity).

## How

- error field with a formula that compares values (often values pulled by a report ref).
- Visibility rule shows the error when it has a value.
- Error count field; send is hidden while the count has a value.

## Workaround

No. Direct feature (error field plus formula and visibility).

## Limits

- Checks only what the form can see; data written by workflows is not checked.

## Flowchart

```mermaid
flowchart TD
  A["User fills form"]
  B["Formula compares values"]
  C["Error shown"]
  D["Send hidden until fixed"]
  A --> B
  B --> C
  C --> D
```
