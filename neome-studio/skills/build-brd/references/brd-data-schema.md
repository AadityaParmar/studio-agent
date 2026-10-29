# BRD data file: schema docs

The BRD data file is the structured record of one Engagement behind each BRD. It is the handoff to phase 2.

- Schema: [brd-data.schema.json](brd-data.schema.json) (JSON Schema draft 2020-12).
- Built by the engine: `node neome-studio/engine/cli.mjs build-brd enterprises/<ent>/engagements/<slug> [--mode preview|release|sign-off] [--summary "..."] [--signers "<name> | <role> | <YYYY-MM-DD>" "<name> | <role> | <YYYY-MM-DD>"] [--evidence <SourceID>]`.
- `--check`: dry run of any mode: read + validate, print errors and warnings, write nothing, no Mermaid CLI needed. Preview: `ingest` and other skills use it. Release (`--summary` optional): also prints `change: <text>` per change-log line `v<N>` would get, `note [sign-off] <msg>` per Sign-off blocker of that data (info, exit 0), and `check passed: v<N> would have <k> change(s) …`. Sign-off (`--signers` / `--evidence` optional, checked when given): latest released version, not yet signed, preconditions, evidence in the register; `check passed: v<N> can be signed off (<n> Open Item(s) open, <m> proposed item(s) would be accepted)`.
- `node neome-studio/engine/cli.mjs mmdc-check [<dir>]`: is the pinned Mermaid CLI installed (same lookup and `mmdc-missing` / `mmdc-version` errors as a build)? Exit 0/1. The `build-brd` skill runs it before taking the Engagement lock.
- Live file: `engagements/<slug>/_agent/brd/brd-data.json`, overwritten each build. Frozen snapshots: `_agent/brd/versions/v<N>.json` (release mode).
- Preview page `engagements/<slug>/brd/preview.html` is rendered from this file only (never from the markdown), after it is written. Not written when the build fails.
- Release page `engagements/<slug>/brd/v<N>.html` is rendered from the frozen snapshot. See [Release](#release) and [Sign-off](#sign-off).
- Never hand-edited. Markdown in `_agent/` is the source of truth.
- Phase 2 takes the latest **signed-off** snapshot, never the live file.

## Versioning

`schemaVersion` is semver. Breaking change → major bump. Additive change → minor bump. Phase 2 refuses a major it does not know. Current: `1.0.0`.

## Rules for every file

- **Facts only.** Fit table, metrics, progress %, scope counts, total weeks and Mermaid text are derived by the renderer, never stored.
- **Provenance.** Every fact object carries `sources: [SourceID]` and `proposed: bool`. Any proposed part → whole object proposed. A fact with `proposed: false` needs ≥1 Source.
- **Dead things stay.** Withdrawn Requirements (`withdrawn: <reason>`) and merged (`status: merged-into:<PREFIX>`) or renamed (`formerly`) Modules are kept so IDs stay traceable.
- **Text.** Strings allow inline markdown only. Dates `YYYY-MM-DD`. Enums lowercase kebab-case, except priority.

## ID rules

| Thing | Rule |
|---|---|
| Module prefix | `^[A-Z]{2,5}$`, unique in the Engagement. `GEN` reserved. |
| Requirement | `<PREFIX>-NN` (2 digits; 3 after 99), unique in the Engagement, never reused. May carry the Module's `formerly` prefix. |
| Engagement-wide Requirement | `^GEN-\d{2,3}$` |
| Open Item | `OI-NN`, across the Engagement |
| Source | `^[A-Z]{2,4}(-\d+)?$`, unique across the Enterprise |
| Lane, step, status, phase | kebab-case, local to parent |

## Top level

| Field | Shape | Notes |
|---|---|---|
| `schemaVersion` | string | semver |
| `enterprise` | `{id, name}` | `id` = Enterprise folder; `name` = Enterprise glossary H1 |
| `engagement` | `{slug, title, version, status, date}` | preview: `version: null`, `status: working-draft`. Released: integer `version`, `status` `draft-for-review` or `signed-off`. `date` = build date |
| `sources[]` | `{id, type, title, date\|null, file, engagements[], confidential}` | Only Sources ingested for this Engagement or cited in it. `confidential` = file under `confidential/` |
| `glossary[]` | `{term, definition, avoid[], sources, proposed, disputed?}` | Only terms whose _Used in_ lists this Engagement. `proposed` = _Status_ proposed. `disputed` = ID of the open Open Item holding the dispute |
| `process` | `{lanes[], steps[], edges[]}` | see below |
| `modules[]` | Module | see below |
| `general` | `{requirements[], na[] {topic, reason?, sources}, oiRefs[] {id, topic}}` | Engagement-wide Requirements ("Across all Modules"). Requirement + `topic`: access, localisation, hosting, migration, training, support, other. `na` = topic that does not apply (≥1 Source). `oiRefs` = Open Items (Module `All`) listed under a topic. Empty lists when `general.md` does not exist yet |
| `plan?` | `{phases[], notPlaced[]}` | Implementation plan; only when `plan.md` exists. Phase `{id, name, weekFrom\|null, weekTo\|null, covers, modules[], sources, proposed}` in plan order; not placed `{text, ois[], modules[], sources, proposed}`. `modules[]` may name `GEN` (whole Across all Modules section). Weeks are relative (week 1 = start of work); no prices, no calendar dates. Total weeks is derived (last week of any phase), never stored |
| `openItems[]` | `{id, question, modules[], owner, status, answer?, answerSource?, raisedIn?, suggested?, askTo?, askedIn[]}` | `modules[]` = prefixes or `All`. `owner` enterprise\|neomenta. `status` open\|closed. `askedIn` = QN file names |
| `changelog[]` | `{version, date, status, summary, changes[]}` | Filled at release: earlier entries copied from `v<N-1>`, plus one new entry. Empty in preview. Change = `{group, kind, id, text, fields?}`, see [Release](#release) |
| `signOff?` | `{enterpriseSigner, neomentaSigner, evidence, openAtSignOff[], acceptedProposed[]}` | Only in a signed-off snapshot. Signer = `{name, role, date}`. `evidence` = Source ID (in `sources[]`). `openAtSignOff` = OI IDs open at sign-off. `acceptedProposed` = refs of items still proposed at sign-off, see [Sign-off](#sign-off) |

### Process

| Object | Fields |
|---|---|
| lane | `id, name, who, kind (person\|system\|external), oi?, sources, proposed` |
| step | `id, lane, module (prefix\|null), label, note, kind (step\|decision\|external), oi?, sources, proposed` |
| edge | `from, to, label, alternate, sources, proposed` |

`oi` marks a lane or step that hangs on an Open Item (drawn dashed orange).

### Module

| Field | Shape |
|---|---|
| `prefix, name` | strings |
| `status` | `open` \| `claimed` \| `resolved` \| `needs-revisit` \| `merged-into:<PREFIX>` |
| `formerly?` | old prefix after a rename |
| `purpose` | `{text, sources, proposed}` or null |
| `kpis[]`, `asIs[]`, `exceptions[]`, `volumes[]` | `{text, sources, proposed}` |
| `roles[]` | `{role, does, headcount, sources, proposed}` |
| `records[]` | `{entity, fields[] {name, type, required, choices?, linkTo?, notes, sources, proposed}}`. Types: text, number, money, date, choice, person, link-to-entity, file |
| `statuses[]` | `{id, start, end, oi?, sources, proposed}` |
| `transitions[]` | `{from, to, trigger, sources, proposed}` |
| `rules[]` | `{rule, when, action, sources, proposed}` |
| `reports[]` | `{name, audience, measures, sources, proposed}` |
| `integrations[]` | `{system, direction, data, owner, sources, proposed}` |
| `requirements[]` | Requirement |
| `mapping` | `{neomeApp: <catalog slug>\|null, delivery: standard\|configuration\|custom, how, indicative: true}` or null. `null` App ⇒ `custom` |
| `oiRefs[]` | Open Item IDs from spec section 13 |

`asIs[]` holds the AS-IS / pain bullets of spec section 3. TO-BE lives in `process`.

### Requirement

`{id, title, statement, acceptance[], priority: Must|Should|Could|Won't|TBC, scope: neome|neome-tbc|third-party|enterprise|out-of-scope|open, sources[], ois[], proposed, delivery?, withdrawn?}`

`delivery` only where it differs from the Module's mapping. Unknown priority or scope must be written as `TBC` / `Open`, never left out.

## Validation

The build fails (exit 1, file not written) on any error and prints one line per problem: `error [<class>] <where>: <what>`. Warnings print as `warning [<class>] ...` and do not fail the build. Bad arguments exit 2.

| Class | Layer | Meaning |
|---|---|---|
| `parse` | read | Markdown file missing or not in the expected shape |
| `schema` | 1 | Wrong shape, type, enum or ID format |
| `uncited` | 1 | Fact not proposed and cites no Source |
| `missing-source` | 2 | Cited Source not in the Enterprise Source register |
| `duplicate-source` | 2 | Source ID registered twice |
| `missing-oi` | 2 | Referenced Open Item not in `open-items.md` (Modules, GEN Requirements, `general.md` topics, plan) |
| `duplicate-oi` | 2 | Open Item ID twice in the register |
| `requirement-id` | 2 | Requirement ID used twice, or prefix ≠ its Module |
| `unknown-status` | 2 | Transition from/to a status the Module lacks |
| `unknown-lane` | 2 | Step in a lane that does not exist |
| `unknown-step` | 2 | Edge from/to a step that does not exist |
| `unknown-module` | 2 | Step, Open Item, plan phase, Not yet placed item or merge target names a Module that does not exist (plan may also name `GEN`) |
| `unknown-app` | 2 | `neomeApp` not in `reference/neome-app-catalog-slugs.json` |
| `reserved-prefix` | 2 | A Module uses `GEN` |
| `duplicate-module` | 2 | Two Modules share a prefix |
| `oi-module` | 2 | `general.md` lists an Open Item under a topic whose Module(s) do not include `All` |
| `duplicate-phase` | 2 | Two plan phases share an ID |
| `plan-weeks` | 2 | Plan phase with week from after week to |
| `uncovered-topic` | release | **Warning.** Across all Modules topic with no live Requirement, no N/A and no Open Item |
| `plan` | release | **Warning.** Plan phase with no weeks (both empty) or still proposed; resolved Module in no phase and not in Not yet placed. Only when `plan.md` exists |
| `sign-off` | sign-off | Sign-off precondition not met (Module not resolved or merged, Across all Modules topic not covered, live Requirement with priority TBC, Must Requirement with scope Open). Checked on the snapshot |
| `disputed-term` | 2 | Disputed glossary term whose Open Item is missing or closed |
| `catalog-term` | preview | **Warning.** Glossary term is a Neome App name, or its definition mentions Neome (term → Neome mapping belongs in Module spec section 12) |
| `mmdc-missing` | setup | Mermaid CLI not found or does not run. Checked first; nothing is read or written. Fix: `npm ci` in the repo root |
| `mmdc-version` | setup | Mermaid CLI version ≠ pin (`MERMAID_CLI_PIN` in `engine/brd/diagrams.mjs`, same as `package.json`). Checked first. Fix: `npm ci` |
| `mmdc-failed` | render | mmdc could not draw a diagram. Data file is written; page is not |
| `completeness` | 3 | Gap in a Module: spec section missing/empty, no purpose, no mapping, no Requirements, Requirement without acceptance. **Error** for resolved Modules, **warning** for in-progress ones (open, claimed, needs-revisit). Merged Modules skipped. GEN Requirement without acceptance: warning in preview, **error** at release |
| `spec` | spec-check | Module spec done-check gap (header, section order, N/A reason, incomplete Requirement block, section 12 lines, section 13 list, Requirement ID gone). Only from `spec-check`, see [Spec done check](#spec-done-check) |

Broken references are always errors, whatever the Module status.

## Release

`build-brd <engagement> --mode release --summary "<one line: why this version>"`. `--summary` is required for release and refused in other modes.

- N = highest `_agent/brd/versions/v<N>.json` + 1 (1 when none). Writes `_agent/brd/versions/v<N>.json` (frozen snapshot) + `brd/v<N>.html`, both or neither (diagrams are drawn first). Refuses if `v<N>.json` or `v<N>.html` already exists. Does not touch `brd-data.json` or `preview.html`.
- Snapshot: `engagement.version = N`, `status = draft-for-review`, `date` = release date. In-progress Modules allowed (their gaps stay warnings).
- Checks: same as preview, plus GEN completeness as errors and the release warnings above.
- `changelog` = entries of `v<N-1>` copied as they are + `{version: N, date, status: draft-for-review, summary, changes}`. v1 has `changes: []`.
- `changes[]` = diff of `v<N-1>` vs the new data, by stable ID, in this order:

| group | kinds | example `text` |
|---|---|---|
| `modules` | `added`, `renamed` (prefix ≠, old prefix = `formerly`), `resolved`, `needs-revisit`, `merged` | `ENQ: merged into LEAD`, `QUO: renamed from QT` |
| `requirements` | `added`, `changed`, `withdrawn` (Module + GEN) | `QUO-06: priority Should→Must`, `QUO-02: statement changed; acceptance changed`, `GEN-02: withdrawn — <reason>` |
| `openItems` | `raised`, `closed` (answer + answer Source) | `OI-04: raised — <question>`, `OI-01: closed — <answer> [QA-1]` |
| `plan` | `added`, `changed`, `removed` (whole plan, phases by `id`, Not yet placed by `text`) | `Plan phase go-live (Go-live and training): week from —→5; week to —→6`, `…: confirmed` |
| `glossary` | `added`, `changed`, `removed` (by term) | `Glossary "Quote": agreed` |

- "Changed" Requirement = any change to `statement`, `acceptance`, `priority`, `scope`, `delivery` or `withdrawn` (`fields` lists them). Title alone is not a change. Delivery compared as effective Delivery (Requirement override, else Module mapping), so a Module Delivery change shows on each of its Requirements. Withdrawn → reinstated shows as `changed` with `reinstated`.
- Page: Versions and sign-off lists entries newest first, changes grouped (Modules, Requirements, Open Items, Implementation plan, Glossary). Unsigned version: two empty boxes (Name, Role, Signature, Date lines) for Enterprise and Neomenta, ready to print and sign.

## Sign-off

`build-brd <engagement> --mode sign-off --signers "<name> | <role> | <YYYY-MM-DD>" "<name> | <role> | <YYYY-MM-DD>" --evidence <SourceID>`. Enterprise signer first, then Neomenta signer. `--signers` and `--evidence` are required for sign-off and refused in other modes.

- Stamps the **latest** released `v<N>`. Refuses if there is no released version, or if `v<N>` is already signed off (signed versions never change; changes go into the next release, `draft-for-review`).
- Checks run on the snapshot `v<N>.json` (what the Enterprise read), not the markdown. All are errors (exit 1, nothing written):
  - evidence Source in the Enterprise Source register (`missing-source`). Register it with `ingest` first.
  - every Module resolved or merged; every Across all Modules topic covered (live Requirement, N/A or Open Item); no live Requirement with priority `TBC`; no live Must Requirement with scope `open` (`sign-off`).
- Writes `v<N>.json` and `v<N>.html` once more (re-rendered from the stamped snapshot), then they are frozen: `engagement.status = signed-off`; the `changelog` entry for N gets `status: signed-off` (the next release copies entries as stored); `signOff` added; the evidence Source added to `sources[]` if missing. Nothing else changes; `proposed: true` stays as history.
- `acceptedProposed` = every live fact object with `proposed: true`, listed whole (its parts not walked), as a path by stable key: `glossary[Quote]`, `process.steps[approve-discount]`, `process.edges[draft-quote→approve-discount]`, `modules[QUO].requirements[QUO-02]`, `modules[QUO].roles[Sales head]`, `modules[LEAD].records[Lead].fields[Company]`, `general.requirements[GEN-02]`, `plan.phases[uat]`. Key = `id`, `prefix`, `term`, `entity`, `name`, `role`, `system`, `rule`, or `from→to`; else list index (`modules[LEAD].exceptions[0]`, `plan.notPlaced[0]`). Withdrawn Requirements, merged Modules and disputed glossary terms are not listed.
- **After Sign-off.** Every later preview or release build reads the latest signed-off snapshot and clears `proposed` on each accepted item whose content (all fields except `sources` and `proposed`) is unchanged; the item gains the evidence Source. Glossary terms shown in the signed version become agreed. An item changed since sign-off stays proposed (a new proposal). The markdown is not rewritten; the build prints how many items were cleared.
- Page: signed version shows signer names, roles and dates instead of empty boxes, the evidence Source, "Open at sign-off" (OI links) and "Accepted on sign-off" (Requirement IDs, other refs as stored). Proposed chips read "proposed, accepted on sign-off"; "Proposed Must" becomes "Must". The change log shows each entry's status; an entry older than the version shown is marked "superseded" (derived, never stored).
- Phase 2 takes the latest `signed-off` snapshot.

## Across all Modules and Implementation plan on the page

- Across all Modules: after the last Module, before the plan. Grouped by topic in the fixed order; same Requirement cards and filters as Modules; N/A shows its reason + Source; listed Open Items per topic; open `All` Open Items not listed under a topic show in a box at the end. No mapping card; not in the fit table. GEN Requirements count in the summary totals, Must count and scope counts.
- Implementation plan: only when `plan` exists (section, print page and sidebar entry). Header "Neomenta's estimate, indicative. …". Phases table (weeks as `Weeks 1–2`, `Week 4`, `Weeks not set`) + Not yet placed table. Summary gets a 5th metric: total weeks (`TBC` when no phase has weeks).

## Diagrams

Derived by the renderer from `process` and each Module's `statuses` + `transitions`; Mermaid text is never stored. `engine/brd/diagrams.mjs` writes the Mermaid text, runs the pinned `mmdc` once per build (all diagrams in one markdown file), and the page inlines the static SVGs (screen + print copies, ids `dgm-<key>` / `p-dgm-<key>`). No mermaid.js in the page.

- Process: `flowchart TB`, one subgraph per lane, step label `<PREFIX> · <label>` (+ note), `decision` = diamond, `alternate` edge = dotted with label, `external` step or lane = grey.
- Status: `stateDiagram-v2`, `direction LR`, state label = id in sentence case, `[*]` → start states, end states → `[*]`, trigger as transition label.
- A step, lane or status with `oi` is dashed orange and its label ends `· OI-NN`.
- Module with no statuses: note "No statuses yet.", no SVG. Merged Modules: none.
- mmdc lookup: `NEOME_MMDC` env (tests use it), else `node_modules/.bin/mmdc` above the Engagement folder, else above the engine.
- Same data → byte-identical SVG (pinned mmdc, `deterministicIds`).

## Where each field comes from

All paths under `enterprises/<ent>/`. Tables are found by their header names (case and `(s)` ignored); column order is free.

| File | Shape read |
|---|---|
| `_agent/GLOSSARY.md` | H1 = Enterprise name. Entries: `**Term**:` line, definition lines, `_Avoid_: a, b`, then `_Source_: CE-1 · _Status_: proposed\|agreed · _Used in_: <slugs>` (+ optional `· _Disputed_: <slug>/OI-NN`: disputed only in that Engagement; bare `OI-NN` = every Engagement). Edited by `ENGINE glossary …` (see `skills/enterprise-glossary/SKILL.md`) |
| `_agent/sources.md` | Table: ID \| type \| title \| date \| file \| engagement(s) \| notes |
| `engagements/<slug>/_agent/map.md` | H1 = Engagement title (`Map:` prefix dropped). Prefix order under `## Modules` = Module order |
| `.../_agent/open-items.md` | Table: ID \| question \| Module(s) \| owner \| ask to \| suggested \| status \| asked in \| answer Source. Optional columns: answer, raised in, note. `asked in` = comma list of QN ids, written by `ENGINE new-questionnaire` (see `skills/questionnaire/references/questionnaire-shapes.md`). `answer` / `answer Source` / `note` / `raised in` written on a Questionnaire reply by `ENGINE reply close\|note\|new-oi` (see `skills/ingest/references/reply-loop.md`); `note` (e.g. `Don't know [QA-1]`) is not read into the BRD data file |
| `.../_agent/process.md` | Tables anywhere (one per Module section is fine). Lanes: id \| name \| who \| kind \| OI \| Source. Steps: id \| lane \| Module \| label \| note \| kind \| OI \| Source. Edges: from \| to \| label \| alternate (yes/no) \| Source |
| `.../_agent/general.md` | Optional. One H2 per topic (`## Access`, `## Localisation`, `## Hosting`, `## Migration`, `## Training`, `## Support`, `## Other`; text in brackets after the name ignored). Under a topic: Requirements as H3 blocks (`### GEN-01 — Title`, same lines as a Module Requirement), or `N/A: <reason> [Source]`, and/or Open Item bullets `- OI-NN: gist`. N/A plus Requirements in one topic = parse error |
| `.../_agent/plan.md` | Optional. Phases table: ID \| name \| week from \| week to \| covers \| Modules \| Source (row order = phase order; empty week = not set; weeks are whole numbers ≥ 1). Not yet placed table: what \| OIs \| Modules \| Source. Modules comma-separated prefixes, `GEN` allowed |
| `.../_agent/modules/<PREFIX>-<slug>/ticket.md` | YAML front-matter: `status`, `prefix` (must match folder), `formerly`, optional `name`. Other keys (`draft`, `blockedBy`, `claimedBy`, `revisitReason`) are not read; see `reference/map-logic.md`. Body is read as the spec when `spec.md` does not exist yet |
| `.../_agent/modules/<PREFIX>-<slug>/spec.md` | `Name:` header line (`Prefix:`, `Status:`, `Sources:` also written, not read). 13 H2 sections (number optional), see below. Template: `skills/write-module-spec/references/spec-template.md` |

Spec sections:

| Section | Read as |
|---|---|
| 1 Purpose and KPIs | bullet `Purpose: …` → `purpose`; other bullets (`KPI:` optional) → `kpis` |
| 2 Roles | table role \| does what \| headcount \| Source |
| 3 Process | bullets → `asIs` (bullets pointing at `process.md` skipped) |
| 4 Records and data | table entity \| field \| type \| required (yes/no) \| notes \| Source. Notes `Values: A / B / C` → `choices`, `Links to: X` → `linkTo` |
| 5 Statuses | states table id \| start/end \| open (OI) \| Source; transitions table from \| to \| trigger \| Source |
| 6 Rules and notifications | table rule \| when \| action/notify whom \| Source |
| 7 Exceptions, 10 Volumes and NFRs | bullets |
| 8 Reports | table name \| audience \| measures/filters \| Source |
| 9 Integrations | table system \| direction \| data \| owner \| Source |
| 11 Requirements | one H3 per Requirement: `### QUO-01 — Title`, then lines `Statement:`, `Acceptance:` (bullets), `Priority:`, `Scope:`, `Sources:`, `OIs:`, `Proposed: yes\|no`, optional `Delivery:`, `Withdrawn: <reason>` |
| 12 Neome mapping | lines `Neome App:` (slug, `none` = no App), `Delivery:`, `How:` |
| 13 Open Items | bullets `OI-NN: gist` → `oiRefs` |

Provenance in markdown: inline `[CE-1]` or `[CE-1, QA-2]` adds Sources; `(proposed, to confirm)` anywhere in a row, bullet or Requirement block marks it proposed. A section that says `N/A: <reason>` is read as empty and counts as filled. A topic still open is written as `- OI-NN: gist` bullet(s) in its section: counts as filled, never read as a fact (bullet sections skip them; table sections may hold only them).

## Spec done check

`ENGINE spec-check <engagement-dir> <PREFIX>` (run by `write-module-spec` before the Module ticket closes). Reads only, writes nothing. Exit 0 = `spec-check: <PREFIX> done`; 1 = not done, one `error [<class>]` line per gap; 2 = bad arguments. Stricter than the build: `spec.md` must exist with `Prefix:` (= ticket prefix), `Name:`, `Status:`, `Sources:` (every cited Source) header lines; exactly the 13 sections as `## <n> <title>` in order; each filled, `N/A: <reason>` (never sections 11–12) or Open Item bullets; every live Requirement with `Statement:`, `Acceptance:` bullet(s), `Priority:`, `Scope:`, `Sources:` (IDs or `(proposed, to confirm)`), `Proposed: yes|no` (`no` only with no proposed mark in the block), `Withdrawn:` with a reason; section 12 with exactly one `Neome App:`, `Delivery:`, `How:` line; no `Delivery:` override equal to the Module Delivery; section 13 = every open Open Item naming the Module or on a live Requirement, no closed one; every Requirement ID this Module (or its `formerly` prefix) had in `brd-data.json` or any `versions/v<N>.json` still present. Plus every build error, with this Module's completeness checked as if resolved. New error class `spec` for the spec-only rules.
