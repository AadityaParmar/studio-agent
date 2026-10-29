---
name: review-draft
description: "Quiz the Consultant on the ingest draft: confirm, merge, split or rename Modules; process skeleton; roles; Engagement-wide topics; one Module ticket each; plan skeleton. Re-run after a later ingest adds Modules. Run in a fresh session."
disable-model-invocation: true
---

# review-draft

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Turn the `ingest` draft into a confirmed Module set the team can work from: one confirmed ticket per Module, a process skeleton with roles, every Engagement-wide topic covered, and a plan skeleton. The Consultant decides; you propose. Every fact cites a Source or is `(proposed, to confirm)`; every unknown becomes an Open Item.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. Git and lock: [git-protocol.md](../../reference/git-protocol.md). Ticket fields and moves: [map-logic.md](../../reference/map-logic.md). File shapes: [review-shapes.md](references/review-shapes.md).

## 1. Scope

This conversation already ran `ingest` → ask the Consultant to start a new session and run `/neome-studio:review-draft` there; stop.

Need `<ent>` and `<slug>`; ask if not given. Run `ENGINE module list <eng>` and read `_agent/general.md`, `process.md`, `plan.md`. The **work list**:

- Modules shown `draft` (first run: all; re-run: only those a later `ingest` added).
- Topics in `general.md` not yet covered (no GEN Requirement, no `N/A`, no `- OI-NN` bullet).
- Process sections and plan placement missing for any draft Module (or no `process.md` tables / no `plan.md` yet).

Empty work list → tell the Consultant the draft is already reviewed; suggest `/neome-studio:resolve-module`; stop. Done when the work list is fixed.

## 2. Start

Pull, then take the Engagement lock with `--skill review-draft` and push it (git-protocol). Done when the lock push succeeds.

## 3. Read

Read whole: `map.md`, every ticket on the work list, `open-items.md`, `general.md`, `process.md`, `plan.md` (if any), the Enterprise `GLOSSARY.md`, and the text copy (`_agent/sources/<ID>.md`) of every Source whose register row lists `<slug>`. Re-run: also skim confirmed tickets, so new Modules fit beside them. Done when you can say, per draft Module, what it covers and which Sources back it.

## 4. Quiz

Grilling rounds: up to 5 numbered items per round, each with your **suggested answer**, so the Consultant mostly says yes or edits. One round per group, in this order; skip a group with nothing on the work list.

1. **Module set.** Per draft Module: confirm, rename (prefix and/or name, in the Enterprise's words), merge into another, or split into parts. Say why you suggest it, citing Sources. Also ask if a Module is missing.
2. **Process and roles.** Lanes (roles, systems, other parties), each Module's main steps in order, hand-offs between Modules. Roles per Module with what they do; headcount only if a Source has it.
3. **Order.** Per Module, which Modules must be resolved first (`blockedBy`); suggest from the process order.
4. **Engagement-wide topics**, once, each uncovered one: Access (users, roles, permission matrix) · Localisation (currencies, languages) · Hosting (hosting, data residency, SSO) · Migration · Training · Support · Other (anything else no single Module owns). Pre-answer from Sources with the citation; ask only what they leave open.
5. **Plan.** Show the plan skeleton (review-shapes) with Modules placed and Not yet placed items; ask only for corrections. Never ask for or suggest week numbers.

How to record each answer:

- Consultant relays what the Enterprise said → fact; note speaker, role, when said, for the session log.
- Consultant's own view → `(proposed, to confirm)` + an Open Item (owner Enterprise).
- Nobody knows → Open Item; suggested answer only if you can defend it. Engagement-wide topic OIs: Module(s) `All`.
- Answer clashes with a Source → say so, quote both; still unclear → Open Item.

Done when every work-list Module has a decision, every lane, role and step is agreed, proposed or tied to an Open Item, every uncovered topic has an answer or an Open Item, and the Consultant has seen the plan.

## 5. Write

In this order:

1. **Session log.** Any relayed answer → write and register the WS Source (review-shapes). Use its ID in citations below.
2. **Module set**, with the engine (it edits tickets, folders, map rows, change log and prefix references in `open-items.md`, `process.md`, `plan.md`, other tickets):
   - Rename: `ENGINE module rename <eng> <PREFIX> [--to <NEW>] [--name "<Name>"]`. Requirement IDs keep the old prefix; `formerly` is recorded.
   - Merge: `ENGINE module merge <eng> <FROM> --into <TO>`. Old folder kept, `merged-into <TO>`; live Requirements copied to TO with new IDs, old ones withdrawn. It prints `fold in by hand` sections: merge those into TO's ticket yourself (cited lines move as they are).
   - Split: `ENGINE module new <eng> <PREFIX> --name "<Name>" --after <PREFIX>` per new part; `ENGINE module move <eng> <REQ-ID>... --to <PREFIX>` per part; then `module merge` the old Module into its main part (old folder kept, `merged-into`). Move other sections by hand.
   - Missing Module: `module new`, then draft its ticket sections from Sources (draft-shapes Module ticket).
   - Confirm each kept Module last: `ENGINE module confirm <eng> <PREFIX> [--blocked-by "A, B"]`.
   Exit 1 → read the message, fix the cause, run again.
3. **Roles** into each Module's `## 2 Roles`; **process skeleton** into `process.md` (review-shapes). Re-run: add sections for new Modules only.
4. **Topics** into `general.md`; new Open Items into `open-items.md` (next free `OI-NN`, named where they bite).
5. **Plan** into `plan.md` (review-shapes). Re-run: place new Modules only.
6. **Glossary.** A new Enterprise word from the quiz (renamed Module, role, record) → hand it with its Source to the `enterprise-glossary` skill.

Done when `ENGINE module list <eng>` shows no `draft` and every write above is made.

## 6. Check

```
ENGINE build-brd <eng> --check
```

Errors → fix your markdown, run again. Done at exit 0. Completeness warnings for open Modules (spec, mapping) are expected.

## 7. Report and end

Tell the Consultant, short:

- Modules: prefix · name · blockedBy; merged / renamed / split ones with what happened.
- Process: lanes, steps count. Topics: each covered by Requirement, N/A or OI.
- Plan: Modules per phase; Not yet placed. Weeks are theirs to set.
- New Open Items (top 5 questions).
- Next: `/neome-studio:resolve-module` (first frontier Module), or `/neome-studio:questionnaire` for the `All` Open Items.

Add map change-log line `- YYYY-MM-DD: review-draft: <n> Modules confirmed, process skeleton, topics, plan skeleton.` Clear the lock, then End (git-protocol): `review-draft: <ent>/<slug> <n> Modules confirmed`. Stage with `git add -A <paths>` so renamed folders' old paths go too: the WS input, its text copy, the Source register, and every `_agent/` file written.
