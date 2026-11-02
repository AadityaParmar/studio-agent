# MEM — Member Directory / Member Management

Prefix: MEM
Name: Member Directory / Member Management
Status: resolved
Sources: RFP-1, QA-1, QA-2

## 1 Purpose and KPIs

- Purpose: Maintain a directory of HOA members and manage member accounts. [RFP-1]
- Fix: one up-to-date member list. [QA-1]
- KPI: All Members registered within 1 month of go-live. [QA-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Register and manage member information, view the complete Member Directory |  | [RFP-1] |
| Member | Access the information associated with their own account |  | [RFP-1] |

- Headcount: no limit; any number of Board Members and Members. [QA-2]

## 3 Process

- Today the member list is kept in a spreadsheet; there is no one up-to-date member list. [QA-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Member | Name | text | yes |  | [RFP-1] |
| Member | Email | text | no |  | [RFP-1] |
| Member | Phone | text | yes |  | [RFP-1] |
| Member | Address | text | yes |  | [RFP-1] |
| Member | Number of Family Members | number | no | recorded under the primary Member; family members get no separate logins [QA-1] | [RFP-1, QA-1] |
| Member | Number of Cards | number | no | purpose unclear, see OI-05 | [RFP-1] |
| Member | Status | choice | yes | Values: Active / Inactive [QA-1] | [QA-1] |

- No other member information for now (no family details, property ownership, emergency contacts or vehicle information); only the fields above. [QA-1]

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| active | start |  | [QA-1] |
| inactive | end |  | [QA-1] |

| from | to | trigger | Source |
|---|---|---|---|
| active | inactive | Board Member sets Inactive when the Member moves out or sells | [QA-1] |

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| No registration approval | Board Member registers a Member | Member is saved Active; no approval step | [QA-1] |
| Login invite | Member account is created | Member gets a login invite by Neome app notification | [QA-1] |
| Login stopped | Member set Inactive | Member can no longer log in; record kept | [QA-1] |

- Notification channel: Neome app notification only; no email, SMS or WhatsApp. [QA-1]

## 7 Exceptions

- Member moves out or sells: Board Member sets the Member Inactive; record kept, not deleted; login stopped. [QA-1]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Total number of members | Board Member | Count of Members (potential dashboard) | [RFP-1] |

- Board dashboard: total Members; open tickets and tickets by status; payments due, collected, pending, overdue; upcoming events. [QA-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | both | Member records; spreadsheet today, Neome is the system of record after go-live | Board Member | [QA-1] |

- No migration: fresh start, no existing member data moved in. [QA-2]

## 10 Volumes and NFRs

- Volumes: no limit; Members and Board Members are unlimited. [QA-2]

## 11 Requirements

### MEM-01 — Member registration form

Statement: The member registration form captures Name, Phone and Address (required) and Email, Number of Family Members and Number of Cards (optional). [RFP-1]
Acceptance:
- A registration cannot be saved without Name, Phone and Address. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-02, OI-03, OI-04, OI-05, OI-37
Proposed: no

### MEM-02 — Member account scope

Statement: Each registered member has access only to the information associated with their own account. [RFP-1]
Acceptance:
- A Member cannot open another Member's account information. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-01, OI-37
Proposed: no

### MEM-03 — Complete directory for Board Members

Statement: Board Members can view the complete member directory. [RFP-1]
Acceptance:
- Board Members see all registered members. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-01, OI-37
Proposed: no
Delivery: Standard

### MEM-04 — Member onboarding

Statement: A new member is registered, gets a member account, is added to the HOA directory, and then gets access to the relevant modules. [RFP-1]
Acceptance:
- After registration, the member sees exactly the modules their role allows. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-04, OI-37
Proposed: no

### MEM-05 — Manage member information

Statement: Board Members can manage member information (add and update members). [RFP-1]
Acceptance:
- Board Members can manage HOA members. [RFP-1]
- Members cannot add or edit member records. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-03, OI-37
Proposed: no

### MEM-06 — Member status

Statement: A Member is Active or Inactive; a Board Member sets a Member Inactive when they move out or sell, the record is kept and their login stops. [QA-1]
Acceptance:
- An Inactive Member cannot log in and still shows in the Board Members' directory with status Inactive. [QA-1]
- A Member record cannot be deleted. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-35, OI-37
Proposed: no

### MEM-07 — Login invite on registration

Statement: When a Board Member registers a Member, no approval is needed and the Member gets a login invite. [QA-1]
Acceptance:
- A newly registered Member receives a login invite without any approval step. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-23, OI-36, OI-37
Proposed: no

### MEM-08 — Total number of members

Statement: Board Members see the total number of Members. [RFP-1]
Acceptance:
- A Board Member sees the count of Members, split by Active and Inactive. [QA-1]
Priority: Could
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-26, OI-37
Proposed: no
Delivery: Standard

## 12 Neome mapping

Neome App: `employee-directory`
Delivery: Configuration
How: Member → Employee record set up for HOA Members: Name, Phone, Address, Email, Number of Family Members, Number of Cards as fields; status Active / Inactive (exit as status change, record kept); Board Member and Member roles scoped so a Member sees only their own account; login invite as an automation; directory sheet and Headcount report for Board Members; fit for non-employee people to verify (OI-38); Member sees only own account, Board Members the full directory [QA-1]; family members recorded under the primary Member with no separate login [QA-1]; Number of Cards purpose open (OI-05) (proposed, to confirm)

## 13 Open Items

- OI-05: What is the "Number of Cards" field for?
- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-38: Can the Employee Directory App hold HOA Members (not employees), or is a Custom module needed?
