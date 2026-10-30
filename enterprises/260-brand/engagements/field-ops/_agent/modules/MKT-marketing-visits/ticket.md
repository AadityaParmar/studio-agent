---
status: claimed
prefix: MKT
name: Marketing Visits
blockedBy: [MST]
revisitReason:
formerly:
claimedBy: Aditya Parmar
---

# MKT — Marketing Visits

Name: Marketing Visits

## 1 Purpose and KPIs

- Purpose: Record marketing, school, farm and door to door visits by sales or marketing staff, to track interactions and outcomes. [RFP-1]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Tricycle Rider | Records marketing visits only | | [RFP-1] |
| Sales Agent | Adds marketing, school, farm and door to door visits (per diagrams) | | [RFP-1] |

## 3 Process

- Tricycle Rider: Add Marketing Visit → Marketing Visit Sheet. [RFP-1]
- Marketing visit diagram: Sales Agent: Add Visit (select Beat from Beat Master, select customer from Route Master) → End. [RFP-1]
- School, Farm, Door to door visit diagrams: Sales Agent: Add Visit → End. [RFP-1]
- Schools, Farms, D2D - Nurtamilk marked Pending in RFP-1 scope. [RFP-1]

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Marketing Visit | Date | date | yes | | [RFP-1] |
| Marketing Visit | Visited By | person | yes | | [RFP-1] |
| Marketing Visit | Visit type | choice | no | OI-43 | [RFP-1] |
| Marketing Visit | Route | link-to-entity | no | Auto fill from Beat. Links to: Route | [RFP-1] |
| Marketing Visit | Beat | link-to-entity | no | Links to: Beat | [RFP-1] |
| Marketing Visit | Customer name | text | no | OI-43 | [RFP-1] |
| Marketing Visit | Mobile number | text | no | | [RFP-1] |
| Marketing Visit | Address | text | no | | [RFP-1] |
| Marketing Visit | Email | text | no | | [RFP-1] |
| Marketing Visit | Location | text | no | Auto | [RFP-1] |
| Marketing Visit | Remarks | text | no | | [RFP-1] |
| Marketing Visit | Images | file | no | | [RFP-1] |
| School Visit | Date | date | yes | | [RFP-1] |
| School Visit | Visited By | person | yes | | [RFP-1] |
| School Visit | Procurement officer name | text | no | | [RFP-1] |
| School Visit | School name | text | yes | | [RFP-1] |
| School Visit | Mobile number | text | no | | [RFP-1] |
| School Visit | No of children | number | no | | [RFP-1] |
| School Visit | Head teacher name | text | no | | [RFP-1] |
| School Visit | Area | text | no | | [RFP-1] |
| School Visit | Location | text | no | Auto | [RFP-1] |
| School Visit | Images | file | no | | [RFP-1] |
| Farm Visit | Date | date | yes | | [RFP-1] |
| Farm Visit | Visited By | person | yes | | [RFP-1] |
| Farm Visit | Visitor name | text | no | OI-45 | [RFP-1] |
| Farm Visit | Gender | choice | no | OI-45 | [RFP-1] |
| Farm Visit | Mobile number | text | no | | [RFP-1] |
| Farm Visit | Area | text | no | | [RFP-1] |
| Farm Visit | Number of people in family | number | no | | [RFP-1] |
| Farm Visit | Location | text | no | Auto | [RFP-1] |
| Farm Visit | Camera | file | no | | [RFP-1] |
| Door to door Visit | Date | date | yes | | [RFP-1] |
| Door to door Visit | Visited By | person | yes | | [RFP-1] |
| Door to door Visit | Visitor name | text | no | OI-45 | [RFP-1] |
| Door to door Visit | Gender | choice | no | OI-45 | [RFP-1] |
| Door to door Visit | Mobile number | text | no | | [RFP-1] |
| Door to door Visit | Area | text | no | | [RFP-1] |
| Door to door Visit | Number of people in family | number | no | | [RFP-1] |
| Door to door Visit | Location | text | no | Auto | [RFP-1] |
| Door to door Visit | Camera | file | no | | [RFP-1] |

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Marketing Visit Sheet | | Marketing visits | [RFP-1] |

## 11 Requirements

### MKT-01 — Marketing Visit

Statement: Field staff record a Marketing Visit with the fields in RFP-1 (visit type, Beat, Route auto, customer details, auto Location, remarks, images). [RFP-1]
Acceptance:
- A saved Marketing Visit shows in the Marketing Visit Sheet with location. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-42, OI-43
Proposed: yes

### MKT-02 — Tricycle Rider limited to marketing visits

Statement: A Tricycle Rider can record marketing visits only. [RFP-1]
Acceptance:
- A Tricycle Rider sees no other forms than Marketing Visit. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-05, OI-42
Proposed: yes

### MKT-03 — School Visit

Statement: Field staff record a School Visit with procurement officer, school name, mobile, number of children, head teacher, area, auto Location and images. [RFP-1]
Acceptance:
- A saved School Visit keeps its location and images. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-44
Proposed: yes

### MKT-04 — Farm Visit

Statement: Field staff record a Farm Visit with visitor name, gender, mobile, area, number of people in family, auto Location and camera photo. [RFP-1]
Acceptance:
- A saved Farm Visit keeps its location and photo. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-44, OI-45
Proposed: yes

### MKT-05 — Door to door Visit

Statement: Field staff record a Door to door Visit with visitor name, gender, mobile, area, number of people in family, auto Location and camera photo. [RFP-1]
Acceptance:
- A saved Door to door Visit keeps its location and photo. (proposed, to confirm)
Priority: TBC
Scope: Open
Sources: RFP-1
OIs: OI-44, OI-45
Proposed: yes

## 13 Open Items

- OI-42: Who does Marketing Visits (Tricycle Rider / Sales Agent).
- OI-43: Pick customer or type details; Visit type values.
- OI-44: School / Farm / D2D: who, goal; what is D2D - Nurtamilk.
- OI-45: Farm / D2D "Visitor name"; Gender values.
