---
id: TMOD-knowledge-library
kind: template-module
name: Knowledge library
aliases: [Sales material library]
patterns: [PAT-approval-by-status, PAT-role-views-of-one-sheet, PAT-running-total-by-log-field, PAT-copy-fields-from-ref, PAT-admin-kept-pick-list]
neomeApp: knowledge-library
delivery: standard
seenIn:
  - {build: NB-04, area: SalesRepository}
  - {build: NA-knowledge-library, area: KnowledgeLibrary}
---

# Knowledge library

## Usual needs

- Usually has to keep titled links, documents or articles for staff, by category.
- Usually has to sometimes approve an article before it is published.
- Usually has to sometimes let readers rate an article and leave feedback.

## Process steps

1. Admin or creator adds a title, link, documents or article.
2. Approver publishes it when needed.
3. Staff open the list.
4. Readers rate it when needed.

## Usual sheets, key fields, roles

- Library item or article: Title, Category, Link or Content, Documents, Version, ApprovalStatus, Status {Draft|Publish}
- Feedback (optional): article ref, Rating, Feedback
- Roles: Admin or content creator, Approver, staff readers.

## Neome App / Delivery hint

Neome App: knowledge-library. Delivery: standard. Hint only; grilling decides.

## Flowchart

```mermaid
flowchart TD
  A["Admin or creator adds a title, link, documents or article."]
  B["Approver publishes it when needed."]
  C["Staff open the list."]
  D["Readers rate it when needed."]
  A --> B
  B --> C
  C --> D
```
