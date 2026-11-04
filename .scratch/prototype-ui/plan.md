# Prototype UI redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Prototype page's App / Scenarios / Mobile + trace tabs with How it works (swimlane + guided steps) / Try it / By role / Questions for you, plus Consultant mode, without breaking existing `prototype-data.json` files.

**Architecture:** `model.mjs` gains three optional step keys and derived per-step/per-scenario data (label, behind, notify, create flag, proposed flag, lanes, kind) and renames trace tab ids. `proto.js`/`proto.css` are rewritten to draw the new tabs from the model; `render.mjs` header changes. Skill docs gain the new keys.

**Tech Stack:** Node ≥20 ESM, `node:test`, puppeteer (in node_modules) for the headless Chrome test, plain ES5 browser JS.

**Spec:** `.scratch/prototype-ui/spec.md` (mockup: `.scratch/prototype-ui/mockup-how-it-works.html`).

## Global Constraints

- One self-contained HTML file; no external JS/CSS/fonts; no network requests; no localStorage.
- Same model → byte-identical file.
- Fixed template + data; no agent-written HTML.
- Neome look (tokens `docs/v1/history/ui-reference/tokens.md`) for screens inside the page.
- Customer view never shows: "transition", "Requirement", "Open Item", OI ids, "trace", "guard". Those appear only in Consultant mode (and OI ids in the copied feedback text).
- Old data files without the new keys must still build.
- `docs/v1/` is frozen; decision change goes in `.scratch/prototype-ui/map.md`.
- `npm test` green at every commit.

## Review Focus

- Scenario whose steps all have no row (report-only) → flow map status row empty, no crash. Test: Task 1 `scenarioLanes` on fixture scenario 7 (report).
- Step `label` longer than 40 → build error naming the step. Test in Task 1.
- `notify` naming a non-role → build error. Test in Task 1.
- Module with no statuses (sheet only) → How it works and Try it still render; no status line. Covered by Chrome test? No fixture → Task 2 adds a unit check that `render` of a model with `statuses: []` does not throw (load page in puppeteer with an edited fixture where spec has no statuses is too costly; instead run proto.js under puppeteer with a hand-made minimal model via `renderPrototypeHtml`).
- Clicking Next on the last step of the last scenario wraps to scenario 1 step 1. Chrome test in Task 2.

---

### Task 1: Model: new step keys + derived data + trace ids

**Files:**
- Modify: `neome-studio/engine/prototype/model.mjs`
- Modify: `neome-studio/engine/test/build-prototype.test.mjs`
- Modify: `neome-studio/skills/build-prototype/references/prototype-data.md`, `neome-studio/skills/build-prototype/SKILL.md` (step 3.4)

**Interfaces (Produces, on `model`):**
- `scenarios[i].kind`: `"normal flow" | "open question" | "report" | "other case"` (rule in spec tab 1.1).
- `scenarios[i].lanes`: ordered role names acting in the scenario (section 2 order), then `"system"` if any system step.
- `steps[k]`: existing fields plus `label: string`, `behind: string[]`, `notify: string[]` (explicit or derived), `create: boolean`, `from: string|null` (status before the step, null when no row), `proposed: boolean` (transition/actor role/status proposed).
- `trace[id][n].tab` ∈ `"how" | "try"`; mob places become `{ tab: "try", phone: true, role, what }`; scen places `{ tab: "how", sc, step, what }`.

- [ ] **Step 1: Write failing tests** in `build-prototype.test.mjs`:
  - `"steps: label defaults to the button name, else first 4 words; explicit label kept"` — QUO fixture: a transition step's `label` = its transition `action`; a no-transition step with action "Opens the Quotation pipeline report" → `"Opens the Quotation pipeline…"`; set `steps[0].label = "Send it"` → `"Send it"`.
  - `"steps: label over 40 chars refused"` — `refused(d => d.scenarios[0].steps[0].label = "x".repeat(41), /label is 41 chars \(max 40\)/)`.
  - `"steps: behind and notify optional; derived when missing; notify must be roles"` — derived `behind` of a gated transition step includes `"<rule when> → <rule action>"` text; explicit `behind: ["A"]` → `["A"]`; explicit `notify: ["Accounts"]` → `["Accounts"]`; `refused(d => d.scenarios[0].steps[0].notify = ["Boss"], /notify "Boss" is not a role in section 2/)`.
  - `"steps: create step = first touch of a start-status row by its owner, no transition"` — add a fixture-edited step at the start of a scenario on a draft row with no transition by the owner → `create === true`; a later view-only step on the same row → `false`.
  - `"scenarios: kind and lanes"` — scenario 0 kind `"normal flow"`; the scenario with an OI step `"open question"`; report scenario `"report"`; lanes of scenario 0 in section 2 order.
  - Update existing asserts: trace tab set `["how","try"]` (line ~167); Chrome-test goto parsing handled in Task 2.
- [ ] **Step 2: Run** `node --test neome-studio/engine/test/build-prototype.test.mjs` → new tests FAIL.
- [ ] **Step 3: Implement** in `model.mjs`: add keys to step parse (`label`, `behind` list of strings, `notify` list of roles); compute `from` before applying the transition in the replay loop; `create` per rule (owner = a role in `actors(startStatus)`; track rows touched per scenario); derived `behind` = for transition steps `t.rules` → `"${rule.when} → ${rule.action}"` (plain text, markdown stripped like `plain()` does in proto.js), guards → `"Only when ${field} ${op} ${value}"`; for create steps, fields whose `notes` match `/\b(auto|automatic(ally)?|set by (the )?system|system[- ]set)\b/i` → `"${name} is filled in by Neome"`. `kind`, `lanes`, `proposed` per spec. Trace ids per Interfaces.
- [ ] **Step 4: Docs**: `prototype-data.md` step line gains `label`, `behind`, `notify` with one-line rules; `SKILL.md` 3.4 gains the sentence from spec "Data changes". The skill test (`"skill: writes data only…"`) must still pass.
- [ ] **Step 5: Run** `npm test` → PASS (Chrome test may fail on trace ids until Task 2 → if so, Task 1 and 2 commit together; otherwise commit now).
- [ ] **Step 6: Commit** `build-prototype model: step label/behind/notify, create steps, scenario kind + lanes, trace tabs how/try`.

### Task 2: Template: new tabs, header, Consultant mode

**Files:**
- Modify (rewrite): `neome-studio/engine/prototype/proto.js`, `neome-studio/engine/prototype/proto.css`
- Modify: `neome-studio/engine/prototype/render.mjs` (title stays `PROTOTYPE · …`; noscript text)
- Modify: `neome-studio/engine/test/build-prototype.test.mjs` (banner test, offline test, Chrome test)

**Interfaces:**
- Consumes: Task 1 model fields.
- Produces DOM hooks for tests: tabs `[data-on="tab"][data-v="how|try|role|q"]`; flow boxes `.box[data-on="go"][data-i]`; Next/Back `[data-on="step"][data-d="1|-1"]`; scenario pills `[data-on="scen"][data-sc]`; hotspot `.hot`; Try-it role chips `[data-on="role"][data-role]`, view toggle `[data-on="device"][data-v="desk|phone"]`, actions `button[data-on="act"][data-t]`, rows `[data-on="open"][data-row]`, reset `[data-on="reset"]`; answers `textarea[data-change="answer"][data-key]`; copy `[data-on="copy"]` writing to `#copy-out` textarea; consultant `input[data-change="consult"]`; trace panel `.trace .r[data-on="trace"][data-id]`, `a[data-on="goto"]`.

- [ ] **Step 1: Rewrite tests**:
  - Banner test → header: `"Prototype · not the live app"`, Module name, Enterprise; App/Delivery chips present in HTML only inside `.consult-only`.
  - Chrome test `"headless Chrome: how it works, try it, by role, questions, consultant mode, no errors or requests"` asserting: loads on How it works with N `.box` = scenario 0 step count and text "Step 1 of"; clicking `.box[data-i="2"]` shows "Step 3 of"; a transition step has exactly one `.hot` and tooltip "presses"; walk Next through every step of every scenario (sum of steps) → back at "Step 1 of" scenario 1, no page errors; Try it: chip Sales exec, open Q-1044, Send PDF disabled, Submit for approval → kanban "Waiting approval (2)"; device phone renders 3 `.phone`; Reset → "Draft (2)"; By role shows each role's button labels; Questions: type "yes" in first answer, click copy → `#copy-out` value contains "Prototype feedback · Harbor Tiles · QUO Quotations" and "A: yes"; customer view body text contains none of `/\bOI-\d|Requirement|transition/`; Consultant mode on → each Requirement's goto lights `.hl`; no requests.
  - Minimal-model check `"template: sheet-only module (no statuses) renders"`: puppeteer `page.setContent(renderPrototypeHtml(modelWithNoStatuses))` → no pageerror.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `proto.js` per spec tabs 1–4 + Consultant mode, porting the mockup's lanes/wires/hotspot/side cards and today's drawer/kanban/sheet/report/rules/phone pieces (drop `sample` chips, other-Module tiles, `guessed` stays only on chat screens as a small caption). Keyboard ← →. Copy uses `navigator.clipboard.writeText` when available and always fills `#copy-out`.
- [ ] **Step 4: Run** `npm test` → PASS. Screenshot each tab of the QUO fixture with headless Chrome and look.
- [ ] **Step 5: Commit** `build-prototype page: How it works / Try it / By role / Questions + Consultant mode`.

### Task 3: Decision record + Deans Pond rebuild

**Files:**
- Create: `.scratch/prototype-ui/map.md` (Notes / Decisions-so-far / Fog)
- Modify (rebuilt views): `enterprises/deans-pond/engagements/hoa-mgmt/prototypes/*.html`

- [ ] **Step 1:** Write `map.md` with the supersedes-D09/D10 line from the spec.
- [ ] **Step 2:** For each of ANN MEM PAY RPAY TKT VEN: `node neome-studio/engine/cli.mjs build-prototype enterprises/deans-pond/engagements/hoa-mgmt <PREFIX>` → exit 0.
- [ ] **Step 3:** Screenshot How it works / Try it / By role / Questions for each; fix any rendering issue in Task 2 files (rerun tests).
- [ ] **Step 4: Commit** `deans-pond: rebuild Prototypes with new page`.
