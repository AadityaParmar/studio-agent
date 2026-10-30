# COM — Communication

Prefix: COM
Name: Communication
Status: resolved
Sources: RFP-1, WS-12

## 1 Purpose and KPIs

- Purpose: Reach users and customers through WhatsApp, push notifications, Area notices and a Notice Board. [RFP-1, WS-12]
- KPI: Every notice and promo reaches the right staff in the app the same day; every customer gets the invoice PDF and the complaint Resolved message on WhatsApp; no WhatsApp groups for company notices. [WS-12]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Owner | Posts notices to All, Area or role; owns the WhatsApp Business number | 1 | [WS-12] |
| Sales Head | Posts notices and promos to an Area | 1 | [WS-12] |
| Sales Agent | Gets push and notices; can send a WhatsApp message again | 60 | [WS-12] |
| Tricycle Rider | Gets notices and push | 25 | [WS-12] |
| Employee | Gets the leave decision push and notices | 93 | [WS-12] |
| Sales Supervisor | Gets notices | 8 | [WS-12] |
| Area Sales Manager | Gets notices | 3 | [WS-12] |
| Regional Sales Manager | Gets notices | 2 | [WS-12] |
| Quality Manager | Can send a WhatsApp message again | 1 | [WS-12] |
| Customer | Gets WhatsApp: invoice PDF, complaint Resolved message | 4000 | [RFP-1, WS-12] |

## 3 Process

- Pain today: notices and promos go out on WhatsApp groups; staff miss them; no way to send to one Area only. [WS-12]
- Owner or Sales Head posts a notice; it shows on the Notice Board in the app and staff of its audience get a push. [WS-12]
- Push also goes for: leave approved or rejected, order cancelled, Change Request decision, target set. [WS-12]
- WhatsApp to the customer: the invoice PDF (the order confirmation) and the complaint Resolved message. No separate payment-update message. [WS-12]
- Hand-off in: Visit Book (invoice), Customer Complaints (Resolved), Leave Management, Reports and Dashboards (target). [WS-12]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Notice | Title | text | yes | | [WS-12] |
| Notice | Message | text | yes | | [WS-12] |
| Notice | Audience | choice | yes | Values: All / Area / Role | [WS-12] |
| Notice | Area | text | no | Needed when Audience is Area; an Area is a market | [WS-12] |
| Notice | Role | text | no | Needed when Audience is Role | [WS-12] |
| Notice | Posted by | person | yes | Owner or Sales Head | [WS-12] |
| Notice | Date | date | yes | | [WS-12] |
| WhatsApp Message | Message type | choice | yes | Values: Invoice PDF / Complaint Resolved | [WS-12] |
| WhatsApp Message | Customer | link-to-entity | yes | Links to: Customer | [WS-12] |
| WhatsApp Message | Status | choice | yes | Values: Sent / Failed; retried 3 times before Failed | [WS-12] |

## 5 Statuses

N/A: a notice has no status, it is only posted or removed. [WS-12]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Notice to audience | Notice is posted | Shows on the Notice Board and push to the audience; no WhatsApp for staff; no approval | [WS-12] |
| Push events | Leave approved or rejected; order cancelled; Change Request decision; target set | Push to the person concerned: Employee for leave; Sales Agent for the others | [WS-12] |
| WhatsApp to customer | Invoice is made; complaint becomes Resolved | WhatsApp message to the customer from the 260 Brands WhatsApp Business number | [WS-12] |
| No mobile number | Customer has no mobile number | No WhatsApp message | [WS-12] |
| Retry WhatsApp | WhatsApp send fails | Retried up to 3 times; then shown as Failed; Sales Agent or Quality Manager can send again | [WS-12] |

## 7 Exceptions

- No network: notices can be read offline once synced; push arrives when back online; posting a notice needs network. [WS-12]
- WhatsApp fails 3 times: shown as Failed; Sales Agent or Quality Manager sends again. [WS-12]
- Customer has no mobile number: no WhatsApp message. [WS-12]
- Posted notice: the poster can edit or remove it; no auto expiry. [WS-12]

## 8 Reports

N/A: no report; the Notice Board list only; no read tracking. [WS-12]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| WhatsApp | out | Invoice PDF and complaint Resolved message to the customer | Owner owns the 260 Brands WhatsApp Business number; neome's provider runs the link; 260 Brands pays | [WS-12] |

Nothing goes to SAP. [WS-12]

## 10 Volumes and NFRs

- WhatsApp: one invoice per order, about 700 orders a day, plus Resolved complaints. [WS-12]
- Notices can be read offline; posting needs network. [WS-12]
- OI-85: Notices per week.

## 11 Requirements

### COM-01 — WhatsApp messages to customers

Statement: The system sends the customer a WhatsApp message with the invoice PDF (the order confirmation) and, when a complaint is Resolved, the Resolved message, from the 260 Brands WhatsApp Business number. [RFP-1, WS-12]
Acceptance:
- Making an invoice sends its PDF to the customer on WhatsApp. [WS-12]
- A customer with no mobile number gets no message. [WS-12]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-12
Proposed: no

### COM-02 — Push notifications

Statement: The system sends a push notification to the person concerned for leave approved or rejected, order cancelled, Change Request decision, target set and new notice. [RFP-1, WS-12]
Acceptance:
- Each of these events sends a push to the person concerned. [WS-12]
- A push for a user without network arrives when back online. [WS-12]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-12
Proposed: no

### COM-03 — Market Specific Communication

Statement: The Sales Head sends notices and promos to all staff of one Area (a market), in the app and by push. [RFP-1, WS-12]
Acceptance:
- A notice sent to one Area reaches only staff of that Area. [WS-12]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-12
Proposed: no

### COM-04 — Notice Board

Statement: The Owner and Sales Head post notices to All, an Area or a role; staff see them on the Notice Board in the app. [RFP-1, WS-12]
Acceptance:
- A posted notice shows on the Notice Board of its audience and sends a push. [WS-12]
- The poster can edit or remove it; no approval is needed. [WS-12]
- A synced notice can be read offline. [WS-12]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-12
OIs: OI-85
Proposed: no

### COM-05 — Send WhatsApp again

Statement: A failed WhatsApp message is retried up to 3 times, then shown as Failed; the Sales Agent or Quality Manager can send it again. [WS-12]
Acceptance:
- A message that fails 3 times shows as Failed. [WS-12]
- A Failed message can be sent again by the Sales Agent or Quality Manager. [WS-12]
Priority: Should
Scope: Neome
Sources: WS-12
Proposed: no

## 12 Neome mapping

Neome App: `internal-community-forum`
Delivery: Configuration
How: Notice and Notice Board → Post in an Announcements Category with access scope (everyone / department / team) set up as All / Area / role, no pre-publication approval, poster edits or removes; Area is added as an audience field; push to the audience and the push events (leave decision, order cancelled, Change Request decision, target set) set up as notifications on the platform; WhatsApp Message → invoice PDF and Resolved message, retry 3 times and Failed status set up on the platform WhatsApp channel; the App is a forum, so the Notice fields and WhatsApp Message record are added fields (proposed, to confirm)

## 13 Open Items

- OI-85: Notices per week.
