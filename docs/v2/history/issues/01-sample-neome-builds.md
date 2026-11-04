# Sample Neome Builds

Type: task (HITL)
Status: resolved
Blocked by: —

## Question

Drop 1–2 real enterprise JSONs (5–10 MB) into `.scratch/template-bank/raw/`. Pick two different business types. Done when files are there; answer records names, sizes, top-level keys.


## Answer

Done. 10 files in `raw/` (gitignored, `.gitignore:16`). Only **7 unique Builds**: 3 files are copies under wrong names.

Shape (all): `{type:"ent", payload:{studioEnt:{…}}}`. `studioEnt` keys: version, versionCode, times, createdBy/lastUpdateBy, entId, details (name, about, timeZone…), moduleMap, pluginMap, roleMap, varMap, formMap, spreadsheetMap, reportMap, automationMap, actionMap, groupMap, deeplinkMap, driveSheetMap, translationMap, deployVarMap, erdDiaMap, autoDiaMap, reportDiaMap, nameCounterMap, privateState. Some add promptConfig, layoutUserMap, layoutUserMenuActionMap, storeItemDetailMap. Each `*Map` = `{keys:[…], map:{id→obj}}`.

Sizes 0.7–3.4 MB (smaller than 5–10 MB guess).

| File | details.name | MB | forms | sheets | roles | actions | reports | automations | groups | vars | modules |
|---|---|---|---|---|---|---|---|---|---|---|---|
| NB-01 | NB-01 | 0.8 | 37 | 25 | 5 | 45 | 18 | 0 | 16 | 77 | 0 |
| NB-02 file | NB-02 | 1.4 | 57 | 30 | 9 | 72 | 62 | 0 | 13 | 106 | 0 |
| NB-04 | same | 3.4 | 151 | 62 | 12 | 191 | 169 | 0 | 33 | 287 | 0 |
| NB-05 | same | 1.6 | 92 | 51 | 12 | 98 | 50 | 23 | 16 | 286 | 0 |
| NB-06 | same | 1.2 | 57 | 35 | 12 | 67 | 35 | 0 | 14 | 121 | 0 |
| NB-07 | NB-07 | 1.1 | 79 | 47 | 21 | 90 | 67 | 14 | 13 | 192 | 4 |
| NB-03 | same | 0.7 | 32 | 21 | 9 | 46 | 30 | 0 | 15 | 100 | 3 |

Duplicates (not real Builds of their file name):

- `dup file A` = NB-02 (same entId + version + counts; only resource IDs differ, a re-export).
- `dup file B` = NB-03 (byte-identical).
- `dup file C` = NB-07 (byte-identical).

Facts later tickets depend on:

- Digest script must dedupe by `entId` + `version`, not file name, and read Build name from `details.name`.
- `moduleMap` empty in 5 of 7: Build areas can't come from Modules alone.
- Automations only in NB-05 and NB-07.
- Suggested pair for Build digest + flowchart prototype: NB-02 (sales) + NB-05 (HR, has automations).
- File names + `details.name` are client names → scrub before any commit.
- Human follow-up (optional): re-export real dup file A, dup file B, dup file C if wanted in the bank.
