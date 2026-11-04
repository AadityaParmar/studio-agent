# Write confirmation and build lock

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

CLAUDE.md asks confirm before every MCP write. Does approving a build ticket's plan count as confirm for all its writes? Lock: one build session per Enterprise (reuse Engagement lock or new Enterprise build lock)? Stop rule on `validate` failing. Deploy: only on explicit ask, after `diff_enterprise`; which skill owns it?

## Answer

User, 2026-11-04, yes to all:

1. Confirm: agent shows a step file's MCP call list; one Consultant yes covers every write in that file. CLAUDE.md MCP rule gets a matching line.
2. Lock: Engagement lock while a step file runs; Studio edit lock (human) guards the Enterprise.
3. Failure: fix try x2 (`schema`, retry); still failing → stop, file `failed`, error logged; next session resumes at that call. Never skip.
4. Resume: `list`/`describe` first, skip what exists. Re-running a file is safe.
5. Undo: file `00` has human step "deploy the empty Enterprise once" so `revert_enterprise` works later.
6. Deploy: last file `NN-deploy.md`: `validate` 0 errors → show `diff_enterprise` summary → explicit yes → `deploy_enterprise` → poll `deploy_status`. Same build skill runs it.

## Comments
