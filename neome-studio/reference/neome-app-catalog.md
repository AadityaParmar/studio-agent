# Neome App catalog reference

Research for design ticket 01 (Neome App catalog reference), shipped as is. Read by `grill-module` (App hints) and `neome-mapping` (App + Delivery). Paths under `../sources/` point at the research scrape, not shipped.
Purpose: the mapping step reads this file to propose a **Neome App** + **Delivery** (Standard / Configuration / Custom module) for each Enterprise **Module**. Every Neome mapping it produces is indicative and "proposed by Neomenta, to confirm".

**Sources.** neome.ai public site, scraped to `../sources/neome-site/` (page text `txt/`, HTML `raw/`, FAQ answers taken from each page's FAQPage JSON-LD in `raw/`). The sitemap and the App list were re-checked live on 2026-10-28 (WebFetch of https://www.neome.ai/sitemap.xml). Mapping heuristics come from `../sources/examples/petrostar-crm-proposal.txt` (Neomenta RFP response to Petro Star, Oct 2026).

**Conventions.**
- `[inference]` marks anything not stated on the source page.
- Each App section uses the same headings, so `grep -n "^## App:"` lists the Apps and `grep -n "Entities:"` lists their entities.
- App IDs are the URL slugs (`https://www.neome.ai/app/<id>`).
- Record codes such as `QT-2041` come from the site's demo mock-ups. They show the prefix convention only, not real numbering rules `[inference]`.
- On the site the Apps are called "modules" ("25+ modules"). In this repo's language they are **Neome Apps**, and **Module** means the Enterprise-side group of requirements.

**Count note.** The sitemap has 31 `/app/` entries, but `whatsapp-inquiry-management` appears twice, so there are **30 unique Apps**. The ticket's "31" comes from that duplicate. All 30 are covered below. No other App pages exist on the public site.

---

## 0. App index

| # | App | App ID | Home-page category | Commercial model |
|---|-----|--------|--------------------|------------------|
| 1 | CRM | `crm` | Sales & Customers | Per-user plan |
| 2 | Lead Management | `lead-management` | Sales & Customers | Per-user plan |
| 3 | WhatsApp Inquiry Management | `whatsapp-inquiry-management` | (top nav "WhatsApp Inbox") | Per-user plan |
| 4 | Product Catalog & Inquiry | `product-catalog` | Sales & Customers | Per-user plan |
| 5 | Quotation & Order Flow | `quotation-and-order-flow` | Sales & Customers | Per-user plan |
| 6 | Appointment Booking | `appointment-booking` | Sales & Customers | Per-user plan |
| 7 | Support Chat & Customer Portal | `support-chat-and-customer-portal` | (top nav) | Per-user plan |
| 8 | Ticketing & Task Management | `ticketing-and-task-management` | Work, Tasks & Collaboration | Per-user plan |
| 9 | Project Management | `project-management` | Work, Tasks & Collaboration | Per-user plan |
| 10 | Approval Workflows | `approval-workflows` | Work, Tasks & Collaboration | Per-user plan |
| 11 | Knowledge Library | `knowledge-library` | Work, Tasks & Collaboration | Per-user plan |
| 12 | Inventory & Stock Management | `inventory-and-stock-management` | Operations & Supply | Per-user plan |
| 13 | Purchase Management | `purchase-management` | Operations & Supply | Per-user plan |
| 14 | Product Lifecycle Management | `product-lifecycle-management` | Operations & Supply | Per-user plan |
| 15 | Manufacturing | `manufacturing` | Production & Quality | Per-user plan |
| 16 | Quality Control | `quality-control` | Production & Quality | Per-user plan |
| 17 | Machine / Tools Maintenance | `machine-tools-maintenance` | Service & Maintenance | Per-user plan |
| 18 | AMC & Service Management | `amc-and-service-management` | Service & Maintenance | Per-user plan |
| 19 | Field Visit Management | `field-visit-management` | Service & Maintenance | Per-user plan |
| 20 | Gate Pass Management | `gate-pass-management` | Service & Maintenance | Per-user plan |
| 21 | Field Service | `field-service` | (not grouped; [inference] Service & Maintenance) | Per-user plan |
| 22 | Employee Directory | `employee-directory` | Team & HR | Per-user plan |
| 23 | Recruitment | `recruitment` | Team & HR | Per-user plan |
| 24 | Attendance & Leave | `attendance-and-leave` | Team & HR | Per-user plan |
| 25 | Expense Management | `expense-management` | Team & HR | Per-user plan |
| 26 | E-Learning | `e-learning` | Learning & Engagement | Per-user plan |
| 27 | Internal Community Forum | `internal-community-forum` | Learning & Engagement | Per-user plan |
| 28 | Event Management | `event-management` | Learning & Engagement | Per-user plan |
| 29 | Vehicle & Driver Management | `vehicle-and-driver-management` | (vertical) | Licensed + implementation, demo only |
| 30 | FMCG Field Sales & Distribution | `fmcg-field-sales-and-distribution` | (vertical) | Licensed + implementation, demo only |

Source for categories: home page "Modules" section (https://www.neome.ai). Source for commercial model: Lead Management page ("There is no separate charge for this module... ₹299 / $9.99 per user / month"), and the Vehicle & Driver and FMCG pages ("Quoted to your operation, not off a price list", "Licence plus a one-time implementation").

---

## 1. Platform-wide building blocks

These apply across Apps. The quoted wording is Neome's own. A Requirement that one of these covers is usually Standard or Configuration, not Custom module `[inference]`.

| Building block | What the site says (Neome's wording) | Source |
|---|---|---|
| **Sheet** | "Lead sheet: Search, filter, sort and page through every lead"; "Appointment sheet"; "Kanban or sheet view". | /app/crm, /app/lead-management, /app/appointment-booking |
| **Forms** | "One form, six labelled sections"; "add a missing value without leaving the form"; "role-specific visit forms"; "structured outcome forms". Mandatory fields are marked `*`. | /app/crm, /app/fmcg-field-sales-and-distribution, /app/field-visit-management |
| **Kanban** | "Deals sit as cards under the stage they have actually reached... Drag a card to move the deal. Every column totals what it is holding." Inquiry board New/In Progress/Closed. | /app/crm, /app/whatsapp-inquiry-management |
| **Master lists** | "Eight lists, and you own all of them... An admin edits them directly" (Account type, Industry type, Territory, Payment terms, Opportunity stage, Activity type, Employee, Lost reasons). Stages come from a master list ("rename them, reorder them or add your own"). | /app/crm |
| **Bulk data insert** | "Open the lead sheet, choose Bulk data insert from the sheet menu, pick your Excel file and map each column... Headers that already match are mapped for you, and mandatory fields... are flagged before the import runs." Also catalog "Bulk import" (default tax applied per row). | /app/crm, /app/product-catalog |
| **Bulk update** | "Filter, select many rows, set one field across all"; "fields you leave blank are not touched". | /app/crm, /app/lead-management |
| **Approvals: chains, value bands, multi-level** | "Approval chains are configured per request type and value band"; "Multi-level: One signature or three, by rule"; approver comments, rejection reasons, full audit trail. Routable: "a purchase request, a discount above a limit, a price revision, a stock adjustment, leave or an expense claim". | /app/approval-workflows |
| **Escalation and delegation** | "A request unanswered past its threshold escalates to the next approver"; "Approvers can delegate while away, with the delegation recorded on every request". Attendance & Leave and Expense: "Escalation and delegation work the same way they do elsewhere on the platform." | /app/approval-workflows, /app/attendance-and-leave, /app/expense-management |
| **Governance (maker-checker)** | "Built-in governance: a Won opportunity cannot be approved by the person who raised it" (CRM); "a lead conversion cannot be approved by the person who raised it" (Lead Management). | /app/crm, /app/lead-management |
| **Role-based discount/limit rules** | Discount limits per role at line and document level (exec 5%, manager 12%, head any); expense category limits validated at submission. | /app/quotation-and-order-flow, /app/expense-management |
| **Automations: reminders, nudges** | "Inactivity nudges, reminders and auto-raised tasks"; "No contact for 7 days: Amit was nudged"; task reminders "before the date"; appointment confirmation + day-before + hour-before reminders; pending-approval reminders ("Approvals chase themselves"). | /app/crm, /app/lead-management, /app/ticketing-and-task-management, /app/appointment-booking, /app/purchase-management |
| **Automations: SLA and escalation** | "Response times are configured by category and priority"; "escalates to the manager before the deadline"; "Overdue rules". AMC/Field Service SLA from contract terms. | /app/ticketing-and-task-management, /app/amc-and-service-management, /app/field-service |
| **Automations: auto-close** | "Auto-close after the customer confirms" (tickets); "Completed orders close themselves" (manufacturing work orders). | /app/ticketing-and-task-management, /app/manufacturing |
| **Automations: record generation** | Activity → dated next step + Pending task "in the same send"; lead conversion writes account + contact + opportunity; quote → order "in one step"; PO "generated on approval"; ECO "issued on approval"; AMC visits generated from contract frequency; onboarding checklist raised on new joiner; onboarding courses auto-assigned on joining. | various App pages |
| **Threshold alerts** | Low-stock (reorder level, safety stock), budget utilisation, rejection-rate thresholds, renewal alerts, outdated-article flags, document expiry. | /app/inventory-and-stock-management, /app/project-management, /app/purchase-management, /app/quality-control, /app/amc-and-service-management, /app/knowledge-library, /app/vehicle-and-driver-management |
| **Roles and scopes** | "Role-based access: Executive, manager and admin see different scopes" (CRM, Lead, Quotation, Inventory, Purchase). Other App role sets: Requester/approver/admin; Author/approver/viewer/admin; HR/manager/employee/admin; Agent/manager/customer/admin; Employee/manager/HR/admin; Admin/HR/learner; Product/operations/admin. Home: "Role-based access control across every module". PetroStar adds field-level permissions, 2FA, audit logs, export controls. | App pages, /about, PetroStar proposal |
| **Effective dating and versioning** | Price revisions with effective date and history; employee changes "effective-dated, never overwritten"; BOM and product versions; article versions. | /app/product-catalog, /app/employee-directory, /app/manufacturing, /app/product-lifecycle-management, /app/knowledge-library |
| **Audit trail** | "Full audit trail: Who, what, when, permanently" (approvals); "Audit trail: Who asked, who approved, what changed" (purchase); "Full history: Every status change, with its author" (tickets). | /app/approval-workflows, /app/purchase-management, /app/ticketing-and-task-management |
| **Dashboards / reports** | Every App page has a "Reporting" section with three named reports and "Set a date range and every figure below it is bounded by those dates." Pricing lists "Real-time dashboards"; Enterprise adds "Advanced analytics". | every /app/ page, /pricing |
| **Chat-first / team chat** | "Sales talk: Team chat with @mentions, inside the CRM"; assignment notification delivered as a card in the owner's chat; "Internal chat support: The field team asks the office inside the app". Home: "a simple, WhatsApp-like experience". | /app/crm, /app/fmcg-field-sales-and-distribution, home |
| **Mobile** | Nearly every App lists "Mobile apps: Android and iOS, with the same records". Home: "Mobile at the core"; "Approve tasks and requests instantly". Compare page: "Platforms: Web, mobile, and desktop". | App pages, home, /compare/neome-vs-odoo |
| **Offline** | Home: "Works offline, so visits, orders, and tasks sync automatically once you're back online." Stated per App for Field Visit Management, Attendance & Leave and FMCG ("full offline capture"). | home, /app/field-visit-management, /app/attendance-and-leave, /app/fmcg-field-sales-and-distribution |
| **GPS / location** | "Track field teams live with daily visits and travel on a map"; "Visit logged... GPS verified". Field Visit: location recorded at check-in/out only, "not continuously". FMCG: "GPS-verified attendance". Vehicle: IoT live location. Compare: "Built-in live location tracking for field teams". | home, /app/field-visit-management, /app/fmcg-field-sales-and-distribution, /app/vehicle-and-driver-management, /compare/neome-vs-odoo |
| **Photo capture** | Receipt photo (Expense), item photo (Gate Pass), QC photos, repair photos (Field Service, AMC), shelf photo (FMCG), visit photo (Field Visit). | App pages |
| **Signature** | "Digital sign-off: The customer signs on site" (Field Service, AMC); "Rental agreement: Signed on the tablet" (Vehicle). | /app/field-service, /app/amc-and-service-management, /app/vehicle-and-driver-management |
| **AI features** | Home "AI Inside Neome": Conversational AI (WhatsApp, email, web), Smart Classification, Workflow Automation, Contextual Search & Answers, Business Memory, "Connects via MCP". App-level: AI lead agent (sourcing, enrichment, fit score, drafted messages); WhatsApp Inquiry/General classifier ("Connect OpenAI for AI-powered inquiry detection"). About: "An LLM reasoning engine embedded into every layer". | home, /about, /app/crm, /app/whatsapp-inquiry-management |
| **Integrations** | Home: "Email integration, WhatsApp integration, Slack integration, Other integrations on demand"; FAQ: "first-class integrations for email, WhatsApp, and Slack... any AI agent using the Model Context Protocol (MCP)". CRM: Email, WhatsApp, LinkedIn on the record; email campaigns. Vehicle: IoT telematics. Attendance: export for payroll. Pricing Enterprise: "Custom workflows & integrations". PetroStar: "Neome connects to SAP through APIs... scope and quote it separately". | home, /pricing, App pages, PetroStar |
| **Customer-facing surfaces** | Customer portal (tickets, orders, past chats, start chat); customer-facing knowledge articles via portal; driver app (wallet, top-up, complaints). | /app/support-chat-and-customer-portal, /app/knowledge-library, /app/vehicle-and-driver-management |
| **Custom modules** | Home "Customization": "Build custom modules when your workflow needs something specific: Custom modules for your process; Tailored workflows and fields; Business-specific screens". Compare: "No-code config of fields, workflows, and views"; "tailor fields, statuses, views, and workflows without writing code". | home, /compare/neome-vs-odoo |
| **Template store** | "A template store. Ready-to-use blueprints that can be cloned, customized and shipped quickly"; "a curated module store"; "Community developers get an advanced studio, full development tools, and managed payments"; "Contributors own templates, plugins and domain expertise". Blog/vision content only; no store page or listing exists on the public site. | /blog/community-driven-automation, /blog/exponential-growth-blueprint |
| **Security / editions** | ISO 27001, SOC 2 Type II, GDPR; isolated customer environments; encryption in transit and at rest. Standard ₹299/$9.99 per user per month, min 5 users, 15-day trial; Enterprise adds custom workflows and integrations, dedicated account manager, advanced analytics, priority SLA support. | /pricing, /about, home FAQ |

---

## 2. Apps

## App: CRM

- **App ID:** `crm`
- **Category:** Sales & Customers (home page grouping)
- **URL:** https://www.neome.ai/app/crm
- **Fits when:** B2B teams where a deal takes weeks and several meetings; manufacturers/distributors selling through dealers, retailers, stockists; field sales needing the record on a phone; pipelines currently on spreadsheets, WhatsApp threads and memory. Scales "about 10 to 10,000 people"; Standard self-serve, Enterprise for custom workflows, integrations, SLA. Not a fit: teams whose system of record is a custom Salesforce build; teams wanting only a static contact list.
- **Entities:** Lead (`L213`, "system lead id"); Account; Contact person (many per account, one primary); Opportunity; Activity; Task (`TASK105`); Email campaign; Employee (master).
- **Key fields:** Lead form has "six labelled sections": company name*, contact person*, mobile, account type, industry type, lead source (incl. "AI Agent"), campaign, attachment (enquiry mail / visiting card), assigned to, next step. Lead import mandatory: lead date, company name, contact person. Contact: designation, primary-contact flag. Opportunity: name, stage, expected value, expected closure date, payment terms, lost reason. Activity: date (prefilled, cannot be backdated), done by (prefilled), activity type, what was discussed*, follow-up required?, add as task?, next follow-up.
- **Master lists (8, admin-editable, shipped values):** Account type (Distributor, Dealer, Retailer, Stockist, Trader, Manufacturing, Partner, Enterprise, Direct Customer); Industry type (Construction, Pharmaceutical, Dairy & Food, Chemicals & Petrochemicals, Logistics & Supply); Territory (city/state/country); Payment terms (Advance, 7/30/60/90 days credit); Opportunity stage; Activity type (Call, Email, Meeting, Site Visit, WhatsApp, SMS, Video Call); Employee (role, manager, active status); Lost reasons (Budget, Competitor, Timeline, No response).
- **Statuses / flows:** Lead status ... → Converted (lead counters: new, open, follow-up, converted). Conversion routes: "Account with Contact and Opportunity" or "Account with Contact Only"; lead id stays traceable. Opportunity stages (default): Qualification → Requirement Study → Demo / Presentation → Quotation Sent → Negotiation → Order Confirmation; ends Won or Lost (with lost reason). Task: Pending (other task statuses not stated). Pipeline as kanban or sheet view.
- **Roles:** Organisation admin (all modules, master data, all three dashboards, bulk import/assign); Sales executive (own leads, opportunities, activities, tasks, CRM chat); Sales manager (adds team visibility and reassignment).
- **Automations and rules:** Assignment sends "New Lead Assigned" card to owner's CRM chat; only active employees can be owners; activity with follow-up raises a dated next step + Pending task in the same send; inactivity nudges, reminders, auto-raised tasks; AI lead agent sources prospects, converts inbound enquiries to leads, enriches, scores ("fit score"), drafts opening message and follow-up; email campaign one-time or scheduled; bulk update (filter, select rows, set one field; one notification per lead).
- **Approvals:** Governance rule: "a Won opportunity cannot be approved by the person who raised it."
- **Reports:** 1) Lead Dashboard (new/open/follow-up/converted, funnel by status, lead ageing, channel conversion, owner load); 2) Sales Executive Performance (per-exec leads, conversions, opportunities, open pipeline, revenue won, activity mix, worklist by days open); 3) CRM Performance (open pipeline, revenue won, conversion rate, value by stage, value by exec, ageing deals, lost reasons). Date-range bounded.
- **Integrations:** Email, WhatsApp and LinkedIn against the record; team chat ("Sales talk") with @mentions; Bulk data insert from Excel (column mapping); Android/iOS apps.
- **Links to other Apps:** Lead Management (qualified lead carries into CRM); WhatsApp Inquiry Management (enquiries feed the same queue); Quotation & Order Flow (opportunity links to quotation raised against it).

## App: Lead Management

- **App ID:** `lead-management`
- **Category:** Sales & Customers (home page grouping)
- **URL:** https://www.neome.ai/app/lead-management
- **Fits when:** More enquiries than can be called in a day: inside sales desks, marketing-led businesses running multi-channel campaigns, SMEs whose leads live in a spreadsheet and a WhatsApp thread; where "deciding who to call next actually matters".
- **Entities:** Lead; Activity (call, meeting, email, note); Follow-up task; Lead source (admin-owned list); Territory. No ID pattern shown on page (CRM page uses `L213`).
- **Key fields:** Company name*, contact person*, mobile number, city, lead source (Website, Referral, Exhibition, Walk-in, Cold call, Campaign; add missing value inline), territory, assign to, score, next step (dated), qualification notes.
- **Statuses / flows:** New → Contacted → Qualified → Converted (funnel stages).
- **Roles:** Executive, manager, admin ("see different scopes").
- **Automations and rules:** Rule-based scoring set by admin (source weight, replied within 24h, budget confirmed, territory fit), scored on arrival and re-scored on change; worklist default-sorted by score; assignment by territory on capture or by hand, with instant notice; inactivity alert (e.g. "No contact for 7 days": owner nudged, manager can see); dated reminders; follow-up tasks raised from an activity; bulk update.
- **Approvals:** Governance: "a lead conversion cannot be approved by the person who raised it."
- **Reports:** 1) Lead performance (stage counts, conversion between stages, drop-off); 2) Source performance (volume vs conversion per source); 3) Executive performance (leads held, response times, conversions, worklist by days open). Dashboards: funnel, source performance, lead ageing.
- **Integrations:** Import existing leads (FAQ "Can I import the leads I already have?"); Android/iOS.
- **Links to other Apps:** CRM ("Qualified leads carry straight into the CRM"; separate modules, usable alone or together); related: Appointment Booking, Quotation & Order Flow.

## App: WhatsApp Inquiry Management

- **App ID:** `whatsapp-inquiry-management`
- **Category:** Not in home page grouping; listed in top nav as "WhatsApp Inbox" next to Sales apps. Inference: Sales & Customers.
- **URL:** https://www.neome.ai/app/whatsapp-inquiry-management
- **Fits when:** Customers message on WhatsApp rather than fill a form: distributors/traders in busy supplier groups, retailers/service businesses taking orders in 1:1 chats, sales/support teams where enquiries compete with group chatter. Single owner or a team sharing one inbox.
- **Entities:** Synced chat/group; Message (tagged Inquiry or General); Inquiry (board card). No ID pattern shown.
- **Key fields:** Chat/group name, message, AI tag (Inquiry / General), status, reply.
- **Statuses / flows:** Inquiry: New → In Progress → Closed.
- **Roles:** Admin (listening controls from "admin panel"); team seats sharing one inbox ("A seat each").
- **Automations and rules:** AI classifies every synced message as Inquiry or General ("nothing to configure"; setup guide mentions "Connect OpenAI for AI-powered inquiry detection"); listening controls: all groups / selected groups / none, 1:1 chats toggled separately.
- **Approvals:** None stated.
- **Reports:** 1) Inquiry against general; 2) Open queue by status; 3) Volume by group.
- **Integrations:** WhatsApp linked "the same way WhatsApp Web does" (scan, keep existing number, "no waiting on API approvals"); two-way reply delivered from business number; OpenAI connection for detection; Android/iOS.
- **Links to other Apps:** CRM (CRM handles owner, follow-up, conversion; separate modules); Lead Management; Support Chat & Customer Portal.

## App: Product Catalog & Inquiry

- **App ID:** `product-catalog`
- **Category:** Sales & Customers (home page grouping, as "Product Catalog & Inquiry")
- **URL:** https://www.neome.ai/app/product-catalog
- **Fits when:** More than one team needs the same product info and each keeps its own copy (sales, stores, finance); distributors, manufacturers, traders with a range large enough for categories and prices that change often.
- **Entities:** Product (`PRD-1042`); Category (multi-level parent/child tree); Price revision; Activation log entry.
- **Key fields:** Product code*, product name*, category*, unit, product type (e.g. Finished goods), stock item (Yes/No), cost price, selling price, tax rate (GST in India / sales tax elsewhere), status (Active).
- **Statuses / flows:** Product: Active / retired (deactivated, logged). Price revision: Proposed → Approved (waiting on approver), effective from a set date; earlier quotes keep old price.
- **Roles:** Not detailed; "someone without the authority" proposes, someone with it approves (inference: proposer / price approver / admin).
- **Automations and rules:** Effective-date pricing; default tax applied to every imported row; stock vs non-stock classification excludes services from stock counts.
- **Approvals:** Price revisions run through an approval workflow before applying.
- **Reports:** 1) Performance by category; 2) Price revision history; 3) Active and retired lines.
- **Integrations:** Bulk import from Excel (column mapping, mandatory flags); Android/iOS.
- **Links to other Apps:** Feeds Quotation & Order Flow (lines inherit price and tax) and Inventory & Stock Management (counts stock items); related Purchase Management. "Usually the first module set up."
- **Note:** The "Inquiry" half of the name is not described on the page. PetroStar maps "Enquiry / RFQ" to "Product Catalog and Inquiry" as Standard.

## App: Quotation & Order Flow

- **App ID:** `quotation-and-order-flow`
- **Category:** Sales & Customers (home page grouping)
- **URL:** https://www.neome.ai/app/quotation-and-order-flow
- **Fits when:** Sales teams that quote before they sell (distributors, manufacturers, traders): priced document, negotiation, order must match; more than one person quotes.
- **Entities:** Quotation (`QT-2041`); Quotation line; Sales order (`SO-1188`); Discount approval.
- **Key fields:** Quotation: customer, contact, lines (item, qty, rate, amount), subtotal, discount (line and document level), tax, total, validity (e.g. 15 days), payment terms. Order: lines carried, discount, tax, payment terms / credit days, shipping method, shipping cost, delivery status, quote id.
- **Statuses / flows:** Quotation: (draft) → Accepted (expired when validity lapses; "Quotations by stage" implies more stages). Order: Confirmed → In production → Dispatched → Delivered.
- **Roles:** Executive, manager and admin scopes. Default discount limits: Sales executive up to 5%, Sales manager up to 12%, Head of sales any.
- **Automations and rules:** Lines priced from catalog; auto totals/tax; tax rate from product; discount limits per role at line and document level ("cannot be dodged by splitting"); one-step quote → order carrying everything; quote id traceable on order.
- **Approvals:** Over-limit discount routes automatically to the approver for that depth with reason recorded; quote waits until signed off. Approval history kept.
- **Reports:** 1) Quote to order; 2) Discount given; 3) Committed value.
- **Integrations:** None named on page.
- **Links to other Apps:** Product Catalog (prices, tax); CRM (opportunity links to quotation); related FMCG Field Sales & Distribution.

## App: Appointment Booking

- **App ID:** `appointment-booking`
- **Category:** Sales & Customers (home page grouping)
- **URL:** https://www.neome.ai/app/appointment-booking
- **Fits when:** Work happens at an agreed time with a customer: sales demos, service site visits, clinics, consultancies; more than one person takes bookings.
- **Entities:** Appointment; Service type; Time slot; Holiday calendar; Reschedule entry. No ID pattern shown.
- **Key fields:** Customer (linked), company, service, duration, slot, assigned to, phone, status, reschedule from/to/reason.
- **Statuses / flows:** Scheduled → Completed / Cancelled / No-show.
- **Roles:** Sales and support teams (own appointments); Managers (reassign across team); Organisation admins (configure services, slots, holiday calendar; see everything).
- **Automations and rules:** Taken slot never offered twice; per-service duration and handling team; holiday calendar closes days; confirmation on booking, reminder 1 day before (with reschedule link), final reminder 1 hour before; reschedule notifies customer and executive and logs history.
- **Approvals:** None stated.
- **Reports:** 1) Today and upcoming; 2) No-show analysis; 3) Executive load.
- **Integrations:** Reminder channel not named. Android/iOS.
- **Links to other Apps:** Booking sits on the customer record (inference: CRM account/contact); related CRM, Lead Management, Field Visit Management.

## App: Approval Workflows

- **App ID:** `approval-workflows`
- **Category:** Work, Tasks & Collaboration (home page grouping)
- **URL:** https://www.neome.ai/app/approval-workflows
- **Fits when:** Decisions need more than one person and currently go by email: purchases above a threshold, discounts, leave, expenses, document releases; approver not in the same room.
- **Entities:** Request (e.g. Capital purchase `PR-1904`); Approval chain (per request type and value band); Delegation; Approval step / comment.
- **Key fields:** Request type, requester, amount, current stage, waiting on, approver comments, rejection reason, timestamps.
- **Statuses / flows:** Raised → Approved (per level) / Waiting / Rejected. Example chain: up to small amount = 1 level (department head); above = 2 levels (department head, then finance); capital spend = 2 levels (finance, then director).
- **Roles:** Requester, approver, admin.
- **Automations and rules:** Chains chosen by request type and value band; approver alerts on arrival; requester notified at each step; escalation after threshold (e.g. "Escalates after 2 days") to next approver; delegation for a period, recorded on every request.
- **Approvals:** This is the platform approval engine. Routable items: purchase request, discount above limit, price revision, stock adjustment, leave, expense claim.
- **Reports:** 1) Pending approvals (by approver and age); 2) Turnaround time (by type and value band); 3) Escalation frequency.
- **Integrations:** Android/iOS ("Approve from anywhere").
- **Links to other Apps:** Approval is "a step in that work" raised elsewhere on the platform (Purchase, Quotation, Product Catalog, Inventory, Attendance & Leave, Expense). Related Ticketing, Project Management, Expense Management.
- **Note:** Page also shows a document mock (Draft → In review → Published, versions v2/v3) which belongs to Knowledge Library-style document release; not explained on this page.

## App: Support Chat & Customer Portal

- **App ID:** `support-chat-and-customer-portal`
- **Category:** Not in home page grouping; in top nav with Sales apps. Inference: Sales & Customers / service.
- **URL:** https://www.neome.ai/app/support-chat-and-customer-portal
- **Fits when:** Teams answering the same customers repeatedly: distributors/manufacturers supporting dealers and retailers, service businesses with ongoing contracts; questions usually relate to an existing order, invoice or job.
- **Entities:** Chat session (customer-linked); Saved reply (template); Ticket (`TKT-3312`, shared with Ticketing); Customer portal user (customer contact); linked Order (`SO-1188`).
- **Key fields:** Ticket: customer, assigned to, linked order, source (Live chat), status, conversation. Session: customer, agent, waiting time.
- **Statuses / flows:** Ticket: In progress → Closed (others not stated). Chat → ticket "when it needs work that outlasts the conversation".
- **Roles:** Agent, manager (live queue, monitor session without joining, per-agent performance), customer (portal, role-based per contact), admin.
- **Automations and rules:** Sessions assigned to a named agent; saved replies fill context (e.g. order number) from the conversation; ticket raised automatically from chat carrying customer, conversation, order ref; portal chats land in same queue.
- **Approvals:** None stated.
- **Reports:** 1) Open load; 2) First response time; 3) Who is asking most.
- **Integrations:** Customer portal (self-service); Android/iOS. WhatsApp via WhatsApp Inquiry Management "bringing the conversation in".
- **Links to other Apps:** Ticketing & Task Management (same ticket queue); CRM (the chat customer "is the account in the CRM"); Quotation & Order Flow (order history in portal); WhatsApp Inquiry Management; Knowledge Library (related).

## App: Ticketing & Task Management

- **App ID:** `ticketing-and-task-management`
- **Category:** Work, Tasks & Collaboration (home page grouping, as "Task Management & Ticketing")
- **URL:** https://www.neome.ai/app/ticketing-and-task-management
- **Fits when:** Stream of issues that must be resolved by someone specific within an agreed time: internal support desks, quality and operations teams, service organisations; work currently arriving in a group chat. Handles internal work and customer issues (separate categories/SLAs).
- **Entities:** Ticket (`TKT-4417`); Task (ticket-linked); Category; SLA rule.
- **Key fields:** Ticket: raiser (customer or colleague), company, priority (High/Normal), category, title, assigned to, SLA left, tasks. Task: title, owner, due date, status (Done / Today / overdue).
- **Statuses / flows:** Ticket: Assigned → In progress → resolved → auto-closed after customer confirms; "Full history: every status change, with its author". A ticket closes when its tasks do.
- **Roles:** Not listed explicitly; owner/assignee, manager (escalation target), raiser. (Inference: requester, agent, manager, admin.)
- **Automations and rules:** SLA by category and priority (examples: Quality issue High 4 hours; Quality issue Normal 1 working day; Access request Normal 2 working days); escalation to manager before breach (e.g. at 30 minutes remaining); overdue rules; task reminders before due date; auto-close on customer confirmation.
- **Approvals:** A ticket/task needing a decision routes through Approval Workflows.
- **Reports:** 1) Open and breaching; 2) Resolution time; 3) Backlog and compliance.
- **Integrations:** Android/iOS.
- **Links to other Apps:** Support Chat & Customer Portal (shared ticket queue); Approval Workflows; Project Management; Knowledge Library. CRM also raises tasks (`TASK105`).
- **Note:** The page's "Escalation" section shows a project mock (Ahmedabad plant rollout, milestones, budget, hours) that belongs to Project Management.

## App: Knowledge Library

- **App ID:** `knowledge-library`
- **Category:** Work, Tasks & Collaboration (home page grouping)
- **URL:** https://www.neome.ai/app/knowledge-library
- **Fits when:** How things are done lives with a few experienced people: support teams answering repeat questions, operations teams with procedures, frequent onboarding; also an outward self-service library for customers.
- **Entities:** Article; Category; Version; Rating; Search log (failed searches). No ID pattern shown.
- **Key fields:** Title, author, category, status, version, reviewer/approver ("Reviewed and released by"), audience, rating, views, change note per version.
- **Statuses / flows:** Draft → In review → Published; versions kept (v2, v3 live); outdated flag after a review period you set.
- **Roles:** Author, approver, viewer, admin. Audiences scoped by role: Internal teams (procedures, specs, handovers), Field technicians (work instructions only), Customers (how-to articles via the portal).
- **Automations and rules:** Articles not reviewed within a set period flagged outdated; failed searches captured.
- **Approvals:** Approver releases article before it goes live.
- **Reports:** 1) Article ratings; 2) Searches with no result; 3) Most viewed.
- **Integrations:** Customer portal exposure; Android/iOS.
- **Links to other Apps:** Support Chat & Customer Portal (agents point at articles; portal shows customer articles); related Internal Community Forum, Ticketing & Task Management, E-Learning.

## App: Project Management

- **App ID:** `project-management`
- **Category:** Work, Tasks & Collaboration (home page grouping)
- **URL:** https://www.neome.ai/app/project-management
- **Fits when:** Defined work with a client, a budget and a deadline: implementation/rollout teams, engineering and construction projects, agencies, professional services; several projects at once.
- **Entities:** Project (client-linked); Milestone; Task; Time log; Project expense; Budget. No project ID pattern shown.
- **Key fields:** Project name, client, duration, project manager, budget, start, end, milestones (name, date, % progress), task owner/due date/status, hours logged, spend by type (Labour, Materials, Travel), forecast overrun.
- **Statuses / flows:** Project health e.g. "On track"; milestone met / not; task status across workflow (Done / due / overdue).
- **Roles:** One named project manager per project; task owners. Other roles not stated.
- **Automations and rules:** Reminders before task due dates; spend accrues from logged labour and booked expenses; budget threshold alerts (e.g. forecast overrun raised at 80% utilisation).
- **Approvals:** None stated on page (related: Approval Workflows).
- **Reports:** 1) Active projects; 2) Budget utilisation; 3) Overdue tasks. Plus portfolio view.
- **Integrations:** Android/iOS.
- **Links to other Apps:** Ticketing & Task Management (shared task concept; queue vs plan); Expense Management (expenses booked to project); Approval Workflows.

## App: Inventory & Stock Management

- **App ID:** `inventory-and-stock-management`
- **Category:** Operations & Supply (home page grouping)
- **URL:** https://www.neome.ai/app/inventory-and-stock-management
- **Fits when:** Distributors, manufacturers, retailers, any business holding stock in more than one place ("value rises sharply with the second warehouse").
- **Entities:** Item (from Product Catalog); Warehouse; Location (storage within a warehouse); Stock ledger entry; Goods receipt (`GRN-2208`); Issue (against sales order `SO-1188`); Transfer; Adjustment.
- **Key fields:** Item: category, unit, reorder level, safety stock, quantity per warehouse. GRN: vendor, ordered, received, rejected, status (Accepted). Adjustment: reason (e.g. damage in handling), qty, raised by, approver.
- **Statuses / flows:** GRN: Accepted (ledger updated in same step). Transfer: out → In transit → in. Adjustment: waiting on approval → applied.
- **Roles:** Executive, manager and admin scopes; operations manager approves adjustments.
- **Automations and rules:** Ledger updates only from movements (receipt adds, issue subtracts, transfer moves, approved adjustment corrects), each with cause; low-stock alert on falling below reorder level or safety stock.
- **Approvals:** Stock adjustments need approval (operations manager) before touching the ledger.
- **Reports:** 1) Stock valuation (by warehouse and category); 2) Fast against slow moving; 3) Inventory ageing.
- **Integrations:** Android/iOS (count from the floor).
- **Links to other Apps:** Purchase Management (GRN raised against PO); Quotation & Order Flow (sales order issues stock); Product Catalog (item source); related PLM, Manufacturing.

## App: Purchase Management

- **App ID:** `purchase-management`
- **Category:** Operations & Supply (home page grouping)
- **URL:** https://www.neome.ai/app/purchase-management
- **Fits when:** Manufacturers, distributors, operations-led businesses where more than one department buys and someone answers for the total.
- **Entities:** Purchase request (`PR-1904`); Purchase order (`PO-4412`); Vendor (vendor master); Vendor rating; Invoice (`INV-8821`); Department budget.
- **Key fields:** PR: raised by, department, item, quantity, needed by, reason, budget left. PO: value, vendor. Vendor: contact, payment detail, terms (e.g. 30 d), orders count, delivery rating, quality rating, preferred flag. Invoice: amount vs PO, discrepancy.
- **Statuses / flows:** PR raised → approved → PO generated and released automatically → received (GRN) → invoice matched / held for review. PO status "by stage from released to received".
- **Roles:** Executive, manager and admin scopes; department approver.
- **Automations and rules:** Budget per department visible while raising; utilisation alerts near limit; PO generated only on approval; pending approvals chased automatically; vendor ratings from orders placed; invoice matched against PO and receipt, mismatch held.
- **Approvals:** Purchase request approval chain by department and value.
- **Reports:** 1) Purchase order status; 2) Spend by department; 3) Committed against paid.
- **Integrations:** None named.
- **Links to other Apps:** Inventory & Stock Management (GRN against PO updates ledger); Product Catalog (items); Approval Workflows (PR-1904 shown as capital purchase example); related PLM, Gate Pass Management. Audit trail: who asked, approved, what changed.

## App: Product Lifecycle Management

- **App ID:** `product-lifecycle-management`
- **Category:** Operations & Supply (home page grouping)
- **URL:** https://www.neome.ai/app/product-lifecycle-management
- **Fits when:** Manufacturers and product-led businesses where a spec change must be acted on by several departments; regulated industries needing to show why a change was made.
- **Entities:** Product version (v3.1, v4.0); Change request (`CR-0342`); Engineering change order (`ECO-0119`); Impact assessment; Department notification.
- **Key fields:** Version number, change reason, approver; CR: product, from/to version, reason, owner ("raised by"), waiting on, impact per department (Production, Purchase, Stores, Quality); ECO: status, implementation/effective date, carried out by, departments notified.
- **Statuses / flows:** CR: raised → waiting on approver → Approved. ECO: Approved → ECO issued → Departments notified → Implemented (In progress). One version live at a time.
- **Roles:** Product, operations and admin scopes; CR owner; approver; ECO executor.
- **Automations and rules:** ECO issued on approval; affected departments notified automatically when ECO is issued.
- **Approvals:** Version releases only on approval; CRs go through approval workflow.
- **Reports:** 1) Active changes; 2) Pending approvals; 3) Version history.
- **Integrations:** None named.
- **Links to other Apps:** Product Catalog and Inventory (same product record); related Manufacturing, Purchase Management.

## App: Manufacturing

- **App ID:** `manufacturing`
- **Category:** Production & Quality (home page grouping)
- **URL:** https://www.neome.ai/app/manufacturing
- **Fits when:** Small and mid-sized manufacturers making to order or to stock, material accounting needed, more than one work centre; shop floor reports on paper today. "Not an MES for a fully automated plant."
- **Entities:** Bill of materials (`BOM-118`, versions v2–v4); Work order (`WO-2290`); Work centre (e.g. Moulding line 2); Output/rejection record; Material consumption/variance.
- **Key fields:** BOM: product, active version, component quantities per unit. WO: product, planned qty, produced, rejected, work centre, supervisor, schedule, stage. Consumption: BOM expected, actually issued, variance. Work centre: capacity, utilisation.
- **Statuses / flows:** Work order moves through stages (e.g. In progress; completed orders auto-close). BOM: one active version, others in history.
- **Roles:** Supervisor (named on WO); plant manager. Not detailed otherwise.
- **Automations and rules:** Material deducted from stock automatically as output is recorded; variance vs BOM raised during the run; capacity-based scheduling checks; delay alerts for overdue work orders; auto-close of completed orders.
- **Approvals:** None stated (QC batch hold decision shown, see Quality Control).
- **Reports:** 1) Production output; 2) Work in progress; 3) Machine utilisation.
- **Integrations:** Android/iOS (record output at the machine).
- **Links to other Apps:** Inventory & Stock Management (consumption moves ledger); Product Catalog (BOM components are catalog items); Purchase Management (shortfall triggers purchasing); Quality Control (inspections attach to same records); Machine & Tools Maintenance (related).

## App: Quality Control

- **App ID:** `quality-control`
- **Category:** Production & Quality (home page grouping)
- **URL:** https://www.neome.ai/app/quality-control
- **Fits when:** Manufacturers and procurement-heavy businesses inspecting material on arrival, output before dispatch, or both; quality today "lives in a register and a WhatsApp photo".
- **Entities:** Inspection parameter set / QC checklist (per item, Incoming or in-process); Inspection (against GRN `GRN-2208` or work order); Rejection (defect class, qty); Supplier quality record.
- **Key fields:** Parameter, tolerance range (e.g. Moisture max 0.3%, Melt flow index 6 to 9, Contamination nil, Bag weight ±0.5%); measured value; pass/fail per parameter; inspector; remarks; photos; rejected qty; defect class; decision (Return or rework).
- **Statuses / flows:** Inspection: Pass / Failed → batch held → decision (return or rework) by owner. QC before dispatch can be mandatory (dispatch blocked until pass).
- **Roles:** Inspector (on record); decision owner (quality/purchase manager). Not otherwise detailed.
- **Automations and rules:** Failed batch held (cannot be issued to production until decided); rejection threshold alerts; optional mandatory QC before dispatch; supplier rejection rate computed from receipts.
- **Approvals:** Return/rework decision on a held batch (decision step, not explicitly an approval chain).
- **Reports:** 1) Rejection rate; 2) Supplier quality; 3) Defect trend.
- **Integrations:** Android/iOS (photos at receiving bay).
- **Links to other Apps:** Purchase Management / Inventory (inspections on GRNs; rejection adjusts what stores can issue); Manufacturing (in-process checks on work orders); related Machine & Tools Maintenance.

## App: Machine / Tools Maintenance

- **App ID:** `machine-tools-maintenance`
- **Category:** Service & Maintenance (home page grouping, as "Machine/Tools Maintenance")
- **URL:** https://www.neome.ai/app/machine-tools-maintenance
- **Fits when:** Output depends on machines staying available: plants with lines, workshops with tooling, plant/equipment operators; downtime has a nameable cost per hour.
- **Entities:** Asset (asset register: machines and tools by line and plant, e.g. "Injection Moulder IM-04"); Preventive maintenance plan; Maintenance work order (`WO-1183`); Spare part (issued from stock); Asset history.
- **Key fields:** Asset: line, status (Running/Down), availability, downtime, cost this year. Plan: trigger (every N hours and/or monthly), checklist, technician. Breakdown WO: description, reported time, downtime, technician, root cause. Spare: cost, issued against WO, reorder level.
- **Statuses / flows:** Asset Running / Down; WO under repair → closed (not detailed).
- **Roles:** Technician (assigned); not otherwise detailed.
- **Automations and rules:** Plan fires on date or running hours, whichever first, raising task with checklist and technician; critical spare reorder alerts; cost per asset from labour + parts.
- **Approvals:** None stated.
- **Reports:** 1) Availability; 2) Downtime by reason; 3) Cost per asset.
- **Integrations:** Android/iOS. (How running hours are captured, e.g. meter reading vs IoT, is not stated.)
- **Links to other Apps:** Inventory (spares issued from stock); AMC & Service Management (that is for customer-owned machines under contract); related Manufacturing, Quality Control.
- **Note:** Work order prefix `WO-` is shared with Manufacturing (`WO-2290`) and home page ("Work order WO-208").

## App: AMC & Service Management

- **App ID:** `amc-and-service-management`
- **Category:** Service & Maintenance (home page grouping)
- **URL:** https://www.neome.ai/app/amc-and-service-management
- **Fits when:** Businesses selling an ongoing service commitment: equipment/machinery service companies, manufacturers supporting what they sold, facilities/building services contractors; more contracts than one person can track.
- **Entities:** AMC contract (`AMC-0471`); Covered asset (e.g. "Compressor CP-210"); Site; Preventive visit; Corrective/breakdown service call (`SR-2290`); Parts used.
- **Key fields:** Contract: customer, status (Active), assets, sites (multi-site, multi-asset), contract value, covered (e.g. Parts and labour), excluded (e.g. Consumables), preventive visits per year, response time (e.g. within 8 working hours), resolution time, renewal date, visits used. Visit: technician, checklist. Service call: checklist steps, photo, customer sign-off, parts issued from stores.
- **Statuses / flows:** Contract Active → renewal. Visits done / due. Service call: On site → signed off.
- **Roles:** Technician; service manager (escalation target). Not otherwise detailed.
- **Automations and rules:** Visit schedule generated from contract frequency; technician assignment with checklist; SLA (response/resolution) from contract terms; escalation to service manager before breach; renewal alerts "well before" expiry with visit history and SLA record.
- **Approvals:** None stated.
- **Reports:** 1) Visit compliance; 2) SLA compliance; 3) Contract profitability.
- **Integrations:** Android/iOS (checklist, photos, parts, on-phone customer signature).
- **Links to other Apps:** Field Service (contract customers' requests handled in the same queue, SLA from contract); Inventory (parts issued from stores); Machine & Tools Maintenance (own machines vs customer machines); related Vehicle & Driver Management. PetroStar maps After-Sales (complaints, warranty, replacement) to "AMC and Service, Ticketing" as Standard.

## App: Field Visit Management

- **App ID:** `field-visit-management`
- **Category:** Service & Maintenance (home page grouping)
- **URL:** https://www.neome.ai/app/field-visit-management
- **Fits when:** Sales and service teams working at the customer's premises: field sales calling on retailers/distributors, account managers with territories, routine service calls; team too large for a manager to know everyone's day.
- **Entities:** Visit; Week/day plan; Territory; Check-in/out; Outcome form; Follow-up. No ID pattern shown.
- **Key fields:** Rep, territory, city, customer, priority (High/Medium/Low), purpose (e.g. Contract review), planned time, check-in time, time on site, location verified, outcome (e.g. Quote requested), value in play, notes, follow-up date, photos.
- **Statuses / flows:** Visit: Planned → On site → Done. Week plan "Approved by" a manager.
- **Roles:** Rep; manager (approves plan, sees live status).
- **Automations and rules:** Clash detection while planning; location recorded at check-in and check-out only (not continuous); offline capture syncs when signal returns.
- **Approvals:** Week plan approval by manager (shown in mock).
- **Reports:** 1) Coverage by territory; 2) Rep performance; 3) Visit frequency.
- **Integrations:** Android/iOS; GPS-verified check-in; offline.
- **Links to other Apps:** CRM (visited customer is the CRM account; visits/outcomes on same record); related Field Service, Attendance & Leave, FMCG Field Sales & Distribution; differs from Appointment Booking (customer's diary vs rep's plan).

## App: Gate Pass Management

- **App ID:** `gate-pass-management`
- **Category:** Service & Maintenance (home page grouping)
- **URL:** https://www.neome.ai/app/gate-pass-management
- **Fits when:** Factories, warehouses, workshops, any site where material and people cross a boundary; especially tools/dies/equipment leaving for repair or calibration.
- **Entities:** Gate pass (`GP-3318`, `GP-3402`, `GP-3410`); Vehicle log entry (vehicle number e.g. "GJ 01 KL 4412", driver); Visitor log entry.
- **Key fields:** Pass type (Inward / Outward; Returnable / Non-returnable), material, quantity, purpose, destination ("Going to"), expected return date, photo, raised by, approver, gate verified at (e.g. Gate 2), timestamps per step. Visitor: name, company, time in, person visiting.
- **Statuses / flows:** Raised → Approved → Verified at gate; returnable stays open until received back; overdue flagged.
- **Roles:** Stores (raise), approver, security (verify). Not formally listed.
- **Automations and rules:** Pass type decides what follows; overdue return alerts; live on-site visitor list.
- **Approvals:** Outward movement approved before it reaches the gate.
- **Reports:** 1) Active passes; 2) Pending returns; 3) Entry and exit log (searchable by date, vehicle, person, material, pass type).
- **Integrations:** Android/iOS (raise and verify at the gate).
- **Links to other Apps:** Inventory (sits alongside; stock-affecting movements still recorded in stock ledger); related Attendance & Leave, Internal Community Forum; Purchase Management lists it as related.

## App: Field Service

- **App ID:** `field-service`
- **Category:** Not in home page grouping. Inference: Service & Maintenance.
- **URL:** https://www.neome.ai/app/field-service
- **Fits when:** Businesses sending people to a customer's site to fix something: equipment service organisations, manufacturers supporting installed machinery, facilities/building services contractors; value rises with number of engineers and distance between jobs.
- **Entities:** Service request / ticket (`SR-2290`); Asset (e.g. "Compressor CP-210") with service history; Job checklist; Parts used; Sign-off.
- **Key fields:** Customer, priority (High), category, asset, fault description, assigned engineer, SLA left (e.g. 5h of 8h), checklist steps, photos, parts used (issued from stores), customer signature.
- **Statuses / flows:** Raised → Assigned → On site → signed off / Closed → released for billing.
- **Roles:** Engineer; service manager (escalation). Not formally listed.
- **Automations and rules:** SLA deadline on creation from priority, or from AMC contract response time; dispatch by availability, area and skill/equipment history; asset history attached; escalation to service manager before breach; closure on signature releases for billing same day.
- **Approvals:** None stated.
- **Reports:** 1) Approaching breach; 2) Engineer performance (jobs closed, time on site, first-visit fix rate); 3) Breach analysis.
- **Integrations:** Android/iOS (checklist, photos, digital sign-off). Billing system not named.
- **Links to other Apps:** AMC & Service Management (contract customers in same queue, SLA from contract); Inventory (parts from stores); related Field Visit Management, Vehicle & Driver Management.

## App: Employee Directory

- **App ID:** `employee-directory`
- **Category:** Team & HR (home page grouping)
- **URL:** https://www.neome.ai/app/employee-directory
- **Fits when:** Organisations past ~30 people; approvals and leave need to route to a line manager.
- **Entities:** Employee (`EMP-2041`); Department; Location; Reporting line; Status/role change (effective-dated); Onboarding checklist.
- **Key fields:** Name, employee code, status (Active), designation, department, reports to, location, contact details, effective date of changes.
- **Statuses / flows:** Active → exit as a status change with effective date (no deletion; leaves active directory and stops receiving routed work). Promotions/transfers effective-dated.
- **Roles:** HR, manager, employee, admin.
- **Automations and rules:** New joiner raises onboarding checklist automatically; reporting tree used to route leave, expenses and approval chains.
- **Approvals:** None of its own; it is "the routing table the rest of the platform reads".
- **Reports:** 1) Headcount; 2) New joiners; 3) Department distribution.
- **Integrations:** Android/iOS; self-service lookup.
- **Links to other Apps:** Attendance & Leave, Expense Management, Approval Workflows (route by its tree); Recruitment (accepted offer becomes an employee record); related Internal Community Forum. CRM also has an "Employee" master list.

## App: Recruitment

- **App ID:** `recruitment`
- **Category:** Team & HR (home page grouping)
- **URL:** https://www.neome.ai/app/recruitment
- **Fits when:** Growing organisations hiring often: multi-department companies, scaling businesses, HR/talent teams running several searches at once.
- **Entities:** Job position; Candidate; Interview round; Rating; Offer. No ID pattern shown.
- **Key fields:** Position: title, department, status (Open), budgeted band (e.g. ₹6 L to ₹8 L), days open. Candidate: profile, stage, application timeline. Interview: round (e.g. Technical, Practical, Final), interviewer, structured rating (1–5 shown), scheduled time. Offer: approver, within band.
- **Statuses / flows:** Candidate: Applied → Screened → Interviewed → Offered (→ accepted → employee). Position: Open → (closed, inferred).
- **Roles:** HR executives (manage process), hiring managers (evaluate and shortlist own positions), interviewers/panellists, approvers.
- **Automations and rules:** Interview reminders to panellists; approver notified of offer; accepted offer creates employee record which raises onboarding checklist.
- **Approvals:** Offer approval workflow on selection.
- **Reports:** 1) Open positions; 2) Hiring funnel; 3) Offer acceptance.
- **Integrations:** Android/iOS. Job-board or careers-page integration not stated.
- **Links to other Apps:** Employee Directory ("An accepted offer becomes a joiner"); related Attendance & Leave, Knowledge Library.

## App: Attendance & Leave

- **App ID:** `attendance-and-leave`
- **Category:** Team & HR (home page grouping)
- **URL:** https://www.neome.ai/app/attendance-and-leave
- **Fits when:** People work across shifts, sites or in the field; supervisor needs to know each morning who is available; multi-location and distributed teams.
- **Entities:** Attendance record (check-in/out); Leave request; Leave type with quota; Leave balance; Team calendar. No ID pattern shown.
- **Key fields:** Employee, department, check-in time, daily status (in / late / leave / absent), leave type (Casual, Sick, Earned, or your own), days, balance per type, approver.
- **Statuses / flows:** Attendance: in / late / absent / on leave. Leave: requested → waiting on line manager → approved/rejected (inferred).
- **Roles:** Employee, manager, HR, admin.
- **Automations and rules:** Late arrivals and absences detected same morning; late-arrival alerts to HR and managers; leave routed to line manager from Employee Directory; team calendar shows clashes on the request; escalation and delegation as elsewhere on the platform; offline capture syncs later.
- **Approvals:** Leave approval by line manager.
- **Reports:** 1) Present today; 2) Leave pending; 3) Attendance summary.
- **Integrations:** Attendance and leave exportable as basis for payroll (no named payroll system); web and Android/iOS check-in. Home page FAQ: employees can "mark attendance ... directly through WhatsApp or email".
- **Links to other Apps:** Employee Directory (reporting structure); FMCG Field Sales & Distribution adds GPS verification and beat-level attendance; related Expense Management, Gate Pass Management.
- **Note:** GPS/geo-fenced attendance is not stated for this App itself; the FAQ attributes GPS verification to the FMCG Field Sales platform.

## App: Expense Management

- **App ID:** `expense-management`
- **Category:** Team & HR (home page grouping)
- **URL:** https://www.neome.ai/app/expense-management
- **Fits when:** Employees spend on the company's behalf: field teams travelling, sales entertaining, engineers buying parts on site; claims from more people than finance can remember.
- **Entities:** Expense claim; Category with limit; Receipt attachment; Approval trail. No ID pattern shown.
- **Key fields:** Employee, claim type/category (Travel, Meals, Accommodation, your own), amount, description (e.g. "Site travel, Jamnagar"), receipt photo, limit (e.g. Travel per day ₹3,000), over-limit amount, project (optional).
- **Statuses / flows:** Submitted → manager approval → finance verification → paid (inferred final step); over-limit picks up extra approval.
- **Roles:** Claimant, line manager, finance. (Role-based access implied; roles not listed as a set.)
- **Automations and rules:** Limit validated at submission and breach shown to claimant; routing by reporting line; extra approval when over limit; status visible to claimant.
- **Approvals:** Two-step (manager, then finance); multi-level when over limit; same chains, escalation and delegation as platform Approval Workflows.
- **Reports:** 1) Spend by category; 2) Monthly trend; 3) Approved against rejected.
- **Integrations:** Android/iOS receipt capture. Accounting/payment system not named.
- **Links to other Apps:** Employee Directory (routing); Project Management (expenses booked to project budget); Approval Workflows; related Attendance & Leave.

## App: E-Learning

- **App ID:** `e-learning`
- **Category:** Learning & Engagement (home page grouping)
- **URL:** https://www.neome.ai/app/e-learning
- **Fits when:** Training happens as a conversation today: manufacturers with shift inductions, multi-location businesses, compliance requirements to evidence. "An internal learning platform, not a course marketplace."
- **Entities:** Course; Module; Content item (video, document, assessment); Enrolment; Certificate; Course discussion channel. No ID pattern shown.
- **Key fields:** Course: title, modules count, duration, certified flag, built by. Enrolment: learner, status, modules complete, % progress, assigned by, assignment reason (on joining). Assessment: question count.
- **Statuses / flows:** Enrolment: Assigned → In progress → Completed → Certificate issued (certification-enabled courses).
- **Roles:** Admin, HR, learner.
- **Automations and rules:** Onboarding courses auto-assigned on joining (from employee record); certificate issued automatically on completion; training reminders before sessions.
- **Approvals:** None stated.
- **Reports:** 1) Course completion; 2) Certification record; 3) Engagement.
- **Integrations:** Android/iOS. SCORM or external content standards not stated.
- **Links to other Apps:** Employee Directory (same employee record; joining date triggers); Internal Community Forum (per-course channels); Event Management (sessions in a room); Knowledge Library (related).

## App: Internal Community Forum

- **App ID:** `internal-community-forum`
- **Category:** Learning & Engagement (home page grouping)
- **URL:** https://www.neome.ai/app/internal-community-forum
- **Fits when:** Useful knowledge lives in chats and inboxes: distributed teams, multi-location operations.
- **Entities:** Category (e.g. Production floor, Quality and safety, Ideas and improvements, Announcements); Post / thread; Reply/comment; Flag; Moderation queue. No ID pattern shown.
- **Key fields:** Category, access scope (everyone / department / team), title, author, replies count, moderation state.
- **Statuses / flows:** Post: waiting for approval → published → flagged → reviewed / removed → archived ("closed without being deleted").
- **Roles:** Poster (anyone with access), moderator, category owner (inferred from "clear category ownership"); admin.
- **Automations and rules:** Pre-publication approval per category; flagging and review; activity notifications to people in the thread.
- **Approvals:** Post approval routing before it appears (configurable per category).
- **Reports:** 1) Participation; 2) Active discussions; 3) Response time.
- **Integrations:** Android/iOS.
- **Links to other Apps:** E-Learning (per-course channels, shared employee record); Event Management, Employee Directory (related); Knowledge Library (related).

## App: Event Management

- **App ID:** `event-management`
- **Category:** Learning & Engagement (home page grouping)
- **URL:** https://www.neome.ai/app/event-management
- **Fits when:** HR/learning teams running internal sessions, marketing/customer success running customer events; current method is calendar invite + spreadsheet + clipboard.
- **Entities:** Event (Internal / Customer / Training); Registration; Attendance mark; Feedback response. No ID pattern shown.
- **Key fields:** Title, type, status (Scheduled), when (start/end), where, capacity, organiser, registered count, attended, no-shows, feedback rating (1–5) and comment.
- **Statuses / flows:** Event Scheduled → held; Registration confirmed (closes at capacity); Attendance: Attended / No show.
- **Roles:** Organiser (named); participants. Others not stated.
- **Automations and rules:** Automatic registration confirmation; registration closes at capacity; reminders before the date; feedback triggered automatically after the event.
- **Approvals:** None stated.
- **Reports:** 1) Registration against attendance; 2) Participation by department; 3) Feedback scores.
- **Integrations:** Android/iOS (register and check in at the door). External ticketing/payment not stated.
- **Links to other Apps:** E-Learning (training events and courses share employee training history); Internal Community Forum, Attendance & Leave (related).

## App: Vehicle & Driver Management

- **App ID:** `vehicle-and-driver-management`
- **Category:** Not in home page grouping. Vertical, licensed platform (not on per-user plan; no self-serve trial).
- **URL:** https://www.neome.ai/app/vehicle-and-driver-management
- **Fits when:** Vehicle rental/fleet businesses handing vehicles to drivers for rent: EV and ICE 2W/3W/4W, rental and subscription, delivery/quick-commerce/logistics/last-mile fleets, rent-to-own; hundreds of vehicles across multiple branches. Case: HCD India.
- **Entities:** Driver (`RID-1042` in INR view / `DRV-1042` in USD view); Vehicle (`EV-2417`); Branch; Allocation; Rental plan; Driver wallet + ledger; IoT unit; Complaint; Job card (`JC-0318`); Spare part (branch stock).
- **Key fields:** Driver: KYC/documents with expiry (driving licence, proof of address), rental agreement (signed on tablet), security deposit (refundable), plan, branch, status. Vehicle: registration, chassis, battery or engine, purchase date, insurance (expiry), status. Wallet: balance, daily debit, top-ups, late fees, damage recovery. IoT: location, odometer, battery, last seen, start permitted. Job card: complaint, workshop, technician, spares, cost booked to vehicle, rent paused.
- **Statuses / flows:** Driver: onboarding checklist (4 of 5) → active → deboarded. Vehicle: On rent / Available / In service (workshop). Wallet: In credit → low balance alert → zero → next start blocked. Job card: In progress → closed.
- **Roles:** Branch staff/branch manager (own branch), head office (all branches), workshop technician, driver (driver app).
- **Automations and rules:** Vehicle cannot be handed over until onboarding checklist complete; rent auto-debited (daily at 6:00, or weekly/monthly cycle); low-balance alert with top-up link (e.g. below three days of rent); IoT start blocked at zero balance (never cuts off a moving vehicle; driver warned); rent paused while vehicle in service; spares cost booked to vehicle.
- **Approvals:** None stated.
- **Reports:** 1) Multi-branch; 2) Utilisation and revenue; 3) Cost of running.
- **Integrations:** IoT/telematics units already fitted (location, odometer, battery, start control; device confirmed during demo); driver app (balance, top-up by card, complaints, documents); import of existing vehicle/driver records.
- **Links to other Apps:** Inventory (spares per branch issued against job card, inference: uses Inventory); related Field Service, AMC & Service Management, Inventory & Stock Management.
- **Delivery note:** Page states it is "a licensed platform configured to how your fleet actually runs", priced by fleet size, branches, IoT units, plus one-time implementation; rollout "weeks rather than months".

## App: FMCG Field Sales & Distribution

- **App ID:** `fmcg-field-sales-and-distribution`
- **Category:** Not in home page grouping. Vertical, licensed platform (not on per-user plan; no self-serve trial).
- **URL:** https://www.neome.ai/app/fmcg-field-sales-and-distribution
- **Fits when:** FMCG/consumer goods manufacturers and distributors selling through a field force on daily beats, into traditional retail and modern trade, through multi-tier networks (CNFs, super stockists, distributors, retailers); head office learns what happened late. Cases: Maniarr's Khakhra, 260 Brands.
- **Entities:** Executive attendance; Beat (e.g. "Satellite Beat") / route; Outlet; Outlet visit; Rider visit/route; Beat order (traditional retail); Modern trade order (PO reference); Executive stock (request/assign); Warehouse/depot stock; Quality complaint (batch e.g. `B-2417`); Collection/payment entry; Customer ledger; Target.
- **Key fields:** Attendance: time, location verified, window close time. Visit: outlet, time, GPS tag, shelf photo, stock check. Order: outlet, routed-to distributor/depot, value; modern trade: PO reference, agreed terms, listing check. Executive stock: product, assigned, sold, left. Complaint: description, batch number, photo, assigned team (QA), status. Collection: amount, posted to customer ledger.
- **Statuses / flows:** Attendance window (e.g. closes 10:00; after that the day is marked absent). Outlet: Planned → Next → Visited. Stock request: Pending → approved and assigned. Complaint: Open → closure. Offline records "Waiting to sync" → uploaded.
- **Roles:** Executive, supervisor (approves/assigns stock), QA team (complaints), office/head office. Not formally listed.
- **Automations and rules:** Time-bound GPS-verified attendance that closes itself; daily beat assignment; orders routed to fulfilling distributor/depot; payments post to ledger live; sales/returns deducted from executive stock; full offline capture with auto sync; chat-style interface asks the executive questions.
- **Approvals:** Executive stock request approved by supervisor; modern trade uses "different forms and approvals".
- **Reports:** 1) Beat coverage; 2) Target achievement; 3) Collections and outstanding.
- **Integrations:** Native Android/iOS offline apps; internal chat support (field to office). ERP/DMS integration not stated.
- **Links to other Apps:** Related Field Visit Management, Inventory & Stock Management, Quotation & Order Flow; Attendance & Leave FAQ says this platform "adds GPS verification and beat-level attendance on top".
- **Delivery note:** Page says it is "a licensed platform configured to your route to market"; rollout "weeks rather than months", role by role, with import of outlets, executives, products. The pricing block on the page reuses fleet wording ("Fleet size", "IoT units connected"), apparently copied from Vehicle & Driver Management.


---

## 3. Cross-App index

### 3a. Entity → owning App(s)

"Owner" means the App whose page shows the entity being created and maintained. "Used by" means Apps whose pages say they read or link to it.

| Entity | Owner App | Used by / linked from |
|---|---|---|
| Lead | Lead Management; CRM (both capture leads) | WhatsApp Inquiry Management (feeds queue), CRM conversion |
| Account (customer) | CRM | Support Chat ("the account in the CRM"), Field Visit ("the account in the CRM"), Appointment Booking (customer-linked), Quotation & Order Flow (customer), Project Management (client), AMC, Field Service |
| Contact person | CRM | Quotation (contact), Support Chat portal (per-contact access) |
| Opportunity / deal | CRM | Quotation & Order Flow (opportunity links to quotation) |
| Activity, follow-up | CRM; Lead Management | Field Visit (outcome + follow-up) |
| Task | Ticketing & Task Management; CRM (auto-raised `TASK…`); Project Management | Approval Workflows |
| Ticket | Ticketing & Task Management | Support Chat & Customer Portal (same queue) |
| WhatsApp inquiry | WhatsApp Inquiry Management | CRM |
| Product / item / SKU | Product Catalog & Inquiry | Quotation, Inventory, Purchase, Manufacturing (BOM components), PLM (versioned product), FMCG (one catalog and price list) |
| Price revision | Product Catalog & Inquiry | Approval Workflows |
| Quotation | Quotation & Order Flow | CRM |
| Sales order | Quotation & Order Flow | Inventory (issue), Support Chat (order history), FMCG (beat / modern trade orders, own workflows) |
| Appointment | Appointment Booking | CRM customer |
| Approval request / chain | Approval Workflows | Purchase, Quotation (discount), Catalog (price), Inventory (adjustment), Attendance (leave), Expense, Recruitment (offer), PLM (CR), Gate Pass, Forum (posts), Knowledge (articles) |
| Article | Knowledge Library | Support Chat / customer portal |
| Project, milestone, time log | Project Management | Expense Management (expenses booked to project) |
| Warehouse, stock ledger, transfer, adjustment | Inventory & Stock Management | Manufacturing, Purchase, Field Service / AMC / Machine Maintenance / Vehicle (spares issued from stores), FMCG (depot stock) |
| Goods receipt (GRN) | Inventory & Stock Management | Purchase (raised against PO), Quality Control (incoming inspection) |
| Purchase request, purchase order, vendor, invoice match | Purchase Management | Inventory, Approval Workflows |
| Product version, change request, change order | Product Lifecycle Management | Catalog, Inventory |
| BOM, work order, work centre | Manufacturing | Inventory, Quality Control |
| Inspection, QC parameter, rejection | Quality Control | Manufacturing, Purchase (supplier quality) |
| Asset (own machine), PM plan, maintenance work order | Machine / Tools Maintenance | Inventory (spares) |
| AMC contract, covered asset, preventive visit | AMC & Service Management | Field Service (SLA from contract) |
| Service request (field job) | Field Service | AMC (same queue) |
| Field visit, territory plan | Field Visit Management | CRM |
| Gate pass, vehicle log, visitor log | Gate Pass Management | Inventory (alongside) |
| Employee, department, reporting line | Employee Directory | Attendance & Leave, Expense, Approval Workflows, Recruitment (joiner), E-Learning (enrolment), Forum, Events. CRM has its own "Employee" master list. |
| Position, candidate, interview, offer | Recruitment | Employee Directory |
| Attendance, leave request, leave balance | Attendance & Leave | FMCG (adds GPS / beat attendance), payroll export |
| Expense claim | Expense Management | Project Management, Approval Workflows |
| Course, enrolment, certificate | E-Learning | Employee Directory, Forum (course channels), Events |
| Forum post / category | Internal Community Forum | E-Learning |
| Event, registration, feedback | Event Management | E-Learning (training history) |
| Driver, vehicle, wallet, job card | Vehicle & Driver Management | Inventory (branch spares) `[inference]` |
| Beat, outlet, executive stock, collection, customer ledger, target | FMCG Field Sales & Distribution | Inventory, Catalog |
| Territory | CRM (master list); Lead Management; Field Visit Management | |
| Customer ledger / collections | FMCG Field Sales & Distribution only | PetroStar maps receivables to "Order Flow, Dashboards" as Configuration |

### 3b. Record-code prefixes (from demo mock-ups)

| Prefix | Example | Entity | App |
|---|---|---|---|
| `L` | L213 | Lead ("system lead id") | CRM |
| `TASK` | TASK105 | Task auto-raised from follow-up | CRM |
| `PRD-` | PRD-1042 | Product | Product Catalog |
| `QT-` | QT-2041 | Quotation | Quotation & Order Flow |
| `SO-` | SO-1188 | Sales order | Quotation & Order Flow (also Inventory, Support Chat) |
| `ORD-` | ORD-1042 | Order placed from chat | Home page AI demo |
| `PR-` | PR-1904 | Purchase request | Purchase Management, Approval Workflows |
| `PO-` | PO-4412, PO-1256 | Purchase order | Purchase Management, home |
| `INV-` | INV-8821 | Vendor invoice | Purchase Management |
| `GRN-` | GRN-2208 | Goods receipt | Inventory, Quality Control |
| `CR-` | CR-0342 | Change request | PLM |
| `ECO-` | ECO-0119 | Engineering change order | PLM |
| `BOM-` | BOM-118 | Bill of materials | Manufacturing |
| `WO-` | WO-2290 / WO-1183 / WO-208 | Work order (production **and** maintenance) | Manufacturing, Machine / Tools Maintenance, home |
| `TKT-` | TKT-4417, TKT-3312 | Ticket | Ticketing, Support Chat |
| `SR-` | SR-2290 | Service request | Field Service, AMC |
| `AMC-` | AMC-0471 | AMC contract | AMC & Service Management |
| `GP-` | GP-3318 | Gate pass | Gate Pass Management |
| `EMP-` | EMP-2041 | Employee | Employee Directory |
| `RID-` / `DRV-` | RID-1042 / DRV-1042 | Rider / driver (INR vs USD mock) | Vehicle & Driver Management |
| `EV-` | EV-2417 | Vehicle | Vehicle & Driver Management |
| `JC-` | JC-0318 | Job card | Vehicle & Driver Management |
| `B-` | B-2417 | Product batch | FMCG |

No prefix is shown for: appointment, visit, inquiry, article, project, recruitment entities, expense claim, leave, course, forum post, event. `[inference]` These are system-numbered or configurable; unconfirmed.

---

## 4. Mapping heuristics (Standard / Configuration / Custom module)

**These are heuristics**, drawn from how Neomenta mapped 17 RFP modules for Petro Star (`../sources/examples/petrostar-crm-proposal.txt`): 14 Standard or Configuration, 3 Custom module, 0 third-party add-ons. They are not Neome rules. Delivery stays indicative until the build phase.

Delivery definitions as used in PetroStar: **Standard** = "Neome module, plus field set-up". **Configuration** = "Custom fields, layouts, stages and workflows". **Custom module** = "Built by Neomenta on the Neome platform, no add-on".

### 4a. PetroStar worked examples

| Enterprise Module | Requirement gist | Neome App(s) named | Delivery |
|---|---|---|---|
| Customer Master | Name, industry, location, contacts, departments, approved-vendor status | CRM | Standard |
| Supplier / Principal Master | Approved makes, lead times, certificates with expiry, restricted pricing | Purchase, Product Catalog | Configuration |
| End-User Product Approval | Per product × operator: agreement → documents → audit → approved/rejected | Approval Workflows | Custom module |
| Opportunity / Project | Tender stage, probability, competitors, expected value | CRM, Lead Management | Standard |
| Enquiry / RFQ | RFQ no., customer, project, items, qty, deadline alerts | Product Catalog and Inquiry | Standard |
| Quotation | Cost, selling price, margin, validity, Incoterms; cost/margin hidden | Quotation and Order Flow | Standard |
| Offer Follow-Ups | Quote status stages, follow-up tasks, reminders before validity expiry | Workflow Automation, Tasks | Configuration |
| Technical Clarifications | TQ log with status, comments, drawings, approvals | Ticketing, Approval Workflows | Configuration |
| Commercial Negotiation | Price revision history, discount, target price | Quotation and Order Flow | Configuration |
| Profit Optimization | Margin reports; ask AI in plain language | Dashboards, Conversational AI | Configuration |
| PO Management | Customer PO vs quotation, variance flag, linked principal PO | Quotation and Order Flow, Purchase | Standard |
| Commission Management | Separate order type, commission %, invoice, payment, excluded from totals | Built on Order Flow | Custom module |
| Post-Order Document Approval | Document checklist per order (ITP, GAD, MTC...), revisions, client approval, order flagged until closed | Approval Workflows | Custom module |
| Delivery Tracking | Delivery stages with dates, owners, delivery note | Order Flow, Workflow Automation | Configuration |
| Receivables | Invoice/payment tracking, overdue alerts; SAP stays system of record | Order Flow, Dashboards | Configuration |
| After-Sales | Service tickets linked to order and principal, warranty, replacement, feedback | AMC and Service, Ticketing | Standard |
| Reports / Dashboards | Pipeline, won/lost, margins, deliveries, receivables, notifications | Real-time Dashboards | Standard |

Note: PetroStar names some "Apps" that are platform capabilities, not catalog pages: "Workflow Automation", "Tasks", "Dashboards", "Conversational AI", "Inquiry". Use the App IDs in section 0 when one exists, and section 1 building blocks for the rest.

### 4b. Heuristics (to confirm with the Consultant)

1. **Standard** when the Requirement's entity, fields and flow already appear on an App page (sections 2 and 3a): master data such as customers, products and employees; the App's default pipeline; its named reports. Field set-up and master-list values are still part of Standard (PetroStar: "Neome module, plus field set-up").
2. **Configuration** when the entity exists but the Enterprise needs extra fields, its own stages or statuses, extra reminders, approval steps, hidden/restricted fields, or a report the App does not name. Clues: the words "history", "log", "stages", "alerts", "follow-up", "restricted to". Also when the Requirement combines two Apps (PetroStar Supplier Master = Purchase + Catalog; TQs = Ticketing + Approvals).
3. **Custom module** when the Requirement needs a new record type with its own lifecycle that no App page models, even if built on an App's mechanics. Examples: per-operator product approval, commission orders kept out of order totals, a document checklist that blocks an order. Clues: a new entity name in the Enterprise's language; a many-to-many record (product × operator); a separate order type that must not mix with standard totals; compliance document sets.
4. **Reports**: if the report is one of an App's three named reports, it is Standard. A cross-App or Enterprise-specific metric (margin by principal, by operator) is Configuration on Dashboards.
5. **Integrations**: email, WhatsApp, Slack and MCP are available on the platform. ERP links (SAP etc.) via APIs are scoped and quoted separately: PetroStar ran "standalone at go-live". Treat ERP/accounting sync as an Open Item or a third-party scope tag, not Standard.
6. **Vertical Apps** (Vehicle & Driver, FMCG Field Sales) are "licensed... configured to how your [operation] runs", with a demo, a quote and an implementation. A Module mapped to them is at least Configuration `[inference]`.
7. **Security Requirements** (field-level permissions, 2FA, audit trail, export controls) were "Supported" in PetroStar. Map them to platform building blocks, not to an App.
8. **When unsure** between two Delivery levels, propose the higher one and raise an Open Item. The BRD shows Delivery as indicative and "proposed by Neomenta, to confirm".
9. **Prefer the App that owns the entity** (section 3a). Use "Links to other Apps" to name the secondary App: for example Recruitment → Employee Directory, or Lead Management → CRM.

---

## 5. Gaps and uncertain items

What the public site does not say, or says inconsistently. Raise these as Open Items, or confirm them internally before a BRD relies on them.

1. **App count.** There are 30 unique App pages; "31" comes from a duplicate sitemap entry. The site markets "25+ modules", and PetroStar repeats "25+".
2. **Category for 5 Apps.** WhatsApp Inquiry Management, Support Chat & Customer Portal, Field Service, Vehicle & Driver Management and FMCG Field Sales are missing from the home page grouping.
3. **Platform capabilities without a page.** "Workflow Automation", "Dashboards", "Conversational AI", "Tasks" and "Inquiry" are named in PetroStar but have no App page. The limits of the no-code workflow builder are not described anywhere: triggers, conditions, custom fields per App, formula fields.
4. **Template store.** It is mentioned only in vision blog posts. No public listing, no template IDs, no pricing, and no word on whether the 30 Apps are themselves templates (the Vehicle and FMCG FAQs contrast themselves with "Neome's horizontal apps").
5. **Roles.** Most pages give only a role list ("Executive, manager and admin"). Permission granularity is not public: field-level security, record sharing, territory-based scoping. Field-level permissions, 2FA, audit logs and export controls are claimed only in the PetroStar proposal.
6. **Integrations depth.** Email, WhatsApp and Slack are "first-class", but the site gives no detail on direction or objects. WhatsApp Inquiry links through a WhatsApp-Web-style session, not the WhatsApp Business API, and the CRM page does not say how its WhatsApp channel works. Public APIs and webhooks are not documented. No accounting, ERP or payroll connectors are named (Tally, SAP, QuickBooks). Payroll is "exportable" only. The reminder channel for Appointment Booking (SMS, WhatsApp, email) is not stated.
7. **Finance gaps.** No App covers invoicing, receivables, payments or accounting. The exceptions are FMCG collections/ledger and the Vehicle wallet. PetroStar handled receivables as Configuration on Order Flow and kept SAP as the financial record. Field Service's "released for billing" does not say where billing happens.
8. **Offline scope.** Offline is stated for Field Visit, Attendance & Leave and FMCG (and home page "visits, orders, and tasks"). It is unclear for the other Apps.
9. **GPS.** Attendance & Leave itself does not claim GPS; the FAQ attributes GPS verification to FMCG Field Sales. Field Visit records location at check-in/out only. Continuous tracking is claimed only on the home and Odoo compare pages ("live location tracking", "travel on a map").
10. **ID numbering.** Record codes come from mock-ups. Whether prefixes are configurable or auto-generated is not stated.
11. **Status sets incomplete.** Several Apps show only part of a lifecycle: Quotation stages before Accepted, Ticket statuses, Leave and Expense end states, Project statuses, Recruitment position states.
12. **Limits and scale.** No data volume limits, attachment limits, or multi-company/multi-currency statements, apart from the Vehicle multi-branch section and ₹/$ display. Multi-language is not mentioned.
13. **Product Catalog "Inquiry".** The App name says "& Inquiry", but the page describes only the catalog. RFQ/enquiry handling (PetroStar's "Enquiry / RFQ ... Standard") is not described on the public page.
14. **Copy errors on the site.** Several pages reuse mock-ups from other Apps, so a mock on a page is not proof that page's App has the feature:
    - Ticketing shows a project mock.
    - Approval Workflows shows a knowledge-article mock.
    - Knowledge Library shows an approval-chain mock.
    - Recruitment and Attendance & Leave show the employee/reporting-line mocks.
    - Expense shows a leave mock.
    - Field Service shows the AMC mock.
    - The FMCG pricing block reuses fleet wording.
15. **AI specifics.** The AI lead agent's data sources, the model/provider (the WhatsApp page mentions connecting OpenAI), and the cost or edition of AI features are not stated. It is not stated which Apps support "Contextual Search & Answers".
16. **Edition boundaries.** Standard vs Enterprise is described only at a high level: Enterprise adds "custom workflows & integrations", "advanced analytics" and SLA. The site does not say which building blocks are Standard-only and which need Enterprise.
