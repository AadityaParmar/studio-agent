# Dry run: build one Module on a sandbox

Type: prototype
Status: resolved
Blocked by: 01, 04, 05

## Question

By hand, no new skill: take one resolved Module (e.g. eval case template-hr-small, leave) and build it on a sandbox Enterprise from its Template module Execute. Record friction: calls count, confirms, failures, names, gaps. Link the log as an asset.

## Answer

Dry run 2026-11-04: VEN (deans-pond/hoa-mgmt) on ent103. Files + log: [prototype/06-ven-dry-run/](../prototype/06-ven-dry-run/). 3 step files, 26 writes + 1 fix set, 3 Consultant yeses, validate ok, not deployed.

Findings (feed 10, 11 and the build skill):

1. **Write check ≠ validate.** pickText accepted as list tab category on write, rejected by `validate`. → `validate` after each call group, not only at file end. Add to execute-guide: list `filter.categoryFields` rejects pickText; use `groupByField`.
2. **`diff_enterprise` broken** on a draft with a new form ("form not found"). Deploy file can't rely on it. Fallback: `describe ent` counts + `list` per kind vs step files. Report to Neome MCP team.
3. **Schemas huge** (list layout 88 KB, condition var ~600 lines). Skill must read schema through a script / execute-guide cheat sheet, never whole into context.
4. **Strictly one write at a time.** Agent sent 8 field writes in one batch; they passed, but rule says sequential. Skill text must say it plainly.
5. **Option keys.** `defaultOption` and conditions take keys (`keyActive`), auto-made from labels. `names.md` should list keys.
6. **Spec type → Studio type** needs a table in plan-build: choice → pickText + setOfText var; file → document (+ permissionMatrix); phone text → mobileNumber; long text → paragraph.
7. **Gate:** VEN blocked by OI-25 (Module(s) `All`). Decide: do `All` Open Items block every Module's Requirements, or only ones they name? (→ 11)
8. **Works well:** step file shape, one yes per file, idempotent order, field-level permissionMatrix for hidden ID, no removeRoles = no delete.
9. **Not checked:** runtime (Member can't see ID proof; only Active vendors listed). Needs browser test → 07 (on hold).

## Comments

- 2026-11-04: Module VEN (deans-pond/hoa-mgmt), Enterprise ent103 `e-qMihNWulraS4gYKTspkfbygWZ`. Step files: [prototype/06-ven-dry-run/](../prototype/06-ven-dry-run/). Gate would block: VEN-04 has OI-25 (All) open.
