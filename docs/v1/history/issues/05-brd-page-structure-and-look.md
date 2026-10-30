# 05: BRD page structure and look

Type: prototype
Status: resolved
Blocked by: None

## Question

What sections, in what order, and in what visual form does the BRD have? It merges three examples:
- Vendorgate's story, design system and tabs
- Anglo Gulf's requirement tables, scope, Sources and Open Items register
- PetroStar's fit-gap

Produce a rough single-file HTML outline to react to. It must work both on screen and as A4 print.

## Answer

Prototype asset: [prototypes/05-brd-layout-PROTOTYPE.html](../prototypes/05-brd-layout-PROTOTYPE.html), with 3 variants (`?variant=A|B|C`) and the same Anglo Gulf sample data. It is kept as a throwaway source. The folder is not a git repo, so there is no branch.

**Winner: C, the Module explorer.** The Consultant picked C over A (tabbed briefing, Vendorgate) and B (paged A4, Anglo Gulf).

Decisions:
- **Screen:** one self-contained HTML file that works like an app. A dark sidebar groups the views:
  - Overview: Summary and fit, Process
  - Modules: one entry per Module, each with a Delivery chip and a progress bar (share of Requirements with no open Open Item)
  - Register: Open Items (with a count), Glossary, Sources, Versions and sign-off
- **Module view:**
  - Eyebrow with the prefix, the Module name, an "In progress" chip if the Module is unresolved, and the purpose line.
  - Mapping card: Neome App, Delivery (marked indicative), and how Neome delivers it.
  - Filters: All / Must / Open scope / Has Open Item.
  - Requirement cards: ID, title, text, acceptance criteria folded under a toggle, and on the side the priority, scope tag, Sources and OI links. Agent proposals carry a "proposed, to confirm" chip.
  - An Open Items box listing the Module's open Open Items.
- **Summary page:** title, lead, 4 metrics (Requirements in N Modules, proposed Must, Open Items to close, Modules resolved x/N), then scope at a glance (count per scope tag), then the fit table (Module → covers → how → Neome App → Delivery), then How to read (MoSCoW, scope tag and Delivery legends).
- **Fit appears in both places:** the summary fit table (the PetroStar genre) and the mapping card at the top of each Module.
- **Section order, the same on screen and in print:** Cover/Summary → How to read → Scope and Neome fit → Process → Modules (one block each, in Module order) → Open Items register → Glossary (Enterprise) → Sources → Versions (change log) and sign-off block.
- **Print:** always the full straight-through document, whatever is on screen. It is A4, with each section and each Module starting on a new page. Table headers repeat across pages, rows never split across a page, and the footer shows the Engagement, version, status and page x / y. A hidden print container is rendered from the same data as the screen.
- **In-progress Modules show in every version the Enterprise gets.** They carry an "In progress" chip, the cover count shows "Modules resolved x/N", and a warning says their Requirements are draft.
- **Look:** Vendorgate design tokens (Schibsted Grotesk + JetBrains Mono embedded, Neome blue `#1877D5` and accent `#F47100`, mono eyebrows, the split rule). Delivery colours: Standard green, Configuration blue, Custom orange. Open is shown as a dashed orange chip.
- **Links:** an OI link anywhere jumps to that row in the register. Source IDs are shown in mono.

Inputs for later tickets:
- 06 (process diagram): it renders in the Process view and in print. The prototype only has a placeholder chip flow, with each step labelled by the Module that owns it.
- 07 (Module spec template): its sections must be able to fill the Module view (purpose, mapping card, Requirements with acceptance, priority, scope, Sources and OIs).
- 08 (BRD data schema): the prototype's `BRD` object (meta, sources, modules[reqs], process, openItems, glossary, changelog) is only a hint, not a decision.
- 12 (versioning): the Versions view holds the change log and the sign-off block.
- Not decided here: an implementation plan section (still in Not yet specified).
