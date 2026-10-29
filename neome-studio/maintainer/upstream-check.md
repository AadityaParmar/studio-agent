# upstream-check (maintainer only)

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Driver prompt for the plugin maintainer. Bring upstream changes (`github.com/mattpocock/skills`) into the cloned skills, one skill at a time, each re-adapt **accepted** by the maintainer. Not a Consultant skill; `studio` never names it. Run on demand: roughly quarterly, or when an upstream release is noticed.

`TOOL` = `node neome-studio/maintainer/upstream-check.mjs`, from the repo root. Its header lists every output line and file. `<to>` = the upstream version to move to.

Pin rules: a cloned skill's front-matter has `upstream` (path or list of paths) + `upstreamVersion`. `upstreamDiverged: <reason>` → the tool skips it; its pin stays for history. Skills with no `upstream` are not tracked.

## 1. Start

1. `git pull --rebase --autostash`; fails → stop, tell the maintainer.
2. Ask the maintainer for `<to>` (default: latest upstream tag).
3. `git switch -c upstream-<to>`. All commits of this run go on this branch; `main` changes only at step 4.

Done when on a fresh branch off an up-to-date `main`.

## 2. Diff

Run `TOOL diff neome-studio [--to <to>]`. It clones upstream into a temp folder (network needed; `--repo <url|dir>` for a mirror) and writes `out <dir>` per its first line. It never edits the plugin. `skills-main/` is an old local snapshot: never read it for this, never edit it.

Exit 1 with no `skill` lines (fetch failed, version not found) → stop, show the message.

Done when you hold one line per tracked skill and the `done` line.

## 3. Per skill

Go down the `skill` lines in order. Each status has one path:

- `skipped`: diverged. Nothing to do.
- `current`: already at `<to>`. Nothing to do.
- `unchanged`: upstream path did not change. Pin-only bump: `TOOL pin neome-studio <skill> <to>`, commit (below).
- `error`: show the line to the maintainer (wrong `upstream` path, pin newer than `<to>`, version missing upstream). Fix only with their answer; else leave the skill as is and say so in the report.
- `gone`: upstream path removed or moved at `<to>`. Read `<out>/<skill>/changelog.md` and the whole-range `<out>/changelog.md` for the reason. Ask the maintainer: point `upstream` at the new path and re-run step 2, or add `upstreamDiverged: <reason>`, or leave the pin. No default.
- `changed`: propose a re-adapt (below).

Then `licence`: `changed` → show `<out>/licence.diff`; with the maintainer's yes, update `neome-studio/LICENSE-upstream` to the new notice and commit it alone.

Done when every `skill` line has its outcome: nothing, pinned, re-adapted, or the maintainer's answer recorded.

### Re-adapt a `changed` skill

Read in full: `<out>/<skill>/upstream.diff`, `<out>/<skill>/changelog.md`, the new upstream files under `<out>/<skill>/new/`, the pack skill folder `neome-studio/skills/<skill>/`, and `GLOSSARY.md`.

For each upstream hunk, decide **take** or **leave**:

- **Take**: a fix or idea that improves the pack skill's job. Write it into the pack skill's own words and structure, not the upstream text pasted in.
- **Leave**: the hunk touches text the pack skill dropped, or an upstream-only convention (its issue tracker, ADRs, setup skill, `/skill` names, its own glossary files). One-line reason.

Every taken edit keeps the pack contract:

- the How to talk block verbatim;
- studio terms exactly as in `GLOSSARY.md`, never their _Avoid_ words (Enterprise, Consultant, Module, Requirement, Open Item, Input, Source…);
- facade paths: humans touch only `enterprises/<ent>/inputs/` and `confidential/`; agent files under `_agent/`; views (`brd/`, `prototypes/`, `questionnaires/`) rebuilt by the engine, never edited;
- engine calls, git ownership (building blocks run no git) and the step numbering the other skills link to.

Show the maintainer, per skill: the take/leave list, then the proposed edit as a before/after diff of the pack files. Ask: accept, reject, or change. Edit nothing before an explicit accept.

- **Accept**: apply the edit, run `node neome-studio/engine/cli.mjs check neome-studio` (must pass), then `TOOL pin neome-studio <skill> <to>`, commit.
- **Reject**: `TOOL pin neome-studio <skill> <to>` only (reviewed and declined), ask for the reason, commit.
- **Change**: revise and show again.

### Commit

One commit per skill, only that skill's folder: `git add neome-studio/skills/<skill>`, then

- `upstream-check: <skill> <from> → <to> pin only (upstream unchanged)`
- `upstream-check: <skill> <from> → <to> re-adapt (<one line: what was taken>)`
- `upstream-check: <skill> <from> → <to> pin only (rejected: <reason>)`

## 4. Gate and report

1. `npm test` must pass.
2. Any re-adapt accepted → evals before merge to `main`: `node neome-studio/evals/run.mjs run --all` on this branch (driver: `neome-studio/evals/eval.md`) + maintainer approval. Pin-only bumps → checks only.
3. `git push -u origin upstream-<to>`. Never `--force`. The maintainer merges to `main` after the gate.

Report: one line per skill (status → outcome), licence, test result, evals needed yes/no, anything waiting on the maintainer.

Done when the branch is pushed and the report is given.
