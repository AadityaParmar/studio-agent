# 06: Process diagram rendering

Type: prototype
Status: resolved
Blocked by: None

## Question

How are the end-to-end process and the per-Module status flows drawn in the BRD? Candidates: Vendorgate's data-driven swimlane, Mermaid, or pre-rendered inline SVG. The diagrams must work offline, print well, and be generated from the BRD data file. Prototype the candidates side by side.

## Answer

Prototype asset: [prototypes/06-process-diagram-PROTOTYPE.html](../prototypes/06-process-diagram-PROTOTYPE.html), with 4 variants (`?variant=A|B|C|D`), an A4 preview toggle, and the same Anglo Gulf data (4 lanes, 11 steps, 2 branches, Lead and Quotation status flows). It is kept as a throwaway source. The folder is not a git repo, so there is no branch.

**Winner: B, Mermaid, rendered to SVG at build time with `mmdc` (mermaid-cli).** The Consultant picked it over A (HTML swimlane, Vendorgate), C (our own SVG layout code) and D (tables only).

Decisions:
- **Pipeline:** BRD data file → Mermaid text (generated, never hand-written or stored as the source of truth) → `mmdc` → static SVG inlined in the BRD HTML. No mermaid.js ships in the BRD, so it works offline and stays small.
- **End-to-end process:** Mermaid `flowchart TB`, one subgraph per lane (role or system). Steps carry the owning Module prefix. Decision steps are diamonds. Alternate paths (branches, rejections) are dotted, labelled edges. External systems (e.g. Tally ERP) are styled grey.
- **Per-Module status flows:** Mermaid `stateDiagram-v2`, `direction LR`. Start and end states via `[*]`. Transitions carry their trigger as a label.
- **Open questions in diagrams:** a state or step that hangs on an Open Item is styled dashed orange and carries its OI ID in its label (e.g. "Opportunity grooming ?", "Stages: OI-02").
- **Lanes are a hint, not fixed.** Mermaid has no true swimlane, so lane order and placement are Mermaid's choice. Accepted.
- **Pin the Mermaid / mermaid-cli version** so diagrams don't move between BRD versions because of a tool upgrade.
- **Styling:** use a Mermaid theme set to the BRD tokens (Neome blue borders, grey lines, orange for open). The BRD's own CSS must not reach into the SVG. The prototype showed `.label` from the page turning Mermaid labels uppercase.
- **Print:** the SVG is static, so print matches screen. Each diagram scales to A4 width.

Known costs, accepted:
- The Consultant's machine needs Node + mermaid-cli (which pulls a headless Chrome) to build a BRD.
- Layout can change when the data changes; boxes may move between versions.
- OI IDs inside the SVG are not clickable unless the build step adds links to the SVG afterwards. Nice to have, not required.

Inputs for later tickets:
- 08 (BRD data schema): the data file needs `process` = lanes (id, name, who, kind: person/system/external, optional OI) + steps (id, lane, Module prefix, label, note, kind: step/decision/external) + edges (from, to, label, alternate flag). Per Module: `statuses` (id, start/end/open flags) + `transitions` (from, to, trigger). The prototype's `P` and `FLOWS` objects are a hint for the shape.
- build-brd skill: runs the Mermaid generation and `mmdc` step. It must fail clearly if `mmdc` is missing.
- Suggested, not decided: print the step table (from variant D) under the process diagram so lanes are still clear in text.
