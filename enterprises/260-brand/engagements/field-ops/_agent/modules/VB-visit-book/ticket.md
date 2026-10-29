---
status: open
prefix: VB
name: Visit Book
draft: true
blockedBy: []
---

# VB — Visit Book

Name: Visit Book

## 1 Purpose and KPIs

- Purpose: Record customer visits by field staff, place orders, take payment and make the invoice that goes to SAP. [RFP-1, IN-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Adds visits, places orders, collects payments | | [RFP-1] |
| Sales Supervisor | Manages orders | | [RFP-1] |

## 3 Process

- Sales Agent: Add Visit (select Beat, select Customer) → Add Products (Product Master) → End. [RFP-1]
- Sales Agent: Place Order (customer from assigned Beat, item from assigned inventory) → Order Sheet/Report; then Take Payment → Payment Sheet. [RFP-1]
- Sales Agent: Add Visit → Visit Sheet/Report. [RFP-1]
- New order placed in neome → invoice generated in neome → plugin sends invoice data to SAP → invoice visible in SAP. [RFP-1, IN-1]
- Daily Visits, Order Book and Product Catalog marked Completed in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Visit | Date | date | yes | | [RFP-1] |
| Visit | Visited By | person | yes | | [RFP-1] |
| Visit | Route | link-to-entity | no | Auto fill from Beat. Links to: Route | [RFP-1] |
| Visit | Beat | link-to-entity | yes | Links to: Beat | [RFP-1] |
| Visit | Customer | link-to-entity | yes | Links to: Customer | [RFP-1] |
| Visit | Location | text | no | Auto | [RFP-1] |
| Visit | Remarks | text | no | | [RFP-1] |
| Visit | Images | file | no | | [RFP-1] |
| Visit | Products | link-to-entity | no | Added via Add order button. Links to: Product | [RFP-1] |
| Visit | Amount collected | money | no | | [RFP-1] |
| Visit | Change to be given | money | no | if any | [RFP-1] |
| Visit | Order Status | choice | no | OI-36 | [RFP-1] |

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Order Sheet/Report | | Orders | [RFP-1] |
| Payment Sheet | | Payments taken | [RFP-1] |
| Visit Sheet/Report | | Visits | [RFP-1] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| SAP | out | Order invoice | Neome team writes the plugin | [RFP-1, IN-1] |

## 11 Requirements

### VB-01 — Record a visit

Statement: A Sales Agent records a customer visit with Date, Beat, Customer, auto Location, Remarks and Images; Route fills from the Beat. [RFP-1]
Acceptance:
- A saved visit shows the agent's location captured automatically. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-39
Proposed: yes

### VB-02 — Add order in a visit

Statement: In a visit, an Add order button lets the agent add products from the Product Master. [RFP-1]
Acceptance:
- Tapping Add order lets the agent pick products and saves them on the visit. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-35, OI-40
Proposed: yes

### VB-03 — Order customer and items limits

Statement: The agent selects the order customer from the assigned Beat and items from the assigned inventory. [RFP-1]
Acceptance:
- Customers off the agent's Beats and products not in the agent's inventory cannot be picked. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### VB-04 — Take payment

Statement: The agent records the amount collected and the change to be given, if any. [RFP-1]
Acceptance:
- A visit with 1,000 owed and 1,200 collected shows 200 change to be given. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-37
Proposed: yes

### VB-05 — Order Status

Statement: Each order carries an Order Status. [RFP-1]
Acceptance:
- Order Status shows on the order and in the Order Sheet/Report. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-36
Proposed: yes

### VB-06 — Invoice to SAP

Statement: When an order is placed, an invoice is generated in neome and sent to SAP through the plugin, where it is visible. [RFP-1, IN-1]
Acceptance:
- An order placed in neome has its invoice visible in SAP after sync. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1, IN-1
OIs: OI-38, OI-11
Proposed: yes

### VB-07 — Visit, order and payment sheets

Statement: The system shows Visit Sheet/Report, Order Sheet/Report and Payment Sheet. [RFP-1]
Acceptance:
- Each sheet lists that day's entries by agent. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

## 13 Open Items

- OI-11: Sync timing for invoices.
- OI-18: Product price rules; tax.
- OI-35: Does an order reduce agent inventory?
- OI-36: Order Status values.
- OI-37: Payment modes; credit; part payment.
- OI-38: Invoice format, numbering, tax, delivery.
- OI-39: Visit without order; reason.
- OI-40: What Product Catalog shows.
