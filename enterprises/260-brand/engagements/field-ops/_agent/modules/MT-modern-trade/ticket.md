---
status: claimed
prefix: MT
name: Modern Trade
blockedBy: [MST]
revisitReason:
formerly:
claimedBy: Aditya Parmar
---

# MT — Modern Trade

Name: Modern Trade

## 1 Purpose and KPIs

- Purpose: Daily modern trade updates per Store: shelf photos, stock count, competitor activities and supervisor review, giving Closing Stock Inventory. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Submits daily modern trade updates | | [RFP-1] |
| Sales Supervisor | Adds Modern Trade (per diagram); reviews (RFP-1 says "Supervisor"; OI-04, OI-46) | | (proposed, to confirm) |

## 3 Process

- Sales Agent: Modern Trade (Product Master) → Closing Stock Inventory. [RFP-1]
- Modern Trade diagram: Supervisor: Add Modern Trade → Modren Trade Sheet. [RFP-1]
- Modern Trade (Closing stock) marked Completed in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Modern Trade | Date | date | yes | | [RFP-1] |
| Modern Trade | Employee | person | yes | | [RFP-1] |
| Modern Trade | Store | link-to-entity | yes | Links to: Store | [RFP-1] |
| Modern Trade | Check In | date | yes | OI-47 | [RFP-1] |
| Modern Trade | Shelf images | file | no | 5 images | [RFP-1] |
| Stock count | Product code | link-to-entity | yes | Links to: Product | [RFP-1] |
| Stock count | Shelf Stock Qty | number | no | | [RFP-1] |
| Stock count | Backroom Qty | number | no | | [RFP-1] |
| Stock count | Expiry Date | date | no | | [RFP-1] |
| Stock count | Total Qty | number | no | Shelf Stock Qty + Backroom Qty | [RFP-1] |
| Competitor activity | Competitor brand | link-to-entity | no | Links to: Competitor | [RFP-1] |
| Competitor activity | Product name | text | no | only products of the chosen brand, from Competitor Master | [RFP-1] |
| Competitor activity | Price | choice | no | checkbox; Yes → Shelf stock price | [RFP-1] |
| Competitor activity | Promo running | choice | no | checkbox; Yes → Promo details | [RFP-1] |
| Competitor activity | Camera | file | no | two camera fields | [RFP-1] |
| Modern Trade | Summary | text | no | | [RFP-1] |
| Modern Trade | Check out | date | no | OI-47 | [RFP-1] |
| Modern Trade | Supervisor name | person | no | | [RFP-1] |
| Modern Trade | Supervisor review | text | no | OI-46 | [RFP-1] |

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Closing Stock Inventory / Modren Trade Sheet | | Stock per Store per product | [RFP-1] |

## 11 Requirements

### MT-01 — Daily modern trade update

Statement: Field staff submit a daily Modern Trade update for a Store from the Store Master, with Check In, Check Out and Summary. [RFP-1]
Acceptance:
- An update is saved against one Store with check in and check out times. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-46, OI-47
Proposed: yes

### MT-02 — Shelf images

Statement: The update holds up to 5 images of the shelf. [RFP-1]
Acceptance:
- The user can attach 5 shelf images. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### MT-03 — Stock count grid

Statement: The update has a stock count grid per product with Shelf Stock Qty, Backroom Qty, Expiry Date and Total Qty = Shelf Stock Qty + Backroom Qty. [RFP-1]
Acceptance:
- Shelf 10 and Backroom 5 shows Total Qty 15. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: yes

### MT-04 — Competitor activities

Statement: The update records competitor activities (price, display, promotions): brand from Competitor Master, product limited to that brand, shelf price if Price is ticked, promo details if Promo running is ticked, and photos. [RFP-1]
Acceptance:
- Picking a competitor brand shows only that brand's products. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-19
Proposed: yes

### MT-05 — Supervisor review

Statement: Each update carries a Supervisor name and Supervisor review. [RFP-1]
Acceptance:
- A supervisor can add a review to a submitted update. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-46
Proposed: yes

### MT-06 — Closing Stock Inventory

Statement: Modern Trade updates give a Closing Stock Inventory sheet. [RFP-1]
Acceptance:
- The sheet shows Total Qty per product per Store for a date. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-48
Proposed: yes

## 13 Open Items

- OI-19: Who maintains Competitor Master.
- OI-20: Are Stores also Customers?
- OI-46: Who fills Modern Trade; what review does.
- OI-47: Check in/out time and location.
- OI-48: Does closing stock feed SAP / ERP?
- OI-64: AI planogram suggestions.
