# Open Items

| ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source |
|---|---|---|---|---|---|---|---|---|
| OI-01 | RFP-1 scope table marks 16 items "Completed" and 18 "Pending". Does "Completed" mean already built and live? Should this BRD cover all 34 items or only the Pending ones? | All | Enterprise | Owner | | open | | |
| OI-02 | What access do Regional Sales Manager and Sales Head get? RFP-1 lists both roles with no access. | All | Enterprise | Owner | | open | | |
| OI-03 | Area Sales Manager has "full access to all modules", like the Owner. Any difference (analytics, settings)? | All | Enterprise | Owner | | open | | |
| OI-04 | Is "Supervisor" in the RFP-1 diagrams the Sales Supervisor? Is "Admin" (Reporting diagram) the Owner? | All | Enterprise | Owner | Yes to both (proposed, to confirm) | open | | |
| OI-05 | Is every Sales Agent and Tricycle Rider also an Employee (clock in/out, leave)? | All | Enterprise | Owner | | open | | |
| OI-06 | How many users per role (Sales Agents, Tricycle Riders, Sales Supervisors, managers)? Volumes: customers, products, beats, visits and orders per day? | All | Enterprise | Owner | | open | | |
| OI-07 | Must the app work offline in the field (no network), syncing later? | All | Enterprise | Sales Supervisor | | open | | |
| OI-08 | Which SAP / ERP exactly (product, version), and what API access exists? RFP-1 says both "SAP" and "third-party ERP systems". | SAP | Enterprise | Owner | | open | | |
| OI-09 | Stock sync with ERP is in RFP-1 §8.3 but not in IN-1. Is stock sync in scope, both ways? | SAP, INV | Enterprise | Owner | | open | | |
| OI-10 | Customers, products and employees can change in both SAP and neome. Which is the system of record per data type, and which change wins on a clash? | SAP, MST | Enterprise | Owner | SAP is system of record (proposed, to confirm) | open | | |
| OI-11 | How often should each data type sync (customers, products, employees, stock)? Should invoices go to SAP at once? | SAP, INV, VB | Enterprise | Owner | | open | | |
| OI-12 | Which existing SAP data loads at start (customers, products, employees, open balances, history), and how many records? | All, SAP | Enterprise | Owner | | open | | |
| OI-13 | What is "Change Requests" (RFP-1 scope item 31, Pending)? | All | Enterprise | Owner | | open | | |
| OI-14 | Customer Category and Classification: what values? | MST | Enterprise | Sales Head | | open | | |
| OI-15 | TPIN: confirm it is the tax ID, its format, and if it is required. | MST | Enterprise | Owner | | open | | |
| OI-16 | Customer Code: made by neome, typed in, or taken from SAP? | MST, SAP | Enterprise | Owner | | open | | |
| OI-17 | Who adds and edits each master? Diagrams show only the Owner; IN-1 says customers, products and employees can also be created in neome. Can Sales Agents add customers? | MST | Enterprise | Owner | | open | | |
| OI-18 | Product Price: one price per product, or prices by customer category or area? Tax on price? | MST, VB | Enterprise | Owner | | open | | |
| OI-19 | Who maintains the Competitor Master? The "Competitor" diagram shows a Sales Agent: Add Visit → Add Products from Product Master. What does that flow mean? | MST, MT | Enterprise | Sales Supervisor | | open | | |
| OI-20 | Are Stores (modern trade) also Customers in the Customer Master, or a separate list only? | MST, MT | Enterprise | Sales Head | | open | | |
| OI-21 | Customer GEO Tagging: who captures the location and when (on adding the customer, on first visit)? Who can change it? | MST | Enterprise | Sales Supervisor | | open | | |
| OI-22 | Casual and Sick Leave Balance: who sets them, yearly quota, accrual, carry forward? | MST, LEAVE | Enterprise | Owner | | open | | |
| OI-23 | Beat Planning: only Employee - Beat Mapping (beats on the Employee), or a day-wise plan of which beat on which day? | BEAT | Enterprise | Sales Supervisor | | open | | |
| OI-24 | Can one Beat be assigned to many employees at once? | BEAT | Enterprise | Sales Supervisor | | open | | |
| OI-25 | Arrival Status On Time / Late: what start time and grace period? Same for all or per employee? | ATT | Enterprise | Owner | | open | | |
| OI-26 | Camera verification on clock in/out: photo only, or face match? Is location captured too? | ATT | Enterprise | Owner | | open | | |
| OI-27 | Overtime: RFP-1 describes it with the Attendance text ("Records clock-in/out times along with camera verification"). What is Overtime for, who approves it, what Status values? | ATT | Enterprise | Owner | | open | | |
| OI-28 | What happens when an employee forgets to clock out? | ATT | Enterprise | Sales Supervisor | | open | | |
| OI-29 | Who approves leave: the employee's Sales Supervisor? Escalation if not acted on? | LEAVE | Enterprise | Owner | Employee's Sales Supervisor (proposed, to confirm) | open | | |
| OI-30 | Half Day leave takes 0.5 day from balance? Leave beyond balance allowed (unpaid)? | LEAVE | Enterprise | Owner | | open | | |
| OI-31 | Do leave days count weekly offs and holidays? Is there a holiday list? | LEAVE | Enterprise | Owner | | open | | |
| OI-32 | Assign Inventory: quantity per product? How is Total Amount worked out (quantity × Price)? | INV | Enterprise | Sales Supervisor | quantity × Price (proposed, to confirm) | open | | |
| OI-33 | Stock Return (Pending): who returns what, when (end of day?), who accepts it? | INV | Enterprise | Sales Supervisor | | open | | |
| OI-34 | "Inventory" (RFP-1 scope item 33, Pending): warehouse stock beyond Sales Agent Inventory? | INV | Enterprise | Owner | | open | | |
| OI-35 | Does an order reduce the Sales Agent Inventory? Can an order be more than the assigned stock? | INV, VB | Enterprise | Sales Supervisor | Yes; no (proposed, to confirm) | open | | |
| OI-36 | Order Status: what values, and who or what moves them (delivery, invoice)? | VB | Enterprise | Sales Supervisor | | open | | |
| OI-37 | Payment: which modes (cash, UPI, cheque)? Credit sales and part payment allowed? | VB | Enterprise | Owner | | open | | |
| OI-38 | Invoice made in neome: format, numbering, tax; given to the customer how (print, WhatsApp)? | VB, SAP | Enterprise | Owner | | open | | |
| OI-39 | Must every visit have an order? If no order, is a reason recorded? | VB, RPT | Enterprise | Sales Supervisor | | open | | |
| OI-40 | Product Catalog (RFP-1 scope item 10): what does it show Sales Agents beyond the Product Master (images, price, stock)? | VB | Enterprise | Sales Supervisor | | open | | |
| OI-41 | Lead: what fields, who follows it up, statuses, and when does a Lead become a Customer? RFP-1 has no Lead form. | LEAD | Enterprise | Sales Head | | open | | |
| OI-42 | Who does Marketing Visits: Tricycle Rider (RFP-1 §3 and overall flow chart), Sales Agent (Marketing visit diagram) or "sales or marketing staff" (form text)? | MKT | Enterprise | Sales Head | | open | | |
| OI-43 | Marketing Visit: diagram picks a customer (Beat Master, Route Master); form types Customer name, mobile, address, email. Which? Visit type values? | MKT | Enterprise | Sales Head | | open | | |
| OI-44 | School, Farm and Door to door Visits: who does them, what is their goal, and what is "D2D - Nurtamilk"? | MKT | Enterprise | Sales Head | | open | | |
| OI-45 | Farm and Door to door Visit "Visitor name": is it the person visited? Gender values? | MKT | Enterprise | Sales Head | | open | | |
| OI-46 | Who fills Modern Trade: Sales Agent (RFP-1 text and overall flow chart) or Supervisor (Modern Trade diagram)? What can Supervisor review do (approve, reject, comment)? | MT | Enterprise | Sales Head | | open | | |
| OI-47 | Modern Trade Check In / Check Out: time and location? Must the user be at the Store? | MT | Enterprise | Sales Supervisor | | open | | |
| OI-48 | Closing stock from Modern Trade: report only, or does it feed stock in SAP / ERP? | MT, SAP | Enterprise | Owner | | open | | |
| OI-49 | Customer complaint resolution: who resolves, what statuses, how fast, how is the customer told? | CMP | Enterprise | Owner | | open | | |
| OI-50 | ComplaintId and Customer Complaint Number: why both? Who gives the Customer Complaint Number? | CMP | Enterprise | Owner | | open | | |
| OI-51 | Complaint Operator and Shift (production fields): who fills them? Sales Agent in the field or the plant? | CMP | Enterprise | Owner | | open | | |
| OI-52 | Feedback: who gives it (customer?), who sets the questions, fixed list or free? Response type (rating, text)? | FB | Enterprise | Sales Head | | open | | |
| OI-53 | Reports: full list with audience, measures and filters. RFP-1 gives only names. | RPT | Enterprise | Owner | | open | | |
| OI-54 | Productive vs Non-Productive call: definition? | RPT | Enterprise | Sales Head | Productive = visit with an order (proposed, to confirm) | open | | |
| OI-55 | Targets: who sets them, per whom (agent, beat), per period, by value or quantity, per product? | RPT | Enterprise | Sales Head | | open | | |
| OI-56 | Incentive structure: what are the rules? | RPT | Enterprise | Owner | | open | | |
| OI-57 | Debt VS Collection: where does customer debt come from (SAP outstanding, neome orders)? | RPT, SAP | Enterprise | Owner | | open | | |
| OI-58 | Customer Master Heat Map: map of what (customer spread, sales, visits)? | RPT | Enterprise | Sales Head | | open | | |
| OI-59 | Market Specific Communication: what is a "market", what is sent, by whom, through which channel? | COM | Enterprise | Sales Head | | open | | |
| OI-60 | WhatsApp: which messages, to whom (customer, staff), which WhatsApp Business number and provider, who pays? | COM, VB, CMP | Enterprise | Owner | | open | | |
| OI-61 | Push notifications and Notice Board: which events alert whom? Who posts notices, to whom? | COM | Enterprise | Owner | | open | | |
| OI-62 | Ask Neome: what should users ask, and which roles get it? | AI | Enterprise | Owner | | open | | |
| OI-63 | NLP form filling: which forms, voice or text, which languages? | AI | Enterprise | Owner | | open | | |
| OI-64 | AI planogram suggestions: from what input (Modern Trade shelf images?), what output, who uses it? | AI, MT | Enterprise | Sales Head | | open | | |
| OI-65 | Customers, products and employees made in neome push to SAP. Need any check or approval before they reach SAP? | SAP, MST | Enterprise | Owner | | open | | |
| OI-66 | Who in 260 Brands signs off this BRD? RFP-1 signature line is blank. | All | Enterprise | Owner | | open | | |
| OI-67 | Which currency do orders, payments and invoices use? Which languages must the app support? No Source says. | All | Enterprise | Owner | | open | | |
| OI-68 | Hosting: neome cloud is fine? Any data residency rule? Do users log in with mobile/password, or with company SSO? | All | Enterprise | Owner | | open | | |
| OI-69 | Training: who needs it (field staff, supervisors, owner), in what form (on-site, video, train-the-trainer), and when? | All | Enterprise | Owner | | open | | |
| OI-70 | Support after go-live: who supports users, in which hours, through which channel? | All | Enterprise | Owner | | open | | |
| OI-71 | Masters: what goes wrong today with the master lists, and which number shows success (KPI)? No Source says. | MST | Enterprise | Owner | | open | | |
| OI-72 | Master records: do they get Active / Inactive status instead of delete? When a Beat is made inactive or moved to another Route, what happens to its Customers and Employees? | MST | Enterprise | Owner | Active / Inactive; inactive hidden from pick lists, linked records keep history (proposed, to confirm) | open | | |
| OI-73 | Which master lists or exports do you need (for example Customers by Beat)? | MST | Enterprise | Owner | Sheet per master, filter by Beat / Route / Category, export to Excel (proposed, to confirm) | open | | |
| OI-74 | Who in 260 Brands owns SAP and the link to neome on your side? | MST, SAP | Enterprise | Owner | | open | | |
| OI-75 | Confirm the proposed priority, Scope tag and acceptance criteria of: MST-01, MST-02, MST-03, MST-04, MST-05, MST-06, MST-07, MST-08 | All | Enterprise | Owner | As proposed in the BRD (proposed, to confirm) | open | | |
