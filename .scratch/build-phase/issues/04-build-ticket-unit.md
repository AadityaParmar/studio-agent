# Build ticket unit and order

Type: grilling
Status: resolved
Blocked by: 01, 03

## Question

Build = several step files, run one after another (02). How are they cut: per Module, per Execute step group, or per layer (roles/vars → masters → transactions → workflows → actions/groups)? File shape and numbering? Strict line, or a graph run in order? Also: name map location, `entId` storage, build folder (from 03). How are cross-Module run orders (Execute `Needs first`) turned into `blockedBy`? Delivery path per Module: Standard (install App + set up), Configuration (MCP edits), Custom module (Execute build).

## Answer

User, 2026-11-04, yes to Q1–Q5, C on Q6:

1. Cut by layer, then Module inside layer: roles + vars → master sheets → transaction forms/sheets → formulas + form events → actions + groups → workflows → reports. Clears cross-Module loops.
2. Cap ~40 MCP writes per file; big layer splits by Module. One file = one session.
3. Strict line: `NN-<layer>-<module>.md`, each needs all before it.
4. File: header (Modules, Requirement IDs, needs), numbered MCP calls (kind, name, key props), human checklist steps (run stops for "done"), `validate` at end, `Status:` open/done/failed + run log.
5. Folder `<eng>/_agent/implementation/`: `frozen-brd-data.json` (frozen `brd-data.json`), `names.md` (Enterprise term → Studio name), `target.md` (`entId`, name), `steps/NN-….md`.
6. Standard Delivery (Module maps to a Neome App): Consultant picks per Module at build start. **A** install the App by hand in Studio first (file `00` = human step, run waits for "done", agent checks with `list`; later files add only gaps vs App baseline `Gives`), or **B** build from scratch from the App baseline Execute (no hand step). Choice recorded in `target.md`.

## Comments
