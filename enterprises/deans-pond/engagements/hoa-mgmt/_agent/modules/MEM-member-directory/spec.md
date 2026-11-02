# MEM — Member Directory / Member Management

Prefix: MEM
Name: Member Directory / Member Management
Status: resolved
Sources: RFP-1

## 1 Purpose and KPIs

- Purpose: Maintain a directory of HOA members and manage member accounts. [RFP-1]
- KPI: One up-to-date member list; all Members registered within 1 month of go-live. (proposed, to confirm)
- OI-33: What must the Member Directory fix today, and which number shows it works?

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Register and manage member information, view the complete Member Directory |  | [RFP-1] |
| Member | Access the information associated with their own account |  | [RFP-1] |

- OI-27: Headcount of Board Members and Members not stated.

## 3 Process

- Today the member list is kept in a spreadsheet. (proposed, to confirm)
- OI-33: What goes wrong today with the member list is not stated.
- OI-34: Where the member list is kept today is not stated.
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Member | Name | text | yes |  | [RFP-1] |
| Member | Email | text | no |  | [RFP-1] |
| Member | Phone | text | yes |  | [RFP-1] |
| Member | Address | text | yes |  | [RFP-1] |
| Member | Number of Family Members | number | no | family logins open, see OI-02 | [RFP-1] |
| Member | Number of Cards | number | no | purpose unclear, see OI-05 | [RFP-1] |
| Member | Status | choice | yes | Values: Active / Inactive; see OI-35 (proposed, to confirm) |  |

- OI-03: Which additional member information is in scope (family details, property ownership, emergency contacts, vehicle information)?

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| active | start | OI-35 | (proposed, to confirm) |
| inactive | end | OI-35 | (proposed, to confirm) |

| from | to | trigger | Source |
|---|---|---|---|
| active | inactive | Board Member sets Inactive when the Member moves out or sells (proposed, to confirm) |  |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| No registration approval | Board Member registers a Member | Member is saved Active; no approval step (proposed, to confirm) |  |
| Login invite | Member account is created | Member gets a login invite (proposed, to confirm) |  |
| Login stopped | Member set Inactive | Member can no longer log in; record kept (proposed, to confirm) |  |

- OI-36: Does a new member need approval, and is the Member told when their account is ready?
- OI-23: Notification channel for the login invite is open.

## 7 Exceptions

- Member moves out or sells: Board Member sets the Member Inactive; record kept, not deleted. (proposed, to confirm)
- OI-35: What happens to a Member who moves out or sells is not stated.

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Total number of members | Board Member | Count of Members (potential dashboard) | [RFP-1] |

- OI-26: Reporting and dashboard requirements not yet defined.

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | both | Member records; Neome is the system of record after go-live (proposed, to confirm) | OI-34 |  |

- OI-24: Existing member data may need migration.

## 10 Volumes and NFRs

- OI-27: Number of Members and Board Members not stated.

## 11 Requirements

### MEM-01 — Member registration form

Statement: The member registration form captures Name, Phone and Address (required) and Email, Number of Family Members and Number of Cards (optional). [RFP-1]
Acceptance:
- A registration cannot be saved without Name, Phone and Address. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-02, OI-03, OI-04, OI-05, OI-37
Proposed: yes

### MEM-02 — Member account scope

Statement: Each registered member has access only to the information associated with their own account. [RFP-1]
Acceptance:
- A Member cannot open another Member's account information. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-01, OI-37
Proposed: yes

### MEM-03 — Complete directory for Board Members

Statement: Board Members can view the complete member directory. [RFP-1]
Acceptance:
- Board Members see all registered members. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-01, OI-37
Proposed: yes
Delivery: Standard

### MEM-04 — Member onboarding

Statement: A new member is registered, gets a member account, is added to the HOA directory, and then gets access to the relevant modules. [RFP-1]
Acceptance:
- After registration, the member sees exactly the modules their role allows. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-04, OI-37
Proposed: yes

### MEM-05 — Manage member information

Statement: Board Members can manage member information (add and update members). [RFP-1]
Acceptance:
- Board Members can manage HOA members. [RFP-1]
- Members cannot add or edit member records. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-03, OI-37
Proposed: yes

### MEM-06 — Member status

Statement: A Member is Active or Inactive; a Board Member sets a Member Inactive when they move out or sell, the record is kept and their login stops. (proposed, to confirm)
Acceptance:
- An Inactive Member cannot log in and still shows in the Board Members' directory with status Inactive. (proposed, to confirm)
- A Member record cannot be deleted. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-35, OI-37
Proposed: yes

### MEM-07 — Login invite on registration

Statement: When a Board Member registers a Member, no approval is needed and the Member gets a login invite. (proposed, to confirm)
Acceptance:
- A newly registered Member receives a login invite without any approval step. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-23, OI-36, OI-37
Proposed: yes

### MEM-08 — Total number of members

Statement: Board Members see the total number of Members. [RFP-1]
Acceptance:
- A Board Member sees the count of Members, split by Active and Inactive. (proposed, to confirm)
Priority: Could
Scope: Neome
Sources: RFP-1
OIs: OI-26, OI-37
Proposed: yes
Delivery: Standard

## 12 Neome mapping

Neome App: `employee-directory`
Delivery: Configuration
How: Member → Employee record set up for HOA Members: Name, Phone, Address, Email, Number of Family Members, Number of Cards as fields; status Active / Inactive (exit as status change, record kept); Board Member and Member roles scoped so a Member sees only their own account; login invite as an automation; directory sheet and Headcount report for Board Members; fit for non-employee people to verify (OI-38); hangs on OI-01, OI-02, OI-03, OI-05, OI-35 (proposed, to confirm)

## 13 Open Items

- OI-01: Can Members view the directory and contact information of other Members? (Access Control Matrix says Member Yes; own-account-only says no)
- OI-02: Family members — separate login accounts or recorded under the primary Member?
- OI-03: Which additional member information is in scope (family details, property ownership, emergency contacts, vehicle information)?
- OI-04: Who registers a new member — Board Member or the member themselves?
- OI-05: What is the "Number of Cards" field for?
- OI-23: Which notification channels — Neome application notification, email, SMS, WhatsApp?
- OI-24: Existing member data may need migration.
- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-26: Reporting and dashboard requirements not yet defined.
- OI-27: Number of Members and Board Members not stated.
- OI-29: Currency, language, date format.
- OI-30: Hosting, data residency, SSO needs.
- OI-31: Who trains Board Members and Members.
- OI-32: Support after go-live.
- OI-33: What must the Member Directory fix today, and which KPI shows it works?
- OI-34: Where is the member list kept today; is Neome the master after go-live?
- OI-35: Member stages, and what happens when a Member moves out or sells?
- OI-36: Does a new member need approval; is the Member told when their account is ready?
- OI-38: Can the Employee Directory App hold HOA Members (not employees), or is a Custom module needed?
- OI-37: Confirm proposed priority, Scope tag and acceptance criteria of MEM Requirements.
