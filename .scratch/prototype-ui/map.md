# Prototype UI redesign: map

## Notes

- Spec: [spec.md](spec.md). Plan: [plan.md](plan.md). Mockup: [mockup-how-it-works.html](mockup-how-it-works.html).
- Branch `prototype-ui-2026-11-04`. Not merged to `main`: skill text changed (`build-prototype` SKILL.md 3.4, `prototype-data.md`), so evals run first (route §1.4).

## Decisions so far

- 2026-11-04 · **Supersedes D09/D10 (parts).** Prototype tabs = How it works (default: swimlane flow map + guided steps with hotspot, behind the scenes, who gets a message, question / "look right?") · Try it (desktop or phone, role chips) · By role · Questions for you (answers + Copy answers → PF Input). Neome look kept for screens inside the page. Requirement IDs, counts, coverage and trace only in Consultant mode. One "made-up examples" note replaces `sample` chips; proposed = dotted underline; open question = "?".
- 2026-11-04 · Step keys `label`, `behind`, `notify` (optional). Create step derived: first touch of a start-status row, no transition, action starts with a create word. Owner-based rule dropped: it marked views of existing rows as creates (Deans Pond VEN, MEM).
- 2026-11-04 · Trace tab ids: `how`, `try` (`phone: true` for phone places).

## Fog

- Deans Pond data predates `label` / `notify`: some flow boxes cut long text, system steps ("tells the Board") say "Nobody". Fixed on the next resolve-module revisit per Module, not by hand (`_agent/` is skill-owned).
- Real Neome approval-from-chat screen still unseen (route §5); chat stays "layout guessed".
