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
