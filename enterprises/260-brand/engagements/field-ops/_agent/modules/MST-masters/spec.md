# MST — Masters

Prefix: MST
Name: Masters
Status: resolved
Sources: RFP-1, IN-1, WS-5, QA-1

## 1 Purpose and KPIs

- Purpose: Keep the base lists (employees, customers, products, beats, routes, stores, categories, competitors) that orders, visits, inventory and reports use. [RFP-1]
- Pain today: masters are in Excel and out of sync with SAP; wrong prices appear on orders. KPI: zero price mismatches and master sync in under 30 minutes. [QA-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Owner | Adds and edits all masters; only role with settings | 1 | [RFP-1, QA-1] |
| Sales Agent | Picks customers and products from the masters | | [RFP-1] |
| Sales Supervisor | Uses masters to assign Beats and products; approves customer Change Requests | 8 | [RFP-1, QA-1] |
| Sales Agent | May add a Customer through a Change Request; captures GEO on first visit | 60 | [QA-1] |
| Tricycle Rider | Employee; does not maintain masters | 25 | [QA-1] |


## 3 Process

- RFP-1 marks 16 of 34 scope items Completed in an old pilot app being dropped; this BRD covers all 34 and all will be built new in neome. [RFP-1, QA-1]
- Owner adds a Route; adds a Beat by picking a Route; adds an Employee or Customer by picking a Beat; adds a Product. [RFP-1]
- Customers, products and employees are made or changed in SAP or in neome; the plugin syncs them both ways. [RFP-1, IN-1]
- Customer GEO tagging and Beat allocation are done in the neome app. [IN-1]
- Owner adds and edits all masters. A Sales Agent may add a Customer by Change Request; a Sales Supervisor approves before it is sent to SAP. Products and Employees are Owner-only in neome or come from SAP. [QA-1]
- Sales Agent captures Customer GEO on the first visit; only a Sales Supervisor can change it afterward. [QA-1]
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
| Customer | TPIN | text | no | 10-digit ZRA Taxpayer ID; required for Wholesaler and Supermarket, optional for other categories | [QA-1] |
| Customer | Beat | link-to-entity | no | Links to: Beat | [RFP-1] |
| Customer | Route | link-to-entity | no | Auto fill from Beat. Links to: Route | [RFP-1] |
| Customer | Category | choice | yes | Retail Shop / Wholesaler / Supermarket / School / Institution | [QA-1] |
| Customer | Classification | choice | yes | A: above ZMW 20,000/month; B: ZMW 5,000–20,000; C: below ZMW 5,000 | [QA-1] |
| Customer | Location | text | no | Sales Agent captures GPS on first visit; only Sales Supervisor can change it | [RFP-1, IN-1, QA-1] |
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

- Category values: Retail Shop, Wholesaler, Supermarket, School, Institution. Classification: A above ZMW 20,000/month, B ZMW 5,000–20,000, C below ZMW 5,000. [QA-1]
- TPIN is the 10-digit ZRA Taxpayer ID; required for Wholesaler and Supermarket, optional for others. [QA-1]
- OI-16: Who makes Customer Code.
- OI-18: One price per product or price lists; tax.
- OI-19: Who maintains Competitor Master.
- OI-20: Are Stores also Customers?
- Sales Agent captures Customer GEO on first visit; only Sales Supervisor can change it afterward. [QA-1]
- OI-22: Who sets leave balances.

## 5 Statuses

- Records use Active/Inactive status and are not deleted. Inactive records are hidden from pick lists. For an inactive Beat, its Customers stay and Sales Supervisor moves them; Employees are unmapped. [QA-1]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Route auto fill | Customer Beat picked | Route of that Beat fills in | [RFP-1] |
| Total Leave Balance | Casual or Sick Leave Balance changes | Total = Casual + Sick | [RFP-1] |
| Sync to SAP | Customer, product or employee made or changed in neome | Sales Supervisor approves a Customer Change Request; Owner-created Products and Employees go direct | [RFP-1, IN-1, QA-1] |

- Owner adds and edits all masters. Sales Agent may add Customer by Change Request; Sales Supervisor approves it before SAP. Products and Employees are Owner-only in neome or come from SAP. [QA-1]

## 7 Exceptions

- For SAP source-of-record rules, see SAP Integration. [QA-1]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Master sheets | Owner and Sales Supervisor | One sheet per master; filters by Beat, Route and Category; Excel export | [QA-1] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | both | Customers, products, employees; see SAP Module | Neome team writes the plugin | [RFP-1, IN-1] |

- See SAP Integration for system of record and SAP owner. [QA-1]

## 10 Volumes and NFRs

- About 4,000 customers, 120 products, 90 Beats, 15 routes and 100 Employees. Field staff work offline; data syncs when online. [QA-1, WS-5]

## 11 Requirements

### MST-01 — Employee Master

Statement: The system keeps an Employee Master with contact details, assigned Beats (multi select) and Casual, Sick and Total Leave Balance. Owner adds and edits Employees; they may also come from SAP. [RFP-1, QA-1]
Acceptance:
- Owner adds an employee, picks one or more Beats, and Total Leave Balance shows Casual + Sick. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-22, OI-75
Proposed: no

### MST-02 — Customer Master

Statement: The system keeps a Customer Master with the fields in RFP-1 §5.2, Category and Classification values, conditional TPIN, and Route filled from the chosen Beat. Owner maintains it; Sales Agents may add Customers through a Change Request. [RFP-1, QA-1]
Acceptance:
- Owner adds a customer, picks a Beat, and the Route of that Beat fills in. [QA-1]
- TPIN is a 10-digit ZRA Taxpayer ID, required for Wholesaler and Supermarket, optional for other categories. [QA-1]
- A Sales Agent's new Customer reaches SAP only after Sales Supervisor approval of its Change Request. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-14, OI-15, OI-16, OI-17, OI-75
Proposed: no

### MST-03 — Customer GEO Tagging

Statement: Each Customer's location is captured by the Sales Agent on the first visit; only a Sales Supervisor may change it. [RFP-1, IN-1, QA-1]
Acceptance:
- A customer record shows its map location after tagging. [QA-1]
- A Sales Agent cannot change a captured location; a Sales Supervisor can. [QA-1]
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

Statement: The system keeps a Route Master and a Beat Master, each Beat linked to one Route; master records use Active/Inactive status and are not deleted. [RFP-1, QA-1]
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
How: Customer → Outlet, Beat and Route → Beat / route, Product → product catalog and price list, Employee → Executive; Store, Category and Competitor added as master lists with set-up fields; Customer GEO tag via GPS tag; vertical App configured to 260 Brands' route to market, Employee Directory as second App for employee data; SAP sync rules are defined in the SAP Integration spec.

## 13 Open Items

N/A: no open Open Items.
