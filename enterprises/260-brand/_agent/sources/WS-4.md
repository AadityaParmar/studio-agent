# WS-4 — grill-module session INV

Type: session log · Date: 2026-10-30 · File: inputs/WS-4-grill-module-session-inv.md

---

grill-module session, 260-brand/field-ops, Module INV, 2026-10-30. Consultant relaying. Present: Mitesh (Owner), Sales Head, 260 Brands; Aditya Parmar (Neomenta, Consultant).
Only what the Enterprise said. Consultant's own views are proposals + Open Items, not recorded here.

- Purpose and KPI — Mitesh (Owner): Every Sales Agent starts the day with stock assigned and ends it with unsold stock returned and counted; no order above assigned stock; no manual Excel for stock in hand.
- Pain today — Mitesh (Owner): Stock given to agents on paper; no record of what an agent holds; returns not counted; agents sell what they do not have.
- Stock sync — Mitesh (Owner), OI-09: Yes, stock sync in scope: SAP to neome only (warehouse stock), every 30 minutes. neome never writes stock to SAP.
- Sync timing — Mitesh (Owner), OI-11: Stock every 30 minutes.
- Roles and headcount — Mitesh (Owner), OI-06: 60 Sales Agents, 8 Sales Supervisors, 3 Area Sales Managers, 2 Regional Sales Managers, 1 Sales Head, 1 Owner; about 120 products, about 700 orders a day.
- Quantity and Total Amount — Mitesh (Owner), OI-32: Yes, quantity per product; Total Amount = quantity x Price.
- Stock Return — Mitesh (Owner), OI-33: Sales Agent returns unsold stock at end of day; Sales Supervisor accepts (counts) at the depot.
- Inventory item — Mitesh (Owner), OI-34: Inventory (item 33) is a depot (warehouse) stock view, read from SAP. No warehouse transactions in neome.
- Order effect — Mitesh (Owner), OI-35: Yes, an order reduces the Sales Agent Inventory. An order cannot exceed assigned stock.
- Order cancel — Mitesh (Owner), OI-36: Supervisor can cancel an order before Invoiced. Quantity goes back into the Sales Agent Inventory.
- Who assigns — Sales Head: Sales Supervisor, for own Sales Agents only; no approval needed. Tricycle Riders get no Sales Agent Inventory.
- How often — Sales Head: One assignment per Sales Agent per day (morning) and one return per day (end of day); about 60 each per day.
- Return statuses — Mitesh (Owner): Pending (agent returned, not counted), then Accepted (Sales Supervisor counted).
- Count differs — Mitesh (Owner): Sales Supervisor enters the counted quantity; the difference shows on the return; no extra approval.
- Not returned — Sales Head: Stock stays in the Sales Agent Inventory the next day.
- Offline — Mitesh (Owner), OI-07: Offline needed for visits and orders; agent sees own inventory offline and orders reduce it offline. Assigning and accepting returns need network.
- Reports — Mitesh (Owner), OI-53: Stock in hand report, Sales Supervisor and above; filters date, area, supervisor, agent, product; Excel export. Depot stock also for Sales Supervisor and above.
- System of record — Mitesh (Owner), OI-10: SAP is system of record for products and prices; SAP wins on clash. Sales Agent Inventory stays in neome, not sent to SAP.
- Notifications — Mitesh (Owner): No extra push for stock; only the OI-61 events.
- Priority — Mitesh (Owner): Yes to all Requirements as proposed.
