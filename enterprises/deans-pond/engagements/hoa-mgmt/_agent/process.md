# Process

Skeleton from `review-draft`. Each `resolve-module` refines its Module's section.

## Lanes

| id | name | who | kind | OI | Source |
|---|---|---|---|---|---|
| board | Board Members | Board Member | person |  | RFP-1 |
| member | Members | Member | person |  | RFP-1 |
| notify | Notifications | Notification channel | system | OI-23 | RFP-1 |

## MEM — Member Directory / Member Management

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| register-member | board | MEM | Register member | Board Member fills the registration form (proposed, to confirm) | step | OI-04 | RFP-1 |
| create-member-account | board | MEM | Create member account | No approval step (proposed, to confirm) | step | OI-36 | RFP-1 |
| add-to-directory | board | MEM | Add member to Member Directory | Status Active (proposed, to confirm) | step | OI-35 | RFP-1 |
| send-login-invite | notify | MEM | Send login invite | Channel open (proposed, to confirm) | step | OI-23, OI-36 | (proposed, to confirm) |
| member-gets-access | member | MEM | Member gets access to relevant modules |  | step |  | RFP-1 |
| set-member-inactive | board | MEM | Set member Inactive | Moves out or sells; record kept, login stopped (proposed, to confirm) | step | OI-35 | (proposed, to confirm) |

## ANN — Announcements

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| create-announcement | board | ANN | Create announcement | General or Event / Party form; saved as Draft (proposed, to confirm) | step | OI-06, OI-40, OI-42 | RFP-1 |
| publish-announcement | board | ANN | Publish announcement | No approval step (proposed, to confirm) | step | OI-41 | RFP-1 |
| notify-new-announcement | notify | ANN | Notify Members of new announcement or event | Needs confirmation; channel open | step | OI-08, OI-23 | RFP-1 |
| view-announcement | member | ANN | View announcement | Read-only | step |  | RFP-1 |
| archive-announcement | board | ANN | Archive announcement | Board Member archives; events archive after event date (proposed, to confirm) | step | OI-42 | (proposed, to confirm) |

## TKT — Tickets

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| raise-ticket | member | TKT | Raise ticket |  | step | OI-09 | RFP-1 |
| review-ticket | board | TKT | Review ticket and take action |  | step |  | RFP-1 |
| update-ticket-status | board | TKT | Update ticket status |  | step | OI-10 | RFP-1 |
| view-ticket-update | member | TKT | View ticket update |  | step | OI-11 | RFP-1 |
| close-ticket | board | TKT | Close ticket |  | step |  | RFP-1 |

## RPAY — Raise Payment

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| raise-payment | board | RPAY | Raise payment | Fields open | step | OI-18 | RFP-1, WS-1 |
| pick-members | board | RPAY | Pick applicable Members |  | step |  | RFP-1, WS-1 |
| create-payment-entries | board | RPAY | Create one Payment entry per Member | Automatic | step |  | WS-1 |

## PAY — Payment

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| view-pending-payment | member | PAY | View pending payment |  | step |  | RFP-1 |
| send-payment-reminder | notify | PAY | Send reminder one month before due date | Channel open | step | OI-23 | RFP-1 |
| record-payment | board | PAY | Mark entry paid | No online payment | step | OI-28 | WS-1 |
| update-payment-history | member | PAY | Payment history updated |  | step |  | RFP-1 |

## VEN — Vendors

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-vendor | board | VEN | Add vendor |  | step |  | RFP-1 |
| store-vendor-documents | board | VEN | Store vendor info and Government ID Proof |  | step | OI-19, OI-21 | RFP-1 |
| list-vendor | board | VEN | List vendor in directory |  | step |  | RFP-1 |
| view-vendor | member | VEN | View vendor details | Gov ID visibility open | step | OI-20 | RFP-1 |

## Edges

| from | to | label | alternate | Source |
|---|---|---|---|---|
| register-member | create-member-account |  | no | RFP-1 |
| create-member-account | add-to-directory |  | no | RFP-1 |
| add-to-directory | send-login-invite |  | no | (proposed, to confirm) |
| send-login-invite | member-gets-access |  | no | (proposed, to confirm) |
| member-gets-access | set-member-inactive | Member moves out or sells | yes | (proposed, to confirm) |
| member-gets-access | view-announcement | Member can view | yes | RFP-1 |
| create-announcement | publish-announcement |  | no | RFP-1 |
| publish-announcement | notify-new-announcement |  | no | RFP-1 |
| notify-new-announcement | view-announcement |  | no | RFP-1 |
| publish-announcement | view-announcement | Member opens list | yes | RFP-1 |
| view-announcement | archive-announcement | Out of date or event over | yes | (proposed, to confirm) |
| member-gets-access | raise-ticket | Member can raise | yes | RFP-1 |
| raise-ticket | review-ticket |  | no | RFP-1 |
| review-ticket | update-ticket-status |  | no | RFP-1 |
| update-ticket-status | view-ticket-update |  | no | RFP-1 |
| view-ticket-update | close-ticket |  | no | RFP-1 |
| add-to-directory | pick-members | Members to pick from | yes | WS-1 |
| raise-payment | pick-members |  | no | RFP-1, WS-1 |
| pick-members | create-payment-entries |  | no | WS-1 |
| create-payment-entries | view-pending-payment |  | no | RFP-1, WS-1 |
| view-pending-payment | send-payment-reminder |  | no | RFP-1 |
| send-payment-reminder | record-payment |  | no | WS-1 |
| record-payment | update-payment-history |  | no | RFP-1 |
| add-vendor | store-vendor-documents |  | no | RFP-1 |
| store-vendor-documents | list-vendor |  | no | RFP-1 |
| list-vendor | view-vendor |  | no | RFP-1 |
| member-gets-access | view-vendor | Member can view | yes | RFP-1 |
