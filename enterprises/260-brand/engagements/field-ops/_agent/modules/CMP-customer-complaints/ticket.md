---
status: open
prefix: CMP
name: Customer Complaints
blockedBy: [MST]
revisitReason:
formerly:
claimedBy:
---

# CMP — Customer Complaints

Name: Customer Complaints

## 1 Purpose and KPIs

- Purpose: Agents register customer product quality complaints for resolution tracking. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Logs complaints | | [RFP-1] |

## 3 Process

- Sales Agent: Add Compliant → Complaint Sheet/Report. [RFP-1]
- Customer Complain Tickets marked Completed in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Complaint | ComplaintId | text | yes | OI-50 | [RFP-1] |
| Complaint | Date | date | yes | | [RFP-1] |
| Complaint | Customer Complaint Number | text | no | OI-50 | [RFP-1] |
| Complaint | Complainant Name | text | yes | | [RFP-1] |
| Complaint | Address | text | no | | [RFP-1] |
| Complaint | Mobile Number | text | no | | [RFP-1] |
| Complaint | Product | link-to-entity | yes | Links to: Product | [RFP-1] |
| Complaint | Package Size | text | no | | [RFP-1] |
| Complaint | Quantity Affected | number | no | | [RFP-1] |
| Complaint | Batch No | text | no | | [RFP-1] |
| Complaint | Production Date | date | no | | [RFP-1] |
| Complaint | Expiry Date | date | no | | [RFP-1] |
| Complaint | Operator | text | no | OI-51 | [RFP-1] |
| Complaint | Shift | text | no | OI-51 | [RFP-1] |
| Complaint | Nature Of Complaint | text | no | | [RFP-1] |
| Complaint | Description | text | no | | [RFP-1] |
| Complaint | Signature | file | no | | [RFP-1] |
| Complaint | Image | file | no | | [RFP-1] |

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Complaint Sheet/Report | | Complaints | [RFP-1] |

## 11 Requirements

### CMP-01 — Register a quality complaint

Statement: A Sales Agent registers a customer product quality complaint with the fields in RFP-1, including batch, dates, signature and image. [RFP-1]
Acceptance:
- A saved complaint gets a ComplaintId and shows in the Complaint Sheet/Report. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-50, OI-51
Proposed: yes

### CMP-02 — Track resolution

Statement: Complaints are tracked to resolution. [RFP-1]
Acceptance:
- Each complaint shows its resolution status. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-49
Proposed: yes

## 13 Open Items

- OI-49: Resolution flow, statuses, timeline, telling the customer.
- OI-50: ComplaintId vs Customer Complaint Number.
- OI-51: Who fills Operator and Shift.
- OI-60: WhatsApp complaint resolution messages.
