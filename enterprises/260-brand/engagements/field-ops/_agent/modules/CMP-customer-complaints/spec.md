# CMP — Customer Complaints

Prefix: CMP
Name: Customer Complaints
Status: resolved
Sources: RFP-1, WS-9

## 1 Purpose and KPIs

- Purpose: Sales Agents register customer product quality complaints; the Quality Manager resolves them and the customer is told. [RFP-1, WS-9]
- KPI: Every complaint recorded with batch and photo, resolved within 72 hours, customer told. [WS-9]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Logs complaints; sees own | 60 | [RFP-1, WS-9] |
| Quality Manager | Resolves complaints: investigates, fills Operator and Shift, writes resolution note, sets statuses, tells the customer | 1 | [WS-9] |
| Sales Supervisor | Sees all complaints | 8 | [WS-9] |
| Area Sales Manager | Sees all complaints | 3 | [WS-9] |
| Regional Sales Manager | Sees all complaints | 2 | [WS-9] |
| Sales Head | Sees all complaints and the Complaints aging report | 1 | [WS-9] |
| Owner | Sees all complaints and the Complaints aging report | 1 | [WS-9] |


## 3 Process

- Sales Agent adds a complaint (Add Complaint) for a customer; it shows in the Complaint Sheet. [RFP-1, WS-9]
- Quality Manager picks it up from the list of Open complaints, investigates (Under Investigation), fills Operator and Shift, sets Resolved, tells the customer by WhatsApp, then sets Closed. [WS-9]
- Target: Resolved within 72 hours. [WS-9]
- Hand-off in: Masters (Product). Hand-off out: Communication (WhatsApp message to the customer on Resolved), Reports (Complaints aging). [WS-9]
- Pain today: complaints by phone and WhatsApp; no record; time taken not tracked; customers not told the result. [WS-9]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Complaint | ComplaintId | text | yes | neome auto ID | [RFP-1, WS-9] |
| Complaint | Date | date | yes | | [RFP-1] |
| Complaint | Complainant Name | text | yes | | [RFP-1] |
| Complaint | Address | text | no | | [RFP-1] |
| Complaint | Mobile Number | text | no | Needed for the WhatsApp message | [RFP-1, WS-9] |
| Complaint | Product | link-to-entity | yes | Links to: Product | [RFP-1] |
| Complaint | Package Size | text | no | | [RFP-1] |
| Complaint | Quantity Affected | number | no | | [RFP-1] |
| Complaint | Batch No | text | no | Read from the pack by the Sales Agent | [RFP-1, WS-9] |
| Complaint | Production Date | date | no | Read from the pack by the Sales Agent | [RFP-1, WS-9] |
| Complaint | Expiry Date | date | no | Read from the pack by the Sales Agent | [RFP-1, WS-9] |
| Complaint | Operator | text | no | Filled by the Quality Manager | [RFP-1, WS-9] |
| Complaint | Shift | text | no | Filled by the Quality Manager | [RFP-1, WS-9] |
| Complaint | Nature Of Complaint | text | no | | [RFP-1] |
| Complaint | Description | text | no | | [RFP-1] |
| Complaint | Signature | file | no | The customer's, taken on the phone | [RFP-1, WS-9] |
| Complaint | Image | file | no | | [RFP-1] |
| Complaint | Status | choice | yes | Values: Open / Under Investigation / Resolved / Closed | [WS-9] |
| Complaint | Resolution note | text | no | Written by the Quality Manager | [WS-9] |

## 5 Statuses

Complaint:

| id | start/end | open (OI) | Source |
|---|---|---|---|
| open | start | | [WS-9] |
| under-investigation | | | [WS-9] |
| resolved | | | [WS-9] |
| closed | end | | [WS-9] |

| from | to | trigger | Source |
|---|---|---|---|
| open | under-investigation | Quality Manager starts the investigation | [WS-9] |
| under-investigation | resolved | Quality Manager resolves it | [WS-9] |
| resolved | closed | Quality Manager sets Closed after the customer is told | [WS-9] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| 72 hour target | Complaint is Open | Should be Resolved within 72 hours; late ones show in the Complaints aging report | [WS-9] |
| Tell the customer | Complaint becomes Resolved | WhatsApp message to the customer | [RFP-1, WS-9] |
| Closed is final | Complaint is Closed | No reopen; the Sales Agent logs a new complaint | [WS-9] |
| No extra push | New complaint | No push; the Quality Manager works from the list of Open complaints | [WS-9] |

## 7 Exceptions

- No network: the Sales Agent logs the complaint offline; it syncs when online. Investigation needs network. [WS-9]
- No customer mobile number: no WhatsApp message; the Quality Manager notes it. [WS-9]
- Closed complaint: no reopen; a new complaint is logged. [WS-9]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Complaint Sheet | Sales Agent own; Quality Manager, Sales Supervisor and above all | Complaints; filters date, area, supervisor, agent, product, status; Excel export | [RFP-1, WS-9] |
| Complaints aging | Owner, Sales Head | Open complaints by age against the 72 hour target | [WS-9] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| WhatsApp | out | Message to the customer when the complaint is Resolved | 260 Brands WhatsApp Business number, provider is neome's, 260 Brands pays | [WS-9] |

Nothing goes to SAP. [WS-9]

## 10 Volumes and NFRs

- 60 Sales Agents may log complaints; 1 Quality Manager resolves them. [WS-9]
- Logging works offline; syncs when online. [WS-9]
- OI-79: Complaints per day.

## 11 Requirements

### CMP-01 — Register a quality complaint

Statement: A Sales Agent registers a customer product quality complaint with the fields in RFP-1 (ComplaintId from neome, no Customer Complaint Number), including batch, dates, the customer's signature and image; it works offline. [RFP-1, WS-9]
Acceptance:
- A saved complaint gets an automatic ComplaintId and shows in the Complaint Sheet. [WS-9]
- A complaint logged offline appears after sync. [WS-9]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-9
OIs: OI-79
Proposed: no

### CMP-02 — Resolution status flow

Statement: The Quality Manager moves each complaint Open, Under Investigation, Resolved, Closed; Closed is final. [WS-9]
Acceptance:
- A new complaint is Open. [WS-9]
- Only the Quality Manager can change the status. [WS-9]
- A Closed complaint cannot be changed or reopened. [WS-9]
Priority: Must
Scope: Neome
Sources: WS-9
Proposed: no

### CMP-03 — Investigation fields

Statement: The Quality Manager fills Operator, Shift and a resolution note during investigation; the Sales Agent does not. [RFP-1, WS-9]
Acceptance:
- Operator, Shift and Resolution note can be edited by the Quality Manager. [WS-9]
- The Sales Agent cannot edit Operator or Shift. [WS-9]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-9
Proposed: no

### CMP-04 — 72 hour target

Statement: A complaint should be Resolved within 72 hours; late complaints show in the Complaints aging report. [WS-9]
Acceptance:
- An Open or Under Investigation complaint older than 72 hours shows as late in the Complaints aging report. [WS-9]
Priority: Should
Scope: Neome
Sources: WS-9
Proposed: no

### CMP-05 — Tell the customer on WhatsApp

Statement: When a complaint becomes Resolved, the customer gets a WhatsApp message from the 260 Brands WhatsApp Business number. [RFP-1, WS-9]
Acceptance:
- Setting Resolved on a complaint with a mobile number sends the message. [WS-9]
- A complaint without a mobile number sends nothing and the Quality Manager notes it. [WS-9]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-9
Proposed: no

### CMP-06 — Complaint reports

Statement: A Complaint Sheet (Sales Agent sees own; Quality Manager, Sales Supervisor and above see all) and a Complaints aging report for the Owner and Sales Head, with Excel export. [RFP-1, WS-9]
Acceptance:
- The Complaint Sheet filters by date, area, supervisor, agent, product and status, and exports to Excel. [WS-9]
- Complaints aging shows open complaints by age. [WS-9]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-9
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Customer Complaint → Quality complaint (description, batch number, photo, assigned QA team, status Open → closure), logged by the Sales Agent with offline capture as the App does; the four statuses Open / Under Investigation / Resolved / Closed, Operator, Shift, resolution note and customer signature set up as extra fields and statuses for the Quality Manager; 72 hour target and Complaints aging report and Complaint Sheet are not named App reports, set up as reports with filters and Excel export; WhatsApp message to the customer on Resolved through the platform WhatsApp channel (proposed, to confirm)

## 13 Open Items

- OI-79: Complaints per day.
