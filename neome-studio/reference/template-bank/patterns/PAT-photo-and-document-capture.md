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

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: field names below. Needs first: the form and its sheet.

1. Photos: `type=camera SitePhoto allowPickImage mediaCompressionQuality=balanced captureLocation captureTime`; `type=image` for picked photos.
2. Files: `type=document ReceiptDoc fileTypeSet maxSize`; `type=setOfDocument Docs`.
3. Place: `type=location Place captureMode=onInsert`.
4. Sign: `type=pickUser Approver roleIdDataSource=[Role]` → `type=signature ApproverSign captureUser captureTime`; limit by `permissionMatrix` or `disabledRoles`.
5. Add fields to the sheet layout `showComps` / card `item.mediaFields`.
6. `validate` till ok=true.

Gaps: `maxSize` untyped (check variant schema); permissionMatrix shape (`schema kind=permissionMatrix`).
