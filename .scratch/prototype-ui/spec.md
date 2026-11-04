# Prototype UI redesign: spec

Status: ready-for-agent
Approved: Aditya, 2026-11-04 (chat). Builder check done; answers folded in.
Mockup (approved by Aditya, 2026-11-04): [mockup-how-it-works.html](mockup-how-it-works.html), hand-written, TKT tickets data, tab 1 scenario 1 only.

## Why

The Prototype goes to the Enterprise (the customer), who must understand how one Module will work in Neome and say "right" or "change this". Today's page (App / Scenarios / Mobile + trace) is hard to follow:

- It opens on a kanban with no "what do I do here".
- Chips are everywhere (`sample`, `proposed`, `guessed`, Requirement IDs), rule text comes as one long dump, and the trace list is very long.
- In a scenario step, the action is hard to spot. Nothing shows the button being pressed or what changed.
- Open Items, the questions the Enterprise must answer, are hidden.
- "Mobile + trace" puts two unrelated things in one tab.

Goal: the customer sees the whole flow at a glance (who does what, in what order), walks it step by step on real-looking Neome screens, and answers the open questions. It must still match the actual Neome flow: real Neome look for screens, bot messages, statuses, roles.

## Goals

- First screen = the flow. No guessing what to click.
- Every step answers: who, presses what, status before → after, what Neome does by itself, who gets a message.
- Each role's view is easy to see.
- Open Items are prominent, with a way to answer.
- Customer feedback leaves the page as text the Consultant saves as a PF Input.
- Consultant detail (Requirement IDs, coverage, trace) is still there, hidden by default.

## Non-goals

- No change to the `prototype-data.json` shape beyond three optional step keys (below). Existing Prototypes rebuild without edits.
- No change to the model's checks (the done check, replay, guards), except renaming trace tab ids.
- No saving inside the page (no localStorage, no network). The answers live in memory until copied.
- No new screens Neome doesn't have. Approve-from-chat stays marked as guessed (route.md §5).

## Anti-goals (a failure even if it works)

- A page that looks like a generic diagram tool and not like Neome.
- Jargon in customer view: "transition", "Requirement", "Open Item", "OI-25", "trace", "guard". Customer words: step, status, question, our suggestion.
- Chips on every element again.

## Constraints (unchanged)

- One self-contained HTML file. Inline CSS + JS, no external JS or fonts (Roboto if installed, else system). No network requests.
- Byte-identical output for the same model (determinism test).
- Fixed template + data, no agent-written HTML (D10).
- Neome look from `docs/v1/history/ui-reference/tokens.md` (D09) for the screens inside the page: grey title bars, tile launcher, tinted kanban, right drawer, bot chat.
- Plain ES5-style browser JS like today's `proto.js` (no build step).
- Route: `docs/route.md` row "Prototype look / tabs" → `engine/prototype/render.mjs`, `proto.css`, `proto.js`; tests `build-prototype.test.mjs` + headless Chrome. Data key change → also "Prototype data shape" row: `model.mjs`, `skills/build-prototype/references/prototype-data.md`.

## Page layout

Header (white):
- Title: `<Module name>` + small `<Enterprise> · how it will work in Neome`.
- One note line: "👀 All names and records are made-up examples." and "<dotted underline>Dotted</dotted> = our suggestion, please confirm." Replaces every `sample` / `proposed` chip.
- Right side: small grey tag **"Prototype · not the live app"**, always shown (so nobody takes it for live Neome). Neome App + Delivery chips and Requirement / Open Item counts show only in Consultant mode. (Builder call, from review. Update the banner test to match.)
- Tabs: **How it works** (default) · **Try it** · **By role** · **Questions for you** `(N)` badge (N = open Open Items shown; tab hidden when N = 0).
- Right of tabs: `Consultant mode` checkbox. Reset button shows only on Try it.

### Tab 1: How it works (as in the mockup)

1. **Scenario picker**: pills, one per scenario: `<n> · <title>` + a small kind word. Kind: first scenario = "normal flow"; a scenario where any step has `oi` = "open question"; else a scenario with no transition step whose screen is `report` = "report"; else "other case". (Builder may refine the kind rule; keep it derived, no new data key.)
2. **Flow map** (swimlane):
   - Columns = steps of the chosen scenario. Top row "Status" = the row's status after each step (pill in status tone); empty when the step has no row.
   - Lanes = roles that act in this scenario, in section 2 order, plus a **Neome** lane (grey, "automatic") if any step's actor is `system`. Lane label: avatar circle with the person's initial, person name, role.
   - Each step = a box in its actor's lane: "Step n" + short label. Current box highlighted (blue ring), earlier boxes faded, later normal. Box border dashed amber when the step's transition, actor role or a status in it is `proposed`.
   - Curved arrows join consecutive boxes (SVG, drawn after layout; redraw on resize). Arrows up to the current step are blue.
   - Click a box → go to that step.
   - More than ~8 steps: the flow map scrolls sideways; min column width ~120px.
3. **Step stage**:
   - "Step n of m".
   - One sentence: **Person (Role)** + `action` text. "· our suggestion" in amber when proposed.
   - Status line: `Open → In progress`, or "Status stays Resolved", or "New → Open" for the first status.
   - The Neome screen for `screen` (record / sheet / kanban / chat / report / rules), drawn static like today but cleaned. The button for the step's transition gets the **hotspot**: orange pulsing ring + dark tooltip "<Person> presses <action>". For a record it is the button in the drawer footer; for chat, in the bot bubble. No transition = no hotspot.
   - Record screens: fields in a 2-column grid; fields with notes like "auto-numbered / set automatically" may show "· filled by Neome" (builder's call how to detect; skip if unclear).
   - Back / Next buttons; last step's Next = "Next story ›" (goes to the next scenario). Arrow keys ← → too.
4. **Side cards** (right column on wide screens, below on narrow):
   - **What this shows**: the acceptance criteria of `proves` Requirements, as plain ticks. No IDs (IDs only in Consultant mode).
   - **Behind the scenes**: for a transition step, each gating rule from `rules` as "<when> → <action>" short bullets, plus guards as "Only when <field> <op> <value>". Omit the card when empty.
   - **Who gets a message**: for each role in the step's `notify` (max 2), a small phone with a bot bubble: "<id>: <action> by <person>" (like today's text). None = "Nobody. Nothing is sent."
   - **Question for you** (amber card) when the step has `oi`: the question text + answer box (shared with tab 4, same answer). Otherwise **Does this look right?** 👍 Yes / ✏️ Needs change; "Needs change" opens a small text box.

### Tab 2: Try it

Today's App tab, cleaned:
- Role chips at top (avatar + "Greg · Member"), replacing the big select. Under them a hint line for the chosen role: "Greg can: Raise ticket" / "Linda can: Start work (2), Mark resolved (1)" counted from current rows; "Nothing waits for you" if none.
- **Desktop / Phone** toggle. Desktop = today's launcher + sheet/kanban + drawer. Phone = today's three phones (home, record, bot chat) for that role. The old "Mobile + trace" tab goes away.
- Drawer: action buttons move to the top bar of the drawer (still enabled/disabled by guards; disabled shows the reason as a tooltip "Only when Discount % <= 8"). Rule gates become short bullets, not one long text block.
- Remove per-card / per-row `sample` chips. Kanban cards: drop the repeated ID line when a field equals the id; show up to 3 fields.
- Other-Module tiles: hidden (today they show greyed out and confuse).
- Reset button (top right, this tab only).

### Tab 3: By role

One card per role (key roles first), each:
- Avatar, person, role, `does`.
- **Presses**: each transition they do: button label + "when status is <from>" → "<to>".
- **Gets a message when**: transitions where they are in `notify`.
- **Sees**: rules whose `when`/`action` mention the role (simple text match on role name; builder may refine). Omit when none.
- Link "See it" → Try it with that role selected.

### Tab 4: Questions for you (N)

- One card per open Open Item shown on this page: the question in plain words, where it shows up ("Step 1 of 'Member wants to reply'", "Status: Waiting approval"), answer box.
- Step feedback from tab 1 ("Needs change" notes, 👍s) listed under "Your notes on steps".
- **Copy answers** button: copies plain text to the clipboard (fallback: select a textarea) in this shape, for the Consultant to save as a PF Input:

```
Prototype feedback · <Enterprise> · <PREFIX> <Module>
Q OI-25: <question>
A: <answer or "(no answer)">
Step "<scenario title>" step n (<person> <action>): Looks right | Needs change: <note>
```

  OI IDs appear in the copied text (the Consultant needs them) but not on screen outside Consultant mode.

### Consultant mode (checkbox, off by default)

Shows: Requirement ID chips (on steps, fields, buttons, rules, reports), Neome App + Delivery chips, OI ids on question cards, and a **Coverage** panel (today's "Requirements in scenarios ✓/✗" + "Transitions in scenarios ✓/✗") plus today's **Requirement trace** list with click-to-highlight and "go to" links. The trace list lives in a drawer/panel reachable from any tab in Consultant mode.

## Data changes

Steps get three new optional keys (Aditya chose "derive + optional keys", 2026-11-04). Old files without them still build.

- `label` = short text for the flow box (error if longer than 40 chars). Default when missing: the transition's `action`, else the first 4 words of `action` + "…" if cut.
- `behind` = list of short plain lines for **Behind the scenes** ("Gives it a number: TKT-0101"). When present it **replaces** the derived bullets. When missing, derived: transition rules + guards (as above) and, on a create step, fields of the main entity whose notes say they are set by the system (regex on notes like `auto|automatic|set automatically|system`; builder's call), as "<field> is filled in by Neome".
- `notify` = list of section 2 roles told by the bot at this step. Each must be a role (error otherwise). When present it replaces the derived list. Derived: transition's `notify`; otherwise none. Use it for steps with no status change (system "tells the Board", a comment that pings someone).
- **Create step** (derived, no key): a step with a `row`, no `transition`, the row's start status, actor = a role that acts on that start status (an owner), and it is the first step in the scenario that touches that row. It shows the row as a **New <entity>** form, the hotspot on **Save** ("<Person> presses Save"), and status line "New → <start status>". Builder may tighten the rule; it must stay deterministic and must not fire on later steps that only view a row.
- Update `prototype-data.md` (step keys line + an example) and `skills/build-prototype/SKILL.md` step 3.4: "add `label` when the action is long; add `behind` / `notify` on steps with no status change when the spec says what Neome does or who is told."
- **Questions not tied to a step or status** (most Module-level Open Items): tab 4 shows them under "About this whole <Module>". Tab 1 shows a question card only for a step's own `oi`.
- Model: add `label` to steps; trace tab ids become `how` (was `scen`), `try` (was `app` and `mob`; mob places get `phone: true`). `goto` handles both. Update `prototype-data.md` (step keys line) and the model test that checks tab ids.
- Model may precompute for the template (builder's call): per-scenario lanes, per-step `proposed` flag, per-role summaries. Anything precomputed stays deterministic.

## Tests

- `build-prototype.test.mjs`: update tab-id asserts; add `label` default/explicit/too-long tests; keep determinism and done-check tests green.
- Headless Chrome test (puppeteer, skipped when missing): rewrite for the new tabs. Must cover: page loads on How it works with flow map + step 1; clicking a flow box moves the step; Next walks every step of every scenario without console errors; hotspot shown on a transition step; Try it: a role can press an action, status changes, Reset restores; Phone toggle renders; Questions tab: type an answer, Copy answers text contains it; Consultant mode shows Requirement chips and every Requirement highlights somewhere; no network requests.
- `npm test` all green.

## Decisions to update

Supersedes parts of D09 (Prototype look: "two-device scenarios") and D10 (Prototype shape: tabs). Per `docs/route.md` §1, `docs/v1/` is frozen: record the new state in `.scratch/prototype-ui/map.md` Decisions-so-far ("supersedes D09/D10: tabs How it works / Try it / By role / Questions for you; swimlane flow + guided steps; Neome look kept for screens; Consultant mode holds the trace"). The next release writes it into `docs/v<N>/decisions.md`. Skill text changes (`SKILL.md`, `prototype-data.md`) need evals before merge to `main` (route §1.4).

## After build

Re-run every Deans Pond Prototype with the new engine (`node neome-studio/engine/cli.mjs build-prototype enterprises/deans-pond/engagements/hoa-mgmt <PREFIX>` for ANN, MEM, PAY, RPAY, TKT, VEN), screenshot each tab, check by eye.

## Left to the builder

Exact colours/spacing within the Neome tokens, SVG arrow routing, kind-word rule details, narrow-screen breakpoints, how to detect "filled by Neome" fields, code structure inside `proto.js`.
