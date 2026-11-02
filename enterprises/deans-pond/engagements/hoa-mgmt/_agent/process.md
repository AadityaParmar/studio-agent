# Process

Skeleton from `review-draft`. Each `resolve-module` refines its Module's section.

## Lanes

| id | name | who | kind | OI | Source |
|---|---|---|---|---|---|
| board | Board Members | Board Member | person |  | RFP-1 |
| member | Members | Member | person |  | RFP-1 |
| notify | Notifications | Neome app notification | system |  | RFP-1, QA-1 |

## MEM — Member Directory / Member Management

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| register-member | board | MEM | Register member | Board Member fills the registration form | step |  | RFP-1, QA-1 |
| create-member-account | board | MEM | Create member account | No approval step | step |  | RFP-1, QA-1 |
| add-to-directory | board | MEM | Add member to Member Directory | Status Active | step |  | RFP-1, QA-1 |
| send-login-invite | notify | MEM | Send login invite | Neome app notification | step |  | QA-1 |
| member-gets-access | member | MEM | Member gets access to relevant modules |  | step |  | RFP-1 |
| set-member-inactive | board | MEM | Set member Inactive | Moves out or sells; record kept, login stopped | step |  | QA-1 |

## ANN — Announcements

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| create-announcement | board | ANN | Create announcement | General or Event / Party form; saved as Draft | step |  | RFP-1, QA-1 |
| publish-announcement | board | ANN | Publish announcement | No approval step | step |  | RFP-1, QA-1 |
| notify-new-announcement | notify | ANN | Notify Members of new announcement or event | All Members; Neome app notification | step |  | RFP-1, QA-1 |
| view-announcement | member | ANN | View announcement | Read-only | step |  | RFP-1 |
| archive-announcement | board | ANN | Archive announcement | Board Member archives; events archive after event date | step |  | QA-1 |

## TKT — Tickets

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| raise-ticket | member | TKT | Raise ticket | Title, Category, Description; optional photo or document; status Open | step |  | RFP-1, QA-1 |
| notify-new-ticket | notify | TKT | Notify Board Members of new ticket | Neome app notification [QA-1] | step |  | (proposed, to confirm) |
| review-ticket | board | TKT | Review ticket and take action | Any Board Member; no assignment, no approval; status In Progress | step |  | RFP-1, QA-1 |
| update-ticket-status | board | TKT | Update ticket status and add update | Board Member only; status Resolved when done | step |  | RFP-1, QA-1 |
| notify-ticket-update | notify | TKT | Notify Member of status change or response | Each status change and Board response; Neome app notification | step |  | RFP-1, QA-1 |
| view-ticket-update | member | TKT | View ticket update | Member can add comments on own ticket | step |  | RFP-1, QA-1 |
| close-ticket | board | TKT | Close ticket | Board Member closes; no reopen | step |  | RFP-1, QA-1 |

## RPAY — Raise Payment

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| raise-payment | board | RPAY | Raise payment | Title, Amount, Due date, category; Description optional; saved as Draft | step |  | RFP-1, WS-1, QA-1 |
| pick-members | board | RPAY | Pick applicable Members | From member list, or all; no limit | step |  | RFP-1, WS-1, WS-2 |
| create-payment-entries | board | RPAY | Create one Payment entry per Member | Automatic on save; no approval; status Raised | step |  | WS-1, QA-1 |
| notify-new-payment-request | notify | RPAY | Notify Members of new payment request | Each listed Member; Neome app notification | step |  | RFP-1, QA-1 |
| cancel-raise | board | RPAY | Cancel raise | Unpaid entries cancelled [QA-1]; raise again (proposed, to confirm) | step |  | QA-1 |

## PAY — Payment

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| view-pending-payment | member | PAY | View pending payment | Own entries only; status Pending | step |  | RFP-1, WS-3 |
| send-payment-reminder | notify | PAY | Send reminder one month before due date | Neome app notification only | step |  | RFP-1, WS-3, QA-1 |
| send-overdue-reminder | notify | PAY | Mark Overdue and send weekly overdue reminder | Automatic after due date; weekly until Paid, Waived or Cancelled; Neome app notification only | step |  | WS-3, QA-1 |
| record-payment | board | PAY | Record payment and mark Paid | Board Member only; paid date, method, reference; proof of payment doc optional; no online payment, no part payment | step |  | WS-1, WS-3, QA-1 |
| notify-payment-received | notify | PAY | Notify Member payment received | Neome app notification only | step |  | WS-3, QA-1 |
| update-payment-history | member | PAY | Payment history updated | Status Paid | step |  | RFP-1, WS-3 |
| download-invoice | member | PAY | Download invoice | PDF per entry | step |  | WS-3 |
| waive-payment | board | PAY | Waive payment | Reason required; status Waived, final | step |  | WS-3 |
| undo-paid | board | PAY | Undo wrong Paid | Back to Pending or Overdue with reason; change logged | step |  | WS-3 |

## VEN — Vendors

| id | lane | Module | label | note | kind | OI | Source |
|---|---|---|---|---|---|---|---|
| add-vendor | board | VEN | Add vendor | Name, category, contact, Gov ID required; no approval | step |  | RFP-1, QA-1 |
| store-vendor-documents | board | VEN | Store vendor info and Government ID Proof | Gov ID: one US photo ID; Board Members only; kept forever, secured in Neome | step |  | RFP-1, QA-1, QA-2 |
| list-vendor | board | VEN | List vendor in directory | Status Active | step |  | RFP-1, QA-1 |
| view-vendor | member | VEN | View vendor details | Read-only; Active vendors only; filter by category | step |  | RFP-1, QA-1 |
| update-vendor | board | VEN | Update vendor information | New contact or ID document | step |  | RFP-1 |
| deactivate-vendor | board | VEN | Set vendor Inactive | HOA stops using vendor; record kept | step |  | QA-1 |

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
| raise-ticket | notify-new-ticket |  | no | (proposed, to confirm) |
| notify-new-ticket | review-ticket |  | no | (proposed, to confirm) |
| raise-ticket | review-ticket | Board Member opens list | yes | RFP-1 |
| review-ticket | update-ticket-status |  | no | RFP-1 |
| update-ticket-status | notify-ticket-update |  | no | RFP-1 |
| notify-ticket-update | view-ticket-update |  | no | RFP-1 |
| update-ticket-status | view-ticket-update | Member opens ticket | yes | RFP-1 |
| view-ticket-update | close-ticket |  | no | RFP-1 |
| review-ticket | close-ticket | Duplicate or raised by mistake | yes | (proposed, to confirm) |
| add-to-directory | pick-members | Members to pick from | yes | WS-1 |
| raise-payment | pick-members |  | no | RFP-1, WS-1 |
| pick-members | create-payment-entries |  | no | WS-1 |
| create-payment-entries | notify-new-payment-request |  | no | RFP-1 |
| notify-new-payment-request | view-pending-payment |  | no | RFP-1 |
| create-payment-entries | view-pending-payment | Member opens payments | yes | RFP-1, WS-1 |
| create-payment-entries | cancel-raise | Wrong amount or due date | yes | (proposed, to confirm) |
| view-pending-payment | send-payment-reminder |  | no | RFP-1 |
| send-payment-reminder | record-payment |  | no | WS-1, WS-3 |
| send-payment-reminder | send-overdue-reminder | Due date passes, not paid | yes | WS-3 |
| send-overdue-reminder | record-payment |  | no | WS-3 |
| send-overdue-reminder | waive-payment | Member not liable | yes | WS-3 |
| record-payment | notify-payment-received |  | no | WS-3 |
| notify-payment-received | update-payment-history |  | no | WS-3 |
| record-payment | update-payment-history | Member opens payments | yes | RFP-1 |
| record-payment | undo-paid | Marked Paid by mistake | yes | WS-3 |
| undo-paid | view-pending-payment | Back to Pending or Overdue | no | WS-3 |
| view-pending-payment | download-invoice | Member downloads invoice | yes | WS-3 |
| update-payment-history | download-invoice | Member downloads paid invoice | yes | WS-3 |
| add-vendor | store-vendor-documents |  | no | RFP-1 |
| store-vendor-documents | list-vendor |  | no | RFP-1 |
| list-vendor | view-vendor |  | no | RFP-1 |
| list-vendor | update-vendor | Vendor details change | yes | RFP-1 |
| update-vendor | list-vendor |  | no | RFP-1 |
| list-vendor | deactivate-vendor | HOA stops using vendor | yes | (proposed, to confirm) |
| member-gets-access | view-vendor | Member can view | yes | RFP-1 |
