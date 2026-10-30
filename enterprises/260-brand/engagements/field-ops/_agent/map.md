# Map: Field Operations

lock: Aditya Parmar · build-brd · 2026-10-30T11:53Z

## Destination

A signed-off BRD for Field Operations.

## Notes

- RFP-1 marks 16 of 34 scope items "Completed" (already built?) and 18 "Pending"; scope of this BRD hangs on OI-01.
- RFP-1 names Mitesh (Lead Owner) and Khushal (Prepared by); signature blank (OI-66).
- IN-1 is a subset of RFP-1 §8 (SAP Integration Process), minus stock sync (OI-09).
- RFP-1 diagrams sometimes name a different actor than the text (Modern Trade, Marketing Visit): OI-42, OI-46.
- RFP-1 has 3 unused images (image21-23) not placed in the document; ignored.
- Ingest ran local only: repo has no git remote, no pull/push.

## Modules

| Prefix | Module | Status |
|---|---|---|
| MST | Masters | resolved |
| BEAT | Beat Planning | resolved |
| ATT | Attendance | resolved |
| LEAVE | Leave Management | resolved |
| INV | Inventory | resolved |
| VB | Visit Book | resolved |
| LEAD | Leads | resolved |
| MKT | Marketing Visits | resolved |
| MT | Modern Trade | resolved |
| CMP | Customer Complaints | resolved |
| FB | Feedback | resolved |
| RPT | Reports and Dashboards | resolved |
| COM | Communication | resolved |
| AI | AI Features | resolved |
| SAP | SAP Integration | resolved |

## Change log

- 2026-10-29: Engagement created.
- 2026-10-29: ingest: 2 Sources, 15 Modules drafted.
- 2026-10-29: review-draft: 15 Modules confirmed, process skeleton, topics, plan skeleton.
- 2026-10-29: review-draft: MST confirmed.
- 2026-10-29: review-draft: BEAT confirmed.
- 2026-10-29: review-draft: ATT confirmed.
- 2026-10-29: review-draft: LEAVE confirmed.
- 2026-10-29: review-draft: INV confirmed.
- 2026-10-29: review-draft: LEAD confirmed.
- 2026-10-29: review-draft: MKT confirmed.
- 2026-10-29: review-draft: MT confirmed.
- 2026-10-29: review-draft: CMP confirmed.
- 2026-10-29: review-draft: FB confirmed.
- 2026-10-29: review-draft: VB confirmed.
- 2026-10-29: review-draft: RPT confirmed.
- 2026-10-29: review-draft: COM confirmed.
- 2026-10-29: review-draft: AI confirmed.
- 2026-10-29: review-draft: SAP confirmed.
- 2026-10-30: resolve-module: MST claimed by Aditya Parmar.
- 2026-10-30: resolve-module: MST resolved.
- 2026-10-30: resolve-module: BEAT claimed by Aditya Parmar.
- 2026-10-30: resolve-module: BEAT resolved.
- 2026-10-30: resolve-module: ATT claimed by Aditya Parmar.
- 2026-10-30: resolve-module: ATT resolved.
- 2026-10-30: resolve-module: LEAVE claimed by Aditya Parmar.
- 2026-10-30: resolve-module: LEAVE resolved.
- 2026-10-30: resolve-module: INV claimed by Aditya Parmar.
- 2026-10-30: resolve-module: INV resolved.
- 2026-10-30: resolve-module: VB claimed by Aditya Parmar.
- 2026-10-30: resolve-module: VB resolved.
- 2026-10-30: resolve-module: LEAD claimed by Aditya Parmar.
- 2026-10-30: resolve-module: LEAD resolved.
- 2026-10-30: resolve-module: MKT claimed by Aditya Parmar.
- 2026-10-30: resolve-module: MKT resolved.
- 2026-10-30: resolve-module: MT claimed by Aditya Parmar.
- 2026-10-30: resolve-module: MT resolved.
- 2026-10-30: resolve-module: CMP claimed by Aditya Parmar.
- 2026-10-30: resolve-module: CMP resolved.
- 2026-10-30: resolve-module: FB claimed by Aditya Parmar.
- 2026-10-30: resolve-module: FB resolved.
- 2026-10-30: resolve-module: RPT claimed by Aditya Parmar.
- 2026-10-30: resolve-module: RPT resolved.
- 2026-10-30: resolve-module: COM claimed by Aditya Parmar.
- 2026-10-30: resolve-module: COM resolved.
- 2026-10-30: resolve-module: AI claimed by Aditya Parmar.
- 2026-10-30: resolve-module: AI resolved.
- 2026-10-30: resolve-module: SAP claimed by Aditya Parmar.
- 2026-10-30: resolve-module: SAP resolved.
- 2026-10-30: questionnaire: QN-2026-10-30 to Mitesh, 28 Open Item(s).
- 2026-10-30: ingest: MST needs revisit: OI-14, OI-15, OI-17, OI-21 and OI-71 answered: category and classification values, TPIN rules, master ownership and customer GEO capture; master pain/KPI [QA-1]
- 2026-10-30: ingest: BEAT needs revisit: OI-72 answered: Active/Inactive status and linked records when a Beat is inactive [QA-1]
- 2026-10-30: ingest: VB needs revisit: OI-76 answered: retain visit, order and invoice records for an estimated 7 years [QA-1]
- 2026-10-30: ingest: MKT needs revisit: OI-77 answered: estimate 40 Marketing Visits/day, up to 80 in peak season [QA-1]
- 2026-10-30: ingest: MT needs revisit: OI-78 answered: estimate 30 Modern Trade updates/day across about 20 Stores [QA-1]
- 2026-10-30: ingest: CMP needs revisit: OI-79 answered: estimate 5 complaints/day [QA-1]
- 2026-10-30: ingest: FB needs revisit: OI-81 answered: estimate 30 feedback records/day; OI-82 confirms feedback links to a Customer [QA-1]
- 2026-10-30: ingest: RPT needs revisit: OI-84 answered: estimate 10 report users, each opening reports about 4 times/day [QA-1]
- 2026-10-30: ingest: COM needs revisit: OI-85 answered: estimate 10 notices/week [QA-1]
- 2026-10-30: resolve-module: MST claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: MST resolved (revisit).
- 2026-10-30: resolve-module: BEAT claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: BEAT resolved (revisit).
- 2026-10-30: resolve-module: VB claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: VB resolved (revisit).
- 2026-10-30: resolve-module: MKT claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: MKT resolved (revisit).
- 2026-10-30: resolve-module: MT claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: MT resolved (revisit).
- 2026-10-30: resolve-module: CMP claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: CMP resolved (revisit).
- 2026-10-30: resolve-module: FB claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: FB resolved (revisit).
- 2026-10-30: resolve-module: RPT claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: RPT resolved (revisit).
- 2026-10-30: resolve-module: COM claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: COM resolved (revisit).
- 2026-10-30: BRD v1 released: First full BRD for Field Operations, for 260 Brands review
- 2026-10-30: ingest: INV needs revisit: OI-11 already answered in SAP integration: customers, products, employees and stock sync every 30 minutes; invoices sent near real time [WS-14]
- 2026-10-30: resolve-module: INV claimed by Aditya Parmar (revisit).
- 2026-10-30: resolve-module: INV resolved (revisit).
