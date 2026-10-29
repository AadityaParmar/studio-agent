# Process

## Lanes

| id | name | who | kind | OI | Source |
|---|---|---|---|---|---|
| sales | Sales team | Sales executives | person | | CE-1 |
| head | Sales head | Sales head | person | | CE-1 |
| tally | Tally ERP | Accounts | external | OI-03 | CE-1 |

## LEAD — Leads

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| capture-lead | sales | LEAD | Capture Lead | From call or walk-in | step | | CE-1 |
| qualify | sales | LEAD | Qualified? | | decision | | CE-1 |

## QUO — Quotes

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| draft-quote | sales | QUO | Draft Quote | | step | | CE-1 |
| approve-discount | head | QUO | Approve discount | | decision | OI-01 | (proposed, to confirm) |
| post-invoice | tally | | Post invoice | Tally side | external | | CE-1 |

## Edges

| from | to | label | alternate | Source |
|---|---|---|---|---|
| capture-lead | qualify | | no | CE-1 |
| qualify | draft-quote | yes | no | CE-1 |
| qualify | capture-lead | no, nurture | yes | CE-1 |
| draft-quote | approve-discount | discount | yes | (proposed, to confirm) |
| draft-quote | post-invoice | accepted | no | CE-1 |
