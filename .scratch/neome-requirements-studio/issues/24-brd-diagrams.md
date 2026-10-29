# 24 — BRD process and status diagrams

**What to build:** The BRD shows an end-to-end process diagram with lanes and a status diagram per Module, as static SVG made by the pinned Mermaid CLI, identical across builds of the same data. Missing or wrong-version `mmdc` fails clearly. Spec: BRD page (Process), Deterministic engine.

**Blocked by:** 23 — BRD preview HTML page

**Status:** resolved

- [x] Process: `flowchart TB`, subgraph per lane, steps tagged with Module prefix, decisions as diamonds, alternate paths dotted + labelled, externals grey
- [x] Status: `stateDiagram-v2`, `direction LR`, `[*]` start/end, triggers as labels
- [x] OI-dependent nodes dashed orange with OI ID
- [x] Mermaid theme set to BRD tokens; page CSS does not leak into SVG
- [x] Same data → byte-identical SVG across runs
- [x] `mmdc` missing → clear "run `npm ci`" error; version ≠ pin → clear error (fixture-tested)
- [x] Tests: HTML contains static SVG for process and each Module

## Comments

- Done 2026-10-29. Preview build now inlines static SVG diagrams: process (Process view) + one status flow per Module (screen + print). New `neome-studio/engine/brd/diagrams.mjs`: data → Mermaid text (derived, never stored) → pinned `mmdc` → SVG. `render-html.mjs` takes `renderBrdHtml(data, svgs)`; placeholders gone; process step table kept + one-line legend. `build-brd.mjs` checks mmdc first, renders diagrams after the data file is written. Tests `engine/test/brd-diagrams.test.mjs` (13) + fake wrong-version mmdc fixture `engine/test/fixtures/mmdc/wrong-version/mmdc`. Schema docs: new error classes + "Diagrams" section. Eyeball checklist: diagram line added.
- How: all diagrams of a build go into one markdown file → one `mmdc` run (one headless Chrome, ~1.5 s). mmdc renders with placeholder svgId; page swaps it to `dgm-<key>` (screen) / `p-dgm-<key>` (print) so ids and Mermaid's `#id`-scoped styles never clash. Theme `base`, `look: classic`, BRD tokens (Neome blue borders, grey lines, orange dashed open, grey externals, Schibsted Grotesk). `deterministicIds` on → same data gives byte-identical SVG (tested).
- Page CSS leak: page `.label` (uppercase mono) matched Mermaid labels, as in prototype 06. Fixed by a `.diagram svg .label` reset (Mermaid's own `#id` rules still win). Test parses `page.css` and fails if any page selector can match a class/tag in the SVGs without a reset (only `*` and `p` allowed as harmless).
- Small choices (my call; revisit if wrong):
  - Pin lives in engine (`MERMAID_CLI_PIN` = 12.0.0); test keeps it equal to `package.json` + lock.
  - mmdc lookup: `NEOME_MMDC` env (tests), else `node_modules/.bin/mmdc` walking up from the Engagement folder, else from the engine. Missing / wrong version = `error [mmdc-missing|mmdc-version]`, exit 1, checked before anything is read or written. mmdc crash = `mmdc-failed`, data file kept, page not written.
  - Page fonts handed to mmdc as themeCSS so label boxes are measured with the fonts the BRD shows; `@font-face` stripped from each SVG after (page embeds them once). `--no-font-embed`.
  - Labels: inline markdown stripped, special chars as Mermaid entities. Step = `<PREFIX> · label` + small note; external step without Module has no prefix. OI-dependent step / lane / status: dashed orange, label ends `· OI-NN`. External lane = grey subgraph. Decisions keep normal colours (orange reserved for open). Status label = id in sentence case (`pending-approval` → "Pending approval"). Node ids prefixed (`step_`, `lane_`, `st_`) so Mermaid keywords can't clash.
  - Module with no statuses → "No statuses yet." (no SVG). Merged Modules → none. No steps → "No process diagram yet."
  - Linux only: puppeteer `--no-sandbox` (GitHub runners block Chrome's sandbox). Input is our own generated text, `securityLevel: strict`.
  - Ticket 23 test "no mermaid" narrowed to no mermaid.js (SVG CSS has `mermaid` in class names).
- Verified headless Chrome: labels not uppercase, page fonts used, no duplicate ids, no console errors, print shows diagrams scaled to A4. Not verified: CI run on GitHub ubuntu (no remote yet), Windows (`mmdc.cmd` path untested), big real processes (layout/legibility at A4), Safari/Firefox. OI IDs in SVG not clickable (nice to have, not done).
