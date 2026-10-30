# Route: how to change Neome Requirements Studio after v1

Look up what you want to change → touch these files → run these checks → bump these versions. Baseline: [v1/](v1/README.md) (tag `v1`). Docs index: [README.md](README.md). Terms per [GLOSSARY.md](../GLOSSARY.md).

---

## 1. Process for any change

1. **New effort folder:** `.scratch/<effort-slug>/` with `map.md` + `issues/NN-<slug>.md` (see [agent-conventions.md](agent-conventions.md)). Never reopen v1 tickets in `docs/v1/history/`: frozen.
2. **Decide first:** grilling ticket → `## Answer`. If it changes a v1 decision, name it (`supersedes D08`). Never edit `docs/v1/`; the next release writes `docs/v<N>/decisions.md` with the new final state.
3. **Build:** one ticket per slice. Engine change → test first (`neome-studio/engine/test/`).
4. **Gate** (D18): `npm test` green always. Skill text change → also evals (`node neome-studio/evals/run.mjs run anglo-gulf-crm tiny-synthetic`) + maintainer spot-check ~10 matches before merge to `main`.
5. **Release:** bump versions (section 4), new `docs/v<N>/`, move `.scratch/<effort-slug>/` → `docs/v<N>/history/`, tag `v<N>`.

## 2. Invariants (break only by explicit decision)

- How to talk lives only in root `CLAUDE.md`, for text humans read; no skill or doc copies it (`check` enforces for skills).
- Facade: humans touch only `inputs/`, `confidential/`; views (`brd/`, `prototypes/`, `questionnaires/`) are rebuilt, never read back.
- Markdown in `_agent/` = truth. JSON built, never hand-edited.
- Every fact cites a Source or is `(proposed, to confirm)`. Gaps → Open Items.
- IDs never reused. Nothing deleted (withdrawn / merged-into).
- Signed BRD versions never change.
- Skills own git. Building blocks never touch git.
- Terms exactly per `GLOSSARY.md`.

## 3. "I want to change X" → where

Paths under `neome-studio/` unless rooted.

| Change | Touch | Also update | Check |
|---|---|---|---|
| **A term / new concept** | `GLOSSARY.md`, `GLOSSARY-MAP.md` | every skill text using it; `CLAUDE.md` if rule | `npm test`, grep old word |
| **Root agent rules** | `CLAUDE.md` | README Rules of thumb | — |
| **Consultant docs** | `README.md`, `neome-studio/HOW-TO-RUN.md` | `neome-studio/README.md` (maintainer) | `engine/test/readmes.test.mjs` |
| **Add / rename a skill** | `skills/<name>/SKILL.md` (front-matter) | `studio` skill table (if user skill), `engine/status.mjs` step lines, `reference/next-session.md`, READMEs, D02 | `check`, `studio.test.mjs` |
| **Skill behaviour (text)** | `skills/<name>/SKILL.md` + `references/` | — | `npm test` + evals |
| **Question bank / grilling topics** | `skills/grill-module/references/question-bank.md`, `grill-shapes.md` | spec template if new section | evals |
| **Module spec sections / Requirement block** | `skills/write-module-spec/references/spec-template.md`, `spec-example.md` | `engine/brd/read-engagement.mjs`, `engine/spec-check.mjs`, schema, `engine/test/fixtures/` | `write-module-spec.test.mjs`, `build-brd.test.mjs` |
| **Neome mapping / catalog / Delivery rules** | `skills/neome-mapping/SKILL.md`, `reference/neome-app-catalog.md`, `reference/neome-app-catalog-slugs.json` | validator slug check | `build-brd.test.mjs`, evals |
| **BRD data schema** | `skills/build-brd/references/brd-data.schema.json` + `brd-data-schema.md` | `read-engagement.mjs`, `validate.mjs`, fixtures, `schemaVersion` (section 4), phase-2 team | `build-brd*.test.mjs` |
| **Validation rule / error class** | `engine/brd/validate.mjs` | `skills/build-brd/references/problems.md` | `build-brd.test.mjs` |
| **BRD look / sections / order** | `engine/brd/render-html.mjs`, `page.css`, `page.js` | D05, eyeball checklist in `evals/README.md` | `brd-page.test.mjs` + open in Chrome + print A4 |
| **Diagrams** | `engine/brd/diagrams.mjs` | — | `brd-diagrams.test.mjs` (byte-identical SVG, CSS leak test) |
| **Mermaid CLI version** | `package.json` + lock, `MERMAID_CLI_PIN` in `engine/brd/diagrams.mjs` | README setup | `brd-diagrams.test.mjs` (pin equality) |
| **Change log / release rules** | `engine/brd/changelog.mjs`, `build-brd.mjs` | D12 | `brd-release.test.mjs` |
| **Sign-off rules** | `engine/brd/signoff.mjs` | D12, `skills/build-brd/SKILL.md` | `brd-signoff.test.mjs` |
| **Across all Modules (GEN topics)** | `read-engagement.mjs`, `validate.mjs`, `signoff.mjs` (`uncoveredTopics`), `engine/ingest.mjs` (general.md template) | schema enum, D19 | `brd-general-plan.test.mjs` |
| **Implementation plan** | `read-engagement.mjs`, `validate.mjs`, review-draft plan skeleton | D16 | `brd-general-plan.test.mjs` |
| **Prototype look / tabs** | `engine/prototype/render.mjs`, `proto.css`, `proto.js` | `docs/v1/history/ui-reference/tokens.md` | `build-prototype.test.mjs` + Chrome |
| **Prototype data shape** | `engine/prototype/model.mjs`, `skills/build-prototype/references/prototype-data.md` | — | `build-prototype.test.mjs` |
| **Questionnaire format** | `engine/questionnaire.mjs`, `engine/questionnaire/render.mjs`, `qn.css`, `skills/questionnaire/references/questionnaire-shapes.md` | D11 | `questionnaire.test.mjs` |
| **Reply loop rules** | `engine/reply.mjs`, `skills/ingest/references/reply-loop.md` | D11 | `reply.test.mjs` |
| **Source types / ID prefixes** | `skills/ingest/references/draft-shapes.md`, `engine/ingest.mjs` | schema Source regex | `ingest.test.mjs` |
| **Folder layout / paths** | `engine/ingest.mjs` (init), all readers, every SKILL.md naming paths | D03/D13, READMEs, `CLAUDE.md` | full `npm test` |
| **Module lifecycle (claim, merge, rename…)** | `engine/modules.mjs`, `reference/map-logic.md` | D03 | `resolve-module.test.mjs`, `review-draft.test.mjs` |
| **Git / lock protocol** | `reference/git-protocol.md`, `engine/ingest.mjs` (`lock`/`unlock`) | every user SKILL.md | `resolve-module.test.mjs` (bare remote) |
| **Glossary lifecycle** | `engine/glossary.mjs`, `skills/enterprise-glossary/SKILL.md` | keep glossary reader in sync with `read-engagement.mjs` | `glossary.test.mjs` |
| **Router / status / next step** | `engine/status.mjs`, `engine/setup-check.mjs`, `skills/studio/SKILL.md`, `reference/next-session.md` | D44 | `studio.test.mjs` |
| **Pack lint rules** | `engine/check.mjs` | — | `check.test.mjs` |
| **Eval cases / scorecard / thresholds** | `evals/<case>/`, `evals/lib/scorecard.mjs`, `evals/prompts/`, `evals/README.md` (threshold + reason) | D18 | `evals.test.mjs`, `run.mjs check` |
| **Upstream skills-main bump** | `node neome-studio/maintainer/upstream-check.mjs diff neome-studio` → per skill accept/reject | `upstreamVersion` in front-matter | D20 gate |
| **CI** | `.github/workflows/checks.yml`, `package.json` `test` | — | push |

## 4. Versions to bump

| What | Where | When |
|---|---|---|
| Plugin | `neome-studio/.claude-plugin/plugin.json` `version` | each release (semver) |
| BRD data schema | `brd-data.schema.json` `schemaVersion` const + `brd-data-schema.md` | additive = minor; breaking = major (phase 2 refuses unknown major; tell phase-2 team) |
| Mermaid CLI | `package.json` + lock + `MERMAID_CLI_PIN` | only on purpose; diagrams shift |
| Upstream pins | SKILL.md `upstreamVersion` | after upstream-check |
| Docs | new `docs/v<N>/`, git tag `v<N>` | each release |

## 5. Open items carried from v1

- Real Neome approval screens → Prototype approval UI (now guessed).
- Not-verified list: [v1/build.md](v1/build.md#not-verified-at-v1-known-risks).
- Rollout: shadow one real Engagement before team use.
- Out of scope, possible future efforts: multi-language BRDs, RFP-response genre, pricing, phase-2 build mapping.
