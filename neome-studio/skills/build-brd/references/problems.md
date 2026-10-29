# build-brd: engine messages → plain words → next step

Engine lines look like `error [<class>] <message>` / `warning [<class>] <message>` / `note [sign-off] <message>`. Relay each **class** once: what it means in one plain line, the IDs it names (first 5, then "and n more"), and the next step. Errors stop the build and nothing is written; warnings never stop it. The fix always lands in `_agent/` markdown through the skill that owns the file, then build-brd runs again. Field-level rules: [brd-data-schema.md](brd-data-schema.md), Validation.

## Who fixes what

Find the file or ID in the message, then:

| Message points at | Next step |
|---|---|
| a `draft` Module | `/neome-studio:review-draft` |
| a Module ticket or spec (`modules/<P>-…`, a Requirement ID, `Module <P>`) | open / needs-revisit → `/neome-studio:resolve-module` on `<P>`; claimed → tell its holder (`claimedBy`); resolved → [Resolved Module](#resolved-module) |
| `general.md` (`GEN-NN`, Across all Modules), `process.md` (lanes, steps, edges), `plan.md`, the Module set | `/neome-studio:review-draft` (re-run) |
| `sources.md`, a Source ID, an Input | `/neome-studio:ingest` |
| `open-items.md`, a question for the Enterprise | `/neome-studio:questionnaire`; the answer comes back through `/neome-studio:ingest` |
| `GLOSSARY.md`, a term | the next `/neome-studio:ingest` or `/neome-studio:resolve-module` run that touches the term |

### Resolved Module

A resolved Module with an error (`completeness` or another) was edited after it closed. Offer to mark it needs-revisit so `resolve-module` picks it up. Yes → take the lock (git-protocol), `ENGINE module revisit <eng> <P> --reason "BRD build: <gap in a few words>" --skill build-brd`, clear the lock, End `build-brd: <ent>/<slug> <P> needs revisit`, staging the files it names. Next: `/neome-studio:resolve-module` on `<P>`.

## Setup

| Class | Plain words | Next step |
|---|---|---|
| `mmdc-missing` | Diagram tool (Mermaid CLI) not installed. | Run `npm ci` in the repo root, then build-brd again. |
| `mmdc-version` | Diagram tool is the wrong version; diagrams would differ. | Run `npm ci` in the repo root, then build-brd again. |
| `mmdc-failed` | Diagram tool could not draw (often a busy machine). Preview: data file written, page not. | Run the same build once more. Fails again → send the message to the maintainer; `npm ci` may help. |

## Build errors

| Class | Plain words |
|---|---|
| `parse` | A file is missing or not in its expected shape (message names the file). |
| `schema` | A value is the wrong kind, ID format, or not an allowed choice (message names the place). |
| `uncited` | A fact cites no Source and is not marked proposed; an N/A cites no Source. |
| `missing-source` | A cited Source is not in the Source register. |
| `duplicate-source` | A Source ID is registered twice. |
| `missing-oi` | Something names an Open Item that is not in the register. |
| `duplicate-oi` | An Open Item ID is in the register twice. |
| `requirement-id` | A Requirement ID is used twice, or sits in the wrong Module. |
| `unknown-status` | A status change uses a status the Module does not have. |
| `unknown-lane` | A process step is in a lane that does not exist. |
| `unknown-step` | A process arrow points at a step that does not exist. |
| `unknown-module` | Something names a Module that does not exist. |
| `unknown-app` | The Neome mapping names an App not in the catalog. |
| `reserved-prefix` | A Module uses `GEN`, kept for Across all Modules. |
| `duplicate-module` | Two Modules share a prefix. |
| `oi-module` | An Open Item is listed under an Across all Modules topic but is not tagged `All`. |
| `duplicate-phase` | Two plan phases share an ID. |
| `plan-weeks` | A plan phase ends before it starts. |
| `disputed-term` | A disputed glossary term's Open Item is missing or already closed. |
| `completeness` | Error: a resolved Module has a gap, or (release) a GEN Requirement has no acceptance criteria. Warning: an in-progress Module has a gap; normal until it is resolved. |

## Warnings

| Class | Plain words | Next step |
|---|---|---|
| `completeness` | In-progress Module not finished yet. | `/neome-studio:resolve-module` when its turn comes. Fine to preview or release. |
| `catalog-term` | Glossary term is a Neome word, not the Enterprise's own. | Term → Neome App belongs in the Module's mapping; next `resolve-module` on that Module. |
| `uncovered-topic` | Across all Modules topic says nothing (no Requirement, N/A or Open Item). Blocks Sign-off. | `/neome-studio:review-draft` re-run. |
| `plan` | Plan phase has no weeks, or is still proposed; or a resolved Module is in no phase. | Weeks: the Consultant gives them at release (build-brd step 3). Proposed: agreed by the Enterprise through a Questionnaire or Sign-off. Unplaced Module: `/neome-studio:review-draft` re-run. |

Group repeats: "4 plan phases have no weeks" beats four lines.

## Sign-off

Class `sign-off`: `error [sign-off]` lines (`note [sign-off]` at a release check) say what blocks signing. The check runs on the released `v<N>`, so a fix needs a new release, then sign-off of that one.

| Message | Plain words | Next step |
|---|---|---|
| `Module <P> is <status>` | Every Module must be resolved or merged. | `/neome-studio:resolve-module` (draft → `/neome-studio:review-draft`). Or split the early Modules into their own Engagement: no partial Sign-off. |
| `topic "<t>" is not covered` | An Across all Modules topic says nothing. | `/neome-studio:review-draft` re-run. |
| `<ID>: priority is TBC` | Priority not set. | Ask the Enterprise: `/neome-studio:questionnaire`, reply through `/neome-studio:ingest`. |
| `<ID>: Must Requirement with scope Open` | A Must has no agreed scope. | Same as TBC. |
| `missing-source` evidence | Signed copy or approval not registered. | Drop it in `enterprises/<ent>/inputs/`, run `/neome-studio:ingest`, then sign-off again. |

## Other messages

| Message | Plain words | Next step |
|---|---|---|
| `not an Engagement folder` | Wrong Enterprise or Engagement name. | Check `<ent>` / `<slug>`. |
| `no released BRD version to sign off` | Nothing released yet. | build-brd release first. |
| `already signed off` | That version is signed and never changes. | Later changes → a new release. |
| `v<N> already exists` | A stray version file sits where the new one would go. | Tell the Consultant the path; leave it; ask the maintainer. |
| `check passed: v<N> would have 0 change(s)` | Nothing changed since the last version. | Release only if the Consultant still wants it. |
