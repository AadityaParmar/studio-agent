---
name: neome-mapping
description: "Building block for resolve-module. Write Module spec section 12: indicative Neome App and Delivery from the catalog reference and Delivery heuristics."
---

# neome-mapping

Propose how Neome meets one Module: one Neome App (or none), one Delivery for the Module, and a per-Requirement Delivery only where it differs. Always **indicative**: Neomenta's proposal until the build phase.

`ENGINE` = `node neome-studio/engine/cli.mjs`, from the repo root. `<eng>` = `enterprises/<ent>/engagements/<slug>`. Catalog: [neome-app-catalog.md](../../reference/neome-app-catalog.md) (picks the App; says what an App does unless an App baseline `reference/template-bank/apps/APP-<slug>.md` exists, which wins on that); valid slugs: [neome-app-catalog-slugs.json](../../reference/neome-app-catalog-slugs.json). Section 12 shape: [spec-template.md](../write-module-spec/references/spec-template.md). Template bank rules (not a Source, IDs agent-side only): [map-logic.md](../../reference/map-logic.md) Template bank fields. Runs no git: the caller commits.

## 1. Read

From the caller: `<eng>`, `<PREFIX>`, `templateModule` (else the ticket front matter's). Read the Module's `spec.md` sections 1–11 (and section 12 on a revisit). `templateModule` a `TMOD-` ID → read its entry whole: the **hint** is its `neomeApp` and `delivery` (`standard` | `configuration` | `custom` = Standard | Configuration | Custom module) and its `## Neome App / Delivery hint`. After you pick the App (section 2): `reference/template-bank/apps/APP-<slug>.md` exists → read it whole; its `## Gives` is the **App baseline** (what the App has out of the box; beats the catalog page on that; no file → catalog page only). Read catalog sections 0 (App index), 1 (building blocks), 3a (entity → App), 4 (Delivery heuristics), 5 (gaps), then the `## App:` section of every App that owns one of the Module's entities. Done when each entity of section 4 has an owning App or none.

## 2. Neome App

- Pick the App that owns the Module's main entity (3a, heuristic 9) and whose "Fits when" line matches section 1. One App. A second App the Module leans on goes in `How:`.
- No App owns the main entity → `Neome App: none`, `Delivery: Custom module`.
- Write the slug exactly as in the slug list, in backticks.

Done when the App (or `none`) is chosen and you can name the catalog lines that support it.

## 3. Delivery

Grade every live Requirement against heuristics 4b (Standard / Configuration / Custom module; reports rule 4; integrations rule 5; vertical Apps rule 6; security rule 7; App mechanics in section 1 count). Then:

- **Module Delivery** = the grade that fits the Module as a whole: its main entity and flow.
- **Override**: `Delivery: <grade>` on a Requirement block only where its grade differs from the Module Delivery. Remove overrides that equal it.
- Torn between two grades → the higher one, plus an Open Item, owner Neomenta, asking which (heuristic 8).
- ERP / accounting links are never Standard; they hang on an Open Item or a third-party Scope tag (heuristic 5). Scope tags are `write-module-spec`'s: flag a mismatch in the hand-back.

Then the hint cross-checks (no Template module → skip). The catalog picks the App and the heuristics grade first; the hint only checks them:

- Hint agrees on App and Module Delivery → nothing to add.
- App or Module Delivery differs → Module Delivery = the higher of the heuristic grade and the hint's, plus an Open Item, owner Neomenta, quoting both: `<Module> Delivery: the Template bank hint says <App, grade>; the catalog and Delivery heuristics say <App, grade> because <reason>. Which holds?`, suggested = the higher grade. The App stays the catalog's.
- The hint never lowers a grade on its own.

Then the App baseline cross-checks (no `APP-` file → skip), second, beside the hint:

- A Requirement graded Standard (or the Module Delivery Standard) whose need is in `## Gives` → backed, nothing to add.
- Graded Standard but not in `## Gives` → the App does not give it out of the box: raise it to Configuration (or Custom module per heuristics), plus an Open Item, owner Neomenta: `<Module>: <need> is graded Standard, but the <App> App does not give it out of the box. Configuration or custom?`, suggested = the higher grade.
- Graded higher but in `## Gives` → keep the grade; the App baseline never lowers a grade on its own. Name it in the hand-back.

Done when every live Requirement has a grade, the Module has one Delivery, and any hint or App baseline mismatch has its Open Item.

## 4. Write

Section 12 of `spec.md`, exactly three lines:

```
Neome App: `<slug>` | none
Delivery: Standard | Configuration | Custom module
How: <Enterprise term → App entity; what is set up; what is added or built; OI-NN it hangs on> (proposed, to confirm)
```

Plus the `Delivery:` override lines in section 11. Enterprise terms as in its glossary; App words only after the arrow. An Open Item you raised: row in `open-items.md` and bullet in section 13. Touch nothing else.

```
ENGINE build-brd <eng> --check
```

Errors (`unknown-app`, `schema` on Delivery) → fix, run again. Done at exit 0.

## 5. Hand back

To the caller, short: App, Module Delivery, overrides (ID → grade), the catalog lines it rests on, the hint (`TMOD-…`: App, grade; agrees / differs), the App baseline (`APP-…`: backs / differs, per Requirement), Open Items raised. Module Delivery Custom module → say so: the caller puts the Module in `plan.md` Not yet placed (`(proposed, to confirm)`).
