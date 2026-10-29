# 29 — `enterprise-glossary` lifecycle

**What to build:** The Enterprise glossary stays one consistent language across all Engagements: later Engagements draft in existing terms, conflicts raise Open Items, two-meaning terms split, renames keep history, and terms become agreed on confirmation or Sign-off. Spec: Enterprise glossary, stories 27, 52, 91–95.

**Blocked by:** 28 — `ingest` first run + shared git/lock protocol

**Status:** resolved

- [x] Entry shape: term, definition, _Avoid_, _Source_, _Status_ proposed|agreed, _Used in_
- [x] `ingest` on a later Engagement reads glossary first and drafts in its terms; Used in updated
- [x] New meaning for existing term → OI + term marked disputed; never overwritten
- [x] Two real meanings → two qualified terms, bare word in Avoid
- [x] Rename → old name to Avoid; specs of open Engagements rewritten; signed versions untouched
- [x] Term → agreed when confirmed in a Questionnaire reply or shown in a signed BRD
- [x] No catalog terms; no term → Neome entity mapping here

## Comments

- Done 2026-10-29. Engine `neome-studio/engine/glossary.mjs` (wired in `cli.mjs` as `glossary <action>`): `agree --term --source` (Questionnaire reply), `agree --signed` (terms in each Engagement's latest signed-off `v<N>.json` → agreed + evidence Source, unless disputed or changed since), `dispute --term --engagement --oi` (adds slug to _Used in_ + `_Disputed_: <slug>/OI-NN`; meaning untouched; OI must exist, be open, owner Enterprise), `settle --term --source [--definition]`, `split --term --into "<T> | <def> | <slugs>" x2 [--source]`, `rename --term --to [--source]`. Edits only the touched entry lines of `GLOSSARY.md`; never any other file. Split/rename print `rewrite: <path>:<line>` for old-word lines in open Engagements' `_agent/` markdown (not `_agent/brd/`) and `skipped: <slug>` for signed ones; the skill rewrites. Reader (`brd/read-engagement.mjs`): `_Disputed_: <slug>/OI-NN` = disputed only in that Engagement. New build warning `catalog-term` (`brd/validate.mjs` `glossaryWarnings`): term = Neome App name, or definition mentions Neome. `build-brd.mjs` exports `latestSigned`; `ingest.mjs` exports `parse`/`usage`. Skill `enterprise-glossary/SKILL.md` rewritten (Entry, Git, Add, Dispute, Settle, Split, Rename, Rewrite, Agree); `ingest/SKILL.md` steps 1/5 (later Engagement: read glossary whole, hand in existing terms used so _Used in_ updates, conflicts → OI + dispute). Schema docs: glossary shape + `catalog-term`. Tests `engine/test/glossary.test.mjs` (14; base = `resolved` fixture released + signed, plus open `warehouse` Engagement). `npm test`: 184 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Disputed mark carries the Engagement slug because OI IDs are per Engagement; other Engagements' BRDs show the term undisputed (their OI register lacks the OI). One dispute per term at a time (second one → add to the same OI).
  - Status rule: settling a dispute, or splitting/renaming a disputed or agreed term, needs `--source` = the Enterprise's answer and gives `agreed`. Split/rename of a proposed term stays proposed (Consultant's word in grilling).
  - "Open Engagement" = no released version, or latest version not signed off. Engagements whose latest version is signed off keep their markdown (matches what was signed); listed as skipped.
  - Rewrite list = case-insensitive whole-word match (+ s/es plurals), incl. open-items rows; agent judges sense. Engine does not rewrite specs itself (word may have other senses).
  - `agree --signed` leaves already-agreed terms untouched (no extra evidence Source added).
- Handoffs: ticket 36 (`ingest` reply loop) must call `glossary agree --term --source QA-n` / settle path; ticket 37 (`build-brd` skill) must run `glossary agree --signed` after sign-off and commit `GLOSSARY.md`; grill-module/resolve-module (31, 34) add terms via this skill.
- Not verified: live Claude session of the skill (simulated: followed Dispute → Settle/Split/Rename → Rewrite → Agree steps via the CLI on the test Enterprise; all builds `--check` exit 0). Git pull/commit/push untested (no remote). Engine reader of `GLOSSARY.md` duplicated in `glossary.mjs` (same grammar as `read-engagement.mjs`); keep in sync.
