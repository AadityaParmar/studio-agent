# Eval result: template-hr-small · 2026-11-03

Verdict: **fail** (1 failure(s))

- Branch: `template-bank-refine-2026-11-03-2` · commit `b7046be`
- Workspace: `/var/folders/55/hp3cy4xx2_g6frq2l187db640000gn/T/neome-eval-template-hr-small-40nocb` (temp; transcript in `run/transcript.md`)
- Judge: default model · baseline: none on main yet

Failures:

- Don't know without an Open Item: 4 (max 0)

## Gates (hard)

| Gate | Value | Max | Result |
|---|---|---|---|
| Schema + cross-ref valid (errors) | 0 | 0 | pass |
| Uncited non-proposed facts | 0 | 0 | pass |
| Invented facts | 0 | 0 | pass |
| Don't know without an Open Item | 4 | 0 | **fail** |
| Forbidden Requirements | 0 | 0 | pass |
| Case mechanics failed | 0 | 0 | pass |
| Replay problems | 0 | 0 | pass |

## Soft metrics

| Metric | Score | Hit / of | Min | Last main | Drop | Result |
|---|---|---|---|---|---|---|
| Requirement recall | 100% | 17 / 17 | 80% | — | — | pass |
| Open Items caught | 100% | 7 / 7 | 70% | — | — | pass |
| Module set | 100% | 2 / 2 | 80% | — | — | pass |
| Mapping (Delivery class) | 100% | 2 / 2 | 70% | — | — | pass |

Regression rule: no soft metric drops more than 5 pts vs the last result on `main`.

## Mechanics

| Check | What | Detail | Result |
|---|---|---|---|
| template-matched | Engagement Template is the HR desk one, not the sales decoy | _agent/map.md matches /^template:\s*TPL-hr-small\s*$/ | pass |
| leave-tmod | Leave matched to TMOD-leave | _agent/modules/LEAVE-leave/ticket.md matches /^templateModule:\s*TMOD-leave\s*$/ | pass |
| expenses-tmod | Expenses matched to TMOD-expenses | _agent/modules/EXP-expense-claims/ticket.md matches /^templateModule:\s*TMOD-expenses\s*$/ | pass |
| visitor-none | Visitor log checked, no match | _agent/modules/VIS-visitor-book/ticket.md matches /^templateModule:\s*none\s*$/ | pass |
| employee-master-added | Suggested Employee master Module added (Consultant yes), left open | _agent/map.md matches /^\\|\s*[A-Z]{2,5}\s*\\|\s*(Employee\|Staff)[^\|]*\\|\s*(open\|draft)\s*\\|/ | pass |
| no-attendance-module | Suggested Attendance Module dropped (Consultant no) | 0 match(es) in 1 file(s) | pass |
| leave-resolved | Leave resolved (live) | _agent/modules/LEAVE-leave/ticket.md matches /^status:\s*resolved\s*$/ | pass |
| expenses-resolved | Expenses resolved (from Inputs) | _agent/modules/EXP-expense-claims/ticket.md matches /^status:\s*resolved\s*$/ | pass |
| delivery-mismatch-oi | TMOD-leave Delivery hint vs heuristics mismatch raised as an Open Item, owner Neomenta | 3 Open Item(s): OI-49, OI-50, OI-51 (need ≥ 1) | pass |
| brd-preview | BRD working preview built | 1 file(s) match brd/preview.html (need ≥ 1) | pass |
| questionnaire-sent | Questionnaire master written | 3 file(s) match _agent/questionnaires/QN-*.md (need ≥ 1) | pass |
| no-bank-ids-in-views | No Template bank IDs (incl. App baseline APP-), Build codes (NB-, NA-) or seenIn in BRD, Prototypes, Questionnaires | 0 match(es) in 9 file(s) | pass |

## Requirements

| Golden | Statement | Matched by | Result | Judge note |
|---|---|---|---|---|
| LV-01 | Staff ask for leave from their phone with leave type (Annual, Sick, Unpaid), from date, to date and reason. | LEAVE-01 Ask for leave from phone; GEN-03 Staff use their phone | match | LEAVE-01 adds whole days only; GEN-03 repeats phone use |
| LV-02 | The line manager approves or rejects each leave request; the employee is told the decision. | LEAVE-02 Line manager approves or rejects; LEAVE-03 Employee told the decision | match | split into decision and notice |
| LV-03 | Leave longer than 5 working days also needs the HR Manager's approval, after the line manager. | LEAVE-04 HR Manager approves long leave | match |  |
| LV-04 | Sick leave longer than 2 days needs a photo of the doctor's note on the request. | LEAVE-05 Doctor's note for sick leave | match |  |
| LV-05 | Managers see a team calendar of who is off, to spot clashes before they approve. | LEAVE-06 Team calendar | match |  |
| LV-06 | Unpaid leave days reach Paystream Payroll by the 25th of each month without anyone retyping them; Paystream stays the payroll system. | LEAVE-08 Unpaid days to Paystream | match | adds file-or-link left to Neomenta |
| LV-07 | Each employee has a leave balance per leave type; approved leave takes the days off it. Annual leave is 25 days a year. | LEAVE-09 Leave balance | match |  |
| LV-08 | The day count of a request works itself out: working days Monday to Friday, leaving out public holidays from a list the HR Manager keeps. | LEAVE-10 Day count works itself out | match |  |
| EXP-01 | Staff submit an expense claim from their phone: date, category (Travel, Meals, Site materials), amount in euro, short description and a photo of the receipt. | EXP-01 Send a claim from phone; GEN-03 Staff use their phone | match |  |
| EXP-02 | The line manager approves or rejects each claim; the claimant is told either way. | EXP-02 Line manager approves or rejects; EXP-03 Claimant told the decision | match | split into decision and notice |
| EXP-03 | Accounts pays approved claims every Friday by bank transfer outside the system, then marks them Paid. | EXP-05 Mark claims Paid | match | Friday timing in separate EXP-06 |
| EXP-04 | A claim for spending more than 60 days old is refused. | EXP-04 Refuse claims over 60 days old | match |  |
| EXP-05 | A monthly report of spend by category for the Owner and Accounts. | EXP-07 Monthly spend by category | match |  |
| GEN-01 | Staff see only their own leave and claims; line managers see their team's leave; the HR Manager sees all leave; Accounts sees all claims. | LEAVE-07 Who sees which leave; EXP-08 Who sees which claims | match | split per module |
| GEN-02 | English only; amounts in euro. | GEN-01 English; GEN-02 Euro | match | split English / euro |
| GEN-03 | Neomenta trains the HR Manager and Accounts; they show the rest of the staff. | GEN-05 Train the trainers | match |  |
| GEN-04 | Standard Neome support; the HR Manager raises issues. | GEN-06 Standard Neome support | match |  |

## Open Items

| Golden | Question | Covered by | Result | Judge note |
|---|---|---|---|---|
| OI-01 | Can unused leave carry over to next year, and up to how many days? | OI-35 Leave balance: does unused leave carry over to next year? Up to how many days? | covered |  |
| OI-02 | Leave Delivery: the Template bank hint says Standard, but the payroll link points higher (Configuration). Which? | OI-49 Leave Delivery: the Template bank hint says Attendance & Leave, Standard; the catalog and Delivery heuristics say Attendance & Leave, Configuration because the HR Manager second approval, the doctor's note rule and the day count go beyond the App's one-step approval. Which holds? | covered |  |
| OI-03 | How do unpaid leave days get to Paystream Payroll: a monthly file or a direct link? | OI-09 Paystream upload: what format is the upload sheet, how does it reach Paystream (file, portal, link), who sends it, and what is in it?; LEAVE-08 Unpaid days to Paystream | covered | OI-09 asks how upload reaches Paystream; LEAVE-08 leaves choice to Neomenta |
| OI-04 | Does each expense category have a spending limit, and does a claim over it need extra approval? | OI-22 Does any claim amount need a further approver after the line manager? Is there a spending limit per category, checked when the claim is sent? | covered |  |
| OI-05 | Can staff claim mileage, and at what rate per km? | OI-57 Do staff claim car travel per km at a fixed rate? | covered |  |
| OI-06 | Should each claim be tagged to a project or client? | OI-56 Must each claim be tagged to a project or client? | covered |  |
| OI-07 | Any hosting, data residency or single sign-on needs? | OI-38 Hosting: is cloud hosting fine? Must data stay in a given country or region? Should staff log in with an existing account (single sign-on, e.g. Microsoft or Google)? | covered |  |

## Modules and mapping

| Golden | Name | Matched by | Golden Delivery | Actual Delivery | Module | Delivery | Judge note |
|---|---|---|---|---|---|---|---|
| LV | Leave | LEAVE | configuration | LEAVE: configuration | match | match |  |
| EXP | Expenses | EXP | standard | EXP: standard | match | match |  |

## Extra Requirements (not failed)

| ID | Title | Tag | Judge note |
|---|---|---|---|
| STAFF-01 | One staff list | plausible | CE-3 asks for staff list module |
| EXP-06 | List of claims to pay | plausible | Friday unpaid-claims list; proposed, no source |
| VIS-01 | Sign in on tablet | plausible | visitor book from WA-1, golden omitted |
| VIS-02 | Time out recorded | plausible | WA-1 |
| VIS-03 | Host told visitor is here | plausible | WA-1 |
| VIS-04 | Visitors on site now | plausible | WA-1 fire drill list |
| VIS-05 | Northgate only for now | plausible | WA-1 Northgate only |
| GEN-04 | No attendance tracking | plausible | scope exclusion of attendance, CE-3 |

8 plausible, 0 noise.

## Source check

30 Requirement(s) checked against their cited Source text; 0 invented.

## Forbidden (must not be Requirements)

| Golden | Statement | Became | Result | Judge note |
|---|---|---|---|---|
| FB-01 | Employees can ask for half-day leave. | — | pass | LEAVE-01 states whole days only |
| FB-02 | The team is told when someone's leave is approved. | — | pass | LEAVE-03 says team not told |
| FB-03 | Unused leave carries forward to next year. | — | pass | only OI-35 |
| FB-04 | Each expense category has a spending limit; a claim over it needs an extra approval. | — | pass | only OI-22 |
| FB-05 | Staff can claim mileage at a fixed rate per km. | — | pass | only OI-57 |
| FB-06 | Each expense claim is tagged to a project or client. | — | pass | only OI-56 |
| FB-07 | Staff check in and out each day; attendance is tracked. | — | pass | GEN-04 states the opposite |

## Don't know → Open Item

| # | Step | Question | Open Item | Judge note |
|---|---|---|---|---|
| A9 | review-draft | When and where did Maya say the payroll point? | **none** | provenance question; no OI, noted in WS-1 only |
| A11 | review-draft | 1a. Theo Brandt's reception role | OI-23 |  |
| A15 | review-draft | 5. VIS steps | OI-24 | also OI-26 |
| A19 | review-draft | Leave balance rules: days per year for other leave types | OI-34 |  |
| A20 | review-draft | Leave balance rules: carry-over | OI-35 |  |
| A21 | review-draft | Who gave the Must/Should priorities? | **none** | speaker provenance; no OI |
| A22 | review-draft | Who gave the fact about Theo's role? | **none** | speaker provenance; no OI |
| A27 | review-draft | 1. Access: GEN-05 own login per role with visibility own/team/all | OI-36 |  |
| A28 | review-draft | 1. Owner sees all leave and claims? | OI-37 |  |
| A29 | review-draft | 2. Hosting: cloud OK, data residency, SSO? | OI-38 |  |
| A32 | review-draft | Did Fernbrook agree to the training and support setup, and who? | **none** | held as facts in GEN-05/GEN-06 |
| A39 | resolve-leave | Who approves leave of a line manager, HR Manager, Owner? | OI-07 |  |
| A40 | resolve-leave | Team = same line manager; clash show and warn, not block? | OI-06 |  |
| A41 | resolve-leave | Can staff cancel or change leave after approval? | OI-11 |  |
| A42 | resolve-leave | Sick leave >2 days counted in working days? Can line manager approve before doctor's note added? | OI-05 |  |
| A43 | resolve-leave | How many Sick and Unpaid days a year per person? | OI-34 |  |
| A44 | resolve-leave | Does unused Annual leave carry over? Up to how many days? | OI-35 |  |
| A45 | resolve-leave | Leave requests per month and busiest month? | OI-13 |  |
| A46 | resolve-leave | Who owns the Paystream link? Is new system master for leave? | OI-39 |  |
| A47 | resolve-leave | Unpaid leave approved after the 25th or running past it: which month's payroll? | OI-10 |  |
| A48 | resolve-leave | Final status list: Submitted, Awaiting HR Manager, Approved, Rejected (+Cancelled)? | OI-41 |  |
| A49 | resolve-leave | Approvers told, reminded after 2 working days, can delegate when away? | OI-42 |  |
| A50 | resolve-leave | Need list of pending requests and balance list per leave type? | OI-43 |  |
| A51 | resolve-leave | Confirm goals and roles | OI-40 |  |
| A52 | resolve-leave | Reason on leave request required or optional? | OI-44 |  |
| A53 | resolve-leave | HR Manager keeps list of leave types and adds new ones? | OI-45 |  |
| A54 | resolve-leave | Where do staff ask for leave; must it work offline? | OI-46 |  |
| A55 | resolve-leave | How long must leave records be kept? | OI-47 |  |
| A58 | resolve-leave | Confirm LEAVE-03 Employee told the decision, Must | OI-48 | priority part |
| A59 | resolve-leave | Confirm LEAVE-07 Who sees which leave, Must | OI-48 |  |
| A60 | resolve-leave | Confirm LEAVE-10 Day count works itself out, Must | OI-48 | priority part |
| A63 | resolve-expenses | Goals: no lost receipts, no monthly chasing of staff? | OI-52 |  |
| A64 | resolve-expenses | Final status list: Submitted, Approved, Rejected, Paid? | OI-53 |  |
| A65 | resolve-expenses | Do you check approved claims before paying, and can you send one back? | OI-54 |  |
| A66 | resolve-expenses | Is the claimant also told when the claim is marked Paid? | OI-55 |  |
| A67 | resolve-expenses | Spending limit per category, checked at sending; over limit needs one more approval? | OI-22 |  |
| A68 | resolve-expenses | Must each claim be tagged to a project or client? | OI-56 |  |
| A69 | resolve-expenses | Do staff claim car travel per km at a fixed rate? | OI-57 |  |
| A70 | resolve-expenses | Who keeps the category list and adds new ones? | OI-58 |  |
| A71 | resolve-expenses | Line manager told when a claim waits, reminded after 2 working days, can hand approvals to someone when away? | OI-59 |  |
| A72 | resolve-expenses | Can the claimant change or withdraw a claim before the line manager decides? | OI-60 |  |
| A73 | resolve-expenses | Each Friday, one list of approved, unpaid claims to pay (EXP-06)? | OI-61 |  |
| A74 | resolve-expenses | Is the new system the master for claims? Must paid claims reach an accounting system or accountant? | OI-62 |  |
| A75 | resolve-expenses | How long must claims and receipt photos be kept? | OI-63 |  |

## Problems

None.

## Maintainer spot-check

Open ~10 rows above (mix of match, missed, extras), read both sides, tick when the judge was right.

- [ ] Spot-check done · judge wrong on: ___ · approved by: ___

## Data

```json
{
  "case": "template-hr-small",
  "date": "2026-11-03",
  "branch": "template-bank-refine-2026-11-03-2",
  "verdict": "fail",
  "metrics": {
    "valid": 0,
    "uncited": 0,
    "invented": 0,
    "dontKnow": 4,
    "forbidden": 0,
    "mechanics": 0,
    "replay": 0,
    "recall": 100,
    "openItems": 100,
    "modules": 100,
    "mapping": 100
  },
  "failures": [
    "Don't know without an Open Item: 4 (max 0)"
  ]
}
```
