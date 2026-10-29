# Map: Neome Requirements Studio

Label: wayfinder:map

## Destination

A written design for the Neome Requirements Studio skill pack, complete enough to hand to /to-spec and build. It covers the skill list and flow, the Enterprise and Engagement folder layout, the artifact formats, the BRD data schema (the phase-2 contract), and the BRD and Prototype HTML templates. Raw Inputs in, Neome-mapped BRD out.

## Notes

- Language: [GLOSSARY.md](../../GLOSSARY.md), [GLOSSARY-MAP.md](../../GLOSSARY-MAP.md). Use Enterprise, Engagement, Module, Requirement, Open Item, Source, Neome App, Delivery, BRD, Prototype exactly as defined.
- Skills every session should consult: /grilling + /domain-modeling (default), /prototype for prototype tickets, /research for research tickets, /writing-for-agents for anything that drafts skill text.
- Upstream: `skills-main/` (Matt Pocock skills, MIT). Copy and adapt into a new plugin; never edit upstream in place.
- Reference examples in `example/`:
  - Vendorgate: interactive build briefing. Design system, tabs, data-driven swimlane.
  - PetroStar: RFP response. Fit-gap table with Standard / Configuration / Custom module.
  - Anglo Gulf CRM BRD: the target content shape. Requirement IDs, acceptance criteria, MoSCoW, scope tags, Sources, Open Items register.
  - Extracted PDF text is in `sources/examples/`.
- Neome public catalog scrape (30 apps): raw text in `sources/neome-site/`, digest in the Research ticket below.
- Standing decisions from charting:
  - The Consultant runs the skills. The Enterprise only answers, live or by questionnaire.
  - Inputs come in any form and each one is registered as a Source with an ID.
  - Each Engagement is a wayfinder-style map with one ticket per Module. Resolving a Module runs grill → spec → Prototype in one session. A final step assembles the BRD.
  - The first skill ingests Inputs and drafts Modules, Requirements and Open Items. The Consultant then reviews that draft as a quiz.
  - Unresolved questions become Open Items, never assumptions. Agent proposals are marked "proposed by Neomenta, to confirm".
  - Grilling runs in two modes: live, and async via a client questionnaire.
  - The BRD is a fixed HTML template filled from one structured data file per Engagement. That data file is the handoff contract for phase 2.
  - The BRD prints cleanly to A4 PDF, carries versions and a change log, and renders the Enterprise glossary.
  - Neome App + Delivery per Module is shown, but only as indicative, taken from the public catalog.
  - The Prototype is a single-file HTML mock in Neome's look.
  - Every skill in the pack, including any copied and adapted from skills-main, carries this block, verbatim:
    ```
    ## How to talk
    - Simple English. No fancy words. Short.
    - Be extremely concise. Sacrifice grammar for concision.
    ```
  - Packaging: one private GitHub repo shared by the team, holding the plugin and `enterprises/<ent>/` with `engagements/<slug>/` under it. Agent-only files live in `_agent/` folders (ticket 13).

## Decisions so far

<!-- one line per resolved ticket: [title](issues/NN-slug.md): gist -->
- [01: Neome App catalog reference](issues/01-neome-app-catalog-reference.md): 30 unique public Apps (31 was a sitemap duplicate) catalogued with entities, statuses, roles, automations, 3 reports each, plus platform building blocks, entity/prefix index and PetroStar-based Delivery heuristics in research/neome-app-catalog.md
- [02: Skill inventory and flow](issues/02-skill-inventory-and-flow.md): 11 skills in plugin `neome-studio` (6 the Consultant runs, 5 that run automatically). Flow: ingest → review-draft → resolve-module ×N (questionnaire → ingest loop) → build-brd. A draft README for Consultants is in README-draft.md
- [03: Enterprise and Engagement folder layout](issues/03-enterprise-and-engagement-folder-layout.md): Inputs and `sources.md` (markdown table) at Enterprise level; gitignored `confidential/` per Enterprise; one folder per Module (ticket/spec/prototype); `open-items.md` and `process.md` per Engagement; `brd/` data file plus versions
- [04: Module elicitation question bank](issues/04-module-elicitation-question-bank.md): 11-topic coverage list (purpose → roles → process → data → statuses → rules → exceptions → reports → integrations → volumes → priority confirm); Engagement-wide topics asked once in review-draft; agent pre-answers from Inputs (cited) or catalog (proposed, to confirm); done when every topic is answered, N/A or an Open Item
- [05: BRD page structure and look](issues/05-brd-page-structure-and-look.md): Module explorer layout (sidebar of Modules, mapping card + filterable Requirement cards per Module); fit table on summary and per Module; fixed section order; print always the full linear A4 doc; in-progress Modules shown, marked. Prototype in prototypes/05-brd-layout-PROTOTYPE.html
- [06: Process diagram rendering](issues/06-process-diagram-rendering.md): Mermaid (flowchart with lane subgraphs + per-Module stateDiagram) generated from the BRD data file and turned into static SVG by `mmdc` at build time; no JS in the BRD; lanes are a hint; pinned version. Prototype in prototypes/06-process-diagram-PROTOTYPE.html
- [07: Module spec template](issues/07-module-spec-template.md): markdown, 13 fixed sections (one per ticket 04 topic plus Requirements, Neome mapping and Open Items); tables for structured parts; Requirements as H3 blocks; inline Source on every fact; BRD shows purpose, mapping, Requirements, statuses and OIs; the data file carries all sections
- [08: BRD data schema](issues/08-brd-data-schema.md): JSON built by build-brd from the markdown (never hand-edited); live `brd-data.json` + frozen `versions/v<N>.json`; stores facts only (fit, metrics and Mermaid are derived); every fact object has `sources` + `proposed`; ID regexes; JSON Schema + cross-reference check, strict for resolved Modules; `schemaVersion` semver
- [11: Async questionnaire loop](issues/11-async-questionnaire-loop.md): items = open Enterprise OIs (ID = OI-NN) with suggested answer; master `QN-<date>.md` → printable HTML + WhatsApp `.txt`, no form; one file per send, by Module, `All` first; reply saved as `QA-n` Source, ingest matches by OI ID after the Consultant confirms; Yes closes and un-proposes, Edit sets the Module to needs-revisit; `open-items.md` gains suggested / ask to / asked in
- [12: BRD versioning and sign-off](issues/12-brd-versioning-and-sign-off.md): unnumbered preview + release mode freezes integer `v<N>`; statuses draft-for-review / signed-off; change log = snapshot diff + Consultant summary line; sign-off = whole BRD, two signers + evidence Source, needs all Modules resolved; signed version frozen and its proposed items count as agreed; phase 2 takes the latest signed-off version
- [13: Facade layout: human files vs agent files](issues/13-facade-layout-human-vs-agent-files.md): strict one-way facade; humans only drop files (`inputs/`, `confidential/`) and read views (`brd/`, `prototypes/`, `questionnaires/`); everything else (glossary, registers, map, specs, JSON) under `_agent/` at Enterprise and Engagement level; ticket.md header → YAML front-matter; paths of 03/07/08/10/11/12 updated
- [09: Collect Neome UI reference](issues/09-collect-neome-ui-reference.md): tokens-only; Prototype look = Vendorgate design system in ui-reference/tokens.md; product screenshots deferred to fog
- [10: Module Prototype shape](issues/10-module-prototype-shape.md): one HTML per Module, 3 tabs (clickable app mock / guided scenarios tied to Requirements + OIs / mobile screens + Requirement trace); fixed template + per-Module data (`prototype-data.json` holds agent-proposed sample rows + scenarios); in-memory only. Prototype in prototypes/10-module-prototype-PROTOTYPE.html
- [14: Prototype look from real Neome screens](issues/14-prototype-look-from-real-neome-screens.md): Prototype moves to Neome product look (Material-style: Roboto, tile launcher, grey bars, tinted kanban, right drawer, bot notifications, two-device scenarios) in ui-reference/tokens.md; BRD keeps Vendorgate look; shape unchanged. Prototype in prototypes/14-neome-look-PROTOTYPE.html
- [15: Consultant onboarding](issues/15-consultant-onboarding.md): Claude Code only; clone repo = plugin install (local marketplace in `.claude/settings.json`), `npm ci` pins mmdc; skills auto pull/commit/push; per-Module claim + Engagement lock for shared steps; `studio` checks setup; root CLAUDE.md rules + trimmed README with setup checklist and first-run walkthrough
- [16: Delivery plan in the BRD](issues/16-delivery-plan-in-the-brd.md): optional, indicative "Implementation plan" section after Modules; relative-week phases + Not yet placed list in `_agent/plan.md`; agent drafts skeleton and places Modules, only the Consultant sets weeks; release warns on gaps; optional `plan` object added to schema
- [17: Enterprise glossary lifecycle](issues/17-enterprise-glossary-lifecycle.md): one glossary per Enterprise shared by all Engagements; seeded by ingest from Inputs (no catalog terms); entries carry Source, proposed/agreed and Used in; one meaning per term, so a conflict raises an OI (or splits the term) and a rename moves the old name to Avoid; agreed when the Enterprise confirms or signs off; BRD shows only this Engagement's terms; the frozen version JSON is the glossary as of sign-off
- [19: Home for Engagement-wide Requirements](issues/19-home-for-engagement-wide-requirements.md): not a Module; separate "Across all Modules" section, IDs `GEN-NN` (GEN reserved) with fixed topic tag (access, localisation, hosting, migration, training, support, other); lives in `_agent/general.md`; written by ingest/review-draft (resolve-module under lock); no mapping, not in fit table; sign-off needs every topic covered; additive `general` object in schema
- [18: Testing the skills](issues/18-testing-the-skills.md): two layers: deterministic checks (schema, citations, trace, How-to-talk, render) in GitHub Action on every push; golden-replay evals (anglo-gulf full flow, petrostar mapping, tiny-synthetic mechanics) with a simulated client from an answer key, LLM-judged scorecard (hard: valid, 0 uncited/invented; recall ≥80%, OIs ≥70%, no >5pt regression), maintainer approves before merge to main; fixtures = anonymised real Inputs, supplied by Consultant
- [20: Pulling upstream skills-main changes](issues/20-pulling-upstream-skills-main-changes.md): pin per cloned skill in SKILL.md front-matter (`upstream` path + `upstreamVersion`); no snapshot in repo; maintainer-only `upstream-check` on demand (~quarterly) diffs old→new tag, agent proposes re-adapt keeping How-to-talk + terms, maintainer accepts per skill; text changes pass checks + evals, pin-only bumps checks only; `upstreamDiverged` opt-out; MIT notice in `LICENSE-upstream`

## Not yet specified

- **Real Neome approval screens:** footage has no approval UI; Prototype guesses approve-from-bot-chat. Revisit when approval screenshots exist.

## Out of scope

- **Low-level Neome build mapping:** internal capability docs, Studio configuration, enterprise-building MCP. This is phase 2 and has its own skills and MCP; the BRD data file is the handoff to it.
- **The RFP-response proposal genre** (PetroStar style) as a separate output.
- **Pricing and commercials.**
- **Building the skill pack itself.** That happens after the map, via /to-spec and /to-tickets.
- **Multi-language BRDs** (e.g. Arabic for Gulf Enterprises): v1 is English only. Ruled out by the Consultant after ticket 18; a later effort can add it.
