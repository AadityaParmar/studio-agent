---
status: claimed
prefix: MST
name: Masters
blockedBy: []
revisitReason:
formerly:
claimedBy: Aditya Parmar
---

# MST — Masters

Name: Masters

## 1 Purpose and KPIs

- Purpose: Keep the base lists (employees, customers, products, beats, routes, stores, categories, competitors) that orders, visits, inventory and reports use. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Owner | Adds employees, customers, products, beats and routes | | [RFP-1] |
| Sales Agent | Picks customers and products from the masters | | [RFP-1] |

## 3 Process

- Masters already marked Completed in RFP-1 scope: Customer Master, Product Master, Employee Master, Store Master, Customer GEO Tagging. [RFP-1]
- Owner adds a Route; adds a Beat by picking a Route; adds an Employee or Customer by picking a Beat; adds a Product. [RFP-1]

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

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | both | Customers, products, employees; see SAP Module | Neome team writes the plugin | [RFP-1, IN-1] |

## 11 Requirements

### MST-01 — Employee Master

Statement: The system keeps an Employee Master with contact details, assigned Beats (multi select) and Casual, Sick and Total Leave Balance. [RFP-1]
Acceptance:
- Owner adds an employee, picks one or more Beats, and Total Leave Balance shows Casual + Sick. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-22
Proposed: yes

### MST-02 — Customer Master

Statement: The system keeps a Customer Master with the fields in RFP-1 §5.2, where Route fills itself from the chosen Beat. [RFP-1]
Acceptance:
- Owner adds a customer, picks a Beat, and the Route of that Beat fills in. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-14, OI-15, OI-16, OI-17
Proposed: yes

### MST-03 — Customer GEO Tagging

Statement: Each customer's location is GEO tagged in the neome app. [RFP-1, IN-1]
Acceptance:
- A customer record shows its map location after tagging. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-21
Proposed: yes

### MST-04 — Product Master

Statement: The system keeps a Product Master with Image, Product Code, Product, Case Size, Category (from Category Master) and Price. [RFP-1]
Acceptance:
- Owner adds a product with a Category from the Category Master and it can be picked in orders. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-18
Proposed: yes

### MST-05 — Beat and Route Masters

Statement: The system keeps a Route Master and a Beat Master, each Beat linked to one Route. [RFP-1]
Acceptance:
- Owner adds a Route, then a Beat on that Route; the Beat shows its Route. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### MST-06 — Store Master

Statement: The system keeps a Store Master of modern trade stores with store name, store supervisor, email, supervisor mobile number, area name and location. [RFP-1]
Acceptance:
- A Store added to the Store Master can be picked in Modern Trade. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-20
Proposed: yes

### MST-07 — Category Master

Statement: The system keeps a Category Master used to categorise products and competitor products. [RFP-1]
Acceptance:
- Categories added appear as choices in Product Master and Competitor Master. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### MST-08 — Competitor Master

Statement: The system keeps a Competitor Master: competitor name and its products (image, product code, product, case size, category). [RFP-1]
Acceptance:
- A competitor with products can be picked in Modern Trade competitor activities. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-19
Proposed: yes

## 13 Open Items

- OI-10: System of record for customers, products, employees.
- OI-14: Customer Category and Classification values.
- OI-15: TPIN meaning, format, required.
- OI-16: Who makes Customer Code.
- OI-17: Who adds and edits each master.
- OI-18: One price per product or price lists; tax.
- OI-19: Who maintains Competitor Master; meaning of Competitor diagram.
- OI-20: Are Stores also Customers?
- OI-21: Who GEO tags customers and when.
- OI-22: Who sets leave balances; quota, accrual.
- OI-65: Checks before neome-made masters reach SAP.
