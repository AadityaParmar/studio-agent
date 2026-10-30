# INV — Inventory

Prefix: INV
Name: Inventory
Status: resolved
Sources: RFP-1, WS-4

## 1 Purpose and KPIs

- Purpose: Supervisors assign product inventory to Sales Agents, who sell from it; unsold stock comes back and is counted; depot stock is read from SAP. [RFP-1, WS-4]
- KPI: Every Sales Agent starts the day with stock assigned and ends it with unsold stock returned and counted; no order above assigned stock; no manual Excel for stock in hand. [WS-4]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Supervisor | Assigns products to own Sales Agents; counts and accepts Stock Return; sees depot stock and Stock in hand | 8 | [RFP-1, WS-4] |
| Sales Agent | Sells items from own Sales Agent Inventory; returns unsold stock at end of day | 60 | [RFP-1, WS-4] |
| Area Sales Manager | Sees depot stock and Stock in hand | 3 | [WS-4] |
| Regional Sales Manager | Sees depot stock and Stock in hand | 2 | [WS-4] |
| Sales Head | Sees depot stock and Stock in hand | 1 | [WS-4] |
| Owner | Sees depot stock and Stock in hand | 1 | [WS-4] |

Tricycle Riders get no Sales Agent Inventory. [WS-4]

## 3 Process

- Supervisor: Assign Inventory (select employee, select products, quantity) → Sales Agent Inventory. [RFP-1, WS-4]
- Sales Agent selects items from the assigned inventory when placing an order; the order reduces the inventory and cannot exceed it. [RFP-1, WS-4]
- End of day: Sales Agent returns unsold stock; Sales Supervisor counts it at the depot and accepts it. [WS-4]
- Stock Assignment marked Completed; Stock Return and Inventory marked Pending in RFP-1 scope. "Completed" means built in an old pilot app that is dropped; all items are built new in neome. [RFP-1, WS-4]
- Pain today: stock given to agents on paper; no record of what an agent holds; returns not counted; agents sell what they do not have. [WS-4]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Assign Inventory | DateTime | date | yes | | [RFP-1] |
| Assign Inventory | Employee | person | yes | The Sales Agent; one of the Supervisor's own | [RFP-1, WS-4] |
| Assign Inventory | Products | link-to-entity | yes | Multi select. Links to: Product | [RFP-1] |
| Assign Inventory | Quantity | number | yes | Per product | [WS-4] |
| Assign Inventory | Total Amount | money | no | Auto: quantity x Price | [RFP-1, WS-4] |
| Sales Agent Inventory | Employee | person | yes | The Sales Agent | [RFP-1, WS-4] |
| Sales Agent Inventory | Product | link-to-entity | yes | Links to: Product | [RFP-1] |
| Sales Agent Inventory | Assigned Qty | number | no | Auto, from Assign Inventory | [WS-4] |
| Sales Agent Inventory | Sold Qty | number | no | Auto, from orders; cancelled order puts it back | [WS-4] |
| Sales Agent Inventory | In Hand Qty | number | no | Auto: assigned minus sold minus returned. Stays next day if not returned | [WS-4] |
| Stock Return | Date | date | yes | | [WS-4] |
| Stock Return | Employee | person | yes | The Sales Agent | [WS-4] |
| Stock Return | Product | link-to-entity | yes | Links to: Product | [WS-4] |
| Stock Return | Returned Qty | number | yes | By the Sales Agent | [WS-4] |
| Stock Return | Counted Qty | number | no | By the Sales Supervisor; difference shows on the return | [WS-4] |
| Stock Return | Status | choice | yes | Values: Pending / Accepted | [WS-4] |
| Depot Stock | Product | link-to-entity | yes | Links to: Product. Read only | [WS-4] |
| Depot Stock | Quantity | number | no | From SAP; refreshed every 30 minutes | [WS-4] |

## 5 Statuses

Stock Return:

| id | start/end | open (OI) | Source |
|---|---|---|---|
| pending | start | | [WS-4] |
| accepted | end | | [WS-4] |

| from | to | trigger | Source |
|---|---|---|---|
| pending | accepted | Sales Supervisor counts the stock and accepts the return | [WS-4] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Total Amount | Products and quantities are added | Total Amount = quantity x Price | [WS-4] |
| Own agents only | Sales Supervisor assigns | Only own Sales Agents; no approval needed | [WS-4] |
| Order reduces inventory | Sales Agent places an order | Quantity taken off the Sales Agent Inventory | [WS-4] |
| No order above stock | Order quantity is above the assigned stock | Order cannot be placed | [WS-4] |
| Cancelled order | Sales Supervisor cancels an order before Invoiced | Quantity goes back into the Sales Agent Inventory | [WS-4] |
| Accept return | Sales Supervisor accepts a Stock Return | Counted Qty taken off the Sales Agent Inventory | [WS-4] |
| Depot stock refresh | Every 30 minutes | Depot stock read from SAP; neome never writes stock to SAP | [WS-4] |
| Push | Any stock event | No push; only the push events of other Modules | [WS-4] |

## 7 Exceptions

- Counted quantity differs from returned: Sales Supervisor enters the counted quantity; the difference shows on the return; no extra approval. [WS-4]
- Sales Agent does not return stock: it stays in the Sales Agent Inventory the next day. [WS-4]
- Order above assigned stock: not allowed. [WS-4]
- No network: Sales Agent sees own inventory and orders reduce it offline; assigning and accepting returns need network. [WS-4]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Stock in hand | Sales Supervisor and above | Stock per Sales Agent and product; filters date, area, supervisor, agent, product; Excel export | [WS-4] |
| Depot stock | Sales Supervisor and above | Warehouse stock per product, read from SAP; no warehouse transactions in neome | [WS-4] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | in | Depot (warehouse) stock, every 30 minutes; SAP is system of record, neome never writes stock to SAP | Neome team writes the plugin; SAP side OI-74 | [RFP-1, WS-4] |

## 10 Volumes and NFRs

- About 60 Sales Agents and about 120 products; one assignment and one return per Sales Agent per day, about 60 each; about 700 orders a day. [WS-4]
- Sales Agent works offline: own inventory and orders sync when online. [WS-4]

## 11 Requirements

### INV-01 — Assign inventory to a Sales Agent

Statement: A Sales Supervisor assigns products (multi select from Product Master) with a quantity per product to one of own Sales Agents, with date-time and Total Amount (quantity x Price), making the Sales Agent Inventory; no approval needed. [RFP-1, WS-4]
Acceptance:
- After assignment, the agent sees the assigned products and quantities in their inventory. [WS-4]
- Total Amount of 10 units at ZMW 50 and 5 units at ZMW 20 shows ZMW 600. [WS-4]
- A Sales Supervisor cannot assign to a Sales Agent who is not theirs. [WS-4]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-4
OIs: OI-32
Proposed: no

### INV-02 — Sell from assigned inventory

Statement: A Sales Agent selects order items from their assigned inventory; an order reduces it and cannot exceed it; a cancelled order puts the quantity back. [RFP-1, WS-4]
Acceptance:
- Products not assigned to the agent cannot be added to the agent's order. [WS-4]
- An order for 3 units lowers the agent's In Hand Qty by 3. [WS-4]
- An order above the In Hand Qty cannot be placed. [WS-4]
- An order cancelled before Invoiced adds its quantity back. [WS-4]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-4
OIs: OI-35
Proposed: no

### INV-03 — Stock Return

Statement: At end of day the Sales Agent returns unsold stock; the Sales Supervisor counts it at the depot and accepts it, entering the counted quantity. [RFP-1, WS-4]
Acceptance:
- A return starts Pending; after the Sales Supervisor accepts it, Status is Accepted and the counted quantity leaves the Sales Agent Inventory. [WS-4]
- A counted quantity different from the returned quantity shows the difference on the return. [WS-4]
- Stock not returned stays in the Sales Agent Inventory the next day. [WS-4]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-4
OIs: OI-33
Proposed: no

### INV-04 — Depot stock view

Statement: Sales Supervisor and above see depot (warehouse) stock per product, read from SAP every 30 minutes; neome has no warehouse transactions and never writes stock to SAP. [RFP-1, WS-4]
Acceptance:
- A stock change in SAP shows in neome within 30 minutes. [WS-4]
- The depot stock view cannot be edited in neome. [WS-4]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-4
OIs: OI-09, OI-11, OI-34
Proposed: no

### INV-05 — Stock in hand report

Statement: Sales Supervisor and above see Stock in hand per Sales Agent and product, filtered by date, area, supervisor, agent and product, with Excel export. [WS-4]
Acceptance:
- The report lists each agent's Assigned, Sold, Returned and In Hand quantity per product. [WS-4]
- The report exports to Excel. [WS-4]
Priority: Should
Scope: Neome
Sources: WS-4
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Sales Agent Inventory → Executive stock (assigned, sold, left) with Sales Supervisor assigning; Assign Inventory with quantity and Total Amount, Stock Return with Pending and Accepted and counted quantity set up as extra fields and statuses; orders and cancels deducting from Executive stock as the App does for sales and returns; Depot stock → Warehouse/depot stock shown read only, fed from SAP by the plugin (SAP-04, not Standard); Stock in hand is not one of the App's named reports, so set up as a report with filters and Excel export; offline capture as platform mechanics (proposed, to confirm)

## 13 Open Items

N/A: no open Open Items.
