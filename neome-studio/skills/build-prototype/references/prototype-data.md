# prototype-data.json

Agent file at `<eng>/_agent/modules/<PREFIX>-<slug>/prototype-data.json`. Holds only what the Module spec does not: sample rows, scenarios, and the Prototype overlay (who presses which button, which Requirement shows where). Everything else (roles, records and fields, statuses, transitions, rules, reports, Requirements, Open Items, Neome mapping) the engine reads from `spec.md`. Names below must match the spec exactly; the engine refuses any it cannot find.

Filled example: `neome-studio/engine/test/fixtures/build-prototype/after-prototype/harbor-tiles/engagements/crm/_agent/modules/QUO-quotations/prototype-data.json` (Harbor Tiles QUO, made up).

## Keys

Only these 8 keys. `reqs` = live Requirement IDs of this Module; `oi` = one open `OI-NN` (orange chip).

| key | shape | rules |
|---|---|---|
| `entity` | `"Quotation"` | Main record (sheet, kanban, drawer) = a section 4 entity. Optional; default = first entity. Other entities show as tables inside the record. |
| `roles` | `[{role, person, reqs, oi}]` | `role` = section 2 role. `person` = a made-up first name for the role switcher ("Arjun (Sales exec)"). Roles left out still show, named by role. |
| `fields` | `[{entity, name, reqs, oi}]` | Only fields that carry a Requirement or Open Item. |
| `transitions` | `[{from, to, action, by, notify, reqs, rules, guard, oi}]` | **One per section 5 transition, every one.** `action` = button label ("Submit for approval"). `by` = section 2 role(s) who press it, or `["system"]` (timer, other system). `notify` optional: role(s) the bot tells; default = who acts next (end status: who started), never the one who acted. `rules` = section 6 rule names that gate it (shown on the record). `guard` optional = `[{field, op, value}]`, all must hold, `op` one of `< <= > >= = !=`, field of the main entity; the button is disabled when it fails. |
| `rules` | `[{rule, reqs}]` | Section 6 rules that carry a Requirement (Rules master-data screen). |
| `reports` | `[{name, reqs}]` | Section 8 reports that carry a Requirement (blue report tile). |
| `rows` | `[{id, status, values, children, log}]` | **4–8 sample rows, at least one in every status** (more statuses than 8 → one per status). `id` unique ("Q-1041"). `values` = main-entity field name → value (numbers as numbers). `children` = `{"<other entity>": [{field: value}]}`. `log` optional = `[[when, who, what]]` for the ACTIVITY tab. All made up; the page marks each row sample. |
| `scenarios` | `[{title, summary, steps}]` | See below. All shown as proposed. |

Step: `{actor, action, row, transition, screen, report, proves, oi}`.

- `actor` = role or `"system"`; `action` = one line, what they do, in the Enterprise's words.
- `transition` optional = `{from, to}`; needs `row`. The engine replays each scenario from the sample rows: the row must be in `from` at that step, `actor` must be in the transition's `by`, guards must hold.
- `screen` = `record` (default with a row) · `sheet` (default without) · `kanban` · `chat` (approve from bot chat, marked guessed) · `report` (+ `report` = section 8 name) · `rules`.
- `proves` = Requirement IDs the step shows; the page lists their acceptance criteria. `[]` is fine on a step that only shows an Open Item.
- `oi` = an open Open Item the step hits; the page shows the question as a callout.

## Done check (engine)

`build-prototype` writes the page only when both hold:

- every live Requirement of the Module shows in at least one tab: in some `reqs` (role, field, transition, rule, report) or some step's `proves`;
- every section 5 transition is in at least one scenario step.

Other errors: unknown names, wrong row counts, a status with no sample row, a scenario that does not replay. A closed `oi` is a warning (no chip).
