---
id: PAT-multi-level-approval
kind: pattern
name: Multi-level approval by status
workaround: true
seenIn:
  - {build: NB-05, area: Leave}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
---

# Multi-level approval by status

## Task

A request passes through two or more approvers in order (for example manager then HR, or levels from a matrix); a rejection at any level ends it; the last level closes it.

## How

- Fixed levels: one status pickText per level on the sheet (manager status, HR status); workflow on update-after branches on the first status, then a nested branch on the next; effects run on the last Approved.
- Matrix levels: matrix sheet of department, level sequence and approver. On request insert, query the matrix, iterate the rows and rowInsert one log row per level (with a LastApprover flag); rowForward sends the request to the approvers.
- Approver sets the log row status. Workflow on log update-after: Rejected sets the request Rejected; Approved on the last level sets it Approved.
- Message to the asker at each decision.

## Workaround

Yes. No multi-level approval step; status lists, a log sheet per level and branches stand in.

## Limits

- Order of levels is not enforced by the sheet; rights and branches keep it.
- Fixed levels need one more status field and branch per extra level.
- Matrix levels need the matrix kept up to date per department.

## Flowchart

```mermaid
flowchart TD
  A["Asker raises request"]
  B["Levels found, one per approver"]
  C["Approver at a level decides"]
  D["Rejected: request rejected, asker told"]
  E["Last level approved: request approved, asker told"]
  A --> B
  B --> C
  C --> D
  C --> E
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: ApprovalStatus, RequestSheet, MatrixSheet, ApprovalLogSheet. Needs first: roles per level; PAT-insert-row-in-other-sheet, PAT-forward-row, PAT-message-on-event (steps 5, 7).

1. Var: `add kind=var kind=setOfText name=ApprovalStatus deploy=fixedOnDeploy value={Pending:{}, Approved:{}, Rejected:{}}`.
2. Fixed levels: request fields `type=pickText source=ApprovalStatus` ManagerStatus, HrStatus, Status; limit each by `permissionMatrix` / `disabledRoles`.
3. Fixed workflow: `kind=eventSsUpdateAfter spreadsheet=RequestSheet` → `kind=branchSwitchCase field{param:$Curr, field:ManagerStatus}` → keyRejected: `kind=rowUpdate` Status=Rejected; keyApproved: `branchSwitchCase` on HrStatus → keyApproved: `rowUpdate` Status=Approved + effects.
4. Matrix sheets: MatrixSheet (`ref` Department, `type=number Level`, `type=pickUser Approver roleIdDataSource`); ApprovalLogSheet (`ref` Request, Level, Approver, `pickText LogStatus`, `type=bool LastApprover`).
5. Matrix insert workflow: `eventSsInsertAfter spreadsheet=RequestSheet` → `kind=ssExecuteQuery outputForm spreadsheets=[MatrixSheet] neoQL` → `kind=branchIterateGrid` → paramUpdate + rowInsert ApprovalLogSheet (apply PAT-insert-row-in-other-sheet Execute) → `kind=rowForward toUsers` (apply PAT-forward-row Execute).
6. Log workflow: `eventSsUpdateAfter spreadsheet=ApprovalLogSheet` → `branchIfElse` LogStatus=Rejected → `rowUpdate` request Rejected; else `branchIfElse` LastApprover → `rowUpdate` request Approved.
7. Each decision: `kind=sendMessageToUsers` to the asker (apply PAT-message-on-event Execute).
8. `set kind=workflow edgeMap` per workflow (VALUE/TRUE/FALSE/ITERATE/NEXT) → `validate` till ok=true.

Gaps: rowIdPointer from the log's request ref unverified; NeoQL by hand; level order not enforced by the sheet.
