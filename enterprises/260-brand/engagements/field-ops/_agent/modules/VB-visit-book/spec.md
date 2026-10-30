# VB — Visit Book

Prefix: VB
Name: Visit Book
Status: resolved
Sources: RFP-1, IN-1, WS-4, WS-5

## 1 Purpose and KPIs

- Purpose: Record customer visits by Sales Agents, place orders, take payment and make the invoice that goes to SAP. [RFP-1, IN-1]
- KPI: Every visit recorded on the Beat with GPS; every order has an invoice made in neome and in SAP within minutes; 0 price mismatches between neome and SAP; no paper order books. [WS-5]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Adds visits, places orders, takes payment, makes the invoice, marks Delivered; sees own entries | 60 | [RFP-1, WS-5] |
| Sales Supervisor | Cancels an order before Invoiced; sees all visits, orders and payments | 8 | [RFP-1, WS-5] |
| Area Sales Manager | Sees all visits, orders and payments | 3 | [WS-5] |
| Regional Sales Manager | Sees all visits, orders and payments | 2 | [WS-5] |
| Sales Head | Sees all visits, orders and payments | 1 | [WS-5] |
| Owner | Sees all visits, orders and payments | 1 | [WS-5] |

Tricycle Riders do not use Visit Book; they use Marketing Visit. [WS-5]

## 3 Process

- Sales Agent: Add Visit (select Beat, select Customer) → Add Products (Product Master) → End. [RFP-1]
- Sales Agent: Place Order (customer from assigned Beat, item from assigned inventory) → Order Sheet/Report; then Take Payment → Payment Sheet. [RFP-1]
- Sales Agent: Add Visit → Visit Sheet/Report. [RFP-1]
- Sales Agent sees all customers of own mapped Beats, today's planned Beat first. [WS-5]
- A visit needs no order; a no-order visit gets a reason. [WS-5]
- Order Status runs Placed → Invoiced → Delivered; for van sales all three happen in the same visit. [WS-5]
- New order placed in neome → invoice made in neome → plugin sends invoice to SAP at once → invoice visible in SAP. [RFP-1, IN-1, WS-5]
- Invoice PDF goes to the customer on WhatsApp and can be printed on a Bluetooth printer. [WS-5]
- Daily Visits, Order Book and Product Catalog marked Completed in RFP-1 scope. "Completed" means built in an old pilot app that is dropped; all items are built new in neome. [RFP-1, WS-5]
- Pain today: orders and visits on paper; prices wrong on orders; invoices made late by hand in SAP; no proof the agent was at the shop. [WS-5]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Visit | Date | date | yes | | [RFP-1] |
| Visit | Visited By | person | yes | The Sales Agent | [RFP-1, WS-5] |
| Visit | Route | link-to-entity | no | Auto fill from Beat. Links to: Route | [RFP-1] |
| Visit | Beat | link-to-entity | yes | One of the agent's mapped Beats. Links to: Beat | [RFP-1, WS-5] |
| Visit | Customer | link-to-entity | yes | Links to: Customer | [RFP-1] |
| Visit | Location | text | no | Auto, GPS | [RFP-1, WS-5] |
| Visit | Remarks | text | no | | [RFP-1] |
| Visit | Images | file | no | | [RFP-1] |
| Visit | No-order reason | choice | no | Required when the visit has no order. Values: Shop closed / Stock enough / No money / Owner not there / Other | [WS-5] |
| Order | Visit | link-to-entity | yes | Links to: Visit | [RFP-1] |
| Order | Order Status | choice | yes | Values: Placed / Invoiced / Delivered / Cancelled | [WS-5] |
| Order | Total Amount | money | no | Auto: sum of item amounts, before VAT | [WS-5] |
| Order Item | Order | link-to-entity | yes | Added via Add order button. Links to: Order | [RFP-1] |
| Order Item | Product | link-to-entity | yes | From the agent's Sales Agent Inventory. Links to: Product | [RFP-1, WS-5] |
| Order Item | Quantity | number | yes | Not above In Hand Qty | [WS-5] |
| Order Item | Price | money | no | Auto: price list of the Customer Category, without VAT | [WS-5] |
| Payment | Order | link-to-entity | yes | Links to: Order | [RFP-1] |
| Payment | Payment Mode | choice | yes | Values: Cash / Mobile Money / Bank Transfer / Cheque / Credit | [WS-5] |
| Payment | Amount collected | money | no | Part payment allowed | [RFP-1, WS-5] |
| Payment | Change to be given | money | no | If any: amount collected above the order total | [RFP-1, WS-5] |
| Invoice | Order | link-to-entity | yes | Links to: Order | [RFP-1] |
| Invoice | Invoice Number | text | yes | Auto: INV-<agent code>-<seq> | [WS-5] |
| Invoice | VAT | money | no | Auto: 16% of the order total | [WS-5] |
| Invoice | SAP sync | text | no | Shows Waiting to sync until SAP has the invoice | [WS-5] |

## 5 Statuses

Order Status:

| id | start/end | open (OI) | Source |
|---|---|---|---|
| placed | start | | [WS-5] |
| invoiced | | | [WS-5] |
| delivered | end | | [WS-5] |
| cancelled | end | | [WS-5] |

| from | to | trigger | Source |
|---|---|---|---|
| placed | invoiced | Sales Agent makes the invoice | [WS-5] |
| invoiced | delivered | Sales Agent hands over the goods and marks Delivered | [WS-5] |
| placed | cancelled | Sales Supervisor cancels the order before Invoiced | [WS-5] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Beat customers only | Sales Agent picks the customer | Only customers of the agent's mapped Beats; today's planned Beat first | [RFP-1, WS-5] |
| Items from inventory | Sales Agent adds products to an order | Only products in the agent's Sales Agent Inventory; order cannot exceed In Hand Qty; order lowers it | [RFP-1, WS-4, WS-5] |
| Customer price | Item is added | Price from the price list of the customer's Customer Category, from SAP, without VAT | [WS-5] |
| VAT | Invoice is made | VAT 16% added on the invoice | [WS-5] |
| Credit | Payment Mode is Credit | Allowed only for Category A and B customers, up to the credit limit from SAP; above it the order cannot be placed on credit | [WS-5] |
| Part payment | Amount collected is less than the order total | Allowed; the rest stays owed | [WS-5] |
| Change to be given | Amount collected is more than the order total | The difference shows as Change to be given | [WS-5] |
| No-order reason | Visit saved with no order | Agent must pick a reason | [WS-5] |
| Invoice number | Invoice is made | Number INV-<agent code>-<seq> | [WS-5] |
| Invoice to SAP | Invoice is made | Pushed to SAP at once; failure is retried; agent is not blocked; shows Waiting to sync | [WS-5] |
| Invoice delivery | Invoice is made | PDF sent to the customer on WhatsApp; can be printed on a Bluetooth printer | [WS-5] |
| Closed order | Order is Delivered or Cancelled | Cannot be changed | [WS-5] |
| Edit visit | Visit is saved | Sales Agent can edit it the same day only | [WS-5] |
| Cancel order | Sales Supervisor cancels before Invoiced | Quantity goes back to the Sales Agent Inventory; push to the Sales Agent | [WS-4, WS-5] |

## 7 Exceptions

- Customer on credit above the credit limit: order cannot be placed on credit; agent takes payment or cuts the order. [WS-5]
- Order above In Hand Qty: not allowed. [WS-4, WS-5]
- Invoice push to SAP fails: retried until it works; agent is not blocked; Waiting to sync. [WS-5]
- No network: Sales Agent records visits and orders offline; they sync when online. [WS-5]
- Visit with no order: reason picked from the list. [WS-5]
- Delivered or Cancelled order: no change. [WS-5]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Visit Sheet/Report | Sales Agent own entries; Sales Supervisor and above all | Visits with no-order reasons; filters date, area, supervisor, agent, beat; Excel export | [RFP-1, WS-5] |
| Order Sheet/Report | Sales Agent own entries; Sales Supervisor and above all | Orders with Order Status; filters date, area, supervisor, agent, beat, product; Excel export | [RFP-1, WS-5] |
| Payment Sheet | Sales Agent own entries; Sales Supervisor and above all | Payments taken by mode; filters date, area, supervisor, agent, beat; Excel export | [RFP-1, WS-5] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | out | Order invoice, at once; SAP is system of record for customers, products and prices | Neome team writes the plugin; SAP side Chanda Mwila (IT Manager, 260 Brands) | [RFP-1, IN-1, WS-5] |
| SAP | in | Price list per Customer Category, credit limit, open balances | Neome team writes the plugin; SAP side Chanda Mwila | [WS-5] |
| WhatsApp | out | Invoice PDF to the customer, from 260 Brands WhatsApp Business +260 97 000 0000 via neome's provider; 260 Brands pays | Neome team; 260 Brands | [WS-5] |

## 10 Volumes and NFRs

- About 1,200 visits and 700 orders a day; about 4,000 customers, 120 products, 90 Beats; 60 Sales Agents. [WS-5]
- Sales Agent works offline: visits and orders sync when online. [WS-5]
- Currency ZMW; app in English. [WS-5]
- Invoice printable on a Bluetooth printer. [WS-5]
- OI-76: How long visit, order and invoice records are kept.

## 11 Requirements

### VB-01 — Record a visit

Statement: A Sales Agent records a customer visit with Date, Beat, Customer, auto GPS Location, Remarks and Images; Route fills from the Beat; the agent can edit it the same day only. [RFP-1, WS-5]
Acceptance:
- A saved visit shows the agent's GPS location captured automatically. [WS-5]
- A visit saved on Beat B1 shows the Route of B1. [RFP-1]
- The next day the agent cannot edit that visit. [WS-5]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-5
OIs: OI-76
Proposed: no

### VB-02 — Add order in a visit

Statement: In a visit, an Add order button lets the agent add products with a quantity from the agent's Sales Agent Inventory; an order lowers the inventory. [RFP-1, WS-5]
Acceptance:
- Tapping Add order lets the agent pick products and saves them on the visit. [RFP-1]
- An order for 3 units lowers the agent's In Hand Qty by 3. [WS-4, WS-5]
- An order above In Hand Qty cannot be placed. [WS-5]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-4, WS-5
OIs: OI-35
Proposed: no

### VB-03 — Order customer and items limits

Statement: The agent selects the customer from all customers of own mapped Beats, today's planned Beat first, and items from the assigned inventory. [RFP-1, WS-5]
Acceptance:
- Customers off the agent's Beats and products not in the agent's inventory cannot be picked. [RFP-1, WS-5]
- Customers of today's planned Beat show first. [WS-5]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-5
Proposed: no

### VB-04 — Take payment

Statement: The agent records the payment of an order by Cash, Mobile Money (Airtel or MTN), Bank Transfer, Cheque or Credit; part payment is allowed; Credit only for Category A and B customers up to the credit limit from SAP; change to be given shows when the amount collected is above the order total. [RFP-1, WS-5]
Acceptance:
- A visit with ZMW 1,000 owed and ZMW 1,200 collected shows ZMW 200 change to be given. [RFP-1, WS-5]
- A Category C customer cannot be sold on Credit. [WS-5]
- An order on Credit above the credit limit cannot be placed. [WS-5]
- ZMW 600 collected on a ZMW 1,000 order is saved, ZMW 400 stays owed. [WS-5]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-5
OIs: OI-37
Proposed: no

### VB-05 — Order Status

Statement: Each order carries an Order Status: Placed, Invoiced, Delivered or Cancelled; the Sales Agent makes the invoice and marks Delivered, the Sales Supervisor cancels before Invoiced; a Delivered or Cancelled order cannot be changed. [WS-5]
Acceptance:
- A van sale goes Placed, Invoiced, Delivered in the same visit. [WS-5]
- The Sales Supervisor can cancel a Placed order, not an Invoiced one. [WS-5]
- A cancelled order puts its quantity back in the Sales Agent Inventory and the Sales Agent gets a push. [WS-4, WS-5]
- Order Status shows on the order and in the Order Sheet/Report. [RFP-1, WS-5]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-4, WS-5
OIs: OI-36
Proposed: no

### VB-06 — Invoice to SAP

Statement: When the invoice is made in neome, the plugin pushes it to SAP at once; a failed push is retried and the agent is not blocked. [RFP-1, IN-1, WS-5]
Acceptance:
- An order's invoice is visible in SAP shortly after it is made. [RFP-1, WS-5]
- With no link to SAP the invoice shows Waiting to sync and is sent when the link is back. [WS-5]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-5
OIs: OI-11
Proposed: no
Delivery: Custom module

### VB-07 — Visit, order and payment sheets

Statement: The system shows Visit Sheet/Report, Order Sheet/Report and Payment Sheet: the Sales Agent sees own entries, Sales Supervisor and above see all; filters by date, area, supervisor, agent, beat and product; Excel export. [RFP-1, WS-5]
Acceptance:
- Each sheet lists that day's entries; a Sales Agent sees only own. [WS-5]
- A Sales Supervisor sees the entries of all agents. [WS-5]
- Each sheet exports to Excel. [WS-5]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-5
Proposed: no

### VB-08 — Visit without order

Statement: A visit needs no order; a visit with no order must pick a reason: Shop closed, Stock enough, No money, Owner not there or Other. [WS-5]
Acceptance:
- A visit without an order cannot be saved with no reason. [WS-5]
- A visit with an order needs no reason. [WS-5]
Priority: Must
Scope: Neome
Sources: WS-5
OIs: OI-39
Proposed: no

### VB-09 — Invoice made in neome

Statement: The invoice is made in neome with number INV-<agent code>-<seq> and VAT 16% shown; the PDF is sent to the customer on WhatsApp and can be printed on a Bluetooth printer. [WS-5]
Acceptance:
- Agent code AG07, sequence 12, shows invoice number INV-AG07-12. [WS-5]
- An order of ZMW 1,000 before VAT shows VAT ZMW 160 on the invoice. [WS-5]
- The invoice PDF reaches the customer on WhatsApp and prints on a Bluetooth printer. [WS-5]
Priority: Must
Scope: Neome
Sources: WS-5
OIs: OI-38, OI-60
Proposed: no
Delivery: Custom module

### VB-10 — Product Catalog for agents

Statement: The Product Catalog shows the agent each product's image, pack size, price for this customer and the agent's stock in hand. [WS-5]
Acceptance:
- Each product shows image, pack size, the price for the customer on the visit and In Hand Qty. [WS-5]
Priority: Should
Scope: Neome
Sources: WS-5
OIs: OI-40
Proposed: no

### VB-11 — Customer prices without VAT

Statement: Item prices come from one price list per Customer Category, from SAP, without VAT; VAT 16% is added on the invoice. [WS-5]
Acceptance:
- Two customers of different Categories see different prices for the same product. [WS-5]
- The price in neome equals the SAP price list (0 mismatches). [WS-5]
Priority: Must
Scope: Neome
Sources: WS-5
OIs: OI-18
Proposed: no

### VB-12 — Visit Book offline

Statement: The Sales Agent records visits and orders with no network; they sync when online. [WS-5]
Acceptance:
- A visit and order made offline show in neome after the phone is online again. [WS-5]
Priority: Must
Scope: Neome
Sources: WS-5
OIs: OI-07
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Visit → Outlet visit with GPS tag; Order and Order Item → Beat order (traditional retail), with Order Status Placed, Invoiced, Delivered, Cancelled, credit rules by Customer Category and items limited to the agent's Executive stock set up as extra fields and rules; Payment → Collection/payment entry with the payment modes and part payment; customer price lists by Customer Category from the one catalog and price list, fed from SAP; Visit, Order and Payment sheets set up as reports with filters and Excel export (not the App's three named reports); offline capture as the App does. Invoice (number INV-<agent code>-<seq>, VAT, PDF on WhatsApp, Bluetooth print) is not in any App, so a Custom module (VB-09); invoice push to SAP is the plugin, an ERP link never Standard (VB-06, SAP-05) (proposed, to confirm)

## 13 Open Items

- OI-11: Sync timing per data type (shared with SAP, INV); the invoice part is answered [WS-5], the rest is open.
- OI-76: How long visit, order and invoice records are kept.
