# Neome Studio MCP as Build source

Type: research (AFK)
Status: resolved
Blocked by: —

## Question

Can the `neome-studio` MCP (read-only: list_enterprises, list, describe, schema, status) give a whole Neome Build compactly enough to replace or beside the raw JSON? Facts: what list/describe return, size per call, calls needed for one Build, any full-export call. Read-only. No writes.


## Comments

Gist (2026-11-03), details: `research/03-mcp-as-source.md`
- list_enterprises: 5 ents, tiny rows (id, name, state flags). describe ent gives counts per kind.
- list = flat {id,name,type}; describe = shallow (form shows counts, not fields). ~0.2-0.8k chars each.
- No whole-ent export. One mid-size Build (17 forms, 11 sheets) ~ 800-1000 calls, ~300k chars (estimate).
- Verdict: complement. Raw JSON stays source; MCP for live lookup, schema, drift check. Ask platform for export call.

## Answer

Complement, not replacement. No full export; ~800–1000 shallow calls per mid-size Build. Raw JSON stays the stored source; MCP for live lookups, schema, drift checks. Ask platform team for one export call (would flip verdict). Detail: [research/03-mcp-as-source.md](../research/03-mcp-as-source.md).
