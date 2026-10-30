# Next session

Shared by the six user skills. The last thing every run does, after End (git-protocol), and also when it stops early (nothing to do, empty work list, refused claim, failed pull or push, Consultant quits). Building blocks never do it; their parent does.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<who>` = `git config user.name`. `<eng>` = `enterprises/<ent>/engagements/<slug>`.

## Run

```
ENGINE status <eng> --who "<who>"
```

No Engagement yet (ingest stopped before `init-engagement`, or none named) → `ENGINE status --who "<who>"` (whole repo).

Read only these lines (`|`-separated, 4 cells on a `step` line):

- `step | <skill> | <args> | <why>`, most urgent first. `<args>` = Engagement path, + Module prefix for `resolve-module`; empty → no args.
- `lock | <holder> | …` without `yours` = held by someone else.
- `done | v<N> signed off; …`.

## Print

The first 3 `step` lines, in order, exactly:

```
Next session:
1. /neome-studio:<skill> <args> — <why>
2. …
```

- Empty `<args>` → `1. /neome-studio:ingest — <why>`.
- Lock held by someone else → append ` (waits for <holder>'s lock)` to `ingest`, `review-draft`, `build-brd` lines.
- Pull or push failed this run → first line `Next session (from local copy):`.
- No `step` line and a `done` line → `Nothing next: BRD v<N> signed off.` With `step` lines too → print them, then `BRD v<N> signed off.`
- `status` itself fails (exit not 0, e.g. `node_modules` missing) → `Next session: fix the above, then /neome-studio:studio`.

Copy `<args>` and `<why>` as printed; never invent a step. Done when the block is shown.
