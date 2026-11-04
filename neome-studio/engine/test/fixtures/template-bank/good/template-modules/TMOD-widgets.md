---
id: TMOD-widgets
kind: template-module
name: Widgets
aliases: [Widgets, WidgetRequests]
patterns: [PAT-sign-off-by-flag]
neomeApp: widget-desk
delivery: configuration
seenIn:
  - {build: NB-90, area: Widgets}
  - {build: NB-91, area: Widgets}
---

# Widgets

## Usual needs

- Staff ask for a widget.
- Checker ticks done.

## Process steps

1. Ask → 2. Check → 3. Tell.

## Usual sheets, key fields, roles

- Widget request: Asker `pickUser`, Flag `{Open|Done}`.
- Roles: Staff, Checker.

## Neome App / Delivery hint

`widget-desk`, Configuration. Hint only, to confirm.

## Flowchart

```mermaid
flowchart LR
  A[Ask] --> B[Check] --> C[Tell]
```
