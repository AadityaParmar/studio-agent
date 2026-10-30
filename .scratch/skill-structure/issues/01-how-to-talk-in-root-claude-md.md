# How to talk: one home in root CLAUDE.md

Status: resolved
Type: grilling

Supersedes v1 scope line "Every skill carries the How to talk block verbatim" (`docs/v1/decisions.md`, Scope).

## Answer

- Block lived in 11 skills, 2 driver prompts, 3 dev docs, plus root `CLAUDE.md`. Root `CLAUDE.md` loads every session, so copies were duplication.
- Now: root `CLAUDE.md` only. Scoped to text humans read (chat, Questionnaires). Agent-to-agent text exempt.
- `reference/how-to-talk.md` deleted. `check` now fails a skill that carries its own `## How to talk`.
- Evals keep it: `evals/lib/workspace.mjs` copies root `CLAUDE.md` into clones.
- Next release writes this into `docs/v<N>/decisions.md`.
