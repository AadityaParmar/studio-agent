---
status: open
prefix: MEM
name: Member Directory / Member Management
draft: true
blockedBy: []
---

# MEM — Member Directory / Member Management

Name: Member Directory / Member Management

## 1 Purpose and KPIs

- Purpose: Maintain a directory of HOA members and manage member accounts. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Manage member information, view the complete member directory |  | [RFP-1] |
| Member | Access the information associated with their own account |  | [RFP-1] |

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Member | Name | text | yes |  | [RFP-1] |
| Member | Email | text | no |  | [RFP-1] |
| Member | Phone | text | yes |  | [RFP-1] |
| Member | Address | text | yes |  | [RFP-1] |
| Member | Number of Family Members | number | no |  | [RFP-1] |
| Member | Number of Cards | number | no | purpose unclear, see OI-05 | [RFP-1] |

## 11 Requirements

### MEM-01 — Member registration form

Statement: The member registration form captures Name, Phone and Address (required) and Email, Number of Family Members and Number of Cards (optional). [RFP-1]
Acceptance:
- A registration cannot be saved without Name, Phone and Address. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-04, OI-05
Proposed: yes

### MEM-02 — Member account scope

Statement: Each registered member has access only to the information associated with their own account. [RFP-1]
Acceptance:
- A Member cannot open another Member's account information. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-01
Proposed: yes

### MEM-03 — Complete directory for Board Members

Statement: Board Members can view the complete member directory. [RFP-1]
Acceptance:
- Board Members see all registered members. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-01
Proposed: yes

### MEM-04 — Member onboarding

Statement: A new member is registered, gets a member account, is added to the HOA directory, and then gets access to the relevant modules. [RFP-1]
Acceptance:
- After registration, the member sees exactly the modules their role allows. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-04
Proposed: yes

### MEM-05 — Manage member information

Statement: Board Members can manage member information (add and update members). [RFP-1]
Acceptance:
- Board Members can manage HOA members. [RFP-1]
- Members cannot add or edit member records. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-03
Proposed: yes

## 13 Open Items

- OI-01: Can Members view the directory and contact information of other Members? (Access Control Matrix says Member Yes; own-account-only says no)
- OI-02: Family members — separate login accounts or recorded under the primary Member?
- OI-03: Which additional member information is in scope (family details, property ownership, emergency contacts, vehicle information)?
- OI-04: Who registers a new member — Board Member or the member themselves?
- OI-05: What is the "Number of Cards" field for?
