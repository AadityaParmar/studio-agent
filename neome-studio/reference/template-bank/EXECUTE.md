# Execute sections: MCP build guide

How to write and use the `## Execute` section of a Template bank entry (README § Execute). Agent-facing.

Learnt from `docs/studio-ai-docs/` (live `schema` tool output + Studio MCP system prompt). Detail per kind:

- `execute-guide/forms-layouts.md`: form, composite, every field type, formLayout, gridLayout, spreadsheetLayout, layoutUser.
- `execute-guide/logic-sheets.md`: var, formFormula, formEvent*, spreadsheet, report, action, group, role, module, plugin, deeplink.
- `execute-guide/workflows.md`: workflow, edgeMap, every node kind, value shapes.

Guide wins over memory. `schema kind=<kind> variant=<v>` (live) wins over the guide.

## Use (apply to a live Enterprise)

Only to apply an entry into a Studio Enterprise via `neome-studio` MCP.

1. Confirm with user: Enterprise (`entId`), names, roles. Writes hit the live draft.
2. `list` first; reuse what exists. Names in steps are placeholders: rename to the Module's terms (`GLOSSARY.md`).
3. `entId` on every call. Writes (`add` / `set` / `remove`) one at a time; reads may run together.
4. `schema` before each new kind / variant.
5. `validate` after each step group; fix till `ok=true`.
6. Never `deploy_enterprise` unless user asks (`diff_enterprise` first).
7. Gaps (MCP can't, or shape not confirmed) → tell user / Open Item. Never guess.

## Write (what goes in the section)

```markdown
## Execute

Only use this to apply this into a Studio Enterprise via MCP.

Placeholders: <names>. Needs first: <other entries / existing resources, or "none">.

1. Vars + roles: `add kind=var` … ; `add kind=role` …
2. Form: `add kind=form` → `kind=composite type=section` → fields (`type=…`, key props).
3. Sheet: `add kind=spreadsheet form=…` → `kind=spreadsheetLayout` (table; list|card for refs) → ref fields.
4. Logic: `formFormula` / `formEventAction` + `formEventCondition` + `formEvent`.
5. Actions + group: `add kind=action kind=…` → `set kind=group actionPermissionMap` (roles on every entry).
6. Workflow: `add kind=workflow` (4 maps `{}`) → `add kind=node` per step → `set kind=workflow edgeMap`.
7. `validate` till ok=true. `describe` key resources to confirm.

Gaps: <what MCP can't do or is unverified, one line each; "none" if none>.
```

Rules:

- First body line exactly `Only use this to apply this into a Studio Enterprise via MCP.` (checked).
- Last body section, after `## Flowchart`.
- Real kind / property / enum names only, from the guide. Unsure shape → step says `(verify: describe)` and a Gaps line.
- Skip steps not needed (no workflow → no step 6). Renumber.
- Short. Simple English. One line per call group. No client names (scrub words).
- Pattern: build the How. Template module: build the usual sheets, key fields, roles + Process steps; name its Patterns (`apply PAT-… Execute`) instead of repeating them. Template: order of Template module Executes + the links between modules. App baseline: rebuild what `Gives` lists, only when the Neome App is not installed (say so).
- Nothing buildable → section with the guard line + one line why.
