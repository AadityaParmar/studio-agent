# 10: Module Prototype shape

Type: prototype
Status: resolved
Blocked by: 09, 07

## Question

What does a Module Prototype show, and at what fidelity? Candidates: sheet list, form with sections, kanban by status, status-flow walkthrough with scenarios, role switcher. How is it generated from the Module spec? Prototype one Module (for example Anglo Gulf Quotation) to react to.

## Constraints from earlier tickets

- From ticket 07: the Prototype reads `spec.md`, specifically Roles (role switcher), Records and data (entity/field/type/required; choice values in notes), Statuses + transitions (kanban, walkthrough) and Requirements. Field types: text, number, money, date, choice, person, link-to-entity, file.
- From ticket 08: choice fields carry `Values: A / B / C` in the spec notes, and link fields carry `Links to: <entity>`. Use them for dropdowns and links in the mock.
- From ticket 13: Prototype is a one-way view at `engagements/<slug>/prototypes/<PREFIX>-<slug>.html`, built from `_agent/modules/<PREFIX>-<slug>/spec.md`.

## Answer

Prototype asset: [prototypes/10-module-prototype-PROTOTYPE.html](../prototypes/10-module-prototype-PROTOTYPE.html) (Anglo Gulf Quotation, variants A/B/C). Consultant picked **all three, as tabs** in one file.

**Shape: one single-file HTML per Module, three tabs, same data:**
1. **App**: Neome-style shell. Sheet list + kanban by status, record form with sections from spec §4, "View as" role switcher (spec §2), working actions per status transition (spec §5): approve / reject / revise update state in memory, approval ladder, activity log. Other Modules greyed in the sidebar. Toggle "show Requirement tags" puts Req chips on fields.
2. **Scenarios**: guided step-by-step stories. Each step = actor role + what they do + mini screen + "this step proves" (Requirement acceptance bullets) + OI callout when the step hits an open OI. Coverage list shows which Requirements no scenario touches.
3. **Mobile + trace**: phone frames per key role (list, record, approve). Requirement trace panel: click a Requirement → highlight where it shows.

Banner on every tab: PROTOTYPE, Enterprise, Module prefix, Req/OI counts, indicative Neome App + Delivery.

**Generation: fixed template + data.** `build-prototype` ships one fixed HTML template (look = [ui-reference/tokens.md](../ui-reference/tokens.md)). The agent writes a per-Module data object and injects it. No agent-written HTML. Data object:
- from spec.md: roles, records/fields (type, required, section, `Values:` → dropdown, `Links to:` → link), statuses + transitions, rules that gate transitions (e.g. discount bands), Requirements (ID, title, acceptance, priority, OIs), OI gists, Neome mapping
- each field and role carries `reqs[]`, `oi`, `proposed` → chips
- **sample records**: agent-invented, 4–8 rows spread over every status, marked sample
- **scenarios**: agent proposes from transitions + rules + exceptions; all marked proposed; a scenario on an open OI shows the callout. Saved in `_agent/modules/<PREFIX>-<slug>/prototype-data.json` (agent file, Consultant may edit via the agent); spec.md stays the source for everything else.

**Rules:**
- Fidelity: looks like Neome, behaves only in memory. No persistence, no real backend. Reset button.
- Single file, no external JS. Fonts fall back to system if offline.
- Proposed roles/fields show the dashed "proposed" chip; open OIs show orange OI chips.
- One-way view (ticket 13): written to `prototypes/<PREFIX>-<slug>.html`; rebuilt on any spec change; never read back. Feedback returns as an Input (ticket 02).
- Done check before the Module ticket closes: every Requirement appears in at least one tab (trace) and every transition in at least one scenario.

## Comments

- Agent: prototype captured at `prototypes/10-module-prototype-PROTOTYPE.html` (not a git repo, so no throwaway branch).

- Agent: look superseded by ticket 14 (Neome product look). Shape unchanged.
