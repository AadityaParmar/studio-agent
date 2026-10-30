# Neome Requirements Studio

## How to talk

- Simple English. No fancy words. Short.
- Be extremely concise. Sacrifice grammar for concision.

## Rules

- Use terms exactly as in `GLOSSARY.md`.
- Facade: humans touch only `enterprises/<ent>/inputs/` and `confidential/`. Never hand-edit `_agent/`. Never edit views (`brd/`, `prototypes/`, `questionnaires/`); rebuild them.
- Never assume. Gaps become Open Items.
- One Module per session.
- Unsure what next? Run `/neome-studio:studio`.
- Changing the plugin itself? Start at `docs/README.md`.
- Skills own git. Don't commit by hand mid-skill.

## Agent skills

### Issue tracker

Local markdown under `.scratch/<effort>/`. See `docs/agent-conventions.md`.

### Triage labels

Default five roles, set as `Status:` line in issue file. See `docs/agent-conventions.md`.

### Domain docs

Multi-context: `GLOSSARY-MAP.md` → studio `GLOSSARY.md` + per-Enterprise glossaries. See `docs/agent-conventions.md`.
