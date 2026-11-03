# Template bank changelog

One line per applied change, newest last. Written by the maintainer refine tool; `npm test` checks every line. Never edit or delete old lines.

Every line starting with `- ` outside a code fence is a change, so this header uses none. Line shape (fields split by ` | `):

```
- <YYYY-MM-DD> | <change> | <IDs> | <reason>
```

`<change>`: `add`, `enhance`, `split`, `merge`, `rename`, `retire`.

`<IDs>`: comma-separated Template bank IDs. `split`, `merge`, `rename` write `<old IDs> -> <new IDs>`; the right side is `replacedBy`. `add`, `enhance`, `retire` take no `->`. Rename = one old -> one new. Merge = old IDs -> the one kept ID (old names go to its `aliases`). Split = one old -> two or more new. Retire = ID gone, nothing replaces it.

`<reason>`: short, required. No client words (scrub check).

Example:

```
- 2026-11-03 | add | TMOD-leave | seen in NB-02, NB-04
- 2026-12-01 | merge | TMOD-leave-request -> TMOD-leave | same flow
```

## Changes

- 2026-11-03 | add | PAT-approval-by-status | Status list plus workflow branch stands in for approval in all seven Builds.
- 2026-11-03 | add | PAT-two-level-approval | Manager then HR approval with two status fields seen in NB-05.
- 2026-11-03 | add | PAT-act-on-status-change | Update-after branch on a changed status drives follow-up steps in NB-01, NB-03, NB-04, NB-05.
- 2026-11-03 | add | PAT-copy-fields-from-ref | Ref field with copied fields is used in every Build that links rows (NB-01 to NB-06).
- 2026-11-03 | add | PAT-admin-kept-pick-list | Admin-kept list sheets picked by ref seen in NB-01, NB-02, NB-04, NB-05, NB-06, NB-07.
- 2026-11-03 | add | PAT-chained-place-lists | Place tree by chained refs seen in NB-02, NB-04, NB-05, NB-06.
- 2026-11-03 | add | PAT-line-items-grid-with-totals | Grid lines with formula totals seen in every Build.
- 2026-11-03 | add | PAT-calculated-field | Formula fields for derived values seen in NB-01, NB-02, NB-04, NB-05, NB-06, NB-07.
- 2026-11-03 | add | PAT-show-field-by-value | Visibility rules by type or status seen in NB-01, NB-04, NB-05, NB-06, NB-07.
- 2026-11-03 | add | PAT-stage-sections-on-one-record | Lead and project stages held as sections and a history grid in NB-07.
- 2026-11-03 | add | PAT-lock-fields-by-visibility | Visibility rules lock status until save or after close in NB-01, NB-02, NB-03.
- 2026-11-03 | add | PAT-running-total-by-log-field | Log number balances changed by workflows seen in all seven Builds.
- 2026-11-03 | add | PAT-stock-moves-by-workflow | Stock kept by workflows on movement rows in NB-03, NB-04, NB-05, NB-06.
- 2026-11-03 | add | PAT-low-stock-alert | Stock level check with group message seen in NB-03 and NB-06.
- 2026-11-03 | add | PAT-stop-save-by-workflow-check | Workflow checks with stop and error guard saves in NB-01 and NB-06.
- 2026-11-03 | add | PAT-error-field-check | Formula error fields block bad entries in NB-02, NB-03, NB-06, NB-07.
- 2026-11-03 | add | PAT-pick-from-report-ref | refReport fields fill lines from live reports in NB-02, NB-03, NB-05, NB-06.
- 2026-11-03 | add | PAT-lead-or-customer-pick | Combined lead and customer report ref used across six areas of NB-04.
- 2026-11-03 | add | PAT-sheet-row-drives-app-user | Person sheet keeps app users in step in NB-01, NB-02, NB-03, NB-04.
- 2026-11-03 | add | PAT-fan-out-rows-from-report | Report plus grid loop creates rows per employee in NB-02, NB-05, NB-07.
- 2026-11-03 | add | PAT-scheduled-job-over-rows | Timed jobs over sheets seen in NB-01, NB-02, NB-04, NB-05, NB-06, NB-07.
- 2026-11-03 | add | PAT-scheduled-reminder-message | Timed reminder messages seen in NB-02, NB-04, NB-05, NB-06, NB-07.
- 2026-11-03 | add | PAT-per-row-scheduler | Row-level schedulers seen in NB-01 and NB-06.
- 2026-11-03 | add | PAT-message-on-event | Message nodes on events seen in all seven Builds.
- 2026-11-03 | add | PAT-pdf-from-report | Report-based PDFs on approval or payment seen in NB-01, NB-03, NB-04, NB-05.
- 2026-11-03 | add | PAT-composite-report | Composite reports for dashboards and profiles seen in all seven Builds.
- 2026-11-03 | add | PAT-query-report-with-filter | Filter form plus query report seen in all seven Builds.
- 2026-11-03 | add | PAT-menu-by-button-form | Button form menus for reports and masters seen in NB-03 and NB-04.
- 2026-11-03 | add | PAT-action-set-menu | Action sets group master list actions in NB-01.
- 2026-11-03 | add | PAT-role-copy-of-report | Per-role report copies seen in NB-02 and NB-04.
- 2026-11-03 | add | PAT-role-views-of-one-sheet | Several actions per sheet for own, team and all views seen in NB-01, NB-02, NB-04, NB-05, NB-07.
- 2026-11-03 | add | PAT-device-location-trail | User location points and map reports seen in NB-02, NB-04, NB-05.
- 2026-11-03 | add | PAT-clock-in-out-with-photo | Photo and place clock in and out seen in NB-02, NB-04, NB-05.
- 2026-11-03 | add | PAT-bulk-message-loop | Grid loop with wait for bulk sends seen in NB-04 and NB-07.
- 2026-11-03 | add | PAT-read-document-into-form | Document-to-form node fills customer and lead rows in NB-04.
- 2026-11-03 | add | PAT-insert-row-in-other-sheet | Workflow row inserts into other sheets seen in NB-01, NB-04, NB-06.
- 2026-11-03 | add | PAT-update-linked-rows | Workflow updates of linked rows seen in NB-01, NB-02, NB-03, NB-04, NB-06, NB-07.
- 2026-11-03 | add | PAT-undo-on-cancel | Cancel flag or status branch reverses effects in NB-01, NB-02, NB-06.
- 2026-11-03 | add | PAT-generated-id | Workflow-built readable numbers seen in NB-01 and NB-06.
- 2026-11-03 | add | PAT-order-from-quote-or-direct | Orders from a source record or direct seen in NB-03, NB-04, NB-05, NB-06.
- 2026-11-03 | add | PAT-status-from-quantities | Status driven by remaining quantity seen in NB-03 and NB-06.
- 2026-11-03 | add | PAT-assign-by-mapping-sheet | Zone mapping sheet sets the assignee in NB-04.
- 2026-11-03 | add | PAT-customer-price-list | Customer-specific price or discount grids seen in NB-04, NB-05, NB-06.
- 2026-11-03 | add | PAT-sheet-history-action | History actions on ticket and expense sheets in NB-07.
- 2026-11-03 | add | PAT-helper-sheet-for-tests-and-logs | Test and log sheets for developer and support roles in NB-01, NB-02, NB-04.
- 2026-11-03 | add | PAT-trigger-row-for-workflow | Trigger sheets start jobs in NB-07.
- 2026-11-03 | add | PAT-outside-service-by-plugin | Plugin calls and plugin reports seen in NB-01 and NB-05.
- 2026-11-03 | add | PAT-online-payment-event | Payment receipt event updates rows in NB-01.
- 2026-11-03 | add | PAT-feature-flag-by-var | Variable flag gates a scheduled step in NB-01.
- 2026-11-03 | add | PAT-photo-and-document-capture | Capture fields for proof seen in NB-01, NB-04, NB-06, NB-07.
- 2026-11-03 | add | PAT-bar-code-per-unit | Per-unit codes and scanning seen in NB-06.
- 2026-11-03 | add | PAT-pick-many-rows | refSet and fixed-ref multi-picks seen in NB-06 and NB-07.
- 2026-11-03 | add | PAT-forward-row | rowForward hands rows on in NB-03, NB-06, NB-07.
- 2026-11-03 | add | PAT-button-runs-workflow | Buttons fetch data or mark rows in NB-01, NB-06, NB-07.
- 2026-11-03 | add | PAT-default-value-on-form | Default values by formula or before-insert seen in NB-02 and NB-05.
- 2026-11-03 | add | PAT-travel-amount-from-km | Km times rate travel claims seen in NB-02, NB-04, NB-05.
- 2026-11-03 | add | PAT-shared-sub-workflow | Sub workflows reuse steps in NB-01, NB-02, NB-04, NB-05, NB-06.
- 2026-11-03 | add | PAT-deeplink-to-form | Deep links to forms and rows seen in NB-04 and NB-05.
- 2026-11-03 | add | PAT-delayed-call-by-formula | Helper delay fields trigger calls in NB-04 and NB-05.
- 2026-11-03 | add | PAT-follow-up-log | Follow-up logs on leads seen in NB-05 and NB-07.
- 2026-11-03 | add | PAT-soft-disable-by-status | Active status and disable flag stand in for archive in NB-06.
- 2026-11-03 | add | PAT-split-payment-by-script | JavaScript node splits a bill across sources in NB-01.
- 2026-11-03 | add | PAT-board-from-lane-reports | Sprint lanes built from merged reports in NB-07.
- 2026-11-03 | add | TMOD-attendance | Attendance with photo clock, regularisation and reports seen in NB-02, NB-04, NB-05.
- 2026-11-03 | add | TMOD-leave | Leave with policy, balance register and approval seen in NB-02, NB-04, NB-05, NB-07.
- 2026-11-03 | add | TMOD-expense-claims | Expense and travel claims with approval seen in NB-02, NB-04, NB-05.
- 2026-11-03 | add | TMOD-office-petty-cash | Petty cash credits, balance and office expenses seen in NB-04 and NB-07.
- 2026-11-03 | add | TMOD-asset-allocation | Asset register and give or take back seen in NB-05 and NB-07.
- 2026-11-03 | add | TMOD-employee-master | Employee sheet that drives app users seen in NB-01, NB-02, NB-04, NB-05, NB-07.
- 2026-11-03 | add | TMOD-master-data | Admin-kept lookup and place lists seen in NB-01, NB-02, NB-04, NB-05, NB-06.
- 2026-11-03 | add | TMOD-customer-master | Customer list with prices, credit and place seen in NB-02, NB-04, NB-05, NB-06.
- 2026-11-03 | add | TMOD-lead-management | Lead capture, assignment, stages and follow-up seen in NB-01, NB-04, NB-05, NB-07.
- 2026-11-03 | add | TMOD-site-project-pipeline | Site project records with contacts and pitch status seen in NB-04.
- 2026-11-03 | add | TMOD-visit-planning | Visit plans per rep and team seen in NB-04.
- 2026-11-03 | add | TMOD-field-visits | Visit logs with place, type and outcome seen in NB-02, NB-04, NB-05.
- 2026-11-03 | add | TMOD-location-tracking | Location points, timelines and km reports seen in NB-02 and NB-04.
- 2026-11-03 | add | TMOD-quotation | Quotations with line totals, approval and PDF seen in NB-03, NB-04, NB-05, NB-06.
- 2026-11-03 | add | TMOD-sales-order | Orders from quotation or direct with approval and status seen in NB-03, NB-04, NB-05, NB-06.
- 2026-11-03 | add | TMOD-dispatch | Dispatch against order with stock checks seen in NB-03 and NB-06.
- 2026-11-03 | add | TMOD-customer-payments | Payments that update order and customer balances seen in NB-01 and NB-06.
- 2026-11-03 | add | TMOD-customer-account-ledger | Credit and debit ledger with approved balance changes seen in NB-01.
- 2026-11-03 | add | TMOD-inventory | Stock per item and warehouse kept by workflows seen in NB-03, NB-04, NB-06.
- 2026-11-03 | add | TMOD-purchase-orders | Purchase orders with approval and receipt status seen in NB-05 and NB-06.
- 2026-11-03 | add | TMOD-goods-inward | Goods receipt that updates orders and stock seen in NB-03 and NB-06.
- 2026-11-03 | add | TMOD-incoming-quality-check | Incoming material check that updates order and stock seen in NB-06.
- 2026-11-03 | add | TMOD-vendor-return | Return of rejected material to vendors seen in NB-06.
- 2026-11-03 | add | TMOD-material-request | Floor material requests issued by store seen in NB-06.
- 2026-11-03 | add | TMOD-manufacturing | Bill of materials, work orders and production seen in NB-03.
- 2026-11-03 | add | TMOD-payroll | Monthly payroll rows and payslips from a request seen in NB-05.
- 2026-11-03 | add | TMOD-employee-grievance | Private grievance sheet read by HR seen in NB-05.
- 2026-11-03 | add | TMOD-customer-complaints | Customer complaints with photos and status seen in NB-01 and NB-04.
- 2026-11-03 | add | TMOD-service-job-work | Service jobs with parts and payment seen in NB-01.
- 2026-11-03 | add | TMOD-ticket-tracker | Ticket logs with status, sprint and dashboards seen in NB-04 and NB-07.
- 2026-11-03 | add | TMOD-my-profile | One-screen own profile from merged reports seen in NB-01, NB-02, NB-04.
- 2026-11-03 | add | TMOD-management-reports | Admin and manager report sets seen in NB-01, NB-02, NB-04, NB-05, NB-06.
- 2026-11-03 | add | TMOD-bulk-marketing-messages | Bulk sends looped over a recipients grid seen in NB-04 and NB-07.
- 2026-11-03 | add | TMOD-samples | Sample handouts and sample box requests seen in NB-04.
- 2026-11-03 | add | TMOD-new-product-request | New product requests sent as PDF seen in NB-04.
- 2026-11-03 | add | TMOD-credit-note-request | Credit note requests with signed approval seen in NB-04.
- 2026-11-03 | add | TMOD-dealer-stock-count | Dealer stock counts with customer discount seen in NB-04.
- 2026-11-03 | add | TMOD-weekly-update | Weekly rep notes with a summary report seen in NB-04.
- 2026-11-03 | add | TMOD-sales-library | Sales links and documents list seen in NB-04.
- 2026-11-03 | add | TMOD-contact-meet-log | Meet log with attendee grid and number checks seen in NB-02.
- 2026-11-03 | add | TMOD-support-tools | Support and developer helper sheets seen in NB-01, NB-02, NB-04.
- 2026-11-03 | add | TMOD-rental-customer-and-fleet | Rental plans, balances and fleet with scheduled deductions seen in NB-01.
- 2026-11-03 | add | TMOD-customer-onboarding | Customer sign-up with approval, payment and receipt seen in NB-01.
- 2026-11-03 | add | TMOD-asset-assignment | Asset hand-over to customers with linked row updates seen in NB-01.
- 2026-11-03 | add | TMOD-customer-exit-settlement | Customer exit with refund and approval seen in NB-01.
- 2026-11-03 | add | TPL-vehicle-rental-company | Rental business with onboarding, assignment, balance and exit seen in NB-01.
- 2026-11-03 | add | TPL-field-sales-company | Field sales team apps with attendance, claims, visits and location seen in NB-02 and NB-04.
- 2026-11-03 | add | TPL-small-manufacturer | Make-and-sell businesses with quote, order, dispatch and stock seen in NB-03 and NB-06.
- 2026-11-03 | add | TPL-trading-company-with-hr | Trading sales plus full HR and payroll seen in NB-05.
- 2026-11-03 | add | TPL-software-product-company | Software firm with lead pipeline, tickets and HR seen in NB-07.
