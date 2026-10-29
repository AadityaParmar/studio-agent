# 27 — BRD Sign-off mode

**What to build:** `--mode sign-off --signers ... --evidence <SourceID>` stamps an existing released version once with two signers and an evidence Source, blocked unless the Engagement is complete. A signed version never changes; the next build clears `proposed` on everything it contained. Spec: Release and Sign-off rules, stories 124–130.

**Blocked by:** 26 — BRD release mode + change log

**Status:** resolved

- [x] Hard preconditions: all Modules resolved or merged; every GEN topic covered; no Must Requirement with priority TBC or scope open — each blocked with clear message
- [x] Evidence Source must exist in the register
- [x] Sign-off block lists OIs open at sign-off and proposed items accepted
- [x] Re-render once, then frozen: re-run on a signed version refuses
- [x] Next build clears `proposed` on everything in the signed version; glossary terms shown in it become agreed
- [x] Later changes go into a new draft-for-review version; superseded derived, not stored
- [x] Fixtures: each blocked case; signed then new build clears proposed

## Comments

- Done 2026-10-29. `build-brd <eng> --mode sign-off --signers "<name> | <role> | <YYYY-MM-DD>" "<name> | <role> | <YYYY-MM-DD>" --evidence <SourceID>` in `neome-studio/engine/build-brd.mjs`. New `engine/brd/signoff.mjs` (`signOffBlockers`, `proposedItems`, `signOffBlock`, `applySignedOff`, `uncoveredTopics`; `validate.mjs` release warning now reuses `uncoveredTopics`). `read-engagement.mjs` exports `readRegister`. Renderer: sign-off block lists Evidence, "Open at sign-off", "Accepted on sign-off"; signed page shows signer name/role/date instead of empty lines; change log shows each entry's status + derived "superseded"; chips read "proposed, accepted on sign-off" on a signed page. Docs: `brd-data-schema.md` new "Sign-off" section + `sign-off` error class; eyeball line in `evals/README.md`. Tests: new `engine/test/brd-signoff.test.mjs` (18): sign v1, block contents, page, re-run refused + files byte-identical, next preview clears proposed (glossary agreed), v2 release copies signed entry + changed proposal stays proposed, superseded derived, sign v2, 5 blocked fixtures (Module claimed/open, uncovered topic, priority TBC, Must scope Open, evidence not in register), no released version, arg errors, units. Old "not built yet" test in `build-brd.test.mjs` replaced. `npm test`: 156 pass.
- Small choices (my call; revisit if wrong):
  - Signs the **latest** released version only (no version flag). Refuses if none, or if already signed off.
  - Signers: Enterprise first, then Neomenta; each `name | role | date`, date valid ISO. `--signers` / `--evidence` required for sign-off, refused in other modes; `--summary` refused in sign-off.
  - Preconditions checked on the snapshot `v<N>.json` (what the Enterprise read), not the markdown. "No Must Requirement with priority TBC or scope open" read as: any live Requirement (Module + GEN) with priority TBC blocks; live Must with scope `open` blocks (`neome-tbc` does not). Topic coverage = same rule as release warning. Errors class `sign-off`; missing evidence = `missing-source`. Exit 1, nothing written.
  - Stamp: `engagement.status`, the change-log entry for N `status: signed-off` (per ticket 26 note), `signOff` added, evidence Source added to snapshot `sources[]` if missing. `engagement.date` and entry date stay release date; signer dates carry sign-off dates.
  - `acceptedProposed` refs = path by stable key, e.g. `modules[QUO].requirements[QUO-02]`, `glossary[Quote]`, `plan.phases[uat]`; text-only objects by index (`modules[LEAD].exceptions[0]`). Withdrawn Requirements, merged Modules, disputed terms not listed. Page shows Requirement IDs, other refs raw.
  - After sign-off: every preview/release build reads the latest signed snapshot and clears `proposed` only on accepted items whose content (all but `sources`/`proposed`) is unchanged; they gain the evidence Source (keeps them cited). Changed ones stay proposed (new proposal). Markdown is **not** rewritten (engine stays read-only on `_agent/`); skills (ticket 37) may want to sync `(proposed, to confirm)` / glossary `_Status_` in markdown later.
  - Superseded = entry version < version shown; display only.
- Not verified: A4 print of signed block and lists, Safari/Firefox, real signed evidence flow via `ingest` (ticket 28/36). Seen: full `npm test` sometimes fails ~25–30 tests with `mmdc-failed` (puppeteer Chrome launch) when test files run in parallel under load (1 of 6 runs); each file alone passes. Pre-existing risk, made a bit worse by the extra mmdc runs here. Not changed; fix option: `--test-concurrency=2` in `package.json` test script or a launch retry in `diagrams.mjs`.
