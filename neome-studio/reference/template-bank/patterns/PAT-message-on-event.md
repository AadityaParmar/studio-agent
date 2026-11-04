---
id: PAT-message-on-event
kind: pattern
name: Message on event
workaround: false
seenIn:
  - {build: NB-01, area: AssignVehicle}
  - {build: NB-01, area: CustomerMaster}
  - {build: NB-01, area: Deboarding}
  - {build: NB-01, area: JobWork}
  - {build: NB-01, area: Onboarding}
  - {build: NB-01, area: Payments}
  - {build: NB-01, area: Transactions}
  - {build: NB-02, area: Expense}
  - {build: NB-03, area: Manufacturing}
  - {build: NB-04, area: Leave}
  - {build: NB-04, area: Order}
  - {build: NB-04, area: Quotation}
  - {build: NB-04, area: VisitBook}
  - {build: NB-05, area: Expenses}
  - {build: NB-05, area: Leave}
  - {build: NB-06, area: PurchaseOrder}
  - {build: NB-06, area: Quotation}
  - {build: NB-06, area: SalesOrder}
  - {build: NB-06, area: Return}
  - {build: NB-07, area: Service Desk}
  - {build: NA-appointment-booking, area: AppointmentBooking}
  - {build: NA-approval-workflows, area: ApprovalWorkflow}
  - {build: NA-crm, area: CRM}
  - {build: NA-lead-management, area: Lead}
  - {build: NA-machine-tools-maintenance, area: MachineAndToolMaintenance}
  - {build: NA-manufacturing, area: Manufacturing}
  - {build: NA-product-catalog, area: ProductCatalogAndInquiry}
  - {build: NA-purchase-management, area: PurchaseManagement}
  - {build: NA-quotation-and-order-flow, area: QuotationAndOrderFlow}
  - {build: NA-ticketing-and-task-management, area: TaskManagement}
---

# Message on event

## Task

Tell the customer, vendor, creator, a role or a group when something happens (assigned, approved, paid, new ticket, comment).

## How

- Workflow branch on the event or status.
- sendWhatsappMessage or sendWhatsappTemplate to a mobile field copied from a ref.
- sendMessageToUsers to the creator, a pickUser field or a set of roles; sendPushNotification; sendMessageToGroups; sendEmail.
- Row comment event for comment alerts.

## Workaround

No. Direct feature (message nodes).

## Limits

- Mobile and email must be copied onto the row first.
- WhatsApp templates need approval; free text only inside the reply window.

## Flowchart

```mermaid
flowchart TD
  A["Event or status change"]
  B["Pick who to tell"]
  C["Send WhatsApp, push, email or group message"]
  A --> B
  B --> C
```

## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: Sheet, MsgWf, Status. Needs first: Sheet; mobile or email copied onto the row (`ref copyFieldMap`).

1. Fields: `type=mobileNumber` / `type=email` copied from the ref; `type=pickUser` if a named person.
2. Workflow: `add kind=workflow name=MsgWf` (4 maps `{}`).
3. Event: `kind=eventSsInsertAfter|eventSsUpdateAfter spreadsheet=Sheet`, or `kind=eventRowComment` for comments.
4. Branch: `kind=branchSwitchCase field{param:$Curr, field:Status}` or `kind=branchIfElse option=Condition`.
5. Message node per case: `kind=sendWhatsappTemplate toUsers templateGroup templateVarMap` / `kind=sendWhatsappMessage toUsers message`; `kind=sendMessageToUsers message{value,paramSet} toUsers`; `kind=sendMessageToGroups toGroups`; `kind=sendPushNotification`; `kind=sendEmail subject message toUsers`.
6. `set kind=workflow edgeMap`: switch VALUE `value=<option key>`, NEXT = Default; ERROR edge from message nodes if needed.
7. `validate` till ok=true.

Gaps: toUsers (U) binder from a mobile field of a non-member unverified; WhatsApp template approval is outside MCP.
