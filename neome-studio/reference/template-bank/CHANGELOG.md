# Template bank changelog

One line per applied change, newest last. Written by the maintainer refine tool; `npm test` checks every line. Never edit or delete old lines.

Every line starting with `- ` outside a code fence is a change, so this header uses none. Line shape (fields split by ` | `):

```
- <YYYY-MM-DD> | <change> | <IDs> | <reason>
```

`<change>`: `add`, `enhance`, `split`, `merge`, `rename`, `retire`.

`<IDs>`: comma-separated Template bank IDs. `split`, `merge`, `rename` write `<old IDs> -> <new IDs>`; the right side is `replacedBy`. `add`, `enhance`, `retire` take no `->`. Rename = one old -> one new. Merge = old IDs -> the one kept ID (old names go to its `aliases`). Split = one old -> two or more new. Retire = ID gone, nothing replaces it.

`<reason>`: short, required. No client words (scrub check).

Example:

```
- 2026-11-03 | add | TMOD-leave | seen in NB-02, NB-04
- 2026-12-01 | merge | TMOD-leave-request -> TMOD-leave | same flow
```

## Changes

