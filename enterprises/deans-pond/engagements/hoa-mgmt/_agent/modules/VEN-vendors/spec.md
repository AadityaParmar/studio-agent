# VEN — Vendors

Prefix: VEN
Name: Vendors
Status: resolved
Sources: RFP-1

## 1 Purpose and KPIs

- Purpose: Maintain a directory of vendors used or recommended by the HOA. [RFP-1]
- KPI: One trusted vendor list Members can find; directory kept up to date. (proposed, to confirm)
- OI-54: What goes wrong today when Members need a vendor, and which KPI shows it works?

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Add, view and update vendors; maintain vendor documents and identification details |  | [RFP-1] |
| Member | View the vendor directory (read-only) |  | [RFP-1] |

- OI-27: Headcount of Board Members and Members not stated.
- OI-20: Can Members see vendor Government ID Proof? (Access Control Matrix says Yes; §9.3 says confirm first) [RFP-1]

## 3 Process

- OI-54: How vendors are found and kept today, and what goes wrong, is not stated.
- OI-57: Where the vendor list is kept today is not stated.
- TO-BE: Board Member adds vendor → vendor information and documents stored → vendor listed in directory → Members view vendor details. [RFP-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Vendor | Vendor Name | text | yes |  | [RFP-1] |
| Vendor | Service Type / Category | choice | yes | Values: Landscaping / Plumber / Electrician / Maintenance / Other (proposed, to confirm); see OI-56. Examples: grass cutting / landscaping, plumber, electrician, maintenance, other HOA service providers [RFP-1] | [RFP-1] |
| Vendor | Contact Number | text | yes |  | [RFP-1] |
| Vendor | Email | text | no |  | [RFP-1] |
| Vendor | Address | text | no |  | [RFP-1] |
| Vendor | Government ID Proof | file | yes | sensitive personal information [RFP-1]; see OI-19, OI-20, OI-21 | [RFP-1] |
| Vendor | Additional Notes | text | no |  | [RFP-1] |
| Vendor | Status | choice | yes | Values: Active / Inactive (proposed, to confirm); see OI-55 |  |

- OI-19: Which government ID proof types are collected?
- OI-56: Is Service Type / Category a fixed list, and which values?
- OI-22: Is vendor rating / feedback required?

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| active | start | OI-55 | (proposed, to confirm) |
| inactive | end | OI-55 | (proposed, to confirm) |

| from | to | trigger | Source |
|---|---|---|---|
| active | inactive | Board Member sets Inactive when the HOA stops using the vendor (proposed, to confirm) |  |
| inactive | active | Board Member reactivates the vendor (proposed, to confirm) |  |

- OI-55: Vendor stages, removal and approval to add.

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Board-only edit | Member opens the vendor directory | No add or edit action offered; read-only | [RFP-1] |
| Government ID Proof restricted | Vendor record opened | Government ID Proof shown to Board Members only (proposed, to confirm) | [RFP-1] |
| No approval to add | Board Member saves a new vendor | Vendor listed at once; no second Board Member approval (proposed, to confirm) |  |
| Active vendors only | Member opens the vendor directory | Only Active vendors listed (proposed, to confirm) |  |

- OI-20: Can Members see Government ID Proof?
- OI-21: Retention and security of Government ID Proof.
- OI-55: Does adding a vendor need another Board Member's approval?

## 7 Exceptions

- HOA stops using a vendor: Board Member sets the vendor Inactive; record and documents kept, not deleted. (proposed, to confirm)
- Vendor details change (new number, new ID): Board Member updates the vendor record. [RFP-1]
- OI-55: Can a vendor be removed?

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Vendors by category | Board Member, Member | Active vendors filtered by Service Type / Category (proposed, to confirm) |  |

- OI-26: Reporting and dashboard requirements not yet defined.

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Vendor directory; Neome is the master after go-live (proposed, to confirm) | OI-57 |  |

- OI-57: Where is the vendor list kept today; is Neome the system of record?
- OI-24: Existing vendor data may need migration.

## 10 Volumes and NFRs

- OI-57: How many vendors?
- OI-21: How long Government ID Proof is kept, and its security needs.
- OI-25: US privacy rules for vendor ID documents.

## 11 Requirements

### VEN-01 — Vendor directory fields

Statement: The vendor directory records Vendor Name, Service Type / Category, Contact Number and Government ID Proof (required) and Email, Address and Additional Notes (optional). [RFP-1]
Acceptance:
- A vendor cannot be saved without Vendor Name, Service Type / Category, Contact Number and Government ID Proof. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-19, OI-37
Proposed: yes

### VEN-02 — Vendor management

Statement: Board Members can add vendors, view vendors, update vendor information, and maintain vendor documents and identification details. [RFP-1]
Acceptance:
- Board Members can maintain the vendor directory. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-37
Proposed: yes

### VEN-03 — Member read-only vendor directory

Statement: Members have read-only access to the vendor directory. [RFP-1]
Acceptance:
- Members can access the approved vendor directory. [RFP-1]
- A Member is offered no add or edit action on any vendor. (proposed, to confirm)
Priority: Must
Scope: Neome
Sources: RFP-1
OIs: OI-20, OI-37
Proposed: yes

### VEN-04 — Government ID Proof restricted

Statement: Government ID Proof holds sensitive personal information and is shown to Board Members only. [RFP-1] (proposed, to confirm)
Acceptance:
- A Member viewing a vendor does not see or download its Government ID Proof. (proposed, to confirm)
- Government ID Proof is kept and secured per the agreed retention and security rules. (proposed, to confirm)
Priority: Must
Scope: Neome TBC
Sources: RFP-1
OIs: OI-20, OI-21, OI-25, OI-37
Proposed: yes

### VEN-05 — Service categories

Statement: Service Type / Category is picked from a fixed list: Landscaping, Plumber, Electrician, Maintenance, Other. (proposed, to confirm)
Acceptance:
- A Board Member picks one category per vendor from the list. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: RFP-1
OIs: OI-56, OI-37
Proposed: yes

### VEN-06 — Vendor stages

Statement: A vendor is Active or Inactive; a Board Member sets a vendor Inactive when the HOA stops using it, and Members see Active vendors only. (proposed, to confirm)
Acceptance:
- An Inactive vendor does not show in the Members' directory and is not deleted. (proposed, to confirm)
- A Board Member can set an Inactive vendor Active again. (proposed, to confirm)
Priority: Should
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-55, OI-37
Proposed: yes

### VEN-07 — Find vendors by category

Statement: Board Members and Members can filter the vendor directory by Service Type / Category. (proposed, to confirm)
Acceptance:
- Picking a category lists only Active vendors of that category. (proposed, to confirm)
Priority: Could
Scope: Neome
Sources: (proposed, to confirm)
OIs: OI-56, OI-37
Proposed: yes

## 12 Neome mapping

Neome App: `purchase-management`
Delivery: Configuration
How: Vendor → Vendor (vendor master) only, no purchase requests or orders; Service Type / Category as a master list; Government ID Proof as a restricted document field seen by Board Members only; Active / Inactive stages; Members read-only with a category filter on Active vendors; HOA Members as people who are not employees (OI-38); hangs on OI-19, OI-20, OI-21, OI-55, OI-56, OI-58 (proposed, to confirm)

## 13 Open Items

- OI-19: Which government ID proof is collected for vendors?
- OI-20: Can Members see vendor Government ID Proof, or Board only?
- OI-21: Retention and security of vendor Government ID Proof.
- OI-22: Is vendor rating / feedback required?
- OI-23: Which notification channels — Neome application notification, email, SMS, WhatsApp?
- OI-24: Existing data may need migration.
- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-26: Reporting and dashboard requirements not yet defined.
- OI-27: Number of Members, Board Members and vendors not stated.
- OI-29: Currency, language, date format.
- OI-30: Hosting, data residency, SSO needs.
- OI-31: Who trains Board Members and Members.
- OI-32: Support after go-live.
- OI-37: Confirm proposed priority, Scope tag and acceptance criteria of VEN Requirements.
- OI-38: Can HOA Members (people who are not employees) be set up as users, or is a Custom module needed?
- OI-54: What goes wrong today with vendors, and which KPI shows it works?
- OI-55: Vendor stages; removal; approval to add.
- OI-56: Is Service Type / Category a fixed list, and which values?
- OI-57: Vendor count; where kept today; is Neome the system of record?
- OI-58: Can the Purchase Management vendor master be used alone as a vendor directory Members read, or is a Custom module needed?
