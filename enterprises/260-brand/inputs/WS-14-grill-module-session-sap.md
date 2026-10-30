grill-module session, 260-brand/field-ops, Module SAP, 2026-10-30. Consultant relaying. Present: Mitesh (Owner), Sales Head, 260 Brands; Aditya Parmar (Neomenta, Consultant).
Only what the Enterprise said. Consultant's own views are proposals + Open Items, not recorded here.

- SAP system — Mitesh (Owner), OI-08: SAP Business One 10.0 (HANA); Service Layer REST API available; our SAP partner gives the credentials.
- Stock sync — Mitesh (Owner), OI-09: Stock sync is in scope, SAP to neome only (warehouse stock), every 30 minutes. neome never writes stock to SAP.
- System of record — Mitesh (Owner), OI-10: SAP is system of record for customers, products, prices and employees. On a clash, SAP wins.
- Sync timing — Mitesh (Owner), OI-11: Customers, products and employees SAP to neome every 30 minutes. Stock every 30 minutes. Invoices neome to SAP at once (near real time), retry on failure.
- Initial load — Mitesh (Owner), OI-12: Initial load from SAP: customers (about 4,000), products (about 120), employees (about 100), open balances per customer. No order history.
- Customer Code — Mitesh (Owner), OI-16: Customer Code comes from SAP (CardCode). A customer added in neome gets a temporary code until SAP returns the CardCode.
- Checks before SAP — Mitesh (Owner), OI-65: New customers need Sales Supervisor approval before they are pushed to SAP. Products and employees made in neome by the Owner are pushed direct.
- Change Requests — Mitesh (Owner), OI-13: A Change Request is a Sales Agent asking to change customer details (address, phone, GEO); the Sales Supervisor approves; then it is pushed to SAP.
- SAP owner — Mitesh (Owner), OI-74: Chanda Mwila (IT Manager, 260 Brands) owns SAP and the link on our side.
- Closing stock — Mitesh (Owner), OI-48: Closing stock is report only; not sent to SAP.
- Goal and KPI — Mitesh (Owner): Customers, products, employees, prices and depot stock in neome match SAP within 30 minutes; every invoice in SAP within minutes; 0 price mismatches.
- Pain today — Mitesh (Owner): Masters are kept in Excel, out of sync with SAP; invoices are keyed by hand in SAP, late.
- Plugin settings — Mitesh (Owner): Only the Owner sets the sync frequency in the dashboard. Chanda Mwila owns the SAP side.
- Prices, credit limits, open balances — Mitesh (Owner): They come from SAP with the customer and product sync, every 30 minutes.
- Sync statuses — Mitesh (Owner): Waiting to sync, Synced, Failed. Failed is retried each cycle until Synced.
- Sync fails — Mitesh (Owner): If SAP rejects a record it shows Failed with the SAP message; the Owner sees it in the dashboard; no other notification; neome keeps working.
- SAP down — Mitesh (Owner): neome keeps working; changes and invoices wait and go when SAP is back; the invoice shows Waiting to sync.
- Reports — Mitesh (Owner): No reports; a sync log in the dashboard (record, time, status) for the Owner.
- Volumes — Mitesh (Owner): About 4,000 customers, 120 products, 100 employees; about 700 invoices a day.
- Priority — Mitesh (Owner): All Must, except the sync log, which is Should. Yes to all Requirements as written.
- Roles — Mitesh (Owner): Owner sets the plugin in the dashboard (1 person). Sales Supervisors (8) approve new customers. Chanda Mwila (IT Manager) owns SAP and the link.
