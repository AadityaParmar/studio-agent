# Map logic: frontier, claim, close

One Engagement map per Engagement: `engagements/<slug>/_agent/map.md` (index) + one ticket per Module: `_agent/modules/<PREFIX>-<slug>/ticket.md`. Ticket front-matter is the truth; the map's `## Modules` table mirrors it. Git steps: [git-protocol.md](git-protocol.md).

## Ticket front-matter

```yaml
---
status: open            # open | claimed | resolved | needs-revisit | merged-into <PREFIX>
prefix: QUO
name: Quotes            # Enterprise language
draft: true             # set by ingest; review-draft removes it on confirm
blockedBy: [LEAD]       # prefixes that must be resolved first
revisitReason:
formerly:               # old prefix after a rename
claimedBy:              # <who> while claimed; kept after close as history
---
```

Map `## Modules` table: `| Prefix | Module | Status |`, one row per ticket, Status = ticket `status` (`draft` while `draft: true`). Row order = BRD order. Add a line to `## Change log` (`- YYYY-MM-DD: <what>`) for every status change.

## Frontier

Modules ready to take, in map order:

- `draft` absent or false (confirmed by `review-draft`), and
- `status: open` or `needs-revisit`, and
- every `blockedBy` prefix is `resolved` or `merged-into` a resolved Module.

`needs-revisit` first (shorter pass), then `open`. `claimed` = someone is on it; show `claimedBy`. Empty frontier with Modules still open = blocked; show what blocks them. `ENGINE module frontier <eng>` prints it: `next | <P> | <name> | <status>[ | revisitReason]`, then `draft`, `claimed | … | by <who>`, `blocked | … | <why>`, `resolved` lines. `ENGINE status <eng>` (read-only, used by `studio`) prints the same lines, claims with `since <date>` from the change log.

## Claim

`resolve-module` only, before any other work. The engine makes the edit; git order as below.

1. Pull.
2. `ENGINE module claim <eng> <PREFIX> --who "<who>"`. Sets `status: claimed`, `claimedBy`, map row `claimed`, spec header `Status:` (revisit), change-log line. Exit 1 = not on the frontier (claimed by someone else, blocked, draft, resolved, merged); the message names why and the next frontier Modules. Already claimed by you (resumed session) → exit 0, nothing written.
3. Commit only the files it touched (`ticket.md`, `map.md`, `spec.md` if any): `resolve-module: <ent>/<slug> claim <PREFIX>`. Push.
4. Push rejected → `git pull --rebase --autostash`, push again. Rebase conflict (a colleague claimed, or wrote `map.md`, at the same time) → `git rebase --abort`; undo only your unpushed claim commit: `git reset --mixed HEAD~1`, then `git checkout -- <those files>`; pull; go back to step 2 once. Step 2 now refusing with `claimed by <name>` = someone else claimed it: tell the Consultant, offer the next frontier Module. No work is lost: nothing but the claim was written.

## Close

When the Module spec and Prototype exist (Open Items may stay open): `ENGINE module close <eng> <PREFIX> --who "<who>"`. Refuses unless you hold the claim, `spec-check` passes and `prototype-data.json` + `prototypes/<PREFIX>-<slug>.html` exist. Sets `status: resolved`, clears `revisitReason`, keeps `claimedBy`; map row `resolved`; spec header `Status: resolved`; change-log line. Committed in the skill's End step.

## Other moves

- **Needs revisit** (`ingest` on new info touching a resolved Module, incl. a Questionnaire reply Edit; `resolve-module` on a merge target): `status: needs-revisit`, `revisitReason: <one line + Source ID>`. `ENGINE module revisit <eng> <PREFIX> --reason "<what changed> [<Source ID>]" [--skill <skill>]`; a second reason is appended with `; `. Refused while claimed (tell the holder).
- **Rename**: `resolve-module` may rename the Module it holds: `module rename … --who "<who>"`. Folder `<NEW>-<slug>`, `prefix: NEW`, `formerly: OLD`; map row updated. Requirement IDs keep the old prefix. Prototype view renamed with the folder; rebuild it (`build-prototype`).
- **Merge / split**: old folder kept, `status: merged-into <PREFIX>`; never deleted. Live Requirements get the next free ID in the target; the old block stays, `Withdrawn: Merged into X-NN` / `Moved to X-NN`. Split = new Modules + move Requirements + merge the old Module into its main part. A merged Module's Prototype view is removed; rebuild the target's.
- Make these moves (and confirm, new Module) with `ENGINE module <list|confirm|rename|merge|new|move> <engagement-dir> …`: same edits every time, prefix references in `open-items.md`, `process.md`, `plan.md` and other tickets follow. Usage: `ENGINE module`. (`ENGINE` = `node neome-studio/engine/cli.mjs`, repo root.)
- **Release a claim** (session abandoned): `ENGINE module release <eng> <PREFIX> --who "<who>"`: `status` back to `needs-revisit` if `revisitReason` is set, else `open`; `claimedBy` cleared. Someone else's claim: only `studio`, with `--force`, after the Consultant says yes.
