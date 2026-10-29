---
status: open
prefix: INV
name: Inventory
draft: true
blockedBy: []
---

# INV — Inventory

Name: Inventory

## 1 Purpose and KPIs

- Purpose: Supervisors assign product inventory to Sales Agents, who sell from it; stock returns and stock sync with ERP. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Supervisor | Assigns products to Sales Agents | | [RFP-1] |
| Employee | Manages assigned inventory | | [RFP-1] |
| Sales Agent | Sells items from assigned inventory | | [RFP-1] |

## 3 Process

- Supervisor: Assign Inventory (select employee, select products) → Sales Agent Inventory. [RFP-1]
- Sales Agent selects items from the assigned inventory when placing an order. [RFP-1]
- Stock Assignment marked Completed; Stock Return and Inventory marked Pending in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Assign Inventory | DateTime | date | yes | | [RFP-1] |
| Assign Inventory | Employee | person | yes | | [RFP-1] |
| Assign Inventory | Products | link-to-entity | yes | Multi select. Links to: Product | [RFP-1] |
| Assign Inventory | Total Amount | money | no | OI-32 | [RFP-1] |

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| ERP / SAP | both | Stock details; see SAP-04 | Neome team writes the plugin | [RFP-1] |

## 11 Requirements

### INV-01 — Assign inventory to a Sales Agent

Statement: A Sales Supervisor assigns products (multi select from Product Master) to an employee with date-time and Total Amount, making the Sales Agent Inventory. [RFP-1]
Acceptance:
- After assignment, the agent sees the assigned products in their inventory. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-32
Proposed: yes

### INV-02 — Sell from assigned inventory

Statement: A Sales Agent selects order items from their assigned inventory. [RFP-1]
Acceptance:
- Products not assigned to the agent cannot be added to the agent's order. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-35
Proposed: yes

### INV-03 — Stock Return

Statement: The system supports Stock Return. [RFP-1]
Acceptance:
- A returned item leaves the Sales Agent Inventory. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-33
Proposed: yes

## 13 Open Items

- OI-09: Is stock sync in scope (missing in IN-1)?
- OI-32: Quantities; how Total Amount is worked out.
- OI-33: Stock Return process.
- OI-34: Meaning of "Inventory" scope item.
- OI-35: Does an order reduce agent inventory?
