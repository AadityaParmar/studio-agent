# 20: Pulling upstream skills-main changes

Type: grilling
Status: resolved
Blocked by: None

## Question

Several pack skills are copied and adapted from `skills-main/` (Matt Pocock skills, MIT). How do later upstream changes reach them? Decide: how the origin is recorded (upstream path + commit SHA per skill in the `neome-studio/README.md` origins table?), who checks upstream and when (each eval cycle? on demand?), how a change is merged (manual diff + re-adapt, keeping the "How to talk" block and studio terms), and whether it must pass the evals before merge (ticket 18).

## Constraints from earlier tickets

- Ticket 02: origins table ("Where each skill comes from") lives in `neome-studio/README.md` (moved there by ticket 15).
- Map Notes: never edit upstream in place; every skill carries the "How to talk" block verbatim.
- Ticket 18: skill-text changes pass checks + evals before merge to `main`.

## Answer

Upstream = `github.com/mattpocock/skills`. Local `skills-main/` is a no-git snapshot of v1.3.1.

Decisions:
- **Origin record: SKILL.md front-matter is truth.** Each cloned skill carries `upstream: <path in upstream repo>` (e.g. `skills/productivity/grilling`) and `upstreamVersion: <package version>` (e.g. `1.3.1`). Pin = upstream release version, not SHA (CHANGELOG maps version → commit if needed). Skill cloned from several upstream skills (`grill-module`) lists each path.
- **README origins table** in `neome-studio/README.md` (ticket 15) lists skill → upstream name only, no version. No duplicate pin.
- **No snapshot in pack repo.** `skills-main/` is not copied into the shared repo. The check fetches upstream at the needed tags into a temp dir.
- **Who / when:** plugin maintainer (lead Consultant, ticket 18), on demand: roughly quarterly or when an upstream release is noticed. No automation in v1.
- **Merge method:** maintainer-only `upstream-check` (script + driver prompt in `neome-studio/maintainer/`, not a Consultant skill, not shown by `studio`, like ticket 18's eval runner). Per tracked skill: diff upstream path old pin → new tag, read CHANGELOG entries, agent proposes a re-adapted edit that keeps the "How to talk" block verbatim, studio terms (GLOSSARY.md) and facade paths (ticket 13). Maintainer accepts or rejects per skill. Never auto-merge.
- **Pin bumps:** skill whose upstream path did not change → bump `upstreamVersion` only. Rejected upstream change → still bump pin (reviewed and declined), note reason in commit message.
- **Gate:** same as ticket 18. Text change → deterministic checks + evals + maintainer approval before merge to `main`. Pin-only bump → checks only, no evals.
- **Opt out:** `upstreamDiverged: <reason>` in front-matter → check skips that skill; pin stays for history. Skills "modelled on" upstream (ingest, review-draft, resolve-module) or new carry no `upstream` key.
- **Attribution (MIT):** `neome-studio/LICENSE-upstream` holds upstream MIT notice; required while any cloned text remains.

Changes to earlier tickets:
- **02 / README-draft:** origins table drops nothing, gains no version column; add front-matter keys to the cloned skills; `upstream-check` added as maintainer-only tool.
- **18:** deterministic checks gain: every skill with `upstream` has `upstreamVersion`; `LICENSE-upstream` present if any skill has `upstream`.
- **15:** `skills-main/` not part of shared repo layout.
