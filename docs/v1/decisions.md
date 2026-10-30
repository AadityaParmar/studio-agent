# v1 Decisions: Neome Requirements Studio

Final state of every design decision (tickets 01–20, 44). Later tickets already folded in (e.g. 13 moved paths of 03; 18 lost `petrostar-crm`). Terms per [GLOSSARY.md](../../GLOSSARY.md).

Full history: [map.md](history/map.md), [issues/](history/issues/), [spec.md](history/spec.md).

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

---

## D00 Standing rules (map Notes)

- Consultant runs skills. Enterprise only answers (live or Questionnaire).
- Every Input → Source with ID. Every fact cites a Source or is `(proposed, to confirm)`.
- Never assume. Gaps → Open Items.
- One Module per session: grill → spec → Prototype.
- BRD = fixed HTML template filled from one BRD data file. That file = phase-2 contract.
- Neome App + Delivery = indicative only, from public catalog.
- Every skill carries the How to talk block verbatim.
- Packaging: one private repo = plugin + `enterprises/<ent>/engagements/<slug>/`.
- Out of scope: low-level Neome build mapping (phase 2), RFP-response genre, pricing, multi-language BRDs (English only).

## D01 Neome App catalog ([01](history/issues/01-neome-app-catalog-reference.md))

- 30 unique public Apps (31 = sitemap dup). 28 self-serve, 2 licensed verticals (Vehicle & Driver, FMCG Field Sales).
- Per App: entities + record codes, statuses, roles, automations, approvals, 3 reports.
- Platform building blocks listed (sheet, forms, kanban, masters, bulk insert, approval chains, maker-checker, SLA, mobile/offline, GPS, AI, WhatsApp/email/Slack).
- Gaps: no finance/ERP App, no builder limits, no permission granularity public.
- Delivery heuristics (Standard / Configuration / Custom module) from 17 PetroStar mappings.
- Shipped: `neome-studio/reference/neome-app-catalog.md` + `neome-app-catalog-slugs.json`.

## D02 Skills and flow ([02](history/issues/02-skill-inventory-and-flow.md))

Plugin `neome-studio`, 11 skills, `/neome-studio:<skill>`.

| Skill | Who runs | Job |
|---|---|---|
| `studio` | Consultant | router + setup check; writes nothing (except stale lock clear, after asking) |
| `ingest` | Consultant | Inputs → Sources, draft Modules/Reqs/OIs/glossary; later: Questionnaire replies |
| `review-draft` | Consultant | quiz on draft: confirm/merge/split/rename Modules, process skeleton, Engagement-wide topics, plan skeleton |
| `resolve-module` | Consultant | claim → grill → spec → Prototype → close; revisit = short pass |
| `questionnaire` | Consultant | open Enterprise OIs → QN HTML + TXT |
| `build-brd` | Consultant | preview / release / sign-off |
| `grill-module` | model | 11-topic grilling |
| `write-module-spec` | model | 13-section spec + done check |
| `neome-mapping` | model | spec section 12 |
| `build-prototype` | model | `prototype-data.json` → Prototype |
| `enterprise-glossary` | model | glossary lifecycle |

- Flow: ingest → review-draft → resolve-module ×N (questionnaire / Prototype feedback → ingest → revisit) → build-brd → sign-off.
- Sign-off = `build-brd` mode, not a skill. Prototype feedback = Input, no skill.
- Map logic (frontier, claim, close) = shared reference, no wayfinder clone.
- Building blocks visible in slash menu; `studio` points only at the 6.

## D03 + D13 Folder layout: facade ([03](history/issues/03-enterprise-and-engagement-folder-layout.md), [13](history/issues/13-facade-layout-human-vs-agent-files.md))

```
enterprises/<ent>/
  inputs/                         HUMAN drop (git); ingest renames to <SOURCE-ID>-<slug>.<ext>
  confidential/                   HUMAN drop, gitignored
  _agent/
    GLOSSARY.md                   Enterprise glossary
    sources.md                    Source register (whole Enterprise)
    sources/<SOURCE-ID>.md        text copy of every Source (confidential too)
  engagements/<slug>/
    brd/preview.html, v<N>.html   HUMAN views
    prototypes/<PREFIX>-<slug>.html
    questionnaires/QN-<date>.html|.txt
    _agent/
      map.md process.md open-items.md general.md plan.md
      modules/<PREFIX>-<slug>/ticket.md spec.md prototype-data.json
      questionnaires/QN-<date>.md
      brd/brd-data.json  brd/versions/v<N>.json
```

- One-way: humans drop (`inputs/`, `confidential/`) + read views. `_agent/` = only truth. Views never read back; deletable + rebuildable.
- Source IDs unique per Enterprise. Every Source has a file (WS, SD, QA, SO too).
- Confidential: original gitignored; text copy committed; content may appear in outputs.
- `ticket.md` = YAML front-matter (`status`, `prefix`, `name`, `blockedBy`, `revisitReason`, `formerly`, `claimedBy`).
- Module status: open / claimed / resolved / needs-revisit / merged-into `<P>`. Rename = folder rename + `formerly`. Merge/split = old folder kept as `merged-into`. Never delete.
- `open-items.md` columns: ID | question | Module(s) | owner | ask to | suggested | status | asked in | answer Source (+ optional note, raised in).
- Views follow Modules (rename → rename Prototype; merge → remove).

## D04 Question bank ([04](history/issues/04-module-elicitation-question-bank.md))

- Coverage list, not script. 11 topics: purpose/pain → roles → process (AS-IS/TO-BE) → records → statuses → rules → exceptions → reports → integrations → volumes/NFRs → priority + scope confirm.
- Engagement-wide topics asked once in `review-draft` (access, localisation, hosting, migration, training, support). OIs Module = `All`.
- Pre-answer tiers: Inputs (cite) · catalog (proposed) · always asked (goals/KPIs, roles/headcount, approval thresholds, final statuses, volumes, system of record, integration owner, priority).
- Consultant relays Enterprise → logged in WS-n with speaker. Consultant's own view → proposed + OI.
- Done = every topic answered, N/A with reason, or OI.
- Rounds ≤5 items, each with suggested answer (same shape as Questionnaire item).
- Acceptance + MoSCoW drafted by agent, one bulk confirm; unconfirmed → one Engagement OI.
- Lives: `skills/grill-module/references/question-bank.md`.

## D05 BRD page ([05](history/issues/05-brd-page-structure-and-look.md))

- Module explorer: dark sidebar (Overview · Modules · Register). Single self-contained HTML.
- Module view: eyebrow, name, In progress chip, purpose, mapping card (indicative), filters (All/Must/Open scope/Has OI), Requirement cards (folded acceptance, proposed chip, OI links), Module OI box.
- Summary: metrics, scope at a glance, fit table, How to read.
- Order (screen = print): Cover/Summary → How to read → Scope and fit → Process → Modules → Across all Modules → Implementation plan → OI register → Glossary → Sources → Versions + sign-off.
- Print: full linear A4, new page per section/Module, repeated headers, footer Engagement · version · status · page x/y.
- In-progress Modules always shown, marked.
- Look: Vendorgate tokens (Schibsted Grotesk + JetBrains Mono, `#1877D5`, accent `#F47100`). Delivery: Standard green, Configuration blue, Custom orange, Open dashed orange.

## D06 Diagrams ([06](history/issues/06-process-diagram-rendering.md))

- BRD data → Mermaid text (derived, never stored) → pinned `mmdc` → static SVG inline. No mermaid.js.
- Process: `flowchart TB`, subgraph per lane, step tagged with Module prefix, diamonds, dotted alternates, externals grey.
- Per Module: `stateDiagram-v2 LR`, `[*]` start/end, trigger labels.
- OI-dependent node: dashed orange + OI ID. Lanes = hint only.
- Pin mermaid-cli (12.0.0). Missing/wrong version → clear error.

## D07 Module spec ([07](history/issues/07-module-spec-template.md))

- Markdown, header (Prefix, Name, Status, Sources) + 13 fixed H2: 1 Purpose/KPIs · 2 Roles · 3 Process · 4 Records · 5 Statuses · 6 Rules · 7 Exceptions · 8 Reports · 9 Integrations · 10 Volumes/NFRs · 11 Requirements · 12 Neome mapping · 13 Open Items.
- Unused = `N/A: <reason>`, never deleted. Tables for structured parts.
- Requirement H3: ID, title, statement, acceptance, priority, scope, Sources, OIs, Proposed, optional Delivery override.
- If it needs sign-off, it's a Requirement. Data file carries all sections; BRD shows subset.
- Inline Source on every fact. IDs `<PREFIX>-NN`, never reused; withdrawn kept.
- Notes column: `Values: A / B / C`, `Links to: <entity>`.
- Section 12 by `neome-mapping`; rest by `write-module-spec`. Done check before close.

## D08 BRD data schema ([08](history/issues/08-brd-data-schema.md))

- JSON built by engine from `_agent/` markdown; never hand-edited. Markdown = truth.
- Live `_agent/brd/brd-data.json` + frozen `versions/v<N>.json`.
- Facts only; fit, metrics, progress, counts, Mermaid derived.
- Every fact object: `sources[]` + `proposed`. Dead things (withdrawn, merged) stay.
- IDs: prefix `^[A-Z]{2,5}$`; Req `<PREFIX>-NN`; `OI-NN` per Engagement; Source `^[A-Z]{2,4}(-\d+)?$`; local IDs kebab.
- Validation: JSON Schema (2020-12) + cross-ref. Resolved Modules strict; in-progress gaps = warnings; broken refs always errors.
- `schemaVersion` semver (now `1.0.0`). Breaking = major bump; phase 2 refuses unknown major.
- Schema: `skills/build-brd/references/brd-data.schema.json` + `brd-data-schema.md`.

## D09 + D14 Prototype look ([09](history/issues/09-collect-neome-ui-reference.md), [14](history/issues/14-prototype-look-from-real-neome-screens.md))

- Prototype = Neome product look (Roboto/Material, tile launcher, grey title bars, tinted kanban, right drawer, bot notifications, two-device scenarios). Tokens: [history/ui-reference/tokens.md](history/ui-reference/tokens.md).
- BRD keeps Vendorgate look.
- Approve-from-bot-chat = guessed (no real approval screens). Open: revisit when screenshots exist.

## D10 Prototype shape ([10](history/issues/10-module-prototype-shape.md))

- One HTML per Module, 3 tabs: App (sheet, kanban, drawer, role switcher, actions per transition) · Scenarios (actor, step, what it proves, OI callout) · Mobile + trace.
- Fixed template + data. No agent-written HTML. `prototype-data.json` = only what spec lacks (sample rows 4–8 over every status, scenarios, overlays).
- In memory only, reset, no external JS.
- Done: every Requirement in ≥1 tab, every transition in ≥1 scenario.

## D11 Questionnaire loop ([11](history/issues/11-async-questionnaire-loop.md))

- Items = open Enterprise-owned OIs only. Item ID = OI ID.
- Master `_agent/questionnaires/QN-<date>.md` → HTML (A4, no JS) + TXT (WhatsApp). No form.
- One file per send, one named contact. Sections by Module, `All` first, Must first. ~25 soft cap.
- Item: `OI-07 · For: <role>` / question / `Suggested:` / `Reply: Yes / Edit: ___ / Don't know`.
- Reply → Source `QA-n`. `ingest` proposes match list; Consultant confirms before any write.
- Yes → close OI, un-propose fact. Edit → close OI, Module needs-revisit. Don't know → stays open + note. New question → new OI.

## D12 Versioning + Sign-off ([12](history/issues/12-brd-versioning-and-sign-off.md))

- Preview = unnumbered "Working draft". Release = frozen integer `v<N>` (HTML + JSON).
- Status: `draft-for-review` | `signed-off`. Superseded derived.
- Change log = auto-diff `v<N-1>`→`v<N>` + Consultant summary line; earlier entries copied forward.
- "Changed" Req = statement, acceptance, priority, scope, delivery, withdrawn.
- Sign-off: whole BRD only; 2 signers (Enterprise + Neomenta) + evidence Source (`SO-n`). Lists OIs open + proposed items accepted.
- Preconditions: all Modules resolved/merged, every GEN topic covered, no Must with TBC/open.
- Signed version frozen forever. Next build clears `proposed` on accepted, unchanged items.
- Phase 2 takes latest signed-off snapshot.

## D15 Onboarding + git ([15](history/issues/15-consultant-onboarding.md))

- Claude Code only. Clone repo = plugin install (local marketplace in `.claude/settings.json`).
- `npm ci` pins mmdc. `studio` checks setup every run.
- Skills own git: user skills pull at start, commit + push at end (`<skill>: <ent>/<slug> <what>`). Never force-push. Building blocks don't touch git.
- Concurrency: per-Module claim (push `claimed` + `claimedBy` first). `ingest`, `review-draft`, `build-brd` (+ shared edits in `resolve-module`) take Engagement lock (`lock:` line in `_agent/map.md`).
- Root CLAUDE.md = rules; root README = Consultant guide; `neome-studio/README.md` = maintainer doc.

## D16 Implementation plan ([16](history/issues/16-delivery-plan-in-the-brd.md))

- Optional, indicative. `_agent/plan.md`. Phases on relative weeks + Not yet placed list.
- Agent drafts 4-phase skeleton (masters, workflow, uat, go-live), places Modules. Only Consultant sets weeks.
- No pricing, no dates. Phases never restate Requirements.
- Release warns: phase without weeks/still proposed, resolved Module unplaced.

## D17 Enterprise glossary ([17](history/issues/17-enterprise-glossary-lifecycle.md))

- One per Enterprise, shared by Engagements. Seeded from Inputs only (no catalog terms).
- Entry: term, definition, _Avoid_, _Source_, _Status_ proposed|agreed, _Used in_.
- One meaning per term. Conflict → OI + disputed. Two real meanings → split, bare word to Avoid. Rename → old name to Avoid.
- Agreed when Enterprise confirms (Questionnaire) or signs a BRD showing it.
- BRD shows only this Engagement's terms. No Engagement lock; pull before write, commit right after.

## D18 Testing ([18](history/issues/18-testing-the-skills.md))

- Layer 1 checks: `npm test` + GitHub Action. How-to-talk, front-matter, schema, cross-ref, render, trace, release rules, upstream pins.
- Layer 2 evals: golden replay with simulated client (answers only from answer key). Cases: `anglo-gulf-crm` (full flow), `tiny-synthetic` (mechanics). `petrostar-crm` dropped 2026-10-30.
- Scorecard hard: valid, 0 uncited, 0 invented, 0 "don't know" without OI. Soft: Req recall ≥80%, OIs ≥70%, Module set ≥80%, no drop >5 pts.
- Gate: skill text change → checks + evals + maintainer spot-check before merge to `main`.
- Rollout: one real Engagement shadowed by maintainer before team use.

## D19 Engagement-wide Requirements ([19](history/issues/19-home-for-engagement-wide-requirements.md))

- Not a Module. `GEN-NN` (GEN reserved). Topic tag: access, localisation, hosting, migration, training, support, other.
- `_agent/general.md`, H2 per topic. Only if no single Module owns it.
- BRD section "Across all Modules". No mapping, not in fit table.
- Sign-off needs every topic covered (Req, N/A, or `All` OI).

## D20 Upstream skills-main ([20](history/issues/20-pulling-upstream-skills-main-changes.md))

- Upstream = `github.com/mattpocock/skills`. Pin in SKILL.md front-matter: `upstream` + `upstreamVersion` (1.3.1).
- No snapshot in repo. Maintainer-only `neome-studio/maintainer/upstream-check.mjs`, ~quarterly.
- Agent proposes re-adapt keeping How-to-talk, terms, facade paths. Maintainer accepts per skill. Never auto-merge.
- `upstreamDiverged: <reason>` = opt out. MIT notice `neome-studio/LICENSE-upstream`.

## D44 Next-step handoff ([44](history/issues/44-next-step-handoff-at-session-end.md))

- All 6 user skills end (after push, also on early stop) with `Next session:` ≤3 runnable lines.
- From engine `status` `step | <skill> | <args> | <why>`. Same logic as `studio`.
- Args = repo-relative Engagement path (+ PREFIX for resolve-module). Every user skill accepts `<engagement-path> [<PREFIX>]`.

## Open after v1

- Real Neome approval screens (Prototype guesses approve-from-chat).
- See [build.md](build.md) "Not verified" for build-level gaps.
