# 34 — `resolve-module` orchestrator

**What to build:** The Consultant runs `resolve-module`, which claims a Module by push before any work, then runs grill → spec (+ mapping) → Prototype in one session and closes the ticket. Revisit of a needs-revisit Module is a shorter pass. Spec: stories 38–40, 59–63, 75; Git and concurrency.

**Blocked by:** 30 — `review-draft`; 32 — `write-module-spec` + `neome-mapping`; 33 — Module Prototype

**Status:** resolved

- [x] Picks from frontier; commits + pushes `status: claimed` + `claimedBy` first
- [x] Rejected push → "someone else claimed it", suggests another Module, no work lost
- [x] Runs `grill-module` → `write-module-spec` → `neome-mapping` → `build-prototype`
- [x] Refines this Module's section of the process file
- [x] Ask no Module owns → GEN Requirement added under Engagement lock
- [x] Closes ticket (resolved) once spec + Prototype exist, even with OIs open; pushes
- [x] Revisit covers only what changed (revisitReason); spec edited in place; Prototype rebuilt
- [x] Rename/merge → Prototype view renamed/removed

## Comments

- Done 2026-10-29. Skill `neome-studio/skills/resolve-module/SKILL.md` (9 steps: scope/frontier/mode, claim, grill, process, spec, Prototype, shared edits, close, report+end; stopping early). New, no upstream pin (spec: "new (wayfinder work-through)"). Engine `modules.mjs` new actions: `module frontier` (next = needs-revisit first then open, plus draft/claimed/blocked/resolved lines), `claim --who` (frontier check, status/claimedBy/map row/spec `Status:`/change log; refusal names holder or blocker + next frontier Modules; holder again = no-op), `release --who [--force]` (back to needs-revisit if `revisitReason`, else open), `close --who` (runs spec-check; needs `prototype-data.json` + `prototypes/<PREFIX>-<slug>.html`; resolved, `revisitReason` cleared, `claimedBy` kept), `revisit --reason [--skill]` (resolved → needs-revisit, reasons appended with `; `; refused while claimed); `rename` takes `--who` so the holder can rename its claimed Module. `reference/map-logic.md` Frontier/Claim/Close/Other moves rewritten around these; `git-protocol.md` one exception: claim-race recovery `git reset --mixed HEAD~1` of own unpushed claim commit. Fixture `engine/test/fixtures/resolve-module/after-resolve/` (after-prototype + QUO section of `process.md` refined from WS-2, GEN-04 Access "buyers' phone numbers" from the WS-2 "Other" ask no Module owned, QUO closed by the engine, change-log lines). Tests `engine/test/resolve-module.test.mjs` (18, incl. a real two-clone git race on a bare remote). `npm test`: 274 pass, check 11 skills OK.
- Small choices (my call; revisit if wrong):
  - Lock rule: own H2 section of `process.md` (its steps + edges touching them) needs no lock; GEN Requirements, `plan.md`, new lanes, other Modules' process rows and Module set moves = shared edits, done in one lock window at step 7 before close.
  - Lock held by someone else at step 7 and Consultant cannot wait → one Open Item per pending ask (owner Neomenta), so nothing is lost; Module still closes.
  - Custom module → phase `Modules` cells lose the prefix, Not yet placed row `<Name> as a Custom module`, proposed.
  - Rename of this Module happens while still claimed (`--who`), then Prototype rebuilt under the new prefix, then close. Merge/split: release claim, engine moves, resolved merge target → `module revisit`; split parts are draft → review-draft re-run. Prototype view rename/removal itself was already done by ticket 33's engine; tested again here.
  - Claim race: any rebase conflict on the claim commit (same Module or just concurrent `map.md` change-log lines) → abort, undo own claim commit, discard those files, pull, claim again; engine refusal = "someone else claimed it".
  - Stopping early keeps the claim (resume = run again; engine says "already claimed by you"); release only if the Consultant hands it back.
  - Fixture does not store the Prototype HTML (view, rebuildable; would go stale on renderer changes); tests rebuild it.
- Not verified: live `/neome-studio:resolve-module` Claude session (simulated by following the steps by hand on the after-prototype fixture → after-resolve; build-brd check exit 0, only ENQ warnings). From-Inputs mode, a real revisit with spec edits, Custom-module plan move and lock-held fallback not exercised end to end (engine parts tested). Git race tested on a local bare remote only (no GitHub auth / network).
- Handoffs:
  - 36 (`ingest` reply loop): set needs-revisit with `ENGINE module revisit <eng> <P> --reason "<what> [<Source>]"` (default `--skill ingest`); refused while claimed → tell the holder / retry after close.
  - 38 (`studio`): `ENGINE module frontier <eng>` is the next-Modules / claimed-by / blocked view; stale claim → `module release <eng> <P> --who "<me>" --force` after asking. Resolved Module with no `prototypes/<PREFIX>-<slug>.html` = gap to show.
  - 39 (READMEs): Troubleshooting "push rejected on claim" = map-logic Claim step 4, the skill does it.
  - 41/42 (evals): resolve-module needs a git remote; run evals in a temp clone with a local bare remote (pattern in `resolve-module.test.mjs`).

