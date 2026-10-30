# MT — Modern Trade

Prefix: MT
Name: Modern Trade
Status: resolved
Sources: RFP-1, WS-8, QA-1

## 1 Purpose and KPIs

- Purpose: Daily modern trade updates per Store: shelf photos, stock count, competitor activities and Sales Supervisor review, giving Closing Stock Inventory. [RFP-1, WS-8]
- KPI: Every Modern Trade visit is recorded at the Store with GPS check in and out and shelf photos; every update is reviewed by the Sales Supervisor; Closing Stock Inventory per Store without paper. [WS-8]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Fills the daily Modern Trade update at a Store; edits and submits again after Send back | 60 | [RFP-1, WS-8] |
| Sales Supervisor | Reviews each update: Approve or Send back with comment; maintains the Competitor Master | 8 | [WS-8] |
| Area Sales Manager | Sees all updates | 3 | [WS-8] |
| Regional Sales Manager | Sees all updates | 2 | [WS-8] |
| Sales Head | Sees all updates | 1 | [WS-8] |
| Owner | Sees all updates | 1 | [WS-8] |

Tricycle Riders do not do Modern Trade. [WS-8]

## 3 Process

- Sales Agent picks a Store, checks in, adds shelf images, stock count and competitor activities, checks out with a Summary, submits. [RFP-1, WS-8]
- Sales Supervisor reviews: Approve, or Send back with comment; the agent edits and submits again. [WS-8]
- Closing Stock Inventory comes from the stock counts. [RFP-1]
- Store = Customer flagged "Modern Trade" (Category Supermarket), from Masters. [WS-8]
- Hand-off in: Masters (Store, Product, Competitor Master). Hand-off out: Reports (Closing Stock Inventory), AI Features (planogram suggestion from shelf photo, OI-64 answered [WS-8]).
- Pain today: shelf checks kept on paper and WhatsApp; no proof the agent was at the Store; competitor activity not tracked. [WS-8]
- RFP-1 diagram shows a Supervisor adding the update; the Enterprise says the Sales Agent fills it. [RFP-1, WS-8]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Modern Trade | Date | date | yes | | [RFP-1] |
| Modern Trade | Employee | person | yes | The Sales Agent | [RFP-1, WS-8] |
| Modern Trade | Store | link-to-entity | yes | Links to: Customer (flagged Modern Trade) on the agent's Beats | [RFP-1, WS-8] |
| Modern Trade | Check In | date | yes | Time and GPS; within 200 m of the Store | [RFP-1, WS-8] |
| Modern Trade | Shelf images | file | no | Up to 5 images | [RFP-1, WS-8] |
| Modern Trade | Summary | text | no | | [RFP-1] |
| Modern Trade | Check out | date | no | Time and GPS; within 200 m of the Store | [RFP-1, WS-8] |
| Modern Trade | Supervisor name | person | no | The Sales Supervisor who reviews | [RFP-1, WS-8] |
| Modern Trade | Supervisor review | text | no | Comment; needed to Send back | [RFP-1, WS-8] |
| Modern Trade | Status | choice | yes | Values: Submitted / Approved / Sent back | [WS-8] |
| Stock count | Product code | link-to-entity | yes | Links to: Product | [RFP-1] |
| Stock count | Shelf Stock Qty | number | no | | [RFP-1] |
| Stock count | Backroom Qty | number | no | | [RFP-1] |
| Stock count | Expiry Date | date | no | | [RFP-1] |
| Stock count | Total Qty | number | no | Shelf Stock Qty + Backroom Qty | [RFP-1] |
| Competitor activity | Competitor brand | link-to-entity | no | Links to: Competitor | [RFP-1, WS-8] |
| Competitor activity | Product name | text | no | Only products of the chosen brand, from Competitor Master | [RFP-1, WS-8] |
| Competitor activity | Price | choice | no | Checkbox; Yes → Shelf stock price | [RFP-1] |
| Competitor activity | Promo running | choice | no | Checkbox; Yes → Promo details | [RFP-1] |
| Competitor activity | Camera | file | no | Two camera fields | [RFP-1] |

## 5 Statuses

Modern Trade:

| id | start/end | open (OI) | Source |
|---|---|---|---|
| submitted | start | | [WS-8] |
| sent-back | | | [WS-8] |
| approved | end | | [WS-8] |

| from | to | trigger | Source |
|---|---|---|---|
| submitted | approved | Sales Supervisor approves | [WS-8] |
| submitted | sent-back | Sales Supervisor sends back with comment | [WS-8] |
| sent-back | submitted | Sales Agent edits and submits again | [WS-8] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Near the Store | Check In or Check Out | GPS must be within 200 m of the Store | [WS-8] |
| Send back needs comment | Supervisor sends back | A comment is required | [WS-8] |
| No change after submit | Update is Submitted or Approved | Agent can change it only after Send back | [WS-8] |
| Total Qty | Shelf Stock Qty or Backroom Qty entered | Total Qty = Shelf Stock Qty + Backroom Qty | [RFP-1] |
| Competitor product | Brand picked | Only that brand's products are offered | [RFP-1, WS-8] |
| No extra push | Any update | No push for Modern Trade | [WS-8] |

## 7 Exceptions

- No network: updates are filled offline and sync when online. [WS-8]
- Agent more than 200 m from the Store: cannot check in or out. (proposed, to confirm)
- Competitor missing in the Competitor Master: the Sales Supervisor adds it. [WS-8]
- Approved update: final, no change. [WS-8]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Modern Trade Sheet | Sales Agent own; Sales Supervisor and above all | Updates; filters date, Store, area, supervisor, agent, product; Excel export | [RFP-1, WS-8] |
| Closing Stock Inventory | Sales Agent own; Sales Supervisor and above all | Total Qty per product per Store for a date; filters date, Store, area, supervisor, agent, product; Excel export; report only | [RFP-1, WS-8] |

## 9 Integrations

N/A: no integration; Closing Stock Inventory is report only and is not sent to SAP. [WS-8]

## 10 Volumes and NFRs

- 60 Sales Agents may fill updates; 8 Sales Supervisors review. [WS-8]
- Works offline; updates sync when online. [WS-8]
- Estimate 30 Modern Trade updates per day across about 20 Stores. [QA-1]

## 11 Requirements

### MT-01 — Daily Modern Trade update

Statement: A Sales Agent submits a daily Modern Trade update for a Store (a Customer flagged Modern Trade on the agent's Beats) with Check In, Check Out and Summary, each with time and GPS within 200 m of the Store; it works offline. [RFP-1, WS-8]
Acceptance:
- An update is saved against one Store with check in and check out time and GPS. [WS-8]
- Check In or Check Out more than 200 m from the Store is refused. [WS-8]
- An update filled offline appears after sync. [WS-8]
- Tricycle Riders cannot fill it. [WS-8]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-8
OIs: OI-78
Proposed: no

### MT-02 — Shelf images

Statement: The update holds up to 5 shelf images. [RFP-1, WS-8]
Acceptance:
- The user can attach up to 5 shelf images. [WS-8]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-8
Proposed: no

### MT-03 — Stock count grid

Statement: The update has a stock count grid per product with Shelf Stock Qty, Backroom Qty, Expiry Date and Total Qty = Shelf Stock Qty + Backroom Qty. [RFP-1, WS-8]
Acceptance:
- Shelf 10 and Backroom 5 shows Total Qty 15. [WS-8]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-8
Proposed: no

### MT-04 — Competitor activities

Statement: The update records competitor activities (price, display, promotions): brand from the Competitor Master kept by the Sales Supervisor, product limited to that brand, shelf price if Price is ticked, promo details if Promo running is ticked, and photos. [RFP-1, WS-8]
Acceptance:
- Picking a competitor brand shows only that brand's products. [WS-8]
- Only a Sales Supervisor can add a brand or product to the Competitor Master. [WS-8]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-8
Proposed: no

### MT-05 — Supervisor review

Statement: The Sales Supervisor reviews each Submitted update: Approve, or Send back with a comment; the agent edits and submits again; Approved is final. [RFP-1, WS-8]
Acceptance:
- A Sales Supervisor can Approve or Send back a Submitted update. [WS-8]
- Send back is refused without a comment. [WS-8]
- After Send back the Sales Agent can edit and submit again. [WS-8]
- An Approved update cannot be changed. [WS-8]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-8
Proposed: no

### MT-06 — Closing Stock Inventory

Statement: Modern Trade updates give a Closing Stock Inventory report per Store and product; the Sales Agent sees own, Sales Supervisor and above see all; it is report only and is not sent to SAP. [RFP-1, WS-8]
Acceptance:
- The report shows Total Qty per product per Store for a date. [WS-8]
- It filters by date, Store, area, supervisor, agent and product, and exports to Excel. [WS-8]
- Nothing goes to SAP. [WS-8]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-8
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Modern Trade update and Store → Outlet visit with GPS tag, shelf photo and stock check, on a Customer flagged Modern Trade (an Outlet); Check In / Check Out within 200 m as GPS-verified visit; stock count grid (Shelf, Backroom, Expiry, Total Qty), competitor activities (Competitor Master brand and product) and Submitted / Sent back / Approved review set up as extra fields, forms and an approval step (the App says modern trade uses different forms and approvals); Modern Trade Sheet and Closing Stock Inventory are not named App reports, set up as reports with filters and Excel export; offline capture as the App does (proposed, to confirm)

## 13 Open Items

N/A: no open Open Items.
