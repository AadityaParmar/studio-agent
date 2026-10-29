# 33 — Module Prototype (engine render + `build-prototype`)

**What to build:** For a Module with a spec, `build-prototype` writes `prototype-data.json` (4–8 sample rows over every status, scenarios) and the engine renders a single offline HTML Prototype in the Neome look from a fixed template, with App, Scenarios and Mobile + trace tabs. Spec: Prototype, stories 64–77.

**Blocked by:** 22 — BRD data file build + validation

**Status:** resolved

- [x] Engine `build-prototype <engagement> <PREFIX>`: spec + data → HTML from fixed template; no agent-written HTML
- [x] Banner: PROTOTYPE, Enterprise, prefix, Req/OI counts, indicative App + Delivery
- [x] App tab: sheet, kanban by status, record drawer, role switcher, working action per transition, bot notification to next role
- [x] Scenarios tab: guided steps (actor, action, screen, what it proves); Mobile + trace tab with phone screens per key role and Requirement trace panel
- [x] Proposed chip and orange OI chip; sample rows marked sample; approve-from-bot-chat marked guessed
- [x] In memory only, reset button, no external JS, system font fallback
- [x] Done check: every Requirement in ≥1 tab, every transition in ≥1 scenario (engine test asserts both)
- [x] Eyeball checklist item for Prototype look

## Comments

- Done 2026-10-29. Engine `build-prototype <eng> <PREFIX>` (`neome-studio/engine/build-prototype.mjs`, wired in `cli.mjs`): reads the Engagement like build-brd (parse + schema + cross-ref must pass), Module needs `spec.md` + `_agent/modules/<PREFIX>-<slug>/prototype-data.json`, then `engine/prototype/model.mjs` (checks every name against the spec, derives notify / key roles / trace / step states, runs the done check) → `engine/prototype/render.mjs` (shell + `proto.css` + `proto.js`, model embedded as JSON; no agent HTML) → `<eng>/prototypes/<PREFIX>-<slug>.html` (~70 KB, deterministic). Errors class `prototype`, exit 0/1/2, nothing written on error. Skill `skills/build-prototype/SKILL.md` (5 steps: scope, read, write data, build, hand back) + `references/prototype-data.md` (8 keys, step shape, done check). Fixture `engine/test/fixtures/build-prototype/after-prototype/` (after-spec + QUO `prototype-data.json` written by hand following the skill: 8 rows over 7 statuses, 7 scenarios). Tests `engine/test/build-prototype.test.mjs` (18, incl. one headless-Chrome test: actions, notification, scenarios, every Requirement lights up via the trace, reset, no console errors, no network requests). Eyeball checklist "Prototype look" in `evals/README.md`. `npm test`: 256 pass, check 11 skills OK.
- Look = prototype 14 (Neome product tokens), shape = ticket 10: App (role switcher "Person (Role)", tile launcher with entity / report / Rules tiles and other Modules greyed, sheet + kanban, drawer DETAILS/ACTIVITY with editable fields at start status, child entities as tables, gating rules shown, actions per transition, FAB create, report view, Rules master-data sheet, bot notifications), Scenarios (list, step progress, actor + action, desktop screen + next role's phone, chat screen, proves with acceptance, OI callout, coverage of Requirements and transitions), Mobile + trace (per key role: home, record, bot chat with working actions marked guessed; trace panel lists places per Requirement, click lights up `data-req` elements in every tab, places jump to tab/scenario/role). Roboto not embedded: system fallback.
- Small choices (my call; revisit if wrong):
  - `prototype-data.json` holds only what the spec lacks: `entity`, `roles` (person + reqs/oi), `fields`/`rules`/`reports` overlay (reqs/oi), `transitions` (one per spec transition, required: `action`, `by` roles or `system`; optional `notify`, `rules`, `guard` = AND of `field op value`, `oi`), `rows`, `scenarios`. Unknown keys / names = error. Proposed flags come from the spec, not the data.
  - Notify default = roles acting on the new status, else (end status) the roles acting at the start status; never the role that just acted; none left = no message. Key roles (phones) = anyone who acts or is notified.
  - Rows: 4–8, every status covered (limit becomes the status count if > 8). Scenarios replay from the sample rows: row must be in `from`, actor in `by`, guards hold — so scenarios cannot contradict the App.
  - "Every Requirement in ≥1 tab" = in some `reqs`/`proves`; all those elements render with `data-req`, the Chrome test proves each lights up. Withdrawn Requirements excluded and refused in data. Closed OI in data = warning, no chip; OI chips only for open OIs.
  - Banner OI count = open OIs of the Module (section 13 rule) + open OIs on any element. Mapping App name from catalog slug list; Delivery "· indicative".
  - Report screen = counts per status from the sample rows, labelled as an idea only.
  - Handoff from 30/32 done here (story 75): `module rename` renames `prototypes/<old folder>.html` with the folder and prints a rebuild line; `module merge` removes the merged Module's view and prints a rebuild line for the target. `reference/map-logic.md` updated.
  - Fixed a ticket-30 bug found on the way: `module rename/merge` did not repoint `plan.md` (header `Modules` not matched); now `module` and `modules` headers both match.
- Not verified: live Claude session of the skill (simulated: wrote the fixture data following SKILL steps 2–4 on the after-spec fixture; build exit 0 on first fix round). Safari/Firefox, narrow screens / real phones, big Modules (many fields/statuses: kanban gets wide), print (not a goal). The Chrome test may be skipped where puppeteer is absent; it launches its own Chrome (same flakiness risk under load as mmdc, ticket 27 note).
- Handoffs: 34 (`resolve-module`): call `build-prototype` after `write-module-spec` (spec-check exit 0), close only when the page exists; commit `prototype-data.json` + `prototypes/<PREFIX>-<slug>.html`; on any spec change (revisit, ingest reply) rebuild; after `module rename` rebuild under the new prefix. 36 (`ingest`): Prototype feedback = Input with Source type `PF`; a change touching a resolved Module → needs-revisit, the revisit rebuilds the Prototype. 38 (`studio`): Prototype missing for a resolved Module could be shown as a gap. 39 (READMEs): "Where things live" should list `prototypes/` as a view.
