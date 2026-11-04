# Map: Implementation v3 build (Labels: wayfinder:map)

## Destination

Plugin v3.0.0 released on main: slices 3–10 of [build-phase spec](../build-phase/spec.md) built and tested, so a Consultant can go from resolved Modules to a deployed Studio Enterprise, with Change requests and Neomenta Open Items handled. `check-implementation` stays on hold.

## Notes

- **Execution map.** Overrides "plan, don't do": each `task` ticket = one build slice, done in its own session. Decisions already locked in [build-phase map](../build-phase/map.md) + [spec.md](../build-phase/spec.md); don't reopen them, raise a grilling ticket if one looks wrong.
- Terms: [glossary-draft.md](../build-phase/glossary-draft.md) until slice 9 moves them into `GLOSSARY.md`. Phase = **Implementation**, skill `implement`, never "build".
- Plugin change: follow `docs/route.md`. Engine change test-first (`neome-studio/engine/test/`). Gate: `npm test` green; skill text → evals + spot-check.
- Commit straight to main (user, 2026-11-04). Skills own git inside skill runs; slice work is maintainer work.
- MCP writes: confirm with user first; test Enterprise ent103 `e-qMihNWulraS4gYKTspkfbygWZ` (VEN deployed = baseline). Never `deploy_enterprise` unasked.
- Dry run lessons: [06 answer](../build-phase/issues/06-dry-run-one-module.md) (validate per call group; `diff_enterprise` broken on new forms; schemas too big for context; option keys; one write at a time).
- Skills: /tdd, /writing-for-agents (skill text), /grilling + /domain-modeling (grilling tickets).

## Decisions so far

- S1 Implementation gate (`55fa224`): `engine/implementation/gate.mjs`; `status` prints `implement | ready / blocked` (info only; `step | implement` line comes with 03).
- S2 Implementation files (`e4040f2`): `implement init | check | next | fields` in `engine/implementation/files.mjs`.

## Not yet specified

- Refreeze command (new Frozen copy + difference step files): shape lands in 05 after 02 settles.
- Go-live list (users, roles to people, data import): not via MCP; later.
- Neome MCP team: report `diff_enterprise` "form not found" bug (who, where).

## Out of scope

- `check-implementation` (browser testing): on hold, [build-phase 07](../build-phase/issues/07-check-build.md).
- Data import, plugin build, pricing, RFP-response genre.
