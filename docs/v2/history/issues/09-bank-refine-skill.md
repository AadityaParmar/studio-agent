# Bank refine skill

Type: grilling (HITL)
Status: resolved
Blocked by: 05, 06

## Question

Spec a repeatable skill that takes new Neome Build JSON(s) and refines the bank in place: enhance an existing Template module (new usual needs, Patterns, steps, more evidence), split one into two, merge near-duplicates, add new Template modules / Templates, retire stale Patterns. What triggers it, incremental vs full re-cluster, how diffs are proposed and reviewed by a human before write, versioning / changelog of bank entries, and how Eval cases guard against regressions.


## Answer

Locked with user (2026-11-03).

- **Form:** maintainer-only tool, like `upstream-check`: driver prompt `neome-studio/maintainer/refine-template-bank.md` + script `refine-template-bank.mjs`. Not a Consultant skill; `studio` never names it.
- **Scope:** same tool does first mining (empty Template bank) and every later refine. No separate one-time pipeline.
- **Trigger:** by hand, when maintainer drops new or updated Neome Build JSON in `raw/`.
- **Mode:** incremental default: new Builds → digest → scrub → tag (seeded with bank names); cluster child reads new tag sheets + current bank entries, not old tag sheets. `--full` re-clusters from all tag sheets. Tag sheets kept in `raw/` for good.
- **Change kinds:** `add`, `enhance` (usual needs / Patterns / steps / seenIn), `split`, `merge`, `rename`, `retire`. Each has reason + proof lines from tag sheets.
- **Review:** fresh Opus 5.5. Auto-applies `add` / `enhance` / `rename` that pass. Asks human only when unsure: proof lines don't back it, it disagrees with clusterer, or change is `split` / `merge` / `retire` (ID-changing).
- **Overrides Mining pipeline:** "human yes per entry" replaced by the review rule above, first run included.
- **Safety net:** changes committed on branch `template-bank-refine-<date>` + report (each change + reason). Maintainer skims report, merges. Revert = git.
- **IDs:** retire / split → file deleted (git keeps history). Merge keeps one ID; other name → `aliases`. Bank `CHANGELOG.md` records `replacedBy` (old → new ID(s)); Skill integration "ID gone" warning uses it to suggest new ID.
- **Retire when:** entry `seenIn` drops to zero (Build removed, or re-run Build no longer has it), or maintainer asks. Never for age.
- **Updated Build:** same NB code; its old `seenIn` rows replaced, not added.
- **Versioning:** no per-entry versions. Bank `CHANGELOG.md` one line per applied change + plugin version bump per `docs/route.md`.
- **Scrub:** hard script fail, never reviewer judgement. Listed word left → run stops.
- **Regression guard:** `npm test` bank checks (front matter shape, unique IDs, PAT/TMOD refs resolve, catalog slug, scrub word check) must pass after each refine (incl. fixture `check` of the Template matching evals case). `run --all` only if refine changes bank format (amended by [Template matching evals](10-template-matching-evals.md)).
- **Run:** `delegate_task`, Claude-sales: tag children parallel per new Build → 1 cluster child → 1 review child. Same fallback as Mining pipeline.
