# LEAD — Leads

Prefix: LEAD
Name: Leads
Status: resolved
Sources: RFP-1, WS-6

## 1 Purpose and KPIs

- Purpose: Sales Agents generate Leads for new business and follow them up until they become Customers or are lost. [RFP-1, WS-6]
- KPI: Every Lead is recorded with a Sales Agent and followed up; Leads converted to Customers are counted every month; no Leads kept in notebooks or WhatsApp. [WS-6]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Adds Leads, follows them up, moves Status, converts a Lead to a Customer | 60 | [RFP-1, WS-6] |
| Sales Supervisor | Approves the new Customer of a converted Lead (Change Request); sees all Leads | 8 | [WS-6] |
| Area Sales Manager | Sees all Leads | 3 | [WS-6] |
| Regional Sales Manager | Sees all Leads | 2 | [WS-6] |
| Sales Head | Sees all Leads | 1 | [WS-6] |
| Owner | Sees all Leads | 1 | [WS-6] |

Tricycle Riders do not add Leads. [WS-6]

## 3 Process

- Sales Agent: Add Lead → Lead Sheet/Report. [RFP-1]
- Sales Agent follows up the Lead and moves its Status: New, Contacted, Interested, Converted, Lost. [WS-6]
- A Converted Lead becomes a Customer through a Change Request, approved by the Sales Supervisor, then pushed to SAP. [WS-6]
- Pain today: Leads kept in notebooks and WhatsApp; no record of follow-up; nobody counts how many become Customers. [WS-6]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Lead | Shop name | text | yes | | [WS-6] |
| Lead | Owner name | text | yes | | [WS-6] |
| Lead | Phone | text | yes | | [WS-6] |
| Lead | Address | text | yes | | [WS-6] |
| Lead | GEO | text | no | GPS location of the shop | [WS-6] |
| Lead | Category | choice | no | Values: Retail Shop / Wholesaler / Supermarket / School / Institution (same list as Customer Category) | [WS-6] |
| Lead | Notes | text | no | | [WS-6] |
| Lead | Status | choice | yes | Values: New / Contacted / Interested / Converted / Lost | [WS-6] |
| Lead | Sales Agent | person | yes | Auto: the agent who adds the Lead | [WS-6] |
| Lead | Date | date | yes | Auto: date added | [WS-6] |

## 5 Statuses

Lead:

| id | start/end | open (OI) | Source |
|---|---|---|---|
| new | start | | [WS-6] |
| contacted | | | [WS-6] |
| interested | | | [WS-6] |
| converted | end | | [WS-6] |
| lost | end | | [WS-6] |

| from | to | trigger | Source |
|---|---|---|---|
| new | contacted | Sales Agent contacts the Lead | [WS-6] |
| contacted | interested | Sales Agent marks the Lead interested | [WS-6] |
| interested | converted | Sales Agent converts the Lead; Change Request raised | [WS-6] |
| new | lost | Sales Agent marks the Lead lost | [WS-6] |
| contacted | lost | Sales Agent marks the Lead lost | [WS-6] |
| interested | lost | Sales Agent marks the Lead lost | [WS-6] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Owner of Lead | Sales Agent adds a Lead | The Lead belongs to that Sales Agent, who follows it up | [WS-6] |
| Convert to Customer | Sales Agent converts a Lead | A Change Request for a new Customer is raised; Sales Supervisor approves; then it is pushed to SAP | [WS-6] |
| Final statuses | Lead is Converted or Lost | Lead cannot be changed or reopened; agent adds a new Lead | [WS-6] |
| Push | Change Request decision | Push to the Sales Agent; no other push for Leads | [WS-6] |

## 7 Exceptions

- Lost Lead: not reopened; the Sales Agent adds a new Lead. [WS-6]
- No network: Sales Agent adds and updates Leads offline; they sync when online. [WS-6]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Lead Sheet/Report | Sales Agent own Leads; Sales Supervisor and above all | Leads by Status; filters date, area, supervisor, agent, Status, Category; Excel export; Leads converted per month | [RFP-1, WS-6] |

## 9 Integrations

N/A: no integration of its own; a Converted Lead reaches SAP only as a new Customer through the Change Request (see Masters and SAP Integration). [WS-6]

## 10 Volumes and NFRs

- About 60 Sales Agents add Leads; about 20 new Leads a day in total. [WS-6]
- Sales Agent works offline; Leads sync when online. [WS-6]

## 11 Requirements

### LEAD-01 — Add a lead

Statement: A Sales Agent adds a Lead with shop name, owner name, phone, address, GEO, Category and notes; it starts as New and belongs to that agent. [RFP-1, WS-6]
Acceptance:
- A Lead added by an agent shows in the Lead Sheet/Report with Status New. [WS-6]
- A Lead added offline appears in the Lead Sheet/Report after the agent is online. [WS-6]
- A Tricycle Rider cannot add a Lead. [WS-6]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-6
Proposed: no

### LEAD-02 — Follow up and move Status

Statement: The Sales Agent follows up a Lead and moves its Status: New, Contacted, Interested, Converted, Lost; Converted and Lost are final. [WS-6]
Acceptance:
- The agent can move a Lead from New to Contacted to Interested. [WS-6]
- A Lead set to Lost or Converted cannot be changed. [WS-6]
- An agent sees only own Leads. [WS-6]
Priority: Must
Scope: Neome
Sources: WS-6
Proposed: no

### LEAD-03 — Convert a Lead to a Customer

Statement: The Sales Agent converts an Interested Lead; this raises a Change Request for a new Customer, approved by the Sales Supervisor, then pushed to SAP. [WS-6]
Acceptance:
- Convert on a Lead raises a Change Request with the Lead's details. [WS-6]
- The Lead becomes Converted and a Customer exists only after the Sales Supervisor approves. [WS-6]
- The agent gets a push on the Change Request decision. [WS-6]
Priority: Must
Scope: Neome
Sources: WS-6
Proposed: no

### LEAD-04 — Lead Sheet/Report

Statement: Sales Agent sees own Leads; Sales Supervisor and above see all Leads by Status, with filters and Excel export, and Leads converted per month. [RFP-1, WS-6]
Acceptance:
- The sheet filters by date, area, supervisor, agent, Status and Category. [WS-6]
- The sheet exports to Excel. [WS-6]
- The count of Converted Leads per month shows. [WS-6]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-6
Proposed: no

## 12 Neome mapping

Neome App: `lead-management`
Delivery: Configuration
How: Lead → Lead; shop name, owner name, phone, address, GEO, Category and notes set up as fields; Status New, Contacted, Interested, Converted, Lost → funnel stages with Interested and Lost added; Sales Agent → Executive owning the Lead; Convert raising a Change Request approved by the Sales Supervisor → conversion approval step, with the new Customer going to CRM and to SAP through Masters and SAP Integration; Lead Sheet/Report with converted-per-month count → Lead performance report with filters and Excel export; offline capture as platform mechanics (proposed, to confirm)

## 13 Open Items

None open.
