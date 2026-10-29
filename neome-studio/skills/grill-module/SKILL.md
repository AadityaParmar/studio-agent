---
name: grill-module
description: "Building block for resolve-module. Grill one Module, live or from Inputs, against the question bank until every topic is answered, N/A or an Open Item."
upstream:
  - skills/productivity/grilling
  - skills/engineering/domain-modeling
  - skills/engineering/grill-with-docs
upstreamVersion: 1.3.1
---

# grill-module

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Grill one Module until every one of the 11 topics in the [question bank](references/question-bank.md) is **answered** with a Source, **N/A** with a reason, or an **Open Item**. Find facts in the Sources yourself; put decisions to the Enterprise. Every fact cites a Source or is `(proposed, to confirm)`; never fill a gap with a guess.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. Shapes: [grill-shapes.md](references/grill-shapes.md). Runs no git: the caller (`resolve-module`) commits. `enterprise-glossary` commits only `GLOSSARY.md`, as its skill says.

## 1. Scope

From the caller: `<ent>`, `<slug>`, `<PREFIX>`, mode, and on a revisit the `revisitReason`.

- **Mode live**: the Enterprise is on the call, or the Consultant relays what they said. **Mode from Inputs**: nobody from the Enterprise; Sources answer, the rest become Open Items.
- The ticket front-matter must say `status: claimed` and `claimedBy:` = `git config user.name`. Else stop: tell the Consultant to run `/neome-studio:resolve-module`, which claims first.
- Revisit: only topics the `revisitReason` touches; the rest stays as written.

Done when mode, Module and topic list are fixed.

## 2. Read and pre-answer

Read whole: the Module's `spec.md` (else `ticket.md`), `map.md` and the other Modules' `## 1` and `## 3` (hand-offs; their `spec.md`, else `ticket.md`), `open-items.md`, this Module's section of `process.md`, the Enterprise `GLOSSARY.md`, and the text copy (`enterprises/<ent>/_agent/sources/<ID>.md`) of every Source whose register row lists `<slug>`. Read the catalog App section(s) the bank points at.

Sort each topic into a tier:

1. **From Inputs**: state it, cite it. Ask only if Sources conflict, are thin, or it is an always-ask fact (then it is the suggested answer).
2. **From the catalog**: offer it as the suggested answer, `(proposed, to confirm)`.
3. **Always ask** (bank `Always ask:` lines): goals and KPIs, roles and headcount, approval thresholds and approvers, final status list, volumes, system of record, integration ownership, priority. Never settled by the catalog or the Consultant's view; an Enterprise statement in an Input counts (cite it), and live you still confirm it.

Show the Consultant a coverage table: topic · tier · what you already have [Sources] · what you will ask. Done when every topic on the list has a tier and every Source conflict is listed.

## 3. Rounds

Live mode: start the session log file now (grill-shapes, Session log) and add one bullet per Enterprise answer as it comes.

Ask in rounds of up to 5 items in the round-item shape, each with a suggested answer worded so "yes" accepts it. Ask what you can now; questions that hang on an answer still open wait for a later round. Order follows the talk, process early. Topic 11 is always last (step 4).

Record each answer:

- **Enterprise said it** (on the call or relayed with who said it): fact citing the session log; log bullet with the speaker's name.
- **Consultant's own view**: `(proposed, to confirm)` + an Open Item asking the Enterprise.
- **Nobody knows / "Don't know"**: Open Item from the item, unchanged (question, `For:` → ask to, suggested).
- **Challenge**: check every answer against the Sources and earlier answers. Clash → quote both with their Sources and ask which holds; still unclear → Open Item quoting both.
- **Answers an open Open Item** → close it with the session log as answer Source.
- **New Enterprise term** (record, role, status, rule name in their words) → note term, definition, Source.
- **Ask no single Module owns** (access, permissions, migration, training, support, hosting) or a hand-off change for another Module → note it for the hand-back; do not write it.

From-Inputs mode: same rounds to the Consultant, who answers only from Sources or relays the Enterprise; anything else becomes an Open Item with your suggested answer.

Done when every topic on the list is answered, N/A with a Source for the reason, or an Open Item; every always-ask fact is answered by the Enterprise or an Open Item; every Source conflict is settled or an Open Item.

## 4. Bulk confirm

Topic 11, one step for the whole Module (grill-shapes, Bulk confirm): draft every live Requirement with acceptance criteria, MoSCoW and Scope tag from steps 2–3, show one table, take "yes to all" or edits by ID. Never ask Requirement by Requirement. Mode from Inputs → nothing is confirmed.

Done when each live Requirement is confirmed by the Enterprise or listed in the one Engagement Open Item.

## 5. Write

1. **Session log**: live mode with any Enterprise answer → register the WS Source (grill-shapes). Use its ID in every citation below.
2. **Module**: every answered topic into its section (grill-shapes, Where answers land); Requirements per Bulk confirm; `## 13 Open Items` lists every open OI of this Module.
3. **Open Items**: new rows, closed rows, the Engagement OI (grill-shapes, Open Items).
4. **Glossary**: hand the new terms with definition, Source and `<slug>` to the `enterprise-glossary` skill (Add terms).

Then:

```
ENGINE build-brd <eng> --check
```

Errors → fix your markdown, run again. Done at exit 0. Completeness warnings for this Module about `spec.md` or Neome mapping are expected (later steps write them).

## 6. Hand back

To the caller, short:

- Coverage: per topic answered [Sources] / N/A / OI-NN.
- TO-BE process for this Module's section of `process.md`: steps, lanes, edges, hand-offs (with Sources / OIs).
- Asks no single Module owns, with Sources (for an Engagement-wide Requirement under the Engagement lock).
- Open Items raised, closed; the Engagement OI and its IDs.
- Terms added or disputed.
- Files written (for the caller's commit): the WS input and its text copy, `enterprises/<ent>/_agent/sources.md`, the Module file, `open-items.md`.
