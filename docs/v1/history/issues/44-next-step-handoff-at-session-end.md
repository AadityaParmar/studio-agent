# 44: Next-step handoff at session end

Type: grilling
Status: resolved
Blocked by: None

## Question

New requirement from the Consultant: when a session ends, the skill shows the next step for the next session as `skill [path]` plus a short description. Decide: which skills do it, where the next step comes from (each skill's own "Next:" line vs engine `status` `step` lines), what `[path]` is, and the exact format.

## Constraints from earlier tickets

- 02 / 38: only the 6 user skills are ever pointed at; building blocks never.
- 38: `ENGINE status <eng>` already prints `step | <skill> | <why>` lines (read-only, ordered most urgent first).
- 15: one Module per session; skills own git, so the handoff prints after End (push).

## Answer

Decided with the Consultant 2026-10-29.

- **Who:** all 6 user skills, as the very last thing, after End (push). Also on early stops (nothing to do, empty work list). Building blocks never (their parent does it).
- **Source:** engine, not hand-written. Skill runs `ENGINE status <eng> --who "<who>"` and relays its `step` lines. Same logic as `/neome-studio:studio`, so no drift. Hand-written "Next:" bullets in ingest, review-draft, resolve-module, questionnaire, build-brd reports are replaced by this.
- **`[path]`:** runnable args = repo-relative Engagement path, plus Module prefix for `resolve-module`. Engine `step` line gains an args cell: `step | <skill> | <args> | <why>`.
- **Format:** max 3, most urgent first; `<why>` one short line:
  ```
  Next session:
  1. /neome-studio:resolve-module enterprises/260-brand/engagements/field-ops ENQ — next Module (one per session)
  2. /neome-studio:questionnaire enterprises/260-brand/engagements/field-ops — 2 Enterprise Open Items to chase
  3. /neome-studio:build-brd enterprises/260-brand/engagements/field-ops — preview any time
  ```
- **Edge cases (my call):** lock held by someone else → append "(waits for <holder>'s lock)" to lock-taking skills. Push failed → still show, note "from local copy". `done` → "Nothing next: BRD v<N> signed off." No Engagement yet → `/neome-studio:ingest` with no args.
- **Follow-on:** every user skill must accept `<engagement-path> [<PREFIX>]` as args (else ask, as now), so the line is copy-paste runnable.
- Build: [45: Next-step handoff at session end](45-next-step-handoff-build.md). Spec stories 151–153.
