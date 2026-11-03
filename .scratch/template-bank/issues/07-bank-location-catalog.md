# Bank location and Neome App catalog

Type: grilling (HITL)
Status: resolved
Blocked by: 05

## Question

Where the bank lives (`neome-studio/reference/templates/` or elsewhere) and how it relates to the Neome App catalog: replace, sit on top, or beside.


## Answer

Locked with user (2026-11-03).

- **Location:** `neome-studio/reference/template-bank/{patterns,template-modules,templates}/`. Ships with plugin, beside catalog; skills read at runtime.
- **Relation:** beside. Catalog = what Neome sells (public site), stays only source for what an App does. Bank = what Neomenta built. One-way link bank → catalog (Template module Neome App hint = slug). Catalog never mentions bank.
- **Slug check:** Template module `neomeApp` front matter = slug in `neome-app-catalog-slugs.json` or `none`. Engine check in `npm test`.
- **Disagreement:** catalog wins on what an App can do; bank wins on how Neomenta usually delivers. Mismatch shown to Consultant as both, never silently picked. Display → Skill integration.
- **Client data:** scrubbed bank ships in plugin. OK because internal marketplace only. Plugin stays `UNLICENSED`, never public while bank inside.
- **Glossary:** new term **Template bank**.
