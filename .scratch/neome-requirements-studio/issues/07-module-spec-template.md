# 07: Module spec template

Type: grilling
Status: resolved
Blocked by: 04, 05

## Question

What does a resolved Module spec contain? Candidates:
- requirement table (ID, acceptance, priority, scope tag, Source)
- entities and fields
- status flow
- roles and permissions
- notifications
- reports
- integrations
- Neome App + Delivery
- Open Items

Which of these reach the BRD, and which stay spec-only for phase 2?

## Constraints from earlier tickets

- From ticket 04: each of the 11 grilling topics feeds a spec section, so the template needs a home for: purpose/KPIs, roles, process (TO-BE plus hand-offs), records/data, statuses, rules/notifications, exceptions, reports, integrations, volumes/NFRs, and the Requirement table (priority + Scope tag). A topic can be marked N/A with a reason. Engagement-wide items (users, currency, language, hosting, migration, support) are not per-Module.

## Answer

Markdown with fixed H2 headings and tables for the structured parts, so `build-brd` can parse it into the BRD data file. The template lives at `write-module-spec/references/spec-template.md`. A filled sample (Anglo Gulf Quotation) goes in `references/spec-example.md`. File: `modules/<PREFIX>-<slug>/spec.md`.

**Header lines:** Prefix, Name, Status, Sources.

**Sections, in fixed order.** No heading is ever deleted; an unused one says `N/A: <reason>`.

| # | Section | Shape | In BRD? |
|---|---|---|---|
| 1 | Purpose and KPIs | bullets | yes |
| 2 | Roles | table: role \| does what \| headcount \| Source | spec only |
| 3 | Process | AS-IS/pain bullets + link to this Module's section of `process.md` (TO-BE lives only there) | via process.md |
| 4 | Records and data | table: entity \| field \| type \| required \| notes \| Source. Types: text, number, money, date, choice, person, link-to-entity, file. Choice values go in notes | spec only |
| 5 | Statuses | States: id \| start/end \| open (OI) \| Source. Transitions: from \| to \| trigger \| Source (matches ticket 06) | yes (diagram) |
| 6 | Rules and notifications | table: rule \| when \| action/notify whom \| Source | spec only |
| 7 | Exceptions | bullets | spec only |
| 8 | Reports | table: name \| audience \| measures/filters \| Source | spec only |
| 9 | Integrations | table: system \| direction \| data \| owner \| Source | spec only |
| 10 | Volumes and NFRs | bullets | spec only |
| 11 | Requirements | one H3 block per Requirement | yes |
| 12 | Neome mapping | Neome App, Delivery, how | yes (mapping card) |
| 13 | Open Items | OI ID + one-line gist only; the register in `open-items.md` is the single source | yes |

**Requirement block (H3):** ID, title, statement, acceptance (bullets), priority, scope tag, Sources, OIs, `proposed` flag, optional Delivery override.

Decisions:
- **If it needs sign-off, it's a Requirement.** Spec-only sections are phase-2 detail. Anything in them the Enterprise must approve also exists as a Requirement.
- **The data file carries every section.** The BRD renders only a subset. Phase 2 reads only the data file, never `spec.md`.
- **Provenance:** every fact or row cites a Source inline (`[CE-1]`). Agent proposals are marked `(proposed, to confirm)`, which becomes the BRD chip.
- **Requirement IDs:** `<PREFIX>-NN`, minted in the spec and never reused. A dropped Requirement stays in place, marked `Withdrawn: <reason>`. Exact format and validation are in ticket 08.
- **Delivery:** one per Module, plus a per-Requirement override only where it differs.
- **Owners:** `write-module-spec` writes everything except section 12, which `neome-mapping` writes. Terms follow the Enterprise GLOSSARY, and the spec has no glossary of its own.
- **Revisit:** the spec is edited in place, with no change section inside it. History comes from git plus the BRD change log (ticket 12).
- **Done check:** the template ends with a checklist run before the Module ticket closes:
  - all 13 headings are present
  - each is filled, N/A with a reason, or an OI
  - every Requirement has acceptance, priority, scope and Source
  - there are no uncited facts

  Hard schema validation belongs to ticket 08.

## Amendment (from ticket 08)

Records and data notes column: choice values are written `Values: A / B / C` and link targets `Links to: <entity>`. build-brd parses them into `choices[]` / `linkTo`.
