# 19: Home for Engagement-wide Requirements

Type: grilling
Status: resolved
Blocked by: None

## Question

Where do Requirements that belong to no single Module live? Anglo Gulf had ACC-01 (roles and permissions) and IMP-05..07 (process mapping, data migration, post go-live support). Ticket 04 asks these topics once in review-draft (OIs get Module = `All`), but the schema (ticket 08) only holds Requirements inside Modules. Decide: a reserved Engagement-wide Module (prefix, spec file, BRD placement) or a separate top-level list; which skill writes it; how it shows in the BRD and fit table (no Neome App mapping?).

## Constraints from earlier tickets

- From ticket 04: Engagement-wide topics = users and permission matrix, currencies, languages, hosting and SSO, data migration, support.
- From ticket 07: Module spec has 13 fixed sections; Engagement-wide items are not per-Module.
- From ticket 08: Requirement ID = `<PREFIX>-NN`; Module prefix `^[A-Z]{2,5}$`.
- From ticket 16: plan phases are not Requirements; delivery asks (migration, training, support, UAT) stay Requirements or Open Items and need this home.

## Answer

Consultant picked **one GEN prefix** (the key question). Rest taken as recommended.

- **Not a Module.** Glossary: a Module is Enterprise-side and Neome-mapped; these asks are neither. New term **Engagement-wide Requirement**. BRD label: "Across all Modules".
- **Where it goes:** a Requirement goes here only if no single Module owns it. If one Module owns it, it stays in that Module, even if it touches others.
- **IDs:** `GEN-NN`, same rules as Module Requirements (zero-padded, never reused). `GEN` is reserved: no Module may use it (cross-ref check).
- **Topic tag** (required, fixed enum, from the ticket 04 Engagement-wide list plus training): `access` (users, roles, permission matrix), `localisation` (currencies, languages), `hosting` (hosting, data residency, SSO, security), `migration`, `training`, `support`, `other`.
- **Spec file:** `_agent/general.md` per Engagement. No Module folder, no ticket, no Prototype. One H2 per topic, in the order above; Requirements as H3 blocks in the ticket 07 format (statement, acceptance, priority, scope, sources, OIs, proposed). A topic with nothing says `N/A` (with Source) or lists its OIs.
- **Who writes it:**
  - `ingest` drafts GEN Requirements and OIs from Inputs (cited, or "proposed by Neomenta, to confirm").
  - `review-draft` asks the Engagement-wide topics once (ticket 04) and writes the answers here.
  - `resolve-module` may add a GEN Requirement when a Module grilling surfaces an ask no single Module owns; it takes the Engagement lock for that edit (ticket 15).
  - Questionnaire replies to OIs with Module = `All` land here via `ingest` (ticket 11).
- **Open Items:** OIs with Module = `All` belong to this section and show there. No new value.
- **Done-ness:** covered when every topic has a Requirement, `N/A`, or an OI. Preview: no check. Release: warns on uncovered topics. Sign-off (ticket 12): needs every topic covered, same as "all Modules resolved". Strict validation (complete acceptance and so on) applies at release, like a resolved Module.
- **BRD:** own section "Across all Modules" after the last Module, before Implementation plan (ticket 16). Sidebar entry in the same slot. Requirement cards grouped by topic, same card and filters as Modules. No mapping card. Not in the fit table. Counted in summary Requirement totals (derived). Print: same linear order.
- **Plan (ticket 16):** phase and notPlaced `modules[]` may name `GEN` (whole section). Migration, training and support asks with no slot go to Not yet placed. Phases still never restate Requirements.
- **Schema (ticket 08), additive, minor semver bump:**
  ```
  general  {requirements[] (Requirement + topic: access|localisation|hosting|migration|training|support|other),
            na[] {topic, sources}, oiRefs[]}
  ```
  Cross-ref: GEN IDs match `^GEN-\d{2,3}$`; no Module prefix is `GEN`; every topic is in `requirements`, `na` or has an `All` OI (release warning, sign-off error).
- **Changes to earlier tickets:** 04 (Engagement-wide list adds training; answers write to `_agent/general.md`), 05 (new section + sidebar slot), 07 (`general.md` template, topic H2s instead of 13 sections), 08 (`general` object, `GEN` reserved), 12 (sign-off gate includes topic coverage), 13 (`_agent/general.md` path), 16 (`GEN` allowed in plan refs).

Unblocks: [18: Testing the skills](18-testing-the-skills.md).
