# Build input contract

Type: grilling
Status: resolved
Blocked by: 02

## Question

Build starts when every Module is resolved and every Requirement cleared (02). What exactly is "cleared": no open Open Item on it? no `(proposed, to confirm)`? Must only, or all priorities? Engagement-wide Requirements too? Engine gate for it (`status` step line)? What does the build read: `spec.md` + section 12, or a BRD data file built at that moment (preview `brd-data.json`)? What if a Module goes needs-revisit mid-build? Name map Enterprise term → Studio name (`*Sheet`, var names). Target `entId` stored where. Folder: `<eng>/_agent/build/`? 

## Answer

User, 2026-11-04, yes to all:

- Requirement **cleared** = no open Open Item on it, and not `(proposed, to confirm)`.
- Applies to every priority (not only Must) and to Engagement-wide Requirements.
- Engine checks it; `status` prints a build `step` line so `studio` routes to the build.
- Build reads a frozen copy of `brd-data.json` taken at build start, not live `spec.md`.
- Module goes needs-revisit mid-build → its step files pause; after the revisit, new frozen copy, rebuild only the delta (`diff_enterprise`).
- Still open from the question: name map location, `entId` storage, build folder (fold into 04).

## Comments
