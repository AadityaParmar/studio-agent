# Close Neomenta-owned Open Items

Type: grilling
Status: resolved
Blocked by: —

## Question

No skill closes Open Items owned by Neomenta (neome-mapping Delivery mismatches, reply-loop "can it do X?"). `questionnaire` exports only Enterprise-owned. New AFK skill `resolve-open-items` (research subagent: catalog, Template bank, studio-ai-docs, MCP `schema`)? Or a step in `studio`? Answer Source type?

## Answer

User, 2026-11-04, yes to all:

1. New user skill `resolve-open-items`: agent closes Neomenta-owned Open Items from catalog, Template bank, `docs/studio-ai-docs/`, MCP `schema` (read-only).
2. Each answer = research note registered as new Source type `NR`; Open Item closes citing it.
3. Can't settle from docs (e.g. OI-58) → stays open, owner Neomenta, note "ask Neome product team". No test writes.
4. Answer changes a resolved Module (e.g. Delivery) → Module needs-revisit.
5. `studio` routes to it when Neomenta-owned Open Items are open.

## Comments
