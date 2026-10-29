# 16: Delivery plan in the BRD

Type: grilling
Status: resolved
Blocked by: None

## Question

Does the BRD carry a delivery timeline / implementation plan (Anglo Gulf had a 4-week plan)? If yes: which section, what shape (phases, weeks, per-Module), where the estimate comes from (Delivery type per Module from the catalog heuristics, Consultant input), whether it is marked indicative, and what it adds to the BRD data schema.

## Constraints from earlier tickets

- From ticket 01: PetroStar-based Delivery heuristics in research/neome-app-catalog.md.
- From ticket 05: fixed section order; any new section needs a slot.
- From ticket 08: schema stores facts only; derived values are not stored.
- Out of scope: pricing and commercials.

## Answer

Consultant picked the recommended options on the two key questions (include? who sets weeks?). Rest taken as recommended.

- **Section: yes, optional.** "Implementation plan" shows only if the Engagement has a plan. Slot: after Modules, before Open Items register (as in Anglo Gulf). Same order on screen and print. Sidebar: one entry after the last Module, before the Register group.
- **Always indicative.** Header line: "Neomenta's estimate, indicative. Work that depends on other parties runs on its own plan." No pricing, no calendar dates.
- **Shape:** ordered phases on relative weeks. Each phase: name, week from/to, what it covers, Module prefixes it covers. Plus a **Not yet placed** list (free text + OI refs + Module refs) for work with no slot yet. Total weeks shows on the cover/summary as a metric (derived).
- **Who sets what:** agent drafts a skeleton (default 4 phases: masters + core config → workflow/process config → testing + UAT → go-live + training) and places Modules into phases. Custom Modules, third-party integrations and scope hanging on open OIs go to Not yet placed. All of this is `proposed`. **Weeks come only from the Consultant.** Agent never guesses week numbers.
- **Where it lives:** `_agent/plan.md` per Engagement. Agent writes the skeleton at the end of `review-draft`; the Consultant edits it by talking to the agent any time. `build-brd` turns it into JSON like everything else.
- **Checks:** `build-brd` preview: no checks beyond schema. Release mode: warns if any phase has no weeks or is still proposed; warns if a resolved Module is in neither a phase nor Not yet placed. Warnings, not errors (plan is optional).
- **Plan vs Requirements:** phases are not Requirements. No IMP-01..04 style Requirements that restate the plan (Anglo Gulf duplicated). Real Enterprise asks about delivery (migration, training, support, UAT) stay Requirements or Open Items; their home is a new ticket (19).
- **Sign-off:** plan is part of the signed BRD snapshot, still indicative. Change log diffs it like any other part.
- **Schema (ticket 08) addition, minor semver bump:**
  ```
  plan?  {phases[] {id (kebab), name, weekFrom, weekTo, covers, modules[] (prefixes),
                    sources, proposed},
          notPlaced[] {text, ois[], modules[], sources, proposed}}
  ```
  `weekFrom`/`weekTo` may be null while the Consultant hasn't set them. Total weeks derived, not stored. Cross-ref check: phase Module prefixes and OI IDs exist; `weekFrom <= weekTo`.

Surfaced: [19: Home for Engagement-wide Requirements](19-home-for-engagement-wide-requirements.md).
