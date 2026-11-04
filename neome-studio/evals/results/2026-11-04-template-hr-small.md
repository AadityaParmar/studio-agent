# Eval result: template-hr-small · 2026-11-04

Verdict: **fail** (1 failure(s))

- Branch: `template-bank-refine-2026-11-03-2` · commit `537a4cd`
- Workspace: `/var/folders/55/hp3cy4xx2_g6frq2l187db640000gn/T/neome-eval-template-hr-small-BUbtMx` (temp; transcript in `run/transcript.md`)
- Judge: default model · baseline: none on main yet

Failures:

- Don't know without an Open Item: 1 (max 0)

## Gates (hard)

| Gate | Value | Max | Result |
|---|---|---|---|
| Schema + cross-ref valid (errors) | 0 | 0 | pass |
| Uncited non-proposed facts | 0 | 0 | pass |
| Invented facts | 0 | 0 | pass |
| Don't know without an Open Item | 1 | 0 | **fail** |
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
| delivery-mismatch-oi | TMOD-leave Delivery hint vs heuristics mismatch raised as an Open Item, owner Neomenta | 2 Open Item(s): OI-40, OI-41 (need ≥ 1) | pass |
| brd-preview | BRD working preview built | 1 file(s) match brd/preview.html (need ≥ 1) | pass |
| questionnaire-sent | Questionnaire master written | 1 file(s) match _agent/questionnaires/QN-*.md (need ≥ 1) | pass |
| no-bank-ids-in-views | No Template bank IDs (incl. App baseline APP-), Build codes (NB-, NA-) or seenIn in BRD, Prototypes, Questionnaires | 0 match(es) in 5 file(s) | pass |

## Requirements

| Golden | Statement | Matched by | Result | Judge note |
|---|---|---|---|---|
| LV-01 | Staff ask for leave from their phone with leave type (Annual, Sick, Unpaid), from date, to date and reason. | LEAVE-01 Ask for leave from phone | match |  |
| LV-02 | The line manager approves or rejects each leave request; the employee is told the decision. | LEAVE-02 Line manager approves or rejects; LEAVE-04 Employee told the decision | match | split: decision in LEAVE-02, telling employee in LEAVE-04 |
| LV-03 | Leave longer than 5 working days also needs the HR Manager's approval, after the line manager. | LEAVE-03 HR Manager approves long leave | match |  |
| LV-04 | Sick leave longer than 2 days needs a photo of the doctor's note on the request. | LEAVE-05 Doctor's note for sick leave | match |  |
| LV-05 | Managers see a team calendar of who is off, to spot clashes before they approve. | LEAVE-06 Team calendar | match |  |
| LV-06 | Unpaid leave days reach Paystream Payroll by the 25th of each month without anyone retyping them; Paystream stays the payroll system. | LEAVE-08 Unpaid days to Paystream | match |  |
| LV-07 | Each employee has a leave balance per leave type; approved leave takes the days off it. Annual leave is 25 days a year. | LEAVE-09 Leave balance per type | match |  |
| LV-08 | The day count of a request works itself out: working days Monday to Friday, leaving out public holidays from a list the HR Manager keeps. | LEAVE-10 Working days counted by the system | match |  |
| EXP-01 | Staff submit an expense claim from their phone: date, category (Travel, Meals, Site materials), amount in euro, short description and a photo of the receipt. | EXP-01 Submit claim from phone | match |  |
| EXP-02 | The line manager approves or rejects each claim; the claimant is told either way. | EXP-02 Line manager approves or rejects; EXP-03 Claimant told the decision | match | split: decision and telling claimant |
| EXP-03 | Accounts pays approved claims every Friday by bank transfer outside the system, then marks them Paid. | EXP-05 Mark claims Paid; EXP-06 Bank transfers stay outside | match | 'every Friday' dropped from replay |
| EXP-04 | A claim for spending more than 60 days old is refused. | EXP-04 Refuse claims older than 60 days | match |  |
| EXP-05 | A monthly report of spend by category for the Owner and Accounts. | EXP-07 Monthly spend by category report | match |  |
| GEN-01 | Staff see only their own leave and claims; line managers see their team's leave; the HR Manager sees all leave; Accounts sees all claims. | LEAVE-07 Who sees which leave; EXP-08 Who sees which claims | match | split per module |
| GEN-02 | English only; amounts in euro. | GEN-03 English and euro | match |  |
| GEN-03 | Neomenta trains the HR Manager and Accounts; they show the rest of the staff. | GEN-04 Train Jonas and Clara | match |  |
| GEN-04 | Standard Neome support; the HR Manager raises issues. | GEN-05 Standard Neome support | match |  |

## Open Items

| Golden | Question | Covered by | Result | Judge note |
|---|---|---|---|---|
| OI-01 | Can unused leave carry over to next year, and up to how many days? | OI-30 Can unused Annual leave carry to next year? Up to how many days? | covered |  |
| OI-02 | Leave Delivery: the Template bank hint says Standard, but the payroll link points higher (Configuration). Which? | OI-40 Leave Delivery: the Template bank hint says attendance-and-leave, Standard; the catalog and Delivery heuristics say attendance-and-leave, Configuration because of the HR Manager's second approval, the doctor's note rule, the working-day count and the Paystream export. Which holds? | covered |  |
| OI-03 | How do unpaid leave days get to Paystream Payroll: a monthly file or a direct link? | OI-06 How must unpaid leave days reach Paystream: in Paystream's upload sheet, sent by whom, covering which dates for the 25th cut-off? Does Paystream offer any other way in? | covered | asks how unpaid days reach Paystream |
| OI-04 | Does each expense category have a spending limit, and does a claim over it need extra approval? | OI-47 Is there a spending limit per category (for example Meals per day), checked when the claim is sent?; OI-09 Is there an amount above which an expense claim needs more than the line manager's approval? | covered |  |
| OI-05 | Can staff claim mileage, and at what rate per km? | OI-46 Do staff claim car mileage at a fixed rate per km? | covered | rate per km asked |
| OI-06 | Should each claim be tagged to a project or client? | OI-45 Should an expense claim be tagged to a project or client? | covered |  |
| OI-07 | Any hosting, data residency or single sign-on needs? | OI-27 Hosting: is Neome's cloud fine? Must data stay in a given country or the EU? Should staff sign in with an existing Microsoft or Google account (SSO)? | covered |  |

## Modules and mapping

| Golden | Name | Matched by | Golden Delivery | Actual Delivery | Module | Delivery | Judge note |
|---|---|---|---|---|---|---|---|
| LV | Leave | LEAVE | configuration | LEAVE: configuration | match | match |  |
| EXP | Expenses | EXP | standard | EXP: standard | match | match |  |

## Extra Requirements (not failed)

| ID | Title | Tag | Judge note |
|---|---|---|---|
| EXP-09 | Claim stages | plausible | claim stages derived from CE-2 approve/reject/Paid |
| VIS-01 | Sign in on reception tablet | plausible | visitor book from WA-1; Maya asked to add it |
| VIS-02 | Time in and time out | plausible | WA-1 |
| VIS-03 | Tell the person visited | plausible | WA-1 |
| VIS-04 | Visitors on site now | plausible | WA-1 fire drill list |
| VIS-05 | Northgate only for now | plausible | WA-1 Northgate only |
| GEN-01 | Staff list with line manager | plausible | staff list with line manager needed for routing; CE-1/WS-1 |
| GEN-02 | Staff use their phone | noise | duplicates phone use in LEAVE-01/EXP-01 |

7 plausible, 1 noise.

## Source check

29 Requirement(s) checked against their cited Source text; 0 invented.

## Forbidden (must not be Requirements)

| Golden | Statement | Became | Result | Judge note |
|---|---|---|---|---|
| FB-01 | Employees can ask for half-day leave. | — | pass | no half-day req |
| FB-02 | The team is told when someone's leave is approved. | — | pass | LEAVE-04 says team not told |
| FB-03 | Unused leave carries forward to next year. | — | pass | OI-30 only |
| FB-04 | Each expense category has a spending limit; a claim over it needs an extra approval. | — | pass | OI-47/OI-09 only |
| FB-05 | Staff can claim mileage at a fixed rate per km. | — | pass | OI-46 only |
| FB-06 | Each expense claim is tagged to a project or client. | — | pass | OI-45 only |
| FB-07 | Staff check in and out each day; attendance is tracked. | — | pass | no attendance req |

## Don't know → Open Item

| # | Step | Question | Open Item | Judge note |
|---|---|---|---|---|
| A14 | review-draft | Did Enterprise say any of this (who/when)? | **none** | vague attribution question; no OI |
| A16 | review-draft | R2.2 STAFF steps and who does them (Jonas proposed)? | OI-25 |  |
| A17 | review-draft | R2.3 LEAVE steps OK? | Source CE-1 | CE-1 states by 25th; LEAVE-08 keeps it citing CE-1 |
| A18 | review-draft | R2.4 EXP steps OK? | Source CE-2 | CE-2 states every Friday; EXP-05 cites CE-2 but dropped Friday |
| A19 | review-draft | R2.5 VIS steps and hand-offs OK? | OI-24 | VIS steps via Theo's role / OI-19 |
| A24 | review-draft | R4.1 Hosting, data residency, SSO? | OI-27 |  |
| A25 | review-draft | R4.2 Migration: staff list loaded from Jonas's spreadsheet at go-live? | OI-28 |  |
| A37 | resolve-leave | Who approves leave of a line manager, of Jonas, of Maya? | OI-05 |  |
| A38 | resolve-leave | Can staff cancel or change leave after it's approved? Who is told? | OI-07 |  |
| A39 | resolve-leave | Unused Annual leave: carry to next year? Up to how many days? | OI-30 |  |
| A40 | resolve-leave | Sick leave longer than 2 days = working days? Enter after the fact; line manager still approves? | OI-04 |  |
| A41 | resolve-leave | Team = everyone under one line manager? Warn manager on overlapping leave, or calendar enough? | OI-03 |  |
| A42 | resolve-leave | Leave stages: can Jonas reject too? Any other final stage (Cancelled)? | OI-31 |  |
| A43 | resolve-leave | Line manager away: who decides their team's leave? | OI-32 |  |
| A44 | resolve-leave | Success = no lost leave request, no retyping into Paystream. Anything else to measure? | OI-33 |  |
| A46 | resolve-leave | How many leave requests a month? Busier months? | OI-08 |  |
| A47 | resolve-leave | Must staff always give a reason? | OI-34 |  |
| A48 | resolve-leave | Reports beyond team calendar: pending list; leave taken and balance per person? | OI-35 |  |
| A50 | resolve-leave | Jonas keeps the leave type list and can add types later? | OI-36 |  |
| A51 | resolve-leave | New system = one true record of leave and balances; Jonas's spreadsheet stops? | OI-37 |  |
| A52 | resolve-leave | Who owns the Paystream link? | OI-38 |  |
| A55 | resolve-leave | LEAVE-04 Employee told the decision (Must) | OI-39 | priority confirmation |
| A56 | resolve-leave | LEAVE-07 Who sees which leave (Must) | OI-39 | content in CE-1; priority open |
| A57 | resolve-leave | LEAVE-10 Working days counted by system (Must) | OI-39 | priority confirmation |
| A61 | resolve-expenses | Above what amount does a claim need more than the line manager? Or a limit per category? | OI-09 | also OI-47 |
| A62 | resolve-expenses | One receipt per claim, or many spends per claim? | OI-12 |  |
| A63 | resolve-expenses | Rejected claim: can staff fix and resend? Must LM give a reason? | OI-13 |  |
| A64 | resolve-expenses | How many claims a month? | OI-15 |  |
| A65 | resolve-expenses | Claim stages: Submitted → Approved / Rejected → Paid. Any other (e.g. Cancelled)? | OI-42 |  |
| A66 | resolve-expenses | Line manager away: who decides their team's claims? Can staff withdraw a claim before it is decided? | OI-43 |  |
| A67 | resolve-expenses | Do you check approved claims before paying, and can you send one back? | OI-44 |  |
| A68 | resolve-expenses | Should a claim be tagged to a project or client? | OI-45 |  |
| A69 | resolve-expenses | Do staff claim car mileage at a fixed rate per km? | OI-46 |  |
| A70 | resolve-expenses | Spending limit per category, checked when the claim is sent? | OI-47 |  |
| A71 | resolve-expenses | Does the new system become the one record of claims? Is paid spend booked in an accounts package, and who owns that? | OI-48 |  |
| A72 | resolve-expenses | Beyond spend by category: monthly trend, approved vs rejected, list of approved not yet paid? | OI-49 |  |
| A73 | resolve-expenses | How long must claims and receipt photos be kept? | OI-50 |  |
| A74 | resolve-expenses | Remind line managers of claims waiting for a decision? | OI-51 |  |

## Problems

None.

## Maintainer spot-check

Open ~10 rows above (mix of match, missed, extras), read both sides, tick when the judge was right.

- [ ] Spot-check done · judge wrong on: ___ · approved by: ___

## Data

```json
{
  "case": "template-hr-small",
  "date": "2026-11-04",
  "branch": "template-bank-refine-2026-11-03-2",
  "verdict": "fail",
  "metrics": {
    "valid": 0,
    "uncited": 0,
    "invented": 0,
    "dontKnow": 1,
    "forbidden": 0,
    "mechanics": 0,
    "replay": 0,
    "recall": 100,
    "openItems": 100,
    "modules": 100,
    "mapping": 100
  },
  "failures": [
    "Don't know without an Open Item: 1 (max 0)"
  ]
}
```
