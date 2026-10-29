# Git protocol and Engagement lock

Shared by every user-invoked skill (`ingest`, `review-draft`, `resolve-module`, `questionnaire`, `build-brd`; `studio` reads, and writes only to clear a stale lock or claim after the Consultant says yes: its step 5). Building blocks run no git, except `enterprise-glossary` (see [Glossary writes](#glossary-writes)). The Consultant never types git.

`ENGINE` = `node neome-studio/engine/cli.mjs`, run from the repo root. `<who>` = `git config user.name`.

## Start

1. `git pull --rebase --autostash`.
2. Pull fails (conflict, no network, no remote, auth) → **stop**. Tell the Consultant the git message in one line and what to do (fix network, resolve the conflict, ask the maintainer). Write nothing.

## End

1. Stage only the files the skill wrote: `git add <paths>`. Paths are under `enterprises/<ent>/` (`inputs/`, `_agent/`, `engagements/<slug>/`). `confidential/` is gitignored; never `git add -f` it.
2. `git commit -m "<skill>: <ent>/<slug> <what>"`. `<what>` = short, lowercase, e.g. `ingest: harbor-tiles/crm first run, 4 Sources, 3 Modules`.
3. `git push`.
4. Push rejected → `git pull --rebase --autostash`, then `git push` once more. Still failing, or the rebase conflicts → **stop**: `git rebase --abort` if mid-rebase, leave the local commit in place, tell the Consultant what failed and that their work is committed locally.

Never `--force`, `--force-with-lease`, `reset --hard`, or delete someone else's commits.

One exception, own unpushed commit only: a `resolve-module` claim push that hits a rebase conflict undoes its claim commit with `git reset --mixed HEAD~1` (steps in [map-logic.md](map-logic.md), Claim).

## Engagement lock

Taken by `ingest`, `review-draft`, `build-brd`, and by `resolve-module` only for GEN / process-wide edits. One line under the `# Map:` title of `engagements/<slug>/_agent/map.md`:

```
lock: <who> · <skill> · <since, UTC YYYY-MM-DDTHH:MMZ>
```

Write and clear it only with the engine (same format every time; `studio` reads it):

- Take: `ENGINE lock enterprises/<ent>/engagements/<slug> --who "<who>" --skill <skill>`. Exit 1 = held by someone else → **stop**, tell the Consultant who holds it, skill and since; suggest waiting or `studio` (clears a stale lock after asking).
- Clear: `ENGINE unlock enterprises/<ent>/engagements/<slug> --who "<who>"`. Only `studio` passes `--force`, after the Consultant says yes.

Order:

1. Start (pull).
2. Take the lock; commit only `map.md`: `<skill>: <ent>/<slug> lock`; push. Push rejected → pull, take the lock again (the engine refuses if a colleague got there first), push. This push comes **before** any other write.
3. Do the work.
4. Clear the lock. End (one commit with the work + the cleared lock).
5. Skill stops early (error, Consultant quits) → clear the lock, commit what is safe, push. Leaving a lock is the last resort; say so to the Consultant.

New Engagement: `init-engagement` creates `map.md` first, then take the lock and push it with the new folders before drafting.

## Glossary writes

`enterprises/<ent>/_agent/GLOSSARY.md` is shared by every Engagement of the Enterprise, so it takes no Engagement lock:

1. `git pull --rebase --autostash` right before writing.
2. Write the terms.
3. `git add` only `GLOSSARY.md`; `git commit -m "enterprise-glossary: <ent>/<slug> <what>"`; `git push`. Rejected → same as End step 4.
