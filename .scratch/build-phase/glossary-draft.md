# Glossary draft: Implementation terms (for slice 9)

Draft entries for `GLOSSARY.md`, same format. Added in slice 9 with `/domain-modeling`; until then this file + [spec.md](spec.md) hold them. Decided 2026-11-04 (glossary clash fixes).

## New section: Implementation

**Implementation**:
Building the Enterprise's app in Neome Studio from the Frozen copy, by Step files run one after another through the `neome-studio` MCP, up to deploy and later changes. Starts when every Module is resolved and every Requirement cleared.
_Avoid_: Build, build phase, phase 2, setup, configuration (clashes with Neome Build, `build-brd`, `build-prototype`, Delivery Configuration)

**Studio Enterprise**:
The Enterprise's app in Neome Studio, named by its `entId`. What Step files write to and what is deployed.
_Avoid_: ent, Enterprise (alone, for the app), Neome Build, instance

**Frozen copy**:
The BRD data file as it stood when Implementation was planned (`_agent/implementation/frozen-brd-data.json`). Implementation reads only this. A later change takes a new one; the difference is built.
_Avoid_: snapshot (taken by BRD versions), BRD version

**Step file**:
One file of MCP calls and human steps (`_agent/implementation/steps/NN-<layer>-<module>.md`), run as one unit with one Consultant yes, strictly after every file before it.
_Avoid_: ticket, task, process step, build step

**Cleared** (Requirement):
A Requirement with no open Open Item on it and not `(proposed, to confirm)`. Implementation needs every Requirement cleared.
_Avoid_: confirmed, approved, signed

**Deploy**:
Publishing the Studio Enterprise draft so users get it. Only on the Consultant's explicit yes.
_Avoid_: release (taken by BRD versions), publish, go-live

**Change request**:
Feedback or a change the user gives the agent after Implementation started, kept in one file per session (`CR-NN.md`, Source type `CR`) until every item is built, withdrawn or an Open Item.
_Avoid_: change log (taken by BRD versions and `map.md`), change order, ticket

## Edits to existing entries

- **Module**: add to _Avoid_: "Studio `module` resource (write it in code font with its kind)".
- **Delivery**: "indicative until the build phase" → "indicative until Implementation".
- **BRD data file**: "the handoff to the build phase" → "the input of Implementation (through the Frozen copy)".
- **Source** type list (draft-shapes): add `CR` Change request, `NR` Neomenta research note.

## Kept as is

- **Neome Build**, **Neome App Build**, **Build area**: Template bank only; "Build" stays theirs.
- `build-brd`, `build-prototype`: "build" = draw a view.
- On-hold skill `check-build` (07): name it `check-implementation` when picked up.

## Rule

Studio resources always in code font with their kind (`module`, `form`, `group`), never as glossary terms.
