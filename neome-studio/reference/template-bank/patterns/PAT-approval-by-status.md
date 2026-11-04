---
id: PAT-approval-by-status
kind: pattern
name: Approval by status
workaround: true
seenIn:
  - {build: NB-01, area: Onboarding}
  - {build: NB-01, area: Transactions}
  - {build: NB-02, area: Attendance}
  - {build: NB-02, area: Conveyance}
  - {build: NB-02, area: Expense}
  - {build: NB-02, area: LeaveApplication}
  - {build: NB-03, area: QuotationAndOrderFlow}
  - {build: NB-04, area: Attendance}
  - {build: NB-04, area: Expenses}
  - {build: NB-04, area: Leave}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: Quotation}
  - {build: NB-05, area: Attendence}
  - {build: NB-05, area: Expenses}
  - {build: NB-05, area: Quotation}
  - {build: NB-06, area: Dispatch}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-06, area: Quotation}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-07, area: HR Desk}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-knowledge-library, area: KnowledgeLibrary}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
---

# Approval by status

## Task

An approver approves or rejects a request (leave, claim, quote, order, regularisation, balance change) before its effects run.

## How

- Status pickText such as Pending, Approved, Rejected on the sheet.
- Insert and update rights per role: askers insert, approvers update.
- Workflow on update-after: branch when the status changed and is no longer Pending, then switch on the status value.
- Approved branch runs the effects (row update, balance change, PDF); both branches message the asker.
- Often one spreadsheet action per status (pending, approved, rejected) for the approver.
- Line-wise variant: approved amount per grid line, rejected amount is the rest (workflow iterates the grid).

## Workaround

Yes. Neome has no approval step; a status list, role rights and a workflow branch stand in.

## Limits

- No built-in approver routing or escalation; the approver is a role or a pickUser field.
- Changing the status back does not undo effects unless a reverse branch is built.
- More than one level needs a status per level or a level log (see PAT-multi-level-approval).

## Flowchart

```mermaid
flowchart TD
  A["Asker adds row, status Pending"]
  B["Approver sets status"]
  C["Status changed?"]
  D["Approved: run effects"]
  E["Message the asker"]
  A --> B
  B --> C
  C --> D
  D --> E
```
