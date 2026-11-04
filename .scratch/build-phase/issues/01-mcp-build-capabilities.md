# MCP build capabilities

Type: research
Status: resolved
Blocked by: —

## Question

What can the `neome-studio` MCP do for a build, and what not? Check: install a Neome App (store items / plugins), create or pick a sandbox Enterprise, `deploy_enterprise` / `revert_enterprise` / `deploy_status` semantics, `diff_enterprise` output, `validate` coverage, batch writes, cost per call. Sources: MCP `schema`, `docs/studio-ai-docs/`, read-only calls on a test Enterprise. No writes.

## Answer

Full notes: [research/01-mcp-build-capabilities.md](../research/01-mcp-build-capabilities.md) (read-only calls, 3 test Enterprises).

- MCP cannot: install a Neome App, see if one is installed, create / clone an Enterprise, take the edit lock (Studio only), add users / assign roles to people, import row data, set deploy var values (`requiredOnDeploy`), set plugin config. Plugin `add` = import a published plugin snapshot (unverified).
- Pick Enterprise by `entId`, never name (names repeat). `switch_enterprise` is per API key, shared across sessions.
- Writes: one resource per call, one at a time per Enterprise, each checked on write. `validate` = whole draft, setup/ref errors.
- `deploy_enterprise` async (`jobKey`), needs edit lock + 0 errors; poll `deploy_status`. `revert_enterprise` drops the whole draft to last deploy; refuses if never deployed → new Enterprise has no undo.
- `diff_enterprise` = op/kind/name + changed property names, no values.
- `schema` needs `kind`; ask one variant at a time (plugin schema ~242k chars).

## Comments

Research: [research/01-mcp-build-capabilities.md](../research/01-mcp-build-capabilities.md)
