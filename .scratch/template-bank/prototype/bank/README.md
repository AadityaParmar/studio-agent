# Bank format sample (ticket: Bank format)

Throwaway. Hand-written from digests of NB-02, NB-04, NB-05 (scrubbed). Shows the locked format only; content not reviewed.

- One file per entry. File name = ID. Prefix: `PAT-` Pattern, `TMOD-` Template module, `TPL-` Template.
- Markdown + YAML front matter. Scripts read front matter; models read body.
- Evidence: `seenIn` = scrubbed Build code `NB-NN` + Build area. Code → client map only in gitignored `raw/`.
- No minimum Build count; consumers weigh `seenIn`.
- Mermaid inline.
- IDs referenced but not yet written are marked `(not written)`.
