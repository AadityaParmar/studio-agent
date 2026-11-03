---
id: PAT-approval-by-status
kind: pattern
name: Approval by status
workaround: true
seenIn:
  - {build: NB-02, area: LeaveApplication}
  - {build: NB-04, area: Leave}
  - {build: NB-05, area: Leave}
  - {build: NB-05, area: Expenses}
---

# Approval by status

## Task

Someone raises a request; an approver accepts or rejects it; the raiser is told; on approval, other records change.

## How

- Request sheet has a `pickText` status: `Pending | Approved | Rejected` (shared `setOfText` var).
- Approver = role with update on the sheet, plus a `pickUser` Manager field and a team view (`spreadsheetEditor` action @Manager).
- Workflow on `eventSsUpdateAfter`: `branchIfElse Curr.Status notEqualTo Prior.Status` → notify raiser (`sendPushNotification` / `sendMessageToUsers`) → if `Approved`, update other sheets (balance, attendance).
- Variant, two levels: one status field per level (`ManagerStatus`, `HRStatus`), one branch per field. Seen in NB-05.

## Workaround

Yes. Builds model approval as a status field + workflow branch, not as a separate approval step. Why: not known. Neome App catalog lists an Approval Workflows app (chains, multi-level, escalation); no sample Build uses it.

## Limits

- Not proven: who may change the status (per-field rights not in digests).
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
