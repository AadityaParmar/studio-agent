# Eval result: anglo-gulf-crm · 2026-10-29

Verdict: **fail** (1 failure(s))

- Branch: `main` · commit `b8a9f18`
- Workspace: `/var/folders/55/hp3cy4xx2_g6frq2l187db640000gn/T/neome-eval-anglo-gulf-crm-EpGHda` (temp; transcript in `run/transcript.md`)
- Judge: default model · baseline: none on main yet

Failures:

- Invented facts: 3 (max 0)

## Gates (hard)

| Gate | Value | Max | Result |
|---|---|---|---|
| Schema + cross-ref valid (errors) | 0 | 0 | pass |
| Uncited non-proposed facts | 0 | 0 | pass |
| Invented facts | 3 | 0 | **fail** |
| Don't know without an Open Item | 0 | 0 | pass |
| Case mechanics failed | 0 | 0 | pass |
| Replay problems | 0 | 0 | pass |

## Soft metrics

| Metric | Score | Hit / of | Min | Last main | Drop | Result |
|---|---|---|---|---|---|---|
| Requirement recall | 96.4% | 54 / 56 | 80% | — | — | pass |
| Open Items caught | 89.3% | 25 / 28 | 70% | — | — | pass |
| Module set | 81.8% | 9 / 11 | 80% | — | — | pass |
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
| CUS-01 | Each customer is held as one account carrying customer type, industry, country, assigned salesperson and A/B/C class; each field can filter account lists. | CUS-01 One record per customer; CUS-03 Filter by customer type and industry | match | CUS-03 filters only type and industry; not country/salesperson/class |
| CUS-02 | An account holds multiple contacts; any contact can be flagged as a decision maker. | CUS-04 Contacts and decision makers | match |  |
| CUS-03 | Every account carries a mandatory class: A (critical), B (medium) or C (low); accounts and dashboards filter by class. | CUS-02 Customer class A / B / C | match | no class filter on accounts/dashboards |
| CUS-04 | Credit terms are visible on the account. | CUS-05 Credit terms on the customer | match |  |
| CUS-05 | Past purchases of the customer are visible from the account. | CUS-06 Purchase history | match |  |
| CUS-06 | The account always shows the last logged interaction and the next open follow-up with its owner and date. | CUS-07 Last interaction and next follow-up | match | owner and date of next follow-up not stated |
| CUS-07 | Leads, opportunities, quotations, visits, follow-ups and WhatsApp conversations for a customer are reachable from the account. | CUS-08 Complete customer view | match | WhatsApp conversations omitted from CUS-08 (in GEN-10) |
| LEAD-01 | Each potential deal is captured as a lead with an owner and a status. | LEAD-01 Capture leads with owner and status | match |  |
| LEAD-02 | Lead status uses one confirmed list; an admin can add or rename statuses without code changes. | LEAD-03 Business keeps lead statuses; LEAD-02 Lead statuses | match |  |
| LEAD-03 | A qualified lead converts to an account and contact in one action, keeping a link back to the original lead. | LEAD-04 Convert qualified lead | match | one action not stated |
| LEAD-04 | An opportunity can be created against an unconverted lead, or against an account. | OPP-02 Opportunity on lead or customer | match |  |
| LEAD-05 | A closed lead records its outcome as Disqualified or Converted. | LEAD-02 Lead statuses | match |  |
| OPP-01 | Each opportunity carries its lead or account, product, value, currency, expected close date, stage, owner and country. | OPP-01 Opportunity record | match |  |
| OPP-02 | Opportunity stages use one confirmed list; an admin can change stages without code changes; each stage change is recorded with date and user. | OPP-03 Pipeline stages; OPP-04 Stage changes traceable | match | admin changing stages without code not stated |
| OPP-03 | A board view shows opportunities as cards in stage columns, with count and total value per column. | OPP-05 Pipeline board view | match |  |
| OPP-04 | No open opportunity exists without a next action, an owner and a deadline. | OPP-07 Next action on every open opportunity | match |  |
| OPP-05 | Closing an opportunity records the outcome, Won or Lost, and the reason. | OPP-08 Won / lost with reason | match |  |
| OPP-06 | Receipt of the customer PO is recorded with its reference and date. | OPP-06 Customer PO receipt | match |  |
| PIPE-01 | One view shows total pipeline, weighted pipeline, expected orders, actual orders and target for a selected period. | DASH-01 Pipeline analytics | match |  |
| PIPE-02 | Every pipeline figure can be sliced by country, salesperson, product and customer. | DASH-02 Slice by country, salesperson, product, customer | match |  |
| PIPE-03 | Weighted pipeline is calculated on logic agreed with the Crescent Gulf business. | — | **missed** | no Requirement for weighted pipeline on agreed logic; only OI-05 |
| PIPE-04 | Expected orders are grouped into 30, 60 and 90-day buckets. | DASH-03 Expected orders in 30 / 60 / 90 days | match |  |
| PIPE-05 | Sales targets are held on Neome by salesperson, product and country for a set period. | DASH-04 Targets | match | set period not stated |
| PIPE-06 | Actual orders are counted from one agreed source and reconcile to it. | — | **missed** | no Requirement for actual orders from one agreed source; only OI-26 |
| QUO-01 | The quotation document is prepared outside Neome and attached to a quotation record on Neome. | QUO-05 Attach quotation document | match |  |
| QUO-02 | Each quotation record holds quotation number, product, quantity, price, validity, approval status and the linked opportunity. | QUO-01 Quotation record | match |  |
| QUO-03 | Expected PO date is a field on the quotation on Neome. | QUO-02 Expected PO date | match |  |
| QUO-04 | Cost and gross margin for the quotation come from Tally ERP. | QUO-03 Cost and gross margin from Tally | match |  |
| QUO-05 | Each revision is added as a new document on the quotation; earlier documents stay available. | QUO-04 Revision history | match |  |
| QUO-06 | Approval is driven by discount %: under 10% none, 10 to 20% Level 1, 20 to 25% Levels 1 and 2, over 25% Levels 1, 2 and 3; an admin can change bands and levels without code changes. | QUO-07 Discount approval levels; QUO-08 Business changes approval bands | match |  |
| QUO-07 | Neome does not generate the quotation document or PDF (out of scope). | QUO-06 Quotation document generation | match |  |
| VIS-01 | Each visit captures customer, date, participants, purpose, discussion, linked opportunity, competitor information, next action, owner and deadline. | VIS-01 Log every visit | match |  |
| VIS-02 | Field teams log visits from phone or tablet while travelling across the Middle East, Africa and CIS. | VIS-02 Log visits from phone or tablet | match | regions ME/Africa/CIS not stated |
| VIS-03 | A report shows how many visits happened per salesperson per week and what business (opportunities, quotations) resulted. | VIS-03 Visits and business report | match | per salesperson split not stated |
| TSK-01 | Every follow-up has an owner and a deadline. | FUP-01 Owner and deadline on every follow-up | match |  |
| TSK-02 | Follow-ups are flagged automatically: red Overdue, orange Due today, yellow Due this week, green Completed. | FUP-02 Automatic follow-up flags | match |  |
| TSK-03 | The owner receives a reminder for each follow-up; an admin sets reminder timing. | FUP-03 Reminder to the owner | match | admin-set reminder timing not stated |
| DSH-01 | Per salesperson: target vs actual sales, achievement %, conversion ratio, new customers, opportunities, pipeline, weighted pipeline, visits, follow-ups, and orders won and lost. | DASH-05 Salesperson dashboard | match |  |
| DSH-02 | Collections and outstanding amounts per salesperson are picked up from Tally ERP. | DASH-06 Collections and outstanding per salesperson | match |  |
| DSH-03 | Sections for Sales, Pipeline, Customers, Business Development, Collections and People, plus risks: lost orders, at-risk customers, delayed deals and overdue actions; Neomenta proposes the first set. | DASH-08 One-page management dashboard; DASH-09 First dashboard set proposed by Neomenta | match |  |
| DSH-04 | Performance by product (oilfield, water treatment, agrochemicals), geography (UAE, Saudi Arabia, Oman, Africa, CIS, others) and molecule (DBNPA, corrosion and scale inhibitors, biocides, others). | DASH-07 Product, geography and molecule view | match |  |
| MKT-01 | Capture of buying signals and market updates that keep sales teams current; scope open. | MKT-01 Capture buying signals and market updates | match | scope-open not flagged |
| MKT-02 | Capture competitor name, price, product, customer preference, competitive advantage and reason for winning or losing, building a competitor database; scope open. | COMP-01 Competitor database | match | scope-open not flagged |
| MKT-03 | Track country, customer, product, registration and authority, with submission date, status, expected approval, tender and value; scope open. | REG-01 Registration and tender tracker | match | scope-open not flagged |
| COM-01 | Customer WhatsApp conversations become part of the shared customer history; the WhatsApp Business API is procured by Crescent Gulf or charged on actuals. | GEN-10 WhatsApp Business conversations in customer history | match | API procurement/actuals not stated |
| COM-02 | Calendar sync is delivered on Neome. | GEN-11 Calendar sync | match |  |
| COM-03 | Outlook and Gmail integration is part of the ERP integration scope. | GEN-12 Email integration | match | not stated as part of ERP integration scope |
| COM-04 | On phone and tablet, users update visits, add opportunities, upload quotations and notes, set next actions, check customer history and reach contacts. | GEN-07 Full functionality on phone and tablet | match |  |
| ERP-01 | CRM to quotation to sales order to ERP to invoice to collection runs as one flow, scoped with the Tally partner. | GEN-08 No standalone CRM next to Tally ERP; QUO-09 Quotation to sales order in ERP; OPP-10 Customer PO on to Tally | match | Tally partner scoping not in statements |
| ERP-02 | One shared customer master with Tally, with no duplicate data entry. | CUS-09 Shared customer master with Tally; GEN-08 No standalone CRM next to Tally ERP | match |  |
| ERP-03 | At minimum quotation cost and gross margin, and collections and outstanding, come from Tally into Neome. | GEN-09 Minimum data from Tally | match |  |
| GEN-01 | Users are set up with roles and permissions that match Crescent Gulf's sales organisation. | GEN-01 Roles and permissions | match |  |
| GEN-02 | Existing customer and pipeline data is migrated. | GEN-02 Data migration | match | pipeline data not mentioned |
| GEN-03 | Training for users in each role is delivered as part of go-live and change management. | GEN-04 Training per role | match |  |
| GEN-04 | Support is given after go-live. | GEN-05 Support after go-live | match |  |
| GEN-05 | Crescent Gulf's sales process is mapped before configuration. | GEN-06 Configured around Crescent Gulf's process | match |  |

## Open Items

| Golden | Question | Covered by | Result | Judge note |
|---|---|---|---|---|
| OI-01 | Final lead status list: two versions exist (sales head's list with Opportunity grooming vs the regional sheet). Is Opportunity grooming a status? | OI-01 Which lead status list is right? Sales head: New, Contacted, Qualified, On hold, Opportunity grooming, Closed (Disqualified or Converted). Regional team sheet: New, Contacted, On hold, Qualified, Disqualified, Converted. [CE-1] | covered |  |
| OI-02 | Final opportunity stage list: the deck, the call and the regional sheet each give a different list. | OI-04 Which opportunity stage list is right? Deck: Lead > Qualification > Quotation > Negotiation > PO > Won / Lost [DK-1]. Team on the call: New, Contacted, Quote, Negotiations, Won or Lost [CE-1]. Regional sheet: Qualified, Requirement Study, Demo or Presentation, Won, Lost [CE-1]. | covered |  |
| OI-03 | When a lead with opportunities converts, do its opportunities move to the new account? | — | **missed** | no question on moving opportunities at lead conversion |
| OI-04 | Where do quotation approval, PO receipt and order creation sit relative to Won? Is a PO approval step needed? | — | **missed** | OI-70/OI-68 touch PO and approval but not their place relative to Won |
| OI-05 | Is the A/B/C class set by hand or by a rule? Who can change it? | OI-61 Who may change a customer's class or assigned salesperson, and does it need approval? [WS-2] | covered | asks who changes; hand vs rule not asked |
| OI-06 | Does CIS mean the region (Commonwealth of Independent States) or something else, such as a team? | OI-30 Geography: which countries sit in Africa, CIS and "others", and is country or region used for targets and slicing? [DK-1] | covered | asks which countries in CIS; not region vs team |
| OI-07 | Scope of product and market intelligence: analytics views only, or capture of buying signals and market updates? | OI-24 Product and market intelligence: what is captured (buying signals, market updates), linked to what (customer, product, country), who posts it, who is told? [DK-1, CE-1, WS-9] | covered |  |
| OI-08 | Is the discount % measured per line against list price, or on the whole quotation? | OI-14 Discount bands: in which band do exactly 10%, 20% and 25% fall, and discount against what (list price)? [CE-1, WS-4] | covered | per line vs whole quote not explicit |
| OI-09 | Which roles are approval Levels 1, 2 and 3? Is approval sequential? Which band do exactly 10%, 20% and 25% fall in? Any value limit? | OI-13 Who are the Level 1, Level 2 and Level 3 quotation approvers (role or name)? [CE-1, WS-4]; OI-14 Discount bands: in which band do exactly 10%, 20% and 25% fall, and discount against what (list price)? [CE-1, WS-4] | covered | sequential approval and value limit not asked |
| OI-10 | Weighted pipeline logic, for example a probability per stage and who sets it. | OI-05 How is weighted pipeline worked out (e.g. a % per stage, set by whom)? [SD-1, WS-10] | covered |  |
| OI-11 | Which date drives the 30, 60 and 90-day buckets, and are actual orders counted from PO on Neome or sales orders in Tally? | OI-26 What counts as an actual order: customer PO on the opportunity, sales order, or invoice in Tally? [DK-1, CE-1, WS-10] | covered | bucket date not asked |
| OI-12 | Target period (monthly, quarterly, yearly) and whether targets are value, quantity or both. | OI-25 Targets: for which period (month, quarter, year), in value or quantity, and who sets them? [DK-1, SD-1, WS-10] | covered |  |
| OI-13 | With the quotation document made outside Neome, which quotation fields are keyed on Neome? | — | **missed** | no question on which quotation fields keyed on Neome |
| OI-14 | System of record for credit terms and purchase history: Neome or Tally? | OI-10 Where do credit terms on the customer come from (Tally or keyed in the CRM), and who keeps them up to date? [DK-1]; OI-11 Where does the customer's purchase history come from? It is not in the minimum data from Tally (cost, margin, collections, outstanding). [DK-1, SD-1] | covered |  |
| OI-15 | Registration and tender tracker: record structure, statuses, authorities, users and reports. | OI-23 Registration and tender tracker: is it in scope; are registration and tender one record or two; what status values (example: Approval Pending); who updates it? [DK-1, SD-1]; OI-118 Which stages does a registration go through, first to last, and which are final? (Inputs show only Approval Pending.) [DK-1, WS-8]; OI-121 Which registration and tender lists or numbers are checked, and split by what? [WS-8] | covered |  |
| OI-16 | Competitor database: what is captured, where, and by whom. | OI-22 Competitor tracking: is it in scope; is competitor information kept per opportunity, visit or customer; is competitor price per product, in which currency? [DK-1, SD-1]; OI-105 Who records competitor information, who only views it? [WS-7] | covered |  |
| OI-17 | Definitions of at-risk customer and delayed deal, and the first set of management dashboards. | OI-28 Management dashboard: what do "at-risk customer", "delayed deal", "Business Development" and "People" mean? Neomenta proposes the first set. [DK-1, SD-1, WS-10] | covered |  |
| OI-18 | Calendar sync: Outlook or Google, and which items sync? | OI-41 Calendar sync: which calendar (Outlook, Google), and what syncs (visits, follow-ups)? [DK-1, SD-1] | covered |  |
| OI-19 | ERP integration scope, including email, after discussion with the Tally partner. | OI-38 ERP integration scope with the Tally partner: which data moves each way (customers, quotation to sales order, invoices, collections, outstanding, cost and gross margin), when? Partner shares scope after discussion. [DK-1, SD-1]; OI-39 Email integration (Outlook / Gmail): Crescent Gulf asks for it [DK-1]; Neomenta puts it in the Tally partner's integration scope [SD-1]. Does Crescent Gulf agree, and which email system is used? | covered |  |
| OI-20 | WhatsApp Business API: does Crescent Gulf procure it, or is it charged on actuals? | OI-40 WhatsApp Business API: does Crescent Gulf procure it, or is it charged on actuals? Which teams and numbers? [SD-1] | covered |  |
| OI-21 | Number of users by role, and the role and permission matrix. | OI-31 How many users, per role? Sales head will send numbers. [CE-1, SD-1, WS-10]; OI-32 Which roles exist and what may each see and do (e.g. salesperson sees only own customers)? [DK-1, WS-10] | covered |  |
| OI-22 | Currencies in use (AED appears in the deck) and the reporting currency. | OI-07 Which currencies are used (deck shows AED and USD), which is the base currency for pipeline totals and targets, and where do exchange rates come from? [DK-1] | covered |  |
| OI-23 | Languages required, including whether Arabic is needed. | OI-33 Which languages must the CRM support? Not discussed yet. [SD-1] | covered | Arabic not named |
| OI-24 | Hosting or data residency rules, and single sign-on requirements. | OI-34 Any hosting needs (cloud region, data residency)? Not discussed yet. [SD-1] | covered | SSO not asked |
| OI-25 | Data migration: sources, record volumes, and where it fits in the 4-week plan. | OI-35 Data migration: who moves the old data, when, from which sheets (Excel, any competitor sheet, any registration or tender sheet), and how much? Crescent Gulf expects the vendor to do it [DK-1]; the 4-week plan leaves it out [IN-1, SD-1, WS-7, WS-8]. | covered |  |
| OI-26 | Timing of process mapping, and duration and terms of post go-live support. | OI-36 Support after go-live: what support do you need (hours, channel, response time)? Crescent Gulf expects vendor support [DK-1]; it is not in the 4-week plan [IN-1, SD-1].; OI-37 Process mapping: Crescent Gulf expects the vendor to do it [DK-1]; its timing is not in the 4 weeks [IN-1]. When and by whom? | covered |  |
| OI-27 | Product master: list of products with product line and molecule attributes, and its source. | OI-29 Products: are there product items under oilfield, water treatment, agrochemicals and molecules (DBNPA, corrosion and scale inhibitors, biocides)? Where does the product list come from (Tally)? [DK-1] | covered |  |
| OI-28 | Confirmation of the proposed MoSCoW priority on each Requirement. | OI-56 Confirm the proposed priority, Scope tag and acceptance criteria of: LEAD-01, LEAD-02, LEAD-03, LEAD-04, CUS-01, CUS-02, CUS-03, CUS-04, CUS-05, CUS-06, CUS-07, CUS-08, CUS-09, CUS-10, CUS-11, CUS-12, OPP-01, OPP-02, OPP-03, OPP-04, OPP-05, OPP-06, OPP-07, OPP-08, OPP-09, OPP-10, OPP-11, OPP-12, QUO-01, QUO-02, QUO-03, QUO-04, QUO-05, QUO-06, QUO-07, QUO-08, QUO-09, QUO-10, QUO-11, QUO-12, VIS-01, VIS-02, VIS-03, FUP-01, FUP-02, FUP-03, FUP-04, COMP-01, COMP-02, COMP-03, COMP-04, REG-01, REG-02, REG-03, REG-04, MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08, DASH-09 | covered |  |

## Modules and mapping

| Golden | Name | Matched by | Golden Delivery | Actual Delivery | Module | Delivery | Judge note |
|---|---|---|---|---|---|---|---|
| CUS | Customer and contact management | CUS | — | — | match | n/a |  |
| LEAD | Lead management | LEAD | — | — | match | n/a |  |
| OPP | Opportunities and pipeline | OPP | — | — | match | n/a |  |
| PIPE | Pipeline analytics and targets | DASH | — | — | match | n/a | merged into DASH |
| QUO | Quotation management | QUO | — | — | match | n/a |  |
| VIS | Customer visits and meetings | VIS | — | — | match | n/a |  |
| TSK | Follow-ups and tasks | FUP | — | — | match | n/a |  |
| DSH | Dashboards | DASH | — | — | match | n/a |  |
| MKT | Market, competitor and registration tracking | MKT, COMP, REG | — | — | match | n/a | split in three |
| COM | Mobile and communication | — | — | — | **missed** | n/a | no module; needs held as GEN-07, GEN-10..12 |
| ERP | ERP integration | — | — | — | **missed** | n/a | no module; needs held as GEN-08, GEN-09, CUS-09 |

## Extra Requirements (not failed)

| ID | Title | Tag | Judge note |
|---|---|---|---|
| CUS-10 | Customer statuses | noise | customer status list not in any Source |
| CUS-11 | Customer lists and numbers | noise | vague agreed lists placeholder |
| CUS-12 | Control of class and salesperson changes | noise | change control unsupported; open question only |
| OPP-09 | Pipeline reports | noise | vague pipeline reports placeholder |
| OPP-11 | Reopen and reassign opportunities | noise | reopen/reassign not in Sources |
| OPP-12 | Opportunity approvals | noise | opportunity approval not in Sources |
| QUO-10 | Quotation statuses | plausible | approval status/validity in deck imply statuses |
| QUO-11 | Approval alerts | plausible | approval flow implies alerts; unconfirmed |
| QUO-12 | Pending approvals list | plausible | pending approvals list supports approval matrix |
| FUP-04 | Follow-up list by flag | plausible | own follow-up list by flag, reasonable |
| COMP-02 | Competitor list | noise | Head of Sales-kept list invented |
| COMP-03 | Competitor information from visit and opportunity | plausible | deck has competitor info on visit |
| COMP-04 | Competitor reports | noise | reports unsupported while scope open |
| REG-02 | Registration stages | noise | stages invented; WS-8 says unknown |
| REG-03 | Date reminders | noise | 7-day reminders invented |
| REG-04 | Registration and tender reports | noise | reports unsupported |
| MKT-02 | Entry type and links | noise | type list invented |
| MKT-03 | Team told of a new entry | noise | notification unsupported |
| MKT-04 | Buying signal to lead | noise | signal-to-lead unsupported; WS-9 unknown |
| MKT-05 | Market intelligence report | noise | report unsupported |
| GEN-03 | Masters loaded | plausible | IN-1 masters loaded end of week 1 |
| GEN-13 | UAT and go-live | plausible | UAT in DK-1 and IN-1 |

7 plausible, 15 noise.

## Source check

82 Requirement(s) checked against their cited Source text; 3 invented.

| ID | Sources | Judge note |
|---|---|---|
| QUO-10 | WS-4 | WS-4 only records stages and expiry as unknown |
| QUO-11 | WS-4 | WS-4 says who is told is unknown |
| QUO-12 | WS-4 | WS-4 has no pending approvals list |

## Don't know → Open Item

| # | Step | Question | Open Item | Judge note |
|---|---|---|---|---|
| A21 | resolve-modules | Which lead status list is final? | OI-01 |  |
| A22 | resolve-modules | What makes a lead Qualified, and who decides it can convert? | OI-03 |  |
| A23 | resolve-modules | Where do leads come from today, and who keys them in? | OI-49 |  |
| A24 | resolve-modules | What must a lead hold besides owner and status? | OI-02 |  |
| A25 | resolve-modules | Main goal and the number that should move? | OI-50 |  |
| A26 | resolve-modules | Who works leads, and how many people in each role? | OI-51 | headcount part in OI-31 |
| A27 | resolve-modules | How many new leads a month, and in peak season? | OI-44 | lead volumes |
| A28 | resolve-modules | Can a Disqualified lead be reopened, and by whom? How are duplicate leads handled? | OI-52 |  |
| A29 | resolve-modules | What lead reports do you need? | OI-53 |  |
| A30 | resolve-modules | Must leads come in from another system or channel, and which system is the master for leads? | OI-54 |  |
| A31 | resolve-modules | How are new leads assigned, and should the owner get a reminder when a lead has no update? | OI-55 |  |
| A35 | resolve-modules | Main goal for customers, and which KPI should move? | OI-57 |  |
| A36 | resolve-modules | Who works customers, how many per role? | OI-58 |  |
| A37 | resolve-modules | Customer only via lead conversion, or also direct entry? | OI-59 |  |
| A38 | resolve-modules | Customer type and industry values? (OI-09) | OI-09 |  |
| A39 | resolve-modules | Customer status and values? | OI-60 |  |
| A40 | resolve-modules | Who may change customer class or salesperson? Approval? | OI-61 |  |
| A41 | resolve-modules | Duplicate customer or salesperson leaves: what then? | OI-62 |  |
| A42 | resolve-modules | Which customer lists/numbers checked, split by what? | OI-63 |  |
| A43 | resolve-modules | Customer master CRM or Tally; where created? (OI-12) | OI-12 |  |
| A44 | resolve-modules | Customer and contact counts, new customers per month? | OI-44 |  |
| A45 | resolve-modules | Who owns the Tally link on Enterprise side? | OI-64 |  |
| A46 | resolve-modules | Source of credit terms (OI-10)? | OI-10 |  |
| A47 | resolve-modules | Source of purchase history (OI-11)? | OI-11 |  |
| A48 | resolve-modules | What do you keep per contact? | OI-65 |  |
| A52 | resolve-modules | Which opportunity stage list is final? | OI-04 |  |
| A53 | resolve-modules | Main goal of the pipeline, and which number should move? | OI-66 |  |
| A54 | resolve-modules | Who works opportunities, and how many people per role? | OI-67 |  |
| A55 | resolve-modules | One opportunity = one product, or several product lines? | OI-06 |  |
| A56 | resolve-modules | Is an opportunity's next action the same as a follow-up? | OI-21 |  |
| A57 | resolve-modules | Does anything on an opportunity need approval? Above what, who approves? | OI-68 |  |
| A58 | resolve-modules | Won/lost reason: fixed list or free text? Values? | OI-08 |  |
| A59 | resolve-modules | Can a Lost opportunity be reopened, and who reassigns when a salesperson leaves? | OI-69 |  |
| A60 | resolve-modules | Which system is master for opportunities and PO, and what goes to Tally after PO? | OI-70 |  |
| A61 | resolve-modules | How many opportunities open a month, and in peak? | OI-44 | opportunity volumes |
| A62 | resolve-modules | Which pipeline reports does she check, split by what? | OI-71 |  |
| A63 | resolve-modules | How is weighted pipeline worked out? | OI-05 |  |
| A64 | resolve-modules | What counts as an actual order? | OI-26 |  |
| A65 | resolve-modules | Currencies on an opportunity, and base currency for totals? | OI-07 |  |
| A66 | resolve-modules | How is an opportunity numbered, and is a quotation always made from an opportunity? | OI-72 |  |
| A68 | resolve-modules | Priorities (all Must) confirmed by Sales head? | OI-56 |  |
| A71 | resolve-modules | Is every quotation made from one opportunity, and can one opportunity have several quotations? | OI-73 |  |
| A72 | resolve-modules | Who are the Level 1, Level 2 and Level 3 approvers (role or name)? | OI-13 |  |
| A73 | resolve-modules | Where do exactly 10%, 20% and 25% fall, and what is the discount taken off? | OI-14 |  |
| A74 | resolve-modules | What stages does a quotation go through, first to last, and which are final? | OI-74 |  |
| A75 | resolve-modules | Does a new revision need approval again? | OI-15 |  |
| A76 | resolve-modules | How does a quotation reach the customer, and is sending recorded in the CRM? | OI-75 |  |
| A77 | resolve-modules | Who gives the quotation number, and in what format? | OI-16 |  |
| A78 | resolve-modules | How many days is a quotation valid by default, and should it expire by itself? | OI-76 |  |
| A79 | resolve-modules | Does one quotation hold one product or several product lines? | OI-06 |  |
| A80 | resolve-modules | Where does the cost come from before the quotation reaches Tally as a sales order? | OI-77 |  |
| A81 | resolve-modules | What is the main goal for quotations, and which number should move? | OI-78 |  |
| A82 | resolve-modules | Who makes quotations, who only views them, and how many people per role? | OI-79 |  |
| A83 | resolve-modules | Which quotation lists or numbers do you check, and split by what? | OI-80 |  |
| A84 | resolve-modules | Which system is the master for quotations: the CRM or Tally? | OI-81 |  |
| A85 | resolve-modules | How many quotations a month, and at peak? | OI-44 | quotation volumes |
| A86 | resolve-modules | When an approver is away, who approves instead? | OI-82 |  |
| A87 | resolve-modules | What happens when an approver rejects a quotation, and can an Expired or Rejected quotation be reopened? | OI-83 |  |
| A88 | resolve-modules | Who is told when a quotation waits for approval, is approved or rejected, and how? | OI-84 |  |
| A89 | resolve-modules | Who on your side owns the Tally link for quotation cost, margin and sales order? | OI-64 |  |
| A90 | resolve-modules | Bulk confirm of QUO-01 to QUO-12 priorities and scope | OI-56 |  |
| A94 | resolve-modules | 1 · What must visit logging fix, and which number should move? | OI-85 |  |
| A95 | resolve-modules | 2 · Who logs visits, who only views, how many in each? | OI-86 |  |
| A96 | resolve-modules | 3 · Are visits planned ahead, or only logged after they happen? | OI-87 |  |
| A97 | resolve-modules | 4 · Visit participants (OI-17): staff, customer contacts, or both? | OI-17 |  |
| A98 | resolve-modules | 5 · Is a visit's next action the same as a follow-up? | OI-21 |  |
| A99 | resolve-modules | 1 · Visit stages first to last, and which are final? | OI-88 |  |
| A100 | resolve-modules | 2 · Does anything on a visit need approval, and who approves? | OI-89 |  |
| A101 | resolve-modules | 3 · Who is told when a visit is logged or its next action is due, and how? | OI-90 |  |
| A102 | resolve-modules | 4 · 'What business came from visits' (OI-18): tied how? | OI-18 |  |
| A103 | resolve-modules | 5 · Visits per month and at peak; where logged? | OI-91 | volumes part in OI-44 |
| A104 | resolve-modules | 1 · Can a saved visit be edited or deleted later? By whom? Cancelled visits? | OI-92 |  |
| A105 | resolve-modules | 2 · Which visit lists/numbers, split by what? Week start, time zone (OI-19)? | OI-93 | week start/time zone in OI-19 |
| A106 | resolve-modules | 3 · Master system for visits, calendar display (OI-41), owner of the link? | OI-94 |  |
| A107 | resolve-modules | 4 · Competitor info on a visit (OI-22): free text or structured? | OI-22 |  |
| A108 | resolve-modules | 5 · Offline on weak network (OI-42)? Which devices? Photos or check-in location? | OI-42 |  |
| A112 | resolve-modules | What must follow-ups fix, and which number should move? | OI-95 |  |
| A113 | resolve-modules | Who owns follow-ups, who only views, how many per role? | OI-96 |  |
| A114 | resolve-modules | Is an opportunity's or visit's next action the same thing as a follow-up? (OI-21) | OI-21 |  |
| A115 | resolve-modules | On what can a follow-up be raised? | OI-97 |  |
| A116 | resolve-modules | Follow-up stages, first to last; which are final? | OI-98 |  |
| A117 | resolve-modules | Follow-up flags: which day starts 'this week', and whose time zone sets 'today'? (OI-19) | OI-19 |  |
| A118 | resolve-modules | Which flag for a follow-up due after this week? | OI-99 |  |
| A119 | resolve-modules | Reminder to the owner: when, how often, which channel? (OI-20) | OI-20 |  |
| A120 | resolve-modules | Who else is told when a follow-up is overdue? Does anything need approval? | OI-100 |  |
| A121 | resolve-modules | Can the owner move the deadline or hand the follow-up to someone else? Can a completed one be reopened? | OI-101 |  |
| A122 | resolve-modules | Which follow-up lists or numbers are checked, and split by what? | OI-102 |  |
| A123 | resolve-modules | Which system is the master for follow-ups? Must follow-ups show in the calendar (which one), and who owns that link? | OI-103 |  |
| A124 | resolve-modules | How many follow-ups a month, and at peak? | OI-44 | follow-up volumes not explicit in OI-44 |
| A125 | resolve-modules | Where are follow-ups set and closed? Must it work offline? | OI-42 |  |
| A130 | resolve-modules | Is competitor tracking in scope for the first go-live? | OI-22 |  |
| A131 | resolve-modules | What should competitor tracking fix, and which number shows it works? | OI-104 |  |
| A132 | resolve-modules | Where is competitor info entered: visit, opportunity, or both? | OI-22 |  |
| A133 | resolve-modules | Who records competitor info, who only views it, how many each? | OI-105 |  |
| A134 | resolve-modules | Is the competitor picked from a fixed list or typed free? | OI-106 |  |
| A135 | resolve-modules | Competitor price: per product, and in which currency? | OI-22 |  |
| A136 | resolve-modules | Is 'reason for winning or losing' the same as the Won/Lost reason on the opportunity? | OI-107 |  |
| A137 | resolve-modules | Does anything need approval, and who is told when an entry is added? | OI-108 |  |
| A138 | resolve-modules | Can a saved entry be edited or deleted, by whom? Duplicate competitor? | OI-109 |  |
| A139 | resolve-modules | Which competitor lists or numbers are checked, split by what? | OI-110 |  |
| A140 | resolve-modules | Does a competitor entry go through stages, or is it just saved? | OI-111 |  |
| A141 | resolve-modules | Is the CRM the only place competitor info is kept, or another system/sheet? | OI-112 |  |
| A142 | resolve-modules | How many competitor entries a month? Phone on site or desk? | OI-113 |  |
| A143 | resolve-modules | Is there an existing competitor sheet to load at go-live? | OI-35 | competitor sheet in migration OI |
| A145 | resolve-modules | Does Rania confirm the COMP Requirements and priorities? | OI-56 |  |
| A149 | resolve-modules | Is the registration and tender tracker in the first go-live? | OI-23 |  |
| A150 | resolve-modules | Are a registration and a tender one record or two? | OI-23 |  |
| A151 | resolve-modules | What goes wrong today, and which number should move? | OI-115 |  |
| A152 | resolve-modules | Who updates registrations and tenders, who only views, how many people each? | OI-116 |  |
| A153 | resolve-modules | Walk the last real one: who started it, what next, where did it end? Does a tender become an opportunity? | OI-117 |  |
| A154 | resolve-modules | What stages does a registration go through, first to last? Which are final? | OI-118 |  |
| A155 | resolve-modules | Does anything need approval? Who must be told when expected approval date or tender date nears? | OI-119 |  |
| A156 | resolve-modules | What happens when an authority rejects a registration, or an approved one expires? Can a closed record be reopened, by whom? | OI-120 |  |
| A157 | resolve-modules | Which lists or numbers do you check, split by what? | OI-121 |  |
| A158 | resolve-modules | Is the CRM the only place this is kept, or does another sheet/system hold it? Who owns that link? | OI-122 |  |
| A159 | resolve-modules | How many registrations and tenders a year? Entered on phone on site or at desk? | OI-123 |  |
| A160 | resolve-modules | Is there an existing registration / tender sheet to load at go-live? | OI-35 | registration sheet in migration OI |
| A167 | resolve-modules-more | 1. What goes wrong today with market news, and which number shows MKT works? | OI-125 |  |
| A168 | resolve-modules-more | 2. What is one entry: a buying signal, a market update, or both as one record with a type? | OI-24 |  |
| A169 | resolve-modules-more | 3. What does each entry link to? | OI-24 |  |
| A170 | resolve-modules-more | 4. Who posts, who only reads, who must never see it? How many each? | OI-126 |  |
| A171 | resolve-modules-more | 5. Who is told when an entry is posted, and how? | OI-127 |  |
| A172 | resolve-modules-more | 1. Does an entry go through stages, and which are final? | OI-128 |  |
| A173 | resolve-modules-more | 2. Does anything need approval before the team sees it? Who approves? | OI-129 |  |
| A174 | resolve-modules-more | 3. Who may edit or delete a posted entry? | OI-130 |  |
| A175 | resolve-modules-more | 4. Which lists or numbers will you check, split by what? | OI-131 |  |
| A176 | resolve-modules-more | 5. Is the CRM the only place market news is kept, or does a sheet / other system hold it? Who owns that link? | OI-132 |  |
| A177 | resolve-modules-more | 1. How do people share market news today (last real example)? | OI-133 |  |
| A178 | resolve-modules-more | 2. When a buying signal is posted, should it become a lead or opportunity? Who decides? | OI-134 |  |
| A179 | resolve-modules-more | 3. How many entries a month, and entered on phone in the field or at desk? | OI-135 |  |
| A180 | resolve-modules-more | Bulk confirm MKT-01..MKT-05 (yes to all or edits by ID) | OI-56 |  |
| A183 | resolve-modules-more | What should dashboards fix, and which number shows it works? | OI-137 |  |
| A184 | resolve-modules-more | Targets: period, value or quantity, who sets them? | OI-25 |  |
| A185 | resolve-modules-more | Weighted pipeline: how worked out? | OI-05 |  |
| A186 | resolve-modules-more | What counts as an actual order? And conversion ratio = ? | OI-26 | conversion ratio in OI-27 |
| A187 | resolve-modules-more | Who sees which dashboard, how many in each role; is Head of Sales same as Sales head? | OI-138 | dashboard access part in OI-32 |
| A188 | resolve-modules-more | Target change mid-period, by whom; leaver's target moves to whom? | OI-139 |  |
| A189 | resolve-modules-more | Target approval; who is told when set or behind? | OI-140 |  |
| A190 | resolve-modules-more | Meaning of at-risk customer, delayed deal, Business Development, People | OI-28 |  |
| A191 | resolve-modules-more | Who owns Tally link for collections/outstanding; freshness? | OI-141 |  |
| A192 | resolve-modules-more | How often dashboards checked, desk/phone, live figures? | OI-142 |  |
| A193 | resolve-modules-more | Does a target go through stages, or is it just set? | OI-143 |  |
| A194 | resolve-modules-more | TO-BE target/dashboard flow right? | OI-144 |  |

## Problems

None.

## Maintainer spot-check

Open ~10 rows above (mix of match, missed, extras), read both sides, tick when the judge was right.

- [ ] Spot-check done · judge wrong on: ___ · approved by: ___

## Data

```json
{
  "case": "anglo-gulf-crm",
  "date": "2026-10-29",
  "branch": "main",
  "verdict": "fail",
  "metrics": {
    "valid": 0,
    "uncited": 0,
    "invented": 3,
    "dontKnow": 0,
    "mechanics": 0,
    "replay": 0,
    "recall": 96.4,
    "openItems": 89.3,
    "modules": 81.8,
    "mapping": null
  },
  "failures": [
    "Invented facts: 3 (max 0)"
  ]
}
```
