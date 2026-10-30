# WS-5 — grill-module session VB

Type: session log · Date: 2026-10-30 · File: inputs/WS-5-grill-module-session-vb.md

---

grill-module session, 260-brand/field-ops, Module VB, 2026-10-30. Consultant relaying. Present: Mitesh (Owner), Sales Head, 260 Brands; Aditya Parmar (Neomenta, Consultant).
Only what the Enterprise said. Consultant's own views are proposals + Open Items, not recorded here.

- Purpose and KPI — Mitesh (Owner): Every visit recorded on the Beat with GPS; every order has an invoice made in neome and in SAP within minutes; 0 price mismatches between neome and SAP; no paper order books.
- Pain today — Mitesh (Owner): Orders and visits on paper; prices wrong on orders; invoices made late by hand in SAP; no proof the agent was at the shop.
- Roles and headcount — Mitesh (Owner), OI-06: 60 Sales Agents, 8 Sales Supervisors, 3 Area Sales Managers, 2 Regional Sales Managers, 1 Sales Head, 1 Owner; about 4,000 customers, about 120 products, about 90 Beats; about 1,200 visits and 700 orders a day.
- Who uses Visit Book — Mitesh (Owner): Sales Agents only; Tricycle Riders use Marketing Visit.
- Offline — Mitesh (Owner), OI-07: Yes, offline needed for visits, orders, attendance; sync when online.
- Order and stock — Mitesh (Owner), OI-35: Yes, an order reduces Sales Agent Inventory; an order cannot exceed assigned stock.
- Order Status — Mitesh (Owner), OI-36: Placed, Invoiced, Delivered; Cancelled. Agent delivers from van at once for van sales (Placed, Invoiced, Delivered in the same visit). Supervisor can cancel before Invoiced.
- Who moves Order Status — Mitesh (Owner): Sales Agent makes the invoice and marks Delivered; Sales Supervisor cancels before Invoiced.
- Payment — Mitesh (Owner), OI-37: Cash, Mobile Money (Airtel/MTN), Bank Transfer, Cheque. Credit allowed for Category A and B only, up to the credit limit from SAP. Part payment allowed.
- Credit above limit — Mitesh (Owner): Order cannot be placed on credit above the limit; agent takes payment or cuts the order.
- Invoice — Mitesh (Owner), OI-38: Invoice made in neome, number INV-<agent code>-<seq>, VAT 16% shown, PDF sent on WhatsApp and printable on a Bluetooth printer. Pushed to SAP.
- Invoice sync — Mitesh (Owner), OI-11: Invoices neome to SAP at once (near real time, retry on failure). Failed push is retried; agent is not blocked; shown as Waiting to sync.
- Prices — Mitesh (Owner), OI-18: One price list per Customer Category (from SAP). Prices exclude VAT; VAT 16% added on invoice.
- Visit without order — Mitesh (Owner), OI-39: No order needed. A no-order visit must pick a reason: Shop closed, Stock enough, No money, Owner not there, Other.
- Product Catalog — Mitesh (Owner), OI-40: Shows product image, pack size, price for this customer, agent's stock in hand.
- Customers on order — Mitesh (Owner): Agent sees all customers of own mapped Beats; today's planned Beat first.
- Change to be given — Mitesh (Owner): Shown when amount collected is more than the order total.
- Reports and audience — Mitesh (Owner): Sales Agent sees own entries; Sales Supervisor and above see all, in Visit Sheet, Order Sheet, Payment Sheet.
- Closed orders — Mitesh (Owner): A Delivered or Cancelled order cannot be changed.
- Editing a visit — Mitesh (Owner): Sales Agent can edit a saved visit the same day only.
- Integrations — Mitesh (Owner), OI-60: WhatsApp Business +260 97 000 0000 via neome's provider, 260 Brands pays; invoice PDF to customers. SAP owner: Chanda Mwila (IT Manager) [OI-74].
- Language and currency — Mitesh (Owner), OI-67: ZMW; app in English only.
- Retention — Mitesh (Owner): Don't know how long visit, order and invoice records must be kept.
- Requirements — Mitesh (Owner): Yes to all, as proposed.
- Push — Mitesh (Owner), OI-61: Push to the Sales Agent when an order is cancelled.
- Report filters — Mitesh (Owner), OI-53: Filters date, area, supervisor, agent, beat, product; export to Excel.
