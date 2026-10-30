# MST — Masters

Prefix: MST
Name: Masters
Status: claimed
Sources: RFP-1, IN-1, QA-1

## 1 Purpose and KPIs

- Purpose: Keep the base lists (employees, customers, products, beats, routes, stores, categories, competitors) that orders, visits, inventory and reports use. [RFP-1]
- OI-71: Goals, KPIs and today's pain for Masters.

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Owner | Adds employees, customers, products, beats and routes | | [RFP-1] |
| Sales Agent | Picks customers and products from the masters | | [RFP-1] |
| Sales Supervisor | Uses Employee, Beat and Product Masters to assign beats and products | | [RFP-1] |

- OI-17: Who adds and edits each master.
- OI-06: Headcount per role.

## 3 Process

- Masters already marked Completed in RFP-1 scope: Customer Master, Product Master, Employee Master, Store Master, Customer GEO Tagging. [RFP-1]
- Owner adds a Route; adds a Beat by picking a Route; adds an Employee or Customer by picking a Beat; adds a Product. [RFP-1]
- Customers, products and employees are made or changed in SAP or in neome; the plugin syncs them both ways. [RFP-1, IN-1]
- Customer GEO tagging and Beat allocation are done in the neome app. [IN-1]
- OI-71: Pain today not stated in Sources.
- OI-01: Does "Completed" mean already built and live?
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Employee | Employee | text | yes | | [RFP-1] |
| Employee | Mobile Number | text | no | | [RFP-1] |
| Employee | Email | text | no | | [RFP-1] |
| Employee | Address | text | no | | [RFP-1] |
| Employee | Beat | link-to-entity | no | Multi select. Links to: Beat | [RFP-1] |
| Employee | Casual Leave Balance | number | no | OI-22 | [RFP-1] |
| Employee | Sick Leave Balance | number | no | OI-22 | [RFP-1] |
| Employee | Total Leave Balance | number | no | Casual + Sick | [RFP-1] |
| Customer | Customer Code | text | no | OI-16 | [RFP-1] |
| Customer | Entered By | person | no | | [RFP-1] |
| Customer | Name | text | yes | | [RFP-1] |
| Customer | TPIN | text | no | OI-15 | [RFP-1] |
| Customer | Beat | link-to-entity | no | Links to: Beat | [RFP-1] |
| Customer | Route | link-to-entity | no | Auto fill from Beat. Links to: Route | [RFP-1] |
| Customer | Category | choice | no | OI-14 | [RFP-1] |
| Customer | Classification | choice | no | OI-14 | [RFP-1] |
| Customer | Location | text | no | GEO tag, OI-21 | [RFP-1, IN-1] |
| Customer | Bill To | text | no | | [RFP-1] |
| Customer | Ship To | text | no | | [RFP-1] |
| Customer | Email | text | no | | [RFP-1] |
| Customer | Mobile Number | text | no | | [RFP-1] |
| Customer | Shop Owner | text | no | | [RFP-1] |
| Customer | Shop Buyer | text | no | | [RFP-1] |
| Customer | Image | file | no | | [RFP-1] |
| Product | Image | file | no | | [RFP-1] |
| Product | Product Code | text | no | | [RFP-1] |
| Product | Product | text | yes | | [RFP-1] |
| Product | Case Size | text | no | | [RFP-1] |
| Product | Category | link-to-entity | no | Links to: Category | [RFP-1] |
| Product | Price | money | no | OI-18 | [RFP-1] |
| Beat | Entered By | person | no | | [RFP-1] |
| Beat | Beat | text | yes | | [RFP-1] |
| Beat | Route | link-to-entity | no | Links to: Route | [RFP-1] |
| Route | Route | text | yes | | [RFP-1] |
| Store | Store name | text | yes | | [RFP-1] |
| Store | Store supervisor | text | no | | [RFP-1] |
| Store | Email | text | no | | [RFP-1] |
| Store | Supervisor mobile number | text | no | | [RFP-1] |
| Store | Area name | text | no | | [RFP-1] |
| Store | Location | text | no | | [RFP-1] |
| Category | Category | text | yes | | [RFP-1] |
| Competitor | Competitor name | text | yes | | [RFP-1] |
| Competitor | Image | file | no | per product | [RFP-1] |
| Competitor | Product Code | text | no | per product | [RFP-1] |
| Competitor | Product | text | no | per product | [RFP-1] |
| Competitor | Case Size | text | no | per product | [RFP-1] |
| Competitor | Category | link-to-entity | no | per product. Links to: Category | [RFP-1] |

- OI-14: Customer Category and Classification values.
- OI-15: TPIN meaning, format, required.
- OI-16: Who makes Customer Code.
- OI-18: One price per product or price lists; tax.
- OI-19: Who maintains Competitor Master.
- OI-20: Are Stores also Customers?
- OI-21: Who GEO tags customers and when.
- OI-22: Who sets leave balances.

## 5 Statuses

- OI-72: Master record statuses (Active / Inactive?) and what happens to linked records.

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Route auto fill | Customer Beat picked | Route of that Beat fills in | [RFP-1] |
| Total Leave Balance | Casual or Sick Leave Balance changes | Total = Casual + Sick | [RFP-1] |
| Sync to SAP | Customer, product or employee made or changed in neome | Sent to SAP via plugin | [RFP-1, IN-1] |

- OI-65: Checks before neome-made masters reach SAP.
- OI-17: Who may add and edit each master.

## 7 Exceptions

- OI-10: Same record changed in SAP and neome: which wins.
- OI-72: Beat made inactive or moved to another Route: what happens to its Customers and Employees.

## 8 Reports

- OI-73: Master lists and exports needed.

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | both | Customers, products, employees; see SAP Module | Neome team writes the plugin | [RFP-1, IN-1] |

- OI-10: System of record per data type.
- OI-74: Who in 260 Brands owns SAP and the link.

## 10 Volumes and NFRs

- OI-06: Number of customers, products, beats, employees.
- OI-07: Offline use in the field.

## 11 Requirements

### MST-01 — Employee Master

Statement: The system keeps an Employee Master with contact details, assigned Beats (multi select) and Casual, Sick and Total Leave Balance. [RFP-1]
Acceptance:
- Owner adds an employee, picks one or more Beats, and Total Leave Balance shows Casual + Sick. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-22, OI-75
Proposed: no

### MST-02 — Customer Master

Statement: The system keeps a Customer Master with the fields in RFP-1 §5.2, where Route fills itself from the chosen Beat. [RFP-1]
Acceptance:
- Owner adds a customer, picks a Beat, and the Route of that Beat fills in. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-14, OI-15, OI-16, OI-17, OI-75
Proposed: no

### MST-03 — Customer GEO Tagging

Statement: Each customer's location is GEO tagged in the neome app. [RFP-1, IN-1]
Acceptance:
- A customer record shows its map location after tagging. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, IN-1, QA-1
OIs: OI-21, OI-75
Proposed: no

### MST-04 — Product Master

Statement: The system keeps a Product Master with Image, Product Code, Product, Case Size, Category (from Category Master) and Price. [RFP-1]
Acceptance:
- Owner adds a product with a Category from the Category Master and it can be picked in orders. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-18, OI-75
Proposed: no

### MST-05 — Beat and Route Masters

Statement: The system keeps a Route Master and a Beat Master, each Beat linked to one Route. [RFP-1]
Acceptance:
- Owner adds a Route, then a Beat on that Route; the Beat shows its Route. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-75
Proposed: no

### MST-06 — Store Master

Statement: The system keeps a Store Master of modern trade stores with store name, store supervisor, email, supervisor mobile number, area name and location. [RFP-1]
Acceptance:
- A Store added to the Store Master can be picked in Modern Trade. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-20, OI-75
Proposed: no

### MST-07 — Category Master

Statement: The system keeps a Category Master used to categorise products and competitor products. [RFP-1]
Acceptance:
- Categories added appear as choices in Product Master and Competitor Master. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-75
Proposed: no

### MST-08 — Competitor Master

Statement: The system keeps a Competitor Master: competitor name and its products (image, product code, product, case size, category). [RFP-1]
Acceptance:
- A competitor with products can be picked in Modern Trade competitor activities. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-19, OI-75
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Customer → Outlet, Beat and Route → Beat / route, Product → product catalog and price list, Employee → Executive; Store, Category and Competitor added as master lists with set-up fields; Customer GEO tag via GPS tag; vertical App configured to 260 Brands' route to market, Employee Directory as second App for employee data; SAP sync hangs on OI-10, OI-65, OI-74 (proposed, to confirm)

## 13 Open Items

- OI-10: System of record for customers, products, employees.
- OI-16: Who makes Customer Code.
- OI-18: One price per product or price lists; tax.
- OI-19: Who maintains Competitor Master; meaning of Competitor diagram.
- OI-20: Are Stores also Customers?
- OI-22: Who sets leave balances; quota, accrual.
- OI-65: Checks before neome-made masters reach SAP.
- OI-07: Offline use in the field.
- OI-74: SAP owner on 260 Brands side.
