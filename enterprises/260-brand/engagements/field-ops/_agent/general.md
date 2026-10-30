# Across all Modules

## Access

### GEN-01 — Role-based access control

Statement: Each user type gets role-based access for their scope. Area Sales Managers see their own area; Regional Sales Managers see their own region and approve leave escalations; Sales Head and Owner see all. The Owner alone has settings. [RFP-1, QA-1]
Acceptance:
- A Sales Supervisor can approve a leave escalation. [QA-1]
- A Quality Manager can view all Complaints and change their status, with no other access. [QA-1]
- "Supervisor" means Sales Supervisor; "Admin" means Owner. Sales Agents, Tricycle Riders and Sales Supervisors are Employees. [QA-1]
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


## Localisation

### GEN-07 — Currency and languages

Statement: Use ZMW (Zambian Kwacha), an English app, and Nyanja voice input for NLP. [QA-1]
Acceptance:
- Orders, payments and invoices use ZMW. (proposed, to confirm)
- The app uses English; NLP voice input supports English and Nyanja. (proposed, to confirm)
Priority: TBC
Scope: Neome TBC
Sources: QA-1
OIs: OI-67
Proposed: yes

## Hosting

### GEN-08 — Hosting and login

Statement: Run on Neome cloud with mobile number and OTP login; no data residency rule applies. [QA-1]
Acceptance:
- Users log in with mobile number and OTP. (proposed, to confirm)
- Data is hosted on Neome cloud with no residency constraint. (proposed, to confirm)
Priority: TBC
Scope: Neome TBC
Sources: QA-1
OIs: OI-68
Proposed: yes

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

### GEN-09 — Training

Statement: Train field staff and supervisors/managers one week before go-live. [QA-1]
Acceptance:
- Field staff get two on-site sessions at Lusaka depot; supervisors and managers get train-the-trainer and short videos. (proposed, to confirm)
Priority: TBC
Scope: Neome TBC
Sources: QA-1
OIs: OI-69
Proposed: yes

## Support

### GEN-10 — Support

Statement: Neomenta provides support Mon–Sat, 08:00–18:00 CAT by WhatsApp and email; 260 Brands IT admin is first line. [QA-1]
Acceptance:
- Support is available in the stated hours and channels. (proposed, to confirm)
Priority: TBC
Scope: Neome TBC
Sources: QA-1
OIs: OI-70
Proposed: yes

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
- Field visits, orders and attendance work offline and sync when online. [WS-5, QA-1]
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### GEN-11 — Full implementation scope

Statement: This BRD covers all 34 RFP-1 scope items; all will be built new in neome because the old pilot app is being dropped. [RFP-1, QA-1]
Acceptance:
- All 34 RFP-1 scope items are included for new implementation. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-01
Proposed: no

### GEN-12 — Field operations sizing

Statement: The solution supports about 100 field and management staff, about 4,000 customers, 120 products, 90 Beats, 15 routes, 1,200 visits and 700 orders per day. [QA-1]
Acceptance:
- It supports the stated users, master counts and daily visit/order volumes. (proposed, to confirm)
Priority: TBC
Scope: Neome TBC
Sources: QA-1
OIs: OI-06
Proposed: yes
