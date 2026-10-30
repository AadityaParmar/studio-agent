# Across all Modules

## Access

### GEN-01 — Role-based access control

Statement: Each user type gets role-based access for their scope. Area Sales Managers see their own area; Regional Sales Managers see their own region and approve leave escalations; Sales Head and Owner see all. The Owner alone has settings. [RFP-1, QA-1]
Acceptance:
- A Sales Supervisor can approve a leave escalation. [QA-1]
- An Area Sales Manager sees only their own area's modules and has no settings or user admin. [QA-1]
- A Regional Sales Manager sees only their own region and has no settings. [QA-1]
- A Sales Head sees all data and reports and can set targets, with no settings. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
Proposed: no

### GEN-02 — Owner full access

Statement: The Owner has full access to all modules, analytics and settings. [RFP-1]
Acceptance:
- The Owner can open every module, report and setting. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### GEN-03 — Area Sales Manager full access

Statement: The Area Sales Manager has access to all modules in their own area, without settings or user admin. The Owner alone has settings. [RFP-1, QA-1]
Acceptance:
- The Area Sales Manager can open each module for their own area only. [QA-1]
- The Area Sales Manager cannot open settings or manage users. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
Proposed: no

- Sales Agent and Tricycle Rider are Employees. [QA-1]
- "Supervisor" means Sales Supervisor; "Admin" means Owner. [QA-1]
- Quality Manager can see all complaints and change their status, with no other access. [QA-1]

## Localisation

- Currency is ZMW (Zambian Kwacha). The app is in English; NLP voice also supports Nyanja. [QA-1]

## Hosting

- Neome cloud is fine; there is no data residency rule. Users log in by mobile number and OTP. [QA-1]

## Migration

### GEN-04 — Load existing SAP data

Statement: Existing SAP data is loaded to neome through the plugin at start: customers (about 4,000), products (about 120), employees (about 100) and open balances per customer; no order history. [RFP-1, IN-1, WS-14]
Acceptance:
- After the first load, the customers, products, employees and open balances of SAP are all in neome. [WS-14]
- No SAP order history is in neome. [WS-14]
Priority: Must
Scope: Neome
Sources: RFP-1, IN-1, WS-14
OIs: OI-12
Proposed: no

## Training

- Field staff get two on-site sessions at Lusaka depot. Supervisors and managers get train-the-trainer and short videos, one week before go-live. [QA-1]

## Support

- A Change Request lets a Sales Agent request a customer detail change; a Sales Supervisor approves it before it is sent to SAP. [WS-6, QA-1]
- Neomenta supports Mon–Sat, 08:00–18:00 CAT by WhatsApp and email. 260 Brands IT admin is first line. [QA-1]

## Other

### GEN-05 — Mobile-responsive for field teams

Statement: The app works well on smartphones and tablets for field teams. [RFP-1]
Acceptance:
- Every field form can be filled on a phone screen without sideways scrolling. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### GEN-06 — Real-time updates

Statement: Data entered in the field shows to supervisors in real time. [RFP-1]
Acceptance:
- An order placed by an agent shows in the supervisor's Order Sheet/Report within a minute. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-07
Proposed: yes

- RFP-1 marks 16 of 34 items Completed in an old pilot app that is being dropped. This BRD covers all 34 items; all will be built new in neome. [RFP-1, QA-1]
- Headcount: 60 Sales Agents, 25 Tricycle Riders, 8 Sales Supervisors, 3 Area Sales Managers, 2 Regional Sales Managers, 1 Sales Head and 1 Owner. About 4,000 customers, 120 products, 90 beats and 15 routes; about 1,200 visits and 700 orders per day. [QA-1]
- BRD signers: Mitesh (Owner, 260 Brands) and Khushal (Neomenta). [QA-1]
- Field visits, orders and attendance work offline and sync when online. [WS-5, QA-1]
