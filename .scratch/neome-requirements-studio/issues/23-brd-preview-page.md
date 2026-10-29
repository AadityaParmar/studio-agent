# 23 — BRD preview HTML page

**What to build:** A preview build now also writes one self-contained HTML BRD, labelled "Working draft — not for circulation", that works like an app on screen and prints to A4 as a full linear document. No diagrams yet (placeholders). Spec: BRD page, stories 104–120.

**Blocked by:** 22 — BRD data file build + validation

**Status:** resolved

- [x] Rendered only from the BRD data file; no external JS, no mermaid.js; inline script only for nav/filters; content + print work with script off
- [x] Sidebar: Overview (Summary and fit, Process) · Modules (Delivery chip + progress bar) · Register (Open Items with count, Glossary, Sources, Versions and sign-off)
- [x] Fixed section order, same on screen and print
- [x] Summary: 4 metrics, scope at a glance, fit table, How to read legend
- [x] Module view: eyebrow, name, In progress chip, purpose, mapping card (indicative), filters (All / Must / Open scope / Has Open Item), Requirement cards with folded acceptance, proposed chip, OI links, Module Open Items box
- [x] OI links jump to register row; unresolved Modules shown "In progress"; withdrawn/merged greyed or hidden
- [x] Print: hidden print container, new page per section and Module, repeated table headers, no split rows, footer Engagement · version · status · page x / y
- [x] Vendorgate tokens; Delivery colours Standard green, Configuration blue, Custom orange, Open dashed orange
- [x] Tests: HTML present, no external JS, print CSS present, sections in fixed order
- [x] Eyeball checklist item added for BRD look

## Comments

- Done 2026-10-29. `build-brd --mode preview` now also writes `engagements/<slug>/brd/preview.html`, rendered from `_agent/brd/brd-data.json` as written (re-read, never the markdown). Not written when the build fails. Renderer `neome-studio/engine/brd/render-html.mjs` + `page.css` + `page.js` (inlined). Fonts: 7 latin woff2 (Schibsted Grotesk 400–700, JetBrains Mono 400/500/700) pulled from the Vendorgate HTML into `neome-studio/reference/fonts/` (+ OFL `NOTICE`), embedded base64; page ~260 KB. Tests `engine/test/brd-page.test.mjs` (17). Eyeball checklist: `neome-studio/evals/README.md` (stub; tickets 39–42 extend). Schema docs mention the page.
- How it works: `#screen` = sidebar app, every view is static HTML; views hide only once the script adds `.js`, so with script off all views show in order and sidebar links are anchors. Filters hidden without script. Acceptance via `<details>`. `#print` = hidden linear doc from the same data (`p-` anchor prefix), shown only in `@media print`; module Requirements as a table in print (repeat headers, no split rows). Footer via `@page @bottom-center`.
- Small choices (my call; revisit if wrong):
  - "Proposed Must" = all live Must Requirements (as in prototype 05: priorities are proposals until Sign-off); label becomes "Must" once signed off.
  - Progress bar + "Has Open Item" filter count only **open** OIs. "Open scope" filter = scope `open` or `neome-tbc`.
  - Withdrawn Requirements: greyed, struck title, sorted last, not counted. Merged Modules: no view / print page / nav entry; greyed "Merged into X" row in fit table. Renamed: eyebrow `formerly QT`.
  - "In progress" = status open / claimed / needs-revisit. Module with no mapping → Delivery "Open" dashed orange chip, "Not mapped yet".
  - Neome App name looked up from `reference/neome-app-catalog-slugs.json` (slug if unknown).
  - Module Open Items box = open OIs named by the Module's `oiRefs`, its Requirements, or listing its prefix (not `All`-only ones). OI register sorts open first; "Affects" = Modules + Requirements citing it.
  - Source IDs link to Source rows; OI IDs in any text are auto-linked.
  - Module view shows only what ticket 05 lists (no roles/records/rules tables); those stay in the data file for phase 2.
  - Diagrams: dashed placeholders ("added in a later build") in Process and each Module; Process shows a step table. Across all Modules / Implementation plan slots left for ticket 25.
- Verified with headless Chrome (puppeteer from mermaid-cli): nav, OI jump (`#OI-01` → Open Items view), Must filter, no console errors; PDF = 11 A4 pages for in-progress fixture (one per section/Module), footer "Sales CRM · Preview · Working draft — not for circulation · page 1 / 11". Not verified: Safari/Firefox print (`@page` margin boxes need Chrome 131+; others may drop the footer), long tables across many pages, real Enterprise data. OFL text not shipped, only linked in `NOTICE`.
