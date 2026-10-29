# 08: BRD data schema

Type: grilling
Status: resolved
Blocked by: 05, 06, 07

## Question

What is the structured data file behind each BRD? Settle:
- format (JSON, YAML or markdown with front-matter)
- top-level shape: Engagement, Sources, Modules, Requirements, Open Items, roles, process, glossary, fit-gap, versions
- ID rules
- how it is validated

This file is the phase-2 handoff contract, so it must be stable and documented.

## Constraints from earlier tickets

- From ticket 06: diagrams are generated from this file, so it must hold `process` (lanes, steps, edges with labels and an alternate flag) and, per Module, `statuses` + `transitions` (with triggers). Mermaid text is derived, never stored. See the shape hint in ticket 06's answer.
- From ticket 07: the data file carries **every** Module spec section (roles, records/fields, statuses, transitions, rules, exceptions, reports, integrations, volumes/NFRs, Requirements, Neome mapping, OI refs), not just what the BRD shows. Phase 2 reads only this file. Requirement: ID, title, statement, acceptance[], priority, scope, sources[], OIs[], proposed flag, optional Delivery override, `withdrawn` reason. Field types: text, number, money, date, choice, person, link-to-entity, file. The spec's column sets (ticket 07 table) map 1:1 to the schema.

## Answer

**Built JSON, validated in two layers, facts only.** Files: `brd/brd-data.json` (live, overwritten each build) + frozen `brd/versions/v<N>.json` next to each `v<N>.html`. Schema: `build-brd/references/brd-data.schema.json` (JSON Schema draft 2020-12) + `build-brd/references/brd-data-schema.md` (docs).

Decisions:
- **Built, not edited.** `build-brd` builds it from `spec.md` ×N, `process.md`, `open-items.md`, `sources.md` and the Enterprise `GLOSSARY.md`. Markdown is the source of truth. Nobody hand-edits the JSON.
- **Snapshots.** Each rendered version freezes its JSON. Ticket 12 diffs snapshots for the change log. Phase 2 takes a signed-off snapshot, never the live file.
- **Facts only.** Nothing computable is stored: fit table (= Module mappings), metrics, progress %, scope counts and Mermaid text are all derived by the renderer.
- **`schemaVersion`** (semver). A breaking change bumps the major version, and phase 2 refuses a major it doesn't know.

**Top-level shape:**
```
schemaVersion
enterprise   {id, name}
engagement   {slug, title, version, status, date}        # version/status values: ticket 12
sources[]    {id, type, title, date, file, engagements[], confidential}
glossary[]   {term, definition, avoid[], sources, proposed, disputed?}   # this Engagement's terms only: ticket 17
process      {lanes[], steps[], edges[]}                  # shape from ticket 06
modules[]    see below
openItems[]  {id, question, modules[] (prefixes|"All"), owner: enterprise|neomenta,
              status: open|closed, answer?, answerSource?, raisedIn?}
changelog[], signOff                                      # reserved, shape: ticket 12
```
- `sources[]`: only the Sources this Engagement cites or ingested, not the whole Enterprise register.
- No global roles list. Roles are per Module, and lanes are in `process`.

**Module:**
```
prefix, name, status (open|claimed|resolved|needs-revisit|merged-into:<P>), formerly?,
purpose, kpis[], roles[], records[], statuses[], transitions[], rules[], exceptions[],
reports[], integrations[], volumes[], requirements[], mapping, oiRefs[]
```
- The ticket 07 table columns map 1:1 to object fields.
- `records[]` = `{entity, fields: [{name, type, required, choices?, linkTo?, notes, sources, proposed}]}`. Types: text, number, money, date, choice, person, link-to-entity, file.
- `mapping` = `{neomeApp: <catalog slug>|null, delivery: standard|configuration|custom, how, indicative: true}`. The slug is checked against a catalog list shipped in the plugin (from ticket 01). `null` + `custom` means no App fits.

**Requirement:**
```
id, title, statement, acceptance[], priority: Must|Should|Could|Won't|TBC,
scope: neome|neome-tbc|third-party|enterprise|out-of-scope|open,
sources[], ois[], proposed, delivery?, withdrawn? (reason)
```

**Provenance:** every fact object (Requirement, field, role, rule, transition, report, integration and so on) carries `sources: [ids]` + `proposed: bool`. `proposed` is set per object: if any part of an object is proposed, the whole object counts as proposed.

**Dead things stay in:** withdrawn Requirements and merged or renamed Modules remain in the file. The renderer hides or greys them, so phase 2 can still trace IDs.

**ID rules:**
- Module prefix `^[A-Z]{2,5}$`, unique within the Engagement
- Requirement `<PREFIX>-NN`, zero-padded to 2 digits (3 allowed after 99), never reused
- Open Item `OI-NN`, numbered across the whole Engagement
- Source `^[A-Z]{2,4}(-\d+)?$`, unique across the Enterprise
- Lane, step and status IDs: kebab-case, local to their parent

**Text and dates:** strings allow inline markdown only (bold, italic, code, links). Lists are arrays. Dates are ISO `YYYY-MM-DD`. Enums are lowercase kebab-case in the data, except priority, and the renderer shows the labels.

**Validation (build-brd, the build fails on errors):**
1. JSON Schema for shape, types and enums.
2. A cross-reference script: every cited Source and OI exists; Requirement IDs are unique and match their Module prefix; every transition's from/to status exists; every step's lane and Module exist; every `neomeApp` slug is in the catalog.
- Resolved Modules are strict. For in-progress Modules, completeness gaps (missing acceptance and so on) are warnings only. Broken references are always errors.

**Change to ticket 07:** choice values in the spec's notes column use the fixed form `Values: A / B / C`, which build-brd parses into `choices[]`. A link-to-entity field names its target as `Links to: <entity>`, which becomes `linkTo`.

**Change from ticket 11:** `openItems[]` gains `suggested?` (string), `askTo?` (role), `askedIn[]` (QN file names). These are additive.
