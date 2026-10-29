---
name: studio
description: "Router. Checks setup, then shows where an Engagement stands and what to run next: next Modules, revisits, Open Items, BRD readiness, claims and locks. Writes nothing, except clearing a stale lock after asking."
disable-model-invocation: true
upstream:
  - skills/engineering/ask-matt
upstreamVersion: 1.3.1
upstreamDiverged: "Routes the 6 Neome Studio user skills from engine state (setup-check, status); shares no text with ask-matt's skill map."
---

# studio

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Tell the Consultant where things stand and the next step. Read-only: the engine reads the files; you relay. The one write is clearing a stale lock or claim, after the Consultant says yes (step 5).

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. `<who>` = `git config user.name`. Git and lock: [git-protocol.md](../../reference/git-protocol.md). Frontier and claims: [map-logic.md](../../reference/map-logic.md).

**Skills you point at** (the only six; building blocks run inside `resolve-module`):

| Skill | When |
|---|---|
| `/neome-studio:studio` | Unsure what next. |
| `/neome-studio:ingest` | New Inputs (incl. Questionnaire replies, Prototype feedback, signed copy). First run creates the Enterprise and Engagement. |
| `/neome-studio:review-draft` | Draft Modules to confirm. Fresh session. |
| `/neome-studio:resolve-module` | Next Module or a revisit. One Module per session. |
| `/neome-studio:questionnaire` | Enterprise Open Items not asked yet, or to chase. |
| `/neome-studio:build-brd` | Preview any time; release a BRD version; Sign-off. |

Before saying more about a skill than this table, read its `SKILL.md`.

## 1. Setup

```
ENGINE setup-check
```

One line per check. Each `miss` → tell the Consultant what is wrong and the fix the line names, in plain words. `node` itself not found → "Install Node LTS, then `npm ci` in the repo root."

- `node_modules` miss → the status step needs it: tell them to run `npm ci`, then `/neome-studio:studio` again; stop.
- `git` miss → carry on; say the state shown is the local copy and skills cannot pull or push until it is fixed.
- `plugin` miss → this skill is running, so the plugin is loaded now; the settings file drifted. Relay the fix so it stays loaded.

Done when every `miss` line is explained, or you stopped on `node_modules`.

## 2. Pull

Setup `git` ok → `git pull --rebase --autostash` (git-protocol Start). It fails → relay the git message in one line and carry on with the local copy; say it may be out of date.

Done when pulled, or the failure relayed.

## 3. Where things stand

```
ENGINE status --who "<who>"
```

One `engagement` line each; `enterprise` lines = Inputs waiting for `ingest`. Several Engagements → the one the Consultant named, else ask. None → go to step 4 with its `step` line. Then:

```
ENGINE status <eng> --who "<who>"
```

Show, short, grouped:

- **Lock**: `lock | none`, or who, skill, since, age (`yours` = held by this Consultant).
- **Modules**: `next` (revisits first, with their reason), `claimed` (who, since, age), `blocked` (by what), `draft`, `resolved`. `gap` = resolved Module without its Prototype view: views rebuild from `_agent/`; the next `/neome-studio:resolve-module` pass of that Module rebuilds it; needed sooner → the maintainer.
- **Inputs waiting**: `input` lines.
- **Open Items**: open count by owner; `not asked`; `chased` (asked, no answer: the note says why); `waiting` (asked, reply not back). `hold` = a reply answer kept for the Module's holder: name the holder.
- **BRD readiness**: released versions and status. `release | ready` (changes since last version, warnings) or `release | blocked` with its errors (what each means and which skill fixes it: [problems.md](../build-brd/references/problems.md)). Sign-off preconditions: `signoff | v<N>` (latest released, unsigned) and `signoff | next` (if released now), blockers summed up by kind: Modules not resolved, topics not covered, Must Requirements with TBC priority or Open scope.

Done when every line kind the engine printed is in the summary.

## 4. Next step

Relay the `step` lines, most urgent first; one line each: `/neome-studio:<skill>` and why. Name the Module for `resolve-module`. Lock held by someone else → `ingest`, `review-draft` and `build-brd` wait for it (or step 5); `resolve-module` and `questionnaire` can run.

Done when the Consultant has a next step, or a question to settle first.

## 5. Stale lock or claim

The only write. Offer it when a `lock` line shows one, or a `claimed` Module looks abandoned, and either it is `yours` with no session of yours still running it, or the Consultant says the holder is done or their session crashed. Age is a hint: a lock lasts one skill run (minutes), so hours old usually means a crash; a claim lasts a whole `resolve-module` session and a stopped session keeps its claim on purpose.

Ask: "Lock of <holder> (<skill>, since <since>) looks stale. Clear it? Their unpushed work stays on their machine." Claim: "Release <holder>'s claim on <P>? It goes back to the frontier." Act only on a clear yes.

1. Pull (git-protocol Start); it fails → stop, relay.
2. Lock: `ENGINE unlock <eng> --who "<who>" --force`. Claim: `ENGINE module release <eng> <P> --who "<who>" --force`.
3. End (git-protocol), staging only what changed: lock → `<eng>/_agent/map.md`, message `studio: <ent>/<slug> clear stale lock of <holder> (<skill>)`; claim → `map.md`, the Module's `ticket.md` and `spec.md` if it has one, message `studio: <ent>/<slug> release stale claim of <holder> on <P>`.
4. Run `ENGINE status <eng> --who "<who>"` again; show the lock or claim gone. Tell the Consultant to let the holder know: pull before any skill.

Done when the push succeeded and status shows it cleared, or the Consultant said no (nothing written).
