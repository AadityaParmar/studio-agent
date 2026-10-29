# 12: BRD versioning and sign-off

Type: grilling
Status: resolved
Blocked by: 08

## Question

How are BRD versions numbered and statused (Draft for review → Signed off)? How is the change log between versions derived: closed Open Items, added or changed Requirements? What goes in the sign-off block, and is a signed-off version frozen?

## Constraints from earlier tickets

- From ticket 08: each rendered `versions/v<N>.html` has a frozen `versions/v<N>.json` snapshot, so the change log can be derived by diffing snapshots. Reserved fields to define here: `engagement.version`, `engagement.status`, `changelog[]`, `signOff`. Requirement and OI IDs are never reused, and withdrawn or merged items stay in the data, so diffs are stable.
- From ticket 13 (open): file paths may move under the facade layout (human files vs `_` agent folder). Decide the content, not the paths.

## Answer

**Only released versions get a number. Sign-off stamps one whole version, and after that it is frozen.**

Decisions:
- **Preview vs release.** A normal `build-brd` run makes a working preview: the live `brd-data.json` + `preview.html`, labelled "Working draft — not for circulation", with no number. **Release** mode (sending to the Enterprise) freezes `versions/v<N>.html` + `v<N>.json`. Versions are plain integers v1, v2… with no minor numbers. A release may still contain in-progress Modules (ticket 05).
- **Statuses** (`engagement.status` in a snapshot): `draft-for-review` | `signed-off`. Superseded is derived (a newer version exists) and not stored. `engagement.version` = N (integer).
- **Change log** = an auto-diff of `v<N-1>.json` vs `v<N>.json` plus one summary line from the Consultant at release. `changelog[]` entry = `{version, date, status, summary, changes[]}`. Earlier entries are copied forward from the previous snapshot, so the log is complete in every version. Change groups:
  - Modules: resolved, merged, renamed, set to needs-revisit
  - Requirements: added, changed, withdrawn
  - OIs: raised, closed (with answer Source)
- **"Changed" Requirement** = any change to statement, acceptance[], priority, scope, delivery or withdrawn. Each change lists the fields that changed, e.g. `QUO-06: priority Should→Must`. There is no wording-size threshold. Stable, never-reused IDs (ticket 08) make the diff reliable.
- **Sign-off block.** Two signers plus evidence: `signOff = {enterpriseSigner {name, role, date}, neomentaSigner {name, role, date}, evidence: <sourceId>, openAtSignOff: [OI ids], acceptedProposed: [object refs]}`. The evidence (signed PDF, email or WhatsApp approval) is registered as a Source (e.g. `SO-1`) through `ingest`. An unsigned version shows empty boxes (name, role, signature, date) ready to print and sign.
- **Preconditions (hard, checked by build-brd):** every Module is resolved or merged, and no Must Requirement has priority TBC or scope `open`. Open OIs are allowed but listed in the block as "Open at sign-off". Items still marked proposed are listed as "Accepted on sign-off".
- **Proposed after sign-off.** The frozen snapshot keeps `proposed: true` as history, and the sign-off records that the Enterprise accepted them. The next version's build clears `proposed` on everything that was in the signed version. Phase 2 treats every item in a signed snapshot as agreed.
- **Frozen.** Sign-off is a `build-brd` mode that stamps an existing released `v<N>`: it sets the status to `signed-off`, adds `signOff`, and re-renders that version once. After that the files never change. Later changes go into v<N+1> as `draft-for-review` (a change request). Phase 2 always takes the **latest signed-off** snapshot.
- **No partial sign-off.** The whole BRD is signed or nothing is. To start some Modules early, split them into a separate Engagement.

Glossary: added **BRD version** and **Sign-off**.

Paths: see ticket 13 (human `brd/preview.html`, `brd/v<N>.html`; agent `_agent/brd/versions/v<N>.json`).
