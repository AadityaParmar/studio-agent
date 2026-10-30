# Neome Requirements Studio (`neome-studio`)

> **Draft.** This records the decision in [02: Skill inventory and flow](issues/02-skill-inventory-and-flow.md). Folder paths are settled in [03: Enterprise and Engagement folder layout](issues/03-enterprise-and-engagement-folder-layout.md). Formats are pending tickets 05–12.

A Claude Code plugin for Neome Consultants and ADG. It takes an Enterprise's raw Inputs and turns them into a Neome-mapped **BRD**, by way of Modules, grilling, specs and Prototypes. The BRD data file is the handoff to phase 2 (the Neome build).

Terms (Enterprise, Engagement, Module, Requirement, Open Item, Source, Neome App, Delivery, BRD, Prototype) are used as defined in [GLOSSARY.md](../../../GLOSSARY.md).

---

## Who does what

| Role | Does |
|---|---|
| **Consultant / ADG** | Runs every skill in a Claude Code session and talks to the Enterprise |
| **Enterprise** | Hands over Inputs and answers questions, live or by questionnaire. Never runs the skills. |
| **Phase-2 developer** | Builds on Neome from the signed-off BRD data file |

---

## The cycle at a glance

```
 Inputs ─▶ ingest ─▶ review-draft ─▶ resolve-module ×N ─▶ build-brd ─▶ sign-off ─▶ phase 2
              ▲                           │    ▲
              │                           ▼    │ (Module reopened)
              └──── ingest ◀── Enterprise answers ◀── questionnaire / Prototype feedback

 /neome-studio:studio  ← ask at any point: "what's next?"
```

1. **Start:** `ingest` the first Inputs.
2. **Confirm the draft:** `review-draft`.
3. **Work the Modules:** `resolve-module`, one Module per session.
4. **Chase answers:** `questionnaire` goes out, and the answers come back through `ingest`.
5. **Publish:** `build-brd`, as often as you like, until it's signed off.

---

## Skills you run (user-invoked)

### `/neome-studio:studio` (router)
- **When:** whenever you're unsure what to do next, or when you return to an Engagement.
- **Does:** reads the Engagement map. Reports the next Modules to take, open Open Items, Modules needing a revisit, and whether the BRD is ready.
- **Writes:** nothing.

### `/neome-studio:ingest`
- **When:**
  - at the start of an Engagement
  - whenever a new Input arrives: deck, RFP, call notes, transcript, WhatsApp export, spreadsheet, questionnaire answers, Prototype feedback
- **First run on a new Enterprise:** creates `enterprises/<ent>/` and its GLOSSARY.
- **First run on a new Engagement:** creates `engagements/<slug>/` and the Engagement map.
- **Every run:**
  - registers each Input as a **Source** with an ID
  - drafts or updates Modules, Requirements and Open Items
  - closes any Open Items the new Input answers, and reopens the affected Modules as "needs revisit"
- **Rule:** nothing gets assumed. Gaps become Open Items, and agent proposals are marked "proposed by Neomenta, to confirm".

### `/neome-studio:review-draft`
- **When:** once, after the first `ingest`, in a **fresh session**. Run it again if a later `ingest` adds new Modules.
- **Does:** walks the Consultant through the draft as a quiz:
  - confirm, merge, split or rename Modules
  - sketch the end-to-end process skeleton
  - list the roles
- **Writes:** confirmed Modules, plus **one Module ticket each** on the Engagement map.

### `/neome-studio:resolve-module`
- **When:** once per Module, **one Module per session**. Run it live with the Enterprise if you can.
- **Does:** claims the Module ticket, then runs three steps in order:
  1. `grill-module` asks the Module's questions, and the session is registered as a Source (for example WS-3).
  2. `write-module-spec` writes the Module spec: Requirements, acceptance criteria, MoSCoW, scope tags, Sources, Open Items, and an indicative Neome App + Delivery.
  3. `build-prototype` builds a single-file HTML Prototype in Neome's look.
- **Also:** refines this Module's part of the Engagement's process skeleton. Enterprise decisions made in the session are registered as Sources (for example SD-n), never as ADRs.
- **Closes** the ticket once the spec and Prototype exist. Open Items can stay open.
- **Revisit:** if `ingest` reopened the Module, this does a shorter pass covering only what changed.

### `/neome-studio:questionnaire`
- **When:** the Enterprise can't answer live, or Open Items are piling up.
- **Does:** exports open Open Items, for the whole Engagement or one Module, as a questionnaire for the Enterprise.
- **Answers:** come back as an Input, so run `ingest` on them.

### `/neome-studio:build-brd`
- **When:** any time a review copy is wanted, and finally for sign-off. It works before every Module is resolved; unresolved Modules show as "in progress".
- **Does:** compiles the Module specs into the **BRD data file**, validates it, and renders a versioned HTML BRD that prints to A4 and carries a change log and the Enterprise glossary.
- **Writes:** the data file (the phase-2 contract) and the HTML version.
- **Final mode:** sign-off is a mode of `build-brd`, not a separate skill. How it works is pending ticket 12.
- **Process:** stitches the Engagement's process skeleton, refined Module by Module, into the end-to-end process.

---

## Building blocks (model-invoked, used automatically)

You can also run these on their own, for example to regenerate a Prototype after editing a spec.

| Skill | Called by | Does |
|---|---|---|
| `grill-module` | resolve-module | Grills one Module, live or from Inputs |
| `write-module-spec` | resolve-module | Writes the Module spec |
| `build-prototype` | resolve-module | Builds the Module Prototype HTML |
| `enterprise-glossary` | any grilling | Keeps `enterprises/<ent>/GLOSSARY.md` in the Enterprise's own language |
| `neome-mapping` | write-module-spec | Proposes an indicative Neome App + Delivery (Standard / Configuration / Custom module) from the public catalog |

These blocks appear in the slash menu too. The `studio` router only points Consultants at the six main skills.

---

## Where each skill comes from

Each skill is copied from `skills-main/` and adapted. Upstream is never edited in place.

| Skill | Cloned from |
|---|---|
| `studio` | `ask-matt` |
| `ingest` | new (modelled on wayfinder charting) |
| `review-draft` | new (uses grilling rounds) |
| `resolve-module` | new (modelled on wayfinder's work-through mode) |
| `grill-module` | `grilling` + `domain-modeling` + `grill-with-docs` |
| `write-module-spec` | `to-spec` |
| `build-prototype` | `prototype` |
| `questionnaire` | `to-questionnaire` |
| `build-brd` | new |
| `enterprise-glossary` | `domain-modeling` (glossary only, no ADRs) |
| `neome-mapping` | new, backed by `research/neome-app-catalog.md` |

The map logic (frontier, claim, close) lives in a shared reference file. There is no wayfinder clone for Consultants to run.

Pins: each cloned skill's SKILL.md front-matter has `upstream` + `upstreamVersion` (ticket 20). Maintainer runs `upstream-check` to pull upstream changes.

---

## Typical Engagement, end to end

| Step | Session | Run | Output |
|---|---|---|---|
| 1 | Kick-off: Inputs received | `ingest` | Sources, draft Modules / Requirements / Open Items, Engagement map |
| 2 | Next session | `review-draft` | Confirmed Modules, process skeleton, roles, Module tickets |
| 3 | One per Module (live call, ideally) | `resolve-module` | Module spec, Prototype, new Open Items |
| 4 | When answers stall | `questionnaire` | Questionnaire sent to the Enterprise |
| 5 | Answers or feedback arrive | `ingest` | Open Items closed, Modules reopened |
| 6 | Each reopened Module | `resolve-module` | Updated spec and Prototype |
| 7 | Review checkpoint | `build-brd` | BRD draft vN for Enterprise review |
| 8 | All Modules resolved, Open Items closed | `build-brd` | Signed-off BRD, data file to phase 2 |

Repeat steps 3–7 until the BRD is signed off. A later Engagement for the same Enterprise starts again at step 1 and reuses the Enterprise folder and glossary.

---

## Where things live

Settled in [03: Enterprise and Engagement folder layout](issues/03-enterprise-and-engagement-folder-layout.md) and [13: Facade layout](issues/13-facade-layout-human-vs-agent-files.md). You only touch the drop folders and read the views. Never edit `_agent/`: skills own it.

```
neome-studio/                    plugin (skills)
enterprises/<ent>/
  inputs/                        drop Inputs here (any name; ingest adds the Source ID)
  confidential/                  gitignored: drop confidential files here
  _agent/                        skills only: glossary, Source register, text copies
  engagements/<slug>/
    brd/                         BRD: preview.html + v<N>.html
    prototypes/                  one Prototype per Module
    questionnaires/              questionnaires to send (.html, .txt)
    _agent/                      skills only: map, process, Open Items, Module specs, BRD data
```

---

## Rules of thumb

- One Module per session. Use `studio` to pick up where you left off.
- Never fill a gap with an assumption: make it an Open Item.
- Every Requirement cites a Source.
- Neome App + Delivery is indicative only. The low-level build mapping happens in phase 2.
- Out of scope here: pricing, RFP-response proposals, and Neome build configuration.
