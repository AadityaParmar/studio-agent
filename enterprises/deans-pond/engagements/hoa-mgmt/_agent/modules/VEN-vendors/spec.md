# VEN — Vendors

Prefix: VEN
Name: Vendors
Status: needs-revisit
Sources: RFP-1, QA-1, QA-2

## 1 Purpose and KPIs

- Purpose: Maintain a directory of vendors used or recommended by the HOA. [RFP-1]
- KPI: One trusted vendor list Members can find; directory kept up to date. [QA-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Add, view and update vendors; maintain vendor documents and identification details |  | [RFP-1] |
| Member | View the vendor directory (read-only) |  | [RFP-1] |

- Headcount: no limit on Board Members or Members; all entries unlimited. [QA-2]
- Members do not see vendor Government ID Proof; Board Members only. [QA-1]

## 3 Process

- Pain: Members need one trusted vendor list they can find, kept up to date. [QA-1]
- Neome is the master vendor list after go-live. [QA-1]
- TO-BE: Board Member adds vendor → vendor information and documents stored → vendor listed in directory → Members view vendor details. [RFP-1]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Vendor | Vendor Name | text | yes |  | [RFP-1] |
| Vendor | Service Type / Category | choice | yes | Fixed list: Landscaping / Plumber / Electrician / Maintenance / Other [QA-1]. Examples: grass cutting / landscaping, plumber, electrician, maintenance, other HOA service providers [RFP-1] | [RFP-1] |
| Vendor | Contact Number | text | yes |  | [RFP-1] |
| Vendor | Email | text | no |  | [RFP-1] |
| Vendor | Address | text | no |  | [RFP-1] |
| Vendor | Government ID Proof | file | yes | sensitive personal information [RFP-1]; any one valid US photo ID: driver's license, state ID or passport; seen by Board Members only [QA-1]; see OI-21 | [RFP-1, QA-1] |
| Vendor | Additional Notes | text | no |  | [RFP-1] |
| Vendor | Status | choice | yes | Values: Active / Inactive [QA-1] | [QA-1] |

- Government ID Proof: any one valid US photo ID: driver's license, state ID or passport. [QA-1]
- Service Type / Category is a fixed list. [QA-1]
- No vendor rating or feedback. [QA-1]

## 5 Statuses

| id | start/end | open (OI) | Source |
|---|---|---|---|
| active | start |  | [QA-1] |
| inactive | end |  | [QA-1] |

| from | to | trigger | Source |
|---|---|---|---|
| active | inactive | Board Member sets Inactive when the HOA stops using the vendor | [QA-1] |
| inactive | active | Board Member reactivates the vendor (proposed, to confirm) |  |

- Stages Active / Inactive; a vendor is set Inactive, not deleted; no approval to add. [QA-1]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Board-only edit | Member opens the vendor directory | No add or edit action offered; read-only | [RFP-1] |
| Government ID Proof restricted | Vendor record opened | Government ID Proof shown to Board Members only | [RFP-1, QA-1] |
| No approval to add | Board Member saves a new vendor | Vendor listed at once; no second Board Member approval | [QA-1] |
| Active vendors only | Member opens the vendor directory | Only Active vendors listed | [QA-1] |

- OI-21: Retention and security of Government ID Proof.

## 7 Exceptions

- HOA stops using a vendor: Board Member sets the vendor Inactive; record and documents kept, not deleted. [QA-1]
- Vendor details change (new number, new ID): Board Member updates the vendor record. [RFP-1]
- A vendor cannot be deleted; it is set Inactive. [QA-1]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Vendors by category | Board Member, Member | Active vendors filtered by Service Type / Category (proposed, to confirm) |  |

- Board dashboard (all Modules): total Members; open tickets and tickets by status; payments due, collected, pending, overdue; upcoming events. [QA-1]

## 9 Integrations

| system | direction | data | owner | Source |
|---|---|---|---|---|
| Neome | in | Vendor directory; Neome is the master after go-live | HOA | [QA-1] |

- Neome is the system of record for vendors after go-live. [QA-1]
- No migration; fresh start. [QA-2]

## 10 Volumes and NFRs

- No limit on vendors; all entries unlimited. [QA-2]
- OI-21: How long Government ID Proof is kept, and its security needs.
- OI-25: US privacy rules for vendor ID documents.

## 11 Requirements

### VEN-01 — Vendor directory fields

Statement: The vendor directory records Vendor Name, Service Type / Category, Contact Number and Government ID Proof (required) and Email, Address and Additional Notes (optional). [RFP-1]
Acceptance:
- A vendor cannot be saved without Vendor Name, Service Type / Category, Contact Number and Government ID Proof. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-19, OI-37
Proposed: no

### VEN-02 — Vendor management

Statement: Board Members can add vendors, view vendors, update vendor information, and maintain vendor documents and identification details. [RFP-1]
Acceptance:
- Board Members can maintain the vendor directory. [RFP-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-37
Proposed: no

### VEN-03 — Member read-only vendor directory

Statement: Members have read-only access to the vendor directory. [RFP-1]
Acceptance:
- Members can access the approved vendor directory. [RFP-1]
- A Member is offered no add or edit action on any vendor. [QA-1]
Priority: Must
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-20, OI-37
Proposed: no

### VEN-04 — Government ID Proof restricted

Statement: Government ID Proof holds sensitive personal information and is shown to Board Members only. [RFP-1, QA-1]
Acceptance:
- A Member viewing a vendor does not see or download its Government ID Proof. [QA-1]
- Government ID Proof is kept and secured per the agreed retention and security rules. [QA-1]
Priority: Must
Scope: Neome TBC
Sources: RFP-1, QA-1
OIs: OI-20, OI-21, OI-25, OI-37
Proposed: no

### VEN-05 — Service categories

Statement: Service Type / Category is picked from a fixed list: Landscaping, Plumber, Electrician, Maintenance, Other. [QA-1]
Acceptance:
- A Board Member picks one category per vendor from the list. [QA-1]
Priority: Should
Scope: Neome
Sources: RFP-1, QA-1
OIs: OI-56, OI-37
Proposed: no

### VEN-06 — Vendor stages

Statement: A vendor is Active or Inactive; a Board Member sets a vendor Inactive when the HOA stops using it, and Members see Active vendors only. [QA-1]
Acceptance:
- An Inactive vendor does not show in the Members' directory and is not deleted. [QA-1]
- A Board Member can set an Inactive vendor Active again. [QA-1]
Priority: Should
Scope: Neome
Sources: QA-1
OIs: OI-55, OI-37
Proposed: no

### VEN-07 — Find vendors by category

Statement: Board Members and Members can filter the vendor directory by Service Type / Category. [QA-1]
Acceptance:
- Picking a category lists only Active vendors of that category. [QA-1]
Priority: Could
Scope: Neome
Sources: QA-1
OIs: OI-56, OI-37
Proposed: no

## 12 Neome mapping

Neome App: `purchase-management`
Delivery: Configuration
How: Vendor → Vendor (vendor master) only, no purchase requests or orders; Service Type / Category as a master list; Government ID Proof as a restricted document field seen by Board Members only; Active / Inactive stages; Members read-only with a category filter on Active vendors; HOA Members as people who are not employees (OI-38); hangs on OI-21, OI-58 (proposed, to confirm)

## 13 Open Items

- OI-25: Which US privacy, security, or HOA regulatory requirements apply?
- OI-38: Can HOA Members (people who are not employees) be set up as users, or is a Custom module needed?
- OI-58: Can the Purchase Management vendor master be used alone as a vendor directory Members read, or is a Custom module needed?
