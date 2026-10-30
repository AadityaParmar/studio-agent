# 15: Consultant onboarding

Type: grilling
Status: resolved
Blocked by: None

## Question

What does a new Consultant need to install and read to run the pack? Decide: repo-root CLAUDE.md/AGENTS.md content, the final README (from README-draft.md), setup steps (Claude Code, plugin install, Node + mermaid-cli `mmdc` pinned per ticket 06, git and gitignored `confidential/`), and a first-run walkthrough (create Enterprise, start Engagement, run ingest).

## Constraints from earlier tickets

- From ticket 02: router skill is `studio`; draft README in README-draft.md.
- From ticket 06: `mmdc` pinned, needed for build-brd.
- From ticket 13: humans only touch `inputs/`, `confidential/` and read the view folders.

## Answer

Grilled with the Consultant: git flow, concurrency and setup level asked; the rest are recommended defaults, accepted.

**Repo root (the shared private repo from the map Notes):**

```
.claude/settings.json      marketplace = this repo (local dir); enables neome-studio; allows `npx mmdc`, git
.claude-plugin/marketplace.json
neome-studio/              the plugin (skills + shared reference files)
  README.md                maintainer doc: building blocks, skills-main origins table
enterprises/<ent>/...      per tickets 03 + 13
package.json + lock        pins @mermaid-js/mermaid-cli (exact version, ticket 06)
.gitignore                 enterprises/*/confidential/, node_modules/
CLAUDE.md                  agent rules (below)
README.md                  Consultant guide (below)
```

Decisions:
- **Claude Code only.** No AGENTS.md. One root `CLAUDE.md`.
- **Plugin install = clone the repo.** `.claude/settings.json` registers the repo as a local marketplace and enables `neome-studio`; Claude Code asks once to trust it. Plugin updates arrive with `git pull`. No separate install step.
- **mmdc:** local, not global. `npm ci` at repo root installs the pinned version; `build-brd` calls `npx mmdc` and fails clearly if missing (ticket 06).
- **Git flow: skills own git.** Every user-invoked skill pulls at start and commits + pushes at end with a generated message (`<skill>: <ent>/<slug> <what>`). The Consultant never types git. Push or pull failure (conflict, no network) → skill stops and tells the Consultant what to do; it never force-pushes. Model-invoked blocks don't touch git; their parent skill does.
- **Concurrency: per-Module claim.** Several Consultants may work one Engagement. `resolve-module` claims by committing + pushing the ticket's `status: claimed` (with `claimedBy`) before any work; push rejected = someone else claimed, pick another. `ingest`, `review-draft` and `build-brd` touch shared files, so they take an Engagement lock: a `lock:` line (who, skill, since) in `_agent/map.md`, pushed first, cleared at end. `studio` shows locks and claims, and can clear a stale lock after asking.
- **Setup level: some terminal comfort.** README checklist, no setup script. `studio` checks prerequisites on every run (git remote reachable, `node_modules` present, `npx mmdc --version` matches pin, Claude Code plugin enabled) and says what's missing.
- **Root `CLAUDE.md` (short, agent-facing):** the "How to talk" block; terms per GLOSSARY.md; facade rules from ticket 13 (humans touch only `inputs/`, `confidential/`; never hand-edit `_agent/`, never edit views — rebuild them); never assume, gaps become Open Items; one Module per session; start with `/neome-studio:studio` when unsure; git is done by skills, don't commit by hand mid-skill.
- **Final README** = README-draft.md trimmed for Consultants, moved to repo root. Sections, in order: what it is (3 lines) · Setup (checklist: Claude Code, Node LTS, git + GitHub access, clone, `npm ci`, open in Claude Code, trust, run `studio`) · First run · The cycle at a glance · Skills you run (6) · Where things live (facade tree) · Rules of thumb · Troubleshooting (mmdc missing, push rejected, stale lock). The building-blocks table and "Where each skill comes from" move to `neome-studio/README.md`.
- **First-run walkthrough** (README section, uses the Consultant's real Inputs, no demo Enterprise):
  1. Open the repo in Claude Code; run `/neome-studio:studio` (checks setup).
  2. Drop Inputs into `enterprises/<ent>/inputs/` (create the folder; confidential ones into `confidential/`). New Enterprise = new folder name.
  3. Run `/neome-studio:ingest`, naming the Enterprise and Engagement slug. It creates `_agent/`, glossary, Engagement map, Sources, draft Modules.
  4. New session: `/neome-studio:review-draft`.
  5. Then `/neome-studio:studio` tells you which Module to `resolve-module` next.
  Demo/fixture Enterprises, if any, are ticket 18's call.

Changes to earlier tickets:
- **02 / README-draft:** every user-invoked skill gains the git pull/commit/push wrapper; `studio` gains the setup check and shows locks/claims.
- **03 / 13:** Module `ticket.md` front-matter gains `claimedBy`; Engagement `_agent/map.md` gains an optional `lock:` line. Repo root gains `.claude/`, `.claude-plugin/`, `package.json`, `CLAUDE.md`, `README.md`.
