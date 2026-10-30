# SAP — SAP Integration

Prefix: SAP
Name: SAP Integration
Status: resolved
Sources: RFP-1, IN-1, WS-14

## 1 Purpose and KPIs

- Purpose: Keep neome and SAP in step for customers, products, employees, prices, stock and invoices, through a plugin the Neome team writes. [RFP-1, IN-1]
- KPI: Customers, products, employees, prices and depot stock in neome match SAP within 30 minutes; every invoice in SAP within minutes; 0 price mismatches. [WS-14]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Owner | Sets the plugin in the neome dashboard (sync frequency); sees Failed records and the sync log; makes products and employees in neome | 1 | [WS-14] |
| Sales Supervisor | Approves new customers and customer changes (Change Request) before they go to SAP | 8 | [WS-14] |
| IT Manager (Chanda Mwila) | Owns SAP and the link on the 260 Brands side | 1 | [WS-14] |
| Neome team | Writes the plugin for the SAP integration | | [RFP-1, IN-1] |

## 3 Process

- Customer, product or employee created or changed in SAP → plugin fetches it → it shows in neome. [RFP-1, IN-1]
- Customer, product or employee created or changed in neome → neome sends it to the plugin → plugin pushes it to SAP. [RFP-1, IN-1]
- A new customer, or a change to address, phone or GEO, goes to SAP only after the Sales Supervisor approves the Change Request. Products and employees made by the Owner go direct. [WS-14]
- Stock goes SAP to neome only; neome never writes stock to SAP. Closing stock is report only and is not sent to SAP. [WS-14]
- New order placed in neome → invoice made in neome → plugin sends the invoice to SAP at once, with retry on failure → invoice visible in SAP. [RFP-1, IN-1, WS-14]
- Existing SAP data is loaded to neome through the plugin at start: customers, products, employees, open balances per customer; no order history. [IN-1, WS-14]
- Plugin is set up in the neome dashboard. [RFP-1, IN-1]
- Pain today: masters kept in Excel and out of sync with SAP; invoices keyed by hand in SAP, late. [WS-14]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Sync setting | Data type | choice | yes | Values: Customers / Products / Employees / Stock / Invoices | [WS-14] |
| Sync setting | Direction | choice | yes | Values: SAP to neome / neome to SAP. Stock is SAP to neome only | [WS-14] |
| Sync setting | Frequency | number | yes | Minutes. 30 for customers, products, employees, prices, stock; invoices at once | [WS-14] |
| Sync setting | SAP connection | text | yes | SAP Business One 10.0 (HANA), Service Layer REST API; credentials from the SAP partner | [WS-14] |
| Sync record | Record | link-to-entity | yes | Links to: Customer, Product, Employee or Invoice | [WS-14] |
| Sync record | Sync status | choice | yes | Values: Waiting to sync / Synced / Failed | [WS-14] |
| Sync record | SAP message | text | no | Shown when Failed | [WS-14] |
| Sync record | Time | date | yes | When it was last tried | [WS-14] |
| Customer | Customer Code | text | yes | From SAP (CardCode); a customer made in neome gets a temporary code until SAP returns the CardCode | [WS-14] |

## 5 Statuses

Sync status:

| id | start/end | open (OI) | Source |
|---|---|---|---|
| waiting-to-sync | start | | [WS-14] |
| synced | end | | [WS-14] |
| failed | | | [WS-14] |

| from | to | trigger | Source |
|---|---|---|---|
| waiting-to-sync | synced | SAP accepts the record | [WS-14] |
| waiting-to-sync | failed | SAP rejects the record | [WS-14] |
| failed | synced | Retry in the next cycle succeeds | [WS-14] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| System of record | A customer, product, price or employee differs in SAP and neome | SAP wins | [WS-14] |
| Sync every 30 minutes | Customers, products, employees, prices, credit limits, open balances, stock | SAP to neome every 30 minutes | [WS-14] |
| Invoice at once | Invoice is made in neome | Pushed to SAP at once; failure retried | [WS-14] |
| New customer check | Customer made in neome, or address, phone or GEO changed | Goes to SAP only after the Sales Supervisor approves the Change Request | [WS-14] |
| Products and employees | Owner makes or changes one in neome | Pushed to SAP direct | [WS-14] |
| Stock one way | Stock | neome never writes stock to SAP | [WS-14] |
| Failed record | SAP rejects a record | Shows Failed with the SAP message; Owner sees it in the dashboard; retried each cycle; no other notification | [WS-14] |
| Temporary code | Customer made in neome | Temporary Customer Code until SAP returns the CardCode | [WS-14] |
| Frequency | Owner changes it in the dashboard | Next sync follows it | [WS-14] |

## 7 Exceptions

- SAP down: neome keeps working; changes and invoices wait and go when SAP is back; the invoice shows Waiting to sync. [WS-14]
- SAP rejects a record: Failed with the SAP message; Owner sees it; retried each cycle. [WS-14]
- Same record changed in SAP and neome: SAP wins. [WS-14]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Sync log | Owner | Record, time, Sync status | [WS-14] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP Business One 10.0 (HANA), Service Layer REST API | in | Customers, products, employees, price lists, credit limits, open balances, depot stock, every 30 minutes; SAP is system of record | Neome team writes the plugin; SAP side Chanda Mwila (IT Manager, 260 Brands); credentials from the SAP partner | [RFP-1, IN-1, WS-14] |
| SAP Business One 10.0 (HANA), Service Layer REST API | out | Customers (after Sales Supervisor approval), products and employees made in neome; invoices at once | Neome team writes the plugin; SAP side Chanda Mwila (IT Manager, 260 Brands) | [RFP-1, IN-1, WS-14] |

## 10 Volumes and NFRs

- About 4,000 customers, 120 products, 100 employees; about 700 invoices a day. [WS-14]
- Initial load from SAP: customers, products, employees, open balances per customer; no order history. [WS-14]
- Sync every 30 minutes; invoices near real time. [WS-14]

## 11 Requirements

### SAP-01 — Customer sync

Statement: Customers created or changed in SAP are fetched by the plugin and shown in neome every 30 minutes; customers created or changed in neome go to SAP after the Sales Supervisor approves the Change Request; on a clash SAP wins. [RFP-1, IN-1, WS-14]
Acceptance:
- A customer added in SAP shows in neome within 30 minutes. [WS-14]
- A new customer made in neome is not in SAP until the Sales Supervisor approves it, then it is. [WS-14]
- A customer changed in both places shows the SAP value in neome. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-10, OI-13, OI-65
Proposed: no

### SAP-02 — Product sync

Statement: Products created or changed in SAP are fetched by the plugin and shown in neome every 30 minutes; products made or changed in neome by the Owner are pushed to SAP direct; on a clash SAP wins. [RFP-1, IN-1, WS-14]
Acceptance:
- A product added in SAP shows in neome within 30 minutes. [WS-14]
- A product added in neome by the Owner is in SAP after the push. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-10, OI-65
Proposed: no

### SAP-03 — Employee sync

Statement: Employees created or changed in SAP are fetched by the plugin and shown in neome every 30 minutes; employees made or changed in neome by the Owner are pushed to SAP direct; on a clash SAP wins. [RFP-1, IN-1, WS-14]
Acceptance:
- An employee added in SAP shows in neome within 30 minutes. [WS-14]
- An employee added in neome by the Owner is in SAP after the push. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-10, OI-65
Proposed: no

### SAP-04 — Stock sync from SAP

Statement: Warehouse stock changed in SAP is fetched by the plugin and shown in neome every 30 minutes; neome never writes stock to SAP. [RFP-1, WS-14]
Acceptance:
- A stock change in SAP shows in neome within 30 minutes. [WS-14]
- A stock change or closing stock made in neome is not sent to SAP. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-14
OIs: OI-09, OI-48
Proposed: no

### SAP-05 — Invoice to SAP

Statement: An invoice made in neome for a new order is sent by the plugin to SAP at once and is visible in SAP; a failed push is retried and shows Waiting to sync. [RFP-1, IN-1, WS-14]
Acceptance:
- The invoice of an order placed in neome is visible in SAP within minutes. [WS-14]
- With SAP down the invoice shows Waiting to sync and goes when SAP is back. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-11, OI-38
Proposed: no

### SAP-06 — Plugin set up from neome dashboard

Statement: The Owner sets the plugin in the neome dashboard: SAP connection and sync frequency per data type. [RFP-1, IN-1, WS-14]
Acceptance:
- The Owner changes the product sync frequency in the dashboard and the next sync follows it. [WS-14]
- Only the Owner can change these settings. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-11
Proposed: no

### SAP-07 — Neome builds the plugin

Statement: The Neome team writes the plugin for SAP Business One 10.0 (HANA) over the Service Layer REST API, with credentials from the SAP partner. [RFP-1, IN-1, WS-14]
Acceptance:
- The plugin is delivered by the Neome team and connects to the 260 Brands SAP through the Service Layer. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-08, OI-74
Proposed: no

### SAP-08 — Prices, credit limits and open balances from SAP

Statement: The price list per Customer Category, the credit limit and the open balance of each customer are fetched from SAP with the customer and product sync, every 30 minutes. [WS-14]
Acceptance:
- A price changed in SAP shows in neome within 30 minutes. [WS-14]
- A customer's credit limit and open balance in neome equal SAP within 30 minutes. [WS-14]
Priority: Must
Scope: Neome
Sources: WS-14
OIs: OI-18, OI-57
Proposed: no

### SAP-09 — Sync status and failed records

Statement: Each synced record carries a Sync status: Waiting to sync, Synced or Failed; a record SAP rejects shows Failed with the SAP message to the Owner and is retried each cycle. [WS-14]
Acceptance:
- A record SAP rejects shows Failed with the SAP message in the Owner's dashboard. [WS-14]
- A Failed record that SAP accepts on a later cycle becomes Synced. [WS-14]
Priority: Must
Scope: Neome
Sources: WS-14
Proposed: no

### SAP-10 — Customer Code from SAP

Statement: Customer Code is the SAP CardCode; a customer made in neome gets a temporary code until SAP returns the CardCode. [WS-14]
Acceptance:
- A customer made in neome shows a temporary code until approved and pushed; after that it shows the SAP CardCode. [WS-14]
Priority: Must
Scope: Neome
Sources: WS-14
OIs: OI-16
Proposed: no

### SAP-11 — Sync log

Statement: The Owner sees a sync log in the dashboard: record, time and Sync status. [WS-14]
Acceptance:
- The log lists each synced record with its time and Sync status. [WS-14]
Priority: Should
Scope: Neome
Sources: WS-14
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Custom module
How: Customers, products, employees, price lists, credit limits and open balances → Outlet, Warehouse/depot stock and Customer ledger of the field sales App, filled from SAP; plugin built by the Neome team on the SAP Business One Service Layer; Sync setting, Sync record (Sync status Waiting to sync / Synced / Failed) and Sync log added as a new record type; dashboard set-up for frequency; ERP links are never Standard and the App page names no ERP/DMS integration (catalog 4b rule 5, section 5 gap 6); Scope tag Neome as the Neome team builds the plugin. Rests on OI-08, OI-11 (closed) (proposed, to confirm)

## 13 Open Items

N/A: no open Open Items
