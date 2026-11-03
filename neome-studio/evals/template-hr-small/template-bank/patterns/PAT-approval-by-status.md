---
id: PAT-approval-by-status
kind: pattern
name: Approval by status
workaround: true
seenIn:
  - {build: NB-81, area: Leave}
  - {build: NB-82, area: LeaveApplication}
  - {build: NB-83, area: Leave}
  - {build: NB-83, area: Expenses}
  - {build: NB-84, area: Claims}
---

# Approval by status

## Task

Someone raises a request; an approver accepts or rejects it; the raiser is told; on approval, other records change.

## How

- Request sheet has a `pickText` status: `Pending | Approved | Rejected` (shared `setOfText` var).
- Approver = role with update on the sheet, plus a `pickUser` Manager field and a team view (`spreadsheetEditor` action @Manager).
- Workflow on `eventSsUpdateAfter`: `branchIfElse Curr.Status notEqualTo Prior.Status` → notify raiser (`sendPushNotification`) → if `Approved`, update other sheets (balance).
- Variant, two levels: one status field per level (`ManagerStatus`, `HRStatus`), one branch per field. Seen in NB-83.

## Workaround

Yes. Builds model approval as a status field + workflow branch, not as a separate approval step. Why: not known.

## Limits

- Who may change the status is not proven (per-field rights not in digests).
- No escalation or delegation seen.
- Each extra level = new status field + new branch.

## Flowchart

```mermaid
flowchart TD
  A[Raiser inserts request<br/>Status = Pending] --> B[Approver edits Status]
  B --> C{Status changed?}
  C -->|no| Z[stop]
  C -->|yes| D[Notify raiser]
  D --> E{Approved?}
  E -->|yes| F[Update other sheets]
  E -->|no| Z
```
