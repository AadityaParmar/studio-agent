# 21 — Repo + plugin scaffold, pack lint, CI

**What to build:** A Consultant clones the team repo, trusts the marketplace once, and `neome-studio` is enabled with all 11 skills in the slash menu (stubs for now). `npm ci` installs the pinned Mermaid CLI. The maintainer runs `npm test` (and CI on push) and the pack lint (`check`) passes. Spec: [spec.md](../spec.md) — Packaging and repo, Skills, Deterministic engine (`check`), Upstream pins.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Root project settings register the repo as local marketplace, enable `neome-studio`, allow `npx mmdc` and git
- [x] Marketplace manifest + plugin folder with 11 skills (6 user-invoked, 5 model-invoked), each with valid front-matter and the How to talk block verbatim
- [x] Package manifest + lock pin `@mermaid-js/mermaid-cli` exact; `test` script defined
- [x] Gitignore covers `enterprises/*/confidential/` and `node_modules/`; empty `enterprises/` (no demo Enterprises)
- [x] Short root CLAUDE.md (How to talk, terms per GLOSSARY.md, facade rules, never assume, one Module per session, start with `studio`, skills own git)
- [x] Engine CLI exists with `check`: How to talk verbatim, front-matter valid, `upstream` ⇒ `upstreamVersion`, upstream MIT notice present when any `upstream`
- [x] Cloned skills carry `upstream` + `upstreamVersion` pins; MIT notice shipped in plugin
- [x] `check` fails with a clear message on each rule break (fixture-tested)
- [x] GitHub Action runs `npm test` on pushes touching plugin or fixtures

## Comments

- Done 2026-10-29. mmdc pinned 12.0.0, `yaml` 2.9.1 for front-matter. Canonical How to talk block in plugin `reference/how-to-talk.md`; `check` compares against it. `npm test` = engine tests + live lint of the plugin. User skills set `disable-model-invocation: true`. `skills-main/` and `example/` gitignored (not shared). Manifests pass `claude plugin validate`. Not yet verified by hand: trust prompt + plugin enabled on a fresh clone (no git repo/remote yet). npm audit: 2 low (katex via mermaid-cli), left as is.
