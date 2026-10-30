---
name: build-brd
description: "Build the BRD from the agent files. Modes: preview (default), release (new BRD version + change log), sign-off (stamp a released version)."
disable-model-invocation: true
---

# build-brd

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

Build the BRD with the engine, under the Engagement lock, and relay what it says in plain words with a next step. The engine is the only writer of the BRD data file, snapshots and pages: your writes are limited to the lock, the map change-log line, and plan weeks the Consultant gives. A BRD problem is fixed in the `_agent/` markdown by the skill that owns it, then the BRD is rebuilt.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. `<who>` = `git config user.name`. Git and lock: [git-protocol.md](../../reference/git-protocol.md). What each engine message means and its next step: [problems.md](references/problems.md). Data file, release and sign-off rules: [brd-data-schema.md](references/brd-data-schema.md). Next session: [next-session.md](../../reference/next-session.md).

**Modes**:

- **preview** (default): unnumbered working draft, `brd/preview.html`. Any time, Modules in progress shown "In progress".
- **release**: freezes the next BRD version `v<N>` (snapshot + `brd/v<N>.html`) with a change log diffed from `v<N-1>`, for the Enterprise to review.
- **sign-off**: stamps the latest released version with two signers and an evidence Source; then it never changes.

## 1. Scope

Args: `<eng> [<mode>]` (`<ent> <slug> [<mode>]` also fine). Need `<ent>`, `<slug>` and the mode; ask if not given. "Build / show / refresh the BRD" = preview; "send / release a version" = release; "they signed" = sign-off. Done when all three are fixed.

## 2. Check

Pull (git-protocol Start). Then, no lock yet, nothing written:

```
ENGINE mmdc-check
ENGINE build-brd <eng> --mode <mode> --check
```

- `mmdc-check` exit 1 → tell the Consultant: "Mermaid CLI missing or wrong version: run `npm ci` in the repo root, then run build-brd again." Stop.
- `--check` errors → relay them (problems.md), stop. Nothing to undo.
- **release**: the check prints `change:` lines (what `v<N>` will log), warnings, and `note [sign-off]` lines (what would block signing this version). Show the changes grouped, warnings and notes summed up per problems.md. 0 changes since `v<N-1>` → say so; release only if the Consultant still wants it.
- **sign-off**: the check runs on the latest released `v<N>` (what the Enterprise read). Errors → problems.md, Sign-off; stop. Passed → it says how many Open Items stay open and how many proposed items the Enterprise accepts by signing.

Done when the check exits 0 and the Consultant has seen its warnings.

## 3. Ask

- **preview**: nothing to ask.
- **release**: ask for the **summary line**: one line, why this version (suggest one from the `change:` lines; v1: what it is for). `warning [plan] … no weeks set` → ask if the Consultant wants to set weeks now (never suggest numbers); phases still proposed stay so until the Enterprise agrees (Questionnaire or Sign-off).
- **sign-off**: ask for the **evidence Source**: the signed copy or the written approval, already registered by `ingest` (`SO-n` usually). Not registered yet → tell the Consultant: drop it in `enterprises/<ent>/inputs/`, run `/neome-studio:ingest`, then build-brd sign-off again; stop. Read its text copy `enterprises/<ent>/_agent/sources/<ID>.md` and suggest the **two signers** from it, each name, role, date signed: Enterprise signer first, then Neomenta signer. What the evidence does not show, ask; never fill a signer from guesswork. Run the step 2 check again with `--evidence <ID>`.

Done when every answer the mode needs is in hand (sign-off: check with `--evidence` exits 0).

## 4. Start

Take the Engagement lock with `--skill build-brd` and push it (git-protocol Engagement lock). Done when the lock push succeeds.

## 5. Build

Release with weeks given → in `_agent/plan.md` write only the `week from` / `week to` cells the Consultant gave (whole numbers; one side may stay empty); leave the Source cell as it is. Then, by mode:

```
ENGINE build-brd <eng>
ENGINE build-brd <eng> --mode release --summary "<summary line>"
ENGINE build-brd <eng> --mode sign-off --signers "<name> | <role> | <YYYY-MM-DD>" "<name> | <role> | <YYYY-MM-DD>" --evidence <ID>
```

Exit 0 → it prints the files it wrote; keep them for step 7. Release / sign-off: add a map change-log line under `## Change log` in `_agent/map.md`: `- YYYY-MM-DD: BRD v<N> released: <summary line>` or `- YYYY-MM-DD: BRD v<N> signed off [<ID>]`.

Exit 1 → relay per problems.md; `mmdc-failed` → run the same command once more first. Then **stop early**: undo your plan week edits (`git checkout -- <eng>/_agent/plan.md`), clear the lock, End with only `map.md`: `build-brd: <ent>/<slug> unlock, build failed` (a preview `brd-data.json` written before `mmdc-failed` stays unstaged; the next build rewrites it).

Done when the build exits 0, or the lock is cleared and pushed after a failure.

## 6. After Sign-off

Sign-off only; else step 7. Terms shown in the signed version become agreed:

```
ENGINE glossary agree enterprises/<ent> --signed
```

Follow git-protocol Glossary writes: pull right before it, then commit `GLOSSARY.md` alone (`enterprise-glossary: <ent>/<slug> agree terms signed in v<N>`) and push; the step 5 files stay uncommitted until step 7. `nothing to agree` → no commit. Keep its `agreed:` / `kept proposed:` / `kept:` lines for the report. The `(proposed, to confirm)` marks in the markdown stay: every later build clears `proposed` on what the signed version accepted.

Done when the command exits 0 and any change is pushed.

## 7. Report and end

Tell the Consultant, short:

- What was built and where (repo path): `<eng>/brd/preview.html` (open in a browser; "Working draft — not for circulation") or `<eng>/brd/v<N>.html`.
- Warnings, summed up (problems.md), each with its next step.
- release: `v<N>`, change count by group, the summary line; send `v<N>.html` to the Enterprise (it prints to A4 with empty signature boxes). `note [sign-off]` lines → what must happen before this can be signed.
- sign-off: `v<N>` signed by whom, evidence `<ID>`; Open Items still open; proposed items accepted; glossary terms agreed. Later changes go into a new release (`draft-for-review`).
- release: wait for the Enterprise's comments or signed copy; both come back as Inputs through `/neome-studio:ingest`.

Clear the lock, then End (git-protocol). Message and files (paths under `<eng>/`):

| Mode | Message | Stage |
|---|---|---|
| preview | `build-brd: <ent>/<slug> preview` | `_agent/brd/brd-data.json`, `brd/preview.html`, `_agent/map.md` |
| release | `build-brd: <ent>/<slug> release v<N>` | `_agent/brd/versions/v<N>.json`, `brd/v<N>.html`, `_agent/map.md`, `_agent/plan.md` if weeks were set |
| sign-off | `build-brd: <ent>/<slug> sign-off v<N> [<ID>]` | `_agent/brd/versions/v<N>.json`, `brd/v<N>.html`, `_agent/map.md` |

## 8. Next session

Last thing of every run, after End; every stop above ends here too. Follow [next-session.md](../../reference/next-session.md): `ENGINE status <eng> --who "<who>"`, up to 3 `step` lines as `/neome-studio:<skill> <args> — <why>`. Done when the block is shown.
