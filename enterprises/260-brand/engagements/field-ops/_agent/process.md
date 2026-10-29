# Process

Skeleton from `review-draft`. Each `resolve-module` refines its Module's section.

## Lanes

| id | name | who | kind | OI | Source |
|---|---|---|---|---|---|
| owner | Owner | Owner | person | OI-04 | RFP-1 |
| supervisor | Sales Supervisor | Sales Supervisor | person | OI-04 | RFP-1 |
| employee | Employee | Employee | person | OI-05 | RFP-1 |
| agent | Sales Agent | Sales Agent | person | | RFP-1 |
| rider | Tricycle Rider | Tricycle Rider | person | OI-42 | RFP-1 |
| customer | Customer | Customer | external | | RFP-1 |
| sap | SAP / ERP | SAP | external | OI-08 | RFP-1, IN-1 |

## MST — Masters

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-route | owner | MST | Add Route | | step | OI-17 | RFP-1 |
| add-beat | owner | MST | Add Beat | Picks a Route | step | OI-17 | RFP-1 |
| add-customer | owner | MST | Add Customer | Picks a Beat; Route fills | step | OI-17 | RFP-1 |
| add-product | owner | MST | Add Product | Category from Category Master | step | OI-18 | RFP-1 |
| add-employee | owner | MST | Add Employee | Picks Beats | step | OI-17 | RFP-1 |

## BEAT — Beat Planning

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| assign-beats | supervisor | BEAT | Assign Beats | Employee - Beat Mapping | step | OI-23 | RFP-1, IN-1 |

## ATT — Attendance

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| clock-in | employee | ATT | Clock in with photo | Arrival Status OnTime / Late | step | OI-25 | RFP-1 |
| clock-out | employee | ATT | Clock out with photo | | step | OI-28 | RFP-1 |
| add-overtime | employee | ATT | Add overtime | | step | OI-27 | RFP-1 |

## LEAVE — Leave Management

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| apply-leave | employee | LEAVE | Apply Leave | Balance shown | step | OI-30 | RFP-1 |
| approve-leave | supervisor | LEAVE | Approve leave? | Pending → Approved / Rejected | decision | OI-29 | RFP-1 |
| update-leave-balance | supervisor | LEAVE | Update Leave Balance | On approval | step | OI-22 | RFP-1 |

## INV — Inventory

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| assign-inventory | supervisor | INV | Assign Inventory | Sales Agent Inventory | step | OI-32 | RFP-1 |
| stock-return | agent | INV | Stock Return | | step | OI-33 | RFP-1 |

## VB — Visit Book

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-visit | agent | VB | Add Visit | Customer from assigned Beat | step | OI-39 | RFP-1 |
| place-order | agent | VB | Place Order | Items from assigned inventory | step | OI-35 | RFP-1 |
| take-payment | agent | VB | Take Payment | Amount collected, change | step | OI-37 | RFP-1 |
| generate-invoice | agent | VB | Generate invoice | In neome | step | OI-38 | RFP-1, IN-1 |

## LEAD — Leads

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-lead | agent | LEAD | Add Lead | Lead Sheet/Report | step | OI-41 | RFP-1 |

## MKT — Marketing Visits

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-marketing-visit | rider | MKT | Add Marketing Visit | Marketing Visit Sheet | step | OI-42 | RFP-1 |
| add-field-visit | agent | MKT | Add School / Farm / Door to door Visit | | step | OI-44 | RFP-1 |

## MT — Modern Trade

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| mt-check-in | agent | MT | Check In at Store | | step | OI-47 | RFP-1 |
| mt-record | agent | MT | Shelf images, stock count, competitor activities | | step | OI-46 | RFP-1 |
| mt-check-out | agent | MT | Check out | Summary | step | OI-47 | RFP-1 |
| mt-review | supervisor | MT | Supervisor review | | step | OI-46 | RFP-1 |

## CMP — Customer Complaints

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-complaint | agent | CMP | Add complaint | Complaint Sheet/Report | step | OI-50 | RFP-1 |
| resolve-complaint | owner | CMP | Resolve complaint | Who resolves unknown | step | OI-49 | (proposed, to confirm) |

## FB — Feedback

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| record-feedback | agent | FB | Record feedback | Question and Response | step | OI-52 | RFP-1 |

## RPT — Reports and Dashboards

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| view-reports | owner | RPT | View reports | RFP-1 says "Admin" | step | OI-53 | RFP-1 |

## COM — Communication

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| send-whatsapp | customer | COM | Get WhatsApp message | Order, payment, complaint resolution | external | OI-60 | RFP-1 |
| push-notify | owner | COM | Push notification / Notice Board | | step | OI-61 | RFP-1 |

## AI — AI Features

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| planogram-suggest | supervisor | AI | Get planogram suggestion | From Modern Trade | step | OI-64 | (proposed, to confirm) |
| ask-neome | owner | AI | Ask Neome | | step | OI-62 | RFP-1 |

## SAP — SAP Integration

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| sync-masters | sap | | Sync customers, products, employees | Both ways, via plugin | external | OI-10 | RFP-1, IN-1 |
| sync-stock | sap | | Sync stock | Both ways | external | OI-09 | RFP-1 |
| invoice-in-sap | sap | | Invoice visible in SAP | | external | OI-11 | RFP-1, IN-1 |

## Edges

| from | to | label | alternate | Source |
|---|---|---|---|---|
| add-route | add-beat | | no | RFP-1 |
| add-beat | add-customer | | no | RFP-1 |
| add-customer | add-product | | no | (proposed, to confirm) |
| add-product | add-employee | | no | (proposed, to confirm) |
| add-employee | assign-beats | | no | RFP-1 |
| assign-beats | assign-inventory | | no | RFP-1 |
| assign-inventory | add-visit | | no | RFP-1 |
| add-visit | place-order | order taken | no | RFP-1 |
| place-order | take-payment | | no | RFP-1 |
| take-payment | generate-invoice | | no | (proposed, to confirm) |
| generate-invoice | invoice-in-sap | | no | RFP-1, IN-1 |
| invoice-in-sap | view-reports | | no | (proposed, to confirm) |
| place-order | send-whatsapp | order confirmation | yes | RFP-1 |
| sync-masters | add-customer | SAP to neome | yes | RFP-1, IN-1 |
| add-customer | sync-masters | neome to SAP | yes | RFP-1, IN-1 |
| sync-stock | assign-inventory | | yes | RFP-1 |
| assign-inventory | stock-return | | yes | RFP-1 |
| add-visit | add-complaint | complaint | yes | RFP-1 |
| add-visit | record-feedback | feedback | yes | RFP-1 |
| add-visit | add-lead | new lead | yes | RFP-1 |
| add-complaint | resolve-complaint | | no | RFP-1 |
| resolve-complaint | send-whatsapp | resolution message | yes | RFP-1 |
| assign-beats | add-marketing-visit | | yes | RFP-1 |
| clock-in | clock-out | | no | RFP-1 |
| clock-out | add-overtime | | yes | RFP-1 |
| apply-leave | approve-leave | | no | RFP-1 |
| approve-leave | update-leave-balance | approved | no | RFP-1 |
| mt-check-in | mt-record | | no | RFP-1 |
| mt-record | mt-check-out | | no | RFP-1 |
| mt-check-out | mt-review | | no | RFP-1 |
| mt-record | planogram-suggest | shelf images | yes | (proposed, to confirm) |
