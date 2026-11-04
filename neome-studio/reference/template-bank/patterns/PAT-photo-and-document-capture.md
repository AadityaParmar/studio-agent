---
id: PAT-photo-and-document-capture
kind: pattern
name: "Photo, document and signature capture"
workaround: false
seenIn:
  - {build: NB-01, area: Complaints}
  - {build: NB-01, area: JobWork}
  - {build: NB-01, area: Onboarding}
  - {build: NB-04, area: CreditNote}
  - {build: NB-04, area: Complaint}
  - {build: NB-06, area: QualityChecking}
  - {build: NB-06, area: Payment}
  - {build: NB-07, area: HRCentral}
  - {build: NA-field-service, area: FieldService}
  - {build: NA-gate-pass-management, area: GatePassManagement}
---

# Photo, document and signature capture

## Task

Attach proof to a row: photos, place, documents, receipts, signature.

## How

- camera, image, document and setOfDocument fields.
- location field for the place.
- signature field, often with approver pickUser fields.

## Workaround

No. Direct feature (capture field types).

## Limits

- Many large photos slow sync on weak networks.

## Flowchart

```mermaid
flowchart TD
  A["User fills row"]
  B["Takes photo or uploads document"]
  C["Signs"]
  D["Row saved with proof"]
  A --> B
  B --> C
  C --> D
```
