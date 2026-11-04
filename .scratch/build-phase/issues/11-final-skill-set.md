# Final skill set and router

Type: grilling
Status: resolved
Blocked by: 04, 05, 09

## Question

Lock the skill list. Proposed: add `plan-build` (to-tickets), `build-module` (implement), `check-build` (code-review; on hold, todo, see 07), `resolve-open-items` (research). Merge `neome-mapping` into `write-module-spec`. Hide building blocks (`user-invocable: false`). Run spec / mapping / Prototype as AFK subagent inside `resolve-module`? Prototype rebuild path for Consultants. `studio` + `status.mjs` step lines for build phase. Maintainer `/retro` after real Engagements.

## Answer

User, 2026-11-04, yes to all:

1. One user skill `/neome-studio:build`, modes `plan` (frozen copy, `names.md`, `target.md`, step files) and `run` (next step file, deploy file included).
2. New user skill `/neome-studio:change`, owns `change-NN.md`. Flow (user picked agent's flow over own draft "update Module files → suggest BRD → note → build"):
   1. **Note**: open / continue `change-NN.md` (one per session), each item verbatim, who, date; registered as Source type `CH`.
   2. **Sort + impact**: built wrong (spec stays) / need changed / new need / unclear (→ Open Item); per item show Modules, Requirements, step files, other Modules touched; Consultant confirms.
   3. **Update Module files**: small → edit `spec.md` citing `CH-n`, withdraw never delete, `spec-check`, rebuild Prototype. Big (adds a Module, changes the flow, or > 3 Requirements in a Module) → needs-revisit → `resolve-module`.
   4. **BRD**: preview always; a released version touched → todo "release BRD v<N+1>".
   5. **Build**: `build plan` new frozen copy → difference step files (rework files for built wrong); `build run`, yes per file, deploy on yes.
   6. **Close**: when every item is built, withdrawn or an Open Item.
   Gate exception: an unclear item (Open Item) blocks only itself; the rest of the change builds.
3. Strict build gate kept (02): every Module resolved, every Requirement cleared. VEN waits for OI-25.
4. Merge `neome-mapping` into `write-module-spec`; building blocks `user-invocable: false`; `build-brd` views-only rebuild mode (BRD + Prototypes).
5. `resolve-module`: grilling stays with the Consultant; spec, mapping, Prototype run as a fresh background agent, gated by evals.

Final set: 9 user skills (`studio`, `ingest`, `review-draft`, `resolve-module`, `questionnaire`, `build-brd`, `resolve-open-items`, `build`, `change`); 4 hidden building blocks (`grill-module`, `write-module-spec`, `build-prototype`, `enterprise-glossary`); `check-build` on hold (07). `studio` + `status.mjs` step lines for build, change, resolve-open-items. Maintainer `/retro` after real Engagements.

## Comments
