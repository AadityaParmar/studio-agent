# Eval case: template-hr-small

Guards Template bank use by the skills (template-bank effort, ticket 10). Made up, hand-written: Fernbrook Interiors, a 38-person office fit-out firm, Engagement `hr-desk`. Three Inputs (Leave, Expenses, Visitor log); two Modules resolved (Leave live, Expenses from Inputs), 13 Requirements incl. 4 Engagement-wide, 7 Open Items, 7 forbidden statements. Own fixture Template bank; the real one is never used.

Run: `node neome-studio/evals/run.mjs run template-hr-small` (see [../README.md](../README.md)). New case: no regression baseline until its first result on `main`.

## Files

| File | Holds |
|---|---|
| `inputs/hr-call-notes.md` | Call notes with the Owner and HR Manager: Leave, plus unpaid days to an outside payroll company |
| `inputs/expenses-email.txt` | Email from Accounts: how expense claims should work |
| `inputs/front-desk-whatsapp.txt` | WhatsApp, Office Manager and Owner: visitor log at reception (no Template module fits) |
| `answer-key.md` | Facts K-NN: yes / no to Leave usual needs, Employee master yes, Attendance no, payroll, Engagement-wide; Consultant choices |
| `golden.json` | Expected Modules, Requirements, Open Items, mapping, `forbidden` statements, `mechanics` |
| `replay.yaml` | 6 steps: ingest → review-draft → resolve-module Leave (live) → resolve-module Expenses (from Inputs) → build-brd preview → questionnaire. No release, no Sign-off |
| `template-bank/` | Fixture Template bank, locked format: `TPL-hr-small` (core Employee master, Attendance, Leave; optional Expenses), decoy `TPL-sales-crm`, `TMOD-leave`, `TMOD-expenses`, `TMOD-attendance`, `TMOD-employee-master`, `PAT-approval-by-status`, App baseline `APP-attendance-and-leave` (linked from `TMOD-leave` by `neomeApp`; gives no payroll link, so it backs the Delivery mismatch), `CHANGELOG.md`. Build codes NB-81..86 and NA-attendance-and-leave are fake |

## What it covers

| Trap | Where in the replay | Checked by |
|---|---|---|
| Engagement Template match, decoy ignored | ingest proposes, review-draft confirms | mechanic `template-matched` |
| Module match, and `none` when nothing fits | Leave → `TMOD-leave`, Expenses → `TMOD-expenses`, Visitor log → `none` | mechanics `leave-tmod`, `expenses-tmod`, `visitor-none` |
| Template has Modules the draft lacks | review-draft suggests Employee master (K-08 yes → Module, left open) and Attendance (K-09 no → dropped) | mechanics `employee-master-added`, `no-attendance-module`; forbidden FB-07 |
| Usual needs, live | Leave: balance (K-03) and day count (K-04) yes → Requirements; half day (K-05) and team told (K-06) no → never Requirements; carry forward not in the key → Don't know → Open Item | golden LV-07, LV-08, OI-01; forbidden FB-01..03; Don't know gate |
| Usual needs, from Inputs | Expenses: category limits, mileage, project tag → Open Items with suggested answers, never Requirements | golden OI-04..06; forbidden FB-04..06 |
| Delivery mismatch | `TMOD-leave` hint `standard`; Inputs need unpaid days sent to an outside payroll company (never Standard) → higher grade + Open Item, owner Neomenta | mechanic `delivery-mismatch-oi`, golden OI-02, mapping LV `configuration` |
| No Template bank IDs in client-facing views | BRD preview, Prototypes, Questionnaire | mechanic `no-bank-ids-in-views` (`absent`: `TPL-\|TMOD-\|PAT-\|APP-\|NA-\|NB-\d\|seen in`) |

Soft metrics: all four. No merge or split trap.

## Left out of the key on purpose

Must end as Open Items, never as facts: leave carry forward, how unpaid days reach payroll (K-07 leaves it to Neomenta), anything about Expenses beyond the email (from-Inputs mode), hosting / data residency / single sign-on, anything about the visitor log beyond the WhatsApp.

## Changing this case

Golden, key, Inputs and fixture move together; `run.mjs check template-hr-small` checks links, shapes and (once `engine/template-bank.mjs` is merged) the fixture Template bank. The fixture must never name the case Enterprise. A change here resets the regression baseline: say so in the results commit. The fixture changes only on purpose: a skill gate needs the same Template bank every run.
