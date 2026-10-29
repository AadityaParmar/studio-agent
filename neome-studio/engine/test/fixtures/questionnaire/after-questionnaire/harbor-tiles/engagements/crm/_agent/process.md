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
| make-quotation | sales | QUO | Make quotation | Lines in boxes and sq ft; one discount % | step | | CE-1, WS-2 |
| approve-discount | head | QUO | Approve discount | Discount above 8% | decision | OI-10 | WS-2 |
| credit-check | accounts | QUO | Credit check | Contractor with an invoice overdue over 60 days | decision | | WS-2 |
| send-quotation | sales | QUO | Send quotation | PDF by email | step | | CE-1, WS-2 |
| buyer-decides | sales | QUO | Buyer decides | Accept, say no, ask for changes, or let it expire | decision | OI-11 | WS-2 |
| invoice | tally | | Raise invoice | Accepted quotations only | external | OI-03 | WS-2 |

## Edges

| from | to | label | alternate | Source |
|---|---|---|---|---|
| log-enquiry | follow-up | | no | CE-1 |
| follow-up | serious | | no | CE-1 |
| serious | make-quotation | yes | no | CE-1 |
| make-quotation | approve-discount | discount above 8% | yes | WS-2 |
| make-quotation | credit-check | contractor overdue over 60 days | yes | WS-2 |
| make-quotation | send-quotation | | no | CE-1 |
| approve-discount | send-quotation | approved | no | WS-2 |
| approve-discount | make-quotation | rejected | yes | (proposed, to confirm) |
| credit-check | send-quotation | accounts OK | no | WS-2 |
| send-quotation | buyer-decides | | no | WS-2 |
| buyer-decides | invoice | accepted | no | WS-2 |
| buyer-decides | make-quotation | changes asked: revised quotation replaces it | yes | WS-2 |
