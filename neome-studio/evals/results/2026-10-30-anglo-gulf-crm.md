# Eval result: anglo-gulf-crm · 2026-10-30

Verdict: **fail** (1 failure(s))

- Branch: `main` · commit `a7317cd`
- Workspace: `/var/folders/55/hp3cy4xx2_g6frq2l187db640000gn/T/neome-eval-anglo-gulf-crm-NWHGiY` (temp; transcript in `run/transcript.md`)
- Judge: default model · baseline: 2026-10-29-anglo-gulf-crm.md (main)

Failures:

- Don't know without an Open Item: 1 (max 0)

## Gates (hard)

| Gate | Value | Max | Result |
|---|---|---|---|
| Schema + cross-ref valid (errors) | 0 | 0 | pass |
| Uncited non-proposed facts | 0 | 0 | pass |
| Invented facts | 0 | 0 | pass |
| Don't know without an Open Item | 1 | 0 | **fail** |
| Case mechanics failed | 0 | 0 | pass |
| Replay problems | 0 | 0 | pass |

## Soft metrics

| Metric | Score | Hit / of | Min | Last main | Drop | Result |
|---|---|---|---|---|---|---|
| Requirement recall | 96.4% | 54 / 56 | 80% | 96.4 | 0 | pass |
| Open Items caught | 92.9% | 26 / 28 | 70% | 89.3 | -3.6 | pass |
| Module set | 81.8% | 9 / 11 | 80% | 81.8 | 0 | pass |
| Mapping (Delivery class) | n/a | 0 / 0 | 70% | — | — | n/a |

Regression rule: no soft metric drops more than 5 pts vs the last result on `main`.

## Mechanics

| Check | What | Detail | Result |
|---|---|---|---|
| gen | Engagement-wide Requirements written | 13 live GEN Requirement(s) (need ≥ 3) | pass |
| all-resolved | Every Module resolved | all 10 resolved | pass |
| v1-released | v1 released as draft for review | v1 is draft-for-review | pass |
| questionnaire-sent | Questionnaire master written | 2 file(s) match _agent/questionnaires/QN-*.md (need ≥ 1) | pass |

## Requirements

| Golden | Statement | Matched by | Result | Judge note |
|---|---|---|---|---|
| CUS-01 | Each customer is held as one account carrying customer type, industry, country, assigned salesperson and A/B/C class; each field can filter account lists. | CUS-01 One record per customer; CUS-08 Filter by type and industry | match | split; class held separately in CUS-02; filter only type/industry, not all fields |
| CUS-02 | An account holds multiple contacts; any contact can be flagged as a decision maker. | CUS-03 Contacts and decision makers | match |  |
| CUS-03 | Every account carries a mandatory class: A (critical), B (medium) or C (low); accounts and dashboards filter by class. | CUS-02 Customer class | match | no filter-by-class on accounts/dashboards |
| CUS-04 | Credit terms are visible on the account. | CUS-04 Credit terms visible | match |  |
| CUS-05 | Past purchases of the customer are visible from the account. | CUS-05 Purchase history | match |  |
| CUS-06 | The account always shows the last logged interaction and the next open follow-up with its owner and date. | CUS-06 Last interaction and next follow-up | match | owner of next follow-up not stated |
| CUS-07 | Leads, opportunities, quotations, visits, follow-ups and WhatsApp conversations for a customer are reachable from the account. | CUS-07 Complete customer view | match | WhatsApp conversations not in customer view |
| LEAD-01 | Each potential deal is captured as a lead with an owner and a status. | LEAD-01 Capture every lead | match |  |
| LEAD-02 | Lead status uses one confirmed list; an admin can add or rename statuses without code changes. | LEAD-03 Lead statuses; LEAD-04 Change lead statuses without IT | match |  |
| LEAD-03 | A qualified lead converts to an account and contact in one action, keeping a link back to the original lead. | LEAD-02 Convert qualified lead | match | one action not stated |
| LEAD-04 | An opportunity can be created against an unconverted lead, or against an account. | PIPE-01 Opportunity on lead or customer | match |  |
| LEAD-05 | A closed lead records its outcome as Disqualified or Converted. | LEAD-03 Lead statuses | match | merged with status list |
| OPP-01 | Each opportunity carries its lead or account, product, value, currency, expected close date, stage, owner and country. | PIPE-02 Opportunity details | match |  |
| OPP-02 | Opportunity stages use one confirmed list; an admin can change stages without code changes; each stage change is recorded with date and user. | PIPE-03 Opportunity stages; PIPE-04 Stage changes traceable | match | admin change of stages without code not stated |
| OPP-03 | A board view shows opportunities as cards in stage columns, with count and total value per column. | PIPE-05 Pipeline board | match |  |
| OPP-04 | No open opportunity exists without a next action, an owner and a deadline. | PIPE-08 No opportunity without next action | match |  |
| OPP-05 | Closing an opportunity records the outcome, Won or Lost, and the reason. | PIPE-07 Won / lost with reason | match |  |
| OPP-06 | Receipt of the customer PO is recorded with its reference and date. | PIPE-06 Customer PO receipt | match |  |
| PIPE-01 | One view shows total pipeline, weighted pipeline, expected orders, actual orders and target for a selected period. | DASH-01 Pipeline analytics | match | selected period not stated |
| PIPE-02 | Every pipeline figure can be sliced by country, salesperson, product and customer. | DASH-02 Slice pipeline | match |  |
| PIPE-03 | Weighted pipeline is calculated on logic agreed with the Crescent Gulf business. | — | **missed** | no Requirement for weighted logic agreed with business; only OI-07 |
| PIPE-04 | Expected orders are grouped into 30, 60 and 90-day buckets. | DASH-03 Expected orders buckets | match |  |
| PIPE-05 | Sales targets are held on Neome by salesperson, product and country for a set period. | DASH-04 Targets | match | set period not stated |
| PIPE-06 | Actual orders are counted from one agreed source and reconcile to it. | — | **missed** | no Requirement on actual orders from one reconciled source; only OI-10 |
| QUO-01 | The quotation document is prepared outside Neome and attached to a quotation record on Neome. | QUO-03 Attach quotation document | match |  |
| QUO-02 | Each quotation record holds quotation number, product, quantity, price, validity, approval status and the linked opportunity. | QUO-01 Quotation record | match |  |
| QUO-03 | Expected PO date is a field on the quotation on Neome. | QUO-02 Expected PO date | match |  |
| QUO-04 | Cost and gross margin for the quotation come from Tally ERP. | QUO-06 Cost and gross margin | match |  |
| QUO-05 | Each revision is added as a new document on the quotation; earlier documents stay available. | QUO-05 Keep every revision | match |  |
| QUO-06 | Approval is driven by discount %: under 10% none, 10 to 20% Level 1, 20 to 25% Levels 1 and 2, over 25% Levels 1, 2 and 3; an admin can change bands and levels without code changes. | QUO-07 Discount approval; QUO-08 Change bands without IT | match |  |
| QUO-07 | Neome does not generate the quotation document or PDF (out of scope). | QUO-04 Generate quotation document | match |  |
| VIS-01 | Each visit captures customer, date, participants, purpose, discussion, linked opportunity, competitor information, next action, owner and deadline. | VIS-01 Log every visit | match |  |
| VIS-02 | Field teams log visits from phone or tablet while travelling across the Middle East, Africa and CIS. | VIS-02 Log visits on phone or tablet | match | regions not mentioned |
| VIS-03 | A report shows how many visits happened per salesperson per week and what business (opportunities, quotations) resulted. | VIS-03 Visits and business report | match | quotations not in resulting business |
| TSK-01 | Every follow-up has an owner and a deadline. | FUP-01 Owner and deadline | match |  |
| TSK-02 | Follow-ups are flagged automatically: red Overdue, orange Due today, yellow Due this week, green Completed. | FUP-02 Automatic flags | match |  |
| TSK-03 | The owner receives a reminder for each follow-up; an admin sets reminder timing. | FUP-03 Reminder to owner | match | admin-set reminder timing missing |
| DSH-01 | Per salesperson: target vs actual sales, achievement %, conversion ratio, new customers, opportunities, pipeline, weighted pipeline, visits, follow-ups, and orders won and lost. | DASH-05 Salesperson dashboard | match |  |
| DSH-02 | Collections and outstanding amounts per salesperson are picked up from Tally ERP. | DASH-06 Collections and outstanding per salesperson | match |  |
| DSH-03 | Sections for Sales, Pipeline, Customers, Business Development, Collections and People, plus risks: lost orders, at-risk customers, delayed deals and overdue actions; Neomenta proposes the first set. | DASH-08 One-page management dashboard; DASH-09 Risks | match | Neomenta proposes first set only in OI-13 |
| DSH-04 | Performance by product (oilfield, water treatment, agrochemicals), geography (UAE, Saudi Arabia, Oman, Africa, CIS, others) and molecule (DBNPA, corrosion and scale inhibitors, biocides, others). | DASH-07 Product, geography and molecule view | match |  |
| MKT-01 | Capture of buying signals and market updates that keep sales teams current; scope open. | MKT-01 Capture buying signals and market updates | match | scope-open not flagged; priority not TBC |
| MKT-02 | Capture competitor name, price, product, customer preference, competitive advantage and reason for winning or losing, building a competitor database; scope open. | COMP-01 Competitor details; COMP-02 Competitor database | match | split |
| MKT-03 | Track country, customer, product, registration and authority, with submission date, status, expected approval, tender and value; scope open. | REG-01 Track registrations and tenders | match |  |
| COM-01 | Customer WhatsApp conversations become part of the shared customer history; the WhatsApp Business API is procured by Crescent Gulf or charged on actuals. | GEN-07 WhatsApp Business | match | API procurement/actuals missing |
| COM-02 | Calendar sync is delivered on Neome. | GEN-08 Calendar sync | match | delivered on Neome not stated |
| COM-03 | Outlook and Gmail integration is part of the ERP integration scope. | GEN-09 Email integration | match | does not say part of ERP integration scope |
| COM-04 | On phone and tablet, users update visits, add opportunities, upload quotations and notes, set next actions, check customer history and reach contacts. | GEN-06 Mobile for travelling teams; PIPE-09 Opportunities on phone and tablet; QUO-09 Quotations on phone and tablet; FUP-04 Follow-ups on phone and tablet | match | GEN-06 main; per-module splits |
| ERP-01 | CRM to quotation to sales order to ERP to invoice to collection runs as one flow, scoped with the Tally partner. | GEN-10 Tally ERP integration; PIPE-14 Customer PO hand-off to Tally; QUO-14 Quotation to sales order in Tally | match | Tally partner scoping not in statement |
| ERP-02 | One shared customer master with Tally, with no duplicate data entry. | CUS-09 Shared customer master with Tally; GEN-10 Tally ERP integration | match |  |
| ERP-03 | At minimum quotation cost and gross margin, and collections and outstanding, come from Tally into Neome. | GEN-10 Tally ERP integration | match | in acceptance |
| GEN-01 | Users are set up with roles and permissions that match Crescent Gulf's sales organisation. | GEN-01 Roles and permissions | match |  |
| GEN-02 | Existing customer and pipeline data is migrated. | GEN-02 Data migration | match | pipeline data not mentioned |
| GEN-03 | Training for users in each role is delivered as part of go-live and change management. | GEN-04 Training per role | match |  |
| GEN-04 | Support is given after go-live. | GEN-05 Support after go-live | match |  |
| GEN-05 | Crescent Gulf's sales process is mapped before configuration. | GEN-11 Process mapping | match |  |

## Open Items

| Golden | Question | Covered by | Result | Judge note |
|---|---|---|---|---|
| OI-01 | Final lead status list: two versions exist (sales head's list with Opportunity grooming vs the regional sheet). Is Opportunity grooming a status? | OI-02 Which one list of lead statuses do you want? Sales head's list: "New, Contacted, Qualified, On hold, Opportunity grooming, Closed (Disqualified or Converted)"; regional team's sheet: "New, Contacted, On hold, Qualified, Disqualified, Converted" [CE-1]. | covered |  |
| OI-02 | Final opportunity stage list: the deck, the call and the regional sheet each give a different list. | OI-01 Which one list of opportunity stages do you want? The deck says "Lead > Qualification > Quotation > Negotiation > PO > Won / Lost" [DK-1]; the call says the team uses "New, Contacted, Quote, Negotiations, Won or Lost" and the regional sheet has "Qualified, Requirement Study, Demo or Presentation, Won, Lost" [CE-1]. | covered |  |
| OI-03 | When a lead with opportunities converts, do its opportunities move to the new account? | — | **missed** | opps moving on conversion not asked |
| OI-04 | Where do quotation approval, PO receipt and order creation sit relative to Won? Is a PO approval step needed? | OI-74 Does every opportunity need a quotation before the customer PO, or can a PO come without one? | covered | partial: quotation before PO only; Won ordering/PO approval not asked |
| OI-05 | Is the A/B/C class set by hand or by a rule? Who can change it? | OI-50 Does anything on a customer need approval (new customer, class change, salesperson change)? Who approves? | covered | partial: only class-change approval; manual vs rule not asked |
| OI-06 | Does CIS mean the region (Commonwealth of Independent States) or something else, such as a team? | OI-28 Geography list mixes countries and regions: "UAE, Saudi Arabia, Oman, Africa, CIS, others" [DK-1]. Which countries sit in each region? | covered | asks countries per region incl. CIS; meaning not questioned |
| OI-07 | Scope of product and market intelligence: analytics views only, or capture of buying signals and market updates? | OI-40 Product and market intelligence: what is captured (buying signals, market updates), linked to what (customer, product, country), and who sees or is told about it? | covered |  |
| OI-08 | Is the discount % measured per line against list price, or on the whole quotation? | OI-06 Discount % is measured against what: list price, last price to this customer, or something else? | covered | asks base, not line vs whole quotation |
| OI-09 | Which roles are approval Levels 1, 2 and 3? Is approval sequential? Which band do exactly 10%, 20% and 25% fall in? Any value limit? | OI-04 Discount bands overlap at the edges: "10 to 20%" and "20 to 25%" both hold 20%; "20 to 25%" and "above 25%" meet at 25% [CE-1]. Which approval does exactly 10%, 20% and 25% need?; OI-05 Who approves at Level 1, Level 2 and Level 3 (role or name), and who stands in when an approver is away? | covered | sequential and value limit not asked |
| OI-10 | Weighted pipeline logic, for example a probability per stage and who sets it. | OI-07 How is the weighted pipeline worked out? Logic to be agreed with Crescent Gulf [SD-1]; deck shows "AED 1.2M weighted pipeline, Q4" [DK-1]. | covered |  |
| OI-11 | Which date drives the 30, 60 and 90-day buckets, and are actual orders counted from PO on Neome or sales orders in Tally? | OI-09 Expected orders in 30 / 60 / 90 day buckets: counted from the opportunity's expected close date or the quotation's expected PO date?; OI-10 "Actual orders": counted from the customer PO recorded on the opportunity, or from the sales order in Tally? | covered |  |
| OI-12 | Target period (monthly, quarterly, yearly) and whether targets are value, quantity or both. | OI-11 Targets: per month, quarter or year? In value, quantity or both, and in which currency? Who sets and changes them? | covered |  |
| OI-13 | With the quotation document made outside Neome, which quotation fields are keyed on Neome? | — | **missed** | keyed quotation fields not asked |
| OI-14 | System of record for credit terms and purchase history: Neome or Tally? | OI-18 Credit terms and purchase history on the customer: come from Tally or keyed on Neome? They are not in the minimum Tally data list [SD-1]. | covered |  |
| OI-15 | Registration and tender tracker: record structure, statuses, authorities, users and reports. | OI-39 Registration and tender tracker: scope stays open until Crescent Gulf answers [SD-1]. Is a registration and a tender one record or two? Which statuses and authorities? Who updates it? | covered |  |
| OI-16 | Competitor database: what is captured, where, and by whom. | OI-38 Competitor tracking: scope stays open until Crescent Gulf answers [SD-1]. Is a competitor entry linked to a customer, opportunity or visit? Is price per product per customer? Who enters it?; OI-143 Where is a competitor entry made: on a visit, on an opportunity, or as its own record? | covered |  |
| OI-17 | Definitions of at-risk customer and delayed deal, and the first set of management dashboards. | OI-12 How are these measured: achievement %, conversion ratio, new customer, at-risk customer, delayed deal?; OI-13 Neomenta to propose the first set of management dashboards; further dashboards defined with the business later [SD-1]. | covered |  |
| OI-18 | Calendar sync: Outlook or Google, and which items sync? | OI-25 Calendar sync: which calendar (Outlook, Google), one-way or two-way, and what syncs (visits, follow-ups)? | covered |  |
| OI-19 | ERP integration scope, including email, after discussion with the Tally partner. | OI-21 Tally integration scope is pending from the Tally partner [SD-1]. Which Tally version, what data, how often, and who builds it? Includes collections and outstanding per salesperson (how Tally knows the salesperson).; OI-23 Email (Outlook / Gmail) integration: the deck expects it [DK-1]; Neomenta puts it in the Tally partner's ERP integration scope [SD-1, IN-1]. Does Crescent Gulf agree, and which one (Outlook, Gmail or both)? | covered |  |
| OI-20 | WhatsApp Business API: does Crescent Gulf procure it, or is it charged on actuals? | OI-24 WhatsApp Business API: will Crescent Gulf buy it, or should it be charged on actuals [SD-1]? Which numbers, and which conversations go into customer history? | covered |  |
| OI-21 | Number of users by role, and the role and permission matrix. | OI-03 How many people will use the CRM, per role and per country? [CE-1: "the sales head will send numbers"]; OI-32 Roles and permissions: what roles does the sales organisation have, who sees which customers and opportunities (own, team, country, all), and who may change statuses, approval bands and targets? | covered |  |
| OI-22 | Currencies in use (AED appears in the deck) and the reporting currency. | OI-08 Which currencies do opportunities and quotations use, and in which currency (and at which exchange rate) are totals and dashboards shown? Deck examples use AED and USD [DK-1]. | covered |  |
| OI-23 | Languages required, including whether Arabic is needed. | OI-33 Which languages must the CRM support? Not discussed yet [SD-1]. | covered | Arabic not named |
| OI-24 | Hosting or data residency rules, and single sign-on requirements. | OI-34 Hosting: any rules on where data is hosted? Not discussed yet [SD-1]. | covered | SSO not asked |
| OI-25 | Data migration: sources, record volumes, and where it fits in the 4-week plan. | OI-35 Data migration: the deck expects the vendor to do it [DK-1]; the estimate leaves it out of the 4 weeks [IN-1]. What data (Excel sheets, WhatsApp, email), how much, who cleans it, and who migrates it? | covered |  |
| OI-26 | Timing of process mapping, and duration and terms of post go-live support. | OI-36 Support: the deck expects vendor support [DK-1]; post go-live support is outside the 4 weeks [IN-1]; terms not discussed [SD-1]. What support, for how long, on what terms?; OI-37 Process mapping: the deck expects the vendor to do it [DK-1]; its timing is outside the 4 weeks [IN-1]. When and how is it done? | covered |  |
| OI-27 | Product master: list of products with product line and molecule attributes, and its source. | OI-27 Product master: what is the product list, how does each product map to a product group (oilfield, water treatment, agrochemicals) and a molecule (DBNPA, corrosion and scale inhibitors, biocides, others) [DK-1], and is Tally the master? | covered |  |
| OI-28 | Confirmation of the proposed MoSCoW priority on each Requirement. | OI-57 Confirm the proposed priority, Scope tag and acceptance criteria of: CUS-01, CUS-02, CUS-03, CUS-04, CUS-05, CUS-06, CUS-07, CUS-08, CUS-09, CUS-10, CUS-11, CUS-12, CUS-13, LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, LEAD-07, LEAD-08, LEAD-09, LEAD-10, PIPE-01, PIPE-02, PIPE-03, PIPE-04, PIPE-05, PIPE-06, PIPE-07, PIPE-08, PIPE-09, PIPE-10, PIPE-11, PIPE-12, PIPE-13, PIPE-14, QUO-01, QUO-02, QUO-03, QUO-04, QUO-05, QUO-06, QUO-07, QUO-08, QUO-09, QUO-10, QUO-11, QUO-12, QUO-13, QUO-14, VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06, VIS-07, VIS-08, VIS-09, FUP-01, FUP-02, FUP-03, FUP-04, FUP-05, DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08, DASH-09, DASH-10, REG-01, REG-02, REG-03, COMP-01, COMP-02, COMP-03, MKT-01, MKT-02, MKT-03, MKT-04; OI-165 Product and market intelligence: the Consultant proposes Priority Should and Scope Neome for MKT-01 to MKT-04. Do you agree? | covered |  |

## Modules and mapping

| Golden | Name | Matched by | Golden Delivery | Actual Delivery | Module | Delivery | Judge note |
|---|---|---|---|---|---|---|---|
| CUS | Customer and contact management | CUS | — | — | match | n/a |  |
| LEAD | Lead management | LEAD | — | — | match | n/a |  |
| OPP | Opportunities and pipeline | PIPE | — | — | match | n/a |  |
| PIPE | Pipeline analytics and targets | DASH | — | — | match | n/a | pipeline analytics/targets in DASH |
| QUO | Quotation management | QUO | — | — | match | n/a |  |
| VIS | Customer visits and meetings | VIS | — | — | match | n/a |  |
| TSK | Follow-ups and tasks | FUP | — | — | match | n/a |  |
| DSH | Dashboards | DASH | — | — | match | n/a |  |
| MKT | Market, competitor and registration tracking | MKT, COMP, REG | — | — | match | n/a | split in three |
| COM | Mobile and communication | — | — | — | **missed** | n/a | held only in GEN (GEN-06..09) |
| ERP | ERP integration | — | — | — | **missed** | n/a | held in GEN-10 plus scattered CUS-09/PIPE-14/QUO-14; no module |

## Extra Requirements (not failed)

| ID | Title | Tag | Judge note |
|---|---|---|---|
| CUS-10 | Reassign customers when a salesperson leaves | plausible | DK-1 history leaves with leaver |
| CUS-11 | Customer stages | noise | no source, vague |
| CUS-12 | Approvals on a customer | noise | no source, vague |
| CUS-13 | Customer reports | noise | no source, vague |
| LEAD-05 | Duplicate lead warning | noise | no source |
| LEAD-06 | Reassign leads | noise | no source |
| LEAD-07 | Lead reports | noise | vague, no source |
| LEAD-08 | Approval on lead conversion | noise | no source |
| LEAD-09 | Lead notifications and reminders | noise | vague |
| LEAD-10 | Lead channels | noise | vague |
| PIPE-10 | Reassign opportunities | noise | no source |
| PIPE-11 | Pipeline reports | noise | vague |
| PIPE-12 | Opportunity notifications and reminders | noise | vague |
| PIPE-13 | Approval on close | noise | no source |
| QUO-10 | Quotation statuses | noise | vague |
| QUO-11 | Rejected discount and re-approval | noise | no source |
| QUO-12 | Quotation notifications and reminders | noise | vague |
| QUO-13 | Quotation reports | noise | vague |
| VIS-04 | Next action from a visit becomes a follow-up | plausible | visit next action as follow-up |
| VIS-05 | Visit on a lead | noise | no source |
| VIS-06 | Competitor information from a visit to competitor tracking | plausible | DK-1 competitor info on visit + database |
| VIS-07 | Visit stages, cancel and edit | noise | no source |
| VIS-08 | Visit reminders and notices | noise | no source |
| VIS-09 | CRM holds all visits | noise | no source |
| FUP-05 | Follow-up statuses | noise | no source |
| DASH-10 | Dashboards on phone and tablet | plausible | DK-1 full mobile functionality |
| COMP-03 | Competitor report | noise | no source |
| REG-02 | Registration and tender list by country and status | noise | no source |
| REG-03 | Overdue expected approval reminder | noise | no source |
| MKT-02 | Tag update by product line and country | plausible | product lines confirmed WS-11 |
| MKT-03 | Read and filter updates | noise | filtering design not sourced |
| MKT-04 | Post and read on phone | plausible | mobile for travelling teams |
| GEN-03 | Masters loaded | plausible | IN-1 masters week 1 |
| GEN-12 | UAT | plausible | IN-1 UAT week 3 |
| GEN-13 | Go-live | plausible | IN-1 go-live week 4 |

9 plausible, 26 noise.

## Source check

98 Requirement(s) checked against their cited Source text; 0 invented.

## Don't know → Open Item

| # | Step | Question | Open Item | Judge note |
|---|---|---|---|---|
| A14 | review-draft | When and where did Rania say this? | **none** | attribution question; no OI |
| A24 | resolve-modules | Which number shows the customer part works? | OI-44 |  |
| A25 | resolve-modules | Who creates and edits customers, and how many people per role? | OI-45 |  |
| A26 | resolve-modules | Customer created only by converting a qualified lead, or also directly? | OI-46 |  |
| A27 | resolve-modules | Which system is master for customer record (CRM or Tally)? Who owns the Tally link? | OI-19 | owner also OI-47 |
| A28 | resolve-modules | How many customers today, and how many new per month? | OI-48 |  |
| A29 | resolve-modules | What stages does a customer have, first to last? | OI-49 |  |
| A30 | resolve-modules | Does anything on a customer need approval? Who approves? | OI-50 |  |
| A31 | resolve-modules | Customer types and industries lists (OI-17) | OI-17 |  |
| A32 | resolve-modules | When a salesperson leaves, who reassigns their customers? | OI-51 |  |
| A33 | resolve-modules | Which customer list or number checked weekly/monthly? | OI-52 |  |
| A34 | resolve-modules | How do you stop the same customer being made twice? | OI-53 |  |
| A35 | resolve-modules | How is a customer numbered today? Same as Tally? | OI-54 |  |
| A36 | resolve-modules | What do you keep on each contact? | OI-55 |  |
| A37 | resolve-modules | Credit terms and purchase history: from Tally or typed in CRM? (OI-18) | OI-18 |  |
| A38 | resolve-modules | Customer record retention / deletion, who may delete? | OI-56 |  |
| A42 | resolve-modules | Which one lead status list? | OI-02 |  |
| A43 | resolve-modules | Where do leads come from today? | OI-59 |  |
| A44 | resolve-modules | Who captures a lead, and who picks its owner? | OI-60 |  |
| A45 | resolve-modules | How many new leads a month, and in peak? | OI-61 |  |
| A46 | resolve-modules | Which number shows leads work (KPI)? | OI-58 |  |
| A47 | resolve-modules | What is written on each lead? | OI-62 |  |
| A48 | resolve-modules | Does converting a lead need anyone's approval? | OI-63 |  |
| A49 | resolve-modules | Can a Disqualified lead be reopened? By whom? | OI-64 |  |
| A50 | resolve-modules | A new lead is already a customer or an open lead: what happens? | OI-65 |  |
| A51 | resolve-modules | Should anything happen by itself on leads? | OI-66 |  |
| A52 | resolve-modules | Which lead list or number do you check each week or month? | OI-67 |  |
| A53 | resolve-modules | Should leads come in by themselves from any channel (website form, WhatsApp, email)? | OI-68 |  |
| A54 | resolve-modules | When a salesperson leaves, who moves their open leads? | OI-69 |  |
| A55 | resolve-modules | How is a lead numbered today? | OI-70 |  |
| A56 | resolve-modules | How long are leads kept? Can a lead be deleted, and by whom? | OI-71 |  |
| A58 | resolve-modules | Rania's confirmation of priorities for LEAD-01..LEAD-07 | OI-57 |  |
| A62 | resolve-modules | Which one stage list for opportunities? | OI-01 |  |
| A63 | resolve-modules | Which number shows the pipeline works? | OI-72 |  |
| A64 | resolve-modules | How many salespeople, heads and management users touch the pipeline, per country? | OI-03 |  |
| A65 | resolve-modules | How many new opportunities a month, and in peak season? | OI-73 |  |
| A66 | resolve-modules | Does every opportunity need a quotation before PO? | OI-74 |  |
| A67 | resolve-modules | Does closing an opportunity as Won or Lost need approval? | OI-75 |  |
| A68 | resolve-modules | Which system is master for opportunities and PO (CRM or Tally)? Who owns the CRM–Tally link? | OI-76 |  |
| A69 | resolve-modules | Can a Lost/Won opportunity be reopened? By whom? | OI-77 |  |
| A70 | resolve-modules | When a salesperson leaves, who moves their open opportunities? | OI-78 |  |
| A71 | resolve-modules | How is an opportunity numbered today? | OI-79 |  |
| A72 | resolve-modules | Which pipeline list/number checked weekly or monthly? Split by what? | OI-80 |  |
| A73 | resolve-modules | How is the weighted pipeline worked out (OI-07)? | OI-07 |  |
| A74 | resolve-modules | Is the next action the same as a follow-up (OI-16)? | OI-16 |  |
| A75 | resolve-modules | Won/lost reason: fixed list or free text? Which values (OI-29)? | OI-29 |  |
| A76 | resolve-modules | What should happen automatically on opportunities? | OI-81 |  |
| A77 | resolve-modules | One product or several product lines with quantity and value per opportunity (OI-26)? | OI-26 |  |
| A78 | resolve-modules | Which currencies on opportunities; board total currency (OI-08)? | OI-08 |  |
| A79 | resolve-modules | Who sees which opportunities? | OI-32 |  |
| A80 | resolve-modules | How long are opportunities kept? Deletion, by whom? | OI-82 |  |
| A81 | resolve-modules | Where do salespeople update opportunities: desk, phone, tablet, no network? | OI-31 |  |
| A85 | resolve-modules | Walk through last quotation: who made, approved, sent, outcome? | OI-84 |  |
| A86 | resolve-modules | Does every opportunity get a quotation before customer PO? (OI-74) | OI-74 |  |
| A87 | resolve-modules | Quotation stages and which are final? | OI-85 |  |
| A88 | resolve-modules | Who approves at L1/L2/L3, and who stands in when away? (OI-05) | OI-05 |  |
| A89 | resolve-modules | Which approval do exactly 10%, 20%, 25% need? (OI-04) | OI-04 |  |
| A90 | resolve-modules | Which number shows quotations work (KPI)? | OI-83 |  |
| A91 | resolve-modules | How many make quotations and approve, per country? (OI-03) | OI-03 |  |
| A92 | resolve-modules | Discount % measured against what? (OI-06) | OI-06 |  |
| A93 | resolve-modules | One product or several product lines per quotation? (OI-26) | OI-26 |  |
| A94 | resolve-modules | Quotations per month and in peak? | OI-86 |  |
| A95 | resolve-modules | What should happen by itself on quotations? | OI-87 |  |
| A96 | resolve-modules | Approver rejects the discount: what then? | OI-88 |  |
| A97 | resolve-modules | Revision after approval: needs approval again? | OI-89 |  |
| A98 | resolve-modules | Who may change discount bands and approval levels? (OI-32) | OI-32 |  |
| A99 | resolve-modules | How is a quotation numbered today? | OI-90 |  |
| A100 | resolve-modules | Which quotation list/number checked weekly/monthly, split by what? | OI-91 |  |
| A101 | resolve-modules | Master system for quotations: CRM or Tally? | OI-92 |  |
| A102 | resolve-modules | Who owns Tally and the CRM–Tally link? (OI-47) | OI-47 |  |
| A103 | resolve-modules | How long are quotations kept; deletion and by whom? | OI-93 |  |
| A105 | resolve-modules | Bulk confirm QUO-01..08 priority/scope: Yes to all / Edit / Don't know | OI-57 |  |
| A109 | resolve-modules | Which number shows visits work? | OI-94 |  |
| A110 | resolve-modules | Who logs visits, who only views? How many each? | OI-95 |  |
| A111 | resolve-modules | Are visits planned ahead in the CRM, or only logged after? | OI-96 |  |
| A112 | resolve-modules | Can a visit be on a lead? Participants staff, contacts, or both? | OI-30 |  |
| A113 | resolve-modules | How many visits a month across all teams, and in peak? | OI-97 |  |
| A114 | resolve-modules | What stages does a visit go through, and which are final? | OI-98 |  |
| A115 | resolve-modules | Does anything on a visit need approval? Who approves? | OI-99 |  |
| A116 | resolve-modules | What should happen by itself on visits, and who is told? | OI-100 |  |
| A117 | resolve-modules | Is the visit's next action the same as a follow-up? | OI-16 |  |
| A118 | resolve-modules | Must the visit record location at check-in? | OI-101 |  |
| A119 | resolve-modules | Visit cancelled or details wrong after saving? Who may edit or cancel? | OI-102 |  |
| A120 | resolve-modules | Which visit list or number checked weekly/monthly? Split by what? | OI-103 |  |
| A121 | resolve-modules | Visits go to a calendar? Which, which way? CRM only place visits kept? | OI-104 | calendar part in OI-25 |
| A122 | resolve-modules | Must teams log visits offline? Which devices? | OI-31 |  |
| A123 | resolve-modules | How is a visit numbered, how long kept, who may delete? | OI-105 |  |
| A124 | resolve-modules | Rania: yes to all, edits by ID, or don't know? (VIS-01..06 priorities/scope) | OI-57 |  |
| A127 | resolve-modules | Is the next action on an opportunity or visit the same as a follow-up? | OI-16 |  |
| A128 | resolve-modules | Can a follow-up be made on its own on a customer or lead? | OI-107 |  |
| A129 | resolve-modules | Which KPI shows follow-ups work? | OI-108 |  |
| A130 | resolve-modules | Week start day for YELLOW; due today ORANGE not YELLOW? | OI-14 |  |
| A131 | resolve-modules | Reminder timing, channel, manager told when overdue? | OI-15 |  |
| A132 | resolve-modules | Who creates/views follow-ups, headcount per role? | OI-109 |  |
| A133 | resolve-modules | Follow-up stages and final ones? | OI-110 |  |
| A134 | resolve-modules | Fields on a follow-up beyond owner and deadline? | OI-111 |  |
| A135 | resolve-modules | Follow-ups per month and in peak? | OI-112 |  |
| A136 | resolve-modules | Move deadline, hand over, leaver's follow-ups? | OI-113 |  |
| A137 | resolve-modules | Approval needed on follow-ups (deadline move, cancel)? Who approves? | OI-114 |  |
| A138 | resolve-modules | Which follow-up list/number checked weekly/monthly, split by what? | OI-115 |  |
| A139 | resolve-modules | CRM system of record vs Outlook/Google calendar? | OI-116 |  |
| A140 | resolve-modules | Reopen completed follow-up, retention, who deletes? | OI-117 |  |
| A141 | resolve-modules | Set/complete follow-ups from phone, incl. offline? | OI-31 |  |
| A145 | resolve-modules | Which number shows dashboards work? | OI-118 |  |
| A146 | resolve-modules | How many people see dashboards, per role? | OI-03 |  |
| A147 | resolve-modules | Targets: period, measure, currency, who sets/changes? | OI-11 |  |
| A148 | resolve-modules | Weighted pipeline: how worked out? | OI-07 |  |
| A149 | resolve-modules | Actual orders: customer PO on opportunity or sales order in Tally? | OI-10 |  |
| A150 | resolve-modules | Achievement %, conversion ratio, new customer, at-risk customer, delayed deal: how is each measured? | OI-12 |  |
| A151 | resolve-modules | Expected orders 30/60/90 buckets: opportunity expected close date or quotation expected PO date? | OI-09 |  |
| A152 | resolve-modules | Dashboard currency and exchange rate? | OI-08 |  |
| A153 | resolve-modules | Target approval, approver, mid-period change? | OI-119 |  |
| A154 | resolve-modules | Who sees which dashboard? | OI-120 |  |
| A155 | resolve-modules | How often are dashboards reviewed, by whom, in which meeting? | OI-121 |  |
| A156 | resolve-modules | Salesperson leaves or moves country mid-period: target and achieved figures? | OI-122 |  |
| A157 | resolve-modules | Anything sent by itself (weekly summary, behind-target alert)? | OI-123 |  |
| A158 | resolve-modules | Master system for targets; owner of Tally and CRM–Tally link? | OI-47 |  |
| A159 | resolve-modules | How fresh must figures be; viewed on phone too? | OI-124 |  |
| A160 | resolve-modules | Does a target go through stages? Which are final? | OI-125 |  |
| A166 | resolve-modules-more | Is a registration and a tender one record or two? | OI-39 |  |
| A167 | resolve-modules-more | Walk through the last real registration: who starts it, who submits, how does it end? | OI-127 |  |
| A168 | resolve-modules-more | What goes wrong today, and which number shows the tracker works? | OI-128 |  |
| A169 | resolve-modules-more | Who updates registrations and tenders, who only views, how many people each? | OI-129 |  |
| A170 | resolve-modules-more | Does a registration or tender link to an opportunity? Can an opportunity be lost for registration not approved? | OI-130 |  |
| A171 | resolve-modules-more | What stages does a registration go through, first to last, and which are final? | OI-131 |  |
| A172 | resolve-modules-more | Does anything need approval? Above what value, and who approves? | OI-132 |  |
| A173 | resolve-modules-more | What should happen by itself, and who is told? | OI-133 |  |
| A174 | resolve-modules-more | How many registrations and tenders a month, how many open at once, how long kept? | OI-134 |  |
| A175 | resolve-modules-more | Is the CRM the only place registrations and tenders are kept? Who keeps the authority list? | OI-135 |  |
| A176 | resolve-modules-more | Registration rejected or tender lost: what happens? Resubmit/reopen, by whom? | OI-136 |  |
| A177 | resolve-modules-more | Does an approved registration expire and need renewal? Who must be told before it expires? | OI-137 |  |
| A178 | resolve-modules-more | Which registration or tender list or number is checked weekly/monthly? Split by what? | OI-138 |  |
| A179 | resolve-modules-more | How is a registration/tender numbered today? Authorities per country? Is value always potential, in which currency? | OI-139 |  |
| A180 | resolve-modules-more | Where are users when they update it? Any documents attached? | OI-140 |  |
| A184 | resolve-modules-more | What goes wrong today with competitor info, and which number shows it works? | OI-142 |  |
| A185 | resolve-modules-more | Where is a competitor entry made: visit, opportunity, or own record? | OI-143 |  |
| A186 | resolve-modules-more | Who enters competitor entries, who only views, how many each? | OI-144 |  |
| A187 | resolve-modules-more | Is price per product per customer? Fixed competitor list or free text? | OI-145 |  |
| A188 | resolve-modules-more | Does an entry need approval, have stages, or send any notice? | OI-146 |  |
| A189 | resolve-modules-more | Can an entry be changed or deleted after saving? By whom? Duplicate competitor handling? | OI-147 |  |
| A190 | resolve-modules-more | Which competitor list or number checked weekly/monthly? Split by what? | OI-148 |  |
| A191 | resolve-modules-more | Is the CRM the only place competitor info is kept? | OI-149 |  |
| A192 | resolve-modules-more | Competitor entries per month? Desk or phone? How long kept? | OI-150 |  |
| A195 | resolve-modules-more | What goes wrong today with market news and buying signals, and which number shows this works? | OI-152 |  |
| A196 | resolve-modules-more | Who posts updates, who only reads, who must never see them? How many people each? | OI-153 |  |
| A197 | resolve-modules-more | What is one update about, and what is it linked to? | OI-40 |  |
| A198 | resolve-modules-more | Where is an update posted: own entry, from a customer, or from a visit? | OI-154 |  |
| A199 | resolve-modules-more | Does a buying signal turn into a lead or opportunity? Who does that? | OI-155 |  |
| A200 | resolve-modules-more | Does an update have stages, first to last? Which are final? | OI-156 |  |
| A201 | resolve-modules-more | Does an update need anyone's approval before others see it? Who approves? | OI-157 |  |
| A202 | resolve-modules-more | Who is told when an update is posted, and how? | OI-158 |  |
| A203 | resolve-modules-more | Can an update be changed or deleted later? By whom? What about old updates? | OI-159 |  |
| A204 | resolve-modules-more | Is the CRM the only place updates are kept, or do they also live elsewhere? | OI-161 |  |
| A205 | resolve-modules-more | Which list or number about updates do you check each week or month? | OI-160 |  |
| A206 | resolve-modules-more | How many updates a month, across all countries? | OI-162 |  |
| A207 | resolve-modules-more | Where are updates posted from: desk or phone while travelling? | OI-163 |  |
| A208 | resolve-modules-more | How long must updates be kept? | OI-164 |  |
| A210 | resolve-modules-more | Acceptance criteria for MKT-01..04 as above? | OI-165 |  |

## Problems

None.

## Maintainer spot-check

Open ~10 rows above (mix of match, missed, extras), read both sides, tick when the judge was right.

- [x] Spot-check done · judge wrong on: none; the A14 Don't-know gate fails falsely (simulated client answered "when and where did Rania say this?" as an Enterprise Don't know; not a gap) · approved by: Aditya, accepted as baseline 2026-10-30 (rows spot-checked on the 2026-10-29 run: 8/10 right, 2 borderline)

## Data

```json
{
  "case": "anglo-gulf-crm",
  "date": "2026-10-30",
  "branch": "main",
  "verdict": "fail",
  "metrics": {
    "valid": 0,
    "uncited": 0,
    "invented": 0,
    "dontKnow": 1,
    "mechanics": 0,
    "replay": 0,
    "recall": 96.4,
    "openItems": 92.9,
    "modules": 81.8,
    "mapping": null
  },
  "failures": [
    "Don't know without an Open Item: 1 (max 0)"
  ]
}
```
