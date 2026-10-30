---
status: open
prefix: VEN
name: Vendors
draft: true
blockedBy: []
---

# VEN — Vendors

Name: Vendors

## 1 Purpose and KPIs

- Purpose: Maintain a directory of vendors used or recommended by the HOA. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Board Member | Add, view and update vendors; maintain vendor documents and identification details |  | [RFP-1] |
| Member | View the vendor directory (read-only) |  | [RFP-1] |

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Vendor | Vendor Name | text | yes |  | [RFP-1] |
| Vendor | Service Type / Category | text | yes | examples: grass cutting / landscaping, plumber, electrician, maintenance, other HOA service providers | [RFP-1] |
| Vendor | Contact Number | text | yes |  | [RFP-1] |
| Vendor | Email | text | no |  | [RFP-1] |
| Vendor | Address | text | no |  | [RFP-1] |
| Vendor | Government ID Proof | file | yes | sensitive personal information [RFP-1]; see OI-19, OI-20, OI-21 | [RFP-1] |
| Vendor | Additional Notes | text | no |  | [RFP-1] |

## 11 Requirements

### VEN-01 — Vendor directory fields

Statement: The vendor directory records Vendor Name, Service Type / Category, Contact Number and Government ID Proof (required) and Email, Address and Additional Notes (optional). [RFP-1]
Acceptance:
- A vendor cannot be saved without Vendor Name, Service Type / Category, Contact Number and Government ID Proof. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-19
Proposed: yes

### VEN-02 — Vendor management

Statement: Board Members can add vendors, view vendors, update vendor information, and maintain vendor documents and identification details. [RFP-1]
Acceptance:
- Board Members can maintain the vendor directory. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
Proposed: no

### VEN-03 — Member read-only vendor directory

Statement: Members have read-only access to the vendor directory. [RFP-1]
Acceptance:
- Members can access the approved vendor directory. [RFP-1]
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-20
Proposed: no

## 13 Open Items

- OI-19: Which government ID proof types should be collected for vendors?
- OI-20: Should Members be allowed to view vendor government ID documents, or should these remain Board-only? (Access Control Matrix says Member Yes; §9.3 says access must be confirmed)
- OI-21: What are the document retention and security requirements for vendor government ID documents?
- OI-22: Is vendor rating or feedback required?
