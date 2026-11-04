# Research: MCP build capabilities

Ticket: [issues/01-mcp-build-capabilities.md](../issues/01-mcp-build-capabilities.md). Date: 2026-11-04. Read-only: no `add`/`set`/`remove`/`switch_enterprise`/`revert_enterprise`/`deploy_enterprise` calls made.

Server seen: `status` → `version d63066162dce`, `schemaVersion 0813a7cb573f`, `codeVersion f0dd2aa06f28`.

Source keys:
- **[tool:X]** = MCP tool description of tool X.
- **[instr]** = MCP server instructions (same as `docs/studio-ai-docs/README.md` core prompt).
- **[call:X]** = live read-only call I made.
- **[RM:n]** = `docs/studio-ai-docs/README.md` line n.
- **[EX:n]** = `neome-studio/reference/template-bank/EXECUTE.md` line n. **[LS:n] / [FL:n] / [WF:n]** = `execute-guide/logic-sheets.md` / `forms-layouts.md` / `workflows.md` line n.

## 1. Install a Neome App or plugin?

- **Neome App (store item): no.** No tool installs, lists or searches store items. Tool list is fixed: `list`, `describe`, `schema`, `add`, `set`, `remove`, `validate`, `status`, `diff_enterprise` + `list_enterprises`, `switch_enterprise`, `deploy_enterprise`, `deploy_status`, `revert_enterprise` [RM:14-15]. No `app`/`store` resource kind in the kind enum [tool:list, tool:schema].
- **Path: Studio UI only** (inferred; no doc says so). MCP can't tell if an App is installed either: an installed App shows as plain forms/sheets/modules; no App marker in `describe kind=ent` (only settings + resource counts) [call:describe ent].
- Execute guides assume a check: 20 App entries say "Only if Neome App X is not installed (check `list` first)" (e.g. `apps/APP-crm.md:75`). With MCP that check = guess by resource names. Unverified.
- **Plugin: `add kind=plugin` exists but is "import only"** [LS:135, LS:146]. Required props: `name`, `pluginBundle`, `plugin`, `pluginName`, `mode` (agent|javascript|webService), `pluginVersion`, `pluginApiIdKeys/Map`, `pluginFormKeys/Map`, `pluginVarKeys/Map` [call:schema plugin].
  - A live imported plugin (`describe kind=plugin` on a test Enterprise) holds `plugin` (`p-…` id) + `pluginBundle` (`pb-…` id) pointing at a published plugin, plus full copies of its APIs, forms and vars [call:describe plugin]. So `add` = paste a whole plugin snapshot with ids from a published bundle. No tool lists published plugins/bundles. Whether `add` with copied ids works: **unverified: needs write**.
  - Plugin config values (URL, API key) live in the plugin config form; no prop sets them [call:schema plugin]. Templates mark plugins "import only (custom work)" (e.g. `template-modules/TMOD-attendance.md:83`).
- Building a plugin from scratch (APIs, scripts): not a build-step task via MCP. Studio UI / plugin dev.

## 2. Create or pick an Enterprise / sandbox

- **Create: no.** No create/clone tool [RM:14-15]. `schema kind=ent` → error "ent cannot be added or changed" [call:schema ent]. Sandbox must be made in Studio UI first. Clone is mentioned only in var docs ("copied as-is when the enterprise is cloned") [`docs/studio-ai-docs/logic.md:23`]; no MCP tool for it.
- **Pick:** `list_enterprises` → rows `{entId, name, about?, isDraft, everDeployed, editLock, errorCount, active}` + `loadFailures` [call:list_enterprises]. If `loadFailures>0` list is incomplete [tool:list_enterprises].
- Pass `entId` (id or name) on `list`, `describe`, `validate`, `diff_enterprise`, `deploy_status`, `add`, `set`, `remove`, `deploy_enterprise`, `revert_enterprise` [tool:*]. `schema`, `status` need none [RM:302].
- `switch_enterprise` sets the active Enterprise **per API key** (not per session) [tool:switch_enterprise]. So two sessions on one key share it. Prefer `entId` always. No Enterprise was active in my call (`active:false` on all rows) [call:list_enterprises].
- **Use id, not name:** two Enterprises in the list share the same name [call:list_enterprises].
- **Edit lock:** `add`/`set`/`remove`/`deploy`/`revert` need the Enterprise edit lock; if off the call fails; lock is taken in Studio, not via MCP [RM:303, RM:306, tool:deploy_enterprise]. `list_enterprises` shows `editLock` bool (all `true` here; whose lock = unclear).

## 3. deploy / deploy_status / revert

- Model: Enterprise has a **deployed** version + optional **draft**. Every `add`/`set`/`remove` "persist[s] the enterprise" = writes the draft [tool:add, tool:set, tool:remove]. Users run the deployed one (inferred from "publish") [RM:304].
- **`deploy_enterprise`** — input: `entId` only. **Async**: queues deploy, returns `jobKey`, does not wait. Needs edit lock, deploy permission, zero validation errors [tool:deploy_enterprise, RM:304]. No input for the "deploy var map" that `requiredOnDeploy` vars need [`logic.md:23`] → those values can't be given via MCP (unverified: needs write).
- **`deploy_status`** — input: `entId`, `jobKey`. Returns `done`, `executionState` (`completed` | `failed`). Poll while `done=false` [tool:deploy_status, RM:305]. "No active deployment yet" → call again [RM:305]. With a fake `jobKey` and no job running it errored "No active deployment is currently running" [call:deploy_status] → seems to read the Enterprise's current job, maybe not by key. Full success shape: **unverified: needs write**.
- **`revert_enterprise`** — input: `entId`. Discards the whole draft, back to last deployed version. Needs edit lock. Refuses when no draft, or when **never deployed** [tool:revert_enterprise, RM:306]. All-or-nothing; no per-resource undo.
  - Build impact: a brand-new Enterprise (`everDeployed=false`) has no revert. Undo there = `remove` each resource.
- Rules: `diff_enterprise` before deploy/revert; deploy/revert only when user asks; one at a time, after earlier writes return; poll `deploy_status` before next write [RM:279-280, RM:307-308].

## 4. Output shapes

- **`diff_enterprise`** [call:diff_enterprise on 3 test Enterprises]:
  - Draft: `{changed:true, deployed:true, message, changes:[{op:"added"|"removed"|"updated", kind, id, name, parentKind?, parent?, changed?:[propName…]}]}`. `parentKind`/`parent` seen on nested kinds; `changed` (prop names only, no values) seen on `updated`. `removed` from tool text, not seen [tool:diff_enterprise].
  - No draft: `{changed:false, message:"No draft changes"}`.
- **`validate`** [tool:validate, call:validate]:
  - Shape: `{ok, errorCount, errors:{<searchPath>: …}}`; when `ok=false` adds `next` (fix guidance). Seen `ok:true` only; error shape not seen live.
  - Covers whole Enterprise draft (`StudioComputer.validate`), not one resource. Catches config/reference errors, e.g. ref layout must be list|card, layout not found, `pickUser` needs `roleIdDataSource`, `spreadsheetEditor` needs `layoutSpreadsheet` [RM:119-122, FL:109].
  - Also each write is checked (`VarData.validate`) and rejected unsaved if bad [tool:add/set/remove].
  - Not covered (inferred): runtime logic — formula JS, workflow behaviour, NeoQL results. Deploy requires zero errors, so `validate ok` = deployable gate [tool:deploy_enterprise].
  - `errorCount` per Enterprise also in `list_enterprises`.
- **`status`** [call:status, tool:status]: `{version, schemaVersion, codeVersion, tools:[…]}`. `schemaVersion` changes when add/set/describe/schema shapes change → re-read `schema`. Note: `tools` lists only the 9 core tools, not the 5 MCP-only ones.
- **`describe kind=ent`**: `{kind, id, name, description?, properties:{timeZone, displayDateFormat, locationAccuracy?, <kind>Count…}}` [call:describe ent]. Good for a build "before/after" count.

## 5. Batch writes? Cost / limits?

- **No batch.** `add`/`set`/`remove` take one `kind` + one resource (`properties`) [tool:add, tool:set]. Form must not carry fields/composites inline; add form → composite → each field [instr, RM:126].
- Partial batching inside one resource: map props hold many entries in one call (e.g. `setOfText` `value` options, group `actionPermissionMap`, workflow `edgeMap`) [RM:213-218, EX:38-39].
- **Serial only** for writes on one Enterprise; no parallel. Reads (`list`, `describe`, `schema`, `status`, `validate`, `diff_enterprise`, `deploy_status`) may run together [RM:308, EX:19].
- Each write persists the whole Enterprise draft [tool:add] → likely slow-ish per call (unverified).
- **Cost / rate limit: no sign** in tool text, instructions, docs or `status`. Unknown.
- Token cost is real: `schema kind=plugin` = ~242k chars (too big for one tool result) [call:schema plugin]. Prefer `schema kind=X variant=Y` (narrow).

## 6. Resource kinds, and what Execute guides assume that MCP lacks

- `schema` with no args: not possible (`kind` required) [tool:schema]. Kinds from the enum:
  - Root (list/add): `role`, `group`, `module`, `form`, `spreadsheet`, `report`, `action`, `layoutUser`, `var`, `plugin`, `deeplink`, `driveSheet`, `translation`, `workflow`.
  - Nested: `composite`, `field`, `formEvent`, `formEventAction`, `formEventCondition`, `formFormula`, `formLayout`, `gridLayout` (parent form); `spreadsheetLayout` (parent spreadsheet); `node` (parent workflow) [tool:list].
  - Singletons: `ent` (read only), `prompt` (describe/set; empty `{}` on test Ent) [tool:describe, call:describe prompt].
  - Shape helpers, not standalone: `argBinder`, `argBinderMap`, `permissionMatrix`, `formPayment`, `actionPermission` [tool:schema].
- Missing for a full build (Execute guides / map assume or need):
  - Install / detect Neome App (see §1) [EX:52, `apps/APP-crm.md:75`].
  - Create / clone Enterprise; take edit lock (Studio UI) [§2].
  - Users / members: no user or membership kind; group has no members prop; role has no hierarchy [LS:146]. Assign roles to real people = outside MCP.
  - Row data: no tool to insert/import rows → migration (bulk data) not via MCP.
  - `requiredOnDeploy` var values: no deploy var map input [`logic.md:23`, tool:deploy_enterprise].
  - Plugin: import only; config/credentials not settable [LS:135, LS:146].
  - Outside-Neome setup: WhatsApp template approval, keychains (template Gaps lines, e.g. `TMOD-attendance.md:83`).
  - Shapes not in schema / unverified: workflow `edgeMap` entry keys [WF:162]; `ConditionVar`/`MappingVar` refs (use inline) [WF:164]; many map shapes (`copyFieldMap`, `regionMap`, …) [FL:106, WF:163]; no field-level visible/readonly/formula props [FL:105]; no sheet history toggle; `sequence` no prefix/format [LS:146]. Gap list per entry under `Gaps:` in each `## Execute` [EX:42].

## Open (needs write to verify)

- `add kind=plugin` with ids copied from a published bundle: works?
- `deploy_status` success payload; does it honour `jobKey`.
- `validate` `ok=false` exact `errors` value shape + `next`.
- How `requiredOnDeploy` values get set (Studio UI deploy dialog?).
- Per-write latency on a big Enterprise.
