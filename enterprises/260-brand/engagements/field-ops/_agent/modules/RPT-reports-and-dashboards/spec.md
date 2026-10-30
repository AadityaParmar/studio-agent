# RPT — Reports and Dashboards

Prefix: RPT
Name: Reports and Dashboards
Status: resolved
Sources: RFP-1, WS-11, QA-1

## 1 Purpose and KPIs

- Purpose: Reports, daily summaries and dashboards for sales performance, efficiency, targets and incentives. [RFP-1, WS-11]
- KPI: Managers get every report from neome in minutes with no Excel made by hand; targets set before the month starts; incentive worked out in neome with no disputes. [WS-11]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Owner | Sees all reports and dashboards, all data | 1 | [RFP-1, WS-11] |
| Sales Head | Sees all reports; sets monthly targets; sees Marketing Visits and Complaints aging | 1 | [WS-11] |
| Regional Sales Manager | Sees reports for own region | 2 | [WS-11] |
| Area Sales Manager | Sees reports for own area, incl. Debt vs Collection | 3 | [WS-11] |
| Sales Supervisor | Sees reports for own agents | 8 | [RFP-1, WS-11] |
| Sales Agent | No reports; sees own entries in other Modules' sheets and own target and incentive | 60 | [WS-11] |
| Tricycle Rider | No reports, no targets | 25 | [WS-11] |

## 3 Process

- Pain today: reports built by hand in Excel from paper and SAP, late; targets and incentives kept on paper; no view of debt or where customers are. [WS-11]
- A manager opens a report or dashboard, filters, and exports to Excel. [RFP-1, WS-11]
- The Sales Head sets monthly targets per Sales Agent; the incentive is worked out from sales against target. [WS-11]
- Hand-off in: Visit Book (visits, orders, payments, invoices), Attendance, Leave Management, Inventory, Customer Complaints, Marketing Visits, Masters (customers with GEO), Sales Head's targets, SAP open balances. [WS-11]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Target | Sales Agent | link-to-entity | yes | Links to: Employee | [WS-11] |
| Target | Month | date | yes | One target per Sales Agent per month | [WS-11] |
| Target | Target value | money | yes | ZMW | [WS-11] |
| Target | Product group | link-to-entity | no | Quantity target per product group. Links to: Category | [WS-11] |
| Target | Target quantity | number | no | Per product group | [WS-11] |

- Reports and dashboards keep no records of their own; they read other Modules' records. [WS-11]
- Sales value = Invoiced and Delivered orders of the agent in the month, before VAT; Cancelled not counted. [WS-11]
- Product group = Category from the Category Master. [WS-11]

## 5 Statuses

N/A: a Target has no statuses; it is a monthly figure the Sales Head can change until month end [WS-11]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Productive call | A visit has an order | Counted productive; a visit with no order is non-productive, with its No-order reason | [WS-11] |
| Incentive | Month end, Sales Agent has a target | 2% of monthly sales value if target 100% or more achieved; 1% if 80 to 99%; none below 80%. Paid through payroll outside neome | [WS-11] |
| No target | Sales Agent has no target for the month | Shows "No target"; no incentive | [WS-11] |
| Target change | Sales Head edits a target before month end | Allowed; month-end incentive uses the target as at month end | [WS-11] |
| Report scope | A manager opens a report | Regional Sales Manager sees own region, Area Sales Manager own area, Sales Supervisor own agents; Sales Head and Owner all | [WS-11] |
| Target set | Sales Head sets a target | Push to the Sales Agent (the OI-61 event) | [WS-11] |
| Daily summary | A manager opens the dashboard | Daily Sales for yesterday shows at the top; no email, no push | [WS-11] |

## 7 Exceptions

- Sales Agent with no target: "No target", no incentive. [WS-11]
- Customer without GEO: not shown on the heat map. [WS-11]
- No network: reports do not open; they need network. [WS-11]
- SAP open balances can be up to 30 minutes old in Debt vs Collection. [WS-11]
- Target changed mid-month: incentive uses the target at month end. [WS-11]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Daily Sales | Sales Supervisor and above | Sales by agent, beat, product; filters date, area, supervisor, agent, beat, product; Excel export | [RFP-1, WS-11] |
| Attendance | Sales Supervisor and above | Attendance report; same filters; Excel export | [WS-11] |
| Visit Productivity | Sales Supervisor and above | Total vs Productive vs Non-Productive calls; Productive = visit with an order; same filters; Excel export | [RFP-1, WS-11] |
| Stock in hand | Sales Supervisor and above | Stock in hand per Sales Agent; same filters; Excel export | [WS-11] |
| Debt vs Collection | Area Sales Manager and above | Debt = SAP open balances + neome credit invoices - collections; same filters; Excel export | [RFP-1, WS-11] |
| Target vs Achievement | All managers | Target, achieved sales value and quantity per product group, gap, per Sales Agent per month; same filters; Excel export | [RFP-1, WS-11] |
| Incentive | Sales Head, Owner, Area and Regional Sales Managers for their people; Sales Agent own | Incentive earned per Sales Agent per month from target achieved; Excel export | [RFP-1, WS-11] |
| Leave register | Sales Supervisor and above | Leave register; same filters; Excel export | [WS-11] |
| Complaints aging | Owner, Sales Head | Open complaints by age against the 72 hour target | [WS-11] |
| Marketing Visits | Sales Head | Marketing Visits; same filters; Excel export | [WS-11] |
| Performance dashboard | Sales Supervisor and above | Sales vs target, incentive earned; same filters | [RFP-1, WS-11] |
| Efficiency dashboard | Sales Supervisor and above | Productive calls %, visits per agent per day; same filters | [RFP-1, WS-11] |
| Customer Master Heat Map | Sales Supervisor and above | Map of customers coloured by last-30-days sales value; click shows name, Category, sales | [RFP-1, WS-11] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | in | Customer open balances for Debt vs Collection, through the sync every 30 minutes; SAP is system of record | Chanda Mwila (IT Manager, 260 Brands) | [WS-11] |
| Excel | out | Export of reports | neome | [WS-11] |

Nothing goes to SAP. [WS-11]

## 10 Volumes and NFRs

- About 15 manager users (1 Owner, 1 Sales Head, 2 Regional, 3 Area, 8 Supervisors). [WS-11]
- Data read: about 1,200 visits and 700 orders a day, about 4,000 customers. [WS-11]
- Neome figures show as soon as phones sync; SAP open balances up to 30 minutes old. [WS-11]
- Reports need network; no offline. [WS-11]
- Estimate 10 report users, each opening reports about 4 times per day. [QA-1]

## 11 Requirements

### RPT-01 — Reports and daily summary

Statement: Permitted managers open the Daily Sales, Attendance, Visit Productivity, Stock in hand, Leave register, Complaints aging and Marketing Visits reports, filter by date, area, supervisor, agent, beat and product, and export to Excel; Daily Sales for yesterday shows at the top of the dashboard. [RFP-1, WS-11]
Acceptance:
- Each report opens only for its audience in section 8. [WS-11]
- A report filters by date, area, supervisor, agent, beat and product and exports to Excel. [WS-11]
- Daily Sales for yesterday shows on the dashboard; no email or push. [WS-11]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-11
Proposed: no

### RPT-02 — Debt vs Collection

Statement: The Debt vs Collection report shows per customer debt as SAP open balances plus neome credit invoices minus collections, for Area Sales Manager and above. [RFP-1, WS-11]
Acceptance:
- The report shows per customer what is owed and what was collected in the period. [WS-11]
- Sales Supervisor cannot open it. [WS-11]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-11
Proposed: no

### RPT-03 — Total vs Productive vs Non-Productive calls

Statement: The Visit Productivity report counts each visit as productive (has an order) or non-productive (no order, with its No-order reason). [RFP-1, WS-11]
Acceptance:
- A visit with an order counts productive; a visit with no order counts non-productive. [WS-11]
- Non-productive visits show their No-order reason. [WS-11]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-11
Proposed: no

### RPT-04 — Target vs Achievement

Statement: The Target vs Achievement report shows, per Sales Agent per month, target and achieved sales value (Invoiced and Delivered orders before VAT) and quantity per product group, and the gap. [RFP-1, WS-11]
Acceptance:
- For an agent with a target, the report shows target, achieved and gap. [WS-11]
- Cancelled orders are not counted. [WS-11]
- An agent with no target shows "No target". [WS-11]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-11
Proposed: no

### RPT-05 — Performance and Efficiency dashboards

Statement: Performance (sales vs target, incentive earned) and Efficiency (productive calls %, visits per agent per day) dashboards for Sales Supervisor and above, with the same filters. [RFP-1, WS-11]
Acceptance:
- The Performance dashboard shows each agent's sales, target and incentive earned. [WS-11]
- The Efficiency dashboard shows productive calls % and visits per agent per day. [WS-11]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-11
Proposed: no

### RPT-06 — Customer Master Heat Map

Statement: A map of customers coloured by last-30-days sales value, for Sales Supervisor and above. [RFP-1, WS-11]
Acceptance:
- Customers with GEO show on the map coloured by last-30-days sales value. [WS-11]
- Clicking a customer shows name, Category and last-30-days sales. [WS-11]
- Customers without GEO are not shown. [WS-11]
Priority: Could
Scope: Neome
Sources: RFP-1, WS-11
Proposed: no

### RPT-07 — Monthly targets

Statement: The Sales Head sets a monthly target per Sales Agent, by value (ZMW) and by quantity per product group, and can change it until month end; the Sales Agent gets a push when it is set. [WS-11]
Acceptance:
- Only the Sales Head can set or change a target. [WS-11]
- A target can be changed until month end. [WS-11]
- The Sales Agent gets a push when a target is set. [WS-11]
Priority: Must
Scope: Neome
Sources: WS-11
Proposed: no

### RPT-08 — Incentive

Statement: The Incentive report works out per Sales Agent per month 2% of sales value if target 100% or more is achieved, 1% if 80 to 99%, none below 80%; payment is outside neome. [WS-11]
Acceptance:
- An agent at 100% or more of target shows 2% of monthly sales value. [WS-11]
- An agent at 80 to 99% shows 1%; below 80% shows none. [WS-11]
- An agent with no target shows no incentive. [WS-11]
Priority: Must
Scope: Neome
Sources: WS-11
Proposed: no

### RPT-09 — Report access scope

Statement: Regional Sales Manager sees reports for own region, Area Sales Manager for own area, Sales Supervisor for own agents; Sales Head and Owner see all; Sales Agents and Tricycle Riders see no reports. [WS-11]
Acceptance:
- An Area Sales Manager sees no data of another area. [WS-11]
- A Sales Agent cannot open any report, only own target and incentive. [WS-11]
Priority: Must
Scope: Neome
Sources: WS-11
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Target → the App's Target entity (monthly, per Sales Agent, with product group quantity added as extra fields); Target vs Achievement and Debt vs Collection → the App's Target achievement and Collections and outstanding reports, with Enterprise filters (date, area, supervisor, agent, beat, product), role scope and Excel export set up; the other reports, Performance and Efficiency dashboards, Incentive rule (2% / 1% / none) and Customer Master Heat Map set up on the platform dashboards, since the App names only three reports; Debt reads SAP open balances through the sync. No new record type, so no Custom module. (proposed, to confirm)

## 13 Open Items

N/A: no open Open Items.
