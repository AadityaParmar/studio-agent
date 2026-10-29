# RFP-1 — 260 Brands BRD 2.0

Type: BRD · Date: 2025-09-14 · File: inputs/RFP-1-brd-2-0.docx

---

Business Requirements Document

(260 Brands)

Date: Sept 14, 2025

Lead Owner: Mitesh                                                     Client Name: 260 Brands

Prepared by: Khushal                                                   Signature: _______________

## 1. Overview

To implement a custom solution for 260 Brands that digitizes and streamlines their operations across Attendance, Inventory, Sales, Visit Tracking, Complaint Handling, and Payment Collection. The system will provide a centralized platform for daily field activities, sales processes, and customer interactions. Real-time updates, role-based access, and reporting tools will ensure smooth business operations.

## 2. App Story

The system for 260 Brands will serve as a digital backbone for their field operations—tracking attendance, order flow, stock allocation, payments, and customer visits. Employees and supervisors will manage tasks in real-time with a mobile-ready, role-based interface and dynamic report generation.

## 3. Targeted Users

Owner – Full access to all modules, analytics, and settings.

Sales Supervisor – Assign beats/products, manage orders, monitor performance.

Employee – Clock in/out, apply for leave, manage assigned inventory.

Sales Agent – Place orders, collect payments, generate lead, log visits and complaints.

Tricycle Rider – Record marketing visits only.

Area Sales Manager – Full access to all modules

Regional Sales Manager –

Sales Head

## 4. Scope Of Work

- This section outlines the scope of work for the development and integration of various modules with current status.

| No. | Requirement | Current Status |
|---|---|---|
| 1 | Customer Master | Completed |
| 2 | Product Master | Completed |
| 3 | Employee Master | Completed |
| 4 | Store Master | Completed |
| 5 | Customer GEO Tagging | Completed |
| 6 | Employee Attendance | Completed |
| 7 | Daily Visits | Completed |
| 8 | Beat Planning | Completed |
| 9 | Order Book | Completed |
| 10 | Product Catalog | Completed |
| 11 | Customer Complain Tickets | Completed |
| 12 | Modern Trade (Closing stock) | Completed |
| 13 | Stock Assignment | Completed |
| 14 | Stock Return | Pending |
| 15 | Sales Reports | Completed |
| 16 | Visit Reports | Completed |
| 17 | Debt VS Collection | Pending |
| 18 | Total VS Productive VS Non-Productive calls | Pending |
| 19 | Target VS Achieved Sales | Pending |
| 20 | ERP/SAP Integration | Pending |
| 21 | Performance, Efficiency Dashboards, Target & Incentive Structure | Pending |
| 22 | AI Based Planogram Suggestions | Pending |
| 23 | Customer Master Heat Map | Pending |
| 24 | Market Specific Communication | Pending |
| 25 | Database Push Notifications | Pending |
| 26 | Ask Neome | Pending |
| 27 | Schools | Pending |
| 28 | Farms | Pending |
| 29 | D2D - Nurtamilk | Pending |
| 30 | Leave Management | Pending |
| 31 | Change Requests | Pending |
| 32 | Feedback | Pending |
| 33 | Inventory | Pending |
| 34 | Notice Board | Pending |

## 5. Modules and Forms

### 5.1  Employee Master

Stores employee contact details, assigned beat, and leave balances for HR.

Employee

Mobile Number

Email

Address

Beat (Multi Select) (From Beat Master)

Casual Leave Balance

Sick Leave Balance

Total Leave Balance (Casual + Sick)

[image: flow diagram 'Employee Master'. Actor: Owner. Start → Add Employee (Select Beat from Beat Master) → Employee Master → End]

### 5.2  Customer Master

- Captures all necessary customer details used for order processing and visit planning.

Customer Code

Entered By

Name

TPIN

Beat (From Beat Master)

Route (Auto fill from Beat)

Category

Classification

Location

Bill To

Ship To

Email

Mobile Number

Shop Owner

Shop Buyer

Image

[image: flow diagram 'Customer Master'. Actor: Owner. Start → Add Customer (Select Beat from Beat Master) → Customer Master → End]

### 5.3  Product Master

Maintains product catalog details for order entry and inventory tracking.

Image

Product Code

Product

Case Size

Category (From Category Master)

Price

[image: flow diagram 'Product Master'. Actor: Owner. Start → Add Product → Product Master → End]

### 5.4  Beat Master

Defines sales beat linked with respective routes for order and visit assignment.

Entered By

Beat

Route (From Route Master)

[image: flow diagram 'Beat Master'. Actor: Owner. Start → Add Beat (Select Route from Route Master) → Beat Master → End]

### 5.5  Route Master

Lists of sales routes.

Route

[image: flow diagram 'Route Master'. Actor: Owner. Start → Add Route → Route Master → End]

### 5.7  Store Master

List of stores for modern trade.

Store name

Store supervisor

Email

Supervisor mobile number

Area name

Location

### 5.6  Category Master

Product categorization used in the product master.

Category

### 5.6  Competitor Master

- Centralized repository of competitor product data

- Competitor name

- Products

- Image

- Product Code

- Product

- Case Size

- Category (From Category Master)

[image: flow diagram 'Competitor'. Actor: Sales Agent. Start → Add Visit → Add Products (from Product Master) → End]

### 5.7  Attendance Module

Records clock-in/out times along with camera verification.

Employee

Clock In

In Camera

Clock Out

Out Camera

Arrival Status (OnTime/Late)

[image: flow diagram 'Attendance Module'. Actor: Employee. Start → Add Attendance → Attedance Sheet/Report → End]

### 5.8  Overtime Module

Records clock-in/out times along with camera verification.

Date

Employee

From Time

To Time

Remarks

Status

[image: flow diagram (no title). Actor: Employee. Start → Add overtime → Overtime sheet/report → End]

### 5.9  Leave Module

Allows employees to apply for casual/sick leave with automatic balance checks.

Employee

Casual/Sick Leave Balance (Auto)

Leave For (Full Day/Half Day)

Type Of Leave (Casual Leave/Sick Leave)

From Date

To Date

Leave Reason

Status (Pending/Approved/Rejected)

[image: flow diagram 'Leave Module'. Actor: Employee. Start → Apply Leave → (Pending) Goes to supervisor for approval → Approved: Update Leave Balance → Leave Sheet; Rejected: → Leave Sheet → End]

### 5.10  Assign Inventory

This module allows supervisors to assign product inventory to sales agents.

DateTime

Employee

Products (Multi Select) (From Product Master)

Total Amount

[image: flow diagram 'Assign Inventory'. Actor: Supervisor. Start → Assign Inventory (Select Employee from Employee Master; Select Product from Product Master) → Sales Agent Inventory → End]

### Visit Book

This module records customer visits done by sales or marketing staff for tracking interactions and outcomes.

Date

Visited By

Route (Auto fill from beat)

Beat (From Beat Master)

Customer (From Customer Master)

Location (Auto)

Remarks

Images

Add order button

On clicking add order, add products (from product master)

Amount collected

Change to be given (if any)

Order Status

[image: flow diagram 'Visit & Order Module'. Actor: Sales Agent. Start → Add Visit (Select Beat from Beat Master; Select Customer from Customer Master) → Add Products (from Product Master) → End]

### Customer Quality Complaint Module

This module allows agents to register customer product quality complaints for resolution tracking.

ComplaintId

Date

Customer Complaint Number

Complainant Name

Address

Mobile Number

Product

Package Size

Quantity Affected

Batch No

Production Date

Expiry Date

Operator

Shift

Nature Of Complaint

Description

Signature

Image

[image: flow diagram 'Customer Quality Complaint Module'. Actor: Sales Agent. Start → Add Compliant → Complaint Sheet/Report → End]

### Modern Trade

This module allows sales agents to submit daily modern trade updates.

Date

Employee

Store (From store master)

Check In

Upload images of shelf (5 images)

Conduct stock count gird

		Product code (products from product master)

		Shelf Stock Qty

		Backroom Qty

		Expiry Date

		Total Qty (Shelf stock Qty + Backroom Qty)

Competitor Activities (Price, Display, Promotions)

		Competitor brand (choose from competitor master)

		Prodcut name (coming from competitor master – only show those products of the brand)

		Price checkbox

		Yes - Shelf stock price

		Promo running checkbox

		Yes – Promo details

		Camera

		Camera

Summary

Check out

Supervisor name

Supervisor review

[image: flow diagram 'Modern Trade Module'. Actor: Supervisor. Start → Add Modern Trade → Modren Trade Sheet → End]

### Marketing Visit

This module records customer visits done by sales or marketing staff for tracking interactions and outcomes.

Date

Visited By

Visit type dropdown

Route (Auto fill from beat)

Beat (From Beat Master)

Customer name

Mobile number

Address

Email

Location (Auto)

Remarks

Images

[image: flow diagram 'Marketing visit'. Actor: Sales Agent. Start → Add Visit (Select Beat from Beat Master; 'Select Customer' from Route Master) → End]

### School Visit

This module records school visits done by sales or marketing staff for tracking interactions and outcomes.

Date

Visited By

Procurement officer name

School name

Mobile number

No of children

Head teacher name

Area

Location (Auto)

Images

[image: flow diagram 'School visit'. Actor: Sales Agent. Start → Add Visit → End]

### Farm Visit

This module records farm visits done by sales or marketing staff for tracking interactions and outcomes.

Date

Visited By

Visitor name

Gender

Mobile number

Area

Number of people in familt

Location (Auto)

Camera

[image: flow diagram 'Farm visit'. Actor: Sales Agent. Start → Add Visit → End]

### Door to door Visit

This module records door to door visits done by sales or marketing staff for tracking interactions and outcomes.

Date

Visited By

Visitor name

Gender

Mobile number

Area

Number of people in family

Location (Auto)

Camera

[image: flow diagram 'Door to door visit'. Actor: Sales Agent. Start → Add Visit → End]

### Feedback

This module records customer feedbacks.

Date

Entered By

Feedback

		Question

		Response

[image: flow diagram 'Feedack'. Actor: Sales Agent. Start → Record feedback → End]

### Reporting

This module allows to view custom reports.

[image: flow diagram 'Reporting'. Actor: Admin. Start → View reports → End]

### 6. Additional Features

Role-Based Access Control– Define custom permissions for each user type to ensure secure and relevant access.

WhatsApp Integration– Automate communication for order confirmations, payment updates, and complaint resolutions.

Push Notifications– Deliver both custom alerts and system-generated updates to users in real time.

Camera Integration– Enable attendance logging with photo verification.

Reports & Analytics– Auto-generate daily summaries, sales insights, visit reports, and geo-based heat maps.

AI-Driven Features– Support form filling through NLP. Provide AI based planogram suggestions.

Dashboards– Track sales performance, efficiency metrics, targets, and incentives with visual dashboards.

Mobile-Responsive Design – Ensure seamless access and usability for field teams on smartphones and tablets.

ERP/SAP Integration- Enable two-way synchronization with third-party ERP systems for customers, products, employees, stock, and invoices.

## 7. Flow Chart

[image: overall flow diagram '260 Brand'. Masters on left: Employee Master, Customer Master, Product Master, Beat Master, Route Master (feeds Beat Master), Category Master (feeds Product Master). Start branches to lanes, each 'actor: action → output', all ending at End:
  - Employee: Attedance In/Out → Attedance Sheet/Report
  - Employee: Apply Leave → Leave Sheet
  - Supervisor: Assign Beats (uses Employee Master, Beat Master) → Empoyee - Beat Mapping
  - Supervisor: Assign Products (uses Employee Master, Product Master) → Sales Agent Inventory
  - Sales Agent: Place Order (fed by Assign Beats and Sales Agent Inventory; note: 'Select customer from the assigned beat. Select item from the assigned inventory.') → Order Sheet/Report; Place Order → Take Payment
  - Sales Agent: Take Payment → Payment Sheet
  - Sales Agent: Add Visit (uses Customer Master) → Visit Sheet/Report
  - Tricycle Rider: Add Marketing Visit (uses Customer Master) → Marketing Visit Sheet
  - Sales Agent: Customer Complaints → Complaint Sheet/Report
  - Sales Agent: Modern Trade (uses Product Master) → Closing Stock Inventory
  - Sales Agent: Add Lead → Lead Sheet/Report]

## 8. SAP Integration Process

### 8.1 Customer Master

Process to sync customers from SAP to neome.

[flowchart: New customer created/modified in SAP → neome plugin fetch customer from SAP → Customer details pushed in neome via plugin → Customer visible in neome app]

Process to sync customers from neome to SAP.

[flowchart: New customer created/modified in neome → neome will send customer data to plugin → Plugin will push customer data to SAP]

- Plugin will be configured using neome dashboard.

- Neome team will write the plugin for the SAP integration part.

- Existing SAP data will also be synched to neome via plugin.

### 8.2 Product Master

Process to sync products from SAP to neome.

[flowchart: New product created/modified in SAP → neome plugin fetch product from SAP → Product details pushed in neome via plugin → Product visible in neome app]

Process to sync products from neome to SAP.

[flowchart: New product created/modified in neome → neome will send product data to plugin → Plugin will push product data to SAP]

- Data sync frequency can be configured into dashboard.

### 8.3 Stock Details

Process to sync stock details from ERP to neome.

[flowchart: Stock created/modified in ERP → neome plugin fetch stock from ERP → Stock details pushed in neome via plugin → Stock visible in neome app]

Process to sync stock details from neome to ERP.

[flowchart: New stock created/modified in neome → neome will send data to plugin → Plugin will push stock data to ERP]

- Data sync frequency can be configured into dashboard.

### 8.4 Employee Master

Process to sync employees from SAP to neome.

[flowchart: New employee created/modified in SAP → neome plugin fetch employee from SAP → Employee details pushed in neome via plugin → Employee visible in neome app]

Process to sync employee from neome to SAP.

[flowchart: New employee created/modified in neome → neome will send employee data to plugin → Plugin will push employee data to SAP]

### 8.5 Order Invoice

Process to sync order invoice from neome to SAP.

[flowchart: New order placed in neome → Invoice generated in neome → Plugin will send the invoice data to SAP → Invoice visible in SAP]

## 9. Conclusion

- This BRD outlines a complete digital transformation for 260 Brands’ field and order operations. The system will ensure data-driven oversight across employee attendance, order execution, customer interaction, and inventory monitoring.
