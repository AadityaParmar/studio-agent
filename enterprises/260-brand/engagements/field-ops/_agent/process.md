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
| quality | Quality Manager | Quality Manager | person | | WS-9 |
| customer | Customer | Customer | external | | RFP-1 |
| sap | SAP / ERP | SAP | external | | RFP-1, IN-1, WS-14 |

## MST — Masters

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-route | owner | MST | Add Route | | step | OI-17 | RFP-1 |
| add-beat | owner | MST | Add Beat | Picks a Route | step | OI-17 | RFP-1 |
| add-customer | owner | MST | Add Customer | Picks a Beat; Route fills | step | OI-17 | RFP-1 |
| add-product | owner | MST | Add Product | Category from Category Master | step | OI-18 | RFP-1 |
| add-employee | owner | MST | Add Employee | Picks Beats; leave balances | step | OI-17, OI-22 | RFP-1 |
| add-category | owner | MST | Add Category | Feeds Product and Competitor Masters | step | OI-17 | RFP-1 |
| geo-tag-customer | owner | MST | GEO tag Customer | Done in neome app; who and when open | step | OI-21 | RFP-1, IN-1 |
| add-store | owner | MST | Add Store | Modern trade stores | step | OI-17, OI-20 | RFP-1 |
| add-competitor | owner | MST | Add Competitor and its products | | step | OI-19 | RFP-1 |

## BEAT — Beat Planning

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| assign-beats | supervisor | BEAT | Assign Beats | Employee - Beat Mapping; one Sales Agent per Beat; no approval | step | | RFP-1, IN-1, WS-1 |
| plan-week | supervisor | BEAT | Make Weekly Beat Plan | Beat per weekday, Monday to Saturday | step | | WS-1 |
| see-todays-beat | agent | BEAT | See today's Beat | Works offline; customers of mapped Beats | step | | WS-1 |
| make-beat-inactive | owner | BEAT | Make Beat inactive | Employees unmapped; customers stay | step | OI-72 | WS-1 |
| move-customers | supervisor | BEAT | Move customers to another Beat | After a Beat goes inactive | step | | WS-1 |

## ATT — Attendance

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| clock-in | employee | ATT | Clock in with photo and GPS | Arrival Status OnTime / Late; works offline | step | | RFP-1, WS-2 |
| clock-out | employee | ATT | Clock out with photo and GPS | | step | | RFP-1, WS-2 |
| fix-clock-out | supervisor | ATT | Fix Missed Clock-out time | App clocks out at 23:59 and marks Missed Clock-out | step | | WS-2 |
| add-overtime | employee | ATT | Request overtime | After 17:00 weekdays or Sunday; Status Pending | step | | RFP-1, WS-2 |
| approve-overtime | supervisor | ATT | Approve overtime? | Pending → Approved / Rejected; 48 h then Area Sales Manager | decision | | WS-2 |

## LEAVE — Leave Management

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| set-leave-balance | owner | LEAVE | Set leave balances | Casual 12, Sick 10 a year, credited 1 Jan; Casual carries forward max 5 | step | | WS-3 |
| maintain-holidays | owner | LEAVE | Keep yearly holiday list | Zambia public holidays; not counted in leave | step | | WS-3 |
| apply-leave | employee | LEAVE | Apply Leave | Balance shown; Half Day = 0.5 day; beyond balance = Unpaid Leave; Sundays and holidays not counted | step | | RFP-1, WS-3 |
| cancel-leave | employee | LEAVE | Cancel own Pending leave | Approved leave cannot be cancelled by the Employee | step | | WS-3 |
| approve-leave | supervisor | LEAVE | Approve leave? | Pending → Approved / Rejected; 48 h then Area Sales Manager | decision | | RFP-1, WS-3 |
| update-leave-balance | supervisor | LEAVE | Update Leave Balance | On approval | step | | RFP-1, WS-3 |
| notify-leave-decision | employee | LEAVE | Get push: leave approved or rejected | | step | | WS-3 |

## INV — Inventory

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| view-depot-stock | supervisor | INV | View depot stock | Read only, from SAP every 30 min; Supervisor and above | step | | WS-4 |
| assign-inventory | supervisor | INV | Assign Inventory | Quantity per product to own Sales Agent; Total Amount = quantity x Price; no approval | step | | RFP-1, WS-4 |
| reduce-inventory | agent | INV | Order reduces Sales Agent Inventory | Order cannot exceed stock; cancel before Invoiced puts it back | step | | WS-4 |
| stock-return | agent | INV | Stock Return | End of day, unsold stock; Pending | step | | RFP-1, WS-4 |
| accept-return | supervisor | INV | Count and accept Stock Return | Counted quantity entered; Pending → Accepted | step | | WS-4 |

## VB — Visit Book

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-visit | agent | VB | Add Visit | Customer from own mapped Beats, today's Beat first; GPS location; works offline | step | | RFP-1, WS-5 |
| record-no-order | agent | VB | Record no-order reason | Shop closed, Stock enough, No money, Owner not there, Other | step | | WS-5 |
| place-order | agent | VB | Place Order | Items from Sales Agent Inventory with customer price; price list from SAP, without VAT; cannot exceed stock | step | | RFP-1, WS-4, WS-5 |
| take-payment | agent | VB | Take Payment | Cash, Mobile Money, Bank Transfer, Cheque; Credit for Category A and B within limit; part payment; change | step | | RFP-1, WS-5 |
| generate-invoice | agent | VB | Generate invoice | In neome, INV-<agent code>-<seq>, VAT 16%; Placed to Invoiced | step | | RFP-1, IN-1, WS-5 |
| send-invoice | agent | VB | Send invoice to customer | PDF on WhatsApp; print on Bluetooth printer | step | | WS-5 |
| deliver-order | agent | VB | Deliver order | Invoiced to Delivered; van sale: same visit | step | | WS-5 |
| cancel-order | supervisor | VB | Cancel order | Only before Invoiced; quantity goes back to Sales Agent Inventory; push to agent | step | | WS-5 |

## LEAD — Leads

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-lead | agent | LEAD | Add Lead | Shop, owner, phone, address, GEO, Category, notes; Status New | step | | RFP-1, WS-6 |
| follow-up-lead | agent | LEAD | Follow up Lead | Status: New, Contacted, Interested, Lost | step | | WS-6 |
| convert-lead | agent | LEAD | Convert Lead to Customer | Raises a Change Request; Lead Converted | step | | WS-6 |
| approve-lead-customer | supervisor | LEAD | Approve new Customer | Change Request approved; push to agent | step | | WS-6 |
| view-leads | supervisor | LEAD | View Lead Sheet/Report | Own Leads for agent; all for Supervisor and above; Excel | step | | RFP-1, WS-6 |

## MKT — Marketing Visits

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-marketing-visit | rider | MKT | Add Marketing Visit | Pick Beat; existing Customer or new person; Visit type; GPS, photo; Marketing Visit Sheet | step | | RFP-1, WS-7 |
| add-field-visit | rider | MKT | Add School / Farm / Door to door Visit | Goal: sampling and brand awareness | step | | RFP-1, WS-7 |
| agent-marketing-visit | agent | MKT | Add Marketing Visit | Sales Agent may also record it | step | | RFP-1, WS-7 |
| view-marketing-visits | supervisor | MKT | View Marketing Visit Sheet | Own for rider or agent; all for Supervisor and above; Sales Head report; Excel | step | | RFP-1, WS-7 |

## MT — Modern Trade

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| mt-check-in | agent | MT | Check In at Store | Store = Customer flagged Modern Trade; GPS within 200 m | step | | RFP-1, WS-8 |
| mt-record | agent | MT | Shelf images, stock count, competitor activities | Up to 5 images; offline | step | | RFP-1, WS-8 |
| mt-check-out | agent | MT | Check out and submit | Summary; GPS within 200 m; status Submitted | step | | RFP-1, WS-8 |
| mt-review | supervisor | MT | Supervisor review | Approve (final) or Send back with comment | step | | RFP-1, WS-8 |

## CMP — Customer Complaints

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-complaint | agent | CMP | Add complaint | Complaint Sheet; ComplaintId from neome; works offline; status Open | step | | RFP-1, WS-9 |
| investigate-complaint | quality | CMP | Investigate complaint | Under Investigation; fills Operator and Shift | step | | WS-9 |
| resolve-complaint | quality | CMP | Resolve complaint | Resolved; resolution note; target 72 hours | step | | WS-9 |
| close-complaint | quality | CMP | Close complaint | Closed after customer is told; final | step | | WS-9 |

## FB — Feedback

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| set-feedback-questions | owner | FB | Set feedback questions | Fixed list; Owner can change it | step | | WS-10 |
| record-feedback | agent | FB | Record feedback | Customer gives it; rating 1 to 5 and optional comment per question; works offline; editable same day | step | OI-82 | RFP-1, WS-10 |
| view-feedback | supervisor | FB | View Feedback Sheet | Sales Supervisor and above see all; average rating per question | step | | WS-10 |

## RPT — Reports and Dashboards

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| set-targets | supervisor | RPT | Set monthly targets | Sales Head sets per Sales Agent, by value and quantity per product group; changeable until month end | step | | WS-11 |
| view-reports | owner | RPT | View reports and dashboards | Owner and managers by scope; filters; Excel export (RFP-1 says "Admin") | step | | RFP-1, WS-11 |
| view-incentive | owner | RPT | View Incentive | 2% at 100% or more of target, 1% at 80 to 99%, none below | step | | WS-11 |

## COM — Communication

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| send-whatsapp | customer | COM | Get WhatsApp message | Invoice PDF (the order confirmation); complaint Resolved message; retried 3 times, then Failed; none without a mobile number | external | | RFP-1, WS-12 |
| resend-whatsapp | quality | COM | Send WhatsApp again | After Failed; Quality Manager or Sales Agent | step | | WS-12 |
| post-notice | owner | COM | Post notice | Owner to All, Area or role; Sales Head to an Area; poster can edit or remove; no approval | step | | RFP-1, WS-12 |
| get-notice | agent | COM | See notice on Notice Board | In app plus push to the audience; readable offline once synced | step | | WS-12 |
| push-notify | agent | COM | Get push notification | Order cancelled, Change Request decision, target set, new notice; leave decision in LEAVE | step | | RFP-1, WS-12 |

## AI — AI Features

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| voice-fill | agent | AI | Fill order or complaint form by voice | English or Nyanja; fills the Visit Book order or Complaint form; user checks and saves | step | | RFP-1, WS-13 |
| planogram-suggest | supervisor | AI | Get planogram suggestion | From the Modern Trade shelf photo: shelf share and missing products; Sales Supervisor uses it, no approval | step | | WS-8, WS-13 |
| ask-neome | owner | AI | Ask Neome | Owner, Sales Head, Area and Regional Sales Manager; read only; own region or area | step | | RFP-1, WS-13 |

## SAP — SAP Integration

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| load-initial-data | sap | | Load existing SAP data | Customers, products, employees, open balances per customer; no order history | external | | IN-1, WS-14 |
| sync-masters | sap | | Sync customers, products, employees | Via plugin; SAP to neome every 30 min; SAP wins a clash; new Customers only after Change Request approval | external | | RFP-1, IN-1, WS-14 |
| sync-prices | sap | | Fetch price lists, credit limits, open balances | SAP to neome every 30 min, with customers and products | external | | WS-14 |
| sync-stock | sap | | Sync stock | SAP to neome only, every 30 min; neome never writes stock | external | | RFP-1, WS-14 |
| invoice-in-sap | sap | | Invoice visible in SAP | Retry on failure; shows Waiting to sync | external | | RFP-1, IN-1, WS-14 |
| check-failed-sync | owner | SAP | Check Failed records | SAP message in the dashboard; retried each cycle; no other notification | step | | WS-14 |

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
| add-visit | record-no-order | no order | yes | WS-5 |
| place-order | take-payment | | no | RFP-1 |
| take-payment | generate-invoice | | no | WS-5 |
| generate-invoice | invoice-in-sap | pushed at once, retry on failure | no | RFP-1, IN-1, WS-5 |
| generate-invoice | send-invoice | | no | WS-5 |
| generate-invoice | deliver-order | | no | WS-5 |
| place-order | cancel-order | before Invoiced | yes | WS-5 |
| cancel-order | reduce-inventory | quantity back | yes | WS-4, WS-5 |
| invoice-in-sap | view-reports | | no | RFP-1, WS-11 |
| send-invoice | send-whatsapp | invoice PDF | no | WS-5, WS-12 |
| sync-masters | add-customer | SAP to neome, every 30 min | yes | RFP-1, IN-1, WS-14 |
| add-customer | sync-masters | neome to SAP, after Change Request approval | yes | RFP-1, IN-1, WS-14 |
| sync-masters | add-product | SAP to neome, every 30 min | yes | RFP-1, IN-1, WS-14 |
| add-product | sync-masters | neome to SAP, direct | yes | RFP-1, IN-1, WS-14 |
| sync-masters | add-employee | SAP to neome, every 30 min | yes | RFP-1, IN-1, WS-14 |
| add-employee | sync-masters | neome to SAP, direct | yes | RFP-1, IN-1, WS-14 |
| load-initial-data | sync-masters | then every 30 min | no | IN-1, WS-14 |
| sync-masters | sync-prices | with customers and products | no | WS-14 |
| sync-masters | check-failed-sync | SAP rejects a record | yes | WS-14 |
| invoice-in-sap | check-failed-sync | SAP rejects the invoice | yes | WS-14 |
| add-category | add-product | | yes | RFP-1 |
| add-category | add-competitor | | yes | RFP-1 |
| add-customer | geo-tag-customer | | yes | IN-1 |
| add-store | mt-check-in | | yes | RFP-1, WS-8 |
| add-competitor | mt-record | competitor activities | yes | RFP-1, WS-8 |
| sync-stock | view-depot-stock | SAP to neome, every 30 min | no | WS-4, WS-14 |
| view-depot-stock | assign-inventory | | no | WS-4 |
| assign-inventory | stock-return | unsold stock, end of day | yes | RFP-1, WS-4 |
| place-order | reduce-inventory | order placed | no | WS-4 |
| stock-return | accept-return | | no | WS-4 |
| add-visit | add-complaint | complaint | yes | RFP-1 |
| add-visit | record-feedback | feedback | yes | RFP-1 |
| set-feedback-questions | record-feedback | question list | no | WS-10 |
| record-feedback | view-feedback | | no | WS-10 |
| add-visit | add-lead | new lead | yes | RFP-1 |
| add-lead | follow-up-lead | | no | WS-6 |
| follow-up-lead | convert-lead | interested | no | WS-6 |
| convert-lead | approve-lead-customer | Change Request | no | WS-6 |
| approve-lead-customer | sync-masters | new Customer, neome to SAP | no | WS-6, WS-14 |
| add-lead | view-leads | | yes | RFP-1, WS-6 |
| add-complaint | investigate-complaint | | no | WS-9 |
| investigate-complaint | resolve-complaint | | no | WS-9 |
| resolve-complaint | send-whatsapp | resolution message | no | RFP-1, WS-9 |
| send-whatsapp | close-complaint | customer told | no | WS-9 |
| send-whatsapp | resend-whatsapp | Failed after 3 tries | yes | WS-12 |
| post-notice | get-notice | in app plus push | no | WS-12 |
| post-notice | push-notify | new notice | no | WS-12 |
| cancel-order | push-notify | order cancelled | yes | WS-5, WS-12 |
| set-targets | push-notify | target set | no | WS-11, WS-12 |
| resolve-complaint | close-complaint | no mobile number | yes | WS-9 |
| assign-beats | add-marketing-visit | | yes | RFP-1 |
| add-marketing-visit | view-marketing-visits | | yes | WS-7 |
| agent-marketing-visit | view-marketing-visits | | yes | WS-7 |
| add-field-visit | view-marketing-visits | | yes | WS-7 |
| clock-in | clock-out | | no | RFP-1 |
| clock-out | add-overtime | | yes | RFP-1 |
| clock-in | fix-clock-out | no clock out by 23:59 | yes | WS-2 |
| add-overtime | approve-overtime | | no | WS-2 |
| set-leave-balance | apply-leave | | no | WS-3 |
| maintain-holidays | apply-leave | days not counted | yes | WS-3 |
| apply-leave | approve-leave | | no | RFP-1, WS-3 |
| apply-leave | cancel-leave | | yes | WS-3 |
| approve-leave | update-leave-balance | approved | no | RFP-1, WS-3 |
| approve-leave | notify-leave-decision | approved or rejected | no | WS-3 |
| mt-check-in | mt-record | | no | RFP-1, WS-8 |
| mt-record | mt-check-out | | no | RFP-1, WS-8 |
| mt-check-out | mt-review | | no | RFP-1, WS-8 |
| mt-review | mt-record | sent back with comment | yes | WS-8 |
| mt-record | planogram-suggest | shelf images | yes | WS-8, WS-13 |
| voice-fill | place-order | fills order form | yes | WS-13 |
| voice-fill | add-complaint | fills complaint form | yes | WS-13 |
| assign-beats | plan-week | | no | WS-1 |
| plan-week | see-todays-beat | | no | WS-1 |
| see-todays-beat | add-visit | customer from Beat | no | RFP-1, WS-1 |
| make-beat-inactive | move-customers | | yes | WS-1 |
| move-customers | assign-beats | remap employees | yes | (proposed, to confirm) |
| set-targets | view-reports | targets | no | WS-11 |
| view-reports | view-incentive | month end | no | WS-11 |
