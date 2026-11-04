# UAT and change loop

Type: grilling
Status: resolved
Blocked by: 04

## Question

After deploy: UAT feedback as a new Source type through `ingest`? A change after Sign-off → new BRD release → rebuild only the delta (`diff_enterprise`)? How does a Module revisit reach the build tickets?

## Answer

User, 2026-11-04:

1. **Changed from proposal.** No `UT` Source via `ingest`. The user tells the agent feedback or changes directly. Agent keeps one `change-*.md` file per change session, a single file holding every item, open until that change is closed.
2. Yes. Each item: built wrong (build ≠ spec) → new rework step file, spec unchanged; need changed (Requirement changes) → Module needs-revisit → `resolve-module` revisit → new frozen copy → rebuild the difference only.
3. Yes. Difference = old frozen copy vs new one; new step files appended after the last number; done files never edited. Not `diff_enterprise` (broken, see 06).
4. Yes. Every re-deploy follows the deploy file rules, explicit yes each time.
5. **Changed from proposal.** Sign-off happens when the user asks for it (no fixed point). `build-brd` sign-off mode as today. Changes D12 timing.

Open (fog): change file location, name, item shape, who closes it, and whether it counts as a Source for citations.

## Comments
