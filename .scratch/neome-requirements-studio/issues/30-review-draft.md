# 30 — `review-draft`

**What to build:** In a fresh session the Consultant runs `review-draft` and is quizzed on the draft: confirm, merge, split or rename Modules; sketch process skeleton and roles; answer Engagement-wide topics once. It writes one Module ticket per confirmed Module and a plan skeleton, under the Engagement lock. Re-runnable when later `ingest` adds Modules. Spec: stories 29–37.

**Blocked by:** 28 — `ingest` first run + shared git/lock protocol

**Status:** resolved

- [x] Quiz in grilling rounds; pull, lock, commit, push
- [x] Merge/split → old folder kept with `merged-into <PREFIX>`; rename → folder renamed, `formerly` recorded
- [x] Process skeleton (lanes, steps) and roles written
- [x] Engagement-wide topics (access, localisation, hosting, migration, training, support) asked once; OIs use Module = `All`; general file per template
- [x] One Module ticket per confirmed Module (YAML front-matter: status, prefix, blockedBy, …); Engagement map Modules index updated
- [x] Plan skeleton: 4 default phases, Modules placed, no week numbers
- [x] Re-run confirms only new Modules
- [x] Output passes engine preview build

## Comments

- Done 2026-10-29. Engine `neome-studio/engine/modules.mjs` (wired in `cli.mjs` as `module <action>`): `list` (map order, draft/confirmed, blockedBy, formerly), `confirm <P> [--blocked-by "A, B"]` (drops `draft`, writes full front-matter status/prefix/name/blockedBy/revisitReason/formerly/claimedBy, map row = status, change-log line; refuses already confirmed, merged, unknown/self/merged blockers), `rename <P> [--to NEW] [--name]` (folder `<NEW>-<slug>`, `formerly`, H1 + `Name:`, map row; repoints prefix in `open-items.md` / `process.md` / `plan.md` Module columns and other tickets' `blockedBy` / `merged-into`), `merge <FROM> --into <TO>` (old folder kept `merged-into TO`, live Requirements copied to TO with next free IDs, old blocks `Withdrawn: Merged into TO-NN`, section-13 OI bullets brought along, references repointed, prints `fold in by hand` sections), `new <P> --name [--after P]` (draft ticket + map row), `move <REQ-ID>... --to <P>` (same copy/withdraw with `Moved to X-NN`; target added to OI Module(s)). Works on `spec.md` when it exists, else ticket (same rule as build-brd). Checks everything first; refused = exit 1, nothing written. `ingest.mjs` now exports `today`, `slugify`. Skill `skills/review-draft/SKILL.md` (7 steps: scope/work list, start+lock, read, quiz in ≤5-item rounds over 5 groups, write, check, report+end) + `references/review-shapes.md` (WS session log, process skeleton, roles, general topics, plan skeleton with 4 default phases). `reference/map-logic.md` Other moves: merge/split ID rule + `ENGINE module`. Tests `engine/test/review-draft.test.mjs` (10) + hand-run fixture `engine/test/fixtures/review-draft/after-review/` (first-run fixture after a simulated review: WS-1, ENQ+QUO confirmed, process, 7 topics covered, plan). `npm test`: 194 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Split = `module new` per part + `module move` + `module merge` the old Module into its main part (schema has one `merged-into` target). Per-Requirement trail via `Moved to` / `Merged into`.
  - Requirement IDs never renumbered in place: merged/moved ones get new target IDs, old blocks stay withdrawn (as in `resolved` fixture). Rename keeps old IDs (`formerly`); a second prefix change on an already-renamed Module is refused (IDs would carry a prefix the validator no longer allows). New prefix may not equal any prefix, former prefix, or GEN.
  - Merge/move copy Requirement blocks and OI bullets only; other sections (purpose, roles, process, volumes…) are folded in by the agent (judgment), engine lists them.
  - Consultant-relayed Enterprise answers → session log Source `WS-n` written to `inputs/review-draft-session.md` and registered via `add-source` (renamed `WS-n-…`), so N/A topics and relayed facts are cited. Consultant's own view → proposed + OI (ticket 04 rule).
  - Roles live in each Module's `## 2 Roles` + person lanes in `process.md` (no Engagement-level roles file in the layout). Headcount only from a Source.
  - Plan skeleton: fixed phase IDs `masters`, `workflow`, `uat`, `go-live`; live Modules in first three, `GEN` in masters + go-live; third-party integrations and OI-hung scope → Not yet placed; all `(proposed, to confirm)`, weeks empty. Custom Modules unknown until `neome-mapping`.
  - Engine adds one change-log line per action; skill adds one summary line at end.
  - Re-run: work list = `draft` Modules + uncovered topics + missing process/plan entries; empty → stop before taking the lock.
- Not verified: live `/neome-studio:review-draft` Claude session (simulated by running the steps on the ingest first-run fixture by hand; preview build exit 0, 4 expected completeness warnings). Git pull/lock push/commit untested (no remote). `git add -A` of renamed folders untested. Prototype view rename/removal on rename/merge not done (no Prototypes exist at review time).
- Handoffs: 31 (`grill-module`) can reuse the WS session-log pattern (`inputs/<name>.md` + `add-source --prefix WS`). 32/33/34: rename/merge after Prototypes exist must also rename/remove `prototypes/<PREFIX>-<slug>.html` (not done by `module`). 34 (`resolve-module`) / 32 (`neome-mapping`): move Custom-Delivery Modules to plan Not yet placed. 36 (`ingest` reply loop) and later `ingest` runs: new Modules must be drafted with `draft: true` + map row `draft` so `review-draft` re-run picks them up. 38 (`studio`): `ENGINE module list` gives draft/confirmed/blockedBy for the frontier.
