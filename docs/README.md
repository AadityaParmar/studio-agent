# Developer docs: Neome Requirements Studio

Start here to change the `neome-studio` plugin. Consultants running the plugin read the [repo README](../README.md) instead. Terms per [GLOSSARY.md](../GLOSSARY.md).

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

## Read in this order

1. [route.md](route.md): "I want to change X" → files to touch, checks, versions to bump. Process for any change.
2. [v1/decisions.md](v1/decisions.md): every design decision (D01–D44), final state.
3. [v1/build.md](v1/build.md): what was built where, build-time calls, known risks.
4. [../neome-studio/README.md](../neome-studio/README.md): plugin layout, skills, origins, engine commands, maintainer tools.
5. [agent-conventions.md](agent-conventions.md): issue tracker, triage labels, domain docs for engineering skills.

## All dev docs

| Doc | What |
|---|---|
| [route.md](route.md) | change map + release process |
| [agent-conventions.md](agent-conventions.md) | `.scratch/` tickets, labels, glossary rules |
| [v1/README.md](v1/README.md) | v1 release summary |
| [v1/decisions.md](v1/decisions.md) | design decisions |
| [v1/build.md](v1/build.md) | build notes, not-verified list |
| [v1/history/](v1/history/) | frozen v1 effort: [map](v1/history/map.md), [spec](v1/history/spec.md), [issues 01–45](v1/history/issues/), throwaway prototypes, research, UI tokens, scraped sources, 260-brand trial |
| [../neome-studio/README.md](../neome-studio/README.md) | maintainer doc (tested by `readmes.test.mjs`; keep in place) |
| [../neome-studio/HOW-TO-RUN.md](../neome-studio/HOW-TO-RUN.md) | Consultant step-by-step, zero to Sign-off |
| [../neome-studio/evals/README.md](../neome-studio/evals/README.md) | evals: run, scorecard, thresholds (parsed by `scorecard.mjs`), eyeball checklist |
| [../neome-studio/maintainer/upstream-check.md](../neome-studio/maintainer/upstream-check.md) | upstream skills bump driver |
| [../neome-studio/reference/](../neome-studio/reference/) | runtime refs skills load: how-to-talk, git protocol, map logic, next session, Neome App catalog |

Docs inside `neome-studio/` stay there: tests and the engine read them by path.

## Repo layout

```
CLAUDE.md, GLOSSARY.md, GLOSSARY-MAP.md   agent rules + studio terms
README.md                                 Consultant guide
docs/                                     dev docs (this folder)
.scratch/<effort>/                        live work tickets (created on demand)
.claude/, .claude-plugin/                 marketplace + plugin enable
.github/workflows/checks.yml              CI: npm test
neome-studio/                             the plugin
  skills/<skill>/SKILL.md + references/   11 skills (6 user, 5 building blocks)
  engine/                                 CLI the skills call (cli.mjs) + test/ + fixtures
  reference/                              shared runtime refs
  evals/                                  eval runner, cases, results
  maintainer/                             upstream-check
enterprises/<ent>/                        Enterprise work (inputs/, confidential/ by humans; rest by skills)
```

Local-only, gitignored: `skills-main/` (old upstream snapshot, never read), `example/` (raw sample files), `node_modules/`.

## Commands

| Do | Run |
|---|---|
| All tests + pack lint | `npm test` |
| Pack lint only | `node neome-studio/engine/cli.mjs check neome-studio` |
| Evals (skill text change) | `node neome-studio/evals/run.mjs run anglo-gulf-crm tiny-synthetic` |
| Upstream diff | `node neome-studio/maintainer/upstream-check.mjs diff neome-studio` |
