# Process

Skeleton from `review-draft`. Each `resolve-module` refines its Module's section.

## Lanes

| id | name | who | kind | OI | Source |
|---|---|---|---|---|---|
| sales | Sales execs | Sales exec | person | | CE-1 |
| head | Sales head | Sales head | person | | CE-1 |
| accounts | Accounts | Accounts | person | | CE-1, CE-2 |
| tally | Tally | Accounts | external | OI-03 | CE-1 |

## ENQ — Enquiries

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| log-enquiry | sales | ENQ | Log enquiry | Phone, WhatsApp or walk-in | step | | CE-1 |
| follow-up | sales | ENQ | Follow up | Reminder when idle | step | OI-02 | (proposed, to confirm) |
| serious | sales | ENQ | Serious enquiry? | | decision | | CE-1 |

## QUO — Quotations

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| make-quotation | sales | QUO | Make quotation | | step | | CE-1 |
| approve-discount | head | QUO | Approve discount | Above the usual | decision | OI-01 | CE-1 |
| credit-check | accounts | QUO | Credit check | Overdue over 60 days | decision | OI-04 | CE-2 |
| send-quotation | sales | QUO | Send quotation | PDF by email | step | | CE-1 |
| invoice | tally | | Raise invoice | After acceptance | external | OI-03 | CE-1 |

## Edges

| from | to | label | alternate | Source |
|---|---|---|---|---|
| log-enquiry | follow-up | | no | CE-1 |
| follow-up | serious | | no | CE-1 |
| serious | make-quotation | yes | no | CE-1 |
| make-quotation | approve-discount | discount above usual | yes | CE-1 |
| make-quotation | credit-check | contractor overdue | yes | CE-2 |
| make-quotation | send-quotation | | no | CE-1 |
| approve-discount | send-quotation | approved | no | CE-1 |
| credit-check | send-quotation | accounts OK | no | CE-2 |
| send-quotation | invoice | accepted | no | CE-1 |
