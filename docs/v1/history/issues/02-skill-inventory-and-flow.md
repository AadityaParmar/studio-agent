# 02: Skill inventory and flow

Type: grilling
Status: resolved
Assignee: aditya
Blocked by: None

## Question

Which skills make up the pack, and how do they chain? For each skill, settle:
- name
- user-invoked or model-invoked
- what it reads and writes
- which skills-main skill it is cloned from, or whether it is new

Cover ingest, module discovery, the Engagement map, Module resolution (grill → spec → Prototype), questionnaire, BRD assembly, and a router.

## Answer

Plugin `neome-studio`; skills are short verbs, invoked as `/neome-studio:<skill>`. Overview for Consultants: [README-draft.md](../README-draft.md).

| Skill | Invoked | From | Reads → Writes |
|---|---|---|---|
| `studio` | user | ask-matt | Engagement map, Open Items → next-step advice (router) |
| `ingest` | user | new (wayfinder charting) | Inputs → Sources, draft Modules/Requirements/Open Items; first run creates Enterprise folder + glossary and Engagement + map; later runs close answered Open Items and reopen affected Modules ("needs revisit") |
| `review-draft` | user | new (grilling rounds) | draft → confirmed Modules (merge/split/rename), end-to-end process skeleton, roles, one Module ticket each. Runs in a fresh session |
| `resolve-module` | user | new (wayfinder work-through) | claims Module ticket → grill-module → write-module-spec → build-prototype; closes the ticket once spec + Prototype exist (Open Items may stay open); revisit = shorter pass |
| `grill-module` | model | grilling + domain-modeling | Module ticket, Sources → answers, session registered as a Source (e.g. WS-3), Open Items |
| `write-module-spec` | model | to-spec | grill output → Module spec |
| `build-prototype` | model | prototype | spec → Prototype HTML |
| `enterprise-glossary` | model | domain-modeling (no ADRs) | grilling → `enterprises/<ent>/GLOSSARY.md`; Enterprise decisions become SD Sources |
| `neome-mapping` | model | new | spec + App catalog + Delivery heuristics → indicative Neome App + Delivery |
| `questionnaire` | user | to-questionnaire | open Open Items (Engagement or Module) → questionnaire; answers return via `ingest` |
| `build-brd` | user | new | specs → BRD data file (validated) → versioned HTML; can run any time, with unresolved Modules shown as "in progress" |

Flow: ingest → review-draft → resolve-module ×N (async: questionnaire / Prototype feedback → ingest → revisit) → build-brd → sign-off.

Decisions:
- The map logic (frontier, claim, close) lives in a shared reference file. There is no wayfinder clone for Consultants to run.
- Prototype feedback comes back as an Input; it has no dedicated skill.
- Exact paths are deferred to ticket 03, questionnaire format to ticket 11, and versioning to ticket 12.

## Addendum (second session, same day)

These were confirmed by the Consultant in a parallel grilling session and do not conflict with the Answer above:
- The building blocks stay visible in the slash menu. The `studio` router only points Consultants at the six main skills.
- Sign-off is a mode of `build-brd`, not a separate skill. Detail is in ticket 12.
- The process skeleton is an Engagement-level artifact. `review-draft` sketches it, each `resolve-module` refines its Module's part, and `build-brd` stitches it into the end-to-end process.
- `grill-module` also borrows from `grill-with-docs`, which challenges answers against the Inputs.
