---
name: build-prototype
description: "Building block for resolve-module. Write per-Module Prototype data and render the Prototype HTML via the engine."
upstream:
  - skills/engineering/prototype
upstreamVersion: 1.3.1
---

# build-prototype

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Build one Module's Prototype: a throwaway, clickable page in Neome's look that lets the Enterprise react to behaviour. You write data only, `prototype-data.json`; the engine draws the page from its fixed template and the Module spec. Sample rows and scenarios are proposals, never facts.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. Module folder = `<eng>/_agent/modules/<PREFIX>-<slug>/`. Data shape and engine rules: [prototype-data.md](references/prototype-data.md). Runs no git: the caller (`resolve-module`) commits.

## 1. Scope

From the caller: `<ent>`, `<slug>`, `<PREFIX>`.

- The ticket front-matter must say `status: claimed` and `claimedBy:` = `git config user.name`. Else stop: tell the Consultant to run `/neome-studio:resolve-module`.
- `spec.md` must pass `ENGINE spec-check <eng> <PREFIX>`. Else hand back to the caller: spec first.
- `prototype-data.json` exists (spec changed, revisit): edit it in place.

Done when Module and first build / rebuild are fixed.

## 2. Read

Read whole: `spec.md`, `prototype-data.md`, the Enterprise `GLOSSARY.md`, and the Open Items the spec names in `open-items.md`. Done when you know each transition's who and trigger, each gating rule, and which Requirement each field, role, rule, report and transition shows.

## 3. Write `prototype-data.json`

Shape in `prototype-data.md`. Work through it in this order:

1. **Transitions**: one entry per section 5 transition. `by` from the trigger text and section 2/6; a trigger with no person (validity ends, a timer) is `system`. Who presses it is unclear → the likeliest role (the scenario shows it as proposed) and say so in the hand-back.
2. **Overlay**: put every live Requirement on the elements that show it (`reqs` on fields, roles, transitions, rules, reports). Open Items that hang on an element → its `oi`.
3. **Sample rows**: 4–8, every status covered, values that fit the field types, `Values:` lists and gating rules (one row on each side of a threshold). Made-up names in the Enterprise's style, never real people or customers from the Sources.
4. **Scenarios**: from transitions, rules and exceptions (section 7). Happy path first, then one per gating rule, one per exception, one per open Open Item that changes the flow. Every transition in at least one step; every step names who, what, and what it proves. Use the glossary's words.

Done when every section 5 transition has an entry and a scenario step, and every live Requirement sits in some `reqs` or `proves`.

## 4. Build

```
ENGINE build-prototype <eng> <PREFIX>
```

Each `error` line names the gap: fix `prototype-data.json` and run again. A gap in the spec itself (no roles, a status nobody reaches) goes back to the caller as a spec fix, never patched in the data. Done at exit 0: `<eng>/prototypes/<PREFIX>-<slug>.html` written.

## 5. Hand back

To the caller, short:

- Page: `prototypes/<PREFIX>-<slug>.html`; scenarios (titles); guesses made in step 3.1.
- Files written (for the caller's commit): `prototype-data.json`, the page.
- Tell the Consultant: the Prototype is a view, rebuilt on every spec change; Enterprise feedback on it comes back as an Input through `ingest` (Source type `PF`).
