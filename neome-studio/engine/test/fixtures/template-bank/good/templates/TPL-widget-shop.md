---
id: TPL-widget-shop
kind: template
name: Small widget shop
businessType: Small shop that hands out widgets
modules:
  core: [TMOD-widgets]
  optional: [TMOD-gizmos]
seenIn:
  - {build: NB-90, area: "*"}
---

# Small widget shop

## Modules

- Core: Widgets.
- Optional: Gizmos.

## Links between modules

- Widgets → Gizmos (ref).

## Flowchart

```mermaid
flowchart LR
  W[Widgets] --> G[Gizmos]
```
