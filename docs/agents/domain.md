# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring.

## Before exploring, read these

- **`GLOSSARY-MAP.md`** at the repo root — points at each glossary. Read each one relevant to the topic.
- **`GLOSSARY.md`** at the repo root — the studio's own language (Consultant, Enterprise, Engagement, Module, Requirement, Open Item...).
- **`enterprises/<enterprise>/GLOSSARY.md`** — one per Enterprise, holding that business's domain language.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── GLOSSARY-MAP.md
├── GLOSSARY.md                        ← studio terms
├── docs/adr/                          ← studio-wide decisions
└── enterprises/
    └── <enterprise>/
        └── GLOSSARY.md                ← Enterprise terms
```

Studio terms are fixed. Enterprise terms name things inside a Module and never redefine studio terms.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a proposal, a hypothesis, a test name), use the term as defined in the glossary. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (...) — but worth reopening because…_
