# 45 — Next-step handoff at session end

**What to build:** Every user skill ends by printing "Next session:" — up to 3 runnable `/neome-studio:<skill> <engagement-path> [<PREFIX>]` lines with a short why, taken from engine `status` `step` lines. Decision: [44](44-next-step-handoff-at-session-end.md). Spec: stories 151–153.

**Blocked by:** 38 — `studio` router

**Status:** resolved

- [x] Engine `status`: `step | <skill> | <args> | <why>`; args = repo-relative Engagement path (+ Module prefix for resolve-module); header doc + `studio.test.mjs` updated
- [x] 6 user skills accept `<engagement-path> [<PREFIX>]` args; missing → ask, as now
- [x] ingest, review-draft, resolve-module, questionnaire, build-brd: final "Next session" step after End, also on early stops; hand-written "Next:" bullets removed
- [x] studio step 4 uses same format
- [x] Lock held by other → "(waits for <holder>'s lock)"; push failed → "from local copy"; `done` → "Nothing next"
- [x] Pack lint: each user skill has the Next session step; `npm test` passes

## Comments

- Done 2026-10-29. Engine `status.mjs`: `step` lines now `step | <skill> | <args> | <why>`, always 4 cells (split on ` | `). `<args>` = `enterprises/<ent>/engagements/<slug>` (built from the folder names, forward slashes), + ` <PREFIX>` for `resolve-module` (first `next` Module; revisits come first). Repo / Enterprise view (no Engagement to name) → empty cell: `step | ingest |  | <why>`. Header doc says so, plus the `done` line. New shared reference `neome-studio/reference/next-session.md` (run `ENGINE status <eng> --who`, whole-repo status when no Engagement yet; print first 3 steps as `Next session:` / `1. /neome-studio:<skill> <args> — <why>`; empty args → no args; lock held by other → ` (waits for <holder>'s lock)` on ingest / review-draft / build-brd; pull or push failed → `Next session (from local copy):`; `done` and no step → `Nothing next: BRD v<N> signed off.`; status fails → fix, then `/neome-studio:studio`). Skills: ingest (9), review-draft (8), resolve-module (10), questionnaire (6), build-brd (8) get a final `## <n>. Next session` step linking it ("every stop above ends here too"); studio step 4 renamed `Next session`, same format. Each skill's Scope reads args `<eng>` (+ `[<PREFIX>]` resolve-module, `[<mode>]` build-brd), `<ent> <slug>` also fine, else ask. Hand-written "Next:" bullets removed from ingest, review-draft, resolve-module, build-brd reports and ingest `reply-loop.md` Report; review-draft empty-list and resolve-module empty-frontier no longer name a skill by hand. Pack lint `check.mjs`: a user skill (`disable-model-invocation: true`) needs a `## <n>. Next session` heading and a link to `../../reference/next-session.md`. README engine table + `map-logic.md` mention status use. Tests: `studio.test.mjs` step lines updated, new asserts: own claim → resume step, every fixture step line has 4 cells and a valid args cell; `check.test.mjs` +2 (user skill passes with the step, fails without step / link; building block needs none). Commands: `npm test` → 355 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Empty args = literal empty cell (`step | ingest |  | why`), not `-`: a `-` could get pasted as an arg. 4 cells always, so ` | ` split stays unambiguous.
  - Args path is canonical `enterprises/<ent>/engagements/<slug>` from folder names, not a git-root lookup (status runs no git; the facade layout is fixed).
  - Overview `ingest` steps (Inputs waiting in some Enterprise) get no args even when the Enterprise has one Engagement: new Inputs may belong to a new Engagement.
  - New step: a Module `claimed` by `--who` → `step | resolve-module | <eng> <P> | resume <P>: claimed by you` (after review-draft, before `next`). Without it a resolve-module early stop (keeps its claim) would not show how to resume.
  - `resolve-module` why text unchanged (`next: ENQ, ABC (revisit) (one per session)`): args carry the first, why lists the others.
  - `done` with other steps too → show steps, then `BRD v<N> signed off.`
  - Lint keys on `disable-model-invocation: true` (exactly the 6 user skills) instead of importing `USER_SKILLS`, so `check` stays light.
  - Skills still accept `<ent> <slug>` (eval `replay.yaml` files pass args that way); not changed in evals.
  - Shared text in one reference file, linked from each skill (no 6 copies); skill section is 1 line + link.
- Verified: `npm test` (355 pass, pack lint OK); `status` by hand on build-prototype/after-prototype with `--who Asha` (resume QUO, next ENQ, questionnaire, build-brd lines). Not verified: live Claude sessions printing the block (early stops, lock-held suffix, local-copy note, `done` wording); evals not re-run (skill text changed → evals before merge to `main` per README Gate).
