# `neome-studio` plugin (maintainer doc)

The Claude Code plugin behind the Neome Requirements Studio. Consultants read the [repo README](../README.md); this page is for the plugin maintainer. Terms per [GLOSSARY.md](../GLOSSARY.md).

## Layout

```
neome-studio/
  .claude-plugin/plugin.json    plugin manifest (marketplace: ../.claude-plugin/marketplace.json)
  skills/<skill>/SKILL.md       11 skills (+ references/ per skill)
  reference/                    shared: How to talk, git protocol + lock, map logic, Neome App catalog, fonts
  engine/                       deterministic CLI the skills call; tests + fixtures in engine/test/
  maintainer/                   upstream-check (script + driver prompt)
  evals/                        eval runner (run.mjs + driver eval.md), Eval cases, results/, eyeball checklist
  LICENSE-upstream              MIT notice for text cloned from upstream
```

Consultants get the plugin by cloning the repo: `.claude/settings.json` registers the repo as the `neome` marketplace (local directory) and enables `neome-studio`. The plugin loads in place, so a `git pull` is the update; no version bump needed.

## Skills

Six user-invoked skills (`disable-model-invocation: true`): `studio`, `ingest`, `review-draft`, `resolve-module`, `questionnaire`, `build-brd`. The Consultant README covers them. `studio` names only these six.

### Building blocks

Model-invoked. Also visible in the slash menu, but `studio` never points at them. They run no git; the calling skill commits what they hand back. Exception: `enterprise-glossary` pulls before it writes and commits `GLOSSARY.md` right after (no Engagement lock).

| Skill | Called by | Does |
|---|---|---|
| `grill-module` | `resolve-module` | Grills one Module, live or from Inputs, against the question bank until every topic is answered, N/A or an Open Item |
| `write-module-spec` | `resolve-module` | Writes the Module spec (13 fixed sections), gets section 12 from `neome-mapping`, runs the done check (`spec-check`) |
| `neome-mapping` | `write-module-spec` | Writes spec section 12: indicative Neome App + Delivery from the catalog reference and Delivery heuristics |
| `build-prototype` | `resolve-module` | Writes `prototype-data.json`; the engine renders the Prototype HTML |
| `enterprise-glossary` | `ingest`, `review-draft`, `grill-module`, `write-module-spec`; `build-brd` agrees terms after Sign-off | Keeps `enterprises/<ent>/_agent/GLOSSARY.md` in the Enterprise's own words: add, dispute, settle, split, rename, agree |

### Origins

Cloned skills are copied from upstream ([mattpocock/skills](https://github.com/mattpocock/skills)) and adapted. Upstream is never edited in place; `skills-main/` is a local snapshot, not part of the shared repo.

| Skill | Upstream |
|---|---|
| `studio` | `ask-matt` (diverged: `upstream-check` skips it) |
| `ingest` | new (modelled on wayfinder charting) |
| `review-draft` | new (grilling rounds) |
| `resolve-module` | new (modelled on wayfinder work-through) |
| `questionnaire` | `to-questionnaire` |
| `build-brd` | new |
| `grill-module` | `grilling` + `domain-modeling` + `grill-with-docs` |
| `write-module-spec` | `to-spec` |
| `neome-mapping` | new (catalog reference) |
| `build-prototype` | `prototype` |
| `enterprise-glossary` | `domain-modeling` (glossary only, no ADRs) |

The pin lives only in each cloned skill's front-matter: `upstream` (path or list of paths), `upstreamVersion`, optional `upstreamDiverged: <reason>`. New and "modelled on" skills carry no `upstream`. `LICENSE-upstream` must ship while any `upstream` remains; `check` enforces it. Map logic (frontier, claim, close) lives in [reference/map-logic.md](reference/map-logic.md); there is no wayfinder clone.

### Changing a skill

- Keep the How to talk block verbatim ([reference/how-to-talk.md](reference/how-to-talk.md)) and valid front-matter. `check` fails otherwise.
- Use terms exactly as in GLOSSARY.md. Keep the facade: humans touch only `inputs/` and `confidential/`; agent files under `_agent/`; views rebuilt by the engine.
- Git order and the Engagement lock: [reference/git-protocol.md](reference/git-protocol.md).
- Run `npm test`. Skill text change → also evals + your approval before merge to `main` (see [Gate](#gate)).

## Engine

`node neome-studio/engine/cli.mjs <command>`, from the repo root. Skills call it; Consultants never run it by hand. Each module's header documents its arguments and output lines. Exit 0 ok, 1 refused / errors, 2 bad usage.

| Command | Used by |
|---|---|
| `setup-check`, `status` | `studio` (read-only) |
| `init-engagement`, `add-source`, `reply` | `ingest` (`add-source` also `grill-module`, `review-draft`) |
| `lock`, `unlock` | `ingest`, `review-draft`, `build-brd`, `resolve-module` (shared edits); `studio` clears a stale lock with `unlock --force` |
| `module` | `review-draft`, `resolve-module`, `ingest` (revisit), `studio` (stale claim) |
| `glossary` | `enterprise-glossary`, `build-brd` (after Sign-off) |
| `spec-check` | `write-module-spec`, `build-prototype`, `ingest` (read-only; `module close` runs it too) |
| `build-prototype` | `build-prototype`; `ingest` rebuilds a view after a reply |
| `new-questionnaire`, `export-questionnaire` | `questionnaire` |
| `build-brd`, `mmdc-check` | `build-brd`; `ingest`, `review-draft`, `grill-module` validate with `build-brd --check` (writes nothing) |
| `check` | `npm test`, maintainer (read-only pack lint) |

`setup-check` runs before `npm ci` (commands load lazily). Read-only commands: `setup-check`, `status`, `mmdc-check`, `spec-check`, `check`, and any `build-brd --check`.

## Maintainer tools

Not skills. `studio` never shows them.

| Tool | Run | When |
|---|---|---|
| Tests + pack lint | `npm test` (engine tests, then `check neome-studio`) | Before every push. CI runs it too ([.github/workflows/checks.yml](../.github/workflows/checks.yml)) on pushes touching the plugin or the package files |
| `upstream-check` | Tell Claude: "follow `neome-studio/maintainer/upstream-check.md`". Script: `node neome-studio/maintainer/upstream-check.mjs diff neome-studio [--to <version>]` / `pin …` | On demand: about quarterly, or when upstream releases. Needs network. Works on branch `upstream-<to>`; you accept or reject each re-adapt; unchanged or rejected → pin-only bump; never auto-merges |
| Eval runner | `node neome-studio/evals/run.mjs run --all`, or tell Claude: "follow `neome-studio/evals/eval.md`". Needs `claude` logged in; costs tokens; never in `npm test`/CI. Scorecard + thresholds: [evals/README.md](evals/README.md). Writes `neome-studio/evals/results/` | Skill text change, before merge to `main` |
| Eyeball checklist | [evals/README.md](evals/README.md) | Any change to a BRD, Prototype or Questionnaire template |

Pending: upstream release 1.3.2 is out and waits for an `upstream-check` run (`grill-module` changed upstream).

### Eyeball checklist

Look is not auto-scored. Before merging a template change, build the fixture outputs and tick every line in [evals/README.md](evals/README.md):

- **BRD look**: `brd/` fixtures `resolved` and `in-progress`, preview, release twice, sign-off; screen, script off, A4 print.
- **Questionnaire look**: `questionnaire/after-questionnaire` fixture, `export-questionnaire`; HTML print and TXT paste.
- **Prototype look**: `build-prototype/after-prototype` fixture, `build-prototype … QUO`; app, scenarios, mobile, trace.

Always build in a temp copy of the fixture (`engine/test/fixtures/`), never in place.

### Gate

- Skill text change → `npm test` + evals (`node neome-studio/evals/run.mjs run --all` passes) + maintainer approval (spot-check ~10 matches, ticked in the result file) before merge to `main`. `main` = what Consultants pull.
- Pin-only bump → `npm test` only.
- Template look change → `npm test` + eyeball checklist.
