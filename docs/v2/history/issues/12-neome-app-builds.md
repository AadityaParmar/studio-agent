# Neome App Builds as a source

Type: grilling (HITL)
Status: resolved
Blocked by: 07, 09

## Question

User added 20 JSONs in `raw/neome-template/`. How does the Template bank treat them?

Facts (checked 2026-11-03, script only):

- Same shape as client Builds (`studioEnt`). Each = 1 Module, `about` = "Template: <name>". 3–12 workflows, 7–35 actions each. No emails / phones in digests.
- They are Neome's own catalog Apps: 18 names match `neome-app-catalog-slugs.json` exactly; 2 near-match (`Machine & Tools Maintenance` ≈ `Machine / Tools Maintenance`, `Visit Management` ≈ `Field Visit Management`). 10 catalog Apps have no JSON (WhatsApp Inquiry, Support Chat, Recruitment, Attendance & Leave, Expense Management, E-Learning, Community Forum, Event Management, Vehicle & Driver, FMCG Field Sales).
- Digest v2 runs as-is: 1 Build area each (+ empty Orphans). CRM area 22 KB (> 17 KB cap).
- Refine tool today scans `raw/*.json` only; dropped in root they'd become NB-08…NB-27 like client Builds.
- First refine run (branch `template-bank-refine-2026-11-03`, 113 changes) mined 7 client Builds only; 30 TMODs carry `neomeApp` slugs, 15 `none`.

Sub-questions:

- Source kind: same as client Builds (NB code, one more `seenIn`), or own kind (e.g. `NA-<slug>`, "App baseline")?
- Role in bank: evidence only, or the baseline of what the App gives out of the box (→ Delivery `standard` vs `configuration` / `custom`)?
- One App = one TMOD? Link to existing TMODs via `neomeApp`, or new TMOD per App?
- Catalog vs App JSON: which wins on "what the App can do" (today catalog wins, ticket 07)?
- Scrub: skip (Neome-owned) or run anyway? Commit raw / digests to repo, or keep gitignored?
- Name near-matches + 10 Apps with no JSON: how handled?

## Answer

Locked with user (2026-11-03).

- **Kind:** App Build = **App baseline**, own code `NA-<catalog slug>` (not NB). Still evidence: Patterns get `seenIn` rows `{build: NA-<slug>, area}`.
- **Scrub + git:** no scrub word list for NA; email / phone leak check still runs. Raw JSON + digests stay gitignored (`raw/neome-template/`).
- **Names:** hand-kept `raw/neome-template/app-slugs` map (JSON name → catalog slug), checked by script; unknown name = hard stop. Near-matches: `machine-tools-maintenance`, `field-visit-management`. 10 Apps without JSON use the catalog page only.
- **New entry kind `APP-<slug>`** in `reference/template-bank/apps/`: out-of-box sheets, key fields, roles, workflows (steps + Mermaid), "gives" list. TMOD `neomeApp: <slug>` links to it when it exists. TMODs not folded into APPs.
- **Catalog vs JSON:** APP entry wins on what the App has; catalog page = fallback for Apps with no JSON. Template bank still wins on usual Delivery. Mismatch shown as both.
- **Mining:** same refine tool. Digest → Sonnet tags App area (Patterns + draft "gives" list) → Opus cluster / review builds or updates the APP entry, same auto-apply rules. New App version = `updated`.
- **Merge into existing (user add):** App mining enhances / merges into existing PAT / TMOD / TPL entries via normal change kinds (`enhance`, `merge`, `rename`); new PAT / TMOD / TPL only when nothing matches. No parallel near-duplicates.
- **Area cap:** 17 KB → 25 KB, all Builds.
- **neome-mapping:** heuristics grade first; APP "gives" = second cross-check beside TMOD `delivery`. Covered → backs `standard`; not covered → backs `configuration` / `custom`. Mismatch → higher grade + Open Item (owner Neomenta). APP never lowers grade alone.
- **grill-module:** tier Inputs → Template bank (TMOD + linked APP) → catalog → ask. "Gives" items → questions with suggested answer `(proposed, to confirm)`.
- **Views + evals:** `absent` regex adds `APP-|NA-`. Fixture `template-hr-small` adds `APP-attendance-and-leave`, linked from `TMOD-leave`.
