# Skill integration

Type: grilling (HITL)
Status: resolved
Blocked by: 05, 07

## Question

Which skills read the bank and how: ingest match (record in map Notes?), review-draft (missing Module?), grill-module tier 2, neome-mapping hints. One Template per Engagement or per Module. Citation: `(proposed, to confirm)` only or a `TPL-` ID.

From Bank location: how to show a bank vs catalog mismatch (both shown, never silently picked).


## Answer

Locked with user (2026-11-03).

- **Readers:** ingest, review-draft, grill-module, neome-mapping. Not build-prototype, not studio (for now).
- **Grain:** 0–1 Template per Engagement → Engagement `map.md` front matter `template: TPL-… | none`. 0–1 Template module per Module → Module ticket front matter `templateModule: TMOD-… | none`. `none` = checked, no match; field missing = not checked. Engine check: ID exists in Template bank; ID gone (refine split/retired) = warning, not error; next resolve-module run re-matches.
- **Matching:** engine command prints Template bank index (ID, name, aliases, business type, seenIn count). Model matches against index, reads only matched entries whole. seenIn count shown to Consultant ("seen in 3 Builds").
- **ingest:** draft stays Inputs-only (no Modules, Requirements, usual needs from Template bank). Proposes matches, writes the fields, lists them in report. Later ingest matches only new draft Modules; never changes a confirmed Module's `templateModule`.
- **review-draft:** group 1 confirms or changes each match. Suggests Modules the Template has but draft lacks (`(proposed, to confirm)`; yes → `module new`, else dropped). Suggests merge/split when a draft Module spans two Template modules. Re-match after rename/merge/split. `template:` changes only here.
- **grill-module:** tier order Inputs → Template bank → catalog → always ask. Usual needs not in Sources → questions with suggested answer; Patterns + process steps → suggested answers for process topics. Always-ask facts never settled by Template bank. Usual need → Requirement only on live Enterprise yes. From-Inputs mode → Open Item with suggested answer. Enterprise says no → dropped, no trace.
- **neome-mapping:** catalog picks App (unchanged). Heuristics grade Delivery first; Template module Delivery hint cross-checks. App or Delivery mismatch → higher grade + Open Item, owner Neomenta, quoting both. Hint never lowers grade alone. Hand-back shows both. Section 12 stays 3 lines.
- **Citation:** Template bank is not a Source. Bank-derived facts use exact `(proposed, to confirm)`. IDs only agent-side (front matter, coverage table, hand-back), never `[ID]` citation. Engine citation check unchanged.
- **Client-facing views:** no Template bank IDs, Build codes or seenIn in BRD, Prototype, Questionnaire.
- **Glossary:** Template bank _Avoid_ now has "bank" alone (clashes with grill-module question bank).
- Implied: resolve-module passes `templateModule` to grill-module and neome-mapping.
