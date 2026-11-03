---
id: PAT-read-document-into-form
kind: pattern
name: Read a document into a form
workaround: false
seenIn:
  - {build: NB-04, area: Marketing}
  - {build: NB-04, area: MyCustomers}
---

# Read a document into a form

## Task

Fill form fields from an uploaded document (customer details, lead list).

## How

- Document field on the sheet.
- Workflow on insert-after: branch when the document has a value.
- aiDocumentToForm, then row update or row insert with the read fields.

## Workaround

No. Direct feature (document to form node).

## Limits

- Read values need a human check.

## Flowchart

```mermaid
flowchart TD
  A["User uploads document"]
  B["Workflow reads it"]
  C["Fields filled on the row"]
  A --> B
  B --> C
```
