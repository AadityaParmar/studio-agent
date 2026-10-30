---
name: resolve-module
description: "Claim one Module and resolve it end to end in one session: grill, Module spec, Neome mapping, Prototype, close. Revisit is a shorter pass."
disable-model-invocation: true
---

# resolve-module

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Take one Module from the frontier to `resolved` in this session: claim it, grill it, write its Module spec and Neome mapping, build its Prototype, close the ticket. Open Items may stay open; a gap is an Open Item, never a guess. A **revisit** (Module `needs-revisit`) is the same path, narrowed to what its `revisitReason` names.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. `<who>` = `git config user.name`. Git and lock: [git-protocol.md](../../reference/git-protocol.md). Frontier, claim, close, moves: [map-logic.md](../../reference/map-logic.md). Shapes of `process.md` and `general.md`: [review-shapes.md](../review-draft/references/review-shapes.md). Next session: [next-session.md](../../reference/next-session.md). The building blocks run no git; you commit what they hand back.

## 1. Scope

One Module per session: this conversation already resolved a Module → ask the Consultant to start a new session; stop.

Args: `<eng> [<PREFIX>]` (`<ent> <slug> [<PREFIX>]` also fine); ask if not given. Pull (git-protocol Start), then:

```
ENGINE module frontier <eng>
```

Show the `next` lines (revisits first) and who holds `claimed` ones. `<PREFIX>` given → that Module; else the Consultant picks one, else take the first `next`. Empty → say what blocks the Modules (`blocked`, `draft`); stop.

Ask the mode: **live** (Enterprise on the call, or the Consultant relays what they said) or **from Inputs**. Done when Module, mode and pass are fixed: pass = **revisit** when the line shows `needs-revisit` (carry its `revisitReason`), else **first pass**.

## 2. Claim

Before any other write, follow map-logic Claim:

```
ENGINE module claim <eng> <PREFIX> --who "<who>"
```

Exit 1 → tell the Consultant the message (who holds it, or what blocks it) and offer the next frontier Module; back to step 1. Exit 0 → commit the files it touched, `resolve-module: <ent>/<slug> claim <PREFIX>`, push. Rejected push and rebase conflict → map-logic Claim step 4; a refusal then means someone else claimed it first. `already claimed by you` = resumed session; carry on from the first step whose output is missing.

Done when the claim push succeeds.

## 3. Grill

Run the `grill-module` skill with `<ent>`, `<slug>`, `<PREFIX>`, the mode, and on a revisit the `revisitReason`. Keep its hand-back: TO-BE process, asks no single Module owns, Module set changes the Enterprise asked for, terms, files written.

Done when grill-module hands back with `build-brd --check` at exit 0.

## 4. Process

Refine this Module's H2 section of `process.md` (`## <PREFIX> — <Name>`) from the TO-BE hand-back, in the review-shapes table shape:

- Steps: the Module's main path end to end, plus side paths the grilling settled (approvals, rejections, revisions). Each cites its Source, or `(proposed, to confirm)` with its OI.
- Edges whose `from` or `to` is one of this Module's steps: add, relabel, cite. Closed OIs leave the `OI` cell; open ones stay.
- Revisit: only steps and edges the change touches.

New lanes, other Modules' steps, edges between other Modules → **shared edits** (step 7). Done when every step and transition the grilling settled has a row, each cited or tied to an OI.

## 5. Spec

Run the `write-module-spec` skill (`<ent>`, `<slug>`, `<PREFIX>`, revisit: `revisitReason`). It writes `spec.md` (revisit: edits it in place), runs `neome-mapping` and `ENGINE spec-check`. Keep its hand-back: Module Delivery, Open Items, files written.

Done when `ENGINE spec-check <eng> <PREFIX>` exits 0.

## 6. Prototype

Run the `build-prototype` skill (`<ent>`, `<slug>`, `<PREFIX>`). First pass writes `prototype-data.json`; revisit edits it in place. Every spec change rebuilds the page. A spec gap it hands back → fix in `spec.md` (step 5 rules), re-run `spec-check`, then build again.

Done when `<eng>/prototypes/<PREFIX>-<slug>.html` is written by the build (exit 0).

## 7. Shared edits

Collect what touches files other Modules share:

- **Asks no single Module owns** (grill hand-back) → Engagement-wide Requirement: next free `GEN-NN` under its topic in `general.md` (review-shapes block, `Proposed: yes`, cited), or `- OI-NN:` bullet with an OI row Module(s) `All` when the ask is still unclear. An `N/A` on that topic goes (a topic with a Requirement has no `N/A`).
- **Custom module** (neome-mapping hand-back) → `plan.md`: drop `<PREFIX>` from the phase `Modules` cells, add a Not yet placed row `| <Name> as a Custom module | <OIs> | <PREFIX> | (proposed, to confirm) |`. Weeks stay as they are.
- **Process-wide**: new lanes, other Modules' steps or edges (step 4).
- **Module set change** the Enterprise asked for:
  - Rename this Module: `ENGINE module rename <eng> <PREFIX> [--to <NEW>] [--name "<Name>"] --who "<who>"`; it renames the folder and the Prototype view; rebuild with `build-prototype` for the new prefix and re-run `spec-check`.
  - Merge this Module into another, or split it: `ENGINE module release <eng> <PREFIX> --who "<who>"` first, then the map-logic moves (`module merge`, `module new` + `module move`). The engine removes a merged Module's view. Merge target `resolved` → `ENGINE module revisit <eng> <TARGET> --reason "<PREFIX> merged in [<WS-n>]" --skill resolve-module`. New split parts are `draft`: next step is `/neome-studio:review-draft`. Skip step 8; go to step 9.

Nothing collected → step 8. Else take the Engagement lock with `--skill resolve-module` and push it (git-protocol Engagement lock), then write them. Lock held by someone else → tell the Consultant who; offer to wait and retry. They cannot wait → raise one Open Item per ask (owner Neomenta, Module(s) `All` or `<PREFIX>`, question `Add as Engagement-wide Requirement: <ask> [<Source>]` or `Apply: <move> [<Source>]`), and say so in the report.

Then:

```
ENGINE build-brd <eng> --check
```

Errors → fix your markdown, run again. Done at exit 0 with every collected item written or raised as an Open Item.

## 8. Close

```
ENGINE module close <eng> <PREFIX> --who "<who>"
```

It refuses unless `spec-check` passes and the Prototype exists; fix what it names (steps 5–6), run again. Open Items never block a close. Done at exit 0 (`closed: <PREFIX> resolved`).

## 9. Report and end

Tell the Consultant, short:

- Module `<PREFIX>` · status · first pass / revisit (what changed).
- Coverage per topic; Requirements added, withdrawn; the Engagement OI and its IDs.
- Neome mapping: App · Delivery · overrides.
- Prototype: `prototypes/<PREFIX>-<slug>.html` and its scenarios; send it to the Enterprise; feedback comes back as an Input through `/neome-studio:ingest`.
- Shared edits: GEN Requirements, plan, process, moves; anything left as an Open Item for want of the lock.
- Open Items still open (top 5).

Clear the lock if you took it, then End (git-protocol): `resolve-module: <ent>/<slug> <PREFIX> resolved` (revisit: `<PREFIX> revisit resolved`; merge/split: `<PREFIX> merged into <TARGET>`). Stage with `git add -A <paths>`: every file the hand-backs list (WS input, its text copy, `sources.md`, `ticket.md`, `spec.md`, `prototype-data.json`, `open-items.md`), `process.md`, `general.md`, `plan.md`, `map.md`, the Prototype view, and renamed or removed paths.

**Stopping early** (Consultant quits, a block fails): commit and push what is written, keeping the claim. Next session shows how to resume (`resolve-module <eng> <PREFIX>`, claimed by you). The Consultant hands the Module back instead → `ENGINE module release <eng> <PREFIX> --who "<who>"`, then End. Lock taken → clear it first.

## 10. Next session

Last thing of every run, after End; every stop above ends here too. Follow [next-session.md](../../reference/next-session.md): `ENGINE status <eng> --who "<who>"`, up to 3 `step` lines as `/neome-studio:<skill> <args> — <why>`. Done when the block is shown.
