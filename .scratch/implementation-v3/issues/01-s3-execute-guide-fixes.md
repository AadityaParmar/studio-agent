# S3: execute-guide fixes from the dry run

Type: task
Status: open
Blocked by: —

## Question

Apply dry run lessons to `neome-studio/reference/template-bank/execute-guide/` + `EXECUTE.md`: list layout `filter.categoryFields` rejects pickText (use `groupByField`); option keys `key<Label>` for `defaultOption` / conditions; `validate` after each call group (write check ≠ validate); never read a whole schema (list layout 88 KB) — extract with a script; one write at a time. Gate: `npm test`.

## Comments
