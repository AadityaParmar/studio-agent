# Eval result: tiny-synthetic · 2026-11-04

Verdict: **fail** (1 failure(s))

- Branch: `prototype-ui-2026-11-04` · commit `e23d7b9`
- Workspace: `/var/folders/55/hp3cy4xx2_g6frq2l187db640000gn/T/neome-eval-tiny-synthetic-99INsD` (temp; transcript in `run/transcript.md`)
- Judge: claude-sonnet-5-5 · baseline: none on main yet

Failures:

- Case mechanics failed: 2 (max 0)

## Gates (hard)

| Gate | Value | Max | Result |
|---|---|---|---|
| Schema + cross-ref valid (errors) | 0 | 0 | pass |
| Uncited non-proposed facts | 0 | 0 | pass |
| Invented facts | 0 | 0 | pass |
| Don't know without an Open Item | 0 | 0 | pass |
| Forbidden Requirements | 0 | 0 | pass |
| Case mechanics failed | 2 | 0 | **fail** |
| Replay problems | 0 | 0 | pass |

## Soft metrics

| Metric | Score | Hit / of | Min | Last main | Drop | Result |
|---|---|---|---|---|---|---|
| Requirement recall | 100% | 20 / 20 | 80% | — | — | pass |
| Open Items caught | 100% | 7 / 7 | 70% | — | — | pass |
| Module set | 100% | 2 / 2 | 80% | — | — | pass |
| Mapping (Delivery class) | 100% | 2 / 2 | 70% | — | — | pass |

Regression rule: no soft metric drops more than 5 pts vs the last result on `main`.

## Mechanics

| Check | What | Detail | Result |
|---|---|---|---|
| glossary-conflict | "job" meaning clash raised as an Open Item | 14 Open Item(s): OI-01, OI-04, OI-08, OI-10, OI-17, OI-18, OI-19, OI-21, OI-22, OI-23, OI-29, OI-31, OI-36, OI-37 (need ≥ 1) | pass |
| questionnaire-sent | Questionnaire master written | 1 file(s) match _agent/questionnaires/QN-*.md (need ≥ 1) | pass |
| reply-closes-oi | Reply closed an Open Item citing the QA Source | 13 Open Item(s): OI-02, OI-06, OI-09, OI-13, OI-18, OI-19, OI-20, OI-22, OI-23, OI-24, OI-25, OI-26, OI-28 (need ≥ 1) | pass |
| reply-new-question | Leena's new question raised as an Open Item from the reply | 9 Open Item(s): OI-29, OI-30, OI-31, OI-32, OI-33, OI-34, OI-35, OI-36, OI-37 (need ≥ 1) | pass |
| reply-dont-know | Don't know or skipped item stays open with a note | _agent/open-items.md matches /\\|\s*open\s*\\|.*\[QA-\d+\]/ | pass |
| needs-revisit | Reply set a Module needs-revisit (map change log) | _agent/map.md matches /needs.revisit.*\[QA-\d+\]/ | pass |
| gen | Engagement-wide Requirements written | 5 live GEN Requirement(s) (need ≥ 3) | pass |
| all-resolved | Every Module resolved | all 2 resolved | pass |
| v1-released | v1 released as draft for review | v1 is draft-for-review | pass |
| v2-signed | v2 signed off | v2 is draft-for-review | **fail** |
| v2-change-log | v2 change log lists Open Items closed by the reply | 13 openItems closed change(s) in v2 (need ≥ 1) | pass |
| claim-held | Ben's claim was pushed | 5 commit(s) match /^resolve-module: marlin-marine/service-crm claim / (need ≥ 1) | pass |
| stale-lock-cleared | studio cleared Ben's stale lock | 1 commit(s) match /^studio: marlin-marine/service-crm clear stale lock of Ben Okafor/ (need ≥ 1) | pass |
| stale-claim-released | studio released Ben's stale claim | 0 commit(s) match /^studio: marlin-marine/service-crm release stale claim of Ben Okafor/ (need ≥ 1) | **fail** |

## Requirements

| Golden | Statement | Matched by | Result | Judge note |
|---|---|---|---|---|
| JOB-01 | The front desk logs a job with boat name, owner name and phone, engine make and model, the owner's complaint and the date the boat comes in; the job number is given automatically. | JOB-01 Record a service job | match | Job number automatic not stated in JOB-01 (in OI-23) |
| JOB-02 | The Workshop Manager assigns each job to one technician. | JOB-03 Assign a technician | match |  |
| JOB-03 | A job moves Booked → In workshop → Waiting for parts → Done → Invoiced, each step by the role that owns it; the front desk can cancel a job before In workshop. | JOB-02 Job status; JOB-10 Cancel a job before work starts | match |  |
| JOB-04 | The technician records hours worked and parts used on the job from a phone, replacing the paper job card. | JOB-04 Hours and parts on the job | match |  |
| JOB-05 | A list of every boat waiting for parts, oldest first, for the Workshop Manager and the front desk. | JOB-05 Waiting-for-parts list | match |  |
| JOB-06 | When a job is Done the boat owner gets a WhatsApp message from the workshop's WhatsApp Business number saying the boat is ready for collection. | JOB-06 Done message to owner | match |  |
| JOB-07 | A monthly report of jobs and hours per technician for the Owner and the Workshop Manager. | JOB-07 Monthly technician report | match |  |
| JOB-08 | Accounts gets a daily list of Done jobs to key invoices into Tally by hand, then marks each job Invoiced; invoices stay in Tally. | JOB-09 Invoices stay in Tally | match | Daily list for Accounts not explicit in JOB-09; invoices stay in Tally and Invoiced set by Accounts |
| JOB-09 | Boat owners and boat yards are kept as customers; one owner can have several boats, and each boat keeps its job history. | JOB-08 Boat history | match |  |
| PRT-01 | The Sales Lead records a parts order with customer, parts with quantity and price, discount and Tally number. | POR-01 Record a parts order | match |  |
| PRT-02 | A parts order moves Quoted → Confirmed → Delivered → Paid; the Sales Lead moves it to Delivered, Accounts sets Paid; it can be cancelled before Delivered. | POR-02 Order status; POR-07 Cancel an order before Delivered | match |  |
| PRT-03 | A discount above 10% needs the Owner's approval (the Workshop Manager when she is away) before the order goes on. | POR-03 Discount over 10% needs Leena | match |  |
| PRT-04 | A list of parts orders Delivered and not Paid 30 days after delivery, for the Sales Lead and Accounts. | POR-05 Unpaid orders list | match |  |
| PRT-05 | The Sales Lead can create and update parts orders from her phone at the boat yards. | POR-06 Make orders from a phone | match |  |
| PRT-06 | The Sales Lead can see Tally stock for a part when quoting. | POR-04 Stock check in Tally | match |  |
| GEN-01 | Technicians see only their own jobs; the Owner sees everything. | GEN-01 Roles and what each sees and does | match |  |
| GEN-02 | All columns of the Jobs 2025 and Jobs 2026 Excel sheets (about 900 rows) move into the new system; parts order history stays in Tally. | GEN-03 Move two years of jobs from Excel | match | Parts order history staying in Tally not stated |
| GEN-03 | English only; prices in AED. | GEN-02 English and AED | match |  |
| GEN-04 | Everyone who uses the system is trained; Neome trains the Workshop Manager and the Sales Lead, who train their teams. | GEN-04 Neome trains Tomas and Priya; they train their teams | match |  |
| GEN-05 | Standard Neome support; the Owner raises issues. | GEN-05 Standard Neome support | match |  |

## Open Items

| Golden | Question | Covered by | Result | Judge note |
|---|---|---|---|---|
| OI-01 | Does "job" mean a boat's workshop visit (call notes) or a parts counter order (WhatsApp)? | OI-01 Priya calls a parts order a "job"; Tomas calls one boat in for service a "job". Two terms needed? | covered |  |
| OI-02 | Who approves a discount above 10% when the Owner is away? | OI-02 Is the 10% per order or per line? How does Leena approve (WhatsApp today)? Tomas approves when she is away [WS-1].; POR-03 Discount over 10% needs Leena | covered |  |
| OI-03 | How do Done jobs and Delivered parts orders reach Tally for invoicing: by hand or a link? | OI-07 Omar keys invoices into Tally by hand from a daily Done list, then sets Invoiced [WS-1]. Is the Tally invoice number kept?; JOB-09 Invoices stay in Tally | covered | Done jobs by hand covered; parts orders to Tally via OI-03 partly |
| OI-04 | Can Tally stock be shown in the new system, and how? | OI-03 Is Tally linked to the system, or are stock and Tally number typed by hand? Does Priya check stock in Tally before a quote (Enterprise will check)? | covered |  |
| OI-05 | Which WhatsApp number sends the job-done message to boat owners? | OI-09 Done message: wording, owner without WhatsApp? Sender is the workshop's WhatsApp Business number [WS-1].; JOB-06 Done message to owner | covered |  |
| OI-06 | Any hosting, data residency or single sign-on needs? | OI-15 Hosting, data residency, SSO, security: what does the Enterprise need? (Enterprise will check) | covered |  |
| OI-07 | Can boat owners see the status of their job online themselves? | OI-36 Can boat owners see the status of their job online themselves? | covered |  |

## Modules and mapping

| Golden | Name | Matched by | Golden Delivery | Actual Delivery | Module | Delivery | Judge note |
|---|---|---|---|---|---|---|---|
| JOB | Service jobs | JOB | configuration | JOB: configuration | match | match |  |
| PRT | Parts orders | POR | configuration | POR: configuration | match | match | Prefix differs |

## Extra Requirements (not failed)

None.

## Source check

22 Requirement(s) checked against their cited Source text; 0 invented.

## Don't know → Open Item

| # | Step | Question | Open Item | Judge note |
|---|---|---|---|---|
| A8 | review-draft | 5. Anything from the Enterprise on OI-04? | OI-04 |  |
| A12 | review-draft | 3. POR step 1: Priya checks stock in Tally? | OI-03 | POR-04 states stock check in Tally as fact but OI-03 open |
| A17 | review-draft | 1. Hosting (hosting, data residency, SSO, security): anything from the Enterprise? | OI-15 |  |
| A20 | review-draft | 4. Other: anything else, such as a shared customer list? Add it to OI-04? | OI-04 |  |
| A29 | leena-replies | 2. OI-17 Confirm priorities/acceptance criteria as in BRD | OI-17 |  |
| A30 | leena-replies | 3. OI-15 Hosting, residency, SSO, security | OI-15 |  |
| A31 | leena-replies | 4. OI-16 Anything else no Module owns | OI-16 |  |
| A32 | leena-replies | 5. OI-04 Parts order linked to boat/job; shared customer list | OI-04 |  |
| A33 | leena-replies | 6. OI-07 Tally invoice number kept? | OI-07 |  |
| A34 | leena-replies | 7. OI-08 Parts used on a job recorded | OI-08 |  |
| A35 | leena-replies | 8. OI-10 Hours per job or per day; report delivery | OI-10 |  |
| A36 | leena-replies | 9. OI-11 Oldest counts from which date | OI-11 |  |
| A39 | leena-replies | 12. OI-21 After go-live records; owners of Tally and WhatsApp links | OI-21 |  |
| A44 | leena-replies | 17. OI-02 10% per order or line; how Leena approves | OI-32 | OI-02 closed; open part re-asked as OI-32 |
| A46 | leena-replies | 19. OI-05 How Omar knows it is paid | OI-05 |  |
| A47 | leena-replies | 20. OI-06 Phone with no signal; who else makes orders | OI-33 | re-asked as OI-33 |
| A51 | leena-replies | 24. OI-27 After go-live which system holds orders and stock; owners | OI-27 |  |

## Problems

None.

## Maintainer spot-check

Open ~10 rows above (mix of match, missed, extras), read both sides, tick when the judge was right.

- [ ] Spot-check done · judge wrong on: ___ · approved by: ___

## Data

```json
{
  "case": "tiny-synthetic",
  "date": "2026-11-04",
  "branch": "prototype-ui-2026-11-04",
  "verdict": "fail",
  "metrics": {
    "valid": 0,
    "uncited": 0,
    "invented": 0,
    "dontKnow": 0,
    "forbidden": 0,
    "mechanics": 2,
    "replay": 0,
    "recall": 100,
    "openItems": 100,
    "modules": 100,
    "mapping": 100
  },
  "failures": [
    "Case mechanics failed: 2 (max 0)"
  ]
}
```
