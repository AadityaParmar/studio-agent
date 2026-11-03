# Neome Requirements Studio

## How to talk

For text humans read, in every skill (chat replies, Questionnaires). Agent-to-agent text (subagent prompts, hand-backs between skills) is exempt.

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

## Neome Studio MCP

`neome-studio` MCP (`mcp__neome-studio__*`) reads and edits live Neome Enterprises (forms, spreadsheets, roles, actions, workflows, deploy). The server's own instructions and `schema` tool cover usage.

- Read freely: `list_enterprises`, `list`, `describe`, `schema`, `validate`, `diff_enterprise`, `status`.
- Writes hit the live Enterprise draft. Confirm with user before `add`, `set`, `remove`, `switch_enterprise`, `revert_enterprise`, `deploy_enterprise`.
- Pass `entId` on every call. Omit only after `switch_enterprise`.
- Setup: local scope (`~/.claude.json`), API key in `X-API-Key` header. Keep the key out of git; never write it to `.mcp.json` or repo files. Add with `claude mcp add-json --scope local neome-studio '<config>'`.

## Agent skills

### Issue tracker

Local markdown under `.scratch/<effort>/`. See `docs/agent-conventions.md`.

### Triage labels

Default five roles, set as `Status:` line in issue file. See `docs/agent-conventions.md`.

### Domain docs

Multi-context: `GLOSSARY-MAP.md` → studio `GLOSSARY.md` + per-Enterprise glossaries. See `docs/agent-conventions.md`.
